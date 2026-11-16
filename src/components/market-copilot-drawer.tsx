import {
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Loader2,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  MARKET_AUTOPILOT_PACKS,
  MARKET_BENCHMARKS,
  MARKET_SUGGESTIONS,
  MARKET_SUGGESTION_CATEGORIES,
  createAutoBuildQueuePlan,
  filterMarketSuggestions,
  getMarketCategoryStats,
  type MarketBenchmark,
  type MarketCategoryId,
  type MarketSuggestion,
} from "@/lib/market-suggestions";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

type MarketCopilotDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MarketCopilotDrawer({ open, onOpenChange }: MarketCopilotDrawerProps) {
  const autoApproveMode = useOriel((s) => s.autoApproveMode);
  const setAutoApproveMode = useOriel((s) => s.setAutoApproveMode);
  const approvedSuggestionIds = useOriel((s) => s.approvedSuggestionIds);
  const appliedSuggestionIds = useOriel((s) => s.appliedSuggestionIds);
  const approveMarketSuggestion = useOriel((s) => s.approveMarketSuggestion);
  const applyMarketSuggestion = useOriel((s) => s.applyMarketSuggestion);
  const applyMarketSuggestionBatch = useOriel((s) => s.applyMarketSuggestionBatch);
  const resetAppliedMarketSuggestions = useOriel((s) => s.resetAppliedMarketSuggestions);
  const design = useOriel((s) => s.design);
  const engine = useOriel((s) => s.engine);
  const enqueueRender = useOriel((s) => s.enqueueRender);
  const enqueueBatchMatrix = useOriel((s) => s.enqueueBatchMatrix);
  const pushLog = useOriel((s) => s.pushLog);
  const plate = useOriel((s) => s.plate);
  const upload = useOriel((s) => s.upload);
  const sketchDataUrl = useOriel((s) => s.sketchDataUrl);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MarketCategoryId | "all">("all");
  const [benchmark, setBenchmark] = useState<MarketBenchmark | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "applied">("all");
  const [alsoQueueVisualPasses, setAlsoQueueVisualPasses] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [autoRunning, setAutoRunning] = useState(false);
  const [autoProgress, setAutoProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const cancelAutoRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    return () => {
      cancelAutoRef.current = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      filterMarketSuggestions(MARKET_SUGGESTIONS, {
        query,
        category,
        benchmark,
        statusFilter,
        approvedIds: approvedSuggestionIds,
        appliedIds: appliedSuggestionIds,
      }),
    [query, category, benchmark, statusFilter, approvedSuggestionIds, appliedSuggestionIds],
  );

  const visibleItems = useMemo(() => (showAll ? filtered : filtered.slice(0, 24)), [filtered, showAll]);

  const categoryStats = useMemo(
    () => getMarketCategoryStats(MARKET_SUGGESTIONS, approvedSuggestionIds, appliedSuggestionIds),
    [approvedSuggestionIds, appliedSuggestionIds],
  );

  const approvedSet = useMemo(() => new Set(approvedSuggestionIds), [approvedSuggestionIds]);
  const appliedSet = useMemo(() => new Set(appliedSuggestionIds), [appliedSuggestionIds]);
  const thumbFallback = plate?.url ?? upload ?? sketchDataUrl ?? "/viz/p01-pavilion-day.jpg";

  async function runAutoBuild(
    targets: MarketSuggestion[],
    title: string,
    includeDaylightTrio = false,
  ) {
    if (autoRunning) return;
    if (targets.length === 0) {
      toast.message("No suggestions match the current selection.");
      return;
    }

    cancelAutoRef.current = false;
    setAutoRunning(true);

    const plan = createAutoBuildQueuePlan(targets, {
      includeDaylightTrio,
      baseLook: design.look,
      basePreset: engine.workflowPreset,
    });

    // Step visibly in fast responsive chunks so UI shows live agent progress cleanly
    const chunkSize = targets.length > 30 ? 10 : 1;
    let processed = 0;

    for (let i = 0; i < plan.orderedSuggestions.length; i += chunkSize) {
      if (cancelAutoRef.current) break;
      const chunk = plan.orderedSuggestions.slice(i, i + chunkSize);
      const last = chunk[chunk.length - 1];
      setAutoProgress({
        done: processed,
        total: plan.orderedSuggestions.length,
        label: last?.title ?? title,
      });
      applyMarketSuggestionBatch(chunk, autoApproveMode);
      processed += chunk.length;
      await new Promise((r) => window.setTimeout(r, targets.length > 30 ? 30 : 75));
    }

    if (!cancelAutoRef.current) {
      if (alsoQueueVisualPasses && plan.queueJobs.length > 0) {
        enqueueBatchMatrix(
          plan.queueJobs.map((job) => ({
            ...job,
            thumbnailUrl: thumbFallback,
          })),
        );
      }
      pushLog({
        title: `Market Copilot · ${title}`,
        model: "flux",
        text: plan.summaryText,
      });
      toast.success(
        autoApproveMode
          ? `Auto-Approved & Applied ${processed} upgrades${alsoQueueVisualPasses && plan.queueJobs.length > 0 ? ` · ${plan.queueJobs.length} queued` : ""}`
          : `Applied ${processed} upgrades to Studio configuration`,
      );
    }

    setAutoProgress(null);
    setAutoRunning(false);
  }

  function handleApplySingle(item: MarketSuggestion) {
    if (autoApproveMode) {
      approveMarketSuggestion(item.id);
    }
    applyMarketSuggestion(item);
    toast.success(`Applied "${item.title}" to Studio`);
  }

  function handleQueueSingle(item: MarketSuggestion) {
    const q = item.autoQueuePreset;
    enqueueRender(q?.label || item.title, q?.preset || engine.workflowPreset, q?.light || design.light, {
      cameraPreset: q?.cameraPreset,
      sunHour: q?.sunHour,
      promptNote: item.promptPatch,
      thumbnailUrl: thumbFallback,
      status: "pending",
    });
    toast.success(`Queued "${q?.label || item.title}" in Render Queue`);
  }

  if (!open) return null;

  return (
    <div
      data-testid="market-copilot-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="ArchViz Market Copilot and Auto-Build Suggestions"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-5"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line bg-surface text-fg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-line bg-bg/70 px-4 py-2.5 sm:items-center sm:px-5 sm:py-3.5">
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-lg leading-tight font-bold tracking-tight text-fg sm:text-2xl">
              ArchViz Market Copilot · 160 Production Upgrades
            </h2>
            <p className="mt-0.5 text-[11px] leading-snug text-muted sm:text-xs">
              Benchmarked across D5 Render, Veras, LookX, Rendair, Krea, Magnific &amp; Chaos Corona · Non-destructive updates only
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden font-mono text-xs tabular-nums text-muted md:inline">
              {appliedSuggestionIds.length} Applied · {approvedSuggestionIds.length} Approved · {MARKET_SUGGESTIONS.length} Total
            </span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close Market Copilot"
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg sm:size-10"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {/* Auto-Mode & Auto-Approval Control Strip */}
        <div className="shrink-0 border-b border-line bg-raised/70 px-4 py-2 sm:px-5 sm:py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                data-testid="toggle-auto-approve-btn"
                aria-pressed={autoApproveMode}
                onClick={() => setAutoApproveMode(!autoApproveMode)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-xs font-semibold transition sm:h-10 sm:gap-2 sm:px-3.5",
                  autoApproveMode
                    ? "gold-fill border-transparent text-[#2a1c0c]"
                    : "border-line bg-surface text-fg hover:border-[#b08a45]",
                )}
              >
                <Zap className="size-3.5" />
                Auto-Approve: {autoApproveMode ? "ON" : "Manual"}
              </button>

              <button
                type="button"
                aria-pressed={alsoQueueVisualPasses}
                onClick={() => setAlsoQueueVisualPasses((v) => !v)}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-xs font-medium transition sm:h-10 sm:px-3",
                  alsoQueueVisualPasses
                    ? "border-[#b08a45] bg-[#fff8eb] text-[#5e4110]"
                    : "border-line bg-surface text-muted hover:text-fg",
                )}
              >
                <Clock className="size-3.5 text-[#b08a45]" />
                Queue Passes: {alsoQueueVisualPasses ? "Yes" : "No"}
              </button>

              {appliedSuggestionIds.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    resetAppliedMarketSuggestions();
                    toast.message("Cleared applied checklist badges (Studio settings kept intact)");
                  }}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-xs text-muted hover:text-fg sm:h-10 sm:px-3"
                >
                  <RotateCcw className="size-3.5" /> Reset
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {autoRunning ? (
                <button
                  type="button"
                  onClick={() => {
                    cancelAutoRef.current = true;
                  }}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 text-xs font-semibold text-rose-700 sm:h-10 sm:px-4"
                >
                  <Loader2 className="size-3.5 animate-spin" />
                  Stop Auto-Build ({autoProgress?.done ?? 0}/{autoProgress?.total ?? 0})
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    data-testid="auto-build-top5-btn"
                    onClick={() =>
                      void runAutoBuild(
                        filtered.slice(0, 5),
                        "Top 5 Filtered Upgrades",
                        false,
                      )
                    }
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 text-xs font-semibold text-fg hover:border-[#b08a45] sm:h-10 sm:px-3.5"
                  >
                    <Play className="size-3.5 text-[#b08a45]" />
                    Auto-Build Top 5
                  </button>
                  <button
                    type="button"
                    data-testid="auto-build-visible-btn"
                    onClick={() =>
                      void runAutoBuild(
                        filtered,
                        `Filtered Batch (${filtered.length})`,
                        category === "solar-atmosphere" || category === "motion-360-client",
                      )
                    }
                    className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold text-[#2a1c0c] sm:h-10 sm:px-4"
                  >
                    <Sparkles className="size-3.5" />
                    Auto-Approve &amp; Build ({filtered.length})
                  </button>
                </>
              )}
            </div>
          </div>

          {autoProgress ? (
            <div className="mt-2 flex items-center gap-3 text-xs">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full bg-[#b08a45] transition-all duration-150"
                  style={{
                    width: `${Math.round((autoProgress.done / Math.max(1, autoProgress.total)) * 100)}%`,
                  }}
                />
              </div>
              <span className="max-w-[260px] truncate font-mono text-[11px] tabular-nums text-fg">
                {autoProgress.done}/{autoProgress.total} · {autoProgress.label}
              </span>
            </div>
          ) : null}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-3.5 sm:px-5 sm:py-4">
          {/* 1-Click Starter Autopilot Packs */}
          <section aria-label="1-Click Autopilot Packs">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-fg">
                1-Click Studio Autopilot Packs
              </h3>
              <span className="text-xs text-muted">
                Apply curated market workflows without manual slider hunting
              </span>
            </div>
            <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {MARKET_AUTOPILOT_PACKS.map((pack) => {
                const packItems = MARKET_SUGGESTIONS.filter((s) => pack.suggestionIds.includes(s.id));
                const doneCount = packItems.filter((i) => appliedSet.has(i.id)).length;
                return (
                  <div
                    key={pack.id}
                    className="flex flex-col justify-between gap-2.5 rounded-xl border border-line bg-bg/60 p-3.5"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-muted">
                        <span className="font-mono tabular-nums">
                          {packItems.length} Upgrades · {doneCount}/{packItems.length} Applied
                        </span>
                        {pack.recommendedQueueTrio ? (
                          <span className="inline-flex items-center gap-1 font-medium text-[#8a6520]">
                            <Sun className="size-3" /> Trio Queue
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm font-semibold text-fg">{pack.name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{pack.description}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={autoRunning}
                        onClick={() =>
                          void runAutoBuild(packItems, pack.name, Boolean(pack.recommendedQueueTrio))
                        }
                        className="gold-fill inline-flex h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold text-[#2a1c0c] disabled:opacity-50"
                      >
                        <Play className="size-3" />
                        Auto-Build Pack
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Search, Benchmark & Status Controls */}
          <section aria-label="Filter 160 Market Suggestions" className="space-y-2.5 border-t border-line pt-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
                <input
                  type="text"
                  data-testid="market-copilot-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 160 market suggestions (e.g. travertine, SAM-2, 360, tilt-shift, golden hour)..."
                  className="h-10 w-full rounded-lg border border-line bg-bg pr-3 pl-9 text-xs text-fg outline-none focus:border-[#b08a45]"
                />
              </div>

              <select
                aria-label="Filter by ArchViz benchmark"
                value={benchmark}
                onChange={(e) => setBenchmark(e.target.value as MarketBenchmark | "all")}
                className="h-10 rounded-lg border border-line bg-bg px-3 text-xs text-fg outline-none focus:border-[#b08a45]"
              >
                <option value="all">All Market Tools (7)</option>
                {MARKET_BENCHMARKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 rounded-lg bg-raised p-1">
                {(
                  [
                    ["all", "All"],
                    ["pending", "Pending"],
                    ["approved", "Approved"],
                    ["applied", "Applied"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setStatusFilter(id)}
                    className={cn(
                      "h-8 shrink-0 whitespace-nowrap rounded-md px-3 text-xs font-medium transition",
                      statusFilter === id ? "bg-surface text-fg shadow-xs" : "text-muted hover:text-fg",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Segmented Tabs */}
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={cn(
                  "h-9 shrink-0 whitespace-nowrap rounded-lg border px-3 text-xs font-medium transition",
                  category === "all"
                    ? "gold-fill border-transparent text-[#2a1c0c]"
                    : "border-line bg-bg text-muted hover:text-fg",
                )}
              >
                All Categories ({MARKET_SUGGESTIONS.length})
              </button>
              {MARKET_SUGGESTION_CATEGORIES.map((cat) => {
                const stat = categoryStats.find((s) => s.id === cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "h-9 shrink-0 whitespace-nowrap rounded-lg border px-3 text-xs font-medium tabular-nums transition",
                      category === cat.id
                        ? "gold-fill border-transparent text-[#2a1c0c]"
                        : "border-line bg-bg text-muted hover:text-fg",
                    )}
                  >
                    {cat.label} ({stat?.total ?? 20})
                  </button>
                );
              })}
            </div>
          </section>

          {/* Suggestions Grid (Clean Single-Elevation Cards, Unboxed Metadata) */}
          <section aria-label="Suggestion List">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line p-8 text-center">
                <Layers className="mx-auto size-6 text-faint" />
                <p className="mt-2 text-sm font-medium text-fg">No suggestions match your filters</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                    setBenchmark("all");
                    setStatusFilter("all");
                  }}
                  className="mt-3 h-9 rounded-lg border border-line px-4 text-xs font-medium text-fg hover:border-[#b08a45]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-2.5 flex items-center justify-between text-xs text-muted">
                  <span data-testid="market-copilot-count" className="font-mono tabular-nums">
                    Showing {visibleItems.length} of {filtered.length} matching suggestions
                  </span>
                  {filtered.length > 24 ? (
                    <button
                      type="button"
                      onClick={() => setShowAll((v) => !v)}
                      className="font-medium text-[#8a6520] hover:underline"
                    >
                      {showAll ? "Collapse to 24" : `Show all ${filtered.length}`}
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {visibleItems.map((item) => {
                    const isApplied = appliedSet.has(item.id);
                    const isApproved = approvedSet.has(item.id) || isApplied;
                    return (
                      <article
                        key={item.id}
                        data-testid={`market-suggestion-${item.id}`}
                        className={cn(
                          "flex flex-col justify-between gap-3 rounded-xl border p-4 transition",
                          isApplied
                            ? "border-emerald-600/40 bg-emerald-50/35"
                            : "border-line bg-bg/40",
                        )}
                      >
                        <div>
                          {/* Clean Unboxed Metadata Line */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted tabular-nums">
                            <span className="font-mono font-semibold text-fg">
                              #{String(item.index).padStart(3, "0")}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{item.marketBenchmark}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={cn(
                                "font-medium",
                                isApplied
                                  ? "text-emerald-700"
                                  : isApproved
                                    ? "text-[#8a6520]"
                                    : "text-muted",
                              )}
                            >
                              {isApplied ? "Applied" : isApproved ? "Approved" : `${item.estimatedImpact} Impact`}
                            </span>
                          </div>

                          <h4 className="mt-1.5 text-sm font-semibold text-fg">{item.title}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted">
                            <strong className="font-medium text-fg">Solves:</strong> {item.painPointSolved}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            <strong className="font-medium text-fg">Tip:</strong> {item.userFriendlyTip}
                          </p>
                          <p className="mt-2 border-t border-line/60 pt-2 font-mono text-[11px] leading-relaxed text-fg/85">
                            {item.promptPatch}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {!isApproved ? (
                            <button
                              type="button"
                              onClick={() => {
                                approveMarketSuggestion(item.id);
                                toast.message(`Approved: ${item.title}`);
                              }}
                              className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 text-xs font-medium text-fg hover:border-[#b08a45]"
                            >
                              <Check className="size-3.5 text-[#b08a45]" />
                              Approve
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => handleApplySingle(item)}
                            className={cn(
                              "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition",
                              isApplied
                                ? "border border-emerald-600/40 bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20"
                                : "gold-fill text-[#2a1c0c]",
                            )}
                          >
                            {isApplied ? <CheckCircle2 className="size-3.5" /> : <Zap className="size-3.5" />}
                            {isApplied ? "Re-Apply Update" : "Apply Update"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleQueueSingle(item)}
                            className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 text-xs font-medium text-muted hover:text-fg"
                          >
                            <Clock className="size-3.5 text-[#b08a45]" />
                            Queue Pass
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
