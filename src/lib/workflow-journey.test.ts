import assert from "node:assert/strict";
import test from "node:test";
import {
  WORKFLOW_INTENTS,
  STAGE_ENTOURAGE_TAGS,
  appendEntourageTagToIdea,
  buildEnhanceDirective,
  defaultEnhanceEnvironmentForVertical,
  resolveIntentFromStage,
} from "./workflow-journey";

test("WORKFLOW_INTENTS defines the complete 5-stage architectural user journey", () => {
  assert.equal(WORKFLOW_INTENTS.length, 5);
  assert.deepEqual(
    WORKFLOW_INTENTS.map((w) => w.id),
    ["render", "3d", "edit", "enhance", "spatial"],
  );
});

test("resolveIntentFromStage maps all 11 studio stages and enhance mode cleanly", () => {
  assert.equal(resolveIntentFromStage("source", false), "render");
  assert.equal(resolveIntentFromStage("grid", false), "render");
  assert.equal(resolveIntentFromStage("3d", false), "3d");
  assert.equal(resolveIntentFromStage("sam2", false), "edit");
  assert.equal(resolveIntentFromStage("mask", false), "edit");
  assert.equal(resolveIntentFromStage("sketch", false), "edit");
  assert.equal(resolveIntentFromStage("cv", false), "edit");
  assert.equal(resolveIntentFromStage("source", true), "enhance");
  assert.equal(resolveIntentFromStage("result", true), "enhance");
  assert.equal(resolveIntentFromStage("compare", true), "enhance");
  assert.equal(resolveIntentFromStage("360", false), "spatial");
  assert.equal(resolveIntentFromStage("nodes", false), "spatial");
});

test("buildEnhanceDirective formats Vaethat-style scope, environment, and resolution cleanly", () => {
  const txt = buildEnhanceDirective("region", "interior", 4);
  assert.match(txt, /4x ArchViz enhance/);
  assert.match(txt, /targeted architectural region clarity/);
  assert.match(txt, /strict interior geometry/);
  assert.equal(defaultEnhanceEnvironmentForVertical("interior"), "interior");
  assert.equal(defaultEnhanceEnvironmentForVertical("exterior"), "exterior");
});

test("appendEntourageTagToIdea appends without duplicating existing entourage phrases", () => {
  assert.equal(STAGE_ENTOURAGE_TAGS.length >= 5, true);
  const first = appendEntourageTagToIdea("Modern travertine villa", STAGE_ENTOURAGE_TAGS[0].snippet);
  assert.equal(first, "Modern travertine villa, mature architectural trees framing the edges");
  const dup = appendEntourageTagToIdea(first, STAGE_ENTOURAGE_TAGS[0].snippet);
  assert.equal(dup, first);
});
