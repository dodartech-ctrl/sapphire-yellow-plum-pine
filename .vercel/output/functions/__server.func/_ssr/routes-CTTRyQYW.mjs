import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { n as allowedCall } from "./agent-tools-CaaKcI8V.mjs";
import { A as frameAspect, C as TAGS, D as WEATHER, E as VERTICALS, N as sanitizeFrame, T as TIMES, a as COLORS, c as DETAILS, d as GROUPS, f as LIGHTS, g as RANGES, h as PEOPLE, j as frameEdge, m as MOODS, n as ADVANCED_GROUPS, p as LOOKS, r as CAMERAS, t as ACTIVITIES, u as EXTRA_PILLS, x as STRENGTHS } from "./frame-w23bPEhU.mjs";
import { i as createSsrRpc } from "./credits-Dsn9xLgu.mjs";
import { A as Heart, B as Camera, C as Maximize2, D as Layers, E as Leaf, F as Crown, L as Cloud, M as Gem, O as ImagePlus, P as Eye, R as Circle, S as Minus, _ as Scan, a as Undo2, b as MousePointer2, c as TreePine, f as Square, h as SlidersHorizontal, i as User, j as Hash, k as Hexagon, n as Waves, r as Users, u as Sun, v as Redo2, x as Moon, y as Pencil, z as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as cn, c as readImage, i as Composer, l as generatePlate, s as useOriel } from "./router-BMrN6z9B.mjs";
import { t as Compare } from "./compare-Dihke-BZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CTTRyQYW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseHistory(input) {
	if (!Array.isArray(input)) return [];
	const items = [];
	for (const item of input.slice(0, 12)) {
		const row = item;
		const content = typeof row.content === "string" ? row.content.slice(0, 800) : "";
		if (row.role === "tool") {
			items.push({
				role: "tool",
				content,
				toolCallId: typeof row.toolCallId === "string" ? row.toolCallId.slice(0, 40) : "call_0"
			});
			continue;
		}
		if (row.role !== "assistant" || !Array.isArray(row.toolCalls)) continue;
		const toolCalls = [];
		for (const [index, call] of row.toolCalls.entries()) {
			const raw = call;
			let args = {};
			if (typeof raw.arguments === "string") try {
				args = JSON.parse(raw.arguments);
			} catch {
				args = {};
			}
			const next = allowedCall(String(raw.name ?? ""), args, index);
			if (next) toolCalls.push({
				id: typeof raw.id === "string" ? raw.id.slice(0, 40) : next.id,
				name: next.name,
				arguments: JSON.stringify(next.arguments)
			});
		}
		items.push({
			role: "assistant",
			content,
			toolCalls
		});
	}
	return items;
}
var runAgentStep = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return {
		message: typeof data.message === "string" ? data.message.trim().slice(0, 800) : "",
		state: typeof data.state === "string" ? data.state.slice(0, 1200) : "",
		history: parseHistory(data.history)
	};
}).handler(createSsrRpc("fe98c99093c4e3d274a505402118d08fd2ce84795c322935fd397e12b07ec25a"));
var VERTICAL_IDS = VERTICALS.map((item) => item.id);
function studio() {
	const state = useOriel.getState();
	return {
		ok: true,
		summary: JSON.stringify({
			idea: state.idea,
			frame: state.frame,
			vertical: state.design.vertical,
			look: state.design.look,
			hasSource: Boolean(state.upload),
			hasResult: Boolean(state.plate?.url),
			credits: state.credits,
			busy: state.busy
		})
	};
}
var TOOLS = [
	{
		name: "read_studio",
		title: "Read studio",
		description: "Read the current Oriel prompt, frame, vertical, and whether a source and result exist.",
		annotations: { readOnlyHint: true },
		inputSchema: {
			type: "object",
			properties: {}
		},
		async execute() {
			return studio();
		}
	},
	{
		name: "set_prompt",
		title: "Set prompt",
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
			if (!idea) return {
				ok: false,
				summary: "Prompt was empty."
			};
			useOriel.getState().setIdea(idea);
			return {
				ok: true,
				summary: `Prompt set: ${idea}`
			};
		}
	},
	{
		name: "set_vertical",
		title: "Set vertical",
		description: "Switch the studio between interior, exterior, amenities, and landscape.",
		inputSchema: {
			type: "object",
			properties: { vertical: {
				type: "string",
				enum: VERTICAL_IDS
			} },
			required: ["vertical"]
		},
		async execute(input) {
			const vertical = typeof input.vertical === "string" ? input.vertical : "";
			if (!VERTICAL_IDS.includes(vertical)) return {
				ok: false,
				summary: "Unknown vertical."
			};
			useOriel.getState().setVertical(vertical);
			return {
				ok: true,
				summary: `Vertical set to ${vertical}.`
			};
		}
	},
	{
		name: "set_resolution",
		title: "Set resolution",
		description: "Set the plate aspect ratio and resolution. The preview and the generation both use this frame.",
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
			return {
				ok: true,
				summary: `Frame set to ${frame.ratio} at ${frame.resolution}.`
			};
		}
	},
	{
		name: "set_view",
		title: "Set view",
		description: "Show source, result, or compare. Setting source or result closes the compare wipe.",
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
			if (view === "compare" && (!state.upload || !state.plate?.url)) return {
				ok: false,
				summary: "Compare needs a source and a result."
			};
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: view }));
			return {
				ok: true,
				summary: `View set to ${view}.`
			};
		}
	},
	{
		name: "generate_plate",
		title: "Generate plate",
		description: `Generate a plate at the current resolution and prompt. Spends 50 credits.`,
		annotations: { consequentialHint: true },
		inputSchema: {
			type: "object",
			properties: {}
		},
		async execute() {
			const state = useOriel.getState();
			if (state.busy) return {
				ok: false,
				summary: "A plate is already generating."
			};
			if (state.credits < 50) return {
				ok: false,
				summary: "Not enough credits."
			};
			state.setBusy(true);
			state.setCredits(state.credits - 50);
			try {
				const result = await generatePlate({ data: {
					idea: state.idea,
					image: state.upload ?? void 0,
					design: state.design,
					frame: state.frame
				} });
				useOriel.getState().setCredits(result.credits);
				useOriel.getState().setPlate({
					url: result.url,
					upload: state.upload ?? void 0,
					templateId: state.design.vertical,
					idea: state.idea
				});
				window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
				return {
					ok: true,
					summary: `Plate ready at ${result.frame.ratio} ${result.frame.resolution}. ${result.credits} credits left.`
				};
			} catch (error) {
				const latest = useOriel.getState();
				latest.setCredits(latest.credits + 50);
				return {
					ok: false,
					summary: error instanceof Error ? error.message : "Generation failed."
				};
			} finally {
				useOriel.getState().setBusy(false);
			}
		}
	}
];
var STUDIO_TOOL_NAMES = TOOLS.map((tool) => tool.name);
function hosts() {
	const root = globalThis;
	const found = [root.document?.modelContext, root.navigator?.modelContext].filter((item) => Boolean(item?.registerTool));
	return [...new Set(found)];
}
function webmcpAvailable() {
	return hosts().length > 0;
}
async function callStudioTool(name, input = {}) {
	const tool = TOOLS.find((item) => item.name === name);
	if (!tool) return {
		ok: false,
		summary: `Unknown tool: ${name}`
	};
	return tool.execute(input);
}
function registerStudioTools(signal) {
	const contexts = hosts();
	if (!contexts.length || signal.aborted) return;
	for (const mc of contexts) for (const tool of TOOLS) Promise.resolve(mc.registerTool(tool, { signal })).catch(() => void 0);
}
function AgentDock() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [instruction, setInstruction] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [reply, setReply] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setReady(webmcpAvailable());
	}, []);
	async function run() {
		const message = instruction.trim();
		if (!message || busy) return;
		setBusy(true);
		setSteps([]);
		setReply("");
		const history = [];
		const seen = [];
		try {
			const state = (await callStudioTool("read_studio")).summary;
			for (let round = 0; round < 3; round += 1) {
				const step = await runAgentStep({ data: {
					message,
					state,
					history
				} });
				if (!step.calls.length) {
					setReply(step.reply || "Done.");
					break;
				}
				history.push({
					role: "assistant",
					content: step.reply,
					toolCalls: step.calls
				});
				for (const call of step.calls) {
					let args = {};
					try {
						args = JSON.parse(call.arguments);
					} catch {
						args = {};
					}
					const result = await callStudioTool(call.name, args);
					seen.push({
						name: call.name,
						summary: result.summary,
						ok: result.ok
					});
					setSteps([...seen]);
					history.push({
						role: "tool",
						content: result.summary,
						toolCallId: call.id
					});
				}
				if (!step.usedModel) {
					setReply(step.reply);
					break;
				}
			}
			setReply((current) => current || "Done.");
		} catch (error) {
			setReply(error instanceof Error ? error.message : "The agent could not run.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-2xl border border-line bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((value) => !value),
			className: "hover-fold flex h-11 w-full items-center gap-2 px-3 text-left text-sm",
			"aria-expanded": open,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", ready ? "bg-[#5f8a62]" : "bg-[#d4b06a]") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "Agent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: ready ? "WebMCP connected" : "WebMCP waiting on this browser"
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-3 pb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						run();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: instruction,
						onChange: (event) => setInstruction(event.target.value),
						placeholder: "Warm the light, 16:9, 2K",
						className: "h-10 min-w-0 flex-1 rounded-full border border-line bg-white px-3 text-sm outline-none",
						"aria-label": "Instruction for the agent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy || !instruction.trim(),
						className: "gold-fill h-10 rounded-full px-4 text-sm disabled:opacity-50",
						children: busy ? "Running" : "Run"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap gap-1.5",
					children: STUDIO_TOOL_NAMES.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-full border border-line px-2 py-1 text-[11px] text-muted",
						children: name
					}, name))
				}),
				steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-1 text-xs",
					children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: step.ok ? "text-fg" : "text-[#9a3b2f]",
						children: [
							step.name,
							": ",
							step.summary
						]
					}, `${step.name}-${index}`))
				}) : null,
				reply ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: reply
				}) : null
			]
		}) : null]
	});
}
var PHOTOS = [
	["living room", "/pills/living.jpg"],
	["modern luxury", "/pills/living.jpg"],
	["bedroom", "/pills/bedroom.jpg"],
	["quiet mineral", "/pills/limewash.jpg"],
	["kitchen", "/pills/kitchen.jpg"],
	["stone island", "/pills/kitchen.jpg"],
	["timber cabinets", "/pills/kitchen.jpg"],
	["bath", "/pills/bath.jpg"],
	["freestanding tub", "/pills/bath.jpg"],
	["warm tile", "/pills/bath.jpg"],
	["dining set", "/pills/dining.jpg"],
	["dining", "/pills/dining.jpg"],
	["warm hospitality", "/pills/dining.jpg"],
	["office", "/pills/office.jpg"],
	["coworking", "/pills/office.jpg"],
	["meeting room", "/pills/office.jpg"],
	["italian marble", "/pills/marble.jpg"],
	["material study", "/pills/marble.jpg"],
	["travertine", "/pills/travertine.jpg"],
	["hardwood", "/pills/hardwood.jpg"],
	["fluted oak", "/pills/hardwood.jpg"],
	["wool", "/pills/rug.jpg"],
	["jute", "/pills/rug.jpg"],
	["silk", "/pills/rug.jpg"],
	["limewash", "/pills/limewash.jpg"],
	["matte paint", "/pills/limewash.jpg"],
	["cove light", "/pills/ceiling.jpg"],
	["coffered", "/pills/ceiling.jpg"],
	["gypsum", "/pills/ceiling.jpg"],
	["chandelier", "/pills/chandelier.jpg"],
	["sconces", "/pills/chandelier.jpg"],
	["pendants", "/pills/dining.jpg"],
	["sectional", "/pills/furniture.jpg"],
	["lounge chairs", "/pills/furniture.jpg"],
	["sheer curtains", "/pills/window.jpg"],
	["floor-to-ceiling", "/pills/window.jpg"],
	["bronze frames", "/pills/window.jpg"],
	["slim black", "/pills/window.jpg"],
	["plants", "/pills/garden.jpg"],
	["planting", "/pills/garden.jpg"],
	["biophilic", "/pills/garden.jpg"],
	["art", "/pills/decor.jpg"],
	["layered", "/pills/decor.jpg"],
	["pivot door", "/pills/door.jpg"],
	["portico", "/pills/door.jpg"],
	["canopy", "/pills/door.jpg"],
	["glass rail", "/pills/facade.jpg"],
	["dusk villa", "/pills/night.jpg"],
	["night", "/pills/night.jpg"],
	["twilight", "/pills/night.jpg"],
	["blue hour", "/pills/night.jpg"],
	["evening", "/pills/golden.jpg"],
	["golden hour", "/pills/golden.jpg"],
	["late afternoon", "/pills/golden.jpg"],
	["early morning", "/pills/golden.jpg"],
	["morning", "/pills/golden.jpg"],
	["brick", "/pills/brick.jpg"],
	["pitched", "/pills/brick.jpg"],
	["timber", "/pills/timber.jpg"],
	["green roof", "/pills/garden.jpg"],
	["infinity pool", "/pills/pool.jpg"],
	["lap pool", "/pills/pool.jpg"],
	["pool edge", "/pills/pool.jpg"],
	["pool terrace", "/pills/pool.jpg"],
	["resort", "/pills/pool.jpg"],
	["spa", "/pills/bath.jpg"],
	["fountain", "/pills/pool.jpg"],
	["pergola", "/pills/garden.jpg"],
	["planters", "/pills/garden.jpg"],
	["clay pavers", "/pills/travertine.jpg"],
	["gravel", "/pills/travertine.jpg"],
	["palms", "/pills/garden.jpg"],
	["shade trees", "/pills/garden.jpg"],
	["ornamental", "/pills/garden.jpg"],
	["shrubs", "/pills/garden.jpg"],
	["flowering", "/pills/garden.jpg"],
	["hedge", "/pills/garden.jpg"],
	["meadow", "/pills/garden.jpg"],
	["clipped lawn", "/pills/garden.jpg"],
	["tropical", "/pills/garden.jpg"],
	["formal", "/pills/garden.jpg"],
	["courtyard", "/pills/garden.jpg"],
	["campus green", "/pills/garden.jpg"],
	["dusk garden", "/pills/night.jpg"],
	["stone", "/pills/travertine.jpg"],
	["concrete", "/pills/facade.jpg"],
	["metal", "/pills/facade.jpg"],
	["glass", "/pills/facade.jpg"],
	["modern", "/pills/facade.jpg"],
	["civic", "/pills/brick.jpg"],
	["clubhouse", "/pills/dining.jpg"],
	["lounge", "/pills/living.jpg"],
	["restaurant", "/pills/dining.jpg"],
	["gym", "/pills/office.jpg"],
	["yoga deck", "/pills/garden.jpg"],
	["fire pit", "/pills/golden.jpg"],
	["outdoor kitchen", "/pills/kitchen.jpg"],
	["playground", "/pills/garden.jpg"],
	["lawn", "/pills/garden.jpg"],
	["gate", "/pills/door.jpg"],
	["lobby", "/pills/living.jpg"],
	["path lights", "/pills/night.jpg"],
	["uplights", "/pills/night.jpg"],
	["luxury", "/pills/living.jpg"],
	["ultra luxury", "/pills/living.jpg"],
	["villa", "/pills/night.jpg"],
	["residential", "/pills/facade.jpg"],
	["quiet", "/pills/bedroom.jpg"],
	["warm", "/pills/golden.jpg"],
	["dramatic", "/pills/night.jpg"],
	["serene", "/pills/garden.jpg"],
	["vibrant", "/pills/garden.jpg"],
	["daylight", "/pills/facade.jpg"],
	["soft overcast", "/pills/facade.jpg"],
	["overcast", "/pills/facade.jpg"],
	["midday", "/pills/facade.jpg"],
	["bright midday", "/pills/facade.jpg"],
	["clear", "/pills/facade.jpg"],
	["cloudy", "/pills/facade.jpg"],
	["clouds", "/pills/facade.jpg"],
	["mist", "/pills/garden.jpg"],
	["haze", "/pills/garden.jpg"],
	["after rain", "/pills/garden.jpg"],
	["spring", "/pills/garden.jpg"],
	["summer", "/pills/pool.jpg"],
	["autumn", "/pills/timber.jpg"],
	["winter", "/pills/facade.jpg"],
	["greenery", "/pills/garden.jpg"],
	["limestone", "/pills/travertine.jpg"],
	["approach", "/pills/facade.jpg"],
	["facade", "/pills/facade.jpg"],
	["commercial", "/pills/facade.jpg"],
	["real estate", "/pills/living.jpg"],
	["editorial", "/pills/brick.jpg"],
	["sunset gold", "/pills/golden.jpg"],
	["hero dramatic", "/pills/night.jpg"],
	["hero clean", "/pills/living.jpg"],
	["swimming", "/pills/pool.jpg"],
	["sitting", "/pills/furniture.jpg"],
	["walking", "/pills/garden.jpg"],
	["working", "/pills/office.jpg"]
].sort((a, b) => b[0].length - a[0].length);
var COLOR_SWATCH = {
	"Warm white": "#f3eadb",
	Sand: "#d7c09a",
	Oak: "#a56b3c",
	Charcoal: "#3c3835",
	Sage: "#8ea58b",
	"Ink blue": "#1d3d5c"
};
function imageFor(label) {
	const key = label.toLowerCase();
	return PHOTOS.find(([name]) => key.includes(name))?.[1];
}
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
			image: "/pills/marble.jpg"
		},
		{
			id: "wall",
			label: "Walls",
			image: "/pills/limewash.jpg"
		},
		{
			id: "ceiling",
			label: "Ceiling",
			image: "/pills/ceiling.jpg"
		},
		{
			id: "furniture",
			label: "Furniture",
			image: "/pills/furniture.jpg"
		},
		{
			id: "fixture",
			label: "Lighting",
			image: "/pills/chandelier.jpg"
		},
		{
			id: "openings",
			label: "Doors",
			image: "/pills/door.jpg"
		},
		{
			id: "kitchen",
			label: "Windows",
			image: "/pills/window.jpg"
		},
		{
			id: "decor",
			label: "Decor",
			image: "/pills/decor.jpg"
		}
	],
	exterior: [
		{
			id: "facade",
			label: "Facade",
			image: "/pills/facade.jpg"
		},
		{
			id: "roof",
			label: "Roof",
			image: "/pills/brick.jpg"
		},
		{
			id: "windows",
			label: "Windows",
			image: "/pills/window.jpg"
		},
		{
			id: "entry",
			label: "Entrance",
			image: "/pills/door.jpg"
		},
		{
			id: "balcony",
			label: "Balcony",
			image: "/pills/facade.jpg"
		},
		{
			id: "terrace",
			label: "Terrace",
			image: "/pills/garden.jpg"
		},
		{
			id: "drive",
			label: "Driveway",
			image: "/pills/travertine.jpg"
		},
		{
			id: "water",
			label: "Water",
			image: "/pills/pool.jpg"
		}
	],
	amenities: [
		{
			id: "water",
			label: "Water",
			image: "/pills/pool.jpg"
		},
		{
			id: "wellness",
			label: "Wellness",
			image: "/pills/bath.jpg"
		},
		{
			id: "social",
			label: "Social",
			image: "/pills/dining.jpg"
		},
		{
			id: "sport",
			label: "Sport",
			image: "/pills/garden.jpg"
		},
		{
			id: "outdoor",
			label: "Outdoor",
			image: "/pills/garden.jpg"
		},
		{
			id: "family",
			label: "Family",
			image: "/pills/living.jpg"
		},
		{
			id: "work",
			label: "Work",
			image: "/pills/office.jpg"
		},
		{
			id: "security",
			label: "Arrival",
			image: "/pills/door.jpg"
		}
	],
	landscape: [
		{
			id: "trees",
			label: "Trees",
			image: "/pills/garden.jpg"
		},
		{
			id: "planting",
			label: "Planting",
			image: "/pills/garden.jpg"
		},
		{
			id: "lawn",
			label: "Lawn",
			image: "/pills/garden.jpg"
		},
		{
			id: "garden",
			label: "Garden",
			image: "/pills/garden.jpg"
		},
		{
			id: "path",
			label: "Paths",
			image: "/pills/travertine.jpg"
		},
		{
			id: "water",
			label: "Water",
			image: "/pills/pool.jpg"
		},
		{
			id: "structure",
			label: "Structure",
			image: "/pills/timber.jpg"
		},
		{
			id: "edge",
			label: "Boundary",
			image: "/pills/brick.jpg"
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
							className: "ml-auto grid size-8 place-items-center rounded-full text-muted",
							"aria-label": "Undo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => redo(),
							className: "grid size-8 place-items-center rounded-full text-muted",
							"aria-label": "Redo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo2, { className: "size-4" })
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
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "size-4 text-[#b08a45]" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: TAGS.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleTag(tag),
										className: cn("hover-chip inline-flex h-11 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm", design.tags.includes(tag) ? "gold-fill border-transparent" : "border-line text-muted"),
										"aria-pressed": design.tags.includes(tag),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillMark, { label: tag }), tag]
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
									children: EXTRA_PILLS.map((pill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => toggleExtra(pill.id),
										className: cn("hover-chip inline-flex h-11 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm", design.advanced.extras.includes(pill.id) ? "gold-fill border-transparent" : "border-line text-muted"),
										"aria-pressed": design.advanced.extras.includes(pill.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillMark, { label: pill.label }), pill.label]
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
function iconFor(label) {
	const key = label.toLowerCase();
	if (key.includes("none") || key.includes("unchanged") || key.includes("keep") || key.includes("unspecified")) return Minus;
	if (key.includes("ultra") || key.includes("luxury") || key.includes("premium")) return Crown;
	if (key.includes("basic") || key.includes("standard")) return Gem;
	if (key.includes("eye")) return Eye;
	if (key.includes("wide")) return Maximize2;
	if (key.includes("close") || key.includes("detail") || key.includes("micro")) return Scan;
	if (key.includes("crowd") || key.includes("people") || key.includes("medium")) return Users;
	if (key.includes("few")) return User;
	if (key.includes("cloud") || key.includes("mist") || key.includes("haze") || key.includes("rain")) return Cloud;
	if (key.includes("night") || key.includes("evening")) return Moon;
	if (key.includes("day") || key.includes("morning") || key.includes("sun") || key.includes("light")) return Sun;
	if (key.includes("tree") || key.includes("plant") || key.includes("garden") || key.includes("green")) return TreePine;
	if (key.includes("leaf") || key.includes("season")) return Leaf;
	if (key.includes("pool") || key.includes("water") || key.includes("swim")) return Waves;
	return Hexagon;
}
function PillMark({ label }) {
	const swatch = COLOR_SWATCH[label];
	const image = swatch ? void 0 : imageFor(label);
	if (swatch) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "size-8 shrink-0 rounded-full border border-black/10",
		style: { background: swatch }
	});
	if (image) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: image,
		alt: "",
		className: "size-8 shrink-0 rounded-full object-cover"
	});
	const Icon = iconFor(label);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-8 shrink-0 place-items-center rounded-full bg-raised text-[#b08a45]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
	});
}
function ChipRow({ label, value, options, labels, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-medium uppercase tracking-wide text-faint",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-2",
		children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onPick(option),
			className: cn("hover-chip inline-flex h-11 items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm", value === option ? "border-lime bg-lime text-ink" : "border-line text-muted"),
			"aria-pressed": value === option,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PillMark, { label: labels?.[option] ?? option }), labels?.[option] ?? option]
		}, option))
	})] });
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentDock, {}),
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
