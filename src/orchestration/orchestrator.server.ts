import { randomUUID } from "node:crypto";
import {
  NanoBananaGenerateSchema,
  normalizeReferenceManifest,
  type NanoBananaContinueEditRequest,
  type NanoBananaGenerateRequest,
  type NanoBananaModelKey,
  type NormalizedReferenceManifestItem,
  type ReferenceImageInput,
} from "@/schemas/nano-banana.schema";
import {
  evaluatePolicyGate,
  type PolicyConflict,
  type SafetyAuditResult,
} from "@/policies/architecture-rules";
import {
  NANO_BANANA_MODELS,
  NanoBananaProviderAdapter,
  type NormalizedProviderResponse,
} from "@/providers/nano-banana.adapter";
import { classifyArchitecturalTask, type TaskClassification } from "@/orchestration/classifier";
import {
  ArchitectureImagePromptCompiler,
  type CompiledArchitecturePrompt,
  type ProjectContext,
} from "@/orchestration/prompt-compiler";
import { selectNanoBananaModel, type ModelRoutingDecision } from "@/orchestration/model-router";
import {
  evaluateArchitecturalOutput,
  type ArchitecturalQualityEvaluation,
} from "@/orchestration/evaluator";
import {
  findGenerationByIdempotencyKey,
  getEditSession,
  loadProjectContextFromDb,
  saveGenerationRecord,
  upsertEditSession,
  upsertProjectMemory,
  type EditSessionRecord,
  type ExecutionStageTrace,
  type PersistedGenerationRecord,
} from "@/orchestration/repository.server";
import {
  PILOT_MAX_ATTEMPTS_TOTAL,
  buildArtifactManifest,
  sha256Hex,
  type ArtifactManifest,
} from "@/orchestration/zuke-governance";
import { getBriefHead } from "@/orchestration/zuke-ledger.server";
import type { ClientLabel } from "@/schemas/zuke-spec.schema";

export const ORCHESTRATION_QUEUES = {
  generation: "nano-banana-generation",
  evaluation: "image-quality-evaluation",
  storage: "image-asset-storage",
} as const;

export interface OrchestrationResult {
  generationId: string;
  traceId: string;
  sessionId: string;
  status: "completed" | "needs_confirmation" | "blocked" | "cached";
  provider: "google_gemini";
  logicalModelKey: NanoBananaModelKey;
  providerModelId: string;
  modelDisplayName: string;
  generationMode: string;
  taskIntent: string;
  outputImageUrl: string | null;
  textFeedback: string[];
  fallbackUsed: boolean;
  fallbackReason: string | null;
  retryAttempts: number;
  classification: TaskClassification;
  safety: SafetyAuditResult;
  conflicts: PolicyConflict[];
  routing: ModelRoutingDecision;
  compiledPrompt: CompiledArchitecturePrompt;
  referenceManifest: NormalizedReferenceManifestItem[];
  evaluation: ArchitecturalQualityEvaluation;
  stages: ExecutionStageTrace[];
  session?: EditSessionRecord;
  queueName: string;
  createdAt: string;
  // Additive ZUKE VIZ AI Specification v1.0.0 provenance & governance fields
  clientLabel: ClientLabel;
  briefRevision: number;
  briefHash: string;
  candidateSha256: string;
  artifactManifest: ArtifactManifest;
  changeProposal?: {
    required: true;
    reason: string;
    conflictingFields: string[];
    proposedBriefRevision: number;
  };
}

const STUDIO_PREVIEW_PLATES: Record<string, string> = {
  modern_villa: "/viz/matrix/parametric-dusk.jpg",
  luxury_villa: "/viz/matrix/parametric-dusk.jpg",
  interior_residential: "/viz/matrix/interior-luxe.jpg",
  interior_commercial: "/viz/matrix/interior-luxe.jpg",
  landscape_architecture: "/viz/matrix/zen-courtyard.jpg",
  office_tower: "/viz/matrix/urban-aerial.jpg",
  commercial_building: "/viz/matrix/urban-aerial.jpg",
  clay_render: "/viz/matrix/clay-exterior.jpg",
};

function selectFallbackPreviewPlate(request: NanoBananaGenerateRequest): string {
  if (request.imageUrl) return request.imageUrl;
  if (request.references[0]?.imageUrl) return request.references[0].imageUrl;
  if (request.design.renderStyle === "clay_render") return STUDIO_PREVIEW_PLATES.clay_render;
  return STUDIO_PREVIEW_PLATES[request.design.buildingType] ?? "/viz/matrix/parametric-dusk.jpg";
}

async function runWithBoundedRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: {
    maxAttempts: number;
    baseDelayMs: number;
    shouldRetry: (error: unknown) => boolean;
  },
): Promise<{ result: T; attempts: number }> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < options.maxAttempts) {
    attempt++;
    try {
      const result = await fn(attempt);
      return { result, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt >= options.maxAttempts || !options.shouldRetry(error)) {
        throw error;
      }
      const delay = options.baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export interface OrchestratorDependencies {
  adapter?: NanoBananaProviderAdapter;
  compiler?: ArchitectureImagePromptCompiler;
  skipPersistence?: boolean;
  retryBaseDelayMs?: number;
  contextLoader?: (projectId: string) => Promise<ProjectContext>;
}

export class ArchitecturalImageOrchestrator {
  private readonly adapter: NanoBananaProviderAdapter;
  private readonly compiler: ArchitectureImagePromptCompiler;
  private readonly skipPersistence: boolean;
  private readonly retryBaseDelayMs: number;
  private readonly contextLoader: (projectId: string) => Promise<ProjectContext>;

  constructor(deps?: OrchestratorDependencies) {
    this.adapter = deps?.adapter ?? new NanoBananaProviderAdapter();
    this.compiler = deps?.compiler ?? new ArchitectureImagePromptCompiler();
    this.skipPersistence = Boolean(deps?.skipPersistence);
    this.retryBaseDelayMs = deps?.retryBaseDelayMs ?? 120;
    this.contextLoader = deps?.contextLoader ?? loadProjectContextFromDb;
  }

  async execute(rawInput: unknown, extra?: {
    conversationTurns?: Array<{ role: "user" | "model"; text: string; imageUrl?: string }>;
  }): Promise<OrchestrationResult> {
    const traceId = `trc-${randomUUID().slice(0, 12)}`;
    const generationId = `gen-${randomUUID().slice(0, 12)}`;
    const stages: ExecutionStageTrace[] = [];

    const recordStage = async <T>(
      order: number,
      stage: string,
      fn: () => Promise<T> | T,
      describe?: (res: T) => { status?: ExecutionStageTrace["status"]; detail: string },
    ): Promise<T> => {
      const t0 = Date.now();
      try {
        const res = await fn();
        const meta = describe ? describe(res) : { status: "completed" as const, detail: "OK" };
        stages.push({
          order,
          stage,
          status: meta.status ?? "completed",
          durationMs: Math.max(0, Date.now() - t0),
          detail: meta.detail,
        });
        return res;
      } catch (err) {
        stages.push({
          order,
          stage,
          status: "failed",
          durationMs: Math.max(0, Date.now() - t0),
          detail: err instanceof Error ? err.message.slice(0, 200) : "Stage error",
        });
        throw err;
      }
    };

    // Stage 1: Validate request contract with Zod
    const request = await recordStage(
      1,
      "validate",
      () => NanoBananaGenerateSchema.parse(rawInput),
      (req) => ({ detail: `Validated ${req.generationMode} contract (${req.output.resolution} · ${req.output.aspectRatio}).` }),
    );

    // Idempotency deduplication check
    if (request.idempotencyKey && !this.skipPersistence) {
      const cached = await findGenerationByIdempotencyKey(request.idempotencyKey);
      if (cached) {
        const classification = classifyArchitecturalTask(request);
        const routing = selectNanoBananaModel(request, classification, this.adapter);
        const context = await this.contextLoader(request.projectId);
        const compiled = this.compiler.compile({
          request,
          sanitizedPrompt: request.prompt,
          taskIntent: classification.intent,
          context,
          referenceManifest: cached.referenceManifest,
        });
        const cachedBrief = await getBriefHead(request.projectId);
        const cachedLabel: ClientLabel = cached.evaluation.clientLabel ?? (cached.fallbackUsed ? "concept_preview" : "draft");
        const cachedManifest = buildArtifactManifest({
          projectId: request.projectId,
          runId: cached.id,
          parentCandidateId: cached.parentGenerationId,
          outputImageUrl: cached.outputImageUrl,
          briefRevision: cachedBrief.revision,
          briefHash: cachedBrief.briefHash,
          maskImageUrl: request.maskImageUrl,
          referenceManifest: cached.referenceManifest,
          request,
          provider: "google_gemini",
          modelRevision: cached.providerModelId,
          providerRequestId: cached.providerRequestId,
          attemptCostUsd: 0,
          clientLabel: cachedLabel,
          mandatoryChecksPassed: cached.evaluation.mandatoryChecksPassed ?? false,
        });
        return {
          generationId: cached.id,
          traceId: cached.traceId,
          sessionId: cached.sessionId ?? `ses-${cached.id}`,
          status: "cached",
          provider: "google_gemini",
          logicalModelKey: cached.logicalModelKey,
          providerModelId: cached.providerModelId,
          modelDisplayName: NANO_BANANA_MODELS[cached.logicalModelKey]?.displayName ?? cached.providerModelId,
          generationMode: cached.generationMode,
          taskIntent: cached.taskIntent,
          outputImageUrl: cached.outputImageUrl,
          textFeedback: [],
          fallbackUsed: cached.fallbackUsed,
          fallbackReason: cached.fallbackReason,
          retryAttempts: 0,
          classification,
          safety: { safe: true, sanitizedPrompt: request.prompt, injectionDetected: false, blockedReasons: [], warnings: [] },
          conflicts: [],
          routing,
          compiledPrompt: compiled,
          referenceManifest: cached.referenceManifest,
          evaluation: cached.evaluation,
          stages: cached.stages,
          queueName: ORCHESTRATION_QUEUES.generation,
          createdAt: cached.createdAt,
          clientLabel: cachedLabel,
          briefRevision: cachedBrief.revision,
          briefHash: cachedBrief.briefHash,
          candidateSha256: cachedManifest.candidateSha256,
          artifactManifest: cachedManifest,
        };
      }
    }

    // Stage 2: Normalize references & manifest ordering (P1..P5)
    const referenceManifest = await recordStage(
      2,
      "normalize",
      () => normalizeReferenceManifest(request.references, request.imageUrl),
      (manifest) => ({
        detail: `Normalized ${manifest.length} reference image(s) sorted by architectural priority.`,
      }),
    );

    // Stage 3: Protect (Safety & Prompt Injection isolation) + Stage 7 Policy Conflict preview
    const policyGate = await recordStage(
      3,
      "protect",
      () => evaluatePolicyGate(request, referenceManifest.length > 0),
      (gate) => ({
        status: gate.blocked ? "failed" : gate.safety.injectionDetected ? "warning" : "completed",
        detail: gate.blocked
          ? `Blocked: ${gate.conflicts.map((c) => c.reason).join("; ")}`
          : gate.safety.injectionDetected
            ? `Isolated potential prompt injection phrases (${gate.safety.warnings.length}).`
            : "Safety and injection boundary checks passed.",
      }),
    );

    // Stage 4: Classify task intent & complexity
    const classification = await recordStage(
      4,
      "classify",
      () => classifyArchitecturalTask(request),
      (cls) => ({ detail: cls.reasoning }),
    );

    // Stage 5: Retrieve project context & memories
    const projectContext = await recordStage(
      5,
      "retrieve",
      () => this.contextLoader(request.projectId),
      (ctx) => ({
        detail: `Loaded ${ctx.architecturalRules.length} project rules and ${ctx.memories.length} project memories.`,
      }),
    );

    // Stage 6: Extract structured requirements
    const combinedRefs: ReferenceImageInput[] = [
      ...(request.imageUrl && !request.references.some((r) => r.imageUrl === request.imageUrl)
        ? [
            {
              id: "ref-primary",
              imageUrl: request.imageUrl,
              referenceType: "geometry_reference" as const,
              priority: 1,
              label: "Primary Base Architecture",
            },
          ]
        : []),
      ...request.references,
    ];

    await recordStage(
      6,
      "extract",
      () => ({
        buildingType: request.design.buildingType,
        style: request.design.architecturalStyle,
        materialsCount: request.design.materials.length,
        lockedCount: Object.values(request.constraints).filter(Boolean).length,
      }),
      (ex) => ({
        detail: `Extracted ${ex.buildingType} · ${ex.style} · ${ex.materialsCount} material(s) · ${ex.lockedCount} constraint locks.`,
      }),
    );

    // Stage 7: Resolve policy contradictions
    await recordStage(
      7,
      "resolve",
      () => policyGate,
      (gate) => ({
        status: gate.blocked ? "failed" : gate.requiresConfirmation ? "warning" : "completed",
        detail:
          gate.conflicts.length === 0
            ? "No policy contradictions detected."
            : `${gate.conflicts.length} architectural policy conflict(s) detected (${gate.blocked ? "blocked" : gate.requiresConfirmation ? "awaiting confirmation" : "confirmed"}).`,
      }),
    );

    // Stage 8: Compile 18-section structured prompt
    const compiledPrompt = await recordStage(
      8,
      "compile",
      () =>
        this.compiler.compile({
          request,
          sanitizedPrompt: policyGate.safety.sanitizedPrompt,
          taskIntent: classification.intent,
          context: projectContext,
          referenceManifest,
        }),
      (cp) => ({
        detail: `Compiled 18-section architectural prompt v${cp.version} (~${cp.estimatedTokens} tokens, ${cp.fixedConstraints.length} fixed locks).`,
      }),
    );

    // Stage 9: Route to optimal Nano Banana model
    const routing = await recordStage(
      9,
      "route",
      () => selectNanoBananaModel(request, classification, this.adapter),
      (rt) => ({
        status: rt.capabilityWarnings.length > 0 ? "warning" : "completed",
        detail: `${rt.displayName} (${rt.providerModelId}) via ${rt.routingRule}. Fallbacks: ${rt.fallbackChain.join(" → ") || "none"}.`,
      }),
    );

    const sessionId = request.sessionId || `ses-${randomUUID().slice(0, 10)}`;
    const pinnedBrief = this.skipPersistence
      ? {
          revision: 1,
          briefHash: sha256Hex(`${request.projectId}:1:ephemeral`),
        }
      : await getBriefHead(request.projectId);

    // Early return if blocked or requires explicit user conflict confirmation
    if (policyGate.blocked || policyGate.requiresConfirmation) {
      const evaluation = evaluateArchitecturalOutput({
        request,
        compiled: compiledPrompt,
        referenceManifest,
        conflicts: policyGate.conflicts,
        imageUrl: undefined,
        fallbackUsed: false,
      });
      const artifactManifest = buildArtifactManifest({
        projectId: request.projectId,
        runId: generationId,
        parentCandidateId: request.parentGenerationId ?? null,
        outputImageUrl: null,
        briefRevision: pinnedBrief.revision,
        briefHash: pinnedBrief.briefHash,
        maskImageUrl: request.maskImageUrl,
        referenceManifest,
        request,
        provider: "google_gemini",
        modelRevision: routing.providerModelId,
        attemptCostUsd: 0,
        clientLabel: evaluation.clientLabel,
        mandatoryChecksPassed: evaluation.mandatoryChecksPassed,
      });
      return {
        generationId,
        traceId,
        sessionId,
        status: policyGate.blocked ? "blocked" : "needs_confirmation",
        provider: "google_gemini",
        logicalModelKey: routing.primaryModelKey,
        providerModelId: routing.providerModelId,
        modelDisplayName: routing.displayName,
        generationMode: request.generationMode,
        taskIntent: classification.intent,
        outputImageUrl: null,
        textFeedback: policyGate.conflicts.map((c) => `${c.field}: ${c.reason} ${c.suggestion}`),
        fallbackUsed: false,
        fallbackReason: null,
        retryAttempts: 0,
        classification,
        safety: policyGate.safety,
        conflicts: policyGate.conflicts,
        routing,
        compiledPrompt,
        referenceManifest,
        evaluation,
        stages,
        queueName: ORCHESTRATION_QUEUES.generation,
        createdAt: new Date().toISOString(),
        clientLabel: evaluation.clientLabel,
        briefRevision: pinnedBrief.revision,
        briefHash: pinnedBrief.briefHash,
        candidateSha256: artifactManifest.candidateSha256,
        artifactManifest,
        changeProposal: {
          required: true,
          reason: policyGate.conflicts.map((c) => c.reason).join(" "),
          conflictingFields: policyGate.conflicts.map((c) => c.field),
          proposedBriefRevision: pinnedBrief.revision + 1,
        },
      };
    }

    // Stage 10: Execute Nano Banana provider with bounded retries & explicit fallback tracking
    let activeModelKey: NanoBananaModelKey = routing.primaryModelKey;
    let activeProviderModelId = routing.providerModelId;
    let fallbackUsed = false;
    let fallbackReason: string | null = null;
    let totalAttempts = 0;

    const config = this.adapter.validateConfiguration();

    const execResult = await recordStage(
      10,
      "execute",
      async (): Promise<{
        live: boolean;
        model?: string;
        attempts?: number;
        reason?: string;
        response: NormalizedProviderResponse | null;
      }> => {
        if (!config.configured) {
          fallbackUsed = true;
          fallbackReason = "Server GOOGLE_GEMINI_API_KEY / GEMINI_API_KEY not configured; returned Studio preview composite.";
          return { live: false, reason: fallbackReason, response: null };
        }

        const candidateModels: NanoBananaModelKey[] = [
          routing.primaryModelKey,
          ...routing.fallbackChain,
        ];

        const errorMessages: string[] = [];

        for (let idx = 0; idx < candidateModels.length && totalAttempts < PILOT_MAX_ATTEMPTS_TOTAL; idx++) {
          const candidateKey = candidateModels[idx];
          const remainingBudget = Math.max(1, PILOT_MAX_ATTEMPTS_TOTAL - totalAttempts);
          const candidateMaxAttempts = Math.min(config.maxRetries, remainingBudget);
          try {
            const callProvider = () => {
              const basePayload = {
                modelKey: candidateKey,
                prompt: `${compiledPrompt.system}\n\n${compiledPrompt.userPrompt}`,
                negativeInstructions: compiledPrompt.negativePrompt,
                resolution: routing.normalizedResolution,
                aspectRatio: routing.normalizedAspectRatio,
                references: combinedRefs,
                maskImageUrl: request.maskImageUrl,
                conversationTurns: extra?.conversationTurns,
              };
              if (request.generationMode === "multi_reference" && combinedRefs.length >= 2) {
                return this.adapter.generateWithReferences(basePayload);
              }
              if (request.generationMode === "iterative_editing") {
                return this.adapter.continueEditing(basePayload);
              }
              if (
                (request.generationMode === "image_edit" ||
                  request.generationMode === "image_to_image" ||
                  request.generationMode === "style_transfer" ||
                  request.generationMode === "render_enhancement") &&
                combinedRefs.length > 0
              ) {
                return this.adapter.editImage({ ...basePayload, mode: request.generationMode });
              }
              return this.adapter.generateImage({ ...basePayload, mode: request.generationMode });
            };

            const { result, attempts } = await runWithBoundedRetry(callProvider, {
              maxAttempts: candidateMaxAttempts,
              baseDelayMs: this.retryBaseDelayMs,
              shouldRetry: (err) => this.adapter.mapProviderError(err).retryable,
            });
            totalAttempts += attempts;
            activeModelKey = candidateKey;
            activeProviderModelId = result.providerModelId;
            if (idx > 0) {
              fallbackUsed = true;
              fallbackReason = `Primary model ${NANO_BANANA_MODELS[routing.primaryModelKey].displayName} failed (${errorMessages.join("; ")}); succeeded on fallback ${NANO_BANANA_MODELS[candidateKey].displayName}.`;
            }
            return { live: true, model: activeProviderModelId, attempts, response: result };
          } catch (error) {
            totalAttempts += candidateMaxAttempts;
            const mapped = this.adapter.mapProviderError(error);
            errorMessages.push(`${NANO_BANANA_MODELS[candidateKey].displayName}: ${mapped.message}`);
            if (mapped.code === "AUTH_INVALID" || mapped.code === "PERMISSION_DENIED" || mapped.code === "UNCONFIGURED") {
              break;
            }
          }
        }

        fallbackUsed = true;
        fallbackReason = errorMessages.join(" | ") || "Cloud image generation unavailable; Studio preview composite returned.";
        return { live: false, reason: fallbackReason, response: null };
      },
      (execMeta) => ({
        status: execMeta.live ? (fallbackUsed ? "warning" : "completed") : "warning",
        detail: execMeta.live
          ? `Live Gemini Nano Banana asset returned from ${execMeta.model} (${execMeta.attempts} attempt${execMeta.attempts === 1 ? "" : "s"}).`
          : `Fallback active: ${execMeta.reason}`,
      }),
    );

    const providerResp: NormalizedProviderResponse | null = execResult.response;
    const outputImageUrl =
      providerResp?.assets[0]?.dataUrl ?? selectFallbackPreviewPlate(request);

    // Stage 11: Evaluate output against 8-stage / 100-point architectural rubric
    const evaluation = await recordStage(
      11,
      "evaluate",
      () =>
        evaluateArchitecturalOutput({
          request,
          compiled: compiledPrompt,
          referenceManifest,
          conflicts: policyGate.conflicts,
          imageUrl: outputImageUrl,
          fallbackUsed,
          providerFallbackReason: fallbackReason ?? undefined,
          hasTextFeedback: Boolean(providerResp?.textFeedback.length),
        }),
      (ev) => ({
        status: ev.status === "approved" ? "completed" : "warning",
        detail: `Score ${ev.totalScore}/100 (${ev.status})${ev.failedCriteria.length ? ` · Review: ${ev.failedCriteria.join(", ")}` : ""}.`,
      }),
    );

    const createdAt = new Date().toISOString();
    let sessionRecord: EditSessionRecord | undefined;

    // Stage 12: Persist generation, assets, reference links, usage, stages & edit session in Postgres/PGLite
    await recordStage(
      12,
      "persist",
      async () => {
        if (this.skipPersistence) return { persisted: false };
        const record: PersistedGenerationRecord = {
          id: generationId,
          traceId,
          projectId: request.projectId,
          userId: request.userId,
          parentGenerationId: request.parentGenerationId ?? null,
          sessionId,
          idempotencyKey: request.idempotencyKey ?? null,
          provider: "google_gemini",
          providerModelId: activeProviderModelId,
          logicalModelKey: activeModelKey,
          generationMode: request.generationMode,
          taskIntent: classification.intent,
          referenceManifest,
          outputResolution: routing.normalizedResolution,
          outputAspectRatio: routing.normalizedAspectRatio,
          generationPrompt: policyGate.safety.sanitizedPrompt,
          compiledPrompt: compiledPrompt.userPrompt,
          negativeInstructions: compiledPrompt.negativePrompt,
          providerRequestId: providerResp?.requestId ?? null,
          providerResponseMetadata: providerResp?.rawMetadata ?? { fallbackPreview: true },
          qualityScore: evaluation.totalScore,
          qualityStatus: evaluation.status,
          evaluation,
          stages,
          fallbackUsed,
          fallbackReason,
          status: "completed",
          outputImageUrl,
          createdAt,
        };

        await saveGenerationRecord(
          record,
          providerResp
            ? {
                generationId,
                provider: "google_gemini",
                modelId: activeProviderModelId,
                inputTokens: providerResp.usage.inputTokens,
                outputTokens: providerResp.usage.outputTokens,
                imageCount: providerResp.usage.imageCount,
                estimatedCost: providerResp.usage.estimatedCostUsd,
                actualCost: providerResp.usage.estimatedCostUsd,
                latencyMs: providerResp.latencyMs,
              }
            : {
                generationId,
                provider: "google_gemini",
                modelId: activeProviderModelId,
                inputTokens: compiledPrompt.estimatedTokens,
                outputTokens: 0,
                imageCount: 1,
                estimatedCost: 0,
                actualCost: 0,
                latencyMs: stages.reduce((acc, s) => acc + s.durationMs, 0),
              },
        );

        sessionRecord = await upsertEditSession({
          sessionId,
          projectId: request.projectId,
          userId: request.userId,
          generationId,
        });

        if (request.design.materials.length > 0) {
          await upsertProjectMemory({
            projectId: request.projectId,
            memoryType: "preferred_materials",
            content: `${request.design.architecturalStyle}: ${request.design.materials.join(", ")}`,
            provenance: generationId,
          }).catch(() => undefined);
        }

        return { persisted: true };
      },
      (res) => ({
        detail: res.persisted
          ? `Persisted generation ${generationId}, session ${sessionId}, usage & trace stages.`
          : "Persistence skipped in ephemeral test mode.",
      }),
    );

    const artifactManifest = buildArtifactManifest({
      projectId: request.projectId,
      runId: generationId,
      parentCandidateId: request.parentGenerationId ?? null,
      outputImageUrl,
      briefRevision: pinnedBrief.revision,
      briefHash: pinnedBrief.briefHash,
      maskImageUrl: request.maskImageUrl,
      referenceManifest,
      request,
      provider: "google_gemini",
      modelRevision: activeProviderModelId,
      providerRequestId: providerResp?.requestId ?? null,
      attemptCostUsd: providerResp?.usage.estimatedCostUsd ?? 0,
      clientLabel: evaluation.clientLabel,
      mandatoryChecksPassed: evaluation.mandatoryChecksPassed,
    });

    return {
      generationId,
      traceId,
      sessionId,
      status: "completed",
      provider: "google_gemini",
      logicalModelKey: activeModelKey,
      providerModelId: activeProviderModelId,
      modelDisplayName: NANO_BANANA_MODELS[activeModelKey].displayName,
      generationMode: request.generationMode,
      taskIntent: classification.intent,
      outputImageUrl,
      textFeedback: providerResp?.textFeedback ?? [],
      fallbackUsed,
      fallbackReason,
      retryAttempts: totalAttempts,
      classification,
      safety: policyGate.safety,
      conflicts: policyGate.conflicts,
      routing,
      compiledPrompt,
      referenceManifest,
      evaluation,
      stages,
      session: sessionRecord,
      queueName: ORCHESTRATION_QUEUES.generation,
      createdAt,
      clientLabel: evaluation.clientLabel,
      briefRevision: pinnedBrief.revision,
      briefHash: pinnedBrief.briefHash,
      candidateSha256: artifactManifest.candidateSha256,
      artifactManifest,
    };
  }

  async continueEditSession(
    sessionId: string,
    payload: NanoBananaContinueEditRequest,
  ): Promise<OrchestrationResult> {
    const { session, turns } = await getEditSession(sessionId);
    if (!session || turns.length === 0) {
      throw new Error(`Edit session "${sessionId}" was not found.`);
    }

    const latest = turns[turns.length - 1];
    const conversationTurns = turns.slice(-4).map((t) => ({
      role: "user" as const,
      text: t.generationPrompt,
      imageUrl: t.outputImageUrl ?? undefined,
    }));

    const refs: ReferenceImageInput[] = [
      ...(latest.outputImageUrl
        ? [
            {
              id: `prev-${latest.id}`,
              assetId: `asset-out-${latest.id}`,
              imageUrl: latest.outputImageUrl,
              referenceType: "previous_generation" as const,
              priority: 1,
              label: `Previous Iteration (${latest.id})`,
            },
          ]
        : []),
      ...payload.references,
    ];

    return this.execute(
      {
        projectId: payload.projectId || session.projectId,
        userId: payload.userId || session.userId,
        idempotencyKey: payload.idempotencyKey,
        generationMode: "iterative_editing",
        requestedModel: payload.requestedModel,
        prompt: payload.prompt,
        sessionId,
        parentGenerationId: latest.id,
        references: refs,
        confirmConflicts: payload.confirmConflicts,
        constraints: {
          preserveGeometry: true,
          preserveMass: true,
          preserveFloors: true,
          preserveWindows: true,
          preserveOpenings: true,
          preserveRoof: true,
          preserveFacadeStructure: true,
          preserveCamera: true,
          allowStructuralChanges: false,
          ...(payload.constraints ?? {}),
        },
        output: {
          format: "png",
          quality: "high",
          resolution: latest.outputResolution,
          aspectRatio: latest.outputAspectRatio,
          renderText: false,
          ...(payload.output ?? {}),
        },
      },
      { conversationTurns },
    );
  }
}

export const defaultArchitecturalOrchestrator = new ArchitecturalImageOrchestrator();
