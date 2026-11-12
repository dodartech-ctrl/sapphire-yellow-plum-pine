import { o as __toESM } from "../_runtime.mjs";
import { A as frameAspect, C as TAGS, D as WEATHER, E as VERTICALS, N as sanitizeFrame, T as TIMES, a as COLORS, c as DETAILS, d as GROUPS, f as LIGHTS, g as RANGES, h as PEOPLE, j as frameEdge, m as MOODS, n as ADVANCED_GROUPS, p as LOOKS, r as CAMERAS, t as ACTIVITIES, u as EXTRA_PILLS, x as STRENGTHS } from "./frame-Bbmy5oak.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Camera, E as ChevronDown, T as Circle, b as Hexagon, f as SlidersHorizontal, h as MousePointer2, l as Square, m as Pencil, r as User, s as Sun, v as Layers, x as Heart, y as ImagePlus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as cn, c as readImage, i as Composer, l as generatePlate, s as useOriel } from "./router-CNCHip8V.mjs";
import { t as Compare } from "./compare-Dihke-BZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C5lHDODD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "design",
		label: "Design",
		icon: Pencil
	},
	{
		id: "camera",
		label: "Camera",
		icon: Camera
	},
	{
		id: "light",
		label: "Light",
		icon: Sun
	},
	{
		id: "human",
		label: "Human",
		icon: User
	},
	{
		id: "mood",
		label: "Mood",
		icon: Heart
	}
];
var TILES = {
	interior: [
		{
			id: "floor",
			label: "Flooring",
			image: "/viz/t08-material-junction.jpg"
		},
		{
			id: "wall",
			label: "Walls",
			image: "/viz/t09-living-room-clay-edit.jpg"
		},
		{
			id: "ceiling",
			label: "Ceiling",
			image: "/viz/t03-compact-living-room.jpg"
		},
		{
			id: "furniture",
			label: "Furniture",
			image: "/viz/t03-compact-living-room.jpg"
		},
		{
			id: "fixture",
			label: "Lighting",
			image: "/viz/t04-neighborhood-cafe.jpg"
		},
		{
			id: "openings",
			label: "Doors",
			image: "/viz/t02-sectional-arts-center.jpg"
		},
		{
			id: "kitchen",
			label: "Windows",
			image: "/viz/t05-subtropical-home.jpg"
		},
		{
			id: "decor",
			label: "Decor",
			image: "/viz/t06-urban-courtyard.jpg"
		}
	],
	exterior: [
		{
			id: "facade",
			label: "Facade",
			image: "/viz/t05-subtropical-home.jpg"
		},
		{
			id: "roof",
			label: "Roof",
			image: "/viz/t10-home-dusk-edit.jpg"
		},
		{
			id: "windows",
			label: "Windows",
			image: "/viz/t01-public-library.jpg"
		},
		{
			id: "entry",
			label: "Entrance",
			image: "/viz/t02-sectional-arts-center.jpg"
		},
		{
			id: "balcony",
			label: "Balcony",
			image: "/viz/t07-cultural-campus.jpg"
		},
		{
			id: "terrace",
			label: "Terrace",
			image: "/viz/t06-urban-courtyard.jpg"
		},
		{
			id: "drive",
			label: "Driveway",
			image: "/viz/t08-material-junction.jpg"
		},
		{
			id: "water",
			label: "Water",
			image: "/viz/t05-subtropical-home.jpg"
		}
	],
	amenities: [
		{
			id: "water",
			label: "Water",
			image: "/viz/t06-urban-courtyard.jpg"
		},
		{
			id: "wellness",
			label: "Wellness",
			image: "/viz/t04-neighborhood-cafe.jpg"
		},
		{
			id: "social",
			label: "Social",
			image: "/viz/t03-compact-living-room.jpg"
		},
		{
			id: "sport",
			label: "Sport",
			image: "/viz/t07-cultural-campus.jpg"
		},
		{
			id: "outdoor",
			label: "Outdoor",
			image: "/viz/t05-subtropical-home.jpg"
		},
		{
			id: "family",
			label: "Family",
			image: "/viz/t09-living-room-clay-edit.jpg"
		},
		{
			id: "work",
			label: "Work",
			image: "/viz/t01-public-library.jpg"
		},
		{
			id: "security",
			label: "Arrival",
			image: "/viz/t02-sectional-arts-center.jpg"
		}
	],
	landscape: [
		{
			id: "trees",
			label: "Trees",
			image: "/viz/t05-subtropical-home.jpg"
		},
		{
			id: "planting",
			label: "Planting",
			image: "/viz/t06-urban-courtyard.jpg"
		},
		{
			id: "lawn",
			label: "Lawn",
			image: "/viz/t07-cultural-campus.jpg"
		},
		{
			id: "garden",
			label: "Garden",
			image: "/viz/t10-home-dusk-edit.jpg"
		},
		{
			id: "path",
			label: "Paths",
			image: "/viz/t08-material-junction.jpg"
		},
		{
			id: "water",
			label: "Water",
			image: "/viz/t06-urban-courtyard.jpg"
		},
		{
			id: "structure",
			label: "Structure",
			image: "/viz/t02-sectional-arts-center.jpg"
		},
		{
			id: "edge",
			label: "Boundary",
			image: "/viz/t09-living-room-clay-edit.jpg"
		}
	]
};
function PropertiesPanel() {
	const design = useOriel((state) => state.design);
	const setPanel = useOriel((state) => state.setPanel);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setPick = useOriel((state) => state.setPick);
	const setTarget = useOriel((state) => state.setTarget);
	const toggleTag = useOriel((state) => state.toggleTag);
	const setAdvanced = useOriel((state) => state.setAdvanced);
	const toggleExtra = useOriel((state) => state.toggleExtra);
	const undo = useOriel((state) => state.undo);
	const redo = useOriel((state) => state.redo);
	const groups = GROUPS[design.vertical];
	const looks = LOOKS[design.vertical];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "px-3 pb-4 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[28px] border border-white bg-surface p-3 shadow-[0_18px_40px_rgba(70,48,16,0.06)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-1 py-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hexagon, { className: "size-4 text-[#b08a45]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-lg",
							children: "Design Properties"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => undo(),
							className: "ml-auto grid size-8 place-items-center rounded-full text-sm text-muted",
							"aria-label": "Undo",
							children: "↩"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => redo(),
							className: "grid size-8 place-items-center rounded-full text-sm text-muted",
							"aria-label": "Redo",
							children: "↪"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-5 gap-1 rounded-2xl bg-raised p-1",
					children: TABS.map((tab) => {
						const Icon = tab.icon;
						const active = design.panel === tab.id || tab.id === "design" && design.panel === "advanced";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPanel(tab.id),
							className: cn("flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px]", active ? "gold-fill" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), tab.label]
						}, tab.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [
						design.panel === "design" || design.panel === "advanced" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Elements"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTarget("whole"),
									className: "text-xs text-[#b08a45]",
									children: "All Elements →"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2",
								children: (TILES[design.vertical] ?? []).map((tile) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTarget(tile.id),
									className: cn("hover-tile overflow-hidden rounded-2xl border bg-white text-center", design.target === tile.id ? "border-[#d4b06a]" : "border-line"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: tile.image,
										alt: "",
										className: "h-14 w-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block px-1 py-1.5 text-[11px] text-fg",
										children: tile.label
									})]
								}, tile.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fold, {
								title: "Materials & Finishes",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hexagon, { className: "size-4 text-[#b08a45]" }),
								children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: group.label,
									value: design.picks[group.id] ?? group.options[0],
									options: group.options,
									onPick: (value) => setPick(group.id, value)
								}, group.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fold, {
								title: "Color Palette",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-4 rounded-full bg-[#d4b06a]" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: "Color",
									value: design.color,
									options: COLORS,
									onPick: (value) => setDesignField("color", value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
								title: "Look & Feel",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4 text-[#b08a45]" }),
								watch: design.look,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-2",
										children: looks.map((look) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setDesignField("look", look.name),
											className: cn("hover-tile overflow-hidden rounded-xl border text-left", design.look === look.name ? "border-[#d4b06a]" : "border-line"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: look.image,
												alt: "",
												className: "h-16 w-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block px-2 py-1.5 text-xs",
												children: look.name
											})]
										}, look.name))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
										label: "Range",
										value: design.range,
										options: RANGES,
										onPick: (value) => setDesignField("range", value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
										label: "Strength",
										value: design.strength,
										options: STRENGTHS,
										onPick: (value) => setDesignField("strength", value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
										label: "Detail",
										value: design.detail,
										options: DETAILS,
										onPick: (value) => setDesignField("detail", value)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fold, {
								title: "Tags",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-[#b08a45]",
									children: "#"
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: TAGS.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleTag(tag),
										className: cn("hover-chip h-9 rounded-full border px-3 text-sm", design.tags.includes(tag) ? "gold-fill border-transparent" : "border-line text-muted"),
										"aria-pressed": design.tags.includes(tag),
										children: tag
									}, tag))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
								title: "Advanced",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4 text-[#b08a45]" }),
								children: [ADVANCED_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: group.label,
									value: design.advanced[group.key],
									options: group.options.map((option) => option.id),
									labels: Object.fromEntries(group.options.map((option) => [option.id, option.label])),
									onPick: (value) => setAdvanced(group.key, value)
								}, group.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: EXTRA_PILLS.map((pill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleExtra(pill.id),
										className: cn("hover-chip h-9 rounded-full border px-3 text-sm", design.advanced.extras.includes(pill.id) ? "gold-fill border-transparent" : "border-line text-muted"),
										"aria-pressed": design.advanced.extras.includes(pill.id),
										children: pill.label
									}, pill.id))
								})]
							})
						] }) : null,
						design.panel === "camera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
							label: "Camera",
							value: design.camera,
							options: CAMERAS,
							onPick: (value) => setDesignField("camera", value)
						}) : null,
						design.panel === "light" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								label: "Light",
								value: design.light,
								options: LIGHTS,
								onPick: (value) => setDesignField("light", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								label: "Time",
								value: design.time,
								options: TIMES,
								onPick: (value) => setDesignField("time", value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								label: "Weather",
								value: design.weather,
								options: WEATHER,
								onPick: (value) => setDesignField("weather", value)
							})
						] }) : null,
						design.panel === "human" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
							label: "People",
							value: design.people,
							options: PEOPLE,
							onPick: (value) => setDesignField("people", value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
							label: "Activity",
							value: design.activity,
							options: ACTIVITIES,
							onPick: (value) => setDesignField("activity", value)
						})] }) : null,
						design.panel === "mood" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
							label: "Mood",
							value: design.mood,
							options: MOODS,
							onPick: (value) => setDesignField("mood", value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
							label: "Color",
							value: design.color,
							options: COLORS,
							onPick: (value) => setDesignField("color", value)
						})] }) : null
					]
				})
			]
		})
	});
}
function Fold({ title, icon, children, watch }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	const seen = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => {
		if (!watch) return;
		if (seen.current === void 0 || seen.current === watch) {
			seen.current = watch;
			return;
		}
		seen.current = watch;
		setOpen(true);
		ref.current?.scrollIntoView({ block: "nearest" });
	}, [watch]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "rounded-2xl border border-line bg-white",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((value) => !value),
			className: "hover-fold flex h-12 w-full items-center gap-2 px-3 text-sm font-medium",
			children: [
				icon,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-left",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-faint transition", open && "rotate-180") })
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4 px-3 pb-3",
			children
		}) : null]
	});
}
function ChipRow({ label, value, options, labels, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-medium uppercase tracking-wide text-faint",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-2",
		children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onPick(option),
			className: cn("hover-chip h-10 rounded-full border px-3 text-sm", value === option ? "border-lime bg-lime text-ink" : "border-line text-muted"),
			"aria-pressed": value === option,
			children: labels?.[option] ?? option
		}, option))
	})] });
}
function text(value) {
	return { content: [{
		type: "text",
		text: value
	}] };
}
function modelContext() {
	const host = globalThis;
	return host.document?.modelContext ?? host.navigator?.modelContext;
}
function registerStudioTools(signal) {
	const mc = modelContext();
	if (!mc || typeof mc.registerTool !== "function") return;
	const tools = [
		{
			name: "read_studio",
			description: "Read the current Oriel prompt, frame, and whether a source and result exist.",
			annotations: { readOnlyHint: true },
			inputSchema: {
				type: "object",
				properties: {}
			},
			async execute() {
				const state = useOriel.getState();
				return text(JSON.stringify({
					idea: state.idea,
					frame: state.frame,
					vertical: state.design.vertical,
					hasSource: Boolean(state.upload),
					hasResult: Boolean(state.plate?.url),
					credits: state.credits
				}));
			}
		},
		{
			name: "set_prompt",
			description: "Replace the studio prompt the next plate will use.",
			inputSchema: {
				type: "object",
				properties: { idea: {
					type: "string",
					description: "The design change to make."
				} },
				required: ["idea"]
			},
			async execute(input) {
				const idea = typeof input.idea === "string" ? input.idea.trim().slice(0, 800) : "";
				if (!idea) return text("Prompt was empty.");
				useOriel.getState().setIdea(idea);
				return text(`Prompt set: ${idea}`);
			}
		},
		{
			name: "set_resolution",
			description: "Set the plate aspect ratio and resolution. Preview and generation both use this frame.",
			inputSchema: {
				type: "object",
				properties: {
					ratio: {
						type: "string",
						enum: [
							"16:9",
							"4:3",
							"3:2",
							"1:1",
							"9:16"
						]
					},
					resolution: {
						type: "string",
						enum: ["1k", "2k"]
					}
				},
				required: ["ratio", "resolution"]
			},
			async execute(input) {
				const frame = sanitizeFrame({
					ratio: input.ratio,
					resolution: input.resolution
				});
				useOriel.getState().setFrame(frame);
				return text(`Frame set to ${frame.ratio} at ${frame.resolution}.`);
			}
		},
		{
			name: "set_view",
			description: "Show source, result, or compare. Compare closes when the view is set back to source or result.",
			inputSchema: {
				type: "object",
				properties: { view: {
					type: "string",
					enum: [
						"source",
						"result",
						"compare"
					]
				} },
				required: ["view"]
			},
			async execute(input) {
				const view = input.view === "result" || input.view === "compare" ? input.view : "source";
				const state = useOriel.getState();
				if (view === "compare" && (!state.upload || !state.plate?.url)) return text("Compare needs a source and a result.");
				window.dispatchEvent(new CustomEvent("oriel-view", { detail: view }));
				return text(`View set to ${view}.`);
			}
		},
		{
			name: "generate_plate",
			description: "Generate a plate at the current resolution and prompt. Spends 50 credits.",
			inputSchema: {
				type: "object",
				properties: {}
			},
			async execute() {
				const state = useOriel.getState();
				if (state.busy) return text("A plate is already generating.");
				if (state.credits < 50) return text("Not enough credits.");
				state.setBusy(true);
				try {
					const result = await generatePlate({ data: {
						idea: state.idea,
						image: state.upload ?? void 0,
						design: state.design,
						frame: state.frame
					} });
					state.setCredits(result.credits);
					state.setPlate({
						url: result.url,
						upload: state.upload ?? void 0,
						templateId: state.design.vertical,
						idea: state.idea
					});
					window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
					return text(`Plate ready at ${result.frame.ratio} ${result.frame.resolution}. ${result.credits} credits left.`);
				} catch (error) {
					return text(error instanceof Error ? error.message : "Generation failed.");
				} finally {
					useOriel.getState().setBusy(false);
				}
			}
		}
	];
	for (const tool of tools) Promise.resolve(mc.registerTool(tool, { signal })).catch(() => void 0);
}
var COPY = {
	interior: "Redesign, restyle, and visualize interior spaces with AI.",
	exterior: "Restyle facades, entries, and massing without losing the building.",
	amenities: "Stage pools, lounges, and shared rooms with the same camera.",
	landscape: "Shape gardens, paths, and planting around the architecture."
};
function WorkspacePage() {
	const design = useOriel((state) => state.design);
	const setVertical = useOriel((state) => state.setVertical);
	const setIdea = useOriel((state) => state.setIdea);
	const frame = useOriel((state) => state.frame);
	const upload = useOriel((state) => state.upload);
	const setUpload = useOriel((state) => state.setUpload);
	const plate = useOriel((state) => state.plate);
	const history = useOriel((state) => state.history);
	const setPlate = useOriel((state) => state.setPlate);
	const setTarget = useOriel((state) => state.setTarget);
	const setSelecting = useOriel((state) => state.setSelecting);
	const selecting = useOriel((state) => state.selecting);
	const chat = useOriel((state) => state.chat);
	const [view, setView] = (0, import_react.useState)("source");
	const [tool, setTool] = (0, import_react.useState)("select");
	const fileRef = (0, import_react.useRef)(null);
	const pins = GROUPS[design.vertical];
	const label = VERTICALS.find((item) => item.id === design.vertical)?.label ?? "Studio";
	const room = design.picks.room || design.picks.facade || design.picks.water || "Whole";
	const canCompare = Boolean(upload && plate?.url);
	const aspect = frameAspect(frame.ratio);
	(0, import_react.useEffect)(() => {
		const controller = new AbortController();
		registerStudioTools(controller.signal);
		function onView(event) {
			const next = event.detail;
			if (next === "source" || next === "result" || next === "compare") setView(next);
		}
		window.addEventListener("oriel-view", onView);
		return () => {
			controller.abort();
			window.removeEventListener("oriel-view", onView);
		};
	}, []);
	function showSource() {
		setView("source");
		setTool("select");
	}
	function showResult() {
		setView("result");
		setTool("select");
	}
	function showCompare() {
		if (view === "compare") {
			setView(plate?.url ? "result" : "source");
			setTool("select");
			return;
		}
		if (!canCompare) {
			toast.message(upload ? "Generate a plate, then compare it with the source." : "Add a source image, then generate a plate to compare.");
			return;
		}
		setView("compare");
		setTool("compare");
	}
	function useTool(next) {
		if (next === "compare") {
			showCompare();
			return;
		}
		setTool(next);
		if (next === "select") setSelecting(!selecting);
		if (next === "draw") {
			window.dispatchEvent(new Event("oriel-focus-idea"));
			toast.message("Edit the prompt below, then press Generate.");
		}
		if (next === "spot") {
			const order = ["whole", ...pins.map((group) => group.id)];
			const nextTarget = order[(Math.max(order.indexOf(design.target), 0) + 1) % order.length];
			setTarget(nextTarget);
			const name = nextTarget === "whole" ? "the whole frame" : pins.find((group) => group.id === nextTarget)?.label ?? nextTarget;
			toast.message(`Editing ${name}`);
		}
		if (next === "layers") toast.message(history.length ? "Earlier plates are under the frame." : "Generated plates will stack here.");
	}
	async function onFile(file) {
		if (!file) return;
		try {
			setUpload(await readImage(file, frameEdge(frame.resolution)));
			setView("source");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not read that image.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-full flex-col overflow-y-auto lg:flex-row lg:overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative min-w-0 flex-1 overflow-y-auto px-4 pb-6 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/viz/t07-cultural-campus.jpg",
					alt: "",
					className: "pointer-events-none absolute top-0 right-0 h-56 w-[46%] object-cover opacity-30 mask-[linear-gradient(90deg,transparent,black)]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar mb-4 flex gap-2 overflow-x-auto lg:hidden",
					children: VERTICALS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setVertical(item.id),
						className: cn("h-10 shrink-0 rounded-full px-3 text-sm", design.vertical === item.id ? "gold-fill" : "bg-surface text-muted"),
						children: item.label
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "relative text-[11px] font-medium tracking-[0.22em] text-[#b08a45] uppercase",
					children: "Architectural assistant"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "relative mt-1 font-serif text-4xl tracking-tight text-fg md:text-5xl",
					children: [label, " Studio"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "relative mt-2 max-w-xl text-sm text-muted",
					children: COPY[design.vertical]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-5 overflow-hidden rounded-[28px] bg-[#1c1915] shadow-[0_24px_50px_rgba(70,48,16,0.08)]",
					children: [
						view === "compare" && upload && plate?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
							before: upload,
							after: plate.url,
							beforeLabel: "Source",
							afterLabel: "Result",
							beforeAlt: "Source",
							afterAlt: "Result",
							embedded: true,
							aspect
						}) : view === "result" ? plate?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: plate.url,
							alt: "Result",
							className: "mx-auto w-full object-contain",
							style: {
								aspectRatio: aspect,
								maxHeight: "62vh"
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid min-h-72 place-items-center px-6 text-center text-sm text-[#f6efe4]",
							style: { aspectRatio: aspect },
							children: "No plate yet. Choose a resolution, then press Generate."
						}) : upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: upload,
							alt: "Source",
							className: "mx-auto w-full object-contain",
							style: {
								aspectRatio: aspect,
								maxHeight: "62vh"
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							onDragOver: (event) => event.preventDefault(),
							onDrop: (event) => {
								event.preventDefault();
								onFile(event.dataTransfer.files[0]);
							},
							className: "relative z-0 block min-h-72 w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/viz/t03-compact-living-room.jpg",
								alt: "",
								className: "max-h-[46vh] w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-0 grid place-items-center bg-rail/25 text-ink",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-rail/70 px-4 py-2 text-sm",
									children: "Drop a photo, plan, or render"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-3 left-3 z-30 flex rounded-full bg-rail/85 p-1 text-xs text-ink shadow-lg",
							children: [
								[
									"source",
									"Source",
									showSource
								],
								[
									"result",
									"Result",
									showResult
								],
								[
									"compare",
									"Compare",
									showCompare
								]
							].map(([id, label, action]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: (event) => {
									event.stopPropagation();
									action();
								},
								className: cn("h-8 rounded-full px-3 transition hover:bg-white/15 hover:text-[#f6e7c8]", view === id ? "gold-fill hover:text-[#2a1c0c]" : ""),
								children: label
							}, id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute bottom-3 left-3 z-30 inline-flex h-9 items-center gap-2 rounded-full bg-rail/80 px-3 text-xs text-ink",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5" }),
								" ",
								label,
								" · ",
								room,
								" · ",
								frame.ratio,
								" · ",
								frame.resolution.toUpperCase()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute right-3 bottom-3 z-30 flex items-center gap-1 rounded-full border border-[#e7c27a] bg-[#1a1612]/92 p-1 text-white shadow-[0_12px_28px_rgba(0,0,0,0.35)]",
							onPointerDown: (event) => event.stopPropagation(),
							onClick: (event) => event.stopPropagation(),
							children: [
								[
									"select",
									"Select an element",
									MousePointer2,
									tool === "select" && selecting
								],
								[
									"compare",
									"Compare source and result",
									Square,
									view === "compare"
								],
								[
									"draw",
									"Edit the prompt",
									Pencil,
									tool === "draw"
								],
								[
									"spot",
									"Cycle the edit target",
									Circle,
									tool === "spot"
								],
								[
									"layers",
									"Show earlier plates",
									Layers,
									tool === "layers"
								]
							].map(([id, name, Icon, active]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": name,
								"aria-pressed": active,
								onClick: (event) => {
									event.preventDefault();
									event.stopPropagation();
									useTool(id);
								},
								className: cn("grid size-9 place-items-center rounded-full text-white/90 transition hover:bg-[#e7c27a]/25 hover:text-[#f6e7c8] hover:ring-1 hover:ring-[#e7c27a]", active && "gold-fill text-[#2a1c0c] ring-1 ring-[#f3d7a1] hover:text-[#2a1c0c]"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
							}, id))
						}),
						selecting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-x-3 top-14 flex flex-wrap gap-2",
							children: pins.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTarget(group.id),
								className: cn("rounded-full px-3 py-1 text-xs", design.target === group.id ? "gold-fill" : "bg-rail/80 text-ink"),
								children: group.label
							}, group.id))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/jpeg,image/png,image/webp",
							className: "sr-only",
							suppressHydrationWarning: true,
							onChange: (event) => {
								onFile(event.target.files?.[0]);
								event.target.value = "";
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {}),
				tool === "layers" || history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2 overflow-x-auto",
					children: [history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Earlier plates will stack here after you generate."
					}) : null, history.map((url) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => plate && setPlate({
							...plate,
							url
						}),
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: url,
							alt: "",
							className: "h-16 w-24 rounded-xl border border-line object-cover"
						})
					}, url))]
				}) : null,
				chat.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: chat.slice(-3).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cn("max-w-xl rounded-2xl px-3 py-2 text-sm", line.role === "you" ? "bg-surface text-fg" : "text-muted"),
						children: line.text
					}, line.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						"Warm the lighting",
						"Keep the layout, restyle the finishes",
						"Shift the materials, hold the camera"
					].map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIdea(line),
						className: "hover-chip h-9 rounded-full border border-line bg-surface px-3 text-xs text-muted",
						children: line
					}, line))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertiesPanel, {})]
	});
}
//#endregion
export { WorkspacePage as component };
