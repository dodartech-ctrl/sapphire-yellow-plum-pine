import * as THREE from "three";
import type { CameraPreset3D, Scene3DMaterial, Scene3DPreset } from "@/lib/engines";

export const MATERIAL_SPECS: Record<Scene3DMaterial, { color: number; roughness: number; metalness: number }> = {
  concrete: { color: 0xbcb9b2, roughness: 0.78, metalness: 0.04 },
  timber: { color: 0xb68557, roughness: 0.68, metalness: 0.02 },
  travertine: { color: 0xe0d4be, roughness: 0.62, metalness: 0.03 },
  brick: { color: 0x9b5a47, roughness: 0.84, metalness: 0.02 },
};

export const CAMERA_VIEWS: Record<CameraPreset3D, { pos: [number, number, number]; target: [number, number, number] }> = {
  eye: { pos: [12.5, 2.1, 13.5], target: [0, 2.0, 0] },
  oblique: { pos: [14.5, 6.4, 14.5], target: [0, 1.8, 0] },
  aerial: { pos: [18.5, 16.5, 18.5], target: [0, 1.2, 0] },
  detail: { pos: [6.4, 2.4, 7.2], target: [1.5, 1.9, 1.0] },
};

export type SharedSceneMaterials = {
  primaryMat: THREE.MeshStandardMaterial;
  glassMat: THREE.MeshPhysicalMaterial;
  darkTrimMat: THREE.MeshStandardMaterial;
  timberMat: THREE.MeshStandardMaterial;
  waterMat: THREE.MeshStandardMaterial;
  plinthMat: THREE.MeshStandardMaterial;
  interiorGlowMat: THREE.MeshStandardMaterial;
  groundMat: THREE.MeshStandardMaterial;
  trunkMat: THREE.MeshStandardMaterial;
  leafMat: THREE.MeshStandardMaterial;
  contactShadowMat: THREE.MeshBasicMaterial;
  textures: THREE.Texture[];
};

export function makeArchitecturalBumpTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "rgba(52,52,52,0.48)";
    ctx.lineWidth = 1.5;
    for (let y = 0; y <= 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(96,96,96,0.28)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 256; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let i = 0; i < 900; i++) {
      const x = (i * 73) % 256;
      const y = (i * 139) % 256;
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
      ctx.fillRect(x, y, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function makeTimberBumpTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#828282";
    ctx.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 12) {
      ctx.fillStyle = (x / 12) % 2 === 0 ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
      ctx.fillRect(x, 0, 10, 256);
    }
    for (let i = 0; i < 360; i++) {
      const x = (i * 29) % 256;
      const y = (i * 47) % 256;
      ctx.fillStyle = "rgba(35,35,35,0.14)";
      ctx.fillRect(x, y, 1, 18);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function makeContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 126);
    grad.addColorStop(0, "rgba(18,15,12,0.68)");
    grad.addColorStop(0.55, "rgba(18,15,12,0.28)");
    grad.addColorStop(1, "rgba(18,15,12,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(canvas);
}

export function createSharedSceneMaterials(
  initialMaterial: Scene3DMaterial,
  maxAnisotropy: number,
): SharedSceneMaterials {
  const bumpTex = makeArchitecturalBumpTexture(maxAnisotropy);
  const timberTex = makeTimberBumpTexture(maxAnisotropy);
  const contactShadowTex = makeContactShadowTexture();

  const matSpec = MATERIAL_SPECS[initialMaterial];
  const primaryMat = new THREE.MeshStandardMaterial({
    color: matSpec.color,
    roughness: matSpec.roughness,
    metalness: matSpec.metalness,
    bumpMap: bumpTex,
    bumpScale: 0.032,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xd8ebe9,
    roughness: 0.08,
    metalness: 0.1,
    transparent: true,
    opacity: 0.46,
    reflectivity: 0.92,
    envMapIntensity: 1.35,
  });

  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x2a2623,
    roughness: 0.34,
    metalness: 0.62,
  });

  const timberMat = new THREE.MeshStandardMaterial({
    color: 0xa67449,
    roughness: 0.64,
    metalness: 0.02,
    bumpMap: timberTex,
    bumpScale: 0.025,
  });

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x3b5866,
    roughness: 0.06,
    metalness: 0.38,
    envMapIntensity: 1.4,
  });

  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x9b9488,
    roughness: 0.84,
    metalness: 0.02,
    bumpMap: bumpTex,
    bumpScale: 0.015,
  });

  const interiorGlowMat = new THREE.MeshStandardMaterial({
    color: 0xf6dfaa,
    emissive: 0xffbf6b,
    emissiveIntensity: 0.48,
    roughness: 0.55,
    metalness: 0.0,
  });

  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xd8d0c2,
    roughness: 0.94,
    metalness: 0,
  });

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x5c4b3b,
    roughness: 0.9,
    metalness: 0.0,
  });

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x5b7252,
    roughness: 0.84,
    metalness: 0.0,
  });

  const contactShadowMat = new THREE.MeshBasicMaterial({
    map: contactShadowTex,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });

  return {
    primaryMat,
    glassMat,
    darkTrimMat,
    timberMat,
    waterMat,
    plinthMat,
    interiorGlowMat,
    groundMat,
    trunkMat,
    leafMat,
    contactShadowMat,
    textures: [bumpTex, timberTex, contactShadowTex],
  };
}

export function disposeSharedSceneMaterials(mats: SharedSceneMaterials): void {
  mats.primaryMat.dispose();
  mats.glassMat.dispose();
  mats.darkTrimMat.dispose();
  mats.timberMat.dispose();
  mats.waterMat.dispose();
  mats.plinthMat.dispose();
  mats.interiorGlowMat.dispose();
  mats.groundMat.dispose();
  mats.trunkMat.dispose();
  mats.leafMat.dispose();
  mats.contactShadowMat.dispose();
  for (const tex of mats.textures) {
    tex.dispose();
  }
}

export function disposeObjectGeometries(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.geometry.dispose();
    }
  });
}

export function buildTreeCluster(
  x: number,
  z: number,
  scale: number,
  mats: Pick<SharedSceneMaterials, "trunkMat" | "leafMat" | "contactShadowMat">,
): THREE.Group {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * scale, 0.17 * scale, 2.2 * scale, 8), mats.trunkMat);
  trunk.position.y = 1.1 * scale;
  trunk.castShadow = true;

  const canopyA = new THREE.Mesh(new THREE.SphereGeometry(1.05 * scale, 10, 8), mats.leafMat);
  canopyA.position.set(0, 2.5 * scale, 0);
  canopyA.castShadow = true;

  const canopyB = new THREE.Mesh(new THREE.SphereGeometry(0.75 * scale, 10, 8), mats.leafMat);
  canopyB.position.set(0.55 * scale, 2.1 * scale, 0.25 * scale);
  canopyB.castShadow = true;

  const canopyC = new THREE.Mesh(new THREE.SphereGeometry(0.62 * scale, 8, 6), mats.leafMat);
  canopyC.position.set(-0.48 * scale, 2.18 * scale, -0.3 * scale);

  const shadowDisc = new THREE.Mesh(new THREE.CircleGeometry(1.5 * scale, 18), mats.contactShadowMat);
  shadowDisc.rotation.x = -Math.PI / 2;
  shadowDisc.position.y = 0.018;

  tree.add(trunk, canopyA, canopyB, canopyC, shadowDisc);
  tree.position.set(x, 0, z);
  return tree;
}

function tagMesh(mesh: THREE.Mesh, objectId: string, pickLabel: string): THREE.Mesh {
  mesh.name = objectId;
  mesh.userData.objectId = objectId;
  mesh.userData.pickLabel = pickLabel;
  if (!mesh.userData.originalMaterial) {
    mesh.userData.originalMaterial = mesh.material;
  }
  return mesh;
}

export function buildPresetMassing(preset: Scene3DPreset, mats: SharedSceneMaterials): THREE.Group {
  const group = new THREE.Group();
  const { primaryMat, glassMat, darkTrimMat, timberMat, waterMat, plinthMat, interiorGlowMat, contactShadowMat } = mats;

  // Ground contact shadow beneath plinth
  const plinthShadow = new THREE.Mesh(new THREE.CircleGeometry(11.6, 32), contactShadowMat);
  plinthShadow.rotation.x = -Math.PI / 2;
  plinthShadow.position.y = 0.014;
  plinthShadow.userData.nonPickable = true;
  group.add(plinthShadow);

  // Landscape plinth & terrace base (disjoint Y >= 0.02)
  const terrace = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(16, 0.35, 13), plinthMat), "terrace-plinth", "Terrace Plinth");
  terrace.position.set(0, 0.175, 0);
  terrace.receiveShadow = true;
  group.add(terrace);

  // Subtle perimeter dark trim edge
  const plinthTrim = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(16.12, 0.08, 13.12), darkTrimMat), "plinth-trim", "Plinth Perimeter Trim");
  plinthTrim.position.set(0, 0.33, 0);
  group.add(plinthTrim);

  if (preset === "pavilion") {
    const basin = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, 9), waterMat), "reflecting-pool", "Reflecting Pool");
    basin.position.set(0.4, 0.41, 0.6);
    group.add(basin);

    for (let i = 0; i < 4; i++) {
      const stone = tagMesh(
        new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.85), plinthMat),
        `stepping-stone-${i + 1}`,
        `Stepping Stone #${i + 1}`,
      );
      stone.position.set(-3.2 + i * 1.45, 0.46, 3.6);
      stone.receiveShadow = true;
      group.add(stone);
    }

    const coreWall = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(6.8, 3.3, 0.45), primaryMat), "core-wall", "North Core Wall");
    coreWall.position.set(-0.6, 2.0, -2.0);
    coreWall.castShadow = true;
    coreWall.receiveShadow = true;
    group.add(coreWall);

    const sideWall = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.3, 4.4), primaryMat), "west-wing-wall", "West Shear Wall");
    sideWall.position.set(-3.8, 2.0, 0.1);
    sideWall.castShadow = true;
    sideWall.receiveShadow = true;
    group.add(sideWall);

    // Interior illuminated hearth volume visible through glass
    const interiorCore = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.1, 0.6), interiorGlowMat), "interior-hearth", "Interior Hearth Core");
    interiorCore.position.set(-0.9, 1.45, -1.2);
    group.add(interiorCore);

    const glassWall = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.05, 0.08), glassMat), "glazing-south", "South Curtain Glazing");
    glassWall.position.set(-0.5, 1.92, 2.0);
    group.add(glassWall);

    const glassEast = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.05, 3.9), glassMat), "glazing-east", "East Corner Glazing");
    glassEast.position.set(2.6, 1.92, 0.05);
    group.add(glassEast);

    const roof = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.36, 7.2), primaryMat), "canopy-roof", "Cantilever Roof Slab");
    roof.position.set(-0.2, 3.84, 0.2);
    roof.castShadow = true;
    group.add(roof);

    const fascia = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(9.72, 0.1, 7.32), darkTrimMat), "roof-fascia", "Roof Edge Fascia");
    fascia.position.set(-0.2, 3.99, 0.2);
    group.add(fascia);

    const soffit = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(9.1, 0.08, 6.7), timberMat), "timber-soffit", "Timber Roof Soffit");
    soffit.position.set(-0.2, 3.63, 0.2);
    group.add(soffit);

    const colCoords = [
      [3.9, 3.1],
      [3.9, -2.8],
      [-4.4, 3.1],
    ] as const;
    colCoords.forEach(([cx, cz], colIdx) => {
      const col = tagMesh(
        new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 3.25, 12), darkTrimMat),
        `column-${colIdx + 1}`,
        `Steel Column #${colIdx + 1}`,
      );
      col.position.set(cx, 2.0, cz);
      col.castShadow = true;
      group.add(col);
    });
  } else if (preset === "villa") {
    const pool = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.1, 3.6), waterMat), "villa-pool", "Infinity Lap Pool");
    pool.position.set(2.6, 0.42, 3.2);
    group.add(pool);

    const lowerBase = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(8.6, 2.8, 5.4), plinthMat), "lower-podium", "Lower Stone Podium");
    lowerBase.position.set(-1.4, 1.78, -0.6);
    lowerBase.castShadow = true;
    lowerBase.receiveShadow = true;
    group.add(lowerBase);

    const lowerGlow = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.4), interiorGlowMat), "lower-hearth", "Ground Living Hearth");
    lowerGlow.position.set(-1.1, 1.45, 1.55);
    group.add(lowerGlow);

    const lowerGlass = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(5.6, 2.4, 0.1), glassMat), "lower-glazing", "Garden Level Glazing");
    lowerGlass.position.set(-1.1, 1.65, 2.14);
    group.add(lowerGlass);

    const upperCantilever = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(10.4, 2.5, 5.2), primaryMat), "upper-cantilever", "Upper Cantilever Volume");
    upperCantilever.position.set(0.6, 4.44, -0.1);
    upperCantilever.castShadow = true;
    upperCantilever.receiveShadow = true;
    group.add(upperCantilever);

    const upperGlaze = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(7.4, 2.0, 0.12), glassMat), "upper-glazing", "Upper Panoramic Glazing");
    upperGlaze.position.set(1.2, 4.38, 2.54);
    group.add(upperGlaze);

    for (let i = 0; i < 9; i++) {
      const louver = tagMesh(
        new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.35, 0.45), timberMat),
        `timber-louver-${i + 1}`,
        `Timber Brise-Soleil #${i + 1}`,
      );
      louver.position.set(-3.2 + i * 0.65, 4.44, 2.68);
      louver.castShadow = true;
      group.add(louver);
    }

    const fascia = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.18, 5.5), darkTrimMat), "villa-fascia", "Upper Roof Fascia");
    fascia.position.set(0.6, 5.76, -0.1);
    group.add(fascia);
  } else if (preset === "loft") {
    const shellBack = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(10.2, 5.8, 0.6), primaryMat), "loft-north-wall", "Loft Back Shell Wall");
    shellBack.position.set(0, 3.28, -3.2);
    shellBack.castShadow = true;
    shellBack.receiveShadow = true;
    group.add(shellBack);

    const shellLeft = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(0.6, 5.8, 6.8), primaryMat), "loft-west-wall", "Loft West Wall");
    shellLeft.position.set(-4.8, 3.28, 0.1);
    shellLeft.castShadow = true;
    group.add(shellLeft);

    const mezz = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.28, 5.2), timberMat), "loft-mezzanine", "Oak Mezzanine Deck");
    mezz.position.set(-1.8, 3.2, -0.4);
    mezz.castShadow = true;
    group.add(mezz);

    const island = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.92, 1.1), plinthMat), "loft-island", "Kitchen Monolith Island");
    island.position.set(1.8, 0.84, 0.4);
    island.castShadow = true;
    group.add(island);

    const hearthGlow = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.35), interiorGlowMat), "loft-hearth", "Atrium Lighting Core");
    hearthGlow.position.set(1.8, 2.2, -2.5);
    group.add(hearthGlow);

    const curtain = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(8.8, 5.2, 0.08), glassMat), "loft-curtainwall", "Double-Height Curtain Wall");
    curtain.position.set(0.2, 2.98, 3.2);
    group.add(curtain);

    for (let x = -4, idx = 1; x <= 4; x += 2, idx++) {
      const mullion = tagMesh(
        new THREE.Mesh(new THREE.BoxGeometry(0.12, 5.4, 0.18), darkTrimMat),
        `loft-mullion-${idx}`,
        `Steel Mullion #${idx}`,
      );
      mullion.position.set(x, 3.08, 3.25);
      group.add(mullion);
    }
    const roof = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.3, 7.2), darkTrimMat), "loft-roof", "Steel Truss Roof Deck");
    roof.position.set(0, 6.3, 0.1);
    roof.castShadow = true;
    group.add(roof);
  } else {
    // Civic Timber Hall
    for (let i = 0; i < 5; i++) {
      const bayX = -4.2 + i * 2.1;
      const col = tagMesh(
        new THREE.Mesh(new THREE.BoxGeometry(0.28, 4.4, 0.36), timberMat),
        `glulam-col-${i + 1}`,
        `Glulam Column #${i + 1}`,
      );
      col.position.set(bayX, 2.58, 2.6);
      col.castShadow = true;
      group.add(col);
      const beam = tagMesh(
        new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 6.4), timberMat),
        `glulam-beam-${i + 1}`,
        `Glulam Roof Beam #${i + 1}`,
      );
      beam.position.set(bayX, 4.95, -0.2);
      beam.castShadow = true;
      group.add(beam);
    }

    const core = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(8.6, 4.3, 4.6), primaryMat), "civic-core", "Civic Acoustic Core");
    core.position.set(0, 2.52, -1.2);
    core.castShadow = true;
    core.receiveShadow = true;
    group.add(core);

    const interiorAtrium = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.0, 0.4), interiorGlowMat), "civic-atrium", "Clerestory Lantern");
    interiorAtrium.position.set(0, 3.9, 0.9);
    group.add(interiorAtrium);

    const clerestory = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(8.8, 1.4, 0.1), glassMat), "civic-clerestory", "Clerestory Glazing Band");
    clerestory.position.set(0, 4.02, 1.16);
    group.add(clerestory);

    const zincRoof = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.28, 7.2), darkTrimMat), "civic-roof", "Standing-Seam Zinc Roof");
    zincRoof.position.set(0, 5.28, -0.1);
    zincRoof.rotation.x = 0.08;
    zincRoof.castShadow = true;
    group.add(zincRoof);
  }

  return group;
}

// #1 Auto-center, normalize footprint (~10m), and flush-ground uploaded GLB/GLTF/OBJ/FBX models
export function normalizeAndGroundObject(root: THREE.Object3D): { meshCount: number; partNames: string[] } {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  const scaleFactor = 10.5 / maxDim;

  root.scale.multiplyScalar(scaleFactor);
  root.updateMatrixWorld(true);

  const scaledBox = new THREE.Box3().setFromObject(root);
  const scaledCenter = new THREE.Vector3();
  scaledBox.getCenter(scaledCenter);

  root.position.x -= scaledCenter.x;
  root.position.z -= scaledCenter.z;
  root.position.y -= scaledBox.min.y;

  let meshCount = 0;
  const partNames: string[] = [];
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      meshCount++;
      const label = mesh.name?.trim() || `Architectural Part ${meshCount}`;
      const objectId = (mesh.name?.trim() || `cad-mesh-${meshCount}`).toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
      mesh.userData.objectId = objectId;
      mesh.userData.pickLabel = label;
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material;
      }
      partNames.push(label);
    }
  });
  return { meshCount, partNames };
}

// #4 Procedural Equirectangular HDRI Sky Texture for PMREM reflections (syncs live with Time of Day & Month sunPosition)
export function createDynamicSolarHdriTexture(params: {
  mood: "studio" | "clear-sky" | "golden-dusk" | "overcast-nordic";
  azimuthDeg?: number;
  rawElevationDeg?: number;
  zenithHex?: string;
  horizonHex?: string;
  groundBounceHex?: string;
  isDaylight?: boolean;
}): THREE.CanvasTexture {
  const {
    mood,
    azimuthDeg = 148,
    rawElevationDeg = 38,
    zenithHex,
    horizonHex,
    groundBounceHex,
    isDaylight = true,
  } = params;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    if (zenithHex && horizonHex && groundBounceHex) {
      grad.addColorStop(0, zenithHex);
      grad.addColorStop(0.45, horizonHex);
      grad.addColorStop(0.55, horizonHex);
      grad.addColorStop(0.65, groundBounceHex);
      grad.addColorStop(1, "#2a2520");
    } else if (mood === "golden-dusk") {
      grad.addColorStop(0, "#1c2d4a");
      grad.addColorStop(0.42, "#596a88");
      grad.addColorStop(0.55, "#f0b475");
      grad.addColorStop(0.62, "#876f57");
      grad.addColorStop(1, "#3d332a");
    } else if (mood === "overcast-nordic") {
      grad.addColorStop(0, "#9aa5b0");
      grad.addColorStop(0.5, "#ced6dd");
      grad.addColorStop(0.6, "#938f86");
      grad.addColorStop(1, "#58554e");
    } else if (mood === "studio") {
      grad.addColorStop(0, "#eef0f2");
      grad.addColorStop(0.48, "#dfe3e8");
      grad.addColorStop(0.56, "#9e988d");
      grad.addColorStop(1, "#5c574f");
    } else {
      grad.addColorStop(0, "#3b6fa8");
      grad.addColorStop(0.45, "#a6c5e0");
      grad.addColorStop(0.54, "#f4eee2");
      grad.addColorStop(0.65, "#aba191");
      grad.addColorStop(1, "#5c5244");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Project azimuth (0-360°) -> equirectangular U (0-512) and elevation (-20..85°) -> V (0-256)
    const uNorm = (((azimuthDeg % 360) + 360) % 360) / 360;
    const sunX = uNorm * 512;
    const clampedEl = Math.max(-15, Math.min(84, rawElevationDeg));
    const sunY = Math.max(16, Math.min(168, 128 - (clampedEl / 90) * 116));

    if (mood !== "overcast-nordic") {
      const discColor = !isDaylight
        ? "rgba(182,210,255,0.68)"
        : clampedEl < 18
          ? "rgba(255,198,125,0.96)"
          : "rgba(255,252,240,0.98)";
      const haloColor = !isDaylight
        ? "rgba(130,170,240,0.2)"
        : clampedEl < 18
          ? "rgba(255,165,92,0.42)"
          : "rgba(255,236,196,0.38)";
      for (const offsetX of [0, -512, 512]) {
        const cx = sunX + offsetX;
        const rad = ctx.createRadialGradient(cx, sunY, 2, cx, sunY, isDaylight ? 52 : 34);
        rad.addColorStop(0, discColor);
        rad.addColorStop(0.38, haloColor);
        rad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rad;
        ctx.fillRect(cx - 56, sunY - 56, 112, 112);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createProceduralHdriTexture(
  mood: "studio" | "clear-sky" | "golden-dusk" | "overcast-nordic",
): THREE.CanvasTexture {
  return createDynamicSolarHdriTexture({ mood });
}

// #7 Extrude detected 2D floor plan walls into real 3D room architecture
export function buildFloorPlanExtrusionGroup(
  walls: Array<{ id: string; x: number; z: number; width: number; depth: number; height: number; hasDoorGap?: boolean }>,
  mats: SharedSceneMaterials,
): THREE.Group {
  const group = new THREE.Group();
  const floor = tagMesh(new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.25, 12.2), mats.plinthMat), "floor-slab", "Floor Slab");
  floor.position.set(0, 0.125, 0);
  floor.receiveShadow = true;
  group.add(floor);

  for (const wall of walls) {
    const mesh = tagMesh(
      new THREE.Mesh(new THREE.BoxGeometry(wall.width, wall.height, wall.depth), mats.primaryMat),
      `plan-wall-${wall.id}`,
      `Extruded Wall (${wall.id})`,
    );
    mesh.position.set(wall.x, wall.height * 0.5 + 0.25, wall.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  // Translucent sky glazing roof canopy strip for daylight study
  const skylight = tagMesh(
    new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.08, 10.6), mats.glassMat),
    "skylight-canopy",
    "Skylight Canopy",
  );
  skylight.position.set(0, 3.4, 0);
  group.add(skylight);

  return group;
}

export function disposeMaterialIfCustom(mat: THREE.Material | THREE.Material[] | null | undefined, customPool: THREE.Material[]): void {
  if (!mat) return;
  const list = Array.isArray(mat) ? mat : [mat];
  for (const item of list) {
    const idx = customPool.indexOf(item);
    if (idx !== -1) {
      item.dispose();
      customPool.splice(idx, 1);
    }
  }
}

export function applyMaterialOverrideToMesh(
  mesh: THREE.Mesh,
  spec: {
    hex: string;
    roughness: number;
    metalness: number;
    clearcoat: number;
    opacity: number;
    transparent: boolean;
  },
  customPool: THREE.Material[],
): THREE.MeshPhysicalMaterial {
  if (!mesh.userData.originalMaterial) {
    mesh.userData.originalMaterial = mesh.material;
  }
  disposeMaterialIfCustom(mesh.material, customPool);
  const nextMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(spec.hex),
    roughness: spec.roughness,
    metalness: spec.metalness,
    clearcoat: spec.clearcoat,
    transparent: spec.transparent,
    opacity: spec.opacity,
    envMapIntensity: spec.transparent ? 1.4 : 1.05,
  });
  customPool.push(nextMat);
  mesh.material = nextMat;
  return nextMat;
}

export function restoreOriginalMeshMaterial(mesh: THREE.Mesh, customPool: THREE.Material[]): boolean {
  const original = mesh.userData.originalMaterial as THREE.Material | THREE.Material[] | undefined;
  if (!original || mesh.material === original) return false;
  disposeMaterialIfCustom(mesh.material, customPool);
  mesh.material = original;
  return true;
}

// #2 Render true Depth, Normal, and AO Clay channels directly from the live Three.js WebGL camera
export function exportThreeRenderChannels(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
): { depthUrl: string; normalUrl: string; clayUrl: string } {
  const prevBg = scene.background;
  const prevFog = scene.fog;
  const prevOverride = scene.overrideMaterial;

  const depthMat = new THREE.MeshDepthMaterial();
  scene.overrideMaterial = depthMat;
  scene.background = new THREE.Color(0x0b0a0c);
  scene.fog = null;
  renderer.render(scene, camera);
  const depthUrl = renderer.domElement.toDataURL("image/png");

  const normalMat = new THREE.MeshNormalMaterial();
  scene.overrideMaterial = normalMat;
  scene.background = new THREE.Color(0x8080ff);
  renderer.render(scene, camera);
  const normalUrl = renderer.domElement.toDataURL("image/png");

  const clayMat = new THREE.MeshStandardMaterial({
    color: 0xe6e1d8,
    roughness: 0.92,
    metalness: 0.0,
  });
  scene.overrideMaterial = clayMat;
  scene.background = new THREE.Color(0xdcd6cb);
  renderer.render(scene, camera);
  const clayUrl = renderer.domElement.toDataURL("image/jpeg", 0.92);

  scene.overrideMaterial = prevOverride;
  scene.background = prevBg;
  scene.fog = prevFog;
  depthMat.dispose();
  normalMat.dispose();
  clayMat.dispose();
  renderer.render(scene, camera);

  return { depthUrl, normalUrl, clayUrl };
}

// #3 Apply 2-point architectural perspective vertical lens-shift correction
export function applyCameraLensShift(
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
  twoPointTilt: boolean,
  verticalShift: number,
): void {
  if (!twoPointTilt || Math.abs(verticalShift) < 0.002) {
    camera.clearViewOffset();
    return;
  }
  const fullW = Math.max(1, Math.round(width));
  const fullH = Math.max(1, Math.round(height));
  const offsetY = Math.round(verticalShift * fullH);
  camera.setViewOffset(fullW, fullH, 0, offsetY, fullW, fullH);
}

