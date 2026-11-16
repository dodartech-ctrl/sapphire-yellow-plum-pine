import type { ExtendedPbrPresetId } from "@/lib/engines";

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type SolarRigState = {
  timeOfDay: number;
  month: number;
  latitude: number;
  azimuthDeg: number;
  elevationDeg: number;
  rawElevationDeg: number;
  sunPosition: { x: number; y: number; z: number };
  phase:
    | "Midnight / Night"
    | "Dawn Twilight"
    | "Morning Golden"
    | "Solar Daylight"
    | "Evening Golden"
    | "Dusk Twilight";
  isDaylight: boolean;
  formattedTime: string;
  monthLabel: string;
  sunHex: string;
  skyHex: string;
  zenithHex: string;
  horizonHex: string;
  groundBounceHex: string;
  sunIntensity: number;
  ambientIntensity: number;
  rimIntensity: number;
  envIntensity: number;
  interiorGlowIntensity: number;
};

export function formatSolarTime(timeOfDay: number): string {
  const clamped = ((timeOfDay % 24) + 24) % 24;
  const totalMinutes = Math.round(clamped * 60) % (24 * 60);
  const hh = Math.floor(totalMinutes / 60);
  const mm = totalMinutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Computes physical solar azimuth, altitude, Three.js directional `sunPosition` vector,
 * atmospheric sky colors, shadow rig intensities, and reflection dome parameters from
 * Time of Day (0-24h) and Month (1-12).
 */
export function computeSolarRigState(params: {
  timeOfDay: number;
  month: number;
  latitude?: number;
  radius?: number;
}): SolarRigState {
  const timeOfDay = Math.max(0, Math.min(24, Number.isFinite(params.timeOfDay) ? params.timeOfDay : 14.5));
  const month = Math.max(1, Math.min(12, Math.round(Number.isFinite(params.month) ? params.month : 6)));
  const latitudeDeg = Math.max(-65, Math.min(65, Number.isFinite(params.latitude) ? params.latitude! : 37.8));
  const radius = Math.max(8, params.radius ?? 26);

  const lat = (latitudeDeg * Math.PI) / 180;
  const dayOfYear = Math.max(1, Math.min(365, (month - 1) * 30.4 + 15));
  const declination = ((23.44 * Math.PI) / 180) * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const hourAngle = (((timeOfDay - 12) * 15) * Math.PI) / 180;

  const sinEl = Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle);
  const elRad = Math.asin(Math.max(-0.99, Math.min(0.99, sinEl)));
  const rawElevationDeg = Number(((elRad * 180) / Math.PI).toFixed(2));

  const cosAz =
    (Math.sin(declination) - Math.sin(lat) * Math.sin(elRad)) /
    (Math.cos(lat) * Math.max(0.05, Math.cos(elRad)));
  let azDeg = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
  if (timeOfDay > 12) azDeg = 360 - azDeg;
  const azimuthDeg = Math.round(((azDeg % 360) + 360) % 360);

  // Keep directional light above ground plane so cast shadows remain coherent,
  // while rawElevationDeg drives intensity/moonlight transition cleanly through 0-24h.
  const effectiveElDeg = Math.max(4, Math.min(84, rawElevationDeg));
  const azRad = (azimuthDeg * Math.PI) / 180;
  const effElRad = (effectiveElDeg * Math.PI) / 180;
  const cosEffEl = Math.cos(effElRad);

  const x = Number((Math.sin(azRad) * cosEffEl * radius).toFixed(3));
  const y = Number((Math.sin(effElRad) * radius).toFixed(3));
  const z = Number((Math.cos(azRad) * cosEffEl * radius).toFixed(3));

  const isDaylight = rawElevationDeg > 0;
  const phase: SolarRigState["phase"] =
    rawElevationDeg <= -4
      ? "Midnight / Night"
      : rawElevationDeg <= 4
        ? timeOfDay < 12
          ? "Dawn Twilight"
          : "Dusk Twilight"
        : rawElevationDeg <= 22
          ? timeOfDay < 12
            ? "Morning Golden"
            : "Evening Golden"
          : "Solar Daylight";

  let sunHex = "#fff7e8";
  let skyHex = "#dde6ef";
  let zenithHex = "#3b6fa8";
  let horizonHex = "#f4eee2";
  let groundBounceHex = "#6c6252";
  let sunIntensity = 2.4;
  let ambientIntensity = 0.86;
  let rimIntensity = 0.42;
  let envIntensity = 1.0;
  let interiorGlowIntensity = 0.42;

  if (phase === "Midnight / Night") {
    sunHex = "#8bb4ff";
    skyHex = "#0f1726";
    zenithHex = "#070c17";
    horizonHex = "#1e2e49";
    groundBounceHex = "#141821";
    sunIntensity = 0.45;
    ambientIntensity = 0.28;
    rimIntensity = 0.34;
    envIntensity = 0.55;
    interiorGlowIntensity = 2.1;
  } else if (phase === "Dawn Twilight" || phase === "Dusk Twilight") {
    sunHex = phase === "Dawn Twilight" ? "#ffad7a" : "#ff8f52";
    skyHex = "#243652";
    zenithHex = "#17253d";
    horizonHex = phase === "Dawn Twilight" ? "#e89c78" : "#df7e52";
    groundBounceHex = "#342d26";
    sunIntensity = 1.05;
    ambientIntensity = 0.52;
    rimIntensity = 0.58;
    envIntensity = 0.85;
    interiorGlowIntensity = 1.55;
  } else if (phase === "Morning Golden" || phase === "Evening Golden") {
    sunHex = "#ffd196";
    skyHex = "#cad5e3";
    zenithHex = "#35588a";
    horizonHex = "#f2ba82";
    groundBounceHex = "#5e5042";
    sunIntensity = 1.9;
    ambientIntensity = 0.72;
    rimIntensity = 0.48;
    envIntensity = 1.05;
    interiorGlowIntensity = 0.92;
  } else {
    const zenithFactor = Math.min(1, Math.max(0, (rawElevationDeg - 22) / 50));
    sunHex = zenithFactor > 0.55 ? "#fffaf0" : "#ffefd6";
    skyHex = zenithFactor > 0.55 ? "#e1eaf3" : "#d8e3ee";
    zenithHex = zenithFactor > 0.55 ? "#2e65a3" : "#4476ab";
    horizonHex = "#f4efe4";
    groundBounceHex = "#6c6252";
    sunIntensity = Number((2.1 + zenithFactor * 0.55).toFixed(2));
    ambientIntensity = Number((0.78 + zenithFactor * 0.14).toFixed(2));
    rimIntensity = 0.42;
    envIntensity = Number((1.0 + zenithFactor * 0.15).toFixed(2));
    interiorGlowIntensity = 0.4;
  }

  return {
    timeOfDay: Number(timeOfDay.toFixed(2)),
    month,
    latitude: Number(latitudeDeg.toFixed(1)),
    azimuthDeg,
    elevationDeg: Math.round(effectiveElDeg),
    rawElevationDeg,
    sunPosition: { x, y, z },
    phase,
    isDaylight,
    formattedTime: formatSolarTime(timeOfDay),
    monthLabel: MONTH_NAMES[month - 1] ?? "Jun",
    sunHex,
    skyHex,
    zenithHex,
    horizonHex,
    groundBounceHex,
    sunIntensity,
    ambientIntensity,
    rimIntensity,
    envIntensity,
    interiorGlowIntensity,
  };
}

export type PbrSwatchSpec = {
  id: ExtendedPbrPresetId;
  shortKey: "concrete" | "oak" | "glass" | "aluminum" | "travertine" | "brick" | "bronze" | "zinc";
  label: string;
  category: "Canonical" | "Architectural";
  color: number;
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  opacity: number;
  transparent: boolean;
};

export const INSPECTOR_PBR_SWATCHES: readonly PbrSwatchSpec[] = [
  {
    id: "board-formed-concrete",
    shortKey: "concrete",
    label: "Concrete",
    category: "Canonical",
    color: 0xb4b0a8,
    hex: "#b4b0a8",
    roughness: 0.82,
    metalness: 0.04,
    clearcoat: 0,
    opacity: 1,
    transparent: false,
  },
  {
    id: "fluted-oak",
    shortKey: "oak",
    label: "Oak",
    category: "Canonical",
    color: 0xb88656,
    hex: "#b88656",
    roughness: 0.62,
    metalness: 0.03,
    clearcoat: 0.08,
    opacity: 1,
    transparent: false,
  },
  {
    id: "low-e-glass",
    shortKey: "glass",
    label: "Glass",
    category: "Canonical",
    color: 0xcbe2e3,
    hex: "#cbe2e3",
    roughness: 0.06,
    metalness: 0.14,
    clearcoat: 1,
    opacity: 0.44,
    transparent: true,
  },
  {
    id: "anodized-aluminum",
    shortKey: "aluminum",
    label: "Anodized Alum",
    category: "Architectural",
    color: 0x3b3e42,
    hex: "#3b3e42",
    roughness: 0.26,
    metalness: 0.88,
    clearcoat: 0.15,
    opacity: 1,
    transparent: false,
  },
  {
    id: "honed-travertine",
    shortKey: "travertine",
    label: "Honed Travertine",
    category: "Architectural",
    color: 0xe2d5be,
    hex: "#e2d5be",
    roughness: 0.6,
    metalness: 0.02,
    clearcoat: 0,
    opacity: 1,
    transparent: false,
  },
  {
    id: "nordic-brick",
    shortKey: "brick",
    label: "Nordic Brick",
    category: "Architectural",
    color: 0x995946,
    hex: "#995946",
    roughness: 0.86,
    metalness: 0.02,
    clearcoat: 0,
    opacity: 1,
    transparent: false,
  },
  {
    id: "brushed-bronze",
    shortKey: "bronze",
    label: "Brushed Bronze",
    category: "Architectural",
    color: 0x8f6f47,
    hex: "#8f6f47",
    roughness: 0.28,
    metalness: 0.84,
    clearcoat: 0.12,
    opacity: 1,
    transparent: false,
  },
  {
    id: "standing-seam-zinc",
    shortKey: "zinc",
    label: "Patina Zinc",
    category: "Architectural",
    color: 0x62676b,
    hex: "#62676b",
    roughness: 0.42,
    metalness: 0.72,
    clearcoat: 0,
    opacity: 1,
    transparent: false,
  },
];

export type MeshMaterialAssignment = {
  objectId: string;
  objectLabel: string;
  materialId: ExtendedPbrPresetId;
  materialLabel: string;
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  opacity: number;
  transparent: boolean;
  updatedAt: number;
};

export function createAssignmentFromSwatch(
  objectId: string,
  objectLabel: string,
  materialId: ExtendedPbrPresetId,
  now = Date.now(),
): MeshMaterialAssignment | null {
  const cleanId = objectId.trim();
  if (!cleanId) return null;
  const spec = INSPECTOR_PBR_SWATCHES.find((s) => s.id === materialId);
  if (!spec) return null;
  return {
    objectId: cleanId,
    objectLabel: objectLabel.trim() || cleanId,
    materialId: spec.id,
    materialLabel: spec.label,
    hex: spec.hex,
    roughness: spec.roughness,
    metalness: spec.metalness,
    clearcoat: spec.clearcoat,
    opacity: spec.opacity,
    transparent: spec.transparent,
    updatedAt: now,
  };
}

/**
 * CRUD Create / Replace assignment keyed by semantic objectId.
 */
export function upsertMaterialAssignment(
  list: MeshMaterialAssignment[],
  entry: MeshMaterialAssignment,
): MeshMaterialAssignment[] {
  const idx = list.findIndex((item) => item.objectId === entry.objectId);
  if (idx === -1) {
    return [entry, ...list].slice(0, 64);
  }
  return list.map((item) => (item.objectId === entry.objectId ? { ...entry } : item));
}

/**
 * CRUD Read assignment for a specific objectId.
 */
export function getMaterialAssignment(
  list: MeshMaterialAssignment[],
  objectId: string | null | undefined,
): MeshMaterialAssignment | null {
  if (!objectId) return null;
  return list.find((item) => item.objectId === objectId) ?? null;
}

/**
 * CRUD Update roughness, metalness, hex color, opacity, or preset on an existing assignment.
 */
export function updateMaterialAssignmentProps(
  list: MeshMaterialAssignment[],
  objectId: string,
  patch: Partial<Pick<MeshMaterialAssignment, "roughness" | "metalness" | "clearcoat" | "opacity" | "hex" | "materialId" | "materialLabel" | "transparent">>,
  now = Date.now(),
): MeshMaterialAssignment[] {
  return list.map((item) => {
    if (item.objectId !== objectId) return item;
    return {
      ...item,
      ...patch,
      roughness:
        typeof patch.roughness === "number" && Number.isFinite(patch.roughness)
          ? Math.max(0.02, Math.min(1, Number(patch.roughness.toFixed(2))))
          : item.roughness,
      metalness:
        typeof patch.metalness === "number" && Number.isFinite(patch.metalness)
          ? Math.max(0, Math.min(1, Number(patch.metalness.toFixed(2))))
          : item.metalness,
      clearcoat:
        typeof patch.clearcoat === "number" && Number.isFinite(patch.clearcoat)
          ? Math.max(0, Math.min(1, Number(patch.clearcoat.toFixed(2))))
          : item.clearcoat,
      opacity:
        typeof patch.opacity === "number" && Number.isFinite(patch.opacity)
          ? Math.max(0.1, Math.min(1, Number(patch.opacity.toFixed(2))))
          : item.opacity,
      updatedAt: now,
    };
  });
}

/**
 * CRUD Delete assignment for an objectId.
 */
export function removeMaterialAssignment(
  list: MeshMaterialAssignment[],
  objectId: string,
): MeshMaterialAssignment[] {
  return list.filter((item) => item.objectId !== objectId);
}
