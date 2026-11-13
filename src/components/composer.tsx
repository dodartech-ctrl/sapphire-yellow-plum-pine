import { Clock, Grid2X2, ImagePlus, Loader2, Plus, SlidersHorizontal, Sparkles, Sun, SwatchBook, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BatchRenderQueue } from "@/components/batch-render-queue";
import { MidLayerBar } from "@/components/mid-layer-bar";
import { enhanceIdea } from "@/lib/generate";
import { RATIOS, RESOLUTIONS, frameEdge } from "@/lib/frame";
import { LOOKS } from "@/lib/properties";
import { PLATE_COST } from "@/lib/credits";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";

export function Composer() {
  const upload = useOriel((state) => state.upload);
  const setUpload = useOriel((state) => state.setUpload);
  const idea = useOriel((state) => state.idea);
  const setIdea = useOriel((state) => state.setIdea);
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const frame = useOriel((state) => state.frame);
  const setFrame = useOriel((state) => state.setFrame);
  const credits = useOriel((state) => state.credits);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setPanel = useOriel((state) => state.setPanel);
  const queue = useOriel((state) => state.queue);
  const enqueueRender = useOriel((state) => state.enqueueRender);
  const { busy, batchRunning, generate, generateGrid, runThreeLightBatch } = useGenerate();
  const [enhancing, setEnhancing] = useState(false);
  const [queueDrawerOpen, setQueueDrawerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const ideaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function focusIdea() {
      ideaRef.current?.focus();
    }
    window.addEventListener("oriel-focus-idea", focusIdea);
    return () => window.removeEventListener("oriel-focus-idea", focusIdea);
  }, []);

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setUpload(await readImage(file, frameEdge(frame.resolution)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image.");
    }
  }

  return (
    <div className="mt-3 space-y-2.5">
      <MidLayerBar />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void generate();
        }}
      >
        <div className="rounded-[28px] border border-line bg-surface px-3.5 py-3 shadow-[0_14px_32px_rgba(70,48,16,0.06)]">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-raised"
              aria-label={upload ? "Replace reference image" : "Upload a reference image"}
            >
              {upload ? <img src={upload} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="size-5 text-faint" />}
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
                  className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-rail text-[10px] text-ink"
                  aria-label="Remove image"
                >
                  <X className="size-3" />
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
                rows={2}
                onChange={(event) => setIdea(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void generate();
                  }
                }}
                placeholder="Redesign this space. Name the one change, the materials, and the light."
                className="max-h-28 min-h-14 w-full resize-none bg-transparent py-1 text-sm leading-relaxed text-fg outline-none placeholder:text-faint"
                suppressHydrationWarning
              />
            </label>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-line/70 pt-2.5">
            <span className="text-xs text-faint">Resolution</span>
            {RATIOS.map((ratio) => (
              <button
                key={ratio}
                type="button"
                aria-pressed={frame.ratio === ratio}
                onClick={() => setFrame({ ...frame, ratio })}
                className={cn("hover-chip h-8 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-xs", frame.ratio === ratio ? "gold-fill border-transparent" : "border-line text-muted")}
              >
                {ratio}
              </button>
            ))}
            {RESOLUTIONS.map((resolution) => (
              <button
                key={resolution}
                type="button"
                aria-pressed={frame.resolution === resolution}
                onClick={() => setFrame({ ...frame, resolution })}
                className={cn("hover-chip h-8 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-xs uppercase", frame.resolution === resolution ? "gold-fill border-transparent" : "border-line text-muted")}
              >
                {resolution}
              </button>
            ))}
            <span className="ml-auto hidden font-mono text-[11px] tabular-nums text-faint sm:inline">
              Geo {engine.geometryLock}% · --s {engine.mjStylize} · #{engine.seed}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
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
              className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-3 text-xs text-muted transition disabled:opacity-60"
            >
              {enhancing ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />} Enhance Prompt
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
              className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#e7c27a]/80 bg-[#f6e0b0]/40 px-3 text-xs text-fg transition hover:bg-[#f6e0b0]"
            >
              <SwatchBook className="size-3.5" /> Style · {design.look}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-3 text-xs text-muted"
            >
              <ImagePlus className="size-3.5" /> Reference
            </button>
            <button
              type="button"
              onClick={() => setPanel("engine")}
              className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-3 text-xs text-muted"
              title="Open Veras, LookX, PromeAI, Krea & Midjourney Engine settings"
            >
              <SlidersHorizontal className="size-3.5" /> Engine
            </button>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setQueueDrawerOpen((v) => !v)}
                aria-expanded={queueDrawerOpen || queue.length > 0}
                className={cn(
                  "hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs",
                  queueDrawerOpen || queue.length > 0
                    ? "border-[#d4b06a] bg-[#fff8eb] font-medium text-fg"
                    : "border-line bg-raised text-muted",
                )}
              >
                <Clock className="size-3.5 text-[#b08a45]" />
                Batch Queue{queue.length > 0 ? ` (${queue.length})` : ""}
              </button>
              <button
                type="button"
                disabled={busy || batchRunning}
                onClick={() => {
                  const nextLight = design.light === "Golden hour" ? "Evening" : "Golden hour";
                  enqueueRender(`${design.look} · ${nextLight}`, engine.workflowPreset, nextLight, { status: "pending" });
                  setQueueDrawerOpen(true);
                  toast.success(`Queued "${design.look} · ${nextLight}" (Pending)`);
                }}
                className="hover-chip inline-flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-3 text-xs text-fg disabled:opacity-50"
                title="Add scene to Batch Render Queue as Pending"
              >
                <Plus className="size-3.5 text-[#b08a45]" /> Queue Scene
              </button>
              <button
                type="button"
                disabled={busy || batchRunning}
                onClick={() => {
                  setQueueDrawerOpen(true);
                  void runThreeLightBatch();
                }}
                className="hover-chip inline-flex h-9 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-3 text-xs text-fg disabled:opacity-50"
                title="Queue Day, Golden Hour, and Evening passes sequentially"
              >
                <Sun className="size-3.5 text-[#b08a45]" /> 3-Light Trio
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void generateGrid()}
                className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-raised px-3 text-xs font-medium text-fg disabled:opacity-50"
                title="Generate 4-up Midjourney concept grid"
              >
                <Grid2X2 className="size-3.5 text-[#b08a45]" /> 4-Up
              </button>
              <button
                type="submit"
                disabled={busy || credits < PLATE_COST}
                className="gold-fill inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold disabled:opacity-60"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {busy ? "Rendering" : engine.outputMode === "grid-4" ? "Render 4-Up" : "Generate"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Dedicated Sequential Batch Render Queue */}
      {queueDrawerOpen || queue.length > 0 ? (
        <BatchRenderQueue onClose={queue.length === 0 ? () => setQueueDrawerOpen(false) : undefined} />
      ) : null}
    </div>
  );
}
