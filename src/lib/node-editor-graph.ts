/**
 * Pure graph data model, validation, topological ordering, and SVG connection geometry
 * for the streamlined architectural NodeEditorCanvas component.
 */

export type EditorPortType = "image" | "control" | "prompt" | "mask" | "render";

export type EditorNodeKind =
  | "image-input"
  | "controlnet-config"
  | "prompt-modifier"
  | "sam2-mask"
  | "render-engine"
  | "video-render"
  | "pano-360"
  | "glb-3d";

export type EditorPortSpec = {
  id: string;
  label: string;
  type: EditorPortType;
  required?: boolean;
};

export type EditorNodeSpec = {
  kind: EditorNodeKind;
  title: string;
  subtitle: string;
  accent: string;
  inputs: EditorPortSpec[];
  outputs: EditorPortSpec[];
  defaultConfig: Record<string, string | number | boolean>;
};

export type EditorNode = {
  id: string;
  kind: EditorNodeKind;
  title: string;
  x: number;
  y: number;
  config: Record<string, string | number | boolean>;
};

export type EditorConnection = {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
};

export const EDITOR_NODE_WIDTH = 228;
export const EDITOR_HEADER_HEIGHT = 40;
export const EDITOR_PORT_ROW_HEIGHT = 26;

export const EDITOR_PORT_COLORS: Record<EditorPortType, string> = {
  image: "#60a5fa",
  control: "#38bdf8",
  prompt: "#fbbf24",
  mask: "#34d399",
  render: "#e7c27a",
};

export const EDITOR_NODE_SPECS: Record<EditorNodeKind, EditorNodeSpec> = {
  "image-input": {
    kind: "image-input",
    title: "Image Input",
    subtitle: "Architectural base photo or 3D snapshot",
    accent: "#60a5fa",
    inputs: [],
    outputs: [{ id: "image", label: "Image", type: "image" }],
    defaultConfig: {
      source: "studio-active",
      customUrl: "/viz/t03-compact-living-room.jpg",
    },
  },
  "controlnet-config": {
    kind: "controlnet-config",
    title: "ControlNet Config",
    subtitle: "Structural Canny, Depth, Normal, or MLSD lock",
    accent: "#38bdf8",
    inputs: [{ id: "image", label: "Source Image", type: "image" }],
    outputs: [{ id: "control", label: "Control Map", type: "control" }],
    defaultConfig: {
      preprocessor: "canny",
      strength: 0.78,
      guidanceEnd: 0.9,
    },
  },
  "prompt-modifier": {
    kind: "prompt-modifier",
    title: "Prompt Modifier",
    subtitle: "Material palette, atmosphere & light directive",
    accent: "#fbbf24",
    inputs: [],
    outputs: [{ id: "prompt", label: "Prompt", type: "prompt" }],
    defaultConfig: {
      stylePreset: "Nordic Timber & Travertine",
      lighting: "Golden Hour",
      promptText: "Architectural photography, honed travertine limestone, warm oak joinery, soft natural window light",
    },
  },
  "sam2-mask": {
    kind: "sam2-mask",
    title: "Grounded-SAM 2 Mask",
    subtitle: "Binary segmentation mask for localized inpaint",
    accent: "#34d399",
    inputs: [{ id: "image", label: "Source Image", type: "image" }],
    outputs: [{ id: "mask", label: "Binary Mask", type: "mask" }],
    defaultConfig: {
      targetObject: "windows and glazing",
      useStudioBinaryMask: true,
    },
  },
  "render-engine": {
    kind: "render-engine",
    title: "Render Engine",
    subtitle: "Compile conditioned inputs into final render",
    accent: "#e7c27a",
    inputs: [
      { id: "image", label: "Base Image", type: "image", required: true },
      { id: "control", label: "ControlNet", type: "control" },
      { id: "prompt", label: "Prompt", type: "prompt" },
      { id: "mask", label: "Binary Mask", type: "mask" },
    ],
    outputs: [{ id: "render", label: "Render Plate", type: "render" }],
    defaultConfig: {
      engineMode: "hybrid",
      denoise: 0.62,
      steps: 28,
    },
  },
  "video-render": {
    kind: "video-render",
    title: "Video Motion",
    subtitle: "Day-to-night or 4s orbit flythrough motion clip",
    accent: "#f472b6",
    inputs: [{ id: "image", label: "Render / Image", type: "image", required: true }],
    outputs: [{ id: "render", label: "Motion Clip", type: "render" }],
    defaultConfig: {
      preset: "Day → Golden → Midnight",
      durationSec: 4,
    },
  },
  "pano-360": {
    kind: "pano-360",
    title: "360° Panorama",
    subtitle: "Interactive equirectangular walkthrough tour",
    accent: "#a78bfa",
    inputs: [{ id: "image", label: "Render / Image", type: "image", required: true }],
    outputs: [{ id: "render", label: "360° Tour", type: "render" }],
    defaultConfig: {
      fov: 72,
      hotspotsEnabled: true,
    },
  },
  "glb-3d": {
    kind: "glb-3d",
    title: "3D / GLB Stage",
    subtitle: "Send output or capture straight to 3D viewport",
    accent: "#2dd4bf",
    inputs: [{ id: "image", label: "Render / Image", type: "image" }],
    outputs: [{ id: "image", label: "3D Snapshot", type: "image" }],
    defaultConfig: {
      preset: "pavilion",
      freezeMood: true,
    },
  },
};

export const EDITOR_PALETTE_ORDER: EditorNodeKind[] = [
  "image-input",
  "controlnet-config",
  "prompt-modifier",
  "sam2-mask",
  "render-engine",
  "video-render",
  "pano-360",
  "glb-3d",
];

export function createDefaultEditorGraph(): {
  nodes: EditorNode[];
  connections: EditorConnection[];
} {
  return {
    nodes: [
      {
        id: "node-img-1",
        kind: "image-input",
        title: "Image Input",
        x: 20,
        y: 24,
        config: { ...EDITOR_NODE_SPECS["image-input"].defaultConfig },
      },
      {
        id: "node-cn-1",
        kind: "controlnet-config",
        title: "ControlNet Config",
        x: 280,
        y: 24,
        config: { ...EDITOR_NODE_SPECS["controlnet-config"].defaultConfig },
      },
      {
        id: "node-pm-1",
        kind: "prompt-modifier",
        title: "Prompt Modifier",
        x: 20,
        y: 292,
        config: { ...EDITOR_NODE_SPECS["prompt-modifier"].defaultConfig },
      },
      {
        id: "node-re-1",
        kind: "render-engine",
        title: "Render Engine",
        x: 540,
        y: 64,
        config: { ...EDITOR_NODE_SPECS["render-engine"].defaultConfig },
      },
    ],
    connections: [
      {
        id: "conn-1",
        fromNodeId: "node-img-1",
        fromPortId: "image",
        toNodeId: "node-cn-1",
        toPortId: "image",
      },
      {
        id: "conn-2",
        fromNodeId: "node-img-1",
        fromPortId: "image",
        toNodeId: "node-re-1",
        toPortId: "image",
      },
      {
        id: "conn-3",
        fromNodeId: "node-cn-1",
        fromPortId: "control",
        toNodeId: "node-re-1",
        toPortId: "control",
      },
      {
        id: "conn-4",
        fromNodeId: "node-pm-1",
        fromPortId: "prompt",
        toNodeId: "node-re-1",
        toPortId: "prompt",
      },
    ],
  };
}

export function canConnectEditorPorts(
  fromType: EditorPortType,
  toType: EditorPortType,
): boolean {
  if (fromType === toType) return true;
  // Render plate output can feed downstream Image Input / ControlNet / Video / 360° ports
  if (fromType === "render" && toType === "image") return true;
  if (fromType === "image" && toType === "render") return true;
  return false;
}

export function getEditorPortCoords(
  node: EditorNode,
  direction: "input" | "output",
  portId: string,
): { x: number; y: number } {
  const spec = EDITOR_NODE_SPECS[node.kind];
  const ports = direction === "input" ? spec.inputs : spec.outputs;
  const idx = Math.max(0, ports.findIndex((p) => p.id === portId));
  return {
    x: direction === "input" ? node.x : node.x + EDITOR_NODE_WIDTH,
    y: node.y + EDITOR_HEADER_HEIGHT + 12 + idx * EDITOR_PORT_ROW_HEIGHT + EDITOR_PORT_ROW_HEIGHT / 2,
  };
}

export function buildSvgLineData(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): { x1: number; y1: number; x2: number; y2: number; midX: number; midY: number; pathD: string } {
  const dx = Math.max(48, Math.abs(x2 - x1) * 0.45);
  return {
    x1,
    y1,
    x2,
    y2,
    midX: (x1 + x2) / 2,
    midY: (y1 + y2) / 2,
    pathD: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
  };
}

export function validateEditorGraph(
  nodes: EditorNode[],
  connections: EditorConnection[],
): { valid: boolean; hasCycles: boolean; order: string[]; issues: string[] } {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();
  const issues: string[] = [];

  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }

  for (const c of connections) {
    const src = nodeMap.get(c.fromNodeId);
    const dst = nodeMap.get(c.toNodeId);
    if (!src || !dst) continue;
    if (src.id === dst.id) {
      issues.push(`Self-connection on ${src.title}`);
      continue;
    }
    const srcPort = EDITOR_NODE_SPECS[src.kind].outputs.find((p) => p.id === c.fromPortId);
    const dstPort = EDITOR_NODE_SPECS[dst.kind].inputs.find((p) => p.id === c.toPortId);
    if (!srcPort || !dstPort || !canConnectEditorPorts(srcPort.type, dstPort.type)) {
      issues.push(`Incompatible port wire (${src.title} → ${dst.title})`);
      continue;
    }
    adj.get(src.id)?.push(dst.id);
    inDegree.set(dst.id, (inDegree.get(dst.id) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    order.push(cur);
    for (const nxt of adj.get(cur) ?? []) {
      const nextDeg = (inDegree.get(nxt) ?? 0) - 1;
      inDegree.set(nxt, nextDeg);
      if (nextDeg === 0) queue.push(nxt);
    }
  }

  const hasCycles = order.length < nodes.length;
  if (hasCycles) {
    issues.push("Cycle detected in node connections.");
  }

  for (const n of nodes) {
    const spec = EDITOR_NODE_SPECS[n.kind];
    for (const inp of spec.inputs) {
      if (inp.required) {
        const wired = connections.some((c) => c.toNodeId === n.id && c.toPortId === inp.id);
        if (!wired) {
          issues.push(`${n.title} requires an input on "${inp.label}".`);
        }
      }
    }
  }

  return {
    valid: issues.length === 0 && !hasCycles,
    hasCycles,
    order,
    issues,
  };
}
