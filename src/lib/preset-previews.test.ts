import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  ARCHVIZ_PRESETS_100,
  INTENT_LOOKS_16,
  INTENT_LOOKS_40,
  INTENT_LOOKS_NEW_24,
  PRESETS_200,
  filterIntentLooks40,
} from "./presets-catalog.ts";
import {
  ALL_PRESET_PREVIEW_ASSETS,
  resolveArchviz100Preview,
  resolveLook16Preview,
  resolvePreset200Preview,
  resolveZukeVizPreview,
} from "./preset-previews.ts";
import {
  ZUKE_VIZ_CATEGORIES_14,
  ZUKE_VIZ_PROMPTS_119,
  fillZukePromptPlaceholders,
  filterZukeViz119,
} from "./zuke-viz-library.ts";

test("Every referenced preset preview image exists on disk under public/", () => {
  for (const webPath of ALL_PRESET_PREVIEW_ASSETS) {
    assert.ok(webPath.startsWith("/viz/"), `Expected /viz/ path, got ${webPath}`);
    const diskPath = join(process.cwd(), "public", webPath.slice(1));
    assert.ok(existsSync(diskPath), `Missing static image asset on disk: ${diskPath}`);
  }
});

test("All 200 refinements resolve to valid Before & After prompt-matched previews", () => {
  assert.equal(PRESETS_200.length, 200);
  for (const item of PRESETS_200) {
    const preview = resolvePreset200Preview(item);
    assert.ok(preview.beforeSrc.startsWith("/viz/"), `${item.id} beforeSrc missing`);
    assert.ok(preview.afterSrc.startsWith("/viz/"), `${item.id} afterSrc missing`);
    assert.ok(preview.beforeLabel.length > 0, `${item.id} beforeLabel empty`);
    assert.ok(preview.afterLabel.length > 0, `${item.id} afterLabel empty`);
  }
});

test("All 100 ArchViz presets resolve to valid Before & After prompt-matched previews", () => {
  assert.equal(ARCHVIZ_PRESETS_100.length, 100);
  for (const preset of ARCHVIZ_PRESETS_100) {
    const preview = resolveArchviz100Preview(preset);
    assert.ok(preview.beforeSrc.startsWith("/viz/"), `${preset.id} beforeSrc missing`);
    assert.ok(preview.afterSrc.startsWith("/viz/"), `${preset.id} afterSrc missing`);
    assert.ok(preview.afterLabel.includes("After"), `${preset.id} afterLabel should identify After`);
  }
});

test("All 40 Intent Looks (16 core + 24 new L17-L40) resolve to on-disk Before & After previews and governance rules", () => {
  assert.equal(INTENT_LOOKS_16.length, 16);
  assert.equal(INTENT_LOOKS_NEW_24.length, 24);
  assert.equal(INTENT_LOOKS_40.length, 40);

  for (const look of INTENT_LOOKS_40) {
    const preview = resolveLook16Preview(look);
    assert.ok(preview.beforeSrc.startsWith("/viz/"), `${look.code} beforeSrc missing`);
    assert.ok(preview.afterSrc.startsWith("/viz/"), `${look.code} afterSrc missing`);
    assert.ok(existsSync(join(process.cwd(), "public", preview.beforeSrc.slice(1))), `${look.code} before image missing on disk`);
    assert.ok(existsSync(join(process.cwd(), "public", preview.afterSrc.slice(1))), `${look.code} after image missing on disk`);
  }

  const l32 = INTENT_LOOKS_40.find((l) => l.code === "L32");
  const l33 = INTENT_LOOKS_40.find((l) => l.code === "L33");
  const l35 = INTENT_LOOKS_40.find((l) => l.code === "L35");
  assert.equal(l32?.rules, "Never beautify beyond what exists");
  assert.equal(l32?.disclosureRequired, true);
  assert.equal(l33?.rules, "Mark the picture as staged");
  assert.equal(l33?.disclosureRequired, true);
  assert.equal(l35?.rules, "Never beautify beyond what exists");
  assert.equal(l35?.disclosureRequired, true);
  assert.ok(filterIntentLooks40("twilight", "Strict").some((l) => l.code === "L17"));
});

test("All 119 ZUKE VIZ prompts (ZV-001..ZV-119) across 14 categories resolve to valid on-disk previews and support slots", () => {
  assert.equal(ZUKE_VIZ_PROMPTS_119.length, 119);
  assert.equal(ZUKE_VIZ_CATEGORIES_14.length, 15); // "All" + 14 categories

  const idSet = new Set(ZUKE_VIZ_PROMPTS_119.map((item) => item.id));
  for (let i = 1; i <= 119; i++) {
    const expectedId = `ZV-${String(i).padStart(3, "0")}`;
    assert.ok(idSet.has(expectedId), `Missing ZUKE prompt ${expectedId}`);
  }

  for (const item of ZUKE_VIZ_PROMPTS_119) {
    assert.ok(item.prompt.length >= 20, `${item.id} prompt too short`);
    const preview = resolveZukeVizPreview(item);
    assert.ok(existsSync(join(process.cwd(), "public", preview.beforeSrc.slice(1))), `${item.id} before asset missing`);
    assert.ok(existsSync(join(process.cwd(), "public", preview.afterSrc.slice(1))), `${item.id} after asset missing`);
  }

  // Portuguese originals preserved on ZV-067, ZV-081, ZV-082
  for (const ptId of ["ZV-067", "ZV-081", "ZV-082"]) {
    const entry = ZUKE_VIZ_PROMPTS_119.find((p) => p.id === ptId);
    assert.ok(entry?.originalPrompt && entry.originalPrompt.length > 20, `${ptId} missing Portuguese original`);
  }

  // Placeholder replacement works cleanly
  const zv001 = ZUKE_VIZ_PROMPTS_119.find((p) => p.id === "ZV-001")!;
  const filled = fillZukePromptPlaceholders(zv001.prompt, {
    "villa type": "courtyard limestone villa",
    "time of day": "golden hour",
  });
  assert.ok(filled.includes("courtyard limestone villa"));
  assert.ok(filled.includes("golden hour"));
  assert.ok(filled.includes("[facade materials]"));
  assert.ok(filterZukeViz119("blueprint", "Plans, Sections & Axonometric Views").length >= 2);
});
