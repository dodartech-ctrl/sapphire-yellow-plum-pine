import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_ENGINE,
  DEFAULT_SCENE3D,
  compileEngineBrief,
  computeSunPosition,
  createQueueItem,
  focalLengthToFov,
  sanitizeEngineState,
  sanitizeScene3DState,
  updateQueueListStatus,
} from "./engines.ts";
import type { DesignState } from "./properties.ts";

const TEST_DESIGN: DesignState = {
  vertical: "interior",
  range: "Ultra Luxury",
  look: "Modern luxury",
  camera: "Eye level",
  light: "Golden hour",
  mood: "Warm",
  people: "Few",
  activity: "Sitting",
  color: "Warm white",
  weather: "Clear",
  time: "Golden hour",
  detail: "High detail",
  strength: "Balanced",
  tags: ["Luxury"],
  target: "whole",
  panel: "design",
  picks: { room: "Living room" },
  rooms: {},
  advanced: { light: "soft", air: "clear", season: "summer", change: "restyle", grade: "natural", extras: [] },
};

describe("engines pure logic", () => {
  it("clamps and sanitizes engine parameters safely", () => {
    const clean = sanitizeEngineState({
      geometryLock: 180,
      mjStylize: -50,
      seed: 0,
      workflowPreset: "invalid" as never,
    });
    assert.equal(clean.geometryLock, 100);
    assert.equal(clean.mjStylize, 0);
    assert.equal(clean.seed, 1);
    assert.equal(clean.workflowPreset, DEFAULT_ENGINE.workflowPreset);
  });

  it("clamps and validates 3D scene settings and D5 transforms", () => {
    const clean = sanitizeScene3DState({
      sunAzimuth: 500,
      sunElevation: 1,
      focalLength: 999 as never,
      modelRotationY: 420,
      modelScale: 3.5,
      exposure: 0.1,
    });
    assert.equal(clean.sunAzimuth, 360);
    assert.equal(clean.sunElevation, 4);
    assert.equal(clean.focalLength, 35);
    assert.equal(clean.modelRotationY, 180);
    assert.equal(clean.modelScale, 1.5);
    assert.equal(clean.exposure, 0.6);
  });

  it("computes sun coordinates and warm dusk vs daylight color shift", () => {
    const dusk = computeSunPosition(240, 8, 20);
    const noon = computeSunPosition(180, 65, 20);
    assert.ok(dusk.y < noon.y);
    assert.equal(dusk.skyHex, "#23364f");
    assert.equal(noon.skyHex, "#dde6ef");
    assert.ok(noon.sunIntensity > dusk.sunIntensity);
  });

  it("computes architectural lens vertical FOV accurately", () => {
    const wide24 = focalLengthToFov(24);
    const detail85 = focalLengthToFov(85);
    assert.ok(wide24 > 50 && wide24 < 56);
    assert.ok(detail85 > 15 && detail85 < 17);
  });

  it("compiles unified architectural brief with Annotator, Depth, IP-Adapter, sketch, mask, and seed lock", () => {
    const result = compileEngineBrief(
      { ...TEST_DESIGN, vertical: "exterior" },
      {
        ...DEFAULT_ENGINE,
        geometryLock: 92,
        edgeAdherence: 88,
        mjStylize: 320,
        mjChaos: 20,
        seed: 1000,
        seedLocked: true,
        annotatorMode: "canny",
        ipAdapterEnabled: true,
        ipAdapterPreset: "plus",
        ipAdapterWeight: 75,
      },
      { ...DEFAULT_SCENE3D, preset: "villa", focalLength: 24, primaryMaterial: "travertine", modelRotationY: 25, modelScale: 1.2 },
      "Replace terrace coping with honed stone",
      { hasSketch: true, hasMask: true, inpaintNote: "honed basalt canopy", variationIndex: 2, frame: { ratio: "16:9", resolution: "2k" } },
    );
    assert.match(result.prompt, /STRICT GEOMETRY LOCK \(92%\)/);
    assert.match(result.prompt, /SKETCH CONDITIONING \(PromeAI faithful, Edge Adherence 88%\)/);
    assert.match(result.prompt, /IOPAINT OBJECT ERASE \(LaMa \(Fourier\).*honed basalt canopy/);
    assert.match(result.prompt, /EXTERIOR FACADE \(LookX\)/);
    assert.match(result.prompt, /3D ENVIRONMENT \(D5 Rig\): villa massing in travertine, rot 25° scale 1\.2x, 24mm lens/);
    assert.match(result.prompt, /CONTROLNET ANNOTATOR \(lllyasviel\): CANNY threshold 58% \+ Depth-Anything-V2/);
    assert.match(result.prompt, /IP-ADAPTER PLUS \(plus\): weight 75%/);
    assert.match(result.prompt, /--ar 16:9 --s 320 --c 20 --seed 1274/);
    assert.equal(result.seed, 1274);
  });

  it("transitions batch render queue items cleanly", () => {
    const item = createQueueItem("Twilight Pass", "photoreal", "Evening");
    const list = [item];
    const running = updateQueueListStatus(list, item.id, "running");
    assert.equal(running[0]?.status, "running");
    const done = updateQueueListStatus(running, item.id, "done", "/viz/p01-pavilion-dusk.jpg");
    assert.equal(done[0]?.status, "done");
    assert.equal(done[0]?.url, "/viz/p01-pavilion-dusk.jpg");
  });
});
