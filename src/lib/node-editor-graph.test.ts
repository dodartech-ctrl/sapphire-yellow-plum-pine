import assert from "node:assert/strict";
import test from "node:test";
import {
  EDITOR_NODE_SPECS,
  EDITOR_NODE_WIDTH,
  buildSvgLineData,
  canConnectEditorPorts,
  createDefaultEditorGraph,
  getEditorPortCoords,
  validateEditorGraph,
} from "./node-editor-graph";

test("node-editor-graph pure DAG and SVG geometry", async (t) => {
  await t.test("default architectural workflow includes Image Input, ControlNet Config, and Render Engine", () => {
    const graph = createDefaultEditorGraph();
    const kinds = new Set(graph.nodes.map((n) => n.kind));
    assert.equal(kinds.has("image-input"), true);
    assert.equal(kinds.has("controlnet-config"), true);
    assert.equal(kinds.has("prompt-modifier"), true);
    assert.equal(kinds.has("render-engine"), true);

    const check = validateEditorGraph(graph.nodes, graph.connections);
    assert.equal(check.valid, true);
    assert.equal(check.hasCycles, false);
    assert.equal(check.order.length, graph.nodes.length);
  });

  await t.test("computes SVG line coordinates and curves between output and input ports", () => {
    const graph = createDefaultEditorGraph();
    const imgNode = graph.nodes[0];
    const reNode = graph.nodes[3];

    const outPt = getEditorPortCoords(imgNode, "output", "image");
    const inPt = getEditorPortCoords(reNode, "input", "image");

    assert.equal(outPt.x, imgNode.x + EDITOR_NODE_WIDTH);
    assert.equal(inPt.x, reNode.x);

    const line = buildSvgLineData(outPt.x, outPt.y, inPt.x, inPt.y);
    assert.equal(line.x1, outPt.x);
    assert.equal(line.x2, inPt.x);
    assert.ok(line.pathD.startsWith(`M ${outPt.x} ${outPt.y}`));
  });

  await t.test("enforces port compatibility and flags cycles or missing required inputs", () => {
    assert.equal(canConnectEditorPorts("image", "image"), true);
    assert.equal(canConnectEditorPorts("render", "image"), true);
    assert.equal(canConnectEditorPorts("prompt", "mask"), false);

    const reOnly = {
      id: "re",
      kind: "render-engine" as const,
      title: EDITOR_NODE_SPECS["render-engine"].title,
      x: 100,
      y: 100,
      config: {},
    };
    const missingReq = validateEditorGraph([reOnly], []);
    assert.equal(missingReq.valid, false);
    assert.ok(missingReq.issues.some((m) => m.includes("Base Image")));
  });
});
