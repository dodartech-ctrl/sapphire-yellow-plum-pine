import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Cpu,
  ImagePlus,
  Link2,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  ScanSearch,
  Sliders,
  Sparkles,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  EDITOR_NODE_SPECS,
  EDITOR_NODE_WIDTH,
  EDITOR_PALETTE_ORDER,
  EDITOR_PORT_COLORS,
  EDITOR_PORT_ROW_HEIGHT,
  buildSvgLineData,
  canConnectEditorPorts,
  createDefaultEditorGraph,
  getEditorPortCoords,
  validateEditorGraph,
  type EditorConnection,
  type EditorNode,
  type EditorNodeKind,
  type EditorPortType,
} from "@/lib/node-editor-graph";
import { runAnnotatorPass, runDepthAnythingPass, runGroundedSam2Segment } from "@/lib/cv-pipeline";
import { synthesizeFallbackComposite } from "@/lib/fallback-render";
import { generatePlate, inpaintPlate } from "@/lib/generate";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

type NodeEditorCanvasProps = {
  onSendResultToStudio?: (imageUrl: string, title?: string) => void;
  onOpenSam2Tool?: () => void;
  onOpenStage?: (stage: "360" | "3d") => void;
};

const CONTROLNET_MODES = ["canny", "depth", "normal", "mlsd"] as const;
const SAMPLE_SCENES = [
  { label: "Compact Living Room", url: "/viz/t03-compact-living-room.jpg" },
  { label: "Concrete Pavilion", url: "/viz/p01-pavilion-day.jpg" },
  { label: "Courtyard Villa", url: "/viz/t05-subtropical-home.jpg" },
  { label: "Cultural Campus", url: "/viz/t07-cultural-campus.jpg" },
];

export function NodeEditorCanvas({
  onSendResultToStudio,
  onOpenSam2Tool,
  onOpenStage,
}: NodeEditorCanvasProps) {
  const upload = useOriel((s) => s.upload);
  const plate = useOriel((s) => s.plate);
  const binaryMaskDataUrl = useOriel((s) => s.binaryMaskDataUrl);
  const maskDataUrl = useOriel((s) => s.maskDataUrl);
  const design = useOriel((s) => s.design);
  const frame = useOriel((s) => s.frame);
  const engine = useOriel((s) => s.engine);
  const scene3d = useOriel((s) => s.scene3d);

  const initialGraph = useMemo(() => createDefaultEditorGraph(), []);
  const [nodes, setNodes] = useState<EditorNode[]>(initialGraph.nodes);
  const [connections, setConnections] = useState<EditorConnection[]>(initialGraph.connections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialGraph.nodes[0]?.id ?? null);
  const [hoveredConnId, setHoveredConnId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [nodePreviews, setNodePreviews] = useState<Record<string, string>>({});

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    nodeId: string;
    startClientX: number;
    startClientY: number;
    origX: number;
    origY: number;
  } | null>(null);

  type PendingWireState = {
    direction: "output" | "input";
    nodeId: string;
    portId: string;
    portType: EditorPortType;
    cursorX: number;
    cursorY: number;
  };
  const pendingWireRef = useRef<PendingWireState | null>(null);
  const [pendingWire, setPendingWireState] = useState<PendingWireState | null>(null);

  function setPendingWire(next: PendingWireState | null) {
    pendingWireRef.current = next;
    setPendingWireState(next);
  }

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const validation = useMemo(() => validateEditorGraph(nodes, connections), [nodes, connections]);

  const activeStudioImage = plate?.url || upload || "/viz/t03-compact-living-room.jpg";
  const activeBinaryMask = binaryMaskDataUrl || maskDataUrl;

  function toCanvasCoords(clientX: number, clientY: number): { x: number; y: number } {
    const el = canvasRef.current;
    const rect = el?.getBoundingClientRect();
    if (!rect || !el) return { x: 40, y: 40 };
    return {
      x: Math.max(8, Math.round(clientX - rect.left + el.scrollLeft)),
      y: Math.max(8, Math.round(clientY - rect.top + el.scrollTop)),
    };
  }

  function addNode(kind: EditorNodeKind, dropPos?: { x: number; y: number }) {
    const spec = EDITOR_NODE_SPECS[kind];
    const id = `node-${kind.slice(0, 3)}-${Date.now().toString(36).slice(-4)}`;
    let pos = dropPos;
    if (!pos) {
      const cols = [20, 280, 540];
      const rows = [24, 292, 540];
      let chosen: { x: number; y: number } | undefined;
      for (const ry of rows) {
        for (const cx of cols) {
          const occupied = nodes.some(
            (n) => Math.abs(n.x - cx) < 190 && Math.abs(n.y - ry) < 220,
          );
          if (!occupied) {
            chosen = { x: cx, y: ry };
            break;
          }
        }
        if (chosen) break;
      }
      pos = chosen ?? { x: 40 + ((nodes.length * 36) % 240), y: 292 + ((nodes.length * 28) % 160) };
    }
    const created: EditorNode = {
      id,
      kind,
      title: spec.title,
      x: pos.x,
      y: pos.y,
      config: { ...spec.defaultConfig },
    };
    setNodes((prev) => [...prev, created]);
    setSelectedNodeId(id);
    toast.message(`Added ${spec.title} node`);
  }

  function deleteNode(nodeId: string) {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }

  function updateNodeConfig(nodeId: string, key: string, value: string | number | boolean) {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, config: { ...n.config, [key]: value } } : n)),
    );
  }

  function connectPorts(
    fromNodeId: string,
    fromPortId: string,
    fromType: EditorPortType,
    toNodeId: string,
    toPortId: string,
    toType: EditorPortType,
  ) {
    if (fromNodeId === toNodeId) return;
    if (!canConnectEditorPorts(fromType, toType)) {
      toast.error(`Cannot connect ${fromType} output into ${toType} input.`);
      return;
    }
    const newConn: EditorConnection = {
      id: `conn-${Date.now().toString(36).slice(-5)}`,
      fromNodeId,
      fromPortId,
      toNodeId,
      toPortId,
    };
    setConnections((prev) => [
      ...prev.filter((c) => !(c.toNodeId === toNodeId && c.toPortId === toPortId)),
      newConn,
    ]);
  }

  function handleCanvasPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragStateRef.current) {
      const drag = dragStateRef.current;
      const dx = e.clientX - drag.startClientX;
      const dy = e.clientY - drag.startClientY;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === drag.nodeId
            ? { ...n, x: Math.max(8, Math.round(drag.origX + dx)), y: Math.max(8, Math.round(drag.origY + dy)) }
            : n,
        ),
      );
      return;
    }
    if (pendingWireRef.current) {
      const pt = toCanvasCoords(e.clientX, e.clientY);
      const updated = { ...pendingWireRef.current, cursorX: pt.x, cursorY: pt.y };
      pendingWireRef.current = updated;
      setPendingWireState(updated);
    }
  }

  function handleCanvasPointerUp() {
    dragStateRef.current = null;
  }

  async function handleRunWorkflow() {
    if (running) return;
    if (!validation.valid) {
      toast.error(validation.issues[0] || "Check node connections before running.");
      return;
    }

    setRunning(true);
    try {
      const nodeOutputs: Record<string, { imageUrl?: string; controlUrl?: string; prompt?: string; maskUrl?: string }> = {};

      for (const nodeId of validation.order) {
        const node = nodeMap.get(nodeId);
        if (!node) continue;

        const incomingFor = (portId: string) => {
          const edge = connections.find((c) => c.toNodeId === node.id && c.toPortId === portId);
          return edge ? nodeOutputs[edge.fromNodeId] : undefined;
        };

        if (node.kind === "image-input") {
          const srcMode = String(node.config.source ?? "studio-active");
          const imgUrl = srcMode === "studio-active" ? activeStudioImage : String(node.config.customUrl || activeStudioImage);
          nodeOutputs[node.id] = { imageUrl: imgUrl };
          setNodePreviews((prev) => ({ ...prev, [node.id]: imgUrl }));
        } else if (node.kind === "controlnet-config") {
          const srcImg = incomingFor("image")?.imageUrl || activeStudioImage;
          const prep = String(node.config.preprocessor || "canny") as "canny" | "depth" | "normal" | "mlsd";
          const cvRes =
            prep === "depth"
              ? await runDepthAnythingPass(srcImg, true, 55)
              : await runAnnotatorPass(srcImg, prep, 58);
          nodeOutputs[node.id] = { controlUrl: cvRes.dataUrl, imageUrl: cvRes.dataUrl };
          setNodePreviews((prev) => ({ ...prev, [node.id]: cvRes.dataUrl }));
        } else if (node.kind === "prompt-modifier") {
          const preset = String(node.config.stylePreset || "");
          const lighting = String(node.config.lighting || "");
          const text = String(node.config.promptText || "");
          nodeOutputs[node.id] = {
            prompt: [preset, lighting, text].filter(Boolean).join(", "),
          };
        } else if (node.kind === "sam2-mask") {
          const srcImg = incomingFor("image")?.imageUrl || activeStudioImage;
          let maskUrl = activeBinaryMask || "";
          if (!maskUrl) {
            const seg = await runGroundedSam2Segment({
              src: srcImg,
              prompt: String(node.config.targetObject || "windows and glazing"),
              threshold: 45,
            });
            maskUrl = seg.maskDataUrl;
          }
          nodeOutputs[node.id] = { maskUrl };
          if (maskUrl) {
            setNodePreviews((prev) => ({ ...prev, [node.id]: maskUrl }));
          }
        } else if (node.kind === "render-engine") {
          const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
          const controlUrl = incomingFor("control")?.controlUrl;
          const promptNote = incomingFor("prompt")?.prompt || "Architectural visualization photorealistic render";
          const wiredMask = incomingFor("mask")?.maskUrl;
          const mode = String(node.config.engineMode || "hybrid");

          let finalUrl = baseImg;
          if (mode === "cloud") {
            const res = wiredMask
              ? await inpaintPlate({
                  data: {
                    idea: promptNote,
                    image: baseImg,
                    maskImage: wiredMask,
                    annotatorImage: controlUrl,
                    design,
                    frame,
                    engine,
                    scene3d,
                  },
                })
              : await generatePlate({
                  data: {
                    idea: promptNote,
                    image: baseImg,
                    annotatorImage: controlUrl,
                    design,
                    frame,
                    engine,
                    scene3d,
                  },
                });
            finalUrl = res.fallback
              ? await synthesizeFallbackComposite({
                  baseImage: baseImg,
                  sketchImage: controlUrl,
                  maskImage: wiredMask,
                  serverFallbackUrl: res.url,
                  design,
                  engine,
                  scene3d,
                  idea: promptNote,
                })
              : res.url;
            if ("warning" in res && typeof res.warning === "string" && res.warning) {
              toast.message(res.warning);
            }
          } else {
            finalUrl = await synthesizeFallbackComposite({
              baseImage: baseImg,
              sketchImage: controlUrl,
              maskImage: wiredMask,
              serverFallbackUrl: baseImg,
              design,
              engine,
              scene3d,
              idea: promptNote,
            });
          }
          nodeOutputs[node.id] = { imageUrl: finalUrl };
          setNodePreviews((prev) => ({ ...prev, [node.id]: finalUrl }));
        } else if (node.kind === "video-render") {
          const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
          nodeOutputs[node.id] = { imageUrl: baseImg };
          setNodePreviews((prev) => ({ ...prev, [node.id]: baseImg }));
          toast.message(`Motion sequence compiled: ${String(node.config.preset ?? "Day → Golden → Midnight")}`);
        } else if (node.kind === "pano-360") {
          const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
          nodeOutputs[node.id] = { imageUrl: baseImg };
          setNodePreviews((prev) => ({ ...prev, [node.id]: baseImg }));
          onSendResultToStudio?.(baseImg, "360° Node Output");
        } else if (node.kind === "glb-3d") {
          const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
          nodeOutputs[node.id] = { imageUrl: baseImg };
          setNodePreviews((prev) => ({ ...prev, [node.id]: baseImg }));
        }
      }

      toast.success("Architectural node workflow executed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Node workflow execution failed.");
    } finally {
      setRunning(false);
    }
  }

  function handleResetGraph() {
    const def = createDefaultEditorGraph();
    setNodes(def.nodes);
    setConnections(def.connections);
    setNodePreviews({});
    setSelectedNodeId(def.nodes[0]?.id ?? null);
    toast.message("Reset node workflow");
  }

  const pendingStart = useMemo(() => {
    if (!pendingWire) return null;
    const node = nodeMap.get(pendingWire.nodeId);
    if (!node) return null;
    return getEditorPortCoords(node, pendingWire.direction, pendingWire.portId);
  }, [pendingWire, nodeMap]);

  const latestRenderUrl = useMemo(() => {
    const engines = nodes.filter((n) => n.kind === "render-engine");
    for (const re of [...engines].reverse()) {
      if (nodePreviews[re.id]) return nodePreviews[re.id];
    }
    return undefined;
  }, [nodes, nodePreviews]);

  return (
    <div data-testid="node-editor-canvas" className="flex flex-col bg-[#14110f] text-[#f6efe4]">
      {/* Architectural Drag-and-Drop Palette & Controls Bar */}
      <div className="space-y-2 border-b border-white/10 bg-[#191511] px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10px] tracking-[0.14em] text-[#e7c27a] uppercase">
              Drag Node onto Canvas:
            </span>
            {EDITOR_PALETTE_ORDER.map((kind) => {
              const spec = EDITOR_NODE_SPECS[kind];
              return (
                <button
                  key={kind}
                  type="button"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("application/x-oriel-editor-node", kind);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() => addNode(kind)}
                  className="inline-flex h-7 shrink-0 cursor-grab items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#f0e6d8] transition hover:border-[#d4b06a] hover:bg-white/10 active:cursor-grabbing"
                >
                  <span className="size-2 rounded-full" style={{ backgroundColor: spec.accent }} />
                  <span>{spec.title}</span>
                  <Plus className="size-3 text-[#e7c27a]" />
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetGraph}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a]"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
            <button
              type="button"
              disabled={running}
              onClick={() => void handleRunWorkflow()}
              className="gold-fill inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-60"
            >
              {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
              Run Workflow
            </button>
            {latestRenderUrl && onSendResultToStudio ? (
              <button
                type="button"
                onClick={() => onSendResultToStudio(latestRenderUrl, "NodeEditorCanvas Render")}
                className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a] bg-[#d4b06a]/15 px-3 text-[11px] font-semibold text-[#f5dfaf] hover:bg-[#d4b06a]/25"
              >
                <Sparkles className="size-3" /> Send to Studio Plate
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Interactive Drag-and-Drop Canvas + SVG Line Drawing Layer */}
      <div
        ref={canvasRef}
        data-testid="node-editor-dropzone"
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedNodeId(null);
            setPendingWire(null);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          const kind = e.dataTransfer.getData("application/x-oriel-editor-node") as EditorNodeKind;
          if (!kind || !EDITOR_NODE_SPECS[kind]) return;
          const pt = toCanvasCoords(e.clientX, e.clientY);
          addNode(kind, { x: Math.max(8, pt.x - 110), y: Math.max(8, pt.y - 24) });
        }}
        className="relative h-[540px] w-full overflow-auto select-none bg-[#12100e]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(231, 194, 122, 0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="relative min-h-[540px] min-w-[820px]">
          {/* Simple SVG-based Line Drawing Implementation for Connections */}
          <svg
            data-testid="node-editor-svg-connections"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {connections.map((conn) => {
              const srcNode = nodeMap.get(conn.fromNodeId);
              const dstNode = nodeMap.get(conn.toNodeId);
              if (!srcNode || !dstNode) return null;
              const p1 = getEditorPortCoords(srcNode, "output", conn.fromPortId);
              const p2 = getEditorPortCoords(dstNode, "input", conn.toPortId);
              const line = buildSvgLineData(p1.x, p1.y, p2.x, p2.y);
              const srcPort = EDITOR_NODE_SPECS[srcNode.kind].outputs.find((p) => p.id === conn.fromPortId);
              const color = srcPort ? EDITOR_PORT_COLORS[srcPort.type] : "#e7c27a";
              const isHovered = hoveredConnId === conn.id;

              return (
                <g key={conn.id}>
                  <path
                    d={line.pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={14}
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => setHoveredConnId(conn.id)}
                    onMouseLeave={() => setHoveredConnId((prev) => (prev === conn.id ? null : prev))}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConnections((prev) => prev.filter((c) => c.id !== conn.id));
                    }}
                  />
                  <path
                    d={line.pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHovered ? 3.2 : 2.2}
                    strokeOpacity={isHovered ? 1 : 0.85}
                  />
                  {isHovered ? (
                    <g
                      className="pointer-events-auto cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConnections((prev) => prev.filter((c) => c.id !== conn.id));
                      }}
                    >
                      <circle cx={line.midX} cy={line.midY} r={9} fill="#14110f" stroke="#ef4444" strokeWidth={1.5} />
                      <line
                        x1={line.midX - 3}
                        y1={line.midY - 3}
                        x2={line.midX + 3}
                        y2={line.midY + 3}
                        stroke="#fca5a5"
                        strokeWidth={1.6}
                      />
                      <line
                        x1={line.midX + 3}
                        y1={line.midY - 3}
                        x2={line.midX - 3}
                        y2={line.midY + 3}
                        stroke="#fca5a5"
                        strokeWidth={1.6}
                      />
                    </g>
                  ) : null}
                </g>
              );
            })}

            {pendingWire && pendingStart ? (
              <line
                x1={pendingStart.x}
                y1={pendingStart.y}
                x2={pendingWire.cursorX}
                y2={pendingWire.cursorY}
                stroke={EDITOR_PORT_COLORS[pendingWire.portType]}
                strokeWidth={2.5}
                strokeDasharray="6 4"
              />
            ) : null}
          </svg>

          {/* Draggable Functional Architectural Nodes */}
          {nodes.map((node) => {
            const spec = EDITOR_NODE_SPECS[node.kind];
            const selected = selectedNodeId === node.id;
            const portRows = Math.max(spec.inputs.length, spec.outputs.length);
            const previewUrl = nodePreviews[node.id];

            return (
              <div
                key={node.id}
                data-testid={`editor-node-${node.kind}`}
                style={{ left: node.x, top: node.y, width: EDITOR_NODE_WIDTH }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                  dragStateRef.current = {
                    nodeId: node.id,
                    startClientX: e.clientX,
                    startClientY: e.clientY,
                    origX: node.x,
                    origY: node.y,
                  };
                }}
                className={cn(
                  "absolute rounded-2xl border bg-[#1c1915] text-xs text-[#f6efe4] shadow-[0_12px_28px_rgba(0,0,0,0.45)]",
                  selected ? "border-[#e7c27a] ring-1 ring-[#e7c27a]" : "border-white/15 hover:border-white/30",
                )}
              >
                {/* Node Header */}
                <div className="flex h-[40px] cursor-grab items-center justify-between gap-2 rounded-t-2xl border-b border-white/10 bg-white/5 px-3 active:cursor-grabbing">
                  <div className="flex min-w-0 items-center gap-1.5">
                    {node.kind === "image-input" ? (
                      <ImagePlus className="size-3.5 shrink-0 text-sky-400" />
                    ) : node.kind === "controlnet-config" ? (
                      <Sliders className="size-3.5 shrink-0 text-cyan-400" />
                    ) : node.kind === "prompt-modifier" ? (
                      <Type className="size-3.5 shrink-0 text-amber-400" />
                    ) : node.kind === "sam2-mask" ? (
                      <ScanSearch className="size-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Cpu className="size-3.5 shrink-0 text-[#e7c27a]" />
                    )}
                    <span className="truncate font-semibold">{node.title}</span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete ${node.title}`}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                    className="grid size-5 place-items-center rounded text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>

                {/* Port Connections Row */}
                <div className="py-3">
                  {Array.from({ length: portRows }).map((_, idx) => {
                    const inPort = spec.inputs[idx];
                    const outPort = spec.outputs[idx];
                    const compatible =
                      pendingWire &&
                      inPort &&
                      pendingWire.direction === "output" &&
                      pendingWire.nodeId !== node.id &&
                      canConnectEditorPorts(pendingWire.portType, inPort.type);

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                        style={{ height: EDITOR_PORT_ROW_HEIGHT }}
                      >
                        {inPort ? (
                          <button
                            type="button"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              const cur = pendingWireRef.current;
                              if (cur && cur.direction === "output") {
                                connectPorts(
                                  cur.nodeId,
                                  cur.portId,
                                  cur.portType,
                                  node.id,
                                  inPort.id,
                                  inPort.type,
                                );
                                setPendingWire(null);
                              } else {
                                const pt = getEditorPortCoords(node, "input", inPort.id);
                                setPendingWire({
                                  direction: "input",
                                  nodeId: node.id,
                                  portId: inPort.id,
                                  portType: inPort.type,
                                  cursorX: pt.x - 24,
                                  cursorY: pt.y,
                                });
                              }
                            }}
                            onPointerUp={(e) => {
                              e.stopPropagation();
                              const cur = pendingWireRef.current;
                              if (cur && cur.direction === "output") {
                                connectPorts(
                                  cur.nodeId,
                                  cur.portId,
                                  cur.portType,
                                  node.id,
                                  inPort.id,
                                  inPort.type,
                                );
                                setPendingWire(null);
                              }
                            }}
                            className="relative flex items-center gap-1.5 pl-3 text-[11px] text-[#cbbba6] hover:text-white"
                          >
                            <span
                              className={cn(
                                "absolute -left-[6px] size-3 rounded-full border border-[#14110f] transition-transform",
                                compatible && "scale-125 ring-2 ring-[#e7c27a]",
                              )}
                              style={{ backgroundColor: EDITOR_PORT_COLORS[inPort.type] }}
                            />
                            <span>
                              {inPort.label}
                              {inPort.required ? <span className="text-amber-400"> *</span> : null}
                            </span>
                          </button>
                        ) : (
                          <span />
                        )}

                        {outPort ? (
                          <button
                            type="button"
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              const cur = pendingWireRef.current;
                              if (cur && cur.direction === "input") {
                                connectPorts(
                                  node.id,
                                  outPort.id,
                                  outPort.type,
                                  cur.nodeId,
                                  cur.portId,
                                  cur.portType,
                                );
                                setPendingWire(null);
                              } else {
                                const pt = getEditorPortCoords(node, "output", outPort.id);
                                setPendingWire({
                                  direction: "output",
                                  nodeId: node.id,
                                  portId: outPort.id,
                                  portType: outPort.type,
                                  cursorX: pt.x + 28,
                                  cursorY: pt.y,
                                });
                              }
                            }}
                            onPointerUp={(e) => {
                              e.stopPropagation();
                              const cur = pendingWireRef.current;
                              if (cur && cur.direction === "input") {
                                connectPorts(
                                  node.id,
                                  outPort.id,
                                  outPort.type,
                                  cur.nodeId,
                                  cur.portId,
                                  cur.portType,
                                );
                                setPendingWire(null);
                              }
                            }}
                            className={cn(
                              "group relative flex items-center gap-1.5 pr-3 text-[11px] text-[#cbbba6] hover:text-white",
                            )}
                          >
                            <span>{outPort.label}</span>
                            <span
                              className={cn(
                                "absolute -right-[6px] size-3 rounded-full border border-[#14110f] transition-transform group-hover:scale-125",
                                pendingWire &&
                                  pendingWire.direction === "input" &&
                                  pendingWire.nodeId !== node.id &&
                                  canConnectEditorPorts(outPort.type, pendingWire.portType) &&
                                  "scale-125 ring-2 ring-[#e7c27a]",
                              )}
                              style={{ backgroundColor: EDITOR_PORT_COLORS[outPort.type] }}
                            />
                          </button>
                        ) : (
                          <span />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Inline Architectural Parameter Body */}
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className="space-y-1.5 border-t border-white/10 px-3 py-2 text-[11px]"
                >
                  {node.kind === "image-input" ? (
                    <>
                      <select
                        aria-label="Image input source"
                        value={String(node.config.source ?? "studio-active")}
                        onChange={(e) => updateNodeConfig(node.id, "source", e.target.value)}
                        className="h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none"
                      >
                        <option value="studio-active">Active Studio Frame</option>
                        <option value="sample">Sample Architectural Scene</option>
                      </select>
                      {node.config.source === "sample" ? (
                        <select
                          aria-label="Sample architectural scene"
                          value={String(node.config.customUrl ?? SAMPLE_SCENES[0].url)}
                          onChange={(e) => updateNodeConfig(node.id, "customUrl", e.target.value)}
                          className="h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none"
                        >
                          {SAMPLE_SCENES.map((s) => (
                            <option key={s.url} value={s.url}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      ) : null}
                      <label className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]">
                        <Upload className="size-3" /> Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(ev) => {
                            const f = ev.target.files?.[0];
                            if (f) {
                              void readImage(f, 1024).then((url) => {
                                updateNodeConfig(node.id, "source", "sample");
                                updateNodeConfig(node.id, "customUrl", url);
                              });
                            }
                            ev.target.value = "";
                          }}
                        />
                      </label>
                    </>
                  ) : null}

                  {node.kind === "controlnet-config" ? (
                    <>
                      <select
                        aria-label="ControlNet preprocessor"
                        value={String(node.config.preprocessor ?? "canny")}
                        onChange={(e) => updateNodeConfig(node.id, "preprocessor", e.target.value)}
                        className="h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none"
                      >
                        {CONTROLNET_MODES.map((m) => (
                          <option key={m} value={m}>
                            {m.toUpperCase()} Conditioning
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center justify-between gap-2 text-[10px] text-[#cbbba6]">
                        <span>Weight</span>
                        <input
                          type="range"
                          min={0.1}
                          max={1}
                          step={0.05}
                          value={Number(node.config.strength ?? 0.78)}
                          onChange={(e) => updateNodeConfig(node.id, "strength", Number(e.target.value))}
                          className="h-1 w-24 accent-[#d4b06a]"
                        />
                        <span className="font-mono text-[#e7c27a]">
                          {Number(node.config.strength ?? 0.78).toFixed(2)}
                        </span>
                      </label>
                    </>
                  ) : null}

                  {node.kind === "prompt-modifier" ? (
                    <>
                      <input
                        type="text"
                        aria-label="Prompt modifier text"
                        value={String(node.config.promptText ?? "")}
                        onChange={(e) => updateNodeConfig(node.id, "promptText", e.target.value)}
                        className="h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none"
                      />
                      <div className="flex items-center justify-between text-[10px] text-[#b9aa95]">
                        <span>Lighting: {String(node.config.lighting ?? "Golden Hour")}</span>
                      </div>
                    </>
                  ) : null}

                  {node.kind === "sam2-mask" ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-[#cbbba6]">
                        <span>{activeBinaryMask ? "Binary mask loaded" : "No binary mask yet"}</span>
                        {onOpenSam2Tool ? (
                          <button
                            type="button"
                            onClick={onOpenSam2Tool}
                            className="rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-200"
                          >
                            Click-to-Mask
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {node.kind === "render-engine" ? (
                    <div className="space-y-1.5">
                      <select
                        aria-label="Render Engine Mode"
                        value={String(node.config.engineMode ?? "hybrid")}
                        onChange={(e) => updateNodeConfig(node.id, "engineMode", e.target.value)}
                        className="h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none"
                      >
                        <option value="hybrid">Hybrid Fast Render</option>
                        <option value="cloud">Cloud AI Render</option>
                      </select>
                      <button
                        type="button"
                        disabled={running}
                        onClick={() => void handleRunWorkflow()}
                        className="gold-fill flex h-7 w-full items-center justify-center gap-1 rounded-full text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-60"
                      >
                        {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
                        Render Pipeline
                      </button>
                    </div>
                  ) : null}

                  {node.kind === "video-render" ? (
                    <div className="space-y-1.5">
                      <select
                        aria-label="Motion lighting preset"
                        value={String(node.config.preset ?? "Day → Golden → Midnight")}
                        onChange={(e) => updateNodeConfig(node.id, "preset", e.target.value)}
                        className="h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none"
                      >
                        <option value="Day → Golden → Midnight">Day → Golden → Midnight</option>
                        <option value="Morning → Solar Noon">Morning → Solar Noon</option>
                        <option value="4s Orbit-Dolly-Zoom">4s Orbit-Dolly-Zoom</option>
                      </select>
                      {onOpenStage ? (
                        <button
                          type="button"
                          onClick={() => onOpenStage("3d")}
                          className="w-full rounded-full border border-white/20 bg-white/5 py-1 text-[10px] text-[#f6efe4] hover:border-[#d4b06a]"
                        >
                          Open 3D Flythrough Rig
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {node.kind === "pano-360" ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-[#cbbba6]">
                        <span>FOV: {String(node.config.fov ?? 72)}°</span>
                        <span>Hotspots Ready</span>
                      </div>
                      {onOpenStage ? (
                        <button
                          type="button"
                          onClick={() => onOpenStage("360")}
                          className="gold-fill flex h-7 w-full items-center justify-center rounded-full text-[11px] font-semibold text-[#2a1c0c]"
                        >
                          Launch 360° Tour
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {node.kind === "glb-3d" ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-[#cbbba6]">
                        <span>Mood Frozen</span>
                        <span>GLB Sync</span>
                      </div>
                      {onOpenStage ? (
                        <button
                          type="button"
                          onClick={() => onOpenStage("3d")}
                          className="w-full rounded-full border border-white/20 bg-white/5 py-1 text-[10px] text-[#f6efe4] hover:border-[#d4b06a]"
                        >
                          Open 3D / GLB Stage
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={`${node.title} preview`}
                      className="mt-1 h-20 w-full rounded-lg border border-white/10 object-cover"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#191511] px-3 py-2 text-[11px] text-[#cbbba6]">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className={cn("size-3.5", validation.valid ? "text-emerald-400" : "text-amber-400")} />
          {validation.valid
            ? `SVG Pipeline Ready · ${nodes.length} nodes · ${connections.length} connections`
            : validation.issues[0]}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-[#b9aa95]">
          <Link2 className="size-3 text-[#e7c27a]" /> Click/drag output circle → input circle to wire · Click line to remove
        </span>
      </div>
    </div>
  );
}
