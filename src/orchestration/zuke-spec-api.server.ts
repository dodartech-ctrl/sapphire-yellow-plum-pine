import { z } from "zod";
import {
  PILOT_MAX_ATTEMPTS_TOTAL,
  PILOT_SOFT_RANKING_WEIGHTS,
  buildGroundedArchitecturalAnswer,
} from "@/orchestration/zuke-governance";
import { executeControlledTool, listRegisteredTools, type ToolRole } from "@/orchestration/tool-registry";
import {
  commitThreadMessage,
  deleteThreadTombstone,
  getBriefHead,
  listAuditEvents,
  listBriefRevisions,
  listMemoryItems,
  listRunApprovals,
  listThreadMessages,
  patchBriefWithCas,
  proposeMemoryItem,
  recordRunApproval,
  transitionMemoryState,
} from "@/orchestration/zuke-ledger.server";
import {
  CLIENT_LABEL_DESCRIPTIONS,
  MEMORY_CANDIDATE_STATES,
  validateGroundedAnswer,
  type MemoryCandidateState,
} from "@/schemas/zuke-spec.schema";

function jsonResponse(body: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(extraHeaders ?? {}),
    },
  });
}

async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const parsed = (await request.json()) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export async function handleGetProjectBrief(projectId: string): Promise<Response> {
  const head = await getBriefHead(projectId);
  const revisions = await listBriefRevisions(projectId);
  const audits = await listAuditEvents(projectId, 12);
  return jsonResponse(
    {
      projectId,
      head,
      revisions,
      audits,
      tools: listRegisteredTools(),
      softRankingWeights: PILOT_SOFT_RANKING_WEIGHTS,
      maxAttemptsTotal: PILOT_MAX_ATTEMPTS_TOTAL,
      clientLabelDescriptions: CLIENT_LABEL_DESCRIPTIONS,
    },
    200,
    { ETag: `"${head.revision}"` },
  );
}

const BriefPatchSchema = z.object({
  expectedRevision: z.number().int().min(1).optional(),
  title: z.string().min(1).max(160).optional(),
  summary: z.string().min(1).max(2000).optional(),
  locks: z.array(z.string().min(1).max(64)).max(24).optional(),
  hasDimensionedDrawing: z.boolean().optional(),
  materialSpecs: z.array(z.string().min(1).max(120)).max(24).optional(),
  cameraNotes: z.string().max(400).optional(),
  actorId: z.string().min(1).max(120).optional(),
});

export async function handlePatchProjectBrief(projectId: string, request: Request): Promise<Response> {
  const raw = await parseJsonBody(request);
  const parsed = BriefPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonResponse(
      {
        errorCode: "MISSING_REQUIRED_EVIDENCE",
        error: "Invalid brief patch payload.",
        details: parsed.error.issues,
      },
      400,
    );
  }

  const ifMatchRaw = request.headers.get("if-match")?.replace(/^W\//i, "").replace(/"/g, "").trim();
  const headerRev = ifMatchRaw && /^\d+$/.test(ifMatchRaw) ? Number(ifMatchRaw) : undefined;
  const expectedRevision = parsed.data.expectedRevision ?? headerRev;

  if (!expectedRevision || !Number.isInteger(expectedRevision) || expectedRevision < 1) {
    return jsonResponse(
      {
        errorCode: "REVISION_CHANGED",
        error: "Compare-and-swap requires expectedRevision or numeric If-Match header.",
      },
      409,
    );
  }

  const res = await patchBriefWithCas({
    projectId,
    expectedRevision,
    patch: {
      title: parsed.data.title,
      summary: parsed.data.summary,
      locks: parsed.data.locks,
      hasDimensionedDrawing: parsed.data.hasDimensionedDrawing,
      materialSpecs: parsed.data.materialSpecs,
      cameraNotes: parsed.data.cameraNotes,
    },
    actorId: parsed.data.actorId,
  });

  if (!res.ok) {
    return jsonResponse(
      {
        errorCode: res.errorCode,
        error: res.message,
        currentRevision: res.currentRevision,
        head: res.currentBrief,
      },
      409,
      { ETag: `"${res.currentRevision}"` },
    );
  }

  return jsonResponse({ ok: true, head: res.brief }, 200, { ETag: `"${res.brief.revision}"` });
}

export async function handleGetThreadMessages(projectId: string, threadId: string): Promise<Response> {
  const messages = await listThreadMessages({ projectId, threadId });
  return jsonResponse({ projectId, threadId, count: messages.length, messages });
}

const ThreadMessagePostSchema = z.object({
  clientMessageId: z.string().min(1).max(128).optional(),
  authorType: z.enum(["user", "assistant", "system"]).default("user"),
  content: z.string().min(1).max(8000),
  evidence: z.array(z.unknown()).default([]),
});

export async function handlePostThreadMessage(
  projectId: string,
  threadId: string,
  request: Request,
): Promise<Response> {
  const raw = await parseJsonBody(request);
  const parsed = ThreadMessagePostSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonResponse({ error: "Invalid thread message payload.", details: parsed.error.issues }, 400);
  }

  const clientMessageId =
    parsed.data.clientMessageId ||
    request.headers.get("x-idempotency-key")?.trim() ||
    request.headers.get("idempotency-key")?.trim();

  if (!clientMessageId) {
    return jsonResponse(
      { errorCode: "MISSING_REQUIRED_EVIDENCE", error: "clientMessageId or Idempotency-Key header is required." },
      400,
    );
  }

  const result = await commitThreadMessage({
    projectId,
    threadId,
    clientMessageId,
    authorType: parsed.data.authorType,
    content: parsed.data.content,
    evidence: parsed.data.evidence,
  });

  if (!result.ok) {
    return jsonResponse({ errorCode: result.errorCode, error: result.message }, result.httpStatus);
  }

  return jsonResponse(
    {
      ok: true,
      deduplicated: result.deduplicated,
      message: result.message,
    },
    result.deduplicated ? 200 : 201,
  );
}

export async function handleDeleteThread(
  projectId: string,
  threadId: string,
  request: Request,
): Promise<Response> {
  const actorId = request.headers.get("x-actor-id") || "studio-architect";
  const result = await deleteThreadTombstone({ projectId, threadId, actorId });
  return jsonResponse({ ok: true, projectId, threadId, ...result });
}

export async function handleGetProjectMemory(projectId: string, request: Request): Promise<Response> {
  const url = new URL(request.url);
  const stateParam = url.searchParams.get("state") as MemoryCandidateState | null;
  const validState =
    stateParam && (MEMORY_CANDIDATE_STATES as readonly string[]).includes(stateParam)
      ? stateParam
      : undefined;
  const includeDeleted = url.searchParams.get("includeDeleted") === "true";
  const items = await listMemoryItems({ projectId, state: validState, includeDeleted });
  return jsonResponse({ projectId, count: items.length, items });
}

const MemoryActionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("propose"),
    scope: z.enum(["project", "thread", "studio"]).default("project"),
    category: z.string().min(1).max(64).default("architectural_preference"),
    itemKey: z.string().min(1).max(120),
    itemValue: z.string().min(1).max(1000),
    confidence: z.number().min(0).max(1).optional(),
    evidenceIds: z.array(z.string()).optional(),
    actorId: z.string().optional(),
  }),
  z.object({
    action: z.enum(["approve", "reject", "delete"]),
    memoryId: z.string().min(1).max(120),
    actorId: z.string().optional(),
  }),
]);

export async function handlePostProjectMemory(projectId: string, request: Request): Promise<Response> {
  const raw = await parseJsonBody(request);
  const normalized = { action: "propose", ...raw };
  const parsed = MemoryActionSchema.safeParse(normalized);
  if (!parsed.success) {
    return jsonResponse({ error: "Invalid memory payload.", details: parsed.error.issues }, 400);
  }

  if (parsed.data.action === "propose") {
    const item = await proposeMemoryItem({
      projectId,
      scope: parsed.data.scope,
      category: parsed.data.category,
      itemKey: parsed.data.itemKey,
      itemValue: parsed.data.itemValue,
      confidence: parsed.data.confidence,
      evidenceIds: parsed.data.evidenceIds,
      actorId: parsed.data.actorId,
    });
    return jsonResponse({ ok: true, item }, 201);
  }

  const targetMap = {
    approve: "approved",
    reject: "rejected",
    delete: "deleted",
  } as const;

  const transition = await transitionMemoryState({
    projectId,
    memoryId: parsed.data.memoryId,
    targetState: targetMap[parsed.data.action],
    actorId: parsed.data.actorId,
  });

  if (!transition.ok) {
    return jsonResponse({ error: transition.error }, 404);
  }

  return jsonResponse({
    ok: true,
    item: transition.item,
    supersededIds: transition.supersededIds,
  });
}

export async function handleGetRunApprovals(projectId: string, runId: string): Promise<Response> {
  const approvals = await listRunApprovals({ projectId, runId });
  return jsonResponse({ projectId, runId, count: approvals.length, approvals });
}

const ApprovalPostSchema = z.object({
  candidateSha256: z.string().regex(/^[0-9a-f]{64}$/, "candidateSha256 must be a 64-character hex SHA-256 hash."),
  briefHash: z.string().regex(/^[0-9a-f]{64}$/, "briefHash must be a 64-character hex SHA-256 hash."),
  briefRevision: z.number().int().min(1).optional(),
  reviewerId: z.string().min(1).max(120).default("principal-architect"),
  reviewerRole: z.enum(["viewer", "architect", "reviewer", "admin"]).default("reviewer"),
  decision: z.enum(["client_approved", "rejected"]).default("client_approved"),
  findings: z.array(z.string().min(1).max(400)).max(20).default([]),
});

export async function handlePostRunApproval(
  projectId: string,
  runId: string,
  request: Request,
): Promise<Response> {
  const raw = await parseJsonBody(request);
  const parsed = ApprovalPostSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonResponse(
      { errorCode: "MISSING_REQUIRED_EVIDENCE", error: "Invalid approval payload.", details: parsed.error.issues },
      400,
    );
  }

  const head = await getBriefHead(projectId);
  const toolExec = await executeControlledTool({
    toolName: "approve_candidate",
    actorId: parsed.data.reviewerId,
    actorRole: parsed.data.reviewerRole as ToolRole,
    projectId,
    args: {
      projectId,
      runId,
      candidateSha256: parsed.data.candidateSha256,
      briefHash: parsed.data.briefHash,
      decision: parsed.data.decision,
    },
    handler: async () =>
      recordRunApproval({
        projectId,
        runId,
        candidateSha256: parsed.data.candidateSha256,
        briefHash: parsed.data.briefHash,
        briefRevision: parsed.data.briefRevision ?? head.revision,
        reviewerId: parsed.data.reviewerId,
        reviewerRole: parsed.data.reviewerRole === "admin" ? "admin" : "reviewer",
        decision: parsed.data.decision,
        findings: parsed.data.findings,
      }),
  });

  if (!toolExec.ok || !toolExec.result) {
    const status = toolExec.audit.status === "denied" ? 403 : 422;
    return jsonResponse(
      {
        errorCode: status === 403 ? "ASSET_FORBIDDEN" : "MANDATORY_CHECK_FAILED",
        error: toolExec.error ?? "Approval denied.",
        audit: toolExec.audit,
      },
      status,
    );
  }

  return jsonResponse(
    {
      ok: true,
      clientLabel: parsed.data.decision === "client_approved" ? "client_approved" : "draft",
      approval: toolExec.result,
      audit: toolExec.audit,
    },
    201,
  );
}

const GroundedQaPostSchema = z.object({
  question: z.string().min(1).max(4000),
  hasDimensionedDrawing: z.boolean().optional(),
  activeJobState: z.string().max(64).optional(),
  conflictingSources: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .max(10)
    .optional(),
});

export async function handleGroundedQa(projectId: string, request: Request): Promise<Response> {
  const raw = await parseJsonBody(request);
  const parsed = GroundedQaPostSchema.safeParse(raw);
  if (!parsed.success) {
    return jsonResponse({ error: "Invalid grounded Q&A request.", details: parsed.error.issues }, 400);
  }

  const head = await getBriefHead(projectId);
  const answer = buildGroundedArchitecturalAnswer({
    question: parsed.data.question,
    briefRevision: head.revision,
    briefSummary: head.content.summary,
    locks: head.content.locks,
    hasDimensionedDrawing: parsed.data.hasDimensionedDrawing ?? head.content.hasDimensionedDrawing,
    activeJobState: parsed.data.activeJobState,
    conflictingSources: parsed.data.conflictingSources,
  });

  const verification = validateGroundedAnswer(answer);
  return jsonResponse({
    projectId,
    briefRevision: head.revision,
    briefHash: head.briefHash,
    g10Passed: verification.valid,
    answer,
  });
}
