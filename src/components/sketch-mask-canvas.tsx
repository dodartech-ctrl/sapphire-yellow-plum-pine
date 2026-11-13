import { useCallback, useEffect, useRef, useState } from "react";
import {
  Crosshair,
  Download,
  Eraser,
  Expand,
  Eye,
  EyeOff,
  FlipHorizontal,
  Layers,
  Minus,
  Paintbrush,
  Pencil,
  Plus,
  RotateCcw,
  Scissors,
  Sparkles,
  Square,
  Stamp,
  Trash2,
  Type,
  Upload,
  UserCheck,
} from "lucide-react";
import { ENTOURAGE_CATALOG, type EntourageCatalogItem, type PlacedEntourageItem } from "@/lib/archviz-suite";
import { runInteractiveSamMultiPointMask } from "@/lib/cv-pipeline";
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

type SketchMaskCanvasProps = {
  mode: "sketch" | "mask";
  aspect: string;
  backgroundUrl?: string | null;
  initialBufferUrl?: string | null;
  busy?: boolean;
  onSaveBuffer: (dataUrl: string | null) => void;
  onLockToSource?: (compositeDataUrl: string) => void;
  onApplyMaskInpaint?: (instruction: string) => void;
  onApplyDirectionalOutpaint?: (pad: IopaintOutpaintPad) => void;
  onApplyRemoveBg?: (outputMode: "cutout" | "mask") => void;
  onApplyRestoreFaces?: () => void;
  onApplyEsrganPlugin?: () => void;
  onLoadSampleSource?: (url: string) => void;
};

type DrawTool = "pen" | "line" | "rect" | "eraser";
type SamPointMode = "off" | "pos" | "neg";

type SketchLayer = {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
};

const CANVAS_W = 1280;
const CANVAS_H = 720;

const DEFAULT_LAYERS: SketchLayer[] = [
  { id: "layer-massing", name: "Massing", visible: true, opacity: 100 },
  { id: "layer-facade", name: "Facade", visible: true, opacity: 100 },
  { id: "layer-notes", name: "Landscape & Notes", visible: true, opacity: 90 },
];

const INK_SWATCHES: [string, string][] = [
  ["#1c1917", "Charcoal ink"],
  ["#1d4ed8", "Blueprint cobalt"],
  ["#b91c1c", "Terracotta section"],
  ["#15803d", "Foliage sage"],
  ["#d97706", "Amber callout"],
  ["#ffffff", "White chalk"],
];

const WEIGHT_PRESETS = [1, 3, 6, 12];

const EXAMPLE_INSERT_SWATCHES = [
  { id: "oak-lounge", label: "Warm Oak Lounge", url: "/viz/t03-compact-living-room.jpg" },
  { id: "courtyard-villa", label: "Courtyard Timber", url: "/viz/t05-subtropical-home.jpg" },
  { id: "brass-loft", label: "Loft Fixture", url: "/viz/p02-loft-after.jpg" },
];

function createOffscreenCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = CANVAS_W;
  c.height = CANVAS_H;
  return c;
}

function drawEntourageStampOnCanvas(ctx: CanvasRenderingContext2D, item: EntourageCatalogItem, x: number, y: number) {
  const w = Math.max(48, Math.round(CANVAS_W * item.widthNorm));
  const h = Math.max(54, Math.round(CANVAS_H * item.heightNorm));
  ctx.save();
  ctx.fillStyle = "rgba(28, 25, 23, 0.24)";
  ctx.beginPath();
  ctx.ellipse(x, y + h * 0.42, w * 0.56, Math.max(6, h * 0.1), 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#b08a45";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(x - w * 0.5, y - h * 0.5, w, h);
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(28, 25, 23, 0.78)";
  ctx.font = `${Math.round(Math.min(w, h) * 0.62)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.glyph, x, y);

  ctx.fillStyle = "#1c1917";
  ctx.font = "bold 11px monospace";
  ctx.fillText(item.label.toUpperCase(), x, y + h * 0.56);
  ctx.restore();
}

export function SketchMaskCanvas({
  mode,
  aspect,
  backgroundUrl,
  initialBufferUrl,
  busy = false,
  onSaveBuffer,
  onLockToSource,
  onApplyMaskInpaint,
  onApplyDirectionalOutpaint,
  onApplyRemoveBg,
  onApplyRestoreFaces,
  onApplyEsrganPlugin,
  onLoadSampleSource,
}: SketchMaskCanvasProps) {
  const entourageItems = useOriel((state) => state.entourageItems);
  const setEntourageItems = useOriel((state) => state.setEntourageItems);
  const engine = useOriel((state) => state.engine);
  const setEngineField = useOriel((state) => state.setEngineField);
  const upload = useOriel((state) => state.upload);

  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenLayersRef = useRef<Record<string, HTMLCanvasElement>>({});
  const undoStacksRef = useRef<Record<string, ImageData[]>>({});
  const traceImgRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef(false);
  const startPtRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotBeforeShapeRef = useRef<ImageData | null>(null);
  const lastSavedBufferRef = useRef<string | null>(null);

  const [layers, setLayers] = useState<SketchLayer[]>(() => DEFAULT_LAYERS);
  const [activeLayerId, setActiveLayerId] = useState<string>(DEFAULT_LAYERS[0].id);
  const [layersOpen, setLayersOpen] = useState(true);

  const [tool, setTool] = useState<DrawTool>("pen");
  const [activeStampId, setActiveStampId] = useState<string | null>(null);
  const [strokeSize, setStrokeSize] = useState(mode === "mask" ? 28 : 3);
  const [inkColor, setInkColor] = useState("#1c1917");
  const [traceOpacity, setTraceOpacity] = useState(mode === "mask" ? 100 : 45);
  const [maskInstruction, setMaskInstruction] = useState("");
  const [hasStrokes, setHasStrokes] = useState(Boolean(initialBufferUrl));

  // Sanster/IOPaint Canvas Interactive State
  const [samMode, setSamMode] = useState<SamPointMode>("off");
  const [samPosPoints, setSamPosPoints] = useState<Array<{ xNorm: number; yNorm: number }>>([]);
  const [samNegPoints, setSamNegPoints] = useState<Array<{ xNorm: number; yNorm: number }>>([]);
  const [samBusy, setSamBusy] = useState(false);
  const [peekOriginal, setPeekOriginal] = useState(false);

  const currentCanvasId = mode === "mask" ? "mask-layer" : activeLayerId;

  function ensureOffscreenLayer(id: string): HTMLCanvasElement {
    let c = offscreenLayersRef.current[id];
    if (!c) {
      c = createOffscreenCanvas();
      offscreenLayersRef.current[id] = c;
    }
    return c;
  }

  const compositeDisplay = useCallback(
    (layerList: SketchLayer[] = layers, traceOp: number = traceOpacity) => {
      const display = displayCanvasRef.current;
      if (!display) return;
      const dCtx = display.getContext("2d", { willReadFrequently: true });
      if (!dCtx) return;

      dCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      if (mode === "mask") {
        if (peekOriginal) return;
        const maskCanvas = offscreenLayersRef.current["mask-layer"];
        if (maskCanvas) {
          dCtx.drawImage(maskCanvas, 0, 0, CANVAS_W, CANVAS_H);
        }
        return;
      }

      dCtx.fillStyle = "#f7f2e8";
      dCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      const bgImg = traceImgRef.current;
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0 && traceOp > 0) {
        dCtx.save();
        dCtx.globalAlpha = traceOp / 100;
        const imgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
        const canvasAspect = CANVAS_W / CANVAS_H;
        let dw = CANVAS_W;
        let dh = CANVAS_H;
        let dx = 0;
        let dy = 0;
        if (imgAspect > canvasAspect) {
          dh = CANVAS_W / imgAspect;
          dy = (CANVAS_H - dh) / 2;
        } else {
          dw = CANVAS_H * imgAspect;
          dx = (CANVAS_W - dw) / 2;
        }
        dCtx.drawImage(bgImg, dx, dy, dw, dh);
        dCtx.restore();
      }

      for (const layer of layerList) {
        if (!layer.visible) continue;
        const layerCanvas = offscreenLayersRef.current[layer.id];
        if (!layerCanvas) continue;
        dCtx.save();
        dCtx.globalAlpha = layer.opacity / 100;
        dCtx.drawImage(layerCanvas, 0, 0, CANVAS_W, CANVAS_H);
        dCtx.restore();
      }
    },
    [layers, mode, peekOriginal, traceOpacity],
  );

  useEffect(() => {
    setStrokeSize(mode === "mask" ? 28 : 3);
    setTool("pen");
    setActiveStampId(null);
    setSamMode("off");
    setPeekOriginal(false);
    setTraceOpacity(mode === "mask" ? 100 : 45);
    if (mode === "mask") {
      setActiveLayerId("mask-layer");
    } else if (!layers.some((l) => l.id === activeLayerId)) {
      setActiveLayerId(layers[0]?.id ?? DEFAULT_LAYERS[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!backgroundUrl || mode !== "sketch") {
      traceImgRef.current = null;
      compositeDisplay();
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      traceImgRef.current = img;
      compositeDisplay();
    };
    img.onerror = () => {
      traceImgRef.current = null;
      compositeDisplay();
    };
    img.src = backgroundUrl;
  }, [backgroundUrl, mode, compositeDisplay]);

  useEffect(() => {
    compositeDisplay(layers, traceOpacity);
  }, [layers, traceOpacity, mode, peekOriginal, compositeDisplay]);

  useEffect(() => {
    if (initialBufferUrl && initialBufferUrl === lastSavedBufferRef.current) return;
    const targetId = mode === "mask" ? "mask-layer" : layers[0]?.id ?? DEFAULT_LAYERS[0].id;
    const canvas = ensureOffscreenLayer(targetId);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    if (mode === "mask") {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      undoStacksRef.current[targetId] = [];
    }

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
      if (mode === "mask") {
        setHasStrokes(false);
        setSamPosPoints([]);
        setSamNegPoints([]);
      }
      compositeDisplay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBufferUrl, mode]);

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
    const canvas = ensureOffscreenLayer(currentCanvasId);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const stack = undoStacksRef.current[currentCanvasId] ?? [];
    undoStacksRef.current[currentCanvasId] = [...stack.slice(-14), ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)];
  }

  function applyStrokeStyle(ctx: CanvasRenderingContext2D) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeSize;
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else if (mode === "mask") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(212, 176, 106, 0.72)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = inkColor;
    }
  }

  function flattenVisibleLayersDataUrl(layerList: SketchLayer[] = layers): string | null {
    if (mode === "mask") {
      const c = offscreenLayersRef.current["mask-layer"];
      return c ? c.toDataURL("image/png") : null;
    }
    const out = createOffscreenCanvas();
    const ctx = out.getContext("2d");
    if (!ctx) return null;
    for (const layer of layerList) {
      if (!layer.visible) continue;
      const c = offscreenLayersRef.current[layer.id];
      if (!c) continue;
      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;
      ctx.drawImage(c, 0, 0, CANVAS_W, CANVAS_H);
      ctx.restore();
    }
    return out.toDataURL("image/png");
  }

  function commitBuffer(buf: string | null) {
    lastSavedBufferRef.current = buf;
    onSaveBuffer(buf);
  }

  async function handleSamCanvasClick(xNorm: number, yNorm: number) {
    const src = backgroundUrl || "/viz/t03-compact-living-room.jpg";
    if (samMode === "neg" && samPosPoints.length === 0) {
      toast.message("Add at least one + Include click before subtracting.");
      return;
    }
    const nextPos = samMode === "pos" ? [...samPosPoints, { xNorm, yNorm }] : samPosPoints;
    const nextNeg = samMode === "neg" ? [...samNegPoints, { xNorm, yNorm }] : samNegPoints;
    setSamPosPoints(nextPos);
    setSamNegPoints(nextNeg);
    setSamBusy(true);
    try {
      const res = await runInteractiveSamMultiPointMask({
        src,
        posPoints: nextPos,
        negPoints: nextNeg,
        threshold: engine.samThreshold,
      });
      const layerCanvas = ensureOffscreenLayer("mask-layer");
      const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        pushUndoSnapshot();
        const mImg = new Image();
        mImg.onload = () => {
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
          ctx.drawImage(mImg, 0, 0, CANVAS_W, CANVAS_H);
          setHasStrokes(res.coveragePct > 0);
          compositeDisplay();
          commitBuffer(res.coveragePct > 0 ? layerCanvas.toDataURL("image/png") : null);
        };
        mImg.src = res.maskDataUrl;
      }
      toast.success(`MobileSAM updated (${res.coveragePct}% mask)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "SAM click segmentation failed.");
    } finally {
      setSamBusy(false);
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const display = displayCanvasRef.current;
    const layerCanvas = ensureOffscreenLayer(currentCanvasId);
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!display || !ctx) return;
    const pt = getPoint(e.clientX, e.clientY);

    if (mode === "mask" && samMode !== "off") {
      void handleSamCanvasClick(pt.xNorm, pt.yNorm);
      return;
    }

    if (mode === "sketch" && activeStampId) {
      const item = ENTOURAGE_CATALOG.find((c) => c.id === activeStampId);
      if (item) {
        pushUndoSnapshot();
        drawEntourageStampOnCanvas(ctx, item, pt.x, pt.y);
        const placed: PlacedEntourageItem = {
          id: `ent-${Date.now()}`,
          catalogId: item.id,
          label: item.label,
          xNorm: Number(pt.xNorm.toFixed(3)),
          yNorm: Number(pt.yNorm.toFixed(3)),
          scale: 1,
        };
        setEntourageItems([...entourageItems, placed]);
        setHasStrokes(true);
        compositeDisplay();
        commitBuffer(flattenVisibleLayersDataUrl());
        toast.success(`Stamped "${item.label}" onto sketch layer`);
        return;
      }
    }

    display.setPointerCapture(e.pointerId);
    pushUndoSnapshot();
    drawingRef.current = true;
    startPtRef.current = pt;

    if (tool === "line" || tool === "rect") {
      snapshotBeforeShapeRef.current = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    } else {
      applyStrokeStyle(ctx);
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x + 0.01, pt.y + 0.01);
      ctx.stroke();
      compositeDisplay();
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const layerCanvas = ensureOffscreenLayer(currentCanvasId);
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const pt = getPoint(e.clientX, e.clientY);

    if (tool === "line" || tool === "rect") {
      if (snapshotBeforeShapeRef.current) ctx.putImageData(snapshotBeforeShapeRef.current, 0, 0);
      const start = startPtRef.current ?? pt;
      applyStrokeStyle(ctx);
      ctx.beginPath();
      if (tool === "line") {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      } else {
        ctx.strokeRect(start.x, start.y, pt.x - start.x, pt.y - start.y);
      }
    } else {
      applyStrokeStyle(ctx);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
    compositeDisplay();
  }

  function onPointerUp() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    startPtRef.current = null;
    snapshotBeforeShapeRef.current = null;
    setHasStrokes(true);
    commitBuffer(flattenVisibleLayersDataUrl());
  }

  function handleUndo() {
    const layerCanvas = ensureOffscreenLayer(currentCanvasId);
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const stack = undoStacksRef.current[currentCanvasId] ?? [];
    const prev = stack.pop();
    if (!prev) return;
    ctx.putImageData(prev, 0, 0);
    compositeDisplay();
    commitBuffer(flattenVisibleLayersDataUrl());
  }

  function handleClear() {
    const layerCanvas = ensureOffscreenLayer(currentCanvasId);
    const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    pushUndoSnapshot();
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    compositeDisplay();
    if (mode === "mask") {
      setHasStrokes(false);
      setSamPosPoints([]);
      setSamNegPoints([]);
      commitBuffer(null);
    } else {
      setEntourageItems([]);
      commitBuffer(flattenVisibleLayersDataUrl());
    }
  }

  function handleTaskSelect(taskId: IopaintTaskMode) {
    setEngineField("iopaintTask", taskId);
    const taskMeta = IOPAINT_TASKS.find((t) => t.id === taskId);
    if (taskMeta) {
      setEngineField("iopaintModel", taskMeta.defaultModel);
    }
  }

  function handleDownloadCurrent() {
    const url = backgroundUrl;
    if (!url) {
      toast.message("Load or render an image first to download.");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `oriel-iopaint-${engine.iopaintTask}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success("Downloaded current IOPaint image");
  }

  function addLayer() {
    if (layers.length >= 6) return;
    const id = `layer-${Date.now()}`;
    const next: SketchLayer = { id, name: `Layer ${layers.length + 1}`, visible: true, opacity: 100 };
    ensureOffscreenLayer(id);
    setLayers((prev) => [...prev, next]);
    setActiveLayerId(id);
  }

  function toggleLayerVisibility(id: string) {
    const next = layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l));
    setLayers(next);
    compositeDisplay(next, traceOpacity);
    commitBuffer(flattenVisibleLayersDataUrl(next));
  }

  function removeLayer(id: string) {
    if (layers.length <= 1) return;
    const next = layers.filter((l) => l.id !== id);
    setLayers(next);
    if (activeLayerId === id && next[0]) setActiveLayerId(next[0].id);
    delete offscreenLayersRef.current[id];
    delete undoStacksRef.current[id];
    compositeDisplay(next, traceOpacity);
    commitBuffer(flattenVisibleLayersDataUrl(next));
  }

  function exportSketchComposite() {
    if (!onLockToSource) return;
    const out = createOffscreenCanvas();
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#faf6ee";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const finalize = () => {
      for (const layer of layers) {
        if (!layer.visible) continue;
        const c = offscreenLayersRef.current[layer.id];
        if (!c) continue;
        ctx.save();
        ctx.globalAlpha = layer.opacity / 100;
        ctx.drawImage(c, 0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
      }
      onLockToSource(out.toDataURL("image/jpeg", 0.92));
    };

    if (backgroundUrl && traceOpacity > 0) {
      const bg = new Image();
      bg.crossOrigin = "anonymous";
      bg.onload = () => {
        ctx.save();
        ctx.globalAlpha = traceOpacity / 100;
        ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
        ctx.restore();
        finalize();
      };
      bg.onerror = finalize;
      bg.src = backgroundUrl;
    } else {
      finalize();
    }
  }

  const activeLayerObj = layers.find((l) => l.id === activeLayerId);
  const shownBg = mode === "mask" ? (peekOriginal && upload ? upload : backgroundUrl) : null;

  return (
    <div
      data-testid={mode === "sketch" ? "sketch-canvas-stage" : "mask-canvas-stage"}
      className={cn("relative w-full overflow-hidden", mode === "sketch" ? "bg-[#f7f2e8]" : "bg-[#181613]")}
    >
      {/* Interactive Canvas Stage */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: aspect,
          minHeight: mode === "mask" ? "330px" : "380px",
          maxHeight: mode === "mask" ? "52vh" : "64vh",
        }}
      >
        {mode === "mask" && shownBg ? (
          <img
            src={shownBg}
            alt="Base plate for IOPaint mask"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          />
        ) : mode === "mask" ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-4 text-center text-xs text-[#cbbba6]">
            <p>Load an architectural scene to erase clutter, inpaint finishes, outpaint borders, or run RemoveBG.</p>
            {onLoadSampleSource ? (
              <button
                type="button"
                onClick={() => onLoadSampleSource("/viz/t03-compact-living-room.jpg")}
                className="gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[#2a1c0c]"
              >
                <Sparkles className="size-3.5" /> Load Sample Scene
              </button>
            ) : null}
          </div>
        ) : null}

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
            mode === "mask" && samMode !== "off"
              ? "cursor-cell"
              : activeStampId
                ? "cursor-copy"
                : "cursor-crosshair",
          )}
        />

        {/* Render SAM + / - point markers over mask canvas */}
        {mode === "mask" && !peekOriginal && (samPosPoints.length > 0 || samNegPoints.length > 0) ? (
          <div className="pointer-events-none absolute inset-0 z-20">
            {samPosPoints.map((pt, i) => (
              <span
                key={`pos-${i}`}
                style={{ left: `${pt.xNorm * 100}%`, top: `${pt.yNorm * 100}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 grid size-4 place-items-center rounded-full border border-white bg-emerald-500 text-[10px] font-bold text-white shadow"
              >
                +
              </span>
            ))}
            {samNegPoints.map((pt, i) => (
              <span
                key={`neg-${i}`}
                style={{ left: `${pt.xNorm * 100}%`, top: `${pt.yNorm * 100}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 grid size-4 place-items-center rounded-full border border-white bg-rose-500 text-[10px] font-bold text-white shadow"
              >
                -
              </span>
            ))}
          </div>
        ) : null}

        {/* Top-Left Compact Compare / Peek Eye Badge when in IOPaint Mask Mode */}
        {mode === "mask" && backgroundUrl ? (
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
            {samBusy ? (
              <span className="rounded-full border border-[#d4b06a]/50 bg-[#14110f]/90 px-2.5 py-0.5 text-[10px] text-[#e7c27a]">
                MobileSAM segmenting…
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Top-Left Entourage Stamping Strip (Sketch Mode) */}
        {mode === "sketch" ? (
          <div className="absolute top-3 left-3 z-20 flex max-w-[calc(100%-132px)] flex-wrap items-center gap-1 rounded-2xl border border-white/15 bg-[#14110f]/92 px-2 py-1 text-[10px] text-[#f6efe4] shadow-md">
            <span className="inline-flex shrink-0 items-center gap-1 px-1.5 font-medium text-[#e7c27a]">
              <Stamp className="size-3" /> Entourage
            </span>
            {ENTOURAGE_CATALOG.map((item) => {
              const active = activeStampId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveStampId(active ? null : item.id)}
                  className={cn(
                    "inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 transition",
                    active ? "gold-fill border-transparent font-semibold text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                  )}
                >
                  <span>{item.glyph}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Top-Right Compact Layer Stack Control (Sketch Mode) */}
        {mode === "sketch" ? (
          <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
            <button
              type="button"
              onClick={() => setLayersOpen((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-[#14110f]/92 px-3 text-[11px] font-medium text-[#f6efe4] shadow-md hover:border-[#d4b06a]"
            >
              <Layers className="size-3.5 text-[#e7c27a]" />
              Layers ({layers.length})
            </button>

            {layersOpen ? (
              <div className="w-56 rounded-2xl border border-white/15 bg-[#14110f]/95 p-2.5 text-[11px] text-[#f6efe4] shadow-xl">
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-semibold text-[#e7c27a]">Sketch Layers</span>
                  <button
                    type="button"
                    onClick={addLayer}
                    disabled={layers.length >= 6}
                    className="inline-flex h-6 items-center gap-1 rounded-full bg-white/10 px-2 text-[10px] hover:bg-white/20 disabled:opacity-40"
                  >
                    <Plus className="size-3" /> Add Layer
                  </button>
                </div>
                <div className="space-y-1">
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl border px-2 py-1 transition",
                        activeLayerId === layer.id ? "border-[#e7c27a] bg-white/10" : "border-white/10 bg-black/25",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleLayerVisibility(layer.id)}
                        aria-label={`${layer.visible ? "Hide" : "Show"} ${layer.name}`}
                        className="text-[#cbbba6] hover:text-white"
                      >
                        {layer.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5 opacity-50" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveLayerId(layer.id)}
                        className="min-w-0 flex-1 truncate text-left font-medium"
                      >
                        {layer.name}
                      </button>
                      {layers.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeLayer(layer.id)}
                          aria-label={`Delete ${layer.name}`}
                          className="text-[#cbbba6] hover:text-rose-300"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
                {activeLayerObj ? (
                  <label className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2">
                    <span className="shrink-0 text-[10px] text-[#cbbba6]">Opacity</span>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={activeLayerObj.opacity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const next = layers.map((l) => (l.id === activeLayerObj.id ? { ...l, opacity: val } : l));
                        setLayers(next);
                        compositeDisplay(next, traceOpacity);
                      }}
                      className="h-1 flex-1 accent-[#d4b06a]"
                    />
                    <span className="w-7 text-right font-mono text-[10px]">{activeLayerObj.opacity}%</span>
                  </label>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Floating Bottom Toolbar for Sketch Mode */}
        {mode === "sketch" ? (
          <div className="absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-[#14110f]/95 px-3 py-2 text-xs text-[#f6efe4] shadow-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  ["pen", "Pen", Pencil],
                  ["line", "Line", Minus],
                  ["rect", "Box", Square],
                  ["eraser", "Erase", Eraser],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveStampId(null);
                    setTool(id);
                  }}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] transition",
                    tool === id && !activeStampId ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb] hover:bg-white/15",
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
              <div className="ml-1 flex items-center gap-1">
                {INK_SWATCHES.map(([hex, label]) => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={label}
                    title={label}
                    onClick={() => {
                      setActiveStampId(null);
                      setInkColor(hex);
                      if (tool === "eraser") setTool("pen");
                    }}
                    className={cn(
                      "size-5 rounded-full border transition",
                      inkColor === hex && tool !== "eraser" && !activeStampId
                        ? "scale-110 border-[#e7c27a] ring-2 ring-[#e7c27a]/60"
                        : "border-white/30",
                    )}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
              <div className="ml-1 flex items-center gap-0.5 rounded-full bg-white/5 p-0.5">
                {WEIGHT_PRESETS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setStrokeSize(w)}
                    className={cn(
                      "h-6 rounded-full px-1.5 font-mono text-[10px]",
                      strokeSize === w ? "gold-fill text-[#2a1c0c]" : "text-[#cbbba6]",
                    )}
                  >
                    {w}px
                  </button>
                ))}
              </div>

              <label className="ml-1.5 flex items-center gap-1.5">
                <span className="text-[11px] text-[#cbbba6]">Weight</span>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={strokeSize}
                  onChange={(e) => setStrokeSize(Number(e.target.value))}
                  className="h-1.5 w-14 accent-[#d4b06a]"
                />
              </label>

              {backgroundUrl ? (
                <label className="ml-1.5 flex items-center gap-1.5">
                  <span className="text-[11px] text-[#cbbba6]">Trace</span>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    value={traceOpacity}
                    onChange={(e) => setTraceOpacity(Number(e.target.value))}
                    className="h-1.5 w-14 accent-[#d4b06a]"
                  />
                </label>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={handleUndo}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15"
              >
                <RotateCcw className="size-3.5" /> Undo
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15"
              >
                <Trash2 className="size-3.5" /> Clear Layer
              </button>

              {onLockToSource ? (
                <button
                  type="button"
                  onClick={exportSketchComposite}
                  className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c]"
                >
                  <Sparkles className="size-3.5" /> Lock &amp; Render Sketch
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Dedicated Docked Sanster/IOPaint Studio Control Deck (Inpaint / Mask Mode) */}
      {mode === "mask" ? (
        <div
          data-testid="iopaint-control-deck"
          className="space-y-2 border-t border-white/10 bg-[#14110f] px-3 py-2.5 text-xs text-[#f6efe4]"
        >
          {/* Row 1: IOPaint Task Switcher + Model Selector + MobileSAM Interactive Points */}
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
                <span>Model</span>
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
                  <optgroup label="Diffusion & Editing">
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
                aria-pressed={samMode === "pos"}
                onClick={() => setSamMode((m) => (m === "pos" ? "off" : "pos"))}
                className={cn(
                  "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                  samMode === "pos"
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                    : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                )}
              >
                <Crosshair className="size-3" /> SAM +
              </button>
              <button
                type="button"
                aria-pressed={samMode === "neg"}
                onClick={() => setSamMode((m) => (m === "neg" ? "off" : "neg"))}
                className={cn(
                  "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                  samMode === "neg"
                    ? "border-rose-400 bg-rose-500/20 text-rose-200"
                    : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                )}
              >
                <Crosshair className="size-3" /> SAM -
              </button>
            </div>
          </div>

          {/* Row 2: Brush / Mask Refine (Dilate & Invert) + Contextual Task Inputs & Primary Execute */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setSamMode("off");
                  setTool("pen");
                }}
                className={cn(
                  "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]",
                  tool !== "eraser" && samMode === "off" ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb]",
                )}
              >
                <Paintbrush className="size-3" /> Brush
              </button>
              <button
                type="button"
                onClick={() => {
                  setSamMode("off");
                  setTool("eraser");
                }}
                className={cn(
                  "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]",
                  tool === "eraser" && samMode === "off" ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb]",
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

            {/* Contextual Execute Area */}
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
                  {onApplyDirectionalOutpaint ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onApplyDirectionalOutpaint(engine.iopaintOutpaintPad)}
                      className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                    >
                      <Expand className="size-3.5" /> Apply Outpaint Pad
                    </button>
                  ) : null}
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
                  {onApplyMaskInpaint ? (
                    <button
                      type="button"
                      disabled={!hasStrokes || busy}
                      onClick={() => onApplyMaskInpaint(engine.iopaintAnyText || maskInstruction)}
                      className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                    >
                      <Type className="size-3.5" /> Render AnyText
                    </button>
                  ) : null}
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
                  {onApplyMaskInpaint ? (
                    <button
                      type="button"
                      disabled={!hasStrokes || busy}
                      onClick={() => onApplyMaskInpaint(maskInstruction || "Insert example object seamlessly")}
                      className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                    >
                      <Sparkles className="size-3.5" /> Insert By Example
                    </button>
                  ) : null}
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={maskInstruction}
                    onChange={(e) => setMaskInstruction(e.target.value)}
                    placeholder={
                      engine.iopaintTask === "erase"
                        ? "Optional erase note (e.g. person, car, cable)..."
                        : "Replace inside mask (e.g. travertine wall)..."
                    }
                    className="h-7 w-48 rounded-full border border-white/20 bg-black/40 px-3 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
                  />
                  {onApplyMaskInpaint ? (
                    <button
                      type="button"
                      disabled={!hasStrokes || busy}
                      onClick={() => onApplyMaskInpaint(maskInstruction)}
                      className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50"
                    >
                      <Sparkles className="size-3.5" />{" "}
                      {engine.iopaintTask === "erase" ? "Apply Erase" : "Apply Replace"}
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {/* Row 3: Sanster/IOPaint Plugins Bar (RemoveBG, Restore Faces, Real-ESRGAN, Download) */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-white/10 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] tracking-wider text-[#cbbba6] uppercase">Plugins</span>
              {onApplyRemoveBg ? (
                <>
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
                </>
              ) : null}
              {onApplyRestoreFaces ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onApplyRestoreFaces}
                  className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50"
                >
                  <UserCheck className="size-3 text-[#e7c27a]" /> Restore Faces ({engine.iopaintFaceModel.toUpperCase()})
                </button>
              ) : null}
              {onApplyEsrganPlugin ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={onApplyEsrganPlugin}
                  className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50"
                >
                  <Sparkles className="size-3 text-[#e7c27a]" /> Real-ESRGAN {engine.upscaleFactor}×
                </button>
              ) : null}
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
      ) : null}
    </div>
  );
}
