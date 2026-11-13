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
  runRelightWeatherPass,
  runRemoveBgPlugin,
  runRestoreFacesPlugin,
  runTiledUpscalePass,
} from "@/lib/cv-pipeline";
import {
  normalizeQueueStatus,
  type IopaintOutpaintPad,
  type OutpaintRatio,
  type RelightPreset,
  type UpscaleFactor,
} from "@/lib/engines";
import { pickServerFallbackPlate, synthesizeFallbackComposite } from "@/lib/fallback-render";
import { enhancePlate, generatePlate, generateVariations, inpaintPlate, outpaintPlate, relightPlate } from "@/lib/generate";
import { useOriel } from "@/lib/store";

let queueStopRequested = false;

export function useGenerate() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const setPlate = useOriel((state) => state.setPlate);
  const setVariations = useOriel((state) => state.setVariations);
  const upload = useOriel((state) => state.upload);
  const sketchDataUrl = useOriel((state) => state.sketchDataUrl);
  const maskDataUrl = useOriel((state) => state.maskDataUrl);
  const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
  const conditioningChannels = useOriel((state) => state.conditioningChannels);
  const houseStyles = useOriel((state) => state.houseStyles);
  const plate = useOriel((state) => state.plate);
  const touchRecent = useOriel((state) => state.touchRecent);
  const activeKey = useOriel((state) => state.activeKey);
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const scene3d = useOriel((state) => state.scene3d);
  const midLayerPreset = useOriel((state) => state.midLayerPreset);
  const dictionaryBlocks = useOriel((state) => state.dictionaryBlocks);
  const dictionaryParams = useOriel((state) => state.dictionaryParams);
  const idea = useOriel((state) => state.idea);
  const frame = useOriel((state) => state.frame);
  const credits = useOriel((state) => state.credits);
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
    const studyId = activeKey.startsWith("study:") ? activeKey.slice(6) : undefined;
    const templateId = activeKey.startsWith("template:")
      ? activeKey.slice(9)
      : studyId
        ? undefined
        : (TEMPLATES.find((item) => item.scope === design.vertical) ?? TEMPLATES[0])?.id;
    const sourceId = studyId ?? templateId ?? design.vertical;
    return { studyId, templateId, sourceId };
  }

  function buildConditioningPayload() {
    const st = useOriel.getState();
    const activeStyle = st.houseStyles.find((h) => h.id === st.engine.houseStyleId);
    const toDataOnly = (v: string | null | undefined) => (v && v.startsWith("data:image/") ? v : undefined);
    return {
      depthImage: toDataOnly(st.conditioningChannels.depth),
      normalImage: toDataOnly(st.conditioningChannels.normal),
      clayImage: toDataOnly(st.conditioningChannels.clay),
      annotatorImage: toDataOnly(st.conditioningChannels.annotator),
      styleRefImage: toDataOnly(st.engine.refMatrix.massing.url ?? st.engine.ipAdapterRefUrl),
      materialRefImage: toDataOnly(st.engine.refMatrix.material.url),
      lightingRefImage: toDataOnly(st.engine.refMatrix.lighting.url),
      houseStyleDirective: activeStyle?.promptDirective,
    };
  }

  async function generate(mode: "plate" | "variation" = "plate") {
    if (busy) return;
    if (mode === "plate" && engine.outputMode === "grid-4") {
      await generateGrid();
      return;
    }
    if (credits < PLATE_COST) {
      toast.error("Not enough credits.");
      return;
    }
    const { studyId, templateId, sourceId } = resolveRefs();
    const note =
      mode === "variation"
        ? `${idea} Offer one distinct alternative. Keep the same brief.`.trim()
        : idea;
    setBusy(true);
    pushChat("you", note || `${design.vertical} plate`);
    try {
      const result = await generatePlate({
        data: {
          templateId,
          studyId,
          idea: note,
          image: upload ?? undefined,
          sketchImage: sketchDataUrl ?? undefined,
          maskImage: maskDataUrl ?? undefined,
          ...buildConditioningPayload(),
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine,
          scene3d,
        },
      });
      setCredits(result.credits);
      let finalUrl = result.url;
      if (result.fallback && (upload || sketchDataUrl)) {
        finalUrl = await synthesizeFallbackComposite({
          baseImage: upload ?? undefined,
          sketchImage: sketchDataUrl ?? undefined,
          maskImage: maskDataUrl ?? undefined,
          serverFallbackUrl: result.url,
          design,
          engine,
          scene3d,
          variantIndex: mode === "variation" ? 1 : 0,
        });
      }
      setPlate({
        url: finalUrl,
        upload: upload ?? undefined,
        templateId: sourceId,
        idea: idea.trim(),
        fallback: result.fallback,
        seed: result.seed,
        summary: result.summary,
      });
      touchRecent(sourceId);
      pushLog({
        title: `${design.look} · ${design.vertical}${midLayerPreset ? ` (${midLayerPreset})` : ""}`,
        model: "flux",
        text: result.summary ?? (note || "Rendered architectural plate"),
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      pushChat(
        "studio",
        result.fallback
          ? `Studio preview plate ready (Seed #${result.seed}).`
          : `Plate is ready. ${result.credits.toLocaleString()} credits left.`,
      );
      if ("warning" in result && typeof result.warning === "string" && result.warning) {
        toast.message(result.warning);
      }
      if (pathname !== "/") void navigate({ to: "/" });
    } catch (error) {
      const wallet = await getStudioCredits().catch(() => null);
      setCredits(wallet?.credits ?? credits);
      toast.error(error instanceof Error ? error.message : "Generation failed.");
      pushChat("studio", "That plate did not come back. The credits were returned.");
    } finally {
      setBusy(false);
    }
  }

  async function runLiveDraftPreview(draftSource?: string) {
    const st = useOriel.getState();
    const base = draftSource ?? st.sketchDataUrl ?? st.upload ?? st.plate?.url;
    if (!base || st.busy) return;
    const fallbackUrl = pickServerFallbackPlate(st.design, st.engine, st.engine.seed);
    const draftUrl = await synthesizeFallbackComposite({
      baseImage: base,
      sketchImage: st.sketchDataUrl ?? undefined,
      serverFallbackUrl: fallbackUrl,
      design: st.design,
      engine: st.engine,
      scene3d: st.scene3d,
      variantIndex: 0,
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
    if (busy) return;
    const { studyId, templateId, sourceId } = resolveRefs();
    setBusy(true);
    pushChat("you", `4-Up Concept Grid · ${idea || design.look}`);
    try {
      const result = await generateVariations({
        data: {
          templateId,
          studyId,
          idea,
          image: upload ?? undefined,
          sketchImage: sketchDataUrl ?? undefined,
          ...buildConditioningPayload(),
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine,
          scene3d,
        },
      });
      setCredits(result.credits);
      let urls = result.urls;
      if (result.fallback && (upload || sketchDataUrl)) {
        urls = await Promise.all(
          result.urls.map((serverUrl, idx) =>
            synthesizeFallbackComposite({
              baseImage: upload ?? undefined,
              sketchImage: sketchDataUrl ?? undefined,
              serverFallbackUrl: serverUrl,
              design,
              engine,
              scene3d,
              variantIndex: idx,
            }),
          ),
        );
      }
      setVariations(urls);
      if (urls[0]) {
        setPlate({
          url: urls[0],
          upload: upload ?? undefined,
          templateId: sourceId,
          idea: idea.trim(),
          fallback: result.fallback,
          seed: result.seed,
        });
      }
      pushLog({
        title: `4-Up Concept Grid · ${design.look}`,
        model: "midjourney",
        text: idea.trim() || "4-quadrant architectural exploration",
      });
      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "grid" }));
      pushChat("studio", "4-up architectural concept grid ready. Click any quadrant to promote.");
      if ("warning" in result && typeof result.warning === "string" && result.warning) {
        toast.message(result.warning);
      } else {
        toast.success("4-Up concept grid ready");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Variation grid failed.");
    } finally {
      setBusy(false);
    }
  }

  async function applyInpaint(inpaintNote: string) {
    if (busy) return;
    const targetBase = plate?.url ?? upload;
    if (!targetBase) {
      toast.message("Load a source image, 3D snapshot, or generated plate first.");
      return;
    }
    if (!maskDataUrl) {
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
      const effectiveMask = await refineMaskBuffer(maskDataUrl, {
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

      const result = await inpaintPlate({
        data: {
          idea: effectiveNote,
          image: targetBase,
          maskImage: effectiveMask,
          exampleRefImage: exampleRef,
          ...buildConditioningPayload(),
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine,
          scene3d,
        },
      });
      setCredits(result.credits);

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
        title: `${taskLabel} · ${engine.samPrompt || design.target}`,
        model: "gpt",
        text: effectiveNote || "Localized mask edit applied",
      });
      if (engine.iopaintTask !== "erase") {
        window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
      } else {
        setMaskDataUrl(null);
      }
      if ("warning" in result && typeof result.warning === "string" && result.warning) {
        toast.message(result.warning);
      } else {
        toast.success(`${taskLabel} applied cleanly`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "IOPaint inpaint failed.");
    } finally {
      setBusy(false);
    }
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
      const result = await inpaintPlate({
        data: {
          idea: `Outpaint directional border T:${pad.top} R:${pad.right} B:${pad.bottom} L:${pad.left}px. ${idea}`.trim(),
          image: paddedUrl,
          maskImage: borderMask,
          ...buildConditioningPayload(),
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
          model: "sam",
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
          model: "sam",
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
      const result = await enhancePlate({
        data: {
          idea,
          image: targetBase,
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine: nextEngine,
          scene3d,
        },
      });
      setCredits(result.credits);
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
      const result = await relightPlate({
        data: {
          idea,
          image: targetBase,
          ...buildConditioningPayload(),
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine: nextEngine,
          scene3d,
        },
      });
      setCredits(result.credits);
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
      const result = await outpaintPlate({
        data: {
          idea,
          image: targetBase,
          dictionaryBlocks,
          dictionaryParams,
          design,
          frame,
          engine: nextEngine,
          scene3d,
        },
      });
      setCredits(result.credits);
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
    try {
      const nextDesign = job.light ? { ...st.design, light: job.light as typeof st.design.light } : st.design;
      const nextScene3D = {
        ...st.scene3d,
        ...(job.cameraPreset ? { cameraPreset: job.cameraPreset } : {}),
      };
      const nextEngine = {
        ...st.engine,
        workflowPreset: job.preset,
      };
      const promptLine = [st.idea, job.promptNote, job.label].filter(Boolean).join(" · ").slice(0, 1100);
      const result = await generatePlate({
        data: {
          idea: promptLine,
          image: st.upload ?? undefined,
          sketchImage: st.sketchDataUrl ?? undefined,
          ...buildConditioningPayload(),
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
      const finalUrl =
        result.fallback && (st.upload || st.sketchDataUrl)
          ? await synthesizeFallbackComposite({
              baseImage: st.upload ?? undefined,
              sketchImage: st.sketchDataUrl ?? undefined,
              serverFallbackUrl: result.url,
              design: nextDesign,
              engine: nextEngine,
              scene3d: nextScene3D,
              variantIndex,
            })
          : result.url;
      useOriel.getState().updateQueueItem(job.id, "completed", finalUrl);
      useOriel.getState().pushLog({
        title: `Batch Pass · ${job.label}`,
        model: "flux",
        text: `${job.light}${job.cameraPreset ? ` · Cam: ${job.cameraPreset}` : ""}`,
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
    enqueueRender(label, engine.workflowPreset, lightOverride ?? design.light, { status: "pending" });
    await runSequentialQueue();
  }

  async function runThreeLightBatch() {
    enqueueBatchMatrix([
      { label: `${design.look} · Daylight`, preset: engine.workflowPreset, light: "Daylight" },
      { label: `${design.look} · Golden Hour`, preset: engine.workflowPreset, light: "Golden hour" },
      { label: `${design.look} · Dusk / Evening`, preset: engine.workflowPreset, light: "Evening" },
    ]);
    await runSequentialQueue();
  }

  async function queueBatchMatrix(mode: "sun-study" | "camera-matrix", autoStart = true) {
    const specs = buildBatchMatrixSpecs({
      mode,
      preset: engine.workflowPreset,
      look: design.look,
    });
    enqueueBatchMatrix(specs);
    if (autoStart) {
      await runSequentialQueue();
    } else {
      toast.success(`Queued ${specs.length} scenes for sequential processing`);
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
  };
}
