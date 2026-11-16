import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Contrast,
  Download,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  Square,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { computeBatchProgress, getQueueItemVisualMeta } from "@/lib/archviz-suite";
import {
  CAMERA_PRESETS_3D,
  WORKFLOW_PRESETS,
  type CameraPreset3D,
  type WorkflowPreset,
} from "@/lib/engines";
import { LIGHTS } from "@/lib/properties";
import { useOriel } from "@/lib/store";
import { useGenerate } from "@/lib/use-generate";
import { cn } from "@/lib/utils";

type BatchRenderQueueProps = {
  onClose?: () => void;
};

export function BatchRenderQueue({ onClose }: BatchRenderQueueProps) {
  const queue = useOriel((state) => state.queue);
  const design = useOriel((state) => state.design);
  const engine = useOriel((state) => state.engine);
  const scene3d = useOriel((state) => state.scene3d);
  const plate = useOriel((state) => state.plate);
  const upload = useOriel((state) => state.upload);
  const sketchDataUrl = useOriel((state) => state.sketchDataUrl);
  const enqueueRender = useOriel((state) => state.enqueueRender);
  const requeueQueueItem = useOriel((state) => state.requeueQueueItem);
  const removeQueueItem = useOriel((state) => state.removeQueueItem);
  const clearCompletedQueue = useOriel((state) => state.clearCompletedQueue);
  const retryFailedQueue = useOriel((state) => state.retryFailedQueue);
  const clearQueue = useOriel((state) => state.clearQueue);
  const setPlate = useOriel((state) => state.setPlate);

  const { batchRunning, runSequentialQueue, stopSequentialQueue, queueBatchMatrix, runThreeLightBatch } = useGenerate();

  const [sceneLabel, setSceneLabel] = useState("");
  const [scenePreset, setScenePreset] = useState<WorkflowPreset>(engine.workflowPreset);
  const [sceneLight, setSceneLight] = useState<string>(design.light);
  const [sceneCamera, setSceneCamera] = useState<CameraPreset3D>(scene3d.cameraPreset);
  const [sceneSunHour, setSceneSunHour] = useState<string>("");
  const [sceneNote, setSceneNote] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  const stats = computeBatchProgress(queue);
  const activeJob = stats.activeProcessingId
    ? queue.find((item) => item.id === stats.activeProcessingId) ?? null
    : null;
  const fallbackThumb = plate?.url ?? upload ?? sketchDataUrl ?? "/viz/p01-pavilion-day.jpg";

  useEffect(() => {
    if (stats.processing === 0) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [stats.processing]);

  function handleAddPending(event: React.FormEvent) {
    event.preventDefault();
    const parsedHour = sceneSunHour.trim() !== "" ? Number(sceneSunHour) : undefined;
    const validHour = typeof parsedHour === "number" && Number.isFinite(parsedHour)
      ? Math.max(0, Math.min(24, parsedHour))
      : undefined;
    const label = sceneLabel.trim() || `${design.look} · ${sceneLight} (${sceneCamera})`;
    enqueueRender(label, scenePreset, sceneLight, {
      cameraPreset: sceneCamera,
      sunHour: validHour,
      promptNote: sceneNote.trim() || undefined,
      thumbnailUrl: plate?.url ?? upload ?? sketchDataUrl ?? undefined,
      status: "pending",
    });
    setSceneLabel("");
    setSceneSunHour("");
    setSceneNote("");
    toast.success(`Added "${label}" to Render Queue (Pending)`);
  }

  return (
    <section
      data-testid="batch-render-queue"
      aria-label="Render Queue"
      className="rounded-2xl border border-line bg-surface p-3.5 shadow-sm"
    >
      {/* Header & Queue Counters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Clock className="size-4 text-[#b08a45]" />
          <h3 className="font-serif text-base font-semibold text-fg">Render Queue</h3>
          <span data-testid="batch-queue-counters" className="font-mono text-[11px] tabular-nums text-muted">
            {stats.pending} Pending · {stats.processing} Processing · {stats.completed} Completed
            {stats.failed > 0 ? ` · ${stats.failed} Failed` : ""}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {batchRunning ? (
            <button
              type="button"
              onClick={stopSequentialQueue}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-rose-500/40 bg-rose-500/10 px-3 text-xs font-medium text-rose-700 hover:bg-rose-500/20"
            >
              <Square className="size-3" /> Stop Queue
            </button>
          ) : (
            <button
              type="button"
              data-testid="run-sequential-queue-btn"
              disabled={stats.pending === 0}
              onClick={() => void runSequentialQueue()}
              className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-semibold text-[#2a1c0c] disabled:opacity-45"
            >
              <Play className="size-3.5" /> Process Queue ({stats.pending})
            </button>
          )}
          <button
            type="button"
            disabled={batchRunning}
            onClick={() => void runThreeLightBatch()}
            className="hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-2.5 text-[11px] text-fg disabled:opacity-50"
          >
            <Contrast className="size-3 text-[#b08a45]" /> + 3-Light Trio
          </button>
          <button
            type="button"
            disabled={batchRunning}
            onClick={() => void queueBatchMatrix("sun-study", false)}
            className="hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-2.5 text-[11px] text-fg disabled:opacity-50"
          >
            <Sun className="size-3 text-[#b08a45]" /> + 4-Hr Sun Study
          </button>
          <button
            type="button"
            disabled={batchRunning}
            onClick={() => void queueBatchMatrix("camera-matrix", false)}
            className="hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-2.5 text-[11px] text-fg disabled:opacity-50"
          >
            <Camera className="size-3 text-[#b08a45]" /> + 3-Cam Matrix
          </button>
          {stats.failed > 0 && !batchRunning ? (
            <button
              type="button"
              data-testid="retry-failed-queue-btn"
              onClick={retryFailedQueue}
              className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 text-[11px] font-medium text-rose-700 hover:bg-rose-500/20"
            >
              <RotateCcw className="size-3" /> Retry Failed
            </button>
          ) : null}
          {stats.completed > 0 ? (
            <button
              type="button"
              onClick={clearCompletedQueue}
              className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line px-2.5 text-[11px] text-muted hover:text-fg"
            >
              Clear Done
            </button>
          ) : null}
          {queue.length > 0 && !batchRunning ? (
            <button
              type="button"
              onClick={clearQueue}
              className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line px-2.5 text-[11px] text-muted hover:text-rose-600"
            >
              <Trash2 className="size-3" /> Clear All
            </button>
          ) : null}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Hide render queue"
              className="grid size-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-fg"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Sequential Progress Bar + Active Processing Banner */}
      {stats.total > 0 ? (
        <div className="mt-2.5 space-y-1.5">
          {activeJob ? (
            <div
              data-testid="active-processing-banner"
              className="flex items-center justify-between gap-2 rounded-lg border border-[#d4b06a]/60 bg-[#fff8eb] px-2.5 py-1.5 text-[11px] text-[#785314]"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Loader2 className="size-3.5 animate-spin text-[#b08a45]" />
                Processing sequentially: <strong>{activeJob.label}</strong>
              </span>
              <span className="font-mono text-[10px] tabular-nums">
                {stats.completed + 1} of {stats.total}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <div
              role="progressbar"
              aria-label="Overall render queue progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={stats.progressPct}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised"
            >
              <div
                className="h-full rounded-full bg-[#b08a45] transition-all duration-300"
                style={{ width: `${stats.progressPct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-faint">
              {stats.completed}/{stats.total} ({stats.progressPct}%)
            </span>
          </div>
        </div>
      ) : null}

      {/* Enqueue Scene Form */}
      <form onSubmit={handleAddPending} className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-line/70 bg-raised/50 p-2">
        <input
          type="text"
          value={sceneLabel}
          onChange={(e) => setSceneLabel(e.target.value)}
          placeholder="Scene name (e.g. Atrium Dusk Hero)"
          aria-label="Queue scene name"
          className="h-8 min-w-[150px] flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
        />
        <select
          value={scenePreset}
          onChange={(e) => setScenePreset(e.target.value as WorkflowPreset)}
          aria-label="Queue workflow preset"
          className="h-8 rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
        >
          {WORKFLOW_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          value={sceneLight}
          onChange={(e) => setSceneLight(e.target.value)}
          aria-label="Queue lighting"
          className="h-8 rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
        >
          {LIGHTS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={sceneCamera}
          onChange={(e) => setSceneCamera(e.target.value as CameraPreset3D)}
          aria-label="Queue camera view"
          className="h-8 rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
        >
          {CAMERA_PRESETS_3D.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={0}
          max={24}
          step={0.5}
          value={sceneSunHour}
          onChange={(e) => setSceneSunHour(e.target.value)}
          placeholder="Hour (0-24)"
          aria-label="Queue solar hour"
          className="h-8 w-28 rounded-lg border border-line bg-surface px-2 font-mono text-xs text-fg tabular-nums outline-none focus:border-[#d4b06a]"
        />
        <input
          type="text"
          value={sceneNote}
          onChange={(e) => setSceneNote(e.target.value)}
          placeholder="Optional note (e.g. wet stone plaza)"
          aria-label="Queue scene note"
          className="h-8 min-w-[140px] flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
        />
        <button
          type="submit"
          data-testid="add-queue-scene-btn"
          className="hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-surface px-3 text-xs font-medium text-fg"
        >
          <Plus className="size-3.5 text-[#b08a45]" /> Add Pending
        </button>
      </form>

      {/* Visual Thumbnail Queue Cards with Real-Time Status Bars */}
      {queue.length === 0 ? (
        <p className="mt-2.5 text-center text-xs text-faint">
          No queued architectural views yet. Add scenes above or queue a 4-Hour Sun Study / 3-Camera Matrix to preview thumbnails and live render progress.
        </p>
      ) : (
        <div className="mt-3 grid max-h-72 grid-cols-1 gap-2 overflow-y-auto pr-0.5 md:grid-cols-2">
          {queue.map((job, idx) => {
            const visual = getQueueItemVisualMeta(job, fallbackThumb);
            const norm = visual.normalizedStatus;
            const statusLabel = visual.statusLabel;
            const elapsedSec =
              norm === "processing" && job.startedAt
                ? `${Math.max(0.1, (nowMs - job.startedAt) / 1000).toFixed(1)}s`
                : null;
            const liveStatusHint = elapsedSec ? `Rendering (${elapsedSec})` : visual.statusHint;

            return (
              <div
                key={job.id}
                data-testid={`queue-item-${idx}`}
                data-queue-status={statusLabel}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border p-2.5 transition",
                  norm === "processing"
                    ? "border-[#d4b06a] bg-[#fff8eb]"
                    : norm === "completed"
                      ? "border-emerald-600/30 bg-raised/50"
                      : norm === "error"
                        ? "border-rose-500/50 bg-rose-50/50"
                        : "border-line bg-raised/40",
                )}
              >
                <div className="flex items-start gap-2.5">
                  {/* Job Visual Thumbnail */}
                  <button
                    type="button"
                    disabled={!job.url}
                    onClick={() => {
                      if (!job.url) return;
                      setPlate({ url: job.url, upload: upload ?? undefined, templateId: job.preset, idea: job.label });
                      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
                    }}
                    className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-[#1c1915] disabled:cursor-default"
                    title={job.url ? "Load completed render into Studio stage" : job.label}
                  >
                    <img
                      src={visual.thumbnail}
                      alt={`${job.label} thumbnail`}
                      data-testid={`queue-item-thumb-${idx}`}
                      className={cn(
                        "h-full w-full object-cover transition",
                        norm === "pending" && "opacity-75 grayscale-[15%]",
                        norm === "error" && "opacity-60 grayscale-[35%]",
                      )}
                    />
                    <span className="absolute top-1 left-1 rounded bg-[#14110f]/80 px-1 py-0.5 font-mono text-[9px] text-[#f6efe4]">
                      #{idx + 1}
                    </span>
                  </button>

                  {/* Title, Status Badge & Metadata */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="truncate text-xs font-semibold text-fg">{job.label}</p>
                      <button
                        type="button"
                        disabled={norm === "processing"}
                        onClick={() => removeQueueItem(job.id)}
                        aria-label={`Remove ${job.label} from queue`}
                        className="grid size-6 shrink-0 place-items-center rounded-full text-faint hover:bg-surface hover:text-fg disabled:opacity-40"
                      >
                        <X className="size-3" />
                      </button>
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                          norm === "processing"
                            ? "bg-[#e7c27a]/30 text-[#7d520c]"
                            : norm === "completed"
                              ? "bg-emerald-500/15 text-emerald-700"
                              : norm === "error"
                                ? "bg-rose-500/15 text-rose-700"
                                : "bg-surface text-muted",
                        )}
                      >
                        {norm === "completed" ? (
                          <CheckCircle2 className="size-3" />
                        ) : norm === "processing" ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : norm === "error" ? (
                          <AlertCircle className="size-3" />
                        ) : (
                          <Clock className="size-3" />
                        )}
                        {statusLabel}
                      </span>
                      <span className="truncate font-mono text-[10px] text-faint">
                        {job.preset} · {job.light}
                        {job.cameraPreset ? ` · ${job.cameraPreset}` : ""}
                        {typeof job.sunHour === "number" ? ` · ${job.sunHour.toFixed(1)}h` : ""}
                      </span>
                    </div>

                    {/* Action Strip */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      {job.url ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setPlate({ url: job.url!, upload: upload ?? undefined, templateId: job.preset, idea: job.label });
                              window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
                            }}
                            className="h-6 shrink-0 whitespace-nowrap rounded-full border border-line bg-surface px-2 text-[10px] font-medium text-fg hover:border-[#d4b06a]"
                          >
                            Inspect
                          </button>
                          <a
                            href={job.url}
                            download={`${job.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "oriel-batch"}.jpg`}
                            aria-label={`Download ${job.label}`}
                            className="grid size-6 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted hover:border-[#d4b06a] hover:text-fg"
                          >
                            <Download className="size-3" />
                          </a>
                        </>
                      ) : null}

                      {(norm === "completed" || norm === "error") && !batchRunning ? (
                        <button
                          type="button"
                          onClick={() => requeueQueueItem(job.id)}
                          aria-label={`Re-queue ${job.label}`}
                          title="Reset back to Pending"
                          className={cn(
                            "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] font-medium",
                            norm === "error"
                              ? "border-rose-400/50 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20"
                              : "border-line bg-surface text-muted hover:text-fg",
                          )}
                        >
                          <RotateCcw className="size-2.5" />
                          {norm === "error" ? "Retry" : "Re-queue"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Per-Job Real-Time Status Bar (Pending / Processing / Failed / Completed) */}
                <div className="space-y-1">
                  <div
                    role="progressbar"
                    data-testid={`queue-item-statusbar-${idx}`}
                    data-status={statusLabel}
                    aria-label={`${job.label} status: ${statusLabel}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={visual.barWidthPct}
                    className="h-1.5 w-full overflow-hidden rounded-full bg-black/10"
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        norm === "processing"
                          ? "bg-gradient-to-r from-[#b08a45] via-[#e7c27a] to-[#b08a45]"
                          : norm === "completed"
                            ? "bg-emerald-600"
                            : norm === "error"
                              ? "bg-rose-500"
                              : "bg-[#9e8f7b]/70",
                      )}
                      style={{ width: `${visual.barWidthPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span
                      className={cn(
                        "truncate",
                        norm === "error" ? "font-medium text-rose-700" : norm === "processing" ? "font-medium text-[#785314]" : "text-faint",
                      )}
                    >
                      {liveStatusHint}
                    </span>
                    <span className="shrink-0 font-mono tabular-nums text-faint">
                      {visual.barWidthPct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
