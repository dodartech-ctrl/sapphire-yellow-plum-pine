import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { addViewFromFile, DuplicateViewError, removeView, renameView } from "@/lib/revision/engine";
import type { RevProject, RevView } from "@/lib/revision/store";
import { btnPrimary, Card, input, Pill, useBlobUrl } from "./ui";

function ViewTile({ projectId, view }: { projectId: string; view: RevView }) {
  const src = useBlobUrl(view.workingKey);
  return (
    <li className="rounded-2xl border border-line bg-raised p-3" data-testid="view-tile">
      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/20">
        {src ? <img src={src} alt={view.name} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          aria-label="Camera angle name"
          defaultValue={view.name}
          onBlur={(e) => renameView(projectId, view.id, e.target.value)}
          className={`${input} h-9`}
        />
        <button type="button" aria-label={`Remove ${view.name}`} onClick={() => void removeView(projectId, view.id)} className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted hover:text-fg">
          <Trash2 className="size-4" />
        </button>
      </div>
      <p className="mt-1 text-[11px] text-faint">
        {view.width} × {view.height}px working copy. Your original is kept exactly as uploaded.
      </p>
    </li>
  );
}

export function StepViews({ project, onNext }: { project: RevProject; onNext: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    for (const file of Array.from(files)) {
      try {
        await addViewFromFile(project.id, file.name.replace(/\.[^.]+$/, "").slice(0, 30), file);
      } catch (error) {
        toast.error(error instanceof DuplicateViewError ? error.message : error instanceof Error ? error.message : "Could not add that image.");
      }
    }
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-4">
      <Card
        title="Add the approved views"
        hint="Upload the renders the client already approved (PNG or JPEG), one per camera angle, and name each angle. Two views is the usual case."
      >
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" multiple className="sr-only" aria-label="Upload views" data-testid="views-file-input" onChange={(e) => void onFiles(e.target.files)} />
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className={btnPrimary}>
          <ImagePlus className="size-4" /> {busy ? "Adding…" : "Upload views"}
        </button>
        {project.views.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-line px-4 py-6 text-sm text-muted">
            No views yet. Add at least one to begin. Identical images are detected so the same view is never added twice.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.views.map((view) => (
              <ViewTile key={view.id} projectId={project.id} view={view} />
            ))}
          </ul>
        )}
      </Card>
      <div className="flex items-center justify-between">
        <Pill tone={project.views.length ? "ok" : "idle"}>{project.views.length} view{project.views.length === 1 ? "" : "s"}</Pill>
        <button type="button" disabled={!project.views.length} onClick={onNext} className={btnPrimary} data-testid="next-step">
          Next: confirm the change
        </button>
      </div>
      <p className="text-[11px] text-faint">Tip: you can also keep this project private. Everything stays in this browser until you create a client review link.</p>
    </div>
  );
}
