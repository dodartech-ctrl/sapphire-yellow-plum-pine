import assert from "node:assert/strict";
import test from "node:test";
import {
  encodeBinaryBitmapToOverlayRgba,
  encodeBinaryBitmapToRgba,
  estimateDataUrlBytes,
  extractBinaryBitmapFromRgba,
} from "./grounded-sam2-binary";

test("grounded-sam2-binary pure operators", async (t) => {
  await t.test("extracts binary bitmap and bounding box from transparent mask overlay", () => {
    // 4x4 canvas with 2x2 active amber region at (1..2, 1..2)
    const rgba = new Uint8ClampedArray(4 * 4 * 4);
    for (const [x, y] of [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
    ]) {
      const p = (y * 4 + x) * 4;
      rgba[p] = 212;
      rgba[p + 1] = 176;
      rgba[p + 2] = 106;
      rgba[p + 3] = 215;
    }

    const res = extractBinaryBitmapFromRgba(rgba, 4, 4);
    assert.equal(res.width, 4);
    assert.equal(res.height, 4);
    assert.equal(res.totalPixels, 16);
    assert.equal(res.activePixels, 4);
    assert.equal(res.coveragePct, 25);
    assert.deepEqual(res.bbox, { xmin: 1, ymin: 1, xmax: 2, ymax: 2 });
  });

  await t.test("encodes strict black-and-white 0/255 RGBA binary mask bytes", () => {
    const bitmap = new Uint8Array([0, 1, 1, 0]);
    const bw = encodeBinaryBitmapToRgba(bitmap, 2, 2);
    // Pixel 0 -> 0,0,0,255
    assert.deepEqual(Array.from(bw.slice(0, 4)), [0, 0, 0, 255]);
    // Pixel 1 -> 255,255,255,255
    assert.deepEqual(Array.from(bw.slice(4, 8)), [255, 255, 255, 255]);

    const inverted = encodeBinaryBitmapToRgba(bitmap, 2, 2, true);
    assert.deepEqual(Array.from(inverted.slice(0, 4)), [255, 255, 255, 255]);
    assert.deepEqual(Array.from(inverted.slice(4, 8)), [0, 0, 0, 255]);

    // Round-trip back from opaque B&W RGBA image data
    const roundTrip = extractBinaryBitmapFromRgba(bw, 2, 2);
    assert.equal(roundTrip.activePixels, 2);
    assert.equal(roundTrip.coveragePct, 50);
  });

  await t.test("encodes translucent overlay buffer and estimates data URL bytes", () => {
    const overlay = encodeBinaryBitmapToOverlayRgba(new Uint8Array([0, 1]), 2, 1);
    assert.equal(overlay[3], 0);
    assert.equal(overlay[4], 212);
    assert.equal(overlay[7], 205);

    const bytes = estimateDataUrlBytes("data:image/png;base64,AAAA");
    assert.equal(bytes, 3);
    assert.equal(estimateDataUrlBytes(null), 0);
  });
});
