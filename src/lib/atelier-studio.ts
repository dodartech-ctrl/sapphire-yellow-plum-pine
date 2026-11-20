import type { D5LightPreset } from "@/lib/engines";
import type { LIGHTS, VerticalId } from "@/lib/properties";

export type AtelierPlateCard = {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  url: string;
  isGenerated: boolean;
  lightPreset: (typeof LIGHTS)[number];
};

export const ATELIER_DEFAULT_STUDIES: readonly AtelierPlateCard[] = [
  {
    id: "dusk-solstice",
    tag: "v4 · Dusk",
    title: "Dusk Solstice",
    subtitle: "3200K Twilight",
    url: "/viz/p01-pavilion-dusk.jpg",
    isGenerated: false,
    lightPreset: "Evening",
  },
  {
    id: "diffuse-sky",
    tag: "v3 · Overcast",
    title: "Diffuse Sky",
    subtitle: "Soft Daylight",
    url: "/viz/p01-pavilion-day.jpg",
    isGenerated: false,
    lightPreset: "Soft overcast",
  },
  {
    id: "golden-horizon",
    tag: "v2 · Low Angle",
    title: "Golden Horizon",
    subtitle: "2800K Sunset",
    url: "/viz/t05-subtropical-home.jpg",
    isGenerated: false,
    lightPreset: "Golden hour",
  },
  {
    id: "nocturne-mist",
    tag: "v1 · Blue Hour",
    title: "Nocturne Mist",
    subtitle: "Interior Glow",
    url: "/viz/t10-home-dusk-edit.jpg",
    isGenerated: false,
    lightPreset: "Night",
  },
];

export const ATMOSPHERIC_REGIMES: ReadonlyArray<{
  id: string;
  label: string;
  kelvin: string;
  light: (typeof LIGHTS)[number];
  d5Preset: D5LightPreset;
  sunElevation: number;
  icon: "sun" | "twilight" | "noon";
}> = [
  {
    id: "golden",
    label: "Golden Hour",
    kelvin: "2800K",
    light: "Golden hour",
    d5Preset: "golden",
    sunElevation: 16,
    icon: "sun",
  },
  {
    id: "twilight",
    label: "Twilight Dusk",
    kelvin: "3200K",
    light: "Evening",
    d5Preset: "blue-hour",
    sunElevation: 8,
    icon: "twilight",
  },
  {
    id: "noon",
    label: "Solar Noon",
    kelvin: "5500K",
    light: "Daylight",
    d5Preset: "noon",
    sunElevation: 54,
    icon: "noon",
  },
];

export const ATELIER_REFINEMENT_CHIPS: readonly string[] = [
  "Warm dusk atmosphere",
  "Honed travertine paving",
  "Specimen date palms",
  "Water mirror caustics",
];

export const ATELIER_VERTICAL_HERO: Record<VerticalId, { src: string; caption: string }> = {
  interior: {
    src: "/viz/t03-compact-living-room.jpg",
    caption: "Warm mineral interior study",
  },
  exterior: {
    src: "/viz/t05-subtropical-home.jpg",
    caption: "Subtropical pavilion residence",
  },
  amenities: {
    src: "/viz/t06-urban-courtyard.jpg",
    caption: "Monolithic courtyard pool & terrace",
  },
  landscape: {
    src: "/viz/p01-pavilion-dusk.jpg",
    caption: "Villa dusk garden courtyard",
  },
};

export type AtelierPlateMeta = {
  idea?: string;
  seed?: number;
  look?: string;
  light?: string;
  ratio?: string;
  gateScore?: number;
  gateStatus?: "verified" | "review" | "flagged";
  fallback?: boolean;
};

export function buildAtelierIterationCards(
  history: readonly string[],
  activeUrl: string | null | undefined,
  metaByUrl?: Record<string, AtelierPlateMeta>,
): AtelierPlateCard[] {
  const defaultStaticUrls = new Set(ATELIER_DEFAULT_STUDIES.map((d) => d.url));
  const mergedUrls: string[] = [];
  if (activeUrl && (!defaultStaticUrls.has(activeUrl) || history.includes(activeUrl))) {
    mergedUrls.push(activeUrl);
  }
  for (const url of history) {
    if (url && !mergedUrls.includes(url)) {
      mergedUrls.push(url);
    }
  }

  const uniqueHistory = mergedUrls.slice(0, 4);
  const generatedCards: AtelierPlateCard[] = uniqueHistory.map((url, idx) => {
    const versionNum = uniqueHistory.length - idx;
    const isCurrent = Boolean(activeUrl && url === activeUrl);
    const meta = metaByUrl?.[url];
    const scoreTag = typeof meta?.gateScore === "number" ? ` · ${(meta.gateScore * 100).toFixed(0)}%` : "";
    return {
      id: `plate-hist-${idx}-${url.slice(-10).replace(/[^a-zA-Z0-9]/g, "")}`,
      tag: `Plate v${versionNum}${scoreTag}`,
      title: isCurrent ? (meta?.look ? `Active · ${meta.look}` : "Active Plate") : meta?.look ? `${meta.look} v${versionNum}` : `Iteration ${versionNum}`,
      subtitle: isCurrent ? "Selected" : "Click to restore",
      url,
      isGenerated: true,
      lightPreset: (meta?.light as (typeof LIGHTS)[number] | undefined) ?? "Golden hour",
    };
  });

  if (generatedCards.length >= 4) return generatedCards;

  const existingUrls = new Set(generatedCards.map((c) => c.url));
  const padded = [...generatedCards];
  for (const fallback of ATELIER_DEFAULT_STUDIES) {
    if (padded.length >= 4) break;
    if (!existingUrls.has(fallback.url)) {
      padded.push(fallback);
    }
  }
  return padded;
}
