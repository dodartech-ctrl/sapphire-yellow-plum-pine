import assert from "node:assert/strict";
import test from "node:test";
import { buildAtelierIterationCards } from "./atelier-studio";
import { DEFAULT_ENGINE, DEFAULT_SCENE3D } from "./engines";
import { DEFAULT_FRAME } from "./frame";
import {
  ARCHVIZ_100_CATEGORIES,
  ARCHVIZ_PRESETS_100,
  INTENT_LOOKS_16,
  PLAIN_QUESTIONS_8,
  PRD_LIGHT_PALETTE,
  PRD_MATERIAL_PALETTE,
  PRESETS_200,
  PRESET_200_CATEGORIES,
  buildDefaultDesignContract,
  compileSentencePrompt,
  evaluateFidelityGate,
  filterArchviz100,
  filterPresets200,
  lintPromptRules,
} from "./presets-catalog";
import { DEFAULT_DESIGN } from "./properties";

test("PRESETS_200 and ARCHVIZ_PRESETS_100 contain full PRD catalogs across groups", () => {
  assert.equal(PRESETS_200.length, 200);
  assert.ok(PRESET_200_CATEGORIES.length >= 10);
  assert.equal(ARCHVIZ_PRESETS_100.length, 100);
  assert.ok(ARCHVIZ_100_CATEGORIES.length >= 4);
  assert.equal(INTENT_LOOKS_16.length, 16);
  assert.equal(PLAIN_QUESTIONS_8.length, 8);
  assert.ok(PRD_MATERIAL_PALETTE.every((item) => item.licence === "CC0"));
  assert.ok(PRD_LIGHT_PALETTE.length >= 8);
});

test("filterPresets200 and filterArchviz100 filter accurately by query, category, and polarity", () => {
  const positives = filterPresets200("", "All", "positive");
  const negatives = filterPresets200("", "All", "negative");
  assert.ok(positives.length > 150);
  assert.ok(negatives.length >= 15);
  const basalt = filterPresets200("basalt", "All", "all");
  assert.ok(basalt.length >= 1);
  const arch = filterArchviz100("pavilion", "All");
  assert.ok(Array.isArray(arch));
});

test("lintPromptRules detects semantic time conflicts, overlap, and long prompts", () => {
  const issues = lintPromptRules(
    "Modern villa at high noon with night glow and no people",
    ["P001", "P181"],
    ["P181"],
    { geometryLock: 90, ratio: "16:9" },
  );
  const codes = new Set(issues.map((i) => i.code));
  assert.ok(codes.has("L04"));
  assert.ok(codes.has("L05"));
  assert.ok(codes.has("L07"));
});

test("compileSentencePrompt compiles positives, negatives, keep rule, and credits", () => {
  const compiled = compileSentencePrompt({
    baseIdea: "Nordic fjords pavilion",
    activePresetIds: ["P001", "P041"],
    negativePresetIds: ["P181"],
    presetStrengths: { P001: 1.25 },
    questionPicks: { time: "Golden hour", weather: "Auto" },
    design: DEFAULT_DESIGN,
    engine: DEFAULT_ENGINE,
  });
  assert.ok(compiled.sentence.includes("Nordic fjords pavilion"));
  assert.ok(compiled.sentence.includes("1.25x"));
  assert.ok(compiled.sentence.includes("Keep every wall"));
  assert.ok(compiled.negativePrompt.includes("No distorted geometry"));
  assert.equal(compiled.estimatedCredits, 8);
});

test("evaluateFidelityGate and buildDefaultDesignContract produce honest scores and checks C1-C10", () => {
  const contract = buildDefaultDesignContract({
    hasUpload: true,
    hasSketch: false,
    vertical: "exterior",
    look: "Minimalist",
    fidelity: "photoreal",
  });
  assert.equal(contract.rung.rung, 5);
  assert.equal(contract.lockedPreserve, true);

  const gate = evaluateFidelityGate({
    geometryLock: 92,
    seedLocked: true,
    hasSource: true,
    disclosureRequired: true,
    idea: "Clean coastal timber pavilion at golden hour",
    scene3d: DEFAULT_SCENE3D,
    frame: DEFAULT_FRAME,
  });
  assert.equal(gate.checks.length, 10);
  assert.equal(gate.status, "verified");
  assert.ok(gate.overallScore >= 0.85);
  assert.ok(gate.disclosureLabel.includes("Virtually Staged"));
});

test("buildAtelierIterationCards fixes first-render bug where activeUrl wasn't in history yet", () => {
  const cards = buildAtelierIterationCards([], "data:image/jpeg;base64,/9j/firstplate");
  assert.equal(cards.length, 4);
  assert.equal(cards[0].isGenerated, true);
  assert.equal(cards[0].subtitle, "Selected");
  assert.equal(cards[0].tag, "Plate v1");
  assert.equal(cards[1].isGenerated, false);
});
