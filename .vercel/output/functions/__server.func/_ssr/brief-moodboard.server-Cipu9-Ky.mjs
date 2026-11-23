import { i as normalizeWikimediaPage, r as normalizeOpenverseResult, t as dedupeMoodboardItems } from "./brief-moodboard-CLroBNN3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brief-moodboard.server-Cipu9-Ky.js
var USER_AGENT = "OrielArchvizStudio/1.0 (Automated Moodboard Generator)";
var FETCH_TIMEOUT_MS = 7500;
async function fetchJsonWithTimeout(url) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": USER_AGENT,
				Accept: "application/json"
			},
			signal: controller.signal
		});
		if (!res.ok) throw new Error(`HTTP ${res.status} from ${new URL(url).hostname}`);
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}
async function queryOpenverse(query, facet, pageSize = 8) {
	const data = await fetchJsonWithTimeout(`https://api.openverse.org/v1/images/?${new URLSearchParams({
		q: query,
		category: "photograph",
		filter_dead: "true",
		mature: "false",
		page_size: String(pageSize)
	}).toString()}`);
	const results = Array.isArray(data.results) ? data.results : [];
	const mapped = [];
	for (const row of results) {
		const item = normalizeOpenverseResult(row, facet, query);
		if (item) mapped.push(item);
	}
	return mapped;
}
async function queryWikimedia(query, facet, limit = 8) {
	const data = await fetchJsonWithTimeout(`https://commons.wikimedia.org/w/api.php?${new URLSearchParams({
		action: "query",
		generator: "search",
		gsrnamespace: "6",
		gsrsearch: `${query} filetype:bitmap`,
		gsrlimit: String(limit),
		prop: "imageinfo",
		iiprop: "url|extmetadata|size|mime",
		iiurlwidth: "720",
		format: "json",
		origin: "*"
	}).toString()}`);
	const pages = Object.values(data.query?.pages ?? {});
	const mapped = [];
	for (const page of pages) {
		const item = normalizeWikimediaPage(page, facet, query);
		if (item) mapped.push(item);
	}
	return mapped;
}
async function fetchAutomatedMoodboardFromPublicApi(queries) {
	const cleanQueries = queries.slice(0, 4);
	const warnings = [];
	const providersUsed = /* @__PURE__ */ new Set();
	const collected = [];
	await Promise.all(cleanQueries.map(async (spec) => {
		const facetItems = [];
		try {
			const res = await queryOpenverse(spec.query, spec.facet, 8);
			if (res.length > 0) providersUsed.add("Openverse");
			facetItems.push(...res.slice(0, 6));
		} catch (err) {
			warnings.push(`Openverse lookup (${spec.facet}): ${err instanceof Error ? err.message : "unavailable"}`);
		}
		if (facetItems.length < 3 && spec.fallbackQuery && spec.fallbackQuery !== spec.query) try {
			const fallbackRes = await queryOpenverse(spec.fallbackQuery, spec.facet, 6);
			if (fallbackRes.length > 0) providersUsed.add("Openverse");
			facetItems.push(...fallbackRes.slice(0, 5));
		} catch {}
		if (facetItems.length < 4) try {
			const wikiRes = await queryWikimedia(facetItems.length === 0 && spec.fallbackQuery ? spec.fallbackQuery : spec.query, spec.facet, 6);
			if (wikiRes.length > 0) providersUsed.add("Wikimedia Commons");
			facetItems.push(...wikiRes.slice(0, 4));
		} catch (err) {
			warnings.push(`Wikimedia lookup (${spec.facet}): ${err instanceof Error ? err.message : "unavailable"}`);
		}
		collected.push(...facetItems.slice(0, 6));
	}));
	const items = dedupeMoodboardItems(collected, 18);
	return {
		queries: [...cleanQueries],
		items,
		providersUsed: [...providersUsed],
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		warnings
	};
}
//#endregion
export { fetchAutomatedMoodboardFromPublicApi };
