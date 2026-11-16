import { o as __toESM } from "../_runtime.mjs";
import { n as previewPathRewrite } from "./preview-path-prefix-C1diDO-n.mjs";
import { A as computeBatchProgress, C as buildHouseStyleProfile, N as createAutoBuildQueuePlan, V as getMarketCategoryStats, W as getQueueItemVisualMeta, b as buildBatchMatrixSpecs, d as MARKET_AUTOPILOT_PACKS, f as MARKET_BENCHMARKS, m as MARKET_SUGGESTION_CATEGORIES, nt as useOriel, p as MARKET_SUGGESTIONS, tt as useHydrated, z as filterMarketSuggestions } from "./store-DhXBZ9GM.mjs";
import { A as LOOKS, F as RATIOS, G as STUDIES, H as SCOPE_LABEL, Q as WORKFLOW_PRESETS, R as RESOLUTIONS, Y as VERTICALS, a as CAMERA_PRESETS_3D, dt as sanitizeEngineState, ft as sanitizeFrame, g as DISCIPLINES, k as LIGHTS, lt as pickServerFallbackPlate, mt as synthesizeFallbackComposite, ot as frameEdge, pt as sanitizeScene3DState, q as TEMPLATES, st as normalizeQueueStatus, ut as sanitizeDesign } from "./fallback-render-kleyA0ad.mjs";
import { a as getStudioCredits, i as createSsrRpc, t as CREDIT_MAX } from "./credits-D_Tww0gf.mjs";
import { C as toCompactDataUrlForSegmentation, O as __exportAll, S as runTiledUpscalePass, a as refineMaskBuffer, b as runRestoreFacesPlugin, g as runLocalTextureReplacePass, h as runLocalPaintByExample, l as runDirectionalOutpaintPad, m as runLocalLamaErasePass, p as runLocalAnyText, s as runClientOutpaintCanvas, v as runRelightWeatherPass, y as runRemoveBgPlugin } from "./cv-pipeline-CPCThvbt.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as appendSuggestionToIdea, l as getMidLayerPresetById, r as MID_LAYER_PRESETS } from "./archviz-dictionary-BdT_Lv3z.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createFileRoute, b as useNavigate, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as SlidersHorizontal, H as Play, Ht as Compass, It as Download, J as PanelLeftClose, Jt as CircleAlert, Kt as Clock, Lt as Crown, M as Search, Qt as Camera, R as RotateCcw, S as Square, T as Sparkles, V as Plus, Vt as Contrast, Xt as ChevronDown, Y as Palette, Yt as ChevronUp, Zt as Check, _ as Sun, a as Workflow, bt as Grid2x2, ct as LoaderCircle, dt as Library, ft as LayoutGrid, gt as ImagePlus, h as SwatchBook, ht as Images, i as X, in as Bell, m as Trash2, nn as BookOpen, o as WandSparkles, on as Armchair, p as TriangleAlert, pt as Layers, q as PanelLeftOpen, qt as CircleCheck, r as Zap, rt as Menu, tt as MessageSquare, ut as Lightbulb, wt as Folder } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/utils-BPtpUp2a.js
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
// node_modules/.nitro/vite/services/ssr/assets/generate-DF-7lLVi.js
function cleanDataUrl(value) {
	if (typeof value !== "string" || !value.startsWith("data:image/")) return void 0;
	if (value.length > 25e5) throw new Error("That image is too large. Try a smaller photo.");
	return value;
}
function cleanDictionaryBlocks(value) {
	if (!Array.isArray(value)) return void 0;
	return value.filter((id) => typeof id === "string" && id.length <= 64).slice(0, 64);
}
function cleanDictionaryParams(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return void 0;
	const out = {};
	for (const [blockId, entry] of Object.entries(value).slice(0, 32)) {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
		const row = {};
		for (const [k, v] of Object.entries(entry).slice(0, 12)) if (typeof v === "string") row[k.slice(0, 40)] = v.slice(0, 400);
		if (Object.keys(row).length > 0) out[blockId.slice(0, 64)] = row;
	}
	return out;
}
function parseInput(input) {
	const data = input;
	return {
		idea: typeof data.idea === "string" ? data.idea.trim().slice(0, 1200) : "",
		image: cleanDataUrl(data.image),
		sketchImage: cleanDataUrl(data.sketchImage),
		maskImage: cleanDataUrl(data.maskImage),
		depthImage: cleanDataUrl(data.depthImage),
		normalImage: cleanDataUrl(data.normalImage),
		clayImage: cleanDataUrl(data.clayImage),
		annotatorImage: cleanDataUrl(data.annotatorImage),
		styleRefImage: cleanDataUrl(data.styleRefImage),
		materialRefImage: cleanDataUrl(data.materialRefImage),
		lightingRefImage: cleanDataUrl(data.lightingRefImage),
		exampleRefImage: cleanDataUrl(data.exampleRefImage),
		houseStyleDirective: typeof data.houseStyleDirective === "string" ? data.houseStyleDirective.slice(0, 500) : void 0,
		templateId: typeof data.templateId === "string" ? data.templateId.slice(0, 80) : void 0,
		studyId: typeof data.studyId === "string" ? data.studyId.slice(0, 80) : void 0,
		dictionaryBlocks: cleanDictionaryBlocks(data.dictionaryBlocks),
		dictionaryParams: cleanDictionaryParams(data.dictionaryParams),
		design: sanitizeDesign(data.design),
		frame: sanitizeFrame(data.frame),
		engine: sanitizeEngineState(data.engine),
		scene3d: sanitizeScene3DState(data.scene3d)
	};
}
var generatePlate = createServerFn({ method: "POST" }).validator(parseInput).handler(createSsrRpc("59971a0ccc36de086fd91d2c8d337fabb9420074790beb05e8c717ef794a8f8f"));
var generateVariations = createServerFn({ method: "POST" }).validator(parseInput).handler(createSsrRpc("f40bbf6df3672110cff53c266c5def91e8bb97ddb689d1d22995561ce3723814"));
var segmentObjectWithSam2 = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	const cp = data.clickPoint && typeof data.clickPoint === "object" && typeof data.clickPoint.xNorm === "number" && typeof data.clickPoint.yNorm === "number" ? {
		xNorm: Math.max(0, Math.min(1, Number(data.clickPoint.xNorm))),
		yNorm: Math.max(0, Math.min(1, Number(data.clickPoint.yNorm)))
	} : void 0;
	return {
		image: cleanDataUrl(data.image),
		prompt: typeof data.prompt === "string" ? data.prompt.trim().slice(0, 120) : "architectural element",
		clickPoint: cp
	};
}).handler(createSsrRpc("037e055ad6815023db80de12590a5949bca56a79dd279edcbc8488806038d614"));
var inpaintPlate = createServerFn({ method: "POST" }).validator(parseInput).handler(createSsrRpc("d5fac5773d220c85e2ff9e6587fa77a4305f5ce3330a44cfb848036672ded511"));
var enhancePlate = createServerFn({ method: "POST" }).validator(parseInput).handler(createSsrRpc("944a4a4b92de36fdddb21e29a99ad8ed445a5d30f920324e781fa6de501356ec"));
var relightPlate = createServerFn({ method: "POST" }).validator(parseInput).handler(createSsrRpc("3aa4774a98dde2188f519b06cea522ac413b9eceb98d3c50b0a36001a741fa82"));
var outpaintPlate = createServerFn({ method: "POST" }).validator(parseInput).handler(createSsrRpc("a9a820a09f8d4439537588257104fbf39812809b3801dbb0fc1f5cfa0d370865"));
var enhanceIdea = createServerFn({ method: "POST" }).validator((input) => {
	const data = input;
	return {
		idea: typeof data.idea === "string" ? data.idea.trim().slice(0, 800) : "",
		design: sanitizeDesign(data.design)
	};
}).handler(createSsrRpc("93625d71a6a82f6db479f7e153142e22888c8d7791218dad1a9aa6847d52c617"));
// node_modules/.nitro/vite/services/ssr/assets/read-image-Cm2SCzoo.js
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
// node_modules/.nitro/vite/services/ssr/assets/router-BiPrL9zA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var queueStopRequested = false;
function useGenerate() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const setPlate = useOriel((state) => state.setPlate);
	const setVariations = useOriel((state) => state.setVariations);
	const upload = useOriel((state) => state.upload);
	const sketchDataUrl = useOriel((state) => state.sketchDataUrl);
	const maskDataUrl = useOriel((state) => state.maskDataUrl);
	const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
	const binaryMaskDataUrl = useOriel((state) => state.binaryMaskDataUrl);
	const setBinaryMaskData = useOriel((state) => state.setBinaryMaskData);
	const conditioningChannels = useOriel((state) => state.conditioningChannels);
	const houseStyles = useOriel((state) => state.houseStyles);
	const plate = useOriel((state) => state.plate);
	const touchRecent = useOriel((state) => state.touchRecent);
	const activeKey = useOriel((state) => state.activeKey);
	const design = useOriel((state) => state.design);
	const engine = useOriel((state) => state.engine);
	const scene3d = useOriel((state) => state.scene3d);
	const midLayerPreset = useOriel((state) => state.midLayerPreset);
	const dictionaryBlocks = useOriel((state) => state.dictionaryBlocks);
	const dictionaryParams = useOriel((state) => state.dictionaryParams);
	const idea = useOriel((state) => state.idea);
	const frame = useOriel((state) => state.frame);
	const credits = useOriel((state) => state.credits);
	const setCredits = useOriel((state) => state.setCredits);
	const busy = useOriel((state) => state.busy);
	const setBusy = useOriel((state) => state.setBusy);
	const batchRunning = useOriel((state) => state.batchRunning);
	const setBatchRunning = useOriel((state) => state.setBatchRunning);
	const pushChat = useOriel((state) => state.pushChat);
	const pushLog = useOriel((state) => state.pushLog);
	const enqueueRender = useOriel((state) => state.enqueueRender);
	const enqueueBatchMatrix = useOriel((state) => state.enqueueBatchMatrix);
	const setEngineField = useOriel((state) => state.setEngineField);
	function resolveRefs() {
		const studyId = activeKey.startsWith("study:") ? activeKey.slice(6) : void 0;
		const templateId = activeKey.startsWith("template:") ? activeKey.slice(9) : studyId ? void 0 : (TEMPLATES.find((item) => item.scope === design.vertical) ?? TEMPLATES[0])?.id;
		return {
			studyId,
			templateId,
			sourceId: studyId ?? templateId ?? design.vertical
		};
	}
	function buildConditioningPayload() {
		const st = useOriel.getState();
		const activeStyle = st.houseStyles.find((h) => h.id === st.engine.houseStyleId);
		const toDataOnly = (v) => v && v.startsWith("data:image/") ? v : void 0;
		return {
			depthImage: toDataOnly(st.conditioningChannels.depth),
			normalImage: toDataOnly(st.conditioningChannels.normal),
			clayImage: toDataOnly(st.conditioningChannels.clay),
			annotatorImage: toDataOnly(st.conditioningChannels.annotator),
			styleRefImage: toDataOnly(st.engine.refMatrix.massing.url ?? st.engine.ipAdapterRefUrl),
			materialRefImage: toDataOnly(st.engine.refMatrix.material.url),
			lightingRefImage: toDataOnly(st.engine.refMatrix.lighting.url),
			houseStyleDirective: activeStyle?.promptDirective
		};
	}
	async function generate(mode = "plate") {
		if (busy) return;
		if (mode === "plate" && engine.outputMode === "grid-4") {
			await generateGrid();
			return;
		}
		if (credits < 50) {
			toast.error("Not enough credits.");
			return;
		}
		const { studyId, templateId, sourceId } = resolveRefs();
		const note = mode === "variation" ? `${idea} Offer one distinct alternative. Keep the same brief.`.trim() : idea;
		setBusy(true);
		pushChat("you", note || `${design.vertical} plate`);
		try {
			const result = await generatePlate({ data: {
				templateId,
				studyId,
				idea: note,
				image: upload ?? void 0,
				sketchImage: sketchDataUrl ?? void 0,
				maskImage: maskDataUrl ?? void 0,
				...buildConditioningPayload(),
				dictionaryBlocks,
				dictionaryParams,
				design,
				frame,
				engine,
				scene3d
			} });
			setCredits(result.credits);
			let finalUrl = result.url;
			if (result.fallback && (upload || sketchDataUrl)) finalUrl = await synthesizeFallbackComposite({
				baseImage: upload ?? void 0,
				sketchImage: sketchDataUrl ?? void 0,
				maskImage: maskDataUrl ?? void 0,
				serverFallbackUrl: result.url,
				design,
				engine,
				scene3d,
				variantIndex: mode === "variation" ? 1 : 0
			});
			setPlate({
				url: finalUrl,
				upload: upload ?? void 0,
				templateId: sourceId,
				idea: idea.trim(),
				fallback: result.fallback,
				seed: result.seed,
				summary: result.summary
			});
			touchRecent(sourceId);
			pushLog({
				title: `${design.look} · ${design.vertical}${midLayerPreset ? ` (${midLayerPreset})` : ""}`,
				model: "flux",
				text: result.summary ?? (note || "Rendered architectural plate")
			});
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
			pushChat("studio", result.fallback ? `Studio preview plate ready (Seed #${result.seed}).` : `Plate is ready. ${result.credits.toLocaleString()} credits left.`);
			if ("warning" in result && typeof result.warning === "string" && result.warning) toast.message(result.warning);
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
	async function runLiveDraftPreview(draftSource) {
		const st = useOriel.getState();
		const base = draftSource ?? st.sketchDataUrl ?? st.upload ?? st.plate?.url;
		if (!base || st.busy) return;
		const fallbackUrl = pickServerFallbackPlate(st.design, st.engine, st.engine.seed);
		const draftUrl = await synthesizeFallbackComposite({
			baseImage: base,
			sketchImage: st.sketchDataUrl ?? void 0,
			serverFallbackUrl: fallbackUrl,
			design: st.design,
			engine: st.engine,
			scene3d: st.scene3d,
			variantIndex: 0
		});
		st.setPlate({
			url: draftUrl,
			upload: st.upload ?? void 0,
			templateId: st.engine.workflowPreset,
			idea: st.idea.trim() || "Live stream draft",
			fallback: true,
			seed: st.engine.seed,
			summary: "Live Krea-style low-latency draft"
		});
	}
	async function generateGrid() {
		if (busy) return;
		const { studyId, templateId, sourceId } = resolveRefs();
		setBusy(true);
		pushChat("you", `4-Up Concept Grid · ${idea || design.look}`);
		try {
			const result = await generateVariations({ data: {
				templateId,
				studyId,
				idea,
				image: upload ?? void 0,
				sketchImage: sketchDataUrl ?? void 0,
				...buildConditioningPayload(),
				dictionaryBlocks,
				dictionaryParams,
				design,
				frame,
				engine,
				scene3d
			} });
			setCredits(result.credits);
			let urls = result.urls;
			if (result.fallback && (upload || sketchDataUrl)) urls = await Promise.all(result.urls.map((serverUrl, idx) => synthesizeFallbackComposite({
				baseImage: upload ?? void 0,
				sketchImage: sketchDataUrl ?? void 0,
				serverFallbackUrl: serverUrl,
				design,
				engine,
				scene3d,
				variantIndex: idx
			})));
			setVariations(urls);
			if (urls[0]) setPlate({
				url: urls[0],
				upload: upload ?? void 0,
				templateId: sourceId,
				idea: idea.trim(),
				fallback: result.fallback,
				seed: result.seed
			});
			pushLog({
				title: `4-Up Concept Grid · ${design.look}`,
				model: "midjourney",
				text: idea.trim() || "4-quadrant architectural exploration"
			});
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: "grid" }));
			pushChat("studio", "4-up architectural concept grid ready. Click any quadrant to promote.");
			if ("warning" in result && typeof result.warning === "string" && result.warning) toast.message(result.warning);
			else toast.success("4-Up concept grid ready");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Variation grid failed.");
		} finally {
			setBusy(false);
		}
	}
	async function applyInpaint(inpaintNote) {
		if (busy) return;
		const targetBase = plate?.url ?? upload;
		if (!targetBase) {
			toast.message("Load a source image, 3D snapshot, or generated plate first.");
			return;
		}
		const activeMask = maskDataUrl ?? binaryMaskDataUrl;
		if (!activeMask) {
			toast.message("Paint a region mask or use SAM click-mask first.");
			return;
		}
		const { sourceId } = resolveRefs();
		setBusy(true);
		const taskLabel = engine.iopaintTask === "erase" ? `IOPaint Erase (${engine.iopaintModel})` : engine.iopaintTask === "anytext" ? `IOPaint AnyText: "${engine.iopaintAnyText || inpaintNote}"` : engine.iopaintTask === "paint-by-example" ? "IOPaint Paint-by-Example" : `IOPaint ${engine.iopaintModel}`;
		pushChat("you", `${taskLabel}: ${inpaintNote || engine.iopaintAnyText || idea || "Localized edit"}`);
		try {
			const effectiveMask = await refineMaskBuffer(activeMask, {
				dilatePx: engine.iopaintMaskDilate,
				invert: engine.iopaintInvertMask
			});
			const exampleRef = engine.iopaintTask === "paint-by-example" && engine.iopaintExampleUrl && engine.iopaintExampleUrl.startsWith("data:image/") ? engine.iopaintExampleUrl : void 0;
			const effectiveNote = engine.iopaintTask === "anytext" ? engine.iopaintAnyText || inpaintNote : inpaintNote || (engine.iopaintTask === "erase" ? "Clean object removal" : idea);
			const result = await inpaintPlate({ data: {
				idea: effectiveNote,
				image: targetBase,
				maskImage: binaryMaskDataUrl ?? effectiveMask,
				exampleRefImage: exampleRef,
				...buildConditioningPayload(),
				dictionaryBlocks,
				dictionaryParams,
				design,
				frame,
				engine,
				scene3d
			} });
			setCredits(result.credits);
			let finalUrl = result.url;
			if (result.fallback) {
				if (engine.iopaintTask === "erase") finalUrl = await runLocalLamaErasePass(targetBase, effectiveMask, engine.iopaintModel);
				else if (engine.iopaintTask === "anytext") finalUrl = await runLocalAnyText(targetBase, effectiveMask, engine.iopaintAnyText || inpaintNote);
				else if (engine.iopaintTask === "paint-by-example" && engine.iopaintExampleUrl) finalUrl = await runLocalPaintByExample(targetBase, effectiveMask, engine.iopaintExampleUrl, engine.inpaintStrength);
				else if (engine.iopaintTask === "replace") finalUrl = await runLocalTextureReplacePass(targetBase, effectiveMask, effectiveNote || "Honed Travertine", engine.inpaintStrength);
				else finalUrl = await synthesizeFallbackComposite({
					baseImage: targetBase,
					maskImage: effectiveMask,
					serverFallbackUrl: result.url,
					design,
					engine,
					scene3d,
					variantIndex: 1
				});
			}
			setPlate({
				url: finalUrl,
				upload: upload ?? targetBase,
				templateId: sourceId,
				idea: effectiveNote,
				fallback: result.fallback,
				seed: result.seed
			});
			pushLog({
				title: `${taskLabel} · ${result.modelUsed ?? engine.iopaintModel}`,
				model: "gpt",
				text: `${engine.samPrompt || design.target}: ${effectiveNote || "Localized edit"}`
			});
			setMaskDataUrl(null);
			setBinaryMaskData(null, null);
			if ("warning" in result && typeof result.warning === "string" && result.warning) toast.message(result.warning);
			else toast.success(`${taskLabel} applied (${result.fallback ? "IOPaint local engine" : "Server model"})`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "IOPaint inpaint failed.");
		} finally {
			setBusy(false);
		}
	}
	async function segmentGroundedSam2(targetPrompt, srcOverride, clickPoint) {
		const baseSrc = srcOverride ?? plate?.url ?? upload ?? "/viz/t03-compact-living-room.jpg";
		setEngineField("samPrompt", targetPrompt);
		return segmentObjectWithSam2({ data: {
			image: await toCompactDataUrlForSegmentation(baseSrc),
			prompt: targetPrompt,
			clickPoint
		} });
	}
	async function applyDirectionalOutpaint(padOverride) {
		if (busy) return;
		const targetBase = plate?.url ?? upload;
		if (!targetBase) {
			toast.message("Load a source image or generate a plate first to outpaint.");
			return;
		}
		const pad = padOverride ?? engine.iopaintOutpaintPad;
		const nextEngine = {
			...engine,
			iopaintTask: "outpaint",
			iopaintOutpaintPad: pad
		};
		setEngineField("iopaintOutpaintPad", pad);
		const { sourceId } = resolveRefs();
		setBusy(true);
		try {
			const { paddedUrl, maskDataUrl: borderMask } = await runDirectionalOutpaintPad(targetBase, pad);
			const result = await inpaintPlate({ data: {
				idea: `Outpaint directional border T:${pad.top} R:${pad.right} B:${pad.bottom} L:${pad.left}px. ${idea}`.trim(),
				image: paddedUrl,
				maskImage: borderMask,
				...buildConditioningPayload(),
				dictionaryBlocks,
				dictionaryParams,
				design,
				frame,
				engine: nextEngine,
				scene3d
			} });
			setCredits(result.credits);
			const finalUrl = result.fallback ? paddedUrl : result.url;
			setPlate({
				url: finalUrl,
				upload: upload ?? targetBase,
				templateId: sourceId,
				idea: `${idea} (Outpaint +${pad.left}/${pad.right}/${pad.top}/${pad.bottom}px)`.trim(),
				fallback: result.fallback,
				seed: result.seed
			});
			pushLog({
				title: `IOPaint Outpaint Pad · T${pad.top} R${pad.right} B${pad.bottom} L${pad.left}`,
				model: "flux",
				text: `Seamless directional frame extension via ${engine.iopaintModel}`
			});
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
			toast.success("Directional Outpaint canvas applied");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Directional Outpaint failed.");
		} finally {
			setBusy(false);
		}
	}
	async function applyRemoveBgPlugin(outputMode) {
		if (busy) return;
		const targetBase = plate?.url ?? upload;
		if (!targetBase) {
			toast.message("Load a source image or generate a plate first.");
			return;
		}
		const { sourceId } = resolveRefs();
		setBusy(true);
		try {
			const { url, maskDataUrl: bgMask } = await runRemoveBgPlugin(targetBase, engine.iopaintRemoveBgModel, outputMode);
			if (outputMode === "mask") {
				setMaskDataUrl(bgMask);
				pushLog({
					title: `IOPaint RemoveBG → Mask (${engine.iopaintRemoveBgModel})`,
					model: "gemini",
					text: "Generated inverse background replacement mask"
				});
				window.dispatchEvent(new CustomEvent("oriel-view", { detail: "mask" }));
				toast.success(`Background mask created via ${engine.iopaintRemoveBgModel}`);
			} else {
				setPlate({
					url,
					upload: upload ?? targetBase,
					templateId: sourceId,
					idea: `${idea} (Subject Cutout)`.trim(),
					fallback: true
				});
				pushLog({
					title: `IOPaint RemoveBG Cutout (${engine.iopaintRemoveBgModel})`,
					model: "gemini",
					text: "Isolated primary foreground subject with alpha channel"
				});
				window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
				toast.success(`Subject isolated via ${engine.iopaintRemoveBgModel}`);
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "RemoveBG plugin failed.");
		} finally {
			setBusy(false);
		}
	}
	async function applyRestoreFacesPlugin() {
		if (busy) return;
		const targetBase = plate?.url ?? upload;
		if (!targetBase) {
			toast.message("Load a source image or generate a plate first.");
			return;
		}
		const { sourceId } = resolveRefs();
		setBusy(true);
		try {
			const restoredUrl = await runRestoreFacesPlugin(targetBase, engine.iopaintFaceModel);
			setPlate({
				url: restoredUrl,
				upload: upload ?? targetBase,
				templateId: sourceId,
				idea: `${idea} (${engine.iopaintFaceModel.toUpperCase()} Restore)`.trim(),
				fallback: true
			});
			pushLog({
				title: `IOPaint Restore Faces (${engine.iopaintFaceModel})`,
				model: "gemini",
				text: "Refined scale-figure faces & crisp fixture micro-detail"
			});
			toast.success(`Restored details via ${engine.iopaintFaceModel}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Restore Faces failed.");
		} finally {
			setBusy(false);
		}
	}
	async function applyEnhance(factorOverride) {
		if (busy) return;
		const targetBase = plate?.url ?? upload;
		if (!targetBase) {
			toast.message("Generate or upload a plate first to enhance.");
			return;
		}
		const nextFactor = factorOverride ?? engine.upscaleFactor;
		if (factorOverride) setEngineField("upscaleFactor", factorOverride);
		const nextEngine = {
			...engine,
			upscaleFactor: nextFactor
		};
		const { sourceId } = resolveRefs();
		setBusy(true);
		try {
			const result = await enhancePlate({ data: {
				idea,
				image: targetBase,
				dictionaryBlocks,
				dictionaryParams,
				design,
				frame,
				engine: nextEngine,
				scene3d
			} });
			setCredits(result.credits);
			const finalUrl = result.fallback ? await runTiledUpscalePass(targetBase, nextFactor, engine.esrganModel, engine.esrganDenoise, engine.esrganFaceEnhance) : result.url;
			setPlate({
				url: finalUrl,
				upload: upload ?? targetBase,
				templateId: sourceId,
				idea: idea.trim(),
				fallback: result.fallback
			});
			pushLog({
				title: `Tiled Super-Res ${nextFactor}× · ${engine.esrganModel}`,
				model: "gemini",
				text: `${engine.enhanceMode}${engine.esrganFaceEnhance ? " · Edge & Fixture Restore" : ""}`
			});
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
			if ("warning" in result && typeof result.warning === "string" && result.warning) toast.message(result.warning);
			else toast.success(`Enhanced ${nextFactor}× via ${engine.esrganModel}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Enhance pass failed.");
		} finally {
			setBusy(false);
		}
	}
	async function applyRelight(preset) {
		if (busy) return;
		const targetBase = plate?.url ?? upload;
		if (!targetBase) {
			toast.message("Load a source image or generate a plate first to relight.");
			return;
		}
		setEngineField("relightPreset", preset);
		const nextEngine = {
			...engine,
			relightPreset: preset
		};
		const { sourceId } = resolveRefs();
		setBusy(true);
		try {
			const result = await relightPlate({ data: {
				idea,
				image: targetBase,
				...buildConditioningPayload(),
				dictionaryBlocks,
				dictionaryParams,
				design,
				frame,
				engine: nextEngine,
				scene3d
			} });
			setCredits(result.credits);
			const finalUrl = result.fallback ? await runRelightWeatherPass(targetBase, preset) : result.url;
			setPlate({
				url: finalUrl,
				upload: upload ?? targetBase,
				templateId: sourceId,
				idea: `${idea} (${preset})`.trim(),
				fallback: result.fallback,
				seed: result.seed
			});
			pushLog({
				title: `AI Relight · ${preset}`,
				model: "flux",
				text: "Consistent geometry lock preserved during solar/weather transform"
			});
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
			toast.success(`Relight applied: ${preset}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Relight failed.");
		} finally {
			setBusy(false);
		}
	}
	async function applyOutpaint(ratio) {
		if (busy) return;
		const targetBase = plate?.url ?? upload;
		if (!targetBase) {
			toast.message("Load or render an image first to outpaint.");
			return;
		}
		setEngineField("outpaintRatio", ratio);
		const nextEngine = {
			...engine,
			outpaintRatio: ratio
		};
		const { sourceId } = resolveRefs();
		setBusy(true);
		try {
			const result = await outpaintPlate({ data: {
				idea,
				image: targetBase,
				dictionaryBlocks,
				dictionaryParams,
				design,
				frame,
				engine: nextEngine,
				scene3d
			} });
			setCredits(result.credits);
			const finalUrl = result.fallback ? await runClientOutpaintCanvas(targetBase, ratio) : result.url;
			setPlate({
				url: finalUrl,
				upload: upload ?? targetBase,
				templateId: sourceId,
				idea: `${idea} (Outpaint ${ratio})`.trim(),
				fallback: result.fallback,
				seed: result.seed
			});
			pushLog({
				title: `Canvas Uncrop · ${ratio}`,
				model: "midjourney",
				text: `Expanded canvas aspect to ${ratio}`
			});
			window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
			toast.success(`Canvas outpainted to ${ratio}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Outpaint failed.");
		} finally {
			setBusy(false);
		}
	}
	async function processSingleQueueJob(jobId) {
		const st = useOriel.getState();
		const job = st.queue.find((q) => q.id === jobId);
		if (!job) return;
		st.updateQueueItem(job.id, "processing");
		const stepStart = performance.now();
		try {
			const nextDesign = job.light ? {
				...st.design,
				light: job.light
			} : st.design;
			const nextScene3D = {
				...st.scene3d,
				...job.cameraPreset ? { cameraPreset: job.cameraPreset } : {},
				...typeof job.sunHour === "number" ? {
					geoEnabled: true,
					geoHour: job.sunHour
				} : {}
			};
			const nextEngine = {
				...st.engine,
				workflowPreset: job.preset
			};
			const result = await generatePlate({ data: {
				idea: [
					st.idea,
					job.promptNote,
					job.label
				].filter(Boolean).join(" · ").slice(0, 1100),
				image: st.upload ?? void 0,
				sketchImage: st.sketchDataUrl ?? void 0,
				...buildConditioningPayload(),
				dictionaryBlocks: st.dictionaryBlocks,
				dictionaryParams: st.dictionaryParams,
				design: nextDesign,
				frame: st.frame,
				engine: nextEngine,
				scene3d: nextScene3D
			} });
			st.setCredits(result.credits);
			const variantIndex = job.light === "Evening" ? 2 : job.light === "Golden hour" ? 1 : 0;
			const finalUrl = result.fallback && (st.upload || st.sketchDataUrl) ? await synthesizeFallbackComposite({
				baseImage: st.upload ?? void 0,
				sketchImage: st.sketchDataUrl ?? void 0,
				serverFallbackUrl: result.url,
				design: nextDesign,
				engine: nextEngine,
				scene3d: nextScene3D,
				variantIndex
			}) : result.url;
			const elapsed = performance.now() - stepStart;
			if (elapsed < 220) await new Promise((resolve) => window.setTimeout(resolve, 220 - elapsed));
			useOriel.getState().updateQueueItem(job.id, "completed", finalUrl);
			useOriel.getState().pushLog({
				title: `Batch Pass · ${job.label}`,
				model: "flux",
				text: `${job.light}${job.cameraPreset ? ` · Cam: ${job.cameraPreset}` : ""}${typeof job.sunHour === "number" ? ` · ${job.sunHour.toFixed(1)}h` : ""}`
			});
		} catch (error) {
			useOriel.getState().updateQueueItem(job.id, "error", void 0, { errorMessage: error instanceof Error ? error.message : "Batch job failed" });
		}
	}
	async function runSequentialQueue() {
		if (useOriel.getState().batchRunning) return;
		queueStopRequested = false;
		setBatchRunning(true);
		let completedCount = 0;
		try {
			while (!queueStopRequested) {
				const nextPending = useOriel.getState().queue.find((item) => normalizeQueueStatus(item.status) === "pending");
				if (!nextPending) break;
				await processSingleQueueJob(nextPending.id);
				completedCount++;
			}
			if (completedCount > 0) toast.success(`Batch queue finished (${completedCount} scene${completedCount === 1 ? "" : "s"})`);
		} finally {
			setBatchRunning(false);
		}
	}
	function stopSequentialQueue() {
		queueStopRequested = true;
		toast.message("Stopping batch queue after current scene…");
	}
	async function queueAndRunBatch(label, lightOverride) {
		const thumb = plate?.url ?? upload ?? sketchDataUrl ?? void 0;
		enqueueRender(label, engine.workflowPreset, lightOverride ?? design.light, {
			status: "pending",
			thumbnailUrl: thumb
		});
		await runSequentialQueue();
	}
	async function runThreeLightBatch() {
		const thumb = plate?.url ?? upload ?? sketchDataUrl ?? void 0;
		enqueueBatchMatrix([
			{
				label: `${design.look} · Daylight`,
				preset: engine.workflowPreset,
				light: "Daylight",
				thumbnailUrl: thumb
			},
			{
				label: `${design.look} · Golden Hour`,
				preset: engine.workflowPreset,
				light: "Golden hour",
				thumbnailUrl: thumb
			},
			{
				label: `${design.look} · Dusk / Evening`,
				preset: engine.workflowPreset,
				light: "Evening",
				thumbnailUrl: thumb
			}
		]);
		await runSequentialQueue();
	}
	async function queueBatchMatrix(mode, autoStart = true) {
		const thumb = plate?.url ?? upload ?? sketchDataUrl ?? void 0;
		const specs = buildBatchMatrixSpecs({
			mode,
			preset: engine.workflowPreset,
			look: design.look
		}).map((spec) => ({
			...spec,
			thumbnailUrl: thumb
		}));
		enqueueBatchMatrix(specs);
		if (autoStart) await runSequentialQueue();
		else toast.success(`Queued ${specs.length} scenes for sequential processing`);
	}
	return {
		busy,
		batchRunning,
		conditioningChannels,
		houseStyles,
		generate,
		generateGrid,
		applyInpaint,
		segmentGroundedSam2,
		applyDirectionalOutpaint,
		applyRemoveBgPlugin,
		applyRestoreFacesPlugin,
		applyEnhance,
		applyRelight,
		applyOutpaint,
		runLiveDraftPreview,
		runSequentialQueue,
		stopSequentialQueue,
		queueAndRunBatch,
		runThreeLightBatch,
		queueBatchMatrix
	};
}
function BatchRenderQueue({ onClose }) {
	const queue = useOriel((state) => state.queue);
	const design = useOriel((state) => state.design);
	const engine = useOriel((state) => state.engine);
	const scene3d = useOriel((state) => state.scene3d);
	const plate = useOriel((state) => state.plate);
	const upload = useOriel((state) => state.upload);
	const sketchDataUrl = useOriel((state) => state.sketchDataUrl);
	const enqueueRender = useOriel((state) => state.enqueueRender);
	const requeueQueueItem = useOriel((state) => state.requeueQueueItem);
	const removeQueueItem = useOriel((state) => state.removeQueueItem);
	const clearCompletedQueue = useOriel((state) => state.clearCompletedQueue);
	const retryFailedQueue = useOriel((state) => state.retryFailedQueue);
	const clearQueue = useOriel((state) => state.clearQueue);
	const setPlate = useOriel((state) => state.setPlate);
	const { batchRunning, runSequentialQueue, stopSequentialQueue, queueBatchMatrix, runThreeLightBatch } = useGenerate();
	const [sceneLabel, setSceneLabel] = (0, import_react.useState)("");
	const [scenePreset, setScenePreset] = (0, import_react.useState)(engine.workflowPreset);
	const [sceneLight, setSceneLight] = (0, import_react.useState)(design.light);
	const [sceneCamera, setSceneCamera] = (0, import_react.useState)(scene3d.cameraPreset);
	const [sceneSunHour, setSceneSunHour] = (0, import_react.useState)("");
	const [sceneNote, setSceneNote] = (0, import_react.useState)("");
	const [nowMs, setNowMs] = (0, import_react.useState)(() => Date.now());
	const stats = computeBatchProgress(queue);
	const activeJob = stats.activeProcessingId ? queue.find((item) => item.id === stats.activeProcessingId) ?? null : null;
	const fallbackThumb = plate?.url ?? upload ?? sketchDataUrl ?? "/viz/p01-pavilion-day.jpg";
	(0, import_react.useEffect)(() => {
		if (stats.processing === 0) return;
		const id = window.setInterval(() => setNowMs(Date.now()), 250);
		return () => window.clearInterval(id);
	}, [stats.processing]);
	function handleAddPending(event) {
		event.preventDefault();
		const parsedHour = sceneSunHour.trim() !== "" ? Number(sceneSunHour) : void 0;
		const validHour = typeof parsedHour === "number" && Number.isFinite(parsedHour) ? Math.max(0, Math.min(24, parsedHour)) : void 0;
		const label = sceneLabel.trim() || `${design.look} · ${sceneLight} (${sceneCamera})`;
		enqueueRender(label, scenePreset, sceneLight, {
			cameraPreset: sceneCamera,
			sunHour: validHour,
			promptNote: sceneNote.trim() || void 0,
			thumbnailUrl: plate?.url ?? upload ?? sketchDataUrl ?? void 0,
			status: "pending"
		});
		setSceneLabel("");
		setSceneSunHour("");
		setSceneNote("");
		toast.success(`Added "${label}" to Render Queue (Pending)`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"data-testid": "batch-render-queue",
		"aria-label": "Render Queue",
		className: "rounded-2xl border border-line bg-surface p-3.5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-[#b08a45]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-base font-semibold text-fg",
							children: "Render Queue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							"data-testid": "batch-queue-counters",
							className: "font-mono text-[11px] tabular-nums text-muted",
							children: [
								stats.pending,
								" Pending · ",
								stats.processing,
								" Processing · ",
								stats.completed,
								" Completed",
								stats.failed > 0 ? ` · ${stats.failed} Failed` : ""
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						batchRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: stopSequentialQueue,
							className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-rose-500/40 bg-rose-500/10 px-3 text-xs font-medium text-rose-700 hover:bg-rose-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3" }), " Stop Queue"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "run-sequential-queue-btn",
							disabled: stats.pending === 0,
							onClick: () => void runSequentialQueue(),
							className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-semibold text-[#2a1c0c] disabled:opacity-45",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" }),
								" Process Queue (",
								stats.pending,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: batchRunning,
							onClick: () => void runThreeLightBatch(),
							className: "hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-2.5 text-[11px] text-fg disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contrast, { className: "size-3 text-[#b08a45]" }), " + 3-Light Trio"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: batchRunning,
							onClick: () => void queueBatchMatrix("sun-study", false),
							className: "hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-2.5 text-[11px] text-fg disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3 text-[#b08a45]" }), " + 4-Hr Sun Study"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: batchRunning,
							onClick: () => void queueBatchMatrix("camera-matrix", false),
							className: "hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-raised px-2.5 text-[11px] text-fg disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3 text-[#b08a45]" }), " + 3-Cam Matrix"]
						}),
						stats.failed > 0 && !batchRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "retry-failed-queue-btn",
							onClick: retryFailedQueue,
							className: "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 text-[11px] font-medium text-rose-700 hover:bg-rose-500/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Retry Failed"]
						}) : null,
						stats.completed > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: clearCompletedQueue,
							className: "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line px-2.5 text-[11px] text-muted hover:text-fg",
							children: "Clear Done"
						}) : null,
						queue.length > 0 && !batchRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: clearQueue,
							className: "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line px-2.5 text-[11px] text-muted hover:text-rose-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Clear All"]
						}) : null,
						onClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Hide render queue",
							className: "grid size-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						}) : null
					]
				})]
			}),
			stats.total > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 space-y-1.5",
				children: [activeJob ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "active-processing-banner",
					className: "flex items-center justify-between gap-2 rounded-lg border border-[#d4b06a]/60 bg-[#fff8eb] px-2.5 py-1.5 text-[11px] text-[#785314]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-[#b08a45]" }),
							"Processing sequentially: ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: activeJob.label })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] tabular-nums",
						children: [
							stats.completed + 1,
							" of ",
							stats.total
						]
					})]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "progressbar",
						"aria-label": "Overall render queue progress",
						"aria-valuemin": 0,
						"aria-valuemax": 100,
						"aria-valuenow": stats.progressPct,
						className: "h-1.5 flex-1 overflow-hidden rounded-full bg-raised",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-[#b08a45] transition-all duration-300",
							style: { width: `${stats.progressPct}%` }
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] tabular-nums text-faint",
						children: [
							stats.completed,
							"/",
							stats.total,
							" (",
							stats.progressPct,
							"%)"
						]
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleAddPending,
				className: "mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-line/70 bg-raised/50 p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: sceneLabel,
						onChange: (e) => setSceneLabel(e.target.value),
						placeholder: "Scene name (e.g. Atrium Dusk Hero)",
						"aria-label": "Queue scene name",
						className: "h-8 min-w-[150px] flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: scenePreset,
						onChange: (e) => setScenePreset(e.target.value),
						"aria-label": "Queue workflow preset",
						className: "h-8 rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]",
						children: WORKFLOW_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.label
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sceneLight,
						onChange: (e) => setSceneLight(e.target.value),
						"aria-label": "Queue lighting",
						className: "h-8 rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]",
						children: LIGHTS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: l,
							children: l
						}, l))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sceneCamera,
						onChange: (e) => setSceneCamera(e.target.value),
						"aria-label": "Queue camera view",
						className: "h-8 rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]",
						children: CAMERA_PRESETS_3D.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.label
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 0,
						max: 24,
						step: .5,
						value: sceneSunHour,
						onChange: (e) => setSceneSunHour(e.target.value),
						placeholder: "Hour (0-24)",
						"aria-label": "Queue solar hour",
						className: "h-8 w-28 rounded-lg border border-line bg-surface px-2 font-mono text-xs text-fg tabular-nums outline-none focus:border-[#d4b06a]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: sceneNote,
						onChange: (e) => setSceneNote(e.target.value),
						placeholder: "Optional note (e.g. wet stone plaza)",
						"aria-label": "Queue scene note",
						className: "h-8 min-w-[140px] flex-1 rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						"data-testid": "add-queue-scene-btn",
						className: "hover-chip inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-line bg-surface px-3 text-xs font-medium text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5 text-[#b08a45]" }), " Add Pending"]
					})
				]
			}),
			queue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2.5 text-center text-xs text-faint",
				children: "No queued architectural views yet. Add scenes above or queue a 4-Hour Sun Study / 3-Camera Matrix to preview thumbnails and live render progress."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid max-h-72 grid-cols-1 gap-2 overflow-y-auto pr-0.5 md:grid-cols-2",
				children: queue.map((job, idx) => {
					const visual = getQueueItemVisualMeta(job, fallbackThumb);
					const norm = visual.normalizedStatus;
					const statusLabel = visual.statusLabel;
					const elapsedSec = norm === "processing" && job.startedAt ? `${Math.max(.1, (nowMs - job.startedAt) / 1e3).toFixed(1)}s` : null;
					const liveStatusHint = elapsedSec ? `Rendering (${elapsedSec})` : visual.statusHint;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `queue-item-${idx}`,
						"data-queue-status": statusLabel,
						className: cn("flex flex-col gap-2 rounded-xl border p-2.5 transition", norm === "processing" ? "border-[#d4b06a] bg-[#fff8eb]" : norm === "completed" ? "border-emerald-600/30 bg-raised/50" : norm === "error" ? "border-rose-500/50 bg-rose-50/50" : "border-line bg-raised/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !job.url,
								onClick: () => {
									if (!job.url) return;
									setPlate({
										url: job.url,
										upload: upload ?? void 0,
										templateId: job.preset,
										idea: job.label
									});
									window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
								},
								className: "relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-[#1c1915] disabled:cursor-default",
								title: job.url ? "Load completed render into Studio stage" : job.label,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: visual.thumbnail,
									alt: `${job.label} thumbnail`,
									"data-testid": `queue-item-thumb-${idx}`,
									className: cn("h-full w-full object-cover transition", norm === "pending" && "opacity-75 grayscale-[15%]", norm === "error" && "opacity-60 grayscale-[35%]")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute top-1 left-1 rounded bg-[#14110f]/80 px-1 py-0.5 font-mono text-[9px] text-[#f6efe4]",
									children: ["#", idx + 1]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-xs font-semibold text-fg",
											children: job.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											disabled: norm === "processing",
											onClick: () => removeQueueItem(job.id),
											"aria-label": `Remove ${job.label} from queue`,
											className: "grid size-6 shrink-0 place-items-center rounded-full text-faint hover:bg-surface hover:text-fg disabled:opacity-40",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 flex flex-wrap items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold", norm === "processing" ? "bg-[#e7c27a]/30 text-[#7d520c]" : norm === "completed" ? "bg-emerald-500/15 text-emerald-700" : norm === "error" ? "bg-rose-500/15 text-rose-700" : "bg-surface text-muted"),
											children: [norm === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }) : norm === "processing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : norm === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), statusLabel]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate font-mono text-[10px] text-faint",
											children: [
												job.preset,
												" · ",
												job.light,
												job.cameraPreset ? ` · ${job.cameraPreset}` : "",
												typeof job.sunHour === "number" ? ` · ${job.sunHour.toFixed(1)}h` : ""
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 flex flex-wrap items-center gap-1",
										children: [job.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setPlate({
													url: job.url,
													upload: upload ?? void 0,
													templateId: job.preset,
													idea: job.label
												});
												window.dispatchEvent(new CustomEvent("oriel-view", { detail: "result" }));
											},
											className: "h-6 shrink-0 whitespace-nowrap rounded-full border border-line bg-surface px-2 text-[10px] font-medium text-fg hover:border-[#d4b06a]",
											children: "Inspect"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: job.url,
											download: `${job.label.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "oriel-batch"}.jpg`,
											"aria-label": `Download ${job.label}`,
											className: "grid size-6 shrink-0 place-items-center rounded-full border border-line bg-surface text-muted hover:border-[#d4b06a] hover:text-fg",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" })
										})] }) : null, (norm === "completed" || norm === "error") && !batchRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => requeueQueueItem(job.id),
											"aria-label": `Re-queue ${job.label}`,
											title: "Reset back to Pending",
											className: cn("inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] font-medium", norm === "error" ? "border-rose-400/50 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20" : "border-line bg-surface text-muted hover:text-fg"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-2.5" }), norm === "error" ? "Retry" : "Re-queue"]
										}) : null]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "progressbar",
								"data-testid": `queue-item-statusbar-${idx}`,
								"data-status": statusLabel,
								"aria-label": `${job.label} status: ${statusLabel}`,
								"aria-valuemin": 0,
								"aria-valuemax": 100,
								"aria-valuenow": visual.barWidthPct,
								className: "h-1.5 w-full overflow-hidden rounded-full bg-black/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("h-full rounded-full transition-all duration-300", norm === "processing" ? "bg-gradient-to-r from-[#b08a45] via-[#e7c27a] to-[#b08a45]" : norm === "completed" ? "bg-emerald-600" : norm === "error" ? "bg-rose-500" : "bg-[#9e8f7b]/70"),
									style: { width: `${visual.barWidthPct}%` }
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 text-[10px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("truncate", norm === "error" ? "font-medium text-rose-700" : norm === "processing" ? "font-medium text-[#785314]" : "text-faint"),
									children: liveStatusHint
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 font-mono tabular-nums text-faint",
									children: [visual.barWidthPct, "%"]
								})]
							})]
						})]
					}, job.id);
				})
			})
		]
	});
}
/**
* Simple 1-click pill buttons that apply architectural Mid-Layer Presets
* plus Firm Signature Style Vault ("House Style" DNA profiles).
*/
function MidLayerBar({ compact = false, onApplied }) {
	const midLayerPreset = useOriel((state) => state.midLayerPreset);
	const dictionaryBlocks = useOriel((state) => state.dictionaryBlocks);
	const applyMidLayerPreset = useOriel((state) => state.applyMidLayerPreset);
	const engine = useOriel((state) => state.engine);
	const setEngineField = useOriel((state) => state.setEngineField);
	const houseStyles = useOriel((state) => state.houseStyles);
	const addHouseStyle = useOriel((state) => state.addHouseStyle);
	const [trainerOpen, setTrainerOpen] = (0, import_react.useState)(false);
	const [styleName, setStyleName] = (0, import_react.useState)("");
	const [contrastBias, setContrastBias] = (0, import_react.useState)("Editorial High");
	const [entourageNote, setEntourageNote] = (0, import_react.useState)("Soft-motion visitors & native architectural planting");
	const [sampleImages, setSampleImages] = (0, import_react.useState)([]);
	const fileRef = (0, import_react.useRef)(null);
	const activeObj = midLayerPreset ? getMidLayerPresetById(midLayerPreset) : null;
	const activeHouseStyle = houseStyles.find((h) => h.id === engine.houseStyleId) ?? null;
	function handleSelect(id, title) {
		const next = midLayerPreset === id ? null : id;
		applyMidLayerPreset(id);
		onApplied?.(next);
		toast.message(next ? `Mid-Layer active: ${title}` : "Mid-Layer preset cleared");
	}
	async function handleSampleUpload(files) {
		if (!files || files.length === 0) return;
		const loaded = [];
		for (const file of Array.from(files).slice(0, 8)) try {
			loaded.push(await readImage(file, 768));
		} catch {}
		if (loaded.length > 0) setSampleImages((prev) => [...prev, ...loaded].slice(0, 12));
	}
	function handleSaveHouseStyle(e) {
		e.preventDefault();
		const profile = buildHouseStyleProfile({
			name: styleName || "Studio House DNA",
			sampleImages: sampleImages.length > 0 ? sampleImages : ["/viz/t01-public-library.jpg"],
			contrastBias,
			entourageStyle: entourageNote
		});
		addHouseStyle(profile);
		setTrainerOpen(false);
		setStyleName("");
		setSampleImages([]);
		toast.success(`Trained & attached House Style: ${profile.name}`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "mid-layer-preset-bar",
		className: cn("rounded-2xl border border-line bg-surface px-3.5 py-2.5", compact ? "border-white/15 bg-[#14110f] text-[#f6efe4]" : ""),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-[#b08a45]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-[11px] font-semibold uppercase tracking-wide", compact ? "text-[#e7c27a]" : "text-fg"),
							children: "Mid-Layer Preset"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-faint sm:inline",
							"aria-hidden": "true",
							children: "·"
						}),
						activeObj ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-[11px] font-medium text-[#9a6f23] tabular-nums",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-[#b08a45]" }),
								activeObj.title,
								" · ",
								dictionaryBlocks.length,
								" blocks"
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-[11px]", compact ? "text-[#cbbba6]" : "text-faint"),
							children: "1-click architecture & conditioning pass"
						})
					]
				}), activeObj ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						applyMidLayerPreset(null);
						onApplied?.(null);
						toast.message("Mid-Layer preset cleared");
					},
					className: "shrink-0 whitespace-nowrap text-[11px] font-medium text-[#b08a45] hover:underline",
					children: "Reset layer"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5",
				children: MID_LAYER_PRESETS.map((preset) => {
					const active = midLayerPreset === preset.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": active,
						title: `${preset.title} — ${preset.description}`,
						onClick: () => handleSelect(preset.id, preset.title),
						className: cn("h-7 shrink-0 whitespace-nowrap rounded-full border px-3 text-[11px] font-medium transition", active ? "gold-fill border-transparent text-[#2a1c0c] shadow-xs" : compact ? "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#e7c27a]" : "hover-chip border-line bg-raised/70 text-muted hover:text-fg"),
						children: preset.pillLabel
					}, preset.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-center gap-1.5 border-t border-line/60 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#b08a45]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-3" }), " House Style Vault"]
					}),
					houseStyles.map((hs) => {
						const selected = activeHouseStyle?.id === hs.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": selected,
							onClick: () => {
								const next = selected ? null : hs.id;
								setEngineField("houseStyleId", next);
								toast.message(next ? `House Style active: ${hs.name}` : "House Style detached");
							},
							className: cn("inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[10px] font-medium transition", selected ? "gold-fill border-transparent text-[#2a1c0c]" : compact ? "border-white/15 bg-white/5 text-[#dfd5c6]" : "border-line bg-raised/60 text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex -space-x-1",
								children: hs.palette.slice(0, 3).map((hex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 rounded-full border border-white/50",
									style: { backgroundColor: hex }
								}, hex))
							}), hs.name]
						}, hs.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setTrainerOpen((v) => !v),
						className: "inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-dashed border-[#b08a45]/60 px-2.5 text-[10px] font-medium text-[#b08a45] hover:bg-[#f6e0b0]/25",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Train House Style"]
					})
				]
			}),
			trainerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveHouseStyle,
				className: "mt-2.5 space-y-2.5 rounded-xl border border-line bg-raised p-3 text-xs text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Train Firm Signature Style (House Style DNA)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTrainerOpen(false),
							className: "text-muted hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: styleName,
							onChange: (e) => setStyleName(e.target.value),
							placeholder: "Firm Style Name (e.g. Atelier Limestone)",
							className: "h-8 rounded-lg border border-line bg-surface px-2.5 text-xs outline-none focus:border-[#d4b06a]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: contrastBias,
							onChange: (e) => setContrastBias(e.target.value),
							className: "h-8 rounded-lg border border-line bg-surface px-2 text-xs outline-none focus:border-[#d4b06a]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Editorial High",
									children: "Editorial High Contrast"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Monograph Neutral",
									children: "Monograph Neutral"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Soft Atmospheric",
									children: "Soft Atmospheric"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: entourageNote,
						onChange: (e) => setEntourageNote(e.target.value),
						placeholder: "Entourage & lens grain notes",
						className: "h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs outline-none focus:border-[#d4b06a]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => fileRef.current?.click(),
								className: "inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[11px] font-medium hover:border-[#d4b06a]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5 text-[#b08a45]" }),
									" Upload Portfolio Renders (",
									sampleImages.length,
									"/12)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								multiple: true,
								accept: "image/jpeg,image/png,image/webp",
								className: "sr-only",
								onChange: (e) => {
									handleSampleUpload(e.target.files);
									e.target.value = "";
								}
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-[11px] font-semibold text-[#2a1c0c]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Save & Attach DNA"]
						})]
					})
				]
			}) : null
		]
	});
}
var ATELIER_DEFAULT_STUDIES = [
	{
		id: "dusk-solstice",
		tag: "v4 · Dusk",
		title: "Dusk Solstice",
		subtitle: "3200K Twilight",
		url: "/viz/p01-pavilion-dusk.jpg",
		isGenerated: false,
		lightPreset: "Evening"
	},
	{
		id: "diffuse-sky",
		tag: "v3 · Overcast",
		title: "Diffuse Sky",
		subtitle: "Soft Daylight",
		url: "/viz/p01-pavilion-day.jpg",
		isGenerated: false,
		lightPreset: "Soft overcast"
	},
	{
		id: "golden-horizon",
		tag: "v2 · Low Angle",
		title: "Golden Horizon",
		subtitle: "2800K Sunset",
		url: "/viz/t05-subtropical-home.jpg",
		isGenerated: false,
		lightPreset: "Golden hour"
	},
	{
		id: "nocturne-mist",
		tag: "v1 · Blue Hour",
		title: "Nocturne Mist",
		subtitle: "Interior Glow",
		url: "/viz/t10-home-dusk-edit.jpg",
		isGenerated: false,
		lightPreset: "Night"
	}
];
var ATMOSPHERIC_REGIMES = [
	{
		id: "golden",
		label: "Golden Hour",
		kelvin: "2800K",
		light: "Golden hour",
		d5Preset: "golden",
		sunElevation: 16,
		icon: "sun"
	},
	{
		id: "twilight",
		label: "Twilight Dusk",
		kelvin: "3200K",
		light: "Evening",
		d5Preset: "blue-hour",
		sunElevation: 8,
		icon: "twilight"
	},
	{
		id: "noon",
		label: "Solar Noon",
		kelvin: "5500K",
		light: "Daylight",
		d5Preset: "noon",
		sunElevation: 54,
		icon: "noon"
	}
];
var ATELIER_REFINEMENT_CHIPS = [
	"Warm dusk atmosphere",
	"Honed travertine paving",
	"Specimen date palms",
	"Water mirror caustics"
];
var ATELIER_VERTICAL_HERO = {
	interior: {
		src: "/viz/t03-compact-living-room.jpg",
		caption: "Warm mineral interior study"
	},
	exterior: {
		src: "/viz/t05-subtropical-home.jpg",
		caption: "Subtropical pavilion residence"
	},
	amenities: {
		src: "/viz/t06-urban-courtyard.jpg",
		caption: "Monolithic courtyard pool & terrace"
	},
	landscape: {
		src: "/viz/p01-pavilion-dusk.jpg",
		caption: "Villa dusk garden courtyard"
	}
};
function buildAtelierIterationCards(history, activeUrl) {
	const uniqueHistory = Array.from(new Set(history.filter(Boolean))).slice(0, 4);
	const generatedCards = uniqueHistory.map((url, idx) => {
		const versionNum = uniqueHistory.length - idx;
		const isCurrent = Boolean(activeUrl && url === activeUrl);
		return {
			id: `plate-hist-${idx}`,
			tag: `Plate v${versionNum}`,
			title: isCurrent ? "Active Plate" : `Iteration ${versionNum}`,
			subtitle: isCurrent ? "Selected" : "Click to restore",
			url,
			isGenerated: true,
			lightPreset: "Golden hour"
		};
	});
	if (generatedCards.length >= 4) return generatedCards;
	const existingUrls = new Set(generatedCards.map((c) => c.url));
	const padded = [...generatedCards];
	for (const fallback of ATELIER_DEFAULT_STUDIES) {
		if (padded.length >= 4) break;
		if (!existingUrls.has(fallback.url)) padded.push(fallback);
	}
	return padded;
}
var WORKFLOW_INTENTS = [
	{
		id: "render",
		label: "Render",
		step: 1,
		hint: "Photo, sketch, or prompt to plate"
	},
	{
		id: "3d",
		label: "3D / GLB",
		step: 2,
		hint: "Massing, GLB model, solar rig & camera"
	},
	{
		id: "edit",
		label: "Edit & Region",
		step: 3,
		hint: "Click-to-mask SAM-2 & inpaint"
	},
	{
		id: "enhance",
		label: "Enhance 4K/8K",
		step: 4,
		hint: "Detail upscale, relight & compare"
	},
	{
		id: "spatial",
		label: "360° & Nodes",
		step: 5,
		hint: "Panorama walkthrough & 45-node DAG"
	}
];
var ENHANCE_SCOPES = [
	{
		id: "image",
		label: "Whole Image"
	},
	{
		id: "region",
		label: "Region"
	},
	{
		id: "people",
		label: "People"
	}
];
var ENHANCE_ENVIRONMENTS = [{
	id: "exterior",
	label: "Exterior"
}, {
	id: "interior",
	label: "Interior"
}];
var STAGE_ENTOURAGE_TAGS = [
	{
		id: "trees",
		label: "Trees",
		snippet: "mature architectural trees framing the edges"
	},
	{
		id: "people",
		label: "People",
		snippet: "natural human scale figures in motion"
	},
	{
		id: "car",
		label: "Car",
		snippet: "sleek parked vehicle on driveway"
	},
	{
		id: "lamp",
		label: "Warm Lamp",
		snippet: "warm architectural pendant and wall-wash glow"
	},
	{
		id: "greenery",
		label: "Greenery",
		snippet: "lush layered planters and courtyard foliage"
	},
	{
		id: "water",
		label: "Water",
		snippet: "calm reflective water court"
	}
];
function resolveIntentFromStage(stage, enhanceBarOpen) {
	if (stage === "3d") return "3d";
	if (stage === "sam2" || stage === "mask" || stage === "sketch" || stage === "cv") return "edit";
	if (stage === "360" || stage === "nodes") return "spatial";
	if (enhanceBarOpen && (stage === "source" || stage === "result" || stage === "compare")) return "enhance";
	return "render";
}
function defaultEnhanceEnvironmentForVertical(vertical) {
	return vertical === "interior" || vertical === "amenities" ? "interior" : "exterior";
}
function buildEnhanceDirective(scope, env, factor) {
	return `${factor}x ArchViz enhance (${scope === "region" ? "targeted architectural region clarity" : scope === "people" ? "realistic scale figures, faces, and foliage micro-detail" : "full-frame material texture and edge fidelity"}; ${env === "interior" ? "strict interior geometry and lighting preservation" : "crisp exterior facade cladding, glass reflections, and landscaping depth"})`;
}
function appendEntourageTagToIdea(idea, snippet) {
	const cleanSnippet = snippet.trim();
	if (!cleanSnippet) return idea;
	const trimmed = idea.trim();
	if (!trimmed) return cleanSnippet;
	if (trimmed.toLowerCase().includes(cleanSnippet.toLowerCase())) return idea;
	return `${trimmed.replace(/[,.;\s]+$/, "")}, ${cleanSnippet}`;
}
var pending3DFile = null;
function setPending3DFile(file) {
	pending3DFile = file;
}
function consumePending3DFile() {
	const f = pending3DFile;
	pending3DFile = null;
	return f;
}
function Composer() {
	const upload = useOriel((state) => state.upload);
	const setUpload = useOriel((state) => state.setUpload);
	const idea = useOriel((state) => state.idea);
	const setIdea = useOriel((state) => state.setIdea);
	const design = useOriel((state) => state.design);
	const engine = useOriel((state) => state.engine);
	const credits = useOriel((state) => state.credits);
	const frame = useOriel((state) => state.frame);
	const setFrame = useOriel((state) => state.setFrame);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setPanel = useOriel((state) => state.setPanel);
	const midLayerPreset = useOriel((state) => state.midLayerPreset);
	const queue = useOriel((state) => state.queue);
	const chat = useOriel((state) => state.chat);
	const { busy, generate, generateGrid } = useGenerate();
	const [enhancing, setEnhancing] = (0, import_react.useState)(false);
	const [toolsOpen, setToolsOpen] = (0, import_react.useState)(true);
	const [entourageOpen, setEntourageOpen] = (0, import_react.useState)(false);
	const [midLayerOpen, setMidLayerOpen] = (0, import_react.useState)(false);
	const [queueDrawerOpen, setQueueDrawerOpen] = (0, import_react.useState)(false);
	const [threadOpen, setThreadOpen] = (0, import_react.useState)(true);
	const [chatFocused, setChatFocused] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const ideaRef = (0, import_react.useRef)(null);
	const activeMidLayer = midLayerPreset ? getMidLayerPresetById(midLayerPreset) : null;
	const showQueue = queueDrawerOpen || queue.length > 0;
	const hasThread = chat.length > 0;
	(0, import_react.useEffect)(() => {
		const el = ideaRef.current;
		if (!el) return;
		el.style.height = "auto";
		const nextH = Math.max(chatFocused ? 46 : 38, Math.min(el.scrollHeight, 144));
		el.style.height = `${nextH}px`;
	}, [idea, chatFocused]);
	(0, import_react.useEffect)(() => {
		if (chat.length > 0) setThreadOpen(true);
	}, [chat.length]);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0 space-y-2.5",
		"data-testid": "bottom-chat-dock",
		children: [
			hasThread ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-[#d1c5b8]/40 bg-white/75 px-3.5 py-2 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setThreadOpen((v) => !v),
					className: "inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4d463c] hover:text-[#1b1c1a]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5 text-[#725b38]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Studio Thread · ",
							chat.length,
							" msg"
						] }),
						threadOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3" })
					]
				}), threadOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1.5 flex flex-col gap-1",
					children: chat.slice(-2).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("truncate rounded-xl px-2.5 py-1 text-xs", line.role === "you" ? "bg-[#f5f3ef] font-medium text-[#1b1c1a]" : "bg-white text-[#4d463c]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1.5 font-mono text-[10px] uppercase text-[#725b38]",
							children: line.role === "you" ? "You" : "Oriel"
						}), line.text]
					}, line.id))
				}) : null]
			}) : null,
			midLayerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MidLayerBar, {}) : null,
			showQueue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatchRenderQueue, { onClose: queue.length === 0 ? () => setQueueDrawerOpen(false) : void 0 }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				onSubmit: (event) => {
					event.preventDefault();
					generate();
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("atelier-glass rounded-3xl border p-3.5 sm:p-4 transition-[border-color,box-shadow] duration-150", chatFocused ? "border-[#725b38]/60 ring-2 ring-[#c5a880]/25" : "border-[#d1c5b8]/35"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2.5 flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 font-serif text-[11px] font-medium uppercase tracking-widest text-[#725b38]",
									children: "Inject Refinements:"
								}), ATELIER_REFINEMENT_CHIPS.map((chip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setIdea(appendSuggestionToIdea(idea, chip));
										ideaRef.current?.focus();
									},
									className: "shrink-0 rounded-full bg-[#efeeea]/80 px-2.5 py-1 text-[11px] text-[#4d463c] transition hover:bg-[#c5a880]/25 hover:text-[#1b1c1a]",
									children: ["+ ", chip]
								}, chip))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden shrink-0 font-mono text-[11px] tabular-nums text-[#5a5e68] md:inline",
								children: ["Seed #", engine.seed]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 sm:flex-row sm:items-end rounded-2xl bg-[#fbf9f5]/85 p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.03)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-1 items-center gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => fileRef.current?.click(),
										className: "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#e4e2de]/70 text-[#725b38] transition hover:bg-[#c5a880]/25",
										"aria-label": upload ? "Replace reference image" : "Upload a reference image",
										title: upload ? "Replace reference image" : "Attach photo, plan, or massing image",
										children: [upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: upload,
											alt: "",
											className: "h-full w-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-4.5 text-[#725b38]" }), upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
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
											className: "absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-[#1b1c1a] text-[9px] text-white",
											"aria-label": "Remove image",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-2.5" })
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
											rows: 1,
											"aria-label": "Your idea",
											onFocus: () => setChatFocused(true),
											onBlur: () => setChatFocused(false),
											onChange: (event) => setIdea(event.target.value),
											onKeyDown: (event) => {
												if (event.key === "Enter" && !event.shiftKey) {
													event.preventDefault();
													generate();
												}
											},
											placeholder: "Describe your architectural refinement, materials, or lighting atmosphere...",
											className: "max-h-36 min-h-[38px] w-full resize-none overflow-y-auto bg-transparent px-1 py-1.5 text-sm font-light leading-snug text-[#1b1c1a] outline-none placeholder:text-[#7f766a]",
											suppressHydrationWarning: true
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-wrap items-center justify-end gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPanel("engine"),
										className: "hidden h-9 items-center gap-1.5 rounded-xl bg-[#f5f3ef] px-3 text-[11px] font-medium text-[#4d463c] transition hover:bg-[#efeeea] hover:text-[#1b1c1a] sm:inline-flex",
										title: "Active Engine Preset — click to configure in Inspector",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3.5 text-[#725b38]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "capitalize",
											children: engine.workflowPreset.replace(/-/g, " ")
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "toggle-studio-tools-btn",
										"aria-expanded": toolsOpen,
										onClick: () => setToolsOpen((v) => !v),
										className: "inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-[#d1c5b8]/45 bg-white px-2.5 text-xs font-medium text-[#4d463c] transition hover:border-[#725b38] hover:text-[#1b1c1a]",
										title: toolsOpen ? "Collapse chat controls" : "Show all chat controls",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: toolsOpen ? "Compact" : "Controls"
										}), toolsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3.5" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: busy,
										onClick: () => void generateGrid(),
										className: "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d1c5b8]/50 bg-white px-3 text-xs font-medium text-[#1b1c1a] transition hover:border-[#725b38] disabled:opacity-50",
										title: "Generate 4-up concept grid",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid2x2, { className: "size-3.5 text-[#725b38]" }), " 4-Up"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										disabled: busy || credits < 50,
										className: "inline-flex h-9.5 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[#c5a880] px-4 text-xs font-medium tracking-wide text-[#513d1d] shadow-[0_4px_16px_rgba(197,168,128,0.32)] transition hover:bg-[#e0c298] disabled:opacity-60",
										children: [
											busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: busy ? "Rendering..." : engine.outputMode === "grid-4" ? "Render 4-Up" : "Render Plate" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
												className: "hidden rounded bg-[#513d1d]/10 px-1.5 py-0.5 font-mono text-[10px] sm:inline",
												children: "⌘↵"
											})
										]
									})
								]
							})]
						}),
						toolsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": "studio-tools-drawer",
							className: "mt-2.5 space-y-2 border-t border-[#d1c5b8]/35 pt-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-flex flex-wrap items-center gap-0.5 rounded-full bg-[#efeeea]/80 p-0.5",
										role: "group",
										"aria-label": "Aspect Ratio",
										children: RATIOS.map((ratio) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": frame.ratio === ratio,
											onClick: () => setFrame({
												...frame,
												ratio
											}),
											className: cn("h-6.5 shrink-0 whitespace-nowrap rounded-full px-2.5 text-[11px] transition", frame.ratio === ratio ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs" : "text-[#4d463c] hover:text-[#1b1c1a]"),
											children: ratio
										}, ratio))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-flex items-center gap-0.5 rounded-full bg-[#efeeea]/80 p-0.5",
										role: "group",
										"aria-label": "Resolution",
										children: RESOLUTIONS.map((resolution) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": frame.resolution === resolution,
											onClick: () => setFrame({
												...frame,
												resolution
											}),
											className: cn("h-6.5 shrink-0 whitespace-nowrap rounded-full px-2.5 text-[11px] uppercase transition", frame.resolution === resolution ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs" : "text-[#4d463c] hover:text-[#1b1c1a]"),
											children: resolution
										}, resolution))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1 sm:ml-auto",
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
														if ("warning" in result && typeof result.warning === "string" && result.warning) toast.message(result.warning);
														else toast.success("Prompt refined");
													}).catch((error) => toast.error(error instanceof Error ? error.message : "Could not enhance that idea.")).finally(() => setEnhancing(false));
												},
												className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs text-[#4d463c] transition hover:bg-[#efeeea] hover:text-[#1b1c1a] disabled:opacity-60",
												title: "Expand and polish prompt wording with AI",
												children: [enhancing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5 text-[#725b38]" }), " Refine Prompt"]
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
												className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#c5a880]/25 px-2.5 text-xs font-medium text-[#513d1d] transition hover:bg-[#c5a880]/40",
												title: "Cycle architectural aesthetic style",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwatchBook, { className: "size-3.5 text-[#725b38]" }),
													" ",
													design.look
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "cycle-lighting-btn",
												onClick: () => {
													const idx = LIGHTS.findIndex((l) => l === design.light);
													const next = LIGHTS[(idx + 1) % LIGHTS.length];
													setDesignField("light", next);
													toast.success(`Lighting: ${next}`);
												},
												className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs text-[#1b1c1a] transition hover:bg-[#efeeea]",
												title: "Cycle lighting atmosphere (Daylight, Golden hour, Evening, Soft overcast, Night)",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5 text-[#725b38]" }),
													" ",
													design.light
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "toggle-entourage-btn",
												"aria-expanded": entourageOpen,
												onClick: () => setEntourageOpen((v) => !v),
												className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs transition", entourageOpen ? "bg-[#c5a880]/30 font-medium text-[#513d1d]" : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a]"),
												title: "Stage architectural scale objects (Trees, People, Car, Warm Lamp)",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Armchair, { className: "size-3.5 text-[#725b38]" }), " Entourage"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "toggle-midlayer-btn",
												"aria-expanded": midLayerOpen,
												onClick: () => setMidLayerOpen((v) => !v),
												className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs transition", midLayerOpen || activeMidLayer ? "bg-[#c5a880]/30 font-medium text-[#513d1d]" : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a]"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-[#725b38]" }), activeMidLayer ? activeMidLayer.pillLabel : "Mid-Layer"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "toggle-render-queue-btn",
												onClick: () => setQueueDrawerOpen((v) => !v),
												"aria-expanded": showQueue,
												className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs transition", showQueue ? "bg-[#c5a880]/30 font-medium text-[#513d1d]" : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a]"),
												title: "Open Batch Render Queue, + Add Scene & 3-Light Trio",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-[#725b38]" }),
													"Queue",
													queue.length > 0 ? ` (${queue.length})` : ""
												]
											})
										]
									})
								]
							}), entourageOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								"data-testid": "entourage-tags-tray",
								className: "flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#f5f3ef]/85 px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium text-[#1b1c1a]",
									children: "Stage object:"
								}), STAGE_ENTOURAGE_TAGS.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setIdea(appendEntourageTagToIdea(idea, tag.snippet));
										toast.success(`Added ${tag.label} to prompt`);
										ideaRef.current?.focus();
									},
									className: "h-6.5 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] transition hover:border-[#725b38]",
									children: ["+ ", tag.label]
								}, tag.id))]
							}) : null]
						}) : null
					]
				})
			})
		]
	});
}
function MarketCopilotDrawer({ open, onOpenChange }) {
	const autoApproveMode = useOriel((s) => s.autoApproveMode);
	const setAutoApproveMode = useOriel((s) => s.setAutoApproveMode);
	const approvedSuggestionIds = useOriel((s) => s.approvedSuggestionIds);
	const appliedSuggestionIds = useOriel((s) => s.appliedSuggestionIds);
	const approveMarketSuggestion = useOriel((s) => s.approveMarketSuggestion);
	const applyMarketSuggestion = useOriel((s) => s.applyMarketSuggestion);
	const applyMarketSuggestionBatch = useOriel((s) => s.applyMarketSuggestionBatch);
	const resetAppliedMarketSuggestions = useOriel((s) => s.resetAppliedMarketSuggestions);
	const design = useOriel((s) => s.design);
	const engine = useOriel((s) => s.engine);
	const enqueueRender = useOriel((s) => s.enqueueRender);
	const enqueueBatchMatrix = useOriel((s) => s.enqueueBatchMatrix);
	const pushLog = useOriel((s) => s.pushLog);
	const plate = useOriel((s) => s.plate);
	const upload = useOriel((s) => s.upload);
	const sketchDataUrl = useOriel((s) => s.sketchDataUrl);
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [benchmark, setBenchmark] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [alsoQueueVisualPasses, setAlsoQueueVisualPasses] = (0, import_react.useState)(true);
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	const [autoRunning, setAutoRunning] = (0, import_react.useState)(false);
	const [autoProgress, setAutoProgress] = (0, import_react.useState)(null);
	const cancelAutoRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function onKey(e) {
			if (e.key === "Escape") onOpenChange(false);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onOpenChange]);
	(0, import_react.useEffect)(() => {
		return () => {
			cancelAutoRef.current = true;
		};
	}, []);
	const filtered = (0, import_react.useMemo)(() => filterMarketSuggestions(MARKET_SUGGESTIONS, {
		query,
		category,
		benchmark,
		statusFilter,
		approvedIds: approvedSuggestionIds,
		appliedIds: appliedSuggestionIds
	}), [
		query,
		category,
		benchmark,
		statusFilter,
		approvedSuggestionIds,
		appliedSuggestionIds
	]);
	const visibleItems = (0, import_react.useMemo)(() => showAll ? filtered : filtered.slice(0, 24), [filtered, showAll]);
	const categoryStats = (0, import_react.useMemo)(() => getMarketCategoryStats(MARKET_SUGGESTIONS, approvedSuggestionIds, appliedSuggestionIds), [approvedSuggestionIds, appliedSuggestionIds]);
	const approvedSet = (0, import_react.useMemo)(() => new Set(approvedSuggestionIds), [approvedSuggestionIds]);
	const appliedSet = (0, import_react.useMemo)(() => new Set(appliedSuggestionIds), [appliedSuggestionIds]);
	const thumbFallback = plate?.url ?? upload ?? sketchDataUrl ?? "/viz/p01-pavilion-day.jpg";
	async function runAutoBuild(targets, title, includeDaylightTrio = false) {
		if (autoRunning) return;
		if (targets.length === 0) {
			toast.message("No suggestions match the current selection.");
			return;
		}
		cancelAutoRef.current = false;
		setAutoRunning(true);
		const plan = createAutoBuildQueuePlan(targets, {
			includeDaylightTrio,
			baseLook: design.look,
			basePreset: engine.workflowPreset
		});
		const chunkSize = targets.length > 30 ? 10 : 1;
		let processed = 0;
		for (let i = 0; i < plan.orderedSuggestions.length; i += chunkSize) {
			if (cancelAutoRef.current) break;
			const chunk = plan.orderedSuggestions.slice(i, i + chunkSize);
			const last = chunk[chunk.length - 1];
			setAutoProgress({
				done: processed,
				total: plan.orderedSuggestions.length,
				label: last?.title ?? title
			});
			applyMarketSuggestionBatch(chunk, autoApproveMode);
			processed += chunk.length;
			await new Promise((r) => window.setTimeout(r, targets.length > 30 ? 30 : 75));
		}
		if (!cancelAutoRef.current) {
			if (alsoQueueVisualPasses && plan.queueJobs.length > 0) enqueueBatchMatrix(plan.queueJobs.map((job) => ({
				...job,
				thumbnailUrl: thumbFallback
			})));
			pushLog({
				title: `Market Copilot · ${title}`,
				model: "flux",
				text: plan.summaryText
			});
			toast.success(autoApproveMode ? `Auto-Approved & Applied ${processed} upgrades${alsoQueueVisualPasses && plan.queueJobs.length > 0 ? ` · ${plan.queueJobs.length} queued` : ""}` : `Applied ${processed} upgrades to Studio configuration`);
		}
		setAutoProgress(null);
		setAutoRunning(false);
	}
	function handleApplySingle(item) {
		if (autoApproveMode) approveMarketSuggestion(item.id);
		applyMarketSuggestion(item);
		toast.success(`Applied "${item.title}" to Studio`);
	}
	function handleQueueSingle(item) {
		const q = item.autoQueuePreset;
		enqueueRender(q?.label || item.title, q?.preset || engine.workflowPreset, q?.light || design.light, {
			cameraPreset: q?.cameraPreset,
			sunHour: q?.sunHour,
			promptNote: item.promptPatch,
			thumbnailUrl: thumbFallback,
			status: "pending"
		});
		toast.success(`Queued "${q?.label || item.title}" in Render Queue`);
	}
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-testid": "market-copilot-drawer",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "ArchViz Market Copilot and Auto-Build Suggestions",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-5",
		onClick: () => onOpenChange(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line bg-surface text-fg shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex shrink-0 items-start justify-between gap-3 border-b border-line bg-bg/70 px-4 py-2.5 sm:items-center sm:px-5 sm:py-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-lg leading-tight font-bold tracking-tight text-fg sm:text-2xl",
							children: "ArchViz Market Copilot · 160 Production Upgrades"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] leading-snug text-muted sm:text-xs",
							children: "Benchmarked across D5 Render, Veras, LookX, Rendair, Krea, Magnific & Chaos Corona · Non-destructive updates only"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden font-mono text-xs tabular-nums text-muted md:inline",
							children: [
								appliedSuggestionIds.length,
								" Applied · ",
								approvedSuggestionIds.length,
								" Approved · ",
								MARKET_SUGGESTIONS.length,
								" Total"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onOpenChange(false),
							"aria-label": "Close Market Copilot",
							className: "grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted hover:text-fg sm:size-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 border-b border-line bg-raised/70 px-4 py-2 sm:px-5 sm:py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "toggle-auto-approve-btn",
									"aria-pressed": autoApproveMode,
									onClick: () => setAutoApproveMode(!autoApproveMode),
									className: cn("inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-xs font-semibold transition sm:h-10 sm:gap-2 sm:px-3.5", autoApproveMode ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-surface text-fg hover:border-[#b08a45]"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }),
										"Auto-Approve: ",
										autoApproveMode ? "ON" : "Manual"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": alsoQueueVisualPasses,
									onClick: () => setAlsoQueueVisualPasses((v) => !v),
									className: cn("inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 text-xs font-medium transition sm:h-10 sm:px-3", alsoQueueVisualPasses ? "border-[#b08a45] bg-[#fff8eb] text-[#5e4110]" : "border-line bg-surface text-muted hover:text-fg"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-[#b08a45]" }),
										"Queue Passes: ",
										alsoQueueVisualPasses ? "Yes" : "No"
									]
								}),
								appliedSuggestionIds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										resetAppliedMarketSuggestions();
										toast.message("Cleared applied checklist badges (Studio settings kept intact)");
									},
									className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-xs text-muted hover:text-fg sm:h-10 sm:px-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Reset"]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-1.5 sm:gap-2",
							children: autoRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									cancelAutoRef.current = true;
								},
								className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 text-xs font-semibold text-rose-700 sm:h-10 sm:px-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }),
									"Stop Auto-Build (",
									autoProgress?.done ?? 0,
									"/",
									autoProgress?.total ?? 0,
									")"
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "auto-build-top5-btn",
								onClick: () => void runAutoBuild(filtered.slice(0, 5), "Top 5 Filtered Upgrades", false),
								className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 text-xs font-semibold text-fg hover:border-[#b08a45] sm:h-10 sm:px-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5 text-[#b08a45]" }), "Auto-Build Top 5"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "auto-build-visible-btn",
								onClick: () => void runAutoBuild(filtered, `Filtered Batch (${filtered.length})`, category === "solar-atmosphere" || category === "motion-360-client"),
								className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold text-[#2a1c0c] sm:h-10 sm:px-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
									"Auto-Approve & Build (",
									filtered.length,
									")"
								]
							})] })
						})]
					}), autoProgress ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 flex-1 overflow-hidden rounded-full bg-black/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-[#b08a45] transition-all duration-150",
								style: { width: `${Math.round(autoProgress.done / Math.max(1, autoProgress.total) * 100)}%` }
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "max-w-[260px] truncate font-mono text-[11px] tabular-nums text-fg",
							children: [
								autoProgress.done,
								"/",
								autoProgress.total,
								" · ",
								autoProgress.label
							]
						})]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-5 overflow-y-auto px-4 py-3.5 sm:px-5 sm:py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-label": "1-Click Autopilot Packs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold text-fg",
									children: "1-Click Studio Autopilot Packs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Apply curated market workflows without manual slider hunting"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
								children: MARKET_AUTOPILOT_PACKS.map((pack) => {
									const packItems = MARKET_SUGGESTIONS.filter((s) => pack.suggestionIds.includes(s.id));
									const doneCount = packItems.filter((i) => appliedSet.has(i.id)).length;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col justify-between gap-2.5 rounded-xl border border-line bg-bg/60 p-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2 text-xs text-muted",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono tabular-nums",
													children: [
														packItems.length,
														" Upgrades · ",
														doneCount,
														"/",
														packItems.length,
														" Applied"
													]
												}), pack.recommendedQueueTrio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1 font-medium text-[#8a6520]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3" }), " Trio Queue"]
												}) : null]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-sm font-semibold text-fg",
												children: pack.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs leading-relaxed text-muted",
												children: pack.description
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2 pt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: autoRunning,
												onClick: () => void runAutoBuild(packItems, pack.name, Boolean(pack.recommendedQueueTrio)),
												className: "gold-fill inline-flex h-9 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold text-[#2a1c0c] disabled:opacity-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), "Auto-Build Pack"]
											})
										})]
									}, pack.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							"aria-label": "Filter 160 Market Suggestions",
							className: "space-y-2.5 border-t border-line pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 lg:flex-row lg:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											"data-testid": "market-copilot-search",
											value: query,
											onChange: (e) => setQuery(e.target.value),
											placeholder: "Search 160 market suggestions (e.g. travertine, SAM-2, 360, tilt-shift, golden hour)...",
											className: "h-10 w-full rounded-lg border border-line bg-bg pr-3 pl-9 text-xs text-fg outline-none focus:border-[#b08a45]"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										"aria-label": "Filter by ArchViz benchmark",
										value: benchmark,
										onChange: (e) => setBenchmark(e.target.value),
										className: "h-10 rounded-lg border border-line bg-bg px-3 text-xs text-fg outline-none focus:border-[#b08a45]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Market Tools (7)"
										}), MARKET_BENCHMARKS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: b,
											children: b
										}, b))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1 rounded-lg bg-raised p-1",
										children: [
											["all", "All"],
											["pending", "Pending"],
											["approved", "Approved"],
											["applied", "Applied"]
										].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setStatusFilter(id),
											className: cn("h-8 shrink-0 whitespace-nowrap rounded-md px-3 text-xs font-medium transition", statusFilter === id ? "bg-surface text-fg shadow-xs" : "text-muted hover:text-fg"),
											children: label
										}, id))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setCategory("all"),
									className: cn("h-9 shrink-0 whitespace-nowrap rounded-lg border px-3 text-xs font-medium transition", category === "all" ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-bg text-muted hover:text-fg"),
									children: [
										"All Categories (",
										MARKET_SUGGESTIONS.length,
										")"
									]
								}), MARKET_SUGGESTION_CATEGORIES.map((cat) => {
									const stat = categoryStats.find((s) => s.id === cat.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setCategory(cat.id),
										className: cn("h-9 shrink-0 whitespace-nowrap rounded-lg border px-3 text-xs font-medium tabular-nums transition", category === cat.id ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-bg text-muted hover:text-fg"),
										children: [
											cat.label,
											" (",
											stat?.total ?? 20,
											")"
										]
									}, cat.id);
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
							"aria-label": "Suggestion List",
							children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-line p-8 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "mx-auto size-6 text-faint" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm font-medium text-fg",
										children: "No suggestions match your filters"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setQuery("");
											setCategory("all");
											setBenchmark("all");
											setStatusFilter("all");
										},
										className: "mt-3 h-9 rounded-lg border border-line px-4 text-xs font-medium text-fg hover:border-[#b08a45]",
										children: "Clear All Filters"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2.5 flex items-center justify-between text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"data-testid": "market-copilot-count",
									className: "font-mono tabular-nums",
									children: [
										"Showing ",
										visibleItems.length,
										" of ",
										filtered.length,
										" matching suggestions"
									]
								}), filtered.length > 24 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowAll((v) => !v),
									className: "font-medium text-[#8a6520] hover:underline",
									children: showAll ? "Collapse to 24" : `Show all ${filtered.length}`
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 md:grid-cols-2",
								children: visibleItems.map((item) => {
									const isApplied = appliedSet.has(item.id);
									const isApproved = approvedSet.has(item.id) || isApplied;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										"data-testid": `market-suggestion-${item.id}`,
										className: cn("flex flex-col justify-between gap-3 rounded-xl border p-4 transition", isApplied ? "border-emerald-600/40 bg-emerald-50/35" : "border-line bg-bg/40"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1.5 text-xs text-muted tabular-nums",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono font-semibold text-fg",
														children: ["#", String(item.index).padStart(3, "0")]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.marketBenchmark }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.categoryLabel }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														"aria-hidden": "true",
														children: "·"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("font-medium", isApplied ? "text-emerald-700" : isApproved ? "text-[#8a6520]" : "text-muted"),
														children: isApplied ? "Applied" : isApproved ? "Approved" : `${item.estimatedImpact} Impact`
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "mt-1.5 text-sm font-semibold text-fg",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-xs leading-relaxed text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-medium text-fg",
														children: "Solves:"
													}),
													" ",
													item.painPointSolved
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-xs text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-medium text-fg",
														children: "Tip:"
													}),
													" ",
													item.userFriendlyTip
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 border-t border-line/60 pt-2 font-mono text-[11px] leading-relaxed text-fg/85",
												children: item.promptPatch
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2 pt-1",
											children: [
												!isApproved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														approveMarketSuggestion(item.id);
														toast.message(`Approved: ${item.title}`);
													},
													className: "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 text-xs font-medium text-fg hover:border-[#b08a45]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-[#b08a45]" }), "Approve"]
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => handleApplySingle(item),
													className: cn("inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-xs font-semibold transition", isApplied ? "border border-emerald-600/40 bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20" : "gold-fill text-[#2a1c0c]"),
													children: [isApplied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }), isApplied ? "Re-Apply Update" : "Apply Update"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => handleQueueSingle(item),
													className: "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-3 text-xs font-medium text-muted hover:text-fg",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-[#b08a45]" }), "Queue Pass"]
												})
											]
										})]
									}, item.id);
								})
							})] })
						})
					]
				})
			]
		})
	});
}
var ROUTE_TITLES = {
	"/": "Studio Workspace",
	"/builder": "Brief Builder",
	"/nodes": "Node Studio",
	"/gallery": "Project Gallery",
	"/studies": "Case Studies",
	"/method": "ArchViz Method",
	"/library": "Templates Library",
	"/projects": "Saved Projects",
	"/assets": "Assets & GLB Library",
	"/plans": "Plans & Credits"
};
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid size-9 shrink-0 place-items-center rounded-xl bg-[#c5a880]/20 text-[#725b38] shadow-[inset_0_0_0_1px_rgba(197,168,128,0.45)]",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			className: "size-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 3.2 21 20.2H3L12 3.2Z",
				fill: "currentColor"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12 8.2 16.2 17.2H7.8L12 8.2Z",
				fill: "#fbf9f5"
			})]
		})
	});
}
function Shell() {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	const [copilotOpen, setCopilotOpen] = (0, import_react.useState)(false);
	const [noticesOpen, setNoticesOpen] = (0, import_react.useState)(false);
	const [railCollapsed, setRailCollapsed] = (0, import_react.useState)(true);
	const [mobileNavOpen, setMobileNavOpen] = (0, import_react.useState)(false);
	const appliedSuggestionIds = useOriel((state) => state.appliedSuggestionIds);
	const design = useOriel((state) => state.design);
	const credits = useOriel((state) => state.credits);
	const log = useOriel((state) => state.log);
	const clearLog = useOriel((state) => state.clearLog);
	const queue = useOriel((state) => state.queue);
	const setCredits = useOriel((state) => state.setCredits);
	const setVertical = useOriel((state) => state.setVertical);
	const saveProject = useOriel((state) => state.saveProject);
	const setUpload = useOriel((state) => state.setUpload);
	const setPlate = useOriel((state) => state.setPlate);
	const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
	const setSketchDataUrl = useOriel((state) => state.setSketchDataUrl);
	const setIdea = useOriel((state) => state.setIdea);
	const plate = useOriel((state) => state.plate);
	const upload = useOriel((state) => state.upload);
	const idea = useOriel((state) => state.idea);
	const navigate = useNavigate();
	const hydrated = useHydrated();
	function startNewProject() {
		if (plate?.url || upload || idea.trim()) saveProject(`${design.look} · ${design.vertical}`);
		setUpload(null);
		setPlate(null);
		setMaskDataUrl(null);
		setSketchDataUrl(null);
		setIdea("");
		window.dispatchEvent(new CustomEvent("oriel-view", { detail: "source" }));
		if (pathname !== "/") navigate({ to: "/" });
		toast.success("Fresh Studio project ready (previous draft archived in Projects)");
	}
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
		function onOpenCopilot() {
			setCopilotOpen(true);
		}
		window.addEventListener("keydown", onKey);
		window.addEventListener("oriel-open-copilot", onOpenCopilot);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("oriel-open-copilot", onOpenCopilot);
		};
	}, []);
	const hasNotices = log.length > 0 || queue.length > 0;
	const activeRouteLabel = ROUTE_TITLES[pathname] ?? "Studio";
	function renderNavItems(compact, onPicked) {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-testid": "new-project-rail-btn",
				title: "New Project (saves active draft to Projects)",
				"aria-label": "New Project",
				onClick: () => {
					startNewProject();
					onPicked?.();
				},
				className: cn("mb-1.5 flex h-9 shrink-0 items-center rounded-xl border border-[#c5a880]/45 bg-white/80 text-xs font-medium text-[#1b1c1a] shadow-xs transition hover:border-[#725b38] hover:bg-white", compact ? "justify-center px-0" : "gap-2 px-3"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 shrink-0 text-[#725b38]" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "New Project"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				title: "Studio Canvas",
				"aria-label": "Studio Canvas",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Studio"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("my-2 h-px bg-[#d1c5b8]/45", compact ? "mx-2" : "mx-3") }),
			!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a]",
				children: "Workflows"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/builder",
				title: "Brief Builder",
				"aria-label": "Brief Builder",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/builder" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Brief Builder"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/nodes",
				title: "Node Studio",
				"aria-label": "Node Studio",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/nodes" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Node Studio"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/gallery",
				title: "Gallery",
				"aria-label": "Gallery",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/gallery" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Images, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Gallery"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/studies",
				title: "Studies",
				"aria-label": "Studies",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/studies" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Studies"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/method",
				title: "Method",
				"aria-label": "Method",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/method" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Method"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("my-2 h-px bg-[#d1c5b8]/45", compact ? "mx-2" : "mx-3") }),
			!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a]",
				children: "Library"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/library",
				search: { scope: "interior" },
				title: "Templates",
				"aria-label": "Templates",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/library" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Templates"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/projects",
				title: "Projects",
				"aria-label": "Projects",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/projects" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Projects"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/assets",
				title: "Assets Library",
				"aria-label": "Assets Library",
				onClick: onPicked,
				className: cn("flex h-9.5 items-center rounded-xl text-sm transition", compact ? "justify-center px-0" : "gap-2.5 px-3", pathname === "/assets" ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-white/70 hover:text-[#1b1c1a]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 shrink-0" }), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Assets Library"
				}) : null]
			})
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-dvh overflow-hidden bg-[#fbf9f5] text-[#1b1c1a]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed -top-32 left-1/4 z-0 h-[550px] w-[750px] rounded-full bg-[#fedeb2]/25 blur-[140px]",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed top-1/2 right-12 z-0 h-[500px] w-[600px] rounded-full bg-[#ffdbcd]/20 blur-[160px]",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed -bottom-40 left-10 z-0 h-[450px] w-[500px] rounded-full bg-[#dfe2ed]/30 blur-[130px]",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("relative z-20 hidden h-full shrink-0 flex-col overflow-hidden border-r border-[#d1c5b8]/45 bg-[#f5f3ef]/88 backdrop-blur-xl transition-[width] duration-200 lg:flex", railCollapsed ? "w-[64px]" : "w-[216px]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("flex h-16 items-center border-b border-[#d1c5b8]/30", railCollapsed ? "justify-center px-2" : "justify-between px-4"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex min-w-0 items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), !railCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-serif text-sm font-semibold uppercase tracking-wider text-[#1b1c1a]",
									children: "Oriel · Atelier"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-serif text-[10px] uppercase tracking-[0.16em] text-[#725b38]",
									children: "Spatial Studio"
								})]
							}) : null]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: cn("no-scrollbar flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pt-3", railCollapsed ? "px-2" : "px-2.5"),
						"aria-label": "Modules",
						children: renderNavItems(railCollapsed)
					}),
					!railCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/plans",
						className: "mx-3 mt-auto mb-3 rounded-2xl border border-[#d1c5b8]/45 bg-white/80 px-3 py-2.5 text-[#1b1c1a] shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center justify-between text-xs font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5 text-[#725b38]" }), " Pro Plan"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#725b38]",
									children: "Upgrade →"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1.5 block font-mono text-[11px] tabular-nums text-[#4d463c]",
								suppressHydrationWarning: true,
								children: [
									credits.toLocaleString(),
									" / ",
									CREDIT_MAX.toLocaleString(),
									" cr"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1.5 block h-1 overflow-hidden rounded-full bg-[#e4e2de]",
								suppressHydrationWarning: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block h-full rounded-full bg-[#725b38]",
									style: { width: `${Math.round(credits / CREDIT_MAX * 100)}%` },
									suppressHydrationWarning: true
								})
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/plans",
						title: `Pro Plan (${credits.toLocaleString()} credits)`,
						"aria-label": "Pro Plan",
						className: "mx-auto mt-auto mb-3 grid size-10 place-items-center rounded-xl border border-[#d1c5b8]/50 bg-white/75 text-[#725b38] shadow-xs hover:bg-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4" })
					})
				]
			}),
			mobileNavOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex bg-black/45 backdrop-blur-xs lg:hidden",
				onClick: () => setMobileNavOpen(false),
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "Mobile Navigation",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "flex h-full w-68 flex-col overflow-y-auto border-r border-[#d1c5b8]/50 bg-[#fbf9f5] px-3 py-4 text-[#1b1c1a] shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center justify-between px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								onClick: () => setMobileNavOpen(false),
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-base font-semibold uppercase tracking-wider text-[#1b1c1a]",
									children: "Oriel · Atelier"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMobileNavOpen(false),
								"aria-label": "Close navigation menu",
								className: "grid size-9 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "flex flex-1 flex-col gap-0.5",
							"aria-label": "Mobile Modules",
							children: renderNavItems(false, () => setMobileNavOpen(false))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/plans",
							onClick: () => setMobileNavOpen(false),
							className: "mt-4 rounded-xl border border-[#d1c5b8]/50 bg-white px-3 py-2.5 text-xs text-[#1b1c1a]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center justify-between font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5 text-[#725b38]" }), " Pro Plan"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono tabular-nums text-[#725b38]",
									children: [credits.toLocaleString(), " cr"]
								})]
							})
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex min-h-0 min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "relative z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[#d1c5b8]/35 bg-white/70 px-3 backdrop-blur-2xl shadow-[0_1px_8px_rgba(197,168,128,0.08)] md:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-center gap-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": "mobile-menu-btn",
										onClick: () => setMobileNavOpen(true),
										"aria-label": "Open navigation menu",
										className: "grid size-9 shrink-0 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#1b1c1a] lg:hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": "toggle-sidebar-rail-btn",
										onClick: () => setRailCollapsed((v) => !v),
										"aria-label": railCollapsed ? "Expand navigation rail" : "Collapse navigation rail",
										title: railCollapsed ? "Show sidebar labels" : "Expand canvas width",
										className: "hidden size-9 shrink-0 place-items-center rounded-xl border border-[#d1c5b8]/50 bg-[#f5f3ef]/80 text-[#4d463c] transition hover:border-[#725b38] hover:text-[#1b1c1a] lg:grid",
										children: railCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/",
										className: "flex items-center gap-2 lg:hidden",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif text-sm font-semibold uppercase tracking-wider text-[#1b1c1a]",
											children: "Oriel"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden items-center gap-2 text-xs text-[#4d463c] lg:flex",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-serif font-semibold tracking-wider text-[#1b1c1a] uppercase",
												children: "Oriel · Atelier"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "text-[#c5a880]",
												children: "/"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate font-medium text-[#4d463c]",
												children: pathname === "/" ? `${design.look} · ${activeRouteLabel}` : activeRouteLabel
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "no-scrollbar hidden min-w-0 items-center gap-1 rounded-full bg-[#efeeea]/80 p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] md:flex",
								"aria-label": "Space mode",
								children: VERTICALS.map((item) => {
									const active = pathname === "/" && design.vertical === item.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setVertical(item.id);
											if (pathname !== "/") navigate({ to: "/" });
										},
										className: cn("h-7.5 shrink-0 whitespace-nowrap rounded-full px-3.5 text-xs tracking-wide transition", active ? "bg-[#c5a880] font-medium text-[#281800] shadow-xs" : "text-[#4d463c] hover:text-[#1b1c1a]"),
										children: item.label
									}, item.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "open-market-copilot-btn",
										onClick: () => setCopilotOpen(true),
										"aria-label": "Market Copilot",
										className: "inline-flex h-9 items-center gap-1.5 rounded-full bg-[#c5a880] px-3 text-xs font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-3.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline",
												children: "Copilot"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[11px] tabular-nums opacity-85",
												children: [
													"(",
													appliedSuggestionIds.length,
													"/160)"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setOpen(true),
										className: "inline-flex h-9 items-center gap-2 rounded-full bg-[#efeeea]/80 px-3 text-xs text-[#4d463c] transition hover:bg-[#efeeea] hover:text-[#1b1c1a]",
										"aria-label": "Search the library",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5 text-[#725b38]" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden xl:inline",
												children: "Command"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
												className: "hidden rounded bg-[#eae8e4] px-1.5 py-0.5 font-mono text-[10px] text-[#4d463c] xl:inline",
												children: "⌘K"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/plans",
										"aria-label": "Credits and Plans",
										className: "hidden h-9 items-center gap-1.5 rounded-full bg-[#c5a880]/20 px-3 font-mono text-xs font-medium tabular-nums text-[#513d1d] shadow-[inset_0_0_0_1px_rgba(197,168,128,0.4)] hover:bg-[#c5a880]/30 sm:inline-flex",
										suppressHydrationWarning: true,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5 text-[#725b38]" }),
											credits.toLocaleString(),
											" / 5k CR"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setNoticesOpen((v) => !v),
											className: "relative grid size-9 shrink-0 place-items-center rounded-full text-[#4d463c] transition hover:bg-[#eae8e4] hover:text-[#1b1c1a]",
											"aria-label": "Notices",
											"aria-expanded": noticesOpen,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), hasNotices ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "sr-only",
												children: "Active notifications"
											}) : null]
										}), noticesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											"data-testid": "notices-popover",
											className: "absolute top-11 right-0 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#d1c5b8]/60 bg-white/95 p-3 shadow-2xl backdrop-blur-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between border-b border-[#d1c5b8]/40 pb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-serif text-sm font-semibold text-[#1b1c1a]",
													children: "Studio Render Activity"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [log.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => clearLog(),
														className: "text-[11px] font-medium text-[#725b38] hover:underline",
														children: "Clear"
													}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setNoticesOpen(false),
														className: "grid size-6 place-items-center rounded-full text-[#7f766a] hover:bg-[#f5f3ef]",
														"aria-label": "Close activity",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 max-h-72 space-y-2 overflow-y-auto",
												children: log.length === 0 && queue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "py-4 text-center text-xs text-[#4d463c]",
													children: "No render activity yet. Generate a plate or run a batch pass."
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [queue.slice(0, 3).map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-xl border border-[#d1c5b8]/40 bg-[#f5f3ef]/70 px-2.5 py-2 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate font-medium text-[#1b1c1a]",
															children: q.label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-[10px] uppercase text-[#725b38]",
															children: q.status
														})]
													})
												}, q.id)), log.slice(0, 8).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl border border-[#d1c5b8]/35 bg-[#fbf9f5] px-2.5 py-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-medium text-[#1b1c1a]",
														children: entry.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-0.5 line-clamp-2 text-[11px] text-[#4d463c]",
														children: entry.text
													})]
												}, entry.id))] })
											})]
										}) : null]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					pathname === "/" || pathname === "/builder" || pathname === "/gallery" || pathname === "/nodes" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {
				open,
				onOpenChange: setOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketCopilotDrawer, {
				open: copilotOpen,
				onOpenChange: setCopilotOpen
			}),
			hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "light",
				position: "bottom-center"
			}) : null
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
var styles_default = "/assets/styles-N3iU7k2U.css";
var Route$13 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Oriel · Atelier — Spatial Architectural Visualization Studio" },
			{
				name: "description",
				content: "Compose architectural visualization briefs and adapt them for GPT Image, Midjourney, Firefly, FLUX, and Gemini."
			},
			{
				name: "theme-color",
				content: "#fbf9f5"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", {
			suppressHydrationWarning: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			suppressHydrationWarning: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$10 = () => import("./routes-xOnUCJFd.mjs");
var Route$12 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./assets-CjoK_osD.mjs");
var Route$11 = createFileRoute("/assets")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./builder-DYx1DPjC.mjs");
var Route$10 = createFileRoute("/builder")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./gallery-DpyHucnZ.mjs");
var Route$9 = createFileRoute("/gallery")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./library-B76l3gI_.mjs");
var SCOPES = [
	"architecture",
	"interior",
	"exterior",
	"landscape"
];
var Route$8 = createFileRoute("/library")({
	validateSearch: (search) => ({ scope: SCOPES.includes(search.scope) ? search.scope : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./method-Dtrq-DhN.mjs");
var Route$7 = createFileRoute("/method")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./nodes-DCSkc59s.mjs");
var Route$6 = createFileRoute("/nodes")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./plans-CVVv-H0O.mjs");
var Route$5 = createFileRoute("/plans")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./projects-DQUkwUOk.mjs");
var Route$4 = createFileRoute("/projects")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./studies-DVM8fLSj.mjs");
var Route$3 = createFileRoute("/studies")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./studio-CieWKANv.mjs");
var Route$2 = createFileRoute("/studio")({
	validateSearch: (search) => ({
		study: typeof search.study === "string" ? search.study : void 0,
		template: typeof search.template === "string" ? search.template : void 0,
		brief: typeof search.brief === "string" ? search.brief.slice(0, 800) : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$1 = createFileRoute("/api/nvidia-vision")({ server: { handlers: {
	GET: async () => {
		const { getNvidiaVisionStatus } = await import("./nvidia-vision.server-C9wJzhVA.mjs");
		return Response.json(getNvidiaVisionStatus());
	},
	POST: async ({ request }) => {
		const { handleNvidiaVisionRequest } = await import("./nvidia-vision.server-C9wJzhVA.mjs");
		return handleNvidiaVisionRequest(request);
	}
} } });
var Route = createFileRoute("/api/gemini/vision")({ server: { handlers: {
	GET: async () => {
		const { getGeminiStatus } = await import("./gemini.server-DcB80llX.mjs");
		return Response.json(getGeminiStatus());
	},
	POST: async ({ request }) => {
		const { handleGeminiVisionRequest } = await import("./gemini.server-DcB80llX.mjs");
		return handleGeminiVisionRequest(request);
	}
} } });
var rootRouteChildren = {
	IndexRoute: Route$12.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$13
	}),
	AssetsRoute: Route$11.update({
		id: "/assets",
		path: "/assets",
		getParentRoute: () => Route$13
	}),
	BuilderRoute: Route$10.update({
		id: "/builder",
		path: "/builder",
		getParentRoute: () => Route$13
	}),
	GalleryRoute: Route$9.update({
		id: "/gallery",
		path: "/gallery",
		getParentRoute: () => Route$13
	}),
	LibraryRoute: Route$8.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$13
	}),
	MethodRoute: Route$7.update({
		id: "/method",
		path: "/method",
		getParentRoute: () => Route$13
	}),
	NodesRoute: Route$6.update({
		id: "/nodes",
		path: "/nodes",
		getParentRoute: () => Route$13
	}),
	PlansRoute: Route$5.update({
		id: "/plans",
		path: "/plans",
		getParentRoute: () => Route$13
	}),
	ProjectsRoute: Route$4.update({
		id: "/projects",
		path: "/projects",
		getParentRoute: () => Route$13
	}),
	StudiesRoute: Route$3.update({
		id: "/studies",
		path: "/studies",
		getParentRoute: () => Route$13
	}),
	StudioRoute: Route$2.update({
		id: "/studio",
		path: "/studio",
		getParentRoute: () => Route$13
	}),
	ApiNvidiaVisionRoute: Route$1.update({
		id: "/api/nvidia-vision",
		path: "/api/nvidia-vision",
		getParentRoute: () => Route$13
	}),
	ApiGeminiVisionRoute: Route.update({
		id: "/api/gemini/vision",
		path: "/api/gemini/vision",
		getParentRoute: () => Route$13
	})
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
export { outpaintPlate as C, formatWhen as D, cn as E, inpaintPlate as S, segmentObjectWithSam2 as T, useGenerate as _, ENHANCE_ENVIRONMENTS as a, generatePlate as b, buildEnhanceDirective as c, resolveIntentFromStage as d, setPending3DFile as f, MidLayerBar as g, buildAtelierIterationCards as h, Composer as i, consumePending3DFile as l, ATMOSPHERIC_REGIMES as m, Route$2 as n, ENHANCE_SCOPES as o, ATELIER_VERTICAL_HERO as p, Route$8 as r, WORKFLOW_INTENTS as s, router_exports as t, defaultEnhanceEnvironmentForVertical as u, readImage as v, relightPlate as w, generateVariations as x, enhancePlate as y };
