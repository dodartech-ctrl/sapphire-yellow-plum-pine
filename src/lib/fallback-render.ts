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

export type AtmosphereLightingMood = "noon" | "golden" | "dusk" | "night" | "overcast" | "snow";

export type AtmosphereProfile = {
  lightingMood: AtmosphereLightingMood;
  filterCss: string;
  overlayTop: string;
  overlayMid: string;
  overlayBottom: string;
  glowColor?: string;
  seedVariant: number;
};

export function hashPromptSeed(text: string): number {
  const clean = text.trim().toLowerCase();
  if (!clean) return 0;
  let h = 2166136261;
  for (let i = 0; i < clean.length; i++) {
    h ^= clean.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function inferAtmosphereProfile(params: {
  design: DesignState;
  scene3d?: Scene3DState;
  idea?: string;
  variantIndex?: number;
  renderIteration?: number;
  isEnhance?: boolean;
}): AtmosphereProfile {
  const ideaLow = (params.idea ?? "").toLowerCase();
  const lightLow = params.design.light.toLowerCase();
  const timeLow = params.design.time.toLowerCase();
  const weatherLow = params.design.weather.toLowerCase();
  const lookLow = params.design.look.toLowerCase();
  const vIdx = params.variantIndex ?? 0;
  const iter = params.renderIteration ?? 0;
  const seedVariant = Math.abs(hashPromptSeed(`${params.idea ?? ""}|${params.design.look}|${params.design.light}|${vIdx}|${iter}`)) % 7;

  let lightingMood: AtmosphereLightingMood = "noon";
  if (/snow|winter|frost|nordic overcast/.test(ideaLow) || /snow/.test(weatherLow)) {
    lightingMood = "snow";
  } else if (/night|nocturne|midnight/.test(ideaLow) || lightLow === "night" || timeLow === "night") {
    lightingMood = "night";
  } else if (/dusk|twilight|evening|blue hour/.test(ideaLow) || lightLow === "evening" || timeLow === "evening" || (params.scene3d?.sunElevation ?? 30) <= 12 || vIdx === 2) {
    lightingMood = "dusk";
  } else if (/golden|sunset|amber|warm/.test(ideaLow) || lightLow === "golden hour" || vIdx === 1) {
    lightingMood = "golden";
  } else if (/overcast|mist|fog|rain|soft/.test(ideaLow) || lightLow === "soft overcast" || /rain|fog|overcast/.test(weatherLow) || vIdx === 3) {
    lightingMood = "overcast";
  }

  if (params.isEnhance) {
    return {
      lightingMood,
      filterCss: "contrast(1.12) saturate(1.10) brightness(1.03)",
      overlayTop: "rgba(255, 250, 240, 0.06)",
      overlayMid: "rgba(212, 176, 106, 0.04)",
      overlayBottom: "rgba(18, 16, 14, 0.14)",
      seedVariant,
    };
  }

  const boostContrast = 1 + (seedVariant % 3) * 0.03 + (/brutalist|minimalist|sharp/.test(lookLow) ? 0.04 : 0);
  const boostSat = /timber|warm|tropical|mediterranean/.test(`${lookLow} ${ideaLow}`) ? 1.12 : 1.0;

  switch (lightingMood) {
    case "night":
      return {
        lightingMood,
        filterCss: `contrast(${(1.18 * boostContrast).toFixed(2)}) saturate(0.84) brightness(0.78) hue-rotate(-10deg)`,
        overlayTop: "rgba(12, 26, 48, 0.42)",
        overlayMid: "rgba(220, 170, 92, 0.14)",
        overlayBottom: "rgba(8, 10, 14, 0.44)",
        glowColor: "rgba(255, 198, 112, 0.24)",
        seedVariant,
      };
    case "dusk":
      return {
        lightingMood,
        filterCss: `contrast(${(1.13 * boostContrast).toFixed(2)}) saturate(${(0.94 * boostSat).toFixed(2)}) brightness(0.88) hue-rotate(-6deg)`,
        overlayTop: "rgba(24, 52, 92, 0.28)",
        overlayMid: "rgba(212, 176, 106, 0.14)",
        overlayBottom: "rgba(18, 16, 14, 0.34)",
        glowColor: "rgba(245, 194, 110, 0.20)",
        seedVariant,
      };
    case "golden":
      return {
        lightingMood,
        filterCss: `contrast(${(1.08 * boostContrast).toFixed(2)}) saturate(${(1.14 * boostSat).toFixed(2)}) sepia(0.14) brightness(1.02)`,
        overlayTop: "rgba(246, 198, 114, 0.24)",
        overlayMid: "rgba(228, 168, 92, 0.10)",
        overlayBottom: "rgba(42, 28, 12, 0.18)",
        glowColor: "rgba(255, 214, 140, 0.18)",
        seedVariant,
      };
    case "snow":
      return {
        lightingMood,
        filterCss: `contrast(${(1.12 * boostContrast).toFixed(2)}) saturate(0.70) brightness(1.06)`,
        overlayTop: "rgba(216, 232, 246, 0.26)",
        overlayMid: "rgba(235, 242, 250, 0.12)",
        overlayBottom: "rgba(38, 48, 62, 0.20)",
        seedVariant,
      };
    case "overcast":
      return {
        lightingMood,
        filterCss: `contrast(${(1.15 * boostContrast).toFixed(2)}) saturate(0.80) brightness(0.99)`,
        overlayTop: "rgba(196, 208, 222, 0.20)",
        overlayMid: "rgba(218, 220, 224, 0.08)",
        overlayBottom: "rgba(26, 28, 32, 0.22)",
        seedVariant,
      };
    case "noon":
    default:
      return {
        lightingMood,
        filterCss: `contrast(${(1.06 * boostContrast).toFixed(2)}) saturate(${(1.05 * boostSat).toFixed(2)}) brightness(${(1.01 + (seedVariant % 2) * 0.02).toFixed(2)})`,
        overlayTop: "rgba(255, 250, 240, 0.12)",
        overlayMid: "rgba(236, 226, 208, 0.06)",
        overlayBottom: "rgba(20, 17, 15, 0.14)",
        seedVariant,
      };
  }
}

export function pickServerFallbackPlate(
  design: DesignState,
  engine: EngineState,
  seed: number,
  variantIndex = 0,
  idea = "",
): string {
  const pool = PLATE_POOL[design.vertical] ?? PLATE_POOL.exterior;
  const ideaLow = idea.toLowerCase();
  const isDuskOrNight =
    design.light === "Evening" ||
    design.light === "Night" ||
    design.time === "Evening" ||
    design.time === "Night" ||
    /\b(dusk|evening|night|twilight|nocturne)\b/.test(ideaLow);
  const isDaylight =
    design.light === "Daylight" ||
    design.light === "Soft overcast" ||
    /\b(daylight|noon|morning|overcast|sunlit)\b/.test(ideaLow);

  if (engine.workflowPreset === "interior-restyle" && variantIndex === 0 && !isDaylight) {
    return "/viz/p02-loft-after.jpg";
  }

  if (variantIndex === 0) {
    if (isDuskOrNight && design.vertical === "exterior") {
      return (seed + hashPromptSeed(idea)) % 2 === 0 ? "/viz/p01-pavilion-dusk.jpg" : "/viz/t10-home-dusk-edit.jpg";
    }
    if (isDaylight && design.vertical === "exterior") {
      return (seed + hashPromptSeed(idea)) % 2 === 0 ? "/viz/p01-pavilion-day.jpg" : "/viz/t01-public-library.jpg";
    }
  }

  const promptOffset = hashPromptSeed(`${idea}|${design.look}|${design.light}|${engine.workflowPreset}`);
  const idx = Math.abs(seed + promptOffset + variantIndex * 3) % pool.length;
  return pool[idx] ?? "/viz/p01-pavilion-dusk.jpg";
}

export function pickFourFallbackPlates(design: DesignState, _engine: EngineState, seed: number, idea = ""): string[] {
  const pool = [...(PLATE_POOL[design.vertical] ?? PLATE_POOL.exterior), ...PLATE_POOL.exterior, ...PLATE_POOL.interior];
  const promptOffset = hashPromptSeed(`${idea}|${design.look}|${design.light}`);
  const unique: string[] = [];
  for (let i = 0; i < pool.length && unique.length < 4; i++) {
    const candidate = pool[(Math.abs(seed) + promptOffset + i) % pool.length];
    if (candidate && !unique.includes(candidate)) unique.push(candidate);
  }
  while (unique.length < 4) unique.push("/viz/p01-pavilion-dusk.jpg");
  return unique;
}

function loadImageEl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (/^https?:\/\//i.test(src) && typeof window !== "undefined" && !src.startsWith(window.location.origin)) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = src;
  });
}

/**
 * Client-side deterministic fallback plate synthesizer.
 * When live AI credentials are absent, transforms the user's captured 3D snapshot,
 * sketch overlay, masked region, or architectural reference plate with calibrated
 * architectural lighting/contrast grading so every render reflects the prompt and optics.
 */
export async function synthesizeFallbackComposite(params: {
  baseImage?: string;
  sketchImage?: string;
  maskImage?: string;
  serverFallbackUrl: string;
  design: DesignState;
  engine: EngineState;
  scene3d: Scene3DState;
  idea?: string;
  variantIndex?: number;
  renderIteration?: number;
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

    const atmosphere = inferAtmosphereProfile({
      design: params.design,
      scene3d: params.scene3d,
      idea: params.idea,
      variantIndex: params.variantIndex,
      renderIteration: params.renderIteration,
      isEnhance: params.isEnhance,
    });

    ctx.save();
    ctx.filter = atmosphere.filterCss;
    ctx.drawImage(baseImg, 0, 0, width, height);
    ctx.restore();

    // Directional solar atmospheric gradient calibrated to active lighting / solar rig
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, atmosphere.overlayTop);
    grad.addColorStop(0.58, atmosphere.overlayMid);
    grad.addColorStop(1, atmosphere.overlayBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    if (atmosphere.glowColor) {
      const gx = width * (0.42 + (atmosphere.seedVariant % 3) * 0.08);
      const gy = height * 0.56;
      const glow = ctx.createRadialGradient(gx, gy, width * 0.04, gx, gy, width * 0.44);
      glow.addColorStop(0, atmosphere.glowColor);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
    }

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
          const isDusk = atmosphere.lightingMood === "dusk" || atmosphere.lightingMood === "night";
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
