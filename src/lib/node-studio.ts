export type NodeCategoryId =
  | "input"
  | "segmentation"
  | "editing"
  | "conditioning"
  | "architecture"
  | "environment"
  | "generation"
  | "video"
  | "output";

export type PortType =
  | "image"
  | "mask"
  | "prompt"
  | "reference"
  | "conditioning"
  | "environment"
  | "scene3d"
  | "video";

export type ExecutionMode = "local" | "cloud" | "hybrid";

export interface NodePortDef {
  id: string;
  label: string;
  type: PortType;
  required?: boolean;
}

export interface NodeParamField {
  key: string;
  label: string;
  kind: "text" | "textarea" | "number" | "slider" | "select" | "toggle";
  defaultValue: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  placeholder?: string;
}

export interface NodeSpec {
  type: string;
  title: string;
  category: NodeCategoryId;
  summary: string;
  keywords?: string[];
  executionTarget: "local" | "cloud" | "hybrid";
  inputs: NodePortDef[];
  outputs: NodePortDef[];
  params: NodeParamField[];
}

export interface WorkflowNodeInstance {
  id: string;
  type: string;
  position: { x: number; y: number };
  params: Record<string, string | number | boolean>;
  label?: string;
}

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

export interface NodeWorkflow {
  id: string;
  name: string;
  description: string;
  templateId?: string;
  updatedAt: number;
  nodes: WorkflowNodeInstance[];
  edges: WorkflowEdge[];
}

export interface NodeExecutionResult {
  nodeId: string;
  status: "idle" | "pending" | "running" | "completed" | "error";
  durationMs?: number;
  imageUrl?: string;
  maskUrl?: string;
  videoUrl?: string;
  compareBeforeUrl?: string;
  compareAfterUrl?: string;
  diffOutsideMaskPct?: number;
  geometryDriftWarning?: boolean;
  isIllustrativeRelight?: boolean;
  promptOut?: string;
  summary?: string;
  variations?: string[];
  error?: string;
}

export interface WorkflowRevision {
  id: string;
  workflowId: string;
  label: string;
  createdAt: number;
  mode: ExecutionMode;
  nodeCount: number;
  edgeCount: number;
  outputPreviewUrl?: string;
  diffOutsideMaskPct?: number;
  snapshot: NodeWorkflow;
}

export interface ValidationIssue {
  severity: "error" | "warning";
  nodeId?: string;
  edgeId?: string;
  message: string;
}

export interface GraphValidationResult {
  valid: boolean;
  executionOrder: string[];
  issues: ValidationIssue[];
  durationMs: number;
  hasCycles: boolean;
}

export const CATEGORY_META: Record<
  NodeCategoryId,
  { label: string; accent: string; badgeBg: string; order: number }
> = {
  input: { label: "Input", accent: "#e7c27a", badgeBg: "rgba(231, 194, 122, 0.16)", order: 1 },
  segmentation: { label: "Segmentation", accent: "#38bdf8", badgeBg: "rgba(56, 189, 248, 0.15)", order: 2 },
  editing: { label: "Editing", accent: "#fb923c", badgeBg: "rgba(251, 146, 60, 0.15)", order: 3 },
  conditioning: { label: "Conditioning", accent: "#a78bfa", badgeBg: "rgba(167, 139, 250, 0.16)", order: 4 },
  architecture: { label: "Architecture", accent: "#d4b06a", badgeBg: "rgba(212, 176, 106, 0.15)", order: 5 },
  environment: { label: "Environment", accent: "#34d399", badgeBg: "rgba(52, 211, 153, 0.15)", order: 6 },
  generation: { label: "Generation", accent: "#f472b6", badgeBg: "rgba(244, 114, 182, 0.15)", order: 7 },
  video: { label: "Video", accent: "#c084fc", badgeBg: "rgba(192, 132, 252, 0.15)", order: 8 },
  output: { label: "Output", accent: "#4ade80", badgeBg: "rgba(74, 222, 128, 0.16)", order: 9 },
};

export const PORT_COLORS: Record<PortType, string> = {
  image: "#e7c27a",
  mask: "#38bdf8",
  prompt: "#cbd5e1",
  reference: "#f472b6",
  conditioning: "#a78bfa",
  environment: "#34d399",
  scene3d: "#fbbf24",
  video: "#c084fc",
};

export const DEFAULT_REFERENCE_INFLUENCE = {
  geometry: 90,
  material: 70,
  style: 65,
  lighting: 50,
} as const;

/**
 * All 45 Architectural Node Definitions across 9 Categories (PRD §10).
 * Counts: Input (5), Segmentation (5), Editing (6), Conditioning (6),
 * Architecture (6), Environment (5), Generation (5), Video (4), Output (3) = 45.
 */
export const NODE_CATALOG: NodeSpec[] = [
  // ── 1. Input (5) ────────────────────────────────────────────────────────────
  {
    type: "input.load_image",
    title: "Load Image",
    category: "input",
    summary: "Load an architectural photo, elevation, or active Studio frame.",
    keywords: ["Image Load", "Source Image", "Upload Image"],
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "image", label: "Image", type: "image" }],
    params: [
      {
        key: "source",
        label: "Sample / Source",
        kind: "select",
        defaultValue: "/viz/t03-compact-living-room.jpg",
        options: [
          "__studio_active__",
          "/viz/t03-compact-living-room.jpg",
          "/viz/p01-pavilion-day.jpg",
          "/viz/p01-pavilion-dusk.jpg",
          "/viz/t07-cultural-campus.jpg",
          "/viz/p04-courtyard-brick.jpg",
        ],
      },
      { key: "customUrl", label: "Override URL / Data URL", kind: "text", defaultValue: "", placeholder: "Optional image data URL" },
    ],
  },
  {
    type: "input.load_video",
    title: "Load Video",
    category: "input",
    summary: "Ingest an existing architectural clip or keyframe sequence.",
    executionTarget: "local",
    inputs: [],
    outputs: [
      { id: "video", label: "Video", type: "video" },
      { id: "image", label: "First Frame", type: "image" },
    ],
    params: [
      { key: "posterFrame", label: "Base Frame", kind: "select", defaultValue: "/viz/p01-pavilion-dusk.jpg", options: ["/viz/p01-pavilion-dusk.jpg", "/viz/p01-pavilion-day.jpg", "/viz/t07-cultural-campus.jpg"] },
      { key: "fps", label: "Frame Rate", kind: "number", defaultValue: 24, min: 12, max: 60 },
    ],
  },
  {
    type: "input.text_prompt",
    title: "Text Prompt",
    category: "input",
    summary: "Author structured architectural visualization intent.",
    keywords: ["Prompt Modifier", "Architectural Prompt", "Text Directive"],
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "prompt", label: "Prompt", type: "prompt" }],
    params: [
      {
        key: "text",
        label: "Prompt Directive",
        kind: "textarea",
        defaultValue: "Honed travertine stone fireplace wall with warm architectural grazing light, keep room geometry intact.",
      },
      { key: "negative", label: "Negative", kind: "text", defaultValue: "warped walls, broken perspective, cartoon, blurry" },
    ],
  },
  {
    type: "input.reference_image",
    title: "Reference Image",
    category: "input",
    summary: "Attach material, style, or lighting reference with strength sliders.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "reference", label: "Reference", type: "reference" }],
    params: [
      {
        key: "swatch",
        label: "Reference Swatch",
        kind: "select",
        defaultValue: "Honed Travertine",
        options: [
          "Honed Travertine",
          "Fluted White Oak",
          "Board-Formed Concrete",
          "Brushed Bronze",
          "Nordic Brick",
          "Calacatta Marble",
          "Moss & Vertical Foliage",
        ],
      },
      { key: "materialStrength", label: "Material Strength %", kind: "slider", defaultValue: 70, min: 0, max: 100 },
      { key: "styleStrength", label: "Style Strength %", kind: "slider", defaultValue: 65, min: 0, max: 100 },
    ],
  },
  {
    type: "input.load_3d_scene",
    title: "Load 3D Scene",
    category: "input",
    summary: "Pull active Oriel 3D Viewport camera, clay massing, and true solar azimuth.",
    executionTarget: "local",
    inputs: [],
    outputs: [
      { id: "scene3d", label: "3D Scene", type: "scene3d" },
      { id: "image", label: "Clay Pass", type: "image" },
    ],
    params: [
      { key: "preset", label: "Massing Preset", kind: "select", defaultValue: "Courtyard Pavilion", options: ["Courtyard Pavilion", "Cantilever House", "Atrium Tower", "Glass Museum"] },
      { key: "sunAzimuth", label: "Sun Azimuth (°)", kind: "slider", defaultValue: 135, min: 0, max: 360 },
      { key: "sunElevation", label: "Sun Elevation (°)", kind: "slider", defaultValue: 38, min: 5, max: 85 },
    ],
  },

  // ── 2. Segmentation (5) ─────────────────────────────────────────────────────
  {
    type: "segmentation.auto_segment",
    title: "Auto Segment",
    category: "segmentation",
    summary: "Automatic architectural element segmentation pass.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [{ id: "mask", label: "Mask", type: "mask" }],
    params: [
      { key: "targetClass", label: "Primary Region", kind: "select", defaultValue: "facade", options: ["facade", "wall", "floor", "ceiling", "glazing", "furniture", "landscape"] },
      { key: "threshold", label: "Sensitivity", kind: "slider", defaultValue: 48, min: 15, max: 90 },
    ],
  },
  {
    type: "segmentation.point_segment",
    title: "Point Segment",
    category: "segmentation",
    summary: "SAM-2 single or multi-point coordinate segmentation.",
    keywords: ["Click-to-Mask", "Grounded-SAM 2", "SAM 2", "Interactive Mask"],
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [{ id: "mask", label: "Mask", type: "mask" }],
    params: [
      { key: "xNorm", label: "Click X (0-1)", kind: "slider", defaultValue: 50, min: 5, max: 95 },
      { key: "yNorm", label: "Click Y (0-1)", kind: "slider", defaultValue: 52, min: 5, max: 95 },
      { key: "threshold", label: "SAM Tolerance", kind: "slider", defaultValue: 45, min: 15, max: 90 },
    ],
  },
  {
    type: "segmentation.box_segment",
    title: "Box Segment",
    category: "segmentation",
    summary: "Isolate object inside normalized bounding box.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [{ id: "mask", label: "Mask", type: "mask" }],
    params: [
      { key: "label", label: "Box Label", kind: "text", defaultValue: "sofa or wall bay" },
      { key: "xmin", label: "Left %", kind: "slider", defaultValue: 20, min: 0, max: 90 },
      { key: "ymin", label: "Top %", kind: "slider", defaultValue: 25, min: 0, max: 90 },
      { key: "xmax", label: "Right %", kind: "slider", defaultValue: 78, min: 10, max: 100 },
      { key: "ymax", label: "Bottom %", kind: "slider", defaultValue: 82, min: 10, max: 100 },
    ],
  },
  {
    type: "segmentation.text_select",
    title: "Text Select",
    category: "segmentation",
    summary: "Grounded-SAM 2 zero-shot natural language object mask.",
    keywords: ["Grounded-SAM 2", "Click-to-Mask", "Semantic Mask"],
    executionTarget: "hybrid",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [{ id: "mask", label: "Mask", type: "mask" }],
    params: [
      { key: "query", label: "Object Query", kind: "text", defaultValue: "fireplace wall", placeholder: "e.g. sofa, facade cladding, window frame" },
      { key: "threshold", label: "Edge Gate", kind: "slider", defaultValue: 46, min: 15, max: 90 },
    ],
  },
  {
    type: "segmentation.mask_refine",
    title: "Mask Refine",
    category: "segmentation",
    summary: "Dilate (+px) or invert binary edit mask cleanly.",
    executionTarget: "local",
    inputs: [{ id: "mask", label: "Mask", type: "mask", required: true }],
    outputs: [{ id: "mask", label: "Refined Mask", type: "mask" }],
    params: [
      { key: "dilatePx", label: "Expand / Feather (px)", kind: "slider", defaultValue: 4, min: 0, max: 24 },
      { key: "invert", label: "Invert Mask", kind: "toggle", defaultValue: false },
    ],
  },

  // ── 3. Editing (6) ──────────────────────────────────────────────────────────
  {
    type: "editing.inpaint",
    title: "Inpaint",
    category: "editing",
    summary: "Masked architectural inpainting via IOPaint / AI pipeline.",
    executionTarget: "hybrid",
    inputs: [
      { id: "image", label: "Image", type: "image", required: true },
      { id: "mask", label: "Mask", type: "mask", required: true },
      { id: "prompt", label: "Prompt", type: "prompt" },
      { id: "conditioning", label: "Conditioning", type: "conditioning" },
    ],
    outputs: [{ id: "image", label: "Edited Image", type: "image" }],
    params: [
      { key: "instruction", label: "Edit Directive", kind: "textarea", defaultValue: "Replace masked zone with warm honed travertine stone" },
      { key: "model", label: "Engine Model", kind: "select", defaultValue: "lama", options: ["lama", "flux-fill", "sdxl-inpaint", "brushnet"] },
      { key: "strength", label: "Edit Strength %", kind: "slider", defaultValue: 78, min: 20, max: 100 },
    ],
  },
  {
    type: "editing.outpaint",
    title: "Outpaint",
    category: "editing",
    summary: "Extend architectural canvas outward cleanly.",
    executionTarget: "hybrid",
    inputs: [
      { id: "image", label: "Image", type: "image", required: true },
      { id: "prompt", label: "Prompt", type: "prompt" },
    ],
    outputs: [{ id: "image", label: "Expanded Image", type: "image" }],
    params: [
      { key: "ratio", label: "Target Aspect", kind: "select", defaultValue: "21:9", options: ["21:9", "16:9", "9:16"] },
    ],
  },
  {
    type: "editing.object_remove",
    title: "Object Remove",
    category: "editing",
    summary: "LaMa / MAT erase of clutter, vehicles, or staging inside mask.",
    executionTarget: "local",
    inputs: [
      { id: "image", label: "Image", type: "image", required: true },
      { id: "mask", label: "Mask", type: "mask", required: true },
    ],
    outputs: [{ id: "image", label: "Clean Image", type: "image" }],
    params: [
      { key: "model", label: "Erase Kernel", kind: "select", defaultValue: "lama", options: ["lama", "mat", "migan"] },
    ],
  },
  {
    type: "editing.object_insert",
    title: "Object Insert",
    category: "editing",
    summary: "Insert architectural entourage, seating, or luminaire inside mask.",
    executionTarget: "hybrid",
    inputs: [
      { id: "image", label: "Image", type: "image", required: true },
      { id: "mask", label: "Mask", type: "mask", required: true },
      { id: "reference", label: "Reference", type: "reference" },
      { id: "prompt", label: "Prompt", type: "prompt" },
    ],
    outputs: [{ id: "image", label: "Inserted Image", type: "image" }],
    params: [
      { key: "item", label: "Asset to Insert", kind: "text", defaultValue: "Sculptural bouclé lounge chair with oak side table" },
    ],
  },
  {
    type: "editing.material_replace",
    title: "Material Replace",
    category: "editing",
    summary: "Swap surface material inside mask while locking geometry.",
    executionTarget: "hybrid",
    inputs: [
      { id: "image", label: "Image", type: "image", required: true },
      { id: "mask", label: "Mask", type: "mask", required: true },
      { id: "reference", label: "Material Ref", type: "reference" },
      { id: "conditioning", label: "Geometry Lock", type: "conditioning" },
      { id: "prompt", label: "Prompt", type: "prompt" },
    ],
    outputs: [{ id: "image", label: "Restyled Image", type: "image" }],
    params: [
      { key: "materialPrompt", label: "Target Finish", kind: "text", defaultValue: "Honed Travertine slabs with subtle directional veining" },
      { key: "referenceStrength", label: "Material Strength %", kind: "slider", defaultValue: 75, min: 10, max: 100 },
    ],
  },
  {
    type: "editing.relight",
    title: "Relight",
    category: "editing",
    summary: "Transform lighting & mood using Environment or 3D sun direction.",
    executionTarget: "hybrid",
    inputs: [
      { id: "image", label: "Image", type: "image", required: true },
      { id: "environment", label: "Environment", type: "environment" },
      { id: "conditioning", label: "Conditioning", type: "conditioning" },
    ],
    outputs: [{ id: "image", label: "Relit Image", type: "image" }],
    params: [
      { key: "preset", label: "Relight Preset", kind: "select", defaultValue: "day-to-dusk", options: ["overcast-to-golden", "day-to-dusk", "summer-to-snow"] },
    ],
  },

  // ── 4. Conditioning (6) ─────────────────────────────────────────────────────
  {
    type: "conditioning.depth_map",
    title: "Depth Map",
    category: "conditioning",
    summary: "Extract Z-depth map to constrain perspective & massing.",
    keywords: ["ControlNet Processor", "ControlNet Depth", "Depth Conditioning"],
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [
      { id: "conditioning", label: "Depth Cond", type: "conditioning" },
      { id: "image", label: "Depth Map", type: "image" },
    ],
    params: [
      { key: "nearBias", label: "Near Contrast Bias", kind: "slider", defaultValue: 55, min: 10, max: 95 },
      { key: "heatmap", label: "Inferno Heatmap", kind: "toggle", defaultValue: true },
    ],
  },
  {
    type: "conditioning.canny_edge",
    title: "Canny Edge",
    category: "conditioning",
    summary: "Crisp architectural structural edge detector.",
    keywords: ["ControlNet Processor", "ControlNet Canny", "Edge Conditioning"],
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [
      { id: "conditioning", label: "Canny Cond", type: "conditioning" },
      { id: "image", label: "Edge Map", type: "image" },
    ],
    params: [{ key: "threshold", label: "Edge Sensitivity", kind: "slider", defaultValue: 60, min: 20, max: 95 }],
  },
  {
    type: "conditioning.line_art",
    title: "Line Art",
    category: "conditioning",
    summary: "Clean ink linework / MLSD architectural stroke map.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [
      { id: "conditioning", label: "LineArt Cond", type: "conditioning" },
      { id: "image", label: "Line Map", type: "image" },
    ],
    params: [{ key: "mode", label: "Extractor", kind: "select", defaultValue: "lineart", options: ["lineart", "mlsd", "softedge"] }],
  },
  {
    type: "conditioning.normal_map",
    title: "Normal Map",
    category: "conditioning",
    summary: "Tangent surface-normal vector extraction.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [
      { id: "conditioning", label: "Normal Cond", type: "conditioning" },
      { id: "image", label: "Normal Map", type: "image" },
    ],
    params: [{ key: "strength", label: "Relief Weight %", kind: "slider", defaultValue: 70, min: 10, max: 100 }],
  },
  {
    type: "conditioning.ipadapter",
    title: "IPAdapter",
    category: "conditioning",
    summary: "Bind multi-reference image into architectural style/material weights.",
    executionTarget: "local",
    inputs: [{ id: "reference", label: "Reference", type: "reference", required: true }],
    outputs: [{ id: "conditioning", label: "IPAdapter Cond", type: "conditioning" }],
    params: [
      { key: "weight", label: "IP-Adapter Weight %", kind: "slider", defaultValue: 72, min: 0, max: 100 },
      { key: "mode", label: "Attention Scope", kind: "select", defaultValue: "material-and-style", options: ["material-and-style", "material-only", "lighting-only"] },
    ],
  },
  {
    type: "conditioning.geometry_lock",
    title: "Geometry Lock",
    category: "conditioning",
    summary: "Strong structural constraint (~90%) with post-run diff verification.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Source Geometry", type: "image", required: true }],
    outputs: [{ id: "conditioning", label: "Locked Cond", type: "conditioning" }],
    params: [
      { key: "lockWeight", label: "Geometry Lock %", kind: "slider", defaultValue: 90, min: 50, max: 100 },
      { key: "warnThresholdPct", label: "Drift Alert %", kind: "slider", defaultValue: 18, min: 5, max: 45 },
    ],
  },

  // ── 5. Architecture (6) ─────────────────────────────────────────────────────
  {
    type: "architecture.building_type",
    title: "Building Type",
    category: "architecture",
    summary: "Specify architectural typology & scale cues.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "prompt", label: "Program Prompt", type: "prompt" }],
    params: [
      { key: "typology", label: "Typology", kind: "select", defaultValue: "Contemporary Courtyard Residence", options: ["Contemporary Courtyard Residence", "Boutique Cultural Museum", "Timber Pavilion", "Mixed-Use Brick Loft", "Alpine Concrete Villa"] },
    ],
  },
  {
    type: "architecture.room_type",
    title: "Room Type",
    category: "architecture",
    summary: "Define interior room program and furnishing grammar.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "prompt", label: "Room Prompt", type: "prompt" }],
    params: [
      { key: "room", label: "Room", kind: "select", defaultValue: "Double-Height Living Room", options: ["Double-Height Living Room", "Architectural Kitchen", "Minimalist Primary Suite", "Lobby Atrium", "Gallery Reading Hall"] },
    ],
  },
  {
    type: "architecture.material_palette",
    title: "Material Palette",
    category: "architecture",
    summary: "Curated PBR architectural material specification.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "reference", label: "Palette Ref", type: "reference" }],
    params: [
      { key: "primary", label: "Primary Surface", kind: "select", defaultValue: "Honed Travertine", options: ["Honed Travertine", "Board-Formed Concrete", "Nordic Brick", "Fluted White Oak"] },
      { key: "secondary", label: "Secondary Accent", kind: "select", defaultValue: "Brushed Bronze", options: ["Brushed Bronze", "Blackened Steel", "Low-E Curtain Glass", "Raw Linen"] },
    ],
  },
  {
    type: "architecture.camera_settings",
    title: "Camera Settings",
    category: "architecture",
    summary: "2-Point tilt-shift lens, focal length, and framing rules.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "prompt", label: "Camera Prompt", type: "prompt" }],
    params: [
      { key: "focalLength", label: "Focal Length", kind: "select", defaultValue: "24mm Tilt-Shift", options: ["24mm Tilt-Shift", "35mm Eye-Level", "50mm Architectural Detail", "85mm Compression"] },
      { key: "twoPointLock", label: "2-Point Vertical Lock", kind: "toggle", defaultValue: true },
    ],
  },
  {
    type: "architecture.style_preset",
    title: "Style Preset",
    category: "architecture",
    summary: "Editorial ArchViz rendering aesthetic profile.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "prompt", label: "Style Prompt", type: "prompt" }],
    params: [
      { key: "style", label: "Render Style", kind: "select", defaultValue: "Warm Minimalist Monograph", options: ["Warm Minimalist Monograph", "Nordic Daylight Realism", "Brutalist Concrete Editorial", "Biophilic Courtyard"] },
    ],
  },
  {
    type: "architecture.landscape",
    title: "Landscape",
    category: "architecture",
    summary: "Site planting, hardscape, and seasonal flora directives.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "prompt", label: "Landscape Prompt", type: "prompt" }],
    params: [
      { key: "biome", label: "Planting & Site", kind: "select", defaultValue: "Mediterranean Olive & Gravel Terrace", options: ["Mediterranean Olive & Gravel Terrace", "Pacific Northwest Ferns & Cedar", "Nordic Birch & Meadow", "Japanese Moss & Maple Courtyard"] },
    ],
  },

  // ── 6. Environment (5) ──────────────────────────────────────────────────────
  {
    type: "environment.weather",
    title: "Weather",
    category: "environment",
    summary: "Cloud deck, precipitation, and wet reflection state.",
    executionTarget: "local",
    inputs: [{ id: "scene3d", label: "Optional 3D", type: "scene3d" }],
    outputs: [{ id: "environment", label: "Weather Env", type: "environment" }],
    params: [
      { key: "weather", label: "Weather Condition", kind: "select", defaultValue: "Clear Crisp Sky", options: ["Clear Crisp Sky", "Soft Overcast", "Post-Rain Wet Pavement", "Light Snowfall", "Morning Coastal Fog"] },
    ],
  },
  {
    type: "environment.climate",
    title: "Climate",
    category: "environment",
    summary: "Regional climate zone & seasonal daylight coloration.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "environment", label: "Climate Env", type: "environment" }],
    params: [
      { key: "climate", label: "Climate Zone", kind: "select", defaultValue: "Temperate Golden", options: ["Temperate Golden", "Nordic Cool Sky", "Arid Desert Sun", "Alpine Snow"] },
      { key: "season", label: "Season", kind: "select", defaultValue: "Autumn", options: ["Spring", "Summer", "Autumn", "Winter"] },
    ],
  },
  {
    type: "environment.sun_position",
    title: "Sun Position",
    category: "environment",
    summary: "Time-of-day solar angle (3D-verified if Load 3D Scene wired).",
    executionTarget: "local",
    inputs: [{ id: "scene3d", label: "3D Sun Sync", type: "scene3d" }],
    outputs: [{ id: "environment", label: "Solar Env", type: "environment" }],
    params: [
      { key: "timeOfDay", label: "Time of Day", kind: "select", defaultValue: "Golden Hour", options: ["Dawn", "Day", "Golden Hour", "Blue Hour", "Night"] },
      { key: "azimuth", label: "Azimuth (°)", kind: "slider", defaultValue: 145, min: 0, max: 360 },
    ],
  },
  {
    type: "environment.mood",
    title: "Mood",
    category: "environment",
    summary: "Architectural emotional tone & interior warmth.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "environment", label: "Mood Env", type: "environment" }],
    params: [
      { key: "mood", label: "Mood Preset", kind: "select", defaultValue: "Luxury & Calm", options: ["Calm", "Luxury & Calm", "Dramatic Chiaroscuro", "Minimal & Airy", "Cozy Dusk"] },
    ],
  },
  {
    type: "environment.atmosphere",
    title: "Atmosphere",
    category: "environment",
    summary: "Volumetric haze, air clarity, and experiential occupancy.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "environment", label: "Atmosphere Env", type: "environment" }],
    params: [
      { key: "experience", label: "Experience", kind: "select", defaultValue: "Quiet", options: ["Quiet", "Architectural Lived-In", "Evening Sanctuary", "Crisp Exhibition"] },
      { key: "haze", label: "Atmospheric Haze %", kind: "slider", defaultValue: 18, min: 0, max: 80 },
    ],
  },

  // ── 7. Generation (5) ───────────────────────────────────────────────────────
  {
    type: "generation.text_to_image",
    title: "Text-to-Image",
    category: "generation",
    summary: "Generate a fresh architectural concept plate from brief & style.",
    keywords: ["Render Engine", "Concept Render", "AI Diffusion"],
    executionTarget: "cloud",
    inputs: [
      { id: "prompt", label: "Prompt", type: "prompt", required: true },
      { id: "environment", label: "Environment", type: "environment" },
      { id: "conditioning", label: "Conditioning", type: "conditioning" },
    ],
    outputs: [{ id: "image", label: "Generated Image", type: "image" }],
    params: [
      { key: "aspect", label: "Aspect", kind: "select", defaultValue: "16:9", options: ["16:9", "4:3", "3:4", "1:1"] },
    ],
  },
  {
    type: "generation.image_to_image",
    title: "Image-to-Image",
    category: "generation",
    summary: "Render photoreal materials over 3D massing or sketch conditioning.",
    keywords: ["Render Engine", "Photoreal Engine", "ControlNet Render"],
    executionTarget: "hybrid",
    inputs: [
      { id: "image", label: "Base Image", type: "image", required: true },
      { id: "conditioning", label: "Conditioning", type: "conditioning" },
      { id: "prompt", label: "Prompt", type: "prompt" },
      { id: "environment", label: "Environment", type: "environment" },
    ],
    outputs: [{ id: "image", label: "Rendered Image", type: "image" }],
    params: [
      { key: "denoise", label: "Transformation %", kind: "slider", defaultValue: 62, min: 15, max: 95 },
    ],
  },
  {
    type: "generation.upscale",
    title: "Upscale",
    category: "generation",
    summary: "2× / 4× / 8× tiled architectural texture & sharpness upscaler.",
    executionTarget: "hybrid",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [{ id: "image", label: "Upscaled Image", type: "image" }],
    params: [
      { key: "factor", label: "Scale Factor", kind: "select", defaultValue: "4", options: ["2", "4", "8"] },
      { key: "model", label: "Upscaler Kernel", kind: "select", defaultValue: "4x-ArchSharp", options: ["4x-ArchSharp", "RealESRGAN_x4plus", "4x-UltraSharp"] },
    ],
  },
  {
    type: "generation.detail_enhance",
    title: "Detail Enhance",
    category: "generation",
    summary: "Synthesize crisp mortar joints, timber grain, and glass reflections.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [{ id: "image", label: "Enhanced Image", type: "image" }],
    params: [{ key: "crispness", label: "Micro-Grain %", kind: "slider", defaultValue: 55, min: 10, max: 100 }],
  },
  {
    type: "generation.batch_variations",
    title: "Batch Variations",
    category: "generation",
    summary: "Generate 4 coherent architectural concept candidates.",
    executionTarget: "cloud",
    inputs: [
      { id: "image", label: "Base Image", type: "image", required: true },
      { id: "prompt", label: "Prompt", type: "prompt" },
    ],
    outputs: [{ id: "image", label: "Primary Pick", type: "image" }],
    params: [{ key: "count", label: "Variations", kind: "number", defaultValue: 4, min: 2, max: 4 }],
  },

  // ── 8. Video (4) ────────────────────────────────────────────────────────────
  {
    type: "video.image_to_video",
    title: "Image-to-Video",
    category: "video",
    summary: "Animate architectural still plate into smooth walkthrough clip.",
    executionTarget: "hybrid",
    inputs: [
      { id: "image", label: "Start Frame", type: "image", required: true },
      { id: "conditioning", label: "Depth Guide", type: "conditioning" },
      { id: "prompt", label: "Camera Motion", type: "prompt" },
    ],
    outputs: [{ id: "video", label: "Video Clip", type: "video" }],
    params: [
      { key: "durationSec", label: "Duration (s)", kind: "slider", defaultValue: 4, min: 2, max: 8 },
      { key: "motionKind", label: "Motion Fallback", kind: "select", defaultValue: "dolly-in", options: ["dolly-in", "pan", "orbit", "crane", "zoom"] },
    ],
  },
  {
    type: "video.camera_motion",
    title: "Camera Motion",
    category: "video",
    summary: "Define dolly-in, pan, orbit, or crane trajectory.",
    executionTarget: "local",
    inputs: [],
    outputs: [{ id: "prompt", label: "Motion Rig", type: "prompt" }],
    params: [
      { key: "kind", label: "Camera Path", kind: "select", defaultValue: "dolly-in", options: ["dolly-in", "pan", "orbit", "crane", "zoom"] },
      { key: "speed", label: "Motion Ease %", kind: "slider", defaultValue: 45, min: 10, max: 100 },
    ],
  },
  {
    type: "video.frame_interpolation",
    title: "Frame Interpolation",
    category: "video",
    summary: "Smooth clip frame cadence up to 48/60fps motion.",
    executionTarget: "local",
    inputs: [{ id: "video", label: "Video", type: "video", required: true }],
    outputs: [{ id: "video", label: "Smooth Video", type: "video" }],
    params: [{ key: "targetFps", label: "Target FPS", kind: "select", defaultValue: "30", options: ["24", "30", "48", "60"] }],
  },
  {
    type: "video.video_export",
    title: "Video Export",
    category: "video",
    summary: "Package walkthrough clip for download and client review.",
    executionTarget: "local",
    inputs: [{ id: "video", label: "Video", type: "video", required: true }],
    outputs: [{ id: "video", label: "Final Video", type: "video" }],
    params: [{ key: "format", label: "Container", kind: "select", defaultValue: "webm", options: ["webm", "mp4-storyboard"] }],
  },

  // ── 9. Output (3) ───────────────────────────────────────────────────────────
  {
    type: "output.image_preview",
    title: "Image Preview",
    category: "output",
    summary: "Inspect high-resolution rendered plate inside the graph.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [],
    params: [{ key: "caption", label: "Preview Label", kind: "text", defaultValue: "Final Render Plate" }],
  },
  {
    type: "output.compare_versions",
    title: "Compare Versions",
    category: "output",
    summary: "Side-by-side slider + structural drift metric outside mask.",
    executionTarget: "local",
    inputs: [
      { id: "before", label: "Before Image", type: "image", required: true },
      { id: "after", label: "After Image", type: "image", required: true },
      { id: "mask", label: "Optional Mask", type: "mask" },
    ],
    outputs: [],
    params: [{ key: "driftWarnPct", label: "Geometry Alert %", kind: "slider", defaultValue: 18, min: 5, max: 50 }],
  },
  {
    type: "output.save_asset",
    title: "Save Asset",
    category: "output",
    summary: "Promote result into Oriel Studio Plate & non-destructive revision vault.",
    executionTarget: "local",
    inputs: [{ id: "image", label: "Image", type: "image", required: true }],
    outputs: [],
    params: [{ key: "assetTitle", label: "Asset Name", kind: "text", defaultValue: "Node Studio Plate" }],
  },
];

export const NODE_SPEC_MAP: Record<string, NodeSpec> = Object.fromEntries(
  NODE_CATALOG.map((spec) => [spec.type, spec]),
);

export function getNodeSpec(type: string): NodeSpec | undefined {
  return NODE_SPEC_MAP[type];
}

export function isPortCompatible(sourceType: PortType, targetType: PortType): boolean {
  if (sourceType === targetType) return true;
  if (sourceType === "scene3d" && (targetType === "image" || targetType === "conditioning")) return true;
  if (sourceType === "environment" && targetType === "prompt") return true;
  return false;
}

export function createNodeInstance(
  type: string,
  position: { x: number; y: number },
  customId?: string,
  overrides?: Record<string, string | number | boolean>,
): WorkflowNodeInstance {
  const spec = getNodeSpec(type);
  const params: Record<string, string | number | boolean> = {};
  if (spec) {
    for (const field of spec.params) {
      params[field.key] = field.defaultValue;
    }
  }
  if (overrides) {
    Object.assign(params, overrides);
  }
  return {
    id: customId ?? `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    position,
    params,
  };
}

export function validateWorkflowGraph(
  nodes: WorkflowNodeInstance[],
  edges: WorkflowEdge[],
): GraphValidationResult {
  const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
  const issues: ValidationIssue[] = [];
  const nodeMap = new Map<string, WorkflowNodeInstance>();

  for (const node of nodes) {
    if (nodeMap.has(node.id)) {
      issues.push({ severity: "error", nodeId: node.id, message: `Duplicate node id "${node.id}".` });
      continue;
    }
    if (!getNodeSpec(node.type)) {
      issues.push({ severity: "error", nodeId: node.id, message: `Unknown node type "${node.type}".` });
    }
    nodeMap.set(node.id, node);
  }

  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  for (const node of nodes) {
    adj.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  const connectedTargetPorts = new Set<string>();

  for (const edge of edges) {
    const srcNode = nodeMap.get(edge.sourceNodeId);
    const dstNode = nodeMap.get(edge.targetNodeId);
    if (!srcNode || !dstNode) {
      issues.push({ severity: "error", edgeId: edge.id, message: `Edge "${edge.id}" references a missing node.` });
      continue;
    }
    if (edge.sourceNodeId === edge.targetNodeId) {
      issues.push({ severity: "error", edgeId: edge.id, message: `Self-loop detected on node "${srcNode.type}".` });
      continue;
    }
    const srcSpec = getNodeSpec(srcNode.type);
    const dstSpec = getNodeSpec(dstNode.type);
    const srcPort = srcSpec?.outputs.find((p) => p.id === edge.sourcePortId);
    const dstPort = dstSpec?.inputs.find((p) => p.id === edge.targetPortId);

    if (!srcPort || !dstPort) {
      issues.push({
        severity: "error",
        edgeId: edge.id,
        message: `Invalid port wiring (${edge.sourceNodeId}.${edge.sourcePortId} -> ${edge.targetNodeId}.${edge.targetPortId}).`,
      });
      continue;
    }

    if (!isPortCompatible(srcPort.type, dstPort.type)) {
      issues.push({
        severity: "error",
        edgeId: edge.id,
        message: `Incompatible port types: ${srcPort.type} cannot connect to ${dstPort.type}.`,
      });
      continue;
    }

    connectedTargetPorts.add(`${dstNode.id}:${dstPort.id}`);
    adj.get(srcNode.id)!.push(dstNode.id);
    inDegree.set(dstNode.id, (inDegree.get(dstNode.id) ?? 0) + 1);
  }

  // Check required input connections
  for (const node of nodes) {
    const spec = getNodeSpec(node.type);
    if (!spec) continue;
    for (const inputPort of spec.inputs) {
      if (inputPort.required && !connectedTargetPorts.has(`${node.id}:${inputPort.id}`)) {
        issues.push({
          severity: "error",
          nodeId: node.id,
          message: `"${spec.title}" is missing required "${inputPort.label}" input connection.`,
        });
      }
    }
  }

  // Kahn's topological sort for DAG verification & execution ordering
  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const executionOrder: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    executionOrder.push(current);
    for (const next of adj.get(current) ?? []) {
      const nextDeg = (inDegree.get(next) ?? 0) - 1;
      inDegree.set(next, nextDeg);
      if (nextDeg === 0) queue.push(next);
    }
  }

  const hasCycles = executionOrder.length < nodes.length;
  if (hasCycles) {
    issues.push({
      severity: "error",
      message: "Cyclic graph dependency detected. Break the loop before executing.",
    });
  }

  if (nodes.length === 0) {
    issues.push({ severity: "warning", message: "Workflow canvas is empty. Add nodes or load a template." });
  }

  const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
  return {
    valid: !issues.some((i) => i.severity === "error") && nodes.length > 0,
    executionOrder,
    issues,
    durationMs: Math.max(0.1, Number((t1 - t0).toFixed(2))),
    hasCycles,
  };
}

const COMFY_CLASS_MAP: Record<string, string> = {
  "input.load_image": "LoadImage",
  "input.load_video": "VHS_LoadVideo",
  "input.text_prompt": "CLIPTextEncode",
  "input.reference_image": "LoadImage",
  "input.load_3d_scene": "Oriel3DSceneBridge",
  "segmentation.auto_segment": "SAM2AutoSegment",
  "segmentation.point_segment": "SAM2PointSegment",
  "segmentation.box_segment": "SAM2BoxSegment",
  "segmentation.text_select": "GroundingDinoSAM2Segment",
  "segmentation.mask_refine": "GrowMask",
  "editing.inpaint": "IOPaintInpaint",
  "editing.outpaint": "ImagePadForOutpaint",
  "editing.object_remove": "LaMaErase",
  "editing.object_insert": "IOPaintObjectInsert",
  "editing.material_replace": "MaterialReplaceConditioned",
  "editing.relight": "OrielRelightPass",
  "conditioning.depth_map": "DepthAnythingV2Preprocessor",
  "conditioning.canny_edge": "CannyEdgePreprocessor",
  "conditioning.line_art": "LineArtPreprocessor",
  "conditioning.normal_map": "BAE-NormalMapPreprocessor",
  "conditioning.ipadapter": "IPAdapterUnifiedLoader",
  "conditioning.geometry_lock": "ControlNetApplyAdvanced",
  "architecture.building_type": "OrielArchitectureProgram",
  "architecture.room_type": "OrielRoomSpec",
  "architecture.material_palette": "OrielMaterialPalette",
  "architecture.camera_settings": "OrielCameraTiltShift",
  "architecture.style_preset": "OrielStylePreset",
  "architecture.landscape": "OrielLandscapeContext",
  "environment.weather": "OrielWeatherNode",
  "environment.climate": "OrielClimateNode",
  "environment.sun_position": "OrielSolarPositionNode",
  "environment.mood": "OrielMoodNode",
  "environment.atmosphere": "OrielAtmosphereNode",
  "generation.text_to_image": "KSampler",
  "generation.image_to_image": "KSamplerImg2Img",
  "generation.upscale": "ImageUpscaleWithModel",
  "generation.detail_enhance": "DetailDaemonSampler",
  "generation.batch_variations": "KSamplerBatch4",
  "video.image_to_video": "OrielImageToVideo",
  "video.camera_motion": "CameraCtrlMotionRig",
  "video.frame_interpolation": "RIFE_VFI",
  "video.video_export": "VHS_VideoCombine",
  "output.image_preview": "PreviewImage",
  "output.compare_versions": "ImageCompareDiff",
  "output.save_asset": "SaveImage",
};

export function compileWorkflowToComfyJson(workflow: NodeWorkflow): Record<string, unknown> {
  const validation = validateWorkflowGraph(workflow.nodes, workflow.edges);
  const idToComfyId = new Map<string, string>();
  const orderedIds =
    validation.executionOrder.length === workflow.nodes.length
      ? validation.executionOrder
      : workflow.nodes.map((n) => n.id);

  orderedIds.forEach((nodeId, idx) => {
    idToComfyId.set(nodeId, String(idx + 1));
  });

  const promptGraph: Record<string, unknown> = {};
  for (const nodeId of orderedIds) {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) continue;
    const spec = getNodeSpec(node.type);
    const comfyId = idToComfyId.get(node.id) ?? node.id;
    const inputs: Record<string, unknown> = { ...node.params };

    const incoming = workflow.edges.filter((e) => e.targetNodeId === node.id);
    for (const edge of incoming) {
      const srcComfyId = idToComfyId.get(edge.sourceNodeId) ?? edge.sourceNodeId;
      const srcNode = workflow.nodes.find((n) => n.id === edge.sourceNodeId);
      const srcSpec = srcNode ? getNodeSpec(srcNode.type) : undefined;
      const outIdx = Math.max(
        0,
        srcSpec ? srcSpec.outputs.findIndex((o) => o.id === edge.sourcePortId) : 0,
      );
      inputs[edge.targetPortId] = [srcComfyId, outIdx];
    }

    promptGraph[comfyId] = {
      class_type: COMFY_CLASS_MAP[node.type] ?? node.type,
      inputs,
      _meta: {
        title: node.label || spec?.title || node.type,
        oriel_node_id: node.id,
        category: spec?.category ?? "custom",
      },
    };
  }

  return {
    workflow_name: workflow.name,
    oriel_schema_version: "1.0.0",
    valid: validation.valid,
    prompt: promptGraph,
  };
}

export function buildEnvironmentDirective(params: {
  sceneType?: string;
  mood?: string;
  climate?: string;
  weather?: string;
  timeOfDay?: string;
  season?: string;
  experience?: string;
  azimuth?: number;
  has3DSceneInput?: boolean;
}): { directive: string; isIllustrative: boolean } {
  const parts = [
    params.sceneType ? `Scene: ${params.sceneType}` : null,
    params.mood ? `Mood: ${params.mood}` : null,
    params.climate ? `Climate: ${params.climate}` : null,
    params.season ? `Season: ${params.season}` : null,
    params.weather ? `Weather: ${params.weather}` : null,
    params.timeOfDay ? `Time of Day: ${params.timeOfDay}` : null,
    typeof params.azimuth === "number" ? `Solar Azimuth: ${params.azimuth}°` : null,
    params.experience ? `Experience: ${params.experience}` : null,
  ].filter(Boolean);

  const isIllustrative = !params.has3DSceneInput;
  const qualifier = isIllustrative
    ? "Illustrative AI Atmosphere Approximation (image-only input; use Load 3D Scene for physical solar shadow geometry)"
    : "3D-Verified Solar & Atmospheric Lighting Study";

  return {
    directive: `${parts.join(" · ")}. [${qualifier}]`,
    isIllustrative,
  };
}

export function autoLayoutGraph(
  nodes: WorkflowNodeInstance[],
  edges: WorkflowEdge[],
): WorkflowNodeInstance[] {
  if (nodes.length === 0) return nodes;
  const validation = validateWorkflowGraph(nodes, edges);
  const depthMap = new Map<string, number>();
  for (const n of nodes) depthMap.set(n.id, 0);

  const order =
    validation.executionOrder.length > 0 ? validation.executionOrder : nodes.map((n) => n.id);
  for (const nodeId of order) {
    const incoming = edges.filter((e) => e.targetNodeId === nodeId);
    let maxParent = -1;
    for (const e of incoming) {
      maxParent = Math.max(maxParent, depthMap.get(e.sourceNodeId) ?? 0);
    }
    depthMap.set(nodeId, maxParent + 1);
  }

  const columns = new Map<number, WorkflowNodeInstance[]>();
  for (const n of nodes) {
    const col = depthMap.get(n.id) ?? 0;
    const list = columns.get(col) ?? [];
    list.push(n);
    columns.set(col, list);
  }

  const colWidth = 310;
  const rowHeight = 200;
  const posMap = new Map<string, { x: number; y: number }>();

  for (const [col, list] of columns.entries()) {
    list.forEach((n, idx) => {
      posMap.set(n.id, {
        x: 60 + col * colWidth,
        y: 60 + idx * rowHeight,
      });
    });
  }

  return nodes.map((n) => ({
    ...n,
    position: posMap.get(n.id) ?? n.position,
  }));
}

export const WORKFLOW_TEMPLATES: NodeWorkflow[] = [
  {
    id: "tpl-masked-material-replace",
    name: "Masked Material Replace",
    description:
      "PRD MVP Gate: Grounded-SAM 2 text select + Mask Refine + Reference Material + Geometry Lock -> Material Replace -> Compare Versions.",
    templateId: "tpl-masked-material-replace",
    updatedAt: 1731542400000,
    nodes: [
      createNodeInstance("input.load_image", { x: 50, y: 70 }, "n-img", {
        source: "/viz/t03-compact-living-room.jpg",
      }),
      createNodeInstance("input.reference_image", { x: 50, y: 310 }, "n-ref", {
        swatch: "Honed Travertine",
        materialStrength: 75,
        styleStrength: 60,
      }),
      createNodeInstance("segmentation.text_select", { x: 360, y: 70 }, "n-sam", {
        query: "fireplace wall",
        threshold: 46,
      }),
      createNodeInstance("conditioning.geometry_lock", { x: 360, y: 290 }, "n-geo", {
        lockWeight: 90,
        warnThresholdPct: 18,
      }),
      createNodeInstance("segmentation.mask_refine", { x: 670, y: 70 }, "n-refine", {
        dilatePx: 4,
        invert: false,
      }),
      createNodeInstance("editing.material_replace", { x: 980, y: 150 }, "n-replace", {
        materialPrompt: "Honed travertine limestone slabs with warm architectural grazing light",
        referenceStrength: 78,
      }),
      createNodeInstance("output.compare_versions", { x: 1300, y: 70 }, "n-compare", {
        driftWarnPct: 18,
      }),
      createNodeInstance("output.save_asset", { x: 1300, y: 290 }, "n-save", {
        assetTitle: "Living Room Travertine Revision",
      }),
    ],
    edges: [
      { id: "e1", sourceNodeId: "n-img", sourcePortId: "image", targetNodeId: "n-sam", targetPortId: "image" },
      { id: "e2", sourceNodeId: "n-img", sourcePortId: "image", targetNodeId: "n-geo", targetPortId: "image" },
      { id: "e3", sourceNodeId: "n-sam", sourcePortId: "mask", targetNodeId: "n-refine", targetPortId: "mask" },
      { id: "e4", sourceNodeId: "n-img", sourcePortId: "image", targetNodeId: "n-replace", targetPortId: "image" },
      { id: "e5", sourceNodeId: "n-refine", sourcePortId: "mask", targetNodeId: "n-replace", targetPortId: "mask" },
      { id: "e6", sourceNodeId: "n-ref", sourcePortId: "reference", targetNodeId: "n-replace", targetPortId: "reference" },
      { id: "e7", sourceNodeId: "n-geo", sourcePortId: "conditioning", targetNodeId: "n-replace", targetPortId: "conditioning" },
      { id: "e8", sourceNodeId: "n-img", sourcePortId: "image", targetNodeId: "n-compare", targetPortId: "before" },
      { id: "e9", sourceNodeId: "n-replace", sourcePortId: "image", targetNodeId: "n-compare", targetPortId: "after" },
      { id: "e10", sourceNodeId: "n-refine", sourcePortId: "mask", targetNodeId: "n-compare", targetPortId: "mask" },
      { id: "e11", sourceNodeId: "n-replace", sourcePortId: "image", targetNodeId: "n-save", targetPortId: "image" },
    ],
  },
  {
    id: "tpl-3d-to-photoreal",
    name: "3D & Line Art -> Photoreal Render",
    description:
      "Multi-conditioned architectural pipeline combining 3D clay massing, Z-Depth, and architectural typology into a crisp 4× upscaled render.",
    templateId: "tpl-3d-to-photoreal",
    updatedAt: 1731542400000,
    nodes: [
      createNodeInstance("input.load_3d_scene", { x: 50, y: 120 }, "n-3d", {
        preset: "Courtyard Pavilion",
        sunAzimuth: 135,
        sunElevation: 38,
      }),
      createNodeInstance("architecture.building_type", { x: 50, y: 340 }, "n-bldg", {
        typology: "Contemporary Courtyard Residence",
      }),
      createNodeInstance("conditioning.depth_map", { x: 370, y: 60 }, "n-depth", {
        nearBias: 55,
        heatmap: true,
      }),
      createNodeInstance("conditioning.canny_edge", { x: 370, y: 270 }, "n-canny", {
        threshold: 62,
      }),
      createNodeInstance("generation.image_to_image", { x: 700, y: 150 }, "n-i2i", {
        denoise: 62,
      }),
      createNodeInstance("generation.upscale", { x: 1010, y: 150 }, "n-up", {
        factor: "4",
        model: "4x-ArchSharp",
      }),
      createNodeInstance("output.image_preview", { x: 1320, y: 150 }, "n-prev", {
        caption: "4× Photoreal Pavilion",
      }),
    ],
    edges: [
      { id: "e2-1", sourceNodeId: "n-3d", sourcePortId: "image", targetNodeId: "n-depth", targetPortId: "image" },
      { id: "e2-2", sourceNodeId: "n-3d", sourcePortId: "image", targetNodeId: "n-canny", targetPortId: "image" },
      { id: "e2-3", sourceNodeId: "n-3d", sourcePortId: "image", targetNodeId: "n-i2i", targetPortId: "image" },
      { id: "e2-4", sourceNodeId: "n-depth", sourcePortId: "conditioning", targetNodeId: "n-i2i", targetPortId: "conditioning" },
      { id: "e2-5", sourceNodeId: "n-bldg", sourcePortId: "prompt", targetNodeId: "n-i2i", targetPortId: "prompt" },
      { id: "e2-6", sourceNodeId: "n-i2i", sourcePortId: "image", targetNodeId: "n-up", targetPortId: "image" },
      { id: "e2-7", sourceNodeId: "n-up", sourcePortId: "image", targetNodeId: "n-prev", targetPortId: "image" },
    ],
  },
  {
    id: "tpl-climate-relight",
    name: "Climate & Moody Relight",
    description:
      "Environment-driven architectural atmosphere shift preserving facade lines while updating sun angle, sky dome, and interior practical glow.",
    templateId: "tpl-climate-relight",
    updatedAt: 1731542400000,
    nodes: [
      createNodeInstance("input.load_image", { x: 50, y: 100 }, "n-r-img", {
        source: "/viz/p01-pavilion-day.jpg",
      }),
      createNodeInstance("environment.sun_position", { x: 50, y: 310 }, "n-r-sun", {
        timeOfDay: "Blue Hour",
        azimuth: 225,
      }),
      createNodeInstance("conditioning.geometry_lock", { x: 370, y: 80 }, "n-r-geo", {
        lockWeight: 92,
      }),
      createNodeInstance("editing.relight", { x: 700, y: 170 }, "n-r-relight", {
        preset: "day-to-dusk",
      }),
      createNodeInstance("output.compare_versions", { x: 1020, y: 170 }, "n-r-cmp", {
        driftWarnPct: 18,
      }),
    ],
    edges: [
      { id: "e3-1", sourceNodeId: "n-r-img", sourcePortId: "image", targetNodeId: "n-r-geo", targetPortId: "image" },
      { id: "e3-2", sourceNodeId: "n-r-img", sourcePortId: "image", targetNodeId: "n-r-relight", targetPortId: "image" },
      { id: "e3-3", sourceNodeId: "n-r-sun", sourcePortId: "environment", targetNodeId: "n-r-relight", targetPortId: "environment" },
      { id: "e3-4", sourceNodeId: "n-r-geo", sourcePortId: "conditioning", targetNodeId: "n-r-relight", targetPortId: "conditioning" },
      { id: "e3-5", sourceNodeId: "n-r-img", sourcePortId: "image", targetNodeId: "n-r-cmp", targetPortId: "before" },
      { id: "e3-6", sourceNodeId: "n-r-relight", sourcePortId: "image", targetNodeId: "n-r-cmp", targetPortId: "after" },
    ],
  },
  {
    id: "tpl-video-walkthrough",
    name: "Architectural Video Walkthrough",
    description:
      "Convert an architectural render into a depth-guided dolly-in client walkthrough clip with frame interpolation and WebM export.",
    templateId: "tpl-video-walkthrough",
    updatedAt: 1731542400000,
    nodes: [
      createNodeInstance("input.load_image", { x: 50, y: 80 }, "n-v-img", {
        source: "/viz/p01-pavilion-dusk.jpg",
      }),
      createNodeInstance("video.camera_motion", { x: 50, y: 310 }, "n-v-cam", {
        kind: "dolly-in",
        speed: 45,
      }),
      createNodeInstance("conditioning.depth_map", { x: 360, y: 80 }, "n-v-depth", {
        nearBias: 50,
        heatmap: false,
      }),
      createNodeInstance("video.image_to_video", { x: 690, y: 160 }, "n-v-i2v", {
        durationSec: 4,
        motionKind: "dolly-in",
      }),
      createNodeInstance("video.frame_interpolation", { x: 1000, y: 160 }, "n-v-interp", {
        targetFps: "30",
      }),
      createNodeInstance("video.video_export", { x: 1310, y: 160 }, "n-v-exp", {
        format: "webm",
      }),
    ],
    edges: [
      { id: "e4-1", sourceNodeId: "n-v-img", sourcePortId: "image", targetNodeId: "n-v-depth", targetPortId: "image" },
      { id: "e4-2", sourceNodeId: "n-v-img", sourcePortId: "image", targetNodeId: "n-v-i2v", targetPortId: "image" },
      { id: "e4-3", sourceNodeId: "n-v-depth", sourcePortId: "conditioning", targetNodeId: "n-v-i2v", targetPortId: "conditioning" },
      { id: "e4-4", sourceNodeId: "n-v-cam", sourcePortId: "prompt", targetNodeId: "n-v-i2v", targetPortId: "prompt" },
      { id: "e4-5", sourceNodeId: "n-v-i2v", sourcePortId: "video", targetNodeId: "n-v-interp", targetPortId: "video" },
      { id: "e4-6", sourceNodeId: "n-v-interp", sourcePortId: "video", targetNodeId: "n-v-exp", targetPortId: "video" },
    ],
  },
  {
    id: "tpl-controlnet-render",
    name: "Studio Orchestration: Load → ControlNet → Prompt → Render",
    description:
      "Connects Image Load, Canny ControlNet Processor, Prompt Modifier, and Image-to-Image Render Engine for structure-locked visualization.",
    templateId: "tpl-controlnet-render",
    updatedAt: 1731542400000,
    nodes: [
      createNodeInstance("input.load_image", { x: 40, y: 100 }, "n-c-img", {
        source: "/viz/t03-compact-living-room.jpg",
      }),
      createNodeInstance("input.text_prompt", { x: 40, y: 310 }, "n-c-prompt", {
        text: "Warm minimalist honed travertine wall cladding, brushed bronze mullions, soft daylight.",
      }),
      createNodeInstance("conditioning.canny_edge", { x: 360, y: 80 }, "n-c-ctrl", {
        threshold: 62,
      }),
      createNodeInstance("generation.image_to_image", { x: 690, y: 170 }, "n-c-render", {
        denoise: 58,
      }),
      createNodeInstance("output.image_preview", { x: 1010, y: 170 }, "n-c-out", {
        caption: "ControlNet Render Output",
      }),
    ],
    edges: [
      { id: "e5-1", sourceNodeId: "n-c-img", sourcePortId: "image", targetNodeId: "n-c-ctrl", targetPortId: "image" },
      { id: "e5-2", sourceNodeId: "n-c-img", sourcePortId: "image", targetNodeId: "n-c-render", targetPortId: "image" },
      { id: "e5-3", sourceNodeId: "n-c-ctrl", sourcePortId: "conditioning", targetNodeId: "n-c-render", targetPortId: "conditioning" },
      { id: "e5-4", sourceNodeId: "n-c-prompt", sourcePortId: "prompt", targetNodeId: "n-c-render", targetPortId: "prompt" },
      { id: "e5-5", sourceNodeId: "n-c-render", sourcePortId: "image", targetNodeId: "n-c-out", targetPortId: "image" },
    ],
  },
];

export function cloneWorkflow(workflow: NodeWorkflow): NodeWorkflow {
  return {
    ...workflow,
    nodes: workflow.nodes.map((n) => ({
      ...n,
      position: { ...n.position },
      params: { ...n.params },
    })),
    edges: workflow.edges.map((e) => ({ ...e })),
  };
}

export function matchesNodeSearch(spec: NodeSpec, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (
    spec.title.toLowerCase().includes(q) ||
    spec.summary.toLowerCase().includes(q) ||
    spec.category.toLowerCase().includes(q) ||
    spec.type.toLowerCase().includes(q)
  ) {
    return true;
  }
  return Boolean(spec.keywords?.some((kw) => kw.toLowerCase().includes(q)));
}
