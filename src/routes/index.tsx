import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Box,
  Circle,
  Compass,
  Expand,
  Grid2X2,
  ImagePlus,
  Images,
  Layers,
  Loader2,
  MousePointer2,
  Paintbrush,
  Pencil,
  Sparkles,
  Square,
  SunMoon,
  Upload,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Compare } from "@/components/compare";
import { Composer } from "@/components/composer";
import { CvPreprocessorStage } from "@/components/cv-preprocessor-stage";
import { PanoramaViewer } from "@/components/panorama-viewer";
import { PropertiesPanel } from "@/components/properties-panel";
import { SketchMaskCanvas } from "@/components/sketch-mask-canvas";
import { Viewport3D } from "@/components/viewport-3d";
import { appendSuggestionToIdea } from "@/lib/archviz-dictionary";
import type { PublishedGalleryProject } from "@/lib/engines";
import { frameAspect, frameEdge } from "@/lib/frame";
import { GROUPS, VERTICALS } from "@/lib/properties";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { registerStudioTools } from "@/lib/webmcp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: WorkspacePage,
});

type StudioStage = "source" | "3d" | "sketch" | "cv" | "mask" | "result" | "grid" | "compare" | "360";

const COPY: Record<string, string> = {
  interior: "Redesign, restyle, and visualize interior spaces with AI.",
  exterior: "Block out 3D massing, sketch facades, and render without losing the building.",
  amenities: "Stage pools, lounges, and shared rooms with the same camera.",
  landscape: "Shape gardens, paths, and planting around the architecture.",
};

function WorkspacePage() {
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const setVertical = useOriel((state) => state.setVertical);
  const idea = useOriel((state) => state.idea);
  const setIdea = useOriel((state) => state.setIdea);
  const frame = useOriel((state) => state.frame);
  const upload = useOriel((state) => state.upload);
  const setUpload = useOriel((state) => state.setUpload);
  const sketchDataUrl = useOriel((state) => state.sketchDataUrl);
  const setSketchDataUrl = useOriel((state) => state.setSketchDataUrl);
  const maskDataUrl = useOriel((state) => state.maskDataUrl);
  const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
  const plate = useOriel((state) => state.plate);
  const variations = useOriel((state) => state.variations);
  const history = useOriel((state) => state.history);
  const setPlate = useOriel((state) => state.setPlate);
  const setTarget = useOriel((state) => state.setTarget);
  const setSelecting = useOriel((state) => state.setSelecting);
  const selecting = useOriel((state) => state.selecting);
  const applyWorkflowPreset = useOriel((state) => state.applyWorkflowPreset);
  const publishToGallery = useOriel((state) => state.publishToGallery);
  const chat = useOriel((state) => state.chat);
  const scene3d = useOriel((state) => state.scene3d);
  const {
    busy,
    generate,
    generateGrid,
    applyInpaint,
    applyDirectionalOutpaint,
    applyRemoveBgPlugin,
    applyRestoreFacesPlugin,
    applyEnhance,
    applyRelight,
    applyOutpaint,
    runLiveDraftPreview,
  } = useGenerate();

  const [view, setView] = useState<StudioStage>("source");
  const [tool, setTool] = useState<"select" | "compare" | "draw" | "spot" | "layers">("select");
  const [publishOpen, setPublishOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState("");
  const [pubLocation, setPubLocation] = useState("Studio Commission");
  const [pubDiscipline, setPubDiscipline] = useState<PublishedGalleryProject["discipline"]>("Exterior");
  const [pubType, setPubType] = useState<PublishedGalleryProject["comparisonType"]>("Material Restyle");

  const fileRef = useRef<HTMLInputElement>(null);
  const pins = GROUPS[design.vertical];
  const label = VERTICALS.find((item) => item.id === design.vertical)?.label ?? "Studio";
  const room = design.picks.room || design.picks.facade || design.picks.water || "Whole";
  const canCompare = Boolean((upload || sketchDataUrl) && plate?.url);
  const aspect = frameAspect(frame.ratio);

  useEffect(() => {
    const controller = new AbortController();
    registerStudioTools(controller.signal);
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("pinInpaint") === "1") {
        setView("mask");
      }
    }
    function onView(event: Event) {
      const next = (event as CustomEvent<string>).detail;
      if (
        next === "source" ||
        next === "3d" ||
        next === "sketch" ||
        next === "cv" ||
        next === "mask" ||
        next === "result" ||
        next === "grid" ||
        next === "compare" ||
        next === "360"
      ) {
        setView(next);
      }
    }
    window.addEventListener("oriel-view", onView);
    return () => {
      controller.abort();
      window.removeEventListener("oriel-view", onView);
    };
  }, []);

  // #10 Debounced Krea-style low-latency live draft stream when liveStreamEnabled is ON
  useEffect(() => {
    if (!engine.liveStreamEnabled) return;
    if (!sketchDataUrl && !upload) return;
    const timer = window.setTimeout(() => {
      void runLiveDraftPreview();
    }, 450);
    return () => window.clearTimeout(timer);
  }, [
    engine.liveStreamEnabled,
    sketchDataUrl,
    scene3d.sunAzimuth,
    scene3d.sunElevation,
    scene3d.primaryMaterial,
    scene3d.preset,
    upload,
    runLiveDraftPreview,
  ]);

  function showCompare() {
    if (view === "compare") {
      setView(plate?.url ? "result" : "source");
      setTool("select");
      return;
    }
    if (!canCompare) {
      toast.message(
        upload || sketchDataUrl
          ? "Generate a plate, then compare it with the source."
          : "Capture a 3D snapshot, sketch, or upload a photo first.",
      );
      return;
    }
    setView("compare");
    setTool("compare");
  }

  function handleTool(next: typeof tool) {
    if (next === "compare") {
      showCompare();
      return;
    }
    setTool(next);
    if (next === "select") setSelecting(!selecting);
    if (next === "draw") {
      setView("sketch");
      toast.message("Sketch pad active — trace or draw architectural lines.");
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

  function handlePublishSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!plate?.url) {
      toast.message("Generate a plate before publishing to Gallery.");
      return;
    }
    const beforeImg = upload || sketchDataUrl || "/viz/p01-pavilion-day.jpg";
    publishToGallery({
      title: pubTitle.trim() || `${design.look} ${label} Study`,
      location: pubLocation.trim() || "Studio Archive",
      year: String(new Date().getFullYear()),
      discipline: pubDiscipline,
      comparisonType: pubType,
      beforeImage: beforeImg,
      afterImage: plate.url,
      beforeLabel: upload ? "Source / 3D Massing" : "Baseline",
      afterLabel: `Oriel (${design.look})`,
      summary: plate.idea || `${design.look} architectural visualization with ${design.light.toLowerCase()} lighting.`,
      materialsUsed: Object.values(design.picks).filter(Boolean).slice(0, 4),
      lightingTechnique: `${design.light} · ${design.time} · ${design.weather}`,
      aspect,
      promptBlueprint: plate.idea || `${design.look} ${design.vertical}, ${design.light}`,
      engineMeta: `${engine.workflowPreset} · Geo ${engine.geometryLock}% · Seed #${plate.seed ?? engine.seed}`,
    });
    setPublishOpen(false);
    setPubTitle("");
    toast.success("Published to Project Gallery!");
  }

  const stageTabs: { id: StudioStage; label: string; action: () => void }[] = [
    { id: "source", label: "Source", action: () => setView("source") },
    { id: "3d", label: "3D Viewport", action: () => setView("3d") },
    { id: "sketch", label: "Sketch", action: () => setView("sketch") },
    { id: "cv", label: "Preprocess & SAM", action: () => setView("cv") },
    { id: "mask", label: "Inpaint", action: () => setView("mask") },
    { id: "result", label: "Result", action: () => setView("result") },
    { id: "grid", label: "4-Up Grid", action: () => setView("grid") },
    { id: "compare", label: "Compare", action: showCompare },
    { id: "360", label: "360° Tour", action: () => setView("360") },
  ];

  return (
    <main className="flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <section className="relative min-w-0 shrink-0 px-4 pb-6 md:px-8 lg:flex-1 lg:overflow-y-auto">
        <img src="/viz/t07-cultural-campus.jpg" alt="" className="pointer-events-none absolute top-0 right-0 h-56 w-[46%] object-cover opacity-30 mask-[linear-gradient(90deg,transparent,black)]" />
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto lg:hidden">
          {VERTICALS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setVertical(item.id)}
              className={cn("h-10 shrink-0 whitespace-nowrap rounded-full px-3 text-sm", design.vertical === item.id ? "gold-fill" : "bg-surface text-muted")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.22em] text-[#b08a45] uppercase">Architectural pipeline</p>
            <h1 className="mt-1 font-serif text-4xl tracking-tight text-fg md:text-5xl">{label} Studio</h1>
            <p className="mt-2 max-w-xl text-sm text-muted">{COPY[design.vertical]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {plate?.url ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyRelight("day-to-dusk")}
                  className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3 text-xs font-medium text-fg shadow-xs disabled:opacity-60"
                >
                  <SunMoon className="size-3.5 text-[#b08a45]" />
                  Relight Dusk
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyOutpaint("21:9")}
                  className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3 text-xs font-medium text-fg shadow-xs disabled:opacity-60"
                >
                  <Expand className="size-3.5 text-[#b08a45]" />
                  Outpaint 21:9
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyEnhance(4)}
                  className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3.5 text-xs font-medium text-fg shadow-xs disabled:opacity-60"
                >
                  {busy ? <Loader2 className="size-3.5 animate-spin text-[#b08a45]" /> : <Sparkles className="size-3.5 text-[#b08a45]" />}
                  Upscale 4×
                </button>
                <button
                  type="button"
                  onClick={() => setPublishOpen(true)}
                  className="gold-fill inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-semibold shadow-xs"
                >
                  <Upload className="size-3.5" />
                  Publish to Gallery
                </button>
              </>
            ) : null}
            <Link
              to="/builder"
              className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3.5 text-xs font-medium text-fg shadow-xs"
            >
              <Wand2 className="size-3.5 text-[#b08a45]" />
              Brief Builder
            </Link>
            <Link
              to="/gallery"
              className="hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3.5 text-xs font-medium text-fg shadow-xs"
            >
              <Images className="size-3.5 text-[#b08a45]" />
              Project Gallery
            </Link>
          </div>
        </div>

        {/* Main Unified Interactive Viewport */}
        <div className="relative mt-5 overflow-hidden rounded-[28px] border border-line bg-[#1c1915] shadow-[0_20px_44px_rgba(70,48,16,0.08)]">
          {/* Dedicated Top Pipeline Stage Bar */}
          <div className="no-scrollbar flex items-center gap-1 overflow-x-auto border-b border-white/10 bg-[#14110f] px-3 py-2 text-xs text-ink">
            {stageTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  tab.action();
                }}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 transition hover:bg-white/15 hover:text-[#f6e7c8]",
                  view === tab.id ? "gold-fill font-medium text-[#2a1c0c] hover:text-[#2a1c0c]" : "text-[#d5cab9]",
                )}
              >
                {tab.id === "360" ? <Compass className="size-3" /> : null}
                {tab.label}
              </button>
            ))}
            {engine.liveStreamEnabled ? (
              <span className="ml-auto shrink-0 rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 px-2.5 py-0.5 text-[10px] font-medium text-[#e7c27a]">
                Live Draft Active
              </span>
            ) : null}
          </div>

          <div className="relative">
            {view === "3d" ? (
              <Viewport3D
                aspect={aspect}
                onCaptureSnapshot={(dataUrl, goToSketch) => {
                  setUpload(dataUrl);
                  applyWorkflowPreset("clay-to-render");
                  setView(goToSketch ? "sketch" : "source");
                  toast.success(goToSketch ? "3D view sent to Sketch Pad for tracing" : "3D snapshot captured as Source");
                }}
                onCaptureChannels={(channels) => {
                  if (!upload) setUpload(channels.clayUrl);
                }}
              />
            ) : view === "sketch" ? (
              <SketchMaskCanvas
                mode="sketch"
                aspect={aspect}
                backgroundUrl={upload}
                initialBufferUrl={sketchDataUrl}
                onSaveBuffer={setSketchDataUrl}
                onLockToSource={(composite) => {
                  setUpload(composite);
                  applyWorkflowPreset("sketch-to-render");
                  void generate();
                }}
              />
            ) : view === "cv" ? (
              <CvPreprocessorStage
                aspect={aspect}
                sourceUrl={upload || plate?.url || "/viz/t03-compact-living-room.jpg"}
                onSendMapToSketch={(mapUrl) => {
                  setUpload(mapUrl);
                  setView("sketch");
                  toast.success("Loaded extracted line/depth map as Sketch underlay");
                }}
                onSendMaskToInpaint={(maskUrl, targetLabel) => {
                  setMaskDataUrl(maskUrl);
                  if (targetLabel.trim()) setIdea(`Restyle ${targetLabel}`);
                  setView("mask");
                  toast.success(`SAM "${targetLabel}" mask loaded into Inpaint`);
                }}
                onExtrudeFloorPlan={() => setView("3d")}
                onLockAndRender={() => void generate()}
              />
            ) : view === "mask" ? (
              <SketchMaskCanvas
                mode="mask"
                aspect={aspect}
                backgroundUrl={plate?.url ?? upload}
                initialBufferUrl={maskDataUrl}
                busy={busy}
                onSaveBuffer={setMaskDataUrl}
                onApplyMaskInpaint={(instruction) => void applyInpaint(instruction)}
                onApplyDirectionalOutpaint={(pad) => void applyDirectionalOutpaint(pad)}
                onApplyRemoveBg={(outMode) => void applyRemoveBgPlugin(outMode)}
                onApplyRestoreFaces={() => void applyRestoreFacesPlugin()}
                onApplyEsrganPlugin={() => void applyEnhance(engine.upscaleFactor)}
                onLoadSampleSource={(url) => {
                  setUpload(url);
                  toast.success("Sample scene loaded into IOPaint stage");
                }}
              />
            ) : view === "360" ? (
              <PanoramaViewer imageUrl={plate?.url || upload || "/viz/p01-pavilion-dusk.jpg"} aspect={aspect} />
            ) : view === "grid" ? (
              <div className="p-3" style={{ minHeight: "360px" }}>
                {variations.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    {variations.map((url, idx) => (
                      <button
                        key={`${url.slice(0, 48)}-${idx}`}
                        type="button"
                        onClick={() => {
                          setPlate({ url, upload: upload ?? undefined, templateId: engine.workflowPreset, idea: idea.trim() });
                          setView("result");
                          toast.success(`Promoted variation V${idx + 1}`);
                        }}
                        className={cn(
                          "group relative overflow-hidden rounded-2xl border transition",
                          plate?.url === url ? "border-[#e7c27a] ring-2 ring-[#e7c27a]" : "border-white/10 hover:border-[#d4b06a]",
                        )}
                      >
                        <img src={url} alt={`Concept variation ${idx + 1}`} className="aspect-[16/9] w-full object-cover transition group-hover:scale-[1.02]" />
                        <span className="absolute bottom-2 left-2 rounded-full bg-[#14110f]/85 px-2.5 py-0.5 font-mono text-[10px] text-[#f6efe4]">
                          V{idx + 1} · Promote
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid min-h-80 place-items-center px-6 text-center text-sm text-[#f6efe4]" style={{ aspectRatio: aspect }}>
                    <div className="space-y-3">
                      <p>Explore 4 parallel Midjourney-style architectural concepts at once.</p>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void generateGrid()}
                        className="gold-fill inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold text-[#2a1c0c]"
                      >
                        <Grid2X2 className="size-4" /> Generate 4-Up Grid
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : view === "compare" && (upload || sketchDataUrl) && plate?.url ? (
              <Compare
                before={upload || sketchDataUrl || "/viz/p01-pavilion-day.jpg"}
                after={plate.url}
                beforeLabel="Source"
                afterLabel="Result"
                beforeAlt="Source"
                afterAlt="Result"
                embedded
                aspect={aspect}
              />
            ) : view === "result" ? (
              plate?.url ? (
                <img src={plate.url} alt="Result" className="mx-auto w-full object-contain" style={{ aspectRatio: aspect, maxHeight: "62vh" }} />
              ) : (
                <div className="grid min-h-72 place-items-center px-6 text-center text-sm text-[#f6efe4]" style={{ aspectRatio: aspect }}>
                  No plate yet. Choose 3D Viewport, Sketch, or Upload, then press Generate.
                </div>
              )
            ) : upload ? (
              <img src={upload} alt="Source" className="mx-auto w-full object-contain" style={{ aspectRatio: aspect, maxHeight: "62vh" }} />
            ) : (
              <div className="relative z-0 block min-h-72 w-full">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    void onFile(event.dataTransfer.files[0]);
                  }}
                  className="block w-full"
                >
                  <img src="/viz/t03-compact-living-room.jpg" alt="" className="max-h-[46vh] w-full object-cover opacity-80" />
                </button>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-rail/30 p-4 text-ink">
                  <p className="rounded-full bg-rail/80 px-4 py-1.5 text-sm">Drop a photo, plan, or massing image</p>
                  <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setView("3d")}
                      className="gold-fill inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[#2a1c0c]"
                    >
                      <Box className="size-3.5" /> Open 3D Massing
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("sketch")}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/25 bg-[#14110f]/85 px-4 text-xs font-medium text-[#f6efe4] hover:border-[#d4b06a]"
                    >
                      <Pencil className="size-3.5 text-[#e7c27a]" /> Start Sketch Pad
                    </button>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/25 bg-[#14110f]/85 px-4 text-xs font-medium text-[#f6efe4] hover:border-[#d4b06a]"
                    >
                      <ImagePlus className="size-3.5 text-[#e7c27a]" /> Upload Photo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selecting ? (
              <div className="absolute inset-x-3 top-3 z-30 flex flex-wrap gap-2">
                {pins.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setTarget(group.id)}
                    className={cn("rounded-full px-3 py-1 text-xs shadow-md", design.target === group.id ? "gold-fill text-[#2a1c0c]" : "bg-rail/90 text-ink")}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Dedicated Bottom Frame Info & Quick Tools Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#14110f] px-3 py-2">
            <span className="inline-flex items-center gap-2 text-xs text-[#dfd5c6]">
              <ImagePlus className="size-3.5 text-[#e7c27a]" /> {label} · {room} · {frame.ratio} · {frame.resolution.toUpperCase()}
              {view === "3d" ? (
                <span className="hidden text-[11px] text-[#b9aa95] md:inline">· Drag to orbit · Scroll to zoom</span>
              ) : null}
            </span>

            <div
              className="flex items-center gap-1 rounded-full border border-[#e7c27a]/60 bg-[#1a1612] p-0.5 text-white"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              {(
                [
                  ["select", "Select an element", MousePointer2, tool === "select" && selecting],
                  ["compare", "Compare source and result", Square, view === "compare"],
                  ["draw", "Open Sketch Pad", Pencil, view === "sketch"],
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
                    handleTool(id);
                  }}
                  className={cn(
                    "grid size-8 place-items-center rounded-full text-white/90 transition hover:bg-[#e7c27a]/25 hover:text-[#f6e7c8]",
                    active && "gold-fill text-[#2a1c0c] hover:text-[#2a1c0c]",
                  )}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
              <button
                type="button"
                aria-label="Open Inpaint Mask Brush"
                aria-pressed={view === "mask"}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setView("mask");
                }}
                className={cn(
                  "grid size-8 place-items-center rounded-full text-white/90 transition hover:bg-[#e7c27a]/25 hover:text-[#f6e7c8]",
                  view === "mask" && "gold-fill text-[#2a1c0c] hover:text-[#2a1c0c]",
                )}
              >
                <Paintbrush className="size-3.5" />
              </button>
            </div>
          </div>

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
              <button
                key={url}
                type="button"
                onClick={() => {
                  if (plate) setPlate({ ...plate, url });
                  setView("result");
                }}
                className="shrink-0"
              >
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
            <button
              key={line}
              type="button"
              onClick={() => setIdea(appendSuggestionToIdea(idea, line))}
              className="hover-chip h-9 rounded-full border border-line bg-surface px-3 text-xs text-muted"
            >
              {line}
            </button>
          ))}
        </div>
      </section>
      <PropertiesPanel />

      {/* Publish to Project Gallery Modal */}
      {publishOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
          <form onSubmit={handlePublishSubmit} className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-fg">Publish to Project Gallery</h2>
              <button type="button" onClick={() => setPublishOpen(false)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-raised">
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">Save your before/after architectural plate into the Gallery comparison archive.</p>

            <div className="mt-4 space-y-3 text-xs">
              <label className="block">
                <span className="font-medium text-fg">Project Title</span>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder={`${design.look} ${label} Study`}
                  className="mt-1 h-10 w-full rounded-xl border border-line bg-raised px-3 text-fg outline-none focus:border-[#d4b06a]"
                />
              </label>

              <label className="block">
                <span className="font-medium text-fg">Location / Context</span>
                <input
                  type="text"
                  value={pubLocation}
                  onChange={(e) => setPubLocation(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-line bg-raised px-3 text-fg outline-none focus:border-[#d4b06a]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-medium text-fg">Discipline</span>
                  <select
                    value={pubDiscipline}
                    onChange={(e) => setPubDiscipline(e.target.value as PublishedGalleryProject["discipline"])}
                    className="mt-1 h-10 w-full rounded-xl border border-line bg-raised px-2.5 text-fg outline-none focus:border-[#d4b06a]"
                  >
                    <option value="Exterior">Exterior</option>
                    <option value="Interior">Interior</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Civic">Civic</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-medium text-fg">Comparison Study</span>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value as PublishedGalleryProject["comparisonType"])}
                    className="mt-1 h-10 w-full rounded-xl border border-line bg-raised px-2.5 text-fg outline-none focus:border-[#d4b06a]"
                  >
                    <option value="Material Restyle">Material Restyle</option>
                    <option value="Lighting / Relighting">Lighting / Relighting</option>
                    <option value="Adaptive Reuse">Adaptive Reuse</option>
                    <option value="Masterplan Integration">Masterplan Integration</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setPublishOpen(false)} className="h-9 rounded-full border border-line px-4 text-xs text-muted hover:text-fg">
                Cancel
              </button>
              <button type="submit" className="gold-fill h-9 rounded-full px-5 text-xs font-semibold text-[#2a1c0c]">
                Save to Gallery
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </main>
  );
}
