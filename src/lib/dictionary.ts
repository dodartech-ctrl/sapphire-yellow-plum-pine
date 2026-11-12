export type Advanced = {
  light: string;
  air: string;
  season: string;
  change: string;
  grade: string;
  extras: string[];
};

export const ADVANCED_GROUPS: { key: keyof Omit<Advanced, "extras">; label: string; options: { id: string; label: string }[] }[] = [
  {
    key: "light",
    label: "Light",
    options: [
      { id: "overcast", label: "Overcast" },
      { id: "golden-hour", label: "Golden hour" },
      { id: "blue-hour", label: "Blue hour" },
      { id: "early-morning", label: "Early morning" },
      { id: "bright-midday", label: "Midday" },
      { id: "late-afternoon", label: "Late afternoon" },
      { id: "twilight", label: "Twilight" },
      { id: "night", label: "Night" },
    ],
  },
  {
    key: "air",
    label: "Air",
    options: [
      { id: "clear-air", label: "Clear" },
      { id: "light-haze", label: "Haze" },
      { id: "light-mist", label: "Mist" },
      { id: "after-rain", label: "After rain" },
      { id: "wet", label: "Wet ground" },
      { id: "dramatic-clouds", label: "Clouds" },
    ],
  },
  {
    key: "season",
    label: "Season",
    options: [
      { id: "none", label: "Unspecified" },
      { id: "spring", label: "Spring" },
      { id: "summer", label: "Summer" },
      { id: "autumn", label: "Autumn" },
      { id: "winter", label: "Winter" },
    ],
  },
  {
    key: "change",
    label: "Allowed change",
    options: [
      { id: "none", label: "Finish only" },
      { id: "facade", label: "Facade" },
      { id: "brick", label: "Brick" },
      { id: "limestone", label: "Limestone" },
      { id: "road", label: "Approach" },
      { id: "greenery", label: "Greenery" },
      { id: "people", label: "People" },
    ],
  },
  {
    key: "grade",
    label: "Grade",
    options: [
      { id: "photo", label: "Commercial" },
      { id: "premium-real-estate", label: "Real estate" },
      { id: "editorial-architecture", label: "Editorial" },
      { id: "photo-editorial-modernist", label: "Modernist" },
      { id: "photo-sculptural-shadows", label: "Sculptural" },
      { id: "photo-documentary-context", label: "Documentary" },
      { id: "photo-warm-human-scale", label: "Human scale" },
      { id: "hero-photo-clean", label: "Hero clean" },
      { id: "hero-photo-dramatic", label: "Hero dramatic" },
      { id: "hero-sunset-gold", label: "Sunset gold" },
      { id: "hdri-realism", label: "HDRI" },
      { id: "cinema-malick", label: "Natural epic" },
      { id: "cinema-villeneuve", label: "Monumental" },
    ],
  },
];

export const EXTRA_PILLS = [
  { id: "microdetail", label: "Microdetail" },
  { id: "glass-realism", label: "Glass" },
  { id: "stone-detail", label: "Stone" },
  { id: "concrete-detail", label: "Concrete" },
  { id: "subtle-weathering", label: "Weathering" },
  { id: "final-cleanup", label: "Cleanup" },
  { id: "natural-greenery-detail", label: "Planting" },
  { id: "match-source-lighting", label: "Match source" },
] as const;

export const DEFAULT_ADVANCED: Advanced = {
  light: "golden-hour",
  air: "clear-air",
  season: "none",
  change: "none",
  grade: "premium-real-estate",
  extras: ["final-cleanup"],
};

export function sanitizeAdvanced(input: Partial<Advanced> | undefined): Advanced {
  const next: Advanced = { ...DEFAULT_ADVANCED, extras: [] };
  for (const group of ADVANCED_GROUPS) {
    const value = input?.[group.key];
    next[group.key] = group.options.some((option) => option.id === value) ? (value as string) : DEFAULT_ADVANCED[group.key];
  }
  const allowed = new Set(EXTRA_PILLS.map((item) => item.id));
  next.extras = Array.isArray(input?.extras)
    ? input.extras.filter((id): id is string => typeof id === "string" && allowed.has(id as (typeof EXTRA_PILLS)[number]["id"])).slice(0, 8)
    : [...DEFAULT_ADVANCED.extras];
  if (next.light === "night") next.extras = next.extras.filter((id) => id !== "match-source-lighting");
  return next;
}
