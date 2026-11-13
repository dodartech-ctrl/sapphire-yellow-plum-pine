import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyMaterialIdPixel,
  computeDepthScore,
  computeSobelAt,
  infernoRamp,
  matchSemanticSegmentPixel,
  rgbToLuminance,
} from "./cv-pipeline";

test("cv-pipeline pure operators", async (t) => {
  await t.test("computes perceptual luminance accurately", () => {
    assert.equal(Math.round(rgbToLuminance(255, 255, 255)), 255);
    assert.equal(rgbToLuminance(0, 0, 0), 0);
    assert.ok(rgbToLuminance(0, 255, 0) > rgbToLuminance(255, 0, 0));
  });

  await t.test("detects vertical architectural edges via Sobel", () => {
    // 3x3 step edge: left dark, right bright
    const lum = [10, 200, 200, 10, 200, 200, 10, 200, 200];
    const edge = computeSobelAt(lum, 3, 3, 1, 1);
    assert.ok(edge.gx > 500);
    assert.equal(edge.gy, 0);
    assert.ok(edge.mag > 500);
  });

  await t.test("computes bounded Depth-Anything-V2 score and Inferno ramp", () => {
    const far = computeDepthScore(230, 0.1, 0.1, 50);
    const near = computeDepthScore(40, 0.9, 0.5, 50);
    assert.ok(far >= 0 && far <= 1);
    assert.ok(near > far);

    const [r0, g0, b0] = infernoRamp(0);
    const [r1, g1, b1] = infernoRamp(1);
    assert.ok(r1 > r0 && g1 > g0 && b1 >= b0);
  });

  await t.test("matches SAM point prompts and Grounded-SAM semantic concepts", () => {
    const skyHit = matchSemanticSegmentPixel({
      r: 170,
      g: 205,
      b: 245,
      xNorm: 0.5,
      yNorm: 0.12,
      prompt: "sky",
      threshold: 45,
    });
    const skyMiss = matchSemanticSegmentPixel({
      r: 80,
      g: 75,
      b: 70,
      xNorm: 0.5,
      yNorm: 0.85,
      prompt: "sky",
      threshold: 45,
    });
    assert.equal(skyHit, true);
    assert.equal(skyMiss, false);

    const pointHit = matchSemanticSegmentPixel({
      r: 185,
      g: 140,
      b: 100,
      xNorm: 0.42,
      yNorm: 0.52,
      prompt: "",
      seedRgb: [180, 138, 96],
      seedPt: { xNorm: 0.4, yNorm: 0.5 },
      threshold: 45,
    });
    assert.equal(pointHit, true);
  });

  await t.test("classifies architectural Material ID flat classes deterministically", () => {
    assert.equal(classifyMaterialIdPixel(165, 200, 245, 0.5, 0.1).id, "sky");
    assert.equal(classifyMaterialIdPixel(45, 130, 52, 0.2, 0.6).id, "foliage");
    assert.equal(classifyMaterialIdPixel(188, 102, 58, 0.5, 0.5).id, "warm-clad");
    assert.equal(classifyMaterialIdPixel(132, 134, 136, 0.5, 0.85).id, "paving");
  });
});
