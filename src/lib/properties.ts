import { DEFAULT_ADVANCED, sanitizeAdvanced, type Advanced } from "@/lib/dictionary";

export const VERTICALS = [
  { id: "interior", label: "Interior" },
  { id: "exterior", label: "Exterior" },
  { id: "amenities", label: "Amenities" },
  { id: "landscape", label: "Landscape" },
] as const;

export type VerticalId = (typeof VERTICALS)[number]["id"];
export type PanelTab = "design" | "camera" | "light" | "human" | "mood" | "engine" | "advanced";

export const RANGES = ["Basic", "Standard", "Premium", "Luxury", "Ultra Luxury"] as const;
export const CAMERAS = ["Eye level", "Elevated", "Close detail", "Wide"] as const;
export const LIGHTS = ["Soft overcast", "Daylight", "Golden hour", "Evening", "Night"] as const;
export const MOODS = ["Quiet", "Warm", "Dramatic", "Serene", "Vibrant"] as const;
export const PEOPLE = ["None", "Few", "Medium", "Crowd"] as const;
export const ACTIVITIES = ["Sitting", "Walking", "Dining", "Working", "Swimming", "Exercising", "Playing"] as const;
export const COLORS = ["Warm white", "Sand", "Oak", "Charcoal", "Sage", "Ink blue"] as const;
export const WEATHER = ["Clear", "Cloudy", "Mist"] as const;
export const TIMES = ["Morning", "Day", "Golden hour", "Evening", "Night"] as const;
export const DETAILS = ["Standard", "High detail"] as const;
export const STRENGTHS = ["Soft", "Balanced", "Strong"] as const;
export const TAGS = ["Luxury", "Residential", "Villa", "Glass", "Biophilic", "Quiet"] as const;

export const LOOKS: Record<VerticalId, { name: string; image: string }[]> = {
  interior: [
    { name: "Modern luxury", image: "/viz/t03-compact-living-room.jpg" },
    { name: "Quiet mineral", image: "/viz/t09-living-room-clay-edit.jpg" },
    { name: "Warm hospitality", image: "/viz/t04-neighborhood-cafe.jpg" },
    { name: "Material study", image: "/viz/t08-material-junction.jpg" },
  ],
  exterior: [
    { name: "Modern", image: "/viz/t05-subtropical-home.jpg" },
    { name: "Dusk villa", image: "/viz/t10-home-dusk-edit.jpg" },
    { name: "Civic", image: "/viz/t07-cultural-campus.jpg" },
    { name: "Massing", image: "/viz/t02-sectional-arts-center.jpg" },
  ],
  amenities: [
    { name: "Clubhouse", image: "/viz/t04-neighborhood-cafe.jpg" },
    { name: "Pool terrace", image: "/viz/t06-urban-courtyard.jpg" },
    { name: "Evening", image: "/viz/t10-home-dusk-edit.jpg" },
    { name: "Resort", image: "/viz/t05-subtropical-home.jpg" },
  ],
  landscape: [
    { name: "Courtyard", image: "/viz/t06-urban-courtyard.jpg" },
    { name: "Tropical", image: "/viz/t05-subtropical-home.jpg" },
    { name: "Campus green", image: "/viz/t07-cultural-campus.jpg" },
    { name: "Dusk garden", image: "/viz/t10-home-dusk-edit.jpg" },
  ],
};

export type Group = { id: string; label: string; options: string[] };

export const GROUPS: Record<VerticalId, Group[]> = {
  interior: [
    { id: "room", label: "Room", options: ["Living room", "Master bedroom", "Guest bedroom", "Children's bedroom", "Kitchen", "Dining room", "Bathroom", "Powder room", "Home office", "Home theatre", "Balcony", "Foyer", "Corridor", "Staircase", "Utility room", "Walk-in wardrobe"] },
    { id: "floor", label: "Flooring", options: ["Italian marble", "Travertine", "Granite", "Porcelain", "Ceramic", "Hardwood", "Engineered wood", "SPC", "Vinyl", "Microcement", "Carpet", "Terrazzo"] },
    { id: "rug", label: "Rug", options: ["None", "Persian", "Modern", "Geometric", "Abstract", "Wool", "Jute", "Silk"] },
    { id: "wall", label: "Walls", options: ["Limewash", "Fluted oak", "Stone", "Matte paint", "Satin paint", "Eggshell paint", "Gloss paint", "Textured paint", "Wallpaper", "Wood cladding", "Microcement", "Fabric panels"] },
    { id: "ceiling", label: "Ceiling", options: ["Cove light", "Coffered", "Gypsum", "Timber", "False ceiling", "Tray ceiling", "Acoustic"] },
    { id: "furniture", label: "Furniture", options: ["Sectional", "Sofa", "Lounge chairs", "Accent chair", "Coffee table", "Dining set", "Desk", "Console", "Minimal"] },
    { id: "fixture", label: "Fixtures", options: ["Chandelier", "Pendants", "Recessed", "Cove", "Track", "Sconces", "Floor lamp", "Table lamp", "LED strip"] },
    { id: "kitchen", label: "Kitchen", options: ["Unchanged", "Stone island", "Timber cabinets", "Minimal", "Stone backsplash", "Integrated appliances"] },
    { id: "bath", label: "Bath", options: ["Unchanged", "Stone", "Warm tile", "Freestanding tub", "Walk-in shower", "Floating vanity"] },
    { id: "openings", label: "Openings", options: ["Keep", "Bronze frames", "Slim black", "Sheer curtains", "Sliding doors", "Pivot door", "Glass door", "Skylight"] },
    { id: "decor", label: "Decor", options: ["Sparse", "Art", "Sculpture", "Mirrors", "Plants", "Vases", "Curtains", "Layered"] },
  ],
  exterior: [
    { id: "facade", label: "Facade", options: ["Stone", "Timber", "Glass", "Metal", "Concrete", "Brick", "ACP", "HPL"] },
    { id: "roof", label: "Roof", options: ["Flat", "Pitched", "Sloped", "Green roof", "Pergola roof"] },
    { id: "windows", label: "Windows", options: ["Floor-to-ceiling", "Bronze frames", "Dark metal"] },
    { id: "entry", label: "Entrance", options: ["Portico", "Pivot door", "Canopy", "Sliding door", "Garage door"] },
    { id: "balcony", label: "Balcony", options: ["Keep", "Glass rail", "Metal rail", "Parapet", "Deck"] },
    { id: "terrace", label: "Terrace", options: ["None", "Pergola", "Planters", "Outdoor seating", "Outdoor flooring"] },
    { id: "drive", label: "Driveway", options: ["Clay pavers", "Stone", "Gravel", "Concrete", "Cobblestone", "Asphalt"] },
    { id: "parking", label: "Parking", options: ["Open", "Carport", "Garage", "Covered"] },
    { id: "water", label: "Water", options: ["None", "Pool", "Fountain", "Reflecting pool", "Cascade"] },
    { id: "columns", label: "Columns", options: ["None", "Concrete", "Stone", "Decorative", "Metal"] },
    { id: "stairs", label: "Staircase", options: ["None", "Floating", "Exterior", "Landscape steps"] },
    { id: "compound", label: "Compound", options: ["Open", "Boundary wall", "Fencing", "Gate"] },
    { id: "extlight", label: "Lighting", options: ["None", "Facade lighting", "Garden lights", "Bollards", "Wall lights"] },
    { id: "style", label: "Style", options: ["Modern", "Contemporary", "Minimalist", "Tropical", "Mediterranean", "Classical", "Neoclassical", "Colonial", "Industrial", "Brutalist", "Scandinavian", "Futuristic", "Sustainable", "Parametric"] },
  ],
  amenities: [
    { id: "water", label: "Water", options: ["Infinity pool", "Swimming pool", "Lap pool", "Jacuzzi", "Splash pool", "Spa", "Fountain"] },
    { id: "wellness", label: "Wellness", options: ["Gym", "Spa", "Yoga deck", "Meditation room"] },
    { id: "social", label: "Social", options: ["Lounge", "Restaurant", "Cafe", "Party hall", "Event lawn", "Clubhouse", "Gaming room", "Library"] },
    { id: "sport", label: "Sport", options: ["None", "Tennis", "Basketball", "Badminton", "Football", "Cricket", "Court"] },
    { id: "outdoor", label: "Outdoor", options: ["BBQ", "Fire pit", "Outdoor kitchen", "Pergola"] },
    { id: "family", label: "Family", options: ["Playground", "Daycare", "Family seating", "Lawn", "None"] },
    { id: "work", label: "Work", options: ["None", "Coworking", "Meeting room", "Business lounge"] },
    { id: "security", label: "Arrival", options: ["Open", "Gate", "Lobby", "CCTV", "Security cabin"] },
    { id: "mobility", label: "Mobility", options: ["None", "Parking", "EV charging", "Bicycle stand"] },
  ],
  landscape: [
    { id: "trees", label: "Trees", options: ["Palms", "Shade trees", "Ornamental", "Few"] },
    { id: "planting", label: "Planting", options: ["Shrubs", "Flowering", "Hedge", "Sparse"] },
    { id: "lawn", label: "Lawn", options: ["Meadow", "Clipped lawn", "Gravel garden"] },
    { id: "garden", label: "Garden", options: ["Tropical", "Formal", "Courtyard"] },
    { id: "path", label: "Paths", options: ["Stone", "Clay pavers", "Timber"] },
    { id: "water", label: "Water", options: ["Pool edge", "Fountain", "None"] },
    { id: "structure", label: "Structure", options: ["None", "Pergola", "Pavilion"] },
    { id: "edge", label: "Boundary", options: ["Hedge", "Low wall", "Open"] },
    { id: "light", label: "Garden light", options: ["Path lights", "Uplights", "None"] },
  ],
};

export type DesignState = {
  vertical: VerticalId;
  range: (typeof RANGES)[number];
  look: string;
  camera: (typeof CAMERAS)[number];
  light: (typeof LIGHTS)[number];
  mood: (typeof MOODS)[number];
  people: (typeof PEOPLE)[number];
  activity: (typeof ACTIVITIES)[number];
  color: (typeof COLORS)[number];
  weather: (typeof WEATHER)[number];
  time: (typeof TIMES)[number];
  detail: (typeof DETAILS)[number];
  strength: (typeof STRENGTHS)[number];
  tags: string[];
  target: string;
  panel: PanelTab;
  picks: Record<string, string>;
  rooms: Record<string, Record<string, string>>;
  advanced: Advanced;
};

export const DEFAULT_DESIGN: DesignState = {
  vertical: "interior",
  range: "Ultra Luxury",
  look: "Modern luxury",
  camera: "Eye level",
  light: "Golden hour",
  mood: "Warm",
  people: "Few",
  activity: "Sitting",
  color: "Warm white",
  weather: "Clear",
  time: "Golden hour",
  detail: "High detail",
  strength: "Balanced",
  tags: ["Luxury"],
  target: "whole",
  panel: "design",
  picks: Object.fromEntries(GROUPS.interior.map((group) => [group.id, group.options[0]])),
  rooms: {},
  advanced: DEFAULT_ADVANCED,
};

function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return typeof value === "string" && (options as readonly string[]).includes(value) ? (value as T) : fallback;
}

function cleanRooms(input: unknown): Record<string, Record<string, string>> {
  if (!input || typeof input !== "object") return {};
  const rooms: Record<string, Record<string, string>> = {};
  for (const [room, picks] of Object.entries(input as Record<string, unknown>).slice(0, 12)) {
    if (!picks || typeof picks !== "object") continue;
    const row: Record<string, string> = {};
    for (const group of GROUPS.interior) {
      const value = (picks as Record<string, unknown>)[group.id];
      if (typeof value === "string" && (group.options as string[]).includes(value)) row[group.id] = value;
    }
    if (Object.keys(row).length) rooms[room.slice(0, 40)] = row;
  }
  return rooms;
}

export function sanitizeDesign(input: Partial<DesignState> | undefined): DesignState {
  const vertical = oneOf(input?.vertical, VERTICALS.map((item) => item.id), DEFAULT_DESIGN.vertical);
  const looks = LOOKS[vertical].map((item) => item.name);
  const picks: Record<string, string> = {};
  for (const group of GROUPS[vertical]) {
    picks[group.id] = oneOf(input?.picks?.[group.id], group.options, group.options[0]);
  }
  const rawTarget = input?.target;
  const target =
    typeof rawTarget === "string" && (rawTarget === "whole" || GROUPS[vertical].some((group) => group.id === rawTarget))
      ? rawTarget
      : "whole";
  const tags = Array.isArray(input?.tags)
    ? input.tags.filter((tag): tag is string => typeof tag === "string" && (TAGS as readonly string[]).includes(tag)).slice(0, 6)
    : DEFAULT_DESIGN.tags;
  return {
    vertical,
    range: oneOf(input?.range, RANGES, DEFAULT_DESIGN.range),
    look: oneOf(input?.look, looks, looks[0]),
    camera: oneOf(input?.camera, CAMERAS, DEFAULT_DESIGN.camera),
    light: oneOf(input?.light, LIGHTS, DEFAULT_DESIGN.light),
    mood: oneOf(input?.mood, MOODS, DEFAULT_DESIGN.mood),
    people: oneOf(input?.people, PEOPLE, DEFAULT_DESIGN.people),
    activity: oneOf(input?.activity, ACTIVITIES, DEFAULT_DESIGN.activity),
    color: oneOf(input?.color, COLORS, DEFAULT_DESIGN.color),
    weather: oneOf(input?.weather, WEATHER, DEFAULT_DESIGN.weather),
    time: oneOf(input?.time, TIMES, DEFAULT_DESIGN.time),
    detail: oneOf(input?.detail, DETAILS, DEFAULT_DESIGN.detail),
    strength: oneOf(input?.strength, STRENGTHS, DEFAULT_DESIGN.strength),
    tags,
    target,
    panel: oneOf(input?.panel, ["design", "camera", "light", "human", "mood", "engine", "advanced"] as const, "design"),
    picks,
    rooms: cleanRooms(input?.rooms),
    advanced: sanitizeAdvanced(input?.advanced),
  };
}

export function assembleBrief(
  design: DesignState,
  idea: string,
  library?: string,
  options?: { hasUploadedImage?: boolean },
): string {
  const clean = sanitizeDesign(design);
  const hasUpload = Boolean(options?.hasUploadedImage);
  const trimmedIdea = idea.trim();

  if (hasUpload) {
    const lines = [
      "GOAL",
      `In-place photorealistic edit on the attached uploaded source photograph. Finish quality: ${clean.range}. Refinement strength: ${clean.strength}. ${clean.detail}.`,
      "",
      "MUST PRESERVE (PIXEL-LOCKED)",
      "Preserve the EXACT camera position, camera elevation/altitude, lens focal length, field of view, vanishing points, horizon line, crop boundaries, building silhouette, roof parapet, walls, openings, and site terrain pixel-for-pixel from the attached uploaded source image.",
      "",
      "CAMERA",
      "LOCKED 1:1 TO ATTACHED UPLOADED IMAGE — do NOT change to eye-level, do NOT zoom, pan, tilt, rotate, crop, or straighten verticals.",
      "",
      "LIGHT / ATMOSPHERE",
      `${clean.light} light. Mood: ${clean.mood}. Natural shadows consistent with the existing geometry.`,
      "",
      "RESTRICTIONS",
      "Do NOT create a new building, room, or camera angle. Do NOT letterbox or change aspect ratio. Modify ONLY the surface materials, lighting, atmosphere, or local details explicitly named below.",
    ];
    if (trimmedIdea) {
      lines.push("", "EDIT DIRECTIVE ON UPLOADED IMAGE", `${trimmedIdea} Apply ONLY these changes onto the attached uploaded image while keeping every pixel of camera perspective and unmentioned structure identical.`);
    }
    return lines.join("\n").slice(0, 4000);
  }

  const groups = GROUPS[clean.vertical];
  const scoped = clean.target === "whole" ? groups : groups.filter((group) => group.id === clean.target);
  const changes = scoped.map((group) => `${group.label}: ${clean.picks[group.id]}`).join(". ");
  const held = clean.target === "whole" ? "every surface this brief does not name" : `every element except ${clean.target}`;
  const lines = [
    "GOAL",
    `Photorealistic ${clean.vertical} visualization. Quality: ${clean.range}. Look: ${clean.look}. Finish strength: ${clean.strength}. ${clean.detail}.`,
    "",
    "MUST PRESERVE",
    `Keep the supplied camera, structure, openings, and ${held}.`,
    "",
    "ALLOWED CHANGES",
    changes || "No material change.",
    "",
    "MATERIAL / SUBJECT",
    `${clean.look} ${clean.vertical}. Accent color: ${clean.color}. ${changes}`,
    "",
    "LIGHT / ATMOSPHERE",
    `${clean.light} light. Time: ${clean.time}. Weather: ${clean.weather}. Mood: ${clean.mood}. One light direction and believable contact shadows.`,
    "",
    "CAMERA",
    `${clean.camera}. Natural perspective. No dramatic wide-angle distortion.`,
    "",
    "HUMAN",
    clean.people === "None"
      ? "No people."
      : `${clean.people} people, ${clean.activity.toLowerCase()}, correctly scaled, with shadows on the ground.`,
    "",
    "TAGS",
    clean.tags.length ? clean.tags.join(", ") : "None",
    "",
    "RESTRICTIONS",
    "Do not invent dimensions, brands, code compliance, or structural moves. Do not relocate unnamed openings. This is not a measured drawing.",
  ];
  if (trimmedIdea) lines.push("", "IDEA", `${trimmedIdea} Change only what this idea names.`);
  if (library) lines.push("", "LIBRARY BRIEF", library);
  return lines.join("\n").slice(0, 4000);
}
