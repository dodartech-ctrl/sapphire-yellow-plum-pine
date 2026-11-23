import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEFAULT_TOUR_STATE } from "@/lib/prd-studio-data";
import {
  PROCEDURAL_GLB_CATALOG,
  buildStandalone360TourHtml,
  lutToCanvasFilter,
  resolveKumVideoDimensions,
} from "@/lib/studio-exports";

describe("studio-exports utilities", () => {
  it("exposes a curated catalog of architectural procedural GLB assets", () => {
    assert.ok(PROCEDURAL_GLB_CATALOG.length >= 6);
    for (const item of PROCEDURAL_GLB_CATALOG) {
      assert.ok(item.id.length > 0);
      assert.ok(item.name.length > 2);
      assert.ok(item.trianglesApprox > 100);
      assert.ok(item.previewImage.startsWith("/viz/"));
    }
  });

  it("maps KUM Video aspect ratios to exact even pixel dimensions", () => {
    assert.deepEqual(resolveKumVideoDimensions("16:9"), { width: 960, height: 540 });
    assert.deepEqual(resolveKumVideoDimensions("9:16"), { width: 540, height: 960 });
    assert.deepEqual(resolveKumVideoDimensions("1:1"), { width: 720, height: 720 });
    assert.deepEqual(resolveKumVideoDimensions("4:5"), { width: 640, height: 800 });
  });

  it("maps KUM Video LUT presets to valid CSS canvas filter strings", () => {
    assert.equal(lutToCanvasFilter("Neutral"), "none");
    assert.match(lutToCanvasFilter("Filmic Warm"), /sepia/);
    assert.match(lutToCanvasFilter("Twilight Gold"), /brightness/);
    assert.match(lutToCanvasFilter("Arctic Glass"), /contrast/);
  });

  it("builds a self-contained escaped standalone 360 HTML tour package", () => {
    const html = buildStandalone360TourHtml(
      DEFAULT_TOUR_STATE,
      "/viz/p01-pavilion-dusk.jpg",
      "Atelier <Nordic> & Co",
    );
    assert.match(html, /^<!DOCTYPE html>/);
    assert.match(html, /Atelier &lt;Nordic&gt; &amp; Co/);
    assert.match(html, /Drag to Look 360°/);
    assert.match(html, /const TOUR =/);
    assert.ok(html.includes(DEFAULT_TOUR_STATE.slug));
  });
});
