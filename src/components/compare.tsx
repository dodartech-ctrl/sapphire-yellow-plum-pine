import { Columns2, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function parseAspectRatio(aspect: string): number {
  const parts = aspect.split("/").map((v) => Number(v.trim()));
  if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1]) && parts[1] > 0) {
    return parts[0] / parts[1];
  }
  return 16 / 9;
}

export function Compare({
  before,
  after,
  beforeLabel,
  afterLabel,
  beforeAlt,
  afterAlt,
  embedded = false,
  aspect = "16 / 9",
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  beforeAlt: string;
  afterAlt: string;
  embedded?: boolean;
  aspect?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);
  const [mode, setMode] = useState<"slider" | "side-by-side">("slider");
  const [naturalAspect, setNaturalAspect] = useState<number | null>(null);
  const [beforeDims, setBeforeDims] = useState<{ w: number; h: number } | null>(null);
  const [afterDims, setAfterDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    setNaturalAspect(null);
    setBeforeDims(null);
  }, [before]);

  useEffect(() => {
    setAfterDims(null);
  }, [after]);

  function setFromClient(clientX: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }

  const fallbackAspect = parseAspectRatio(aspect);
  const activeAspect = naturalAspect ?? fallbackAspect;
  const pct = Math.round(position);
  const aspectDelta =
    beforeDims && afterDims
      ? Math.abs(beforeDims.w / beforeDims.h - afterDims.w / afterDims.h)
      : 0;
  const isPixelAspectMatched = !beforeDims || !afterDims || aspectDelta < 0.08;

  if (embedded) {
    return (
      <div
        data-testid="compare-embedded-stage"
        className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#08131f]"
      >
        {/* Main Unclipped Comparison Canvas */}
        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center p-1.5">
          {mode === "side-by-side" ? (
            <div
              data-testid="compare-side-by-side"
              className="grid h-full w-full grid-cols-1 gap-1.5 sm:grid-cols-2"
            >
              <div
                className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#050f1b] p-1"
                style={{ containerType: "size" }}
              >
                <div
                  className="relative overflow-hidden rounded-lg bg-[#050f1b]"
                  style={{
                    width: `min(100cqw, calc(100cqh * ${activeAspect}))`,
                    height: `min(100cqh, calc(100cqw / ${activeAspect}))`,
                  }}
                >
                  <img
                    src={before}
                    alt={beforeAlt}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        setBeforeDims({ w: img.naturalWidth, h: img.naturalHeight });
                        const ratio = img.naturalWidth / img.naturalHeight;
                        if (ratio >= 0.4 && ratio <= 3.2) setNaturalAspect(ratio);
                      }
                    }}
                    className="h-full w-full object-cover object-center"
                    draggable={false}
                  />
                </div>
                <span className="pointer-events-none absolute top-2 left-2 rounded-full border border-white/15 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8eff3] backdrop-blur-xs">
                  {beforeLabel}
                  {beforeDims ? ` · ${beforeDims.w}×${beforeDims.h}` : ""}
                </span>
              </div>
              <div
                className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7c27a]/35 bg-[#050f1b] p-1"
                style={{ containerType: "size" }}
              >
                <div
                  className="relative overflow-hidden rounded-lg bg-[#050f1b]"
                  style={{
                    width: `min(100cqw, calc(100cqh * ${activeAspect}))`,
                    height: `min(100cqh, calc(100cqw / ${activeAspect}))`,
                  }}
                >
                  <img
                    src={after}
                    alt={afterAlt}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        setAfterDims({ w: img.naturalWidth, h: img.naturalHeight });
                      }
                    }}
                    className="h-full w-full object-cover object-center"
                    draggable={false}
                  />
                </div>
                <span className="pointer-events-none absolute top-2 right-2 rounded-full border border-[#e7c27a]/35 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8c98a] backdrop-blur-xs">
                  {afterLabel}
                  {afterDims ? ` · ${afterDims.w}×${afterDims.h}` : ""}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="relative flex h-full w-full items-center justify-center"
              style={{ containerType: "size" }}
            >
              <div
                ref={frameRef}
                role="slider"
                tabIndex={0}
                aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                data-testid="compare-slider-frame"
                className="relative cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-white/15 bg-[#050f1b] shadow-[0_12px_36px_rgba(0,0,0,0.45)] focus:outline-none focus:ring-2 focus:ring-[#e7c27a]/60"
                style={{
                  width: `min(100cqw, calc(100cqh * ${activeAspect}))`,
                  height: `min(100cqh, calc(100cqw / ${activeAspect}))`,
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    setPosition((p) => Math.max(0, p - 5));
                  } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    setPosition((p) => Math.min(100, p + 5));
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    setPosition(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    setPosition(100);
                  }
                }}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  draggingRef.current = true;
                  try {
                    event.currentTarget.setPointerCapture(event.pointerId);
                  } catch {
                    // ignore synthetic pointer events
                  }
                  setFromClient(event.clientX);
                }}
                onPointerMove={(event) => {
                  if (!draggingRef.current) return;
                  event.preventDefault();
                  setFromClient(event.clientX);
                }}
                onPointerUp={(event) => {
                  draggingRef.current = false;
                  try {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                      event.currentTarget.releasePointerCapture(event.pointerId);
                    }
                  } catch {
                    // ignore
                  }
                }}
                onPointerCancel={() => {
                  draggingRef.current = false;
                }}
              >
                {/* Base Layer: After / Result (fills identical frame bounds cleanly) */}
                <img
                  src={after}
                  alt={afterAlt}
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                      setAfterDims({ w: img.naturalWidth, h: img.naturalHeight });
                    }
                  }}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                  draggable={false}
                />

                {/* Clipped Overlay Layer: Before / Source (pixel-aligned identically to After) */}
                <div
                  data-testid="compare-before-clip"
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                  <img
                    src={before}
                    alt={beforeAlt}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        setBeforeDims({ w: img.naturalWidth, h: img.naturalHeight });
                        const ratio = img.naturalWidth / img.naturalHeight;
                        if (ratio >= 0.4 && ratio <= 3.2) {
                          setNaturalAspect(ratio);
                        }
                      }
                    }}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                    draggable={false}
                  />
                </div>

                {/* Corner Labels */}
                <span className="pointer-events-none absolute top-2 left-2 z-10 rounded-full border border-white/20 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8eff3] backdrop-blur-xs">
                  {beforeLabel}
                </span>
                <span className="pointer-events-none absolute top-2 right-2 z-10 rounded-full border border-[#e7c27a]/40 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8c98a] backdrop-blur-xs">
                  {afterLabel}
                </span>

                {/* Vertical Wipe Divider + Centered Grabbable Handle */}
                <div
                  data-testid="compare-divider"
                  className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-[#e7c27a] shadow-[0_0_10px_rgba(231,194,122,0.95)]"
                  style={{ left: `${position}%` }}
                >
                  <span className="absolute top-1/2 left-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#e7c27a] bg-[#08131f]/95 text-[11px] font-bold text-[#e7c27a] shadow-[0_4px_14px_rgba(0,0,0,0.65)]">
                    ↔
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Scrubber & Mode Controls Strip */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-[#07111c] px-2.5 py-1 text-[10px] text-[#cfe3f0]">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5">
            <button
              type="button"
              data-testid="compare-mode-slider"
              onClick={() => setMode("slider")}
              className={cn(
                "inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9.5px] font-semibold transition",
                mode === "slider" ? "bg-[#e7c27a] text-[#1b1407]" : "text-[#a9bdc9] hover:text-white",
              )}
            >
              <SlidersHorizontal className="size-2.5" />
              Wipe
            </button>
            <button
              type="button"
              data-testid="compare-mode-side"
              onClick={() => setMode("side-by-side")}
              className={cn(
                "inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9.5px] font-semibold transition",
                mode === "side-by-side" ? "bg-[#e7c27a] text-[#1b1407]" : "text-[#a9bdc9] hover:text-white",
              )}
            >
              <Columns2 className="size-2.5" />
              Side-by-Side
            </button>
          </div>

          {mode === "slider" ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <button
                type="button"
                onClick={() => setPosition(100)}
                className="shrink-0 font-mono text-[9.5px] text-[#a9bdc9] hover:text-white"
              >
                {beforeLabel}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={pct}
                data-testid="compare-range-input"
                aria-label={`Compare ${beforeLabel} and ${afterLabel} position`}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="h-1 min-w-0 flex-1 cursor-pointer accent-[#e7c27a]"
              />
              <button
                type="button"
                onClick={() => setPosition(0)}
                className="shrink-0 font-mono text-[9.5px] text-[#e8c98a] hover:text-white"
              >
                {afterLabel}
              </button>
              <span className="hidden w-8 shrink-0 text-right font-mono text-[9.5px] tabular-nums text-[#a9bdc9] sm:inline">
                {pct}%
              </span>
              <button
                type="button"
                onClick={() => setPosition(50)}
                title="Reset split to 50%"
                className="grid size-5 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[#cfe3f0] hover:border-[#e7c27a] hover:text-[#e7c27a]"
              >
                <RotateCcw className="size-2.5" />
              </button>
            </div>
          ) : (
            <span
              data-testid="compare-pixel-status"
              className={cn(
                "font-mono text-[9.5px]",
                isPixelAspectMatched ? "text-emerald-300" : "text-amber-300",
              )}
            >
              {isPixelAspectMatched
                ? `Pixel-Aligned ${beforeLabel} vs ${afterLabel}`
                : "Re-render to lock upload pixel aspect"}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        className="relative mx-auto aspect-[4/3] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-line bg-[#1c1915]"
        onPointerDown={(event) => {
          event.stopPropagation();
          draggingRef.current = true;
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            // ignore
          }
          setFromClient(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current) return;
          setFromClient(event.clientX);
        }}
        onPointerUp={(event) => {
          draggingRef.current = false;
          try {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          } catch {
            // ignore
          }
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
      >
        <img
          src={after}
          alt={afterAlt}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={before}
            alt={beforeAlt}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            draggable={false}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-[#e7c27a]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#e7c27a] bg-[#08131f]/95 text-[10px] font-bold text-[#e7c27a]">
            ↔
          </span>
        </div>
      </div>
      <label className="flex items-center gap-3 text-xs text-muted">
        <span className="shrink-0">{beforeLabel}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="w-full accent-lime"
          aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
          suppressHydrationWarning
        />
        <span className="shrink-0">{afterLabel}</span>
      </label>
    </div>
  );
}
