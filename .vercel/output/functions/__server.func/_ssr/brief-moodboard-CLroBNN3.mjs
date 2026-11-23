//#region node_modules/.nitro/vite/services/ssr/assets/brief-moodboard-CLroBNN3.js
var NOISE_WORDS = /* @__PURE__ */ new Set([
	"undefined",
	"null",
	"photorealistic",
	"render",
	"visualization",
	"resolution",
	"sharp",
	"focus",
	"people",
	"cars",
	"watermark",
	"distorted",
	"geometry",
	"vertical",
	"tilt-shift",
	"corrected",
	"perspective",
	"style",
	"lighting",
	"mood",
	"lens",
	"aesthetic",
	"bespoke"
]);
var OFF_TOPIC_TAG_WORDS = /* @__PURE__ */ new Set([
	"painting",
	"flower",
	"flowers",
	"vase",
	"portrait",
	"selfie",
	"cat",
	"dog",
	"food"
]);
function cleanArchitecturalQueryText(raw, maxWords = 4) {
	const tokens = raw.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).map((t) => t.trim()).filter((t) => t.length >= 3 && !NOISE_WORDS.has(t) && !/^\d+k?$/.test(t) && !/^\d+mm$/.test(t));
	const seen = /* @__PURE__ */ new Set();
	const unique = [];
	for (const token of tokens) {
		if (seen.has(token)) continue;
		seen.add(token);
		unique.push(token);
		if (unique.length >= maxWords) break;
	}
	return unique.join(" ");
}
function mapStyleToSearchPhrase(style, facadeTypology, vertical) {
	const spaceWord = vertical === "interior" ? "architecture interior" : "architecture";
	if (style?.id === "japandi-minimalist") return `japanese timber pavilion ${spaceWord}`;
	if (style?.id === "minimalist-concrete-glass") return `modern concrete glass ${spaceWord}`;
	if (style?.id === "brutalist-sculptural") return `brutalist concrete ${spaceWord}`;
	if (style?.id === "contemporary-tropical") return `tropical timber pavilion ${spaceWord}`;
	if (style?.id === "nordic-timber-civic") return `nordic brick timber ${spaceWord}`;
	if (style?.id === "industrial-heritage-reuse") return `industrial brick loft ${spaceWord}`;
	const fromName = cleanArchitecturalQueryText(`${style?.name ?? ""} ${facadeTypology}`, 3);
	return fromName ? `${fromName} architecture` : `modern ${spaceWord}`;
}
function mapLightingToSearchPhrase(lighting, lightField) {
	if (lighting?.id === "blue-hour-twilight") return "twilight building architecture";
	if (lighting?.id === "golden-hour-raking") return "sunset facade architecture";
	if (lighting?.id === "soft-overcast-diffused") return "courtyard pavilion architecture";
	if (lighting?.id === "dramatic-chiaroscuro") return "concrete shadow architecture";
	const fromLight = cleanArchitecturalQueryText(`${lighting?.name ?? ""} ${lightField}`, 2);
	return fromLight ? `${fromLight} architecture` : "daylight modern architecture";
}
function mapMaterialToSearchPhrase(primaryMaterial, style, customNotes) {
	const matTokens = cleanArchitecturalQueryText(`${primaryMaterial} ${style?.materials?.[0] ?? ""} ${customNotes}`, 2);
	return matTokens ? `${matTokens} facade architecture` : `${primaryMaterial} architecture`;
}
function parseBriefToMoodboardQueries(args) {
	const override = args.customQueryOverride?.trim();
	if (override) {
		const cleaned = cleanArchitecturalQueryText(override, 4) || override.slice(0, 64);
		return [{
			facet: "Custom",
			label: `Custom · ${override.slice(0, 32)}`,
			query: cleaned.includes("architect") ? cleaned : `${cleaned} architecture`,
			fallbackQuery: "modern architecture"
		}];
	}
	const archQuery = mapStyleToSearchPhrase(args.selectedStyle, args.engine.facadeTypology, args.design.vertical);
	const lightQuery = mapLightingToSearchPhrase(args.selectedLighting, args.design.light);
	const materialQuery = mapMaterialToSearchPhrase(args.scene3d.primaryMaterial, args.selectedStyle, args.customNotes);
	const queries = [
		{
			facet: "Architecture",
			label: args.selectedStyle?.name ?? args.engine.facadeTypology,
			query: archQuery,
			fallbackQuery: "modern concrete glass architecture"
		},
		{
			facet: "Lighting",
			label: args.selectedLighting?.name ?? args.design.light,
			query: lightQuery,
			fallbackQuery: "modern architectural facade"
		},
		{
			facet: "Materiality",
			label: `${args.scene3d.primaryMaterial} & materiality`,
			query: materialQuery,
			fallbackQuery: `${args.scene3d.primaryMaterial} building architecture`
		}
	];
	const used = /* @__PURE__ */ new Set();
	return queries.filter((q) => {
		const key = q.query.toLowerCase();
		if (used.has(key)) return false;
		used.add(key);
		return true;
	});
}
function normalizeOpenverseResult(raw, facet, queryUsed) {
	const id = typeof raw.id === "string" ? raw.id : "";
	const url = typeof raw.url === "string" ? raw.url : "";
	const thumbnail = typeof raw.thumbnail === "string" && raw.thumbnail ? raw.thumbnail : url;
	if (!id || !thumbnail && !url) return null;
	if (!/^https?:\/\//i.test(thumbnail) || !/^https?:\/\//i.test(url || thumbnail)) return null;
	const width = typeof raw.width === "number" ? raw.width : 0;
	const height = typeof raw.height === "number" ? raw.height : 0;
	if (width > 0 && width < 220) return null;
	const title = (typeof raw.title === "string" ? raw.title.trim() : "").replace(/\s+/g, " ").slice(0, 96) || "Architectural Reference";
	const creator = typeof raw.creator === "string" && raw.creator.trim() ? raw.creator.trim().slice(0, 60) : "Public Archive";
	const license = typeof raw.license === "string" && raw.license.trim() ? raw.license.toUpperCase() : "CC";
	const sourceUrl = typeof raw.foreign_landing_url === "string" && /^https?:\/\//i.test(raw.foreign_landing_url) ? raw.foreign_landing_url : url || thumbnail;
	const tags = Array.isArray(raw.tags) ? raw.tags.map((t) => typeof t === "object" && t && typeof t.name === "string" ? t.name : "").filter(Boolean).slice(0, 5) : [];
	const titleLower = title.toLowerCase();
	if (tags.some((t) => OFF_TOPIC_TAG_WORDS.has(t.toLowerCase())) || /\b(flower|bouquet|painting|still items)\b/i.test(titleLower)) return null;
	return {
		id: `ov-${id}`,
		title,
		thumbnailUrl: thumbnail,
		fullUrl: url || thumbnail,
		sourceUrl,
		creator,
		license,
		provider: "Openverse",
		facet,
		queryUsed,
		width: width || 800,
		height: height || 600,
		tags
	};
}
function normalizeWikimediaPage(page, facet, queryUsed) {
	const pageId = typeof page.pageid === "number" || typeof page.pageid === "string" ? String(page.pageid) : "";
	const info = (Array.isArray(page.imageinfo) ? page.imageinfo : [])[0];
	if (!pageId || !info) return null;
	const mime = typeof info.mime === "string" ? info.mime.toLowerCase() : "";
	if (![
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp"
	].includes(mime)) return null;
	const thumb = typeof info.thumburl === "string" ? info.thumburl : "";
	const full = typeof info.url === "string" ? info.url : thumb;
	const thumbnailUrl = thumb || full;
	if (!/^https?:\/\//i.test(thumbnailUrl)) return null;
	const width = typeof info.width === "number" ? info.width : 800;
	const height = typeof info.height === "number" ? info.height : 600;
	if (width < 320 || height < 220) return null;
	const cleanTitle = (typeof page.title === "string" ? page.title : "").replace(/^File:/i, "").replace(/\.(jpg|jpeg|png|webp|tif|tiff)$/i, "").replace(/_/g, " ").trim().slice(0, 96);
	const ext = typeof info.extmetadata === "object" && info.extmetadata ? info.extmetadata : {};
	const stripHtml = (s) => s ? s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
	const creator = stripHtml(ext.Artist?.value).slice(0, 60) || "Wikimedia Contributor";
	const license = stripHtml(ext.LicenseShortName?.value).slice(0, 24) || "CC";
	const sourceUrl = typeof info.descriptionurl === "string" && /^https?:\/\//i.test(info.descriptionurl) ? info.descriptionurl : full;
	return {
		id: `wm-${pageId}`,
		title: cleanTitle || "Wikimedia Architectural Reference",
		thumbnailUrl,
		fullUrl: full,
		sourceUrl,
		creator,
		license,
		provider: "Wikimedia Commons",
		facet,
		queryUsed,
		width,
		height,
		tags: []
	};
}
function dedupeMoodboardItems(items, limit = 12) {
	const seenUrls = /* @__PURE__ */ new Set();
	const seenIds = /* @__PURE__ */ new Set();
	const seenTitleCreator = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of items) {
		const urlKey = item.thumbnailUrl.toLowerCase();
		const titleKey = `${item.title.toLowerCase().trim()}::${item.creator.toLowerCase().trim()}`;
		if (seenIds.has(item.id) || seenUrls.has(urlKey) || seenTitleCreator.has(titleKey)) continue;
		seenIds.add(item.id);
		seenUrls.add(urlKey);
		seenTitleCreator.add(titleKey);
		out.push(item);
		if (out.length >= limit) break;
	}
	return out;
}
function formatReferenceNoteFromImage(item) {
	return `Reference inspiration (${item.facet}): ${item.title} [${item.provider} · ${item.license}]`;
}
//#endregion
export { parseBriefToMoodboardQueries as a, normalizeWikimediaPage as i, formatReferenceNoteFromImage as n, normalizeOpenverseResult as r, dedupeMoodboardItems as t };
