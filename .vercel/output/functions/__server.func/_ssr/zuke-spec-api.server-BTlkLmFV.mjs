import { a as discriminatedUnion, c as object, d as unknown, i as boolean, l as string, n as _enum, o as literal, r as array, s as number } from "../_libs/zod.mjs";
import { S as validateGroundedAnswer, _ as patchBriefWithCas, a as buildGroundedArchitecturalAnswer, c as deleteThreadTombstone, f as listAuditEvents, g as listThreadMessages, h as listRunApprovals, m as listMemoryItems, n as MEMORY_CANDIDATE_STATES, o as commitThreadMessage, p as listBriefRevisions, r as PILOT_SOFT_RANKING_WEIGHTS, t as CLIENT_LABEL_DESCRIPTIONS, u as getBriefHead, v as proposeMemoryItem, x as transitionMemoryState, y as recordRunApproval } from "./zuke-ledger.server-DDbcfGNa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/zuke-spec-api.server-BTlkLmFV.js
var TOOL_SPECS = {
	read_project_evidence: {
		authority: "Scoped read of approved revisions",
		allowedRoles: [
			"viewer",
			"architect",
			"reviewer",
			"admin"
		],
		requiresExplicitApproval: false,
		schema: object({
			projectId: string().min(1).max(120),
			revision: number().int().min(1).optional()
		}).strict()
	},
	measure_scene: {
		authority: "Read-only measurements from an authorized version with verified units",
		allowedRoles: [
			"viewer",
			"architect",
			"reviewer",
			"admin"
		],
		requiresExplicitApproval: false,
		schema: object({
			projectId: string().min(1).max(120),
			sceneAssetId: string().min(1).max(120),
			elementIds: array(string().min(1)).min(1).max(20),
			verifiedUnits: _enum([
				"mm",
				"cm",
				"m",
				"ft"
			])
		}).strict()
	},
	prepare_mask: {
		authority: "Creates a draft mask over an authorized image",
		allowedRoles: [
			"architect",
			"reviewer",
			"admin"
		],
		requiresExplicitApproval: false,
		schema: object({
			projectId: string().min(1).max(120),
			baseAssetId: string().min(1).max(120),
			editableLabel: string().min(1).max(120),
			protectedLabels: array(string().min(1)).default([])
		}).strict()
	},
	submit_render: {
		authority: "Server-only dispatch after plan authorization and cost reservation",
		allowedRoles: [
			"architect",
			"reviewer",
			"admin"
		],
		requiresExplicitApproval: false,
		schema: object({
			projectId: string().min(1).max(120),
			briefRevision: number().int().min(1),
			mode: _enum([
				"concept",
				"guided_2d",
				"masked_edit",
				"scene_locked",
				"multiview",
				"video",
				"panorama"
			]),
			estimatedCostUsd: number().min(0).max(50)
		}).strict()
	},
	approve_candidate: {
		authority: "Authenticated reviewer API only",
		allowedRoles: ["reviewer", "admin"],
		requiresExplicitApproval: true,
		schema: object({
			projectId: string().min(1).max(120),
			runId: string().min(1).max(120),
			candidateSha256: string().regex(/^[0-9a-f]{64}$/),
			briefHash: string().regex(/^[0-9a-f]{64}$/),
			decision: _enum(["client_approved", "rejected"])
		}).strict()
	}
};
function listRegisteredTools() {
	return Object.keys(TOOL_SPECS).map((name) => ({
		name,
		authority: TOOL_SPECS[name].authority,
		allowedRoles: TOOL_SPECS[name].allowedRoles,
		requiresExplicitApproval: TOOL_SPECS[name].requiresExplicitApproval
	}));
}
async function executeControlledTool(input) {
	const t0 = Date.now();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	if (!(input.toolName in TOOL_SPECS)) return {
		ok: false,
		error: `Tool '${input.toolName}' is not in the allowlisted registry.`,
		audit: {
			toolName: "read_project_evidence",
			actorId: input.actorId,
			actorRole: input.actorRole,
			projectId: input.projectId,
			approved: false,
			status: "denied",
			durationMs: Date.now() - t0,
			reason: `Unregistered tool: ${input.toolName}`,
			timestamp
		}
	};
	const name = input.toolName;
	const spec = TOOL_SPECS[name];
	if (!spec.allowedRoles.includes(input.actorRole)) return {
		ok: false,
		error: `Role '${input.actorRole}' is not authorized to invoke '${name}'.`,
		audit: {
			toolName: name,
			actorId: input.actorId,
			actorRole: input.actorRole,
			projectId: input.projectId,
			approved: false,
			status: "denied",
			durationMs: Date.now() - t0,
			reason: `Role '${input.actorRole}' denied`,
			timestamp
		}
	};
	const parsed = spec.schema.safeParse(input.args);
	if (!parsed.success) {
		const reason = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
		return {
			ok: false,
			error: `Invalid arguments for '${name}': ${reason}`,
			audit: {
				toolName: name,
				actorId: input.actorId,
				actorRole: input.actorRole,
				projectId: input.projectId,
				approved: false,
				status: "invalid_arguments",
				durationMs: Date.now() - t0,
				reason,
				timestamp
			}
		};
	}
	const timeoutMs = input.timeoutMs ?? 8e3;
	try {
		return {
			ok: true,
			result: await Promise.race([Promise.resolve(input.handler(parsed.data)), new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error(`Tool '${name}' exceeded ${timeoutMs}ms timeout`)), timeoutMs))]),
			audit: {
				toolName: name,
				actorId: input.actorId,
				actorRole: input.actorRole,
				projectId: input.projectId,
				approved: true,
				status: "executed",
				durationMs: Date.now() - t0,
				timestamp
			}
		};
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Tool execution failed";
		return {
			ok: false,
			error: msg,
			audit: {
				toolName: name,
				actorId: input.actorId,
				actorRole: input.actorRole,
				projectId: input.projectId,
				approved: false,
				status: msg.includes("timeout") ? "timeout" : "denied",
				durationMs: Date.now() - t0,
				reason: msg,
				timestamp
			}
		};
	}
}
function jsonResponse(body, status = 200, extraHeaders) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
			...extraHeaders ?? {}
		}
	});
}
async function parseJsonBody(request) {
	try {
		const parsed = await request.json();
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
async function handleGetProjectBrief(projectId) {
	const head = await getBriefHead(projectId);
	return jsonResponse({
		projectId,
		head,
		revisions: await listBriefRevisions(projectId),
		audits: await listAuditEvents(projectId, 12),
		tools: listRegisteredTools(),
		softRankingWeights: PILOT_SOFT_RANKING_WEIGHTS,
		maxAttemptsTotal: 3,
		clientLabelDescriptions: CLIENT_LABEL_DESCRIPTIONS
	}, 200, { ETag: `"${head.revision}"` });
}
var BriefPatchSchema = object({
	expectedRevision: number().int().min(1).optional(),
	title: string().min(1).max(160).optional(),
	summary: string().min(1).max(2e3).optional(),
	locks: array(string().min(1).max(64)).max(24).optional(),
	hasDimensionedDrawing: boolean().optional(),
	materialSpecs: array(string().min(1).max(120)).max(24).optional(),
	cameraNotes: string().max(400).optional(),
	actorId: string().min(1).max(120).optional()
});
async function handlePatchProjectBrief(projectId, request) {
	const raw = await parseJsonBody(request);
	const parsed = BriefPatchSchema.safeParse(raw);
	if (!parsed.success) return jsonResponse({
		errorCode: "MISSING_REQUIRED_EVIDENCE",
		error: "Invalid brief patch payload.",
		details: parsed.error.issues
	}, 400);
	const ifMatchRaw = request.headers.get("if-match")?.replace(/^W\//i, "").replace(/"/g, "").trim();
	const headerRev = ifMatchRaw && /^\d+$/.test(ifMatchRaw) ? Number(ifMatchRaw) : void 0;
	const expectedRevision = parsed.data.expectedRevision ?? headerRev;
	if (!expectedRevision || !Number.isInteger(expectedRevision) || expectedRevision < 1) return jsonResponse({
		errorCode: "REVISION_CHANGED",
		error: "Compare-and-swap requires expectedRevision or numeric If-Match header."
	}, 409);
	const res = await patchBriefWithCas({
		projectId,
		expectedRevision,
		patch: {
			title: parsed.data.title,
			summary: parsed.data.summary,
			locks: parsed.data.locks,
			hasDimensionedDrawing: parsed.data.hasDimensionedDrawing,
			materialSpecs: parsed.data.materialSpecs,
			cameraNotes: parsed.data.cameraNotes
		},
		actorId: parsed.data.actorId
	});
	if (!res.ok) return jsonResponse({
		errorCode: res.errorCode,
		error: res.message,
		currentRevision: res.currentRevision,
		head: res.currentBrief
	}, 409, { ETag: `"${res.currentRevision}"` });
	return jsonResponse({
		ok: true,
		head: res.brief
	}, 200, { ETag: `"${res.brief.revision}"` });
}
async function handleGetThreadMessages(projectId, threadId) {
	const messages = await listThreadMessages({
		projectId,
		threadId
	});
	return jsonResponse({
		projectId,
		threadId,
		count: messages.length,
		messages
	});
}
var ThreadMessagePostSchema = object({
	clientMessageId: string().min(1).max(128).optional(),
	authorType: _enum([
		"user",
		"assistant",
		"system"
	]).default("user"),
	content: string().min(1).max(8e3),
	evidence: array(unknown()).default([])
});
async function handlePostThreadMessage(projectId, threadId, request) {
	const raw = await parseJsonBody(request);
	const parsed = ThreadMessagePostSchema.safeParse(raw);
	if (!parsed.success) return jsonResponse({
		error: "Invalid thread message payload.",
		details: parsed.error.issues
	}, 400);
	const clientMessageId = parsed.data.clientMessageId || request.headers.get("x-idempotency-key")?.trim() || request.headers.get("idempotency-key")?.trim();
	if (!clientMessageId) return jsonResponse({
		errorCode: "MISSING_REQUIRED_EVIDENCE",
		error: "clientMessageId or Idempotency-Key header is required."
	}, 400);
	const result = await commitThreadMessage({
		projectId,
		threadId,
		clientMessageId,
		authorType: parsed.data.authorType,
		content: parsed.data.content,
		evidence: parsed.data.evidence
	});
	if (!result.ok) return jsonResponse({
		errorCode: result.errorCode,
		error: result.message
	}, result.httpStatus);
	return jsonResponse({
		ok: true,
		deduplicated: result.deduplicated,
		message: result.message
	}, result.deduplicated ? 200 : 201);
}
async function handleDeleteThread(projectId, threadId, request) {
	const actorId = request.headers.get("x-actor-id") || "studio-architect";
	return jsonResponse({
		ok: true,
		projectId,
		threadId,
		...await deleteThreadTombstone({
			projectId,
			threadId,
			actorId
		})
	});
}
async function handleGetProjectMemory(projectId, request) {
	const url = new URL(request.url);
	const stateParam = url.searchParams.get("state");
	const validState = stateParam && MEMORY_CANDIDATE_STATES.includes(stateParam) ? stateParam : void 0;
	const includeDeleted = url.searchParams.get("includeDeleted") === "true";
	const items = await listMemoryItems({
		projectId,
		state: validState,
		includeDeleted
	});
	return jsonResponse({
		projectId,
		count: items.length,
		items
	});
}
var MemoryActionSchema = discriminatedUnion("action", [object({
	action: literal("propose"),
	scope: _enum([
		"project",
		"thread",
		"studio"
	]).default("project"),
	category: string().min(1).max(64).default("architectural_preference"),
	itemKey: string().min(1).max(120),
	itemValue: string().min(1).max(1e3),
	confidence: number().min(0).max(1).optional(),
	evidenceIds: array(string()).optional(),
	actorId: string().optional()
}), object({
	action: _enum([
		"approve",
		"reject",
		"delete"
	]),
	memoryId: string().min(1).max(120),
	actorId: string().optional()
})]);
async function handlePostProjectMemory(projectId, request) {
	const normalized = {
		action: "propose",
		...await parseJsonBody(request)
	};
	const parsed = MemoryActionSchema.safeParse(normalized);
	if (!parsed.success) return jsonResponse({
		error: "Invalid memory payload.",
		details: parsed.error.issues
	}, 400);
	if (parsed.data.action === "propose") return jsonResponse({
		ok: true,
		item: await proposeMemoryItem({
			projectId,
			scope: parsed.data.scope,
			category: parsed.data.category,
			itemKey: parsed.data.itemKey,
			itemValue: parsed.data.itemValue,
			confidence: parsed.data.confidence,
			evidenceIds: parsed.data.evidenceIds,
			actorId: parsed.data.actorId
		})
	}, 201);
	const transition = await transitionMemoryState({
		projectId,
		memoryId: parsed.data.memoryId,
		targetState: {
			approve: "approved",
			reject: "rejected",
			delete: "deleted"
		}[parsed.data.action],
		actorId: parsed.data.actorId
	});
	if (!transition.ok) return jsonResponse({ error: transition.error }, 404);
	return jsonResponse({
		ok: true,
		item: transition.item,
		supersededIds: transition.supersededIds
	});
}
async function handleGetRunApprovals(projectId, runId) {
	const approvals = await listRunApprovals({
		projectId,
		runId
	});
	return jsonResponse({
		projectId,
		runId,
		count: approvals.length,
		approvals
	});
}
var ApprovalPostSchema = object({
	candidateSha256: string().regex(/^[0-9a-f]{64}$/, "candidateSha256 must be a 64-character hex SHA-256 hash."),
	briefHash: string().regex(/^[0-9a-f]{64}$/, "briefHash must be a 64-character hex SHA-256 hash."),
	briefRevision: number().int().min(1).optional(),
	reviewerId: string().min(1).max(120).default("principal-architect"),
	reviewerRole: _enum([
		"viewer",
		"architect",
		"reviewer",
		"admin"
	]).default("reviewer"),
	decision: _enum(["client_approved", "rejected"]).default("client_approved"),
	findings: array(string().min(1).max(400)).max(20).default([])
});
async function handlePostRunApproval(projectId, runId, request) {
	const raw = await parseJsonBody(request);
	const parsed = ApprovalPostSchema.safeParse(raw);
	if (!parsed.success) return jsonResponse({
		errorCode: "MISSING_REQUIRED_EVIDENCE",
		error: "Invalid approval payload.",
		details: parsed.error.issues
	}, 400);
	const head = await getBriefHead(projectId);
	const toolExec = await executeControlledTool({
		toolName: "approve_candidate",
		actorId: parsed.data.reviewerId,
		actorRole: parsed.data.reviewerRole,
		projectId,
		args: {
			projectId,
			runId,
			candidateSha256: parsed.data.candidateSha256,
			briefHash: parsed.data.briefHash,
			decision: parsed.data.decision
		},
		handler: async () => recordRunApproval({
			projectId,
			runId,
			candidateSha256: parsed.data.candidateSha256,
			briefHash: parsed.data.briefHash,
			briefRevision: parsed.data.briefRevision ?? head.revision,
			reviewerId: parsed.data.reviewerId,
			reviewerRole: parsed.data.reviewerRole === "admin" ? "admin" : "reviewer",
			decision: parsed.data.decision,
			findings: parsed.data.findings
		})
	});
	if (!toolExec.ok || !toolExec.result) {
		const status = toolExec.audit.status === "denied" ? 403 : 422;
		return jsonResponse({
			errorCode: status === 403 ? "ASSET_FORBIDDEN" : "MANDATORY_CHECK_FAILED",
			error: toolExec.error ?? "Approval denied.",
			audit: toolExec.audit
		}, status);
	}
	return jsonResponse({
		ok: true,
		clientLabel: parsed.data.decision === "client_approved" ? "client_approved" : "draft",
		approval: toolExec.result,
		audit: toolExec.audit
	}, 201);
}
var GroundedQaPostSchema = object({
	question: string().min(1).max(4e3),
	hasDimensionedDrawing: boolean().optional(),
	activeJobState: string().max(64).optional(),
	conflictingSources: array(object({
		label: string().min(1),
		value: string().min(1)
	})).max(10).optional()
});
async function handleGroundedQa(projectId, request) {
	const raw = await parseJsonBody(request);
	const parsed = GroundedQaPostSchema.safeParse(raw);
	if (!parsed.success) return jsonResponse({
		error: "Invalid grounded Q&A request.",
		details: parsed.error.issues
	}, 400);
	const head = await getBriefHead(projectId);
	const answer = buildGroundedArchitecturalAnswer({
		question: parsed.data.question,
		briefRevision: head.revision,
		briefSummary: head.content.summary,
		locks: head.content.locks,
		hasDimensionedDrawing: parsed.data.hasDimensionedDrawing ?? head.content.hasDimensionedDrawing,
		activeJobState: parsed.data.activeJobState,
		conflictingSources: parsed.data.conflictingSources
	});
	const verification = validateGroundedAnswer(answer);
	return jsonResponse({
		projectId,
		briefRevision: head.revision,
		briefHash: head.briefHash,
		g10Passed: verification.valid,
		answer
	});
}
//#endregion
export { handleDeleteThread, handleGetProjectBrief, handleGetProjectMemory, handleGetRunApprovals, handleGetThreadMessages, handleGroundedQa, handlePatchProjectBrief, handlePostProjectMemory, handlePostRunApproval, handlePostThreadMessage };
