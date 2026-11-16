import { useCallback, useEffect, useRef, useState } from "react";
import {
  Binary,
  BoxSelect,
  CheckCircle2,
  Crosshair,
  Download,
  Eraser,
  Eye,
  EyeOff,
  Loader2,
  Paintbrush,
  RotateCcw,
  ScanSearch,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import {
  runGroundedSam2Segment,
  runInteractiveSamMultiPointMask,
  type GroundedSamBox,
} from "@/lib/cv-pipeline";
import {
  encodeBinaryBitmapToOverlayRgba,
  encodeBinaryBitmapToRgba,
  estimateDataUrlBytes,
  extractBinaryBitmapFromRgba,
  type BinaryMaskStats,
} from "@/lib/grounded-sam2-binary";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

type SamClickMode = "include" | "exclude";

type GroundedSAM2ToolProps = {
  aspect: string;
  sourceUrl?: string | null;
  busy?: boolean;
  onGroundedSamSegment: (
    prompt: string,
    srcOverride?: string,
    clickPoint?: { xNorm: number; yNorm: number },
  ) => Promise<{
    boxes: GroundedSamBox[];
    fallback: boolean;
    model: string;
    warning?: string;
  }>;
  onSendToInpaint: (task: "replace" | "erase", instruction?: string) => void;
  onOpenInpaintWorkspace?: () => void;
  onSendToNodeEditor?: () => void;
  onSourceChange?: (dataUrl: string) => void;
};

const MASK_W = 1280;
const MASK_H = 720;

const ARCH_SEMANTIC_TARGETS = [
  { id: "windows", label: "Windows / Glazing", query: "windows and glazing" },
  { id: "facade", label: "Facade", query: "facade walls" },
  { id: "furniture", label: "Furniture", query: "sofa and interior furniture" },
  { id: "floor", label: "Flooring", query: "flooring surface" },
  { id: "foliage", label: "Foliage", query: "trees and foliage" },
  { id: "lighting", label: "Lighting", query: "pendant lights and fixtures" },
  { id: "roof", label: "Roof / Ceiling", query: "roof and ceiling" },
  { id: "sky", label: "Sky", query: "sky" },
] as const;

export function GroundedSAM2Tool({
  aspect,
  sourceUrl,
  busy = false,
  onGroundedSamSegment,
  onSendToInpaint,
  onOpenInpaintWorkspace,
  onSendToNodeEditor,
  onSourceChange,
}: GroundedSAM2ToolProps) {
  const engine = useOriel((s) => s.engine);
  const setEngineField = useOriel((s) => s.setEngineField);
  const setMaskDataUrl = useOriel((s) => s.setMaskDataUrl);
  const binaryMaskDataUrl = useOriel((s) => s.binaryMaskDataUrl);
  const binaryMaskStats = useOriel((s) => s.binaryMaskStats);
  const setBinaryMaskData = useOriel((s) => s.setBinaryMaskData);

  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const workingOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [clickMode, setClickMode] = useState<SamClickMode>("include");
  const [targetQuery, setTargetQuery] = useState(engine.samPrompt || "windows and glazing");
  const [threshold, setThreshold] = useState(engine.samThreshold || 45);
  const [posPoints, setPosPoints] = useState<Array<{ xNorm: number; yNorm: number }>>([]);
  const [negPoints, setNegPoints] = useState<Array<{ xNorm: number; yNorm: number }>>([]);
  const [detectedBoxes, setDetectedBoxes] = useState<GroundedSamBox[]>([]);
  const [activeBoxIdx, setActiveBoxIdx] = useState<number | null>(null);
  const [segmenting, setSegmenting] = useState(false);
  const [viewMode, setViewMode] = useState<"overlay" | "binary" | "original">("overlay");
  const [localStats, setLocalStats] = useState<BinaryMaskStats | null>(null);
  const [invertOutput, setInvertOutput] = useState(false);
  const [frameAspect, setFrameAspect] = useState<string>(aspect);

  const effectiveSource = sourceUrl || "/viz/t03-compact-living-room.jpg";

  useEffect(() => {
    setFrameAspect(aspect);
  }, [aspect, effectiveSource]);

  function ensureWorkingOverlay(): HTMLCanvasElement {
    if (!workingOverlayRef.current) {
      const c = document.createElement("canvas");
      c.width = MASK_W;
      c.height = MASK_H;
      workingOverlayRef.current = c;
    }
    return workingOverlayRef.current;
  }

  const redrawCanvas = useCallback(() => {
    const display = displayCanvasRef.current;
    if (!display) return;
    const ctx = display.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, MASK_W, MASK_H);
    if (viewMode === "original") return;

    if (viewMode === "binary" && binaryMaskDataUrl) {
      const binImg = new Image();
      binImg.onload = () => {
        ctx.clearRect(0, 0, MASK_W, MASK_H);
        ctx.drawImage(binImg, 0, 0, MASK_W, MASK_H);
      };
      binImg.src = binaryMaskDataUrl;
      return;
    }

    const layer = workingOverlayRef.current;
    if (layer) {
      ctx.drawImage(layer, 0, 0, MASK_W, MASK_H);
    }
  }, [viewMode, binaryMaskDataUrl]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  function commitBinaryMaskFromCanvas(invertFlag = invertOutput) {
    const layer = ensureWorkingOverlay();
    const lCtx = layer.getContext("2d", { willReadFrequently: true });
    if (!lCtx) return;

    const imgData = lCtx.getImageData(0, 0, MASK_W, MASK_H);
    const extracted = extractBinaryBitmapFromRgba(imgData.data, MASK_W, MASK_H, 24);
    setLocalStats(extracted);

    if (extracted.activePixels === 0) {
      setMaskDataUrl(null);
      setBinaryMaskData(null, null);
      return;
    }

    // Store transparent amber overlay mask in maskDataUrl for canvas display & blend
    const overlayRgba = encodeBinaryBitmapToOverlayRgba(extracted.bitmap, MASK_W, MASK_H);
    const overlayData = lCtx.createImageData(MASK_W, MASK_H);
    overlayData.data.set(overlayRgba);
    lCtx.putImageData(overlayData, 0, 0);
    const overlayUrl = layer.toDataURL("image/png");

    // Store strict 0/255 binary black-and-white mask PNG in binaryMaskDataUrl for downstream AI inpainting
    const bwCanvas = document.createElement("canvas");
    bwCanvas.width = MASK_W;
    bwCanvas.height = MASK_H;
    const bwCtx = bwCanvas.getContext("2d");
    if (bwCtx) {
      const bwRgba = encodeBinaryBitmapToRgba(extracted.bitmap, MASK_W, MASK_H, invertFlag);
      const bwImgData = bwCtx.createImageData(MASK_W, MASK_H);
      bwImgData.data.set(bwRgba);
      bwCtx.putImageData(bwImgData, 0, 0);
      const binaryPng = bwCanvas.toDataURL("image/png");
      setBinaryMaskData(binaryPng, {
        width: extracted.width,
        height: extracted.height,
        activePixels: extracted.activePixels,
        coveragePct: extracted.coveragePct,
      });
    }

    setMaskDataUrl(overlayUrl);
    redrawCanvas();
  }

  function applyMaskUrlToTool(maskUrl: string) {
    const layer = ensureWorkingOverlay();
    const ctx = layer.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    historyRef.current = [
      ...historyRef.current.slice(-10),
      ctx.getImageData(0, 0, MASK_W, MASK_H),
    ];

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, MASK_W, MASK_H);
      ctx.drawImage(img, 0, 0, MASK_W, MASK_H);
      commitBinaryMaskFromCanvas(invertOutput);
    };
    img.src = maskUrl;
  }

  async function runTextOrChipSegment(query: string, forcedBoxes?: GroundedSamBox[]) {
    const clean = query.trim() || "windows and glazing";
    setTargetQuery(clean);
    setEngineField("samPrompt", clean);
    setEngineField("samThreshold", threshold);
    setSegmenting(true);
    try {
      let boxes = forcedBoxes;
      let modelLabel = "grounded-sam-2";
      if (!boxes) {
        const detection = await onGroundedSamSegment(clean, effectiveSource);
        boxes = detection.boxes;
        modelLabel = detection.model;
        setDetectedBoxes(boxes);
        setActiveBoxIdx(null);
      }

      const segmented = await runGroundedSam2Segment({
        src: effectiveSource,
        prompt: clean,
        boxes,
        posPoints,
        negPoints,
        threshold,
      });
      applyMaskUrlToTool(segmented.maskDataUrl);
      if (segmented.boxes.length > 0 && !forcedBoxes) {
        setDetectedBoxes(segmented.boxes);
      }
      toast.success(`Binary mask generated for "${clean}" (${segmented.coveragePct}% · ${modelLabel})`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Grounded-SAM 2 segmentation failed.");
    } finally {
      setSegmenting(false);
    }
  }

  async function handleCanvasClick(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = displayCanvasRef.current;
    if (!canvas || segmenting) return;
    const rect = canvas.getBoundingClientRect();
    const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
    const yNorm = Math.max(0, Math.min(1, (e.clientY - rect.top) / Math.max(1, rect.height)));

    if (clickMode === "exclude" && posPoints.length === 0 && detectedBoxes.length === 0) {
      toast.message("Click on an element in Include (+) mode first before excluding regions.");
      return;
    }

    const nextPos = clickMode === "include" ? [...posPoints, { xNorm, yNorm }] : posPoints;
    const nextNeg = clickMode === "exclude" ? [...negPoints, { xNorm, yNorm }] : negPoints;
    setPosPoints(nextPos);
    setNegPoints(nextNeg);
    setSegmenting(true);

    try {
      let boxesToUse = detectedBoxes;
      let activeLabel = targetQuery;

      if (clickMode === "include" && boxesToUse.length === 0) {
        const detection = await onGroundedSamSegment("architectural element", effectiveSource, {
          xNorm,
          yNorm,
        });
        if (!detection.fallback && detection.boxes.length > 0) {
          boxesToUse = detection.boxes;
          activeLabel = detection.boxes[0]?.label || targetQuery;
          setDetectedBoxes(boxesToUse);
          setActiveBoxIdx(0);
          setTargetQuery(activeLabel);
        }
      }

      const result =
        boxesToUse.length > 0
          ? await runGroundedSam2Segment({
              src: effectiveSource,
              prompt: activeLabel,
              boxes:
                activeBoxIdx !== null && boxesToUse[activeBoxIdx]
                  ? [boxesToUse[activeBoxIdx]]
                  : boxesToUse,
              posPoints: nextPos,
              negPoints: nextNeg,
              threshold,
            })
          : await runInteractiveSamMultiPointMask({
              src: effectiveSource,
              posPoints: nextPos,
              negPoints: nextNeg,
              threshold,
            });

      applyMaskUrlToTool(result.maskDataUrl);
      toast.success(`Binary mask updated (${result.coveragePct}% foreground)`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Click-to-mask segmentation failed.");
    } finally {
      setSegmenting(false);
    }
  }

  function handleUndo() {
    const prev = historyRef.current.pop();
    const layer = ensureWorkingOverlay();
    const ctx = layer.getContext("2d", { willReadFrequently: true });
    if (!prev || !ctx) return;
    ctx.putImageData(prev, 0, 0);
    commitBinaryMaskFromCanvas(invertOutput);
  }

  function handleClear() {
    const layer = ensureWorkingOverlay();
    const ctx = layer.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    historyRef.current = [
      ...historyRef.current.slice(-10),
      ctx.getImageData(0, 0, MASK_W, MASK_H),
    ];
    ctx.clearRect(0, 0, MASK_W, MASK_H);
    setPosPoints([]);
    setNegPoints([]);
    setDetectedBoxes([]);
    setActiveBoxIdx(null);
    setLocalStats(null);
    setMaskDataUrl(null);
    setBinaryMaskData(null, null);
    redrawCanvas();
  }

  function handleToggleInvert() {
    const next = !invertOutput;
    setInvertOutput(next);
    commitBinaryMaskFromCanvas(next);
  }

  function handleDownloadBinaryMask() {
    if (!binaryMaskDataUrl) {
      toast.message("Segment an object first to generate a binary mask PNG.");
      return;
    }
    const link = document.createElement("a");
    link.href = binaryMaskDataUrl;
    link.download = `oriel-sam2-binary-mask-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Downloaded binary mask image (PNG)");
  }

  const maskBytes = estimateDataUrlBytes(binaryMaskDataUrl);
  const stats = localStats ?? (binaryMaskStats ? { ...binaryMaskStats, totalPixels: MASK_W * MASK_H, bbox: null } : null);

  return (
    <div data-testid="grounded-sam2-tool" className="w-full overflow-hidden bg-[#161310] text-[#f6efe4]">
      {/* Header & Architectural Object Semantic Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#14110f] px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-[#e7c27a] uppercase">
            <ScanSearch className="size-3.5" /> Grounded-SAM 2 Tool
          </span>
          {ARCH_SEMANTIC_TARGETS.map((item) => {
            const active = targetQuery.toLowerCase() === item.query.toLowerCase() && detectedBoxes.length > 0;
            return (
              <button
                key={item.id}
                type="button"
                disabled={segmenting || busy}
                onClick={() => void runTextOrChipSegment(item.query)}
                className={cn(
                  "inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition disabled:opacity-50",
                  active
                    ? "gold-fill border-transparent text-[#2a1c0c]"
                    : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void runTextOrChipSegment(targetQuery);
          }}
          className="flex flex-wrap items-center gap-1.5"
        >
          <input
            type="text"
            aria-label="Semantic segmentation target"
            value={targetQuery}
            onChange={(e) => setTargetQuery(e.target.value)}
            placeholder="Target (e.g. windows, facade, sofa)..."
            className="h-7 w-44 rounded-full border border-white/20 bg-black/45 px-2.5 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
          />
          <button
            type="submit"
            disabled={segmenting || busy}
            className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a]/60 bg-[#d4b06a]/15 px-3 text-[11px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25 disabled:opacity-50"
          >
            {segmenting ? <Loader2 className="size-3 animate-spin" /> : <BoxSelect className="size-3" />}
            Segment
          </button>
        </form>
      </div>

      {/* Main Split: Interactive Click Segmentation Canvas + Binary Mask Data Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_276px]">
        {/* Interactive Segmentation Canvas */}
        <div className="relative flex min-h-[320px] w-full items-center justify-center bg-[#1c1915] p-2 lg:min-h-[460px]">
          <div
            className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-black"
            style={{ aspectRatio: frameAspect, maxHeight: "56vh" }}
          >
            <img
              src={effectiveSource}
              alt="Architectural segmentation canvas"
              onLoad={(e) => {
                const nw = e.currentTarget.naturalWidth;
                const nh = e.currentTarget.naturalHeight;
                if (nw > 0 && nh > 0) setFrameAspect(`${nw} / ${nh}`);
              }}
              className="pointer-events-none block h-full w-full object-fill"
            />

            <canvas
              ref={displayCanvasRef}
              data-testid="sam2-interactive-canvas"
              width={MASK_W}
              height={MASK_H}
              onPointerDown={handleCanvasClick}
              className={cn(
                "absolute inset-0 z-10 block h-full w-full touch-none",
                clickMode === "include" ? "cursor-crosshair" : "cursor-not-allowed",
              )}
            />

            {/* Detected GroundingDINO / Gemini Bounding Boxes */}
            {viewMode !== "original" && detectedBoxes.length > 0 ? (
              <div className="pointer-events-none absolute inset-0 z-20">
                {detectedBoxes.map((box, idx) => {
                  const [ymin, xmin, ymax, xmax] = box.box_2d;
                  const focused = activeBoxIdx === idx;
                  return (
                    <button
                      key={`${box.label}-${idx}`}
                      type="button"
                      onClick={() => {
                        setActiveBoxIdx(idx);
                        void runTextOrChipSegment(box.label, [box]);
                      }}
                      style={{
                        top: `${ymin / 10}%`,
                        left: `${xmin / 10}%`,
                        height: `${Math.max(4, (ymax - ymin) / 10)}%`,
                        width: `${Math.max(4, (xmax - xmin) / 10)}%`,
                      }}
                      className={cn(
                        "pointer-events-auto absolute rounded-md border-2 border-dashed transition",
                        focused ? "border-[#e7c27a] bg-[#e7c27a]/10" : "border-[#e7c27a]/65 hover:border-[#e7c27a]",
                      )}
                    >
                      <span className="pointer-events-none absolute -top-5 left-0 whitespace-nowrap rounded-full bg-[#14110f]/90 px-2 py-0.5 font-mono text-[9px] text-[#e7c27a] shadow">
                        {box.label} · {Math.round(box.confidence * 100)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* Point Seeds (+ Include / - Exclude) */}
            {viewMode !== "original" && (posPoints.length > 0 || negPoints.length > 0) ? (
              <div className="pointer-events-none absolute inset-0 z-20">
                {posPoints.map((pt, i) => (
                  <span
                    key={`inc-${i}`}
                    style={{ left: `${pt.xNorm * 100}%`, top: `${pt.yNorm * 100}%` }}
                    className="absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-emerald-500 text-[10px] font-bold text-white shadow"
                  >
                    +
                  </span>
                ))}
                {negPoints.map((pt, i) => (
                  <span
                    key={`exc-${i}`}
                    style={{ left: `${pt.xNorm * 100}%`, top: `${pt.yNorm * 100}%` }}
                    className="absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-rose-500 text-[10px] font-bold text-white shadow"
                  >
                    -
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Canvas Top Status Pill */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setViewMode((v) =>
                  v === "overlay" ? "binary" : v === "binary" ? "original" : "overlay",
                )
              }
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/20 bg-[#14110f]/90 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]"
            >
              {viewMode === "binary" ? (
                <>
                  <Binary className="size-3 text-emerald-300" /> View: Binary 0/255
                </>
              ) : viewMode === "original" ? (
                <>
                  <Eye className="size-3 text-[#e7c27a]" /> View: Original
                </>
              ) : (
                <>
                  <EyeOff className="size-3 text-[#e7c27a]" /> View: Overlay
                </>
              )}
            </button>
            {stats ? (
              <span
                data-testid="sam2-coverage-badge"
                className="rounded-full border border-emerald-400/40 bg-[#14110f]/90 px-2.5 py-0.5 font-mono text-[10px] text-emerald-200"
              >
                Mask {stats.coveragePct}%
              </span>
            ) : null}
          </div>

          <div className="pointer-events-none absolute top-3 right-3 z-20 rounded-full border border-white/15 bg-[#14110f]/90 px-3 py-1 text-[11px] text-[#e4dacb]">
            {clickMode === "include"
              ? "Click any element (window, facade, sofa) to mask"
              : "Click region to subtract from binary mask"}
          </div>
        </div>

        {/* Binary Image Data Inspector & Downstream Inpaint Export Panel */}
        <aside className="flex flex-col justify-between gap-3 border-t border-white/10 bg-[#14110f] p-3 text-xs lg:border-t-0 lg:border-l">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-[#e7c27a] uppercase">
                <Binary className="size-3.5" /> Binary Mask Output
              </span>
              {binaryMaskDataUrl ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300">
                  <CheckCircle2 className="size-3" /> Ready
                </span>
              ) : (
                <span className="text-[10px] text-[#b9aa95]">No mask yet</span>
              )}
            </div>

            {/* Binary White-on-Black Mask Image Data Preview */}
            <div className="overflow-hidden rounded-xl border border-white/15 bg-black">
              {binaryMaskDataUrl ? (
                <img
                  data-testid="sam2-binary-mask-preview"
                  src={binaryMaskDataUrl}
                  alt="Stored binary image mask"
                  className="aspect-video w-full object-contain"
                />
              ) : (
                <div className="grid aspect-video place-items-center px-3 text-center text-[11px] text-[#9f917f]">
                  Click any architectural element on the canvas to encode binary mask data.
                </div>
              )}
            </div>

            {/* Binary Pixel Telemetry */}
            <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2 font-mono text-[10px] text-[#cbbba6]">
              <div>
                <div className="text-[9px] text-[#9f917f] uppercase">Encoding</div>
                <div className="text-[#f6efe4]">1-bit PNG (0/255)</div>
              </div>
              <div>
                <div className="text-[9px] text-[#9f917f] uppercase">Coverage</div>
                <div className="text-[#e7c27a]">{stats ? `${stats.coveragePct}%` : "0%"}</div>
              </div>
              <div>
                <div className="text-[9px] text-[#9f917f] uppercase">Active Pixels</div>
                <div className="text-[#f6efe4]">{stats ? stats.activePixels.toLocaleString() : "0"}</div>
              </div>
              <div>
                <div className="text-[9px] text-[#9f917f] uppercase">Payload Size</div>
                <div className="text-[#f6efe4]">
                  {maskBytes > 0 ? `${(maskBytes / 1024).toFixed(1)} KB` : "0 KB"}
                </div>
              </div>
            </div>

            {/* Click Mode & Precision Threshold */}
            <div className="space-y-2 border-t border-white/10 pt-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-pressed={clickMode === "include"}
                  onClick={() => setClickMode("include")}
                  className={cn(
                    "inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-full border text-[11px] font-medium",
                    clickMode === "include"
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                      : "border-white/15 bg-white/5 text-[#e4dacb]",
                  )}
                >
                  <Crosshair className="size-3" /> Include (+)
                </button>
                <button
                  type="button"
                  aria-pressed={clickMode === "exclude"}
                  onClick={() => setClickMode("exclude")}
                  className={cn(
                    "inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-full border text-[11px] font-medium",
                    clickMode === "exclude"
                      ? "border-rose-400 bg-rose-500/20 text-rose-200"
                      : "border-white/15 bg-white/5 text-[#e4dacb]",
                  )}
                >
                  <Eraser className="size-3" /> Exclude (-)
                </button>
              </div>

              <label className="flex items-center justify-between gap-2 text-[11px] text-[#cbbba6]">
                <span className="inline-flex items-center gap-1">
                  <SlidersHorizontal className="size-3 text-[#e7c27a]" /> Sensitivity
                </span>
                <input
                  type="range"
                  min={15}
                  max={85}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="h-1 w-24 accent-[#d4b06a]"
                />
                <span className="w-6 text-right font-mono text-[10px] text-[#e7c27a]">{threshold}</span>
              </label>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleInvert}
                  disabled={!binaryMaskDataUrl}
                  aria-pressed={invertOutput}
                  className={cn(
                    "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] disabled:opacity-40",
                    invertOutput
                      ? "gold-fill border-transparent font-semibold text-[#2a1c0c]"
                      : "border-white/15 bg-white/5 text-[#e4dacb]",
                  )}
                >
                  Invert 0/255
                </button>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb]"
                >
                  <RotateCcw className="size-3" /> Undo
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb]"
                >
                  <Trash2 className="size-3" /> Clear
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb]"
                >
                  <Upload className="size-3" /> Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(ev) => {
                    const f = ev.target.files?.[0];
                    if (f && onSourceChange) {
                      void readImage(f, 1280).then((url) => onSourceChange(url));
                    }
                    ev.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Downstream AI Inpainting & Node Pipeline Actions */}
          <div className="space-y-1.5 border-t border-white/10 pt-2.5">
            <button
              type="button"
              disabled={!binaryMaskDataUrl || busy}
              onClick={() => onSendToInpaint("replace", `Replace ${targetQuery} with architectural finish`)}
              className="gold-fill flex h-8 w-full items-center justify-center gap-1.5 rounded-full text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-45"
            >
              <Sparkles className="size-3.5" /> Replace Texture in AI Inpaint
            </button>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                disabled={!binaryMaskDataUrl || busy}
                onClick={() => onSendToInpaint("erase", `Remove ${targetQuery}`)}
                className="flex h-7 items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-[10px] text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-45"
              >
                <Paintbrush className="size-3" /> Remove Object
              </button>
              <button
                type="button"
                disabled={!binaryMaskDataUrl}
                onClick={handleDownloadBinaryMask}
                className="flex h-7 items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-[10px] text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-45"
              >
                <Download className="size-3" /> Save Binary PNG
              </button>
            </div>
            {onOpenInpaintWorkspace ? (
              <button
                type="button"
                disabled={!binaryMaskDataUrl}
                onClick={onOpenInpaintWorkspace}
                className="flex h-7 w-full items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-medium text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-45"
              >
                <Paintbrush className="size-3 text-[#e7c27a]" /> Edit Mask in AI Inpaint Brush
              </button>
            ) : null}
            {onSendToNodeEditor ? (
              <button
                type="button"
                disabled={!binaryMaskDataUrl}
                onClick={onSendToNodeEditor}
                className="flex h-7 w-full items-center justify-center gap-1 rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 text-[10px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25 disabled:opacity-45"
              >
                <Workflow className="size-3" /> Use Binary Mask in Node Editor
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
