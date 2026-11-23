import {
  Camera,
  CheckCircle2,
  Download,
  GripVertical,
  Lock,
  Maximize2,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Unlock,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ResilientPlateImage } from "@/components/resilient-plate-image";
import { Viewport3D } from "@/components/viewport-3d";
import { ATELIER_VERTICAL_HERO } from "@/lib/atelier-studio";
import type { CameraPreset3D } from "@/lib/engines";
import { RATIOS, frameAspect } from "@/lib/frame";
import { NANO_BANANA_MODEL_OPTIONS } from "@/lib/nano-banana-client";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";

type SplitViewportStageProps = {
  onOpenGateModal: () => void;
  onOpenStage: (stage: "source" | "3d" | "sketch" | "cv" | "sam2" | "mask" | "result" | "grid" | "compare" | "360" | "nodes") => void;
  heroFit?: boolean;
  showOpticsDock?: boolean;
  hideTopBar?: boolean;
  contractOpen?: boolean;
};

export function SplitViewportStage({
  onOpenGateModal,
  onOpenStage,
  heroFit = false,
  showOpticsDock = false,
  hideTopBar = false,
  contractOpen,
}: SplitViewportStageProps) {
  const splitViewMode = useOriel((s) => s.splitViewMode);
  const setSplitViewMode = useOriel((s) => s.setSplitViewMode);
  const splitRatio = useOriel((s) => s.splitRatio);
  const setSplitRatio = useOriel((s) => s.setSplitRatio);
  const design = useOriel((s) => s.design);
  const frame = useOriel((s) => s.frame);
  const scene3d = useOriel((s) => s.scene3d);
  const engine = useOriel((s) => s.engine);
  const setEngineField = useOriel((s) => s.setEngineField);
  const upload = useOriel((s) => s.upload);
  const setUpload = useOriel((s) => s.setUpload);
  const plate = useOriel((s) => s.plate);
  const idea = useOriel((s) => s.idea);
  const designContract = useOriel((s) => s.designContract);
  const updateDesignContract = useOriel((s) => s.updateDesignContract);
  const fidelityReport = useOriel((s) => s.fidelityReport);
  const applyWorkflowPreset = useOriel((s) => s.applyWorkflowPreset);
  const { busy } = useGenerate();

  const [internalContractOpen, setInternalContractOpen] = useState(false);
  const resolvedContractOpen = contractOpen ?? internalContractOpen;
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const aspect = frameAspect(frame.ratio);
  const heroSample = ATELIER_VERTICAL_HERO[design.vertical];
  const activeAiUrl = plate?.url ?? upload ?? heroSample.src;

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    setSplitRatio(pct);
  }

  function downloadAiSnapshot() {
    const a = document.createElement("a");
    a.href = activeAiUrl;
    a.download = `oriel-sam3d-${Date.now()}.png`;
    a.click();
    toast.success("Downloaded AI Diffusion frame");
  }

  return (
    <div
      data-testid="split-viewport-stage"
      className={cn(
        "hf-stage-enter flex flex-col gap-2",
        heroFit ? "min-h-0 flex-1" : "",
      )}
    >
      {/* Top Engine Telemetry + View Mode Controls */}
      {!hideTopBar ? (
        <div className="arctic-glass flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-1.5 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efeeea] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#1b1c1a] dark:bg-[#202b38]/90 dark:text-[#cfe3f0]">
              <span className="size-2 animate-pulse rounded-full bg-[#725b38] dark:bg-[#e8c98a] dark:shadow-[0_0_8px_#e8c98a]" />
              SAM 3D ENGINE • RUNNING
            </span>
            <span className="hidden text-[11px] text-[#4d463c] sm:inline dark:text-[#a9bdc9]">
              CUDA Latency: <strong className="text-[#1b1c1a] dark:text-[#e8eff3]">38ms</strong>
            </span>
            <span className="hidden text-[11px] text-[#4d463c] md:inline dark:text-[#a9bdc9]">
              VRAM: <strong className="text-[#1b1c1a] dark:text-[#e8eff3]">18.4 / 24 GB</strong>
            </span>
            <button
              type="button"
              onClick={onOpenGateModal}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/12 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300"
            >
              <ShieldCheck className="size-3" />
              Gate: {fidelityReport ? `${Math.round(fidelityReport.overallScore * 100)}% ${fidelityReport.status}` : "Ready"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center gap-0.5 rounded-full bg-[#efeeea]/90 p-0.5 dark:bg-[#121c29]">
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
                  data-testid={`split-mode-${mode.id}`}
                  onClick={() => setSplitViewMode(mode.id)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                    splitViewMode === mode.id
                      ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                      : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setInternalContractOpen((v) => !v);
              }}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium",
                resolvedContractOpen
                  ? "border-[#725b38] bg-[#c5a880]/20 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]"
                  : "border-[#d1c5b8]/55 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
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
                toast.success("Synchronized 3D camera frustum with AI viewport");
              }}
              className="grid size-7 place-items-center rounded-full bg-[#efeeea] text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8eff3]"
              title="Synchronize Camera Frustum"
            >
              <RefreshCw className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onOpenStage(plate?.url ? "result" : "3d")}
              className="grid size-7 place-items-center rounded-full bg-[#efeeea] text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8eff3]"
              title="Open Classic Full Stage View"
            >
              <Maximize2 className="size-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Design Contract ("Here is what I see") Collapsible Bar */}
      {resolvedContractOpen ? (
        <div
          data-testid="design-contract-drawer"
          className="arctic-glass-z2 grid gap-3 rounded-2xl p-3 text-xs md:grid-cols-3"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
              Here is what I see ({designContract.rung.label})
            </p>
            <ul className="mt-1 space-y-0.5 text-[11px] text-[#4d463c] dark:text-[#cfe3f0]">
              {designContract.observedFacts.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
              Detected Elements
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {designContract.detectedObjects.map((obj) => (
                <span
                  key={obj}
                  className="rounded-full border border-[#d1c5b8]/50 bg-white/60 px-2 py-0.5 text-[10px] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"
                >
                  {obj}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                Hard Keep Clause
              </span>
              <button
                type="button"
                onClick={() => updateDesignContract({ lockedPreserve: !designContract.lockedPreserve })}
                className="inline-flex items-center gap-1 rounded-full bg-[#c5a880]/20 px-2 py-0.5 text-[10px] font-semibold text-[#725b38] dark:bg-[#584411] dark:text-[#e8c98a]"
              >
                {designContract.lockedPreserve ? <Lock className="size-2.5" /> : <Unlock className="size-2.5" />}
                {designContract.lockedPreserve ? "Locked" : "Editable"}
              </button>
            </div>
            <input
              type="text"
              value={designContract.preserveClause}
              onChange={(e) => updateDesignContract({ preserveClause: e.target.value })}
              className="h-8 rounded-xl border border-[#d1c5b8]/50 bg-white/80 px-2.5 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b]/80 dark:text-[#e8eff3]"
            />
          </div>
        </div>
      ) : null}

      {/* Main Split Viewport Container */}
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerLeave={() => {
          draggingRef.current = false;
        }}
        className={cn(
          "relative flex flex-col overflow-hidden rounded-[22px] border border-[#d1c5b8]/50 bg-[#050f1b] shadow-[0_24px_60px_rgba(4,10,18,0.65)] md:flex-row dark:border-[#a9bdc9]/25",
          heroFit ? "min-h-[290px] flex-1 md:min-h-[280px]" : "min-h-[380px] md:h-[430px]",
        )}
      >
        {/* Left: 3D Mesh Viewport */}
        {splitViewMode !== "ai-solo" ? (
          <div
            style={splitViewMode === "split" ? { flexBasis: `${splitRatio}%` } : { flexBasis: "100%" }}
            className="relative min-h-[230px] flex-1 overflow-hidden bg-[#050f1b]"
          >
            <div className="pointer-events-none absolute top-3 left-3 z-20 flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/85 px-2.5 py-1 text-[10px] backdrop-blur-md">
                <span className="font-semibold tracking-wider text-[#e8eff3]">3D WIRE / CLAY</span>
                <span className="text-[#a9bdc9]">• {scene3d.preset.toUpperCase()}</span>
              </div>
              <div className="hidden items-center gap-1 rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/85 px-2.5 py-1 text-[10px] text-[#cfe3f0] backdrop-blur-md xl:flex">
                <Camera className="size-3 text-[#e8c98a]" />
                <span>{scene3d.focalLength}mm • {scene3d.cameraPreset}</span>
              </div>
            </div>

            <Viewport3D
              aspect={aspect}
              compactSplit
              onCaptureSnapshot={(dataUrl, goToSketch) => {
                setUpload(dataUrl);
                applyWorkflowPreset("clay-to-render");
                if (goToSketch) {
                  onOpenStage("sketch");
                } else {
                  toast.success("3D view captured — ready to synthesize photoreal plate");
                }
              }}
              onCaptureChannels={(channels) => {
                if (!upload) setUpload(channels.clayUrl);
              }}
            />
          </div>
        ) : null}

        {/* Draggable Center Divider */}
        {splitViewMode === "split" ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize 3D and AI split view"
            onPointerDown={() => {
              draggingRef.current = true;
            }}
            className="relative z-30 hidden w-2.5 shrink-0 cursor-col-resize items-center justify-center bg-[#202b38] transition hover:bg-[#cfe3f0]/40 md:flex"
          >
            <span className="flex h-8 w-5 items-center justify-center rounded-full border border-[#a9bdc9]/35 bg-[#121c29] text-[#a9bdc9] shadow-md">
              <GripVertical className="size-3" />
            </span>
          </div>
        ) : null}

        {/* Right: Live AI Diffusion / Plate Pane */}
        {splitViewMode !== "3d-solo" ? (
          <div
            style={splitViewMode === "split" ? { flexBasis: `${100 - splitRatio}%` } : { flexBasis: "100%" }}
            className="relative min-h-[230px] flex-1 overflow-hidden bg-[#08131f]"
          >
            <ResilientPlateImage
              src={activeAiUrl}
              alt={plate?.idea || "Photorealistic Nordic architectural plate"}
              busy={busy}
              busyLabel={engine.outputMode === "grid-4" ? "Generating 4-Up concept variations…" : "Synthesizing photoreal architectural plate…"}
              testId="split-ai-canvas-img"
              className="object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050f1b]/90 via-transparent to-[#050f1b]/55" />

            {/* Top Badges */}
            <div className="pointer-events-none absolute top-2.5 right-2.5 left-2.5 z-10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/80 px-2.5 py-1 backdrop-blur-xl">
                <span className="size-2 rounded-full bg-[#e8c98a] shadow-[0_0_8px_#e8c98a]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#e8eff3]">
                  {plate?.url ? (plate.fallback ? "Preview Render · AI offline" : "Live AI Diffusion") : "Reference Preview"}
                </span>
              </div>
              <span className="rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/80 px-2.5 py-1 text-[10px] font-semibold text-[#cfe3f0] backdrop-blur-xl">
                4K Denoising • {frame.ratio}
              </span>
            </div>

            {/* Bottom Caption + Actions */}
            <div className="absolute right-3 bottom-3 left-3 z-10 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e8c98a]">
                  {design.look} • {design.light}
                </span>
                <p className="truncate text-xs text-[#e8eff3]">
                  {plate?.idea || idea || "Reflective fjord ice plinth • Warm refraction"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenStage("mask")}
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-[#a9bdc9]/35 bg-[#050f1b]/80 px-2.5 text-[10px] font-medium text-[#e8eff3] backdrop-blur-md hover:border-[#e8c98a]"
                >
                  <SlidersHorizontal className="size-3 text-[#e8c98a]" /> Inpaint
                </button>
                <button
                  type="button"
                  onClick={downloadAiSnapshot}
                  aria-label="Download snapshot"
                  className="grid size-8 place-items-center rounded-full border border-[#a9bdc9]/35 bg-[#050f1b]/80 text-[#e8eff3] backdrop-blur-md hover:border-[#cfe3f0]"
                >
                  <Download className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {showOpticsDock ? <RadialOpticsDock /> : null}
    </div>
  );
}

export function RadialOpticsDock() {
  const radialOptics = useOriel((s) => s.radialOptics);
  const setRadialOptics = useOriel((s) => s.setRadialOptics);
  const setScene3DField = useOriel((s) => s.setScene3DField);
  const setEngineField = useOriel((s) => s.setEngineField);
  const idea = useOriel((s) => s.idea);
  const setIdea = useOriel((s) => s.setIdea);
  const { busy, generate } = useGenerate();
  const [quickPrompt, setQuickPrompt] = useState("");

  function applyQuickOpticsRender() {
    if (quickPrompt.trim()) {
      const base = idea.trim();
      setIdea(base ? `${base}, ${quickPrompt.trim()}` : quickPrompt.trim());
    }
    void generate("plate");
  }

  return (
    <div
      data-testid="radial-optics-dock"
      className="arctic-glass-z2 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-xs"
    >
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]">
          Radial Optics
        </span>

        {/* Dial 1: Solar Azimuth & Elevation */}
        <div className="flex items-center gap-2">
          <div className="relative grid size-9 place-items-center rounded-full border border-[#a9bdc9]/30 bg-[#16202d] text-[#e8c98a]">
            <svg viewBox="0 0 36 36" className="size-8 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(169,189,201,0.22)" strokeWidth="2.5" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#e8c98a"
                strokeWidth="2.5"
                strokeDasharray="88"
                strokeDashoffset={88 - Math.round((radialOptics.solarAzimuth / 360) * 88)}
                strokeLinecap="round"
              />
            </svg>
            <Sun className="absolute size-3" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">Solar Azimuth</p>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[11px] font-bold text-[#725b38] dark:text-[#e8c98a]">
                {radialOptics.solarAzimuth}° • {radialOptics.solarElevation}°
              </span>
              <button
                type="button"
                onClick={() => {
                  const nextAz = (radialOptics.solarAzimuth + 24) % 360;
                  setRadialOptics({ solarAzimuth: nextAz });
                  setScene3DField("sunAzimuth", nextAz);
                }}
                className="rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]"
                title="Step solar angle"
              >
                +24°
              </button>
            </div>
          </div>
        </div>

        {/* Dial 2: Exposure / Vig */}
        <div className="flex items-center gap-2">
          <div className="relative grid size-9 place-items-center rounded-full border border-[#a9bdc9]/30 bg-[#16202d] text-[#cfe3f0]">
            <svg viewBox="0 0 36 36" className="size-8 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(169,189,201,0.22)" strokeWidth="2.5" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#cfe3f0"
                strokeWidth="2.5"
                strokeDasharray="88"
                strokeDashoffset={Math.max(10, 68 - Math.round(radialOptics.exposureEv * 16))}
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono text-[8px] font-bold">EV</span>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">Exposure / Vig</p>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[11px] font-bold text-[#4d463c] dark:text-[#cfe3f0]">
                {radialOptics.exposureEv >= 0 ? "+" : ""}
                {radialOptics.exposureEv.toFixed(1)} EV • {radialOptics.vignettePct}%
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = radialOptics.exposureEv >= 1.4 ? -0.4 : Number((radialOptics.exposureEv + 0.3).toFixed(1));
                  setRadialOptics({ exposureEv: next });
                }}
                className="rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]"
                title="Cycle exposure compensation"
              >
                ±EV
              </button>
            </div>
          </div>
        </div>

        {/* Dial 3: Diffusion Lock */}
        <div className="flex items-center gap-2">
          <div className="relative grid size-9 place-items-center rounded-full border border-[#a9bdc9]/30 bg-[#16202d] text-[#cde5ff]">
            <svg viewBox="0 0 36 36" className="size-8 -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(169,189,201,0.22)" strokeWidth="2.5" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#cde5ff"
                strokeWidth="2.5"
                strokeDasharray="88"
                strokeDashoffset={88 - Math.round((radialOptics.diffusionLock / 100) * 88)}
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mono text-[8px] font-bold">{radialOptics.diffusionLock}</span>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">Diffusion Lock</p>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[11px] font-bold text-[#1b1c1a] dark:text-[#cde5ff]">
                {radialOptics.diffusionLock}% {radialOptics.diffusionLock >= 80 ? "Strict" : "Balanced"}
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = radialOptics.diffusionLock >= 92 ? 72 : 90;
                  setRadialOptics({ diffusionLock: next });
                  setEngineField("geometryLock", next);
                }}
                className="rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]"
              >
                Toggle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Optics Refinement & Apply */}
      <div className="flex flex-1 items-center justify-end gap-2 sm:max-w-sm">
        <input
          type="text"
          value={quickPrompt}
          onChange={(e) => setQuickPrompt(e.target.value)}
          placeholder="Golden hour mist + strict basalt slab plinth…"
          className="h-8 min-w-0 flex-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-3 text-[11px] text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/90 dark:text-[#e8eff3] dark:placeholder:text-[#5f7f98]"
        />
        <button
          type="button"
          disabled={busy}
          data-testid="optics-apply-btn"
          onClick={applyQuickOpticsRender}
          className="ice-cta inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-3.5 text-[11px] font-bold disabled:opacity-60"
        >
          <Sparkles className="size-3.5" />
          {busy ? "Rendering" : "Apply"}
        </button>
      </div>
    </div>
  );
}

const CAMERA_PRESET_CYCLE: { id: CameraPreset3D; label: string }[] = [
  { id: "eye", label: "Eye-Level" },
  { id: "oblique", label: "3/4 Oblique" },
  { id: "aerial", label: "Aerial" },
  { id: "detail", label: "Close Detail" },
];

export function CameraOpticsBar() {
  const scene3d = useOriel((s) => s.scene3d);
  const setScene3DField = useOriel((s) => s.setScene3DField);
  const radialOptics = useOriel((s) => s.radialOptics);
  const setRadialOptics = useOriel((s) => s.setRadialOptics);
  const setEngineField = useOriel((s) => s.setEngineField);
  const frame = useOriel((s) => s.frame);
  const setFrame = useOriel((s) => s.setFrame);
  const nanoBanana = useOriel((s) => s.nanoBanana);
  const updateNanoBanana = useOriel((s) => s.updateNanoBanana);

  const currentCamIdx = CAMERA_PRESET_CYCLE.findIndex((p) => p.id === scene3d.cameraPreset);
  const currentCam = CAMERA_PRESET_CYCLE[currentCamIdx >= 0 ? currentCamIdx : 0];
  const nextCam = CAMERA_PRESET_CYCLE[(Math.max(0, currentCamIdx) + 1) % CAMERA_PRESET_CYCLE.length];

  const currentRatioIdx = RATIOS.indexOf(frame.ratio);
  const nextRatio = RATIOS[(Math.max(0, currentRatioIdx) + 1) % RATIOS.length];

  const currentModelIdx = NANO_BANANA_MODEL_OPTIONS.findIndex((m) => m.key === nanoBanana.requestedModel);
  const currentModel = NANO_BANANA_MODEL_OPTIONS[currentModelIdx >= 0 ? currentModelIdx : 0];
  const nextModel = NANO_BANANA_MODEL_OPTIONS[(Math.max(0, currentModelIdx) + 1) % NANO_BANANA_MODEL_OPTIONS.length];

  return (
    <div
      data-testid="camera-optics-bar"
      className="arctic-glass no-scrollbar flex shrink-0 items-center justify-between gap-2 overflow-x-auto rounded-xl border border-[#d1c5b8]/45 px-2.5 py-1 text-[10.5px] dark:border-[#a9bdc9]/20"
    >
      {/* Left: Camera Lens + Angle Preset + 2-Pt Tilt */}
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#725b38] dark:text-[#e8c98a]">
          <Camera className="size-3" />
          <span className="hidden sm:inline">Camera &amp; Optics</span>
        </span>

        <div
          className="inline-flex items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 dark:border-[#a9bdc9]/20 dark:bg-[#121c29]"
          role="group"
          aria-label="Lens focal length"
        >
          {([24, 35, 50, 85] as const).map((mm) => (
            <button
              key={mm}
              type="button"
              data-testid={`optics-lens-${mm}`}
              aria-pressed={scene3d.focalLength === mm}
              onClick={() => {
                setScene3DField("focalLength", mm);
                toast.success(`Lens set to ${mm}mm`);
              }}
              className={cn(
                "h-5.5 rounded-full px-1.5 font-mono text-[9.5px] font-semibold transition",
                scene3d.focalLength === mm
                  ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]",
              )}
            >
              {mm}mm
            </button>
          ))}
        </div>

        <button
          type="button"
          data-testid="optics-camera-preset-btn"
          onClick={() => {
            setScene3DField("cameraPreset", nextCam.id);
            toast.success(`Camera angle: ${nextCam.label}`);
          }}
          title="Cycle camera angle preset"
          className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 text-[10px] font-medium text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8eff3] dark:hover:border-[#e8c98a]"
        >
          <span className="text-[#7f766a] dark:text-[#a9bdc9]">View:</span>
          <span className="font-semibold">{currentCam.label}</span>
        </button>

        <button
          type="button"
          data-testid="optics-tilt-btn"
          aria-pressed={scene3d.twoPointTilt}
          onClick={() => setScene3DField("twoPointTilt", !scene3d.twoPointTilt)}
          title="Toggle 2-point architectural vertical shift"
          className={cn(
            "inline-flex h-6 shrink-0 items-center rounded-full border px-2 font-mono text-[9.5px] font-semibold transition",
            scene3d.twoPointTilt
              ? "border-[#c5a880] bg-[#c5a880]/20 text-[#513d1d] dark:border-[#e8c98a]/50 dark:bg-[#584411]/45 dark:text-[#e8c98a]"
              : "border-[#d1c5b8]/45 bg-white/70 text-[#4d463c] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#a9bdc9]",
          )}
        >
          2-Pt Tilt
        </button>
      </div>

      {/* Right: Solar Azimuth + EV/Vig + Diffusion Lock + Aspect/Res */}
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          data-testid="optics-solar-btn"
          onClick={() => {
            const nextAz = (radialOptics.solarAzimuth + 24) % 360;
            setRadialOptics({ solarAzimuth: nextAz });
            setScene3DField("sunAzimuth", nextAz);
          }}
          title="Step solar azimuth (+24°)"
          className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8c98a]"
        >
          <Sun className="size-3 text-[#725b38] dark:text-[#e8c98a]" />
          <span>{radialOptics.solarAzimuth}°·{radialOptics.solarElevation}°</span>
        </button>

        <button
          type="button"
          data-testid="optics-ev-btn"
          onClick={() => {
            const next = radialOptics.exposureEv >= 1.4 ? -0.4 : Number((radialOptics.exposureEv + 0.3).toFixed(1));
            setRadialOptics({ exposureEv: next });
          }}
          title="Cycle exposure compensation"
          className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#cfe3f0]"
        >
          <span>{radialOptics.exposureEv >= 0 ? "+" : ""}{radialOptics.exposureEv.toFixed(1)} EV</span>
          <span className="opacity-65">· {radialOptics.vignettePct}%</span>
        </button>

        <button
          type="button"
          data-testid="optics-lock-btn"
          onClick={() => {
            const next = radialOptics.diffusionLock >= 92 ? 72 : 90;
            setRadialOptics({ diffusionLock: next });
            setEngineField("geometryLock", next);
          }}
          title="Toggle diffusion geometry lock (Strict / Balanced)"
          className={cn(
            "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 font-mono text-[10px] font-semibold transition",
            radialOptics.diffusionLock >= 80
              ? "border-[#c5a880]/60 bg-[#c5a880]/15 text-[#513d1d] dark:border-[#cfe3f0]/35 dark:bg-[#202b38] dark:text-[#cde5ff]"
              : "border-[#d1c5b8]/45 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#a9bdc9]",
          )}
        >
          <Lock className="size-2.5" />
          <span>{radialOptics.diffusionLock}% {radialOptics.diffusionLock >= 80 ? "Strict" : "Bal"}</span>
        </button>

        <button
          type="button"
          data-testid="optics-ratio-btn"
          onClick={() => setFrame({ ...frame, ratio: nextRatio })}
          title="Cycle viewport aspect ratio"
          className="inline-flex h-6 shrink-0 items-center rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] font-semibold text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8eff3]"
        >
          {frame.ratio}
        </button>

        <button
          type="button"
          data-testid="optics-res-btn"
          onClick={() => {
            const nextRes = nanoBanana.resolution === "1K" ? "2K" : nanoBanana.resolution === "2K" ? "4K" : "1K";
            updateNanoBanana({ resolution: nextRes });
            setFrame({ ...frame, resolution: nextRes === "1K" ? "1k" : "2k" });
          }}
          title="Cycle output resolution (1K / 2K / 4K)"
          className="inline-flex h-6 shrink-0 items-center rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8c98a]"
        >
          {nanoBanana.resolution}
        </button>

        <button
          type="button"
          data-testid="optics-nb-model-btn"
          onClick={() => {
            updateNanoBanana({ requestedModel: nextModel.key });
            toast.success(`Engine: ${nextModel.label}`);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            window.dispatchEvent(new CustomEvent("oriel-open-orchestrator"));
          }}
          title={`${currentModel.label} — click to cycle Nano Banana model`}
          className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#c5a880]/55 bg-[#c5a880]/15 px-2 font-mono text-[10px] font-semibold text-[#513d1d] transition hover:border-[#725b38] dark:border-[#e8c98a]/35 dark:bg-[#16314A]/65 dark:text-[#e8c98a]"
        >
          <span>{currentModel.shortLabel}</span>
        </button>
      </div>
    </div>
  );
}


