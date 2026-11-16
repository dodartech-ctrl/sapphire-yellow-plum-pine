import { env } from "@/lib/env.server";
import type { Frame } from "@/lib/frame";
import type { DetectedSamBox } from "@/lib/gemini.server";
import {
  NVIDIA_FLUX_DEV_URL,
  NVIDIA_FLUX_SCHNELL_URL,
  NVIDIA_INVOKE_URL,
  NVIDIA_VISION_MODEL,
  buildNvidiaFluxPayload,
  buildNvidiaVisionPayload,
  isValidVisionImageUrl,
  parseNvidiaFluxResponse,
  sanitizeNvidiaVisionError,
  type NvidiaVisionRequestInput,
} from "@/lib/nvidia-vision";

export function hasNvidiaKey(): boolean {
  return Boolean(env("NVIDIA_API_KEY"));
}

export function getNvidiaVisionStatus() {
  return {
    configured: hasNvidiaKey(),
    model: NVIDIA_VISION_MODEL,
    invokeUrl: NVIDIA_INVOKE_URL,
    imageModel: "black-forest-labs/flux.1-dev",
    fastImageModel: "black-forest-labs/flux.1-schnell",
    imageEndpoints: [NVIDIA_FLUX_DEV_URL, NVIDIA_FLUX_SCHNELL_URL],
  };
}

export async function generateImageWithNvidia(
  prompt: string,
  frame: Frame,
  options?: {
    seed?: number;
    fast?: boolean;
    depthImage?: string;
    annotatorImage?: string;
    sketchImage?: string;
    sourceImage?: string;
  },
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const apiKey = env("NVIDIA_API_KEY");
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured on the server.");
  }

  const { endpoint, payload } = buildNvidiaFluxPayload({
    prompt,
    ratio: frame.ratio,
    seed: options?.seed,
    fast: options?.fast && frame.resolution !== "2k",
    steps: frame.resolution === "2k" ? 45 : 34,
    depthImage: options?.depthImage,
    cannyImage: options?.annotatorImage ?? options?.sketchImage,
  });

  const response = await fetchImpl(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(55_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(sanitizeNvidiaVisionError(detail || `NVIDIA NIM returned HTTP ${response.status}.`));
  }

  const json = await response.json();
  return parseNvidiaFluxResponse(json);
}

export async function enhanceIdeaWithNvidia(
  facts: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const apiKey = env("NVIDIA_API_KEY");
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured on the server.");
  }

  const response = await fetchImpl(NVIDIA_INVOKE_URL, {
    method: "POST",
    signal: AbortSignal.timeout(15_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: NVIDIA_VISION_MODEL,
      temperature: 0.5,
      top_p: 0.9,
      max_tokens: 512,
      seed: 0,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "Rewrite this architectural visualization request as one sentence a designer would type. Name the space, materials, and lighting. Keep camera and layout. No labels, no bullet points, under 40 words.",
        },
        {
          role: "user",
          content: facts,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(sanitizeNvidiaVisionError(detail || `NVIDIA prompt refine failed (${response.status}).`));
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const text = json.choices?.[0]?.message?.content?.replace(/\s+/g, " ").trim();
  if (!text) {
    throw new Error("NVIDIA NIM returned an empty prompt enhancement.");
  }
  return text.slice(0, 400);
}

export async function detectGroundedSam2BoxesWithNvidia(
  sourceImage: string,
  targetPrompt: string,
  clickPoint?: { xNorm: number; yNorm: number },
  fetchImpl: typeof fetch = fetch,
): Promise<DetectedSamBox[]> {
  const apiKey = env("NVIDIA_API_KEY");
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured on the server.");
  }
  if (!isValidVisionImageUrl(sourceImage)) {
    throw new Error("Source image must be a valid image URL or base64 data URL for Grounded-SAM 2 detection.");
  }

  const cleanPrompt = targetPrompt.trim().slice(0, 120) || "architectural element";
  const instruction = clickPoint
    ? `The user clicked at normalized coordinates (y=${Math.round(clickPoint.yNorm * 1000)}, x=${Math.round(clickPoint.xNorm * 1000)}) in 0..1000 image space. Identify the architectural element or furniture item at that point and return ONLY valid JSON: {"boxes":[{"label":"string","box_2d":[ymin,xmin,ymax,xmax],"confidence":0.95}]}. Coordinates must be numbers 0..1000.`
    : `Locate every "${cleanPrompt}" instance in this architectural scene. Return ONLY valid JSON: {"boxes":[{"label":"string","box_2d":[ymin,xmin,ymax,xmax],"confidence":0.9}]}. Coordinates must be numbers 0..1000.`;

  const payload = buildNvidiaVisionPayload({
    prompt: instruction,
    imageUrl: sourceImage,
    stream: false,
    maxTokens: 1024,
    temperature: 0.2,
    topP: 0.9,
    seed: 0,
  });

  const response = await fetchImpl(NVIDIA_INVOKE_URL, {
    method: "POST",
    signal: AbortSignal.timeout(25_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(sanitizeNvidiaVisionError(detail || `NVIDIA Grounded-SAM failed (${response.status}).`));
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const rawContent = json.choices?.[0]?.message?.content?.trim() ?? "";
  if (!rawContent) return [];

  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  const parsedJson = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent) as { boxes?: unknown[] };
  const list = Array.isArray(parsedJson?.boxes) ? parsedJson.boxes : [];
  const normalized: DetectedSamBox[] = [];

  for (const item of list.slice(0, 8)) {
    if (!item || typeof item !== "object") continue;
    const rec = item as { label?: unknown; box_2d?: unknown; confidence?: unknown };
    if (!Array.isArray(rec.box_2d) || rec.box_2d.length !== 4) continue;
    const [ymin, xmin, ymax, xmax] = rec.box_2d.map((n) => Math.max(0, Math.min(1000, Number(n) || 0)));
    if (ymax <= ymin + 8 || xmax <= xmin + 8) continue;
    normalized.push({
      label: typeof rec.label === "string" && rec.label.trim() ? rec.label.trim().slice(0, 32) : cleanPrompt,
      box_2d: [ymin, xmin, ymax, xmax],
      confidence: Math.max(0.1, Math.min(1, Number(rec.confidence) || 0.85)),
    });
  }

  return normalized;
}

export async function handleNvidiaVisionRequest(
  request: Request,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  const apiKey = env("NVIDIA_API_KEY");
  if (!apiKey) {
    return Response.json(
      {
        error:
          "NVIDIA_API_KEY is not configured on the server. Add NVIDIA_API_KEY in Environment Secrets to stream minimaxai/minimax-m3.1-flash vision responses.",
        configured: false,
        model: NVIDIA_VISION_MODEL,
      },
      { status: 503 },
    );
  }

  let body: Partial<NvidiaVisionRequestInput>;
  try {
    body = (await request.json()) as Partial<NvidiaVisionRequestInput>;
  } catch {
    return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  let payload: ReturnType<typeof buildNvidiaVisionPayload>;
  try {
    payload = buildNvidiaVisionPayload({
      prompt: body.prompt,
      imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : "",
      stream: body.stream,
      maxTokens: body.maxTokens,
      seed: body.seed,
      temperature: body.temperature,
      topP: body.topP,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid vision request parameters." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetchImpl(NVIDIA_INVOKE_URL, {
      method: "POST",
      signal: AbortSignal.timeout(60_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: payload.stream ? "text/event-stream" : "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return Response.json(
        {
          error: sanitizeNvidiaVisionError(detail || `NVIDIA NIM returned HTTP ${upstream.status}.`),
          status: upstream.status,
        },
        { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502 },
      );
    }

    if (payload.stream) {
      return new Response(upstream.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const json = await upstream.json();
    return Response.json(json, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error: sanitizeNvidiaVisionError(
          error instanceof Error ? error.message : "Failed to reach NVIDIA NIM vision API.",
        ),
      },
      { status: 502 },
    );
  }
}
