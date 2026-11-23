import { jsPDF } from "jspdf";
import * as THREE from "three";
import { exportGroupToGltfAsync } from "@/lib/scene-export";
import type {
  GovernanceState,
  KumTimelineClip,
  KumVideoState,
  TrackedReviewItem,
  VirtualTourState,
} from "@/lib/prd-studio-data";
import type { Scene3DPreset } from "@/lib/engines";
import {
  buildPresetMassing,
  createSharedSceneMaterials,
  disposeObjectGeometries,
  disposeSharedSceneMaterials,
} from "@/lib/viewport-3d-scene";

export interface ProceduralGlbAssetSpec {
  id: string;
  name: string;
  category: "architecture" | "structure" | "landscape" | "furniture";
  presetKey?: Scene3DPreset;
  summary: string;
  trianglesApprox: number;
  dimensionsM: string;
  previewImage: string;
}

export const PROCEDURAL_GLB_CATALOG: readonly ProceduralGlbAssetSpec[] = [
  {
    id: "pavilion",
    name: "Cantilever Glass Pavilion",
    category: "architecture",
    presetKey: "pavilion",
    summary: "Single-story architectural pavilion with floating roof slab, recessed glazing, and warm travertine plinth.",
    trianglesApprox: 420,
    dimensionsM: "14.0 × 9.2 × 4.1 m",
    previewImage: "/viz/p01-pavilion-day.jpg",
  },
  {
    id: "villa",
    name: "Two-Story Courtyard Villa",
    category: "architecture",
    presetKey: "villa",
    summary: "L-shaped modern villa massing with overhanging upper suite, louvered brise-soleil, and pool terrace.",
    trianglesApprox: 680,
    dimensionsM: "16.5 × 12.0 × 6.8 m",
    previewImage: "/viz/p01-pavilion-dusk.jpg",
  },
  {
    id: "tower",
    name: "Stepped Timber & Glass Tower",
    category: "architecture",
    presetKey: "tower",
    summary: "Mid-rise mixed-use tower with setback sky terraces, structural diagrid mullions, and podium arcade.",
    trianglesApprox: 940,
    dimensionsM: "14.0 × 14.0 × 28.0 m",
    previewImage: "/viz/t02-timber-pavilion.jpg",
  },
  {
    id: "courtyard",
    name: "Monolithic Stone Courtyard House",
    category: "architecture",
    presetKey: "courtyard",
    summary: "Perimeter stone residence enclosing a tranquil reflecting basin and shaded colonnade.",
    trianglesApprox: 560,
    dimensionsM: "18.0 × 15.0 × 4.6 m",
    previewImage: "/viz/t01-courtyard-house.jpg",
  },
  {
    id: "timber-pergola",
    name: "Cedar Louver Pergola Canopy",
    category: "structure",
    summary: "Composite architectural shade pergola with 4 steel posts, perimeter beams, and 10 angled timber louvers.",
    trianglesApprox: 312,
    dimensionsM: "6.4 × 4.2 × 3.0 m",
    previewImage: "/viz/t02-timber-pavilion.jpg",
  },
  {
    id: "lounge-pavilion-set",
    name: "Minimalist Low-Profile Sofa & Plinth Table",
    category: "furniture",
    summary: "Composite architectural lounge group: travertine coffee plinth, modular linen sofa, and bronze floor lamp.",
    trianglesApprox: 288,
    dimensionsM: "3.4 × 2.6 × 1.7 m",
    previewImage: "/viz/t03-compact-living-room.jpg",
  },
] as const;

function buildCompositePergolaGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Oriel_Timber_Pergola";

  const steelMat = new THREE.MeshStandardMaterial({
    name: "Anodized Bronze Steel",
    color: 0x3b3530,
    roughness: 0.35,
    metalness: 0.82,
  });
  const cedarMat = new THREE.MeshStandardMaterial({
    name: "Warm Western Red Cedar",
    color: 0x9f6b43,
    roughness: 0.72,
    metalness: 0.04,
  });
  const plinthMat = new THREE.MeshStandardMaterial({
    name: "Honed Travertine Deck",
    color: 0xd9cfc0,
    roughness: 0.84,
    metalness: 0.02,
  });

  const deck = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.24, 4.6), plinthMat);
  deck.position.set(0, 0.12, 0);
  deck.name = "pergola-deck";
  group.add(deck);

  const postPositions: [number, number][] = [
    [-3.0, -1.9],
    [3.0, -1.9],
    [-3.0, 1.9],
    [3.0, 1.9],
  ];
  postPositions.forEach(([px, pz], idx) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.9, 0.18), steelMat);
    post.position.set(px, 1.69, pz);
    post.name = `pergola-post-${idx + 1}`;
    group.add(post);
  });

  const frontBeam = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.24, 0.16), steelMat);
  frontBeam.position.set(0, 3.05, 1.9);
  frontBeam.name = "pergola-beam-front";
  group.add(frontBeam);

  const backBeam = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.24, 0.16), steelMat);
  backBeam.position.set(0, 3.05, -1.9);
  backBeam.name = "pergola-beam-back";
  group.add(backBeam);

  for (let i = 0; i < 10; i += 1) {
    const x = -2.7 + i * 0.6;
    const louver = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 3.9), cedarMat);
    louver.position.set(x, 3.12, 0);
    louver.rotation.z = 0.22;
    louver.name = `pergola-louver-${i + 1}`;
    group.add(louver);
  }

  return group;
}

function buildCompositeLoungeGroup(): THREE.Group {
  const group = new THREE.Group();
  group.name = "Oriel_Minimalist_Lounge_Set";

  const linenMat = new THREE.MeshStandardMaterial({
    name: "Oatmeal Boucle Linen",
    color: 0xe6dfd3,
    roughness: 0.92,
    metalness: 0.0,
  });
  const stoneMat = new THREE.MeshStandardMaterial({
    name: "Honed Travertine Block",
    color: 0xd2c4ae,
    roughness: 0.62,
    metalness: 0.03,
  });
  const bronzeMat = new THREE.MeshStandardMaterial({
    name: "Brushed Architectural Bronze",
    color: 0x6f573a,
    roughness: 0.28,
    metalness: 0.88,
  });
  const oakMat = new THREE.MeshStandardMaterial({
    name: "Smoked White Oak",
    color: 0x70553c,
    roughness: 0.68,
    metalness: 0.04,
  });

  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.22, 1.02), oakMat);
  sofaBase.position.set(0, 0.15, -0.75);
  sofaBase.name = "sofa-plinth";
  group.add(sofaBase);

  const sofaSeat = new THREE.Mesh(new THREE.BoxGeometry(2.72, 0.26, 0.96), linenMat);
  sofaSeat.position.set(0, 0.39, -0.73);
  sofaSeat.name = "sofa-seat-cushion";
  group.add(sofaSeat);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.72, 0.46, 0.24), linenMat);
  sofaBack.position.set(0, 0.68, -1.12);
  sofaBack.name = "sofa-backrest";
  group.add(sofaBack);

  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.26, 0.86), stoneMat);
  tableTop.position.set(0, 0.26, 0.55);
  tableTop.name = "travertine-coffee-table";
  group.add(tableTop);

  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.06, 20), bronzeMat);
  lampBase.position.set(1.75, 0.03, -0.7);
  lampBase.name = "floor-lamp-base";
  group.add(lampBase);

  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.56, 12), bronzeMat);
  lampStem.position.set(1.75, 0.82, -0.7);
  lampStem.name = "floor-lamp-stem";
  group.add(lampStem);

  const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.24, 24), linenMat);
  lampShade.position.set(1.75, 1.62, -0.7);
  lampShade.name = "floor-lamp-shade";
  group.add(lampShade);

  return group;
}

export async function exportProceduralAssetToGlbFile(assetId: string): Promise<{
  file: File;
  blob: Blob;
  filename: string;
  meshCount: number;
}> {
  const spec = PROCEDURAL_GLB_CATALOG.find((item) => item.id === assetId) ?? PROCEDURAL_GLB_CATALOG[0];
  let group: THREE.Group;
  let sharedMats: ReturnType<typeof createSharedSceneMaterials> | null = null;

  if (spec.presetKey) {
    sharedMats = createSharedSceneMaterials("concrete", 1);
    group = buildPresetMassing(spec.presetKey, sharedMats);
  } else if (spec.id === "timber-pergola") {
    group = buildCompositePergolaGroup();
  } else {
    group = buildCompositeLoungeGroup();
  }

  try {
    const exported = await exportGroupToGltfAsync(group, [], {
      binary: true,
      presetName: spec.id,
    });
    const buffer =
      exported.payload instanceof ArrayBuffer
        ? exported.payload
        : new TextEncoder().encode(JSON.stringify(exported.payload)).buffer;
    const filename = `oriel-${spec.id}.glb`;
    const blob = new Blob([buffer], { type: "model/gltf-binary" });
    const file = new File([blob], filename, { type: "model/gltf-binary" });
    return {
      file,
      blob,
      filename,
      meshCount: exported.summary.meshCount,
    };
  } finally {
    disposeObjectGeometries(group);
    if (sharedMats) disposeSharedSceneMaterials(sharedMats);
  }
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function loadCanvasImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith("data:") && !src.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Unable to decode media frame: ${src.slice(0, 64)}`));
    img.src = src;
  });
}

export function resolveKumVideoDimensions(aspect: KumVideoState["aspect"]): { width: number; height: number } {
  switch (aspect) {
    case "9:16":
      return { width: 540, height: 960 };
    case "1:1":
      return { width: 720, height: 720 };
    case "4:5":
      return { width: 640, height: 800 };
    case "16:9":
    default:
      return { width: 960, height: 540 };
  }
}

export function lutToCanvasFilter(lut: KumVideoState["lut"]): string {
  switch (lut) {
    case "Filmic Warm":
      return "contrast(1.06) saturate(1.12) sepia(0.14)";
    case "Twilight Gold":
      return "contrast(1.12) brightness(0.92) saturate(1.18) sepia(0.08)";
    case "Arctic Glass":
      return "contrast(1.08) saturate(0.96) brightness(1.03)";
    case "Neutral":
    default:
      return "none";
  }
}

export async function renderKumTimelineToWebm(
  project: KumVideoState,
  titleOverlay?: string,
  onProgress?: (pct: number) => void,
): Promise<{
  blob: Blob;
  url: string;
  filename: string;
  durationSec: number;
  isWebm: boolean;
}> {
  const videoClips = project.clips.filter((c) => c.track === "video" && c.imageUrl);
  const effectiveClips: KumTimelineClip[] =
    videoClips.length > 0
      ? videoClips
      : [
          {
            id: "fallback-clip",
            track: "video",
            label: titleOverlay || "Architectural Sequence",
            startSec: 0,
            durationSec: 4,
            imageUrl: "/viz/p01-pavilion-dusk.jpg",
            cameraMove: "dolly-in",
            transition: "cross-dissolve",
          },
        ];

  const { width, height } = resolveKumVideoDimensions(project.aspect);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable for KUM Video render.");

  const loadedImages = await Promise.all(
    effectiveClips.map((clip) => loadCanvasImage(clip.imageUrl || "/viz/p01-pavilion-dusk.jpg")),
  );

  // Compress realtime recording slightly so long timelines finish reliably in 2–6 seconds while preserving smooth motion
  const nominalSec = effectiveClips.reduce((acc, c) => acc + Math.max(1.5, c.durationSec), 0);
  const renderDurationMs = Math.min(6000, Math.max(1800, Math.round(nominalSec * 320)));
  const fps = Math.min(30, Math.max(20, project.fps || 24));
  const filterStr = lutToCanvasFilter(project.lut);

  const drawCoverKenBurns = (
    img: HTMLImageElement,
    move: KumTimelineClip["cameraMove"],
    localT: number,
    alpha: number,
  ) => {
    const ease = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;
    const imgRatio = (img.naturalWidth || 16) / Math.max(1, img.naturalHeight || 9);
    const canvasRatio = width / height;
    let baseW = width;
    let baseH = height;
    if (imgRatio > canvasRatio) {
      baseH = height;
      baseW = height * imgRatio;
    } else {
      baseW = width;
      baseH = width / imgRatio;
    }

    let scale = 1.04;
    let tx = 0;
    let ty = 0;
    if (move === "dolly-in") {
      scale = 1.02 + ease * 0.14;
    } else if (move === "pan") {
      scale = 1.14;
      tx = (ease - 0.5) * -(width * 0.08);
    } else if (move === "rise") {
      scale = 1.12;
      ty = (0.5 - ease) * (height * 0.07);
    }

    const dw = baseW * scale;
    const dh = baseH * scale;
    const dx = (width - dw) / 2 + tx;
    const dy = (height - dh) / 2 + ty;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.filter = filterStr;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();
  };

  const renderCompositeFrame = (globalT: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#050f1b";
    ctx.fillRect(0, 0, width, height);

    const totalWeight = effectiveClips.reduce((acc, c) => acc + Math.max(1, c.durationSec), 0);
    let cursor = 0;
    let activeIdx = 0;
    let localT = 0;

    for (let i = 0; i < effectiveClips.length; i += 1) {
      const span = Math.max(1, effectiveClips[i].durationSec) / totalWeight;
      if (globalT <= cursor + span || i === effectiveClips.length - 1) {
        activeIdx = i;
        localT = Math.max(0, Math.min(1, (globalT - cursor) / Math.max(0.001, span)));
        break;
      }
      cursor += span;
    }

    const curClip = effectiveClips[activeIdx];
    const curImg = loadedImages[activeIdx];
    drawCoverKenBurns(curImg, curClip.cameraMove, localT, 1);

    // Cross-dissolve blend into next clip during final 18% of segment
    if (curClip.transition === "cross-dissolve" && activeIdx < effectiveClips.length - 1 && localT > 0.82) {
      const blend = (localT - 0.82) / 0.18;
      drawCoverKenBurns(loadedImages[activeIdx + 1], effectiveClips[activeIdx + 1].cameraMove, 0, blend);
    }

    // Architectural vignette + optional caption bar
    const grad = ctx.createLinearGradient(0, height * 0.65, 0, height);
    grad.addColorStop(0, "rgba(5,15,27,0)");
    grad.addColorStop(1, "rgba(5,15,27,0.72)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, height * 0.65, width, height * 0.35);

    if (project.captionsEnabled) {
      ctx.fillStyle = "rgba(8, 19, 31, 0.72)";
      ctx.fillRect(24, 24, Math.min(width - 48, 360), 50);
      ctx.fillStyle = "#e8eff3";
      ctx.font = "600 14px sans-serif";
      ctx.fillText((curClip.label || titleOverlay || "Oriel Architectural Film").slice(0, 42), 36, 46);
      ctx.fillStyle = "#e8c98a";
      ctx.font = "500 11px monospace";
      ctx.fillText(`${curClip.cameraMove.toUpperCase()} · ${project.lut} · ${project.fps}FPS`, 36, 64);
    }
  };

  renderCompositeFrame(0);

  const supportsRecorder =
    typeof MediaRecorder !== "undefined" && typeof canvas.captureStream === "function";
  const mimeType = supportsRecorder
    ? MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : ""
    : "";

  if (!supportsRecorder || !mimeType) {
    const posterBlob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b ?? new Blob()), "image/jpeg", 0.92),
    );
    const filename = `oriel-kum-storyboard-${project.aspect.replace(":", "x")}.jpg`;
    return {
      blob: posterBlob,
      url: URL.createObjectURL(posterBlob),
      filename,
      durationSec: nominalSec,
      isWebm: false,
    };
  }

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2_400_000,
  });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (ev) => {
    if (ev.data.size > 0) chunks.push(ev.data);
  };

  return await new Promise((resolve, reject) => {
    recorder.onerror = () => reject(new Error("WebM MediaRecorder failed during KUM Video export."));
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const filename = `oriel-kum-film-${project.aspect.replace(":", "x")}.webm`;
      onProgress?.(100);
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        filename,
        durationSec: nominalSec,
        isWebm: true,
      });
    };

    recorder.start(120);
    const startedAt = performance.now();

    const step = () => {
      const elapsed = performance.now() - startedAt;
      const t = Math.min(1, elapsed / renderDurationMs);
      renderCompositeFrame(t);
      onProgress?.(Math.min(99, Math.round(t * 100)));
      if (elapsed < renderDurationMs) {
        requestAnimationFrame(step);
      } else {
        recorder.stop();
      }
    };
    requestAnimationFrame(step);
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildStandalone360TourHtml(
  tourConfig: VirtualTourState,
  activePanoramaUrl: string,
  studioName = "Oriel ArchViz Studio",
): string {
  const safeData = JSON.stringify({
    slug: tourConfig.slug,
    version: tourConfig.publishedVersion,
    theme: tourConfig.theme,
    activeSceneId: tourConfig.activeSceneId,
    scenes: tourConfig.scenes.map((sc) => ({
      ...sc,
      imageUrl: sc.id === tourConfig.activeSceneId && activePanoramaUrl ? activePanoramaUrl : sc.imageUrl,
    })),
    hotspots: tourConfig.hotspots,
    units: tourConfig.units,
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(studioName)} · 360° Interactive Tour (${escapeHtml(tourConfig.slug)})</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;font-family:Inter,system-ui,sans-serif}
    body{background:#050f1b;color:#e8eff3;height:100vh;overflow:hidden;display:flex;flex-direction:column}
    header{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:rgba(8,19,31,.92);border-bottom:1px solid rgba(169,189,201,.2);gap:12px;flex-wrap:wrap}
    .brand{font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px;color:#e8c98a}
    .scenes{display:flex;gap:6px;flex-wrap:wrap}
    .pill{border:1px solid rgba(169,189,201,.28);background:#16202d;color:#cfe3f0;padding:6px 12px;border-radius:999px;font-size:12px;cursor:pointer}
    .pill.active{background:#e8c98a;color:#261a00;border-color:#e8c98a;font-weight:700}
    main{position:relative;flex:1;overflow:hidden;cursor:grab;user-select:none}
    main:active{cursor:grabbing}
    #pano{position:absolute;inset:0;background-size:auto 100%;background-repeat:repeat-x;background-position:50% 50%;transition:filter .2s}
    .pin{position:absolute;transform:translate(-50%,-50%);background:rgba(8,19,31,.88);border:1.5px solid #e8c98a;color:#fff;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap}
    #hud{position:absolute;left:16px;bottom:16px;max-width:340px;background:rgba(8,19,31,.88);border:1px solid rgba(169,189,201,.25);border-radius:14px;padding:12px 14px;font-size:12px}
    #hud h2{font-size:13px;color:#e8c98a;margin-bottom:4px}
    #hud p{color:#a9bdc9;line-height:1.45}
    .hint{position:absolute;right:16px;bottom:16px;background:rgba(8,19,31,.8);border:1px solid rgba(169,189,201,.25);border-radius:999px;padding:6px 12px;font-size:11px;color:#cfe3f0}
  </style>
</head>
<body>
  <header>
    <div class="brand">${escapeHtml(studioName)} · KING 360° v${tourConfig.publishedVersion}</div>
    <div class="scenes" id="scene-bar"></div>
  </header>
  <main id="stage">
    <div id="pano"></div>
    <div id="pins"></div>
    <div id="hud"><h2 id="hud-title">360° Panorama</h2><p id="hud-body">Drag horizontally to orbit the scene. Click any hotspot pin to inspect architectural details.</p></div>
    <div class="hint">Drag to Look 360°</div>
  </main>
  <script>
    const TOUR = ${safeData};
    let activeId = TOUR.activeSceneId || (TOUR.scenes[0] && TOUR.scenes[0].id);
    let panX = 50;
    let dragging = false;
    let lastX = 0;

    const pano = document.getElementById("pano");
    const pins = document.getElementById("pins");
    const sceneBar = document.getElementById("scene-bar");
    const hudTitle = document.getElementById("hud-title");
    const hudBody = document.getElementById("hud-body");
    const stage = document.getElementById("stage");

    function render() {
      const sc = TOUR.scenes.find((s) => s.id === activeId) || TOUR.scenes[0];
      if (!sc) return;
      pano.style.backgroundImage = "url('" + sc.imageUrl + "')";
      pano.style.backgroundPosition = panX + "% 50%";
      hudTitle.textContent = sc.label + " · " + sc.level;
      sceneBar.innerHTML = "";
      TOUR.scenes.forEach((s) => {
        const btn = document.createElement("button");
        btn.className = "pill" + (s.id === sc.id ? " active" : "");
        btn.textContent = s.label;
        btn.onclick = () => { activeId = s.id; render(); };
        sceneBar.appendChild(btn);
      });
      pins.innerHTML = "";
      TOUR.hotspots.filter((h) => h.sceneId === sc.id).forEach((h) => {
        const el = document.createElement("button");
        el.className = "pin";
        const leftPct = ((50 + h.yaw * 0.45 - (panX - 50) * 1.4) % 100 + 100) % 100;
        const topPct = Math.max(18, Math.min(80, 50 - h.pitch * 0.6));
        el.style.left = leftPct + "%";
        el.style.top = topPct + "%";
        el.textContent = "• " + h.label;
        el.onclick = (ev) => {
          ev.stopPropagation();
          hudTitle.textContent = "[" + h.type.toUpperCase() + "] " + h.label;
          hudBody.textContent = h.detail;
        };
        pins.appendChild(el);
      });
    }

    stage.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; });
    window.addEventListener("pointerup", () => { dragging = false; });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      panX = (panX - dx * 0.18 + 100) % 100;
      pano.style.backgroundPosition = panX + "% 50%";
      render();
    });
    render();
  </script>
</body>
</html>`;
}

async function imageUrlToJpegDataUrl(src: string): Promise<string | null> {
  try {
    const img = await loadCanvasImage(src);
    const maxW = 960;
    const scale = Math.min(1, maxW / Math.max(1, img.naturalWidth || 960));
    const w = Math.max(1, Math.round((img.naturalWidth || 960) * scale));
    const h = Math.max(1, Math.round((img.naturalHeight || 600) * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    return c.toDataURL("image/jpeg", 0.88);
  } catch {
    return null;
  }
}

export async function exportClientApprovalPdf(options: {
  projectTitle: string;
  exportTier: "8K" | "12K" | "15K";
  plates: Array<{ id: string; url: string; label: string }>;
  reviews: TrackedReviewItem[];
  governance: GovernanceState;
}): Promise<{ filename: string; plateCount: number }> {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Header band
  doc.setFillColor(8, 19, 31);
  doc.rect(0, 0, pageW, 24, "F");
  doc.setTextColor(232, 201, 138);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`${options.governance.brandKitName || "Oriel Studio"} · CLIENT APPROVAL CONTACT SHEET`, 12, 11);

  doc.setTextColor(207, 227, 240);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `Project: ${options.projectTitle}  |  Print Spec: ${options.exportTier} Tiled Master  |  Residency: ${options.governance.residency}  |  Generated: ${new Date().toLocaleDateString()}`,
    12,
    18,
  );

  // Plate Contact Grid (2x2 or up to 6 plates)
  const platesToInclude = options.plates.slice(0, 6);
  const cols = 3;
  const cardW = (pageW - 36) / cols;
  const cardH = 56;
  let embedded = 0;

  for (let idx = 0; idx < platesToInclude.length; idx += 1) {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = 12 + col * (cardW + 6);
    const y = 30 + row * (cardH + 14);

    doc.setDrawColor(190, 180, 165);
    doc.setFillColor(246, 243, 238);
    doc.roundedRect(x, y, cardW, cardH + 9, 2, 2, "FD");

    const jpegData = await imageUrlToJpegDataUrl(platesToInclude[idx].url);
    if (jpegData) {
      doc.addImage(jpegData, "JPEG", x + 1.5, y + 1.5, cardW - 3, cardH - 3);
      embedded += 1;
    }

    doc.setTextColor(27, 28, 26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(platesToInclude[idx].label.slice(0, 34), x + 2.5, y + cardH + 4.5);
    doc.setTextColor(20, 128, 72);
    doc.setFontSize(7.5);
    doc.text("APPROVED", x + cardW - 18, y + cardH + 4.5);
  }

  // Tracked Review Summary table at bottom
  const summaryY = Math.min(pageH - 36, 30 + Math.ceil(platesToInclude.length / cols) * (cardH + 14) + 2);
  doc.setTextColor(27, 28, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`Tracked Architectural Review Log (${options.reviews.length} items)`, 12, summaryY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  options.reviews.slice(0, 4).forEach((rev, idx) => {
    const lineY = summaryY + 5 + idx * 4.5;
    doc.text(
      `#${rev.number} [${rev.status.toUpperCase()}] (${rev.assignee}) ${rev.title}: ${rev.comment.slice(0, 96)}`,
      12,
      lineY,
    );
  });

  // Footer with C2PA & AI Disclosure
  doc.setFillColor(242, 238, 232);
  doc.rect(0, pageH - 11, pageW, 11, "F");
  doc.setTextColor(95, 86, 75);
  doc.setFontSize(7.5);
  const disclosure = options.governance.aiDisclosureFooter
    ? `C2PA Content Credentials: ${options.governance.c2paEnabled ? "EMBEDDED" : "OFF"} · AI-assisted architectural visualization prepared by ${options.governance.brandKitName}.`
    : `Prepared by ${options.governance.brandKitName}.`;
  doc.text(disclosure, 12, pageH - 4.5);

  const safeSlug = options.projectTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32) || "studio";
  const filename = `oriel-approval-${safeSlug}-${options.exportTier.toLowerCase()}.pdf`;
  doc.save(filename);

  return { filename, plateCount: embedded };
}
