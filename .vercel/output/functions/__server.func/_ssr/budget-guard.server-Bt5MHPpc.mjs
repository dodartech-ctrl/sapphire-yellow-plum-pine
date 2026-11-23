import { d as sanitizeBudgetState, l as recordDailySpendEntry, n as DEFAULT_BUDGET_STATE, u as resolveBudgetRenderPlan } from "./budget-guard-D-yFSGTM.mjs";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
//#region node_modules/.nitro/vite/services/ssr/assets/budget-guard.server-Bt5MHPpc.js
var BUDGET_FILE_PATH = path.join(os.tmpdir(), "oriel-studio-inr-budget.json");
var cachedLedger = null;
async function loadLedgerFromDisk() {
	if (cachedLedger) return { ...cachedLedger };
	try {
		const raw = await readFile(BUDGET_FILE_PATH, "utf8");
		const parsed = JSON.parse(raw);
		cachedLedger = sanitizeBudgetState(parsed);
		return { ...cachedLedger };
	} catch {
		cachedLedger = { ...DEFAULT_BUDGET_STATE };
		return { ...cachedLedger };
	}
}
async function persistLedgerToDisk(next) {
	cachedLedger = { ...next };
	try {
		await writeFile(BUDGET_FILE_PATH, JSON.stringify(next, null, 2), "utf8");
	} catch {}
}
async function readBudgetLedger() {
	return loadLedgerFromDisk();
}
async function updateBudgetLedger(patch) {
	const current = await loadLedgerFromDisk();
	const next = sanitizeBudgetState({
		...current,
		...typeof patch.capPaise === "number" ? { capPaise: patch.capPaise } : {},
		...patch.costMode ? { costMode: patch.costMode } : {},
		...typeof patch.maxPerImagePaise === "number" ? { maxPerImagePaise: patch.maxPerImagePaise } : {},
		...typeof patch.autoFallbackOnCap === "boolean" ? { autoFallbackOnCap: patch.autoFallbackOnCap } : {}
	});
	await persistLedgerToDisk(next);
	return next;
}
async function resetBudgetLedger() {
	const current = await loadLedgerFromDisk();
	const next = sanitizeBudgetState({
		...current,
		spentPaise: 0,
		lastCostPaise: 0,
		liveImageCount: 0,
		dailySpend: []
	});
	await persistLedgerToDisk(next);
	return next;
}
async function planServerBudgetRender(params) {
	let ledger = await loadLedgerFromDisk();
	if (params.clientOverride) ledger = await updateBudgetLedger(params.clientOverride);
	const plan = resolveBudgetRenderPlan({
		requestedModel: params.requestedModel,
		requestedResolution: params.requestedResolution,
		imageCount: params.imageCount,
		budget: ledger
	});
	return {
		ledger,
		plan
	};
}
async function recordServerRenderOutcome(params) {
	const current = await loadLedgerFromDisk();
	const billed = Math.max(0, Math.round(params.billedPaise));
	const liveImages = Math.max(0, Math.floor(params.liveImages));
	const next = sanitizeBudgetState({
		...current,
		spentPaise: current.spentPaise + billed,
		lastCostPaise: billed,
		liveImageCount: current.liveImageCount + liveImages,
		freeImageCount: current.freeImageCount + Math.max(0, Math.floor(params.freeImages)),
		dailySpend: recordDailySpendEntry(current.dailySpend, billed, liveImages)
	});
	await persistLedgerToDisk(next);
	return next;
}
//#endregion
export { planServerBudgetRender, readBudgetLedger, recordServerRenderOutcome, resetBudgetLedger, updateBudgetLedger };
