import { o as __toESM } from "../_runtime.mjs";
import { a as RadialOpticsDock, i as Mas2dStudioBar, o as ResilientPlateImage, s as Sam3dExtrasBar } from "./studio-modes-CB56T1Tp.mjs";
import { xt as useOriel, y as NAMED_STUDIOS } from "./store-Cgkch-Vw.mjs";
import { E as buildAtelierIterationCards, i as Route$18, y as cn } from "./router-ZuzrVjzj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as Sparkles, Lt as Film, Qt as Compass, St as Images, _t as LayoutGrid, a as Workflow, bn as Armchair, bt as Landmark, cn as Camera, dn as Box, et as Paintbrush, sn as Check, un as Building2, vn as ArrowUp, vt as Layers, y as SunMoon } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/explore-BUYOz_6M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VISUAL_SCENES = [
	{
		id: "scene-pavilion-dusk",
		title: "Nordic Timber Pavilion",
		subtitle: "Cantilevered eaves · warm interior glow",
		image: "/viz/p01-pavilion-dusk.jpg",
		category: "dusk",
		vertical: "landscape",
		look: "Dusk garden",
		light: "Evening",
		prompt: "Nordic timber pavilion at dusk, warm glazed hearth, reflective terrace stones, twilight mist"
	},
	{
		id: "scene-pavilion-day",
		title: "Harbor Stone Villa",
		subtitle: "Crisp daylight · natural travertine plinth",
		image: "/viz/p01-pavilion-day.jpg",
		category: "exterior",
		vertical: "exterior",
		look: "Modern",
		light: "Soft overcast",
		prompt: "Contemporary stone and timber pavilion in soft coastal overcast daylight, clean architectural lines"
	},
	{
		id: "scene-subtropical-home",
		title: "Subtropical Courtyard House",
		subtitle: "Golden hour sun · bronze louvers",
		image: "/viz/t05-subtropical-home.jpg",
		category: "exterior",
		vertical: "exterior",
		look: "Modern",
		light: "Golden hour",
		prompt: "Subtropical modernist residence with board-formed concrete, timber soffits, palm foliage at golden hour"
	},
	{
		id: "scene-home-dusk-edit",
		title: "Fjord Nocturne Residence",
		subtitle: "Blue hour reflections · perimeter uplights",
		image: "/viz/t10-home-dusk-edit.jpg",
		category: "dusk",
		vertical: "exterior",
		look: "Dusk villa",
		light: "Night",
		prompt: "Architectural villa at blue hour with calibrated warm 2800K interior lighting and reflective terrace"
	},
	{
		id: "scene-living-room",
		title: "Compact Oak Living Atelier",
		subtitle: "Bouclé seating · soft diffused daylight",
		image: "/viz/t03-compact-living-room.jpg",
		category: "interior",
		vertical: "interior",
		look: "Modern luxury",
		light: "Daylight",
		prompt: "Minimalist architectural living room, fluted oak paneling, limewash walls, warm travertine coffee table"
	},
	{
		id: "scene-loft-after",
		title: "Industrial Gallery Loft",
		subtitle: "Double-height glazing · warm timber floor",
		image: "/viz/p02-loft-after.jpg",
		category: "interior",
		vertical: "interior",
		look: "Warm hospitality",
		light: "Golden hour",
		prompt: "Double-height adaptive reuse loft with slim dark steel mullions, oak flooring, sculptural pendant light"
	},
	{
		id: "scene-cafe-hospitality",
		title: "Neighborhood Espresso Salon",
		subtitle: "Terrazzo counter · morning window raking",
		image: "/viz/t04-neighborhood-cafe.jpg",
		category: "interior",
		vertical: "amenities",
		look: "Clubhouse",
		light: "Golden hour",
		prompt: "Warm hospitality cafe lounge with honed terrazzo bar, bentwood seating, soft morning sun rays"
	},
	{
		id: "scene-urban-courtyard",
		title: "Monolithic Pool Sanctuary",
		subtitle: "Water mirror caustics · limestone terrace",
		image: "/viz/t06-urban-courtyard.jpg",
		category: "exterior",
		vertical: "amenities",
		look: "Pool terrace",
		light: "Daylight",
		prompt: "Serene architectural courtyard lap pool clad in dark basalt, specimen olive trees, crisp shadows"
	},
	{
		id: "scene-public-library",
		title: "Civic Timber Reading Hall",
		subtitle: "Monumental glulam · clerestory light",
		image: "/viz/t01-public-library.jpg",
		category: "civic",
		vertical: "exterior",
		look: "Civic",
		light: "Daylight",
		prompt: "Public civic library hall with rhythmic timber colonnade, diffused skylighting, calm stone floor"
	},
	{
		id: "scene-cultural-campus",
		title: "Cultural Campus Plaza",
		subtitle: "Elevated oblique · landscape integration",
		image: "/viz/t07-cultural-campus.jpg",
		category: "civic",
		vertical: "landscape",
		look: "Campus green",
		light: "Soft overcast",
		prompt: "Civic cultural campus with stepped limestone amphitheater, native meadow planting, aerial perspective"
	},
	{
		id: "scene-sectional-arts",
		title: "Sectional Concrete Arts Center",
		subtitle: "Massing study · dramatic sky contrast",
		image: "/viz/t02-sectional-arts-center.jpg",
		category: "civic",
		vertical: "exterior",
		look: "Massing",
		light: "Soft overcast",
		prompt: "Sculptural concrete arts center massing, cantilevered gallery volume, soft overcast northern sky"
	},
	{
		id: "scene-clay-interior",
		title: "Clay & Material Junction",
		subtitle: "Viewport clay underlay · detail framing",
		image: "/viz/t09-living-room-clay-edit.jpg",
		category: "clay",
		vertical: "interior",
		look: "Quiet mineral",
		light: "Soft overcast",
		prompt: "Quiet mineral interior material study from 3D clay massing, honed stone and pale oak joinery"
	},
	{
		id: "scene-material-junction",
		title: "Stone & Bronze Detail",
		subtitle: "Close-up junction · micro-bump realism",
		image: "/viz/t08-material-junction.jpg",
		category: "clay",
		vertical: "interior",
		look: "Material study",
		light: "Daylight",
		prompt: "Close-up architectural material junction of brushed bronze frame, board concrete, and travertine reveal"
	},
	{
		id: "scene-loft-before",
		title: "Raw Shell Conversion",
		subtitle: "Before-state shell · structural baseline",
		image: "/viz/p02-loft-before.jpg",
		category: "clay",
		vertical: "interior",
		look: "Material study",
		light: "Soft overcast",
		prompt: "Preserve existing structural columns and window bays while restyling finishes in warm oak and plaster"
	}
];
var DISCOVER_TABS = [
	{
		id: "all",
		label: "All",
		icon: LayoutGrid
	},
	{
		id: "iterations",
		label: "Iterations",
		icon: Layers
	},
	{
		id: "scenes",
		label: "Visual Scenes",
		icon: Images
	},
	{
		id: "camera",
		label: "Camera & Optics",
		icon: Camera
	},
	{
		id: "studios",
		label: "Studios",
		icon: Workflow
	}
];
var SCENE_CATEGORIES = [
	{
		id: "all",
		label: "All Spaces",
		icon: LayoutGrid
	},
	{
		id: "exterior",
		label: "Exterior",
		icon: Building2
	},
	{
		id: "interior",
		label: "Interior",
		icon: Armchair
	},
	{
		id: "civic",
		label: "Civic & Cultural",
		icon: Landmark
	},
	{
		id: "dusk",
		label: "Dusk & Twilight",
		icon: SunMoon
	},
	{
		id: "clay",
		label: "Clay & Detail",
		icon: Layers
	}
];
var STUDIO_PREVIEW_META = {
	"sam-3d": {
		image: "/viz/t05-subtropical-home.jpg",
		icon: Box,
		badge: "3D + AI Split"
	},
	"mas-2d": {
		image: "/viz/t03-compact-living-room.jpg",
		icon: Paintbrush,
		badge: "Inpaint & Material"
	},
	"king-360": {
		image: "/viz/p01-pavilion-dusk.jpg",
		icon: Compass,
		badge: "360° Tour"
	},
	"kum-video": {
		image: "/viz/t10-home-dusk-edit.jpg",
		icon: Film,
		badge: "Motion Timeline"
	},
	"node-studio": {
		image: "/viz/t02-sectional-arts-center.jpg",
		icon: Workflow,
		badge: "DAG Pipeline"
	}
};
function HomeDiscoverDeck({ activeTab, onTabChange, plateIterationCards, activeView, activeStudio, onSelectIterationCard, onLoadVisualScene, onLaunchStudio, onOpenStage, onScrollTop }) {
	const upload = useOriel((s) => s.upload);
	const plate = useOriel((s) => s.plate);
	const [sceneCategory, setSceneCategory] = (0, import_react.useState)("all");
	const filteredScenes = (0, import_react.useMemo)(() => sceneCategory === "all" ? VISUAL_SCENES : VISUAL_SCENES.filter((sc) => sc.category === sceneCategory), [sceneCategory]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "studio-explore-deck",
		"data-testid": "home-discover-deck",
		className: "flex flex-col gap-5 pt-1 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arctic-glass sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#d1c5b8]/40 px-3 py-2 shadow-sm dark:border-[#a9bdc9]/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tablist",
					"aria-label": "Workspace discovery sections",
					className: "no-scrollbar flex max-w-full items-center gap-1 overflow-x-auto",
					children: DISCOVER_TABS.map((tab) => {
						const Icon = tab.icon;
						const active = activeTab === tab.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							role: "tab",
							"aria-selected": active,
							"data-testid": `discover-tab-${tab.id}`,
							onClick: () => onTabChange(tab.id),
							className: cn("inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-medium transition", active ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
						}, tab.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "back-to-studio-top-btn",
					onClick: onScrollTop,
					className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-[#d1c5b8]/55 bg-white/80 px-3 text-xs font-medium text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-3.5 -rotate-90 text-[#725b38] dark:text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Studio" })]
				})]
			}),
			activeTab === "all" || activeTab === "iterations" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "heading-iterations",
				className: "hf-card-reveal space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#d1c5b8]/35 bg-white/55 px-3.5 py-2.5 dark:border-[#a9bdc9]/15 dark:bg-[#121c29]/60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "heading-iterations",
							className: "font-display text-sm font-semibold tracking-tight text-[#1b1c1a] dark:text-[#fcfdff]",
							children: "Plate Iterations & Lighting Studies"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-[#7f766a] dark:text-[#a9bdc9]",
						children: "Click any card to open and preview in the Studio viewport"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"data-testid": "atelier-plate-strip",
					className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: plateIterationCards.map((card) => {
						const isSelected = Boolean(activeView === "source" ? !card.isGenerated && upload === card.url : plate?.url === card.url || !plate?.url && upload === card.url);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": card.isGenerated ? "generated-iteration-card" : "preset-iteration-card",
							onClick: () => onSelectIterationCard(card),
							className: cn("hf-card group relative overflow-hidden rounded-2xl border bg-white/85 text-left dark:bg-[#121c29]/90", isSelected ? "border-[#c5a880] ring-2 ring-[#c5a880]/70 dark:border-[#e8c98a] dark:ring-[#e8c98a]/65" : "border-[#d1c5b8]/45 hover:border-[#725b38]/60 dark:border-[#a9bdc9]/20 dark:hover:border-[#e8c98a]/50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-28 w-full overflow-hidden bg-[#08131f]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResilientPlateImage, {
										src: card.url,
										alt: card.title,
										className: "object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050f1b]/80 via-transparent to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pointer-events-none absolute top-2 left-2 z-10 rounded-full bg-[#050f1b]/80 px-2 py-0.5 font-mono text-[10px] font-medium text-[#e8eff3] backdrop-blur-md",
										children: card.tag
									}),
									isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pointer-events-none absolute top-2 right-2 z-10 grid size-5 place-items-center rounded-full bg-[#e8c98a] text-[#261a00]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" })
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between gap-2 px-3 py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
										children: card.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
										children: card.subtitle
									})]
								})
							})]
						}, card.id);
					})
				})]
			}) : null,
			activeTab === "all" || activeTab === "scenes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "heading-visual-scenes",
				"data-testid": "visual-scenes-section",
				className: "hf-card-reveal space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2.5 px-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "heading-visual-scenes",
								className: "font-display text-sm font-semibold tracking-tight text-[#1b1c1a] dark:text-[#fcfdff]",
								children: "Visual Scene Starters"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] text-[#7f766a] dark:text-[#a9bdc9]",
								children: [filteredScenes.length, " spaces"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "no-scrollbar flex max-w-full items-center gap-1.5 overflow-x-auto pb-0.5",
						children: SCENE_CATEGORIES.map((cat) => {
							const Icon = cat.icon;
							const active = sceneCategory === cat.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": `scene-cat-${cat.id}`,
								"aria-pressed": active,
								onClick: () => setSceneCategory(cat.id),
								className: cn("inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[11px] font-medium transition", active ? "border-transparent bg-[#c5a880] font-semibold text-[#281800] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/50 bg-white/80 text-[#4d463c] hover:border-[#725b38] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/85 dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.label })]
							}, cat.id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
					children: filteredScenes.map((scene) => {
						const isLoaded = upload === scene.image;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": `visual-scene-card-${scene.id}`,
							onClick: () => onLoadVisualScene(scene),
							className: cn("hf-card group relative flex flex-col overflow-hidden rounded-2xl border bg-white/85 text-left dark:bg-[#121c29]/90", isLoaded ? "border-[#c5a880] ring-2 ring-[#c5a880]/70 dark:border-[#e8c98a] dark:ring-[#e8c98a]/65" : "border-[#d1c5b8]/45 hover:border-[#725b38]/65 dark:border-[#a9bdc9]/20 dark:hover:border-[#e8c98a]/55"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[16/10] w-full overflow-hidden bg-[#08131f]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: scene.image,
										alt: scene.title,
										loading: "lazy",
										className: "h-full w-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050f1b]/90 via-[#050f1b]/15 to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "pointer-events-none absolute right-2.5 bottom-2.5 left-2.5 flex items-center justify-between gap-2 text-[10px] font-medium text-[#e8eff3]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate opacity-90",
											children: [
												scene.look,
												" · ",
												scene.light
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-[#e8c98a] backdrop-blur-md opacity-90 transition group-hover:bg-[#e8c98a] group-hover:text-[#261a00]",
											children: isLoaded ? "Active" : "Load Scene"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
									children: scene.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 truncate text-[11px] text-[#7f766a] dark:text-[#a9bdc9]",
									children: scene.subtitle
								})]
							})]
						}, scene.id);
					})
				})]
			}) : null,
			activeTab === "all" || activeTab === "camera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "heading-camera-optics",
				className: "hf-card-reveal space-y-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 px-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "heading-camera-optics",
								className: "font-display text-sm font-semibold tracking-tight text-[#1b1c1a] dark:text-[#fcfdff]",
								children: "Camera Board, CAD Intake & Radial Optics"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#7f766a] dark:text-[#a9bdc9]",
							children: "Syncs live with 3D frustum & diffusion lock"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sam3dExtrasBar, { onOpenStage }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadialOpticsDock, {}),
					activeStudio === "mas-2d" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mas2dStudioBar, { onOpenStage })
				]
			}) : null,
			activeTab === "all" || activeTab === "studios" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "heading-studios",
				className: "hf-card-reveal space-y-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 px-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "heading-studios",
							className: "font-display text-sm font-semibold tracking-tight text-[#1b1c1a] dark:text-[#fcfdff]",
							children: "Dedicated Studio Engines"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-[#7f766a] dark:text-[#a9bdc9]",
						children: "Switch modes seamlessly without losing prompt or seed"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5",
					children: NAMED_STUDIOS.map((studio) => {
						const meta = STUDIO_PREVIEW_META[studio.id];
						const Icon = meta.icon;
						const isActive = activeStudio === studio.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": `discover-studio-card-${studio.id}`,
							onClick: () => onLaunchStudio(studio.id),
							className: cn("hf-card group relative flex flex-col overflow-hidden rounded-2xl border bg-white/85 text-left dark:bg-[#121c29]/90", isActive ? "border-[#c5a880] ring-2 ring-[#c5a880]/70 dark:border-[#e8c98a] dark:ring-[#e8c98a]/65" : "border-[#d1c5b8]/45 hover:border-[#725b38]/65 dark:border-[#a9bdc9]/20 dark:hover:border-[#e8c98a]/55"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-24 w-full overflow-hidden bg-[#08131f]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: meta.image,
										alt: studio.label,
										loading: "lazy",
										className: "h-full w-full object-cover opacity-85"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050f1b]/95 via-[#050f1b]/35 to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-[#050f1b]/80 px-2 py-0.5 text-[10px] font-semibold text-[#e8c98a] backdrop-blur-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: studio.shortLabel })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-2 bottom-2 text-[10px] font-medium text-[#cfe3f0]",
										children: meta.badge
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col justify-between p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
									children: studio.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#7f766a] dark:text-[#a9bdc9]",
									children: studio.subtitle
								})]
							})]
						}, studio.id);
					})
				})]
			}) : null
		]
	});
}
function ExplorePage() {
	const { tab } = Route$18.useSearch();
	const activeTab = tab ?? "all";
	const navigate = useNavigate();
	const history = useOriel((state) => state.history);
	const plate = useOriel((state) => state.plate);
	const iterations = useOriel((state) => state.iterations);
	const activeStudio = useOriel((state) => state.activeStudio);
	const setActiveStudio = useOriel((state) => state.setActiveStudio);
	const restoreIteration = useOriel((state) => state.restoreIteration);
	const setUpload = useOriel((state) => state.setUpload);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setVertical = useOriel((state) => state.setVertical);
	const setIdea = useOriel((state) => state.setIdea);
	const metaByUrl = (0, import_react.useMemo)(() => {
		const map = {};
		for (const item of iterations) map[item.url] = {
			idea: item.idea,
			seed: item.seed,
			look: item.look,
			light: item.light,
			ratio: item.ratio,
			gateScore: item.gateScore,
			gateStatus: item.gateStatus,
			fallback: item.fallback
		};
		return map;
	}, [iterations]);
	const plateIterationCards = (0, import_react.useMemo)(() => buildAtelierIterationCards(history, plate?.url, metaByUrl), [
		history,
		plate?.url,
		metaByUrl
	]);
	function goToStudioStage(stage) {
		navigate({
			to: "/",
			search: stage ? { stage } : void 0
		});
	}
	function handleTabChange(nextTab) {
		navigate({
			to: "/explore",
			search: { tab: nextTab },
			replace: true
		});
	}
	function handleSelectIterationCard(card) {
		if (card.isGenerated) {
			restoreIteration(card.url);
			toast.success(`Restored ${card.tag}`);
			goToStudioStage("result");
		} else {
			setUpload(card.url);
			setDesignField("light", card.lightPreset);
			toast.success(`Loaded ${card.title} (${card.subtitle}) into Source frame`);
			goToStudioStage("source");
		}
	}
	function handleLoadVisualScene(scene) {
		setVertical(scene.vertical);
		setDesignField("look", scene.look);
		setDesignField("light", scene.light);
		setUpload(scene.image);
		setIdea(scene.prompt);
		toast.success(`Loaded "${scene.title}" into Studio`);
		goToStudioStage("source");
	}
	function handleLaunchStudio(studioId) {
		setActiveStudio(studioId);
		if (studioId === "sam-3d") goToStudioStage("split");
		else if (studioId === "mas-2d") goToStudioStage(useOriel.getState().plate?.url ? "result" : "mask");
		else if (studioId === "king-360") goToStudioStage("360");
		else if (studioId === "node-studio") goToStudioStage("nodes");
		else goToStudioStage();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "studio-scroll flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-20 md:px-6 md:pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-[1440px] flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 px-0.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-9 place-items-center rounded-xl bg-[#c5a880]/20 text-[#725b38] dark:bg-[#cfe3f0]/15 dark:text-[#e8c98a]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-lg font-semibold tracking-tight text-[#1b1c1a] sm:text-xl dark:text-[#fcfdff]",
						children: "Explore Workspace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#7f766a] dark:text-[#a9bdc9]",
						children: "Iterations, curated visual scene starters, radial optics, and dedicated studio pipelines"
					})] })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeDiscoverDeck, {
				activeTab,
				onTabChange: handleTabChange,
				plateIterationCards,
				activeView: "source",
				activeStudio,
				onSelectIterationCard: handleSelectIterationCard,
				onLoadVisualScene: handleLoadVisualScene,
				onLaunchStudio: handleLaunchStudio,
				onOpenStage: (stage) => goToStudioStage(stage),
				onScrollTop: () => goToStudioStage()
			})]
		})
	});
}
export { ExplorePage as component };
