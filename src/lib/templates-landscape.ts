import type { Template } from "@/lib/types";

export const LANDSCAPE_TEMPLATES: Template[] = [
  {
    id: "land-yard",
    title: "Existing-yard concept",
    scope: "landscape",
    workflow: "edit",
    summary: "Beds, paving finish, and loose pieces. Trees to remain and grade stay.",
    prompt: `TASK: Edit the supplied yard photograph into an early-stage landscape concept for [users and activities].
PRESERVE: Camera, property edges, building, doors and windows, visible utilities, mature trees marked to remain, grade relationships, driveway, and required access.
CHANGE: Planting beds, paving finish within the stated area, loose furniture, low landscape lighting, and decorative elements.
DESIGN: Use [planting character], [hardscape palette], [activity zones], and [maintenance level] suited conceptually to [climate/setting].
OUTPUT: Realistic landscape visualization for concept discussion, with believable mature scale and seasonal character.`,
  },
  {
    id: "land-planting",
    title: "Planting character",
    scope: "landscape",
    workflow: "compare",
    summary: "Evergreen, naturalistic, or seasonal — site and hardscape fixed.",
    prompt: `Create three planting-character studies for the same fixed site and hardscape: A) restrained evergreen structure, B) layered naturalistic planting, C) seasonal ornamental planting. Preserve buildings, grades, circulation, paving, camera, and daylight. Compare planting density, height hierarchy, texture, color rhythm, and screening while avoiding claims of verified species suitability.`,
  },
  {
    id: "land-hardscape",
    title: "Hardscape materials",
    scope: "landscape",
    workflow: "compare",
    summary: "Unit, joint, edge, and wet appearance. Paths and grades do not move.",
    prompt: `Using the same landscape reference, preserve grading, drainage intent, path and terrace geometry, planting layout, furniture, and camera. Change only hardscape materials. Compare [option A], [option B], and [option C], showing plausible unit size, joint pattern, edge condition, texture, wet/dry appearance, and relationship to the architecture.`,
  },
  {
    id: "land-zones",
    title: "Outdoor-room zoning",
    scope: "landscape",
    workflow: "concept",
    summary: "Arrival, dining, quiet, play, and planting made legible without blocking circulation.",
    prompt: `Visualize an early landscape concept organizing [site] into [arrival], [dining], [quiet seating], [play/work], and [planting/ecology] zones. Preserve fixed access, structures, major trees, and grade constraints. Use planting, low walls, paving changes, shade, and furniture to make transitions legible while maintaining clear circulation.`,
  },
  {
    id: "land-courtyard",
    title: "Small urban courtyard",
    scope: "landscape",
    workflow: "concept",
    summary: "One ground, layered edges, compact seating, uncluttered scale.",
    prompt: `Create a compact courtyard concept for [users] with [privacy need], [sun/shade condition], and [maintenance level]. Preserve the courtyard boundary, doors, windows, drainage points, and access. Use one primary ground material, layered perimeter planting, a compact seating arrangement, and restrained lighting. Keep the spatial composition uncluttered and plausibly scaled.`,
  },
  {
    id: "land-arrival",
    title: "Front-yard arrival",
    scope: "landscape",
    workflow: "concept",
    summary: "Street to door, without blocking sightlines or required routes.",
    prompt: `Develop an early front-yard arrival concept connecting [street/driveway] to the existing entrance. Preserve grade, driveway, required pedestrian route, utility locations, trees to remain, and building openings. Use [path material], [planting hierarchy], [wayfinding cue], and [lighting character] to clarify arrival without obstructing access or sightlines.`,
  },
  {
    id: "land-pool",
    title: "Pool and terrace",
    scope: "landscape",
    workflow: "concept",
    summary: "Atmosphere around fixed water and building. Safety is not resolved here.",
    prompt: `Visualize a concept-level pool and terrace environment using the supplied fixed pool and building geometry. Explore [paving], [shade structure concept], [seating zones], [planting character], and [time of day]. Preserve circulation and clear edges visually. Treat barriers, slip resistance, drainage, structure, setbacks, utilities, and safety compliance as unresolved.`,
  },
  {
    id: "land-season",
    title: "Seasonal study",
    scope: "landscape",
    workflow: "study",
    summary: "Same design and camera. Only plausible seasonal change.",
    prompt: `Using the same landscape design and camera, create [spring/summer/autumn/winter or wet/dry season] studies. Preserve all geometry and species locations. Change only seasonally plausible foliage, bloom, ground condition, sky, and light. Use the images to discuss seasonal experience, not to guarantee exact bloom time or plant performance.`,
  },
  {
    id: "land-evening",
    title: "Evening landscape light",
    scope: "landscape",
    workflow: "edit",
    summary: "Named fixtures only, blue ambient sky, readable paths.",
    prompt: `Preserve the landscape design, planting, hardscape, structures, and camera. Convert the scene to early evening with a remaining blue ambient sky. Show restrained path, step, feature-tree, seating, and facade lighting only where identified in the brief. Maintain readable circulation and avoid excessive glow, uplight, or invented fixtures.`,
  },
  {
    id: "land-overview",
    title: "Elevated site overview",
    scope: "landscape",
    workflow: "concept",
    summary: "Building, access, terraces, and edges. Concept-level, not a survey.",
    prompt: `Create an elevated oblique landscape visualization showing the relationship among building, access, paths, terraces, planting masses, open space, and site edges. Use a clear hierarchy and restrained entourage. Keep known grades and major existing elements consistent with the reference, while labeling the output concept-level rather than survey-accurate.`,
  },
];
