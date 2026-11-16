import assert from "node:assert/strict";
import test from "node:test";
import * as THREE from "three";
import { getQueueItemVisualMeta } from "./archviz-suite";
import { createQueueItem } from "./engines";
import { buildCleanExportGroup, exportGroupToGltfAsync } from "./scene-export";
import { createAssignmentFromSwatch } from "./solar-and-materials";

if (typeof globalThis.FileReader === "undefined") {
  class NodeFileReader {
    result: ArrayBuffer | string | null = null;
    onloadend: (() => void) | null = null;
    onload: (() => void) | null = null;
    readAsArrayBuffer(blob: Blob) {
      void blob.arrayBuffer().then((buf) => {
        this.result = buf;
        this.onload?.();
        this.onloadend?.();
      });
    }
    readAsDataURL(blob: Blob) {
      void blob.arrayBuffer().then((buf) => {
        const b64 = Buffer.from(buf).toString("base64");
        this.result = `data:${blob.type || "application/octet-stream"};base64,${b64}`;
        this.onload?.();
        this.onloadend?.();
      });
    }
  }
  (globalThis as unknown as { FileReader: typeof NodeFileReader }).FileReader = NodeFileReader;
}

test("getQueueItemVisualMeta resolves thumbnails and real-time status bar progress for Pending, Processing, Completed, Failed", () => {
  const pendingItem = createQueueItem("Morning Atrium", "photoreal", "Daylight", {
    thumbnailUrl: "data:image/jpeg;base64,abc",
    status: "pending",
  });
  const pendingMeta = getQueueItemVisualMeta(pendingItem);
  assert.equal(pendingMeta.statusLabel, "Pending");
  assert.equal(pendingMeta.barWidthPct, 18);
  assert.equal(pendingMeta.thumbnail, "data:image/jpeg;base64,abc");

  const processingItem = { ...pendingItem, status: "processing" as const };
  const procMeta = getQueueItemVisualMeta(processingItem);
  assert.equal(procMeta.statusLabel, "Processing");
  assert.equal(procMeta.barWidthPct, 68);

  const failedItem = {
    ...pendingItem,
    status: "error" as const,
    errorMessage: "GPU memory limit reached",
  };
  const failedMeta = getQueueItemVisualMeta(failedItem);
  assert.equal(failedMeta.statusLabel, "Failed");
  assert.equal(failedMeta.barWidthPct, 100);
  assert.equal(failedMeta.statusHint, "GPU memory limit reached");

  const completedItem = {
    ...pendingItem,
    status: "completed" as const,
    url: "/viz/p01-pavilion-dusk.jpg",
    durationMs: 1420,
  };
  const doneMeta = getQueueItemVisualMeta(completedItem);
  assert.equal(doneMeta.statusLabel, "Completed");
  assert.equal(doneMeta.barWidthPct, 100);
  assert.equal(doneMeta.thumbnail, "/viz/p01-pavilion-dusk.jpg");
  assert.match(doneMeta.statusHint, /1\.42s/);
});

test("buildCleanExportGroup excludes nonPickable helpers and preserves applied PBR material configurations", () => {
  const group = new THREE.Group();
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xbcb9b2, roughness: 0.78, metalness: 0.04 }),
  );
  wall.userData.objectId = "core-wall";
  wall.userData.pickLabel = "North Core Wall";

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 0.1),
    new THREE.MeshPhysicalMaterial({ color: 0xd8ebe9, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.45 }),
  );
  glass.userData.objectId = "glazing-south";

  const helperShadow = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial());
  helperShadow.userData.nonPickable = true;

  group.add(wall, glass, helperShadow);

  const oakOverride = createAssignmentFromSwatch("core-wall", "North Core Wall", "fluted-oak");
  const glassOverride = createAssignmentFromSwatch("glazing-south", "South Glazing", "low-e-glass");
  assert.ok(oakOverride && glassOverride);
  oakOverride.roughness = 0.42;
  oakOverride.metalness = 0.12;

  const { exportGroup, summary, disposeExportGroup } = buildCleanExportGroup(
    group,
    [oakOverride, glassOverride],
    "pavilion",
  );

  try {
    assert.equal(summary.meshCount, 2);
    assert.equal(summary.overrideCount, 2);

    const exportedWall = exportGroup.getObjectByName("core-wall") as THREE.Mesh;
    const exportedGlass = exportGroup.getObjectByName("glazing-south") as THREE.Mesh;
    assert.ok(exportedWall);
    assert.ok(exportedGlass);

    const wallMat = exportedWall.material as THREE.MeshStandardMaterial;
    assert.equal(wallMat.name, "Oak");
    assert.equal(wallMat.roughness, 0.42);
    assert.equal(wallMat.metalness, 0.12);

    const glassMat = exportedGlass.material as THREE.MeshPhysicalMaterial;
    assert.equal(glassMat.name, "Glass");
    assert.equal(glassMat.transparent, true);
    assert.equal(glassMat.opacity, 0.44);
  } finally {
    disposeExportGroup();
    wall.geometry.dispose();
    glass.geometry.dispose();
    helperShadow.geometry.dispose();
  }
});

test("exportGroupToGltfAsync generates valid binary GLB and JSON GLTF outputs with PBR materials", async () => {
  const group = new THREE.Group();
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.4, 6),
    new THREE.MeshStandardMaterial({ color: 0xb0ada6, roughness: 0.85, metalness: 0.04 }),
  );
  slab.userData.objectId = "canopy-roof";
  group.add(slab);

  const oak = createAssignmentFromSwatch("canopy-roof", "Canopy Roof", "fluted-oak");
  assert.ok(oak);

  const glbOut = await exportGroupToGltfAsync(group, [oak], { binary: true, presetName: "pavilion" });
  assert.equal(glbOut.extension, "glb");
  assert.equal(glbOut.mimeType, "model/gltf-binary");
  assert.ok(glbOut.payload instanceof ArrayBuffer);
  const magic = new TextDecoder().decode(new Uint8Array(glbOut.payload.slice(0, 4)));
  assert.equal(magic, "glTF");
  assert.ok(glbOut.payload.byteLength > 200);

  const gltfOut = await exportGroupToGltfAsync(group, [oak], { binary: false, presetName: "pavilion" });
  assert.equal(gltfOut.extension, "gltf");
  assert.equal(gltfOut.mimeType, "model/gltf+json");
  const jsonDoc = gltfOut.payload as { materials?: Array<{ name?: string; pbrMetallicRoughness?: { roughnessFactor?: number } }> };
  assert.ok(Array.isArray(jsonDoc.materials) && jsonDoc.materials.length >= 1);
  assert.equal(jsonDoc.materials[0].name, "Oak");
  assert.equal(jsonDoc.materials[0].pbrMetallicRoughness?.roughnessFactor, oak.roughness);

  slab.geometry.dispose();
});
