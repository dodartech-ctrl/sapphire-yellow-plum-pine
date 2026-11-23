/**
 * Immutable version sets, approvals and the export manifest.
 * A set's id IS the SHA-256 of its content, so an approval that names a set id
 * can be re-verified later and a newer draft can never silently replace it.
 */

export async function sha256Hex(input: string | Uint8Array | Uint8ClampedArray): Promise<string> {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type SetView = {
  viewId: string;
  viewName: string;
  /** Hash of the original upload this result was derived from. */
  originalHash: string;
  /** Hash of the result raster. */
  resultHash: string;
};

export type FinishRecord = {
  id: string;
  label: string;
  supplier: string;
  /** Only what the designer typed. Blank stays blank. */
  sku: string;
  grain: string;
  role: "material" | "lighting" | "furniture";
  swatchHash: string;
};

export type VersionSet = {
  /** Content hash: also the immutable version id. */
  id: string;
  parentId: string | null;
  branch: string;
  label: string;
  briefHash: string;
  finish: FinishRecord;
  views: SetView[];
  createdAt: number;
};

export type Approval = {
  setId: string;
  decision: "approved" | "changes_requested";
  approver: string;
  note: string;
  at: number;
  /** Copy of the set id at the time of signing; verified against the set. */
  setHash: string;
  source: "designer" | "client-link";
};

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export async function createVersionSet(input: {
  parentId: string | null;
  branch: string;
  label: string;
  briefHash: string;
  finish: FinishRecord;
  views: SetView[];
  createdAt?: number;
}): Promise<VersionSet> {
  const createdAt = input.createdAt ?? Date.now();
  const body = {
    parentId: input.parentId,
    branch: input.branch,
    label: input.label,
    briefHash: input.briefHash,
    finish: input.finish,
    views: [...input.views].sort((a, b) => (a.viewId < b.viewId ? -1 : 1)),
  };
  const id = await sha256Hex(canonical(body));
  return Object.freeze({ id, ...body, createdAt }) as VersionSet;
}

/** The set id is recomputable from content: tampering with a stored set is detectable. */
export async function verifySet(set: VersionSet): Promise<boolean> {
  const { id, createdAt: _createdAt, ...body } = set;
  void _createdAt;
  return (await sha256Hex(canonical(body))) === id;
}

export function approveSet(set: VersionSet, input: { decision: Approval["decision"]; approver: string; note?: string; source: Approval["source"]; at?: number }): Approval {
  const approver = input.approver.trim();
  if (!approver) throw new Error("An approver name is required.");
  return Object.freeze({
    setId: set.id,
    decision: input.decision,
    approver,
    note: (input.note ?? "").trim().slice(0, 600),
    at: input.at ?? Date.now(),
    setHash: set.id,
    source: input.source,
  });
}

/** An approval is valid for exactly one immutable set. A different set never inherits it. */
export function approvalValidFor(set: VersionSet, approval: Approval): boolean {
  return approval.decision === "approved" && approval.setId === set.id && approval.setHash === set.id;
}

export function branchFrom(parent: VersionSet, branchName: string): { parentId: string; branch: string } {
  return { parentId: parent.id, branch: branchName.trim() || `branch-${parent.branch}` };
}

/** Walk parent links to list a set's lineage, newest first. */
export function lineage(sets: readonly VersionSet[], id: string): VersionSet[] {
  const byId = new Map(sets.map((s) => [s.id, s]));
  const out: VersionSet[] = [];
  let cur = byId.get(id);
  const seen = new Set<string>();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    out.push(cur);
    cur = cur.parentId ? byId.get(cur.parentId) : undefined;
  }
  return out;
}

export type ExportManifest = {
  format: "oriel-revision-record/1";
  projectName: string;
  revisionId: string;
  parentRevisionId: string | null;
  branch: string;
  approvedBy: string;
  approvedAt: string;
  approvalNote: string;
  finish: Pick<FinishRecord, "label" | "supplier" | "sku" | "grain" | "role" | "swatchHash">;
  changeRequest: string;
  views: { viewName: string; file: string; originalHash: string; resultHash: string }[];
  notes: string[];
};

export function buildManifest(input: {
  projectName: string;
  set: VersionSet;
  approval: Approval;
  changeRequest: string;
  fileFor: (view: SetView) => string;
}): ExportManifest {
  if (!approvalValidFor(input.set, input.approval)) {
    throw new Error("Only an approved set can be exported, and the approval must belong to this exact version.");
  }
  const { set, approval } = input;
  return {
    format: "oriel-revision-record/1",
    projectName: input.projectName,
    revisionId: set.id,
    parentRevisionId: set.parentId,
    branch: set.branch,
    approvedBy: approval.approver,
    approvedAt: new Date(approval.at).toISOString(),
    approvalNote: approval.note,
    finish: {
      label: set.finish.label,
      supplier: set.finish.supplier,
      sku: set.finish.sku,
      grain: set.finish.grain,
      role: set.finish.role,
      swatchHash: set.finish.swatchHash,
    },
    changeRequest: input.changeRequest,
    views: set.views.map((v) => ({ viewName: v.viewName, file: input.fileFor(v), originalHash: v.originalHash, resultHash: v.resultHash })),
    notes: [
      "Presentation visual. Colour under rendered light is an approximation of the supplied sample.",
      "This record does not certify dimensions, structure, code compliance or cost.",
    ],
  };
}

/** Re-check an exported manifest against the set it claims to describe. */
export function manifestMatchesSet(manifest: ExportManifest, set: VersionSet): boolean {
  if (manifest.revisionId !== set.id || manifest.views.length !== set.views.length) return false;
  return set.views.every((v) => manifest.views.some((m) => m.viewName === v.viewName && m.resultHash === v.resultHash && m.originalHash === v.originalHash));
}
