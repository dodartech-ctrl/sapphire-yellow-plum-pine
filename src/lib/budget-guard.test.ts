import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BUDGET_WARNING_THRESHOLD_PCT,
  DEFAULT_BUDGET_CAP_PAISE,
  DEFAULT_BUDGET_STATE,
  PAISE_ECO_MAX_PER_IMAGE,
  buildRecentDailySpendSeries,
  didCrossBudgetWarningThreshold,
  estimatePerImageCostPaise,
  estimateRemainingImages,
  formatInrExact,
  formatPaiseShort,
  getBudgetWarningStatus,
  recordDailySpendEntry,
  resolveBudgetRenderPlan,
  sanitizeBudgetState,
} from "./budget-guard";

describe("INR ₹100 Budget Cap & Paise-Only Cost Guard", () => {
  it("defaults to ₹100.00 INR cap (10,000 paise) in Paise Eco mode", () => {
    assert.equal(DEFAULT_BUDGET_CAP_PAISE, 10_000);
    assert.equal(DEFAULT_BUDGET_STATE.costMode, "paise-eco");
    assert.equal(DEFAULT_BUDGET_STATE.maxPerImagePaise, PAISE_ECO_MAX_PER_IMAGE);
    assert.equal(formatInrExact(DEFAULT_BUDGET_CAP_PAISE), "₹100.00");
  });

  it("keeps Gemini Nano Banana 2.1 1K strictly under ₹1 (paise only)", () => {
    const plan = resolveBudgetRenderPlan({
      requestedModel: "gemini-nano-banana-2.1",
      requestedResolution: "1K",
      imageCount: 1,
      budget: DEFAULT_BUDGET_STATE,
    });
    assert.equal(plan.useCloud, true);
    assert.equal(plan.blockedByCap, false);
    assert.equal(plan.effectiveModel, "gemini-nano-banana-2.1");
    assert.equal(plan.effectiveResolution, "1K");
    assert.ok(plan.perImagePaise > 0 && plan.perImagePaise <= 99, `Expected paise-only cost, got ${plan.perImagePaise}p`);
    assert.equal(plan.perImagePaise, 85);
    assert.equal(plan.timeoutMs, 22_000);
    assert.equal(plan.allowThirdPartyFallbacks, false);
    // ₹100 / 85p = 117 renders
    assert.equal(estimateRemainingImages(plan.remainingPaiseBefore, plan.perImagePaise), 117);
  });

  it("clamps expensive 2K/4K and Pro requests down to paise-only in Paise Eco mode", () => {
    const plan4k = resolveBudgetRenderPlan({
      requestedModel: "gemini-3-pro-image",
      requestedResolution: "4K",
      imageCount: 1,
      budget: DEFAULT_BUDGET_STATE,
    });
    assert.equal(plan4k.clampedForEco, true);
    assert.equal(plan4k.effectiveModel, "gemini-nano-banana-2.1");
    assert.equal(plan4k.effectiveResolution, "1K");
    assert.equal(plan4k.perImagePaise, 85);
    assert.ok(plan4k.notice?.includes("Paise Eco"));
  });

  it("routes 4-Up concept grids to Nano Banana 2 Lite (45p/img) in Paise Eco mode", () => {
    const planGrid = resolveBudgetRenderPlan({
      requestedModel: "gemini-nano-banana-2.1",
      requestedResolution: "1K",
      imageCount: 4,
      budget: DEFAULT_BUDGET_STATE,
    });
    assert.equal(planGrid.useCloud, true);
    assert.equal(planGrid.effectiveModel, "gemini-3.1-flash-lite-image");
    assert.equal(planGrid.perImagePaise, 45);
    assert.equal(planGrid.totalCostPaise, 180); // ₹1.80 total (45p each)
    assert.equal(planGrid.timeoutMs, 16_000);
  });

  it("enforces zero-cost Free mode with zero cloud spend", () => {
    const plan = resolveBudgetRenderPlan({
      requestedModel: "gemini-nano-banana-2.1",
      requestedResolution: "2K",
      imageCount: 1,
      budget: { ...DEFAULT_BUDGET_STATE, costMode: "free-only" },
    });
    assert.equal(plan.useCloud, false);
    assert.equal(plan.blockedByCap, false);
    assert.equal(plan.totalCostPaise, 0);
    assert.equal(formatPaiseShort(plan.totalCostPaise), "0p");
  });

  it("hard-stops cloud calls when ₹100.00 cap is reached and falls back to Free (₹0)", () => {
    const nearlySpent = {
      ...DEFAULT_BUDGET_STATE,
      capPaise: 10_000,
      spentPaise: 9_950, // Only 50p remaining, Nano Banana 2.1 1K costs 85p
    };
    const plan = resolveBudgetRenderPlan({
      requestedModel: "gemini-nano-banana-2.1",
      requestedResolution: "1K",
      imageCount: 1,
      budget: nearlySpent,
    });
    assert.equal(plan.useCloud, false);
    assert.equal(plan.blockedByCap, true);
    assert.equal(plan.totalCostPaise, 0);
    assert.match(plan.notice ?? "", /₹100\.00 cap reached/);
  });

  it("allows Lite 45p draft when 50p remains under ₹100 cap", () => {
    const nearlySpent = {
      ...DEFAULT_BUDGET_STATE,
      capPaise: 10_000,
      spentPaise: 9_950,
    };
    const plan = resolveBudgetRenderPlan({
      requestedModel: "gemini-3.1-flash-lite-image",
      requestedResolution: "1K",
      imageCount: 1,
      budget: nearlySpent,
    });
    assert.equal(plan.useCloud, true);
    assert.equal(plan.blockedByCap, false);
    assert.equal(plan.perImagePaise, 45);
    assert.equal(plan.remainingPaiseAfter, 5);
  });

  it("allows 2K/4K when user explicitly unlocks Studio Pro within cap", () => {
    const proState = sanitizeBudgetState({ costMode: "pro-unlocked", capPaise: 10_000 });
    const plan = resolveBudgetRenderPlan({
      requestedModel: "gemini-nano-banana-2.1",
      requestedResolution: "2K",
      imageCount: 1,
      budget: proState,
    });
    assert.equal(plan.useCloud, true);
    assert.equal(plan.effectiveResolution, "2K");
    assert.equal(plan.perImagePaise, estimatePerImageCostPaise("gemini-nano-banana-2.1", "2K"));
    assert.equal(plan.perImagePaise, 280);
  });

  it("formats paise and INR concisely", () => {
    assert.equal(formatPaiseShort(0), "0p");
    assert.equal(formatPaiseShort(45), "45p");
    assert.equal(formatPaiseShort(85), "85p");
    assert.equal(formatPaiseShort(180), "₹1.80");
    assert.equal(formatPaiseShort(10_000), "₹100");
  });

  it("triggers 80% warning status at ₹80.00 of ₹100.00 cap and cap-reached at ₹100.00", () => {
    assert.equal(BUDGET_WARNING_THRESHOLD_PCT, 80);

    const under = getBudgetWarningStatus({ ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 7_950 });
    assert.equal(under.level, "ok");
    assert.equal(under.isWarning, false);

    const at80 = getBudgetWarningStatus({ ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 8_000 });
    assert.equal(at80.level, "warning");
    assert.equal(at80.isWarning, true);
    assert.equal(at80.usedPct, 80);
    assert.equal(at80.remainingPaise, 2_000);

    const at100 = getBudgetWarningStatus({ ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 10_000 });
    assert.equal(at100.level, "reached");
    assert.equal(at100.isReached, true);

    assert.equal(
      didCrossBudgetWarningThreshold(
        { ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 7_950 },
        { ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 8_035 },
      ),
      "warning-80",
    );
    assert.equal(
      didCrossBudgetWarningThreshold(
        { ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 8_035 },
        { ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 8_120 },
      ),
      "none",
    );
    assert.equal(
      didCrossBudgetWarningThreshold(
        { ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 9_950 },
        { ...DEFAULT_BUDGET_STATE, capPaise: 10_000, spentPaise: 10_035 },
      ),
      "cap-100",
    );
  });

  it("accumulates dailySpend entries per day and builds an exact 7-day rolling chart series", () => {
    const day1 = new Date(2026, 10, 18, 10, 0, 0);
    const day2 = new Date(2026, 10, 20, 14, 0, 0);
    let entries = recordDailySpendEntry([], 85, 1, day1);
    entries = recordDailySpendEntry(entries, 85, 1, day1);
    entries = recordDailySpendEntry(entries, 45, 1, day2);

    assert.equal(entries.length, 2);
    assert.deepEqual(entries[0], { date: "2026-11-18", spentPaise: 170, imageCount: 2 });
    assert.deepEqual(entries[1], { date: "2026-11-20", spentPaise: 45, imageCount: 1 });

    const series = buildRecentDailySpendSeries(
      { ...DEFAULT_BUDGET_STATE, spentPaise: 215, dailySpend: entries },
      7,
      day2,
    );
    assert.equal(series.length, 7);
    assert.equal(series[6].date, "2026-11-20");
    assert.equal(series[6].dayLabel, "Today");
    assert.equal(series[6].spentInr, 0.45);
    assert.equal(series[4].date, "2026-11-18");
    assert.equal(series[4].spentInr, 1.7);
    assert.equal(series[0].spentPaise, 0);

    // Legacy fallback: spentPaise > 0 with empty dailySpend attributes spend to Today
    const legacySeries = buildRecentDailySpendSeries(
      { ...DEFAULT_BUDGET_STATE, spentPaise: 340, liveImageCount: 4, dailySpend: [] },
      7,
      day2,
    );
    assert.equal(legacySeries[6].spentPaise, 340);
    assert.equal(legacySeries[6].spentInr, 3.4);
    assert.equal(legacySeries[6].imageCount, 4);
  });
});
