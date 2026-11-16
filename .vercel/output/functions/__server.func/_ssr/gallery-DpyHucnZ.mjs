import { o as __toESM } from "../_runtime.mjs";
import { t as Compare } from "./compare-CIGWHWPX.mjs";
import { t as PanoramaViewer } from "./panorama-viewer-DlJNC2ab.mjs";
import { F as decodeReviewPinsParam, L as encodeReviewPinsParam, nt as useOriel } from "./store-DhXBZ9GM.mjs";
import { E as cn, v as readImage } from "./router-BiPrL9zA.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as Share2, Bt as Copy, Ct as Funnel, E as SlidersVertical, Ht as Compass, M as Search, Ut as Columns2, X as Paintbrush, Zt as Check, at as MapPin, gt as ImagePlus, i as X, it as Maximize2, jt as Eye, m as Trash2, nt as MessageSquarePlus, o as WandSparkles, w as Split } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/gallery-DpyHucnZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GALLERY_PROJECTS = [
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
			"Granite stepping stones highlighted with concealed low-glare LED risers"
		],
		materialsUsed: [
			"Fair-faced architectural concrete",
			"Floor-to-ceiling ultra-clear low-iron glass",
			"Flamed black granite stepping stones",
			"Smoked zinc fascia detailing"
		],
		lightingTechnique: "Balanced blue-hour twilight with 2700K warm interior grazing and reflection mapping",
		aspect: "16 / 9",
		promptBlueprint: "Minimalist concrete pavilion over calm reflecting pool, blue hour twilight, deep cobalt sky, warm interior glow, architectural photography",
		recommendedStyleId: "minimalist-concrete-glass",
		recommendedLightingId: "blue-hour-twilight",
		recommendedMoodId: "serene-sanctuary"
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
			"Upgraded floor to wide-plank European white oak with underfloor radiant heating"
		],
		materialsUsed: [
			"Rift-cut white oak cabinetry",
			"Honed Roman travertine monolith",
			"Fluted textured architectural glass",
			"Original restored industrial steel-framed sash windows"
		],
		lightingTechnique: "Soft diffused daylight filtered through fluted glass with integrated joinery linear downlighting",
		aspect: "16 / 9",
		promptBlueprint: "Luxury warehouse loft interior, bespoke white oak joinery, fluted glass sliding screens, travertine island, warm minimalist residential design",
		recommendedStyleId: "japandi-minimalist",
		recommendedLightingId: "soft-overcast-diffused",
		recommendedMoodId: "intimate-warmth"
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
			"Preserved window mullions, ceiling junction, and floor plane exactly"
		],
		materialsUsed: [
			"Hand-troweled natural clay plaster",
			"Oiled European ash timber flooring",
			"Cast bronze recessed downlight bezels",
			"Raw linen upholstery"
		],
		lightingTechnique: "Gentle natural side-light grazing across hand-troweled wall texture",
		aspect: "16 / 9",
		promptBlueprint: "Minimalist living room, hand-troweled acoustic clay plaster walls, soft natural side lighting, muted warm earth tones, architectural photography",
		recommendedStyleId: "japandi-minimalist",
		recommendedLightingId: "soft-overcast-diffused",
		recommendedMoodId: "monastic-clarity"
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
			"Pool water surface calibrated for specular evening sky reflection"
		],
		materialsUsed: [
			"Charred teak timber screening",
			"Poured-in-place concrete foundation",
			"Honed basalt terrace pavers",
			"Frameless low-iron glass balustrades"
		],
		lightingTechnique: "Low-angle golden hour sunset transitioning to architectural exterior facade grazing",
		aspect: "16 / 9",
		promptBlueprint: "Contemporary coastal tropical villa, golden hour dusk lighting, illuminated teak overhangs, reflecting pool, architectural visualization",
		recommendedStyleId: "contemporary-tropical",
		recommendedLightingId: "golden-hour-raking",
		recommendedMoodId: "serene-sanctuary"
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
			"Consistent Nordic brick materiality maintained across all campus buildings"
		],
		materialsUsed: [
			"Petersen Kolumba handmade clay brick",
			"Pre-patinated titanium zinc roofing",
			"Granite cobblestone civic paving",
			"Glulam timber structural frames"
		],
		lightingTechnique: "Crisp northern European coastal daylight with clear atmospheric perspective",
		aspect: "16 / 9",
		promptBlueprint: "Waterfront cultural campus and civic library, Nordic brick architecture, zinc roofs, public harbor plaza, wide angle architectural photography",
		recommendedStyleId: "nordic-timber-civic",
		recommendedLightingId: "soft-overcast-diffused",
		recommendedMoodId: "vibrant-cosmopolitan"
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
			"Demonstrated shadow gap tolerance and flush finish alignment"
		],
		materialsUsed: [
			"Honed Taj Mahal quartzite",
			"FSC-certified American black walnut",
			"Natural aged patinated brass",
			"Bush-hammered terrazzo flooring"
		],
		lightingTechnique: "Focal downlighting and concealed LED kicker creating defined material shadow lines",
		aspect: "16 / 9",
		promptBlueprint: "Architectural material junction detail, honed quartzite stone meeting walnut joinery and patinated brass, shallow depth of field, macro photography",
		recommendedStyleId: "brutalist-sculptural",
		recommendedLightingId: "dramatic-chiaroscuro",
		recommendedMoodId: "monastic-clarity"
	}
];
function GalleryPage() {
	const navigate = useNavigate();
	const setIdea = useOriel((state) => state.setIdea);
	const history = useOriel((state) => state.history);
	const upload = useOriel((state) => state.upload);
	const plate = useOriel((state) => state.plate);
	const publishedGallery = useOriel((state) => state.publishedGallery);
	const removePublishedProject = useOriel((state) => state.removePublishedProject);
	const setReviewPins = useOriel((state) => state.setReviewPins);
	const setUpload = useOriel((state) => state.setUpload);
	const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
	const [selectedDiscipline, setSelectedDiscipline] = (0, import_react.useState)("All");
	const [selectedComparisonType, setSelectedComparisonType] = (0, import_react.useState)("All");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [projectDisplayModes, setProjectDisplayModes] = (0, import_react.useState)({});
	const [activeModalProject, setActiveModalProject] = (0, import_react.useState)(null);
	const [customBefore, setCustomBefore] = (0, import_react.useState)(upload || "/viz/p01-pavilion-day.jpg");
	const [customAfter, setCustomAfter] = (0, import_react.useState)(plate?.url || "/viz/p01-pavilion-dusk.jpg");
	const beforeInputRef = (0, import_react.useRef)(null);
	const afterInputRef = (0, import_react.useRef)(null);
	const allProjects = (0, import_react.useMemo)(() => {
		return [...publishedGallery.map((p) => ({
			id: p.id,
			title: p.title,
			location: p.location,
			year: p.year,
			discipline: p.discipline,
			comparisonType: p.comparisonType,
			beforeImage: p.beforeImage,
			afterImage: p.afterImage,
			beforeLabel: p.beforeLabel,
			afterLabel: p.afterLabel,
			beforeAlt: `${p.title} before`,
			afterAlt: `${p.title} after`,
			summary: p.summary,
			architecturalIntent: `${p.summary} (${p.engineMeta})`,
			keyChanges: [p.engineMeta, p.lightingTechnique],
			materialsUsed: p.materialsUsed.length ? p.materialsUsed : ["Architectural concrete", "Warm oak"],
			lightingTechnique: p.lightingTechnique,
			aspect: p.aspect,
			promptBlueprint: p.promptBlueprint,
			isUserPublished: true
		})), ...GALLERY_PROJECTS];
	}, [publishedGallery]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const sp = new URLSearchParams(window.location.search);
		const rev = sp.get("review");
		const pid = sp.get("project");
		if (rev) {
			const decoded = decodeReviewPinsParam(rev);
			if (decoded.length > 0) setReviewPins(decoded);
		}
		if (pid) {
			const match = allProjects.find((p) => p.id === pid);
			if (match) setActiveModalProject(match);
		}
	}, [allProjects, setReviewPins]);
	const filteredProjects = (0, import_react.useMemo)(() => {
		return allProjects.filter((proj) => {
			const matchDiscipline = selectedDiscipline === "All" || proj.discipline === selectedDiscipline;
			const matchType = selectedComparisonType === "All" || proj.comparisonType === selectedComparisonType;
			const q = searchQuery.trim().toLowerCase();
			const matchQuery = !q || proj.title.toLowerCase().includes(q) || proj.location.toLowerCase().includes(q) || proj.summary.toLowerCase().includes(q) || proj.materialsUsed.some((m) => m.toLowerCase().includes(q));
			return matchDiscipline && matchType && matchQuery;
		});
	}, [
		allProjects,
		selectedDiscipline,
		selectedComparisonType,
		searchQuery
	]);
	function setProjectMode(projectId, mode) {
		setProjectDisplayModes((prev) => ({
			...prev,
			[projectId]: mode
		}));
	}
	function handleSendToBuilder(project) {
		toast.success(`Loaded "${project.title}" into Brief Builder`);
		navigate({ to: "/builder" });
	}
	function handleSendToStudio(project) {
		setIdea(project.promptBlueprint);
		toast.success(`Loaded prompt blueprint for "${project.title}"`);
		navigate({ to: "/" });
	}
	async function handleCustomFile(file, target) {
		if (!file) return;
		try {
			const dataUrl = await readImage(file, 1920);
			if (target === "before") setCustomBefore(dataUrl);
			else setCustomAfter(dataUrl);
			toast.success(`Updated custom ${target} image`);
		} catch {
			toast.error("Could not process uploaded image.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-full flex-col overflow-y-auto bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "shrink-0 border-b border-line bg-surface/80 px-4 py-6 backdrop-blur-md md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium tracking-[0.2em] text-[#b08a45] uppercase",
										children: "Archviz Archive"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-faint",
										"aria-hidden": "true",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "Comparative Case Studies"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-serif text-3xl font-bold tracking-tight text-fg md:text-5xl",
								children: "Project Gallery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-2xl text-xs text-muted md:text-sm",
								children: "Explore architectural visualization commissions, material restyles, and lighting studies with interactive split-slider before/after comparisons."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									document.getElementById("sandbox-section")?.scrollIntoView({ behavior: "smooth" });
								},
								className: "inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-raised px-4 text-xs font-medium text-muted transition hover:border-[#d4b06a] hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "size-3.5" }), "Custom Split Sandbox"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void navigate({ to: "/builder" }),
								className: "gold-fill inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5" }), "Brief Builder"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full lg:max-w-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: searchQuery,
									onChange: (e) => setSearchQuery(e.target.value),
									placeholder: "Search projects, materials, cities…",
									className: "h-10 w-full rounded-full border border-line bg-raised pr-4 pl-9 text-xs text-fg outline-none transition focus:border-[#d4b06a]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-xs text-faint",
									children: "Discipline:"
								}), [
									"All",
									"Exterior",
									"Interior",
									"Renovation",
									"Cultural"
								].map((disc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedDiscipline(disc),
									className: cn("hover-chip shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition", selectedDiscipline === disc ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-raised text-muted"),
									children: disc
								}, disc))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-xs text-faint",
									children: "Study Type:"
								}), [
									"All",
									"Lighting / Relighting",
									"Material Restyle",
									"Adaptive Reuse"
								].map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedComparisonType(type),
									className: cn("hover-chip shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition", selectedComparisonType === type ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-raised text-muted"),
									children: type
								}, type))]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto w-full max-w-7xl flex-1 p-4 md:p-8",
				children: filteredProjects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-3xl border border-dashed border-line p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-8 text-faint" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-serif text-lg font-semibold text-fg",
							children: "No matching projects found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Try adjusting your search terms or clearing active filters."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setSelectedDiscipline("All");
								setSelectedComparisonType("All");
								setSearchQuery("");
							},
							className: "mt-4 rounded-full border border-line bg-raised px-4 py-2 text-xs font-medium text-fg hover:border-[#d4b06a]",
							children: "Reset Filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-8 lg:grid-cols-2",
					children: filteredProjects.map((project) => {
						const displayMode = projectDisplayModes[project.id] ?? "slider";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative overflow-hidden bg-[#1c1915]",
								children: [
									displayMode === "slider" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
										before: project.beforeImage,
										after: project.afterImage,
										beforeLabel: project.beforeLabel,
										afterLabel: project.afterLabel,
										beforeAlt: project.beforeAlt,
										afterAlt: project.afterAlt,
										embedded: true,
										aspect: project.aspect
									}),
									displayMode === "before" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative aspect-[16/9] w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: project.beforeImage,
											alt: project.beforeAlt,
											className: "h-full w-full object-contain"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute top-3 left-3 rounded-full bg-black/75 px-3 py-1 text-xs text-white",
											children: project.beforeLabel
										})]
									}),
									displayMode === "after" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative aspect-[16/9] w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: project.afterImage,
											alt: project.afterAlt,
											className: "h-full w-full object-contain"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute top-3 left-3 rounded-full bg-[#b08a45] px-3 py-1 text-xs font-medium text-[#2a1c0c]",
											children: project.afterLabel
										})]
									}),
									displayMode === "side" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid aspect-[16/9] grid-cols-2 gap-1 bg-black p-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative overflow-hidden",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: project.beforeImage,
												alt: project.beforeAlt,
												className: "h-full w-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute bottom-2 left-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] text-white",
												children: project.beforeLabel
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative overflow-hidden",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: project.afterImage,
												alt: project.afterAlt,
												className: "h-full w-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute bottom-2 left-2 rounded-full bg-[#b08a45] px-2 py-0.5 text-[10px] font-medium text-[#2a1c0c]",
												children: project.afterLabel
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-3 right-3 z-30 flex items-center gap-1 rounded-full bg-[#14110f]/85 p-1 text-xs text-white shadow-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setProjectMode(project.id, "slider"),
												className: cn("flex h-7 items-center gap-1 rounded-full px-2.5 transition", displayMode === "slider" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80"),
												title: "Interactive Slider",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Split, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden sm:inline",
													children: "Slider"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setProjectMode(project.id, "side"),
												className: cn("flex h-7 items-center gap-1 rounded-full px-2.5 transition", displayMode === "side" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80"),
												title: "Side by Side",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden sm:inline",
													children: "Side"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setProjectMode(project.id, "before"),
												className: cn("flex h-7 items-center rounded-full px-2 transition", displayMode === "before" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80"),
												title: "View Before",
												children: "Before"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setProjectMode(project.id, "after"),
												className: cn("flex h-7 items-center rounded-full px-2 transition", displayMode === "after" ? "gold-fill text-[#2a1c0c]" : "hover:bg-white/10 text-white/80"),
												title: "View After",
												children: "After"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setActiveModalProject(project),
										className: "absolute bottom-3 right-3 z-30 grid size-8 place-items-center rounded-full bg-[#14110f]/80 text-white/90 shadow-md backdrop-blur-xs transition hover:bg-[#b08a45] hover:text-[#2a1c0c]",
										title: "Inspect full case study",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-4" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2 text-xs text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-[#b08a45]",
												children: project.discipline
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
													" ",
													project.location
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.year }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												children: "·"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-faint",
												children: project.comparisonType
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 font-serif text-2xl font-bold tracking-tight text-fg",
										children: project.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs leading-relaxed text-muted",
										children: project.summary
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 rounded-2xl border border-line/60 bg-raised/50 p-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-semibold text-fg uppercase tracking-wider",
											children: "Comparative Directives:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-2 space-y-1.5 text-xs text-muted",
											children: project.keyChanges.slice(0, 3).map((change) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-start gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-1.5 shrink-0 rounded-full bg-[#d4b06a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: change })]
											}, change))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex flex-wrap items-center gap-1.5",
										children: project.materialsUsed.map((mat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] text-faint",
											children: mat
										}, mat))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setActiveModalProject(project),
											className: "inline-flex items-center gap-1 text-xs font-semibold text-fg hover:text-[#b08a45]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), "Full Specification & Study"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												project.isUserPublished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														removePublishedProject(project.id);
														toast.message("Removed published render from Gallery");
													},
													className: "grid size-8 place-items-center rounded-full border border-line bg-raised text-muted hover:text-red-600",
													title: "Remove published render",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => handleSendToStudio(project),
													className: "hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted",
													title: "Open prompt blueprint in Studio",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3" }), "To Studio"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => handleSendToBuilder(project),
													className: "gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold",
													title: "Load style & lighting into Brief Builder",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3" }), "Build Vision"]
												})
											]
										})]
									})
								]
							})]
						}, project.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "sandbox-section",
				className: "border-t border-line bg-surface px-4 py-12 md:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium tracking-[0.2em] text-[#b08a45] uppercase",
									children: "Interactive Comparison Lab"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-serif text-3xl font-bold text-fg",
									children: "Custom Before / After Split Sandbox"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 max-w-2xl text-xs text-muted md:text-sm",
									children: "Upload your own source and rendered plates or select past iterations to test comparative tolerance, color drift, and edge retention."
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => beforeInputRef.current?.click(),
										className: "hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 text-xs text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5" }), "Upload Before Image"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => afterInputRef.current?.click(),
										className: "hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 text-xs text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5" }), "Upload After Image"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: beforeInputRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (e) => void handleCustomFile(e.target.files?.[0], "before")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: afterInputRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (e) => void handleCustomFile(e.target.files?.[0], "after")
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 overflow-hidden rounded-3xl border border-line bg-[#1c1915] shadow-lg",
							children: customBefore && customAfter ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
								before: customBefore,
								after: customAfter,
								beforeLabel: "Source / Baseline",
								afterLabel: "Render / Iteration",
								beforeAlt: "Custom comparison source",
								afterAlt: "Custom comparison target",
								embedded: true,
								aspect: "16 / 9"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-80 place-items-center text-sm text-[#f6efe4]",
								children: "Upload or select two plates to launch the split slider comparison."
							})
						}),
						history.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-faint",
								children: "Recent Studio Plates:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-2 overflow-x-auto pb-1",
								children: history.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setCustomAfter(url),
									className: "hover-tile shrink-0 overflow-hidden rounded-xl border border-line bg-raised",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: url,
										alt: `History plate ${i}`,
										className: "h-14 w-20 object-cover"
									})
								}, url))
							})]
						})
					]
				})
			}),
			activeModalProject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectInspectorModal, {
				project: activeModalProject,
				onClose: () => setActiveModalProject(null),
				onSendToBuilder: () => handleSendToBuilder(activeModalProject),
				onSendToStudio: () => handleSendToStudio(activeModalProject),
				onSendPinToInpaint: (pin) => {
					const c = document.createElement("canvas");
					c.width = 1280;
					c.height = 720;
					const ctx = c.getContext("2d");
					if (ctx) {
						ctx.fillStyle = "rgba(212, 176, 106, 0.85)";
						ctx.beginPath();
						ctx.arc(pin.xNorm * 1280, pin.yNorm * 720, 86, 0, Math.PI * 2);
						ctx.fill();
						setMaskDataUrl(c.toDataURL("image/png"));
					}
					setUpload(activeModalProject.afterImage);
					setIdea(pin.note);
					setActiveModalProject(null);
					toast.success(`Review Pin #${pin.number} mask sent to Studio Inpaint`);
					navigate({
						to: "/",
						search: { pinInpaint: "1" }
					});
				}
			})
		]
	});
}
function ProjectInspectorModal({ project, onClose, onSendToBuilder, onSendToStudio, onSendPinToInpaint }) {
	const reviewPins = useOriel((state) => state.reviewPins);
	const addReviewPin = useOriel((state) => state.addReviewPin);
	const toggleReviewPinStatus = useOriel((state) => state.toggleReviewPinStatus);
	const removeReviewPin = useOriel((state) => state.removeReviewPin);
	const [copiedPrompt, setCopiedPrompt] = (0, import_react.useState)(false);
	const [viewerMode, setViewerMode] = (0, import_react.useState)("compare");
	const [pendingPt, setPendingPt] = (0, import_react.useState)(null);
	const [pinAuthor, setPinAuthor] = (0, import_react.useState)("Principal Architect");
	const [pinNote, setPinNote] = (0, import_react.useState)("");
	const reviewSurfaceRef = (0, import_react.useRef)(null);
	const projectPins = (0, import_react.useMemo)(() => reviewPins.filter((p) => p.projectId === project.id), [reviewPins, project.id]);
	async function handleCopyPrompt() {
		try {
			await navigator.clipboard.writeText(project.promptBlueprint);
			setCopiedPrompt(true);
			toast.success("Prompt blueprint copied to clipboard");
			setTimeout(() => setCopiedPrompt(false), 2e3);
		} catch {
			toast.error("Could not copy prompt.");
		}
	}
	async function handleCopyReviewLink() {
		try {
			const encoded = encodeReviewPinsParam(projectPins);
			const url = `${window.location.origin}/gallery?project=${encodeURIComponent(project.id)}${encoded ? `&review=${encoded}` : ""}`;
			await navigator.clipboard.writeText(url);
			toast.success("Shareable Client Review link copied!");
		} catch {
			toast.error("Could not copy review link.");
		}
	}
	function handleReviewSurfaceClick(e) {
		if (!reviewSurfaceRef.current) return;
		const rect = reviewSurfaceRef.current.getBoundingClientRect();
		const xNorm = Math.max(.03, Math.min(.97, (e.clientX - rect.left) / Math.max(1, rect.width)));
		const yNorm = Math.max(.03, Math.min(.97, (e.clientY - rect.top) / Math.max(1, rect.height)));
		setPendingPt({
			xNorm,
			yNorm
		});
	}
	function submitReviewPin(e) {
		e.preventDefault();
		if (!pendingPt || !pinNote.trim()) return;
		addReviewPin({
			projectId: project.id,
			xNorm: pendingPt.xNorm,
			yNorm: pendingPt.yNorm,
			author: pinAuthor.trim() || "Client Reviewer",
			note: pinNote.trim(),
			status: "open"
		});
		setPendingPt(null);
		setPinNote("");
		toast.success("Added review annotation pin");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#b08a45]",
								children: project.discipline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.location }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.year })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-bold text-fg",
						children: project.title
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 rounded-full bg-raised p-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setViewerMode("compare"),
									className: cn("h-7 rounded-full px-3 font-medium", viewerMode === "compare" ? "gold-fill text-[#2a1c0c]" : "text-muted"),
									children: "Split Compare"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setViewerMode("review"),
									className: cn("inline-flex h-7 items-center gap-1 rounded-full px-3 font-medium", viewerMode === "review" ? "gold-fill text-[#2a1c0c]" : "text-muted"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "size-3" }),
										" Review Pins (",
										projectPins.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setViewerMode("360"),
									className: cn("inline-flex h-7 items-center gap-1 rounded-full px-3 font-medium", viewerMode === "360" ? "gold-fill text-[#2a1c0c]" : "text-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3" }), " 360° Tour"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "grid size-9 place-items-center rounded-full text-muted transition hover:bg-raised hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6 overflow-y-auto p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-2xl border border-line bg-[#1c1915] shadow-inner",
							children: viewerMode === "360" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanoramaViewer, {
								imageUrl: project.afterImage,
								aspect: project.aspect
							}) : viewerMode === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: reviewSurfaceRef,
								onClick: handleReviewSurfaceClick,
								className: "relative cursor-crosshair select-none",
								style: { aspectRatio: project.aspect },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: project.afterImage,
										alt: project.afterAlt,
										className: "h-full w-full object-contain"
									}),
									projectPins.map((pin) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											left: `${pin.xNorm * 100}%`,
											top: `${pin.yNorm * 100}%`
										},
										title: `${pin.author}: ${pin.note}`,
										className: cn("absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-xs font-bold shadow-lg", pin.status === "resolved" ? "border-emerald-200 bg-emerald-600 text-white" : "border-[#2a1c0c] bg-[#e7c27a] text-[#2a1c0c]"),
										children: pin.number
									}, pin.id)),
									pendingPt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											left: `${pendingPt.xNorm * 100}%`,
											top: `${pendingPt.yNorm * 100}%`
										},
										className: "absolute grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-amber-500 text-xs font-bold text-black shadow-lg",
										children: "+"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pointer-events-none absolute top-3 left-3 rounded-full bg-[#14110f]/90 px-3 py-1 text-[11px] text-[#e7c27a]",
										children: "Click anywhere on the plate to drop a numbered client review pin"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
								before: project.beforeImage,
								after: project.afterImage,
								beforeLabel: project.beforeLabel,
								afterLabel: project.afterLabel,
								beforeAlt: project.beforeAlt,
								afterAlt: project.afterAlt,
								embedded: true,
								aspect: project.aspect
							})
						}),
						viewerMode === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 rounded-2xl border border-line bg-raised p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-base font-semibold text-fg",
										children: "Client Review Annotations"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: handleCopyReviewLink,
										className: "hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-medium text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-3.5 text-[#b08a45]" }), " Copy Shareable Review Link"]
									})]
								}),
								pendingPt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: submitReviewPin,
									className: "flex flex-wrap items-center gap-2 rounded-xl border border-[#d4b06a] bg-surface p-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: pinAuthor,
											onChange: (e) => setPinAuthor(e.target.value),
											placeholder: "Reviewer",
											className: "h-8 w-36 rounded-lg border border-line bg-raised px-2.5 text-fg outline-none focus:border-[#d4b06a]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: pinNote,
											onChange: (e) => setPinNote(e.target.value),
											placeholder: "Markup note (e.g. Change cladding to charred cedar)",
											className: "h-8 min-w-[200px] flex-1 rounded-lg border border-line bg-raised px-2.5 text-fg outline-none focus:border-[#d4b06a]",
											autoFocus: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "submit",
											className: "gold-fill h-8 rounded-full px-3.5 font-semibold text-[#2a1c0c]",
											children: "Save Pin"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setPendingPt(null),
											className: "h-8 rounded-full border border-line px-3 text-muted",
											children: "Cancel"
										})
									]
								}) : null,
								projectPins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "No pins yet. Click anywhere on the render above to place pin #1."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: projectPins.map((pin) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid size-6 shrink-0 place-items-center rounded-full bg-[#e7c27a] font-bold text-[#2a1c0c]",
												children: pin.number
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-fg",
												children: pin.note
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-faint",
												children: [
													pin.author,
													" · ",
													pin.status === "resolved" ? "Resolved" : "Open"
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => onSendPinToInpaint(pin),
													className: "gold-fill inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold text-[#2a1c0c]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3" }), " Send Pin → Inpaint"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => toggleReviewPinStatus(pin.id),
													className: "h-7 rounded-full border border-line px-2.5 text-[11px] text-muted hover:text-fg",
													children: pin.status === "open" ? "Mark Resolved" : "Reopen"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => removeReviewPin(pin.id),
													className: "grid size-7 place-items-center rounded-full text-faint hover:text-rose-600",
													"aria-label": "Delete pin",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
												})
											]
										})]
									}, pin.id))
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-lg font-semibold text-fg",
							children: "Architectural Intent & Directives"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: project.architecturalIntent
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-line bg-raised p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold text-fg uppercase tracking-wider",
									children: "Comparative Directives"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-2 text-xs text-muted",
									children: project.keyChanges.map((change) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-1.5 shrink-0 rounded-full bg-[#d4b06a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: change })]
									}, change))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-line bg-raised p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-semibold text-fg uppercase tracking-wider",
										children: "Lighting & Material Science"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-xs leading-relaxed text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-fg",
												children: "Illumination:"
											}),
											" ",
											project.lightingTechnique
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-xs text-fg",
											children: "Material Palette:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-1.5 space-y-1 text-xs text-muted",
											children: project.materialsUsed.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["— ", m] }, m))
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-line bg-raised p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold text-fg uppercase tracking-wider",
									children: "Prompt Blueprint"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleCopyPrompt,
									className: "hover-chip inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted",
									children: [copiedPrompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), copiedPrompt ? "Copied" : "Copy Blueprint"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-xs text-fg/90 select-all",
								children: project.promptBlueprint
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 items-center justify-between border-t border-line px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "rounded-full border border-line px-4 py-2 text-xs text-muted hover:text-fg",
						children: "Close Inspector"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								onClose();
								onSendToStudio();
							},
							className: "hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-raised px-4 text-xs font-medium text-muted hover:text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5" }), "Open in Studio"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								onClose();
								onSendToBuilder();
							},
							className: "gold-fill inline-flex h-9 items-center gap-1.5 rounded-full px-5 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5" }), "Load into Brief Builder"]
						})]
					})]
				})
			]
		})
	});
}
export { GalleryPage as component };
