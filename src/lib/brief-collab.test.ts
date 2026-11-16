import assert from "node:assert/strict";
import test from "node:test";
import {
  COLLAB_PARAMETER_TARGETS,
  buildBriefShareUrl,
  buildSharedBriefSnapshot,
  extractParameterDisplayValues,
  getCollabParameterTarget,
  isValidCollabParameterKey,
  normalizeAuthorName,
  normalizeCommentBody,
  sanitizeShareId,
  summarizeCommentsByParameter,
  type BriefCommentRecord,
} from "./brief-collab";
import { ARCHITECTURAL_STYLES, LIGHTING_CONDITIONS } from "./builder-data";
import { DEFAULT_ENGINE, DEFAULT_SCENE3D } from "./engines";
import { DEFAULT_FRAME } from "./frame";
import { DEFAULT_DESIGN } from "./properties";

test("extractParameterDisplayValues maps all 10 parameter targets accurately", () => {
  const snapshot = buildSharedBriefSnapshot({
    title: "Alpine Glass Sanctuary",
    subtitle: "Client Review Draft",
    selectedStyle: ARCHITECTURAL_STYLES[0] ?? null,
    selectedLighting: LIGHTING_CONDITIONS[0] ?? null,
    selectedMood: null,
    selectedCamera: null,
    customNotes: "Board-formed concrete plinth and cantilevered timber eaves.",
    activeDictPresetId: "facade",
    dictionaryBlocks: ["goal", "source"],
    dictionaryParams: {},
    activeTemplateId: "residential-modern",
    design: DEFAULT_DESIGN,
    engine: { ...DEFAULT_ENGINE, workflowPreset: "sketch-to-render", facadeTypology: "Minimalist Glass" },
    scene3d: { ...DEFAULT_SCENE3D, primaryMaterial: "travertine", focalLength: 35 },
    frame: { ratio: "16:9", resolution: "2k" },
    synthesizedPrompt: "Test prompt",
    bimSchedule: [],
  });

  const values = extractParameterDisplayValues(snapshot);
  assert.equal(values.style, ARCHITECTURAL_STYLES[0]?.name);
  assert.equal(values.lighting, LIGHTING_CONDITIONS[0]?.name);
  assert.equal(values.mood, "Unassigned");
  assert.equal(values.workflowPreset, "sketch-to-render");
  assert.equal(values.facadeTypology, "Minimalist Glass");
  assert.equal(values.primaryMaterial, "travertine");
  assert.equal(values.focalLength, "35mm");
  assert.equal(values.frameRatio, "16:9 · 2k");
  assert.ok(values.directives.includes("Board-formed concrete plinth"));
});

test("summarizeCommentsByParameter counts open and resolved comments per parameter", () => {
  const comments: BriefCommentRecord[] = [
    {
      id: "c1",
      shareId: "brf-123",
      parameterKey: "lighting",
      parameterLabel: "Lighting Condition",
      parameterValue: "Golden Hour",
      authorName: "Maya",
      authorRole: "Lighting Director",
      body: "Soften sun azimuth by 15 degrees",
      status: "open",
      createdAt: "2026-11-16T00:00:00.000Z",
    },
    {
      id: "c2",
      shareId: "brf-123",
      parameterKey: "lighting",
      parameterLabel: "Lighting Condition",
      parameterValue: "Golden Hour",
      authorName: "Liam",
      authorRole: "Lead Architect",
      body: "Confirmed 2700K interior warmth",
      status: "resolved",
      createdAt: "2026-11-16T00:05:00.000Z",
    },
    {
      id: "c3",
      shareId: "brf-123",
      parameterKey: "focalLength",
      parameterLabel: "Optics / Focal Length",
      parameterValue: "24mm",
      authorName: "Elena",
      authorRole: "Client Reviewer",
      body: "Switch to 35mm to avoid foreground stretch",
      status: "open",
      createdAt: "2026-11-16T00:10:00.000Z",
    },
  ];

  const summary = summarizeCommentsByParameter(comments);
  assert.equal(Object.keys(summary).length, COLLAB_PARAMETER_TARGETS.length);
  assert.deepEqual(summary.lighting, { open: 1, resolved: 1, total: 2 });
  assert.deepEqual(summary.focalLength, { open: 1, resolved: 0, total: 1 });
  assert.deepEqual(summary.style, { open: 0, resolved: 0, total: 0 });
});

test("share ID, author, and parameter validation helpers sanitize inputs", () => {
  assert.equal(sanitizeShareId("brf-ab12_XY!?/"), "brf-ab12_XY");
  assert.equal(
    buildBriefShareUrl("https://oriel.studio/", "brf-abc123"),
    "https://oriel.studio/builder?share=brf-abc123",
  );
  assert.equal(normalizeAuthorName("   "), "Studio Collaborator");
  assert.equal(normalizeAuthorName("  Ava   Chen "), "Ava Chen");
  assert.equal(normalizeCommentBody("  Check cornice detail \r\n "), "Check cornice detail");
  assert.equal(isValidCollabParameterKey("facadeTypology"), true);
  assert.equal(isValidCollabParameterKey("unknownKey"), false);
  assert.equal(getCollabParameterTarget("focalLength").label, "Optics / Focal Length");
  assert.deepEqual(DEFAULT_FRAME.ratio.length > 0, true);
});
