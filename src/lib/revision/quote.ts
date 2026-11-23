/**
 * Job quote, idempotency and cost history. A quote fixes the scope before any
 * paid work; the same submission can never create a second billable job.
 */

export type Quote = {
  id: string;
  viewIds: string[];
  previewsPerView: number;
  retryAllowance: number;
  unitCredits: number;
  /** The most this job can charge. Approval fixes scope to this ceiling. */
  ceilingCredits: number;
  route: "ai" | "local";
  createdAt: number;
};

export function hashString(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export function makeQuote(input: {
  projectId: string;
  viewIds: string[];
  previewsPerView?: number;
  retryAllowance?: number;
  unitCredits: number;
  route: "ai" | "local";
  now?: number;
}): Quote {
  const previewsPerView = Math.max(1, input.previewsPerView ?? 1);
  const retryAllowance = Math.max(0, input.retryAllowance ?? 1);
  const attempts = input.viewIds.length * previewsPerView + retryAllowance;
  const createdAt = input.now ?? Date.now();
  return {
    id: `q-${hashString(`${input.projectId}|${input.viewIds.join(",")}|${previewsPerView}|${retryAllowance}|${input.unitCredits}|${createdAt}`)}`,
    viewIds: [...input.viewIds],
    previewsPerView,
    retryAllowance,
    unitCredits: input.unitCredits,
    ceilingCredits: attempts * input.unitCredits,
    route: input.route,
    createdAt,
  };
}

export type JobRequest = { viewId: string; attemptsSoFar: number; creditsSpent: number };

/** Does an approved quote cover this request? If not, the designer must request a new quote. */
export function quoteCovers(quote: Quote, request: JobRequest): { ok: true } | { ok: false; reason: string } {
  if (!quote.viewIds.includes(request.viewId)) return { ok: false, reason: "This view is outside the approved quote. Request a new quote." };
  const maxAttempts = quote.viewIds.length * quote.previewsPerView + quote.retryAllowance;
  if (request.attemptsSoFar >= maxAttempts) return { ok: false, reason: "The retry allowance is used up. Request a new quote to continue." };
  if (request.creditsSpent + quote.unitCredits > quote.ceilingCredits) return { ok: false, reason: "This would exceed the quoted ceiling. Request a new quote." };
  return { ok: true };
}

export function jobKey(parts: { projectId: string; setId: string; viewId: string; maskHash: string; finishId: string; attempt: number }): string {
  return `job-${hashString(Object.values(parts).join("|"))}`;
}

export type Job = {
  key: string;
  viewId: string;
  attempt: number;
  status: "running" | "done" | "failed";
  creditsCharged: number;
  startedAt: number;
  finishedAt?: number;
};

/**
 * Idempotent registration: submitting the same key twice returns the existing
 * job and flags `duplicate`, so a double click or a retry after a timeout never
 * starts (or bills) a second operation.
 */
export function registerJob(jobs: Record<string, Job>, key: string, make: () => Job): { jobs: Record<string, Job>; job: Job; duplicate: boolean } {
  const existing = jobs[key];
  if (existing) return { jobs, job: existing, duplicate: true };
  const job = make();
  return { jobs: { ...jobs, [key]: job }, job, duplicate: false };
}

export type CostEntry = {
  id: string;
  setId: string | null;
  viewId: string;
  attempt: number;
  provider: "local-preview" | "ai";
  credits: number;
  elapsedMs: number;
  outcome: "accepted" | "rejected" | "failed" | "pending";
  at: number;
};

export type CostSummary = {
  attempts: number;
  failedOrRejected: number;
  credits: number;
  elapsedMs: number;
  designerMinutes: number;
  /** Credits spent per accepted view, counting every failed attempt. */
  creditsPerAccepted: number | null;
};

export function summarizeCosts(entries: readonly CostEntry[], designerMinutes: number): CostSummary {
  const credits = entries.reduce((sum, e) => sum + e.credits, 0);
  const accepted = entries.filter((e) => e.outcome === "accepted").length;
  return {
    attempts: entries.length,
    failedOrRejected: entries.filter((e) => e.outcome === "failed" || e.outcome === "rejected").length,
    credits,
    elapsedMs: entries.reduce((sum, e) => sum + e.elapsedMs, 0),
    designerMinutes,
    creditsPerAccepted: accepted ? credits / accepted : null,
  };
}
