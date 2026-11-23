import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPixelLockedCameraContract,
  matchClosestGeminiAspectRatio,
  parseImageDimensionsFromBytes,
  parseImageDimensionsFromDataUrl,
} from "./image-aspect";

function makeFakePng(width: number, height: number): Uint8Array {
  const bytes = new Uint8Array(24);
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  bytes[16] = (width >>> 24) & 0xff;
  bytes[17] = (width >>> 16) & 0xff;
  bytes[18] = (width >>> 8) & 0xff;
  bytes[19] = width & 0xff;
  bytes[20] = (height >>> 24) & 0xff;
  bytes[21] = (height >>> 16) & 0xff;
  bytes[22] = (height >>> 8) & 0xff;
  bytes[23] = height & 0xff;
  return bytes;
}

function makeFakeJpeg(width: number, height: number): Uint8Array {
  return new Uint8Array([
    0xff, 0xd8, // SOI
    0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, // APP0 dummy
    0xff, 0xc0, 0x00, 0x0b, 0x08, // SOF0
    (height >> 8) & 0xff, height & 0xff,
    (width >> 8) & 0xff, width & 0xff,
    0x03, 0x01, 0x11, 0x00,
  ]);
}

test("parseImageDimensionsFromBytes parses PNG and JPEG headers accurately", () => {
  const pngDims = parseImageDimensionsFromBytes(makeFakePng(1200, 900));
  assert.deepEqual(pngDims, { width: 1200, height: 900 });

  const jpgDims = parseImageDimensionsFromBytes(makeFakeJpeg(1500, 1000));
  assert.deepEqual(jpgDims, { width: 1500, height: 1000 });
});

test("matchClosestGeminiAspectRatio snaps uploads to exact native Gemini ratios", () => {
  assert.equal(matchClosestGeminiAspectRatio(1200, 900), "4:3");
  assert.equal(matchClosestGeminiAspectRatio(1500, 1000), "3:2");
  assert.equal(matchClosestGeminiAspectRatio(1024, 1024), "1:1");
  assert.equal(matchClosestGeminiAspectRatio(1280, 1024), "5:4");
  assert.equal(matchClosestGeminiAspectRatio(1920, 1080), "16:9");
  assert.equal(matchClosestGeminiAspectRatio(1080, 1920), "9:16");
});

test("parseImageDimensionsFromDataUrl decodes base64 PNG data URL and builds pixel-lock contract", () => {
  const pngBytes = makeFakePng(1024, 768);
  const dataUrl = `data:image/png;base64,${Buffer.from(pngBytes).toString("base64")}`;
  const dims = parseImageDimensionsFromDataUrl(dataUrl);
  assert.ok(dims);
  assert.equal(dims.width, 1024);
  assert.equal(dims.height, 768);
  assert.equal(dims.geminiRatio, "4:3");
  assert.equal(dims.frameRatio, "4:3");

  const contract = buildPixelLockedCameraContract(dims, 92);
  assert.match(contract, /1024×768/);
  assert.match(contract, /aspect 4:3/);
  assert.match(contract, /pixel-for-pixel/i);
  assert.match(contract, /Do NOT zoom in or out/i);
});
