import zukeVizRaw from "./zuke-viz-prompts.json";
import type { VerticalId } from "./properties";

export type ZukeVizBatch = "Core" | "Batch 1" | "Batch 2" | "Batch 3" | "Batch 4";

export type ZukeVizPrompt = {
  id: string;
  number: number;
  title: string;
  category: string;
  prompt: string;
  originalPrompt: string | null;
  originalLanguage: "pt" | null;
  note: string | null;
  batch: ZukeVizBatch;
  sourceType: string;
  placeholders: string[];
  requiresReference: boolean;
  aspectRatio: "16:9" | "4:5" | "3:2" | "3:4" | "9:16" | "1:1" | null;
};

export const ZUKE_VIZ_PROMPTS_119: readonly ZukeVizPrompt[] = zukeVizRaw as ZukeVizPrompt[];

export const ZUKE_VIZ_CATEGORIES_14: readonly string[] = [
  "All",
  ...Array.from(new Set(ZUKE_VIZ_PROMPTS_119.map((item) => item.category))),
];

export const ZUKE_VIZ_BATCHES: readonly ("All" | ZukeVizBatch)[] = [
  "All",
  "Core",
  "Batch 1",
  "Batch 2",
  "Batch 3",
  "Batch 4",
];

export function filterZukeViz119(
  query: string,
  category = "All",
  options?: { batch?: "All" | ZukeVizBatch; requiresReference?: "all" | "ref" | "text" },
): ZukeVizPrompt[] {
  const q = query.trim().toLowerCase();
  const batch = options?.batch ?? "All";
  const req = options?.requiresReference ?? "all";

  return ZUKE_VIZ_PROMPTS_119.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (batch !== "All" && item.batch !== batch) return false;
    if (req === "ref" && !item.requiresReference) return false;
    if (req === "text" && item.requiresReference) return false;
    if (!q) return true;
    const hay = `${item.id} ${item.title} ${item.category} ${item.prompt} ${item.originalPrompt ?? ""} ${item.note ?? ""} ${item.batch} ${item.sourceType}`.toLowerCase();
    return hay.includes(q);
  });
}

export function fillZukePromptPlaceholders(
  prompt: string,
  values: Record<string, string>,
): string {
  return prompt.replace(/\[([^\]]+)\]/g, (full, key: string) => {
    const trimmedKey = key.trim();
    const replacement = values[trimmedKey]?.trim();
    return replacement ? replacement : full;
  });
}

export function inferZukeVertical(item: ZukeVizPrompt): VerticalId {
  const hay = `${item.category} ${item.title} ${item.prompt}`.toLowerCase();
  if (
    item.category === "Landscape & Site" ||
    /\b(courtyard|garden|rooftop terrace|planting|landscape|site analysis)\b/.test(hay)
  ) {
    return "landscape";
  }
  if (
    /\b(amenity|pool|clubhouse|restaurant|lounge|lobby|hotel|bar|gym)\b/.test(hay)
  ) {
    return "amenities";
  }
  if (
    item.category === "Interior · Room by Room" ||
    item.category === "Layouts & Space Planning" ||
    /\b(living room|kitchen|bedroom|interior|apartment|floor plan|floorplan|studio|staging|cabinet|millwork|dining room|penthouse|office)\b/.test(hay)
  ) {
    return "interior";
  }
  return "exterior";
}
