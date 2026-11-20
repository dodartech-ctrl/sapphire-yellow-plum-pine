export type NamedStudioId = "mas-2d" | "sam-3d" | "king-360" | "kum-video" | "node-studio";

export type StudioInfo = {
  id: NamedStudioId;
  shortLabel: string;
  label: string;
  subtitle: string;
};

export const NAMED_STUDIOS: readonly StudioInfo[] = [
  { id: "mas-2d", shortLabel: "MAS 2D", label: "MAS 2D Studio", subtitle: "Photoshop & Compose canvas + Material/Light palettes" },
  { id: "sam-3d", shortLabel: "SAM 3D", label: "SAM 3D Studio", subtitle: "Live 3D Split Canvas, CAD Extrusion & Camera Board" },
  { id: "king-360", shortLabel: "KING 360", label: "KING 360 Studio", subtitle: "Panorama Grade, Seams & Virtual Tour Builder" },
  { id: "kum-video", shortLabel: "KUM Video", label: "KUM Video Studio", subtitle: "Storyboard Director, Multi-track Timeline & MP4" },
  { id: "node-studio", shortLabel: "Node", label: "Node Studio", subtitle: "Infinite DAG Pipeline Graph & Cached Caching" },
];

export type LookAnchorSnapshot = {
  version: number;
  label: string;
  thumbnailUrl: string;
  paletteHexes: string[];
  lightDirection: string;
  colorTempK: number;
  timeOfDay: string;
  contrastLevel: "Soft" | "Balanced" | "Crisp";
  lockStrength: "strict" | "soft";
  locked: boolean;
  createdAt: number;
};

export const DEFAULT_LOOK_ANCHOR: LookAnchorSnapshot = {
  version: 1,
  label: "Misty Harbor Golden Hour",
  thumbnailUrl: "/viz/p01-pavilion-dusk.jpg",
  paletteHexes: ["#08131F", "#16314A", "#CFE3F0", "#E8C98A", "#5C4332"],
  lightDirection: "Low 24° West Sun",
  colorTempK: 3200,
  timeOfDay: "Golden Hour",
  contrastLevel: "Balanced",
  lockStrength: "strict",
  locked: true,
  createdAt: Date.now(),
};

export type ReviewStatus = "open" | "in_progress" | "needs_check" | "resolved" | "closed" | "reopened";

export type ReviewAuditEntry = {
  id: string;
  actor: string;
  action: string;
  fromStatus?: ReviewStatus;
  toStatus?: ReviewStatus;
  note?: string;
  at: number;
};

export type TrackedReviewItem = {
  id: string;
  number: number;
  title: string;
  comment: string;
  status: ReviewStatus;
  priority: "high" | "normal" | "low";
  assignee: string;
  author: string;
  pinX: number;
  pinY: number;
  studio: NamedStudioId;
  linkedVersionUrl?: string;
  updatedAt: number;
  history: ReviewAuditEntry[];
};

export const DEFAULT_TRACKED_REVIEWS: TrackedReviewItem[] = [
  {
    id: "rev-1",
    number: 1,
    title: "Warm timber soffit reflections",
    comment: "Keep smoked Nordic cedar soffits slightly warmer against fjord water bounce.",
    status: "open",
    priority: "high",
    assignee: "Astrid Lindholm",
    author: "Erik K.",
    pinX: 42,
    pinY: 36,
    studio: "sam-3d",
    updatedAt: Date.now() - 1000 * 60 * 35,
    history: [
      { id: "h-1", actor: "Erik K.", action: "Created pin #1", toStatus: "open", at: Date.now() - 1000 * 60 * 35 },
    ],
  },
  {
    id: "rev-2",
    number: 2,
    title: "Basalt plinth edge alignment",
    comment: "Verify cantilevered slab edge thickness stays 320mm in close-up camera.",
    status: "in_progress",
    priority: "normal",
    assignee: "Marcus V.",
    author: "Client Reviewer",
    pinX: 66,
    pinY: 64,
    studio: "mas-2d",
    updatedAt: Date.now() - 1000 * 60 * 14,
    history: [
      { id: "h-2a", actor: "Client Reviewer", action: "Pinned slab joint", toStatus: "open", at: Date.now() - 1000 * 60 * 50 },
      { id: "h-2b", actor: "Marcus V.", action: "Moved to In progress", fromStatus: "open", toStatus: "in_progress", at: Date.now() - 1000 * 60 * 14 },
    ],
  },
];

export type TourHotspotType =
  | "navigation"
  | "info"
  | "media"
  | "3d-object"
  | "plan-jump"
  | "unit"
  | "map"
  | "document"
  | "product"
  | "audio"
  | "lead";

export type TourHotspot = {
  id: string;
  sceneId: string;
  type: TourHotspotType;
  label: string;
  yaw: number;
  pitch: number;
  targetSceneId?: string;
  detail: string;
  mediaUrl?: string;
  unitCode?: string;
};

export type TourSceneNode = {
  id: string;
  label: string;
  level: string;
  imageUrl: string;
  yaw: number;
  pitch: number;
  mapX: number;
  mapY: number;
};

export type TourUnitRecord = {
  id: string;
  unitCode: string;
  floor: string;
  type: string;
  areaSqm: number;
  priceLabel: string;
  orientation: string;
  status: "available" | "reserved" | "sold";
  sceneId: string;
};

export type VirtualTourState = {
  title: string;
  slug: string;
  theme: "ultra-luxury" | "minimal" | "developer-sales" | "hospitality";
  activeSceneId: string;
  exposure: number;
  whiteBalance: number;
  contrast: number;
  saturation: number;
  lutPreset: "Arctic Glass" | "Neutral" | "Nordic Warm" | "Editorial Film";
  dayNightMode: "day" | "dusk";
  nadirLogoPatch: boolean;
  publishedVersion: number;
  accessMode: "public" | "password" | "expiring" | "invited";
  scenes: TourSceneNode[];
  hotspots: TourHotspot[];
  units: TourUnitRecord[];
};

export const DEFAULT_TOUR_STATE: VirtualTourState = {
  title: "Nordic Fjords Pavilion Tour",
  slug: "nordic-fjords-pavilion",
  theme: "ultra-luxury",
  activeSceneId: "sc-arrival",
  exposure: 0,
  whiteBalance: 0,
  contrast: 4,
  saturation: 2,
  lutPreset: "Arctic Glass",
  dayNightMode: "dusk",
  nadirLogoPatch: true,
  publishedVersion: 2,
  accessMode: "public",
  scenes: [
    { id: "sc-arrival", label: "Harbor Arrival Deck", level: "Level 1", imageUrl: "/viz/p01-pavilion-dusk.jpg", yaw: 12, pitch: 0, mapX: 28, mapY: 62 },
    { id: "sc-living", label: "Fjord Living Pavilion", level: "Level 1", imageUrl: "/viz/t03-compact-living-room.jpg", yaw: 84, pitch: -4, mapX: 52, mapY: 46 },
    { id: "sc-courtyard", label: "Pool & Basalt Plinth", level: "Level 1", imageUrl: "/viz/t06-urban-courtyard.jpg", yaw: 165, pitch: 2, mapX: 74, mapY: 58 },
    { id: "sc-terrace", label: "Upper Timber Terrace", level: "Level 2", imageUrl: "/viz/t05-subtropical-home.jpg", yaw: 240, pitch: -2, mapX: 58, mapY: 26 },
  ],
  hotspots: [
    { id: "hs-1", sceneId: "sc-arrival", type: "navigation", label: "Enter Living Pavilion", yaw: 32, pitch: -4, targetSceneId: "sc-living", detail: "Smooth fly-through transition" },
    { id: "hs-2", sceneId: "sc-arrival", type: "info", label: "Blackened Basalt Plinth", yaw: -22, pitch: -12, detail: "Cantilevered volcanic stone plinth · 320mm honed slab" },
    { id: "hs-3", sceneId: "sc-living", type: "unit", label: "Residence Unit 3B", yaw: 48, pitch: 4, unitCode: "3B", detail: "168 m² · 3 Bed Panoramic Fjord Aspect · $2.45M" },
    { id: "hs-4", sceneId: "sc-living", type: "map", label: "Harbor Ferry & School Route", yaw: -54, pitch: -6, detail: "4 min walk to Harbor Ferry · 9 min to Nordic Academy" },
  ],
  units: [
    { id: "u-1a", unitCode: "1A", floor: "01", type: "Garden Suite", areaSqm: 124, priceLabel: "$1,680,000", orientation: "South-West", status: "sold", sceneId: "sc-arrival" },
    { id: "u-2b", unitCode: "2B", floor: "02", type: "Corner Residence", areaSqm: 146, priceLabel: "$2,040,000", orientation: "West Fjord", status: "reserved", sceneId: "sc-courtyard" },
    { id: "u-3b", unitCode: "3B", floor: "03", type: "Pavilion Living", areaSqm: 168, priceLabel: "$2,450,000", orientation: "Panoramic NW", status: "available", sceneId: "sc-living" },
    { id: "u-4p", unitCode: "PH1", floor: "04", type: "Sky Penthouse", areaSqm: 242, priceLabel: "$3,890,000", orientation: "360° Horizon", status: "available", sceneId: "sc-terrace" },
  ],
};

export type KumTimelineClip = {
  id: string;
  track: "video" | "audio" | "title" | "fx";
  label: string;
  imageUrl?: string;
  startSec: number;
  durationSec: number;
  cameraMove: "dolly-in" | "orbit" | "rise" | "pan" | "push-through" | "hold";
  transition: "cross-dissolve" | "cut" | "dip-black" | "match-cut";
};

export type KumVideoState = {
  aspect: "16:9" | "9:16" | "1:1" | "4:5";
  fps: 24 | 30 | 60;
  resolution: "1080p" | "4K";
  codec: "H.264" | "H.265" | "WebM";
  lut: "Arctic Glass" | "Filmic Warm" | "Neutral" | "Twilight Gold";
  musicTrack: string;
  captionsEnabled: boolean;
  clips: KumTimelineClip[];
};

export const DEFAULT_KUM_VIDEO: KumVideoState = {
  aspect: "16:9",
  fps: 24,
  resolution: "1080p",
  codec: "H.264",
  lut: "Arctic Glass",
  musicTrack: "Nordic Mist — Ambient Piano (CC-BY Licensed)",
  captionsEnabled: true,
  clips: [
    { id: "vc-1", track: "video", label: "Establishing Fjord Dawn", imageUrl: "/viz/p01-pavilion-dusk.jpg", startSec: 0, durationSec: 6, cameraMove: "dolly-in", transition: "cross-dissolve" },
    { id: "vc-2", track: "video", label: "Interior Timber Living", imageUrl: "/viz/t03-compact-living-room.jpg", startSec: 6, durationSec: 7, cameraMove: "pan", transition: "match-cut" },
    { id: "vc-3", track: "video", label: "Waterfront Terrace Orbit", imageUrl: "/viz/t06-urban-courtyard.jpg", startSec: 13, durationSec: 7, cameraMove: "orbit", transition: "cross-dissolve" },
    { id: "vc-4", track: "video", label: "Hero Pavilion Dusk", imageUrl: "/viz/t10-home-dusk-edit.jpg", startSec: 20, durationSec: 8, cameraMove: "rise", transition: "dip-black" },
    { id: "tc-1", track: "title", label: "Nordic Fjords Pavilion · Off-Plan Film", startSec: 0.5, durationSec: 5, cameraMove: "hold", transition: "cut" },
    { id: "ac-1", track: "audio", label: "Nordic Mist Ambient Bed (-14 LUFS)", startSec: 0, durationSec: 28, cameraMove: "hold", transition: "cut" },
    { id: "fx-1", track: "fx", label: "24fps Halation + Mild Film Grain", startSec: 0, durationSec: 28, cameraMove: "hold", transition: "cut" },
  ],
};

export type AgentMissionStepStatus = "pending" | "running" | "waiting_approval" | "done";

export type AgentMissionStep = {
  id: string;
  order: number;
  title: string;
  tool: string;
  costCr: number;
  status: AgentMissionStepStatus;
  outputSummary: string;
};

export type AgentMissionState = {
  active: boolean;
  missionName: string;
  budgetCapCr: number;
  spentCr: number;
  redoRoundsUsed: number;
  maxFreeRedos: number;
  awaitingApproval: boolean;
  steps: AgentMissionStep[];
};

export const DEFAULT_AGENT_MISSION: AgentMissionState = {
  active: false,
  missionName: "Unit 3B Plan-to-Film Launch Pack",
  budgetCapCr: 250,
  spentCr: 0,
  redoRoundsUsed: 0,
  maxFreeRedos: 2,
  awaitingApproval: false,
  steps: [
    { id: "ms-1", order: 1, title: "CAD Intake & Scale Check", tool: "cad_parse", costCr: 0, status: "pending", outputSummary: "Detect rooms, walls, windows & ceiling height (2.9m)" },
    { id: "ms-2", order: 2, title: "Top-Down Styled Plan", tool: "render_plan", costCr: 8, status: "pending", outputSummary: "Furnished Strict plan plate from Design Contract" },
    { id: "ms-3", order: 3, title: "Isometric + Room Views", tool: "camera_plan", costCr: 24, status: "pending", outputSummary: "30° isometric cutaway + 3 room corner sightlines" },
    { id: "ms-4", order: 4, title: "Scale-Checked Entourage", tool: "entourage", costCr: 8, status: "pending", outputSummary: "Non-identifiable figures calibrated to 2.1m door height" },
    { id: "ms-5", order: 5, title: "Fidelity Gate & Approval Pack", tool: "gate_notify", costCr: 0, status: "pending", outputSummary: "C1-C10 Honesty report · stops here for human sign-off" },
    { id: "ms-6", order: 6, title: "8K–15K Tiled Finals", tool: "finals_upscale", costCr: 16, status: "pending", outputSummary: "Seam-blended 8K & 15K print/web deliverables + C2PA" },
    { id: "ms-7", order: 7, title: "KUM Video Director Clips", tool: "video_plan", costCr: 48, status: "pending", outputSummary: "5–8s arch-viz dolly & orbit clips from approved stills" },
    { id: "ms-8", order: 8, title: "Timeline Edit & MP4 Export", tool: "export_mp4", costCr: 10, status: "pending", outputSummary: "H.264 16:9 + 9:16 social cutdowns with disclosure card" },
  ],
};

export type AuditLogEvent = {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: number;
};

export type GovernanceState = {
  brandName: string;
  brandPrimaryHex: string;
  brandAccentHex: string;
  residency: "EU" | "US" | "APAC";
  retentionDays: 30 | 90 | 365;
  noTrainingContract: boolean;
  c2paWatermark: boolean;
  disclosureTemplate: string;
  teamSpendCapCr: number;
  auditEvents: AuditLogEvent[];
};

export const DEFAULT_GOVERNANCE_STATE: GovernanceState = {
  brandName: "Nordic Atelier Architects",
  brandPrimaryHex: "#CFE3F0",
  brandAccentHex: "#E8C98A",
  residency: "EU",
  retentionDays: 90,
  noTrainingContract: true,
  c2paWatermark: true,
  disclosureTemplate: "Artist's Impression / Virtually Staged Visualization — Not a construction document.",
  teamSpendCapCr: 5000,
  auditEvents: [
    { id: "aud-1", actor: "Studio Lead", action: "Configured EU Data Residency + No-Training lock", target: "Workspace Policy", at: Date.now() - 1000 * 60 * 120 },
    { id: "aud-2", actor: "C2PA Gate", action: "Enabled invisible watermark + disclosure footer", target: "Export Pipeline", at: Date.now() - 1000 * 60 * 45 },
  ],
};
