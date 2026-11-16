import assert from "node:assert/strict";
import test from "node:test";
import { buildMaterialScheduleRows } from "./archviz-suite";
import {
  BRIEF_TEMPLATES,
  BRIEF_TEMPLATE_CATEGORIES,
  buildTemplateCompiledNotes,
  filterBriefTemplates,
  resolveBriefTemplateSlots,
} from "./brief-templates";
import { synthesizeVisionDocument } from "./builder-data";
import {
  buildClientPdfVisualConfigRows,
  buildPdfFilename,
  generateClientBriefPdf,
} from "./brief-pdf";
import { DEFAULT_ENGINE, DEFAULT_SCENE3D, sanitizeEngineState, sanitizeScene3DState } from "./engines";
import { DEFAULT_FRAME, sanitizeFrame } from "./frame";
import { DEFAULT_DESIGN, sanitizeDesign } from "./properties";

test("BRIEF_TEMPLATES includes Residential Modern, Commercial Minimalist, Landscape Urbanism and valid block refs", () => {
  const names = BRIEF_TEMPLATES.map((t) => t.name);
  assert.ok(names.includes("Residential Modern"));
  assert.ok(names.includes("Commercial Minimalist"));
  assert.ok(names.includes("Landscape Urbanism"));
  assert.ok(BRIEF_TEMPLATES.length >= 6);
  assert.ok(BRIEF_TEMPLATE_CATEGORIES.includes("All"));

  for (const tpl of BRIEF_TEMPLATES) {
    const slots = resolveBriefTemplateSlots(tpl);
    assert.ok(slots.style, `Missing style block for ${tpl.id}`);
    assert.ok(slots.lighting, `Missing lighting block for ${tpl.id}`);
    assert.ok(slots.mood, `Missing mood block for ${tpl.id}`);
    assert.ok(slots.camera, `Missing camera block for ${tpl.id}`);

    const nextDesign = sanitizeDesign({ ...DEFAULT_DESIGN, ...tpl.designPatch });
    const nextEngine = sanitizeEngineState({ ...DEFAULT_ENGINE, ...tpl.enginePatch });
    const nextScene = sanitizeScene3DState({ ...DEFAULT_SCENE3D, ...tpl.scene3dPatch });
    const nextFrame = sanitizeFrame({ ...DEFAULT_FRAME, ratio: tpl.frameRatio, resolution: tpl.frameResolution });

    assert.equal(nextDesign.vertical, tpl.designPatch.vertical);
    assert.equal(nextEngine.workflowPreset, tpl.enginePatch.workflowPreset);
    assert.equal(nextScene.preset, tpl.scene3dPatch.preset);
    assert.equal(nextFrame.ratio, tpl.frameRatio);

    const compiledNotes = buildTemplateCompiledNotes(tpl);
    assert.ok(compiledNotes.length > 40);
  }
});

test("filterBriefTemplates filters accurately by category and search query", () => {
  const commercial = filterBriefTemplates("Commercial");
  assert.ok(commercial.some((t) => t.name === "Commercial Minimalist"));
  assert.ok(commercial.every((t) => t.category === "Commercial"));

  const urbanQuery = filterBriefTemplates("All", "bioswales");
  assert.equal(urbanQuery.length, 1);
  assert.equal(urbanQuery[0].id, "landscape-urbanism");
});

test("buildClientPdfVisualConfigRows formats Design, Engine, 3D Rig, and Frame settings", () => {
  const tpl = BRIEF_TEMPLATES.find((t) => t.id === "commercial-minimalist")!;
  const design = sanitizeDesign({ ...DEFAULT_DESIGN, ...tpl.designPatch });
  const engine = sanitizeEngineState({ ...DEFAULT_ENGINE, ...tpl.enginePatch });
  const scene3d = sanitizeScene3DState({ ...DEFAULT_SCENE3D, ...tpl.scene3dPatch });
  const frame = sanitizeFrame({ ...DEFAULT_FRAME, ratio: tpl.frameRatio, resolution: tpl.frameResolution });

  const rows = buildClientPdfVisualConfigRows(design, engine, scene3d, frame);
  assert.ok(rows.length >= 8);
  assert.ok(rows.some((r) => r.value.includes("EXTERIOR") && r.value.includes("Civic")));
  assert.ok(rows.some((r) => r.value.includes("35mm Lens")));
  assert.ok(rows.some((r) => r.value.includes("16:9") && r.value.includes("2K")));
});

test("generateClientBriefPdf emits a valid multi-section PDF document containing brief and visual settings", () => {
  const tpl = BRIEF_TEMPLATES.find((t) => t.id === "residential-modern")!;
  const slots = resolveBriefTemplateSlots(tpl);
  const notes = buildTemplateCompiledNotes(tpl);
  const visionDoc = synthesizeVisionDocument(slots.style, slots.lighting, slots.mood, slots.camera, notes);
  const design = sanitizeDesign({ ...DEFAULT_DESIGN, ...tpl.designPatch });
  const engine = sanitizeEngineState({ ...DEFAULT_ENGINE, ...tpl.enginePatch });
  const scene3d = sanitizeScene3DState({ ...DEFAULT_SCENE3D, ...tpl.scene3dPatch });
  const frame = sanitizeFrame({ ...DEFAULT_FRAME, ratio: tpl.frameRatio, resolution: tpl.frameResolution });
  const schedule = buildMaterialScheduleRows(design, engine, scene3d);

  const result = generateClientBriefPdf({
    visionDoc,
    design,
    engine,
    scene3d,
    frame,
    schedule,
    dictionarySummary: {
      presetId: tpl.dictionaryPresetId,
      blockCount: tpl.dictionaryBlocks.length,
      text: "Goal: Modern residence architectural visualization",
      warningsCount: 0,
    },
    activeTemplateName: tpl.name,
    meta: {
      projectName: "Horizon Cliff Residence",
      clientName: "Kestrel Development Group",
      preparedBy: "Oriel Studio Architects",
      phase: "Client Design Review",
      includeVisualSettings: true,
      includeBimSchedule: true,
      includePromptAppendix: true,
    },
  });

  assert.equal(buildPdfFilename("Horizon Cliff Residence"), "horizon-cliff-residence-presentation.pdf");
  assert.ok(result.byteLength > 3000, `Expected PDF > 3KB, got ${result.byteLength}`);
  assert.ok(result.pageCount >= 1);

  const pdfText = Buffer.from(result.arrayBuffer).toString("latin1");
  assert.ok(pdfText.startsWith("%PDF-"), "Expected valid %PDF- header");
  assert.ok(pdfText.includes("Horizon Cliff Residence"));
  assert.ok(pdfText.includes("Kestrel Development Group"));
  assert.ok(pdfText.includes("Visual Configuration Settings"));
  assert.ok(pdfText.includes("BIM Material"));
});
