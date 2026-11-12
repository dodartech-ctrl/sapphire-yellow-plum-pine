export const PILL_GROUPS = [
  { key: "camera", label: "Camera", options: ["Eye level", "Elevated", "Close detail", "Isometric"] },
  { key: "light", label: "Light", options: ["Soft overcast", "Daylight", "Golden hour", "Evening"] },
  { key: "material", label: "Material", options: ["Oak and plaster", "Brick and bronze", "Pale mineral", "Clay and brass"] },
  { key: "mood", label: "Mood", options: ["Quiet", "Warm", "Dramatic", "Early concept"] },
] as const;

export type PillKey = (typeof PILL_GROUPS)[number]["key"];
export type Pills = Record<PillKey, string>;

export const DEFAULT_PILLS: Pills = {
  camera: "Eye level",
  light: "Soft overcast",
  material: "Oak and plaster",
  mood: "Quiet",
};

export function allowedPill(key: PillKey, value: unknown): string {
  const group = PILL_GROUPS.find((item) => item.key === key);
  const options: readonly string[] = group?.options ?? [];
  return typeof value === "string" && options.includes(value) ? value : DEFAULT_PILLS[key];
}
