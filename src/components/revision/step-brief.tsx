import { Check, CircleHelp, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { analyseFeedback, emptyFinish, setFinishSwatch, updateFinish } from "@/lib/revision/engine";
import { useRevision, type RevProject } from "@/lib/revision/store";
import { btnGhost, btnPrimary, Card, Field, input, Pill, textarea, useBlobUrl } from "./ui";

export function StepBrief({ project, onNext, onBack }: { project: RevProject; onNext: () => void; onBack: () => void }) {
  const swatchRef = useRef<HTMLInputElement>(null);
  const swatchUrl = useBlobUrl(project.finish?.swatchKey);
  const finish = project.finish ?? emptyFinish();
  const brief = project.brief;
  const patch = useRevision((s) => s.patch);
  const ready = Boolean(finish.label.trim() || project.finish?.swatchKey);

  return (
    <div className="space-y-4">
      <Card title="Paste the client's feedback" hint="Oriel reads it into a checklist. Anything it cannot find stays blank for you to fill in; nothing is guessed.">
        <textarea
          className={textarea}
          rows={4}
          value={project.feedback}
          placeholder="e.g. Please make the upper cabinets walnut in both views, but keep the handles and the countertop."
          onChange={(e) => patch(project.id, { feedback: e.target.value, briefConfirmed: false })}
          aria-label="Client feedback"
          data-testid="feedback-input"
        />
        <div className="mt-2">
          <button type="button" className={btnGhost} disabled={!project.feedback.trim()} onClick={() => analyseFeedback(project.id, project.feedback)} data-testid="analyse-feedback">
            Read this into a checklist
          </button>
        </div>
        {brief ? (
          <ul className="mt-3 space-y-2" data-testid="brief-checklist">
            {brief.checklist.map((item) => (
              <li key={item.id} className="flex items-start gap-2 rounded-xl border border-line bg-raised px-3 py-2 text-sm">
                {item.status === "found" ? <Check className="mt-0.5 size-4 shrink-0 text-ok" /> : <CircleHelp className="mt-0.5 size-4 shrink-0 text-faint" />}
                <span className="min-w-0">
                  <span className="font-semibold">{item.label}: </span>
                  {item.value ? <span>{item.value}</span> : <span className="text-faint">not stated, you will mark it on the image</span>}
                </span>
              </li>
            ))}
            {brief.unknown.length ? <li className="text-[11px] text-muted">Open questions: {brief.unknown.join(" · ")}</li> : null}
          </ul>
        ) : null}
      </Card>

      <Card title="Finish board" hint="The approved sample the client chose. Supplier, SKU and grain are recorded only if you type them; blank stays blank.">
        <input ref={swatchRef} type="file" accept="image/*" className="sr-only" aria-label="Upload swatch" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void setFinishSwatch(project.id, file).catch((error) => toast.error(error instanceof Error ? error.message : "Could not read the swatch."));
          e.target.value = "";
        }} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Finish name">
            <input className={input} value={finish.label} onChange={(e) => updateFinish(project.id, { label: e.target.value })} placeholder="Walnut veneer" data-testid="finish-name" />
          </Field>
          <Field label="Reference role">
            <select className={input} value={finish.role} onChange={(e) => updateFinish(project.id, { role: e.target.value as typeof finish.role })}>
              <option value="material">Material (this is the surface finish)</option>
              <option value="lighting">Lighting (mood only)</option>
              <option value="furniture">Furniture (shape only)</option>
            </select>
          </Field>
          <Field label="Supplier (optional)">
            <input className={input} value={finish.supplier} onChange={(e) => updateFinish(project.id, { supplier: e.target.value })} />
          </Field>
          <Field label="SKU or code (optional)">
            <input className={input} value={finish.sku} onChange={(e) => updateFinish(project.id, { sku: e.target.value })} />
          </Field>
          <Field label="Grain direction (optional)">
            <input className={input} value={finish.grain} onChange={(e) => updateFinish(project.id, { grain: e.target.value })} placeholder="vertical / horizontal" />
          </Field>
          <Field label="Swatch colour" hint="Used by the offline preview. Uploading a sample sets it from the photo.">
            <div className="flex items-center gap-2">
              <input type="color" value={finish.color} onChange={(e) => updateFinish(project.id, { color: e.target.value })} aria-label="Swatch colour" className="h-10 w-14 rounded-lg border border-line bg-raised" />
              <button type="button" className={btnGhost} onClick={() => swatchRef.current?.click()}>
                <Upload className="size-4" /> Upload sample photo
              </button>
              {swatchUrl ? <img src={swatchUrl} alt="Swatch" className="size-10 rounded-lg border border-line object-cover" /> : null}
            </div>
          </Field>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <button type="button" className={btnGhost} onClick={onBack}>
          Back
        </button>
        <div className="flex items-center gap-2">
          {ready ? <Pill tone="ok">Ready</Pill> : <Pill tone="warn">Add a finish name or sample</Pill>}
          <button
            type="button"
            disabled={!ready}
            className={btnPrimary}
            data-testid="confirm-brief"
            onClick={() => {
              if (!project.brief) analyseFeedback(project.id, project.feedback);
              patch(project.id, { briefConfirmed: true });
              onNext();
            }}
          >
            Confirm and mark the surface
          </button>
        </div>
      </div>
    </div>
  );
}
