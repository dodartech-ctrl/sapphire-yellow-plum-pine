import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { E as VERTICALS, M as sanitizeDesign, N as sanitizeFrame, S as STUDIES, _ as RATIOS, b as SCOPE_LABEL, d as GROUPS, j as frameEdge, l as DISCIPLINES, o as DEFAULT_DESIGN, p as LOOKS, s as DEFAULT_FRAME, v as RESOLUTIONS, w as TEMPLATES } from "./frame-w23bPEhU.mjs";
import { a as getStudioCredits, i as createSsrRpc, t as CREDIT_MAX } from "./credits-Dsn9xLgu.mjs";
import { D as Layers, F as Crown, H as BookOpen, I as Compass, N as Folder, O as ImagePlus, T as Library, U as Bell, V as Building2, g as Search, h as SlidersHorizontal, i as User, l as SwatchBook, m as Sofa, n as Waves, o as TriangleAlert, p as Sparkles, s as Trees, t as X, w as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BMrN6z9B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-lime",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-syne text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function parseInput(input) {
	const data = input;
	const idea = typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "";
	const image = typeof data.image === "string" && data.image.startsWith("data:image/") ? data.image : void 0;
	if (image && image.length > 25e5) throw new Error("That image is too large. Try a smaller photo.");
	return {
		idea,
		image,
		templateId: typeof data.templateId === "string" ? data.templateId.slice(0, 80) : void 0,
		studyId: typeof data.studyId === "string" ? data.studyId.slice(0, 80) : void 0,
		design: sanitizeDesign(data.design),
		frame: sanitizeFrame(data.frame)
	};
}
var generatePlate = createServerFn({ method: "POST" }).validator(parseInput).handler(createSsrRpc("59971a0ccc36de086fd91d2c8d337fabb9420074790beb05e8c717ef794a8f8f"));
var enhanceIdea = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return {
		idea: typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "",
		design: sanitizeDesign(data.design)
	};
}).handler(createSsrRpc("93625d71a6a82f6db479f7e153142e22888c8d7791218dad1a9aa6847d52c617"));
function readImage(file, longEdge = 1280) {
	return new Promise((resolve, reject) => {
		if (!file.type.startsWith("image/")) {
			reject(/* @__PURE__ */ new Error("Upload a JPEG, PNG, or WebP."));
			return;
		}
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that image."));
		reader.onload = () => {
			const image = new Image();
			image.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that image."));
			image.onload = () => {
				const scale = Math.min(1, longEdge / Math.max(image.width, image.height));
				const canvas = document.createElement("canvas");
				canvas.width = Math.max(1, Math.round(image.width * scale));
				canvas.height = Math.max(1, Math.round(image.height * scale));
				const context = canvas.getContext("2d");
				if (!context) {
					reject(/* @__PURE__ */ new Error("Could not read that image."));
					return;
				}
				context.drawImage(image, 0, 0, canvas.width, canvas.height);
				resolve(canvas.toDataURL("image/jpeg", .82));
			};
			image.src = String(reader.result);
		};
		reader.readAsDataURL(file);
	});
}
var DEFAULT_PILLS = {
	camera: "Eye level",
	light: "Soft overcast",
	material: "Oak and plaster",
	mood: "Quiet"
};
function remember(state, design) {
	return {
		design,
		past: [...state.past, state.design].slice(-20),
		future: []
	};
}
var useOriel = create()(persist((set, get) => ({
	favorites: [],
	boards: [{
		id: "working",
		name: "Working set"
	}],
	briefs: [],
	log: [],
	requests: [],
	draft: null,
	plate: null,
	upload: null,
	slotValues: {},
	recent: [],
	activeKey: "",
	pills: DEFAULT_PILLS,
	design: DEFAULT_DESIGN,
	idea: "",
	frame: DEFAULT_FRAME,
	credits: 4500,
	history: [],
	projects: [],
	chat: [],
	busy: false,
	selecting: false,
	past: [],
	future: [],
	toggleFavorite: (id) => set((state) => ({ favorites: state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [id, ...state.favorites] })),
	addBoard: (name) => {
		const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "board";
		const id = get().boards.some((board) => board.id === base) ? `${base}-${Date.now()}` : base;
		set((state) => ({ boards: [...state.boards, {
			id,
			name: name.trim() || "Untitled"
		}] }));
		return id;
	},
	saveBrief: (brief) => set((state) => ({ briefs: [{
		...brief,
		id: `b-${Date.now()}`,
		at: Date.now()
	}, ...state.briefs].slice(0, 48) })),
	removeBrief: (id) => set((state) => ({ briefs: state.briefs.filter((item) => item.id !== id) })),
	pushLog: (entry) => set((state) => ({ log: [{
		...entry,
		id: `l-${Date.now()}`,
		at: Date.now()
	}, ...state.log].slice(0, 30) })),
	clearLog: () => set({ log: [] }),
	setDraft: (draft) => set({ draft }),
	setPlate: (plate) => set((state) => ({
		plate,
		history: state.plate?.url && plate && state.plate.url !== plate.url ? [state.plate.url, ...state.history.filter((url) => url !== state.plate?.url)].slice(0, 8) : state.history
	})),
	setUpload: (upload) => set({ upload }),
	setSlotValues: (slotValues) => set({ slotValues }),
	touchRecent: (id) => set((state) => ({ recent: [id, ...state.recent.filter((item) => item !== id)].slice(0, 6) })),
	setActiveKey: (activeKey) => set({ activeKey }),
	setPill: (key, value) => set((state) => ({ pills: {
		...state.pills,
		[key]: value
	} })),
	setVertical: (vertical) => set((state) => {
		const look = LOOKS[vertical].some((item) => item.name === state.design.look) ? state.design.look : LOOKS[vertical][0].name;
		const picks = Object.fromEntries(GROUPS[vertical].map((group) => [group.id, state.design.picks[group.id] ?? group.options[0]]));
		return remember(state, sanitizeDesign({
			...state.design,
			vertical,
			look,
			picks,
			panel: "design",
			target: "whole"
		}));
	}),
	setPanel: (panel) => set((state) => ({ design: {
		...state.design,
		panel
	} })),
	setDesignField: (field, value) => set((state) => remember(state, sanitizeDesign({
		...state.design,
		[field]: value
	}))),
	setPick: (id, value) => set((state) => {
		const picks = {
			...state.design.picks,
			[id]: value
		};
		let rooms = state.design.rooms;
		if (state.design.vertical === "interior") {
			const room = id === "room" ? value : picks.room ?? "Living room";
			if (id === "room" && state.design.rooms[value]) Object.assign(picks, state.design.rooms[value], { room: value });
			rooms = {
				...state.design.rooms,
				[room]: { ...picks }
			};
		}
		return remember(state, sanitizeDesign({
			...state.design,
			picks,
			rooms
		}));
	}),
	setTarget: (target) => set((state) => remember(state, sanitizeDesign({
		...state.design,
		target
	}))),
	setAdvanced: (key, value) => set((state) => remember(state, sanitizeDesign({
		...state.design,
		advanced: {
			...state.design.advanced,
			[key]: value
		}
	}))),
	toggleExtra: (id) => set((state) => {
		const extras = state.design.advanced.extras.includes(id) ? state.design.advanced.extras.filter((item) => item !== id) : [...state.design.advanced.extras, id];
		return remember(state, sanitizeDesign({
			...state.design,
			advanced: {
				...state.design.advanced,
				extras
			}
		}));
	}),
	toggleTag: (tag) => set((state) => {
		const tags = state.design.tags.includes(tag) ? state.design.tags.filter((item) => item !== tag) : [...state.design.tags, tag];
		return remember(state, sanitizeDesign({
			...state.design,
			tags
		}));
	}),
	setIdea: (idea) => set({ idea }),
	setFrame: (frame) => set({ frame: sanitizeFrame(frame) }),
	setCredits: (credits) => set({ credits: Math.max(0, Math.min(5e3, Math.round(credits))) }),
	setBusy: (busy) => set({ busy }),
	setSelecting: (selecting) => set({ selecting }),
	pushChat: (role, text) => set((state) => ({ chat: [...state.chat, {
		id: `c-${Date.now()}`,
		role,
		text: text.slice(0, 240)
	}].slice(-12) })),
	saveProject: (name) => set((state) => ({ projects: [{
		id: `p-${Date.now()}`,
		name: name.trim().slice(0, 48) || "Untitled",
		design: sanitizeDesign(state.design),
		idea: state.idea,
		at: Date.now()
	}, ...state.projects].slice(0, 24) })),
	openProject: (id) => set((state) => {
		const project = state.projects.find((item) => item.id === id);
		if (!project) return state;
		return {
			design: sanitizeDesign(project.design),
			idea: project.idea,
			past: [],
			future: []
		};
	}),
	removeProject: (id) => set((state) => ({ projects: state.projects.filter((item) => item.id !== id) })),
	undo: () => set((state) => {
		const previous = state.past[state.past.length - 1];
		if (!previous) return state;
		return {
			design: previous,
			past: state.past.slice(0, -1),
			future: [state.design, ...state.future].slice(0, 20)
		};
	}),
	redo: () => set((state) => {
		const next = state.future[0];
		if (!next) return state;
		return {
			design: next,
			future: state.future.slice(1),
			past: [...state.past, state.design].slice(-20)
		};
	}),
	addRequest: (request) => set((state) => ({ requests: [{
		...request,
		id: `r-${Date.now()}`,
		at: Date.now()
	}, ...state.requests].slice(0, 12) }))
}), {
	name: "oriel-studio",
	skipHydration: true,
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({
		favorites: state.favorites,
		boards: state.boards,
		briefs: state.briefs,
		log: state.log,
		requests: state.requests,
		draft: state.draft,
		recent: state.recent,
		design: state.design,
		projects: state.projects,
		idea: state.idea,
		frame: state.frame,
		credits: state.credits
	}),
	merge: (persisted, current) => {
		const saved = persisted ?? {};
		return {
			...current,
			...saved,
			design: sanitizeDesign(saved.design),
			projects: Array.isArray(saved.projects) ? saved.projects.slice(0, 24) : [],
			idea: typeof saved.idea === "string" ? saved.idea : "",
			frame: sanitizeFrame(saved.frame),
			credits: typeof saved.credits === "number" ? Math.max(0, Math.min(5e3, saved.credits)) : 4500,
			busy: false,
			selecting: false,
			past: [],
			future: []
		};
	}
}));
function useHydrated() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		if (useOriel.persist.hasHydrated()) {
			setReady(true);
			return;
		}
		const unsub = useOriel.persist.onFinishHydration(() => {
			if (alive) setReady(true);
		});
		useOriel.persist.rehydrate();
		return () => {
			alive = false;
			unsub();
		};
	}, []);
	return ready;
}
function useGenerate() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const setPlate = useOriel((state) => state.setPlate);
	const upload = useOriel((state) => state.upload);
	const touchRecent = useOriel((state) => state.touchRecent);
	const activeKey = useOriel((state) => state.activeKey);
	const design = useOriel((state) => state.design);
	const idea = useOriel((state) => state.idea);
	const frame = useOriel((state) => state.frame);
	const credits = useOriel((state) => state.credits);
	const setCredits = useOriel((state) => state.setCredits);
	const busy = useOriel((state) => state.busy);
	const setBusy = useOriel((state) => state.setBusy);
	const pushChat = useOriel((state) => state.pushChat);
	async function generate(mode = "plate") {
		if (busy) return;
		if (credits < 50) {
			toast.error("Not enough credits.");
			return;
		}
		const studyId = activeKey.startsWith("study:") ? activeKey.slice(6) : void 0;
		const templateId = activeKey.startsWith("template:") ? activeKey.slice(9) : studyId ? void 0 : (TEMPLATES.find((item) => item.scope === design.vertical) ?? TEMPLATES[0])?.id;
		const sourceId = studyId ?? templateId ?? design.vertical;
		const note = mode === "variation" ? `${idea} Offer one distinct alternative. Keep the same brief.`.trim() : idea;
		setBusy(true);
		setCredits(credits - 50);
		pushChat("you", note || `${design.vertical} plate`);
		try {
			const result = await generatePlate({ data: {
				templateId,
				studyId,
				idea: note,
				image: upload ?? void 0,
				design,
				frame
			} });
			setCredits(result.credits);
			setPlate({
				url: result.url,
				upload: upload ?? void 0,
				templateId: sourceId,
				idea: idea.trim()
			});
			touchRecent(sourceId);
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
			pushChat("studio", mode === "variation" ? `Variation is on the strip. ${result.credits.toLocaleString()} credits left.` : `Plate is ready. ${result.credits.toLocaleString()} credits left.`);
			if (pathname !== "/") navigate({ to: "/" });
		} catch (error) {
			const wallet = await getStudioCredits().catch(() => null);
			setCredits(wallet?.credits ?? credits);
			toast.error(error instanceof Error ? error.message : "Generation failed.");
			pushChat("studio", "That plate did not come back. The credits were returned.");
		} finally {
			setBusy(false);
		}
	}
	return {
		busy,
		generate
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatWhen(at) {
	return new Date(at).toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function Composer() {
	const upload = useOriel((state) => state.upload);
	const setUpload = useOriel((state) => state.setUpload);
	const idea = useOriel((state) => state.idea);
	const setIdea = useOriel((state) => state.setIdea);
	const design = useOriel((state) => state.design);
	const frame = useOriel((state) => state.frame);
	const setFrame = useOriel((state) => state.setFrame);
	const credits = useOriel((state) => state.credits);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setPanel = useOriel((state) => state.setPanel);
	const { busy, generate } = useGenerate();
	const [enhancing, setEnhancing] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const ideaRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function focusIdea() {
			ideaRef.current?.focus();
		}
		window.addEventListener("oriel-focus-idea", focusIdea);
		return () => window.removeEventListener("oriel-focus-idea", focusIdea);
	}, []);
	async function onFile(file) {
		if (!file) return;
		try {
			setUpload(await readImage(file, frameEdge(frame.resolution)));
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not read that image.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		className: "mt-3",
		onSubmit: (event) => {
			event.preventDefault();
			generate();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[28px] border border-white bg-surface px-3 py-3 shadow-[0_18px_40px_rgba(70,48,16,0.08)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							className: "relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-raised",
							"aria-label": upload ? "Replace reference image" : "Upload a reference image",
							children: [upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: upload,
								alt: "",
								className: "h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5 text-faint" }), upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								role: "button",
								tabIndex: 0,
								onClick: (event) => {
									event.stopPropagation();
									setUpload(null);
								},
								onKeyDown: (event) => {
									if (event.key === "Enter") {
										event.stopPropagation();
										setUpload(null);
									}
								},
								className: "absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-rail text-[10px] text-ink",
								"aria-label": "Remove image",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
							}) : null]
						}),
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Your idea"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: ideaRef,
								value: idea,
								rows: 2,
								onChange: (event) => setIdea(event.target.value),
								onKeyDown: (event) => {
									if (event.key === "Enter" && !event.shiftKey) {
										event.preventDefault();
										generate();
									}
								},
								placeholder: "Redesign this space. Name the one change, the materials, and the light.",
								className: "max-h-28 min-h-14 w-full resize-none bg-transparent py-1 text-sm leading-relaxed text-fg outline-none placeholder:text-faint",
								suppressHydrationWarning: true
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-faint",
							children: "Resolution"
						}),
						RATIOS.map((ratio) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": frame.ratio === ratio,
							onClick: () => setFrame({
								...frame,
								ratio
							}),
							className: cn("hover-chip h-8 rounded-full border px-2.5 text-xs", frame.ratio === ratio ? "gold-fill border-transparent" : "border-line text-muted"),
							children: ratio
						}, ratio)),
						RESOLUTIONS.map((resolution) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": frame.resolution === resolution,
							onClick: () => setFrame({
								...frame,
								resolution
							}),
							className: cn("hover-chip h-8 rounded-full border px-2.5 text-xs uppercase", frame.resolution === resolution ? "gold-fill border-transparent" : "border-line text-muted"),
							children: resolution
						}, resolution))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: enhancing || busy,
							onClick: () => {
								setEnhancing(true);
								enhanceIdea({ data: {
									idea,
									design
								} }).then((result) => {
									setIdea(result.idea);
									toast.success("Prompt refined");
								}).catch((error) => toast.error(error instanceof Error ? error.message : "Could not enhance that idea.")).finally(() => setEnhancing(false));
							},
							className: "hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted transition disabled:opacity-60",
							children: [enhancing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Enhance Prompt"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								const looks = LOOKS[design.vertical];
								const next = looks[(looks.findIndex((item) => item.name === design.look) + 1) % looks.length].name;
								setPanel("design");
								setDesignField("look", next);
								toast.success(`Style: ${next}`);
							},
							className: "inline-flex h-9 items-center gap-1.5 rounded-full border border-[#e7c27a]/80 bg-[#f6e0b0]/40 px-3 text-xs text-fg transition hover:bg-[#f6e0b0]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwatchBook, { className: "size-3.5" }),
								" Style · ",
								design.look
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => fileRef.current?.click(),
							className: "hover-chip inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5" }), " Reference"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto grid size-9 place-items-center rounded-full text-faint",
							"aria-label": "Generation settings",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: busy || credits < 50,
							className: "gold-fill inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold disabled:opacity-60",
							children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), busy ? "Generating" : "Generate"]
						})
					]
				})
			]
		})
	});
}
var RAIL = [
	{
		icon: Sofa,
		label: "Interior",
		vertical: "interior"
	},
	{
		icon: Building2,
		label: "Exterior",
		vertical: "exterior"
	},
	{
		icon: Waves,
		label: "Amenities",
		vertical: "amenities"
	},
	{
		icon: Trees,
		label: "Landscape",
		vertical: "landscape"
	}
];
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-9 place-items-center text-[#e7c27a]",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "size-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 3.2 21 20.2H3L12 3.2Z",
				fill: "currentColor"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 8.2 16.2 17.2H7.8L12 8.2Z",
				fill: "#14110f"
			})]
		})
	});
}
function Shell() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const design = useOriel((state) => state.design);
	const credits = useOriel((state) => state.credits);
	const setCredits = useOriel((state) => state.setCredits);
	const setVertical = useOriel((state) => state.setVertical);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		getStudioCredits().then((wallet) => setCredits(wallet.credits)).catch(() => void 0);
	}, [hydrated, setCredits]);
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			const target = event.target;
			const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
			if (event.key === "/" && !typing) {
				event.preventDefault();
				setOpen(true);
			}
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen(true);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden h-full w-[232px] shrink-0 flex-col overflow-hidden bg-rail text-sand lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 px-4 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-serif text-[22px] leading-none text-[#f6efe4]",
							children: "Oriel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-[10px] uppercase tracking-[0.18em] text-[#e7c27a]",
							children: "Archviz studio"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3",
						"aria-label": "Modules",
						children: [
							RAIL.map((item) => {
								const Icon = item.icon;
								const active = pathname === "/" && design.vertical === item.vertical;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setVertical(item.vertical);
										if (pathname !== "/") navigate({ to: "/" });
									},
									className: cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", active ? "gold-glow" : "hover-rail text-[#cbbba6]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
								}, item.vertical);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/studies",
								className: cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/studies" ? "gold-glow" : "hover-rail text-[#cbbba6]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), " Studies"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/method",
								className: cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/method" ? "gold-glow" : "hover-rail text-[#cbbba6]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4" }), " Method"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-3 my-3 h-px bg-white/10" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/library",
								search: { scope: "interior" },
								className: cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/library" ? "gold-glow" : "hover-rail text-[#cbbba6]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-4" }), " Templates"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/projects",
								className: cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/projects" ? "gold-glow" : "hover-rail text-[#cbbba6]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-4" }), " Projects"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/assets",
								className: cn("flex h-11 items-center gap-2.5 rounded-full px-3 text-sm", pathname === "/assets" ? "gold-glow" : "hover-rail text-[#cbbba6]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }), " Assets Library"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/plans",
						className: "mx-3 mt-auto mb-4 rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-[#f6efe4]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2 text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4 text-[#e7c27a]" }), " Pro Plan"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-2 block text-xs text-[#cbbba6]",
								children: [
									credits.toLocaleString(),
									" / ",
									CREDIT_MAX.toLocaleString(),
									" credits"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block h-full rounded-full bg-[#e7c27a]",
									style: { width: `${Math.round(credits / CREDIT_MAX * 100)}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-3 block text-sm text-[#e7c27a]",
								children: "Upgrade Plan →"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "z-30 flex shrink-0 items-center gap-3 px-4 py-3 md:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-2 lg:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-lg text-fg",
									children: "Oriel"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "no-scrollbar hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex",
								"aria-label": "Verticals",
								children: [
									VERTICALS.map((item) => {
										const active = pathname === "/" && design.vertical === item.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setVertical(item.id);
												if (pathname !== "/") navigate({ to: "/" });
											},
											className: cn("h-10 shrink-0 rounded-full px-4 text-sm", active ? "gold-fill" : "text-fg/80"),
											children: item.label
										}, item.id);
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/studies",
										className: cn("inline-flex h-10 items-center rounded-full px-4 text-sm", pathname === "/studies" ? "gold-fill" : "text-fg/80"),
										children: "Studies"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/method",
										className: cn("inline-flex h-10 items-center rounded-full px-4 text-sm", pathname === "/method" ? "gold-fill" : "text-fg/80"),
										children: "Method"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-auto grid size-11 shrink-0 place-items-center rounded-full bg-surface shadow-sm",
								"aria-label": "Search the library",
								onClick: () => setOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "relative grid size-11 shrink-0 place-items-center rounded-full bg-surface shadow-sm",
								"aria-label": "Notices",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2.5 right-2.5 size-2 rounded-full bg-[#e07a2f]" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-full bg-[#efe4d4] text-fg",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					pathname === "/" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {
				open,
				onOpenChange: setOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "light",
				position: "bottom-center"
			})
		]
	});
}
function SearchDialog({ open, onOpenChange }) {
	const navigate = useNavigate();
	const setActiveKey = useOriel((state) => state.setActiveKey);
	const [query, setQuery] = (0, import_react.useState)("");
	const results = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		const studies = STUDIES.map((study) => ({
			id: study.id,
			kind: "study",
			title: study.title,
			meta: `${study.code} · Tested · ${SCOPE_LABEL[study.scope]}`,
			hay: `${study.title} ${study.prompt} ${study.code}`.toLowerCase()
		}));
		const templates = TEMPLATES.map((template) => ({
			id: template.id,
			kind: "template",
			title: template.title,
			meta: SCOPE_LABEL[template.scope],
			hay: `${template.title} ${template.summary} ${template.prompt}`.toLowerCase()
		}));
		return [...studies, ...templates].filter((item) => !needle || item.hay.includes(needle)).slice(0, 8);
	}, [query]);
	function go(kind, id) {
		onOpenChange(false);
		setQuery("");
		if (kind === "study") setActiveKey(`study:${id}`);
		else setActiveKey(`template:${id}`);
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-rail/45" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed top-[12vh] left-1/2 z-50 w-[min(560px,calc(100%-2rem))] -translate-x-1/2 rounded-3xl border border-line bg-surface p-3 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Search the library"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 px-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-faint" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Search studies and templates",
							className: "h-11 min-w-0 flex-1 bg-transparent text-sm outline-none",
							suppressHydrationWarning: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							className: "grid size-10 place-items-center text-faint",
							"aria-label": "Close search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 max-h-80 overflow-y-auto",
					children: results.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => go(item.kind, item.id),
						className: "flex w-full flex-col rounded-2xl px-3 py-2 text-left hover:bg-raised",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-fg",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-faint",
							children: item.meta
						})]
					}) }, `${item.kind}-${item.id}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 pt-2 text-[10px] uppercase tracking-wide text-faint",
					children: DISCIPLINES.map((item) => item.label).join(" · ")
				})
			]
		})] })
	});
}
var styles_default = "/assets/styles-Dcu26U-_.css";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Oriel — Architectural visualization studio" },
			{
				name: "description",
				content: "Compose architectural visualization briefs and adapt them for GPT Image, Midjourney, Firefly, FLUX, and Gemini."
			},
			{
				name: "theme-color",
				content: "#f4f6f8"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$7 = () => import("./routes-CTTRyQYW.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./assets-Co2T1Xv9.mjs");
var Route$6 = createFileRoute("/assets")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./library-FK6T4M8y.mjs");
var SCOPES = [
	"architecture",
	"interior",
	"exterior",
	"landscape"
];
var Route$5 = createFileRoute("/library")({
	validateSearch: (search) => ({ scope: SCOPES.includes(search.scope) ? search.scope : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./method-DMfDMB5Y.mjs");
var Route$4 = createFileRoute("/method")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./plans-jygb54X4.mjs");
var Route$3 = createFileRoute("/plans")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./projects-lQs_0MGV.mjs");
var Route$2 = createFileRoute("/projects")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./studies-B2jRgFrL.mjs");
var Route$1 = createFileRoute("/studies")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./studio-BDtVihxG.mjs");
var Route = createFileRoute("/studio")({
	validateSearch: (search) => ({
		study: typeof search.study === "string" ? search.study : void 0,
		template: typeof search.template === "string" ? search.template : void 0,
		brief: typeof search.brief === "string" ? search.brief.slice(0, 800) : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AssetsRoute: Route$6.update({
		id: "/assets",
		path: "/assets",
		getParentRoute: () => Route$8
	}),
	LibraryRoute: Route$5.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$8
	}),
	MethodRoute: Route$4.update({
		id: "/method",
		path: "/method",
		getParentRoute: () => Route$8
	}),
	PlansRoute: Route$3.update({
		id: "/plans",
		path: "/plans",
		getParentRoute: () => Route$8
	}),
	ProjectsRoute: Route$2.update({
		id: "/projects",
		path: "/projects",
		getParentRoute: () => Route$8
	}),
	StudiesRoute: Route$1.update({
		id: "/studies",
		path: "/studies",
		getParentRoute: () => Route$8
	}),
	StudioRoute: Route.update({
		id: "/studio",
		path: "/studio",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { cn as a, readImage as c, Composer as i, generatePlate as l, Route as n, formatWhen as o, Route$5 as r, useOriel as s, router_exports as t };
