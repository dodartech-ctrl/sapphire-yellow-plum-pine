import { z } from "zod";

/**
 * ZUKE VIZ AI — ArchViz Implementation Specification (v1.0.0)
 * Normative schemas, state machine, error codes, and runtime cross-checks.
 */

export const CLIENT_LABELS = [
  "concept_preview",
  "draft",
  "verified_for_listed_checks",
  "client_approved",
  "superseded",
] as const;

export type ClientLabel = (typeof CLIENT_LABELS)[number];

export const CLIENT_LABEL_DESCRIPTIONS: Record<ClientLabel, string> = {
  concept_preview: "Exploratory image with uncertain geometry.",
  draft: "Candidate awaiting checks or review.",
  verified_for_listed_checks: "All mandatory checks passed for the pinned brief and inputs.",
  client_approved: "Authorized reviewer approved a specific immutable candidate and brief.",
  superseded: "A newer brief or dependency revision exists.",
};

export const SPEC_RENDER_MODES = [
  "concept",
  "guided_2d",
  "masked_edit",
  "scene_locked",
  "multiview",
  "video",
  "panorama",
  "analyze",
] as const;

export type SpecRenderMode = (typeof SPEC_RENDER_MODES)[number];

export const SPEC_EXECUTION_MODES = [
  "concept",
  "guided_2d",
  "masked_edit",
  "scene_locked",
  "multiview",
  "video",
  "panorama",
] as const;

export type SpecExecutionMode = (typeof SPEC_EXECUTION_MODES)[number];

export const SPEC_INPUT_ROLES = [
  "geometry_base",
  "locked_camera_base",
  "edit_mask",
  "protected_mask",
  "material_reference",
  "style_reference",
  "lighting_reference",
  "vegetation_reference",
  "approved_previous_output",
] as const;

export type SpecInputRole = (typeof SPEC_INPUT_ROLES)[number];

export const SPEC_CHECK_IDS = [
  "G01",
  "G02",
  "G03",
  "G04",
  "G05",
  "G06",
  "G07",
  "G08",
  "G09",
  "G10",
  "G11",
] as const;

export type SpecCheckId = (typeof SPEC_CHECK_IDS)[number];

export const SPEC_CHECK_VERDICTS = ["pass", "fail", "unknown", "not_applicable"] as const;
export type SpecCheckVerdict = (typeof SPEC_CHECK_VERDICTS)[number];

export const CLAIM_CLASSES = [
  "verified_fact",
  "client_instruction",
  "observed",
  "inferred",
  "creative_option",
  "unknown",
] as const;

export type ClaimClass = (typeof CLAIM_CLASSES)[number];

export const MEMORY_CANDIDATE_STATES = [
  "proposed",
  "approved",
  "superseded",
  "rejected",
  "deleted",
] as const;

export type MemoryCandidateState = (typeof MEMORY_CANDIDATE_STATES)[number];

export const RUN_STATES = [
  "queued",
  "running",
  "validating",
  "awaiting_review",
  "draft_only",
  "failed",
  "cancelled",
  "rejected",
  "client_approved",
] as const;

export type RunState = (typeof RUN_STATES)[number];

export const RUN_STATE_TRANSITIONS: Record<RunState, readonly RunState[]> = {
  queued: ["running", "cancelled"],
  running: ["validating", "queued", "failed", "cancelled"],
  validating: ["queued", "awaiting_review", "draft_only", "failed", "cancelled"],
  awaiting_review: ["client_approved", "rejected", "cancelled"],
  draft_only: [],
  failed: [],
  cancelled: [],
  rejected: [],
  client_approved: [],
};

export function canTransitionRunState(from: RunState, to: RunState): boolean {
  return RUN_STATE_TRANSITIONS[from].includes(to);
}

export const SPEC_ERROR_CODES = {
  BRIEF_CONFLICT: { code: "BRIEF_CONFLICT", httpStatus: 409 },
  MISSING_REQUIRED_EVIDENCE: { code: "MISSING_REQUIRED_EVIDENCE", httpStatus: 422 },
  UNSUPPORTED_FIDELITY: { code: "UNSUPPORTED_FIDELITY", httpStatus: 422 },
  ASSET_FORBIDDEN: { code: "ASSET_FORBIDDEN", httpStatus: 403 },
  REVISION_CHANGED: { code: "REVISION_CHANGED", httpStatus: 409 },
  QUOTA_EXCEEDED: { code: "QUOTA_EXCEEDED", httpStatus: 429 },
  PROVIDER_STATUS_UNKNOWN: { code: "PROVIDER_STATUS_UNKNOWN", httpStatus: 202 },
  MANDATORY_CHECK_FAILED: { code: "MANDATORY_CHECK_FAILED", httpStatus: 422 },
} as const;

export type SpecErrorCode = keyof typeof SPEC_ERROR_CODES;

const Sha256Schema = z.string().regex(/^[0-9a-f]{64}$/, "Expected 64-character lowercase hex SHA-256 hash.");

export const AssetVersionSchema = z
  .object({
    asset_id: z.string().uuid(),
    version: z.number().int().min(1),
    sha256: Sha256Schema,
    role: z.enum(SPEC_INPUT_ROLES),
  })
  .strict();

export type AssetVersion = z.infer<typeof AssetVersionSchema>;

export const EvidenceSchema = z
  .object({
    id: z.string().uuid(),
    source_id: z.string().uuid(),
    revision: z.number().int().min(1),
    sha256: Sha256Schema,
    locator: z.string().min(1),
    retrieved_at: z.string().datetime(),
  })
  .strict();

export type EvidenceRecord = z.infer<typeof EvidenceSchema>;

export const RequirementSchema = z
  .object({
    id: z.string().min(1),
    target: z.string().min(1),
    operation: z.enum(["preserve", "change", "add", "remove", "match", "export"]),
    value: z.string().min(1),
    hard: z.boolean(),
    verification_check_ids: z
      .array(z.enum(SPEC_CHECK_IDS))
      .min(1)
      .refine((arr) => new Set(arr).size === arr.length, "verification_check_ids must be unique."),
    evidence_ids: z.array(z.string().uuid()),
  })
  .strict();

export type SpecRequirement = z.infer<typeof RequirementSchema>;

export const RunRequestSchema = z
  .object({
    project_id: z.string().uuid(),
    brief_revision: z.number().int().min(1),
    thread_id: z.string().uuid(),
    source_message_id: z.string().uuid(),
    mode: z.enum(SPEC_EXECUTION_MODES),
    assets: z.array(AssetVersionSchema),
    requirements: z.array(RequirementSchema).min(1),
    output: z
      .object({
        format: z.enum(["png", "jpeg", "webp", "mp4"]),
        width_px: z.number().int().min(1),
        height_px: z.number().int().min(1),
        view_ids: z.array(z.string().min(1)),
      })
      .strict(),
  })
  .strict();

export type SpecRunRequest = z.infer<typeof RunRequestSchema>;

export const ClaimSchema = z
  .object({
    text: z.string().min(1),
    class: z.enum(CLAIM_CLASSES),
    evidence_ids: z.array(z.string().uuid()),
    qualification: z.string().min(1).optional(),
  })
  .strict()
  .superRefine((claim, ctx) => {
    if (
      (claim.class === "verified_fact" ||
        claim.class === "observed" ||
        claim.class === "client_instruction") &&
      claim.evidence_ids.length < 1
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["evidence_ids"],
        message: `Claims of class '${claim.class}' require at least one evidence_id.`,
      });
    }
    if ((claim.class === "unknown" || claim.class === "inferred") && !claim.qualification) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["qualification"],
        message: `Claims of class '${claim.class}' require an explicit qualification.`,
      });
    }
  });

export type SpecClaim = z.infer<typeof ClaimSchema>;

export const GroundedAnswerSchema = z
  .object({
    status: z.enum(["answered", "partial", "needs_input", "conflict"]),
    claims: z.array(ClaimSchema),
    evidence: z.array(EvidenceSchema),
    questions: z.array(z.string().min(1)),
  })
  .strict();

export type GroundedAnswer = z.infer<typeof GroundedAnswerSchema>;

export const CheckResultSchema = z
  .object({
    check_id: z.enum(SPEC_CHECK_IDS),
    requirement_ids: z.array(z.string().min(1)),
    mandatory: z.boolean(),
    verdict: z.enum(SPEC_CHECK_VERDICTS),
    method_version: z.string().min(1),
    evidence_ids: z.array(z.string().uuid()),
    details: z.string().min(1),
  })
  .strict();

export type SpecCheckResult = z.infer<typeof CheckResultSchema>;

export const EvaluationContractSchema = z
  .object({
    run_id: z.string().uuid(),
    candidate_sha256: Sha256Schema,
    brief_revision: z.number().int().min(1),
    label: z.enum(CLIENT_LABELS),
    checks: z.array(CheckResultSchema).min(1),
  })
  .strict();

export type EvaluationContract = z.infer<typeof EvaluationContractSchema>;

/**
 * Derive server-owned mandatory check IDs for a given execution mode.
 * Client requests can never remove server policy checks.
 */
export function deriveMandatoryChecksForMode(mode: SpecRenderMode): SpecCheckId[] {
  switch (mode) {
    case "scene_locked":
      return ["G01", "G02", "G05", "G06", "G07"];
    case "multiview":
      return ["G01", "G02", "G05", "G06", "G07", "G08"];
    case "panorama":
      return ["G01", "G02", "G06", "G07", "G09"];
    case "masked_edit":
      return ["G04", "G06", "G07"];
    case "guided_2d":
      return ["G03", "G06", "G07"];
    case "video":
      return ["G06", "G07", "G08"];
    case "analyze":
      return ["G10"];
    case "concept":
    default:
      return ["G06", "G07"];
  }
}

export interface CrossCheckValidationResult {
  valid: boolean;
  errorCode?: SpecErrorCode;
  errors: string[];
  mandatoryChecks: SpecCheckId[];
}

/**
 * Runtime cross-checks mandated by contracts.runtime_cross_checks.
 */
export function validateRunRequestCrossChecks(
  req: SpecRunRequest,
  urlProjectId?: string,
): CrossCheckValidationResult {
  const errors: string[] = [];
  let errorCode: SpecErrorCode | undefined;

  if (urlProjectId && urlProjectId !== req.project_id) {
    errors.push(`URL project_id (${urlProjectId}) does not match body project_id (${req.project_id}).`);
    errorCode = "ASSET_FORBIDDEN";
  }

  const reqIds = new Set<string>();
  for (const r of req.requirements) {
    if (reqIds.has(r.id)) {
      errors.push(`Duplicate requirement ID detected: ${r.id}.`);
      errorCode ??= "MISSING_REQUIRED_EVIDENCE";
    }
    reqIds.add(r.id);
  }

  const roles = new Set(req.assets.map((a) => a.role));

  if (req.mode === "masked_edit") {
    if (!roles.has("edit_mask")) {
      errors.push("masked_edit requires an asset with role 'edit_mask'.");
      errorCode ??= "MISSING_REQUIRED_EVIDENCE";
    }
    if (!roles.has("geometry_base") && !roles.has("locked_camera_base") && !roles.has("approved_previous_output")) {
      errors.push("masked_edit requires an authorized baseline asset.");
      errorCode ??= "MISSING_REQUIRED_EVIDENCE";
    }
  }

  if ((req.mode === "scene_locked" || req.mode === "multiview") && !roles.has("geometry_base")) {
    errors.push(`${req.mode} requires an approved 'geometry_base' scene asset.`);
    errorCode ??= "UNSUPPORTED_FIDELITY";
  }

  if (req.mode === "panorama") {
    const ratio = req.output.width_px / req.output.height_px;
    if (Math.abs(ratio - 2) > 0.02) {
      errors.push(`Panorama output must have 2:1 equirectangular dimensions (got ${req.output.width_px}x${req.output.height_px}).`);
      errorCode ??= "UNSUPPORTED_FIDELITY";
    }
  }

  if (req.mode === "video" && req.output.format !== "mp4") {
    errors.push("Video mode requires output format 'mp4'.");
    errorCode ??= "UNSUPPORTED_FIDELITY";
  }

  if (req.mode !== "video" && req.output.format === "mp4") {
    errors.push(`Mode '${req.mode}' cannot output 'mp4'.`);
    errorCode ??= "UNSUPPORTED_FIDELITY";
  }

  const mandatoryChecks = deriveMandatoryChecksForMode(req.mode);
  return {
    valid: errors.length === 0,
    errorCode,
    errors,
    mandatoryChecks,
  };
}

/**
 * Verify that every evidence_id referenced by claims in a GroundedAnswer
 * resolves to an in-response evidence record and passes G10 (no unsupported verified_fact).
 */
export function validateGroundedAnswer(answer: GroundedAnswer): {
  valid: boolean;
  unsupportedClaims: string[];
  danglingEvidenceIds: string[];
} {
  const parsed = GroundedAnswerSchema.safeParse(answer);
  if (!parsed.success) {
    return {
      valid: false,
      unsupportedClaims: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      danglingEvidenceIds: [],
    };
  }

  const evidenceIds = new Set(answer.evidence.map((e) => e.id));
  const unsupportedClaims: string[] = [];
  const danglingEvidenceIds: string[] = [];

  for (const claim of answer.claims) {
    for (const eid of claim.evidence_ids) {
      if (!evidenceIds.has(eid)) {
        danglingEvidenceIds.push(eid);
        if (claim.class === "verified_fact" || claim.class === "observed" || claim.class === "client_instruction") {
          unsupportedClaims.push(claim.text);
        }
      }
    }
  }

  return {
    valid: unsupportedClaims.length === 0 && danglingEvidenceIds.length === 0,
    unsupportedClaims,
    danglingEvidenceIds,
  };
}
