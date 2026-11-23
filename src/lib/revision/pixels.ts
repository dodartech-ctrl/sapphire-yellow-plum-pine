/**
 * Revision Studio pixel core. Pure functions over raw RGBA rasters and 1-byte
 * masks so the guarantees the product sells ("nothing outside the edit changed")
 * are unit-testable without a browser. No imports, so node can run the tests.
 */

export type Raster = { width: number; height: number; data: Uint8ClampedArray };
/** One byte per pixel: 1 = selected, 0 = not selected. */
export type Mask = { width: number; height: number; data: Uint8Array };

export function emptyMask(width: number, height: number): Mask {
  return { width, height, data: new Uint8Array(width * height) };
}

export function cloneMask(mask: Mask): Mask {
  return { width: mask.width, height: mask.height, data: mask.data.slice() };
}

export function cloneRaster(raster: Raster): Raster {
  return { width: raster.width, height: raster.height, data: new Uint8ClampedArray(raster.data) };
}

export function sameSize(a: { width: number; height: number }, b: { width: number; height: number }): boolean {
  return a.width === b.width && a.height === b.height;
}

/** Paint (value 1) or erase (value 0) a round brush stroke centred on a pixel. */
export function paintDisc(mask: Mask, cx: number, cy: number, radius: number, value: 0 | 1): void {
  const r = Math.max(0.5, radius);
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(mask.width - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(mask.height - 1, Math.ceil(cy + r));
  const r2 = r * r;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) mask.data[y * mask.width + x] = value;
    }
  }
}

/** Paint a stroke between two points so fast pointer moves leave no gaps. */
export function paintStroke(mask: Mask, x0: number, y0: number, x1: number, y1: number, radius: number, value: 0 | 1): void {
  const dist = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.max(1, Math.ceil(dist / Math.max(1, radius / 2)));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    paintDisc(mask, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, radius, value);
  }
}

export function paintRect(mask: Mask, x: number, y: number, w: number, h: number, value: 0 | 1): void {
  const xa = Math.max(0, Math.floor(x));
  const ya = Math.max(0, Math.floor(y));
  const xb = Math.min(mask.width, Math.ceil(x + w));
  const yb = Math.min(mask.height, Math.ceil(y + h));
  for (let yy = ya; yy < yb; yy += 1) for (let xx = xa; xx < xb; xx += 1) mask.data[yy * mask.width + xx] = value;
}

/** Fill a polygon (even-odd rule). Points are in pixel coordinates. */
export function paintPolygon(mask: Mask, points: readonly [number, number][], value: 0 | 1): void {
  if (points.length < 3) return;
  const ys = points.map((p) => p[1]);
  const y0 = Math.max(0, Math.floor(Math.min(...ys)));
  const y1 = Math.min(mask.height - 1, Math.ceil(Math.max(...ys)));
  for (let y = y0; y <= y1; y += 1) {
    const cy = y + 0.5;
    const xs: number[] = [];
    for (let i = 0; i < points.length; i += 1) {
      const [ax, ay] = points[i];
      const [bx, by] = points[(i + 1) % points.length];
      if ((ay <= cy && by > cy) || (by <= cy && ay > cy)) xs.push(ax + ((cy - ay) / (by - ay)) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const xa = Math.max(0, Math.ceil(xs[k] - 0.5));
      const xb = Math.min(mask.width - 1, Math.floor(xs[k + 1] - 0.5));
      for (let x = xa; x <= xb; x += 1) mask.data[y * mask.width + x] = value;
    }
  }
}

/** Flood fill from a seed over pixels of similar colour: the "click a surface" selection. */
export function floodSelect(raster: Raster, mask: Mask, seedX: number, seedY: number, tolerance: number, value: 0 | 1 = 1): number {
  if (!sameSize(raster, mask)) throw new Error("Mask and image sizes differ.");
  const { width, height, data } = raster;
  const sx = Math.floor(seedX);
  const sy = Math.floor(seedY);
  if (sx < 0 || sy < 0 || sx >= width || sy >= height) return 0;
  const si = (sy * width + sx) * 4;
  const sr = data[si];
  const sg = data[si + 1];
  const sb = data[si + 2];
  const tol2 = tolerance * tolerance * 3;
  const seen = new Uint8Array(width * height);
  const stack: number[] = [sy * width + sx];
  let count = 0;
  while (stack.length) {
    const p = stack.pop() as number;
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    const dr = data[i] - sr;
    const dg = data[i + 1] - sg;
    const db = data[i + 2] - sb;
    if (dr * dr + dg * dg + db * db > tol2) continue;
    mask.data[p] = value;
    count += 1;
    const x = p % width;
    const y = (p - x) / width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - width);
    if (y < height - 1) stack.push(p + width);
  }
  return count;
}

export function maskCoverage(mask: Mask): { pixels: number; pct: number } {
  let pixels = 0;
  for (let i = 0; i < mask.data.length; i += 1) if (mask.data[i]) pixels += 1;
  return { pixels, pct: mask.data.length ? (pixels / mask.data.length) * 100 : 0 };
}

/** Protection always wins: a pixel is permitted only if editable AND not protected. */
export function effectiveMask(editable: Mask, protectedMask: Mask): Mask {
  if (!sameSize(editable, protectedMask)) throw new Error("Editable and protected masks differ in size.");
  const out = emptyMask(editable.width, editable.height);
  for (let i = 0; i < out.data.length; i += 1) out.data[i] = editable.data[i] && !protectedMask.data[i] ? 1 : 0;
  return out;
}

/** Grow a mask by `px` pixels (used to include an edge blend in the permitted area, explicitly). */
export function dilate(mask: Mask, px: number): Mask {
  let current = cloneMask(mask);
  for (let step = 0; step < px; step += 1) {
    const next = cloneMask(current);
    for (let y = 0; y < mask.height; y += 1) {
      for (let x = 0; x < mask.width; x += 1) {
        const p = y * mask.width + x;
        if (current.data[p]) continue;
        if (
          (x > 0 && current.data[p - 1]) ||
          (x < mask.width - 1 && current.data[p + 1]) ||
          (y > 0 && current.data[p - mask.width]) ||
          (y < mask.height - 1 && current.data[p + mask.width])
        ) {
          next.data[p] = 1;
        }
      }
    }
    current = next;
  }
  return current;
}

/**
 * Take permitted pixels from the candidate and every other pixel from the
 * parent. Whatever the model did elsewhere is discarded by construction.
 */
export function compositePermitted(parent: Raster, candidate: Raster, permitted: Mask): Raster {
  if (!sameSize(parent, candidate)) throw new Error("Candidate size differs from the original; resize it first.");
  if (!sameSize(parent, permitted)) throw new Error("Mask size differs from the original.");
  const out = cloneRaster(parent);
  for (let p = 0; p < permitted.data.length; p += 1) {
    if (!permitted.data[p]) continue;
    const i = p * 4;
    out.data[i] = candidate.data[i];
    out.data[i + 1] = candidate.data[i + 1];
    out.data[i + 2] = candidate.data[i + 2];
    out.data[i + 3] = candidate.data[i + 3];
  }
  return out;
}

export type DiffReport = {
  dimensionMismatch: boolean;
  totalPixels: number;
  changedOutside: number;
  changedInside: number;
  pass: boolean;
  reason: string;
};

/**
 * The release gate. Lossless comparison against the parent: any changed pixel
 * outside the permitted mask, or any dimension change, fails.
 */
export function diffAgainstParent(parent: Raster, result: Raster, permitted: Mask): DiffReport {
  if (!sameSize(parent, result) || !sameSize(parent, permitted)) {
    return {
      dimensionMismatch: true,
      totalPixels: parent.width * parent.height,
      changedOutside: 0,
      changedInside: 0,
      pass: false,
      reason: "Dimensions changed. A revision must keep the original size and framing.",
    };
  }
  let changedOutside = 0;
  let changedInside = 0;
  for (let p = 0; p < permitted.data.length; p += 1) {
    const i = p * 4;
    const changed =
      parent.data[i] !== result.data[i] ||
      parent.data[i + 1] !== result.data[i + 1] ||
      parent.data[i + 2] !== result.data[i + 2] ||
      parent.data[i + 3] !== result.data[i + 3];
    if (!changed) continue;
    if (permitted.data[p]) changedInside += 1;
    else changedOutside += 1;
  }
  const pass = changedOutside === 0;
  return {
    dimensionMismatch: false,
    totalPixels: permitted.data.length,
    changedOutside,
    changedInside,
    pass,
    reason: pass
      ? `Zero pixels changed outside the editable area (${changedInside.toLocaleString()} changed inside).`
      : `${changedOutside.toLocaleString()} pixels changed outside the editable area.`,
  };
}

/** Highlight every changed pixel in red over a dimmed copy of the parent, for the inspector. */
export function diffOverlay(parent: Raster, result: Raster, permitted?: Mask): Raster {
  const out = cloneRaster(parent);
  for (let p = 0; p < parent.width * parent.height; p += 1) {
    const i = p * 4;
    const changed =
      parent.data[i] !== result.data[i] || parent.data[i + 1] !== result.data[i + 1] || parent.data[i + 2] !== result.data[i + 2];
    if (changed) {
      const outside = permitted ? !permitted.data[p] : false;
      // red = changed OUTSIDE the permitted area (a failure); amber = changed inside (expected)
      out.data[i] = 255;
      out.data[i + 1] = outside ? 0 : 196;
      out.data[i + 2] = 0;
      out.data[i + 3] = 255;
    } else {
      out.data[i] = parent.data[i] * 0.45;
      out.data[i + 1] = parent.data[i + 1] * 0.45;
      out.data[i + 2] = parent.data[i + 2] * 0.45;
    }
  }
  return out;
}

export function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Local finish preview: recolour only the permitted pixels toward a swatch colour
 * while keeping the original light and texture (luminance). Deterministic and
 * offline. It is an approximation of colour under the rendered light, labelled as
 * such wherever it is shown, never a claim about the real material.
 */
export function tintPermitted(parent: Raster, permitted: Mask, swatch: [number, number, number], strength = 0.85): Raster {
  if (!sameSize(parent, permitted)) throw new Error("Mask size differs from the original.");
  const out = cloneRaster(parent);
  let sum = 0;
  let n = 0;
  for (let p = 0; p < permitted.data.length; p += 1) {
    if (!permitted.data[p]) continue;
    const i = p * 4;
    sum += 0.2126 * parent.data[i] + 0.7152 * parent.data[i + 1] + 0.0722 * parent.data[i + 2];
    n += 1;
  }
  if (!n) return out;
  const mean = Math.max(1, sum / n);
  const swatchLum = 0.2126 * swatch[0] + 0.7152 * swatch[1] + 0.0722 * swatch[2];
  const k = Math.min(1, Math.max(0, strength));
  for (let p = 0; p < permitted.data.length; p += 1) {
    if (!permitted.data[p]) continue;
    const i = p * 4;
    const lum = 0.2126 * parent.data[i] + 0.7152 * parent.data[i + 1] + 0.0722 * parent.data[i + 2];
    const ratio = Math.min(2.2, Math.max(0.25, lum / mean));
    for (let c = 0; c < 3; c += 1) {
      const tinted = swatch[c] * ratio * (swatchLum > 0 ? 1 : 0);
      out.data[i + c] = parent.data[i + c] * (1 - k) + tinted * k;
    }
  }
  return out;
}

/** FNV-1a hash of bytes: fast, deterministic, used for duplicate detection (not security). */
export function fastHash(bytes: Uint8Array | Uint8ClampedArray): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i += 1) {
    h ^= bytes[i];
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
