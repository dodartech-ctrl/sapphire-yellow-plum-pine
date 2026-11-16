import type { Ratio } from "@/lib/frame";
import { previewPathPrefix } from "@/lib/preview-path-prefix";

export const NVIDIA_INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
export const NVIDIA_VISION_MODEL = "minimaxai/minimax-m3.1-flash";
export const NVIDIA_FLUX_DEV_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";
export const NVIDIA_FLUX_SCHNELL_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell";
export const NVIDIA_SAMPLE_IMAGE_URL =
  "https://assets.ngc.nvidia.com/products/api-catalog/phi-3-5-vision/example1b.jpg";

export const NVIDIA_DEFAULT_PROMPT = "What is in this image?";

export const NVIDIA_VISION_QUICK_PROMPTS = [
  {
    id: "describe",
    label: "What is in this image?",
    prompt: "What is in this image?",
  },
  {
    id: "materials",
    label: "Materials & Palette",
    prompt:
      "Identify all architectural materials, surface finishes, flooring, wall treatments, and color palette in this image concisely.",
  },
  {
    id: "lighting",
    label: "Lighting & Optics",
    prompt:
      "Analyze the lighting setup, sun angle, shadow softness, color temperature, and camera framing in this architectural view.",
  },
  {
    id: "brief",
    label: "Convert to Render Prompt",
    prompt:
      "Write a single concise architectural visualization prompt (under 45 words) capturing the space, materials, lighting, and camera angle of this image.",
  },
] as const;

export type NvidiaVisionRequestInput = {
  prompt?: string;
  imageUrl: string;
  stream?: boolean;
  maxTokens?: number;
  seed?: number;
  temperature?: number;
  topP?: number;
};

export type NvidiaChatCompletionPayload = {
  messages: [
    {
      role: "user";
      content: [
        { type: "text"; text: string },
        { type: "image_url"; image_url: { url: string } },
      ];
    },
  ];
  model: typeof NVIDIA_VISION_MODEL;
  max_tokens: number;
  seed: number;
  stream: boolean;
  temperature: number;
  top_p: number;
};

export type NvidiaFluxMode = "base" | "canny" | "depth";

export type NvidiaFluxPayload = {
  prompt: string;
  width: number;
  height: number;
  cfg_scale: number;
  steps: number;
  seed: number;
  samples: 1;
  mode?: NvidiaFluxMode;
  image?: string;
};

export type NvidiaSseDelta = {
  done: boolean;
  deltaText: string;
  reasoningText: string;
  error?: string;
};

const MAX_IMAGE_DATA_URL_LENGTH = 4_000_000;

export function isValidVisionImageUrl(raw: unknown): raw is string {
  if (typeof raw !== "string") return false;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_IMAGE_DATA_URL_LENGTH) return false;
  if (/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(trimmed)) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function buildNvidiaVisionPayload(input: NvidiaVisionRequestInput): NvidiaChatCompletionPayload {
  const imageUrl = input.imageUrl.trim();
  if (!isValidVisionImageUrl(imageUrl)) {
    throw new Error("Provide a valid HTTPS image URL or base64 image data URL.");
  }

  const prompt =
    typeof input.prompt === "string" && input.prompt.trim().length > 0
      ? input.prompt.trim().slice(0, 4000)
      : NVIDIA_DEFAULT_PROMPT;

  const rawMaxTokens = Number(input.maxTokens);
  const maxTokens = Number.isFinite(rawMaxTokens)
    ? Math.max(64, Math.min(16384, Math.round(rawMaxTokens)))
    : 16384;

  const rawSeed = Number(input.seed);
  const seed = Number.isFinite(rawSeed) ? Math.max(0, Math.round(rawSeed)) : 0;

  const rawTemp = Number(input.temperature);
  const temperature = Number.isFinite(rawTemp) ? Math.max(0, Math.min(2, rawTemp)) : 1;

  const rawTopP = Number(input.topP);
  const topP = Number.isFinite(rawTopP) ? Math.max(0.05, Math.min(1, rawTopP)) : 0.95;

  const stream = typeof input.stream === "boolean" ? input.stream : true;

  return {
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    model: NVIDIA_VISION_MODEL,
    max_tokens: maxTokens,
    seed,
    stream,
    temperature,
    top_p: topP,
  };
}

export function toNvidiaFluxDimensions(ratio: Ratio): { width: number; height: number } {
  switch (ratio) {
    case "16:9":
      return { width: 1344, height: 768 };
    case "4:3":
      return { width: 1024, height: 768 };
    case "3:2":
      return { width: 1152, height: 768 };
    case "9:16":
      return { width: 768, height: 1344 };
    case "1:1":
    default:
      return { width: 1024, height: 1024 };
  }
}

export function stripDataUrlPrefix(rawUrl?: string): string | undefined {
  if (!rawUrl || !rawUrl.startsWith("data:image/")) return undefined;
  const idx = rawUrl.indexOf(";base64,");
  if (idx === -1) return undefined;
  const base64 = rawUrl.slice(idx + 8).trim();
  return base64 || undefined;
}

export function buildNvidiaFluxPayload(params: {
  prompt: string;
  ratio: Ratio;
  seed?: number;
  fast?: boolean;
  steps?: number;
  cfgScale?: number;
  depthImage?: string;
  cannyImage?: string;
}): { endpoint: string; payload: NvidiaFluxPayload } {
  const { width, height } = toNvidiaFluxDimensions(params.ratio);
  const cleanPrompt = params.prompt.trim().slice(0, 9500) || "Modern architectural studio visualization";
  const seed = Number.isFinite(Number(params.seed)) ? Math.max(0, Math.round(Number(params.seed))) : 0;

  const depthRaw = stripDataUrlPrefix(params.depthImage);
  const cannyRaw = stripDataUrlPrefix(params.cannyImage);
  const hasControlImage = Boolean(depthRaw || cannyRaw);

  // FLUX.1-schnell supports fast 4-step base generation; FLUX.1-dev supports canny/depth conditioning
  const useSchnell = Boolean(params.fast) && !hasControlImage;
  const endpoint = useSchnell ? NVIDIA_FLUX_SCHNELL_URL : NVIDIA_FLUX_DEV_URL;

  const mode: NvidiaFluxMode = depthRaw ? "depth" : cannyRaw ? "canny" : "base";
  const steps = useSchnell
    ? 4
    : Math.max(5, Math.min(60, Math.round(Number(params.steps ?? 36))));
  const cfgScale = useSchnell ? 0 : Math.max(1, Math.min(9, Number(params.cfgScale ?? 5)));

  const payload: NvidiaFluxPayload = {
    prompt: cleanPrompt,
    width,
    height,
    cfg_scale: cfgScale,
    steps,
    seed,
    samples: 1,
    ...(!useSchnell ? { mode } : {}),
    ...(!useSchnell && (depthRaw || cannyRaw) ? { image: depthRaw ?? cannyRaw } : {}),
  };

  return { endpoint, payload };
}

export function detectBase64ImageMime(base64: string): "image/jpeg" | "image/png" | "image/webp" {
  const head = base64.slice(0, 12);
  if (head.startsWith("/9j/")) return "image/jpeg";
  if (head.startsWith("UklGR")) return "image/webp";
  return "image/png";
}

export function parseNvidiaFluxResponse(json: unknown): string {
  const data = json as {
    artifacts?: Array<{ base64?: string; finishReason?: string }>;
  } | null;
  const first = Array.isArray(data?.artifacts) ? data.artifacts[0] : undefined;
  if (!first || typeof first.base64 !== "string" || !first.base64.trim()) {
    throw new Error("NVIDIA NIM FLUX returned no image artifact.");
  }
  if (first.finishReason === "CONTENT_FILTERED") {
    throw new Error("NVIDIA NIM filtered the image prompt. Try adjusting the architectural description.");
  }
  const cleanB64 = first.base64.trim();
  const mime = detectBase64ImageMime(cleanB64);
  return `data:${mime};base64,${cleanB64}`;
}

export function extractNvidiaSseDelta(rawLine: string): NvidiaSseDelta {
  const trimmed = rawLine.trim();
  if (!trimmed || trimmed.startsWith(":")) {
    return { done: false, deltaText: "", reasoningText: "" };
  }
  const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
  if (!payload) {
    return { done: false, deltaText: "", reasoningText: "" };
  }
  if (payload === "[DONE]") {
    return { done: true, deltaText: "", reasoningText: "" };
  }
  try {
    const parsed = JSON.parse(payload) as {
      error?: { message?: string } | string;
      choices?: Array<{
        delta?: { content?: string | null; reasoning_content?: string | null };
        message?: { content?: string | null; reasoning_content?: string | null };
      }>;
    };
    if (parsed.error) {
      const msg = typeof parsed.error === "string" ? parsed.error : parsed.error.message;
      return {
        done: true,
        deltaText: "",
        reasoningText: "",
        error: sanitizeNvidiaVisionError(msg || "NVIDIA vision stream failed."),
      };
    }
    const choice = parsed.choices?.[0];
    const deltaText =
      typeof choice?.delta?.content === "string"
        ? choice.delta.content
        : typeof choice?.message?.content === "string"
          ? choice.message.content
          : "";
    const reasoningText =
      typeof choice?.delta?.reasoning_content === "string"
        ? choice.delta.reasoning_content
        : typeof choice?.message?.reasoning_content === "string"
          ? choice.message.reasoning_content
          : "";
    return { done: false, deltaText, reasoningText };
  } catch {
    return { done: false, deltaText: "", reasoningText: "" };
  }
}

export function sanitizeNvidiaVisionError(raw: string): string {
  const cleaned = raw
    .replace(/nvapi-[A-Za-z0-9_-]+/g, "[REDACTED]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]")
    .trim();
  return cleaned.slice(0, 260) || "NVIDIA NIM API request failed.";
}

export function resolveNvidiaApiUrl(path = "/api/nvidia-vision"): string {
  if (typeof window === "undefined") return path;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
  return prefix ? `${prefix}${path}` : path;
}
