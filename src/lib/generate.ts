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
};

function cleanDataUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.startsWith("data:image/")) return undefined;
  if (value.length > 2_500_000) throw new Error("That image is too large. Try a smaller photo.");
  return value;
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
  };
}

function libraryPrompt(data: Input): string | undefined {
  if (data.studyId) return STUDIES.find((item) => item.id === data.studyId)?.prompt;
  if (data.templateId) return TEMPLATES.find((item) => item.id === data.templateId)?.prompt;
  return undefined;
}

function geminiAttachments(data: Input) {
  return {
    sourceImage: data.image ?? data.sketchImage,
    sketchImage: data.sketchImage,
    maskImage: data.maskImage,
    depthImage: data.depthImage,
    normalImage: data.normalImage,
    clayImage: data.clayImage,
    annotatorImage: data.annotatorImage,
    styleRefImage: data.styleRefImage,
    materialRefImage: data.materialRefImage,
    lightingRefImage: data.lightingRefImage,
    exampleRefImage: data.exampleRefImage,
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
      frame: data.frame,
    });
    const prompt = [
      assembleBrief(data.design, data.idea, libraryPrompt(data)),
      data.houseStyleDirective,
      compiled.prompt,
      dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams),
    ]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 8000);

    const { hasGeminiKey, generateImageWithGemini } = await import("@/lib/gemini.server");
    const geminiEnabled = hasGeminiKey();
    const xaiKey = process.env.XAI_API_KEY;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");
    if (!geminiEnabled && !xaiKey) {
      const wallet = await readWallet().catch(() => ({ credits: 4500 }));
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed),
        cost: 0,
        credits: wallet.credits,
        frame: data.frame,
        fallback: true,
        seed: compiled.seed,
        summary: compiled.parametersSummary,
      };
    }

    const wallet = await charge(PLATE_COST, data.image ? "edit" : "plate");
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(prompt, data.frame, geminiAttachments(data));
        return {
          url,
          cost: PLATE_COST,
          credits: wallet.credits,
          frame: data.frame,
          fallback: false,
          seed: compiled.seed,
          summary: compiled.parametersSummary,
        };
      } catch (error) {
        await refund(PLATE_COST, "plate-refund").catch(() => undefined);
        const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
        return {
          url: pickServerFallbackPlate(data.design, data.engine, compiled.seed),
          cost: 0,
          credits: refreshed.credits,
          frame: data.frame,
          fallback: true,
          seed: compiled.seed,
          summary: compiled.parametersSummary,
          warning: error instanceof Error ? error.message : "Gemini plate generation unavailable.",
        };
      }
    }

    try {
      const source = data.image ?? data.sketchImage;
      const url = await callXaiImage(xaiKey!, prompt, data.frame, source);
      return {
        url,
        cost: PLATE_COST,
        credits: wallet.credits,
        frame: data.frame,
        fallback: false,
        seed: compiled.seed,
        summary: compiled.parametersSummary,
      };
    } catch {
      await refund(PLATE_COST, "plate-refund").catch(() => undefined);
      const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed),
        cost: 0,
        credits: refreshed.credits,
        frame: data.frame,
        fallback: true,
        seed: compiled.seed,
        summary: compiled.parametersSummary,
      };
    }
  });

export const generateVariations = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const { dictionaryBrief } = await import("@/lib/blocks.server");
    const { hasGeminiKey, generateImageWithGemini } = await import("@/lib/gemini.server");
    const geminiEnabled = hasGeminiKey();
    const xaiKey = process.env.XAI_API_KEY;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");
    const compiled0 = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
      hasSketch: Boolean(data.sketchImage),
      variationIndex: 0,
      frame: data.frame,
    });

    if (!geminiEnabled && !xaiKey) {
      const wallet = await readWallet().catch(() => ({ credits: 4500 }));
      return {
        urls: pickFourFallbackPlates(data.design, data.engine, compiled0.seed),
        fallback: true,
        credits: wallet.credits,
        frame: data.frame,
        seed: compiled0.seed,
      };
    }

    const batchCost = PLATE_COST * 2;
    const wallet = await charge(batchCost, "variation-grid");
    const buildVariationPrompt = (idx: number) => {
      const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
        hasSketch: Boolean(data.sketchImage),
        variationIndex: idx,
        frame: data.frame,
      });
      return [
        assembleBrief(data.design, data.idea, libraryPrompt(data)),
        data.houseStyleDirective,
        compiled.prompt,
        dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams),
      ]
        .filter(Boolean)
        .join("\n\n")
        .slice(0, 8000);
    };

    if (geminiEnabled) {
      try {
        const urls = await Promise.all(
          [0, 1, 2, 3].map((idx) =>
            generateImageWithGemini(buildVariationPrompt(idx), data.frame, geminiAttachments(data)),
          ),
        );
        return {
          urls,
          fallback: false,
          credits: wallet.credits,
          frame: data.frame,
          seed: compiled0.seed,
        };
      } catch (error) {
        await refund(batchCost, "grid-refund").catch(() => undefined);
        const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + batchCost }));
        return {
          urls: pickFourFallbackPlates(data.design, data.engine, compiled0.seed),
          fallback: true,
          credits: refreshed.credits,
          frame: data.frame,
          seed: compiled0.seed,
          warning: error instanceof Error ? error.message : "Gemini variation grid unavailable.",
        };
      }
    }

    try {
      const source = data.image ?? data.sketchImage;
      const urls = await Promise.all([0, 1, 2, 3].map((idx) => callXaiImage(xaiKey!, buildVariationPrompt(idx), data.frame, source)));
      return {
        urls,
        fallback: false,
        credits: wallet.credits,
        frame: data.frame,
        seed: compiled0.seed,
      };
    } catch {
      await refund(batchCost, "grid-refund").catch(() => undefined);
      const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + batchCost }));
      return {
        urls: pickFourFallbackPlates(data.design, data.engine, compiled0.seed),
        fallback: true,
        credits: refreshed.credits,
        frame: data.frame,
        seed: compiled0.seed,
      };
    }
  });

export const inpaintPlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const { dictionaryBrief } = await import("@/lib/blocks.server");
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, {
      hasMask: true,
      inpaintNote: data.idea,
      frame: data.frame,
    });
    const dictSection = dictionaryBrief(data.design.vertical, data.design.advanced, data.dictionaryBlocks, data.dictionaryParams);
    const fullPrompt = [data.houseStyleDirective, compiled.prompt, dictSection].filter(Boolean).join("\n\n").slice(0, 4000);
    const { hasGeminiKey, generateImageWithGemini } = await import("@/lib/gemini.server");
    const geminiEnabled = hasGeminiKey();
    const xaiKey = process.env.XAI_API_KEY;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");
    if ((!geminiEnabled && !xaiKey) || !data.image) {
      const wallet = await readWallet().catch(() => ({ credits: 4500 }));
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 1),
        fallback: true,
        credits: wallet.credits,
        frame: data.frame,
        seed: compiled.seed,
      };
    }
    const wallet = await charge(PLATE_COST, "inpaint");
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(fullPrompt, data.frame, geminiAttachments(data));
        return { url, fallback: false, credits: wallet.credits, frame: data.frame, seed: compiled.seed };
      } catch (error) {
        await refund(PLATE_COST, "inpaint-refund").catch(() => undefined);
        const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
        return {
          url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 1),
          fallback: true,
          credits: refreshed.credits,
          frame: data.frame,
          seed: compiled.seed,
          warning: error instanceof Error ? error.message : "Gemini inpaint unavailable.",
        };
      }
    }
    try {
      const url = await callXaiImage(xaiKey!, fullPrompt, data.frame, data.image);
      return { url, fallback: false, credits: wallet.credits, frame: data.frame, seed: compiled.seed };
    } catch {
      await refund(PLATE_COST, "inpaint-refund").catch(() => undefined);
      const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed, 1),
        fallback: true,
        credits: refreshed.credits,
        frame: data.frame,
        seed: compiled.seed,
      };
    }
  });

export const enhancePlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const { dictionaryBrief } = await import("@/lib/blocks.server");
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
    const dictSection = dictionaryBrief(data.design.vertical, data.design.advanced, ["upscale-safety", ...(data.dictionaryBlocks ?? [])], data.dictionaryParams);
    const { hasGeminiKey, generateImageWithGemini } = await import("@/lib/gemini.server");
    const geminiEnabled = hasGeminiKey();
    const xaiKey = process.env.XAI_API_KEY;
    const { charge, refund, readWallet } = await import("@/lib/credits.server");
    if ((!geminiEnabled && !xaiKey) || !data.image) {
      const wallet = await readWallet().catch(() => ({ credits: 4500 }));
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed),
        fallback: true,
        credits: wallet.credits,
        frame: data.frame,
      };
    }
    const wallet = await charge(PLATE_COST, "enhance");
    const enhancePrompt = `GENERATIVE TILED SUPER-RESOLUTION (${data.engine.upscaleFactor}x · ${data.engine.esrganModel}): Synthesize crisp brick mortar, travertine pores, timber grain, foliage leaves, and contact shadows while holding every camera line identically.\n${compiled.prompt}\n\n${dictSection}`.slice(
      0,
      4000,
    );
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(enhancePrompt, data.frame, { sourceImage: data.image });
        return { url, fallback: false, credits: wallet.credits, frame: data.frame };
      } catch (error) {
        await refund(PLATE_COST, "enhance-refund").catch(() => undefined);
        const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
        return {
          url: pickServerFallbackPlate(data.design, data.engine, compiled.seed),
          fallback: true,
          credits: refreshed.credits,
          frame: data.frame,
          warning: error instanceof Error ? error.message : "Gemini enhance unavailable.",
        };
      }
    }
    try {
      const url = await callXaiImage(xaiKey!, enhancePrompt, data.frame, data.image);
      return { url, fallback: false, credits: wallet.credits, frame: data.frame };
    } catch {
      await refund(PLATE_COST, "enhance-refund").catch(() => undefined);
      const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
      return {
        url: pickServerFallbackPlate(data.design, data.engine, compiled.seed),
        fallback: true,
        credits: refreshed.credits,
        frame: data.frame,
      };
    }
  });

export const relightPlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
    const { hasGeminiKey, generateImageWithGemini } = await import("@/lib/gemini.server");
    const { readWallet, charge, refund } = await import("@/lib/credits.server");
    const geminiEnabled = hasGeminiKey();
    const xaiKey = process.env.XAI_API_KEY;
    if ((!geminiEnabled && !xaiKey) || !data.image) {
      const wallet = await readWallet().catch(() => ({ credits: 4500 }));
      return {
        url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed),
        fallback: true,
        credits: wallet.credits,
        seed: compiled.seed,
      };
    }
    const wallet = await charge(PLATE_COST, "relight");
    const relightPrompt = `CONSISTENT GEOMETRY RELIGHT (${data.engine.relightPreset}): Lock architecture, furnishings, and framing 100%. Transform ONLY sky dome, sun direction, snow/season accents, and interior practical light glow.\n${compiled.prompt}`.slice(
      0,
      4000,
    );
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(relightPrompt, data.frame, geminiAttachments(data));
        return { url, fallback: false, credits: wallet.credits, seed: compiled.seed };
      } catch (error) {
        await refund(PLATE_COST, "relight-refund").catch(() => undefined);
        const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
        return {
          url: data.image,
          fallback: true,
          credits: refreshed.credits,
          seed: compiled.seed,
          warning: error instanceof Error ? error.message : "Relight fallback applied.",
        };
      }
    }
    try {
      const url = await callXaiImage(xaiKey!, relightPrompt, data.frame, data.image);
      return { url, fallback: false, credits: wallet.credits, seed: compiled.seed };
    } catch {
      await refund(PLATE_COST, "relight-refund").catch(() => undefined);
      const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
      return { url: data.image, fallback: true, credits: refreshed.credits, seed: compiled.seed };
    }
  });

export const outpaintPlate = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }) => {
    const compiled = compileEngineBrief(data.design, data.engine, data.scene3d, data.idea, { frame: data.frame });
    const { hasGeminiKey, generateImageWithGemini } = await import("@/lib/gemini.server");
    const { readWallet, charge, refund } = await import("@/lib/credits.server");
    const geminiEnabled = hasGeminiKey();
    const xaiKey = process.env.XAI_API_KEY;
    if ((!geminiEnabled && !xaiKey) || !data.image) {
      const wallet = await readWallet().catch(() => ({ credits: 4500 }));
      return {
        url: data.image ?? pickServerFallbackPlate(data.design, data.engine, compiled.seed),
        fallback: true,
        credits: wallet.credits,
        seed: compiled.seed,
      };
    }
    const wallet = await charge(PLATE_COST, "outpaint");
    const outpaintPrompt = `SEAMLESS ARCHITECTURAL OUTPAINT (${data.engine.outpaintRatio}): Preserve center architectural render cleanly while expanding surrounding context, foreground landscape, and sky.\n${compiled.prompt}`.slice(
      0,
      4000,
    );
    const aspectOverride = data.engine.outpaintRatio === "9:16" ? "9:16" : "16:9";
    if (geminiEnabled) {
      try {
        const url = await generateImageWithGemini(outpaintPrompt, data.frame, {
          sourceImage: data.image,
          aspectOverride,
        });
        return { url, fallback: false, credits: wallet.credits, seed: compiled.seed };
      } catch (error) {
        await refund(PLATE_COST, "outpaint-refund").catch(() => undefined);
        const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
        return {
          url: data.image,
          fallback: true,
          credits: refreshed.credits,
          seed: compiled.seed,
          warning: error instanceof Error ? error.message : "Outpaint canvas fallback applied.",
        };
      }
    }
    try {
      const url = await callXaiImage(xaiKey!, outpaintPrompt, data.frame, data.image);
      return { url, fallback: false, credits: wallet.credits, seed: compiled.seed };
    } catch {
      await refund(PLATE_COST, "outpaint-refund").catch(() => undefined);
      const refreshed = await readWallet().catch(() => ({ credits: wallet.credits + PLATE_COST }));
      return { url: data.image, fallback: true, credits: refreshed.credits, seed: compiled.seed };
    }
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
    const { hasGeminiKey, enhanceIdeaWithGemini } = await import("@/lib/gemini.server");
    if (hasGeminiKey()) {
      try {
        const idea = await enhanceIdeaWithGemini(designFacts(data.design, data.idea));
        return { idea };
      } catch (error) {
        return {
          idea: fallback,
          warning: error instanceof Error ? error.message : "Gemini prompt enhancement unavailable.",
        };
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
