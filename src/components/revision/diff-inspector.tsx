import { useEffect, useRef, useState } from "react";
import { permittedMaskFor, workingRaster } from "@/lib/revision/engine";
import { getBlob } from "@/lib/revision/blobs";
import { rasterFromDataUrl } from "@/lib/revision/browser";
import { diffAgainstParent, diffOverlay, type Raster } from "@/lib/revision/pixels";
import type { Candidate, RevProject, RevView } from "@/lib/revision/store";
import { cn } from "@/lib/utils";
import { Pill } from "./ui";

type Mode = "original" | "result" | "changes";

/**
 * Toggle original / result / changed-pixels, with one shared zoom so the same
 * region stays in view while switching. Re-runs the pixel gate live so what the
 * designer sees is exactly what is checked.
 */
export function DiffInspector({ project, view, candidate }: { project: RevProject; view: RevView; candidate: Candidate }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("result");
  const [zoom, setZoom] = useState(1);
  const [rasters, setRasters] = useState<{ parent: Raster; result: Raster; overlay: Raster; report: ReturnType<typeof diffAgainstParent> } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    setError("");
    void (async () => {
      try {
        const parent = await workingRaster(view);
        const url = await getBlob<string>(candidate.resultKey);
        if (!url) throw new Error("The stored result is missing.");
        const result = await rasterFromDataUrl(url, 4096, { width: parent.width, height: parent.height });
        const { mask } = await permittedMaskFor(project, view);
        if (live) setRasters({ parent, result, overlay: diffOverlay(parent, result, mask), report: diffAgainstParent(parent, result, mask) });
      } catch (e) {
        if (live) setError(e instanceof Error ? e.message : "Could not compare.");
      }
    })();
    return () => {
      live = false;
    };
    // The project's masks are read fresh; the candidate and view identify the comparison.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate.id, view.id, project.maskRev]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rasters) return;
    const source = mode === "original" ? rasters.parent : mode === "result" ? rasters.result : rasters.overlay;
    canvas.width = source.width;
    canvas.height = source.height;
    canvas.getContext("2d")?.putImageData(new ImageData(new Uint8ClampedArray(source.data), source.width, source.height), 0, 0);
  }, [rasters, mode]);

  if (error) return <p className="text-sm text-[#c4604d]">{error}</p>;
  const report = rasters?.report;

  return (
    <div className="space-y-2" data-testid="diff-inspector">
      <div className="flex flex-wrap items-center gap-2">
        {(["original", "result", "changes"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m} className={cn("h-8 rounded-full border px-3 text-xs font-semibold capitalize", mode === m ? "border-lime bg-lime/20" : "border-line text-muted hover:text-fg")}>
            {m === "changes" ? "Changed pixels" : m}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-xs text-muted">
          Zoom {zoom.toFixed(1)}×
          <input type="range" min={1} max={4} step={0.25} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Zoom" />
        </label>
      </div>
      <div className="max-h-[480px] overflow-auto rounded-2xl border border-line bg-black/30">
        <canvas ref={canvasRef} style={{ width: `${zoom * 100}%`, maxWidth: "none", display: "block" }} />
      </div>
      {report ? (
        <p className="flex flex-wrap items-center gap-2 text-xs" data-testid="gate-report">
          {report.pass ? <Pill tone="ok">Gate passed</Pill> : <Pill tone="bad">Gate failed</Pill>}
          <span className="text-muted">{report.reason}</span>
        </p>
      ) : (
        <p className="text-xs text-muted">Comparing…</p>
      )}
      {mode === "changes" ? <p className="text-[11px] text-faint">Amber = changed inside the editable area (expected). Red = changed outside it (a failure). Dimmed = unchanged.</p> : null}
      <p className="text-[11px] text-faint">The gate checks the lossless working image. A designer should still inspect grain, lighting and seams inside the mask.</p>
    </div>
  );
}
