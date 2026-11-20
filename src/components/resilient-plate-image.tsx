import { ImageOff, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ResilientPlateImageProps = {
  src: string;
  alt: string;
  className?: string;
  busy?: boolean;
  busyLabel?: string;
  onRetryFallback?: () => void;
  testId?: string;
};

export function ResilientPlateImage({
  src,
  alt,
  className,
  busy = false,
  busyLabel = "Rendering architectural plate…",
  onRetryFallback,
  testId,
}: ResilientPlateImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setAttempt(0);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) {
      setStatus("loaded");
    } else {
      setStatus("loading");
    }
  }, [src]);

  function handleRetry() {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        key={`${src}::${attempt}`}
        ref={imgRef}
        src={src}
        alt={alt}
        data-testid={testId}
        referrerPolicy="no-referrer"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={cn(
          "h-full w-full transition-opacity duration-200",
          status === "loaded" ? "opacity-100" : "opacity-85",
          className,
        )}
      />

      {status === "loading" && !busy ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#08131f]/45 backdrop-blur-xs">
          <div className="flex items-center gap-2 rounded-full border border-[#a9bdc9]/30 bg-[#08131f]/80 px-3 py-1.5 text-xs text-[#e8eff3]">
            <Loader2 className="size-3.5 animate-spin text-[#e8c98a]" />
            <span>Loading plate…</span>
          </div>
        </div>
      ) : null}

      {busy ? (
        <div
          data-testid="plate-rendering-veil"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[#08131f]/65 px-4 text-center backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-[#e8c98a]/40 bg-[#121c29]/90 px-4 py-2 shadow-xl">
            <Loader2 className="size-4 animate-spin text-[#e8c98a]" />
            <span className="text-xs font-medium tracking-wide text-[#e8eff3]">{busyLabel}</span>
          </div>
          <p className="max-w-xs text-[11px] text-[#a9bdc9]">
            Preserving walls, mullions, camera horizon, and Look Anchor.
          </p>
        </div>
      ) : null}

      {status === "error" && !busy ? (
        <div
          data-testid="plate-error-fallback"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#08131f]/90 p-4 text-center text-[#e8eff3]"
        >
          <ImageOff className="size-6 text-[#e8c98a]" />
          <p className="text-xs font-medium">Plate preview could not decode from source URL.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-[#a9bdc9]/35 bg-[#16314A]/70 px-3 text-[11px] text-[#cfe3f0] hover:border-[#cfe3f0]"
            >
              <RefreshCw className="size-3" /> Retry
            </button>
            {onRetryFallback ? (
              <button
                type="button"
                onClick={onRetryFallback}
                className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#e8c98a] px-3 text-[11px] font-semibold text-[#261a00]"
              >
                Load Studio Fallback
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
