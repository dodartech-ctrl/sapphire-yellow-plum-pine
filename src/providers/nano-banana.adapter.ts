import { GoogleGenAI, type Part } from "@google/genai";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  GenerationMode,
  NanoBananaModelKey,
  OutputAspectRatio,
  OutputResolution,
  ReferenceImageInput,
} from "@/schemas/nano-banana.schema";

export interface NanoBananaModelSpec {
  key: NanoBananaModelKey;
  specModelId: string;
  runtimeModelId: string;
  displayName: string;
  role: string;
  quality: "standard" | "high" | "premium";
  speed: "very_fast" | "fast" | "high" | "standard";
  resolutions: readonly OutputResolution[];
  supports: readonly string[];
  maxReferences: number;
  supportsImageSizeConfig: boolean;
  estimatedCostUsd: number;
  limitations?: readonly string[];
}

/**
 * Logical Nano Banana model catalog mapped strictly to active Google Gemini SDK image models.
 * Note: gemini-3.1-flash-image from external drafts is mapped to active gemini-nano-banana-2.1
 * (or gemini-3.1-flash-lite-image for 512 drafts) so live API requests never hit 404.
 */
export const NANO_BANANA_MODELS: Record<NanoBananaModelKey, NanoBananaModelSpec> = {
  nano_banana_2_1: {
    key: "nano_banana_2_1",
    specModelId: "gemini-nano-banana-2.1",
    runtimeModelId: "gemini-nano-banana-2.1",
    displayName: "Nano Banana 2.1",
    role: "Primary image generation and editing",
    quality: "high",
    speed: "high",
    resolutions: ["1K", "2K", "4K"],
    supports: [
      "text_to_image",
      "image_to_image",
      "image_edit",
      "image_editing",
      "multi_reference",
      "multi_reference_images",
      "iterative_editing",
      "multi_turn_editing",
      "style_transfer",
      "render_enhancement",
      "architectural_visualization",
    ],
    maxReferences: 14,
    supportsImageSizeConfig: true,
    estimatedCostUsd: 0.045,
  },
  nano_banana_2: {
    key: "nano_banana_2",
    specModelId: "gemini-3.1-flash-image",
    runtimeModelId: process.env.GEMINI_DEFAULT_IMAGE_MODEL?.trim() || "gemini-nano-banana-2.1",
    displayName: "Nano Banana 2",
    role: "Fast production generation and editing",
    quality: "high",
    speed: "fast",
    resolutions: ["512", "1K", "2K", "4K"],
    supports: [
      "text_to_image",
      "image_to_image",
      "image_edit",
      "image_editing",
      "multi_reference",
      "multi_reference_images",
      "iterative_editing",
      "style_transfer",
      "render_enhancement",
      "architectural_visualization",
    ],
    maxReferences: 10,
    supportsImageSizeConfig: true,
    estimatedCostUsd: 0.032,
  },
  nano_banana_2_lite: {
    key: "nano_banana_2_lite",
    specModelId: "gemini-3.1-flash-lite-image",
    runtimeModelId: "gemini-3.1-flash-lite-image",
    displayName: "Nano Banana 2 Lite",
    role: "Fast drafts and concept exploration",
    quality: "standard",
    speed: "very_fast",
    resolutions: ["512", "1K"],
    supports: [
      "text_to_image",
      "image_to_image",
      "image_edit",
      "basic_image_editing",
      "style_transfer",
    ],
    maxReferences: 3,
    supportsImageSizeConfig: false,
    estimatedCostUsd: 0.015,
    limitations: [
      "Not intended for complex multiple-reference workflows",
      "Not intended for extensive iterative editing",
    ],
  },
  nano_banana_pro: {
    key: "nano_banana_pro",
    specModelId: "gemini-3-pro-image",
    runtimeModelId: process.env.GEMINI_PREMIUM_IMAGE_MODEL?.trim() || "gemini-3-pro-image",
    displayName: "Nano Banana Pro",
    role: "Premium architectural image production",
    quality: "premium",
    speed: "standard",
    resolutions: ["1K", "2K", "4K"],
    supports: [
      "text_to_image",
      "image_to_image",
      "image_edit",
      "precision_image_editing",
      "multi_reference",
      "multi_reference_images",
      "iterative_editing",
      "style_transfer",
      "render_enhancement",
      "advanced_text_rendering",
      "architectural_visualization",
    ],
    maxReferences: 14,
    supportsImageSizeConfig: true,
    estimatedCostUsd: 0.09,
  },
};

export interface CapabilityCheckResult {
  valid: boolean;
  reasons: string[];
  normalizedResolution: OutputResolution;
  normalizedAspectRatio: OutputAspectRatio;
}

export interface ExtractedImageAsset {
  index: number;
  mimeType: string;
  dataUrl: string;
  base64Length: number;
  checksum: string;
}

export interface NormalizedProviderResponse {
  provider: "google_gemini";
  logicalModelKey: NanoBananaModelKey;
  providerModelId: string;
  requestId: string;
  assets: ExtractedImageAsset[];
  textFeedback: string[];
  latencyMs: number;
  usage: {
    inputTokens: number;
    outputTokens: number;
    imageCount: number;
    estimatedCostUsd: number;
  };
  rawMetadata: Record<string, unknown>;
}

export interface MappedProviderError {
  code:
    | "UNCONFIGURED"
    | "AUTH_INVALID"
    | "PERMISSION_DENIED"
    | "RATE_LIMITED"
    | "MODEL_NOT_FOUND"
    | "TIMEOUT"
    | "INVALID_REQUEST"
    | "NO_IMAGE_OUTPUT"
    | "PROVIDER_ERROR";
  retryable: boolean;
  httpStatus: number;
  message: string;
}

export interface AdapterCallInput {
  modelKey: NanoBananaModelKey;
  mode: GenerationMode;
  prompt: string;
  negativeInstructions?: string;
  resolution: OutputResolution;
  aspectRatio: OutputAspectRatio;
  references?: ReferenceImageInput[];
  maskImageUrl?: string;
  conversationTurns?: Array<{ role: "user" | "model"; text: string; imageUrl?: string }>;
}

export interface GeminiClientLike {
  models: {
    generateContent: GoogleGenAI["models"]["generateContent"];
  };
}

const ENV_KEY_PRECEDENCE = [
  "GOOGLE_GEMINI_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "API_KEY",
  "api",
  "API",
  "update",
  "UPDATE",
] as const;

const PLACEHOLDER_KEY_RE =
  /^(placeholder|undefined|null|changeme|your[_-]?api[_-]?key|my[_-]?gemini[_-]?api[_-]?key|test|demo)$/i;

const STANDARD_RATIOS: ReadonlySet<OutputAspectRatio> = new Set([
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
]);

function resolveServerGeminiKeys(): string[] {
  const keys: string[] = [];
  for (const envName of ENV_KEY_PRECEDENCE) {
    const raw = process.env[envName]?.trim();
    if (!raw) continue;
    const cleaned = raw.replace(/^["']+|["']+$/g, "").trim();
    if (cleaned.length >= 12 && !PLACEHOLDER_KEY_RE.test(cleaned) && !keys.includes(cleaned)) {
      keys.push(cleaned);
    }
  }
  return keys;
}

function parseInlineDataUrl(url: string): { mimeType: string; data: string } | null {
  if (!url.startsWith("data:image/")) return null;
  const match = url.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

async function resolveReferenceToPart(imageUrl: string): Promise<{ inlineData: { mimeType: string; data: string } } | null> {
  const inline = parseInlineDataUrl(imageUrl);
  if (inline) {
    return { inlineData: inline };
  }

  if (imageUrl.startsWith("/viz/")) {
    const vizDir = path.resolve(process.cwd(), "public", "viz");
    const rel = imageUrl.slice("/viz/".length).split("?")[0] ?? "";
    const resolved = path.resolve(vizDir, rel);
    if (!resolved.startsWith(`${vizDir}${path.sep}`)) return null;
    const ext = path.extname(resolved).toLowerCase();
    const mimeType =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    try {
      const buf = await readFile(resolved);
      if (buf.byteLength === 0 || buf.byteLength > 6_500_000) return null;
      return { inlineData: { mimeType, data: buf.toString("base64") } };
    } catch {
      return null;
    }
  }

  if (imageUrl.startsWith("https://")) {
    try {
      const res = await fetch(imageUrl, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) return null;
      const mimeType = res.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
      if (!mimeType.startsWith("image/")) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength === 0 || buf.byteLength > 6_500_000) return null;
      return { inlineData: { mimeType, data: buf.toString("base64") } };
    } catch {
      return null;
    }
  }

  return null;
}

export class NanoBananaProviderAdapter {
  private readonly injectedClient?: GeminiClientLike;

  constructor(options?: { client?: GeminiClientLike }) {
    this.injectedClient = options?.client;
  }

  /** 1. validateConfiguration */
  validateConfiguration(): {
    configured: boolean;
    provider: "google_gemini";
    serverSideOnly: true;
    keyCount: number;
    defaultModel: string;
    premiumModel: string;
    timeoutMs: number;
    maxRetries: number;
  } {
    const keys = resolveServerGeminiKeys();
    const timeoutMs = Math.max(5000, Math.min(90000, Number(process.env.GEMINI_REQUEST_TIMEOUT) || 24000));
    const maxRetries = Math.max(1, Math.min(4, Number(process.env.GEMINI_MAX_RETRIES) || 2));
    return {
      configured: Boolean(this.injectedClient) || keys.length > 0,
      provider: "google_gemini",
      serverSideOnly: true,
      keyCount: this.injectedClient ? 1 : keys.length,
      defaultModel: NANO_BANANA_MODELS.nano_banana_2_1.runtimeModelId,
      premiumModel: NANO_BANANA_MODELS.nano_banana_pro.runtimeModelId,
      timeoutMs,
      maxRetries,
    };
  }

  /** 2. getAvailableModels */
  getAvailableModels(): NanoBananaModelSpec[] {
    return Object.values(NANO_BANANA_MODELS);
  }

  /** 3. validateModelCapabilities */
  validateModelCapabilities(input: {
    modelKey: NanoBananaModelKey;
    mode: GenerationMode;
    resolution: OutputResolution;
    aspectRatio: OutputAspectRatio;
    referenceCount: number;
  }): CapabilityCheckResult {
    const spec = NANO_BANANA_MODELS[input.modelKey];
    const reasons: string[] = [];

    if (!spec) {
      return {
        valid: false,
        reasons: [`Unknown Nano Banana model key: ${String(input.modelKey)}`],
        normalizedResolution: "1K",
        normalizedAspectRatio: "16:9",
      };
    }

    if (!spec.supports.includes(input.mode)) {
      reasons.push(`${spec.displayName} does not support generation mode "${input.mode}".`);
    }

    if (input.referenceCount > spec.maxReferences) {
      reasons.push(
        `${spec.displayName} supports up to ${spec.maxReferences} reference images (received ${input.referenceCount}).`,
      );
    }

    let normalizedResolution = input.resolution;
    if (!spec.resolutions.includes(input.resolution)) {
      reasons.push(
        `${spec.displayName} does not support ${input.resolution} output (supported: ${spec.resolutions.join(", ")}).`,
      );
      normalizedResolution = spec.resolutions[spec.resolutions.length - 1] ?? "1K";
    }

    let normalizedAspectRatio = input.aspectRatio;
    if (!STANDARD_RATIOS.has(input.aspectRatio) && input.modelKey === "nano_banana_2_lite") {
      reasons.push(
        `${spec.displayName} does not support extended aspect ratio ${input.aspectRatio}; use Nano Banana 2.1 or Pro.`,
      );
      normalizedAspectRatio = "16:9";
    }

    return {
      valid: reasons.length === 0,
      reasons,
      normalizedResolution,
      normalizedAspectRatio,
    };
  }

  private async executeWithClient<T>(fn: (client: GeminiClientLike) => Promise<T>): Promise<T> {
    if (this.injectedClient) {
      return fn(this.injectedClient);
    }
    const keys = resolveServerGeminiKeys();
    if (keys.length === 0) {
      throw new Error("GOOGLE_GEMINI_API_KEY / GEMINI_API_KEY is not configured on the server.");
    }
    let lastError: unknown;
    for (let i = 0; i < keys.length; i++) {
      const apiKey = keys[i];
      const modes = apiKey.startsWith("AQ.") ? [false, true] : [false];
      for (let m = 0; m < modes.length; m++) {
        try {
          const client = new GoogleGenAI({
            apiKey,
            ...(modes[m] ? { vertexai: true } : {}),
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });
          return await fn(client);
        } catch (error) {
          lastError = error;
          const mapped = this.mapProviderError(error);
          const hasMore = m < modes.length - 1 || i < keys.length - 1;
          if (hasMore && (mapped.code === "AUTH_INVALID" || mapped.code === "PERMISSION_DENIED")) {
            continue;
          }
          throw error;
        }
      }
    }
    throw lastError;
  }

  private resolveRuntimeModelId(modelKey: NanoBananaModelKey, resolution: OutputResolution): string {
    const spec = NANO_BANANA_MODELS[modelKey];
    if (modelKey === "nano_banana_2" && resolution === "512") {
      return NANO_BANANA_MODELS.nano_banana_2_lite.runtimeModelId;
    }
    return spec.runtimeModelId;
  }

  private buildImageConfig(
    modelKey: NanoBananaModelKey,
    resolution: OutputResolution,
    aspectRatio: OutputAspectRatio,
  ): { aspectRatio: string; imageSize?: string } {
    const spec = NANO_BANANA_MODELS[modelKey];
    const imageConfig: { aspectRatio: string; imageSize?: string } = {
      aspectRatio,
    };
    if (spec.supportsImageSizeConfig && (resolution === "1K" || resolution === "2K" || resolution === "4K")) {
      imageConfig.imageSize = resolution;
    }
    return imageConfig;
  }

  private async runCoreCall(input: AdapterCallInput): Promise<NormalizedProviderResponse> {
    const startedAt = Date.now();
    const spec = NANO_BANANA_MODELS[input.modelKey];
    const runtimeModelId = this.resolveRuntimeModelId(input.modelKey, input.resolution);

    const parts: Part[] = [];
    const manifestNotes: string[] = [];

    if (input.conversationTurns && input.conversationTurns.length > 0) {
      for (const turn of input.conversationTurns.slice(-6)) {
        if (turn.imageUrl) {
          const resolved = await resolveReferenceToPart(turn.imageUrl);
          if (resolved) {
            parts.push(resolved);
            manifestNotes.push(`Prior ${turn.role} iteration image attached.`);
          }
        }
        parts.push({ text: `[Prior ${turn.role} instruction]: ${turn.text}` });
      }
    }

    const sortedRefs = [...(input.references ?? [])].sort(
      (a, b) => (a.priority ?? 2) - (b.priority ?? 2),
    );
    let refIndex = 1;
    for (const ref of sortedRefs.slice(0, spec.maxReferences)) {
      const part = await resolveReferenceToPart(ref.imageUrl);
      if (part) {
        parts.push(part);
        manifestNotes.push(
          `Reference #${refIndex} [priority=${ref.priority ?? 2}, type=${ref.referenceType}]: ${ref.label ?? ref.referenceType}${ref.notes ? ` — ${ref.notes}` : ""}`,
        );
        refIndex++;
      }
    }

    if (input.maskImageUrl) {
      const maskPart = await resolveReferenceToPart(input.maskImageUrl);
      if (maskPart) {
        parts.push(maskPart);
        manifestNotes.push(
          "Editable Region Mask attached: keep all unmasked pixels identical and modify only inside the mask.",
        );
      }
    }

    const textPayload = [
      manifestNotes.length > 0 ? `REFERENCE IMAGE MANIFEST:\n${manifestNotes.join("\n")}` : "",
      input.prompt,
      input.negativeInstructions ? `NEGATIVE CONSTRAINTS (STRICTLY AVOID):\n${input.negativeInstructions}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    parts.push({ text: textPayload });

    const imageConfig = this.buildImageConfig(input.modelKey, input.resolution, input.aspectRatio);

    const { timeoutMs } = this.validateConfiguration();
    const effectiveTimeout =
      input.modelKey === "nano_banana_2_lite"
        ? Math.min(timeoutMs, 16_000)
        : input.resolution === "1K" || input.resolution === "512"
          ? Math.min(timeoutMs, 22_000)
          : timeoutMs;

    // IMPORTANT per Gemini API rules: never pass responseMimeType or responseSchema to Nano Banana image models.
    const rawResponse = await new Promise<Awaited<ReturnType<GeminiClientLike["models"]["generateContent"]>>>(
      (resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Nano Banana ${runtimeModelId} timed out after ${Math.round(effectiveTimeout / 1000)}s.`));
        }, effectiveTimeout);
        this.executeWithClient((ai) =>
          ai.models.generateContent({
            model: runtimeModelId,
            contents: { parts },
            config: {
              imageConfig,
            },
          }),
        )
          .then((res) => {
            clearTimeout(timer);
            resolve(res);
          })
          .catch((err) => {
            clearTimeout(timer);
            reject(err);
          });
      },
    );

    const latencyMs = Math.max(1, Date.now() - startedAt);
    return this.normalizeResponse(rawResponse, {
      logicalModelKey: input.modelKey,
      providerModelId: runtimeModelId,
      latencyMs,
      promptChars: textPayload.length,
    });
  }

  /** 4. generateImage */
  async generateImage(input: Omit<AdapterCallInput, "mode"> & { mode?: GenerationMode }): Promise<NormalizedProviderResponse> {
    return this.runCoreCall({
      ...input,
      mode: input.mode ?? "text_to_image",
    });
  }

  /** 5. editImage */
  async editImage(input: Omit<AdapterCallInput, "mode"> & { mode?: GenerationMode }): Promise<NormalizedProviderResponse> {
    if (!input.references || input.references.length === 0) {
      throw new Error("editImage requires at least one base/source reference image.");
    }
    return this.runCoreCall({
      ...input,
      mode: input.mode ?? "image_edit",
    });
  }

  /** 6. generateWithReferences */
  async generateWithReferences(input: Omit<AdapterCallInput, "mode">): Promise<NormalizedProviderResponse> {
    if (!input.references || input.references.length < 2) {
      throw new Error("generateWithReferences requires at least two reference images.");
    }
    return this.runCoreCall({
      ...input,
      mode: "multi_reference",
    });
  }

  /** 7. continueEditing */
  async continueEditing(input: Omit<AdapterCallInput, "mode">): Promise<NormalizedProviderResponse> {
    return this.runCoreCall({
      ...input,
      mode: "iterative_editing",
    });
  }

  /** 8. extractImageAssets */
  extractImageAssets(rawResponse: unknown): { assets: ExtractedImageAsset[]; textFeedback: string[] } {
    const assets: ExtractedImageAsset[] = [];
    const textFeedback: string[] = [];

    const resp = rawResponse as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: string;
            inlineData?: { mimeType?: string; data?: string };
          }>;
        };
      }>;
    };

    const parts = resp?.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (typeof part.text === "string" && part.text.trim()) {
        textFeedback.push(part.text.trim());
      }
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType ?? "image/png";
        const data = part.inlineData.data;
        const checksum = createHash("sha256").update(data).digest("hex");
        assets.push({
          index: assets.length,
          mimeType,
          dataUrl: `data:${mimeType};base64,${data}`,
          base64Length: data.length,
          checksum,
        });
      }
    }

    return { assets, textFeedback };
  }

  /** 9. normalizeResponse */
  normalizeResponse(
    rawResponse: unknown,
    meta: {
      logicalModelKey: NanoBananaModelKey;
      providerModelId: string;
      latencyMs: number;
      promptChars: number;
    },
  ): NormalizedProviderResponse {
    const { assets, textFeedback } = this.extractImageAssets(rawResponse);
    if (assets.length === 0) {
      throw new Error("Nano Banana provider did not return an image asset in candidate parts.");
    }

    const resp = rawResponse as {
      responseId?: string;
      modelVersion?: string;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
      candidates?: Array<{ finishReason?: string }>;
    };

    const spec = NANO_BANANA_MODELS[meta.logicalModelKey];
    const inputTokens = resp?.usageMetadata?.promptTokenCount ?? Math.ceil(meta.promptChars / 4);
    const outputTokens = resp?.usageMetadata?.candidatesTokenCount ?? assets.length * 1024;

    return {
      provider: "google_gemini",
      logicalModelKey: meta.logicalModelKey,
      providerModelId: resp?.modelVersion || meta.providerModelId,
      requestId: resp?.responseId || `nb-req-${Date.now().toString(36)}`,
      assets,
      textFeedback,
      latencyMs: meta.latencyMs,
      usage: {
        inputTokens,
        outputTokens,
        imageCount: assets.length,
        estimatedCostUsd: Number((spec.estimatedCostUsd * assets.length).toFixed(5)),
      },
      rawMetadata: {
        finishReason: resp?.candidates?.[0]?.finishReason ?? "STOP",
        modelVersion: resp?.modelVersion ?? meta.providerModelId,
        specModelId: spec.specModelId,
        textPartCount: textFeedback.length,
      },
    };
  }

  /** 10. mapProviderError */
  mapProviderError(error: unknown): MappedProviderError {
    const raw = error instanceof Error ? error.message : String(error ?? "Unknown provider error");
    const sanitized = raw
      .replace(/AIza[0-9A-Za-z_-]+/g, "[REDACTED_KEY]")
      .replace(/AQ\.[0-9A-Za-z._-]+/g, "[REDACTED_KEY]")
      .trim();

    if (/not configured|missing.*key/i.test(sanitized)) {
      return {
        code: "UNCONFIGURED",
        retryable: false,
        httpStatus: 503,
        message: "Server-side Google Gemini API key is not configured.",
      };
    }
    if (/API_KEY_INVALID|API key not valid/i.test(sanitized)) {
      return {
        code: "AUTH_INVALID",
        retryable: false,
        httpStatus: 401,
        message: "Google Gemini rejected the server API key.",
      };
    }
    if (/PERMISSION_DENIED|\b403\b/i.test(sanitized)) {
      return {
        code: "PERMISSION_DENIED",
        retryable: false,
        httpStatus: 403,
        message: "Google Gemini permission denied (403) for this image model.",
      };
    }
    if (/RESOURCE_EXHAUSTED|\b429\b|rate limit|quota/i.test(sanitized)) {
      return {
        code: "RATE_LIMITED",
        retryable: true,
        httpStatus: 429,
        message: "Google Gemini rate limit or quota reached (429).",
      };
    }
    if (/NOT_FOUND|\b404\b/i.test(sanitized)) {
      return {
        code: "MODEL_NOT_FOUND",
        retryable: true,
        httpStatus: 404,
        message: `Requested Gemini image model unavailable (404): ${sanitized.slice(0, 140)}`,
      };
    }
    if (/timeout|aborted|ETIMEDOUT|ECONNRESET|503|502|504|UNAVAILABLE/i.test(sanitized)) {
      return {
        code: "TIMEOUT",
        retryable: true,
        httpStatus: 504,
        message: "Google Gemini image generation timed out or temporarily unavailable.",
      };
    }
    if (/did not return an image/i.test(sanitized)) {
      return {
        code: "NO_IMAGE_OUTPUT",
        retryable: true,
        httpStatus: 502,
        message: "Model responded without an image asset; retry or adjust prompt.",
      };
    }
    if (/INVALID_ARGUMENT|\b400\b/i.test(sanitized)) {
      return {
        code: "INVALID_REQUEST",
        retryable: false,
        httpStatus: 400,
        message: `Invalid request parameters: ${sanitized.slice(0, 160)}`,
      };
    }
    return {
      code: "PROVIDER_ERROR",
      retryable: true,
      httpStatus: 502,
      message: sanitized.slice(0, 220) || "Google Gemini image provider error.",
    };
  }
}
