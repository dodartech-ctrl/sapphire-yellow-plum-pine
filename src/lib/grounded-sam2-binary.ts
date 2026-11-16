/**
 * Pure binary mask conversion & verification utilities for Grounded-SAM 2.
 * Produces deterministic 1-bit foreground/background bitmaps (0 or 1) and
 * strict black-and-white (0 / 255) RGBA buffers suitable for downstream AI inpainting.
 */

export type BinaryMaskStats = {
  width: number;
  height: number;
  totalPixels: number;
  activePixels: number;
  coveragePct: number;
  bbox: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  } | null;
};

export type BinaryMaskData = BinaryMaskStats & {
  bitmap: Uint8Array;
};

/**
 * Extracts a strict binary bitmap (0 or 1 per pixel) from an RGBA canvas buffer.
 * Supports both alpha-matted masks (e.g. amber paint strokes / SAM overlays)
 * and grayscale luminance binary masks (black background / white foreground).
 */
export function extractBinaryBitmapFromRgba(
  rgba: ArrayLike<number>,
  width: number,
  height: number,
  threshold = 24,
): BinaryMaskData {
  const safeW = Math.max(1, Math.round(width));
  const safeH = Math.max(1, Math.round(height));
  const totalPixels = safeW * safeH;
  const bitmap = new Uint8Array(totalPixels);

  let activePixels = 0;
  let xmin = safeW;
  let ymin = safeH;
  let xmax = -1;
  let ymax = -1;

  for (let y = 0; y < safeH; y++) {
    for (let x = 0; x < safeW; x++) {
      const idx = y * safeW + x;
      const p = idx * 4;
      const r = rgba[p] ?? 0;
      const g = rgba[p + 1] ?? 0;
      const b = rgba[p + 2] ?? 0;
      const a = rgba[p + 3] ?? 0;

      // Support both transparent-background amber overlays (alpha-gated)
      // and opaque white-on-black binary masks (luminance-gated).
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const isOpaqueCanvas = a >= 250;
      const isActive = isOpaqueCanvas ? lum > threshold && a > threshold : a > threshold;

      if (isActive) {
        bitmap[idx] = 1;
        activePixels++;
        if (x < xmin) xmin = x;
        if (x > xmax) xmax = x;
        if (y < ymin) ymin = y;
        if (y > ymax) ymax = y;
      }
    }
  }

  return {
    width: safeW,
    height: safeH,
    totalPixels,
    activePixels,
    coveragePct: activePixels > 0 ? Math.max(1, Math.round((activePixels / totalPixels) * 100)) : 0,
    bbox: xmax >= xmin && ymax >= ymin ? { xmin, ymin, xmax, ymax } : null,
    bitmap,
  };
}

/**
 * Encodes a binary bitmap (0 | 1) into strict black (0,0,0,255) / white (255,255,255,255)
 * RGBA binary image bytes for AI inpainting APIs (LaMa / ControlNet / Gemini Inpaint).
 */
export function encodeBinaryBitmapToRgba(
  bitmap: ArrayLike<number>,
  width: number,
  height: number,
  invert = false,
): Uint8ClampedArray {
  const total = Math.max(1, width * height);
  const out = new Uint8ClampedArray(total * 4);
  for (let i = 0; i < total; i++) {
    const active = Boolean(bitmap[i]) !== invert;
    const val = active ? 255 : 0;
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
export function encodeBinaryBitmapToOverlayRgba(
  bitmap: ArrayLike<number>,
  width: number,
  height: number,
  rgb: [number, number, number] = [212, 176, 106],
  alpha = 205,
): Uint8ClampedArray {
  const total = Math.max(1, width * height);
  const out = new Uint8ClampedArray(total * 4);
  for (let i = 0; i < total; i++) {
    if (bitmap[i]) {
      const p = i * 4;
      out[p] = rgb[0];
      out[p + 1] = rgb[1];
      out[p + 2] = rgb[2];
      out[p + 3] = alpha;
    }
  }
  return out;
}

/**
 * Computes byte length summary for a base64 PNG binary mask data URL.
 */
export function estimateDataUrlBytes(dataUrl: string | null | undefined): number {
  if (!dataUrl) return 0;
  const commaIdx = dataUrl.indexOf(",");
  if (commaIdx < 0) return 0;
  const b64 = dataUrl.slice(commaIdx + 1);
  return Math.round((b64.length * 3) / 4);
}
