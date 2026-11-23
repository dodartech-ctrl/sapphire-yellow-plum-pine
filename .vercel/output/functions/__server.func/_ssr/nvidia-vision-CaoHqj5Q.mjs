import { t as previewPathPrefix } from "./preview-path-prefix-CTp2BiBH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nvidia-vision-CaoHqj5Q.js
var NVIDIA_INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
var NVIDIA_VISION_MODEL = "minimaxai/minimax-m3.1-flash";
var NVIDIA_FLUX_DEV_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";
var NVIDIA_FLUX_SCHNELL_URL = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell";
var NVIDIA_SAMPLE_IMAGE_URL = "https://assets.ngc.nvidia.com/products/api-catalog/phi-3-5-vision/example1b.jpg";
var NVIDIA_DEFAULT_PROMPT = "What is in this image?";
var NVIDIA_VISION_QUICK_PROMPTS = [
	{
		id: "describe",
		label: "What is in this image?",
		prompt: "What is in this image?"
	},
	{
		id: "materials",
		label: "Materials & Palette",
		prompt: "Identify all architectural materials, surface finishes, flooring, wall treatments, and color palette in this image concisely."
	},
	{
		id: "lighting",
		label: "Lighting & Optics",
		prompt: "Analyze the lighting setup, sun angle, shadow softness, color temperature, and camera framing in this architectural view."
	},
	{
		id: "brief",
		label: "Convert to Render Prompt",
		prompt: "Write a single concise architectural visualization prompt (under 45 words) capturing the space, materials, lighting, and camera angle of this image."
	}
];
var MAX_IMAGE_DATA_URL_LENGTH = 4e6;
function isValidVisionImageUrl(raw) {
	if (typeof raw !== "string") return false;
	const trimmed = raw.trim();
	if (!trimmed || trimmed.length > MAX_IMAGE_DATA_URL_LENGTH) return false;
	if (/^data:image\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(trimmed)) return true;
	try {
		const parsed = new URL(trimmed);
		return parsed.protocol === "https:" || parsed.protocol === "http:";
	} catch {
		return false;
	}
}
function buildNvidiaVisionPayload(input) {
	const imageUrl = input.imageUrl.trim();
	if (!isValidVisionImageUrl(imageUrl)) throw new Error("Provide a valid HTTPS image URL or base64 image data URL.");
	const prompt = typeof input.prompt === "string" && input.prompt.trim().length > 0 ? input.prompt.trim().slice(0, 4e3) : NVIDIA_DEFAULT_PROMPT;
	const rawMaxTokens = Number(input.maxTokens);
	const maxTokens = Number.isFinite(rawMaxTokens) ? Math.max(64, Math.min(16384, Math.round(rawMaxTokens))) : 16384;
	const rawSeed = Number(input.seed);
	const seed = Number.isFinite(rawSeed) ? Math.max(0, Math.round(rawSeed)) : 0;
	const rawTemp = Number(input.temperature);
	const temperature = Number.isFinite(rawTemp) ? Math.max(0, Math.min(2, rawTemp)) : 1;
	const rawTopP = Number(input.topP);
	const topP = Number.isFinite(rawTopP) ? Math.max(.05, Math.min(1, rawTopP)) : .95;
	const stream = typeof input.stream === "boolean" ? input.stream : true;
	return {
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: prompt
			}, {
				type: "image_url",
				image_url: { url: imageUrl }
			}]
		}],
		model: NVIDIA_VISION_MODEL,
		max_tokens: maxTokens,
		seed,
		stream,
		temperature,
		top_p: topP
	};
}
function toNvidiaFluxDimensions(ratio) {
	switch (ratio) {
		case "16:9": return {
			width: 1344,
			height: 768
		};
		case "4:3": return {
			width: 1024,
			height: 768
		};
		case "3:2": return {
			width: 1152,
			height: 768
		};
		case "9:16": return {
			width: 768,
			height: 1344
		};
		default: return {
			width: 1024,
			height: 1024
		};
	}
}
function stripDataUrlPrefix(rawUrl) {
	if (!rawUrl || !rawUrl.startsWith("data:image/")) return void 0;
	const idx = rawUrl.indexOf(";base64,");
	if (idx === -1) return void 0;
	return rawUrl.slice(idx + 8).trim() || void 0;
}
function buildNvidiaFluxPayload(params) {
	const { width, height } = toNvidiaFluxDimensions(params.ratio);
	const cleanPrompt = params.prompt.trim().slice(0, 9500) || "Modern architectural studio visualization";
	const seed = Number.isFinite(Number(params.seed)) ? Math.max(0, Math.round(Number(params.seed))) : 0;
	const depthRaw = stripDataUrlPrefix(params.depthImage);
	const cannyRaw = stripDataUrlPrefix(params.cannyImage);
	const hasControlImage = Boolean(depthRaw || cannyRaw);
	const useSchnell = Boolean(params.fast) && !hasControlImage;
	const endpoint = useSchnell ? NVIDIA_FLUX_SCHNELL_URL : NVIDIA_FLUX_DEV_URL;
	const mode = depthRaw ? "depth" : cannyRaw ? "canny" : "base";
	const steps = useSchnell ? 4 : Math.max(5, Math.min(60, Math.round(Number(params.steps ?? 36))));
	return {
		endpoint,
		payload: {
			prompt: cleanPrompt,
			width,
			height,
			cfg_scale: useSchnell ? 0 : Math.max(1, Math.min(9, Number(params.cfgScale ?? 5))),
			steps,
			seed,
			samples: 1,
			...!useSchnell ? { mode } : {},
			...!useSchnell && (depthRaw || cannyRaw) ? { image: depthRaw ?? cannyRaw } : {}
		}
	};
}
function detectBase64ImageMime(base64) {
	const head = base64.slice(0, 12);
	if (head.startsWith("/9j/")) return "image/jpeg";
	if (head.startsWith("UklGR")) return "image/webp";
	return "image/png";
}
function parseNvidiaFluxResponse(json) {
	const data = json;
	const first = Array.isArray(data?.artifacts) ? data.artifacts[0] : void 0;
	if (!first || typeof first.base64 !== "string" || !first.base64.trim()) throw new Error("NVIDIA NIM FLUX returned no image artifact.");
	if (first.finishReason === "CONTENT_FILTERED") throw new Error("NVIDIA NIM filtered the image prompt. Try adjusting the architectural description.");
	const cleanB64 = first.base64.trim();
	return `data:${detectBase64ImageMime(cleanB64)};base64,${cleanB64}`;
}
function extractNvidiaSseDelta(rawLine) {
	const trimmed = rawLine.trim();
	if (!trimmed || trimmed.startsWith(":")) return {
		done: false,
		deltaText: "",
		reasoningText: ""
	};
	const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
	if (!payload) return {
		done: false,
		deltaText: "",
		reasoningText: ""
	};
	if (payload === "[DONE]") return {
		done: true,
		deltaText: "",
		reasoningText: ""
	};
	try {
		const parsed = JSON.parse(payload);
		if (parsed.error) return {
			done: true,
			deltaText: "",
			reasoningText: "",
			error: sanitizeNvidiaVisionError((typeof parsed.error === "string" ? parsed.error : parsed.error.message) || "NVIDIA vision stream failed.")
		};
		const choice = parsed.choices?.[0];
		return {
			done: false,
			deltaText: typeof choice?.delta?.content === "string" ? choice.delta.content : typeof choice?.message?.content === "string" ? choice.message.content : "",
			reasoningText: typeof choice?.delta?.reasoning_content === "string" ? choice.delta.reasoning_content : typeof choice?.message?.reasoning_content === "string" ? choice.message.reasoning_content : ""
		};
	} catch {
		return {
			done: false,
			deltaText: "",
			reasoningText: ""
		};
	}
}
function sanitizeNvidiaVisionError(raw) {
	return raw.replace(/nvapi-[A-Za-z0-9_-]+/g, "[REDACTED]").replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [REDACTED]").trim().slice(0, 260) || "NVIDIA NIM API request failed.";
}
function resolveNvidiaApiUrl(path = "/api/nvidia-vision") {
	if (typeof window === "undefined") return path;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? `${prefix}${path}` : path;
}
//#endregion
export { NVIDIA_SAMPLE_IMAGE_URL as a, buildNvidiaFluxPayload as c, isValidVisionImageUrl as d, parseNvidiaFluxResponse as f, NVIDIA_INVOKE_URL as i, buildNvidiaVisionPayload as l, sanitizeNvidiaVisionError as m, NVIDIA_FLUX_DEV_URL as n, NVIDIA_VISION_MODEL as o, resolveNvidiaApiUrl as p, NVIDIA_FLUX_SCHNELL_URL as r, NVIDIA_VISION_QUICK_PROMPTS as s, NVIDIA_DEFAULT_PROMPT as t, extractNvidiaSseDelta as u };
