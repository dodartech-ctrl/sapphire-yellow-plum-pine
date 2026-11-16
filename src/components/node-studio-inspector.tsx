import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  FileUp,
  Info,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Compare } from "@/components/compare";
import {
  CATEGORY_META,
  compileWorkflowToComfyJson,
  getNodeSpec,
  type GraphValidationResult,
  type NodeExecutionResult,
  type NodeWorkflow,
  type WorkflowNodeInstance,
} from "@/lib/node-studio";
import { cn } from "@/lib/utils";

interface NodeStudioInspectorProps {
  workflow: NodeWorkflow;
  selectedNode: WorkflowNodeInstance | null;
  executionResults: Record<string, NodeExecutionResult>;
  validation: GraphValidationResult;
  onUpdateNodeParam: (
    nodeId: string,
    key: string,
    value: string | number | boolean,
  ) => void;
  onUpdateNodeLabel: (nodeId: string, label: string) => void;
  onSelectNode: (nodeId: string) => void;
  onImportWorkflowJson: (raw: string) => void;
  onPromoteImageToStudio: (imageUrl: string, title?: string) => void;
}

export function NodeStudioInspector({
  workflow,
  selectedNode,
  executionResults,
  validation,
  onUpdateNodeParam,
  onUpdateNodeLabel,
  onSelectNode,
  onImportWorkflowJson,
  onPromoteImageToStudio,
}: NodeStudioInspectorProps) {
  const [tab, setTab] = useState<"node" | "diagnostics" | "json">("node");
  const [jsonFormat, setJsonFormat] = useState<"comfy" | "oriel">("comfy");
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedSpec = selectedNode ? getNodeSpec(selectedNode.type) : undefined;
  const selectedResult = selectedNode ? executionResults[selectedNode.id] : undefined;

  // Find latest completed output across workflow if no specific node result is selected
  const latestImageOutput = useMemo(() => {
    for (const id of [...validation.executionOrder].reverse()) {
      const res = executionResults[id];
      if (res?.imageUrl) return { nodeId: id, res };
    }
    return null;
  }, [validation.executionOrder, executionResults]);

  const jsonPayload = useMemo(() => {
    const obj =
      jsonFormat === "comfy" ? compileWorkflowToComfyJson(workflow) : workflow;
    return JSON.stringify(obj, null, 2);
  }, [workflow, jsonFormat]);

  function copyJson() {
    void navigator.clipboard.writeText(jsonPayload);
    setCopied(true);
    toast.success(`Copied ${jsonFormat === "comfy" ? "ComfyUI API" : "Oriel"} JSON`);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadJson() {
    const blob = new Blob([jsonPayload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflow.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${jsonFormat}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <aside
      data-testid="node-studio-inspector"
      className="flex h-full min-h-0 flex-col border-l border-line bg-surface text-fg"
    >
      {/* Inspector Tab Switcher */}
      <div className="flex shrink-0 gap-1 border-b border-line bg-raised/60 p-1.5">
        {(
          [
            ["node", "Inspector", SlidersHorizontal],
            ["diagnostics", `Validate (${validation.issues.length})`, ShieldCheck],
            ["json", "ComfyUI JSON", Code2],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex h-8 flex-1 items-center justify-center gap-1 rounded-lg px-1.5 text-[11px] font-medium whitespace-nowrap transition",
              tab === id
                ? "bg-[#14110f] text-[#f6efe4] shadow-xs"
                : "text-muted hover:bg-surface hover:text-fg",
            )}
          >
            <Icon className="size-3 shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {tab === "node" ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-3.5 space-y-4">
          {selectedNode && selectedSpec ? (
            <>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: CATEGORY_META[selectedSpec.category].accent }}
                  >
                    {CATEGORY_META[selectedSpec.category].label}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-faint">
                    {selectedSpec.executionTarget} · {selectedNode.id}
                  </span>
                </div>
                <input
                  type="text"
                  value={selectedNode.label ?? selectedSpec.title}
                  onChange={(e) => onUpdateNodeLabel(selectedNode.id, e.target.value)}
                  aria-label="Node display title"
                  className="mt-1.5 h-9 w-full rounded-xl border border-line bg-raised/60 px-2.5 font-serif text-base font-semibold text-fg outline-none focus:border-[#d4b06a]"
                />
                <p className="mt-1 text-xs text-muted">{selectedSpec.summary}</p>
              </div>

              {/* Parameters */}
              {selectedSpec.params.length > 0 ? (
                <div className="space-y-3 border-t border-line pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Parameters
                  </p>
                  {selectedSpec.params.map((field) => {
                    const val = selectedNode.params[field.key] ?? field.defaultValue;
                    if (field.kind === "textarea") {
                      return (
                        <label key={field.key} className="block text-xs">
                          <span className="font-medium text-fg">{field.label}</span>
                          <textarea
                            rows={3}
                            value={String(val)}
                            onChange={(e) =>
                              onUpdateNodeParam(selectedNode.id, field.key, e.target.value)
                            }
                            className="mt-1 w-full rounded-xl border border-line bg-raised/50 p-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
                          />
                        </label>
                      );
                    }
                    if (field.kind === "select") {
                      return (
                        <label key={field.key} className="block text-xs">
                          <span className="font-medium text-fg">{field.label}</span>
                          <select
                            value={String(val)}
                            onChange={(e) =>
                              onUpdateNodeParam(selectedNode.id, field.key, e.target.value)
                            }
                            className="mt-1 h-9 w-full rounded-xl border border-line bg-raised/50 px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
                          >
                            {(field.options ?? []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt === "__studio_active__" ? "Active Studio Image" : opt}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    }
                    if (field.kind === "slider") {
                      const num = Number(val);
                      return (
                        <label key={field.key} className="block text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-fg">{field.label}</span>
                            <span className="font-mono text-[11px] tabular-nums text-[#b08a45]">
                              {num}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={field.min ?? 0}
                            max={field.max ?? 100}
                            step={field.step ?? 1}
                            value={num}
                            onChange={(e) =>
                              onUpdateNodeParam(selectedNode.id, field.key, Number(e.target.value))
                            }
                            className="mt-1.5 w-full accent-[#d4b06a]"
                          />
                        </label>
                      );
                    }
                    if (field.kind === "toggle") {
                      const checked = Boolean(val);
                      return (
                        <label
                          key={field.key}
                          className="flex items-center justify-between rounded-xl border border-line bg-raised/40 px-3 py-2 text-xs"
                        >
                          <span className="font-medium text-fg">{field.label}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              onUpdateNodeParam(selectedNode.id, field.key, e.target.checked)
                            }
                            className="size-4 accent-[#d4b06a]"
                          />
                        </label>
                      );
                    }
                    if (field.kind === "number") {
                      return (
                        <label key={field.key} className="block text-xs">
                          <span className="font-medium text-fg">{field.label}</span>
                          <input
                            type="number"
                            min={field.min}
                            max={field.max}
                            value={Number(val)}
                            onChange={(e) =>
                              onUpdateNodeParam(selectedNode.id, field.key, Number(e.target.value))
                            }
                            className="mt-1 h-9 w-full rounded-xl border border-line bg-raised/50 px-2.5 font-mono text-xs text-fg outline-none focus:border-[#d4b06a]"
                          />
                        </label>
                      );
                    }
                    return (
                      <label key={field.key} className="block text-xs">
                        <span className="font-medium text-fg">{field.label}</span>
                        <input
                          type="text"
                          value={String(val)}
                          placeholder={field.placeholder}
                          onChange={(e) =>
                            onUpdateNodeParam(selectedNode.id, field.key, e.target.value)
                          }
                          className="mt-1 h-9 w-full rounded-xl border border-line bg-raised/50 px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
                        />
                      </label>
                    );
                  })}
                </div>
              ) : null}

              {/* Selected Node Live Output */}
              {selectedResult ? (
                <div className="space-y-2.5 border-t border-line pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Node Output
                    </p>
                    {typeof selectedResult.durationMs === "number" ? (
                      <span className="font-mono text-[11px] tabular-nums text-[#b08a45]">
                        {selectedResult.durationMs}ms
                      </span>
                    ) : null}
                  </div>

                  {selectedResult.isIllustrativeRelight ? (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-[11px] text-amber-950">
                      <Info className="mt-0.5 size-3.5 shrink-0 text-amber-700" />
                      <span>
                        Illustrative AI approximation (image-only input). Wire{" "}
                        <strong>Load 3D Scene</strong> for physically grounded solar shadow geometry.
                      </span>
                    </div>
                  ) : null}

                  {typeof selectedResult.diffOutsideMaskPct === "number" ? (
                    <div
                      data-testid="geometry-drift-report"
                      className={cn(
                        "rounded-xl border p-2.5 text-xs",
                        selectedResult.geometryDriftWarning
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-950"
                          : "border-emerald-600/30 bg-emerald-600/10 text-emerald-950",
                      )}
                    >
                      <div className="flex items-center justify-between font-medium">
                        <span>Geometry Diff Outside Mask</span>
                        <span className="font-mono tabular-nums">
                          {selectedResult.diffOutsideMaskPct}%
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] opacity-85">
                        {selectedResult.geometryDriftWarning
                          ? "Structural change outside mask exceeded alert threshold. Lower strength or tighten Geometry Lock."
                          : "Exterior geometry held cleanly outside edited mask."}
                      </p>
                    </div>
                  ) : null}

                  {selectedResult.compareBeforeUrl && selectedResult.compareAfterUrl ? (
                    <div className="overflow-hidden rounded-xl border border-line bg-[#14110f]">
                      <Compare
                        before={selectedResult.compareBeforeUrl}
                        after={selectedResult.compareAfterUrl}
                        beforeLabel="Before"
                        afterLabel="After"
                        beforeAlt="Before edit"
                        afterAlt="After edit"
                        embedded
                        aspect="16/9"
                      />
                    </div>
                  ) : selectedResult.videoUrl && selectedResult.videoUrl.startsWith("blob:") ? (
                    <div className="space-y-2">
                      <video
                        src={selectedResult.videoUrl}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full rounded-xl border border-line bg-black"
                      />
                      <a
                        href={selectedResult.videoUrl}
                        download="oriel-walkthrough.webm"
                        className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-raised text-xs font-medium text-fg hover:border-[#d4b06a]"
                      >
                        <Download className="size-3.5 text-[#b08a45]" /> Download WebM Clip
                      </a>
                    </div>
                  ) : selectedResult.variations && selectedResult.variations.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {selectedResult.variations.map((url, idx) => (
                        <button
                          key={`${idx}-${url.slice(0, 20)}`}
                          type="button"
                          onClick={() => onPromoteImageToStudio(url, `Node Variation V${idx + 1}`)}
                          className="overflow-hidden rounded-lg border border-line hover:border-[#d4b06a]"
                        >
                          <img src={url} alt={`Variation ${idx + 1}`} className="aspect-video w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : selectedResult.imageUrl ? (
                    <img
                      src={selectedResult.imageUrl}
                      alt={selectedSpec.title}
                      className="w-full rounded-xl border border-line object-cover"
                    />
                  ) : null}

                  {selectedResult.summary ? (
                    <p className="text-xs text-muted">{selectedResult.summary}</p>
                  ) : null}

                  {selectedResult.imageUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        onPromoteImageToStudio(selectedResult.imageUrl!, selectedSpec.title)
                      }
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#d4b06a] bg-[#14110f] text-xs font-medium text-[#f6efe4] hover:bg-[#1f1a16]"
                    >
                      <ArrowUpRight className="size-3.5 text-[#e7c27a]" /> Send Result to AI Canvas
                    </button>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-line bg-raised/45 p-3 text-xs text-muted">
                Click any node on the graph canvas to edit its parameters, sliders, and live output preview.
              </div>
              {latestImageOutput ? (
                <div className="space-y-2 border-t border-line pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Latest Pipeline Output
                  </p>
                  {latestImageOutput.res.compareBeforeUrl &&
                  latestImageOutput.res.compareAfterUrl ? (
                    <div className="overflow-hidden rounded-xl border border-line bg-[#14110f]">
                      <Compare
                        before={latestImageOutput.res.compareBeforeUrl}
                        after={latestImageOutput.res.compareAfterUrl}
                        beforeLabel="Before"
                        afterLabel="After"
                        beforeAlt="Before"
                        afterAlt="After"
                        embedded
                        aspect="16/9"
                      />
                    </div>
                  ) : (
                    <img
                      src={latestImageOutput.res.imageUrl}
                      alt="Latest pipeline output"
                      className="w-full rounded-xl border border-line object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      onPromoteImageToStudio(latestImageOutput.res.imageUrl!, workflow.name)
                    }
                    className="gold-fill inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-[#2a1c0c]"
                  >
                    <ArrowUpRight className="size-3.5" /> Promote Output to Studio
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : tab === "diagnostics" ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-3.5 space-y-4">
          <div
            data-testid="graph-validation-banner"
            className={cn(
              "rounded-xl border p-3 text-xs",
              validation.valid
                ? "border-emerald-600/35 bg-emerald-600/10 text-emerald-950"
                : "border-red-600/35 bg-red-600/10 text-red-950",
            )}
          >
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                {validation.valid ? (
                  <CheckCircle2 className="size-4 text-emerald-700" />
                ) : (
                  <AlertTriangle className="size-4 text-red-700" />
                )}
                {validation.valid ? "Valid Acyclic Graph (DAG)" : "Graph Validation Failed"}
              </span>
              <span className="font-mono text-[11px] tabular-nums">
                {validation.durationMs}ms
              </span>
            </div>
            <p className="mt-1 text-[11px] opacity-85">
              {validation.executionOrder.length} executable nodes ·{" "}
              {validation.hasCycles ? "Cycle detected" : "Cycle-free"}
            </p>
          </div>

          {validation.issues.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Diagnostics ({validation.issues.length})
              </p>
              {validation.issues.map((issue, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (issue.nodeId) {
                      onSelectNode(issue.nodeId);
                      setTab("node");
                    }
                  }}
                  className="flex w-full items-start gap-2 rounded-xl border border-line bg-raised/50 p-2.5 text-left text-xs hover:border-[#d4b06a]"
                >
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                  <span className="text-fg">{issue.message}</span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Topological Execution Order
            </p>
            <div className="divide-y divide-line rounded-xl border border-line bg-raised/35">
              {validation.executionOrder.map((nodeId, idx) => {
                const node = workflow.nodes.find((n) => n.id === nodeId);
                const spec = node ? getNodeSpec(node.type) : undefined;
                const exec = executionResults[nodeId];
                return (
                  <button
                    key={nodeId}
                    type="button"
                    onClick={() => {
                      onSelectNode(nodeId);
                      setTab("node");
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-surface"
                  >
                    <span className="truncate font-medium text-fg">
                      <span className="mr-1.5 font-mono text-[10px] tabular-nums text-faint">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {node?.label || spec?.title || nodeId}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-muted">
                      {exec?.status === "completed"
                        ? `${exec.durationMs ?? 1}ms`
                        : exec?.status ?? "ready"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-3.5 space-y-3">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setJsonFormat("comfy")}
              className={cn(
                "h-8 flex-1 rounded-lg border text-xs font-medium",
                jsonFormat === "comfy"
                  ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]"
                  : "border-line bg-raised text-muted",
              )}
            >
              ComfyUI API JSON
            </button>
            <button
              type="button"
              onClick={() => setJsonFormat("oriel")}
              className={cn(
                "h-8 flex-1 rounded-lg border text-xs font-medium",
                jsonFormat === "oriel"
                  ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]"
                  : "border-line bg-raised text-muted",
              )}
            >
              Oriel Workflow JSON
            </button>
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={copyJson}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-raised text-xs font-medium text-fg hover:border-[#d4b06a]"
            >
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              Copy
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-raised text-xs font-medium text-fg hover:border-[#d4b06a]"
            >
              <Download className="size-3.5" /> Export .json
            </button>
          </div>

          <pre
            data-testid="workflow-json-preview"
            className="max-h-60 overflow-auto rounded-xl border border-line bg-[#14110f] p-2.5 font-mono text-[10px] leading-relaxed text-[#dfd5c6]"
          >
            {jsonPayload}
          </pre>

          <div className="space-y-1.5 border-t border-line pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Import Oriel Workflow JSON
            </p>
            <textarea
              rows={3}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='Paste exported Oriel workflow JSON {"nodes":[...],"edges":[...]}'
              className="w-full rounded-xl border border-line bg-raised/50 p-2 font-mono text-[10px] text-fg outline-none focus:border-[#d4b06a]"
            />
            <button
              type="button"
              disabled={!importText.trim()}
              onClick={() => {
                onImportWorkflowJson(importText);
                setImportText("");
              }}
              className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-surface text-xs font-medium text-fg hover:border-[#d4b06a] disabled:opacity-50"
            >
              <FileUp className="size-3.5 text-[#b08a45]" /> Import Workflow Graph
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
