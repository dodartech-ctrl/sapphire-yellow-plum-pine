import { GoogleGenAI, type Part } from "@google/genai";
import type { Frame, Ratio } from "@/lib/frame";

const GEMINI_TEXT_MODEL = "gemini-4-hydrogen";
const GEMINI_IMAGE_FAST_MODEL = "gemini-3.1-flash-lite-image";
const GEMINI_IMAGE_HQ_MODEL = "gemini-nano-banana-2.1";

type GeminiRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function toGeminiAspectRatio(ratio: Ratio): GeminiRatio {
  switch (ratio) {
    case "1:1":
    case "4:3":
    case "9:16":
    case "16:9":
      return ratio;
    case "3:2":
      return "4:3";
  }
}

function parseDataUrl(url?: string): { mimeType: string; data: string } | null {
  if (!url || !url.startsWith("data:image/")) return null;
  const match = url.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function cleanGeminiError(error: unknown): Error {
  const raw = error instanceof Error ? error.message : String(error ?? "Gemini request failed.");
  const sanitized = raw.replace(/AIza[0-9A-Za-z_-]+/g, "").trim();
  if (/PERMISSION_DENIED|\b403\b/i.test(sanitized)) {
    return new Error("Gemini permission denied (403). Check or select a Gemini API key in Settings > Secrets.");
  }
  if (/API_KEY_INVALID|API key not valid/i.test(sanitized)) {
    return new Error("Gemini rejected the API key (400). Verify or select a Gemini API key in Settings > Secrets.");
  }
  if (/RESOURCE_EXHAUSTED|\b429\b/i.test(sanitized)) {
    return new Error("Gemini quota or billing tier limit reached (429). A billing-enabled key is required for image models.");
  }
  if (/NOT_FOUND|\b404\b/i.test(sanitized)) {
    return new Error(`Gemini model not found (404): ${sanitized.slice(0, 180)}`);
  }
  return new Error(sanitized.slice(0, 220) || "Gemini request failed.");
}

export async function enhanceIdeaWithGemini(facts: string): Promise<string> {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: facts,
      config: {
        systemInstruction:
          "Rewrite this architectural visualization request as one sentence a designer would type. Name the space, the materials, and the light. Keep the camera and layout. No labels, no bullet list, under 40 words.",
      },
    });
    const text = response.text?.replace(/\s+/g, " ").trim();
    if (!text) {
      throw new Error("Gemini returned an empty prompt enhancement.");
    }
    return text.slice(0, 400);
  } catch (error) {
    throw cleanGeminiError(error);
  }
}

export async function generateImageWithGemini(
  prompt: string,
  frame: Frame,
  options?: {
    sourceImage?: string;
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
    aspectOverride?: GeminiRatio;
  },
): Promise<string> {
  try {
    const ai = getGeminiClient();
    const useHq = frame.resolution === "2k";
    const model = useHq ? GEMINI_IMAGE_HQ_MODEL : GEMINI_IMAGE_FAST_MODEL;

    const parts: Part[] = [];
    const attachments: Array<[string, string | undefined]> = [
      ["Architectural base scene to preserve and render", options?.sourceImage],
      ["Line sketch / perspective structural contour guide", options?.sketchImage !== options?.sourceImage ? options?.sketchImage : undefined],
      ["White-on-black mask defining the ONLY editable region", options?.maskImage],
      ["True 3D WebGL Z-depth buffer map for spatial distance lock", options?.depthImage],
      ["Surface normal XYZ orientation map for plane alignment", options?.normalImage],
      ["Untextured clay AO massing geometry reference", options?.clayImage],
      ["ControlNet Annotator structural edge map", options?.annotatorImage],
      ["Massing & compositional style reference", options?.styleRefImage],
      ["Material & surface texture reference", options?.materialRefImage],
      ["Atmosphere & lighting palette reference", options?.lightingRefImage],
      ["Paint-by-Example inserted object or material reference", options?.exampleRefImage],
    ];

    const notes: string[] = [];
    let idx = 1;
    for (const [desc, rawUrl] of attachments) {
      const parsed = parseDataUrl(rawUrl);
      if (parsed) {
        parts.push({ inlineData: parsed });
        notes.push(`Image #${idx}: ${desc}.`);
        idx++;
      }
    }

    parts.push({
      text: notes.length > 0 ? `${notes.join(" ")}\n\n${prompt}` : prompt,
    });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: options?.aspectOverride ?? toGeminiAspectRatio(frame.ratio),
          ...(useHq ? { imageSize: "2K" } : {}),
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? "image/png";
        return `data:${mime};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Gemini did not return an image output.");
  } catch (error) {
    throw cleanGeminiError(error);
  }
}
