import rawBlocks from "./prompt-blocks.json";
import type { Advanced } from "./dictionary";
import type { EngineState, Scene3DState } from "./engines";
import type { DesignState } from "./properties";

export const DICTIONARY_SECTIONS = [
  "GOAL",
  "SOURCE / INPUT",
  "MUST PRESERVE",
  "ALLOWED CHANGES",
  "MATERIAL / SUBJECT",
  "LIGHT / ATMOSPHERE",
  "CAMERA / PHOTOGRAPHY",
  "RESTRICTIONS",
  "QC",
] as const;

export type DictionarySection = (typeof DICTIONARY_SECTIONS)[number];

export type DictionaryBlock = {
  id: string;
  en: string;
  category: string;
  section: string;
  text: string;
  parameters: Record<string, string>;
  conflicts: string[];
};

export const DICTIONARY_BLOCKS: readonly DictionaryBlock[] = rawBlocks as DictionaryBlock[];

const BLOCKS_BY_ID = new Map(DICTIONARY_BLOCKS.map((block) => [block.id, block]));

export type ArchvizPresetGroup =
  | "Core Edit"
  | "Context & Seasons"
  | "Grade & HDRI"
  | "Cinema Directors"
  | "Photography"
  | "Controlled Reference"
  | "Marketing & Heritage"
  | "3D Asset & Video";

export type ArchvizPreset = {
  id: string;
  name: string;
  group: ArchvizPresetGroup;
  blocks: string[];
};

/**
 * Complete 46 scenario presets imported from lutiy-dev/ARCHVIZ-Prompt-Dictionary-Builder.
 */
export const ARCHVIZ_PRESETS: readonly ArchvizPreset[] = [
  // Core Edit
  { id: "facade", name: "Facade", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "facade", "brick", "overcast"] },
  { id: "road", name: "Road", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "road", "overcast"] },
  { id: "greenery", name: "Greenery", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "greenery"] },
  { id: "people", name: "People", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "people"] },
  { id: "interior", name: "Interior", group: "Core Edit", blocks: ["interior", "source", "geometry", "windows", "photo", "exclude", "qc"] },
  { id: "exterior", name: "Exterior", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "overcast"] },
  { id: "final-polish", name: "Final Polish", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "polish"] },
  { id: "material-study", name: "Material Study", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "facade", "limestone"] },
  { id: "day-→-night", name: "Day → Night", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "night"] },
  { id: "portfolio-polish", name: "Portfolio Polish", group: "Core Edit", blocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc", "polish", "overcast"] },

  // Context & Seasons
  { id: "environment-context", name: "Environment / Context", group: "Context & Seasons", blocks: ["goal", "source", "geometry", "windows", "mask", "environment-extension", "context-description", "match-source-lighting", "photo", "perspective-scale-match", "context-restrictions", "environment-qc", "final-cleanup"] },
  { id: "night-lighting", name: "Night / Existing Sources", group: "Context & Seasons", blocks: ["goal", "source", "geometry", "windows", "night", "night-windows", "night-street-sources", "night-headlights", "photo", "exclude", "qc", "night-source-qc"] },
  { id: "people-insertion", name: "Add People", group: "Context & Seasons", blocks: ["goal", "source", "geometry", "windows", "mask", "add-people", "people-integration", "photo", "perspective-scale-match", "exclude", "qc", "add-people-qc"] },
  { id: "season-spring", name: "Spring", group: "Context & Seasons", blocks: ["goal", "source", "geometry", "windows", "mask", "photo", "exclude", "qc", "spring", "final-cleanup"] },
  { id: "season-summer", name: "Summer", group: "Context & Seasons", blocks: ["goal", "source", "geometry", "windows", "mask", "photo", "exclude", "qc", "summer", "final-cleanup"] },
  { id: "season-autumn", name: "Autumn", group: "Context & Seasons", blocks: ["goal", "source", "geometry", "windows", "mask", "photo", "exclude", "qc", "autumn", "autumn-fallen-leaves", "final-cleanup"] },
  { id: "season-winter", name: "Winter", group: "Context & Seasons", blocks: ["goal", "source", "geometry", "windows", "mask", "photo", "exclude", "qc", "winter", "added-snow-cover", "final-cleanup"] },
  { id: "material-id-map", name: "Material ID Map", group: "Context & Seasons", blocks: ["material-id-goal", "source", "material-id-preserve", "material-id-rules", "material-id-classes", "material-id-restrictions", "material-id-qc"] },

  // Grade & HDRI
  { id: "hdri-realism", name: "HDRI Realism", group: "Grade & HDRI", blocks: ["hdri-realism-positive", "hdri-realism-negative"] },
  { id: "hero-photo-clean", name: "HERO PHOTO CLEAN", group: "Grade & HDRI", blocks: ["hero-photo-clean-positive", "hero-photo-clean-negative"] },
  { id: "hero-photo-dramatic", name: "HERO PHOTO DRAMATIC", group: "Grade & HDRI", blocks: ["hero-photo-dramatic-positive", "hero-photo-dramatic-negative"] },
  { id: "hero-sunset-gold", name: "HERO SUNSET GOLD", group: "Grade & HDRI", blocks: ["hero-sunset-gold-positive", "hero-sunset-gold-negative"] },

  // Cinema Directors
  { id: "director-villeneuve", name: "DIRECTOR · Monumental Atmospheric Cinema", group: "Cinema Directors", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "cinema-villeneuve"] },
  { id: "director-anderson", name: "DIRECTOR · Graphic Pastel Cinema", group: "Cinema Directors", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "cinema-anderson"] },
  { id: "director-nolan", name: "DIRECTOR · Natural Epic Cinema", group: "Cinema Directors", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "cinema-nolan"] },
  { id: "director-fincher", name: "DIRECTOR · Precision Low-Key Cinema", group: "Cinema Directors", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "cinema-fincher"] },
  { id: "director-scott", name: "DIRECTOR · Layered Night Cinema", group: "Cinema Directors", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "cinema-scott"] },
  { id: "director-malick", name: "DIRECTOR · Golden-Hour Naturalism", group: "Cinema Directors", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "cinema-malick"] },

  // Photography
  { id: "photography-editorial-modernist", name: "PHOTO · Modernist Editorial", group: "Photography", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "photo-editorial-modernist"] },
  { id: "photography-sculptural-shadows", name: "PHOTO · Sculptural Shadows", group: "Photography", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "photo-sculptural-shadows"] },
  { id: "photography-documentary-context", name: "PHOTO · Documentary Context", group: "Photography", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "photo-documentary-context"] },
  { id: "photography-warm-human-scale", name: "PHOTO · Human-Centered Scale", group: "Photography", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "photo-warm-human-scale"] },

  // Controlled Reference
  { id: "controlled-custom-material", name: "CONTROL · Custom Material", group: "Controlled Reference", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "custom-material", "upscale-safety"] },
  { id: "controlled-material-reference", name: "CONTROL · Material Reference", group: "Controlled Reference", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "custom-material", "reference-material"] },
  { id: "controlled-reference-light", name: "CONTROL · Reference Lighting", group: "Controlled Reference", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "reference-lighting", "custom-grading"] },
  { id: "controlled-multi-reference", name: "CONTROL · Multi-Reference", group: "Controlled Reference", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "multi-reference-roles", "custom-art-direction"] },
  { id: "controlled-photorealism", name: "CONTROL · Photorealism Recovery", group: "Controlled Reference", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "photorealism-recovery", "upscale-safety"] },
  { id: "controlled-multi-view", name: "CONTROL · Multi-View Consistency", group: "Controlled Reference", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "multiview-consistency"] },
  { id: "controlled-art-direction", name: "CONTROL · Custom Art Direction", group: "Controlled Reference", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "custom-art-direction", "custom-light", "custom-atmosphere", "custom-grading"] },

  // Marketing & Heritage
  { id: "marketing-developer", name: "MARKETING · Developer Hero", group: "Marketing & Heritage", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "developer-story", "photo-documentary-context"] },
  { id: "heritage-context", name: "HERITAGE · Protected Context", group: "Marketing & Heritage", blocks: ["goal", "source", "geometry", "windows", "exclude", "qc", "heritage-protection", "photo-sculptural-shadows"] },

  // 3D Asset & Video
  { id: "object-3d-asset", name: "Object / 3D Asset", group: "3D Asset & Video", blocks: ["asset-goal", "asset-reference", "asset-shape", "asset-material", "microdetail", "roughness-variation", "soft-diffused-light", "asset-view", "asset-background", "asset-qc", "final-cleanup"] },
  { id: "archviz-video", name: "Archviz Image-to-Video", group: "3D Asset & Video", blocks: ["video-arch-goal", "video-reference", "video-arch-preserve", "video-motion", "exclude", "video-stability"] },
  { id: "object-video", name: "Object Video", group: "3D Asset & Video", blocks: ["video-object-goal", "video-reference", "asset-shape", "video-motion", "video-stability"] },
  { id: "first-last-video", name: "First → Last Frame Video", group: "3D Asset & Video", blocks: ["first-last-goal", "first-last-reference", "video-arch-preserve", "first-last-transition", "first-last-camera", "video-stability"] },
  { id: "video-art-direction", name: "VIDEO · Camera & Environment", group: "3D Asset & Video", blocks: ["video-arch-goal", "video-arch-preserve", "video-motion-custom", "video-environment-custom", "video-temporal-qc"] },
];

export type MidLayerPreset = {
  id: string;
  pillLabel: string;
  title: string;
  badge: string;
  description: string;
  promptSnippet: string;
  blockIds: string[];
  parameters?: Record<string, Record<string, string>>;
  designPatch?: Partial<Pick<DesignState, "light" | "mood" | "weather" | "time" | "strength">>;
  advancedPatch?: Partial<Advanced>;
  enginePatch?: Partial<EngineState>;
  scene3dPatch?: Partial<Scene3DState>;
};

/**
 * Simple 1-click Mid-Layer Presets bridging Base Geometry (3D/Sketch/ControlNet)
 * and Final Visual Rendering (Materials, Atmosphere, Preservation & QC).
 */
export const MID_LAYER_PRESETS: readonly MidLayerPreset[] = [
  {
    id: "preserve-shell",
    pillLabel: "Preserve",
    title: "Architecture Shell Lock",
    badge: "Mid · Geometry",
    description: "Strict structural retention across floors, openings, camera lines, and mullions.",
    promptSnippet:
      "Strict architecture shell lock: preserve exact building geometry, floor count, window mullions, and camera perspective.",
    blockIds: ["goal", "source", "geometry", "windows", "exclude", "qc"],
    advancedPatch: { change: "none" },
    enginePatch: { geometryLock: 94, annotatorMode: "mlsd", depthEnabled: true, depthWeight: 78, edgeAdherence: 88 },
  },
  {
    id: "facade-swap",
    pillLabel: "Facade",
    title: "Facade Material Restyle",
    badge: "Mid · Surface",
    description: "Re-clad opaque exterior walls while locking window openings, joints, and perspective.",
    promptSnippet:
      "Facade material restyle: re-clad opaque exterior surfaces in authentic true-scale stone and timber joinery while keeping glazing and openings unchanged.",
    blockIds: ["goal", "source", "geometry", "windows", "facade", "custom-material", "upscale-safety", "qc"],
    parameters: {
      "custom-material": {
        material: "primary exterior cladding",
        treatment: "true-scale stone & timber grain with crisp mortar joints",
      },
    },
    advancedPatch: { change: "facade" },
    enginePatch: { geometryLock: 88, materialOverride: 78, annotatorMode: "canny", styleTransferWeight: 72 },
  },
  {
    id: "material-id",
    pillLabel: "Mat-ID",
    title: "Material ID Segmentation",
    badge: "Mid · Mask",
    description: "Separates facade, glazing, frames, roof, stone, and foliage for clean masking passes.",
    promptSnippet:
      "Material ID pass: lock clean architectural region boundaries across facade walls, glazing, trim, foliage, water, and paving.",
    blockIds: ["material-id-goal", "source", "material-id-preserve", "material-id-rules", "material-id-classes", "material-id-qc"],
    enginePatch: { geometryLock: 96, annotatorMode: "softedge", depthEnabled: true, samThreshold: 52 },
  },
  {
    id: "golden-relight",
    pillLabel: "Golden",
    title: "Golden Hour Relight",
    badge: "Mid · Light",
    description: "Warm low-angle sunlight with cool ambient fill, elongated shadows, and clean rolloff.",
    promptSnippet:
      "Golden hour relight: warm low-angle sunlight casting elongated natural shadows with cool ambient fill and smooth highlight rolloff.",
    blockIds: ["goal", "source", "geometry", "windows", "golden-hour", "hero-sunset-gold-positive", "hero-sunset-gold-negative", "highlight-rolloff"],
    designPatch: { light: "Golden hour", time: "Golden hour", mood: "Warm" },
    advancedPatch: { light: "golden-hour", grade: "hero-sunset-gold" },
    scene3dPatch: { d5LightPreset: "golden", sunAzimuth: 242, sunElevation: 16, exposure: 1.15 },
  },
  {
    id: "night-glow",
    pillLabel: "Night",
    title: "Night & Interior Glow",
    badge: "Mid · Night",
    description: "Physically motivated night fixtures, selective warm windows, and balanced blue sky.",
    promptSnippet:
      "Night & interior glow: deep blue-hour sky with selective warm 2700K interior window illumination and physically motivated exterior fixtures.",
    blockIds: ["goal", "source", "geometry", "windows", "night", "night-windows", "night-street-sources", "night-source-qc", "exclude"],
    designPatch: { light: "Night", time: "Night", mood: "Dramatic" },
    advancedPatch: { light: "night" },
    scene3dPatch: { d5LightPreset: "blue-hour", sunAzimuth: 278, sunElevation: 6, exposure: 1.24 },
  },
  {
    id: "seasonal-shift",
    pillLabel: "Season",
    title: "Autumn & Foliage Micro-Pass",
    badge: "Mid · Bio",
    description: "Transforms seasonal leaves and site planting without altering plant count or silhouettes.",
    promptSnippet:
      "Autumn seasonal shift: crisp golden-amber foliage and subtle fallen leaves on paving while preserving existing plant placement and massing.",
    blockIds: ["goal", "source", "geometry", "windows", "autumn", "autumn-fallen-leaves", "natural-greenery-detail", "final-cleanup"],
    designPatch: { mood: "Serene", weather: "Clear" },
    advancedPatch: { season: "autumn", change: "greenery" },
  },
  {
    id: "context-extend",
    pillLabel: "Extend",
    title: "Site Context Extension",
    badge: "Mid · Urban",
    description: "Extends surrounding urban fabric and landscape matching horizon and source daylight.",
    promptSnippet:
      "Site context extension: seamlessly extend surrounding urban context, streetscape, and mature planting matched to source daylight and perspective.",
    blockIds: ["goal", "source", "geometry", "windows", "environment-extension", "context-description", "perspective-scale-match", "match-source-lighting", "environment-qc"],
    advancedPatch: { air: "light-haze" },
    enginePatch: { geometryLock: 86, depthEnabled: true, depthWeight: 72 },
  },
  {
    id: "heritage-guard",
    pillLabel: "Heritage",
    title: "Heritage & Stone Guard",
    badge: "Mid · Historic",
    description: "Locks historical moldings, stone blocks, and patinated edges against invented ornaments.",
    promptSnippet:
      "Heritage stone guard: faithfully preserve historic masonry joints, stone cornices, patina, and sculptural facade shadows without modern clutter.",
    blockIds: ["goal", "source", "geometry", "windows", "heritage-protection", "stone-detail", "edge-wear", "photo-sculptural-shadows", "qc"],
    designPatch: { mood: "Quiet" },
    advancedPatch: { grade: "photo-sculptural-shadows" },
    enginePatch: { geometryLock: 95, annotatorMode: "lineart", esrganFaceEnhance: true },
  },
  {
    id: "cinema-look",
    pillLabel: "Cinema",
    title: "Editorial Cinema Grade",
    badge: "Mid · Film",
    description: "Monumental color separation and atmospheric depth without mutating geometry.",
    promptSnippet:
      "Editorial cinema grade: monumental atmospheric haze, dramatic cloud depth, sculpted contrast, and disciplined architectural framing.",
    blockIds: ["goal", "source", "geometry", "windows", "cinema-villeneuve", "dramatic-clouds", "subtle-aerial-perspective", "editorial-architecture", "qc"],
    designPatch: { mood: "Dramatic" },
    advancedPatch: { grade: "cinema-villeneuve", air: "dramatic-clouds" },
    enginePatch: { mjStylize: 280, renderFidelity: "editorial" },
  },
  {
    id: "photoreal-recovery",
    pillLabel: "Recover",
    title: "De-CGI Photoreal Recovery",
    badge: "Mid · Polish",
    description: "Removes synthetic CG shine with realistic roughness variation, pores, and safe 2x detail.",
    promptSnippet:
      "De-CGI photoreal recovery: eliminate synthetic CG gloss with physical roughness variation, subtle edge wear, and crisp micro-surface detail.",
    blockIds: ["goal", "source", "geometry", "windows", "photorealism-recovery", "upscale-safety", "microdetail", "roughness-variation", "final-cleanup"],
    advancedPatch: { extras: ["microdetail", "final-cleanup"] },
    enginePatch: { geometryLock: 91, esrganModel: "4x-ArchSharp", esrganFaceEnhance: true, enhanceMode: "micro-detail" },
  },
];

export type DictionaryConflict = {
  a: string;
  b: string;
  labelA: string;
  labelB: string;
};

export type ComposedDictionaryResult = {
  text: string;
  keptIds: string[];
  warnings: DictionaryConflict[];
  activeParamBlocks: {
    blockId: string;
    label: string;
    parameters: Record<string, string>;
  }[];
};

export function getDictionaryBlock(id: string): DictionaryBlock | undefined {
  return BLOCKS_BY_ID.get(id);
}

export function getPresetById(id: string): ArchvizPreset | undefined {
  return ARCHVIZ_PRESETS.find((preset) => preset.id === id);
}

export function getMidLayerPresetById(id: string): MidLayerPreset | undefined {
  return MID_LAYER_PRESETS.find((preset) => preset.id === id);
}

/**
 * Updates the visible user prompt text when toggling or switching a 1-click
 * Mid-Layer Preset pill, preserving any user-written prompt directives.
 */
export function applyMidLayerPromptToIdea(
  currentIdea: string,
  nextPreset: MidLayerPreset | null,
): string {
  let cleaned = currentIdea.trim();
  for (const preset of MID_LAYER_PRESETS) {
    if (cleaned.includes(preset.promptSnippet)) {
      cleaned = cleaned.replace(preset.promptSnippet, "");
    }
  }
  cleaned = cleaned
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s.,;]+|[\s.,;]+$/g, "")
    .trim();

  if (!nextPreset) return cleaned;
  if (!cleaned) return nextPreset.promptSnippet;
  return `${cleaned}. ${nextPreset.promptSnippet}`;
}

export function appendSuggestionToIdea(currentIdea: string, suggestion: string): string {
  const base = currentIdea.trim();
  const next = suggestion.trim();
  if (!next) return base;
  if (!base) return next;
  if (base.toLowerCase().includes(next.toLowerCase())) return base;
  return `${base.replace(/[.;,\s]+$/, "")}. ${next}.`;
}

/**
 * Port of ARCHVIZ-Prompt-Dictionary-Builder/src/composer.mjs:
 * interpolates {{key}} parameters, deduplicates lines per section,
 * and reports pairwise block conflicts cleanly.
 */
export function composeDictionarySelection(
  blockIds: readonly string[],
  paramOverrides: Record<string, Record<string, string>> = {},
  extraDirective = "",
): ComposedDictionaryResult {
  const uniqueIds: string[] = [];
  for (const id of blockIds) {
    if (id && id !== "none" && !uniqueIds.includes(id) && BLOCKS_BY_ID.has(id)) {
      uniqueIds.push(id);
    }
  }

  const chosenSet = new Set(uniqueIds);
  const warnings: DictionaryConflict[] = [];
  const seenPairs = new Set<string>();

  for (const id of uniqueIds) {
    const block = BLOCKS_BY_ID.get(id);
    if (!block) continue;
    for (const conflictId of block.conflicts) {
      if (!chosenSet.has(conflictId)) continue;
      const pairKey = id < conflictId ? `${id}::${conflictId}` : `${conflictId}::${id}`;
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);
      const other = BLOCKS_BY_ID.get(conflictId);
      warnings.push({
        a: id,
        b: conflictId,
        labelA: block.en || id,
        labelB: other?.en || conflictId,
      });
    }
  }

  const groups = new Map<string, string[]>();
  const seenLines = new Set<string>();
  const activeParamBlocks: ComposedDictionaryResult["activeParamBlocks"] = [];

  for (const id of uniqueIds) {
    const block = BLOCKS_BY_ID.get(id);
    if (!block) continue;

    const mergedParams: Record<string, string> = { ...block.parameters };
    const override = paramOverrides[id];
    if (override) {
      for (const [k, v] of Object.entries(override)) {
        if (k in block.parameters && typeof v === "string") {
          mergedParams[k] = v;
        }
      }
    }

    if (Object.keys(block.parameters).length > 0) {
      activeParamBlocks.push({
        blockId: id,
        label: block.en || id,
        parameters: mergedParams,
      });
    }

    const interpolated = block.text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const val = mergedParams[key];
      return typeof val === "string" && val.trim() ? val.trim() : (block.parameters[key] ?? "");
    });

    const norm = interpolated.trim().replace(/\s+/g, " ").toLowerCase();
    if (!norm || seenLines.has(norm)) continue;
    seenLines.add(norm);

    const bucket = groups.get(block.section) ?? [];
    bucket.push(interpolated.trim());
    groups.set(block.section, bucket);
  }

  const sectionsOut: string[] = [];
  for (const section of DICTIONARY_SECTIONS) {
    const lines = groups.get(section);
    if (!lines?.length) continue;
    sectionsOut.push(`${section}\n${lines.join("\n")}`);
  }

  if (extraDirective.trim()) {
    sectionsOut.push(`STUDIO DIRECTIVES\n${extraDirective.trim()}`);
  }

  return {
    text: sectionsOut.join("\n\n").trim(),
    keptIds: uniqueIds,
    warnings,
    activeParamBlocks,
  };
}

export type SavedDictionaryPrompt = {
  id: string;
  name: string;
  scenario: string;
  text: string;
  blockIds: string[];
  parameters: Record<string, Record<string, string>>;
  createdAt: string;
};

export type SavedDictionaryBundle = {
  schema_version: 1;
  prompts: SavedDictionaryPrompt[];
};

const PRESET_IDS = new Set(ARCHVIZ_PRESETS.map((p) => p.id));

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Validates & normalizes Saved Prompts JSON compatible with
 * ARCHVIZ-Prompt-Dictionary-Builder's prompt-transfer.mjs (schema_version: 1).
 */
export function validateSavedPromptsBundle(value: unknown): SavedDictionaryBundle {
  if (!isPlainObject(value) || value.schema_version !== 1 || !Array.isArray(value.prompts) || value.prompts.length > 500) {
    throw new Error("Invalid Saved Prompts JSON format (expected schema_version: 1).");
  }
  const seenIds = new Set<string>();
  const prompts: SavedDictionaryPrompt[] = value.prompts.map((raw) => {
    if (!isPlainObject(raw)) throw new Error("Invalid prompt entry.");
    const id = typeof raw.id === "string" ? raw.id.trim() : "";
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const scenario = typeof raw.scenario === "string" ? raw.scenario.trim() : "facade";
    const text = typeof raw.text === "string" ? raw.text : "";
    const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString();

    if (!id || id.length > 100 || seenIds.has(id)) throw new Error("Duplicate or invalid prompt ID.");
    if (!name || name.length > 100) throw new Error("Invalid prompt name.");
    if (!text.trim() || text.length > 100000) throw new Error("Invalid prompt text.");
    if (!Array.isArray(raw.blockIds) || raw.blockIds.length === 0 || raw.blockIds.length > 200) {
      throw new Error("Prompt entry must include 1-200 blockIds.");
    }

    seenIds.add(id);
    const blockIds: string[] = [];
    const parameters: Record<string, Record<string, string>> = {};
    const rawParams = isPlainObject(raw.parameters) ? raw.parameters : {};

    for (const bid of raw.blockIds) {
      if (typeof bid !== "string" || !BLOCKS_BY_ID.has(bid)) {
        throw new Error(`Unknown dictionary block: ${String(bid)}`);
      }
      if (!blockIds.includes(bid)) blockIds.push(bid);
      const block = BLOCKS_BY_ID.get(bid)!;
      const incomingBlockParams = isPlainObject(rawParams[bid]) ? rawParams[bid] : {};
      parameters[bid] = {};
      for (const [k, v] of Object.entries(incomingBlockParams)) {
        if (k in block.parameters && typeof v === "string") {
          parameters[bid][k] = v.slice(0, 2000);
        }
      }
    }

    const parsedDate = Date.parse(createdAt);
    const normalizedIso = Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString() : new Date().toISOString();

    return {
      id,
      name,
      scenario: PRESET_IDS.has(scenario) ? scenario : "custom",
      text,
      blockIds,
      parameters,
      createdAt: normalizedIso,
    };
  });

  return { schema_version: 1, prompts };
}

export function exportSavedPromptsJson(prompts: SavedDictionaryPrompt[]): string {
  const checked = validateSavedPromptsBundle({ schema_version: 1, prompts });
  return JSON.stringify(checked, null, 2);
}

export function importSavedPromptsJson(
  jsonText: string,
  existing: SavedDictionaryPrompt[],
): { prompts: SavedDictionaryPrompt[]; added: number; skipped: number } {
  const incoming = validateSavedPromptsBundle(JSON.parse(jsonText));
  const byId = new Map(existing.map((p) => [p.id, p]));
  let skipped = 0;
  let added = 0;
  for (const item of incoming.prompts) {
    if (byId.has(item.id)) {
      skipped++;
      continue;
    }
    byId.set(item.id, item);
    added++;
  }
  return { prompts: [...byId.values()], added, skipped };
}
