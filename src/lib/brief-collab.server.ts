import {
  extractParameterDisplayValues,
  getCollabParameterTarget,
  isValidCollabParameterKey,
  normalizeAuthorName,
  normalizeCommentBody,
  sanitizeShareId,
  type BriefCommentRecord,
  type CollabParameterKey,
  type SharedBriefSession,
  type SharedBriefSnapshot,
} from "@/lib/brief-collab";

async function sqlClient() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

let tablesReadyPromise: Promise<void> | null = null;

async function ensureCollabSchema() {
  if (!tablesReadyPromise) {
    tablesReadyPromise = (async () => {
      const sql = await sqlClient();
      await sql`
        create table if not exists shared_briefs (
          id text primary key,
          title text not null,
          author_name text not null default 'Lead Architect',
          snapshot_json jsonb not null,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )
      `;
      await sql`
        create table if not exists brief_comments (
          id text primary key,
          share_id text not null references shared_briefs(id) on delete cascade,
          parameter_key text not null,
          parameter_label text not null,
          parameter_value text not null default '',
          author_name text not null,
          author_role text not null default 'Team Reviewer',
          body text not null,
          status text not null default 'open' check (status in ('open', 'resolved')),
          created_at timestamptz not null default now()
        )
      `;
    })().catch((err) => {
      tablesReadyPromise = null;
      throw err;
    });
  }
  await tablesReadyPromise;
}

type BriefRow = {
  id: string;
  title: string;
  author_name: string;
  snapshot_json: SharedBriefSnapshot | string;
  created_at: string | Date;
  updated_at: string | Date;
};

type CommentRow = {
  id: string;
  share_id: string;
  parameter_key: string;
  parameter_label: string;
  parameter_value: string;
  author_name: string;
  author_role: string;
  body: string;
  status: string;
  created_at: string | Date;
};

function toIso(value: string | Date): string {
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}

function parseSnapshot(raw: SharedBriefSnapshot | string): SharedBriefSnapshot {
  if (typeof raw === "string") return JSON.parse(raw) as SharedBriefSnapshot;
  return raw;
}

function mapCommentRow(row: CommentRow): BriefCommentRecord {
  const key: CollabParameterKey = isValidCollabParameterKey(row.parameter_key)
    ? row.parameter_key
    : "directives";
  return {
    id: row.id,
    shareId: row.share_id,
    parameterKey: key,
    parameterLabel: row.parameter_label,
    parameterValue: row.parameter_value ?? "",
    authorName: row.author_name,
    authorRole: row.author_role,
    body: row.body,
    status: row.status === "resolved" ? "resolved" : "open",
    createdAt: toIso(row.created_at),
  };
}

function generateShareId(): string {
  const rand = Math.random().toString(36).slice(2, 7);
  const stamp = Date.now().toString(36).slice(-4);
  return `brf-${stamp}${rand}`;
}

export async function createSharedBriefRecord(input: {
  authorName: string;
  snapshot: SharedBriefSnapshot;
}): Promise<SharedBriefSession> {
  await ensureCollabSchema();
  const sql = await sqlClient();
  const shareId = generateShareId();
  const authorName = normalizeAuthorName(input.authorName);
  const title = input.snapshot.title.trim().slice(0, 140) || "Architectural Vision Brief";
  const serialized = JSON.stringify(input.snapshot);

  const rows = await sql<BriefRow>`
    insert into shared_briefs (id, title, author_name, snapshot_json)
    values (${shareId}, ${title}, ${authorName}, ${serialized}::jsonb)
    returning id, title, author_name, snapshot_json, created_at, updated_at
  `;
  const row = rows[0];
  if (!row) throw new Error("Failed to create shared brief link.");

  return {
    shareId: row.id,
    title: row.title,
    authorName: row.author_name,
    snapshot: parseSnapshot(row.snapshot_json),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    comments: [],
  };
}

export async function updateSharedBriefRecord(input: {
  shareId: string;
  snapshot: SharedBriefSnapshot;
}): Promise<SharedBriefSession> {
  await ensureCollabSchema();
  const sql = await sqlClient();
  const shareId = sanitizeShareId(input.shareId);
  if (!shareId) throw new Error("Invalid share ID.");

  const title = input.snapshot.title.trim().slice(0, 140) || "Architectural Vision Brief";
  const serialized = JSON.stringify(input.snapshot);

  const rows = await sql<BriefRow>`
    update shared_briefs
    set title = ${title}, snapshot_json = ${serialized}::jsonb, updated_at = now()
    where id = ${shareId}
    returning id, title, author_name, snapshot_json, created_at, updated_at
  `;
  const row = rows[0];
  if (!row) throw new Error("Shared brief not found.");

  const commentRows = await sql<CommentRow>`
    select id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status, created_at
    from brief_comments
    where share_id = ${shareId}
    order by created_at asc
  `;

  return {
    shareId: row.id,
    title: row.title,
    authorName: row.author_name,
    snapshot: parseSnapshot(row.snapshot_json),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    comments: commentRows.map(mapCommentRow),
  };
}

export async function getSharedBriefRecord(rawShareId: string): Promise<SharedBriefSession | null> {
  await ensureCollabSchema();
  const sql = await sqlClient();
  const shareId = sanitizeShareId(rawShareId);
  if (!shareId) return null;

  const rows = await sql<BriefRow>`
    select id, title, author_name, snapshot_json, created_at, updated_at
    from shared_briefs
    where id = ${shareId}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;

  const commentRows = await sql<CommentRow>`
    select id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status, created_at
    from brief_comments
    where share_id = ${shareId}
    order by created_at asc
  `;

  return {
    shareId: row.id,
    title: row.title,
    authorName: row.author_name,
    snapshot: parseSnapshot(row.snapshot_json),
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    comments: commentRows.map(mapCommentRow),
  };
}

export async function addBriefCommentRecord(input: {
  shareId: string;
  parameterKey: string;
  parameterValue?: string;
  authorName: string;
  authorRole: string;
  body: string;
}): Promise<BriefCommentRecord> {
  await ensureCollabSchema();
  const sql = await sqlClient();
  const shareId = sanitizeShareId(input.shareId);
  if (!shareId) throw new Error("Invalid share ID.");

  const body = normalizeCommentBody(input.body);
  if (!body) throw new Error("Comment text cannot be empty.");

  const paramKey: CollabParameterKey = isValidCollabParameterKey(input.parameterKey)
    ? input.parameterKey
    : "directives";
  const target = getCollabParameterTarget(paramKey);

  const briefRows = await sql<Pick<BriefRow, "id" | "snapshot_json">>`
    select id, snapshot_json from shared_briefs where id = ${shareId} limit 1
  `;
  const brief = briefRows[0];
  if (!brief) throw new Error("Shared brief session no longer exists.");

  const snapshot = parseSnapshot(brief.snapshot_json);
  const derivedValue = extractParameterDisplayValues(snapshot)[paramKey] ?? "";
  const parameterValue = (input.parameterValue?.trim() || derivedValue).slice(0, 140);
  const authorName = normalizeAuthorName(input.authorName);
  const authorRole = input.authorRole.trim().slice(0, 48) || "Team Reviewer";
  const id = `cmt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  const inserted = await sql<CommentRow>`
    insert into brief_comments (
      id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status
    )
    values (
      ${id}, ${shareId}, ${paramKey}, ${target.label}, ${parameterValue}, ${authorName}, ${authorRole}, ${body}, 'open'
    )
    returning id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status, created_at
  `;

  const row = inserted[0];
  if (!row) throw new Error("Could not store review comment.");
  return mapCommentRow(row);
}

export async function toggleBriefCommentStatusRecord(input: {
  shareId: string;
  commentId: string;
  status: "open" | "resolved";
}): Promise<BriefCommentRecord> {
  await ensureCollabSchema();
  const sql = await sqlClient();
  const shareId = sanitizeShareId(input.shareId);
  const commentId = sanitizeShareId(input.commentId);
  const status = input.status === "resolved" ? "resolved" : "open";
  if (!shareId || !commentId) throw new Error("Invalid share or comment identifier.");

  const rows = await sql<CommentRow>`
    update brief_comments
    set status = ${status}
    where id = ${commentId} and share_id = ${shareId}
    returning id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status, created_at
  `;
  const row = rows[0];
  if (!row) throw new Error("Comment not found.");
  return mapCommentRow(row);
}

export async function deleteBriefCommentRecord(input: {
  shareId: string;
  commentId: string;
}): Promise<{ ok: true }> {
  await ensureCollabSchema();
  const sql = await sqlClient();
  const shareId = sanitizeShareId(input.shareId);
  const commentId = sanitizeShareId(input.commentId);
  if (!shareId || !commentId) throw new Error("Invalid share or comment identifier.");

  await sql`
    delete from brief_comments
    where id = ${commentId} and share_id = ${shareId}
  `;
  return { ok: true };
}
