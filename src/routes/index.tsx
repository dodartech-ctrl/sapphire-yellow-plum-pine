import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  Compass,
  Crosshair,
  Download,
  Expand,
  Grid2X2,
  ImagePlus,
  Loader2,
  Lock,
  MousePointer2,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  ScanEye,
  Sparkles,
  SunMoon,
  Unlock,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Compare } from "@/components/compare";
import { Composer } from "@/components/composer";
import { CvPreprocessorStage } from "@/components/cv-preprocessor-stage";
import { GroundedSAM2Tool } from "@/components/grounded-sam2-tool";
import { IOPaintWorkspace } from "@/components/iopaint-workspace";
import { NodeEditorCanvas } from "@/components/node-editor-canvas";
import { NodeStudioEmbedded } from "@/components/node-studio-embedded";
import { NvidiaVisionDialog } from "@/components/nvidia-vision-dialog";
import { PanoramaViewer } from "@/components/panorama-viewer";
import { PropertiesPanel } from "@/components/properties-panel";
import { SketchMaskCanvas } from "@/components/sketch-mask-canvas";
import { Viewport3D } from "@/components/viewport-3d";
import { ATELIER_VERTICAL_HERO, buildAtelierIterationCards } from "@/lib/atelier-studio";
import type { PublishedGalleryProject } from "@/lib/engines";
import { frameAspect, frameAspectNumber, frameEdge } from "@/lib/frame";
import { GROUPS, VERTICALS } from "@/lib/properties";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { registerStudioTools } from "@/lib/webmcp";
import {
  ENHANCE_ENVIRONMENTS,
  ENHANCE_SCOPES,
  WORKFLOW_INTENTS,
  buildEnhanceDirective,
  defaultEnhanceEnvironmentForVertical,
  resolveIntentFromStage,
  setPending3DFile,
  type EnhanceEnvironment,
  type EnhanceScope,
  type WorkflowIntentId,
} from "@/lib/workflow-journey";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: WorkspacePage,
});

type StudioStage = "source" | "3d" | "sketch" | "cv" | "sam2" | "mask" | "result" | "grid" | "compare" | "360" | "nodes";

const COPY: Record<string, string> = {
  interior: "Redesign, restyle, and visualize interior spaces with precision lighting.",
  exterior: "Block out 3D massing, sketch facades, and render without losing architecture.",
  amenities: "Stage pools, lounges, and shared rooms with locked perspective.",
  landscape: "Shape courtyards, hardscapes, and specimen planting around architecture.",
};

function WorkspacePage() {
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const setVertical = useOriel((state) => state.setVertical);
  const setDesignField = useOriel((state) => state.setDesignField);
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
  const setEngineField = useOriel((state) => state.setEngineField);
  const publishToGallery = useOriel((state) => state.publishToGallery);
  const scene3d = useOriel((state) => state.scene3d);
  const {
    busy,
    generate,
    generateGrid,
    applyInpaint,
    segmentGroundedSam2,
    applyDirectionalOutpaint,
    applyRemoveBgPlugin,
    applyRestoreFacesPlugin,
    applyEnhance,
    applyRelight,
    applyOutpaint,
    runLiveDraftPreview,
  } = useGenerate();

  const [view, setView] = useState<StudioStage>("source");
  const [samInitialMode, setSamInitialMode] = useState<"off" | "pos" | "neg">("off");
  const [nodeEditorMode, setNodeEditorMode] = useState<"canvas" | "studio">("canvas");
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [enhanceBarOpen, setEnhanceBarOpen] = useState(false);
  const [enhanceScope, setEnhanceScope] = useState<EnhanceScope>("image");
  const [enhanceEnv, setEnhanceEnv] = useState<EnhanceEnvironment>(() =>
    defaultEnhanceEnvironmentForVertical(design.vertical),
  );
  const [publishOpen, setPublishOpen] = useState(false);
  const [visionOpen, setVisionOpen] = useState(false);
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
  const aspectNumber = frameAspectNumber(frame.ratio);
  const activeIntent = resolveIntentFromStage(view, enhanceBarOpen);
  const heroSample = ATELIER_VERTICAL_HERO[design.vertical];
  const plateIterationCards = buildAtelierIterationCards(history, plate?.url);

  useEffect(() => {
    const controller = new AbortController();
    registerStudioTools(controller.signal);
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("pinInpaint") === "1") {
        setView("mask");
      } else if (sp.get("stage") === "nodes") {
        setView("nodes");
      } else if (sp.get("stage") === "3d") {
        setView("3d");
      } else if (sp.get("sam") === "1") {
        setSamInitialMode("pos");
        setView("sam2");
      }
    }
    function onView(event: Event) {
      const next = (event as CustomEvent<string>).detail;
      if (
        next === "source" ||
        next === "3d" ||
        next === "sketch" ||
        next === "cv" ||
        next === "sam2" ||
        next === "mask" ||
        next === "result" ||
        next === "grid" ||
        next === "compare" ||
        next === "360" ||
        next === "nodes"
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

  // Debounced low-latency live draft stream when liveStreamEnabled is ON
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
  }

  function cycleTargetElement() {
    const order = ["whole", ...pins.map((group) => group.id)];
    const nextTarget = order[(Math.max(order.indexOf(design.target), 0) + 1) % order.length];
    setTarget(nextTarget);
    const name = nextTarget === "whole" ? "the whole frame" : (pins.find((group) => group.id === nextTarget)?.label ?? nextTarget);
    toast.message(`Editing ${name}`);
  }

  useEffect(() => {
    setEnhanceEnv(defaultEnhanceEnvironmentForVertical(design.vertical));
  }, [design.vertical]);

  // Ctrl+V / Cmd+V clipboard image paste into Source canvas
  useEffect(() => {
    function handlePaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const pastedFile = item.getAsFile();
          if (pastedFile) {
            event.preventDefault();
            void onFile(pastedFile);
            toast.success("Image pasted from clipboard");
            return;
          }
        }
      }
    }
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame.resolution]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (["glb", "gltf", "obj", "fbx"].includes(ext)) {
      setPending3DFile(file);
      setEnhanceBarOpen(false);
      setView("3d");
      toast.success(`Opening 3D Viewport with ${file.name}`);
      return;
    }
    try {
      setUpload(await readImage(file, frameEdge(frame.resolution)));
      setEnhanceBarOpen(false);
      setView("source");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read that image.");
    }
  }

  function selectWorkflowIntent(intentId: WorkflowIntentId) {
    if (intentId === "render") {
      setEnhanceBarOpen(false);
      setView(plate?.url ? "result" : "source");
    } else if (intentId === "3d") {
      setEnhanceBarOpen(false);
      setView("3d");
    } else if (intentId === "edit") {
      setEnhanceBarOpen(false);
      setView("sam2");
    } else if (intentId === "enhance") {
      setEnhanceBarOpen(true);
      setView(plate?.url ? "result" : "source");
      if (!plate?.url && !upload) {
        toast.message("Upload or generate a render first, then pick Whole Image, Region, or People at 2× or 4×.");
      }
    } else if (intentId === "spatial") {
      setEnhanceBarOpen(false);
      setView("nodes");
    }
  }

  function exportLayeredBundle() {
    const activeUrl = plate?.url ?? upload;
    if (!activeUrl) {
      toast.message("Upload a source or generate a plate before exporting.");
      return;
    }
    const manifest = {
      exportedAt: new Date().toISOString(),
      layers: {
        baseSource: upload ?? null,
        enhancedPlate: plate?.url ?? null,
        inpaintMask: maskDataUrl ?? null,
      },
      enhanceSettings: {
        scope: enhanceScope,
        environment: enhanceEnv,
        upscaleFactor: engine.upscaleFactor,
        directive: buildEnhanceDirective(enhanceScope, enhanceEnv, engine.upscaleFactor === 4 ? 4 : 2),
      },
      design,
      engine,
      frame,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oriel-archviz-layered-bundle-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported multi-layer Studio bundle (Source + Result + Settings)");
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

  const stagePhases: {
    phase: string;
    tabs: { id: StudioStage; label: string; action: () => void }[];
  }[] = [
    {
      phase: "1. Input",
      tabs: [
        { id: "source", label: "Source", action: () => setView("source") },
        { id: "3d", label: "3D Viewport", action: () => setView("3d") },
        { id: "sketch", label: "Sketch", action: () => setView("sketch") },
        { id: "cv", label: "Preprocess & SAM", action: () => setView("cv") },
      ],
    },
    {
      phase: "2. Edit",
      tabs: [
        { id: "sam2", label: "SAM-2 Seg", action: () => setView("sam2") },
        { id: "mask", label: "Inpaint", action: () => setView("mask") },
      ],
    },
    {
      phase: "3. Output",
      tabs: [
        { id: "result", label: "Result", action: () => setView("result") },
        { id: "grid", label: "4-Up Grid", action: () => setView("grid") },
        { id: "compare", label: "Compare", action: showCompare },
      ],
    },
    {
      phase: "4. Spatial",
      tabs: [
        { id: "360", label: "360° Tour", action: () => setView("360") },
        { id: "nodes", label: "Node Editor", action: () => setView("nodes") },
      ],
    },
  ];

  return (
    <main className="flex flex-1 min-h-0 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      <section className="relative flex min-w-0 flex-1 flex-col gap-3 px-3 pt-3 pb-6 md:px-6 lg:h-full lg:overflow-y-auto">
        {/* Mobile Space Switcher */}
        <div className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto md:hidden">
          {VERTICALS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setVertical(item.id)}
              className={cn(
                "h-9 shrink-0 whitespace-nowrap rounded-full px-3.5 text-xs font-medium",
                design.vertical === item.id ? "bg-[#c5a880] text-[#281800] shadow-xs" : "bg-white/80 text-[#4d463c]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Clean Atelier Studio Action Bar + 5-Intent Journey Stepper */}
        <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#725b38]">
                Active Pipeline · {label}
              </span>
              <h1 title={COPY[design.vertical]} className="font-serif text-xl font-normal tracking-tight text-[#1b1c1a] sm:text-2xl">
                {label} Studio
              </h1>
            </div>
            <nav
              aria-label="Architectural Workflow Stepper"
              data-testid="workflow-intent-bar"
              className="flex max-w-full flex-wrap items-center gap-0.5 rounded-2xl border border-[#d1c5b8]/45 bg-white/75 p-1 backdrop-blur-xl shadow-xs sm:flex-nowrap"
            >
              {WORKFLOW_INTENTS.map((item) => {
                const isActive = activeIntent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={`intent-tab-${item.id}`}
                    aria-pressed={isActive}
                    title={item.hint}
                    onClick={() => selectWorkflowIntent(item.id)}
                    className={cn(
                      "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-xl px-2.5 text-[11px] font-medium transition",
                      isActive ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a]",
                    )}
                  >
                    <span className="font-mono text-[10px] opacity-75">{item.step}.</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {plate?.url ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyRelight("day-to-dusk")}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-xs font-medium text-[#1b1c1a] transition hover:border-[#725b38] disabled:opacity-60"
                >
                  <SunMoon className="size-3.5 text-[#725b38]" />
                  Relight Dusk
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyOutpaint("21:9")}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-xs font-medium text-[#1b1c1a] transition hover:border-[#725b38] disabled:opacity-60"
                >
                  <Expand className="size-3.5 text-[#725b38]" />
                  Outpaint 21:9
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyEnhance(4)}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-xs font-medium text-[#1b1c1a] transition hover:border-[#725b38] disabled:opacity-60"
                >
                  {busy ? <Loader2 className="size-3.5 animate-spin text-[#725b38]" /> : <Sparkles className="size-3.5 text-[#725b38]" />}
                  Upscale 4×
                </button>
                <button
                  type="button"
                  onClick={() => setPublishOpen(true)}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#c5a880] px-3 text-xs font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b]"
                >
                  <Upload className="size-3.5" />
                  Publish
                </button>
              </>
            ) : null}
            <button
              type="button"
              data-testid="freeze-mood-seed-btn"
              aria-pressed={engine.seedLocked}
              onClick={() => {
                const nextLocked = !engine.seedLocked;
                setEngineField("seedLocked", nextLocked);
                if (nextLocked && engine.geometryLock < 90) {
                  setEngineField("geometryLock", 92);
                }
                toast.success(
                  nextLocked
                    ? `Mood & Seed #${engine.seed} locked for consistent revisions`
                    : "Seed unlocked for exploration",
                );
              }}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 text-xs font-medium transition",
                engine.seedLocked
                  ? "border-[#c5a880] bg-[#c5a880]/20 text-[#513d1d]"
                  : "border-[#d1c5b8]/55 bg-white/80 text-[#1b1c1a] hover:border-[#725b38]",
              )}
            >
              {engine.seedLocked ? <Lock className="size-3.5 text-[#725b38]" /> : <Unlock className="size-3.5 text-[#4d463c]" />}
              {engine.seedLocked ? "Mood Frozen" : "Lock Mood"}
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("studio-properties")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-xs font-medium text-[#1b1c1a] lg:hidden"
            >
              Optics ↓
            </button>
            <button
              type="button"
              data-testid="toggle-inspector-btn"
              onClick={() => setInspectorCollapsed((v) => !v)}
              aria-label={inspectorCollapsed ? "Show Scene & Optics panel" : "Hide Scene & Optics panel"}
              className="hidden h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-xs font-medium text-[#1b1c1a] transition hover:border-[#725b38] lg:inline-flex"
            >
              {inspectorCollapsed ? <PanelRightOpen className="size-3.5 text-[#725b38]" /> : <PanelRightClose className="size-3.5 text-[#4d463c]" />}
              {inspectorCollapsed ? "Optics Panel" : "Wide Canvas"}
            </button>
          </div>
        </div>

        {/* Large Central Image Visualization Window */}
        <div className="relative flex min-h-[320px] shrink-0 flex-col overflow-hidden rounded-3xl border border-[#d1c5b8]/45 bg-[#161412] shadow-[0_24px_48px_-12px_rgba(27,28,26,0.10)]">
          {/* Frosted Atelier Top Stage Switcher Bar */}
          <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-b border-[#d1c5b8]/35 bg-white/88 px-3 py-1.5 text-xs text-[#1b1c1a] backdrop-blur-xl">
            {stagePhases.map((group) => (
              <div key={group.phase} className="flex flex-wrap items-center gap-1">
                <span className="mr-0.5 hidden text-[10px] font-semibold uppercase tracking-wider text-[#7f766a] sm:inline">{group.phase}</span>
                {group.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      tab.action();
                    }}
                    className={cn(
                      "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2 text-[11px] transition",
                      view === tab.id
                        ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs"
                        : "bg-[#efeeea]/80 text-[#4d463c] hover:bg-[#e4e2dd] hover:text-[#1b1c1a]",
                    )}
                  >
                    {tab.id === "360" ? <Compass className="size-3" /> : null}
                    {tab.label}
                  </button>
                ))}
              </div>
            ))}
            {engine.liveStreamEnabled ? (
              <span className="ml-auto shrink-0 rounded-lg border border-[#c5a880]/70 bg-[#c5a880]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[#513d1d]">
                Live Draft Active
              </span>
            ) : null}
          </div>

          {/* Vaethat-Inspired ArchViz Enhancement Studio Bar */}
          {enhanceBarOpen ? (
            <div
              data-testid="vaethat-enhance-bar"
              className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#1e1b18] px-3.5 py-2 text-xs text-[#dfd5c6]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#e0c298]">Enhance:</span>
                <div className="inline-flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5" role="group" aria-label="Enhance scope">
                  {ENHANCE_SCOPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={enhanceScope === s.id}
                      onClick={() => setEnhanceScope(s.id)}
                      className={cn(
                        "h-6.5 rounded-md px-2 text-[11px] transition",
                        enhanceScope === s.id ? "bg-[#c5a880] font-semibold text-[#281800]" : "text-[#d5cab9] hover:text-white",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="inline-flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5" role="group" aria-label="Enhance environment">
                  {ENHANCE_ENVIRONMENTS.map((env) => (
                    <button
                      key={env.id}
                      type="button"
                      aria-pressed={enhanceEnv === env.id}
                      onClick={() => setEnhanceEnv(env.id)}
                      className={cn(
                        "h-6.5 rounded-md px-2 text-[11px] transition",
                        enhanceEnv === env.id ? "bg-[#c5a880]/25 font-semibold text-[#e0c298]" : "text-[#b9aa95] hover:text-white",
                      )}
                    >
                      {env.label}
                    </button>
                  ))}
                </div>
                <div className="inline-flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5" role="group" aria-label="Upscale factor">
                  {([2, 4] as const).map((factor) => (
                    <button
                      key={factor}
                      type="button"
                      aria-pressed={engine.upscaleFactor === factor}
                      onClick={() => setEngineField("upscaleFactor", factor)}
                      className={cn(
                        "h-6.5 rounded-md px-2 font-mono text-[11px] transition",
                        engine.upscaleFactor === factor ? "bg-[#c5a880] font-semibold text-[#281800]" : "text-[#d5cab9] hover:text-white",
                      )}
                    >
                      {factor}×
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center justify-between gap-1.5 sm:w-auto sm:justify-end">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (enhanceScope === "region") {
                        setView("sam2");
                        toast.message("Click a region in SAM-2 Seg, or run full-plate enhance.");
                        return;
                      }
                      const nextIdea = idea.trim()
                        ? idea
                        : buildEnhanceDirective(enhanceScope, enhanceEnv, engine.upscaleFactor === 4 ? 4 : 2);
                      if (!idea.trim()) setIdea(nextIdea);
                      void applyEnhance(engine.upscaleFactor);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-lg bg-[#c5a880] px-2.5 text-[11px] font-semibold text-[#281800] disabled:opacity-50"
                  >
                    <Sparkles className="size-3" />
                    Run {engine.upscaleFactor}× Enhance
                  </button>
                  <button
                    type="button"
                    onClick={showCompare}
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#e0c298]"
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    onClick={exportLayeredBundle}
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#e0c298]"
                    title="Download multi-layer studio spec & mask manifest"
                  >
                    <Download className="size-3 text-[#e0c298]" /> Layered Export
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setEnhanceBarOpen(false)}
                  className="grid size-7 shrink-0 place-items-center rounded-lg text-[#9b8d7a] hover:bg-white/10 hover:text-white"
                  aria-label="Close Enhance bar"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ) : null}

          <div className="relative flex min-h-[300px] flex-1 flex-col">
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
                sourceUrl={upload || plate?.url || heroSample.src}
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
            ) : view === "sam2" ? (
              <GroundedSAM2Tool
                aspect={aspect}
                sourceUrl={plate?.url ?? upload}
                busy={busy}
                onGroundedSamSegment={segmentGroundedSam2}
                onSendToInpaint={(task, note) => {
                  setEngineField("iopaintTask", task);
                  setView("mask");
                  void applyInpaint(note ?? "");
                }}
                onOpenInpaintWorkspace={() => {
                  setSamInitialMode("off");
                  setView("mask");
                }}
                onSendToNodeEditor={() => {
                  setNodeEditorMode("canvas");
                  setView("nodes");
                }}
                onSourceChange={(dataUrl) => setUpload(dataUrl)}
              />
            ) : view === "mask" ? (
              <IOPaintWorkspace
                aspect={aspect}
                backgroundUrl={plate?.url ?? upload}
                initialBufferUrl={maskDataUrl}
                initialSamMode={samInitialMode}
                busy={busy}
                onSaveBuffer={setMaskDataUrl}
                onGroundedSamSegment={segmentGroundedSam2}
                onApplyMaskInpaint={(instruction) => void applyInpaint(instruction)}
                onApplyDirectionalOutpaint={(pad) => void applyDirectionalOutpaint(pad)}
                onApplyRemoveBg={(outMode) => void applyRemoveBgPlugin(outMode)}
                onApplyRestoreFaces={() => void applyRestoreFacesPlugin()}
                onApplyEsrganPlugin={() => void applyEnhance(engine.upscaleFactor)}
                onLoadSampleSource={(url) => {
                  setUpload(url);
                  toast.success("Sample scene loaded into IOPaint workspace");
                }}
              />
            ) : view === "nodes" ? (
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#171310] px-3 py-1.5 text-[11px] text-[#d5cab9]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setNodeEditorMode("canvas")}
                      className={cn(
                        "rounded-full px-3 py-1 font-medium transition",
                        nodeEditorMode === "canvas" ? "bg-[#c5a880] text-[#281800]" : "border border-white/15 bg-white/5 text-[#e6ddd0] hover:bg-white/10",
                      )}
                    >
                      Workflow Canvas
                    </button>
                    <button
                      type="button"
                      onClick={() => setNodeEditorMode("studio")}
                      className={cn(
                        "rounded-full px-3 py-1 font-medium transition",
                        nodeEditorMode === "studio" ? "bg-[#c5a880] text-[#281800]" : "border border-white/15 bg-white/5 text-[#e6ddd0] hover:bg-white/10",
                      )}
                    >
                      Full 45-Node Studio
                    </button>
                  </div>
                  <span className="hidden text-[10px] text-[#9b8d7a] sm:inline">
                    {nodeEditorMode === "canvas"
                      ? "Drag nodes & draw SVG connections · Image Input → ControlNet → Render Engine"
                      : "Full multi-pass DAG orchestrator"}
                  </span>
                </div>
                {nodeEditorMode === "canvas" ? (
                  <NodeEditorCanvas
                    onOpenSam2Tool={() => setView("sam2")}
                    onOpenStage={(stage) => setView(stage)}
                    onSendResultToStudio={(imageUrl, title) => {
                      setUpload(imageUrl);
                      setPlate({
                        url: imageUrl,
                        upload: upload ?? undefined,
                        templateId: engine.workflowPreset,
                        idea: title ? `Node Canvas: ${title}` : "Node Canvas Render",
                      });
                      setView("result");
                      toast.success("Node Canvas render sent to Studio Plate");
                    }}
                  />
                ) : (
                  <NodeStudioEmbedded
                    onPromoteToStudio={(imageUrl, title) => {
                      setUpload(imageUrl);
                      setPlate({
                        url: imageUrl,
                        upload: upload ?? undefined,
                        templateId: engine.workflowPreset,
                        idea: title ? `Node Pipeline: ${title}` : "Node Pipeline Result",
                      });
                      setView("result");
                      toast.success("Node output sent to Studio Plate");
                    }}
                  />
                )}
              </div>
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
                          plate?.url === url ? "border-[#e0c298] ring-2 ring-[#e0c298]" : "border-white/10 hover:border-[#c5a880]",
                        )}
                      >
                        <img src={url} alt={`Concept variation ${idx + 1}`} className="aspect-[16/9] w-full object-cover transition group-hover:scale-[1.02]" />
                        <span className="absolute bottom-2 left-2 rounded-full bg-[#161412]/85 px-2.5 py-0.5 font-mono text-[10px] text-[#f6efe4]">
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
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-[#c5a880] px-5 text-xs font-semibold text-[#281800]"
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
                <div className="relative flex items-center justify-center bg-[#161412] p-3 sm:p-4">
                  <div className="relative flex h-[280px] w-full items-center justify-center sm:h-[340px] xl:h-[365px]" style={{ containerType: "size" }}>
                    <div
                      data-testid="studio-aspect-frame"
                      data-ratio={frame.ratio}
                      className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#120f0c] shadow-[0_18px_48px_rgba(0,0,0,0.45)] transition-[width,height] duration-200"
                      style={{
                        width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
                        height: `min(100cqh, calc(100cqw / ${aspectNumber}))`,
                      }}
                    >
                      <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full border border-white/15 bg-[#161412]/80 px-2.5 py-0.5 font-mono text-[10px] text-[#e0c298] backdrop-blur-md">
                        Result
                      </span>
                      <img src={plate.url} alt="Result" className="h-full w-full object-contain" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid min-h-[300px] flex-1 place-items-center bg-[#161412] p-4 text-center text-sm text-[#f6efe4]">
                  No plate yet. Choose 3D Viewport, Sketch, or Upload, then press Render Plate.
                </div>
              )
            ) : upload ? (
              <div className="relative flex items-center justify-center bg-[#161412] p-3 sm:p-4">
                <div className="relative flex h-[280px] w-full items-center justify-center sm:h-[340px] xl:h-[365px]" style={{ containerType: "size" }}>
                  <div
                    data-testid="studio-aspect-frame"
                    data-ratio={frame.ratio}
                    className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#120f0c] shadow-[0_18px_48px_rgba(0,0,0,0.45)] transition-[width,height] duration-200"
                    style={{
                      width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
                      height: `min(100cqh, calc(100cqw / ${aspectNumber}))`,
                    }}
                  >
                    <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full border border-white/15 bg-[#161412]/80 px-2.5 py-0.5 font-mono text-[10px] text-[#e0c298] backdrop-blur-md">
                      Source
                    </span>
                    <img src={upload} alt="Source" className="h-full w-full object-contain" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-0 flex items-center justify-center bg-[#161412] p-3 sm:p-4">
                <div className="relative flex h-[280px] w-full items-center justify-center sm:h-[340px] xl:h-[365px]" style={{ containerType: "size" }}>
                  <div
                    data-testid="studio-aspect-frame"
                    data-ratio={frame.ratio}
                    className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#1c1915] shadow-[0_18px_48px_rgba(0,0,0,0.45)] transition-[width,height] duration-200"
                    style={{
                      width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
                      height: `min(100cqh, calc(100cqw / ${aspectNumber}))`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        void onFile(event.dataTransfer.files[0]);
                      }}
                      className="relative block h-full w-full"
                    >
                      <img src={heroSample.src} alt={heroSample.caption} className="h-full w-full object-cover opacity-90" />
                    </button>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-2.5 bg-gradient-to-t from-[#14110f]/90 via-[#14110f]/30 to-transparent p-4 text-[#fbf9f5]">
                      <p className="rounded-full bg-[#161412]/80 px-3.5 py-1 text-center text-xs backdrop-blur-md sm:text-sm">
                        Drop photo, sketch, or 3D GLB (Ctrl+V to paste)
                      </p>
                      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setView("3d")}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#c5a880] px-3.5 text-[11px] font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b] sm:h-9 sm:px-4 sm:text-xs"
                        >
                          <Box className="size-3.5" /> 3D Massing
                        </button>
                        <button
                          type="button"
                          onClick={() => setView("sketch")}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-[#161412]/80 px-3.5 text-[11px] font-medium text-[#fbf9f5] backdrop-blur-md hover:border-[#e0c298] sm:h-9 sm:px-4 sm:text-xs"
                        >
                          <Pencil className="size-3.5 text-[#e0c298]" /> Sketch Pad
                        </button>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-[#161412]/80 px-3.5 text-[11px] font-medium text-[#fbf9f5] backdrop-blur-md hover:border-[#e0c298] sm:h-9 sm:px-4 sm:text-xs"
                        >
                          <ImagePlus className="size-3.5 text-[#e0c298]" /> Upload Photo / GLB
                        </button>
                      </div>
                    </div>
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
                    className={cn(
                      "rounded-full px-3 py-1 text-xs shadow-md",
                      design.target === group.id ? "bg-[#c5a880] font-medium text-[#281800]" : "bg-[#161412]/90 text-[#fbf9f5]",
                    )}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Dedicated Bottom Frame Info & Unique Overlay Tools */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#161412] px-3.5 py-2">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] text-[#dfd5c6] tabular-nums">
              {label} · {room} · {frame.ratio} · {frame.resolution.toUpperCase()}
              {view === "3d" ? (
                <span className="hidden text-[11px] text-[#b9aa95] md:inline">· Drag to orbit · Scroll to zoom</span>
              ) : null}
            </span>

            <div
              className="flex items-center gap-1"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Pin architectural element"
                aria-pressed={selecting}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelecting(!selecting);
                }}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium transition",
                  selecting
                    ? "border-transparent bg-[#c5a880] text-[#281800]"
                    : "border-white/15 bg-white/5 text-white/90 hover:border-[#e0c298]",
                )}
              >
                <MousePointer2 className="size-3" />
                Pin Element
              </button>
              <button
                type="button"
                aria-label="Cycle the edit target"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  cycleTargetElement();
                }}
                className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] font-medium text-white/90 transition hover:border-[#e0c298]"
              >
                <Crosshair className="size-3 text-[#e0c298]" />
                Target: {design.target}
              </button>
              <button
                type="button"
                data-testid="open-nvidia-vision-btn"
                aria-label="Analyze image with Vision AI"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setVisionOpen(true);
                }}
                className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] font-medium text-white/90 transition hover:border-[#e0c298]"
              >
                <ScanEye className="size-3 text-[#e0c298]" />
                Vision AI
              </button>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.glb,.gltf,.obj,.fbx"
            className="sr-only"
            suppressHydrationWarning
            onChange={(event) => {
              void onFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>

        {/* Frosted Studio Prompt Dock & Controls */}
        <Composer />

        {/* 4-Column Interactive Plate Iteration Grid */}
        <div data-testid="atelier-plate-strip" className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-4">
          {plateIterationCards.map((card) => {
            const isSelected = Boolean(plate?.url === card.url || (!plate?.url && upload === card.url));
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  if (card.isGenerated) {
                    setPlate({
                      url: card.url,
                      upload: upload ?? undefined,
                      templateId: engine.workflowPreset,
                      idea: idea.trim() || `${design.look} architectural plate`,
                    });
                    setView("result");
                    toast.success(`Restored ${card.tag}`);
                  } else {
                    setUpload(card.url);
                    setDesignField("light", card.lightPreset);
                    setView("source");
                    toast.success(`Loaded ${card.title} (${card.subtitle}) into Source frame`);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-white/80 text-left transition-all hover:shadow-md",
                  isSelected
                    ? "border-[#c5a880] ring-2 ring-[#c5a880]/70"
                    : "border-[#d1c5b8]/45 hover:border-[#725b38]/60",
                )}
              >
                <div className="relative h-24 w-full overflow-hidden bg-[#161412]">
                  <img
                    src={card.url}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 left-2 rounded-full bg-[#161412]/75 px-2 py-0.5 font-mono text-[10px] font-medium text-[#fbf9f5] backdrop-blur-md">
                    {card.tag}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-[#1b1c1a]">{card.title}</p>
                    <p className="truncate text-[10px] text-[#7f766a]">{card.subtitle}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <PropertiesPanel
        collapsed={inspectorCollapsed}
        onToggleCollapse={() => setInspectorCollapsed((v) => !v)}
        onOpenStage={(stage) => setView(stage)}
        onExportPlate={exportLayeredBundle}
      />

      {/* Publish to Project Gallery Modal */}
      {publishOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs">
          <form onSubmit={handlePublishSubmit} className="w-full max-w-md rounded-3xl border border-[#d1c5b8]/60 bg-[#fbf9f5] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-[#1b1c1a]">Publish to Project Gallery</h2>
              <button type="button" onClick={() => setPublishOpen(false)} className="grid size-8 place-items-center rounded-full text-[#4d463c] hover:bg-[#efeeea]">
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#4d463c]">Save your before/after architectural plate into the Gallery comparison archive.</p>

            <div className="mt-4 space-y-3 text-xs">
              <label className="block">
                <span className="font-medium text-[#1b1c1a]">Project Title</span>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder={`${design.look} ${label} Study`}
                  className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-3 text-[#1b1c1a] outline-none focus:border-[#725b38]"
                />
              </label>

              <label className="block">
                <span className="font-medium text-[#1b1c1a]">Location / Context</span>
                <input
                  type="text"
                  value={pubLocation}
                  onChange={(e) => setPubLocation(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-3 text-[#1b1c1a] outline-none focus:border-[#725b38]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-medium text-[#1b1c1a]">Discipline</span>
                  <select
                    value={pubDiscipline}
                    onChange={(e) => setPubDiscipline(e.target.value as PublishedGalleryProject["discipline"])}
                    className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-[#1b1c1a] outline-none focus:border-[#725b38]"
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
                  <span className="font-medium text-[#1b1c1a]">Comparison Study</span>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value as PublishedGalleryProject["comparisonType"])}
                    className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-[#1b1c1a] outline-none focus:border-[#725b38]"
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
              <button type="button" onClick={() => setPublishOpen(false)} className="h-9 rounded-full border border-[#d1c5b8]/60 bg-white px-4 text-xs text-[#4d463c] hover:text-[#1b1c1a]">
                Cancel
              </button>
              <button type="submit" className="h-9 rounded-full bg-[#c5a880] px-5 text-xs font-semibold text-[#281800]">
                Save to Gallery
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <NvidiaVisionDialog
        open={visionOpen}
        onOpenChange={setVisionOpen}
        defaultImageUrl={plate?.url ?? upload ?? heroSample.src}
      />
    </main>
  );
}
