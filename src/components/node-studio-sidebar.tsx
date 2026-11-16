import { BookmarkPlus, FolderKanban, Layers, Plus, RotateCcw, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CATEGORY_META,
  NODE_CATALOG,
  WORKFLOW_TEMPLATES,
  matchesNodeSearch,
  type NodeCategoryId,
  type NodeSpec,
  type NodeWorkflow,
  type WorkflowRevision,
} from "@/lib/node-studio";
import { cn } from "@/lib/utils";

interface NodeStudioSidebarProps {
  workflows: NodeWorkflow[];
  activeWorkflowId: string;
  revisions: WorkflowRevision[];
  onAddNode: (spec: NodeSpec) => void;
  onSelectWorkflow: (id: string) => void;
  onLoadTemplate: (templateId: string) => void;
  onSaveRevision: () => void;
  onRestoreRevision: (revId: string) => void;
}

const CATEGORIES = (Object.keys(CATEGORY_META) as NodeCategoryId[]).sort(
  (a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order,
);

export function NodeStudioSidebar({
  workflows,
  activeWorkflowId,
  revisions,
  onAddNode,
  onSelectWorkflow,
  onLoadTemplate,
  onSaveRevision,
  onRestoreRevision,
}: NodeStudioSidebarProps) {
  const [tab, setTab] = useState<"nodes" | "templates" | "revisions">("nodes");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<NodeCategoryId | "all">("all");

  const filteredSpecs = useMemo(() => {
    return NODE_CATALOG.filter((spec) => {
      if (activeCategory !== "all" && spec.category !== activeCategory) return false;
      return matchesNodeSearch(spec, search);
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<NodeCategoryId, NodeSpec[]>();
    for (const cat of CATEGORIES) map.set(cat, []);
    for (const spec of filteredSpecs) {
      map.get(spec.category)?.push(spec);
    }
    return CATEGORIES.filter((cat) => (map.get(cat)?.length ?? 0) > 0).map((cat) => ({
      category: cat,
      meta: CATEGORY_META[cat],
      items: map.get(cat)!,
    }));
  }, [filteredSpecs]);

  return (
    <aside
      data-testid="node-studio-sidebar"
      className="flex h-full min-h-0 flex-col border-r border-line bg-surface text-fg"
    >
      {/* Tab Bar */}
      <div className="flex shrink-0 border-b border-line bg-raised/60 p-1.5 gap-1">
        {(
          [
            ["nodes", "Nodes (45)", Layers],
            ["templates", "Templates", FolderKanban],
            ["revisions", "Revisions", RotateCcw],
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

      {tab === "nodes" ? (
        <>
          <div className="shrink-0 space-y-2 border-b border-line p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 45 nodes (SAM, Inpaint, Relight...)"
                className="h-9 w-full rounded-xl border border-line bg-raised/60 pr-3 pl-8 text-xs text-fg outline-none focus:border-[#d4b06a]"
              />
            </div>

            <div className="no-scrollbar flex gap-1 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "h-7 shrink-0 rounded-lg border px-2 text-[11px] font-medium whitespace-nowrap transition",
                  activeCategory === "all"
                    ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]"
                    : "border-line bg-surface text-muted hover:text-fg",
                )}
              >
                All ({NODE_CATALOG.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "h-7 shrink-0 rounded-lg border px-2 text-[11px] font-medium whitespace-nowrap transition",
                    activeCategory === cat
                      ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]"
                      : "border-line bg-surface text-muted hover:text-fg",
                  )}
                >
                  {CATEGORY_META[cat].label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-4">
            {grouped.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted">No matching nodes found.</p>
            ) : (
              grouped.map((group) => (
                <section key={group.category}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ backgroundColor: group.meta.accent }}
                      />
                      {group.meta.label}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-faint">
                      {group.items.length}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {group.items.map((spec) => (
                      <button
                        key={spec.type}
                        type="button"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("application/x-oriel-node", spec.type);
                          e.dataTransfer.effectAllowed = "copy";
                        }}
                        onClick={() => onAddNode(spec)}
                        className="group flex w-full items-start justify-between gap-2 rounded-xl border border-line/80 bg-raised/45 px-2.5 py-2 text-left transition hover:border-[#d4b06a] hover:bg-surface"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-xs font-semibold text-fg">
                              {spec.title}
                            </span>
                            <span className="font-mono text-[10px] uppercase text-faint">
                              {spec.executionTarget}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted">
                            {spec.summary}
                          </p>
                        </div>
                        <Plus className="mt-0.5 size-3.5 shrink-0 text-faint group-hover:text-[#b08a45]" />
                      </button>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </>
      ) : tab === "templates" ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-5">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Prebuilt ArchViz Pipelines
            </p>
            <div className="mt-2 space-y-2">
              {WORKFLOW_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-xl border border-line bg-raised/50 p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-fg">{tpl.name}</span>
                    <span className="font-mono text-[10px] tabular-nums text-faint">
                      {tpl.nodes.length}N · {tpl.edges.length}E
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-muted">{tpl.description}</p>
                  <button
                    type="button"
                    onClick={() => onLoadTemplate(tpl.id)}
                    className="mt-2 inline-flex h-7 items-center gap-1 rounded-lg border border-[#d4b06a]/60 bg-[#14110f] px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#e7c27a]"
                  >
                    <Sparkles className="size-3 text-[#e7c27a]" /> Load Template
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Saved Workspace Graphs
            </p>
            <div className="mt-2 space-y-1.5">
              {workflows.map((wf) => {
                const active = wf.id === activeWorkflowId;
                return (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => onSelectWorkflow(wf.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left text-xs transition",
                      active
                        ? "border-[#d4b06a] bg-[#14110f] text-[#f6efe4]"
                        : "border-line bg-raised/40 text-fg hover:border-[#d4b06a]",
                    )}
                  >
                    <span className="truncate font-medium">{wf.name}</span>
                    <span className="font-mono text-[10px] tabular-nums opacity-75">
                      {wf.nodes.length} nodes
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-3">
          <button
            type="button"
            onClick={onSaveRevision}
            className="gold-fill flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-[#2a1c0c]"
          >
            <BookmarkPlus className="size-3.5" /> Save Graph Snapshot
          </button>
          {revisions.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted">
              No graph snapshots yet. Run a pipeline or click Save Graph Snapshot to track non-destructive versions.
            </p>
          ) : (
            <div className="space-y-2">
              {revisions.map((rev) => (
                <div key={rev.id} className="rounded-xl border border-line bg-raised/50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold text-fg">{rev.label}</span>
                    <span className="font-mono text-[10px] uppercase text-[#b08a45]">
                      {rev.mode}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[10px] tabular-nums text-faint">
                    {rev.nodeCount} nodes · {rev.edgeCount} edges
                    {typeof rev.diffOutsideMaskPct === "number"
                      ? ` · Drift ${rev.diffOutsideMaskPct}%`
                      : ""}
                  </p>
                  {rev.outputPreviewUrl ? (
                    <img
                      src={rev.outputPreviewUrl}
                      alt={rev.label}
                      className="mt-2 h-20 w-full rounded-lg border border-line object-cover"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onRestoreRevision(rev.id)}
                    className="mt-2 inline-flex h-7 items-center gap-1 rounded-lg border border-line bg-surface px-2.5 text-[11px] font-medium text-fg hover:border-[#d4b06a]"
                  >
                    <RotateCcw className="size-3" /> Restore Snapshot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
