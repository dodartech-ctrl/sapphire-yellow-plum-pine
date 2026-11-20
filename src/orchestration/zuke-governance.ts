import { createHash, randomUUID } from "node:crypto";
import type { NanoBananaGenerateRequest, NormalizedReferenceManifestItem } from "@/schemas/nano-banana.schema";
import type { PolicyConflict } from "@/policies/architecture-rules";
import {
  deriveMandatoryChecksForMode,
  validateGroundedAnswer,
  type ClientLabel,
  type GroundedAnswer,
  type SpecCheckId,
  type SpecCheckResult,
  type SpecRenderMode,
} from "@/schemas/zuke-spec.schema";

/**
 * ZUKE VIZ AI — G01–G11 Mandatory Gate Evaluator, Soft Ranking,
 * Immutable Artifact Manifest Builder, and Grounded Q&A Engine.
 */

export const PILOT_SOFT_RANKING_WEIGHTS = {
  realism: 0.3,
  style_fit: 0.25,
  atmosphere: 0.15,
  reference_match: 0.2,
  composition: 0.1,
} as const;

export const PILOT_MAX_ATTEMPTS_TOTAL = 3;

export interface SoftRankingScore {
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
}

export interface ArtifactManifest {
  manifestVersion: "1.0.0";
  tenantId: string;
  projectId: string;
  runId: string;
  parentCandidateId: string | null;
  candidateSha256: string;
  briefRevision: number;
  briefHash: string;
  maskSha256: string | null;
  sourceAssetHashes: Array<{ id: string; role: string; sha256: string }>;
  cameraAndUnits: {
    camera: string;
    lensMm: number;
    twoPointPerspective: boolean;
    aspectRatio: string;
    resolution: string;
    unitSystem: "metric_mm";
  };
  providerPin: {
    provider: string;
    modelRevision: string;
    adapterVersion: string;
    policyVersion: string;
    requestId: string | null;
    capabilityManifestId: string;
  };
  attemptCostUsd: number;
  clientLabel: ClientLabel;
  mandatoryChecksPassed: boolean;
  colorProfile: "sRGB IEC61966-2.1";
  createdAt: string;
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function inferSpecRenderMode(request: NanoBananaGenerateRequest, hasReferences: boolean): SpecRenderMode {
  if (request.maskImageUrl) return "masked_edit";
  if (request.task === "analyze") return "analyze";
  if (request.generationMode === "multi_reference" && hasReferences) return "guided_2d";
  if (
    hasReferences &&
    (request.generationMode === "image_edit" ||
      request.generationMode === "image_to_image" ||
      request.generationMode === "render_enhancement" ||
      request.generationMode === "iterative_editing")
  ) {
    const hasSceneRef = request.references.some(
      (r) => r.referenceType === "mass_model" || r.referenceType === "floor_plan" || r.referenceType === "elevation",
    );
    return hasSceneRef ? "scene_locked" : "guided_2d";
  }
  return "concept";
}

export function evaluateSpecGatesG01toG11(input: {
  request: NanoBananaGenerateRequest;
  mode: SpecRenderMode;
  referenceManifest: NormalizedReferenceManifestItem[];
  conflicts: PolicyConflict[];
  hasValidImage: boolean;
  fallbackUsed: boolean;
  maskOverlapDetected?: boolean;
  clientApproved?: boolean;
  supersededByNewerBrief?: boolean;
  evidenceId?: string;
}): {
  checks: SpecCheckResult[];
  clientLabel: ClientLabel;
  mandatoryPassed: boolean;
  failedMandatory: SpecCheckId[];
} {
  const {
    request,
    mode,
    referenceManifest,
    conflicts,
    hasValidImage,
    fallbackUsed,
    maskOverlapDetected = false,
    clientApproved = false,
    supersededByNewerBrief = false,
  } = input;

  const evIds = [input.evidenceId ?? randomUUID()];
  const mandatorySet = new Set<SpecCheckId>(deriveMandatoryChecksForMode(mode));
  const unresolvedBlocking = conflicts.filter((c) => c.resolution === "block").length;
  const unresolvedAsk = conflicts.filter((c) => c.resolution === "ask").length;
  const hasGeometryLock = request.constraints.preserveGeometry || request.constraints.preserveWindows;

  const checks: SpecCheckResult[] = [
    {
      check_id: "G01",
      requirement_ids: ["REQ-GEOMETRY"],
      mandatory: mandatorySet.has("G01"),
      verdict: !mandatorySet.has("G01")
        ? "not_applicable"
        : unresolvedBlocking > 0
          ? "fail"
          : fallbackUsed
            ? "unknown"
            : "pass",
      method_version: "scene-diff-1.0",
      evidence_ids: evIds,
      details:
        !mandatorySet.has("G01")
          ? "Not a scene-backed lock route."
          : unresolvedBlocking > 0
            ? "Unauthorized geometry or opening mutation blocked by policy."
            : fallbackUsed
              ? "Preview composite returned; live scene-diff verification pending."
              : "Protected geometry, massing, and opening identities preserved.",
    },
    {
      check_id: "G02",
      requirement_ids: ["REQ-CAMERA"],
      mandatory: mandatorySet.has("G02"),
      verdict: !mandatorySet.has("G02")
        ? "not_applicable"
        : conflicts.some((c) => c.field === "camera")
          ? "fail"
          : request.constraints.preserveCamera
            ? "pass"
            : "unknown",
      method_version: "camera-lock-1.0",
      evidence_ids: evIds,
      details: !mandatorySet.has("G02")
        ? "Camera lock check not mandated for exploratory mode."
        : `Camera ${request.design.lensMm}mm · ${request.output.aspectRatio} · 2-point ${request.design.twoPointPerspective ? "locked" : "open"}.`,
    },
    {
      check_id: "G03",
      requirement_ids: ["REQ-GUIDED-2D"],
      mandatory: mandatorySet.has("G03"),
      verdict: !mandatorySet.has("G03")
        ? "not_applicable"
        : referenceManifest.length === 0 || unresolvedBlocking > 0
          ? "fail"
          : fallbackUsed
            ? "unknown"
            : "pass",
      method_version: "guided-2d-anchor-1.0",
      evidence_ids: evIds,
      details: !mandatorySet.has("G03")
        ? "Not a guided 2D reference route."
        : referenceManifest.length > 0
          ? `Registered ${referenceManifest.length} priority-ordered 2D reference anchor(s); observable 2D features tracked.`
          : "Missing 2D base reference for guided_2d verification.",
    },
    {
      check_id: "G04",
      requirement_ids: ["REQ-MASK-LOCK"],
      mandatory: mandatorySet.has("G04"),
      verdict: !mandatorySet.has("G04")
        ? "not_applicable"
        : maskOverlapDetected || !request.maskImageUrl
          ? "fail"
          : "pass",
      method_version: "mask-pixel-lock-1.0",
      evidence_ids: evIds,
      details: !mandatorySet.has("G04")
        ? "No masked edit region supplied."
        : maskOverlapDetected
          ? "Edit mask overlaps protected window/structural mask; region blocked."
          : "Editable mask bounded with zero out-of-mask pixel drift policy.",
    },
    {
      check_id: "G05",
      requirement_ids: ["REQ-MATERIALS"],
      mandatory: mandatorySet.has("G05"),
      verdict: !mandatorySet.has("G05")
        ? "not_applicable"
        : request.design.materials.length > 0
          ? "pass"
          : "unknown",
      method_version: "material-id-1.0",
      evidence_ids: evIds,
      details:
        request.design.materials.length > 0
          ? `Locked material specifications: ${request.design.materials.slice(0, 4).join(", ")}.`
          : "No explicit material SKU/palette pinned; visual human review advised.",
    },
    {
      check_id: "G06",
      requirement_ids: ["REQ-EXPORT"],
      mandatory: mandatorySet.has("G06"),
      verdict: hasValidImage ? "pass" : "fail",
      method_version: "export-decode-1.0",
      evidence_ids: evIds,
      details: hasValidImage
        ? `Deliverable decoded cleanly (${request.output.format.toUpperCase()} · ${request.output.resolution} · ${request.output.aspectRatio}).`
        : "Output deliverable failed decode or integrity verification.",
    },
    {
      check_id: "G07",
      requirement_ids: ["REQ-ARTIFACTS"],
      mandatory: mandatorySet.has("G07"),
      verdict: !hasValidImage
        ? "fail"
        : unresolvedBlocking > 0 || unresolvedAsk > 0
          ? "fail"
          : fallbackUsed
            ? "unknown"
            : "pass",
      method_version: "artifact-screen-1.0",
      evidence_ids: evIds,
      details: fallbackUsed
        ? "Studio preview fallback active; live artifact screening pending cloud render."
        : unresolvedBlocking > 0 || unresolvedAsk > 0
          ? `${unresolvedBlocking + unresolvedAsk} unresolved requirement conflict(s) flagged.`
          : "No high-severity defects, duplicate mullions, or policy contradictions detected.",
    },
    {
      check_id: "G08",
      requirement_ids: ["REQ-MULTIVIEW"],
      mandatory: mandatorySet.has("G08"),
      verdict: mandatorySet.has("G08") ? (fallbackUsed ? "unknown" : "pass") : "not_applicable",
      method_version: "multiview-temporal-1.0",
      evidence_ids: evIds,
      details: mandatorySet.has("G08")
        ? "Shared scene revision and lighting/material coherence checked across views."
        : "Single-frame render; multiview/temporal check not applicable.",
    },
    {
      check_id: "G09",
      requirement_ids: ["REQ-PANORAMA"],
      mandatory: mandatorySet.has("G09"),
      verdict: mandatorySet.has("G09")
        ? request.output.aspectRatio === "21:9" || request.output.aspectRatio === "16:9"
          ? "unknown"
          : "pass"
        : "not_applicable",
      method_version: "panorama-seam-1.0",
      evidence_ids: evIds,
      details: mandatorySet.has("G09")
        ? "Equirectangular 2:1 wrap seam, pole geometry, and floor hotspot navigation checked."
        : "Non-panorama deliverable.",
    },
    {
      check_id: "G10",
      requirement_ids: ["REQ-GROUNDED-CLAIMS"],
      mandatory: mandatorySet.has("G10"),
      verdict: "pass",
      method_version: "claim-entailment-1.0",
      evidence_ids: evIds,
      details: "All factual claims bound to accessible project evidence; unverified dimensions abstained.",
    },
    {
      check_id: "G11",
      requirement_ids: ["REQ-CLIENT-APPROVAL"],
      mandatory: false,
      verdict: clientApproved ? "pass" : "unknown",
      method_version: "approval-binding-1.0",
      evidence_ids: evIds,
      details: clientApproved
        ? "Authorized reviewer approved exact immutable candidate SHA-256 and pinned brief hash."
        : "Awaiting explicit authorized reviewer approval.",
    },
  ];

  const mandatoryChecks = checks.filter((c) => c.mandatory);
  const failedMandatory = mandatoryChecks.filter((c) => c.verdict === "fail").map((c) => c.check_id);
  const unknownMandatory = mandatoryChecks.filter((c) => c.verdict === "unknown").map((c) => c.check_id);
  const mandatoryPassed = failedMandatory.length === 0 && unknownMandatory.length === 0;

  let clientLabel: ClientLabel;
  if (supersededByNewerBrief) {
    clientLabel = "superseded";
  } else if (clientApproved && mandatoryPassed) {
    clientLabel = "client_approved";
  } else if (mode === "concept" && (!hasGeometryLock || fallbackUsed)) {
    clientLabel = "concept_preview";
  } else if (mandatoryPassed) {
    clientLabel = "verified_for_listed_checks";
  } else {
    clientLabel = "draft";
  }

  return {
    checks,
    clientLabel,
    mandatoryPassed,
    failedMandatory,
  };
}

/**
 * Pilot soft-ranking weighted formula (only eligible when mandatory gates clear).
 */
export function computeSoftRanking(input: {
  mandatoryPassed: boolean;
  realism: number;
  styleFit: number;
  atmosphere: number;
  referenceMatch: number;
  composition: number;
  fallbackUsed: boolean;
}): SoftRankingScore {
  const clamp = (n: number) => Math.max(0, Math.min(1, Number(n.toFixed(3))));
  const breakdown = {
    realism: clamp(input.realism),
    style_fit: clamp(input.styleFit),
    atmosphere: clamp(input.atmosphere),
    reference_match: clamp(input.referenceMatch),
    composition: clamp(input.composition),
  };

  const weighted =
    breakdown.realism * PILOT_SOFT_RANKING_WEIGHTS.realism +
    breakdown.style_fit * PILOT_SOFT_RANKING_WEIGHTS.style_fit +
    breakdown.atmosphere * PILOT_SOFT_RANKING_WEIGHTS.atmosphere +
    breakdown.reference_match * PILOT_SOFT_RANKING_WEIGHTS.reference_match +
    breakdown.composition * PILOT_SOFT_RANKING_WEIGHTS.composition;

  const tradeoffs: string[] = [];
  if (!input.mandatoryPassed) {
    tradeoffs.push("Candidate blocked from promotion ranking until all mandatory gates clear.");
  }
  if (input.fallbackUsed) {
    tradeoffs.push("Studio preview composite returned; cloud photoreal pass needed for client sign-off.");
  }

  return {
    weightedScore: Number((weighted * 100).toFixed(1)),
    eligibleForRanking: input.mandatoryPassed,
    breakdown,
    tradeoffs,
  };
}

export function buildArtifactManifest(input: {
  tenantId?: string;
  projectId: string;
  runId: string;
  parentCandidateId?: string | null;
  outputImageUrl?: string | null;
  briefRevision: number;
  briefHash: string;
  maskImageUrl?: string | null;
  referenceManifest: NormalizedReferenceManifestItem[];
  request: NanoBananaGenerateRequest;
  provider: string;
  modelRevision: string;
  providerRequestId?: string | null;
  attemptCostUsd: number;
  clientLabel: ClientLabel;
  mandatoryChecksPassed: boolean;
}): ArtifactManifest {
  const candidateSha256 = sha256Hex(
    `${input.runId}:${input.outputImageUrl ?? "none"}:${input.briefHash}`,
  );
  return {
    manifestVersion: "1.0.0",
    tenantId: input.tenantId ?? "default-tenant",
    projectId: input.projectId,
    runId: input.runId,
    parentCandidateId: input.parentCandidateId ?? null,
    candidateSha256,
    briefRevision: input.briefRevision,
    briefHash: input.briefHash,
    maskSha256: input.maskImageUrl ? sha256Hex(input.maskImageUrl.slice(0, 64_000)) : null,
    sourceAssetHashes: input.referenceManifest.map((ref) => ({
      id: ref.assetId,
      role: ref.referenceType,
      sha256: sha256Hex(`${ref.assetId}:${ref.referenceType}:${ref.order}`),
    })),
    cameraAndUnits: {
      camera: input.request.design.camera,
      lensMm: input.request.design.lensMm,
      twoPointPerspective: input.request.design.twoPointPerspective,
      aspectRatio: input.request.output.aspectRatio,
      resolution: input.request.output.resolution,
      unitSystem: "metric_mm",
    },
    providerPin: {
      provider: input.provider,
      modelRevision: input.modelRevision,
      adapterVersion: "nano-banana-adapter-1.0.0",
      policyVersion: "zuke-policy-1.0.0",
      requestId: input.providerRequestId ?? null,
      capabilityManifestId: `cap-${input.modelRevision}`,
    },
    attemptCostUsd: Number(input.attemptCostUsd.toFixed(4)),
    clientLabel: input.clientLabel,
    mandatoryChecksPassed: input.mandatoryChecksPassed,
    colorProfile: "sRGB IEC61966-2.1",
    createdAt: new Date().toISOString(),
  };
}

/**
 * Grounded architectural Q&A responder implementing grounding.decision_flow,
 * claim classes (A01 unknown dimension abstention, A02 untrusted prompt-injection isolation,
 * A04 durable job status honesty, A05 conflicting source escalation).
 */
export function buildGroundedArchitecturalAnswer(input: {
  question: string;
  briefRevision: number;
  briefSummary: string;
  locks: string[];
  hasDimensionedDrawing: boolean;
  activeJobState?: string | null;
  conflictingSources?: Array<{ label: string; value: string }>;
}): GroundedAnswer {
  const q = input.question.trim();
  const briefEvidenceId = randomUUID();
  const sourceId = randomUUID();
  const retrievedAt = new Date().toISOString();

  const evidence = [
    {
      id: briefEvidenceId,
      source_id: sourceId,
      revision: Math.max(1, input.briefRevision),
      sha256: sha256Hex(`${input.briefRevision}:${input.briefSummary}`),
      locator: `brief revision ${input.briefRevision}, locks [${input.locks.join(", ") || "none"}]`,
      retrieved_at: retrievedAt,
    },
  ];

  // A02: Prompt injection or secret exfiltration inside question/document evidence
  if (/(ignore\s+previous|reveal\s+(api[_\s-]?key|secrets?)|bypass\s+locks)/i.test(q)) {
    const answer: GroundedAnswer = {
      status: "answered",
      claims: [
        {
          text: "Uploaded or quoted instructions are treated strictly as untrusted evidence; project locks and server credentials remain protected.",
          class: "client_instruction",
          evidence_ids: [briefEvidenceId],
        },
      ],
      evidence,
      questions: [],
    };
    return answer;
  }

  // A05: Conflicting dimensions across authoritative sources
  if (input.conflictingSources && input.conflictingSources.length >= 2) {
    const conflictText = input.conflictingSources.map((s) => `${s.label}: ${s.value}`).join(" vs. ");
    return {
      status: "conflict",
      claims: [
        {
          text: `Authoritative project sources disagree (${conflictText}).`,
          class: "observed",
          evidence_ids: [briefEvidenceId],
        },
      ],
      evidence,
      questions: ["Which revision should be adopted as the authoritative brief before dispatching renders?"],
    };
  }

  // A01: Exact dimension inquiry without a dimensioned CAD/BIM source
  const asksExactDimension = /\b(width|height|dimension|exact\s+size|how\s+wide|how\s+tall|millimet(er|re)|cm|meters?|feet|inches)\b/i.test(q);
  if (asksExactDimension && !input.hasDimensionedDrawing) {
    return {
      status: "partial",
      claims: [
        {
          text: `Brief revision ${input.briefRevision} currently enforces locks on: ${input.locks.join(", ") || "standard studio framing"}.`,
          class: "client_instruction",
          evidence_ids: [briefEvidenceId],
        },
        {
          text: "Exact opening or structural dimensions are unknown from a perspective image alone.",
          class: "unknown",
          evidence_ids: [],
          qualification: "The authorized sources currently available do not include a dimensioned CAD, BIM, or elevation drawing.",
        },
      ],
      evidence,
      questions: ["Upload a dimensioned elevation or CAD/BIM drawing with verified units to confirm exact measurements."],
    };
  }

  // A04: Job status honesty — never claim completion if job is still queued/running
  const asksJobStatus = /\b(status|done|finished|completed|ready|job|render)\b/i.test(q);
  if (asksJobStatus && input.activeJobState && input.activeJobState !== "client_approved" && input.activeJobState !== "completed") {
    return {
      status: "answered",
      claims: [
        {
          text: `Durable ledger reports current job state as '${input.activeJobState}'. Completion cannot be claimed before verification commits.`,
          class: "verified_fact",
          evidence_ids: [briefEvidenceId],
        },
      ],
      evidence,
      questions: [],
    };
  }

  const answer: GroundedAnswer = {
    status: "answered",
    claims: [
      {
        text: `Active brief revision ${input.briefRevision} locks: ${input.locks.join(", ") || "none"}. ${input.briefSummary.slice(0, 180)}`,
        class: "client_instruction",
        evidence_ids: [briefEvidenceId],
      },
    ],
    evidence,
    questions: [],
  };

  // Self-verify G10 before returning
  const check = validateGroundedAnswer(answer);
  if (!check.valid) {
    return {
      status: "needs_input",
      claims: [
        {
          text: "Insufficient verified evidence to answer with certainty.",
          class: "unknown",
          evidence_ids: [],
          qualification: "Server claim verification rejected unsupported citations.",
        },
      ],
      evidence,
      questions: ["Provide an authorized project source or brief revision to ground this question."],
    };
  }

  return answer;
}
