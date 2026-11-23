import { randomBytes, randomUUID } from "node:crypto";
import { MAX_IMAGE_CHARS, MAX_REVIEW_VIEWS, type ReviewDecision, type ReviewImage, type ReviewPayload, type ReviewPin } from "./review-types.ts";
import { verifySet, type FinishRecord, type VersionSet } from "./versions.ts";

async function sqlClient() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

let ready: Promise<void> | null = null;
async function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      const sql = await sqlClient();
      await sql`create table if not exists revision_reviews (
        id text primary key, project_name text not null, change_request text not null default '',
        finish_json jsonb not null, set_id text not null, set_json jsonb not null, images_json jsonb not null,
        created_at timestamptz not null default now())`;
      await sql`create table if not exists revision_decisions (
        id text primary key, review_id text not null references revision_reviews(id) on delete cascade,
        set_id text not null, decision text not null check (decision in ('approved', 'changes_requested')),
        reviewer_name text not null, note text not null default '', pins_json jsonb not null default '[]'::jsonb,
        created_at timestamptz not null default now())`;
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString());
const clean = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");
const parse = <T>(v: unknown): T => (typeof v === "string" ? (JSON.parse(v) as T) : (v as T));

type ReviewRow = { id: string; project_name: string; change_request: string; finish_json: unknown; set_json: unknown; images_json: unknown; created_at: unknown };
type DecisionRow = { id: string; set_id: string; decision: string; reviewer_name: string; note: string; pins_json: unknown; created_at: unknown };

function decisionOf(row: DecisionRow): ReviewDecision {
  return {
    id: row.id,
    setId: row.set_id,
    decision: row.decision === "approved" ? "approved" : "changes_requested",
    reviewerName: row.reviewer_name,
    note: row.note,
    pins: parse<ReviewPin[]>(row.pins_json) ?? [],
    createdAt: iso(row.created_at),
  };
}

export async function createReviewRecord(input: {
  projectName: string;
  changeRequest: string;
  finish: FinishRecord;
  set: VersionSet;
  images: ReviewImage[];
}): Promise<{ shareId: string }> {
  if (!(await verifySet(input.set))) throw new Error("This version set failed its integrity check and cannot be shared.");
  if (!input.images.length || input.images.length > MAX_REVIEW_VIEWS) throw new Error("A review needs between 1 and 6 views.");
  const images = input.images.map((img) => {
    const before = clean(img.before, MAX_IMAGE_CHARS);
    const after = clean(img.after, MAX_IMAGE_CHARS);
    if (!before.startsWith("data:image/") || !after.startsWith("data:image/")) throw new Error("Review images must be embedded images.");
    return { viewId: clean(img.viewId, 60), name: clean(img.name, 60), before, after };
  });
  await ensureSchema();
  const sql = await sqlClient();
  const shareId = `rv-${randomBytes(16).toString("base64url")}`;
  await sql`
    insert into revision_reviews (id, project_name, change_request, finish_json, set_id, set_json, images_json)
    values (${shareId}, ${clean(input.projectName, 80) || "Revision"}, ${clean(input.changeRequest, 800)},
            ${JSON.stringify(input.finish)}::jsonb, ${input.set.id}, ${JSON.stringify(input.set)}::jsonb, ${JSON.stringify(images)}::jsonb)`;
  return { shareId };
}

export async function getReviewRecord(shareId: string): Promise<ReviewPayload | null> {
  const id = clean(shareId, 80);
  if (!/^rv-[A-Za-z0-9_-]{16,40}$/.test(id)) return null;
  await ensureSchema();
  const sql = await sqlClient();
  const rows = await sql<ReviewRow>`select * from revision_reviews where id = ${id}`;
  const row = rows[0];
  if (!row) return null;
  const decisions = await sql<DecisionRow>`select * from revision_decisions where review_id = ${id} order by created_at asc`;
  return {
    shareId: row.id,
    projectName: row.project_name,
    changeRequest: row.change_request,
    finish: parse<FinishRecord>(row.finish_json),
    set: parse<VersionSet>(row.set_json),
    images: parse<ReviewImage[]>(row.images_json),
    createdAt: iso(row.created_at),
    decisions: decisions.map(decisionOf),
  };
}

/** Append-only. The decision is always bound to the set this link was created for; the client cannot choose another. */
export async function addDecisionRecord(input: {
  shareId: string;
  decision: string;
  reviewerName: string;
  note: string;
  pins: ReviewPin[];
}): Promise<ReviewDecision> {
  const review = await getReviewRecord(input.shareId);
  if (!review) throw new Error("This review link is not valid.");
  const name = clean(input.reviewerName, 60);
  if (!name) throw new Error("Please enter your name to sign off.");
  const decision = input.decision === "approved" ? "approved" : input.decision === "changes_requested" ? "changes_requested" : null;
  if (!decision) throw new Error("Choose approve or request changes.");
  const note = clean(input.note, 800);
  if (decision === "changes_requested" && !note && !input.pins.length) throw new Error("Describe the change you want, or pin a comment on the image.");
  const pins = (Array.isArray(input.pins) ? input.pins : []).slice(0, 20).map((p) => ({
    viewId: clean(p.viewId, 60),
    x: Math.min(1, Math.max(0, Number(p.x) || 0)),
    y: Math.min(1, Math.max(0, Number(p.y) || 0)),
    body: clean(p.body, 300),
  }));
  const sql = await sqlClient();
  const id = `dc-${randomUUID().slice(0, 12)}`;
  await sql`
    insert into revision_decisions (id, review_id, set_id, decision, reviewer_name, note, pins_json)
    values (${id}, ${review.shareId}, ${review.set.id}, ${decision}, ${name}, ${note}, ${JSON.stringify(pins)}::jsonb)`;
  const rows = await sql<DecisionRow>`select * from revision_decisions where id = ${id}`;
  return decisionOf(rows[0]);
}
