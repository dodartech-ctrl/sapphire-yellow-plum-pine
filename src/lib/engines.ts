import type { DesignState } from "@/lib/properties";
import type { Frame } from "@/lib/frame";

export type WorkflowPreset =
  | "photoreal"
  | "plan-to-3d"
  | "elevation-to-render"
  | "sketch-to-render"
  | "interior-restyle"
  | "clay-to-render";

export type RenderFidelity = "draft" | "standard" | "photoreal" | "editorial";
export type DetailDensity = "minimal" | "balanced" | "intricate";
export type SketchMode = "faithful" | "balanced" | "creative";
export type AnnotatorMode = "none" | "canny" | "mlsd" | "lineart" | "softedge" | "normal";
export type EsrganModel = "RealESRGAN_x2plus" | "RealESRGAN_x4plus" | "4x-ArchSharp";
export type IpAdapterPreset = "standard" | "plus" | "style-composition" | "fixture-lock";
export type D5LightPreset = "noon" | "golden" | "blue-hour" | "overcast";
export type FacadeTypology =
  | "Minimalist Glass"
  | "Board-Marked Concrete"
  | "Biophilic Timber Louver"
  | "Nordic Brick & Zinc"
  | "Parametric Kinetic Facade"
  | "Classical Limestone";
export type ClimateRegion =
  | "Temperate Coastal"
  | "Subtropical Humid"
  | "Alpine Cold"
  | "Arid Desert"
  | "Urban Dense";
export type EnhanceMode = "standard" | "upscale-2x" | "micro-detail";
export type OutputMode = "single" | "grid-4";
export type HdriMood = "studio" | "clear-sky" | "golden-dusk" | "overcast-nordic";
export type RelightPreset = "none" | "overcast-to-golden" | "summer-to-snow" | "day-to-dusk";
export type OutpaintRatio = "none" | "21:9" | "9:16" | "16:9";
export type UpscaleFactor = 1 | 2 | 4 | 8;

export type IopaintTaskMode = "erase" | "replace" | "outpaint" | "anytext" | "paint-by-example";
export type IopaintModel =
  | "lama"
  | "mat"
  | "migan"
  | "zits"
  | "ldm"
  | "fcf"
  | "manga"
  | "powerpaint-v2"
  | "brushnet"
  | "sdxl-inpaint"
  | "sd15-inpaint"
  | "anytext"
  | "paint-by-example"
  | "instruct-pix2pix";
export type IopaintRemoveBgModel = "rmbg-2.0" | "u2net" | "isnet-general" | "birefnet" | "anime-seg";
export type IopaintFaceModel = "gfpgan" | "restoreformer";
export type IopaintOutpaintPad = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ReferenceSlot = {
  url: string | null;
  weight: number;
  startAt: number;
  endAt: number;
};

export type ReferenceMatrix = {
  massing: ReferenceSlot;
  material: ReferenceSlot;
  lighting: ReferenceSlot;
};

export type ExtendedPbrPresetId =
  | "anodized-aluminum"
  | "board-formed-concrete"
  | "fluted-oak"
  | "low-e-glass"
  | "honed-travertine"
  | "nordic-brick"
  | "brushed-bronze"
  | "standing-seam-zinc";

export type EngineState = {
  workflowPreset: WorkflowPreset;
  // Veras AI
  geometryLock: number;
  materialOverride: number;
  renderFidelity: RenderFidelity;
  seed: number;
  seedLocked: boolean;
  // LookX AI
  facadeTypology: FacadeTypology;
  climateRegion: ClimateRegion;
  styleTransferWeight: number;
  detailDensity: DetailDensity;
  // PromeAI
  edgeAdherence: number;
  sketchMode: SketchMode;
  // Krea AI & Real-time / Edit
  inpaintStrength: number;
  enhanceMode: EnhanceMode;
  liveStreamEnabled: boolean;
  relightPreset: RelightPreset;
  outpaintRatio: OutpaintRatio;
  // Midjourney
  mjStylize: number;
  mjChaos: number;
  refWeight: number;
  outputMode: OutputMode;
  // Annotators (lllyasviel/Annotators) & Depth-Anything-V2
  annotatorMode: AnnotatorMode;
  annotatorThreshold: number;
  depthEnabled: boolean;
  depthWeight: number;
  // SAM / Grounded-SAM
  samPrompt: string;
  samThreshold: number;
  // Real-ESRGAN & Generative Tile Upscaler
  esrganModel: EsrganModel;
  esrganDenoise: number;
  esrganFaceEnhance: boolean;
  upscaleFactor: UpscaleFactor;
  // IP-Adapter Plus & Multi-Ref Matrix (--sref / --oref)
  ipAdapterEnabled: boolean;
  ipAdapterPreset: IpAdapterPreset;
  ipAdapterWeight: number;
  ipAdapterStartAt: number;
  ipAdapterEndAt: number;
  ipAdapterRefUrl: string | null;
  refMatrix: ReferenceMatrix;
  houseStyleId: string | null;
  // Sanster/IOPaint Suite & Plugins
  iopaintTask: IopaintTaskMode;
  iopaintModel: IopaintModel;
  iopaintMaskDilate: number;
  iopaintInvertMask: boolean;
  iopaintAnyText: string;
  iopaintExampleUrl: string | null;
  iopaintOutpaintPad: IopaintOutpaintPad;
  iopaintRemoveBgModel: IopaintRemoveBgModel;
  iopaintFaceModel: IopaintFaceModel;
};

export type Scene3DPreset = "pavilion" | "villa" | "loft" | "civic" | "plan-extrude" | "custom-cad";
export type Scene3DMaterial = "concrete" | "timber" | "travertine" | "brick";
export type CameraPreset3D = "eye" | "oblique" | "aerial" | "detail";

export type Scene3DState = {
  preset: Scene3DPreset;
  sunAzimuth: number;
  sunElevation: number;
  fogDensity: number;
  focalLength: 24 | 35 | 50 | 85;
  cameraPreset: CameraPreset3D;
  primaryMaterial: Scene3DMaterial;
  // Real-time 3D model manipulation & D5 lighting controls
  modelRotationY: number;
  modelScale: number;
  modelElevation: number;
  exposure: number;
  d5LightPreset: D5LightPreset;
  // 2-point tilt shift, geo sun, HDRI & CAD material picker
  twoPointTilt: boolean;
  verticalShift: number;
  geoEnabled: boolean;
  geoLatitude: number;
  geoMonth: number;
  geoHour: number;
  hdriMood: HdriMood;
  materialPickMode: boolean;
  customModelName: string | null;
};

export type RenderQueueStatus =
  | "pending"
  | "processing"
  | "completed"
  | "queued"
  | "running"
  | "done"
  | "error";

export type RenderQueueItem = {
  id: string;
  label: string;
  preset: WorkflowPreset;
  light: string;
  cameraPreset?: CameraPreset3D;
  sunHour?: number;
  promptNote?: string;
  status: RenderQueueStatus;
  url?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  durationMs?: number;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
};

export type PublishedGalleryProject = {
  id: string;
  title: string;
  location: string;
  year: string;
  discipline: "Exterior" | "Interior" | "Renovation" | "Cultural" | "Civic" | "Landscape";
  comparisonType: "Lighting / Relighting" | "Material Restyle" | "Adaptive Reuse" | "Masterplan Integration";
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  summary: string;
  materialsUsed: string[];
  lightingTechnique: string;
  aspect: string;
  promptBlueprint: string;
  engineMeta: string;
  createdAt: number;
};

export const WORKFLOW_PRESETS: {
  id: WorkflowPreset;
  label: string;
  badge: string;
  description: string;
  defaults: Partial<EngineState>;
}[] = [
  {
    id: "photoreal",
    label: "Photoreal Plate",
    badge: "Veras",
    description: "Strict structural massing lock with physically accurate materiality and natural lighting.",
    defaults: { geometryLock: 85, materialOverride: 55, edgeAdherence: 75, renderFidelity: "photoreal", mjStylize: 180, mjChaos: 10 },
  },
  {
    id: "sketch-to-render",
    label: "Sketch → Render",
    badge: "PromeAI",
    description: "Converts architectural line sketches or 3D overlays into detailed perspective visualizations.",
    defaults: { geometryLock: 72, edgeAdherence: 88, sketchMode: "faithful", styleTransferWeight: 65, renderFidelity: "photoreal" },
  },
  {
    id: "interior-restyle",
    label: "Interior Restyle",
    badge: "mnml.ai",
    description: "Reimagines furnishings, flooring, and wall finishes while holding walls, doors, and windows steady.",
    defaults: { geometryLock: 90, materialOverride: 75, edgeAdherence: 82, renderFidelity: "editorial", mjStylize: 220 },
  },
  {
    id: "plan-to-3d",
    label: "2D Plan → 3D",
    badge: "Rendair",
    description: "Extrudes orthographic floor plans into furnished axonometric or eye-level spatial concepts.",
    defaults: { geometryLock: 78, edgeAdherence: 92, styleTransferWeight: 55, renderFidelity: "standard", mjChaos: 15 },
  },
  {
    id: "elevation-to-render",
    label: "Elevation → Render",
    badge: "LookX",
    description: "Transforms flat orthographic facade elevations into sunlit architectural photography.",
    defaults: { geometryLock: 92, edgeAdherence: 94, styleTransferWeight: 70, detailDensity: "intricate", renderFidelity: "editorial" },
  },
  {
    id: "clay-to-render",
    label: "Clay → Photoreal",
    badge: "D5",
    description: "Takes untextured white/gray 3D massing snapshots and applies full PBR materiality and context.",
    defaults: { geometryLock: 95, materialOverride: 88, edgeAdherence: 85, renderFidelity: "photoreal", mjStylize: 140 },
  },
];

export const FACADE_TYPOLOGIES: readonly FacadeTypology[] = [
  "Minimalist Glass",
  "Board-Marked Concrete",
  "Biophilic Timber Louver",
  "Nordic Brick & Zinc",
  "Parametric Kinetic Facade",
  "Classical Limestone",
];

export const CLIMATE_REGIONS: readonly ClimateRegion[] = [
  "Temperate Coastal",
  "Subtropical Humid",
  "Alpine Cold",
  "Arid Desert",
  "Urban Dense",
];

export const RENDER_FIDELITIES: { id: RenderFidelity; label: string }[] = [
  { id: "draft", label: "Draft" },
  { id: "standard", label: "Standard" },
  { id: "photoreal", label: "Photoreal" },
  { id: "editorial", label: "Editorial" },
];

export const DETAIL_DENSITIES: { id: DetailDensity; label: string }[] = [
  { id: "minimal", label: "Minimal" },
  { id: "balanced", label: "Balanced" },
  { id: "intricate", label: "Intricate" },
];

export const SKETCH_MODES: { id: SketchMode; label: string }[] = [
  { id: "faithful", label: "Faithful" },
  { id: "balanced", label: "Balanced" },
  { id: "creative", label: "Creative" },
];

export const ENHANCE_MODES: { id: EnhanceMode; label: string }[] = [
  { id: "standard", label: "Clean" },
  { id: "upscale-2x", label: "2× Upscale" },
  { id: "micro-detail", label: "Micro-Detail" },
];

export const SCENE3D_PRESETS: { id: Scene3DPreset; label: string; subtitle: string }[] = [
  { id: "pavilion", label: "Water Pavilion", subtitle: "Concrete & reflecting basin" },
  { id: "villa", label: "Cantilever Villa", subtitle: "Stepped terrace & louvers" },
  { id: "loft", label: "Courtyard Loft", subtitle: "Adaptive steel & brick bay" },
  { id: "civic", label: "Timber Hall", subtitle: "Glulam civic colonnade" },
];

export const SCENE3D_MATERIALS: { id: Scene3DMaterial; label: string; swatch: string }[] = [
  { id: "concrete", label: "Fair Concrete", swatch: "#b6b4ae" },
  { id: "timber", label: "Warm Cedar", swatch: "#b68557" },
  { id: "travertine", label: "Honed Travertine", swatch: "#ded2bd" },
  { id: "brick", label: "Nordic Brick", swatch: "#9f5b47" },
];

export const CAMERA_PRESETS_3D: { id: CameraPreset3D; label: string }[] = [
  { id: "eye", label: "Eye 1.6m" },
  { id: "oblique", label: "3/4 Hero" },
  { id: "aerial", label: "Aerial" },
  { id: "detail", label: "Junction" },
];

export const FOCAL_LENGTHS: readonly (24 | 35 | 50 | 85)[] = [24, 35, 50, 85];

export const ANNOTATOR_MODES: { id: AnnotatorMode; label: string; hint: string }[] = [
  { id: "none", label: "Off", hint: "Direct RGB input" },
  { id: "canny", label: "Canny Edge", hint: "Crisp architectural contours" },
  { id: "mlsd", label: "MLSD Lines", hint: "Straight structural orthogonals" },
  { id: "lineart", label: "LineArt", hint: "Ink pen architectural drawing" },
  { id: "softedge", label: "HED SoftEdge", hint: "Smooth shadow & silhouette guides" },
  { id: "normal", label: "Normal Map", hint: "Surface orientation XYZ vectors" },
];

export const ESRGAN_MODELS: { id: EsrganModel; label: string }[] = [
  { id: "RealESRGAN_x2plus", label: "x2plus (Crisp)" },
  { id: "RealESRGAN_x4plus", label: "x4plus (Ultra)" },
  { id: "4x-ArchSharp", label: "ArchSharp (Lines)" },
];

export const IPADAPTER_PRESETS: { id: IpAdapterPreset; label: string }[] = [
  { id: "standard", label: "Standard Style" },
  { id: "plus", label: "IP-Adapter Plus" },
  { id: "style-composition", label: "Style + Layout" },
  { id: "fixture-lock", label: "Material / Fixture" },
];

export const D5_LIGHT_PRESETS: {
  id: D5LightPreset;
  label: string;
  sunAzimuth: number;
  sunElevation: number;
  fogDensity: number;
  exposure: number;
}[] = [
  { id: "noon", label: "Noon Sun", sunAzimuth: 148, sunElevation: 56, fogDensity: 12, exposure: 1.05 },
  { id: "golden", label: "Golden Hour", sunAzimuth: 242, sunElevation: 16, fogDensity: 24, exposure: 1.15 },
  { id: "blue-hour", label: "Blue Hour", sunAzimuth: 278, sunElevation: 6, fogDensity: 34, exposure: 1.24 },
  { id: "overcast", label: "Overcast Studio", sunAzimuth: 120, sunElevation: 42, fogDensity: 46, exposure: 0.98 },
];

export const HDRI_MOODS: { id: HdriMood; label: string }[] = [
  { id: "studio", label: "Studio Neutral" },
  { id: "clear-sky", label: "Clear Zenith" },
  { id: "golden-dusk", label: "Golden Horizon" },
  { id: "overcast-nordic", label: "Nordic Overcast" },
];

export const RELIGHT_PRESETS: { id: RelightPreset; label: string }[] = [
  { id: "none", label: "Original Light" },
  { id: "overcast-to-golden", label: "Overcast → Golden" },
  { id: "summer-to-snow", label: "Summer → Snow" },
  { id: "day-to-dusk", label: "Day → Dusk Glow" },
];

export const OUTPAINT_RATIOS: { id: OutpaintRatio; label: string }[] = [
  { id: "none", label: "Frame Lock" },
  { id: "21:9", label: "21:9 Cinema Uncrop" },
  { id: "9:16", label: "9:16 Vertical Uncrop" },
  { id: "16:9", label: "16:9 Wide Expand" },
];

export const IOPAINT_TASKS: {
  id: IopaintTaskMode;
  label: string;
  badge: string;
  defaultModel: IopaintModel;
  hint: string;
}[] = [
  { id: "erase", label: "Erase", badge: "LaMa", defaultModel: "lama", hint: "Remove people, wires, vehicles & clutter" },
  { id: "replace", label: "Replace", badge: "PowerPaint", defaultModel: "powerpaint-v2", hint: "Text-guided generative inpaint inside mask" },
  { id: "outpaint", label: "Outpaint Pad", badge: "Expand", defaultModel: "powerpaint-v2", hint: "Directional +Top/Right/Bottom/Left canvas extend" },
  { id: "anytext", label: "AnyText", badge: "Signage", defaultModel: "anytext", hint: "Legible architectural typography & fascia text" },
  { id: "paint-by-example", label: "By Example", badge: "Ref", defaultModel: "paint-by-example", hint: "Insert reference object image into mask" },
];

export const IOPAINT_MODELS: {
  id: IopaintModel;
  label: string;
  group: "erase" | "diffusion";
  hint: string;
}[] = [
  { id: "lama", label: "LaMa (Fourier)", group: "erase", hint: "Fast clean object & wire removal" },
  { id: "mat", label: "MAT (Large Mask)", group: "erase", hint: "Transformer fill for large structural gaps" },
  { id: "migan", label: "MI-GAN (HD)", group: "erase", hint: "High-res sharp texture inpainting" },
  { id: "zits", label: "ZITS (Structures)", group: "erase", hint: "Edge-guided line & masonry reconstruction" },
  { id: "ldm", label: "LDM Erase", group: "erase", hint: "Latent diffusion clean removal" },
  { id: "fcf", label: "FcF Fast", group: "erase", hint: "Coarse-to-fine rapid object cleanup" },
  { id: "manga", label: "Manga Line", group: "erase", hint: "Screentone & linework drawing cleanup" },
  { id: "powerpaint-v2", label: "PowerPaint V2", group: "diffusion", hint: "Shape-aware replace & seamless outpaint" },
  { id: "brushnet", label: "BrushNet", group: "diffusion", hint: "Branch-locked realistic architectural refill" },
  { id: "sdxl-inpaint", label: "SDXL Inpaint 1.0", group: "diffusion", hint: "High-detail editorial replacement" },
  { id: "sd15-inpaint", label: "Realistic Vision", group: "diffusion", hint: "Photoreal exterior & interior material fill" },
  { id: "anytext", label: "AnyText v1.1", group: "diffusion", hint: "Accurate architectural lettering & wayfinding" },
  { id: "paint-by-example", label: "Paint-by-Example", group: "diffusion", hint: "Reference-driven furniture & prop insertion" },
  { id: "instruct-pix2pix", label: "InstructPix2Pix", group: "diffusion", hint: "Instruction-only image restyling" },
];

export const IOPAINT_REMOVEBG_MODELS: { id: IopaintRemoveBgModel; label: string }[] = [
  { id: "rmbg-2.0", label: "RMBG-2.0 (Bria)" },
  { id: "birefnet", label: "BiRefNet (Arch)" },
  { id: "u2net", label: "U²-Net" },
  { id: "isnet-general", label: "IS-Net General" },
  { id: "anime-seg", label: "Line/Cutout Seg" },
];

export const IOPAINT_FACE_MODELS: { id: IopaintFaceModel; label: string }[] = [
  { id: "gfpgan", label: "GFPGAN v1.4" },
  { id: "restoreformer", label: "RestoreFormer++" },
];

export const DEFAULT_IOPAINT_OUTPAINT_PAD: IopaintOutpaintPad = {
  top: 0,
  right: 128,
  bottom: 0,
  left: 128,
};

export const EXTENDED_PBR_PRESETS: {
  id: ExtendedPbrPresetId;
  label: string;
  color: number;
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  opacity?: number;
  transparent?: boolean;
}[] = [
  { id: "board-formed-concrete", label: "Board Concrete", color: 0xb4b0a8, hex: "#b4b0a8", roughness: 0.82, metalness: 0.04 },
  { id: "anodized-aluminum", label: "Anodized Alum", color: 0x3b3e42, hex: "#3b3e42", roughness: 0.26, metalness: 0.88 },
  { id: "fluted-oak", label: "Fluted Oak", color: 0xb88656, hex: "#b88656", roughness: 0.62, metalness: 0.03 },
  { id: "low-e-glass", label: "Low-E Glass", color: 0xcbe2e3, hex: "#cbe2e3", roughness: 0.06, metalness: 0.14, clearcoat: 1, opacity: 0.44, transparent: true },
  { id: "honed-travertine", label: "Honed Travertine", color: 0xe2d5be, hex: "#e2d5be", roughness: 0.6, metalness: 0.02 },
  { id: "nordic-brick", label: "Nordic Brick", color: 0x995946, hex: "#995946", roughness: 0.86, metalness: 0.02 },
  { id: "brushed-bronze", label: "Brushed Bronze", color: 0x8f6f47, hex: "#8f6f47", roughness: 0.28, metalness: 0.84 },
  { id: "standing-seam-zinc", label: "Patina Zinc", color: 0x62676b, hex: "#62676b", roughness: 0.42, metalness: 0.72 },
];

export const DEFAULT_REFERENCE_MATRIX: ReferenceMatrix = {
  massing: { url: null, weight: 70, startAt: 0, endAt: 75 },
  material: { url: null, weight: 75, startAt: 10, endAt: 90 },
  lighting: { url: null, weight: 65, startAt: 15, endAt: 85 },
};

export const DEFAULT_ENGINE: EngineState = {
  workflowPreset: "photoreal",
  geometryLock: 85,
  materialOverride: 55,
  renderFidelity: "photoreal",
  seed: 482910,
  seedLocked: true,
  facadeTypology: "Minimalist Glass",
  climateRegion: "Temperate Coastal",
  styleTransferWeight: 65,
  detailDensity: "balanced",
  edgeAdherence: 80,
  sketchMode: "faithful",
  inpaintStrength: 72,
  enhanceMode: "upscale-2x",
  liveStreamEnabled: false,
  relightPreset: "none",
  outpaintRatio: "none",
  mjStylize: 200,
  mjChaos: 12,
  refWeight: 70,
  outputMode: "single",
  annotatorMode: "mlsd",
  annotatorThreshold: 58,
  depthEnabled: true,
  depthWeight: 70,
  samPrompt: "facade glazing",
  samThreshold: 45,
  esrganModel: "RealESRGAN_x2plus",
  esrganDenoise: 25,
  esrganFaceEnhance: false,
  upscaleFactor: 2,
  ipAdapterEnabled: false,
  ipAdapterPreset: "plus",
  ipAdapterWeight: 65,
  ipAdapterStartAt: 0,
  ipAdapterEndAt: 85,
  ipAdapterRefUrl: null,
  refMatrix: DEFAULT_REFERENCE_MATRIX,
  houseStyleId: null,
  iopaintTask: "erase",
  iopaintModel: "lama",
  iopaintMaskDilate: 4,
  iopaintInvertMask: false,
  iopaintAnyText: "ORIEL PAVILION",
  iopaintExampleUrl: null,
  iopaintOutpaintPad: DEFAULT_IOPAINT_OUTPAINT_PAD,
  iopaintRemoveBgModel: "rmbg-2.0",
  iopaintFaceModel: "gfpgan",
};

export const DEFAULT_SCENE3D: Scene3DState = {
  preset: "pavilion",
  sunAzimuth: 138,
  sunElevation: 32,
  fogDensity: 18,
  focalLength: 35,
  cameraPreset: "oblique",
  primaryMaterial: "concrete",
  modelRotationY: 0,
  modelScale: 1,
  modelElevation: 0,
  exposure: 1.08,
  d5LightPreset: "noon",
  twoPointTilt: true,
  verticalShift: 0.04,
  geoEnabled: false,
  geoLatitude: 37.8,
  geoMonth: 6,
  geoHour: 16.5,
  hdriMood: "clear-sky",
  materialPickMode: false,
  customModelName: null,
};

function clamp(n: unknown, min: number, max: number, fallback: number): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function clampFloat(n: unknown, min: number, max: number, fallback: number): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Number(n.toFixed(2))));
}

function pickOne<T extends string>(val: unknown, allowed: readonly T[], fallback: T): T {
  return typeof val === "string" && (allowed as readonly string[]).includes(val) ? (val as T) : fallback;
}

function sanitizeRefSlot(raw: unknown, fallback: ReferenceSlot): ReferenceSlot {
  if (!raw || typeof raw !== "object") return { ...fallback };
  const s = raw as Partial<ReferenceSlot>;
  return {
    url: typeof s.url === "string" ? s.url : null,
    weight: clamp(s.weight, 0, 100, fallback.weight),
    startAt: clamp(s.startAt, 0, 50, fallback.startAt),
    endAt: clamp(s.endAt, 50, 100, fallback.endAt),
  };
}

export function sanitizeEngineState(input?: Partial<EngineState>): EngineState {
  const factor = input?.upscaleFactor;
  const validUpscale: UpscaleFactor = factor === 1 || factor === 2 || factor === 4 || factor === 8 ? factor : DEFAULT_ENGINE.upscaleFactor;
  const rawMatrix = input?.refMatrix;
  return {
    workflowPreset: pickOne(
      input?.workflowPreset,
      WORKFLOW_PRESETS.map((p) => p.id),
      DEFAULT_ENGINE.workflowPreset,
    ),
    geometryLock: clamp(input?.geometryLock, 0, 100, DEFAULT_ENGINE.geometryLock),
    materialOverride: clamp(input?.materialOverride, 0, 100, DEFAULT_ENGINE.materialOverride),
    renderFidelity: pickOne(input?.renderFidelity, ["draft", "standard", "photoreal", "editorial"], DEFAULT_ENGINE.renderFidelity),
    seed: clamp(input?.seed, 1, 9999999, DEFAULT_ENGINE.seed),
    seedLocked: typeof input?.seedLocked === "boolean" ? input.seedLocked : DEFAULT_ENGINE.seedLocked,
    facadeTypology: pickOne(input?.facadeTypology, FACADE_TYPOLOGIES, DEFAULT_ENGINE.facadeTypology),
    climateRegion: pickOne(input?.climateRegion, CLIMATE_REGIONS, DEFAULT_ENGINE.climateRegion),
    styleTransferWeight: clamp(input?.styleTransferWeight, 0, 100, DEFAULT_ENGINE.styleTransferWeight),
    detailDensity: pickOne(input?.detailDensity, ["minimal", "balanced", "intricate"], DEFAULT_ENGINE.detailDensity),
    edgeAdherence: clamp(input?.edgeAdherence, 0, 100, DEFAULT_ENGINE.edgeAdherence),
    sketchMode: pickOne(input?.sketchMode, ["faithful", "balanced", "creative"], DEFAULT_ENGINE.sketchMode),
    inpaintStrength: clamp(input?.inpaintStrength, 0, 100, DEFAULT_ENGINE.inpaintStrength),
    enhanceMode: pickOne(input?.enhanceMode, ["standard", "upscale-2x", "micro-detail"], DEFAULT_ENGINE.enhanceMode),
    liveStreamEnabled: typeof input?.liveStreamEnabled === "boolean" ? input.liveStreamEnabled : DEFAULT_ENGINE.liveStreamEnabled,
    relightPreset: pickOne(input?.relightPreset, ["none", "overcast-to-golden", "summer-to-snow", "day-to-dusk"], DEFAULT_ENGINE.relightPreset),
    outpaintRatio: pickOne(input?.outpaintRatio, ["none", "21:9", "9:16", "16:9"], DEFAULT_ENGINE.outpaintRatio),
    mjStylize: clamp(input?.mjStylize, 0, 1000, DEFAULT_ENGINE.mjStylize),
    mjChaos: clamp(input?.mjChaos, 0, 100, DEFAULT_ENGINE.mjChaos),
    refWeight: clamp(input?.refWeight, 0, 100, DEFAULT_ENGINE.refWeight),
    outputMode: pickOne(input?.outputMode, ["single", "grid-4"], DEFAULT_ENGINE.outputMode),
    annotatorMode: pickOne(input?.annotatorMode, ["none", "canny", "mlsd", "lineart", "softedge", "normal"], DEFAULT_ENGINE.annotatorMode),
    annotatorThreshold: clamp(input?.annotatorThreshold, 10, 100, DEFAULT_ENGINE.annotatorThreshold),
    depthEnabled: typeof input?.depthEnabled === "boolean" ? input.depthEnabled : DEFAULT_ENGINE.depthEnabled,
    depthWeight: clamp(input?.depthWeight, 0, 100, DEFAULT_ENGINE.depthWeight),
    samPrompt: typeof input?.samPrompt === "string" ? input.samPrompt.slice(0, 64) : DEFAULT_ENGINE.samPrompt,
    samThreshold: clamp(input?.samThreshold, 15, 90, DEFAULT_ENGINE.samThreshold),
    esrganModel: pickOne(input?.esrganModel, ["RealESRGAN_x2plus", "RealESRGAN_x4plus", "4x-ArchSharp"], DEFAULT_ENGINE.esrganModel),
    esrganDenoise: clamp(input?.esrganDenoise, 0, 100, DEFAULT_ENGINE.esrganDenoise),
    esrganFaceEnhance: typeof input?.esrganFaceEnhance === "boolean" ? input.esrganFaceEnhance : DEFAULT_ENGINE.esrganFaceEnhance,
    upscaleFactor: validUpscale,
    ipAdapterEnabled: typeof input?.ipAdapterEnabled === "boolean" ? input.ipAdapterEnabled : DEFAULT_ENGINE.ipAdapterEnabled,
    ipAdapterPreset: pickOne(input?.ipAdapterPreset, ["standard", "plus", "style-composition", "fixture-lock"], DEFAULT_ENGINE.ipAdapterPreset),
    ipAdapterWeight: clamp(input?.ipAdapterWeight, 0, 100, DEFAULT_ENGINE.ipAdapterWeight),
    ipAdapterStartAt: clamp(input?.ipAdapterStartAt, 0, 50, DEFAULT_ENGINE.ipAdapterStartAt),
    ipAdapterEndAt: clamp(input?.ipAdapterEndAt, 50, 100, DEFAULT_ENGINE.ipAdapterEndAt),
    ipAdapterRefUrl: typeof input?.ipAdapterRefUrl === "string" ? input.ipAdapterRefUrl : null,
    refMatrix: {
      massing: sanitizeRefSlot(rawMatrix?.massing, DEFAULT_REFERENCE_MATRIX.massing),
      material: sanitizeRefSlot(rawMatrix?.material, DEFAULT_REFERENCE_MATRIX.material),
      lighting: sanitizeRefSlot(rawMatrix?.lighting, DEFAULT_REFERENCE_MATRIX.lighting),
    },
    houseStyleId: typeof input?.houseStyleId === "string" ? input.houseStyleId : null,
    iopaintTask: pickOne(
      input?.iopaintTask,
      ["erase", "replace", "outpaint", "anytext", "paint-by-example"],
      DEFAULT_ENGINE.iopaintTask,
    ),
    iopaintModel: pickOne(
      input?.iopaintModel,
      IOPAINT_MODELS.map((m) => m.id),
      DEFAULT_ENGINE.iopaintModel,
    ),
    iopaintMaskDilate: clamp(input?.iopaintMaskDilate, 0, 24, DEFAULT_ENGINE.iopaintMaskDilate),
    iopaintInvertMask:
      typeof input?.iopaintInvertMask === "boolean" ? input.iopaintInvertMask : DEFAULT_ENGINE.iopaintInvertMask,
    iopaintAnyText:
      typeof input?.iopaintAnyText === "string" ? input.iopaintAnyText.slice(0, 80) : DEFAULT_ENGINE.iopaintAnyText,
    iopaintExampleUrl: typeof input?.iopaintExampleUrl === "string" ? input.iopaintExampleUrl : null,
    iopaintOutpaintPad: {
      top: clamp(input?.iopaintOutpaintPad?.top, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.top),
      right: clamp(input?.iopaintOutpaintPad?.right, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.right),
      bottom: clamp(input?.iopaintOutpaintPad?.bottom, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.bottom),
      left: clamp(input?.iopaintOutpaintPad?.left, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.left),
    },
    iopaintRemoveBgModel: pickOne(
      input?.iopaintRemoveBgModel,
      IOPAINT_REMOVEBG_MODELS.map((m) => m.id),
      DEFAULT_ENGINE.iopaintRemoveBgModel,
    ),
    iopaintFaceModel: pickOne(
      input?.iopaintFaceModel,
      IOPAINT_FACE_MODELS.map((m) => m.id),
      DEFAULT_ENGINE.iopaintFaceModel,
    ),
  };
}

export function sanitizeScene3DState(input?: Partial<Scene3DState>): Scene3DState {
  const focal = input?.focalLength;
  const validFocal = focal === 24 || focal === 35 || focal === 50 || focal === 85 ? focal : DEFAULT_SCENE3D.focalLength;
  return {
    preset: pickOne(input?.preset, ["pavilion", "villa", "loft", "civic", "plan-extrude", "custom-cad"], DEFAULT_SCENE3D.preset),
    sunAzimuth: clamp(input?.sunAzimuth, 0, 360, DEFAULT_SCENE3D.sunAzimuth),
    sunElevation: clamp(input?.sunElevation, 4, 85, DEFAULT_SCENE3D.sunElevation),
    fogDensity: clamp(input?.fogDensity, 0, 100, DEFAULT_SCENE3D.fogDensity),
    focalLength: validFocal,
    cameraPreset: pickOne(input?.cameraPreset, ["eye", "oblique", "aerial", "detail"], DEFAULT_SCENE3D.cameraPreset),
    primaryMaterial: pickOne(input?.primaryMaterial, ["concrete", "timber", "travertine", "brick"], DEFAULT_SCENE3D.primaryMaterial),
    modelRotationY: clamp(input?.modelRotationY, -180, 180, DEFAULT_SCENE3D.modelRotationY),
    modelScale: clampFloat(input?.modelScale, 0.6, 1.5, DEFAULT_SCENE3D.modelScale),
    modelElevation: clampFloat(input?.modelElevation, 0, 2.5, DEFAULT_SCENE3D.modelElevation),
    exposure: clampFloat(input?.exposure, 0.6, 1.6, DEFAULT_SCENE3D.exposure),
    d5LightPreset: pickOne(input?.d5LightPreset, ["noon", "golden", "blue-hour", "overcast"], DEFAULT_SCENE3D.d5LightPreset),
    twoPointTilt: typeof input?.twoPointTilt === "boolean" ? input.twoPointTilt : DEFAULT_SCENE3D.twoPointTilt,
    verticalShift: clampFloat(input?.verticalShift, -0.25, 0.25, DEFAULT_SCENE3D.verticalShift),
    geoEnabled: typeof input?.geoEnabled === "boolean" ? input.geoEnabled : DEFAULT_SCENE3D.geoEnabled,
    geoLatitude: clampFloat(input?.geoLatitude, -65, 65, DEFAULT_SCENE3D.geoLatitude),
    geoMonth: clamp(input?.geoMonth, 1, 12, DEFAULT_SCENE3D.geoMonth),
    geoHour: clampFloat(input?.geoHour, 0, 24, DEFAULT_SCENE3D.geoHour),
    hdriMood: pickOne(input?.hdriMood, ["studio", "clear-sky", "golden-dusk", "overcast-nordic"], DEFAULT_SCENE3D.hdriMood),
    materialPickMode: typeof input?.materialPickMode === "boolean" ? input.materialPickMode : DEFAULT_SCENE3D.materialPickMode,
    customModelName: typeof input?.customModelName === "string" ? input.customModelName.slice(0, 80) : null,
  };
}

/**
 * Computes Three.js solar rig coordinates and atmospheric lighting color/intensities
 * from solar azimuth (0-360°) and elevation (4-85°).
 */
export function computeSunPosition(azimuthDeg: number, elevationDeg: number, radius = 26) {
  const azRad = (azimuthDeg * Math.PI) / 180;
  const elRad = (Math.max(4, Math.min(85, elevationDeg)) * Math.PI) / 180;
  const cosEl = Math.cos(elRad);
  const x = Number((Math.sin(azRad) * cosEl * radius).toFixed(3));
  const y = Number((Math.sin(elRad) * radius).toFixed(3));
  const z = Number((Math.cos(azRad) * cosEl * radius).toFixed(3));

  const lowSun = elevationDeg < 18;
  const dusk = elevationDeg <= 10;
  const skyHex = dusk ? "#23364f" : lowSun ? "#cfd9e6" : "#dde6ef";
  const sunHex = dusk ? "#ff9f5a" : lowSun ? "#ffd29b" : "#fff7e8";
  const sunIntensity = dusk ? 1.15 : lowSun ? 1.85 : 2.35;
  const ambientIntensity = dusk ? 0.55 : lowSun ? 0.72 : 0.85;

  return { x, y, z, skyHex, sunHex, sunIntensity, ambientIntensity };
}

/**
 * Converts a 35mm architectural lens focal length (mm) to vertical field of view (degrees).
 */
export function focalLengthToFov(focalMm: number): number {
  const clamped = Math.max(14, Math.min(200, focalMm));
  const rad = 2 * Math.atan(24 / (2 * clamped));
  return Number(((rad * 180) / Math.PI).toFixed(2));
}

export function compileEngineBrief(
  design: DesignState,
  engine: EngineState,
  scene3d: Scene3DState,
  idea: string,
  options?: {
    hasSketch?: boolean;
    hasMask?: boolean;
    hasUploadedImage?: boolean;
    inpaintNote?: string;
    variationIndex?: number;
    frame?: Frame;
  },
): { prompt: string; parametersSummary: string; seed: number } {
  const seed = engine.seedLocked
    ? engine.seed + (options?.variationIndex ?? 0) * 137
    : ((engine.seed + 7919 + (options?.variationIndex ?? 0) * 313) % 9999999) + 1;

  const hasUpload = Boolean(options?.hasUploadedImage);
  const presetLabel = WORKFLOW_PRESETS.find((p) => p.id === engine.workflowPreset)?.label ?? "Photoreal Plate";
  const ratio = options?.frame?.ratio ?? "16:9";

  const preservationDirective = hasUpload
    ? `PIXEL-TO-PIXEL REGISTRATION LOCK (${Math.max(85, engine.geometryLock)}%): Preserve the exact camera position, elevation, pitch, lens FOV, horizon line, vanishing points, crop framing, and building/terrain silhouette of the attached uploaded image without zooming, panning, tilting, or re-framing.`
    : engine.geometryLock >= 80
      ? `STRICT GEOMETRY LOCK (${engine.geometryLock}%): Maintain exact structural silhouette, roof pitch, window openings, column rhythm, and 2-point perspective camera.`
      : engine.geometryLock >= 45
        ? `BALANCED GEOMETRY LOCK (${engine.geometryLock}%): Preserve overall spatial layout and key apertures while refining architectural relief.`
        : `FLEXIBLE EXPLORATION (${engine.geometryLock}%): Treat source geometry as loose compositional inspiration.`;

  const sketchDirective = options?.hasSketch
    ? `SKETCH CONDITIONING (PromeAI ${engine.sketchMode}, Edge Adherence ${engine.edgeAdherence}%): Follow supplied architectural line strokes and structural contours faithfully.`
    : "";

  const maskDirective = options?.hasMask
    ? buildIopaintDirective(engine, options?.inpaintNote || idea)
    : "";

  const facadeDirective = hasUpload
    ? ""
    : design.vertical === "exterior" || design.vertical === "landscape"
      ? `EXTERIOR FACADE (LookX): ${engine.facadeTypology}, adapted for ${engine.climateRegion} climate, style transfer weight ${engine.styleTransferWeight}%, ${engine.detailDensity} detail density.`
      : `INTERIOR STAGING (mnml.ai): ${design.picks.room ?? "Architectural volume"}, material override ${engine.materialOverride}%, ${engine.detailDensity} tactile detailing.`;

  const sceneDirective = hasUpload
    ? ""
    : `3D ENVIRONMENT (D5 Rig): ${scene3d.preset} massing in ${scene3d.primaryMaterial}, rot ${scene3d.modelRotationY}° scale ${scene3d.modelScale}x, ${scene3d.focalLength}mm lens, ${scene3d.d5LightPreset} light (az ${scene3d.sunAzimuth}° el ${scene3d.sunElevation}°), haze ${scene3d.fogDensity}%.`;

  const annotatorDirective = hasUpload
    ? ""
    : engine.annotatorMode !== "none"
      ? `CONTROLNET ANNOTATOR (lllyasviel): ${engine.annotatorMode.toUpperCase()} threshold ${engine.annotatorThreshold}%${engine.depthEnabled ? ` + Depth-Anything-V2 (weight ${engine.depthWeight}%)` : ""}.`
      : engine.depthEnabled
        ? `DEPTH CONDITIONING (Depth-Anything-V2): Monocular Z-depth lock weight ${engine.depthWeight}%.`
        : "";

  const refMatrixParts = [
    engine.refMatrix.massing.url ? `Massing-Ref (${engine.refMatrix.massing.weight}%)` : "",
    engine.refMatrix.material.url ? `Material-Ref (${engine.refMatrix.material.weight}%)` : "",
    engine.refMatrix.lighting.url ? `Lighting-Ref (${engine.refMatrix.lighting.weight}%)` : "",
  ].filter(Boolean);

  const ipAdapterDirective =
    engine.ipAdapterEnabled || refMatrixParts.length > 0
      ? `IP-ADAPTER PLUS (${engine.ipAdapterPreset}): weight ${engine.ipAdapterWeight}%, active steps ${engine.ipAdapterStartAt}%-${engine.ipAdapterEndAt}%${refMatrixParts.length ? ` · Matrix [${refMatrixParts.join(", ")}]` : ""}.`
      : "";

  const relightDirective =
    engine.relightPreset !== "none"
      ? `RELIGHT & SEASON TRANSFORM (${engine.relightPreset}): Lock architectural geometry 100% while transforming sky dome, shadow angles, and practical interior glow.`
      : "";

  const outpaintDirective =
    engine.outpaintRatio !== "none"
      ? `CANVAS OUTPAINT (${engine.outpaintRatio}): Extend frame seamlessly beyond original boundaries with coherent sky, paving, and surrounding architectural context.`
      : "";

  const twoPointDirective =
    !hasUpload && scene3d.twoPointTilt
      ? "CAMERA PROJECTION: 2-Point Vertical Tilt Lock enabled (plumb verticals)."
      : "";

  const samDirective = engine.samPrompt.trim()
    ? `GROUNDED-SAM TARGET: "${engine.samPrompt.trim()}" (sensitivity ${engine.samThreshold}%).`
    : "";

  const variationDirective =
    typeof options?.variationIndex === "number"
      ? `CONCEPT VARIATION #${options.variationIndex + 1} (Midjourney Chaos ${engine.mjChaos}): Introduce distinct lighting nuance or material accent within the same architectural brief.`
      : "";

  const mjTail = hasUpload
    ? `--seed ${seed}`
    : `--ar ${ratio} --s ${engine.mjStylize} --c ${engine.mjChaos} --seed ${seed}`;

  const sections = [
    `WORKFLOW: ${hasUpload ? "Pixel-Locked Upload Edit" : presetLabel} · Fidelity: ${engine.renderFidelity}`,
    preservationDirective,
    facadeDirective,
    sceneDirective,
    twoPointDirective,
    annotatorDirective,
    ipAdapterDirective,
    relightDirective,
    outpaintDirective,
    samDirective,
    sketchDirective,
    maskDirective,
    variationDirective,
    idea.trim() ? `USER DIRECTIVE: ${idea.trim()}` : "",
    `PARAMS: ${mjTail}`,
  ].filter(Boolean);

  return {
    prompt: sections.join("\n"),
    parametersSummary: hasUpload
      ? `Upload Pixel-Lock · Geo ${Math.max(85, engine.geometryLock)}% · --seed ${seed}`
      : `${presetLabel} · Geo ${engine.geometryLock}% · ${engine.annotatorMode !== "none" ? `${engine.annotatorMode.toUpperCase()} · ` : ""}${scene3d.focalLength}mm · --s ${engine.mjStylize} --seed ${seed}`,
    seed,
  };
}

export function buildIopaintDirective(engine: EngineState, inpaintNote?: string): string {
  const modelMeta = IOPAINT_MODELS.find((m) => m.id === engine.iopaintModel);
  const modelLabel = modelMeta?.label ?? engine.iopaintModel;
  const dilateNote = engine.iopaintMaskDilate > 0 ? `mask expand +${engine.iopaintMaskDilate}px` : "exact mask edge";
  const invertNote = engine.iopaintInvertMask ? "INVERTED MASK (preserve painted core, edit surrounding field)" : "masked region only";
  const note = inpaintNote?.trim() || "";

  switch (engine.iopaintTask) {
    case "erase":
      return `IOPAINT OBJECT ERASE (${modelLabel} · ${dilateNote} · ${invertNote}): Completely remove painted elements inside the mask (${note || "unwanted objects, people, cables, or artifacts"}) and reconstruct seamless background masonry, glazing, sky, and paving matching lighting and perspective 100%.`;
    case "outpaint":
      return `IOPAINT DIRECTIONAL OUTPAINT (${modelLabel} · pad T:${engine.iopaintOutpaintPad.top} R:${engine.iopaintOutpaintPad.right} B:${engine.iopaintOutpaintPad.bottom} L:${engine.iopaintOutpaintPad.left}px): Extend architectural scene outward into masked border padding seamlessly.${note ? ` Context: ${note}.` : ""}`;
    case "anytext": {
      const textVal = engine.iopaintAnyText.trim() || note || "STUDIO 01";
      return `IOPAINT ANYTEXT SIGNAGE (${modelLabel} · ${dilateNote}): Render exact crisp architectural lettering "${textVal}" inside the painted mask area matching perspective plane, ambient occlusion, and material reflection.`;
    }
    case "paint-by-example":
      return `IOPAINT PAINT-BY-EXAMPLE (${modelLabel} · Strength ${engine.inpaintStrength}% · ${dilateNote}): Harmonize and insert the supplied reference object/furniture cleanly inside the painted mask with physically accurate contact shadows and color temperature.${note ? ` Placement note: ${note}.` : ""}`;
    default:
      return `IOPAINT GENERATIVE REPLACE (${modelLabel} · Strength ${engine.inpaintStrength}% · ${dilateNote} · ${invertNote}): Modify ONLY the masked region (${note || "targeted architectural refinement"}), blending lighting and contact shadows seamlessly with untouched surroundings.`;
  }
}

export function normalizeQueueStatus(status: RenderQueueStatus): "pending" | "processing" | "completed" | "error" {
  if (status === "queued" || status === "pending") return "pending";
  if (status === "running" || status === "processing") return "processing";
  if (status === "done" || status === "completed") return "completed";
  return "error";
}

export function queueStatusLabel(status: RenderQueueStatus): "Pending" | "Processing" | "Completed" | "Failed" {
  const norm = normalizeQueueStatus(status);
  if (norm === "pending") return "Pending";
  if (norm === "processing") return "Processing";
  if (norm === "completed") return "Completed";
  return "Failed";
}

export function createQueueItem(
  label: string,
  preset: WorkflowPreset,
  light: string,
  options?: {
    cameraPreset?: CameraPreset3D;
    sunHour?: number;
    promptNote?: string;
    thumbnailUrl?: string;
    status?: RenderQueueStatus;
  },
): RenderQueueItem {
  return {
    id: `q-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    label: label.trim() || "Queued Scene",
    preset,
    light,
    cameraPreset: options?.cameraPreset,
    sunHour: options?.sunHour,
    promptNote: options?.promptNote,
    thumbnailUrl: options?.thumbnailUrl,
    status: options?.status ?? "pending",
    createdAt: Date.now(),
  };
}

export function updateQueueListStatus(
  queue: RenderQueueItem[],
  id: string,
  status: RenderQueueItem["status"],
  url?: string,
  extra?: { errorMessage?: string },
): RenderQueueItem[] {
  const now = Date.now();
  return queue.map((item) => {
    if (item.id !== id) return item;
    const norm = normalizeQueueStatus(status);
    const startedAt = norm === "processing" ? now : item.startedAt;
    const finishedAt = norm === "completed" || norm === "error" ? now : undefined;
    const durationMs =
      finishedAt && startedAt ? Math.max(120, finishedAt - startedAt) : item.durationMs;
    return {
      ...item,
      status,
      ...(url ? { url } : {}),
      ...(extra?.errorMessage ? { errorMessage: extra.errorMessage } : {}),
      startedAt,
      finishedAt,
      durationMs,
    };
  });
}
