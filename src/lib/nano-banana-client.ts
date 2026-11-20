import type {
  ArchitecturalStyle,
  BuildingType,
  GenerationMode,
  GeometryConstraints,
  NanoBananaModelKey,
  OutputAspectRatio,
  OutputResolution,
  ReferenceType,
  RenderStyle,
  RequestedModelSelection,
} from "@/schemas/nano-banana.schema";

export interface NanoBananaModelOption {
  key: RequestedModelSelection;
  label: string;
  shortLabel: string;
  modelId: string;
  role: string;
  resolutions: readonly OutputResolution[];
}

export const NANO_BANANA_MODEL_OPTIONS: readonly NanoBananaModelOption[] = [
  {
    key: "auto",
    label: "Auto Router (Smart)",
    shortLabel: "NB Auto",
    modelId: "router",
    role: "Routes dynamically by task, references & resolution",
    resolutions: ["512", "1K", "2K", "4K"],
  },
  {
    key: "nano_banana_2_1",
    label: "Nano Banana 2.1",
    shortLabel: "NB 2.1",
    modelId: "gemini-nano-banana-2.1",
    role: "Primary architecture generation, multi-ref & editing",
    resolutions: ["1K", "2K", "4K"],
  },
  {
    key: "nano_banana_2",
    label: "Nano Banana 2",
    shortLabel: "NB 2",
    modelId: "gemini-3.1-flash-image → gemini-nano-banana-2.1",
    role: "Fast production generation and style transfer",
    resolutions: ["512", "1K", "2K", "4K"],
  },
  {
    key: "nano_banana_2_lite",
    label: "Nano Banana 2 Lite",
    shortLabel: "NB Lite",
    modelId: "gemini-3.1-flash-lite-image",
    role: "Very fast concept drafts & exploration",
    resolutions: ["512", "1K"],
  },
  {
    key: "nano_banana_pro",
    label: "Nano Banana Pro",
    shortLabel: "NB Pro",
    modelId: "gemini-3-pro-image",
    role: "Premium 4K presentation & typography fidelity",
    resolutions: ["1K", "2K", "4K"],
  },
] as const;

export const GENERATION_MODE_OPTIONS: ReadonlyArray<{
  id: GenerationMode;
  label: string;
  description: string;
}> = [
  { id: "text_to_image", label: "Text to Image", description: "Generate architectural render from structured brief" },
  { id: "image_to_image", label: "Image to Image", description: "Transform uploaded design or 3D snapshot" },
  { id: "image_edit", label: "Precision Edit", description: "Modify materials, lighting, or masked zones" },
  { id: "multi_reference", label: "Multi-Reference", description: "Synthesize geometry, material & lighting refs" },
  { id: "iterative_editing", label: "Iterative Session", description: "Multi-turn conversational architectural edits" },
  { id: "style_transfer", label: "Style Transfer", description: "Apply style while holding building geometry" },
  { id: "render_enhancement", label: "Render Enhance", description: "Elevate texture realism and daylighting" },
];

export interface NanoBananaStudioConfig {
  requestedModel: RequestedModelSelection;
  generationMode: GenerationMode;
  resolution: OutputResolution;
  aspectRatio: OutputAspectRatio;
  buildingType: BuildingType;
  architecturalStyle: ArchitecturalStyle;
  renderStyle: RenderStyle;
  constraints: GeometryConstraints;
  activeSessionId: string | null;
}

export const DEFAULT_NANO_BANANA_CONFIG: NanoBananaStudioConfig = {
  requestedModel: "auto",
  generationMode: "text_to_image",
  resolution: "2K",
  aspectRatio: "16:9",
  buildingType: "modern_villa",
  architecturalStyle: "contemporary",
  renderStyle: "photorealistic",
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
  },
  activeSessionId: null,
};

export interface OrchestrationStageClient {
  order: number;
  stage: string;
  status: "completed" | "skipped" | "warning" | "failed";
  durationMs: number;
  detail: string;
}

export interface QualityCriterionClient {
  key: string;
  label: string;
  weight: number;
  score: number;
  passed: boolean;
  notes: string;
}

export interface QualityStageClient {
  stage: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export interface OrchestrationResponseClient {
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
  conflicts: Array<{
    field: string;
    reason: string;
    resolution: "block" | "ask" | "allow";
    policyPriority: number;
    suggestion: string;
  }>;
  routing: {
    primaryModelKey: NanoBananaModelKey;
    providerModelId: string;
    displayName: string;
    routingRule: string;
    reason: string;
    fallbackChain: NanoBananaModelKey[];
    normalizedResolution: OutputResolution;
    normalizedAspectRatio: OutputAspectRatio;
    capabilityWarnings: string[];
  };
  compiledPrompt: {
    version: string;
    userPrompt: string;
    negativePrompt: string;
    fixedConstraints: string[];
    editableElements: string[];
    estimatedTokens: number;
    sections: Record<string, string>;
  };
  referenceManifest: Array<{
    order: number;
    id: string;
    assetId: string;
    referenceType: ReferenceType;
    priority: number;
    label: string;
  }>;
  evaluation: {
    totalScore: number;
    maxScore: number;
    status: "approved" | "needs_review" | "rework";
    rubric: QualityCriterionClient[];
    stages: QualityStageClient[];
    failedCriteria: string[];
    correctionInstructions: string[];
    disclaimer: string;
    specMode?: string;
    clientLabel?: SpecClientLabel;
    mandatoryChecksPassed?: boolean;
    specChecks?: SpecCheckResultClient[];
    softRanking?: {
      weightedScore: number;
      eligibleForRanking: boolean;
      breakdown: {
        realism: number;
        style_fit: number;
        atmosphere: number;
        reference_match: number;
        composition: number;
      };
      tradeoffs: string[];
    };
  };
  stages: OrchestrationStageClient[];
  queueName: string;
  createdAt: string;
  clientLabel?: SpecClientLabel;
  briefRevision?: number;
  briefHash?: string;
  candidateSha256?: string;
  artifactManifest?: {
    manifestVersion: string;
    candidateSha256: string;
    briefRevision: number;
    briefHash: string;
    clientLabel: SpecClientLabel;
    mandatoryChecksPassed: boolean;
    attemptCostUsd: number;
    colorProfile: string;
  };
  changeProposal?: {
    required: true;
    reason: string;
    conflictingFields: string[];
    proposedBriefRevision: number;
  };
}

export type SpecClientLabel =
  | "concept_preview"
  | "draft"
  | "verified_for_listed_checks"
  | "client_approved"
  | "superseded";

export interface SpecCheckResultClient {
  check_id: string;
  requirement_ids: string[];
  mandatory: boolean;
  verdict: "pass" | "fail" | "unknown" | "not_applicable";
  method_version: string;
  evidence_ids: string[];
  details: string;
}

export interface ProjectBriefResponseClient {
  projectId: string;
  head: {
    id: string;
    projectId: string;
    revision: number;
    parentRevision: number | null;
    briefHash: string;
    content: {
      title: string;
      summary: string;
      locks: string[];
      hasDimensionedDrawing: boolean;
      materialSpecs: string[];
      cameraNotes: string;
      updatedBy: string;
    };
    approvedBy: string | null;
    createdAt: string;
  };
  tools: Array<{
    name: string;
    authority: string;
    allowedRoles: string[];
    requiresExplicitApproval: boolean;
  }>;
  maxAttemptsTotal: number;
}

export interface GroundedQaResponseClient {
  projectId: string;
  briefRevision: number;
  briefHash: string;
  g10Passed: boolean;
  answer: {
    status: "answered" | "partial" | "needs_input" | "conflict";
    claims: Array<{
      text: string;
      class: string;
      evidence_ids: string[];
      qualification?: string;
    }>;
    evidence: Array<{
      id: string;
      locator: string;
      revision: number;
      sha256: string;
    }>;
    questions: string[];
  };
}

export interface HistoryRecordClient {
  id: string;
  traceId: string;
  projectId: string;
  sessionId: string | null;
  parentGenerationId: string | null;
  providerModelId: string;
  logicalModelKey: NanoBananaModelKey;
  generationMode: GenerationMode;
  taskIntent: string;
  outputResolution: OutputResolution;
  outputAspectRatio: OutputAspectRatio;
  generationPrompt: string;
  qualityScore: number;
  qualityStatus: string;
  fallbackUsed: boolean;
  fallbackReason: string | null;
  outputImageUrl: string | null;
  stages: OrchestrationStageClient[];
  evaluation: OrchestrationResponseClient["evaluation"];
  createdAt: string;
}

export function resolveRuntimeModelOverride(selection: RequestedModelSelection): string | undefined {
  switch (selection) {
    case "nano_banana_2_1":
    case "nano_banana_2":
      return "gemini-nano-banana-2.1";
    case "nano_banana_2_lite":
      return "gemini-3.1-flash-lite-image";
    case "nano_banana_pro":
      return "gemini-3-pro-image";
    default:
      return undefined;
  }
}

async function parseApiJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok && res.status !== 409 && res.status !== 422) {
    throw new Error(data.error || `Request failed with HTTP ${res.status}`);
  }
  return data;
}

export async function callNanoBananaApi(
  endpoint: "/api/v1/images/generate" | "/api/v1/images/edit" | "/api/v1/images/multi-reference",
  payload: Record<string, unknown>,
  idempotencyKey?: string,
): Promise<OrchestrationResponseClient> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
    },
    body: JSON.stringify(payload),
  });
  return parseApiJson<OrchestrationResponseClient>(res);
}

export async function continueNanoBananaSessionApi(
  sessionId: string,
  payload: Record<string, unknown>,
): Promise<OrchestrationResponseClient> {
  const res = await fetch(`/api/v1/images/sessions/${encodeURIComponent(sessionId)}/continue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseApiJson<OrchestrationResponseClient>(res);
}

export async function fetchNanoBananaHistoryApi(limit = 20): Promise<HistoryRecordClient[]> {
  const res = await fetch(`/api/v1/images/history?limit=${limit}`);
  const data = await parseApiJson<{ items: HistoryRecordClient[] }>(res);
  return data.items ?? [];
}

export async function fetchNanoBananaVersionsApi(generationId: string): Promise<HistoryRecordClient[]> {
  const res = await fetch(`/api/v1/images/${encodeURIComponent(generationId)}/versions`);
  const data = await parseApiJson<{ versions: HistoryRecordClient[] }>(res);
  return data.versions ?? [];
}

export async function fetchProjectBriefApi(projectId = "default-studio"): Promise<ProjectBriefResponseClient> {
  const res = await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/brief`);
  return parseApiJson<ProjectBriefResponseClient>(res);
}

export async function patchProjectBriefApi(
  projectId: string,
  expectedRevision: number,
  patch: {
    title?: string;
    summary?: string;
    locks?: string[];
    hasDimensionedDrawing?: boolean;
    materialSpecs?: string[];
  },
): Promise<{ ok?: boolean; head?: ProjectBriefResponseClient["head"]; errorCode?: string; error?: string }> {
  const res = await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/brief`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "If-Match": `"${expectedRevision}"`,
    },
    body: JSON.stringify({ expectedRevision, ...patch }),
  });
  return parseApiJson(res);
}

export async function approveRunCandidateApi(input: {
  projectId?: string;
  runId: string;
  candidateSha256: string;
  briefHash: string;
  briefRevision: number;
  reviewerId?: string;
  decision?: "client_approved" | "rejected";
}): Promise<{ ok?: boolean; clientLabel?: SpecClientLabel; error?: string }> {
  const projectId = input.projectId ?? "default-studio";
  const res = await fetch(
    `/api/v1/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(input.runId)}/approvals`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateSha256: input.candidateSha256,
        briefHash: input.briefHash,
        briefRevision: input.briefRevision,
        reviewerId: input.reviewerId ?? "principal-architect",
        reviewerRole: "reviewer",
        decision: input.decision ?? "client_approved",
      }),
    },
  );
  return parseApiJson(res);
}

export async function askGroundedQaApi(
  question: string,
  projectId = "default-studio",
): Promise<GroundedQaResponseClient> {
  const res = await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/grounded-qa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return parseApiJson<GroundedQaResponseClient>(res);
}
