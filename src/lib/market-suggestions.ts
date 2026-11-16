import {
  sanitizeEngineState,
  sanitizeScene3DState,
  type CameraPreset3D,
  type EngineState,
  type Scene3DState,
  type WorkflowPreset,
} from "./engines";
import { sanitizeFrame, type Frame } from "./frame";
import { sanitizeDesign, type DesignState } from "./properties";

export type MarketCategoryId =
  | "geometry-lock"
  | "solar-atmosphere"
  | "materials-pbr"
  | "sketch-conditioning"
  | "camera-optics"
  | "entourage-landscape"
  | "post-upscale"
  | "motion-360-client";

export type MarketBenchmark =
  | "Veras"
  | "D5 Render"
  | "LookX"
  | "Rendair"
  | "Krea"
  | "Magnific"
  | "Chaos Corona";

export type MarketSuggestionDesignPatch = Partial<
  Pick<
    DesignState,
    "look" | "light" | "time" | "weather" | "mood" | "camera" | "color" | "people" | "activity" | "detail" | "strength"
  >
>;

export type MarketSuggestion = {
  id: string;
  index: number;
  title: string;
  category: MarketCategoryId;
  categoryLabel: string;
  marketBenchmark: MarketBenchmark;
  painPointSolved: string;
  userFriendlyTip: string;
  promptPatch: string;
  estimatedImpact: "High" | "Medium";
  enginePatch?: Partial<EngineState>;
  designPatch?: MarketSuggestionDesignPatch;
  scene3dPatch?: Partial<Scene3DState>;
  framePatch?: Partial<Frame>;
  autoQueuePreset?: {
    label: string;
    preset: WorkflowPreset;
    light: string;
    sunHour?: number;
    cameraPreset?: CameraPreset3D;
  };
};

export const MARKET_SUGGESTION_CATEGORIES: ReadonlyArray<{
  id: MarketCategoryId;
  label: string;
  summary: string;
}> = [
  {
    id: "geometry-lock",
    label: "Geometry & BIM Lock",
    summary: "Preserve windows, floor datums, structural spans, and orthographic proportions.",
  },
  {
    id: "solar-atmosphere",
    label: "Solar, Sky & Time-of-Day",
    summary: "Morning, Solar Noon, Golden Hour, Blue-Hour Twilight, Midnight, and weather physics.",
  },
  {
    id: "materials-pbr",
    label: "PBR Materials & Micro-Texture",
    summary: "True-scale timber joinery, board-formed concrete, travertine, bronze, and low-iron glass.",
  },
  {
    id: "sketch-conditioning",
    label: "Sketch, CAD & 2D-to-3D",
    summary: "Convert hand sketches, elevations, plans, and annotations accurately without drifting.",
  },
  {
    id: "camera-optics",
    label: "Optics, Camera & Framing",
    summary: "Two-point tilt-shift verticals, architectural lenses (24–85mm), and balanced thresholds.",
  },
  {
    id: "entourage-landscape",
    label: "Entourage, Foliage & Context",
    summary: "Natural scale figures, subtle motion blur, seasonal botanicals, and grounded reflections.",
  },
  {
    id: "post-upscale",
    label: "Segmentation, Seed & 8K–15K",
    summary: "Click-to-mask element swaps, client revision seed locking, and super-res finishing.",
  },
  {
    id: "motion-360-client",
    label: "Video, 360° & Autopilot",
    summary: "Day-to-night transitions, walkthrough clips, 360° hotspots, GLB locks, and client packs.",
  },
];

export const MARKET_BENCHMARKS: readonly MarketBenchmark[] = [
  "Veras",
  "D5 Render",
  "LookX",
  "Rendair",
  "Krea",
  "Magnific",
  "Chaos Corona",
];

type RawSeedItem = {
  title: string;
  benchmark: MarketBenchmark;
  pain: string;
  tip: string;
  prompt: string;
  impact?: "High" | "Medium";
  engine?: Partial<EngineState>;
  design?: MarketSuggestionDesignPatch;
  scene3d?: Partial<Scene3DState>;
  frame?: Partial<Frame>;
  queue?: { label: string; preset: WorkflowPreset; light: string; sunHour?: number; cameraPreset?: CameraPreset3D };
};

const CATEGORY_LABEL_MAP: Record<MarketCategoryId, string> = Object.fromEntries(
  MARKET_SUGGESTION_CATEGORIES.map((c) => [c.id, c.label]),
) as Record<MarketCategoryId, string>;

const RAW_BY_CATEGORY: Record<MarketCategoryId, RawSeedItem[]> = {
  "geometry-lock": [
    {
      title: "Strict Fenestration & Mullion Lock",
      benchmark: "Veras",
      pain: "Prevents AI from inventing extra windows or shifting glazing mullions.",
      tip: "Best for finalized BIM facades when testing finishes.",
      prompt: "Preserve exact window frame count, mullion spacing, sill heights, and structural bays.",
      impact: "High",
      engine: { geometryLock: 95, annotatorMode: "mlsd", edgeAdherence: 90, seedLocked: true },
    },
    {
      title: "Floor-to-Floor Datum Continuity",
      benchmark: "Veras",
      pain: "Stops multi-story buildings from stretching or merging slab edges.",
      tip: "Locks slab plates and parapet elevations across tall elevations.",
      prompt: "Maintain strict slab edge alignment, cornice lines, and exact story heights.",
      impact: "High",
      engine: { geometryLock: 92, depthEnabled: true, depthWeight: 82 },
    },
    {
      title: "Cantilever Structural Envelope Hold",
      benchmark: "LookX",
      pain: "Stops thin architectural overhangs from sagging or adding fake columns.",
      tip: "Keeps bold modern cantilevers razor-sharp.",
      prompt: "Hold true cantilevered soffit geometry with zero unrequested support columns.",
      impact: "High",
      engine: { geometryLock: 90, edgeAdherence: 86, workflowPreset: "photoreal" },
    },
    {
      title: "Staircase Tread & Balustrade Lock",
      benchmark: "Veras",
      pain: "Eliminates warped stair flights and broken glass railings in interior shots.",
      tip: "Use when renovating lobby or atrium circulation.",
      prompt: "Preserve exact stair riser rhythm, handrail continuous line, and glass balustrade clamps.",
      impact: "High",
      engine: { geometryLock: 94, annotatorMode: "canny", annotatorThreshold: 45 },
    },
    {
      title: "Doorway Swing & Threshold Retention",
      benchmark: "Rendair",
      pain: "Keeps entry doors, pivot frames, and corridors in exact plan locations.",
      tip: "Essential for code-compliant commercial interior proposals.",
      prompt: "Retain existing door leaf geometry, pivot hardware alignment, and casing reveals.",
      engine: { geometryLock: 89, annotatorMode: "lineart", edgeAdherence: 85 },
    },
    {
      title: "Curtain Wall Spandrel Grid Precision",
      benchmark: "LookX",
      pain: "Fixes wavy reflective tower facades and inconsistent vision-glass bands.",
      tip: "Aligns high-rise aluminum extrusions cleanly.",
      prompt: "Crisp orthometric curtain-wall transom and vertical fin grid with true reflection joints.",
      impact: "High",
      engine: { geometryLock: 93, annotatorMode: "mlsd", facadeTypology: "Minimalist Glass" },
    },
    {
      title: "Gable & Hip Roof Slope Fidelity",
      benchmark: "Veras",
      pain: "Prevents residential pitched roofs from collapsing into flat parapets.",
      tip: "Ideal for alpine villas and heritage adaptive reuse.",
      prompt: "Keep exact pitched roof ridge angle, eave projection, and gutter fascia geometry.",
      engine: { geometryLock: 91, depthEnabled: true, depthWeight: 76 },
    },
    {
      title: "Interior Room Boundary Preservation",
      benchmark: "Rendair",
      pain: "Stops sofa/kitchen swaps from moving structural walls or kitchen islands.",
      tip: "One click holds room shell steady while testing decor.",
      prompt: "Hold perimeter wall planes, cove ceiling recesses, and island footprint fixed.",
      impact: "High",
      engine: { workflowPreset: "interior-restyle", geometryLock: 92, materialOverride: 70 },
    },
    {
      title: "Perforated Louver & Brise-Soleil Rhythm",
      benchmark: "LookX",
      pain: "Prevents sun-shading slats from blurring into solid panels.",
      tip: "Preserves louver spacing for realistic dappled sunlight.",
      prompt: "Crisp equidistant timber and bronze brise-soleil louvers casting calibrated sun bands.",
      engine: { geometryLock: 88, annotatorMode: "canny", detailDensity: "intricate" },
    },
    {
      title: "Colonnade & Arched Arcade Symmetry",
      benchmark: "Chaos Corona",
      pain: "Fixes uneven classical colonnade capitals and distorted vault ribs.",
      tip: "Locks neoclassical and cultural civic colonnades.",
      prompt: "True symmetrical column shafts, barrel-vault ribs, and limestone plinth reveals.",
      engine: { geometryLock: 92, annotatorMode: "mlsd", renderFidelity: "editorial" },
    },
    {
      title: "Balcony Guardrail Transparency Hold",
      benchmark: "Veras",
      pain: "Stops glass railings from turning into opaque parapet walls.",
      tip: "Keeps balcony sightlines clear on residential towers.",
      prompt: "Low-iron laminated glass balcony guardrails with minimal stainless spigots.",
      engine: { geometryLock: 87, materialOverride: 55 },
    },
    {
      title: "Skylight & Coffered Ceiling Aperture Lock",
      benchmark: "Chaos Corona",
      pain: "Preserves clerestory skylight openings so daylight falls in the right spot.",
      tip: "Great for museums and atrium interiors.",
      prompt: "Hold exact skylight coffer grid geometry allowing directional overhead daylight shafts.",
      engine: { geometryLock: 91, depthEnabled: true, depthWeight: 74 },
    },
    {
      title: "Retaining Wall & Site Topography Lock",
      benchmark: "D5 Render",
      pain: "Prevents sloped hillside villas from floating or losing stepped stone walls.",
      tip: "Locks stepped terraces and garden grade contours.",
      prompt: "Follow true site slope contours, stepped retaining stone walls, and exterior stair flights.",
      engine: { geometryLock: 89, depthEnabled: true, depthWeight: 85 },
    },
    {
      title: "Pergola Rafter & Post Grid Lock",
      benchmark: "Rendair",
      pain: "Stops outdoor patio rafters from twisting or vanishing in exterior shots.",
      tip: "Maintains clean overhead shadow lines on pool terraces.",
      prompt: "Preserve orthogonal pergola beams, slender steel posts, and cast shadow trellis.",
      engine: { geometryLock: 90, annotatorMode: "mlsd" },
    },
    {
      title: "Custom Kitchen Millwork Casework Hold",
      benchmark: "Veras",
      pain: "Keeps cabinetry reveals, appliance alcoves, and range hoods aligned.",
      tip: "Upgrade veneer or marble without losing millimeter millwork.",
      prompt: "Preserve exact cabinet door reveal seams, recessed pulls, and countertop overhang.",
      impact: "High",
      engine: { geometryLock: 93, edgeAdherence: 88, renderFidelity: "photoreal" },
    },
    {
      title: "Double-Height Mezzanine Void Clarity",
      benchmark: "LookX",
      pain: "Stops AI from filling open double-height volumes with accidental floor plates.",
      tip: "Maintains airy loft volume depth and vertical continuity.",
      prompt: "Maintain unobstructed double-height atrium void and mezzanine overlook rail.",
      engine: { geometryLock: 90, depthEnabled: true, depthWeight: 80 },
    },
    {
      title: "Recessed Reveal & Shadow-Gap Trim",
      benchmark: "Chaos Corona",
      pain: "Replaces clunky baseboards with authentic modern flush shadow-gap reveals.",
      tip: "Subtle architectural detail that elevates luxury interiors.",
      prompt: "Architectural 12mm shadow-gap wall baseboards and flush frameless door jambs.",
      engine: { geometryLock: 86, detailDensity: "intricate" },
    },
    {
      title: "Parking Entry & Vehicular Ramp Grade",
      benchmark: "Rendair",
      pain: "Stops driveway ramps and garage aprons from bending unnaturally.",
      tip: "Useful for suburban residences and civic podium entries.",
      prompt: "Preserve constant vehicular ramp slope, curb radii, and illuminated garage soffit.",
      engine: { geometryLock: 88, annotatorMode: "normal" },
    },
    {
      title: "Historic Masonry Cornice Protection",
      benchmark: "LookX",
      pain: "Prevents modern adaptive reuse edits from wiping protected heritage stone.",
      tip: "Applies modern glazing solely within existing brick openings.",
      prompt: "Heritage preservation: retain historic stone cornice relief and window masonry arches.",
      impact: "High",
      engine: { geometryLock: 96, annotatorMode: "canny", edgeAdherence: 92 },
    },
    {
      title: "Zero-Drift Revision Geometry Freeze",
      benchmark: "Veras",
      pain: "Stops subtle building shape shifting between client revision round 1 and 2.",
      tip: "Locks geometry at 97% + Seed Lock for client sign-off cycles.",
      prompt: "Zero-drift structural freeze: modify only targeted surface finish and lighting mood.",
      impact: "High",
      engine: { geometryLock: 97, seedLocked: true, materialOverride: 45 },
    },
  ],

  "solar-atmosphere": [
    {
      title: "Morning 08:00 Crisp East Sunlight",
      benchmark: "D5 Render",
      pain: "Solves flat midday renders with crisp, optimistic morning architectural light.",
      tip: "Ideal for residential kitchens, courtyards, and cafes.",
      prompt: "Crisp 08:00 morning sunlight casting long warm-cool directional shadows across travertine.",
      impact: "High",
      design: { light: "Daylight", time: "Morning", mood: "Serene" },
      scene3d: { geoEnabled: true, geoHour: 8, d5LightPreset: "noon", exposure: 1.08, hdriMood: "clear-sky" },
      queue: { label: "08:00 Crisp Morning", preset: "photoreal", light: "Daylight", sunHour: 8 },
    },
    {
      title: "Solar Noon High-Clarity Architectural Day",
      benchmark: "D5 Render",
      pain: "Gives zoning boards and competition jurors honest shadow massing.",
      tip: "Clean 12:30 high sun angle showing true material colors.",
      prompt: "Clean solar noon architectural daylight with defined contact shadows and crystal clarity.",
      design: { light: "Daylight", time: "Day", weather: "Clear" },
      scene3d: { geoEnabled: true, geoHour: 12.5, d5LightPreset: "noon", sunElevation: 58, exposure: 1.0 },
      queue: { label: "12:30 Solar Noon", preset: "photoreal", light: "Daylight", sunHour: 12.5 },
    },
    {
      title: "Golden Hour 17:30 Rim & Glazing Glow",
      benchmark: "Chaos Corona",
      pain: "Replaces harsh yellow filters with physically calibrated warm low sun.",
      tip: "Client favorite for villa and hospitality hero shots.",
      prompt: "17:30 golden hour sunlight skimming textured stone with smooth highlight rolloff.",
      impact: "High",
      design: { light: "Golden hour", time: "Golden hour", mood: "Warm" },
      scene3d: { geoEnabled: true, geoHour: 17.5, d5LightPreset: "golden", sunElevation: 16, exposure: 1.15, hdriMood: "golden-dusk" },
      queue: { label: "17:30 Golden Hour", preset: "photoreal", light: "Golden hour", sunHour: 17.5 },
    },
    {
      title: "Blue-Hour Twilight Interior Hearth Balance",
      benchmark: "D5 Render",
      pain: "Balances deep cobalt twilight sky against warm 2700K glowing interiors.",
      tip: "Instantly elevates glass pavilions and retail storefronts.",
      prompt: "Deep blue-hour dusk sky balanced with glowing 2700K warm interior architectural lamps.",
      impact: "High",
      design: { light: "Evening", time: "Evening", mood: "Warm" },
      scene3d: { geoEnabled: true, geoHour: 19.4, d5LightPreset: "blue-hour", sunElevation: 7, exposure: 1.2, hdriMood: "golden-dusk" },
      queue: { label: "19:30 Blue Hour", preset: "photoreal", light: "Evening", sunHour: 19.4 },
    },
    {
      title: "Midnight Exterior Architectural Uplight",
      benchmark: "Chaos Corona",
      pain: "Avoids pitch-black muddy shadows in night renders via realistic fixture bounce.",
      tip: "Highlights soffit grazers, bollard path lights, and pool LEDs.",
      prompt: "Midnight architectural study with calibrated landscape uplights, soffit grazing, and dark sky.",
      impact: "High",
      design: { light: "Night", time: "Night", mood: "Dramatic" },
      scene3d: { geoEnabled: true, geoHour: 22, d5LightPreset: "blue-hour", exposure: 1.05 },
      queue: { label: "22:00 Midnight Uplight", preset: "photoreal", light: "Night", sunHour: 22 },
    },
    {
      title: "Nordic Overcast Soft Sky Diffusion",
      benchmark: "Chaos Corona",
      pain: "Eliminates blown-out white walls by wrapping geometry in soft ambient skylight.",
      tip: "Best for subtle concrete, pale oak, and museum monographs.",
      prompt: "Soft overcast Nordic sky dome delivering shadowless wrap-around illumination and delicate AO.",
      impact: "High",
      design: { light: "Soft overcast", weather: "Cloudy", mood: "Quiet" },
      scene3d: { d5LightPreset: "overcast", hdriMood: "overcast-nordic", fogDensity: 12 },
    },
    {
      title: "Post-Rain Courtyard Reflective Asphalt",
      benchmark: "D5 Render",
      pain: "Breaks flat matte paving by introducing thin moisture film puddles.",
      tip: "Adds instant editorial drama without changing building geometry.",
      prompt: "Recently rained stone plaza with crisp damp puddle reflections and cool atmospheric bounce.",
      design: { weather: "Cloudy", mood: "Dramatic" },
      engine: { climateRegion: "Temperate Coastal", relightPreset: "none" },
    },
    {
      title: "Volumetric Atrium Daylight Shafts",
      benchmark: "D5 Render",
      pain: "Fixes sterile double-height interiors that lack tangible air depth.",
      tip: "Subtle dust/haze scatters sunbeams through high clerestory windows.",
      prompt: "Soft volumetric sunlight beams cutting diagonally across double-height travertine atrium.",
      scene3d: { fogDensity: 28, sunElevation: 32, d5LightPreset: "golden" },
    },
    {
      title: "2700K Cove & Linear Grazer Warmth",
      benchmark: "Chaos Corona",
      pain: "Stops recessed ceiling coves from looking like harsh white CGI stripes.",
      tip: "Adds realistic warm indirect wash along limewash plaster walls.",
      prompt: "Concealed 2700K architectural LED grazing coves washing fluted oak and plaster walls.",
      design: { light: "Evening", mood: "Warm", color: "Warm white" },
    },
    {
      title: "Winter Alpine Snow Bounce Illumination",
      benchmark: "LookX",
      pain: "Fixes muddy winter lighting by simulating cool snow ground albedo fill.",
      tip: "Turns temperate exteriors into crisp snow-season marketing plates.",
      prompt: "Crisp winter alpine snowbanks bouncing cool zenith light beneath glowing timber eaves.",
      design: { weather: "Clear", mood: "Serene" },
      engine: { climateRegion: "Alpine Cold", relightPreset: "summer-to-snow" },
    },
    {
      title: "Coastal Marine Mist & Distant Depth Haze",
      benchmark: "D5 Render",
      pain: "Prevents distant backgrounds from looking pasted on with exponential aerial fog.",
      tip: "Blends cliffside villas seamlessly into coastal horizons.",
      prompt: "Delicate coastal morning mist softening distant horizon hills with layered atmospheric depth.",
      design: { weather: "Mist", mood: "Serene" },
      scene3d: { fogDensity: 38, hdriMood: "overcast-nordic" },
    },
    {
      title: "Subtropical Dappled Leaf Gobo Shadows",
      benchmark: "Veras",
      pain: "Replaces blank stucco walls with organic dappled canopy shadow movement.",
      tip: "Adds believable environmental storytelling onto minimalist facades.",
      prompt: "Dappled palm and olive leaf shadows dancing naturally across sunlit plaster facade walls.",
      engine: { climateRegion: "Subtropical Humid" },
      design: { light: "Golden hour", mood: "Warm" },
    },
    {
      title: "Balanced Skylight + North Window Neutrality",
      benchmark: "Chaos Corona",
      pain: "Keeps true textile and marble hues accurate without strong orange/blue color casts.",
      tip: "Best for interior sample boards and client material sign-off.",
      prompt: "Neutral 5500K north-facing daylight balance for true-color fabric and stone evaluation.",
      design: { light: "Soft overcast", time: "Day", mood: "Quiet" },
      scene3d: { hdriMood: "studio", exposure: 1.02 },
    },
    {
      title: "Arid Desert Harsh Sculptural Shadow Play",
      benchmark: "LookX",
      pain: "Accentuates deep window reveals, rammed earth courtyards, and brise-soleil.",
      tip: "Maximizes geometric light/shadow contrast on arid sites.",
      prompt: "Crisp desert low-humidity sunlight cutting razor-sharp sculptural shadows in deep reveals.",
      engine: { climateRegion: "Arid Desert" },
      scene3d: { sunElevation: 26, fogDensity: 4, hdriMood: "clear-sky" },
    },
    {
      title: "Warm Firepit & Pool Underwater Glow",
      benchmark: "D5 Render",
      pain: "Turns dead evening amenities renders into vibrant hospitality experiences.",
      tip: "Pairs subtle aqua pool caustic glow with amber hearth warmth.",
      prompt: "Submerged pool turquoise bounce paired with warm courtyard firepit glow at dusk.",
      design: { light: "Evening", time: "Evening", mood: "Vibrant" },
    },
    {
      title: "Zero-Blowout Filmic Window Exposure",
      benchmark: "Chaos Corona",
      pain: "Stops bright exterior views from burning out interior window frames.",
      tip: "Balances interior room exposure with visible outdoor trees and sky.",
      prompt: "High-dynamic-range architectural window balance preserving both exterior sky and interior grain.",
      impact: "High",
      engine: { renderFidelity: "editorial", geometryLock: 90 },
    },
    {
      title: "Moonlit Minimalist Silver Night Pass",
      benchmark: "D5 Render",
      pain: "Offers a calm architectural night option without garish neon lighting.",
      tip: "Subtle cool skylight paired with minimal pinpoint interior lamps.",
      prompt: "Cool moonlit architectural exterior with delicate pinpoint pendant glow inside glazing.",
      design: { light: "Night", time: "Night", mood: "Serene" },
    },
    {
      title: "Golden Reflection Pool Mirror Stillness",
      benchmark: "Chaos Corona",
      pain: "Maximizes calm water mirror reflections of glowing timber soffits.",
      tip: "Best for museum forecourts and zen courtyard homes.",
      prompt: "Mirror-still shallow reflection pool doubling warm illuminated timber eaves at twilight.",
      design: { light: "Golden hour", mood: "Serene" },
    },
    {
      title: "Civic Urban Streetlight & Storefront Buzz",
      benchmark: "LookX",
      pain: "Brings ground-floor retail podiums to life during dusk reviews.",
      tip: "Adds grounded warm interior retail bays along urban sidewalks.",
      prompt: "Activated ground-floor urban retail glazing spilling warm light onto damp granite paving.",
      engine: { climateRegion: "Urban Dense" },
      design: { light: "Evening", time: "Evening" },
    },
    {
      title: "3-Time Solar Calibration Trio (09h / 16h / 19h)",
      benchmark: "D5 Render",
      pain: "Eliminates back-and-forth guessing on which sun angle sells the massing best.",
      tip: "Queued automatically as Morning, Golden, and Blue-Hour passes.",
      prompt: "Physically calibrated solar angle progression preserving identical framing across daylight hours.",
      impact: "High",
      queue: { label: "Solar Calibration Pass", preset: "photoreal", light: "Golden hour", sunHour: 16.5 },
    },
  ],

  "materials-pbr": [
    {
      title: "Board-Formed Architectural Concrete Tie-Holes",
      benchmark: "Chaos Corona",
      pain: "Fixes flat plastic gray walls by adding crisp formwork wood grain and tie cones.",
      tip: "Classic brutalist & museum tactile finish.",
      prompt: "Board-formed architectural concrete showing subtle timber formwork grain and recessed cone tie-holes.",
      impact: "High",
      engine: { facadeTypology: "Board-Marked Concrete", materialOverride: 76 },
      scene3d: { primaryMaterial: "concrete" },
    },
    {
      title: "Honed Roman Travertine Open-Pore Satin",
      benchmark: "Chaos Corona",
      pain: "Removes synthetic shiny marble look in favor of matte open-pore stone bedding.",
      tip: "Adds quiet luxury to plinths, fireplaces, and bath walls.",
      prompt: "Honed Roman vein-cut travertine slabs with subtle open-pore pitting and mitered edge joints.",
      impact: "High",
      design: { color: "Sand", look: "Quiet mineral" },
      scene3d: { primaryMaterial: "travertine" },
    },
    {
      title: "Charred Shou Sugi Ban Cedar Siding",
      benchmark: "LookX",
      pain: "Replaces generic black paint with alligator-charred cedar texture sheen.",
      tip: "High contrast against warm oiled oak soffits.",
      prompt: "Deep charred shou sugi ban cedar planks with delicate silver-charred grain catchlights.",
      engine: { facadeTypology: "Biophilic Timber Louver", detailDensity: "intricate" },
    },
    {
      title: "Rift-Cut White Oak Acoustic Fluting",
      benchmark: "Veras",
      pain: "Prevents wood slats from turning into noisy striped moiré artifacts.",
      tip: "Calibrates natural matte oil specular rolloff on interior joinery.",
      prompt: "True-scale rift-cut white oak vertical fluted slats with black acoustic felt shadow reveals.",
      design: { color: "Oak" },
      scene3d: { primaryMaterial: "timber" },
    },
    {
      title: "Weathering Corten Steel Subtle Patina",
      benchmark: "LookX",
      pain: "Stops Corten facades from looking aggressively neon-orange or overly rusted.",
      tip: "Produces realistic deep iron-oxide umber variance.",
      prompt: "Architectural weathering Corten steel plates with authentic rain-drip patina and open shadow joints.",
      engine: { detailDensity: "intricate", styleTransferWeight: 68 },
    },
    {
      title: "Hand-Troweled Mineral Limewash Plaster",
      benchmark: "Rendair",
      pain: "Eliminates sterile drywall smoothness with gentle chalky mineral tonal clouding.",
      tip: "Instant warmth for modern luxury & Mediterranean villas.",
      prompt: "Velvety hand-troweled mineral limewash walls catching soft raking window grazing light.",
      design: { color: "Warm white", mood: "Warm" },
    },
    {
      title: "Low-Iron Structural Glass Green-Tint Removal",
      benchmark: "Chaos Corona",
      pain: "Clears muddy green distortion so curtain-wall interiors read cleanly.",
      tip: "Accurate fresnel sky reflection calibrated at grazing angles.",
      prompt: "Ultra-clear low-iron structural glazing with crisp sky reflection and honest interior visibility.",
      impact: "High",
      engine: { facadeTypology: "Minimalist Glass", geometryLock: 92 },
    },
    {
      title: "Waterstruck Petersen Nordic Clay Brick",
      benchmark: "LookX",
      pain: "Replaces repeating brick wallpapers with varied kiln-fired charcoal-sand bricks.",
      tip: "Includes recessed mortar bed shadow joints.",
      prompt: "Handcrafted waterstruck Nordic clay brickwork with natural kiln color variation and raked lime mortar.",
      engine: { facadeTypology: "Nordic Brick & Zinc" },
      scene3d: { primaryMaterial: "brick" },
    },
    {
      title: "Brushed Anodized Dark Bronze Mullions",
      benchmark: "Veras",
      pain: "Upgrades flat black window lines with subtle anisotropic bronze highlights.",
      tip: "Catches golden-hour rim light cleanly along window profiles.",
      prompt: "Dark oil-rubbed brushed bronze window frames showing subtle anisotropic metallic sheen.",
    },
    {
      title: "Standing-Seam Pre-Weathered Titanium Zinc",
      benchmark: "LookX",
      pain: "Adds authentic folded seam ribs and slight oil-canning realism to metal roofs.",
      tip: "Matches coastal and Nordic institutional aesthetics.",
      prompt: "Matte quartz-gray standing-seam zinc facade & roof cladding with realistic panel seam variation.",
      engine: { facadeTypology: "Nordic Brick & Zinc" },
    },
    {
      title: "Poured Terrazzo Aggregate Micro-Specularity",
      benchmark: "Chaos Corona",
      pain: "Prevents speckled floor tiles from turning into noisy pixel grain.",
      tip: "Calibrated satin floor reflection with brass divider strips.",
      prompt: "Honed pale terrazzo flooring with delicate marble chips, brass inlay strips, and satin sheen.",
    },
    {
      title: "Bouclé & Raw Belgian Linen Upholstery",
      benchmark: "Chaos Corona",
      pain: "Gives living room sofas soft edge fuzz and believable cushion compression.",
      tip: "Stops furniture from looking stiff like hard molded plastic.",
      prompt: "Tactile oatmeal bouclé sectional upholstery and draped raw Belgian linen curtains catching daylight.",
    },
    {
      title: "Bush-Hammered Granite Exterior Plinth",
      benchmark: "Rendair",
      pain: "Grounds civic buildings with slip-resistant chipped stone base courses.",
      tip: "Great contrast under glass curtain walls.",
      prompt: "Coarse bush-hammered silver granite base plinth meeting manicured gravel drainage swale.",
    },
    {
      title: "Microcement Seamless Wet-Room Finish",
      benchmark: "Veras",
      pain: "Removes awkward tile grout grids in minimalist spa & bath interiors.",
      tip: "Clean continuous waterproof mineral finish.",
      prompt: "Seamless warm-taupe waxed microcement bathroom walls and integrated monolithic basin.",
    },
    {
      title: "Patinated Brass Architectural Hardware",
      benchmark: "Chaos Corona",
      pain: "Swaps harsh chrome hotspots for warm satin living-brass fixtures.",
      tip: "Elevates kitchen islands, pivot handles, and pendants.",
      prompt: "Hand-aged satin brass cabinet pulls, gooseneck tapware, and linear dining pendant.",
    },
    {
      title: "Exposed Cross-Laminated Timber (CLT) Soffit",
      benchmark: "LookX",
      pain: "Shows honest spruce laminations on sustainable mass-timber ceilings.",
      tip: "Pairs naturally with black structural steel knife-plate connectors.",
      prompt: "Exposed cross-laminated spruce timber ceiling beams joined with matte black steel knife plates.",
      scene3d: { primaryMaterial: "timber" },
    },
    {
      title: "Reeded Glass Privacy Partition Refraction",
      benchmark: "Chaos Corona",
      pain: "Fixes flat frosted panels by accurately fluting background silhouettes.",
      tip: "Sophisticated divider for home offices and boutique hospitality.",
      prompt: "Vertical fluted reeded glass interior partition softly distorting warm room light behind.",
    },
    {
      title: "Split-Face Limestone dry-stack Garden Wall",
      benchmark: "D5 Render",
      pain: "Adds deep shadow relief to landscape retaining walls and villas.",
      tip: "Prevents blurry smoothed boulders.",
      prompt: "Dry-stack split-face pale limestone boundary wall with crisp irregular shadow pockets.",
    },
    {
      title: "Perforated Anodized Aluminum Kinetic Veil",
      benchmark: "LookX",
      pain: "Preserves geometric perforation moiré without turning panels solid.",
      tip: "Ideal for cultural museums and parking screen facades.",
      prompt: "Precision CNC-perforated champagne anodized aluminum sunscreen veil with sharp daylight glow.",
      engine: { facadeTypology: "Parametric Kinetic Facade" },
    },
    {
      title: "Calibrated Roughness & Specular Breakup Pass",
      benchmark: "Magnific",
      pain: "Breaks uniform CG glossiness using micro-scuffs, patina, and dust modulation.",
      tip: "Makes surfaces read like a real architectural photograph.",
      prompt: "Physically varied micro-roughness breakup across stone, timber, glass, and metal junctions.",
      impact: "High",
      engine: { enhanceMode: "micro-detail", renderFidelity: "photoreal", materialOverride: 62 },
    },
  ],

  "sketch-conditioning": [
    {
      title: "Marker-on-Trace Sketch → Hero Render",
      benchmark: "Rendair",
      pain: "Turns loose napkin/trace sketches into grounded perspective plates fast.",
      tip: "Balances 85% edge adherence so creative massing breathes.",
      prompt: "Translate loose architectural pen sketch lines directly into true-scale daylight materials and sky.",
      impact: "High",
      engine: { workflowPreset: "sketch-to-render", sketchMode: "faithful", edgeAdherence: 86, annotatorMode: "lineart" },
    },
    {
      title: "3D Clay Viewport → Photoreal Finish",
      benchmark: "Veras",
      pain: "Skips slow offline path-tracing by promoting white clay viewport grabs.",
      tip: "One click turns 3D studio clay snapshots into client-ready plates.",
      prompt: "Promote untextured 3D clay massing geometry into physically accurate materials with natural GI.",
      impact: "High",
      engine: { workflowPreset: "clay-to-render", geometryLock: 90, depthEnabled: true, depthWeight: 78 },
    },
    {
      title: "Orthographic Elevation → Textured Facade",
      benchmark: "LookX",
      pain: "Stops flat CAD elevations from distorting into fake 3D perspective.",
      tip: "Maintains strict orthographic flatness with realistic shadow depth.",
      prompt: "True orthographic elevation visualization with flat camera projection, crisp mullions, and natural sun shadow.",
      impact: "High",
      engine: { workflowPreset: "elevation-to-render", annotatorMode: "mlsd", geometryLock: 95 },
    },
    {
      title: "2D Floor Plan → Furnished Axonometric Cut",
      benchmark: "Rendair",
      pain: "Brings dry CAD plans to life for residential buyers in one step.",
      tip: "Keeps walls exact while extruding oak floors, rugs, and seating.",
      prompt: "Architectural 3D cutaway isometric floor plan with warm oak flooring, curated furniture, and soft daylight.",
      impact: "High",
      engine: { workflowPreset: "plan-to-3d", edgeAdherence: 92, geometryLock: 84 },
    },
    {
      title: "Depth-Anything V2 Foggy Depth Guidance",
      benchmark: "Krea",
      pain: "Fixes perspective confusion between foreground trees and background facade.",
      tip: "Separates spatial depth planes cleanly.",
      prompt: "Deep foreground-midground-background spatial separation guided by accurate depth plane hierarchy.",
      engine: { depthEnabled: true, depthWeight: 84 },
    },
    {
      title: "Canny Crisp Linework Facade Control",
      benchmark: "Krea",
      pain: "Holds ultra-fine stair treads, mullions, and joints crisp without blur.",
      tip: "Use threshold ~45 for balanced architectural linework fidelity.",
      prompt: "Razor-sharp Canny edge preservation across mullions, stone joints, and cantilevered roof edges.",
      engine: { annotatorMode: "canny", annotatorThreshold: 45, edgeAdherence: 88 },
    },
    {
      title: "Normal Map Relief Texture Enforcement",
      benchmark: "Chaos Corona",
      pain: "Ensures relief masonry, fluted panels, and soffits catch directional sun.",
      tip: "Feeds surface normal vectors into lighting bounce.",
      prompt: "Surface-normal relief enforcement for crisp flute shadows, ashlar bevels, and mortar reveals.",
      engine: { annotatorMode: "normal", geometryLock: 89 },
    },
    {
      title: "Redline Sketch Markup Insertion",
      benchmark: "Rendair",
      pain: "Lets architects draw a quick redline box and convert it to proportional furniture.",
      tip: "Ideal with SAM-2 / Inpaint annotation brush.",
      prompt: "Seamlessly integrate annotated redline element in exact perspective scale matching surrounding lighting.",
      engine: { workflowPreset: "photoreal", inpaintStrength: 68 },
    },
    {
      title: "White Foam Competition Model Aesthetic",
      benchmark: "LookX",
      pain: "Produces clean competition diagrams when materials aren't finalized yet.",
      tip: "Crisp basswood trees, matte white museum board, and pure sunlight.",
      prompt: "Physical architectural competition scale model in matte museum board, basswood contour plinth, studio light.",
      impact: "High",
      design: { look: "Massing", color: "Warm white", mood: "Quiet" },
      engine: { workflowPreset: "clay-to-render", materialOverride: 25, geometryLock: 94 },
    },
    {
      title: "Sectional Perspective Occupancy Storytelling",
      benchmark: "LookX",
      pain: "Makes complex cultural sectional cuts immediately legible to non-architects.",
      tip: "Pairs crisp black section poché with warm inhabited interior rooms.",
      prompt: "Detailed architectural sectional perspective with clean crisp cut poché and illuminated interior life.",
      engine: { workflowPreset: "elevation-to-render", detailDensity: "intricate" },
    },
    {
      title: "Charcoal & Graphite Early Massing Study",
      benchmark: "PromeAI" as unknown as MarketBenchmark,
      pain: "Avoids premature photorealism during early schematic client check-ins.",
      tip: "Wait — keep benchmark clean; conveys poetic hand-drawn warmth.",
      prompt: "Expressive architectural graphite and warm wash concept illustration on heavyweight cotton rag.",
      engine: { workflowPreset: "sketch-to-render", sketchMode: "creative", mjStylize: 320 },
    },
    {
      title: "Rhino / Revit Viewport Screenshot Upgrade",
      benchmark: "Veras",
      pain: "Fixes jagged viewport anti-aliasing and flat OpenGL shading instantly.",
      tip: "Drop any raw CAD viewport grab and enable 85% Geometry Lock.",
      prompt: "Transform raw CAD viewport screenshot into full global illumination photoreal architectural plate.",
      impact: "High",
      engine: { workflowPreset: "photoreal", geometryLock: 88, annotatorMode: "mlsd" },
    },
    {
      title: "Multi-Reference Style + Massing Split",
      benchmark: "Krea",
      pain: "Stops reference photos from overriding your building's actual shape.",
      tip: "Keeps slot 1 for Massing structure and slot 2 strictly for Materials.",
      prompt: "Decoupled control: lock massing geometry from primary capture while transferring material warmth from reference.",
      impact: "High",
      engine: { ipAdapterEnabled: true, ipAdapterPreset: "style-composition", ipAdapterWeight: 68 },
    },
    {
      title: "SoftEdge Organic Landscape Contour Hold",
      benchmark: "LookX",
      pain: "Prevents rigid Canny lines from hardening flowing planting beds and trees.",
      tip: "Best for organic landscape & courtyard studies.",
      prompt: "Flowing organic planting beds, curved gravel paths, and soft boulder contours without hard polygonal edges.",
      engine: { annotatorMode: "softedge", geometryLock: 80 },
    },
    {
      title: "Sketch-to-Night Atmospheric Pivot",
      benchmark: "Rendair",
      pain: "Transforms daytime black-on-white pencil sketches directly into dusk hero views.",
      tip: "Keeps linework perspective while illuminating windows from scratch.",
      prompt: "Convert black-line architectural sketch directly into glowing dusk visualization against cobalt twilight.",
      design: { light: "Evening", time: "Evening", mood: "Warm" },
      engine: { workflowPreset: "sketch-to-render", edgeAdherence: 84 },
    },
    {
      title: "GLB Imported Model Studio Capture Sync",
      benchmark: "D5 Render",
      pain: "Bridges imported client .glb / .obj models directly into AI materialization.",
      tip: "Import GLB in 3D Viewport -> Lock Angle -> Render Photoreal.",
      prompt: "Materialize imported 3D GLB massing geometry with physically based reflections and ambient occlusion.",
      impact: "High",
      engine: { workflowPreset: "clay-to-render", geometryLock: 92, depthEnabled: true },
    },
    {
      title: "MLSD Straight-Line Interior Perspective Guard",
      benchmark: "Veras",
      pain: "Fixes slightly skewed hand-drawn room perspectives into true vertical corners.",
      tip: "Ideal for quick iPad Procreate interior room sketches.",
      prompt: "Enforce crisp MLSD orthogonal wall intersections, ceiling coves, and true two-point verticals.",
      engine: { annotatorMode: "mlsd", edgeAdherence: 91 },
    },
    {
      title: "Real-Time Krea-Style Draft Stream Boost",
      benchmark: "Krea",
      pain: "Eliminates slow 30-second waits while orbiting cameras or moving sun azimuth.",
      tip: "Enables live interactive preview updates as you explore.",
      prompt: "Fast responsive architectural iteration balancing clean massing readability with cohesive palette.",
      engine: { liveStreamEnabled: true, renderFidelity: "photoreal" },
    },
    {
      title: "Competition Diagrammatic Site Context Overlay",
      benchmark: "LookX",
      pain: "Clearly highlights the proposed building while keeping adjacent urban blocks understated.",
      tip: "Draws eyes straight to your design intervention.",
      prompt: "Architectural hero building fully detailed against softly desaturated matte limestone urban neighbor blocks.",
      engine: { workflowPreset: "photoreal", geometryLock: 86 },
    },
    {
      title: "Lineart Ink Wash Presentation Plate",
      benchmark: "Rendair",
      pain: "Offers a refined hybrid between fine architectural pen ink and soft watercolor mass.",
      tip: "Popular for civic town hall meetings and early donor approvals.",
      prompt: "Precision architectural ink linework layered with delicate atmospheric watercolor light washes.",
      engine: { annotatorMode: "lineart", sketchMode: "balanced", mjStylize: 240 },
    },
  ],

  "camera-optics": [
    {
      title: "2-Point Architectural Tilt-Shift Verticals",
      benchmark: "Chaos Corona",
      pain: "Eliminates converging vertical building lines that look amateurish.",
      tip: "Enables vertical shift compensation automatically in 3D & prompt.",
      prompt: "True 2-point architectural tilt-shift perspective with strictly parallel vertical building edges.",
      impact: "High",
      scene3d: { twoPointTilt: true, focalLength: 24 },
      design: { camera: "Eye level" },
    },
    {
      title: "24mm Wide Interior Spatial Flow",
      benchmark: "Chaos Corona",
      pain: "Captures full kitchen-to-living flow without awkward fisheye stretching.",
      tip: "Balanced 24mm shift lens keeps foreground armchairs un-distorted.",
      prompt: "24mm architectural tilt-shift interior wide perspective with zero barrel distortion at frame edges.",
      scene3d: { focalLength: 24, twoPointTilt: true },
      design: { camera: "Wide" },
    },
    {
      title: "35mm Documentary Monograph Prime",
      benchmark: "Chaos Corona",
      pain: "Fixes sterile overly wide CGI spaces with natural human-eye compression.",
      tip: "The gold-standard lens focal length for Architectural Digest & El Croquis.",
      prompt: "Leica 35mm documentary architectural prime lens compression with calm natural perspective.",
      impact: "High",
      scene3d: { focalLength: 35, cameraPreset: "eye" },
      design: { camera: "Eye level" },
    },
    {
      title: "50mm Tactile Material Joinery Vignette",
      benchmark: "Chaos Corona",
      pain: "Zooms in gracefully on stone-to-timber thresholds without losing room context.",
      tip: "Ideal for detail closeups in client finish books.",
      prompt: "50mm standard prime detail shot highlighting stone-to-oak junction craftsmanship and shallow DOF.",
      scene3d: { focalLength: 50, cameraPreset: "detail" },
      design: { camera: "Close detail" },
    },
    {
      title: "85mm Telephoto Courtyard Compression",
      benchmark: "D5 Render",
      pain: "Stacks foreground foliage, colonnades, and distant pavilion into painterly layers.",
      tip: "Turns wide empty plazas into intimate framed vignettes.",
      prompt: "85mm telephoto architectural compression layering foreground olive branches with crisp stone facade.",
      scene3d: { focalLength: 85, twoPointTilt: true },
    },
    {
      title: "Human Eye-Level 1.65m Horizon Lock",
      benchmark: "Veras",
      pain: "Avoids floating chest-high or ceiling-scraping camera angles.",
      tip: "Anchors viewer naturally inside the courtyard or foyer.",
      prompt: "True 1.65m standing eye-level horizon line centered for natural human spatial immersion.",
      scene3d: { cameraPreset: "eye" },
      design: { camera: "Eye level" },
    },
    {
      title: "Elevated 45° Oblique Three-Quarter",
      benchmark: "Rendair",
      pain: "Shows roof garden terrace + two facades in a single explanatory shot.",
      tip: "Best for residential villas and campus cluster briefs.",
      prompt: "Elevated three-quarter architectural perspective revealing both street elevation and upper terrace.",
      scene3d: { cameraPreset: "oblique" },
      design: { camera: "Elevated" },
    },
    {
      title: "Drone Masterplan Aerial Site Integration",
      benchmark: "LookX",
      pain: "Prevents aerial shots from looking like miniature toy models via haze & scale.",
      tip: "Pairs natural tree canopy variation with contextual street grids.",
      prompt: "Crisp high-altitude drone masterplan view anchoring site topography into surrounding urban fabric.",
      scene3d: { cameraPreset: "aerial", fogDensity: 18 },
    },
    {
      title: "Symmetrical One-Point Gallery Axis",
      benchmark: "Chaos Corona",
      pain: "Reigns in cluttered off-axis angles when shooting ceremonial foyers.",
      tip: "Emphasizes axial portal vistas and reflection symmetry.",
      prompt: "Dead-center axial one-point perspective framing symmetrical portal vista and aligned pendant row.",
      scene3d: { focalLength: 35, twoPointTilt: true },
    },
    {
      title: "Framing Through Architectural Thresholds",
      benchmark: "Chaos Corona",
      pain: "Fixes flat unlayered exteriors by placing dark timber/stone threshold framing in front.",
      tip: "Creates cinematic depth into illuminated garden rooms.",
      prompt: "Framed foreground threshold looking through shadowed colonnade toward sunlit courtyard garden.",
    },
    {
      title: "21:9 CinemaScope Panoramic Outpaint Frame",
      benchmark: "Krea",
      pain: "Fixes tightly cropped 3D captures by seamlessly extending sky & flanking context.",
      tip: "Turns cramped exports into sweeping competition boards.",
      prompt: "Panoramic 21:9 architectural vista seamlessly extending flanking garden walls and sky horizon.",
      engine: { outpaintRatio: "21:9" },
      frame: { ratio: "16:9" },
    },
    {
      title: "9:16 Vertical Editorial Story Composition",
      benchmark: "Krea",
      pain: "Saves vertical height of atriums, staircases, and residential towers cleanly.",
      tip: "Optimizes framing for mobile client decks and social showcases.",
      prompt: "Vertical 9:16 architectural portrait emphasizing towering height, double-height glazing, and sky zenith.",
      frame: { ratio: "9:16" },
    },
    {
      title: "Rule-of-Thirds Pool & Villa Balance",
      benchmark: "D5 Render",
      pain: "Prevents busy center-weighted compositions where pool water fights the facade.",
      tip: "Places horizon comfortably on lower third with clean negative sky.",
      prompt: "Balanced rule-of-thirds composition pairing quiet foreground reflecting water with crisp villa volume.",
    },
    {
      title: "Low-Angle Civic Monumentality Look-Up",
      benchmark: "LookX",
      pain: "Gives cultural pavilions and cantilevers dramatic upward sculptural poise.",
      tip: "Use subtle 24mm shift so undersides of eaves shine cleanly.",
      prompt: "Respectful low-angle upward vista celebrating deep timber soffit cantilever against crisp sky.",
      scene3d: { focalLength: 24, twoPointTilt: false },
    },
    {
      title: "Cross-Room Layered Aperture Vista",
      benchmark: "Chaos Corona",
      pain: "Eliminates dead-end flat room photos by opening pocket doors into secondary rooms.",
      tip: "Shows dining room -> courtyard -> studio depth in one frame.",
      prompt: "Multi-layered interior vista looking across dining island through sliding pocket glazing into garden.",
    },
    {
      title: "Locked Multi-Angle Consistent Camera Rig",
      benchmark: "Veras",
      pain: "Stops different camera views of the same building from changing cladding materials.",
      tip: "Locks seed + House Style across Interior, Exterior, and Detail views.",
      prompt: "Multi-angle consistency lock: preserve identical travertine shade, oak stain, and sky exposure across cameras.",
      impact: "High",
      engine: { seedLocked: true, geometryLock: 92 },
    },
    {
      title: "Gentle Foreground Vignette Depth Falloff",
      benchmark: "D5 Render",
      pain: "Draws eyes cleanly onto the architectural entrance rather than foreground pavement.",
      tip: "Subtle natural lens falloff without artificial heavy black corners.",
      prompt: "Subtle natural medium-format lens corner falloff guiding attention softly to glowing entry portal.",
    },
    {
      title: "Zero-Warped Furniture Edge Margin",
      benchmark: "Rendair",
      pain: "Prevents lounge chairs and coffee tables near frame corners from stretching oval.",
      tip: "Switches from ultrawide distortion to clean 35mm orthographic feel.",
      prompt: "Zero edge-stretching geometry across foreground lounge chairs, coffee table, and carpet corners.",
      scene3d: { focalLength: 35 },
    },
    {
      title: "4:3 Architectural Monograph Print Crop",
      benchmark: "Chaos Corona",
      pain: "Gives generous vertical headroom above roofs & trees for print publications.",
      tip: "Switches studio aspect ratio cleanly to 4:3 editorial print.",
      prompt: "Classic 4:3 architectural monograph framing balancing sky breathing room and foreground plinth.",
      frame: { ratio: "4:3" },
    },
    {
      title: "Smooth Orbit-Dolly-Zoom Flythrough Ready",
      benchmark: "D5 Render",
      pain: "Ensures keyframe camera positions don't clip through columns during 4s clips.",
      tip: "Sets eye-level clear sightline height ready for 3D flythrough capture.",
      prompt: "Unobstructed clear sightline framing prepared for smooth camera orbit-dolly-zoom transition.",
      queue: { label: "Camera Rig Hero Frame", preset: "photoreal", light: "Golden hour", cameraPreset: "oblique" },
    },
  ],

  "entourage-landscape": [
    {
      title: "Subtle 1/15s Motion-Blurred Gallery Figures",
      benchmark: "Chaos Corona",
      pain: "Fixes stiff frozen mannequin-like AI people looking straight into the lens.",
      tip: "Adds authentic editorial tripod exposure movement to walking visitors.",
      prompt: "Two architectural scale visitors mid-stride with natural subtle 1/15s slow-shutter motion blur.",
      impact: "High",
      design: { people: "Few", activity: "Walking" },
    },
    {
      title: "Zero-Crowding Quiet Hospitality Occupancy",
      benchmark: "D5 Render",
      pain: "Stops AI from jamming 40 cartoon tourists into a calm boutique lobby.",
      tip: "Sets calibrated sparse human scale without visual clutter.",
      prompt: "Calm sparse occupancy: two seated guests reading softly in silhouette without blocking millwork.",
      design: { people: "Few", activity: "Sitting", mood: "Serene" },
    },
    {
      title: "Mediterranean Gnarled Specimen Olive Trees",
      benchmark: "D5 Render",
      pain: "Replaces generic blobby lollipop trees with sculptural silver-leaf olive silhouettes.",
      tip: "Includes realistic dry-stone planter beds & lavender undergrowth.",
      prompt: "Sculptural specimen ancient olive trees with silver-green leaves casting crisp shadow patterns.",
      engine: { climateRegion: "Temperate Coastal" },
    },
    {
      title: "Native Pennisetum & Miscanthus Meadow Grasses",
      benchmark: "LookX",
      pain: "Replaces artificial neon-green golf-course lawns with ecological native planting.",
      tip: "Backlit feathery grasses glow beautifully at Golden Hour.",
      prompt: "Ornamental windswept feather grasses and native perennials catching warm backlit evening sun.",
      design: { light: "Golden hour", mood: "Warm" },
    },
    {
      title: "Urban Pocket Courtyard Birch Groves",
      benchmark: "D5 Render",
      pain: "Adds slim airy birch trunks that reveal facade architecture behind leaves.",
      tip: "Won't block windows or obscure elevation lines.",
      prompt: "Slender multi-stem white silver birches allowing clean architectural facade visibility through foliage.",
    },
    {
      title: "Calibrated Wind-Ripple Pool Water Caustics",
      benchmark: "Chaos Corona",
      pain: "Fixes flat plastic turquoise water planes on courtyard infinity pools.",
      tip: "Adds subtle surface breeze ripples and natural limestone edge wetting.",
      prompt: "Crystal-clear infinity pool with delicate breeze micro-ripples, soft stone caustics, and wet coping edge.",
    },
    {
      title: "Autumn Amber Canopy & Scattered Leaves",
      benchmark: "LookX",
      pain: "Brings crisp seasonal warmth to timber and brick educational campuses.",
      tip: "Scatters natural dry leaves lightly along granite curbs.",
      prompt: "Golden-amber autumn maple canopy with sparse fallen leaves resting along crisp granite plaza joints.",
      design: { mood: "Warm", color: "Oak" },
    },
    {
      title: "Subtropical Monstera, Fan Palm & Timber Deck",
      benchmark: "D5 Render",
      pain: "Grounds resort residences in lush layered rainforest shade rather than barren dirt.",
      tip: "Aligns broadleaf textures cleanly with teak louver eaves.",
      prompt: "Layered subtropical courtyard ferns, sculptural fan palms, and dark volcanic stepping stones.",
      engine: { climateRegion: "Subtropical Humid" },
    },
    {
      title: "Human Scale Shadow Grounding Check",
      benchmark: "Veras",
      pain: "Fixes floating pasted-on people who lack ambient contact shadows on paving.",
      tip: "Enforces soft occlusion right beneath footwear and chair legs.",
      prompt: "Every seated and standing scale figure firmly grounded with crisp sun and contact occlusion shadows.",
      impact: "High",
    },
    {
      title: "Cafe Terrace Table Setting Storytelling",
      benchmark: "Rendair",
      pain: "Replaces bare empty plaza tables with subtle linen, espresso cups, and brass lamps.",
      tip: "Gives hospitality renders an immediate lived-in boutique feel.",
      prompt: "Curated terrace bistro tables with matte stoneware cups, warm rechargeable table lamps, and shade.",
      design: { activity: "Dining", people: "Medium" },
    },
    {
      title: "Urban Cyclist & Transit Edge Activity",
      benchmark: "LookX",
      pain: "Connects civic transit halls realistically to active streetscape bicycle lanes.",
      tip: "Adds natural scale cue along wide public plazas.",
      prompt: "Soft-motion urban commuters passing neatly by illuminated ground-floor public arcade colonnade.",
      engine: { climateRegion: "Urban Dense" },
    },
    {
      title: "Gravel Permeable Garden Drainage Border",
      benchmark: "Chaos Corona",
      pain: "Stops wall bases from awkwardly meeting green lawn without an architectural edge.",
      tip: "Adds a clean 40cm French gravel & steel edging strip.",
      prompt: "Architectural 40cm pale pea-gravel French drain perimeter edged with crisp galvanized steel.",
    },
    {
      title: "Rooftop Biodiversity Sedum Blanket",
      benchmark: "LookX",
      pain: "Transforms dull grey flat membrane roofs in aerial shots into living green roofs.",
      tip: "Includes modular stone ballast walkways and sleek solar arrays.",
      prompt: "Vegetated extensive sedum green roof tray modules framed by pale river-stone ballast walkways.",
    },
    {
      title: "Weathered Cedar Outdoor Pergola Lounging",
      benchmark: "Rendair",
      pain: "Integrates minimalist outdoor sunbeds naturally alongside pool pavilions.",
      tip: "Matches teak frames cleanly to indoor oak flooring.",
      prompt: "Low-slung teak outdoor lounge beds with muted stone-grey cushions beneath slatted pergola shade.",
    },
    {
      title: "Monsoon Raindrops & Wet Terracotta Coping",
      benchmark: "D5 Render",
      pain: "Captures authentic humid climate richness rather than dry desert renders.",
      tip: "Darkens wet stone tones realistically at splash zones.",
      prompt: "Dampened dark stone rain-splash zones along terraced planters with humid misty atmosphere.",
      design: { weather: "Mist", mood: "Serene" },
    },
    {
      title: "Minimalist Art Plinth & Gallery Pedestal Staging",
      benchmark: "Chaos Corona",
      pain: "Avoids generic AI stock art by requesting subtle tonal abstract sculpture/canvas.",
      tip: "Harmonizes interior focal wall art with architectural limestone.",
      prompt: "Tactile plaster relief canvas and cast bronze plinth sculpture scaled proportionately to foyer wall.",
    },
    {
      title: "Desert Xeriscape Agave & Boulders",
      benchmark: "D5 Render",
      pain: "Stops desert projects from accidentally spawning lush wet grass lawns.",
      tip: "Places weathered desert granite boulders, agaves, and decomposed granite.",
      prompt: "Authentic arid xeriscape courtyard with sculptural agave, prickly pear, and warm decomposed granite.",
      engine: { climateRegion: "Arid Desert" },
    },
    {
      title: "Subtle Vehicle Reflection Scale Restraint",
      benchmark: "Veras",
      pain: "Prevents flashy fake supercars from distracting from residential architecture.",
      tip: "Keeps driveways calm with understated matte sedans or clean clear paving.",
      prompt: "Unobtrusive understated electric sedan parked quietly in shadow without chrome reflection distraction.",
    },
    {
      title: "Evening Architectural Bollard Path Rhythm",
      benchmark: "D5 Render",
      pain: "Replaces harsh stadium floodlights with low-glare warm knee-height pathway bollards.",
      tip: "Guides eye from driveway curb right up to the front pivot door.",
      prompt: "Warm shielded 2700K dark-bronze pathway bollards washing limestone garden treads at dusk.",
      design: { light: "Evening", time: "Evening" },
    },
    {
      title: "Window Interior Backdrop Curtains & Life",
      benchmark: "Veras",
      pain: "Stops exterior windows from looking like blank dark mirrors or empty shells.",
      tip: "Places warm sheer curtains, hanging pendants, and bookshelves softly inside.",
      prompt: "Subtly visible warm interior rooms behind glazing with sheer linen drapery and soft bookwall.",
      impact: "High",
    },
  ],

  "post-upscale": [
    {
      title: "Magnific-Style 4× Tile Micro-Detail Recovery",
      benchmark: "Magnific",
      pain: "Eliminates smudged foliage, fabric, and stone grain in raw 1K draft plates.",
      tip: "Preserves exact silhouette while hallucinating realistic 4× pores.",
      prompt: "High-frequency micro-detail recovery across travertine pores, linen weave, oak grain, and leaf veins.",
      impact: "High",
      engine: { enhanceMode: "micro-detail", upscaleFactor: 4, esrganModel: "4x-ArchSharp", esrganDenoise: 22 },
    },
    {
      title: "8K Print-Ready Client Presentation Upscale",
      benchmark: "Magnific",
      pain: "Fixes pixelation when clients inspect 4K/8K wall monitors or print boards.",
      tip: "Switches frame resolution target to 2K + 4× ArchSharp upscaling.",
      prompt: "Sharp 8K architectural presentation print master free of banding, chromatic fringe, or haloing.",
      impact: "High",
      frame: { resolution: "2k" },
      engine: { upscaleFactor: 8, esrganModel: "4x-ArchSharp", enhanceMode: "micro-detail" },
    },
    {
      title: "12K–15K Exhibition Wall Mural Export Prep",
      benchmark: "Magnific",
      pain: "Prevents tile seam artifacts when scaling renders for showroom trade-show walls.",
      tip: "Low tile denoise (18%) + 8× ArchSharp model holds crisp straight lines.",
      prompt: "Exhibition mural 15K-grade ultra-crisp edge retention with balanced micro-film grain.",
      frame: { resolution: "2k" },
      engine: { upscaleFactor: 8, esrganDenoise: 18, esrganFaceEnhance: true },
    },
    {
      title: "Grounded-SAM 2 Selective Furniture Swap Prep",
      benchmark: "Krea",
      pain: "Lets users click a single sofa or island to swap it without touching walls or light.",
      tip: "Click SAM-2 Seg -> click furniture -> apply Google reference or prompt swap.",
      prompt: "Localized furniture replacement inside segmented mask matching exact floor shadow direction.",
      impact: "High",
      engine: { iopaintTask: "replace", iopaintModel: "brushnet", samThreshold: 55 },
    },
    {
      title: "Grounded-SAM 2 Cladding & Facade Zone Mask",
      benchmark: "Veras",
      pain: "Isolates exterior cladding strictly so windows and sky never get repainted.",
      tip: "Use with SAM-2 click selection + Materials & Finishes swap.",
      prompt: "Re-clad isolated facade mask zone strictly while keeping glass reflections, mullions, and sky untouched.",
      engine: { iopaintTask: "replace", samPrompt: "exterior wall facade cladding", geometryLock: 94 },
    },
    {
      title: "IOPaint Clean Wire & Crane Removal (LaMa)",
      benchmark: "Krea",
      pain: "Cleans overhead power lines, construction cones, or site signs from site photos.",
      tip: "Select brush or SAM-2 -> Erase with LaMa for spotless site photos.",
      prompt: "Spotless site photo cleanup erasing temporary construction signage and overhead powerlines naturally.",
      engine: { iopaintTask: "erase", iopaintModel: "lama", iopaintMaskDilate: 8 },
    },
    {
      title: "Paint-by-Example Reference Furniture Integration",
      benchmark: "Krea",
      pain: "Places an exact client reference chair or luminaire proportionally into the room.",
      tip: "Pair reference image URL inside IOPaint / Annotation mask.",
      prompt: "Paint-by-example proportion match integrating reference furniture piece cleanly into perspective grid.",
      engine: { iopaintTask: "paint-by-example", iopaintModel: "paint-by-example" },
    },
    {
      title: "Client-Proof Deterministic Seed Freeze",
      benchmark: "Veras",
      pain: "Fixes erratic changes when tweaking a single word in prompt notes.",
      tip: "Locks RNG seed + geometry so edits stay surgical and predictable.",
      prompt: "Seed-locked surgical refinement keeping composition, camera framing, and light angles invariant.",
      impact: "High",
      engine: { seedLocked: true, geometryLock: 92 },
    },
    {
      title: "Chromatic Aberration & Halo Cleanup QC",
      benchmark: "Chaos Corona",
      pain: "Removes over-sharpened white/dark halos along roof silhouettes against bright skies.",
      tip: "Lowers sharpen aggressiveness while boosting optical lens cleanliness.",
      prompt: "Clean optical roof-to-sky transition free of sharpening halos, color fringe, or AI painterly artifacts.",
      engine: { renderFidelity: "editorial", esrganDenoise: 30 },
    },
    {
      title: "Face & Gesture Cleanup on Architectural Figures",
      benchmark: "Magnific",
      pain: "Fixes melted hands or uncanny eyes on foreground human scale figures.",
      tip: "Enables GFPGAN subtle restoration pass on upscale.",
      prompt: "Natural subtle figure anatomy and crisp wardrobe drapery without distorted limbs.",
      engine: { esrganFaceEnhance: true, iopaintFaceModel: "gfpgan" },
    },
    {
      title: "Zero-Plastic Skin & Wood Grain De-Smoothing",
      benchmark: "Chaos Corona",
      pain: "Counters over-denoised waxy AI interiors with natural film silver grain.",
      tip: "Retains honest pores and subtle tactile imperfection.",
      prompt: "Fine natural 35mm medium-format silver grain preventing waxy synthetic CGI plastic surfaces.",
      engine: { esrganDenoise: 15, detailDensity: "intricate" },
    },
    {
      title: "Architectural Glare & Bloom Restraint",
      benchmark: "D5 Render",
      pain: "Turns off aggressive neon starbursts around sconces and track spots.",
      tip: "Creates clean photographic highlight rolloff like a real cinema sensor.",
      prompt: "Controlled natural highlight rolloff on linear sconces with zero artificial CGI lens-flare clutter.",
      design: { mood: "Quiet" },
    },
    {
      title: "Directional Floor & Ceiling Padding Uncrop",
      benchmark: "Krea",
      pain: "Fixes chopped-off ceiling coffers or cut-off foreground rug borders.",
      tip: "Use directional top/bottom pad in Inpaint Workspace cleanly.",
      prompt: "Seamless directional ceiling & foreground floor extension maintaining linear hardwood planks.",
      engine: { iopaintTask: "outpaint" },
    },
    {
      title: "Sky-Clean Background Isolation (RMBG-2.0)",
      benchmark: "Krea",
      pain: "Lets designers swap harsh gray site skies cleanly behind complex tree branches.",
      tip: "One click isolates foreground architecture cleanly.",
      prompt: "Crisp architectural silhouette separation preserving fine twig edges against clean sky replacement.",
      engine: { iopaintRemoveBgModel: "rmbg-2.0" },
    },
    {
      title: "AnyText Wayfinding & Building Signage Crispness",
      benchmark: "Krea",
      pain: "Stops garbled gibberish lettering on museum entrances or hotel lobbies.",
      tip: "Renders clean legible brass/stone wayfinding typography.",
      prompt: "Crisp legible architectural brass wayfinding signage integrated flush on honed limestone pier.",
      engine: { iopaintTask: "anytext", iopaintModel: "anytext" },
    },
    {
      title: "Contrast & Black-Point Editorial Calibration",
      benchmark: "Chaos Corona",
      pain: "Fixes washed-out milky shadows by anchoring true neutral architectural blacks.",
      tip: "Keeps shadow detail readable while adding magazine punch.",
      prompt: "Rich balanced shadow blacks and luminous stone midtones following architectural monograph grading.",
    },
    {
      title: "Glazing Reflection Opacity Balance Pass",
      benchmark: "Veras",
      pain: "Stops glass windows from looking like solid silver chrome mirrors.",
      tip: "Shows subtle sky clouds blended smoothly with warm interior ceiling glow.",
      prompt: "Physically balanced 35% glazing sky reflection letting warm interior wood ceilings read clearly.",
      impact: "High",
    },
    {
      title: "Material Seam & Skirting Junction QC",
      benchmark: "Chaos Corona",
      pain: "Cleans messy wall-to-floor blurs where stone baseboards should meet wood.",
      tip: "Sharpened boundary junction detailing for luxury interiors.",
      prompt: "Crisp clean stone-to-hardwood floor expansion joint, brass T-strip, and flush baseboard reveal.",
    },
    {
      title: "BrushNet Complex Texture Blend Recovery",
      benchmark: "Krea",
      pain: "Fixes hard rectangular paste seams after local brush inpainting.",
      tip: "Enables 10px mask dilation + BrushNet seamless blending.",
      prompt: "Seamless feathered texture and ambient bounce blending across edited interior zones.",
      engine: { iopaintModel: "brushnet", iopaintMaskDilate: 10 },
    },
    {
      title: "Iterative A/B Split-Slider QC Checkpoint",
      benchmark: "Veras",
      pain: "Catches subtle window moves immediately by comparing directly against source.",
      tip: "Run Compare slider after every render before exporting to clients.",
      prompt: "Tolerance-checked photoreal plate verified for zero structural geometry deviation from baseline.",
    },
  ],

  "motion-360-client": [
    {
      title: "Day-to-Night Smooth Time-Lapse Transition",
      benchmark: "D5 Render",
      pain: "Clients want to see how a space feels from crisp morning coffee to evening dinner.",
      tip: "Queues Morning, Solar Noon, Golden Hour, and Midnight sequentially.",
      prompt: "Continuous day-to-night lighting sequence keeping exact furniture, trees, and framing static.",
      impact: "High",
      queue: { label: "Day-to-Night Keyframe", preset: "photoreal", light: "Evening", sunHour: 19.5 },
    },
    {
      title: "3-Keyframe Orbit-Dolly-Zoom 4s Flythrough",
      benchmark: "D5 Render",
      pain: "Eliminates choppy jerky camera spins in quick client walkthrough teasers.",
      tip: "Record Orbit, Dolly, and Zoom inside 3D Viewport to generate smooth motion.",
      prompt: "Cinematic slow 4-second architectural orbit-dolly-zoom flythrough with stable temporal exposure.",
      impact: "High",
      scene3d: { cameraPreset: "oblique" },
    },
    {
      title: "360° Equirectangular Interior/Exterior Hotspot Walk",
      benchmark: "Chaos Corona",
      pain: "Lets clients step inside and look up at skylights & down at stone junctions freely.",
      tip: "Open 360° Tour stage directly after rendering your hero plate.",
      prompt: "Immersive 360-degree continuous horizon spatial panorama with natural balanced skylight exposure.",
      impact: "High",
    },
    {
      title: "Frozen Mood & Frozen Palette Session Lock",
      benchmark: "Veras",
      pain: "Stops 3D rotation or 2D-to-3D switches from accidentally resetting your house style.",
      tip: "Locks House Style DNA + Seed + Geometry Lock across all camera captures.",
      prompt: "Session mood freeze: enforce identical material palette, sun temperature, and contrast across angles.",
      impact: "High",
      engine: { seedLocked: true, geometryLock: 92, ipAdapterEnabled: true },
    },
    {
      title: "Client Option A / B / C Facade Comparison Pack",
      benchmark: "Veras",
      pain: "Replaces slow 3-day manual rendering of alternate limestone vs. brick vs. timber schemes.",
      tip: "Queues 3 clean material options with locked camera and sun angle.",
      prompt: "Option comparison pass: keep camera, lighting, and trees identical while varying primary cladding material.",
      impact: "High",
      queue: { label: "Material Option Pass", preset: "photoreal", light: "Golden hour" },
    },
    {
      title: "Node-Based 1-Click Image → Video → 360° Chain",
      benchmark: "Krea",
      pain: "Hides complex ComfyUI wiring behind 5 clean visual drag-and-drop nodes.",
      tip: "Use the Node Editor stage with Image, ControlNet, Video, 360°, and 3D nodes.",
      prompt: "Streamlined multi-output node workflow compiling conditioned image into motion and 360° outputs.",
      impact: "High",
    },
    {
      title: "GLB Custom CAD Model → Camera Capture → Render",
      benchmark: "D5 Render",
      pain: "Reduces friction importing client Rhino/SketchUp/Blender GLB files.",
      tip: "Drop .glb into 3D Viewport, frame camera inside/outside, capture & render.",
      prompt: "Photoreal architectural finish applied directly to captured custom GLB geometry viewport angle.",
      impact: "High",
      engine: { workflowPreset: "clay-to-render", geometryLock: 91 },
    },
    {
      title: "Zero-Complication 3-Click Guided Brief Flow",
      benchmark: "Rendair",
      pain: "Prevents new architects from getting lost in 40 technical sliders.",
      tip: "Follow the top 3-step studio bar: Source -> Auto-Build Style -> Render.",
      prompt: "Accessible studio configuration balancing high architectural fidelity with streamlined defaults.",
    },
    {
      title: "Batch Overnight Daylight + Angle Render Queue",
      benchmark: "Chaos Corona",
      pain: "Automates rendering 6 variations sequentially while the designer reviews other sheets.",
      tip: "Add scenes to Render Queue with visual status progress bars.",
      prompt: "Consistent batch visualization pass sharing unified firm color grade and lens optics.",
      queue: { label: "Overnight Hero Batch", preset: "photoreal", light: "Daylight", sunHour: 10 },
    },
    {
      title: "Skill Preset Capture for N-Image Batch Reuse",
      benchmark: "Veras",
      pain: "Saves designers from re-entering the same prompt & look across 20 room views.",
      tip: "Apply saved Market Copilot selections across every new photo dropped in.",
      prompt: "Reusable firm preset blueprint applying cohesive materials, optics, and lighting across project sets.",
    },
    {
      title: "Annotated Spatial Proportion Brief PDF Export",
      benchmark: "Rendair",
      pain: "Clients demand clean PDF spec decks rather than loose chat screenshots.",
      tip: "Use Brief Builder's PDF Presentation export after building your vision.",
      prompt: "Client presentation specification ready: crystal material legibility and balanced daylight.",
    },
    {
      title: "Unique-Link Team Review & Pin Markup Sync",
      benchmark: "Krea",
      pain: "Eliminates messy emailed screenshot circles during partner design critiques.",
      tip: "Share unique project link so teammates comment and pin directly on renders.",
      prompt: "Collaborative review baseline render prepared for clear pin-point revision feedback.",
    },
    {
      title: "Automated Reference Moodboard Inspiration Sync",
      benchmark: "Rendair",
      pain: "Saves 45 minutes of Pinterest hunting before kicking off client mood approvals.",
      tip: "Use Brief Builder's Moodboard Overlay to fetch real architectural references.",
      prompt: "Editorial moodboard-aligned architectural material study with cohesive surface temperature.",
    },
    {
      title: "Hospitality Evening Lobby Kinetic Crowd Loop",
      benchmark: "D5 Render",
      pain: "Static hotel lobby renders feel lifeless in digital pitch decks.",
      tip: "Subtle fireplace flicker + gentle guest motion for 4s ambient video.",
      prompt: "Warm inviting hotel lobby twilight ambiance with delicate hearth light glow and calm movement.",
      design: { light: "Evening", people: "Medium", activity: "Sitting" },
    },
    {
      title: "Wind-Driven Tree Canopy Ambient Video Breeze",
      benchmark: "D5 Render",
      pain: "Transforms still villa renders into soothing living website hero banners.",
      tip: "Pairs subtle branch sway with soft water pool shimmer.",
      prompt: "Subtle natural tree canopy breeze and calm pool reflection ripple for living architectural motion.",
    },
    {
      title: "Interior Room Camera Placement Interior/Exterior",
      benchmark: "Chaos Corona",
      pain: "Lets architects drop cameras inside tight rooms OR outside across the street seamlessly.",
      tip: "Switch Camera Preset (Eye / Oblique / Aerial / Detail) inside 3D Viewport.",
      prompt: "Seamless interior-to-exterior visual continuity linking garden terrace directly with living room.",
      scene3d: { cameraPreset: "eye", focalLength: 24 },
    },
    {
      title: "Developer Presale Marketing Hero Brochure",
      benchmark: "LookX",
      pain: "Residential developers need aspirational lifestyle warmth without fake over-saturation.",
      tip: "Balances twilight interior warmth with clean neighborhood context.",
      prompt: "Aspirational developer brochure hero visualization balancing warm livable interiors and crisp facade.",
      impact: "High",
      design: { light: "Golden hour", mood: "Warm" },
    },
    {
      title: "Municipal Zoning & Massing Sun-Study Evidence",
      benchmark: "Veras",
      pain: "Planning commissions reject stylized artistic renders that obscure shadow envelopes.",
      tip: "Enforces true Geolocation Latitude/Month/Hour sun vectors.",
      prompt: "Accurate planning-board shadow study preserving neighborhood setbacks, roof heights, and foliage.",
      scene3d: { geoEnabled: true, geoHour: 14, geoMonth: 6 },
    },
    {
      title: "Mobile Touch-Friendly Client Showcase Deck",
      benchmark: "Rendair",
      pain: "Principals review projects on phones/tablets on-site and can't pinch tiny sliders.",
      tip: "Clean responsive studio controls keep 80% canvas visible on all screens.",
      prompt: "High-legibility mobile-ready contrast composition with strong focal hierarchy.",
    },
    {
      title: "Auto-Approved Full Production Quality Baseline",
      benchmark: "Veras",
      pain: "Applies verified studio best practices in one click instead of toggling 12 panels.",
      tip: "Auto-mode baseline combining Geometry Lock + 35mm Tilt-Shift + High Detail.",
      prompt: "Full production baseline: 2-point tilt-shift verticals, true-scale PBR joinery, natural daylight bounce.",
      impact: "High",
      engine: { geometryLock: 92, seedLocked: true, renderFidelity: "photoreal", enhanceMode: "micro-detail" },
      scene3d: { twoPointTilt: true, focalLength: 35 },
      design: { detail: "High detail", strength: "Balanced" },
    },
  ],
};

export const MARKET_SUGGESTIONS: readonly MarketSuggestion[] = (() => {
  const out: MarketSuggestion[] = [];
  let idx = 1;
  for (const cat of MARKET_SUGGESTION_CATEGORIES) {
    const rawList = RAW_BY_CATEGORY[cat.id];
    for (const raw of rawList) {
      const padded = String(idx).padStart(3, "0");
      // Normalize any fallback benchmark name cleanly
      const benchmark: MarketBenchmark = MARKET_BENCHMARKS.includes(raw.benchmark)
        ? raw.benchmark
        : "Rendair";
      out.push({
        id: `mkt-${padded}`,
        index: idx,
        title: raw.title,
        category: cat.id,
        categoryLabel: CATEGORY_LABEL_MAP[cat.id],
        marketBenchmark: benchmark,
        painPointSolved: raw.pain,
        userFriendlyTip: raw.tip,
        promptPatch: raw.prompt,
        estimatedImpact: raw.impact ?? "Medium",
        enginePatch: raw.engine,
        designPatch: raw.design,
        scene3dPatch: raw.scene3d,
        framePatch: raw.frame,
        autoQueuePreset: raw.queue,
      });
      idx += 1;
    }
  }
  return out;
})();

export type MarketAutopilotPack = {
  id: string;
  name: string;
  description: string;
  suggestionIds: string[];
  recommendedQueueTrio?: boolean;
};

export const MARKET_AUTOPILOT_PACKS: readonly MarketAutopilotPack[] = [
  {
    id: "pack-hero-photoreal",
    name: "Hero Photoreal Finish (5)",
    description: "Locks geometry & seed, applies 2-point tilt-shift, neutral sky balance, and 4× micro-detail.",
    suggestionIds: ["mkt-001", "mkt-020", "mkt-081", "mkt-121", "mkt-160"],
  },
  {
    id: "pack-daylight-trio",
    name: "Day-to-Night Lighting Suite (5)",
    description: "Calibrates Morning 08:00, Solar Noon, Golden Hour, Blue-Hour Twilight & Midnight uplighting.",
    suggestionIds: ["mkt-021", "mkt-022", "mkt-023", "mkt-024", "mkt-025"],
    recommendedQueueTrio: true,
  },
  {
    id: "pack-materials-craft",
    name: "Tactile PBR Craft Pack (5)",
    description: "Board-formed concrete, honed travertine, rift oak fluting, low-iron glass & roughness breakup.",
    suggestionIds: ["mkt-041", "mkt-042", "mkt-044", "mkt-047", "mkt-060"],
  },
  {
    id: "pack-sam2-segmentation",
    name: "SAM-2 Mask & Clean Swap Pack (4)",
    description: "Prepares click-to-segment furniture/facade replacement, wire cleanup & BrushNet blending.",
    suggestionIds: ["mkt-124", "mkt-125", "mkt-126", "mkt-139"],
  },
  {
    id: "pack-motion-360",
    name: "Motion, 360° & GLB Pipeline (5)",
    description: "Enables Day-to-Night transitions, 3-keyframe flythrough prep, 360° panorama, GLB capture & mood freeze.",
    suggestionIds: ["mkt-141", "mkt-142", "mkt-143", "mkt-144", "mkt-147"],
    recommendedQueueTrio: true,
  },
  {
    id: "pack-sketch-to-render",
    name: "Sketch & CAD Massing Pack (5)",
    description: "Locks 2D trace/viewport captures with MLSD verticals, Canny linework & live draft stream.",
    suggestionIds: ["mkt-061", "mkt-062", "mkt-066", "mkt-072", "mkt-078"],
  },
];

export type MarketFilterInput = {
  query?: string;
  category?: MarketCategoryId | "all";
  benchmark?: MarketBenchmark | "all";
  statusFilter?: "all" | "pending" | "approved" | "applied";
  approvedIds?: readonly string[];
  appliedIds?: readonly string[];
};

export function filterMarketSuggestions(
  items: readonly MarketSuggestion[],
  filters: MarketFilterInput,
): MarketSuggestion[] {
  const q = (filters.query ?? "").trim().toLowerCase();
  const approvedSet = new Set(filters.approvedIds ?? []);
  const appliedSet = new Set(filters.appliedIds ?? []);

  return items.filter((item) => {
    if (filters.category && filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    if (filters.benchmark && filters.benchmark !== "all" && item.marketBenchmark !== filters.benchmark) {
      return false;
    }
    if (filters.statusFilter && filters.statusFilter !== "all") {
      const isApplied = appliedSet.has(item.id);
      const isApproved = approvedSet.has(item.id) || isApplied;
      if (filters.statusFilter === "applied" && !isApplied) return false;
      if (filters.statusFilter === "approved" && !isApproved) return false;
      if (filters.statusFilter === "pending" && isApproved) return false;
    }
    if (!q) return true;
    const hay = `${item.title} ${item.categoryLabel} ${item.marketBenchmark} ${item.painPointSolved} ${item.userFriendlyTip} ${item.promptPatch}`.toLowerCase();
    return hay.includes(q);
  });
}

export function mergePromptNonDestructively(existingIdea: string, patch: string): string {
  const cleanPatch = patch.trim().replace(/\s+/g, " ");
  if (!cleanPatch) return existingIdea;
  const cleanIdea = existingIdea.trim();
  if (!cleanIdea) return cleanPatch;
  if (cleanIdea.toLowerCase().includes(cleanPatch.toLowerCase())) {
    return cleanIdea;
  }
  const sep = /[.!?]$/.test(cleanIdea) ? " " : ". ";
  return `${cleanIdea}${sep}${cleanPatch}`.slice(0, 3800);
}

export type StudioPatchTargetState = {
  idea: string;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  frame: Frame;
};

export function applyMarketSuggestionPatch(
  current: StudioPatchTargetState,
  suggestion: MarketSuggestion,
): StudioPatchTargetState {
  const nextIdea = mergePromptNonDestructively(current.idea, suggestion.promptPatch);
  const nextDesign = suggestion.designPatch
    ? sanitizeDesign({ ...current.design, ...suggestion.designPatch })
    : current.design;
  const nextEngine = suggestion.enginePatch
    ? sanitizeEngineState({ ...current.engine, ...suggestion.enginePatch })
    : current.engine;
  const nextScene3d = suggestion.scene3dPatch
    ? sanitizeScene3DState({ ...current.scene3d, ...suggestion.scene3dPatch })
    : current.scene3d;
  const nextFrame = suggestion.framePatch
    ? sanitizeFrame({ ...current.frame, ...suggestion.framePatch })
    : current.frame;

  return {
    idea: nextIdea,
    design: nextDesign,
    engine: nextEngine,
    scene3d: nextScene3d,
    frame: nextFrame,
  };
}

export function applyMarketSuggestionBatch(
  initial: StudioPatchTargetState,
  suggestions: readonly MarketSuggestion[],
): StudioPatchTargetState {
  let state = initial;
  for (const item of suggestions) {
    state = applyMarketSuggestionPatch(state, item);
  }
  return state;
}

export type AutoBuildQueuePlan = {
  orderedSuggestions: MarketSuggestion[];
  autoApprovedCount: number;
  queueJobs: Array<{
    label: string;
    preset: WorkflowPreset;
    light: string;
    sunHour?: number;
    cameraPreset?: CameraPreset3D;
    promptNote: string;
  }>;
  summaryText: string;
};

export function createAutoBuildQueuePlan(
  suggestions: readonly MarketSuggestion[],
  options?: { includeDaylightTrio?: boolean; baseLook?: string; basePreset?: WorkflowPreset },
): AutoBuildQueuePlan {
  const seen = new Set<string>();
  const orderedSuggestions: MarketSuggestion[] = [];
  for (const item of suggestions) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      orderedSuggestions.push(item);
    }
  }

  const queueJobs: AutoBuildQueuePlan["queueJobs"] = [];
  for (const item of orderedSuggestions) {
    if (item.autoQueuePreset) {
      queueJobs.push({
        label: item.autoQueuePreset.label,
        preset: item.autoQueuePreset.preset,
        light: item.autoQueuePreset.light,
        sunHour: item.autoQueuePreset.sunHour,
        cameraPreset: item.autoQueuePreset.cameraPreset,
        promptNote: item.promptPatch,
      });
    }
  }

  if (options?.includeDaylightTrio) {
    const baseLook = options.baseLook || "Studio Plate";
    const basePreset = options.basePreset || "photoreal";
    queueJobs.push(
      {
        label: `${baseLook} · Morning 08:00`,
        preset: basePreset,
        light: "Daylight",
        sunHour: 8,
        promptNote: "Morning crisp east sun, balanced facade exposure",
      },
      {
        label: `${baseLook} · Golden Hour 17:30`,
        preset: basePreset,
        light: "Golden hour",
        sunHour: 17.5,
        promptNote: "Golden hour low raking warm light with cool ambient fill",
      },
      {
        label: `${baseLook} · Midnight Blue Hour`,
        preset: basePreset,
        light: "Night",
        sunHour: 20.5,
        promptNote: "Blue-hour twilight exterior balanced with 2700K interior glow",
      },
    );
  }

  return {
    orderedSuggestions,
    autoApprovedCount: orderedSuggestions.length,
    queueJobs: queueJobs.slice(0, 12),
    summaryText: `Auto-approved ${orderedSuggestions.length} market upgrades${queueJobs.length > 0 ? ` and staged ${Math.min(12, queueJobs.length)} queued visual passes` : ""}.`,
  };
}

export function getMarketCategoryStats(
  items: readonly MarketSuggestion[],
  approvedIds: readonly string[],
  appliedIds: readonly string[],
): Array<{ id: MarketCategoryId; label: string; total: number; approved: number; applied: number }> {
  const approvedSet = new Set(approvedIds);
  const appliedSet = new Set(appliedIds);
  return MARKET_SUGGESTION_CATEGORIES.map((cat) => {
    const matching = items.filter((i) => i.category === cat.id);
    const applied = matching.filter((i) => appliedSet.has(i.id)).length;
    const approved = matching.filter((i) => approvedSet.has(i.id) || appliedSet.has(i.id)).length;
    return {
      id: cat.id,
      label: cat.label,
      total: matching.length,
      approved,
      applied,
    };
  });
}
