import type { Study } from "@/lib/types";

export const STUDIES: Study[] = [
  {
    id: "t01",
    code: "T01",
    title: "Neighborhood public library",
    scope: "architecture",
    workflow: "text",
    image: "/viz/t01-public-library.jpg",
    observation:
      "Entrance, civic porch, street scale, and material hierarchy are immediately legible.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 4, lighting: 5, comparison: 4, artifacts: 5 },
    prompt: `Create an early-stage concept visualization for a small neighborhood public library in a temperate urban context. The central design idea is a sheltered civic porch connecting the reading hall to a planted public forecourt. Show a two-story library with a legible entrance, warm light brick with realistic module scale, dark bronze frames, clear glazing, and a timber soffit. Use a low-rise mixed urban street, restrained pedestrian activity, an eye-level two-point perspective, parallel verticals, clear depth, and soft overcast afternoon light. Prioritize believable human scale, circulation, and material joints. No invented signage, logos, text, watermark, or dramatic spectacle.`,
  },
  {
    id: "t02",
    code: "T02",
    title: "Sectional community arts center",
    scope: "architecture",
    workflow: "text",
    image: "/viz/t02-sectional-arts-center.jpg",
    observation:
      "Program and stair read clearly. Some cut and finished-surface boundaries stay conceptual.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 4, lighting: 4, comparison: 4, artifacts: 4 },
    prompt: `Create an early-stage sectional perspective of a compact community arts center showing a double-height workshop, an upper gallery, a central stair, north daylight, and a planted courtyard. Use a clean oblique sectional perspective with realistic materials, legible pale-concrete cut surfaces, light timber acoustic lining, a matte dark-metal stair, parallel verticals, restrained scale figures, and soft north daylight through high glazing. Circulation and program relationships must read clearly. Keep the image conceptual rather than technical. No dimensions, labels, logos, text, or watermark.`,
  },
  {
    id: "t03",
    code: "T03",
    title: "Compact living room",
    scope: "interior",
    workflow: "text",
    image: "/viz/t03-compact-living-room.jpg",
    observation:
      "Work, lounge, storage, and circulation read coherently without an enlarged room.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 4, lighting: 5, comparison: 5, artifacts: 5 },
    prompt: `Visualize a compact 3.2 by 4.2 meter apartment living room for one resident who works from home. Prioritize a clear lounge zone, a small integrated desk, unobstructed circulation from the entry to the window, visually light furniture, and concealed storage. Use one large window wall and one doorway, an eye-level two-point perspective, parallel verticals, soft daylight balanced by subtle warm indirect light, matte light oak, warm-gray mineral plaster, wool upholstery, and a honed-limestone side table. Keep furniture scale and contact shadows plausible. Do not make the room appear larger through impossible geometry. No people, text, or watermark.`,
  },
  {
    id: "t04",
    code: "T04",
    title: "Neighborhood cafe",
    scope: "interior",
    workflow: "text",
    image: "/viz/t04-neighborhood-cafe.jpg",
    observation:
      "Arrival-to-counter sightline and mixed seating read. Aisle widths are not verified.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 5, lighting: 4, comparison: 4, artifacts: 4 },
    prompt: `Create an early-stage 40-seat neighborhood cafe interior for remote workers in the morning and small social groups in the evening. In a narrow ground-floor urban tenancy with street glazing, organize a clear arrival, ordering counter, mixed seating, accessible circulation, and an acoustic ceiling strategy. Use an eye-level entrance view with a legible sightline to the counter, soft morning daylight, warm low-glare task light, recycled brick, matte oak, acoustic felt, brushed stainless steel, durable terrazzo, and believable furniture and aisle scale. No brand signage, logos, decorative clutter, text, or watermark.`,
  },
  {
    id: "t05",
    code: "T05",
    title: "Subtropical home",
    scope: "exterior",
    workflow: "text",
    image: "/viz/t05-subtropical-home.jpg",
    observation:
      "Deep shade, rainscreen character, covered transition, and wet context are visible.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 4, lighting: 5, comparison: 4, artifacts: 5 },
    prompt: `Create an early facade character study for a two-story home in a hot-humid subtropical neighborhood. Show deep solar shading, a covered outdoor transition, durable rain-screen finishes, protected openings, and a close relationship to landscape. Use simple rectilinear massing, a legible entry, a natural street-facing eye-level view, parallel verticals, bright overcast light after rain, pale mineral render, ventilated dark timber-look rainscreen, bronze aluminum frames, and a concrete plinth. Keep construction character and proportions plausible. No logos, signage, text, watermark, dramatic cantilevers, or impossible structure.`,
  },
  {
    id: "t06",
    code: "T06",
    title: "Small urban courtyard",
    scope: "landscape",
    workflow: "text",
    image: "/viz/t06-urban-courtyard.jpg",
    observation:
      "Drainage, one ground material, seating, and layered planting are present. The table slightly tightens circulation.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 5, lighting: 4, comparison: 4, artifacts: 5 },
    prompt: `Create a compact 7 by 9 meter urban courtyard for four residents with visual privacy, mixed sun and shade, and low-to-medium maintenance. Preserve a plausible two-story brick enclosure, one glazed door, two windows, and visible accessible linear drainage. Show one seating zone, one primary ground material, layered perimeter planting, a small multi-stem tree, and restrained low lighting. Use an eye-level view from the glazed door, late-afternoon filtered light, permeable clay pavers, a weathered timber bench, gravel planting margins, and matte dark-metal edging. Keep circulation clear and planting away from openings. No people, oversized plants, text, or watermark.`,
  },
  {
    id: "t07",
    code: "T07",
    title: "Cultural campus",
    scope: "landscape",
    workflow: "text",
    image: "/viz/t07-cultural-campus.jpg",
    observation: "Main zones and service access are legible. Routes are concept-level, not a survey.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 4, lighting: 5, comparison: 5, artifacts: 4 },
    prompt: `Create an elevated oblique landscape visualization of a small cultural campus on a gently sloping temperate site at the edge of a town. Show the relationship among the main building, service access, pedestrian arrival, two terraces, planting masses, an open event lawn, and site edges. Use clear hierarchy, restrained entourage, soft morning light, pale concrete paths, a permeable gravel service route, native meadow, structured tree groves, and dark-metal roofs. Circulation must be continuous and building/landscape scale coherent. No labels, logos, text, watermark, or fantasy terrain.`,
  },
  {
    id: "t08",
    code: "T08",
    title: "Material junction",
    scope: "architecture",
    workflow: "text",
    image: "/viz/t08-material-junction.jpg",
    observation:
      "Material scale and contact conditions convince at presentation level. Not construction resolution.",
    scores: { brief: 5, fidelity: null, spatial: 4, material: 4, lighting: 5, comparison: 4, artifacts: 4 },
    prompt: `Create a close presentation-level architectural visualization of the junction between warm light brick, a dark-bronze window frame, a timber soffit, and a planted concrete base at a sheltered civic-building entrance. Use a close three-quarter view and soft grazing late-afternoon light. Show plausible brick module and mortar joints, low-sheen anodized aluminum, fine-grain timber, lightly weathered board-formed concrete, restrained grasses, thickness, joint rhythm, edge conditions, reflectivity, and weather exposure. Keep it concept-level rather than a technical detail. No impossible seams, labels, dimensions, logos, text, or watermark.`,
  },
  {
    id: "t09",
    code: "T09",
    title: "Wall-finish-only edit",
    scope: "interior",
    workflow: "edit",
    image: "/viz/t09-living-room-clay-edit.jpg",
    sourceImage: "/viz/t03-compact-living-room.jpg",
    observation:
      "Geometry held. The first edit warmed non-wall surfaces. A targeted revision reduced, but did not eliminate, the cast.",
    scores: { brief: 4, fidelity: 4, spatial: 4, material: 4, lighting: 3, comparison: 4, artifacts: 5 },
    metrics:
      "Edge F1 stayed near 0.94. Luminance SSIM moved from 0.742 to 0.783 after revision. Global channel-mean drift fell from 3.39 to 2.00.",
    prompt: `Change only the painted/mineral wall finish in the compact apartment living room to a deeper clay-toned lime plaster with subtle hand-applied variation. Preserve the exact camera, crop, room envelope, ceiling, doorway, window and exterior view, floor, built-in cabinetry, desk, television, furniture layout, rug, plants, artwork, curtains, lighting fixtures, exposure, daylight direction, and all object positions. Do not add, remove, resize, or move anything. Keep the same material boundaries. The result must remain immediately recognizable as the same room and support a fair before/after wall-finish comparison. Avoid camera drift, a wider room, changed furniture or lighting, new objects, text, or watermark.`,
    revision: {
      image: "/viz/t09-r1-living-room-clay-edit.jpg",
      note: "R1 asked for the original white balance back. Drift dropped. It did not disappear. Mask the walls when the comparison has to be fair.",
      prompt: `Starting from the original source, change only the exposed plaster walls to the clay-toned lime plaster seen in the first edit. Remove the first edit's global warm color cast. Match the source exactly for white balance, exposure, daylight, shadows, floor color, oak cabinetry, sofa and textiles, rug, stone table, plants, artwork, curtains, exterior view, and every non-wall surface. Preserve source pixels as closely as possible outside the plaster-wall masks. Do not add, remove, resize, restyle, recolor, or move anything except the plaster wall finish. Success is a fair A/B comparison in which the wall material is the only meaningful change.`,
    },
  },
  {
    id: "t10",
    code: "T10",
    title: "Day-to-dusk exterior edit",
    scope: "exterior",
    workflow: "edit",
    image: "/viz/t10-home-dusk-edit.jpg",
    sourceImage: "/viz/t05-subtropical-home.jpg",
    observation:
      "Camera, massing, openings, and planting stayed recognizable while illumination changed.",
    scores: { brief: 5, fidelity: 5, spatial: 5, material: 4, lighting: 5, comparison: 5, artifacts: 5 },
    metrics:
      "Luminance SSIM was 0.475 because the light change is intentional. Structural edges held at 0.879 F1.",
    prompt: `Convert only the time of day and illumination to early blue-hour dusk. Retain a visible cool-blue ambient sky; add balanced warm interior illumination and restrained existing soffit and landscape lighting with plausible reflections in wet paving and glazing. Preserve the exact camera, crop, footprint, two-story massing, roof, eaves, columns, opening pattern, doors, window frames, shutters, facade materials and boundaries, steps, driveway, grade, neighboring buildings, mature trees, and planting positions. Do not add fixtures or architectural elements. Avoid geometry drift, material changes, added windows, a dramatic night scene, excessive glow, text, logo, or watermark.`,
  },
];

export const RUN_NOTE =
  "September 8, 2026. Built-in OpenAI image tool in Codex. Model identifier, seed, and reference strength were not exposed. Every first output is kept — nothing was cherry-picked. These frames are evidence for that runtime, not a ranking of providers and not client work.";
