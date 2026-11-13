import type { CameraPreset3D, EngineState, RenderQueueItem, Scene3DState, WorkflowPreset } from "@/lib/engines";
import type { DesignState } from "@/lib/properties";

// #4 Physical Solar Geolocation (Azimuth & Altitude from Latitude, Month 1-12, Solar Hour 5-21)
export function computeSolarPositionFromGeo(
  latitudeDeg: number,
  month: number,
  hourDecimal: number,
): { azimuthDeg: number; elevationDeg: number; phase: string } {
  const lat = Math.max(-65, Math.min(65, latitudeDeg)) * (Math.PI / 180);
  const dayOfYear = Math.max(1, Math.min(365, (Math.max(1, Math.min(12, month)) - 1) * 30.4 + 15));
  const declination = (23.44 * Math.PI) / 180 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const hourAngle = ((hourDecimal - 12) * 15 * Math.PI) / 180;

  const sinEl = Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle);
  const elRad = Math.asin(Math.max(-0.99, Math.min(0.99, sinEl)));
  const elDegRaw = (elRad * 180) / Math.PI;
  const elevationDeg = Math.round(Math.max(4, Math.min(84, elDegRaw)));

  const cosAz =
    (Math.sin(declination) - Math.sin(lat) * Math.sin(elRad)) /
    (Math.cos(lat) * Math.max(0.05, Math.cos(elRad)));
  let azDeg = (Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180) / Math.PI;
  if (hourDecimal > 12) azDeg = 360 - azDeg;
  const azimuthDeg = Math.round(((azDeg % 360) + 360) % 360);

  const phase =
    elDegRaw <= 8
      ? "Twilight / Blue Hour"
      : elDegRaw <= 22
        ? hourDecimal < 12
          ? "Morning Golden"
          : "Evening Golden"
        : "Solar Daylight";

  return { azimuthDeg, elevationDeg, phase };
}

// #7 2D Floor Plan Wall & Opening Detector + Extrusion Blueprint
export type FloorPlanWall = {
  id: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  hasDoorGap?: boolean;
};

export type FloorPlanBlueprint = {
  walls: FloorPlanWall[];
  roomCount: number;
  footprintWidth: number;
  footprintDepth: number;
  summary: string;
};

export function detectFloorPlanWallsFromGrid(
  darkMask: Uint8Array | number[],
  cols: number,
  rows: number,
): FloorPlanBlueprint {
  const walls: FloorPlanWall[] = [];
  const scaleX = 14 / Math.max(1, cols);
  const scaleZ = 11 / Math.max(1, rows);

  // Horizontal structural runs
  for (let r = 0; r < rows; r++) {
    let runStart = -1;
    for (let c = 0; c <= cols; c++) {
      const dark = c < cols ? (darkMask[r * cols + c] ?? 0) > 0 : false;
      if (dark && runStart < 0) {
        runStart = c;
      } else if (!dark && runStart >= 0) {
        const len = c - runStart;
        if (len >= 2) {
          const cx = ((runStart + c) * 0.5 - cols * 0.5) * scaleX;
          const cz = (r - rows * 0.5) * scaleZ;
          walls.push({
            id: `wh-${r}-${runStart}`,
            x: Number(cx.toFixed(2)),
            z: Number(cz.toFixed(2)),
            width: Number(Math.max(0.35, len * scaleX).toFixed(2)),
            depth: 0.28,
            height: 3.1,
            hasDoorGap: len >= 5 && r > 1 && r < rows - 2,
          });
        }
        runStart = -1;
      }
    }
  }

  // Vertical structural runs
  for (let c = 0; c < cols; c++) {
    let runStart = -1;
    for (let r = 0; r <= rows; r++) {
      const dark = r < rows ? (darkMask[r * cols + c] ?? 0) > 0 : false;
      if (dark && runStart < 0) {
        runStart = r;
      } else if (!dark && runStart >= 0) {
        const len = r - runStart;
        if (len >= 2) {
          const cx = (c - cols * 0.5) * scaleX;
          const cz = ((runStart + r) * 0.5 - rows * 0.5) * scaleZ;
          walls.push({
            id: `wv-${c}-${runStart}`,
            x: Number(cx.toFixed(2)),
            z: Number(cz.toFixed(2)),
            width: 0.28,
            depth: Number(Math.max(0.35, len * scaleZ).toFixed(2)),
            height: 3.1,
          });
        }
        runStart = -1;
      }
    }
  }

  // Fallback architectural apartment shell if sparse input
  if (walls.length < 3) {
    walls.push(
      { id: "p-north", x: 0, z: -4.2, width: 12, depth: 0.3, height: 3.1 },
      { id: "p-west", x: -5.85, z: 0, width: 0.3, depth: 8.6, height: 3.1 },
      { id: "p-east", x: 5.85, z: 0, width: 0.3, depth: 8.6, height: 3.1 },
      { id: "p-partition", x: -1.4, z: -0.6, width: 0.24, depth: 6.4, height: 3.1, hasDoorGap: true },
      { id: "p-corridor", x: 2.2, z: -1.1, width: 6.2, depth: 0.24, height: 3.1, hasDoorGap: true },
    );
  }

  const trimmed = walls.slice(0, 48);
  return {
    walls: trimmed,
    roomCount: Math.max(2, Math.min(8, Math.round(trimmed.length / 2.5))),
    footprintWidth: 14,
    footprintDepth: 11,
    summary: `Detected ${trimmed.length} extruded wall segments across ${Math.max(2, Math.round(trimmed.length / 2.5))} bounded rooms.`,
  };
}

// #8 Firm Signature Style Vault ("House Style" Trainer)
export type HouseStyleProfile = {
  id: string;
  name: string;
  sampleCount: number;
  palette: string[];
  contrastBias: "Editorial High" | "Soft Atmospheric" | "Monograph Neutral";
  entourageStyle: string;
  lensGrain: string;
  promptDirective: string;
  previewImage: string;
  createdAt: number;
};

export const DEFAULT_HOUSE_STYLES: HouseStyleProfile[] = [
  {
    id: "hs-nordic-monograph",
    name: "Nordic Monograph",
    sampleCount: 10,
    palette: ["#dcd7cf", "#9b8e7b", "#3d3933", "#b8955c"],
    contrastBias: "Monograph Neutral",
    entourageStyle: "Sparse soft-motion Nordic figures & silver birch trees",
    lensGrain: "35mm medium format subtle silver grain, zero oversharpening",
    promptDirective:
      "HOUSE STYLE (Nordic Monograph): desaturated stone-beige neutrals, matte limestone and pale rift oak, diffused overcast-sky shadow falloff, calm human scale.",
    previewImage: "/viz/t01-public-library.jpg",
    createdAt: 1730000000000,
  },
  {
    id: "hs-tropical-modern",
    name: "Subtropical Brass",
    sampleCount: 12,
    palette: ["#c8b393", "#4c5c43", "#2b231b", "#d9a95c"],
    contrastBias: "Editorial High",
    entourageStyle: "Lush courtyard palms, warm limestone terrace reflections",
    lensGrain: "Crisp architectural 24mm shift lens, warm 2900K interior bounce",
    promptDirective:
      "HOUSE STYLE (Subtropical Brass): deep timber eaves, dappled tropical foliage shadows, travertine plinths, warm dusk-gold interior hearth contrast.",
    previewImage: "/viz/t05-subtropical-home.jpg",
    createdAt: 1730000001000,
  },
];

export function buildHouseStyleProfile(params: {
  name: string;
  sampleImages: string[];
  palette?: string[];
  contrastBias?: HouseStyleProfile["contrastBias"];
  entourageStyle?: string;
}): HouseStyleProfile {
  const palette = params.palette?.length ? params.palette.slice(0, 4) : ["#d6cfc2", "#8e7b63", "#2b2621", "#c5a059"];
  const contrastBias = params.contrastBias ?? "Editorial High";
  const entourageStyle = params.entourageStyle?.trim() || "Motion-blurred gallery visitors & native architectural planting";
  return {
    id: `hs-${Date.now()}`,
    name: params.name.trim() || "Firm Signature Style",
    sampleCount: Math.max(1, params.sampleImages.length),
    palette,
    contrastBias,
    entourageStyle,
    lensGrain: "Calibrated 35mm architectural shift lens, natural micro-grain",
    promptDirective: `HOUSE STYLE (${params.name.trim() || "Firm Signature"} · ${params.sampleImages.length} refs): Palette ${palette.join("/")}, ${contrastBias} tonal curve, ${entourageStyle}.`,
    previewImage: params.sampleImages[0] || "/viz/p01-pavilion-dusk.jpg",
    createdAt: Date.now(),
  };
}

// #12 Outpaint Canvas Geometry Helper
export function computeOutpaintGeometry(
  srcW: number,
  srcH: number,
  targetRatio: "21:9" | "9:16" | "16:9",
): { targetW: number; targetH: number; drawX: number; drawY: number; drawW: number; drawH: number } {
  const [rw, rh] = targetRatio.split(":").map(Number);
  const ratio = rw / rh;
  const srcRatio = srcW / Math.max(1, srcH);

  let targetW = srcW;
  let targetH = srcH;
  if (ratio > srcRatio) {
    targetW = Math.round(srcH * ratio);
  } else {
    targetH = Math.round(srcW / ratio);
  }
  targetW = Math.max(640, Math.min(2048, targetW));
  targetH = Math.max(640, Math.min(2048, targetH));

  const scale = Math.min(targetW / srcW, targetH / srcH) * 0.86;
  const drawW = Math.round(srcW * scale);
  const drawH = Math.round(srcH * scale);
  const drawX = Math.round((targetW - drawW) * 0.5);
  const drawY = Math.round((targetH - drawH) * 0.5);

  return { targetW, targetH, drawX, drawY, drawW, drawH };
}

// #15 Archviz Entourage Stamp Library
export type EntourageCatalogItem = {
  id: string;
  label: string;
  category: "Figure" | "Foliage" | "Mobility" | "Furniture";
  glyph: string;
  widthNorm: number;
  heightNorm: number;
  promptHint: string;
};

export type PlacedEntourageItem = {
  id: string;
  catalogId: string;
  label: string;
  xNorm: number;
  yNorm: number;
  scale: number;
};

export const ENTOURAGE_CATALOG: EntourageCatalogItem[] = [
  { id: "fig-walk", label: "Walking Figure", category: "Figure", glyph: "🚶", widthNorm: 0.06, heightNorm: 0.16, promptHint: "architectural scale figure walking with subtle motion blur" },
  { id: "fig-duo", label: "Gallery Pair", category: "Figure", glyph: "🧍", widthNorm: 0.09, heightNorm: 0.16, promptHint: "two architectural scale visitors conversing near facade" },
  { id: "tree-olive", label: "Olive Tree", category: "Foliage", glyph: "🌳", widthNorm: 0.16, heightNorm: 0.24, promptHint: "sculptural specimen olive tree casting dappled ground shadow" },
  { id: "tree-pine", label: "Scots Pine", category: "Foliage", glyph: "🌲", widthNorm: 0.14, heightNorm: 0.28, promptHint: "tall Nordic pine framing perimeter horizon" },
  { id: "ev-sedan", label: "Parked EV", category: "Mobility", glyph: "🚙", widthNorm: 0.18, heightNorm: 0.11, promptHint: "matte dark electric grand tourer parked cleanly on forecourt" },
  { id: "patio-chair", label: "Lounge Set", category: "Furniture", glyph: "🪑", widthNorm: 0.12, heightNorm: 0.1, promptHint: "low-profile teak and linen terrace lounge chairs" },
];

// #16 Batch Matrix Job Builder (Cameras × Sun Hours)
export function buildBatchMatrixSpecs(params: {
  mode: "sun-study" | "camera-matrix";
  preset: WorkflowPreset;
  look: string;
}): Array<{ label: string; preset: WorkflowPreset; light: string; cameraPreset: CameraPreset3D; sunHour?: number; promptNote: string }> {
  if (params.mode === "sun-study") {
    return [
      { label: `${params.look} · 08:00 Morning`, preset: params.preset, light: "Daylight", cameraPreset: "oblique", sunHour: 8, promptNote: "crisp 8am easterly solar angle with dewy reflections" },
      { label: `${params.look} · 12:30 Zenith`, preset: params.preset, light: "Daylight", cameraPreset: "oblique", sunHour: 12.5, promptNote: "high overhead midday sunlight, clean overhang shadows" },
      { label: `${params.look} · 17:30 Golden`, preset: params.preset, light: "Golden hour", cameraPreset: "oblique", sunHour: 17.5, promptNote: "warm 17:30 golden hour grazing light across facade" },
      { label: `${params.look} · 20:15 Blue Hour`, preset: params.preset, light: "Evening", cameraPreset: "oblique", sunHour: 20.25, promptNote: "deep twilight blue sky with glowing 2700K interior rooms" },
    ];
  }
  return [
    { label: `${params.look} · Eye 1.6m Hero`, preset: params.preset, light: "Golden hour", cameraPreset: "eye", promptNote: "pedestrian eye-level 1.6m architectural approach" },
    { label: `${params.look} · 3/4 Oblique`, preset: params.preset, light: "Daylight", cameraPreset: "oblique", promptNote: "classic 3/4 oblique architectural composition" },
    { label: `${params.look} · Aerial Context`, preset: params.preset, light: "Daylight", cameraPreset: "aerial", promptNote: "elevated drone perspective showing roof massing and site context" },
  ];
}

// #18 Camera-Path Keyframe Interpolator
export type CameraKeyframe = {
  id: string;
  label: string;
  pos: [number, number, number];
  target: [number, number, number];
  focalLength: number;
};

export function interpolateCameraKeyframes(
  keyframes: CameraKeyframe[],
  tNorm: number,
): { pos: [number, number, number]; target: [number, number, number]; focalLength: number } | null {
  if (keyframes.length === 0) return null;
  if (keyframes.length === 1) return keyframes[0];

  const t = Math.max(0, Math.min(1, tNorm));
  const segments = keyframes.length - 1;
  const scaled = t * segments;
  const idx = Math.min(segments - 1, Math.floor(scaled));
  const localT = scaled - idx;
  // Smoothstep cubic easing for architectural camera motion
  const ease = localT * localT * (3 - 2 * localT);

  const a = keyframes[idx];
  const b = keyframes[idx + 1];
  const lerp = (v0: number, v1: number) => Number((v0 + (v1 - v0) * ease).toFixed(3));

  return {
    pos: [lerp(a.pos[0], b.pos[0]), lerp(a.pos[1], b.pos[1]), lerp(a.pos[2], b.pos[2])],
    target: [lerp(a.target[0], b.target[0]), lerp(a.target[1], b.target[1]), lerp(a.target[2], b.target[2])],
    focalLength: lerp(a.focalLength, b.focalLength),
  };
}

// #19 Interactive Client Review Pins & Shareable Payload Codec
export type ReviewPin = {
  id: string;
  projectId: string;
  number: number;
  xNorm: number;
  yNorm: number;
  author: string;
  note: string;
  status: "open" | "resolved";
  createdAt: number;
};

export function encodeReviewPinsParam(pins: ReviewPin[]): string {
  try {
    const json = JSON.stringify(
      pins.slice(0, 20).map((p) => ({
        i: p.id,
        p: p.projectId,
        n: p.number,
        x: Number(p.xNorm.toFixed(3)),
        y: Number(p.yNorm.toFixed(3)),
        a: p.author,
        m: p.note,
        s: p.status,
      })),
    );
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return "";
  }
}

export function decodeReviewPinsParam(encoded: string): ReviewPin[] {
  try {
    if (!encoded) return [];
    const json = decodeURIComponent(escape(atob(encoded)));
    const arr = JSON.parse(json) as Array<{ i?: string; p?: string; n?: number; x?: number; y?: number; a?: string; m?: string; s?: "open" | "resolved" }>;
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((r) => typeof r.m === "string" && typeof r.x === "number" && typeof r.y === "number")
      .map((r, idx) => ({
        id: r.i || `pin-shared-${idx}`,
        projectId: r.p || "shared",
        number: r.n ?? idx + 1,
        xNorm: Math.max(0.02, Math.min(0.98, r.x!)),
        yNorm: Math.max(0.02, Math.min(0.98, r.y!)),
        author: r.a || "Client Reviewer",
        note: r.m!,
        status: r.s === "resolved" ? "resolved" : "open",
        createdAt: Date.now(),
      }));
  } catch {
    return [];
  }
}

// #20 Prompt-to-BIM Material Schedule & Client Design Pack
export type BimScheduleRow = {
  code: string;
  element: string;
  specification: string;
  finishHex: string;
  areaSharePct: number;
  sourceModule: string;
};

export function buildMaterialScheduleRows(
  design: DesignState,
  engine: EngineState,
  scene3d: Scene3DState,
): BimScheduleRow[] {
  const rows: BimScheduleRow[] = [
    {
      code: "MAT-01",
      element: "Primary Envelope / Structural Wall",
      specification: `${engine.facadeTypology} · ${scene3d.primaryMaterial} finish (${engine.climateRegion})`,
      finishHex: scene3d.primaryMaterial === "timber" ? "#b68557" : scene3d.primaryMaterial === "travertine" ? "#ded2bd" : scene3d.primaryMaterial === "brick" ? "#9f5b47" : "#b6b4ae",
      areaSharePct: 44,
      sourceModule: "LookX + 3D Rig",
    },
    {
      code: "MAT-02",
      element: "Glazing & Fenestration System",
      specification: `Low-iron double glazing · ${design.picks.windows || design.picks.openings || "Slim anodized frames"}`,
      finishHex: "#7db9b6",
      areaSharePct: 28,
      sourceModule: "Veras Geometry Lock",
    },
    {
      code: "MAT-03",
      element: "Ground Plane & Hardscape Plinth",
      specification: design.picks.floor || design.picks.terrace || design.picks.path || "Honed limestone slabs",
      finishHex: "#c9c1b2",
      areaSharePct: 18,
      sourceModule: "Design Properties",
    },
    {
      code: "MAT-04",
      element: "Solar & Interior Practical Luminaires",
      specification: `${design.light} (${scene3d.sunAzimuth}° az / ${scene3d.sunElevation}° el) · 2700K interior wash`,
      finishHex: "#e7c27a",
      areaSharePct: 10,
      sourceModule: "D5 Lighting Rig",
    },
  ];
  return rows;
}

export function buildDesignPackDocumentHtml(params: {
  title: string;
  prompt: string;
  schedule: BimScheduleRow[];
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
}): string {
  const rowsHtml = params.schedule
    .map(
      (r) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;font-family:monospace;">${r.code}</td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;"><strong>${r.element}</strong></td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;">${r.specification}</td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${r.finishHex};vertical-align:middle;margin-right:6px;"></span>${r.finishHex}</td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;text-align:right;font-family:monospace;">${r.areaSharePct}%</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${params.title} — Oriel Design Pack</title>
  <style>
    body { font-family: Georgia, serif; color: #1c1915; max-width: 860px; margin: 40px auto; padding: 0 24px; line-height: 1.5; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    .meta { font-family: system-ui, sans-serif; font-size: 12px; color: #6e6456; margin-bottom: 24px; }
    .box { background: #f8f5ef; border: 1px solid #e5ded2; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-family: system-ui, sans-serif; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-family: system-ui, sans-serif; font-size: 12px; }
    th { text-align: left; border-bottom: 2px solid #c9b99c; padding: 8px; text-transform: uppercase; font-size: 11px; color: #5b5245; }
  </style>
</head>
<body>
  <h1>${params.title}</h1>
  <div class="meta">Oriel Archviz Specification · ${params.design.vertical} · ${params.design.look} · Lens ${params.scene3d.focalLength}mm · Seed #${params.engine.seed}</div>
  <div class="box">
    <strong>Compiled Brief &amp; Directives</strong><br/>
    <p style="margin-top:6px;white-space:pre-wrap;">${params.prompt}</p>
  </div>
  <h3>BIM Material &amp; Lighting Schedule</h3>
  <table>
    <thead>
      <tr><th>Code</th><th>Element</th><th>Specification</th><th>Swatch</th><th style="text-align:right;">Coverage</th></tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`;
}

export function getQueueStats(queue: RenderQueueItem[]): {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
} {
  let pending = 0;
  let processing = 0;
  let completed = 0;
  let failed = 0;
  for (const item of queue) {
    if (item.status === "pending" || item.status === "queued") pending++;
    else if (item.status === "processing" || item.status === "running") processing++;
    else if (item.status === "completed" || item.status === "done") completed++;
    else failed++;
  }
  return { total: queue.length, pending, processing, completed, failed };
}
