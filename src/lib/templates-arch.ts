import type { Template } from "@/lib/types";

export const ARCH_TEMPLATES: Template[] = [
  {
    id: "core-master",
    title: "CORE master brief",
    scope: "any",
    workflow: "framework",
    summary: "Platform-neutral brief. Translate it after the design decision is clear.",
    prompt: `CONTEXT
Create an early-stage [interior / exterior / architecture / landscape] visualization for [project and audience]. Use [reference input] as the source of truth.

PRESERVE
Keep [camera/crop], [geometry], [openings], [structural/site elements], and [important relationships] unchanged.

OBJECTIVE
Explore [one decision or clearly defined option set] for [client review / internal design discussion / presentation].

DESIGN DIRECTION
Use [spatial strategy], [materials and finishes], [color palette], [furniture/planting/facade language], and [contextual details].

RENDERING DIRECTION
Show [view type and composition], [perspective], [lighting source/time/quality], [atmosphere], and [level of occupancy]. Prioritize believable scale, material response, and readable spatial hierarchy.

EVALUATION
The image should make [specific decision] easy to evaluate. Treat it as a concept visualization; verify all technical and regulatory matters separately.`,
  },
  {
    id: "arch-massing",
    title: "Massing to concept",
    scope: "architecture",
    workflow: "edit",
    summary: "Turn a massing view into a discussable facade without inventing floors.",
    prompt: `CONTEXT: Turn the supplied massing view into an early-stage architectural concept visualization for [project type] in [location/context].
PRESERVE: Keep the camera, crop, massing, floor-to-floor relationships, roof profile, openings, site boundary, and neighboring context consistent with the reference.
OBJECTIVE: Explore [facade rhythm / material hierarchy / public entrance / relationship to landscape].
DESIGN: Use [primary material and finish], [secondary material], [glazing character], and [shading strategy]. Make the entrance legible without inventing additional floors or changing the structural rhythm.
RENDER: [eye-level two-point / elevated oblique] view, parallel verticals, [time and weather], believable material scale, restrained entourage, clear foreground-midground-background depth.
EVALUATE: The original massing must remain recognizable and the proposed design move must be easy to discuss.`,
  },
  {
    id: "arch-options",
    title: "Schematic option set",
    scope: "architecture",
    workflow: "compare",
    summary: "Three options. One variable. Same camera, daylight, and occupancy.",
    prompt: `Create three clearly differentiated concept options for the same [building/site] reference. Preserve the camera, massing, opening pattern, site access, and surrounding context in every option. Change only [facade depth and shading / material palette / roof-edge expression]. Option A: [direction A]. Option B: [direction B]. Option C: [direction C]. Use the same daylight, season, occupancy level, and presentation style so the design variable can be compared fairly.`,
  },
  {
    id: "arch-context",
    title: "Context and scale",
    scope: "architecture",
    workflow: "concept",
    summary: "Height, street edge, approach, and neighboring scale — not spectacle.",
    prompt: `Visualize [building type] within [urban/suburban/rural/coastal/woodland] context for an early client review. Emphasize the relationship between building height, street edge, landscape, pedestrian approach, and neighboring scale. Use [camera position], [weather/time], and a restrained number of people for scale. Avoid spectacle; prioritize a legible arrival sequence and believable everyday use.`,
  },
  {
    id: "arch-daylight",
    title: "Daylight character",
    scope: "architecture",
    workflow: "study",
    summary: "Three lights only. The design does not change between frames.",
    prompt: `Using the supplied architectural reference, preserve geometry, camera, materials, and context. Produce three lighting studies only: soft overcast morning, clear late-afternoon side light, and blue-hour exterior with warm interior illumination. Keep exposure balanced enough to read facade depth and glazing. Do not change the design between images.`,
  },
  {
    id: "arch-section",
    title: "Sectional perspective",
    scope: "architecture",
    workflow: "concept",
    summary: "Program, stair, daylight, and landscape in one conceptual cut.",
    prompt: `Create an early-stage sectional perspective of [building/space] showing the relationship between [program A], [program B], circulation, daylight entry, and the exterior landscape. Use a clean architectural visualization language with readable cut surfaces, restrained material differentiation, clear scale figures, and no decorative clutter. This is a conceptual communication image, not a measured technical section.`,
  },
  {
    id: "arch-hero",
    title: "Presentation hero",
    scope: "architecture",
    workflow: "concept",
    summary: "One idea, held by composition, material, light, and context.",
    prompt: `Create a client-presentation hero image for [project]. Communicate [one central design idea] through [composition], [material hierarchy], [light], and [relationship to context]. Show enough occupancy to explain use without obscuring the architecture. Use realistic texture scale, coherent shadows, controlled contrast, and a calm visual hierarchy. Avoid invented signage, logos, or technical claims.`,
  },
  {
    id: "arch-junction",
    title: "Material junction",
    scope: "architecture",
    workflow: "study",
    summary: "Thickness, joints, and weathering at presentation level — not a shop drawing.",
    prompt: `Create a close architectural visualization of the junction between [material A], [material B], [glazing/frame], and [landscape/interior element]. Show plausible thickness, joint rhythm, edge conditions, finish, reflectivity, and weather exposure at presentation level. Keep the detail conceptually believable but do not present it as a fabrication or construction detail.`,
  },
  {
    id: "arch-diagram",
    title: "Diagrammatic concept",
    scope: "architecture",
    workflow: "concept",
    summary: "One viewpoint, limited color, comprehension over photorealism.",
    prompt: `Create a restrained architectural concept diagram for [project] explaining [circulation / daylight / public-private gradient / landscape connection / massing logic]. Use simplified geometry, a limited [color palette], clear hierarchy, minimal labels, and one consistent axonometric or plan-oblique viewpoint. Prioritize comprehension over photorealism. Verify all diagram content against the actual project brief before presentation.`,
  },
];
