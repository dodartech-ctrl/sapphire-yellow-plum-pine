import { createFileRoute, useRouterState } from "@tanstack/react-router";
import {
  Box,
  Crosshair,
  Download,
  Grid2X2,
  ImagePlus,
  MousePointer2,
  Pencil,
  ScanEye,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Compare } from "@/components/compare";
import { AgentDock } from "@/components/agent-dock";
import { Composer } from "@/components/composer";
import { CvPreprocessorStage } from "@/components/cv-preprocessor-stage";
import { GroundedSAM2Tool } from "@/components/grounded-sam2-tool";
import { IOPaintWorkspace } from "@/components/iopaint-workspace";
import { NodeEditorCanvas } from "@/components/node-editor-canvas";
import { NodeStudioEmbedded } from "@/components/node-studio-embedded";
import { NvidiaVisionDialog } from "@/components/nvidia-vision-dialog";
import { PresetMatrixPanel } from "@/components/preset-matrix-panel";
import { PropertiesPanel } from "@/components/properties-panel";
import { ResilientPlateImage } from "@/components/resilient-plate-image";
import { FidelityGateModal } from "@/components/review-mission-modals";
import { SketchMaskCanvas } from "@/components/sketch-mask-canvas";
import { CameraOpticsBar, SplitViewportStage } from "@/components/split-viewport-stage";
import { StudioHeadControls } from "@/components/studio-head-controls";
import { King360StudioPanel, KumVideoStudioPanel } from "@/components/studio-modes";
import { Viewport3D } from "@/components/viewport-3d";
import { ATELIER_VERTICAL_HERO } from "@/lib/atelier-studio";
import type { PublishedGalleryProject } from "@/lib/engines";
import { frameAspect, frameAspectNumber, frameEdge } from "@/lib/frame";
import { StudioHeadSlotContext } from "@/lib/head-slot";
import { GROUPS, VERTICALS } from "@/lib/properties";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { registerStudioTools } from "@/lib/webmcp";
import {
  ENHANCE_ENVIRONMENTS,
  ENHANCE_SCOPES,
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

function WorkspacePage() {
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
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
  const setPlate = useOriel((state) => state.setPlate);
  const activeStudio = useOriel((state) => state.activeStudio);
  const setActiveStudio = useOriel((state) => state.setActiveStudio);
  const fidelityReport = useOriel((state) => state.fidelityReport);
  const setTarget = useOriel((state) => state.setTarget);
  const setSelecting = useOriel((state) => state.setSelecting);
  const selecting = useOriel((state) => state.selecting);
  const applyWorkflowPreset = useOriel((state) => state.applyWorkflowPreset);
  const setEngineField = useOriel((state) => state.setEngineField);
  const publishToGallery = useOriel((state) => state.publishToGallery);
  const scene3d = useOriel((state) => state.scene3d);
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
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

  const [view, setView] = useState<StudioStage>(() => (plate?.url ? "result" : "source"));
  const [splitHubEnabled, setSplitHubEnabled] = useState(true);
  const [rightTab, setRightTab] = useState<"matrix" | "optics">("matrix");
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
  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const headSlot = useContext(StudioHeadSlotContext);
  const [pubTitle, setPubTitle] = useState("");
  const [pubLocation, setPubLocation] = useState("Studio Commission");
  const [pubDiscipline, setPubDiscipline] = useState<PublishedGalleryProject["discipline"]>("Exterior");
  const [pubType, setPubType] = useState<PublishedGalleryProject["comparisonType"]>("Material Restyle");

  const fileRef = useRef<HTMLInputElement>(null);
  const scrollSectionRef = useRef<HTMLElement>(null);
  const didAutoShowHydratedPlateRef = useRef(false);
  const pins = GROUPS[design.vertical];
  const label = VERTICALS.find((item) => item.id === design.vertical)?.label ?? "Studio";
  const room = design.picks.room || design.picks.facade || design.picks.water || "Whole";
  const canCompare = Boolean((upload || sketchDataUrl) && plate?.url);
  const aspect = frameAspect(frame.ratio);
  const aspectNumber = frameAspectNumber(frame.ratio);
  const activeIntent = resolveIntentFromStage(view, enhanceBarOpen);
  const heroSample = ATELIER_VERTICAL_HERO[design.vertical];

  // Sync stage view when IndexedDB hydrates a previously rendered plate on page reload
  useEffect(() => {
    if (!didAutoShowHydratedPlateRef.current && plate?.url && view === "source") {
      didAutoShowHydratedPlateRef.current = true;
      setView("result");
    }
  }, [plate?.url, view]);

  useEffect(() => {
    const controller = new AbortController();
    registerStudioTools(controller.signal);
    function onView(event: Event) {
      const next = (event as CustomEvent<string>).detail;
      if (next === "split") {
        didAutoShowHydratedPlateRef.current = true;
        setSplitHubEnabled(true);
        setView(useOriel.getState().plate?.url ? "result" : "source");
        return;
      }
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
        didAutoShowHydratedPlateRef.current = true;
        setView(next);
      }
    }
    window.addEventListener("oriel-view", onView);
    return () => {
      controller.abort();
      window.removeEventListener("oriel-view", onView);
    };
  }, []);

  // Sync studio stage from search params (e.g. when returning from /explore tab)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(searchStr);
    if (sp.get("pinInpaint") === "1") {
      didAutoShowHydratedPlateRef.current = true;
      setSplitHubEnabled(false);
      setView("mask");
      return;
    }
    if (sp.get("sam") === "1") {
      didAutoShowHydratedPlateRef.current = true;
      setSamInitialMode("pos");
      setView("sam2");
      return;
    }
    const stageParam = sp.get("stage");
    if (!stageParam) return;
    if (stageParam === "split") {
      didAutoShowHydratedPlateRef.current = true;
      setSplitHubEnabled(true);
      setView(useOriel.getState().plate?.url ? "result" : "source");
      return;
    }
    if (
      stageParam === "source" ||
      stageParam === "3d" ||
      stageParam === "sketch" ||
      stageParam === "cv" ||
      stageParam === "sam2" ||
      stageParam === "mask" ||
      stageParam === "result" ||
      stageParam === "grid" ||
      stageParam === "compare" ||
      stageParam === "360" ||
      stageParam === "nodes"
    ) {
      didAutoShowHydratedPlateRef.current = true;
      if (stageParam === "source" || stageParam === "result") {
        setSplitHubEnabled(false);
      }
      setView(stageParam);
    }
  }, [searchStr]);

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

  function openExplicitStage(nextStage: StudioStage) {
    didAutoShowHydratedPlateRef.current = true;
    if (nextStage === "result" || nextStage === "source") {
      setSplitHubEnabled(false);
    }
    setView(nextStage);
  }

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
      setActiveStudio("sam-3d");
      setSplitHubEnabled(true);
      setView("3d");
    } else if (intentId === "edit") {
      setEnhanceBarOpen(false);
      setActiveStudio("mas-2d");
      setView("sam2");
    } else if (intentId === "enhance") {
      setEnhanceBarOpen(true);
      setView(plate?.url ? "result" : "source");
      if (!plate?.url && !upload) {
        toast.message("Upload or generate a render first, then pick Whole Image, Region, or People at 2× or 4×.");
      }
    } else if (intentId === "spatial") {
      setEnhanceBarOpen(false);
      setActiveStudio("node-studio");
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
      fidelityReport,
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oriel-archviz-layered-bundle-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported multi-layer Studio bundle (Source + Result + Fidelity Gate)");
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
        { id: "source", label: "Source", action: () => openExplicitStage("source") },
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
        { id: "result", label: "Result", action: () => openExplicitStage("result") },
        { id: "grid", label: "4-Up Grid", action: () => setView("grid") },
        { id: "compare", label: "Compare", action: showCompare },
      ],
    },
    {
      phase: "4. Spatial",
      tabs: [
        { id: "360", label: "360° Tour", action: () => { setActiveStudio("king-360"); setView("360"); } },
        { id: "nodes", label: "Node Editor", action: () => { setActiveStudio("node-studio"); setView("nodes"); } },
      ],
    },
  ];

  const showingSplitHub =
    activeStudio === "sam-3d" &&
    splitHubEnabled &&
    (view === "source" || view === "result");

  const useTallStage =
    (activeStudio === "king-360" && view === "360") ||
    activeStudio === "kum-video" ||
    view === "nodes";

  return (
    <main className="flex flex-1 min-h-0 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
      {headSlot
        ? createPortal(
            <StudioHeadControls
              activeIntent={activeIntent}
              onSelectIntent={selectWorkflowIntent}
              activeStudio={activeStudio}
              showingSplitHub={showingSplitHub}
              onEnableSplitHub={() => {
                setSplitHubEnabled(true);
                setView(plate?.url ? "result" : "source");
              }}
              view={view}
              onOpenStage={openExplicitStage}
              stagePhases={stagePhases}
              contractOpen={contractOpen}
              onToggleContract={() => setContractOpen((v) => !v)}
              onOpenGateModal={() => setGateModalOpen(true)}
              inspectorCollapsed={inspectorCollapsed}
              onToggleInspector={() => setInspectorCollapsed((v) => !v)}
              hasPlate={Boolean(plate?.url)}
              hasSource={Boolean(upload)}
              busy={busy}
              onRelightDusk={() => void applyRelight("day-to-dusk")}
              onOutpaintWide={() => void applyOutpaint("21:9")}
              onUpscale4x={() => void applyEnhance(4)}
              onOpenPublish={() => setPublishOpen(true)}
              onExportBundle={exportLayeredBundle}
              onOpenVision={() => setVisionOpen(true)}
            />,
            headSlot,
          )
        : null}

      <section
        ref={scrollSectionRef}
        className="studio-scroll relative flex min-w-0 flex-1 flex-col gap-3 px-3 pt-2.5 pb-6 md:px-5 lg:h-full lg:overflow-y-auto"
      >
        {/* Screen-Fit Hero Workspace (Primary Stage + Chat Box + Quick-Jump Bar) */}
        <div
          id="studio-hero-fit"
          data-testid="studio-hero-fit"
          className={cn(
            "flex shrink-0 flex-col gap-2",
            useTallStage ? "lg:min-h-full" : "lg:h-full lg:min-h-[540px]",
          )}
        >
          {/* Primary Stage Viewport (Fills remaining hero height cleanly above Chat Dock) */}
          <div className={cn("flex min-h-0 flex-col", useTallStage ? "" : "flex-1")}>
            {activeStudio === "king-360" && view === "360" ? (
              <King360StudioPanel aspect={aspect} onOpenStage={openExplicitStage} />
            ) : activeStudio === "kum-video" ? (
              <KumVideoStudioPanel />
            ) : showingSplitHub ? (
              <SplitViewportStage
                heroFit
                hideTopBar
                contractOpen={contractOpen}
                onOpenGateModal={() => setGateModalOpen(true)}
                onOpenStage={openExplicitStage}
              />
            ) : (
              /* Classic Multi-Stage Canvas Card */
              <div className="hf-stage-enter relative flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-3xl border border-[#d1c5b8]/45 bg-[#161412] shadow-[0_24px_48px_-12px_rgba(27,28,26,0.18)] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b]">

            {/* Vaethat-Inspired ArchViz Enhancement Studio Bar */}
            {enhanceBarOpen ? (
              <div
                data-testid="vaethat-enhance-bar"
                className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#1e1b18] px-3.5 py-2 text-xs text-[#dfd5c6] dark:bg-[#08131f]"
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

            <div className="relative flex min-h-[250px] flex-1 flex-col">
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
                <King360StudioPanel aspect={aspect} onOpenStage={openExplicitStage} />
              ) : view === "grid" ? (
                <div className="p-3" style={{ minHeight: "300px" }}>
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
                          <ResilientPlateImage src={url} alt={`Concept variation ${idx + 1}`} className="aspect-[16/9] object-cover transition group-hover:scale-[1.02]" />
                          <span className="absolute bottom-2 left-2 rounded-full bg-[#161412]/85 px-2.5 py-0.5 font-mono text-[10px] text-[#f6efe4]">
                            V{idx + 1} · Promote
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid min-h-64 place-items-center px-6 text-center text-sm text-[#f6efe4]" style={{ aspectRatio: aspect }}>
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
                  <div className="relative flex flex-1 min-h-0 items-center justify-center bg-[#08131f] p-3">
                    <div className="relative flex h-full min-h-[240px] w-full items-center justify-center" style={{ containerType: "size" }}>
                      <div
                        data-testid="studio-aspect-frame"
                        data-ratio={frame.ratio}
                        className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#050f1b] shadow-[0_18px_48px_rgba(0,0,0,0.45)] transition-[width,height] duration-200"
                        style={{
                          width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
                          height: `min(100cqh, calc(100cqw / ${aspectNumber}))`,
                        }}
                      >
                        <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full border border-white/15 bg-[#050f1b]/80 px-2.5 py-0.5 font-mono text-[10px] text-[#e8c98a] backdrop-blur-md">
                          Result
                        </span>
                        <ResilientPlateImage
                          src={plate.url}
                          alt="Result"
                          busy={busy}
                          testId="studio-result-img"
                          className="object-contain"
                          onRetryFallback={() => void generate("plate")}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid min-h-[240px] flex-1 place-items-center bg-[#08131f] p-4 text-center text-sm text-[#e8eff3]">
                    No plate yet. Choose 3D Viewport, Sketch, or Upload, then press Render Plate.
                  </div>
                )
              ) : upload ? (
                <div className="relative flex flex-1 min-h-0 items-center justify-center bg-[#08131f] p-3">
                  <div className="relative flex h-full min-h-[240px] w-full items-center justify-center" style={{ containerType: "size" }}>
                    <div
                      data-testid="studio-aspect-frame"
                      data-ratio={frame.ratio}
                      className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#050f1b] shadow-[0_18px_48px_rgba(0,0,0,0.45)] transition-[width,height] duration-200"
                      style={{
                        width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
                        height: `min(100cqh, calc(100cqw / ${aspectNumber}))`,
                      }}
                    >
                      <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-full border border-white/15 bg-[#050f1b]/80 px-2.5 py-0.5 font-mono text-[10px] text-[#e8c98a] backdrop-blur-md">
                        Source
                      </span>
                      <ResilientPlateImage src={upload} alt="Source" busy={busy} className="object-contain" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-0 flex flex-1 min-h-0 items-center justify-center bg-[#08131f] p-3">
                  <div className="relative flex h-full min-h-[240px] w-full items-center justify-center" style={{ containerType: "size" }}>
                    <div
                      data-testid="studio-aspect-frame"
                      data-ratio={frame.ratio}
                      className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#121c29] shadow-[0_18px_48px_rgba(0,0,0,0.45)] transition-[width,height] duration-200"
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
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-2.5 bg-gradient-to-t from-[#050f1b]/90 via-[#050f1b]/30 to-transparent p-4 text-[#e8eff3]">
                        <p className="rounded-full bg-[#08131f]/80 px-3.5 py-1 text-center text-xs backdrop-blur-md sm:text-sm">
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
                            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-[#08131f]/80 px-3.5 text-[11px] font-medium text-[#e8eff3] backdrop-blur-md hover:border-[#e8c98a] sm:h-9 sm:px-4 sm:text-xs"
                          >
                            <Pencil className="size-3.5 text-[#e8c98a]" /> Sketch Pad
                          </button>
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-[#08131f]/80 px-3.5 text-[11px] font-medium text-[#e8eff3] backdrop-blur-md hover:border-[#e8c98a] sm:h-9 sm:px-4 sm:text-xs"
                          >
                            <ImagePlus className="size-3.5 text-[#e8c98a]" /> Upload Photo / GLB
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
                        design.target === group.id ? "bg-[#c5a880] font-medium text-[#281800]" : "bg-[#08131f]/90 text-[#e8eff3]",
                      )}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Bottom Frame Info & Overlay Tools */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#050f1b] px-3.5 py-2">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-[#cfe3f0] tabular-nums">
                {label} · {room} · {frame.ratio} · {frame.resolution.toUpperCase()}
                {view === "3d" ? (
                  <span className="hidden text-[11px] text-[#a9bdc9] md:inline">· Drag to orbit · Scroll to zoom</span>
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
                      : "border-white/15 bg-white/5 text-white/90 hover:border-[#e8c98a]",
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
                  className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] font-medium text-white/90 transition hover:border-[#e8c98a]"
                >
                  <Crosshair className="size-3 text-[#e8c98a]" />
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
                  className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] font-medium text-white/90 transition hover:border-[#e8c98a]"
                >
                  <ScanEye className="size-3 text-[#e8c98a]" />
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
            )}
          </div>

          {/* Thin Lean Camera & Optics Strip above Chat Box */}
          <CameraOpticsBar />

          {/* Frosted Studio Prompt Dock & Controls */}
          <Composer />
        </div>
      </section>

      {/* Right Rail: Switch cleanly between Prompt Preset Matrix (200+100) & Classic Scene/Optics Panel */}
      {!inspectorCollapsed ? (
        <aside
          id="studio-properties"
          className="flex w-full shrink-0 flex-col gap-2 px-3 pb-4 lg:h-full lg:w-[372px] lg:overflow-hidden lg:border-l lg:border-[#d1c5b8]/35 lg:py-3 lg:pr-4 lg:pl-3 dark:lg:border-[#a9bdc9]/20"
        >
          <div className="grid shrink-0 grid-cols-2 gap-1 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-1 dark:border-[#a9bdc9]/20 dark:bg-[#121c29]">
            <button
              type="button"
              data-testid="right-tab-matrix"
              onClick={() => setRightTab("matrix")}
              className={cn(
                "inline-flex h-7 items-center justify-center gap-1 rounded-full text-[11px] font-semibold transition",
                rightTab === "matrix"
                  ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "text-[#4d463c] dark:text-[#a9bdc9]",
              )}
            >
              <Sparkles className="size-3" /> Presets (200+100)
            </button>
            <button
              type="button"
              data-testid="right-tab-optics"
              onClick={() => setRightTab("optics")}
              className={cn(
                "inline-flex h-7 items-center justify-center gap-1 rounded-full text-[11px] font-semibold transition",
                rightTab === "optics"
                  ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "text-[#4d463c] dark:text-[#a9bdc9]",
              )}
            >
              <SlidersHorizontal className="size-3" /> Scene & Optics
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
            {rightTab === "matrix" ? (
              <PresetMatrixPanel />
            ) : (
              <PropertiesPanel
                collapsed={false}
                onToggleCollapse={() => setInspectorCollapsed(true)}
                onOpenStage={(stage) => {
                  if (stage === "result") {
                    openExplicitStage(stage);
                  } else {
                    setView(stage);
                  }
                }}
                onExportPlate={exportLayeredBundle}
              />
            )}
            <AgentDock />
          </div>
        </aside>
      ) : null}

      {/* Publish to Project Gallery Modal */}
      {publishOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs">
          <form onSubmit={handlePublishSubmit} className="arctic-glass-z2 w-full max-w-md rounded-3xl p-6 text-[#1b1c1a] shadow-2xl dark:text-[#e8eff3]">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Publish to Project Gallery</h2>
              <button type="button" onClick={() => setPublishOpen(false)} className="grid size-8 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#4d463c] dark:text-[#a9bdc9]">Save your before/after architectural plate into the Gallery comparison archive.</p>

            <div className="mt-4 space-y-3 text-xs">
              <label className="block">
                <span className="font-medium">Project Title</span>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  placeholder={`${design.look} ${label} Study`}
                  className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-3 text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
                />
              </label>

              <label className="block">
                <span className="font-medium">Location / Context</span>
                <input
                  type="text"
                  value={pubLocation}
                  onChange={(e) => setPubLocation(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-3 text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-medium">Discipline</span>
                  <select
                    value={pubDiscipline}
                    onChange={(e) => setPubDiscipline(e.target.value as PublishedGalleryProject["discipline"])}
                    className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-[#1b1c1a] outline-none dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
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
                  <span className="font-medium">Comparison Study</span>
                  <select
                    value={pubType}
                    onChange={(e) => setPubType(e.target.value as PublishedGalleryProject["comparisonType"])}
                    className="mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-[#1b1c1a] outline-none dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
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
              <button type="button" onClick={() => setPublishOpen(false)} className="h-9 rounded-full border border-[#d1c5b8]/60 px-4 text-xs dark:border-[#a9bdc9]/30">
                Cancel
              </button>
              <button type="submit" className="ice-cta h-9 rounded-full px-5 text-xs font-bold">
                Save to Gallery
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <FidelityGateModal
        open={gateModalOpen}
        onClose={() => setGateModalOpen(false)}
        onFixInpaint={() => {
          setSplitHubEnabled(false);
          setActiveStudio("mas-2d");
          setView("mask");
        }}
      />

      <NvidiaVisionDialog
        open={visionOpen}
        onOpenChange={setVisionOpen}
        defaultImageUrl={plate?.url ?? upload ?? heroSample.src}
      />
    </main>
  );
}
