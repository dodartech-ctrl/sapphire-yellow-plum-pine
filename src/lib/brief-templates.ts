import {
  ARCHITECTURAL_STYLES,
  CAMERA_PRESETS,
  LIGHTING_CONDITIONS,
  MOOD_SETTINGS,
  type BuilderBlock,
} from "@/lib/builder-data";
import type { EngineState, Scene3DState } from "@/lib/engines";
import type { Frame } from "@/lib/frame";
import type { DesignState } from "@/lib/properties";
import { buildInitialBuilderNotes } from "@/lib/prompt-sync";

export type BriefTemplateCategory =
  | "Residential"
  | "Commercial"
  | "Landscape"
  | "Hospitality"
  | "Cultural";

export type BriefTemplate = {
  id: string;
  name: string;
  category: BriefTemplateCategory;
  tagline: string;
  summary: string;
  previewImage: string;
  projectScale: string;
  deliverables: string[];
  styleId: string;
  lightingId: string;
  moodId: string;
  cameraId: string;
  dictionaryPresetId: string;
  dictionaryBlocks: string[];
  directives: string;
  designPatch: Partial<DesignState>;
  enginePatch: Partial<EngineState>;
  scene3dPatch: Partial<Scene3DState>;
  frameRatio: Frame["ratio"];
  frameResolution: Frame["resolution"];
};

export const BRIEF_TEMPLATE_CATEGORIES: readonly ("All" | BriefTemplateCategory)[] = [
  "All",
  "Residential",
  "Commercial",
  "Landscape",
  "Hospitality",
  "Cultural",
] as const;

export const BRIEF_TEMPLATES: BriefTemplate[] = [
  {
    id: "residential-modern",
    name: "Residential Modern",
    category: "Residential",
    tagline: "Cantilevered fair-faced concrete, low-iron glass, and reflecting water court",
    summary:
      "Private cliffside or suburban modernist residence pairing crisp horizontal floor plates with warm white oak soffits, floor-to-ceiling glazing, and late-afternoon raking light.",
    previewImage: "/viz/p01-pavilion-day.jpg",
    projectScale: "480 m² · Single-Family Residence",
    deliverables: ["Hero Exterior Plate", "Living Pavilion Dusk", "BIM Finish Schedule"],
    styleId: "minimalist-concrete-glass",
    lightingId: "golden-hour-raking",
    moodId: "serene-sanctuary",
    cameraId: "eye-level-two-point",
    dictionaryPresetId: "facade",
    dictionaryBlocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc"],
    directives:
      "Cantilevered concrete roof plane above frameless low-iron sliding glass doors; warm rift-cut white oak soffit; calm black basalt reflecting pool.",
    designPatch: {
      vertical: "exterior",
      range: "Luxury",
      look: "Modern",
      camera: "Eye level",
      light: "Golden hour",
      mood: "Serene",
      color: "Warm white",
      weather: "Clear",
      time: "Golden hour",
      detail: "High detail",
      tags: ["Luxury", "Residential", "Villa", "Glass"],
      picks: {
        facade: "Concrete",
        roof: "Flat",
        windows: "Floor-to-ceiling",
        entry: "Pivot door",
        terrace: "Pergola",
        water: "Pool",
      },
    },
    enginePatch: {
      workflowPreset: "photoreal",
      facadeTypology: "Minimalist Glass",
      climateRegion: "Temperate Coastal",
      geometryLock: 88,
      renderFidelity: "editorial",
      detailDensity: "intricate",
      mjStylize: 220,
    },
    scene3dPatch: {
      preset: "villa",
      primaryMaterial: "concrete",
      focalLength: 24,
      cameraPreset: "eye",
      geoEnabled: true,
      geoHour: 17.5,
      geoMonth: 6,
      sunAzimuth: 245,
      sunElevation: 16,
      hdriMood: "golden-dusk",
    },
    frameRatio: "16:9",
    frameResolution: "2k",
  },
  {
    id: "commercial-minimalist",
    name: "Commercial Minimalist",
    category: "Commercial",
    tagline: "Flagship glass-and-stone pavilion with calibrated overcast gallery daylight",
    summary:
      "Disciplined commercial workplace or flagship showroom emphasizing architectural clarity, anodized bronze-black mullions, honed limestone plinths, and true-color shadowless illumination.",
    previewImage: "/viz/t01-public-library.jpg",
    projectScale: "4,200 m² · Flagship Workplace",
    deliverables: ["Street Elevation", "Double-Height Lobby", "Facade Specification"],
    styleId: "minimalist-concrete-glass",
    lightingId: "soft-overcast-diffused",
    moodId: "monastic-clarity",
    cameraId: "eye-level-two-point",
    dictionaryPresetId: "glazing",
    dictionaryBlocks: ["goal", "source", "geometry", "windows", "photo", "lighting_day", "exclude", "qc"],
    directives:
      "Ultra-clear curtain wall glazing with crisp anodized aluminum fins, honed limestone forecourt paving, balanced 5500K overcast gallery illumination, zero visual clutter.",
    designPatch: {
      vertical: "exterior",
      range: "Premium",
      look: "Civic",
      camera: "Eye level",
      light: "Soft overcast",
      mood: "Quiet",
      color: "Charcoal",
      weather: "Cloudy",
      time: "Day",
      detail: "High detail",
      tags: ["Glass", "Quiet"],
      picks: {
        facade: "Glass",
        roof: "Flat",
        windows: "Dark metal",
        entry: "Canopy",
        balcony: "Glass rail",
      },
    },
    enginePatch: {
      workflowPreset: "photoreal",
      facadeTypology: "Minimalist Glass",
      climateRegion: "Urban Dense",
      geometryLock: 92,
      renderFidelity: "photoreal",
      detailDensity: "balanced",
      mjStylize: 180,
    },
    scene3dPatch: {
      preset: "pavilion",
      primaryMaterial: "concrete",
      focalLength: 35,
      cameraPreset: "oblique",
      geoEnabled: true,
      geoHour: 11.5,
      geoMonth: 4,
      sunAzimuth: 150,
      sunElevation: 48,
      hdriMood: "overcast-nordic",
    },
    frameRatio: "16:9",
    frameResolution: "2k",
  },
  {
    id: "landscape-urbanism",
    name: "Landscape Urbanism",
    category: "Landscape",
    tagline: "Permeable granite civic promenade, rain gardens, and twilight path luminaires",
    summary:
      "Resilient urban public realm blending terraced bioswales, native shade canopies, carved basalt seating walls, and warm pedestrian bollard lighting.",
    previewImage: "/viz/t06-urban-courtyard.jpg",
    projectScale: "1.8 ha · Civic Urban Realm",
    deliverables: ["Aerial Masterplan", "Pedestrian Promenade", "Planting & Hardscape Pack"],
    styleId: "nordic-timber-civic",
    lightingId: "blue-hour-twilight",
    moodId: "vibrant-cosmopolitan",
    cameraId: "elevated-site-drone",
    dictionaryPresetId: "season",
    dictionaryBlocks: ["goal", "source", "geometry", "landscape", "photo", "exclude", "qc"],
    directives:
      "Permeable flamed granite pavers, vegetated stormwater bioswales, sculptural Scots pine and olive clusters, low 2700K architectural step lights along terraced water channels.",
    designPatch: {
      vertical: "landscape",
      range: "Premium",
      look: "Courtyard",
      camera: "Elevated",
      light: "Evening",
      mood: "Vibrant",
      color: "Sage",
      weather: "Clear",
      time: "Evening",
      detail: "High detail",
      tags: ["Biophilic", "Quiet"],
      picks: {
        trees: "Shade trees",
        planting: "Shrubs",
        lawn: "Meadow",
        garden: "Courtyard",
        path: "Stone",
        water: "Fountain",
        structure: "Pavilion",
        edge: "Low wall",
        light: "Path lights",
      },
    },
    enginePatch: {
      workflowPreset: "photoreal",
      facadeTypology: "Nordic Brick & Zinc",
      climateRegion: "Urban Dense",
      geometryLock: 85,
      renderFidelity: "editorial",
      detailDensity: "intricate",
      mjStylize: 210,
    },
    scene3dPatch: {
      preset: "civic",
      primaryMaterial: "travertine",
      focalLength: 24,
      cameraPreset: "aerial",
      geoEnabled: true,
      geoHour: 19.75,
      geoMonth: 9,
      sunAzimuth: 278,
      sunElevation: 9,
      hdriMood: "clear-sky",
    },
    frameRatio: "16:9",
    frameResolution: "2k",
  },
  {
    id: "hospitality-resort",
    name: "Hospitality Resort Sanctuary",
    category: "Hospitality",
    tagline: "Biophilic teak timber louvers, volcanic basalt plinths, and twilight infinity edge",
    summary:
      "Intimate coastal or subtropical hospitality pavilion dissolving indoor lounges into shaded pool terraces with warm 2700K lantern glow.",
    previewImage: "/viz/t05-subtropical-home.jpg",
    projectScale: "1,450 m² · Boutique Resort Pavilion",
    deliverables: ["Arrival Canopy", "Infinity Pool Dusk", "Timber Screen Study"],
    styleId: "contemporary-tropical",
    lightingId: "blue-hour-twilight",
    moodId: "intimate-warmth",
    cameraId: "low-angle-oblique",
    dictionaryPresetId: "twilight",
    dictionaryBlocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc"],
    directives:
      "Operable weathered teak batten screens, honed dark volcanic basalt pool coping, lush tropical palms casting soft shadows against glowing 2700K interior lounges.",
    designPatch: {
      vertical: "amenities",
      range: "Ultra Luxury",
      look: "Resort",
      camera: "Wide",
      light: "Evening",
      mood: "Warm",
      color: "Oak",
      weather: "Clear",
      time: "Evening",
      detail: "High detail",
      tags: ["Luxury", "Villa", "Biophilic"],
      picks: {
        water: "Infinity pool",
        wellness: "Spa",
        social: "Lounge",
        outdoor: "Pergola",
        security: "Arrival",
      },
    },
    enginePatch: {
      workflowPreset: "photoreal",
      facadeTypology: "Biophilic Timber Louver",
      climateRegion: "Subtropical Humid",
      geometryLock: 84,
      renderFidelity: "editorial",
      detailDensity: "intricate",
      mjStylize: 250,
    },
    scene3dPatch: {
      preset: "pavilion",
      primaryMaterial: "timber",
      focalLength: 24,
      cameraPreset: "eye",
      geoEnabled: true,
      geoHour: 19.5,
      geoMonth: 7,
      sunAzimuth: 282,
      sunElevation: 8,
      hdriMood: "golden-dusk",
    },
    frameRatio: "16:9",
    frameResolution: "2k",
  },
  {
    id: "adaptive-heritage-loft",
    name: "Adaptive Heritage Loft",
    category: "Residential",
    tagline: "Restored masonry brick, blackened steel trusses, and fluted glass inserts",
    summary:
      "Warehouse conversion honoring historic structural bones while introducing bespoke rift oak joinery, warm plaster partitions, and concealed linear cove lighting.",
    previewImage: "/viz/p02-loft-after.jpg",
    projectScale: "310 m² · Heritage Conversion",
    deliverables: ["Living Mezzanine", "Steel Truss Detail", "Interior Finish Board"],
    styleId: "industrial-heritage-reuse",
    lightingId: "interior-cove-accent",
    moodId: "intimate-warmth",
    cameraId: "eye-level-two-point",
    dictionaryPresetId: "restyle",
    dictionaryBlocks: ["goal", "source", "geometry", "materials", "photo", "exclude", "qc"],
    directives:
      "Sandblasted original red clay brick walls, blackened mild steel columns, fluted architectural glass room dividers, concealed 2400K ceiling cove wash over polished concrete.",
    designPatch: {
      vertical: "interior",
      range: "Luxury",
      look: "Warm hospitality",
      camera: "Eye level",
      light: "Golden hour",
      mood: "Warm",
      color: "Oak",
      weather: "Clear",
      time: "Golden hour",
      detail: "High detail",
      tags: ["Residential", "Glass"],
      picks: {
        room: "Living room",
        floor: "Microcement",
        wall: "Fluted oak",
        ceiling: "Cove light",
        openings: "Slim black",
      },
    },
    enginePatch: {
      workflowPreset: "interior-restyle",
      facadeTypology: "Nordic Brick & Zinc",
      climateRegion: "Urban Dense",
      geometryLock: 86,
      renderFidelity: "photoreal",
      detailDensity: "intricate",
      mjStylize: 190,
    },
    scene3dPatch: {
      preset: "loft",
      primaryMaterial: "brick",
      focalLength: 35,
      cameraPreset: "eye",
      geoEnabled: true,
      geoHour: 16.5,
      geoMonth: 10,
      sunAzimuth: 225,
      sunElevation: 22,
      hdriMood: "studio",
    },
    frameRatio: "4:3",
    frameResolution: "2k",
  },
  {
    id: "civic-mass-timber",
    name: "Cultural Civic Timber Hall",
    category: "Cultural",
    tagline: "Exposed Douglas fir glulam, acoustic brick walls, and clerestory daylight shafts",
    summary:
      "Public library or museum commons anchored by long-span mass timber beams, calm reading terraces, and sculpted overhead zenithal light.",
    previewImage: "/viz/t07-cultural-campus.jpg",
    projectScale: "6,500 m² · Cultural & Civic Hall",
    deliverables: ["Atrium Section View", "Glulam Canopy Study", "Daylight Factor Pack"],
    styleId: "nordic-timber-civic",
    lightingId: "soft-overcast-diffused",
    moodId: "serene-sanctuary",
    cameraId: "low-angle-oblique",
    dictionaryPresetId: "facade",
    dictionaryBlocks: ["goal", "source", "geometry", "windows", "photo", "exclude", "qc"],
    directives:
      "Exposed Douglas fir glulam roof trusses, long-format tactile Nordic clay brick, double-height reading atrium bathed in soft zenithal north daylight.",
    designPatch: {
      vertical: "interior",
      range: "Premium",
      look: "Quiet mineral",
      camera: "Wide",
      light: "Soft overcast",
      mood: "Serene",
      color: "Sand",
      weather: "Cloudy",
      time: "Day",
      detail: "High detail",
      tags: ["Quiet", "Biophilic"],
      picks: {
        room: "Living room",
        floor: "Travertine",
        wall: "Limewash",
        ceiling: "Timber",
        openings: "Bronze frames",
      },
    },
    enginePatch: {
      workflowPreset: "photoreal",
      facadeTypology: "Nordic Brick & Zinc",
      climateRegion: "Alpine Cold",
      geometryLock: 90,
      renderFidelity: "editorial",
      detailDensity: "balanced",
      mjStylize: 175,
    },
    scene3dPatch: {
      preset: "civic",
      primaryMaterial: "timber",
      focalLength: 24,
      cameraPreset: "oblique",
      geoEnabled: true,
      geoHour: 13.0,
      geoMonth: 5,
      sunAzimuth: 175,
      sunElevation: 56,
      hdriMood: "overcast-nordic",
    },
    frameRatio: "16:9",
    frameResolution: "2k",
  },
  {
    id: "brutalist-gallery",
    name: "Monolithic Brutalist Gallery",
    category: "Cultural",
    tagline: "Board-formed concrete reveals, Corten trim, and chiaroscuro oculus beam",
    summary:
      "Sculptural art foundation gallery celebrating raw mineral weight, deep-set shadow reveals, and single-aperture architectural light drama.",
    previewImage: "/viz/t08-material-junction.jpg",
    projectScale: "2,100 m² · Sculpture Foundation",
    deliverables: ["Gallery Aperture Study", "Junction Macro Detail", "Client Concept Book"],
    styleId: "brutalist-sculptural",
    lightingId: "dramatic-chiaroscuro",
    moodId: "cinematic-grandeur",
    cameraId: "intimate-macro-junction",
    dictionaryPresetId: "facade",
    dictionaryBlocks: ["goal", "source", "geometry", "materials", "photo", "exclude", "qc"],
    directives:
      "Rough cedar board-formed concrete walls meeting a 5mm recessed blackened steel shadow reveal; single high clerestory sunbeam slicing across honed basalt flooring.",
    designPatch: {
      vertical: "interior",
      range: "Ultra Luxury",
      look: "Material study",
      camera: "Close detail",
      light: "Daylight",
      mood: "Dramatic",
      color: "Charcoal",
      weather: "Clear",
      time: "Day",
      detail: "High detail",
      tags: ["Luxury", "Quiet"],
      picks: {
        room: "Living room",
        floor: "Italian marble",
        wall: "Stone",
        ceiling: "Gypsum",
      },
    },
    enginePatch: {
      workflowPreset: "photoreal",
      facadeTypology: "Board-Marked Concrete",
      climateRegion: "Arid Desert",
      geometryLock: 91,
      renderFidelity: "editorial",
      detailDensity: "intricate",
      mjStylize: 240,
    },
    scene3dPatch: {
      preset: "villa",
      primaryMaterial: "concrete",
      focalLength: 50,
      cameraPreset: "detail",
      geoEnabled: true,
      geoHour: 15.0,
      geoMonth: 8,
      sunAzimuth: 235,
      sunElevation: 38,
      hdriMood: "clear-sky",
    },
    frameRatio: "3:2",
    frameResolution: "2k",
  },
  {
    id: "japandi-penthouse",
    name: "Japandi Urban Penthouse",
    category: "Residential",
    tagline: "Rift-cut white oak joinery, limewash plaster, and quiet morning light",
    summary:
      "Restorative high-floor residence integrating Japanese spatial restraint with Scandinavian tactile warmth, paper-screen thresholds, and travertine islands.",
    previewImage: "/viz/t03-compact-living-room.jpg",
    projectScale: "265 m² · Penthouse Interior",
    deliverables: ["Living Sanctuary Plate", "Kitchen Island Elevation", "Material Mood Board"],
    styleId: "japandi-minimalist",
    lightingId: "soft-overcast-diffused",
    moodId: "serene-sanctuary",
    cameraId: "eye-level-two-point",
    dictionaryPresetId: "restyle",
    dictionaryBlocks: ["goal", "source", "geometry", "materials", "photo", "exclude", "qc"],
    directives:
      "Bespoke rift-cut white oak casework, hand-troweled warm limewash plaster walls, fluted translucent privacy screens, monolithic travertine kitchen island.",
    designPatch: {
      vertical: "interior",
      range: "Luxury",
      look: "Modern luxury",
      camera: "Eye level",
      light: "Soft overcast",
      mood: "Serene",
      color: "Warm white",
      weather: "Clear",
      time: "Morning",
      detail: "High detail",
      tags: ["Luxury", "Residential", "Quiet"],
      picks: {
        room: "Living room",
        floor: "Travertine",
        rug: "Wool",
        wall: "Limewash",
        ceiling: "Gypsum",
        furniture: "Lounge chairs",
        kitchen: "Stone island",
      },
    },
    enginePatch: {
      workflowPreset: "interior-restyle",
      facadeTypology: "Minimalist Glass",
      climateRegion: "Temperate Coastal",
      geometryLock: 86,
      renderFidelity: "photoreal",
      detailDensity: "intricate",
      mjStylize: 195,
    },
    scene3dPatch: {
      preset: "loft",
      primaryMaterial: "timber",
      focalLength: 35,
      cameraPreset: "eye",
      geoEnabled: true,
      geoHour: 9.5,
      geoMonth: 5,
      sunAzimuth: 110,
      sunElevation: 36,
      hdriMood: "studio",
    },
    frameRatio: "16:9",
    frameResolution: "2k",
  },
];

export function filterBriefTemplates(
  category: "All" | BriefTemplateCategory,
  query = "",
): BriefTemplate[] {
  const q = query.trim().toLowerCase();
  return BRIEF_TEMPLATES.filter((item) => {
    if (category !== "All" && item.category !== category) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tagline.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.directives.toLowerCase().includes(q)
    );
  });
}

export function resolveBriefTemplateSlots(template: BriefTemplate): {
  style: BuilderBlock | null;
  lighting: BuilderBlock | null;
  mood: BuilderBlock | null;
  camera: BuilderBlock | null;
} {
  return {
    style: ARCHITECTURAL_STYLES.find((s) => s.id === template.styleId) ?? null,
    lighting: LIGHTING_CONDITIONS.find((l) => l.id === template.lightingId) ?? null,
    mood: MOOD_SETTINGS.find((m) => m.id === template.moodId) ?? null,
    camera: CAMERA_PRESETS.find((c) => c.id === template.cameraId) ?? null,
  };
}

export function buildTemplateCompiledNotes(template: BriefTemplate): string {
  const slots = resolveBriefTemplateSlots(template);
  const base = buildInitialBuilderNotes(slots.style, slots.lighting, slots.mood, slots.camera);
  return template.directives ? `${base}. ${template.directives}` : base;
}
