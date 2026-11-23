/**
 * parse_revision: turn pasted client feedback into a checklist the designer
 * confirms. Deterministic keyword extraction. Anything not stated stays blank
 * and is listed under `unknown`; nothing is invented.
 */

export type ChecklistItem = {
  id: "target" | "finish" | "protected" | "views";
  label: string;
  /** null = not stated in the feedback. The designer fills it in. */
  value: string | null;
  status: "found" | "missing";
};

export type ParsedBrief = {
  targets: string[];
  finish: string | null;
  protectedElements: string[];
  /** Named views the feedback mentions; empty means "not stated". */
  mentionedViews: string[];
  unknown: string[];
  checklist: ChecklistItem[];
};

const SURFACES = [
  "upper cabinets",
  "base cabinets",
  "lower cabinets",
  "kitchen cabinets",
  "cabinet fronts",
  "cabinet doors",
  "cabinets",
  "countertop",
  "countertops",
  "backsplash",
  "island",
  "wardrobe",
  "headboard",
  "sofa",
  "curtains",
  "flooring",
  "floor",
  "ceiling",
  "walls",
  "wall",
  "door",
  "doors",
  "window frames",
  "facade",
  "roof",
  "paving",
  "fence",
];

const FINISH_WORDS = [
  "walnut",
  "oak",
  "teak",
  "ash",
  "maple",
  "birch",
  "marble",
  "granite",
  "travertine",
  "terrazzo",
  "concrete",
  "brick",
  "matte",
  "glossy",
  "gloss",
  "satin",
  "white",
  "off-white",
  "cream",
  "beige",
  "grey",
  "gray",
  "charcoal",
  "black",
  "navy",
  "green",
  "sage",
  "blue",
  "brown",
  "gold",
  "brass",
  "copper",
];

/** "keep X, Y and Z": the whole list up to the end of the clause is protected, not just the first item. */
const KEEP_PHRASES = /\b(?:keep|leave|don'?t (?:change|touch)|do not (?:change|touch)|without (?:changing|touching)|except|preserve|retain)\s+(.+?)(?=[.;!?]|\bbut\b|\bthen\b|$)/gi;

function splitList(clause: string): string[] {
  return clause
    .split(/,|\band\b|&/i)
    .map((part) => part.replace(/^\s*(?:the|all|any|existing|its|their)\s+/i, "").trim())
    .filter((part) => part.length > 1);
}

function unique(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim().toLowerCase()).filter(Boolean))];
}

export function parseRevision(feedback: string, knownViewNames: readonly string[] = []): ParsedBrief {
  const text = feedback.replace(/\s+/g, " ").trim();
  const lower = text.toLowerCase();

  // Protected elements first, then remove those phrases so they are not read as targets.
  const protectedElements: string[] = [];
  let withoutKeep = lower;
  for (const match of lower.matchAll(KEEP_PHRASES)) {
    protectedElements.push(...splitList(match[1]));
    withoutKeep = withoutKeep.replace(match[0], " ");
  }

  const targets: string[] = [];
  let remaining = withoutKeep;
  for (const surface of SURFACES) {
    if (remaining.includes(surface)) {
      targets.push(surface);
      remaining = remaining.split(surface).join(" "); // "upper cabinets" must not also yield "cabinets"
    }
  }

  const finishMatches = FINISH_WORDS.filter((word) => new RegExp(`\\b${word}\\b`).test(withoutKeep));
  const finish = finishMatches.length ? finishMatches.slice(0, 3).join(" ") : null;

  const mentionedViews = knownViewNames.filter((name) => name.trim() && lower.includes(name.trim().toLowerCase()));

  const cleanTargets = unique(targets);
  const cleanProtected = unique(protectedElements);
  const unknown: string[] = [];
  if (!cleanTargets.length) unknown.push("Which surface should change?");
  if (!finish) unknown.push("Which finish or colour?");
  if (!mentionedViews.length && knownViewNames.length > 1) unknown.push("Does the change apply to every view?");

  return {
    targets: cleanTargets,
    finish,
    protectedElements: cleanProtected,
    mentionedViews,
    unknown,
    checklist: [
      { id: "target", label: "Surface to change", value: cleanTargets.length ? cleanTargets.join(", ") : null, status: cleanTargets.length ? "found" : "missing" },
      { id: "finish", label: "Requested finish", value: finish, status: finish ? "found" : "missing" },
      {
        id: "protected",
        label: "Keep unchanged",
        value: cleanProtected.length ? cleanProtected.join(", ") : null,
        status: cleanProtected.length ? "found" : "missing",
      },
      {
        id: "views",
        label: "Views affected",
        value: mentionedViews.length ? mentionedViews.join(", ") : null,
        status: mentionedViews.length ? "found" : "missing",
      },
    ],
  };
}
