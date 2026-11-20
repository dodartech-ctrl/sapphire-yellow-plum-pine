import { ZodError } from "zod";
import {
  NanoBananaContinueEditSchema,
  NanoBananaEditSchema,
  NanoBananaGenerateSchema,
  NanoBananaMultiRefSchema,
} from "@/schemas/nano-banana.schema";
import { NanoBananaProviderAdapter } from "@/providers/nano-banana.adapter";
import { defaultArchitecturalOrchestrator } from "@/orchestration/orchestrator.server";
import {
  getGenerationById,
  listGenerationsHistory,
  listGenerationVersions,
} from "@/orchestration/repository.server";

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 40;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(request: Request): Response | null {
  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "studio-local";
  const now = Date.now();
  const bucket = rateBuckets.get(clientKey);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(clientKey, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return null;
  }
  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX) {
    return Response.json(
      {
        error: "Rate limit exceeded for architectural image generation. Please retry shortly.",
        code: "RATE_LIMITED",
      },
      { status: 429 },
    );
  }
  return null;
}

function formatErrorResponse(error: unknown): Response {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: "Invalid request payload.",
        code: "VALIDATION_ERROR",
        issues: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }
  const message = error instanceof Error ? error.message : "Unexpected orchestration error.";
  const status = /not found/i.test(message)
    ? 404
    : /requires a source|requires at least/i.test(message)
      ? 400
      : 500;
  return Response.json({ error: message, code: status === 404 ? "NOT_FOUND" : "ORCHESTRATION_ERROR" }, { status });
}

async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const data = (await request.json()) as unknown;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Request body must be a JSON object.");
    }
    return data as Record<string, unknown>;
  } catch {
    throw new Error("Invalid JSON request body.");
  }
}

export function handleEngineStatus(): Response {
  const adapter = new NanoBananaProviderAdapter();
  return Response.json({
    module: "nano_banana_image_engine",
    version: "1.0.0",
    config: adapter.validateConfiguration(),
    models: adapter.getAvailableModels(),
  });
}

export async function handleGenerateEndpoint(request: Request): Promise<Response> {
  const limited = checkRateLimit(request);
  if (limited) return limited;
  try {
    const raw = await parseJsonBody(request);
    const idempotencyHeader = request.headers.get("x-idempotency-key")?.trim();
    const validated = NanoBananaGenerateSchema.parse({
      ...raw,
      ...(idempotencyHeader && !raw.idempotencyKey ? { idempotencyKey: idempotencyHeader } : {}),
    });
    const result = await defaultArchitecturalOrchestrator.execute(validated);
    const httpStatus =
      result.status === "blocked" ? 422 : result.status === "needs_confirmation" ? 409 : 200;
    return Response.json(result, { status: httpStatus });
  } catch (error) {
    return formatErrorResponse(error);
  }
}

export async function handleEditEndpoint(request: Request): Promise<Response> {
  const limited = checkRateLimit(request);
  if (limited) return limited;
  try {
    const raw = await parseJsonBody(request);
    const idempotencyHeader = request.headers.get("x-idempotency-key")?.trim();
    const validated = NanoBananaEditSchema.parse({
      generationMode: "image_edit",
      ...raw,
      ...(idempotencyHeader && !raw.idempotencyKey ? { idempotencyKey: idempotencyHeader } : {}),
    });
    const result = await defaultArchitecturalOrchestrator.execute(validated);
    const httpStatus =
      result.status === "blocked" ? 422 : result.status === "needs_confirmation" ? 409 : 200;
    return Response.json(result, { status: httpStatus });
  } catch (error) {
    return formatErrorResponse(error);
  }
}

export async function handleMultiReferenceEndpoint(request: Request): Promise<Response> {
  const limited = checkRateLimit(request);
  if (limited) return limited;
  try {
    const raw = await parseJsonBody(request);
    const idempotencyHeader = request.headers.get("x-idempotency-key")?.trim();
    const validated = NanoBananaMultiRefSchema.parse({
      ...raw,
      generationMode: "multi_reference",
      ...(idempotencyHeader && !raw.idempotencyKey ? { idempotencyKey: idempotencyHeader } : {}),
    });
    const result = await defaultArchitecturalOrchestrator.execute(validated);
    const httpStatus =
      result.status === "blocked" ? 422 : result.status === "needs_confirmation" ? 409 : 200;
    return Response.json(result, { status: httpStatus });
  } catch (error) {
    return formatErrorResponse(error);
  }
}

export async function handleContinueSessionEndpoint(
  request: Request,
  sessionId: string,
): Promise<Response> {
  const limited = checkRateLimit(request);
  if (limited) return limited;
  try {
    const raw = await parseJsonBody(request);
    const idempotencyHeader = request.headers.get("x-idempotency-key")?.trim();
    const validated = NanoBananaContinueEditSchema.parse({
      ...raw,
      ...(idempotencyHeader && !raw.idempotencyKey ? { idempotencyKey: idempotencyHeader } : {}),
    });
    const result = await defaultArchitecturalOrchestrator.continueEditSession(sessionId, validated);
    const httpStatus =
      result.status === "blocked" ? 422 : result.status === "needs_confirmation" ? 409 : 200;
    return Response.json(result, { status: httpStatus });
  } catch (error) {
    return formatErrorResponse(error);
  }
}

export async function handleHistoryEndpoint(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId")?.trim() || undefined;
    const limitParam = Number(url.searchParams.get("limit"));
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(50, limitParam) : 20;
    const items = await listGenerationsHistory({ projectId, limit });
    return Response.json({ count: items.length, items });
  } catch (error) {
    return formatErrorResponse(error);
  }
}

export async function handleGetImageEndpoint(id: string): Promise<Response> {
  try {
    const record = await getGenerationById(id);
    if (!record) {
      return Response.json({ error: `Generation "${id}" not found.`, code: "NOT_FOUND" }, { status: 404 });
    }
    return Response.json(record);
  } catch (error) {
    return formatErrorResponse(error);
  }
}

export async function handleGetVersionsEndpoint(id: string): Promise<Response> {
  try {
    const versions = await listGenerationVersions(id);
    if (versions.length === 0) {
      return Response.json({ error: `No versions found for "${id}".`, code: "NOT_FOUND" }, { status: 404 });
    }
    return Response.json({ generationId: id, count: versions.length, versions });
  } catch (error) {
    return formatErrorResponse(error);
  }
}

export async function handleGetEvaluationEndpoint(id: string): Promise<Response> {
  try {
    const record = await getGenerationById(id);
    if (!record) {
      return Response.json({ error: `Generation "${id}" not found.`, code: "NOT_FOUND" }, { status: 404 });
    }
    return Response.json({
      generationId: record.id,
      traceId: record.traceId,
      model: record.providerModelId,
      logicalModelKey: record.logicalModelKey,
      qualityScore: record.qualityScore,
      qualityStatus: record.qualityStatus,
      fallbackUsed: record.fallbackUsed,
      fallbackReason: record.fallbackReason,
      evaluation: record.evaluation,
      stages: record.stages,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
}
