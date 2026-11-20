import { createHash } from "node:crypto";
import type { Sql } from "@/lib/db";
import type { ArchitecturalQualityEvaluation } from "@/orchestration/evaluator";
import type { ProjectContext } from "@/orchestration/prompt-compiler";
import type {
  GenerationMode,
  NanoBananaModelKey,
  NormalizedReferenceManifestItem,
  OutputAspectRatio,
  OutputResolution,
  TaskIntent,
} from "@/schemas/nano-banana.schema";

export interface ExecutionStageTrace {
  order: number;
  stage: string;
  status: "completed" | "skipped" | "warning" | "failed";
  durationMs: number;
  detail: string;
}

export interface PersistedGenerationRecord {
  id: string;
  traceId: string;
  projectId: string;
  userId: string;
  parentGenerationId: string | null;
  sessionId: string | null;
  idempotencyKey: string | null;
  provider: string;
  providerModelId: string;
  logicalModelKey: NanoBananaModelKey;
  generationMode: GenerationMode;
  taskIntent: TaskIntent;
  referenceManifest: NormalizedReferenceManifestItem[];
  outputResolution: OutputResolution;
  outputAspectRatio: OutputAspectRatio;
  generationPrompt: string;
  compiledPrompt: string;
  negativeInstructions: string;
  providerRequestId: string | null;
  providerResponseMetadata: Record<string, unknown>;
  qualityScore: number;
  qualityStatus: string;
  evaluation: ArchitecturalQualityEvaluation;
  stages: ExecutionStageTrace[];
  fallbackUsed: boolean;
  fallbackReason: string | null;
  status: string;
  outputImageUrl: string | null;
  createdAt: string;
}

export interface EditSessionRecord {
  id: string;
  projectId: string;
  userId: string;
  baseGenerationId: string;
  currentGenerationId: string;
  sessionStatus: string;
  turnCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UsageLogInput {
  generationId: string;
  provider: string;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  imageCount: number;
  estimatedCost: number;
  actualCost: number;
  latencyMs: number;
}

async function getSql(): Promise<Sql> {
  const mod = await import("@/lib/db");
  return mod.getSql();
}

function makeChecksum(value: string): string {
  return createHash("sha256").update(value).digest("hex");
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

function mapGenerationRow(row: Record<string, unknown>): PersistedGenerationRecord {
  return {
    id: String(row.id),
    traceId: String(row.trace_id),
    projectId: String(row.project_id ?? "default-studio"),
    userId: String(row.user_id ?? "studio-architect"),
    parentGenerationId: row.parent_generation_id ? String(row.parent_generation_id) : null,
    sessionId: row.session_id ? String(row.session_id) : null,
    idempotencyKey: row.idempotency_key ? String(row.idempotency_key) : null,
    provider: String(row.provider ?? "google_gemini"),
    providerModelId: String(row.provider_model_id),
    logicalModelKey: String(row.logical_model_key) as NanoBananaModelKey,
    generationMode: String(row.generation_mode) as GenerationMode,
    taskIntent: String(row.task_intent) as TaskIntent,
    referenceManifest: parseJsonSafe<NormalizedReferenceManifestItem[]>(row.reference_manifest, []),
    outputResolution: String(row.output_resolution ?? "2K") as OutputResolution,
    outputAspectRatio: String(row.output_aspect_ratio ?? "16:9") as OutputAspectRatio,
    generationPrompt: String(row.generation_prompt ?? ""),
    compiledPrompt: String(row.compiled_prompt ?? ""),
    negativeInstructions: String(row.negative_instructions ?? ""),
    providerRequestId: row.provider_request_id ? String(row.provider_request_id) : null,
    providerResponseMetadata: parseJsonSafe<Record<string, unknown>>(row.provider_response_metadata, {}),
    qualityScore: Number(row.quality_score ?? 0),
    qualityStatus: String(row.quality_status ?? "needs_review"),
    evaluation: parseJsonSafe<ArchitecturalQualityEvaluation>(
      row.evaluation_json,
      {} as ArchitecturalQualityEvaluation,
    ),
    stages: parseJsonSafe<{ stages?: ExecutionStageTrace[] }>(row.trace_json, {}).stages ?? [],
    fallbackUsed: Boolean(row.fallback_used),
    fallbackReason: row.fallback_reason ? String(row.fallback_reason) : null,
    status: String(row.status ?? "completed"),
    outputImageUrl: row.output_image_url ? String(row.output_image_url) : null,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at ?? new Date().toISOString()),
  };
}

export async function loadProjectContextFromDb(projectId: string): Promise<ProjectContext> {
  const defaultRules = [
    "Maintain architectural proportions and structural grid integrity",
    "Respect original floor elevations and window apertures when preservation is active",
    "Prioritize physically plausible materials and accurate solar shadow direction",
  ];
  const defaultMaterials = ["Honed travertine", "Warm teak timber", "Low-iron architectural glass"];

  try {
    const sql = await getSql();
    const memoryRows = (await sql`
      select memory_type, content, provenance
      from project_memories
      where project_id = ${projectId}
      order by updated_at desc
      limit 8
    `) as Array<Record<string, unknown>>;

    const recentRows = (await sql`
      select generation_prompt, compiled_prompt
      from generations
      where project_id = ${projectId}
      order by created_at desc
      limit 1
    `) as Array<Record<string, unknown>>;

    return {
      projectId,
      previousStyle: undefined,
      architecturalRules: defaultRules,
      referenceMaterials: defaultMaterials,
      memories: memoryRows.map((r) => ({
        memoryType: String(r.memory_type ?? "preference"),
        content: String(r.content ?? ""),
        provenance: String(r.provenance ?? "project"),
      })),
      recentPromptSummary: recentRows[0]?.generation_prompt
        ? String(recentRows[0].generation_prompt).slice(0, 240)
        : undefined,
    };
  } catch {
    return {
      projectId,
      previousStyle: undefined,
      architecturalRules: defaultRules,
      referenceMaterials: defaultMaterials,
      memories: [],
    };
  }
}

export async function findGenerationByIdempotencyKey(
  idempotencyKey?: string,
): Promise<PersistedGenerationRecord | null> {
  if (!idempotencyKey) return null;
  try {
    const sql = await getSql();
    const rows = (await sql`
      select * from generations
      where idempotency_key = ${idempotencyKey}
      limit 1
    `) as Array<Record<string, unknown>>;
    return rows[0] ? mapGenerationRow(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function saveGenerationRecord(
  record: PersistedGenerationRecord,
  usage?: UsageLogInput,
): Promise<void> {
  const sql = await getSql();

  // Keep persisted data URL compact if huge to prevent bloating PGLite/Postgres rows
  const storedOutputUrl =
    record.outputImageUrl && record.outputImageUrl.length <= 2_500_000
      ? record.outputImageUrl
      : record.outputImageUrl?.startsWith("/viz/")
        ? record.outputImageUrl
        : null;

  await sql`
    insert into generations (
      id, trace_id, project_id, user_id, parent_generation_id, session_id,
      idempotency_key, provider, provider_model_id, logical_model_key,
      generation_mode, task_intent, reference_manifest, output_resolution,
      output_aspect_ratio, generation_prompt, compiled_prompt, negative_instructions,
      provider_request_id, provider_response_metadata, quality_score, quality_status,
      evaluation_json, trace_json, fallback_used, fallback_reason, status, output_image_url
    ) values (
      ${record.id}, ${record.traceId}, ${record.projectId}, ${record.userId},
      ${record.parentGenerationId}, ${record.sessionId}, ${record.idempotencyKey},
      ${record.provider}, ${record.providerModelId}, ${record.logicalModelKey},
      ${record.generationMode}, ${record.taskIntent}, ${JSON.stringify(record.referenceManifest)}::jsonb,
      ${record.outputResolution}, ${record.outputAspectRatio}, ${record.generationPrompt},
      ${record.compiledPrompt}, ${record.negativeInstructions}, ${record.providerRequestId},
      ${JSON.stringify(record.providerResponseMetadata)}::jsonb, ${record.qualityScore},
      ${record.qualityStatus}, ${JSON.stringify(record.evaluation)}::jsonb,
      ${JSON.stringify({ traceId: record.traceId, stages: record.stages })}::jsonb,
      ${record.fallbackUsed}, ${record.fallbackReason}, ${record.status}, ${storedOutputUrl}
    )
    on conflict (id) do nothing
  `;

  if (record.outputImageUrl) {
    const outputAssetId = `asset-out-${record.id}`;
    const mimeMatch = record.outputImageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    const mimeType = mimeMatch?.[1] ?? "image/jpeg";
    await sql`
      insert into generation_assets (
        id, generation_id, asset_role, source_asset_id, reference_order,
        mime_type, width, height, storage_key, checksum
      ) values (
        ${outputAssetId}, ${record.id}, ${"output_render"}, ${null}, ${0},
        ${mimeType}, ${null}, ${null}, ${`generations/${record.id}/output`},
        ${makeChecksum(record.outputImageUrl.slice(0, 64_000))}
      )
      on conflict (id) do nothing
    `;
  }

  for (const ref of record.referenceManifest) {
    const linkId = `link-${record.id}-${ref.order}`;
    await sql`
      insert into image_reference_links (
        id, generation_id, asset_id, reference_type, priority
      ) values (
        ${linkId}, ${record.id}, ${ref.assetId}, ${ref.referenceType}, ${ref.priority}
      )
      on conflict (id) do nothing
    `;
  }

  for (const st of record.stages) {
    const stageId = `stg-${record.id}-${st.order}`;
    await sql`
      insert into generation_stages (
        id, generation_id, stage_order, stage_name, status, duration_ms, detail
      ) values (
        ${stageId}, ${record.id}, ${st.order}, ${st.stage}, ${st.status}, ${st.durationMs}, ${st.detail.slice(0, 400)}
      )
      on conflict (id) do nothing
    `;
  }

  if (usage) {
    const usageId = `usg-${record.id}`;
    await sql`
      insert into provider_model_usage (
        id, generation_id, provider, model_id, input_tokens, output_tokens,
        image_count, estimated_cost, actual_cost, latency_ms
      ) values (
        ${usageId}, ${usage.generationId}, ${usage.provider}, ${usage.modelId},
        ${usage.inputTokens}, ${usage.outputTokens}, ${usage.imageCount},
        ${usage.estimatedCost}, ${usage.actualCost}, ${usage.latencyMs}
      )
      on conflict (id) do nothing
    `;
  }
}

export async function upsertEditSession(input: {
  sessionId: string;
  projectId: string;
  userId: string;
  generationId: string;
}): Promise<EditSessionRecord> {
  const sql = await getSql();
  const existing = (await sql`
    select * from image_edit_sessions
    where id = ${input.sessionId}
    limit 1
  `) as Array<Record<string, unknown>>;

  if (existing[0]) {
    const nextTurns = Number(existing[0].turn_count ?? 1) + 1;
    await sql`
      update image_edit_sessions
      set current_generation_id = ${input.generationId},
          turn_count = ${nextTurns},
          updated_at = now()
      where id = ${input.sessionId}
    `;
    return {
      id: input.sessionId,
      projectId: String(existing[0].project_id ?? input.projectId),
      userId: String(existing[0].user_id ?? input.userId),
      baseGenerationId: String(existing[0].base_generation_id),
      currentGenerationId: input.generationId,
      sessionStatus: String(existing[0].session_status ?? "active"),
      turnCount: nextTurns,
      createdAt:
        existing[0].created_at instanceof Date
          ? existing[0].created_at.toISOString()
          : String(existing[0].created_at),
      updatedAt: new Date().toISOString(),
    };
  }

  await sql`
    insert into image_edit_sessions (
      id, project_id, user_id, base_generation_id, current_generation_id, session_status, turn_count
    ) values (
      ${input.sessionId}, ${input.projectId}, ${input.userId}, ${input.generationId},
      ${input.generationId}, ${"active"}, ${1}
    )
    on conflict (id) do nothing
  `;
  const now = new Date().toISOString();
  return {
    id: input.sessionId,
    projectId: input.projectId,
    userId: input.userId,
    baseGenerationId: input.generationId,
    currentGenerationId: input.generationId,
    sessionStatus: "active",
    turnCount: 1,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getEditSession(sessionId: string): Promise<{
  session: EditSessionRecord | null;
  turns: PersistedGenerationRecord[];
}> {
  const sql = await getSql();
  const rows = (await sql`
    select * from image_edit_sessions
    where id = ${sessionId}
    limit 1
  `) as Array<Record<string, unknown>>;

  if (!rows[0]) {
    return { session: null, turns: [] };
  }

  const turnRows = (await sql`
    select * from generations
    where session_id = ${sessionId}
    order by created_at asc
    limit 20
  `) as Array<Record<string, unknown>>;

  const r = rows[0];
  return {
    session: {
      id: String(r.id),
      projectId: String(r.project_id),
      userId: String(r.user_id),
      baseGenerationId: String(r.base_generation_id),
      currentGenerationId: String(r.current_generation_id),
      sessionStatus: String(r.session_status ?? "active"),
      turnCount: Number(r.turn_count ?? turnRows.length),
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
      updatedAt: r.updated_at instanceof Date ? r.updated_at.toISOString() : String(r.updated_at),
    },
    turns: turnRows.map(mapGenerationRow),
  };
}

export async function getGenerationById(id: string): Promise<PersistedGenerationRecord | null> {
  const sql = await getSql();
  const rows = (await sql`
    select * from generations
    where id = ${id}
    limit 1
  `) as Array<Record<string, unknown>>;
  return rows[0] ? mapGenerationRow(rows[0]) : null;
}

export async function listGenerationsHistory(options?: {
  projectId?: string;
  limit?: number;
}): Promise<PersistedGenerationRecord[]> {
  const sql = await getSql();
  const limit = Math.max(1, Math.min(50, options?.limit ?? 20));
  const rows = options?.projectId
    ? ((await sql`
        select * from generations
        where project_id = ${options.projectId}
        order by created_at desc
        limit ${limit}
      `) as Array<Record<string, unknown>>)
    : ((await sql`
        select * from generations
        order by created_at desc
        limit ${limit}
      `) as Array<Record<string, unknown>>);

  return rows.map(mapGenerationRow);
}

export async function listGenerationVersions(generationId: string): Promise<PersistedGenerationRecord[]> {
  const current = await getGenerationById(generationId);
  if (!current) return [];
  const sql = await getSql();

  if (current.sessionId) {
    const rows = (await sql`
      select * from generations
      where session_id = ${current.sessionId}
      order by created_at asc
      limit 25
    `) as Array<Record<string, unknown>>;
    return rows.map(mapGenerationRow);
  }

  const rootId = current.parentGenerationId ?? current.id;
  const rows = (await sql`
    select * from generations
    where id = ${rootId} or parent_generation_id = ${rootId} or id = ${current.id}
    order by created_at asc
    limit 25
  `) as Array<Record<string, unknown>>;
  return rows.map(mapGenerationRow);
}

export async function upsertProjectMemory(input: {
  projectId: string;
  memoryType: string;
  content: string;
  provenance?: string;
}): Promise<void> {
  const sql = await getSql();
  const id = `mem-${createHash("sha1").update(`${input.projectId}:${input.memoryType}:${input.content}`).digest("hex").slice(0, 12)}`;
  await sql`
    insert into project_memories (id, project_id, memory_type, content, provenance, updated_at)
    values (${id}, ${input.projectId}, ${input.memoryType}, ${input.content.slice(0, 600)}, ${input.provenance ?? "orchestrator"}, now())
    on conflict (id) do update set content = excluded.content, updated_at = now()
  `;
}
