import type { Archviz100Preset, IntentLook, Preset200Item } from "@/lib/presets-catalog";
import type { DesignState } from "@/lib/properties";
import type { ZukeVizPrompt } from "@/lib/zuke-viz-library";

export type PresetTransformContext = {
  hasUpload: boolean;
  design: Pick<DesignState, "vertical" | "look" | "light" | "mood">;
  preserveClause?: string;
};

const SMART_SLOT_DEFAULTS: ReadonlyArray<[RegExp, (ctx: PresetTransformContext) => string]> = [
  [/room\s*size|space\s*size|size/i, (ctx) => (ctx.hasUpload ? "existing" : "well-proportioned")],
  [/style|aesthetic|architectural\s*style/i, (ctx) => ctx.design.look.toLowerCase()],
  [/palette|color|colour|tone/i, () => "warm architectural neutrals, natural oak, and honed stone"],
  [/light|lighting|time\s*of\s*day|atmosphere/i, (ctx) => ctx.design.light.toLowerCase()],
  [/mood|vibe|feeling/i, (ctx) => ctx.design.mood.toLowerCase()],
  [/material|finish|surface|texture/i, () => "honed travertine, warm oak timber, and matte plaster"],
  [/floor|flooring/i, () => "wide-plank natural oak hardwood"],
  [/wall|walls/i, () => "warm limewash matte plaster walls"],
  [/ceiling/i, () => "clean architectural plaster ceiling with recessed warm lighting"],
  [/furniture|seating/i, () => "tailored contemporary architectural furnishings"],
  [/building\s*type|project\s*type|typology/i, (ctx) => `${ctx.design.vertical} architecture`],
  [/location|site|context|setting|environment/i, (ctx) => (ctx.hasUpload ? "the existing site context" : "a serene landscaped architectural setting")],
  [/season|weather/i, () => "clear natural daylight"],
  [/camera|angle|lens|view/i, (ctx) => (ctx.hasUpload ? "the exact existing camera perspective" : "eye-level 35mm architectural perspective")],
  [/room|space/i, (ctx) => (ctx.hasUpload ? "existing space" : "living space")],
];

const GENERATION_LEAD_PATTERNS: ReadonlyArray<RegExp> = [
  /^(?:please\s+)?(?:visualize|create|generate|design|render|make|build|imagine|produce|craft|draw|show)\s+(?:(?:an|a|the)\b\s*)?/i,
  /^(?:photorealistic|hyperrealistic|ultra-detailed|architectural)\s+(?:3d\s+)?(?:rendering|render|visualization|photo|photograph|image|view)\s+of\s+(?:(?:an|a|the)\b\s*)?/i,
];

const PLACEHOLDER_RE = /\[([^\]]+)\]/g;

export function resolveSmartPlaceholders(
  rawPrompt: string,
  slotValues: Record<string, string>,
  ctx: PresetTransformContext,
): string {
  return rawPrompt
    .replace(PLACEHOLDER_RE, (_match, rawKey: string) => {
      const key = rawKey.trim();
      const userVal = slotValues[key]?.trim();
      if (userVal) return userVal;
      for (const [pattern, resolver] of SMART_SLOT_DEFAULTS) {
        if (pattern.test(key)) return resolver(ctx);
      }
      return ctx.hasUpload ? "the uploaded space" : key.toLowerCase();
    })
    .replace(/\s+/g, " ")
    .trim();
}

export function stripGenerationLeadVerb(text: string): string {
  let cleaned = text.trim();
  for (const pattern of GENERATION_LEAD_PATTERNS) {
    cleaned = cleaned.replace(pattern, "").trim();
  }
  return cleaned;
}

export function buildUploadedImageLockClause(preserveClause?: string): string {
  const customKeep = preserveClause?.trim();
  if (customKeep) {
    return `Edit the uploaded reference image directly in place — do not create a new room, building, or camera angle. ${customKeep}.`;
  }
  return "Edit the uploaded reference image directly in place — do not create a new room, building, or camera angle. Strictly preserve the exact existing walls, window openings, door placements, ceiling structure, floor layout, and camera perspective of the uploaded photo.";
}

export function rewritePromptForUploadedImage(
  rawPrompt: string,
  ctx: PresetTransformContext,
): string {
  const normalized = resolveSmartPlaceholders(rawPrompt, {}, ctx);
  if (!ctx.hasUpload) return normalized;

  const alreadyAnchored = /uploaded reference image|edit the uploaded|directly in place/i.test(normalized);
  if (alreadyAnchored) return normalized;

  const body = stripGenerationLeadVerb(normalized);
  const lockClause = buildUploadedImageLockClause(ctx.preserveClause);
  return `${lockClause} Apply onto the uploaded image: ${body}`.replace(/\s+/g, " ").trim();
}

export function buildArchviz100AppliedPrompt(
  preset: Archviz100Preset,
  ctx: PresetTransformContext,
): string {
  const cleanedPrompt = resolveSmartPlaceholders(preset.prompt, {}, ctx);
  const styleDetails = [
    preset.materials ? `Materials: ${preset.materials}` : "",
    preset.lighting ? `Lighting: ${preset.lighting}` : "",
    preset.mood ? `Mood: ${preset.mood}` : "",
    preset.palette ? `Palette: ${preset.palette}` : "",
  ]
    .filter(Boolean)
    .join(". ");

  if (!ctx.hasUpload) {
    return [cleanedPrompt, styleDetails].filter(Boolean).join(". ").replace(/\.\./g, ".").trim();
  }

  const directive = stripGenerationLeadVerb(cleanedPrompt);
  const lockClause = buildUploadedImageLockClause(ctx.preserveClause);
  return `${lockClause} Apply the "${preset.title}" transformation directly onto the uploaded image (${directive}${styleDetails ? `. ${styleDetails}` : ""}).`
    .replace(/\.\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildZuke119AppliedPrompt(
  item: ZukeVizPrompt,
  slotValues: Record<string, string>,
  ctx: PresetTransformContext,
): string {
  const filled = resolveSmartPlaceholders(item.prompt, slotValues, ctx);
  if (!ctx.hasUpload) return filled;

  const alreadyAnchored = /uploaded reference image|edit the uploaded|attached image|reference image/i.test(filled);
  const directive = stripGenerationLeadVerb(filled);
  const lockClause = buildUploadedImageLockClause(ctx.preserveClause);
  if (alreadyAnchored) {
    return `${lockClause} ${filled}`.replace(/\s+/g, " ").trim();
  }
  return `${lockClause} Apply "${item.title}" directly onto the uploaded image: ${directive}`
    .replace(/\s+/g, " ")
    .trim();
}

export function buildIntentLookAppliedPrompt(
  look: IntentLook,
  presets: readonly Preset200Item[],
  ctx: PresetTransformContext,
): string {
  const fragments = look.presetIds
    .map((id) => presets.find((p) => p.id === id))
    .filter((p): p is Preset200Item => Boolean(p && !p.is_negative))
    .map((p) => p.fragment);

  const ruleNote = look.rules ? ` Strict rule: ${look.rules}.` : "";
  const lookSummary = `${look.name} aesthetic, ${look.light.toLowerCase()} lighting, ${look.mood.toLowerCase()} mood${fragments.length ? `, ${fragments.join(", ")}` : ""}.${ruleNote}`;

  if (!ctx.hasUpload) {
    return `${ctx.design.look} ${look.vertical} architectural visualization — ${lookSummary}`.trim();
  }

  const lockClause = buildUploadedImageLockClause(ctx.preserveClause);
  return `${lockClause} Restyle the uploaded image with ${lookSummary}`
    .replace(/\s+/g, " ")
    .trim();
}

export function buildUploadedImageSystemPrefix(geometryLock: number): string {
  const lockPct = Math.max(85, Math.min(100, Math.round(geometryLock || 92)));
  return [
    `CRITICAL PIXEL-LOCKED IMAGE-TO-IMAGE EDIT MODE (Geometry & Camera Lock ${lockPct}%):`,
    "Modify the attached uploaded source photograph directly in place — NEVER generate a new base image, building, room, or camera angle.",
    "Preserve the exact camera position, elevation/altitude, tilt, focal length, field of view, horizon line, vanishing points, crop edges, and aspect ratio pixel-for-pixel with the attached image.",
    "Do NOT zoom, pan, crop, rotate, letterbox, or alter any structural silhouette, wall corner, window opening, roofline, or terrain contour.",
    "Apply ONLY the requested materials, lighting, atmosphere, or entourage changes directly onto the existing pixels of the uploaded photograph.",
  ].join(" ");
}
