import { c as getDictionaryBlock, o as composeDictionarySelection } from "./archviz-dictionary-BdT_Lv3z.mjs";
// node_modules/.nitro/vite/services/ssr/assets/blocks.server-DS_lTSRs.js
var EXPAND = {
	"hero-photo-clean": ["hero-photo-clean-positive", "hero-photo-clean-negative"],
	"hero-photo-dramatic": ["hero-photo-dramatic-positive", "hero-photo-dramatic-negative"],
	"hero-sunset-gold": ["hero-sunset-gold-positive", "hero-sunset-gold-negative"],
	"hdri-realism": ["hdri-realism-positive", "hdri-realism-negative"]
};
function dictionaryBrief(vertical, advanced, extraBlocks = [], paramOverrides = {}) {
	const rawIds = [
		vertical === "interior" ? "interior" : "goal",
		"source",
		"geometry",
		"windows",
		...extraBlocks,
		advanced.change,
		advanced.light,
		...advanced.light === "night" ? [
			"night-windows",
			"night-street-sources",
			"night-headlights"
		] : [],
		advanced.air,
		advanced.season,
		...EXPAND[advanced.grade] ?? [advanced.grade],
		...advanced.extras,
		"exclude",
		"qc"
	];
	const kept = [];
	const blocked = /* @__PURE__ */ new Set();
	for (const id of rawIds) {
		const block = getDictionaryBlock(id);
		if (!block || id === "none" || blocked.has(id) || kept.includes(id)) continue;
		kept.push(id);
		for (const other of block.conflicts) blocked.add(other);
	}
	return composeDictionarySelection(kept, paramOverrides).text.slice(0, 6e3);
}
export { dictionaryBrief };
