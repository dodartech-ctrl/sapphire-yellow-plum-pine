import type { Mask, Raster } from "./pixels.ts";

/** Longest edge of the lossless working image. Originals are stored untouched beside it. */
export const WORKING_EDGE = 1280;

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The image could not be loaded."));
    img.src = src;
  });
}

export function rasterFromImage(img: CanvasImageSource & { width: number; height: number }, maxEdge = WORKING_EDGE, size?: { width: number; height: number }): Raster {
  const scale = size ? 1 : Math.min(1, maxEdge / Math.max(img.width, img.height));
  const width = size?.width ?? Math.max(1, Math.round(img.width * scale));
  const height = size?.height ?? Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.drawImage(img, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  return { width, height, data };
}

export async function rasterFromDataUrl(src: string, maxEdge = WORKING_EDGE, size?: { width: number; height: number }): Promise<Raster> {
  return rasterFromImage(await loadImage(src), maxEdge, size);
}

function canvasFor(raster: Raster): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = raster.width;
  canvas.height = raster.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  const copy = new Uint8ClampedArray(raster.data);
  ctx.putImageData(new ImageData(copy, raster.width, raster.height), 0, 0);
  return canvas;
}

/** PNG keeps the working image lossless, so the pixel gate is exact. */
export function rasterToPngDataUrl(raster: Raster): string {
  return canvasFor(raster).toDataURL("image/png");
}

export function rasterToJpegDataUrl(raster: Raster, quality = 0.9): string {
  return canvasFor(raster).toDataURL("image/jpeg", quality);
}

/** White = selected, black = not: the mask format image-edit models expect. */
export function maskToPngDataUrl(mask: Mask): string {
  const raster: Raster = { width: mask.width, height: mask.height, data: new Uint8ClampedArray(mask.width * mask.height * 4) };
  for (let p = 0; p < mask.data.length; p += 1) {
    const v = mask.data[p] ? 255 : 0;
    const i = p * 4;
    raster.data[i] = v;
    raster.data[i + 1] = v;
    raster.data[i + 2] = v;
    raster.data[i + 3] = 255;
  }
  return rasterToPngDataUrl(raster);
}

export function averageColorHex(raster: Raster): string {
  let r = 0;
  let g = 0;
  let b = 0;
  const n = raster.width * raster.height;
  for (let p = 0; p < n; p += 1) {
    r += raster.data[p * 4];
    g += raster.data[p * 4 + 1];
    b += raster.data[p * 4 + 2];
  }
  const hex = (v: number) => Math.round(v / Math.max(1, n)).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadText(filename: string, text: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  downloadDataUrl(filename, url);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
