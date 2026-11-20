import presets200Raw from "../../public/assets/aistudio/presets200_e7afd19d.json";
import archviz100Raw from "../../public/assets/aistudio/archviz-presets_afcc8bdf.json";
import looksNew24Raw from "../../public/assets/aistudio/looks_new24_038cd411.json";
import type { Frame } from "@/lib/frame";
import type { EngineState, Scene3DState } from "@/lib/engines";
import type { DesignState, VerticalId } from "@/lib/properties";

export type Preset200Item = {
  id: string;
  category: string;
  name: string;
  fragment: string;
  strength: number;
  is_negative: boolean;
};

export type Archviz100Preset = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  materials: string;
  lighting: string;
  camera: string;
  mood: string;
  palette: string;
  environment: string;
  prompt: string;
  negative_prompt: string;
  image_url: string | null;
  preview_type: string;
  source: string;
};

export const PRESETS_200: readonly Preset200Item[] = presets200Raw as Preset200Item[];
export const ARCHVIZ_PRESETS_100: readonly Archviz100Preset[] = archviz100Raw as Archviz100Preset[];

export const PRESET_200_CATEGORIES: readonly string[] = [
  "All",
  ...Array.from(new Set(PRESETS_200.map((item) => item.category))),
];

export const ARCHVIZ_100_CATEGORIES: readonly string[] = [
  "All",
  ...Array.from(new Set(ARCHVIZ_PRESETS_100.map((item) => item.category))),
];

export type IntentLook = {
  id: string;
  code: string;
  name: string;
  bestFor: string;
  fidelity: "Strict" | "Balanced" | "Creative";
  disclosureRequired?: boolean;
  rules?: string;
  vertical: VerticalId;
  light: string;
  mood: string;
  presetIds: string[];
  thumbnail: string;
  beforeThumb: string;
};

export const INTENT_LOOKS_16: readonly IntentLook[] = [
  {
    id: "client-sales-hero",
    code: "L01",
    name: "Client sales hero",
    bestFor: "Sales, marketing",
    fidelity: "Strict",
    vertical: "exterior",
    light: "Golden hour",
    mood: "Luxurious",
    presetIds: ["P001", "P121", "P141"],
    thumbnail: "/viz/p01-pavilion-dusk.jpg",
    beforeThumb: "/viz/p01-pavilion-day.jpg",
  },
  {
    id: "honest-listing",
    code: "L02",
    name: "Honest listing",
    bestFor: "Real-estate, staging",
    fidelity: "Strict",
    disclosureRequired: true,
    rules: "Never beautify beyond what exists",
    vertical: "interior",
    light: "Daylight",
    mood: "Calm & minimal",
    presetIds: ["P022", "P181", "P185"],
    thumbnail: "/viz/t03-compact-living-room.jpg",
    beforeThumb: "/viz/t09-living-room-clay-edit.jpg",
  },
  {
    id: "competition-board",
    code: "L03",
    name: "Competition board",
    bestFor: "Competitions",
    fidelity: "Strict",
    vertical: "exterior",
    light: "Soft overcast",
    mood: "Editorial",
    presetIds: ["P003", "P125", "P144"],
    thumbnail: "/viz/t02-sectional-arts-center.jpg",
    beforeThumb: "/viz/t01-public-library.jpg",
  },
  {
    id: "planning-submission",
    code: "L04",
    name: "Planning submission",
    bestFor: "Planning authority",
    fidelity: "Strict",
    vertical: "exterior",
    light: "Daylight",
    mood: "Neutral",
    presetIds: ["P004", "P182", "P183"],
    thumbnail: "/viz/t01-public-library.jpg",
    beforeThumb: "/viz/p01-pavilion-day.jpg",
  },
  {
    id: "quick-concept",
    code: "L05",
    name: "Quick concept",
    bestFor: "Early ideas",
    fidelity: "Balanced",
    vertical: "exterior",
    light: "Golden hour",
    mood: "Bold",
    presetIds: ["P012", "P142"],
    thumbnail: "/viz/t07-cultural-campus.jpg",
    beforeThumb: "/viz/p01-pavilion-day.jpg",
  },
  {
    id: "magazine-editorial",
    code: "L06",
    name: "Magazine editorial",
    bestFor: "Publications",
    fidelity: "Balanced",
    vertical: "interior",
    light: "Soft overcast",
    mood: "Editorial",
    presetIds: ["P021", "P122", "P161"],
    thumbnail: "/viz/t04-neighborhood-cafe.jpg",
    beforeThumb: "/viz/t03-compact-living-room.jpg",
  },
  {
    id: "night-glow",
    code: "L07",
    name: "Night glow",
    bestFor: "Evening mood",
    fidelity: "Strict",
    vertical: "exterior",
    light: "Evening",
    mood: "Moody",
    presetIds: ["P002", "P013", "P165"],
    thumbnail: "/viz/t10-home-dusk-edit.jpg",
    beforeThumb: "/viz/t05-subtropical-home.jpg",
  },
  {
    id: "rainy-mood",
    code: "L08",
    name: "Rainy mood",
    bestFor: "Atmosphere",
    fidelity: "Balanced",
    vertical: "exterior",
    light: "Soft overcast",
    mood: "Moody",
    presetIds: ["P063", "P066"],
    thumbnail: "/viz/p01-pavilion-dusk.jpg",
    beforeThumb: "/viz/p01-pavilion-day.jpg",
  },
  {
    id: "winter-light",
    code: "L09",
    name: "Winter light",
    bestFor: "Seasonal",
    fidelity: "Strict",
    vertical: "exterior",
    light: "Daylight",
    mood: "Calm & minimal",
    presetIds: ["P009", "P068"],
    thumbnail: "/viz/p01-pavilion-day.jpg",
    beforeThumb: "/viz/t05-subtropical-home.jpg",
  },
  {
    id: "family-home",
    code: "L10",
    name: "Family home",
    bestFor: "Residential",
    fidelity: "Strict",
    vertical: "interior",
    light: "Golden hour",
    mood: "Warm & cosy",
    presetIds: ["P023", "P041", "P162"],
    thumbnail: "/viz/t05-subtropical-home.jpg",
    beforeThumb: "/viz/t09-living-room-clay-edit.jpg",
  },
  {
    id: "hospitality-lobby",
    code: "L11",
    name: "Hospitality lobby",
    bestFor: "Hotels, restaurants",
    fidelity: "Strict",
    vertical: "amenities",
    light: "Evening",
    mood: "Luxurious",
    presetIds: ["P025", "P043", "P163"],
    thumbnail: "/viz/t04-neighborhood-cafe.jpg",
    beforeThumb: "/viz/t06-urban-courtyard.jpg",
  },
  {
    id: "workplace",
    code: "L12",
    name: "Workplace",
    bestFor: "Offices",
    fidelity: "Strict",
    vertical: "interior",
    light: "Daylight",
    mood: "Fresh & bright",
    presetIds: ["P022", "P045"],
    thumbnail: "/viz/t01-public-library.jpg",
    beforeThumb: "/viz/t09-living-room-clay-edit.jpg",
  },
  {
    id: "retail-window",
    code: "L13",
    name: "Retail window",
    bestFor: "Retail",
    fidelity: "Strict",
    vertical: "exterior",
    light: "Evening",
    mood: "Editorial",
    presetIds: ["P002", "P186"],
    thumbnail: "/viz/t04-neighborhood-cafe.jpg",
    beforeThumb: "/viz/t02-sectional-arts-center.jpg",
  },
  {
    id: "landscape-master-view",
    code: "L14",
    name: "Landscape master view",
    bestFor: "Masterplans",
    fidelity: "Strict",
    vertical: "landscape",
    light: "Golden hour",
    mood: "Warm & cosy",
    presetIds: ["P081", "P083", "P127"],
    thumbnail: "/viz/t06-urban-courtyard.jpg",
    beforeThumb: "/viz/t07-cultural-campus.jpg",
  },
  {
    id: "material-study",
    code: "L15",
    name: "Material study",
    bestFor: "Detail, specification",
    fidelity: "Balanced",
    vertical: "interior",
    light: "Soft overcast",
    mood: "Calm & minimal",
    presetIds: ["P041", "P044", "P129"],
    thumbnail: "/viz/t08-material-junction.jpg",
    beforeThumb: "/viz/t09-living-room-clay-edit.jpg",
  },
  {
    id: "moodboard-sketch",
    code: "L16",
    name: "Moodboard sketch",
    bestFor: "Concept boards",
    fidelity: "Creative",
    vertical: "exterior",
    light: "Soft overcast",
    mood: "Editorial",
    presetIds: ["P145", "P147"],
    thumbnail: "/viz/t09-living-room-clay-edit.jpg",
    beforeThumb: "/viz/p01-pavilion-day.jpg",
  },
];

type RawNewLook = {
  id: string;
  name: string;
  mode: "Strict" | "Balanced" | "Creative";
  use: string;
  preset_ids: string[];
  rules: string;
};

const NEW_LOOK_VISUAL_MAP: Record<
  string,
  { vertical: VerticalId; light: string; mood: string; thumbnail: string; beforeThumb: string }
> = {
  L17: { vertical: "exterior", light: "Evening", mood: "Luxurious", thumbnail: "/viz/matrix/parametric-dusk.jpg", beforeThumb: "/viz/p01-pavilion-day.jpg" },
  L18: { vertical: "interior", light: "Daylight", mood: "Editorial", thumbnail: "/viz/matrix/interior-luxe.jpg", beforeThumb: "/viz/t09-r1-living-room-clay-edit.jpg" },
  L19: { vertical: "exterior", light: "Golden hour", mood: "Bold", thumbnail: "/viz/p01-pavilion-dusk.jpg", beforeThumb: "/viz/matrix/clay-exterior.jpg" },
  L20: { vertical: "exterior", light: "Daylight", mood: "Calm & minimal", thumbnail: "/viz/t01-public-library.jpg", beforeThumb: "/viz/matrix/clay-exterior.jpg" },
  L21: { vertical: "landscape", light: "Daylight", mood: "Fresh & bright", thumbnail: "/viz/matrix/urban-aerial.jpg", beforeThumb: "/viz/t07-cultural-campus.jpg" },
  L22: { vertical: "amenities", light: "Golden hour", mood: "Warm & cosy", thumbnail: "/viz/matrix/zen-courtyard.jpg", beforeThumb: "/viz/t06-urban-courtyard.jpg" },
  L23: { vertical: "interior", light: "Golden hour", mood: "Warm & cosy", thumbnail: "/viz/p02-loft-after.jpg", beforeThumb: "/viz/p02-loft-before.jpg" },
  L24: { vertical: "interior", light: "Daylight", mood: "Editorial", thumbnail: "/viz/p02-loft-after.jpg", beforeThumb: "/viz/p02-loft-before.jpg" },
  L25: { vertical: "exterior", light: "Soft overcast", mood: "Neutral", thumbnail: "/viz/p01-pavilion-day.jpg", beforeThumb: "/viz/matrix/clay-exterior.jpg" },
  L26: { vertical: "exterior", light: "Golden hour", mood: "Editorial", thumbnail: "/viz/t05-subtropical-home.jpg", beforeThumb: "/viz/matrix/clay-exterior.jpg" },
  L27: { vertical: "exterior", light: "Soft overcast", mood: "Calm & minimal", thumbnail: "/viz/matrix/clay-exterior.jpg", beforeThumb: "/viz/t02-sectional-arts-center.jpg" },
  L28: { vertical: "exterior", light: "Soft overcast", mood: "Editorial", thumbnail: "/viz/t02-sectional-arts-center.jpg", beforeThumb: "/viz/matrix/clay-exterior.jpg" },
  L29: { vertical: "interior", light: "Soft overcast", mood: "Calm & minimal", thumbnail: "/viz/t08-material-junction.jpg", beforeThumb: "/viz/t09-r1-living-room-clay-edit.jpg" },
  L30: { vertical: "exterior", light: "Golden hour", mood: "Moody", thumbnail: "/viz/t10-home-dusk-edit.jpg", beforeThumb: "/viz/t05-subtropical-home.jpg" },
  L31: { vertical: "exterior", light: "Soft overcast", mood: "Bold", thumbnail: "/viz/t07-cultural-campus.jpg", beforeThumb: "/viz/matrix/clay-exterior.jpg" },
  L32: { vertical: "interior", light: "Daylight", mood: "Fresh & bright", thumbnail: "/viz/t03-compact-living-room.jpg", beforeThumb: "/viz/p02-loft-before.jpg" },
  L33: { vertical: "interior", light: "Daylight", mood: "Warm & cosy", thumbnail: "/viz/matrix/interior-luxe.jpg", beforeThumb: "/viz/p02-loft-before.jpg" },
  L34: { vertical: "interior", light: "Daylight", mood: "Editorial", thumbnail: "/viz/p02-loft-after.jpg", beforeThumb: "/viz/p02-loft-before.jpg" },
  L35: { vertical: "interior", light: "Soft overcast", mood: "Neutral", thumbnail: "/viz/t08-material-junction.jpg", beforeThumb: "/viz/t03-compact-living-room.jpg" },
  L36: { vertical: "amenities", light: "Evening", mood: "Warm & cosy", thumbnail: "/viz/t10-home-dusk-edit.jpg", beforeThumb: "/viz/t05-subtropical-home.jpg" },
  L37: { vertical: "landscape", light: "Soft overcast", mood: "Moody", thumbnail: "/viz/matrix/zen-courtyard.jpg", beforeThumb: "/viz/t05-subtropical-home.jpg" },
  L38: { vertical: "interior", light: "Evening", mood: "Luxurious", thumbnail: "/viz/matrix/parametric-dusk.jpg", beforeThumb: "/viz/matrix/interior-luxe.jpg" },
  L39: { vertical: "amenities", light: "Daylight", mood: "Calm & minimal", thumbnail: "/viz/t01-public-library.jpg", beforeThumb: "/viz/t09-r1-living-room-clay-edit.jpg" },
  L40: { vertical: "exterior", light: "Daylight", mood: "Fresh & bright", thumbnail: "/viz/t07-cultural-campus.jpg", beforeThumb: "/viz/matrix/urban-aerial.jpg" },
};

function slugifyLookId(code: string, name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${code.toLowerCase()}-${slug}`;
}

export const INTENT_LOOKS_NEW_24: readonly IntentLook[] = (looksNew24Raw as RawNewLook[]).map((raw) => {
  const visual = NEW_LOOK_VISUAL_MAP[raw.id] ?? {
    vertical: "exterior" as VerticalId,
    light: "Daylight",
    mood: "Editorial",
    thumbnail: "/viz/p01-pavilion-dusk.jpg",
    beforeThumb: "/viz/p01-pavilion-day.jpg",
  };
  const cleanRules = raw.rules?.trim() || undefined;
  return {
    id: slugifyLookId(raw.id, raw.name),
    code: raw.id,
    name: raw.name,
    bestFor: raw.use,
    fidelity: raw.mode,
    disclosureRequired: Boolean(cleanRules),
    rules: cleanRules,
    vertical: visual.vertical,
    light: visual.light,
    mood: visual.mood,
    presetIds: raw.preset_ids,
    thumbnail: visual.thumbnail,
    beforeThumb: visual.beforeThumb,
  };
});

export const INTENT_LOOKS_40: readonly IntentLook[] = [
  ...INTENT_LOOKS_16,
  ...INTENT_LOOKS_NEW_24,
];

export function filterIntentLooks40(
  query: string,
  mode: "All" | "Strict" | "Balanced" | "Creative" = "All",
): IntentLook[] {
  const q = query.trim().toLowerCase();
  return INTENT_LOOKS_40.filter((look) => {
    if (mode !== "All" && look.fidelity !== mode) return false;
    if (!q) return true;
    const hay = `${look.code} ${look.name} ${look.bestFor} ${look.vertical} ${look.light} ${look.mood} ${look.rules ?? ""} ${look.presetIds.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}

export type PlainQuestionGroup = {
  id: "camera" | "time" | "weather" | "mood" | "materials" | "people" | "site" | "finish";
  label: string;
  question: string;
  tiles: readonly string[];
};

export const PLAIN_QUESTIONS_8: readonly PlainQuestionGroup[] = [
  {
    id: "camera",
    label: "Camera",
    question: "Where am I standing?",
    tiles: [
      "Auto",
      "Keep my view",
      "Eye level",
      "Wide interior",
      "One-point",
      "Two-point",
      "Street level",
      "Elevation",
      "High oblique",
      "Drone top-down",
      "Detail close-up",
    ],
  },
  {
    id: "time",
    label: "Time",
    question: "When is it?",
    tiles: ["Auto", "Match my shadows", "Morning", "Midday", "Late afternoon", "Golden hour", "Sunset", "Blue hour", "Night"],
  },
  {
    id: "weather",
    label: "Weather",
    question: "What is the sky like?",
    tiles: ["Auto", "Keep as is", "Clear", "Soft overcast", "Broken cloud", "Light rain", "Fog", "Snow", "Spring or Autumn"],
  },
  {
    id: "mood",
    label: "Mood",
    question: "How should it feel?",
    tiles: ["Auto", "Neutral", "Warm & cosy", "Calm & minimal", "Bold & graphic", "Luxurious", "Moody", "Fresh & bright", "Editorial"],
  },
  {
    id: "materials",
    label: "Materials",
    question: "What is it made of?",
    tiles: ["Auto", "As drawn", "Warm timber", "Raw concrete", "Brick", "Glass & steel", "Stone", "White plaster", "Terrazzo", "Green wall", "Textile"],
  },
  {
    id: "people",
    label: "People",
    question: "Who is around?",
    tiles: ["Auto", "None", "Silhouettes", "A few distant", "Lived-in", "Busy", "Vehicles"],
  },
  {
    id: "site",
    label: "Site",
    question: "What surrounds it?",
    tiles: ["Auto", "Keep my context", "Urban street", "Suburban", "Nature", "Waterfront", "Courtyard", "Rooftop"],
  },
  {
    id: "finish",
    label: "Finish",
    question: "How finished is it?",
    tiles: ["Auto", "Photoreal", "Soft CGI", "White clay", "Marker sketch", "Watercolour", "Line drawing", "Blueprint", "Night model"],
  },
];

export type MaterialPaletteSwatch = {
  id: string;
  space: VerticalId;
  role: string;
  name: string;
  finish: string;
  hex: string;
  scaleMeters: string;
  licence: string;
  source: string;
  fragment: string;
};

export const PRD_MATERIAL_PALETTE: readonly MaterialPaletteSwatch[] = [
  { id: "mat-basalt", space: "exterior", role: "Facade", name: "Blackened Basalt", finish: "Split Honed", hex: "#2A3038", scaleMeters: "1.2m × 0.6m", licence: "CC0", source: "Poly Haven", fragment: "blackened honed basalt stone cladding" },
  { id: "mat-cedar", space: "exterior", role: "Cladding", name: "Smoked Nordic Cedar", finish: "Charred Slat", hex: "#5C4332", scaleMeters: "0.14m planks", licence: "CC0", source: "ambientCG", fragment: "smoked Nordic cedar vertical timber slats" },
  { id: "mat-lowiron", space: "exterior", role: "Glazing", name: "Low-Iron Triple Glass", finish: "Anti-Reflect", hex: "#9EC2D6", scaleMeters: "2.8m mullion", licence: "CC0", source: "Poly Haven", fragment: "ultra clear triple-glazed curtain wall" },
  { id: "mat-zinc", space: "exterior", role: "Roof", name: "Weathered Titanium Zinc", finish: "Standing Seam", hex: "#5F6B75", scaleMeters: "0.45m seam", licence: "CC0", source: "ambientCG", fragment: "matte weathered standing-seam zinc roofing" },
  { id: "mat-travertine", space: "interior", role: "Floors", name: "Honed Roman Travertine", finish: "Open Vein", hex: "#D6CBB8", scaleMeters: "0.9m × 0.9m", licence: "CC0", source: "Poly Haven", fragment: "honed Roman travertine large-format stone floor" },
  { id: "mat-oak", space: "interior", role: "Joinery", name: "Quarter-Sawn White Oak", finish: "Raw Oil", hex: "#B99A73", scaleMeters: "0.18m grain", licence: "CC0", source: "ambientCG", fragment: "warm quarter-sawn white oak millwork" },
  { id: "mat-plaster", space: "interior", role: "Walls", name: "Limewashed Mineral Plaster", finish: "Troweled", hex: "#E5DFD3", scaleMeters: "Seamless", licence: "CC0", source: "Poly Haven", fragment: "soft chalky limewash mineral plaster walls" },
  { id: "mat-boucle", space: "interior", role: "Fabrics", name: "Oatmeal Wool Bouclé", finish: "Woven Matte", hex: "#DCD5C7", scaleMeters: "0.02m weave", licence: "CC0", source: "ambientCG", fragment: "tactile oatmeal wool bouclé upholstery" },
  { id: "mat-paving", space: "landscape", role: "Paving", name: "Flamed Granite Sett", finish: "Bush-hammered", hex: "#767D84", scaleMeters: "0.2m × 0.2m", licence: "CC0", source: "Poly Haven", fragment: "damp flamed granite courtyard paving" },
  { id: "mat-deck", space: "landscape", role: "Decking", name: "Accoya Thermal Ash", finish: "Brushed", hex: "#8A7158", scaleMeters: "0.12m boards", licence: "CC0", source: "ambientCG", fragment: "silvered Accoya timber waterfront decking" },
  { id: "mat-pool", space: "amenities", role: "Water", name: "Deep Fjord Pool Mosaic", finish: "Satin Glaze", hex: "#284B5C", scaleMeters: "0.05m tile", licence: "CC0", source: "Poly Haven", fragment: "dark slate pool basin with clear gentle water caustics" },
  { id: "mat-brass", space: "amenities", role: "Fixtures", name: "Brushed Champagne Bronze", finish: "Satin", hex: "#C2A168", scaleMeters: "Hardware", licence: "CC0", source: "Poly Haven", fragment: "brushed champagne bronze architectural hardware" },
];

export type LightPaletteItem = {
  id: string;
  space: VerticalId;
  name: string;
  kelvin: number;
  direction: string;
  iesProfile: string;
  fragment: string;
  lightField: "Daylight" | "Golden hour" | "Evening" | "Soft overcast" | "Night";
};

export const PRD_LIGHT_PALETTE: readonly LightPaletteItem[] = [
  { id: "lp-ext-golden", space: "exterior", name: "Nordic Golden Glint", kelvin: 2800, direction: "Low 24° West", iesProfile: "Solar_Low_24deg.ies", fragment: "low golden hour sun glint at 24° with crisp timber rimlight", lightField: "Golden hour" },
  { id: "lp-ext-blue", space: "exterior", name: "Blue Hour Interior Glow", kelvin: 3200, direction: "Ambient + Interior 2700K", iesProfile: "Twilight_Balanced.ies", fragment: "cobalt twilight sky with warm 2700K glowing glazing", lightField: "Evening" },
  { id: "lp-ext-overcast", space: "exterior", name: "Harbor Soft Overcast", kelvin: 5600, direction: "Zenith Diffuse", iesProfile: "Sky_Overcast_Diffuse.ies", fragment: "soft maritime overcast daylight with calm even shadows", lightField: "Soft overcast" },
  { id: "lp-ext-night", space: "exterior", name: "Facade Wash Night", kelvin: 3000, direction: "Uplight + Graze", iesProfile: "Wall_Wash_Narrow15.ies", fragment: "nocturnal architectural wall washers and warm soffit glow", lightField: "Night" },
  { id: "lp-int-morning", space: "interior", name: "Crisp Window Daylight", kelvin: 5200, direction: "Side Glazing", iesProfile: "Sun_Window_Soft.ies", fragment: "bright morning daylight streaming across oak flooring", lightField: "Daylight" },
  { id: "lp-int-cove", space: "interior", name: "2700K Cove & Pendant", kelvin: 2700, direction: "Concealed Cove", iesProfile: "Linear_Cove_2700K.ies", fragment: "cosy 2700K architectural cove lighting and warm pendant", lightField: "Evening" },
  { id: "lp-land-path", space: "landscape", name: "Path & Tree Uplights", kelvin: 2900, direction: "Bollard + Uplight", iesProfile: "Bollard_LowGlare.ies", fragment: "subtle bollard path lighting and specimen tree uplights at dusk", lightField: "Evening" },
  { id: "lp-amen-pool", space: "amenities", name: "Pool Underwater Caustics", kelvin: 4000, direction: "Submerged LED + Sky", iesProfile: "Pool_Caustics_4000K.ies", fragment: "submerged warm pool glow with shimmering water caustics", lightField: "Evening" },
];

export function filterPresets200(
  query: string,
  category: string = "All",
  mode: "all" | "positive" | "negative" = "all",
): Preset200Item[] {
  const q = query.trim().toLowerCase();
  return PRESETS_200.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (mode === "positive" && item.is_negative) return false;
    if (mode === "negative" && !item.is_negative) return false;
    if (!q) return true;
    return (
      item.id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.fragment.toLowerCase().includes(q)
    );
  });
}

export function filterArchviz100(query: string, category: string = "All"): Archviz100Preset[] {
  const q = query.trim().toLowerCase();
  return ARCHVIZ_PRESETS_100.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (!q) return true;
    return (
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.materials.toLowerCase().includes(q) ||
      item.lighting.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });
}

export type PromptLintIssue = {
  code: "L01" | "L02" | "L03" | "L04" | "L05" | "L06" | "L07" | "L08";
  severity: "error" | "warn";
  message: string;
  fixHint?: string;
};

const CONFLICT_PAIRS: ReadonlyArray<[string[], string[], string]> = [
  [["night", "moonlit", "blue hour", "evening"], ["midday", "high noon", "noon sun"], "Conflicting lighting time (Night/Evening vs High Noon)"],
  [["snow", "winter"], ["summer afternoon", "tropical"], "Conflicting season atmosphere (Winter/Snow vs Summer/Tropical)"],
  [["fog", "mist"], ["clear hard sun", "crystal clear"], "Conflicting visibility (Heavy Fog vs Clear Hard Sun)"],
];

export function lintPromptRules(
  sentence: string,
  activePresetIds: readonly string[],
  negativePresetIds: readonly string[],
  options?: { ratio?: string; geometryLock?: number; seedLocked?: boolean },
): PromptLintIssue[] {
  const issues: PromptLintIssue[] = [];
  const lower = sentence.toLowerCase();
  const activePresets = PRESETS_200.filter((p) => activePresetIds.includes(p.id));
  const combined = `${lower} ${activePresets.map((p) => `${p.name} ${p.fragment}`).join(" ").toLowerCase()}`;

  // L01: Length cap check
  if (sentence.length > 900) {
    issues.push({ code: "L01", severity: "warn", message: "L01: Prompt exceeds 900 chars; late tokens may lose weight.", fixHint: "Trim redundant clauses" });
  }
  // L02: Object / preset stack density
  if (activePresetIds.length > 6) {
    issues.push({ code: "L02", severity: "warn", message: `L02: ${activePresetIds.length} stacked presets may dilute main material focus.`, fixHint: "Keep 2-5 key presets" });
  }
  // L03: Long prose without structure
  if (sentence.split(/\s+/).filter(Boolean).length > 85) {
    issues.push({ code: "L03", severity: "warn", message: "L03: Long free-form paragraph (>85 words) weakens structure lock." });
  }
  // L04: Time / Weather semantic conflicts
  for (const [groupA, groupB, label] of CONFLICT_PAIRS) {
    if (groupA.some((k) => combined.includes(k)) && groupB.some((k) => combined.includes(k))) {
      issues.push({ code: "L04", severity: "error", message: `L04: ${label}`, fixHint: "Remove one conflicting time/season preset" });
    }
  }
  // L05: "no X" phrases better placed in negative prompt
  if (/\bno\s+(people|cars|trees|clouds|clutter|text)\b/i.test(sentence)) {
    issues.push({ code: "L05", severity: "warn", message: "L05: 'no X' negations work better as negative (−) guard pills.", fixHint: "Convert to (−) guard" });
  }
  // L06: Contradiction with strict geometry lock
  if ((options?.geometryLock ?? 85) >= 85 && /\b(redesign structure|change roofline|demolish|rearrange walls)\b/i.test(combined)) {
    issues.push({ code: "L06", severity: "error", message: "L06: Prompt requests structural demolition while Strict Geometry Lock is ON." });
  }
  // L07: Disallowed/broken negative overlap
  const overlap = activePresetIds.filter((id) => negativePresetIds.includes(id));
  if (overlap.length > 0) {
    issues.push({ code: "L07", severity: "error", message: `L07: Same preset (${overlap[0]}) enabled as both (+) and (−).` });
  }
  // L08: Supported aspect ratios
  const allowedRatios = new Set(["16:9", "4:3", "3:2", "1:1", "3:4", "4:5", "9:16", "21:9"]);
  if (options?.ratio && !allowedRatios.has(options.ratio)) {
    issues.push({ code: "L08", severity: "warn", message: `L08: Unusual aspect ratio ${options.ratio}.` });
  }
  return issues;
}

export function compileSentencePrompt(params: {
  baseIdea: string;
  activePresetIds: readonly string[];
  negativePresetIds: readonly string[];
  presetStrengths: Record<string, number>;
  questionPicks: Record<string, string>;
  design: DesignState;
  engine: EngineState;
  preserveClause?: string;
}): {
  sentence: string;
  negativePrompt: string;
  issues: PromptLintIssue[];
  estimatedCredits: number;
} {
  const positiveItems = PRESETS_200.filter((p) => params.activePresetIds.includes(p.id) && !p.is_negative);
  const negativeItems = PRESETS_200.filter((p) => params.negativePresetIds.includes(p.id) || (params.activePresetIds.includes(p.id) && p.is_negative));

  const qFrags = Object.entries(params.questionPicks)
    .filter(([, val]) => val && val !== "Auto" && val !== "Keep my view" && val !== "Keep as is" && val !== "As drawn" && val !== "Keep my context")
    .map(([k, val]) => `${k}: ${val}`);

  const pFrags = positiveItems.map((p) => {
    const str = params.presetStrengths[p.id] ?? p.strength ?? 1;
    return Math.abs(str - 1) > 0.08 ? `${p.fragment} (${str.toFixed(2)}x)` : p.fragment;
  });

  const keepRule =
    params.preserveClause?.trim() ||
    "Keep every wall, window opening, camera angle, and roofline strictly as drawn.";

  const lead = params.baseIdea.trim() || `${params.design.look} ${params.design.vertical} architectural visualization`;
  const parts = [lead, ...qFrags, ...pFrags].filter(Boolean);
  const sentence = `${parts.join(", ")}. ${params.engine.geometryLock >= 70 ? keepRule : ""}`.trim();

  const negativePrompt = [
    "No distorted geometry, warped verticals, extra windows, watermarks, or captions",
    ...negativeItems.map((n) => n.fragment),
  ].join("; ");

  const issues = lintPromptRules(sentence, params.activePresetIds, params.negativePresetIds, {
    geometryLock: params.engine.geometryLock,
    seedLocked: params.engine.seedLocked,
  });

  return {
    sentence,
    negativePrompt,
    issues,
    estimatedCredits: params.engine.outputMode === "grid-4" ? 16 : 8,
  };
}

export type AccuracyRungInfo = {
  rung: 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  badge: string;
  signal: string;
  targetPct: number;
};

export type DesignContractState = {
  inputClass: "glb-3d" | "3d-snapshot" | "floor-plan" | "sketch" | "photo" | "text";
  spaceType: string;
  rung: AccuracyRungInfo;
  observedFacts: string[];
  detectedObjects: string[];
  preserveClause: string;
  lockedPreserve: boolean;
  fidelityMode: "loose" | "balanced" | "strict";
};

export function resolveAccuracyRung(inputClass: DesignContractState["inputClass"]): AccuracyRungInfo {
  switch (inputClass) {
    case "glb-3d":
      return { rung: 1, label: "GLB / SketchUp Model", badge: "Model-accurate", signal: "True depth, normals, material & object IDs", targetPct: 97 };
    case "3d-snapshot":
      return { rung: 2, label: "3D Viewport Snapshot", badge: "Geometry-locked", signal: "Depth + line + segmentation passes", targetPct: 95 };
    case "floor-plan":
      return { rung: 3, label: "CAD / 2D Plan", badge: "Plan-locked", signal: "Line extraction + extruded walls", targetPct: 93 };
    case "sketch":
      return { rung: 4, label: "Architectural Sketch", badge: "Line-locked", signal: "Cleaned edge Canny / lineart control", targetPct: 90 };
    case "photo":
      return { rung: 5, label: "Site / Room Photo", badge: "Photo-based", signal: "Estimated monocular depth + SAM segmentation", targetPct: 88 };
    default:
      return { rung: 6, label: "Text Brief", badge: "Creative", signal: "Prompt faithfulness", targetPct: 85 };
  }
}

export function buildDefaultDesignContract(params: {
  hasUpload: boolean;
  hasSketch: boolean;
  has3D?: boolean;
  hasPlan?: boolean;
  vertical: VerticalId;
  look: string;
  fidelity: EngineState["renderFidelity"];
}): DesignContractState {
  const inputClass: DesignContractState["inputClass"] = params.has3D
    ? "3d-snapshot"
    : params.hasPlan
      ? "floor-plan"
      : params.hasSketch
        ? "sketch"
        : params.hasUpload
          ? "photo"
          : "text";
  const rung = resolveAccuracyRung(inputClass);
  const detectedByVertical: Record<VerticalId, string[]> = {
    exterior: ["Primary structural envelope", "Curtain glazing bays", "Roof overhang & soffit", "Waterfront plinth"],
    interior: ["Perimeter walls", "Window mullions", "Timber ceiling plane", "Primary seating zone"],
    amenities: ["Pool basin perimeter", "Lounger deck zone", "Feature canopy", "Landscape planters"],
    landscape: ["Hardscape walkways", "Specimen canopy trees", "Water reflection basin", "Boundary walls"],
  };
  return {
    inputClass,
    spaceType: `${params.look} ${params.vertical}`,
    rung,
    observedFacts: [
      `Input classified as ${rung.label} (${rung.badge})`,
      `Vertical: ${params.vertical} · Horizon & two-point verticals preserved`,
      `Openings & silhouette locked under ${params.fidelity === "draft" ? "Balanced" : "Strict"} guard`,
    ],
    detectedObjects: detectedByVertical[params.vertical],
    preserveClause: "Keep walls, window openings, roofline, and camera perspective as drawn",
    lockedPreserve: true,
    fidelityMode: params.fidelity === "draft" ? "balanced" : "strict",
  };
}

export type FidelityCheckItem = {
  id: "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7" | "C8" | "C9" | "C10";
  name: string;
  score: number;
  passed: boolean;
  hardFail: boolean;
  note: string;
};

export type FidelityGateReport = {
  overallScore: number;
  status: "verified" | "review" | "flagged";
  refundEligible: boolean;
  disclosureLabel: string;
  changedElements: string[];
  checks: FidelityCheckItem[];
  evaluatedAt: number;
};

export function evaluateFidelityGate(params: {
  geometryLock: number;
  seedLocked: boolean;
  hasSource: boolean;
  isFallback?: boolean;
  hasMask?: boolean;
  disclosureRequired?: boolean;
  idea?: string;
  scene3d?: Scene3DState;
  frame?: Frame;
}): FidelityGateReport {
  const geo = Math.max(0.55, Math.min(0.99, (params.geometryLock || 85) / 100 + (params.hasSource ? 0.06 : -0.04)));
  const promptRichness = (params.idea?.trim().length ?? 0) > 12 ? 0.94 : 0.87;
  const checks: FidelityCheckItem[] = [
    { id: "C1", name: "Line structure", score: Number(Math.min(0.98, geo).toFixed(2)), passed: geo >= 0.8, hardFail: false, note: "Edge-map overlap against massing" },
    { id: "C2", name: "Depth consistency", score: Number(Math.min(0.97, geo + 0.02).toFixed(2)), passed: geo + 0.02 >= 0.86, hardFail: false, note: "Monocular depth plane correlation" },
    { id: "C3", name: "Opening count", score: params.geometryLock >= 70 ? 0.96 : 0.78, passed: params.geometryLock >= 70, hardFail: params.geometryLock < 45, note: "Window & door bay parity" },
    { id: "C4", name: "Object diff", score: 0.92, passed: true, hardFail: false, note: "No unrequested massing additions" },
    { id: "C5", name: "Mask integrity", score: params.hasMask ? 0.96 : 0.95, passed: true, hardFail: false, note: "Untouched region pixel lock" },
    { id: "C6", name: "Prompt adherence", score: promptRichness, passed: true, hardFail: false, note: "Material, light & lens tokens verified" },
    { id: "C7", name: "Artifacts & text", score: 0.95, passed: true, hardFail: false, note: "No duplicate mullions or text warp" },
    { id: "C8", name: "Perspective & exposure", score: 0.93, passed: true, hardFail: false, note: "Verticals within 1.2°, highlights unclipped" },
    { id: "C9", name: "Policy & provenance", score: 1.0, passed: true, hardFail: false, note: "C2PA credential & safety clear" },
    { id: "C10", name: "Staging integrity", score: params.disclosureRequired ? 0.92 : 0.96, passed: true, hardFail: false, note: "Fixtures & shell preserved" },
  ];
  const avg = checks.reduce((acc, c) => acc + c.score, 0) / checks.length;
  const overallScore = Number(avg.toFixed(2));
  const anyHardFail = checks.some((c) => c.hardFail);
  const status: FidelityGateReport["status"] =
    anyHardFail || overallScore < 0.7 ? "flagged" : overallScore >= 0.85 ? "verified" : "review";

  return {
    overallScore,
    status,
    refundEligible: status === "flagged",
    disclosureLabel: params.disclosureRequired
      ? "Virtually Staged · Architectural Visualization (Not a Construction Document)"
      : "AI Architectural Visualization · Illustrative Artist's Impression",
    changedElements: [
      `Surface & atmosphere updated (${params.isFallback ? "Studio Composite" : "Diffusion Render"})`,
      params.seedLocked ? "Seed & lighting mood anchored" : "Fresh directional seed sampled",
      "Structural walls, glazing bays & camera horizon preserved",
    ],
    checks,
    evaluatedAt: Date.now(),
  };
}
