import type { Template } from "@/lib/types";

export const INTERIOR_TEMPLATES: Template[] = [
  {
    id: "int-redesign",
    title: "Existing-room redesign",
    scope: "interior",
    workflow: "edit",
    summary: "Change finishes and loose pieces. Hold the envelope, camera, and white balance.",
    prompt: `TASK: Edit the supplied [room type] image into an early-stage [design direction] concept.
PRESERVE: Camera position, crop, room envelope, ceiling height, floor boundary, windows, doors, structural elements, built-in elements, circulation, exposure, white balance, and every non-target material.
CHANGE: Wall and floor finishes, loose furniture, textiles, decorative lighting, and styling only.
DESIGN: Use [material palette with finishes], [color palette], [furniture language], and [one focal element]. Keep furniture appropriately scaled and maintain usable movement paths.
LIGHT: [daylight source/direction] balanced with [artificial-light character].
OUTPUT: Realistic interior visualization for [internal review/client discussion], with believable texture scale and a clear spatial hierarchy.
SUCCESS: Outside the requested change area, match the source as closely as the workflow permits. Inspect non-target surfaces for color or lighting drift; use a mask-capable edit when strict isolation matters.`,
  },
  {
    id: "int-materials",
    title: "Material palette comparison",
    scope: "interior",
    workflow: "compare",
    summary: "Three palettes. Geometry, furniture, openings, and light stay fixed.",
    prompt: `Using the same [room] reference, create three material studies while preserving geometry, camera, furniture layout, openings, and lighting. Option A: [palette A]. Option B: [palette B]. Option C: [palette C]. Show finish, grain, joint scale, reflectivity, and the relationship between floor, wall, joinery, and textiles. Keep all non-material variables constant for fair comparison.`,
  },
  {
    id: "int-lighting",
    title: "Lighting mood comparison",
    scope: "interior",
    workflow: "compare",
    summary: "Same room, three moods. Name direction, layers, and color temperature.",
    prompt: `Preserve the supplied interior design, materials, furniture, camera, and exterior view. Compare three lighting moods only: [soft daytime], [warm evening], and [dramatic presentation]. For each, state the apparent daylight direction, artificial-light layers, contrast, and color-temperature relationship. Avoid unexplained glowing surfaces and inconsistent shadows.`,
  },
  {
    id: "int-furniture",
    title: "Furniture direction",
    scope: "interior",
    workflow: "concept",
    summary: "Zoning, conversation, sightlines, and scale — not verified clearances.",
    prompt: `Create an early-stage furniture direction for [room type and users]. Preserve the room envelope, openings, built-ins, and required circulation. Use [seating/work/dining requirements], [furniture character], [upholstery/finish palette], and [storage need]. Communicate zoning, conversational relationships, sightlines, and human scale. Do not imply that clearances or product dimensions have been verified.`,
  },
  {
    id: "int-small",
    title: "Small-room concept",
    scope: "interior",
    workflow: "concept",
    summary: "One function, clear circulation, light furniture, one focal point.",
    prompt: `Visualize a compact [room type] with [approximate dimensions if known] for [user needs]. Prioritize a clear primary function, unobstructed circulation, visually light furniture, integrated storage, and one controlled focal point. Use [materials], [color strategy], and [lighting approach] to support spaciousness without changing the actual room envelope or removing necessary openings.`,
  },
  {
    id: "int-hospitality",
    title: "Hospitality atmosphere",
    scope: "interior",
    workflow: "concept",
    summary: "Arrival, seating rhythm, service, light, and durable materials.",
    prompt: `Create an early-stage [cafe/restaurant/hotel/lounge] interior concept for [brand and audience]. Organize the scene around arrival, seating rhythm, service flow, lighting hierarchy, acoustic softness, and durable material character. Show [material palette], [fixture language], and [desired mood] in a realistic [wide/mid-range] view. Keep branding generic unless authorized assets are provided.`,
  },
  {
    id: "int-workplace",
    title: "Workplace concept",
    scope: "interior",
    workflow: "concept",
    summary: "Zones, daylight, acoustics cues, and inclusive use — not a code claim.",
    prompt: `Visualize a [workplace type] supporting [focus/collaboration/client meetings/flexible use]. Show clear zoning, circulation, acoustic separation cues, daylight access, storage, and inclusive use. Use [material and color direction], [furniture system], and [lighting strategy]. Present a plausible early concept without claiming verified occupancy, egress, accessibility, ergonomics, or code compliance.`,
  },
  {
    id: "int-kitchen",
    title: "Kitchen finish study",
    scope: "interior",
    workflow: "edit",
    summary: "Cabinet, worktop, splash, hardware. Utilities and the island footprint stay.",
    prompt: `Edit the supplied kitchen reference while preserving the room envelope, window and door positions, appliance locations, plumbing-related fixture positions, cabinet run, island footprint, and camera. Change only cabinet finish, worktop, backsplash, hardware, decorative lighting, and loose styling. Use [palette] with plausible joints, edges, texture scale, and reflections. Do not move utilities or imply technical coordination.`,
  },
  {
    id: "int-bath",
    title: "Bathroom atmosphere",
    scope: "interior",
    workflow: "edit",
    summary: "Material character only. Wet-area layout and fixtures stay unresolved technically.",
    prompt: `Create an early bathroom concept using [stone/tile/plaster], [metal finish], [joinery], and [lighting mood]. Preserve the supplied envelope, openings, wet-area layout, fixtures, and camera unless the brief explicitly allows changes. Show believable material transitions and moisture-aware visual character without representing waterproofing, drainage, electrical zones, accessibility, or product compliance as resolved.`,
  },
  {
    id: "int-detail",
    title: "Presentation detail",
    scope: "interior",
    workflow: "study",
    summary: "Edges, grain, joints, and contact shadows in the wider design language.",
    prompt: `Create a mid-range or close interior view focused on [joinery/material junction/furniture grouping/lighting feature]. Show [materials and finishes] with realistic edge conditions, grain direction, joint scale, softness, reflection, and contact shadows. Keep the wider design language consistent and avoid turning the image into an unbuildable decorative vignette.`,
  },
];
