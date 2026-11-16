import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_ENGINE, DEFAULT_SCENE3D } from "./engines";
import { DEFAULT_FRAME } from "./frame";
import { DEFAULT_DESIGN } from "./properties";
import {
  MARKET_AUTOPILOT_PACKS,
  MARKET_BENCHMARKS,
  MARKET_SUGGESTIONS,
  MARKET_SUGGESTION_CATEGORIES,
  applyMarketSuggestionBatch,
  applyMarketSuggestionPatch,
  createAutoBuildQueuePlan,
  filterMarketSuggestions,
  getMarketCategoryStats,
  mergePromptNonDestructively,
} from "./market-suggestions";

test("MARKET_SUGGESTIONS contains 160 unique items (between 100 and 200) across all 8 categories", () => {
  assert.ok(MARKET_SUGGESTIONS.length >= 100 && MARKET_SUGGESTIONS.length <= 200);
  assert.equal(MARKET_SUGGESTIONS.length, 160);

  const ids = new Set(MARKET_SUGGESTIONS.map((s) => s.id));
  const titles = new Set(MARKET_SUGGESTIONS.map((s) => s.title.toLowerCase()));
  assert.equal(ids.size, MARKET_SUGGESTIONS.length, "All suggestion IDs must be unique");
  assert.equal(titles.size, MARKET_SUGGESTIONS.length, "All suggestion titles must be unique");

  for (const cat of MARKET_SUGGESTION_CATEGORIES) {
    const count = MARKET_SUGGESTIONS.filter((s) => s.category === cat.id).length;
    assert.equal(count, 20, `Category ${cat.id} should have 20 suggestions`);
  }

  const benchmarksPresent = new Set(MARKET_SUGGESTIONS.map((s) => s.marketBenchmark));
  for (const bench of MARKET_BENCHMARKS) {
    assert.ok(benchmarksPresent.has(bench), `Expected benchmark ${bench} to be represented`);
  }
});

test("filterMarketSuggestions filters by query, category, benchmark, and approval status accurately", () => {
  const verasItems = filterMarketSuggestions(MARKET_SUGGESTIONS, { benchmark: "Veras" });
  assert.ok(verasItems.length > 5);
  assert.ok(verasItems.every((i) => i.marketBenchmark === "Veras"));

  const samMatches = filterMarketSuggestions(MARKET_SUGGESTIONS, { query: "sam-2" });
  assert.ok(samMatches.length >= 2);
  assert.ok(samMatches.some((i) => i.id === "mkt-124"));

  const statusApproved = filterMarketSuggestions(MARKET_SUGGESTIONS, {
    statusFilter: "approved",
    approvedIds: ["mkt-001"],
    appliedIds: ["mkt-021"],
  });
  assert.deepEqual(
    statusApproved.map((i) => i.id),
    ["mkt-001", "mkt-021"],
  );

  const statusPending = filterMarketSuggestions(MARKET_SUGGESTIONS, {
    statusFilter: "pending",
    approvedIds: ["mkt-001"],
    appliedIds: ["mkt-021"],
  });
  assert.equal(statusPending.length, 158);
});

test("applyMarketSuggestionPatch merges prompts non-destructively and preserves prior state", () => {
  const initial = {
    idea: "Warm Mediterranean courtyard with limestone plinth",
    design: DEFAULT_DESIGN,
    engine: DEFAULT_ENGINE,
    scene3d: DEFAULT_SCENE3D,
    frame: DEFAULT_FRAME,
  };

  const lockSuggestion = MARKET_SUGGESTIONS.find((s) => s.id === "mkt-001")!;
  const afterOne = applyMarketSuggestionPatch(initial, lockSuggestion);

  assert.ok(afterOne.idea.startsWith("Warm Mediterranean courtyard with limestone plinth"));
  assert.ok(afterOne.idea.includes(lockSuggestion.promptPatch));
  assert.equal(afterOne.engine.geometryLock, 95);
  assert.equal(afterOne.engine.seedLocked, true);

  // Applying same suggestion twice does not duplicate the prompt text
  const afterRepeat = applyMarketSuggestionPatch(afterOne, lockSuggestion);
  assert.equal(afterRepeat.idea, afterOne.idea);
});

test("mergePromptNonDestructively avoids duplicate snippet insertion", () => {
  const base = "Warm concrete atrium.";
  const added = mergePromptNonDestructively(base, "Clean 35mm shift lens");
  assert.equal(added, "Warm concrete atrium. Clean 35mm shift lens");
  assert.equal(mergePromptNonDestructively(added, "Clean 35mm shift lens"), added);
});

test("createAutoBuildQueuePlan & pack batch application produce deterministic queue specs", () => {
  const daylightPack = MARKET_AUTOPILOT_PACKS.find((p) => p.id === "pack-daylight-trio")!;
  const packItems = MARKET_SUGGESTIONS.filter((s) => daylightPack.suggestionIds.includes(s.id));
  assert.equal(packItems.length, 5);

  const batchResult = applyMarketSuggestionBatch(
    {
      idea: "Initial atrium massing",
      design: DEFAULT_DESIGN,
      engine: DEFAULT_ENGINE,
      scene3d: DEFAULT_SCENE3D,
      frame: DEFAULT_FRAME,
    },
    packItems,
  );
  assert.ok(batchResult.idea.includes("Initial atrium massing"));
  assert.equal(batchResult.scene3d.d5LightPreset, "blue-hour");

  const plan = createAutoBuildQueuePlan(packItems, {
    includeDaylightTrio: true,
    baseLook: "Pavilion",
    basePreset: "photoreal",
  });
  assert.equal(plan.autoApprovedCount, 5);
  assert.ok(plan.queueJobs.length >= 6);

  const stats = getMarketCategoryStats(MARKET_SUGGESTIONS, ["mkt-001"], ["mkt-021"]);
  assert.equal(stats[0].approved, 1);
  assert.equal(stats[1].applied, 1);
});
