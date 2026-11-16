import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_REFERENCE_INFLUENCE,
  NODE_CATALOG,
  WORKFLOW_TEMPLATES,
  autoLayoutGraph,
  buildEnvironmentDirective,
  compileWorkflowToComfyJson,
  createNodeInstance,
  isPortCompatible,
  matchesNodeSearch,
  validateWorkflowGraph,
} from "./node-studio";

test("NODE_CATALOG contains all 45 PRD nodes across the 9 categories", () => {
  assert.equal(NODE_CATALOG.length, 45);

  const uniqueTypes = new Set(NODE_CATALOG.map((n) => n.type));
  assert.equal(uniqueTypes.size, 45);

  const counts = NODE_CATALOG.reduce<Record<string, number>>((acc, node) => {
    acc[node.category] = (acc[node.category] ?? 0) + 1;
    return acc;
  }, {});

  assert.deepEqual(counts, {
    input: 5,
    segmentation: 5,
    editing: 6,
    conditioning: 6,
    architecture: 6,
    environment: 5,
    generation: 5,
    video: 4,
    output: 3,
  });
});

test("port compatibility enforces typed connections and architectural coercions", () => {
  assert.equal(isPortCompatible("image", "image"), true);
  assert.equal(isPortCompatible("mask", "mask"), true);
  assert.equal(isPortCompatible("scene3d", "image"), true);
  assert.equal(isPortCompatible("scene3d", "conditioning"), true);
  assert.equal(isPortCompatible("environment", "prompt"), true);
  assert.equal(isPortCompatible("mask", "video"), false);
  assert.equal(isPortCompatible("prompt", "image"), false);
});

test("all 5 prebuilt WORKFLOW_TEMPLATES validate cleanly under 500ms", () => {
  assert.equal(WORKFLOW_TEMPLATES.length, 5);
  for (const tpl of WORKFLOW_TEMPLATES) {
    const res = validateWorkflowGraph(tpl.nodes, tpl.edges);
    assert.equal(res.valid, true, `Expected template "${tpl.name}" to validate: ${res.issues.map((i) => i.message).join("; ")}`);
    assert.equal(res.hasCycles, false);
    assert.ok(res.durationMs < 500);
    assert.equal(res.executionOrder.length, tpl.nodes.length);
  }
});

test("validateWorkflowGraph catches cycles, missing required inputs, and bad port types", () => {
  const n1 = createNodeInstance("input.load_image", { x: 0, y: 0 }, "a");
  const n2 = createNodeInstance("editing.material_replace", { x: 200, y: 0 }, "b");
  const n3 = createNodeInstance("segmentation.text_select", { x: 400, y: 0 }, "c");

  // Missing required mask on material_replace
  const missingReq = validateWorkflowGraph([n1, n2], [
    { id: "e1", sourceNodeId: "a", sourcePortId: "image", targetNodeId: "b", targetPortId: "image" },
  ]);
  assert.equal(missingReq.valid, false);
  assert.ok(missingReq.issues.some((i) => i.message.includes("Mask")));

  // Cycle between b -> c -> b (using valid port types mask/image)
  const cyclic = validateWorkflowGraph([n1, n2, n3], [
    { id: "e1", sourceNodeId: "a", sourcePortId: "image", targetNodeId: "b", targetPortId: "image" },
    { id: "e2", sourceNodeId: "b", sourcePortId: "image", targetNodeId: "c", targetPortId: "image" },
    { id: "e3", sourceNodeId: "c", sourcePortId: "mask", targetNodeId: "b", targetPortId: "mask" },
  ]);
  assert.equal(cyclic.valid, false);
  assert.equal(cyclic.hasCycles, true);

  // Incompatible port types (image -> mask)
  const badTypes = validateWorkflowGraph([n1, n2], [
    { id: "e-bad", sourceNodeId: "a", sourcePortId: "image", targetNodeId: "b", targetPortId: "mask" },
  ]);
  assert.equal(badTypes.valid, false);
  assert.ok(badTypes.issues.some((i) => i.message.includes("Incompatible")));
});

test("compileWorkflowToComfyJson emits valid ComfyUI prompt graph links", () => {
  const mvp = WORKFLOW_TEMPLATES[0];
  const comfy = compileWorkflowToComfyJson(mvp) as {
    valid: boolean;
    prompt: Record<string, { class_type: string; inputs: Record<string, unknown> }>;
  };
  assert.equal(comfy.valid, true);
  const values = Object.values(comfy.prompt);
  assert.equal(values.length, mvp.nodes.length);
  const hasSam = values.some((v) => v.class_type === "GroundingDinoSAM2Segment");
  const hasMatReplace = values.some((v) => v.class_type === "MaterialReplaceConditioned");
  assert.equal(hasSam, true);
  assert.equal(hasMatReplace, true);
});

test("buildEnvironmentDirective distinguishes illustrative vs 3D-backed lighting", () => {
  const imgOnly = buildEnvironmentDirective({
    weather: "Overcast",
    timeOfDay: "Golden Hour",
    has3DSceneInput: false,
  });
  assert.equal(imgOnly.isIllustrative, true);
  assert.ok(imgOnly.directive.includes("Illustrative AI Atmosphere Approximation"));

  const backed3d = buildEnvironmentDirective({
    weather: "Clear",
    timeOfDay: "Golden Hour",
    azimuth: 145,
    has3DSceneInput: true,
  });
  assert.equal(backed3d.isIllustrative, false);
  assert.ok(backed3d.directive.includes("3D-Verified Solar"));
  assert.equal(DEFAULT_REFERENCE_INFLUENCE.geometry, 90);
});

test("autoLayoutGraph lays out nodes strictly left-to-right by topological depth", () => {
  const mvp = WORKFLOW_TEMPLATES[0];
  const laid = autoLayoutGraph(mvp.nodes, mvp.edges);
  const posById = new Map(laid.map((n) => [n.id, n.position]));
  assert.ok((posById.get("n-img")?.x ?? 0) < (posById.get("n-sam")?.x ?? 0));
  assert.ok((posById.get("n-sam")?.x ?? 0) < (posById.get("n-refine")?.x ?? 0));
  assert.ok((posById.get("n-refine")?.x ?? 0) < (posById.get("n-replace")?.x ?? 0));
  assert.ok((posById.get("n-replace")?.x ?? 0) < (posById.get("n-compare")?.x ?? 0));
});

test("matchesNodeSearch finds architectural workflow aliases cleanly", () => {
  const queries = [
    ["Image Load", "input.load_image"],
    ["ControlNet Processor", "conditioning.canny_edge"],
    ["Prompt Modifier", "input.text_prompt"],
    ["Render Engine", "generation.image_to_image"],
    ["Grounded-SAM 2", "segmentation.text_select"],
    ["Click-to-Mask", "segmentation.point_segment"],
  ] as const;

  for (const [q, expectedType] of queries) {
    const hits = NODE_CATALOG.filter((spec) => matchesNodeSearch(spec, q));
    assert.ok(
      hits.some((s) => s.type === expectedType),
      `Expected search "${q}" to match ${expectedType}`,
    );
  }
});
