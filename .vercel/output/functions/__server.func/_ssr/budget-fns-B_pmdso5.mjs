import { t as createServerRpc } from "./createServerRpc-BYs_ScYe.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { d as sanitizeBudgetState } from "./budget-guard-DuH_kgYu.mjs";
// node_modules/.nitro/vite/services/ssr/assets/budget-fns-B_pmdso5.js
var getStudioBudget_createServerFn_handler = createServerRpc({
	id: "c03145db811c0a8944b7db21ed6070e2406f5c66919ec82c17a21ce4adf05a2f",
	name: "getStudioBudget",
	filename: "src/lib/budget-fns.ts"
}, (opts) => getStudioBudget.__executeServer(opts));
var getStudioBudget = createServerFn({ method: "GET" }).handler(getStudioBudget_createServerFn_handler, async () => {
	const { readBudgetLedger } = await import("./budget-guard.server-B5UBy3IM.mjs");
	return readBudgetLedger();
});
var updateStudioBudget_createServerFn_handler = createServerRpc({
	id: "2d62dc372796e262cdccf69a5634cddcccbf36fc05b6760e2f77c571d8a3a912",
	name: "updateStudioBudget",
	filename: "src/lib/budget-fns.ts"
}, (opts) => updateStudioBudget.__executeServer(opts));
var updateStudioBudget = createServerFn({ method: "POST" }).validator((input) => {
	const raw = input && typeof input === "object" ? input : {};
	const costMode = raw.costMode === "free-only" || raw.costMode === "paise-eco" || raw.costMode === "pro-unlocked" ? raw.costMode : void 0;
	return {
		capPaise: typeof raw.capPaise === "number" && Number.isFinite(raw.capPaise) ? raw.capPaise : void 0,
		costMode,
		maxPerImagePaise: typeof raw.maxPerImagePaise === "number" && Number.isFinite(raw.maxPerImagePaise) ? raw.maxPerImagePaise : void 0,
		autoFallbackOnCap: typeof raw.autoFallbackOnCap === "boolean" ? raw.autoFallbackOnCap : void 0
	};
}).handler(updateStudioBudget_createServerFn_handler, async ({ data }) => {
	const { updateBudgetLedger } = await import("./budget-guard.server-B5UBy3IM.mjs");
	const updated = await updateBudgetLedger(data);
	return sanitizeBudgetState(updated);
});
var resetStudioBudget_createServerFn_handler = createServerRpc({
	id: "0d8c61b8084dc87acfafe9c7e5f7802adb0b9459471197169e5dd24783bb9f22",
	name: "resetStudioBudget",
	filename: "src/lib/budget-fns.ts"
}, (opts) => resetStudioBudget.__executeServer(opts));
var resetStudioBudget = createServerFn({ method: "POST" }).handler(resetStudioBudget_createServerFn_handler, async () => {
	const { resetBudgetLedger } = await import("./budget-guard.server-B5UBy3IM.mjs");
	return resetBudgetLedger();
});
export { getStudioBudget_createServerFn_handler, resetStudioBudget_createServerFn_handler, updateStudioBudget_createServerFn_handler };
