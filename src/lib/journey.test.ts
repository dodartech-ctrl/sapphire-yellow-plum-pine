import assert from "node:assert/strict";
import { test } from "node:test";
import { currentJourneyStep, journeyProgress, JOURNEY_STEPS, type JourneyInput } from "./journey.ts";

const empty: JourneyInput = {
  hasSource: false,
  hasChosenLook: false,
  hasPrompt: false,
  hasPlate: false,
  hasVariationsOrCompared: false,
  hasSavedOrPublished: false,
};

const idOf = (input: JourneyInput) => currentJourneyStep(journeyProgress(input))?.id ?? null;

test("a brand-new user is pointed at the first step", () => {
  assert.equal(idOf(empty), "start");
});

test("with a source, the next step is choosing what changes", () => {
  assert.equal(idOf({ ...empty, hasSource: true }), "define");
});

test("the optional first step never blocks a user who skips it", () => {
  assert.equal(idOf({ ...empty, hasChosenLook: true }), "describe");
  assert.equal(idOf({ ...empty, hasChosenLook: true, hasPrompt: true }), "render");
});

test("after a render the guide moves to review, then to keeping the work", () => {
  const rendered = { ...empty, hasChosenLook: true, hasPrompt: true, hasPlate: true };
  assert.equal(idOf(rendered), "review");
  assert.equal(idOf({ ...rendered, hasVariationsOrCompared: true }), "keep");
});

test("a finished journey has no current step", () => {
  const all: JourneyInput = {
    hasSource: true,
    hasChosenLook: true,
    hasPrompt: true,
    hasPlate: true,
    hasVariationsOrCompared: true,
    hasSavedOrPublished: true,
  };
  assert.equal(idOf(all), null);
  assert.ok(journeyProgress(all).every((step) => step.status === "done"));
});

test("steps are numbered 1..n and every step has a purpose, a place and an action", () => {
  const steps = journeyProgress(empty);
  assert.deepEqual(steps.map((s) => s.number), JOURNEY_STEPS.map((_, i) => i + 1));
  for (const step of steps) {
    assert.ok(step.purpose.length > 10 && step.where.length > 10 && step.actionLabel.length > 3);
  }
});

test("rendering straight from the defaults does not leave earlier required steps stuck", () => {
  const steps = journeyProgress({ ...empty, hasPlate: true });
  assert.equal(steps.find((s) => s.id === "define")?.status, "done");
  assert.equal(steps.find((s) => s.id === "describe")?.status, "done");
  assert.equal(currentJourneyStep(steps)?.id, "review");
  // the optional first step is not falsely ticked
  assert.notEqual(steps.find((s) => s.id === "start")?.status, "done");
});
