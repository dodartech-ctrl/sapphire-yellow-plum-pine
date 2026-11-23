import { n as parseImageDimensionsFromDataUrl, t as buildPixelLockedCameraContract } from "./image-aspect-mHAG7qZJ.mjs";
import { n as Type, t as GoogleGenAI } from "../_libs/@google/genai.mjs";
import path from "node:path";
import { readFile } from "node:fs/promises";
// node_modules/.nitro/vite/services/ssr/assets/gemini.server-DtmVtL-S.js
var GEMINI_TEXT_MODEL = "gemini-4-hydrogen";
var GEMINI_IMAGE_FAST_MODEL = "gemini-3.1-flash-lite-image";
var GEMINI_IMAGE_HQ_MODEL = "gemini-nano-banana-2.1";
var ENV_KEY_ORDER = [
	"GOOGLE_GEMINI_API_KEY",
	"GEMINI_API_KEY",
	"GOOGLE_API_KEY",
	"API_KEY",
	"api",
	"API",
	"update",
	"UPDATE"
];
var PLACEHOLDER_KEY_RE = /^(placeholder|undefined|null|changeme|your[_-]?api[_-]?key|my[_-]?gemini[_-]?api[_-]?key|test|demo)$/i;
function resolveGeminiApiKeys() {
	const keys = [];
	for (const source of ENV_KEY_ORDER) {
		const raw = process.env[source]?.trim();
		if (!raw) continue;
		const cleaned = raw.replace(/^["']+|["']+$/g, "").trim();
		if (cleaned.length >= 12 && !PLACEHOLDER_KEY_RE.test(cleaned) && !keys.includes(cleaned)) keys.push(cleaned);
	}
	return keys;
}
function resolveGeminiApiKey() {
	return resolveGeminiApiKeys()[0] ?? "";
}
function hasGeminiKey() {
	return Boolean(resolveGeminiApiKey());
}
function isGeminiAuthError(error) {
	const msg = error instanceof Error ? error.message : String(error ?? "");
	return /rejected the API key|permission denied|API_KEY_INVALID|API key not valid|PERMISSION_DENIED|\b400\b|\b403\b|not configured/i.test(msg);
}
function getGeminiStatus() {
	return {
		configured: hasGeminiKey(),
		textModel: GEMINI_TEXT_MODEL,
		fastImageModel: GEMINI_IMAGE_FAST_MODEL,
		hqImageModel: GEMINI_IMAGE_HQ_MODEL
	};
}
function createGeminiClient(apiKey, vertexai = false) {
	return new GoogleGenAI({
		apiKey,
		...vertexai ? { vertexai: true } : {},
		httpOptions: { headers: { "User-Agent": "aistudio-build" } }
	});
}
function withRequestTimeout(promise, timeoutMs, label) {
	const safeMs = Math.max(3e3, Math.min(9e4, Math.round(timeoutMs)));
	let timer;
	return new Promise((resolve, reject) => {
		timer = setTimeout(() => {
			reject(/* @__PURE__ */ new Error(`${label} timed out after ${Math.round(safeMs / 1e3)}s.`));
		}, safeMs);
		promise.then((value) => {
			if (timer) clearTimeout(timer);
			resolve(value);
		}).catch((error) => {
			if (timer) clearTimeout(timer);
			reject(error);
		});
	});
}
async function withGeminiClient(fn, timeoutMs = 24e3, label = "Gemini") {
	const keys = resolveGeminiApiKeys();
	if (keys.length === 0) throw new Error("GEMINI_API_KEY is not configured on the server.");
	let lastErr;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const modes = key.startsWith("AQ.") ? [false, true] : [false];
		for (let m = 0; m < modes.length; m++) try {
			return await withRequestTimeout(fn(createGeminiClient(key, modes[m])), timeoutMs, label);
		} catch (error) {
			lastErr = error;
			const cleaned = cleanGeminiError(error);
			const hasMoreModes = m < modes.length - 1;
			const hasMoreKeys = i < keys.length - 1;
			if ((hasMoreModes || hasMoreKeys) && isGeminiAuthError(cleaned)) continue;
			throw error;
		}
	}
	throw lastErr;
}
function toGeminiAspectRatio(ratio) {
	switch (ratio) {
		case "1:1":
		case "4:3":
		case "3:2":
		case "9:16":
		case "16:9": return ratio;
	}
}
function parseDataUrl(url) {
	if (!url || !url.startsWith("data:image/")) return null;
	const match = url.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
	if (!match) return null;
	return {
		mimeType: match[1],
		data: match[2]
	};
}
function cleanGeminiError(error) {
	const sanitized = (error instanceof Error ? error.message : String(error ?? "Gemini request failed.")).replace(/AIza[0-9A-Za-z_-]+/g, "").replace(/AQ\.[0-9A-Za-z._-]+/g, "").trim();
	if (/PERMISSION_DENIED|\b403\b/i.test(sanitized)) return /* @__PURE__ */ new Error(`Gemini permission denied (403). Check or select a Gemini API key in Settings > Secrets. (${sanitized.slice(0, 140)})`);
	if (/API_KEY_INVALID|API key not valid/i.test(sanitized)) return /* @__PURE__ */ new Error("Gemini rejected the API key (400). Verify or select a Gemini API key in Settings > Secrets.");
	if (/RESOURCE_EXHAUSTED|\b429\b/i.test(sanitized)) return /* @__PURE__ */ new Error("Gemini quota or billing tier limit reached (429). A billing-enabled key is required for image models.");
	if (/NOT_FOUND|\b404\b/i.test(sanitized)) return /* @__PURE__ */ new Error(`Gemini model not found (404): ${sanitized.slice(0, 180)}`);
	return new Error(sanitized.slice(0, 220) || "Gemini request failed.");
}
async function enhanceIdeaWithGemini(facts) {
	try {
		const text = (await withGeminiClient((ai) => ai.models.generateContent({
			model: GEMINI_TEXT_MODEL,
			contents: facts,
			config: { systemInstruction: "Rewrite this architectural visualization request as one sentence a designer would type. Name the space, the materials, and the light. Keep the camera and layout. No labels, no bullet list, under 40 words." }
		}), 1e4, "Gemini prompt enhance")).text?.replace(/\s+/g, " ").trim();
		if (!text) throw new Error("Gemini returned an empty prompt enhancement.");
		return text.slice(0, 400);
	} catch (error) {
		throw cleanGeminiError(error);
	}
}
async function detectGroundedSam2BoxesWithGemini(sourceImage, targetPrompt, clickPoint) {
	const parsed = parseDataUrl(sourceImage);
	if (!parsed) throw new Error("Source image must be a valid image data URL for Grounded-SAM 2 detection.");
	try {
		const cleanPrompt = targetPrompt.trim().slice(0, 120) || "architectural element";
		const clickPrompt = clickPoint ? `The user clicked at normalized coordinate (y=${Math.round(clickPoint.yNorm * 1e3)}, x=${Math.round(clickPoint.xNorm * 1e3)}) in 0..1000 space. Identify the exact architectural element or furniture item at that point (e.g. window glazing, facade panel, sofa, dining table, floor rug, ceiling) and return its tight 2D bounding box [ymin, xmin, ymax, xmax] with concise label and confidence score.` : `Locate every "${cleanPrompt}" instance in this architectural scene. Return tight 2D bounding boxes in normalized 0..1000 coordinates [ymin, xmin, ymax, xmax] with concise label and confidence score.`;
		const rawText = (await withGeminiClient((ai) => ai.models.generateContent({
			model: GEMINI_TEXT_MODEL,
			contents: { parts: [{ inlineData: parsed }, { text: clickPrompt }] },
			config: {
				responseMimeType: "application/json",
				responseSchema: {
					type: Type.OBJECT,
					properties: { boxes: {
						type: Type.ARRAY,
						items: {
							type: Type.OBJECT,
							properties: {
								label: { type: Type.STRING },
								box_2d: {
									type: Type.ARRAY,
									items: { type: Type.NUMBER }
								},
								confidence: { type: Type.NUMBER }
							},
							required: [
								"label",
								"box_2d",
								"confidence"
							]
						}
					} },
					required: ["boxes"]
				}
			}
		}), 12e3, "Gemini SAM-2 detection")).text?.trim();
		if (!rawText) return [];
		const parsedJson = JSON.parse(rawText);
		const list = Array.isArray(parsedJson?.boxes) ? parsedJson.boxes : [];
		const normalized = [];
		for (const item of list.slice(0, 8)) {
			if (!item || typeof item !== "object") continue;
			const rec = item;
			if (!Array.isArray(rec.box_2d) || rec.box_2d.length !== 4) continue;
			const [ymin, xmin, ymax, xmax] = rec.box_2d.map((n) => Math.max(0, Math.min(1e3, Number(n) || 0)));
			if (ymax <= ymin + 8 || xmax <= xmin + 8) continue;
			normalized.push({
				label: typeof rec.label === "string" && rec.label.trim() ? rec.label.trim().slice(0, 32) : cleanPrompt,
				box_2d: [
					ymin,
					xmin,
					ymax,
					xmax
				],
				confidence: Math.max(.1, Math.min(1, Number(rec.confidence) || .85))
			});
		}
		return normalized;
	} catch (error) {
		throw cleanGeminiError(error);
	}
}
async function generateImageWithGemini(prompt, frame, options) {
	try {
		const requestedSize = options?.imageSizeOverride ?? (frame.resolution === "2k" ? "2K" : "1K");
		const useHq = requestedSize === "2K" || requestedSize === "4K";
		const model = options?.modelOverride || "gemini-nano-banana-2.1";
		const maxRefs = Math.max(1, Math.min(8, options?.maxReferences ?? 4));
		const maxChars = Math.max(600, Math.min(8e3, options?.maxPromptChars ?? 3200));
		const timeoutMs = options?.timeoutMs ?? (model === "gemini-3.1-flash-lite-image" ? 16e3 : useHq ? 34e3 : 22e3);
		const sourceDims = parseImageDimensionsFromDataUrl(options?.sourceImage);
		const lockSource = Boolean(options?.sourceImage) && options?.lockSourceAspect !== false && !options?.aspectOverride;
		const resolvedAspectRatio = options?.aspectOverride ?? (lockSource && sourceDims ? sourceDims.geminiRatio : toGeminiAspectRatio(frame.ratio));
		const parts = [];
		const attachments = [
			["Uploaded architectural source image to preserve pixel-for-pixel (locked camera, framing, and geometry)", options?.sourceImage],
			["Mask overlay highlighting the ONLY editable target region", options?.maskImage],
			["Line sketch / perspective structural contour guide", options?.sketchImage !== options?.sourceImage ? options?.sketchImage : void 0],
			["True 3D WebGL Z-depth buffer map for spatial distance lock", options?.depthImage],
			["Surface normal XYZ orientation map for plane alignment", options?.normalImage],
			["Untextured clay AO massing geometry reference", options?.clayImage],
			["ControlNet Annotator structural edge map", options?.annotatorImage],
			["Massing & compositional style reference", options?.styleRefImage],
			["Material & surface texture reference", options?.materialRefImage],
			["Atmosphere & lighting palette reference", options?.lightingRefImage],
			["Paint-by-Example inserted object or material reference", options?.exampleRefImage]
		];
		const notes = [];
		let idx = 1;
		for (const [desc, rawUrl] of attachments) {
			if (idx > maxRefs) break;
			const parsed = parseDataUrl(rawUrl);
			if (parsed) {
				parts.push({ inlineData: parsed });
				notes.push(`Image #${idx}: ${desc}.`);
				idx++;
			}
		}
		const pixelCameraLock = lockSource && options?.sourceImage ? buildPixelLockedCameraContract(sourceDims, options?.geometryLock ?? 90) : "";
		const maskConstraint = options?.maskImage ? "CRITICAL INPAINTING CONSTRAINT: Keep all unmasked pixels in Image #1 pixel-identical. Apply edits strictly inside the highlighted region of the mask image with seamless contact shadows and matching lighting." : "";
		const concisePrompt = [
			notes.length > 0 ? notes.join(" ") : "",
			pixelCameraLock,
			maskConstraint,
			prompt
		].filter(Boolean).join("\n\n").slice(0, maxChars);
		parts.push({ text: concisePrompt });
		const resolvedImageSize = requestedSize === "2K" || requestedSize === "4K" || requestedSize === "1K" ? requestedSize : "1K";
		const response = await withGeminiClient((ai) => ai.models.generateContent({
			model,
			contents: { parts },
			config: { imageConfig: {
				aspectRatio: resolvedAspectRatio,
				...model !== "gemini-3.1-flash-lite-image" ? { imageSize: resolvedImageSize } : {}
			} }
		}), timeoutMs, `Gemini ${model}`);
		for (const part of response.candidates?.[0]?.content?.parts ?? []) if (part.inlineData?.data) return `data:${part.inlineData.mimeType ?? "image/png"};base64,${part.inlineData.data}`;
		throw new Error("Gemini did not return an image output.");
	} catch (error) {
		throw cleanGeminiError(error);
	}
}
async function resolveGeminiVisionImagePart(imageUrl, fetchFn = fetch) {
	const inline = parseDataUrl(imageUrl);
	if (inline) {
		if (inline.data.length > 8e6) throw new Error("Image payload is too large for Gemini Vision analysis.");
		return { inlineData: inline };
	}
	if (imageUrl.startsWith("/viz/")) {
		const vizDir = path.resolve(process.cwd(), "public", "viz");
		const rel = imageUrl.slice(5).split("?")[0] ?? "";
		const resolved = path.resolve(vizDir, rel);
		if (!resolved.startsWith(`${vizDir}${path.sep}`)) throw new Error("Invalid local asset path.");
		const ext = path.extname(resolved).toLowerCase();
		const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "";
		if (!mimeType) throw new Error("Unsupported local image extension.");
		const buf = await readFile(resolved);
		if (buf.byteLength === 0 || buf.byteLength > 6e6) throw new Error("Local image size must be between 1 byte and 6 MB.");
		return { inlineData: {
			mimeType,
			data: buf.toString("base64")
		} };
	}
	let parsedUrl;
	try {
		parsedUrl = new URL(imageUrl);
	} catch {
		throw new Error("imageUrl must be a valid https:// URL, /viz/ asset, or base64 image data URL.");
	}
	if (parsedUrl.protocol !== "https:") throw new Error("Remote imageUrl must use https:// protocol.");
	const res = await fetchFn(parsedUrl.toString(), { signal: AbortSignal.timeout(15e3) });
	if (!res.ok) throw new Error(`Could not fetch imageUrl (HTTP ${res.status}).`);
	const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() || "image/jpeg";
	if (!contentType.startsWith("image/")) throw new Error("Remote URL did not return an image content type.");
	const buf = Buffer.from(await res.arrayBuffer());
	if (buf.byteLength === 0 || buf.byteLength > 6e6) throw new Error("Remote image size must be between 1 byte and 6 MB.");
	return { inlineData: {
		mimeType: contentType,
		data: buf.toString("base64")
	} };
}
async function handleGeminiVisionRequest(request, deps) {
	if (!deps?.client && !hasGeminiKey()) return Response.json({
		error: "GEMINI_API_KEY is not configured. Select or add a Gemini API key in Settings > Secrets.",
		configured: false
	}, { status: 503 });
	let body;
	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
	}
	const prompt = typeof body.prompt === "string" && body.prompt.trim() ? body.prompt.trim().slice(0, 2e3) : "What is in this architectural image?";
	const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
	const stream = body.stream !== false;
	const seed = typeof body.seed === "number" && Number.isFinite(body.seed) ? Math.floor(body.seed) : void 0;
	if (!imageUrl) return Response.json({ error: "imageUrl is required." }, { status: 400 });
	let imagePart;
	try {
		imagePart = await resolveGeminiVisionImagePart(imageUrl, deps?.fetchFn);
	} catch (error) {
		return Response.json({ error: error instanceof Error ? error.message : "Invalid imageUrl." }, { status: 400 });
	}
	const runWithClient = (fn) => deps?.client ? fn(deps.client) : withGeminiClient(fn);
	if (!stream) try {
		const text = (await runWithClient((ai) => ai.models.generateContent({
			model: "gemini-4-hydrogen",
			contents: { parts: [imagePart, { text: prompt }] },
			config: {
				systemInstruction: "You are an architectural visualization specialist. Analyze geometry, materials, daylighting, optics, and furnishings clearly and concisely.",
				...seed !== void 0 ? { seed } : {}
			}
		}))).text ?? "";
		return Response.json({
			model: GEMINI_TEXT_MODEL,
			choices: [{ message: { content: text } }]
		});
	} catch (error) {
		const cleaned = cleanGeminiError(error);
		return Response.json({ error: cleaned.message }, { status: 502 });
	}
	const encoder = new TextEncoder();
	const sseStream = new ReadableStream({ async start(controller) {
		try {
			const streamRes = await runWithClient((ai) => ai.models.generateContentStream({
				model: GEMINI_TEXT_MODEL,
				contents: { parts: [imagePart, { text: prompt }] },
				config: {
					systemInstruction: "You are an architectural visualization specialist. Analyze geometry, materials, daylighting, optics, and furnishings clearly and concisely.",
					...seed !== void 0 ? { seed } : {}
				}
			}));
			for await (const chunk of streamRes) {
				const text = chunk.text;
				if (text) {
					const payload = JSON.stringify({ choices: [{ delta: { content: text } }] });
					controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
				}
			}
			controller.enqueue(encoder.encode("data: [DONE]\n\n"));
		} catch (error) {
			const cleaned = cleanGeminiError(error);
			const errPayload = JSON.stringify({ error: { message: cleaned.message } });
			controller.enqueue(encoder.encode(`data: ${errPayload}\n\n`));
		} finally {
			controller.close();
		}
	} });
	return new Response(sseStream, {
		status: 200,
		headers: {
			"Content-Type": "text/event-stream; charset=utf-8",
			"Cache-Control": "no-cache, no-transform",
			Connection: "keep-alive"
		}
	});
}
export { detectGroundedSam2BoxesWithGemini, enhanceIdeaWithGemini, generateImageWithGemini, getGeminiStatus, handleGeminiVisionRequest, hasGeminiKey, isGeminiAuthError };
