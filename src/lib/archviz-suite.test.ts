import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FLYTHROUGH_DURATION_MS,
  buildBatchMatrixSpecs,
  buildDesignPackDocumentHtml,
  buildHouseStyleProfile,
  buildMaterialScheduleRows,
  buildOrbitDollyZoomRig,
  computeBatchProgress,
  computeOutpaintGeometry,
  computeSolarPositionFromGeo,
  decodeReviewPinsParam,
  detectFloorPlanWallsFromGrid,
  encodeReviewPinsParam,
  getQueueStats,
  interpolateCameraKeyframes,
  interpolateCameraPathCatmullRom,
  sampleCameraPathPoints,
  upsertRoleKeyframe,
  type CameraKeyframe,
  type ReviewPin,
} from "./archviz-suite.ts";
import {
  DEFAULT_ENGINE,
  DEFAULT_SCENE3D,
  createQueueItem,
  normalizeQueueStatus,
  queueStatusLabel,
  updateQueueListStatus,
} from "./engines.ts";
import type { DesignState } from "./properties.ts";

const TEST_DESIGN: DesignState = {
  vertical: "exterior",
  range: "Ultra Luxury",
  look: "Modern",
  camera: "Eye level",
  light: "Golden hour",
  mood: "Warm",
  people: "Few",
  activity: "Walking",
  color: "Warm white",
  weather: "Clear",
  time: "Golden hour",
  detail: "High detail",
  strength: "Balanced",
  tags: ["Luxury", "Villa"],
  target: "whole",
  panel: "engine",
  picks: { facade: "Concrete", windows: "Floor-to-ceiling", terrace: "Pergola" },
  rooms: {},
  advanced: { light: "soft", air: "clear", season: "summer", change: "restyle", grade: "natural", extras: [] },
};

describe("archviz-suite pure logic", () => {
  it("computes geolocation solar azimuth, elevation, and golden/daylight/twilight phase", () => {
    const morning = computeSolarPositionFromGeo(37.8, 6, 8);
    const zenith = computeSolarPositionFromGeo(37.8, 6, 12.5);
    const twilight = computeSolarPositionFromGeo(37.8, 12, 17.5);

    assert.ok(morning.azimuthDeg < 180, "morning sun should be easterly");
    assert.ok(zenith.elevationDeg > morning.elevationDeg, "midday elevation should exceed 8am");
    assert.equal(zenith.phase, "Solar Daylight");
    assert.equal(twilight.phase, "Twilight / Blue Hour");
    assert.ok(twilight.azimuthDeg > 180, "afternoon/evening sun should be westerly");
  });

  it("detects horizontal and vertical floor plan walls from binary grid and falls back on sparse grids", () => {
    const cols = 8;
    const rows = 8;
    const grid = new Uint8Array(cols * rows);
    // Horizontal top & bottom walls + vertical west wall
    for (let c = 1; c <= 6; c++) {
      grid[1 * cols + c] = 1;
      grid[6 * cols + c] = 1;
    }
    for (let r = 1; r <= 6; r++) {
      grid[r * cols + 1] = 1;
    }

    const blueprint = detectFloorPlanWallsFromGrid(grid, cols, rows);
    assert.ok(blueprint.walls.length >= 3);
    assert.ok(blueprint.walls.some((w) => w.id.startsWith("wh-1")));
    assert.ok(blueprint.walls.some((w) => w.id.startsWith("wv-1")));
    assert.ok(blueprint.roomCount >= 2);

    const sparse = detectFloorPlanWallsFromGrid(new Uint8Array(cols * rows), cols, rows);
    assert.equal(sparse.walls.length, 5);
    assert.ok(sparse.walls.some((w) => w.hasDoorGap));
  });

  it("builds a Firm Signature House Style profile with prompt directive and defaults", () => {
    const profile = buildHouseStyleProfile({
      name: "  Atelier Nordic  ",
      sampleImages: ["/viz/p01-pavilion-dusk.jpg", "/viz/t01-public-library.jpg"],
      palette: ["#e5dfd4", "#9a8f7e", "#2d2a26"],
      contrastBias: "Monograph Neutral",
    });
    assert.equal(profile.name, "Atelier Nordic");
    assert.equal(profile.sampleCount, 2);
    assert.equal(profile.contrastBias, "Monograph Neutral");
    assert.match(profile.promptDirective, /Atelier Nordic/);
    assert.match(profile.promptDirective, /2 refs/);
    assert.equal(profile.previewImage, "/viz/p01-pavilion-dusk.jpg");
  });

  it("computes outpaint canvas bounds for 21:9, 9:16, and 16:9 aspect targets", () => {
    const cinema = computeOutpaintGeometry(1200, 900, "21:9");
    assert.ok(cinema.targetW > cinema.targetH);
    assert.ok(cinema.drawX > 0 && cinema.drawY > 0);
    assert.ok(cinema.drawW < cinema.targetW);

    const portrait = computeOutpaintGeometry(1200, 900, "9:16");
    assert.ok(portrait.targetH > portrait.targetW);

    const wide = computeOutpaintGeometry(900, 900, "16:9");
    assert.ok(wide.targetW > wide.targetH);
  });

  it("builds 4-item sun-study and 3-item camera-matrix batch job specs", () => {
    const sun = buildBatchMatrixSpecs({ mode: "sun-study", preset: "photoreal", look: "Villa" });
    assert.equal(sun.length, 4);
    assert.deepEqual(
      sun.map((s) => s.sunHour),
      [8, 12.5, 17.5, 20.25],
    );

    const cam = buildBatchMatrixSpecs({ mode: "camera-matrix", preset: "clay-to-render", look: "Pavilion" });
    assert.equal(cam.length, 3);
    assert.deepEqual(
      cam.map((c) => c.cameraPreset),
      ["eye", "oblique", "aerial"],
    );
  });

  it("interpolates camera keyframes cleanly across t=0, t=0.5, t=1, single, and empty edge cases", () => {
    assert.equal(interpolateCameraKeyframes([], 0.5), null);

    const single: CameraKeyframe[] = [
      { id: "k1", label: "Start", pos: [10, 4, 10], target: [0, 2, 0], focalLength: 35 },
    ];
    assert.deepEqual(interpolateCameraKeyframes(single, 0.4), single[0]);

    const pair: CameraKeyframe[] = [
      { id: "k1", label: "Start", pos: [0, 2, 10], target: [0, 0, 0], focalLength: 24 },
      { id: "k2", label: "End", pos: [20, 6, 30], target: [4, 2, 0], focalLength: 50 },
    ];
    const start = interpolateCameraKeyframes(pair, 0);
    const mid = interpolateCameraKeyframes(pair, 0.5);
    const end = interpolateCameraKeyframes(pair, 1);

    assert.deepEqual(start?.pos, [0, 2, 10]);
    assert.deepEqual(mid?.pos, [10, 4, 20]);
    assert.equal(mid?.focalLength, 37);
    assert.deepEqual(end?.pos, [20, 6, 30]);
    assert.equal(end?.focalLength, 50);
  });

  it("round-trips encoded review pins and guards against malformed payloads", () => {
    const pins: ReviewPin[] = [
      {
        id: "pin-1",
        projectId: "proj-1",
        number: 1,
        xNorm: 0.425,
        yNorm: 0.612,
        author: "Lead Architect",
        note: "Change cladding to fluted cedar & brighten cove light",
        status: "open",
        createdAt: 1730000000000,
      },
      {
        id: "pin-2",
        projectId: "proj-1",
        number: 2,
        xNorm: 0.8,
        yNorm: 0.25,
        author: "Client",
        note: "Approved mullion spacing",
        status: "resolved",
        createdAt: 1730000001000,
      },
    ];
    const encoded = encodeReviewPinsParam(pins);
    assert.ok(encoded.length > 10);

    const decoded = decodeReviewPinsParam(encoded);
    assert.equal(decoded.length, 2);
    assert.equal(decoded[0]?.note, pins[0]?.note);
    assert.equal(decoded[1]?.status, "resolved");
    assert.ok(Math.abs((decoded[0]?.xNorm ?? 0) - 0.425) < 0.002);

    assert.deepEqual(decodeReviewPinsParam(""), []);
    assert.deepEqual(decodeReviewPinsParam("!!!not-base64!!!"), []);
  });

  it("builds BIM material schedule rows and complete HTML Design Pack", () => {
    const schedule = buildMaterialScheduleRows(
      TEST_DESIGN,
      { ...DEFAULT_ENGINE, facadeTypology: "Biophilic Timber Louver" },
      { ...DEFAULT_SCENE3D, primaryMaterial: "timber", focalLength: 24 },
    );
    assert.equal(schedule.length, 4);
    assert.equal(schedule[0]?.code, "MAT-01");
    assert.match(schedule[0]?.specification ?? "", /Biophilic Timber Louver/);
    assert.equal(schedule[0]?.finishHex, "#b68557");

    const html = buildDesignPackDocumentHtml({
      title: "Nordic Timber Pavilion",
      prompt: "Board-marked concrete plinth with warm cedar louvers",
      schedule,
      design: TEST_DESIGN,
      engine: DEFAULT_ENGINE,
      scene3d: { ...DEFAULT_SCENE3D, focalLength: 24 },
    });
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /Nordic Timber Pavilion/);
    assert.match(html, /MAT-01/);
    assert.match(html, /Board-marked concrete plinth/);
  });

  it("computes queue stats and normalizes FIFO status transitions accurately", () => {
    const q1 = createQueueItem("08:00 Morning", "photoreal", "Daylight");
    const q2 = createQueueItem("17:30 Golden", "photoreal", "Golden hour");
    const q3 = createQueueItem("20:15 Blue", "photoreal", "Evening");

    assert.equal(normalizeQueueStatus("queued"), "pending");
    assert.equal(normalizeQueueStatus("running"), "processing");
    assert.equal(normalizeQueueStatus("done"), "completed");
    assert.equal(queueStatusLabel("pending"), "Pending");
    assert.equal(queueStatusLabel("processing"), "Processing");
    assert.equal(queueStatusLabel("completed"), "Completed");
    assert.equal(queueStatusLabel("error"), "Failed");

    let queue = [q1, q2, q3];
    assert.deepEqual(getQueueStats(queue), { total: 3, pending: 3, processing: 0, completed: 0, failed: 0 });

    queue = updateQueueListStatus(queue, q1.id, "processing");
    assert.deepEqual(getQueueStats(queue), { total: 3, pending: 2, processing: 1, completed: 0, failed: 0 });

    queue = updateQueueListStatus(queue, q1.id, "completed", "/viz/p01-pavilion-dusk.jpg");
    queue = updateQueueListStatus(queue, q2.id, "error", undefined, { errorMessage: "Timeout" });
    assert.deepEqual(getQueueStats(queue), { total: 3, pending: 1, processing: 0, completed: 1, failed: 1 });
    assert.equal(queue[0]?.url, "/viz/p01-pavilion-dusk.jpg");
    assert.equal(queue[1]?.errorMessage, "Timeout");

    const progress = computeBatchProgress(queue);
    assert.equal(progress.progressPct, 67);
    assert.equal(progress.nextPendingId, q3.id);
    assert.equal(progress.activeProcessingId, null);
    assert.equal(progress.isComplete, false);
  });

  it("stages 3 Orbit/Dolly/Zoom camera positions and evaluates smooth 4-second Catmull-Rom spline", () => {
    assert.equal(FLYTHROUGH_DURATION_MS, 4000);

    const rig = buildOrbitDollyZoomRig([14, 7, 14], [0, 2, 0], 35);
    assert.equal(rig.length, 3);
    assert.deepEqual(
      rig.map((k) => k.role),
      ["orbit", "dolly", "zoom"],
    );
    assert.ok(rig[0]!.focalLength < rig[2]!.focalLength, "zoom pose must increase focal length over orbit pose");

    const start = interpolateCameraPathCatmullRom(rig, 0);
    const mid = interpolateCameraPathCatmullRom(rig, 0.5);
    const end = interpolateCameraPathCatmullRom(rig, 1);

    assert.ok(start && mid && end);
    assert.deepEqual(start.pos, rig[0]!.pos);
    assert.ok(Math.abs(mid.pos[0] - rig[1]!.pos[0]) < 0.01);
    assert.ok(Math.abs(mid.pos[2] - rig[1]!.pos[2]) < 0.01);
    assert.deepEqual(end.pos, rig[2]!.pos);
    assert.equal(end.focalLength, rig[2]!.focalLength);

    const sampled = sampleCameraPathPoints(rig, 24);
    assert.equal(sampled.length, 25);

    const replacedDolly = upsertRoleKeyframe(rig, {
      id: "kf-custom-dolly",
      label: "2. Dolly (Custom)",
      role: "dolly",
      pos: [5, 3, 6],
      target: [0, 2, 0],
      focalLength: 38,
    });
    assert.equal(replacedDolly.length, 3);
    assert.deepEqual(
      replacedDolly.map((k) => k.role),
      ["orbit", "dolly", "zoom"],
    );
    assert.equal(replacedDolly[1]?.id, "kf-custom-dolly");
  });
});
