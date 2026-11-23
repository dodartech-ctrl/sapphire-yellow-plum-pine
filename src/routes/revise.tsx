import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, FolderOpen, Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StepBrief } from "@/components/revision/step-brief";
import { StepDeliver } from "@/components/revision/step-deliver";
import { StepMasks } from "@/components/revision/step-masks";
import { StepRevise } from "@/components/revision/step-revise";
import { StepViews } from "@/components/revision/step-views";
import { btnGhost, btnPrimary, Card, input } from "@/components/revision/ui";
import { createSampleProject, targetViews, acceptedFor } from "@/lib/revision/engine";
import { useHydrated } from "@/lib/store";
import { useRevision, type RevProject } from "@/lib/revision/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/revise")({
  head: () => ({ meta: [{ title: "Revision Studio · Oriel" }] }),
  component: RevisePage,
});

const STEPS = [
  { title: "Add views", why: "The approved renders, one per camera angle." },
  { title: "Confirm the change", why: "Read the client's feedback into a checklist; add the finish." },
  { title: "Mark what changes", why: "Select the surface in each view and protect what must not move." },
  { title: "Quote, revise, inspect", why: "See the price ceiling, generate, then check nothing else changed." },
  { title: "Approve and deliver", why: "Freeze, get sign-off, export the approved set and its record." },
] as const;

function reachable(project: RevProject, step: number): boolean {
  if (step === 0) return true;
  if (step === 1) return project.views.length > 0;
  if (step === 2) return project.views.length > 0 && project.briefConfirmed;
  if (step === 3) return project.views.length > 0 && project.briefConfirmed && project.surfaces.length > 0;
  const views = targetViews(project);
  return project.sets.length > 0 || (views.length > 0 && views.every((v) => acceptedFor(project, v.id)));
}

function Landing() {
  const projects = useRevision((s) => s.projects);
  const create = useRevision((s) => s.create);
  const open = useRevision((s) => s.open);
  const remove = useRevision((s) => s.remove);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);

  async function sample() {
    setBusy(true);
    try {
      await createSampleProject();
      toast.success("Sample loaded: two renders, the wall marked, the artwork and lamp protected. Next: quote and revise.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load the sample.");
    }
    setBusy(false);
  }

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wide text-bronze">Revision Studio</p>
          <h1 className="mt-1 font-syne text-3xl font-bold md:text-4xl">Change one thing. Prove nothing else moved.</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            A client asks to change a finish on a render you already delivered. Bring the approved views, mark exactly what may change and what must stay, and get coordinated revisions plus a record of what the client approved.
          </p>
        </header>

        <Card title="How it works">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-line bg-raised p-3 text-xs">
                <span className="font-syne text-lg font-bold text-bronze">{i + 1}</span>
                <p className="mt-1 font-semibold">{s.title}</p>
                <p className="mt-1 text-muted">{s.why}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card title="Start">
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              create(name);
              setName("");
            }}
          >
            <input className={`${input} max-w-sm`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Client or project name" aria-label="Project name" data-testid="new-project-name" />
            <button type="submit" className={btnPrimary} data-testid="new-project">
              <Plus className="size-4" /> New revision project
            </button>
            <button type="button" className={btnGhost} disabled={busy} onClick={() => void sample()} data-testid="try-sample">
              <Sparkles className="size-4" /> {busy ? "Loading sample…" : "Try a sample project"}
            </button>
          </form>
          <p className="mt-2 text-[11px] text-faint">Projects and images stay in this browser. Only a client review link you create sends the frozen before/after to the server.</p>
        </Card>

        <Card title={`Your projects (${projects.length})`}>
          {projects.length === 0 ? (
            <p className="rounded-xl border border-dashed border-line px-4 py-6 text-sm text-muted">No projects yet. Start one above, or try the sample to see the whole flow in a minute.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-raised px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block text-xs text-faint">
                      {p.views.length} view{p.views.length === 1 ? "" : "s"} · {p.sets.length} frozen set{p.sets.length === 1 ? "" : "s"} · {new Date(p.updatedAt).toLocaleDateString()}
                    </span>
                  </span>
                  <button type="button" className="inline-flex items-center gap-1 text-sm font-medium text-bronze hover:underline" onClick={() => open(p.id)}>
                    <FolderOpen className="size-4" /> Open
                  </button>
                  {confirm === p.id ? (
                    <>
                      <button type="button" className="text-sm font-medium text-terracotta hover:underline" onClick={() => { remove(p.id); setConfirm(null); }}>
                        Confirm delete
                      </button>
                      <button type="button" className="text-sm text-muted" onClick={() => setConfirm(null)}>Cancel</button>
                    </>
                  ) : (
                    <button type="button" aria-label={`Delete ${p.name}`} className="text-muted hover:text-fg" onClick={() => setConfirm(p.id)}>
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}

function Workspace({ project }: { project: RevProject }) {
  const patch = useRevision((s) => s.patch);
  const step = Math.min(project.step, STEPS.length - 1);
  const go = (n: number) => patch(project.id, { step: Math.max(0, Math.min(STEPS.length - 1, n)) });

  return (
    <main className="h-full overflow-y-auto px-4 py-5 md:px-8" data-testid="revision-workspace">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="sr-only">Revision Studio: {project.name}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btnGhost} onClick={() => useRevision.setState({ activeId: null })}>
            <ArrowLeft className="size-4" /> All projects
          </button>
          <input
            aria-label="Project name"
            className={`${input} max-w-sm font-semibold`}
            defaultValue={project.name}
            key={project.id}
            onBlur={(e) => patch(project.id, { name: e.target.value.trim().slice(0, 60) || project.name })}
          />
        </div>

        <nav aria-label="Revision steps">
          <ol className="grid grid-cols-5 gap-1.5" data-testid="revision-stepper">
            {STEPS.map((s, i) => {
              const ok = reachable(project, i);
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    disabled={!ok}
                    aria-current={i === step ? "step" : undefined}
                    onClick={() => go(i)}
                    title={s.why}
                    className={cn(
                      "flex h-full w-full flex-col items-start gap-0.5 rounded-xl border px-2.5 py-2 text-left text-[11px] font-semibold sm:text-xs",
                      i === step ? "border-lime bg-lime/20" : "border-line",
                      !ok && "cursor-not-allowed opacity-45",
                    )}
                  >
                    <span className="text-[10px] text-faint">Step {i + 1}</span>
                    <span className="leading-tight">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <p className="text-xs text-muted">{STEPS[step].why}</p>

        {step === 0 ? <StepViews project={project} onNext={() => go(1)} /> : null}
        {step === 1 ? <StepBrief project={project} onNext={() => go(2)} onBack={() => go(0)} /> : null}
        {step === 2 ? <StepMasks project={project} onNext={() => go(3)} onBack={() => go(1)} /> : null}
        {step === 3 ? <StepRevise project={project} onNext={() => go(4)} onBack={() => go(2)} /> : null}
        {step === 4 ? <StepDeliver project={project} onBack={() => go(3)} /> : null}
      </div>
    </main>
  );
}

function RevisePage() {
  const hydrated = useHydrated();
  const project = useRevision((s) => s.projects.find((p) => p.id === s.activeId) ?? null);
  const reconcile = useRevision((s) => s.reconcile);

  useEffect(() => {
    reconcile();
  }, [reconcile]);

  if (!hydrated) return <main className="h-full" aria-busy="true" />;
  return project ? <Workspace project={project} /> : <Landing />;
}
