import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  Check,
  Copy,
  Download,
  FileSpreadsheet,
  GripVertical,
  MoveRight,
  Palette,
  RefreshCw,
  Sliders,
  Sparkles,
  Sun,
  Trash2,
  Wand2,
} from "lucide-react";
import { useMemo, useState, type DragEvent } from "react";
import { toast } from "sonner";
import {
  ARCHITECTURAL_STYLES,
  BUILDER_PRESETS,
  CAMERA_PRESETS,
  LIGHTING_CONDITIONS,
  MOOD_SETTINGS,
  synthesizeVisionDocument,
  type BlockCategory,
  type BuilderBlock,
} from "@/lib/builder-data";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/builder")({
  component: BriefBuilderPage,
});

export function BriefBuilderPage() {
  const navigate = useNavigate();
  const setIdea = useOriel((state) => state.setIdea);
  const setDesignField = useOriel((state) => state.setDesignField);
  const saveProject = useOriel((state) => state.saveProject);

  // Selected Slots
  const [selectedStyle, setSelectedStyle] = useState<BuilderBlock | null>(ARCHITECTURAL_STYLES[0]);
  const [selectedLighting, setSelectedLighting] = useState<BuilderBlock | null>(LIGHTING_CONDITIONS[0]);
  const [selectedMood, setSelectedMood] = useState<BuilderBlock | null>(MOOD_SETTINGS[0]);
  const [selectedCamera, setSelectedCamera] = useState<BuilderBlock | null>(CAMERA_PRESETS[0]);
  const [customNotes, setCustomNotes] = useState("");

  // UI States
  const [activeTab, setActiveTab] = useState<BlockCategory>("style");
  const [previewTab, setPreviewTab] = useState<"spec" | "prompt" | "materials">("spec");
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Synthesized Vision Document
  const visionDoc = useMemo(
    () => synthesizeVisionDocument(selectedStyle, selectedLighting, selectedMood, selectedCamera, customNotes),
    [selectedStyle, selectedLighting, selectedMood, selectedCamera, customNotes],
  );

  // Drag and Drop Handlers
  function handleDragStart(event: DragEvent<HTMLDivElement>, block: BuilderBlock) {
    event.dataTransfer.setData("application/json", JSON.stringify(block));
    event.dataTransfer.effectAllowed = "copyMove";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>, slotId: string) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    if (dragOverSlot !== slotId) setDragOverSlot(slotId);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOverSlot(null);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetSlot: BlockCategory) {
    event.preventDefault();
    setDragOverSlot(null);
    try {
      const dataStr = event.dataTransfer.getData("application/json");
      if (!dataStr) return;
      const block = JSON.parse(dataStr) as BuilderBlock;

      if (targetSlot === "style" && block.category === "style") {
        setSelectedStyle(block);
        toast.success(`Applied Style: ${block.name}`);
      } else if (targetSlot === "lighting" && block.category === "lighting") {
        setSelectedLighting(block);
        toast.success(`Applied Lighting: ${block.name}`);
      } else if (targetSlot === "mood" && block.category === "mood") {
        setSelectedMood(block);
        toast.success(`Applied Mood: ${block.name}`);
      } else if (targetSlot === "camera" && block.category === "camera") {
        setSelectedCamera(block);
        toast.success(`Applied Camera: ${block.name}`);
      } else {
        toast.message(`This slot accepts ${targetSlot} blocks. You dragged a ${block.category} block.`);
      }
    } catch {
      toast.error("Could not process dragged item.");
    }
  }

  // Quick-click assignment
  function handleAssignBlock(block: BuilderBlock) {
    if (block.category === "style") {
      setSelectedStyle(block);
      toast.success(`Selected Style: ${block.name}`);
    } else if (block.category === "lighting") {
      setSelectedLighting(block);
      toast.success(`Selected Lighting: ${block.name}`);
    } else if (block.category === "mood") {
      setSelectedMood(block);
      toast.success(`Selected Mood: ${block.name}`);
    } else if (block.category === "camera") {
      setSelectedCamera(block);
      toast.success(`Selected Camera: ${block.name}`);
    }
  }

  // Load Preset
  function handleLoadPreset(presetId: string) {
    const preset = BUILDER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const style = ARCHITECTURAL_STYLES.find((s) => s.id === preset.styleId) ?? null;
    const light = LIGHTING_CONDITIONS.find((l) => l.id === preset.lightingId) ?? null;
    const mood = MOOD_SETTINGS.find((m) => m.id === preset.moodId) ?? null;
    const camera = CAMERA_PRESETS.find((c) => c.id === preset.cameraId) ?? null;

    setSelectedStyle(style);
    setSelectedLighting(light);
    setSelectedMood(mood);
    setSelectedCamera(camera);
    setCustomNotes(preset.notes);
    toast.success(`Loaded Preset: ${preset.name}`);
  }

  // Clear Slots
  function handleResetAll() {
    setSelectedStyle(null);
    setSelectedLighting(null);
    setSelectedMood(null);
    setSelectedCamera(null);
    setCustomNotes("");
    toast.message("Cleared all brief slots.");
  }

  // Export & Copy
  async function handleCopyMarkdown() {
    try {
      await navigator.clipboard.writeText(visionDoc.markdownDoc);
      setCopied(true);
      toast.success("Vision document copied as Markdown.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard copy failed. Please select and copy manually.");
    }
  }

  function handleDownloadMarkdown() {
    const blob = new Blob([visionDoc.markdownDoc], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `architectural-vision-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded vision document markdown.");
  }

  // Send to Studio
  function handleSendToStudio() {
    // Populate studio idea prompt
    setIdea(visionDoc.synthesizedPrompt);
    if (selectedStyle) {
      setDesignField("look", selectedStyle.name);
    }
    toast.success("Sent vision specification to Studio Canvas!");
    void navigate({ to: "/" });
  }

  // Save to Projects
  function handleSaveToProject() {
    const name = visionDoc.title || "Vision Brief Project";
    saveProject(name);
    setIdea(visionDoc.synthesizedPrompt);
    toast.success(`Saved "${name}" to Projects list.`);
  }

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-bg text-fg">
      {/* Top Banner & Header */}
      <div className="shrink-0 border-b border-line bg-surface/80 px-4 py-4 backdrop-blur-md md:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tracking-[0.2em] text-[#b08a45] uppercase">
                Interactive Visual System
              </span>
              <span className="text-faint" aria-hidden="true">·</span>
              <span className="text-xs text-muted">Architectural Vision Documentation</span>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-fg md:text-4xl">
              Brief Builder
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-muted md:text-sm">
              Drag and drop curated architectural style, lighting conditions, and mood settings to compose an airtight vision specification for client approval and AI rendering passes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-raised px-4 text-xs font-medium text-muted transition hover:border-[#d4b06a] hover:text-fg"
            >
              <RefreshCw className="size-3.5" />
              Reset Slots
            </button>
            <button
              type="button"
              onClick={handleSendToStudio}
              className="gold-fill inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold"
            >
              <Sparkles className="size-3.5" />
              Send to Studio Canvas
              <MoveRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="mx-auto mt-4 flex max-w-7xl items-center gap-2 overflow-x-auto pt-1 pb-1">
          <span className="shrink-0 text-xs font-medium text-faint">Fast Presets:</span>
          {BUILDER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset.id)}
              className="hover-chip shrink-0 rounded-full border border-line bg-raised px-3 py-1.5 text-xs text-muted"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Grid */}
      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-12">
        {/* Left Column: Module Palette */}
        <section className="flex flex-col rounded-3xl border border-line bg-surface p-4 shadow-sm lg:col-span-5">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-[#b08a45]" />
              <h2 className="font-serif text-lg font-semibold">Architectural Palette</h2>
            </div>
            <span className="text-[11px] text-faint">Drag cards into slots</span>
          </div>

          {/* Palette Category Selector */}
          <div className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-raised p-1">
            {(
              [
                ["style", "Style", Wand2],
                ["lighting", "Lighting", Sun],
                ["mood", "Mood", Sparkles],
                ["camera", "Camera", Camera],
              ] as const
            ).map(([catId, label, Icon]) => (
              <button
                key={catId}
                type="button"
                onClick={() => setActiveTab(catId)}
                className={cn(
                  "flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-medium transition",
                  activeTab === catId ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Category Items List */}
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            {activeTab === "style" &&
              ARCHITECTURAL_STYLES.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedStyle?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}

            {activeTab === "lighting" &&
              LIGHTING_CONDITIONS.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedLighting?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}

            {activeTab === "mood" &&
              MOOD_SETTINGS.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedMood?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}

            {activeTab === "camera" &&
              CAMERA_PRESETS.map((block) => (
                <PaletteCard
                  key={block.id}
                  block={block}
                  isSelected={selectedCamera?.id === block.id}
                  onSelect={() => handleAssignBlock(block)}
                  onDragStart={(e) => handleDragStart(e, block)}
                />
              ))}
          </div>
        </section>

        {/* Center / Right Column: Dropzones & Vision Documentation */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Dropzones: Blueprint Assembly */}
          <section className="rounded-3xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-[#b08a45]" />
                <h2 className="font-serif text-lg font-semibold">Vision Blueprint Slots</h2>
              </div>
              <span className="text-xs text-muted">Drop or click to fill</span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Slot 1: Architectural Style */}
              <DropSlot
                category="style"
                title="1. Architectural Style"
                icon={<Wand2 className="size-4 text-[#b08a45]" />}
                block={selectedStyle}
                isDragOver={dragOverSlot === "style"}
                onDragOver={(e) => handleDragOver(e, "style")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "style")}
                onClear={() => setSelectedStyle(null)}
              />

              {/* Slot 2: Lighting Condition */}
              <DropSlot
                category="lighting"
                title="2. Lighting Condition"
                icon={<Sun className="size-4 text-[#b08a45]" />}
                block={selectedLighting}
                isDragOver={dragOverSlot === "lighting"}
                onDragOver={(e) => handleDragOver(e, "lighting")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "lighting")}
                onClear={() => setSelectedLighting(null)}
              />

              {/* Slot 3: Mood & Atmosphere */}
              <DropSlot
                category="mood"
                title="3. Mood & Atmosphere"
                icon={<Sparkles className="size-4 text-[#b08a45]" />}
                block={selectedMood}
                isDragOver={dragOverSlot === "mood"}
                onDragOver={(e) => handleDragOver(e, "mood")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "mood")}
                onClear={() => setSelectedMood(null)}
              />

              {/* Slot 4: Camera & Angle */}
              <DropSlot
                category="camera"
                title="4. Camera / Composition"
                icon={<Camera className="size-4 text-[#b08a45]" />}
                block={selectedCamera}
                isDragOver={dragOverSlot === "camera"}
                onDragOver={(e) => handleDragOver(e, "camera")}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, "camera")}
                onClear={() => setSelectedCamera(null)}
              />
            </div>

            {/* Custom Directives Input */}
            <div className="mt-4">
              <label htmlFor="custom-notes" className="block text-xs font-medium text-faint">
                Custom Studio Directives & Client Constraints
              </label>
              <textarea
                id="custom-notes"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Ensure reflecting pool has no rippling; specify 28mm lens with vertical tilt-shift correction; preserve existing mature pine trees."
                rows={2}
                className="mt-1.5 w-full resize-none rounded-2xl border border-line bg-raised px-3.5 py-2.5 text-xs leading-relaxed text-fg outline-none transition focus:border-[#d4b06a]"
              />
            </div>
          </section>

          {/* Live Compiled Vision Documentation */}
          <section className="flex flex-1 flex-col rounded-3xl border border-line bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-4 text-[#b08a45]" />
                <h2 className="font-serif text-lg font-semibold">Live Vision Documentation</h2>
              </div>

              {/* Preview Tabs */}
              <div className="flex items-center gap-1 rounded-full bg-raised p-1">
                {(
                  [
                    ["spec", "Specification"],
                    ["prompt", "AI Prompt"],
                    ["materials", "Materials"],
                  ] as const
                ).map(([tabId, label]) => (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => setPreviewTab(tabId)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition",
                      previewTab === tabId ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                  title="Copy as Markdown"
                >
                  {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                  title="Download .md file"
                >
                  <Download className="size-3" />
                  Export .md
                </button>
                <button
                  type="button"
                  onClick={handleSaveToProject}
                  className="hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted"
                >
                  Save Project
                </button>
              </div>
            </div>

            {/* Document Content Views */}
            <div className="mt-4 min-h-64 flex-1 overflow-y-auto pr-1">
              {previewTab === "spec" && (
                <article className="space-y-4 rounded-2xl border border-line/60 bg-raised/50 p-4 text-xs leading-relaxed text-fg">
                  <div>
                    <h3 className="font-serif text-base font-bold text-fg">{visionDoc.title}</h3>
                    <p className="mt-0.5 text-xs text-[#b08a45]">{visionDoc.subtitle}</p>
                    <p className="mt-1 text-[11px] text-faint">Compiled on {visionDoc.date} · Production-Ready</p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">1. Architectural Style & Massing</p>
                    <p className="mt-1 text-muted">
                      {selectedStyle ? selectedStyle.description : "No architectural style selected yet."}
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">2. Lighting Condition & Luminance</p>
                    <p className="mt-1 text-muted">
                      {selectedLighting ? selectedLighting.description : "No lighting condition selected yet."}
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">3. Mood & Spatial Psychology</p>
                    <p className="mt-1 text-muted">
                      {selectedMood ? selectedMood.description : "No mood setting selected yet."}
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-3">
                    <p className="font-semibold text-fg">4. Camera Strategy</p>
                    <p className="mt-1 text-muted">
                      {selectedCamera ? selectedCamera.description : "Default eye-level 28mm architectural lens."}
                    </p>
                  </div>

                  {customNotes ? (
                    <div className="border-t border-line/60 pt-3">
                      <p className="font-semibold text-fg">5. Studio Directives</p>
                      <p className="mt-1 text-muted">{customNotes}</p>
                    </div>
                  ) : null}
                </article>
              )}

              {previewTab === "prompt" && (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-line bg-raised p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-fg">Synthesized Diffusion Prompt</span>
                      <span className="text-[10px] text-faint">Optimized for GPT, Midjourney, FLUX & Gemini</span>
                    </div>
                    <p className="mt-2 text-xs font-mono leading-relaxed text-fg/90 select-all">
                      {visionDoc.synthesizedPrompt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between px-1 text-xs text-muted">
                    <span>Ready to paste directly into AI render pipelines or generate in Studio.</span>
                    <button
                      type="button"
                      onClick={handleSendToStudio}
                      className="font-semibold text-[#b08a45] hover:underline"
                    >
                      Open in Studio →
                    </button>
                  </div>
                </div>
              )}

              {previewTab === "materials" && (
                <div className="space-y-4">
                  {selectedStyle?.materials ? (
                    <div className="rounded-2xl border border-line bg-raised p-4">
                      <p className="text-xs font-semibold text-fg">Primary Material Palette</p>
                      <ul className="mt-2 grid grid-cols-2 gap-2">
                        {selectedStyle.materials.map((mat) => (
                          <li key={mat} className="flex items-center gap-2 rounded-xl border border-line bg-surface p-2 text-xs">
                            <span className="size-2.5 rounded-full bg-[#d4b06a]" />
                            <span>{mat}</span>
                          </li>
                        ))}
                      </ul>
                      {selectedStyle.swatches ? (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[11px] text-faint">Tonal Swatches:</span>
                          <div className="flex gap-1.5">
                            {selectedStyle.swatches.map((color) => (
                              <span
                                key={color}
                                className="size-5 rounded-md border border-line/50 shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-muted">Select an Architectural Style to view its material palette.</p>
                  )}

                  {selectedLighting?.swatches ? (
                    <div className="rounded-2xl border border-line bg-raised p-4">
                      <p className="text-xs font-semibold text-fg">Lighting Temperature & Illuminance Spectrum</p>
                      <p className="mt-1 text-xs text-muted">{selectedLighting.tagline}</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          {selectedLighting.swatches.map((color) => (
                            <span
                              key={color}
                              className="size-5 rounded-md border border-line/50 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// Subcomponent: Palette Draggable Card
function PaletteCard({
  block,
  isSelected,
  onSelect,
  onDragStart,
}: {
  block: BuilderBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        "group relative cursor-grab rounded-2xl border p-3 transition active:cursor-grabbing",
        isSelected
          ? "border-[#d4b06a] bg-[#fffaf0] shadow-sm"
          : "border-line bg-raised/40 hover:border-[#d4b06a]/60 hover:bg-raised",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="grid size-6 shrink-0 place-items-center text-faint transition group-hover:text-fg">
            <GripVertical className="size-3.5" />
          </div>
          <div>
            <h4 className="font-medium text-xs text-fg">{block.name}</h4>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{block.tagline}</p>
          </div>
        </div>

        {isSelected ? (
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#d4b06a] text-[10px] text-ink">
            <Check className="size-3" />
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="shrink-0 rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] text-muted hover:border-[#d4b06a] hover:text-fg"
          >
            Select
          </button>
        )}
      </div>

      {block.swatches ? (
        <div className="mt-2.5 flex items-center gap-1.5 pl-8">
          {block.swatches.map((color) => (
            <span
              key={color}
              className="size-3 rounded-full border border-line/40 shadow-xs"
              style={{ backgroundColor: color }}
            />
          ))}
          {block.materials ? (
            <span className="truncate text-[10px] text-faint">
              · {block.materials.slice(0, 2).join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// Subcomponent: Dropzone Slot
function DropSlot({
  category,
  title,
  icon,
  block,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
}: {
  category: BlockCategory;
  title: string;
  icon: React.ReactNode;
  block: BuilderBlock | null;
  isDragOver: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onClear: () => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col justify-between rounded-2xl border p-3.5 transition",
        isDragOver
          ? "border-2 border-dashed border-[#d4b06a] bg-[#fff8eb] shadow-md"
          : block
            ? "border-line bg-surface shadow-xs"
            : "border-dashed border-line bg-raised/50",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-fg">{title}</span>
        </div>
        {block ? (
          <button
            type="button"
            onClick={onClear}
            className="grid size-6 place-items-center rounded-full text-faint transition hover:bg-raised hover:text-red-600"
            title="Remove block"
          >
            <Trash2 className="size-3" />
          </button>
        ) : null}
      </div>

      <div className="mt-3 min-h-16">
        {block ? (
          <div>
            <p className="font-semibold text-xs text-fg">{block.name}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">{block.description}</p>
            {block.swatches ? (
              <div className="mt-2 flex gap-1">
                {block.swatches.map((color) => (
                  <span
                    key={color}
                    className="size-3.5 rounded border border-line/40 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex h-16 flex-col items-center justify-center text-center">
            <p className="text-[11px] text-faint">Drag a {category} card here</p>
            <p className="text-[10px] text-faint/70">or click &quot;Select&quot; in the palette</p>
          </div>
        )}
      </div>
    </div>
  );
}
