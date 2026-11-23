import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildArchviz100AppliedPrompt,
  buildIntentLookAppliedPrompt,
  buildUploadedImageSystemPrefix,
  buildZuke119AppliedPrompt,
  resolveSmartPlaceholders,
  rewritePromptForUploadedImage,
  stripGenerationLeadVerb,
} from "@/lib/preset-transform";
import { ARCHVIZ_PRESETS_100, INTENT_LOOKS_40, PRESETS_200 } from "@/lib/presets-catalog";
import { ZUKE_VIZ_PROMPTS_119 } from "@/lib/zuke-viz-library";

const baseCtx = {
  hasUpload: true,
  design: {
    vertical: "interior" as const,
    look: "Modern",
    light: "Golden hour" as const,
    mood: "Warm" as const,
  },
};

describe("preset-transform upload-anchored rewriting", () => {
  it("resolves all bracket placeholders cleanly with zero raw brackets left", () => {
    const raw = "Visualize a [room size] living room with [style], [material], and [palette] in [lighting].";
    const resolved = resolveSmartPlaceholders(raw, {}, baseCtx);
    assert.ok(!resolved.includes("[") && !resolved.includes("]"), `Raw bracket leaked: ${resolved}`);
    assert.match(resolved, /existing/i);
    assert.match(resolved, /modern/i);
  });

  it("strips generation lead verbs cleanly", () => {
    assert.equal(
      stripGenerationLeadVerb("Visualize a Scandinavian living room with oak floors"),
      "Scandinavian living room with oak floors",
    );
    assert.equal(
      stripGenerationLeadVerb("Create an ultra-modern concrete pavilion"),
      "ultra-modern concrete pavilion",
    );
  });

  it("rewrites every ZUKE 119 prompt cleanly for uploaded image with zero raw brackets", () => {
    for (const item of ZUKE_VIZ_PROMPTS_119) {
      const applied = buildZuke119AppliedPrompt(item, {}, baseCtx);
      assert.ok(!applied.includes("[") && !applied.includes("]"), `Unresolved bracket in ${item.id}: ${applied}`);
      assert.match(applied, /edit the uploaded reference image directly in place/i);
    }
  });

  it("rewrites ArchViz 100 cards to transform uploaded image in place", () => {
    for (const card of ARCHVIZ_PRESETS_100.slice(0, 12)) {
      const applied = buildArchviz100AppliedPrompt(card, baseCtx);
      assert.ok(!applied.includes("[") && !applied.includes("]"), `Unresolved bracket in ${card.id}: ${applied}`);
      assert.match(applied, /do not create a new room/i);
      assert.ok(applied.includes(card.title));
    }
  });

  it("rewrites 40 Intent Looks to apply onto uploaded photo without inventing a new scene", () => {
    for (const look of INTENT_LOOKS_40.slice(0, 10)) {
      const applied = buildIntentLookAppliedPrompt(look, PRESETS_200, baseCtx);
      assert.match(applied, /edit the uploaded reference image directly in place/i);
      assert.ok(applied.includes(look.name));
    }
  });

  it("is idempotent when rewritePromptForUploadedImage is called twice", () => {
    const once = rewritePromptForUploadedImage("Visualize a warm minimalist room with oak floors", baseCtx);
    const twice = rewritePromptForUploadedImage(once, baseCtx);
    assert.equal(twice, once);
  });

  it("builds a strict server image-to-image system prefix", () => {
    const prefix = buildUploadedImageSystemPrefix(92);
    assert.match(prefix, /Geometry & Camera Lock 92%/);
    assert.match(prefix, /NEVER generate a new base image/i);
    assert.match(prefix, /pixel-for-pixel/i);
  });
});
