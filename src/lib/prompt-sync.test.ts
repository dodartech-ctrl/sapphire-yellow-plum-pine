import assert from "node:assert/strict";
import test from "node:test";
import { applyMidLayerPromptToIdea, getMidLayerPresetById } from "./archviz-dictionary";
import {
  buildInitialBuilderNotes,
  syncAdvancedToIdea,
  syncBuilderSlotToNotes,
  syncDesignFieldToIdea,
  syncDictionaryPresetToNotes,
  syncEngineFieldToIdea,
  syncExtraToIdea,
  syncPickToIdea,
  syncTagToIdea,
  syncTargetToIdea,
  syncWorkflowPresetToIdea,
  toggleDictionaryBlockInNotes,
  toggleKeywordPillInNotes,
} from "./prompt-sync";

test("syncPickToIdea adds, replaces in-place, and removes neutral values cleanly", () => {
  const step1 = syncPickToIdea("", "interior", "floor", "Travertine");
  assert.equal(step1, "Flooring: Travertine");

  const step2 = syncPickToIdea(`${step1}. Walls: Limewash`, "interior", "floor", "Hardwood");
  assert.equal(step2, "Flooring: Hardwood. Walls: Limewash");

  const step3 = syncPickToIdea(step2, "interior", "kitchen", "Unchanged");
  assert.equal(step3, "Flooring: Hardwood. Walls: Limewash");

  const withKitchen = syncPickToIdea(step2, "interior", "kitchen", "Stone island");
  assert.equal(withKitchen, "Flooring: Hardwood. Walls: Limewash. Kitchen: Stone island");

  const clearedKitchen = syncPickToIdea(withKitchen, "interior", "kitchen", "Unchanged");
  assert.equal(clearedKitchen, "Flooring: Hardwood. Walls: Limewash");
});

test("syncDesignFieldToIdea preserves user directive and mid-layer preset text", () => {
  const preset = getMidLayerPresetById("golden-relight")!;
  const withPreset = applyMidLayerPromptToIdea("Cantilever coastal villa", preset);
  const withLight = syncDesignFieldToIdea(withPreset, "light", "Evening");
  assert.match(withLight, /^Cantilever coastal villa\./);
  assert.ok(withLight.includes(preset.promptSnippet));
  assert.ok(withLight.endsWith("Light: Evening"));

  const swappedLight = syncDesignFieldToIdea(withLight, "light", "Daylight");
  assert.ok(!swappedLight.includes("Light: Evening"));
  assert.ok(swappedLight.includes("Light: Daylight"));
  assert.ok(swappedLight.includes(preset.promptSnippet));
});

test("syncTargetToIdea and syncTagToIdea update and toggle cleanly", () => {
  const targetStep = syncTargetToIdea("Custom courtyard brief", "floor");
  assert.equal(targetStep, "Custom courtyard brief. Target: Flooring");

  const wholeStep = syncTargetToIdea(targetStep, "whole");
  assert.equal(wholeStep, "Custom courtyard brief. Target: All Elements");

  const tagAdded = syncTagToIdea(wholeStep, "Biophilic", ["Luxury", "Biophilic"]);
  assert.equal(tagAdded, "Custom courtyard brief. Target: All Elements. #Biophilic");

  const tagRemoved = syncTagToIdea(tagAdded, "Biophilic", ["Luxury"]);
  assert.equal(tagRemoved, "Custom courtyard brief. Target: All Elements");
});

test("syncAdvancedToIdea and syncExtraToIdea sync labels and toggle extras", () => {
  const adv1 = syncAdvancedToIdea("", "light", "golden-hour");
  assert.equal(adv1, "Atmosphere: Golden hour");

  const adv2 = syncAdvancedToIdea(adv1, "season", "autumn");
  assert.equal(adv2, "Atmosphere: Golden hour. Season: Autumn");

  const advCleared = syncAdvancedToIdea(adv2, "season", "none");
  assert.equal(advCleared, "Atmosphere: Golden hour");

  const extraOn = syncExtraToIdea(advCleared, "microdetail", ["microdetail"]);
  assert.equal(extraOn, "Atmosphere: Golden hour. Microdetail");

  const extraOff = syncExtraToIdea(extraOn, "microdetail", []);
  assert.equal(extraOff, "Atmosphere: Golden hour");
});

test("syncWorkflowPresetToIdea and syncEngineFieldToIdea update prompt for engine pills without spamming numbers", () => {
  const wf = syncWorkflowPresetToIdea("Villa elevation", "sketch-to-render");
  assert.equal(wf, "Villa elevation. Workflow: Sketch → Render");

  const wf2 = syncWorkflowPresetToIdea(wf, "clay-to-render");
  assert.equal(wf2, "Villa elevation. Workflow: Clay → Photoreal");

  const ann = syncEngineFieldToIdea(wf2, "annotatorMode", "canny");
  assert.equal(ann, "Villa elevation. Workflow: Clay → Photoreal. Annotator: Canny Edge");

  const depthOn = syncEngineFieldToIdea(ann, "depthEnabled", true);
  assert.equal(depthOn, "Villa elevation. Workflow: Clay → Photoreal. Annotator: Canny Edge. Depth-Anything-V2 Lock");

  const unchangedSlider = syncEngineFieldToIdea(depthOn, "geometryLock", 92);
  assert.equal(unchangedSlider, depthOn);
});

test("Prompt Builder pill helpers inject, replace, and remove keywords in textarea notes", () => {
  const initial = buildInitialBuilderNotes(
    { name: "Japandi Warm Minimalism", promptSnippet: "Japandi architectural aesthetic, bespoke rift-cut white oak joinery, lime wash walls" },
    { name: "Blue-Hour Twilight", promptSnippet: "Blue hour twilight photography, deep rich cobalt blue sky, warm 2700K interior wash" },
    { name: "Serene Sanctuary", promptSnippet: "Mood of serene contemplative sanctuary, restorative stillness" },
    { name: "Eye-Level Two-Point Perspective", promptSnippet: "Eye-level two-point architectural perspective, 1.6-meter camera height" },
  );

  assert.ok(initial.includes("Style: Japandi Warm Minimalism (Japandi architectural aesthetic, bespoke rift-cut white oak joinery)"));
  assert.ok(initial.includes("Lighting: Blue-Hour Twilight"));
  assert.ok(initial.includes("Mood: Serene Sanctuary"));
  assert.ok(initial.includes("Lens: Eye-Level Two-Point Perspective"));

  const updatedStyle = syncBuilderSlotToNotes(initial, "style", {
    name: "Sculptural Brutalism",
    promptSnippet: "Sculptural brutalist architecture, textured board-formed architectural concrete",
  });
  assert.ok(!updatedStyle.includes("Japandi Warm Minimalism"));
  assert.ok(updatedStyle.includes("Style: Sculptural Brutalism"));
  assert.ok(updatedStyle.includes("Lighting: Blue-Hour Twilight"));

  const clearedStyle = syncBuilderSlotToNotes(updatedStyle, "style", null);
  assert.ok(!clearedStyle.includes("Style:"));
  assert.ok(clearedStyle.includes("Lighting: Blue-Hour Twilight"));

  const withScenario = syncDictionaryPresetToNotes(clearedStyle, "Material Study", ["Facade", "Limestone", "Overcast"]);
  assert.ok(withScenario.includes("Scenario: Material Study (Facade, Limestone, Overcast)"));

  const withBlock = toggleDictionaryBlockInNotes(withScenario, "Reflecting Pool", true);
  assert.ok(withBlock.includes("Reflecting Pool"));
  const removedBlock = toggleDictionaryBlockInNotes(withBlock, "Reflecting Pool", false);
  assert.ok(!removedBlock.includes("Reflecting Pool"));

  const toggledOn = toggleKeywordPillInNotes("Preserve mature pine trees", "28mm Tilt-Shift");
  assert.equal(toggledOn.active, true);
  assert.equal(toggledOn.notes, "Preserve mature pine trees. 28mm Tilt-Shift");

  const toggledOff = toggleKeywordPillInNotes(toggledOn.notes, "28mm Tilt-Shift");
  assert.equal(toggledOff.active, false);
  assert.equal(toggledOff.notes, "Preserve mature pine trees");
});
