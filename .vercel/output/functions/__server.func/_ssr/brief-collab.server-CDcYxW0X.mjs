import { a as extractParameterDisplayValues, c as normalizeAuthorName, l as normalizeCommentBody, o as getCollabParameterTarget, s as isValidCollabParameterKey, u as sanitizeShareId } from "./brief-collab-BNJpN5Nq.mjs";
// node_modules/.nitro/vite/services/ssr/assets/brief-collab.server-CDcYxW0X.js
async function sqlClient() {
	const { getSql } = await import("./db-C1Gi79ti.mjs");
	return getSql();
}
var tablesReadyPromise = null;
async function ensureCollabSchema() {
	if (!tablesReadyPromise) tablesReadyPromise = (async () => {
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
	await tablesReadyPromise;
}
function toIso(value) {
	if (value instanceof Date) return value.toISOString();
	const parsed = new Date(value);
	return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
}
function parseSnapshot(raw) {
	if (typeof raw === "string") return JSON.parse(raw);
	return raw;
}
function mapCommentRow(row) {
	const key = isValidCollabParameterKey(row.parameter_key) ? row.parameter_key : "directives";
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
		createdAt: toIso(row.created_at)
	};
}
function generateShareId() {
	const rand = Math.random().toString(36).slice(2, 7);
	return `brf-${Date.now().toString(36).slice(-4)}${rand}`;
}
async function createSharedBriefRecord(input) {
	await ensureCollabSchema();
	const sql = await sqlClient();
	const shareId = generateShareId();
	const authorName = normalizeAuthorName(input.authorName);
	const row = (await sql`
    insert into shared_briefs (id, title, author_name, snapshot_json)
    values (${shareId}, ${input.snapshot.title.trim().slice(0, 140) || "Architectural Vision Brief"}, ${authorName}, ${JSON.stringify(input.snapshot)}::jsonb)
    returning id, title, author_name, snapshot_json, created_at, updated_at
  `)[0];
	if (!row) throw new Error("Failed to create shared brief link.");
	return {
		shareId: row.id,
		title: row.title,
		authorName: row.author_name,
		snapshot: parseSnapshot(row.snapshot_json),
		createdAt: toIso(row.created_at),
		updatedAt: toIso(row.updated_at),
		comments: []
	};
}
async function updateSharedBriefRecord(input) {
	await ensureCollabSchema();
	const sql = await sqlClient();
	const shareId = sanitizeShareId(input.shareId);
	if (!shareId) throw new Error("Invalid share ID.");
	const row = (await sql`
    update shared_briefs
    set title = ${input.snapshot.title.trim().slice(0, 140) || "Architectural Vision Brief"}, snapshot_json = ${JSON.stringify(input.snapshot)}::jsonb, updated_at = now()
    where id = ${shareId}
    returning id, title, author_name, snapshot_json, created_at, updated_at
  `)[0];
	if (!row) throw new Error("Shared brief not found.");
	const commentRows = await sql`
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
		comments: commentRows.map(mapCommentRow)
	};
}
async function getSharedBriefRecord(rawShareId) {
	await ensureCollabSchema();
	const sql = await sqlClient();
	const shareId = sanitizeShareId(rawShareId);
	if (!shareId) return null;
	const row = (await sql`
    select id, title, author_name, snapshot_json, created_at, updated_at
    from shared_briefs
    where id = ${shareId}
    limit 1
  `)[0];
	if (!row) return null;
	const commentRows = await sql`
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
		comments: commentRows.map(mapCommentRow)
	};
}
async function addBriefCommentRecord(input) {
	await ensureCollabSchema();
	const sql = await sqlClient();
	const shareId = sanitizeShareId(input.shareId);
	if (!shareId) throw new Error("Invalid share ID.");
	const body = normalizeCommentBody(input.body);
	if (!body) throw new Error("Comment text cannot be empty.");
	const paramKey = isValidCollabParameterKey(input.parameterKey) ? input.parameterKey : "directives";
	const target = getCollabParameterTarget(paramKey);
	const brief = (await sql`
    select id, snapshot_json from shared_briefs where id = ${shareId} limit 1
  `)[0];
	if (!brief) throw new Error("Shared brief session no longer exists.");
	const snapshot = parseSnapshot(brief.snapshot_json);
	const derivedValue = extractParameterDisplayValues(snapshot)[paramKey] ?? "";
	const parameterValue = (input.parameterValue?.trim() || derivedValue).slice(0, 140);
	const authorName = normalizeAuthorName(input.authorName);
	const authorRole = input.authorRole.trim().slice(0, 48) || "Team Reviewer";
	const row = (await sql`
    insert into brief_comments (
      id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status
    )
    values (
      ${`cmt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`}, ${shareId}, ${paramKey}, ${target.label}, ${parameterValue}, ${authorName}, ${authorRole}, ${body}, 'open'
    )
    returning id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status, created_at
  `)[0];
	if (!row) throw new Error("Could not store review comment.");
	return mapCommentRow(row);
}
async function toggleBriefCommentStatusRecord(input) {
	await ensureCollabSchema();
	const sql = await sqlClient();
	const shareId = sanitizeShareId(input.shareId);
	const commentId = sanitizeShareId(input.commentId);
	const status = input.status === "resolved" ? "resolved" : "open";
	if (!shareId || !commentId) throw new Error("Invalid share or comment identifier.");
	const row = (await sql`
    update brief_comments
    set status = ${status}
    where id = ${commentId} and share_id = ${shareId}
    returning id, share_id, parameter_key, parameter_label, parameter_value, author_name, author_role, body, status, created_at
  `)[0];
	if (!row) throw new Error("Comment not found.");
	return mapCommentRow(row);
}
async function deleteBriefCommentRecord(input) {
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
export { addBriefCommentRecord, createSharedBriefRecord, deleteBriefCommentRecord, getSharedBriefRecord, toggleBriefCommentStatusRecord, updateSharedBriefRecord };
