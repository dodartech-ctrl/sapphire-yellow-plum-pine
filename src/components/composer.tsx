import {
  Armchair,
  ChevronDown,
  ChevronUp,
  Clock,
  Grid2X2,
  ImagePlus,
  Layers,
  Loader2,
  MessageSquare,
  SlidersHorizontal,
  Sparkles,
  Sun,
  SwatchBook,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BatchRenderQueue } from "@/components/batch-render-queue";
import { MidLayerBar } from "@/components/mid-layer-bar";
import { appendSuggestionToIdea, getMidLayerPresetById } from "@/lib/archviz-dictionary";
import { ATELIER_REFINEMENT_CHIPS } from "@/lib/atelier-studio";
import { PLATE_COST } from "@/lib/credits";
import { RATIOS, RESOLUTIONS, frameEdge } from "@/lib/frame";
import { enhanceIdea } from "@/lib/generate";
import { LIGHTS, LOOKS } from "@/lib/properties";
import { readImage } from "@/lib/read-image";
import { useHydrated, useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { STAGE_ENTOURAGE_TAGS, appendEntourageTagToIdea } from "@/lib/workflow-journey";
import { cn } from "@/lib/utils";

export function Composer() {
  const upload = useOriel((state) => state.upload);
  const setUpload = useOriel((state) => state.setUpload);
  const idea = useOriel((state) => state.idea);
  const setIdea = useOriel((state) => state.setIdea);
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const credits = useOriel((state) => state.credits);
  const frame = useOriel((state) => state.frame);
  const setFrame = useOriel((state) => state.setFrame);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setPanel = useOriel((state) => state.setPanel);
  const midLayerPreset = useOriel((state) => state.midLayerPreset);
  const queue = useOriel((state) => state.queue);
  const chat = useOriel((state) => state.chat);
  const { busy, generate, generateGrid } = useGenerate();

  const [enhancing, setEnhancing] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [entourageOpen, setEntourageOpen] = useState(false);
  const [midLayerOpen, setMidLayerOpen] = useState(false);
  const [queueDrawerOpen, setQueueDrawerOpen] = useState(false);
  const [threadOpen, setThreadOpen] = useState(true);
  const [chatFocused, setChatFocused] = useState(false);

  const hydrated = useHydrated();
  const fileRef = useRef<HTMLInputElement>(null);
  const ideaRef = useRef<HTMLTextAreaElement>(null);

  const activeMidLayer = midLayerPreset ? getMidLayerPresetById(midLayerPreset) : null;
  const showQueue = queueDrawerOpen || queue.length > 0;
  const hasThread = chat.length > 0;

  // Preserve any prompt text typed during SSR -> React hydration
  useEffect(() => {
    const domVal = ideaRef.current?.value;
    if (domVal && domVal.trim() && !useOriel.getState().idea.trim()) {
      setIdea(domVal);
    }
  }, [setIdea]);

  // Auto-expand textarea height smoothly as prompt text grows
  useEffect(() => {
    const el = ideaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const minH = chatFocused ? 46 : 38;
    const nextH = Math.max(minH, Math.min(el.scrollHeight, 144));
    el.style.height = `${nextH}px`;
  }, [idea, chatFocused]);

  // Auto-expand thread strip whenever new chat replies arrive
  useEffect(() => {
    if (chat.length > 0) {
      setThreadOpen(true);
    }
  }, [chat.length]);

  useEffect(() => {
    function focusIdea() {
      ideaRef.current?.focus();
    }
    window.addEventListener("oriel-focus-idea", focusIdea);
    return () => window.removeEventListener("oriel-focus-idea", focusIdea);
  }, []);

  function triggerRender() {
    const domVal = ideaRef.current?.value;
    if (typeof domVal === "string" && domVal.trim() && domVal !== useOriel.getState().idea) {
      setIdea(domVal);
    }
    void generate();
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setUpload(await readImage(file, frameEdge(frame.resolution)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image.");
    }
  }

  return (
    <div className="shrink-0 space-y-2.5" data-testid="bottom-chat-dock">
      {/* Studio Dialogue Thread (Visible when messages exist) */}
      {hasThread ? (
        <div className="rounded-2xl border border-[#d1c5b8]/40 bg-white/75 px-3.5 py-2 backdrop-blur-xl shadow-xs dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
          <button
            type="button"
            onClick={() => setThreadOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"
          >
            <MessageSquare className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
            <span>Studio Thread · {chat.length} msg</span>
            {threadOpen ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
          </button>

          {threadOpen ? (
            <ul className="mt-1.5 flex flex-col gap-1">
              {chat.slice(-2).map((line) => (
                <li
                  key={line.id}
                  className={cn(
                    "truncate rounded-xl px-2.5 py-1 text-xs",
                    line.role === "you"
                      ? "bg-[#f5f3ef] font-medium text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8eff3]"
                      : "bg-white text-[#4d463c] dark:bg-[#050f1b]/80 dark:text-[#cfe3f0]",
                  )}
                >
                  <span className="mr-1.5 font-mono text-[10px] uppercase text-[#725b38] dark:text-[#e8c98a]">
                    {line.role === "you" ? "You" : "Oriel"}
                  </span>
                  {line.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* Expandable Mid-Layer & House Style Preset Tray */}
      {midLayerOpen ? <MidLayerBar /> : null}

      {/* Expandable Sequential Batch Render Queue (Auto-shown when items exist) */}
      {showQueue ? (
        <BatchRenderQueue onClose={queue.length === 0 ? () => setQueueDrawerOpen(false) : undefined} />
      ) : null}

      {/* Atelier / Arctic Harbor Frosted Glass Prompt Composer Card */}
      <div role="region" aria-label="Render Prompt Composer">
        <div
          className={cn(
            "arctic-glass rounded-3xl border p-3.5 sm:p-4 transition-[border-color,box-shadow] duration-150",
            chatFocused ? "border-[#725b38]/60 ring-2 ring-[#c5a880]/25 dark:border-[#cfe3f0]/55 dark:ring-[#cfe3f0]/20" : "",
          )}
        >
          {/* Tier 0: Inject Refinements + Keep Clause + Seed Readout */}
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="shrink-0 font-display text-[11px] font-medium uppercase tracking-widest text-[#725b38] dark:text-[#e8c98a]">
                Inject Refinements:
              </span>
              {ATELIER_REFINEMENT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setIdea(appendSuggestionToIdea(idea, chip));
                    ideaRef.current?.focus();
                  }}
                  className="shrink-0 rounded-full bg-[#efeeea]/80 px-2.5 py-1 text-[11px] text-[#4d463c] transition hover:bg-[#c5a880]/25 hover:text-[#1b1c1a] dark:bg-[#202b38]/85 dark:text-[#cfe3f0] dark:hover:border-[#e8c98a] dark:hover:text-white"
                >
                  + {chip}
                </button>
              ))}
            </div>
            <div className="hidden shrink-0 items-center gap-2 font-mono text-[11px] tabular-nums text-[#5a5e68] md:flex dark:text-[#a9bdc9]">
              <span className="rounded-full bg-[#c5a880]/15 px-2 py-0.5 text-[10px] font-semibold text-[#725b38] dark:bg-[#584411]/60 dark:text-[#e8c98a]">
                {engine.outputMode === "grid-4" ? 16 : PLATE_COST} CR
              </span>
              <span>Seed #{engine.seed}</span>
            </div>
          </div>

          {/* Tier 1: Reference Image + Auto-Expanding Input + Engine Badge + Render Plate */}
          <div className="flex flex-col gap-2 rounded-2xl bg-[#fbf9f5]/85 p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.03)] sm:flex-row sm:items-end dark:bg-[#050f1b]/85 dark:border dark:border-[#a9bdc9]/20">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#e4e2de]/70 text-[#725b38] transition hover:bg-[#c5a880]/25 dark:bg-[#16202d] dark:text-[#e8c98a]"
                aria-label={upload ? "Replace reference image" : "Upload a reference image"}
                title={upload ? "Replace reference image" : "Attach photo, plan, or massing image"}
              >
                {upload ? <img src={upload} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="size-4.5 text-[#725b38] dark:text-[#e8c98a]" />}
                {upload ? (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      setUpload(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.stopPropagation();
                        setUpload(null);
                      }
                    }}
                    className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-[#1b1c1a] text-[9px] text-white"
                    aria-label="Remove image"
                  >
                    <X className="size-2.5" />
                  </span>
                ) : null}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                suppressHydrationWarning
                onChange={(event) => {
                  void onFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <label className="min-w-0 flex-1">
                <span className="sr-only">Your idea</span>
                <textarea
                  ref={ideaRef}
                  value={idea}
                  rows={1}
                  aria-label="Your idea"
                  onFocus={() => setChatFocused(true)}
                  onBlur={() => setChatFocused(false)}
                  onChange={(event) => setIdea(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      triggerRender();
                    }
                  }}
                  placeholder="Describe your architectural refinement, materials, or lighting atmosphere..."
                  className="max-h-36 min-h-[38px] w-full resize-none overflow-y-auto bg-transparent px-1 py-1.5 text-sm font-light leading-snug text-[#1b1c1a] outline-none placeholder:text-[#7f766a] dark:text-[#e8eff3] dark:placeholder:text-[#5f7f98]"
                  suppressHydrationWarning
                />
              </label>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
              {!toolsOpen ? (
                <button
                  type="button"
                  onClick={() => setToolsOpen(true)}
                  className="hidden h-9 items-center gap-1.5 rounded-xl bg-[#f5f3ef] px-2.5 text-[11px] font-medium text-[#4d463c] transition hover:bg-[#efeeea] hover:text-[#1b1c1a] xl:inline-flex dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:bg-[#202b38]"
                  title="Active Aspect Ratio, Resolution & Lighting — click to edit"
                >
                  <Sun className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
                  <span>{frame.ratio} · {design.light}</span>
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setPanel("engine")}
                className="hidden h-9 items-center gap-1.5 rounded-xl bg-[#f5f3ef] px-3 text-[11px] font-medium text-[#4d463c] transition hover:bg-[#efeeea] hover:text-[#1b1c1a] sm:inline-flex dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:bg-[#202b38]"
                title="Active Engine Preset — click to configure in Inspector"
              >
                <SlidersHorizontal className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
                <span className="capitalize">{engine.workflowPreset.replace(/-/g, " ")}</span>
              </button>
              <button
                type="button"
                data-testid="toggle-studio-tools-btn"
                aria-expanded={toolsOpen}
                onClick={() => setToolsOpen((v) => !v)}
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-[#d1c5b8]/45 bg-white px-2.5 text-xs font-medium text-[#4d463c] transition hover:border-[#725b38] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"
                title={toolsOpen ? "Collapse chat controls" : "Show all chat controls"}
              >
                <span className="hidden sm:inline">{toolsOpen ? "Compact" : "Controls"}</span>
                {toolsOpen ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void generateGrid()}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d1c5b8]/50 bg-white px-3 text-xs font-medium text-[#1b1c1a] transition hover:border-[#725b38] disabled:opacity-50 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
                title="Generate 4-up concept grid"
              >
                <Grid2X2 className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" /> 4-Up
              </button>
              <button
                type="button"
                data-testid="render-plate-btn"
                data-hydrated={hydrated ? "true" : "false"}
                disabled={busy || credits < PLATE_COST}
                onClick={triggerRender}
                className="ice-cta inline-flex h-9.5 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 text-xs font-semibold tracking-wide disabled:opacity-60"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                <span>{busy ? "Rendering..." : engine.outputMode === "grid-4" ? "Render 4-Up" : "Render Plate"}</span>
                <kbd className="hidden rounded bg-[#08131f]/15 px-1.5 py-0.5 font-mono text-[10px] sm:inline">⌘↵</kbd>
              </button>
            </div>
          </div>

          {/* Tier 2: Easy-View Unified Studio Controls (All Key Controls Retained) */}
          {toolsOpen ? (
            <div data-testid="studio-tools-drawer" className="mt-2.5 space-y-2 border-t border-[#d1c5b8]/35 pt-2.5 dark:border-[#a9bdc9]/20">
              <div className="flex flex-wrap items-center gap-2">
                {/* Segmented Aspect Ratios */}
                <div
                  className="inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[#efeeea]/80 p-0.5 dark:bg-[#121c29]"
                  role="group"
                  aria-label="Aspect Ratio"
                >
                  {RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      aria-pressed={frame.ratio === ratio}
                      onClick={() => setFrame({ ...frame, ratio })}
                      className={cn(
                        "h-6.5 shrink-0 whitespace-nowrap rounded-full px-2.5 text-[11px] transition",
                        frame.ratio === ratio
                          ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]"
                          : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                      )}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>

                {/* Segmented Quality */}
                <div
                  className="inline-flex items-center gap-0.5 rounded-full bg-[#efeeea]/80 p-0.5 dark:bg-[#121c29]"
                  role="group"
                  aria-label="Resolution"
                >
                  {RESOLUTIONS.map((resolution) => (
                    <button
                      key={resolution}
                      type="button"
                      aria-pressed={frame.resolution === resolution}
                      onClick={() => setFrame({ ...frame, resolution })}
                      className={cn(
                        "h-6.5 shrink-0 whitespace-nowrap rounded-full px-2.5 text-[11px] uppercase transition",
                        frame.resolution === resolution
                          ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]"
                          : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                      )}
                    >
                      {resolution}
                    </button>
                  ))}
                </div>

                {/* Unique Studio Actions */}
                <div className="flex flex-wrap items-center gap-1 sm:ml-auto">
                  <button
                    type="button"
                    disabled={enhancing || busy}
                    onClick={() => {
                      setEnhancing(true);
                      void enhanceIdea({ data: { idea, design } })
                        .then((result) => {
                          setIdea(result.idea);
                          if ("warning" in result && typeof result.warning === "string" && result.warning) {
                            toast.message(result.warning);
                          } else {
                            toast.success("Prompt refined");
                          }
                        })
                        .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Could not enhance that idea."))
                        .finally(() => setEnhancing(false));
                    }}
                    className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs text-[#4d463c] transition hover:bg-[#efeeea] hover:text-[#1b1c1a] disabled:opacity-60 dark:text-[#cfe3f0] dark:hover:bg-[#202b38]"
                    title="Expand and polish prompt wording with AI"
                  >
                    {enhancing ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />} Refine Prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const looks = LOOKS[design.vertical];
                      const index = looks.findIndex((item) => item.name === design.look);
                      const next = looks[(index + 1) % looks.length].name;
                      setPanel("design");
                      setDesignField("look", next);
                      toast.success(`Style: ${next}`);
                    }}
                    className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#c5a880]/25 px-2.5 text-xs font-medium text-[#513d1d] transition hover:bg-[#c5a880]/40 dark:bg-[#202b38] dark:text-[#e8c98a]"
                    title="Cycle architectural aesthetic style"
                  >
                    <SwatchBook className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" /> {design.look}
                  </button>
                  <button
                    type="button"
                    data-testid="cycle-lighting-btn"
                    onClick={() => {
                      const idx = LIGHTS.findIndex((l) => l === design.light);
                      const next = LIGHTS[(idx + 1) % LIGHTS.length];
                      setDesignField("light", next);
                      toast.success(`Lighting: ${next}`);
                    }}
                    className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs text-[#1b1c1a] transition hover:bg-[#efeeea] dark:text-[#e8eff3] dark:hover:bg-[#202b38]"
                    title="Cycle lighting atmosphere (Daylight, Golden hour, Evening, Soft overcast, Night)"
                  >
                    <Sun className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" /> {design.light}
                  </button>
                  <button
                    type="button"
                    data-testid="toggle-entourage-btn"
                    aria-expanded={entourageOpen}
                    onClick={() => setEntourageOpen((v) => !v)}
                    className={cn(
                      "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs transition",
                      entourageOpen
                        ? "bg-[#c5a880]/30 font-medium text-[#513d1d] dark:bg-[#202b38] dark:text-[#e8c98a]"
                        : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38]",
                    )}
                    title="Stage architectural scale objects (Trees, People, Car, Warm Lamp)"
                  >
                    <Armchair className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" /> Entourage
                  </button>
                  <button
                    type="button"
                    data-testid="toggle-midlayer-btn"
                    aria-expanded={midLayerOpen}
                    onClick={() => setMidLayerOpen((v) => !v)}
                    className={cn(
                      "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs transition",
                      midLayerOpen || activeMidLayer
                        ? "bg-[#c5a880]/30 font-medium text-[#513d1d] dark:bg-[#202b38] dark:text-[#e8c98a]"
                        : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38]",
                    )}
                  >
                    <Layers className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
                    {activeMidLayer ? activeMidLayer.pillLabel : "Mid-Layer"}
                  </button>
                  <button
                    type="button"
                    data-testid="toggle-render-queue-btn"
                    onClick={() => setQueueDrawerOpen((v) => !v)}
                    aria-expanded={showQueue}
                    className={cn(
                      "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs transition",
                      showQueue
                        ? "bg-[#c5a880]/30 font-medium text-[#513d1d] dark:bg-[#202b38] dark:text-[#e8c98a]"
                        : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38]",
                    )}
                    title="Open Batch Render Queue, + Add Scene & 3-Light Trio"
                  >
                    <Clock className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
                    Queue{queue.length > 0 ? ` (${queue.length})` : ""}
                  </button>
                </div>
              </div>

              {/* One-Click Entourage Staging Tray */}
              {entourageOpen ? (
                <div
                  data-testid="entourage-tags-tray"
                  className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#f5f3ef]/85 px-3 py-2"
                >
                  <span className="text-[11px] font-medium text-[#1b1c1a]">Stage object:</span>
                  {STAGE_ENTOURAGE_TAGS.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setIdea(appendEntourageTagToIdea(idea, tag.snippet));
                        toast.success(`Added ${tag.label} to prompt`);
                        ideaRef.current?.focus();
                      }}
                      className="h-6.5 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] transition hover:border-[#725b38]"
                    >
                      + {tag.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
