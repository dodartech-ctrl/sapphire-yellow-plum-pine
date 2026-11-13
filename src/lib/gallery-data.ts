export type ProjectDiscipline = "Exterior" | "Interior" | "Renovation" | "Cultural" | "Civic" | "Landscape";
export type ComparisonType = "Lighting / Relighting" | "Material Restyle" | "Adaptive Reuse" | "Masterplan Integration";

export type GalleryProject = {
  id: string;
  title: string;
  location: string;
  year: string;
  discipline: ProjectDiscipline;
  comparisonType: ComparisonType;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  beforeAlt: string;
  afterAlt: string;
  summary: string;
  architecturalIntent: string;
  keyChanges: string[];
  materialsUsed: string[];
  lightingTechnique: string;
  aspect: string;
  promptBlueprint: string;
  recommendedStyleId?: string;
  recommendedLightingId?: string;
  recommendedMoodId?: string;
};

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "gp-01-water-pavilion",
    title: "Kyoto Water Pavilion",
    location: "Kyoto, Japan",
    year: "2025",
    discipline: "Exterior",
    comparisonType: "Lighting / Relighting",
    beforeImage: "/viz/p01-pavilion-day.jpg",
    afterImage: "/viz/p01-pavilion-dusk.jpg",
    beforeLabel: "Day (Crisp Overcast)",
    afterLabel: "Dusk (Blue-Hour Twilight)",
    beforeAlt: "Minimalist concrete and glass water pavilion in morning overcast light",
    afterAlt: "Same concrete water pavilion at blue-hour twilight with 2700K interior glow and water reflections",
    summary: "Relighting study of a fair-faced concrete pavilion across day and twilight, testing the balance of exterior ambient cobalt sky against interior 2700K architectural wash.",
    architecturalIntent: "Demonstrating how a single geometric pavilion structure transforms emotionally when the sky luminance drops below the interior lighting threshold, turning the glazed volume into a luminous lantern hovering over water.",
    keyChanges: [
      "Transition from uniform 5500K overcast daylight to deep sapphire blue-hour twilight",
      "Interior cove and accent lighting activated at warm 2700K incandescent temperature",
      "Specular reflections rendered across the calm perimeter reflecting pool",
      "Granite stepping stones highlighted with concealed low-glare LED risers",
    ],
    materialsUsed: [
      "Fair-faced architectural concrete",
      "Floor-to-ceiling ultra-clear low-iron glass",
      "Flamed black granite stepping stones",
      "Smoked zinc fascia detailing",
    ],
    lightingTechnique: "Balanced blue-hour twilight with 2700K warm interior grazing and reflection mapping",
    aspect: "16 / 9",
    promptBlueprint: "Minimalist concrete pavilion over calm reflecting pool, blue hour twilight, deep cobalt sky, warm interior glow, architectural photography",
    recommendedStyleId: "minimalist-concrete-glass",
    recommendedLightingId: "blue-hour-twilight",
    recommendedMoodId: "serene-sanctuary",
  },
  {
    id: "gp-02-soho-loft",
    title: "SoHo Heritage Warehouse Loft",
    location: "New York, USA",
    year: "2025",
    discipline: "Renovation",
    comparisonType: "Adaptive Reuse",
    beforeImage: "/viz/p02-loft-before.jpg",
    afterImage: "/viz/p02-loft-after.jpg",
    beforeLabel: "Before (Raw Industrial Shell)",
    afterLabel: "After (Japandi Residence)",
    beforeAlt: "Empty raw warehouse loft with bare brick walls and concrete floor",
    afterAlt: "Transformed residential loft with bespoke white oak joinery and fluted glass",
    summary: "Complete adaptive reuse transformation of an abandoned 1920s timber and brick warehouse into a warm, refined Japandi architectural residence.",
    architecturalIntent: "Honoring the original structural framework—exposed steel beams, brick perimeter walls, and timber roof trusses—while inserting a lightweight sequence of bespoke oak joinery boxes and fluted glass partitions.",
    keyChanges: [
      "Inserted custom full-height rift-cut white oak storage walls and concealed kitchen suite",
      "Introduced a sculptural honed travertine kitchen island anchoring the open-plan zone",
      "Added fluted glass sliding room dividers providing acoustic separation with luminous diffusion",
      "Upgraded floor to wide-plank European white oak with underfloor radiant heating",
    ],
    materialsUsed: [
      "Rift-cut white oak cabinetry",
      "Honed Roman travertine monolith",
      "Fluted textured architectural glass",
      "Original restored industrial steel-framed sash windows",
    ],
    lightingTechnique: "Soft diffused daylight filtered through fluted glass with integrated joinery linear downlighting",
    aspect: "16 / 9",
    promptBlueprint: "Luxury warehouse loft interior, bespoke white oak joinery, fluted glass sliding screens, travertine island, warm minimalist residential design",
    recommendedStyleId: "japandi-minimalist",
    recommendedLightingId: "soft-overcast-diffused",
    recommendedMoodId: "intimate-warmth",
  },
  {
    id: "gp-03-living-room-plaster",
    title: "Alpine Residence Living Salon",
    location: "Zurich, Switzerland",
    year: "2024",
    discipline: "Interior",
    comparisonType: "Material Restyle",
    beforeImage: "/viz/t03-compact-living-room.jpg",
    afterImage: "/viz/t09-r1-living-room-clay-edit.jpg",
    beforeLabel: "Source (Smooth White Plaster)",
    afterLabel: "Restyle (Acoustic Clay Plaster)",
    beforeAlt: "Modern compact living room with standard smooth painted walls",
    afterAlt: "Restyled living room with hand-troweled acoustic earth plaster and warm textile palette",
    summary: "Surgical interior finish revision: holding room geometry, window mullions, and camera position static while converting flat drywall into tactile acoustic clay plaster.",
    architecturalIntent: "Testing whether a subtle change in wall finish micro-texture and pigment depth can dramatically improve acoustic intimacy and reduce harsh glare in a compact volume without remodeling the envelope.",
    keyChanges: [
      "Replaced standard latex paint with custom pigment-infused clay plaster",
      "Subtle surface trowel marks capture directional natural light from the terrace",
      "Acoustic absorption coefficient improved without adding visible foam baffles",
      "Preserved window mullions, ceiling junction, and floor plane exactly",
    ],
    materialsUsed: [
      "Hand-troweled natural clay plaster",
      "Oiled European ash timber flooring",
      "Cast bronze recessed downlight bezels",
      "Raw linen upholstery",
    ],
    lightingTechnique: "Gentle natural side-light grazing across hand-troweled wall texture",
    aspect: "16 / 9",
    promptBlueprint: "Minimalist living room, hand-troweled acoustic clay plaster walls, soft natural side lighting, muted warm earth tones, architectural photography",
    recommendedStyleId: "japandi-minimalist",
    recommendedLightingId: "soft-overcast-diffused",
    recommendedMoodId: "monastic-clarity",
  },
  {
    id: "gp-04-subtropical-dusk",
    title: "Subtropical Coastal Villa",
    location: "Noosa, Queensland",
    year: "2024",
    discipline: "Exterior",
    comparisonType: "Lighting / Relighting",
    beforeImage: "/viz/t05-subtropical-home.jpg",
    afterImage: "/viz/t10-home-dusk-edit.jpg",
    beforeLabel: "Day (Rainy Overcast)",
    afterLabel: "Dusk (Golden Hour Twilight)",
    beforeAlt: "Subtropical modern home in overcast humid daylight",
    afterAlt: "Same subtropical home during golden hour dusk with exterior illumination",
    summary: "Exterior atmosphere study examining how facade lighting, landscape bollards, and twilight amber reflections integrate with tropical flora.",
    architecturalIntent: "Balancing outdoor living pavilions and indoor spaces across a dramatic lighting shift, verifying that exterior timber battens create rhythmic shadow patterns when uplit at dusk.",
    keyChanges: [
      "Shifted from overcast humid daylight to rich late-afternoon dusk lighting",
      "Integrated subtle low-voltage LED landscape uplights illuminating palm foliage",
      "Exterior soffit grazing accentuates the warm teak ceiling overhangs",
      "Pool water surface calibrated for specular evening sky reflection",
    ],
    materialsUsed: [
      "Charred teak timber screening",
      "Poured-in-place concrete foundation",
      "Honed basalt terrace pavers",
      "Frameless low-iron glass balustrades",
    ],
    lightingTechnique: "Low-angle golden hour sunset transitioning to architectural exterior facade grazing",
    aspect: "16 / 9",
    promptBlueprint: "Contemporary coastal tropical villa, golden hour dusk lighting, illuminated teak overhangs, reflecting pool, architectural visualization",
    recommendedStyleId: "contemporary-tropical",
    recommendedLightingId: "golden-hour-raking",
    recommendedMoodId: "serene-sanctuary",
  },
  {
    id: "gp-05-civic-cultural",
    title: "Harbor Civic Library & Cultural Center",
    location: "Aarhus, Denmark",
    year: "2024",
    discipline: "Cultural",
    comparisonType: "Masterplan Integration",
    beforeImage: "/viz/t01-public-library.jpg",
    afterImage: "/viz/t07-cultural-campus.jpg",
    beforeLabel: "Concept (Individual Building)",
    afterLabel: "Masterplan (Campus & Plaza)",
    beforeAlt: "Close perspective of Nordic brick public library building",
    afterAlt: "Wide masterplan view of interconnected cultural campus with civic water plaza",
    summary: "Scale expansion study connecting a single landmark brick library with a multi-building waterfront pedestrian cultural campus.",
    architecturalIntent: "Ensuring that the architectural vocabulary of tactile Petersen brick and zinc roofs scales seamlessly from a single civic building to an entire public waterfront masterplan.",
    keyChanges: [
      "Expanded camera from eye-level perspective to elevated oblique masterplan view",
      "Integrated stepped public plazas connecting urban fabric to harbor waters",
      "Created sheltered pedestrian colonnades linking civic performance halls",
      "Consistent Nordic brick materiality maintained across all campus buildings",
    ],
    materialsUsed: [
      "Petersen Kolumba handmade clay brick",
      "Pre-patinated titanium zinc roofing",
      "Granite cobblestone civic paving",
      "Glulam timber structural frames",
    ],
    lightingTechnique: "Crisp northern European coastal daylight with clear atmospheric perspective",
    aspect: "16 / 9",
    promptBlueprint: "Waterfront cultural campus and civic library, Nordic brick architecture, zinc roofs, public harbor plaza, wide angle architectural photography",
    recommendedStyleId: "nordic-timber-civic",
    recommendedLightingId: "soft-overcast-diffused",
    recommendedMoodId: "vibrant-cosmopolitan",
  },
  {
    id: "gp-06-roastery-cafe",
    title: "Artisan Roastery & Tasting Room",
    location: "Melbourne, Australia",
    year: "2024",
    discipline: "Interior",
    comparisonType: "Material Restyle",
    beforeImage: "/viz/t04-neighborhood-cafe.jpg",
    afterImage: "/viz/t08-material-junction.jpg",
    beforeLabel: "Spatial View (Dining Area)",
    afterLabel: "Detail Crop (Material Junction)",
    beforeAlt: "Wide perspective of bustling artisan cafe with warm lighting",
    afterAlt: "Macro architectural crop of stone, brass, and wood joinery meet-point",
    summary: "Scale-transition study investigating how broad spatial atmosphere translates into millimeter-accurate material craftsmanship at the bar junction.",
    architecturalIntent: "Highlighting that high-end hospitality visualization requires both broad spatial mood and forensic tactile detailing at the human touchpoints where stone meets wood and metal.",
    keyChanges: [
      "Cropped into the 5mm shadow reveal between honed quartzite and custom walnut joinery",
      "Highlighted the patinated brass footrail fixture with precision specular glints",
      "Rendered tactile bush-hammered concrete surface texture under 3000K downlight beam",
      "Demonstrated shadow gap tolerance and flush finish alignment",
    ],
    materialsUsed: [
      "Honed Taj Mahal quartzite",
      "FSC-certified American black walnut",
      "Natural aged patinated brass",
      "Bush-hammered terrazzo flooring",
    ],
    lightingTechnique: "Focal downlighting and concealed LED kicker creating defined material shadow lines",
    aspect: "16 / 9",
    promptBlueprint: "Architectural material junction detail, honed quartzite stone meeting walnut joinery and patinated brass, shallow depth of field, macro photography",
    recommendedStyleId: "brutalist-sculptural",
    recommendedLightingId: "dramatic-chiaroscuro",
    recommendedMoodId: "monastic-clarity",
  },
];
