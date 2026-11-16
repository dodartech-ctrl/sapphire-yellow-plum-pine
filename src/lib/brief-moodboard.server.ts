import {
  dedupeMoodboardItems,
  normalizeOpenverseResult,
  normalizeWikimediaPage,
  type MoodboardFacet,
  type MoodboardGenerationResult,
  type MoodboardImageItem,
  type MoodboardQuerySpec,
} from "@/lib/brief-moodboard";

const USER_AGENT = "OrielArchvizStudio/1.0 (Automated Moodboard Generator)";
const FETCH_TIMEOUT_MS = 7500;

async function fetchJsonWithTimeout<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from ${new URL(url).hostname}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function queryOpenverse(
  query: string,
  facet: MoodboardFacet,
  pageSize = 8,
): Promise<MoodboardImageItem[]> {
  const params = new URLSearchParams({
    q: query,
    category: "photograph",
    filter_dead: "true",
    mature: "false",
    page_size: String(pageSize),
  });
  const url = `https://api.openverse.org/v1/images/?${params.toString()}`;
  const data = await fetchJsonWithTimeout<{ results?: Array<Record<string, unknown>> }>(url);
  const results = Array.isArray(data.results) ? data.results : [];
  const mapped: MoodboardImageItem[] = [];
  for (const row of results) {
    const item = normalizeOpenverseResult(row, facet, query);
    if (item) mapped.push(item);
  }
  return mapped;
}

async function queryWikimedia(
  query: string,
  facet: MoodboardFacet,
  limit = 8,
): Promise<MoodboardImageItem[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${query} filetype:bitmap`,
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: "720",
    format: "json",
    origin: "*",
  });
  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const data = await fetchJsonWithTimeout<{
    query?: { pages?: Record<string, Record<string, unknown>> };
  }>(url);
  const pages = Object.values(data.query?.pages ?? {});
  const mapped: MoodboardImageItem[] = [];
  for (const page of pages) {
    const item = normalizeWikimediaPage(page, facet, query);
    if (item) mapped.push(item);
  }
  return mapped;
}

export async function fetchAutomatedMoodboardFromPublicApi(
  queries: readonly MoodboardQuerySpec[],
): Promise<MoodboardGenerationResult> {
  const cleanQueries = queries.slice(0, 4);
  const warnings: string[] = [];
  const providersUsed = new Set<string>();
  const collected: MoodboardImageItem[] = [];

  await Promise.all(
    cleanQueries.map(async (spec) => {
      const facetItems: MoodboardImageItem[] = [];

      // 1. Primary Openverse lookup
      try {
        const res = await queryOpenverse(spec.query, spec.facet, 8);
        if (res.length > 0) providersUsed.add("Openverse");
        facetItems.push(...res.slice(0, 6));
      } catch (err) {
        warnings.push(
          `Openverse lookup (${spec.facet}): ${err instanceof Error ? err.message : "unavailable"}`,
        );
      }

      // 2. Fallback Openverse broad query if specific brief query returned < 3 hits
      if (facetItems.length < 3 && spec.fallbackQuery && spec.fallbackQuery !== spec.query) {
        try {
          const fallbackRes = await queryOpenverse(spec.fallbackQuery, spec.facet, 6);
          if (fallbackRes.length > 0) providersUsed.add("Openverse");
          facetItems.push(...fallbackRes.slice(0, 5));
        } catch {
          // Proceed to Wikimedia fallback
        }
      }

      // 3. Supplement with Wikimedia Commons if still fewer than 4 hits
      if (facetItems.length < 4) {
        try {
          const wikiRes = await queryWikimedia(
            facetItems.length === 0 && spec.fallbackQuery ? spec.fallbackQuery : spec.query,
            spec.facet,
            6,
          );
          if (wikiRes.length > 0) providersUsed.add("Wikimedia Commons");
          facetItems.push(...wikiRes.slice(0, 4));
        } catch (err) {
          warnings.push(
            `Wikimedia lookup (${spec.facet}): ${err instanceof Error ? err.message : "unavailable"}`,
          );
        }
      }

      collected.push(...facetItems.slice(0, 6));
    }),
  );

  const items = dedupeMoodboardItems(collected, 18);

  return {
    queries: [...cleanQueries],
    items,
    providersUsed: [...providersUsed],
    generatedAt: new Date().toISOString(),
    warnings,
  };
}
