import {
  Building2,
  Camera,
  Check,
  Compass,
  Download,
  FileCode2,
  Film,
  Layers,
  Loader2,
  MapPin,
  Palette,
  Pause,
  Play,
  Plus,
  QrCode,
  Scissors,
  Sparkles,
  Sun,
  Trash2,
  Upload,
  Video,
  Wand2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { PanoramaViewer } from "@/components/panorama-viewer";
import { PRD_LIGHT_PALETTE, PRD_MATERIAL_PALETTE } from "@/lib/presets-catalog";
import type { TourHotspotType, TourUnitRecord } from "@/lib/prd-studio-data";
import { appendSuggestionToIdea } from "@/lib/archviz-dictionary";
import { generatePlate } from "@/lib/generate";
import { resolveRuntimeModelOverride } from "@/lib/nano-banana-client";
import { synthesizeFallbackComposite } from "@/lib/fallback-render";
import {
  buildStandalone360TourHtml,
  renderKumTimelineToWebm,
  triggerBlobDownload,
} from "@/lib/studio-exports";
import { formatPaiseShort } from "@/lib/budget-guard";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* 1. MAS 2D STUDIO BAR (Edit vs Compose + CC0 Material & Light Palettes)     */
/* -------------------------------------------------------------------------- */

export function Mas2dStudioBar({
  onOpenStage,
}: {
  onOpenStage: (stage: "source" | "3d" | "sketch" | "cv" | "sam2" | "mask" | "result" | "grid" | "compare" | "360" | "nodes") => void;
}) {
  const design = useOriel((s) => s.design);
  const idea = useOriel((s) => s.idea);
  const setIdea = useOriel((s) => s.setIdea);
  const setDesignField = useOriel((s) => s.setDesignField);

  const [mode, setMode] = useState<"edit" | "compose">("edit");
  const [drawer, setDrawer] = useState<"none" | "materials" | "lights">("none");

  const filteredMaterials = useMemo(
    () => PRD_MATERIAL_PALETTE.filter((m) => m.space === design.vertical || drawer === "materials").slice(0, 12),
    [design.vertical, drawer],
  );
  const filteredLights = useMemo(
    () => PRD_LIGHT_PALETTE.filter((l) => l.space === design.vertical || l.space === "exterior"),
    [design.vertical],
  );

  return (
    <div
      data-testid="mas2d-studio-bar"
      className="arctic-glass flex flex-col gap-2 rounded-2xl p-2.5 text-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#c5a880]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#725b38] dark:bg-[#202b38] dark:text-[#e8c98a]">
            MAS 2D Studio
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-full bg-[#efeeea]/85 p-0.5 dark:bg-[#121c29]">
            <button
              type="button"
              onClick={() => {
                setMode("edit");
                onOpenStage("mask");
              }}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition",
                mode === "edit"
                  ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "text-[#4d463c] dark:text-[#a9bdc9]",
              )}
            >
              Edit Mode
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("compose");
                onOpenStage("sketch");
              }}
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition",
                mode === "compose"
                  ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "text-[#4d463c] dark:text-[#a9bdc9]",
              )}
            >
              Compose Board
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            data-testid="mas2d-materials-btn"
            onClick={() => setDrawer(drawer === "materials" ? "none" : "materials")}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium transition",
              drawer === "materials"
                ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                : "border-[#d1c5b8]/55 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
            )}
          >
            <Palette className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Material Palette (CC0)
          </button>
          <button
            type="button"
            data-testid="mas2d-lights-btn"
            onClick={() => setDrawer(drawer === "lights" ? "none" : "lights")}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium transition",
              drawer === "lights"
                ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                : "border-[#d1c5b8]/55 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
            )}
          >
            <Sun className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Light Palette (IES)
          </button>
          <button
            type="button"
            onClick={() => onOpenStage("sam2")}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/75 px-2.5 text-[10px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"
          >
            <Scissors className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Cutout & Pen
          </button>
        </div>
      </div>

      {drawer === "materials" ? (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {filteredMaterials.slice(0, 8).map((mat) => (
            <button
              key={mat.id}
              type="button"
              onClick={() => {
                setIdea(appendSuggestionToIdea(idea, mat.fragment));
                toast.success(`Injected ${mat.name} (${mat.source} ${mat.licence})`);
              }}
              className="flex items-center gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-2 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]"
            >
              <span
                className="size-6 shrink-0 rounded-lg border border-black/15 shadow-xs"
                style={{ backgroundColor: mat.hex }}
              />
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">{mat.name}</p>
                <p className="truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">
                  {mat.scaleMeters} · {mat.licence}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {drawer === "lights" ? (
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {filteredLights.slice(0, 8).map((lp) => (
            <button
              key={lp.id}
              type="button"
              onClick={() => {
                setIdea(appendSuggestionToIdea(idea, lp.fragment));
                setDesignField("light", lp.lightField);
                toast.success(`Applied ${lp.name} (${lp.kelvin}K · ${lp.iesProfile})`);
              }}
              className="flex flex-col gap-0.5 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-2 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-[10px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">{lp.name}</span>
                <span className="shrink-0 font-mono text-[9px] text-[#725b38] dark:text-[#e8c98a]">{lp.kelvin}K</span>
              </div>
              <span className="truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">{lp.iesProfile}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. SAM 3D EXTRAS BAR (CAD / 2D Plan Intake & Auto-Camera Planner)          */
/* -------------------------------------------------------------------------- */

const AUTO_CAMERAS = [
  { id: "hero", label: "Hero 3/4", fov: 35, preset: "oblique" as const, role: "orbit" as const, pos: [14, 9, 14] as [number, number, number], target: [0, 2, 0] as [number, number, number] },
  { id: "eye", label: "Eye Level 1.6m", fov: 50, preset: "eye" as const, role: "dolly" as const, pos: [10, 1.6, 12] as [number, number, number], target: [0, 2.2, 0] as [number, number, number] },
  { id: "ortho", label: "Drone Oblique", fov: 35, preset: "aerial" as const, role: "orbit" as const, pos: [20, 18, 20] as [number, number, number], target: [0, 1, 0] as [number, number, number] },
  { id: "corner", label: "Closeup Material", fov: 85, preset: "detail" as const, role: "zoom" as const, pos: [6, 3.2, 7] as [number, number, number], target: [0, 2, 0] as [number, number, number] },
];

export function Sam3dExtrasBar({
  onOpenStage,
}: {
  onOpenStage: (stage: "source" | "3d" | "sketch" | "cv" | "sam2" | "mask" | "result" | "grid" | "compare" | "360" | "nodes") => void;
}) {
  const setScene3DField = useOriel((s) => s.setScene3DField);
  const upsertCameraKeyframe = useOriel((s) => s.upsertCameraKeyframe);
  const cameraKeyframes = useOriel((s) => s.cameraKeyframes);
  const updateDesignContract = useOriel((s) => s.updateDesignContract);
  const { busy, generate } = useGenerate();

  const [cadOpen, setCadOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="arctic-glass flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-1.5 text-[11px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
            Camera Board ({cameraKeyframes.length}/6)
          </span>
          {AUTO_CAMERAS.map((cam) => (
            <button
              key={cam.id}
              type="button"
              onClick={() => {
                setScene3DField("cameraPreset", cam.preset);
                upsertCameraKeyframe({
                  id: `cam-${cam.id}`,
                  label: cam.label,
                  role: cam.role,
                  pos: cam.pos,
                  target: cam.target,
                  focalLength: cam.fov,
                });
                toast.success(`Camera pinned: ${cam.label} (${cam.fov}mm)`);
              }}
              className="inline-flex h-6 items-center gap-1 rounded-full bg-[#efeeea]/85 px-2 text-[10px] font-medium text-[#1b1c1a] hover:bg-[#c5a880]/25 dark:bg-[#202b38] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]"
            >
              <Camera className="size-2.5 text-[#725b38] dark:text-[#e8c98a]" />
              {cam.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCadOpen((v) => !v)}
            className="inline-flex h-6 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2.5 text-[10px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"
          >
            <Building2 className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> CAD / Plan Intake
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void generate("plate")}
            className="inline-flex h-6 items-center gap-1 rounded-full bg-[#c5a880] px-2.5 text-[10px] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
          >
            <Sparkles className="size-3" /> Render Angle
          </button>
        </div>
      </div>

      {cadOpen ? (
        <div className="arctic-glass-z2 flex flex-wrap items-center justify-between gap-2 rounded-2xl p-2.5 text-[11px]">
          <div className="space-y-0.5">
            <p className="font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">
              CAD / 2D Plan Intake Checklist (DWG · DXF · PDF · PNG)
            </p>
            <p className="text-[10px] text-[#4d463c] dark:text-[#a9bdc9]">
              Wall scale calibrated (100px = 1.0m) · Ceiling height 2.9m · Openings locked to Plan Layer
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                updateDesignContract({ inputClass: "floor-plan" });
                onOpenStage("cv");
                toast.success("Opened Plan Line Extraction & Extrusion");
              }}
              className="rounded-full border border-[#d1c5b8]/55 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
            >
              Extract Lines
            </button>
            <button
              type="button"
              onClick={() => {
                updateDesignContract({ inputClass: "floor-plan" });
                onOpenStage("3d");
                toast.success("Extruded floor plan walls into live 3D massing");
              }}
              className="ice-cta rounded-full px-3 py-1 text-[10px] font-bold"
            >
              Extrude to 3D Massing
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. KING 360 STUDIO PANEL (Tour Builder, 11 Hotspots, Inventory & Color)   */
/* -------------------------------------------------------------------------- */

const HOTSPOT_TYPES: readonly { id: TourHotspotType; label: string }[] = [
  { id: "navigation", label: "Navigation" },
  { id: "info", label: "Info Callout" },
  { id: "media", label: "Image/Video" },
  { id: "3d-object", label: "3D Object" },
  { id: "plan-jump", label: "Floor-Plan Jump" },
  { id: "unit", label: "Unit Card" },
  { id: "map", label: "Map & Routes" },
  { id: "document", label: "Brochure PDF" },
  { id: "product", label: "Shoppable Spec" },
  { id: "audio", label: "Spatial Audio" },
  { id: "lead", label: "Lead Capture" },
];

export function King360StudioPanel({
  aspect,
  onOpenStage,
}: {
  aspect: string;
  onOpenStage: (stage: "source" | "3d" | "sketch" | "cv" | "sam2" | "mask" | "result" | "grid" | "compare" | "360" | "nodes") => void;
}) {
  const tourConfig = useOriel((s) => s.tourConfig);
  const updateTourConfig = useOriel((s) => s.updateTourConfig);
  const addTourScene = useOriel((s) => s.addTourScene);
  const addTourHotspot = useOriel((s) => s.addTourHotspot);
  const removeTourHotspot = useOriel((s) => s.removeTourHotspot);
  const updateUnitStatus = useOriel((s) => s.updateUnitStatus);
  const governance = useOriel((s) => s.governance);
  const plate = useOriel((s) => s.plate);
  const upload = useOriel((s) => s.upload);

  const [tab, setTab] = useState<"grade" | "hotspots" | "inventory" | "publish">("grade");
  const [unitFilter, setUnitFilter] = useState<"all" | TourUnitRecord["status"]>("all");
  const [hsType, setHsType] = useState<TourHotspotType>("info");
  const [hsLabel, setHsLabel] = useState("Fjord Timber Reveal");
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [generatingPano, setGeneratingPano] = useState(false);
  const [tourPrompt, setTourPrompt] = useState(
    "Start at Harbor Arrival Deck -> Enter Fjord Living Pavilion -> Highlight Unit 3B panoramic corner.",
  );
  const panoUploadRef = useRef<HTMLInputElement>(null);

  const activeScene =
    tourConfig.scenes.find((sc) => sc.id === tourConfig.activeSceneId) ?? tourConfig.scenes[0];
  const panoUrl = activeScene?.imageUrl || plate?.url || upload || "/viz/p01-pavilion-dusk.jpg";

  const sceneHotspots = useMemo(
    () => tourConfig.hotspots.filter((h) => h.sceneId === activeScene?.id),
    [tourConfig.hotspots, activeScene?.id],
  );
  const activePin = sceneHotspots.find((h) => h.id === activePinId) ?? null;

  const visibleUnits = useMemo(
    () => tourConfig.units.filter((u) => unitFilter === "all" || u.status === unitFilter),
    [tourConfig.units, unitFilter],
  );

  const cssFilter = `brightness(${1 + tourConfig.exposure * 0.04}) contrast(${1 + tourConfig.contrast * 0.03}) saturate(${1 + tourConfig.saturation * 0.05}) sepia(${tourConfig.lutPreset === "Nordic Warm" ? 0.16 : 0})`;

  async function handleGenerate360Panorama() {
    if (generatingPano) return;
    setGeneratingPano(true);
    const st = useOriel.getState();
    try {
      const panoPrompt = `Seamless 360-degree 2:1 equirectangular architectural panorama. ${st.idea.trim() || `${st.design.look} ${st.design.vertical} architectural space`}. Level horizon, zero seam distortion, crisp material reflections, ${tourConfig.dayNightMode === "dusk" ? "warm architectural twilight blue hour" : "soft natural architectural daylight"}.`;
      const result = await generatePlate({
        data: {
          idea: panoPrompt,
          image: st.upload && st.upload.startsWith("data:image/") ? st.upload : undefined,
          design: st.design,
          frame: { ...st.frame, ratio: "16:9" },
          engine: st.engine,
          scene3d: st.scene3d,
          nanoBananaModel: resolveRuntimeModelOverride(st.nanoBanana.requestedModel),
          nanoBananaResolution: "1K",
          budgetCostMode: st.budget.costMode,
          budgetCapPaise: st.budget.capPaise,
          budgetMaxPerImagePaise: st.budget.maxPerImagePaise,
        },
      });
      st.setCredits(result.credits);
      if ("budget" in result && result.budget) {
        st.setBudgetState(result.budget);
      }
      let finalUrl = result.url;
      if (result.fallback) {
        finalUrl = await synthesizeFallbackComposite({
          baseImage: st.upload ?? st.plate?.url ?? undefined,
          serverFallbackUrl: result.url,
          design: st.design,
          engine: st.engine,
          scene3d: st.scene3d,
          idea: panoPrompt,
          variantIndex: 0,
        });
      }
      const sceneNum = tourConfig.scenes.length + 1;
      addTourScene({
        id: `sc-pano-${Date.now()}`,
        label: `360° ${st.design.look.slice(0, 14)} #${sceneNum}`,
        level: `L${Math.min(4, sceneNum)}`,
        imageUrl: finalUrl,
        mapX: Math.min(84, 22 + sceneNum * 15),
        mapY: Math.min(78, 30 + (sceneNum % 3) * 18),
      });
      toast.success(
        result.fallback
          ? "Generated Free (₹0) 360° Equirectangular Scene"
          : `Generated 360° Panorama (${formatPaiseShort(result.costPaise)})`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate 360° panorama.");
    } finally {
      setGeneratingPano(false);
    }
  }

  function handleUpload360File(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl.startsWith("data:image/")) return;
      const cleanName = file.name.replace(/\.[^.]+$/, "").slice(0, 20) || "Uploaded 360°";
      addTourScene({
        id: `sc-upload-${Date.now()}`,
        label: cleanName,
        level: "Custom",
        imageUrl: dataUrl,
        mapX: 52,
        mapY: 54,
      });
      toast.success(`Loaded 360° panorama "${cleanName}"`);
    };
    reader.readAsDataURL(file);
  }

  function handleExportStandaloneHtml() {
    const html = buildStandalone360TourHtml(
      tourConfig,
      panoUrl,
      governance.brandKitName || "Oriel Studio",
    );
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    triggerBlobDownload(blob, `oriel-360-tour-${tourConfig.slug || "studio"}.html`);
    toast.success("Downloaded standalone interactive 360° Tour (.HTML)");
  }

  return (
    <div data-testid="king-360-studio" className="flex flex-col gap-3">
      {/* Top 360 Sub-Controls */}
      <div className="arctic-glass flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#c5a880]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#725b38] dark:bg-[#202b38] dark:text-[#e8c98a]">
            <Compass className="size-3" /> KING 360 Studio
          </span>
          {tourConfig.scenes.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                updateTourConfig({ activeSceneId: sc.id });
                setActivePinId(null);
              }}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-medium transition",
                sc.id === activeScene?.id
                  ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "bg-[#efeeea]/80 text-[#4d463c] dark:bg-[#16202d] dark:text-[#a9bdc9]",
              )}
            >
              {sc.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <input
            ref={panoUploadRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleUpload360File}
          />
          <button
            type="button"
            onClick={() => panoUploadRef.current?.click()}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
          >
            <Upload className="size-3" /> Upload 360°
          </button>
          <button
            type="button"
            disabled={generatingPano}
            onClick={() => void handleGenerate360Panorama()}
            className="ice-cta inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[10px] font-bold disabled:opacity-60"
          >
            {generatingPano ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
            Generate 360°
          </button>
          {(["grade", "hotspots", "inventory", "publish"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize transition",
                tab === t
                  ? "bg-[#1b1c1a] text-white dark:bg-[#e8c98a] dark:text-[#261a00]"
                  : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Live 360° Sphere Viewer + Interactive Hotspots + Color Filter */}
      <div className="relative overflow-hidden rounded-2xl border border-[#d1c5b8]/45 dark:border-[#a9bdc9]/25" style={{ filter: cssFilter }}>
        <PanoramaViewer imageUrl={panoUrl} aspect={aspect} />

        {/* Interactive Hotspot Pins Anchored Over Active Scene */}
        {sceneHotspots.map((hs) => {
          const leftPct = Math.max(10, Math.min(86, 50 + hs.yaw * 0.42));
          const topPct = Math.max(16, Math.min(76, 48 - hs.pitch * 0.7));
          const selected = activePinId === hs.id;
          return (
            <button
              key={hs.id}
              type="button"
              onClick={() => setActivePinId(selected ? null : hs.id)}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              className={cn(
                "absolute z-20 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold shadow-md transition",
                selected
                  ? "border-[#e8c98a] bg-[#e8c98a] text-[#261a00]"
                  : "border-[#e8c98a]/80 bg-[#08131f]/85 text-[#e8eff3] hover:bg-[#16202d]",
              )}
            >
              <MapPin className="size-3 shrink-0" />
              <span className="max-w-[120px] truncate">{hs.label}</span>
            </button>
          );
        })}

        {activePin ? (
          <div className="absolute top-3 left-3 z-30 max-w-xs rounded-xl border border-[#e8c98a]/50 bg-[#08131f]/90 p-2.5 text-[11px] text-[#e8eff3] shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] font-bold uppercase text-[#e8c98a]">{activePin.type}</span>
              <button type="button" onClick={() => setActivePinId(null)} className="text-[#a9bdc9] hover:text-white">
                <X className="size-3.5" />
              </button>
            </div>
            <p className="mt-0.5 font-semibold">{activePin.label}</p>
            <p className="mt-0.5 text-[10px] text-[#a9bdc9]">{activePin.detail}</p>
          </div>
        ) : null}

        {/* Interactive Mini-Map Radar Overlay */}
        <div className="pointer-events-auto absolute right-3 bottom-12 z-20 w-32 rounded-xl border border-[#a9bdc9]/35 bg-[#08131f]/85 p-2 text-[9px] text-[#e8eff3]">
          <div className="mb-1 flex items-center justify-between text-[#e8c98a]">
            <span>MINI-MAP</span>
            <span>{activeScene?.level}</span>
          </div>
          <div className="relative h-16 w-full rounded-lg border border-[#a9bdc9]/20 bg-[#121c29]">
            {tourConfig.scenes.map((sc) => (
              <button
                key={sc.id}
                type="button"
                title={sc.label}
                onClick={() => updateTourConfig({ activeSceneId: sc.id })}
                style={{ left: `${sc.mapX}%`, top: `${sc.mapY}%` }}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition",
                  sc.id === activeScene?.id
                    ? "size-3 bg-[#e8c98a] ring-4 ring-[#e8c98a]/30"
                    : "size-2 bg-[#cfe3f0]/70 hover:scale-125",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 360 Tool Drawer */}
      <div className="arctic-glass-z2 rounded-2xl p-3 text-xs">
        {tab === "grade" ? (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                Color & Day/Night Grade
              </p>
              <label className="flex items-center justify-between gap-2 text-[11px]">
                <span>Exposure ({tourConfig.exposure})</span>
                <input
                  type="range"
                  min={-6}
                  max={6}
                  value={tourConfig.exposure}
                  onChange={(e) => updateTourConfig({ exposure: Number(e.target.value) })}
                  className="w-28 accent-[#c5a880] dark:accent-[#cfe3f0]"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-[11px]">
                <span>Contrast ({tourConfig.contrast})</span>
                <input
                  type="range"
                  min={-6}
                  max={10}
                  value={tourConfig.contrast}
                  onChange={(e) => updateTourConfig({ contrast: Number(e.target.value) })}
                  className="w-28 accent-[#c5a880] dark:accent-[#cfe3f0]"
                />
              </label>
              <label className="flex items-center justify-between gap-2 text-[11px]">
                <span>Saturation ({tourConfig.saturation})</span>
                <input
                  type="range"
                  min={-8}
                  max={8}
                  value={tourConfig.saturation}
                  onChange={(e) => updateTourConfig({ saturation: Number(e.target.value) })}
                  className="w-28 accent-[#c5a880] dark:accent-[#cfe3f0]"
                />
              </label>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                LUT & Day/Night Pair
              </p>
              <div className="flex flex-wrap gap-1">
                {(["Arctic Glass", "Neutral", "Nordic Warm", "Editorial Film"] as const).map((lut) => (
                  <button
                    key={lut}
                    type="button"
                    onClick={() => updateTourConfig({ lutPreset: lut })}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-medium",
                      tourConfig.lutPreset === lut
                        ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "bg-[#efeeea] text-[#4d463c] dark:bg-[#202b38] dark:text-[#a9bdc9]",
                    )}
                  >
                    {lut}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => updateTourConfig({ dayNightMode: tourConfig.dayNightMode === "day" ? "dusk" : "day" })}
                  className="rounded-full border border-[#d1c5b8]/55 px-3 py-1 text-[10px] font-semibold dark:border-[#a9bdc9]/30 dark:text-[#e8eff3]"
                >
                  Sky Mode: {tourConfig.dayNightMode.toUpperCase()}
                </button>
                <button
                  type="button"
                  onClick={() => updateTourConfig({ nadirLogoPatch: !tourConfig.nadirLogoPatch })}
                  className="rounded-full border border-[#d1c5b8]/55 px-3 py-1 text-[10px] font-semibold dark:border-[#a9bdc9]/30 dark:text-[#e8eff3]"
                >
                  Nadir Cap: {tourConfig.nadirLogoPatch ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                Seam-Aware 360° Region Edit
              </p>
              <p className="text-[11px] text-[#4d463c] dark:text-[#a9bdc9]">
                Unwraps the active 180°/360° seam region cleanly into MAS 2D Inpaint without polar pinch.
              </p>
              <button
                type="button"
                onClick={() => {
                  onOpenStage("mask");
                  toast.success("Opened active equirectangular region in Inpaint workspace");
                }}
                className="ice-cta inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold"
              >
                <Wand2 className="size-3.5" /> Edit Panorama Region in 2D
              </button>
            </div>
          </div>
        ) : tab === "hotspots" ? (
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={hsType}
                onChange={(e) => setHsType(e.target.value as TourHotspotType)}
                className="h-8 rounded-xl border border-[#d1c5b8]/55 bg-white px-2.5 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/30 dark:bg-[#121c29] dark:text-[#e8eff3]"
              >
                {HOTSPOT_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={hsLabel}
                onChange={(e) => setHsLabel(e.target.value)}
                placeholder="Hotspot label…"
                className="h-8 flex-1 rounded-xl border border-[#d1c5b8]/55 bg-white px-3 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/30 dark:bg-[#121c29] dark:text-[#e8eff3]"
              />
              <button
                type="button"
                onClick={() => {
                  addTourHotspot({
                    sceneId: activeScene?.id ?? "sc-arrival",
                    type: hsType,
                    label: hsLabel.trim() || "New Hotspot",
                    yaw: Math.round((Math.random() - 0.5) * 140),
                    pitch: -4,
                    detail: `${hsType} pin anchored in ${activeScene?.label ?? "Scene"}`,
                  });
                  toast.success(`Added ${hsType} hotspot to ${activeScene?.label}`);
                }}
                className="ice-cta inline-flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-bold"
              >
                <Plus className="size-3.5" /> Drop Pin
              </button>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {tourConfig.hotspots.map((hs) => (
                <div
                  key={hs.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/70 px-2.5 py-1.5 dark:border-[#43474b]/60 dark:bg-[#16202d]/80"
                >
                  <div className="min-w-0">
                    <span className="mr-1.5 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]">
                      {hs.type}
                    </span>
                    <span className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">{hs.label}</span>
                    <p className="truncate text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">{hs.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActivePinId(hs.id)}
                      className="text-[#725b38] hover:opacity-80 dark:text-[#e8c98a]"
                      title="Focus hotspot"
                    >
                      <MapPin className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeTourHotspot(hs.id);
                        if (activePinId === hs.id) setActivePinId(null);
                        toast.message(`Removed hotspot "${hs.label}"`);
                      }}
                      className="text-rose-500 hover:opacity-80"
                      title="Remove hotspot"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : tab === "inventory" ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                Real-Estate Unit Inventory ({visibleUnits.length})
              </span>
              <div className="flex gap-1">
                {(["all", "available", "reserved", "sold"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setUnitFilter(st)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize",
                      unitFilter === st
                        ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "bg-[#efeeea] text-[#4d463c] dark:bg-[#202b38] dark:text-[#a9bdc9]",
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {visibleUnits.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/70 p-2 dark:border-[#43474b]/60 dark:bg-[#16202d]/85"
                >
                  <div>
                    <p className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">
                      Unit {unit.unitCode} · {unit.type} ({unit.areaSqm} m²)
                    </p>
                    <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                      Floor {unit.floor} · {unit.orientation} · {unit.priceLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <select
                      value={unit.status}
                      onChange={(e) => updateUnitStatus(unit.id, e.target.value as TourUnitRecord["status"])}
                      className="rounded-full border border-[#d1c5b8]/55 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8c98a]"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => updateTourConfig({ activeSceneId: unit.sceneId })}
                      className="rounded-full bg-[#c5a880]/25 px-2 py-0.5 text-[10px] font-semibold text-[#513d1d] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                    >
                      Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                Tour Sentence Editor & Theme ({tourConfig.theme})
              </p>
              <textarea
                rows={2}
                value={tourPrompt}
                onChange={(e) => setTourPrompt(e.target.value)}
                className="w-full rounded-xl border border-[#d1c5b8]/55 bg-white p-2 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b]/85 dark:text-[#e8eff3]"
              />
              <div className="flex flex-wrap gap-1">
                {(["ultra-luxury", "minimal", "developer-sales", "hospitality"] as const).map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => updateTourConfig({ theme: th })}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize",
                      tourConfig.theme === th
                        ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "bg-[#efeeea] text-[#4d463c] dark:bg-[#202b38] dark:text-[#a9bdc9]",
                    )}
                  >
                    {th}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/60 p-2.5 dark:border-[#43474b]/60 dark:bg-[#16202d]/75">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">/{tourConfig.slug} (v{tourConfig.publishedVersion})</p>
                  <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">Access: {tourConfig.accessMode} · Mobile VR + Web Share Ready</p>
                </div>
                <QrCode className="size-7 text-[#725b38] dark:text-[#e8c98a]" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    updateTourConfig({ publishedVersion: tourConfig.publishedVersion + 1 });
                    void navigator.clipboard?.writeText(`${window.location.origin}/?tour=${tourConfig.slug}`);
                    toast.success(`Published Tour v${tourConfig.publishedVersion + 1} & copied share link`);
                  }}
                  className="ice-cta inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold"
                >
                  <Check className="size-3.5" /> Publish &amp; Copy Link
                </button>
                <button
                  type="button"
                  onClick={handleExportStandaloneHtml}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#d1c5b8]/55 bg-white px-3 text-[11px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/30 dark:bg-[#202b38] dark:text-[#e8eff3]"
                >
                  <FileCode2 className="size-3.5 text-[#725b38] dark:text-[#e8c98a]" /> Download 360° HTML
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. KUM VIDEO STUDIO PANEL (Storyboard + Multi-Track Timeline + WebM Export)*/
/* -------------------------------------------------------------------------- */

export function KumVideoStudioPanel() {
  const videoProject = useOriel((s) => s.videoProject);
  const updateVideoProject = useOriel((s) => s.updateVideoProject);
  const addClipToKumVideo = useOriel((s) => s.addClipToKumVideo);
  const updateClipInKumVideo = useOriel((s) => s.updateClipInKumVideo);
  const removeClipFromKumVideo = useOriel((s) => s.removeClipFromKumVideo);
  const plate = useOriel((s) => s.plate);
  const design = useOriel((s) => s.design);

  const [playing, setPlaying] = useState(false);
  const [playheadSec, setPlayheadSec] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [renderPct, setRenderPct] = useState(0);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [renderedFilename, setRenderedFilename] = useState<string>("oriel-kum-film.webm");
  const clipUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (renderedVideoUrl) URL.revokeObjectURL(renderedVideoUrl);
    };
  }, [renderedVideoUrl]);

  const videoClips = useMemo(
    () => videoProject.clips.filter((c) => c.track === "video"),
    [videoProject.clips],
  );
  const totalSec = useMemo(
    () => Math.max(8, videoClips.reduce((acc, c) => Math.max(acc, c.startSec + c.durationSec), 0)),
    [videoClips],
  );

  const activeClip = useMemo(
    () =>
      videoClips.find((c) => playheadSec >= c.startSec && playheadSec < c.startSec + c.durationSec) ??
      videoClips[0],
    [videoClips, playheadSec],
  );

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setPlayheadSec((prev) => {
        const next = prev + 0.1;
        return next >= totalSec ? 0 : Number(next.toFixed(1));
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, totalSec]);

  const progressWithinClip = activeClip
    ? Math.max(0, Math.min(1, (playheadSec - activeClip.startSec) / Math.max(1, activeClip.durationSec)))
    : 0;
  const kenBurnsScale =
    activeClip?.cameraMove === "dolly-in"
      ? 1 + progressWithinClip * 0.12
      : activeClip?.cameraMove === "rise"
        ? 1.08 - progressWithinClip * 0.06
        : 1.04;
  const kenBurnsX = activeClip?.cameraMove === "pan" ? (progressWithinClip - 0.5) * 28 : 0;

  async function handleRenderWebmVideo() {
    if (exporting) return;
    setExporting(true);
    setRenderPct(4);
    try {
      const rendered = await renderKumTimelineToWebm(
        videoProject,
        `${design.look} Architectural Film`,
        (pct) => setRenderPct(pct),
      );
      if (renderedVideoUrl) URL.revokeObjectURL(renderedVideoUrl);
      if (rendered.isWebm) {
        setRenderedVideoUrl(rendered.url);
        setRenderedFilename(rendered.filename);
      }
      triggerBlobDownload(rendered.blob, rendered.filename);
      toast.success(
        rendered.isWebm
          ? `Rendered & downloaded ${rendered.filename} (${videoProject.aspect} · ${videoClips.length} clips)`
          : `Exported storyboard frame (${rendered.filename})`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not render KUM Video file.");
    } finally {
      setExporting(false);
      setRenderPct(0);
    }
  }

  function handleExportTimelineJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      project: `${design.look} Film Edit`,
      settings: {
        aspect: videoProject.aspect,
        fps: videoProject.fps,
        resolution: videoProject.resolution,
        codec: videoProject.codec,
        lut: videoProject.lut,
        musicTrack: videoProject.musicTrack,
      },
      durationSec: totalSec,
      clips: videoProject.clips,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    triggerBlobDownload(blob, `oriel-kum-video-timeline-${videoProject.aspect.replace(":", "x")}.json`);
    toast.success("Downloaded KUM Video EDL / JSON timeline spec");
  }

  function handleUploadClipFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl.startsWith("data:image/")) return;
      addClipToKumVideo({
        track: "video",
        label: file.name.replace(/\.[^.]+$/, "").slice(0, 24) || "Uploaded Clip",
        imageUrl: dataUrl,
        durationSec: 5,
        cameraMove: "dolly-in",
        transition: "cross-dissolve",
      });
      toast.success(`Added "${file.name}" to Video Track`);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div data-testid="kum-video-studio" className="flex flex-col gap-3">
      {/* Top Toolbar */}
      <div className="arctic-glass flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#c5a880]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#725b38] dark:bg-[#202b38] dark:text-[#e8c98a]">
            <Film className="size-3" /> KUM Video Studio
          </span>
          <div className="flex items-center gap-1 rounded-full bg-[#efeeea]/85 p-0.5 dark:bg-[#121c29]">
            {(["16:9", "9:16", "1:1", "4:5"] as const).map((ar) => (
              <button
                key={ar}
                type="button"
                onClick={() => updateVideoProject({ aspect: ar })}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  videoProject.aspect === ar
                    ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                    : "text-[#4d463c] dark:text-[#a9bdc9]",
                )}
              >
                {ar}
              </button>
            ))}
          </div>
          <select
            value={videoProject.lut}
            onChange={(e) => updateVideoProject({ lut: e.target.value as typeof videoProject.lut })}
            className="h-7 rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/30 dark:bg-[#202b38] dark:text-[#e8eff3]"
          >
            <option value="Arctic Glass">LUT: Arctic Glass</option>
            <option value="Filmic Warm">LUT: Filmic Warm</option>
            <option value="Neutral">LUT: Neutral</option>
            <option value="Twilight Gold">LUT: Twilight Gold</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <input
            ref={clipUploadRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleUploadClipFile}
          />
          <button
            type="button"
            onClick={() => clipUploadRef.current?.click()}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
          >
            <Upload className="size-3" /> Upload Clip
          </button>
          {plate?.url ? (
            <button
              type="button"
              onClick={() => {
                addClipToKumVideo({
                  track: "video",
                  label: `Active Plate (${design.look})`,
                  imageUrl: plate.url,
                  durationSec: 5,
                  cameraMove: "dolly-in",
                  transition: "cross-dissolve",
                });
                toast.success("Appended active plate to Video Track");
              }}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
            >
              <Plus className="size-3 text-[#725b38] dark:text-[#e8c98a]" /> Add Active Plate
            </button>
          ) : null}
          <button
            type="button"
            disabled={exporting}
            onClick={() => void handleRenderWebmVideo()}
            className="ice-cta inline-flex h-7 items-center gap-1 rounded-full px-3 text-[10px] font-bold disabled:opacity-65"
          >
            {exporting ? <Loader2 className="size-3 animate-spin" /> : <Video className="size-3" />}
            {exporting ? `Rendering ${renderPct}%` : "Render WebM Film"}
          </button>
          <button
            type="button"
            onClick={handleExportTimelineJson}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
            title="Download timeline EDL JSON"
          >
            <Download className="size-3" /> EDL JSON
          </button>
        </div>
      </div>

      {/* Rendered WebM Film Player (when freshly exported) */}
      {renderedVideoUrl ? (
        <div className="arctic-glass-z2 flex flex-wrap items-center justify-between gap-2 rounded-2xl p-2.5 text-xs">
          <div className="flex items-center gap-2.5">
            <video
              src={renderedVideoUrl}
              controls
              playsInline
              className="h-20 w-36 rounded-xl border border-[#a9bdc9]/25 bg-black object-cover"
            />
            <div>
              <p className="font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">Rendered WebM Film Ready</p>
              <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                {renderedFilename} · {videoProject.aspect} · {videoProject.lut}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={renderedVideoUrl}
              download={renderedFilename}
              className="ice-cta inline-flex h-7 items-center gap-1 rounded-full px-3 text-[10px] font-bold"
            >
              <Download className="size-3" /> Save .WebM
            </a>
            <button
              type="button"
              onClick={() => setRenderedVideoUrl(null)}
              className="grid size-7 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Live Preview Stage */}
      <div className="relative flex h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-[#d1c5b8]/45 bg-[#050f1b] dark:border-[#a9bdc9]/25">
        {activeClip?.imageUrl ? (
          <img
            src={activeClip.imageUrl}
            alt={activeClip.label}
            style={{
              transform: `scale(${kenBurnsScale.toFixed(3)}) translateX(${kenBurnsX.toFixed(1)}px)`,
              transition: "transform 120ms linear",
            }}
            className="h-full w-full object-cover"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050f1b]/85 via-transparent to-[#050f1b]/35" />

        {videoProject.captionsEnabled ? (
          <div className="pointer-events-none absolute top-4 left-4 rounded-xl border border-[#e8c98a]/35 bg-[#08131f]/75 px-3 py-1.5">
            <p className="font-display text-xs font-medium tracking-wider text-[#e8eff3] uppercase">
              {activeClip?.label ?? "Establishing Shot"}
            </p>
            <p className="text-[10px] text-[#e8c98a]">
              {activeClip?.cameraMove} · {videoProject.fps}fps · {videoProject.lut}
            </p>
          </div>
        ) : null}

        {activeClip ? (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-[#a9bdc9]/30 bg-[#08131f]/85 px-2.5 py-1 text-[10px] text-[#e8eff3]">
            <span className="text-[#a9bdc9]">Move:</span>
            {(["dolly-in", "pan", "rise", "static"] as const).map((mv) => (
              <button
                key={mv}
                type="button"
                onClick={() => updateClipInKumVideo(activeClip.id, { cameraMove: mv })}
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase",
                  activeClip.cameraMove === mv ? "bg-[#e8c98a] font-bold text-[#261a00]" : "hover:bg-white/10",
                )}
              >
                {mv}
              </button>
            ))}
          </div>
        ) : null}

        <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full border border-[#a9bdc9]/30 bg-[#08131f]/85 px-3 py-1.5">
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            className="grid size-7 shrink-0 place-items-center rounded-full bg-[#cfe3f0] text-[#08131f]"
            aria-label={playing ? "Pause preview" : "Play preview"}
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
          <input
            type="range"
            min={0}
            max={totalSec}
            step={0.1}
            value={playheadSec}
            onChange={(e) => setPlayheadSec(Number(e.target.value))}
            className="h-1 flex-1 accent-[#e8c98a]"
          />
          <span className="font-mono text-[10px] tabular-nums text-[#e8eff3]">
            {playheadSec.toFixed(1)}s / {totalSec.toFixed(0)}s
          </span>
        </div>
      </div>

      {/* Multi-Track Timeline (Video, Audio, Title, FX) */}
      <div className="arctic-glass-z2 space-y-1.5 rounded-2xl p-3 text-[10px]">
        {(["video", "title", "audio", "fx"] as const).map((trackName) => {
          const items = videoProject.clips.filter((c) => c.track === trackName);
          return (
            <div key={trackName} className="flex items-center gap-2">
              <span className="w-12 shrink-0 font-mono text-[9px] font-bold uppercase text-[#725b38] dark:text-[#e8c98a]">
                {trackName}
              </span>
              <div className="no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto rounded-xl bg-[#efeeea]/80 p-1 dark:bg-[#050f1b]/75">
                {items.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => setPlayheadSec(clip.startSec)}
                    className={cn(
                      "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 transition",
                      activeClip?.id === clip.id
                        ? "border-[#e8c98a] bg-[#c5a880]/25 text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8eff3]"
                        : "border-[#d1c5b8]/45 bg-white/80 text-[#4d463c] dark:border-[#43474b]/50 dark:bg-[#16202d] dark:text-[#a9bdc9]",
                    )}
                  >
                    <Layers className="size-2.5 text-[#725b38] dark:text-[#e8c98a]" />
                    <span className="max-w-[140px] truncate font-medium">{clip.label}</span>
                    <span className="font-mono text-[9px] opacity-75">{clip.durationSec}s</span>
                    {trackName === "video" && items.length > 1 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeClipFromKumVideo(clip.id);
                        }}
                        aria-label={`Remove ${clip.label}`}
                        className="text-rose-500 hover:opacity-80"
                      >
                        <Trash2 className="size-2.5" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
