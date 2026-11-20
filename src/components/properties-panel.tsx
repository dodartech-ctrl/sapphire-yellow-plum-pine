import {
  ACTIVITIES,
  CAMERAS,
  COLORS,
  DETAILS,
  GROUPS,
  LIGHTS,
  LOOKS,
  MOODS,
  PEOPLE,
  RANGES,
  STRENGTHS,
  TAGS,
  TIMES,
  WEATHER,
  type PanelTab,
} from "@/lib/properties";
import {
  ANNOTATOR_MODES,
  CLIMATE_REGIONS,
  DETAIL_DENSITIES,
  ENHANCE_MODES,
  ESRGAN_MODELS,
  FACADE_TYPOLOGIES,
  IOPAINT_FACE_MODELS,
  IOPAINT_MODELS,
  IOPAINT_REMOVEBG_MODELS,
  IOPAINT_TASKS,
  IPADAPTER_PRESETS,
  OUTPAINT_RATIOS,
  RELIGHT_PRESETS,
  RENDER_FIDELITIES,
  SKETCH_MODES,
  WORKFLOW_PRESETS,
  type IopaintModel,
  type OutpaintRatio,
  type RelightPreset,
  type UpscaleFactor,
} from "@/lib/engines";
import { ATMOSPHERIC_REGIMES } from "@/lib/atelier-studio";
import { RATIOS, type Ratio } from "@/lib/frame";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";
import { ADVANCED_GROUPS, EXTRA_PILLS } from "@/lib/dictionary";
import {
  Camera,
  ChevronDown,
  Cpu,
  Download,
  Heart,
  Hexagon,
  Lock,
  Paintbrush,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Radio,
  RotateCcw,
  Scissors,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Sun,
  SunMedium,
  Sunset,
  Unlock,
  Upload,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

const TABS: { id: PanelTab; label: string; icon: typeof Pencil }[] = [
  { id: "design", label: "Design", icon: Pencil },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "light", label: "Light", icon: Sun },
  { id: "human", label: "Human", icon: User },
  { id: "mood", label: "Mood", icon: Heart },
  { id: "engine", label: "Engine", icon: Cpu },
];

const MATERIAL_SWATCHES = [
  {
    id: "travertine",
    label: "Roman Travertine",
    sub: "Matte Honed",
    swatchClass: "bg-gradient-to-br from-[#e7ded1] via-[#d7ccb8] to-[#b8aa93]",
    pickTarget: "wall",
    pickValue: "Travertine",
    tag: "Travertine",
  },
  {
    id: "palm-terracotta",
    label: "Sunlit Terracotta",
    sub: "Tactile Lime",
    swatchClass: "bg-gradient-to-br from-[#cf8e67] via-[#b86f49] to-[#874929]",
    pickTarget: "floor",
    pickValue: "Terracotta",
    tag: "Warm limestone",
  },
];

const TILES: Record<string, { id: string; label: string; image: string }[]> = {
  interior: [
    { id: "floor", label: "Flooring", image: "/viz/t08-material-junction.jpg" },
    { id: "wall", label: "Walls", image: "/viz/t09-living-room-clay-edit.jpg" },
    { id: "ceiling", label: "Ceiling", image: "/viz/t03-compact-living-room.jpg" },
    { id: "furniture", label: "Furniture", image: "/viz/t03-compact-living-room.jpg" },
    { id: "fixture", label: "Lighting", image: "/viz/t04-neighborhood-cafe.jpg" },
    { id: "openings", label: "Doors", image: "/viz/t02-sectional-arts-center.jpg" },
    { id: "kitchen", label: "Windows", image: "/viz/t05-subtropical-home.jpg" },
    { id: "decor", label: "Decor", image: "/viz/t06-urban-courtyard.jpg" },
  ],
  exterior: [
    { id: "facade", label: "Facade", image: "/viz/t05-subtropical-home.jpg" },
    { id: "roof", label: "Roof", image: "/viz/t10-home-dusk-edit.jpg" },
    { id: "windows", label: "Windows", image: "/viz/t01-public-library.jpg" },
    { id: "entry", label: "Entrance", image: "/viz/t02-sectional-arts-center.jpg" },
    { id: "balcony", label: "Balcony", image: "/viz/t07-cultural-campus.jpg" },
    { id: "terrace", label: "Terrace", image: "/viz/t06-urban-courtyard.jpg" },
    { id: "drive", label: "Driveway", image: "/viz/t08-material-junction.jpg" },
    { id: "water", label: "Water", image: "/viz/t05-subtropical-home.jpg" },
  ],
  amenities: [
    { id: "water", label: "Water", image: "/viz/t06-urban-courtyard.jpg" },
    { id: "wellness", label: "Wellness", image: "/viz/t04-neighborhood-cafe.jpg" },
    { id: "social", label: "Social", image: "/viz/t03-compact-living-room.jpg" },
    { id: "sport", label: "Sport", image: "/viz/t07-cultural-campus.jpg" },
    { id: "outdoor", label: "Outdoor", image: "/viz/t05-subtropical-home.jpg" },
    { id: "family", label: "Family", image: "/viz/t09-living-room-clay-edit.jpg" },
    { id: "work", label: "Work", image: "/viz/t01-public-library.jpg" },
    { id: "security", label: "Arrival", image: "/viz/t02-sectional-arts-center.jpg" },
  ],
  landscape: [
    { id: "trees", label: "Trees", image: "/viz/t05-subtropical-home.jpg" },
    { id: "planting", label: "Planting", image: "/viz/t06-urban-courtyard.jpg" },
    { id: "lawn", label: "Lawn", image: "/viz/t07-cultural-campus.jpg" },
    { id: "garden", label: "Garden", image: "/viz/t10-home-dusk-edit.jpg" },
    { id: "path", label: "Paths", image: "/viz/t08-material-junction.jpg" },
    { id: "water", label: "Water", image: "/viz/t06-urban-courtyard.jpg" },
    { id: "structure", label: "Structure", image: "/viz/t02-sectional-arts-center.jpg" },
    { id: "edge", label: "Boundary", image: "/viz/t09-living-room-clay-edit.jpg" },
  ],
};

const MATRIX_SLOTS: Array<{ key: "massing" | "material" | "lighting"; label: string; sample: string }> = [
  { key: "massing", label: "Massing / Layout", sample: "/viz/p01-pavilion-dusk.jpg" },
  { key: "material", label: "Material Palette", sample: "/viz/t05-subtropical-home.jpg" },
  { key: "lighting", label: "Atmosphere / Lighting", sample: "/viz/p02-loft-after.jpg" },
];

export function PropertiesPanel({
  collapsed = false,
  onToggleCollapse,
  onOpenStage,
  onExportPlate,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenStage?: (stage: "sam2" | "mask" | "3d" | "result") => void;
  onExportPlate?: () => void;
}) {
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const frame = useOriel((state) => state.frame);
  const scene3d = useOriel((state) => state.scene3d);
  const plate = useOriel((state) => state.plate);
  const conditioningChannels = useOriel((state) => state.conditioningChannels);
  const clearConditioningChannels = useOriel((state) => state.clearConditioningChannels);
  const setPanel = useOriel((state) => state.setPanel);
  const setFrame = useOriel((state) => state.setFrame);
  const setScene3DField = useOriel((state) => state.setScene3DField);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setPick = useOriel((state) => state.setPick);
  const setTarget = useOriel((state) => state.setTarget);
  const toggleTag = useOriel((state) => state.toggleTag);
  const setAdvanced = useOriel((state) => state.setAdvanced);
  const toggleExtra = useOriel((state) => state.toggleExtra);
  const setEngineField = useOriel((state) => state.setEngineField);
  const applyWorkflowPreset = useOriel((state) => state.applyWorkflowPreset);
  const resetEngine = useOriel((state) => state.resetEngine);
  const undo = useOriel((state) => state.undo);
  const redo = useOriel((state) => state.redo);

  const { busy, applyRelight, applyOutpaint, applyEnhance, applyRemoveBgPlugin, applyRestoreFacesPlugin } = useGenerate();

  const groups = GROUPS[design.vertical];
  const looks = LOOKS[design.vertical];
  const activeChannelNames = (["depth", "normal", "clay", "annotator"] as const).filter((k) => Boolean(conditioningChannels[k]));

  function openStage(stage: "sam2" | "mask" | "3d" | "result") {
    if (onOpenStage) {
      onOpenStage(stage);
      return;
    }
    window.dispatchEvent(new CustomEvent("oriel-view", { detail: stage }));
  }

  function updateMatrixSlot(slotKey: "massing" | "material" | "lighting", patch: { url?: string | null; weight?: number }) {
    const next = {
      ...engine.refMatrix,
      [slotKey]: { ...engine.refMatrix[slotKey], ...patch },
    };
    setEngineField("refMatrix", next);
    if (patch.url) setEngineField("ipAdapterEnabled", true);
  }

  function handleExportAction() {
    if (plate?.url) {
      const a = document.createElement("a");
      a.href = plate.url;
      a.download = `oriel-atelier-plate-${Date.now()}.png`;
      a.click();
    }
    if (onExportPlate) {
      onExportPlate();
    } else if (!plate?.url) {
      toast.message("Generate a render or upload a source plate before exporting.");
    }
  }

  if (collapsed) {
    return (
      <aside className="hidden shrink-0 flex-col items-center gap-1.5 border-l border-[#d1c5b8]/40 bg-white/70 px-2 py-3 backdrop-blur-2xl lg:flex">
        {onToggleCollapse ? (
          <button
            type="button"
            data-testid="expand-inspector-btn"
            onClick={onToggleCollapse}
            aria-label="Expand Scene & Optics inspector"
            title="Open Scene & Optics"
            className="grid size-9 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#1b1c1a] transition hover:border-[#725b38]"
          >
            <PanelRightOpen className="size-4 text-[#725b38]" />
          </button>
        ) : null}
        <div className="my-1 h-px w-6 bg-[#d1c5b8]/50" />
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = design.panel === tab.id || (tab.id === "design" && design.panel === "advanced");
          return (
            <button
              key={tab.id}
              type="button"
              title={tab.label}
              aria-label={`Open ${tab.label} properties`}
              onClick={() => {
                setPanel(tab.id);
                onToggleCollapse?.();
              }}
              className={cn(
                "flex size-10 flex-col items-center justify-center rounded-xl text-[9px] font-medium transition",
                active ? "bg-[#c5a880] text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a]",
              )}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside id="studio-properties" className="w-full pb-2 lg:flex lg:h-full lg:w-full lg:shrink-0 lg:flex-col">
      <div className="atelier-glass arctic-glass flex flex-col overflow-hidden rounded-3xl border border-[#d1c5b8]/45 shadow-[0_14px_34px_rgba(70,48,16,0.06)] lg:h-full dark:border-[#a9bdc9]/20">
        {/* Sticky Inspector Header */}
        <div className="shrink-0 border-b border-[#d1c5b8]/35 bg-white/50 px-3.5 pt-3.5 pb-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/90">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#725b38] dark:text-[#e8c98a]">
                Studio Inspector
              </span>
              <h2 className="mt-0.5 font-serif text-lg font-medium tracking-tight text-[#1b1c1a] dark:text-[#e8eff3]">
                Scene &amp; Optics
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => undo()}
                className="grid size-7 place-items-center rounded-lg text-xs text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]"
                aria-label="Undo"
                title="Undo"
              >
                ↩
              </button>
              <button
                type="button"
                onClick={() => redo()}
                className="grid size-7 place-items-center rounded-lg text-xs text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]"
                aria-label="Redo"
                title="Redo"
              >
                ↪
              </button>
              <button
                type="button"
                onClick={() => {
                  resetEngine();
                  toast.success("Optics & AI engine reset to studio defaults");
                }}
                className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]"
                title="Reset optics & engine defaults"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
              {onToggleCollapse ? (
                <button
                  type="button"
                  data-testid="collapse-inspector-btn"
                  onClick={onToggleCollapse}
                  aria-label="Collapse Scene & Optics inspector"
                  title="Collapse panel for wider canvas"
                  className="hidden size-7 place-items-center rounded-lg text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] lg:grid dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]"
                >
                  <PanelRightClose className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Segmented 6-Tab Inspector Switcher */}
          <div className="mt-3 grid grid-cols-6 gap-1 rounded-xl bg-[#efeeea]/85 p-1 dark:bg-[#050f1b]/80">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = design.panel === tab.id || (tab.id === "design" && design.panel === "advanced");
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPanel(tab.id)}
                  className={cn(
                    "flex h-11 flex-col items-center justify-center gap-0.5 whitespace-nowrap rounded-lg text-[10px] font-medium transition",
                    active
                      ? "bg-white font-semibold text-[#725b38] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]"
                      : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                  )}
                >
                  <Icon className="size-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <p className="mt-2 truncate font-mono text-[10px] text-[#7f766a] tabular-nums dark:text-[#a9bdc9]">
            {design.look} · {design.light} · {scene3d.focalLength}mm · {engine.workflowPreset}
          </p>
        </div>

        {/* Scrollable Optics & Properties Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {design.panel === "design" || design.panel === "advanced" ? (
            <>
              {/* Tactile Atelier Surface Swatches */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]">
                    Atelier Swatches
                  </span>
                  <button
                    type="button"
                    onClick={() => setTarget("whole")}
                    className="text-[11px] font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]"
                  >
                    All Elements →
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {MATERIAL_SWATCHES.map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => {
                        setPick(sw.pickTarget, sw.pickValue);
                        if (!design.tags.includes(sw.tag)) toggleTag(sw.tag);
                        toast.success(`Applied ${sw.label} finish to ${sw.pickTarget}`);
                      }}
                      className="flex items-center gap-2.5 rounded-2xl border border-[#d1c5b8]/45 bg-white/85 p-2 text-left transition hover:border-[#725b38] hover:shadow-xs dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]"
                    >
                      <span className={cn("size-8 shrink-0 rounded-xl shadow-inner", sw.swatchClass)} aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium text-[#1b1c1a] dark:text-[#e8eff3]">{sw.label}</p>
                        <p className="truncate text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">{sw.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">Elements</p>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {(TILES[design.vertical] ?? []).map((tile) => (
                    <button
                      key={tile.id}
                      type="button"
                      onClick={() => setTarget(tile.id)}
                      className={cn(
                        "hover-tile overflow-hidden rounded-xl border bg-white text-center transition dark:bg-[#16202d]",
                        design.target === tile.id
                          ? "border-[#c5a880] ring-1 ring-[#c5a880] dark:border-[#e8c98a] dark:ring-[#e8c98a]"
                          : "border-[#d1c5b8]/50 dark:border-[#a9bdc9]/20",
                      )}
                    >
                      <img src={tile.image} alt="" className="h-11 w-full object-cover" />
                      <span className="block px-1 py-1 text-[10px] font-medium text-[#1b1c1a] dark:text-[#e8eff3]">{tile.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Fold title="Materials & Finishes" defaultOpen icon={<Hexagon className="size-4 text-[#725b38]" />}>
                {groups.map((group) => (
                  <ChipRow
                    key={group.id}
                    label={group.label}
                    value={design.picks[group.id] ?? group.options[0]}
                    options={group.options}
                    onPick={(value) => setPick(group.id, value)}
                  />
                ))}
              </Fold>
              <Fold title="Look & Feel" icon={<SlidersHorizontal className="size-4 text-[#725b38] dark:text-[#e8c98a]" />} watch={design.look}>
                <div className="grid grid-cols-2 gap-2">
                  {looks.map((look) => (
                    <button
                      key={look.name}
                      type="button"
                      onClick={() => setDesignField("look", look.name)}
                      className={cn(
                        "hover-tile overflow-hidden rounded-xl border bg-white text-left dark:bg-[#121c29]",
                        design.look === look.name ? "border-[#c5a880] ring-1 ring-[#c5a880] dark:border-[#e8c98a] dark:ring-[#e8c98a]" : "border-[#d1c5b8]/50 dark:border-[#a9bdc9]/20",
                      )}
                    >
                      <img src={look.image} alt="" className="h-16 w-full object-cover" />
                      <span className="block px-2 py-1.5 text-xs text-[#1b1c1a] dark:text-[#e8eff3]">{look.name}</span>
                    </button>
                  ))}
                </div>
                <ChipRow label="Range" value={design.range} options={RANGES} onPick={(value) => setDesignField("range", value)} />
                <ChipRow label="Strength" value={design.strength} options={STRENGTHS} onPick={(value) => setDesignField("strength", value)} />
                <ChipRow label="Detail" value={design.detail} options={DETAILS} onPick={(value) => setDesignField("detail", value)} />
              </Fold>
              <Fold title="Tags" icon={<span className="text-sm font-semibold text-[#725b38] dark:text-[#e8c98a]">#</span>}>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "hover-chip h-8 rounded-full border px-3 text-xs",
                        design.tags.includes(tag)
                          ? "bg-[#c5a880] border-transparent font-medium text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                          : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                      )}
                      aria-pressed={design.tags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </Fold>
              <Fold title="Advanced" icon={<SlidersHorizontal className="size-4 text-[#725b38] dark:text-[#e8c98a]" />}>
                {ADVANCED_GROUPS.map((group) => (
                  <ChipRow
                    key={group.key}
                    label={group.label}
                    value={design.advanced[group.key]}
                    options={group.options.map((option) => option.id)}
                    labels={Object.fromEntries(group.options.map((option) => [option.id, option.label]))}
                    onPick={(value) => setAdvanced(group.key, value)}
                  />
                ))}
                <div className="flex flex-wrap gap-2">
                  {EXTRA_PILLS.map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => toggleExtra(pill.id)}
                      className={cn(
                        "hover-chip h-8 rounded-full border px-3 text-xs",
                        design.advanced.extras.includes(pill.id)
                          ? "bg-[#c5a880] border-transparent font-medium text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                          : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                      )}
                      aria-pressed={design.advanced.extras.includes(pill.id)}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              </Fold>
            </>
          ) : null}

          {design.panel === "camera" ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#d1c5b8]/45 bg-white/85 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">
                  3D Optics &amp; Perspective
                </span>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {([24, 35, 50, 85] as const).map((mm) => (
                    <button
                      key={mm}
                      type="button"
                      onClick={() => setScene3DField("focalLength", mm)}
                      className={cn(
                        "h-8 rounded-xl border font-mono text-xs transition",
                        scene3d.focalLength === mm
                          ? "border-[#c5a880] bg-[#c5a880]/20 font-semibold text-[#513d1d] dark:border-[#e8c98a] dark:bg-[#584411]/60 dark:text-[#e8c98a]"
                          : "border-[#d1c5b8]/50 bg-[#fbf9f5] text-[#4d463c] dark:border-[#a9bdc9]/20 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                      )}
                    >
                      {mm}mm
                    </button>
                  ))}
                </div>
                <label className="mt-3 flex cursor-pointer items-center justify-between text-xs text-[#1b1c1a] dark:text-[#e8eff3]">
                  <span className="font-medium">2-Point Tilt Shift Correction</span>
                  <input
                    type="checkbox"
                    checked={scene3d.twoPointTilt}
                    onChange={(e) => setScene3DField("twoPointTilt", e.target.checked)}
                    className="size-4 accent-[#725b38] dark:accent-[#e8c98a]"
                  />
                </label>
              </div>
              <ChipRow label="Camera Angle" value={design.camera} options={CAMERAS} onPick={(value) => setDesignField("camera", value)} />
              <ChipRow
                label="All Export Ratios"
                value={frame.ratio}
                options={RATIOS}
                onPick={(value) => setFrame({ ...frame, ratio: value as Ratio })}
              />
            </div>
          ) : null}

          {design.panel === "light" ? (
            <div className="space-y-4">
              {/* 01 · Atmospheric Regime */}
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]">
                  01 · Atmospheric Regime
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {ATMOSPHERIC_REGIMES.map((reg) => {
                    const active = design.light === reg.light;
                    const Icon = reg.icon === "noon" ? Sun : reg.icon === "twilight" ? Sunset : SunMedium;
                    return (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => {
                          setDesignField("light", reg.light);
                          setScene3DField("d5LightPreset", reg.d5Preset);
                          setScene3DField("sunElevation", reg.sunElevation);
                        }}
                        aria-pressed={active}
                        className={cn(
                          "flex flex-col items-center rounded-2xl border px-2 py-2.5 text-center transition",
                          active
                            ? "border-[#c5a880] bg-[#c5a880]/20 text-[#281800] shadow-xs dark:border-[#e8c98a] dark:bg-[#584411]/60 dark:text-[#e8c98a]"
                            : "border-[#d1c5b8]/45 bg-white/80 text-[#4d463c] hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80 dark:text-[#cfe3f0]",
                        )}
                      >
                        <Icon className={cn("size-4", active ? "text-[#725b38] dark:text-[#e8c98a]" : "text-[#7f766a] dark:text-[#a9bdc9]")} />
                        <span className="mt-1.5 text-[11px] font-medium leading-tight">{reg.label}</span>
                        <span className="font-mono text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">{reg.kelvin}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 02 · Photometric Tuning */}
              <div className="space-y-3 rounded-2xl border border-[#d1c5b8]/45 bg-white/85 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]">
                  02 · Photometric Tuning
                </h3>
                <SliderRow
                  label="Sun Elevation"
                  value={scene3d.sunElevation}
                  min={2}
                  max={85}
                  unit="°"
                  onChange={(v) => setScene3DField("sunElevation", v)}
                />
                <SliderRow
                  label="Solar Azimuth"
                  value={scene3d.sunAzimuth}
                  min={0}
                  max={360}
                  unit="°"
                  onChange={(v) => setScene3DField("sunAzimuth", v)}
                />
                <SliderRow
                  label="Exposure"
                  value={Math.round(scene3d.exposure * 100)}
                  min={40}
                  max={220}
                  unit="%"
                  onChange={(v) => setScene3DField("exposure", Number((v / 100).toFixed(2)))}
                />
                <div className="space-y-2 border-t border-[#d1c5b8]/35 pt-2.5 text-xs dark:border-[#a9bdc9]/20">
                  <label className="flex cursor-pointer items-center justify-between text-[#1b1c1a] dark:text-[#e8eff3]">
                    <span>Real-Time Draft Stream</span>
                    <input
                      type="checkbox"
                      checked={engine.liveStreamEnabled}
                      onChange={(e) => setEngineField("liveStreamEnabled", e.target.checked)}
                      className="size-4 accent-[#725b38] dark:accent-[#e8c98a]"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between text-[#1b1c1a] dark:text-[#e8eff3]">
                    <span>2-Point Tilt Shift</span>
                    <input
                      type="checkbox"
                      checked={scene3d.twoPointTilt}
                      onChange={(e) => setScene3DField("twoPointTilt", e.target.checked)}
                      className="size-4 accent-[#725b38] dark:accent-[#e8c98a]"
                    />
                  </label>
                </div>
              </div>

              <ChipRow label="Light Presets" value={design.light} options={LIGHTS} onPick={(value) => setDesignField("light", value)} />
              <ChipRow label="Time" value={design.time} options={TIMES} onPick={(value) => setDesignField("time", value)} />
              <ChipRow label="Weather" value={design.weather} options={WEATHER} onPick={(value) => setDesignField("weather", value)} />
            </div>
          ) : null}

          {design.panel === "human" ? (
            <div className="space-y-4">
              <ChipRow label="People" value={design.people} options={PEOPLE} onPick={(value) => setDesignField("people", value)} />
              <ChipRow label="Activity" value={design.activity} options={ACTIVITIES} onPick={(value) => setDesignField("activity", value)} />
            </div>
          ) : null}

          {design.panel === "mood" ? (
            <div className="space-y-4">
              <ChipRow label="Mood" value={design.mood} options={MOODS} onPick={(value) => setDesignField("mood", value)} />
              <ChipRow label="Color" value={design.color} options={COLORS} onPick={(value) => setDesignField("color", value)} />
            </div>
          ) : null}

          {design.panel === "engine" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]">AI Pipeline Conditioning</span>
                <button type="button" onClick={resetEngine} className="text-[11px] font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]">
                  Reset Defaults
                </button>
              </div>

              {/* Rendair AI · 1-Click Workflow Presets */}
              <div className="rounded-2xl border border-[#d1c5b8]/50 bg-white/85 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
                <p className="text-xs font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">Workflow Preset · Rendair / mnml</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {WORKFLOW_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyWorkflowPreset(preset.id)}
                      className={cn(
                        "flex flex-col items-start rounded-xl border px-2.5 py-2 text-left transition",
                        engine.workflowPreset === preset.id
                          ? "border-[#c5a880] bg-[#c5a880]/20 text-[#281800] dark:border-[#e8c98a] dark:bg-[#584411]/60 dark:text-[#e8c98a]"
                          : "border-[#d1c5b8]/45 bg-[#fbf9f5] text-[#4d463c] hover:border-[#725b38]/50 dark:border-[#a9bdc9]/20 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                      )}
                    >
                      <span className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">{preset.label}</span>
                      <span className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">{preset.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Veras AI · Geometry Accuracy & Seed */}
              <Fold title="Geometry & Seed (Veras AI)" icon={<Hexagon className="size-4 text-[#725b38] dark:text-[#e8c98a]" />} defaultOpen>
                <SliderRow
                  label="Geometry Lock"
                  value={engine.geometryLock}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("geometryLock", v)}
                />
                <SliderRow
                  label="Material Override"
                  value={engine.materialOverride}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("materialOverride", v)}
                />
                <ChipRow
                  label="Render Fidelity"
                  value={engine.renderFidelity}
                  options={RENDER_FIDELITIES.map((f) => f.id)}
                  labels={Object.fromEntries(RENDER_FIDELITIES.map((f) => [f.id, f.label]))}
                  onPick={(v) => setEngineField("renderFidelity", v as typeof engine.renderFidelity)}
                />
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-[#4d463c] dark:text-[#cfe3f0]">Seed</span>
                  <input
                    type="number"
                    value={engine.seed}
                    onChange={(e) => setEngineField("seed", Math.max(1, Number(e.target.value) || 1))}
                    className="h-8 w-28 rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 font-mono text-xs tabular-nums text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
                  />
                  <button
                    type="button"
                    onClick={() => setEngineField("seedLocked", !engine.seedLocked)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px]",
                      engine.seedLocked
                        ? "bg-[#c5a880] border-transparent font-medium text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                    )}
                    aria-pressed={engine.seedLocked}
                  >
                    {engine.seedLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                    {engine.seedLocked ? "Locked" : "Auto"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineField("seed", Math.floor(100000 + Math.random() * 899999))}
                    className="grid size-8 place-items-center rounded-full border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"
                    aria-label="Randomize seed"
                  >
                    <Shuffle className="size-3.5" />
                  </button>
                </div>
              </Fold>

              {/* LookX AI · Exterior & Facade */}
              <Fold title="Facade & Climate (LookX AI)" icon={<SlidersHorizontal className="size-4 text-[#725b38] dark:text-[#e8c98a]" />}>
                <ChipRow
                  label="Facade Typology"
                  value={engine.facadeTypology}
                  options={FACADE_TYPOLOGIES}
                  onPick={(v) => setEngineField("facadeTypology", v as typeof engine.facadeTypology)}
                />
                <ChipRow
                  label="Climate Region"
                  value={engine.climateRegion}
                  options={CLIMATE_REGIONS}
                  onPick={(v) => setEngineField("climateRegion", v as typeof engine.climateRegion)}
                />
                <SliderRow
                  label="Style Transfer Weight"
                  value={engine.styleTransferWeight}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("styleTransferWeight", v)}
                />
                <ChipRow
                  label="Detail Density"
                  value={engine.detailDensity}
                  options={DETAIL_DENSITIES.map((d) => d.id)}
                  labels={Object.fromEntries(DETAIL_DENSITIES.map((d) => [d.id, d.label]))}
                  onPick={(v) => setEngineField("detailDensity", v as typeof engine.detailDensity)}
                />
              </Fold>

              {/* PromeAI & Krea AI · Live Stream, Relight, Outpaint */}
              <Fold title="Live Stream, Relight & Uncrop (Krea)" icon={<Pencil className="size-4 text-[#725b38] dark:text-[#e8c98a]" />} defaultOpen>
                <div className="flex items-center justify-between rounded-xl border border-[#d1c5b8]/50 bg-white px-2.5 py-2 text-xs dark:border-[#a9bdc9]/20 dark:bg-[#050f1b]/70">
                  <div className="flex items-center gap-1.5">
                    <Radio className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" />
                    <span className="font-medium text-[#1b1c1a] dark:text-[#e8eff3]">Real-Time Draft Stream</span>
                  </div>
                  <button
                    type="button"
                    aria-pressed={engine.liveStreamEnabled}
                    onClick={() => setEngineField("liveStreamEnabled", !engine.liveStreamEnabled)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.liveStreamEnabled
                        ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]",
                    )}
                  >
                    {engine.liveStreamEnabled ? "Streaming" : "Off"}
                  </button>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]">AI Relight &amp; Season (Geometry Lock)</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {RELIGHT_PRESETS.filter((r) => r.id !== "none").map((rp) => (
                      <button
                        key={rp.id}
                        type="button"
                        disabled={busy}
                        onClick={() => void applyRelight(rp.id as Exclude<RelightPreset, "none">)}
                        className={cn(
                          "hover-chip h-8 rounded-full border px-3 text-xs font-medium disabled:opacity-50",
                          engine.relightPreset === rp.id
                            ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                            : "border-[#d1c5b8]/60 bg-white text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                        )}
                      >
                        {rp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]">Outpaint Canvas Uncrop</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {OUTPAINT_RATIOS.filter((o) => o.id !== "none").map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        disabled={busy}
                        onClick={() => void applyOutpaint(op.id as Exclude<OutpaintRatio, "none">)}
                        className={cn(
                          "hover-chip h-8 rounded-full border px-3 text-xs font-medium disabled:opacity-50",
                          engine.outpaintRatio === op.id
                            ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                            : "border-[#d1c5b8]/60 bg-white text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                        )}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                <SliderRow
                  label="Sketch Edge Adherence"
                  value={engine.edgeAdherence}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("edgeAdherence", v)}
                />
                <ChipRow
                  label="Sketch Mode"
                  value={engine.sketchMode}
                  options={SKETCH_MODES.map((s) => s.id)}
                  labels={Object.fromEntries(SKETCH_MODES.map((s) => [s.id, s.label]))}
                  onPick={(v) => setEngineField("sketchMode", v as typeof engine.sketchMode)}
                />
                <SliderRow
                  label="Inpaint Strength"
                  value={engine.inpaintStrength}
                  min={10}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("inpaintStrength", v)}
                />
                <ChipRow
                  label="AI Enhance Mode"
                  value={engine.enhanceMode}
                  options={ENHANCE_MODES.map((e) => e.id)}
                  labels={Object.fromEntries(ENHANCE_MODES.map((e) => [e.id, e.label]))}
                  onPick={(v) => setEngineField("enhanceMode", v as typeof engine.enhanceMode)}
                />
              </Fold>

              {/* Sanster/IOPaint Suite & Plugins */}
              <Fold title="IOPaint Suite & Plugins" icon={<Paintbrush className="size-4 text-[#725b38] dark:text-[#e8c98a]" />}>
                <ChipRow
                  label="IOPaint Task"
                  value={engine.iopaintTask}
                  options={IOPAINT_TASKS.map((t) => t.id)}
                  labels={Object.fromEntries(IOPAINT_TASKS.map((t) => [t.id, `${t.label} (${t.badge})`]))}
                  onPick={(v) => {
                    const nextTask = v as typeof engine.iopaintTask;
                    setEngineField("iopaintTask", nextTask);
                    const meta = IOPAINT_TASKS.find((t) => t.id === nextTask);
                    if (meta) setEngineField("iopaintModel", meta.defaultModel);
                  }}
                />
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]">Inpaint / Erase Model</span>
                  <select
                    aria-label="Inpaint / Erase Model"
                    value={engine.iopaintModel}
                    onChange={(e) => setEngineField("iopaintModel", e.target.value as IopaintModel)}
                    className="mt-1.5 h-9 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-xs text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
                  >
                    {IOPAINT_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} — {m.hint}
                      </option>
                    ))}
                  </select>
                </label>
                <SliderRow
                  label="Mask Dilate / Expand"
                  value={engine.iopaintMaskDilate}
                  min={0}
                  max={24}
                  unit="px"
                  onChange={(v) => setEngineField("iopaintMaskDilate", v)}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#4d463c] dark:text-[#cfe3f0]">Invert Inpaint Mask</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("iopaintInvertMask", !engine.iopaintInvertMask)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.iopaintInvertMask
                        ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]",
                    )}
                  >
                    {engine.iopaintInvertMask ? "Inverted" : "Normal"}
                  </button>
                </div>

                <div className="space-y-2 border-t border-[#d1c5b8]/40 pt-3 dark:border-[#a9bdc9]/20">
                  <ChipRow
                    label="RemoveBG Engine"
                    value={engine.iopaintRemoveBgModel}
                    options={IOPAINT_REMOVEBG_MODELS.map((m) => m.id)}
                    labels={Object.fromEntries(IOPAINT_REMOVEBG_MODELS.map((m) => [m.id, m.label]))}
                    onPick={(v) => setEngineField("iopaintRemoveBgModel", v as typeof engine.iopaintRemoveBgModel)}
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void applyRemoveBgPlugin("cutout")}
                      className="hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-50 dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"
                    >
                      <Scissors className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Subject Cutout
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void applyRemoveBgPlugin("mask")}
                      className="hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-50 dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"
                    >
                      <Scissors className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Sky → Mask
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#d1c5b8]/40 pt-3 dark:border-[#a9bdc9]/20">
                  <ChipRow
                    label="Restore Faces Plugin"
                    value={engine.iopaintFaceModel}
                    options={IOPAINT_FACE_MODELS.map((m) => m.id)}
                    labels={Object.fromEntries(IOPAINT_FACE_MODELS.map((m) => [m.id, m.label]))}
                    onPick={(v) => setEngineField("iopaintFaceModel", v as typeof engine.iopaintFaceModel)}
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void applyRestoreFacesPlugin()}
                      className="hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-50 dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"
                    >
                      <UserCheck className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Restore Faces
                    </button>
                    <button
                      type="button"
                      onClick={() => openStage("mask")}
                      className="inline-flex h-8 items-center justify-center gap-1 rounded-full bg-[#c5a880] px-2.5 text-[11px] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                    >
                      <Paintbrush className="size-3" /> Open Inpaint
                    </button>
                  </div>
                </div>
              </Fold>

              {/* Annotators & Depth-Anything-V2 */}
              <Fold title="Annotators & Depth (ControlNet)" icon={<SlidersHorizontal className="size-4 text-[#725b38] dark:text-[#e8c98a]" />}>
                {activeChannelNames.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#c5a880]/60 bg-[#c5a880]/15 px-2.5 py-2 text-[11px]">
                    <span className="font-medium text-[#1b1c1a] dark:text-[#e8eff3]">
                      Attached Passes: {activeChannelNames.map((n) => n.toUpperCase()).join(" · ")}
                    </span>
                    <button type="button" onClick={clearConditioningChannels} className="text-[#725b38] hover:underline dark:text-[#e8c98a]">
                      Clear
                    </button>
                  </div>
                ) : null}

                <ChipRow
                  label="lllyasviel/Annotators"
                  value={engine.annotatorMode}
                  options={ANNOTATOR_MODES.map((m) => m.id)}
                  labels={Object.fromEntries(ANNOTATOR_MODES.map((m) => [m.id, m.label]))}
                  onPick={(v) => setEngineField("annotatorMode", v as typeof engine.annotatorMode)}
                />
                <SliderRow
                  label="Edge Threshold"
                  value={engine.annotatorThreshold}
                  min={10}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("annotatorThreshold", v)}
                />
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-medium text-[#4d463c] dark:text-[#cfe3f0]">Depth-Anything-V2 Lock</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("depthEnabled", !engine.depthEnabled)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.depthEnabled
                        ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]",
                    )}
                  >
                    {engine.depthEnabled ? "Enabled" : "Off"}
                  </button>
                </div>
                {engine.depthEnabled ? (
                  <SliderRow
                    label="Depth Weight"
                    value={engine.depthWeight}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={(v) => setEngineField("depthWeight", v)}
                  />
                ) : null}
              </Fold>

              {/* Multi-Ref Matrix & IP-Adapter Plus */}
              <Fold title="Multi-Ref Matrix & IP-Adapter Plus" icon={<Hexagon className="size-4 text-[#725b38] dark:text-[#e8c98a]" />}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#4d463c] dark:text-[#cfe3f0]">IP-Adapter Conditioning</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("ipAdapterEnabled", !engine.ipAdapterEnabled)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.ipAdapterEnabled
                        ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]",
                    )}
                  >
                    {engine.ipAdapterEnabled ? "Active" : "Off"}
                  </button>
                </div>

                <div className="space-y-2">
                  {MATRIX_SLOTS.map((slot) => {
                    const current = engine.refMatrix[slot.key];
                    return (
                      <div key={slot.key} className="rounded-xl border border-[#d1c5b8]/50 bg-white p-2.5 text-[11px] dark:border-[#a9bdc9]/20 dark:bg-[#050f1b]/70">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">{slot.label}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateMatrixSlot(slot.key, { url: current.url ? null : slot.sample })}
                              className={cn(
                                "h-6 rounded-full border px-2 text-[10px]",
                                current.url
                                  ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                                  : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]",
                              )}
                            >
                              {current.url ? "Sample Attached" : "Attach Sample"}
                            </button>
                            <label className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-[#d1c5b8]/60 px-2 text-[10px] text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0] dark:hover:text-[#e8eff3]">
                              <Upload className="size-2.5" /> Upload
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) void readImage(f, 1024).then((url) => updateMatrixSlot(slot.key, { url }));
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          </div>
                        </div>
                        <SliderRow
                          label="Slot Weight"
                          value={current.weight}
                          min={0}
                          max={100}
                          unit="%"
                          onChange={(v) => updateMatrixSlot(slot.key, { weight: v })}
                        />
                      </div>
                    );
                  })}
                </div>

                <ChipRow
                  label="Weight Mode"
                  value={engine.ipAdapterPreset}
                  options={IPADAPTER_PRESETS.map((p) => p.id)}
                  labels={Object.fromEntries(IPADAPTER_PRESETS.map((p) => [p.id, p.label]))}
                  onPick={(v) => setEngineField("ipAdapterPreset", v as typeof engine.ipAdapterPreset)}
                />
                <SliderRow
                  label="IP-Adapter Weight"
                  value={engine.ipAdapterWeight}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("ipAdapterWeight", v)}
                />
              </Fold>

              {/* Generative Tile Upscaler */}
              <Fold title="Generative Tile Upscaler (Real-ESRGAN)" icon={<Cpu className="size-4 text-[#725b38] dark:text-[#e8c98a]" />}>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]">Super-Resolution Scale</p>
                  <div className="mt-2 flex gap-1.5">
                    {([2, 4, 8] as UpscaleFactor[]).map((factor) => (
                      <button
                        key={factor}
                        type="button"
                        onClick={() => setEngineField("upscaleFactor", factor)}
                        className={cn(
                          "h-8 flex-1 rounded-full border text-xs font-semibold",
                          engine.upscaleFactor === factor
                            ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                            : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
                        )}
                      >
                        {factor}×
                      </button>
                    ))}
                  </div>
                </div>
                <ChipRow
                  label="ESRGAN Weights"
                  value={engine.esrganModel}
                  options={ESRGAN_MODELS.map((m) => m.id)}
                  labels={Object.fromEntries(ESRGAN_MODELS.map((m) => [m.id, m.label]))}
                  onPick={(v) => setEngineField("esrganModel", v as typeof engine.esrganModel)}
                />
                <SliderRow
                  label="Tile Denoise"
                  value={engine.esrganDenoise}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("esrganDenoise", v)}
                />
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-medium text-[#4d463c] dark:text-[#cfe3f0]">Fixture &amp; Edge Restoration</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("esrganFaceEnhance", !engine.esrganFaceEnhance)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.esrganFaceEnhance
                        ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]",
                    )}
                  >
                    {engine.esrganFaceEnhance ? "On" : "Off"}
                  </button>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyEnhance(engine.upscaleFactor)}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#c5a880] text-xs font-semibold text-[#281800] disabled:opacity-50 dark:bg-[#cfe3f0] dark:text-[#08131f]"
                >
                  <Sparkles className="size-3.5" /> Run {engine.upscaleFactor}× Tiled Upscale
                </button>
              </Fold>

              {/* Midjourney · Concept & Variations */}
              <Fold title="Cinematic Concept (Midjourney)" icon={<Cpu className="size-4 text-[#725b38] dark:text-[#e8c98a]" />}>
                <ChipRow
                  label="Output Layout"
                  value={engine.outputMode}
                  options={["single", "grid-4"]}
                  labels={{ single: "Single Plate", "grid-4": "4-Up Grid" }}
                  onPick={(v) => setEngineField("outputMode", v as typeof engine.outputMode)}
                />
                <SliderRow
                  label="Stylize (--s)"
                  value={engine.mjStylize}
                  min={0}
                  max={1000}
                  step={20}
                  unit=""
                  onChange={(v) => setEngineField("mjStylize", v)}
                />
                <SliderRow
                  label="Chaos (--c)"
                  value={engine.mjChaos}
                  min={0}
                  max={100}
                  unit=""
                  onChange={(v) => setEngineField("mjChaos", v)}
                />
                <SliderRow
                  label="Reference Weight"
                  value={engine.refWeight}
                  min={0}
                  max={100}
                  unit="%"
                  onChange={(v) => setEngineField("refWeight", v)}
                />
              </Fold>
            </div>
          ) : null}
        </div>

        {/* Pinned Atelier Bottom Export Bar */}
        <div className="shrink-0 border-t border-[#d1c5b8]/35 bg-white/65 px-4 py-3 backdrop-blur-md dark:border-[#a9bdc9]/20 dark:bg-[#121c29]/95">
          <button
            type="button"
            onClick={handleExportAction}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1c1a] px-4 text-xs font-medium tracking-wide text-[#fbf9f5] shadow-md transition hover:bg-[#312f2b] dark:bg-[#cfe3f0] dark:font-semibold dark:text-[#08131f] dark:hover:bg-[#e6f3fb]"
          >
            <Download className="size-3.5 text-[#e0c298] dark:text-[#08131f]" />
            Export Plate &amp; Layered Spec
          </button>
          <p className="mt-2 text-center font-mono text-[10px] text-[#7f766a] tabular-nums dark:text-[#a9bdc9]">
            Color Profile: ACEScg · {frame.ratio} · {frame.resolution.toUpperCase()}
          </p>
        </div>
      </div>
    </aside>
  );
}

function Fold({
  title,
  icon,
  children,
  watch,
  defaultOpen = false,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  watch?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!watch) return;
    if (seen.current === undefined || seen.current === watch) {
      seen.current = watch;
      return;
    }
    seen.current = watch;
    setOpen(true);
    ref.current?.scrollIntoView({ block: "nearest" });
  }, [watch]);
  return (
    <div ref={ref} className="rounded-2xl border border-[#d1c5b8]/45 bg-white/65 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/75">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="hover-fold flex h-11 w-full items-center gap-2 rounded-2xl px-3 text-sm font-medium text-[#1b1c1a] dark:text-[#e8eff3]"
      >
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={cn("size-4 text-[#7f766a] transition dark:text-[#a9bdc9]", open && "rotate-180")} />
      </button>
      {open ? <div className="space-y-4 border-t border-[#d1c5b8]/35 px-3 pt-3 pb-3 dark:border-[#a9bdc9]/20">{children}</div> : null}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-[#4d463c] dark:text-[#cfe3f0]">{label}</span>
        <span className="font-mono font-semibold tabular-nums text-[#725b38] dark:text-[#e8c98a]">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1.5 w-full accent-[#725b38] dark:accent-[#e8c98a]"
      />
    </label>
  );
}

function ChipRow({
  label,
  value,
  options,
  labels,
  onPick,
}: {
  label: string;
  value: string;
  options: readonly string[];
  labels?: Record<string, string>;
  onPick: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className={cn(
              "hover-chip h-8 rounded-full border px-3 text-xs font-medium whitespace-nowrap shrink-0 transition",
              value === option
                ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                : "border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0] dark:hover:text-[#e8eff3]",
            )}
            aria-pressed={value === option}
          >
            {labels?.[option] ?? option}
          </button>
        ))}
      </div>
    </div>
  );
}
