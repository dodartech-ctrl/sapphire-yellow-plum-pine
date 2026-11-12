import type { ModelId, Part } from "@/lib/types";

export const MODELS: { id: ModelId; name: string; fit: string; pass: string }[] = [
  {
    id: "gpt",
    name: "GPT Image",
    fit: "Labeled edits and multi-turn corrections",
    pass: "Keep the sections. Change one mismatch per turn. On a material-only edit, restate white balance, exposure, and every surface you are not touching.",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    fit: "Mood, material, and composition exploration",
    pass: "One concise phrase. Parameters sit at the end. A long instruction list dilutes the decision.",
  },
  {
    id: "firefly",
    name: "Firefly",
    fit: "Direct prompts beside Adobe controls",
    pass: "Say the subject and the decision. Leave composition, style, color, and camera to the interface controls.",
  },
  {
    id: "flux",
    name: "FLUX",
    fit: "Photoreal detail, subject first",
    pass: "Lead with the spatial subject and the decision. Describe the desired state. Do not rely on a negative prompt.",
  },
  {
    id: "gemini",
    name: "Gemini / Imagen",
    fit: "Conversational generation and reference edits",
    pass: "State purpose, what stays, and what changes. Correct in small turns. Prefer a positive scene to a pile of bans.",
  },
];

export const ASPECTS = [
  { id: "16:9", label: "Wide" },
  { id: "3:2", label: "Plate" },
  { id: "4:5", label: "Portrait" },
  { id: "1:1", label: "Square" },
  { id: "9:16", label: "Tall" },
] as const;

export type AspectId = (typeof ASPECTS)[number]["id"];

const VARIANTS: Record<string, string[]> = {
  "direction a": ["deeper shade and a brick-and-timber entry"],
  "direction b": ["a pale mineral rainscreen with bronze frames"],
  "direction c": ["a quieter flush facade and a planted plinth"],
  "palette a": ["matte light oak, warm-gray plaster, wool, narrow joints"],
  "palette b": ["clay lime plaster, honed limestone, dark bronze"],
  "palette c": ["pale ash, soft white plaster, blackened steel"],
  "material palette a": ["warm brick, lime mortar, dark bronze frames"],
  "material palette b": ["pale mineral render, timber rainscreen, concrete plinth"],
  "material palette c": ["flush fiber-cement, blackened steel, deep recess shade"],
  "option a": ["permeable clay pavers, narrow joints, honed edge"],
  "option b": ["large-format warm-gray limestone, tight joints"],
  "option c": ["washed aggregate concrete with a timber border"],
};

const EXACT: Record<string, string> = {
  "project type": "a two-story neighborhood library",
  "location/context": "a temperate low-rise urban street",
  "primary material and finish": "warm light brick with a realistic module and lime mortar",
  "secondary material": "a timber soffit with fine, restrained grain",
  "glazing character": "clear glass in dark bronze frames",
  "shading strategy": "a deep civic porch and a short horizontal brow",
  "time and weather": "soft overcast afternoon",
  "building type": "a small public library",
  "camera position": "eye-level from the opposite sidewalk",
  "weather/time": "soft overcast afternoon",
  "building/space": "a compact community arts center",
  "program a": "a double-height workshop",
  "program b": "an upper gallery",
  project: "the neighborhood library",
  "one central design idea": "a sheltered civic porch between the hall and a planted forecourt",
  composition: "an eye-level two-point view with the entry on the left third",
  "material hierarchy": "brick body, timber soffit, dark bronze frames",
  light: "soft overcast afternoon light with controlled contrast",
  "relationship to context": "a low street edge and a planted public forecourt",
  "material a": "warm light brick",
  "material b": "a timber soffit",
  "glazing/frame": "a dark bronze window frame",
  "landscape/interior element": "a planted concrete base",
  "color palette": "warm brick, pale stone, and dark bronze",
  "room type": "living room",
  "design direction": "quiet mineral and oak",
  "material palette with finishes": "matte light oak, warm-gray mineral plaster, honed limestone",
  "furniture language": "low, visually light seating with concealed storage",
  "one focal element": "the window wall and a single limestone table",
  "daylight source/direction": "soft daylight from the large window wall",
  "artificial-light character": "subtle warm indirect light, no unexplained glow",
  "internal review/client discussion": "an internal design review",
  room: "compact living room",
  "soft daytime": "soft daytime from the window wall",
  "warm evening": "warm evening with low lamps and cooler glass",
  "dramatic presentation": "a restrained presentation mood with one directional source",
  "room type and users": "a living room for one resident who works from home",
  "seating/work/dining requirements": "a lounge seat, a small desk, and a clear path to the window",
  "furniture character": "light oak, low arms, no visual weight",
  "upholstery/finish palette": "wool in a warm gray and a matte oak frame",
  "storage need": "concealed storage along the quiet wall",
  "approximate dimensions if known": "about 3.2 by 4.2 meters",
  "user needs": "lounge, a desk, and a clear path from the door to the window",
  materials: "matte oak, mineral plaster, and a limestone surface",
  "color strategy": "a light envelope with one darker joinery note",
  "lighting approach": "daylight first, warm indirect fill second",
  "brand and audience": "a neighborhood cafe used by remote workers and evening pairs",
  "material palette": "recycled brick, matte oak, acoustic felt, and durable terrazzo",
  "fixture language": "simple linear pendants and low-glare task light at the counter",
  "desired mood": "calm in the morning, warmer after dusk",
  "workplace type": "a small studio office",
  "material and color direction": "pale plaster, oak, and a muted green acoustic panel",
  "furniture system": "a simple shared table plus a few enclosed focus desks",
  "lighting strategy": "daylight from one side and low-glare task light",
  palette: "clay-toned lime plaster, oak, and unlacquered brass",
  "metal finish": "brushed unlacquered brass",
  joinery: "slim oak vanity with an open shelf",
  "lighting mood": "soft side light and a warm mirror wash",
  "materials and finishes": "matte oak, warm-gray plaster, and dark bronze",
  "primary finish": "pale mineral render",
  "secondary finish": "a dark timber-look rainscreen at the upper floor",
  "frame/trim color": "bronze aluminum",
  accent: "a deep olive front door",
  number: "three",
  "design goal": "a calmer, more legible entry",
  "planting character": "restrained grasses and a few structured shrubs",
  season: "early summer, just after rain",
  "height hierarchy": "low at the path, taller only at the sides",
  "maintenance level": "low to medium",
  "sketch or massing reference": "a simple one-story rear mass aligned with the existing eave",
  massing: "a lower rear volume tucked under the existing eave line",
  "material transition": "the same render, with a timber recess at the joint",
  "roof relationship": "a lower pitch that does not compete with the main roof",
  "opening rhythm": "the same window proportion, fewer of them",
  "climate/context": "a hot-humid subtropical neighborhood",
  "solar shading": "deep eaves and a covered outdoor transition",
  "covered transition": "a porch that is part of the arrival, not a stuck-on canopy",
  "durable finish": "pale mineral render over a concrete plinth",
  "rain/snow exposure response": "protected openings and a rainscreen that can read wet",
  "landscape relationship": "planting close to the plinth, clear of the entry",
  "material/color/facade rhythm": "the rhythm of render, timber, and openings",
  cladding: "pale mineral render",
  "window frame": "bronze aluminum",
  soffit: "a fine-grain timber soffit",
  "base/landscape junction": "a board-formed concrete plinth meeting gravel",
  "users and activities": "four residents who eat outside and need a quiet corner",
  "hardscape palette": "permeable clay pavers and gravel planting margins",
  "activity zones": "one dining terrace and one quieter seat",
  "climate/setting": "a temperate urban lot",
  site: "a compact rear yard",
  arrival: "a short path from the door",
  dining: "a table for four off the main axis",
  "quiet seating": "a single bench in shade",
  "play/work": "a clear patch of ground, not a structure",
  "planting/ecology": "a layered edge and one small multi-stem tree",
  users: "four residents",
  "privacy need": "visual privacy from the neighboring upper windows",
  "sun/shade condition": "mixed sun and shade",
  "street/driveway": "the sidewalk and the existing drive",
  "path material": "clay pavers in a quiet running bond",
  "planting hierarchy": "low at the path, taller only beside the boundary",
  "wayfinding cue": "a change of paving at the turn toward the door",
  "lighting character": "low path lights, no uplight into the trees",
  paving: "large clay pavers with a flush edge",
  "shade structure concept": "a slim timber pergola aligned with the house",
  "seating zones": "a dining terrace and a low lounge away from the water edge",
  "specific decision": "whether the porch reads as the entrance without a sign",
  "project and audience": "a neighborhood library for an early client review",
  "reference input": "the supplied massing view",
  "camera/crop": "the supplied camera and crop",
  geometry: "the massing and floor-to-floor heights",
  openings: "the existing window and door pattern",
  "structural/site elements": "the roof profile and the street edge",
  "important relationships": "the entry aligned with the public forecourt",
  "one decision or clearly defined option set": "how deep the civic porch should be",
  "spatial strategy": "a sheltered porch between the hall and the forecourt",
  "furniture/planting/facade language": "a brick facade with a timber soffit",
  "contextual details": "a low-rise mixed street and a few people for scale",
  "view type and composition": "an eye-level two-point view with the entry on the left third",
  perspective: "parallel verticals, no dramatic wide angle",
  "lighting source/time/quality": "soft overcast afternoon light",
  atmosphere: "calm everyday use, just after light rain",
  "level of occupancy": "a few people for scale, not a crowd",
  "circulation / daylight / public-private gradient / landscape connection / massing logic":
    "how the public porch connects to the quieter reading hall",
  "cafe/restaurant/hotel/lounge": "neighborhood cafe",
  "interior / exterior / architecture / landscape": "architecture",
  "stone/tile/plaster": "warm limestone and quiet mineral plaster",
  "joinery/material junction/furniture grouping/lighting feature": "the junction of joinery, plaster, and the window seat",
  "spring/summer/autumn/winter or wet/dry season": "early summer and midwinter",
  "time of day": "late afternoon with long, soft side light",
  "focus/collaboration/client meetings/flexible use": "focus desks with one shared table",
};

export function parseTemplate(template: string): Part[] {
  const parts: Part[] = [];
  const re = /\[([^\[\]]+)\]/g;
  let last = 0;
  let index = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(template))) {
    if (match.index > last) {
      parts.push({ kind: "text", text: template.slice(last, match.index) });
    }
    parts.push({ kind: "slot", id: `s${index}`, hint: match[1] ?? "" });
    index += 1;
    last = match.index + match[0].length;
  }
  if (last < template.length) parts.push({ kind: "text", text: template.slice(last) });
  return parts;
}

export function suggestSlot(hint: string): string {
  const key = hint.toLowerCase().trim();
  if (VARIANTS[key]?.[0]) return VARIANTS[key][0] ?? "";
  if (EXACT[key]) return EXACT[key];
  if (hint.includes("/")) {
    const first = hint.split("/")[0]?.trim();
    if (first) return first;
  }
  return "";
}

export function initialValues(parts: Part[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.kind === "slot") values[part.id] = suggestSlot(part.hint);
  }
  return values;
}

export function compose(parts: Part[], values: Record<string, string>): string {
  return parts
    .map((part) => {
      if (part.kind === "text") return part.text;
      const value = values[part.id]?.trim();
      return value ? value : `[${part.hint}]`;
    })
    .join("");
}

export function openSlotCount(parts: Part[], values: Record<string, string>): number {
  return parts.filter((part) => part.kind === "slot" && !values[part.id]?.trim()).length;
}

function squash(text: string): string {
  return text
    .replace(/^[A-Z][A-Z /]{1,32}:\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max).replace(/\s+\S*$/, "").trim();
  return `${cut}.`;
}

export function adapt(model: ModelId, canonical: string, aspect: string): string {
  const prose = squash(canonical);
  switch (model) {
    case "gpt":
      return canonical.trim();
    case "midjourney":
      return `${clip(prose, 520)} Professional architectural visualization --ar ${aspect}`;
    case "firefly":
      return `${clip(prose, 380)} Realistic architectural visualization.`;
    case "flux":
      return clip(prose, 720);
    case "gemini": {
      const body = prose.charAt(0).toLowerCase() + prose.slice(1);
      return `Using the supplied reference as the source of truth when one exists, ${body} The image is an early-stage concept visualization, not a technical drawing.`;
    }
    default:
      return canonical.trim();
  }
}

const SPECTACLE = /\b(cinematic|8k|ultra[- ]?realistic|masterpiece|award-winning|hyperreal(?:istic)?|unreal engine)\b/gi;

export function applyNote(brief: string, note: string): { brief: string; reply: string } {
  const trimmed = note.trim();
  const lower = trimmed.toLowerCase();
  if (lower.includes("spectacle") || lower.includes("8k") || lower.includes("cinematic")) {
    const next = brief.replace(SPECTACLE, "").replace(/[ ]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
    return {
      brief: next,
      reply: next === brief.trim() ? "No spectacle words were in the brief." : "Stripped the spectacle words. The decision stays.",
    };
  }
  if (lower.includes("hold") && (lower.includes("camera") || lower.includes("geometry"))) {
    const line = "PRESERVE: Keep the camera, crop, geometry, openings, and every surface this note does not name.";
    if (brief.includes("Keep the camera, crop, geometry")) {
      return { brief, reply: "Camera and geometry were already locked." };
    }
    return { brief: `${brief.trim()}\n\n${line}`, reply: "Locked the camera, crop, and geometry. Name only what may change." };
  }
  if (lower.includes("one variable") || lower.includes("compare fairly") || lower.includes("fair comparison")) {
    const line = "COMPARISON: Change only one variable. Hold camera, light, season, and occupancy so the options compare fairly.";
    if (brief.includes("Change only one variable")) {
      return { brief, reply: "The brief already holds the comparison to one variable." };
    }
    return { brief: `${brief.trim()}\n\n${line}`, reply: "Held the comparison to a single variable." };
  }
  return {
    brief: `${brief.trim()}\n\nREVISION\n${trimmed} Change only what this note names. Keep the camera, crop, and every unnamed surface.`,
    reply: "Added as one revision. Earlier constraints still stand.",
  };
}
