import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ARCHVIZ_PRESETS,
  DICTIONARY_BLOCKS,
  MID_LAYER_PRESETS,
  appendSuggestionToIdea,
  applyMidLayerPromptToIdea,
  composeDictionarySelection,
  exportSavedPromptsJson,
  getDictionaryBlock,
  getMidLayerPresetById,
  importSavedPromptsJson,
} from "./archviz-dictionary.ts";

describe("ARCHVIZ Prompt Dictionary & Mid-Layer Presets", () => {
  it("loads all 127 dictionary blocks and 46 presets with valid references", () => {
    assert.equal(DICTIONARY_BLOCKS.length, 127);
    assert.equal(ARCHVIZ_PRESETS.length, 46);
    for (const preset of ARCHVIZ_PRESETS) {
      assert.ok(preset.blocks.length > 0, `Preset ${preset.id} has blocks`);
      for (const bid of preset.blocks) {
        assert.ok(getDictionaryBlock(bid), `Preset ${preset.id} references unknown block ${bid}`);
      }
    }
    for (const mlp of MID_LAYER_PRESETS) {
      assert.ok(mlp.blockIds.length > 0, `Mid-layer preset ${mlp.id} has blocks`);
      assert.ok(mlp.promptSnippet.length > 10, `Mid-layer preset ${mlp.id} has promptSnippet`);
      for (const bid of mlp.blockIds) {
        assert.ok(getDictionaryBlock(bid), `Mid-layer preset ${mlp.id} references unknown block ${bid}`);
      }
    }
  });

  it("interpolates {{key}} parameters and preserves section ordering", () => {
    const composed = composeDictionarySelection(
      ["goal", "brick", "add-people", "qc"],
      {
        brick: { scale: "hand-molded elongated brick" },
        "add-people": { count: "four", activity: "entering the timber portico" },
      },
      "Hold the existing skylight mullions.",
    );
    assert.match(composed.text, /hand-molded elongated brick/);
    assert.match(composed.text, /Add four new people/);
    assert.match(composed.text, /entering the timber portico/);
    assert.match(composed.text, /STUDIO DIRECTIVES\nHold the existing skylight mullions\./);
    assert.ok(composed.text.indexOf("GOAL") < composed.text.indexOf("MATERIAL / SUBJECT"));
    assert.ok(composed.text.indexOf("MATERIAL / SUBJECT") < composed.text.indexOf("QC"));
  });

  it("detects mutual block conflicts and surfaces clear warnings", () => {
    const composed = composeDictionarySelection(["goal", "overcast", "night", "facade", "polish"]);
    assert.ok(composed.warnings.length >= 2);
    const hasLightConflict = composed.warnings.some((w) => (w.a === "overcast" && w.b === "night") || (w.a === "night" && w.b === "overcast"));
    const hasScopeConflict = composed.warnings.some((w) => (w.a === "facade" && w.b === "polish") || (w.a === "polish" && w.b === "facade"));
    assert.equal(hasLightConflict, true);
    assert.equal(hasScopeConflict, true);
  });

  it("syncs Mid-Layer Preset snippets and suggestion pills cleanly into the prompt box", () => {
    const facade = getMidLayerPresetById("facade-swap")!;
    const night = getMidLayerPresetById("night-glow")!;

    const fromEmpty = applyMidLayerPromptToIdea("", facade);
    assert.equal(fromEmpty, facade.promptSnippet);

    const withUser = applyMidLayerPromptToIdea("Warm cedar pavilion over reflecting pond", facade);
    assert.ok(withUser.startsWith("Warm cedar pavilion over reflecting pond."));
    assert.ok(withUser.includes(facade.promptSnippet));

    const switched = applyMidLayerPromptToIdea(withUser, night);
    assert.ok(switched.includes("Warm cedar pavilion over reflecting pond"));
    assert.equal(switched.includes(facade.promptSnippet), false);
    assert.ok(switched.includes(night.promptSnippet));

    const cleared = applyMidLayerPromptToIdea(switched, null);
    assert.equal(cleared, "Warm cedar pavilion over reflecting pond");

    const appended = appendSuggestionToIdea(fromEmpty, "Warm the lighting");
    assert.ok(appended.includes(facade.promptSnippet));
    assert.ok(appended.includes("Warm the lighting"));
  });

  it("exports and imports Saved Prompts JSON cleanly in schema_version 1 format", () => {
    const composed = composeDictionarySelection(["goal", "source", "geometry", "brick"]);
    const entry = {
      id: "saved-brick-study",
      name: "Brick Facade Study",
      scenario: "facade",
      text: composed.text,
      blockIds: ["goal", "source", "geometry", "brick"],
      parameters: { brick: { scale: "215x65mm brick" } },
      createdAt: "2026-11-13T10:00:00.000Z",
    };
    const json = exportSavedPromptsJson([entry]);
    const parsed = JSON.parse(json) as { schema_version: number; prompts: unknown[] };
    assert.equal(parsed.schema_version, 1);
    assert.equal(parsed.prompts.length, 1);

    const importedFresh = importSavedPromptsJson(json, []);
    assert.equal(importedFresh.added, 1);
    assert.equal(importedFresh.skipped, 0);

    const importedDup = importSavedPromptsJson(json, [entry]);
    assert.equal(importedDup.added, 0);
    assert.equal(importedDup.skipped, 1);
  });
});
