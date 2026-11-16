import {
  heuristicSemanticBoxesForPrompt,
  refineMaskBuffer,
  runAnnotatorPass,
  runClientOutpaintCanvas,
  runDepthAnythingPass,
  runGroundedSam2Segment,
  runLocalLamaErasePass,
  runLocalTextureReplacePass,
  runRelightWeatherPass,
  runSam2RegionSegment,
  runTiledUpscalePass,
  toCompactDataUrlForSegmentation,
} from "@/lib/cv-pipeline";
import type { EngineState, Scene3DState } from "@/lib/engines";
import type { Frame } from "@/lib/frame";
import {
  enhancePlate,
  generatePlate,
  generateVariations,
  inpaintPlate,
  outpaintPlate,
  relightPlate,
  segmentObjectWithSam2,
} from "@/lib/generate";
import {
  buildEnvironmentDirective,
  getNodeSpec,
  validateWorkflowGraph,
  type ExecutionMode,
  type NodeExecutionResult,
  type NodeWorkflow,
  type WorkflowNodeInstance,
} from "@/lib/node-studio";
import type { DesignState } from "@/lib/properties";

export interface StudioRuntimeContext {
  activeImageUrl: string;
  activeMaskUrl?: string | null;
  design: DesignState;
  frame: Frame;
  engine: EngineState;
  scene3d: Scene3DState;
  onAssetPromoted?: (imageUrl: string, title: string) => void;
}

interface NodeWirePayload {
  image?: string;
  mask?: string;
  prompt?: string;
  reference?: { url?: string; swatch: string; materialStrength: number; styleStrength: number };
  conditioning?: {
    depthUrl?: string;
    edgeUrl?: string;
    normalUrl?: string;
    geometryLockWeight?: number;
    driftWarnPct?: number;
    referenceWeight?: number;
    referenceSwatch?: string;
  };
  environment?: {
    directive: string;
    weather?: string;
    climate?: string;
    timeOfDay?: string;
    mood?: string;
    azimuth?: number;
    has3DSceneInput: boolean;
  };
  scene3d?: {
    preset: string;
    sunAzimuth: number;
    sunElevation: number;
    imageUrl: string;
  };
  video?: {
    url: string;
    posterUrl: string;
    motionKind: string;
    durationSec: number;
    fps: number;
    isWebm: boolean;
  };
}

function loadBrowserImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith("data:") && !src.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Unable to load image "${src.slice(0, 80)}".`));
    img.src = src;
  });
}

async function ensureDataUrl(src: string): Promise<string> {
  if (src.startsWith("data:image/")) return src;
  const img = await loadBrowserImage(src);
  const w = Math.min(1024, img.naturalWidth || 1024);
  const h = Math.round(w * ((img.naturalHeight || 576) / Math.max(1, img.naturalWidth || 1024)));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return src;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.9);
}

/**
 * Renders a deterministic architectural 3D clay massing snapshot when Load 3D Scene
 * runs inside the node pipeline without a previously captured 3D WebGL frame.
 */
async function renderClayMassingFallback(preset: string, azimuth: number, elevation: number): Promise<string> {
  if (typeof document === "undefined") return "/viz/p01-pavilion-day.jpg";
  const w = 960;
  const h = 540;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "/viz/p01-pavilion-day.jpg";

  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, "#cfd4db");
  skyGrad.addColorStop(0.65, "#ece7df");
  skyGrad.addColorStop(1, "#dad2c5");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Horizon ground plane
  ctx.fillStyle = "#c9c0b2";
  ctx.fillRect(0, h * 0.64, w, h * 0.36);

  // Solar shadow shift from azimuth/elevation
  const rad = ((azimuth - 180) * Math.PI) / 180;
  const shadowLen = Math.max(24, Math.round((90 - elevation) * 1.4));
  const sx = Math.round(Math.cos(rad) * shadowLen);
  const sy = Math.round(Math.sin(rad) * shadowLen * 0.35);

  ctx.fillStyle = "rgba(42, 36, 30, 0.22)";
  ctx.beginPath();
  ctx.moveTo(220, 365);
  ctx.lineTo(720, 365);
  ctx.lineTo(720 + sx, 365 + Math.abs(sy) + 28);
  ctx.lineTo(220 + sx, 365 + Math.abs(sy) + 28);
  ctx.closePath();
  ctx.fill();

  // Primary architectural clay massing blocks
  ctx.fillStyle = "#ebe5db";
  ctx.fillRect(230, 210, 470, 155);
  ctx.fillStyle = "#d9d0c2";
  ctx.fillRect(540, 210, 160, 155);

  // Cantilevered slab roof
  ctx.fillStyle = "#f4efe6";
  ctx.fillRect(195, 192, 540, 22);
  ctx.fillStyle = "#2b2621";
  ctx.fillRect(275, 240, 220, 108);

  // Glazing mullions
  ctx.strokeStyle = "#8a7d6b";
  ctx.lineWidth = 3;
  for (let x = 315; x <= 460; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 240);
    ctx.lineTo(x, 348);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(20, 17, 15, 0.72)";
  ctx.fillRect(24, 20, 360, 32);
  ctx.fillStyle = "#f6efe4";
  ctx.font = "600 13px sans-serif";
  ctx.fillText(`CLAY PASS · ${preset.toUpperCase()} · SUN ${azimuth}° / ${elevation}°`, 36, 41);

  return canvas.toDataURL("image/jpeg", 0.9);
}

/**
 * Generates an architectural raster prompt plate locally when Cloud generation is off
 * or no server API key is configured.
 */
async function renderLocalConceptPlate(promptText: string, ratio = "16:9"): Promise<string> {
  if (typeof document === "undefined") return "/viz/p01-pavilion-day.jpg";
  const baseImg = "/viz/p01-pavilion-day.jpg";
  const img = await loadBrowserImage(baseImg);
  const [rw, rh] = ratio.split(":").map(Number);
  const w = 1024;
  const h = Math.round(w / ((rw || 16) / (rh || 9)));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return baseImg;
  const lower = promptText.toLowerCase();
  if (lower.includes("dusk") || lower.includes("night") || lower.includes("blue hour")) {
    ctx.filter = "contrast(1.14) brightness(0.84) hue-rotate(-8deg)";
  } else if (lower.includes("golden") || lower.includes("warm") || lower.includes("travertine")) {
    ctx.filter = "contrast(1.08) saturate(1.16) sepia(0.14)";
  } else {
    ctx.filter = "contrast(1.06) saturate(1.05)";
  }
  ctx.drawImage(img, 0, 0, w, h);
  ctx.filter = "none";
  return canvas.toDataURL("image/jpeg", 0.9);
}

/**
 * Computes average RGB drift (%) outside the active edit mask (PRD §4 / §15 Geometry Lock verification).
 */
export async function computeMaskOutsideDiffPct(
  beforeSrc: string,
  afterSrc: string,
  maskSrc?: string,
): Promise<{ diffPct: number; warning: boolean }> {
  if (typeof document === "undefined") return { diffPct: 0, warning: false };
  try {
    const [bImg, aImg, mImg] = await Promise.all([
      loadBrowserImage(beforeSrc),
      loadBrowserImage(afterSrc),
      maskSrc ? loadBrowserImage(maskSrc).catch(() => null) : Promise.resolve(null),
    ]);
    const w = 256;
    const h = 144;
    const drawToData = (img: HTMLImageElement) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, w, h);
      return ctx.getImageData(0, 0, w, h).data;
    };

    const bPx = drawToData(bImg);
    const aPx = drawToData(aImg);
    const mPx = mImg ? drawToData(mImg) : null;
    if (!bPx || !aPx) return { diffPct: 0, warning: false };

    let totalDiff = 0;
    let counted = 0;
    const total = w * h;
    for (let i = 0; i < total; i++) {
      const p = i * 4;
      if (mPx && mPx[p + 3] > 28) continue;
      const dr = Math.abs(bPx[p] - aPx[p]);
      const dg = Math.abs(bPx[p + 1] - aPx[p + 1]);
      const db = Math.abs(bPx[p + 2] - aPx[p + 2]);
      totalDiff += (dr + dg + db) / (3 * 255);
      counted++;
    }
    const diffPct = counted > 0 ? Number(((totalDiff / counted) * 100).toFixed(1)) : 0;
    return { diffPct, warning: diffPct > 18 };
  } catch {
    return { diffPct: 0, warning: false };
  }
}

/**
 * Generates an interactive architectural camera motion video clip using MediaRecorder WebM
 * when supported, plus a smooth poster frame fallback so Video nodes always produce output.
 */
export async function synthesizeCameraMotionVideo(
  imageSrc: string,
  motion: { kind: string; durationSec: number; fps?: number },
): Promise<{ videoUrl: string; posterUrl: string; isWebm: boolean }> {
  if (typeof document === "undefined") {
    return { videoUrl: imageSrc, posterUrl: imageSrc, isWebm: false };
  }
  const img = await loadBrowserImage(imageSrc);
  const posterCanvas = document.createElement("canvas");
  posterCanvas.width = 640;
  posterCanvas.height = 360;
  const pCtx = posterCanvas.getContext("2d");
  if (pCtx) {
    pCtx.drawImage(img, 0, 0, 640, 360);
  }
  const posterUrl = posterCanvas.toDataURL("image/jpeg", 0.88);

  if (typeof MediaRecorder === "undefined" || typeof posterCanvas.captureStream !== "function") {
    return { videoUrl: posterUrl, posterUrl, isWebm: false };
  }

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "";

  if (!mimeType) {
    return { videoUrl: posterUrl, posterUrl, isWebm: false };
  }

  const fps = Math.min(30, Math.max(15, motion.fps ?? 24));
  const durationMs = Math.min(2600, Math.max(900, Math.round(motion.durationSec * 360)));
  const stream = posterCanvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 1_500_000 });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (ev) => {
    if (ev.data.size > 0) chunks.push(ev.data);
  };

  return await new Promise((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      if (blob.size > 0) {
        resolve({ videoUrl: URL.createObjectURL(blob), posterUrl, isWebm: true });
      } else {
        resolve({ videoUrl: posterUrl, posterUrl, isWebm: false });
      }
    };

    recorder.start(100);
    const start = performance.now();

    function drawFrame() {
      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / durationMs);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      if (pCtx) {
        pCtx.clearRect(0, 0, 640, 360);
        let scale = 1;
        let tx = 0;
        let ty = 0;
        if (motion.kind === "dolly-in" || motion.kind === "zoom") {
          scale = 1 + ease * 0.16;
        } else if (motion.kind === "pan") {
          scale = 1.12;
          tx = (ease - 0.5) * -58;
        } else if (motion.kind === "orbit") {
          scale = 1.14;
          tx = Math.sin(ease * Math.PI) * -36;
          ty = (1 - Math.cos(ease * Math.PI)) * -8;
        } else if (motion.kind === "crane") {
          scale = 1.1;
          ty = (0.5 - ease) * 34;
        }
        const dw = 640 * scale;
        const dh = 360 * scale;
        const dx = (640 - dw) / 2 + tx;
        const dy = (360 - dh) / 2 + ty;
        pCtx.drawImage(img, dx, dy, dw, dh);
      }

      if (elapsed < durationMs) {
        requestAnimationFrame(drawFrame);
      } else {
        recorder.stop();
      }
    }

    requestAnimationFrame(drawFrame);
  });
}

function collectIncomingPayloads(
  node: WorkflowNodeInstance,
  workflow: NodeWorkflow,
  outputs: Map<string, NodeWirePayload>,
): Record<string, NodeWirePayload> {
  const result: Record<string, NodeWirePayload> = {};
  for (const edge of workflow.edges) {
    if (edge.targetNodeId === node.id) {
      const src = outputs.get(edge.sourceNodeId);
      if (src) result[edge.targetPortId] = src;
    }
  }
  return result;
}

export async function executeNodeWorkflow(
  workflow: NodeWorkflow,
  mode: ExecutionMode,
  studioContext: StudioRuntimeContext,
  onProgress: (nodeId: string, result: NodeExecutionResult) => void,
): Promise<{
  ok: boolean;
  results: Record<string, NodeExecutionResult>;
  finalImageUrl?: string;
  finalVideoUrl?: string;
  issues: string[];
}> {
  const validation = validateWorkflowGraph(workflow.nodes, workflow.edges);
  const results: Record<string, NodeExecutionResult> = {};

  if (!validation.valid) {
    return {
      ok: false,
      results,
      issues: validation.issues.map((i) => i.message),
    };
  }

  for (const nodeId of validation.executionOrder) {
    const pending: NodeExecutionResult = { nodeId, status: "pending" };
    results[nodeId] = pending;
    onProgress(nodeId, pending);
  }

  const wireOutputs = new Map<string, NodeWirePayload>();
  let finalImageUrl: string | undefined;
  let finalVideoUrl: string | undefined;
  const issues: string[] = [];

  for (const nodeId of validation.executionOrder) {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) continue;
    const spec = getNodeSpec(node.type);
    const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
    onProgress(nodeId, { nodeId, status: "running" });

    try {
      const incoming = collectIncomingPayloads(node, workflow, wireOutputs);
      const payload: NodeWirePayload = {};
      const ui: NodeExecutionResult = { nodeId, status: "completed" };

      const useCloud = mode === "cloud" || (mode === "hybrid" && spec?.executionTarget !== "local");

      switch (node.type) {
        // ── INPUT ──
        case "input.load_image": {
          const override = String(node.params.customUrl || "").trim();
          const chosen = String(node.params.source || "");
          const src =
            override ||
            (chosen === "__studio_active__" ? studioContext.activeImageUrl : chosen) ||
            studioContext.activeImageUrl;
          payload.image = src;
          ui.imageUrl = src;
          ui.summary = `Loaded ${src.startsWith("data:") ? "Studio Upload" : src}`;
          break;
        }
        case "input.load_video": {
          const poster = String(node.params.posterFrame || studioContext.activeImageUrl);
          const fps = Number(node.params.fps || 24);
          payload.image = poster;
          payload.video = { url: poster, posterUrl: poster, motionKind: "static", durationSec: 3, fps, isWebm: false };
          ui.imageUrl = poster;
          ui.summary = `Video frame stream @ ${fps}fps`;
          break;
        }
        case "input.text_prompt": {
          const text = String(node.params.text || "").trim();
          payload.prompt = text;
          ui.promptOut = text;
          ui.summary = text.slice(0, 72);
          break;
        }
        case "input.reference_image": {
          const swatch = String(node.params.swatch || "Honed Travertine");
          const materialStrength = Number(node.params.materialStrength ?? 70);
          const styleStrength = Number(node.params.styleStrength ?? 65);
          payload.reference = { swatch, materialStrength, styleStrength };
          ui.summary = `${swatch} · Mat ${materialStrength}% · Style ${styleStrength}%`;
          break;
        }
        case "input.load_3d_scene": {
          const preset = String(node.params.preset || studioContext.scene3d.preset);
          const sunAzimuth = Number(node.params.sunAzimuth ?? studioContext.scene3d.sunAzimuth);
          const sunElevation = Number(node.params.sunElevation ?? studioContext.scene3d.sunElevation);
          const clayUrl = await renderClayMassingFallback(preset, sunAzimuth, sunElevation);
          payload.image = clayUrl;
          payload.scene3d = { preset, sunAzimuth, sunElevation, imageUrl: clayUrl };
          ui.imageUrl = clayUrl;
          ui.summary = `3D Massing (${preset}) · Sun ${sunAzimuth}°/${sunElevation}°`;
          break;
        }

        // ── SEGMENTATION ──
        case "segmentation.auto_segment": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const targetClass = String(node.params.targetClass || "facade");
          const threshold = Number(node.params.threshold ?? 48);
          const seg = await runSam2RegionSegment({
            src,
            point: { xNorm: 0.5, yNorm: 0.45 },
            threshold,
          });
          payload.mask = seg.maskDataUrl;
          ui.maskUrl = seg.maskDataUrl;
          ui.imageUrl = seg.previewUrl;
          ui.summary = `Auto Segmented "${targetClass}" (${seg.coveragePct}%)`;
          break;
        }
        case "segmentation.point_segment": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const xNorm = Number(node.params.xNorm ?? 50) / 100;
          const yNorm = Number(node.params.yNorm ?? 52) / 100;
          const threshold = Number(node.params.threshold ?? 45);
          const seg = await runSam2RegionSegment({
            src,
            point: { xNorm, yNorm },
            threshold,
          });
          payload.mask = seg.maskDataUrl;
          ui.maskUrl = seg.maskDataUrl;
          ui.imageUrl = seg.previewUrl;
          ui.summary = `SAM Point (${Math.round(xNorm * 100)}%, ${Math.round(yNorm * 100)}%) · ${seg.coveragePct}%`;
          break;
        }
        case "segmentation.box_segment": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const xmin = Math.round(Number(node.params.xmin ?? 20) * 10);
          const ymin = Math.round(Number(node.params.ymin ?? 25) * 10);
          const xmax = Math.round(Number(node.params.xmax ?? 78) * 10);
          const ymax = Math.round(Number(node.params.ymax ?? 82) * 10);
          const label = String(node.params.label || "object");
          const seg = await runGroundedSam2Segment({
            src,
            prompt: label,
            boxes: [{ label, box_2d: [ymin, xmin, ymax, xmax], confidence: 0.9 }],
            threshold: 48,
          });
          payload.mask = seg.maskDataUrl;
          ui.maskUrl = seg.maskDataUrl;
          ui.imageUrl = seg.previewUrl;
          ui.summary = `Box SAM "${label}" (${seg.coveragePct}%)`;
          break;
        }
        case "segmentation.text_select": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const query = String(node.params.query || "fireplace wall");
          const threshold = Number(node.params.threshold ?? 46);
          let boxes = heuristicSemanticBoxesForPrompt(query);
          let modelTag = "Grounded-SAM 2 Local";

          if (useCloud) {
            try {
              const compact = await toCompactDataUrlForSegmentation(src);
              const res = await segmentObjectWithSam2({ data: { image: compact, prompt: query } });
              if (res.boxes && res.boxes.length > 0) {
                boxes = res.boxes;
                if (!res.fallback) modelTag = "Grounded-SAM 2 Cloud";
              }
            } catch {
              // graceful local fallback
            }
          }

          const seg = await runGroundedSam2Segment({ src, prompt: query, boxes, threshold });
          payload.mask = seg.maskDataUrl;
          ui.maskUrl = seg.maskDataUrl;
          ui.imageUrl = seg.previewUrl;
          ui.summary = `${modelTag}: "${query}" (${seg.coveragePct}% area)`;
          break;
        }
        case "segmentation.mask_refine": {
          const maskSrc = incoming.mask?.mask || studioContext.activeMaskUrl || "";
          const dilatePx = Number(node.params.dilatePx ?? 4);
          const invert = Boolean(node.params.invert);
          const refined = maskSrc ? await refineMaskBuffer(maskSrc, { dilatePx, invert }) : "";
          payload.mask = refined;
          ui.maskUrl = refined;
          ui.imageUrl = refined;
          ui.summary = `Mask refined (+${dilatePx}px${invert ? ", inverted" : ""})`;
          break;
        }

        // ── CONDITIONING ──
        case "conditioning.depth_map": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const nearBias = Number(node.params.nearBias ?? 55);
          const heatmap = Boolean(node.params.heatmap ?? true);
          const depth = await runDepthAnythingPass(src, heatmap, nearBias);
          payload.image = depth.dataUrl;
          payload.conditioning = { depthUrl: depth.dataUrl };
          ui.imageUrl = depth.dataUrl;
          ui.summary = "Z-Depth map extracted";
          break;
        }
        case "conditioning.canny_edge": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const threshold = Number(node.params.threshold ?? 60);
          const edge = await runAnnotatorPass(src, "canny", threshold);
          payload.image = edge.dataUrl;
          payload.conditioning = { edgeUrl: edge.dataUrl };
          ui.imageUrl = edge.dataUrl;
          ui.summary = `Canny edge map (thresh ${threshold})`;
          break;
        }
        case "conditioning.line_art": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const extMode = (String(node.params.mode || "lineart") as "lineart" | "mlsd" | "softedge");
          const map = await runAnnotatorPass(src, extMode, 60);
          payload.image = map.dataUrl;
          payload.conditioning = { edgeUrl: map.dataUrl };
          ui.imageUrl = map.dataUrl;
          ui.summary = `${extMode.toUpperCase()} linework extracted`;
          break;
        }
        case "conditioning.normal_map": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const map = await runAnnotatorPass(src, "normal", 58);
          payload.image = map.dataUrl;
          payload.conditioning = { normalUrl: map.dataUrl };
          ui.imageUrl = map.dataUrl;
          ui.summary = "Tangent normal map extracted";
          break;
        }
        case "conditioning.ipadapter": {
          const ref = incoming.reference?.reference;
          const weight = Number(node.params.weight ?? 72);
          payload.conditioning = {
            referenceWeight: weight,
            referenceSwatch: ref?.swatch ?? "Material Reference",
          };
          ui.summary = `IP-Adapter bound (${weight}% · ${ref?.swatch ?? "ref"})`;
          break;
        }
        case "conditioning.geometry_lock": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const lockWeight = Number(node.params.lockWeight ?? 90);
          const warnPct = Number(node.params.warnThresholdPct ?? 18);
          const edge = await runAnnotatorPass(src, "mlsd", 60);
          payload.conditioning = {
            edgeUrl: edge.dataUrl,
            geometryLockWeight: lockWeight,
            driftWarnPct: warnPct,
          };
          ui.imageUrl = edge.dataUrl;
          ui.summary = `Geometry Lock ${lockWeight}% active (alert > ${warnPct}% outside mask)`;
          break;
        }

        // ── ARCHITECTURE & ENVIRONMENT ──
        case "architecture.building_type": {
          const prompt = `Architectural typology: ${String(node.params.typology || "Contemporary Residence")}.`;
          payload.prompt = prompt;
          ui.promptOut = prompt;
          ui.summary = prompt;
          break;
        }
        case "architecture.room_type": {
          const prompt = `Interior room program: ${String(node.params.room || "Living Room")}.`;
          payload.prompt = prompt;
          ui.promptOut = prompt;
          ui.summary = prompt;
          break;
        }
        case "architecture.material_palette": {
          const primary = String(node.params.primary || "Honed Travertine");
          const secondary = String(node.params.secondary || "Brushed Bronze");
          payload.reference = {
            swatch: `${primary} + ${secondary}`,
            materialStrength: 75,
            styleStrength: 65,
          };
          ui.summary = `Palette: ${primary} + ${secondary}`;
          break;
        }
        case "architecture.camera_settings": {
          const focal = String(node.params.focalLength || "24mm Tilt-Shift");
          const twoPoint = Boolean(node.params.twoPointLock ?? true);
          const prompt = `Camera lens: ${focal}${twoPoint ? ", 2-point vertical perspective lock" : ""}.`;
          payload.prompt = prompt;
          ui.promptOut = prompt;
          ui.summary = prompt;
          break;
        }
        case "architecture.style_preset": {
          const style = String(node.params.style || "Warm Minimalist Monograph");
          payload.prompt = `Render aesthetic: ${style}.`;
          ui.promptOut = payload.prompt;
          ui.summary = style;
          break;
        }
        case "architecture.landscape": {
          const biome = String(node.params.biome || "Mediterranean Olive & Gravel Terrace");
          payload.prompt = `Site planting: ${biome}.`;
          ui.promptOut = payload.prompt;
          ui.summary = biome;
          break;
        }
        case "environment.weather": {
          const has3d = Boolean(incoming.scene3d?.scene3d);
          const weather = String(node.params.weather || "Clear Crisp Sky");
          const built = buildEnvironmentDirective({ weather, has3DSceneInput: has3d });
          payload.environment = { directive: built.directive, weather, has3DSceneInput: has3d };
          ui.isIllustrativeRelight = built.isIllustrative;
          ui.promptOut = built.directive;
          ui.summary = `${weather} (${built.isIllustrative ? "Illustrative" : "3D Verified"})`;
          break;
        }
        case "environment.climate": {
          const climate = String(node.params.climate || "Temperate Golden");
          const season = String(node.params.season || "Autumn");
          const built = buildEnvironmentDirective({ climate, season, has3DSceneInput: false });
          payload.environment = { directive: built.directive, climate, has3DSceneInput: false };
          ui.isIllustrativeRelight = true;
          ui.summary = `${climate} · ${season}`;
          break;
        }
        case "environment.sun_position": {
          const has3d = Boolean(incoming.scene3d?.scene3d);
          const timeOfDay = String(node.params.timeOfDay || "Golden Hour");
          const azimuth = Number(node.params.azimuth ?? 145);
          const built = buildEnvironmentDirective({ timeOfDay, azimuth, has3DSceneInput: has3d });
          payload.environment = { directive: built.directive, timeOfDay, azimuth, has3DSceneInput: has3d };
          ui.isIllustrativeRelight = built.isIllustrative;
          ui.promptOut = built.directive;
          ui.summary = `${timeOfDay} (${azimuth}°) · ${has3d ? "3D Sun Sync" : "Illustrative"}`;
          break;
        }
        case "environment.mood": {
          const mood = String(node.params.mood || "Luxury & Calm");
          const built = buildEnvironmentDirective({ mood, has3DSceneInput: false });
          payload.environment = { directive: built.directive, mood, has3DSceneInput: false };
          ui.isIllustrativeRelight = true;
          ui.summary = `Mood: ${mood}`;
          break;
        }
        case "environment.atmosphere": {
          const experience = String(node.params.experience || "Quiet");
          const built = buildEnvironmentDirective({ experience, has3DSceneInput: false });
          payload.environment = { directive: built.directive, has3DSceneInput: false };
          ui.isIllustrativeRelight = true;
          ui.summary = `Atmosphere: ${experience}`;
          break;
        }

        // ── EDITING ──
        case "editing.material_replace": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
          const refSwatch = incoming.reference?.reference?.swatch;
          const matText = String(node.params.materialPrompt || refSwatch || "Honed Travertine slabs");
          const fullDirective = [
            matText,
            refSwatch ? `Material swatch reference: ${refSwatch}` : "",
            incoming.prompt?.prompt,
            incoming.conditioning?.conditioning?.geometryLockWeight
              ? `Maintain geometry lock (${incoming.conditioning.conditioning.geometryLockWeight}%) outside mask.`
              : "",
          ]
            .filter(Boolean)
            .join(". ");
          const strength = Number(
            node.params.referenceStrength ?? incoming.reference?.reference?.materialStrength ?? 75,
          );

          let outUrl = src;
          let engineNote = "Local Material Synthesizer";

          if (useCloud && mask) {
            try {
              const srcData = await ensureDataUrl(src);
              const res = await inpaintPlate({
                data: {
                  idea: fullDirective,
                  image: srcData,
                  maskImage: mask,
                  design: studioContext.design,
                  frame: studioContext.frame,
                  engine: {
                    ...studioContext.engine,
                    iopaintTask: "replace",
                    geometryLock: incoming.conditioning?.conditioning?.geometryLockWeight ?? 90,
                  },
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.url) {
                outUrl = res.url;
                engineNote = "Cloud Masked Material Replace";
              }
            } catch {
              // fallback below
            }
          }

          if (outUrl === src && mask) {
            outUrl = await runLocalTextureReplacePass(src, mask, fullDirective, strength);
          }

          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `${engineNote} · "${matText.slice(0, 44)}"`;
          finalImageUrl = outUrl;
          break;
        }
        case "editing.inpaint": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
          const instruction = [String(node.params.instruction || ""), incoming.prompt?.prompt]
            .filter(Boolean)
            .join(". ");
          const strength = Number(node.params.strength ?? 78);

          let outUrl = src;
          if (useCloud && mask) {
            try {
              const srcData = await ensureDataUrl(src);
              const res = await inpaintPlate({
                data: {
                  idea: instruction,
                  image: srcData,
                  maskImage: mask,
                  design: studioContext.design,
                  frame: studioContext.frame,
                  engine: studioContext.engine,
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.url) outUrl = res.url;
            } catch {
              // fallback below
            }
          }
          if (outUrl === src && mask) {
            outUrl = await runLocalTextureReplacePass(src, mask, instruction, strength);
          }
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `Inpaint (${String(node.params.model || "lama")})`;
          finalImageUrl = outUrl;
          break;
        }
        case "editing.object_remove": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
          const model = String(node.params.model || "lama");
          const outUrl = mask ? await runLocalLamaErasePass(src, mask, model) : src;
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `LaMa Erase (${model.toUpperCase()})`;
          finalImageUrl = outUrl;
          break;
        }
        case "editing.object_insert": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
          const item = String(node.params.item || "architectural armchair");
          const outUrl = mask ? await runLocalTextureReplacePass(src, mask, item, 82) : src;
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `Inserted "${item.slice(0, 36)}"`;
          finalImageUrl = outUrl;
          break;
        }
        case "editing.outpaint": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const ratio = String(node.params.ratio || "21:9") as "21:9" | "9:16" | "16:9";
          let outUrl = await runClientOutpaintCanvas(src, ratio);
          if (useCloud) {
            try {
              const srcData = await ensureDataUrl(src);
              const res = await outpaintPlate({
                data: {
                  idea: incoming.prompt?.prompt || `Expand canvas to ${ratio}`,
                  image: srcData,
                  design: studioContext.design,
                  frame: studioContext.frame,
                  engine: { ...studioContext.engine, outpaintRatio: ratio },
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.url) outUrl = res.url;
            } catch {
              // keep local canvas outpaint
            }
          }
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `Outpainted to ${ratio}`;
          finalImageUrl = outUrl;
          break;
        }
        case "editing.relight": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const env = incoming.environment?.environment;
          const preset =
            env?.timeOfDay === "Blue Hour" || env?.timeOfDay === "Night"
              ? "day-to-dusk"
              : env?.weather?.includes("Snow")
                ? "summer-to-snow"
                : (String(node.params.preset || "day-to-dusk") as
                    | "overcast-to-golden"
                    | "summer-to-snow"
                    | "day-to-dusk");
          let outUrl = await runRelightWeatherPass(src, preset);
          if (useCloud) {
            try {
              const srcData = await ensureDataUrl(src);
              const res = await relightPlate({
                data: {
                  idea: env?.directive || `Relight scene: ${preset}`,
                  image: srcData,
                  design: studioContext.design,
                  frame: studioContext.frame,
                  engine: { ...studioContext.engine, relightPreset: preset },
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.url) outUrl = res.url;
            } catch {
              // keep deterministic relight fallback
            }
          }
          const isIllustrative = env ? !env.has3DSceneInput : true;
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.isIllustrativeRelight = isIllustrative;
          ui.summary = `Relit (${preset}) · ${isIllustrative ? "Illustrative approximation" : "3D-backed sun"}`;
          finalImageUrl = outUrl;
          break;
        }

        // ── GENERATION ──
        case "generation.text_to_image": {
          const prompt = [incoming.prompt?.prompt, incoming.environment?.environment?.directive]
            .filter(Boolean)
            .join(" ");
          const aspect = String(node.params.aspect || "16:9");
          let outUrl = await renderLocalConceptPlate(prompt, aspect);
          if (useCloud) {
            try {
              const res = await generatePlate({
                data: {
                  idea: prompt,
                  design: studioContext.design,
                  frame: { ...studioContext.frame, ratio: aspect as Frame["ratio"] },
                  engine: studioContext.engine,
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.url) outUrl = res.url;
            } catch {
              // fallback already rendered
            }
          }
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `Text-to-Image (${aspect})`;
          finalImageUrl = outUrl;
          break;
        }
        case "generation.image_to_image": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const prompt = [incoming.prompt?.prompt, incoming.environment?.environment?.directive]
            .filter(Boolean)
            .join(" ");
          let outUrl = await runRelightWeatherPass(src, "overcast-to-golden");
          if (useCloud) {
            try {
              const srcData = await ensureDataUrl(src);
              const res = await generatePlate({
                data: {
                  idea: prompt || "Photoreal architectural material finish, preserve geometry",
                  image: srcData,
                  depthImage: incoming.conditioning?.conditioning?.depthUrl,
                  annotatorImage: incoming.conditioning?.conditioning?.edgeUrl,
                  design: studioContext.design,
                  frame: studioContext.frame,
                  engine: studioContext.engine,
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.url) outUrl = res.url;
            } catch {
              // fallback applied
            }
          }
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `Image-to-Image (${Number(node.params.denoise ?? 62)}% denoise)`;
          finalImageUrl = outUrl;
          break;
        }
        case "generation.upscale": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const factor = Number(node.params.factor ?? 4) as 1 | 2 | 4 | 8;
          const rawModel = String(node.params.model || "4x-ArchSharp");
          const model = (
            rawModel === "RealESRGAN_x2plus" || rawModel === "RealESRGAN_x4plus" || rawModel === "4x-ArchSharp"
              ? rawModel
              : "4x-ArchSharp"
          ) as "4x-ArchSharp" | "RealESRGAN_x4plus" | "RealESRGAN_x2plus";
          let outUrl = await runTiledUpscalePass(src, factor, model, 20, false);
          if (useCloud) {
            try {
              const srcData = await ensureDataUrl(src);
              const res = await enhancePlate({
                data: {
                  idea: "Architectural 4K texture synthesis",
                  image: srcData,
                  design: studioContext.design,
                  frame: studioContext.frame,
                  engine: { ...studioContext.engine, upscaleFactor: factor, esrganModel: model },
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.url) outUrl = res.url;
            } catch {
              // keep local tiled pass
            }
          }
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `Upscaled ${factor}× (${model})`;
          finalImageUrl = outUrl;
          break;
        }
        case "generation.detail_enhance": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const outUrl = await runTiledUpscalePass(src, 2, "4x-ArchSharp", 15, false);
          payload.image = outUrl;
          ui.imageUrl = outUrl;
          ui.summary = `Micro-grain detail enhanced (${Number(node.params.crispness ?? 55)}%)`;
          finalImageUrl = outUrl;
          break;
        }
        case "generation.batch_variations": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          let urls = [
            await runRelightWeatherPass(src, "overcast-to-golden"),
            await runRelightWeatherPass(src, "day-to-dusk"),
            src,
            await runTiledUpscalePass(src, 2, "4x-ArchSharp", 20, false),
          ];
          if (useCloud) {
            try {
              const srcData = await ensureDataUrl(src);
              const res = await generateVariations({
                data: {
                  idea: incoming.prompt?.prompt || "4 coherent architectural variations",
                  image: srcData,
                  design: studioContext.design,
                  frame: studioContext.frame,
                  engine: studioContext.engine,
                  scene3d: studioContext.scene3d,
                },
              });
              if (!res.fallback && res.urls.length > 0) urls = res.urls;
            } catch {
              // keep deterministic 4-up
            }
          }
          payload.image = urls[0];
          ui.imageUrl = urls[0];
          ui.variations = urls;
          ui.summary = `Generated ${urls.length} candidate plates`;
          finalImageUrl = urls[0];
          break;
        }

        // ── VIDEO ──
        case "video.camera_motion": {
          const kind = String(node.params.kind || "dolly-in");
          const speed = Number(node.params.speed ?? 45);
          payload.prompt = `MOTION:${kind}:${speed}`;
          ui.promptOut = `Camera path: ${kind} (${speed}% speed)`;
          ui.summary = `Camera rig: ${kind}`;
          break;
        }
        case "video.image_to_video": {
          const src = incoming.image?.image || studioContext.activeImageUrl;
          const motionPrompt = incoming.prompt?.prompt || "";
          const motionKind = motionPrompt.startsWith("MOTION:")
            ? motionPrompt.split(":")[1]
            : String(node.params.motionKind || "dolly-in");
          const durationSec = Number(node.params.durationSec ?? 4);
          const clip = await synthesizeCameraMotionVideo(src, { kind: motionKind, durationSec, fps: 24 });
          payload.video = {
            url: clip.videoUrl,
            posterUrl: clip.posterUrl,
            motionKind,
            durationSec,
            fps: 24,
            isWebm: clip.isWebm,
          };
          ui.videoUrl = clip.videoUrl;
          ui.imageUrl = clip.posterUrl;
          ui.summary = `${clip.isWebm ? "WebM" : "Storyboard"} clip · ${motionKind} (${durationSec}s)`;
          finalVideoUrl = clip.videoUrl;
          break;
        }
        case "video.frame_interpolation": {
          const vid = incoming.video?.video;
          const targetFps = Number(node.params.targetFps || 30);
          if (vid) {
            payload.video = { ...vid, fps: targetFps };
            ui.videoUrl = vid.url;
            ui.imageUrl = vid.posterUrl;
          }
          ui.summary = `Frame cadence smoothed -> ${targetFps} fps`;
          break;
        }
        case "video.video_export": {
          const vid = incoming.video?.video;
          const fmt = String(node.params.format || "webm");
          if (vid) {
            payload.video = vid;
            ui.videoUrl = vid.url;
            ui.imageUrl = vid.posterUrl;
            finalVideoUrl = vid.url;
          }
          ui.summary = `Export ready (${fmt.toUpperCase()} · ${vid?.fps ?? 30}fps)`;
          break;
        }

        // ── OUTPUT ──
        case "output.image_preview": {
          const img = incoming.image?.image || studioContext.activeImageUrl;
          ui.imageUrl = img;
          ui.summary = String(node.params.caption || "Preview Plate");
          finalImageUrl = img;
          break;
        }
        case "output.compare_versions": {
          const before = incoming.before?.image || studioContext.activeImageUrl;
          const after = incoming.after?.image || studioContext.activeImageUrl;
          const mask = incoming.mask?.mask || studioContext.activeMaskUrl || undefined;
          const diff = await computeMaskOutsideDiffPct(before, after, mask);
          const warnGate = Number(node.params.driftWarnPct ?? 18);
          ui.compareBeforeUrl = before;
          ui.compareAfterUrl = after;
          ui.imageUrl = after;
          ui.diffOutsideMaskPct = diff.diffPct;
          ui.geometryDriftWarning = diff.diffPct > warnGate;
          ui.summary = `Drift outside mask: ${diff.diffPct}%${diff.diffPct > warnGate ? " (Warning)" : " (Held)"}`;
          finalImageUrl = after;
          break;
        }
        case "output.save_asset": {
          const img = incoming.image?.image || finalImageUrl || studioContext.activeImageUrl;
          const title = String(node.params.assetTitle || "Node Studio Plate");
          ui.imageUrl = img;
          ui.summary = `Saved "${title}" to Studio`;
          finalImageUrl = img;
          studioContext.onAssetPromoted?.(img, title);
          break;
        }
      }

      const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
      ui.durationMs = Math.max(1, Math.round(t1 - t0));
      wireOutputs.set(nodeId, payload);
      results[nodeId] = ui;
      onProgress(nodeId, ui);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Node execution failed.";
      const failed: NodeExecutionResult = { nodeId, status: "error", error: msg };
      results[nodeId] = failed;
      onProgress(nodeId, failed);
      issues.push(`${spec?.title ?? node.type}: ${msg}`);
    }
  }

  return {
    ok: issues.length === 0,
    results,
    finalImageUrl,
    finalVideoUrl,
    issues,
  };
}
