import { Check, Copy, Download, GitBranch, Link2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { rasterFromDataUrl, rasterToJpegDataUrl } from "@/lib/revision/browser";
import { designerApprove, freezeSet, restoreSet, setDesignerMinutes, setImages, startBranch, targetViews, acceptedFor } from "@/lib/revision/engine";
import { exportApproved, latestValidApproval } from "@/lib/revision/export";
import { summarizeCosts } from "@/lib/revision/quote";
import { createReviewFn, getReviewFn } from "@/lib/revision/review-api";
import type { ReviewDecision } from "@/lib/revision/review-types";
import { useRevision, type RevProject } from "@/lib/revision/store";
import { approveSet, lineage, type VersionSet } from "@/lib/revision/versions";
import { cn } from "@/lib/utils";
import { btnGhost, btnPrimary, Card, Field, input, Pill, textarea } from "./ui";

const shortId = (id: string) => id.slice(0, 10);

function CostPanel({ project }: { project: RevProject }) {
  const summary = summarizeCosts(project.costs, project.designerMinutes);
  return (
    <Card title="Cost history" hint="Every attempt, including failed and rejected ones, plus your own correction time.">
      <dl className="grid gap-3 text-sm sm:grid-cols-4" data-testid="cost-summary">
        <div><dt className="text-xs text-muted">Attempts</dt><dd className="font-semibold">{summary.attempts}</dd></div>
        <div><dt className="text-xs text-muted">Failed or rejected</dt><dd className="font-semibold">{summary.failedOrRejected}</dd></div>
        <div><dt className="text-xs text-muted">Credits spent</dt><dd className="font-semibold">{summary.credits}</dd></div>
        <div><dt className="text-xs text-muted">Credits per accepted view</dt><dd className="font-semibold">{summary.creditsPerAccepted === null ? "–" : summary.creditsPerAccepted.toFixed(0)}</dd></div>
      </dl>
      <div className="mt-3 max-w-xs">
        <Field label="Your correction time (minutes)" hint="Manual time spent fixing results. Used to judge whether this saves time.">
          <input className={input} type="number" min={0} value={project.designerMinutes} onChange={(e) => setDesignerMinutes(project.id, Number(e.target.value))} aria-label="Designer correction minutes" />
        </Field>
      </div>
      {project.costs.length ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-muted">
              <tr><th className="py-1 pr-3">View</th><th className="pr-3">Attempt</th><th className="pr-3">Route</th><th className="pr-3">Credits</th><th className="pr-3">Time</th><th>Outcome</th></tr>
            </thead>
            <tbody>
              {project.costs.map((c) => (
                <tr key={c.id} className="border-t border-line">
                  <td className="py-1 pr-3">{project.views.find((v) => v.id === c.viewId)?.name ?? c.viewId}</td>
                  <td className="pr-3">{c.attempt}</td>
                  <td className="pr-3">{c.provider === "ai" ? "AI" : "Offline preview"}</td>
                  <td className="pr-3">{c.credits}</td>
                  <td className="pr-3">{(c.elapsedMs / 1000).toFixed(1)}s</td>
                  <td className="capitalize">{c.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}

export function StepDeliver({ project, onBack }: { project: RevProject; onBack: () => void }) {
  const patch = useRevision((s) => s.patch);
  const [busy, setBusy] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [branchName, setBranchName] = useState("");
  const [decisions, setDecisions] = useState<ReviewDecision[]>([]);
  const active = project.sets.find((s) => s.id === project.activeSetId) ?? null;
  const approval = active ? latestValidApproval(project, active) : null;
  const views = targetViews(project);
  const readyToFreeze = views.length > 0 && views.every((v) => acceptedFor(project, v.id));
  const link = project.review ? `${typeof window !== "undefined" ? window.location.origin : ""}/review/${project.review.shareId}` : "";
  const reviewIsForActive = Boolean(project.review && active && project.review.setId === active.id);

  const refresh = useCallback(async () => {
    if (!project.review) return;
    const payload = await getReviewFn({ data: { shareId: project.review.shareId } }).catch(() => null);
    if (!payload) return;
    setDecisions(payload.decisions);
    // A client "approved" decision becomes an approval bound to that exact set id.
    const store = useRevision.getState();
    for (const d of payload.decisions) {
      const set = store.projects.find((p) => p.id === project.id)?.sets.find((s) => s.id === d.setId);
      if (!set || d.decision !== "approved") continue;
      const at = Date.parse(d.createdAt);
      const have = store.projects.find((p) => p.id === project.id)?.approvals.some((a) => a.setId === d.setId && a.approver === d.reviewerName && a.at === at);
      if (!have) {
        const a = approveSet(set, { decision: "approved", approver: d.reviewerName, note: d.note, source: "client-link", at });
        store.patch(project.id, (cur) => ({ approvals: [...cur.approvals, a] }));
        toast.success(`${d.reviewerName} approved this set.`);
      }
    }
  }, [project.id, project.review]);

  useEffect(() => {
    void refresh();
    if (!project.review) return;
    const t = window.setInterval(() => void refresh(), 20000);
    return () => window.clearInterval(t);
  }, [project.review, refresh]);

  async function freeze() {
    setBusy("freeze");
    try {
      const set = await freezeSet(project.id);
      toast.success(`Set frozen (${shortId(set.id)}). Its images can no longer be replaced.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not freeze the set.");
    }
    setBusy("");
  }

  async function createLink(set: VersionSet) {
    setBusy("link");
    try {
      const raw = await setImages(project.id, set);
      const images = [];
      for (const img of raw) {
        if (!img.before || !img.after) throw new Error(`The stored images for “${img.name}” are missing.`);
        const [b, a] = await Promise.all([rasterFromDataUrl(img.before, 1280), rasterFromDataUrl(img.after, 1280)]);
        images.push({ viewId: img.viewId, name: img.name, before: rasterToJpegDataUrl(b, 0.85), after: rasterToJpegDataUrl(a, 0.85) });
      }
      const { shareId } = await createReviewFn({ data: { projectName: project.name, changeRequest: project.feedback, finish: set.finish, set, images } });
      patch(project.id, { review: { shareId, setId: set.id, createdAt: Date.now() } });
      toast.success("Private review link created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create the link.");
    }
    setBusy("");
  }

  const sets = useMemo(() => [...project.sets].sort((a, b) => b.createdAt - a.createdAt), [project.sets]);

  return (
    <div className="space-y-4">
      <Card title="1. Freeze the accepted set" hint="Freezing locks the accepted previews into one immutable version. A newer draft can never silently replace it.">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={btnPrimary} disabled={!readyToFreeze || busy === "freeze"} onClick={() => void freeze()} data-testid="freeze-set">
            Freeze this set
          </button>
          {!readyToFreeze ? <Pill tone="warn">Accept a preview for every view first</Pill> : null}
        </div>
        {sets.length ? (
          <ul className="mt-3 space-y-2" data-testid="set-list">
            {sets.map((s) => {
              const valid = latestValidApproval(project, s);
              return (
                <li key={s.id} className={cn("flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-xs", s.id === project.activeSetId ? "border-lime bg-lime/10" : "border-line")}>
                  <GitBranch className="size-3.5" />
                  <span className="font-semibold">{s.label}</span>
                  <span className="text-muted">branch {s.branch} · {shortId(s.id)}</span>
                  {valid ? <Pill tone="ok">Approved by {valid.approver}</Pill> : <Pill tone="idle">Not approved</Pill>}
                  {lineage(project.sets, s.id).length > 1 ? <span className="text-faint">{lineage(project.sets, s.id).length - 1} earlier</span> : null}
                  {s.id !== project.activeSetId ? (
                    <button type="button" className="ml-auto text-xs font-semibold text-bronze hover:underline" onClick={() => restoreSet(project.id, s.id)}>
                      Restore this version
                    </button>
                  ) : (
                    <span className="ml-auto text-faint">Active</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
        {active ? (
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <Field label="Try an alternative finish on a new branch">
              <input className={`${input} w-56`} value={branchName} onChange={(e) => setBranchName(e.target.value)} placeholder="e.g. oak-option" aria-label="New branch name" />
            </Field>
            <button type="button" className={btnGhost} onClick={() => { startBranch(project.id, branchName || "alternative"); setBranchName(""); toast.message("New branch started. The frozen set is untouched."); }}>
              Start branch
            </button>
          </div>
        ) : null}
      </Card>

      {active ? (
        <Card title="2. Get sign-off" hint="Send the client a private link, or record your own sign-off. An approval belongs to exactly this version.">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Client review link</p>
              {reviewIsForActive ? (
                <div className="space-y-2" data-testid="review-link-box">
                  <div className="flex items-center gap-2">
                    <input readOnly className={input} value={link} aria-label="Review link" onFocus={(e) => e.currentTarget.select()} />
                    <button type="button" className={btnGhost} onClick={() => void navigator.clipboard?.writeText(link).then(() => toast.success("Link copied"))}>
                      <Copy className="size-4" /> Copy
                    </button>
                  </div>
                  <button type="button" className={btnGhost} onClick={() => void refresh()}>
                    <RefreshCw className="size-4" /> Check for the client's decision
                  </button>
                </div>
              ) : (
                <button type="button" className={btnPrimary} disabled={busy === "link"} onClick={() => void createLink(active)} data-testid="create-review-link">
                  <Link2 className="size-4" /> {busy === "link" ? "Creating…" : "Create private review link"}
                </button>
              )}
              <p className="text-[11px] text-faint">Anyone with the link can view this before/after and respond. The link shows only this frozen version.</p>
              {decisions.length ? (
                <ul className="space-y-2" data-testid="decision-list">
                  {decisions.map((d) => (
                    <li key={d.id} className="rounded-xl border border-line bg-raised px-3 py-2 text-xs">
                      <p className="font-semibold">
                        {d.reviewerName}: {d.decision === "approved" ? "approved" : "requested changes"}
                        <span className="ml-2 font-normal text-faint">{new Date(d.createdAt).toLocaleString()}</span>
                      </p>
                      {d.note ? <p className="mt-0.5 text-muted">{d.note}</p> : null}
                      {d.pins.map((p, i) => <p key={i} className="text-muted">Pin on {project.views.find((v) => v.id === p.viewId)?.name ?? "view"}: {p.body}</p>)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Designer sign-off</p>
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Approver name" aria-label="Approver name" data-testid="approver-name" />
              <textarea className={textarea} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" aria-label="Approval note" />
              <button
                type="button"
                className={btnGhost}
                disabled={!name.trim()}
                data-testid="designer-approve"
                onClick={() => {
                  try {
                    designerApprove(project.id, active.id, name, note);
                    toast.success("Approved. This sign-off is bound to this exact version.");
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Could not approve.");
                  }
                }}
              >
                <Check className="size-4" /> Record approval
              </button>
            </div>
          </div>
        </Card>
      ) : null}

      {active ? (
        <Card title="3. Deliver" hint="Exports the approved images, a one-page finish and change record (PDF), and a machine-readable record with hashes.">
          <button
            type="button"
            className={btnPrimary}
            disabled={!approval || busy === "export"}
            data-testid="export-approved"
            onClick={() => {
              if (!approval) return;
              setBusy("export");
              void exportApproved(project, active, approval)
                .then(() => toast.success("Exported the approved set and its record."))
                .catch((error) => toast.error(error instanceof Error ? error.message : "Export failed."))
                .finally(() => setBusy(""));
            }}
          >
            <Download className="size-4" /> Export approved set
          </button>
          {!approval ? <p className="mt-2 text-xs text-muted">Export unlocks once this exact version is approved.</p> : <p className="mt-2 text-xs text-muted">Approved by {approval.approver}.</p>}
        </Card>
      ) : null}

      <CostPanel project={project} />

      <div className="flex">
        <button type="button" className={btnGhost} onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
