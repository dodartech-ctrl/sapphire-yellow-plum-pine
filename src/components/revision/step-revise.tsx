import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { acceptCandidate, acceptedFor, approveQuote, rejectCandidate, requestQuote, runView, targetViews } from "@/lib/revision/engine";
import type { Candidate, RevProject, RevView } from "@/lib/revision/store";
import { cn } from "@/lib/utils";
import { DiffInspector } from "./diff-inspector";
import { btnGhost, btnPrimary, Card, Pill, useBlobUrl } from "./ui";

function CandidateRow({ project, view, candidate, onOpen, open }: { project: RevProject; view: RevView; candidate: Candidate; onOpen: () => void; open: boolean }) {
  const src = useBlobUrl(candidate.resultKey);
  const stale = candidate.note.startsWith("Mask changed");
  return (
    <li className={cn("rounded-2xl border p-3", candidate.status === "accepted" ? "border-[#5f8a62]/60 bg-[#5f8a62]/10" : "border-line bg-raised")} data-testid="candidate-row">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onOpen} aria-label="Inspect this preview" className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-black/20">
          {src ? <img src={src} alt={`${view.name}, attempt ${candidate.attempt}`} className="h-full w-full object-cover" /> : null}
        </button>
        <div className="min-w-0 flex-1 text-xs">
          <p className="font-semibold">
            Attempt {candidate.attempt} · {candidate.provider === "ai" ? "AI revision" : "Offline preview"}
          </p>
          <p className="mt-0.5 flex flex-wrap items-center gap-1.5">
            {candidate.gate.pass ? <Pill tone="ok">Gate passed</Pill> : <Pill tone="bad">Gate failed</Pill>}
            {candidate.status === "accepted" ? <Pill tone="ok">Accepted</Pill> : null}
            {candidate.status === "rejected" ? <Pill tone="idle">Rejected</Pill> : null}
            {stale ? <Pill tone="warn">Mask changed: re-run</Pill> : null}
            <span className="text-faint">
              {candidate.credits} credits · {(candidate.elapsedMs / 1000).toFixed(1)}s
            </span>
          </p>
          <p className="mt-1 text-muted">{candidate.note}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={btnGhost}
            disabled={candidate.status === "accepted" || !candidate.gate.pass || stale}
            onClick={() => {
              const problem = acceptCandidate(project.id, candidate.id);
              if (problem) toast.error(problem);
              else toast.success(`${view.name} accepted. Other views are untouched.`);
            }}
            data-testid="accept-candidate"
          >
            Accept
          </button>
          <button type="button" className={btnGhost} disabled={candidate.status === "rejected"} onClick={() => rejectCandidate(project.id, candidate.id)}>
            Reject
          </button>
        </div>
      </div>
      {open ? (
        <div className="mt-3">
          <DiffInspector project={project} view={view} candidate={candidate} />
        </div>
      ) : null}
    </li>
  );
}

export function StepRevise({ project, onNext, onBack }: { project: RevProject; onNext: () => void; onBack: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const views = targetViews(project);
  const quote = project.quote;
  const spent = project.costs.reduce((sum, c) => sum + c.credits, 0);
  const allAccepted = views.length > 0 && views.every((v) => acceptedFor(project, v.id));

  async function run(view: RevView) {
    if (busy) return;
    setBusy(view.id);
    const result = await runView(project.id, view.id);
    setBusy(null);
    if (!result.ok) {
      if (result.duplicate) toast.message(result.reason);
      else toast.error(result.reason);
      return;
    }
    setOpenId(result.candidate.id);
    toast.success(
      result.candidate.gate.pass
        ? `${view.name}: preview ready. Nothing outside the editable area changed.`
        : `${view.name}: the gate FAILED. Pixels outside the editable area changed; it cannot be accepted.`,
    );
  }

  return (
    <div className="space-y-4">
      <Card title="Quote the job" hint="You see the most this can charge before anything runs. If the AI model is not available, the offline preview runs and costs nothing.">
        {!quote ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted">
              {views.length} view{views.length === 1 ? "" : "s"} · 1 preview each · 1 correction included
            </p>
            <button type="button" className={btnPrimary} onClick={() => requestQuote(project.id)} data-testid="request-quote">
              Get a quote
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3" data-testid="quote-card">
            <div className="text-sm">
              <p className="font-semibold">
                Up to {quote.ceilingCredits} credits <span className="font-normal text-muted">({quote.viewIds.length * quote.previewsPerView + quote.retryAllowance} attempts × {quote.unitCredits})</span>
              </p>
              <p className="text-xs text-muted">Spent so far: {spent} credits. Approval fixes this scope; extra work needs a new quote.</p>
            </div>
            {project.quoteApproved ? (
              <Pill tone="ok">Approved</Pill>
            ) : (
              <button type="button" className={btnPrimary} onClick={() => approveQuote(project.id)} data-testid="approve-quote">
                Approve quote
              </button>
            )}
            <button type="button" className={btnGhost} onClick={() => requestQuote(project.id)}>
              Re-quote
            </button>
          </div>
        )}
      </Card>

      {views.map((view) => {
        const cands = project.candidates.filter((c) => c.viewId === view.id).sort((a, b) => b.attempt - a.attempt);
        const accepted = acceptedFor(project, view.id);
        return (
          <Card key={view.id} title={view.name} hint={accepted ? "Accepted. Re-running another view will not change this one." : "No accepted preview yet."}>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className={btnPrimary} disabled={!project.quoteApproved || busy !== null} onClick={() => void run(view)} data-testid="run-view">
                {busy === view.id ? <Loader2 className="size-4 animate-spin" /> : null}
                {cands.length ? "Retry this view" : "Generate preview"}
              </button>
              {!project.quoteApproved ? <span className="text-xs text-muted">Approve the quote first.</span> : null}
            </div>
            {cands.length ? (
              <ul className="mt-3 space-y-2">
                {cands.map((c) => (
                  <CandidateRow key={c.id} project={project} view={view} candidate={c} open={openId === c.id} onOpen={() => setOpenId(openId === c.id ? null : c.id)} />
                ))}
              </ul>
            ) : null}
          </Card>
        );
      })}

      <div className="flex items-center justify-between gap-2">
        <button type="button" className={btnGhost} onClick={onBack}>
          Back
        </button>
        <div className="flex items-center gap-2">
          {allAccepted ? <Pill tone="ok">All views accepted</Pill> : <Pill tone="warn">Accept a preview for every view</Pill>}
          <button type="button" className={btnPrimary} disabled={!allAccepted} onClick={onNext} data-testid="next-step">
            Next: review and deliver
          </button>
        </div>
      </div>
    </div>
  );
}
