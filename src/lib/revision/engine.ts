/**
 * Revision Studio orchestration (browser). Wires the pure core (pixels, quote,
 * versions) to storage, the existing AI edit route, and the store. Every paid
 * operation goes through quote coverage and idempotent job registration.
 */
import { inpaintPlate } from "@/lib/generate";
import { PLATE_COST } from "@/lib/credits";
import { useOriel } from "@/lib/store";
import { parseRevision } from "./brief.ts";
import {
  averageColorHex,
  loadImage,
  maskToPngDataUrl,
  rasterFromDataUrl,
  rasterFromImage,
  rasterToPngDataUrl,
  readFileAsDataUrl,
  WORKING_EDGE,
} from "./browser.ts";
import { deleteBlobsWithPrefix, getBlob, putBlob } from "./blobs.ts";
import {
  cloneMask,
  compositePermitted,
  diffAgainstParent,
  effectiveMask,
  emptyMask,
  fastHash,
  paintPolygon,
  paintRect,
  parseHex,
  tintPermitted,
  type Mask,
  type Raster,
} from "./pixels.ts";
import { jobKey, makeQuote, quoteCovers, registerJob, type CostEntry } from "./quote.ts";
import { blobKey, blankProject, newId, useRevision, type Candidate, type FinishDraft, type RevProject, type RevSurface, type RevView } from "./store.ts";
import { approveSet, createVersionSet, sha256Hex, type Approval, type SetView, type VersionSet } from "./versions.ts";

export class DuplicateViewError extends Error {
  constructor(public existingName: string) {
    super(`This image is identical to “${existingName}”. Use a different view.`);
  }
}

function project(id: string): RevProject {
  const p = useRevision.getState().projects.find((item) => item.id === id);
  if (!p) throw new Error("That project no longer exists.");
  return p;
}

const patch = (id: string, change: Parameters<ReturnType<typeof useRevision.getState>["patch"]>[1]) => useRevision.getState().patch(id, change);

/* ------------------------------ intake (M01) ------------------------------ */

export async function addViewFromDataUrl(projectId: string, name: string, originalDataUrl: string): Promise<RevView> {
  const p = project(projectId);
  const working = await rasterFromDataUrl(originalDataUrl, WORKING_EDGE);
  const pixelHash = fastHash(working.data);
  const dup = p.views.find((v) => v.pixelHash === pixelHash);
  if (dup) throw new DuplicateViewError(dup.name);
  const id = newId("v");
  const view: RevView = {
    id,
    name: name.trim().slice(0, 40) || `View ${p.views.length + 1}`,
    width: working.width,
    height: working.height,
    pixelHash,
    originalHash: await sha256Hex(working.data),
    originalKey: blobKey(projectId, id, "original"),
    workingKey: blobKey(projectId, id, "working"),
  };
  await putBlob(view.originalKey, originalDataUrl); // preserved exactly as uploaded
  await putBlob(view.workingKey, rasterToPngDataUrl(working)); // lossless working copy
  patch(projectId, (cur) => ({ views: [...cur.views, view], briefConfirmed: false, quoteApproved: false, quote: null }));
  return view;
}

export async function addViewFromFile(projectId: string, name: string, file: File): Promise<RevView> {
  if (!file.type.startsWith("image/")) throw new Error("Upload a PNG or JPEG image.");
  return addViewFromDataUrl(projectId, name, await readFileAsDataUrl(file));
}

export function renameView(projectId: string, viewId: string, name: string) {
  patch(projectId, (p) => ({ views: p.views.map((v) => (v.id === viewId ? { ...v, name: name.trim().slice(0, 40) || v.name } : v)) }));
}

export async function removeView(projectId: string, viewId: string) {
  await deleteBlobsWithPrefix(blobKey(projectId, viewId));
  patch(projectId, (p) => ({
    views: p.views.filter((v) => v.id !== viewId),
    candidates: p.candidates.filter((c) => c.viewId !== viewId),
    surfaces: p.surfaces.map((s) => {
      const { [viewId]: _removed, ...visible } = s.visible;
      void _removed;
      return { ...s, visible };
    }),
    quote: null,
    quoteApproved: false,
  }));
}

export async function workingRaster(view: RevView): Promise<Raster> {
  const url = await getBlob<string>(view.workingKey);
  if (!url) throw new Error(`The stored image for “${view.name}” is missing. Upload it again.`);
  return rasterFromDataUrl(url, WORKING_EDGE);
}

/* ------------------------------ brief (M01/M02) --------------------------- */

export function analyseFeedback(projectId: string, feedback: string) {
  const p = project(projectId);
  const brief = parseRevision(feedback, p.views.map((v) => v.name));
  patch(projectId, { feedback, brief, briefConfirmed: false });
  return brief;
}

export async function setFinishSwatch(projectId: string, file: File): Promise<void> {
  const url = await readFileAsDataUrl(file);
  const raster = await rasterFromDataUrl(url, 256);
  const id = project(projectId).finish?.id ?? newId("f");
  const key = blobKey(projectId, "swatch", id);
  await putBlob(key, url);
  patch(projectId, (p) => ({
    finish: {
      ...(p.finish ?? emptyFinish(id)),
      swatchKey: key,
      swatchHash: fastHash(raster.data),
      color: averageColorHex(raster),
    },
    quote: null,
    quoteApproved: false,
  }));
}

export function emptyFinish(id = newId("f")): FinishDraft {
  return { id, label: "", supplier: "", sku: "", grain: "", role: "material", color: "#6b4a32", swatchKey: null, swatchHash: "" };
}

export function updateFinish(projectId: string, change: Partial<FinishDraft>) {
  patch(projectId, (p) => ({ finish: { ...(p.finish ?? emptyFinish()), ...change }, quote: null, quoteApproved: false }));
}

/* --------------------------- surfaces and masks (M03/M04) ----------------- */

export function addSurface(projectId: string, name: string): string {
  const id = newId("s");
  const clean = name.trim().slice(0, 40) || "Surface";
  patch(projectId, (p) => ({
    surfaces: [...p.surfaces, { id, name: clean, visible: Object.fromEntries(p.views.map((v) => [v.id, true])) }],
    activeSurfaceId: id,
  }));
  return id;
}

export function removeSurface(projectId: string, surfaceId: string) {
  void deleteBlobsWithPrefix(blobKey(projectId, "mask", surfaceId));
  patch(projectId, (p) => ({
    surfaces: p.surfaces.filter((s) => s.id !== surfaceId),
    activeSurfaceId: p.activeSurfaceId === surfaceId ? (p.surfaces.find((s) => s.id !== surfaceId)?.id ?? null) : p.activeSurfaceId,
    quote: null,
    quoteApproved: false,
  }));
}

export function renameSurface(projectId: string, surfaceId: string, name: string) {
  patch(projectId, (p) => ({ surfaces: p.surfaces.map((s) => (s.id === surfaceId ? { ...s, name: name.trim().slice(0, 40) || s.name } : s)) }));
}

export function setSurfaceVisible(projectId: string, surfaceId: string, viewId: string, visible: boolean) {
  patch(projectId, (p) => ({
    surfaces: p.surfaces.map((s) => (s.id === surfaceId ? { ...s, visible: { ...s.visible, [viewId]: visible } } : s)),
    quote: null,
    quoteApproved: false,
  }));
}

const editableKey = (pid: string, sid: string, vid: string) => blobKey(pid, "mask", sid, vid, "e");
const protectedKey = (pid: string, vid: string) => blobKey(pid, "mask", "protected", vid);

type StoredMask = { width: number; height: number; data: Uint8Array };

async function readMask(key: string, view: RevView): Promise<Mask> {
  const stored = await getBlob<StoredMask>(key);
  if (stored && stored.width === view.width && stored.height === view.height) return { width: stored.width, height: stored.height, data: new Uint8Array(stored.data) };
  return emptyMask(view.width, view.height);
}

export const loadEditable = (pid: string, sid: string, view: RevView) => readMask(editableKey(pid, sid, view.id), view);
export const loadProtected = (pid: string, view: RevView) => readMask(protectedKey(pid, view.id), view);

function invalidate(projectId: string, viewId: string) {
  // Changing a mask makes dependent previews stale: they stay visible but must be re-run before approval.
  patch(projectId, (p) => ({
    maskRev: { ...p.maskRev, [viewId]: (p.maskRev[viewId] ?? 0) + 1 },
    candidates: p.candidates.map((c) => (c.viewId === viewId && c.status === "ready" ? { ...c, note: "Mask changed after this preview. Re-run before approving." } : c)),
    quote: null,
    quoteApproved: false,
  }));
}

export async function saveEditable(pid: string, sid: string, view: RevView, mask: Mask) {
  await putBlob(editableKey(pid, sid, view.id), { width: mask.width, height: mask.height, data: mask.data });
  invalidate(pid, view.id);
}

export async function saveProtected(pid: string, view: RevView, mask: Mask) {
  await putBlob(protectedKey(pid, view.id), { width: mask.width, height: mask.height, data: mask.data });
  invalidate(pid, view.id);
}

/** Union of every visible surface's editable mask for the view, minus the protected mask. */
export async function permittedMaskFor(p: RevProject, view: RevView): Promise<{ mask: Mask; surfaceNames: string[] }> {
  const union = emptyMask(view.width, view.height);
  const names: string[] = [];
  for (const surface of p.surfaces) {
    if (surface.visible[view.id] === false) continue;
    const e = await readMask(editableKey(p.id, surface.id, view.id), view);
    let any = false;
    for (let i = 0; i < e.data.length; i += 1) {
      if (e.data[i]) {
        union.data[i] = 1;
        any = true;
      }
    }
    if (any) names.push(surface.name);
  }
  const prot = await readMask(protectedKey(p.id, view.id), view);
  return { mask: effectiveMask(union, prot), surfaceNames: names };
}

/** Which views still need a target selected? Occluded views are excluded. */
export async function viewsMissingTarget(p: RevProject): Promise<RevView[]> {
  const missing: RevView[] = [];
  for (const view of p.views) {
    if (p.surfaces.length && p.surfaces.every((s) => s.visible[view.id] === false)) continue;
    const { mask } = await permittedMaskFor(p, view);
    if (!mask.data.some((v) => v === 1)) missing.push(view);
  }
  return missing;
}

/** The views a revision must cover: everything that is not entirely marked invisible. */
export function targetViews(p: RevProject): RevView[] {
  return p.views.filter((v) => !(p.surfaces.length && p.surfaces.every((s) => s.visible[v.id] === false)));
}

/* ------------------------------ quote (M06) ------------------------------- */

export function requestQuote(projectId: string) {
  const p = project(projectId);
  const views = targetViews(p);
  const quote = makeQuote({ projectId, viewIds: views.map((v) => v.id), previewsPerView: 1, retryAllowance: 1, unitCredits: PLATE_COST, route: "ai" });
  patch(projectId, { quote, quoteApproved: false });
  return quote;
}

export function approveQuote(projectId: string) {
  patch(projectId, { quoteApproved: true });
}

/* --------------------------- revision run (M03/M06) ----------------------- */

export type RunResult = { ok: true; candidate: Candidate } | { ok: false; reason: string; duplicate?: boolean };

function finishPrompt(p: RevProject, surfaces: string[]): string {
  const f = p.finish;
  const finish = [f?.label, f?.grain ? `${f.grain} grain` : "", f?.supplier ? `supplier ${f.supplier}` : ""].filter(Boolean).join(", ") || "the supplied sample";
  return `Apply this finish: ${finish}, to ONLY the masked ${surfaces.join(" and ") || "area"}. Match the attached material sample. Do not change anything outside the mask. Keep the camera, framing, lighting direction and every other surface identical. Client request: ${p.feedback.slice(0, 400)}`;
}

async function rasterFromResult(url: string, size: { width: number; height: number }): Promise<Raster> {
  const img = await loadImage(url);
  return rasterFromImage(img, WORKING_EDGE, size);
}

export async function runView(projectId: string, viewId: string): Promise<RunResult> {
  const p = project(projectId);
  const view = p.views.find((v) => v.id === viewId);
  if (!view) return { ok: false, reason: "That view no longer exists." };
  if (!p.quote || !p.quoteApproved) return { ok: false, reason: "Approve the quote before running a revision." };
  if (!p.finish) return { ok: false, reason: "Add a finish first." };

  const attemptsSoFar = p.costs.filter((c) => c.viewId === viewId).length;
  const totalAttempts = p.costs.length;
  const creditsSpent = p.costs.reduce((sum, c) => sum + c.credits, 0);
  const covers = quoteCovers(p.quote, { viewId, attemptsSoFar: totalAttempts, creditsSpent });
  if (!covers.ok) return { ok: false, reason: covers.reason };

  const { mask: permitted, surfaceNames } = await permittedMaskFor(p, view);
  if (!permitted.data.some((v) => v === 1)) return { ok: false, reason: `Select the surface in “${view.name}” first (or mark it not visible there).` };

  const attempt = attemptsSoFar + 1;
  const key = jobKey({ projectId, setId: p.activeSetId ?? "draft", viewId, maskHash: `${fastHash(permitted.data)}-${p.maskRev[viewId] ?? 0}`, finishId: `${p.finish.id}-${p.finish.color}`, attempt });
  const started = Date.now();
  const reg = registerJob(p.jobs, key, () => ({ key, viewId, attempt, status: "running", creditsCharged: 0, startedAt: started }));
  if (reg.duplicate) return { ok: false, reason: "This exact job is already running or finished. It was not started again.", duplicate: true };
  patch(projectId, { jobs: reg.jobs });

  let provider: Candidate["provider"] = "local-preview";
  let creditsCharged = 0;
  let note = "Offline finish preview: recolours only the selected area. Colour under rendered light is an approximation.";
  try {
    const parent = await workingRaster(view);
    let candidateRaster: Raster | null = null;

    try {
      const before = useOriel.getState().credits;
      const swatch = p.finish.swatchKey ? await getBlob<string>(p.finish.swatchKey) : null;
      const result = await inpaintPlate({
        data: {
          idea: finishPrompt(p, surfaceNames),
          image: rasterToPngDataUrl(parent),
          maskImage: maskToPngDataUrl(permitted),
          materialRefImage: swatch ?? undefined,
        },
      });
      useOriel.getState().setCredits(result.credits);
      creditsCharged = Math.max(0, before - result.credits);
      if (!result.fallback) {
        candidateRaster = await rasterFromResult(result.url, parent);
        provider = "ai";
        note = "AI revision, composited onto the original inside the permitted area only.";
      } else if ("warning" in result && typeof result.warning === "string" && result.warning) {
        note = `AI unavailable (${result.warning.slice(0, 90)}). ${note}`;
      } else {
        note = `AI model not available, so no credits were used. ${note}`;
      }
    } catch (error) {
      note = `AI result could not be used (${error instanceof Error ? error.message.slice(0, 80) : "error"}). ${note}`;
    }

    const rgb = parseHex(p.finish.color) ?? [107, 74, 50];
    const resultRaster = candidateRaster ? compositePermitted(parent, candidateRaster, permitted) : tintPermitted(parent, permitted, rgb);
    const gate = diffAgainstParent(parent, resultRaster, permitted);
    const png = rasterToPngDataUrl(resultRaster);
    const resultHash = await sha256Hex(resultRaster.data);
    const candidateId = newId("c");
    const resultKey = blobKey(projectId, viewId, "result", candidateId);
    await putBlob(resultKey, png);

    const candidate: Candidate = {
      id: candidateId,
      viewId,
      attempt,
      jobKey: key,
      resultKey,
      resultHash,
      provider,
      gate: { pass: gate.pass, changedOutside: gate.changedOutside, changedInside: gate.changedInside, reason: gate.reason },
      status: "ready",
      credits: creditsCharged,
      elapsedMs: Date.now() - started,
      note,
      createdAt: Date.now(),
    };
    const cost: CostEntry = { id: newId("k"), setId: null, viewId, attempt, provider: provider === "ai" ? "ai" : "local-preview", credits: creditsCharged, elapsedMs: candidate.elapsedMs, outcome: gate.pass ? "pending" : "rejected", at: Date.now() };
    patch(projectId, (cur) => ({
      jobs: { ...cur.jobs, [key]: { ...cur.jobs[key], status: "done", creditsCharged, finishedAt: Date.now() } },
      candidates: [...cur.candidates, candidate],
      costs: [...cur.costs, cost],
    }));
    return { ok: true, candidate };
  } catch (error) {
    patch(projectId, (cur) => ({
      jobs: { ...cur.jobs, [key]: { ...cur.jobs[key], status: "failed", finishedAt: Date.now() } },
      costs: [...cur.costs, { id: newId("k"), setId: null, viewId, attempt, provider: "local-preview", credits: creditsCharged, elapsedMs: Date.now() - started, outcome: "failed", at: Date.now() }],
    }));
    return { ok: false, reason: error instanceof Error ? error.message : "The revision failed." };
  }
}

/* ------------------------- accept / reject / retry (M04) ------------------ */

export function acceptCandidate(projectId: string, candidateId: string): string | null {
  const p = project(projectId);
  const cand = p.candidates.find((c) => c.id === candidateId);
  if (!cand) return "Preview not found.";
  if (!cand.gate.pass) return "This preview changed pixels outside the editable area and cannot be accepted. Re-run it.";
  if (cand.note.startsWith("Mask changed")) return "The mask changed after this preview. Re-run it before accepting.";
  patch(projectId, (cur) => ({
    // Only this view's earlier acceptance is replaced. Sibling views are untouched.
    candidates: cur.candidates.map((c) => (c.viewId !== cand.viewId ? c : c.id === candidateId ? { ...c, status: "accepted" as const } : c.status === "accepted" ? { ...c, status: "ready" as const } : c)),
    costs: cur.costs.map((k) => (k.viewId === cand.viewId && k.attempt === cand.attempt ? { ...k, outcome: "accepted" as const } : k)),
  }));
  return null;
}

export function rejectCandidate(projectId: string, candidateId: string) {
  const cand = project(projectId).candidates.find((c) => c.id === candidateId);
  if (!cand) return;
  patch(projectId, (cur) => ({
    candidates: cur.candidates.map((c) => (c.id === candidateId ? { ...c, status: "rejected" as const } : c)),
    costs: cur.costs.map((k) => (k.viewId === cand.viewId && k.attempt === cand.attempt ? { ...k, outcome: "rejected" as const } : k)),
  }));
}

export function acceptedFor(p: RevProject, viewId: string): Candidate | undefined {
  return p.candidates.find((c) => c.viewId === viewId && c.status === "accepted");
}

/* ------------------------- versions and approval (M05) -------------------- */

export function toFinishRecord(f: FinishDraft) {
  return { id: f.id, label: f.label || "Unnamed finish", supplier: f.supplier, sku: f.sku, grain: f.grain, role: f.role, swatchHash: f.swatchHash };
}

/** Freeze the accepted previews of every target view into one immutable set. */
export async function freezeSet(projectId: string, opts?: { branch?: string; label?: string }): Promise<VersionSet> {
  const p = project(projectId);
  if (!p.finish) throw new Error("Add a finish before freezing a set.");
  const targets = targetViews(p);
  const views: SetView[] = [];
  for (const v of targets) {
    const accepted = acceptedFor(p, v.id);
    if (!accepted) throw new Error(`Accept a preview for “${v.name}” first.`);
    views.push({ viewId: v.id, viewName: v.name, originalHash: v.originalHash, resultHash: accepted.resultHash });
  }
  const parent = p.sets.find((s) => s.id === p.activeSetId) ?? null;
  const briefHash = await sha256Hex(JSON.stringify({ feedback: p.feedback, brief: p.brief }));
  const set = await createVersionSet({
    parentId: parent?.id ?? null,
    branch: opts?.branch ?? p.draftBranch ?? parent?.branch ?? "main",
    label: opts?.label ?? (p.finish.label || "Revision"),
    briefHash,
    finish: toFinishRecord(p.finish),
    views,
  });
  if (p.sets.some((s) => s.id === set.id)) {
    patch(projectId, { activeSetId: set.id });
    return p.sets.find((s) => s.id === set.id) as VersionSet;
  }
  // Keep each accepted result bound to this set so a later draft can never replace it.
  for (const v of views) {
    const accepted = acceptedFor(p, v.viewId);
    if (accepted) {
      const png = await getBlob<string>(accepted.resultKey);
      if (png) await putBlob(blobKey(projectId, "set", set.id, v.viewId), png);
    }
  }
  patch(projectId, (cur) => ({ sets: [...cur.sets, set], activeSetId: set.id, draftBranch: null }));
  return set;
}

export async function setImages(projectId: string, set: VersionSet): Promise<{ viewId: string; name: string; before: string | null; after: string | null }[]> {
  const p = project(projectId);
  const out = [];
  // Keep the designer's own view order, not the hash-sorted order inside the set.
  const ordered = [...set.views].sort((a, b) => {
    const ia = p.views.findIndex((v) => v.id === a.viewId);
    const ib = p.views.findIndex((v) => v.id === b.viewId);
    return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
  });
  for (const sv of ordered) {
    const view = p.views.find((v) => v.id === sv.viewId);
    out.push({
      viewId: sv.viewId,
      name: sv.viewName,
      before: view ? await getBlob<string>(view.workingKey) : null,
      after: await getBlob<string>(blobKey(projectId, "set", set.id, sv.viewId)),
    });
  }
  return out;
}

export function designerApprove(projectId: string, setId: string, approver: string, note: string): Approval {
  const p = project(projectId);
  const set = p.sets.find((s) => s.id === setId);
  if (!set) throw new Error("Set not found.");
  const approval = approveSet(set, { decision: "approved", approver, note, source: "designer" });
  patch(projectId, (cur) => ({ approvals: [...cur.approvals, approval] }));
  return approval;
}

/**
 * Start a new draft branch from the active set. The frozen set (and its stored
 * images) are never touched; new previews build a separate set.
 */
export function startBranch(projectId: string, branch: string) {
  const p = project(projectId);
  patch(projectId, {
    candidates: p.candidates.map((c) => (c.status === "accepted" ? { ...c, status: "ready" as const } : c)),
    quote: null,
    quoteApproved: false,
    jobs: {},
    review: null,
    draftBranch: branch.trim().slice(0, 40) || "alternative",
    step: 3,
  });
}

export function restoreSet(projectId: string, setId: string) {
  patch(projectId, { activeSetId: setId });
}

export function setDesignerMinutes(projectId: string, minutes: number) {
  patch(projectId, { designerMinutes: Math.max(0, Math.min(10000, Math.round(minutes))) });
}

/* --------------------------------- sample --------------------------------- */

const SAMPLE_VIEWS = [
  { name: "Living room · render A", src: "/viz/t03-compact-living-room.jpg" },
  { name: "Living room · render B", src: "/viz/t09-living-room-clay-edit.jpg" },
];

export async function createSampleProject(): Promise<string> {
  const id = useRevision.getState().create("Sample: feature wall in walnut");
  try {
    for (const item of SAMPLE_VIEWS) {
      const res = await fetch(item.src);
      if (!res.ok) throw new Error("The sample image could not be loaded.");
      const blob = await res.blob();
      await addViewFromDataUrl(id, item.name, await readFileAsDataUrl(new File([blob], "s.jpg", { type: blob.type || "image/jpeg" })));
    }
    const surfaceId = addSurface(id, "Feature wall");
    const p = project(id);
    for (const view of p.views) {
      const raster = await workingRaster(view);
      const w = raster.width / 1273;
      const h = raster.height / 960;
      const editable = emptyMask(raster.width, raster.height);
      // The right-hand feature wall, as a polygon in the sample images' own coordinates.
      paintPolygon(editable, [[885, 108], [992, 6], [1273, 6], [1273, 458], [1012, 442], [885, 472]].map(([x, y]) => [x * w, y * h] as [number, number]), 1);
      await saveEditable(id, surfaceId, view, editable);
      const prot = emptyMask(raster.width, raster.height);
      paintRect(prot, 1050 * w, 25 * h, 190 * w, 380 * h, 1); // the artwork
      paintRect(prot, 900 * w, 305 * h, 90 * w, 140 * h, 1); // the floor lamp head
      await saveProtected(id, view, prot);
    }
    const feedback = "Please change the feature wall to walnut in both renders, but keep the artwork and the floor lamp.";
    const brief = parseRevision(feedback, project(id).views.map((v) => v.name));
    updateFinish(id, { label: "Walnut veneer", grain: "vertical", color: "#6b4a32" });
    patch(id, { feedback, brief, briefConfirmed: true, step: 3 });
  } catch (error) {
    useRevision.getState().remove(id);
    throw error;
  }
  return id;
}

export { blankProject, cloneMask };
export type { RevSurface };
