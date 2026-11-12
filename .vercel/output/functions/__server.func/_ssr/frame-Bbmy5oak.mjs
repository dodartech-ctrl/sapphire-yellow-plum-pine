//#region node_modules/.nitro/vite/services/ssr/assets/frame-Bbmy5oak.js
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
	next.extras = Array.isArray(input?.extras) ? input.extras.filter((id) => typeof id === "string" && allowed.has(id)).slice(0, 8) : [...DEFAULT_ADVANCED.extras];
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
			"advanced"
		], "design"),
		picks,
		rooms: cleanRooms(input?.rooms),
		advanced: sanitizeAdvanced(input?.advanced)
	};
}
function assembleBrief(design, idea, library) {
	const clean = sanitizeDesign(design);
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
	if (idea.trim()) lines.push("", "IDEA", `${idea.trim()} Change only what this idea names.`);
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
function frameEdge(resolution) {
	return resolution === "2k" ? 2048 : 1280;
}
//#endregion
export { frameAspect as A, TAGS as C, WEATHER as D, VERTICALS as E, sanitizeDesign as M, sanitizeFrame as N, WORKFLOW_LABEL as O, STUDIES as S, TIMES as T, RATIOS as _, COLORS as a, SCOPE_LABEL as b, DETAILS as c, GROUPS as d, LIGHTS as f, RANGES as g, PEOPLE as h, CHECKLIST as i, frameEdge as j, assembleBrief as k, DISCIPLINES as l, MOODS as m, ADVANCED_GROUPS as n, DEFAULT_DESIGN as o, LOOKS as p, CAMERAS as r, DEFAULT_FRAME as s, ACTIVITIES as t, EXTRA_PILLS as u, RESOLUTIONS as v, TEMPLATES as w, STRENGTHS as x, RUN_NOTE as y };
