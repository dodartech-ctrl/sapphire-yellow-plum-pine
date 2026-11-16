import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Cpu,
  Loader2,
  Play,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { NodeStudioCanvas } from "@/components/node-studio-canvas";
import { NodeStudioInspector } from "@/components/node-studio-inspector";
import { NodeStudioSidebar } from "@/components/node-studio-sidebar";
import { executeNodeWorkflow } from "@/lib/node-executor";
import {
  WORKFLOW_TEMPLATES,
  autoLayoutGraph,
  cloneWorkflow,
  createNodeInstance,
  getNodeSpec,
  validateWorkflowGraph,
  type ExecutionMode,
  type NodeExecutionResult,
  type NodeSpec,
  type NodeWorkflow,
  type WorkflowEdge,
} from "@/lib/node-studio";
import { useHydrated, useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nodes")({
  component: NodeStudioPage,
});

function NodeStudioPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();

  const nodeWorkflows = useOriel((s) => s.nodeWorkflows);
  const activeNodeWorkflowId = useOriel((s) => s.activeNodeWorkflowId);
  const nodeExecutionMode = useOriel((s) => s.nodeExecutionMode);
  const nodeRevisions = useOriel((s) => s.nodeRevisions);
  const setActiveNodeWorkflowId = useOriel((s) => s.setActiveNodeWorkflowId);
  const upsertNodeWorkflow = useOriel((s) => s.upsertNodeWorkflow);
  const createNodeWorkflowFromTemplate = useOriel((s) => s.createNodeWorkflowFromTemplate);
  const setNodeExecutionMode = useOriel((s) => s.setNodeExecutionMode);
  const addNodeRevision = useOriel((s) => s.addNodeRevision);
  const restoreNodeRevision = useOriel((s) => s.restoreNodeRevision);

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
  const [mobilePane, setMobilePane] = useState<"palette" | "canvas" | "inspector">("canvas");

  const validation = useMemo(
    () => validateWorkflowGraph(activeWorkflow.nodes, activeWorkflow.edges),
    [activeWorkflow.nodes, activeWorkflow.edges],
  );

  const selectedNode = useMemo(
    () => activeWorkflow.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [activeWorkflow.nodes, selectedNodeId],
  );

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
    const offset = activeWorkflow.nodes.length * 24;
    const pos = position ?? {
      x: 120 + (offset % 260),
      y: 120 + (offset % 180),
    };
    const instance = createNodeInstance(spec.type, pos);
    commitWorkflow({
      ...activeWorkflow,
      nodes: [...activeWorkflow.nodes, instance],
    });
    setSelectedNodeId(instance.id);
    setMobilePane("canvas");
    toast.message(`Added ${spec.title}`);
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

  function handleUpdateNodeLabel(nodeId: string, label: string) {
    commitWorkflow({
      ...activeWorkflow,
      nodes: activeWorkflow.nodes.map((n) => (n.id === nodeId ? { ...n, label } : n)),
    });
  }

  function handleAutoLayout() {
    commitWorkflow({
      ...activeWorkflow,
      nodes: autoLayoutGraph(activeWorkflow.nodes, activeWorkflow.edges),
    });
    toast.success("DAG auto-layout applied");
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
    setMobilePane("canvas");
    toast.success("Loaded architectural node template");
  }

  function handleSyncFromStudio() {
    const activeSrc = plate?.url || upload;
    if (!activeSrc) {
      toast.message("Open or upload an image in AI Studio first, then sync here.");
      return;
    }
    const updatedNodes = activeWorkflow.nodes.map((n) => {
      if (n.type === "input.load_image") {
        return { ...n, params: { ...n.params, source: "__studio_active__", customUrl: activeSrc } };
      }
      return n;
    });
    commitWorkflow({ ...activeWorkflow, nodes: updatedNodes });
    toast.success("Synced active AI Studio image & mask into Load Image nodes");
  }

  function promoteImageToStudio(imageUrl: string, title?: string) {
    setUpload(imageUrl);
    setPlate({
      url: imageUrl,
      upload: upload ?? undefined,
      templateId: engine.workflowPreset,
      idea: title ? `Node Studio: ${title}` : `Node Studio (${activeWorkflow.name})`,
    });
    toast.success("Result promoted to Studio Plate");
  }

  async function handleRunWorkflow() {
    if (running) return;
    if (!validation.valid) {
      toast.error(validation.issues[0]?.message || "Fix graph validation errors before running.");
      setMobilePane("inspector");
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
          onAssetPromoted: (img, title) => promoteImageToStudio(img, title),
        },
        (nodeId, res) => {
          setExecutionResults((prev) => ({ ...prev, [nodeId]: res }));
        },
      );

      const compareNodeResult = Object.values(outcome.results).find(
        (r) => typeof r.diffOutsideMaskPct === "number",
      );

      addNodeRevision({
        workflowId: activeWorkflow.id,
        label: `${activeWorkflow.name} Run`,
        mode: nodeExecutionMode,
        nodeCount: activeWorkflow.nodes.length,
        edgeCount: activeWorkflow.edges.length,
        outputPreviewUrl: outcome.finalImageUrl,
        diffOutsideMaskPct: compareNodeResult?.diffOutsideMaskPct,
        snapshot: cloneWorkflow(activeWorkflow),
      });

      if (outcome.ok) {
        toast.success(`Executed ${activeWorkflow.nodes.length} nodes cleanly`);
      } else {
        toast.warning(outcome.issues[0] || "Pipeline completed with warnings.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Workflow execution failed.");
    } finally {
      setRunning(false);
    }
  }

  function handleSaveRevision() {
    addNodeRevision({
      workflowId: activeWorkflow.id,
      label: `${activeWorkflow.name} Snapshot`,
      mode: nodeExecutionMode,
      nodeCount: activeWorkflow.nodes.length,
      edgeCount: activeWorkflow.edges.length,
      outputPreviewUrl: latestOutputUrl,
      snapshot: cloneWorkflow(activeWorkflow),
    });
    toast.success("Saved non-destructive graph snapshot");
  }

  function handleImportJson(raw: string) {
    try {
      const parsed = JSON.parse(raw) as Partial<NodeWorkflow>;
      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
        toast.error("JSON must contain nodes[] and edges[] arrays.");
        return;
      }
      const imported: NodeWorkflow = {
        id: `wf-${Date.now().toString(36)}`,
        name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : "Imported Workflow",
        description: typeof parsed.description === "string" ? parsed.description : "Imported node workflow",
        updatedAt: Date.now(),
        nodes: parsed.nodes,
        edges: parsed.edges,
      };
      upsertNodeWorkflow(imported);
      setActiveNodeWorkflowId(imported.id);
      setSelectedNodeId(imported.nodes[0]?.id ?? null);
      toast.success(`Imported "${imported.name}" (${imported.nodes.length} nodes)`);
    } catch {
      toast.error("Invalid workflow JSON syntax.");
    }
  }

  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden bg-bg text-fg">
      {/* Node Studio Top Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="shrink-0 whitespace-nowrap font-serif text-lg font-bold tracking-tight text-fg md:text-xl">
                Node Studio
              </h1>
              <select
                aria-label="Active workflow"
                value={activeWorkflow.id}
                onChange={(e) => {
                  setActiveNodeWorkflowId(e.target.value);
                  setExecutionResults({});
                }}
                className="h-8 max-w-[190px] sm:max-w-56 truncate rounded-xl border border-line bg-raised px-2.5 text-xs font-medium text-fg outline-none focus:border-[#d4b06a]"
              >
                {nodeWorkflows.map((wf) => (
                  <option key={wf.id} value={wf.id}>
                    {wf.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => createNodeWorkflowFromTemplate(activeWorkflow.templateId)}
                title="Duplicate active workflow"
                className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border border-line bg-surface px-2.5 text-xs font-medium text-muted hover:border-[#d4b06a] hover:text-fg"
              >
                <Plus className="size-3.5" /> New Copy
              </button>
            </div>
            <p className="mt-0.5 font-mono text-[11px] tabular-nums text-faint" suppressHydrationWarning>
              {activeWorkflow.nodes.length} nodes · {activeWorkflow.edges.length} wires ·{" "}
              {validation.valid
                ? `DAG Valid${hydrated ? ` (${validation.durationMs}ms)` : ""}`
                : `${validation.issues.length} validation issue(s)`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Execution Mode Selector */}
          <div
            role="group"
            aria-label="Execution mode"
            className="inline-flex h-9 items-center rounded-xl border border-line bg-raised p-0.5 text-xs"
          >
            {(["local", "hybrid", "cloud"] as ExecutionMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setNodeExecutionMode(m)}
                className={cn(
                  "h-7.5 rounded-lg px-2.5 text-xs font-medium capitalize whitespace-nowrap transition",
                  nodeExecutionMode === m
                    ? "bg-[#14110f] text-[#f6efe4] shadow-xs"
                    : "text-muted hover:text-fg",
                )}
              >
                {m === "hybrid" ? (
                  <span className="inline-flex items-center gap-1">
                    <Cpu className="size-3 text-[#e7c27a]" /> Hybrid
                  </span>
                ) : (
                  m
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSyncFromStudio}
            className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-line bg-surface px-3 text-xs font-medium text-fg"
          >
            <RefreshCw className="size-3.5 text-[#b08a45]" /> Sync Studio Frame
          </button>

          {latestOutputUrl ? (
            <button
              type="button"
              onClick={() => {
                promoteImageToStudio(latestOutputUrl, activeWorkflow.name);
                void navigate({ to: "/" });
              }}
              className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d4b06a] bg-surface px-3 text-xs font-medium text-fg"
            >
              <ArrowUpRight className="size-3.5 text-[#b08a45]" /> Open in AI Canvas
            </button>
          ) : null}

          <button
            type="button"
            data-testid="run-workflow-btn"
            disabled={running}
            onClick={() => void handleRunWorkflow()}
            className="gold-fill inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60"
          >
            {running ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5 fill-current" />
            )}
            {running ? "Executing DAG..." : "Run Workflow"}
          </button>
        </div>
      </div>

      {/* Mobile Pane Switcher */}
      <div className="flex shrink-0 gap-1 border-b border-line bg-raised px-3 py-1.5 lg:hidden">
        {(
          [
            ["palette", "Nodes (45)"],
            ["canvas", "Graph Canvas"],
            ["inspector", "Inspector"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobilePane(id)}
            className={cn(
              "h-8 flex-1 rounded-lg text-xs font-medium whitespace-nowrap",
              mobilePane === id ? "bg-[#14110f] text-[#f6efe4]" : "text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main 3-Pane Node Workbench */}
      <div className="min-h-0 flex-1 grid grid-cols-1 lg:grid-cols-[264px_1fr_316px]">
        <div
          className={cn(
            "min-h-0 min-w-0 overflow-hidden",
            mobilePane === "palette" ? "block h-full" : "hidden lg:block",
          )}
        >
          <NodeStudioSidebar
            workflows={nodeWorkflows}
            activeWorkflowId={activeWorkflow.id}
            revisions={nodeRevisions}
            onAddNode={(spec) => handleAddNode(spec)}
            onSelectWorkflow={(id) => {
              setActiveNodeWorkflowId(id);
              setExecutionResults({});
              setMobilePane("canvas");
            }}
            onLoadTemplate={handleLoadTemplate}
            onSaveRevision={handleSaveRevision}
            onRestoreRevision={(revId) => {
              restoreNodeRevision(revId);
              setExecutionResults({});
              toast.success("Restored graph revision");
            }}
          />
        </div>

        <div
          className={cn(
            "min-h-0 min-w-0 overflow-clip",
            mobilePane === "canvas" ? "block h-full" : "hidden lg:block",
          )}
        >
          <NodeStudioCanvas
            workflowId={activeWorkflow.id}
            nodes={activeWorkflow.nodes}
            edges={activeWorkflow.edges}
            selectedNodeId={selectedNodeId}
            executionResults={executionResults}
            onSelectNode={(id) => setSelectedNodeId(id)}
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

        <div
          className={cn(
            "min-h-0 overflow-hidden",
            mobilePane === "inspector" ? "block h-full" : "hidden lg:block",
          )}
        >
          <NodeStudioInspector
            workflow={activeWorkflow}
            selectedNode={selectedNode}
            executionResults={executionResults}
            validation={validation}
            onUpdateNodeParam={handleUpdateNodeParam}
            onUpdateNodeLabel={handleUpdateNodeLabel}
            onSelectNode={(id) => setSelectedNodeId(id)}
            onImportWorkflowJson={handleImportJson}
            onPromoteImageToStudio={promoteImageToStudio}
          />
        </div>
      </div>
    </main>
  );
}
