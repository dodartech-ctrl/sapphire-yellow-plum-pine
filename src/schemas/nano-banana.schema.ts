import { z } from "zod";

export const NANO_BANANA_MODEL_KEYS = [
  "nano_banana_2_1",
  "nano_banana_2",
  "nano_banana_2_lite",
  "nano_banana_pro",
] as const;

export type NanoBananaModelKey = (typeof NANO_BANANA_MODEL_KEYS)[number];
export type RequestedModelSelection = "auto" | NanoBananaModelKey;

export const GENERATION_MODES = [
  "text_to_image",
  "image_to_image",
  "image_edit",
  "multi_reference",
  "iterative_editing",
  "style_transfer",
  "render_enhancement",
] as const;

export type GenerationMode = (typeof GENERATION_MODES)[number];

export const TASK_INTENTS = [
  "generate",
  "transform",
  "enhance",
  "analyze",
] as const;

export type TaskIntent = (typeof TASK_INTENTS)[number];

export const BUILDING_TYPES = [
  "modern_villa",
  "luxury_villa",
  "residential_apartment",
  "commercial_building",
  "office_tower",
  "hotel",
  "resort",
  "institutional_building",
  "cultural_building",
  "industrial_building",
  "interior_residential",
  "interior_commercial",
  "landscape_architecture",
] as const;

export type BuildingType = (typeof BUILDING_TYPES)[number];

export const ARCHITECTURAL_STYLES = [
  "modern_minimalist",
  "contemporary",
  "brutalist",
  "neo_classical",
  "modern_tropical",
  "mediterranean",
  "japanese_minimalist",
  "scandinavian",
  "industrial",
  "parametric",
  "futuristic",
  "organic_architecture",
  "regional_traditional",
] as const;

export type ArchitecturalStyle = (typeof ARCHITECTURAL_STYLES)[number];

export const RENDER_STYLES = [
  "photorealistic",
  "cinematic",
  "architectural_photography",
  "competition_board",
  "conceptual",
  "editorial",
  "atmospheric",
  "clay_render",
  "diagrammatic",
] as const;

export type RenderStyle = (typeof RENDER_STYLES)[number];

export const REFERENCE_TYPES = [
  "geometry_reference",
  "design_reference",
  "mass_model",
  "floor_plan",
  "elevation",
  "section",
  "site_photo",
  "material_reference",
  "lighting_reference",
  "atmosphere_reference",
  "landscape_reference",
  "previous_generation",
] as const;

export type ReferenceType = (typeof REFERENCE_TYPES)[number];

export const REFERENCE_PRIORITY_MAP: Record<ReferenceType, number> = {
  geometry_reference: 1,
  mass_model: 1,
  floor_plan: 1,
  elevation: 1,
  section: 1,
  design_reference: 2,
  site_photo: 2,
  previous_generation: 2,
  material_reference: 3,
  lighting_reference: 4,
  atmosphere_reference: 5,
  landscape_reference: 5,
};

export const OUTPUT_RESOLUTIONS = ["512", "1K", "2K", "4K"] as const;
export type OutputResolution = (typeof OUTPUT_RESOLUTIONS)[number];

export const OUTPUT_ASPECT_RATIOS = [
  "1:1",
  "1:4",
  "1:8",
  "2:3",
  "3:2",
  "3:4",
  "4:1",
  "4:3",
  "4:5",
  "5:4",
  "8:1",
  "9:16",
  "16:9",
  "21:9",
] as const;

export type OutputAspectRatio = (typeof OUTPUT_ASPECT_RATIOS)[number];

const SafeImageUrlSchema = z
  .string()
  .min(4)
  .max(8_500_000)
  .refine(
    (val) =>
      val.startsWith("data:image/") ||
      val.startsWith("/viz/") ||
      val.startsWith("https://"),
    "Image reference must be a base64 data:image/* URL, /viz/ asset path, or https:// URL.",
  );

export const ReferenceImageInputSchema = z.object({
  id: z.string().min(1).max(80).optional(),
  assetId: z.string().min(1).max(120).optional(),
  imageUrl: SafeImageUrlSchema,
  referenceType: z.enum(REFERENCE_TYPES).default("design_reference"),
  priority: z.number().int().min(1).max(5).optional(),
  label: z.string().max(120).optional(),
  notes: z.string().max(400).optional(),
});

export type ReferenceImageInput = z.infer<typeof ReferenceImageInputSchema>;

export const GeometryConstraintsSchema = z.object({
  preserveGeometry: z.boolean().default(true),
  preserveMass: z.boolean().default(true),
  preserveFloors: z.boolean().default(true),
  preserveWindows: z.boolean().default(true),
  preserveOpenings: z.boolean().default(true),
  preserveRoof: z.boolean().default(true),
  preserveFacadeStructure: z.boolean().default(true),
  preserveCamera: z.boolean().default(true),
  allowStructuralChanges: z.boolean().default(false),
});

export type GeometryConstraints = z.infer<typeof GeometryConstraintsSchema>;

export const DesignControlsSchema = z.object({
  buildingType: z.enum(BUILDING_TYPES).default("modern_villa"),
  style: z.string().min(1).max(120).default("contemporary"),
  architecturalStyle: z.enum(ARCHITECTURAL_STYLES).default("contemporary"),
  renderStyle: z.enum(RENDER_STYLES).default("photorealistic"),
  materials: z.array(z.string().min(1).max(80)).max(15).default([]),
  facadeDesign: z.string().max(300).default(""),
  lighting: z.string().min(1).max(160).default("golden_hour"),
  weather: z.string().max(120).default("clear"),
  siteContext: z.string().max(240).default("coastal architectural site"),
  neighborContext: z.string().max(200).default("low-rise refined context"),
  vegetation: z.string().min(1).max(200).default("refined architectural landscaping"),
  camera: z.string().min(1).max(160).default("eye_level"),
  lensMm: z.number().int().min(14).max(135).default(35),
  twoPointPerspective: z.boolean().default(true),
});

export type DesignControls = z.infer<typeof DesignControlsSchema>;

export const OutputOptionsSchema = z.object({
  format: z.enum(["png", "jpeg", "webp"]).default("png"),
  quality: z.enum(["draft", "standard", "high", "ultra", "premium"]).default("high"),
  resolution: z.enum(OUTPUT_RESOLUTIONS).default("2K"),
  aspectRatio: z.enum(OUTPUT_ASPECT_RATIOS).default("16:9"),
  renderText: z.boolean().default(false),
});

export type OutputOptions = z.infer<typeof OutputOptionsSchema>;

export const NanoBananaGenerateSchema = z.object({
  projectId: z.string().min(1).max(120).default("default-studio"),
  userId: z.string().min(1).max(120).default("studio-architect"),
  idempotencyKey: z.string().min(4).max(120).optional(),
  task: z.enum(TASK_INTENTS).optional(),
  generationMode: z.enum(GENERATION_MODES).default("text_to_image"),
  requestedModel: z.union([z.literal("auto"), z.enum(NANO_BANANA_MODEL_KEYS)]).default("auto"),
  prompt: z.string().trim().min(5, "Prompt must be at least 5 characters.").max(5000),
  negativeInstructions: z.array(z.string().max(160)).max(24).default([]),
  imageUrl: SafeImageUrlSchema.optional(),
  maskImageUrl: SafeImageUrlSchema.optional(),
  references: z.array(ReferenceImageInputSchema).max(14).default([]),
  sessionId: z.string().min(1).max(120).optional(),
  parentGenerationId: z.string().min(1).max(120).optional(),
  confirmConflicts: z.boolean().default(false),
  design: DesignControlsSchema.default(() => DesignControlsSchema.parse({})),
  constraints: GeometryConstraintsSchema.default(() => GeometryConstraintsSchema.parse({})),
  output: OutputOptionsSchema.default(() => OutputOptionsSchema.parse({})),
});

export type NanoBananaGenerateRequest = z.infer<typeof NanoBananaGenerateSchema>;

export const NanoBananaEditSchema = NanoBananaGenerateSchema.extend({
  generationMode: z.enum(["image_edit", "image_to_image", "style_transfer", "render_enhancement"]).default("image_edit"),
}).refine((req) => Boolean(req.imageUrl || req.references.length > 0), {
  message: "Image editing requires a base imageUrl or at least one reference image.",
  path: ["imageUrl"],
});

export const NanoBananaMultiRefSchema = NanoBananaGenerateSchema.extend({
  generationMode: z.literal("multi_reference").default("multi_reference"),
  references: z.array(ReferenceImageInputSchema).min(2, "Multi-reference generation requires at least 2 reference images.").max(14),
});

export const NanoBananaContinueEditSchema = z.object({
  projectId: z.string().min(1).max(120).default("default-studio"),
  userId: z.string().min(1).max(120).default("studio-architect"),
  idempotencyKey: z.string().min(4).max(120).optional(),
  prompt: z.string().trim().min(3, "Edit instruction must be at least 3 characters.").max(4000),
  requestedModel: z.union([z.literal("auto"), z.enum(NANO_BANANA_MODEL_KEYS)]).default("auto"),
  references: z.array(ReferenceImageInputSchema).max(10).default([]),
  constraints: GeometryConstraintsSchema.partial().optional(),
  output: OutputOptionsSchema.partial().optional(),
  confirmConflicts: z.boolean().default(false),
});

export type NanoBananaContinueEditRequest = z.infer<typeof NanoBananaContinueEditSchema>;

/** Backward-compatible GenerationSchema matching the orchestration specification */
export const GenerationSchema = NanoBananaGenerateSchema;
export type GenerationRequest = NanoBananaGenerateRequest;

export interface NormalizedReferenceManifestItem {
  order: number;
  id: string;
  assetId: string;
  referenceType: ReferenceType;
  priority: number;
  label: string;
  notes?: string;
  mimeType: string;
  byteEstimate: number;
}

export function normalizeReferenceManifest(
  references: ReferenceImageInput[],
  primaryImageUrl?: string,
): NormalizedReferenceManifestItem[] {
  const combined: ReferenceImageInput[] = [];
  if (primaryImageUrl) {
    const alreadyPresent = references.some((ref) => ref.imageUrl === primaryImageUrl);
    if (!alreadyPresent) {
      combined.push({
        id: "ref-primary",
        imageUrl: primaryImageUrl,
        referenceType: "geometry_reference",
        priority: 1,
        label: "Primary Base Architecture",
      });
    }
  }
  combined.push(...references);

  return combined
    .map((ref, idx) => {
      const priority = ref.priority ?? REFERENCE_PRIORITY_MAP[ref.referenceType] ?? 2;
      const mimeMatch = ref.imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
      const mimeType = mimeMatch?.[1] ?? (ref.imageUrl.endsWith(".png") ? "image/png" : "image/jpeg");
      const byteEstimate = ref.imageUrl.startsWith("data:")
        ? Math.floor((ref.imageUrl.length * 3) / 4)
        : 0;
      return {
        order: idx + 1,
        id: ref.id ?? `ref-${idx + 1}`,
        assetId: ref.assetId ?? `asset-${idx + 1}`,
        referenceType: ref.referenceType,
        priority,
        label: ref.label?.trim() || ref.referenceType.replace(/_/g, " "),
        notes: ref.notes,
        mimeType,
        byteEstimate,
      };
    })
    .sort((a, b) => a.priority - b.priority || a.order - b.order)
    .map((item, idx) => ({ ...item, order: idx + 1 }));
}
