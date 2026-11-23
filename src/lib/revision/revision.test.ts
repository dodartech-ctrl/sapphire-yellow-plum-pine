import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRevision } from "./brief.ts";
import {
  compositePermitted,
  diffAgainstParent,
  effectiveMask,
  emptyMask,
  floodSelect,
  maskCoverage,
  paintDisc,
  paintPolygon,
  paintRect,
  tintPermitted,
  type Raster,
} from "./pixels.ts";
import { jobKey, makeQuote, quoteCovers, registerJob, summarizeCosts, type Job } from "./quote.ts";
import { approvalValidFor, approveSet, branchFrom, buildManifest, createVersionSet, lineage, manifestMatchesSet, verifySet, type FinishRecord } from "./versions.ts";

function raster(w: number, h: number, fill: (x: number, y: number) => [number, number, number]): Raster {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const [r, g, b] = fill(x, y);
      const i = (y * w + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { width: w, height: h, data };
}
const grey = (x: number, y: number): [number, number, number] => [100 + ((x + y) % 20), 100 + ((x * 3 + y) % 20), 100];

test("protection wins over the editable area", () => {
  const editable = emptyMask(10, 10);
  const prot = emptyMask(10, 10);
  paintRect(editable, 0, 0, 10, 10, 1);
  paintRect(prot, 4, 4, 2, 2, 1);
  const eff = effectiveMask(editable, prot);
  assert.equal(maskCoverage(eff).pixels, 96);
  assert.equal(eff.data[4 * 10 + 4], 0);
});

test("composite takes only permitted pixels: whatever the model did elsewhere is discarded", () => {
  const parent = raster(12, 12, grey);
  const wild = raster(12, 12, () => [255, 0, 255]);
  const mask = emptyMask(12, 12);
  paintRect(mask, 2, 2, 4, 4, 1);
  const out = compositePermitted(parent, wild, mask);
  const gate = diffAgainstParent(parent, out, mask);
  assert.equal(gate.pass, true);
  assert.equal(gate.changedOutside, 0);
  assert.equal(gate.changedInside, 16);
});

test("the gate FAILS when a pixel outside the mask changed", () => {
  const parent = raster(8, 8, grey);
  const mask = emptyMask(8, 8);
  paintRect(mask, 0, 0, 2, 2, 1);
  const tampered = compositePermitted(parent, raster(8, 8, () => [0, 0, 0]), mask);
  tampered.data[(7 * 8 + 7) * 4] = 0;
  const gate = diffAgainstParent(parent, tampered, mask);
  assert.equal(gate.pass, false);
  assert.equal(gate.changedOutside, 1);
});

test("the gate FAILS on any dimension change", () => {
  const parent = raster(8, 8, grey);
  const bigger = raster(9, 8, grey);
  const gate = diffAgainstParent(parent, bigger, emptyMask(8, 8));
  assert.equal(gate.pass, false);
  assert.equal(gate.dimensionMismatch, true);
});

test("local tint recolours only the permitted pixels and passes the gate", () => {
  const parent = raster(16, 16, grey);
  const mask = emptyMask(16, 16);
  paintDisc(mask, 8, 8, 4, 1);
  const tinted = tintPermitted(parent, mask, [110, 70, 40]);
  const gate = diffAgainstParent(parent, tinted, mask);
  assert.equal(gate.pass, true);
  assert.ok(gate.changedInside > 20);
});

test("flood select grabs a flat region and stops at a colour edge", () => {
  const img = raster(10, 10, (x) => (x < 5 ? [200, 200, 200] : [20, 20, 20]));
  const mask = emptyMask(10, 10);
  const n = floodSelect(img, mask, 1, 1, 10);
  assert.equal(n, 50);
});

test("parse_revision extracts target, finish and protected items, and leaves unknowns blank", () => {
  const parsed = parseRevision("Please make the upper cabinets walnut but keep the handles and the countertop.", ["Front view", "Side view"]);
  assert.deepEqual(parsed.targets, ["upper cabinets"], "a kept item must never become an edit target");
  assert.ok(parsed.protectedElements.includes("countertop"));
  assert.equal(parsed.finish, "walnut");
  assert.ok(parsed.protectedElements.includes("handles"));
  assert.ok(parsed.unknown.includes("Does the change apply to every view?"));
  const vague = parseRevision("make it nicer");
  assert.equal(vague.finish, null);
  assert.equal(vague.targets.length, 0);
  assert.ok(vague.checklist.every((c) => c.id === "protected" || c.id === "views" || c.status === "missing"));
});

test("a quote fixes scope and ceiling; expanded work needs a new quote", () => {
  const q = makeQuote({ projectId: "p", viewIds: ["a", "b"], previewsPerView: 1, retryAllowance: 1, unitCredits: 50, route: "ai", now: 1 });
  assert.equal(q.ceilingCredits, 150);
  assert.equal(quoteCovers(q, { viewId: "a", attemptsSoFar: 0, creditsSpent: 0 }).ok, true);
  assert.equal(quoteCovers(q, { viewId: "c", attemptsSoFar: 0, creditsSpent: 0 }).ok, false);
  assert.equal(quoteCovers(q, { viewId: "a", attemptsSoFar: 3, creditsSpent: 150 }).ok, false);
});

test("submitting the same job twice creates exactly one billable job", () => {
  const key = jobKey({ projectId: "p", setId: "s", viewId: "a", maskHash: "m", finishId: "f", attempt: 1 });
  let jobs: Record<string, Job> = {};
  let made = 0;
  const make = (): Job => {
    made += 1;
    return { key, viewId: "a", attempt: 1, status: "running", creditsCharged: 50, startedAt: 1 };
  };
  const first = registerJob(jobs, key, make);
  jobs = first.jobs;
  const second = registerJob(jobs, key, make);
  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(made, 1);
});

test("cost summary counts every attempt, failed ones included", () => {
  const s = summarizeCosts(
    [
      { id: "1", setId: null, viewId: "a", attempt: 1, provider: "ai", credits: 50, elapsedMs: 1000, outcome: "rejected", at: 1 },
      { id: "2", setId: null, viewId: "a", attempt: 2, provider: "ai", credits: 50, elapsedMs: 1000, outcome: "accepted", at: 2 },
    ],
    12,
  );
  assert.equal(s.credits, 100);
  assert.equal(s.creditsPerAccepted, 100);
  assert.equal(s.failedOrRejected, 1);
  assert.equal(s.designerMinutes, 12);
});

const finish: FinishRecord = { id: "f1", label: "Walnut", supplier: "", sku: "", grain: "vertical", role: "material", swatchHash: "abc" };
const mkViews = (r: string) => [
  { viewId: "a", viewName: "Front", originalHash: "o1", resultHash: r },
  { viewId: "b", viewName: "Side", originalHash: "o2", resultHash: r },
];

test("approve set A, branch to B, export A: manifest and approval match A", async () => {
  const A = await createVersionSet({ parentId: null, branch: "main", label: "Walnut", briefHash: "b", finish, views: mkViews("rA"), createdAt: 1 });
  const approval = approveSet(A, { decision: "approved", approver: "Client", source: "client-link", at: 2 });
  const B = await createVersionSet({ ...branchFrom(A, "oak-try"), label: "Oak", briefHash: "b", finish: { ...finish, label: "Oak" }, views: mkViews("rB"), createdAt: 3 });
  assert.notEqual(A.id, B.id);
  assert.equal(approvalValidFor(A, approval), true);
  assert.equal(approvalValidFor(B, approval), false, "approval must not carry over to a different set");
  const manifest = buildManifest({ projectName: "Kitchen", set: A, approval, changeRequest: "walnut", fileFor: (v) => `${v.viewName}.jpg` });
  assert.equal(manifestMatchesSet(manifest, A), true);
  assert.equal(manifestMatchesSet(manifest, B), false);
  assert.throws(() => buildManifest({ projectName: "K", set: B, approval, changeRequest: "", fileFor: () => "x" }));
  assert.deepEqual(lineage([A, B], B.id).map((s) => s.branch), ["oak-try", "main"]);
});

test("a stored set that is edited no longer verifies", async () => {
  const A = await createVersionSet({ parentId: null, branch: "main", label: "L", briefHash: "b", finish, views: mkViews("r"), createdAt: 1 });
  assert.equal(await verifySet(A), true);
  const forged = { ...A, label: "Changed after approval" };
  assert.equal(await verifySet(forged), false);
});

test("a change request cannot be approved without a name", async () => {
  const A = await createVersionSet({ parentId: null, branch: "main", label: "L", briefHash: "b", finish, views: mkViews("r"), createdAt: 1 });
  assert.throws(() => approveSet(A, { decision: "approved", approver: "  ", source: "designer" }));
});

test("polygon fill covers the interior of a triangle and nothing outside it", () => {
  const m = emptyMask(20, 20);
  paintPolygon(m, [[2, 2], [18, 2], [2, 18]], 1);
  assert.equal(m.data[3 * 20 + 3], 1);
  assert.equal(m.data[17 * 20 + 17], 0);
  assert.equal(m.data[2 * 20 + 19], 0);
  const n = maskCoverage(m).pixels;
  assert.ok(n > 110 && n < 150, `triangle area was ${n}`);
});
