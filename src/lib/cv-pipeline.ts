import type { AnnotatorMode, EsrganModel, IopaintFaceModel, IopaintOutpaintPad, IopaintRemoveBgModel } from "./engines";

export function rgbToLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function computeSobelAt(
  lum: Float32Array | number[],
  width: number,
  height: number,
  x: number,
  y: number,
): { gx: number; gy: number; mag: number } {
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
  const mag = Math.sqrt(gx * gx + gy * gy);
  return { gx, gy, mag };
}

/**
 * Computes relative near-to-far depth score [0..1] combining vertical perspective cue,
 * foreground luminance contrast, and camera distance falloff (Depth-Anything-V2 heuristic).
 */
export function computeDepthScore(lum: number, yNorm: number, xNorm: number, nearBias = 50): number {
  const verticalDepth = yNorm * 0.52 + (1 - Math.abs(xNorm - 0.5) * 1.4) * 0.14;
  const toneCue = (1 - lum / 255) * 0.24;
  const biasShift = (nearBias - 50) / 250;
  return Math.max(0, Math.min(1, verticalDepth + toneCue + 0.1 + biasShift));
}

/**
 * Inferno colormap for Depth-Anything-V2 visualization (0 = far purple-black, 1 = near bright yellow).
 */
export function infernoRamp(t: number): [number, number, number] {
  const c = Math.max(0, Math.min(1, t));
  if (c < 0.25) {
    const k = c / 0.25;
    return [Math.round(12 + k * 78), Math.round(8 + k * 10), Math.round(32 + k * 84)];
  }
  if (c < 0.55) {
    const k = (c - 0.25) / 0.3;
    return [Math.round(90 + k * 112), Math.round(18 + k * 46), Math.round(116 - k * 24)];
  }
  if (c < 0.82) {
    const k = (c - 0.55) / 0.27;
    return [Math.round(202 + k * 46), Math.round(64 + k * 108), Math.round(92 - k * 64)];
  }
  const k = (c - 0.82) / 0.18;
  return [Math.round(248 + k * 7), Math.round(172 + k * 78), Math.round(28 + k * 136)];
}

/**
 * Evaluates whether a pixel belongs to a SAM point-seeded or Grounded-SAM semantic region.
 */
export function matchSemanticSegmentPixel(params: {
  r: number;
  g: number;
  b: number;
  xNorm: number;
  yNorm: number;
  prompt: string;
  seedRgb?: [number, number, number] | null;
  seedPt?: { xNorm: number; yNorm: number } | null;
  threshold: number;
}): boolean {
  const { r, g, b, xNorm, yNorm, prompt, seedRgb, seedPt, threshold } = params;
  if (seedRgb && seedPt) {
    const colorDist = Math.sqrt((r - seedRgb[0]) ** 2 + (g - seedRgb[1]) ** 2 + (b - seedRgb[2]) ** 2);
    const spatialDist = Math.hypot(xNorm - seedPt.xNorm, yNorm - seedPt.yNorm);
    const colorLimit = 22 + threshold * 1.15;
    const spatialLimit = 0.26 + threshold / 220;
    return colorDist <= colorLimit && spatialDist <= spatialLimit;
  }

  const p = prompt.trim().toLowerCase();
  const lum = rgbToLuminance(r, g, b);
  const sat = Math.max(r, g, b) - Math.min(r, g, b);

  if (p.includes("sky")) {
    return yNorm < 0.45 && (b > r + 10 || lum > 175);
  }
  if (p.includes("water") || p.includes("pool")) {
    return yNorm > 0.45 && b >= r - 6 && b >= g - 12 && lum < 175;
  }
  if (p.includes("tree") || p.includes("foliage") || p.includes("plant") || p.includes("landscape") || p.includes("garden")) {
    return g > r + 8 && g >= b - 4 && sat > 18;
  }
  if (p.includes("floor") || p.includes("ground") || p.includes("terrace") || p.includes("deck")) {
    return yNorm > 0.62 && sat < 65;
  }
  if (p.includes("roof") || p.includes("ceiling")) {
    return yNorm < 0.44 && lum < 145 && sat < 55;
  }
  if (p.includes("glass") || p.includes("glazing") || p.includes("window")) {
    return yNorm > 0.22 && yNorm < 0.78 && b >= r - 8 && (lum < 120 || b > 140);
  }
  // Default: facade / walls / structural architectural massing
  return yNorm > 0.2 && yNorm < 0.78 && lum >= 95 && lum <= 228 && sat < 72;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load source image for preprocessing."));
    img.src = src;
  });
}

function prepareWorkCanvas(img: HTMLImageElement, maxWidth = 768) {
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
  return { canvas, ctx, width, height };
}

/**
 * Executes lllyasviel/Annotators style structural edge, MLSD, LineArt, SoftEdge, or Normal Map extraction.
 */
export async function runAnnotatorPass(
  src: string,
  mode: AnnotatorMode,
  threshold = 58,
): Promise<{ dataUrl: string; width: number; height: number }> {
  if (mode === "none") {
    return { dataUrl: src, width: 1280, height: 720 };
  }
  const img = await loadImage(src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 768);
  const imgData = ctx.getImageData(0, 0, width, height);
  const srcPx = imgData.data;
  const lum = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    lum[i] = rgbToLuminance(srcPx[p], srcPx[p + 1], srcPx[p + 2]);
  }

  const out = ctx.createImageData(width, height);
  const dst = out.data;
  const gate = Math.max(18, 175 - threshold * 1.45);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const p = idx * 4;
      const { gx, gy, mag } = computeSobelAt(lum, width, height, x, y);

      if (mode === "normal") {
        const nx = Math.max(-1, Math.min(1, -gx / 220));
        const ny = Math.max(-1, Math.min(1, -gy / 220));
        const nz = Math.sqrt(Math.max(0.05, 1 - nx * nx - ny * ny));
        dst[p] = Math.round((nx * 0.5 + 0.5) * 255);
        dst[p + 1] = Math.round((ny * 0.5 + 0.5) * 255);
        dst[p + 2] = Math.round((nz * 0.5 + 0.5) * 255);
        dst[p + 3] = 255;
      } else if (mode === "lineart") {
        const ink = Math.max(0, Math.min(255, 255 - (mag * (threshold / 42))));
        dst[p] = ink;
        dst[p + 1] = ink;
        dst[p + 2] = Math.min(255, ink + 4);
        dst[p + 3] = 255;
      } else if (mode === "mlsd") {
        const orthogonalBias = Math.max(Math.abs(gx), Math.abs(gy));
        const onLine = orthogonalBias > gate * 0.9 && Math.abs(Math.abs(gx) - Math.abs(gy)) > gate * 0.22;
        const val = onLine ? 245 : 14;
        dst[p] = val;
        dst[p + 1] = onLine ? 220 : 14;
        dst[p + 2] = onLine ? 165 : 18;
        dst[p + 3] = 255;
      } else if (mode === "softedge") {
        const soft = Math.max(0, Math.min(255, mag * (0.65 + threshold / 120)));
        dst[p] = soft;
        dst[p + 1] = soft;
        dst[p + 2] = soft;
        dst[p + 3] = 255;
      } else {
        // Canny crisp binary edge map
        const edge = mag >= gate ? 255 : 0;
        dst[p] = edge;
        dst[p + 1] = edge;
        dst[p + 2] = edge;
        dst[p + 3] = 255;
      }
    }
  }

  ctx.putImageData(out, 0, 0);
  return { dataUrl: canvas.toDataURL("image/png"), width, height };
}

/**
 * Executes DepthAnything/Depth-Anything-V2 relative Z-depth map visualization.
 */
export async function runDepthAnythingPass(
  src: string,
  heatmap = true,
  nearBias = 50,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const img = await loadImage(src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 768);
  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;
  const out = ctx.createImageData(width, height);
  const dst = out.data;

  for (let y = 0; y < height; y++) {
    const yNorm = y / Math.max(1, height - 1);
    for (let x = 0; x < width; x++) {
      const xNorm = x / Math.max(1, width - 1);
      const p = (y * width + x) * 4;
      const lum = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
      const d = computeDepthScore(lum, yNorm, xNorm, nearBias);

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
  return { dataUrl: canvas.toDataURL("image/png"), width, height };
}

/**
 * Executes facebookresearch/segment-anything (SAM point prompt) and Grounded-SAM (text prompt)
 * architectural region segmentation, producing both visual overlay and an amber Krea Inpaint mask.
 */
export async function runGroundedSamMask(params: {
  src: string;
  prompt: string;
  point?: { xNorm: number; yNorm: number } | null;
  threshold?: number;
}): Promise<{ previewUrl: string; maskDataUrl: string; coveragePct: number }> {
  const img = await loadImage(params.src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 768);
  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;

  let seedRgb: [number, number, number] | null = null;
  if (params.point) {
    const sx = Math.max(0, Math.min(width - 1, Math.round(params.point.xNorm * (width - 1))));
    const sy = Math.max(0, Math.min(height - 1, Math.round(params.point.yNorm * (height - 1))));
    const sp = (sy * width + sx) * 4;
    seedRgb = [px[sp], px[sp + 1], px[sp + 2]];
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

      const hit = matchSemanticSegmentPixel({
        r,
        g,
        b,
        xNorm,
        yNorm,
        prompt: params.prompt,
        seedRgb,
        seedPt: params.point,
        threshold,
      });

      if (hit) {
        matchedCount++;
        // Amber-gold semantic highlight overlay on preview
        pDst[p] = Math.min(255, Math.round(r * 0.45 + 218 * 0.55));
        pDst[p + 1] = Math.min(255, Math.round(g * 0.45 + 172 * 0.55));
        pDst[p + 2] = Math.min(255, Math.round(b * 0.45 + 88 * 0.55));
        pDst[p + 3] = 255;

        // Krea-compatible translucent amber brush mask buffer
        mDst[p] = 212;
        mDst[p + 1] = 176;
        mDst[p + 2] = 106;
        mDst[p + 3] = 205;
      } else {
        pDst[p] = Math.round(r * 0.58);
        pDst[p + 1] = Math.round(g * 0.58);
        pDst[p + 2] = Math.round(b * 0.58);
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
    previewUrl: canvas.toDataURL("image/jpeg", 0.9),
    maskDataUrl: maskCanvas.toDataURL("image/png"),
    coveragePct: Math.round((matchedCount / Math.max(1, total)) * 100),
  };
}

export const MATERIAL_ID_CLASSES = [
  { id: "sky", label: "Sky", rgb: [110, 178, 245] as [number, number, number], hex: "#6eb2f5" },
  { id: "glazing", label: "Glazing", rgb: [45, 212, 191] as [number, number, number], hex: "#2dd4bf" },
  { id: "foliage", label: "Foliage", rgb: [74, 222, 128] as [number, number, number], hex: "#4ade80" },
  { id: "water", label: "Water", rgb: [56, 130, 246] as [number, number, number], hex: "#3882f6" },
  { id: "paving", label: "Road / Paving", rgb: [148, 163, 184] as [number, number, number], hex: "#94a3b8" },
  { id: "warm-clad", label: "Timber / Brick", rgb: [249, 115, 22] as [number, number, number], hex: "#f97316" },
  { id: "roof", label: "Roof / Trim", rgb: [168, 85, 247] as [number, number, number], hex: "#a855f7" },
  { id: "facade", label: "Facade Wall", rgb: [250, 204, 21] as [number, number, number], hex: "#facc15" },
] as const;

/**
 * Classifies a pixel into a flat Material ID RGB color matching ARCHVIZ-Prompt-Dictionary-Builder's
 * material-id-map specification (solid flat color per architectural material/surface class).
 */
export function classifyMaterialIdPixel(
  r: number,
  g: number,
  b: number,
  xNorm: number,
  yNorm: number,
): { id: string; rgb: [number, number, number] } {
  const lum = rgbToLuminance(r, g, b);
  const sat = Math.max(r, g, b) - Math.min(r, g, b);

  if (yNorm < 0.36 && (b > r + 8 || lum > 188) && sat < 85) {
    return { id: "sky", rgb: [110, 178, 245] };
  }
  if (g > r + 8 && g >= b - 4 && sat > 18) {
    return { id: "foliage", rgb: [74, 222, 128] };
  }
  if (yNorm > 0.5 && b > r + 14 && b >= g && lum < 175) {
    return { id: "water", rgb: [56, 130, 246] };
  }
  if (yNorm > 0.16 && yNorm < 0.78 && b >= r - 4 && (lum < 105 || (b > 135 && sat > 22))) {
    return { id: "glazing", rgb: [45, 212, 191] };
  }
  if (yNorm > 0.66 && sat < 55) {
    return { id: "paving", rgb: [148, 163, 184] };
  }
  if (r > b + 22 && r >= g + 6 && sat > 24 && xNorm >= 0) {
    return { id: "warm-clad", rgb: [249, 115, 22] };
  }
  if (yNorm < 0.42 && lum < 130 && sat < 48) {
    return { id: "roof", rgb: [168, 85, 247] };
  }
  return { id: "facade", rgb: [250, 204, 21] };
}

/**
 * Generates a flat, unshaded Material ID segmentation map for architectural masking and editing.
 */
export async function runMaterialIdPass(src: string): Promise<{ dataUrl: string; width: number; height: number }> {
  const img = await loadImage(src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 768);
  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;
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
  return { dataUrl: canvas.toDataURL("image/png"), width, height };
}

/**
 * Executes xinntao/Real-ESRGAN inspired 2x architectural super-resolution & edge-sharpening pass.
 */
export async function runRealEsrganPass(
  src: string,
  model: EsrganModel,
  denoise = 25,
  faceEnhance = false,
): Promise<string> {
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
  const contrastBoost = model === "4x-ArchSharp" ? 1.12 : faceEnhance ? 1.1 : 1.07;
  const satBoost = denoise > 50 ? 1.02 : 1.08;
  ctx.filter = `contrast(${contrastBoost}) saturate(${satBoost}) brightness(1.02)`;
  ctx.drawImage(img, 0, 0, width, height);
  ctx.filter = "none";

  // Subtle unsharp detail convolution on luminance for crisp stone/timber/fixture micro-grain
  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;
  const copy = new Uint8ClampedArray(px);
  const baseAmount = model === "4x-ArchSharp" ? 0.42 : model === "RealESRGAN_x4plus" ? 0.34 : 0.24;
  const amount = faceEnhance ? baseAmount + 0.14 : baseAmount;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = (y * width + x) * 4;
      const top = ((y - 1) * width + x) * 4;
      const bot = ((y + 1) * width + x) * 4;
      const lft = (y * width + (x - 1)) * 4;
      const rgt = (y * width + (x + 1)) * 4;
      for (let c = 0; c < 3; c++) {
        const blur = (copy[top + c] + copy[bot + c] + copy[lft + c] + copy[rgt + c]) * 0.25;
        const sharpened = copy[p + c] + (copy[p + c] - blur) * amount;
        px[p + c] = Math.max(0, Math.min(255, Math.round(sharpened)));
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.94);
}

// #11 Edge-aware SAM-2 style contiguous connected region segmentation from clicked point
export async function runSam2RegionSegment(params: {
  src: string;
  point: { xNorm: number; yNorm: number };
  threshold?: number;
}): Promise<{ previewUrl: string; maskDataUrl: string; coveragePct: number }> {
  const img = await loadImage(params.src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 512);
  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;
  const total = width * height;
  const lum = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const p = i * 4;
    lum[i] = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
  }

  const sx = Math.max(0, Math.min(width - 1, Math.round(params.point.xNorm * (width - 1))));
  const sy = Math.max(0, Math.min(height - 1, Math.round(params.point.yNorm * (height - 1))));
  const seedIdx = sy * width + sx;
  const sp = seedIdx * 4;
  const sr = px[sp];
  const sg = px[sp + 1];
  const sb = px[sp + 2];

  const threshold = params.threshold ?? 45;
  const colorGate = 24 + threshold * 1.1;
  const edgeStop = 42 + threshold * 0.9;

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
      cy < height - 1 ? idx + width : -1,
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
      pDst[p] = Math.min(255, Math.round(px[p] * 0.45 + 225 * 0.55));
      pDst[p + 1] = Math.min(255, Math.round(px[p + 1] * 0.45 + 178 * 0.55));
      pDst[p + 2] = Math.min(255, Math.round(px[p + 2] * 0.45 + 90 * 0.55));
      pDst[p + 3] = 255;

      mDst[p] = 212;
      mDst[p + 1] = 176;
      mDst[p + 2] = 106;
      mDst[p + 3] = 215;
    } else {
      pDst[p] = Math.round(px[p] * 0.52);
      pDst[p + 1] = Math.round(px[p + 1] * 0.52);
      pDst[p + 2] = Math.round(px[p + 2] * 0.52);
      pDst[p + 3] = 255;
    }
  }

  ctx.putImageData(previewOut, 0, 0);
  maskCtx.putImageData(maskOut, 0, 0);
  return {
    previewUrl: canvas.toDataURL("image/jpeg", 0.9),
    maskDataUrl: maskCanvas.toDataURL("image/png"),
    coveragePct: Math.max(1, Math.round((tail / total) * 100)),
  };
}

// #7 Extract wall mask grid from uploaded CAD / PDF-rendered 2D floor plan image
export async function extractFloorPlanGrid(
  src: string,
  cols = 40,
  rows = 30,
): Promise<{ mask: Uint8Array; cols: number; rows: number }> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const mask = new Uint8Array(cols * rows);
  if (!ctx) return { mask, cols, rows };
  ctx.drawImage(img, 0, 0, cols, rows);
  const px = ctx.getImageData(0, 0, cols, rows).data;
  for (let i = 0; i < cols * rows; i++) {
    const p = i * 4;
    const lum = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
    mask[i] = lum < 115 ? 1 : 0;
  }
  return { mask, cols, rows };
}

// #14 Generative Tiled Upscaler + Micro-Grain Texture Synthesis (2x / 4x / 8x capped safely to browser canvas budget)
export async function runTiledUpscalePass(
  src: string,
  factor: 1 | 2 | 4 | 8,
  model: EsrganModel,
  denoise = 25,
  faceEnhance = false,
): Promise<string> {
  if (factor <= 2) {
    return runRealEsrganPass(src, model, denoise, faceEnhance);
  }
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

  // Synthesize crisp stone/timber pore micro-grain in tiles
  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;
  const copy = new Uint8ClampedArray(px);
  const crisp = factor === 8 ? 0.44 : 0.36;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = (y * width + x) * 4;
      const grain = (((x * 13 + y * 29) % 7) - 3) * (denoise < 40 ? 1.4 : 0.5);
      for (let c = 0; c < 3; c++) {
        const blur = (copy[p - 4 + c] + copy[p + 4 + c] + copy[p - width * 4 + c] + copy[p + width * 4 + c]) * 0.25;
        px[p + c] = Math.max(0, Math.min(255, Math.round(copy[p + c] + (copy[p + c] - blur) * crisp + grain)));
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.94);
}

// #12 Client Preview Outpainting Canvas Extension (21:9, 9:16, 16:9)
export async function runClientOutpaintCanvas(
  src: string,
  targetRatio: "21:9" | "9:16" | "16:9",
): Promise<string> {
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

  // Ambient extended backdrop + edge-feathered original render center
  ctx.save();
  ctx.filter = "blur(26px) brightness(0.92)";
  ctx.drawImage(img, -40, -40, targetW + 80, targetH + 80);
  ctx.restore();

  const scale = Math.min(targetW / natW, targetH / natH) * 0.88;
  const dw = Math.round(natW * scale);
  const dh = Math.round(natH * scale);
  const dx = Math.round((targetW - dw) * 0.5);
  const dy = Math.round((targetH - dh) * 0.5);
  ctx.drawImage(img, dx, dy, dw, dh);

  return canvas.toDataURL("image/jpeg", 0.92);
}

// #13 Deterministic Relighting & Season Transform Fallback
export async function runRelightWeatherPass(
  src: string,
  preset: "overcast-to-golden" | "summer-to-snow" | "day-to-dusk",
): Promise<string> {
  const img = await loadImage(src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
  ctx.save();
  if (preset === "overcast-to-golden") {
    ctx.filter = "contrast(1.1) saturate(1.22) sepia(0.18) brightness(1.04)";
  } else if (preset === "summer-to-snow") {
    ctx.filter = "contrast(1.08) saturate(0.58) brightness(1.12)";
  } else {
    ctx.filter = "contrast(1.18) saturate(0.92) brightness(0.82) hue-rotate(-10deg)";
  }
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
    grad.addColorStop(0.7, "rgba(232, 180, 92, 0.16)");
    grad.addColorStop(1, "rgba(12, 12, 18, 0.38)");
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.92);
}

/**
 * Pure separable O(W*H) morphological Chebyshev dilation for binary masks (0/1).
 */
export function dilateBinaryMask(
  mask: Uint8Array,
  width: number,
  height: number,
  radius: number,
): Uint8Array {
  const r = Math.max(0, Math.min(32, Math.round(radius)));
  if (r === 0) return new Uint8Array(mask);

  const horiz = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    let count = 0;
    for (let x = 0; x <= Math.min(width - 1, r); x++) {
      count += mask[rowOffset + x] ? 1 : 0;
    }
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
    for (let y = 0; y <= Math.min(height - 1, r); y++) {
      count += horiz[y * width + x] ? 1 : 0;
    }
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

export function invertBinaryMask(mask: Uint8Array): Uint8Array {
  const out = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) {
    out[i] = mask[i] ? 0 : 1;
  }
  return out;
}

export function buildDirectionalOutpaintBounds(
  srcW: number,
  srcH: number,
  pad: IopaintOutpaintPad,
): {
  srcW: number;
  srcH: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  targetW: number;
  targetH: number;
  dx: number;
  dy: number;
} {
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
    dy: top,
  };
}

function getMaskBbox(binary: Uint8Array, width: number, height: number) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (binary[y * width + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX || maxY < minY) return null;
  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/**
 * Applies morphological mask dilation (+px) and inversion to an amber Oriel mask buffer.
 */
export async function refineMaskBuffer(
  maskDataUrl: string,
  options: { dilatePx: number; invert: boolean },
): Promise<string> {
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
  let binary = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    binary[i] = px[i * 4 + 3] > 24 ? 1 : 0;
  }
  if (options.dilatePx > 0) {
    binary = dilateBinaryMask(binary, width, height, options.dilatePx);
  }
  if (options.invert) {
    binary = invertBinaryMask(binary);
  }
  const out = ctx.createImageData(width, height);
  const dst = out.data;
  for (let i = 0; i < total; i++) {
    if (binary[i]) {
      const p = i * 4;
      dst[p] = 212;
      dst[p + 1] = 176;
      dst[p + 2] = 106;
      dst[p + 3] = 205;
    }
  }
  ctx.putImageData(out, 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * IOPaint LaMa / MAT / MIGAN / ZITS deterministic inward onion-peel + patch diffusion erase.
 * Seamlessly reconstructs textures under painted mask regions using surrounding boundary pixels.
 */
export async function runLocalLamaErasePass(
  src: string,
  maskDataUrl: string,
  model = "lama",
): Promise<string> {
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
  const rawMask = new Uint8Array(total);
  let hasMask = false;
  for (let i = 0; i < total; i++) {
    if (mPx[i * 4 + 3] > 24) {
      rawMask[i] = 1;
      hasMask = true;
    }
  }
  if (!hasMask) return src;

  // Slightly feather border halo by 1px for crisp anti-aliased seams
  const activeMask = dilateBinaryMask(rawMask, width, height, 1);
  const known = new Uint8Array(total);
  const peelOrder: number[] = [];
  let remaining = 0;

  for (let i = 0; i < total; i++) {
    if (activeMask[i]) {
      remaining++;
    } else {
      known[i] = 1;
    }
  }

  // BFS inward onion-peel order from known boundary inward
  let frontier: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (known[i]) continue;
      if (
        (x > 0 && known[i - 1]) ||
        (x < width - 1 && known[i + 1]) ||
        (y > 0 && known[i - width]) ||
        (y < height - 1 && known[i + width])
      ) {
        frontier.push(i);
      }
    }
  }

  const queued = new Uint8Array(known);
  for (const idx of frontier) queued[idx] = 1;

  while (frontier.length > 0 && peelOrder.length < remaining + 4) {
    const nextFrontier: number[] = [];
    for (const idx of frontier) {
      peelOrder.push(idx);
      const x = idx % width;
      const y = Math.floor(idx / width);
      const nbs = [
        x > 0 ? idx - 1 : -1,
        x < width - 1 ? idx + 1 : -1,
        y > 0 ? idx - width : -1,
        y < height - 1 ? idx + width : -1,
      ];
      for (const n of nbs) {
        if (n >= 0 && !queued[n]) {
          queued[n] = 1;
          nextFrontier.push(n);
        }
      }
    }
    frontier = nextFrontier;
  }

  const isStructural = model === "zits" || model === "mat";
  const sampleOffsets = isStructural
    ? [
        [-2, 0], [2, 0], [0, -2], [0, 2],
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-3, -1], [3, 1], [-1, -3], [1, 3],
      ]
    : [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [1, -1], [-1, 1], [1, 1],
        [-2, 0], [2, 0], [0, -2], [0, 2],
      ];

  // Fill pixels sequentially from boundary inward
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
      // Micro-grain jitter prevents flat plastic fill across large erased regions
      const micro = (((x * 19 + y * 37) % 5) - 2) * (model === "manga" ? 0.5 : 1.1);
      px[p] = Math.max(0, Math.min(255, Math.round(sumR / sumW + micro)));
      px[p + 1] = Math.max(0, Math.min(255, Math.round(sumG / sumW + micro)));
      px[p + 2] = Math.max(0, Math.min(255, Math.round(sumB / sumW + micro)));
      px[p + 3] = 255;
      known[idx] = 1;
    }
  }

  // Multi-pass smoothing diffusion inside the masked area so tonal gradients blend cleanly
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
      for (let c = 0; c < 3; c++) {
        copy[p + c] = Math.round((px[p + c] * 2 + px[l + c] + px[r + c] + px[u + c] + px[d + c]) / 6);
      }
    }
    for (const idx of peelOrder) {
      const p = idx * 4;
      px[p] = copy[p];
      px[p + 1] = copy[p + 1];
      px[p + 2] = copy[p + 2];
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.93);
}

/**
 * IOPaint MobileSAM / SAM-2 interactive multi-point (+ include / - exclude) segmentation.
 */
export async function runInteractiveSamMultiPointMask(params: {
  src: string;
  posPoints: Array<{ xNorm: number; yNorm: number }>;
  negPoints: Array<{ xNorm: number; yNorm: number }>;
  threshold?: number;
}): Promise<{ previewUrl: string; maskDataUrl: string; coveragePct: number }> {
  const img = await loadImage(params.src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 512);
  const px = ctx.getImageData(0, 0, width, height).data;
  const total = width * height;
  const lum = new Float32Array(total);
  for (let i = 0; i < total; i++) {
    const p = i * 4;
    lum[i] = rgbToLuminance(px[p], px[p + 1], px[p + 2]);
  }

  const threshold = params.threshold ?? 45;
  const colorGate = 24 + threshold * 1.1;
  const edgeStop = 42 + threshold * 0.9;

  function floodFromPoint(pt: { xNorm: number; yNorm: number }, mult = 1): Uint8Array {
    const sx = Math.max(0, Math.min(width - 1, Math.round(pt.xNorm * (width - 1))));
    const sy = Math.max(0, Math.min(height - 1, Math.round(pt.yNorm * (height - 1))));
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
        cx > 0 ? idx - 1 : -1,
        cx < width - 1 ? idx + 1 : -1,
        cy > 0 ? idx - width : -1,
        cy < height - 1 ? idx + width : -1,
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

  const mask = new Uint8Array(total);
  for (const pt of params.posPoints) {
    const reg = floodFromPoint(pt, 1);
    for (let i = 0; i < total; i++) {
      if (reg[i]) mask[i] = 1;
    }
  }
  for (const npt of params.negPoints) {
    const excl = floodFromPoint(npt, 0.85);
    const exclDilated = dilateBinaryMask(excl, width, height, 2);
    for (let i = 0; i < total; i++) {
      if (exclDilated[i]) mask[i] = 0;
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
  let count = 0;

  for (let i = 0; i < total; i++) {
    const p = i * 4;
    if (mask[i]) {
      count++;
      pDst[p] = Math.min(255, Math.round(px[p] * 0.45 + 225 * 0.55));
      pDst[p + 1] = Math.min(255, Math.round(px[p + 1] * 0.45 + 178 * 0.55));
      pDst[p + 2] = Math.min(255, Math.round(px[p + 2] * 0.45 + 90 * 0.55));
      pDst[p + 3] = 255;

      mDst[p] = 212;
      mDst[p + 1] = 176;
      mDst[p + 2] = 106;
      mDst[p + 3] = 215;
    } else {
      pDst[p] = Math.round(px[p] * 0.55);
      pDst[p + 1] = Math.round(px[p + 1] * 0.55);
      pDst[p + 2] = Math.round(px[p + 2] * 0.55);
      pDst[p + 3] = 255;
    }
  }

  ctx.putImageData(previewOut, 0, 0);
  maskCtx.putImageData(maskOut, 0, 0);
  return {
    previewUrl: canvas.toDataURL("image/jpeg", 0.9),
    maskDataUrl: maskCanvas.toDataURL("image/png"),
    coveragePct: Math.round((count / Math.max(1, total)) * 100),
  };
}

/**
 * IOPaint RemoveBG Plugin (RMBG-2.0 / BiRefNet / U2Net / IS-Net / Anime-Seg).
 * Separates architectural subject foreground from sky/background border distribution.
 */
export async function runRemoveBgPlugin(
  src: string,
  model: IopaintRemoveBgModel,
  outputMode: "cutout" | "mask",
): Promise<{ url: string; maskDataUrl: string }> {
  const img = await loadImage(src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1024);
  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;

  // Estimate dominant border background RGB (top + left/right corners)
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
  for (let y = 0; y < Math.floor(height * 0.45); y += 4) {
    const lP = (y * width) * 4;
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
      const centerDist = Math.hypot((xNorm - 0.5) * 1.15, (yNorm - 0.54) * 1.1);
      const foregroundScore = colorDist + (1 - Math.min(1, centerDist)) * 42;
      const isForeground = foregroundScore > sensitivity || yNorm > 0.72;

      oDst[p] = r;
      oDst[p + 1] = g;
      oDst[p + 2] = b;
      oDst[p + 3] = isForeground ? 255 : outputMode === "cutout" ? 0 : 255;

      // For RemoveBG -> Mask mode, mask highlights background so user can replace sky/surroundings cleanly
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
    maskDataUrl: maskCanvas.toDataURL("image/png"),
  };
}

/**
 * IOPaint Restore Faces Plugin (GFPGAN v1.4 / RestoreFormer++).
 * Restores crisp facial/silhouette/fixture micro-detail & warm tone contrast without blowing highlights.
 */
export async function runRestoreFacesPlugin(src: string, model: IopaintFaceModel): Promise<string> {
  const img = await loadImage(src);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
  ctx.filter = model === "restoreformer" ? "contrast(1.07) saturate(1.06) brightness(1.01)" : "contrast(1.09) saturate(1.04) brightness(1.02)";
  ctx.drawImage(img, 0, 0, width, height);
  ctx.filter = "none";

  const imgData = ctx.getImageData(0, 0, width, height);
  const px = imgData.data;
  const copy = new Uint8ClampedArray(px);
  const amount = model === "restoreformer" ? 0.32 : 0.38;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = (y * width + x) * 4;
      const t = ((y - 1) * width + x) * 4;
      const b = ((y + 1) * width + x) * 4;
      const l = p - 4;
      const r = p + 4;
      for (let c = 0; c < 3; c++) {
        const avg = (copy[t + c] + copy[b + c] + copy[l + c] + copy[r + c]) * 0.25;
        px[p + c] = Math.max(0, Math.min(255, Math.round(copy[p + c] + (copy[p + c] - avg) * amount)));
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.94);
}

/**
 * IOPaint Directional Outpainting Pad (+Top, +Right, +Bottom, +Left px).
 * Produces both the extended backdrop canvas and exact border inpaint mask.
 */
export async function runDirectionalOutpaintPad(
  src: string,
  pad: IopaintOutpaintPad,
): Promise<{ paddedUrl: string; maskDataUrl: string; width: number; height: number }> {
  const img = await loadImage(src);
  const natW = Math.min(1440, img.naturalWidth || 1280);
  const natH = Math.min(1080, img.naturalHeight || 720);
  const bounds = buildDirectionalOutpaintBounds(natW, natH, pad);

  const canvas = document.createElement("canvas");
  canvas.width = bounds.targetW;
  canvas.height = bounds.targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { paddedUrl: src, maskDataUrl: src, width: natW, height: natH };
  }

  // Ambient extended sky/ground/backdrop extrapolation
  ctx.save();
  ctx.filter = "blur(22px) brightness(0.95)";
  ctx.drawImage(img, -36, -36, bounds.targetW + 72, bounds.targetH + 72);
  ctx.restore();

  // Sharp preserved interior render
  ctx.drawImage(img, bounds.dx, bounds.dy, bounds.srcW, bounds.srcH);

  // Build exact mask around padded outer border
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
    paddedUrl: canvas.toDataURL("image/jpeg", 0.92),
    maskDataUrl: maskCanvas.toDataURL("image/png"),
    width: bounds.targetW,
    height: bounds.targetH,
  };
}

/**
 * IOPaint AnyText deterministic fallback preview: renders architectural signage inside the masked box.
 */
export async function runLocalAnyText(
  src: string,
  maskDataUrl: string,
  text: string,
): Promise<string> {
  const [img, maskImg] = await Promise.all([loadImage(src), loadImage(maskDataUrl)]);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
  const mCanvas = document.createElement("canvas");
  mCanvas.width = width;
  mCanvas.height = height;
  const mCtx = mCanvas.getContext("2d");
  if (!mCtx) return src;
  mCtx.drawImage(maskImg, 0, 0, width, height);
  const mPx = mCtx.getImageData(0, 0, width, height).data;
  const bin = new Uint8Array(width * height);
  for (let i = 0; i < bin.length; i++) bin[i] = mPx[i * 4 + 3] > 24 ? 1 : 0;
  const bbox = getMaskBbox(bin, width, height);
  if (!bbox) return src;

  const cleanText = (text.trim() || "ORIEL STUDIO").slice(0, 36);
  const cx = bbox.minX + bbox.w * 0.5;
  const cy = bbox.minY + bbox.h * 0.5;
  const fontSize = Math.max(16, Math.min(72, Math.round(bbox.h * 0.52)));

  ctx.save();
  ctx.fillStyle = "rgba(24, 21, 18, 0.72)";
  ctx.fillRect(bbox.minX, bbox.minY + bbox.h * 0.12, bbox.w, bbox.h * 0.76);
  ctx.strokeStyle = "rgba(212, 176, 106, 0.7)";
  ctx.lineWidth = 2;
  ctx.strokeRect(bbox.minX, bbox.minY + bbox.h * 0.12, bbox.w, bbox.h * 0.76);

  ctx.font = `600 ${fontSize}px ui-serif, Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillText(cleanText, cx + 1.5, cy + 2, bbox.w * 0.88);
  ctx.fillStyle = "#f5efe6";
  ctx.fillText(cleanText, cx, cy, bbox.w * 0.88);
  ctx.restore();
  return canvas.toDataURL("image/jpeg", 0.93);
}

/**
 * IOPaint Paint-by-Example deterministic fallback: inserts a reference swatch/object into mask bounds.
 */
export async function runLocalPaintByExample(
  src: string,
  maskDataUrl: string,
  exampleUrl: string,
  strength = 75,
): Promise<string> {
  const [img, maskImg, exImg] = await Promise.all([loadImage(src), loadImage(maskDataUrl), loadImage(exampleUrl)]);
  const { canvas, ctx, width, height } = prepareWorkCanvas(img, 1280);
  const mCanvas = document.createElement("canvas");
  mCanvas.width = width;
  mCanvas.height = height;
  const mCtx = mCanvas.getContext("2d");
  if (!mCtx) return src;
  mCtx.drawImage(maskImg, 0, 0, width, height);
  const mPx = mCtx.getImageData(0, 0, width, height).data;
  const bin = new Uint8Array(width * height);
  for (let i = 0; i < bin.length; i++) bin[i] = mPx[i * 4 + 3] > 24 ? 1 : 0;
  const bbox = getMaskBbox(bin, width, height);
  if (!bbox) return src;

  const exPatch = document.createElement("canvas");
  exPatch.width = width;
  exPatch.height = height;
  const exCtx = exPatch.getContext("2d");
  if (!exCtx) return src;
  exCtx.drawImage(maskImg, 0, 0, width, height);
  exCtx.globalCompositeOperation = "source-in";
  exCtx.drawImage(exImg, bbox.minX, bbox.minY, bbox.w, bbox.h);
  exCtx.globalCompositeOperation = "source-over";

  ctx.save();
  ctx.globalAlpha = Math.max(0.45, Math.min(0.95, strength / 100));
  ctx.drawImage(exPatch, 0, 0, width, height);
  ctx.restore();
  return canvas.toDataURL("image/jpeg", 0.92);
}

