import {
  Check,
  ExternalLink,
  Grid,
  Loader2,
  Maximize2,
  Pin,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  MoodboardFacet,
  MoodboardGenerationResult,
  MoodboardImageItem,
  MoodboardQuerySpec,
} from "@/lib/brief-moodboard";
import { cn } from "@/lib/utils";

interface MoodboardOverlayProps {
  open: boolean;
  onClose: () => void;
  queries: MoodboardQuerySpec[];
  result: MoodboardGenerationResult | null;
  loading: boolean;
  error: string | null;
  customQuery: string;
  onCustomQueryChange: (query: string) => void;
  onGenerate: (overrideQuery?: string) => Promise<void>;
  onPinToBrief: (item: MoodboardImageItem) => void;
  pinnedIds: string[];
}

export function MoodboardOverlay({
  open,
  onClose,
  queries,
  result,
  loading,
  error,
  customQuery,
  onCustomQueryChange,
  onGenerate,
  onPinToBrief,
  pinnedIds,
}: MoodboardOverlayProps) {
  const [activeFacet, setActiveFacet] = useState<MoodboardFacet | "All">("All");
  const [inspectedItem, setInspectedItem] = useState<MoodboardImageItem | null>(null);
  const [fallbackFullMap, setFallbackFullMap] = useState<Record<string, boolean>>({});
  const [brokenIds, setBrokenIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (inspectedItem) setInspectedItem(null);
        else onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, inspectedItem, onClose]);

  const visibleItems = useMemo(() => {
    const items = result?.items ?? [];
    return items.filter((item) => {
      if (brokenIds[item.id]) return false;
      if (activeFacet !== "All" && item.facet !== activeFacet) return false;
      return true;
    });
  }, [result?.items, activeFacet, brokenIds]);

  const facetsPresent = useMemo(() => {
    const set = new Set<MoodboardFacet>();
    for (const item of result?.items ?? []) {
      if (!brokenIds[item.id]) set.add(item.facet);
    }
    return [...set];
  }, [result?.items, brokenIds]);

  if (!open) return null;

  function handleImageError(item: MoodboardImageItem) {
    if (!fallbackFullMap[item.id] && item.fullUrl && item.fullUrl !== item.thumbnailUrl) {
      setFallbackFullMap((prev) => ({ ...prev, [item.id]: true }));
    } else {
      setBrokenIds((prev) => ({ ...prev, [item.id]: true }));
    }
  }

  return (
    <div
      data-testid="moodboard-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Automated Architectural Moodboard Grid"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-xs md:p-6"
      onClick={onClose}
    >
      <div
        className="flex h-[min(88vh,860px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-line bg-surface text-fg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Overlay Header */}
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-raised/70 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Grid className="size-4 text-[#b08a45]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b08a45]">
                Automated Reference Moodboard · Public Archive API
              </span>
            </div>
            <h2 className="mt-0.5 font-serif text-xl font-bold text-fg">
              Brief-Parsed Architectural Inspiration Grid
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              data-testid="moodboard-refresh-btn"
              disabled={loading}
              onClick={() => {
                setActiveFacet("All");
                void onGenerate("");
              }}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d4b06a]/60 bg-surface px-3.5 text-xs font-semibold text-fg transition hover:border-[#b08a45] disabled:opacity-60"
            >
              <RefreshCw className={cn("size-3.5 text-[#b08a45]", loading && "animate-spin")} />
              Sync From Brief
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close moodboard overlay"
              className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {/* Extracted Brief Queries & Custom Search Bar */}
        <div className="shrink-0 border-b border-line bg-bg/60 px-5 py-3">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-faint">Parsed Facets:</span>
              <button
                type="button"
                onClick={() => setActiveFacet("All")}
                className={cn(
                  "h-7 shrink-0 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition",
                  activeFacet === "All"
                    ? "gold-fill border-transparent text-[#2a1c0c]"
                    : "border-line bg-surface text-muted hover:text-fg",
                )}
              >
                All ({visibleItems.length})
              </button>
              {facetsPresent.map((facet) => (
                <button
                  key={facet}
                  type="button"
                  onClick={() => setActiveFacet(facet)}
                  className={cn(
                    "h-7 shrink-0 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition",
                    activeFacet === facet
                      ? "gold-fill border-transparent text-[#2a1c0c]"
                      : "border-line bg-surface text-muted hover:text-fg",
                  )}
                >
                  {facet}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveFacet("All");
                void onGenerate(customQuery);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1 sm:w-64">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" />
                <input
                  type="search"
                  data-testid="moodboard-custom-query-input"
                  value={customQuery}
                  onChange={(e) => onCustomQueryChange(e.target.value)}
                  placeholder="Override brief search query..."
                  className="h-8 w-full rounded-xl border border-line bg-surface pr-3 pl-8 text-xs text-fg outline-none focus:border-[#d4b06a]"
                />
              </div>
              <button
                type="submit"
                data-testid="moodboard-custom-search-btn"
                disabled={loading}
                className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60"
              >
                <Sparkles className="size-3" />
                Search API
              </button>
            </form>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
            {(result?.queries ?? queries).map((q) => (
              <span key={`${q.facet}-${q.query}`} className="font-mono">
                <strong className="text-[#b08a45]">{q.facet}:</strong> &ldquo;{q.query}&rdquo;
              </span>
            ))}
            {result?.providersUsed?.length ? (
              <span className="ml-auto font-mono text-[10px] text-faint">
                Sources: {result.providersUsed.join(" + ")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Grid Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="size-7 animate-spin text-[#b08a45]" />
              <div>
                <p className="text-sm font-semibold text-fg">
                  Parsing brief &amp; retrieving architectural references...
                </p>
                <p className="mt-1 text-xs text-muted">
                  Querying Openverse &amp; Wikimedia Commons photographic archives
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-lg rounded-2xl border border-red-400/40 bg-red-50 p-6 text-center text-xs text-red-900">
              <p className="font-semibold">Unable to retrieve reference imagery</p>
              <p className="mt-1 text-red-800">{error}</p>
              <button
                type="button"
                onClick={() => void onGenerate(customQuery)}
                className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-400 bg-white px-3 text-xs font-medium text-red-900"
              >
                Retry Public API Fetch
              </button>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl border border-dashed border-line bg-raised/40 p-8 text-center text-xs text-muted">
              <p className="font-semibold text-fg">No matching photographs returned</p>
              <p className="mt-1">
                Try refining your architectural directives or entering a broader material or typology query above.
              </p>
            </div>
          ) : (
            <div
              data-testid="moodboard-grid"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {visibleItems.map((item) => {
                const imgSrc = fallbackFullMap[item.id] ? item.fullUrl : item.thumbnailUrl;
                const isPinned = pinnedIds.includes(item.id);
                return (
                  <article
                    key={item.id}
                    data-testid="moodboard-card"
                    className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-raised/50 transition hover:border-[#b08a45]"
                  >
                    <button
                      type="button"
                      onClick={() => setInspectedItem(item)}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-raised text-left"
                      title={`Inspect ${item.title}`}
                    >
                      <img
                        src={imgSrc}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        decoding="async"
                        onError={() => handleImageError(item)}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </button>

                    <div className="flex flex-1 flex-col justify-between gap-2.5 p-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#b08a45]">
                          <span>{item.facet}</span>
                          <span className="font-mono text-faint">{item.provider}</span>
                        </div>
                        <h3 className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-fg">
                          {item.title}
                        </h3>
                        <p className="mt-1 truncate text-[11px] text-muted">
                          {item.creator} · {item.license}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-line/70 pt-2">
                        <button
                          type="button"
                          data-testid="moodboard-pin-btn"
                          onClick={() => onPinToBrief(item)}
                          disabled={isPinned}
                          className={cn(
                            "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition",
                            isPinned
                              ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-700"
                              : "border-line bg-surface text-fg hover:border-[#d4b06a]",
                          )}
                        >
                          {isPinned ? <Check className="size-3" /> : <Pin className="size-3 text-[#b08a45]" />}
                          {isPinned ? "Pinned" : "Pin to Brief"}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setInspectedItem(item)}
                            className="grid size-7 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg"
                            aria-label={`Inspect ${item.title}`}
                          >
                            <Maximize2 className="size-3" />
                          </button>
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="grid size-7 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg"
                            aria-label={`Open source page for ${item.title}`}
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Inspector */}
      {inspectedItem ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setInspectedItem(null);
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface text-fg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">{inspectedItem.title}</p>
                <p className="text-xs text-muted">
                  {inspectedItem.creator} · {inspectedItem.license} · {inspectedItem.provider}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                aria-label="Close photo preview"
                className="grid size-8 place-items-center rounded-lg border border-line bg-raised text-fg"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-hidden bg-black/90">
              <img
                src={fallbackFullMap[inspectedItem.id] ? inspectedItem.fullUrl : inspectedItem.thumbnailUrl}
                alt={inspectedItem.title}
                referrerPolicy="no-referrer"
                className="mx-auto max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-xs">
              <span className="font-mono text-muted">Query: &ldquo;{inspectedItem.queryUsed}&rdquo;</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPinToBrief(inspectedItem)}
                  className="gold-fill inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-[#2a1c0c]"
                >
                  <Pin className="size-3.5" />
                  Pin Reference to Directives
                </button>
                <a
                  href={inspectedItem.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-raised px-3 text-xs font-medium text-fg"
                >
                  <ExternalLink className="size-3.5" /> Source
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
