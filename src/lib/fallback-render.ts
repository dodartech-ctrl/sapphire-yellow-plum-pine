import type { EngineState, Scene3DState } from "@/lib/engines";
import type { DesignState } from "@/lib/properties";

const PLATE_POOL: Record<DesignState["vertical"], string[]> = {
  exterior: [
    "/viz/p01-pavilion-dusk.jpg",
    "/viz/p01-pavilion-day.jpg",
    "/viz/t05-subtropical-home.jpg",
    "/viz/t10-home-dusk-edit.jpg",
    "/viz/t01-public-library.jpg",
    "/viz/t07-cultural-campus.jpg",
  ],
  interior: [
    "/viz/p02-loft-after.jpg",
    "/viz/t03-compact-living-room.jpg",
    "/viz/t09-r1-living-room-clay-edit.jpg",
    "/viz/t04-neighborhood-cafe.jpg",
    "/viz/t08-material-junction.jpg",
  ],
  amenities: [
    "/viz/t06-urban-courtyard.jpg",
    "/viz/t04-neighborhood-cafe.jpg",
    "/viz/p01-pavilion-dusk.jpg",
    "/viz/t10-home-dusk-edit.jpg",
  ],
  landscape: [
    "/viz/t06-urban-courtyard.jpg",
    "/viz/t05-subtropical-home.jpg",
    "/viz/t07-cultural-campus.jpg",
    "/viz/p01-pavilion-day.jpg",
  ],
};

export function pickServerFallbackPlate(
  design: DesignState,
  engine: EngineState,
  seed: number,
  variantIndex = 0,
): string {
  const pool = PLATE_POOL[design.vertical] ?? PLATE_POOL.exterior;
  if (design.light === "Evening" || design.light === "Night" || design.time === "Evening" || design.time === "Night") {
    if (design.vertical === "exterior" && variantIndex === 0) return "/viz/p01-pavilion-dusk.jpg";
  }
  if (engine.workflowPreset === "interior-restyle" && variantIndex === 0) {
    return "/viz/p02-loft-after.jpg";
  }
  const idx = Math.abs(seed + variantIndex * 3) % pool.length;
  return pool[idx] ?? "/viz/p01-pavilion-dusk.jpg";
}

export function pickFourFallbackPlates(design: DesignState, engine: EngineState, seed: number): string[] {
  const pool = [...(PLATE_POOL[design.vertical] ?? PLATE_POOL.exterior), ...PLATE_POOL.exterior, ...PLATE_POOL.interior];
  const unique: string[] = [];
  for (let i = 0; i < pool.length && unique.length < 4; i++) {
    const candidate = pool[(Math.abs(seed) + i) % pool.length];
    if (candidate && !unique.includes(candidate)) unique.push(candidate);
  }
  while (unique.length < 4) unique.push("/viz/p01-pavilion-dusk.jpg");
  return unique;
}

function loadImageEl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = src;
  });
}

/**
 * Client-side deterministic fallback plate synthesizer.
 * When live AI credentials are absent, transforms the user's captured 3D snapshot,
 * sketch overlay, or masked region with calibrated architectural lighting/contrast
 * grading so the full pipeline remains immediately demonstrable.
 */
export async function synthesizeFallbackComposite(params: {
  baseImage?: string;
  sketchImage?: string;
  maskImage?: string;
  serverFallbackUrl: string;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  variantIndex?: number;
  isEnhance?: boolean;
}): Promise<string> {
  const sourceSrc = params.baseImage || params.serverFallbackUrl;
  try {
    const baseImg = await loadImageEl(sourceSrc);
    const width = Math.min(1440, Math.max(800, baseImg.naturalWidth || 1280));
    const height = Math.round((width / (baseImg.naturalWidth || 16)) * (baseImg.naturalHeight || 9));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return params.serverFallbackUrl;

    const vIdx = params.variantIndex ?? 0;
    const isDusk =
      params.design.light === "Evening" ||
      params.design.light === "Night" ||
      params.scene3d.sunElevation <= 12 ||
      vIdx === 2;
    const isGolden = params.design.light === "Golden hour" || vIdx === 1;

    ctx.save();
    if (params.isEnhance) {
      ctx.filter = "contrast(1.12) saturate(1.1) brightness(1.03)";
    } else if (isDusk) {
      ctx.filter = "contrast(1.14) saturate(0.92) brightness(0.86) hue-rotate(-8deg)";
    } else if (isGolden) {
      ctx.filter = "contrast(1.08) saturate(1.16) sepia(0.14) brightness(1.02)";
    } else if (vIdx === 3) {
      ctx.filter = "contrast(1.18) saturate(0.72) brightness(1.01)";
    } else {
      ctx.filter = "contrast(1.06) saturate(1.06)";
    }
    ctx.drawImage(baseImg, 0, 0, width, height);
    ctx.restore();

    // Subtle atmospheric lighting gradient matching selected light / solar elevation
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (isDusk) {
      grad.addColorStop(0, "rgba(24, 52, 92, 0.28)");
      grad.addColorStop(0.65, "rgba(212, 176, 106, 0.14)");
      grad.addColorStop(1, "rgba(18, 16, 14, 0.34)");
    } else if (isGolden) {
      grad.addColorStop(0, "rgba(246, 198, 114, 0.24)");
      grad.addColorStop(1, "rgba(42, 28, 12, 0.18)");
    } else {
      grad.addColorStop(0, "rgba(255, 250, 240, 0.10)");
      grad.addColorStop(1, "rgba(20, 17, 15, 0.14)");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Blend PromeAI sketch strokes subtly as crisp architectural line accents
    if (params.sketchImage) {
      try {
        const sketchImg = await loadImageEl(params.sketchImage);
        ctx.save();
        ctx.globalAlpha = Math.max(0.25, params.engine.edgeAdherence / 120);
        ctx.drawImage(sketchImg, 0, 0, width, height);
        ctx.restore();
      } catch {
        // Ignore unrenderable sketch buffer
      }
    }

    // Apply localized Krea AI mask illumination/material tint inside painted regions
    if (params.maskImage) {
      try {
        const maskImg = await loadImageEl(params.maskImage);
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = width;
        maskCanvas.height = height;
        const mCtx = maskCanvas.getContext("2d");
        if (mCtx) {
          mCtx.drawImage(maskImg, 0, 0, width, height);
          mCtx.globalCompositeOperation = "source-in";
          const tint = isDusk ? "rgba(235, 192, 110, 0.55)" : "rgba(244, 232, 206, 0.45)";
          mCtx.fillStyle = tint;
          mCtx.fillRect(0, 0, width, height);

          ctx.save();
          ctx.globalAlpha = Math.max(0.3, params.engine.inpaintStrength / 100);
          ctx.drawImage(maskCanvas, 0, 0);
          ctx.restore();
        }
      } catch {
        // Ignore unrenderable mask buffer
      }
    }

    // Architectural monograph edge vignette
    const vignette = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.3, width * 0.5, height * 0.5, width * 0.72);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(18,14,10,0.22)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    return canvas.toDataURL("image/jpeg", 0.9);
  } catch {
    return params.serverFallbackUrl;
  }
}
