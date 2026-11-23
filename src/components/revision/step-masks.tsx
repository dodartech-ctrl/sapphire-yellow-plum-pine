import { EyeOff, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  addSurface,
  loadEditable,
  loadProtected,
  removeSurface,
  renameSurface,
  saveEditable,
  saveProtected,
  setSurfaceVisible,
  viewsMissingTarget,
  workingRaster,
} from "@/lib/revision/engine";
import type { Mask, Raster } from "@/lib/revision/pixels";
import { useRevision, type RevProject } from "@/lib/revision/store";
import { cn } from "@/lib/utils";
import { MaskEditor } from "./mask-editor";
import { btnGhost, btnPrimary, Card, input, Pill } from "./ui";

export function StepMasks({ project, onNext, onBack }: { project: RevProject; onNext: () => void; onBack: () => void }) {
  const [viewId, setViewId] = useState(project.views[0]?.id ?? "");
  const [base, setBase] = useState<Raster | null>(null);
  const [editable, setEditable] = useState<Mask | null>(null);
  const [prot, setProt] = useState<Mask | null>(null);
  const [others, setOthers] = useState<Mask[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [loadError, setLoadError] = useState("");

  const view = project.views.find((v) => v.id === viewId) ?? project.views[0];
  const surface = project.surfaces.find((s) => s.id === project.activeSurfaceId) ?? project.surfaces[0];
  const hiddenHere = Boolean(surface && view && surface.visible[view.id] === false);

  // Create a first surface named from the brief so the designer starts with something sensible.
  useEffect(() => {
    if (!project.surfaces.length && project.views.length) {
      const name = project.brief?.targets[0] ? project.brief.targets[0].replace(/^\w/, (c) => c.toUpperCase()) : "Surface";
      addSurface(project.id, name);
    }
  }, [project.id, project.surfaces.length, project.views.length, project.brief]);

  useEffect(() => {
    if (!view || !surface) return;
    let live = true;
    setLoadError("");
    void (async () => {
      try {
        const [raster, e, p] = await Promise.all([workingRaster(view), loadEditable(project.id, surface.id, view), loadProtected(project.id, view)]);
        const siblings = await Promise.all(project.surfaces.filter((s) => s.id !== surface.id && s.visible[view.id] !== false).map((s) => loadEditable(project.id, s.id, view)));
        if (live) {
          setBase(raster);
          setEditable(e);
          setProt(p);
          setOthers(siblings);
        }
      } catch (error) {
        if (live) setLoadError(error instanceof Error ? error.message : "Could not load this view.");
      }
    })();
    return () => {
      live = false;
    };
  }, [project.id, view, surface, project.surfaces]);

  useEffect(() => {
    let live = true;
    void viewsMissingTarget(project).then((list) => live && setMissing(list.map((v) => v.name)));
    return () => {
      live = false;
    };
  }, [project, project.maskRev]);

  if (!view) return <Card>Add at least one view first.</Card>;

  return (
    <div className="space-y-4">
      <Card
        title="Mark what changes, and what must not"
        hint="Name the surface once and link it across views. In each view, click or brush the surface (green) and brush over anything that must stay exactly as it is (red). Protection always wins."
      >
        <div className="flex flex-wrap items-center gap-2" data-testid="surface-list">
          {project.surfaces.map((s) => (
            <div key={s.id} className={cn("flex items-center gap-1 rounded-full border px-2 py-1", s.id === surface?.id ? "border-lime bg-lime/15" : "border-line")}>
              <button type="button" className="px-1 text-xs font-semibold" onClick={() => selectSurface(project.id, s.id)}>
                {s.name}
              </button>
              <button type="button" aria-label={`Remove ${s.name}`} onClick={() => removeSurface(project.id, s.id)} className="grid size-6 place-items-center text-muted hover:text-fg">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          <button type="button" className={btnGhost} onClick={() => addSurface(project.id, `Surface ${project.surfaces.length + 1}`)}>
            <Plus className="size-4" /> Add surface
          </button>
        </div>
        {surface ? (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <input aria-label="Surface name" className={`${input} max-w-xs`} defaultValue={surface.name} key={surface.id} onBlur={(e) => renameSurface(project.id, surface.id, e.target.value)} />
            <p className="text-[11px] text-faint">The same name is used in every view, so both angles share one finish.</p>
          </div>
        ) : null}
      </Card>

      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Views">
        {project.views.map((v) => {
          const isMissing = missing.includes(v.name);
          return (
            <button key={v.id} type="button" role="tab" aria-selected={v.id === view.id} onClick={() => setViewId(v.id)} className={cn("inline-flex h-10 items-center gap-2 rounded-full border px-4 text-xs font-semibold sm:h-9", v.id === view.id ? "border-lime bg-lime/20" : "border-line text-muted hover:text-fg")}>
              {v.name}
              {isMissing ? <Pill tone="warn">not marked</Pill> : <Pill tone="ok">marked</Pill>}
            </button>
          );
        })}
      </div>

      {surface ? (
        <label className="flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={hiddenHere} onChange={(e) => setSurfaceVisible(project.id, surface.id, view.id, !e.target.checked)} data-testid="not-visible" />
          <EyeOff className="size-3.5" /> “{surface.name}” is not visible in this view (hidden or occluded). This view will be skipped for it.
        </label>
      ) : null}

      {loadError ? <Card>{loadError}</Card> : null}
      {base && editable && prot && surface && !hiddenHere ? (
        <MaskEditor
          key={`${view.id}-${surface.id}`}
          base={base}
          editable={editable}
          others={others}
          protectedMask={prot}
          onCommit={(e, p) => {
            void saveEditable(project.id, surface.id, view, e);
            void saveProtected(project.id, view, p);
          }}
        />
      ) : hiddenHere ? (
        <Card>This surface is marked not visible in “{view.name}”. Nothing to mark here.</Card>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <button type="button" className={btnGhost} onClick={onBack}>
          Back
        </button>
        <div className="flex items-center gap-2">
          {missing.length ? <Pill tone="warn">Still to mark: {missing.join(", ")}</Pill> : <Pill tone="ok">Every view marked</Pill>}
          <button type="button" className={btnPrimary} disabled={missing.length > 0} onClick={onNext} data-testid="next-step">
            Next: quote and revise
          </button>
        </div>
      </div>
    </div>
  );
}

function selectSurface(projectId: string, surfaceId: string) {
  useRevision.getState().patch(projectId, { activeSurfaceId: surfaceId });
}
