import { useCallback, useEffect, useRef, useState } from "react";
import { cloneMask, floodSelect, paintStroke, type Mask, type Raster } from "@/lib/revision/pixels";
import { cn } from "@/lib/utils";
import { btnGhost } from "./ui";

export type Tool = "paint" | "select";
export type Layer = "editable" | "protected";

type Props = {
  base: Raster;
  /** Editable mask for the active surface. */
  editable: Mask;
  /** Editable masks of the other surfaces, drawn faintly for context. */
  others: Mask[];
  protectedMask: Mask;
  onCommit: (editable: Mask, protectedMask: Mask) => void;
};

/**
 * Click-to-select and brush editor. Green = editable for the active surface,
 * red = protected. Protection always wins, and the effective area is shown.
 */
export function MaskEditor({ base, editable, others, protectedMask, onCommit }: Props) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const edRef = useRef<Mask>(cloneMask(editable));
  const prRef = useRef<Mask>(cloneMask(protectedMask));
  const history = useRef<{ e: Mask; p: Mask }[]>([]);
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  const [tool, setTool] = useState<Tool>("select");
  const [layer, setLayer] = useState<Layer>("editable");
  const [erase, setErase] = useState(false);
  const [brush, setBrush] = useState(28);
  const [tolerance, setTolerance] = useState(18);
  const [showEffective, setShowEffective] = useState(false);
  const [stats, setStats] = useState({ e: 0, p: 0, eff: 0 });
  const [, setTick] = useState(0);

  // Masks are owned by refs after mount (so undo history survives each commit).
  // The parent remounts this component via `key` when the view or surface changes.
  useEffect(() => {
    schedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [others]);

  useEffect(() => {
    const canvas = baseRef.current;
    if (!canvas) return;
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext("2d");
    ctx?.putImageData(new ImageData(new Uint8ClampedArray(base.data), base.width, base.height), 0, 0);
  }, [base]);

  const paintOverlay = useCallback(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(base.width, base.height);
    const e = edRef.current.data;
    const p = prRef.current.data;
    let ec = 0;
    let pc = 0;
    let eff = 0;
    for (let i = 0; i < e.length; i += 1) {
      const o = i * 4;
      const isP = p[i] === 1;
      const isE = e[i] === 1;
      if (isE) ec += 1;
      if (isP) pc += 1;
      if (isE && !isP) eff += 1;
      if (isP) {
        img.data[o] = 220;
        img.data[o + 1] = 60;
        img.data[o + 2] = 60;
        img.data[o + 3] = 150;
      } else if (isE) {
        img.data[o] = showEffective ? 70 : 60;
        img.data[o + 1] = showEffective ? 140 : 200;
        img.data[o + 2] = showEffective ? 255 : 120;
        img.data[o + 3] = showEffective ? 170 : 125;
      } else if (others.some((m) => m.data[i] === 1)) {
        img.data[o] = 120;
        img.data[o + 1] = 160;
        img.data[o + 2] = 255;
        img.data[o + 3] = 60;
      }
    }
    ctx.putImageData(img, 0, 0);
    setStats({ e: ec, p: pc, eff });
  }, [base.width, base.height, others, showEffective]);

  const schedule = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(paintOverlay);
  }, [paintOverlay]);

  useEffect(() => {
    schedule();
  }, [schedule, showEffective]);

  function point(event: React.PointerEvent): { x: number; y: number } {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * base.width, y: ((event.clientY - rect.top) / rect.height) * base.height };
  }

  function snapshot() {
    history.current.push({ e: cloneMask(edRef.current), p: cloneMask(prRef.current) });
    if (history.current.length > 12) history.current.shift();
  }

  function commit() {
    onCommit(cloneMask(edRef.current), cloneMask(prRef.current));
    setTick((t) => t + 1);
  }

  function onDown(event: React.PointerEvent) {
    event.preventDefault();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const pt = point(event);
    snapshot();
    const target = layer === "editable" ? edRef.current : prRef.current;
    if (tool === "select") {
      floodSelect(base, target, pt.x, pt.y, tolerance, erase ? 0 : 1);
      schedule();
      commit();
      return;
    }
    drawing.current = pt;
    paintStroke(target, pt.x, pt.y, pt.x, pt.y, brush / 2, erase ? 0 : 1);
    schedule();
  }

  function onMove(event: React.PointerEvent) {
    if (!drawing.current) return;
    const pt = point(event);
    const target = layer === "editable" ? edRef.current : prRef.current;
    paintStroke(target, drawing.current.x, drawing.current.y, pt.x, pt.y, brush / 2, erase ? 0 : 1);
    drawing.current = pt;
    schedule();
  }

  function onUp() {
    if (!drawing.current) return;
    drawing.current = null;
    commit();
  }

  function undo() {
    const last = history.current.pop();
    if (!last) return;
    edRef.current = last.e;
    prRef.current = last.p;
    schedule();
    commit();
  }

  function clearLayer() {
    snapshot();
    (layer === "editable" ? edRef.current : prRef.current).data.fill(0);
    schedule();
    commit();
  }

  const chip = (active: boolean) => cn("h-9 rounded-full border px-3 text-xs font-semibold sm:h-8", active ? "border-lime bg-lime/20 text-fg" : "border-line text-muted hover:text-fg");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Mask tools">
        <button type="button" className={chip(layer === "editable")} onClick={() => setLayer("editable")} data-testid="layer-editable">
          Editable area
        </button>
        <button type="button" className={chip(layer === "protected")} onClick={() => setLayer("protected")} data-testid="layer-protected">
          Protected details
        </button>
        <span className="mx-1 h-5 w-px bg-line" />
        <button type="button" className={chip(tool === "select")} onClick={() => setTool("select")} data-testid="tool-select">
          Click a surface
        </button>
        <button type="button" className={chip(tool === "paint")} onClick={() => setTool("paint")} data-testid="tool-paint">
          Brush
        </button>
        <button type="button" className={chip(erase)} onClick={() => setErase((v) => !v)} aria-pressed={erase}>
          {erase ? "Subtracting" : "Adding"}
        </button>
        <span className="mx-1 h-5 w-px bg-line" />
        {tool === "paint" ? (
          <label className="flex items-center gap-2 text-xs text-muted">
            Brush {brush}px
            <input type="range" min={4} max={120} value={brush} onChange={(e) => setBrush(Number(e.target.value))} aria-label="Brush size" />
          </label>
        ) : (
          <label className="flex items-center gap-2 text-xs text-muted">
            Tolerance {tolerance}
            <input type="range" min={2} max={60} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} aria-label="Selection tolerance" />
          </label>
        )}
        <button type="button" className={btnGhost} onClick={undo}>
          Undo
        </button>
        <button type="button" className={btnGhost} onClick={clearLayer}>
          Clear {layer === "editable" ? "editable" : "protected"}
        </button>
        <label className="flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={showEffective} onChange={(e) => setShowEffective(e.target.checked)} /> Show effective area
        </label>
      </div>

      <div
        className="relative w-full touch-none select-none overflow-hidden rounded-2xl border border-line bg-black/30"
        style={{ aspectRatio: `${base.width} / ${base.height}`, cursor: tool === "select" ? "crosshair" : "cell" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        data-testid="mask-stage"
      >
        <canvas ref={baseRef} className="absolute inset-0 h-full w-full" />
        <canvas ref={overlayRef} className="absolute inset-0 h-full w-full" />
      </div>

      <p className="text-xs text-muted" data-testid="mask-stats">
        Editable {((stats.e / (base.width * base.height)) * 100).toFixed(1)}% · Protected {((stats.p / (base.width * base.height)) * 100).toFixed(1)}% · Effective{" "}
        {((stats.eff / (base.width * base.height)) * 100).toFixed(1)}% <span className="text-faint">(protection always wins where they overlap)</span>
      </p>
    </div>
  );
}
