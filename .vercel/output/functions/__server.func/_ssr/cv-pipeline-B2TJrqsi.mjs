import { r as __exportAll$1 } from "../_runtime.mjs";
// node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D8jQpDG7.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
// node_modules/.nitro/vite/services/ssr/assets/cv-pipeline-B2TJrqsi.js
var cv_pipeline_B2TJrqsi_exports = /* @__PURE__ */ __exportAll$1({ n: () => cv_pipeline_exports });
/**
* Extracts a strict binary bitmap (0 or 1 per pixel) from an RGBA canvas buffer.
* Supports both alpha-matted masks (e.g. amber paint strokes / SAM overlays)
* and grayscale luminance binary masks (black background / white foreground).
*/
function extractBinaryBitmapFromRgba(rgba, width, height, threshold = 24) {
	const safeW = Math.max(1, Math.round(width));
	const safeH = Math.max(1, Math.round(height));
	const totalPixels = safeW * safeH;
	const bitmap = new Uint8Array(totalPixels);
	let activePixels = 0;
	let xmin = safeW;
	let ymin = safeH;
	let xmax = -1;
	let ymax = -1;
	for (let y = 0; y < safeH; y++) for (let x = 0; x < safeW; x++) {
		const idx = y * safeW + x;
		const p = idx * 4;
		const r = rgba[p] ?? 0;
		const g = rgba[p + 1] ?? 0;
		const b = rgba[p + 2] ?? 0;
		const a = rgba[p + 3] ?? 0;
		const lum = .2126 * r + .7152 * g + .0722 * b;
		if (a >= 250 ? lum > threshold && a > threshold : a > threshold) {
			bitmap[idx] = 1;
			activePixels++;
			if (x < xmin) xmin = x;
			if (x > xmax) xmax = x;
			if (y < ymin) ymin = y;
			if (y > ymax) ymax = y;
		}
	}
	return {
		width: safeW,
		height: safeH,
		totalPixels,
		activePixels,
		coveragePct: activePixels > 0 ? Math.max(1, Math.round(activePixels / totalPixels * 100)) : 0,
		bbox: xmax >= xmin && ymax >= ymin ? {
			xmin,
			ymin,
			xmax,
			ymax
		} : null,
		bitmap
	};
}
/**
* Encodes a binary bitmap (0 | 1) into strict black (0,0,0,255) / white (255,255,255,255)
* RGBA binary image bytes for AI inpainting APIs (LaMa / ControlNet / Gemini Inpaint).
*/
function encodeBinaryBitmapToRgba(bitmap, width, height, invert = false) {
	const total = Math.max(1, width * height);
	const out = new Uint8ClampedArray(total * 4);
	for (let i = 0; i < total; i++) {
		const val = Boolean(bitmap[i]) !== invert ? 255 : 0;
		const p = i * 4;
		out[p] = val;
		out[p + 1] = val;
		out[p + 2] = val;
		out[p + 3] = 255;
	}
	return out;
}
/**
* Encodes a binary bitmap (0 | 1) into an amber transparent preview overlay
* for legible rendering on top of architectural imagery.
*/
function encodeBinaryBitmapToOverlayRgba(bitmap, width, height, rgb = [
	212,
	176,
	106
], alpha = 205) {
	const total = Math.max(1, width * height);
	const out = new Uint8ClampedArray(total * 4);
	for (let i = 0; i < total; i++) if (bitmap[i]) {
		const p = i * 4;
		out[p] = rgb[0];
		out[p + 1] = rgb[1];
		out[p + 2] = rgb[2];
		out[p + 3] = alpha;
	}
	return out;
}
/**
* Computes byte length summary for a base64 PNG binary mask data URL.
*/
function estimateDataUrlBytes(dataUrl) {
	if (!dataUrl) return 0;
	const commaIdx = dataUrl.indexOf(",");
	if (commaIdx < 0) return 0;
	const b64 = dataUrl.slice(commaIdx + 1);
	return Math.round(b64.length * 3 / 4);
}
var cv_pipeline_exports = /* @__PURE__ */ __exportAll({
	heuristicSemanticBoxesForPrompt: () => heuristicSemanticBoxesForPrompt,
	normalizeGroundedBoxes: () => normalizeGroundedBoxes
});
function rgbToLuminance(r, g, b) {
	return .2126 * r + .7152 * g + .0722 * b;
}
function computeSobelAt(lum, width, height, x, y) {
	const xm = Math.max(0, x - 1);
	const xp = Math.min(width - 1, x + 1);
	const ym = Math.max(0, y - 1);
	const yp = Math.min(height - 1, y + 1);
	const tl = lum[ym * width + xm] ?? 0;
	const tc = lum[ym * width + x] ?? 0;
	const tr = lum[ym * width + xp] ?? 0;
	const ml = lum[y * width + xm] ?? 0;
	const mr = lum[y * width + xp] ?? 0;
	const bl = lum[yp * width + xm] ?? 0;
	const bc = lum[yp * width + x] ?? 0;
	const br = lum[yp * width + xp] ?? 0;
	const gx = -tl + tr - 2 * ml + 2 * mr - bl + br;
	const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
	return {
		gx,
		gy,
		mag: Math.sqrt(gx * gx + gy * gy)
	};
}
/**
* Computes relative near-to-far depth score [0..1] combining vertical perspective cue,
* foreground luminance contrast, and camera distance falloff (Depth-Anything-V2 heuristic).
*/
function computeDepthScore(lum, yNorm, xNorm, nearBias = 50) {
	const verticalDepth = yNorm * .52 + (1 - Math.abs(xNorm - .5) * 1.4) * .14;
	const toneCue = (1 - lum / 255) * .24;
	const biasShift = (nearBias - 50) / 250;
	return Math.max(0, Math.min(1, verticalDepth + toneCue + .1 + biasShift));
}
/**
* Inferno colormap for Depth-Anything-V2 visualization (0 = far purple-black, 1 = near bright yellow).
*/
function infernoRamp(t) {
	const c = Math.max(0, Math.min(1, t));
	if (c < .25) {
		const k = c / .25;
		return [
			Math.round(12 + k * 78),
			Math.round(8 + k * 10),
			Math.round(32 + k * 84)
		];
	}
	if (c < .55) {
		const k = (c - .25) / .3;
		return [
			Math.round(90 + k * 112),
			Math.round(18 + k * 46),
			Math.round(116 - k * 24)
		];
	}
	if (c < .82) {
		const k = (c - .55) / .27;
		return [
			Math.round(202 + k * 46),
			Math.round(64 + k * 108),
			Math.round(92 - k * 64)
		];
	}
	const k = (c - .82) / .18;
	return [
		Math.round(248 + k * 7),
		Math.round(172 + k * 78),
		Math.round(28 + k * 136)
	];
}
/**
* Evaluates whether a pixel belongs to a SAM point-seeded or Grounded-SAM semantic region.
*/
function matchSemanticSegmentPixel(params) {
	const { r, g, b, xNorm, yNorm, prompt, seedRgb, seedPt, threshold } = params;
	if (seedRgb && seedPt) {
		const colorDist = Math.sqrt((r - seedRgb[0]) ** 2 + (g - seedRgb[1]) ** 2 + (b - seedRgb[2]) ** 2);
		const spatialDist = Math.hypot(xNorm - seedPt.xNorm, yNorm - seedPt.yNorm);
		const colorLimit = 22 + threshold * 1.15;
		const spatialLimit = .26 + threshold / 220;
		return colorDist <= colorLimit && spatialDist <= spatialLimit;
	}
	const p = prompt.trim().toLowerCase();
	const lum = rgbToLuminance(r, g, b);
	const sat = Math.max(r, g, b) - Math.min(r, g, b);
	if (p.includes("sky")) return yNorm < .45 && (b > r + 10 || lum > 175);
	if (p.includes("water") || p.includes("pool")) return yNorm > .45 && b >= r - 6 && b >= g - 12 && lum < 175;
	if (p.includes("tree") || p.includes("foliage") || p.includes("plant") || p.includes("landscape") || p.includes("garden")) return g > r + 8 && g >= b - 4 && sat > 18;
	if (p.includes("floor") || p.includes("ground") || p.includes("terrace") || p.includes("deck")) return yNorm > .62 && sat < 65;
	if (p.includes("roof") || p.includes("ceiling")) return yNorm < .44 && lum < 145 && sat < 55;
	if (p.includes("glass") || p.includes("glazing") || p.includes("window")) return yNorm > .22 && yNorm < .78 && b >= r - 8 && (lum < 120 || b > 140);
	return yNorm > .2 && yNorm < .78 && lum >= 95 && lum <= 228 && sat < 72;
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not load source image for preprocessing."));
		img.src = src;
	});
}
function prepareWorkCanvas(img, maxWidth = 768) {
	const natW = img.naturalWidth || 1280;
	const natH = img.naturalHeight || 720;
	const scale = Math.min(1, maxWidth / natW);
	const width = Math.max(160, Math.round(natW * scale));
	const height = Math.max(90, Math.round(natH * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) throw new Error("2D canvas unavailable");
	ctx.drawImage(img, 0, 0, width, height);
	return {
		canvas,
		ctx,
		width,
		height
	};
}
/**
* Executes lllyasviel/Annotators style structural edge, MLSD, LineArt, SoftEdge, or Normal Map extraction.
*/
async function runAnnotatorPass(src, mode, threshold = 58) {
	if (mode === "none") return {
		dataUrl: src,
		width: 1280,
		height: 720
	};
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(src), 768);
	const srcPx = ctx.getImageData(0, 0, width, height).data;
	const lum = new Float32Array(width * height);
	for (let i = 0; i < width * height; i++) {
		const p = i * 4;
		lum[i] = rgbToLuminance(srcPx[p], srcPx[p + 1], srcPx[p + 2]);
	}
	const out = ctx.createImageData(width, height);
	const dst = out.data;
	const gate = Math.max(18, 175 - threshold * 1.45);
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		const p = (y * width + x) * 4;
		const { gx, gy, mag } = computeSobelAt(lum, width, height, x, y);
		if (mode === "normal") {
			const nx = Math.max(-1, Math.min(1, -gx / 220));
			const ny = Math.max(-1, Math.min(1, -gy / 220));
			const nz = Math.sqrt(Math.max(.05, 1 - nx * nx - ny * ny));
			dst[p] = Math.round((nx * .5 + .5) * 255);
			dst[p + 1] = Math.round((ny * .5 + .5) * 255);
			dst[p + 2] = Math.round((nz * .5 + .5) * 255);
			dst[p + 3] = 255;
		} else if (mode === "lineart") {
			const ink = Math.max(0, Math.min(255, 255 - mag * (threshold / 42)));
			dst[p] = ink;
			dst[p + 1] = ink;
			dst[p + 2] = Math.min(255, ink + 4);
			dst[p + 3] = 255;
		} else if (mode === "mlsd") {
			const onLine = Math.max(Math.abs(gx), Math.abs(gy)) > gate * .9 && Math.abs(Math.abs(gx) - Math.abs(gy)) > gate * .22;
			dst[p] = onLine ? 245 : 14;
			dst[p + 1] = onLine ? 220 : 14;
			dst[p + 2] = onLine ? 165 : 18;
			dst[p + 3] = 255;
		} else if (mode === "softedge") {
			const soft = Math.max(0, Math.min(255, mag * (.65 + threshold / 120)));
			dst[p] = soft;
			dst[p + 1] = soft;
			dst[p + 2] = soft;
			dst[p + 3] = 255;
		} else {
			const edge = mag >= gate ? 255 : 0;
			dst[p] = edge;
			dst[p + 1] = edge;
			dst[p + 2] = edge;
			dst[p + 3] = 255;
		}
	}
	ctx.putImageData(out, 0, 0);
	return {
		dataUrl: canvas.toDataURL("image/png"),
		width,
		height
	};
}
/**
* Executes DepthAnything/Depth-Anything-V2 relative Z-depth map visualization.
*/
async function runDepthAnythingPass(src, heatmap = true, nearBias = 50) {
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(src), 768);
	const px = ctx.getImageData(0, 0, width, height).data;
	const out = ctx.createImageData(width, height);
	const dst = out.data;
	for (let y = 0; y < height; y++) {
		const yNorm = y / Math.max(1, height - 1);
		for (let x = 0; x < width; x++) {
			const xNorm = x / Math.max(1, width - 1);
			const p = (y * width + x) * 4;
			const d = computeDepthScore(rgbToLuminance(px[p], px[p + 1], px[p + 2]), yNorm, xNorm, nearBias);
			if (heatmap) {
				const [r, g, b] = infernoRamp(d);
				dst[p] = r;
				dst[p + 1] = g;
				dst[p + 2] = b;
			} else {
				const g = Math.round(d * 255);
				dst[p] = g;
				dst[p + 1] = g;
				dst[p + 2] = g;
			}
			dst[p + 3] = 255;
		}
	}
	ctx.putImageData(out, 0, 0);
	return {
		dataUrl: canvas.toDataURL("image/png"),
		width,
		height
	};
}
/**
* Executes facebookresearch/segment-anything (SAM point prompt) and Grounded-SAM (text prompt)
* architectural region segmentation, producing both visual overlay and an amber Krea Inpaint mask.
*/
async function runGroundedSamMask(params) {
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(params.src), 768);
	const px = ctx.getImageData(0, 0, width, height).data;
	let seedRgb = null;
	if (params.point) {
		const sx = Math.max(0, Math.min(width - 1, Math.round(params.point.xNorm * (width - 1))));
		const sp = (Math.max(0, Math.min(height - 1, Math.round(params.point.yNorm * (height - 1)))) * width + sx) * 4;
		seedRgb = [
			px[sp],
			px[sp + 1],
			px[sp + 2]
		];
	}
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = width;
	maskCanvas.height = height;
	const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
	if (!maskCtx) throw new Error("Mask canvas unavailable");
	const previewOut = ctx.createImageData(width, height);
	const maskOut = maskCtx.createImageData(width, height);
	const pDst = previewOut.data;
	const mDst = maskOut.data;
	const threshold = params.threshold ?? 45;
	let matchedCount = 0;
	const total = width * height;
	for (let y = 0; y < height; y++) {
		const yNorm = y / Math.max(1, height - 1);
		for (let x = 0; x < width; x++) {
			const xNorm = x / Math.max(1, width - 1);
			const p = (y * width + x) * 4;
			const r = px[p];
			const g = px[p + 1];
			const b = px[p + 2];
			if (matchSemanticSegmentPixel({
				r,
				g,
				b,
				xNorm,
				yNorm,
				prompt: params.prompt,
				seedRgb,
				seedPt: params.point,
				threshold
			})) {
				matchedCount++;
				pDst[p] = Math.min(255, Math.round(r * .45 + 119.9));
				pDst[p + 1] = Math.min(255, Math.round(g * .45 + 172 * .55));
				pDst[p + 2] = Math.min(255, Math.round(b * .45 + 88 * .55));
				pDst[p + 3] = 255;
				mDst[p] = 212;
				mDst[p + 1] = 176;
				mDst[p + 2] = 106;
				mDst[p + 3] = 205;
			} else {
				pDst[p] = Math.round(r * .58);
				pDst[p + 1] = Math.round(g * .58);
				pDst[p + 2] = Math.round(b * .58);
				pDst[p + 3] = 255;
				mDst[p] = 0;
				mDst[p + 1] = 0;
				mDst[p + 2] = 0;
				mDst[p + 3] = 0;
			}
		}
	}
	ctx.putImageData(previewOut, 0, 0);
	maskCtx.putImageData(maskOut, 0, 0);
	return {
		previewUrl: canvas.toDataURL("image/jpeg", .9),
		maskDataUrl: maskCanvas.toDataURL("image/png"),
		coveragePct: Math.round(matchedCount / Math.max(1, total) * 100)
	};
}
var MATERIAL_ID_CLASSES = [
	{
		id: "sky",
		label: "Sky",
		rgb: [
			110,
			178,
			245
		],
		hex: "#6eb2f5"
	},
	{
		id: "glazing",
		label: "Glazing",
		rgb: [
			45,
			212,
			191
		],
		hex: "#2dd4bf"
	},
	{
		id: "foliage",
		label: "Foliage",
		rgb: [
			74,
			222,
			128
		],
		hex: "#4ade80"
	},
	{
		id: "water",
		label: "Water",
		rgb: [
			56,
			130,
			246
		],
		hex: "#3882f6"
	},
	{
		id: "paving",
		label: "Road / Paving",
		rgb: [
			148,
			163,
			184
		],
		hex: "#94a3b8"
	},
	{
		id: "warm-clad",
		label: "Timber / Brick",
		rgb: [
			249,
			115,
			22
		],
		hex: "#f97316"
	},
	{
		id: "roof",
		label: "Roof / Trim",
		rgb: [
			168,
			85,
			247
		],
		hex: "#a855f7"
	},
	{
		id: "facade",
		label: "Facade Wall",
		rgb: [
			250,
			204,
			21
		],
		hex: "#facc15"
	}
];
/**
* Classifies a pixel into a flat Material ID RGB color matching ARCHVIZ-Prompt-Dictionary-Builder's
* material-id-map specification (solid flat color per architectural material/surface class).
*/
function classifyMaterialIdPixel(r, g, b, xNorm, yNorm) {
	const lum = rgbToLuminance(r, g, b);
	const sat = Math.max(r, g, b) - Math.min(r, g, b);
	if (yNorm < .36 && (b > r + 8 || lum > 188) && sat < 85) return {
		id: "sky",
		rgb: [
			110,
			178,
			245
		]
	};
	if (g > r + 8 && g >= b - 4 && sat > 18) return {
		id: "foliage",
		rgb: [
			74,
			222,
			128
		]
	};
	if (yNorm > .5 && b > r + 14 && b >= g && lum < 175) return {
		id: "water",
		rgb: [
			56,
			130,
			246
		]
	};
	if (yNorm > .16 && yNorm < .78 && b >= r - 4 && (lum < 105 || b > 135 && sat > 22)) return {
		id: "glazing",
		rgb: [
			45,
			212,
			191
		]
	};
	if (yNorm > .66 && sat < 55) return {
		id: "paving",
		rgb: [
			148,
			163,
			184
		]
	};
	if (r > b + 22 && r >= g + 6 && sat > 24 && xNorm >= 0) return {
		id: "warm-clad",
		rgb: [
			249,
			115,
			22
		]
	};
	if (yNorm < .42 && lum < 130 && sat < 48) return {
		id: "roof",
		rgb: [
			168,
			85,
			247
		]
	};
	return {
		id: "facade",
		rgb: [
			250,
			204,
			21
		]
	};
}
/**
* Generates a flat, unshaded Material ID segmentation map for architectural masking and editing.
*/
async function runMaterialIdPass(src) {
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(src), 768);
	const px = ctx.getImageData(0, 0, width, height).data;
	const out = ctx.createImageData(width, height);
	const dst = out.data;
	for (let y = 0; y < height; y++) {
		const yNorm = y / Math.max(1, height - 1);
		for (let x = 0; x < width; x++) {
			const xNorm = x / Math.max(1, width - 1);
			const p = (y * width + x) * 4;
			const { rgb } = classifyMaterialIdPixel(px[p], px[p + 1], px[p + 2], xNorm, yNorm);
			dst[p] = rgb[0];
			dst[p + 1] = rgb[1];
			dst[p + 2] = rgb[2];
			dst[p + 3] = 255;
		}
	}
	ctx.putImageData(out, 0, 0);
	return {
		dataUrl: canvas.toDataURL("image/png"),
		width,
		height
	};
}
/**
* Executes xinntao/Real-ESRGAN inspired 2x architectural super-resolution & edge-sharpening pass.
*/
async function runRealEsrganPass(src, model, denoise = 25, faceEnhance = false) {
	const img = await loadImage(src);
	const natW = img.naturalWidth || 1024;
	const natH = img.naturalHeight || 576;
	const scale = model === "RealESRGAN_x2plus" ? 1.5 : 2;
	const width = Math.min(2048, Math.round(natW * scale));
	const height = Math.min(2048, Math.round(natH * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return src;
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.filter = `contrast(${model === "4x-ArchSharp" ? 1.12 : faceEnhance ? 1.1 : 1.07}) saturate(${denoise > 50 ? 1.02 : 1.08}) brightness(1.02)`;
	ctx.drawImage(img, 0, 0, width, height);
	ctx.filter = "none";
	const imgData = ctx.getImageData(0, 0, width, height);
	const px = imgData.data;
	const copy = new Uint8ClampedArray(px);
	const baseAmount = model === "4x-ArchSharp" ? .42 : model === "RealESRGAN_x4plus" ? .34 : .24;
	const amount = faceEnhance ? baseAmount + .14 : baseAmount;
	for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
		const p = (y * width + x) * 4;
		const top = ((y - 1) * width + x) * 4;
		const bot = ((y + 1) * width + x) * 4;
		const lft = (y * width + (x - 1)) * 4;
		const rgt = (y * width + (x + 1)) * 4;
		for (let c = 0; c < 3; c++) {
			const blur = (copy[top + c] + copy[bot + c] + copy[lft + c] + copy[rgt + c]) * .25;
			const sharpened = copy[p + c] + (copy[p + c] - blur) * amount;
			px[p + c] = Math.max(0, Math.min(255, Math.round(sharpened)));
		}
	}
	ctx.putImageData(imgData, 0, 0);
	return canvas.toDataURL("image/jpeg", .94);
}
async function runSam2RegionSegment(params) {
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(params.src), 512);
	const px = ctx.getImageData(0, 0, width, height).data;
	const total = width * height;
	const lum = new Float32Array(total);
	for (let i = 0; i < total; i++) {
		const p = i * 4;
		lum[i] = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
	}
	const sx = Math.max(0, Math.min(width - 1, Math.round(params.point.xNorm * (width - 1))));
	const seedIdx = Math.max(0, Math.min(height - 1, Math.round(params.point.yNorm * (height - 1)))) * width + sx;
	const sp = seedIdx * 4;
	const sr = px[sp];
	const sg = px[sp + 1];
	const sb = px[sp + 2];
	const threshold = params.threshold ?? 45;
	const colorGate = 24 + threshold * 1.1;
	const edgeStop = 42 + threshold * .9;
	const visited = new Uint8Array(total);
	const queue = new Int32Array(total);
	let head = 0;
	let tail = 0;
	queue[tail++] = seedIdx;
	visited[seedIdx] = 1;
	while (head < tail) {
		const idx = queue[head++];
		const cx = idx % width;
		const cy = Math.floor(idx / width);
		const neighbors = [
			cx > 0 ? idx - 1 : -1,
			cx < width - 1 ? idx + 1 : -1,
			cy > 0 ? idx - width : -1,
			cy < height - 1 ? idx + width : -1
		];
		for (const nIdx of neighbors) {
			if (nIdx < 0 || visited[nIdx]) continue;
			const np = nIdx * 4;
			const distSeed = Math.hypot(px[np] - sr, px[np + 1] - sg, px[np + 2] - sb);
			const localStep = Math.abs(lum[nIdx] - lum[idx]);
			if (distSeed <= colorGate && localStep <= edgeStop) {
				visited[nIdx] = 1;
				queue[tail++] = nIdx;
			}
		}
	}
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = width;
	maskCanvas.height = height;
	const maskCtx = maskCanvas.getContext("2d");
	if (!maskCtx) throw new Error("Mask canvas unavailable");
	const previewOut = ctx.createImageData(width, height);
	const maskOut = maskCtx.createImageData(width, height);
	const pDst = previewOut.data;
	const mDst = maskOut.data;
	for (let i = 0; i < total; i++) {
		const p = i * 4;
		if (visited[i]) {
			pDst[p] = Math.min(255, Math.round(px[p] * .45 + 225 * .55));
			pDst[p + 1] = Math.min(255, Math.round(px[p + 1] * .45 + 97.9));
			pDst[p + 2] = Math.min(255, Math.round(px[p + 2] * .45 + 90 * .55));
			pDst[p + 3] = 255;
			mDst[p] = 212;
			mDst[p + 1] = 176;
			mDst[p + 2] = 106;
			mDst[p + 3] = 215;
		} else {
			pDst[p] = Math.round(px[p] * .52);
			pDst[p + 1] = Math.round(px[p + 1] * .52);
			pDst[p + 2] = Math.round(px[p + 2] * .52);
			pDst[p + 3] = 255;
		}
	}
	ctx.putImageData(previewOut, 0, 0);
	maskCtx.putImageData(maskOut, 0, 0);
	return {
		previewUrl: canvas.toDataURL("image/jpeg", .9),
		maskDataUrl: maskCanvas.toDataURL("image/png"),
		coveragePct: Math.max(1, Math.round(tail / total * 100))
	};
}
async function extractFloorPlanGrid(src, cols = 40, rows = 30) {
	const img = await loadImage(src);
	const canvas = document.createElement("canvas");
	canvas.width = cols;
	canvas.height = rows;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	const mask = new Uint8Array(cols * rows);
	if (!ctx) return {
		mask,
		cols,
		rows
	};
	ctx.drawImage(img, 0, 0, cols, rows);
	const px = ctx.getImageData(0, 0, cols, rows).data;
	for (let i = 0; i < cols * rows; i++) {
		const p = i * 4;
		const lum = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
		mask[i] = lum < 115 ? 1 : 0;
	}
	return {
		mask,
		cols,
		rows
	};
}
async function runTiledUpscalePass(src, factor, model, denoise = 25, faceEnhance = false) {
	if (factor <= 2) return runRealEsrganPass(src, model, denoise, faceEnhance);
	const img = await loadImage(src);
	const natW = img.naturalWidth || 1024;
	const natH = img.naturalHeight || 576;
	const scale = factor === 8 ? 3 : 2.25;
	const width = Math.min(3072, Math.round(natW * scale));
	const height = Math.min(3072, Math.round(natH * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return src;
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.filter = `contrast(${model === "4x-ArchSharp" ? 1.14 : 1.09}) saturate(1.08) brightness(1.02)`;
	ctx.drawImage(img, 0, 0, width, height);
	ctx.filter = "none";
	const imgData = ctx.getImageData(0, 0, width, height);
	const px = imgData.data;
	const copy = new Uint8ClampedArray(px);
	const crisp = factor === 8 ? .44 : .36;
	for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
		const p = (y * width + x) * 4;
		const grain = ((x * 13 + y * 29) % 7 - 3) * (denoise < 40 ? 1.4 : .5);
		for (let c = 0; c < 3; c++) {
			const blur = (copy[p - 4 + c] + copy[p + 4 + c] + copy[p - width * 4 + c] + copy[p + width * 4 + c]) * .25;
			px[p + c] = Math.max(0, Math.min(255, Math.round(copy[p + c] + (copy[p + c] - blur) * crisp + grain)));
		}
	}
	ctx.putImageData(imgData, 0, 0);
	return canvas.toDataURL("image/jpeg", .94);
}
async function runClientOutpaintCanvas(src, targetRatio) {
	const img = await loadImage(src);
	const natW = img.naturalWidth || 1280;
	const natH = img.naturalHeight || 720;
	const [rw, rh] = targetRatio.split(":").map(Number);
	const ratio = rw / rh;
	const srcRatio = natW / Math.max(1, natH);
	const targetW = ratio > srcRatio ? Math.min(1920, Math.round(natH * ratio)) : Math.min(1920, natW);
	const targetH = ratio > srcRatio ? Math.min(1920, natH) : Math.min(1920, Math.round(natW / ratio));
	const canvas = document.createElement("canvas");
	canvas.width = targetW;
	canvas.height = targetH;
	const ctx = canvas.getContext("2d");
	if (!ctx) return src;
	ctx.save();
	ctx.filter = "blur(26px) brightness(0.92)";
	ctx.drawImage(img, -40, -40, targetW + 80, targetH + 80);
	ctx.restore();
	const scale = Math.min(targetW / natW, targetH / natH) * .88;
	const dw = Math.round(natW * scale);
	const dh = Math.round(natH * scale);
	const dx = Math.round((targetW - dw) * .5);
	const dy = Math.round((targetH - dh) * .5);
	ctx.drawImage(img, dx, dy, dw, dh);
	return canvas.toDataURL("image/jpeg", .92);
}
async function runRelightWeatherPass(src, preset) {
	const img = await loadImage(src);
	const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
	ctx.save();
	if (preset === "overcast-to-golden") ctx.filter = "contrast(1.1) saturate(1.22) sepia(0.18) brightness(1.04)";
	else if (preset === "summer-to-snow") ctx.filter = "contrast(1.08) saturate(0.58) brightness(1.12)";
	else ctx.filter = "contrast(1.18) saturate(0.92) brightness(0.82) hue-rotate(-10deg)";
	ctx.drawImage(img, 0, 0, width, height);
	ctx.restore();
	const grad = ctx.createLinearGradient(0, 0, width, height);
	if (preset === "overcast-to-golden") {
		grad.addColorStop(0, "rgba(255, 198, 118, 0.28)");
		grad.addColorStop(1, "rgba(74, 42, 16, 0.16)");
	} else if (preset === "summer-to-snow") {
		grad.addColorStop(0, "rgba(220, 236, 250, 0.26)");
		grad.addColorStop(1, "rgba(240, 246, 255, 0.22)");
	} else {
		grad.addColorStop(0, "rgba(20, 44, 88, 0.34)");
		grad.addColorStop(.7, "rgba(232, 180, 92, 0.16)");
		grad.addColorStop(1, "rgba(12, 12, 18, 0.38)");
	}
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, width, height);
	return canvas.toDataURL("image/jpeg", .92);
}
/**
* Pure separable O(W*H) morphological Chebyshev dilation for binary masks (0/1).
*/
function dilateBinaryMask(mask, width, height, radius) {
	const r = Math.max(0, Math.min(32, Math.round(radius)));
	if (r === 0) return new Uint8Array(mask);
	const horiz = new Uint8Array(width * height);
	for (let y = 0; y < height; y++) {
		const rowOffset = y * width;
		let count = 0;
		for (let x = 0; x <= Math.min(width - 1, r); x++) count += mask[rowOffset + x] ? 1 : 0;
		for (let x = 0; x < width; x++) {
			if (count > 0) horiz[rowOffset + x] = 1;
			const outIdx = x - r;
			if (outIdx >= 0) count -= mask[rowOffset + outIdx] ? 1 : 0;
			const inIdx = x + r + 1;
			if (inIdx < width) count += mask[rowOffset + inIdx] ? 1 : 0;
		}
	}
	const out = new Uint8Array(width * height);
	for (let x = 0; x < width; x++) {
		let count = 0;
		for (let y = 0; y <= Math.min(height - 1, r); y++) count += horiz[y * width + x] ? 1 : 0;
		for (let y = 0; y < height; y++) {
			if (count > 0) out[y * width + x] = 1;
			const outIdx = y - r;
			if (outIdx >= 0) count -= horiz[outIdx * width + x] ? 1 : 0;
			const inIdx = y + r + 1;
			if (inIdx < height) count += horiz[inIdx * width + x] ? 1 : 0;
		}
	}
	return out;
}
function invertBinaryMask(mask) {
	const out = new Uint8Array(mask.length);
	for (let i = 0; i < mask.length; i++) out[i] = mask[i] ? 0 : 1;
	return out;
}
function buildDirectionalOutpaintBounds(srcW, srcH, pad) {
	const top = Math.max(0, Math.min(320, Math.round(pad.top)));
	const right = Math.max(0, Math.min(320, Math.round(pad.right)));
	const bottom = Math.max(0, Math.min(320, Math.round(pad.bottom)));
	const left = Math.max(0, Math.min(320, Math.round(pad.left)));
	return {
		srcW,
		srcH,
		top,
		right,
		bottom,
		left,
		targetW: srcW + left + right,
		targetH: srcH + top + bottom,
		dx: left,
		dy: top
	};
}
function getMaskBbox(binary, width, height) {
	let minX = width;
	let minY = height;
	let maxX = -1;
	let maxY = -1;
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (binary[y * width + x]) {
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		if (y < minY) minY = y;
		if (y > maxY) maxY = y;
	}
	if (maxX < minX || maxY < minY) return null;
	return {
		minX,
		minY,
		maxX,
		maxY,
		w: maxX - minX + 1,
		h: maxY - minY + 1
	};
}
/**
* Applies morphological mask dilation (+px) and inversion to an amber Oriel mask buffer.
*/
async function refineMaskBuffer(maskDataUrl, options) {
	if (options.dilatePx <= 0 && !options.invert) return maskDataUrl;
	const img = await loadImage(maskDataUrl);
	const width = img.naturalWidth || 1280;
	const height = img.naturalHeight || 720;
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return maskDataUrl;
	ctx.drawImage(img, 0, 0, width, height);
	const px = ctx.getImageData(0, 0, width, height).data;
	const total = width * height;
	let binary = extractBinaryBitmapFromRgba(px, width, height, 24).bitmap;
	if (options.dilatePx > 0) binary = dilateBinaryMask(binary, width, height, options.dilatePx);
	if (options.invert) binary = invertBinaryMask(binary);
	const out = ctx.createImageData(width, height);
	const dst = out.data;
	for (let i = 0; i < total; i++) if (binary[i]) {
		const p = i * 4;
		dst[p] = 212;
		dst[p + 1] = 176;
		dst[p + 2] = 106;
		dst[p + 3] = 205;
	}
	ctx.putImageData(out, 0, 0);
	return canvas.toDataURL("image/png");
}
/**
* IOPaint LaMa / MAT / MIGAN / ZITS deterministic inward onion-peel + patch diffusion erase.
* Seamlessly reconstructs textures under painted mask regions using surrounding boundary pixels.
*/
async function runLocalLamaErasePass(src, maskDataUrl, model = "lama") {
	const [img, maskImg] = await Promise.all([loadImage(src), loadImage(maskDataUrl)]);
	const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1024);
	const imgData = ctx.getImageData(0, 0, width, height);
	const px = imgData.data;
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = width;
	maskCanvas.height = height;
	const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
	if (!maskCtx) return src;
	maskCtx.drawImage(maskImg, 0, 0, width, height);
	const mPx = maskCtx.getImageData(0, 0, width, height).data;
	const total = width * height;
	const { bitmap: rawMask, activePixels } = extractBinaryBitmapFromRgba(mPx, width, height, 24);
	if (activePixels === 0) return src;
	const activeMask = dilateBinaryMask(rawMask, width, height, 1);
	const known = new Uint8Array(total);
	const peelOrder = [];
	let remaining = 0;
	for (let i = 0; i < total; i++) if (activeMask[i]) remaining++;
	else known[i] = 1;
	let frontier = [];
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		const i = y * width + x;
		if (known[i]) continue;
		if (x > 0 && known[i - 1] || x < width - 1 && known[i + 1] || y > 0 && known[i - width] || y < height - 1 && known[i + width]) frontier.push(i);
	}
	const queued = new Uint8Array(known);
	for (const idx of frontier) queued[idx] = 1;
	while (frontier.length > 0 && peelOrder.length < remaining + 4) {
		const nextFrontier = [];
		for (const idx of frontier) {
			peelOrder.push(idx);
			const x = idx % width;
			const y = Math.floor(idx / width);
			const nbs = [
				x > 0 ? idx - 1 : -1,
				x < width - 1 ? idx + 1 : -1,
				y > 0 ? idx - width : -1,
				y < height - 1 ? idx + width : -1
			];
			for (const n of nbs) if (n >= 0 && !queued[n]) {
				queued[n] = 1;
				nextFrontier.push(n);
			}
		}
		frontier = nextFrontier;
	}
	const isStructural = model === "zits" || model === "mat";
	const sampleOffsets = isStructural ? [
		[-2, 0],
		[2, 0],
		[0, -2],
		[0, 2],
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-3, -1],
		[3, 1],
		[-1, -3],
		[1, 3]
	] : [
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
		[-1, -1],
		[1, -1],
		[-1, 1],
		[1, 1],
		[-2, 0],
		[2, 0],
		[0, -2],
		[0, 2]
	];
	for (const idx of peelOrder) {
		const x = idx % width;
		const y = Math.floor(idx / width);
		let sumR = 0;
		let sumG = 0;
		let sumB = 0;
		let sumW = 0;
		for (const [ox, oy] of sampleOffsets) {
			const nx = x + ox;
			const ny = y + oy;
			if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
			const nIdx = ny * width + nx;
			if (!known[nIdx]) continue;
			const w = 1 / Math.hypot(ox, oy);
			const np = nIdx * 4;
			sumR += px[np] * w;
			sumG += px[np + 1] * w;
			sumB += px[np + 2] * w;
			sumW += w;
		}
		if (sumW > 0) {
			const p = idx * 4;
			const micro = ((x * 19 + y * 37) % 5 - 2) * (model === "manga" ? .5 : 1.1);
			px[p] = Math.max(0, Math.min(255, Math.round(sumR / sumW + micro)));
			px[p + 1] = Math.max(0, Math.min(255, Math.round(sumG / sumW + micro)));
			px[p + 2] = Math.max(0, Math.min(255, Math.round(sumB / sumW + micro)));
			px[p + 3] = 255;
			known[idx] = 1;
		}
	}
	const copy = new Uint8ClampedArray(px);
	const passes = isStructural ? 6 : 8;
	for (let pass = 0; pass < passes; pass++) {
		for (const idx of peelOrder) {
			const x = idx % width;
			const y = Math.floor(idx / width);
			if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) continue;
			const p = idx * 4;
			const l = p - 4;
			const r = p + 4;
			const u = p - width * 4;
			const d = p + width * 4;
			for (let c = 0; c < 3; c++) copy[p + c] = Math.round((px[p + c] * 2 + px[l + c] + px[r + c] + px[u + c] + px[d + c]) / 6);
		}
		for (const idx of peelOrder) {
			const p = idx * 4;
			px[p] = copy[p];
			px[p + 1] = copy[p + 1];
			px[p + 2] = copy[p + 2];
		}
	}
	ctx.putImageData(imgData, 0, 0);
	return canvas.toDataURL("image/jpeg", .93);
}
/**
* IOPaint MobileSAM / SAM-2 interactive multi-point (+ include / - exclude) segmentation.
*/
async function runInteractiveSamMultiPointMask(params) {
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(params.src), 512);
	const px = ctx.getImageData(0, 0, width, height).data;
	const total = width * height;
	const lum = new Float32Array(total);
	for (let i = 0; i < total; i++) {
		const p = i * 4;
		lum[i] = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
	}
	const threshold = params.threshold ?? 45;
	const colorGate = 22 + threshold * .78;
	const edgeStop = 26 + threshold * .65;
	function floodFromPoint(pt, mult = 1) {
		const sx = Math.max(0, Math.min(width - 1, Math.round(pt.xNorm * (width - 1))));
		const sy = Math.max(0, Math.min(height - 1, Math.round(pt.yNorm * (height - 1))));
		const seedIdx = sy * width + sx;
		let sumR = 0;
		let sumG = 0;
		let sumB = 0;
		let samples = 0;
		for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
			const nx = Math.max(0, Math.min(width - 1, sx + dx));
			const sp = (Math.max(0, Math.min(height - 1, sy + dy)) * width + nx) * 4;
			sumR += px[sp];
			sumG += px[sp + 1];
			sumB += px[sp + 2];
			samples++;
		}
		const sr = sumR / samples;
		const sg = sumG / samples;
		const sb = sumB / samples;
		const vis = new Uint8Array(total);
		const queue = new Int32Array(total);
		let head = 0;
		let tail = 0;
		queue[tail++] = seedIdx;
		vis[seedIdx] = 1;
		while (head < tail) {
			const idx = queue[head++];
			const cx = idx % width;
			const cy = Math.floor(idx / width);
			const neighbors = [
				cx > 0 ? idx - 1 : -1,
				cx < width - 1 ? idx + 1 : -1,
				cy > 0 ? idx - width : -1,
				cy < height - 1 ? idx + width : -1
			];
			for (const nIdx of neighbors) {
				if (nIdx < 0 || vis[nIdx]) continue;
				const np = nIdx * 4;
				const distSeed = Math.hypot(px[np] - sr, px[np + 1] - sg, px[np + 2] - sb);
				const localStep = Math.abs(lum[nIdx] - lum[idx]);
				if (distSeed <= colorGate * mult && localStep <= edgeStop * mult) {
					vis[nIdx] = 1;
					queue[tail++] = nIdx;
				}
			}
		}
		return vis;
	}
	const rawMask = new Uint8Array(total);
	for (const pt of params.posPoints) {
		const reg = floodFromPoint(pt, 1);
		for (let i = 0; i < total; i++) if (reg[i]) rawMask[i] = 1;
	}
	const mask = dilateBinaryMask(rawMask, width, height, 1);
	for (const npt of params.negPoints) {
		const exclDilated = dilateBinaryMask(floodFromPoint(npt, .85), width, height, 2);
		for (let i = 0; i < total; i++) if (exclDilated[i]) mask[i] = 0;
	}
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = width;
	maskCanvas.height = height;
	const maskCtx = maskCanvas.getContext("2d");
	if (!maskCtx) throw new Error("Mask canvas unavailable");
	const previewOut = ctx.createImageData(width, height);
	const maskOut = maskCtx.createImageData(width, height);
	const pDst = previewOut.data;
	const mDst = maskOut.data;
	let count = 0;
	for (let i = 0; i < total; i++) {
		const p = i * 4;
		if (mask[i]) {
			count++;
			pDst[p] = Math.min(255, Math.round(px[p] * .45 + 225 * .55));
			pDst[p + 1] = Math.min(255, Math.round(px[p + 1] * .45 + 97.9));
			pDst[p + 2] = Math.min(255, Math.round(px[p + 2] * .45 + 90 * .55));
			pDst[p + 3] = 255;
			mDst[p] = 212;
			mDst[p + 1] = 176;
			mDst[p + 2] = 106;
			mDst[p + 3] = 215;
		} else {
			pDst[p] = Math.round(px[p] * .55);
			pDst[p + 1] = Math.round(px[p + 1] * .55);
			pDst[p + 2] = Math.round(px[p + 2] * .55);
			pDst[p + 3] = 255;
		}
	}
	ctx.putImageData(previewOut, 0, 0);
	maskCtx.putImageData(maskOut, 0, 0);
	return {
		previewUrl: canvas.toDataURL("image/jpeg", .9),
		maskDataUrl: maskCanvas.toDataURL("image/png"),
		coveragePct: count > 0 ? Math.max(1, Math.round(count / Math.max(1, total) * 100)) : 0
	};
}
/**
* IOPaint RemoveBG Plugin (RMBG-2.0 / BiRefNet / U2Net / IS-Net / Anime-Seg).
* Separates architectural subject foreground from sky/background border distribution.
*/
async function runRemoveBgPlugin(src, model, outputMode) {
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(src), 1024);
	const px = ctx.getImageData(0, 0, width, height).data;
	let bgR = 0;
	let bgG = 0;
	let bgB = 0;
	let borderSamples = 0;
	for (let x = 0; x < width; x += 4) {
		const topP = x * 4;
		bgR += px[topP];
		bgG += px[topP + 1];
		bgB += px[topP + 2];
		borderSamples++;
	}
	for (let y = 0; y < Math.floor(height * .45); y += 4) {
		const lP = y * width * 4;
		const rP = (y * width + (width - 1)) * 4;
		bgR += px[lP] + px[rP];
		bgG += px[lP + 1] + px[rP + 1];
		bgB += px[lP + 2] + px[rP + 2];
		borderSamples += 2;
	}
	bgR /= Math.max(1, borderSamples);
	bgG /= Math.max(1, borderSamples);
	bgB /= Math.max(1, borderSamples);
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = width;
	maskCanvas.height = height;
	const maskCtx = maskCanvas.getContext("2d");
	if (!maskCtx) throw new Error("Mask canvas unavailable");
	const outData = ctx.createImageData(width, height);
	const maskOut = maskCtx.createImageData(width, height);
	const oDst = outData.data;
	const mDst = maskOut.data;
	const sensitivity = model === "birefnet" || model === "rmbg-2.0" ? 54 : model === "anime-seg" ? 44 : 62;
	for (let y = 0; y < height; y++) {
		const yNorm = y / Math.max(1, height - 1);
		for (let x = 0; x < width; x++) {
			const xNorm = x / Math.max(1, width - 1);
			const p = (y * width + x) * 4;
			const r = px[p];
			const g = px[p + 1];
			const b = px[p + 2];
			const colorDist = Math.hypot(r - bgR, g - bgG, b - bgB);
			const centerDist = Math.hypot((xNorm - .5) * 1.15, (yNorm - .54) * 1.1);
			const isForeground = colorDist + (1 - Math.min(1, centerDist)) * 42 > sensitivity || yNorm > .72;
			oDst[p] = r;
			oDst[p + 1] = g;
			oDst[p + 2] = b;
			oDst[p + 3] = isForeground ? 255 : outputMode === "cutout" ? 0 : 255;
			if (!isForeground) {
				mDst[p] = 212;
				mDst[p + 1] = 176;
				mDst[p + 2] = 106;
				mDst[p + 3] = 205;
			}
		}
	}
	ctx.putImageData(outData, 0, 0);
	maskCtx.putImageData(maskOut, 0, 0);
	return {
		url: canvas.toDataURL("image/png"),
		maskDataUrl: maskCanvas.toDataURL("image/png")
	};
}
/**
* IOPaint Restore Faces Plugin (GFPGAN v1.4 / RestoreFormer++).
* Restores crisp facial/silhouette/fixture micro-detail & warm tone contrast without blowing highlights.
*/
async function runRestoreFacesPlugin(src, model) {
	const img = await loadImage(src);
	const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
	ctx.filter = model === "restoreformer" ? "contrast(1.07) saturate(1.06) brightness(1.01)" : "contrast(1.09) saturate(1.04) brightness(1.02)";
	ctx.drawImage(img, 0, 0, width, height);
	ctx.filter = "none";
	const imgData = ctx.getImageData(0, 0, width, height);
	const px = imgData.data;
	const copy = new Uint8ClampedArray(px);
	const amount = model === "restoreformer" ? .32 : .38;
	for (let y = 1; y < height - 1; y++) for (let x = 1; x < width - 1; x++) {
		const p = (y * width + x) * 4;
		const t = ((y - 1) * width + x) * 4;
		const b = ((y + 1) * width + x) * 4;
		const l = p - 4;
		const r = p + 4;
		for (let c = 0; c < 3; c++) {
			const avg = (copy[t + c] + copy[b + c] + copy[l + c] + copy[r + c]) * .25;
			px[p + c] = Math.max(0, Math.min(255, Math.round(copy[p + c] + (copy[p + c] - avg) * amount)));
		}
	}
	ctx.putImageData(imgData, 0, 0);
	return canvas.toDataURL("image/jpeg", .94);
}
/**
* IOPaint Directional Outpainting Pad (+Top, +Right, +Bottom, +Left px).
* Produces both the extended backdrop canvas and exact border inpaint mask.
*/
async function runDirectionalOutpaintPad(src, pad) {
	const img = await loadImage(src);
	const natW = Math.min(1440, img.naturalWidth || 1280);
	const natH = Math.min(1080, img.naturalHeight || 720);
	const bounds = buildDirectionalOutpaintBounds(natW, natH, pad);
	const canvas = document.createElement("canvas");
	canvas.width = bounds.targetW;
	canvas.height = bounds.targetH;
	const ctx = canvas.getContext("2d");
	if (!ctx) return {
		paddedUrl: src,
		maskDataUrl: src,
		width: natW,
		height: natH
	};
	ctx.save();
	ctx.filter = "blur(22px) brightness(0.95)";
	ctx.drawImage(img, -36, -36, bounds.targetW + 72, bounds.targetH + 72);
	ctx.restore();
	ctx.drawImage(img, bounds.dx, bounds.dy, bounds.srcW, bounds.srcH);
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = bounds.targetW;
	maskCanvas.height = bounds.targetH;
	const mCtx = maskCanvas.getContext("2d");
	if (mCtx) {
		mCtx.fillStyle = "rgba(212, 176, 106, 0.82)";
		mCtx.fillRect(0, 0, bounds.targetW, bounds.targetH);
		mCtx.clearRect(bounds.dx, bounds.dy, bounds.srcW, bounds.srcH);
	}
	return {
		paddedUrl: canvas.toDataURL("image/jpeg", .92),
		maskDataUrl: maskCanvas.toDataURL("image/png"),
		width: bounds.targetW,
		height: bounds.targetH
	};
}
/**
* IOPaint AnyText deterministic fallback preview: renders architectural signage inside the masked box.
*/
async function runLocalAnyText(src, maskDataUrl, text) {
	const [img, maskImg] = await Promise.all([loadImage(src), loadImage(maskDataUrl)]);
	const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
	const mCanvas = document.createElement("canvas");
	mCanvas.width = width;
	mCanvas.height = height;
	const mCtx = mCanvas.getContext("2d");
	if (!mCtx) return src;
	mCtx.drawImage(maskImg, 0, 0, width, height);
	const mPx = mCtx.getImageData(0, 0, width, height).data;
	const { bitmap: bin } = extractBinaryBitmapFromRgba(mPx, width, height, 24);
	const bbox = getMaskBbox(bin, width, height);
	if (!bbox) return src;
	const cleanText = (text.trim() || "ORIEL STUDIO").slice(0, 36);
	const cx = bbox.minX + bbox.w * .5;
	const cy = bbox.minY + bbox.h * .5;
	const fontSize = Math.max(16, Math.min(72, Math.round(bbox.h * .52)));
	ctx.save();
	ctx.fillStyle = "rgba(24, 21, 18, 0.72)";
	ctx.fillRect(bbox.minX, bbox.minY + bbox.h * .12, bbox.w, bbox.h * .76);
	ctx.strokeStyle = "rgba(212, 176, 106, 0.7)";
	ctx.lineWidth = 2;
	ctx.strokeRect(bbox.minX, bbox.minY + bbox.h * .12, bbox.w, bbox.h * .76);
	ctx.font = `600 ${fontSize}px ui-serif, Georgia, serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
	ctx.fillText(cleanText, cx + 1.5, cy + 2, bbox.w * .88);
	ctx.fillStyle = "#f5efe6";
	ctx.fillText(cleanText, cx, cy, bbox.w * .88);
	ctx.restore();
	return canvas.toDataURL("image/jpeg", .93);
}
/**
* IOPaint Paint-by-Example deterministic fallback: inserts a reference swatch/object into mask bounds.
*/
async function runLocalPaintByExample(src, maskDataUrl, exampleUrl, strength = 75) {
	const [img, maskImg, exImg] = await Promise.all([
		loadImage(src),
		loadImage(maskDataUrl),
		loadImage(exampleUrl)
	]);
	const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
	const mCanvas = document.createElement("canvas");
	mCanvas.width = width;
	mCanvas.height = height;
	const mCtx = mCanvas.getContext("2d");
	if (!mCtx) return src;
	mCtx.drawImage(maskImg, 0, 0, width, height);
	const mPx = mCtx.getImageData(0, 0, width, height).data;
	const { bitmap: bin } = extractBinaryBitmapFromRgba(mPx, width, height, 24);
	const bbox = getMaskBbox(bin, width, height);
	if (!bbox) return src;
	const exPatch = document.createElement("canvas");
	exPatch.width = width;
	exPatch.height = height;
	const exCtx = exPatch.getContext("2d");
	if (!exCtx) return src;
	const alphaMask = exCtx.createImageData(width, height);
	for (let i = 0; i < bin.length; i++) if (bin[i]) {
		const p = i * 4;
		alphaMask.data[p] = 255;
		alphaMask.data[p + 1] = 255;
		alphaMask.data[p + 2] = 255;
		alphaMask.data[p + 3] = 255;
	}
	exCtx.putImageData(alphaMask, 0, 0);
	exCtx.globalCompositeOperation = "source-in";
	exCtx.drawImage(exImg, bbox.minX, bbox.minY, bbox.w, bbox.h);
	exCtx.globalCompositeOperation = "source-over";
	ctx.save();
	ctx.globalAlpha = Math.max(.45, Math.min(.95, strength / 100));
	ctx.drawImage(exPatch, 0, 0, width, height);
	ctx.restore();
	return canvas.toDataURL("image/jpeg", .92);
}
/**
* Pure validator & normalizer for Grounded-SAM 2 bounding boxes in 0..1000 [ymin, xmin, ymax, xmax] space.
*/
function normalizeGroundedBoxes(raw, defaultLabel = "Object") {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const entry of raw.slice(0, 12)) {
		if (!entry || typeof entry !== "object") continue;
		const item = entry;
		if (!Array.isArray(item.box_2d) || item.box_2d.length !== 4) continue;
		const [ymin, xmin, ymax, xmax] = item.box_2d.map((n) => Math.max(0, Math.min(1e3, Math.round(Number(n) || 0))));
		if (ymax <= ymin + 8 || xmax <= xmin + 8) continue;
		out.push({
			label: typeof item.label === "string" && item.label.trim() ? item.label.trim().slice(0, 32) : defaultLabel.slice(0, 32),
			box_2d: [
				ymin,
				xmin,
				ymax,
				xmax
			],
			confidence: Number(Math.max(.1, Math.min(1, Number(item.confidence) || .85)).toFixed(2))
		});
	}
	return out;
}
/**
* Pure architectural priors for Grounded-SAM 2 bounding-box localization when running offline or without API keys.
*/
function heuristicSemanticBoxesForPrompt(prompt) {
	const p = prompt.trim().toLowerCase();
	if (!p) return [{
		label: "Architectural Zone",
		box_2d: [
			220,
			180,
			780,
			820
		],
		confidence: .82
	}];
	if (p.includes("sky")) return [{
		label: "Sky Dome",
		box_2d: [
			0,
			0,
			360,
			1e3
		],
		confidence: .93
	}];
	if (p.includes("floor") || p.includes("rug") || p.includes("deck") || p.includes("paving") || p.includes("terrace")) return [{
		label: "Flooring Surface",
		box_2d: [
			620,
			40,
			995,
			960
		],
		confidence: .91
	}];
	if (p.includes("sofa") || p.includes("chair") || p.includes("furniture") || p.includes("table") || p.includes("bed")) return [{
		label: "Primary Seating",
		box_2d: [
			480,
			140,
			860,
			620
		],
		confidence: .89
	}, {
		label: "Lounge Accent",
		box_2d: [
			510,
			610,
			830,
			880
		],
		confidence: .84
	}];
	if (p.includes("glass") || p.includes("glazing") || p.includes("window") || p.includes("curtain wall")) return [{
		label: "Glazing Bay",
		box_2d: [
			180,
			160,
			680,
			560
		],
		confidence: .92
	}, {
		label: "Window Mullions",
		box_2d: [
			200,
			580,
			690,
			910
		],
		confidence: .88
	}];
	if (p.includes("tree") || p.includes("foliage") || p.includes("plant") || p.includes("garden")) return [{
		label: "Canopy Foliage",
		box_2d: [
			140,
			20,
			740,
			320
		],
		confidence: .87
	}, {
		label: "Courtyard Greens",
		box_2d: [
			240,
			700,
			780,
			980
		],
		confidence: .85
	}];
	if (p.includes("lamp") || p.includes("light") || p.includes("pendant") || p.includes("chandelier")) return [{
		label: "Pendant Lighting",
		box_2d: [
			70,
			320,
			390,
			680
		],
		confidence: .9
	}];
	if (p.includes("roof") || p.includes("ceiling")) return [{
		label: "Roof / Ceiling Plane",
		box_2d: [
			20,
			60,
			340,
			940
		],
		confidence: .9
	}];
	if (p.includes("water") || p.includes("pool")) return [{
		label: "Reflecting Pool",
		box_2d: [
			560,
			120,
			940,
			880
		],
		confidence: .89
	}];
	return [{
		label: prompt.trim().slice(0, 28),
		box_2d: [
			190,
			170,
			760,
			830
		],
		confidence: .84
	}];
}
/**
* Exports a compact JPEG data URL for server-side Grounded-SAM 2 / Gemini bounding-box localization
* (handles local relative routes like `/viz/...` smoothly as well as uploaded images).
*/
async function toCompactDataUrlForSegmentation(src) {
	if (src.startsWith("data:image/") && src.length <= 9e5) return src;
	const { canvas } = prepareWorkCanvas(await loadImage(src), 768);
	return canvas.toDataURL("image/jpeg", .86);
}
/**
* Grounded-SAM 2 One-Click Box-Constrained Edge-Aware Segmentation inside IOPaint & CV stages.
* Combines Grounded bounding boxes `[ymin, xmin, ymax, xmax]` (0..1000) with SAM-2 seeded flooding
* constrained cleanly to object bounds, plus optional interactive + / - refinement points.
*/
async function runGroundedSam2Segment(params) {
	const { canvas, ctx, width, height } = prepareWorkCanvas(await loadImage(params.src), 640);
	const px = ctx.getImageData(0, 0, width, height).data;
	const total = width * height;
	const lum = new Float32Array(total);
	for (let i = 0; i < total; i++) {
		const p = i * 4;
		lum[i] = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
	}
	const activeBoxes = params.boxes && params.boxes.length > 0 ? normalizeGroundedBoxes(params.boxes, params.prompt) : heuristicSemanticBoxesForPrompt(params.prompt);
	const threshold = params.threshold ?? 45;
	const colorGate = 26 + threshold * 1.15;
	const edgeStop = 40 + threshold * .92;
	const finalMask = new Uint8Array(total);
	function floodConstrained(seedXNorm, seedYNorm, boundsNorm, mult = 1) {
		const sx = Math.max(0, Math.min(width - 1, Math.round(seedXNorm * (width - 1))));
		const sy = Math.max(0, Math.min(height - 1, Math.round(seedYNorm * (height - 1))));
		const minPxX = boundsNorm ? Math.max(0, Math.floor(boundsNorm.xmin * (width - 1))) : 0;
		const maxPxX = boundsNorm ? Math.min(width - 1, Math.ceil(boundsNorm.xmax * (width - 1))) : width - 1;
		const minPxY = boundsNorm ? Math.max(0, Math.floor(boundsNorm.ymin * (height - 1))) : 0;
		const maxPxY = boundsNorm ? Math.min(height - 1, Math.ceil(boundsNorm.ymax * (height - 1))) : height - 1;
		const seedIdx = sy * width + sx;
		const sp = seedIdx * 4;
		const sr = px[sp];
		const sg = px[sp + 1];
		const sb = px[sp + 2];
		const vis = new Uint8Array(total);
		const queue = new Int32Array(total);
		let head = 0;
		let tail = 0;
		queue[tail++] = seedIdx;
		vis[seedIdx] = 1;
		while (head < tail) {
			const idx = queue[head++];
			const cx = idx % width;
			const cy = Math.floor(idx / width);
			const neighbors = [
				cx > minPxX ? idx - 1 : -1,
				cx < maxPxX ? idx + 1 : -1,
				cy > minPxY ? idx - width : -1,
				cy < maxPxY ? idx + width : -1
			];
			for (const nIdx of neighbors) {
				if (nIdx < 0 || vis[nIdx]) continue;
				const np = nIdx * 4;
				const distSeed = Math.hypot(px[np] - sr, px[np + 1] - sg, px[np + 2] - sb);
				const localStep = Math.abs(lum[nIdx] - lum[idx]);
				if (distSeed <= colorGate * mult && localStep <= edgeStop * mult) {
					vis[nIdx] = 1;
					queue[tail++] = nIdx;
				}
			}
		}
		return vis;
	}
	for (const box of activeBoxes) {
		const [ymin, xmin, ymax, xmax] = box.box_2d;
		const bNorm = {
			ymin: Math.max(0, ymin / 1e3 - .02),
			xmin: Math.max(0, xmin / 1e3 - .02),
			ymax: Math.min(1, ymax / 1e3 + .02),
			xmax: Math.min(1, xmax / 1e3 + .02)
		};
		const cyNorm = (ymin + ymax) / 2e3;
		const cxNorm = (xmin + xmax) / 2e3;
		const seeds = [
			[cxNorm, cyNorm],
			[(xmin * .7 + xmax * .3) / 1e3, (ymin * .7 + ymax * .3) / 1e3],
			[(xmin * .3 + xmax * .7) / 1e3, (ymin * .3 + ymax * .7) / 1e3]
		];
		let boxHits = 0;
		const boxMask = new Uint8Array(total);
		for (const [sxNorm, syNorm] of seeds) {
			const reg = floodConstrained(sxNorm, syNorm, bNorm, 1.08);
			for (let i = 0; i < total; i++) if (reg[i] && !boxMask[i]) {
				boxMask[i] = 1;
				boxHits++;
			}
		}
		const minPxX = Math.floor(xmin / 1e3 * (width - 1));
		const maxPxX = Math.ceil(xmax / 1e3 * (width - 1));
		const minPxY = Math.floor(ymin / 1e3 * (height - 1));
		const maxPxY = Math.ceil(ymax / 1e3 * (height - 1));
		const boxArea = Math.max(1, (maxPxX - minPxX + 1) * (maxPxY - minPxY + 1));
		if (boxHits < boxArea * .14) for (let y = minPxY; y <= maxPxY; y++) {
			const yNorm = y / Math.max(1, height - 1);
			for (let x = minPxX; x <= maxPxX; x++) {
				const xNorm = x / Math.max(1, width - 1);
				const idx = y * width + x;
				const p = idx * 4;
				if (matchSemanticSegmentPixel({
					r: px[p],
					g: px[p + 1],
					b: px[p + 2],
					xNorm,
					yNorm,
					prompt: `${params.prompt} ${box.label}`,
					threshold: threshold + 12
				}) || Math.abs(xNorm - cxNorm) <= .16 && Math.abs(yNorm - cyNorm) <= .12) boxMask[idx] = 1;
			}
		}
		for (let i = 0; i < total; i++) if (boxMask[i]) finalMask[i] = 1;
	}
	for (const pt of params.posPoints ?? []) {
		const reg = floodConstrained(pt.xNorm, pt.yNorm, void 0, 1);
		for (let i = 0; i < total; i++) if (reg[i]) finalMask[i] = 1;
	}
	for (const npt of params.negPoints ?? []) {
		const exclDilated = dilateBinaryMask(floodConstrained(npt.xNorm, npt.yNorm, void 0, .85), width, height, 2);
		for (let i = 0; i < total; i++) if (exclDilated[i]) finalMask[i] = 0;
	}
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = width;
	maskCanvas.height = height;
	const maskCtx = maskCanvas.getContext("2d");
	if (!maskCtx) throw new Error("Mask canvas unavailable");
	const previewOut = ctx.createImageData(width, height);
	const maskOut = maskCtx.createImageData(width, height);
	const pDst = previewOut.data;
	const mDst = maskOut.data;
	let count = 0;
	for (let i = 0; i < total; i++) {
		const p = i * 4;
		if (finalMask[i]) {
			count++;
			pDst[p] = Math.min(255, Math.round(px[p] * .45 + 225 * .55));
			pDst[p + 1] = Math.min(255, Math.round(px[p + 1] * .45 + 97.9));
			pDst[p + 2] = Math.min(255, Math.round(px[p + 2] * .45 + 90 * .55));
			pDst[p + 3] = 255;
			mDst[p] = 212;
			mDst[p + 1] = 176;
			mDst[p + 2] = 106;
			mDst[p + 3] = 210;
		} else {
			pDst[p] = Math.round(px[p] * .56);
			pDst[p + 1] = Math.round(px[p + 1] * .56);
			pDst[p + 2] = Math.round(px[p + 2] * .56);
			pDst[p + 3] = 255;
		}
	}
	ctx.putImageData(previewOut, 0, 0);
	maskCtx.putImageData(maskOut, 0, 0);
	return {
		previewUrl: canvas.toDataURL("image/jpeg", .9),
		maskDataUrl: maskCanvas.toDataURL("image/png"),
		coveragePct: Math.round(count / Math.max(1, total) * 100),
		boxes: activeBoxes
	};
}
/**
* IOPaint Texture & Material Replacement Fallback Synthesizer:
* Applies procedural architectural surface finishes (travertine veining, fluted oak planks,
* board-formed concrete, Nordic brick, brushed bronze, or Low-E glazing) strictly inside
* the painted mask while preserving original directional lighting & shadows.
*/
async function runLocalTextureReplacePass(src, maskDataUrl, instruction, strength = 75) {
	const [img, maskImg] = await Promise.all([loadImage(src), loadImage(maskDataUrl)]);
	const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
	const imgData = ctx.getImageData(0, 0, width, height);
	const px = imgData.data;
	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = width;
	maskCanvas.height = height;
	const mCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
	if (!mCtx) return src;
	mCtx.drawImage(maskImg, 0, 0, width, height);
	const mPx = mCtx.getImageData(0, 0, width, height).data;
	const { bitmap: rawMask } = extractBinaryBitmapFromRgba(mPx, width, height, 24);
	const note = instruction.trim().toLowerCase();
	const alphaBlend = Math.max(.45, Math.min(.95, strength / 100));
	let kind = "travertine";
	let baseRgb = [
		220,
		206,
		181
	];
	if (note.includes("oak") || note.includes("timber") || note.includes("wood") || note.includes("cedar") || note.includes("walnut")) {
		kind = "oak";
		baseRgb = note.includes("walnut") ? [
			116,
			78,
			52
		] : [
			182,
			132,
			84
		];
	} else if (note.includes("concrete") || note.includes("plaster") || note.includes("stucco") || note.includes("cement")) {
		kind = "concrete";
		baseRgb = [
			172,
			168,
			160
		];
	} else if (note.includes("brick") || note.includes("terracotta")) {
		kind = "brick";
		baseRgb = [
			158,
			90,
			68
		];
	} else if (note.includes("bronze") || note.includes("brass") || note.includes("metal") || note.includes("copper") || note.includes("zinc")) {
		kind = "bronze";
		baseRgb = note.includes("zinc") ? [
			102,
			108,
			114
		] : [
			146,
			112,
			72
		];
	} else if (note.includes("glass") || note.includes("glaz") || note.includes("mirror") || note.includes("water")) {
		kind = "glass";
		baseRgb = [
			138,
			178,
			192
		];
	} else if (note.includes("green") || note.includes("moss") || note.includes("foliage") || note.includes("grass") || note.includes("plant")) {
		kind = "foliage";
		baseRgb = [
			74,
			126,
			76
		];
	} else if (note.includes("marble") || note.includes("terrazzo")) {
		kind = "marble";
		baseRgb = [
			234,
			231,
			226
		];
	}
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
		const i = y * width + x;
		if (!rawMask[i]) continue;
		const p = i * 4;
		const maskAlpha = Math.max(.82, mPx[p + 3] / 255);
		const shade = .52 + rgbToLuminance(px[p], px[p + 1], px[p + 2]) / 255 * .72;
		let tr = baseRgb[0];
		let tg = baseRgb[1];
		let tb = baseRgb[2];
		if (kind === "oak") {
			const grain = Math.sin(x * .42 + Math.sin(y * .04) * 3.5) * 14 + ((x + y * 3) % 7 - 3) * 1.8;
			const seam = x % 48 === 0 ? -24 : 0;
			tr += grain + seam;
			tg += grain * .8 + seam;
			tb += grain * .55 + seam;
		} else if (kind === "brick") {
			const row = Math.floor(y / 14);
			const mortarY = y % 14 < 2;
			const offsetX = row % 2 * 20;
			if ((x + offsetX) % 40 < 2 || mortarY) {
				tr = 198;
				tg = 191;
				tb = 180;
			} else {
				const brickVar = (row * 31 + Math.floor((x + offsetX) / 40) * 17) % 19 - 9;
				tr += brickVar * 1.4;
				tg += brickVar * .8;
				tb += brickVar * .6;
			}
		} else if (kind === "concrete") {
			const tieHole = x % 96 < 4 && y % 64 < 4 ? -28 : 0;
			const board = y % 32 === 0 ? -10 : 0;
			const pore = ((x * 13 + y * 29) % 11 - 5) * 2.1;
			tr += pore + board + tieHole;
			tg += pore + board + tieHole;
			tb += pore + board + tieHole;
		} else if (kind === "marble" || kind === "travertine") {
			const vein = Math.sin(x * .045 + y * .07 + Math.sin(x * .02) * 4.5);
			const strata = kind === "travertine" ? Math.sin(y * .25 + x * .01) * 10 : vein > .78 ? -26 : 0;
			const pore = ((x * 17 + y * 7) % 9 - 4) * 1.4;
			tr += strata + pore;
			tg += strata * .9 + pore;
			tb += strata * .8 + pore;
		} else if (kind === "bronze") {
			const brush = Math.sin(y * .85) * 8 + ((x * 11 + y * 5) % 9 - 4) * 1.6;
			const spec = Math.exp(-(((x / width - .45) * 4) ** 2)) * 28;
			tr += brush + spec;
			tg += brush * .88 + spec * .9;
			tb += brush * .75 + spec * .7;
		} else if (kind === "glass") {
			const reflection = Math.sin((x + y) * .03) * 18 + (1 - y / height) * 26;
			tr += reflection;
			tg += reflection * 1.05;
			tb += reflection * 1.15;
		} else if (kind === "foliage") {
			const leaf = Math.sin(x * .4) * Math.cos(y * .4) * 24 + ((x * 19 + y * 23) % 13 - 6) * 2.2;
			tr += leaf * .7;
			tg += leaf * 1.1;
			tb += leaf * .5;
		}
		const finR = Math.max(0, Math.min(255, tr * shade));
		const finG = Math.max(0, Math.min(255, tg * shade));
		const finB = Math.max(0, Math.min(255, tb * shade));
		const w = maskAlpha * alphaBlend;
		px[p] = Math.round(px[p] * (1 - w) + finR * w);
		px[p + 1] = Math.round(px[p + 1] * (1 - w) + finG * w);
		px[p + 2] = Math.round(px[p + 2] * (1 - w) + finB * w);
	}
	ctx.putImageData(imgData, 0, 0);
	return canvas.toDataURL("image/jpeg", .93);
}
export { runRemoveBgPlugin as C, toCompactDataUrlForSegmentation as D, runTiledUpscalePass as E, __exportAll as O, runRelightWeatherPass as S, runSam2RegionSegment as T, runLocalAnyText as _, estimateDataUrlBytes as a, runLocalTextureReplacePass as b, heuristicSemanticBoxesForPrompt as c, runClientOutpaintCanvas as d, runDepthAnythingPass as f, runInteractiveSamMultiPointMask as g, runGroundedSamMask as h, encodeBinaryBitmapToRgba as i, refineMaskBuffer as l, runGroundedSam2Segment as m, cv_pipeline_B2TJrqsi_exports as n, extractBinaryBitmapFromRgba as o, runDirectionalOutpaintPad as p, encodeBinaryBitmapToOverlayRgba as r, extractFloorPlanGrid as s, MATERIAL_ID_CLASSES as t, runAnnotatorPass as u, runLocalLamaErasePass as v, runRestoreFacesPlugin as w, runMaterialIdPass as x, runLocalPaintByExample as y };
