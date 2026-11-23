import { createServerFn } from "@tanstack/react-start";
import { PLATE_COST } from "@/lib/credits";
import { TEMPLATES } from "@/lib/catalog";
import { STUDIES } from "@/lib/studies";
import { assembleBrief, sanitizeDesign, type DesignState } from "@/lib/properties";
import { sanitizeFrame, type Frame } from "@/lib/frame";
import {
  compileEngineBrief,
  sanitizeEngineState,
  sanitizeScene3DState,
  type EngineState,
  type Scene3DState,
} from "@/lib/engines";
import { pickFourFallbackPlates, pickServerFallbackPlate } from "@/lib/fallback-render";
import { buildUploadedImageSystemPrefix } from "@/lib/preset-transform";
import type { BudgetCostMode } from "@/lib/budget-guard";

type Input = {
  idea: string;
  image?: string;
  sketchImage?: string;
  maskImage?: string;
  depthImage?: string;
  normalImage?: string;
  clayImage?: string;
  annotatorImage?: string;
  styleRefImage?: string;
  materialRefImage?: string;
  lightingRefImage?: string;
  exampleRefImage?: string;
  houseStyleDirective?: string;
  templateId?: string;
  studyId?: string;
  dictionaryBlocks?: string[];
  dictionaryParams?: Record<string, Record<string, string>>;
  design: DesignState;
  frame: Frame;
  engine: EngineState;
  scene3d: Scene3DState;
  nanoBananaModel?: string;
  nanoBananaResolution?: "512" | "1K" | "2K" | "4K";
  budgetCostMode?: BudgetCostMode;
  budgetCapPaise?: number;
  budgetMaxPerImagePaise?: number;
};

function cleanDataUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("data:image/")) return undefined;
  if (value.length > 6_500_000) throw new Error("That image is too large. Try a smaller photo under 5 MB.");
  return value;
}

export function formatCloudFallbackWarning(providerErrors: readonly string[], hasAuthError: boolean): string | undefined {
  if (hasAuthError) {
    return "Cloud AI key unavailable — rendered Studio preview composite. Verify your billing-enabled key in Settings > Secrets for live cloud rendering.";
  }
  const first = providerErrors.find((msg) => msg.trim().length > 0);
  return first ? `${first} Showing Studio preview composite.` : undefined;
}

function cleanDictionaryBlocks(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((id): id is string => typeof id === "string" && id.length <= 64).slice(0, 64);
}

function cleanDictionaryParams(value: unknown): Record<string, Record<string, string>> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const out: Record<string, Record<string, string>> = {};
  for (const [blockId, entry] of Object.entries(value as Record<string, unknown>).slice(0, 32)) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const row: Record<string, string> = {};
    for (const [k, v] of Object.entries(entry as Record<string, unknown>).slice(0, 12)) {
      if (typeof v === "string") row[k.slice(0, 40)] = v.slice(0, 400);
    }
    if (Object.keys(row).length > 0) out[blockId.slice(0, 64)] = row;
  }
  return out;
}

function parseInput(input: unknown): Input {
  const data = input as Record<string, unknown>;
  const idea = typeof data.idea === "string" ? data.idea.trim().slice(0, 1200) : "";
  return {
    idea,
    image: cleanDataUrl(data.image),
    sketchImage: cleanDataUrl(data.sketchImage),
    maskImage: cleanDataUrl(data.maskImage),
    depthImage: cleanDataUrl(data.depthImage),
    normalImage: cleanDataUrl(data.normalImage),
    clayImage: cleanDataUrl(data.clayImage),
    annotatorImage: cleanDataUrl(data.annotatorImage),
    styleRefImage: cleanDataUrl(data.styleRefImage),
    materialRefImage: cleanDataUrl(data.materialRefImage),
    lightingRefImage: cleanDataUrl(data.lightingRefImage),
    exampleRefImage: cleanDataUrl(data.exampleRefImage),
    houseStyleDirective: typeof data.houseStyleDirective === "string" ? data.houseStyleDirective.slice(0, 500) : undefined,
    templateId: typeof data.templateId === "string" ? data.templateId.slice(0, 80) : undefined,
    studyId: typeof data.studyId === "string" ? data.studyId.slice(0, 80) : undefined,
    dictionaryBlocks: cleanDictionaryBlocks(data.dictionaryBlocks),
    dictionaryParams: cleanDictionaryParams(data.dictionaryParams),
    design: sanitizeDesign(data.design as Partial<DesignState> | undefined),
    frame: sanitizeFrame(data.frame as Partial<Frame> | undefined),
    engine: sanitizeEngineState(data.engine as Partial<EngineState> | undefined),
    scene3d: sanitizeScene3DState(data.scene3d as Partial<Scene3DState> | undefined),
    nanoBananaModel:
      typeof data.nanoBananaModel === "string" &&
      ["gemini-nano-banana-2.1", "gemini-3.1-flash-lite-image", "gemini-3-pro-image"].includes(data.nanoBananaModel)
        ? data.nanoBananaModel
        : undefined,
    nanoBananaResolution:
      data.nanoBananaResolution === "512" ||
      data.nanoBananaResolution === "1K" ||
      data.nanoBananaResolution === "2K" ||
      data.nanoBananaResolution === "4K"
        ? data.nanoBananaResolution
        : undefined,
    budgetCostMode:
      data.budgetCostMode === "free-only" ||
      data.budgetCostMode === "paise-eco" ||
      data.budgetCostMode === "pro-unlocked"
        ? data.budgetCostMode
        : undefined,
    budgetCapPaise:
      typeof data.budgetCapPaise === "number" && Number.isFinite(data.budgetCapPaise)
        ? Math.max(0, Math.min(500_000, Math.round(data.budgetCapPaise)))
        : undefined,
    budgetMaxPerImagePaise:
      typeof data.budgetMaxPerImagePaise === "number" && Number.isFinite(data.budgetMaxPerImagePaise)
        ? Math.max(30, Math.min(2000, Math.round(data.budgetMaxPerImagePaise)))
        : undefined,
  };
}

function libraryPrompt(data: Input): string | undefined {
  if (data.studyId) return STUDIES.find((item) => item.id === data.studyId)?.prompt;
  if (data.templateId) return TEMPLATES.find((item) => item.id === data.templateId)?.prompt;
  return undefined;
}

function budgetClientOverride(data: Input) {
  if (
    data.budgetCostMode === undefined &&
    data.budgetCapPaise === undefined &&
    data.budgetMaxPerImagePaise === undefined
  ) {
    return undefined;
  }
  return {
    ...(data.budgetCostMode ? { costMode: data.budgetCostMode } : {}),
    ...(typeof data.budgetCapPaise === "number" ? { capPaise: data.budgetCapPaise } : {}),
    ...(typeof data.budgetMaxPerImagePaise === "number" ? { maxPerImagePaise: data.budgetMaxPerImagePaise } : {}),
  };
}

function geminiAttachments(
  data: Input,
  plan?: {
    effectiveModel: string;
    effectiveResolution: "512" | "1K" | "2K" | "4K";
    timeoutMs: number;
    maxPromptChars: number;
    maxReferences: number;
  },
) {
  const isUploadedPhotoEdit = Boolean(data.image);
  return {
    sourceImage: data.image ?? data.sketchImage,
    sketchImage: data.sketchImage,
    maskImage: data.maskImage,
    depthImage: isUploadedPhotoEdit ? undefined : data.depthImage,
    normalImage: isUploadedPhotoEdit ? undefined : data.normalImage,
    clayImage: isUploadedPhotoEdit ? undefined : data.clayImage,
    annotatorImage: isUploadedPhotoEdit ? undefined : data.annotatorImage,
    styleRefImage: data.styleRefImage,
    materialRefImage: data.materialRefImage,
    lightingRefImage: data.lightingRefImage,
    exampleRefImage: data.exampleRefImage,
    lockSourceAspect: isUploadedPhotoEdit,
    geometryLock: data.engine.geometryLock,
    modelOverride: plan?.effectiveModel ?? data.nanoBananaModel,
    imageSizeOverride: plan?.effectiveResolution ?? data.nanoBananaResolution,
    timeoutMs: plan?.timeoutMs,
    maxPromptChars: plan?.maxPromptChars,
    maxReferences: plan?.maxReferences,
  };
}

async function callXaiImage(key: string, prompt: string, frame: Frame, sourceImage?: string): Promise<string> {
  const endpoint = sourceImage ? "https://api.x.ai/v1/images/edits" : "https://api.x.ai/v1/images/generations";
  const body = sourceImage
    ? { model: "grok-imagine-image", prompt, image: { url: sourceImage, type: "image_url" }, aspect_ratio: frame.ratio, resolution: frame.resolution }
    : { model: "grok-imagine-image", prompt, aspect_ratio: frame.ratio, resolution: frame.resolution };
  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(25000),
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail.replace(/sk-[a-zA-Z0-9_-]+/g, "").slice(0, 180) || "Generation failed.");
  }
  const json = (await response.json()) as { data?: { url?: string }[] };
  const url = json.data?.[0]?.url;
  if (!url) throw new Error("No image came back.");
  return url;
}

export const generatePlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const { dictionaryBrief } = await import("@/lib/blocks.server");
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
      hasSketch: Boolean(data.sketchImage),
      hasMask: Boolean(data.maskImage),
      hasUploadedImage: Boolean(data.image),
      frame: data.frame,
    });
    const uploadLockPrefix = data.image ? buildUploadedImageSystemPrefix(data.engine.geometryLock) : undefined;
    const prompt = [
      uploadLockPrefix,
      assembleBrief(data.design, data.idea, data.image ? undefined : libraryPrompt(data), {
        hasUploadedImage: Boolean(data.image),
      }),
      data.houseStyleDirective,
      compiled.prompt,
      dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams),
    ]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 8000);

    const { hasNvidiaKey, generateImageWithNvidia } = await import("@/lib/nvidia-vision.server");
    const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const { planServerBudgetRender, recordServerRenderOutcome } = await import("@/lib/budget-guard.server");
    const { plan } = await planServerBudgetRender({
      requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
      requestedResolution: data.nanoBananaResolution ?? (data.frame.resolution === "2k" ? "2K" : "1K"),
      imageCount: 1,
      clientOverride: budgetClientOverride(data),
    });

    const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
    const geminiEnabled = hasGeminiKey();
    const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : undefined;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");

    if (!plan.useCloud) {
      const [wallet, budget] = await Promise.all([
        readWallet().catch(() => ({ credits: 4500 })),
        recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
      ]);
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
        cost: 0,
        costPaise: 0,
        credits: wallet.credits,
        budget,
        budgetBlocked: plan.blockedByCap,
        frame: data.frame,
        fallback: true,
        seed: compiled.seed,
        summary: compiled.parametersSummary,
        ...(plan.notice ? { warning: plan.notice } : {}),
      };
    }

    if (!nvidiaEnabled && !geminiEnabled && !xaiKey) {
      const [wallet, budget] = await Promise.all([
        readWallet().catch(() => ({ credits: 4500 })),
        recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
      ]);
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
        cost: 0,
        costPaise: 0,
        credits: wallet.credits,
        budget,
        frame: data.frame,
        fallback: true,
        seed: compiled.seed,
        summary: compiled.parametersSummary,
      };
    }

    const wallet = await charge(PLATE_COST, data.image ? "edit" : "plate");
    const providerErrors: string[] = [];
    let hasAuthError = false;

    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(prompt.slice(0, plan.maxPromptChars), data.frame, geminiAttachments(data, plan));
        const budget = await recordServerRenderOutcome({
          billedPaise: plan.totalCostPaise,
          liveImages: 1,
          freeImages: 0,
        });
        return {
          url,
          cost: PLATE_COST,
          costPaise: plan.totalCostPaise,
          credits: wallet.credits,
          budget,
          frame: data.frame,
          fallback: false,
          seed: compiled.seed,
          summary: `${compiled.parametersSummary} · ${plan.effectiveModel} (${plan.effectiveResolution} · ${plan.totalCostPaise}p)`,
          ...(plan.clampedForEco && plan.notice ? { warning: plan.notice } : {}),
        };
      } catch (error) {
        if (isGeminiAuthError(error)) hasAuthError = true;
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }

    if (nvidiaEnabled) {
      try {
        const url = await generateImageWithNvidia(prompt, data.frame, {
          seed: compiled.seed,
          fast: data.engine.renderFidelity === "draft",
          depthImage: data.depthImage,
          annotatorImage: data.annotatorImage,
          sketchImage: data.sketchImage,
          sourceImage: data.image,
        });
        const budget = await recordServerRenderOutcome({
          billedPaise: plan.totalCostPaise,
          liveImages: 1,
          freeImages: 0,
        });
        return {
          url,
          cost: PLATE_COST,
          costPaise: plan.totalCostPaise,
          credits: wallet.credits,
          budget,
          frame: data.frame,
          fallback: false,
          seed: compiled.seed,
          summary: compiled.parametersSummary,
        };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }

    if (xaiKey) {
      try {
        const source = data.image ?? data.sketchImage;
        const url = await callXaiImage(xaiKey, prompt, data.frame, source);
        const budget = await recordServerRenderOutcome({
          billedPaise: plan.totalCostPaise,
          liveImages: 1,
          freeImages: 0,
        });
        return {
          url,
          cost: PLATE_COST,
          costPaise: plan.totalCostPaise,
          credits: wallet.credits,
          budget,
          frame: data.frame,
          fallback: false,
          seed: compiled.seed,
          summary: compiled.parametersSummary,
        };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }

    await refund(PLATE_COST, "plate-refund").catch(() => undefined);
    const [refreshed, budget] = await Promise.all([
      readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST })),
      recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
    ]);
    const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
    return {
      url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
      cost: 0,
      costPaise: 0,
      credits: refreshed.credits,
      budget,
      frame: data.frame,
      fallback: true,
      seed: compiled.seed,
      summary: compiled.parametersSummary,
      ...(warning ? { warning } : {}),
    };
  });

export const generateVariations = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const { dictionaryBrief } = await import("@/lib/blocks.server");
    const { hasNvidiaKey, generateImageWithNvidia } = await import("@/lib/nvidia-vision.server");
    const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const { planServerBudgetRender, recordServerRenderOutcome } = await import("@/lib/budget-guard.server");
    const { plan } = await planServerBudgetRender({
      requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
      requestedResolution: data.nanoBananaResolution ?? (data.frame.resolution === "2k" ? "2K" : "1K"),
      imageCount: 4,
      clientOverride: budgetClientOverride(data),
    });
    const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
    const geminiEnabled = hasGeminiKey();
    const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : undefined;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");
    const compiled0 = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
      hasSketch: Boolean(data.sketchImage),
      variationIndex: 0,
      frame: data.frame,
    });

    if (!plan.useCloud || (!nvidiaEnabled && !geminiEnabled && !xaiKey)) {
      const [wallet, budget] = await Promise.all([
        readWallet().catch(() => ({ credits: 4500 })),
        recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 4 }),
      ]);
      return {
        urls: pickFourFallbackPlates(data.design, data.engine, compiled0.seed, data.idea),
        fallback: true,
        credits: wallet.credits,
        budget,
        costPaise: 0,
        budgetBlocked: plan.blockedByCap,
        frame: data.frame,
        seed: compiled0.seed,
        ...(plan.notice ? { warning: plan.notice } : {}),
      };
    }

    const batchCost = PLATE_COST * 2;
    const wallet = await charge(batchCost, "variation-grid");
    const buildVariationPrompt = (idx: number) => {
      const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
        hasSketch: Boolean(data.sketchImage),
        hasUploadedImage: Boolean(data.image),
        variationIndex: idx,
        frame: data.frame,
      });
      const uploadLockPrefix = data.image ? buildUploadedImageSystemPrefix(data.engine.geometryLock) : undefined;
      return [
        uploadLockPrefix,
        assembleBrief(data.design, data.idea, data.image ? undefined : libraryPrompt(data), {
          hasUploadedImage: Boolean(data.image),
        }),
        data.houseStyleDirective,
        compiled.prompt,
        dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams),
      ]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, plan.maxPromptChars);
    };

    const providerErrors: string[] = [];
    let hasAuthError = false;

    if (geminiEnabled) {
      try {
        const urls = await Promise.all(
          [0, 1, 2, 3].map((idx) =>
            generateImageWithGemini(buildVariationPrompt(idx), data.frame, geminiAttachments(data, plan)),
          ),
        );
        const budget = await recordServerRenderOutcome({
          billedPaise: plan.totalCostPaise,
          liveImages: 4,
          freeImages: 0,
        });
        return {
          urls,
          fallback: false,
          credits: wallet.credits,
          budget,
          costPaise: plan.totalCostPaise,
          frame: data.frame,
          seed: compiled0.seed,
          ...(plan.clampedForEco && plan.notice ? { warning: plan.notice } : {}),
        };
      } catch (error) {
        if (isGeminiAuthError(error)) hasAuthError = true;
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }

    if (nvidiaEnabled) {
      try {
        const urls = await Promise.all(
          [0, 1, 2, 3].map((idx) =>
            generateImageWithNvidia(buildVariationPrompt(idx), data.frame, {
              seed: compiled0.seed + idx,
              fast: data.engine.renderFidelity === "draft",
              depthImage: data.depthImage,
              annotatorImage: data.annotatorImage,
              sketchImage: data.sketchImage,
              sourceImage: data.image,
            }),
          ),
        );
        const budget = await recordServerRenderOutcome({
          billedPaise: plan.totalCostPaise,
          liveImages: 4,
          freeImages: 0,
        });
        return {
          urls,
          fallback: false,
          credits: wallet.credits,
          budget,
          costPaise: plan.totalCostPaise,
          frame: data.frame,
          seed: compiled0.seed,
        };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }

    if (xaiKey) {
      try {
        const source = data.image ?? data.sketchImage;
        const urls = await Promise.all([0, 1, 2, 3].map((idx) => callXaiImage(xaiKey, buildVariationPrompt(idx), data.frame, source)));
        const budget = await recordServerRenderOutcome({
          billedPaise: plan.totalCostPaise,
          liveImages: 4,
          freeImages: 0,
        });
        return {
          urls,
          fallback: false,
          credits: wallet.credits,
          budget,
          costPaise: plan.totalCostPaise,
          frame: data.frame,
          seed: compiled0.seed,
        };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }

    await refund(batchCost, "grid-refund").catch(() => undefined);
    const [refreshed, budget] = await Promise.all([
      readWallet().catch(() => ({ credits: wallet.credits + batchCost })),
      recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 4 }),
    ]);
    const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
    return {
      urls: pickFourFallbackPlates(data.design, data.engine, compiled0.seed, data.idea),
      fallback: true,
      credits: refreshed.credits,
      budget,
      costPaise: 0,
      frame: data.frame,
      seed: compiled0.seed,
      ...(warning ? { warning } : {}),
    };
  });

export const segmentObjectWithSam2 = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { image?: unknown; prompt?: unknown; clickPoint?: unknown };
    const cp =
      data.clickPoint &&
      typeof data.clickPoint === "object" &&
      typeof (data.clickPoint as { xNorm?: unknown }).xNorm === "number" &&
      typeof (data.clickPoint as { yNorm?: unknown }).yNorm === "number"
        ? {
            xNorm: Math.max(0, Math.min(1, Number((data.clickPoint as { xNorm: number }).xNorm))),
            yNorm: Math.max(0, Math.min(1, Number((data.clickPoint as { yNorm: number }).yNorm))),
          }
        : undefined;
    return {
      image: cleanDataUrl(data.image),
      prompt: typeof data.prompt === "string" ? data.prompt.trim().slice(0, 120) : "architectural element",
      clickPoint: cp,
    };
  })
  .handler(async ({ data }) => {
    const { heuristicSemanticBoxesForPrompt, normalizeGroundedBoxes } = await import("@/lib/cv-pipeline");
    const { hasNvidiaKey, detectGroundedSam2BoxesWithNvidia } = await import("@/lib/nvidia-vision.server");
    const { hasGeminiKey, detectGroundedSam2BoxesWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const prompt = data.prompt || "architectural element";

    if (hasGeminiKey() && data.image) {
      try {
        const boxes = await detectGroundedSam2BoxesWithGemini(data.image, prompt, data.clickPoint);
        if (boxes.length > 0) {
          return {
            boxes: normalizeGroundedBoxes(boxes, prompt),
            fallback: false,
            model: "grounded-sam-2-gemini",
          };
        }
      } catch (error) {
        if (!hasNvidiaKey()) {
          return {
            boxes: heuristicSemanticBoxesForPrompt(prompt),
            fallback: true,
            model: "grounded-sam-2-local",
            ...(!isGeminiAuthError(error)
              ? { warning: error instanceof Error ? error.message : "Server Grounded-SAM 2 fallback used." }
              : {}),
          };
        }
      }
    }

    if (hasNvidiaKey() && data.image) {
      try {
        const boxes = await detectGroundedSam2BoxesWithNvidia(data.image, prompt, data.clickPoint);
        if (boxes.length > 0) {
          return {
            boxes: normalizeGroundedBoxes(boxes, prompt),
            fallback: false,
            model: "grounded-sam-2-nvidia",
          };
        }
      } catch (error) {
        return {
          boxes: heuristicSemanticBoxesForPrompt(prompt),
          fallback: true,
          model: "grounded-sam-2-local",
          warning: error instanceof Error ? error.message : "NVIDIA Grounded-SAM 2 fallback used.",
        };
      }
    }

    return {
      boxes: heuristicSemanticBoxesForPrompt(prompt),
      fallback: true,
      model: "grounded-sam-2-local",
    };
  });

export const inpaintPlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const { dictionaryBrief } = await import("@/lib/blocks.server");
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
      hasMask: true,
      hasUploadedImage: Boolean(data.image),
      inpaintNote: data.idea,
      frame: data.frame,
    });
    const dictSection = dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams);
    const opLabel =
      data.engine.iopaintTask === "erase"
        ? "OBJECT_REMOVAL"
        : data.engine.iopaintTask === "replace"
          ? "TEXTURE_REPLACEMENT"
          : data.engine.iopaintTask === "anytext"
            ? "ANYTEXT_SIGNAGE"
            : data.engine.iopaintTask === "paint-by-example"
              ? "PAINT_BY_EXAMPLE"
              : "DIRECTIONAL_OUTPAINT";
    const iopaintServerHeader = `IOPAINT SERVER PIPELINE · TASK: ${opLabel} · ENGINE MODEL: ${data.engine.iopaintModel}`;
    const fullPrompt = [iopaintServerHeader, data.houseStyleDirective, compiled.prompt, dictSection]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 4200);
    const { hasNvidiaKey, generateImageWithNvidia } = await import("@/lib/nvidia-vision.server");
    const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const { planServerBudgetRender, recordServerRenderOutcome } = await import("@/lib/budget-guard.server");
    const { plan } = await planServerBudgetRender({
      requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
      requestedResolution: data.nanoBananaResolution ?? "1K",
      imageCount: 1,
      clientOverride: budgetClientOverride(data),
    });
    const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
    const geminiEnabled = hasGeminiKey();
    const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : undefined;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");
    if (!plan.useCloud || (!nvidiaEnabled && !geminiEnabled && !xaiKey) || !data.image) {
      const [wallet, budget] = await Promise.all([
        readWallet().catch(() => ({ credits: 4500 })),
        recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
      ]);
      return {
        url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed, 1, data.idea),
        fallback: true,
        credits: wallet.credits,
        budget,
        costPaise: 0,
        frame: data.frame,
        seed: compiled.seed,
        modelUsed: data.engine.iopaintModel,
        operation: data.engine.iopaintTask,
        ...(plan.notice ? { warning: plan.notice } : {}),
      };
    }
    const wallet = await charge(PLATE_COST, "inpaint");
    const providerErrors: string[] = [];
    let hasAuthError = false;
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(fullPrompt.slice(0, plan.maxPromptChars), data.frame, geminiAttachments(data, plan));
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return {
          url,
          fallback: false,
          credits: wallet.credits,
          budget,
          costPaise: plan.totalCostPaise,
          frame: data.frame,
          seed: compiled.seed,
          modelUsed: data.engine.iopaintModel,
          operation: data.engine.iopaintTask,
        };
      } catch (error) {
        if (isGeminiAuthError(error)) hasAuthError = true;
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (nvidiaEnabled) {
      try {
        const url = await generateImageWithNvidia(fullPrompt, data.frame, {
          seed: compiled.seed,
          depthImage: data.depthImage,
          annotatorImage: data.annotatorImage,
          sketchImage: data.sketchImage,
          sourceImage: data.image,
        });
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return {
          url,
          fallback: false,
          credits: wallet.credits,
          budget,
          costPaise: plan.totalCostPaise,
          frame: data.frame,
          seed: compiled.seed,
          modelUsed: `nvidia-flux · ${data.engine.iopaintModel}`,
          operation: data.engine.iopaintTask,
        };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (xaiKey) {
      try {
        const url = await callXaiImage(xaiKey, fullPrompt, data.frame, data.image);
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return {
          url,
          fallback: false,
          credits: wallet.credits,
          budget,
          costPaise: plan.totalCostPaise,
          frame: data.frame,
          seed: compiled.seed,
          modelUsed: data.engine.iopaintModel,
          operation: data.engine.iopaintTask,
        };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    await refund(PLATE_COST, "inpaint-refund").catch(() => undefined);
    const [refreshed, budget] = await Promise.all([
      readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST })),
      recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
    ]);
    const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
    return {
      url: data.image,
      fallback: true,
      credits: refreshed.credits,
      budget,
      costPaise: 0,
      frame: data.frame,
      seed: compiled.seed,
      modelUsed: data.engine.iopaintModel,
      operation: data.engine.iopaintTask,
      ...(warning ? { warning } : {}),
    };
  });

export const enhancePlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const { dictionaryBrief } = await import("@/lib/blocks.server");
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
    const dictSection = dictionaryBrief(data.design.vertical, data.design.advanced, ["upscale-safety", ...(data.dictionaryBlocks ?? [])], data.dictionaryParams);
    const { hasNvidiaKey, generateImageWithNvidia } = await import("@/lib/nvidia-vision.server");
    const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const { planServerBudgetRender, recordServerRenderOutcome } = await import("@/lib/budget-guard.server");
    const { plan } = await planServerBudgetRender({
      requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
      requestedResolution: data.nanoBananaResolution ?? "1K",
      imageCount: 1,
      clientOverride: budgetClientOverride(data),
    });
    const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
    const geminiEnabled = hasGeminiKey();
    const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : undefined;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");
    if (!plan.useCloud || (!nvidiaEnabled && !geminiEnabled && !xaiKey) || !data.image) {
      const [wallet, budget] = await Promise.all([
        readWallet().catch(() => ({ credits: 4500 })),
        recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
      ]);
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
        fallback: true,
        credits: wallet.credits,
        budget,
        costPaise: 0,
        frame: data.frame,
        ...(plan.notice ? { warning: plan.notice } : {}),
      };
    }
    const wallet = await charge(PLATE_COST, "enhance");
    const enhancePrompt = `GENERATIVE TILED SUPER-RESOLUTION (${data.engine.upscaleFactor}x · ${data.engine.esrganModel}): Synthesize crisp brick mortar, travertine pores, timber grain, foliage leaves, and contact shadows while holding every camera line identically.\n${compiled.prompt}\n\n${dictSection}`.slice(
      0,
      plan.maxPromptChars,
    );
    const providerErrors: string[] = [];
    let hasAuthError = false;
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(enhancePrompt, data.frame, {
          sourceImage: data.image,
          modelOverride: plan.effectiveModel,
          imageSizeOverride: plan.effectiveResolution,
          timeoutMs: plan.timeoutMs,
          maxPromptChars: plan.maxPromptChars,
          maxReferences: 1,
        });
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, frame: data.frame };
      } catch (error) {
        if (isGeminiAuthError(error)) hasAuthError = true;
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (nvidiaEnabled) {
      try {
        const url = await generateImageWithNvidia(enhancePrompt, data.frame, {
          seed: compiled.seed,
          sourceImage: data.image,
        });
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, frame: data.frame };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (xaiKey) {
      try {
        const url = await callXaiImage(xaiKey, enhancePrompt, data.frame, data.image);
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, frame: data.frame };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    await refund(PLATE_COST, "enhance-refund").catch(() => undefined);
    const [refreshed, budget] = await Promise.all([
      readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST })),
      recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
    ]);
    const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
    return {
      url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
      fallback: true,
      credits: refreshed.credits,
      budget,
      costPaise: 0,
      frame: data.frame,
      ...(warning ? { warning } : {}),
    };
  });

export const relightPlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
    const { hasNvidiaKey, generateImageWithNvidia } = await import("@/lib/nvidia-vision.server");
    const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const { planServerBudgetRender, recordServerRenderOutcome } = await import("@/lib/budget-guard.server");
    const { readWallet, charge, refund } = await import("@/lib/credits.server");
    const { plan } = await planServerBudgetRender({
      requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
      requestedResolution: data.nanoBananaResolution ?? "1K",
      imageCount: 1,
      clientOverride: budgetClientOverride(data),
    });
    const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
    const geminiEnabled = hasGeminiKey();
    const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : undefined;
    if (!plan.useCloud || (!nvidiaEnabled && !geminiEnabled && !xaiKey) || !data.image) {
      const [wallet, budget] = await Promise.all([
        readWallet().catch(() => ({ credits: 4500 })),
        recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
      ]);
      return {
        url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
        fallback: true,
        credits: wallet.credits,
        budget,
        costPaise: 0,
        seed: compiled.seed,
        ...(plan.notice ? { warning: plan.notice } : {}),
      };
    }
    const wallet = await charge(PLATE_COST, "relight");
    const relightPrompt = `CONSISTENT GEOMETRY RELIGHT (${data.engine.relightPreset}): Lock architecture, furnishings, and framing 100%. Transform ONLY sky dome, sun direction, snow/season accents, and interior practical light glow.\n${compiled.prompt}`.slice(
      0,
      plan.maxPromptChars,
    );
    const providerErrors: string[] = [];
    let hasAuthError = false;
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(relightPrompt, data.frame, geminiAttachments(data, plan));
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, seed: compiled.seed };
      } catch (error) {
        if (isGeminiAuthError(error)) hasAuthError = true;
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (nvidiaEnabled) {
      try {
        const url = await generateImageWithNvidia(relightPrompt, data.frame, {
          seed: compiled.seed,
          depthImage: data.depthImage,
          annotatorImage: data.annotatorImage,
          sourceImage: data.image,
        });
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, seed: compiled.seed };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (xaiKey) {
      try {
        const url = await callXaiImage(xaiKey, relightPrompt, data.frame, data.image);
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, seed: compiled.seed };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    await refund(PLATE_COST, "relight-refund").catch(() => undefined);
    const [refreshed, budget] = await Promise.all([
      readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST })),
      recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
    ]);
    const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
    return {
      url: data.image,
      fallback: true,
      credits: refreshed.credits,
      budget,
      costPaise: 0,
      seed: compiled.seed,
      ...(warning ? { warning } : {}),
    };
  });

export const outpaintPlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
    const { hasNvidiaKey, generateImageWithNvidia } = await import("@/lib/nvidia-vision.server");
    const { hasGeminiKey, generateImageWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const { planServerBudgetRender, recordServerRenderOutcome } = await import("@/lib/budget-guard.server");
    const { readWallet, charge, refund } = await import("@/lib/credits.server");
    const { plan } = await planServerBudgetRender({
      requestedModel: data.nanoBananaModel ?? "gemini-nano-banana-2.1",
      requestedResolution: data.nanoBananaResolution ?? "1K",
      imageCount: 1,
      clientOverride: budgetClientOverride(data),
    });
    const nvidiaEnabled = plan.allowThirdPartyFallbacks && hasNvidiaKey();
    const geminiEnabled = hasGeminiKey();
    const xaiKey = plan.allowThirdPartyFallbacks ? process.env.XAI_API_KEY : undefined;
    if (!plan.useCloud || (!nvidiaEnabled && !geminiEnabled && !xaiKey) || !data.image) {
      const [wallet, budget] = await Promise.all([
        readWallet().catch(() => ({ credits: 4500 })),
        recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
      ]);
      return {
        url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed, 0, data.idea),
        fallback: true,
        credits: wallet.credits,
        budget,
        costPaise: 0,
        seed: compiled.seed,
        ...(plan.notice ? { warning: plan.notice } : {}),
      };
    }
    const wallet = await charge(PLATE_COST, "outpaint");
    const outpaintPrompt = `SEAMLESS ARCHITECTURAL OUTPAINT (${data.engine.outpaintRatio}): Preserve center architectural render cleanly while expanding surrounding context, foreground landscape, and sky.\n${compiled.prompt}`.slice(
      0,
      plan.maxPromptChars,
    );
    const aspectOverride = data.engine.outpaintRatio === "9:16" ? "9:16" : "16:9";
    const providerErrors: string[] = [];
    let hasAuthError = false;
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(outpaintPrompt, data.frame, {
          sourceImage: data.image,
          aspectOverride,
          modelOverride: plan.effectiveModel,
          imageSizeOverride: plan.effectiveResolution,
          timeoutMs: plan.timeoutMs,
          maxPromptChars: plan.maxPromptChars,
          maxReferences: 1,
        });
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, seed: compiled.seed };
      } catch (error) {
        if (isGeminiAuthError(error)) hasAuthError = true;
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (nvidiaEnabled) {
      try {
        const outFrame: Frame = { ...data.frame, ratio: aspectOverride };
        const url = await generateImageWithNvidia(outpaintPrompt, outFrame, {
          seed: compiled.seed,
          sourceImage: data.image,
        });
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, seed: compiled.seed };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    if (xaiKey) {
      try {
        const url = await callXaiImage(xaiKey, outpaintPrompt, data.frame, data.image);
        const budget = await recordServerRenderOutcome({ billedPaise: plan.totalCostPaise, liveImages: 1, freeImages: 0 });
        return { url, fallback: false, credits: wallet.credits, budget, costPaise: plan.totalCostPaise, seed: compiled.seed };
      } catch (error) {
        if (error instanceof Error) providerErrors.push(error.message);
      }
    }
    await refund(PLATE_COST, "outpaint-refund").catch(() => undefined);
    const [refreshed, budget] = await Promise.all([
      readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST })),
      recordServerRenderOutcome({ billedPaise: 0, liveImages: 0, freeImages: 1 }),
    ]);
    const warning = formatCloudFallbackWarning(providerErrors, hasAuthError);
    return {
      url: data.image,
      fallback: true,
      credits: refreshed.credits,
      budget,
      costPaise: 0,
      seed: compiled.seed,
      ...(warning ? { warning } : {}),
    };
  });

function designFacts(design: DesignState, idea: string): string {
  const picks = Object.entries(design.picks)
    .filter(([, value]) => value && value !== "Unchanged" && value !== "None" && value !== "Keep")
    .slice(0, 6)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
  return [
    `Space: ${design.vertical}`,
    `Look: ${design.look}`,
    `Range: ${design.range}`,
    `Light: ${design.light}`,
    `Time: ${design.time}`,
    `Camera: ${design.camera}`,
    `Mood: ${design.mood}`,
    `Color: ${design.color}`,
    picks ? `Materials: ${picks}` : "",
    idea ? `Request: ${idea}` : "Request: redesign the space while keeping the camera and layout.",
  ]
    .filter(Boolean)
    .join("\n");
}

function fallbackIdea(design: DesignState, idea: string): string {
  const picks = Object.entries(design.picks)
    .filter(([, value]) => value && value !== "Unchanged" && value !== "None" && value !== "Keep")
    .slice(0, 3)
    .map(([, value]) => value)
    .join(", ");
  const lead = idea.trim().replace(/[. ]+$/, "");
  const tail = `${design.look} ${design.vertical}, ${design.light.toLowerCase()} light${picks ? `, ${picks}` : ""}`;
  return (lead ? `${lead}. Hold the layout. Finish it as ${tail}.` : `Redesign this ${design.vertical} as ${tail}. Hold the camera.`).slice(0, 400);
}

export const enhanceIdea = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const data = input as { idea?: unknown; design?: Partial<DesignState> };
    const idea = typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "";
    return { idea, design: sanitizeDesign(data.design) };
  })
  .handler(async ({ data }) => {
    const fallback = fallbackIdea(data.design, data.idea);
    const { hasGeminiKey, enhanceIdeaWithGemini, isGeminiAuthError } = await import("@/lib/gemini.server");
    const { hasNvidiaKey, enhanceIdeaWithNvidia } = await import("@/lib/nvidia-vision.server");
    const nvidiaEnabled = hasNvidiaKey();
    if (hasGeminiKey()) {
      try {
        const idea = await enhanceIdeaWithGemini(designFacts(data.design, data.idea));
        return { idea };
      } catch (error) {
        if (!nvidiaEnabled && !process.env.XAI_API_KEY) {
          return {
            idea: fallback,
            ...(!isGeminiAuthError(error)
              ? { warning: error instanceof Error ? error.message : "Gemini prompt enhancement unavailable." }
              : {}),
          };
        }
      }
    }
    if (nvidiaEnabled) {
      try {
        const idea = await enhanceIdeaWithNvidia(designFacts(data.design, data.idea));
        return { idea };
      } catch (error) {
        if (!process.env.XAI_API_KEY) {
          return {
            idea: fallback,
            warning: error instanceof Error ? error.message : "NVIDIA prompt enhancement unavailable.",
          };
        }
      }
    }
    const key = process.env.XAI_API_KEY;
    if (!key) return { idea: fallback };
    try {
      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "grok-3-mini",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content:
                "Rewrite this architectural visualization request as one sentence a designer would type. Name the space, the materials, and the light. Keep the camera and layout. No labels, no bullet list, under 40 words.",
            },
            { role: "user", content: designFacts(data.design, data.idea) },
          ],
        }),
      });
      if (!response.ok) return { idea: fallback };
      const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const text = json.choices?.[0]?.message?.content?.replace(/\s+/g, " ").trim();
      if (!text) return { idea: fallback };
      return { idea: text.slice(0, 400) };
    } catch {
      return { idea: fallback };
    }
  });
