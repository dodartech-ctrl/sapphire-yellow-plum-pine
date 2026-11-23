export type BudgetCostMode = "free-only" | "paise-eco" | "pro-unlocked";

export type BudgetResolution = "512" | "1K" | "2K" | "4K";

export interface DailySpendEntry {
  /** ISO calendar date YYYY-MM-DD */
  date: string;
  /** Total live cloud spend recorded on that date in paise */
  spentPaise: number;
  /** Number of live cloud images billed on that date */
  imageCount: number;
}

export interface DailySpendChartPoint {
  date: string;
  dayLabel: string;
  shortLabel: string;
  spentPaise: number;
  spentInr: number;
  imageCount: number;
  isToday: boolean;
}

export type BudgetWarningLevel = "ok" | "warning" | "reached";

export interface BudgetWarningStatus {
  usedPct: number;
  exactPct: number;
  remainingPaise: number;
  isWarning: boolean;
  isReached: boolean;
  level: BudgetWarningLevel;
}

export interface BudgetState {
  /** Hard spending ceiling in paise (100 paise = ₹1 INR). Default: 10_000 = ₹100.00 */
  capPaise: number;
  /** Cumulative live cloud spend recorded in paise */
  spentPaise: number;
  /** Cost guard tier: Free (₹0), Paise Eco (≤99p/image, default), or Studio Pro */
  costMode: BudgetCostMode;
  /** Hard per-image paise ceiling enforced in Paise Eco mode (default 99p = ₹0.99) */
  maxPerImagePaise: number;
  /** When true, automatically falls back to Free (₹0) Studio composite instead of erroring when cap is reached */
  autoFallbackOnCap: boolean;
  /** Last billed cost in paise */
  lastCostPaise: number;
  /** Total live cloud images billed */
  liveImageCount: number;
  /** Total free ₹0 preview images rendered */
  freeImageCount: number;
  /** Rolling recent daily spend buckets (up to 14 days, sorted ascending by YYYY-MM-DD) */
  dailySpend: DailySpendEntry[];
}

export const DEFAULT_BUDGET_CAP_PAISE = 10_000; // ₹100.00 INR
export const PAISE_ECO_MAX_PER_IMAGE = 99; // Strictly paise-only (< ₹1.00 per image)
export const BUDGET_WARNING_THRESHOLD_PCT = 80; // Trigger visual warning & toast at 80% of cap
export const MIN_BUDGET_CAP_PAISE = 0;
export const MAX_BUDGET_CAP_PAISE = 500_000; // ₹5,000.00 INR safety ceiling

export const DEFAULT_BUDGET_STATE: BudgetState = {
  capPaise: DEFAULT_BUDGET_CAP_PAISE,
  spentPaise: 0,
  costMode: "paise-eco",
  maxPerImagePaise: PAISE_ECO_MAX_PER_IMAGE,
  autoFallbackOnCap: true,
  lastCostPaise: 0,
  liveImageCount: 0,
  freeImageCount: 0,
  dailySpend: [],
};

export const BUDGET_CAP_PRESETS_INR = [25, 50, 100, 250, 500] as const;

export interface BudgetRenderPlan {
  useCloud: boolean;
  blockedByCap: boolean;
  clampedForEco: boolean;
  effectiveModel: string;
  effectiveResolution: BudgetResolution;
  perImagePaise: number;
  totalCostPaise: number;
  remainingPaiseBefore: number;
  remainingPaiseAfter: number;
  timeoutMs: number;
  maxPromptChars: number;
  maxReferences: number;
  allowThirdPartyFallbacks: boolean;
  notice?: string;
}

/**
 * Conservative INR paise cost estimates per image (1 INR = 100 paise)
 * tuned for Gemini Nano Banana 2.1 and Nano Banana 2 Lite.
 */
export function estimatePerImageCostPaise(
  modelId: string | undefined,
  resolution: BudgetResolution | "1k" | "2k" = "1K",
): number {
  const normalizedRes = normalizeBudgetResolution(resolution);
  const m = (modelId || "gemini-nano-banana-2.1").toLowerCase();

  if (m === "local-free" || m === "free") {
    return 0;
  }

  // Nano Banana 2 Lite (lowest paise-tier fast draft)
  if (m.includes("lite") || m === "nano_banana_2_lite") {
    return normalizedRes === "512" ? 30 : 45;
  }

  // Nano Banana Pro (premium tier)
  if (m.includes("pro") || m === "nano_banana_pro") {
    if (normalizedRes === "4K") return 1400;
    if (normalizedRes === "2K") return 950;
    return 650;
  }

  // Nano Banana 2.1 / Nano Banana 2 (primary architectural model)
  if (normalizedRes === "4K") return 560; // ₹5.60
  if (normalizedRes === "2K") return 280; // ₹2.80
  if (normalizedRes === "512") return 55; // 55p
  return 85; // 1K Eco on Gemini Nano Banana 2.1 = 85 paise (< ₹1)
}

export function normalizeBudgetResolution(
  value: BudgetResolution | "1k" | "2k" | string | undefined,
): BudgetResolution {
  const upper = String(value ?? "1K").toUpperCase();
  if (upper === "512") return "512";
  if (upper === "2K") return "2K";
  if (upper === "4K") return "4K";
  return "1K";
}

export function sanitizeBudgetState(input?: Partial<BudgetState> | null): BudgetState {
  const capPaise =
    typeof input?.capPaise === "number" && Number.isFinite(input.capPaise)
      ? Math.max(MIN_BUDGET_CAP_PAISE, Math.min(MAX_BUDGET_CAP_PAISE, Math.round(input.capPaise)))
      : DEFAULT_BUDGET_STATE.capPaise;

  const spentPaise =
    typeof input?.spentPaise === "number" && Number.isFinite(input.spentPaise)
      ? Math.max(0, Math.round(input.spentPaise))
      : DEFAULT_BUDGET_STATE.spentPaise;

  const costMode: BudgetCostMode =
    input?.costMode === "free-only" || input?.costMode === "paise-eco" || input?.costMode === "pro-unlocked"
      ? input.costMode
      : DEFAULT_BUDGET_STATE.costMode;

  const maxPerImagePaise =
    typeof input?.maxPerImagePaise === "number" && Number.isFinite(input.maxPerImagePaise)
      ? Math.max(30, Math.min(2000, Math.round(input.maxPerImagePaise)))
      : PAISE_ECO_MAX_PER_IMAGE;

  const dailySpend = sanitizeDailySpend(input?.dailySpend);

  return {
    capPaise,
    spentPaise,
    costMode,
    maxPerImagePaise,
    autoFallbackOnCap:
      typeof input?.autoFallbackOnCap === "boolean" ? input.autoFallbackOnCap : DEFAULT_BUDGET_STATE.autoFallbackOnCap,
    lastCostPaise:
      typeof input?.lastCostPaise === "number" && Number.isFinite(input.lastCostPaise)
        ? Math.max(0, Math.round(input.lastCostPaise))
        : 0,
    liveImageCount:
      typeof input?.liveImageCount === "number" && Number.isFinite(input.liveImageCount)
        ? Math.max(0, Math.floor(input.liveImageCount))
        : 0,
    freeImageCount:
      typeof input?.freeImageCount === "number" && Number.isFinite(input.freeImageCount)
        ? Math.max(0, Math.floor(input.freeImageCount))
        : 0,
    dailySpend,
  };
}

/**
 * Resolves the exact model, resolution, timeout, and hard INR stop-loss plan
 * BEFORE any Gemini API call is dispatched.
 */
export function resolveBudgetRenderPlan(params: {
  requestedModel?: string;
  requestedResolution?: BudgetResolution | "1k" | "2k";
  imageCount?: number;
  budget: BudgetState;
}): BudgetRenderPlan {
  const budget = sanitizeBudgetState(params.budget);
  const imageCount = Math.max(1, Math.min(4, Math.floor(params.imageCount ?? 1)));
  const remainingPaiseBefore = Math.max(0, budget.capPaise - budget.spentPaise);

  // Tier 1: Free-Only Mode (₹0 / 0p — zero cloud API calls)
  if (budget.costMode === "free-only") {
    return {
      useCloud: false,
      blockedByCap: false,
      clampedForEco: false,
      effectiveModel: "local-free",
      effectiveResolution: "1K",
      perImagePaise: 0,
      totalCostPaise: 0,
      remainingPaiseBefore,
      remainingPaiseAfter: remainingPaiseBefore,
      timeoutMs: 8_000,
      maxPromptChars: 3_200,
      maxReferences: 2,
      allowThirdPartyFallbacks: false,
      notice: "Free (₹0) Studio mode active — rendered instant local composite with 0p API spend.",
    };
  }

  let effectiveModel = params.requestedModel || "gemini-nano-banana-2.1";
  let effectiveResolution = normalizeBudgetResolution(params.requestedResolution ?? "1K");
  let clampedForEco = false;

  // Tier 2: Paise-Eco Mode (DEFAULT — guarantees EVERY single image stays in paise, <= 99p)
  if (budget.costMode === "paise-eco") {
    // Never allow expensive 2K/4K or Pro model in Paise Eco mode
    if (effectiveResolution === "2K" || effectiveResolution === "4K") {
      effectiveResolution = "1K";
      clampedForEco = true;
    }
    if (effectiveModel.includes("pro") || effectiveModel === "nano_banana_pro") {
      effectiveModel = "gemini-nano-banana-2.1";
      clampedForEco = true;
    }
    // For 4-Up concept grids in Paise Eco, use ultra-fast Lite (45p/img) so batch stays economical
    if (imageCount > 1 && effectiveModel !== "gemini-3.1-flash-lite-image") {
      effectiveModel = "gemini-3.1-flash-lite-image";
      clampedForEco = true;
    }
    // Enforce strict maxPerImagePaise ceiling (default 99p)
    if (estimatePerImageCostPaise(effectiveModel, effectiveResolution) > budget.maxPerImagePaise) {
      effectiveModel = "gemini-3.1-flash-lite-image";
      effectiveResolution = "1K";
      clampedForEco = true;
    }
  }

  const perImagePaise = estimatePerImageCostPaise(effectiveModel, effectiveResolution);
  const totalCostPaise = perImagePaise * imageCount;

  // Hard ₹100 INR Stop-Loss Check
  if (budget.capPaise <= 0 || remainingPaiseBefore < totalCostPaise) {
    return {
      useCloud: false,
      blockedByCap: true,
      clampedForEco,
      effectiveModel: "local-free",
      effectiveResolution: "1K",
      perImagePaise: 0,
      totalCostPaise: 0,
      remainingPaiseBefore,
      remainingPaiseAfter: remainingPaiseBefore,
      timeoutMs: 8_000,
      maxPromptChars: 3_200,
      maxReferences: 2,
      allowThirdPartyFallbacks: false,
      notice: `${formatInrExact(budget.capPaise)} cap reached (${formatInrExact(budget.spentPaise)} used) — switched to Free (₹0) Studio preview.`,
    };
  }

  const isEco = budget.costMode === "paise-eco";
  const isLite = effectiveModel.includes("lite");

  return {
    useCloud: true,
    blockedByCap: false,
    clampedForEco,
    effectiveModel,
    effectiveResolution,
    perImagePaise,
    totalCostPaise,
    remainingPaiseBefore,
    remainingPaiseAfter: Math.max(0, remainingPaiseBefore - totalCostPaise),
    // Refined fast timeouts: Lite 16s, Nano Banana 2.1 1K 22s, Pro/2K/4K 34s
    timeoutMs: isLite ? 16_000 : effectiveResolution === "1K" || effectiveResolution === "512" ? 22_000 : 34_000,
    // Trimmed prompt budget in Eco mode lowers input token spend & speeds up latency
    maxPromptChars: isEco ? 2_400 : 6_000,
    maxReferences: isEco ? 2 : 6,
    // Skip slow 55s NVIDIA/xAI fallback chains when running in Paise Eco mode
    allowThirdPartyFallbacks: !isEco,
    ...(clampedForEco
      ? {
          notice: `Paise Eco guard kept render at ${effectiveResolution} (${formatPaiseShort(perImagePaise)}/img) within your ${formatInrExact(budget.capPaise)} cap.`,
        }
      : {}),
  };
}

export function formatPaiseShort(paise: number): string {
  const safe = Math.max(0, Math.round(paise));
  if (safe === 0) return "0p";
  if (safe < 100) return `${safe}p`;
  const inr = safe / 100;
  return Number.isInteger(inr) ? `₹${inr}` : `₹${inr.toFixed(2)}`;
}

export function formatInrExact(paise: number): string {
  const safe = Math.max(0, Math.round(paise));
  return `₹${(safe / 100).toFixed(2)}`;
}

export function estimateRemainingImages(remainingPaise: number, perImagePaise: number): number {
  if (perImagePaise <= 0) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor(Math.max(0, remainingPaise) / perImagePaise));
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_SHORT_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getIsoDateKey(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function sanitizeDailySpend(entries?: DailySpendEntry[] | null): DailySpendEntry[] {
  if (!Array.isArray(entries)) return [];
  const merged = new Map<string, DailySpendEntry>();
  for (const raw of entries) {
    if (!raw || typeof raw !== "object") continue;
    if (typeof raw.date !== "string" || !ISO_DATE_RE.test(raw.date)) continue;
    const spentPaise =
      typeof raw.spentPaise === "number" && Number.isFinite(raw.spentPaise)
        ? Math.max(0, Math.round(raw.spentPaise))
        : 0;
    const imageCount =
      typeof raw.imageCount === "number" && Number.isFinite(raw.imageCount)
        ? Math.max(0, Math.floor(raw.imageCount))
        : 0;
    const prev = merged.get(raw.date);
    merged.set(raw.date, {
      date: raw.date,
      spentPaise: (prev?.spentPaise ?? 0) + spentPaise,
      imageCount: (prev?.imageCount ?? 0) + imageCount,
    });
  }
  return [...merged.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
}

export function recordDailySpendEntry(
  entries: DailySpendEntry[],
  billedPaise: number,
  imageCount: number,
  now: Date = new Date(),
): DailySpendEntry[] {
  const billed = Math.max(0, Math.round(billedPaise));
  const images = Math.max(0, Math.floor(imageCount));
  const clean = sanitizeDailySpend(entries);
  if (billed <= 0 && images <= 0) return clean;
  const today = getIsoDateKey(now);
  const existing = clean.find((e) => e.date === today);
  const next = existing
    ? clean.map((e) =>
        e.date === today
          ? {
              ...e,
              spentPaise: e.spentPaise + billed,
              imageCount: e.imageCount + images,
            }
          : e,
      )
    : [...clean, { date: today, spentPaise: billed, imageCount: images }];
  return next.sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
}

/**
 * Evaluates whether current cloud spending has reached the 80% warning threshold
 * or 100% hard cap ceiling.
 */
export function getBudgetWarningStatus(budget: BudgetState): BudgetWarningStatus {
  const clean = sanitizeBudgetState(budget);
  const remainingPaise = Math.max(0, clean.capPaise - clean.spentPaise);
  if (clean.capPaise <= 0) {
    return {
      usedPct: 100,
      exactPct: 100,
      remainingPaise: 0,
      isWarning: false,
      isReached: true,
      level: "reached",
    };
  }
  const exactPct = Math.min(100, (clean.spentPaise / clean.capPaise) * 100);
  const usedPct = Math.min(100, Math.round(exactPct));
  const isReached = clean.spentPaise >= clean.capPaise;
  const isWarning = !isReached && exactPct >= BUDGET_WARNING_THRESHOLD_PCT;
  return {
    usedPct,
    exactPct,
    remainingPaise,
    isWarning,
    isReached,
    level: isReached ? "reached" : isWarning ? "warning" : "ok",
  };
}

export function didCrossBudgetWarningThreshold(
  prevBudget: BudgetState,
  nextBudget: BudgetState,
): "none" | "warning-80" | "cap-100" {
  const prev = getBudgetWarningStatus(prevBudget);
  const next = getBudgetWarningStatus(nextBudget);
  if (next.level === "reached" && prev.level !== "reached") return "cap-100";
  if (next.level === "warning" && prev.level === "ok") return "warning-80";
  return "none";
}

/**
 * Builds an exact rolling N-day spending series ending today for the header and modal
 * Recharts bar charts. Attributes legacy cumulative spend to today if dailySpend is empty.
 */
export function buildRecentDailySpendSeries(
  budget: BudgetState,
  days = 7,
  now: Date = new Date(),
): DailySpendChartPoint[] {
  const clean = sanitizeBudgetState(budget);
  const count = Math.max(3, Math.min(14, Math.floor(days)));
  const byDate = new Map<string, DailySpendEntry>();
  for (const entry of clean.dailySpend) {
    byDate.set(entry.date, entry);
  }
  const todayKey = getIsoDateKey(now);
  if (byDate.size === 0 && clean.spentPaise > 0) {
    byDate.set(todayKey, {
      date: todayKey,
      spentPaise: clean.spentPaise,
      imageCount: Math.max(clean.liveImageCount, 1),
    });
  }

  const series: DailySpendChartPoint[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    const key = getIsoDateKey(dt);
    const found = byDate.get(key);
    const spentPaise = found?.spentPaise ?? 0;
    const isToday = offset === 0;
    const weekday = DAY_SHORT_NAMES[dt.getDay()];
    series.push({
      date: key,
      dayLabel: isToday ? "Today" : weekday,
      shortLabel: isToday ? "Td" : weekday.slice(0, 2),
      spentPaise,
      spentInr: Number((spentPaise / 100).toFixed(2)),
      imageCount: found?.imageCount ?? 0,
      isToday,
    });
  }
  return series;
}
