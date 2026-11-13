import { useRef, useState } from "react";
import { ImagePlus, Layers, Palette, Plus, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { MID_LAYER_PRESETS, getMidLayerPresetById } from "@/lib/archviz-dictionary";
import { buildHouseStyleProfile, type HouseStyleProfile } from "@/lib/archviz-suite";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

type MidLayerBarProps = {
  compact?: boolean;
  onApplied?: (presetId: string | null) => void;
};

/**
 * Simple 1-click pill buttons that apply architectural Mid-Layer Presets
 * plus Firm Signature Style Vault ("House Style" DNA profiles).
 */
export function MidLayerBar({ compact = false, onApplied }: MidLayerBarProps) {
  const midLayerPreset = useOriel((state) => state.midLayerPreset);
  const dictionaryBlocks = useOriel((state) => state.dictionaryBlocks);
  const applyMidLayerPreset = useOriel((state) => state.applyMidLayerPreset);
  const engine = useOriel((state) => state.engine);
  const setEngineField = useOriel((state) => state.setEngineField);
  const houseStyles = useOriel((state) => state.houseStyles);
  const addHouseStyle = useOriel((state) => state.addHouseStyle);

  const [trainerOpen, setTrainerOpen] = useState(false);
  const [styleName, setStyleName] = useState("");
  const [contrastBias, setContrastBias] = useState<HouseStyleProfile["contrastBias"]>("Editorial High");
  const [entourageNote, setEntourageNote] = useState("Soft-motion visitors & native architectural planting");
  const [sampleImages, setSampleImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeObj = midLayerPreset ? getMidLayerPresetById(midLayerPreset) : null;
  const activeHouseStyle = houseStyles.find((h) => h.id === engine.houseStyleId) ?? null;

  function handleSelect(id: string, title: string) {
    const next = midLayerPreset === id ? null : id;
    applyMidLayerPreset(id);
    onApplied?.(next);
    toast.message(next ? `Mid-Layer active: ${title}` : "Mid-Layer preset cleared");
  }

  async function handleSampleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const loaded: string[] = [];
    for (const file of Array.from(files).slice(0, 8)) {
      try {
        loaded.push(await readImage(file, 768));
      } catch {
        // Ignore oversized/unsupported sample file
      }
    }
    if (loaded.length > 0) {
      setSampleImages((prev) => [...prev, ...loaded].slice(0, 12));
    }
  }

  function handleSaveHouseStyle(e: React.FormEvent) {
    e.preventDefault();
    const profile = buildHouseStyleProfile({
      name: styleName || "Studio House DNA",
      sampleImages: sampleImages.length > 0 ? sampleImages : ["/viz/t01-public-library.jpg"],
      contrastBias,
      entourageStyle: entourageNote,
    });
    addHouseStyle(profile);
    setTrainerOpen(false);
    setStyleName("");
    setSampleImages([]);
    toast.success(`Trained & attached House Style: ${profile.name}`);
  }

  return (
    <div
      data-testid="mid-layer-preset-bar"
      className={cn(
        "rounded-2xl border border-line bg-surface px-3.5 py-2.5",
        compact ? "border-white/15 bg-[#14110f] text-[#f6efe4]" : "",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Layers className="size-3.5 text-[#b08a45]" />
          <span className={cn("text-[11px] font-semibold uppercase tracking-wide", compact ? "text-[#e7c27a]" : "text-fg")}>
            Mid-Layer Preset
          </span>
          <span className="hidden text-faint sm:inline" aria-hidden="true">·</span>
          {activeObj ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9a6f23] tabular-nums">
              <Sparkles className="size-3 text-[#b08a45]" />
              {activeObj.title} · {dictionaryBlocks.length} blocks
            </span>
          ) : (
            <span className={cn("text-[11px]", compact ? "text-[#cbbba6]" : "text-faint")}>
              1-click architecture &amp; conditioning pass
            </span>
          )}
        </div>
        {activeObj ? (
          <button
            type="button"
            onClick={() => {
              applyMidLayerPreset(null);
              onApplied?.(null);
              toast.message("Mid-Layer preset cleared");
            }}
            className="shrink-0 whitespace-nowrap text-[11px] font-medium text-[#b08a45] hover:underline"
          >
            Reset layer
          </button>
        ) : null}
      </div>

      <div className="no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
        {MID_LAYER_PRESETS.map((preset) => {
          const active = midLayerPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={active}
              title={`${preset.title} — ${preset.description}`}
              onClick={() => handleSelect(preset.id, preset.title)}
              className={cn(
                "h-7 shrink-0 whitespace-nowrap rounded-full border px-3 text-[11px] font-medium transition",
                active
                  ? "gold-fill border-transparent text-[#2a1c0c] shadow-xs"
                  : compact
                    ? "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#e7c27a]"
                    : "hover-chip border-line bg-raised/70 text-muted hover:text-fg",
              )}
            >
              {preset.pillLabel}
            </button>
          );
        })}
      </div>

      {/* #8 Firm Signature Style Vault ("House Style" DNA) */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-2">
        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#b08a45]">
          <Palette className="size-3" /> House Style Vault
        </span>
        {houseStyles.map((hs) => {
          const selected = activeHouseStyle?.id === hs.id;
          return (
            <button
              key={hs.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                const next = selected ? null : hs.id;
                setEngineField("houseStyleId", next);
                toast.message(next ? `House Style active: ${hs.name}` : "House Style detached");
              }}
              className={cn(
                "inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[10px] font-medium transition",
                selected
                  ? "gold-fill border-transparent text-[#2a1c0c]"
                  : compact
                    ? "border-white/15 bg-white/5 text-[#dfd5c6]"
                    : "border-line bg-raised/60 text-muted hover:text-fg",
              )}
            >
              <span className="flex -space-x-1">
                {hs.palette.slice(0, 3).map((hex) => (
                  <span key={hex} className="size-2.5 rounded-full border border-white/50" style={{ backgroundColor: hex }} />
                ))}
              </span>
              {hs.name}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setTrainerOpen((v) => !v)}
          className="inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-[#b08a45]/60 px-2.5 text-[10px] font-medium text-[#b08a45] hover:bg-[#f6e0b0]/25"
        >
          <Plus className="size-3" /> Train House Style
        </button>
      </div>

      {trainerOpen ? (
        <form onSubmit={handleSaveHouseStyle} className="mt-2.5 space-y-2.5 rounded-xl border border-line bg-raised p-3 text-xs text-fg">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Train Firm Signature Style (House Style DNA)</span>
            <button type="button" onClick={() => setTrainerOpen(false)} className="text-muted hover:text-fg">
              <X className="size-3.5" />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              placeholder="Firm Style Name (e.g. Atelier Limestone)"
              className="h-8 rounded-lg border border-line bg-surface px-2.5 text-xs outline-none focus:border-[#d4b06a]"
            />
            <select
              value={contrastBias}
              onChange={(e) => setContrastBias(e.target.value as HouseStyleProfile["contrastBias"])}
              className="h-8 rounded-lg border border-line bg-surface px-2 text-xs outline-none focus:border-[#d4b06a]"
            >
              <option value="Editorial High">Editorial High Contrast</option>
              <option value="Monograph Neutral">Monograph Neutral</option>
              <option value="Soft Atmospheric">Soft Atmospheric</option>
            </select>
          </div>
          <input
            type="text"
            value={entourageNote}
            onChange={(e) => setEntourageNote(e.target.value)}
            placeholder="Entourage & lens grain notes"
            className="h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs outline-none focus:border-[#d4b06a]"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] font-medium hover:border-[#d4b06a]"
              >
                <ImagePlus className="size-3.5 text-[#b08a45]" /> Upload Portfolio Renders ({sampleImages.length}/12)
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  void handleSampleUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
            <button
              type="submit"
              className="gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[11px] font-semibold text-[#2a1c0c]"
            >
              <Sparkles className="size-3" /> Save &amp; Attach DNA
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
