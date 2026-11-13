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
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";
import { ADVANCED_GROUPS, EXTRA_PILLS } from "@/lib/dictionary";
import {
  Camera,
  ChevronDown,
  Cpu,
  Heart,
  Hexagon,
  Lock,
  Paintbrush,
  Pencil,
  Radio,
  Scissors,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Unlock,
  Upload,
  User,
  UserCheck,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const TABS: { id: PanelTab; label: string; icon: typeof Pencil }[] = [
  { id: "design", label: "Design", icon: Pencil },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "light", label: "Light", icon: Sun },
  { id: "human", label: "Human", icon: User },
  { id: "mood", label: "Mood", icon: Heart },
  { id: "engine", label: "Engine", icon: Cpu },
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

export function PropertiesPanel() {
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const conditioningChannels = useOriel((state) => state.conditioningChannels);
  const clearConditioningChannels = useOriel((state) => state.clearConditioningChannels);
  const setPanel = useOriel((state) => state.setPanel);
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

  function updateMatrixSlot(slotKey: "massing" | "material" | "lighting", patch: { url?: string | null; weight?: number }) {
    const next = {
      ...engine.refMatrix,
      [slotKey]: { ...engine.refMatrix[slotKey], ...patch },
    };
    setEngineField("refMatrix", next);
    if (patch.url) setEngineField("ipAdapterEnabled", true);
  }

  return (
    <aside className="px-3 pb-4 lg:w-[376px] lg:shrink-0 lg:overflow-y-auto">
      <div className="rounded-[28px] border border-line bg-surface p-3.5 shadow-[0_14px_32px_rgba(70,48,16,0.06)]">
        <div className="flex items-center gap-2 px-1 py-1">
          <Hexagon className="size-4 text-[#b08a45]" />
          <h2 className="font-serif text-lg">Design Properties</h2>
          <button type="button" onClick={() => undo()} className="ml-auto grid size-8 place-items-center rounded-full text-sm text-muted" aria-label="Undo">
            ↩
          </button>
          <button type="button" onClick={() => redo()} className="grid size-8 place-items-center rounded-full text-sm text-muted" aria-label="Redo">
            ↪
          </button>
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1 rounded-2xl bg-raised p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = design.panel === tab.id || (tab.id === "design" && design.panel === "advanced");
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPanel(tab.id)}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 whitespace-nowrap rounded-xl text-[10px] font-medium transition",
                  active ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg",
                )}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 space-y-4">
          {design.panel === "design" || design.panel === "advanced" ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Elements</p>
                <button type="button" onClick={() => setTarget("whole")} className="text-xs text-[#b08a45]">
                  All Elements →
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(TILES[design.vertical] ?? []).map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => setTarget(tile.id)}
                    className={cn("hover-tile overflow-hidden rounded-2xl border bg-white text-center", design.target === tile.id ? "border-[#d4b06a]" : "border-line")}
                  >
                    <img src={tile.image} alt="" className="h-14 w-full object-cover" />
                    <span className="block px-1 py-1.5 text-[11px] text-fg">{tile.label}</span>
                  </button>
                ))}
              </div>
              <Fold title="Materials & Finishes" icon={<Hexagon className="size-4 text-[#b08a45]" />}>
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
              <Fold title="Color Palette" icon={<span className="size-4 rounded-full bg-[#d4b06a]" />}>
                <ChipRow label="Color" value={design.color} options={COLORS} onPick={(value) => setDesignField("color", value)} />
              </Fold>
              <Fold title="Look & Feel" icon={<SlidersHorizontal className="size-4 text-[#b08a45]" />} watch={design.look}>
                <div className="grid grid-cols-2 gap-2">
                  {looks.map((look) => (
                    <button
                      key={look.name}
                      type="button"
                      onClick={() => setDesignField("look", look.name)}
                      className={cn("hover-tile overflow-hidden rounded-xl border text-left", design.look === look.name ? "border-[#d4b06a]" : "border-line")}
                    >
                      <img src={look.image} alt="" className="h-16 w-full object-cover" />
                      <span className="block px-2 py-1.5 text-xs">{look.name}</span>
                    </button>
                  ))}
                </div>
                <ChipRow label="Range" value={design.range} options={RANGES} onPick={(value) => setDesignField("range", value)} />
                <ChipRow label="Strength" value={design.strength} options={STRENGTHS} onPick={(value) => setDesignField("strength", value)} />
                <ChipRow label="Detail" value={design.detail} options={DETAILS} onPick={(value) => setDesignField("detail", value)} />
              </Fold>
              <Fold title="Tags" icon={<span className="text-sm text-[#b08a45]">#</span>}>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={cn("hover-chip h-9 rounded-full border px-3 text-sm", design.tags.includes(tag) ? "gold-fill border-transparent" : "border-line text-muted")}
                      aria-pressed={design.tags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </Fold>
              <Fold title="Advanced" icon={<SlidersHorizontal className="size-4 text-[#b08a45]" />}>
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
                      className={cn("hover-chip h-9 rounded-full border px-3 text-sm", design.advanced.extras.includes(pill.id) ? "gold-fill border-transparent" : "border-line text-muted")}
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
            <ChipRow label="Camera" value={design.camera} options={CAMERAS} onPick={(value) => setDesignField("camera", value)} />
          ) : null}

          {design.panel === "light" ? (
            <>
              <ChipRow label="Light" value={design.light} options={LIGHTS} onPick={(value) => setDesignField("light", value)} />
              <ChipRow label="Time" value={design.time} options={TIMES} onPick={(value) => setDesignField("time", value)} />
              <ChipRow label="Weather" value={design.weather} options={WEATHER} onPick={(value) => setDesignField("weather", value)} />
            </>
          ) : null}

          {design.panel === "human" ? (
            <>
              <ChipRow label="People" value={design.people} options={PEOPLE} onPick={(value) => setDesignField("people", value)} />
              <ChipRow label="Activity" value={design.activity} options={ACTIVITIES} onPick={(value) => setDesignField("activity", value)} />
            </>
          ) : null}

          {design.panel === "mood" ? (
            <>
              <ChipRow label="Mood" value={design.mood} options={MOODS} onPick={(value) => setDesignField("mood", value)} />
              <ChipRow label="Color" value={design.color} options={COLORS} onPick={(value) => setDesignField("color", value)} />
            </>
          ) : null}

          {design.panel === "engine" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-faint">AI Pipeline Conditioning</span>
                <button type="button" onClick={resetEngine} className="text-[11px] font-medium text-[#b08a45] hover:underline">
                  Reset Defaults
                </button>
              </div>

              {/* Rendair AI · 1-Click Workflow Presets */}
              <div className="rounded-2xl border border-line bg-white p-3">
                <p className="text-xs font-semibold text-fg">Workflow Preset · Rendair / mnml</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {WORKFLOW_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyWorkflowPreset(preset.id)}
                      className={cn(
                        "flex flex-col items-start rounded-xl border px-2.5 py-2 text-left transition",
                        engine.workflowPreset === preset.id
                          ? "border-[#d4b06a] bg-[#fff8eb] text-fg"
                          : "border-line bg-raised/40 text-muted hover:border-[#d4b06a]/50",
                      )}
                    >
                      <span className="text-[11px] font-semibold text-fg">{preset.label}</span>
                      <span className="text-[10px] text-faint">{preset.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Veras AI · Geometry Accuracy & Seed */}
              <Fold title="Geometry & Seed (Veras AI)" icon={<Hexagon className="size-4 text-[#b08a45]" />} defaultOpen>
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
                  <span className="text-xs text-muted">Seed</span>
                  <input
                    type="number"
                    value={engine.seed}
                    onChange={(e) => setEngineField("seed", Math.max(1, Number(e.target.value) || 1))}
                    className="h-8 w-28 rounded-xl border border-line bg-raised px-2.5 font-mono text-xs tabular-nums text-fg outline-none focus:border-[#d4b06a]"
                  />
                  <button
                    type="button"
                    onClick={() => setEngineField("seedLocked", !engine.seedLocked)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px]",
                      engine.seedLocked ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
                    )}
                    aria-pressed={engine.seedLocked}
                  >
                    {engine.seedLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                    {engine.seedLocked ? "Locked" : "Auto"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEngineField("seed", Math.floor(100000 + Math.random() * 899999))}
                    className="grid size-8 place-items-center rounded-full border border-line text-muted hover:text-fg"
                    aria-label="Randomize seed"
                  >
                    <Shuffle className="size-3.5" />
                  </button>
                </div>
              </Fold>

              {/* LookX AI · Exterior & Facade */}
              <Fold title="Facade & Climate (LookX AI)" icon={<SlidersHorizontal className="size-4 text-[#b08a45]" />}>
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

              {/* PromeAI & Krea AI · Live Stream, Relight, Outpaint (#10, #12, #13) */}
              <Fold title="Live Stream, Relight & Uncrop (Krea)" icon={<Pencil className="size-4 text-[#b08a45]" />} defaultOpen>
                <div className="flex items-center justify-between rounded-xl border border-line bg-surface px-2.5 py-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Radio className="size-3.5 text-[#b08a45]" />
                    <span className="font-medium text-fg">Real-Time Draft Stream</span>
                  </div>
                  <button
                    type="button"
                    aria-pressed={engine.liveStreamEnabled}
                    onClick={() => setEngineField("liveStreamEnabled", !engine.liveStreamEnabled)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.liveStreamEnabled ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
                    )}
                  >
                    {engine.liveStreamEnabled ? "Streaming" : "Off"}
                  </button>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-faint">AI Relight &amp; Season (Geometry Lock)</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {RELIGHT_PRESETS.filter((r) => r.id !== "none").map((rp) => (
                      <button
                        key={rp.id}
                        type="button"
                        disabled={busy}
                        onClick={() => void applyRelight(rp.id as Exclude<RelightPreset, "none">)}
                        className={cn(
                          "hover-chip h-8 rounded-full border px-3 text-xs font-medium disabled:opacity-50",
                          engine.relightPreset === rp.id ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-surface text-fg",
                        )}
                      >
                        {rp.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-faint">Outpaint Canvas Uncrop</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {OUTPAINT_RATIOS.filter((o) => o.id !== "none").map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        disabled={busy}
                        onClick={() => void applyOutpaint(op.id as Exclude<OutpaintRatio, "none">)}
                        className={cn(
                          "hover-chip h-8 rounded-full border px-3 text-xs font-medium disabled:opacity-50",
                          engine.outpaintRatio === op.id ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-surface text-fg",
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
              <Fold title="IOPaint Suite & Plugins" icon={<Paintbrush className="size-4 text-[#b08a45]" />}>
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
                  <span className="text-xs font-medium uppercase tracking-wide text-faint">Inpaint / Erase Model</span>
                  <select
                    aria-label="Inpaint / Erase Model"
                    value={engine.iopaintModel}
                    onChange={(e) => setEngineField("iopaintModel", e.target.value as IopaintModel)}
                    className="mt-1.5 h-9 w-full rounded-xl border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
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
                  <span className="font-medium text-muted">Invert Inpaint Mask</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("iopaintInvertMask", !engine.iopaintInvertMask)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.iopaintInvertMask ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
                    )}
                  >
                    {engine.iopaintInvertMask ? "Inverted" : "Normal"}
                  </button>
                </div>

                <div className="space-y-2 border-t border-line/60 pt-3">
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
                      className="hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-line bg-surface px-2.5 text-[11px] font-medium text-fg disabled:opacity-50"
                    >
                      <Scissors className="size-3 text-[#b08a45]" /> Subject Cutout
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void applyRemoveBgPlugin("mask")}
                      className="hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-line bg-surface px-2.5 text-[11px] font-medium text-fg disabled:opacity-50"
                    >
                      <Scissors className="size-3 text-[#b08a45]" /> Sky → Mask
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t border-line/60 pt-3">
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
                      className="hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-line bg-surface px-2.5 text-[11px] font-medium text-fg disabled:opacity-50"
                    >
                      <UserCheck className="size-3 text-[#b08a45]" /> Restore Faces
                    </button>
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("oriel-view", { detail: "mask" }))}
                      className="gold-fill inline-flex h-8 items-center justify-center gap-1 rounded-full px-2.5 text-[11px] font-semibold text-[#2a1c0c]"
                    >
                      <Paintbrush className="size-3" /> Open Inpaint
                    </button>
                  </div>
                </div>
              </Fold>

              {/* Annotators & Depth-Anything-V2 (#6 WebGL Passes Badge) */}
              <Fold title="Annotators & Depth (ControlNet)" icon={<SlidersHorizontal className="size-4 text-[#b08a45]" />}>
                {activeChannelNames.length > 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#d4b06a]/50 bg-[#fff8eb] px-2.5 py-2 text-[11px]">
                    <span className="font-medium text-fg">
                      Attached Passes: {activeChannelNames.map((n) => n.toUpperCase()).join(" · ")}
                    </span>
                    <button type="button" onClick={clearConditioningChannels} className="text-[#b08a45] hover:underline">
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
                  <span className="font-medium text-muted">Depth-Anything-V2 Lock</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("depthEnabled", !engine.depthEnabled)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.depthEnabled ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
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

              {/* cubiq/ComfyUI_IPAdapter_plus & 3-Slot Matrix (#9) */}
              <Fold title="Multi-Ref Matrix & IP-Adapter Plus" icon={<Hexagon className="size-4 text-[#b08a45]" />}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted">IP-Adapter Conditioning</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("ipAdapterEnabled", !engine.ipAdapterEnabled)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.ipAdapterEnabled ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
                    )}
                  >
                    {engine.ipAdapterEnabled ? "Active" : "Off"}
                  </button>
                </div>

                {/* 3 Distinct Style/Layout/Lighting Slots */}
                <div className="space-y-2">
                  {MATRIX_SLOTS.map((slot) => {
                    const current = engine.refMatrix[slot.key];
                    return (
                      <div key={slot.key} className="rounded-xl border border-line bg-surface p-2.5 text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-fg">{slot.label}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateMatrixSlot(slot.key, { url: current.url ? null : slot.sample })}
                              className={cn(
                                "h-6 rounded-full border px-2 text-[10px]",
                                current.url ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
                              )}
                            >
                              {current.url ? "Sample Attached" : "Attach Sample"}
                            </button>
                            <label className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-line px-2 text-[10px] text-muted hover:text-fg">
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

              {/* xinntao/Real-ESRGAN & Generative Tiled Upscaler (#14) */}
              <Fold title="Generative Tile Upscaler (Real-ESRGAN)" icon={<Cpu className="size-4 text-[#b08a45]" />}>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-faint">Super-Resolution Scale</p>
                  <div className="mt-2 flex gap-1.5">
                    {([2, 4, 8] as UpscaleFactor[]).map((factor) => (
                      <button
                        key={factor}
                        type="button"
                        onClick={() => setEngineField("upscaleFactor", factor)}
                        className={cn(
                          "h-8 flex-1 rounded-full border text-xs font-semibold",
                          engine.upscaleFactor === factor ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-surface text-muted",
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
                  <span className="font-medium text-muted">Fixture &amp; Edge Restoration</span>
                  <button
                    type="button"
                    onClick={() => setEngineField("esrganFaceEnhance", !engine.esrganFaceEnhance)}
                    className={cn(
                      "h-7 rounded-full border px-3 text-[11px] font-medium",
                      engine.esrganFaceEnhance ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
                    )}
                  >
                    {engine.esrganFaceEnhance ? "On" : "Off"}
                  </button>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void applyEnhance(engine.upscaleFactor)}
                  className="gold-fill inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-xs font-semibold text-[#2a1c0c] disabled:opacity-50"
                >
                  <Sparkles className="size-3.5" /> Run {engine.upscaleFactor}× Tiled Upscale
                </button>
              </Fold>

              {/* Midjourney · Concept & Variations */}
              <Fold title="Cinematic Concept (Midjourney)" icon={<Cpu className="size-4 text-[#b08a45]" />}>
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
    <div ref={ref} className="rounded-2xl border border-line bg-raised/35">
      <button type="button" onClick={() => setOpen((value) => !value)} className="hover-fold flex h-11 w-full items-center gap-2 rounded-2xl px-3 text-sm font-medium">
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown className={cn("size-4 text-faint transition", open && "rotate-180")} />
      </button>
      {open ? <div className="space-y-4 border-t border-line/60 px-3 pt-3 pb-3">{children}</div> : null}
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
        <span className="font-medium text-muted">{label}</span>
        <span className="font-mono tabular-nums text-fg">
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
        className="mt-1.5 h-1.5 w-full accent-[#b08a45]"
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
      <p className="text-xs font-medium uppercase tracking-wide text-faint">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPick(option)}
            className={cn(
              "hover-chip h-9 rounded-full border px-3 text-xs font-medium whitespace-nowrap shrink-0",
              value === option ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-muted",
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
