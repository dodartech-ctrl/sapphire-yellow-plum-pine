import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_ENGINE, DEFAULT_SCENE3D } from "./engines.ts";
import { DEFAULT_DESIGN } from "./properties.ts";
import {
  hashPromptSeed,
  inferAtmosphereProfile,
  pickFourFallbackPlates,
  pickServerFallbackPlate,
} from "./fallback-render.ts";

test("hashPromptSeed is deterministic and sensitive to prompt wording", () => {
  const a = hashPromptSeed("Minimalist timber villa at sunset");
  const b = hashPromptSeed("  minimalist timber villa at sunset  ");
  const c = hashPromptSeed("Brutalist concrete courtyard in snow");
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test("inferAtmosphereProfile adapts lighting mood and filters to prompt and design settings", () => {
  const golden = inferAtmosphereProfile({
    design: { ...DEFAULT_DESIGN, light: "Golden hour" },
    scene3d: DEFAULT_SCENE3D,
    idea: "Warm cedar cantilever pavilion",
  });
  assert.equal(golden.lightingMood, "golden");
  assert.match(golden.filterCss, /sepia/);

  const dusk = inferAtmosphereProfile({
    design: { ...DEFAULT_DESIGN, light: "Daylight" },
    scene3d: DEFAULT_SCENE3D,
    idea: "Reflective courtyard pool at twilight blue hour",
  });
  assert.equal(dusk.lightingMood, "dusk");
  assert.ok(dusk.glowColor);

  const snow = inferAtmosphereProfile({
    design: { ...DEFAULT_DESIGN, light: "Daylight" },
    scene3d: DEFAULT_SCENE3D,
    idea: "Nordic concrete gallery in winter snow",
  });
  assert.equal(snow.lightingMood, "snow");

  const night = inferAtmosphereProfile({
    design: { ...DEFAULT_DESIGN, light: "Night" },
    scene3d: DEFAULT_SCENE3D,
    idea: "Glass pavilion",
  });
  assert.equal(night.lightingMood, "night");
});

test("pickServerFallbackPlate and pickFourFallbackPlates respond to vertical, light, and prompt", () => {
  const duskPlate = pickServerFallbackPlate(
    { ...DEFAULT_DESIGN, vertical: "exterior", light: "Evening" },
    DEFAULT_ENGINE,
    482910,
    0,
    "Evening courtyard pool",
  );
  assert.ok(duskPlate.includes("dusk"));

  const dayPlate = pickServerFallbackPlate(
    { ...DEFAULT_DESIGN, vertical: "exterior", light: "Daylight" },
    DEFAULT_ENGINE,
    482910,
    0,
    "Bright daylight concrete pavilion",
  );
  assert.ok(dayPlate.includes("day") || dayPlate.includes("library"));

  const four = pickFourFallbackPlates(DEFAULT_DESIGN, DEFAULT_ENGINE, 482910, "Timber courtyard");
  assert.equal(four.length, 4);
  assert.equal(new Set(four).size, 4);
});
