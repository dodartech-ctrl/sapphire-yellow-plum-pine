import { useEffect, useRef, useState } from "react";
import { Box, Crosshair, Grid, Layers, Loader2, Paintbrush, Pencil, ScanLine, Sparkles, Upload } from "lucide-react";
import { detectFloorPlanWallsFromGrid, type FloorPlanBlueprint } from "@/lib/archviz-suite";
import {
  MATERIAL_ID_CLASSES,
  extractFloorPlanGrid,
  runAnnotatorPass,
  runDepthAnythingPass,
  runGroundedSamMask,
  runMaterialIdPass,
  runSam2RegionSegment,
} from "@/lib/cv-pipeline";
import { ANNOTATOR_MODES, type AnnotatorMode } from "@/lib/engines";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CvMode = "annotator" | "depth" | "sam" | "material-id" | "floorplan";

type CvPreprocessorStageProps = {
  aspect: string;
  sourceUrl: string;
  onSendMapToSketch: (mapUrl: string) => void;
  onSendMaskToInpaint: (maskUrl: string, label: string) => void;
  onLockAndRender: () => void;
  onExtrudeFloorPlan?: () => void;
};

const SAM_CONCEPTS = ["facade glazing", "roof", "water pool", "foliage", "sky", "flooring"];

function drawFloorPlanOverlayPreview(src: string, bp: FloorPlanBlueprint): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = 720;
      const h = 480;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(src);
        return;
      }
      ctx.fillStyle = "#1a1714";
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 0.35;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalAlpha = 1;

      const sx = w / bp.footprintWidth;
      const sz = h / bp.footprintDepth;
      for (const wall of bp.walls) {
        const px = (wall.x + bp.footprintWidth * 0.5) * sx;
        const pz = (wall.z + bp.footprintDepth * 0.5) * sz;
        const ww = Math.max(6, wall.width * sx);
        const wd = Math.max(6, wall.depth * sz);
        ctx.fillStyle = wall.hasDoorGap ? "rgba(74, 222, 128, 0.85)" : "rgba(231, 194, 122, 0.9)";
        ctx.fillRect(px - ww * 0.5, pz - wd * 0.5, ww, wd);
      }
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export function CvPreprocessorStage({
  aspect,
  sourceUrl,
  onSendMapToSketch,
  onSendMaskToInpaint,
  onLockAndRender,
  onExtrudeFloorPlan,
}: CvPreprocessorStageProps) {
  const engine = useOriel((state) => state.engine);
  const setEngineField = useOriel((state) => state.setEngineField);
  const setScene3DField = useOriel((state) => state.setScene3DField);
  const floorPlanBlueprint = useOriel((state) => state.floorPlanBlueprint);
  const setFloorPlanBlueprint = useOriel((state) => state.setFloorPlanBlueprint);
  const setConditioningChannel = useOriel((state) => state.setConditioningChannel);

  const [cvMode, setCvMode] = useState<CvMode>("annotator");
  const [samEngine, setSamEngine] = useState<"sam2" | "grounded">("sam2");
  const [depthHeatmap, setDepthHeatmap] = useState(true);
  const [depthBias, setDepthBias] = useState(50);
  const [samPoint, setSamPoint] = useState<{ xNorm: number; yNorm: number } | null>(null);
  const [planSrcOverride, setPlanSrcOverride] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string>(sourceUrl);
  const [samMaskUrl, setSamMaskUrl] = useState<string | null>(null);
  const [samCoverage, setSamCoverage] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const imgBoxRef = useRef<HTMLDivElement>(null);
  const planFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function compute() {
      setProcessing(true);
      try {
        if (cvMode === "annotator") {
          const mode: AnnotatorMode = engine.annotatorMode === "none" ? "mlsd" : engine.annotatorMode;
          const res = await runAnnotatorPass(sourceUrl, mode, engine.annotatorThreshold);
          if (!cancelled) {
            setOutputUrl(res.dataUrl);
            setConditioningChannel("annotator", res.dataUrl);
          }
        } else if (cvMode === "depth") {
          const res = await runDepthAnythingPass(sourceUrl, depthHeatmap, depthBias);
          if (!cancelled) {
            setOutputUrl(res.dataUrl);
            setConditioningChannel("depth", res.dataUrl);
          }
        } else if (cvMode === "material-id") {
          const res = await runMaterialIdPass(sourceUrl);
          if (!cancelled) setOutputUrl(res.dataUrl);
        } else if (cvMode === "floorplan") {
          const planInput = planSrcOverride ?? sourceUrl;
          const { mask, cols, rows } = await extractFloorPlanGrid(planInput);
          const bp = detectFloorPlanWallsFromGrid(mask, cols, rows);
          const overlayUrl = await drawFloorPlanOverlayPreview(planInput, bp);
          if (!cancelled) {
            setFloorPlanBlueprint(bp);
            setOutputUrl(overlayUrl);
          }
        } else if (samEngine === "sam2") {
          const pt = samPoint ?? { xNorm: 0.5, yNorm: 0.5 };
          const res = await runSam2RegionSegment({
            src: sourceUrl,
            point: pt,
            threshold: engine.samThreshold,
          });
          if (!cancelled) {
            setOutputUrl(res.previewUrl);
            setSamMaskUrl(res.maskDataUrl);
            setSamCoverage(res.coveragePct);
          }
        } else {
          const res = await runGroundedSamMask({
            src: sourceUrl,
            prompt: engine.samPrompt || "facade glazing",
            point: samPoint,
            threshold: engine.samThreshold,
          });
          if (!cancelled) {
            setOutputUrl(res.previewUrl);
            setSamMaskUrl(res.maskDataUrl);
            setSamCoverage(res.coveragePct);
          }
        }
      } catch {
        if (!cancelled) setOutputUrl(sourceUrl);
      } finally {
        if (!cancelled) setProcessing(false);
      }
    }
    void compute();
    return () => {
      cancelled = true;
    };
  }, [
    sourceUrl,
    planSrcOverride,
    cvMode,
    samEngine,
    engine.annotatorMode,
    engine.annotatorThreshold,
    depthHeatmap,
    depthBias,
    engine.samPrompt,
    engine.samThreshold,
    samPoint,
    setConditioningChannel,
    setFloorPlanBlueprint,
  ]);

  function handleCanvasClick(event: React.MouseEvent<HTMLDivElement>) {
    if (cvMode !== "sam" || !imgBoxRef.current) return;
    const rect = imgBoxRef.current.getBoundingClientRect();
    const xNorm = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const yNorm = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
    setSamPoint({ xNorm, yNorm });
  }

  function handleExtrudeTo3D() {
    setScene3DField("preset", "plan-extrude");
    onExtrudeFloorPlan?.();
    toast.success("Extruded floor plan walls into 3D Viewport!");
  }

  return (
    <div
      data-testid="cv-preprocessor-stage"
      className="relative flex w-full flex-col overflow-hidden bg-[#181512]"
      style={{ aspectRatio: aspect, minHeight: "380px", maxHeight: "64vh" }}
    >
      <div
        ref={imgBoxRef}
        onClick={handleCanvasClick}
        className={cn(
          "relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 pb-32",
          cvMode === "sam" && "cursor-crosshair",
        )}
      >
        <img
          src={outputUrl}
          alt="CV Preprocessor output"
          className="max-h-full max-w-full rounded-xl object-contain shadow-lg"
        />

        {cvMode === "sam" && samPoint ? (
          <span
            className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e7c27a] bg-[#e7c27a]/35 shadow-md"
            style={{ left: `${samPoint.xNorm * 100}%`, top: `${samPoint.yNorm * 100}%` }}
          />
        ) : null}

        {processing ? (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#14110f]/90 px-3 py-1 text-[11px] text-[#e7c27a]">
            <Loader2 className="size-3.5 animate-spin" /> Processing map…
          </div>
        ) : null}

        <div className="absolute top-3 right-3 rounded-full bg-[#14110f]/90 px-3 py-1 font-mono text-[10px] text-[#e4dacb]">
          {cvMode === "annotator"
            ? `Annotators · ${(engine.annotatorMode === "none" ? "mlsd" : engine.annotatorMode).toUpperCase()}`
            : cvMode === "depth"
              ? `Depth-Anything-V2 · ${depthHeatmap ? "Inferno" : "Z-Gray"}`
              : cvMode === "material-id"
                ? "Material ID Map · 8 Classes"
                : cvMode === "floorplan"
                  ? `Plan Detector · ${floorPlanBlueprint?.walls.length ?? 0} walls`
                  : `${samEngine === "sam2" ? "SAM-2 Region" : "Grounded-SAM"}${samCoverage !== null ? ` · ${samCoverage}%` : ""}`}
        </div>
      </div>

      {/* Bottom Controls Dock */}
      <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-white/15 bg-[#14110f]/95 p-3 text-xs text-[#f6efe4] shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-white/5 p-0.5">
            {(
              [
                ["annotator", "Annotators", ScanLine],
                ["depth", "Depth-Anything-V2", Layers],
                ["sam", "SAM-2 / Grounded", Crosshair],
                ["material-id", "Material ID", Grid],
                ["floorplan", "Plan → 3D Walls", Box],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setCvMode(id)}
                className={cn(
                  "inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium transition",
                  cvMode === id ? "gold-fill text-[#2a1c0c]" : "text-[#d5cab9] hover:text-white",
                )}
              >
                <Icon className="size-3" /> {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {cvMode === "floorplan" ? (
              <button
                type="button"
                onClick={handleExtrudeTo3D}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-[#e7c27a]/60 bg-[#e7c27a]/15 px-3 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#e7c27a]/25"
              >
                <Box className="size-3.5" /> Extrude in 3D Viewport
              </button>
            ) : cvMode === "sam" && samMaskUrl ? (
              <button
                type="button"
                onClick={() =>
                  onSendMaskToInpaint(
                    samMaskUrl,
                    samEngine === "sam2" ? "SAM-2 clicked region" : engine.samPrompt || "selected segment",
                  )
                }
                className="inline-flex h-8 items-center gap-1 rounded-full border border-[#e7c27a]/60 bg-[#e7c27a]/15 px-3 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#e7c27a]/25"
              >
                <Paintbrush className="size-3.5" /> Segment → Inpaint Mask
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSendMapToSketch(outputUrl)}
                className="inline-flex h-8 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]"
              >
                <Pencil className="size-3.5 text-[#e7c27a]" /> Map → Sketch Trace
              </button>
            )}
            <button
              type="button"
              onClick={onLockAndRender}
              className="gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c]"
            >
              <Sparkles className="size-3.5" /> Render with Conditioning
            </button>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-2.5">
          {cvMode === "annotator" ? (
            <>
              <div className="flex flex-wrap items-center gap-1">
                {ANNOTATOR_MODES.filter((m) => m.id !== "none").map((m) => {
                  const active = (engine.annotatorMode === "none" ? "mlsd" : engine.annotatorMode) === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setEngineField("annotatorMode", m.id)}
                      className={cn(
                        "h-7 rounded-full border px-2.5 text-[11px] transition",
                        active ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#dfd5c6]",
                      )}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <label className="ml-auto flex items-center gap-2">
                <span className="text-[11px] text-[#cbbba6]">Edge Gain</span>
                <input
                  type="range"
                  min={15}
                  max={100}
                  value={engine.annotatorThreshold}
                  onChange={(e) => setEngineField("annotatorThreshold", Number(e.target.value))}
                  className="h-1.5 w-24 accent-[#d4b06a]"
                />
                <span className="w-8 text-right font-mono text-[10px]">{engine.annotatorThreshold}%</span>
              </label>
            </>
          ) : cvMode === "depth" ? (
            <>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDepthHeatmap(true)}
                  className={cn(
                    "h-7 rounded-full border px-2.5 text-[11px]",
                    depthHeatmap ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#dfd5c6]",
                  )}
                >
                  Inferno Heatmap
                </button>
                <button
                  type="button"
                  onClick={() => setDepthHeatmap(false)}
                  className={cn(
                    "h-7 rounded-full border px-2.5 text-[11px]",
                    !depthHeatmap ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#dfd5c6]",
                  )}
                >
                  Z-Buffer Grayscale
                </button>
              </div>
              <label className="ml-auto flex items-center gap-2">
                <span className="text-[11px] text-[#cbbba6]">Near-Plane Bias</span>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={depthBias}
                  onChange={(e) => setDepthBias(Number(e.target.value))}
                  className="h-1.5 w-24 accent-[#d4b06a]"
                />
                <span className="w-8 text-right font-mono text-[10px]">{depthBias}%</span>
              </label>
            </>
          ) : cvMode === "material-id" ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-[#cbbba6]">Material ID Legend:</span>
              {MATERIAL_ID_CLASSES.map((cls) => (
                <span key={cls.id} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-[#e4dacb]">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: cls.hex }} />
                  {cls.label}
                </span>
              ))}
            </div>
          ) : cvMode === "floorplan" ? (
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => planFileRef.current?.click()}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#d4b06a]"
                >
                  <Upload className="size-3 text-[#e7c27a]" /> Upload 2D Plan
                </button>
                <input
                  ref={planFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void readImage(f, 1280).then((url) => setPlanSrcOverride(url));
                    e.target.value = "";
                  }}
                />
                <span className="text-[11px] text-[#cbbba6]">
                  {floorPlanBlueprint?.summary ?? "Scanning floor plan dark linework for walls & openings…"}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#e7c27a]">
                {floorPlanBlueprint?.roomCount ?? 0} Rooms · {floorPlanBlueprint?.walls.length ?? 0} Walls
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1 rounded-full bg-white/5 p-0.5">
                <button
                  type="button"
                  onClick={() => setSamEngine("sam2")}
                  className={cn(
                    "h-6 rounded-full px-2 text-[10px] font-medium",
                    samEngine === "sam2" ? "gold-fill text-[#2a1c0c]" : "text-[#cbbba6]",
                  )}
                >
                  SAM-2 Click Region
                </button>
                <button
                  type="button"
                  onClick={() => setSamEngine("grounded")}
                  className={cn(
                    "h-6 rounded-full px-2 text-[10px] font-medium",
                    samEngine === "grounded" ? "gold-fill text-[#2a1c0c]" : "text-[#cbbba6]",
                  )}
                >
                  Grounded-SAM Text
                </button>
              </div>

              {samEngine === "grounded" ? (
                <>
                  <input
                    type="text"
                    value={engine.samPrompt}
                    onChange={(e) => {
                      setSamPoint(null);
                      setEngineField("samPrompt", e.target.value);
                    }}
                    placeholder="Grounded-SAM target..."
                    className="h-7 w-40 rounded-full border border-white/20 bg-black/40 px-3 text-[11px] text-white outline-none focus:border-[#d4b06a]"
                  />
                  <div className="flex flex-wrap items-center gap-1">
                    {SAM_CONCEPTS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setSamPoint(null);
                          setEngineField("samPrompt", c);
                        }}
                        className={cn(
                          "h-6 rounded-full border px-2 text-[10px]",
                          engine.samPrompt === c && !samPoint
                            ? "gold-fill border-transparent text-[#2a1c0c]"
                            : "border-white/15 bg-white/5 text-[#cbbba6]",
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <span className="text-[11px] text-[#cbbba6]">
                  Click anywhere on the image above to flood-segment the contiguous object boundary.
                </span>
              )}

              <label className="ml-auto flex items-center gap-1.5">
                <span className="text-[11px] text-[#cbbba6]">Sensitivity</span>
                <input
                  type="range"
                  min={15}
                  max={90}
                  value={engine.samThreshold}
                  onChange={(e) => setEngineField("samThreshold", Number(e.target.value))}
                  className="h-1.5 w-20 accent-[#d4b06a]"
                />
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
