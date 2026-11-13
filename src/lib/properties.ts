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
export const ACTIVITIES = ["Sitting", "Walking", "Dining", "Working", "Swimming"] as const;
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
    { id: "room", label: "Room", options: ["Living room", "Bedroom", "Kitchen", "Bath", "Dining", "Office"] },
    { id: "floor", label: "Flooring", options: ["Italian marble", "Travertine", "Hardwood", "Terrazzo", "Microcement"] },
    { id: "rug", label: "Rug", options: ["None", "Wool", "Jute", "Silk"] },
    { id: "wall", label: "Walls", options: ["Limewash", "Fluted oak", "Stone", "Matte paint"] },
    { id: "ceiling", label: "Ceiling", options: ["Cove light", "Coffered", "Gypsum", "Timber"] },
    { id: "furniture", label: "Furniture", options: ["Sectional", "Lounge chairs", "Dining set", "Minimal"] },
    { id: "fixture", label: "Fixtures", options: ["Chandelier", "Pendants", "Cove", "Sconces"] },
    { id: "kitchen", label: "Kitchen", options: ["Unchanged", "Stone island", "Timber cabinets", "Minimal"] },
    { id: "bath", label: "Bath", options: ["Unchanged", "Stone", "Warm tile", "Freestanding tub"] },
    { id: "openings", label: "Openings", options: ["Keep", "Bronze frames", "Slim black", "Sheer curtains"] },
    { id: "decor", label: "Decor", options: ["Sparse", "Art", "Plants", "Layered"] },
  ],
  exterior: [
    { id: "facade", label: "Facade", options: ["Stone", "Timber", "Glass", "Metal", "Concrete", "Brick"] },
    { id: "roof", label: "Roof", options: ["Flat", "Pitched", "Green roof"] },
    { id: "windows", label: "Windows", options: ["Floor-to-ceiling", "Bronze frames", "Dark metal"] },
    { id: "entry", label: "Entrance", options: ["Portico", "Pivot door", "Canopy"] },
    { id: "balcony", label: "Balcony", options: ["Keep", "Glass rail", "Metal rail"] },
    { id: "terrace", label: "Terrace", options: ["None", "Pergola", "Planters"] },
    { id: "drive", label: "Driveway", options: ["Clay pavers", "Stone", "Gravel"] },
    { id: "parking", label: "Parking", options: ["Open", "Carport", "Garage"] },
    { id: "water", label: "Water", options: ["None", "Pool", "Fountain"] },
  ],
  amenities: [
    { id: "water", label: "Water", options: ["Infinity pool", "Lap pool", "Spa", "Fountain"] },
    { id: "wellness", label: "Wellness", options: ["Gym", "Spa", "Yoga deck"] },
    { id: "social", label: "Social", options: ["Lounge", "Restaurant", "Clubhouse"] },
    { id: "sport", label: "Sport", options: ["None", "Tennis", "Court"] },
    { id: "outdoor", label: "Outdoor", options: ["Fire pit", "Outdoor kitchen", "Pergola"] },
    { id: "family", label: "Family", options: ["Playground", "Lawn", "None"] },
    { id: "work", label: "Work", options: ["None", "Coworking", "Meeting room"] },
    { id: "security", label: "Arrival", options: ["Open", "Gate", "Lobby"] },
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

export function assembleBrief(design: DesignState, idea: string, library?: string): string {
  const clean = sanitizeDesign(design);
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
  if (idea.trim()) lines.push("", "IDEA", `${idea.trim()} Change only what this idea names.`);
  if (library) lines.push("", "LIBRARY BRIEF", library);
  return lines.join("\n").slice(0, 4000);
}
