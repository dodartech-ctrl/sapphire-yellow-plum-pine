import type { BuilderBlock, VisionDocument } from "@/lib/builder-data";
import type { EngineState, Scene3DState } from "@/lib/engines";
import type { DesignState } from "@/lib/properties";

export type MoodboardFacet = "Architecture" | "Lighting" | "Materiality" | "Custom";

export interface MoodboardQuerySpec {
  facet: MoodboardFacet;
  query: string;
  fallbackQuery?: string;
  label: string;
}

export interface MoodboardImageItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  fullUrl: string;
  sourceUrl: string;
  creator: string;
  license: string;
  provider: "Openverse" | "Wikimedia Commons";
  facet: MoodboardFacet;
  queryUsed: string;
  width: number;
  height: number;
  tags: string[];
}

export interface MoodboardGenerationResult {
  queries: MoodboardQuerySpec[];
  items: MoodboardImageItem[];
  providersUsed: string[];
  generatedAt: string;
  warnings: string[];
}

const NOISE_WORDS = new Set([
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
  "bespoke",
]);

const OFF_TOPIC_TAG_WORDS = new Set([
  "painting",
  "flower",
  "flowers",
  "vase",
  "portrait",
  "selfie",
  "cat",
  "dog",
  "food",
]);

export function cleanArchitecturalQueryText(raw: string, maxWords = 4): string {
  const tokens = raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(
      (t) =>
        t.length >= 3 &&
        !NOISE_WORDS.has(t) &&
        !/^\d+k?$/.test(t) &&
        !/^\d+mm$/.test(t),
    );

  const seen = new Set<string>();
  const unique: string[] = [];
  for (const token of tokens) {
    if (seen.has(token)) continue;
    seen.add(token);
    unique.push(token);
    if (unique.length >= maxWords) break;
  }
  return unique.join(" ");
}

function mapStyleToSearchPhrase(style: BuilderBlock | null, facadeTypology: string, vertical: string): string {
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

function mapLightingToSearchPhrase(lighting: BuilderBlock | null, lightField: string): string {
  if (lighting?.id === "blue-hour-twilight") return "twilight building architecture";
  if (lighting?.id === "golden-hour-raking") return "sunset facade architecture";
  if (lighting?.id === "soft-overcast-diffused") return "courtyard pavilion architecture";
  if (lighting?.id === "dramatic-chiaroscuro") return "concrete shadow architecture";

  const fromLight = cleanArchitecturalQueryText(`${lighting?.name ?? ""} ${lightField}`, 2);
  return fromLight ? `${fromLight} architecture` : "daylight modern architecture";
}

function mapMaterialToSearchPhrase(
  primaryMaterial: string,
  style: BuilderBlock | null,
  customNotes: string,
): string {
  const matTokens = cleanArchitecturalQueryText(
    `${primaryMaterial} ${style?.materials?.[0] ?? ""} ${customNotes}`,
    2,
  );
  return matTokens ? `${matTokens} facade architecture` : `${primaryMaterial} architecture`;
}

export function parseBriefToMoodboardQueries(args: {
  visionDoc: Pick<VisionDocument, "title" | "synthesizedPrompt">;
  selectedStyle: BuilderBlock | null;
  selectedLighting: BuilderBlock | null;
  selectedMood: BuilderBlock | null;
  design: Pick<DesignState, "vertical" | "look" | "light">;
  engine: Pick<EngineState, "facadeTypology" | "climateRegion">;
  scene3d: Pick<Scene3DState, "primaryMaterial">;
  customNotes: string;
  customQueryOverride?: string;
}): MoodboardQuerySpec[] {
  const override = args.customQueryOverride?.trim();
  if (override) {
    const cleaned = cleanArchitecturalQueryText(override, 4) || override.slice(0, 64);
    return [
      {
        facet: "Custom",
        label: `Custom · ${override.slice(0, 32)}`,
        query: cleaned.includes("architect") ? cleaned : `${cleaned} architecture`,
        fallbackQuery: "modern architecture",
      },
    ];
  }

  const archQuery = mapStyleToSearchPhrase(
    args.selectedStyle,
    args.engine.facadeTypology,
    args.design.vertical,
  );
  const lightQuery = mapLightingToSearchPhrase(args.selectedLighting, args.design.light);
  const materialQuery = mapMaterialToSearchPhrase(
    args.scene3d.primaryMaterial,
    args.selectedStyle,
    args.customNotes,
  );

  const queries: MoodboardQuerySpec[] = [
    {
      facet: "Architecture",
      label: args.selectedStyle?.name ?? args.engine.facadeTypology,
      query: archQuery,
      fallbackQuery: "modern concrete glass architecture",
    },
    {
      facet: "Lighting",
      label: args.selectedLighting?.name ?? args.design.light,
      query: lightQuery,
      fallbackQuery: "modern architectural facade",
    },
    {
      facet: "Materiality",
      label: `${args.scene3d.primaryMaterial} & materiality`,
      query: materialQuery,
      fallbackQuery: `${args.scene3d.primaryMaterial} building architecture`,
    },
  ];

  const used = new Set<string>();
  return queries.filter((q) => {
    const key = q.query.toLowerCase();
    if (used.has(key)) return false;
    used.add(key);
    return true;
  });
}

export function normalizeOpenverseResult(
  raw: Record<string, unknown>,
  facet: MoodboardFacet,
  queryUsed: string,
): MoodboardImageItem | null {
  const id = typeof raw.id === "string" ? raw.id : "";
  const url = typeof raw.url === "string" ? raw.url : "";
  const thumbnail = typeof raw.thumbnail === "string" && raw.thumbnail ? raw.thumbnail : url;
  if (!id || (!thumbnail && !url)) return null;
  if (!/^https?:\/\//i.test(thumbnail) || !/^https?:\/\//i.test(url || thumbnail)) return null;

  const width = typeof raw.width === "number" ? raw.width : 0;
  const height = typeof raw.height === "number" ? raw.height : 0;
  if (width > 0 && width < 220) return null;

  const rawTitle = typeof raw.title === "string" ? raw.title.trim() : "";
  const title = rawTitle.replace(/\s+/g, " ").slice(0, 96) || "Architectural Reference";
  const creator =
    typeof raw.creator === "string" && raw.creator.trim()
      ? raw.creator.trim().slice(0, 60)
      : "Public Archive";
  const license =
    typeof raw.license === "string" && raw.license.trim()
      ? raw.license.toUpperCase()
      : "CC";
  const sourceUrl =
    typeof raw.foreign_landing_url === "string" && /^https?:\/\//i.test(raw.foreign_landing_url)
      ? raw.foreign_landing_url
      : url || thumbnail;

  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .map((t) => (typeof t === "object" && t && typeof (t as { name?: unknown }).name === "string" ? (t as { name: string }).name : ""))
        .filter(Boolean)
        .slice(0, 5)
    : [];

  const titleLower = title.toLowerCase();
  if (
    tags.some((t) => OFF_TOPIC_TAG_WORDS.has(t.toLowerCase())) ||
    /\b(flower|bouquet|painting|still items)\b/i.test(titleLower)
  ) {
    return null;
  }

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
    tags,
  };
}

export function normalizeWikimediaPage(
  page: Record<string, unknown>,
  facet: MoodboardFacet,
  queryUsed: string,
): MoodboardImageItem | null {
  const pageId = typeof page.pageid === "number" || typeof page.pageid === "string" ? String(page.pageid) : "";
  const imageInfoList = Array.isArray(page.imageinfo) ? (page.imageinfo as Array<Record<string, unknown>>) : [];
  const info = imageInfoList[0];
  if (!pageId || !info) return null;

  const mime = typeof info.mime === "string" ? info.mime.toLowerCase() : "";
  if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(mime)) {
    return null;
  }

  const thumb = typeof info.thumburl === "string" ? info.thumburl : "";
  const full = typeof info.url === "string" ? info.url : thumb;
  const thumbnailUrl = thumb || full;
  if (!/^https?:\/\//i.test(thumbnailUrl)) return null;

  const width = typeof info.width === "number" ? info.width : 800;
  const height = typeof info.height === "number" ? info.height : 600;
  if (width < 320 || height < 220) return null;

  const rawTitle = typeof page.title === "string" ? page.title : "";
  const cleanTitle = rawTitle
    .replace(/^File:/i, "")
    .replace(/\.(jpg|jpeg|png|webp|tif|tiff)$/i, "")
    .replace(/_/g, " ")
    .trim()
    .slice(0, 96);

  const ext = (typeof info.extmetadata === "object" && info.extmetadata
    ? (info.extmetadata as Record<string, { value?: string }>)
    : {}) as Record<string, { value?: string }>;

  const stripHtml = (s?: string) => (s ? s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "");
  const creator = stripHtml(ext.Artist?.value).slice(0, 60) || "Wikimedia Contributor";
  const license = stripHtml(ext.LicenseShortName?.value).slice(0, 24) || "CC";
  const sourceUrl =
    typeof info.descriptionurl === "string" && /^https?:\/\//i.test(info.descriptionurl)
      ? info.descriptionurl
      : full;

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
    tags: [],
  };
}

export function dedupeMoodboardItems(items: readonly MoodboardImageItem[], limit = 12): MoodboardImageItem[] {
  const seenUrls = new Set<string>();
  const seenIds = new Set<string>();
  const seenTitleCreator = new Set<string>();
  const out: MoodboardImageItem[] = [];
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

export function formatReferenceNoteFromImage(item: MoodboardImageItem): string {
  return `Reference inspiration (${item.facet}): ${item.title} [${item.provider} · ${item.license}]`;
}
