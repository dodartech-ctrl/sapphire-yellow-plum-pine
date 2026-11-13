import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Layers,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  Square,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getQueueStats } from "@/lib/archviz-suite";
import {
  CAMERA_PRESETS_3D,
  WORKFLOW_PRESETS,
  normalizeQueueStatus,
  queueStatusLabel,
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
  const upload = useOriel((state) => state.upload);
  const enqueueRender = useOriel((state) => state.enqueueRender);
  const removeQueueItem = useOriel((state) => state.removeQueueItem);
  const clearCompletedQueue = useOriel((state) => state.clearCompletedQueue);
  const retryFailedQueue = useOriel((state) => state.retryFailedQueue);
  const clearQueue = useOriel((state) => state.clearQueue);
  const setPlate = useOriel((state) => state.setPlate);

  const { batchRunning, runSequentialQueue, stopSequentialQueue, queueBatchMatrix } = useGenerate();

  const [sceneLabel, setSceneLabel] = useState("");
  const [scenePreset, setScenePreset] = useState<WorkflowPreset>(engine.workflowPreset);
  const [sceneLight, setSceneLight] = useState<string>(design.light);
  const [sceneCamera, setSceneCamera] = useState<CameraPreset3D>(scene3d.cameraPreset);
  const [sceneNote, setSceneNote] = useState("");

  const stats = getQueueStats(queue);
  const progressPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  function handleAddPending(event: React.FormEvent) {
    event.preventDefault();
    const label = sceneLabel.trim() || `${design.look} · ${sceneLight} (${sceneCamera})`;
    enqueueRender(label, scenePreset, sceneLight, {
      cameraPreset: sceneCamera,
      promptNote: sceneNote.trim() || undefined,
      status: "pending",
    });
    setSceneLabel("");
    setSceneNote("");
    toast.success(`Added "${label}" as Pending`);
  }

  return (
    <section
      data-testid="batch-render-queue"
      aria-label="Batch Render Queue"
      className="rounded-2xl border border-line bg-surface p-3.5 shadow-sm"
    >
      {/* Header & Queue Counters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Clock className="size-4 text-[#b08a45]" />
          <h3 className="font-serif text-base font-semibold text-fg">Batch Render Queue</h3>
          <span className="font-mono text-[11px] tabular-nums text-muted">
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
              disabled={stats.pending === 0}
              onClick={() => void runSequentialQueue()}
              className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-semibold text-[#2a1c0c] disabled:opacity-45"
            >
              <Play className="size-3.5" /> Run Sequential ({stats.pending})
            </button>
          )}
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
              onClick={retryFailedQueue}
              className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-2.5 text-[11px] text-muted hover:text-fg"
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
              aria-label="Hide batch queue"
              className="grid size-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-fg"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Sequential Progress Bar */}
      {stats.total > 0 ? (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
            <div
              className="h-full rounded-full bg-[#b08a45] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-mono text-[10px] tabular-nums text-faint">
            {stats.completed}/{stats.total} ({progressPct}%)
          </span>
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
          className="h-8 min-w-[160px] flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
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
          type="text"
          value={sceneNote}
          onChange={(e) => setSceneNote(e.target.value)}
          placeholder="Optional note (e.g. wet stone plaza)"
          aria-label="Queue scene note"
          className="h-8 min-w-[150px] flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
        />
        <button
          type="submit"
          className="hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-surface px-3 text-xs font-medium text-fg"
        >
          <Plus className="size-3.5 text-[#b08a45]" /> Add Pending
        </button>
      </form>

      {/* Queued Items List */}
      {queue.length === 0 ? (
        <p className="mt-2.5 text-center text-xs text-faint">
          No queued architectural views yet. Add scenes above or queue a 4-Hour Sun Study / 3-Camera Matrix to process sequentially.
        </p>
      ) : (
        <div className="mt-2.5 max-h-60 space-y-1.5 overflow-y-auto pr-0.5">
          {queue.map((job, idx) => {
            const norm = normalizeQueueStatus(job.status);
            const label = queueStatusLabel(job.status);
            return (
              <div
                key={job.id}
                data-queue-status={label}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-2 transition",
                  norm === "processing"
                    ? "border-[#d4b06a] bg-[#fff8eb]"
                    : norm === "completed"
                      ? "border-emerald-600/30 bg-raised/50"
                      : norm === "error"
                        ? "border-rose-500/40 bg-rose-50/40"
                        : "border-line bg-raised/40",
                )}
              >
                <span className="w-5 shrink-0 text-center font-mono text-[10px] tabular-nums text-faint">
                  #{idx + 1}
                </span>

                <button
                  type="button"
                  disabled={!job.url}
                  onClick={() => {
                    if (!job.url) return;
                    setPlate({ url: job.url, upload: upload ?? undefined, templateId: job.preset, idea: job.label });
                    window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
                  }}
                  className="size-11 shrink-0 overflow-hidden rounded-lg border border-line bg-[#1c1915] disabled:cursor-default"
                  title={job.url ? "Load completed render into Studio stage" : job.label}
                >
                  {job.url ? (
                    <img src={job.url} alt={job.label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[#e7c27a]">
                      {norm === "processing" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : norm === "error" ? (
                        <AlertCircle className="size-4 text-rose-400" />
                      ) : (
                        <Layers className="size-4 opacity-70" />
                      )}
                    </div>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-xs font-medium text-fg">{job.label}</p>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[11px] font-semibold",
                        norm === "processing"
                          ? "text-[#9a6f23]"
                          : norm === "completed"
                            ? "text-emerald-700"
                            : norm === "error"
                              ? "text-rose-700"
                              : "text-muted",
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
                      {label}
                    </span>
                  </div>
                  <p className="truncate font-mono text-[10px] text-faint">
                    {job.preset} · {job.light}
                    {job.cameraPreset ? ` · ${job.cameraPreset}` : ""}
                    {job.durationMs ? ` · ${(job.durationMs / 1000).toFixed(1)}s` : ""}
                    {job.errorMessage ? ` · ${job.errorMessage}` : ""}
                  </p>
                </div>

                {job.url ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPlate({ url: job.url!, upload: upload ?? undefined, templateId: job.preset, idea: job.label });
                      window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
                    }}
                    className="h-7 shrink-0 whitespace-nowrap rounded-full border border-line bg-surface px-2.5 text-[11px] font-medium text-fg hover:border-[#d4b06a]"
                  >
                    Inspect
                  </button>
                ) : null}

                <button
                  type="button"
                  disabled={norm === "processing"}
                  onClick={() => removeQueueItem(job.id)}
                  aria-label={`Remove ${job.label} from queue`}
                  className="grid size-7 shrink-0 place-items-center rounded-full text-faint hover:bg-surface hover:text-fg disabled:opacity-40"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
