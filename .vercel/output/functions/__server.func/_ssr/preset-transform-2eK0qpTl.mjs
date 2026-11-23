// node_modules/.nitro/vite/services/ssr/assets/preset-transform-2eK0qpTl.js
var ARCH_TEMPLATES = [
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
The image should make [specific decision] easy to evaluate. Treat it as a concept visualization; verify all technical and regulatory matters separately.`
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
EVALUATE: The original massing must remain recognizable and the proposed design move must be easy to discuss.`
	},
	{
		id: "arch-options",
		title: "Schematic option set",
		scope: "architecture",
		workflow: "compare",
		summary: "Three options. One variable. Same camera, daylight, and occupancy.",
		prompt: `Create three clearly differentiated concept options for the same [building/site] reference. Preserve the camera, massing, opening pattern, site access, and surrounding context in every option. Change only [facade depth and shading / material palette / roof-edge expression]. Option A: [direction A]. Option B: [direction B]. Option C: [direction C]. Use the same daylight, season, occupancy level, and presentation style so the design variable can be compared fairly.`
	},
	{
		id: "arch-context",
		title: "Context and scale",
		scope: "architecture",
		workflow: "concept",
		summary: "Height, street edge, approach, and neighboring scale — not spectacle.",
		prompt: `Visualize [building type] within [urban/suburban/rural/coastal/woodland] context for an early client review. Emphasize the relationship between building height, street edge, landscape, pedestrian approach, and neighboring scale. Use [camera position], [weather/time], and a restrained number of people for scale. Avoid spectacle; prioritize a legible arrival sequence and believable everyday use.`
	},
	{
		id: "arch-daylight",
		title: "Daylight character",
		scope: "architecture",
		workflow: "study",
		summary: "Three lights only. The design does not change between frames.",
		prompt: `Using the supplied architectural reference, preserve geometry, camera, materials, and context. Produce three lighting studies only: soft overcast morning, clear late-afternoon side light, and blue-hour exterior with warm interior illumination. Keep exposure balanced enough to read facade depth and glazing. Do not change the design between images.`
	},
	{
		id: "arch-section",
		title: "Sectional perspective",
		scope: "architecture",
		workflow: "concept",
		summary: "Program, stair, daylight, and landscape in one conceptual cut.",
		prompt: `Create an early-stage sectional perspective of [building/space] showing the relationship between [program A], [program B], circulation, daylight entry, and the exterior landscape. Use a clean architectural visualization language with readable cut surfaces, restrained material differentiation, clear scale figures, and no decorative clutter. This is a conceptual communication image, not a measured technical section.`
	},
	{
		id: "arch-hero",
		title: "Presentation hero",
		scope: "architecture",
		workflow: "concept",
		summary: "One idea, held by composition, material, light, and context.",
		prompt: `Create a client-presentation hero image for [project]. Communicate [one central design idea] through [composition], [material hierarchy], [light], and [relationship to context]. Show enough occupancy to explain use without obscuring the architecture. Use realistic texture scale, coherent shadows, controlled contrast, and a calm visual hierarchy. Avoid invented signage, logos, or technical claims.`
	},
	{
		id: "arch-junction",
		title: "Material junction",
		scope: "architecture",
		workflow: "study",
		summary: "Thickness, joints, and weathering at presentation level — not a shop drawing.",
		prompt: `Create a close architectural visualization of the junction between [material A], [material B], [glazing/frame], and [landscape/interior element]. Show plausible thickness, joint rhythm, edge conditions, finish, reflectivity, and weather exposure at presentation level. Keep the detail conceptually believable but do not present it as a fabrication or construction detail.`
	},
	{
		id: "arch-diagram",
		title: "Diagrammatic concept",
		scope: "architecture",
		workflow: "concept",
		summary: "One viewpoint, limited color, comprehension over photorealism.",
		prompt: `Create a restrained architectural concept diagram for [project] explaining [circulation / daylight / public-private gradient / landscape connection / massing logic]. Use simplified geometry, a limited [color palette], clear hierarchy, minimal labels, and one consistent axonometric or plan-oblique viewpoint. Prioritize comprehension over photorealism. Verify all diagram content against the actual project brief before presentation.`
	}
];
var EXTERIOR_TEMPLATES = [
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
OUTPUT: Natural street-facing architectural visualization for homeowner and designer discussion.`
	},
	{
		id: "ext-materials",
		title: "Facade material comparison",
		scope: "exterior",
		workflow: "compare",
		summary: "Three palettes on the same openings, roof, season, and camera.",
		prompt: `Create three facade material options from the same reference. Preserve geometry, opening pattern, roof, camera, season, daylight, driveway, and planting mass. Option A: [material palette A]. Option B: [material palette B]. Option C: [material palette C]. Keep the location and proportion of each material zone consistent enough for fair comparison.`
	},
	{
		id: "ext-color",
		title: "Color-only study",
		scope: "exterior",
		workflow: "edit",
		summary: "Paint, trim, door, and metal. Every boundary and shadow stays.",
		prompt: `Using the supplied exterior image, change only paint, cladding color, trim color, front-door color, and visible metal finish. Preserve every architectural element, material boundary, camera detail, landscape element, and lighting condition. Produce [number] coordinated palettes for [design goal], labeled separately outside the image if labels are required.`
	},
	{
		id: "ext-entry",
		title: "Entry emphasis",
		scope: "exterior",
		workflow: "concept",
		summary: "Make the existing door readable. Do not invent structure.",
		prompt: `Develop an early concept that makes the existing front entry more legible from [street/driveway/path]. Preserve the building envelope, roof, windows, door opening, steps, grade, and access route. Explore [canopy/lighting/material/planting] emphasis within the allowed scope. Show a welcoming but restrained arrival sequence and do not invent structural support or compliant details.`
	},
	{
		id: "ext-dusk",
		title: "Day to dusk",
		scope: "exterior",
		workflow: "edit",
		summary: "Sky and illumination only. No new fixtures unless the brief names them.",
		prompt: `Preserve the supplied house design, materials, site, camera, and landscape. Convert only the lighting and sky to early dusk. Show balanced warm interior light, restrained exterior fixtures, readable entry and path illumination, plausible reflections in glazing, and remaining cool ambient daylight. Do not add fixtures where none are proposed in the brief.`
	},
	{
		id: "ext-curb",
		title: "Curb-appeal planting",
		scope: "exterior",
		workflow: "edit",
		summary: "Soft landscape over a fixed house, grade, and access.",
		prompt: `Using the existing-home reference, preserve the house, openings, driveway, walkways, grade, utilities, and camera. Add an early-stage soft-landscape concept using [planting character], [season], [height hierarchy], and [maintenance level]. Keep planting clear of doors, windows, access, and key facade features. Plant identity and mature size require local professional verification.`
	},
	{
		id: "ext-addition",
		title: "Addition visualization",
		scope: "exterior",
		workflow: "concept",
		summary: "Old and new, related by massing, material, roof, and openings.",
		prompt: `Visualize a conceptual [rear/side/upper-level] addition to the supplied home based on [sketch or massing reference]. Preserve the existing house outside the stated intervention area. Communicate the relationship between old and new through [massing], [material transition], [roof relationship], and [opening rhythm]. Treat all structure, setbacks, code, waterproofing, and constructability as unresolved.`
	},
	{
		id: "ext-climate",
		title: "Climate character",
		scope: "exterior",
		workflow: "study",
		summary: "Shade, cover, and exposure as intent — not a performance proof.",
		prompt: `Create an early facade character study for a home in [climate/context]. Visually explore [solar shading], [covered transition], [durable finish], [rain/snow exposure response], and [landscape relationship] while keeping the supplied massing and openings fixed. The image should communicate intent only; verify performance and detailing through technical design.`
	},
	{
		id: "ext-elevation",
		title: "Elevation-like view",
		scope: "exterior",
		workflow: "study",
		summary: "Parallel verticals and even light for a fair facade read. Not a measured elevation.",
		prompt: `Create a restrained frontal, elevation-like visualization of the supplied home with parallel verticals and minimal perspective distortion. Preserve all proportions and openings. Use even daylight and limited landscape obstruction so [material/color/facade rhythm] can be reviewed clearly. Do not present the output as a measured elevation.`
	},
	{
		id: "ext-close",
		title: "Exterior close-up",
		scope: "exterior",
		workflow: "study",
		summary: "Module, edge, and weathering. Flashing and fixings stay unresolved.",
		prompt: `Create a close exterior concept view of [cladding], [window frame], [soffit], and [base/landscape junction]. Show finish, joint direction, module scale, edge treatment, reflectivity, and light weathering. Keep the image visually plausible while clearly treating flashing, waterproofing, fixings, and construction details as unresolved.`
	}
];
var INTERIOR_TEMPLATES = [
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
SUCCESS: Outside the requested change area, match the source as closely as the workflow permits. Inspect non-target surfaces for color or lighting drift; use a mask-capable edit when strict isolation matters.`
	},
	{
		id: "int-materials",
		title: "Material palette comparison",
		scope: "interior",
		workflow: "compare",
		summary: "Three palettes. Geometry, furniture, openings, and light stay fixed.",
		prompt: `Using the same [room] reference, create three material studies while preserving geometry, camera, furniture layout, openings, and lighting. Option A: [palette A]. Option B: [palette B]. Option C: [palette C]. Show finish, grain, joint scale, reflectivity, and the relationship between floor, wall, joinery, and textiles. Keep all non-material variables constant for fair comparison.`
	},
	{
		id: "int-lighting",
		title: "Lighting mood comparison",
		scope: "interior",
		workflow: "compare",
		summary: "Same room, three moods. Name direction, layers, and color temperature.",
		prompt: `Preserve the supplied interior design, materials, furniture, camera, and exterior view. Compare three lighting moods only: [soft daytime], [warm evening], and [dramatic presentation]. For each, state the apparent daylight direction, artificial-light layers, contrast, and color-temperature relationship. Avoid unexplained glowing surfaces and inconsistent shadows.`
	},
	{
		id: "int-furniture",
		title: "Furniture direction",
		scope: "interior",
		workflow: "concept",
		summary: "Zoning, conversation, sightlines, and scale — not verified clearances.",
		prompt: `Create an early-stage furniture direction for [room type and users]. Preserve the room envelope, openings, built-ins, and required circulation. Use [seating/work/dining requirements], [furniture character], [upholstery/finish palette], and [storage need]. Communicate zoning, conversational relationships, sightlines, and human scale. Do not imply that clearances or product dimensions have been verified.`
	},
	{
		id: "int-small",
		title: "Small-room concept",
		scope: "interior",
		workflow: "concept",
		summary: "One function, clear circulation, light furniture, one focal point.",
		prompt: `Visualize a compact [room type] with [approximate dimensions if known] for [user needs]. Prioritize a clear primary function, unobstructed circulation, visually light furniture, integrated storage, and one controlled focal point. Use [materials], [color strategy], and [lighting approach] to support spaciousness without changing the actual room envelope or removing necessary openings.`
	},
	{
		id: "int-hospitality",
		title: "Hospitality atmosphere",
		scope: "interior",
		workflow: "concept",
		summary: "Arrival, seating rhythm, service, light, and durable materials.",
		prompt: `Create an early-stage [cafe/restaurant/hotel/lounge] interior concept for [brand and audience]. Organize the scene around arrival, seating rhythm, service flow, lighting hierarchy, acoustic softness, and durable material character. Show [material palette], [fixture language], and [desired mood] in a realistic [wide/mid-range] view. Keep branding generic unless authorized assets are provided.`
	},
	{
		id: "int-workplace",
		title: "Workplace concept",
		scope: "interior",
		workflow: "concept",
		summary: "Zones, daylight, acoustics cues, and inclusive use — not a code claim.",
		prompt: `Visualize a [workplace type] supporting [focus/collaboration/client meetings/flexible use]. Show clear zoning, circulation, acoustic separation cues, daylight access, storage, and inclusive use. Use [material and color direction], [furniture system], and [lighting strategy]. Present a plausible early concept without claiming verified occupancy, egress, accessibility, ergonomics, or code compliance.`
	},
	{
		id: "int-kitchen",
		title: "Kitchen finish study",
		scope: "interior",
		workflow: "edit",
		summary: "Cabinet, worktop, splash, hardware. Utilities and the island footprint stay.",
		prompt: `Edit the supplied kitchen reference while preserving the room envelope, window and door positions, appliance locations, plumbing-related fixture positions, cabinet run, island footprint, and camera. Change only cabinet finish, worktop, backsplash, hardware, decorative lighting, and loose styling. Use [palette] with plausible joints, edges, texture scale, and reflections. Do not move utilities or imply technical coordination.`
	},
	{
		id: "int-bath",
		title: "Bathroom atmosphere",
		scope: "interior",
		workflow: "edit",
		summary: "Material character only. Wet-area layout and fixtures stay unresolved technically.",
		prompt: `Create an early bathroom concept using [stone/tile/plaster], [metal finish], [joinery], and [lighting mood]. Preserve the supplied envelope, openings, wet-area layout, fixtures, and camera unless the brief explicitly allows changes. Show believable material transitions and moisture-aware visual character without representing waterproofing, drainage, electrical zones, accessibility, or product compliance as resolved.`
	},
	{
		id: "int-detail",
		title: "Presentation detail",
		scope: "interior",
		workflow: "study",
		summary: "Edges, grain, joints, and contact shadows in the wider design language.",
		prompt: `Create a mid-range or close interior view focused on [joinery/material junction/furniture grouping/lighting feature]. Show [materials and finishes] with realistic edge conditions, grain direction, joint scale, softness, reflection, and contact shadows. Keep the wider design language consistent and avoid turning the image into an unbuildable decorative vignette.`
	}
];
var LANDSCAPE_TEMPLATES = [
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
OUTPUT: Realistic landscape visualization for concept discussion, with believable mature scale and seasonal character.`
	},
	{
		id: "land-planting",
		title: "Planting character",
		scope: "landscape",
		workflow: "compare",
		summary: "Evergreen, naturalistic, or seasonal — site and hardscape fixed.",
		prompt: `Create three planting-character studies for the same fixed site and hardscape: A) restrained evergreen structure, B) layered naturalistic planting, C) seasonal ornamental planting. Preserve buildings, grades, circulation, paving, camera, and daylight. Compare planting density, height hierarchy, texture, color rhythm, and screening while avoiding claims of verified species suitability.`
	},
	{
		id: "land-hardscape",
		title: "Hardscape materials",
		scope: "landscape",
		workflow: "compare",
		summary: "Unit, joint, edge, and wet appearance. Paths and grades do not move.",
		prompt: `Using the same landscape reference, preserve grading, drainage intent, path and terrace geometry, planting layout, furniture, and camera. Change only hardscape materials. Compare [option A], [option B], and [option C], showing plausible unit size, joint pattern, edge condition, texture, wet/dry appearance, and relationship to the architecture.`
	},
	{
		id: "land-zones",
		title: "Outdoor-room zoning",
		scope: "landscape",
		workflow: "concept",
		summary: "Arrival, dining, quiet, play, and planting made legible without blocking circulation.",
		prompt: `Visualize an early landscape concept organizing [site] into [arrival], [dining], [quiet seating], [play/work], and [planting/ecology] zones. Preserve fixed access, structures, major trees, and grade constraints. Use planting, low walls, paving changes, shade, and furniture to make transitions legible while maintaining clear circulation.`
	},
	{
		id: "land-courtyard",
		title: "Small urban courtyard",
		scope: "landscape",
		workflow: "concept",
		summary: "One ground, layered edges, compact seating, uncluttered scale.",
		prompt: `Create a compact courtyard concept for [users] with [privacy need], [sun/shade condition], and [maintenance level]. Preserve the courtyard boundary, doors, windows, drainage points, and access. Use one primary ground material, layered perimeter planting, a compact seating arrangement, and restrained lighting. Keep the spatial composition uncluttered and plausibly scaled.`
	},
	{
		id: "land-arrival",
		title: "Front-yard arrival",
		scope: "landscape",
		workflow: "concept",
		summary: "Street to door, without blocking sightlines or required routes.",
		prompt: `Develop an early front-yard arrival concept connecting [street/driveway] to the existing entrance. Preserve grade, driveway, required pedestrian route, utility locations, trees to remain, and building openings. Use [path material], [planting hierarchy], [wayfinding cue], and [lighting character] to clarify arrival without obstructing access or sightlines.`
	},
	{
		id: "land-pool",
		title: "Pool and terrace",
		scope: "landscape",
		workflow: "concept",
		summary: "Atmosphere around fixed water and building. Safety is not resolved here.",
		prompt: `Visualize a concept-level pool and terrace environment using the supplied fixed pool and building geometry. Explore [paving], [shade structure concept], [seating zones], [planting character], and [time of day]. Preserve circulation and clear edges visually. Treat barriers, slip resistance, drainage, structure, setbacks, utilities, and safety compliance as unresolved.`
	},
	{
		id: "land-season",
		title: "Seasonal study",
		scope: "landscape",
		workflow: "study",
		summary: "Same design and camera. Only plausible seasonal change.",
		prompt: `Using the same landscape design and camera, create [spring/summer/autumn/winter or wet/dry season] studies. Preserve all geometry and species locations. Change only seasonally plausible foliage, bloom, ground condition, sky, and light. Use the images to discuss seasonal experience, not to guarantee exact bloom time or plant performance.`
	},
	{
		id: "land-evening",
		title: "Evening landscape light",
		scope: "landscape",
		workflow: "edit",
		summary: "Named fixtures only, blue ambient sky, readable paths.",
		prompt: `Preserve the landscape design, planting, hardscape, structures, and camera. Convert the scene to early evening with a remaining blue ambient sky. Show restrained path, step, feature-tree, seating, and facade lighting only where identified in the brief. Maintain readable circulation and avoid excessive glow, uplight, or invented fixtures.`
	},
	{
		id: "land-overview",
		title: "Elevated site overview",
		scope: "landscape",
		workflow: "concept",
		summary: "Building, access, terraces, and edges. Concept-level, not a survey.",
		prompt: `Create an elevated oblique landscape visualization showing the relationship among building, access, paths, terraces, planting masses, open space, and site edges. Use a clear hierarchy and restrained entourage. Keep known grades and major existing elements consistent with the reference, while labeling the output concept-level rather than survey-accurate.`
	}
];
var STUDIES = [
	{
		id: "t01",
		code: "T01",
		title: "Neighborhood public library",
		scope: "architecture",
		workflow: "text",
		image: "/viz/t01-public-library.jpg",
		observation: "Entrance, civic porch, street scale, and material hierarchy are immediately legible.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 4,
			lighting: 5,
			comparison: 4,
			artifacts: 5
		},
		prompt: `Create an early-stage concept visualization for a small neighborhood public library in a temperate urban context. The central design idea is a sheltered civic porch connecting the reading hall to a planted public forecourt. Show a two-story library with a legible entrance, warm light brick with realistic module scale, dark bronze frames, clear glazing, and a timber soffit. Use a low-rise mixed urban street, restrained pedestrian activity, an eye-level two-point perspective, parallel verticals, clear depth, and soft overcast afternoon light. Prioritize believable human scale, circulation, and material joints. No invented signage, logos, text, watermark, or dramatic spectacle.`
	},
	{
		id: "t02",
		code: "T02",
		title: "Sectional community arts center",
		scope: "architecture",
		workflow: "text",
		image: "/viz/t02-sectional-arts-center.jpg",
		observation: "Program and stair read clearly. Some cut and finished-surface boundaries stay conceptual.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 4,
			lighting: 4,
			comparison: 4,
			artifacts: 4
		},
		prompt: `Create an early-stage sectional perspective of a compact community arts center showing a double-height workshop, an upper gallery, a central stair, north daylight, and a planted courtyard. Use a clean oblique sectional perspective with realistic materials, legible pale-concrete cut surfaces, light timber acoustic lining, a matte dark-metal stair, parallel verticals, restrained scale figures, and soft north daylight through high glazing. Circulation and program relationships must read clearly. Keep the image conceptual rather than technical. No dimensions, labels, logos, text, or watermark.`
	},
	{
		id: "t03",
		code: "T03",
		title: "Compact living room",
		scope: "interior",
		workflow: "text",
		image: "/viz/t03-compact-living-room.jpg",
		observation: "Work, lounge, storage, and circulation read coherently without an enlarged room.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 4,
			lighting: 5,
			comparison: 5,
			artifacts: 5
		},
		prompt: `Visualize a compact 3.2 by 4.2 meter apartment living room for one resident who works from home. Prioritize a clear lounge zone, a small integrated desk, unobstructed circulation from the entry to the window, visually light furniture, and concealed storage. Use one large window wall and one doorway, an eye-level two-point perspective, parallel verticals, soft daylight balanced by subtle warm indirect light, matte light oak, warm-gray mineral plaster, wool upholstery, and a honed-limestone side table. Keep furniture scale and contact shadows plausible. Do not make the room appear larger through impossible geometry. No people, text, or watermark.`
	},
	{
		id: "t04",
		code: "T04",
		title: "Neighborhood cafe",
		scope: "interior",
		workflow: "text",
		image: "/viz/t04-neighborhood-cafe.jpg",
		observation: "Arrival-to-counter sightline and mixed seating read. Aisle widths are not verified.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 5,
			lighting: 4,
			comparison: 4,
			artifacts: 4
		},
		prompt: `Create an early-stage 40-seat neighborhood cafe interior for remote workers in the morning and small social groups in the evening. In a narrow ground-floor urban tenancy with street glazing, organize a clear arrival, ordering counter, mixed seating, accessible circulation, and an acoustic ceiling strategy. Use an eye-level entrance view with a legible sightline to the counter, soft morning daylight, warm low-glare task light, recycled brick, matte oak, acoustic felt, brushed stainless steel, durable terrazzo, and believable furniture and aisle scale. No brand signage, logos, decorative clutter, text, or watermark.`
	},
	{
		id: "t05",
		code: "T05",
		title: "Subtropical home",
		scope: "exterior",
		workflow: "text",
		image: "/viz/t05-subtropical-home.jpg",
		observation: "Deep shade, rainscreen character, covered transition, and wet context are visible.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 4,
			lighting: 5,
			comparison: 4,
			artifacts: 5
		},
		prompt: `Create an early facade character study for a two-story home in a hot-humid subtropical neighborhood. Show deep solar shading, a covered outdoor transition, durable rain-screen finishes, protected openings, and a close relationship to landscape. Use simple rectilinear massing, a legible entry, a natural street-facing eye-level view, parallel verticals, bright overcast light after rain, pale mineral render, ventilated dark timber-look rainscreen, bronze aluminum frames, and a concrete plinth. Keep construction character and proportions plausible. No logos, signage, text, watermark, dramatic cantilevers, or impossible structure.`
	},
	{
		id: "t06",
		code: "T06",
		title: "Small urban courtyard",
		scope: "landscape",
		workflow: "text",
		image: "/viz/t06-urban-courtyard.jpg",
		observation: "Drainage, one ground material, seating, and layered planting are present. The table slightly tightens circulation.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 5,
			lighting: 4,
			comparison: 4,
			artifacts: 5
		},
		prompt: `Create a compact 7 by 9 meter urban courtyard for four residents with visual privacy, mixed sun and shade, and low-to-medium maintenance. Preserve a plausible two-story brick enclosure, one glazed door, two windows, and visible accessible linear drainage. Show one seating zone, one primary ground material, layered perimeter planting, a small multi-stem tree, and restrained low lighting. Use an eye-level view from the glazed door, late-afternoon filtered light, permeable clay pavers, a weathered timber bench, gravel planting margins, and matte dark-metal edging. Keep circulation clear and planting away from openings. No people, oversized plants, text, or watermark.`
	},
	{
		id: "t07",
		code: "T07",
		title: "Cultural campus",
		scope: "landscape",
		workflow: "text",
		image: "/viz/t07-cultural-campus.jpg",
		observation: "Main zones and service access are legible. Routes are concept-level, not a survey.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 4,
			lighting: 5,
			comparison: 5,
			artifacts: 4
		},
		prompt: `Create an elevated oblique landscape visualization of a small cultural campus on a gently sloping temperate site at the edge of a town. Show the relationship among the main building, service access, pedestrian arrival, two terraces, planting masses, an open event lawn, and site edges. Use clear hierarchy, restrained entourage, soft morning light, pale concrete paths, a permeable gravel service route, native meadow, structured tree groves, and dark-metal roofs. Circulation must be continuous and building/landscape scale coherent. No labels, logos, text, watermark, or fantasy terrain.`
	},
	{
		id: "t08",
		code: "T08",
		title: "Material junction",
		scope: "architecture",
		workflow: "text",
		image: "/viz/t08-material-junction.jpg",
		observation: "Material scale and contact conditions convince at presentation level. Not construction resolution.",
		scores: {
			brief: 5,
			fidelity: null,
			spatial: 4,
			material: 4,
			lighting: 5,
			comparison: 4,
			artifacts: 4
		},
		prompt: `Create a close presentation-level architectural visualization of the junction between warm light brick, a dark-bronze window frame, a timber soffit, and a planted concrete base at a sheltered civic-building entrance. Use a close three-quarter view and soft grazing late-afternoon light. Show plausible brick module and mortar joints, low-sheen anodized aluminum, fine-grain timber, lightly weathered board-formed concrete, restrained grasses, thickness, joint rhythm, edge conditions, reflectivity, and weather exposure. Keep it concept-level rather than a technical detail. No impossible seams, labels, dimensions, logos, text, or watermark.`
	},
	{
		id: "t09",
		code: "T09",
		title: "Wall-finish-only edit",
		scope: "interior",
		workflow: "edit",
		image: "/viz/t09-living-room-clay-edit.jpg",
		sourceImage: "/viz/t03-compact-living-room.jpg",
		observation: "Geometry held. The first edit warmed non-wall surfaces. A targeted revision reduced, but did not eliminate, the cast.",
		scores: {
			brief: 4,
			fidelity: 4,
			spatial: 4,
			material: 4,
			lighting: 3,
			comparison: 4,
			artifacts: 5
		},
		metrics: "Edge F1 stayed near 0.94. Luminance SSIM moved from 0.742 to 0.783 after revision. Global channel-mean drift fell from 3.39 to 2.00.",
		prompt: `Change only the painted/mineral wall finish in the compact apartment living room to a deeper clay-toned lime plaster with subtle hand-applied variation. Preserve the exact camera, crop, room envelope, ceiling, doorway, window and exterior view, floor, built-in cabinetry, desk, television, furniture layout, rug, plants, artwork, curtains, lighting fixtures, exposure, daylight direction, and all object positions. Do not add, remove, resize, or move anything. Keep the same material boundaries. The result must remain immediately recognizable as the same room and support a fair before/after wall-finish comparison. Avoid camera drift, a wider room, changed furniture or lighting, new objects, text, or watermark.`,
		revision: {
			image: "/viz/t09-r1-living-room-clay-edit.jpg",
			note: "R1 asked for the original white balance back. Drift dropped. It did not disappear. Mask the walls when the comparison has to be fair.",
			prompt: `Starting from the original source, change only the exposed plaster walls to the clay-toned lime plaster seen in the first edit. Remove the first edit's global warm color cast. Match the source exactly for white balance, exposure, daylight, shadows, floor color, oak cabinetry, sofa and textiles, rug, stone table, plants, artwork, curtains, exterior view, and every non-wall surface. Preserve source pixels as closely as possible outside the plaster-wall masks. Do not add, remove, resize, restyle, recolor, or move anything except the plaster wall finish. Success is a fair A/B comparison in which the wall material is the only meaningful change.`
		}
	},
	{
		id: "t10",
		code: "T10",
		title: "Day-to-dusk exterior edit",
		scope: "exterior",
		workflow: "edit",
		image: "/viz/t10-home-dusk-edit.jpg",
		sourceImage: "/viz/t05-subtropical-home.jpg",
		observation: "Camera, massing, openings, and planting stayed recognizable while illumination changed.",
		scores: {
			brief: 5,
			fidelity: 5,
			spatial: 5,
			material: 4,
			lighting: 5,
			comparison: 5,
			artifacts: 5
		},
		metrics: "Luminance SSIM was 0.475 because the light change is intentional. Structural edges held at 0.879 F1.",
		prompt: `Convert only the time of day and illumination to early blue-hour dusk. Retain a visible cool-blue ambient sky; add balanced warm interior illumination and restrained existing soffit and landscape lighting with plausible reflections in wet paving and glazing. Preserve the exact camera, crop, footprint, two-story massing, roof, eaves, columns, opening pattern, doors, window frames, shutters, facade materials and boundaries, steps, driveway, grade, neighboring buildings, mature trees, and planting positions. Do not add fixtures or architectural elements. Avoid geometry drift, material changes, added windows, a dramatic night scene, excessive glow, text, logo, or watermark.`
	}
];
var RUN_NOTE = "September 8, 2026. Built-in OpenAI image tool in Codex. Model identifier, seed, and reference strength were not exposed. Every first output is kept — nothing was cherry-picked. These frames are evidence for that runtime, not a ranking of providers and not client work.";
var TEMPLATES = [
	...ARCH_TEMPLATES,
	...INTERIOR_TEMPLATES,
	...EXTERIOR_TEMPLATES,
	...LANDSCAPE_TEMPLATES
];
var DISCIPLINES = [
	{
		id: "architecture",
		label: "Architecture",
		blurb: "Massing, sections, daylight, and street scale.",
		image: "/viz/t01-public-library.jpg"
	},
	{
		id: "interior",
		label: "Interior",
		blurb: "Rooms, materials, hospitality, and work.",
		image: "/viz/t04-neighborhood-cafe.jpg"
	},
	{
		id: "exterior",
		label: "Home exterior",
		blurb: "Facades, dusk, entries, and additions.",
		image: "/viz/t05-subtropical-home.jpg"
	},
	{
		id: "landscape",
		label: "Landscape",
		blurb: "Courtyards, planting, arrival, and sites.",
		image: "/viz/t07-cultural-campus.jpg"
	}
];
var WORKFLOW_LABEL = {
	concept: "Concept",
	edit: "Edit",
	compare: "Compare",
	study: "Study",
	framework: "Framework"
};
var SCOPE_LABEL = {
	any: "All disciplines",
	architecture: "Architecture",
	interior: "Interior",
	exterior: "Home exterior",
	landscape: "Landscape"
};
var CHECKLIST = [
	{
		title: "Source fidelity",
		items: [
			"Camera, crop, and perspective still match the source.",
			"Envelope, massing, roof, openings, and grade were not quietly redrawn.",
			"Invented, removed, or moved elements are marked before anyone decides from the image."
		]
	},
	{
		title: "Spatial read",
		items: [
			"The focal point and the arrival or circulation path are legible.",
			"Furniture, people, and planting look plausibly scaled.",
			"Verticals and horizon behave like the view you asked for."
		]
	},
	{
		title: "Material and light",
		items: [
			"Finish, joint scale, reflectivity, and weathering belong to the named materials.",
			"Daylight has one direction. Shadows agree with it.",
			"If this is a comparison, only the intended variable changed."
		]
	},
	{
		title: "What the image cannot approve",
		items: [
			"Dimensions, clearances, products, and plant suitability.",
			"Structure, envelope, waterproofing, drainage, fire safety, and access.",
			"Cost, code, planning, or a decision to build."
		]
	}
];
var ADVANCED_GROUPS = [
	{
		key: "light",
		label: "Light",
		options: [
			{
				id: "overcast",
				label: "Overcast"
			},
			{
				id: "golden-hour",
				label: "Golden hour"
			},
			{
				id: "blue-hour",
				label: "Blue hour"
			},
			{
				id: "early-morning",
				label: "Early morning"
			},
			{
				id: "bright-midday",
				label: "Midday"
			},
			{
				id: "late-afternoon",
				label: "Late afternoon"
			},
			{
				id: "twilight",
				label: "Twilight"
			},
			{
				id: "night",
				label: "Night"
			}
		]
	},
	{
		key: "air",
		label: "Air",
		options: [
			{
				id: "clear-air",
				label: "Clear"
			},
			{
				id: "light-haze",
				label: "Haze"
			},
			{
				id: "light-mist",
				label: "Mist"
			},
			{
				id: "after-rain",
				label: "After rain"
			},
			{
				id: "wet",
				label: "Wet ground"
			},
			{
				id: "dramatic-clouds",
				label: "Clouds"
			}
		]
	},
	{
		key: "season",
		label: "Season",
		options: [
			{
				id: "none",
				label: "Unspecified"
			},
			{
				id: "spring",
				label: "Spring"
			},
			{
				id: "summer",
				label: "Summer"
			},
			{
				id: "autumn",
				label: "Autumn"
			},
			{
				id: "winter",
				label: "Winter"
			}
		]
	},
	{
		key: "change",
		label: "Allowed change",
		options: [
			{
				id: "none",
				label: "Finish only"
			},
			{
				id: "facade",
				label: "Facade"
			},
			{
				id: "brick",
				label: "Brick"
			},
			{
				id: "limestone",
				label: "Limestone"
			},
			{
				id: "road",
				label: "Approach"
			},
			{
				id: "greenery",
				label: "Greenery"
			},
			{
				id: "people",
				label: "People"
			}
		]
	},
	{
		key: "grade",
		label: "Grade",
		options: [
			{
				id: "photo",
				label: "Commercial"
			},
			{
				id: "premium-real-estate",
				label: "Real estate"
			},
			{
				id: "editorial-architecture",
				label: "Editorial"
			},
			{
				id: "photo-editorial-modernist",
				label: "Modernist"
			},
			{
				id: "photo-sculptural-shadows",
				label: "Sculptural"
			},
			{
				id: "photo-documentary-context",
				label: "Documentary"
			},
			{
				id: "photo-warm-human-scale",
				label: "Human scale"
			},
			{
				id: "hero-photo-clean",
				label: "Hero clean"
			},
			{
				id: "hero-photo-dramatic",
				label: "Hero dramatic"
			},
			{
				id: "hero-sunset-gold",
				label: "Sunset gold"
			},
			{
				id: "hdri-realism",
				label: "HDRI"
			},
			{
				id: "cinema-malick",
				label: "Natural epic"
			},
			{
				id: "cinema-villeneuve",
				label: "Monumental"
			},
			{
				id: "cinema-anderson",
				label: "Graphic pastel"
			},
			{
				id: "cinema-nolan",
				label: "Epic daylight"
			},
			{
				id: "cinema-fincher",
				label: "Precision shadow"
			},
			{
				id: "cinema-scott",
				label: "Layered night"
			}
		]
	}
];
var EXTRA_PILLS = [
	{
		id: "microdetail",
		label: "Microdetail"
	},
	{
		id: "roughness-variation",
		label: "Roughness"
	},
	{
		id: "glass-realism",
		label: "Glass"
	},
	{
		id: "stone-detail",
		label: "Stone"
	},
	{
		id: "concrete-detail",
		label: "Concrete"
	},
	{
		id: "subtle-weathering",
		label: "Weathering"
	},
	{
		id: "edge-wear",
		label: "Edge wear"
	},
	{
		id: "photorealism-recovery",
		label: "De-CGI"
	},
	{
		id: "upscale-safety",
		label: "Upscale lock"
	},
	{
		id: "heritage-protection",
		label: "Heritage"
	},
	{
		id: "developer-story",
		label: "Developer"
	},
	{
		id: "multiview-consistency",
		label: "Multi-view"
	},
	{
		id: "final-cleanup",
		label: "Cleanup"
	},
	{
		id: "natural-greenery-detail",
		label: "Planting"
	},
	{
		id: "match-source-lighting",
		label: "Match source"
	}
];
var DEFAULT_ADVANCED = {
	light: "golden-hour",
	air: "clear-air",
	season: "none",
	change: "none",
	grade: "premium-real-estate",
	extras: ["final-cleanup"]
};
function sanitizeAdvanced(input) {
	const next = {
		...DEFAULT_ADVANCED,
		extras: []
	};
	for (const group of ADVANCED_GROUPS) {
		const value = input?.[group.key];
		next[group.key] = group.options.some((option) => option.id === value) ? value : DEFAULT_ADVANCED[group.key];
	}
	const allowed = new Set(EXTRA_PILLS.map((item) => item.id));
	next.extras = Array.isArray(input?.extras) ? input.extras.filter((id) => typeof id === "string" && allowed.has(id)).slice(0, 12) : [...DEFAULT_ADVANCED.extras];
	if (next.light === "night") next.extras = next.extras.filter((id) => id !== "match-source-lighting");
	return next;
}
var VERTICALS = [
	{
		id: "interior",
		label: "Interior"
	},
	{
		id: "exterior",
		label: "Exterior"
	},
	{
		id: "amenities",
		label: "Amenities"
	},
	{
		id: "landscape",
		label: "Landscape"
	}
];
var RANGES = [
	"Basic",
	"Standard",
	"Premium",
	"Luxury",
	"Ultra Luxury"
];
var CAMERAS = [
	"Eye level",
	"Elevated",
	"Close detail",
	"Wide"
];
var LIGHTS = [
	"Soft overcast",
	"Daylight",
	"Golden hour",
	"Evening",
	"Night"
];
var MOODS = [
	"Quiet",
	"Warm",
	"Dramatic",
	"Serene",
	"Vibrant"
];
var PEOPLE = [
	"None",
	"Few",
	"Medium",
	"Crowd"
];
var ACTIVITIES = [
	"Sitting",
	"Walking",
	"Dining",
	"Working",
	"Swimming"
];
var COLORS = [
	"Warm white",
	"Sand",
	"Oak",
	"Charcoal",
	"Sage",
	"Ink blue"
];
var WEATHER = [
	"Clear",
	"Cloudy",
	"Mist"
];
var TIMES = [
	"Morning",
	"Day",
	"Golden hour",
	"Evening",
	"Night"
];
var DETAILS = ["Standard", "High detail"];
var STRENGTHS = [
	"Soft",
	"Balanced",
	"Strong"
];
var TAGS = [
	"Luxury",
	"Residential",
	"Villa",
	"Glass",
	"Biophilic",
	"Quiet"
];
var LOOKS = {
	interior: [
		{
			name: "Modern luxury",
			image: "/viz/t03-compact-living-room.jpg"
		},
		{
			name: "Quiet mineral",
			image: "/viz/t09-living-room-clay-edit.jpg"
		},
		{
			name: "Warm hospitality",
			image: "/viz/t04-neighborhood-cafe.jpg"
		},
		{
			name: "Material study",
			image: "/viz/t08-material-junction.jpg"
		}
	],
	exterior: [
		{
			name: "Modern",
			image: "/viz/t05-subtropical-home.jpg"
		},
		{
			name: "Dusk villa",
			image: "/viz/t10-home-dusk-edit.jpg"
		},
		{
			name: "Civic",
			image: "/viz/t07-cultural-campus.jpg"
		},
		{
			name: "Massing",
			image: "/viz/t02-sectional-arts-center.jpg"
		}
	],
	amenities: [
		{
			name: "Clubhouse",
			image: "/viz/t04-neighborhood-cafe.jpg"
		},
		{
			name: "Pool terrace",
			image: "/viz/t06-urban-courtyard.jpg"
		},
		{
			name: "Evening",
			image: "/viz/t10-home-dusk-edit.jpg"
		},
		{
			name: "Resort",
			image: "/viz/t05-subtropical-home.jpg"
		}
	],
	landscape: [
		{
			name: "Courtyard",
			image: "/viz/t06-urban-courtyard.jpg"
		},
		{
			name: "Tropical",
			image: "/viz/t05-subtropical-home.jpg"
		},
		{
			name: "Campus green",
			image: "/viz/t07-cultural-campus.jpg"
		},
		{
			name: "Dusk garden",
			image: "/viz/t10-home-dusk-edit.jpg"
		}
	]
};
var GROUPS = {
	interior: [
		{
			id: "room",
			label: "Room",
			options: [
				"Living room",
				"Bedroom",
				"Kitchen",
				"Bath",
				"Dining",
				"Office"
			]
		},
		{
			id: "floor",
			label: "Flooring",
			options: [
				"Italian marble",
				"Travertine",
				"Hardwood",
				"Terrazzo",
				"Microcement"
			]
		},
		{
			id: "rug",
			label: "Rug",
			options: [
				"None",
				"Wool",
				"Jute",
				"Silk"
			]
		},
		{
			id: "wall",
			label: "Walls",
			options: [
				"Limewash",
				"Fluted oak",
				"Stone",
				"Matte paint"
			]
		},
		{
			id: "ceiling",
			label: "Ceiling",
			options: [
				"Cove light",
				"Coffered",
				"Gypsum",
				"Timber"
			]
		},
		{
			id: "furniture",
			label: "Furniture",
			options: [
				"Sectional",
				"Lounge chairs",
				"Dining set",
				"Minimal"
			]
		},
		{
			id: "fixture",
			label: "Fixtures",
			options: [
				"Chandelier",
				"Pendants",
				"Cove",
				"Sconces"
			]
		},
		{
			id: "kitchen",
			label: "Kitchen",
			options: [
				"Unchanged",
				"Stone island",
				"Timber cabinets",
				"Minimal"
			]
		},
		{
			id: "bath",
			label: "Bath",
			options: [
				"Unchanged",
				"Stone",
				"Warm tile",
				"Freestanding tub"
			]
		},
		{
			id: "openings",
			label: "Openings",
			options: [
				"Keep",
				"Bronze frames",
				"Slim black",
				"Sheer curtains"
			]
		},
		{
			id: "decor",
			label: "Decor",
			options: [
				"Sparse",
				"Art",
				"Plants",
				"Layered"
			]
		}
	],
	exterior: [
		{
			id: "facade",
			label: "Facade",
			options: [
				"Stone",
				"Timber",
				"Glass",
				"Metal",
				"Concrete",
				"Brick"
			]
		},
		{
			id: "roof",
			label: "Roof",
			options: [
				"Flat",
				"Pitched",
				"Green roof"
			]
		},
		{
			id: "windows",
			label: "Windows",
			options: [
				"Floor-to-ceiling",
				"Bronze frames",
				"Dark metal"
			]
		},
		{
			id: "entry",
			label: "Entrance",
			options: [
				"Portico",
				"Pivot door",
				"Canopy"
			]
		},
		{
			id: "balcony",
			label: "Balcony",
			options: [
				"Keep",
				"Glass rail",
				"Metal rail"
			]
		},
		{
			id: "terrace",
			label: "Terrace",
			options: [
				"None",
				"Pergola",
				"Planters"
			]
		},
		{
			id: "drive",
			label: "Driveway",
			options: [
				"Clay pavers",
				"Stone",
				"Gravel"
			]
		},
		{
			id: "parking",
			label: "Parking",
			options: [
				"Open",
				"Carport",
				"Garage"
			]
		},
		{
			id: "water",
			label: "Water",
			options: [
				"None",
				"Pool",
				"Fountain"
			]
		}
	],
	amenities: [
		{
			id: "water",
			label: "Water",
			options: [
				"Infinity pool",
				"Lap pool",
				"Spa",
				"Fountain"
			]
		},
		{
			id: "wellness",
			label: "Wellness",
			options: [
				"Gym",
				"Spa",
				"Yoga deck"
			]
		},
		{
			id: "social",
			label: "Social",
			options: [
				"Lounge",
				"Restaurant",
				"Clubhouse"
			]
		},
		{
			id: "sport",
			label: "Sport",
			options: [
				"None",
				"Tennis",
				"Court"
			]
		},
		{
			id: "outdoor",
			label: "Outdoor",
			options: [
				"Fire pit",
				"Outdoor kitchen",
				"Pergola"
			]
		},
		{
			id: "family",
			label: "Family",
			options: [
				"Playground",
				"Lawn",
				"None"
			]
		},
		{
			id: "work",
			label: "Work",
			options: [
				"None",
				"Coworking",
				"Meeting room"
			]
		},
		{
			id: "security",
			label: "Arrival",
			options: [
				"Open",
				"Gate",
				"Lobby"
			]
		}
	],
	landscape: [
		{
			id: "trees",
			label: "Trees",
			options: [
				"Palms",
				"Shade trees",
				"Ornamental",
				"Few"
			]
		},
		{
			id: "planting",
			label: "Planting",
			options: [
				"Shrubs",
				"Flowering",
				"Hedge",
				"Sparse"
			]
		},
		{
			id: "lawn",
			label: "Lawn",
			options: [
				"Meadow",
				"Clipped lawn",
				"Gravel garden"
			]
		},
		{
			id: "garden",
			label: "Garden",
			options: [
				"Tropical",
				"Formal",
				"Courtyard"
			]
		},
		{
			id: "path",
			label: "Paths",
			options: [
				"Stone",
				"Clay pavers",
				"Timber"
			]
		},
		{
			id: "water",
			label: "Water",
			options: [
				"Pool edge",
				"Fountain",
				"None"
			]
		},
		{
			id: "structure",
			label: "Structure",
			options: [
				"None",
				"Pergola",
				"Pavilion"
			]
		},
		{
			id: "edge",
			label: "Boundary",
			options: [
				"Hedge",
				"Low wall",
				"Open"
			]
		},
		{
			id: "light",
			label: "Garden light",
			options: [
				"Path lights",
				"Uplights",
				"None"
			]
		}
	]
};
var DEFAULT_DESIGN = {
	vertical: "interior",
	range: "Ultra Luxury",
	look: "Modern luxury",
	camera: "Eye level",
	light: "Golden hour",
	mood: "Warm",
	people: "Few",
	activity: "Sitting",
	color: "Warm white",
	weather: "Clear",
	time: "Golden hour",
	detail: "High detail",
	strength: "Balanced",
	tags: ["Luxury"],
	target: "whole",
	panel: "design",
	picks: Object.fromEntries(GROUPS.interior.map((group) => [group.id, group.options[0]])),
	rooms: {},
	advanced: DEFAULT_ADVANCED
};
function oneOf(value, options, fallback) {
	return typeof value === "string" && options.includes(value) ? value : fallback;
}
function cleanRooms(input) {
	if (!input || typeof input !== "object") return {};
	const rooms = {};
	for (const [room, picks] of Object.entries(input).slice(0, 12)) {
		if (!picks || typeof picks !== "object") continue;
		const row = {};
		for (const group of GROUPS.interior) {
			const value = picks[group.id];
			if (typeof value === "string" && group.options.includes(value)) row[group.id] = value;
		}
		if (Object.keys(row).length) rooms[room.slice(0, 40)] = row;
	}
	return rooms;
}
function sanitizeDesign(input) {
	const vertical = oneOf(input?.vertical, VERTICALS.map((item) => item.id), DEFAULT_DESIGN.vertical);
	const looks = LOOKS[vertical].map((item) => item.name);
	const picks = {};
	for (const group of GROUPS[vertical]) picks[group.id] = oneOf(input?.picks?.[group.id], group.options, group.options[0]);
	const rawTarget = input?.target;
	const target = typeof rawTarget === "string" && (rawTarget === "whole" || GROUPS[vertical].some((group) => group.id === rawTarget)) ? rawTarget : "whole";
	const tags = Array.isArray(input?.tags) ? input.tags.filter((tag) => typeof tag === "string" && TAGS.includes(tag)).slice(0, 6) : DEFAULT_DESIGN.tags;
	return {
		vertical,
		range: oneOf(input?.range, RANGES, DEFAULT_DESIGN.range),
		look: oneOf(input?.look, looks, looks[0]),
		camera: oneOf(input?.camera, CAMERAS, DEFAULT_DESIGN.camera),
		light: oneOf(input?.light, LIGHTS, DEFAULT_DESIGN.light),
		mood: oneOf(input?.mood, MOODS, DEFAULT_DESIGN.mood),
		people: oneOf(input?.people, PEOPLE, DEFAULT_DESIGN.people),
		activity: oneOf(input?.activity, ACTIVITIES, DEFAULT_DESIGN.activity),
		color: oneOf(input?.color, COLORS, DEFAULT_DESIGN.color),
		weather: oneOf(input?.weather, WEATHER, DEFAULT_DESIGN.weather),
		time: oneOf(input?.time, TIMES, DEFAULT_DESIGN.time),
		detail: oneOf(input?.detail, DETAILS, DEFAULT_DESIGN.detail),
		strength: oneOf(input?.strength, STRENGTHS, DEFAULT_DESIGN.strength),
		tags,
		target,
		panel: oneOf(input?.panel, [
			"design",
			"camera",
			"light",
			"human",
			"mood",
			"engine",
			"advanced"
		], "design"),
		picks,
		rooms: cleanRooms(input?.rooms),
		advanced: sanitizeAdvanced(input?.advanced)
	};
}
function assembleBrief(design, idea, library, options) {
	const clean = sanitizeDesign(design);
	const hasUpload = Boolean(options?.hasUploadedImage);
	const trimmedIdea = idea.trim();
	if (hasUpload) {
		const lines = [
			"GOAL",
			`In-place photorealistic edit on the attached uploaded source photograph. Finish quality: ${clean.range}. Refinement strength: ${clean.strength}. ${clean.detail}.`,
			"",
			"MUST PRESERVE (PIXEL-LOCKED)",
			"Preserve the EXACT camera position, camera elevation/altitude, lens focal length, field of view, vanishing points, horizon line, crop boundaries, building silhouette, roof parapet, walls, openings, and site terrain pixel-for-pixel from the attached uploaded source image.",
			"",
			"CAMERA",
			"LOCKED 1:1 TO ATTACHED UPLOADED IMAGE — do NOT change to eye-level, do NOT zoom, pan, tilt, rotate, crop, or straighten verticals.",
			"",
			"LIGHT / ATMOSPHERE",
			`${clean.light} light. Mood: ${clean.mood}. Natural shadows consistent with the existing geometry.`,
			"",
			"RESTRICTIONS",
			"Do NOT create a new building, room, or camera angle. Do NOT letterbox or change aspect ratio. Modify ONLY the surface materials, lighting, atmosphere, or local details explicitly named below."
		];
		if (trimmedIdea) lines.push("", "EDIT DIRECTIVE ON UPLOADED IMAGE", `${trimmedIdea} Apply ONLY these changes onto the attached uploaded image while keeping every pixel of camera perspective and unmentioned structure identical.`);
		return lines.join("\n").slice(0, 4e3);
	}
	const groups = GROUPS[clean.vertical];
	const changes = (clean.target === "whole" ? groups : groups.filter((group) => group.id === clean.target)).map((group) => `${group.label}: ${clean.picks[group.id]}`).join(". ");
	const held = clean.target === "whole" ? "every surface this brief does not name" : `every element except ${clean.target}`;
	const lines = [
		"GOAL",
		`Photorealistic ${clean.vertical} visualization. Quality: ${clean.range}. Look: ${clean.look}. Finish strength: ${clean.strength}. ${clean.detail}.`,
		"",
		"MUST PRESERVE",
		`Keep the supplied camera, structure, openings, and ${held}.`,
		"",
		"ALLOWED CHANGES",
		changes || "No material change.",
		"",
		"MATERIAL / SUBJECT",
		`${clean.look} ${clean.vertical}. Accent color: ${clean.color}. ${changes}`,
		"",
		"LIGHT / ATMOSPHERE",
		`${clean.light} light. Time: ${clean.time}. Weather: ${clean.weather}. Mood: ${clean.mood}. One light direction and believable contact shadows.`,
		"",
		"CAMERA",
		`${clean.camera}. Natural perspective. No dramatic wide-angle distortion.`,
		"",
		"HUMAN",
		clean.people === "None" ? "No people." : `${clean.people} people, ${clean.activity.toLowerCase()}, correctly scaled, with shadows on the ground.`,
		"",
		"TAGS",
		clean.tags.length ? clean.tags.join(", ") : "None",
		"",
		"RESTRICTIONS",
		"Do not invent dimensions, brands, code compliance, or structural moves. Do not relocate unnamed openings. This is not a measured drawing."
	];
	if (trimmedIdea) lines.push("", "IDEA", `${trimmedIdea} Change only what this idea names.`);
	if (library) lines.push("", "LIBRARY BRIEF", library);
	return lines.join("\n").slice(0, 4e3);
}
var RATIOS = [
	"16:9",
	"4:3",
	"3:2",
	"1:1",
	"9:16"
];
var RESOLUTIONS = ["1k", "2k"];
var DEFAULT_FRAME = {
	ratio: "16:9",
	resolution: "1k"
};
function sanitizeFrame(input) {
	return {
		ratio: RATIOS.includes(input?.ratio) ? input?.ratio : DEFAULT_FRAME.ratio,
		resolution: RESOLUTIONS.includes(input?.resolution) ? input?.resolution : DEFAULT_FRAME.resolution
	};
}
function frameAspect(ratio) {
	return ratio.replace(":", " / ");
}
function frameAspectNumber(ratio) {
	const [w, h] = ratio.split(":").map(Number);
	return w > 0 && h > 0 ? w / h : 16 / 9;
}
function frameEdge(resolution) {
	return resolution === "2k" ? 2048 : 1280;
}
var WORKFLOW_PRESETS = [
	{
		id: "photoreal",
		label: "Photoreal Plate",
		badge: "Veras",
		description: "Strict structural massing lock with physically accurate materiality and natural lighting.",
		defaults: {
			geometryLock: 85,
			materialOverride: 55,
			edgeAdherence: 75,
			renderFidelity: "photoreal",
			mjStylize: 180,
			mjChaos: 10
		}
	},
	{
		id: "sketch-to-render",
		label: "Sketch → Render",
		badge: "PromeAI",
		description: "Converts architectural line sketches or 3D overlays into detailed perspective visualizations.",
		defaults: {
			geometryLock: 72,
			edgeAdherence: 88,
			sketchMode: "faithful",
			styleTransferWeight: 65,
			renderFidelity: "photoreal"
		}
	},
	{
		id: "interior-restyle",
		label: "Interior Restyle",
		badge: "mnml.ai",
		description: "Reimagines furnishings, flooring, and wall finishes while holding walls, doors, and windows steady.",
		defaults: {
			geometryLock: 90,
			materialOverride: 75,
			edgeAdherence: 82,
			renderFidelity: "editorial",
			mjStylize: 220
		}
	},
	{
		id: "plan-to-3d",
		label: "2D Plan → 3D",
		badge: "Rendair",
		description: "Extrudes orthographic floor plans into furnished axonometric or eye-level spatial concepts.",
		defaults: {
			geometryLock: 78,
			edgeAdherence: 92,
			styleTransferWeight: 55,
			renderFidelity: "standard",
			mjChaos: 15
		}
	},
	{
		id: "elevation-to-render",
		label: "Elevation → Render",
		badge: "LookX",
		description: "Transforms flat orthographic facade elevations into sunlit architectural photography.",
		defaults: {
			geometryLock: 92,
			edgeAdherence: 94,
			styleTransferWeight: 70,
			detailDensity: "intricate",
			renderFidelity: "editorial"
		}
	},
	{
		id: "clay-to-render",
		label: "Clay → Photoreal",
		badge: "D5",
		description: "Takes untextured white/gray 3D massing snapshots and applies full PBR materiality and context.",
		defaults: {
			geometryLock: 95,
			materialOverride: 88,
			edgeAdherence: 85,
			renderFidelity: "photoreal",
			mjStylize: 140
		}
	}
];
var FACADE_TYPOLOGIES = [
	"Minimalist Glass",
	"Board-Marked Concrete",
	"Biophilic Timber Louver",
	"Nordic Brick & Zinc",
	"Parametric Kinetic Facade",
	"Classical Limestone"
];
var CLIMATE_REGIONS = [
	"Temperate Coastal",
	"Subtropical Humid",
	"Alpine Cold",
	"Arid Desert",
	"Urban Dense"
];
var RENDER_FIDELITIES = [
	{
		id: "draft",
		label: "Draft"
	},
	{
		id: "standard",
		label: "Standard"
	},
	{
		id: "photoreal",
		label: "Photoreal"
	},
	{
		id: "editorial",
		label: "Editorial"
	}
];
var DETAIL_DENSITIES = [
	{
		id: "minimal",
		label: "Minimal"
	},
	{
		id: "balanced",
		label: "Balanced"
	},
	{
		id: "intricate",
		label: "Intricate"
	}
];
var SKETCH_MODES = [
	{
		id: "faithful",
		label: "Faithful"
	},
	{
		id: "balanced",
		label: "Balanced"
	},
	{
		id: "creative",
		label: "Creative"
	}
];
var ENHANCE_MODES = [
	{
		id: "standard",
		label: "Clean"
	},
	{
		id: "upscale-2x",
		label: "2× Upscale"
	},
	{
		id: "micro-detail",
		label: "Micro-Detail"
	}
];
var SCENE3D_PRESETS = [
	{
		id: "pavilion",
		label: "Water Pavilion",
		subtitle: "Concrete & reflecting basin"
	},
	{
		id: "villa",
		label: "Cantilever Villa",
		subtitle: "Stepped terrace & louvers"
	},
	{
		id: "loft",
		label: "Courtyard Loft",
		subtitle: "Adaptive steel & brick bay"
	},
	{
		id: "civic",
		label: "Timber Hall",
		subtitle: "Glulam civic colonnade"
	}
];
var SCENE3D_MATERIALS = [
	{
		id: "concrete",
		label: "Fair Concrete",
		swatch: "#b6b4ae"
	},
	{
		id: "timber",
		label: "Warm Cedar",
		swatch: "#b68557"
	},
	{
		id: "travertine",
		label: "Honed Travertine",
		swatch: "#ded2bd"
	},
	{
		id: "brick",
		label: "Nordic Brick",
		swatch: "#9f5b47"
	}
];
var CAMERA_PRESETS_3D = [
	{
		id: "eye",
		label: "Eye 1.6m"
	},
	{
		id: "oblique",
		label: "3/4 Hero"
	},
	{
		id: "aerial",
		label: "Aerial"
	},
	{
		id: "detail",
		label: "Junction"
	}
];
var FOCAL_LENGTHS = [
	24,
	35,
	50,
	85
];
var ANNOTATOR_MODES = [
	{
		id: "none",
		label: "Off",
		hint: "Direct RGB input"
	},
	{
		id: "canny",
		label: "Canny Edge",
		hint: "Crisp architectural contours"
	},
	{
		id: "mlsd",
		label: "MLSD Lines",
		hint: "Straight structural orthogonals"
	},
	{
		id: "lineart",
		label: "LineArt",
		hint: "Ink pen architectural drawing"
	},
	{
		id: "softedge",
		label: "HED SoftEdge",
		hint: "Smooth shadow & silhouette guides"
	},
	{
		id: "normal",
		label: "Normal Map",
		hint: "Surface orientation XYZ vectors"
	}
];
var ESRGAN_MODELS = [
	{
		id: "RealESRGAN_x2plus",
		label: "x2plus (Crisp)"
	},
	{
		id: "RealESRGAN_x4plus",
		label: "x4plus (Ultra)"
	},
	{
		id: "4x-ArchSharp",
		label: "ArchSharp (Lines)"
	}
];
var IPADAPTER_PRESETS = [
	{
		id: "standard",
		label: "Standard Style"
	},
	{
		id: "plus",
		label: "IP-Adapter Plus"
	},
	{
		id: "style-composition",
		label: "Style + Layout"
	},
	{
		id: "fixture-lock",
		label: "Material / Fixture"
	}
];
var D5_LIGHT_PRESETS = [
	{
		id: "noon",
		label: "Noon Sun",
		sunAzimuth: 148,
		sunElevation: 56,
		fogDensity: 12,
		exposure: 1.05
	},
	{
		id: "golden",
		label: "Golden Hour",
		sunAzimuth: 242,
		sunElevation: 16,
		fogDensity: 24,
		exposure: 1.15
	},
	{
		id: "blue-hour",
		label: "Blue Hour",
		sunAzimuth: 278,
		sunElevation: 6,
		fogDensity: 34,
		exposure: 1.24
	},
	{
		id: "overcast",
		label: "Overcast Studio",
		sunAzimuth: 120,
		sunElevation: 42,
		fogDensity: 46,
		exposure: .98
	}
];
var HDRI_MOODS = [
	{
		id: "studio",
		label: "Studio Neutral"
	},
	{
		id: "clear-sky",
		label: "Clear Zenith"
	},
	{
		id: "golden-dusk",
		label: "Golden Horizon"
	},
	{
		id: "overcast-nordic",
		label: "Nordic Overcast"
	}
];
var RELIGHT_PRESETS = [
	{
		id: "none",
		label: "Original Light"
	},
	{
		id: "overcast-to-golden",
		label: "Overcast → Golden"
	},
	{
		id: "summer-to-snow",
		label: "Summer → Snow"
	},
	{
		id: "day-to-dusk",
		label: "Day → Dusk Glow"
	}
];
var OUTPAINT_RATIOS = [
	{
		id: "none",
		label: "Frame Lock"
	},
	{
		id: "21:9",
		label: "21:9 Cinema Uncrop"
	},
	{
		id: "9:16",
		label: "9:16 Vertical Uncrop"
	},
	{
		id: "16:9",
		label: "16:9 Wide Expand"
	}
];
var IOPAINT_TASKS = [
	{
		id: "erase",
		label: "Erase",
		badge: "LaMa",
		defaultModel: "lama",
		hint: "Remove people, wires, vehicles & clutter"
	},
	{
		id: "replace",
		label: "Replace",
		badge: "PowerPaint",
		defaultModel: "powerpaint-v2",
		hint: "Text-guided generative inpaint inside mask"
	},
	{
		id: "outpaint",
		label: "Outpaint Pad",
		badge: "Expand",
		defaultModel: "powerpaint-v2",
		hint: "Directional +Top/Right/Bottom/Left canvas extend"
	},
	{
		id: "anytext",
		label: "AnyText",
		badge: "Signage",
		defaultModel: "anytext",
		hint: "Legible architectural typography & fascia text"
	},
	{
		id: "paint-by-example",
		label: "By Example",
		badge: "Ref",
		defaultModel: "paint-by-example",
		hint: "Insert reference object image into mask"
	}
];
var IOPAINT_MODELS = [
	{
		id: "lama",
		label: "LaMa (Fourier)",
		group: "erase",
		hint: "Fast clean object & wire removal"
	},
	{
		id: "mat",
		label: "MAT (Large Mask)",
		group: "erase",
		hint: "Transformer fill for large structural gaps"
	},
	{
		id: "migan",
		label: "MI-GAN (HD)",
		group: "erase",
		hint: "High-res sharp texture inpainting"
	},
	{
		id: "zits",
		label: "ZITS (Structures)",
		group: "erase",
		hint: "Edge-guided line & masonry reconstruction"
	},
	{
		id: "ldm",
		label: "LDM Erase",
		group: "erase",
		hint: "Latent diffusion clean removal"
	},
	{
		id: "fcf",
		label: "FcF Fast",
		group: "erase",
		hint: "Coarse-to-fine rapid object cleanup"
	},
	{
		id: "manga",
		label: "Manga Line",
		group: "erase",
		hint: "Screentone & linework drawing cleanup"
	},
	{
		id: "powerpaint-v2",
		label: "PowerPaint V2",
		group: "diffusion",
		hint: "Shape-aware replace & seamless outpaint"
	},
	{
		id: "brushnet",
		label: "BrushNet",
		group: "diffusion",
		hint: "Branch-locked realistic architectural refill"
	},
	{
		id: "sdxl-inpaint",
		label: "SDXL Inpaint 1.0",
		group: "diffusion",
		hint: "High-detail editorial replacement"
	},
	{
		id: "sd15-inpaint",
		label: "Realistic Vision",
		group: "diffusion",
		hint: "Photoreal exterior & interior material fill"
	},
	{
		id: "anytext",
		label: "AnyText v1.1",
		group: "diffusion",
		hint: "Accurate architectural lettering & wayfinding"
	},
	{
		id: "paint-by-example",
		label: "Paint-by-Example",
		group: "diffusion",
		hint: "Reference-driven furniture & prop insertion"
	},
	{
		id: "instruct-pix2pix",
		label: "InstructPix2Pix",
		group: "diffusion",
		hint: "Instruction-only image restyling"
	}
];
var IOPAINT_REMOVEBG_MODELS = [
	{
		id: "rmbg-2.0",
		label: "RMBG-2.0 (Bria)"
	},
	{
		id: "birefnet",
		label: "BiRefNet (Arch)"
	},
	{
		id: "u2net",
		label: "U²-Net"
	},
	{
		id: "isnet-general",
		label: "IS-Net General"
	},
	{
		id: "anime-seg",
		label: "Line/Cutout Seg"
	}
];
var IOPAINT_FACE_MODELS = [{
	id: "gfpgan",
	label: "GFPGAN v1.4"
}, {
	id: "restoreformer",
	label: "RestoreFormer++"
}];
var DEFAULT_IOPAINT_OUTPAINT_PAD = {
	top: 0,
	right: 128,
	bottom: 0,
	left: 128
};
var DEFAULT_REFERENCE_MATRIX = {
	massing: {
		url: null,
		weight: 70,
		startAt: 0,
		endAt: 75
	},
	material: {
		url: null,
		weight: 75,
		startAt: 10,
		endAt: 90
	},
	lighting: {
		url: null,
		weight: 65,
		startAt: 15,
		endAt: 85
	}
};
var DEFAULT_ENGINE = {
	workflowPreset: "photoreal",
	geometryLock: 85,
	materialOverride: 55,
	renderFidelity: "photoreal",
	seed: 482910,
	seedLocked: true,
	facadeTypology: "Minimalist Glass",
	climateRegion: "Temperate Coastal",
	styleTransferWeight: 65,
	detailDensity: "balanced",
	edgeAdherence: 80,
	sketchMode: "faithful",
	inpaintStrength: 72,
	enhanceMode: "upscale-2x",
	liveStreamEnabled: false,
	relightPreset: "none",
	outpaintRatio: "none",
	mjStylize: 200,
	mjChaos: 12,
	refWeight: 70,
	outputMode: "single",
	annotatorMode: "mlsd",
	annotatorThreshold: 58,
	depthEnabled: true,
	depthWeight: 70,
	samPrompt: "facade glazing",
	samThreshold: 45,
	esrganModel: "RealESRGAN_x2plus",
	esrganDenoise: 25,
	esrganFaceEnhance: false,
	upscaleFactor: 2,
	ipAdapterEnabled: false,
	ipAdapterPreset: "plus",
	ipAdapterWeight: 65,
	ipAdapterStartAt: 0,
	ipAdapterEndAt: 85,
	ipAdapterRefUrl: null,
	refMatrix: DEFAULT_REFERENCE_MATRIX,
	houseStyleId: null,
	iopaintTask: "erase",
	iopaintModel: "lama",
	iopaintMaskDilate: 4,
	iopaintInvertMask: false,
	iopaintAnyText: "ORIEL PAVILION",
	iopaintExampleUrl: null,
	iopaintOutpaintPad: DEFAULT_IOPAINT_OUTPAINT_PAD,
	iopaintRemoveBgModel: "rmbg-2.0",
	iopaintFaceModel: "gfpgan"
};
var DEFAULT_SCENE3D = {
	preset: "pavilion",
	sunAzimuth: 138,
	sunElevation: 32,
	fogDensity: 18,
	focalLength: 35,
	cameraPreset: "oblique",
	primaryMaterial: "concrete",
	modelRotationY: 0,
	modelScale: 1,
	modelElevation: 0,
	exposure: 1.08,
	d5LightPreset: "noon",
	twoPointTilt: true,
	verticalShift: .04,
	geoEnabled: false,
	geoLatitude: 37.8,
	geoMonth: 6,
	geoHour: 16.5,
	hdriMood: "clear-sky",
	materialPickMode: false,
	customModelName: null
};
function clamp(n, min, max, fallback) {
	if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
	return Math.max(min, Math.min(max, Math.round(n)));
}
function clampFloat(n, min, max, fallback) {
	if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
	return Math.max(min, Math.min(max, Number(n.toFixed(2))));
}
function pickOne(val, allowed, fallback) {
	return typeof val === "string" && allowed.includes(val) ? val : fallback;
}
function sanitizeRefSlot(raw, fallback) {
	if (!raw || typeof raw !== "object") return { ...fallback };
	const s = raw;
	return {
		url: typeof s.url === "string" ? s.url : null,
		weight: clamp(s.weight, 0, 100, fallback.weight),
		startAt: clamp(s.startAt, 0, 50, fallback.startAt),
		endAt: clamp(s.endAt, 50, 100, fallback.endAt)
	};
}
function sanitizeEngineState(input) {
	const factor = input?.upscaleFactor;
	const validUpscale = factor === 1 || factor === 2 || factor === 4 || factor === 8 ? factor : DEFAULT_ENGINE.upscaleFactor;
	const rawMatrix = input?.refMatrix;
	return {
		workflowPreset: pickOne(input?.workflowPreset, WORKFLOW_PRESETS.map((p) => p.id), DEFAULT_ENGINE.workflowPreset),
		geometryLock: clamp(input?.geometryLock, 0, 100, DEFAULT_ENGINE.geometryLock),
		materialOverride: clamp(input?.materialOverride, 0, 100, DEFAULT_ENGINE.materialOverride),
		renderFidelity: pickOne(input?.renderFidelity, [
			"draft",
			"standard",
			"photoreal",
			"editorial"
		], DEFAULT_ENGINE.renderFidelity),
		seed: clamp(input?.seed, 1, 9999999, DEFAULT_ENGINE.seed),
		seedLocked: typeof input?.seedLocked === "boolean" ? input.seedLocked : DEFAULT_ENGINE.seedLocked,
		facadeTypology: pickOne(input?.facadeTypology, FACADE_TYPOLOGIES, DEFAULT_ENGINE.facadeTypology),
		climateRegion: pickOne(input?.climateRegion, CLIMATE_REGIONS, DEFAULT_ENGINE.climateRegion),
		styleTransferWeight: clamp(input?.styleTransferWeight, 0, 100, DEFAULT_ENGINE.styleTransferWeight),
		detailDensity: pickOne(input?.detailDensity, [
			"minimal",
			"balanced",
			"intricate"
		], DEFAULT_ENGINE.detailDensity),
		edgeAdherence: clamp(input?.edgeAdherence, 0, 100, DEFAULT_ENGINE.edgeAdherence),
		sketchMode: pickOne(input?.sketchMode, [
			"faithful",
			"balanced",
			"creative"
		], DEFAULT_ENGINE.sketchMode),
		inpaintStrength: clamp(input?.inpaintStrength, 0, 100, DEFAULT_ENGINE.inpaintStrength),
		enhanceMode: pickOne(input?.enhanceMode, [
			"standard",
			"upscale-2x",
			"micro-detail"
		], DEFAULT_ENGINE.enhanceMode),
		liveStreamEnabled: typeof input?.liveStreamEnabled === "boolean" ? input.liveStreamEnabled : DEFAULT_ENGINE.liveStreamEnabled,
		relightPreset: pickOne(input?.relightPreset, [
			"none",
			"overcast-to-golden",
			"summer-to-snow",
			"day-to-dusk"
		], DEFAULT_ENGINE.relightPreset),
		outpaintRatio: pickOne(input?.outpaintRatio, [
			"none",
			"21:9",
			"9:16",
			"16:9"
		], DEFAULT_ENGINE.outpaintRatio),
		mjStylize: clamp(input?.mjStylize, 0, 1e3, DEFAULT_ENGINE.mjStylize),
		mjChaos: clamp(input?.mjChaos, 0, 100, DEFAULT_ENGINE.mjChaos),
		refWeight: clamp(input?.refWeight, 0, 100, DEFAULT_ENGINE.refWeight),
		outputMode: pickOne(input?.outputMode, ["single", "grid-4"], DEFAULT_ENGINE.outputMode),
		annotatorMode: pickOne(input?.annotatorMode, [
			"none",
			"canny",
			"mlsd",
			"lineart",
			"softedge",
			"normal"
		], DEFAULT_ENGINE.annotatorMode),
		annotatorThreshold: clamp(input?.annotatorThreshold, 10, 100, DEFAULT_ENGINE.annotatorThreshold),
		depthEnabled: typeof input?.depthEnabled === "boolean" ? input.depthEnabled : DEFAULT_ENGINE.depthEnabled,
		depthWeight: clamp(input?.depthWeight, 0, 100, DEFAULT_ENGINE.depthWeight),
		samPrompt: typeof input?.samPrompt === "string" ? input.samPrompt.slice(0, 64) : DEFAULT_ENGINE.samPrompt,
		samThreshold: clamp(input?.samThreshold, 15, 90, DEFAULT_ENGINE.samThreshold),
		esrganModel: pickOne(input?.esrganModel, [
			"RealESRGAN_x2plus",
			"RealESRGAN_x4plus",
			"4x-ArchSharp"
		], DEFAULT_ENGINE.esrganModel),
		esrganDenoise: clamp(input?.esrganDenoise, 0, 100, DEFAULT_ENGINE.esrganDenoise),
		esrganFaceEnhance: typeof input?.esrganFaceEnhance === "boolean" ? input.esrganFaceEnhance : DEFAULT_ENGINE.esrganFaceEnhance,
		upscaleFactor: validUpscale,
		ipAdapterEnabled: typeof input?.ipAdapterEnabled === "boolean" ? input.ipAdapterEnabled : DEFAULT_ENGINE.ipAdapterEnabled,
		ipAdapterPreset: pickOne(input?.ipAdapterPreset, [
			"standard",
			"plus",
			"style-composition",
			"fixture-lock"
		], DEFAULT_ENGINE.ipAdapterPreset),
		ipAdapterWeight: clamp(input?.ipAdapterWeight, 0, 100, DEFAULT_ENGINE.ipAdapterWeight),
		ipAdapterStartAt: clamp(input?.ipAdapterStartAt, 0, 50, DEFAULT_ENGINE.ipAdapterStartAt),
		ipAdapterEndAt: clamp(input?.ipAdapterEndAt, 50, 100, DEFAULT_ENGINE.ipAdapterEndAt),
		ipAdapterRefUrl: typeof input?.ipAdapterRefUrl === "string" ? input.ipAdapterRefUrl : null,
		refMatrix: {
			massing: sanitizeRefSlot(rawMatrix?.massing, DEFAULT_REFERENCE_MATRIX.massing),
			material: sanitizeRefSlot(rawMatrix?.material, DEFAULT_REFERENCE_MATRIX.material),
			lighting: sanitizeRefSlot(rawMatrix?.lighting, DEFAULT_REFERENCE_MATRIX.lighting)
		},
		houseStyleId: typeof input?.houseStyleId === "string" ? input.houseStyleId : null,
		iopaintTask: pickOne(input?.iopaintTask, [
			"erase",
			"replace",
			"outpaint",
			"anytext",
			"paint-by-example"
		], DEFAULT_ENGINE.iopaintTask),
		iopaintModel: pickOne(input?.iopaintModel, IOPAINT_MODELS.map((m) => m.id), DEFAULT_ENGINE.iopaintModel),
		iopaintMaskDilate: clamp(input?.iopaintMaskDilate, 0, 24, DEFAULT_ENGINE.iopaintMaskDilate),
		iopaintInvertMask: typeof input?.iopaintInvertMask === "boolean" ? input.iopaintInvertMask : DEFAULT_ENGINE.iopaintInvertMask,
		iopaintAnyText: typeof input?.iopaintAnyText === "string" ? input.iopaintAnyText.slice(0, 80) : DEFAULT_ENGINE.iopaintAnyText,
		iopaintExampleUrl: typeof input?.iopaintExampleUrl === "string" ? input.iopaintExampleUrl : null,
		iopaintOutpaintPad: {
			top: clamp(input?.iopaintOutpaintPad?.top, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.top),
			right: clamp(input?.iopaintOutpaintPad?.right, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.right),
			bottom: clamp(input?.iopaintOutpaintPad?.bottom, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.bottom),
			left: clamp(input?.iopaintOutpaintPad?.left, 0, 320, DEFAULT_IOPAINT_OUTPAINT_PAD.left)
		},
		iopaintRemoveBgModel: pickOne(input?.iopaintRemoveBgModel, IOPAINT_REMOVEBG_MODELS.map((m) => m.id), DEFAULT_ENGINE.iopaintRemoveBgModel),
		iopaintFaceModel: pickOne(input?.iopaintFaceModel, IOPAINT_FACE_MODELS.map((m) => m.id), DEFAULT_ENGINE.iopaintFaceModel)
	};
}
function sanitizeScene3DState(input) {
	const focal = input?.focalLength;
	const validFocal = focal === 24 || focal === 35 || focal === 50 || focal === 85 ? focal : DEFAULT_SCENE3D.focalLength;
	return {
		preset: pickOne(input?.preset, [
			"pavilion",
			"villa",
			"loft",
			"civic",
			"plan-extrude",
			"custom-cad"
		], DEFAULT_SCENE3D.preset),
		sunAzimuth: clamp(input?.sunAzimuth, 0, 360, DEFAULT_SCENE3D.sunAzimuth),
		sunElevation: clamp(input?.sunElevation, 4, 85, DEFAULT_SCENE3D.sunElevation),
		fogDensity: clamp(input?.fogDensity, 0, 100, DEFAULT_SCENE3D.fogDensity),
		focalLength: validFocal,
		cameraPreset: pickOne(input?.cameraPreset, [
			"eye",
			"oblique",
			"aerial",
			"detail"
		], DEFAULT_SCENE3D.cameraPreset),
		primaryMaterial: pickOne(input?.primaryMaterial, [
			"concrete",
			"timber",
			"travertine",
			"brick"
		], DEFAULT_SCENE3D.primaryMaterial),
		modelRotationY: clamp(input?.modelRotationY, -180, 180, DEFAULT_SCENE3D.modelRotationY),
		modelScale: clampFloat(input?.modelScale, .6, 1.5, DEFAULT_SCENE3D.modelScale),
		modelElevation: clampFloat(input?.modelElevation, 0, 2.5, DEFAULT_SCENE3D.modelElevation),
		exposure: clampFloat(input?.exposure, .6, 1.6, DEFAULT_SCENE3D.exposure),
		d5LightPreset: pickOne(input?.d5LightPreset, [
			"noon",
			"golden",
			"blue-hour",
			"overcast"
		], DEFAULT_SCENE3D.d5LightPreset),
		twoPointTilt: typeof input?.twoPointTilt === "boolean" ? input.twoPointTilt : DEFAULT_SCENE3D.twoPointTilt,
		verticalShift: clampFloat(input?.verticalShift, -.25, .25, DEFAULT_SCENE3D.verticalShift),
		geoEnabled: typeof input?.geoEnabled === "boolean" ? input.geoEnabled : DEFAULT_SCENE3D.geoEnabled,
		geoLatitude: clampFloat(input?.geoLatitude, -65, 65, DEFAULT_SCENE3D.geoLatitude),
		geoMonth: clamp(input?.geoMonth, 1, 12, DEFAULT_SCENE3D.geoMonth),
		geoHour: clampFloat(input?.geoHour, 0, 24, DEFAULT_SCENE3D.geoHour),
		hdriMood: pickOne(input?.hdriMood, [
			"studio",
			"clear-sky",
			"golden-dusk",
			"overcast-nordic"
		], DEFAULT_SCENE3D.hdriMood),
		materialPickMode: typeof input?.materialPickMode === "boolean" ? input.materialPickMode : DEFAULT_SCENE3D.materialPickMode,
		customModelName: typeof input?.customModelName === "string" ? input.customModelName.slice(0, 80) : null
	};
}
/**
* Computes Three.js solar rig coordinates and atmospheric lighting color/intensities
* from solar azimuth (0-360°) and elevation (4-85°).
*/
function computeSunPosition(azimuthDeg, elevationDeg, radius = 26) {
	const azRad = azimuthDeg * Math.PI / 180;
	const elRad = Math.max(4, Math.min(85, elevationDeg)) * Math.PI / 180;
	const cosEl = Math.cos(elRad);
	const x = Number((Math.sin(azRad) * cosEl * radius).toFixed(3));
	const y = Number((Math.sin(elRad) * radius).toFixed(3));
	const z = Number((Math.cos(azRad) * cosEl * radius).toFixed(3));
	const lowSun = elevationDeg < 18;
	const dusk = elevationDeg <= 10;
	return {
		x,
		y,
		z,
		skyHex: dusk ? "#23364f" : lowSun ? "#cfd9e6" : "#dde6ef",
		sunHex: dusk ? "#ff9f5a" : lowSun ? "#ffd29b" : "#fff7e8",
		sunIntensity: dusk ? 1.15 : lowSun ? 1.85 : 2.35,
		ambientIntensity: dusk ? .55 : lowSun ? .72 : .85
	};
}
/**
* Converts a 35mm architectural lens focal length (mm) to vertical field of view (degrees).
*/
function focalLengthToFov(focalMm) {
	const rad = 2 * Math.atan(24 / (2 * Math.max(14, Math.min(200, focalMm))));
	return Number((rad * 180 / Math.PI).toFixed(2));
}
function compileEngineBrief(design, engine, scene3d, idea, options) {
	const seed = engine.seedLocked ? engine.seed + (options?.variationIndex ?? 0) * 137 : (engine.seed + 7919 + (options?.variationIndex ?? 0) * 313) % 9999999 + 1;
	const hasUpload = Boolean(options?.hasUploadedImage);
	const presetLabel = WORKFLOW_PRESETS.find((p) => p.id === engine.workflowPreset)?.label ?? "Photoreal Plate";
	const ratio = options?.frame?.ratio ?? "16:9";
	const preservationDirective = hasUpload ? `PIXEL-TO-PIXEL REGISTRATION LOCK (${Math.max(85, engine.geometryLock)}%): Preserve the exact camera position, elevation, pitch, lens FOV, horizon line, vanishing points, crop framing, and building/terrain silhouette of the attached uploaded image without zooming, panning, tilting, or re-framing.` : engine.geometryLock >= 80 ? `STRICT GEOMETRY LOCK (${engine.geometryLock}%): Maintain exact structural silhouette, roof pitch, window openings, column rhythm, and 2-point perspective camera.` : engine.geometryLock >= 45 ? `BALANCED GEOMETRY LOCK (${engine.geometryLock}%): Preserve overall spatial layout and key apertures while refining architectural relief.` : `FLEXIBLE EXPLORATION (${engine.geometryLock}%): Treat source geometry as loose compositional inspiration.`;
	const sketchDirective = options?.hasSketch ? `SKETCH CONDITIONING (PromeAI ${engine.sketchMode}, Edge Adherence ${engine.edgeAdherence}%): Follow supplied architectural line strokes and structural contours faithfully.` : "";
	const maskDirective = options?.hasMask ? buildIopaintDirective(engine, options?.inpaintNote || idea) : "";
	const facadeDirective = hasUpload ? "" : design.vertical === "exterior" || design.vertical === "landscape" ? `EXTERIOR FACADE (LookX): ${engine.facadeTypology}, adapted for ${engine.climateRegion} climate, style transfer weight ${engine.styleTransferWeight}%, ${engine.detailDensity} detail density.` : `INTERIOR STAGING (mnml.ai): ${design.picks.room ?? "Architectural volume"}, material override ${engine.materialOverride}%, ${engine.detailDensity} tactile detailing.`;
	const sceneDirective = hasUpload ? "" : `3D ENVIRONMENT (D5 Rig): ${scene3d.preset} massing in ${scene3d.primaryMaterial}, rot ${scene3d.modelRotationY}° scale ${scene3d.modelScale}x, ${scene3d.focalLength}mm lens, ${scene3d.d5LightPreset} light (az ${scene3d.sunAzimuth}° el ${scene3d.sunElevation}°), haze ${scene3d.fogDensity}%.`;
	const annotatorDirective = hasUpload ? "" : engine.annotatorMode !== "none" ? `CONTROLNET ANNOTATOR (lllyasviel): ${engine.annotatorMode.toUpperCase()} threshold ${engine.annotatorThreshold}%${engine.depthEnabled ? ` + Depth-Anything-V2 (weight ${engine.depthWeight}%)` : ""}.` : engine.depthEnabled ? `DEPTH CONDITIONING (Depth-Anything-V2): Monocular Z-depth lock weight ${engine.depthWeight}%.` : "";
	const refMatrixParts = [
		engine.refMatrix.massing.url ? `Massing-Ref (${engine.refMatrix.massing.weight}%)` : "",
		engine.refMatrix.material.url ? `Material-Ref (${engine.refMatrix.material.weight}%)` : "",
		engine.refMatrix.lighting.url ? `Lighting-Ref (${engine.refMatrix.lighting.weight}%)` : ""
	].filter(Boolean);
	const ipAdapterDirective = engine.ipAdapterEnabled || refMatrixParts.length > 0 ? `IP-ADAPTER PLUS (${engine.ipAdapterPreset}): weight ${engine.ipAdapterWeight}%, active steps ${engine.ipAdapterStartAt}%-${engine.ipAdapterEndAt}%${refMatrixParts.length ? ` · Matrix [${refMatrixParts.join(", ")}]` : ""}.` : "";
	const relightDirective = engine.relightPreset !== "none" ? `RELIGHT & SEASON TRANSFORM (${engine.relightPreset}): Lock architectural geometry 100% while transforming sky dome, shadow angles, and practical interior glow.` : "";
	const outpaintDirective = engine.outpaintRatio !== "none" ? `CANVAS OUTPAINT (${engine.outpaintRatio}): Extend frame seamlessly beyond original boundaries with coherent sky, paving, and surrounding architectural context.` : "";
	const twoPointDirective = !hasUpload && scene3d.twoPointTilt ? "CAMERA PROJECTION: 2-Point Vertical Tilt Lock enabled (plumb verticals)." : "";
	const samDirective = engine.samPrompt.trim() ? `GROUNDED-SAM TARGET: "${engine.samPrompt.trim()}" (sensitivity ${engine.samThreshold}%).` : "";
	const variationDirective = typeof options?.variationIndex === "number" ? `CONCEPT VARIATION #${options.variationIndex + 1} (Midjourney Chaos ${engine.mjChaos}): Introduce distinct lighting nuance or material accent within the same architectural brief.` : "";
	const mjTail = hasUpload ? `--seed ${seed}` : `--ar ${ratio} --s ${engine.mjStylize} --c ${engine.mjChaos} --seed ${seed}`;
	return {
		prompt: [
			`WORKFLOW: ${hasUpload ? "Pixel-Locked Upload Edit" : presetLabel} · Fidelity: ${engine.renderFidelity}`,
			preservationDirective,
			facadeDirective,
			sceneDirective,
			twoPointDirective,
			annotatorDirective,
			ipAdapterDirective,
			relightDirective,
			outpaintDirective,
			samDirective,
			sketchDirective,
			maskDirective,
			variationDirective,
			idea.trim() ? `USER DIRECTIVE: ${idea.trim()}` : "",
			`PARAMS: ${mjTail}`
		].filter(Boolean).join("\n"),
		parametersSummary: hasUpload ? `Upload Pixel-Lock · Geo ${Math.max(85, engine.geometryLock)}% · --seed ${seed}` : `${presetLabel} · Geo ${engine.geometryLock}% · ${engine.annotatorMode !== "none" ? `${engine.annotatorMode.toUpperCase()} · ` : ""}${scene3d.focalLength}mm · --s ${engine.mjStylize} --seed ${seed}`,
		seed
	};
}
function buildIopaintDirective(engine, inpaintNote) {
	const modelLabel = IOPAINT_MODELS.find((m) => m.id === engine.iopaintModel)?.label ?? engine.iopaintModel;
	const dilateNote = engine.iopaintMaskDilate > 0 ? `mask expand +${engine.iopaintMaskDilate}px` : "exact mask edge";
	const invertNote = engine.iopaintInvertMask ? "INVERTED MASK (preserve painted core, edit surrounding field)" : "masked region only";
	const note = inpaintNote?.trim() || "";
	switch (engine.iopaintTask) {
		case "erase": return `IOPAINT OBJECT ERASE (${modelLabel} · ${dilateNote} · ${invertNote}): Completely remove painted elements inside the mask (${note || "unwanted objects, people, cables, or artifacts"}) and reconstruct seamless background masonry, glazing, sky, and paving matching lighting and perspective 100%.`;
		case "outpaint": return `IOPAINT DIRECTIONAL OUTPAINT (${modelLabel} · pad T:${engine.iopaintOutpaintPad.top} R:${engine.iopaintOutpaintPad.right} B:${engine.iopaintOutpaintPad.bottom} L:${engine.iopaintOutpaintPad.left}px): Extend architectural scene outward into masked border padding seamlessly.${note ? ` Context: ${note}.` : ""}`;
		case "anytext": return `IOPAINT ANYTEXT SIGNAGE (${modelLabel} · ${dilateNote}): Render exact crisp architectural lettering "${engine.iopaintAnyText.trim() || note || "STUDIO 01"}" inside the painted mask area matching perspective plane, ambient occlusion, and material reflection.`;
		case "paint-by-example": return `IOPAINT PAINT-BY-EXAMPLE (${modelLabel} · Strength ${engine.inpaintStrength}% · ${dilateNote}): Harmonize and insert the supplied reference object/furniture cleanly inside the painted mask with physically accurate contact shadows and color temperature.${note ? ` Placement note: ${note}.` : ""}`;
		default: return `IOPAINT GENERATIVE REPLACE (${modelLabel} · Strength ${engine.inpaintStrength}% · ${dilateNote} · ${invertNote}): Modify ONLY the masked region (${note || "targeted architectural refinement"}), blending lighting and contact shadows seamlessly with untouched surroundings.`;
	}
}
function normalizeQueueStatus(status) {
	if (status === "queued" || status === "pending") return "pending";
	if (status === "running" || status === "processing") return "processing";
	if (status === "done" || status === "completed") return "completed";
	return "error";
}
function createQueueItem(label, preset, light, options) {
	return {
		id: `q-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
		label: label.trim() || "Queued Scene",
		preset,
		light,
		cameraPreset: options?.cameraPreset,
		sunHour: options?.sunHour,
		promptNote: options?.promptNote,
		thumbnailUrl: options?.thumbnailUrl,
		status: options?.status ?? "pending",
		createdAt: Date.now()
	};
}
function updateQueueListStatus(queue, id, status, url, extra) {
	const now = Date.now();
	return queue.map((item) => {
		if (item.id !== id) return item;
		const norm = normalizeQueueStatus(status);
		const startedAt = norm === "processing" ? now : item.startedAt;
		const finishedAt = norm === "completed" || norm === "error" ? now : void 0;
		const durationMs = finishedAt && startedAt ? Math.max(120, finishedAt - startedAt) : item.durationMs;
		return {
			...item,
			status,
			...url ? { url } : {},
			...extra?.errorMessage ? { errorMessage: extra.errorMessage } : {},
			startedAt,
			finishedAt,
			durationMs
		};
	});
}
var PLATE_POOL = {
	exterior: [
		"/viz/p01-pavilion-dusk.jpg",
		"/viz/p01-pavilion-day.jpg",
		"/viz/t05-subtropical-home.jpg",
		"/viz/t10-home-dusk-edit.jpg",
		"/viz/t01-public-library.jpg",
		"/viz/t07-cultural-campus.jpg"
	],
	interior: [
		"/viz/p02-loft-after.jpg",
		"/viz/t03-compact-living-room.jpg",
		"/viz/t09-r1-living-room-clay-edit.jpg",
		"/viz/t04-neighborhood-cafe.jpg",
		"/viz/t08-material-junction.jpg"
	],
	amenities: [
		"/viz/t06-urban-courtyard.jpg",
		"/viz/t04-neighborhood-cafe.jpg",
		"/viz/p01-pavilion-dusk.jpg",
		"/viz/t10-home-dusk-edit.jpg"
	],
	landscape: [
		"/viz/t06-urban-courtyard.jpg",
		"/viz/t05-subtropical-home.jpg",
		"/viz/t07-cultural-campus.jpg",
		"/viz/p01-pavilion-day.jpg"
	]
};
function hashPromptSeed(text) {
	const clean = text.trim().toLowerCase();
	if (!clean) return 0;
	let h = 2166136261;
	for (let i = 0; i < clean.length; i++) {
		h ^= clean.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return Math.abs(h >>> 0);
}
function inferAtmosphereProfile(params) {
	const ideaLow = (params.idea ?? "").toLowerCase();
	const lightLow = params.design.light.toLowerCase();
	const timeLow = params.design.time.toLowerCase();
	const weatherLow = params.design.weather.toLowerCase();
	const lookLow = params.design.look.toLowerCase();
	const vIdx = params.variantIndex ?? 0;
	const iter = params.renderIteration ?? 0;
	const seedVariant = Math.abs(hashPromptSeed(`${params.idea ?? ""}|${params.design.look}|${params.design.light}|${vIdx}|${iter}`)) % 7;
	let lightingMood = "noon";
	if (/snow|winter|frost|nordic overcast/.test(ideaLow) || /snow/.test(weatherLow)) lightingMood = "snow";
	else if (/night|nocturne|midnight/.test(ideaLow) || lightLow === "night" || timeLow === "night") lightingMood = "night";
	else if (/dusk|twilight|evening|blue hour/.test(ideaLow) || lightLow === "evening" || timeLow === "evening" || (params.scene3d?.sunElevation ?? 30) <= 12 || vIdx === 2) lightingMood = "dusk";
	else if (/golden|sunset|amber|warm/.test(ideaLow) || lightLow === "golden hour" || vIdx === 1) lightingMood = "golden";
	else if (/overcast|mist|fog|rain|soft/.test(ideaLow) || lightLow === "soft overcast" || /rain|fog|overcast/.test(weatherLow) || vIdx === 3) lightingMood = "overcast";
	if (params.isEnhance) return {
		lightingMood,
		filterCss: "contrast(1.12) saturate(1.10) brightness(1.03)",
		overlayTop: "rgba(255, 250, 240, 0.06)",
		overlayMid: "rgba(212, 176, 106, 0.04)",
		overlayBottom: "rgba(18, 16, 14, 0.14)",
		seedVariant
	};
	const boostContrast = 1 + seedVariant % 3 * .03 + (/brutalist|minimalist|sharp/.test(lookLow) ? .04 : 0);
	const boostSat = /timber|warm|tropical|mediterranean/.test(`${lookLow} ${ideaLow}`) ? 1.12 : 1;
	switch (lightingMood) {
		case "night": return {
			lightingMood,
			filterCss: `contrast(${(1.18 * boostContrast).toFixed(2)}) saturate(0.84) brightness(0.78) hue-rotate(-10deg)`,
			overlayTop: "rgba(12, 26, 48, 0.42)",
			overlayMid: "rgba(220, 170, 92, 0.14)",
			overlayBottom: "rgba(8, 10, 14, 0.44)",
			glowColor: "rgba(255, 198, 112, 0.24)",
			seedVariant
		};
		case "dusk": return {
			lightingMood,
			filterCss: `contrast(${(1.13 * boostContrast).toFixed(2)}) saturate(${(.94 * boostSat).toFixed(2)}) brightness(0.88) hue-rotate(-6deg)`,
			overlayTop: "rgba(24, 52, 92, 0.28)",
			overlayMid: "rgba(212, 176, 106, 0.14)",
			overlayBottom: "rgba(18, 16, 14, 0.34)",
			glowColor: "rgba(245, 194, 110, 0.20)",
			seedVariant
		};
		case "golden": return {
			lightingMood,
			filterCss: `contrast(${(1.08 * boostContrast).toFixed(2)}) saturate(${(1.14 * boostSat).toFixed(2)}) sepia(0.14) brightness(1.02)`,
			overlayTop: "rgba(246, 198, 114, 0.24)",
			overlayMid: "rgba(228, 168, 92, 0.10)",
			overlayBottom: "rgba(42, 28, 12, 0.18)",
			glowColor: "rgba(255, 214, 140, 0.18)",
			seedVariant
		};
		case "snow": return {
			lightingMood,
			filterCss: `contrast(${(1.12 * boostContrast).toFixed(2)}) saturate(0.70) brightness(1.06)`,
			overlayTop: "rgba(216, 232, 246, 0.26)",
			overlayMid: "rgba(235, 242, 250, 0.12)",
			overlayBottom: "rgba(38, 48, 62, 0.20)",
			seedVariant
		};
		case "overcast": return {
			lightingMood,
			filterCss: `contrast(${(1.15 * boostContrast).toFixed(2)}) saturate(0.80) brightness(0.99)`,
			overlayTop: "rgba(196, 208, 222, 0.20)",
			overlayMid: "rgba(218, 220, 224, 0.08)",
			overlayBottom: "rgba(26, 28, 32, 0.22)",
			seedVariant
		};
		default: return {
			lightingMood,
			filterCss: `contrast(${(1.06 * boostContrast).toFixed(2)}) saturate(${(1.05 * boostSat).toFixed(2)}) brightness(${(1.01 + seedVariant % 2 * .02).toFixed(2)})`,
			overlayTop: "rgba(255, 250, 240, 0.12)",
			overlayMid: "rgba(236, 226, 208, 0.06)",
			overlayBottom: "rgba(20, 17, 15, 0.14)",
			seedVariant
		};
	}
}
function pickServerFallbackPlate(design, engine, seed, variantIndex = 0, idea = "") {
	const pool = PLATE_POOL[design.vertical] ?? PLATE_POOL.exterior;
	const ideaLow = idea.toLowerCase();
	const isDuskOrNight = design.light === "Evening" || design.light === "Night" || design.time === "Evening" || design.time === "Night" || /\b(dusk|evening|night|twilight|nocturne)\b/.test(ideaLow);
	const isDaylight = design.light === "Daylight" || design.light === "Soft overcast" || /\b(daylight|noon|morning|overcast|sunlit)\b/.test(ideaLow);
	if (engine.workflowPreset === "interior-restyle" && variantIndex === 0 && !isDaylight) return "/viz/p02-loft-after.jpg";
	if (variantIndex === 0) {
		if (isDuskOrNight && design.vertical === "exterior") return (seed + hashPromptSeed(idea)) % 2 === 0 ? "/viz/p01-pavilion-dusk.jpg" : "/viz/t10-home-dusk-edit.jpg";
		if (isDaylight && design.vertical === "exterior") return (seed + hashPromptSeed(idea)) % 2 === 0 ? "/viz/p01-pavilion-day.jpg" : "/viz/t01-public-library.jpg";
	}
	const promptOffset = hashPromptSeed(`${idea}|${design.look}|${design.light}|${engine.workflowPreset}`);
	return pool[Math.abs(seed + promptOffset + variantIndex * 3) % pool.length] ?? "/viz/p01-pavilion-dusk.jpg";
}
function pickFourFallbackPlates(design, _engine, seed, idea = "") {
	const pool = [
		...PLATE_POOL[design.vertical] ?? PLATE_POOL.exterior,
		...PLATE_POOL.exterior,
		...PLATE_POOL.interior
	];
	const promptOffset = hashPromptSeed(`${idea}|${design.look}|${design.light}`);
	const unique = [];
	for (let i = 0; i < pool.length && unique.length < 4; i++) {
		const candidate = pool[(Math.abs(seed) + promptOffset + i) % pool.length];
		if (candidate && !unique.includes(candidate)) unique.push(candidate);
	}
	while (unique.length < 4) unique.push("/viz/p01-pavilion-dusk.jpg");
	return unique;
}
function loadImageEl(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (/^https?:\/\//i.test(src) && typeof window !== "undefined" && !src.startsWith(window.location.origin)) img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not decode image"));
		img.src = src;
	});
}
/**
* Client-side deterministic fallback plate synthesizer.
* When live AI credentials are absent, transforms the user's captured 3D snapshot,
* sketch overlay, masked region, or architectural reference plate with calibrated
* architectural lighting/contrast grading so every render reflects the prompt and optics.
*/
async function synthesizeFallbackComposite(params) {
	const sourceSrc = params.baseImage || params.serverFallbackUrl;
	try {
		const baseImg = await loadImageEl(sourceSrc);
		const width = Math.min(1440, Math.max(800, baseImg.naturalWidth || 1280));
		const height = Math.round(width / (baseImg.naturalWidth || 16) * (baseImg.naturalHeight || 9));
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
			isEnhance: params.isEnhance
		});
		ctx.save();
		ctx.filter = atmosphere.filterCss;
		ctx.drawImage(baseImg, 0, 0, width, height);
		ctx.restore();
		const grad = ctx.createLinearGradient(0, 0, width, height);
		grad.addColorStop(0, atmosphere.overlayTop);
		grad.addColorStop(.58, atmosphere.overlayMid);
		grad.addColorStop(1, atmosphere.overlayBottom);
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, width, height);
		if (atmosphere.glowColor) {
			const gx = width * (.42 + atmosphere.seedVariant % 3 * .08);
			const gy = height * .56;
			const glow = ctx.createRadialGradient(gx, gy, width * .04, gx, gy, width * .44);
			glow.addColorStop(0, atmosphere.glowColor);
			glow.addColorStop(1, "rgba(0,0,0,0)");
			ctx.fillStyle = glow;
			ctx.fillRect(0, 0, width, height);
		}
		if (params.sketchImage) try {
			const sketchImg = await loadImageEl(params.sketchImage);
			ctx.save();
			ctx.globalAlpha = Math.max(.25, params.engine.edgeAdherence / 120);
			ctx.drawImage(sketchImg, 0, 0, width, height);
			ctx.restore();
		} catch {}
		if (params.maskImage) try {
			const maskImg = await loadImageEl(params.maskImage);
			const maskCanvas = document.createElement("canvas");
			maskCanvas.width = width;
			maskCanvas.height = height;
			const mCtx = maskCanvas.getContext("2d");
			if (mCtx) {
				mCtx.drawImage(maskImg, 0, 0, width, height);
				mCtx.globalCompositeOperation = "source-in";
				mCtx.fillStyle = atmosphere.lightingMood === "dusk" || atmosphere.lightingMood === "night" ? "rgba(235, 192, 110, 0.55)" : "rgba(244, 232, 206, 0.45)";
				mCtx.fillRect(0, 0, width, height);
				ctx.save();
				ctx.globalAlpha = Math.max(.3, params.engine.inpaintStrength / 100);
				ctx.drawImage(maskCanvas, 0, 0);
				ctx.restore();
			}
		} catch {}
		const vignette = ctx.createRadialGradient(width * .5, height * .5, width * .3, width * .5, height * .5, width * .72);
		vignette.addColorStop(0, "rgba(0,0,0,0)");
		vignette.addColorStop(1, "rgba(18,14,10,0.22)");
		ctx.fillStyle = vignette;
		ctx.fillRect(0, 0, width, height);
		return canvas.toDataURL("image/jpeg", .9);
	} catch {
		return params.serverFallbackUrl;
	}
}
var SMART_SLOT_DEFAULTS = [
	[/room\s*size|space\s*size|size/i, (ctx) => ctx.hasUpload ? "existing" : "well-proportioned"],
	[/style|aesthetic|architectural\s*style/i, (ctx) => ctx.design.look.toLowerCase()],
	[/palette|color|colour|tone/i, () => "warm architectural neutrals, natural oak, and honed stone"],
	[/light|lighting|time\s*of\s*day|atmosphere/i, (ctx) => ctx.design.light.toLowerCase()],
	[/mood|vibe|feeling/i, (ctx) => ctx.design.mood.toLowerCase()],
	[/material|finish|surface|texture/i, () => "honed travertine, warm oak timber, and matte plaster"],
	[/floor|flooring/i, () => "wide-plank natural oak hardwood"],
	[/wall|walls/i, () => "warm limewash matte plaster walls"],
	[/ceiling/i, () => "clean architectural plaster ceiling with recessed warm lighting"],
	[/furniture|seating/i, () => "tailored contemporary architectural furnishings"],
	[/building\s*type|project\s*type|typology/i, (ctx) => `${ctx.design.vertical} architecture`],
	[/location|site|context|setting|environment/i, (ctx) => ctx.hasUpload ? "the existing site context" : "a serene landscaped architectural setting"],
	[/season|weather/i, () => "clear natural daylight"],
	[/camera|angle|lens|view/i, (ctx) => ctx.hasUpload ? "the exact existing camera perspective" : "eye-level 35mm architectural perspective"],
	[/room|space/i, (ctx) => ctx.hasUpload ? "existing space" : "living space"]
];
var GENERATION_LEAD_PATTERNS = [/^(?:please\s+)?(?:visualize|create|generate|design|render|make|build|imagine|produce|craft|draw|show)\s+(?:(?:an|a|the)\b\s*)?/i, /^(?:photorealistic|hyperrealistic|ultra-detailed|architectural)\s+(?:3d\s+)?(?:rendering|render|visualization|photo|photograph|image|view)\s+of\s+(?:(?:an|a|the)\b\s*)?/i];
var PLACEHOLDER_RE = /\[([^\]]+)\]/g;
function resolveSmartPlaceholders(rawPrompt, slotValues, ctx) {
	return rawPrompt.replace(PLACEHOLDER_RE, (_match, rawKey) => {
		const key = rawKey.trim();
		const userVal = slotValues[key]?.trim();
		if (userVal) return userVal;
		for (const [pattern, resolver] of SMART_SLOT_DEFAULTS) if (pattern.test(key)) return resolver(ctx);
		return ctx.hasUpload ? "the uploaded space" : key.toLowerCase();
	}).replace(/\s+/g, " ").trim();
}
function stripGenerationLeadVerb(text) {
	let cleaned = text.trim();
	for (const pattern of GENERATION_LEAD_PATTERNS) cleaned = cleaned.replace(pattern, "").trim();
	return cleaned;
}
function buildUploadedImageLockClause(preserveClause) {
	const customKeep = preserveClause?.trim();
	if (customKeep) return `Edit the uploaded reference image directly in place — do not create a new room, building, or camera angle. ${customKeep}.`;
	return "Edit the uploaded reference image directly in place — do not create a new room, building, or camera angle. Strictly preserve the exact existing walls, window openings, door placements, ceiling structure, floor layout, and camera perspective of the uploaded photo.";
}
function rewritePromptForUploadedImage(rawPrompt, ctx) {
	const normalized = resolveSmartPlaceholders(rawPrompt, {}, ctx);
	if (!ctx.hasUpload) return normalized;
	if (/uploaded reference image|edit the uploaded|directly in place/i.test(normalized)) return normalized;
	const body = stripGenerationLeadVerb(normalized);
	return `${buildUploadedImageLockClause(ctx.preserveClause)} Apply onto the uploaded image: ${body}`.replace(/\s+/g, " ").trim();
}
function buildArchviz100AppliedPrompt(preset, ctx) {
	const cleanedPrompt = resolveSmartPlaceholders(preset.prompt, {}, ctx);
	const styleDetails = [
		preset.materials ? `Materials: ${preset.materials}` : "",
		preset.lighting ? `Lighting: ${preset.lighting}` : "",
		preset.mood ? `Mood: ${preset.mood}` : "",
		preset.palette ? `Palette: ${preset.palette}` : ""
	].filter(Boolean).join(". ");
	if (!ctx.hasUpload) return [cleanedPrompt, styleDetails].filter(Boolean).join(". ").replace(/\.\./g, ".").trim();
	const directive = stripGenerationLeadVerb(cleanedPrompt);
	return `${buildUploadedImageLockClause(ctx.preserveClause)} Apply the "${preset.title}" transformation directly onto the uploaded image (${directive}${styleDetails ? `. ${styleDetails}` : ""}).`.replace(/\.\./g, ".").replace(/\s+/g, " ").trim();
}
function buildZuke119AppliedPrompt(item, slotValues, ctx) {
	const filled = resolveSmartPlaceholders(item.prompt, slotValues, ctx);
	if (!ctx.hasUpload) return filled;
	const alreadyAnchored = /uploaded reference image|edit the uploaded|attached image|reference image/i.test(filled);
	const directive = stripGenerationLeadVerb(filled);
	const lockClause = buildUploadedImageLockClause(ctx.preserveClause);
	if (alreadyAnchored) return `${lockClause} ${filled}`.replace(/\s+/g, " ").trim();
	return `${lockClause} Apply "${item.title}" directly onto the uploaded image: ${directive}`.replace(/\s+/g, " ").trim();
}
function buildIntentLookAppliedPrompt(look, presets, ctx) {
	const fragments = look.presetIds.map((id) => presets.find((p) => p.id === id)).filter((p) => Boolean(p && !p.is_negative)).map((p) => p.fragment);
	const ruleNote = look.rules ? ` Strict rule: ${look.rules}.` : "";
	const lookSummary = `${look.name} aesthetic, ${look.light.toLowerCase()} lighting, ${look.mood.toLowerCase()} mood${fragments.length ? `, ${fragments.join(", ")}` : ""}.${ruleNote}`;
	if (!ctx.hasUpload) return `${ctx.design.look} ${look.vertical} architectural visualization — ${lookSummary}`.trim();
	return `${buildUploadedImageLockClause(ctx.preserveClause)} Restyle the uploaded image with ${lookSummary}`.replace(/\s+/g, " ").trim();
}
function buildUploadedImageSystemPrefix(geometryLock) {
	return [
		`CRITICAL PIXEL-LOCKED IMAGE-TO-IMAGE EDIT MODE (Geometry & Camera Lock ${Math.max(85, Math.min(100, Math.round(geometryLock || 92)))}%):`,
		"Modify the attached uploaded source photograph directly in place — NEVER generate a new base image, building, room, or camera angle.",
		"Preserve the exact camera position, elevation/altitude, tilt, focal length, field of view, horizon line, vanishing points, crop edges, and aspect ratio pixel-for-pixel with the attached image.",
		"Do NOT zoom, pan, crop, rotate, letterbox, or alter any structural silhouette, wall corner, window opening, roofline, or terrain contour.",
		"Apply ONLY the requested materials, lighting, atmosphere, or entourage changes directly onto the existing pixels of the uploaded photograph."
	].join(" ");
}
export { assembleBrief as $, LOOKS as A, SCENE3D_MATERIALS as B, HDRI_MOODS as C, IOPAINT_TASKS as D, IOPAINT_REMOVEBG_MODELS as E, RATIOS as F, STUDIES as G, SCOPE_LABEL as H, RELIGHT_PRESETS as I, TIMES as J, TAGS as K, RENDER_FIDELITIES as L, OUTPAINT_RATIOS as M, PEOPLE as N, IPADAPTER_PRESETS as O, RANGES as P, WORKFLOW_PRESETS as Q, RESOLUTIONS as R, GROUPS as S, IOPAINT_MODELS as T, SKETCH_MODES as U, SCENE3D_PRESETS as V, STRENGTHS as W, WEATHER as X, VERTICALS as Y, WORKFLOW_LABEL as Z, ENHANCE_MODES as _, sanitizeEngineState as _t, CAMERA_PRESETS_3D as a, computeSunPosition as at, FACADE_TYPOLOGIES as b, synthesizeFallbackComposite as bt, COLORS as c, frameAspect as ct, DEFAULT_ENGINE as d, normalizeQueueStatus as dt, buildArchviz100AppliedPrompt as et, DEFAULT_FRAME as f, pickFourFallbackPlates as ft, DISCIPLINES as g, sanitizeDesign as gt, DETAIL_DENSITIES as h, rewritePromptForUploadedImage as ht, CAMERAS as i, compileEngineBrief as it, MOODS as j, LIGHTS as k, D5_LIGHT_PRESETS as l, frameAspectNumber as lt, DETAILS as m, resolveSmartPlaceholders as mt, ADVANCED_GROUPS as n, buildUploadedImageSystemPrefix as nt, CHECKLIST as o, createQueueItem as ot, DEFAULT_SCENE3D as p, pickServerFallbackPlate as pt, TEMPLATES as q, ANNOTATOR_MODES as r, buildZuke119AppliedPrompt as rt, CLIMATE_REGIONS as s, focalLengthToFov as st, ACTIVITIES as t, buildIntentLookAppliedPrompt as tt, DEFAULT_DESIGN as u, frameEdge as ut, ESRGAN_MODELS as v, sanitizeFrame as vt, IOPAINT_FACE_MODELS as w, FOCAL_LENGTHS as x, updateQueueListStatus as xt, EXTRA_PILLS as y, sanitizeScene3DState as yt, RUN_NOTE as z };
