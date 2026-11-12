import { createFileRoute } from "@tanstack/react-router";
import { Circle, ImagePlus, Layers, MousePointer2, Pencil, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Compare } from "@/components/compare";
import { Composer } from "@/components/composer";
import { PropertiesPanel } from "@/components/properties-panel";
import { frameAspect, frameEdge } from "@/lib/frame";
import { GROUPS, VERTICALS } from "@/lib/properties";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { registerStudioTools } from "@/lib/webmcp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: WorkspacePage,
});

const COPY: Record<string, string> = {
  interior: "Redesign, restyle, and visualize interior spaces with AI.",
  exterior: "Restyle facades, entries, and massing without losing the building.",
  amenities: "Stage pools, lounges, and shared rooms with the same camera.",
  landscape: "Shape gardens, paths, and planting around the architecture.",
};

function WorkspacePage() {
  const design = useOriel((state) => state.design);
  const setVertical = useOriel((state) => state.setVertical);
  const setIdea = useOriel((state) => state.setIdea);
  const frame = useOriel((state) => state.frame);
  const upload = useOriel((state) => state.upload);
  const setUpload = useOriel((state) => state.setUpload);
  const plate = useOriel((state) => state.plate);
  const history = useOriel((state) => state.history);
  const setPlate = useOriel((state) => state.setPlate);
  const setTarget = useOriel((state) => state.setTarget);
  const setSelecting = useOriel((state) => state.setSelecting);
  const selecting = useOriel((state) => state.selecting);
  const chat = useOriel((state) => state.chat);
  const [view, setView] = useState<"source" | "result" | "compare">("source");
  const [tool, setTool] = useState<"select" | "compare" | "draw" | "spot" | "layers">("select");
  const fileRef = useRef<HTMLInputElement>(null);
  const pins = GROUPS[design.vertical];
  const label = VERTICALS.find((item) => item.id === design.vertical)?.label ?? "Studio";
  const room = design.picks.room || design.picks.facade || design.picks.water || "Whole";
  const canCompare = Boolean(upload && plate?.url);
  const aspect = frameAspect(frame.ratio);

  useEffect(() => {
    const controller = new AbortController();
    registerStudioTools(controller.signal);
    function onView(event: Event) {
      const next = (event as CustomEvent<string>).detail;
      if (next === "source" || next === "result" || next === "compare") setView(next);
    }
    window.addEventListener("oriel-view", onView);
    return () => {
      controller.abort();
      window.removeEventListener("oriel-view", onView);
    };
  }, []);

  function showSource() {
    setView("source");
    setTool("select");
  }

  function showResult() {
    setView("result");
    setTool("select");
  }

  function showCompare() {
    if (view === "compare") {
      setView(plate?.url ? "result" : "source");
      setTool("select");
      return;
    }
    if (!canCompare) {
      toast.message(upload ? "Generate a plate, then compare it with the source." : "Add a source image, then generate a plate to compare.");
      return;
    }
    setView("compare");
    setTool("compare");
  }

  function useTool(next: typeof tool) {
    if (next === "compare") {
      showCompare();
      return;
    }
    setTool(next);
    if (next === "select") setSelecting(!selecting);
    if (next === "draw") {
      window.dispatchEvent(new Event("oriel-focus-idea"));
      toast.message("Edit the prompt below, then press Generate.");
    }
    if (next === "spot") {
      const order = ["whole", ...pins.map((group) => group.id)];
      const nextTarget = order[(Math.max(order.indexOf(design.target), 0) + 1) % order.length];
      setTarget(nextTarget);
      const name = nextTarget === "whole" ? "the whole frame" : (pins.find((group) => group.id === nextTarget)?.label ?? nextTarget);
      toast.message(`Editing ${name}`);
    }
    if (next === "layers") {
      toast.message(history.length ? "Earlier plates are under the frame." : "Generated plates will stack here.");
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      setUpload(await readImage(file, frameEdge(frame.resolution)));
      setView("source");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image.");
    }
  }

  return (
    <main className="flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <section className="relative min-w-0 flex-1 overflow-y-auto px-4 pb-6 md:px-8">
        <img src="/viz/t07-cultural-campus.jpg" alt="" className="pointer-events-none absolute top-0 right-0 h-56 w-[46%] object-cover opacity-30 mask-[linear-gradient(90deg,transparent,black)]" />
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto lg:hidden">
          {VERTICALS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setVertical(item.id)}
              className={cn("h-10 shrink-0 rounded-full px-3 text-sm", design.vertical === item.id ? "gold-fill" : "bg-surface text-muted")}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="relative text-[11px] font-medium tracking-[0.22em] text-[#b08a45] uppercase">Architectural assistant</p>
        <h1 className="relative mt-1 font-serif text-4xl tracking-tight text-fg md:text-5xl">{label} Studio</h1>
        <p className="relative mt-2 max-w-xl text-sm text-muted">{COPY[design.vertical]}</p>
        <div className="relative mt-5 overflow-hidden rounded-[28px] bg-[#1c1915] shadow-[0_24px_50px_rgba(70,48,16,0.08)]">
          {view === "compare" && upload && plate?.url ? (
            <Compare before={upload} after={plate.url} beforeLabel="Source" afterLabel="Result" beforeAlt="Source" afterAlt="Result" embedded aspect={aspect} />
          ) : view === "result" ? (
            plate?.url ? (
              <img src={plate.url} alt="Result" className="mx-auto w-full object-contain" style={{ aspectRatio: aspect, maxHeight: "62vh" }} />
            ) : (
              <div className="grid min-h-72 place-items-center px-6 text-center text-sm text-[#f6efe4]" style={{ aspectRatio: aspect }}>
                No plate yet. Choose a resolution, then press Generate.
              </div>
            )
          ) : upload ? (
            <img src={upload} alt="Source" className="mx-auto w-full object-contain" style={{ aspectRatio: aspect, maxHeight: "62vh" }} />
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void onFile(event.dataTransfer.files[0]);
              }}
              className="relative z-0 block min-h-72 w-full"
            >
              <img src="/viz/t03-compact-living-room.jpg" alt="" className="max-h-[46vh] w-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-rail/25 text-ink">
                <span className="rounded-full bg-rail/70 px-4 py-2 text-sm">Drop a photo, plan, or render</span>
              </span>
            </button>
          )}
          <div className="absolute top-3 left-3 z-30 flex rounded-full bg-rail/85 p-1 text-xs text-ink shadow-lg">
            {(
              [
                ["source", "Source", showSource],
                ["result", "Result", showResult],
                ["compare", "Compare", showCompare],
              ] as const
            ).map(([id, label, action]) => (
              <button
                key={id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  action();
                }}
                className={cn(
                  "h-8 rounded-full px-3 transition hover:bg-white/15 hover:text-[#f6e7c8]",
                  view === id ? "gold-fill hover:text-[#2a1c0c]" : "",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <span className="absolute bottom-3 left-3 z-30 inline-flex h-9 items-center gap-2 rounded-full bg-rail/80 px-3 text-xs text-ink">
            <ImagePlus className="size-3.5" /> {label} · {room} · {frame.ratio} · {frame.resolution.toUpperCase()}
          </span>
          <div
            className="absolute right-3 bottom-3 z-30 flex items-center gap-1 rounded-full border border-[#e7c27a] bg-[#1a1612]/92 p-1 text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)]"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            {(
              [
                ["select", "Select an element", MousePointer2, tool === "select" && selecting],
                ["compare", "Compare source and result", Square, view === "compare"],
                ["draw", "Edit the prompt", Pencil, tool === "draw"],
                ["spot", "Cycle the edit target", Circle, tool === "spot"],
                ["layers", "Show earlier plates", Layers, tool === "layers"],
              ] as const
            ).map(([id, name, Icon, active]) => (
              <button
                key={id}
                type="button"
                aria-label={name}
                aria-pressed={active}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  useTool(id);
                }}
                className={cn(
                  "grid size-9 place-items-center rounded-full text-white/90 transition hover:bg-[#e7c27a]/25 hover:text-[#f6e7c8] hover:ring-1 hover:ring-[#e7c27a]",
                  active && "gold-fill text-[#2a1c0c] ring-1 ring-[#f3d7a1] hover:text-[#2a1c0c]",
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </div>
          {selecting ? (
            <div className="absolute inset-x-3 top-14 flex flex-wrap gap-2">
              {pins.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setTarget(group.id)}
                  className={cn("rounded-full px-3 py-1 text-xs", design.target === group.id ? "gold-fill" : "bg-rail/80 text-ink")}
                >
                  {group.label}
                </button>
              ))}
            </div>
          ) : null}
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
        </div>
        <Composer />
        {tool === "layers" || history.length > 0 ? (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {history.length === 0 ? <p className="text-sm text-muted">Earlier plates will stack here after you generate.</p> : null}
            {history.map((url) => (
              <button key={url} type="button" onClick={() => plate && setPlate({ ...plate, url })} className="shrink-0">
                <img src={url} alt="" className="h-16 w-24 rounded-xl border border-line object-cover" />
              </button>
            ))}
          </div>
        ) : null}
        {chat.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {chat.slice(-3).map((line) => (
              <li key={line.id} className={cn("max-w-xl rounded-2xl px-3 py-2 text-sm", line.role === "you" ? "bg-surface text-fg" : "text-muted")}>
                {line.text}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {["Warm the lighting", "Keep the layout, restyle the finishes", "Shift the materials, hold the camera"].map((line) => (
            <button key={line} type="button" onClick={() => setIdea(line)} className="hover-chip h-9 rounded-full border border-line bg-surface px-3 text-xs text-muted">
              {line}
            </button>
          ))}
        </div>
      </section>
      <PropertiesPanel />
    </main>
  );
}
