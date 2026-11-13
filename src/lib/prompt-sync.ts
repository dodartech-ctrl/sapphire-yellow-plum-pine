import { ADVANCED_GROUPS, EXTRA_PILLS, type Advanced } from "@/lib/dictionary";
import {
  ANNOTATOR_MODES,
  DETAIL_DENSITIES,
  ENHANCE_MODES,
  ESRGAN_MODELS,
  IPADAPTER_PRESETS,
  RENDER_FIDELITIES,
  SKETCH_MODES,
  WORKFLOW_PRESETS,
  type EngineState,
  type WorkflowPreset,
} from "@/lib/engines";
import { GROUPS, TAGS, type DesignState, type VerticalId } from "@/lib/properties";

const NEUTRAL_PICKS = new Set(["Unchanged", "None", "Keep", "none", "off", "Off"]);

const TARGET_LABELS: Record<string, string> = {
  whole: "All Elements",
  floor: "Flooring",
  wall: "Walls",
  ceiling: "Ceiling",
  furniture: "Furniture",
  fixture: "Lighting",
  openings: "Doors",
  kitchen: "Windows",
  decor: "Decor",
  facade: "Facade",
  roof: "Roof",
  windows: "Windows",
  entry: "Entrance",
  balcony: "Balcony",
  terrace: "Terrace",
  drive: "Driveway",
  water: "Water",
  wellness: "Wellness",
  social: "Social",
  sport: "Sport",
  outdoor: "Outdoor",
  family: "Family",
  work: "Work",
  security: "Arrival",
  trees: "Trees",
  planting: "Planting",
  lawn: "Lawn",
  garden: "Garden",
  path: "Paths",
  structure: "Structure",
  edge: "Boundary",
};

const DESIGN_FIELD_PREFIX: Record<
  "range" | "look" | "camera" | "light" | "mood" | "people" | "activity" | "color" | "weather" | "time" | "detail" | "strength",
  string
> = {
  range: "Range",
  look: "Style",
  camera: "Camera",
  light: "Light",
  mood: "Mood",
  people: "People",
  activity: "Activity",
  color: "Color",
  weather: "Weather",
  time: "Time",
  detail: "Detail",
  strength: "Strength",
};

const ADVANCED_PREFIX: Record<keyof Omit<Advanced, "extras">, string> = {
  light: "Atmosphere",
  air: "Air",
  season: "Season",
  change: "Allowed Change",
  grade: "Grade",
};

const IP_ADAPTER_REF_LABELS: Record<string, string> = {
  "/viz/p01-pavilion-dusk.jpg": "Concrete Ref",
  "/viz/t05-subtropical-home.jpg": "Timber Ref",
  "/viz/p02-loft-after.jpg": "Loft Ref",
};

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePromptText(text: string): string {
  return text
    .replace(/\s*\.\s*\./g, ".")
    .replace(/\.\s*,/g, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s.,;]+|[\s.,;]+$/g, "")
    .trim();
}

/**
 * Replaces or inserts a labeled slot clause (e.g. `Flooring: Travertine`) in-place
 * while preserving user-written notes, Mid-Layer snippets, and suggestions.
 */
export function upsertClauseInIdea(currentIdea: string, prefix: string, value: string | null): string {
  const cleanValue = value?.trim() ?? "";
  const clauseRegex = new RegExp(`(?:^|(?<=[.\\n;]))\\s*${escapeRegExp(prefix)}:\\s*[^.\\n;]+\\.?`, "i");
  const nextClause = cleanValue ? `${prefix}: ${cleanValue}` : "";

  if (clauseRegex.test(currentIdea)) {
    const replaced = currentIdea.replace(clauseRegex, (match) => {
      if (!nextClause) return "";
      const leadingSpace = /^\s/.test(match) ? " " : "";
      const trailingDot = match.trimEnd().endsWith(".") ? "." : "";
      return `${leadingSpace}${nextClause}${trailingDot}`;
    });
    return normalizePromptText(replaced);
  }

  const base = normalizePromptText(currentIdea);
  if (!nextClause) return base;
  if (!base) return nextClause;
  return `${base}. ${nextClause}`;
}

export function toggleTokenInIdea(currentIdea: string, token: string, enabled: boolean): string {
  const cleanToken = token.trim();
  if (!cleanToken) return normalizePromptText(currentIdea);

  const tokenRegex = new RegExp(`(?:^|(?<=[.\\s,;\\n]))${escapeRegExp(cleanToken)}(?=$|[.\\s,;\\n])`, "i");
  const exists = tokenRegex.test(currentIdea);

  if (!enabled) {
    if (!exists) return normalizePromptText(currentIdea);
    return normalizePromptText(currentIdea.replace(tokenRegex, ""));
  }

  if (exists) return normalizePromptText(currentIdea);
  const base = normalizePromptText(currentIdea);
  return base ? `${base}. ${cleanToken}` : cleanToken;
}

export function syncPickToIdea(currentIdea: string, vertical: VerticalId, groupId: string, value: string): string {
  const group = GROUPS[vertical].find((item) => item.id === groupId);
  const label = group?.label ?? groupId;
  const nextValue = NEUTRAL_PICKS.has(value) ? null : value;
  return upsertClauseInIdea(currentIdea, label, nextValue);
}

export function syncDesignFieldToIdea(
  currentIdea: string,
  field: keyof typeof DESIGN_FIELD_PREFIX,
  value: string,
): string {
  const prefix = DESIGN_FIELD_PREFIX[field];
  return upsertClauseInIdea(currentIdea, prefix, value);
}

export function syncTargetToIdea(currentIdea: string, target: string): string {
  const label = TARGET_LABELS[target] ?? target;
  return upsertClauseInIdea(currentIdea, "Target", label);
}

export function syncTagToIdea(currentIdea: string, tag: string, nextTags: readonly string[]): string {
  const isEnabled = nextTags.includes(tag);
  return toggleTokenInIdea(currentIdea, `#${tag}`, isEnabled);
}

export function syncAdvancedToIdea(
  currentIdea: string,
  key: keyof Omit<Advanced, "extras">,
  value: string,
): string {
  const prefix = ADVANCED_PREFIX[key];
  const group = ADVANCED_GROUPS.find((item) => item.key === key);
  const option = group?.options.find((item) => item.id === value);
  if (!option || option.id === "none") {
    return upsertClauseInIdea(currentIdea, prefix, null);
  }
  return upsertClauseInIdea(currentIdea, prefix, option.label);
}

export function syncExtraToIdea(currentIdea: string, extraId: string, nextExtras: readonly string[]): string {
  const pill = EXTRA_PILLS.find((item) => item.id === extraId);
  if (!pill) return normalizePromptText(currentIdea);
  const isEnabled = nextExtras.includes(extraId);
  return toggleTokenInIdea(currentIdea, pill.label, isEnabled);
}

export function syncWorkflowPresetToIdea(currentIdea: string, presetId: WorkflowPreset): string {
  const preset = WORKFLOW_PRESETS.find((item) => item.id === presetId);
  if (!preset) return currentIdea;
  return upsertClauseInIdea(currentIdea, "Workflow", preset.label);
}

export function syncEngineFieldToIdea<K extends keyof EngineState>(
  currentIdea: string,
  key: K,
  value: EngineState[K],
): string {
  switch (key) {
    case "renderFidelity": {
      const label = RENDER_FIDELITIES.find((f) => f.id === value)?.label ?? String(value);
      return upsertClauseInIdea(currentIdea, "Fidelity", label);
    }
    case "facadeTypology":
      return upsertClauseInIdea(currentIdea, "Facade Typology", String(value));
    case "climateRegion":
      return upsertClauseInIdea(currentIdea, "Climate", String(value));
    case "detailDensity": {
      const label = DETAIL_DENSITIES.find((d) => d.id === value)?.label ?? String(value);
      return upsertClauseInIdea(currentIdea, "Detail Density", label);
    }
    case "sketchMode": {
      const label = SKETCH_MODES.find((s) => s.id === value)?.label ?? String(value);
      return upsertClauseInIdea(currentIdea, "Sketch Mode", label);
    }
    case "enhanceMode": {
      const label = ENHANCE_MODES.find((e) => e.id === value)?.label ?? String(value);
      return upsertClauseInIdea(currentIdea, "Enhance", label);
    }
    case "annotatorMode": {
      if (value === "none") return upsertClauseInIdea(currentIdea, "Annotator", null);
      const label = ANNOTATOR_MODES.find((m) => m.id === value)?.label ?? String(value);
      return upsertClauseInIdea(currentIdea, "Annotator", label);
    }
    case "depthEnabled":
      return toggleTokenInIdea(currentIdea, "Depth-Anything-V2 Lock", Boolean(value));
    case "ipAdapterEnabled":
      return toggleTokenInIdea(currentIdea, "IP-Adapter Style Lock", Boolean(value));
    case "ipAdapterPreset": {
      const label = IPADAPTER_PRESETS.find((p) => p.id === value)?.label ?? String(value);
      return upsertClauseInIdea(currentIdea, "IP-Adapter", label);
    }
    case "ipAdapterRefUrl": {
      if (typeof value !== "string" || !value) return upsertClauseInIdea(currentIdea, "Style Ref", null);
      const label = IP_ADAPTER_REF_LABELS[value] ?? "Custom Ref";
      return upsertClauseInIdea(currentIdea, "Style Ref", label);
    }
    case "esrganModel": {
      const label = ESRGAN_MODELS.find((m) => m.id === value)?.label ?? String(value);
      return upsertClauseInIdea(currentIdea, "Upscaler", label);
    }
    case "esrganFaceEnhance":
      return toggleTokenInIdea(currentIdea, "Fixture & Edge Restore", Boolean(value));
    case "outputMode":
      return upsertClauseInIdea(currentIdea, "Output", value === "grid-4" ? "4-Up Grid" : "Single Plate");
    default:
      return currentIdea;
  }
}

export function hasKnownTagToken(tag: string): boolean {
  return (TAGS as readonly string[]).includes(tag);
}

export function buildIdeaResetPreview(design: DesignState): string {
  const parts = [
    design.look ? `Style: ${design.look}` : "",
    design.light ? `Light: ${design.light}` : "",
  ].filter(Boolean);
  return parts.join(". ");
}

const BUILDER_SLOT_PREFIX: Record<"style" | "lighting" | "mood" | "camera", string> = {
  style: "Style",
  lighting: "Lighting",
  mood: "Mood",
  camera: "Lens",
};

function conciseKeywordSnippet(snippet: string | undefined, maxClauses = 2): string {
  if (!snippet) return "";
  const parts = snippet
    .split(",")
    .map((p) => p.trim().replace(/\.+$/g, ""))
    .filter(Boolean)
    .slice(0, maxClauses);
  return parts.join(", ");
}

/**
 * Dynamically injects or removes a Brief Builder slot's architectural keywords
 * inside the live prompt/directives textarea while keeping manual notes intact.
 */
export function syncBuilderSlotToNotes(
  currentNotes: string,
  category: "style" | "lighting" | "mood" | "camera",
  block: { name: string; promptSnippet?: string } | null,
): string {
  const prefix = BUILDER_SLOT_PREFIX[category];
  if (!block) return upsertClauseInIdea(currentNotes, prefix, null);
  const snippet = conciseKeywordSnippet(block.promptSnippet, 2);
  const clauseVal = snippet ? `${block.name} (${snippet})` : block.name;
  return upsertClauseInIdea(currentNotes, prefix, clauseVal);
}

/**
 * Dynamically injects or removes an ARCHVIZ Dictionary block keyword phrase
 * when a pill button is clicked in Prompt Builder.
 */
export function toggleDictionaryBlockInNotes(
  currentNotes: string,
  blockLabel: string,
  enabled: boolean,
): string {
  const cleanLabel = blockLabel.trim().replace(/[.]/g, "");
  if (!cleanLabel) return currentNotes;
  return toggleTokenInIdea(currentNotes, cleanLabel, enabled);
}

/**
 * Injects a full ARCHVIZ Dictionary scenario preset summary cleanly in-place.
 */
export function syncDictionaryPresetToNotes(
  currentNotes: string,
  presetName: string,
  blockLabels: readonly string[],
): string {
  const cleanName = presetName.trim().replace(/[.]/g, "");
  const keywords = blockLabels
    .map((label) => label.trim().replace(/[.]/g, ""))
    .filter(Boolean)
    .slice(0, 4);
  const value = keywords.length > 0 ? `${cleanName} (${keywords.join(", ")})` : cleanName;
  return upsertClauseInIdea(currentNotes, "Scenario", value);
}

/**
 * Toggles an expert architectural keyword pill inside the prompt textarea cleanly.
 */
export function toggleKeywordPillInNotes(currentNotes: string, keyword: string): { notes: string; active: boolean } {
  const clean = keyword.trim();
  if (!clean) return { notes: currentNotes, active: false };
  const tokenRegex = new RegExp(`(?:^|(?<=[.\\s,;\\n]))${escapeRegExp(clean)}(?=$|[.\\s,;\\n])`, "i");
  const currentlyActive = tokenRegex.test(currentNotes);
  const nextNotes = toggleTokenInIdea(currentNotes, clean, !currentlyActive);
  return { notes: nextNotes, active: !currentlyActive };
}

export function buildInitialBuilderNotes(
  style: { name: string; promptSnippet?: string } | null,
  lighting: { name: string; promptSnippet?: string } | null,
  mood: { name: string; promptSnippet?: string } | null,
  camera: { name: string; promptSnippet?: string } | null,
): string {
  let out = "";
  out = syncBuilderSlotToNotes(out, "style", style);
  out = syncBuilderSlotToNotes(out, "lighting", lighting);
  out = syncBuilderSlotToNotes(out, "mood", mood);
  out = syncBuilderSlotToNotes(out, "camera", camera);
  return out;
}

