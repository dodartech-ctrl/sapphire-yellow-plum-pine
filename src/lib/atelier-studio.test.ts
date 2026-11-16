import assert from "node:assert/strict";
import test from "node:test";
import {
  ATELIER_DEFAULT_STUDIES,
  ATELIER_REFINEMENT_CHIPS,
  ATELIER_VERTICAL_HERO,
  ATMOSPHERIC_REGIMES,
  buildAtelierIterationCards,
} from "./atelier-studio";

test("ATELIER_DEFAULT_STUDIES provides 4 verified local architectural plate presets", () => {
  assert.equal(ATELIER_DEFAULT_STUDIES.length, 4);
  for (const item of ATELIER_DEFAULT_STUDIES) {
    assert.ok(item.url.startsWith("/viz/"));
    assert.ok(item.title.length > 0);
  }
});

test("buildAtelierIterationCards places generated history plates first and backfills to 4 cards", () => {
  const empty = buildAtelierIterationCards([], null);
  assert.equal(empty.length, 4);
  assert.equal(empty[0].isGenerated, false);

  const partial = buildAtelierIterationCards(["/custom/a.png", "/custom/b.png"], "/custom/a.png");
  assert.equal(partial.length, 4);
  assert.equal(partial[0].isGenerated, true);
  assert.equal(partial[0].subtitle, "Selected");
  assert.equal(partial[1].isGenerated, true);
  assert.equal(partial[1].subtitle, "Click to restore");
  assert.equal(partial[2].isGenerated, false);
});

test("ATMOSPHERIC_REGIMES and refinement presets expose valid lighting and vertical hero paths", () => {
  assert.equal(ATMOSPHERIC_REGIMES.length, 3);
  assert.ok(ATELIER_REFINEMENT_CHIPS.length >= 4);
  assert.ok(ATELIER_VERTICAL_HERO.landscape.src.startsWith("/viz/"));
  assert.ok(ATELIER_VERTICAL_HERO.interior.src.startsWith("/viz/"));
});
