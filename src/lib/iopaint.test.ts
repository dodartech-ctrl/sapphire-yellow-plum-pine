import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDirectionalOutpaintBounds,
  dilateBinaryMask,
  heuristicSemanticBoxesForPrompt,
  invertBinaryMask,
  normalizeGroundedBoxes,
} from "./cv-pipeline";
import {
  DEFAULT_ENGINE,
  DEFAULT_SCENE3D,
  buildIopaintDirective,
  compileEngineBrief,
  sanitizeEngineState,
} from "./engines";
import { DEFAULT_DESIGN } from "./properties";

test("dilateBinaryMask expands mask region accurately and preserves bounds", () => {
  const mask = new Uint8Array(25);
  mask[2 * 5 + 2] = 1; // center pixel (2,2) in 5x5 grid

  const identity = dilateBinaryMask(mask, 5, 5, 0);
  assert.equal(identity.reduce((a, b) => a + b, 0), 1);

  const dilated1 = dilateBinaryMask(mask, 5, 5, 1);
  assert.equal(dilated1.reduce((a, b) => a + b, 0), 9); // 3x3 square
  assert.equal(dilated1[0], 0);
  assert.equal(dilated1[1 * 5 + 1], 1);
  assert.equal(dilated1[3 * 5 + 3], 1);

  const inverted = invertBinaryMask(dilated1);
  assert.equal(inverted.reduce((a, b) => a + b, 0), 16);
  assert.equal(inverted[2 * 5 + 2], 0);
  assert.equal(inverted[0], 1);
});

test("buildDirectionalOutpaintBounds clamps border padding and computes padded canvas bounds", () => {
  const bounds = buildDirectionalOutpaintBounds(1280, 720, {
    top: -10,
    right: 500,
    bottom: 64,
    left: 128,
  });
  assert.equal(bounds.top, 0);
  assert.equal(bounds.right, 320);
  assert.equal(bounds.bottom, 64);
  assert.equal(bounds.left, 128);
  assert.equal(bounds.targetW, 1280 + 128 + 320);
  assert.equal(bounds.targetH, 720 + 0 + 64);
  assert.equal(bounds.dx, 128);
  assert.equal(bounds.dy, 0);
});

test("sanitizeEngineState validates and clamps IOPaint models, pads, and flags", () => {
  const clean = sanitizeEngineState({
    iopaintTask: "anytext",
    iopaintModel: "zits",
    iopaintMaskDilate: 40,
    iopaintInvertMask: true,
    iopaintOutpaintPad: { top: 999, right: -5, bottom: 48, left: 64 },
    iopaintRemoveBgModel: "birefnet",
    iopaintFaceModel: "restoreformer",
  });
  assert.equal(clean.iopaintTask, "anytext");
  assert.equal(clean.iopaintModel, "zits");
  assert.equal(clean.iopaintMaskDilate, 24);
  assert.equal(clean.iopaintInvertMask, true);
  assert.deepEqual(clean.iopaintOutpaintPad, { top: 320, right: 0, bottom: 48, left: 64 });
  assert.equal(clean.iopaintRemoveBgModel, "birefnet");
  assert.equal(clean.iopaintFaceModel, "restoreformer");

  const fallback = sanitizeEngineState({
    // @ts-expect-error testing invalid enum fallback
    iopaintTask: "unknown-task",
    // @ts-expect-error testing invalid model fallback
    iopaintModel: "invalid-model",
  });
  assert.equal(fallback.iopaintTask, DEFAULT_ENGINE.iopaintTask);
  assert.equal(fallback.iopaintModel, DEFAULT_ENGINE.iopaintModel);
});

test("buildIopaintDirective & compileEngineBrief adapt prompt per IOPaint task mode", () => {
  const eraseEngine = sanitizeEngineState({ iopaintTask: "erase", iopaintModel: "lama", iopaintMaskDilate: 6 });
  const eraseBrief = compileEngineBrief(DEFAULT_DESIGN, eraseEngine, DEFAULT_SCENE3D, "Remove parked cars", {
    hasMask: true,
  });
  assert.match(eraseBrief.prompt, /IOPAINT OBJECT ERASE \(LaMa \(Fourier\)/);
  assert.match(eraseBrief.prompt, /mask expand \+6px/);

  const anytextEngine = sanitizeEngineState({
    iopaintTask: "anytext",
    iopaintModel: "anytext",
    iopaintAnyText: "NORDIC PAVILION",
  });
  assert.match(buildIopaintDirective(anytextEngine), /NORDIC PAVILION/);

  const exampleEngine = sanitizeEngineState({
    iopaintTask: "paint-by-example",
    iopaintModel: "paint-by-example",
  });
  assert.match(buildIopaintDirective(exampleEngine, "place oak chair"), /IOPAINT PAINT-BY-EXAMPLE/);
});

test("normalizeGroundedBoxes clamps coordinates 0..1000 and filters degenerate boxes", () => {
  const boxes = normalizeGroundedBoxes(
    [
      { label: "Glazing Bay", box_2d: [-50, 120, 640, 1200], confidence: 1.4 },
      { label: "Invalid Box", box_2d: [400, 400, 390, 600], confidence: 0.9 },
      { label: "Too Thin", box_2d: [100, 100, 104, 300], confidence: 0.8 },
    ],
    "fallback",
  );
  assert.equal(boxes.length, 1);
  assert.deepEqual(boxes[0].box_2d, [0, 120, 640, 1000]);
  assert.equal(boxes[0].confidence, 1);
  assert.equal(boxes[0].label, "Glazing Bay");
});

test("heuristicSemanticBoxesForPrompt returns architectural bounding box priors per object category", () => {
  const skyBoxes = heuristicSemanticBoxesForPrompt("sky dome");
  assert.equal(skyBoxes[0].label, "Sky Dome");
  assert.ok(skyBoxes[0].box_2d[2] <= 400);

  const sofaBoxes = heuristicSemanticBoxesForPrompt("sofa and furniture");
  assert.equal(sofaBoxes.length, 2);
  assert.ok(sofaBoxes[0].box_2d[0] >= 400);

  const glazingBoxes = heuristicSemanticBoxesForPrompt("windows and glazing");
  assert.equal(glazingBoxes.length, 2);
  assert.equal(glazingBoxes[0].label, "Glazing Bay");
});

