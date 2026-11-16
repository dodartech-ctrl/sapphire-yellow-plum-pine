import assert from "node:assert/strict";
import test from "node:test";
import {
  INSPECTOR_PBR_SWATCHES,
  computeSolarRigState,
  createAssignmentFromSwatch,
  formatSolarTime,
  getMaterialAssignment,
  removeMaterialAssignment,
  updateMaterialAssignmentProps,
  upsertMaterialAssignment,
  type MeshMaterialAssignment,
} from "./solar-and-materials";

test("formatSolarTime renders HH:MM cleanly across 0-24h range", () => {
  assert.equal(formatSolarTime(0), "00:00");
  assert.equal(formatSolarTime(6.5), "06:30");
  assert.equal(formatSolarTime(14.75), "14:45");
  assert.equal(formatSolarTime(24), "00:00");
});

test("computeSolarRigState updates sunPosition vector across 0-24h diurnal cycle", () => {
  const morning = computeSolarRigState({ timeOfDay: 8, month: 6, latitude: 37.8 });
  const noon = computeSolarRigState({ timeOfDay: 12.5, month: 6, latitude: 37.8 });
  const evening = computeSolarRigState({ timeOfDay: 18.5, month: 6, latitude: 37.8 });
  const midnight = computeSolarRigState({ timeOfDay: 0, month: 6, latitude: 37.8 });

  assert.ok(morning.sunPosition.x > 0, "Morning sun should lie toward eastern +X hemisphere");
  assert.ok(evening.sunPosition.x < 0, "Evening sun should lie toward western -X hemisphere");
  assert.ok(noon.sunPosition.y > morning.sunPosition.y, "Noon sun height should exceed morning sun height");
  assert.ok(noon.sunPosition.y > evening.sunPosition.y, "Noon sun height should exceed evening sun height");
  assert.equal(noon.phase, "Solar Daylight");
  assert.equal(midnight.phase, "Midnight / Night");
  assert.equal(midnight.isDaylight, false);
  assert.ok(midnight.interiorGlowIntensity > noon.interiorGlowIntensity, "Interior lights should glow stronger at night");
  assert.ok(noon.sunIntensity > midnight.sunIntensity, "Daylight directional sun intensity should exceed midnight");
});

test("computeSolarRigState reflects seasonal Month 1-12 declination differences", () => {
  const summerNoon = computeSolarRigState({ timeOfDay: 12, month: 6, latitude: 40 });
  const winterNoon = computeSolarRigState({ timeOfDay: 12, month: 12, latitude: 40 });

  assert.ok(
    summerNoon.sunPosition.y > winterNoon.sunPosition.y,
    `Expected June noon Y (${summerNoon.sunPosition.y}) > Dec noon Y (${winterNoon.sunPosition.y})`,
  );
  assert.ok(summerNoon.rawElevationDeg > winterNoon.rawElevationDeg);
  assert.equal(summerNoon.monthLabel, "Jun");
  assert.equal(winterNoon.monthLabel, "Dec");
});

test("INSPECTOR_PBR_SWATCHES includes canonical Concrete, Oak, and Glass finishes", () => {
  const keys = INSPECTOR_PBR_SWATCHES.map((s) => s.shortKey);
  assert.ok(keys.includes("concrete"));
  assert.ok(keys.includes("oak"));
  assert.ok(keys.includes("glass"));
  const glass = INSPECTOR_PBR_SWATCHES.find((s) => s.shortKey === "glass")!;
  assert.equal(glass.transparent, true);
  assert.ok(glass.roughness < 0.15);
});

test("Material assignment CRUD handles Create, Read, Update, and Delete by objectId", () => {
  let assignments: MeshMaterialAssignment[] = [];

  // Create
  const oakEntry = createAssignmentFromSwatch("core-wall", "Core Wall", "fluted-oak", 100);
  assert.ok(oakEntry);
  assignments = upsertMaterialAssignment(assignments, oakEntry);
  assert.equal(assignments.length, 1);

  const glassEntry = createAssignmentFromSwatch("glazing-south", "South Glazing", "low-e-glass", 200);
  assert.ok(glassEntry);
  assignments = upsertMaterialAssignment(assignments, glassEntry);
  assert.equal(assignments.length, 2);

  // Read
  const foundWall = getMaterialAssignment(assignments, "core-wall");
  assert.equal(foundWall?.materialId, "fluted-oak");
  assert.equal(foundWall?.materialLabel, "Oak");

  // Update swatch & PBR roughness/metalness
  assignments = updateMaterialAssignmentProps(
    assignments,
    "core-wall",
    { roughness: 0.35, metalness: 0.25 },
    300,
  );
  const updatedWall = getMaterialAssignment(assignments, "core-wall");
  assert.equal(updatedWall?.roughness, 0.35);
  assert.equal(updatedWall?.metalness, 0.25);

  // Upsert replacement swatch on same objectId keeps unique entry
  const concreteEntry = createAssignmentFromSwatch("core-wall", "Core Wall", "board-formed-concrete", 400);
  assert.ok(concreteEntry);
  assignments = upsertMaterialAssignment(assignments, concreteEntry);
  assert.equal(assignments.length, 2);
  assert.equal(getMaterialAssignment(assignments, "core-wall")?.materialId, "board-formed-concrete");

  // Delete
  assignments = removeMaterialAssignment(assignments, "core-wall");
  assert.equal(assignments.length, 1);
  assert.equal(getMaterialAssignment(assignments, "core-wall"), null);
  assert.equal(getMaterialAssignment(assignments, "glazing-south")?.materialId, "low-e-glass");
});
