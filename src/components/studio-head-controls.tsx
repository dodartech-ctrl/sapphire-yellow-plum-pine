import {
  Box,
  CheckCircle2,
  ChevronDown,
  Columns2,
  Compass,
  Download,
  Expand,
  Layers,
  Loader2,
  Lock,
  Maximize2,
  Paintbrush,
  Palette,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  ScanEye,
  Scissors,
  ShieldCheck,
  Sparkles,
  Sun,
  SunMoon,
  Unlock,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { appendSuggestionToIdea } from "@/lib/archviz-dictionary";
import type { NamedStudioId } from "@/lib/prd-studio-data";
import { PRD_LIGHT_PALETTE, PRD_MATERIAL_PALETTE } from "@/lib/presets-catalog";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { WORKFLOW_INTENTS, type WorkflowIntentId } from "@/lib/workflow-journey";

export type StudioHeadStage =
  | "source"
  | "3d"
  | "sketch"
  | "cv"
  | "sam2"
  | "mask"
  | "result"
  | "grid"
  | "compare"
  | "360"
  | "nodes";

export type StagePhaseGroup = {
  phase: string;
  tabs: { id: StudioHeadStage; label: string; action: () => void }[];
};

type StudioHeadControlsProps = {
  activeIntent: WorkflowIntentId;
  onSelectIntent: (intentId: WorkflowIntentId) => void;
  activeStudio: NamedStudioId;
  showingSplitHub: boolean;
  onEnableSplitHub: () => void;
  view: StudioHeadStage;
  onOpenStage: (stage: StudioHeadStage) => void;
  stagePhases: StagePhaseGroup[];
  contractOpen: boolean;
  onToggleContract: () => void;
  onOpenGateModal: () => void;
  inspectorCollapsed: boolean;
  onToggleInspector: () => void;
  hasPlate: boolean;
  hasSource: boolean;
  canCompare?: boolean;
  onToggleCompare?: () => void;
  onTriggerUpload?: () => void;
  busy: boolean;
  onRelightDusk: () => void;
  onOutpaintWide: () => void;
  onUpscale4x: () => void;
  onOpenPublish: () => void;
  onExportBundle: () => void;
  onOpenVision: () => void;
};

export function StudioHeadControls({
  activeIntent,
  onSelectIntent,
  activeStudio,
  showingSplitHub,
  onEnableSplitHub,
  view,
  onOpenStage,
  stagePhases,
  contractOpen,
  onToggleContract,
  onOpenGateModal,
  inspectorCollapsed,
  onToggleInspector,
  hasPlate,
  hasSource,
  canCompare = false,
  onToggleCompare,
  onTriggerUpload,
  busy,
  onRelightDusk,
  onOutpaintWide,
  onUpscale4x,
  onOpenPublish,
  onExportBundle,
  onOpenVision,
}: StudioHeadControlsProps) {
  const splitViewMode = useOriel((s) => s.splitViewMode);
  const setSplitViewMode = useOriel((s) => s.setSplitViewMode);
  const engine = useOriel((s) => s.engine);
  const setEngineField = useOriel((s) => s.setEngineField);
  const design = useOriel((s) => s.design);
  const setDesignField = useOriel((s) => s.setDesignField);
  const idea = useOriel((s) => s.idea);
  const setIdea = useOriel((s) => s.setIdea);
  const designContract = useOriel((s) => s.designContract);
  const fidelityReport = useOriel((s) => s.fidelityReport);

  const [deckOpen, setDeckOpen] = useState(false);
  const [mas2dMode, setMas2dMode] = useState<"edit" | "compose">(() =>
    view === "sketch" ? "compose" : "edit",
  );
  const [paletteDrawer, setPaletteDrawer] = useState<"none" | "materials" | "lights">("none");
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!deckOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (deckRef.current && !deckRef.current.contains(event.target as Node)) {
        setDeckOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setDeckOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [deckOpen]);

  const filteredMaterials = useMemo(
    () => PRD_MATERIAL_PALETTE.filter((m) => m.space === design.vertical || paletteDrawer === "materials").slice(0, 8),
    [design.vertical, paletteDrawer],
  );
  const filteredLights = useMemo(
    () => PRD_LIGHT_PALETTE.filter((l) => l.space === design.vertical || l.space === "exterior").slice(0, 8),
    [design.vertical],
  );

  const stageLabel =
    stagePhases.flatMap((g) => g.tabs).find((t) => t.id === view)?.label ??
    (showingSplitHub ? "Split" : "Stage");

  return (
    <div className="flex min-w-0 items-center justify-center gap-1">
      {/* Lean 5-Step Workflow Pill */}
      <nav
        aria-label="Architectural Workflow Stepper"
        data-testid="workflow-intent-bar"
        className="hidden shrink-0 items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/80 p-0.5 md:flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29]/90"
      >
        {WORKFLOW_INTENTS.map((item) => {
          const isActive = activeIntent === item.id && view !== "compare";
          const shortName =
            item.id === "render"
              ? "Scene"
              : item.id === "3d"
                ? "3D"
                : item.id === "edit"
                  ? "Edit"
                  : item.id === "enhance"
                    ? "Enhance"
                    : "360°";
          return (
            <button
              key={item.id}
              type="button"
              data-testid={`intent-tab-${item.id}`}
              aria-pressed={isActive}
              title={item.hint}
              onClick={() => onSelectIntent(item.id)}
              className={cn(
                "inline-flex h-6.5 shrink-0 items-center whitespace-nowrap rounded-full px-1.5 text-[10px] font-medium transition 2xl:px-2",
                isActive
                  ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
              )}
            >
              {shortName}
            </button>
          );
        })}
      </nav>

      {/* Quick Scene Upload Trigger */}
      {onTriggerUpload ? (
        <button
          type="button"
          data-testid="header-upload-btn"
          onClick={onTriggerUpload}
          aria-label="Upload Photo or 3D GLB into Scene"
          title="Upload Photo, Sketch, or 3D GLB/OBJ into Scene"
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/85 px-2 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8c98a] dark:hover:border-[#e8c98a]"
        >
          <Upload className="size-3" />
          <span className="hidden 2xl:inline">Upload</span>
        </button>
      ) : null}

      {/* Always-Visible Compare Toggle */}
      {onToggleCompare ? (
        <button
          type="button"
          data-testid="header-compare-btn"
          aria-pressed={view === "compare"}
          onClick={onToggleCompare}
          title={canCompare ? "Compare Uploaded Source vs Rendered Result" : "Compare Before/After (upload & render first)"}
          className={cn(
            "hidden h-7 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold transition md:inline-flex",
            view === "compare"
              ? "border-[#725b38] bg-[#c5a880] text-[#281800] shadow-xs dark:border-[#e8c98a] dark:bg-[#e8c98a] dark:text-[#1b1407]"
              : canCompare
                ? "border-[#d1c5b8]/55 bg-white/85 text-[#1b1c1a] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]"
                : "border-[#d1c5b8]/40 bg-white/60 text-[#7f766a] hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#121c29] dark:text-[#7f9bb2]",
          )}
        >
          <Columns2 className="size-3" />
          <span className="hidden 2xl:inline">Compare</span>
        </button>
      ) : null}

      {/* Restored Split / 3D / AI (and MAS 2D Edit/Compose) directly visible from xl (1280px+) */}
      {showingSplitHub ? (
        <div
          className="hidden shrink-0 items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 xl:flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29]"
          role="group"
          aria-label="Split viewport mode"
        >
          {(
            [
              { id: "split", label: "Split", full: "Split Canvas" },
              { id: "3d-solo", label: "3D", full: "3D Mesh Solo" },
              { id: "ai-solo", label: "AI", full: "AI Canvas Solo" },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              title={mode.full}
              aria-label={mode.full}
              data-testid={`split-mode-${mode.id}`}
              onClick={() => setSplitViewMode(mode.id)}
              className={cn(
                "h-6 rounded-full px-1.5 text-[9.5px] font-semibold transition",
                splitViewMode === mode.id
                  ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      ) : activeStudio === "mas-2d" ? (
        <div className="hidden shrink-0 items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 xl:flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29]">
          <button
            type="button"
            onClick={() => {
              setMas2dMode("edit");
              onOpenStage("mask");
            }}
            className={cn(
              "h-6 rounded-full px-2 text-[9.5px] font-semibold transition",
              mas2dMode === "edit"
                ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                : "text-[#4d463c] dark:text-[#a9bdc9]",
            )}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setMas2dMode("compose");
              onOpenStage("sketch");
            }}
            className={cn(
              "h-6 rounded-full px-2 text-[9.5px] font-semibold transition",
              mas2dMode === "compose"
                ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                : "text-[#4d463c] dark:text-[#a9bdc9]",
            )}
          >
            Compose
          </button>
        </div>
      ) : null}

      {/* Core Controls: Gate + Lock Seed + Wide Canvas + Unified Command Deck */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          data-testid="open-fidelity-gate-btn"
          onClick={onOpenGateModal}
          title="Open Architectural Fidelity Gate"
          className="hidden h-7 shrink-0 items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 text-[10px] font-semibold text-emerald-700 transition hover:border-emerald-500/60 sm:inline-flex dark:text-emerald-300"
        >
          <ShieldCheck className="size-3" />
          <span>{fidelityReport ? `${Math.round(fidelityReport.overallScore * 100)}%` : "Gate"}</span>
        </button>

        {/* Restored Lock Seed Button */}
        <button
          type="button"
          data-testid="header-lock-seed-btn"
          aria-pressed={engine.seedLocked}
          onClick={() => {
            setEngineField("seedLocked", !engine.seedLocked);
            toast.success(engine.seedLocked ? "Seed unlocked for fresh variations" : `Seed #${engine.seed} locked`);
          }}
          aria-label={engine.seedLocked ? "Unlock render seed" : "Lock render seed"}
          title={engine.seedLocked ? `Seed #${engine.seed} locked — click to unlock` : `Lock seed #${engine.seed} for reproducible edits`}
          className={cn(
            "hidden size-7 shrink-0 place-items-center rounded-full border transition lg:grid",
            engine.seedLocked
              ? "border-[#c5a880] bg-[#c5a880]/25 text-[#513d1d] dark:border-[#e8c98a] dark:bg-[#202b38] dark:text-[#e8c98a]"
              : "border-[#d1c5b8]/55 bg-white/85 text-[#4d463c] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
          )}
        >
          {engine.seedLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
        </button>

        {/* Restored Wide Canvas / Inspector Rail Toggle */}
        <button
          type="button"
          data-testid="header-toggle-inspector-btn"
          aria-pressed={inspectorCollapsed}
          onClick={onToggleInspector}
          aria-label={inspectorCollapsed ? "Show Right Preset Matrix Rail" : "Expand Wide Canvas"}
          title={inspectorCollapsed ? "Show Preset Matrix & Optics Rail" : "Collapse Rail for Wide Canvas"}
          className={cn(
            "hidden size-7 shrink-0 place-items-center rounded-full border transition lg:grid",
            inspectorCollapsed
              ? "border-[#725b38] bg-[#c5a880]/25 text-[#513d1d] dark:border-[#e8c98a] dark:bg-[#202b38] dark:text-[#e8c98a]"
              : "border-[#d1c5b8]/55 bg-white/85 text-[#4d463c] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]",
          )}
        >
          {inspectorCollapsed ? <PanelRightOpen className="size-3.5" /> : <PanelRightClose className="size-3.5" />}
        </button>

        {/* Unified Stage, Telemetry, Lock, Rail & Plate Command Deck Popover */}
        <div ref={deckRef} className="relative">
          <button
            type="button"
            data-testid="studio-command-menu-btn"
            aria-expanded={deckOpen}
            onClick={() => setDeckOpen((v) => !v)}
            title="Open Stages, Palettes, Relight/Outpaint/Upscale & Export Deck"
            className={cn(
              "inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-1.5 text-[10px] font-semibold transition 2xl:px-2",
              deckOpen
                ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:bg-[#202b38] dark:text-[#e8c98a]"
                : "border-[#d1c5b8]/55 bg-white/85 text-[#1b1c1a] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]",
            )}
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="hidden 2xl:inline">{showingSplitHub || view === "compare" ? "Deck" : stageLabel}</span>
            <ChevronDown className={cn("size-3 transition-transform", deckOpen ? "rotate-180" : "")} />
          </button>

          {deckOpen ? (
            <div
              data-testid="studio-command-deck"
              className="arctic-glass-z2 fixed top-14 right-2 left-2 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-2xl p-3.5 text-xs text-[#1b1c1a] shadow-2xl sm:absolute sm:top-10 sm:right-0 sm:left-auto sm:w-[500px] dark:text-[#e8eff3]"
            >
              {/* Telemetry & Engine Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d1c5b8]/35 pb-2.5 dark:border-[#a9bdc9]/20">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efeeea] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#725b38] dark:bg-[#e8c98a]" />
                    SAM 3D • RUNNING
                  </span>
                  <span className="font-mono text-[10px] text-[#4d463c] dark:text-[#a9bdc9]">
                    38ms · 18.4/24 GB
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleContract();
                      setDeckOpen(false);
                    }}
                    className={cn(
                      "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium",
                      contractOpen
                        ? "border-[#725b38] bg-[#c5a880]/20 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                        : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
                    )}
                    title="Inspect Design Contract (Here is what I see)"
                  >
                    <CheckCircle2 className="size-3 text-[#725b38] dark:text-[#e8c98a]" />
                    Rung {designContract.rung.rung} · {designContract.rung.badge}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEngineField("liveStreamEnabled", !engine.liveStreamEnabled);
                      toast.success(
                        !engine.liveStreamEnabled
                          ? "Synchronized 3D camera frustum with AI viewport"
                          : "Paused live camera frustum sync",
                      );
                    }}
                    className={cn(
                      "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-medium",
                      engine.liveStreamEnabled
                        ? "border-[#c5a880] bg-[#c5a880]/20 text-[#725b38] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                        : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                    )}
                    title="Synchronize Camera Frustum"
                  >
                    <RefreshCw className="size-3" />
                    Sync
                  </button>
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
                      "inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-medium",
                      engine.seedLocked
                        ? "border-[#c5a880] bg-[#c5a880]/20 text-[#513d1d] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                        : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                    )}
                    title="Lock Mood & Seed"
                  >
                    {engine.seedLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                    {engine.seedLocked ? "Locked" : "Seed"}
                  </button>
                  <button
                    type="button"
                    data-testid="toggle-inspector-btn"
                    onClick={() => {
                      onToggleInspector();
                      setDeckOpen(false);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2 text-[10px] font-medium text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
                    title={inspectorCollapsed ? "Show Presets & Optics Rail" : "Wide Canvas (Hide Right Rail)"}
                  >
                    {inspectorCollapsed ? <PanelRightOpen className="size-3" /> : <PanelRightClose className="size-3" />}
                    {inspectorCollapsed ? "Show Rail" : "Wide"}
                  </button>
                  {showingSplitHub ? (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenStage(hasPlate ? "result" : "3d");
                        setDeckOpen(false);
                      }}
                      className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2 text-[10px] font-medium text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
                      title="Open Classic Full Stage View"
                    >
                      <Maximize2 className="size-3" /> Full Stage
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onEnableSplitHub();
                        setDeckOpen(false);
                      }}
                      className="inline-flex h-7 items-center gap-1 rounded-full bg-[#c5a880]/25 px-2 text-[10px] font-semibold text-[#513d1d] dark:bg-[#202b38] dark:text-[#cfe3f0]"
                    >
                      <Columns2 className="size-3" /> Split 3D+AI
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile / Compact Workflow Intents & Split Mode */}
              <div className="mt-2.5 space-y-2 md:hidden">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">
                  Workflow Journey
                </p>
                <div className="flex flex-wrap gap-1">
                  {WORKFLOW_INTENTS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectIntent(item.id);
                        setDeckOpen(false);
                      }}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[10px] font-medium",
                        activeIntent === item.id
                          ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                          : "bg-[#efeeea] text-[#4d463c] dark:bg-[#16202d] dark:text-[#a9bdc9]",
                      )}
                    >
                      {item.step}. {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {showingSplitHub ? (
                <div className="mt-2.5 flex items-center justify-between gap-2 xl:hidden">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">
                    Viewport Split
                  </span>
                  <div className="flex gap-1">
                    {(
                      [
                        { id: "split", label: "Split Canvas" },
                        { id: "3d-solo", label: "3D Mesh Solo" },
                        { id: "ai-solo", label: "AI Canvas Solo" },
                      ] as const
                    ).map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setSplitViewMode(mode.id)}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                          splitViewMode === mode.id
                            ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                            : "bg-[#efeeea] text-[#4d463c] dark:bg-[#16202d] dark:text-[#a9bdc9]",
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Plate Post-Processing & Publishing Actions */}
              <div className="mt-2.5 border-b border-[#d1c5b8]/35 pb-2.5 dark:border-[#a9bdc9]/20">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                    Plate & Vision Actions
                  </span>
                  {!hasPlate ? (
                    <span className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">Render or upload to enable</span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    disabled={busy || !hasPlate}
                    onClick={() => {
                      onRelightDusk();
                      setDeckOpen(false);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
                  >
                    <SunMoon className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Relight Dusk
                  </button>
                  <button
                    type="button"
                    disabled={busy || !hasPlate}
                    onClick={() => {
                      onOutpaintWide();
                      setDeckOpen(false);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
                  >
                    <Expand className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Outpaint 21:9
                  </button>
                  <button
                    type="button"
                    disabled={busy || !hasPlate}
                    onClick={() => {
                      onUpscale4x();
                      setDeckOpen(false);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
                  >
                    {busy ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3 text-[#725b38] dark:text-[#e8c98a]" />}
                    Upscale 4×
                  </button>
                  <button
                    type="button"
                    disabled={!hasPlate}
                    onClick={() => {
                      onOpenPublish();
                      setDeckOpen(false);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-xl bg-[#c5a880] px-2.5 text-[11px] font-semibold text-[#281800] disabled:opacity-45 dark:bg-[#e8c98a] dark:text-[#261a00]"
                  >
                    <Upload className="size-3" /> Publish
                  </button>
                  <button
                    type="button"
                    disabled={!hasPlate && !hasSource}
                    onClick={() => {
                      onExportBundle();
                      setDeckOpen(false);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
                  >
                    <Download className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Export Bundle
                  </button>
                  <button
                    type="button"
                    data-testid="deck-nvidia-vision-btn"
                    onClick={() => {
                      onOpenVision();
                      setDeckOpen(false);
                    }}
                    className="inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
                  >
                    <ScanEye className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Vision AI
                  </button>
                </div>
              </div>

              {/* All 11 Studio Stages */}
              <div className="mt-2.5 space-y-1.5 border-b border-[#d1c5b8]/35 pb-2.5 dark:border-[#a9bdc9]/20">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                  Stage Switcher
                </p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {stagePhases.map((group) => (
                    <div key={group.phase} className="space-y-1">
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#5f7f98]">
                        {group.phase}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {group.tabs.map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              tab.action();
                              setDeckOpen(false);
                            }}
                            className={cn(
                              "inline-flex h-6.5 items-center gap-1 rounded-lg px-2 text-[10px] font-medium transition",
                              view === tab.id && !showingSplitHub
                                ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                                : "bg-[#efeeea]/85 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#16202d] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                            )}
                          >
                            {tab.id === "360" ? <Compass className="size-2.5" /> : tab.id === "3d" ? <Box className="size-2.5" /> : null}
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAS 2D Edit/Compose + CC0 Material & IES Light Palettes */}
              <div className="mt-2.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                    <Paintbrush className="size-3" /> MAS 2D & Palettes
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      data-testid="mas2d-materials-btn"
                      onClick={() => setPaletteDrawer(paletteDrawer === "materials" ? "none" : "materials")}
                      className={cn(
                        "inline-flex h-6.5 items-center gap-1 rounded-full border px-2 text-[10px] font-medium",
                        paletteDrawer === "materials"
                          ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                          : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
                      )}
                    >
                      <Palette className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Materials (CC0)
                    </button>
                    <button
                      type="button"
                      data-testid="mas2d-lights-btn"
                      onClick={() => setPaletteDrawer(paletteDrawer === "lights" ? "none" : "lights")}
                      className={cn(
                        "inline-flex h-6.5 items-center gap-1 rounded-full border px-2 text-[10px] font-medium",
                        paletteDrawer === "lights"
                          ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                          : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
                      )}
                    >
                      <Sun className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Lights (IES)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenStage("sam2");
                        setDeckOpen(false);
                      }}
                      className="inline-flex h-6.5 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2 text-[10px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0]"
                    >
                      <Scissors className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Cutout & Pen
                    </button>
                  </div>
                </div>

                {paletteDrawer === "materials" ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredMaterials.map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => {
                          setIdea(appendSuggestionToIdea(idea, mat.fragment));
                          toast.success(`Injected ${mat.name} (${mat.source} ${mat.licence})`);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-1.5 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]"
                      >
                        <span className="size-5 shrink-0 rounded-md border border-black/15" style={{ backgroundColor: mat.hex }} />
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-semibold">{mat.name}</p>
                          <p className="truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">{mat.scaleMeters} · {mat.licence}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}

                {paletteDrawer === "lights" ? (
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredLights.map((lp) => (
                      <button
                        key={lp.id}
                        type="button"
                        onClick={() => {
                          setIdea(appendSuggestionToIdea(idea, lp.fragment));
                          setDesignField("light", lp.lightField);
                          toast.success(`Applied ${lp.name} (${lp.kelvin}K · ${lp.iesProfile})`);
                        }}
                        className="flex flex-col gap-0.5 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-1.5 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate text-[10px] font-semibold">{lp.name}</span>
                          <span className="shrink-0 font-mono text-[9px] text-[#725b38] dark:text-[#e8c98a]">{lp.kelvin}K</span>
                        </div>
                        <span className="truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">{lp.iesProfile}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    setDeckOpen(false);
                    document.getElementById("studio-properties")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex h-7 w-full items-center justify-center gap-1 rounded-xl border border-[#d1c5b8]/45 bg-[#efeeea]/80 text-[10px] font-semibold text-[#4d463c] lg:hidden dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#cfe3f0]"
                >
                  <Layers className="size-3" /> Jump to Optics & Presets ↓
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
