import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { NodeStudioCanvas } from "@/components/node-studio-canvas";
import { executeNodeWorkflow } from "@/lib/node-executor";
import {
  CATEGORY_META,
  NODE_CATALOG,
  WORKFLOW_TEMPLATES,
  autoLayoutGraph,
  createNodeInstance,
  getNodeSpec,
  matchesNodeSearch,
  validateWorkflowGraph,
  type NodeExecutionResult,
  type NodeSpec,
  type NodeWorkflow,
  type WorkflowEdge,
} from "@/lib/node-studio";
import { useHydrated, useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

const QUICK_PALETTE_TYPES: Array<{ type: string; badge: string }> = [
  { type: "input.load_image", badge: "Image Load" },
  { type: "conditioning.canny_edge", badge: "ControlNet Canny" },
  { type: "conditioning.depth_map", badge: "ControlNet Depth" },
  { type: "input.text_prompt", badge: "Prompt Modifier" },
  { type: "segmentation.text_select", badge: "Grounded-SAM 2" },
  { type: "editing.material_replace", badge: "Material Replace" },
  { type: "generation.image_to_image", badge: "Render Engine" },
  { type: "editing.relight", badge: "Relight" },
  { type: "output.compare_versions", badge: "Compare" },
];

export function NodeStudioEmbedded({
  onPromoteToStudio,
}: {
  onPromoteToStudio?: (imageUrl: string, title?: string) => void;
}) {
  const hydrated = useHydrated();
  const nodeWorkflows = useOriel((s) => s.nodeWorkflows);
  const activeNodeWorkflowId = useOriel((s) => s.activeNodeWorkflowId);
  const nodeExecutionMode = useOriel((s) => s.nodeExecutionMode);
  const setActiveNodeWorkflowId = useOriel((s) => s.setActiveNodeWorkflowId);
  const upsertNodeWorkflow = useOriel((s) => s.upsertNodeWorkflow);
  const createNodeWorkflowFromTemplate = useOriel((s) => s.createNodeWorkflowFromTemplate);
  const setNodeExecutionMode = useOriel((s) => s.setNodeExecutionMode);
  const addNodeRevision = useOriel((s) => s.addNodeRevision);

  const upload = useOriel((s) => s.upload);
  const plate = useOriel((s) => s.plate);
  const maskDataUrl = useOriel((s) => s.maskDataUrl);
  const setPlate = useOriel((s) => s.setPlate);
  const setUpload = useOriel((s) => s.setUpload);
  const design = useOriel((s) => s.design);
  const frame = useOriel((s) => s.frame);
  const engine = useOriel((s) => s.engine);
  const scene3d = useOriel((s) => s.scene3d);

  const activeWorkflow = useMemo(
    () =>
      nodeWorkflows.find((w) => w.id === activeNodeWorkflowId) ??
      nodeWorkflows[0] ??
      WORKFLOW_TEMPLATES[0],
    [nodeWorkflows, activeNodeWorkflowId],
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    activeWorkflow.nodes[0]?.id ?? null,
  );
  const [executionResults, setExecutionResults] = useState<Record<string, NodeExecutionResult>>({});
  const [running, setRunning] = useState(false);
  const [search, setSearch] = useState("");

  const validation = useMemo(
    () => validateWorkflowGraph(activeWorkflow.nodes, activeWorkflow.edges),
    [activeWorkflow.nodes, activeWorkflow.edges],
  );

  const selectedNode = useMemo(
    () => activeWorkflow.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [activeWorkflow.nodes, selectedNodeId],
  );
  const selectedSpec = selectedNode ? getNodeSpec(selectedNode.type) : undefined;

  const paletteItems = useMemo(() => {
    const q = search.trim();
    if (!q) {
      return QUICK_PALETTE_TYPES.map((item) => {
        const spec = getNodeSpec(item.type);
        return spec ? { spec, display: item.badge } : null;
      }).filter((x): x is { spec: NodeSpec; display: string } => Boolean(x));
    }
    return NODE_CATALOG.filter((spec) => matchesNodeSearch(spec, q))
      .slice(0, 12)
      .map((spec) => ({ spec, display: spec.title }));
  }, [search]);

  const latestOutputUrl = useMemo(() => {
    for (const id of [...validation.executionOrder].reverse()) {
      const res = executionResults[id];
      if (res?.imageUrl) return res.imageUrl;
    }
    return undefined;
  }, [validation.executionOrder, executionResults]);

  function commitWorkflow(next: NodeWorkflow) {
    upsertNodeWorkflow(next);
  }

  function handleAddNode(spec: NodeSpec, position?: { x: number; y: number }) {
    let pos = position;
    if (!pos) {
      if (activeWorkflow.nodes.length === 0) {
        pos = { x: 80, y: 100 };
      } else {
        const minX = Math.min(...activeWorkflow.nodes.map((n) => n.position.x));
        const maxY = Math.max(...activeWorkflow.nodes.map((n) => n.position.y));
        const extraCols = activeWorkflow.nodes.filter((n) => n.position.y >= maxY - 40).length;
        pos = {
          x: minX + (extraCols % 3) * 280,
          y: maxY + 210,
        };
      }
    }
    const instance = createNodeInstance(spec.type, pos);
    commitWorkflow({
      ...activeWorkflow,
      nodes: [...activeWorkflow.nodes, instance],
    });
    setSelectedNodeId(instance.id);
    toast.message(`Added ${spec.title} node`);
  }

  function handleMoveNode(nodeId: string, position: { x: number; y: number }) {
    commitWorkflow({
      ...activeWorkflow,
      nodes: activeWorkflow.nodes.map((n) => (n.id === nodeId ? { ...n, position } : n)),
    });
  }

  function handleAddEdge(edge: Omit<WorkflowEdge, "id">) {
    const filtered = activeWorkflow.edges.filter(
      (e) => !(e.targetNodeId === edge.targetNodeId && e.targetPortId === edge.targetPortId),
    );
    const created: WorkflowEdge = {
      ...edge,
      id: `edge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    };
    commitWorkflow({
      ...activeWorkflow,
      edges: [...filtered, created],
    });
  }

  function handleRemoveEdge(edgeId: string) {
    commitWorkflow({
      ...activeWorkflow,
      edges: activeWorkflow.edges.filter((e) => e.id !== edgeId),
    });
  }

  function handleDeleteNode(nodeId: string) {
    commitWorkflow({
      ...activeWorkflow,
      nodes: activeWorkflow.nodes.filter((n) => n.id !== nodeId),
      edges: activeWorkflow.edges.filter(
        (e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId,
      ),
    });
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }

  function handleAutoLayout() {
    commitWorkflow({
      ...activeWorkflow,
      nodes: autoLayoutGraph(activeWorkflow.nodes, activeWorkflow.edges),
    });
    toast.success("Auto-layout applied");
  }

  function handleUpdateNodeParam(
    nodeId: string,
    key: string,
    value: string | number | boolean,
  ) {
    commitWorkflow({
      ...activeWorkflow,
      nodes: activeWorkflow.nodes.map((n) =>
        n.id === nodeId ? { ...n, params: { ...n.params, [key]: value } } : n,
      ),
    });
  }

  function handleLoadTemplate(templateId: string) {
    const existing = nodeWorkflows.find((w) => w.id === templateId);
    if (existing) {
      setActiveNodeWorkflowId(existing.id);
      setSelectedNodeId(existing.nodes[0]?.id ?? null);
    } else {
      const created = createNodeWorkflowFromTemplate(templateId);
      setSelectedNodeId(created.nodes[0]?.id ?? null);
    }
    setExecutionResults({});
  }

  function handleSyncStudioFrame() {
    const activeSrc = plate?.url || upload;
    if (!activeSrc) {
      toast.message("Upload or generate a render first to sync it into Load Image.");
      return;
    }
    commitWorkflow({
      ...activeWorkflow,
      nodes: activeWorkflow.nodes.map((n) =>
        n.type === "input.load_image"
          ? { ...n, params: { ...n.params, source: "__studio_active__", customUrl: activeSrc } }
          : n,
      ),
    });
    toast.success("Synced active Studio render into Load Image nodes");
  }

  function syncPlateToStudio(url: string, title?: string) {
    setUpload(url);
    setPlate({
      url,
      upload: upload ?? undefined,
      templateId: engine.workflowPreset,
      idea: title ? `Node Pipeline: ${title}` : `Node Pipeline (${activeWorkflow.name})`,
    });
  }

  function promoteResult(url: string, title?: string) {
    syncPlateToStudio(url, title);
    if (onPromoteToStudio) {
      onPromoteToStudio(url, title);
      return;
    }
    toast.success("Node output promoted to Studio Plate");
  }

  async function handleRunWorkflow() {
    if (running) return;
    if (!validation.valid) {
      toast.error(validation.issues[0]?.message || "Fix disconnected required inputs before running.");
      return;
    }
    setRunning(true);
    setExecutionResults({});
    const activeSrc = plate?.url || upload || "/viz/t03-compact-living-room.jpg";
    try {
      const outcome = await executeNodeWorkflow(
        activeWorkflow,
        nodeExecutionMode,
        {
          activeImageUrl: activeSrc,
          activeMaskUrl: maskDataUrl,
          design,
          frame,
          engine,
          scene3d,
          onAssetPromoted: (img, title) => syncPlateToStudio(img, title),
        },
        (nodeId, res) => {
          setExecutionResults((prev) => ({ ...prev, [nodeId]: res }));
        },
      );
      const compareRes = Object.values(outcome.results).find(
        (r) => typeof r.diffOutsideMaskPct === "number",
      );
      addNodeRevision({
        workflowId: activeWorkflow.id,
        label: `${activeWorkflow.name} Studio Run`,
        mode: nodeExecutionMode,
        nodeCount: activeWorkflow.nodes.length,
        edgeCount: activeWorkflow.edges.length,
        outputPreviewUrl: outcome.finalImageUrl,
        diffOutsideMaskPct: compareRes?.diffOutsideMaskPct,
        snapshot: activeWorkflow,
      });
      toast.success("Node pipeline executed cleanly");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Workflow run failed.");
    } finally {
      setRunning(false);
    }
  }

  const primaryParam = selectedSpec?.params[0];

  return (
    <div data-testid="embedded-node-studio" className="flex flex-col bg-[#14110f] text-[#f6efe4]">
      {/* Top Workflow & Drag-and-Drop Functional Nodes Strip */}
      <div className="space-y-2 border-b border-white/10 bg-[#191511] px-3 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-[#e7c27a] uppercase">
              <WorkflowIcon className="size-3.5" /> Visual Node Graph
            </span>
            <select
              aria-label="Embedded workflow template"
              value={activeWorkflow.id}
              onChange={(e) => handleLoadTemplate(e.target.value)}
              className="h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]"
            >
              {WORKFLOW_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
              {nodeWorkflows
                .filter((w) => !WORKFLOW_TEMPLATES.some((t) => t.id === w.id))
                .map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
            </select>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-[#b9aa95]" />
              <input
                type="text"
                aria-label="Search architectural nodes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find node (Image Load, ControlNet...)"
                className="h-7 w-48 rounded-full border border-white/15 bg-black/45 pr-2.5 pl-7 text-[11px] text-[#f6efe4] outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <select
              aria-label="Node execution engine mode"
              value={nodeExecutionMode}
              onChange={(e) => setNodeExecutionMode(e.target.value as "local" | "cloud" | "hybrid")}
              className="h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]"
            >
              <option value="local">Local Preview</option>
              <option value="hybrid">Hybrid Smart</option>
              <option value="cloud">Cloud Gen</option>
            </select>

            <button
              type="button"
              onClick={handleSyncStudioFrame}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a]"
            >
              <RefreshCw className="size-3 text-[#e7c27a]" /> Sync Frame
            </button>

            <button
              type="button"
              disabled={running}
              onClick={() => void handleRunWorkflow()}
              className="gold-fill inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-60"
            >
              {running ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
              Run Graph
            </button>

            <Link
              to="/nodes"
              className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 px-2.5 text-[11px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25"
            >
              Full Editor <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Draggable Node Palette Chips */}
        <div
          data-testid="embedded-node-palette"
          className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5 md:flex-wrap md:overflow-x-visible"
        >
          <span className="shrink-0 font-mono text-[10px] text-[#b9aa95] uppercase">
            Drag or Click Node:
          </span>
          {paletteItems.map(({ spec, display }) => {
            const cat = CATEGORY_META[spec.category];
            return (
              <button
                key={spec.type}
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/x-oriel-node", spec.type);
                  e.dataTransfer.effectAllowed = "copy";
                }}
                onClick={() => handleAddNode(spec)}
                title={`Drag onto canvas or click to add ${spec.title}`}
                className="inline-flex h-7 shrink-0 cursor-grab items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#f0e6d8] transition hover:border-[#d4b06a] hover:bg-white/10 active:cursor-grabbing"
              >
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: cat.accent }}
                />
                <span>{display}</span>
                <Plus className="size-3 text-[#e7c27a]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive DAG Canvas */}
      <div className="relative h-[440px] w-full md:h-[500px]">
        <NodeStudioCanvas
          workflowId={activeWorkflow.id}
          nodes={activeWorkflow.nodes}
          edges={activeWorkflow.edges}
          selectedNodeId={selectedNodeId}
          executionResults={executionResults}
          onSelectNode={setSelectedNodeId}
          onMoveNode={handleMoveNode}
          onAddEdge={handleAddEdge}
          onRemoveEdge={handleRemoveEdge}
          onDeleteNode={handleDeleteNode}
          onDropNewNode={(type, pos) => {
            const spec = getNodeSpec(type);
            if (spec) handleAddNode(spec, pos);
          }}
          onAutoLayout={handleAutoLayout}
        />
      </div>

      {/* Inline Selected Node Inspector + Output Promote Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#191511] px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 font-mono text-[10px]",
              validation.valid ? "text-emerald-300" : "text-amber-300",
            )}
          >
            <CheckCircle2 className="size-3" />
            {validation.valid
              ? `Valid DAG (${activeWorkflow.nodes.length}N · ${activeWorkflow.edges.length}E${hydrated ? ` · ${validation.durationMs}ms` : ""})`
              : validation.issues[0]?.message || "Check disconnected ports"}
          </span>

          {selectedNode && selectedSpec ? (
            <div className="flex flex-wrap items-center gap-2 border-l border-white/15 pl-2.5">
              <span className="font-semibold text-[#e7c27a]">{selectedSpec.title}:</span>
              {primaryParam ? (
                primaryParam.kind === "select" ? (
                  <select
                    aria-label={primaryParam.label}
                    value={String(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue)}
                    onChange={(e) =>
                      handleUpdateNodeParam(selectedNode.id, primaryParam.key, e.target.value)
                    }
                    className="h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]"
                  >
                    {primaryParam.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : primaryParam.kind === "slider" || primaryParam.kind === "number" ? (
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-[#d5cab9]">
                    <span>{primaryParam.label}</span>
                    <input
                      type="range"
                      min={primaryParam.min ?? 0}
                      max={primaryParam.max ?? 100}
                      step={primaryParam.step ?? 1}
                      value={Number(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue)}
                      onChange={(e) =>
                        handleUpdateNodeParam(
                          selectedNode.id,
                          primaryParam.key,
                          Number(e.target.value),
                        )
                      }
                      className="h-1 w-20 accent-[#d4b06a]"
                    />
                    <span className="font-mono text-[10px] text-[#e7c27a]">
                      {String(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue)}
                    </span>
                  </label>
                ) : primaryParam.kind === "text" || primaryParam.kind === "textarea" ? (
                  <input
                    type="text"
                    aria-label={primaryParam.label}
                    value={String(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue)}
                    onChange={(e) =>
                      handleUpdateNodeParam(selectedNode.id, primaryParam.key, e.target.value)
                    }
                    className="h-7 w-56 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]"
                  />
                ) : null
              ) : (
                <span className="text-[11px] text-[#b9aa95]">{selectedSpec.summary}</span>
              )}
            </div>
          ) : null}
        </div>

        {latestOutputUrl ? (
          <button
            type="button"
            onClick={() => promoteResult(latestOutputUrl, selectedSpec?.title)}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a] bg-[#d4b06a]/15 px-3 text-[11px] font-semibold text-[#f5dfaf] hover:bg-[#d4b06a]/25"
          >
            <Sparkles className="size-3" /> Send Output to Studio Plate
          </button>
        ) : null}
      </div>
    </div>
  );
}
