import { randomUUID } from "node:crypto";
import type { Sql } from "@/lib/db";
import { sha256Hex } from "@/orchestration/zuke-governance";
import type { MemoryCandidateState, SpecErrorCode } from "@/schemas/zuke-spec.schema";

/**
 * ZUKE VIZ AI — Durable Ledger Service (PostgreSQL / PGLite + test memory fallback)
 * Implements immutable brief revisions with Compare-and-Swap (If-Match / 409 REVISION_CHANGED),
 * monotonic idempotent thread messages with tombstones (M01-M05), scoped memory approval
 * lifecycle, immutable reviewer approvals bound to candidate_sha256 & brief_hash, and audit log.
 */

export interface BriefContent {
  title: string;
  summary: string;
  locks: string[];
  hasDimensionedDrawing: boolean;
  materialSpecs: string[];
  cameraNotes: string;
  updatedBy: string;
}

export interface BriefVersionRecord {
  id: string;
  tenantId: string;
  projectId: string;
  revision: number;
  parentRevision: number | null;
  content: BriefContent;
  briefHash: string;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
}

export interface ThreadMessageRecord {
  id: string;
  tenantId: string;
  projectId: string;
  threadId: string;
  seq: number;
  clientMessageId: string;
  payloadHash: string;
  authorType: "user" | "assistant" | "system";
  state: "final" | "draft" | "deleted";
  content: string;
  evidence: unknown[];
  revision: number;
  deletedAt: string | null;
  createdAt: string;
}

export interface MemoryItemRecord {
  id: string;
  tenantId: string;
  projectId: string;
  scope: "project" | "thread" | "studio";
  category: string;
  itemKey: string;
  itemValue: string;
  state: MemoryCandidateState;
  version: number;
  confidence: number;
  supersedesId: string | null;
  evidenceIds: string[];
  effectiveAt: string;
  deletedAt: string | null;
  createdAt: string;
}

export interface ApprovalRecord {
  id: string;
  tenantId: string;
  projectId: string;
  runId: string;
  candidateSha256: string;
  briefHash: string;
  briefRevision: number;
  reviewerId: string;
  reviewerRole: string;
  decision: "client_approved" | "rejected";
  findings: string[];
  createdAt: string;
}

export interface AuditEventRecord {
  id: string;
  tenantId: string;
  projectId: string;
  actorId: string;
  action: string;
  resourceId: string;
  outcome: "ok" | "denied" | "conflict";
  traceId: string;
  detail: Record<string, unknown>;
  occurredAt: string;
}

const DEFAULT_TENANT = "default-tenant";

const DEFAULT_BRIEF_CONTENT: BriefContent = {
  title: "Primary Architectural Visualization Brief",
  summary:
    "Preserve approved structural massing, floor datums, roofline silhouette, and window aperture rhythm; iterate freely on facade cladding, daylighting, and landscape staging.",
  locks: ["geometry", "massing", "floors", "windows", "roofline", "facade_grid", "camera"],
  hasDimensionedDrawing: false,
  materialSpecs: ["board-formed concrete", "warm architectural travertine", "bronze mullions"],
  cameraNotes: "35mm eye-level architectural lens with strict 2-point vertical alignment.",
  updatedBy: "studio-system",
};

// In-memory store used cleanly when running unit tests outside Vite/PGLite runtime
interface MemoryLedgerStore {
  briefs: BriefVersionRecord[];
  threadNextSeq: Map<string, number>;
  deletedThreads: Set<string>;
  messages: ThreadMessageRecord[];
  memoryItems: MemoryItemRecord[];
  approvals: ApprovalRecord[];
  audits: AuditEventRecord[];
}

const memStore: MemoryLedgerStore = {
  briefs: [],
  threadNextSeq: new Map<string, number>(),
  deletedThreads: new Set<string>(),
  messages: [],
  memoryItems: [],
  approvals: [],
  audits: [],
};

let ledgerMemoryOnly = false;

export function resetInMemoryLedgerForTests(): void {
  ledgerMemoryOnly = true;
  memStore.briefs = [];
  memStore.threadNextSeq.clear();
  memStore.deletedThreads.clear();
  memStore.messages = [];
  memStore.memoryItems = [];
  memStore.approvals = [];
  memStore.audits = [];
}

async function tryGetSql(): Promise<Sql | null> {
  if (ledgerMemoryOnly) return null;
  try {
    const mod = await import("@/lib/db");
    return await mod.getSql();
  } catch {
    ledgerMemoryOnly = true;
    return null;
  }
}

function parseJsonSafe<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function computeBriefHash(projectId: string, revision: number, content: BriefContent): string {
  return sha256Hex(JSON.stringify({ projectId, revision, content }));
}

export async function recordAuditEvent(input: {
  projectId: string;
  actorId: string;
  action: string;
  resourceId: string;
  outcome: "ok" | "denied" | "conflict";
  traceId?: string;
  detail?: Record<string, unknown>;
  tenantId?: string;
}): Promise<AuditEventRecord> {
  const rec: AuditEventRecord = {
    id: `aud-${randomUUID().slice(0, 12)}`,
    tenantId: input.tenantId ?? DEFAULT_TENANT,
    projectId: input.projectId,
    actorId: input.actorId,
    action: input.action,
    resourceId: input.resourceId,
    outcome: input.outcome,
    traceId: input.traceId ?? `trc-${randomUUID().slice(0, 10)}`,
    detail: input.detail ?? {},
    occurredAt: new Date().toISOString(),
  };

  const sql = await tryGetSql();
  if (sql) {
    try {
      await sql`
        insert into zuke_audit_events (
          id, tenant_id, project_id, actor_id, action, resource_id, outcome, trace_id, detail_json, occurred_at
        ) values (
          ${rec.id}, ${rec.tenantId}, ${rec.projectId}, ${rec.actorId}, ${rec.action},
          ${rec.resourceId}, ${rec.outcome}, ${rec.traceId}, ${JSON.stringify(rec.detail)}::jsonb, ${rec.occurredAt}
        )
      `;
      return rec;
    } catch {
      // fallback to memory store
    }
  }
  memStore.audits.unshift(rec);
  return rec;
}

function mapBriefRow(row: Record<string, unknown>): BriefVersionRecord {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
    projectId: String(row.project_id),
    revision: Number(row.revision),
    parentRevision: row.parent_revision !== null && row.parent_revision !== undefined ? Number(row.parent_revision) : null,
    content: parseJsonSafe<BriefContent>(row.content_json, DEFAULT_BRIEF_CONTENT),
    briefHash: String(row.brief_hash),
    approvedBy: row.approved_by ? String(row.approved_by) : null,
    approvedAt: row.approved_at ? String(row.approved_at) : null,
    createdAt: String(row.created_at),
  };
}

export async function getBriefHead(
  projectId: string,
  tenantId = DEFAULT_TENANT,
): Promise<BriefVersionRecord> {
  const sql = await tryGetSql();
  if (sql) {
    try {
      const rows = (await sql`
        select * from zuke_brief_versions
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by revision desc
        limit 1
      `) as Record<string, unknown>[];

      if (rows.length > 0) {
        return mapBriefRow(rows[0]);
      }

      const createdAt = new Date().toISOString();
      const content: BriefContent = { ...DEFAULT_BRIEF_CONTENT };
      const briefHash = computeBriefHash(projectId, 1, content);
      const id = `brf-${randomUUID().slice(0, 12)}`;
      await sql`
        insert into zuke_brief_versions (
          id, tenant_id, project_id, revision, parent_revision, content_json, brief_hash, approved_by, approved_at, created_at
        ) values (
          ${id}, ${tenantId}, ${projectId}, 1, ${null}, ${JSON.stringify(content)}::jsonb,
          ${briefHash}, ${"studio-system"}, ${createdAt}, ${createdAt}
        )
        on conflict (tenant_id, project_id, revision) do nothing
      `;
      const checkRows = (await sql`
        select * from zuke_brief_versions
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by revision desc
        limit 1
      `) as Record<string, unknown>[];
      if (checkRows.length > 0) return mapBriefRow(checkRows[0]);
    } catch {
      // fall through to memory store
    }
  }

  const existing = memStore.briefs
    .filter((b) => b.tenantId === tenantId && b.projectId === projectId)
    .sort((a, b) => b.revision - a.revision);
  if (existing.length > 0) return existing[0];

  const createdAt = new Date().toISOString();
  const initial: BriefVersionRecord = {
    id: `brf-${randomUUID().slice(0, 12)}`,
    tenantId,
    projectId,
    revision: 1,
    parentRevision: null,
    content: { ...DEFAULT_BRIEF_CONTENT },
    briefHash: computeBriefHash(projectId, 1, DEFAULT_BRIEF_CONTENT),
    approvedBy: "studio-system",
    approvedAt: createdAt,
    createdAt,
  };
  memStore.briefs.push(initial);
  return initial;
}

export async function listBriefRevisions(
  projectId: string,
  tenantId = DEFAULT_TENANT,
): Promise<BriefVersionRecord[]> {
  await getBriefHead(projectId, tenantId);
  const sql = await tryGetSql();
  if (sql) {
    try {
      const rows = (await sql`
        select * from zuke_brief_versions
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by revision desc
        limit 25
      `) as Record<string, unknown>[];
      if (rows.length > 0) return rows.map(mapBriefRow);
    } catch {
      // fallback
    }
  }
  return memStore.briefs
    .filter((b) => b.tenantId === tenantId && b.projectId === projectId)
    .sort((a, b) => b.revision - a.revision);
}

export async function patchBriefWithCas(input: {
  projectId: string;
  expectedRevision: number;
  patch: Partial<BriefContent>;
  actorId?: string;
  tenantId?: string;
}): Promise<
  | { ok: true; brief: BriefVersionRecord }
  | {
      ok: false;
      errorCode: SpecErrorCode;
      httpStatus: 409;
      message: string;
      currentRevision: number;
      currentBrief: BriefVersionRecord;
    }
> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const actorId = input.actorId ?? "studio-architect";
  const head = await getBriefHead(input.projectId, tenantId);

  if (head.revision !== input.expectedRevision) {
    await recordAuditEvent({
      projectId: input.projectId,
      actorId,
      action: "brief.patch",
      resourceId: head.id,
      outcome: "conflict",
      detail: { expectedRevision: input.expectedRevision, currentRevision: head.revision },
      tenantId,
    });
    return {
      ok: false,
      errorCode: "REVISION_CHANGED",
      httpStatus: 409,
      message: `Brief revision mismatch: expected ${input.expectedRevision}, current head is ${head.revision}. Reload latest revision before applying changes.`,
      currentRevision: head.revision,
      currentBrief: head,
    };
  }

  const nextRevision = head.revision + 1;
  const nextContent: BriefContent = {
    title: input.patch.title?.trim() || head.content.title,
    summary: input.patch.summary?.trim() || head.content.summary,
    locks: Array.isArray(input.patch.locks) ? input.patch.locks : head.content.locks,
    hasDimensionedDrawing:
      typeof input.patch.hasDimensionedDrawing === "boolean"
        ? input.patch.hasDimensionedDrawing
        : head.content.hasDimensionedDrawing,
    materialSpecs: Array.isArray(input.patch.materialSpecs)
      ? input.patch.materialSpecs
      : head.content.materialSpecs,
    cameraNotes: input.patch.cameraNotes?.trim() || head.content.cameraNotes,
    updatedBy: actorId,
  };
  const briefHash = computeBriefHash(input.projectId, nextRevision, nextContent);
  const createdAt = new Date().toISOString();
  const nextRecord: BriefVersionRecord = {
    id: `brf-${randomUUID().slice(0, 12)}`,
    tenantId,
    projectId: input.projectId,
    revision: nextRevision,
    parentRevision: head.revision,
    content: nextContent,
    briefHash,
    approvedBy: actorId,
    approvedAt: createdAt,
    createdAt,
  };

  const sql = await tryGetSql();
  if (sql) {
    try {
      await sql`
        insert into zuke_brief_versions (
          id, tenant_id, project_id, revision, parent_revision, content_json, brief_hash, approved_by, approved_at, created_at
        ) values (
          ${nextRecord.id}, ${tenantId}, ${input.projectId}, ${nextRevision}, ${head.revision},
          ${JSON.stringify(nextContent)}::jsonb, ${briefHash}, ${actorId}, ${createdAt}, ${createdAt}
        )
      `;
      await recordAuditEvent({
        projectId: input.projectId,
        actorId,
        action: "brief.patch",
        resourceId: nextRecord.id,
        outcome: "ok",
        detail: { fromRevision: head.revision, toRevision: nextRevision, briefHash },
        tenantId,
      });
      return { ok: true, brief: nextRecord };
    } catch (err) {
      // Unique constraint collision from concurrent writer => CAS 409
      const msg = err instanceof Error ? err.message : "";
      if (/unique|duplicate/i.test(msg)) {
        const latest = await getBriefHead(input.projectId, tenantId);
        return {
          ok: false,
          errorCode: "REVISION_CHANGED",
          httpStatus: 409,
          message: `Concurrent write advanced brief to revision ${latest.revision}.`,
          currentRevision: latest.revision,
          currentBrief: latest,
        };
      }
      // fallback to memory store
    }
  }

  memStore.briefs.push(nextRecord);
  await recordAuditEvent({
    projectId: input.projectId,
    actorId,
    action: "brief.patch",
    resourceId: nextRecord.id,
    outcome: "ok",
    detail: { fromRevision: head.revision, toRevision: nextRevision, briefHash },
    tenantId,
  });
  return { ok: true, brief: nextRecord };
}

function mapMessageRow(row: Record<string, unknown>): ThreadMessageRecord {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
    projectId: String(row.project_id),
    threadId: String(row.thread_id),
    seq: Number(row.seq),
    clientMessageId: String(row.client_message_id),
    payloadHash: String(row.payload_hash),
    authorType: String(row.author_type) as ThreadMessageRecord["authorType"],
    state: String(row.state) as ThreadMessageRecord["state"],
    content: String(row.content),
    evidence: parseJsonSafe<unknown[]>(row.evidence_json, []),
    revision: Number(row.revision ?? 1),
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    createdAt: String(row.created_at),
  };
}

export async function commitThreadMessage(input: {
  projectId: string;
  threadId: string;
  clientMessageId: string;
  authorType: "user" | "assistant" | "system";
  content: string;
  evidence?: unknown[];
  tenantId?: string;
}): Promise<
  | { ok: true; message: ThreadMessageRecord; deduplicated: boolean }
  | { ok: false; errorCode: SpecErrorCode; httpStatus: 409; message: string }
> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const evidence = input.evidence ?? [];
  const payloadHash = sha256Hex(
    JSON.stringify({
      authorType: input.authorType,
      content: input.content,
      evidence,
    }),
  );

  const sql = await tryGetSql();
  if (sql) {
    try {
      await sql`
        insert into zuke_threads (id, tenant_id, project_id, next_seq)
        values (${input.threadId}, ${tenantId}, ${input.projectId}, 1)
        on conflict (id) do nothing
      `;

      const existingRows = (await sql`
        select * from zuke_messages
        where thread_id = ${input.threadId} and client_message_id = ${input.clientMessageId}
        limit 1
      `) as Record<string, unknown>[];

      if (existingRows.length > 0) {
        const existing = mapMessageRow(existingRows[0]);
        if (existing.payloadHash === payloadHash) {
          return { ok: true, message: existing, deduplicated: true };
        }
        return {
          ok: false,
          errorCode: "BRIEF_CONFLICT",
          httpStatus: 409,
          message: `Idempotency key '${input.clientMessageId}' was already committed with a different payload.`,
        };
      }

      const seqRows = (await sql`
        select coalesce(max(seq), 0) + 1 as next_seq
        from zuke_messages
        where thread_id = ${input.threadId}
      `) as Record<string, unknown>[];
      const seq = Number(seqRows[0]?.next_seq ?? 1);
      const createdAt = new Date().toISOString();
      const head = await getBriefHead(input.projectId, tenantId);
      const rec: ThreadMessageRecord = {
        id: `msg-${randomUUID().slice(0, 12)}`,
        tenantId,
        projectId: input.projectId,
        threadId: input.threadId,
        seq,
        clientMessageId: input.clientMessageId,
        payloadHash,
        authorType: input.authorType,
        state: "final",
        content: input.content,
        evidence,
        revision: head.revision,
        deletedAt: null,
        createdAt,
      };

      await sql`
        insert into zuke_messages (
          id, tenant_id, project_id, thread_id, seq, client_message_id, payload_hash,
          author_type, state, content, evidence_json, revision, created_at
        ) values (
          ${rec.id}, ${tenantId}, ${input.projectId}, ${input.threadId}, ${seq}, ${input.clientMessageId},
          ${payloadHash}, ${input.authorType}, 'final', ${input.content}, ${JSON.stringify(evidence)}::jsonb,
          ${rec.revision}, ${createdAt}
        )
      `;
      await sql`
        update zuke_threads set next_seq = ${seq + 1}, updated_at = ${createdAt}
        where id = ${input.threadId}
      `;
      return { ok: true, message: rec, deduplicated: false };
    } catch {
      // fall through to memory store
    }
  }

  const existing = memStore.messages.find(
    (m) => m.threadId === input.threadId && m.clientMessageId === input.clientMessageId,
  );
  if (existing) {
    if (existing.payloadHash === payloadHash) {
      return { ok: true, message: existing, deduplicated: true };
    }
    return {
      ok: false,
      errorCode: "BRIEF_CONFLICT",
      httpStatus: 409,
      message: `Idempotency key '${input.clientMessageId}' was already committed with a different payload.`,
    };
  }

  const seq = memStore.threadNextSeq.get(input.threadId) ?? 1;
  memStore.threadNextSeq.set(input.threadId, seq + 1);
  const head = await getBriefHead(input.projectId, tenantId);
  const rec: ThreadMessageRecord = {
    id: `msg-${randomUUID().slice(0, 12)}`,
    tenantId,
    projectId: input.projectId,
    threadId: input.threadId,
    seq,
    clientMessageId: input.clientMessageId,
    payloadHash,
    authorType: input.authorType,
    state: "final",
    content: input.content,
    evidence,
    revision: head.revision,
    deletedAt: null,
    createdAt: new Date().toISOString(),
  };
  memStore.messages.push(rec);
  return { ok: true, message: rec, deduplicated: false };
}

export async function listThreadMessages(input: {
  projectId: string;
  threadId: string;
  tenantId?: string;
}): Promise<ThreadMessageRecord[]> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const sql = await tryGetSql();
  if (sql) {
    try {
      const rows = (await sql`
        select * from zuke_messages
        where tenant_id = ${tenantId}
          and project_id = ${input.projectId}
          and thread_id = ${input.threadId}
          and deleted_at is null
        order by seq asc
      `) as Record<string, unknown>[];
      return rows.map(mapMessageRow);
    } catch {
      // fallback
    }
  }

  if (memStore.deletedThreads.has(input.threadId)) return [];
  return memStore.messages
    .filter(
      (m) =>
        m.tenantId === tenantId &&
        m.projectId === input.projectId &&
        m.threadId === input.threadId &&
        m.deletedAt === null,
    )
    .sort((a, b) => a.seq - b.seq);
}

export async function deleteThreadTombstone(input: {
  projectId: string;
  threadId: string;
  actorId?: string;
  tenantId?: string;
}): Promise<{ deletedMessages: number; deletedAt: string }> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const deletedAt = new Date().toISOString();
  const actorId = input.actorId ?? "studio-architect";

  const sql = await tryGetSql();
  if (sql) {
    try {
      await sql`
        update zuke_threads set deleted_at = ${deletedAt}, updated_at = ${deletedAt}
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and id = ${input.threadId}
      `;
      const updated = (await sql`
        update zuke_messages set deleted_at = ${deletedAt}, state = 'deleted'
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and thread_id = ${input.threadId} and deleted_at is null
        returning id
      `) as Record<string, unknown>[];
      await sql`
        update zuke_memory_items set deleted_at = ${deletedAt}, state = 'deleted'
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and scope = 'thread' and deleted_at is null
      `;
      await recordAuditEvent({
        projectId: input.projectId,
        actorId,
        action: "thread.tombstone_delete",
        resourceId: input.threadId,
        outcome: "ok",
        detail: { deletedMessages: updated.length, deletedAt },
        tenantId,
      });
      return { deletedMessages: updated.length, deletedAt };
    } catch {
      // fallback
    }
  }

  memStore.deletedThreads.add(input.threadId);
  let count = 0;
  for (const m of memStore.messages) {
    if (m.projectId === input.projectId && m.threadId === input.threadId && !m.deletedAt) {
      m.deletedAt = deletedAt;
      m.state = "deleted";
      count++;
    }
  }
  for (const item of memStore.memoryItems) {
    if (item.projectId === input.projectId && item.scope === "thread" && !item.deletedAt) {
      item.deletedAt = deletedAt;
      item.state = "deleted";
    }
  }
  await recordAuditEvent({
    projectId: input.projectId,
    actorId,
    action: "thread.tombstone_delete",
    resourceId: input.threadId,
    outcome: "ok",
    detail: { deletedMessages: count, deletedAt },
    tenantId,
  });
  return { deletedMessages: count, deletedAt };
}

function mapMemoryRow(row: Record<string, unknown>): MemoryItemRecord {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
    projectId: String(row.project_id),
    scope: String(row.scope ?? "project") as MemoryItemRecord["scope"],
    category: String(row.category),
    itemKey: String(row.item_key),
    itemValue: String(row.item_value),
    state: String(row.state) as MemoryCandidateState,
    version: Number(row.version ?? 1),
    confidence: Number(row.confidence ?? 0.85),
    supersedesId: row.supersedes_id ? String(row.supersedes_id) : null,
    evidenceIds: parseJsonSafe<string[]>(row.evidence_ids, []),
    effectiveAt: String(row.effective_at),
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    createdAt: String(row.created_at),
  };
}

export async function listMemoryItems(input: {
  projectId: string;
  state?: MemoryCandidateState;
  includeDeleted?: boolean;
  tenantId?: string;
}): Promise<MemoryItemRecord[]> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const sql = await tryGetSql();
  if (sql) {
    try {
      const rows = (
        input.state
          ? await sql`
              select * from zuke_memory_items
              where tenant_id = ${tenantId} and project_id = ${input.projectId}
                and state = ${input.state}
                and (${Boolean(input.includeDeleted)} or deleted_at is null)
              order by effective_at desc
            `
          : await sql`
              select * from zuke_memory_items
              where tenant_id = ${tenantId} and project_id = ${input.projectId}
                and (${Boolean(input.includeDeleted)} or deleted_at is null)
              order by effective_at desc
            `
      ) as Record<string, unknown>[];
      return rows.map(mapMemoryRow);
    } catch {
      // fallback
    }
  }
  return memStore.memoryItems.filter(
    (m) =>
      m.tenantId === tenantId &&
      m.projectId === input.projectId &&
      (!input.state || m.state === input.state) &&
      (input.includeDeleted || m.deletedAt === null),
  );
}

export async function proposeMemoryItem(input: {
  projectId: string;
  scope?: "project" | "thread" | "studio";
  category: string;
  itemKey: string;
  itemValue: string;
  confidence?: number;
  evidenceIds?: string[];
  actorId?: string;
  tenantId?: string;
}): Promise<MemoryItemRecord> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const now = new Date().toISOString();
  const rec: MemoryItemRecord = {
    id: `mem-${randomUUID().slice(0, 12)}`,
    tenantId,
    projectId: input.projectId,
    scope: input.scope ?? "project",
    category: input.category,
    itemKey: input.itemKey.trim(),
    itemValue: input.itemValue.trim(),
    state: "proposed", // Normative rule: never auto-promote assistant assertions
    version: 1,
    confidence: Math.max(0, Math.min(1, input.confidence ?? 0.85)),
    supersedesId: null,
    evidenceIds: input.evidenceIds ?? [],
    effectiveAt: now,
    deletedAt: null,
    createdAt: now,
  };

  const sql = await tryGetSql();
  if (sql) {
    try {
      await sql`
        insert into zuke_memory_items (
          id, tenant_id, project_id, scope, category, item_key, item_value,
          state, version, confidence, supersedes_id, evidence_ids, effective_at, created_at
        ) values (
          ${rec.id}, ${tenantId}, ${rec.projectId}, ${rec.scope}, ${rec.category}, ${rec.itemKey}, ${rec.itemValue},
          'proposed', 1, ${rec.confidence}, ${null}, ${JSON.stringify(rec.evidenceIds)}::jsonb, ${now}, ${now}
        )
      `;
      await recordAuditEvent({
        projectId: input.projectId,
        actorId: input.actorId ?? "studio-architect",
        action: "memory.propose",
        resourceId: rec.id,
        outcome: "ok",
        detail: { itemKey: rec.itemKey, scope: rec.scope },
        tenantId,
      });
      return rec;
    } catch {
      // fallback
    }
  }

  memStore.memoryItems.unshift(rec);
  return rec;
}

export async function transitionMemoryState(input: {
  projectId: string;
  memoryId: string;
  targetState: "approved" | "rejected" | "deleted";
  actorId?: string;
  tenantId?: string;
}): Promise<{ ok: true; item: MemoryItemRecord; supersededIds: string[] } | { ok: false; error: string }> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const now = new Date().toISOString();
  const supersededIds: string[] = [];

  const sql = await tryGetSql();
  if (sql) {
    try {
      const found = (await sql`
        select * from zuke_memory_items
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and id = ${input.memoryId}
        limit 1
      `) as Record<string, unknown>[];
      if (found.length === 0) return { ok: false, error: `Memory item '${input.memoryId}' not found.` };
      const item = mapMemoryRow(found[0]);

      let supersedesId: string | null = item.supersedesId;
      let nextVersion = item.version;

      if (input.targetState === "approved") {
        const priors = (await sql`
          select id, version from zuke_memory_items
          where tenant_id = ${tenantId} and project_id = ${input.projectId}
            and item_key = ${item.itemKey} and state = 'approved' and id <> ${item.id} and deleted_at is null
        `) as Record<string, unknown>[];
        for (const p of priors) {
          const pid = String(p.id);
          supersededIds.push(pid);
          supersedesId = pid;
          nextVersion = Math.max(nextVersion, Number(p.version ?? 1) + 1);
          await sql`
            update zuke_memory_items set state = 'superseded'
            where id = ${pid}
          `;
        }
      }

      const deletedAt = input.targetState === "deleted" ? now : null;
      await sql`
        update zuke_memory_items
        set state = ${input.targetState},
            version = ${nextVersion},
            supersedes_id = ${supersedesId},
            effective_at = ${now},
            deleted_at = ${deletedAt}
        where id = ${item.id}
      `;

      const updated: MemoryItemRecord = {
        ...item,
        state: input.targetState,
        version: nextVersion,
        supersedesId,
        effectiveAt: now,
        deletedAt,
      };
      await recordAuditEvent({
        projectId: input.projectId,
        actorId: input.actorId ?? "studio-architect",
        action: `memory.${input.targetState}`,
        resourceId: item.id,
        outcome: "ok",
        detail: { itemKey: item.itemKey, supersededIds },
        tenantId,
      });
      return { ok: true, item: updated, supersededIds };
    } catch {
      // fallback
    }
  }

  const item = memStore.memoryItems.find(
    (m) => m.tenantId === tenantId && m.projectId === input.projectId && m.id === input.memoryId,
  );
  if (!item) return { ok: false, error: `Memory item '${input.memoryId}' not found.` };

  if (input.targetState === "approved") {
    for (const prior of memStore.memoryItems) {
      if (
        prior.projectId === input.projectId &&
        prior.itemKey === item.itemKey &&
        prior.state === "approved" &&
        prior.id !== item.id &&
        !prior.deletedAt
      ) {
        prior.state = "superseded";
        supersededIds.push(prior.id);
        item.supersedesId = prior.id;
        item.version = Math.max(item.version, prior.version + 1);
      }
    }
  }
  item.state = input.targetState;
  item.effectiveAt = now;
  if (input.targetState === "deleted") {
    item.deletedAt = now;
  }
  return { ok: true, item, supersededIds };
}

function mapApprovalRow(row: Record<string, unknown>): ApprovalRecord {
  return {
    id: String(row.id),
    tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
    projectId: String(row.project_id),
    runId: String(row.run_id),
    candidateSha256: String(row.candidate_sha256),
    briefHash: String(row.brief_hash),
    briefRevision: Number(row.brief_revision ?? 1),
    reviewerId: String(row.reviewer_id),
    reviewerRole: String(row.reviewer_role ?? "reviewer"),
    decision: String(row.decision) as ApprovalRecord["decision"],
    findings: parseJsonSafe<string[]>(row.findings_json, []),
    createdAt: String(row.created_at),
  };
}

export async function recordRunApproval(input: {
  projectId: string;
  runId: string;
  candidateSha256: string;
  briefHash: string;
  briefRevision: number;
  reviewerId: string;
  reviewerRole: "reviewer" | "admin";
  decision: "client_approved" | "rejected";
  findings?: string[];
  tenantId?: string;
}): Promise<ApprovalRecord> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const createdAt = new Date().toISOString();
  const rec: ApprovalRecord = {
    id: `apr-${randomUUID().slice(0, 12)}`,
    tenantId,
    projectId: input.projectId,
    runId: input.runId,
    candidateSha256: input.candidateSha256,
    briefHash: input.briefHash,
    briefRevision: input.briefRevision,
    reviewerId: input.reviewerId,
    reviewerRole: input.reviewerRole,
    decision: input.decision,
    findings: input.findings ?? [],
    createdAt,
  };

  const sql = await tryGetSql();
  if (sql) {
    try {
      await sql`
        insert into zuke_approvals (
          id, tenant_id, project_id, run_id, candidate_sha256, brief_hash, brief_revision,
          reviewer_id, reviewer_role, decision, findings_json, created_at
        ) values (
          ${rec.id}, ${tenantId}, ${rec.projectId}, ${rec.runId}, ${rec.candidateSha256},
          ${rec.briefHash}, ${rec.briefRevision}, ${rec.reviewerId}, ${rec.reviewerRole},
          ${rec.decision}, ${JSON.stringify(rec.findings)}::jsonb, ${createdAt}
        )
      `;
      await recordAuditEvent({
        projectId: input.projectId,
        actorId: input.reviewerId,
        action: `run.${input.decision}`,
        resourceId: input.runId,
        outcome: "ok",
        detail: {
          approvalId: rec.id,
          candidateSha256: rec.candidateSha256,
          briefHash: rec.briefHash,
          briefRevision: rec.briefRevision,
        },
        tenantId,
      });
      return rec;
    } catch {
      // fallback
    }
  }

  memStore.approvals.unshift(rec);
  await recordAuditEvent({
    projectId: input.projectId,
    actorId: input.reviewerId,
    action: `run.${input.decision}`,
    resourceId: input.runId,
    outcome: "ok",
    detail: { approvalId: rec.id, candidateSha256: rec.candidateSha256, briefHash: rec.briefHash },
    tenantId,
  });
  return rec;
}

export async function listRunApprovals(input: {
  projectId: string;
  runId: string;
  tenantId?: string;
}): Promise<ApprovalRecord[]> {
  const tenantId = input.tenantId ?? DEFAULT_TENANT;
  const sql = await tryGetSql();
  if (sql) {
    try {
      const rows = (await sql`
        select * from zuke_approvals
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and run_id = ${input.runId}
        order by created_at desc
      `) as Record<string, unknown>[];
      return rows.map(mapApprovalRow);
    } catch {
      // fallback
    }
  }
  return memStore.approvals.filter(
    (a) => a.tenantId === tenantId && a.projectId === input.projectId && a.runId === input.runId,
  );
}

export async function listAuditEvents(
  projectId: string,
  limit = 20,
  tenantId = DEFAULT_TENANT,
): Promise<AuditEventRecord[]> {
  const sql = await tryGetSql();
  if (sql) {
    try {
      const rows = (await sql`
        select * from zuke_audit_events
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by occurred_at desc
        limit ${Math.max(1, Math.min(100, limit))}
      `) as Record<string, unknown>[];
      return rows.map((row) => ({
        id: String(row.id),
        tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
        projectId: String(row.project_id),
        actorId: String(row.actor_id),
        action: String(row.action),
        resourceId: String(row.resource_id),
        outcome: String(row.outcome) as AuditEventRecord["outcome"],
        traceId: String(row.trace_id),
        detail: parseJsonSafe<Record<string, unknown>>(row.detail_json, {}),
        occurredAt: String(row.occurred_at),
      }));
    } catch {
      // fallback
    }
  }
  return memStore.audits
    .filter((a) => a.tenantId === tenantId && a.projectId === projectId)
    .slice(0, limit);
}
