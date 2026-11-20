import type { Archviz100Preset, IntentLook, Preset200Item } from "@/lib/presets-catalog";

export type PresetBeforeAfterPreview = {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
  beforeFilterClass: string;
  afterFilterClass: string;
  afterTintClass: string;
  sceneHint: string;
};

const MATRIX_IMAGES = {
  clayExterior: "/viz/matrix/clay-exterior.jpg",
  interiorLuxe: "/viz/matrix/interior-luxe.jpg",
  parametricDusk: "/viz/matrix/parametric-dusk.jpg",
  urbanAerial: "/viz/matrix/urban-aerial.jpg",
  zenCourtyard: "/viz/matrix/zen-courtyard.jpg",
  pavilionDay: "/viz/p01-pavilion-day.jpg",
  pavilionDusk: "/viz/p01-pavilion-dusk.jpg",
  loftBefore: "/viz/p02-loft-before.jpg",
  loftAfter: "/viz/p02-loft-after.jpg",
  publicLibrary: "/viz/t01-public-library.jpg",
  sectionalArts: "/viz/t02-sectional-arts-center.jpg",
  livingRoom: "/viz/t03-compact-living-room.jpg",
  cafe: "/viz/t04-neighborhood-cafe.jpg",
  subtropical: "/viz/t05-subtropical-home.jpg",
  courtyard: "/viz/t06-urban-courtyard.jpg",
  campus: "/viz/t07-cultural-campus.jpg",
  materialJunction: "/viz/t08-material-junction.jpg",
  interiorClay: "/viz/t09-r1-living-room-clay-edit.jpg",
  homeDusk: "/viz/t10-home-dusk-edit.jpg",
} as const;

export const ALL_PRESET_PREVIEW_ASSETS: readonly string[] = Object.values(MATRIX_IMAGES);

function hasAny(haystack: string, needles: readonly string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

function resolveLightingVisual(text: string): {
  afterFilterClass: string;
  afterTintClass: string;
  isNightOrDusk: boolean;
  isGolden: boolean;
  isOvercastOrMist: boolean;
} {
  const lower = text.toLowerCase();
  if (hasAny(lower, ["blue hour", "night", "moonlit", "twilight", "aurora", "neon", "sky lounge"])) {
    return {
      afterFilterClass: "brightness-[0.9] contrast-[1.12] saturate-[1.15]",
      afterTintClass: "bg-gradient-to-tr from-[#07192f]/45 via-transparent to-[#2e6aa8]/20",
      isNightOrDusk: true,
      isGolden: false,
      isOvercastOrMist: false,
    };
  }
  if (hasAny(lower, ["golden", "sunset", "dusk", "amber", "sunrise", "warm", "fireplace", "candle", "2700k"])) {
    return {
      afterFilterClass: "sepia-[0.16] saturate-[1.2] contrast-[1.06]",
      afterTintClass: "bg-gradient-to-tr from-[#4b2d0a]/25 via-transparent to-[#f3b963]/20",
      isNightOrDusk: false,
      isGolden: true,
      isOvercastOrMist: false,
    };
  }
  if (hasAny(lower, ["overcast", "mist", "fog", "rain", "snow", "dew", "winter", "cloudy", "thunder", "storm"])) {
    return {
      afterFilterClass: "saturate-[0.82] contrast-[0.98] brightness-[1.02]",
      afterTintClass: "bg-gradient-to-b from-[#cfdce6]/25 via-transparent to-[#475d70]/25",
      isNightOrDusk: false,
      isGolden: false,
      isOvercastOrMist: true,
    };
  }
  return {
    afterFilterClass: "contrast-[1.04] saturate-[1.05]",
    afterTintClass: "bg-gradient-to-tr from-transparent via-transparent to-white/10",
    isNightOrDusk: false,
    isGolden: false,
    isOvercastOrMist: false,
  };
}

function resolveMoodGradeVisual(text: string): {
  afterFilterClass: string;
  afterTintClass: string;
} {
  const lower = text.toLowerCase();
  if (hasAny(lower, ["monochrome", "black and white"])) {
    return { afterFilterClass: "grayscale contrast-[1.22]", afterTintClass: "bg-black/10" };
  }
  if (hasAny(lower, ["sepia", "heritage", "vintage"])) {
    return { afterFilterClass: "sepia-[0.42] contrast-[1.05] brightness-[0.97]", afterTintClass: "bg-[#6f4b23]/15" };
  }
  if (hasAny(lower, ["emerald"])) {
    return { afterFilterClass: "saturate-[1.18] contrast-[1.08] hue-rotate-[-12deg]", afterTintClass: "bg-[#0d4d3a]/20" };
  }
  if (hasAny(lower, ["midnight", "ice blue", "cool dusk"])) {
    return { afterFilterClass: "brightness-[0.9] contrast-[1.12] hue-rotate-[8deg]", afterTintClass: "bg-[#0a2342]/30" };
  }
  if (hasAny(lower, ["blush", "pastel"])) {
    return { afterFilterClass: "brightness-[1.08] saturate-[0.92] contrast-[0.94]", afterTintClass: "bg-[#e8b4bc]/18" };
  }
  if (hasAny(lower, ["sunset orange", "golden cinematic", "warm filmic"])) {
    return { afterFilterClass: "sepia-[0.22] saturate-[1.25] contrast-[1.08]", afterTintClass: "bg-[#d97c2b]/18" };
  }
  if (hasAny(lower, ["moody dark", "charcoal", "high contrast"])) {
    return { afterFilterClass: "brightness-[0.82] contrast-[1.26] saturate-[0.95]", afterTintClass: "bg-black/25" };
  }
  if (hasAny(lower, ["bright airy"])) {
    return { afterFilterClass: "brightness-[1.12] contrast-[0.96] saturate-[1.04]", afterTintClass: "bg-white/15" };
  }
  if (hasAny(lower, ["muted earth", "soft matte"])) {
    return { afterFilterClass: "sepia-[0.15] saturate-[0.82] contrast-[0.94]", afterTintClass: "bg-[#5a4a38]/12" };
  }
  return { afterFilterClass: "contrast-[1.06] saturate-[1.12]", afterTintClass: "bg-transparent" };
}

export function resolvePreset200Preview(item: Preset200Item): PresetBeforeAfterPreview {
  const text = `${item.category} ${item.name} ${item.fragment}`.toLowerCase();
  const light = resolveLightingVisual(text);

  if (item.category === "Exterior light") {
    const isAerial = text.includes("aerial");
    const isPool = text.includes("pool") || text.includes("water");
    const afterSrc = isAerial
      ? MATRIX_IMAGES.urbanAerial
      : isPool
        ? MATRIX_IMAGES.zenCourtyard
        : light.isNightOrDusk
          ? MATRIX_IMAGES.parametricDusk
          : light.isGolden
            ? MATRIX_IMAGES.homeDusk
            : MATRIX_IMAGES.pavilionDusk;
    const beforeSrc = isAerial ? MATRIX_IMAGES.campus : MATRIX_IMAGES.pavilionDay;
    return {
      beforeSrc,
      afterSrc,
      beforeLabel: "Before · Day",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.92] contrast-[0.96]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Interior light") {
    const isCafeOrDining = hasAny(text, ["dinner", "cafe", "kitchen", "gallery", "showroom"]);
    const isLoftOrCity = hasAny(text, ["night city", "stairwell", "cinema"]);
    const afterSrc = isCafeOrDining
      ? MATRIX_IMAGES.cafe
      : isLoftOrCity
        ? MATRIX_IMAGES.loftAfter
        : hasAny(text, ["morning", "bounce", "cloudy", "spa"])
          ? MATRIX_IMAGES.livingRoom
          : MATRIX_IMAGES.interiorLuxe;
    const beforeSrc = isLoftOrCity ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.interiorClay;
    return {
      beforeSrc,
      afterSrc,
      beforeLabel: "Before · Clay",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.85] contrast-[0.95]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Materials") {
    const isInteriorMat = hasAny(text, [
      "travertine",
      "plaster",
      "oak",
      "walnut",
      "brass",
      "marble",
      "terrazzo",
      "linen",
      "boucle",
      "leather",
      "rug",
      "tile",
      "rattan",
      "fluted",
    ]);
    const isMacroDetail = hasAny(text, ["travertine", "brass", "corten", "zellige", "oak", "basalt", "concrete"]);
    return {
      beforeSrc: isInteriorMat ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
      afterSrc: isInteriorMat
        ? isMacroDetail
          ? MATRIX_IMAGES.materialJunction
          : MATRIX_IMAGES.interiorLuxe
        : isMacroDetail
          ? MATRIX_IMAGES.materialJunction
          : MATRIX_IMAGES.pavilionDusk,
      beforeLabel: "Before · Massing",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.78] contrast-[0.95]",
      afterFilterClass: "contrast-[1.08] saturate-[1.08]",
      afterTintClass: "bg-gradient-to-tr from-[#2c2114]/15 via-transparent to-[#e8c98a]/12",
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Atmosphere and weather") {
    const isWindow = text.includes("glass") || text.includes("dust");
    const isAuroraOrNight = hasAny(text, ["aurora", "neon", "evening"]);
    const afterSrc = isWindow
      ? MATRIX_IMAGES.interiorLuxe
      : isAuroraOrNight
        ? MATRIX_IMAGES.parametricDusk
        : hasAny(text, ["tropical", "humid", "spring", "autumn"])
          ? MATRIX_IMAGES.subtropical
          : MATRIX_IMAGES.pavilionDusk;
    const beforeSrc = isWindow ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.pavilionDay;
    return {
      beforeSrc,
      afterSrc,
      beforeLabel: "Before · Clear",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "brightness-[1.04] saturate-[0.9]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Landscape") {
    const isAerial = hasAny(text, ["rooftop", "vineyard", "orchard", "street trees"]);
    const isZenWater = hasAny(text, ["water", "japanese", "birch", "courtyard", "gravel", "moss", "alpine"]);
    return {
      beforeSrc: MATRIX_IMAGES.clayExterior,
      afterSrc: isAerial
        ? MATRIX_IMAGES.urbanAerial
        : isZenWater
          ? MATRIX_IMAGES.zenCourtyard
          : hasAny(text, ["tropical", "forest", "fern", "coastal"])
            ? MATRIX_IMAGES.subtropical
            : MATRIX_IMAGES.courtyard,
      beforeLabel: "Before · Site",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.75] brightness-[1.02]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Amenities") {
    const isPoolWater = hasAny(text, ["pool", "spa", "garden pavilion", "yoga", "water", "tennis"]);
    const isNightSky = hasAny(text, ["rooftop", "sky lounge", "retail", "bbq"]);
    const isCafeLobby = hasAny(text, ["cafe", "clubhouse", "lobby", "concierge", "co-working", "gym"]);
    return {
      beforeSrc: isPoolWater || isNightSky ? MATRIX_IMAGES.clayExterior : MATRIX_IMAGES.loftBefore,
      afterSrc: isPoolWater
        ? MATRIX_IMAGES.zenCourtyard
        : isNightSky
          ? MATRIX_IMAGES.parametricDusk
          : isCafeLobby
            ? MATRIX_IMAGES.cafe
            : MATRIX_IMAGES.interiorLuxe,
      beforeLabel: "Before · Shell",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.8] contrast-[0.94]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Camera and lens") {
    const isAerial = hasAny(text, ["high angle", "drone", "orbit"]);
    const isMacro = hasAny(text, ["macro", "bokeh"]);
    const isInteriorCam = hasAny(text, ["interior", "doorway", "mirror", "walk-in"]);
    const isWater = hasAny(text, ["water", "low angle", "sunburst"]);
    return {
      beforeSrc: isInteriorCam ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
      afterSrc: isAerial
        ? MATRIX_IMAGES.urbanAerial
        : isMacro
          ? MATRIX_IMAGES.materialJunction
          : isInteriorCam
            ? MATRIX_IMAGES.interiorLuxe
            : isWater
              ? MATRIX_IMAGES.parametricDusk
              : MATRIX_IMAGES.pavilionDusk,
      beforeLabel: "Before · Raw",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.85]",
      afterFilterClass: "contrast-[1.06] saturate-[1.08]",
      afterTintClass: "bg-transparent",
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Style and era") {
    const isFuturistOrUrban = hasAny(text, ["parametric", "urban chic", "contemporary luxury", "art deco"]);
    const isGardenOrTropical = hasAny(text, ["tropical", "biophilic", "wabi-sabi", "mediterranean", "desert"]);
    const isInteriorStyle = hasAny(text, ["japandi", "nordic", "mid-century", "scandinavian", "classic", "coastal", "indian", "gulf"]);
    return {
      beforeSrc: isInteriorStyle ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
      afterSrc: isFuturistOrUrban
        ? MATRIX_IMAGES.parametricDusk
        : isGardenOrTropical
          ? MATRIX_IMAGES.zenCourtyard
          : isInteriorStyle
            ? MATRIX_IMAGES.interiorLuxe
            : hasAny(text, ["industrial"])
              ? MATRIX_IMAGES.loftAfter
              : MATRIX_IMAGES.publicLibrary,
      beforeLabel: "Before · Concept",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.82]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: item.fragment,
    };
  }

  if (item.category === "Mood grade") {
    const grade = resolveMoodGradeVisual(text);
    return {
      beforeSrc: MATRIX_IMAGES.pavilionDay,
      afterSrc: MATRIX_IMAGES.pavilionDusk,
      beforeLabel: "Before · Neutral",
      afterLabel: `After · ${item.name}`,
      beforeFilterClass: "saturate-[0.9] contrast-[0.95]",
      afterFilterClass: grade.afterFilterClass,
      afterTintClass: grade.afterTintClass,
      sceneHint: item.fragment,
    };
  }

  // Fixes and guards (negative / geometric locks)
  const isInteriorFix = hasAny(text, ["furniture", "clutter", "window reflections"]);
  return {
    beforeSrc: isInteriorFix ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
    afterSrc: isInteriorFix ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.pavilionDusk,
    beforeLabel: "Before · Unchecked",
    afterLabel: `After · ${item.name}`,
    beforeFilterClass: "blur-[0.45px] saturate-[0.7] contrast-[0.9]",
    afterFilterClass: "contrast-[1.08] saturate-[1.05]",
    afterTintClass: "bg-gradient-to-tr from-[#0d3b2e]/15 via-transparent to-[#53d2a8]/10",
    sceneHint: item.fragment,
  };
}

export function resolveArchviz100Preview(preset: Archviz100Preset): PresetBeforeAfterPreview {
  const combined = `${preset.category} ${preset.title} ${preset.lighting} ${preset.camera} ${preset.materials} ${preset.mood} ${preset.environment} ${preset.prompt}`.toLowerCase();
  const light = resolveLightingVisual(`${preset.lighting} ${preset.mood}`);

  // Dedicated AI Editing Workflows (clear real-world Before -> After pairs)
  if (preset.category === "AI Editing Workflows") {
    if (preset.id === "AV-091") {
      return {
        beforeSrc: MATRIX_IMAGES.pavilionDay,
        afterSrc: MATRIX_IMAGES.parametricDusk,
        beforeLabel: "Before · Day",
        afterLabel: "After · Night Glow",
        beforeFilterClass: "brightness-[1.05]",
        afterFilterClass: "brightness-[0.9] contrast-[1.15]",
        afterTintClass: "bg-gradient-to-tr from-[#07192f]/40 via-transparent to-[#e8c98a]/15",
        sceneHint: preset.prompt,
      };
    }
    if (preset.id === "AV-096" || preset.id === "AV-098") {
      return {
        beforeSrc: MATRIX_IMAGES.loftBefore,
        afterSrc: MATRIX_IMAGES.interiorLuxe,
        beforeLabel: "Before · Existing",
        afterLabel: "After · Restyled",
        beforeFilterClass: "saturate-[0.85]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: preset.prompt,
      };
    }
    if (preset.id === "AV-093" || preset.id === "AV-094") {
      return {
        beforeSrc: MATRIX_IMAGES.clayExterior,
        afterSrc: MATRIX_IMAGES.zenCourtyard,
        beforeLabel: "Before · Site",
        afterLabel: "After · Water & Planting",
        beforeFilterClass: "saturate-[0.75]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: preset.prompt,
      };
    }
    return {
      beforeSrc: preset.id === "AV-100" ? MATRIX_IMAGES.clayExterior : MATRIX_IMAGES.pavilionDay,
      afterSrc: preset.id === "AV-092" ? MATRIX_IMAGES.materialJunction : MATRIX_IMAGES.homeDusk,
      beforeLabel: "Before · Source",
      afterLabel: `After · ${preset.title}`,
      beforeFilterClass: "saturate-[0.82]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: preset.prompt,
    };
  }

  if (preset.category === "Modern Interiors") {
    const isCafeDining = hasAny(combined, ["dining", "kitchen", "cinema"]);
    return {
      beforeSrc: MATRIX_IMAGES.interiorClay,
      afterSrc: isCafeDining
        ? MATRIX_IMAGES.loftAfter
        : hasAny(combined, ["japandi", "living", "bedroom", "lounge"])
          ? MATRIX_IMAGES.interiorLuxe
          : MATRIX_IMAGES.livingRoom,
      beforeLabel: "Before · Clay",
      afterLabel: `After · ${preset.lighting.split(" ")[0]} GI`,
      beforeFilterClass: "saturate-[0.85]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: preset.prompt,
    };
  }

  if (preset.category === "Urban & Planning" || preset.category === "Presentation & Views") {
    const isSectionOrPlan = hasAny(combined, ["section", "cutaway", "isometric", "axonometric", "floor plan"]);
    const isClayOrMassing = hasAny(combined, ["clay", "massing", "moodboard"]);
    return {
      beforeSrc: isSectionOrPlan ? MATRIX_IMAGES.sectionalArts : MATRIX_IMAGES.clayExterior,
      afterSrc: isClayOrMassing
        ? MATRIX_IMAGES.materialJunction
        : isSectionOrPlan
          ? MATRIX_IMAGES.sectionalArts
          : MATRIX_IMAGES.urbanAerial,
      beforeLabel: isSectionOrPlan ? "Before · CAD" : "Before · Massing",
      afterLabel: `After · ${preset.title}`,
      beforeFilterClass: "grayscale-[0.65] contrast-[0.92]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: preset.prompt,
    };
  }

  if (preset.category === "Landscape & Outdoor") {
    const isTropicalOrPocket = hasAny(combined, ["tropical", "pocket", "pergola", "rooftop"]);
    return {
      beforeSrc: MATRIX_IMAGES.clayExterior,
      afterSrc: isTropicalOrPocket ? MATRIX_IMAGES.courtyard : MATRIX_IMAGES.zenCourtyard,
      beforeLabel: "Before · Grading",
      afterLabel: `After · ${preset.title}`,
      beforeFilterClass: "saturate-[0.75]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: preset.prompt,
    };
  }

  if (preset.category === "Futuristic Concepts") {
    const isEcoVertical = hasAny(combined, ["vertical forest", "earth", "net zero", "desert"]);
    return {
      beforeSrc: MATRIX_IMAGES.clayExterior,
      afterSrc: isEcoVertical ? MATRIX_IMAGES.zenCourtyard : MATRIX_IMAGES.parametricDusk,
      beforeLabel: "Before · Wire/Clay",
      afterLabel: `After · Parametric`,
      beforeFilterClass: "saturate-[0.7]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: preset.prompt,
    };
  }

  if (preset.category === "Commercial Spaces") {
    const isLobbyOrRestaurant = hasAny(combined, ["hotel", "restaurant", "retail", "spa"]);
    return {
      beforeSrc: isLobbyOrRestaurant ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
      afterSrc: isLobbyOrRestaurant
        ? MATRIX_IMAGES.cafe
        : hasAny(combined, ["museum", "terminal", "headquarters"])
          ? MATRIX_IMAGES.parametricDusk
          : MATRIX_IMAGES.publicLibrary,
      beforeLabel: "Before · Shell",
      afterLabel: `After · Commercial`,
      beforeFilterClass: "saturate-[0.8]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: preset.prompt,
    };
  }

  if (preset.category === "Climate & Lighting") {
    return {
      beforeSrc: MATRIX_IMAGES.pavilionDay,
      afterSrc: light.isNightOrDusk
        ? MATRIX_IMAGES.parametricDusk
        : hasAny(combined, ["courtyard"])
          ? MATRIX_IMAGES.zenCourtyard
          : MATRIX_IMAGES.homeDusk,
      beforeLabel: "Before · Base Day",
      afterLabel: `After · ${preset.title}`,
      beforeFilterClass: "saturate-[0.88] brightness-[1.03]",
      afterFilterClass: light.afterFilterClass,
      afterTintClass: light.afterTintClass,
      sceneHint: preset.prompt,
    };
  }

  // Luxury Residential & Architectural Styles
  const isCourtyardOrGarden = hasAny(combined, ["courtyard", "olive", "wabi sabi", "farmhouse", "tropical", "pool"]);
  const isNightDusk = light.isNightOrDusk || hasAny(combined, ["dusk", "deco", "blue hour"]);
  return {
    beforeSrc: MATRIX_IMAGES.clayExterior,
    afterSrc: isNightDusk
      ? MATRIX_IMAGES.parametricDusk
      : isCourtyardOrGarden
        ? MATRIX_IMAGES.zenCourtyard
        : hasAny(combined, ["loft", "interior"])
          ? MATRIX_IMAGES.interiorLuxe
          : MATRIX_IMAGES.pavilionDusk,
    beforeLabel: "Before · Clay/Wire",
    afterLabel: `After · ${preset.lighting.split(" ").slice(0, 2).join(" ")}`,
    beforeFilterClass: "saturate-[0.8]",
    afterFilterClass: light.afterFilterClass,
    afterTintClass: light.afterTintClass,
    sceneHint: preset.prompt,
  };
}

export function resolveLook16Preview(look: IntentLook): PresetBeforeAfterPreview {
  const light = resolveLightingVisual(`${look.name} ${look.light} ${look.mood} ${look.bestFor}`);
  return {
    beforeSrc: look.beforeThumb,
    afterSrc: look.thumbnail,
    beforeLabel: "Before",
    afterLabel: `${look.code} · ${look.name}`,
    beforeFilterClass: "saturate-[0.88]",
    afterFilterClass: light.afterFilterClass,
    afterTintClass: light.afterTintClass,
    sceneHint: `${look.bestFor} · ${look.light}`,
  };
}

export const resolveLookPreview = resolveLook16Preview;

export function resolveZukeVizPreview(item: {
  id: string;
  title: string;
  category: string;
  prompt: string;
}): PresetBeforeAfterPreview {
  const combined = `${item.title} ${item.category} ${item.prompt}`.toLowerCase();
  const light = resolveLightingVisual(combined);

  if (hasAny(combined, ["blueprint", "neon blueprint", "deep-blue", "deep blue"])) {
    return {
      beforeSrc: MATRIX_IMAGES.clayExterior,
      afterSrc: MATRIX_IMAGES.sectionalArts,
      beforeLabel: "Before · CAD/3D",
      afterLabel: `After · ${item.id} Blueprint`,
      beforeFilterClass: "saturate-[0.75]",
      afterFilterClass: "contrast-[1.18] saturate-[1.35] hue-rotate-[175deg] brightness-[0.85]",
      afterTintClass: "bg-[#0a3a7a]/35 mix-blend-multiply",
      sceneHint: item.title,
    };
  }

  if (hasAny(combined, ["kraft", "charcoal floor plan"])) {
    const isCharcoal = combined.includes("charcoal");
    return {
      beforeSrc: MATRIX_IMAGES.sectionalArts,
      afterSrc: MATRIX_IMAGES.sectionalArts,
      beforeLabel: "Before · Plan",
      afterLabel: isCharcoal ? "After · Charcoal Plan" : "After · Kraft Plan",
      beforeFilterClass: "grayscale-[0.85] brightness-[1.08]",
      afterFilterClass: isCharcoal
        ? "contrast-[1.22] brightness-[0.62] saturate-[0.65]"
        : "sepia-[0.42] contrast-[1.06] saturate-[0.95]",
      afterTintClass: isCharcoal ? "bg-amber-400/12 mix-blend-screen" : "bg-[#7c6848]/18 mix-blend-multiply",
      sceneHint: item.title,
    };
  }

  switch (item.category) {
    case "Interior · Room by Room": {
      const isKitchen = hasAny(combined, ["kitchen", "island", "cabinet", "dining"]);
      const isRestaurant = hasAny(combined, ["restaurant", "pink", "bar", "lounge"]);
      return {
        beforeSrc: hasAny(combined, ["empty", "vacant", "industrial", "penthouse"])
          ? MATRIX_IMAGES.loftBefore
          : MATRIX_IMAGES.interiorClay,
        afterSrc: isRestaurant
          ? MATRIX_IMAGES.cafe
          : isKitchen
            ? MATRIX_IMAGES.loftAfter
            : MATRIX_IMAGES.interiorLuxe,
        beforeLabel: hasAny(combined, ["empty", "industrial", "penthouse"]) ? "Before · Empty Shell" : "Before · Clay/Draft",
        afterLabel: `After · ${item.id}`,
        beforeFilterClass: "saturate-[0.82]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Layouts & Space Planning":
    case "Plans, Sections & Axonometric Views": {
      const isAxon = hasAny(combined, ["axonometric", "isometric", "dollhouse", "exploded", "cutaway"]);
      return {
        beforeSrc: isAxon ? MATRIX_IMAGES.clayExterior : MATRIX_IMAGES.sectionalArts,
        afterSrc: isAxon ? MATRIX_IMAGES.sectionalArts : MATRIX_IMAGES.livingRoom,
        beforeLabel: isAxon ? "Before · 2D Plan" : "Before · CAD Outline",
        afterLabel: isAxon ? "After · 3D Cutaway" : "After · Furnished Plan",
        beforeFilterClass: "grayscale-[0.75] contrast-[0.92]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Landscape & Site": {
      return {
        beforeSrc: MATRIX_IMAGES.clayExterior,
        afterSrc: hasAny(combined, ["courtyard", "garden"]) ? MATRIX_IMAGES.zenCourtyard : MATRIX_IMAGES.courtyard,
        beforeLabel: "Before · Site",
        afterLabel: `After · Landscape`,
        beforeFilterClass: "saturate-[0.75]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Urban Design & Masterplans": {
      const isStreet = hasAny(combined, ["street", "pedestrian", "empty lot"]);
      return {
        beforeSrc: isStreet ? MATRIX_IMAGES.publicLibrary : MATRIX_IMAGES.clayExterior,
        afterSrc: isStreet ? MATRIX_IMAGES.courtyard : MATRIX_IMAGES.urbanAerial,
        beforeLabel: isStreet ? "Before · Existing Street" : "Before · Massing",
        afterLabel: isStreet ? "After · Urban Infill" : "After · Masterplan",
        beforeFilterClass: "grayscale-[0.55] saturate-[0.75]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Rendering & Photography": {
      const isModel = hasAny(combined, ["physical model", "maquette"]);
      const isInterior = hasAny(combined, ["living", "kitchen", "office", "lounge"]);
      return {
        beforeSrc: isInterior ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
        afterSrc: isModel
          ? MATRIX_IMAGES.publicLibrary
          : isInterior
            ? MATRIX_IMAGES.interiorLuxe
            : hasAny(combined, ["tropical", "pool", "villa"])
              ? MATRIX_IMAGES.subtropical
              : MATRIX_IMAGES.pavilionDusk,
        beforeLabel: isModel ? "Before · Sketch" : "Before · Clay/Line",
        afterLabel: isModel ? "After · Scale Model" : "After · Photoreal",
        beforeFilterClass: "grayscale-[0.65] contrast-[0.95]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Materials & Finishes": {
      const isKitchen = hasAny(combined, ["kitchen", "cabinet", "floor"]);
      return {
        beforeSrc: isKitchen ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.materialJunction,
        afterSrc: isKitchen ? MATRIX_IMAGES.loftAfter : MATRIX_IMAGES.materialJunction,
        beforeLabel: "Before · Original",
        afterLabel: "After · Swapped Finish",
        beforeFilterClass: "saturate-[0.72] brightness-[0.96]",
        afterFilterClass: "contrast-[1.08] saturate-[1.16]",
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Style & Restyling": {
      return {
        beforeSrc: MATRIX_IMAGES.loftBefore,
        afterSrc: hasAny(combined, ["burgundy", "lounge", "cafe"]) ? MATRIX_IMAGES.cafe : MATRIX_IMAGES.interiorLuxe,
        beforeLabel: "Before · Existing",
        afterLabel: `After · Restyled`,
        beforeFilterClass: "saturate-[0.8]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Lighting & Post-production": {
      const isInterior = hasAny(combined, ["kitchen", "interior"]);
      return {
        beforeSrc: isInterior ? MATRIX_IMAGES.livingRoom : MATRIX_IMAGES.subtropical,
        afterSrc: isInterior ? MATRIX_IMAGES.loftAfter : MATRIX_IMAGES.homeDusk,
        beforeLabel: "Before · Daylight",
        afterLabel: light.isNightOrDusk ? "After · Night/Blue Hr" : "After · Relit",
        beforeFilterClass: "brightness-[1.04] saturate-[0.9]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Multi-angle & Camera": {
      const isInterior = hasAny(combined, ["interior", "360", "living", "room"]);
      return {
        beforeSrc: isInterior ? MATRIX_IMAGES.livingRoom : MATRIX_IMAGES.pavilionDay,
        afterSrc: isInterior ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.campus,
        beforeLabel: "Before · Base View",
        afterLabel: hasAny(combined, ["360"]) ? "After · 360° Pano" : "After · Multi-Angle",
        beforeFilterClass: "saturate-[0.88]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Design Support & Presentation": {
      const isInterior = hasAny(combined, ["interior", "ff&e", "living", "furniture", "moodboard"]);
      return {
        beforeSrc: isInterior ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
        afterSrc: isInterior ? MATRIX_IMAGES.materialJunction : MATRIX_IMAGES.sectionalArts,
        beforeLabel: "Before · Inputs",
        afterLabel: "After · Presentation Board",
        beforeFilterClass: "saturate-[0.78]",
        afterFilterClass: "contrast-[1.06] saturate-[1.08]",
        afterTintClass: "bg-transparent",
        sceneHint: item.title,
      };
    }

    case "Motion & Video": {
      const isInterior = hasAny(combined, ["living", "interior", "walkthrough"]);
      return {
        beforeSrc: isInterior ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
        afterSrc: isInterior ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.pavilionDusk,
        beforeLabel: "00:00 · Start Frame",
        afterLabel: "End Frame · Motion",
        beforeFilterClass: "saturate-[0.8] brightness-[0.96]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    case "Real Estate & Marketing": {
      const isAmenity = hasAny(combined, ["amenity", "pool", "club"]);
      return {
        beforeSrc: isAmenity ? MATRIX_IMAGES.courtyard : MATRIX_IMAGES.loftBefore,
        afterSrc: isAmenity ? MATRIX_IMAGES.zenCourtyard : MATRIX_IMAGES.loftAfter,
        beforeLabel: isAmenity ? "Before · Base" : "Before · Vacant",
        afterLabel: isAmenity ? "After · Brochure Hero" : "After · Staged",
        beforeFilterClass: "saturate-[0.82]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }

    default: {
      // Exterior
      const isSkyscraper = hasAny(combined, ["skyscraper", "dubai", "tower", "futuristic"]);
      return {
        beforeSrc: MATRIX_IMAGES.clayExterior,
        afterSrc: isSkyscraper
          ? MATRIX_IMAGES.parametricDusk
          : light.isNightOrDusk
            ? MATRIX_IMAGES.pavilionDusk
            : MATRIX_IMAGES.subtropical,
        beforeLabel: "Before · Site/Massing",
        afterLabel: `After · ${item.id}`,
        beforeFilterClass: "saturate-[0.82]",
        afterFilterClass: light.afterFilterClass,
        afterTintClass: light.afterTintClass,
        sceneHint: item.title,
      };
    }
  }
}
