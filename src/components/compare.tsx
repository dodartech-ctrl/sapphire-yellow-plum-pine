import { useRef, useState } from "react";

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
  const frame = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  function setFromClient(clientX: number) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }

  const closed = position <= 0.5 || position >= 99.5;

  return (
    <div className={embedded ? "bg-[#1c1915]" : "space-y-3"}>
      <div
        ref={frame}
        className={embedded ? "relative mx-auto w-full max-w-full touch-none overflow-hidden bg-[#1c1915]" : "relative mx-auto aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl border border-line bg-[#1c1915]"}
        style={embedded ? { aspectRatio: aspect, maxHeight: "62vh" } : undefined}
        onPointerDown={(event) => {
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromClient(event.clientX);
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
          setFromClient(event.clientX);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      >
        <img src={after} alt={afterAlt} className="absolute inset-0 h-full w-full object-contain" draggable={false} />
        <img
          src={before}
          alt={beforeAlt}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        {closed ? null : <div className="absolute inset-y-0 z-10 w-0.5 bg-[#e7c27a]" style={{ left: `${position}%` }} />}
      </div>
      {embedded ? null : (
        <label className="flex items-center gap-3 text-xs text-muted">
          <span className="shrink-0">{beforeLabel}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(position)}
            onChange={(event) => setPosition(Number(event.target.value))}
            className="w-full accent-lime"
            aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
            suppressHydrationWarning
          />
          <span className="shrink-0">{afterLabel}</span>
        </label>
      )}
    </div>
  );
}
