import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { buildBatchMatrixSpecs } from "@/lib/archviz-suite";
import { TEMPLATES } from "@/lib/catalog";
import { PLATE_COST, getStudioCredits } from "@/lib/credits";
import {
  refineMaskBuffer,
  runClientOutpaintCanvas,
  runDirectionalOutpaintPad,
  runLocalAnyText,
  runLocalLamaErasePass,
  runLocalPaintByExample,
  runLocalTextureReplacePass,
  runRelightWeatherPass,
  runRemoveBgPlugin,
  runRestoreFacesPlugin,
  runTiledUpscalePass,
  toCompactDataUrlForSegmentation,
} from "@/lib/cv-pipeline";
import {
  normalizeQueueStatus,
  type IopaintOutpaintPad,
  type OutpaintRatio,
  type RelightPreset,
  type UpscaleFactor,
} from "@/lib/engines";
import { pickServerFallbackPlate, synthesizeFallbackComposite } from "@/lib/fallback-render";
import {
  enhancePlate,
  generatePlate,
  generateVariations,
  inpaintPlate,
  outpaintPlate,
  relightPlate,
  segmentObjectWithSam2,
} from "@/lib/generate";
import {
  callNanoBananaApi,
  continueNanoBananaSessionApi,
  resolveRuntimeModelOverride,
  type OrchestrationResponseClient,
} from "@/lib/nano-banana-client";
import { compileSentencePrompt } from "@/lib/presets-catalog";
import { rewritePromptForUploadedImage } from "@/lib/preset-transform";
import { formatPaiseShort } from "@/lib/budget-guard";
import { useOriel } from "@/lib/store";

let queueStopRequested = false;
let renderSequence = 0;

function resolveEffectiveStudioPrompt(
  st: ReturnType<typeof useOriel.getState>,
  rawOverride?: string,
): string {
  const baseText = (rawOverride ?? st.idea).trim();
  const hasMatrixPills = st.activePresetIds.length > 0 || st.negativePresetIds.length > 0;
  let merged = baseText;
  if (hasMatrixPills) {
    const compiled = compileSentencePrompt({
      baseIdea: baseText,
      activePresetIds: st.activePresetIds,
      negativePresetIds: st.negativePresetIds,
      presetStrengths: st.presetStrengths,
      questionPicks: st.questionPicks,
      design: st.design,
      engine: st.engine,
      preserveClause: st.designContract.lockedPreserve ? st.designContract.preserveClause : undefined,
    });
    merged = compiled.sentence;
  }
  return rewritePromptForUploadedImage(merged || `${st.design.look} ${st.design.vertical} architectural finish`, {
    hasUpload: Boolean(st.upload),
    design: st.design,
    preserveClause: st.designContract.lockedPreserve ? st.designContract.preserveClause : undefined,
  });
}

async function compactPayloadDataUrl(value: string | null | undefined, maxLength = 2_200_000): Promise<string | undefined> {
  if (!value) return undefined;
  const isDataImage = value.startsWith("data:image/");
  if (isDataImage && (value.length <= maxLength || typeof document === "undefined")) return value;
  if (typeof document === "undefined") return undefined;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      if (!isDataImage && !value.startsWith("blob:")) {
        el.crossOrigin = "anonymous";
      }
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode failed"));
      el.src = value;
    });
    const maxEdge = 1600;
    const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round((img.naturalWidth || 1280) * scale));
    canvas.height = Math.max(1, Math.round((img.naturalHeight || 720) * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return isDataImage ? value : undefined;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const compacted = canvas.toDataURL("image/jpeg", 0.86);
    if (!isDataImage) return compacted;
    return compacted.length < value.length ? compacted : value;
  } catch {
    return isDataImage ? value : undefined;
  }
}

export function useGenerate() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setPlate = useOriel((state) => state.setPlate);
  const upload = useOriel((state) => state.upload);
  const sketchDataUrl = useOriel((state) => state.sketchDataUrl);
  const maskDataUrl = useOriel((state) => state.maskDataUrl);
  const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
  const binaryMaskDataUrl = useOriel((state) => state.binaryMaskDataUrl);
  const setBinaryMaskData = useOriel((state) => state.setBinaryMaskData);
  const conditioningChannels = useOriel((state) => state.conditioningChannels);
  const houseStyles = useOriel((state) => state.houseStyles);
  const plate = useOriel((state) => state.plate);
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const scene3d = useOriel((state) => state.scene3d);
  const dictionaryBlocks = useOriel((state) => state.dictionaryBlocks);
  const dictionaryParams = useOriel((state) => state.dictionaryParams);
  const idea = useOriel((state) => state.idea);
  const frame = useOriel((state) => state.frame);
  const setCredits = useOriel((state) => state.setCredits);
  const busy = useOriel((state) => state.busy);
  const setBusy = useOriel((state) => state.setBusy);
  const batchRunning = useOriel((state) => state.batchRunning);
  const setBatchRunning = useOriel((state) => state.setBatchRunning);
  const pushChat = useOriel((state) => state.pushChat);
  const pushLog = useOriel((state) => state.pushLog);
  const enqueueRender = useOriel((state) => state.enqueueRender);
  const enqueueBatchMatrix = useOriel((state) => state.enqueueBatchMatrix);
  const setEngineField = useOriel((state) => state.setEngineField);

  function resolveRefs() {
    const st = useOriel.getState();
    const studyId = st.activeKey.startsWith("study:") ? st.activeKey.slice(6) : undefined;
    const templateId = st.activeKey.startsWith("template:")
      ? st.activeKey.slice(9)
      : studyId
        ? undefined
        : (TEMPLATES.find((item) => item.scope === st.design.vertical) ?? TEMPLATES[0])?.id;
    const sourceId = studyId ?? templateId ?? st.design.vertical;
    return { studyId, templateId, sourceId };
  }

  async function buildConditioningPayload() {
    const st = useOriel.getState();
    const activeStyle = st.houseStyles.find((h) => h.id === st.engine.houseStyleId);
    const hasUploadedPhoto = Boolean(st.upload);
    const [depthImage, normalImage, clayImage, annotatorImage, styleRefImage, materialRefImage, lightingRefImage] =
      await Promise.all([
        hasUploadedPhoto ? Promise.resolve(undefined) : compactPayloadDataUrl(st.conditioningChannels.depth),
        hasUploadedPhoto ? Promise.resolve(undefined) : compactPayloadDataUrl(st.conditioningChannels.normal),
        hasUploadedPhoto ? Promise.resolve(undefined) : compactPayloadDataUrl(st.conditioningChannels.clay),
        hasUploadedPhoto ? Promise.resolve(undefined) : compactPayloadDataUrl(st.conditioningChannels.annotator),
        compactPayloadDataUrl(st.engine.refMatrix.massing.url ?? st.engine.ipAdapterRefUrl),
        compactPayloadDataUrl(st.engine.refMatrix.material.url),
        compactPayloadDataUrl(st.engine.refMatrix.lighting.url),
      ]);
    return {
      depthImage,
      normalImage,
      clayImage,
      annotatorImage,
      styleRefImage,
      materialRefImage,
      lightingRefImage,
      houseStyleDirective: activeStyle?.promptDirective,
    };
  }

  async function generate(mode: "plate" | "variation" = "plate") {
    const st = useOriel.getState();
    if (st.busy) return;
    if (mode === "plate" && st.engine.outputMode === "grid-4") {
      await generateGrid();
      return;
    }
    if (st.credits < PLATE_COST) {
      toast.error("Not enough credits.");
      return;
    }
    const { studyId, templateId, sourceId } = resolveRefs();
    const resolvedPrompt = resolveEffectiveStudioPrompt(st);
    const note =
      mode === "variation"
        ? `${resolvedPrompt} Offer one distinct material or lighting variation while preserving the exact same geometry.`.trim()
        : resolvedPrompt;
    st.setBusy(true);
    st.pushChat("you", st.idea.trim() || `${st.design.vertical} plate`);
    try {
      const [compactImage, compactSketch, compactMask, conditioning] = await Promise.all([
        compactPayloadDataUrl(st.upload),
        compactPayloadDataUrl(st.sketchDataUrl),
        compactPayloadDataUrl(st.maskDataUrl),
        buildConditioningPayload(),
      ]);
      const result = await generatePlate({
        data: {
          templateId,
          studyId,
          idea: note,
          image: compactImage,
          sketchImage: compactSketch,
          maskImage: compactMask,
          ...conditioning,
          dictionaryBlocks: st.dictionaryBlocks,
          dictionaryParams: st.dictionaryParams,
          design: st.design,
          frame: st.frame,
          engine: st.engine,
          scene3d: st.scene3d,
          nanoBananaModel: resolveRuntimeModelOverride(st.nanoBanana.requestedModel),
          nanoBananaResolution:
            st.nanoBanana.resolution === "512" ||
            st.nanoBanana.resolution === "1K" ||
            st.nanoBanana.resolution === "2K" ||
            st.nanoBanana.resolution === "4K"
              ? st.nanoBanana.resolution
              : "1K",
          budgetCostMode: st.budget.costMode,
          budgetCapPaise: st.budget.capPaise,
          budgetMaxPerImagePaise: st.budget.maxPerImagePaise,
        },
      });
      st.setCredits(result.credits);
      if ("budget" in result && result.budget) {
        st.setBudgetState(result.budget);
      }
      if (!st.engine.seedLocked && typeof result.seed === "number") {
        st.setEngineField("seed", result.seed);
      }
      const iteration = renderSequence++;
      let finalUrl = result.url;
      if (result.fallback) {
        finalUrl = await synthesizeFallbackComposite({
          baseImage: st.upload ?? st.sketchDataUrl ?? undefined,
          sketchImage: st.sketchDataUrl ?? undefined,
          maskImage: st.maskDataUrl ?? undefined,
          serverFallbackUrl: result.url,
          design: st.design,
          engine: st.engine,
          scene3d: st.scene3d,
          idea: note,
          variantIndex: mode === "variation" ? 1 : 0,
          renderIteration: iteration,
        });
      }
      st.setPlate({
        url: finalUrl,
        upload: st.upload ?? undefined,
        templateId: sourceId,
        idea: st.idea.trim(),
        fallback: result.fallback,
        seed: result.seed,
        summary: result.summary,
      });
      st.touchRecent(sourceId);
      st.pushLog({
        title: `${st.design.look} · ${st.design.vertical}${st.midLayerPreset ? ` (${st.midLayerPreset})` : ""}`,
        model: "flux",
        text: result.summary ?? (note || "Rendered architectural plate"),
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      const costTag = formatPaiseShort(result.costPaise);
      st.pushChat(
        "studio",
        result.fallback
          ? `Free (0p) Studio preview ready (Seed #${result.seed}).`
          : `Nano Banana 2.1 plate ready (${costTag} billed · ${result.credits.toLocaleString()} CR left).`,
      );
      if ("warning" in result && typeof result.warning === "string" && result.warning) {
        toast.message(result.warning);
      } else {
        toast.success(result.fallback ? "Free (₹0) Studio preview rendered" : `Plate rendered (${costTag})`);
      }
      if (pathname !== "/") void navigate({ to: "/" });
    } catch (error) {
      const wallet = await getStudioCredits().catch(() => null);
      st.setCredits(wallet?.credits ?? st.credits);
      toast.error(error instanceof Error ? error.message : "Generation failed.");
      st.pushChat("studio", "That plate did not come back. The credits were returned.");
    } finally {
      useOriel.getState().setBusy(false);
    }
  }

  async function runLiveDraftPreview(draftSource?: string) {
    const st = useOriel.getState();
    const base = draftSource ?? st.sketchDataUrl ?? st.upload ?? st.plate?.url;
    if (!base || st.busy) return;
    const fallbackUrl = pickServerFallbackPlate(st.design, st.engine, st.engine.seed, 0, st.idea);
    const draftUrl = await synthesizeFallbackComposite({
      baseImage: base,
      sketchImage: st.sketchDataUrl ?? undefined,
      serverFallbackUrl: fallbackUrl,
      design: st.design,
      engine: st.engine,
      scene3d: st.scene3d,
      idea: st.idea,
      variantIndex: 0,
      renderIteration: renderSequence,
    });
    st.setPlate({
      url: draftUrl,
      upload: st.upload ?? undefined,
      templateId: st.engine.workflowPreset,
      idea: st.idea.trim() || "Live stream draft",
      fallback: true,
      seed: st.engine.seed,
      summary: "Live Krea-style low-latency draft",
    });
  }

  async function generateGrid() {
    const st = useOriel.getState();
    if (st.busy) return;
    const { studyId, templateId, sourceId } = resolveRefs();
    st.setBusy(true);
    st.pushChat("you", `4-Up Concept Grid · ${st.idea || st.design.look}`);
    try {
      const [compactImage, compactSketch, conditioning] = await Promise.all([
        compactPayloadDataUrl(st.upload),
        compactPayloadDataUrl(st.sketchDataUrl),
        buildConditioningPayload(),
      ]);
      const gridPrompt = resolveEffectiveStudioPrompt(st);
      const result = await generateVariations({
        data: {
          templateId,
          studyId,
          idea: gridPrompt,
          image: compactImage,
          sketchImage: compactSketch,
          ...conditioning,
          dictionaryBlocks: st.dictionaryBlocks,
          dictionaryParams: st.dictionaryParams,
          design: st.design,
          frame: st.frame,
          engine: st.engine,
          scene3d: st.scene3d,
          nanoBananaModel: resolveRuntimeModelOverride(st.nanoBanana.requestedModel),
          nanoBananaResolution:
            st.nanoBanana.resolution === "512" ||
            st.nanoBanana.resolution === "1K" ||
            st.nanoBanana.resolution === "2K" ||
            st.nanoBanana.resolution === "4K"
              ? st.nanoBanana.resolution
              : "1K",
          budgetCostMode: st.budget.costMode,
          budgetCapPaise: st.budget.capPaise,
          budgetMaxPerImagePaise: st.budget.maxPerImagePaise,
        },
      });
      st.setCredits(result.credits);
      if ("budget" in result && result.budget) {
        st.setBudgetState(result.budget);
      }
      const iteration = renderSequence++;
      let urls = result.urls;
      if (result.fallback) {
        urls = await Promise.all(
          result.urls.map((serverUrl, idx) =>
            synthesizeFallbackComposite({
              baseImage: st.upload ?? st.sketchDataUrl ?? undefined,
              sketchImage: st.sketchDataUrl ?? undefined,
              serverFallbackUrl: serverUrl,
              design: st.design,
              engine: st.engine,
              scene3d: st.scene3d,
              idea: st.idea,
              variantIndex: idx,
              renderIteration: iteration,
            }),
          ),
        );
      }
      st.setVariations(urls);
      if (urls[0]) {
        st.setPlate({
          url: urls[0],
          upload: st.upload ?? undefined,
          templateId: sourceId,
          idea: st.idea.trim(),
          fallback: result.fallback,
          seed: result.seed,
        });
      }
      st.pushLog({
        title: `4-Up Concept Grid · ${st.design.look}`,
        model: "midjourney",
        text: st.idea.trim() || "4-quadrant architectural exploration",
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "grid" }));
      st.pushChat("studio", "4-up architectural concept grid ready. Click any quadrant to promote.");
      if ("warning" in result && typeof result.warning === "string" && result.warning) {
        toast.message(result.warning);
      } else {
        toast.success("4-Up concept grid ready");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Variation grid failed.");
    } finally {
      useOriel.getState().setBusy(false);
    }
  }

  async function applyInpaint(inpaintNote: string) {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Load a source image, 3D snapshot, or generated plate first.");
      return;
    }
    const activeMask = maskDataUrl ?? binaryMaskDataUrl;
    if (!activeMask) {
      toast.message("Paint a region mask or use SAM click-mask first.");
      return;
    }
    const { sourceId } = resolveRefs();
    setBusy(true);
    const taskLabel =
      engine.iopaintTask === "erase"
        ? `IOPaint Erase (${engine.iopaintModel})`
        : engine.iopaintTask === "anytext"
          ? `IOPaint AnyText: "${engine.iopaintAnyText || inpaintNote}"`
          : engine.iopaintTask === "paint-by-example"
            ? "IOPaint Paint-by-Example"
            : `IOPaint ${engine.iopaintModel}`;
    pushChat("you", `${taskLabel}: ${inpaintNote || engine.iopaintAnyText || idea || "Localized edit"}`);
    try {
      const effectiveMask = await refineMaskBuffer(activeMask, {
        dilatePx: engine.iopaintMaskDilate,
        invert: engine.iopaintInvertMask,
      });
      const exampleRef =
        engine.iopaintTask === "paint-by-example" &&
        engine.iopaintExampleUrl &&
        engine.iopaintExampleUrl.startsWith("data:image/")
          ? engine.iopaintExampleUrl
          : undefined;
      const effectiveNote =
        engine.iopaintTask === "anytext"
          ? engine.iopaintAnyText || inpaintNote
          : inpaintNote || (engine.iopaintTask === "erase" ? "Clean object removal" : idea);

      const conditioning = await buildConditioningPayload();
      const curBudget = useOriel.getState().budget;
      const result = await inpaintPlate({
        data: {
          idea: effectiveNote,
          image: await compactPayloadDataUrl(targetBase),
          maskImage: await compactPayloadDataUrl(binaryMaskDataUrl ?? effectiveMask),
          exampleRefImage: await compactPayloadDataUrl(exampleRef),
          ...conditioning,
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine,
          scene3d,
          nanoBananaModel: resolveRuntimeModelOverride(useOriel.getState().nanoBanana.requestedModel),
          nanoBananaResolution: "1K",
          budgetCostMode: curBudget.costMode,
          budgetCapPaise: curBudget.capPaise,
          budgetMaxPerImagePaise: curBudget.maxPerImagePaise,
        },
      });
      setCredits(result.credits);
      if ("budget" in result && result.budget) {
        useOriel.getState().setBudgetState(result.budget);
      }

      let finalUrl = result.url;
      if (result.fallback) {
        if (engine.iopaintTask === "erase") {
          finalUrl = await runLocalLamaErasePass(targetBase, effectiveMask, engine.iopaintModel);
        } else if (engine.iopaintTask === "anytext") {
          finalUrl = await runLocalAnyText(targetBase, effectiveMask, engine.iopaintAnyText || inpaintNote);
        } else if (engine.iopaintTask === "paint-by-example" && engine.iopaintExampleUrl) {
          finalUrl = await runLocalPaintByExample(
            targetBase,
            effectiveMask,
            engine.iopaintExampleUrl,
            engine.inpaintStrength,
          );
        } else if (engine.iopaintTask === "replace") {
          finalUrl = await runLocalTextureReplacePass(
            targetBase,
            effectiveMask,
            effectiveNote || "Honed Travertine",
            engine.inpaintStrength,
          );
        } else {
          finalUrl = await synthesizeFallbackComposite({
            baseImage: targetBase,
            maskImage: effectiveMask,
            serverFallbackUrl: result.url,
            design,
            engine,
            scene3d,
            variantIndex: 1,
          });
        }
      }

      setPlate({
        url: finalUrl,
        upload: upload ?? targetBase,
        templateId: sourceId,
        idea: effectiveNote,
        fallback: result.fallback,
        seed: result.seed,
      });
      pushLog({
        title: `${taskLabel} · ${result.modelUsed ?? engine.iopaintModel}`,
        model: "gpt",
        text: `${engine.samPrompt || design.target}: ${effectiveNote || "Localized edit"}`,
      });
      setMaskDataUrl(null);
      setBinaryMaskData(null, null);
      if ("warning" in result && typeof result.warning === "string" && result.warning) {
        toast.message(result.warning);
      } else {
        toast.success(`${taskLabel} applied (${result.fallback ? "IOPaint local engine" : "Server model"})`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "IOPaint inpaint failed.");
    } finally {
      setBusy(false);
    }
  }

  async function segmentGroundedSam2(
    targetPrompt: string,
    srcOverride?: string,
    clickPoint?: { xNorm: number; yNorm: number },
  ) {
    const baseSrc = srcOverride ?? plate?.url ?? upload ?? "/viz/t03-compact-living-room.jpg";
    setEngineField("samPrompt", targetPrompt);
    const compactDataUrl = await toCompactDataUrlForSegmentation(baseSrc);
    return segmentObjectWithSam2({
      data: {
        image: compactDataUrl,
        prompt: targetPrompt,
        clickPoint,
      },
    });
  }

  async function applyDirectionalOutpaint(padOverride?: IopaintOutpaintPad) {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Load a source image or generate a plate first to outpaint.");
      return;
    }
    const pad = padOverride ?? engine.iopaintOutpaintPad;
    const nextEngine = {
      ...engine,
      iopaintTask: "outpaint" as const,
      iopaintOutpaintPad: pad,
    };
    setEngineField("iopaintOutpaintPad", pad);
    const { sourceId } = resolveRefs();
    setBusy(true);
    try {
      const { paddedUrl, maskDataUrl: borderMask } = await runDirectionalOutpaintPad(targetBase, pad);
      const conditioning = await buildConditioningPayload();
      const result = await inpaintPlate({
        data: {
          idea: `Outpaint directional border T:${pad.top} R:${pad.right} B:${pad.bottom} L:${pad.left}px. ${idea}`.trim(),
          image: await compactPayloadDataUrl(paddedUrl),
          maskImage: await compactPayloadDataUrl(borderMask),
          ...conditioning,
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine: nextEngine,
          scene3d,
        },
      });
      setCredits(result.credits);
      const finalUrl = result.fallback ? paddedUrl : result.url;
      setPlate({
        url: finalUrl,
        upload: upload ?? targetBase,
        templateId: sourceId,
        idea: `${idea} (Outpaint +${pad.left}/${pad.right}/${pad.top}/${pad.bottom}px)`.trim(),
        fallback: result.fallback,
        seed: result.seed,
      });
      pushLog({
        title: `IOPaint Outpaint Pad · T${pad.top} R${pad.right} B${pad.bottom} L${pad.left}`,
        model: "flux",
        text: `Seamless directional frame extension via ${engine.iopaintModel}`,
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      toast.success("Directional Outpaint canvas applied");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Directional Outpaint failed.");
    } finally {
      setBusy(false);
    }
  }

  async function applyRemoveBgPlugin(outputMode: "cutout" | "mask") {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Load a source image or generate a plate first.");
      return;
    }
    const { sourceId } = resolveRefs();
    setBusy(true);
    try {
      const { url, maskDataUrl: bgMask } = await runRemoveBgPlugin(
        targetBase,
        engine.iopaintRemoveBgModel,
        outputMode,
      );
      if (outputMode === "mask") {
        setMaskDataUrl(bgMask);
        pushLog({
          title: `IOPaint RemoveBG → Mask (${engine.iopaintRemoveBgModel})`,
          model: "gemini",
          text: "Generated inverse background replacement mask",
        });
        window.dispatchEvent(new CustomEvent("oriel-view", { detail: "mask" }));
        toast.success(`Background mask created via ${engine.iopaintRemoveBgModel}`);
      } else {
        setPlate({
          url,
          upload: upload ?? targetBase,
          templateId: sourceId,
          idea: `${idea} (Subject Cutout)`.trim(),
          fallback: true,
        });
        pushLog({
          title: `IOPaint RemoveBG Cutout (${engine.iopaintRemoveBgModel})`,
          model: "gemini",
          text: "Isolated primary foreground subject with alpha channel",
        });
        window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
        toast.success(`Subject isolated via ${engine.iopaintRemoveBgModel}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "RemoveBG plugin failed.");
    } finally {
      setBusy(false);
    }
  }

  async function applyRestoreFacesPlugin() {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Load a source image or generate a plate first.");
      return;
    }
    const { sourceId } = resolveRefs();
    setBusy(true);
    try {
      const restoredUrl = await runRestoreFacesPlugin(targetBase, engine.iopaintFaceModel);
      setPlate({
        url: restoredUrl,
        upload: upload ?? targetBase,
        templateId: sourceId,
        idea: `${idea} (${engine.iopaintFaceModel.toUpperCase()} Restore)`.trim(),
        fallback: true,
      });
      pushLog({
        title: `IOPaint Restore Faces (${engine.iopaintFaceModel})`,
        model: "gemini",
        text: "Refined scale-figure faces & crisp fixture micro-detail",
      });
      toast.success(`Restored details via ${engine.iopaintFaceModel}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Restore Faces failed.");
    } finally {
      setBusy(false);
    }
  }

  async function applyEnhance(factorOverride?: UpscaleFactor) {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Generate or upload a plate first to enhance.");
      return;
    }
    const nextFactor = factorOverride ?? engine.upscaleFactor;
    if (factorOverride) setEngineField("upscaleFactor", factorOverride);
    const nextEngine = { ...engine, upscaleFactor: nextFactor };
    const { sourceId } = resolveRefs();
    setBusy(true);
    try {
      const curBudget = useOriel.getState().budget;
      const result = await enhancePlate({
        data: {
          idea,
          image: await compactPayloadDataUrl(targetBase),
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine: nextEngine,
          scene3d,
          nanoBananaModel: resolveRuntimeModelOverride(useOriel.getState().nanoBanana.requestedModel),
          nanoBananaResolution: "1K",
          budgetCostMode: curBudget.costMode,
          budgetCapPaise: curBudget.capPaise,
          budgetMaxPerImagePaise: curBudget.maxPerImagePaise,
        },
      });
      setCredits(result.credits);
      if ("budget" in result && result.budget) {
        useOriel.getState().setBudgetState(result.budget);
      }
      const finalUrl = result.fallback
        ? await runTiledUpscalePass(targetBase, nextFactor, engine.esrganModel, engine.esrganDenoise, engine.esrganFaceEnhance)
        : result.url;
      setPlate({
        url: finalUrl,
        upload: upload ?? targetBase,
        templateId: sourceId,
        idea: idea.trim(),
        fallback: result.fallback,
      });
      pushLog({
        title: `Tiled Super-Res ${nextFactor}× · ${engine.esrganModel}`,
        model: "gemini",
        text: `${engine.enhanceMode}${engine.esrganFaceEnhance ? " · Edge & Fixture Restore" : ""}`,
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      if ("warning" in result && typeof result.warning === "string" && result.warning) {
        toast.message(result.warning);
      } else {
        toast.success(`Enhanced ${nextFactor}× via ${engine.esrganModel}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Enhance pass failed.");
    } finally {
      setBusy(false);
    }
  }

  async function applyRelight(preset: Exclude<RelightPreset, "none">) {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Load a source image or generate a plate first to relight.");
      return;
    }
    setEngineField("relightPreset", preset);
    const nextEngine = { ...engine, relightPreset: preset };
    const { sourceId } = resolveRefs();
    setBusy(true);
    try {
      const conditioning = await buildConditioningPayload();
      const curBudget = useOriel.getState().budget;
      const result = await relightPlate({
        data: {
          idea,
          image: await compactPayloadDataUrl(targetBase),
          ...conditioning,
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine: nextEngine,
          scene3d,
          nanoBananaModel: resolveRuntimeModelOverride(useOriel.getState().nanoBanana.requestedModel),
          nanoBananaResolution: "1K",
          budgetCostMode: curBudget.costMode,
          budgetCapPaise: curBudget.capPaise,
          budgetMaxPerImagePaise: curBudget.maxPerImagePaise,
        },
      });
      setCredits(result.credits);
      if ("budget" in result && result.budget) {
        useOriel.getState().setBudgetState(result.budget);
      }
      const finalUrl = result.fallback ? await runRelightWeatherPass(targetBase, preset) : result.url;
      setPlate({
        url: finalUrl,
        upload: upload ?? targetBase,
        templateId: sourceId,
        idea: `${idea} (${preset})`.trim(),
        fallback: result.fallback,
        seed: result.seed,
      });
      pushLog({
        title: `AI Relight · ${preset}`,
        model: "flux",
        text: "Consistent geometry lock preserved during solar/weather transform",
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      toast.success(`Relight applied: ${preset}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Relight failed.");
    } finally {
      setBusy(false);
    }
  }

  async function applyOutpaint(ratio: Exclude<OutpaintRatio, "none">) {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Load or render an image first to outpaint.");
      return;
    }
    setEngineField("outpaintRatio", ratio);
    const nextEngine = { ...engine, outpaintRatio: ratio };
    const { sourceId } = resolveRefs();
    setBusy(true);
    try {
      const curBudget = useOriel.getState().budget;
      const result = await outpaintPlate({
        data: {
          idea,
          image: await compactPayloadDataUrl(targetBase),
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine: nextEngine,
          scene3d,
          nanoBananaModel: resolveRuntimeModelOverride(useOriel.getState().nanoBanana.requestedModel),
          nanoBananaResolution: "1K",
          budgetCostMode: curBudget.costMode,
          budgetCapPaise: curBudget.capPaise,
          budgetMaxPerImagePaise: curBudget.maxPerImagePaise,
        },
      });
      setCredits(result.credits);
      if ("budget" in result && result.budget) {
        useOriel.getState().setBudgetState(result.budget);
      }
      const finalUrl = result.fallback ? await runClientOutpaintCanvas(targetBase, ratio) : result.url;
      setPlate({
        url: finalUrl,
        upload: upload ?? targetBase,
        templateId: sourceId,
        idea: `${idea} (Outpaint ${ratio})`.trim(),
        fallback: result.fallback,
        seed: result.seed,
      });
      pushLog({
        title: `Canvas Uncrop · ${ratio}`,
        model: "midjourney",
        text: `Expanded canvas aspect to ${ratio}`,
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      toast.success(`Canvas outpainted to ${ratio}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Outpaint failed.");
    } finally {
      setBusy(false);
    }
  }

  async function processSingleQueueJob(jobId: string) {
    const st = useOriel.getState();
    const job = st.queue.find((q) => q.id === jobId);
    if (!job) return;
    st.updateQueueItem(job.id, "processing");
    const stepStart = performance.now();
    try {
      const nextDesign = job.light ? { ...st.design, light: job.light as typeof st.design.light } : st.design;
      const nextScene3D = {
        ...st.scene3d,
        ...(job.cameraPreset ? { cameraPreset: job.cameraPreset } : {}),
        ...(typeof job.sunHour === "number" ? { geoEnabled: true, geoHour: job.sunHour } : {}),
      };
      const nextEngine = {
        ...st.engine,
        workflowPreset: job.preset,
      };
      const promptLine = [st.idea, job.promptNote, job.label].filter(Boolean).join(" · ").slice(0, 1100);
      const conditioning = await buildConditioningPayload();
      const result = await generatePlate({
        data: {
          idea: promptLine,
          image: await compactPayloadDataUrl(st.upload),
          sketchImage: await compactPayloadDataUrl(st.sketchDataUrl),
          ...conditioning,
          dictionaryBlocks: st.dictionaryBlocks,
          dictionaryParams: st.dictionaryParams,
          design: nextDesign,
          frame: st.frame,
          engine: nextEngine,
          scene3d: nextScene3D,
        },
      });
      st.setCredits(result.credits);
      const variantIndex = job.light === "Evening" ? 2 : job.light === "Golden hour" ? 1 : 0;
      const finalUrl = result.fallback
        ? await synthesizeFallbackComposite({
            baseImage: st.upload ?? st.sketchDataUrl ?? undefined,
            sketchImage: st.sketchDataUrl ?? undefined,
            serverFallbackUrl: result.url,
            design: nextDesign,
            engine: nextEngine,
            scene3d: nextScene3D,
            idea: promptLine,
            variantIndex,
            renderIteration: renderSequence++,
          })
        : result.url;
      // Ensure local fallback renders remain observable as Processing for at least 220ms
      const elapsed = performance.now() - stepStart;
      if (elapsed < 220) {
        await new Promise((resolve) => window.setTimeout(resolve, 220 - elapsed));
      }
      useOriel.getState().updateQueueItem(job.id, "completed", finalUrl);
      useOriel.getState().pushLog({
        title: `Batch Pass · ${job.label}`,
        model: "flux",
        text: `${job.light}${job.cameraPreset ? ` · Cam: ${job.cameraPreset}` : ""}${typeof job.sunHour === "number" ? ` · ${job.sunHour.toFixed(1)}h` : ""}`,
      });
    } catch (error) {
      useOriel.getState().updateQueueItem(job.id, "error", undefined, {
        errorMessage: error instanceof Error ? error.message : "Batch job failed",
      });
    }
  }

  async function runSequentialQueue() {
    if (useOriel.getState().batchRunning) return;
    queueStopRequested = false;
    setBatchRunning(true);
    let completedCount = 0;
    try {
      while (!queueStopRequested) {
        const nextPending = useOriel
          .getState()
          .queue.find((item) => normalizeQueueStatus(item.status) === "pending");
        if (!nextPending) break;
        await processSingleQueueJob(nextPending.id);
        completedCount++;
      }
      if (completedCount > 0) {
        toast.success(`Batch queue finished (${completedCount} scene${completedCount === 1 ? "" : "s"})`);
      }
    } finally {
      setBatchRunning(false);
    }
  }

  function stopSequentialQueue() {
    queueStopRequested = true;
    toast.message("Stopping batch queue after current scene…");
  }

  async function queueAndRunBatch(label: string, lightOverride?: string) {
    const thumb = plate?.url ?? upload ?? sketchDataUrl ?? undefined;
    enqueueRender(label, engine.workflowPreset, lightOverride ?? design.light, { status: "pending", thumbnailUrl: thumb });
    await runSequentialQueue();
  }

  async function runThreeLightBatch() {
    const thumb = plate?.url ?? upload ?? sketchDataUrl ?? undefined;
    enqueueBatchMatrix([
      { label: `${design.look} · Daylight`, preset: engine.workflowPreset, light: "Daylight", thumbnailUrl: thumb },
      { label: `${design.look} · Golden Hour`, preset: engine.workflowPreset, light: "Golden hour", thumbnailUrl: thumb },
      { label: `${design.look} · Dusk / Evening`, preset: engine.workflowPreset, light: "Evening", thumbnailUrl: thumb },
    ]);
    await runSequentialQueue();
  }

  async function queueBatchMatrix(mode: "sun-study" | "camera-matrix", autoStart = true) {
    const thumb = plate?.url ?? upload ?? sketchDataUrl ?? undefined;
    const specs = buildBatchMatrixSpecs({
      mode,
      preset: engine.workflowPreset,
      look: design.look,
    }).map((spec) => ({ ...spec, thumbnailUrl: thumb }));
    enqueueBatchMatrix(specs);
    if (autoStart) {
      await runSequentialQueue();
    } else {
      toast.success(`Queued ${specs.length} scenes for sequential processing`);
    }
  }

  async function runOrchestratedGeneration(options?: {
    confirmConflicts?: boolean;
    promptOverride?: string;
  }): Promise<OrchestrationResponseClient | null> {
    const st = useOriel.getState();
    if (st.busy) return null;
    st.setBusy(true);
    try {
      const nb = st.nanoBanana;
      const baseImage = await compactPayloadDataUrl(st.upload ?? st.plate?.url ?? st.sketchDataUrl);
      const compactMask = await compactPayloadDataUrl(st.maskDataUrl);
      const [styleRef, matRef, lightRef] = await Promise.all([
        compactPayloadDataUrl(st.engine.refMatrix.massing.url ?? st.engine.ipAdapterRefUrl),
        compactPayloadDataUrl(st.engine.refMatrix.material.url),
        compactPayloadDataUrl(st.engine.refMatrix.lighting.url),
      ]);

      const references: Array<{
        imageUrl: string;
        referenceType: string;
        priority: number;
        label: string;
      }> = [];

      if (baseImage) {
        references.push({
          imageUrl: baseImage,
          referenceType: "geometry_reference",
          priority: 1,
          label: "Primary Studio Architecture",
        });
      }
      if (styleRef) {
        references.push({
          imageUrl: styleRef,
          referenceType: "design_reference",
          priority: 2,
          label: "Massing & Style Reference",
        });
      }
      if (matRef) {
        references.push({
          imageUrl: matRef,
          referenceType: "material_reference",
          priority: 3,
          label: "Material Reference",
        });
      }
      if (lightRef) {
        references.push({
          imageUrl: lightRef,
          referenceType: "lighting_reference",
          priority: 4,
          label: "Lighting Reference",
        });
      }

      const effectiveMode =
        nb.generationMode === "multi_reference" && references.length < 2
          ? references.length > 0
            ? "image_edit"
            : "text_to_image"
          : (nb.generationMode === "image_edit" ||
                nb.generationMode === "image_to_image" ||
                nb.generationMode === "style_transfer" ||
                nb.generationMode === "render_enhancement") &&
              references.length === 0
            ? "text_to_image"
            : nb.generationMode;

      const endpoint =
        effectiveMode === "multi_reference"
          ? "/api/v1/images/multi-reference"
          : effectiveMode === "image_edit" ||
              effectiveMode === "image_to_image" ||
              effectiveMode === "style_transfer" ||
              effectiveMode === "render_enhancement"
            ? "/api/v1/images/edit"
            : "/api/v1/images/generate";

      const materials = Object.values(st.design.picks).filter(
        (v) => v && v !== "Unchanged" && v !== "None" && v !== "Keep",
      );

      const promptText = resolveEffectiveStudioPrompt(
        st,
        options?.promptOverride ??
          (st.idea.trim() ||
            `Transform architectural scene into ${nb.architecturalStyle.replace(/_/g, " ")} ${nb.buildingType.replace(/_/g, " ")} with ${st.design.light.toLowerCase()} lighting.`),
      );

      const res = await callNanoBananaApi(endpoint, {
        projectId: "default-studio",
        generationMode: effectiveMode,
        requestedModel: nb.requestedModel,
        prompt: promptText,
        imageUrl: baseImage,
        maskImageUrl: compactMask,
        references,
        sessionId: nb.activeSessionId ?? undefined,
        confirmConflicts: Boolean(options?.confirmConflicts),
        design: {
          buildingType: nb.buildingType,
          style: st.design.look,
          architecturalStyle: nb.architecturalStyle,
          renderStyle: nb.renderStyle,
          materials: materials.slice(0, 10),
          lighting: st.design.light.toLowerCase().replace(/\s+/g, "_"),
          weather: st.design.weather.toLowerCase().replace(/\s+/g, "_"),
          vegetation: "curated architectural landscaping",
          camera: st.scene3d.cameraPreset,
          lensMm: st.scene3d.focalLength,
          twoPointPerspective: st.scene3d.twoPointTilt,
        },
        constraints: nb.constraints,
        output: {
          format: "png",
          quality: nb.resolution === "4K" ? "premium" : nb.resolution === "512" ? "draft" : "high",
          resolution: nb.resolution,
          aspectRatio: nb.aspectRatio,
          renderText: false,
        },
      });

      st.setLastOrchestration(res);
      if (res.sessionId) {
        st.updateNanoBanana({ activeSessionId: res.sessionId });
      }

      if (res.status === "needs_confirmation") {
        toast.warning("Architectural policy conflict detected — confirm in 12-Stage Trace to proceed.");
        return res;
      }
      if (res.status === "blocked") {
        toast.error("Request blocked by studio structural/safety policy.");
        return res;
      }

      if (res.outputImageUrl) {
        let displayUrl = res.outputImageUrl;
        if (res.fallbackUsed) {
          displayUrl = await synthesizeFallbackComposite({
            baseImage: st.upload ?? st.sketchDataUrl ?? undefined,
            sketchImage: st.sketchDataUrl ?? undefined,
            maskImage: st.maskDataUrl ?? undefined,
            serverFallbackUrl: res.outputImageUrl,
            design: st.design,
            engine: st.engine,
            scene3d: st.scene3d,
            idea: promptText,
            variantIndex: 0,
            renderIteration: renderSequence++,
          });
        }
        st.setPlate({
          url: displayUrl,
          upload: st.upload ?? undefined,
          templateId: res.generationMode,
          idea: promptText,
          fallback: res.fallbackUsed,
          summary: `${res.modelDisplayName} · Score ${res.evaluation.totalScore}/100 (${res.evaluation.status})`,
        });
        st.pushLog({
          title: `${res.modelDisplayName} · ${res.evaluation.totalScore}/100`,
          model: "gemini",
          text: `${res.traceId} · ${res.routing.routingRule}`,
        });
        window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
        toast.success(
          res.fallbackUsed
            ? `Orchestrated preview ready (${res.evaluation.totalScore}/100)`
            : `${res.modelDisplayName} render complete (${res.evaluation.totalScore}/100)`,
        );
      }
      return res;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Orchestrated generation failed.");
      return null;
    } finally {
      useOriel.getState().setBusy(false);
    }
  }

  async function continueIterativeSession(
    instruction: string,
    confirmConflicts = false,
  ): Promise<OrchestrationResponseClient | null> {
    const st = useOriel.getState();
    const sessionId = st.nanoBanana.activeSessionId;
    if (!sessionId) {
      return runOrchestratedGeneration({ promptOverride: instruction, confirmConflicts });
    }
    if (st.busy) return null;
    st.setBusy(true);
    try {
      const res = await continueNanoBananaSessionApi(sessionId, {
        projectId: "default-studio",
        prompt: instruction,
        requestedModel: st.nanoBanana.requestedModel,
        constraints: st.nanoBanana.constraints,
        output: {
          resolution: st.nanoBanana.resolution,
          aspectRatio: st.nanoBanana.aspectRatio,
        },
        confirmConflicts,
      });
      st.setLastOrchestration(res);
      if (res.outputImageUrl) {
        st.setPlate({
          url: res.outputImageUrl,
          upload: st.upload ?? undefined,
          templateId: "iterative_editing",
          idea: instruction,
          fallback: res.fallbackUsed,
          summary: `${res.modelDisplayName} · Session Turn · ${res.evaluation.totalScore}/100`,
        });
        window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
        toast.success(`Session ${sessionId} updated (${res.evaluation.totalScore}/100)`);
      }
      return res;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Iterative session continuation failed.");
      return null;
    } finally {
      useOriel.getState().setBusy(false);
    }
  }

  return {
    busy,
    batchRunning,
    conditioningChannels,
    houseStyles,
    generate,
    generateGrid,
    applyInpaint,
    segmentGroundedSam2,
    applyDirectionalOutpaint,
    applyRemoveBgPlugin,
    applyRestoreFacesPlugin,
    applyEnhance,
    applyRelight,
    applyOutpaint,
    runLiveDraftPreview,
    runSequentialQueue,
    stopSequentialQueue,
    queueAndRunBatch,
    runThreeLightBatch,
    queueBatchMatrix,
    runOrchestratedGeneration,
    continueIterativeSession,
  };
}
