//#region node_modules/.nitro/vite/services/ssr/assets/budget-guard-D-yFSGTM.js
var DEFAULT_BUDGET_CAP_PAISE = 1e4;
var MAX_BUDGET_CAP_PAISE = 5e5;
var DEFAULT_BUDGET_STATE = {
	capPaise: DEFAULT_BUDGET_CAP_PAISE,
	spentPaise: 0,
	costMode: "paise-eco",
	maxPerImagePaise: 99,
	autoFallbackOnCap: true,
	lastCostPaise: 0,
	liveImageCount: 0,
	freeImageCount: 0,
	dailySpend: []
};
var BUDGET_CAP_PRESETS_INR = [
	25,
	50,
	100,
	250,
	500
];
/**
* Conservative INR paise cost estimates per image (1 INR = 100 paise)
* tuned for Gemini Nano Banana 2.1 and Nano Banana 2 Lite.
*/
function estimatePerImageCostPaise(modelId, resolution = "1K") {
	const normalizedRes = normalizeBudgetResolution(resolution);
	const m = (modelId || "gemini-nano-banana-2.1").toLowerCase();
	if (m === "local-free" || m === "free") return 0;
	if (m.includes("lite") || m === "nano_banana_2_lite") return normalizedRes === "512" ? 30 : 45;
	if (m.includes("pro") || m === "nano_banana_pro") {
		if (normalizedRes === "4K") return 1400;
		if (normalizedRes === "2K") return 950;
		return 650;
	}
	if (normalizedRes === "4K") return 560;
	if (normalizedRes === "2K") return 280;
	if (normalizedRes === "512") return 55;
	return 85;
}
function normalizeBudgetResolution(value) {
	const upper = String(value ?? "1K").toUpperCase();
	if (upper === "512") return "512";
	if (upper === "2K") return "2K";
	if (upper === "4K") return "4K";
	return "1K";
}
function sanitizeBudgetState(input) {
	const capPaise = typeof input?.capPaise === "number" && Number.isFinite(input.capPaise) ? Math.max(0, Math.min(MAX_BUDGET_CAP_PAISE, Math.round(input.capPaise))) : DEFAULT_BUDGET_STATE.capPaise;
	const spentPaise = typeof input?.spentPaise === "number" && Number.isFinite(input.spentPaise) ? Math.max(0, Math.round(input.spentPaise)) : DEFAULT_BUDGET_STATE.spentPaise;
	const costMode = input?.costMode === "free-only" || input?.costMode === "paise-eco" || input?.costMode === "pro-unlocked" ? input.costMode : DEFAULT_BUDGET_STATE.costMode;
	const maxPerImagePaise = typeof input?.maxPerImagePaise === "number" && Number.isFinite(input.maxPerImagePaise) ? Math.max(30, Math.min(2e3, Math.round(input.maxPerImagePaise))) : 99;
	const dailySpend = sanitizeDailySpend(input?.dailySpend);
	return {
		capPaise,
		spentPaise,
		costMode,
		maxPerImagePaise,
		autoFallbackOnCap: typeof input?.autoFallbackOnCap === "boolean" ? input.autoFallbackOnCap : DEFAULT_BUDGET_STATE.autoFallbackOnCap,
		lastCostPaise: typeof input?.lastCostPaise === "number" && Number.isFinite(input.lastCostPaise) ? Math.max(0, Math.round(input.lastCostPaise)) : 0,
		liveImageCount: typeof input?.liveImageCount === "number" && Number.isFinite(input.liveImageCount) ? Math.max(0, Math.floor(input.liveImageCount)) : 0,
		freeImageCount: typeof input?.freeImageCount === "number" && Number.isFinite(input.freeImageCount) ? Math.max(0, Math.floor(input.freeImageCount)) : 0,
		dailySpend
	};
}
/**
* Resolves the exact model, resolution, timeout, and hard INR stop-loss plan
* BEFORE any Gemini API call is dispatched.
*/
function resolveBudgetRenderPlan(params) {
	const budget = sanitizeBudgetState(params.budget);
	const imageCount = Math.max(1, Math.min(4, Math.floor(params.imageCount ?? 1)));
	const remainingPaiseBefore = Math.max(0, budget.capPaise - budget.spentPaise);
	if (budget.costMode === "free-only") return {
		useCloud: false,
		blockedByCap: false,
		clampedForEco: false,
		effectiveModel: "local-free",
		effectiveResolution: "1K",
		perImagePaise: 0,
		totalCostPaise: 0,
		remainingPaiseBefore,
		remainingPaiseAfter: remainingPaiseBefore,
		timeoutMs: 8e3,
		maxPromptChars: 3200,
		maxReferences: 2,
		allowThirdPartyFallbacks: false,
		notice: "Free (₹0) Studio mode active — rendered instant local composite with 0p API spend."
	};
	let effectiveModel = params.requestedModel || "gemini-nano-banana-2.1";
	let effectiveResolution = normalizeBudgetResolution(params.requestedResolution ?? "1K");
	let clampedForEco = false;
	if (budget.costMode === "paise-eco") {
		if (effectiveResolution === "2K" || effectiveResolution === "4K") {
			effectiveResolution = "1K";
			clampedForEco = true;
		}
		if (effectiveModel.includes("pro") || effectiveModel === "nano_banana_pro") {
			effectiveModel = "gemini-nano-banana-2.1";
			clampedForEco = true;
		}
		if (imageCount > 1 && effectiveModel !== "gemini-3.1-flash-lite-image") {
			effectiveModel = "gemini-3.1-flash-lite-image";
			clampedForEco = true;
		}
		if (estimatePerImageCostPaise(effectiveModel, effectiveResolution) > budget.maxPerImagePaise) {
			effectiveModel = "gemini-3.1-flash-lite-image";
			effectiveResolution = "1K";
			clampedForEco = true;
		}
	}
	const perImagePaise = estimatePerImageCostPaise(effectiveModel, effectiveResolution);
	const totalCostPaise = perImagePaise * imageCount;
	if (budget.capPaise <= 0 || remainingPaiseBefore < totalCostPaise) return {
		useCloud: false,
		blockedByCap: true,
		clampedForEco,
		effectiveModel: "local-free",
		effectiveResolution: "1K",
		perImagePaise: 0,
		totalCostPaise: 0,
		remainingPaiseBefore,
		remainingPaiseAfter: remainingPaiseBefore,
		timeoutMs: 8e3,
		maxPromptChars: 3200,
		maxReferences: 2,
		allowThirdPartyFallbacks: false,
		notice: `${formatInrExact(budget.capPaise)} cap reached (${formatInrExact(budget.spentPaise)} used) — switched to Free (₹0) Studio preview.`
	};
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
		timeoutMs: isLite ? 16e3 : effectiveResolution === "1K" || effectiveResolution === "512" ? 22e3 : 34e3,
		maxPromptChars: isEco ? 2400 : 6e3,
		maxReferences: isEco ? 2 : 6,
		allowThirdPartyFallbacks: !isEco,
		...clampedForEco ? { notice: `Paise Eco guard kept render at ${effectiveResolution} (${formatPaiseShort(perImagePaise)}/img) within your ${formatInrExact(budget.capPaise)} cap.` } : {}
	};
}
function formatPaiseShort(paise) {
	const safe = Math.max(0, Math.round(paise));
	if (safe === 0) return "0p";
	if (safe < 100) return `${safe}p`;
	const inr = safe / 100;
	return Number.isInteger(inr) ? `₹${inr}` : `₹${inr.toFixed(2)}`;
}
function formatInrExact(paise) {
	return `₹${(Math.max(0, Math.round(paise)) / 100).toFixed(2)}`;
}
function estimateRemainingImages(remainingPaise, perImagePaise) {
	if (perImagePaise <= 0) return Number.POSITIVE_INFINITY;
	return Math.max(0, Math.floor(Math.max(0, remainingPaise) / perImagePaise));
}
var ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
var DAY_SHORT_NAMES = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function getIsoDateKey(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function sanitizeDailySpend(entries) {
	if (!Array.isArray(entries)) return [];
	const merged = /* @__PURE__ */ new Map();
	for (const raw of entries) {
		if (!raw || typeof raw !== "object") continue;
		if (typeof raw.date !== "string" || !ISO_DATE_RE.test(raw.date)) continue;
		const spentPaise = typeof raw.spentPaise === "number" && Number.isFinite(raw.spentPaise) ? Math.max(0, Math.round(raw.spentPaise)) : 0;
		const imageCount = typeof raw.imageCount === "number" && Number.isFinite(raw.imageCount) ? Math.max(0, Math.floor(raw.imageCount)) : 0;
		const prev = merged.get(raw.date);
		merged.set(raw.date, {
			date: raw.date,
			spentPaise: (prev?.spentPaise ?? 0) + spentPaise,
			imageCount: (prev?.imageCount ?? 0) + imageCount
		});
	}
	return [...merged.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
}
function recordDailySpendEntry(entries, billedPaise, imageCount, now = /* @__PURE__ */ new Date()) {
	const billed = Math.max(0, Math.round(billedPaise));
	const images = Math.max(0, Math.floor(imageCount));
	const clean = sanitizeDailySpend(entries);
	if (billed <= 0 && images <= 0) return clean;
	const today = getIsoDateKey(now);
	return (clean.find((e) => e.date === today) ? clean.map((e) => e.date === today ? {
		...e,
		spentPaise: e.spentPaise + billed,
		imageCount: e.imageCount + images
	} : e) : [...clean, {
		date: today,
		spentPaise: billed,
		imageCount: images
	}]).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
}
/**
* Evaluates whether current cloud spending has reached the 80% warning threshold
* or 100% hard cap ceiling.
*/
function getBudgetWarningStatus(budget) {
	const clean = sanitizeBudgetState(budget);
	const remainingPaise = Math.max(0, clean.capPaise - clean.spentPaise);
	if (clean.capPaise <= 0) return {
		usedPct: 100,
		exactPct: 100,
		remainingPaise: 0,
		isWarning: false,
		isReached: true,
		level: "reached"
	};
	const exactPct = Math.min(100, clean.spentPaise / clean.capPaise * 100);
	const usedPct = Math.min(100, Math.round(exactPct));
	const isReached = clean.spentPaise >= clean.capPaise;
	const isWarning = !isReached && exactPct >= 80;
	return {
		usedPct,
		exactPct,
		remainingPaise,
		isWarning,
		isReached,
		level: isReached ? "reached" : isWarning ? "warning" : "ok"
	};
}
/**
* Builds an exact rolling N-day spending series ending today for the header and modal
* Recharts bar charts. Attributes legacy cumulative spend to today if dailySpend is empty.
*/
function buildRecentDailySpendSeries(budget, days = 7, now = /* @__PURE__ */ new Date()) {
	const clean = sanitizeBudgetState(budget);
	const count = Math.max(3, Math.min(14, Math.floor(days)));
	const byDate = /* @__PURE__ */ new Map();
	for (const entry of clean.dailySpend) byDate.set(entry.date, entry);
	const todayKey = getIsoDateKey(now);
	if (byDate.size === 0 && clean.spentPaise > 0) byDate.set(todayKey, {
		date: todayKey,
		spentPaise: clean.spentPaise,
		imageCount: Math.max(clean.liveImageCount, 1)
	});
	const series = [];
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
			isToday
		});
	}
	return series;
}
//#endregion
export { estimateRemainingImages as a, getBudgetWarningStatus as c, sanitizeBudgetState as d, estimatePerImageCostPaise as i, recordDailySpendEntry as l, DEFAULT_BUDGET_STATE as n, formatInrExact as o, buildRecentDailySpendSeries as r, formatPaiseShort as s, BUDGET_CAP_PRESETS_INR as t, resolveBudgetRenderPlan as u };
