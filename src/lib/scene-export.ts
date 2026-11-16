import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import type { MeshMaterialAssignment } from "@/lib/solar-and-materials";

export type ExportedMaterialSummary = {
  objectId: string;
  materialName: string;
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  opacity: number;
  isOverride: boolean;
};

export type ExportSceneSummary = {
  presetName: string;
  meshCount: number;
  overrideCount: number;
  materials: ExportedMaterialSummary[];
};

function sanitizeMeshMaterialForGltf(
  sourceMat: THREE.Material,
  override?: MeshMaterialAssignment,
): THREE.Material {
  const cloned = sourceMat.clone();
  if (override && (cloned instanceof THREE.MeshStandardMaterial || cloned instanceof THREE.MeshPhysicalMaterial)) {
    cloned.name = override.materialLabel;
    cloned.color = new THREE.Color(override.hex);
    cloned.roughness = override.roughness;
    cloned.metalness = override.metalness;
    cloned.transparent = override.transparent;
    cloned.opacity = override.opacity;
    if (cloned instanceof THREE.MeshPhysicalMaterial) {
      cloned.clearcoat = override.clearcoat;
    }
    cloned.userData = {
      ...cloned.userData,
      orielMaterialId: override.materialId,
      orielMaterialLabel: override.materialLabel,
      orielOverride: true,
    };
    cloned.needsUpdate = true;
    return cloned;
  }

  if (override && !(cloned instanceof THREE.MeshStandardMaterial)) {
    const std = new THREE.MeshPhysicalMaterial({
      name: override.materialLabel,
      color: new THREE.Color(override.hex),
      roughness: override.roughness,
      metalness: override.metalness,
      clearcoat: override.clearcoat,
      transparent: override.transparent,
      opacity: override.opacity,
    });
    cloned.dispose();
    return std;
  }

  if (!cloned.name) {
    if (cloned instanceof THREE.MeshPhysicalMaterial && cloned.transparent) {
      cloned.name = "Oriel Architectural Glazing";
    } else if (cloned instanceof THREE.MeshStandardMaterial) {
      cloned.name = `Oriel PBR (#${cloned.color.getHexString()})`;
    }
  }
  return cloned;
}

export function buildCleanExportGroup(
  sourceGroup: THREE.Object3D,
  overrides: MeshMaterialAssignment[],
  presetName = "oriel-studio",
): {
  exportGroup: THREE.Group;
  summary: ExportSceneSummary;
  disposeExportGroup: () => void;
} {
  const overrideMap = new Map(overrides.map((item) => [item.objectId, item]));
  const exportGroup = new THREE.Group();
  exportGroup.name = `Oriel_${presetName.replace(/[^a-zA-Z0-9_-]+/g, "_")}`;
  exportGroup.position.copy(sourceGroup.position);
  exportGroup.rotation.copy(sourceGroup.rotation);
  exportGroup.scale.copy(sourceGroup.scale);

  const createdMaterials: THREE.Material[] = [];
  const createdGeometries: THREE.BufferGeometry[] = [];
  const summaries: ExportedMaterialSummary[] = [];

  sourceGroup.updateMatrixWorld(true);

  sourceGroup.traverse((obj) => {
    if (!(obj as THREE.Mesh).isMesh) return;
    const mesh = obj as THREE.Mesh;
    if (mesh.userData?.nonPickable) return;

    const objectId = String(mesh.userData?.objectId || mesh.name || `mesh-${summaries.length + 1}`);
    const override = overrideMap.get(objectId);
    const clonedGeo = mesh.geometry.clone();
    createdGeometries.push(clonedGeo);

    const srcMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const exportMat = srcMat
      ? sanitizeMeshMaterialForGltf(srcMat, override)
      : new THREE.MeshStandardMaterial({ name: "Default Material", color: 0xbcb9b2, roughness: 0.78, metalness: 0.04 });
    createdMaterials.push(exportMat);

    const exportMesh = new THREE.Mesh(clonedGeo, exportMat);
    exportMesh.name = objectId;
    exportMesh.position.copy(mesh.position);
    exportMesh.rotation.copy(mesh.rotation);
    exportMesh.scale.copy(mesh.scale);
    exportMesh.userData = {
      objectId,
      pickLabel: mesh.userData?.pickLabel ?? objectId,
      pbrApplied: Boolean(override),
      ...(override
        ? {
            materialId: override.materialId,
            materialLabel: override.materialLabel,
            roughness: override.roughness,
            metalness: override.metalness,
            clearcoat: override.clearcoat,
            opacity: override.opacity,
          }
        : {}),
    };
    exportGroup.add(exportMesh);

    const stdLike = exportMat as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
    summaries.push({
      objectId,
      materialName: exportMat.name || objectId,
      hex: stdLike.color ? `#${stdLike.color.getHexString()}` : "#bcb9b2",
      roughness: typeof stdLike.roughness === "number" ? Number(stdLike.roughness.toFixed(2)) : 0.75,
      metalness: typeof stdLike.metalness === "number" ? Number(stdLike.metalness.toFixed(2)) : 0,
      clearcoat:
        "clearcoat" in stdLike && typeof stdLike.clearcoat === "number"
          ? Number(stdLike.clearcoat.toFixed(2))
          : 0,
      opacity: typeof exportMat.opacity === "number" ? Number(exportMat.opacity.toFixed(2)) : 1,
      isOverride: Boolean(override),
    });
  });

  exportGroup.userData = {
    generator: "Oriel Archviz Studio",
    preset: presetName,
    meshCount: summaries.length,
    overrideCount: summaries.filter((s) => s.isOverride).length,
  };

  return {
    exportGroup,
    summary: {
      presetName,
      meshCount: summaries.length,
      overrideCount: summaries.filter((s) => s.isOverride).length,
      materials: summaries,
    },
    disposeExportGroup: () => {
      for (const g of createdGeometries) g.dispose();
      for (const m of createdMaterials) m.dispose();
    },
  };
}

export function collectExportSceneMetadata(
  sourceGroup: THREE.Object3D,
  overrides: MeshMaterialAssignment[],
  presetName = "oriel-studio",
): ExportSceneSummary {
  const { summary, disposeExportGroup } = buildCleanExportGroup(sourceGroup, overrides, presetName);
  disposeExportGroup();
  return summary;
}

export async function exportGroupToGltfAsync(
  sourceGroup: THREE.Object3D,
  overrides: MeshMaterialAssignment[],
  options: { binary: boolean; presetName?: string },
): Promise<{
  payload: ArrayBuffer | Record<string, unknown>;
  mimeType: string;
  extension: "glb" | "gltf";
  summary: ExportSceneSummary;
}> {
  const exporter = new GLTFExporter();
  const { exportGroup, summary, disposeExportGroup } = buildCleanExportGroup(
    sourceGroup,
    overrides,
    options.presetName ?? "oriel-studio",
  );

  try {
    const result = await new Promise<ArrayBuffer | Record<string, unknown>>((resolve, reject) => {
      exporter.parse(
        exportGroup,
        (output) => resolve(output as ArrayBuffer | Record<string, unknown>),
        (error) => reject(error instanceof Error ? error : new Error("GLTF export failed")),
        {
          binary: options.binary,
          onlyVisible: true,
          includeCustomExtensions: true,
        },
      );
    });

    return {
      payload: result,
      mimeType: options.binary ? "model/gltf-binary" : "model/gltf+json",
      extension: options.binary ? "glb" : "gltf",
      summary,
    };
  } finally {
    disposeExportGroup();
  }
}
