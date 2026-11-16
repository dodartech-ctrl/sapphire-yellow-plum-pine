import { useCallback, useEffect, useRef, useState } from "react";
import {
  BoxSelect,
  Crosshair,
  Download,
  Eraser,
  Expand,
  Eye,
  EyeOff,
  FlipHorizontal,
  Loader2,
  Paintbrush,
  RotateCcw,
  ScanSearch,
  Scissors,
  Sparkles,
  Trash2,
  Type,
  Upload,
  UserCheck,
  X,
} from "lucide-react";
import {
  runGroundedSam2Segment,
  runInteractiveSamMultiPointMask,
  type GroundedSamBox,
} from "@/lib/cv-pipeline";
import {
  IOPAINT_MODELS,
  IOPAINT_TASKS,
  type IopaintModel,
  type IopaintOutpaintPad,
  type IopaintTaskMode,
} from "@/lib/engines";
import { readImage } from "@/lib/read-image";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type IOPaintWorkspaceProps = {
  aspect: string;
  backgroundUrl?: string | null;
  initialBufferUrl?: string | null;
  initialSamMode?: SamPointMode;
  busy?: boolean;
  onSaveBuffer: (dataUrl: string | null) => void;
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
  onApplyMaskInpaint: (instruction: string) => void;
  onApplyDirectionalOutpaint: (pad: IopaintOutpaintPad) => void;
  onApplyRemoveBg: (outputMode: "cutout" | "mask") => void;
  onApplyRestoreFaces: () => void;
  onApplyEsrganPlugin: () => void;
  onLoadSampleSource: (url: string) => void;
};

type MaskTool = "brush" | "eraser";
type SamPointMode = "off" | "pos" | "neg";

const CANVAS_W = 1280;
const CANVAS_H = 720;

const GROUNDED_SAM2_OBJECTS = [
  { id: "facade", label: "Facade", query: "facade walls" },
  { id: "glazing", label: "Glazing", query: "windows and glazing" },
  { id: "sofa", label: "Sofa / Furniture", query: "sofa and furniture" },
  { id: "floor", label: "Flooring", query: "flooring surface" },
  { id: "foliage", label: "Foliage", query: "trees and foliage" },
  { id: "lighting", label: "Lighting", query: "pendant lights and fixtures" },
  { id: "roof", label: "Roof", query: "roof and ceiling" },
  { id: "sky", label: "Sky", query: "sky" },
] as const;

const TEXTURE_REPLACE_SWATCHES = [
  { id: "travertine", label: "Honed Travertine", prompt: "Honed travertine limestone slabs" },
  { id: "oak", label: "Fluted Oak", prompt: "Warm fluted white oak timber panelling" },
  { id: "concrete", label: "Board Concrete", prompt: "Architectural board-formed concrete" },
  { id: "brick", label: "Nordic Brick", prompt: "Hand-laid Nordic textured brick" },
  { id: "bronze", label: "Brushed Bronze", prompt: "Architectural brushed bronze cladding" },
  { id: "glass", label: "Low-E Glaze", prompt: "Clear low-E curtain wall glazing" },
] as const;

const EXAMPLE_INSERT_SWATCHES = [
  { id: "oak-lounge", label: "Warm Oak Lounge", url: "/viz/t03-compact-living-room.jpg" },
  { id: "courtyard-villa", label: "Courtyard Timber", url: "/viz/t05-subtropical-home.jpg" },
  { id: "brass-loft", label: "Loft Fixture", url: "/viz/p02-loft-after.jpg" },
];

function createMaskCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = CANVAS_W;
  c.height = CANVAS_H;
  return c;
}

export function IOPaintWorkspace({
  aspect,
  backgroundUrl,
  initialBufferUrl,
  initialSamMode = "off",
  busy = false,
  onSaveBuffer,
  onGroundedSamSegment,
  onApplyMaskInpaint,
  onApplyDirectionalOutpaint,
  onApplyRemoveBg,
  onApplyRestoreFaces,
  onApplyEsrganPlugin,
  onLoadSampleSource,
}: IOPaintWorkspaceProps) {
  const engine = useOriel((state) => state.engine);
  const setEngineField = useOriel((state) => state.setEngineField);
  const upload = useOriel((state) => state.upload);

  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenMaskRef = useRef<HTMLCanvasElement | null>(null);
  const undoStackRef = useRef<ImageData[]>([]);
  const drawingRef = useRef(false);
  const lastSavedBufferRef = useRef<string | null>(null);

  const [maskTool, setMaskTool] = useState<MaskTool>("brush");
  const [strokeSize, setStrokeSize] = useState(28);
  const [maskInstruction, setMaskInstruction] = useState("");
  const [hasStrokes, setHasStrokes] = useState(Boolean(initialBufferUrl));

  // Grounded-SAM 2 + MobileSAM state
  const [samQuery, setSamQuery] = useState(engine.samPrompt || "windows and glazing");
  const [samMode, setSamMode] = useState<SamPointMode>(initialSamMode);
  const [samPosPoints, setSamPosPoints] = useState<Array<{ xNorm: number; yNorm: number }>>([]);
  const [samNegPoints, setSamNegPoints] = useState<Array<{ xNorm: number; yNorm: number }>>([]);
  const [detectedBoxes, setDetectedBoxes] = useState<GroundedSamBox[]>([]);
  const [activeBoxIdx, setActiveBoxIdx] = useState<number | null>(null);
  const [maskCoveragePct, setMaskCoveragePct] = useState<number | null>(null);
  const [samBusy, setSamBusy] = useState(false);
  const [peekOriginal, setPeekOriginal] = useState(false);

  useEffect(() => {
    setSamMode(initialSamMode);
  }, [initialSamMode]);

  useEffect(() => {
    function handleSamEvent(event: Event) {
      const mode = (event as CustomEvent<SamPointMode>).detail;
      if (mode === "pos" || mode === "neg" || mode === "off") {
        setSamMode(mode);
      }
    }
    window.addEventListener("oriel-sam-mode", handleSamEvent);
    return () => window.removeEventListener("oriel-sam-mode", handleSamEvent);
  }, []);

  function ensureMaskLayer(): HTMLCanvasElement {
    if (!offscreenMaskRef.current) {
      offscreenMaskRef.current = createMaskCanvas();
    }
    return offscreenMaskRef.current;
  }

  const compositeDisplay = useCallback(() => {
    const display = displayCanvasRef.current;
    if (!display) return;
    const dCtx = display.getContext("2d", { willReadFrequently: true });
    if (!dCtx) return;

    dCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    if (peekOriginal) return;

    const maskCanvas = offscreenMaskRef.current;
    if (maskCanvas) {
      dCtx.drawImage(maskCanvas, 0, 0, CANVAS_W, CANVAS_H);
    }
  }, [peekOriginal]);

  useEffect(() => {
    compositeDisplay();
  }, [peekOriginal, compositeDisplay]);

  useEffect(() => {
    if (initialBufferUrl && initialBufferUrl === lastSavedBufferRef.current) return;
    const canvas = ensureMaskLayer();
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    undoStackRef.current = [];

    if (initialBufferUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
        setHasStrokes(true);
        compositeDisplay();
      };
      img.src = initialBufferUrl;
    } else {
      setHasStrokes(false);
      setSamPosPoints([]);
      setSamNegPoints([]);
      setDetectedBoxes([]);
      setActiveBoxIdx(null);
      setMaskCoveragePct(null);
      compositeDisplay();
    }
  }, [initialBufferUrl, compositeDisplay]);

  function getPoint(clientX: number, clientY: number) {
    const canvas = displayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0, xNorm: 0.5, yNorm: 0.5 };
    const rect = canvas.getBoundingClientRect();
    const xNorm = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
    const yNorm = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
    return {
      x: xNorm * CANVAS_W,
      y: yNorm * CANVAS_H,
      xNorm,
      yNorm,
    };
  }

  function pushUndoSnapshot() {
    const canvas = ensureMaskLayer();
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    undoStackRef.current = [...undoStackRef.current.slice(-14), ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)];
  }

  function applyBrushStyle(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeSize;
    if (maskTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(212, 176, 106, 0.72)";
    }
  }

  function commitMaskBuffer(buf: string | null) {
    lastSavedBufferRef.current = buf;
    onSaveBuffer(buf);
  }

  function writeMaskDataUrlToCanvas(maskDataUrl: string, coveragePct: number) {
    const layerCanvas = ensureMaskLayer();
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    pushUndoSnapshot();
    const mImg = new Image();
    mImg.onload = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.drawImage(mImg, 0, 0, CANVAS_W, CANVAS_H);
      setHasStrokes(coveragePct > 0);
      setMaskCoveragePct(coveragePct);
      compositeDisplay();
      commitMaskBuffer(coveragePct > 0 ? layerCanvas.toDataURL("image/png") : null);
    };
    mImg.src = maskDataUrl;
  }

  async function handleOneClickGroundedSam(queryPrompt: string, forcedBoxes?: GroundedSamBox[]) {
    const targetSrc = backgroundUrl;
    if (!targetSrc) {
      toast.message("Load an architectural scene or plate first to run Grounded-SAM 2.");
      return;
    }
    const clean = queryPrompt.trim() || "windows and glazing";
    setSamQuery(clean);
    setSamBusy(true);
    setSamMode("off");
    try {
      let boxes = forcedBoxes;
      let modelTag = "grounded-sam-2";
      if (!boxes) {
        const detection = await onGroundedSamSegment(clean, targetSrc);
        boxes = detection.boxes;
        modelTag = detection.model;
        setDetectedBoxes(boxes);
        setActiveBoxIdx(null);
      }

      const segmented = await runGroundedSam2Segment({
        src: targetSrc,
        prompt: clean,
        boxes,
        posPoints: samPosPoints,
        negPoints: samNegPoints,
        threshold: engine.samThreshold,
      });
      writeMaskDataUrlToCanvas(segmented.maskDataUrl, segmented.coveragePct);
      if (segmented.boxes.length > 0 && !forcedBoxes) {
        setDetectedBoxes(segmented.boxes);
      }
      toast.success(`Grounded-SAM 2 isolated "${clean}" (${segmented.coveragePct}% mask · ${modelTag})`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Grounded-SAM 2 segmentation failed.");
    } finally {
      setSamBusy(false);
    }
  }

  async function handleFocusDetectedBox(boxIdx: number) {
    const box = detectedBoxes[boxIdx];
    if (!box) return;
    setActiveBoxIdx(boxIdx);
    await handleOneClickGroundedSam(box.label, [box]);
  }

  async function handleSamCanvasClick(xNorm: number, yNorm: number) {
    const src = backgroundUrl || "/viz/t03-compact-living-room.jpg";
    if (samMode === "neg" && samPosPoints.length === 0 && detectedBoxes.length === 0) {
      toast.message("Select a Grounded-SAM object or add a Click-to-Mask include point first.");
      return;
    }
    const nextPos = samMode === "pos" ? [...samPosPoints, { xNorm, yNorm }] : samPosPoints;
    const nextNeg = samMode === "neg" ? [...samNegPoints, { xNorm, yNorm }] : samNegPoints;
    setSamPosPoints(nextPos);
    setSamNegPoints(nextNeg);
    setSamBusy(true);
    try {
      let activeBoxes = detectedBoxes;
      let activeLabel = samQuery;
      if (samMode === "pos" && activeBoxes.length === 0) {
        const detection = await onGroundedSamSegment("architectural element", src, { xNorm, yNorm });
        if (!detection.fallback && detection.boxes.length > 0) {
          activeBoxes = detection.boxes;
          activeLabel = detection.boxes[0]?.label || samQuery;
          setDetectedBoxes(activeBoxes);
          setActiveBoxIdx(0);
          setSamQuery(activeLabel);
        }
      }

      const res =
        activeBoxes.length > 0
          ? await runGroundedSam2Segment({
              src,
              prompt: activeLabel,
              boxes: activeBoxIdx !== null && activeBoxes[activeBoxIdx] ? [activeBoxes[activeBoxIdx]] : activeBoxes,
              posPoints: nextPos,
              negPoints: nextNeg,
              threshold: engine.samThreshold,
            })
          : await runInteractiveSamMultiPointMask({
              src,
              posPoints: nextPos,
              negPoints: nextNeg,
              threshold: engine.samThreshold,
            });

      writeMaskDataUrlToCanvas(res.maskDataUrl, res.coveragePct);
      toast.success(
        activeBoxes.length > 0
          ? `Grounded-SAM 2 isolated "${activeLabel}" (${res.coveragePct}% mask)`
          : `SAM-2 refined mask (${res.coveragePct}% coverage)`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SAM click segmentation failed.");
    } finally {
      setSamBusy(false);
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!backgroundUrl) return;
    const display = displayCanvasRef.current;
    const layerCanvas = ensureMaskLayer();
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!display || !ctx) return;
    const pt = getPoint(e.clientX, e.clientY);

    if (samMode !== "off") {
      void handleSamCanvasClick(pt.xNorm, pt.yNorm);
      return;
    }

    display.setPointerCapture(e.pointerId);
    pushUndoSnapshot();
    drawingRef.current = true;
    applyBrushStyle(ctx);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x + 0.01, pt.y + 0.01);
    ctx.stroke();
    compositeDisplay();
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const layerCanvas = ensureMaskLayer();
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const pt = getPoint(e.clientX, e.clientY);
    applyBrushStyle(ctx);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    compositeDisplay();
  }

  function onPointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    setHasStrokes(true);
    const layerCanvas = ensureMaskLayer();
    commitMaskBuffer(layerCanvas.toDataURL("image/png"));
  }

  function handleUndo() {
    const layerCanvas = ensureMaskLayer();
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const prev = undoStackRef.current.pop();
    if (!prev) return;
    ctx.putImageData(prev, 0, 0);
    compositeDisplay();
    commitMaskBuffer(layerCanvas.toDataURL("image/png"));
  }

  function handleClear() {
    const layerCanvas = ensureMaskLayer();
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    pushUndoSnapshot();
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    compositeDisplay();
    setHasStrokes(false);
    setSamPosPoints([]);
    setSamNegPoints([]);
    setDetectedBoxes([]);
    setActiveBoxIdx(null);
    setMaskCoveragePct(null);
    commitMaskBuffer(null);
  }

  function handleTaskSelect(taskId: IopaintTaskMode) {
    setEngineField("iopaintTask", taskId);
    const taskMeta = IOPAINT_TASKS.find((t) => t.id === taskId);
    if (taskMeta) {
      setEngineField("iopaintModel", taskMeta.defaultModel);
    }
  }

  function handleDownloadCurrent() {
    if (!backgroundUrl) {
      toast.message("Load or render an image first to download.");
      return;
    }
    const a = document.createElement("a");
    a.href = backgroundUrl;
    a.download = `oriel-iopaint-${engine.iopaintTask}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Downloaded current IOPaint image");
  }

  const shownBg = peekOriginal && upload ? upload : backgroundUrl;
  const activeModelLabel =
    IOPAINT_MODELS.find((m) => m.id === engine.iopaintModel)?.label ?? engine.iopaintModel;

  return (
    <div data-testid="iopaint-workspace" className="relative w-full overflow-hidden bg-[#181613]">
      {/* Grounded-SAM 2 One-Click Semantic Segmentation Bar */}
      <div
        data-testid="grounded-sam2-bar"
        className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#14110f] px-3 py-2 text-xs text-[#f6efe4]"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-[#e7c27a] uppercase">
            <ScanSearch className="size-3.5" /> Grounded-SAM 2
          </span>
          {GROUNDED_SAM2_OBJECTS.map((item) => {
            const active =
              samQuery.toLowerCase() === item.query.toLowerCase() && detectedBoxes.length > 0;
            return (
              <button
                key={item.id}
                type="button"
                disabled={samBusy || busy}
                onClick={() => void handleOneClickGroundedSam(item.query)}
                className={cn(
                  "inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[10px] font-medium transition disabled:opacity-50",
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
            void handleOneClickGroundedSam(samQuery);
          }}
          className="flex flex-wrap items-center gap-1.5"
        >
          <input
            type="text"
            aria-label="Grounded-SAM 2 semantic target prompt"
            value={samQuery}
            onChange={(e) => setSamQuery(e.target.value)}
            placeholder="Segment object (e.g. pendant lamp)..."
            className="h-7 w-44 rounded-full border border-white/20 bg-black/45 px-2.5 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
          />
          <button
            type="submit"
            disabled={samBusy || busy}
            className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-[#d4b06a]/15 px-2.5 text-[11px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25 disabled:opacity-50"
          >
            {samBusy ? <Loader2 className="size-3 animate-spin" /> : <BoxSelect className="size-3" />}
            Segment
          </button>
          {detectedBoxes.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setDetectedBoxes([]);
                setActiveBoxIdx(null);
              }}
              aria-label="Clear Grounded-SAM boxes"
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 text-[10px] text-[#cbbba6] hover:text-white"
            >
              <X className="size-3" /> Boxes
            </button>
          ) : null}
        </form>
      </div>

      {/* Interactive Image + Mask + Grounded Bounding-Box Canvas */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: aspect,
          minHeight: "330px",
          maxHeight: "52vh",
        }}
      >
        {shownBg ? (
          <img
            src={shownBg}
            alt="IOPaint workspace plate"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-4 text-center text-xs text-[#cbbba6]">
            <p>
              Load an architectural scene to run one-click Grounded-SAM 2 segmentation, remove unwanted objects, or replace finishes via IOPaint.
            </p>
            <button
              type="button"
              onClick={() => onLoadSampleSource("/viz/t03-compact-living-room.jpg")}
              className="gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[#2a1c0c]"
            >
              <Sparkles className="size-3.5" /> Load Sample Scene
            </button>
          </div>
        )}

        <canvas
          ref={displayCanvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={cn(
            "relative z-10 block h-full w-full touch-none",
            samMode !== "off" ? "cursor-cell" : "cursor-crosshair",
          )}
        />

        {/* Grounded-SAM 2 Detected Object Bounding Boxes Overlay */}
        {!peekOriginal && backgroundUrl && detectedBoxes.length > 0 ? (
          <div className="pointer-events-none absolute inset-0 z-20">
            {detectedBoxes.map((box, idx) => {
              const [ymin, xmin, ymax, xmax] = box.box_2d;
              const focused = activeBoxIdx === idx;
              return (
                <button
                  key={`${box.label}-${idx}`}
                  type="button"
                  onClick={() => void handleFocusDetectedBox(idx)}
                  title={`Click to isolate ${box.label}`}
                  style={{
                    top: `${ymin / 10}%`,
                    left: `${xmin / 10}%`,
                    height: `${Math.max(4, (ymax - ymin) / 10)}%`,
                    width: `${Math.max(4, (xmax - xmin) / 10)}%`,
                  }}
                  className={cn(
                    "pointer-events-auto absolute rounded-md border-2 border-dashed transition",
                    focused
                      ? "border-[#e7c27a] bg-[#e7c27a]/10"
                      : "border-[#e7c27a]/65 hover:border-[#e7c27a]",
                  )}
                >
                  <span className="pointer-events-none absolute -top-5 left-0 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#14110f]/90 px-2 py-0.5 font-mono text-[9px] text-[#e7c27a] shadow">
                    {box.label} · {Math.round(box.confidence * 100)}%
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Interactive SAM + / - Point Markers */}
        {!peekOriginal && (samPosPoints.length > 0 || samNegPoints.length > 0) ? (
          <div className="pointer-events-none absolute inset-0 z-20">
            {samPosPoints.map((pt, i) => (
              <span
                key={`pos-${i}`}
                style={{ left: `${pt.xNorm * 100}%`, top: `${pt.yNorm * 100}%` }}
                className="absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-emerald-500 text-[10px] font-bold text-white shadow"
              >
                +
              </span>
            ))}
            {samNegPoints.map((pt, i) => (
              <span
                key={`neg-${i}`}
                style={{ left: `${pt.xNorm * 100}%`, top: `${pt.yNorm * 100}%` }}
                className="absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-rose-500 text-[10px] font-bold text-white shadow"
              >
                -
              </span>
            ))}
          </div>
        ) : null}

        {/* Top-Left Compare & Coverage Pills */}
        {backgroundUrl ? (
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              aria-pressed={peekOriginal}
              onClick={() => setPeekOriginal((v) => !v)}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium shadow-md transition",
                peekOriginal
                  ? "gold-fill border-transparent text-[#2a1c0c]"
                  : "border-white/20 bg-[#14110f]/90 text-[#f6efe4] hover:border-[#d4b06a]",
              )}
            >
              {peekOriginal ? <Eye className="size-3" /> : <EyeOff className="size-3 text-[#e7c27a]" />}
              {peekOriginal ? "Viewing Original" : "Compare Original"}
            </button>
            {maskCoveragePct !== null ? (
              <span
                data-testid="sam-mask-coverage"
                className="rounded-full border border-white/15 bg-[#14110f]/90 px-2.5 py-0.5 font-mono text-[10px] text-[#e7c27a]"
              >
                Mask {maskCoveragePct}%
              </span>
            ) : null}
            {samBusy ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#d4b06a]/50 bg-[#14110f]/90 px-2.5 py-0.5 text-[10px] text-[#e7c27a]">
                <Loader2 className="size-3 animate-spin" /> Segmenting…
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Top-Right Interactive Click-to-Mask Mode Prompt */}
        {backgroundUrl && samMode !== "off" && !peekOriginal ? (
          <div
            data-testid="sam-click-hint"
            className="pointer-events-none absolute top-3 right-3 z-20 rounded-full border border-emerald-400/50 bg-[#14110f]/90 px-3 py-1 text-[11px] text-emerald-200 shadow-md"
          >
            {samMode === "pos"
              ? "SAM-2 Click-to-Mask active · Click any element on the render"
              : "Exclude Mode · Click regions to subtract from mask"}
          </div>
        ) : null}

        {/* Bottom-Right Instant Localized Action Strip once a Mask exists */}
        {backgroundUrl && hasStrokes && !peekOriginal ? (
          <div
            data-testid="sam-quick-actions"
            className="absolute right-3 bottom-3 z-20 flex flex-wrap items-center gap-1.5 rounded-full border border-white/15 bg-[#14110f]/92 p-1 shadow-lg"
          >
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                handleTaskSelect("replace");
                onApplyMaskInpaint(maskInstruction || "Honed travertine stone architectural finish");
              }}
              className="gold-fill inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
            >
              <Sparkles className="size-3" /> Inpaint / Replace
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                handleTaskSelect("erase");
                onApplyMaskInpaint(maskInstruction);
              }}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-50"
            >
              Remove Object
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 px-2 text-[11px] text-[#cbbba6] hover:text-white"
            >
              Clear
            </button>
          </div>
        ) : null}
      </div>

      {/* Dedicated Docked Sanster/IOPaint Control Deck */}
      <div
        data-testid="iopaint-control-deck"
        className="space-y-2 border-t border-white/10 bg-[#14110f] px-3 py-2.5 text-xs text-[#f6efe4]"
      >
        {/* Row 1: IOPaint Task Switcher + Server Model Selector + SAM +/- Points */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="mr-1 font-mono text-[10px] tracking-wider text-[#e7c27a] uppercase">IOPaint</span>
            {IOPAINT_TASKS.map((t) => {
              const active = engine.iopaintTask === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={active}
                  title={t.hint}
                  onClick={() => handleTaskSelect(t.id)}
                  className={cn(
                    "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition",
                    active
                      ? "gold-fill border-transparent text-[#2a1c0c]"
                      : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                  )}
                >
                  <span>{t.label}</span>
                  <span className={cn("text-[9px]", active ? "text-[#2a1c0c]/75" : "text-[#e7c27a]")}>
                    · {t.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <label className="inline-flex items-center gap-1.5 text-[11px] text-[#cbbba6]">
              <span>Server Model</span>
              <select
                aria-label="IOPaint Model"
                value={engine.iopaintModel}
                onChange={(e) => setEngineField("iopaintModel", e.target.value as IopaintModel)}
                className="h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]"
              >
                <optgroup label="Erase (Object Removal)">
                  {IOPAINT_MODELS.filter((m) => m.group === "erase").map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Diffusion (Texture & Object Replace)">
                  {IOPAINT_MODELS.filter((m) => m.group === "diffusion").map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>

            <button
              type="button"
              data-testid="sam-click-to-mask-toggle"
              aria-pressed={samMode === "pos"}
              aria-label="Click-to-Mask SAM 2 segmentation"
              onClick={() => setSamMode((m) => (m === "pos" ? "off" : "pos"))}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium",
                samMode === "pos"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                  : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
              )}
            >
              <Crosshair className="size-3" /> Click-to-Mask
            </button>
            <button
              type="button"
              aria-pressed={samMode === "neg"}
              aria-label="SAM 2 Exclude region point"
              onClick={() => setSamMode((m) => (m === "neg" ? "off" : "neg"))}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                samMode === "neg"
                  ? "border-rose-400 bg-rose-500/20 text-rose-200"
                  : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
              )}
            >
              <Crosshair className="size-3" /> Exclude -
            </button>
          </div>
        </div>

        {/* Row 2: Brush / Mask Refine + Contextual Task Execute */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSamMode("off");
                setMaskTool("brush");
              }}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]",
                maskTool === "brush" && samMode === "off"
                  ? "gold-fill text-[#2a1c0c]"
                  : "bg-white/10 text-[#e4dacb]",
              )}
            >
              <Paintbrush className="size-3" /> Brush
            </button>
            <button
              type="button"
              onClick={() => {
                setSamMode("off");
                setMaskTool("eraser");
              }}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]",
                maskTool === "eraser" && samMode === "off"
                  ? "gold-fill text-[#2a1c0c]"
                  : "bg-white/10 text-[#e4dacb]",
              )}
            >
              <Eraser className="size-3" /> Eraser
            </button>

            <label className="ml-1 flex items-center gap-1">
              <span className="text-[10px] text-[#cbbba6]">Size</span>
              <input
                type="range"
                min={10}
                max={64}
                value={strokeSize}
                onChange={(e) => setStrokeSize(Number(e.target.value))}
                className="h-1 w-14 accent-[#d4b06a]"
              />
            </label>

            <label className="ml-1 flex items-center gap-1">
              <span className="text-[10px] text-[#cbbba6]">Dilate +{engine.iopaintMaskDilate}px</span>
              <input
                type="range"
                min={0}
                max={24}
                value={engine.iopaintMaskDilate}
                onChange={(e) => setEngineField("iopaintMaskDilate", Number(e.target.value))}
                className="h-1 w-14 accent-[#d4b06a]"
              />
            </label>

            <button
              type="button"
              aria-pressed={engine.iopaintInvertMask}
              onClick={() => setEngineField("iopaintInvertMask", !engine.iopaintInvertMask)}
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                engine.iopaintInvertMask
                  ? "gold-fill border-transparent text-[#2a1c0c]"
                  : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
              )}
            >
              <FlipHorizontal className="size-3" /> Invert Mask
            </button>

            <button
              type="button"
              onClick={handleUndo}
              className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15"
            >
              <RotateCcw className="size-3" /> Undo
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15"
            >
              <Trash2 className="size-3" /> Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {engine.iopaintTask === "outpaint" ? (
              <>
                {(["top", "right", "bottom", "left"] as const).map((edge) => (
                  <label key={edge} className="inline-flex items-center gap-1 text-[10px] text-[#cbbba6]">
                    <span className="uppercase">{edge[0]}</span>
                    <input
                      type="number"
                      min={0}
                      max={320}
                      step={16}
                      value={engine.iopaintOutpaintPad[edge]}
                      onChange={(e) =>
                        setEngineField("iopaintOutpaintPad", {
                          ...engine.iopaintOutpaintPad,
                          [edge]: Number(e.target.value),
                        })
                      }
                      className="h-7 w-13 rounded-full border border-white/20 bg-black/50 px-2 text-center font-mono text-[11px] text-white outline-none focus:border-[#d4b06a]"
                    />
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setEngineField("iopaintOutpaintPad", { top: 96, right: 128, bottom: 96, left: 128 })}
                  className="inline-flex h-7 shrink-0 items-center rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]"
                >
                  +All Preset
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onApplyDirectionalOutpaint(engine.iopaintOutpaintPad)}
                  className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                >
                  <Expand className="size-3.5" /> Apply Outpaint Pad
                </button>
              </>
            ) : engine.iopaintTask === "anytext" ? (
              <>
                <label className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5">
                  <Type className="size-3 text-[#e7c27a]" />
                  <input
                    type="text"
                    value={engine.iopaintAnyText}
                    onChange={(e) => setEngineField("iopaintAnyText", e.target.value)}
                    placeholder="Signage text in mask..."
                    className="h-7 w-40 bg-transparent text-[11px] text-white outline-none placeholder:text-white/45"
                  />
                </label>
                <button
                  type="button"
                  disabled={!hasStrokes || busy}
                  onClick={() => onApplyMaskInpaint(engine.iopaintAnyText || maskInstruction)}
                  className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                >
                  <Type className="size-3.5" /> Render AnyText
                </button>
              </>
            ) : engine.iopaintTask === "paint-by-example" ? (
              <>
                <div className="flex flex-wrap items-center gap-1">
                  {EXAMPLE_INSERT_SWATCHES.map((sw) => (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => setEngineField("iopaintExampleUrl", sw.url)}
                      className={cn(
                        "inline-flex h-7 shrink-0 items-center rounded-full border px-2 text-[10px]",
                        engine.iopaintExampleUrl === sw.url
                          ? "gold-fill border-transparent text-[#2a1c0c]"
                          : "border-white/15 bg-white/5 text-[#e4dacb]",
                      )}
                    >
                      {sw.label}
                    </button>
                  ))}
                  <label className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]">
                    <Upload className="size-3" /> Ref
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void readImage(f, 1024).then((url) => setEngineField("iopaintExampleUrl", url));
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  disabled={!hasStrokes || busy}
                  onClick={() => onApplyMaskInpaint(maskInstruction || "Insert example object seamlessly")}
                  className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                >
                  <Sparkles className="size-3.5" /> Insert By Example
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={maskInstruction}
                  onChange={(e) => setMaskInstruction(e.target.value)}
                  placeholder={
                    engine.iopaintTask === "erase"
                      ? "Optional erase target (e.g. person, cable)..."
                      : "Texture/material in mask (e.g. travertine, fluted oak)..."
                  }
                  className="h-7 w-52 rounded-full border border-white/20 bg-black/40 px-3 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
                />
                <button
                  type="button"
                  disabled={!hasStrokes || busy}
                  onClick={() => onApplyMaskInpaint(maskInstruction)}
                  className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                >
                  {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  {engine.iopaintTask === "erase" ? "Apply Erase" : "Apply Replace"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Texture & Material Swatches row when Replace mode is selected */}
        {engine.iopaintTask === "replace" ? (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2">
            <span className="font-mono text-[10px] tracking-wider text-[#cbbba6] uppercase">
              Texture Swatches
            </span>
            {TEXTURE_REPLACE_SWATCHES.map((swatch) => {
              const selected = maskInstruction.toLowerCase().includes(swatch.id);
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setMaskInstruction(swatch.prompt)}
                  className={cn(
                    "inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[10px] transition",
                    selected
                      ? "gold-fill border-transparent font-semibold text-[#2a1c0c]"
                      : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                  )}
                >
                  {swatch.label}
                </button>
              );
            })}
            <span className="ml-auto font-mono text-[10px] text-[#cbbba6]">
              Engine: {activeModelLabel}
            </span>
          </div>
        ) : null}

        {/* Row 3: Plugins Bar (RemoveBG, Restore Faces, Real-ESRGAN, Save PNG) */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-white/10 pt-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] tracking-wider text-[#cbbba6] uppercase">Plugins</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => onApplyRemoveBg("cutout")}
              className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50"
            >
              <Scissors className="size-3 text-[#e7c27a]" /> RemoveBG Cutout
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onApplyRemoveBg("mask")}
              className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50"
            >
              <Scissors className="size-3 text-[#e7c27a]" /> RemoveBG → Mask
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onApplyRestoreFaces}
              className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50"
            >
              <UserCheck className="size-3 text-[#e7c27a]" /> Restore Faces ({engine.iopaintFaceModel.toUpperCase()})
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onApplyEsrganPlugin}
              className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50"
            >
              <Sparkles className="size-3 text-[#e7c27a]" /> Real-ESRGAN {engine.upscaleFactor}×
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadCurrent}
            className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#d4b06a]"
          >
            <Download className="size-3 text-[#e7c27a]" /> Save PNG
          </button>
        </div>
      </div>
    </div>
  );
}
