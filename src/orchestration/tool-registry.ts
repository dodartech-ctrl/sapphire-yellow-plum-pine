import { z } from "zod";

/**
 * ZUKE VIZ AI — Controlled Tool Registry (architecture.tools & tool_calling)
 * Enforces allowlisted tool names, Zod argument validation, role authorization,
 * execution timeout, and structured audit records.
 */

export type ToolRole = "viewer" | "architect" | "reviewer" | "admin";

export type RegisteredToolName =
  | "read_project_evidence"
  | "measure_scene"
  | "prepare_mask"
  | "submit_render"
  | "approve_candidate";

export interface ToolAuditEntry {
  toolName: RegisteredToolName;
  actorId: string;
  actorRole: ToolRole;
  projectId: string;
  approved: boolean;
  status: "executed" | "denied" | "invalid_arguments" | "timeout";
  durationMs: number;
  reason?: string;
  timestamp: string;
}

const TOOL_SPECS: Record<
  RegisteredToolName,
  {
    authority: string;
    allowedRoles: readonly ToolRole[];
    requiresExplicitApproval: boolean;
    schema: z.ZodTypeAny;
  }
> = {
  read_project_evidence: {
    authority: "Scoped read of approved revisions",
    allowedRoles: ["viewer", "architect", "reviewer", "admin"],
    requiresExplicitApproval: false,
    schema: z
      .object({
        projectId: z.string().min(1).max(120),
        revision: z.number().int().min(1).optional(),
      })
      .strict(),
  },
  measure_scene: {
    authority: "Read-only measurements from an authorized version with verified units",
    allowedRoles: ["viewer", "architect", "reviewer", "admin"],
    requiresExplicitApproval: false,
    schema: z
      .object({
        projectId: z.string().min(1).max(120),
        sceneAssetId: z.string().min(1).max(120),
        elementIds: z.array(z.string().min(1)).min(1).max(20),
        verifiedUnits: z.enum(["mm", "cm", "m", "ft"]),
      })
      .strict(),
  },
  prepare_mask: {
    authority: "Creates a draft mask over an authorized image",
    allowedRoles: ["architect", "reviewer", "admin"],
    requiresExplicitApproval: false,
    schema: z
      .object({
        projectId: z.string().min(1).max(120),
        baseAssetId: z.string().min(1).max(120),
        editableLabel: z.string().min(1).max(120),
        protectedLabels: z.array(z.string().min(1)).default([]),
      })
      .strict(),
  },
  submit_render: {
    authority: "Server-only dispatch after plan authorization and cost reservation",
    allowedRoles: ["architect", "reviewer", "admin"],
    requiresExplicitApproval: false,
    schema: z
      .object({
        projectId: z.string().min(1).max(120),
        briefRevision: z.number().int().min(1),
        mode: z.enum(["concept", "guided_2d", "masked_edit", "scene_locked", "multiview", "video", "panorama"]),
        estimatedCostUsd: z.number().min(0).max(50),
      })
      .strict(),
  },
  approve_candidate: {
    authority: "Authenticated reviewer API only",
    allowedRoles: ["reviewer", "admin"],
    requiresExplicitApproval: true,
    schema: z
      .object({
        projectId: z.string().min(1).max(120),
        runId: z.string().min(1).max(120),
        candidateSha256: z.string().regex(/^[0-9a-f]{64}$/),
        briefHash: z.string().regex(/^[0-9a-f]{64}$/),
        decision: z.enum(["client_approved", "rejected"]),
      })
      .strict(),
  },
};

export function listRegisteredTools() {
  return (Object.keys(TOOL_SPECS) as RegisteredToolName[]).map((name) => ({
    name,
    authority: TOOL_SPECS[name].authority,
    allowedRoles: TOOL_SPECS[name].allowedRoles,
    requiresExplicitApproval: TOOL_SPECS[name].requiresExplicitApproval,
  }));
}

export async function executeControlledTool<TResult = Record<string, unknown>>(input: {
  toolName: string;
  actorId: string;
  actorRole: ToolRole;
  projectId: string;
  args: unknown;
  timeoutMs?: number;
  handler: (validatedArgs: Record<string, unknown>) => Promise<TResult> | TResult;
}): Promise<{ ok: boolean; result?: TResult; error?: string; audit: ToolAuditEntry }> {
  const t0 = Date.now();
  const timestamp = new Date().toISOString();

  if (!(input.toolName in TOOL_SPECS)) {
    return {
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
        timestamp,
      },
    };
  }

  const name = input.toolName as RegisteredToolName;
  const spec = TOOL_SPECS[name];

  if (!spec.allowedRoles.includes(input.actorRole)) {
    return {
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
        timestamp,
      },
    };
  }

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
        timestamp,
      },
    };
  }

  const timeoutMs = input.timeoutMs ?? 8000;
  try {
    const result = await Promise.race<TResult>([
      Promise.resolve(input.handler(parsed.data as Record<string, unknown>)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Tool '${name}' exceeded ${timeoutMs}ms timeout`)), timeoutMs),
      ),
    ]);
    return {
      ok: true,
      result,
      audit: {
        toolName: name,
        actorId: input.actorId,
        actorRole: input.actorRole,
        projectId: input.projectId,
        approved: true,
        status: "executed",
        durationMs: Date.now() - t0,
        timestamp,
      },
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
        timestamp,
      },
    };
  }
}
