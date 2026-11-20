import {
  AlertTriangle,
  BookmarkCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Languages,
  Minus,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RATIOS, type Ratio } from "@/lib/frame";
import {
  resolveArchviz100Preview,
  resolveLookPreview,
  resolvePreset200Preview,
  resolveZukeVizPreview,
  type PresetBeforeAfterPreview,
} from "@/lib/preset-previews";
import {
  ARCHVIZ_100_CATEGORIES,
  INTENT_LOOKS_40,
  PLAIN_QUESTIONS_8,
  PRESETS_200,
  PRESET_200_CATEGORIES,
  compileSentencePrompt,
  filterArchviz100,
  filterIntentLooks40,
  filterPresets200,
} from "@/lib/presets-catalog";
import {
  ZUKE_VIZ_CATEGORIES_14,
  fillZukePromptPlaceholders,
  filterZukeViz119,
  inferZukeVertical,
  type ZukeVizPrompt,
} from "@/lib/zuke-viz-library";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";

type MatrixTab = "presets200" | "archviz100" | "zuke119" | "looks40" | "questions8";

function PresetBeforeAfterStrip({
  preview,
  alt,
  heightClass = "h-20",
  badge,
  testId,
}: {
  preview: PresetBeforeAfterPreview;
  alt: string;
  heightClass?: string;
  badge?: string;
  testId?: string;
}) {
  const [split, setSplit] = useState(46);

  return (
    <div
      data-testid={testId}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (rect.width <= 0) return;
        const pct = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
        setSplit(pct);
      }}
      onMouseLeave={() => setSplit(46)}
      className={cn(
        "group/ba relative w-full shrink-0 overflow-hidden rounded-lg border border-[#d1c5b8]/45 bg-[#121c29] select-none dark:border-[#a9bdc9]/20",
        heightClass,
      )}
    >
      {/* After layer (base full width) */}
      <img
        src={preview.afterSrc}
        alt={`${alt} after`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={cn("h-full w-full object-cover", preview.afterFilterClass)}
      />
      {preview.afterTintClass !== "bg-transparent" ? (
        <div className={cn("pointer-events-none absolute inset-0", preview.afterTintClass)} />
      ) : null}

      {/* Before layer (pixel-aligned via clipPath) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
      >
        <img
          src={preview.beforeSrc}
          alt={`${alt} before`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn("h-full w-full object-cover", preview.beforeFilterClass)}
        />
      </div>

      {/* Divider hairline */}
      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#e8c98a] shadow-[0_0_6px_rgba(232,201,138,0.9)]"
        style={{ left: `${split}%` }}
      >
        <span className="absolute top-1/2 -left-1.5 grid size-3.5 -translate-y-1/2 place-items-center rounded-full border border-[#e8c98a] bg-[#0d1622] text-[7px] font-bold text-[#e8c98a]">
          ↔
        </span>
      </div>

      {/* Corner Before / After tags */}
      <span className="pointer-events-none absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-white/95 backdrop-blur-xs">
        {preview.beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-1 right-1 max-w-[54%] truncate rounded bg-black/75 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-[#e8c98a] backdrop-blur-xs">
        {preview.afterLabel}
      </span>
      {badge ? (
        <span className="pointer-events-none absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold text-[#cfe3f0]">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export function PresetMatrixPanel() {
  const idea = useOriel((s) => s.idea);
  const setIdea = useOriel((s) => s.setIdea);
  const setVertical = useOriel((s) => s.setVertical);
  const setFrame = useOriel((s) => s.setFrame);
  const design = useOriel((s) => s.design);
  const engine = useOriel((s) => s.engine);
  const frame = useOriel((s) => s.frame);
  const activePresetIds = useOriel((s) => s.activePresetIds);
  const negativePresetIds = useOriel((s) => s.negativePresetIds);
  const presetStrengths = useOriel((s) => s.presetStrengths);
  const questionPicks = useOriel((s) => s.questionPicks);
  const intentLookId = useOriel((s) => s.intentLookId);
  const designContract = useOriel((s) => s.designContract);
  const togglePreset200 = useOriel((s) => s.togglePreset200);
  const setPresetStrength = useOriel((s) => s.setPresetStrength);
  const clearPresets200 = useOriel((s) => s.clearPresets200);
  const setQuestionPick = useOriel((s) => s.setQuestionPick);
  const applyIntentLook = useOriel((s) => s.applyIntentLook);
  const { busy, generate } = useGenerate();

  const [tab, setTab] = useState<MatrixTab>("presets200");
  const [query, setQuery] = useState("");
  const [category200, setCategory200] = useState("All");
  const [category100, setCategory100] = useState("All");
  const [categoryZuke, setCategoryZuke] = useState("All");
  const [lookModeFilter, setLookModeFilter] = useState<"All" | "Strict" | "Balanced" | "Creative">("All");
  const [limit200, setLimit200] = useState(40);
  const [limit100, setLimit100] = useState(35);
  const [limitZuke, setLimitZuke] = useState(30);
  const [expandedPresetId, setExpandedPresetId] = useState<string | null>(null);
  const [expandedZukeId, setExpandedZukeId] = useState<string | null>(null);
  const [zukeSlots, setZukeSlots] = useState<Record<string, Record<string, string>>>({});
  const [zukeShowOriginal, setZukeShowOriginal] = useState<Record<string, boolean>>({});
  const [hoverBeforeAfter, setHoverBeforeAfter] = useState(50);

  const filtered200 = useMemo(
    () => filterPresets200(query, category200, "all"),
    [query, category200],
  );
  const filtered100 = useMemo(
    () => filterArchviz100(query, category100),
    [query, category100],
  );
  const filteredZuke = useMemo(
    () => filterZukeViz119(query, categoryZuke),
    [query, categoryZuke],
  );
  const filteredLooks = useMemo(
    () => filterIntentLooks40(query, lookModeFilter),
    [query, lookModeFilter],
  );

  const compiled = useMemo(
    () =>
      compileSentencePrompt({
        baseIdea: idea,
        activePresetIds,
        negativePresetIds,
        presetStrengths,
        questionPicks,
        design,
        engine,
        preserveClause: designContract.lockedPreserve ? designContract.preserveClause : undefined,
      }),
    [idea, activePresetIds, negativePresetIds, presetStrengths, questionPicks, design, engine, designContract],
  );

  const activeLook = INTENT_LOOKS_40.find((l) => l.id === intentLookId) ?? INTENT_LOOKS_40[0];
  const activePills = useMemo(
    () => PRESETS_200.filter((p) => activePresetIds.includes(p.id) || negativePresetIds.includes(p.id)),
    [activePresetIds, negativePresetIds],
  );

  function injectAndRender() {
    setIdea(compiled.sentence);
    void generate("plate");
  }

  function applyZukePrompt(item: ZukeVizPrompt) {
    const slotValues = zukeSlots[item.id] ?? {};
    const finalText = fillZukePromptPlaceholders(item.prompt, slotValues);
    setIdea(finalText);
    setVertical(inferZukeVertical(item));
    if (item.aspectRatio && (RATIOS as readonly string[]).includes(item.aspectRatio)) {
      setFrame({ ...frame, ratio: item.aspectRatio as Ratio });
    }
    toast.success(`Applied ${item.id} · ${item.title}`);
  }

  const activeCount =
    tab === "presets200"
      ? filtered200.length
      : tab === "archviz100"
        ? filtered100.length
        : tab === "zuke119"
          ? filteredZuke.length
          : filteredLooks.length;

  return (
    <aside
      data-testid="preset-matrix-panel"
      className="arctic-glass flex h-full min-h-[420px] flex-col justify-between gap-2 overflow-hidden rounded-[24px] p-3 text-[#1b1c1a] dark:text-[#d8e3f5]"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#d1c5b8]/35 pb-1.5 dark:border-[#a9bdc9]/20">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-[#725b38] dark:text-[#e8c98a]" />
          <div className="min-w-0">
            <h2 className="truncate font-display text-xs font-semibold uppercase tracking-[0.14em] text-[#1b1c1a] dark:text-[#e8eff3]">
              Prompt Preset Matrix
            </h2>
            <p className="truncate text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
              200 Pills · 100 ArchViz · 119 ZUKE · 40 Looks
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-[#c5a880]/45 bg-[#c5a880]/15 px-2 py-0.5 text-[10px] font-semibold text-[#725b38] dark:border-[#e8c98a]/40 dark:bg-[#584411]/70 dark:text-[#e8c98a]">
          v2.5 Live
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="grid shrink-0 grid-cols-5 gap-0.5 rounded-full bg-[#efeeea]/80 p-0.5 dark:bg-[#121c29]/80">
        {(
          [
            { id: "presets200", label: "200 Pills" },
            { id: "archviz100", label: "100 Cards" },
            { id: "zuke119", label: "119 ZUKE" },
            { id: "looks40", label: "40 Looks" },
            { id: "questions8", label: "8 Qs" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            data-testid={`matrix-tab-${item.id}`}
            onClick={() => setTab(item.id)}
            className={cn(
              "h-6.5 truncate rounded-full px-1 text-[9.5px] font-semibold transition",
              tab === item.id
                ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Search + Category / Mode Pills */}
      {tab !== "questions8" ? (
        <div className="flex shrink-0 flex-col gap-1.5">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-2.5 size-3.5 text-[#7f766a] dark:text-[#a9bdc9]" />
            <input
              type="text"
              data-testid="matrix-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "presets200"
                  ? "Filter 200 presets, lighting, materials…"
                  : tab === "archviz100"
                    ? "Filter 100 ArchViz scenes…"
                    : tab === "zuke119"
                      ? "Search ZV-001..119 prompts, categories, slots…"
                      : "Search 40 looks (L01–L40), modes, rules…"
              }
              className="h-8 w-full rounded-full border border-[#d1c5b8]/55 bg-white/80 pr-9 pl-8 text-[11px] text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8eff3] dark:placeholder:text-[#5f7f98] dark:focus:border-[#e8c98a]"
            />
            <span className="absolute right-2 rounded bg-[#eae8e4] px-1.5 py-0.5 font-mono text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#a9bdc9]">
              {activeCount}
            </span>
          </div>

          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto py-0.5">
            {tab === "looks40"
              ? (["All", "Strict", "Balanced", "Creative"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLookModeFilter(mode)}
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition",
                      lookModeFilter === mode
                        ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "bg-[#efeeea]/80 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38]/85 dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                    )}
                  >
                    {mode}
                  </button>
                ))
              : (tab === "presets200"
                  ? PRESET_200_CATEGORIES
                  : tab === "archviz100"
                    ? ARCHVIZ_100_CATEGORIES
                    : ZUKE_VIZ_CATEGORIES_14
                ).map((cat) => {
                  const selected =
                    (tab === "presets200"
                      ? category200
                      : tab === "archviz100"
                        ? category100
                        : categoryZuke) === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        if (tab === "presets200") setCategory200(cat);
                        else if (tab === "archviz100") setCategory100(cat);
                        else {
                          setCategoryZuke(cat);
                          setLimitZuke(30);
                        }
                      }}
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium transition",
                        selected
                          ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                          : "bg-[#efeeea]/80 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38]/85 dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
          </div>
        </div>
      ) : null}

      {/* Active Refinement Pills (+ / -) */}
      <div className="flex shrink-0 flex-col gap-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">
            Refinement Pills (+ / −)
          </span>
          <button
            type="button"
            onClick={() => clearPresets200()}
            className="font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]"
          >
            Clear ({activePills.length})
          </button>
        </div>
        <div className="flex max-h-16 flex-wrap gap-1 overflow-y-auto">
          {activePills.length === 0 ? (
            <span className="text-[10px] text-[#7f766a] dark:text-[#5f7f98]">
              Pick (+) or (−) presets below to shape lighting, shaders, and exclusions.
            </span>
          ) : (
            activePills.map((pill) => {
              const isNeg = negativePresetIds.includes(pill.id) || pill.is_negative;
              const str = presetStrengths[pill.id] ?? pill.strength ?? 1;
              return (
                <div
                  key={pill.id}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    isNeg
                      ? "border-rose-400/45 bg-rose-500/15 text-rose-700 dark:text-rose-200"
                      : "border-[#c5a880]/55 bg-[#c5a880]/20 text-[#513d1d] dark:border-[#e8c98a]/40 dark:bg-[#202b38] dark:text-[#e8c98a]",
                  )}
                >
                  <button
                    type="button"
                    title="Toggle Positive (+)"
                    onClick={() => togglePreset200(pill.id, "positive")}
                    className="font-bold hover:opacity-75"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedPresetId(expandedPresetId === pill.id ? null : pill.id)}
                    className="max-w-[110px] truncate"
                    title="Adjust preset strength"
                  >
                    {pill.name} {Math.abs(str - 1) > 0.05 ? `${str.toFixed(1)}×` : ""}
                  </button>
                  <button
                    type="button"
                    title="Toggle Negative (−)"
                    onClick={() => togglePreset200(pill.id, "negative")}
                    className="font-bold hover:text-rose-500"
                  >
                    −
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Scrollable Catalog Area */}
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
        {tab === "presets200" ? (
          <>
            {filtered200.slice(0, limit200).map((item) => {
              const isPos = activePresetIds.includes(item.id);
              const isNeg = negativePresetIds.includes(item.id);
              const str = presetStrengths[item.id] ?? item.strength ?? 1;
              const preview = resolvePreset200Preview(item);
              return (
                <div
                  key={item.id}
                  data-testid={`preset200-card-${item.id}`}
                  className={cn(
                    "flex flex-col gap-1.5 rounded-xl border p-2 transition",
                    isPos
                      ? "border-[#c5a880]/70 bg-[#c5a880]/12 dark:border-[#e8c98a]/45 dark:bg-[#202b38]/85"
                      : isNeg
                        ? "border-rose-400/50 bg-rose-500/10 dark:bg-[#202b38]/75"
                        : "border-[#d1c5b8]/40 bg-white/60 hover:bg-white/90 dark:border-[#43474b]/50 dark:bg-[#16202d]/70 dark:hover:bg-[#202b38]/80",
                  )}
                >
                  <PresetBeforeAfterStrip
                    preview={preview}
                    alt={item.name}
                    heightClass="h-[74px]"
                    testId={`preset200-ba-${item.id}`}
                  />
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="shrink-0 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]">
                        {item.id} · {str.toFixed(1)}×
                      </span>
                      <span className="truncate text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => togglePreset200(item.id, "positive")}
                        aria-label={`Include ${item.name}`}
                        className={cn(
                          "grid size-5 place-items-center rounded-full border text-[10px]",
                          isPos
                            ? "border-[#725b38] bg-[#c5a880] text-[#281800] dark:border-[#cfe3f0] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                            : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#43474b] dark:text-[#a9bdc9]",
                        )}
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePreset200(item.id, "negative")}
                        aria-label={`Exclude ${item.name}`}
                        className={cn(
                          "grid size-5 place-items-center rounded-full border text-[10px]",
                          isNeg
                            ? "border-rose-500 bg-rose-500 text-white"
                            : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#43474b] dark:text-[#a9bdc9]",
                        )}
                      >
                        <Minus className="size-3" />
                      </button>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-[10px] leading-relaxed text-[#4d463c] dark:text-[#a9bdc9]">
                    {item.fragment}
                  </p>
                  {expandedPresetId === item.id || isPos ? (
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">Weight</span>
                      <input
                        type="range"
                        min={0.5}
                        max={1.5}
                        step={0.05}
                        value={str}
                        onChange={(e) => setPresetStrength(item.id, Number(e.target.value))}
                        className="h-1 flex-1 accent-[#725b38] dark:accent-[#cfe3f0]"
                      />
                      <span className="font-mono text-[9px] text-[#1b1c1a] dark:text-[#e8c98a]">{str.toFixed(2)}×</span>
                    </div>
                  ) : null}
                </div>
              );
            })}
            {filtered200.length > limit200 ? (
              <button
                type="button"
                data-testid="presets200-load-more"
                onClick={() => setLimit200((n) => Math.min(filtered200.length, n + 40))}
                className="w-full rounded-xl border border-[#d1c5b8]/55 bg-white/75 py-1.5 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8c98a]"
              >
                Show more ({filtered200.length - limit200} remaining)
              </button>
            ) : null}
          </>
        ) : tab === "archviz100" ? (
          <>
            {filtered100.slice(0, limit100).map((preset) => {
              const preview = resolveArchviz100Preview(preset);
              return (
                <div
                  key={preset.id}
                  data-testid={`archviz100-card-${preset.id}`}
                  className="flex flex-col gap-1.5 rounded-xl border border-[#d1c5b8]/45 bg-white/65 p-2 transition hover:border-[#725b38] dark:border-[#43474b]/50 dark:bg-[#16202d]/75 dark:hover:border-[#e8c98a]/50"
                >
                  <PresetBeforeAfterStrip
                    preview={preview}
                    alt={preset.title}
                    heightClass="h-24"
                    testId={`archviz100-ba-${preset.id}`}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="mr-1.5 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]">
                        {preset.id}
                      </span>
                      <span className="truncate text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">
                        {preset.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIdea(preset.prompt);
                        toast.success(`Applied ArchViz preset: ${preset.title}`);
                      }}
                      className="shrink-0 rounded-full bg-[#c5a880] px-2.5 py-0.5 text-[10px] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="line-clamp-2 text-[10px] text-[#4d463c] dark:text-[#a9bdc9]">{preset.prompt}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#cfe3f0]">
                      {preset.lighting}
                    </span>
                    <span className="rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#e8c98a]">
                      {preset.camera}
                    </span>
                  </div>
                </div>
              );
            })}
            {filtered100.length > limit100 ? (
              <button
                type="button"
                data-testid="archviz100-load-more"
                onClick={() => setLimit100((n) => Math.min(filtered100.length, n + 35))}
                className="w-full rounded-xl border border-[#d1c5b8]/55 bg-white/75 py-1.5 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8c98a]"
              >
                Show more ({filtered100.length - limit100} remaining)
              </button>
            ) : null}
          </>
        ) : tab === "zuke119" ? (
          <>
            {filteredZuke.slice(0, limitZuke).map((item) => {
              const preview = resolveZukeVizPreview(item);
              const isExpanded = expandedZukeId === item.id;
              const showPt = Boolean(zukeShowOriginal[item.id] && item.originalPrompt);
              const slotValues = zukeSlots[item.id] ?? {};
              const displayedPrompt = showPt
                ? (item.originalPrompt ?? item.prompt)
                : fillZukePromptPlaceholders(item.prompt, slotValues);

              return (
                <div
                  key={item.id}
                  data-testid={`zuke119-card-${item.id}`}
                  className="flex flex-col gap-1.5 rounded-xl border border-[#d1c5b8]/45 bg-white/65 p-2 transition hover:border-[#725b38] dark:border-[#43474b]/50 dark:bg-[#16202d]/75 dark:hover:border-[#e8c98a]/50"
                >
                  <PresetBeforeAfterStrip
                    preview={preview}
                    alt={item.title}
                    heightClass="h-22"
                    badge={item.aspectRatio ?? item.batch}
                    testId={`zuke119-ba-${item.id}`}
                  />
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="shrink-0 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]">
                        {item.id}
                      </span>
                      <span className="truncate text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">
                        {item.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      data-testid={`zuke119-apply-${item.id}`}
                      onClick={() => applyZukePrompt(item)}
                      className="shrink-0 rounded-full bg-[#c5a880] px-2.5 py-0.5 text-[10px] font-semibold text-[#281800] transition hover:brightness-95 dark:bg-[#cfe3f0] dark:text-[#08131f]"
                    >
                      Apply
                    </button>
                  </div>

                  <p className={cn("text-[10px] leading-relaxed text-[#4d463c] dark:text-[#a9bdc9]", isExpanded ? "" : "line-clamp-2")}>
                    {displayedPrompt}
                  </p>

                  <div className="flex flex-wrap items-center gap-1">
                    <span className="rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#cfe3f0]">
                      {item.category}
                    </span>
                    {item.requiresReference ? (
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:text-[#e8c98a]">
                        Ref Input
                      </span>
                    ) : null}
                    {item.originalPrompt ? (
                      <button
                        type="button"
                        onClick={() =>
                          setZukeShowOriginal((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className="inline-flex items-center gap-0.5 rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] font-medium text-[#725b38] hover:bg-[#e5dfd4] dark:bg-[#2b3643] dark:text-[#e8c98a]"
                      >
                        <Languages className="size-2.5" />
                        {showPt ? "EN" : "PT"}
                      </button>
                    ) : null}
                    {item.placeholders.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setExpandedZukeId(isExpanded ? null : item.id)}
                        className="ml-auto inline-flex items-center gap-0.5 rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] font-semibold text-[#725b38] hover:bg-[#e5dfd4] dark:bg-[#2b3643] dark:text-[#e8c98a]"
                      >
                        Slots ({item.placeholders.length})
                        {isExpanded ? <ChevronUp className="size-2.5" /> : <ChevronDown className="size-2.5" />}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setExpandedZukeId(isExpanded ? null : item.id)}
                        className="ml-auto inline-flex items-center gap-0.5 text-[9px] font-medium text-[#7f766a] hover:text-[#1b1c1a] dark:text-[#a9bdc9]"
                      >
                        {isExpanded ? "Less" : "Full"}
                      </button>
                    )}
                  </div>

                  {isExpanded && item.placeholders.length > 0 ? (
                    <div className="mt-0.5 grid grid-cols-1 gap-1 rounded-lg border border-[#d1c5b8]/40 bg-[#fbf9f5]/90 p-1.5 dark:border-[#43474b]/50 dark:bg-[#0d1622]/85">
                      {item.placeholders.map((slot) => (
                        <label key={slot} className="flex items-center gap-1.5 text-[9px]">
                          <span className="w-24 shrink-0 truncate font-mono text-[#725b38] dark:text-[#e8c98a]" title={slot}>
                            [{slot}]
                          </span>
                          <input
                            type="text"
                            value={slotValues[slot] ?? ""}
                            onChange={(e) =>
                              setZukeSlots((prev) => ({
                                ...prev,
                                [item.id]: { ...(prev[item.id] ?? {}), [slot]: e.target.value },
                              }))
                            }
                            placeholder={`Enter ${slot}…`}
                            className="h-6 min-w-0 flex-1 rounded border border-[#d1c5b8]/50 bg-white px-1.5 text-[10px] text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#43474b] dark:bg-[#16202d] dark:text-[#e8eff3]"
                          />
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {isExpanded && item.note ? (
                    <p className="rounded-lg bg-[#efeeea]/70 px-2 py-1 text-[9.5px] text-[#4d463c] dark:bg-[#121c29] dark:text-[#a9bdc9]">
                      {item.note}
                    </p>
                  ) : null}
                </div>
              );
            })}
            {filteredZuke.length > limitZuke ? (
              <button
                type="button"
                data-testid="zuke119-load-more"
                onClick={() => setLimitZuke((n) => Math.min(filteredZuke.length, n + 30))}
                className="w-full rounded-xl border border-[#d1c5b8]/55 bg-white/75 py-1.5 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8c98a]"
              >
                Show more ({filteredZuke.length - limitZuke} remaining)
              </button>
            ) : null}
          </>
        ) : tab === "looks40" ? (
          <div className="space-y-2">
            {/* Before / After Live Look Preview (pixel-aligned via clipPath) */}
            <div
              data-testid="looks40-hero-ba"
              className="relative h-28 overflow-hidden rounded-xl border border-[#d1c5b8]/50 select-none dark:border-[#a9bdc9]/25"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
                setHoverBeforeAfter(pct);
              }}
            >
              <img
                src={activeLook.thumbnail}
                alt={activeLook.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - hoverBeforeAfter}% 0 0)` }}
              >
                <img
                  src={activeLook.beforeThumb}
                  alt="Before"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#e8c98a] shadow-[0_0_8px_#e8c98a]"
                style={{ left: `${hoverBeforeAfter}%` }}
              />
              <span className="pointer-events-none absolute top-1.5 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[9px] text-white">
                Before
              </span>
              <span className="pointer-events-none absolute top-1.5 right-2 rounded-full bg-black/75 px-2 py-0.5 text-[9px] text-[#e8c98a]">
                {activeLook.code} · {activeLook.name}
              </span>
              {activeLook.rules ? (
                <span className="pointer-events-none absolute right-2 bottom-1.5 left-2 flex items-center gap-1 truncate rounded-md bg-amber-950/85 px-2 py-0.5 text-[9px] font-medium text-amber-200 backdrop-blur-xs">
                  <ShieldAlert className="size-3 shrink-0 text-amber-300" />
                  <span className="truncate">Rule: {activeLook.rules}</span>
                </span>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {filteredLooks.map((look) => {
                const active = look.id === intentLookId;
                const preview = resolveLookPreview(look);
                return (
                  <button
                    key={look.id}
                    type="button"
                    data-testid={`intent-look-${look.code}`}
                    onClick={() => {
                      applyIntentLook(look.id);
                      toast.success(
                        look.rules
                          ? `Look ${look.code}: ${look.name} · Rule: ${look.rules}`
                          : `Look ${look.code}: ${look.name} (${look.fidelity} lock)`,
                      );
                    }}
                    className={cn(
                      "group overflow-hidden rounded-xl border text-left transition",
                      active
                        ? "border-[#725b38] ring-1 ring-[#c5a880] dark:border-[#e8c98a] dark:ring-[#e8c98a]/50"
                        : "border-[#d1c5b8]/45 bg-white/60 dark:border-[#43474b]/60 dark:bg-[#16202d]/80",
                    )}
                  >
                    <PresetBeforeAfterStrip
                      preview={preview}
                      alt={look.name}
                      heightClass="h-16"
                      badge={look.fidelity}
                    />
                    <div className="p-1.5">
                      <div className="flex items-center gap-1">
                        <span className="shrink-0 rounded bg-[#efeeea] px-1 py-0.2 font-mono text-[8.5px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]">
                          {look.code}
                        </span>
                        <p className="truncate text-[10px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">{look.name}</p>
                      </div>
                      <p className="truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">{look.bestFor}</p>
                      {look.rules ? (
                        <p className="mt-0.5 flex items-center gap-0.5 truncate text-[8.5px] font-medium text-amber-700 dark:text-amber-300">
                          <ShieldAlert className="size-2.5 shrink-0" />
                          <span className="truncate">{look.rules}</span>
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {PLAIN_QUESTIONS_8.map((q) => (
              <div
                key={q.id}
                className="rounded-xl border border-[#d1c5b8]/45 bg-white/65 p-2 dark:border-[#43474b]/60 dark:bg-[#16202d]/75"
              >
                <div className="mb-1 flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">{q.question}</span>
                  <span className="text-[#725b38] dark:text-[#e8c98a]">{questionPicks[q.id] ?? "Auto"}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {q.tiles.map((tile) => {
                    const picked = (questionPicks[q.id] ?? "Auto") === tile;
                    return (
                      <button
                        key={tile}
                        type="button"
                        onClick={() => setQuestionPick(q.id, tile)}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] transition",
                          picked
                            ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                            : "bg-[#efeeea]/80 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                        )}
                      >
                        {tile}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Linter + Sentence Preview + Synthesize & Inject (8 CR) */}
      <div className="flex shrink-0 flex-col gap-1.5 rounded-xl border border-[#d1c5b8]/50 bg-white/75 p-2 dark:border-[#43474b]/55 dark:bg-[#16202d]/80">
        <div className="flex items-center justify-between gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-[#1b1c1a] dark:text-[#e8eff3]">
            <BookmarkCheck className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
            Sentence & Linter
          </span>
          {compiled.issues.length === 0 ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-300">
              <CheckCircle2 className="size-3" /> L01–L08 Clear
            </span>
          ) : (
            <span
              title={compiled.issues.map((i) => i.message).join("\n")}
              className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-[#e8c98a]"
            >
              <AlertTriangle className="size-3" /> {compiled.issues.length} lint note{compiled.issues.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={2}
          placeholder="Append custom architectural direction or compile active presets…"
          className="w-full resize-none rounded-lg border border-[#d1c5b8]/45 bg-[#fbf9f5] p-1.5 text-[11px] leading-snug text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#43474b]/45 dark:bg-[#050f1b]/85 dark:text-[#e8eff3] dark:placeholder:text-[#5f7f98] dark:focus:border-[#cfe3f0]"
        />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIdea(compiled.sentence);
              toast.success(`Injected compiled prompt (${frame.ratio}, Keep rule locked)`);
            }}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white text-[10px] font-semibold text-[#1b1c1a] hover:border-[#725b38] dark:border-[#a9bdc9]/30 dark:bg-[#202b38] dark:text-[#cfe3f0] dark:hover:border-[#cfe3f0]"
          >
            <Wand2 className="size-3" /> Compile Brief
          </button>
          <button
            type="button"
            disabled={busy}
            data-testid="matrix-synthesize-btn"
            onClick={injectAndRender}
            className="ice-cta inline-flex h-8 flex-[1.5] items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold tracking-wide disabled:opacity-60"
          >
            <Eye className="size-3.5" />
            <span>{busy ? "Rendering…" : `Synthesize (${compiled.estimatedCredits} CR)`}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
