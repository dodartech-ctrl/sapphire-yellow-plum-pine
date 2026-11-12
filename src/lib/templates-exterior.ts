import type { Template } from "@/lib/types";

export const EXTERIOR_TEMPLATES: Template[] = [
  {
    id: "ext-refresh",
    title: "Facade refresh",
    scope: "exterior",
    workflow: "edit",
    summary: "Cladding, paint, door, and soft landscape. Massing and openings stay.",
    prompt: `TASK: Edit the supplied home photograph into an early-stage facade refresh.
PRESERVE: Camera and crop, building footprint and massing, roof form and pitch, eaves, windows, doors, garage openings, driveway, visible grade, and neighboring context.
CHANGE: Cladding finish, paint color, trim, front-door finish, decorative lighting, and soft landscape character only.
DESIGN: Use [primary finish], [secondary finish], [frame/trim color], and [accent]. Keep joints, edges, weathering, and material scale believable.
OUTPUT: Natural street-facing architectural visualization for homeowner and designer discussion.`,
  },
  {
    id: "ext-materials",
    title: "Facade material comparison",
    scope: "exterior",
    workflow: "compare",
    summary: "Three palettes on the same openings, roof, season, and camera.",
    prompt: `Create three facade material options from the same reference. Preserve geometry, opening pattern, roof, camera, season, daylight, driveway, and planting mass. Option A: [material palette A]. Option B: [material palette B]. Option C: [material palette C]. Keep the location and proportion of each material zone consistent enough for fair comparison.`,
  },
  {
    id: "ext-color",
    title: "Color-only study",
    scope: "exterior",
    workflow: "edit",
    summary: "Paint, trim, door, and metal. Every boundary and shadow stays.",
    prompt: `Using the supplied exterior image, change only paint, cladding color, trim color, front-door color, and visible metal finish. Preserve every architectural element, material boundary, camera detail, landscape element, and lighting condition. Produce [number] coordinated palettes for [design goal], labeled separately outside the image if labels are required.`,
  },
  {
    id: "ext-entry",
    title: "Entry emphasis",
    scope: "exterior",
    workflow: "concept",
    summary: "Make the existing door readable. Do not invent structure.",
    prompt: `Develop an early concept that makes the existing front entry more legible from [street/driveway/path]. Preserve the building envelope, roof, windows, door opening, steps, grade, and access route. Explore [canopy/lighting/material/planting] emphasis within the allowed scope. Show a welcoming but restrained arrival sequence and do not invent structural support or compliant details.`,
  },
  {
    id: "ext-dusk",
    title: "Day to dusk",
    scope: "exterior",
    workflow: "edit",
    summary: "Sky and illumination only. No new fixtures unless the brief names them.",
    prompt: `Preserve the supplied house design, materials, site, camera, and landscape. Convert only the lighting and sky to early dusk. Show balanced warm interior light, restrained exterior fixtures, readable entry and path illumination, plausible reflections in glazing, and remaining cool ambient daylight. Do not add fixtures where none are proposed in the brief.`,
  },
  {
    id: "ext-curb",
    title: "Curb-appeal planting",
    scope: "exterior",
    workflow: "edit",
    summary: "Soft landscape over a fixed house, grade, and access.",
    prompt: `Using the existing-home reference, preserve the house, openings, driveway, walkways, grade, utilities, and camera. Add an early-stage soft-landscape concept using [planting character], [season], [height hierarchy], and [maintenance level]. Keep planting clear of doors, windows, access, and key facade features. Plant identity and mature size require local professional verification.`,
  },
  {
    id: "ext-addition",
    title: "Addition visualization",
    scope: "exterior",
    workflow: "concept",
    summary: "Old and new, related by massing, material, roof, and openings.",
    prompt: `Visualize a conceptual [rear/side/upper-level] addition to the supplied home based on [sketch or massing reference]. Preserve the existing house outside the stated intervention area. Communicate the relationship between old and new through [massing], [material transition], [roof relationship], and [opening rhythm]. Treat all structure, setbacks, code, waterproofing, and constructability as unresolved.`,
  },
  {
    id: "ext-climate",
    title: "Climate character",
    scope: "exterior",
    workflow: "study",
    summary: "Shade, cover, and exposure as intent — not a performance proof.",
    prompt: `Create an early facade character study for a home in [climate/context]. Visually explore [solar shading], [covered transition], [durable finish], [rain/snow exposure response], and [landscape relationship] while keeping the supplied massing and openings fixed. The image should communicate intent only; verify performance and detailing through technical design.`,
  },
  {
    id: "ext-elevation",
    title: "Elevation-like view",
    scope: "exterior",
    workflow: "study",
    summary: "Parallel verticals and even light for a fair facade read. Not a measured elevation.",
    prompt: `Create a restrained frontal, elevation-like visualization of the supplied home with parallel verticals and minimal perspective distortion. Preserve all proportions and openings. Use even daylight and limited landscape obstruction so [material/color/facade rhythm] can be reviewed clearly. Do not present the output as a measured elevation.`,
  },
  {
    id: "ext-close",
    title: "Exterior close-up",
    scope: "exterior",
    workflow: "study",
    summary: "Module, edge, and weathering. Flashing and fixings stay unresolved.",
    prompt: `Create a close exterior concept view of [cladding], [window frame], [soffit], and [base/landscape junction]. Show finish, joint direction, module scale, edge treatment, reflectivity, and light weathering. Keep the image visually plausible while clearly treating flashing, waterproofing, fixings, and construction details as unresolved.`,
  },
];
