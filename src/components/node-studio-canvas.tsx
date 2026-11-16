import { AlertCircle, CheckCircle2, LayoutGrid, Loader2, Maximize2, Minus, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORY_META,
  PORT_COLORS,
  getNodeSpec,
  isPortCompatible,
  type NodeExecutionResult,
  type PortType,
  type WorkflowEdge,
  type WorkflowNodeInstance,
} from "@/lib/node-studio";
import { cn } from "@/lib/utils";

const NODE_WIDTH = 248;
const PORT_TOP_OFFSET = 46;
const PORT_ROW_H = 24;

interface NodeStudioCanvasProps {
  workflowId?: string;
  nodes: WorkflowNodeInstance[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  executionResults: Record<string, NodeExecutionResult>;
  onSelectNode: (nodeId: string | null) => void;
  onMoveNode: (nodeId: string, position: { x: number; y: number }) => void;
  onAddEdge: (edge: Omit<WorkflowEdge, "id">) => void;
  onRemoveEdge: (edgeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDropNewNode: (type: string, position: { x: number; y: number }) => void;
  onAutoLayout: () => void;
}

function getPortPosition(
  node: WorkflowNodeInstance,
  kind: "input" | "output",
  portId: string,
): { x: number; y: number } {
  const spec = getNodeSpec(node.type);
  const list = kind === "input" ? spec?.inputs ?? [] : spec?.outputs ?? [];
  const idx = Math.max(0, list.findIndex((p) => p.id === portId));
  return {
    x: kind === "input" ? node.position.x : node.position.x + NODE_WIDTH,
    y: node.position.y + PORT_TOP_OFFSET + idx * PORT_ROW_H + PORT_ROW_H / 2,
  };
}

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dx = Math.max(54, Math.abs(x2 - x1) * 0.52);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export function NodeStudioCanvas({
  workflowId,
  nodes,
  edges,
  selectedNodeId,
  executionResults,
  onSelectNode,
  onMoveNode,
  onAddEdge,
  onRemoveEdge,
  onDeleteNode,
  onDropNewNode,
  onAutoLayout,
}: NodeStudioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 24, y: 24 });
  const [zoom, setZoom] = useState(0.84);

  const [draggingNode, setDraggingNode] = useState<{
    id: string;
    startPointerX: number;
    startPointerY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const [panning, setPanning] = useState<{
    startPointerX: number;
    startPointerY: number;
    origPanX: number;
    origPanY: number;
  } | null>(null);

  const [pendingWire, setPendingWire] = useState<{
    sourceNodeId: string;
    sourcePortId: string;
    sourceType: PortType;
    cursorX: number;
    cursorY: number;
  } | null>(null);

  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  function clientToWorld(clientX: number, clientY: number): { x: number; y: number } {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }

  function fitView() {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || nodes.length === 0) {
      setPan({ x: 24, y: 24 });
      setZoom(0.85);
      return;
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + NODE_WIDTH);
      maxY = Math.max(maxY, n.position.y + 185);
    }
    const graphW = Math.max(320, maxX - minX + 70);
    const graphH = Math.max(220, maxY - minY + 70);
    const nextZoom = Math.max(0.35, Math.min(1.05, Math.min(rect.width / graphW, rect.height / graphH)));
    setZoom(Number(nextZoom.toFixed(2)));
    setPan({
      x: Math.round((rect.width - (maxX - minX) * nextZoom) / 2 - minX * nextZoom),
      y: Math.round((rect.height - (maxY - minY) * nextZoom) / 2 - minY * nextZoom),
    });
  }

  useEffect(() => {
    const id = requestAnimationFrame(() => fitView());
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") {
      return () => cancelAnimationFrame(id);
    }
    let settled = false;
    const ro = new ResizeObserver(() => {
      if (!settled && el.clientWidth > 0 && el.clientHeight > 0) {
        settled = true;
        fitView();
      }
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowId, nodes.length === 0]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (e.key === "Escape") {
        setPendingWire(null);
      }
      if ((e.key === "Delete" || e.key === "Backspace") && !typing && selectedNodeId) {
        e.preventDefault();
        onDeleteNode(selectedNodeId);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedNodeId, onDeleteNode]);

  function handlePointerMove(e: React.PointerEvent) {
    if (draggingNode) {
      const dx = (e.clientX - draggingNode.startPointerX) / zoom;
      const dy = (e.clientY - draggingNode.startPointerY) / zoom;
      onMoveNode(draggingNode.id, {
        x: Math.round(draggingNode.origX + dx),
        y: Math.round(draggingNode.origY + dy),
      });
      return;
    }
    if (panning) {
      setPan({
        x: panning.origPanX + (e.clientX - panning.startPointerX),
        y: panning.origPanY + (e.clientY - panning.startPointerY),
      });
      return;
    }
    if (pendingWire) {
      const world = clientToWorld(e.clientX, e.clientY);
      setPendingWire((prev) => (prev ? { ...prev, cursorX: world.x, cursorY: world.y } : null));
    }
  }

  function handlePointerUp() {
    setDraggingNode(null);
    setPanning(null);
  }

  const pendingSourcePos = useMemo(() => {
    if (!pendingWire) return null;
    const node = nodeMap.get(pendingWire.sourceNodeId);
    if (!node) return null;
    return getPortPosition(node, "output", pendingWire.sourcePortId);
  }, [pendingWire, nodeMap]);

  return (
    <div
      ref={containerRef}
      data-testid="node-studio-canvas"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvasBg === "true") {
          setPendingWire(null);
          onSelectNode(null);
          setPanning({
            startPointerX: e.clientX,
            startPointerY: e.clientY,
            origPanX: pan.x,
            origPanY: pan.y,
          });
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const nodeType = e.dataTransfer.getData("application/x-oriel-node");
        if (!nodeType) return;
        const pos = clientToWorld(e.clientX, e.clientY);
        onDropNewNode(nodeType, { x: Math.round(pos.x - 120), y: Math.round(pos.y - 30) });
      }}
      onWheel={(e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.06 : 0.06;
          setZoom((z) => Math.max(0.35, Math.min(1.5, Number((z + delta).toFixed(2)))));
        }
      }}
      className="relative h-full w-full overflow-clip bg-[#14110f] select-none touch-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(231, 194, 122, 0.16) 1px, transparent 1px)",
        backgroundSize: `${Math.round(24 * zoom)}px ${Math.round(24 * zoom)}px`,
        backgroundPosition: `${pan.x}px ${pan.y}px`,
      }}
    >
      {/* Top-Left Hint */}
      <div
        data-canvas-bg="true"
        className="pointer-events-none absolute top-3 left-3 z-20 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-xl border border-white/10 bg-[#1c1915]/90 px-3 py-1.5 text-[11px] text-[#cbbba6]"
      >
        <span className="truncate">Drag nodes to reposition · Click output port then input port to wire</span>
        {pendingWire ? (
          <span className="shrink-0 font-semibold text-[#e7c27a]">
            · Connecting {pendingWire.sourceType} (Esc to cancel)
          </span>
        ) : null}
      </div>

      {/* Bottom-Left Canvas Viewport Controls */}
      <div
        className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-xl border border-white/15 bg-[#1c1915]/95 p-1 text-[#f6efe4] shadow-lg"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.35, Number((z - 0.1).toFixed(2))))}
          aria-label="Zoom out"
          className="grid size-7 place-items-center rounded-lg hover:bg-white/10"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="min-w-11 text-center font-mono text-[11px] tabular-nums text-[#e7c27a]">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
          aria-label="Zoom in"
          className="grid size-7 place-items-center rounded-lg hover:bg-white/10"
        >
          <Plus className="size-3.5" />
        </button>
        <div className="mx-0.5 h-4 w-px bg-white/15" />
        <button
          type="button"
          onClick={fitView}
          className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] hover:bg-white/10"
        >
          <Maximize2 className="size-3" /> Fit
        </button>
        <button
          type="button"
          onClick={onAutoLayout}
          className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] hover:bg-white/10"
        >
          <LayoutGrid className="size-3" /> Auto-Layout
        </button>
      </div>

      {/* World Coordinate Transform Layer */}
      <div
        data-canvas-bg="true"
        className="absolute top-0 left-0 origin-top-left"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: "3200px",
          height: "2000px",
        }}
      >
        {/* SVG Edges Layer */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {edges.map((edge) => {
            const srcNode = nodeMap.get(edge.sourceNodeId);
            const dstNode = nodeMap.get(edge.targetNodeId);
            if (!srcNode || !dstNode) return null;
            const p1 = getPortPosition(srcNode, "output", edge.sourcePortId);
            const p2 = getPortPosition(dstNode, "input", edge.targetPortId);
            const srcSpec = getNodeSpec(srcNode.type);
            const srcPort = srcSpec?.outputs.find((p) => p.id === edge.sourcePortId);
            const strokeColor = srcPort ? PORT_COLORS[srcPort.type] : "#e7c27a";
            const d = bezierPath(p1.x, p1.y, p2.x, p2.y);
            const isHovered = hoveredEdgeId === edge.id;
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={edge.id}>
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={16}
                  className="pointer-events-auto cursor-pointer"
                  onMouseEnter={() => setHoveredEdgeId(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId((prev) => (prev === edge.id ? null : prev))}
                />
                <path
                  d={d}
                  fill="none"
                  stroke={strokeColor}
                  strokeOpacity={isHovered ? 1 : 0.78}
                  strokeWidth={isHovered ? 3.2 : 2.3}
                />
                {isHovered ? (
                  <g
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => setHoveredEdgeId(edge.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveEdge(edge.id);
                    }}
                  >
                    <circle cx={midX} cy={midY} r={10} fill="#14110f" stroke="#ef4444" strokeWidth={1.5} />
                    <path
                      d={`M ${midX - 3.5} ${midY - 3.5} L ${midX + 3.5} ${midY + 3.5} M ${midX + 3.5} ${midY - 3.5} L ${midX - 3.5} ${midY + 3.5}`}
                      stroke="#fca5a5"
                      strokeWidth={1.6}
                    />
                  </g>
                ) : null}
              </g>
            );
          })}

          {pendingWire && pendingSourcePos ? (
            <path
              d={bezierPath(
                pendingSourcePos.x,
                pendingSourcePos.y,
                pendingWire.cursorX,
                pendingWire.cursorY,
              )}
              fill="none"
              stroke={PORT_COLORS[pendingWire.sourceType]}
              strokeDasharray="6 4"
              strokeWidth={2.5}
            />
          ) : null}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => {
          const spec = getNodeSpec(node.type);
          if (!spec) return null;
          const catMeta = CATEGORY_META[spec.category];
          const exec = executionResults[node.id];
          const selected = selectedNodeId === node.id;
          const portRows = Math.max(spec.inputs.length, spec.outputs.length);

          return (
            <div
              key={node.id}
              data-testid={`workflow-node-${node.id}`}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: NODE_WIDTH,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
                setDraggingNode({
                  id: node.id,
                  startPointerX: e.clientX,
                  startPointerY: e.clientY,
                  origX: node.position.x,
                  origY: node.position.y,
                });
              }}
              className={cn(
                "absolute rounded-2xl border bg-[#1c1915] text-[#f6efe4] shadow-[0_14px_30px_rgba(0,0,0,0.45)] transition-colors",
                selected
                  ? "border-[#e7c27a] ring-1 ring-[#e7c27a]"
                  : "border-white/15 hover:border-white/30",
              )}
            >
              {/* Node Header */}
              <div
                className="flex h-[38px] items-center justify-between gap-2 rounded-t-2xl border-b border-white/10 px-3 cursor-grab active:cursor-grabbing"
                style={{ backgroundColor: catMeta.badgeBg }}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: catMeta.accent }}
                  />
                  <span className="truncate text-xs font-semibold text-[#f6efe4]">
                    {node.label || spec.title}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {exec?.status === "running" ? (
                    <Loader2 className="size-3.5 animate-spin text-[#e7c27a]" />
                  ) : exec?.status === "completed" ? (
                    <CheckCircle2 className="size-3.5 text-[#4ade80]" />
                  ) : exec?.status === "error" ? (
                    <AlertCircle className="size-3.5 text-[#f87171]" />
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Delete ${spec.title}`}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                    }}
                    className="grid size-5 place-items-center rounded text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>

              {/* Ports Row Table */}
              <div
                className="relative"
                style={{
                  minHeight: Math.max(28, portRows * PORT_ROW_H + 14),
                  paddingTop: 8,
                  paddingBottom: 6,
                }}
              >
                {Array.from({ length: portRows }).map((_, idx) => {
                  const inPort = spec.inputs[idx];
                  const outPort = spec.outputs[idx];
                  const canDropWire =
                    pendingWire &&
                    inPort &&
                    pendingWire.sourceNodeId !== node.id &&
                    isPortCompatible(pendingWire.sourceType, inPort.type);

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                      style={{ height: PORT_ROW_H }}
                    >
                      {/* Input Port */}
                      {inPort ? (
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (pendingWire) {
                              if (
                                pendingWire.sourceNodeId !== node.id &&
                                isPortCompatible(pendingWire.sourceType, inPort.type)
                              ) {
                                onAddEdge({
                                  sourceNodeId: pendingWire.sourceNodeId,
                                  sourcePortId: pendingWire.sourcePortId,
                                  targetNodeId: node.id,
                                  targetPortId: inPort.id,
                                });
                              }
                              setPendingWire(null);
                            }
                          }}
                          className="group relative flex items-center gap-1.5 pl-3 text-left text-[11px] text-[#cbbba6] hover:text-white"
                        >
                          <span
                            className={cn(
                              "absolute -left-[6px] size-3 rounded-full border border-[#14110f] transition-transform",
                              canDropWire && "scale-125 ring-2 ring-[#e7c27a]",
                            )}
                            style={{ backgroundColor: PORT_COLORS[inPort.type] }}
                          />
                          <span>
                            {inPort.label}
                            {inPort.required ? <span className="text-[#fb923c]"> *</span> : null}
                          </span>
                        </button>
                      ) : (
                        <span />
                      )}

                      {/* Output Port */}
                      {outPort ? (
                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            const pos = getPortPosition(node, "output", outPort.id);
                            setPendingWire({
                              sourceNodeId: node.id,
                              sourcePortId: outPort.id,
                              sourceType: outPort.type,
                              cursorX: pos.x + 40,
                              cursorY: pos.y,
                            });
                          }}
                          className="group relative flex items-center gap-1.5 pr-3 text-right text-[11px] text-[#cbbba6] hover:text-white"
                        >
                          <span>{outPort.label}</span>
                          <span
                            className="absolute -right-[6px] size-3 rounded-full border border-[#14110f] transition-transform group-hover:scale-125"
                            style={{ backgroundColor: PORT_COLORS[outPort.type] }}
                          />
                        </button>
                      ) : (
                        <span />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Execution Thumbnail / Status Body */}
              {exec?.imageUrl || exec?.summary || exec?.error ? (
                <div className="border-t border-white/10 px-3 py-2 text-[11px]">
                  {exec.imageUrl ? (
                    <img
                      src={exec.imageUrl}
                      alt={spec.title}
                      className="mb-1.5 h-24 w-full rounded-lg border border-white/10 object-cover"
                    />
                  ) : null}
                  {exec.error ? (
                    <p className="text-[#fca5a5]">{exec.error}</p>
                  ) : exec.summary ? (
                    <div className="flex items-center justify-between gap-2 text-[#d5cab9]">
                      <span className="truncate">{exec.summary}</span>
                      {typeof exec.durationMs === "number" ? (
                        <span className="shrink-0 font-mono text-[10px] tabular-nums text-[#e7c27a]">
                          {exec.durationMs}ms
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Empty canvas CTA */}
      {nodes.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
          <div className="rounded-2xl border border-white/15 bg-[#1c1915]/95 px-6 py-5 text-sm text-[#f6efe4]">
            <p className="font-serif text-lg">Empty Node Graph</p>
            <p className="mt-1 text-xs text-[#cbbba6]">
              Click any node in the left palette or load one of the 4 ArchViz templates.
            </p>
          </div>
        </div>
      ) : null}

      {pendingWire ? (
        <button
          type="button"
          onClick={() => setPendingWire(null)}
          className="absolute top-3 right-3 z-20 inline-flex h-8 items-center gap-1 rounded-xl border border-[#e7c27a]/60 bg-[#1c1915] px-2.5 text-xs text-[#e7c27a]"
        >
          <X className="size-3.5" /> Cancel Wire
        </button>
      ) : null}
    </div>
  );
}
