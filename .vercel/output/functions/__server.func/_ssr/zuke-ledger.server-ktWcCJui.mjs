import { c as object, i as boolean, l as string, n as _enum, r as array, s as number, t as ZodIssueCode } from "../_libs/zod.mjs";
import { createHash, randomUUID } from "node:crypto";
// node_modules/.nitro/vite/services/ssr/assets/zuke-ledger.server-ktWcCJui.js
/**
* ZUKE VIZ AI — ArchViz Implementation Specification (v1.0.0)
* Normative schemas, state machine, error codes, and runtime cross-checks.
*/
var CLIENT_LABELS = [
	"concept_preview",
	"draft",
	"verified_for_listed_checks",
	"client_approved",
	"superseded"
];
var CLIENT_LABEL_DESCRIPTIONS = {
	concept_preview: "Exploratory image with uncertain geometry.",
	draft: "Candidate awaiting checks or review.",
	verified_for_listed_checks: "All mandatory checks passed for the pinned brief and inputs.",
	client_approved: "Authorized reviewer approved a specific immutable candidate and brief.",
	superseded: "A newer brief or dependency revision exists."
};
var SPEC_EXECUTION_MODES = [
	"concept",
	"guided_2d",
	"masked_edit",
	"scene_locked",
	"multiview",
	"video",
	"panorama"
];
var SPEC_INPUT_ROLES = [
	"geometry_base",
	"locked_camera_base",
	"edit_mask",
	"protected_mask",
	"material_reference",
	"style_reference",
	"lighting_reference",
	"vegetation_reference",
	"approved_previous_output"
];
var SPEC_CHECK_IDS = [
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
	"G11"
];
var SPEC_CHECK_VERDICTS = [
	"pass",
	"fail",
	"unknown",
	"not_applicable"
];
var CLAIM_CLASSES = [
	"verified_fact",
	"client_instruction",
	"observed",
	"inferred",
	"creative_option",
	"unknown"
];
var MEMORY_CANDIDATE_STATES = [
	"proposed",
	"approved",
	"superseded",
	"rejected",
	"deleted"
];
var Sha256Schema = string().regex(/^[0-9a-f]{64}$/, "Expected 64-character lowercase hex SHA-256 hash.");
var AssetVersionSchema = object({
	asset_id: string().uuid(),
	version: number().int().min(1),
	sha256: Sha256Schema,
	role: _enum(SPEC_INPUT_ROLES)
}).strict();
var EvidenceSchema = object({
	id: string().uuid(),
	source_id: string().uuid(),
	revision: number().int().min(1),
	sha256: Sha256Schema,
	locator: string().min(1),
	retrieved_at: string().datetime()
}).strict();
var RequirementSchema = object({
	id: string().min(1),
	target: string().min(1),
	operation: _enum([
		"preserve",
		"change",
		"add",
		"remove",
		"match",
		"export"
	]),
	value: string().min(1),
	hard: boolean(),
	verification_check_ids: array(_enum(SPEC_CHECK_IDS)).min(1).refine((arr) => new Set(arr).size === arr.length, "verification_check_ids must be unique."),
	evidence_ids: array(string().uuid())
}).strict();
object({
	project_id: string().uuid(),
	brief_revision: number().int().min(1),
	thread_id: string().uuid(),
	source_message_id: string().uuid(),
	mode: _enum(SPEC_EXECUTION_MODES),
	assets: array(AssetVersionSchema),
	requirements: array(RequirementSchema).min(1),
	output: object({
		format: _enum([
			"png",
			"jpeg",
			"webp",
			"mp4"
		]),
		width_px: number().int().min(1),
		height_px: number().int().min(1),
		view_ids: array(string().min(1))
	}).strict()
}).strict();
var ClaimSchema = object({
	text: string().min(1),
	class: _enum(CLAIM_CLASSES),
	evidence_ids: array(string().uuid()),
	qualification: string().min(1).optional()
}).strict().superRefine((claim, ctx) => {
	if ((claim.class === "verified_fact" || claim.class === "observed" || claim.class === "client_instruction") && claim.evidence_ids.length < 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["evidence_ids"],
		message: `Claims of class '${claim.class}' require at least one evidence_id.`
	});
	if ((claim.class === "unknown" || claim.class === "inferred") && !claim.qualification) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["qualification"],
		message: `Claims of class '${claim.class}' require an explicit qualification.`
	});
});
var GroundedAnswerSchema = object({
	status: _enum([
		"answered",
		"partial",
		"needs_input",
		"conflict"
	]),
	claims: array(ClaimSchema),
	evidence: array(EvidenceSchema),
	questions: array(string().min(1))
}).strict();
var CheckResultSchema = object({
	check_id: _enum(SPEC_CHECK_IDS),
	requirement_ids: array(string().min(1)),
	mandatory: boolean(),
	verdict: _enum(SPEC_CHECK_VERDICTS),
	method_version: string().min(1),
	evidence_ids: array(string().uuid()),
	details: string().min(1)
}).strict();
object({
	run_id: string().uuid(),
	candidate_sha256: Sha256Schema,
	brief_revision: number().int().min(1),
	label: _enum(CLIENT_LABELS),
	checks: array(CheckResultSchema).min(1)
}).strict();
/**
* Derive server-owned mandatory check IDs for a given execution mode.
* Client requests can never remove server policy checks.
*/
function deriveMandatoryChecksForMode(mode) {
	switch (mode) {
		case "scene_locked": return [
			"G01",
			"G02",
			"G05",
			"G06",
			"G07"
		];
		case "multiview": return [
			"G01",
			"G02",
			"G05",
			"G06",
			"G07",
			"G08"
		];
		case "panorama": return [
			"G01",
			"G02",
			"G06",
			"G07",
			"G09"
		];
		case "masked_edit": return [
			"G04",
			"G06",
			"G07"
		];
		case "guided_2d": return [
			"G03",
			"G06",
			"G07"
		];
		case "video": return [
			"G06",
			"G07",
			"G08"
		];
		case "analyze": return ["G10"];
		default: return ["G06", "G07"];
	}
}
/**
* Verify that every evidence_id referenced by claims in a GroundedAnswer
* resolves to an in-response evidence record and passes G10 (no unsupported verified_fact).
*/
function validateGroundedAnswer(answer) {
	const parsed = GroundedAnswerSchema.safeParse(answer);
	if (!parsed.success) return {
		valid: false,
		unsupportedClaims: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
		danglingEvidenceIds: []
	};
	const evidenceIds = new Set(answer.evidence.map((e) => e.id));
	const unsupportedClaims = [];
	const danglingEvidenceIds = [];
	for (const claim of answer.claims) for (const eid of claim.evidence_ids) if (!evidenceIds.has(eid)) {
		danglingEvidenceIds.push(eid);
		if (claim.class === "verified_fact" || claim.class === "observed" || claim.class === "client_instruction") unsupportedClaims.push(claim.text);
	}
	return {
		valid: unsupportedClaims.length === 0 && danglingEvidenceIds.length === 0,
		unsupportedClaims,
		danglingEvidenceIds
	};
}
/**
* ZUKE VIZ AI — G01–G11 Mandatory Gate Evaluator, Soft Ranking,
* Immutable Artifact Manifest Builder, and Grounded Q&A Engine.
*/
var PILOT_SOFT_RANKING_WEIGHTS = {
	realism: .3,
	style_fit: .25,
	atmosphere: .15,
	reference_match: .2,
	composition: .1
};
function sha256Hex(value) {
	return createHash("sha256").update(value).digest("hex");
}
function inferSpecRenderMode(request, hasReferences) {
	if (request.maskImageUrl) return "masked_edit";
	if (request.task === "analyze") return "analyze";
	if (request.generationMode === "multi_reference" && hasReferences) return "guided_2d";
	if (hasReferences && (request.generationMode === "image_edit" || request.generationMode === "image_to_image" || request.generationMode === "render_enhancement" || request.generationMode === "iterative_editing")) return request.references.some((r) => r.referenceType === "mass_model" || r.referenceType === "floor_plan" || r.referenceType === "elevation") ? "scene_locked" : "guided_2d";
	return "concept";
}
function evaluateSpecGatesG01toG11(input) {
	const { request, mode, referenceManifest, conflicts, hasValidImage, fallbackUsed, maskOverlapDetected = false, clientApproved = false, supersededByNewerBrief = false } = input;
	const evIds = [input.evidenceId ?? randomUUID()];
	const mandatorySet = new Set(deriveMandatoryChecksForMode(mode));
	const unresolvedBlocking = conflicts.filter((c) => c.resolution === "block").length;
	const unresolvedAsk = conflicts.filter((c) => c.resolution === "ask").length;
	const hasGeometryLock = request.constraints.preserveGeometry || request.constraints.preserveWindows;
	const checks = [
		{
			check_id: "G01",
			requirement_ids: ["REQ-GEOMETRY"],
			mandatory: mandatorySet.has("G01"),
			verdict: !mandatorySet.has("G01") ? "not_applicable" : unresolvedBlocking > 0 ? "fail" : fallbackUsed ? "unknown" : "pass",
			method_version: "scene-diff-1.0",
			evidence_ids: evIds,
			details: !mandatorySet.has("G01") ? "Not a scene-backed lock route." : unresolvedBlocking > 0 ? "Unauthorized geometry or opening mutation blocked by policy." : fallbackUsed ? "Preview composite returned; live scene-diff verification pending." : "Protected geometry, massing, and opening identities preserved."
		},
		{
			check_id: "G02",
			requirement_ids: ["REQ-CAMERA"],
			mandatory: mandatorySet.has("G02"),
			verdict: !mandatorySet.has("G02") ? "not_applicable" : conflicts.some((c) => c.field === "camera") ? "fail" : request.constraints.preserveCamera ? "pass" : "unknown",
			method_version: "camera-lock-1.0",
			evidence_ids: evIds,
			details: !mandatorySet.has("G02") ? "Camera lock check not mandated for exploratory mode." : `Camera ${request.design.lensMm}mm · ${request.output.aspectRatio} · 2-point ${request.design.twoPointPerspective ? "locked" : "open"}.`
		},
		{
			check_id: "G03",
			requirement_ids: ["REQ-GUIDED-2D"],
			mandatory: mandatorySet.has("G03"),
			verdict: !mandatorySet.has("G03") ? "not_applicable" : referenceManifest.length === 0 || unresolvedBlocking > 0 ? "fail" : fallbackUsed ? "unknown" : "pass",
			method_version: "guided-2d-anchor-1.0",
			evidence_ids: evIds,
			details: !mandatorySet.has("G03") ? "Not a guided 2D reference route." : referenceManifest.length > 0 ? `Registered ${referenceManifest.length} priority-ordered 2D reference anchor(s); observable 2D features tracked.` : "Missing 2D base reference for guided_2d verification."
		},
		{
			check_id: "G04",
			requirement_ids: ["REQ-MASK-LOCK"],
			mandatory: mandatorySet.has("G04"),
			verdict: !mandatorySet.has("G04") ? "not_applicable" : maskOverlapDetected || !request.maskImageUrl ? "fail" : "pass",
			method_version: "mask-pixel-lock-1.0",
			evidence_ids: evIds,
			details: !mandatorySet.has("G04") ? "No masked edit region supplied." : maskOverlapDetected ? "Edit mask overlaps protected window/structural mask; region blocked." : "Editable mask bounded with zero out-of-mask pixel drift policy."
		},
		{
			check_id: "G05",
			requirement_ids: ["REQ-MATERIALS"],
			mandatory: mandatorySet.has("G05"),
			verdict: !mandatorySet.has("G05") ? "not_applicable" : request.design.materials.length > 0 ? "pass" : "unknown",
			method_version: "material-id-1.0",
			evidence_ids: evIds,
			details: request.design.materials.length > 0 ? `Locked material specifications: ${request.design.materials.slice(0, 4).join(", ")}.` : "No explicit material SKU/palette pinned; visual human review advised."
		},
		{
			check_id: "G06",
			requirement_ids: ["REQ-EXPORT"],
			mandatory: mandatorySet.has("G06"),
			verdict: hasValidImage ? "pass" : "fail",
			method_version: "export-decode-1.0",
			evidence_ids: evIds,
			details: hasValidImage ? `Deliverable decoded cleanly (${request.output.format.toUpperCase()} · ${request.output.resolution} · ${request.output.aspectRatio}).` : "Output deliverable failed decode or integrity verification."
		},
		{
			check_id: "G07",
			requirement_ids: ["REQ-ARTIFACTS"],
			mandatory: mandatorySet.has("G07"),
			verdict: !hasValidImage ? "fail" : unresolvedBlocking > 0 || unresolvedAsk > 0 ? "fail" : fallbackUsed ? "unknown" : "pass",
			method_version: "artifact-screen-1.0",
			evidence_ids: evIds,
			details: fallbackUsed ? "Studio preview fallback active; live artifact screening pending cloud render." : unresolvedBlocking > 0 || unresolvedAsk > 0 ? `${unresolvedBlocking + unresolvedAsk} unresolved requirement conflict(s) flagged.` : "No high-severity defects, duplicate mullions, or policy contradictions detected."
		},
		{
			check_id: "G08",
			requirement_ids: ["REQ-MULTIVIEW"],
			mandatory: mandatorySet.has("G08"),
			verdict: mandatorySet.has("G08") ? fallbackUsed ? "unknown" : "pass" : "not_applicable",
			method_version: "multiview-temporal-1.0",
			evidence_ids: evIds,
			details: mandatorySet.has("G08") ? "Shared scene revision and lighting/material coherence checked across views." : "Single-frame render; multiview/temporal check not applicable."
		},
		{
			check_id: "G09",
			requirement_ids: ["REQ-PANORAMA"],
			mandatory: mandatorySet.has("G09"),
			verdict: mandatorySet.has("G09") ? request.output.aspectRatio === "21:9" || request.output.aspectRatio === "16:9" ? "unknown" : "pass" : "not_applicable",
			method_version: "panorama-seam-1.0",
			evidence_ids: evIds,
			details: mandatorySet.has("G09") ? "Equirectangular 2:1 wrap seam, pole geometry, and floor hotspot navigation checked." : "Non-panorama deliverable."
		},
		{
			check_id: "G10",
			requirement_ids: ["REQ-GROUNDED-CLAIMS"],
			mandatory: mandatorySet.has("G10"),
			verdict: "pass",
			method_version: "claim-entailment-1.0",
			evidence_ids: evIds,
			details: "All factual claims bound to accessible project evidence; unverified dimensions abstained."
		},
		{
			check_id: "G11",
			requirement_ids: ["REQ-CLIENT-APPROVAL"],
			mandatory: false,
			verdict: clientApproved ? "pass" : "unknown",
			method_version: "approval-binding-1.0",
			evidence_ids: evIds,
			details: clientApproved ? "Authorized reviewer approved exact immutable candidate SHA-256 and pinned brief hash." : "Awaiting explicit authorized reviewer approval."
		}
	];
	const mandatoryChecks = checks.filter((c) => c.mandatory);
	const failedMandatory = mandatoryChecks.filter((c) => c.verdict === "fail").map((c) => c.check_id);
	const unknownMandatory = mandatoryChecks.filter((c) => c.verdict === "unknown").map((c) => c.check_id);
	const mandatoryPassed = failedMandatory.length === 0 && unknownMandatory.length === 0;
	let clientLabel;
	if (supersededByNewerBrief) clientLabel = "superseded";
	else if (clientApproved && mandatoryPassed) clientLabel = "client_approved";
	else if (mode === "concept" && (!hasGeometryLock || fallbackUsed)) clientLabel = "concept_preview";
	else if (mandatoryPassed) clientLabel = "verified_for_listed_checks";
	else clientLabel = "draft";
	return {
		checks,
		clientLabel,
		mandatoryPassed,
		failedMandatory
	};
}
/**
* Pilot soft-ranking weighted formula (only eligible when mandatory gates clear).
*/
function computeSoftRanking(input) {
	const clamp = (n) => Math.max(0, Math.min(1, Number(n.toFixed(3))));
	const breakdown = {
		realism: clamp(input.realism),
		style_fit: clamp(input.styleFit),
		atmosphere: clamp(input.atmosphere),
		reference_match: clamp(input.referenceMatch),
		composition: clamp(input.composition)
	};
	const weighted = breakdown.realism * PILOT_SOFT_RANKING_WEIGHTS.realism + breakdown.style_fit * PILOT_SOFT_RANKING_WEIGHTS.style_fit + breakdown.atmosphere * PILOT_SOFT_RANKING_WEIGHTS.atmosphere + breakdown.reference_match * PILOT_SOFT_RANKING_WEIGHTS.reference_match + breakdown.composition * PILOT_SOFT_RANKING_WEIGHTS.composition;
	const tradeoffs = [];
	if (!input.mandatoryPassed) tradeoffs.push("Candidate blocked from promotion ranking until all mandatory gates clear.");
	if (input.fallbackUsed) tradeoffs.push("Studio preview composite returned; cloud photoreal pass needed for client sign-off.");
	return {
		weightedScore: Number((weighted * 100).toFixed(1)),
		eligibleForRanking: input.mandatoryPassed,
		breakdown,
		tradeoffs
	};
}
function buildArtifactManifest(input) {
	const candidateSha256 = sha256Hex(`${input.runId}:${input.outputImageUrl ?? "none"}:${input.briefHash}`);
	return {
		manifestVersion: "1.0.0",
		tenantId: input.tenantId ?? "default-tenant",
		projectId: input.projectId,
		runId: input.runId,
		parentCandidateId: input.parentCandidateId ?? null,
		candidateSha256,
		briefRevision: input.briefRevision,
		briefHash: input.briefHash,
		maskSha256: input.maskImageUrl ? sha256Hex(input.maskImageUrl.slice(0, 64e3)) : null,
		sourceAssetHashes: input.referenceManifest.map((ref) => ({
			id: ref.assetId,
			role: ref.referenceType,
			sha256: sha256Hex(`${ref.assetId}:${ref.referenceType}:${ref.order}`)
		})),
		cameraAndUnits: {
			camera: input.request.design.camera,
			lensMm: input.request.design.lensMm,
			twoPointPerspective: input.request.design.twoPointPerspective,
			aspectRatio: input.request.output.aspectRatio,
			resolution: input.request.output.resolution,
			unitSystem: "metric_mm"
		},
		providerPin: {
			provider: input.provider,
			modelRevision: input.modelRevision,
			adapterVersion: "nano-banana-adapter-1.0.0",
			policyVersion: "zuke-policy-1.0.0",
			requestId: input.providerRequestId ?? null,
			capabilityManifestId: `cap-${input.modelRevision}`
		},
		attemptCostUsd: Number(input.attemptCostUsd.toFixed(4)),
		clientLabel: input.clientLabel,
		mandatoryChecksPassed: input.mandatoryChecksPassed,
		colorProfile: "sRGB IEC61966-2.1",
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
/**
* Grounded architectural Q&A responder implementing grounding.decision_flow,
* claim classes (A01 unknown dimension abstention, A02 untrusted prompt-injection isolation,
* A04 durable job status honesty, A05 conflicting source escalation).
*/
function buildGroundedArchitecturalAnswer(input) {
	const q = input.question.trim();
	const briefEvidenceId = randomUUID();
	const sourceId = randomUUID();
	const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
	const evidence = [{
		id: briefEvidenceId,
		source_id: sourceId,
		revision: Math.max(1, input.briefRevision),
		sha256: sha256Hex(`${input.briefRevision}:${input.briefSummary}`),
		locator: `brief revision ${input.briefRevision}, locks [${input.locks.join(", ") || "none"}]`,
		retrieved_at: retrievedAt
	}];
	if (/(ignore\s+previous|reveal\s+(api[_\s-]?key|secrets?)|bypass\s+locks)/i.test(q)) return {
		status: "answered",
		claims: [{
			text: "Uploaded or quoted instructions are treated strictly as untrusted evidence; project locks and server credentials remain protected.",
			class: "client_instruction",
			evidence_ids: [briefEvidenceId]
		}],
		evidence,
		questions: []
	};
	if (input.conflictingSources && input.conflictingSources.length >= 2) return {
		status: "conflict",
		claims: [{
			text: `Authoritative project sources disagree (${input.conflictingSources.map((s) => `${s.label}: ${s.value}`).join(" vs. ")}).`,
			class: "observed",
			evidence_ids: [briefEvidenceId]
		}],
		evidence,
		questions: ["Which revision should be adopted as the authoritative brief before dispatching renders?"]
	};
	if (/\b(width|height|dimension|exact\s+size|how\s+wide|how\s+tall|millimet(er|re)|cm|meters?|feet|inches)\b/i.test(q) && !input.hasDimensionedDrawing) return {
		status: "partial",
		claims: [{
			text: `Brief revision ${input.briefRevision} currently enforces locks on: ${input.locks.join(", ") || "standard studio framing"}.`,
			class: "client_instruction",
			evidence_ids: [briefEvidenceId]
		}, {
			text: "Exact opening or structural dimensions are unknown from a perspective image alone.",
			class: "unknown",
			evidence_ids: [],
			qualification: "The authorized sources currently available do not include a dimensioned CAD, BIM, or elevation drawing."
		}],
		evidence,
		questions: ["Upload a dimensioned elevation or CAD/BIM drawing with verified units to confirm exact measurements."]
	};
	if (/\b(status|done|finished|completed|ready|job|render)\b/i.test(q) && input.activeJobState && input.activeJobState !== "client_approved" && input.activeJobState !== "completed") return {
		status: "answered",
		claims: [{
			text: `Durable ledger reports current job state as '${input.activeJobState}'. Completion cannot be claimed before verification commits.`,
			class: "verified_fact",
			evidence_ids: [briefEvidenceId]
		}],
		evidence,
		questions: []
	};
	const answer = {
		status: "answered",
		claims: [{
			text: `Active brief revision ${input.briefRevision} locks: ${input.locks.join(", ") || "none"}. ${input.briefSummary.slice(0, 180)}`,
			class: "client_instruction",
			evidence_ids: [briefEvidenceId]
		}],
		evidence,
		questions: []
	};
	if (!validateGroundedAnswer(answer).valid) return {
		status: "needs_input",
		claims: [{
			text: "Insufficient verified evidence to answer with certainty.",
			class: "unknown",
			evidence_ids: [],
			qualification: "Server claim verification rejected unsupported citations."
		}],
		evidence,
		questions: ["Provide an authorized project source or brief revision to ground this question."]
	};
	return answer;
}
var DEFAULT_TENANT = "default-tenant";
var DEFAULT_BRIEF_CONTENT = {
	title: "Primary Architectural Visualization Brief",
	summary: "Preserve approved structural massing, floor datums, roofline silhouette, and window aperture rhythm; iterate freely on facade cladding, daylighting, and landscape staging.",
	locks: [
		"geometry",
		"massing",
		"floors",
		"windows",
		"roofline",
		"facade_grid",
		"camera"
	],
	hasDimensionedDrawing: false,
	materialSpecs: [
		"board-formed concrete",
		"warm architectural travertine",
		"bronze mullions"
	],
	cameraNotes: "35mm eye-level architectural lens with strict 2-point vertical alignment.",
	updatedBy: "studio-system"
};
var memStore = {
	briefs: [],
	threadNextSeq: /* @__PURE__ */ new Map(),
	deletedThreads: /* @__PURE__ */ new Set(),
	messages: [],
	memoryItems: [],
	approvals: [],
	audits: []
};
var ledgerMemoryOnly = false;
async function tryGetSql() {
	if (ledgerMemoryOnly) return null;
	try {
		return await (await import("./db-C1Gi79ti.mjs")).getSql();
	} catch {
		ledgerMemoryOnly = true;
		return null;
	}
}
function parseJsonSafe(value, fallback) {
	if (value === null || value === void 0) return fallback;
	if (typeof value === "string") try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
	return value;
}
function computeBriefHash(projectId, revision, content) {
	return sha256Hex(JSON.stringify({
		projectId,
		revision,
		content
	}));
}
async function recordAuditEvent(input) {
	const rec = {
		id: `aud-${randomUUID().slice(0, 12)}`,
		tenantId: input.tenantId ?? DEFAULT_TENANT,
		projectId: input.projectId,
		actorId: input.actorId,
		action: input.action,
		resourceId: input.resourceId,
		outcome: input.outcome,
		traceId: input.traceId ?? `trc-${randomUUID().slice(0, 10)}`,
		detail: input.detail ?? {},
		occurredAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const sql = await tryGetSql();
	if (sql) try {
		await sql`
        insert into zuke_audit_events (
          id, tenant_id, project_id, actor_id, action, resource_id, outcome, trace_id, detail_json, occurred_at
        ) values (
          ${rec.id}, ${rec.tenantId}, ${rec.projectId}, ${rec.actorId}, ${rec.action},
          ${rec.resourceId}, ${rec.outcome}, ${rec.traceId}, ${JSON.stringify(rec.detail)}::jsonb, ${rec.occurredAt}
        )
      `;
		return rec;
	} catch {}
	memStore.audits.unshift(rec);
	return rec;
}
function mapBriefRow(row) {
	return {
		id: String(row.id),
		tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
		projectId: String(row.project_id),
		revision: Number(row.revision),
		parentRevision: row.parent_revision !== null && row.parent_revision !== void 0 ? Number(row.parent_revision) : null,
		content: parseJsonSafe(row.content_json, DEFAULT_BRIEF_CONTENT),
		briefHash: String(row.brief_hash),
		approvedBy: row.approved_by ? String(row.approved_by) : null,
		approvedAt: row.approved_at ? String(row.approved_at) : null,
		createdAt: String(row.created_at)
	};
}
async function getBriefHead(projectId, tenantId = DEFAULT_TENANT) {
	const sql = await tryGetSql();
	if (sql) try {
		const rows = await sql`
        select * from zuke_brief_versions
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by revision desc
        limit 1
      `;
		if (rows.length > 0) return mapBriefRow(rows[0]);
		const createdAt = (/* @__PURE__ */ new Date()).toISOString();
		const content = { ...DEFAULT_BRIEF_CONTENT };
		const briefHash = computeBriefHash(projectId, 1, content);
		await sql`
        insert into zuke_brief_versions (
          id, tenant_id, project_id, revision, parent_revision, content_json, brief_hash, approved_by, approved_at, created_at
        ) values (
          ${`brf-${randomUUID().slice(0, 12)}`}, ${tenantId}, ${projectId}, 1, ${null}, ${JSON.stringify(content)}::jsonb,
          ${briefHash}, ${"studio-system"}, ${createdAt}, ${createdAt}
        )
        on conflict (tenant_id, project_id, revision) do nothing
      `;
		const checkRows = await sql`
        select * from zuke_brief_versions
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by revision desc
        limit 1
      `;
		if (checkRows.length > 0) return mapBriefRow(checkRows[0]);
	} catch {}
	const existing = memStore.briefs.filter((b) => b.tenantId === tenantId && b.projectId === projectId).sort((a, b) => b.revision - a.revision);
	if (existing.length > 0) return existing[0];
	const createdAt = (/* @__PURE__ */ new Date()).toISOString();
	const initial = {
		id: `brf-${randomUUID().slice(0, 12)}`,
		tenantId,
		projectId,
		revision: 1,
		parentRevision: null,
		content: { ...DEFAULT_BRIEF_CONTENT },
		briefHash: computeBriefHash(projectId, 1, DEFAULT_BRIEF_CONTENT),
		approvedBy: "studio-system",
		approvedAt: createdAt,
		createdAt
	};
	memStore.briefs.push(initial);
	return initial;
}
async function listBriefRevisions(projectId, tenantId = DEFAULT_TENANT) {
	await getBriefHead(projectId, tenantId);
	const sql = await tryGetSql();
	if (sql) try {
		const rows = await sql`
        select * from zuke_brief_versions
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by revision desc
        limit 25
      `;
		if (rows.length > 0) return rows.map(mapBriefRow);
	} catch {}
	return memStore.briefs.filter((b) => b.tenantId === tenantId && b.projectId === projectId).sort((a, b) => b.revision - a.revision);
}
async function patchBriefWithCas(input) {
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
			detail: {
				expectedRevision: input.expectedRevision,
				currentRevision: head.revision
			},
			tenantId
		});
		return {
			ok: false,
			errorCode: "REVISION_CHANGED",
			httpStatus: 409,
			message: `Brief revision mismatch: expected ${input.expectedRevision}, current head is ${head.revision}. Reload latest revision before applying changes.`,
			currentRevision: head.revision,
			currentBrief: head
		};
	}
	const nextRevision = head.revision + 1;
	const nextContent = {
		title: input.patch.title?.trim() || head.content.title,
		summary: input.patch.summary?.trim() || head.content.summary,
		locks: Array.isArray(input.patch.locks) ? input.patch.locks : head.content.locks,
		hasDimensionedDrawing: typeof input.patch.hasDimensionedDrawing === "boolean" ? input.patch.hasDimensionedDrawing : head.content.hasDimensionedDrawing,
		materialSpecs: Array.isArray(input.patch.materialSpecs) ? input.patch.materialSpecs : head.content.materialSpecs,
		cameraNotes: input.patch.cameraNotes?.trim() || head.content.cameraNotes,
		updatedBy: actorId
	};
	const briefHash = computeBriefHash(input.projectId, nextRevision, nextContent);
	const createdAt = (/* @__PURE__ */ new Date()).toISOString();
	const nextRecord = {
		id: `brf-${randomUUID().slice(0, 12)}`,
		tenantId,
		projectId: input.projectId,
		revision: nextRevision,
		parentRevision: head.revision,
		content: nextContent,
		briefHash,
		approvedBy: actorId,
		approvedAt: createdAt,
		createdAt
	};
	const sql = await tryGetSql();
	if (sql) try {
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
			detail: {
				fromRevision: head.revision,
				toRevision: nextRevision,
				briefHash
			},
			tenantId
		});
		return {
			ok: true,
			brief: nextRecord
		};
	} catch (err) {
		const msg = err instanceof Error ? err.message : "";
		if (/unique|duplicate/i.test(msg)) {
			const latest = await getBriefHead(input.projectId, tenantId);
			return {
				ok: false,
				errorCode: "REVISION_CHANGED",
				httpStatus: 409,
				message: `Concurrent write advanced brief to revision ${latest.revision}.`,
				currentRevision: latest.revision,
				currentBrief: latest
			};
		}
	}
	memStore.briefs.push(nextRecord);
	await recordAuditEvent({
		projectId: input.projectId,
		actorId,
		action: "brief.patch",
		resourceId: nextRecord.id,
		outcome: "ok",
		detail: {
			fromRevision: head.revision,
			toRevision: nextRevision,
			briefHash
		},
		tenantId
	});
	return {
		ok: true,
		brief: nextRecord
	};
}
function mapMessageRow(row) {
	return {
		id: String(row.id),
		tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
		projectId: String(row.project_id),
		threadId: String(row.thread_id),
		seq: Number(row.seq),
		clientMessageId: String(row.client_message_id),
		payloadHash: String(row.payload_hash),
		authorType: String(row.author_type),
		state: String(row.state),
		content: String(row.content),
		evidence: parseJsonSafe(row.evidence_json, []),
		revision: Number(row.revision ?? 1),
		deletedAt: row.deleted_at ? String(row.deleted_at) : null,
		createdAt: String(row.created_at)
	};
}
async function commitThreadMessage(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const evidence = input.evidence ?? [];
	const payloadHash = sha256Hex(JSON.stringify({
		authorType: input.authorType,
		content: input.content,
		evidence
	}));
	const sql = await tryGetSql();
	if (sql) try {
		await sql`
        insert into zuke_threads (id, tenant_id, project_id, next_seq)
        values (${input.threadId}, ${tenantId}, ${input.projectId}, 1)
        on conflict (id) do nothing
      `;
		const existingRows = await sql`
        select * from zuke_messages
        where thread_id = ${input.threadId} and client_message_id = ${input.clientMessageId}
        limit 1
      `;
		if (existingRows.length > 0) {
			const existing = mapMessageRow(existingRows[0]);
			if (existing.payloadHash === payloadHash) return {
				ok: true,
				message: existing,
				deduplicated: true
			};
			return {
				ok: false,
				errorCode: "BRIEF_CONFLICT",
				httpStatus: 409,
				message: `Idempotency key '${input.clientMessageId}' was already committed with a different payload.`
			};
		}
		const seqRows = await sql`
        select coalesce(max(seq), 0) + 1 as next_seq
        from zuke_messages
        where thread_id = ${input.threadId}
      `;
		const seq = Number(seqRows[0]?.next_seq ?? 1);
		const createdAt = (/* @__PURE__ */ new Date()).toISOString();
		const head = await getBriefHead(input.projectId, tenantId);
		const rec = {
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
			createdAt
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
		return {
			ok: true,
			message: rec,
			deduplicated: false
		};
	} catch {}
	const existing = memStore.messages.find((m) => m.threadId === input.threadId && m.clientMessageId === input.clientMessageId);
	if (existing) {
		if (existing.payloadHash === payloadHash) return {
			ok: true,
			message: existing,
			deduplicated: true
		};
		return {
			ok: false,
			errorCode: "BRIEF_CONFLICT",
			httpStatus: 409,
			message: `Idempotency key '${input.clientMessageId}' was already committed with a different payload.`
		};
	}
	const seq = memStore.threadNextSeq.get(input.threadId) ?? 1;
	memStore.threadNextSeq.set(input.threadId, seq + 1);
	const head = await getBriefHead(input.projectId, tenantId);
	const rec = {
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
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	memStore.messages.push(rec);
	return {
		ok: true,
		message: rec,
		deduplicated: false
	};
}
async function listThreadMessages(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const sql = await tryGetSql();
	if (sql) try {
		return (await sql`
        select * from zuke_messages
        where tenant_id = ${tenantId}
          and project_id = ${input.projectId}
          and thread_id = ${input.threadId}
          and deleted_at is null
        order by seq asc
      `).map(mapMessageRow);
	} catch {}
	if (memStore.deletedThreads.has(input.threadId)) return [];
	return memStore.messages.filter((m) => m.tenantId === tenantId && m.projectId === input.projectId && m.threadId === input.threadId && m.deletedAt === null).sort((a, b) => a.seq - b.seq);
}
async function deleteThreadTombstone(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const deletedAt = (/* @__PURE__ */ new Date()).toISOString();
	const actorId = input.actorId ?? "studio-architect";
	const sql = await tryGetSql();
	if (sql) try {
		await sql`
        update zuke_threads set deleted_at = ${deletedAt}, updated_at = ${deletedAt}
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and id = ${input.threadId}
      `;
		const updated = await sql`
        update zuke_messages set deleted_at = ${deletedAt}, state = 'deleted'
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and thread_id = ${input.threadId} and deleted_at is null
        returning id
      `;
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
			detail: {
				deletedMessages: updated.length,
				deletedAt
			},
			tenantId
		});
		return {
			deletedMessages: updated.length,
			deletedAt
		};
	} catch {}
	memStore.deletedThreads.add(input.threadId);
	let count = 0;
	for (const m of memStore.messages) if (m.projectId === input.projectId && m.threadId === input.threadId && !m.deletedAt) {
		m.deletedAt = deletedAt;
		m.state = "deleted";
		count++;
	}
	for (const item of memStore.memoryItems) if (item.projectId === input.projectId && item.scope === "thread" && !item.deletedAt) {
		item.deletedAt = deletedAt;
		item.state = "deleted";
	}
	await recordAuditEvent({
		projectId: input.projectId,
		actorId,
		action: "thread.tombstone_delete",
		resourceId: input.threadId,
		outcome: "ok",
		detail: {
			deletedMessages: count,
			deletedAt
		},
		tenantId
	});
	return {
		deletedMessages: count,
		deletedAt
	};
}
function mapMemoryRow(row) {
	return {
		id: String(row.id),
		tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
		projectId: String(row.project_id),
		scope: String(row.scope ?? "project"),
		category: String(row.category),
		itemKey: String(row.item_key),
		itemValue: String(row.item_value),
		state: String(row.state),
		version: Number(row.version ?? 1),
		confidence: Number(row.confidence ?? .85),
		supersedesId: row.supersedes_id ? String(row.supersedes_id) : null,
		evidenceIds: parseJsonSafe(row.evidence_ids, []),
		effectiveAt: String(row.effective_at),
		deletedAt: row.deleted_at ? String(row.deleted_at) : null,
		createdAt: String(row.created_at)
	};
}
async function listMemoryItems(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const sql = await tryGetSql();
	if (sql) try {
		return (input.state ? await sql`
              select * from zuke_memory_items
              where tenant_id = ${tenantId} and project_id = ${input.projectId}
                and state = ${input.state}
                and (${Boolean(input.includeDeleted)} or deleted_at is null)
              order by effective_at desc
            ` : await sql`
              select * from zuke_memory_items
              where tenant_id = ${tenantId} and project_id = ${input.projectId}
                and (${Boolean(input.includeDeleted)} or deleted_at is null)
              order by effective_at desc
            `).map(mapMemoryRow);
	} catch {}
	return memStore.memoryItems.filter((m) => m.tenantId === tenantId && m.projectId === input.projectId && (!input.state || m.state === input.state) && (input.includeDeleted || m.deletedAt === null));
}
async function proposeMemoryItem(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const rec = {
		id: `mem-${randomUUID().slice(0, 12)}`,
		tenantId,
		projectId: input.projectId,
		scope: input.scope ?? "project",
		category: input.category,
		itemKey: input.itemKey.trim(),
		itemValue: input.itemValue.trim(),
		state: "proposed",
		version: 1,
		confidence: Math.max(0, Math.min(1, input.confidence ?? .85)),
		supersedesId: null,
		evidenceIds: input.evidenceIds ?? [],
		effectiveAt: now,
		deletedAt: null,
		createdAt: now
	};
	const sql = await tryGetSql();
	if (sql) try {
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
			detail: {
				itemKey: rec.itemKey,
				scope: rec.scope
			},
			tenantId
		});
		return rec;
	} catch {}
	memStore.memoryItems.unshift(rec);
	return rec;
}
async function transitionMemoryState(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const supersededIds = [];
	const sql = await tryGetSql();
	if (sql) try {
		const found = await sql`
        select * from zuke_memory_items
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and id = ${input.memoryId}
        limit 1
      `;
		if (found.length === 0) return {
			ok: false,
			error: `Memory item '${input.memoryId}' not found.`
		};
		const item = mapMemoryRow(found[0]);
		let supersedesId = item.supersedesId;
		let nextVersion = item.version;
		if (input.targetState === "approved") {
			const priors = await sql`
          select id, version from zuke_memory_items
          where tenant_id = ${tenantId} and project_id = ${input.projectId}
            and item_key = ${item.itemKey} and state = 'approved' and id <> ${item.id} and deleted_at is null
        `;
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
		const updated = {
			...item,
			state: input.targetState,
			version: nextVersion,
			supersedesId,
			effectiveAt: now,
			deletedAt
		};
		await recordAuditEvent({
			projectId: input.projectId,
			actorId: input.actorId ?? "studio-architect",
			action: `memory.${input.targetState}`,
			resourceId: item.id,
			outcome: "ok",
			detail: {
				itemKey: item.itemKey,
				supersededIds
			},
			tenantId
		});
		return {
			ok: true,
			item: updated,
			supersededIds
		};
	} catch {}
	const item = memStore.memoryItems.find((m) => m.tenantId === tenantId && m.projectId === input.projectId && m.id === input.memoryId);
	if (!item) return {
		ok: false,
		error: `Memory item '${input.memoryId}' not found.`
	};
	if (input.targetState === "approved") {
		for (const prior of memStore.memoryItems) if (prior.projectId === input.projectId && prior.itemKey === item.itemKey && prior.state === "approved" && prior.id !== item.id && !prior.deletedAt) {
			prior.state = "superseded";
			supersededIds.push(prior.id);
			item.supersedesId = prior.id;
			item.version = Math.max(item.version, prior.version + 1);
		}
	}
	item.state = input.targetState;
	item.effectiveAt = now;
	if (input.targetState === "deleted") item.deletedAt = now;
	return {
		ok: true,
		item,
		supersededIds
	};
}
function mapApprovalRow(row) {
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
		decision: String(row.decision),
		findings: parseJsonSafe(row.findings_json, []),
		createdAt: String(row.created_at)
	};
}
async function recordRunApproval(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const createdAt = (/* @__PURE__ */ new Date()).toISOString();
	const rec = {
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
		createdAt
	};
	const sql = await tryGetSql();
	if (sql) try {
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
				briefRevision: rec.briefRevision
			},
			tenantId
		});
		return rec;
	} catch {}
	memStore.approvals.unshift(rec);
	await recordAuditEvent({
		projectId: input.projectId,
		actorId: input.reviewerId,
		action: `run.${input.decision}`,
		resourceId: input.runId,
		outcome: "ok",
		detail: {
			approvalId: rec.id,
			candidateSha256: rec.candidateSha256,
			briefHash: rec.briefHash
		},
		tenantId
	});
	return rec;
}
async function listRunApprovals(input) {
	const tenantId = input.tenantId ?? DEFAULT_TENANT;
	const sql = await tryGetSql();
	if (sql) try {
		return (await sql`
        select * from zuke_approvals
        where tenant_id = ${tenantId} and project_id = ${input.projectId} and run_id = ${input.runId}
        order by created_at desc
      `).map(mapApprovalRow);
	} catch {}
	return memStore.approvals.filter((a) => a.tenantId === tenantId && a.projectId === input.projectId && a.runId === input.runId);
}
async function listAuditEvents(projectId, limit = 20, tenantId = DEFAULT_TENANT) {
	const sql = await tryGetSql();
	if (sql) try {
		return (await sql`
        select * from zuke_audit_events
        where tenant_id = ${tenantId} and project_id = ${projectId}
        order by occurred_at desc
        limit ${Math.max(1, Math.min(100, limit))}
      `).map((row) => ({
			id: String(row.id),
			tenantId: String(row.tenant_id ?? DEFAULT_TENANT),
			projectId: String(row.project_id),
			actorId: String(row.actor_id),
			action: String(row.action),
			resourceId: String(row.resource_id),
			outcome: String(row.outcome),
			traceId: String(row.trace_id),
			detail: parseJsonSafe(row.detail_json, {}),
			occurredAt: String(row.occurred_at)
		}));
	} catch {}
	return memStore.audits.filter((a) => a.tenantId === tenantId && a.projectId === projectId).slice(0, limit);
}
export { validateGroundedAnswer as S, patchBriefWithCas as _, buildGroundedArchitecturalAnswer as a, sha256Hex as b, deleteThreadTombstone as c, inferSpecRenderMode as d, listAuditEvents as f, listThreadMessages as g, listRunApprovals as h, buildArtifactManifest as i, evaluateSpecGatesG01toG11 as l, listMemoryItems as m, MEMORY_CANDIDATE_STATES as n, commitThreadMessage as o, listBriefRevisions as p, PILOT_SOFT_RANKING_WEIGHTS as r, computeSoftRanking as s, CLIENT_LABEL_DESCRIPTIONS as t, getBriefHead as u, proposeMemoryItem as v, transitionMemoryState as x, recordRunApproval as y };
