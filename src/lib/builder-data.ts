export type BlockCategory = "style" | "lighting" | "mood" | "camera" | "material";

export type BuilderBlock = {
  id: string;
  category: BlockCategory;
  name: string;
  tagline: string;
  description: string;
  promptSnippet: string;
  materials: string[];
  swatches?: string[];
  image?: string;
  iconName?: string;
};

export const ARCHITECTURAL_STYLES: BuilderBlock[] = [
  {
    id: "japandi-minimalist",
    category: "style",
    name: "Japandi Warm Minimalism",
    tagline: "Natural white oak, hand-troweled plaster, paper shoji accents",
    description: "Harmonious blend of Scandinavian functional simplicity and Japanese wabi-sabi reverence for natural materials, quiet proportions, and uncluttered spatial breathing room.",
    promptSnippet: "Japandi architectural aesthetic, bespoke rift-cut white oak joinery, seamless warm off-white lime wash walls, textured linen drapery, low-profile sculptural furniture, delicate paper shoji-inspired accents, wabi-sabi subtle organic texture",
    materials: ["Rift-cut white oak", "Hand-troweled lime plaster", "Raw Belgian linen", "Fluted glass"],
    swatches: ["#e4d8c5", "#c6b092", "#7f6e5d", "#2b2520"],
    image: "/viz/p02-loft-after.jpg",
  },
  {
    id: "minimalist-concrete-glass",
    category: "style",
    name: "Minimalist Concrete & Glass",
    tagline: "Tadao Ando inspired silk-smooth concrete and reflecting water",
    description: "Geometric purity with architectural concrete walls, precision form-tie impressions, floor-to-ceiling recessed glass walls, and razor-thin cantilevered roof planes floating over calm water.",
    promptSnippet: "Minimalist modern pavilion, architectural smooth fair-faced concrete with form-tie holes, razor-thin cantilevered flat roof plane, floor-to-ceiling ultra-clear glass curtain wall, calm reflecting pool with granite stepping stones",
    materials: ["Fair-faced architectural concrete", "Low-iron structural glass", "Flamed black granite", "Smoked zinc trim"],
    swatches: ["#b8b9ba", "#8d9093", "#3a3c3e", "#1b1d1f"],
    image: "/viz/p01-pavilion-day.jpg",
  },
  {
    id: "brutalist-sculptural",
    category: "style",
    name: "Sculptural Brutalism",
    tagline: "Board-marked concrete, deep recessed apertures, monumental massing",
    description: "Bold monolithic volumes with textured board-marked concrete, deep shadow-casting reveals, geometric cantilevers, and dramatic angular light-wells.",
    promptSnippet: "Sculptural brutalist architecture, textured board-formed architectural concrete with rough wood grain impressions, deep-set punched window apertures, heavy cantilevered volumes, dramatic geometric reveals, monolithic weight",
    materials: ["Board-formed concrete", "Weathering Corten steel", "Cast bronze hardware", "Raw basalt stone"],
    swatches: ["#9a9893", "#6c6963", "#7a4627", "#2e2b27"],
    image: "/viz/t08-material-junction.jpg",
  },
  {
    id: "contemporary-tropical",
    category: "style",
    name: "Contemporary Biophilic Tropical",
    tagline: "Deep shaded eaves, volcanic stone, permeable timber louvers",
    description: "Architecture dissolved into lush subtropical landscaping with deep cantilevered overhangs, operable teak batten screens, volcanic stone terraces, and indoor-outdoor breezeways.",
    promptSnippet: "Contemporary biophilic tropical residence, deep protective roof eaves, horizontal teak timber battens, dark volcanic basalt stone foundation, open-air pavilion transition, lush tropical flora, rainwater runnels",
    materials: ["Weathered teak", "Honed volcanic basalt", "Charcoal aluminum mullions", "Polished terrazzo"],
    swatches: ["#a07855", "#4a453f", "#2f3e2b", "#ded6cb"],
    image: "/viz/t05-subtropical-home.jpg",
  },
  {
    id: "nordic-timber-civic",
    category: "style",
    name: "Nordic Mass Timber & Brick",
    tagline: "Cross-laminated timber, tactile brickwork, generous civic daylight",
    description: "Warm public and residential architecture featuring exposed glulam beams, pale Douglas fir ceilings, soft textural brickwork, and double-height light shafts.",
    promptSnippet: "Nordic contemporary architecture, exposed glulam timber structure, pale Douglas fir slatted ceiling, tactile Petersen-style textural clay brickwork, slender steel window profiles, generous double-height volume",
    materials: ["Douglas fir glulam", "Long-format tactile brick", "Natural zinc roofing", "Micro-cement floor"],
    swatches: ["#d9b88f", "#ab6b51", "#787671", "#33312e"],
    image: "/viz/t01-public-library.jpg",
  },
  {
    id: "industrial-heritage-reuse",
    category: "style",
    name: "Industrial Heritage Adaptive Reuse",
    tagline: "Exposed historical brick, blackened steel trusses, fluted partitions",
    description: "Warehouse conversion honoring original industrial patina with sandblasted brick, exposed steel framework, custom steel-framed glazing, and warm bespoke architectural inserts.",
    promptSnippet: "Industrial heritage warehouse conversion, sandblasted original red brick walls, exposed blackened structural steel I-beams and timber trusses, crittall black steel-framed windows, refined fluted glass partitions, polished aggregate concrete floor",
    materials: ["Restored red brick", "Blackened mild steel", "Reclaimed timber joists", "Wire-cast glass"],
    swatches: ["#8b4534", "#2c2a29", "#c4b5a0", "#5c554e"],
    image: "/viz/p02-loft-before.jpg",
  },
];

export const LIGHTING_CONDITIONS: BuilderBlock[] = [
  {
    id: "blue-hour-twilight",
    category: "lighting",
    name: "Blue-Hour Twilight",
    tagline: "Deep cobalt sky, warm interior cove glow, specular water reflections",
    description: "The cinematic stillness just after sunset where the sky turns rich deep sapphire, balanced precisely against warm 2700K architectural interior lighting glowing through glazed facades.",
    promptSnippet: "Blue hour twilight photography, deep rich cobalt blue sky, soft residual horizon luminescence, warm incandescent 2700K interior wash glowing through glass, exterior pathway step lights, specular water reflections",
    materials: ["2700K warm LED grazing", "Deep cobalt ambient sky", "Glinting water highlights"],
    swatches: ["#14253d", "#24426b", "#eec07b", "#f7dd9f"],
    image: "/viz/p01-pavilion-dusk.jpg",
  },
  {
    id: "golden-hour-raking",
    category: "lighting",
    name: "Golden Hour Raking Sun",
    tagline: "Low warm amber sunlight, elongated soft shadows, architectural relief",
    description: "Low-angle sunlight grazing across building facades and interior floors, accentuating surface textures, casting long dramatic shadows, and filling spaces with warm amber warmth.",
    promptSnippet: "Late afternoon golden hour sunlight, low sun angle raking across textured surfaces, long dramatic soft-edged shadows, warm golden amber illumination, atmospheric volumetric light beams, soft specular highlights",
    materials: ["Low raking sun (1800K-3000K)", "Long soft shadows", "Volumetric dust motes"],
    swatches: ["#df983a", "#e9bb67", "#844719", "#301d11"],
    image: "/viz/t10-home-dusk-edit.jpg",
  },
  {
    id: "soft-overcast-diffused",
    category: "lighting",
    name: "Soft Overcast Nordic Light",
    tagline: "Shadowless cloud canopy, true material color rendering, calm reflectance",
    description: "High soft cloud layer acting as an immense natural softbox. Eliminates harsh specular glare, allows true material colors and subtle tonal gradients to read with absolute clarity.",
    promptSnippet: "Soft overcast daylight, even diffused sky illumination, subtle soft ambient occlusion in corners, no harsh shadows, true-to-life neutral material color fidelity, clean calm architectural photography",
    materials: ["5500K neutral diffused daylight", "Soft ambient occlusion", "Gentle matte bounce"],
    swatches: ["#cfd3d6", "#9ea3a8", "#6c7277", "#3b3e41"],
    image: "/viz/p01-pavilion-day.jpg",
  },
  {
    id: "dramatic-chiaroscuro",
    category: "lighting",
    name: "Dramatic Chiaroscuro & Light Shafts",
    tagline: "High contrast single aperture, deep velvety shadow pockets, volumetric beams",
    description: "Inspired by sacred architectural spaces where light enters through a singular deliberate opening, carving out illuminated planes amidst deep mysterious shadow.",
    promptSnippet: "Dramatic architectural chiaroscuro lighting, single high clerestory light shaft cutting through deep shadow, high contrast ratio, volumetric sunbeam illuminating atmospheric haze, sculpted light-pocket geometry",
    materials: ["Directional sun shaft", "Velvety shadow pockets", "Sharp cut-off illumination"],
    swatches: ["#fff3d1", "#785f36", "#2c2419", "#0e0c0a"],
    image: "/viz/t08-material-junction.jpg",
  },
  {
    id: "interior-cove-accent",
    category: "lighting",
    name: "Architectural Cove & Grazing",
    tagline: "Concealed LED reveals, tactile wall washing, zero direct glare",
    description: "Refined evening interior scheme where light sources are fully integrated into ceiling coves, base reveals, and joinery kickers to wash vertical planes without visible bulbs.",
    promptSnippet: "Sophisticated interior lighting design, concealed continuous LED cove wash across ceiling plane, vertical plaster wall grazing highlighting subtle texture, soft under-cabinet joinery glow, intimate focal pendants",
    materials: ["Concealed linear coves (2400K)", "Wall-grazing downlights", "Minimal glare fixtures"],
    swatches: ["#fadca5", "#dca762", "#473420", "#18130e"],
    image: "/viz/t09-r1-living-room-clay-edit.jpg",
  },
];

export const MOOD_SETTINGS: BuilderBlock[] = [
  {
    id: "serene-sanctuary",
    category: "mood",
    name: "Serene Sanctuary",
    tagline: "Meditative quiet, uncluttered visual rhythm, restorative stillness",
    description: "An oasis of calm that lowers heart rates. Characterized by generous negative space, gentle transitions between zones, organic materiality, and acoustic softness.",
    promptSnippet: "Mood of serene contemplative sanctuary, restorative domestic stillness, unhurried peaceful atmosphere, refined negative space, visual breathing room, soothing tactile balance",
    materials: ["Muted earth pigments", "Acoustic plaster", "Soft wool rugs"],
    swatches: ["#eee8de", "#d7cdbd", "#b8a892", "#5e5344"],
  },
  {
    id: "cinematic-grandeur",
    category: "mood",
    name: "Cinematic Grandeur",
    tagline: "Dramatic volumetric presence, monumental scale, emotional gravitas",
    description: "Evokes awe through expansive vertical scale, monumental material planes, dramatic contrast, and an elevated editorial perspective fit for an architectural monograph.",
    promptSnippet: "Mood of cinematic architectural grandeur, monumental spatial impact, sophisticated gravitas, prestigious design magazine feature, dramatic sense of scale and permanence",
    materials: ["Honed stone slabs", "Deep patinated metal", "Heavy architectural mass"],
    swatches: ["#1d1f22", "#41454c", "#9fa4ac", "#dcdfe4"],
  },
  {
    id: "intimate-warmth",
    category: "mood",
    name: "Intimate Domestic Warmth",
    tagline: "Tactile comfort, human scale, inviting grounded solace",
    description: "Spaces designed for lingering conversation, reading, and retreat. Rich tactile textures, warm honey tones, and comfortable acoustic containment.",
    promptSnippet: "Mood of intimate domestic warmth, cozy tactile comfort, inviting human-scale atmosphere, soft warm ambient glow, grounded and welcoming architectural embrace",
    materials: ["Honey-toned timber", "Chunky bouclé", "Warm ceramic lamps"],
    swatches: ["#d89c56", "#ba7833", "#eed2aa", "#3e2714"],
  },
  {
    id: "monastic-clarity",
    category: "mood",
    name: "Monastic Minimalist Clarity",
    tagline: "Uncompromising honesty, ascetic beauty, profound silence",
    description: "Stripped of all superficial ornament. Celebrates the elemental dialogue between raw unadorned materials, void space, and natural illumination.",
    promptSnippet: "Mood of monastic minimalist clarity, ascetic architectural purity, profound visual silence, rigorous geometry, unadorned material honesty, meditative emptiness",
    materials: ["Raw stone block", "Unglazed ceramic", "Natural unfinished lime"],
    swatches: ["#f5f5f4", "#e7e5e4", "#78716c", "#1c1917"],
  },
  {
    id: "vibrant-cosmopolitan",
    category: "mood",
    name: "Vibrant Cosmopolitan Energy",
    tagline: "Dynamic civic vitality, layered hospitality, cultured lifestyle",
    description: "A lively, cultured ambiance celebrating public life, social interaction, active streetscapes, and sophisticated contemporary design details.",
    promptSnippet: "Mood of vibrant cosmopolitan design, cultured urban vitality, sophisticated social hospitality, lively refined architectural atmosphere, bespoke curated finishes",
    materials: ["Polished brass accents", "Rich terrazzo", "Lush indoor greenery"],
    swatches: ["#c59b27", "#1e4d3a", "#f3edd8", "#202020"],
  },
];

export const CAMERA_PRESETS: BuilderBlock[] = [
  {
    id: "eye-level-two-point",
    category: "camera",
    name: "Eye-Level Two-Point Perspective",
    tagline: "True human 1.6m elevation, perfect vertical lines, zero barrel distortion",
    description: "Standard editorial architectural perspective taken at 160cm eye level with shift-lens perspective control maintaining absolute vertical parallelism.",
    promptSnippet: "Eye-level two-point architectural perspective, 1.6-meter camera height, vertical lines perfectly parallel and corrected with tilt-shift lens, 28mm wide architectural composition",
    materials: ["28mm architectural lens", "Zero vertical tilt", "Balanced horizon at 38%"],
  },
  {
    id: "low-angle-oblique",
    category: "camera",
    name: "Low-Angle Volumetric Oblique",
    tagline: "Upward dramatic gaze accentuating soaring vertical ceilings and mass",
    description: "Positioned at 0.8m height looking slightly upward along an architectural diagonal to emphasize soaring double-height volumes and heroic cantilevers.",
    promptSnippet: "Low-angle architectural perspective, camera positioned low to the ground looking obliquely up, dynamic diagonal composition emphasizing soaring height and structural cantilever",
    materials: ["24mm wide angle", "Dynamic diagonal lines", "Foreground depth plane"],
  },
  {
    id: "intimate-macro-junction",
    category: "camera",
    name: "Intimate Material Junction Crop",
    tagline: "Vignette focus on material craftsmanship, flush joints, and tactile reveals",
    description: "A close-range crop highlighting the precise 5mm shadow reveal where hand-troweled plaster meets oiled oak cabinetry and honed stone.",
    promptSnippet: "Detailed architectural vignette, medium close-up shot focusing on the tactile junction where stone meets wood and metal, shallow depth of field, 50mm lens, exquisite craftsmanship",
    materials: ["50mm prime lens", "f/2.8 shallow depth of field", "Tactile texture focal point"],
  },
  {
    id: "elevated-site-drone",
    category: "camera",
    name: "Elevated Oblique Site Axonometric",
    tagline: "Elevated 45-degree angle contextualizing building within surrounding terrain",
    description: "Aerial perspective capturing the entire architectural footprint, roof geometry, reflecting pools, and surrounding natural topography.",
    promptSnippet: "Elevated aerial architectural photography, high 45-degree oblique viewpoint showing building massing integrated into landscape and reflecting pool, crisp holistic site perspective",
    materials: ["Aerial architectural lens", "Full masterplan footprint", "Contextual terrain"],
  },
];

export type VisionDocument = {
  title: string;
  subtitle: string;
  date: string;
  style: BuilderBlock | null;
  lighting: BuilderBlock | null;
  mood: BuilderBlock | null;
  camera: BuilderBlock | null;
  customNotes: string;
  synthesizedPrompt: string;
  markdownDoc: string;
};

export function synthesizeVisionDocument(
  style: BuilderBlock | null,
  lighting: BuilderBlock | null,
  mood: BuilderBlock | null,
  camera: BuilderBlock | null,
  customNotes: string,
): VisionDocument {
  const title = style?.name ? `${style.name} Architectural Vision` : "Architectural Vision Brief";
  const subtitle = [style?.name, lighting?.name, mood?.name].filter(Boolean).join(" · ") || "Custom Architectural Specification";
  const dateStr = new Date().toISOString().split("T")[0];

  const promptParts = [
    camera?.promptSnippet ?? "Eye-level architectural photography, 28mm lens with corrected vertical perspective",
    style?.promptSnippet ?? "Modern architectural visualization, high-end materiality and clean spatial composition",
    lighting?.promptSnippet ?? "Refined natural daylight with soft shadows and balanced ambient reflectance",
    mood?.promptSnippet ?? "Serene and sophisticated architectural atmosphere, editorial monograph grade",
    customNotes ? `Specific architectural directives: ${customNotes.trim()}` : "",
    "Ultra-high resolution 8k commercial architectural photography, Hasselblad camera quality, perfectly balanced tonal range, zero visual artifacts",
  ].filter(Boolean);

  const synthesizedPrompt = promptParts.join(", ");

  const markdownDoc = `# ${title}
*${subtitle}*
**Date**: ${dateStr}
**Status**: Ready for Rendering & Client Presentation

---

## 1. Architectural Concept & Style
**Selected Paradigm**: ${style?.name ?? "Custom Architectural Direction"}
${style?.description ?? "A bespoke spatial program balancing architectural mass, circulation, and material warmth."}

**Key Material Palette**:
${(style?.materials ?? ["Architectural concrete", "Natural white oak", "Honed limestone", "Structural glass"]).map((m) => `- ${m}`).join("\n")}

---

## 2. Lighting & Atmospheric Environment
**Lighting Condition**: ${lighting?.name ?? "Natural Balanced Daylight"}
${lighting?.description ?? "Carefully calibrated illumination accentuating architectural texture and volumetric depth."}

**Luminance Directives**:
${(lighting?.materials ?? ["Diffused natural daylight", "Soft architectural coves"]).map((m) => `- ${m}`).join("\n")}

---

## 3. Mood & Spatial Psychology
**Intended Atmosphere**: ${mood?.name ?? "Serene Architectural Sanctuary"}
${mood?.description ?? "Spatial composition designed to evoke quiet contemplation and refined luxury."}

---

## 4. Camera Angle & Compositional Framing
**Camera Strategy**: ${camera?.name ?? "Eye-Level Two-Point Perspective"}
${camera?.description ?? "Neutral 28mm human-scale perspective with perfectly vertical structural lines."}

${customNotes ? `--- \n\n## 5. Custom Studio Directives\n${customNotes.trim()}\n` : ""}
---

## 6. Synthesized AI Generation Prompt
\`\`\`text
${synthesizedPrompt}
\`\`\`

*Generated via Oriel Architectural Studio Brief Builder.*
`;

  return {
    title,
    subtitle,
    date: dateStr,
    style,
    lighting,
    mood,
    camera,
    customNotes,
    synthesizedPrompt,
    markdownDoc,
  };
}

export const BUILDER_PRESETS: {
  id: string;
  name: string;
  description: string;
  styleId: string;
  lightingId: string;
  moodId: string;
  cameraId: string;
  notes: string;
}[] = [
  {
    id: "zen-water-pavilion",
    name: "Zen Water Pavilion at Twilight",
    description: "Tadao Ando concrete pavilion with floor-to-ceiling glass floating over a reflecting pool at blue hour.",
    styleId: "minimalist-concrete-glass",
    lightingId: "blue-hour-twilight",
    moodId: "serene-sanctuary",
    cameraId: "eye-level-two-point",
    notes: "Ensure the pool reflection remains crisp and mirror-smooth with black granite stepping stones leading to the recessed entry.",
  },
  {
    id: "japandi-loft-haven",
    name: "Japandi Loft Sanctuary",
    description: "Warm oak and clay plaster warehouse conversion illuminated by soft diffused overcast morning light.",
    styleId: "japandi-minimalist",
    lightingId: "soft-overcast-diffused",
    moodId: "intimate-warmth",
    cameraId: "eye-level-two-point",
    notes: "Fluted glass sliding screens separating the primary suite from the double-height living room. Monolithic travertine kitchen island.",
  },
  {
    id: "subtropical-golden-hour",
    name: "Biophilic Subtropical Villa",
    description: "Deep teak louvers and volcanic stone terraces drenched in low-angle golden hour raking sunlight.",
    styleId: "contemporary-tropical",
    lightingId: "golden-hour-raking",
    moodId: "serene-sanctuary",
    cameraId: "low-angle-oblique",
    notes: "Accentuate the deep shadow cast by the cantilevered timber louvers across the volcanic stone walls and lush palm fronds.",
  },
  {
    id: "brutalist-sacred-light",
    name: "Monumental Chiaroscuro Chamber",
    description: "Textured board-marked concrete with a single celestial light beam illuminating raw textured stone.",
    styleId: "brutalist-sculptural",
    lightingId: "dramatic-chiaroscuro",
    moodId: "monastic-clarity",
    cameraId: "intimate-macro-junction",
    notes: "Highlight the tactile junction where the rough board-formed concrete meets a 5mm recessed blackened steel reveal.",
  },
];
