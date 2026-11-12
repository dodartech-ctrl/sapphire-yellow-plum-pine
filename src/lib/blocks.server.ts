import type { Advanced } from "@/lib/dictionary";
import blocks from "@/lib/prompt-blocks.json";

type Block = { id: string; section: string; text: string; conflicts: string[] };

const ORDER = [
  "GOAL",
  "SOURCE / INPUT",
  "MUST PRESERVE",
  "ALLOWED CHANGES",
  "MATERIAL / SUBJECT",
  "LIGHT / ATMOSPHERE",
  "CAMERA / PHOTOGRAPHY",
  "RESTRICTIONS",
  "QC",
];

const BY_ID = new Map((blocks as Block[]).map((block) => [block.id, block]));

const EXPAND: Record<string, string[]> = {
  "hero-photo-clean": ["hero-photo-clean-positive", "hero-photo-clean-negative"],
  "hero-photo-dramatic": ["hero-photo-dramatic-positive", "hero-photo-dramatic-negative"],
  "hero-sunset-gold": ["hero-sunset-gold-positive", "hero-sunset-gold-negative"],
  "hdri-realism": ["hdri-realism-positive", "hdri-realism-negative"],
};

export function dictionaryBrief(vertical: string, advanced: Advanced): string {
  const chosen = [
    vertical === "interior" ? "interior" : "goal",
    "source",
    "geometry",
    "windows",
    advanced.change,
    advanced.light,
    ...(advanced.light === "night" ? ["night-windows", "night-street-sources"] : []),
    advanced.air,
    advanced.season,
    ...(EXPAND[advanced.grade] ?? [advanced.grade]),
    ...advanced.extras,
    "exclude",
    "qc",
  ];
  const kept: string[] = [];
  const blocked = new Set<string>();
  for (const id of chosen) {
    const block = BY_ID.get(id);
    if (!block || id === "none" || blocked.has(id) || kept.includes(id)) continue;
    kept.push(id);
    for (const other of block.conflicts) blocked.add(other);
  }
  const groups = new Map<string, string[]>();
  for (const id of kept) {
    const block = BY_ID.get(id);
    if (!block) continue;
    const lines = groups.get(block.section) ?? [];
    lines.push(block.text);
    groups.set(block.section, lines);
  }
  const parts: string[] = [];
  for (const section of ORDER) {
    const lines = groups.get(section);
    if (!lines?.length) continue;
    parts.push(section, ...lines, "");
  }
  return parts.join("\n").trim().slice(0, 6000);
}
