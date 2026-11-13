import type { Advanced } from "@/lib/dictionary";
import { composeDictionarySelection, getDictionaryBlock } from "@/lib/archviz-dictionary";

const EXPAND: Record<string, string[]> = {
  "hero-photo-clean": ["hero-photo-clean-positive", "hero-photo-clean-negative"],
  "hero-photo-dramatic": ["hero-photo-dramatic-positive", "hero-photo-dramatic-negative"],
  "hero-sunset-gold": ["hero-sunset-gold-positive", "hero-sunset-gold-negative"],
  "hdri-realism": ["hdri-realism-positive", "hdri-realism-negative"],
};

export function dictionaryBrief(
  vertical: string,
  advanced: Advanced,
  extraBlocks: string[] = [],
  paramOverrides: Record<string, Record<string, string>> = {},
): string {
  const rawIds = [
    vertical === "interior" ? "interior" : "goal",
    "source",
    "geometry",
    "windows",
    ...extraBlocks,
    advanced.change,
    advanced.light,
    ...(advanced.light === "night" ? ["night-windows", "night-street-sources", "night-headlights"] : []),
    advanced.air,
    advanced.season,
    ...(EXPAND[advanced.grade] ?? [advanced.grade]),
    ...advanced.extras,
    "exclude",
    "qc",
  ];

  // Filter conflicting picks deterministically on the server before rendering
  const kept: string[] = [];
  const blocked = new Set<string>();
  for (const id of rawIds) {
    const block = getDictionaryBlock(id);
    if (!block || id === "none" || blocked.has(id) || kept.includes(id)) continue;
    kept.push(id);
    for (const other of block.conflicts) blocked.add(other);
  }

  return composeDictionarySelection(kept, paramOverrides).text.slice(0, 6000);
}
