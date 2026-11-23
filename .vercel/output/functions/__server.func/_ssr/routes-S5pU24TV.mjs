import { o as __toESM } from "../_runtime.mjs";
import { C as toCompactDataUrlForSegmentation, D as extractBinaryBitmapFromRgba, E as estimateDataUrlBytes, T as encodeBinaryBitmapToRgba, _ as runMaterialIdPass, c as runDepthAnythingPass, d as runGroundedSamMask, f as runInteractiveSamMultiPointMask, o as runAnnotatorPass, r as extractFloorPlanGrid, t as MATERIAL_ID_CLASSES, u as runGroundedSam2Segment, w as encodeBinaryBitmapToOverlayRgba, x as runSam2RegionSegment } from "./cv-pipeline-EdvoIUBz.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, c as require_react_dom, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as appendSuggestionToIdea } from "./archviz-dictionary-CAfLFfRY.mjs";
import { A as LOOKS, D as IOPAINT_TASKS, E as IOPAINT_REMOVEBG_MODELS, F as RATIOS, I as RELIGHT_PRESETS, J as TIMES, K as TAGS, L as RENDER_FIDELITIES, M as OUTPAINT_RATIOS, N as PEOPLE, O as IPADAPTER_PRESETS, P as RANGES, Q as WORKFLOW_PRESETS, S as GROUPS, T as IOPAINT_MODELS, U as SKETCH_MODES, W as STRENGTHS, X as WEATHER, Y as VERTICALS, _ as ENHANCE_MODES, b as FACADE_TYPOLOGIES, bt as synthesizeFallbackComposite, c as COLORS, ct as frameAspect, et as buildArchviz100AppliedPrompt, h as DETAIL_DENSITIES, ht as rewritePromptForUploadedImage, i as CAMERAS, j as MOODS, k as LIGHTS, lt as frameAspectNumber, m as DETAILS, mt as resolveSmartPlaceholders, n as ADVANCED_GROUPS, r as ANNOTATOR_MODES, rt as buildZuke119AppliedPrompt, s as CLIMATE_REGIONS, t as ACTIVITIES, ut as frameEdge, v as ESRGAN_MODELS, vt as sanitizeFrame, w as IOPAINT_FACE_MODELS, y as EXTRA_PILLS } from "./preset-transform-Du2fVesw.mjs";
import { n as parseImageDimensionsFromDataUrl } from "./image-aspect-CUpH0y4a.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Shuffle, At as Hexagon, Bt as FlipHorizontal, C as Stamp, D as Sparkles, Dt as ImagePlus, En as ArrowUpRight, Et as Image$1, F as Search, G as Plus, H as RefreshCw, I as Scissors, J as Pencil, Jt as EyeOff, K as Play, L as ScanSearch, M as ShieldAlert, Nt as Grid2x2, O as SlidersVertical, P as Send, Pt as Grid3x3, Qt as Download, R as ScanLine, Sn as Binary, T as SquareDashed, U as Radio, V as RotateCcw, X as PanelRightOpen, Xt as Expand, Z as PanelRightClose, Zt as Eraser, an as Columns2, b as SunMoon, bt as Layers, d as User, dn as ChevronUp, dt as Maximize2, en as Crosshair, et as Palette, f as UserCheck, fn as ChevronDown, g as Trash2, gt as Link2, hn as Camera, ht as LoaderCircle, i as X, in as Compass, it as MousePointer2, j as ShieldCheck, jt as Heart, k as SlidersHorizontal, ln as CircleCheck, m as Type, mt as LockOpen, nn as Copy, o as Workflow, ot as Minus, p as Upload, pn as Check, pt as Lock, qt as Eye, tn as Cpu, tt as Paintbrush, v as Sunset, vn as Box, w as Square, x as SunMedium, xt as Languages, y as Sun, z as ScanEye } from "../_libs/lucide-react.mjs";
import { $ as inpaintPlate, $t as matchesNodeSearch, A as Composer, Bt as createNodeInstance, Ct as PRD_LIGHT_PALETTE, Dt as WORKFLOW_TEMPLATES, Et as PRESET_200_CATEGORIES, G as readImage, Ht as detectFloorPlanWallsFromGrid, I as defaultEnhanceEnvironmentForVertical, It as compileSentencePrompt, K as ATELIER_VERTICAL_HERO, Kt as filterIntentLooks40, L as resolveIntentFromStage, M as ENHANCE_SCOPES, N as WORKFLOW_INTENTS, Ot as autoLayoutGraph, P as buildEnhanceDirective, R as setPending3DFile, Tt as PRESETS_200, Wt as filterArchviz100, Xt as getNodeSpec, Y as useGenerate, Z as generatePlate, a as ZUKE_VIZ_CATEGORIES_14, bt as NODE_CATALOG, c as StudioHeadSlotContext, cn as useHydrated, dt as CATEGORY_META, ft as ENTOURAGE_CATALOG, ht as INTENT_LOOKS_40, j as ENHANCE_ENVIRONMENTS, l as FidelityGateModal, ln as useOriel, o as filterZukeViz119, ot as ARCHVIZ_100_CATEGORIES, q as ATMOSPHERIC_REGIMES, qt as filterPresets200, rt as cn, s as inferZukeVertical, un as validateWorkflowGraph, wt as PRD_MATERIAL_PALETTE, xt as PLAIN_QUESTIONS_8 } from "./router-CL69nk8u.mjs";
import { c as SplitViewportStage, l as Viewport3D, n as King360StudioPanel, o as ResilientPlateImage, r as KumVideoStudioPanel, t as CameraOpticsBar } from "./studio-modes-Br-v1pIT.mjs";
import { t as Compare } from "./compare-CXd6Zjqg.mjs";
import { n as executeNodeWorkflow, t as NodeStudioCanvas } from "./node-executor-kNiofInY.mjs";
import { a as NVIDIA_SAMPLE_IMAGE_URL, o as NVIDIA_VISION_MODEL, p as resolveNvidiaApiUrl, s as NVIDIA_VISION_QUICK_PROMPTS, t as NVIDIA_DEFAULT_PROMPT, u as extractNvidiaSseDelta } from "./nvidia-vision-CaoHqj5Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-S5pU24TV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var SAM_CONCEPTS = [
	"facade glazing",
	"roof",
	"water pool",
	"foliage",
	"sky",
	"flooring"
];
function drawFloorPlanOverlayPreview(src, bp) {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const w = 720;
			const h = 480;
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				resolve(src);
				return;
			}
			ctx.fillStyle = "#1a1714";
			ctx.fillRect(0, 0, w, h);
			ctx.globalAlpha = .35;
			ctx.drawImage(img, 0, 0, w, h);
			ctx.globalAlpha = 1;
			const sx = w / bp.footprintWidth;
			const sz = h / bp.footprintDepth;
			for (const wall of bp.walls) {
				const px = (wall.x + bp.footprintWidth * .5) * sx;
				const pz = (wall.z + bp.footprintDepth * .5) * sz;
				const ww = Math.max(6, wall.width * sx);
				const wd = Math.max(6, wall.depth * sz);
				ctx.fillStyle = wall.hasDoorGap ? "rgba(74, 222, 128, 0.85)" : "rgba(231, 194, 122, 0.9)";
				ctx.fillRect(px - ww * .5, pz - wd * .5, ww, wd);
			}
			resolve(canvas.toDataURL("image/png"));
		};
		img.onerror = () => resolve(src);
		img.src = src;
	});
}
function CvPreprocessorStage({ aspect, sourceUrl, onSendMapToSketch, onSendMaskToInpaint, onLockAndRender, onExtrudeFloorPlan }) {
	const engine = useOriel((state) => state.engine);
	const setEngineField = useOriel((state) => state.setEngineField);
	const setScene3DField = useOriel((state) => state.setScene3DField);
	const floorPlanBlueprint = useOriel((state) => state.floorPlanBlueprint);
	const setFloorPlanBlueprint = useOriel((state) => state.setFloorPlanBlueprint);
	const setConditioningChannel = useOriel((state) => state.setConditioningChannel);
	const [cvMode, setCvMode] = (0, import_react.useState)("annotator");
	const [samEngine, setSamEngine] = (0, import_react.useState)("sam2");
	const [depthHeatmap, setDepthHeatmap] = (0, import_react.useState)(true);
	const [depthBias, setDepthBias] = (0, import_react.useState)(50);
	const [samPoint, setSamPoint] = (0, import_react.useState)(null);
	const [planSrcOverride, setPlanSrcOverride] = (0, import_react.useState)(null);
	const [outputUrl, setOutputUrl] = (0, import_react.useState)(sourceUrl);
	const [samMaskUrl, setSamMaskUrl] = (0, import_react.useState)(null);
	const [samCoverage, setSamCoverage] = (0, import_react.useState)(null);
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const imgBoxRef = (0, import_react.useRef)(null);
	const planFileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function compute() {
			setProcessing(true);
			try {
				if (cvMode === "annotator") {
					const mode = engine.annotatorMode === "none" ? "mlsd" : engine.annotatorMode;
					const res = await runAnnotatorPass(sourceUrl, mode, engine.annotatorThreshold);
					if (!cancelled) {
						setOutputUrl(res.dataUrl);
						setConditioningChannel("annotator", res.dataUrl);
					}
				} else if (cvMode === "depth") {
					const res = await runDepthAnythingPass(sourceUrl, depthHeatmap, depthBias);
					if (!cancelled) {
						setOutputUrl(res.dataUrl);
						setConditioningChannel("depth", res.dataUrl);
					}
				} else if (cvMode === "material-id") {
					const res = await runMaterialIdPass(sourceUrl);
					if (!cancelled) setOutputUrl(res.dataUrl);
				} else if (cvMode === "floorplan") {
					const planInput = planSrcOverride ?? sourceUrl;
					const { mask, cols, rows } = await extractFloorPlanGrid(planInput);
					const bp = detectFloorPlanWallsFromGrid(mask, cols, rows);
					const overlayUrl = await drawFloorPlanOverlayPreview(planInput, bp);
					if (!cancelled) {
						setFloorPlanBlueprint(bp);
						setOutputUrl(overlayUrl);
					}
				} else if (samEngine === "sam2") {
					const res = await runSam2RegionSegment({
						src: sourceUrl,
						point: samPoint ?? {
							xNorm: .5,
							yNorm: .5
						},
						threshold: engine.samThreshold
					});
					if (!cancelled) {
						setOutputUrl(res.previewUrl);
						setSamMaskUrl(res.maskDataUrl);
						setSamCoverage(res.coveragePct);
					}
				} else {
					const res = await runGroundedSamMask({
						src: sourceUrl,
						prompt: engine.samPrompt || "facade glazing",
						point: samPoint,
						threshold: engine.samThreshold
					});
					if (!cancelled) {
						setOutputUrl(res.previewUrl);
						setSamMaskUrl(res.maskDataUrl);
						setSamCoverage(res.coveragePct);
					}
				}
			} catch {
				if (!cancelled) setOutputUrl(sourceUrl);
			} finally {
				if (!cancelled) setProcessing(false);
			}
		}
		compute();
		return () => {
			cancelled = true;
		};
	}, [
		sourceUrl,
		planSrcOverride,
		cvMode,
		samEngine,
		engine.annotatorMode,
		engine.annotatorThreshold,
		depthHeatmap,
		depthBias,
		engine.samPrompt,
		engine.samThreshold,
		samPoint,
		setConditioningChannel,
		setFloorPlanBlueprint
	]);
	function handleCanvasClick(event) {
		if (cvMode !== "sam" || !imgBoxRef.current) return;
		const rect = imgBoxRef.current.getBoundingClientRect();
		const xNorm = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
		const yNorm = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
		setSamPoint({
			xNorm,
			yNorm
		});
	}
	function handleExtrudeTo3D() {
		setScene3DField("preset", "plan-extrude");
		onExtrudeFloorPlan?.();
		toast.success("Extruded floor plan walls into 3D Viewport!");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "cv-preprocessor-stage",
		className: "relative flex w-full flex-col overflow-hidden bg-[#181512]",
		style: {
			aspectRatio: aspect,
			minHeight: "380px",
			maxHeight: "64vh"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: imgBoxRef,
			onClick: handleCanvasClick,
			className: cn("relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 pb-32", cvMode === "sam" && "cursor-crosshair"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: outputUrl,
					alt: "CV Preprocessor output",
					className: "max-h-full max-w-full rounded-xl object-contain shadow-lg"
				}),
				cvMode === "sam" && samPoint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e7c27a] bg-[#e7c27a]/35 shadow-md",
					style: {
						left: `${samPoint.xNorm * 100}%`,
						top: `${samPoint.yNorm * 100}%`
					}
				}) : null,
				processing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#14110f]/90 px-3 py-1 text-[11px] text-[#e7c27a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }), " Processing map…"]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-3 right-3 rounded-full bg-[#14110f]/90 px-3 py-1 font-mono text-[10px] text-[#e4dacb]",
					children: cvMode === "annotator" ? `Annotators · ${(engine.annotatorMode === "none" ? "mlsd" : engine.annotatorMode).toUpperCase()}` : cvMode === "depth" ? `Depth-Anything-V2 · ${depthHeatmap ? "Inferno" : "Z-Gray"}` : cvMode === "material-id" ? "Material ID Map · 8 Classes" : cvMode === "floorplan" ? `Plan Detector · ${floorPlanBlueprint?.walls.length ?? 0} walls` : `${samEngine === "sam2" ? "SAM-2 Region" : "Grounded-SAM"}${samCoverage !== null ? ` · ${samCoverage}%` : ""}`
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-white/15 bg-[#14110f]/95 p-3 text-xs text-[#f6efe4] shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-1 rounded-full bg-white/5 p-0.5",
					children: [
						[
							"annotator",
							"Annotators",
							ScanLine
						],
						[
							"depth",
							"Depth-Anything-V2",
							Layers
						],
						[
							"sam",
							"SAM-2 / Grounded",
							Crosshair
						],
						[
							"material-id",
							"Material ID",
							Grid3x3
						],
						[
							"floorplan",
							"Plan → 3D Walls",
							Box
						]
					].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCvMode(id),
						className: cn("inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium transition", cvMode === id ? "gold-fill text-[#2a1c0c]" : "text-[#d5cab9] hover:text-white"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3" }),
							" ",
							label
						]
					}, id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [cvMode === "floorplan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleExtrudeTo3D,
						className: "inline-flex h-8 items-center gap-1 rounded-full border border-[#e7c27a]/60 bg-[#e7c27a]/15 px-3 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#e7c27a]/25",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-3.5" }), " Extrude in 3D Viewport"]
					}) : cvMode === "sam" && samMaskUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSendMaskToInpaint(samMaskUrl, samEngine === "sam2" ? "SAM-2 clicked region" : engine.samPrompt || "selected segment"),
						className: "inline-flex h-8 items-center gap-1 rounded-full border border-[#e7c27a]/60 bg-[#e7c27a]/15 px-3 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#e7c27a]/25",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3.5" }), " Segment → Inpaint Mask"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSendMapToSketch(outputUrl),
						className: "inline-flex h-8 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 text-[#e7c27a]" }), " Map → Sketch Trace"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onLockAndRender,
						className: "gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Render with Conditioning"]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2.5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-2.5",
				children: cvMode === "annotator" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center gap-1",
					children: ANNOTATOR_MODES.filter((m) => m.id !== "none").map((m) => {
						const active = (engine.annotatorMode === "none" ? "mlsd" : engine.annotatorMode) === m.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setEngineField("annotatorMode", m.id),
							className: cn("h-7 rounded-full border px-2.5 text-[11px] transition", active ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#dfd5c6]"),
							children: m.label
						}, m.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "ml-auto flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#cbbba6]",
							children: "Edge Gain"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 15,
							max: 100,
							value: engine.annotatorThreshold,
							onChange: (e) => setEngineField("annotatorThreshold", Number(e.target.value)),
							className: "h-1.5 w-24 accent-[#d4b06a]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "w-8 text-right font-mono text-[10px]",
							children: [engine.annotatorThreshold, "%"]
						})
					]
				})] }) : cvMode === "depth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setDepthHeatmap(true),
						className: cn("h-7 rounded-full border px-2.5 text-[11px]", depthHeatmap ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#dfd5c6]"),
						children: "Inferno Heatmap"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setDepthHeatmap(false),
						className: cn("h-7 rounded-full border px-2.5 text-[11px]", !depthHeatmap ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#dfd5c6]"),
						children: "Z-Buffer Grayscale"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "ml-auto flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#cbbba6]",
							children: "Near-Plane Bias"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 10,
							max: 90,
							value: depthBias,
							onChange: (e) => setDepthBias(Number(e.target.value)),
							className: "h-1.5 w-24 accent-[#d4b06a]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "w-8 text-right font-mono text-[10px]",
							children: [depthBias, "%"]
						})
					]
				})] }) : cvMode === "material-id" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium text-[#cbbba6]",
						children: "Material ID Legend:"
					}), MATERIAL_ID_CLASSES.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-[#e4dacb]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2.5 rounded-full",
							style: { backgroundColor: cls.hex }
						}), cls.label]
					}, cls.id))]
				}) : cvMode === "floorplan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => planFileRef.current?.click(),
								className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#d4b06a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3 text-[#e7c27a]" }), " Upload 2D Plan"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: planFileRef,
								type: "file",
								accept: "image/png,image/jpeg,image/webp",
								className: "sr-only",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (f) readImage(f, 1280).then((url) => setPlanSrcOverride(url));
									e.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#cbbba6]",
								children: floorPlanBlueprint?.summary ?? "Scanning floor plan dark linework for walls & openings…"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] text-[#e7c27a]",
						children: [
							floorPlanBlueprint?.roomCount ?? 0,
							" Rooms · ",
							floorPlanBlueprint?.walls.length ?? 0,
							" Walls"
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-full bg-white/5 p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSamEngine("sam2"),
							className: cn("h-6 rounded-full px-2 text-[10px] font-medium", samEngine === "sam2" ? "gold-fill text-[#2a1c0c]" : "text-[#cbbba6]"),
							children: "SAM-2 Click Region"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setSamEngine("grounded"),
							className: cn("h-6 rounded-full px-2 text-[10px] font-medium", samEngine === "grounded" ? "gold-fill text-[#2a1c0c]" : "text-[#cbbba6]"),
							children: "Grounded-SAM Text"
						})]
					}),
					samEngine === "grounded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: engine.samPrompt,
						onChange: (e) => {
							setSamPoint(null);
							setEngineField("samPrompt", e.target.value);
						},
						placeholder: "Grounded-SAM target...",
						className: "h-7 w-40 rounded-full border border-white/20 bg-black/40 px-3 text-[11px] text-white outline-none focus:border-[#d4b06a]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-1",
						children: SAM_CONCEPTS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setSamPoint(null);
								setEngineField("samPrompt", c);
							},
							className: cn("h-6 rounded-full border px-2 text-[10px]", engine.samPrompt === c && !samPoint ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#cbbba6]"),
							children: c
						}, c))
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-[#cbbba6]",
						children: "Click anywhere on the image above to flood-segment the contiguous object boundary."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "ml-auto flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#cbbba6]",
							children: "Sensitivity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 15,
							max: 90,
							value: engine.samThreshold,
							onChange: (e) => setEngineField("samThreshold", Number(e.target.value)),
							className: "h-1.5 w-20 accent-[#d4b06a]"
						})]
					})
				] })
			})]
		})]
	});
}
var MASK_W = 1280;
var MASK_H = 720;
var ARCH_SEMANTIC_TARGETS = [
	{
		id: "windows",
		label: "Windows / Glazing",
		query: "windows and glazing"
	},
	{
		id: "facade",
		label: "Facade",
		query: "facade walls"
	},
	{
		id: "furniture",
		label: "Furniture",
		query: "sofa and interior furniture"
	},
	{
		id: "floor",
		label: "Flooring",
		query: "flooring surface"
	},
	{
		id: "foliage",
		label: "Foliage",
		query: "trees and foliage"
	},
	{
		id: "lighting",
		label: "Lighting",
		query: "pendant lights and fixtures"
	},
	{
		id: "roof",
		label: "Roof / Ceiling",
		query: "roof and ceiling"
	},
	{
		id: "sky",
		label: "Sky",
		query: "sky"
	}
];
function GroundedSAM2Tool({ aspect, sourceUrl, busy = false, onGroundedSamSegment, onSendToInpaint, onOpenInpaintWorkspace, onSendToNodeEditor, onSourceChange }) {
	const engine = useOriel((s) => s.engine);
	const setEngineField = useOriel((s) => s.setEngineField);
	const setMaskDataUrl = useOriel((s) => s.setMaskDataUrl);
	const binaryMaskDataUrl = useOriel((s) => s.binaryMaskDataUrl);
	const binaryMaskStats = useOriel((s) => s.binaryMaskStats);
	const setBinaryMaskData = useOriel((s) => s.setBinaryMaskData);
	const displayCanvasRef = (0, import_react.useRef)(null);
	const workingOverlayRef = (0, import_react.useRef)(null);
	const historyRef = (0, import_react.useRef)([]);
	const fileInputRef = (0, import_react.useRef)(null);
	const [clickMode, setClickMode] = (0, import_react.useState)("include");
	const [targetQuery, setTargetQuery] = (0, import_react.useState)(engine.samPrompt || "windows and glazing");
	const [threshold, setThreshold] = (0, import_react.useState)(engine.samThreshold || 45);
	const [posPoints, setPosPoints] = (0, import_react.useState)([]);
	const [negPoints, setNegPoints] = (0, import_react.useState)([]);
	const [detectedBoxes, setDetectedBoxes] = (0, import_react.useState)([]);
	const [activeBoxIdx, setActiveBoxIdx] = (0, import_react.useState)(null);
	const [segmenting, setSegmenting] = (0, import_react.useState)(false);
	const [viewMode, setViewMode] = (0, import_react.useState)("overlay");
	const [localStats, setLocalStats] = (0, import_react.useState)(null);
	const [invertOutput, setInvertOutput] = (0, import_react.useState)(false);
	const [frameAspect, setFrameAspect] = (0, import_react.useState)(aspect);
	const effectiveSource = sourceUrl || "/viz/t03-compact-living-room.jpg";
	(0, import_react.useEffect)(() => {
		setFrameAspect(aspect);
	}, [aspect, effectiveSource]);
	function ensureWorkingOverlay() {
		if (!workingOverlayRef.current) {
			const c = document.createElement("canvas");
			c.width = MASK_W;
			c.height = MASK_H;
			workingOverlayRef.current = c;
		}
		return workingOverlayRef.current;
	}
	const redrawCanvas = (0, import_react.useCallback)(() => {
		const display = displayCanvasRef.current;
		if (!display) return;
		const ctx = display.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		ctx.clearRect(0, 0, MASK_W, MASK_H);
		if (viewMode === "original") return;
		if (viewMode === "binary" && binaryMaskDataUrl) {
			const binImg = new Image();
			binImg.onload = () => {
				ctx.clearRect(0, 0, MASK_W, MASK_H);
				ctx.drawImage(binImg, 0, 0, MASK_W, MASK_H);
			};
			binImg.src = binaryMaskDataUrl;
			return;
		}
		const layer = workingOverlayRef.current;
		if (layer) ctx.drawImage(layer, 0, 0, MASK_W, MASK_H);
	}, [viewMode, binaryMaskDataUrl]);
	(0, import_react.useEffect)(() => {
		redrawCanvas();
	}, [redrawCanvas]);
	function commitBinaryMaskFromCanvas(invertFlag = invertOutput) {
		const layer = ensureWorkingOverlay();
		const lCtx = layer.getContext("2d", { willReadFrequently: true });
		if (!lCtx) return;
		const imgData = lCtx.getImageData(0, 0, MASK_W, MASK_H);
		const extracted = extractBinaryBitmapFromRgba(imgData.data, MASK_W, MASK_H, 24);
		setLocalStats(extracted);
		if (extracted.activePixels === 0) {
			setMaskDataUrl(null);
			setBinaryMaskData(null, null);
			return;
		}
		const overlayRgba = encodeBinaryBitmapToOverlayRgba(extracted.bitmap, MASK_W, MASK_H);
		const overlayData = lCtx.createImageData(MASK_W, MASK_H);
		overlayData.data.set(overlayRgba);
		lCtx.putImageData(overlayData, 0, 0);
		const overlayUrl = layer.toDataURL("image/png");
		const bwCanvas = document.createElement("canvas");
		bwCanvas.width = MASK_W;
		bwCanvas.height = MASK_H;
		const bwCtx = bwCanvas.getContext("2d");
		if (bwCtx) {
			const bwRgba = encodeBinaryBitmapToRgba(extracted.bitmap, MASK_W, MASK_H, invertFlag);
			const bwImgData = bwCtx.createImageData(MASK_W, MASK_H);
			bwImgData.data.set(bwRgba);
			bwCtx.putImageData(bwImgData, 0, 0);
			const binaryPng = bwCanvas.toDataURL("image/png");
			setBinaryMaskData(binaryPng, {
				width: extracted.width,
				height: extracted.height,
				activePixels: extracted.activePixels,
				coveragePct: extracted.coveragePct
			});
		}
		setMaskDataUrl(overlayUrl);
		redrawCanvas();
	}
	function applyMaskUrlToTool(maskUrl) {
		const ctx = ensureWorkingOverlay().getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		historyRef.current = [...historyRef.current.slice(-10), ctx.getImageData(0, 0, MASK_W, MASK_H)];
		const img = new Image();
		img.onload = () => {
			ctx.clearRect(0, 0, MASK_W, MASK_H);
			ctx.drawImage(img, 0, 0, MASK_W, MASK_H);
			commitBinaryMaskFromCanvas(invertOutput);
		};
		img.src = maskUrl;
	}
	async function runTextOrChipSegment(query, forcedBoxes) {
		const clean = query.trim() || "windows and glazing";
		setTargetQuery(clean);
		setEngineField("samPrompt", clean);
		setEngineField("samThreshold", threshold);
		setSegmenting(true);
		try {
			let boxes = forcedBoxes;
			let modelLabel = "grounded-sam-2";
			if (!boxes) {
				const detection = await onGroundedSamSegment(clean, effectiveSource);
				boxes = detection.boxes;
				modelLabel = detection.model;
				setDetectedBoxes(boxes);
				setActiveBoxIdx(null);
			}
			const segmented = await runGroundedSam2Segment({
				src: effectiveSource,
				prompt: clean,
				boxes,
				posPoints,
				negPoints,
				threshold
			});
			applyMaskUrlToTool(segmented.maskDataUrl);
			if (segmented.boxes.length > 0 && !forcedBoxes) setDetectedBoxes(segmented.boxes);
			toast.success(`Binary mask generated for "${clean}" (${segmented.coveragePct}% · ${modelLabel})`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Grounded-SAM 2 segmentation failed.");
		} finally {
			setSegmenting(false);
		}
	}
	async function handleCanvasClick(e) {
		const canvas = displayCanvasRef.current;
		if (!canvas || segmenting) return;
		const rect = canvas.getBoundingClientRect();
		const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
		const yNorm = Math.max(0, Math.min(1, (e.clientY - rect.top) / Math.max(1, rect.height)));
		if (clickMode === "exclude" && posPoints.length === 0 && detectedBoxes.length === 0) {
			toast.message("Click on an element in Include (+) mode first before excluding regions.");
			return;
		}
		const nextPos = clickMode === "include" ? [...posPoints, {
			xNorm,
			yNorm
		}] : posPoints;
		const nextNeg = clickMode === "exclude" ? [...negPoints, {
			xNorm,
			yNorm
		}] : negPoints;
		setPosPoints(nextPos);
		setNegPoints(nextNeg);
		setSegmenting(true);
		try {
			let boxesToUse = detectedBoxes;
			let activeLabel = targetQuery;
			if (clickMode === "include" && boxesToUse.length === 0) {
				const detection = await onGroundedSamSegment("architectural element", effectiveSource, {
					xNorm,
					yNorm
				});
				if (!detection.fallback && detection.boxes.length > 0) {
					boxesToUse = detection.boxes;
					activeLabel = detection.boxes[0]?.label || targetQuery;
					setDetectedBoxes(boxesToUse);
					setActiveBoxIdx(0);
					setTargetQuery(activeLabel);
				}
			}
			const result = boxesToUse.length > 0 ? await runGroundedSam2Segment({
				src: effectiveSource,
				prompt: activeLabel,
				boxes: activeBoxIdx !== null && boxesToUse[activeBoxIdx] ? [boxesToUse[activeBoxIdx]] : boxesToUse,
				posPoints: nextPos,
				negPoints: nextNeg,
				threshold
			}) : await runInteractiveSamMultiPointMask({
				src: effectiveSource,
				posPoints: nextPos,
				negPoints: nextNeg,
				threshold
			});
			applyMaskUrlToTool(result.maskDataUrl);
			toast.success(`Binary mask updated (${result.coveragePct}% foreground)`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Click-to-mask segmentation failed.");
		} finally {
			setSegmenting(false);
		}
	}
	function handleUndo() {
		const prev = historyRef.current.pop();
		const ctx = ensureWorkingOverlay().getContext("2d", { willReadFrequently: true });
		if (!prev || !ctx) return;
		ctx.putImageData(prev, 0, 0);
		commitBinaryMaskFromCanvas(invertOutput);
	}
	function handleClear() {
		const ctx = ensureWorkingOverlay().getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		historyRef.current = [...historyRef.current.slice(-10), ctx.getImageData(0, 0, MASK_W, MASK_H)];
		ctx.clearRect(0, 0, MASK_W, MASK_H);
		setPosPoints([]);
		setNegPoints([]);
		setDetectedBoxes([]);
		setActiveBoxIdx(null);
		setLocalStats(null);
		setMaskDataUrl(null);
		setBinaryMaskData(null, null);
		redrawCanvas();
	}
	function handleToggleInvert() {
		const next = !invertOutput;
		setInvertOutput(next);
		commitBinaryMaskFromCanvas(next);
	}
	function handleDownloadBinaryMask() {
		if (!binaryMaskDataUrl) {
			toast.message("Segment an object first to generate a binary mask PNG.");
			return;
		}
		const link = document.createElement("a");
		link.href = binaryMaskDataUrl;
		link.download = `oriel-sam2-binary-mask-${Date.now()}.png`;
		document.body.appendChild(link);
		link.click();
		link.remove();
		toast.success("Downloaded binary mask image (PNG)");
	}
	const maskBytes = estimateDataUrlBytes(binaryMaskDataUrl);
	const stats = localStats ?? (binaryMaskStats ? {
		...binaryMaskStats,
		totalPixels: MASK_W * MASK_H,
		bbox: null
	} : null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "grounded-sam2-tool",
		className: "w-full overflow-hidden bg-[#161310] text-[#f6efe4]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#14110f] px-3 py-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-[#e7c27a] uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-3.5" }), " Grounded-SAM 2 Tool"]
				}), ARCH_SEMANTIC_TARGETS.map((item) => {
					const active = targetQuery.toLowerCase() === item.query.toLowerCase() && detectedBoxes.length > 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: segmenting || busy,
						onClick: () => void runTextOrChipSegment(item.query),
						className: cn("inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition disabled:opacity-50", active ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
						children: item.label
					}, item.id);
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					runTextOrChipSegment(targetQuery);
				},
				className: "flex flex-wrap items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					"aria-label": "Semantic segmentation target",
					value: targetQuery,
					onChange: (e) => setTargetQuery(e.target.value),
					placeholder: "Target (e.g. windows, facade, sofa)...",
					className: "h-7 w-44 rounded-full border border-white/20 bg-black/45 px-2.5 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: segmenting || busy,
					className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a]/60 bg-[#d4b06a]/15 px-3 text-[11px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25 disabled:opacity-50",
					children: [segmenting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareDashed, { className: "size-3" }), "Segment"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 lg:grid-cols-[1fr_276px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-[320px] w-full items-center justify-center bg-[#1c1915] p-2 lg:min-h-[460px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full overflow-hidden rounded-xl border border-white/10 bg-black",
						style: {
							aspectRatio: frameAspect,
							maxHeight: "56vh"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: effectiveSource,
								alt: "Architectural segmentation canvas",
								onLoad: (e) => {
									const nw = e.currentTarget.naturalWidth;
									const nh = e.currentTarget.naturalHeight;
									if (nw > 0 && nh > 0) setFrameAspect(`${nw} / ${nh}`);
								},
								className: "pointer-events-none block h-full w-full object-fill"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
								ref: displayCanvasRef,
								"data-testid": "sam2-interactive-canvas",
								width: MASK_W,
								height: MASK_H,
								onPointerDown: handleCanvasClick,
								className: cn("absolute inset-0 z-10 block h-full w-full touch-none", clickMode === "include" ? "cursor-crosshair" : "cursor-not-allowed")
							}),
							viewMode !== "original" && detectedBoxes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0 z-20",
								children: detectedBoxes.map((box, idx) => {
									const [ymin, xmin, ymax, xmax] = box.box_2d;
									const focused = activeBoxIdx === idx;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setActiveBoxIdx(idx);
											runTextOrChipSegment(box.label, [box]);
										},
										style: {
											top: `${ymin / 10}%`,
											left: `${xmin / 10}%`,
											height: `${Math.max(4, (ymax - ymin) / 10)}%`,
											width: `${Math.max(4, (xmax - xmin) / 10)}%`
										},
										className: cn("pointer-events-auto absolute rounded-md border-2 border-dashed transition", focused ? "border-[#e7c27a] bg-[#e7c27a]/10" : "border-[#e7c27a]/65 hover:border-[#e7c27a]"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "pointer-events-none absolute -top-5 left-0 whitespace-nowrap rounded-full bg-[#14110f]/90 px-2 py-0.5 font-mono text-[9px] text-[#e7c27a] shadow",
											children: [
												box.label,
												" · ",
												Math.round(box.confidence * 100),
												"%"
											]
										})
									}, `${box.label}-${idx}`);
								})
							}) : null,
							viewMode !== "original" && (posPoints.length > 0 || negPoints.length > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute inset-0 z-20",
								children: [posPoints.map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										left: `${pt.xNorm * 100}%`,
										top: `${pt.yNorm * 100}%`
									},
									className: "absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-emerald-500 text-[10px] font-bold text-white shadow",
									children: "+"
								}, `inc-${i}`)), negPoints.map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										left: `${pt.xNorm * 100}%`,
										top: `${pt.yNorm * 100}%`
									},
									className: "absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-rose-500 text-[10px] font-bold text-white shadow",
									children: "-"
								}, `exc-${i}`))]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setViewMode((v) => v === "overlay" ? "binary" : v === "binary" ? "original" : "overlay"),
							className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/20 bg-[#14110f]/90 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]",
							children: viewMode === "binary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Binary, { className: "size-3 text-emerald-300" }), " View: Binary 0/255"] }) : viewMode === "original" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3 text-[#e7c27a]" }), " View: Original"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3 text-[#e7c27a]" }), " View: Overlay"] })
						}), stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							"data-testid": "sam2-coverage-badge",
							className: "rounded-full border border-emerald-400/40 bg-[#14110f]/90 px-2.5 py-0.5 font-mono text-[10px] text-emerald-200",
							children: [
								"Mask ",
								stats.coveragePct,
								"%"
							]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute top-3 right-3 z-20 rounded-full border border-white/15 bg-[#14110f]/90 px-3 py-1 text-[11px] text-[#e4dacb]",
						children: clickMode === "include" ? "Click any element (window, facade, sofa) to mask" : "Click region to subtract from binary mask"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col justify-between gap-3 border-t border-white/10 bg-[#14110f] p-3 text-xs lg:border-t-0 lg:border-l",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-[#e7c27a] uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Binary, { className: "size-3.5" }), " Binary Mask Output"]
							}), binaryMaskDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 text-[10px] text-emerald-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), " Ready"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-[#b9aa95]",
								children: "No mask yet"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-white/15 bg-black",
							children: binaryMaskDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								"data-testid": "sam2-binary-mask-preview",
								src: binaryMaskDataUrl,
								alt: "Stored binary image mask",
								className: "aspect-video w-full object-contain"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid aspect-video place-items-center px-3 text-center text-[11px] text-[#9f917f]",
								children: "Click any architectural element on the canvas to encode binary mask data."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2 font-mono text-[10px] text-[#cbbba6]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[9px] text-[#9f917f] uppercase",
									children: "Encoding"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[#f6efe4]",
									children: "1-bit PNG (0/255)"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[9px] text-[#9f917f] uppercase",
									children: "Coverage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[#e7c27a]",
									children: stats ? `${stats.coveragePct}%` : "0%"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[9px] text-[#9f917f] uppercase",
									children: "Active Pixels"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[#f6efe4]",
									children: stats ? stats.activePixels.toLocaleString() : "0"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[9px] text-[#9f917f] uppercase",
									children: "Payload Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[#f6efe4]",
									children: maskBytes > 0 ? `${(maskBytes / 1024).toFixed(1)} KB` : "0 KB"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 border-t border-white/10 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": clickMode === "include",
										onClick: () => setClickMode("include"),
										className: cn("inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-full border text-[11px] font-medium", clickMode === "include" ? "border-emerald-400 bg-emerald-500/20 text-emerald-200" : "border-white/15 bg-white/5 text-[#e4dacb]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3" }), " Include (+)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": clickMode === "exclude",
										onClick: () => setClickMode("exclude"),
										className: cn("inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-full border text-[11px] font-medium", clickMode === "exclude" ? "border-rose-400 bg-rose-500/20 text-rose-200" : "border-white/15 bg-white/5 text-[#e4dacb]"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "size-3" }), " Exclude (-)"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-2 text-[11px] text-[#cbbba6]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3 text-[#e7c27a]" }), " Sensitivity"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 15,
											max: 85,
											value: threshold,
											onChange: (e) => setThreshold(Number(e.target.value)),
											className: "h-1 w-24 accent-[#d4b06a]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 text-right font-mono text-[10px] text-[#e7c27a]",
											children: threshold
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleToggleInvert,
											disabled: !binaryMaskDataUrl,
											"aria-pressed": invertOutput,
											className: cn("inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] disabled:opacity-40", invertOutput ? "gold-fill border-transparent font-semibold text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb]"),
											children: "Invert 0/255"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleUndo,
											className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Undo"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleClear,
											className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Clear"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => fileInputRef.current?.click(),
											className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }), " Photo"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileInputRef,
											type: "file",
											accept: "image/*",
											className: "sr-only",
											onChange: (ev) => {
												const f = ev.target.files?.[0];
												if (f && onSourceChange) readImage(f, 1280).then((url) => onSourceChange(url));
												ev.target.value = "";
											}
										})
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 border-t border-white/10 pt-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !binaryMaskDataUrl || busy,
							onClick: () => onSendToInpaint("replace", `Replace ${targetQuery} with architectural finish`),
							className: "gold-fill flex h-8 w-full items-center justify-center gap-1.5 rounded-full text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-45",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Replace Texture in AI Inpaint"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !binaryMaskDataUrl || busy,
								onClick: () => onSendToInpaint("erase", `Remove ${targetQuery}`),
								className: "flex h-7 items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-[10px] text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-45",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3" }), " Remove Object"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !binaryMaskDataUrl,
								onClick: handleDownloadBinaryMask,
								className: "flex h-7 items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-[10px] text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-45",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), " Save Binary PNG"]
							})]
						}),
						onOpenInpaintWorkspace ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !binaryMaskDataUrl,
							onClick: onOpenInpaintWorkspace,
							className: "flex h-7 w-full items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-medium text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-45",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3 text-[#e7c27a]" }), " Edit Mask in AI Inpaint Brush"]
						}) : null,
						onSendToNodeEditor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !binaryMaskDataUrl,
							onClick: onSendToNodeEditor,
							className: "flex h-7 w-full items-center justify-center gap-1 rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 text-[10px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25 disabled:opacity-45",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "size-3" }), " Use Binary Mask in Node Editor"]
						}) : null
					]
				})]
			})]
		})]
	});
}
var CANVAS_W$1 = 1280;
var CANVAS_H$1 = 720;
var GROUNDED_SAM2_OBJECTS = [
	{
		id: "facade",
		label: "Facade",
		query: "facade walls"
	},
	{
		id: "glazing",
		label: "Glazing",
		query: "windows and glazing"
	},
	{
		id: "sofa",
		label: "Sofa / Furniture",
		query: "sofa and furniture"
	},
	{
		id: "floor",
		label: "Flooring",
		query: "flooring surface"
	},
	{
		id: "foliage",
		label: "Foliage",
		query: "trees and foliage"
	},
	{
		id: "lighting",
		label: "Lighting",
		query: "pendant lights and fixtures"
	},
	{
		id: "roof",
		label: "Roof",
		query: "roof and ceiling"
	},
	{
		id: "sky",
		label: "Sky",
		query: "sky"
	}
];
var TEXTURE_REPLACE_SWATCHES = [
	{
		id: "travertine",
		label: "Honed Travertine",
		prompt: "Honed travertine limestone slabs"
	},
	{
		id: "oak",
		label: "Fluted Oak",
		prompt: "Warm fluted white oak timber panelling"
	},
	{
		id: "concrete",
		label: "Board Concrete",
		prompt: "Architectural board-formed concrete"
	},
	{
		id: "brick",
		label: "Nordic Brick",
		prompt: "Hand-laid Nordic textured brick"
	},
	{
		id: "bronze",
		label: "Brushed Bronze",
		prompt: "Architectural brushed bronze cladding"
	},
	{
		id: "glass",
		label: "Low-E Glaze",
		prompt: "Clear low-E curtain wall glazing"
	}
];
var EXAMPLE_INSERT_SWATCHES$1 = [
	{
		id: "oak-lounge",
		label: "Warm Oak Lounge",
		url: "/viz/t03-compact-living-room.jpg"
	},
	{
		id: "courtyard-villa",
		label: "Courtyard Timber",
		url: "/viz/t05-subtropical-home.jpg"
	},
	{
		id: "brass-loft",
		label: "Loft Fixture",
		url: "/viz/p02-loft-after.jpg"
	}
];
function createMaskCanvas() {
	const c = document.createElement("canvas");
	c.width = CANVAS_W$1;
	c.height = CANVAS_H$1;
	return c;
}
function IOPaintWorkspace({ aspect, backgroundUrl, initialBufferUrl, initialSamMode = "off", busy = false, onSaveBuffer, onGroundedSamSegment, onApplyMaskInpaint, onApplyDirectionalOutpaint, onApplyRemoveBg, onApplyRestoreFaces, onApplyEsrganPlugin, onLoadSampleSource }) {
	const engine = useOriel((state) => state.engine);
	const setEngineField = useOriel((state) => state.setEngineField);
	const upload = useOriel((state) => state.upload);
	const displayCanvasRef = (0, import_react.useRef)(null);
	const offscreenMaskRef = (0, import_react.useRef)(null);
	const undoStackRef = (0, import_react.useRef)([]);
	const drawingRef = (0, import_react.useRef)(false);
	const lastSavedBufferRef = (0, import_react.useRef)(null);
	const [maskTool, setMaskTool] = (0, import_react.useState)("brush");
	const [strokeSize, setStrokeSize] = (0, import_react.useState)(28);
	const [maskInstruction, setMaskInstruction] = (0, import_react.useState)("");
	const [hasStrokes, setHasStrokes] = (0, import_react.useState)(Boolean(initialBufferUrl));
	const [samQuery, setSamQuery] = (0, import_react.useState)(engine.samPrompt || "windows and glazing");
	const [samMode, setSamMode] = (0, import_react.useState)(initialSamMode);
	const [samPosPoints, setSamPosPoints] = (0, import_react.useState)([]);
	const [samNegPoints, setSamNegPoints] = (0, import_react.useState)([]);
	const [detectedBoxes, setDetectedBoxes] = (0, import_react.useState)([]);
	const [activeBoxIdx, setActiveBoxIdx] = (0, import_react.useState)(null);
	const [maskCoveragePct, setMaskCoveragePct] = (0, import_react.useState)(null);
	const [samBusy, setSamBusy] = (0, import_react.useState)(false);
	const [peekOriginal, setPeekOriginal] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setSamMode(initialSamMode);
	}, [initialSamMode]);
	(0, import_react.useEffect)(() => {
		function handleSamEvent(event) {
			const mode = event.detail;
			if (mode === "pos" || mode === "neg" || mode === "off") setSamMode(mode);
		}
		window.addEventListener("oriel-sam-mode", handleSamEvent);
		return () => window.removeEventListener("oriel-sam-mode", handleSamEvent);
	}, []);
	function ensureMaskLayer() {
		if (!offscreenMaskRef.current) offscreenMaskRef.current = createMaskCanvas();
		return offscreenMaskRef.current;
	}
	const compositeDisplay = (0, import_react.useCallback)(() => {
		const display = displayCanvasRef.current;
		if (!display) return;
		const dCtx = display.getContext("2d", { willReadFrequently: true });
		if (!dCtx) return;
		dCtx.clearRect(0, 0, CANVAS_W$1, CANVAS_H$1);
		if (peekOriginal) return;
		const maskCanvas = offscreenMaskRef.current;
		if (maskCanvas) dCtx.drawImage(maskCanvas, 0, 0, CANVAS_W$1, CANVAS_H$1);
	}, [peekOriginal]);
	(0, import_react.useEffect)(() => {
		compositeDisplay();
	}, [peekOriginal, compositeDisplay]);
	(0, import_react.useEffect)(() => {
		if (initialBufferUrl && initialBufferUrl === lastSavedBufferRef.current) return;
		const ctx = ensureMaskLayer().getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		ctx.clearRect(0, 0, CANVAS_W$1, CANVAS_H$1);
		undoStackRef.current = [];
		if (initialBufferUrl) {
			const img = new Image();
			img.onload = () => {
				ctx.clearRect(0, 0, CANVAS_W$1, CANVAS_H$1);
				ctx.drawImage(img, 0, 0, CANVAS_W$1, CANVAS_H$1);
				setHasStrokes(true);
				compositeDisplay();
			};
			img.src = initialBufferUrl;
		} else {
			setHasStrokes(false);
			setSamPosPoints([]);
			setSamNegPoints([]);
			setDetectedBoxes([]);
			setActiveBoxIdx(null);
			setMaskCoveragePct(null);
			compositeDisplay();
		}
	}, [initialBufferUrl, compositeDisplay]);
	function getPoint(clientX, clientY) {
		const canvas = displayCanvasRef.current;
		if (!canvas) return {
			x: 0,
			y: 0,
			xNorm: .5,
			yNorm: .5
		};
		const rect = canvas.getBoundingClientRect();
		const xNorm = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
		const yNorm = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
		return {
			x: xNorm * CANVAS_W$1,
			y: yNorm * CANVAS_H$1,
			xNorm,
			yNorm
		};
	}
	function pushUndoSnapshot() {
		const ctx = ensureMaskLayer().getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		undoStackRef.current = [...undoStackRef.current.slice(-14), ctx.getImageData(0, 0, CANVAS_W$1, CANVAS_H$1)];
	}
	function applyBrushStyle(ctx) {
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = strokeSize;
		if (maskTool === "eraser") {
			ctx.globalCompositeOperation = "destination-out";
			ctx.strokeStyle = "rgba(0,0,0,1)";
		} else {
			ctx.globalCompositeOperation = "source-over";
			ctx.strokeStyle = "rgba(212, 176, 106, 0.72)";
		}
	}
	function commitMaskBuffer(buf) {
		lastSavedBufferRef.current = buf;
		onSaveBuffer(buf);
	}
	function writeMaskDataUrlToCanvas(maskDataUrl, coveragePct) {
		const layerCanvas = ensureMaskLayer();
		const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		pushUndoSnapshot();
		const mImg = new Image();
		mImg.onload = () => {
			ctx.clearRect(0, 0, CANVAS_W$1, CANVAS_H$1);
			ctx.drawImage(mImg, 0, 0, CANVAS_W$1, CANVAS_H$1);
			setHasStrokes(coveragePct > 0);
			setMaskCoveragePct(coveragePct);
			compositeDisplay();
			commitMaskBuffer(coveragePct > 0 ? layerCanvas.toDataURL("image/png") : null);
		};
		mImg.src = maskDataUrl;
	}
	async function handleOneClickGroundedSam(queryPrompt, forcedBoxes) {
		const targetSrc = backgroundUrl;
		if (!targetSrc) {
			toast.message("Load an architectural scene or plate first to run Grounded-SAM 2.");
			return;
		}
		const clean = queryPrompt.trim() || "windows and glazing";
		setSamQuery(clean);
		setSamBusy(true);
		setSamMode("off");
		try {
			let boxes = forcedBoxes;
			let modelTag = "grounded-sam-2";
			if (!boxes) {
				const detection = await onGroundedSamSegment(clean, targetSrc);
				boxes = detection.boxes;
				modelTag = detection.model;
				setDetectedBoxes(boxes);
				setActiveBoxIdx(null);
			}
			const segmented = await runGroundedSam2Segment({
				src: targetSrc,
				prompt: clean,
				boxes,
				posPoints: samPosPoints,
				negPoints: samNegPoints,
				threshold: engine.samThreshold
			});
			writeMaskDataUrlToCanvas(segmented.maskDataUrl, segmented.coveragePct);
			if (segmented.boxes.length > 0 && !forcedBoxes) setDetectedBoxes(segmented.boxes);
			toast.success(`Grounded-SAM 2 isolated "${clean}" (${segmented.coveragePct}% mask · ${modelTag})`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Grounded-SAM 2 segmentation failed.");
		} finally {
			setSamBusy(false);
		}
	}
	async function handleFocusDetectedBox(boxIdx) {
		const box = detectedBoxes[boxIdx];
		if (!box) return;
		setActiveBoxIdx(boxIdx);
		await handleOneClickGroundedSam(box.label, [box]);
	}
	async function handleSamCanvasClick(xNorm, yNorm) {
		const src = backgroundUrl || "/viz/t03-compact-living-room.jpg";
		if (samMode === "neg" && samPosPoints.length === 0 && detectedBoxes.length === 0) {
			toast.message("Select a Grounded-SAM object or add a Click-to-Mask include point first.");
			return;
		}
		const nextPos = samMode === "pos" ? [...samPosPoints, {
			xNorm,
			yNorm
		}] : samPosPoints;
		const nextNeg = samMode === "neg" ? [...samNegPoints, {
			xNorm,
			yNorm
		}] : samNegPoints;
		setSamPosPoints(nextPos);
		setSamNegPoints(nextNeg);
		setSamBusy(true);
		try {
			let activeBoxes = detectedBoxes;
			let activeLabel = samQuery;
			if (samMode === "pos" && activeBoxes.length === 0) {
				const detection = await onGroundedSamSegment("architectural element", src, {
					xNorm,
					yNorm
				});
				if (!detection.fallback && detection.boxes.length > 0) {
					activeBoxes = detection.boxes;
					activeLabel = detection.boxes[0]?.label || samQuery;
					setDetectedBoxes(activeBoxes);
					setActiveBoxIdx(0);
					setSamQuery(activeLabel);
				}
			}
			const res = activeBoxes.length > 0 ? await runGroundedSam2Segment({
				src,
				prompt: activeLabel,
				boxes: activeBoxIdx !== null && activeBoxes[activeBoxIdx] ? [activeBoxes[activeBoxIdx]] : activeBoxes,
				posPoints: nextPos,
				negPoints: nextNeg,
				threshold: engine.samThreshold
			}) : await runInteractiveSamMultiPointMask({
				src,
				posPoints: nextPos,
				negPoints: nextNeg,
				threshold: engine.samThreshold
			});
			writeMaskDataUrlToCanvas(res.maskDataUrl, res.coveragePct);
			toast.success(activeBoxes.length > 0 ? `Grounded-SAM 2 isolated "${activeLabel}" (${res.coveragePct}% mask)` : `SAM-2 refined mask (${res.coveragePct}% coverage)`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "SAM click segmentation failed.");
		} finally {
			setSamBusy(false);
		}
	}
	function onPointerDown(e) {
		if (!backgroundUrl) return;
		const display = displayCanvasRef.current;
		const ctx = ensureMaskLayer().getContext("2d", { willReadFrequently: true });
		if (!display || !ctx) return;
		const pt = getPoint(e.clientX, e.clientY);
		if (samMode !== "off") {
			handleSamCanvasClick(pt.xNorm, pt.yNorm);
			return;
		}
		display.setPointerCapture(e.pointerId);
		pushUndoSnapshot();
		drawingRef.current = true;
		applyBrushStyle(ctx);
		ctx.beginPath();
		ctx.moveTo(pt.x, pt.y);
		ctx.lineTo(pt.x + .01, pt.y + .01);
		ctx.stroke();
		compositeDisplay();
	}
	function onPointerMove(e) {
		if (!drawingRef.current) return;
		const ctx = ensureMaskLayer().getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const pt = getPoint(e.clientX, e.clientY);
		applyBrushStyle(ctx);
		ctx.lineTo(pt.x, pt.y);
		ctx.stroke();
		compositeDisplay();
	}
	function onPointerUp() {
		if (!drawingRef.current) return;
		drawingRef.current = false;
		setHasStrokes(true);
		commitMaskBuffer(ensureMaskLayer().toDataURL("image/png"));
	}
	function handleUndo() {
		const layerCanvas = ensureMaskLayer();
		const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const prev = undoStackRef.current.pop();
		if (!prev) return;
		ctx.putImageData(prev, 0, 0);
		compositeDisplay();
		commitMaskBuffer(layerCanvas.toDataURL("image/png"));
	}
	function handleClear() {
		const ctx = ensureMaskLayer().getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		pushUndoSnapshot();
		ctx.clearRect(0, 0, CANVAS_W$1, CANVAS_H$1);
		compositeDisplay();
		setHasStrokes(false);
		setSamPosPoints([]);
		setSamNegPoints([]);
		setDetectedBoxes([]);
		setActiveBoxIdx(null);
		setMaskCoveragePct(null);
		commitMaskBuffer(null);
	}
	function handleTaskSelect(taskId) {
		setEngineField("iopaintTask", taskId);
		const taskMeta = IOPAINT_TASKS.find((t) => t.id === taskId);
		if (taskMeta) setEngineField("iopaintModel", taskMeta.defaultModel);
	}
	function handleDownloadCurrent() {
		if (!backgroundUrl) {
			toast.message("Load or render an image first to download.");
			return;
		}
		const a = document.createElement("a");
		a.href = backgroundUrl;
		a.download = `oriel-iopaint-${engine.iopaintTask}-${Date.now()}.png`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		toast.success("Downloaded current IOPaint image");
	}
	const shownBg = peekOriginal && upload ? upload : backgroundUrl;
	const activeModelLabel = IOPAINT_MODELS.find((m) => m.id === engine.iopaintModel)?.label ?? engine.iopaintModel;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "iopaint-workspace",
		className: "relative w-full overflow-hidden bg-[#181613]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "grounded-sam2-bar",
				className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#14110f] px-3 py-2 text-xs text-[#f6efe4]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-[#e7c27a] uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-3.5" }), " Grounded-SAM 2"]
					}), GROUNDED_SAM2_OBJECTS.map((item) => {
						const active = samQuery.toLowerCase() === item.query.toLowerCase() && detectedBoxes.length > 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: samBusy || busy,
							onClick: () => void handleOneClickGroundedSam(item.query),
							className: cn("inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[10px] font-medium transition disabled:opacity-50", active ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
							children: item.label
						}, item.id);
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleOneClickGroundedSam(samQuery);
					},
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							"aria-label": "Grounded-SAM 2 semantic target prompt",
							value: samQuery,
							onChange: (e) => setSamQuery(e.target.value),
							placeholder: "Segment object (e.g. pendant lamp)...",
							className: "h-7 w-44 rounded-full border border-white/20 bg-black/45 px-2.5 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							disabled: samBusy || busy,
							className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-[#d4b06a]/15 px-2.5 text-[11px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25 disabled:opacity-50",
							children: [samBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareDashed, { className: "size-3" }), "Segment"]
						}),
						detectedBoxes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setDetectedBoxes([]);
								setActiveBoxIdx(null);
							},
							"aria-label": "Clear Grounded-SAM boxes",
							className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 text-[10px] text-[#cbbba6] hover:text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" }), " Boxes"]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full overflow-hidden",
				style: {
					aspectRatio: aspect,
					minHeight: "330px",
					maxHeight: "52vh"
				},
				children: [
					shownBg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: shownBg,
						alt: "IOPaint workspace plate",
						className: "pointer-events-none absolute inset-0 h-full w-full object-contain"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-4 text-center text-xs text-[#cbbba6]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Load an architectural scene to run one-click Grounded-SAM 2 segmentation, remove unwanted objects, or replace finishes via IOPaint." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onLoadSampleSource("/viz/t03-compact-living-room.jpg"),
							className: "gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[#2a1c0c]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Load Sample Scene"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: displayCanvasRef,
						width: CANVAS_W$1,
						height: CANVAS_H$1,
						onPointerDown,
						onPointerMove,
						onPointerUp,
						onPointerCancel: onPointerUp,
						className: cn("relative z-10 block h-full w-full touch-none", samMode !== "off" ? "cursor-cell" : "cursor-crosshair")
					}),
					!peekOriginal && backgroundUrl && detectedBoxes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 z-20",
						children: detectedBoxes.map((box, idx) => {
							const [ymin, xmin, ymax, xmax] = box.box_2d;
							const focused = activeBoxIdx === idx;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void handleFocusDetectedBox(idx),
								title: `Click to isolate ${box.label}`,
								style: {
									top: `${ymin / 10}%`,
									left: `${xmin / 10}%`,
									height: `${Math.max(4, (ymax - ymin) / 10)}%`,
									width: `${Math.max(4, (xmax - xmin) / 10)}%`
								},
								className: cn("pointer-events-auto absolute rounded-md border-2 border-dashed transition", focused ? "border-[#e7c27a] bg-[#e7c27a]/10" : "border-[#e7c27a]/65 hover:border-[#e7c27a]"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "pointer-events-none absolute -top-5 left-0 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#14110f]/90 px-2 py-0.5 font-mono text-[9px] text-[#e7c27a] shadow",
									children: [
										box.label,
										" · ",
										Math.round(box.confidence * 100),
										"%"
									]
								})
							}, `${box.label}-${idx}`);
						})
					}) : null,
					!peekOriginal && (samPosPoints.length > 0 || samNegPoints.length > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute inset-0 z-20",
						children: [samPosPoints.map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								left: `${pt.xNorm * 100}%`,
								top: `${pt.yNorm * 100}%`
							},
							className: "absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-emerald-500 text-[10px] font-bold text-white shadow",
							children: "+"
						}, `pos-${i}`)), samNegPoints.map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								left: `${pt.xNorm * 100}%`,
								top: `${pt.yNorm * 100}%`
							},
							className: "absolute grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-rose-500 text-[10px] font-bold text-white shadow",
							children: "-"
						}, `neg-${i}`))]
					}) : null,
					backgroundUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": peekOriginal,
								onClick: () => setPeekOriginal((v) => !v),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium shadow-md transition", peekOriginal ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/20 bg-[#14110f]/90 text-[#f6efe4] hover:border-[#d4b06a]"),
								children: [peekOriginal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3 text-[#e7c27a]" }), peekOriginal ? "Viewing Original" : "Compare Original"]
							}),
							maskCoveragePct !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								"data-testid": "sam-mask-coverage",
								className: "rounded-full border border-white/15 bg-[#14110f]/90 px-2.5 py-0.5 font-mono text-[10px] text-[#e7c27a]",
								children: [
									"Mask ",
									maskCoveragePct,
									"%"
								]
							}) : null,
							samBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full border border-[#d4b06a]/50 bg-[#14110f]/90 px-2.5 py-0.5 text-[10px] text-[#e7c27a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }), " Segmenting…"]
							}) : null
						]
					}) : null,
					backgroundUrl && samMode !== "off" && !peekOriginal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-testid": "sam-click-hint",
						className: "pointer-events-none absolute top-3 right-3 z-20 rounded-full border border-emerald-400/50 bg-[#14110f]/90 px-3 py-1 text-[11px] text-emerald-200 shadow-md",
						children: samMode === "pos" ? "SAM-2 Click-to-Mask active · Click any element on the render" : "Exclude Mode · Click regions to subtract from mask"
					}) : null,
					backgroundUrl && hasStrokes && !peekOriginal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": "sam-quick-actions",
						className: "absolute right-3 bottom-3 z-20 flex flex-wrap items-center gap-1.5 rounded-full border border-white/15 bg-[#14110f]/92 p-1 shadow-lg",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => {
									handleTaskSelect("replace");
									onApplyMaskInpaint(maskInstruction || "Honed travertine stone architectural finish");
								},
								className: "gold-fill inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Inpaint / Replace"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: () => {
									handleTaskSelect("erase");
									onApplyMaskInpaint(maskInstruction);
								},
								className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#d4b06a] disabled:opacity-50",
								children: "Remove Object"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleClear,
								className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 px-2 text-[11px] text-[#cbbba6] hover:text-white",
								children: "Clear"
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "iopaint-control-deck",
				className: "space-y-2 border-t border-white/10 bg-[#14110f] px-3 py-2.5 text-xs text-[#f6efe4]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mr-1 font-mono text-[10px] tracking-wider text-[#e7c27a] uppercase",
								children: "IOPaint"
							}), IOPAINT_TASKS.map((t) => {
								const active = engine.iopaintTask === t.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": active,
									title: t.hint,
									onClick: () => handleTaskSelect(t.id),
									className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition", active ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("text-[9px]", active ? "text-[#2a1c0c]/75" : "text-[#e7c27a]"),
										children: ["· ", t.badge]
									})]
								}, t.id);
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-1.5 text-[11px] text-[#cbbba6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Server Model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										"aria-label": "IOPaint Model",
										value: engine.iopaintModel,
										onChange: (e) => setEngineField("iopaintModel", e.target.value),
										className: "h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
											label: "Erase (Object Removal)",
											children: IOPAINT_MODELS.filter((m) => m.group === "erase").map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: m.id,
												children: m.label
											}, m.id))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
											label: "Diffusion (Texture & Object Replace)",
											children: IOPAINT_MODELS.filter((m) => m.group === "diffusion").map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: m.id,
												children: m.label
											}, m.id))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "sam-click-to-mask-toggle",
									"aria-pressed": samMode === "pos",
									"aria-label": "Click-to-Mask SAM 2 segmentation",
									onClick: () => setSamMode((m) => m === "pos" ? "off" : "pos"),
									className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium", samMode === "pos" ? "border-emerald-400 bg-emerald-500/20 text-emerald-200" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3" }), " Click-to-Mask"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": samMode === "neg",
									"aria-label": "SAM 2 Exclude region point",
									onClick: () => setSamMode((m) => m === "neg" ? "off" : "neg"),
									className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]", samMode === "neg" ? "border-rose-400 bg-rose-500/20 text-rose-200" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3" }), " Exclude -"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setSamMode("off");
										setMaskTool("brush");
									},
									className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]", maskTool === "brush" && samMode === "off" ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3" }), " Brush"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setSamMode("off");
										setMaskTool("eraser");
									},
									className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]", maskTool === "eraser" && samMode === "off" ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "size-3" }), " Eraser"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ml-1 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#cbbba6]",
										children: "Size"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 10,
										max: 64,
										value: strokeSize,
										onChange: (e) => setStrokeSize(Number(e.target.value)),
										className: "h-1 w-14 accent-[#d4b06a]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "ml-1 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-[#cbbba6]",
										children: [
											"Dilate +",
											engine.iopaintMaskDilate,
											"px"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 24,
										value: engine.iopaintMaskDilate,
										onChange: (e) => setEngineField("iopaintMaskDilate", Number(e.target.value)),
										className: "h-1 w-14 accent-[#d4b06a]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": engine.iopaintInvertMask,
									onClick: () => setEngineField("iopaintInvertMask", !engine.iopaintInvertMask),
									className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]", engine.iopaintInvertMask ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, { className: "size-3" }), " Invert Mask"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleUndo,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Undo"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleClear,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Clear"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: engine.iopaintTask === "outpaint" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								[
									"top",
									"right",
									"bottom",
									"left"
								].map((edge) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex items-center gap-1 text-[10px] text-[#cbbba6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "uppercase",
										children: edge[0]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 0,
										max: 320,
										step: 16,
										value: engine.iopaintOutpaintPad[edge],
										onChange: (e) => setEngineField("iopaintOutpaintPad", {
											...engine.iopaintOutpaintPad,
											[edge]: Number(e.target.value)
										}),
										className: "h-7 w-13 rounded-full border border-white/20 bg-black/50 px-2 text-center font-mono text-[11px] text-white outline-none focus:border-[#d4b06a]"
									})]
								}, edge)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEngineField("iopaintOutpaintPad", {
										top: 96,
										right: 128,
										bottom: 96,
										left: 128
									}),
									className: "inline-flex h-7 shrink-0 items-center rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]",
									children: "+All Preset"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy,
									onClick: () => onApplyDirectionalOutpaint(engine.iopaintOutpaintPad),
									className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "size-3.5" }), " Apply Outpaint Pad"]
								})
							] }) : engine.iopaintTask === "anytext" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "size-3 text-[#e7c27a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: engine.iopaintAnyText,
									onChange: (e) => setEngineField("iopaintAnyText", e.target.value),
									placeholder: "Signage text in mask...",
									className: "h-7 w-40 bg-transparent text-[11px] text-white outline-none placeholder:text-white/45"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !hasStrokes || busy,
								onClick: () => onApplyMaskInpaint(engine.iopaintAnyText || maskInstruction),
								className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "size-3.5" }), " Render AnyText"]
							})] }) : engine.iopaintTask === "paint-by-example" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1",
								children: [EXAMPLE_INSERT_SWATCHES$1.map((sw) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setEngineField("iopaintExampleUrl", sw.url),
									className: cn("inline-flex h-7 shrink-0 items-center rounded-full border px-2 text-[10px]", engine.iopaintExampleUrl === sw.url ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb]"),
									children: sw.label
								}, sw.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }),
										" Ref",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/*",
											className: "sr-only",
											onChange: (e) => {
												const f = e.target.files?.[0];
												if (f) readImage(f, 1024).then((url) => setEngineField("iopaintExampleUrl", url));
												e.target.value = "";
											}
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !hasStrokes || busy,
								onClick: () => onApplyMaskInpaint(maskInstruction || "Insert example object seamlessly"),
								className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Insert By Example"]
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: maskInstruction,
								onChange: (e) => setMaskInstruction(e.target.value),
								placeholder: engine.iopaintTask === "erase" ? "Optional erase target (e.g. person, cable)..." : "Texture/material in mask (e.g. travertine, fluted oak)...",
								className: "h-7 w-52 rounded-full border border-white/20 bg-black/40 px-3 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !hasStrokes || busy,
								onClick: () => onApplyMaskInpaint(maskInstruction),
								className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
								children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), engine.iopaintTask === "erase" ? "Apply Erase" : "Apply Replace"]
							})] })
						})]
					}),
					engine.iopaintTask === "replace" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] tracking-wider text-[#cbbba6] uppercase",
								children: "Texture Swatches"
							}),
							TEXTURE_REPLACE_SWATCHES.map((swatch) => {
								const selected = maskInstruction.toLowerCase().includes(swatch.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMaskInstruction(swatch.prompt),
									className: cn("inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 text-[10px] transition", selected ? "gold-fill border-transparent font-semibold text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: swatch.label
								}, swatch.id);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto font-mono text-[10px] text-[#cbbba6]",
								children: ["Engine: ", activeModelLabel]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-1.5 border-t border-white/10 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] tracking-wider text-[#cbbba6] uppercase",
									children: "Plugins"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy,
									onClick: () => onApplyRemoveBg("cutout"),
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#e7c27a]" }), " RemoveBG Cutout"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy,
									onClick: () => onApplyRemoveBg("mask"),
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#e7c27a]" }), " RemoveBG → Mask"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy,
									onClick: onApplyRestoreFaces,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3 text-[#e7c27a]" }),
										" Restore Faces (",
										engine.iopaintFaceModel.toUpperCase(),
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: busy,
									onClick: onApplyEsrganPlugin,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-[#e7c27a]" }),
										" Real-ESRGAN ",
										engine.upscaleFactor,
										"×"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleDownloadCurrent,
							className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#d4b06a]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 text-[#e7c27a]" }), " Save PNG"]
						})]
					})
				]
			})
		]
	});
}
var EDITOR_PORT_COLORS = {
	image: "#60a5fa",
	control: "#38bdf8",
	prompt: "#fbbf24",
	mask: "#34d399",
	render: "#e7c27a"
};
var EDITOR_NODE_SPECS = {
	"image-input": {
		kind: "image-input",
		title: "Image Input",
		subtitle: "Architectural base photo or 3D snapshot",
		accent: "#60a5fa",
		inputs: [],
		outputs: [{
			id: "image",
			label: "Image",
			type: "image"
		}],
		defaultConfig: {
			source: "studio-active",
			customUrl: "/viz/t03-compact-living-room.jpg"
		}
	},
	"controlnet-config": {
		kind: "controlnet-config",
		title: "ControlNet Config",
		subtitle: "Structural Canny, Depth, Normal, or MLSD lock",
		accent: "#38bdf8",
		inputs: [{
			id: "image",
			label: "Source Image",
			type: "image"
		}],
		outputs: [{
			id: "control",
			label: "Control Map",
			type: "control"
		}],
		defaultConfig: {
			preprocessor: "canny",
			strength: .78,
			guidanceEnd: .9
		}
	},
	"prompt-modifier": {
		kind: "prompt-modifier",
		title: "Prompt Modifier",
		subtitle: "Material palette, atmosphere & light directive",
		accent: "#fbbf24",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Prompt",
			type: "prompt"
		}],
		defaultConfig: {
			stylePreset: "Nordic Timber & Travertine",
			lighting: "Golden Hour",
			promptText: "Architectural photography, honed travertine limestone, warm oak joinery, soft natural window light"
		}
	},
	"sam2-mask": {
		kind: "sam2-mask",
		title: "Grounded-SAM 2 Mask",
		subtitle: "Binary segmentation mask for localized inpaint",
		accent: "#34d399",
		inputs: [{
			id: "image",
			label: "Source Image",
			type: "image"
		}],
		outputs: [{
			id: "mask",
			label: "Binary Mask",
			type: "mask"
		}],
		defaultConfig: {
			targetObject: "windows and glazing",
			useStudioBinaryMask: true
		}
	},
	"render-engine": {
		kind: "render-engine",
		title: "Render Engine",
		subtitle: "Compile conditioned inputs into final render",
		accent: "#e7c27a",
		inputs: [
			{
				id: "image",
				label: "Base Image",
				type: "image",
				required: true
			},
			{
				id: "control",
				label: "ControlNet",
				type: "control"
			},
			{
				id: "prompt",
				label: "Prompt",
				type: "prompt"
			},
			{
				id: "mask",
				label: "Binary Mask",
				type: "mask"
			}
		],
		outputs: [{
			id: "render",
			label: "Render Plate",
			type: "render"
		}],
		defaultConfig: {
			engineMode: "hybrid",
			denoise: .62,
			steps: 28
		}
	},
	"video-render": {
		kind: "video-render",
		title: "Video Motion",
		subtitle: "Day-to-night or 4s orbit flythrough motion clip",
		accent: "#f472b6",
		inputs: [{
			id: "image",
			label: "Render / Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "render",
			label: "Motion Clip",
			type: "render"
		}],
		defaultConfig: {
			preset: "Day → Golden → Midnight",
			durationSec: 4
		}
	},
	"pano-360": {
		kind: "pano-360",
		title: "360° Panorama",
		subtitle: "Interactive equirectangular walkthrough tour",
		accent: "#a78bfa",
		inputs: [{
			id: "image",
			label: "Render / Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "render",
			label: "360° Tour",
			type: "render"
		}],
		defaultConfig: {
			fov: 72,
			hotspotsEnabled: true
		}
	},
	"glb-3d": {
		kind: "glb-3d",
		title: "3D / GLB Stage",
		subtitle: "Send output or capture straight to 3D viewport",
		accent: "#2dd4bf",
		inputs: [{
			id: "image",
			label: "Render / Image",
			type: "image"
		}],
		outputs: [{
			id: "image",
			label: "3D Snapshot",
			type: "image"
		}],
		defaultConfig: {
			preset: "pavilion",
			freezeMood: true
		}
	}
};
var EDITOR_PALETTE_ORDER = [
	"image-input",
	"controlnet-config",
	"prompt-modifier",
	"sam2-mask",
	"render-engine",
	"video-render",
	"pano-360",
	"glb-3d"
];
function createDefaultEditorGraph() {
	return {
		nodes: [
			{
				id: "node-img-1",
				kind: "image-input",
				title: "Image Input",
				x: 20,
				y: 24,
				config: { ...EDITOR_NODE_SPECS["image-input"].defaultConfig }
			},
			{
				id: "node-cn-1",
				kind: "controlnet-config",
				title: "ControlNet Config",
				x: 280,
				y: 24,
				config: { ...EDITOR_NODE_SPECS["controlnet-config"].defaultConfig }
			},
			{
				id: "node-pm-1",
				kind: "prompt-modifier",
				title: "Prompt Modifier",
				x: 20,
				y: 292,
				config: { ...EDITOR_NODE_SPECS["prompt-modifier"].defaultConfig }
			},
			{
				id: "node-re-1",
				kind: "render-engine",
				title: "Render Engine",
				x: 540,
				y: 64,
				config: { ...EDITOR_NODE_SPECS["render-engine"].defaultConfig }
			}
		],
		connections: [
			{
				id: "conn-1",
				fromNodeId: "node-img-1",
				fromPortId: "image",
				toNodeId: "node-cn-1",
				toPortId: "image"
			},
			{
				id: "conn-2",
				fromNodeId: "node-img-1",
				fromPortId: "image",
				toNodeId: "node-re-1",
				toPortId: "image"
			},
			{
				id: "conn-3",
				fromNodeId: "node-cn-1",
				fromPortId: "control",
				toNodeId: "node-re-1",
				toPortId: "control"
			},
			{
				id: "conn-4",
				fromNodeId: "node-pm-1",
				fromPortId: "prompt",
				toNodeId: "node-re-1",
				toPortId: "prompt"
			}
		]
	};
}
function canConnectEditorPorts(fromType, toType) {
	if (fromType === toType) return true;
	if (fromType === "render" && toType === "image") return true;
	if (fromType === "image" && toType === "render") return true;
	return false;
}
function getEditorPortCoords(node, direction, portId) {
	const spec = EDITOR_NODE_SPECS[node.kind];
	const ports = direction === "input" ? spec.inputs : spec.outputs;
	const idx = Math.max(0, ports.findIndex((p) => p.id === portId));
	return {
		x: direction === "input" ? node.x : node.x + 228,
		y: node.y + 40 + 12 + idx * 26 + 13
	};
}
function buildSvgLineData(x1, y1, x2, y2) {
	const dx = Math.max(48, Math.abs(x2 - x1) * .45);
	return {
		x1,
		y1,
		x2,
		y2,
		midX: (x1 + x2) / 2,
		midY: (y1 + y2) / 2,
		pathD: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
	};
}
function validateEditorGraph(nodes, connections) {
	const nodeMap = new Map(nodes.map((n) => [n.id, n]));
	const inDegree = /* @__PURE__ */ new Map();
	const adj = /* @__PURE__ */ new Map();
	const issues = [];
	for (const n of nodes) {
		inDegree.set(n.id, 0);
		adj.set(n.id, []);
	}
	for (const c of connections) {
		const src = nodeMap.get(c.fromNodeId);
		const dst = nodeMap.get(c.toNodeId);
		if (!src || !dst) continue;
		if (src.id === dst.id) {
			issues.push(`Self-connection on ${src.title}`);
			continue;
		}
		const srcPort = EDITOR_NODE_SPECS[src.kind].outputs.find((p) => p.id === c.fromPortId);
		const dstPort = EDITOR_NODE_SPECS[dst.kind].inputs.find((p) => p.id === c.toPortId);
		if (!srcPort || !dstPort || !canConnectEditorPorts(srcPort.type, dstPort.type)) {
			issues.push(`Incompatible port wire (${src.title} → ${dst.title})`);
			continue;
		}
		adj.get(src.id)?.push(dst.id);
		inDegree.set(dst.id, (inDegree.get(dst.id) ?? 0) + 1);
	}
	const queue = [];
	for (const [id, deg] of inDegree.entries()) if (deg === 0) queue.push(id);
	const order = [];
	while (queue.length > 0) {
		const cur = queue.shift();
		order.push(cur);
		for (const nxt of adj.get(cur) ?? []) {
			const nextDeg = (inDegree.get(nxt) ?? 0) - 1;
			inDegree.set(nxt, nextDeg);
			if (nextDeg === 0) queue.push(nxt);
		}
	}
	const hasCycles = order.length < nodes.length;
	if (hasCycles) issues.push("Cycle detected in node connections.");
	for (const n of nodes) {
		const spec = EDITOR_NODE_SPECS[n.kind];
		for (const inp of spec.inputs) if (inp.required) {
			if (!connections.some((c) => c.toNodeId === n.id && c.toPortId === inp.id)) issues.push(`${n.title} requires an input on "${inp.label}".`);
		}
	}
	return {
		valid: issues.length === 0 && !hasCycles,
		hasCycles,
		order,
		issues
	};
}
var CONTROLNET_MODES = [
	"canny",
	"depth",
	"normal",
	"mlsd"
];
var SAMPLE_SCENES = [
	{
		label: "Compact Living Room",
		url: "/viz/t03-compact-living-room.jpg"
	},
	{
		label: "Concrete Pavilion",
		url: "/viz/p01-pavilion-day.jpg"
	},
	{
		label: "Courtyard Villa",
		url: "/viz/t05-subtropical-home.jpg"
	},
	{
		label: "Cultural Campus",
		url: "/viz/t07-cultural-campus.jpg"
	}
];
function NodeEditorCanvas({ onSendResultToStudio, onOpenSam2Tool, onOpenStage }) {
	const upload = useOriel((s) => s.upload);
	const plate = useOriel((s) => s.plate);
	const binaryMaskDataUrl = useOriel((s) => s.binaryMaskDataUrl);
	const maskDataUrl = useOriel((s) => s.maskDataUrl);
	const design = useOriel((s) => s.design);
	const frame = useOriel((s) => s.frame);
	const engine = useOriel((s) => s.engine);
	const scene3d = useOriel((s) => s.scene3d);
	const initialGraph = (0, import_react.useMemo)(() => createDefaultEditorGraph(), []);
	const [nodes, setNodes] = (0, import_react.useState)(initialGraph.nodes);
	const [connections, setConnections] = (0, import_react.useState)(initialGraph.connections);
	const [selectedNodeId, setSelectedNodeId] = (0, import_react.useState)(initialGraph.nodes[0]?.id ?? null);
	const [hoveredConnId, setHoveredConnId] = (0, import_react.useState)(null);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [nodePreviews, setNodePreviews] = (0, import_react.useState)({});
	const canvasRef = (0, import_react.useRef)(null);
	const dragStateRef = (0, import_react.useRef)(null);
	const pendingWireRef = (0, import_react.useRef)(null);
	const [pendingWire, setPendingWireState] = (0, import_react.useState)(null);
	function setPendingWire(next) {
		pendingWireRef.current = next;
		setPendingWireState(next);
	}
	const nodeMap = (0, import_react.useMemo)(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
	const validation = (0, import_react.useMemo)(() => validateEditorGraph(nodes, connections), [nodes, connections]);
	const activeStudioImage = plate?.url || upload || "/viz/t03-compact-living-room.jpg";
	const activeBinaryMask = binaryMaskDataUrl || maskDataUrl;
	function toCanvasCoords(clientX, clientY) {
		const el = canvasRef.current;
		const rect = el?.getBoundingClientRect();
		if (!rect || !el) return {
			x: 40,
			y: 40
		};
		return {
			x: Math.max(8, Math.round(clientX - rect.left + el.scrollLeft)),
			y: Math.max(8, Math.round(clientY - rect.top + el.scrollTop))
		};
	}
	function addNode(kind, dropPos) {
		const spec = EDITOR_NODE_SPECS[kind];
		const id = `node-${kind.slice(0, 3)}-${Date.now().toString(36).slice(-4)}`;
		let pos = dropPos;
		if (!pos) {
			const cols = [
				20,
				280,
				540
			];
			const rows = [
				24,
				292,
				540
			];
			let chosen;
			for (const ry of rows) {
				for (const cx of cols) if (!nodes.some((n) => Math.abs(n.x - cx) < 190 && Math.abs(n.y - ry) < 220)) {
					chosen = {
						x: cx,
						y: ry
					};
					break;
				}
				if (chosen) break;
			}
			pos = chosen ?? {
				x: 40 + nodes.length * 36 % 240,
				y: 292 + nodes.length * 28 % 160
			};
		}
		const created = {
			id,
			kind,
			title: spec.title,
			x: pos.x,
			y: pos.y,
			config: { ...spec.defaultConfig }
		};
		setNodes((prev) => [...prev, created]);
		setSelectedNodeId(id);
		toast.message(`Added ${spec.title} node`);
	}
	function deleteNode(nodeId) {
		setNodes((prev) => prev.filter((n) => n.id !== nodeId));
		setConnections((prev) => prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId));
		if (selectedNodeId === nodeId) setSelectedNodeId(null);
	}
	function updateNodeConfig(nodeId, key, value) {
		setNodes((prev) => prev.map((n) => n.id === nodeId ? {
			...n,
			config: {
				...n.config,
				[key]: value
			}
		} : n));
	}
	function connectPorts(fromNodeId, fromPortId, fromType, toNodeId, toPortId, toType) {
		if (fromNodeId === toNodeId) return;
		if (!canConnectEditorPorts(fromType, toType)) {
			toast.error(`Cannot connect ${fromType} output into ${toType} input.`);
			return;
		}
		const newConn = {
			id: `conn-${Date.now().toString(36).slice(-5)}`,
			fromNodeId,
			fromPortId,
			toNodeId,
			toPortId
		};
		setConnections((prev) => [...prev.filter((c) => !(c.toNodeId === toNodeId && c.toPortId === toPortId)), newConn]);
	}
	function handleCanvasPointerMove(e) {
		if (dragStateRef.current) {
			const drag = dragStateRef.current;
			const dx = e.clientX - drag.startClientX;
			const dy = e.clientY - drag.startClientY;
			setNodes((prev) => prev.map((n) => n.id === drag.nodeId ? {
				...n,
				x: Math.max(8, Math.round(drag.origX + dx)),
				y: Math.max(8, Math.round(drag.origY + dy))
			} : n));
			return;
		}
		if (pendingWireRef.current) {
			const pt = toCanvasCoords(e.clientX, e.clientY);
			const updated = {
				...pendingWireRef.current,
				cursorX: pt.x,
				cursorY: pt.y
			};
			pendingWireRef.current = updated;
			setPendingWireState(updated);
		}
	}
	function handleCanvasPointerUp() {
		dragStateRef.current = null;
	}
	async function handleRunWorkflow() {
		if (running) return;
		if (!validation.valid) {
			toast.error(validation.issues[0] || "Check node connections before running.");
			return;
		}
		setRunning(true);
		try {
			const nodeOutputs = {};
			for (const nodeId of validation.order) {
				const node = nodeMap.get(nodeId);
				if (!node) continue;
				const incomingFor = (portId) => {
					const edge = connections.find((c) => c.toNodeId === node.id && c.toPortId === portId);
					return edge ? nodeOutputs[edge.fromNodeId] : void 0;
				};
				if (node.kind === "image-input") {
					const imgUrl = String(node.config.source ?? "studio-active") === "studio-active" ? activeStudioImage : String(node.config.customUrl || activeStudioImage);
					nodeOutputs[node.id] = { imageUrl: imgUrl };
					setNodePreviews((prev) => ({
						...prev,
						[node.id]: imgUrl
					}));
				} else if (node.kind === "controlnet-config") {
					const srcImg = incomingFor("image")?.imageUrl || activeStudioImage;
					const prep = String(node.config.preprocessor || "canny");
					const cvRes = prep === "depth" ? await runDepthAnythingPass(srcImg, true, 55) : await runAnnotatorPass(srcImg, prep, 58);
					nodeOutputs[node.id] = {
						controlUrl: cvRes.dataUrl,
						imageUrl: cvRes.dataUrl
					};
					setNodePreviews((prev) => ({
						...prev,
						[node.id]: cvRes.dataUrl
					}));
				} else if (node.kind === "prompt-modifier") {
					const preset = String(node.config.stylePreset || "");
					const lighting = String(node.config.lighting || "");
					const text = String(node.config.promptText || "");
					nodeOutputs[node.id] = { prompt: [
						preset,
						lighting,
						text
					].filter(Boolean).join(", ") };
				} else if (node.kind === "sam2-mask") {
					const srcImg = incomingFor("image")?.imageUrl || activeStudioImage;
					let maskUrl = activeBinaryMask || "";
					if (!maskUrl) maskUrl = (await runGroundedSam2Segment({
						src: srcImg,
						prompt: String(node.config.targetObject || "windows and glazing"),
						threshold: 45
					})).maskDataUrl;
					nodeOutputs[node.id] = { maskUrl };
					if (maskUrl) setNodePreviews((prev) => ({
						...prev,
						[node.id]: maskUrl
					}));
				} else if (node.kind === "render-engine") {
					const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
					const controlUrl = incomingFor("control")?.controlUrl;
					const promptNote = incomingFor("prompt")?.prompt || "Architectural visualization photorealistic render";
					const wiredMask = incomingFor("mask")?.maskUrl;
					const mode = String(node.config.engineMode || "hybrid");
					let finalUrl = baseImg;
					if (mode === "cloud") {
						const res = wiredMask ? await inpaintPlate({ data: {
							idea: promptNote,
							image: baseImg,
							maskImage: wiredMask,
							annotatorImage: controlUrl,
							design,
							frame,
							engine,
							scene3d
						} }) : await generatePlate({ data: {
							idea: promptNote,
							image: baseImg,
							annotatorImage: controlUrl,
							design,
							frame,
							engine,
							scene3d
						} });
						finalUrl = res.fallback ? await synthesizeFallbackComposite({
							baseImage: baseImg,
							sketchImage: controlUrl,
							maskImage: wiredMask,
							serverFallbackUrl: res.url,
							design,
							engine,
							scene3d,
							idea: promptNote
						}) : res.url;
						if ("warning" in res && typeof res.warning === "string" && res.warning) toast.message(res.warning);
					} else finalUrl = await synthesizeFallbackComposite({
						baseImage: baseImg,
						sketchImage: controlUrl,
						maskImage: wiredMask,
						serverFallbackUrl: baseImg,
						design,
						engine,
						scene3d,
						idea: promptNote
					});
					nodeOutputs[node.id] = { imageUrl: finalUrl };
					setNodePreviews((prev) => ({
						...prev,
						[node.id]: finalUrl
					}));
				} else if (node.kind === "video-render") {
					const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
					nodeOutputs[node.id] = { imageUrl: baseImg };
					setNodePreviews((prev) => ({
						...prev,
						[node.id]: baseImg
					}));
					toast.message(`Motion sequence compiled: ${String(node.config.preset ?? "Day → Golden → Midnight")}`);
				} else if (node.kind === "pano-360") {
					const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
					nodeOutputs[node.id] = { imageUrl: baseImg };
					setNodePreviews((prev) => ({
						...prev,
						[node.id]: baseImg
					}));
					onSendResultToStudio?.(baseImg, "360° Node Output");
				} else if (node.kind === "glb-3d") {
					const baseImg = incomingFor("image")?.imageUrl || activeStudioImage;
					nodeOutputs[node.id] = { imageUrl: baseImg };
					setNodePreviews((prev) => ({
						...prev,
						[node.id]: baseImg
					}));
				}
			}
			toast.success("Architectural node workflow executed");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Node workflow execution failed.");
		} finally {
			setRunning(false);
		}
	}
	function handleResetGraph() {
		const def = createDefaultEditorGraph();
		setNodes(def.nodes);
		setConnections(def.connections);
		setNodePreviews({});
		setSelectedNodeId(def.nodes[0]?.id ?? null);
		toast.message("Reset node workflow");
	}
	const pendingStart = (0, import_react.useMemo)(() => {
		if (!pendingWire) return null;
		const node = nodeMap.get(pendingWire.nodeId);
		if (!node) return null;
		return getEditorPortCoords(node, pendingWire.direction, pendingWire.portId);
	}, [pendingWire, nodeMap]);
	const latestRenderUrl = (0, import_react.useMemo)(() => {
		const engines = nodes.filter((n) => n.kind === "render-engine");
		for (const re of [...engines].reverse()) if (nodePreviews[re.id]) return nodePreviews[re.id];
	}, [nodes, nodePreviews]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "node-editor-canvas",
		className: "flex flex-col bg-[#14110f] text-[#f6efe4]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 border-b border-white/10 bg-[#191511] px-3 py-2.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1 font-mono text-[10px] tracking-[0.14em] text-[#e7c27a] uppercase",
							children: "Drag Node onto Canvas:"
						}), EDITOR_PALETTE_ORDER.map((kind) => {
							const spec = EDITOR_NODE_SPECS[kind];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								draggable: true,
								onDragStart: (e) => {
									e.dataTransfer.setData("application/x-oriel-editor-node", kind);
									e.dataTransfer.effectAllowed = "copy";
								},
								onClick: () => addNode(kind),
								className: "inline-flex h-7 shrink-0 cursor-grab items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#f0e6d8] transition hover:border-[#d4b06a] hover:bg-white/10 active:cursor-grabbing",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2 rounded-full",
										style: { backgroundColor: spec.accent }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: spec.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 text-[#e7c27a]" })
								]
							}, kind);
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleResetGraph,
								className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Reset"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: running,
								onClick: () => void handleRunWorkflow(),
								className: "gold-fill inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-60",
								children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), "Run Workflow"]
							}),
							latestRenderUrl && onSendResultToStudio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onSendResultToStudio(latestRenderUrl, "NodeEditorCanvas Render"),
								className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a] bg-[#d4b06a]/15 px-3 text-[11px] font-semibold text-[#f5dfaf] hover:bg-[#d4b06a]/25",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Send to Studio Plate"]
							}) : null
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: canvasRef,
				"data-testid": "node-editor-dropzone",
				onPointerMove: handleCanvasPointerMove,
				onPointerUp: handleCanvasPointerUp,
				onPointerDown: (e) => {
					if (e.target === e.currentTarget) {
						setSelectedNodeId(null);
						setPendingWire(null);
					}
				},
				onDragOver: (e) => {
					e.preventDefault();
					e.dataTransfer.dropEffect = "copy";
				},
				onDrop: (e) => {
					e.preventDefault();
					const kind = e.dataTransfer.getData("application/x-oriel-editor-node");
					if (!kind || !EDITOR_NODE_SPECS[kind]) return;
					const pt = toCanvasCoords(e.clientX, e.clientY);
					addNode(kind, {
						x: Math.max(8, pt.x - 110),
						y: Math.max(8, pt.y - 24)
					});
				},
				className: "relative h-[540px] w-full overflow-auto select-none bg-[#12100e]",
				style: {
					backgroundImage: "radial-gradient(circle, rgba(231, 194, 122, 0.14) 1px, transparent 1px)",
					backgroundSize: "22px 22px"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-h-[540px] min-w-[820px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						"data-testid": "node-editor-svg-connections",
						className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
						children: [connections.map((conn) => {
							const srcNode = nodeMap.get(conn.fromNodeId);
							const dstNode = nodeMap.get(conn.toNodeId);
							if (!srcNode || !dstNode) return null;
							const p1 = getEditorPortCoords(srcNode, "output", conn.fromPortId);
							const p2 = getEditorPortCoords(dstNode, "input", conn.toPortId);
							const line = buildSvgLineData(p1.x, p1.y, p2.x, p2.y);
							const srcPort = EDITOR_NODE_SPECS[srcNode.kind].outputs.find((p) => p.id === conn.fromPortId);
							const color = srcPort ? EDITOR_PORT_COLORS[srcPort.type] : "#e7c27a";
							const isHovered = hoveredConnId === conn.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: line.pathD,
									fill: "none",
									stroke: "transparent",
									strokeWidth: 14,
									className: "pointer-events-auto cursor-pointer",
									onMouseEnter: () => setHoveredConnId(conn.id),
									onMouseLeave: () => setHoveredConnId((prev) => prev === conn.id ? null : prev),
									onClick: (e) => {
										e.stopPropagation();
										setConnections((prev) => prev.filter((c) => c.id !== conn.id));
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: line.pathD,
									fill: "none",
									stroke: color,
									strokeWidth: isHovered ? 3.2 : 2.2,
									strokeOpacity: isHovered ? 1 : .85
								}),
								isHovered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
									className: "pointer-events-auto cursor-pointer",
									onClick: (e) => {
										e.stopPropagation();
										setConnections((prev) => prev.filter((c) => c.id !== conn.id));
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
											cx: line.midX,
											cy: line.midY,
											r: 9,
											fill: "#14110f",
											stroke: "#ef4444",
											strokeWidth: 1.5
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: line.midX - 3,
											y1: line.midY - 3,
											x2: line.midX + 3,
											y2: line.midY + 3,
											stroke: "#fca5a5",
											strokeWidth: 1.6
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: line.midX + 3,
											y1: line.midY - 3,
											x2: line.midX - 3,
											y2: line.midY + 3,
											stroke: "#fca5a5",
											strokeWidth: 1.6
										})
									]
								}) : null
							] }, conn.id);
						}), pendingWire && pendingStart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: pendingStart.x,
							y1: pendingStart.y,
							x2: pendingWire.cursorX,
							y2: pendingWire.cursorY,
							stroke: EDITOR_PORT_COLORS[pendingWire.portType],
							strokeWidth: 2.5,
							strokeDasharray: "6 4"
						}) : null]
					}), nodes.map((node) => {
						const spec = EDITOR_NODE_SPECS[node.kind];
						const selected = selectedNodeId === node.id;
						const portRows = Math.max(spec.inputs.length, spec.outputs.length);
						const previewUrl = nodePreviews[node.id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": `editor-node-${node.kind}`,
							style: {
								left: node.x,
								top: node.y,
								width: 228
							},
							onPointerDown: (e) => {
								e.stopPropagation();
								setSelectedNodeId(node.id);
								dragStateRef.current = {
									nodeId: node.id,
									startClientX: e.clientX,
									startClientY: e.clientY,
									origX: node.x,
									origY: node.y
								};
							},
							className: cn("absolute rounded-2xl border bg-[#1c1915] text-xs text-[#f6efe4] shadow-[0_12px_28px_rgba(0,0,0,0.45)]", selected ? "border-[#e7c27a] ring-1 ring-[#e7c27a]" : "border-white/15 hover:border-white/30"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-[40px] cursor-grab items-center justify-between gap-2 rounded-t-2xl border-b border-white/10 bg-white/5 px-3 active:cursor-grabbing",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 items-center gap-1.5",
										children: [node.kind === "image-input" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5 shrink-0 text-sky-400" }) : node.kind === "controlnet-config" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "size-3.5 shrink-0 text-cyan-400" }) : node.kind === "prompt-modifier" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "size-3.5 shrink-0 text-amber-400" }) : node.kind === "sam2-mask" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-3.5 shrink-0 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-3.5 shrink-0 text-[#e7c27a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-semibold",
											children: node.title
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Delete ${node.title}`,
										onPointerDown: (e) => e.stopPropagation(),
										onClick: (e) => {
											e.stopPropagation();
											deleteNode(node.id);
										},
										className: "grid size-5 place-items-center rounded text-white/50 hover:bg-white/10 hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-3",
									children: Array.from({ length: portRows }).map((_, idx) => {
										const inPort = spec.inputs[idx];
										const outPort = spec.outputs[idx];
										const compatible = pendingWire && inPort && pendingWire.direction === "output" && pendingWire.nodeId !== node.id && canConnectEditorPorts(pendingWire.portType, inPort.type);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											style: { height: 26 },
											children: [inPort ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onPointerDown: (e) => {
													e.stopPropagation();
													const cur = pendingWireRef.current;
													if (cur && cur.direction === "output") {
														connectPorts(cur.nodeId, cur.portId, cur.portType, node.id, inPort.id, inPort.type);
														setPendingWire(null);
													} else {
														const pt = getEditorPortCoords(node, "input", inPort.id);
														setPendingWire({
															direction: "input",
															nodeId: node.id,
															portId: inPort.id,
															portType: inPort.type,
															cursorX: pt.x - 24,
															cursorY: pt.y
														});
													}
												},
												onPointerUp: (e) => {
													e.stopPropagation();
													const cur = pendingWireRef.current;
													if (cur && cur.direction === "output") {
														connectPorts(cur.nodeId, cur.portId, cur.portType, node.id, inPort.id, inPort.type);
														setPendingWire(null);
													}
												},
												className: "relative flex items-center gap-1.5 pl-3 text-[11px] text-[#cbbba6] hover:text-white",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("absolute -left-[6px] size-3 rounded-full border border-[#14110f] transition-transform", compatible && "scale-125 ring-2 ring-[#e7c27a]"),
													style: { backgroundColor: EDITOR_PORT_COLORS[inPort.type] }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [inPort.label, inPort.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-amber-400",
													children: " *"
												}) : null] })]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), outPort ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onPointerDown: (e) => {
													e.stopPropagation();
													const cur = pendingWireRef.current;
													if (cur && cur.direction === "input") {
														connectPorts(node.id, outPort.id, outPort.type, cur.nodeId, cur.portId, cur.portType);
														setPendingWire(null);
													} else {
														const pt = getEditorPortCoords(node, "output", outPort.id);
														setPendingWire({
															direction: "output",
															nodeId: node.id,
															portId: outPort.id,
															portType: outPort.type,
															cursorX: pt.x + 28,
															cursorY: pt.y
														});
													}
												},
												onPointerUp: (e) => {
													e.stopPropagation();
													const cur = pendingWireRef.current;
													if (cur && cur.direction === "input") {
														connectPorts(node.id, outPort.id, outPort.type, cur.nodeId, cur.portId, cur.portType);
														setPendingWire(null);
													}
												},
												className: cn("group relative flex items-center gap-1.5 pr-3 text-[11px] text-[#cbbba6] hover:text-white"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: outPort.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: cn("absolute -right-[6px] size-3 rounded-full border border-[#14110f] transition-transform group-hover:scale-125", pendingWire && pendingWire.direction === "input" && pendingWire.nodeId !== node.id && canConnectEditorPorts(outPort.type, pendingWire.portType) && "scale-125 ring-2 ring-[#e7c27a]"),
													style: { backgroundColor: EDITOR_PORT_COLORS[outPort.type] }
												})]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})]
										}, idx);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onPointerDown: (e) => e.stopPropagation(),
									className: "space-y-1.5 border-t border-white/10 px-3 py-2 text-[11px]",
									children: [
										node.kind === "image-input" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Image input source",
												value: String(node.config.source ?? "studio-active"),
												onChange: (e) => updateNodeConfig(node.id, "source", e.target.value),
												className: "h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "studio-active",
													children: "Active Studio Frame"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "sample",
													children: "Sample Architectural Scene"
												})]
											}),
											node.config.source === "sample" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												"aria-label": "Sample architectural scene",
												value: String(node.config.customUrl ?? SAMPLE_SCENES[0].url),
												onChange: (e) => updateNodeConfig(node.id, "customUrl", e.target.value),
												className: "h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none",
												children: SAMPLE_SCENES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: s.url,
													children: s.label
												}, s.url))
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }),
													" Upload Image",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "file",
														accept: "image/*",
														className: "sr-only",
														onChange: (ev) => {
															const f = ev.target.files?.[0];
															if (f) readImage(f, 1024).then((url) => {
																updateNodeConfig(node.id, "source", "sample");
																updateNodeConfig(node.id, "customUrl", url);
															});
															ev.target.value = "";
														}
													})
												]
											})
										] }) : null,
										node.kind === "controlnet-config" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											"aria-label": "ControlNet preprocessor",
											value: String(node.config.preprocessor ?? "canny"),
											onChange: (e) => updateNodeConfig(node.id, "preprocessor", e.target.value),
											className: "h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none",
											children: CONTROLNET_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
												value: m,
												children: [m.toUpperCase(), " Conditioning"]
											}, m))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center justify-between gap-2 text-[10px] text-[#cbbba6]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Weight" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: .1,
													max: 1,
													step: .05,
													value: Number(node.config.strength ?? .78),
													onChange: (e) => updateNodeConfig(node.id, "strength", Number(e.target.value)),
													className: "h-1 w-24 accent-[#d4b06a]"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[#e7c27a]",
													children: Number(node.config.strength ?? .78).toFixed(2)
												})
											]
										})] }) : null,
										node.kind === "prompt-modifier" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											"aria-label": "Prompt modifier text",
											value: String(node.config.promptText ?? ""),
											onChange: (e) => updateNodeConfig(node.id, "promptText", e.target.value),
											className: "h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center justify-between text-[10px] text-[#b9aa95]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Lighting: ", String(node.config.lighting ?? "Golden Hour")] })
										})] }) : null,
										node.kind === "sam2-mask" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[10px] text-[#cbbba6]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeBinaryMask ? "Binary mask loaded" : "No binary mask yet" }), onOpenSam2Tool ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: onOpenSam2Tool,
													className: "rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-200",
													children: "Click-to-Mask"
												}) : null]
											})
										}) : null,
										node.kind === "render-engine" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Render Engine Mode",
												value: String(node.config.engineMode ?? "hybrid"),
												onChange: (e) => updateNodeConfig(node.id, "engineMode", e.target.value),
												className: "h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "hybrid",
													children: "Hybrid Fast Render"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "cloud",
													children: "Cloud AI Render"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: running,
												onClick: () => void handleRunWorkflow(),
												className: "gold-fill flex h-7 w-full items-center justify-center gap-1 rounded-full text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-60",
												children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), "Render Pipeline"]
											})]
										}) : null,
										node.kind === "video-render" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												"aria-label": "Motion lighting preset",
												value: String(node.config.preset ?? "Day → Golden → Midnight"),
												onChange: (e) => updateNodeConfig(node.id, "preset", e.target.value),
												className: "h-7 w-full rounded-lg border border-white/15 bg-black/50 px-2 text-[11px] text-[#f6efe4] outline-none",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Day → Golden → Midnight",
														children: "Day → Golden → Midnight"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "Morning → Solar Noon",
														children: "Morning → Solar Noon"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "4s Orbit-Dolly-Zoom",
														children: "4s Orbit-Dolly-Zoom"
													})
												]
											}), onOpenStage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onOpenStage("3d"),
												className: "w-full rounded-full border border-white/20 bg-white/5 py-1 text-[10px] text-[#f6efe4] hover:border-[#d4b06a]",
												children: "Open 3D Flythrough Rig"
											}) : null]
										}) : null,
										node.kind === "pano-360" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[10px] text-[#cbbba6]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"FOV: ",
													String(node.config.fov ?? 72),
													"°"
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hotspots Ready" })]
											}), onOpenStage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onOpenStage("360"),
												className: "gold-fill flex h-7 w-full items-center justify-center rounded-full text-[11px] font-semibold text-[#2a1c0c]",
												children: "Launch 360° Tour"
											}) : null]
										}) : null,
										node.kind === "glb-3d" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-[10px] text-[#cbbba6]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mood Frozen" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GLB Sync" })]
											}), onOpenStage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => onOpenStage("3d"),
												className: "w-full rounded-full border border-white/20 bg-white/5 py-1 text-[10px] text-[#f6efe4] hover:border-[#d4b06a]",
												children: "Open 3D / GLB Stage"
											}) : null]
										}) : null,
										previewUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: previewUrl,
											alt: `${node.title} preview`,
											className: "mt-1 h-20 w-full rounded-lg border border-white/10 object-cover"
										}) : null
									]
								})
							]
						}, node.id);
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#191511] px-3 py-2 text-[11px] text-[#cbbba6]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: cn("size-3.5", validation.valid ? "text-emerald-400" : "text-amber-400") }), validation.valid ? `SVG Pipeline Ready · ${nodes.length} nodes · ${connections.length} connections` : validation.issues[0]]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-[10px] text-[#b9aa95]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3 text-[#e7c27a]" }), " Click/drag output circle → input circle to wire · Click line to remove"]
				})]
			})
		]
	});
}
var QUICK_PALETTE_TYPES = [
	{
		type: "input.load_image",
		badge: "Image Load"
	},
	{
		type: "conditioning.canny_edge",
		badge: "ControlNet Canny"
	},
	{
		type: "conditioning.depth_map",
		badge: "ControlNet Depth"
	},
	{
		type: "input.text_prompt",
		badge: "Prompt Modifier"
	},
	{
		type: "segmentation.text_select",
		badge: "Grounded-SAM 2"
	},
	{
		type: "editing.material_replace",
		badge: "Material Replace"
	},
	{
		type: "generation.image_to_image",
		badge: "Render Engine"
	},
	{
		type: "editing.relight",
		badge: "Relight"
	},
	{
		type: "output.compare_versions",
		badge: "Compare"
	}
];
function NodeStudioEmbedded({ onPromoteToStudio }) {
	const hydrated = useHydrated();
	const nodeWorkflows = useOriel((s) => s.nodeWorkflows);
	const activeNodeWorkflowId = useOriel((s) => s.activeNodeWorkflowId);
	const nodeExecutionMode = useOriel((s) => s.nodeExecutionMode);
	const setActiveNodeWorkflowId = useOriel((s) => s.setActiveNodeWorkflowId);
	const upsertNodeWorkflow = useOriel((s) => s.upsertNodeWorkflow);
	const createNodeWorkflowFromTemplate = useOriel((s) => s.createNodeWorkflowFromTemplate);
	const setNodeExecutionMode = useOriel((s) => s.setNodeExecutionMode);
	const addNodeRevision = useOriel((s) => s.addNodeRevision);
	const upload = useOriel((s) => s.upload);
	const plate = useOriel((s) => s.plate);
	const maskDataUrl = useOriel((s) => s.maskDataUrl);
	const setPlate = useOriel((s) => s.setPlate);
	const setUpload = useOriel((s) => s.setUpload);
	const design = useOriel((s) => s.design);
	const frame = useOriel((s) => s.frame);
	const engine = useOriel((s) => s.engine);
	const scene3d = useOriel((s) => s.scene3d);
	const activeWorkflow = (0, import_react.useMemo)(() => nodeWorkflows.find((w) => w.id === activeNodeWorkflowId) ?? nodeWorkflows[0] ?? WORKFLOW_TEMPLATES[0], [nodeWorkflows, activeNodeWorkflowId]);
	const [selectedNodeId, setSelectedNodeId] = (0, import_react.useState)(activeWorkflow.nodes[0]?.id ?? null);
	const [executionResults, setExecutionResults] = (0, import_react.useState)({});
	const [running, setRunning] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const validation = (0, import_react.useMemo)(() => validateWorkflowGraph(activeWorkflow.nodes, activeWorkflow.edges), [activeWorkflow.nodes, activeWorkflow.edges]);
	const selectedNode = (0, import_react.useMemo)(() => activeWorkflow.nodes.find((n) => n.id === selectedNodeId) ?? null, [activeWorkflow.nodes, selectedNodeId]);
	const selectedSpec = selectedNode ? getNodeSpec(selectedNode.type) : void 0;
	const paletteItems = (0, import_react.useMemo)(() => {
		const q = search.trim();
		if (!q) return QUICK_PALETTE_TYPES.map((item) => {
			const spec = getNodeSpec(item.type);
			return spec ? {
				spec,
				display: item.badge
			} : null;
		}).filter((x) => Boolean(x));
		return NODE_CATALOG.filter((spec) => matchesNodeSearch(spec, q)).slice(0, 12).map((spec) => ({
			spec,
			display: spec.title
		}));
	}, [search]);
	const latestOutputUrl = (0, import_react.useMemo)(() => {
		for (const id of [...validation.executionOrder].reverse()) {
			const res = executionResults[id];
			if (res?.imageUrl) return res.imageUrl;
		}
	}, [validation.executionOrder, executionResults]);
	function commitWorkflow(next) {
		upsertNodeWorkflow(next);
	}
	function handleAddNode(spec, position) {
		let pos = position;
		if (!pos) {
			if (activeWorkflow.nodes.length === 0) pos = {
				x: 80,
				y: 100
			};
			else {
				const minX = Math.min(...activeWorkflow.nodes.map((n) => n.position.x));
				const maxY = Math.max(...activeWorkflow.nodes.map((n) => n.position.y));
				pos = {
					x: minX + activeWorkflow.nodes.filter((n) => n.position.y >= maxY - 40).length % 3 * 280,
					y: maxY + 210
				};
			}
		}
		const instance = createNodeInstance(spec.type, pos);
		commitWorkflow({
			...activeWorkflow,
			nodes: [...activeWorkflow.nodes, instance]
		});
		setSelectedNodeId(instance.id);
		toast.message(`Added ${spec.title} node`);
	}
	function handleMoveNode(nodeId, position) {
		commitWorkflow({
			...activeWorkflow,
			nodes: activeWorkflow.nodes.map((n) => n.id === nodeId ? {
				...n,
				position
			} : n)
		});
	}
	function handleAddEdge(edge) {
		const filtered = activeWorkflow.edges.filter((e) => !(e.targetNodeId === edge.targetNodeId && e.targetPortId === edge.targetPortId));
		const created = {
			...edge,
			id: `edge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`
		};
		commitWorkflow({
			...activeWorkflow,
			edges: [...filtered, created]
		});
	}
	function handleRemoveEdge(edgeId) {
		commitWorkflow({
			...activeWorkflow,
			edges: activeWorkflow.edges.filter((e) => e.id !== edgeId)
		});
	}
	function handleDeleteNode(nodeId) {
		commitWorkflow({
			...activeWorkflow,
			nodes: activeWorkflow.nodes.filter((n) => n.id !== nodeId),
			edges: activeWorkflow.edges.filter((e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId)
		});
		if (selectedNodeId === nodeId) setSelectedNodeId(null);
	}
	function handleAutoLayout() {
		commitWorkflow({
			...activeWorkflow,
			nodes: autoLayoutGraph(activeWorkflow.nodes, activeWorkflow.edges)
		});
		toast.success("Auto-layout applied");
	}
	function handleUpdateNodeParam(nodeId, key, value) {
		commitWorkflow({
			...activeWorkflow,
			nodes: activeWorkflow.nodes.map((n) => n.id === nodeId ? {
				...n,
				params: {
					...n.params,
					[key]: value
				}
			} : n)
		});
	}
	function handleLoadTemplate(templateId) {
		const existing = nodeWorkflows.find((w) => w.id === templateId);
		if (existing) {
			setActiveNodeWorkflowId(existing.id);
			setSelectedNodeId(existing.nodes[0]?.id ?? null);
		} else {
			const created = createNodeWorkflowFromTemplate(templateId);
			setSelectedNodeId(created.nodes[0]?.id ?? null);
		}
		setExecutionResults({});
	}
	function handleSyncStudioFrame() {
		const activeSrc = plate?.url || upload;
		if (!activeSrc) {
			toast.message("Upload or generate a render first to sync it into Load Image.");
			return;
		}
		commitWorkflow({
			...activeWorkflow,
			nodes: activeWorkflow.nodes.map((n) => n.type === "input.load_image" ? {
				...n,
				params: {
					...n.params,
					source: "__studio_active__",
					customUrl: activeSrc
				}
			} : n)
		});
		toast.success("Synced active Studio render into Load Image nodes");
	}
	function syncPlateToStudio(url, title) {
		setUpload(url);
		setPlate({
			url,
			upload: upload ?? void 0,
			templateId: engine.workflowPreset,
			idea: title ? `Node Pipeline: ${title}` : `Node Pipeline (${activeWorkflow.name})`
		});
	}
	function promoteResult(url, title) {
		syncPlateToStudio(url, title);
		if (onPromoteToStudio) {
			onPromoteToStudio(url, title);
			return;
		}
		toast.success("Node output promoted to Studio Plate");
	}
	async function handleRunWorkflow() {
		if (running) return;
		if (!validation.valid) {
			toast.error(validation.issues[0]?.message || "Fix disconnected required inputs before running.");
			return;
		}
		setRunning(true);
		setExecutionResults({});
		const activeSrc = plate?.url || upload || "/viz/t03-compact-living-room.jpg";
		try {
			const outcome = await executeNodeWorkflow(activeWorkflow, nodeExecutionMode, {
				activeImageUrl: activeSrc,
				activeMaskUrl: maskDataUrl,
				design,
				frame,
				engine,
				scene3d,
				onAssetPromoted: (img, title) => syncPlateToStudio(img, title)
			}, (nodeId, res) => {
				setExecutionResults((prev) => ({
					...prev,
					[nodeId]: res
				}));
			});
			const compareRes = Object.values(outcome.results).find((r) => typeof r.diffOutsideMaskPct === "number");
			addNodeRevision({
				workflowId: activeWorkflow.id,
				label: `${activeWorkflow.name} Studio Run`,
				mode: nodeExecutionMode,
				nodeCount: activeWorkflow.nodes.length,
				edgeCount: activeWorkflow.edges.length,
				outputPreviewUrl: outcome.finalImageUrl,
				diffOutsideMaskPct: compareRes?.diffOutsideMaskPct,
				snapshot: activeWorkflow
			});
			toast.success("Node pipeline executed cleanly");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Workflow run failed.");
		} finally {
			setRunning(false);
		}
	}
	const primaryParam = selectedSpec?.params[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "embedded-node-studio",
		className: "flex flex-col bg-[#14110f] text-[#f6efe4]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-b border-white/10 bg-[#191511] px-3 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-[#e7c27a] uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "size-3.5" }), " Visual Node Graph"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Embedded workflow template",
								value: activeWorkflow.id,
								onChange: (e) => handleLoadTemplate(e.target.value),
								className: "h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]",
								children: [WORKFLOW_TEMPLATES.map((tpl) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: tpl.id,
									children: tpl.name
								}, tpl.id)), nodeWorkflows.filter((w) => !WORKFLOW_TEMPLATES.some((t) => t.id === w.id)).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: w.id,
									children: w.name
								}, w.id))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-[#b9aa95]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"aria-label": "Search architectural nodes",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Find node (Image Load, ControlNet...)",
									className: "h-7 w-48 rounded-full border border-white/15 bg-black/45 pr-2.5 pl-7 text-[11px] text-[#f6efe4] outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": "Node execution engine mode",
								value: nodeExecutionMode,
								onChange: (e) => setNodeExecutionMode(e.target.value),
								className: "h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "local",
										children: "Local Preview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hybrid",
										children: "Hybrid Smart"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cloud",
										children: "Cloud Gen"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleSyncStudioFrame,
								className: "inline-flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3 text-[#e7c27a]" }), " Sync Frame"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: running,
								onClick: () => void handleRunWorkflow(),
								className: "gold-fill inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-60",
								children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), "Run Graph"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/nodes",
								className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 px-2.5 text-[11px] font-medium text-[#f5dfaf] hover:bg-[#d4b06a]/25",
								children: ["Full Editor ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "embedded-node-palette",
					className: "no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-0.5 md:flex-wrap md:overflow-x-visible",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 font-mono text-[10px] text-[#b9aa95] uppercase",
						children: "Drag or Click Node:"
					}), paletteItems.map(({ spec, display }) => {
						const cat = CATEGORY_META[spec.category];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							draggable: true,
							onDragStart: (e) => {
								e.dataTransfer.setData("application/x-oriel-node", spec.type);
								e.dataTransfer.effectAllowed = "copy";
							},
							onClick: () => handleAddNode(spec),
							title: `Drag onto canvas or click to add ${spec.title}`,
							className: "inline-flex h-7 shrink-0 cursor-grab items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#f0e6d8] transition hover:border-[#d4b06a] hover:bg-white/10 active:cursor-grabbing",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block size-2 rounded-full",
									style: { backgroundColor: cat.accent }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: display }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 text-[#e7c27a]" })
							]
						}, spec.type);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-[440px] w-full md:h-[500px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeStudioCanvas, {
					workflowId: activeWorkflow.id,
					nodes: activeWorkflow.nodes,
					edges: activeWorkflow.edges,
					selectedNodeId,
					executionResults,
					onSelectNode: setSelectedNodeId,
					onMoveNode: handleMoveNode,
					onAddEdge: handleAddEdge,
					onRemoveEdge: handleRemoveEdge,
					onDeleteNode: handleDeleteNode,
					onDropNewNode: (type, pos) => {
						const spec = getNodeSpec(type);
						if (spec) handleAddNode(spec, pos);
					},
					onAutoLayout: handleAutoLayout
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#191511] px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: cn("inline-flex items-center gap-1 font-mono text-[10px]", validation.valid ? "text-emerald-300" : "text-amber-300"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), validation.valid ? `Valid DAG (${activeWorkflow.nodes.length}N · ${activeWorkflow.edges.length}E${hydrated ? ` · ${validation.durationMs}ms` : ""})` : validation.issues[0]?.message || "Check disconnected ports"]
					}), selectedNode && selectedSpec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 border-l border-white/15 pl-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-[#e7c27a]",
							children: [selectedSpec.title, ":"]
						}), primaryParam ? primaryParam.kind === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							"aria-label": primaryParam.label,
							value: String(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue),
							onChange: (e) => handleUpdateNodeParam(selectedNode.id, primaryParam.key, e.target.value),
							className: "h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]",
							children: primaryParam.options?.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: opt,
								children: opt
							}, opt))
						}) : primaryParam.kind === "slider" || primaryParam.kind === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex items-center gap-1.5 text-[11px] text-[#d5cab9]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: primaryParam.label }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: primaryParam.min ?? 0,
									max: primaryParam.max ?? 100,
									step: primaryParam.step ?? 1,
									value: Number(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue),
									onChange: (e) => handleUpdateNodeParam(selectedNode.id, primaryParam.key, Number(e.target.value)),
									className: "h-1 w-20 accent-[#d4b06a]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] text-[#e7c27a]",
									children: String(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue)
								})
							]
						}) : primaryParam.kind === "text" || primaryParam.kind === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							"aria-label": primaryParam.label,
							value: String(selectedNode.params[primaryParam.key] ?? primaryParam.defaultValue),
							onChange: (e) => handleUpdateNodeParam(selectedNode.id, primaryParam.key, e.target.value),
							className: "h-7 w-56 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]"
						}) : null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-[#b9aa95]",
							children: selectedSpec.summary
						})]
					}) : null]
				}), latestOutputUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => promoteResult(latestOutputUrl, selectedSpec?.title),
					className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a] bg-[#d4b06a]/15 px-3 text-[11px] font-semibold text-[#f5dfaf] hover:bg-[#d4b06a]/25",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Send Output to Studio Plate"]
				}) : null]
			})
		]
	});
}
var GEMINI_VISION_MODEL = "gemini-4-hydrogen";
function NvidiaVisionDialog({ open, onOpenChange, defaultImageUrl }) {
	const setIdea = useOriel((state) => state.setIdea);
	const pushChat = useOriel((state) => state.pushChat);
	const pushLog = useOriel((state) => state.pushLog);
	const [provider, setProvider] = (0, import_react.useState)("gemini");
	const [imageUrl, setImageUrl] = (0, import_react.useState)(defaultImageUrl);
	const [prompt, setPrompt] = (0, import_react.useState)(NVIDIA_DEFAULT_PROMPT);
	const [streamEnabled, setStreamEnabled] = (0, import_react.useState)(true);
	const [streaming, setStreaming] = (0, import_react.useState)(false);
	const [output, setOutput] = (0, import_react.useState)("");
	const [reasoning, setReasoning] = (0, import_react.useState)("");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)(null);
	const [geminiConfigured, setGeminiConfigured] = (0, import_react.useState)(null);
	const [nvidiaConfigured, setNvidiaConfigured] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const abortRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setImageUrl((prev) => prev.trim() ? prev : defaultImageUrl);
		let cancelled = false;
		Promise.all([fetch(resolveNvidiaApiUrl("/api/gemini/vision")).then((res) => res.ok ? res.json() : null).catch(() => null), fetch(resolveNvidiaApiUrl("/api/nvidia-vision")).then((res) => res.ok ? res.json() : null).catch(() => null)]).then(([gemData, nvData]) => {
			if (cancelled) return;
			const hasGem = typeof gemData?.configured === "boolean" ? gemData.configured : null;
			const hasNv = typeof nvData?.configured === "boolean" ? nvData.configured : null;
			setGeminiConfigured(hasGem);
			setNvidiaConfigured(hasNv);
			if (hasGem === false && hasNv === true) setProvider("nvidia");
		});
		return () => {
			cancelled = true;
		};
	}, [open, defaultImageUrl]);
	(0, import_react.useEffect)(() => {
		if (!open && abortRef.current) {
			abortRef.current.abort();
			abortRef.current = null;
			setStreaming(false);
		}
	}, [open]);
	const activeModel = provider === "gemini" ? GEMINI_VISION_MODEL : NVIDIA_VISION_MODEL;
	const activeEndpoint = provider === "gemini" ? "/api/gemini/vision" : "/api/nvidia-vision";
	const serverConfigured = provider === "gemini" ? geminiConfigured : nvidiaConfigured;
	async function resolveSubmittableImageUrl(raw) {
		const trimmed = raw.trim();
		if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:image/")) return trimmed;
		return toCompactDataUrlForSegmentation(trimmed);
	}
	async function runVisionAnalysis() {
		if (streaming) return;
		const rawTarget = imageUrl.trim() || defaultImageUrl;
		if (!rawTarget) {
			toast.message("Select a canvas image or paste an HTTPS image URL first.");
			return;
		}
		setErrorMsg(null);
		setOutput("");
		setReasoning("");
		setStreaming(true);
		const controller = new AbortController();
		abortRef.current = controller;
		try {
			const preparedUrl = await resolveSubmittableImageUrl(rawTarget);
			const response = await fetch(resolveNvidiaApiUrl(activeEndpoint), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				signal: controller.signal,
				body: JSON.stringify({
					prompt: prompt.trim() || "What is in this image?",
					imageUrl: preparedUrl,
					stream: streamEnabled,
					...provider === "nvidia" ? {
						maxTokens: 16384,
						seed: 0,
						temperature: 1,
						topP: .95
					} : { seed: 0 }
				})
			});
			if (!response.ok) {
				const msg = (await response.json().catch(() => null))?.error || `Vision request failed (HTTP ${response.status}).`;
				setErrorMsg(msg);
				if (response.status === 503) {
					if (provider === "gemini") setGeminiConfigured(false);
					else setNvidiaConfigured(false);
				}
				return;
			}
			if (provider === "gemini") setGeminiConfigured(true);
			else setNvidiaConfigured(true);
			if (!streamEnabled || !response.body) {
				const json = await response.json();
				const content = json.choices?.[0]?.message?.content ?? "";
				const reason = json.choices?.[0]?.message?.reasoning_content ?? "";
				setOutput(content);
				setReasoning(reason);
				pushLog({
					title: `Vision Inspect · ${activeModel}`,
					model: "gpt",
					text: content.slice(0, 160) || prompt
				});
				return;
			}
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			let accumulated = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split(/\r?\n/);
				buffer = lines.pop() ?? "";
				for (const line of lines) {
					const parsed = extractNvidiaSseDelta(line);
					if (parsed.error) {
						setErrorMsg(parsed.error);
						break;
					}
					if (parsed.reasoningText) setReasoning((prev) => prev + parsed.reasoningText);
					if (parsed.deltaText) {
						accumulated += parsed.deltaText;
						setOutput((prev) => prev + parsed.deltaText);
					}
					if (parsed.done) break;
				}
			}
			if (buffer.trim()) {
				const parsed = extractNvidiaSseDelta(buffer);
				if (parsed.deltaText) {
					accumulated += parsed.deltaText;
					setOutput((prev) => prev + parsed.deltaText);
				}
			}
			if (accumulated.trim()) pushLog({
				title: `Vision Inspect · ${activeModel}`,
				model: "gpt",
				text: accumulated.trim().slice(0, 160)
			});
		} catch (error) {
			if (error?.name !== "AbortError") setErrorMsg(error instanceof Error ? error.message : "Vision analysis failed.");
		} finally {
			abortRef.current = null;
			setStreaming(false);
		}
	}
	function stopStream() {
		abortRef.current?.abort();
		abortRef.current = null;
		setStreaming(false);
	}
	function applyToStudioIdea() {
		const clean = output.replace(/\s+/g, " ").trim().slice(0, 600);
		if (!clean) return;
		setIdea(clean);
		pushChat("studio", `Applied Vision AI analysis (${activeModel}) to prompt.`);
		toast.success("Applied Vision AI analysis to Studio prompt");
		onOpenChange(false);
	}
	async function copyOutput() {
		if (!output.trim()) return;
		try {
			await navigator.clipboard.writeText(output.trim());
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
			toast.success("Copied vision response");
		} catch {
			toast.error("Could not copy text");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-black/45" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			"data-testid": "nvidia-vision-dialog",
			className: "fixed top-1/2 left-1/2 z-50 max-h-[90vh] w-[min(860px,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-[#d1c5b8]/60 bg-[#fbf9f5] p-5 text-[#1b1c1a] shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3 border-b border-[#d1c5b8]/45 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-8 place-items-center rounded-xl bg-[#c5a880]/25 text-[#725b38]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanEye, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-serif text-lg font-semibold text-[#1b1c1a]",
							children: "Scene Vision Inspector"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "font-mono text-[11px] text-[#4d463c]",
							children: [
								provider === "gemini" ? "Google Gemini" : "NVIDIA NIM",
								" · ",
								activeModel,
								" · Stream SSE"
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "group",
							"aria-label": "Vision AI provider",
							className: "inline-flex rounded-full border border-[#d1c5b8]/60 bg-white p-0.5 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-testid": "vision-provider-gemini",
								onClick: () => {
									setProvider("gemini");
									setErrorMsg(null);
								},
								className: cn("rounded-full px-2.5 py-1 transition", provider === "gemini" ? "bg-[#c5a880] font-semibold text-[#281800]" : "text-[#4d463c] hover:text-[#1b1c1a]"),
								children: "Gemini 4"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-testid": "vision-provider-nvidia",
								onClick: () => {
									setProvider("nvidia");
									setErrorMsg(null);
								},
								className: cn("rounded-full px-2.5 py-1 transition", provider === "nvidia" ? "bg-[#c5a880] font-semibold text-[#281800]" : "text-[#4d463c] hover:text-[#1b1c1a]"),
								children: "NVIDIA NIM"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
							"aria-label": "Close Scene Vision Inspector",
							className: "grid size-8 shrink-0 place-items-center rounded-full border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})]
				}),
				serverConfigured === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "nvidia-missing-key-banner",
					className: "mt-3 rounded-2xl border border-[#c5a880]/60 bg-[#f5efe4] px-3.5 py-2.5 text-xs text-[#513d1d]",
					children: [
						"Server secret",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "mx-0.5 rounded bg-[#e8dfd1]/80 px-1 py-0.5 font-mono font-semibold",
							children: provider === "gemini" ? "GEMINI_API_KEY" : "NVIDIA_API_KEY"
						}),
						" ",
						"is not configured yet. Set it in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Settings > Secrets" }),
						" to stream live",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "mx-0.5 rounded bg-[#e8dfd1]/80 px-1 py-0.5 font-mono",
							children: activeModel
						}),
						" ",
						"responses through",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "mx-0.5 rounded bg-[#e8dfd1]/80 px-1 py-0.5 font-mono",
							children: activeEndpoint
						}),
						"."
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 md:grid-cols-[270px_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden rounded-2xl border border-[#d1c5b8]/60 bg-[#161412]",
								children: imageUrl.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imageUrl,
									alt: "Target scene for vision inspection",
									className: "aspect-[4/3] w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid aspect-[4/3] place-items-center text-xs text-[#dfd5c6]",
									children: "No image selected"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-[11px] font-medium text-[#4d463c]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mb-1 inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3 text-[#725b38]" }), " Image URL or Canvas Data"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "nvidia-vision-image-input",
									value: imageUrl,
									onChange: (e) => setImageUrl(e.target.value),
									placeholder: "https://... or active studio plate",
									className: "h-9 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 font-mono text-[11px] text-[#1b1c1a] outline-none focus:border-[#725b38]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setImageUrl(defaultImageUrl),
									className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] text-[#1b1c1a] hover:border-[#725b38]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3 text-[#725b38]" }), " Use Canvas"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"data-testid": "nvidia-sample-url-btn",
									onClick: () => setImageUrl(NVIDIA_SAMPLE_IMAGE_URL),
									className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] text-[#1b1c1a] hover:border-[#725b38]",
									children: "Sample URL"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: NVIDIA_VISION_QUICK_PROMPTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPrompt(item.prompt),
									className: cn("rounded-full px-2.5 py-1 text-[11px] transition", prompt.trim() === item.prompt ? "bg-[#c5a880] font-semibold text-[#281800]" : "border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:border-[#725b38] hover:text-[#1b1c1a]"),
									children: item.label
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								"data-testid": "nvidia-vision-prompt-input",
								value: prompt,
								onChange: (e) => setPrompt(e.target.value),
								rows: 2,
								placeholder: `Ask ${activeModel} about materials, spatial massing, lighting, or furnishings...`,
								className: "w-full resize-none rounded-2xl border border-[#d1c5b8]/60 bg-white p-3 text-xs text-[#1b1c1a] outline-none focus:border-[#725b38]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-[#4d463c]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: streamEnabled,
										onChange: (e) => setStreamEnabled(e.target.checked),
										className: "accent-[#725b38]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: provider === "gemini" ? "Stream tokens (SSE · @google/genai)" : "Stream tokens (max 16,384 · temp 1 · top_p 0.95)" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1.5",
									children: streaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: stopStream,
										className: "inline-flex h-8 items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 text-xs font-medium text-rose-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3" }), " Stop"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "nvidia-vision-run-btn",
										disabled: serverConfigured === false,
										onClick: () => void runVisionAnalysis(),
										className: "inline-flex h-8 items-center gap-1.5 rounded-full bg-[#c5a880] px-4 text-xs font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b] disabled:cursor-not-allowed disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Analyze Image"]
									})
								})]
							}),
							errorMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								role: "alert",
								className: "rounded-2xl border border-rose-500/35 bg-rose-50 px-3 py-2 text-xs text-rose-800",
								children: errorMsg
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-h-[150px] flex-1 flex-col rounded-2xl border border-[#d1c5b8]/55 bg-white p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1.5 flex items-center justify-between gap-2 border-b border-[#d1c5b8]/35 pb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#725b38]",
											children: [streaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : null, streaming ? "Streaming Response…" : "Vision Output"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-1.5",
											children: output.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => void copyOutput(),
												className: "inline-flex h-6 items-center gap-1 rounded-full border border-[#d1c5b8]/60 px-2 text-[10px] text-[#4d463c] hover:text-[#1b1c1a]",
												children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-emerald-700" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), copied ? "Copied" : "Copy"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: applyToStudioIdea,
												className: "inline-flex h-6 items-center gap-1 rounded-full bg-[#1b1c1a] px-2.5 text-[10px] font-medium text-[#fbf9f5] hover:bg-[#323330]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-2.5" }), " Use as Studio Idea"]
											})] }) : null
										})]
									}),
									reasoning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
										className: "mb-2 rounded-xl bg-[#f5f3ef] px-2.5 py-1.5 text-[11px] text-[#4d463c]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
											className: "cursor-pointer font-medium text-[#725b38]",
											children: "Model reasoning trace"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 whitespace-pre-wrap font-mono text-[10px]",
											children: reasoning
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										"data-testid": "nvidia-vision-output",
										className: "max-h-56 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-[#1b1c1a]",
										children: output || /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[#7f766a]",
											children: [
												"Click Analyze Image to stream architectural inspection from ",
												activeModel,
												"."
											]
										})
									})
								]
							})
						]
					})]
				})
			]
		})] })
	});
}
var MATRIX_IMAGES = {
	clayExterior: "/viz/matrix/clay-exterior.jpg",
	interiorLuxe: "/viz/matrix/interior-luxe.jpg",
	parametricDusk: "/viz/matrix/parametric-dusk.jpg",
	urbanAerial: "/viz/matrix/urban-aerial.jpg",
	zenCourtyard: "/viz/matrix/zen-courtyard.jpg",
	pavilionDay: "/viz/p01-pavilion-day.jpg",
	pavilionDusk: "/viz/p01-pavilion-dusk.jpg",
	loftBefore: "/viz/p02-loft-before.jpg",
	loftAfter: "/viz/p02-loft-after.jpg",
	publicLibrary: "/viz/t01-public-library.jpg",
	sectionalArts: "/viz/t02-sectional-arts-center.jpg",
	livingRoom: "/viz/t03-compact-living-room.jpg",
	cafe: "/viz/t04-neighborhood-cafe.jpg",
	subtropical: "/viz/t05-subtropical-home.jpg",
	courtyard: "/viz/t06-urban-courtyard.jpg",
	campus: "/viz/t07-cultural-campus.jpg",
	materialJunction: "/viz/t08-material-junction.jpg",
	interiorClay: "/viz/t09-r1-living-room-clay-edit.jpg",
	homeDusk: "/viz/t10-home-dusk-edit.jpg"
};
Object.values(MATRIX_IMAGES);
function hasAny(haystack, needles) {
	return needles.some((n) => haystack.includes(n));
}
function resolveLightingVisual(text) {
	const lower = text.toLowerCase();
	if (hasAny(lower, [
		"blue hour",
		"night",
		"moonlit",
		"twilight",
		"aurora",
		"neon",
		"sky lounge"
	])) return {
		afterFilterClass: "brightness-[0.9] contrast-[1.12] saturate-[1.15]",
		afterTintClass: "bg-gradient-to-tr from-[#07192f]/45 via-transparent to-[#2e6aa8]/20",
		isNightOrDusk: true,
		isGolden: false,
		isOvercastOrMist: false
	};
	if (hasAny(lower, [
		"golden",
		"sunset",
		"dusk",
		"amber",
		"sunrise",
		"warm",
		"fireplace",
		"candle",
		"2700k"
	])) return {
		afterFilterClass: "sepia-[0.16] saturate-[1.2] contrast-[1.06]",
		afterTintClass: "bg-gradient-to-tr from-[#4b2d0a]/25 via-transparent to-[#f3b963]/20",
		isNightOrDusk: false,
		isGolden: true,
		isOvercastOrMist: false
	};
	if (hasAny(lower, [
		"overcast",
		"mist",
		"fog",
		"rain",
		"snow",
		"dew",
		"winter",
		"cloudy",
		"thunder",
		"storm"
	])) return {
		afterFilterClass: "saturate-[0.82] contrast-[0.98] brightness-[1.02]",
		afterTintClass: "bg-gradient-to-b from-[#cfdce6]/25 via-transparent to-[#475d70]/25",
		isNightOrDusk: false,
		isGolden: false,
		isOvercastOrMist: true
	};
	return {
		afterFilterClass: "contrast-[1.04] saturate-[1.05]",
		afterTintClass: "bg-gradient-to-tr from-transparent via-transparent to-white/10",
		isNightOrDusk: false,
		isGolden: false,
		isOvercastOrMist: false
	};
}
function resolveMoodGradeVisual(text) {
	const lower = text.toLowerCase();
	if (hasAny(lower, ["monochrome", "black and white"])) return {
		afterFilterClass: "grayscale contrast-[1.22]",
		afterTintClass: "bg-black/10"
	};
	if (hasAny(lower, [
		"sepia",
		"heritage",
		"vintage"
	])) return {
		afterFilterClass: "sepia-[0.42] contrast-[1.05] brightness-[0.97]",
		afterTintClass: "bg-[#6f4b23]/15"
	};
	if (hasAny(lower, ["emerald"])) return {
		afterFilterClass: "saturate-[1.18] contrast-[1.08] hue-rotate-[-12deg]",
		afterTintClass: "bg-[#0d4d3a]/20"
	};
	if (hasAny(lower, [
		"midnight",
		"ice blue",
		"cool dusk"
	])) return {
		afterFilterClass: "brightness-[0.9] contrast-[1.12] hue-rotate-[8deg]",
		afterTintClass: "bg-[#0a2342]/30"
	};
	if (hasAny(lower, ["blush", "pastel"])) return {
		afterFilterClass: "brightness-[1.08] saturate-[0.92] contrast-[0.94]",
		afterTintClass: "bg-[#e8b4bc]/18"
	};
	if (hasAny(lower, [
		"sunset orange",
		"golden cinematic",
		"warm filmic"
	])) return {
		afterFilterClass: "sepia-[0.22] saturate-[1.25] contrast-[1.08]",
		afterTintClass: "bg-[#d97c2b]/18"
	};
	if (hasAny(lower, [
		"moody dark",
		"charcoal",
		"high contrast"
	])) return {
		afterFilterClass: "brightness-[0.82] contrast-[1.26] saturate-[0.95]",
		afterTintClass: "bg-black/25"
	};
	if (hasAny(lower, ["bright airy"])) return {
		afterFilterClass: "brightness-[1.12] contrast-[0.96] saturate-[1.04]",
		afterTintClass: "bg-white/15"
	};
	if (hasAny(lower, ["muted earth", "soft matte"])) return {
		afterFilterClass: "sepia-[0.15] saturate-[0.82] contrast-[0.94]",
		afterTintClass: "bg-[#5a4a38]/12"
	};
	return {
		afterFilterClass: "contrast-[1.06] saturate-[1.12]",
		afterTintClass: "bg-transparent"
	};
}
function resolvePreset200Preview(item) {
	const text = `${item.category} ${item.name} ${item.fragment}`.toLowerCase();
	const light = resolveLightingVisual(text);
	if (item.category === "Exterior light") {
		const isAerial = text.includes("aerial");
		const isPool = text.includes("pool") || text.includes("water");
		const afterSrc = isAerial ? MATRIX_IMAGES.urbanAerial : isPool ? MATRIX_IMAGES.zenCourtyard : light.isNightOrDusk ? MATRIX_IMAGES.parametricDusk : light.isGolden ? MATRIX_IMAGES.homeDusk : MATRIX_IMAGES.pavilionDusk;
		return {
			beforeSrc: isAerial ? MATRIX_IMAGES.campus : MATRIX_IMAGES.pavilionDay,
			afterSrc,
			beforeLabel: "Before · Day",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.92] contrast-[0.96]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.fragment
		};
	}
	if (item.category === "Interior light") {
		const isCafeOrDining = hasAny(text, [
			"dinner",
			"cafe",
			"kitchen",
			"gallery",
			"showroom"
		]);
		const isLoftOrCity = hasAny(text, [
			"night city",
			"stairwell",
			"cinema"
		]);
		const afterSrc = isCafeOrDining ? MATRIX_IMAGES.cafe : isLoftOrCity ? MATRIX_IMAGES.loftAfter : hasAny(text, [
			"morning",
			"bounce",
			"cloudy",
			"spa"
		]) ? MATRIX_IMAGES.livingRoom : MATRIX_IMAGES.interiorLuxe;
		return {
			beforeSrc: isLoftOrCity ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.interiorClay,
			afterSrc,
			beforeLabel: "Before · Clay",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.85] contrast-[0.95]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.fragment
		};
	}
	if (item.category === "Materials") {
		const isInteriorMat = hasAny(text, [
			"travertine",
			"plaster",
			"oak",
			"walnut",
			"brass",
			"marble",
			"terrazzo",
			"linen",
			"boucle",
			"leather",
			"rug",
			"tile",
			"rattan",
			"fluted"
		]);
		const isMacroDetail = hasAny(text, [
			"travertine",
			"brass",
			"corten",
			"zellige",
			"oak",
			"basalt",
			"concrete"
		]);
		return {
			beforeSrc: isInteriorMat ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
			afterSrc: isInteriorMat ? isMacroDetail ? MATRIX_IMAGES.materialJunction : MATRIX_IMAGES.interiorLuxe : isMacroDetail ? MATRIX_IMAGES.materialJunction : MATRIX_IMAGES.pavilionDusk,
			beforeLabel: "Before · Massing",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.78] contrast-[0.95]",
			afterFilterClass: "contrast-[1.08] saturate-[1.08]",
			afterTintClass: "bg-gradient-to-tr from-[#2c2114]/15 via-transparent to-[#e8c98a]/12",
			sceneHint: item.fragment
		};
	}
	if (item.category === "Atmosphere and weather") {
		const isWindow = text.includes("glass") || text.includes("dust");
		const isAuroraOrNight = hasAny(text, [
			"aurora",
			"neon",
			"evening"
		]);
		const afterSrc = isWindow ? MATRIX_IMAGES.interiorLuxe : isAuroraOrNight ? MATRIX_IMAGES.parametricDusk : hasAny(text, [
			"tropical",
			"humid",
			"spring",
			"autumn"
		]) ? MATRIX_IMAGES.subtropical : MATRIX_IMAGES.pavilionDusk;
		return {
			beforeSrc: isWindow ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.pavilionDay,
			afterSrc,
			beforeLabel: "Before · Clear",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "brightness-[1.04] saturate-[0.9]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.fragment
		};
	}
	if (item.category === "Landscape") {
		const isAerial = hasAny(text, [
			"rooftop",
			"vineyard",
			"orchard",
			"street trees"
		]);
		const isZenWater = hasAny(text, [
			"water",
			"japanese",
			"birch",
			"courtyard",
			"gravel",
			"moss",
			"alpine"
		]);
		return {
			beforeSrc: MATRIX_IMAGES.clayExterior,
			afterSrc: isAerial ? MATRIX_IMAGES.urbanAerial : isZenWater ? MATRIX_IMAGES.zenCourtyard : hasAny(text, [
				"tropical",
				"forest",
				"fern",
				"coastal"
			]) ? MATRIX_IMAGES.subtropical : MATRIX_IMAGES.courtyard,
			beforeLabel: "Before · Site",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.75] brightness-[1.02]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.fragment
		};
	}
	if (item.category === "Amenities") {
		const isPoolWater = hasAny(text, [
			"pool",
			"spa",
			"garden pavilion",
			"yoga",
			"water",
			"tennis"
		]);
		const isNightSky = hasAny(text, [
			"rooftop",
			"sky lounge",
			"retail",
			"bbq"
		]);
		const isCafeLobby = hasAny(text, [
			"cafe",
			"clubhouse",
			"lobby",
			"concierge",
			"co-working",
			"gym"
		]);
		return {
			beforeSrc: isPoolWater || isNightSky ? MATRIX_IMAGES.clayExterior : MATRIX_IMAGES.loftBefore,
			afterSrc: isPoolWater ? MATRIX_IMAGES.zenCourtyard : isNightSky ? MATRIX_IMAGES.parametricDusk : isCafeLobby ? MATRIX_IMAGES.cafe : MATRIX_IMAGES.interiorLuxe,
			beforeLabel: "Before · Shell",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.8] contrast-[0.94]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.fragment
		};
	}
	if (item.category === "Camera and lens") {
		const isAerial = hasAny(text, [
			"high angle",
			"drone",
			"orbit"
		]);
		const isMacro = hasAny(text, ["macro", "bokeh"]);
		const isInteriorCam = hasAny(text, [
			"interior",
			"doorway",
			"mirror",
			"walk-in"
		]);
		const isWater = hasAny(text, [
			"water",
			"low angle",
			"sunburst"
		]);
		return {
			beforeSrc: isInteriorCam ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
			afterSrc: isAerial ? MATRIX_IMAGES.urbanAerial : isMacro ? MATRIX_IMAGES.materialJunction : isInteriorCam ? MATRIX_IMAGES.interiorLuxe : isWater ? MATRIX_IMAGES.parametricDusk : MATRIX_IMAGES.pavilionDusk,
			beforeLabel: "Before · Raw",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.85]",
			afterFilterClass: "contrast-[1.06] saturate-[1.08]",
			afterTintClass: "bg-transparent",
			sceneHint: item.fragment
		};
	}
	if (item.category === "Style and era") {
		const isFuturistOrUrban = hasAny(text, [
			"parametric",
			"urban chic",
			"contemporary luxury",
			"art deco"
		]);
		const isGardenOrTropical = hasAny(text, [
			"tropical",
			"biophilic",
			"wabi-sabi",
			"mediterranean",
			"desert"
		]);
		const isInteriorStyle = hasAny(text, [
			"japandi",
			"nordic",
			"mid-century",
			"scandinavian",
			"classic",
			"coastal",
			"indian",
			"gulf"
		]);
		return {
			beforeSrc: isInteriorStyle ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
			afterSrc: isFuturistOrUrban ? MATRIX_IMAGES.parametricDusk : isGardenOrTropical ? MATRIX_IMAGES.zenCourtyard : isInteriorStyle ? MATRIX_IMAGES.interiorLuxe : hasAny(text, ["industrial"]) ? MATRIX_IMAGES.loftAfter : MATRIX_IMAGES.publicLibrary,
			beforeLabel: "Before · Concept",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.82]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.fragment
		};
	}
	if (item.category === "Mood grade") {
		const grade = resolveMoodGradeVisual(text);
		return {
			beforeSrc: MATRIX_IMAGES.pavilionDay,
			afterSrc: MATRIX_IMAGES.pavilionDusk,
			beforeLabel: "Before · Neutral",
			afterLabel: `After · ${item.name}`,
			beforeFilterClass: "saturate-[0.9] contrast-[0.95]",
			afterFilterClass: grade.afterFilterClass,
			afterTintClass: grade.afterTintClass,
			sceneHint: item.fragment
		};
	}
	const isInteriorFix = hasAny(text, [
		"furniture",
		"clutter",
		"window reflections"
	]);
	return {
		beforeSrc: isInteriorFix ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
		afterSrc: isInteriorFix ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.pavilionDusk,
		beforeLabel: "Before · Unchecked",
		afterLabel: `After · ${item.name}`,
		beforeFilterClass: "blur-[0.45px] saturate-[0.7] contrast-[0.9]",
		afterFilterClass: "contrast-[1.08] saturate-[1.05]",
		afterTintClass: "bg-gradient-to-tr from-[#0d3b2e]/15 via-transparent to-[#53d2a8]/10",
		sceneHint: item.fragment
	};
}
function resolveArchviz100Preview(preset) {
	const combined = `${preset.category} ${preset.title} ${preset.lighting} ${preset.camera} ${preset.materials} ${preset.mood} ${preset.environment} ${preset.prompt}`.toLowerCase();
	const light = resolveLightingVisual(`${preset.lighting} ${preset.mood}`);
	if (preset.category === "AI Editing Workflows") {
		if (preset.id === "AV-091") return {
			beforeSrc: MATRIX_IMAGES.pavilionDay,
			afterSrc: MATRIX_IMAGES.parametricDusk,
			beforeLabel: "Before · Day",
			afterLabel: "After · Night Glow",
			beforeFilterClass: "brightness-[1.05]",
			afterFilterClass: "brightness-[0.9] contrast-[1.15]",
			afterTintClass: "bg-gradient-to-tr from-[#07192f]/40 via-transparent to-[#e8c98a]/15",
			sceneHint: preset.prompt
		};
		if (preset.id === "AV-096" || preset.id === "AV-098") return {
			beforeSrc: MATRIX_IMAGES.loftBefore,
			afterSrc: MATRIX_IMAGES.interiorLuxe,
			beforeLabel: "Before · Existing",
			afterLabel: "After · Restyled",
			beforeFilterClass: "saturate-[0.85]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
		if (preset.id === "AV-093" || preset.id === "AV-094") return {
			beforeSrc: MATRIX_IMAGES.clayExterior,
			afterSrc: MATRIX_IMAGES.zenCourtyard,
			beforeLabel: "Before · Site",
			afterLabel: "After · Water & Planting",
			beforeFilterClass: "saturate-[0.75]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
		return {
			beforeSrc: preset.id === "AV-100" ? MATRIX_IMAGES.clayExterior : MATRIX_IMAGES.pavilionDay,
			afterSrc: preset.id === "AV-092" ? MATRIX_IMAGES.materialJunction : MATRIX_IMAGES.homeDusk,
			beforeLabel: "Before · Source",
			afterLabel: `After · ${preset.title}`,
			beforeFilterClass: "saturate-[0.82]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
	}
	if (preset.category === "Modern Interiors") {
		const isCafeDining = hasAny(combined, [
			"dining",
			"kitchen",
			"cinema"
		]);
		return {
			beforeSrc: MATRIX_IMAGES.interiorClay,
			afterSrc: isCafeDining ? MATRIX_IMAGES.loftAfter : hasAny(combined, [
				"japandi",
				"living",
				"bedroom",
				"lounge"
			]) ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.livingRoom,
			beforeLabel: "Before · Clay",
			afterLabel: `After · ${preset.lighting.split(" ")[0]} GI`,
			beforeFilterClass: "saturate-[0.85]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
	}
	if (preset.category === "Urban & Planning" || preset.category === "Presentation & Views") {
		const isSectionOrPlan = hasAny(combined, [
			"section",
			"cutaway",
			"isometric",
			"axonometric",
			"floor plan"
		]);
		const isClayOrMassing = hasAny(combined, [
			"clay",
			"massing",
			"moodboard"
		]);
		return {
			beforeSrc: isSectionOrPlan ? MATRIX_IMAGES.sectionalArts : MATRIX_IMAGES.clayExterior,
			afterSrc: isClayOrMassing ? MATRIX_IMAGES.materialJunction : isSectionOrPlan ? MATRIX_IMAGES.sectionalArts : MATRIX_IMAGES.urbanAerial,
			beforeLabel: isSectionOrPlan ? "Before · CAD" : "Before · Massing",
			afterLabel: `After · ${preset.title}`,
			beforeFilterClass: "grayscale-[0.65] contrast-[0.92]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
	}
	if (preset.category === "Landscape & Outdoor") {
		const isTropicalOrPocket = hasAny(combined, [
			"tropical",
			"pocket",
			"pergola",
			"rooftop"
		]);
		return {
			beforeSrc: MATRIX_IMAGES.clayExterior,
			afterSrc: isTropicalOrPocket ? MATRIX_IMAGES.courtyard : MATRIX_IMAGES.zenCourtyard,
			beforeLabel: "Before · Grading",
			afterLabel: `After · ${preset.title}`,
			beforeFilterClass: "saturate-[0.75]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
	}
	if (preset.category === "Futuristic Concepts") {
		const isEcoVertical = hasAny(combined, [
			"vertical forest",
			"earth",
			"net zero",
			"desert"
		]);
		return {
			beforeSrc: MATRIX_IMAGES.clayExterior,
			afterSrc: isEcoVertical ? MATRIX_IMAGES.zenCourtyard : MATRIX_IMAGES.parametricDusk,
			beforeLabel: "Before · Wire/Clay",
			afterLabel: `After · Parametric`,
			beforeFilterClass: "saturate-[0.7]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
	}
	if (preset.category === "Commercial Spaces") {
		const isLobbyOrRestaurant = hasAny(combined, [
			"hotel",
			"restaurant",
			"retail",
			"spa"
		]);
		return {
			beforeSrc: isLobbyOrRestaurant ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
			afterSrc: isLobbyOrRestaurant ? MATRIX_IMAGES.cafe : hasAny(combined, [
				"museum",
				"terminal",
				"headquarters"
			]) ? MATRIX_IMAGES.parametricDusk : MATRIX_IMAGES.publicLibrary,
			beforeLabel: "Before · Shell",
			afterLabel: `After · Commercial`,
			beforeFilterClass: "saturate-[0.8]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: preset.prompt
		};
	}
	if (preset.category === "Climate & Lighting") return {
		beforeSrc: MATRIX_IMAGES.pavilionDay,
		afterSrc: light.isNightOrDusk ? MATRIX_IMAGES.parametricDusk : hasAny(combined, ["courtyard"]) ? MATRIX_IMAGES.zenCourtyard : MATRIX_IMAGES.homeDusk,
		beforeLabel: "Before · Base Day",
		afterLabel: `After · ${preset.title}`,
		beforeFilterClass: "saturate-[0.88] brightness-[1.03]",
		afterFilterClass: light.afterFilterClass,
		afterTintClass: light.afterTintClass,
		sceneHint: preset.prompt
	};
	const isCourtyardOrGarden = hasAny(combined, [
		"courtyard",
		"olive",
		"wabi sabi",
		"farmhouse",
		"tropical",
		"pool"
	]);
	const isNightDusk = light.isNightOrDusk || hasAny(combined, [
		"dusk",
		"deco",
		"blue hour"
	]);
	return {
		beforeSrc: MATRIX_IMAGES.clayExterior,
		afterSrc: isNightDusk ? MATRIX_IMAGES.parametricDusk : isCourtyardOrGarden ? MATRIX_IMAGES.zenCourtyard : hasAny(combined, ["loft", "interior"]) ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.pavilionDusk,
		beforeLabel: "Before · Clay/Wire",
		afterLabel: `After · ${preset.lighting.split(" ").slice(0, 2).join(" ")}`,
		beforeFilterClass: "saturate-[0.8]",
		afterFilterClass: light.afterFilterClass,
		afterTintClass: light.afterTintClass,
		sceneHint: preset.prompt
	};
}
function resolveLook16Preview(look) {
	const light = resolveLightingVisual(`${look.name} ${look.light} ${look.mood} ${look.bestFor}`);
	return {
		beforeSrc: look.beforeThumb,
		afterSrc: look.thumbnail,
		beforeLabel: "Before",
		afterLabel: `${look.code} · ${look.name}`,
		beforeFilterClass: "saturate-[0.88]",
		afterFilterClass: light.afterFilterClass,
		afterTintClass: light.afterTintClass,
		sceneHint: `${look.bestFor} · ${look.light}`
	};
}
var resolveLookPreview = resolveLook16Preview;
function resolveZukeVizPreview(item) {
	const combined = `${item.title} ${item.category} ${item.prompt}`.toLowerCase();
	const light = resolveLightingVisual(combined);
	if (hasAny(combined, [
		"blueprint",
		"neon blueprint",
		"deep-blue",
		"deep blue"
	])) return {
		beforeSrc: MATRIX_IMAGES.clayExterior,
		afterSrc: MATRIX_IMAGES.sectionalArts,
		beforeLabel: "Before · CAD/3D",
		afterLabel: `After · ${item.id} Blueprint`,
		beforeFilterClass: "saturate-[0.75]",
		afterFilterClass: "contrast-[1.18] saturate-[1.35] hue-rotate-[175deg] brightness-[0.85]",
		afterTintClass: "bg-[#0a3a7a]/35 mix-blend-multiply",
		sceneHint: item.title
	};
	if (hasAny(combined, ["kraft", "charcoal floor plan"])) {
		const isCharcoal = combined.includes("charcoal");
		return {
			beforeSrc: MATRIX_IMAGES.sectionalArts,
			afterSrc: MATRIX_IMAGES.sectionalArts,
			beforeLabel: "Before · Plan",
			afterLabel: isCharcoal ? "After · Charcoal Plan" : "After · Kraft Plan",
			beforeFilterClass: "grayscale-[0.85] brightness-[1.08]",
			afterFilterClass: isCharcoal ? "contrast-[1.22] brightness-[0.62] saturate-[0.65]" : "sepia-[0.42] contrast-[1.06] saturate-[0.95]",
			afterTintClass: isCharcoal ? "bg-amber-400/12 mix-blend-screen" : "bg-[#7c6848]/18 mix-blend-multiply",
			sceneHint: item.title
		};
	}
	switch (item.category) {
		case "Interior · Room by Room": {
			const isKitchen = hasAny(combined, [
				"kitchen",
				"island",
				"cabinet",
				"dining"
			]);
			const isRestaurant = hasAny(combined, [
				"restaurant",
				"pink",
				"bar",
				"lounge"
			]);
			return {
				beforeSrc: hasAny(combined, [
					"empty",
					"vacant",
					"industrial",
					"penthouse"
				]) ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.interiorClay,
				afterSrc: isRestaurant ? MATRIX_IMAGES.cafe : isKitchen ? MATRIX_IMAGES.loftAfter : MATRIX_IMAGES.interiorLuxe,
				beforeLabel: hasAny(combined, [
					"empty",
					"industrial",
					"penthouse"
				]) ? "Before · Empty Shell" : "Before · Clay/Draft",
				afterLabel: `After · ${item.id}`,
				beforeFilterClass: "saturate-[0.82]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Layouts & Space Planning":
		case "Plans, Sections & Axonometric Views": {
			const isAxon = hasAny(combined, [
				"axonometric",
				"isometric",
				"dollhouse",
				"exploded",
				"cutaway"
			]);
			return {
				beforeSrc: isAxon ? MATRIX_IMAGES.clayExterior : MATRIX_IMAGES.sectionalArts,
				afterSrc: isAxon ? MATRIX_IMAGES.sectionalArts : MATRIX_IMAGES.livingRoom,
				beforeLabel: isAxon ? "Before · 2D Plan" : "Before · CAD Outline",
				afterLabel: isAxon ? "After · 3D Cutaway" : "After · Furnished Plan",
				beforeFilterClass: "grayscale-[0.75] contrast-[0.92]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Landscape & Site": return {
			beforeSrc: MATRIX_IMAGES.clayExterior,
			afterSrc: hasAny(combined, ["courtyard", "garden"]) ? MATRIX_IMAGES.zenCourtyard : MATRIX_IMAGES.courtyard,
			beforeLabel: "Before · Site",
			afterLabel: `After · Landscape`,
			beforeFilterClass: "saturate-[0.75]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.title
		};
		case "Urban Design & Masterplans": {
			const isStreet = hasAny(combined, [
				"street",
				"pedestrian",
				"empty lot"
			]);
			return {
				beforeSrc: isStreet ? MATRIX_IMAGES.publicLibrary : MATRIX_IMAGES.clayExterior,
				afterSrc: isStreet ? MATRIX_IMAGES.courtyard : MATRIX_IMAGES.urbanAerial,
				beforeLabel: isStreet ? "Before · Existing Street" : "Before · Massing",
				afterLabel: isStreet ? "After · Urban Infill" : "After · Masterplan",
				beforeFilterClass: "grayscale-[0.55] saturate-[0.75]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Rendering & Photography": {
			const isModel = hasAny(combined, ["physical model", "maquette"]);
			const isInterior = hasAny(combined, [
				"living",
				"kitchen",
				"office",
				"lounge"
			]);
			return {
				beforeSrc: isInterior ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
				afterSrc: isModel ? MATRIX_IMAGES.publicLibrary : isInterior ? MATRIX_IMAGES.interiorLuxe : hasAny(combined, [
					"tropical",
					"pool",
					"villa"
				]) ? MATRIX_IMAGES.subtropical : MATRIX_IMAGES.pavilionDusk,
				beforeLabel: isModel ? "Before · Sketch" : "Before · Clay/Line",
				afterLabel: isModel ? "After · Scale Model" : "After · Photoreal",
				beforeFilterClass: "grayscale-[0.65] contrast-[0.95]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Materials & Finishes": {
			const isKitchen = hasAny(combined, [
				"kitchen",
				"cabinet",
				"floor"
			]);
			return {
				beforeSrc: isKitchen ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.materialJunction,
				afterSrc: isKitchen ? MATRIX_IMAGES.loftAfter : MATRIX_IMAGES.materialJunction,
				beforeLabel: "Before · Original",
				afterLabel: "After · Swapped Finish",
				beforeFilterClass: "saturate-[0.72] brightness-[0.96]",
				afterFilterClass: "contrast-[1.08] saturate-[1.16]",
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Style & Restyling": return {
			beforeSrc: MATRIX_IMAGES.loftBefore,
			afterSrc: hasAny(combined, [
				"burgundy",
				"lounge",
				"cafe"
			]) ? MATRIX_IMAGES.cafe : MATRIX_IMAGES.interiorLuxe,
			beforeLabel: "Before · Existing",
			afterLabel: `After · Restyled`,
			beforeFilterClass: "saturate-[0.8]",
			afterFilterClass: light.afterFilterClass,
			afterTintClass: light.afterTintClass,
			sceneHint: item.title
		};
		case "Lighting & Post-production": {
			const isInterior = hasAny(combined, ["kitchen", "interior"]);
			return {
				beforeSrc: isInterior ? MATRIX_IMAGES.livingRoom : MATRIX_IMAGES.subtropical,
				afterSrc: isInterior ? MATRIX_IMAGES.loftAfter : MATRIX_IMAGES.homeDusk,
				beforeLabel: "Before · Daylight",
				afterLabel: light.isNightOrDusk ? "After · Night/Blue Hr" : "After · Relit",
				beforeFilterClass: "brightness-[1.04] saturate-[0.9]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Multi-angle & Camera": {
			const isInterior = hasAny(combined, [
				"interior",
				"360",
				"living",
				"room"
			]);
			return {
				beforeSrc: isInterior ? MATRIX_IMAGES.livingRoom : MATRIX_IMAGES.pavilionDay,
				afterSrc: isInterior ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.campus,
				beforeLabel: "Before · Base View",
				afterLabel: hasAny(combined, ["360"]) ? "After · 360° Pano" : "After · Multi-Angle",
				beforeFilterClass: "saturate-[0.88]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Design Support & Presentation": {
			const isInterior = hasAny(combined, [
				"interior",
				"ff&e",
				"living",
				"furniture",
				"moodboard"
			]);
			return {
				beforeSrc: isInterior ? MATRIX_IMAGES.interiorClay : MATRIX_IMAGES.clayExterior,
				afterSrc: isInterior ? MATRIX_IMAGES.materialJunction : MATRIX_IMAGES.sectionalArts,
				beforeLabel: "Before · Inputs",
				afterLabel: "After · Presentation Board",
				beforeFilterClass: "saturate-[0.78]",
				afterFilterClass: "contrast-[1.06] saturate-[1.08]",
				afterTintClass: "bg-transparent",
				sceneHint: item.title
			};
		}
		case "Motion & Video": {
			const isInterior = hasAny(combined, [
				"living",
				"interior",
				"walkthrough"
			]);
			return {
				beforeSrc: isInterior ? MATRIX_IMAGES.loftBefore : MATRIX_IMAGES.clayExterior,
				afterSrc: isInterior ? MATRIX_IMAGES.interiorLuxe : MATRIX_IMAGES.pavilionDusk,
				beforeLabel: "00:00 · Start Frame",
				afterLabel: "End Frame · Motion",
				beforeFilterClass: "saturate-[0.8] brightness-[0.96]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		case "Real Estate & Marketing": {
			const isAmenity = hasAny(combined, [
				"amenity",
				"pool",
				"club"
			]);
			return {
				beforeSrc: isAmenity ? MATRIX_IMAGES.courtyard : MATRIX_IMAGES.loftBefore,
				afterSrc: isAmenity ? MATRIX_IMAGES.zenCourtyard : MATRIX_IMAGES.loftAfter,
				beforeLabel: isAmenity ? "Before · Base" : "Before · Vacant",
				afterLabel: isAmenity ? "After · Brochure Hero" : "After · Staged",
				beforeFilterClass: "saturate-[0.82]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
		default: {
			const isSkyscraper = hasAny(combined, [
				"skyscraper",
				"dubai",
				"tower",
				"futuristic"
			]);
			return {
				beforeSrc: MATRIX_IMAGES.clayExterior,
				afterSrc: isSkyscraper ? MATRIX_IMAGES.parametricDusk : light.isNightOrDusk ? MATRIX_IMAGES.pavilionDusk : MATRIX_IMAGES.subtropical,
				beforeLabel: "Before · Site/Massing",
				afterLabel: `After · ${item.id}`,
				beforeFilterClass: "saturate-[0.82]",
				afterFilterClass: light.afterFilterClass,
				afterTintClass: light.afterTintClass,
				sceneHint: item.title
			};
		}
	}
}
function PresetBeforeAfterStrip({ preview, alt, uploadSrc, heightClass = "h-20", badge, testId }) {
	const [split, setSplit] = (0, import_react.useState)(46);
	const usingUpload = Boolean(uploadSrc);
	const effectiveBeforeSrc = usingUpload ? uploadSrc : preview.beforeSrc;
	const effectiveAfterSrc = usingUpload ? uploadSrc : preview.afterSrc;
	const effectiveBeforeLabel = usingUpload ? "Your Upload" : preview.beforeLabel;
	const effectiveAfterLabel = usingUpload ? `+ ${alt}` : preview.afterLabel;
	const effectiveAfterFilter = usingUpload ? preview.afterFilterClass || "contrast-[1.06] saturate-[1.12]" : preview.afterFilterClass;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": testId,
		onMouseMove: (e) => {
			const rect = e.currentTarget.getBoundingClientRect();
			if (rect.width <= 0) return;
			const pct = Math.max(8, Math.min(92, (e.clientX - rect.left) / rect.width * 100));
			setSplit(pct);
		},
		onMouseLeave: () => setSplit(46),
		className: cn("group/ba relative w-full shrink-0 overflow-hidden rounded-lg border border-[#d1c5b8]/45 bg-[#121c29] select-none dark:border-[#a9bdc9]/20", heightClass),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: effectiveAfterSrc,
				alt: `${alt} after`,
				loading: "lazy",
				decoding: "async",
				referrerPolicy: "no-referrer",
				className: cn("h-full w-full object-cover", effectiveAfterFilter)
			}),
			preview.afterTintClass !== "bg-transparent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("pointer-events-none absolute inset-0", preview.afterTintClass) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				style: { clipPath: `inset(0 ${100 - split}% 0 0)` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: effectiveBeforeSrc,
					alt: `${alt} before`,
					loading: "lazy",
					decoding: "async",
					referrerPolicy: "no-referrer",
					className: cn("h-full w-full object-cover", usingUpload ? "" : preview.beforeFilterClass)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-y-0 w-0.5 bg-[#e8c98a] shadow-[0_0_6px_rgba(232,201,138,0.9)]",
				style: { left: `${split}%` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute top-1/2 -left-1.5 grid size-3.5 -translate-y-1/2 place-items-center rounded-full border border-[#e8c98a] bg-[#0d1622] text-[7px] font-bold text-[#e8c98a]",
					children: "↔"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute top-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-white/95 backdrop-blur-xs",
				children: effectiveBeforeLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute top-1 right-1 max-w-[54%] truncate rounded bg-black/75 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-[#e8c98a] backdrop-blur-xs",
				children: effectiveAfterLabel
			}),
			badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold text-[#cfe3f0]",
				children: badge
			}) : null
		]
	});
}
function PresetMatrixPanel() {
	const { generate } = useGenerate();
	const upload = useOriel((s) => s.upload);
	const busy = useOriel((s) => s.busy);
	const setIdea = useOriel((s) => s.setIdea);
	const setVertical = useOriel((s) => s.setVertical);
	const setFrame = useOriel((s) => s.setFrame);
	const design = useOriel((s) => s.design);
	const frame = useOriel((s) => s.frame);
	const engine = useOriel((s) => s.engine);
	const activePresetIds = useOriel((s) => s.activePresetIds);
	const negativePresetIds = useOriel((s) => s.negativePresetIds);
	const presetStrengths = useOriel((s) => s.presetStrengths);
	const questionPicks = useOriel((s) => s.questionPicks);
	const intentLookId = useOriel((s) => s.intentLookId);
	const designContract = useOriel((s) => s.designContract);
	const togglePreset200 = useOriel((s) => s.togglePreset200);
	const setPresetStrength = useOriel((s) => s.setPresetStrength);
	const clearPresets200 = useOriel((s) => s.clearPresets200);
	const setQuestionPick = useOriel((s) => s.setQuestionPick);
	const applyIntentLook = useOriel((s) => s.applyIntentLook);
	const [tab, setTab] = (0, import_react.useState)("presets200");
	const [query, setQuery] = (0, import_react.useState)("");
	const [category200, setCategory200] = (0, import_react.useState)("All");
	const [category100, setCategory100] = (0, import_react.useState)("All");
	const [categoryZuke, setCategoryZuke] = (0, import_react.useState)("All");
	const [lookModeFilter, setLookModeFilter] = (0, import_react.useState)("All");
	const [limit200, setLimit200] = (0, import_react.useState)(40);
	const [limit100, setLimit100] = (0, import_react.useState)(35);
	const [limitZuke, setLimitZuke] = (0, import_react.useState)(30);
	const [expandedPresetId, setExpandedPresetId] = (0, import_react.useState)(null);
	const [expandedZukeId, setExpandedZukeId] = (0, import_react.useState)(null);
	const [zukeSlots, setZukeSlots] = (0, import_react.useState)({});
	const [zukeShowOriginal, setZukeShowOriginal] = (0, import_react.useState)({});
	const [hoverBeforeAfter, setHoverBeforeAfter] = (0, import_react.useState)(50);
	const uploadDims = (0, import_react.useMemo)(() => parseImageDimensionsFromDataUrl(upload), [upload]);
	const filtered200 = (0, import_react.useMemo)(() => filterPresets200(query, category200, "all"), [query, category200]);
	const filtered100 = (0, import_react.useMemo)(() => filterArchviz100(query, category100), [query, category100]);
	const filteredZuke = (0, import_react.useMemo)(() => filterZukeViz119(query, categoryZuke), [query, categoryZuke]);
	const filteredLooks = (0, import_react.useMemo)(() => filterIntentLooks40(query, lookModeFilter), [query, lookModeFilter]);
	const transformCtx = (0, import_react.useMemo)(() => ({
		hasUpload: Boolean(upload),
		design,
		preserveClause: designContract.lockedPreserve ? designContract.preserveClause : void 0
	}), [
		upload,
		design,
		designContract
	]);
	const activeLook = INTENT_LOOKS_40.find((l) => l.id === intentLookId) ?? INTENT_LOOKS_40[0];
	const activePills = (0, import_react.useMemo)(() => PRESETS_200.filter((p) => activePresetIds.includes(p.id) || negativePresetIds.includes(p.id)), [activePresetIds, negativePresetIds]);
	function syncPillsIntoUploadedPrompt() {
		const st = useOriel.getState();
		if (!st.upload) return;
		const compiled = compileSentencePrompt({
			baseIdea: st.idea,
			activePresetIds: st.activePresetIds,
			negativePresetIds: st.negativePresetIds,
			presetStrengths: st.presetStrengths,
			questionPicks: st.questionPicks,
			design: st.design,
			engine: st.engine,
			preserveClause: st.designContract.lockedPreserve ? st.designContract.preserveClause : void 0
		});
		const anchored = rewritePromptForUploadedImage(compiled.sentence, {
			hasUpload: true,
			design: st.design,
			preserveClause: st.designContract.lockedPreserve ? st.designContract.preserveClause : void 0
		});
		st.setIdea(anchored);
	}
	function handleTogglePreset200(id, polarity) {
		togglePreset200(id, polarity);
		if (upload) syncPillsIntoUploadedPrompt();
	}
	function applyZukePrompt(item, runImmediately = false) {
		const slotValues = zukeSlots[item.id] ?? {};
		const finalText = buildZuke119AppliedPrompt(item, slotValues, transformCtx);
		setIdea(finalText);
		if (!upload) {
			setVertical(inferZukeVertical(item));
			if (item.aspectRatio && RATIOS.includes(item.aspectRatio)) setFrame({
				...frame,
				ratio: item.aspectRatio
			});
		}
		toast.success(upload ? `Injected ${item.id} onto uploaded image (pixel & camera locked)` : `Applied ${item.id} · ${item.title} to main prompt`);
		if (runImmediately && upload && !busy) generate("plate");
	}
	const activeCount = tab === "presets200" ? filtered200.length : tab === "archviz100" ? filtered100.length : tab === "zuke119" ? filteredZuke.length : filteredLooks.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"data-testid": "preset-matrix-panel",
		className: "arctic-glass flex h-full min-h-0 flex-col gap-1.5 overflow-hidden rounded-2xl p-2 text-[#1b1c1a] dark:text-[#d8e3f5]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center justify-between gap-1.5 border-b border-[#d1c5b8]/35 pb-1 dark:border-[#a9bdc9]/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 shrink-0 text-[#725b38] dark:text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "truncate font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1b1c1a] dark:text-[#e8eff3]",
							children: "Prompt Preset Matrix"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]",
							children: "200 Pills · 100 ArchViz · 119 ZUKE · 40 Looks"
						})]
					})]
				}), upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					"data-testid": "matrix-upload-lock-badge",
					title: "All presets inject directly onto your uploaded photo using existing image reference — camera & pixels locked",
					className: "inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/12 px-1.5 py-0.5 text-[8.5px] font-semibold text-emerald-700 dark:text-emerald-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-2.5" }), "On Upload"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 rounded-full border border-[#c5a880]/45 bg-[#c5a880]/15 px-1.5 py-0.2 text-[9px] font-semibold text-[#725b38] dark:border-[#e8c98a]/40 dark:bg-[#584411]/70 dark:text-[#e8c98a]",
					children: "v2.5"
				})]
			}),
			upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "matrix-active-upload-banner",
				className: "flex shrink-0 items-center justify-between gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-2 py-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: upload,
						alt: "Active uploaded reference",
						className: "size-7 shrink-0 rounded-md border border-emerald-400/40 object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-[9.5px] font-semibold text-emerald-800 dark:text-emerald-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "size-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Uploaded Ref Locked"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-mono text-[8.5px] text-emerald-700/90 dark:text-emerald-300/85",
							children: uploadDims ? `${uploadDims.width}×${uploadDims.height} · ${uploadDims.geminiRatio} · ${engine.geometryLock}%` : `${frame.ratio} · ${engine.geometryLock}% pixel lock`
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					"data-testid": "matrix-apply-to-upload-btn",
					onClick: () => {
						syncPillsIntoUploadedPrompt();
						generate("plate");
					},
					className: "inline-flex h-6.5 shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-2 text-[9.5px] font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 dark:bg-emerald-500 dark:text-[#04130c]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-2.5 fill-current" }), "Apply"]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid shrink-0 grid-cols-5 gap-0.5 rounded-full bg-[#efeeea]/80 p-0.5 dark:bg-[#121c29]/80",
				children: [
					{
						id: "presets200",
						label: "200 Pills"
					},
					{
						id: "archviz100",
						label: "100 Cards"
					},
					{
						id: "zuke119",
						label: "119 ZUKE"
					},
					{
						id: "looks40",
						label: "40 Looks"
					},
					{
						id: "questions8",
						label: "8 Qs"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": `matrix-tab-${item.id}`,
					onClick: () => setTab(item.id),
					className: cn("h-6.5 truncate rounded-full px-1 text-[9.5px] font-semibold transition", tab === item.id ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
					children: item.label
				}, item.id))
			}),
			tab !== "questions8" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-2.5 size-3.5 text-[#7f766a] dark:text-[#a9bdc9]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							"data-testid": "matrix-search-input",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: tab === "presets200" ? "Filter 200 presets, lighting, materials…" : tab === "archviz100" ? "Filter 100 ArchViz scenes…" : tab === "zuke119" ? "Search ZV-001..119 prompts, categories, slots…" : "Search 40 looks (L01–L40), modes, rules…",
							className: "h-8 w-full rounded-full border border-[#d1c5b8]/55 bg-white/80 pr-9 pl-8 text-[11px] text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8eff3] dark:placeholder:text-[#5f7f98] dark:focus:border-[#e8c98a]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-2 rounded bg-[#eae8e4] px-1.5 py-0.5 font-mono text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#a9bdc9]",
							children: activeCount
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "no-scrollbar flex items-center gap-1 overflow-x-auto py-0.5",
					children: tab === "looks40" ? [
						"All",
						"Strict",
						"Balanced",
						"Creative"
					].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setLookModeFilter(mode),
						className: cn("shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition", lookModeFilter === mode ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea]/80 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38]/85 dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
						children: mode
					}, mode)) : (tab === "presets200" ? PRESET_200_CATEGORIES : tab === "archviz100" ? ARCHVIZ_100_CATEGORIES : ZUKE_VIZ_CATEGORIES_14).map((cat) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (tab === "presets200") setCategory200(cat);
								else if (tab === "archviz100") setCategory100(cat);
								else {
									setCategoryZuke(cat);
									setLimitZuke(30);
								}
							},
							className: cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium transition", (tab === "presets200" ? category200 : tab === "archviz100" ? category100 : categoryZuke) === cat ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea]/80 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38]/85 dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
							children: cat
						}, cat);
					})
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-[10px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
						children: "Refinement Pills (+ / −)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => clearPresets200(),
						className: "font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]",
						children: [
							"Clear (",
							activePills.length,
							")"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex max-h-16 flex-wrap gap-1 overflow-y-auto",
					children: activePills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-[#7f766a] dark:text-[#5f7f98]",
						children: "Pick (+) or (−) presets below to shape lighting, shaders, and exclusions."
					}) : activePills.map((pill) => {
						const isNeg = negativePresetIds.includes(pill.id) || pill.is_negative;
						const str = presetStrengths[pill.id] ?? pill.strength ?? 1;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium", isNeg ? "border-rose-400/45 bg-rose-500/15 text-rose-700 dark:text-rose-200" : "border-[#c5a880]/55 bg-[#c5a880]/20 text-[#513d1d] dark:border-[#e8c98a]/40 dark:bg-[#202b38] dark:text-[#e8c98a]"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									title: "Toggle Positive (+)",
									onClick: () => handleTogglePreset200(pill.id, "positive"),
									className: "font-bold hover:opacity-75",
									children: "+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setExpandedPresetId(expandedPresetId === pill.id ? null : pill.id),
									className: "max-w-[110px] truncate",
									title: "Adjust preset strength",
									children: [
										pill.name,
										" ",
										Math.abs(str - 1) > .05 ? `${str.toFixed(1)}×` : ""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									title: "Toggle Negative (−)",
									onClick: () => handleTogglePreset200(pill.id, "negative"),
									className: "font-bold hover:text-rose-500",
									children: "−"
								})
							]
						}, pill.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5",
				children: tab === "presets200" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [filtered200.slice(0, limit200).map((item) => {
					const isPos = activePresetIds.includes(item.id);
					const isNeg = negativePresetIds.includes(item.id);
					const str = presetStrengths[item.id] ?? item.strength ?? 1;
					const preview = resolvePreset200Preview(item);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `preset200-card-${item.id}`,
						className: cn("flex flex-col gap-1.5 rounded-xl border p-2 transition", isPos ? "border-[#c5a880]/70 bg-[#c5a880]/12 dark:border-[#e8c98a]/45 dark:bg-[#202b38]/85" : isNeg ? "border-rose-400/50 bg-rose-500/10 dark:bg-[#202b38]/75" : "border-[#d1c5b8]/40 bg-white/60 hover:bg-white/90 dark:border-[#43474b]/50 dark:bg-[#16202d]/70 dark:hover:bg-[#202b38]/80"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetBeforeAfterStrip, {
								preview,
								alt: item.name,
								uploadSrc: upload,
								heightClass: "h-[74px]",
								testId: `preset200-ba-${item.id}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]",
										children: [
											item.id,
											" · ",
											str.toFixed(1),
											"×"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
										children: item.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleTogglePreset200(item.id, "positive"),
										"aria-label": `Include ${item.name}`,
										className: cn("grid size-5 place-items-center rounded-full border text-[10px]", isPos ? "border-[#725b38] bg-[#c5a880] text-[#281800] dark:border-[#cfe3f0] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#43474b] dark:text-[#a9bdc9]"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleTogglePreset200(item.id, "negative"),
										"aria-label": `Exclude ${item.name}`,
										className: cn("grid size-5 place-items-center rounded-full border text-[10px]", isNeg ? "border-rose-500 bg-rose-500 text-white" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#43474b] dark:text-[#a9bdc9]"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2 text-[10px] leading-relaxed text-[#4d463c] dark:text-[#a9bdc9]",
								children: item.fragment
							}),
							expandedPresetId === item.id || isPos ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] text-[#7f766a] dark:text-[#a9bdc9]",
										children: "Weight"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: .5,
										max: 1.5,
										step: .05,
										value: str,
										onChange: (e) => setPresetStrength(item.id, Number(e.target.value)),
										className: "h-1 flex-1 accent-[#725b38] dark:accent-[#cfe3f0]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[9px] text-[#1b1c1a] dark:text-[#e8c98a]",
										children: [str.toFixed(2), "×"]
									})
								]
							}) : null
						]
					}, item.id);
				}), filtered200.length > limit200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "presets200-load-more",
					onClick: () => setLimit200((n) => Math.min(filtered200.length, n + 40)),
					className: "w-full rounded-xl border border-[#d1c5b8]/55 bg-white/75 py-1.5 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8c98a]",
					children: [
						"Show more (",
						filtered200.length - limit200,
						" remaining)"
					]
				}) : null] }) : tab === "archviz100" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [filtered100.slice(0, limit100).map((preset) => {
					const preview = resolveArchviz100Preview(preset);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `archviz100-card-${preset.id}`,
						className: "flex flex-col gap-1.5 rounded-xl border border-[#d1c5b8]/45 bg-white/65 p-2 transition hover:border-[#725b38] dark:border-[#43474b]/50 dark:bg-[#16202d]/75 dark:hover:border-[#e8c98a]/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetBeforeAfterStrip, {
								preview,
								alt: preset.title,
								uploadSrc: upload,
								heightClass: "h-24",
								testId: `archviz100-ba-${preset.id}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-1.5 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]",
										children: preset.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
										children: preset.title
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setIdea(buildArchviz100AppliedPrompt(preset, transformCtx));
											toast.success(upload ? `Injected "${preset.title}" onto uploaded image (camera locked)` : `Applied ArchViz preset: ${preset.title}`);
										},
										className: "shrink-0 rounded-full bg-[#c5a880] px-2.5 py-0.5 text-[10px] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]",
										children: upload ? "Inject" : "Apply"
									}), upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: busy,
										title: `Inject "${preset.title}" & render directly on uploaded photo`,
										onClick: () => {
											setIdea(buildArchviz100AppliedPrompt(preset, transformCtx));
											generate("plate");
										},
										className: "grid size-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-50 dark:bg-emerald-500 dark:text-[#04130c]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-2.5 fill-current" })
									}) : null]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "line-clamp-2 text-[10px] text-[#4d463c] dark:text-[#a9bdc9]",
								children: preset.prompt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#cfe3f0]",
									children: preset.lighting
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#e8c98a]",
									children: preset.camera
								})]
							})
						]
					}, preset.id);
				}), filtered100.length > limit100 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "archviz100-load-more",
					onClick: () => setLimit100((n) => Math.min(filtered100.length, n + 35)),
					className: "w-full rounded-xl border border-[#d1c5b8]/55 bg-white/75 py-1.5 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8c98a]",
					children: [
						"Show more (",
						filtered100.length - limit100,
						" remaining)"
					]
				}) : null] }) : tab === "zuke119" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [filteredZuke.slice(0, limitZuke).map((item) => {
					const preview = resolveZukeVizPreview(item);
					const isExpanded = expandedZukeId === item.id;
					const showPt = Boolean(zukeShowOriginal[item.id] && item.originalPrompt);
					const slotValues = zukeSlots[item.id] ?? {};
					const displayedPrompt = showPt ? item.originalPrompt ?? item.prompt : resolveSmartPlaceholders(item.prompt, slotValues, transformCtx);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `zuke119-card-${item.id}`,
						className: "flex flex-col gap-1.5 rounded-xl border border-[#d1c5b8]/45 bg-white/65 p-2 transition hover:border-[#725b38] dark:border-[#43474b]/50 dark:bg-[#16202d]/75 dark:hover:border-[#e8c98a]/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetBeforeAfterStrip, {
								preview,
								alt: item.title,
								uploadSrc: upload,
								heightClass: "h-22",
								badge: item.aspectRatio ?? item.batch,
								testId: `zuke119-ba-${item.id}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]",
										children: item.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
										children: item.title
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": `zuke119-apply-${item.id}`,
										onClick: () => applyZukePrompt(item, false),
										className: "shrink-0 rounded-full bg-[#c5a880] px-2.5 py-0.5 text-[10px] font-semibold text-[#281800] transition hover:brightness-95 dark:bg-[#cfe3f0] dark:text-[#08131f]",
										children: upload ? "Inject" : "Apply"
									}), upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: busy,
										title: `Inject ${item.id} & render onto uploaded photo`,
										onClick: () => applyZukePrompt(item, true),
										className: "grid size-5 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-50 dark:bg-emerald-500 dark:text-[#04130c]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-2.5 fill-current" })
									}) : null]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-[10px] leading-relaxed text-[#4d463c] dark:text-[#a9bdc9]", isExpanded ? "" : "line-clamp-2"),
								children: displayedPrompt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#4d463c] dark:bg-[#2b3643] dark:text-[#cfe3f0]",
										children: item.category
									}),
									item.requiresReference ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:text-[#e8c98a]",
										children: "Ref Input"
									}) : null,
									item.originalPrompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setZukeShowOriginal((prev) => ({
											...prev,
											[item.id]: !prev[item.id]
										})),
										className: "inline-flex items-center gap-0.5 rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] font-medium text-[#725b38] hover:bg-[#e5dfd4] dark:bg-[#2b3643] dark:text-[#e8c98a]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "size-2.5" }), showPt ? "EN" : "PT"]
									}) : null,
									item.placeholders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setExpandedZukeId(isExpanded ? null : item.id),
										className: "ml-auto inline-flex items-center gap-0.5 rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] font-semibold text-[#725b38] hover:bg-[#e5dfd4] dark:bg-[#2b3643] dark:text-[#e8c98a]",
										children: [
											"Slots (",
											item.placeholders.length,
											")",
											isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-2.5" })
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setExpandedZukeId(isExpanded ? null : item.id),
										className: "ml-auto inline-flex items-center gap-0.5 text-[9px] font-medium text-[#7f766a] hover:text-[#1b1c1a] dark:text-[#a9bdc9]",
										children: isExpanded ? "Less" : "Full"
									})
								]
							}),
							isExpanded && item.placeholders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-0.5 grid grid-cols-1 gap-1 rounded-lg border border-[#d1c5b8]/40 bg-[#fbf9f5]/90 p-1.5 dark:border-[#43474b]/50 dark:bg-[#0d1622]/85",
								children: item.placeholders.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-1.5 text-[9px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-24 shrink-0 truncate font-mono text-[#725b38] dark:text-[#e8c98a]",
										title: slot,
										children: [
											"[",
											slot,
											"]"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: slotValues[slot] ?? "",
										onChange: (e) => setZukeSlots((prev) => ({
											...prev,
											[item.id]: {
												...prev[item.id] ?? {},
												[slot]: e.target.value
											}
										})),
										placeholder: `Enter ${slot}…`,
										className: "h-6 min-w-0 flex-1 rounded border border-[#d1c5b8]/50 bg-white px-1.5 text-[10px] text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#43474b] dark:bg-[#16202d] dark:text-[#e8eff3]"
									})]
								}, slot))
							}) : null,
							isExpanded && item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "rounded-lg bg-[#efeeea]/70 px-2 py-1 text-[9.5px] text-[#4d463c] dark:bg-[#121c29] dark:text-[#a9bdc9]",
								children: item.note
							}) : null
						]
					}, item.id);
				}), filteredZuke.length > limitZuke ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "zuke119-load-more",
					onClick: () => setLimitZuke((n) => Math.min(filteredZuke.length, n + 30)),
					className: "w-full rounded-xl border border-[#d1c5b8]/55 bg-white/75 py-1.5 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80 dark:text-[#e8c98a]",
					children: [
						"Show more (",
						filteredZuke.length - limitZuke,
						" remaining)"
					]
				}) : null] }) : tab === "looks40" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": "looks40-hero-ba",
						className: "relative h-28 overflow-hidden rounded-xl border border-[#d1c5b8]/50 select-none dark:border-[#a9bdc9]/25",
						onMouseMove: (e) => {
							const rect = e.currentTarget.getBoundingClientRect();
							const pct = Math.max(5, Math.min(95, (e.clientX - rect.left) / rect.width * 100));
							setHoverBeforeAfter(pct);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: upload ?? activeLook.thumbnail,
								alt: activeLook.name,
								referrerPolicy: "no-referrer",
								className: cn("h-full w-full object-cover", upload ? resolveLookPreview(activeLook).afterFilterClass : "")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-0",
								style: { clipPath: `inset(0 ${100 - hoverBeforeAfter}% 0 0)` },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: upload ?? activeLook.beforeThumb,
									alt: "Before",
									referrerPolicy: "no-referrer",
									className: "h-full w-full object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pointer-events-none absolute inset-y-0 w-0.5 bg-[#e8c98a] shadow-[0_0_8px_#e8c98a]",
								style: { left: `${hoverBeforeAfter}%` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute top-1.5 left-2 rounded-full bg-black/70 px-2 py-0.5 text-[9px] text-white",
								children: upload ? "Your Upload" : "Before"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "pointer-events-none absolute top-1.5 right-2 rounded-full bg-black/75 px-2 py-0.5 text-[9px] text-[#e8c98a]",
								children: [
									activeLook.code,
									" · ",
									activeLook.name
								]
							}),
							activeLook.rules ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "pointer-events-none absolute right-2 bottom-1.5 left-2 flex items-center gap-1 truncate rounded-md bg-amber-950/85 px-2 py-0.5 text-[9px] font-medium text-amber-200 backdrop-blur-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3 shrink-0 text-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate",
									children: ["Rule: ", activeLook.rules]
								})]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-1.5",
						children: filteredLooks.map((look) => {
							const active = look.id === intentLookId;
							const preview = resolveLookPreview(look);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": `intent-look-${look.code}`,
								onClick: () => {
									applyIntentLook(look.id);
									toast.success(upload ? `Injected Look ${look.code}: ${look.name} onto uploaded image` : look.rules ? `Look ${look.code}: ${look.name} · Rule: ${look.rules}` : `Look ${look.code}: ${look.name} (${look.fidelity} lock)`);
								},
								className: cn("group overflow-hidden rounded-xl border text-left transition", active ? "border-[#725b38] ring-1 ring-[#c5a880] dark:border-[#e8c98a] dark:ring-[#e8c98a]/50" : "border-[#d1c5b8]/45 bg-white/60 dark:border-[#43474b]/60 dark:bg-[#16202d]/80"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetBeforeAfterStrip, {
									preview,
									alt: look.name,
									uploadSrc: upload,
									heightClass: "h-16",
									badge: look.fidelity
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "shrink-0 rounded bg-[#efeeea] px-1 py-0.2 font-mono text-[8.5px] font-bold text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]",
												children: look.code
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-[10px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
												children: look.name
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]",
											children: look.bestFor
										}),
										look.rules ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 flex items-center gap-0.5 truncate text-[8.5px] font-medium text-amber-700 dark:text-amber-300",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-2.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: look.rules
											})]
										}) : null
									]
								})]
							}, look.id);
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: PLAIN_QUESTIONS_8.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-[#d1c5b8]/45 bg-white/65 p-2 dark:border-[#43474b]/60 dark:bg-[#16202d]/75",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-between text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
								children: q.question
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[#725b38] dark:text-[#e8c98a]",
								children: questionPicks[q.id] ?? "Auto"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: q.tiles.map((tile) => {
								const picked = (questionPicks[q.id] ?? "Auto") === tile;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQuestionPick(q.id, tile),
									className: cn("rounded-full px-2 py-0.5 text-[10px] transition", picked ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea]/80 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
									children: tile
								}, tile);
							})
						})]
					}, q.id))
				})
			})
		]
	});
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
	},
	{
		id: "engine",
		label: "Engine",
		icon: Cpu
	}
];
var MATERIAL_SWATCHES = [{
	id: "travertine",
	label: "Roman Travertine",
	sub: "Matte Honed",
	swatchClass: "bg-gradient-to-br from-[#e7ded1] via-[#d7ccb8] to-[#b8aa93]",
	pickTarget: "wall",
	pickValue: "Travertine",
	tag: "Travertine"
}, {
	id: "palm-terracotta",
	label: "Sunlit Terracotta",
	sub: "Tactile Lime",
	swatchClass: "bg-gradient-to-br from-[#cf8e67] via-[#b86f49] to-[#874929]",
	pickTarget: "floor",
	pickValue: "Terracotta",
	tag: "Warm limestone"
}];
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
var MATRIX_SLOTS = [
	{
		key: "massing",
		label: "Massing / Layout",
		sample: "/viz/p01-pavilion-dusk.jpg"
	},
	{
		key: "material",
		label: "Material Palette",
		sample: "/viz/t05-subtropical-home.jpg"
	},
	{
		key: "lighting",
		label: "Atmosphere / Lighting",
		sample: "/viz/p02-loft-after.jpg"
	}
];
function PropertiesPanel({ collapsed = false, onToggleCollapse, onOpenStage, onExportPlate }) {
	const design = useOriel((state) => state.design);
	const engine = useOriel((state) => state.engine);
	const frame = useOriel((state) => state.frame);
	const scene3d = useOriel((state) => state.scene3d);
	const plate = useOriel((state) => state.plate);
	const conditioningChannels = useOriel((state) => state.conditioningChannels);
	const clearConditioningChannels = useOriel((state) => state.clearConditioningChannels);
	const setPanel = useOriel((state) => state.setPanel);
	const setFrame = useOriel((state) => state.setFrame);
	const setScene3DField = useOriel((state) => state.setScene3DField);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setPick = useOriel((state) => state.setPick);
	const setTarget = useOriel((state) => state.setTarget);
	const toggleTag = useOriel((state) => state.toggleTag);
	const setAdvanced = useOriel((state) => state.setAdvanced);
	const toggleExtra = useOriel((state) => state.toggleExtra);
	const setEngineField = useOriel((state) => state.setEngineField);
	const applyWorkflowPreset = useOriel((state) => state.applyWorkflowPreset);
	const resetEngine = useOriel((state) => state.resetEngine);
	const undo = useOriel((state) => state.undo);
	const redo = useOriel((state) => state.redo);
	const { busy, applyRelight, applyOutpaint, applyEnhance, applyRemoveBgPlugin, applyRestoreFacesPlugin } = useGenerate();
	const groups = GROUPS[design.vertical];
	const looks = LOOKS[design.vertical];
	const activeChannelNames = [
		"depth",
		"normal",
		"clay",
		"annotator"
	].filter((k) => Boolean(conditioningChannels[k]));
	function openStage(stage) {
		if (onOpenStage) {
			onOpenStage(stage);
			return;
		}
		window.dispatchEvent(new CustomEvent("oriel-view", { detail: stage }));
	}
	function updateMatrixSlot(slotKey, patch) {
		const next = {
			...engine.refMatrix,
			[slotKey]: {
				...engine.refMatrix[slotKey],
				...patch
			}
		};
		setEngineField("refMatrix", next);
		if (patch.url) setEngineField("ipAdapterEnabled", true);
	}
	function handleExportAction() {
		if (plate?.url) {
			const a = document.createElement("a");
			a.href = plate.url;
			a.download = `oriel-atelier-plate-${Date.now()}.png`;
			a.click();
		}
		if (onExportPlate) onExportPlate();
		else if (!plate?.url) toast.message("Generate a render or upload a source plate before exporting.");
	}
	if (collapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden shrink-0 flex-col items-center gap-1.5 border-l border-[#d1c5b8]/40 bg-white/70 px-2 py-3 backdrop-blur-2xl lg:flex",
		children: [
			onToggleCollapse ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-testid": "expand-inspector-btn",
				onClick: onToggleCollapse,
				"aria-label": "Expand Scene & Optics inspector",
				title: "Open Scene & Optics",
				className: "grid size-9 place-items-center rounded-xl border border-[#d1c5b8]/60 bg-white text-[#1b1c1a] transition hover:border-[#725b38]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightOpen, { className: "size-4 text-[#725b38]" })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px w-6 bg-[#d1c5b8]/50" }),
			TABS.map((tab) => {
				const Icon = tab.icon;
				const active = design.panel === tab.id || tab.id === "design" && design.panel === "advanced";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: tab.label,
					"aria-label": `Open ${tab.label} properties`,
					onClick: () => {
						setPanel(tab.id);
						onToggleCollapse?.();
					},
					className: cn("flex size-10 flex-col items-center justify-center rounded-xl text-[9px] font-medium transition", active ? "bg-[#c5a880] text-[#281800] shadow-xs" : "text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a]"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
				}, tab.id);
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		id: "studio-properties",
		className: "w-full pb-2 lg:flex lg:h-full lg:w-full lg:shrink-0 lg:flex-col",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "atelier-glass arctic-glass flex flex-col overflow-hidden rounded-3xl border border-[#d1c5b8]/45 shadow-[0_14px_34px_rgba(70,48,16,0.06)] lg:h-full dark:border-[#a9bdc9]/20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 border-b border-[#d1c5b8]/35 bg-white/50 px-3.5 pt-3.5 pb-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#725b38] dark:text-[#e8c98a]",
									children: "Studio Inspector"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-0.5 font-serif text-lg font-medium tracking-tight text-[#1b1c1a] dark:text-[#e8eff3]",
									children: "Scene & Optics"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 items-center gap-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => undo(),
										className: "grid size-7 place-items-center rounded-lg text-xs text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]",
										"aria-label": "Undo",
										title: "Undo",
										children: "↩"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => redo(),
										className: "grid size-7 place-items-center rounded-lg text-xs text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]",
										"aria-label": "Redo",
										title: "Redo",
										children: "↪"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											resetEngine();
											toast.success("Optics & AI engine reset to studio defaults");
										},
										className: "inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]",
										title: "Reset optics & engine defaults",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), "Reset"]
									}),
									onToggleCollapse ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": "collapse-inspector-btn",
										onClick: onToggleCollapse,
										"aria-label": "Collapse Scene & Optics inspector",
										title: "Collapse panel for wider canvas",
										className: "hidden size-7 place-items-center rounded-lg text-[#4d463c] hover:bg-[#efeeea] hover:text-[#1b1c1a] lg:grid dark:text-[#a9bdc9] dark:hover:bg-[#202b38] dark:hover:text-[#e8eff3]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightClose, { className: "size-4" })
									}) : null
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-6 gap-1 rounded-xl bg-[#efeeea]/85 p-1 dark:bg-[#050f1b]/80",
							children: TABS.map((tab) => {
								const Icon = tab.icon;
								const active = design.panel === tab.id || tab.id === "design" && design.panel === "advanced";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setPanel(tab.id),
									className: cn("flex h-11 flex-col items-center justify-center gap-0.5 whitespace-nowrap rounded-lg text-[10px] font-medium transition", active ? "bg-white font-semibold text-[#725b38] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), tab.label]
								}, tab.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 truncate font-mono text-[10px] text-[#7f766a] tabular-nums dark:text-[#a9bdc9]",
							children: [
								design.look,
								" · ",
								design.light,
								" · ",
								scene3d.focalLength,
								"mm · ",
								engine.workflowPreset
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-4 overflow-y-auto px-4 py-4",
					children: [
						design.panel === "design" || design.panel === "advanced" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]",
									children: "Atelier Swatches"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTarget("whole"),
									className: "text-[11px] font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]",
									children: "All Elements →"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 grid grid-cols-2 gap-2",
								children: MATERIAL_SWATCHES.map((sw) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setPick(sw.pickTarget, sw.pickValue);
										if (!design.tags.includes(sw.tag)) toggleTag(sw.tag);
										toast.success(`Applied ${sw.label} finish to ${sw.pickTarget}`);
									},
									className: "flex items-center gap-2.5 rounded-2xl border border-[#d1c5b8]/45 bg-white/85 p-2 text-left transition hover:border-[#725b38] hover:shadow-xs dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("size-8 shrink-0 rounded-xl shadow-inner", sw.swatchClass),
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[11px] font-medium text-[#1b1c1a] dark:text-[#e8eff3]",
											children: sw.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
											children: sw.sub
										})]
									})]
								}, sw.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
								children: "Elements"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 grid grid-cols-4 gap-1.5",
								children: (TILES[design.vertical] ?? []).map((tile) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setTarget(tile.id),
									className: cn("hover-tile overflow-hidden rounded-xl border bg-white text-center transition dark:bg-[#16202d]", design.target === tile.id ? "border-[#c5a880] ring-1 ring-[#c5a880] dark:border-[#e8c98a] dark:ring-[#e8c98a]" : "border-[#d1c5b8]/50 dark:border-[#a9bdc9]/20"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: tile.image,
										alt: "",
										className: "h-11 w-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block px-1 py-1 text-[10px] font-medium text-[#1b1c1a] dark:text-[#e8eff3]",
										children: tile.label
									})]
								}, tile.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fold, {
								title: "Materials & Finishes",
								defaultOpen: true,
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hexagon, { className: "size-4 text-[#725b38]" }),
								children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: group.label,
									value: design.picks[group.id] ?? group.options[0],
									options: group.options,
									onPick: (value) => setPick(group.id, value)
								}, group.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
								title: "Look & Feel",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
								watch: design.look,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-2",
										children: looks.map((look) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setDesignField("look", look.name),
											className: cn("hover-tile overflow-hidden rounded-xl border bg-white text-left dark:bg-[#121c29]", design.look === look.name ? "border-[#c5a880] ring-1 ring-[#c5a880] dark:border-[#e8c98a] dark:ring-[#e8c98a]" : "border-[#d1c5b8]/50 dark:border-[#a9bdc9]/20"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: look.image,
												alt: "",
												className: "h-16 w-full object-cover"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block px-2 py-1.5 text-xs text-[#1b1c1a] dark:text-[#e8eff3]",
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
									className: "text-sm font-semibold text-[#725b38] dark:text-[#e8c98a]",
									children: "#"
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: TAGS.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleTag(tag),
										className: cn("hover-chip h-8 rounded-full border px-3 text-xs", design.tags.includes(tag) ? "bg-[#c5a880] border-transparent font-medium text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
										"aria-pressed": design.tags.includes(tag),
										children: tag
									}, tag))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
								title: "Advanced",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
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
										className: cn("hover-chip h-8 rounded-full border px-3 text-xs", design.advanced.extras.includes(pill.id) ? "bg-[#c5a880] border-transparent font-medium text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
										"aria-pressed": design.advanced.extras.includes(pill.id),
										children: pill.label
									}, pill.id))
								})]
							})
						] }) : null,
						design.panel === "camera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#d1c5b8]/45 bg-white/85 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
											children: "3D Optics & Perspective"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 grid grid-cols-4 gap-1.5",
											children: [
												24,
												35,
												50,
												85
											].map((mm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setScene3DField("focalLength", mm),
												className: cn("h-8 rounded-xl border font-mono text-xs transition", scene3d.focalLength === mm ? "border-[#c5a880] bg-[#c5a880]/20 font-semibold text-[#513d1d] dark:border-[#e8c98a] dark:bg-[#584411]/60 dark:text-[#e8c98a]" : "border-[#d1c5b8]/50 bg-[#fbf9f5] text-[#4d463c] dark:border-[#a9bdc9]/20 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
												children: [mm, "mm"]
											}, mm))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "mt-3 flex cursor-pointer items-center justify-between text-xs text-[#1b1c1a] dark:text-[#e8eff3]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: "2-Point Tilt Shift Correction"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: scene3d.twoPointTilt,
												onChange: (e) => setScene3DField("twoPointTilt", e.target.checked),
												className: "size-4 accent-[#725b38] dark:accent-[#e8c98a]"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: "Camera Angle",
									value: design.camera,
									options: CAMERAS,
									onPick: (value) => setDesignField("camera", value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: "All Export Ratios",
									value: frame.ratio,
									options: RATIOS,
									onPick: (value) => setFrame({
										...frame,
										ratio: value
									})
								})
							]
						}) : null,
						design.panel === "light" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]",
									children: "01 · Atmospheric Regime"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid grid-cols-3 gap-2",
									children: ATMOSPHERIC_REGIMES.map((reg) => {
										const active = design.light === reg.light;
										const Icon = reg.icon === "noon" ? Sun : reg.icon === "twilight" ? Sunset : SunMedium;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setDesignField("light", reg.light);
												setScene3DField("d5LightPreset", reg.d5Preset);
												setScene3DField("sunElevation", reg.sunElevation);
											},
											"aria-pressed": active,
											className: cn("flex flex-col items-center rounded-2xl border px-2 py-2.5 text-center transition", active ? "border-[#c5a880] bg-[#c5a880]/20 text-[#281800] shadow-xs dark:border-[#e8c98a] dark:bg-[#584411]/60 dark:text-[#e8c98a]" : "border-[#d1c5b8]/45 bg-white/80 text-[#4d463c] hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80 dark:text-[#cfe3f0]"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-4", active ? "text-[#725b38] dark:text-[#e8c98a]" : "text-[#7f766a] dark:text-[#a9bdc9]") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1.5 text-[11px] font-medium leading-tight",
													children: reg.label
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
													children: reg.kelvin
												})
											]
										}, reg.id);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 rounded-2xl border border-[#d1c5b8]/45 bg-white/85 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]",
											children: "02 · Photometric Tuning"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Sun Elevation",
											value: scene3d.sunElevation,
											min: 2,
											max: 85,
											unit: "°",
											onChange: (v) => setScene3DField("sunElevation", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Solar Azimuth",
											value: scene3d.sunAzimuth,
											min: 0,
											max: 360,
											unit: "°",
											onChange: (v) => setScene3DField("sunAzimuth", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Exposure",
											value: Math.round(scene3d.exposure * 100),
											min: 40,
											max: 220,
											unit: "%",
											onChange: (v) => setScene3DField("exposure", Number((v / 100).toFixed(2)))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 border-t border-[#d1c5b8]/35 pt-2.5 text-xs dark:border-[#a9bdc9]/20",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex cursor-pointer items-center justify-between text-[#1b1c1a] dark:text-[#e8eff3]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Real-Time Draft Stream" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: engine.liveStreamEnabled,
													onChange: (e) => setEngineField("liveStreamEnabled", e.target.checked),
													className: "size-4 accent-[#725b38] dark:accent-[#e8c98a]"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex cursor-pointer items-center justify-between text-[#1b1c1a] dark:text-[#e8eff3]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2-Point Tilt Shift" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: scene3d.twoPointTilt,
													onChange: (e) => setScene3DField("twoPointTilt", e.target.checked),
													className: "size-4 accent-[#725b38] dark:accent-[#e8c98a]"
												})]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
									label: "Light Presets",
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
							]
						}) : null,
						design.panel === "human" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								label: "People",
								value: design.people,
								options: PEOPLE,
								onPick: (value) => setDesignField("people", value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								label: "Activity",
								value: design.activity,
								options: ACTIVITIES,
								onPick: (value) => setDesignField("activity", value)
							})]
						}) : null,
						design.panel === "mood" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								label: "Mood",
								value: design.mood,
								options: MOODS,
								onPick: (value) => setDesignField("mood", value)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
								label: "Color",
								value: design.color,
								options: COLORS,
								onPick: (value) => setDesignField("color", value)
							})]
						}) : null,
						design.panel === "engine" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]",
										children: "AI Pipeline Conditioning"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: resetEngine,
										className: "text-[11px] font-medium text-[#725b38] hover:underline dark:text-[#e8c98a]",
										children: "Reset Defaults"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-[#d1c5b8]/50 bg-white/85 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
										children: "Workflow Preset · Rendair / mnml"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 grid grid-cols-2 gap-1.5",
										children: WORKFLOW_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => applyWorkflowPreset(preset.id),
											className: cn("flex flex-col items-start rounded-xl border px-2.5 py-2 text-left transition", engine.workflowPreset === preset.id ? "border-[#c5a880] bg-[#c5a880]/20 text-[#281800] dark:border-[#e8c98a] dark:bg-[#584411]/60 dark:text-[#e8c98a]" : "border-[#d1c5b8]/45 bg-[#fbf9f5] text-[#4d463c] hover:border-[#725b38]/50 dark:border-[#a9bdc9]/20 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
												children: preset.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
												children: preset.badge
											})]
										}, preset.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "Geometry & Seed (Veras AI)",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hexagon, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									defaultOpen: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Geometry Lock",
											value: engine.geometryLock,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("geometryLock", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Material Override",
											value: engine.materialOverride,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("materialOverride", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "Render Fidelity",
											value: engine.renderFidelity,
											options: RENDER_FIDELITIES.map((f) => f.id),
											labels: Object.fromEntries(RENDER_FIDELITIES.map((f) => [f.id, f.label])),
											onPick: (v) => setEngineField("renderFidelity", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-[#4d463c] dark:text-[#cfe3f0]",
													children: "Seed"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													value: engine.seed,
													onChange: (e) => setEngineField("seed", Math.max(1, Number(e.target.value) || 1)),
													className: "h-8 w-28 rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 font-mono text-xs tabular-nums text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setEngineField("seedLocked", !engine.seedLocked),
													className: cn("inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px]", engine.seedLocked ? "bg-[#c5a880] border-transparent font-medium text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
													"aria-pressed": engine.seedLocked,
													children: [engine.seedLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-3" }), engine.seedLocked ? "Locked" : "Auto"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setEngineField("seed", Math.floor(1e5 + Math.random() * 899999)),
													className: "grid size-8 place-items-center rounded-full border border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
													"aria-label": "Randomize seed",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "size-3.5" })
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "Facade & Climate (LookX AI)",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "Facade Typology",
											value: engine.facadeTypology,
											options: FACADE_TYPOLOGIES,
											onPick: (v) => setEngineField("facadeTypology", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "Climate Region",
											value: engine.climateRegion,
											options: CLIMATE_REGIONS,
											onPick: (v) => setEngineField("climateRegion", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Style Transfer Weight",
											value: engine.styleTransferWeight,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("styleTransferWeight", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "Detail Density",
											value: engine.detailDensity,
											options: DETAIL_DENSITIES.map((d) => d.id),
											labels: Object.fromEntries(DETAIL_DENSITIES.map((d) => [d.id, d.label])),
											onPick: (v) => setEngineField("detailDensity", v)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "Live Stream, Relight & Uncrop (Krea)",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									defaultOpen: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between rounded-xl border border-[#d1c5b8]/50 bg-white px-2.5 py-2 text-xs dark:border-[#a9bdc9]/20 dark:bg-[#050f1b]/70",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3.5 text-[#725b38] dark:text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-[#1b1c1a] dark:text-[#e8eff3]",
													children: "Real-Time Draft Stream"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-pressed": engine.liveStreamEnabled,
												onClick: () => setEngineField("liveStreamEnabled", !engine.liveStreamEnabled),
												className: cn("h-7 rounded-full border px-3 text-[11px] font-medium", engine.liveStreamEnabled ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]"),
												children: engine.liveStreamEnabled ? "Streaming" : "Off"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]",
											children: "AI Relight & Season (Geometry Lock)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-wrap gap-1.5",
											children: RELIGHT_PRESETS.filter((r) => r.id !== "none").map((rp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: busy,
												onClick: () => void applyRelight(rp.id),
												className: cn("hover-chip h-8 rounded-full border px-3 text-xs font-medium disabled:opacity-50", engine.relightPreset === rp.id ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 bg-white text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
												children: rp.label
											}, rp.id))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]",
											children: "Outpaint Canvas Uncrop"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-wrap gap-1.5",
											children: OUTPAINT_RATIOS.filter((o) => o.id !== "none").map((op) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												disabled: busy,
												onClick: () => void applyOutpaint(op.id),
												className: cn("hover-chip h-8 rounded-full border px-3 text-xs font-medium disabled:opacity-50", engine.outpaintRatio === op.id ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 bg-white text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
												children: op.label
											}, op.id))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Sketch Edge Adherence",
											value: engine.edgeAdherence,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("edgeAdherence", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "Sketch Mode",
											value: engine.sketchMode,
											options: SKETCH_MODES.map((s) => s.id),
											labels: Object.fromEntries(SKETCH_MODES.map((s) => [s.id, s.label])),
											onPick: (v) => setEngineField("sketchMode", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Inpaint Strength",
											value: engine.inpaintStrength,
											min: 10,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("inpaintStrength", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "AI Enhance Mode",
											value: engine.enhanceMode,
											options: ENHANCE_MODES.map((e) => e.id),
											labels: Object.fromEntries(ENHANCE_MODES.map((e) => [e.id, e.label])),
											onPick: (v) => setEngineField("enhanceMode", v)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "IOPaint Suite & Plugins",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "IOPaint Task",
											value: engine.iopaintTask,
											options: IOPAINT_TASKS.map((t) => t.id),
											labels: Object.fromEntries(IOPAINT_TASKS.map((t) => [t.id, `${t.label} (${t.badge})`])),
											onPick: (v) => {
												const nextTask = v;
												setEngineField("iopaintTask", nextTask);
												const meta = IOPAINT_TASKS.find((t) => t.id === nextTask);
												if (meta) setEngineField("iopaintModel", meta.defaultModel);
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]",
												children: "Inpaint / Erase Model"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												"aria-label": "Inpaint / Erase Model",
												value: engine.iopaintModel,
												onChange: (e) => setEngineField("iopaintModel", e.target.value),
												className: "mt-1.5 h-9 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-xs text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]",
												children: IOPAINT_MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: m.id,
													children: [
														m.label,
														" — ",
														m.hint
													]
												}, m.id))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Mask Dilate / Expand",
											value: engine.iopaintMaskDilate,
											min: 0,
											max: 24,
											unit: "px",
											onChange: (v) => setEngineField("iopaintMaskDilate", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-[#4d463c] dark:text-[#cfe3f0]",
												children: "Invert Inpaint Mask"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEngineField("iopaintInvertMask", !engine.iopaintInvertMask),
												className: cn("h-7 rounded-full border px-3 text-[11px] font-medium", engine.iopaintInvertMask ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]"),
												children: engine.iopaintInvertMask ? "Inverted" : "Normal"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 border-t border-[#d1c5b8]/40 pt-3 dark:border-[#a9bdc9]/20",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
												label: "RemoveBG Engine",
												value: engine.iopaintRemoveBgModel,
												options: IOPAINT_REMOVEBG_MODELS.map((m) => m.id),
												labels: Object.fromEntries(IOPAINT_REMOVEBG_MODELS.map((m) => [m.id, m.label])),
												onPick: (v) => setEngineField("iopaintRemoveBgModel", v)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: busy,
													onClick: () => void applyRemoveBgPlugin("cutout"),
													className: "hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-50 dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Subject Cutout"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: busy,
													onClick: () => void applyRemoveBgPlugin("mask"),
													className: "hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-50 dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Sky → Mask"]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 border-t border-[#d1c5b8]/40 pt-3 dark:border-[#a9bdc9]/20",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
												label: "Restore Faces Plugin",
												value: engine.iopaintFaceModel,
												options: IOPAINT_FACE_MODELS.map((m) => m.id),
												labels: Object.fromEntries(IOPAINT_FACE_MODELS.map((m) => [m.id, m.label])),
												onPick: (v) => setEngineField("iopaintFaceModel", v)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													disabled: busy,
													onClick: () => void applyRestoreFacesPlugin(),
													className: "hover-chip inline-flex h-8 items-center justify-center gap-1 rounded-full border border-[#d1c5b8]/60 bg-white px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-50 dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Restore Faces"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => openStage("mask"),
													className: "inline-flex h-8 items-center justify-center gap-1 rounded-full bg-[#c5a880] px-2.5 text-[11px] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3" }), " Open Inpaint"]
												})]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "Annotators & Depth (ControlNet)",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									children: [
										activeChannelNames.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#c5a880]/60 bg-[#c5a880]/15 px-2.5 py-2 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium text-[#1b1c1a] dark:text-[#e8eff3]",
												children: ["Attached Passes: ", activeChannelNames.map((n) => n.toUpperCase()).join(" · ")]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: clearConditioningChannels,
												className: "text-[#725b38] hover:underline dark:text-[#e8c98a]",
												children: "Clear"
											})]
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "lllyasviel/Annotators",
											value: engine.annotatorMode,
											options: ANNOTATOR_MODES.map((m) => m.id),
											labels: Object.fromEntries(ANNOTATOR_MODES.map((m) => [m.id, m.label])),
											onPick: (v) => setEngineField("annotatorMode", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Edge Threshold",
											value: engine.annotatorThreshold,
											min: 10,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("annotatorThreshold", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pt-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-[#4d463c] dark:text-[#cfe3f0]",
												children: "Depth-Anything-V2 Lock"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEngineField("depthEnabled", !engine.depthEnabled),
												className: cn("h-7 rounded-full border px-3 text-[11px] font-medium", engine.depthEnabled ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]"),
												children: engine.depthEnabled ? "Enabled" : "Off"
											})]
										}),
										engine.depthEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Depth Weight",
											value: engine.depthWeight,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("depthWeight", v)
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "Multi-Ref Matrix & IP-Adapter Plus",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hexagon, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-[#4d463c] dark:text-[#cfe3f0]",
												children: "IP-Adapter Conditioning"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEngineField("ipAdapterEnabled", !engine.ipAdapterEnabled),
												className: cn("h-7 rounded-full border px-3 text-[11px] font-medium", engine.ipAdapterEnabled ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]"),
												children: engine.ipAdapterEnabled ? "Active" : "Off"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: MATRIX_SLOTS.map((slot) => {
												const current = engine.refMatrix[slot.key];
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl border border-[#d1c5b8]/50 bg-white p-2.5 text-[11px] dark:border-[#a9bdc9]/20 dark:bg-[#050f1b]/70",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
															children: slot.label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => updateMatrixSlot(slot.key, { url: current.url ? null : slot.sample }),
																className: cn("h-6 rounded-full border px-2 text-[10px]", current.url ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]"),
																children: current.url ? "Sample Attached" : "Attach Sample"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																className: "inline-flex h-6 cursor-pointer items-center gap-1 rounded-full border border-[#d1c5b8]/60 px-2 text-[10px] text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0] dark:hover:text-[#e8eff3]",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-2.5" }),
																	" Upload",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		type: "file",
																		accept: "image/*",
																		className: "sr-only",
																		onChange: (e) => {
																			const f = e.target.files?.[0];
																			if (f) readImage(f, 1024).then((url) => updateMatrixSlot(slot.key, { url }));
																			e.target.value = "";
																		}
																	})
																]
															})]
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
														label: "Slot Weight",
														value: current.weight,
														min: 0,
														max: 100,
														unit: "%",
														onChange: (v) => updateMatrixSlot(slot.key, { weight: v })
													})]
												}, slot.key);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "Weight Mode",
											value: engine.ipAdapterPreset,
											options: IPADAPTER_PRESETS.map((p) => p.id),
											labels: Object.fromEntries(IPADAPTER_PRESETS.map((p) => [p.id, p.label])),
											onPick: (v) => setEngineField("ipAdapterPreset", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "IP-Adapter Weight",
											value: engine.ipAdapterWeight,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("ipAdapterWeight", v)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "Generative Tile Upscaler (Real-ESRGAN)",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]",
											children: "Super-Resolution Scale"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex gap-1.5",
											children: [
												2,
												4,
												8
											].map((factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setEngineField("upscaleFactor", factor),
												className: cn("h-8 flex-1 rounded-full border text-xs font-semibold", engine.upscaleFactor === factor ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 bg-white text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
												children: [factor, "×"]
											}, factor))
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "ESRGAN Weights",
											value: engine.esrganModel,
											options: ESRGAN_MODELS.map((m) => m.id),
											labels: Object.fromEntries(ESRGAN_MODELS.map((m) => [m.id, m.label])),
											onPick: (v) => setEngineField("esrganModel", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Tile Denoise",
											value: engine.esrganDenoise,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("esrganDenoise", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between pt-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-[#4d463c] dark:text-[#cfe3f0]",
												children: "Fixture & Edge Restoration"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEngineField("esrganFaceEnhance", !engine.esrganFaceEnhance),
												className: cn("h-7 rounded-full border px-3 text-[11px] font-medium", engine.esrganFaceEnhance ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:text-[#cfe3f0]"),
												children: engine.esrganFaceEnhance ? "On" : "Off"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: busy,
											onClick: () => void applyEnhance(engine.upscaleFactor),
											className: "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-[#c5a880] text-xs font-semibold text-[#281800] disabled:opacity-50 dark:bg-[#cfe3f0] dark:text-[#08131f]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
												" Run ",
												engine.upscaleFactor,
												"× Tiled Upscale"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Fold, {
									title: "Cinematic Concept (Midjourney)",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4 text-[#725b38] dark:text-[#e8c98a]" }),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipRow, {
											label: "Output Layout",
											value: engine.outputMode,
											options: ["single", "grid-4"],
											labels: {
												single: "Single Plate",
												"grid-4": "4-Up Grid"
											},
											onPick: (v) => setEngineField("outputMode", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Stylize (--s)",
											value: engine.mjStylize,
											min: 0,
											max: 1e3,
											step: 20,
											unit: "",
											onChange: (v) => setEngineField("mjStylize", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Chaos (--c)",
											value: engine.mjChaos,
											min: 0,
											max: 100,
											unit: "",
											onChange: (v) => setEngineField("mjChaos", v)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRow, {
											label: "Reference Weight",
											value: engine.refWeight,
											min: 0,
											max: 100,
											unit: "%",
											onChange: (v) => setEngineField("refWeight", v)
										})
									]
								})
							]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 border-t border-[#d1c5b8]/35 bg-white/65 px-4 py-3 backdrop-blur-md dark:border-[#a9bdc9]/20 dark:bg-[#121c29]/95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleExportAction,
						className: "flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1c1a] px-4 text-xs font-medium tracking-wide text-[#fbf9f5] shadow-md transition hover:bg-[#312f2b] dark:bg-[#cfe3f0] dark:font-semibold dark:text-[#08131f] dark:hover:bg-[#e6f3fb]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 text-[#e0c298] dark:text-[#08131f]" }), "Export Plate & Layered Spec"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-center font-mono text-[10px] text-[#7f766a] tabular-nums dark:text-[#a9bdc9]",
						children: [
							"Color Profile: ACEScg · ",
							frame.ratio,
							" · ",
							frame.resolution.toUpperCase()
						]
					})]
				})
			]
		})
	});
}
function Fold({ title, icon, children, watch, defaultOpen = false }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
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
		className: "rounded-2xl border border-[#d1c5b8]/45 bg-white/65 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/75",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((value) => !value),
			className: "hover-fold flex h-11 w-full items-center gap-2 rounded-2xl px-3 text-sm font-medium text-[#1b1c1a] dark:text-[#e8eff3]",
			children: [
				icon,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-left",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-[#7f766a] transition dark:text-[#a9bdc9]", open && "rotate-180") })
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4 border-t border-[#d1c5b8]/35 px-3 pt-3 pb-3 dark:border-[#a9bdc9]/20",
			children
		}) : null]
	});
}
function SliderRow({ label, value, min, max, step = 1, unit, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium text-[#4d463c] dark:text-[#cfe3f0]",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-mono font-semibold tabular-nums text-[#725b38] dark:text-[#e8c98a]",
				children: [value, unit]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min,
			max,
			step,
			value,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "mt-1.5 h-1.5 w-full accent-[#725b38] dark:accent-[#e8c98a]"
		})]
	});
}
function ChipRow({ label, value, options, labels, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-medium uppercase tracking-wide text-[#7f766a] dark:text-[#a9bdc9]",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-1.5",
		children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onPick(option),
			className: cn("hover-chip h-8 rounded-full border px-3 text-xs font-medium whitespace-nowrap shrink-0 transition", value === option ? "bg-[#c5a880] border-transparent text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-[#d1c5b8]/60 bg-white text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0] dark:hover:text-[#e8eff3]"),
			"aria-pressed": value === option,
			children: labels?.[option] ?? option
		}, option))
	})] });
}
var CANVAS_W = 1280;
var CANVAS_H = 720;
var DEFAULT_LAYERS = [
	{
		id: "layer-massing",
		name: "Massing",
		visible: true,
		opacity: 100
	},
	{
		id: "layer-facade",
		name: "Facade",
		visible: true,
		opacity: 100
	},
	{
		id: "layer-notes",
		name: "Landscape & Notes",
		visible: true,
		opacity: 90
	}
];
var INK_SWATCHES = [
	["#1c1917", "Charcoal ink"],
	["#1d4ed8", "Blueprint cobalt"],
	["#b91c1c", "Terracotta section"],
	["#15803d", "Foliage sage"],
	["#d97706", "Amber callout"],
	["#ffffff", "White chalk"]
];
var WEIGHT_PRESETS = [
	1,
	3,
	6,
	12
];
var EXAMPLE_INSERT_SWATCHES = [
	{
		id: "oak-lounge",
		label: "Warm Oak Lounge",
		url: "/viz/t03-compact-living-room.jpg"
	},
	{
		id: "courtyard-villa",
		label: "Courtyard Timber",
		url: "/viz/t05-subtropical-home.jpg"
	},
	{
		id: "brass-loft",
		label: "Loft Fixture",
		url: "/viz/p02-loft-after.jpg"
	}
];
function createOffscreenCanvas() {
	const c = document.createElement("canvas");
	c.width = CANVAS_W;
	c.height = CANVAS_H;
	return c;
}
function drawEntourageStampOnCanvas(ctx, item, x, y) {
	const w = Math.max(48, Math.round(CANVAS_W * item.widthNorm));
	const h = Math.max(54, Math.round(CANVAS_H * item.heightNorm));
	ctx.save();
	ctx.fillStyle = "rgba(28, 25, 23, 0.24)";
	ctx.beginPath();
	ctx.ellipse(x, y + h * .42, w * .56, Math.max(6, h * .1), 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.strokeStyle = "#b08a45";
	ctx.lineWidth = 2;
	ctx.setLineDash([4, 3]);
	ctx.strokeRect(x - w * .5, y - h * .5, w, h);
	ctx.setLineDash([]);
	ctx.fillStyle = "rgba(28, 25, 23, 0.78)";
	ctx.font = `${Math.round(Math.min(w, h) * .62)}px sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(item.glyph, x, y);
	ctx.fillStyle = "#1c1917";
	ctx.font = "bold 11px monospace";
	ctx.fillText(item.label.toUpperCase(), x, y + h * .56);
	ctx.restore();
}
function SketchMaskCanvas({ mode, aspect, backgroundUrl, initialBufferUrl, busy = false, onSaveBuffer, onLockToSource, onApplyMaskInpaint, onApplyDirectionalOutpaint, onApplyRemoveBg, onApplyRestoreFaces, onApplyEsrganPlugin, onLoadSampleSource }) {
	const entourageItems = useOriel((state) => state.entourageItems);
	const setEntourageItems = useOriel((state) => state.setEntourageItems);
	const engine = useOriel((state) => state.engine);
	const setEngineField = useOriel((state) => state.setEngineField);
	const upload = useOriel((state) => state.upload);
	const displayCanvasRef = (0, import_react.useRef)(null);
	const offscreenLayersRef = (0, import_react.useRef)({});
	const undoStacksRef = (0, import_react.useRef)({});
	const traceImgRef = (0, import_react.useRef)(null);
	const drawingRef = (0, import_react.useRef)(false);
	const startPtRef = (0, import_react.useRef)(null);
	const snapshotBeforeShapeRef = (0, import_react.useRef)(null);
	const lastSavedBufferRef = (0, import_react.useRef)(null);
	const [layers, setLayers] = (0, import_react.useState)(() => DEFAULT_LAYERS);
	const [activeLayerId, setActiveLayerId] = (0, import_react.useState)(DEFAULT_LAYERS[0].id);
	const [layersOpen, setLayersOpen] = (0, import_react.useState)(true);
	const [tool, setTool] = (0, import_react.useState)("pen");
	const [activeStampId, setActiveStampId] = (0, import_react.useState)(null);
	const [strokeSize, setStrokeSize] = (0, import_react.useState)(mode === "mask" ? 28 : 3);
	const [inkColor, setInkColor] = (0, import_react.useState)("#1c1917");
	const [traceOpacity, setTraceOpacity] = (0, import_react.useState)(mode === "mask" ? 100 : 45);
	const [maskInstruction, setMaskInstruction] = (0, import_react.useState)("");
	const [hasStrokes, setHasStrokes] = (0, import_react.useState)(Boolean(initialBufferUrl));
	const [samMode, setSamMode] = (0, import_react.useState)("off");
	const [samPosPoints, setSamPosPoints] = (0, import_react.useState)([]);
	const [samNegPoints, setSamNegPoints] = (0, import_react.useState)([]);
	const [samBusy, setSamBusy] = (0, import_react.useState)(false);
	const [peekOriginal, setPeekOriginal] = (0, import_react.useState)(false);
	const currentCanvasId = mode === "mask" ? "mask-layer" : activeLayerId;
	function ensureOffscreenLayer(id) {
		let c = offscreenLayersRef.current[id];
		if (!c) {
			c = createOffscreenCanvas();
			offscreenLayersRef.current[id] = c;
		}
		return c;
	}
	const compositeDisplay = (0, import_react.useCallback)((layerList = layers, traceOp = traceOpacity) => {
		const display = displayCanvasRef.current;
		if (!display) return;
		const dCtx = display.getContext("2d", { willReadFrequently: true });
		if (!dCtx) return;
		dCtx.clearRect(0, 0, CANVAS_W, CANVAS_H);
		if (mode === "mask") {
			if (peekOriginal) return;
			const maskCanvas = offscreenLayersRef.current["mask-layer"];
			if (maskCanvas) dCtx.drawImage(maskCanvas, 0, 0, CANVAS_W, CANVAS_H);
			return;
		}
		dCtx.fillStyle = "#f7f2e8";
		dCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);
		const bgImg = traceImgRef.current;
		if (bgImg && bgImg.complete && bgImg.naturalWidth > 0 && traceOp > 0) {
			dCtx.save();
			dCtx.globalAlpha = traceOp / 100;
			const imgAspect = bgImg.naturalWidth / bgImg.naturalHeight;
			const canvasAspect = CANVAS_W / CANVAS_H;
			let dw = CANVAS_W;
			let dh = CANVAS_H;
			let dx = 0;
			let dy = 0;
			if (imgAspect > canvasAspect) {
				dh = CANVAS_W / imgAspect;
				dy = (CANVAS_H - dh) / 2;
			} else {
				dw = CANVAS_H * imgAspect;
				dx = (CANVAS_W - dw) / 2;
			}
			dCtx.drawImage(bgImg, dx, dy, dw, dh);
			dCtx.restore();
		}
		for (const layer of layerList) {
			if (!layer.visible) continue;
			const layerCanvas = offscreenLayersRef.current[layer.id];
			if (!layerCanvas) continue;
			dCtx.save();
			dCtx.globalAlpha = layer.opacity / 100;
			dCtx.drawImage(layerCanvas, 0, 0, CANVAS_W, CANVAS_H);
			dCtx.restore();
		}
	}, [
		layers,
		mode,
		peekOriginal,
		traceOpacity
	]);
	(0, import_react.useEffect)(() => {
		setStrokeSize(mode === "mask" ? 28 : 3);
		setTool("pen");
		setActiveStampId(null);
		setSamMode("off");
		setPeekOriginal(false);
		setTraceOpacity(mode === "mask" ? 100 : 45);
		if (mode === "mask") setActiveLayerId("mask-layer");
		else if (!layers.some((l) => l.id === activeLayerId)) setActiveLayerId(layers[0]?.id ?? DEFAULT_LAYERS[0].id);
	}, [mode]);
	(0, import_react.useEffect)(() => {
		if (!backgroundUrl || mode !== "sketch") {
			traceImgRef.current = null;
			compositeDisplay();
			return;
		}
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			traceImgRef.current = img;
			compositeDisplay();
		};
		img.onerror = () => {
			traceImgRef.current = null;
			compositeDisplay();
		};
		img.src = backgroundUrl;
	}, [
		backgroundUrl,
		mode,
		compositeDisplay
	]);
	(0, import_react.useEffect)(() => {
		compositeDisplay(layers, traceOpacity);
	}, [
		layers,
		traceOpacity,
		mode,
		peekOriginal,
		compositeDisplay
	]);
	(0, import_react.useEffect)(() => {
		if (initialBufferUrl && initialBufferUrl === lastSavedBufferRef.current) return;
		const targetId = mode === "mask" ? "mask-layer" : layers[0]?.id ?? DEFAULT_LAYERS[0].id;
		const ctx = ensureOffscreenLayer(targetId).getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		if (mode === "mask") {
			ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
			undoStacksRef.current[targetId] = [];
		}
		if (initialBufferUrl) {
			const img = new Image();
			img.onload = () => {
				ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
				ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
				setHasStrokes(true);
				compositeDisplay();
			};
			img.src = initialBufferUrl;
		} else {
			if (mode === "mask") {
				setHasStrokes(false);
				setSamPosPoints([]);
				setSamNegPoints([]);
			}
			compositeDisplay();
		}
	}, [initialBufferUrl, mode]);
	function getPoint(clientX, clientY) {
		const canvas = displayCanvasRef.current;
		if (!canvas) return {
			x: 0,
			y: 0,
			xNorm: .5,
			yNorm: .5
		};
		const rect = canvas.getBoundingClientRect();
		const xNorm = Math.max(0, Math.min(1, (clientX - rect.left) / Math.max(1, rect.width)));
		const yNorm = Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
		return {
			x: xNorm * CANVAS_W,
			y: yNorm * CANVAS_H,
			xNorm,
			yNorm
		};
	}
	function pushUndoSnapshot() {
		const ctx = ensureOffscreenLayer(currentCanvasId).getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const stack = undoStacksRef.current[currentCanvasId] ?? [];
		undoStacksRef.current[currentCanvasId] = [...stack.slice(-14), ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)];
	}
	function applyStrokeStyle(ctx) {
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.lineWidth = strokeSize;
		if (tool === "eraser") {
			ctx.globalCompositeOperation = "destination-out";
			ctx.strokeStyle = "rgba(0,0,0,1)";
		} else if (mode === "mask") {
			ctx.globalCompositeOperation = "source-over";
			ctx.strokeStyle = "rgba(212, 176, 106, 0.72)";
		} else {
			ctx.globalCompositeOperation = "source-over";
			ctx.strokeStyle = inkColor;
		}
	}
	function flattenVisibleLayersDataUrl(layerList = layers) {
		if (mode === "mask") {
			const c = offscreenLayersRef.current["mask-layer"];
			return c ? c.toDataURL("image/png") : null;
		}
		const out = createOffscreenCanvas();
		const ctx = out.getContext("2d");
		if (!ctx) return null;
		for (const layer of layerList) {
			if (!layer.visible) continue;
			const c = offscreenLayersRef.current[layer.id];
			if (!c) continue;
			ctx.save();
			ctx.globalAlpha = layer.opacity / 100;
			ctx.drawImage(c, 0, 0, CANVAS_W, CANVAS_H);
			ctx.restore();
		}
		return out.toDataURL("image/png");
	}
	function commitBuffer(buf) {
		lastSavedBufferRef.current = buf;
		onSaveBuffer(buf);
	}
	async function handleSamCanvasClick(xNorm, yNorm) {
		const src = backgroundUrl || "/viz/t03-compact-living-room.jpg";
		if (samMode === "neg" && samPosPoints.length === 0) {
			toast.message("Add at least one + Include click before subtracting.");
			return;
		}
		const nextPos = samMode === "pos" ? [...samPosPoints, {
			xNorm,
			yNorm
		}] : samPosPoints;
		const nextNeg = samMode === "neg" ? [...samNegPoints, {
			xNorm,
			yNorm
		}] : samNegPoints;
		setSamPosPoints(nextPos);
		setSamNegPoints(nextNeg);
		setSamBusy(true);
		try {
			const res = await runInteractiveSamMultiPointMask({
				src,
				posPoints: nextPos,
				negPoints: nextNeg,
				threshold: engine.samThreshold
			});
			const layerCanvas = ensureOffscreenLayer("mask-layer");
			const ctx = layerCanvas.getContext("2d", { willReadFrequently: true });
			if (ctx) {
				pushUndoSnapshot();
				const mImg = new Image();
				mImg.onload = () => {
					ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
					ctx.drawImage(mImg, 0, 0, CANVAS_W, CANVAS_H);
					setHasStrokes(res.coveragePct > 0);
					compositeDisplay();
					commitBuffer(res.coveragePct > 0 ? layerCanvas.toDataURL("image/png") : null);
				};
				mImg.src = res.maskDataUrl;
			}
			toast.success(`MobileSAM updated (${res.coveragePct}% mask)`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "SAM click segmentation failed.");
		} finally {
			setSamBusy(false);
		}
	}
	function onPointerDown(e) {
		const display = displayCanvasRef.current;
		const ctx = ensureOffscreenLayer(currentCanvasId).getContext("2d", { willReadFrequently: true });
		if (!display || !ctx) return;
		const pt = getPoint(e.clientX, e.clientY);
		if (mode === "mask" && samMode !== "off") {
			handleSamCanvasClick(pt.xNorm, pt.yNorm);
			return;
		}
		if (mode === "sketch" && activeStampId) {
			const item = ENTOURAGE_CATALOG.find((c) => c.id === activeStampId);
			if (item) {
				pushUndoSnapshot();
				drawEntourageStampOnCanvas(ctx, item, pt.x, pt.y);
				const placed = {
					id: `ent-${Date.now()}`,
					catalogId: item.id,
					label: item.label,
					xNorm: Number(pt.xNorm.toFixed(3)),
					yNorm: Number(pt.yNorm.toFixed(3)),
					scale: 1
				};
				setEntourageItems([...entourageItems, placed]);
				setHasStrokes(true);
				compositeDisplay();
				commitBuffer(flattenVisibleLayersDataUrl());
				toast.success(`Stamped "${item.label}" onto sketch layer`);
				return;
			}
		}
		display.setPointerCapture(e.pointerId);
		pushUndoSnapshot();
		drawingRef.current = true;
		startPtRef.current = pt;
		if (tool === "line" || tool === "rect") snapshotBeforeShapeRef.current = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
		else {
			applyStrokeStyle(ctx);
			ctx.beginPath();
			ctx.moveTo(pt.x, pt.y);
			ctx.lineTo(pt.x + .01, pt.y + .01);
			ctx.stroke();
			compositeDisplay();
		}
	}
	function onPointerMove(e) {
		if (!drawingRef.current) return;
		const ctx = ensureOffscreenLayer(currentCanvasId).getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const pt = getPoint(e.clientX, e.clientY);
		if (tool === "line" || tool === "rect") {
			if (snapshotBeforeShapeRef.current) ctx.putImageData(snapshotBeforeShapeRef.current, 0, 0);
			const start = startPtRef.current ?? pt;
			applyStrokeStyle(ctx);
			ctx.beginPath();
			if (tool === "line") {
				ctx.moveTo(start.x, start.y);
				ctx.lineTo(pt.x, pt.y);
				ctx.stroke();
			} else ctx.strokeRect(start.x, start.y, pt.x - start.x, pt.y - start.y);
		} else {
			applyStrokeStyle(ctx);
			ctx.lineTo(pt.x, pt.y);
			ctx.stroke();
		}
		compositeDisplay();
	}
	function onPointerUp() {
		if (!drawingRef.current) return;
		drawingRef.current = false;
		startPtRef.current = null;
		snapshotBeforeShapeRef.current = null;
		setHasStrokes(true);
		commitBuffer(flattenVisibleLayersDataUrl());
	}
	function handleUndo() {
		const ctx = ensureOffscreenLayer(currentCanvasId).getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const prev = (undoStacksRef.current[currentCanvasId] ?? []).pop();
		if (!prev) return;
		ctx.putImageData(prev, 0, 0);
		compositeDisplay();
		commitBuffer(flattenVisibleLayersDataUrl());
	}
	function handleClear() {
		const ctx = ensureOffscreenLayer(currentCanvasId).getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		pushUndoSnapshot();
		ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
		compositeDisplay();
		if (mode === "mask") {
			setHasStrokes(false);
			setSamPosPoints([]);
			setSamNegPoints([]);
			commitBuffer(null);
		} else {
			setEntourageItems([]);
			commitBuffer(flattenVisibleLayersDataUrl());
		}
	}
	function handleTaskSelect(taskId) {
		setEngineField("iopaintTask", taskId);
		const taskMeta = IOPAINT_TASKS.find((t) => t.id === taskId);
		if (taskMeta) setEngineField("iopaintModel", taskMeta.defaultModel);
	}
	function handleDownloadCurrent() {
		const url = backgroundUrl;
		if (!url) {
			toast.message("Load or render an image first to download.");
			return;
		}
		const a = document.createElement("a");
		a.href = url;
		a.download = `oriel-iopaint-${engine.iopaintTask}-${Date.now()}.png`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		toast.success("Downloaded current IOPaint image");
	}
	function addLayer() {
		if (layers.length >= 6) return;
		const id = `layer-${Date.now()}`;
		const next = {
			id,
			name: `Layer ${layers.length + 1}`,
			visible: true,
			opacity: 100
		};
		ensureOffscreenLayer(id);
		setLayers((prev) => [...prev, next]);
		setActiveLayerId(id);
	}
	function toggleLayerVisibility(id) {
		const next = layers.map((l) => l.id === id ? {
			...l,
			visible: !l.visible
		} : l);
		setLayers(next);
		compositeDisplay(next, traceOpacity);
		commitBuffer(flattenVisibleLayersDataUrl(next));
	}
	function removeLayer(id) {
		if (layers.length <= 1) return;
		const next = layers.filter((l) => l.id !== id);
		setLayers(next);
		if (activeLayerId === id && next[0]) setActiveLayerId(next[0].id);
		delete offscreenLayersRef.current[id];
		delete undoStacksRef.current[id];
		compositeDisplay(next, traceOpacity);
		commitBuffer(flattenVisibleLayersDataUrl(next));
	}
	function exportSketchComposite() {
		if (!onLockToSource) return;
		const out = createOffscreenCanvas();
		const ctx = out.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "#faf6ee";
		ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
		const finalize = () => {
			for (const layer of layers) {
				if (!layer.visible) continue;
				const c = offscreenLayersRef.current[layer.id];
				if (!c) continue;
				ctx.save();
				ctx.globalAlpha = layer.opacity / 100;
				ctx.drawImage(c, 0, 0, CANVAS_W, CANVAS_H);
				ctx.restore();
			}
			onLockToSource(out.toDataURL("image/jpeg", .92));
		};
		if (backgroundUrl && traceOpacity > 0) {
			const bg = new Image();
			bg.crossOrigin = "anonymous";
			bg.onload = () => {
				ctx.save();
				ctx.globalAlpha = traceOpacity / 100;
				ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
				ctx.restore();
				finalize();
			};
			bg.onerror = finalize;
			bg.src = backgroundUrl;
		} else finalize();
	}
	const activeLayerObj = layers.find((l) => l.id === activeLayerId);
	const shownBg = mode === "mask" ? peekOriginal && upload ? upload : backgroundUrl : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": mode === "sketch" ? "sketch-canvas-stage" : "mask-canvas-stage",
		className: cn("relative w-full overflow-hidden", mode === "sketch" ? "bg-[#f7f2e8]" : "bg-[#181613]"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full overflow-hidden",
			style: {
				aspectRatio: aspect,
				minHeight: mode === "mask" ? "330px" : "380px",
				maxHeight: mode === "mask" ? "52vh" : "64vh"
			},
			children: [
				mode === "mask" && shownBg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: shownBg,
					alt: "Base plate for IOPaint mask",
					className: "pointer-events-none absolute inset-0 h-full w-full object-contain"
				}) : mode === "mask" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 p-4 text-center text-xs text-[#cbbba6]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Load an architectural scene to erase clutter, inpaint finishes, outpaint borders, or run RemoveBG." }), onLoadSampleSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onLoadSampleSource("/viz/t03-compact-living-room.jpg"),
						className: "gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-[#2a1c0c]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Load Sample Scene"]
					}) : null]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: displayCanvasRef,
					width: CANVAS_W,
					height: CANVAS_H,
					onPointerDown,
					onPointerMove,
					onPointerUp,
					onPointerCancel: onPointerUp,
					className: cn("relative z-10 block h-full w-full touch-none", mode === "mask" && samMode !== "off" ? "cursor-cell" : activeStampId ? "cursor-copy" : "cursor-crosshair")
				}),
				mode === "mask" && !peekOriginal && (samPosPoints.length > 0 || samNegPoints.length > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute inset-0 z-20",
					children: [samPosPoints.map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							left: `${pt.xNorm * 100}%`,
							top: `${pt.yNorm * 100}%`
						},
						className: "absolute -translate-x-1/2 -translate-y-1/2 grid size-4 place-items-center rounded-full border border-white bg-emerald-500 text-[10px] font-bold text-white shadow",
						children: "+"
					}, `pos-${i}`)), samNegPoints.map((pt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							left: `${pt.xNorm * 100}%`,
							top: `${pt.yNorm * 100}%`
						},
						className: "absolute -translate-x-1/2 -translate-y-1/2 grid size-4 place-items-center rounded-full border border-white bg-rose-500 text-[10px] font-bold text-white shadow",
						children: "-"
					}, `neg-${i}`))]
				}) : null,
				mode === "mask" && backgroundUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": peekOriginal,
						onClick: () => setPeekOriginal((v) => !v),
						className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium shadow-md transition", peekOriginal ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/20 bg-[#14110f]/90 text-[#f6efe4] hover:border-[#d4b06a]"),
						children: [peekOriginal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3 text-[#e7c27a]" }), peekOriginal ? "Viewing Original" : "Compare Original"]
					}), samBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-[#d4b06a]/50 bg-[#14110f]/90 px-2.5 py-0.5 text-[10px] text-[#e7c27a]",
						children: "MobileSAM segmenting…"
					}) : null]
				}) : null,
				mode === "sketch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 left-3 z-20 flex max-w-[calc(100%-132px)] flex-wrap items-center gap-1 rounded-2xl border border-white/15 bg-[#14110f]/92 px-2 py-1 text-[10px] text-[#f6efe4] shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex shrink-0 items-center gap-1 px-1.5 font-medium text-[#e7c27a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { className: "size-3" }), " Entourage"]
					}), ENTOURAGE_CATALOG.map((item) => {
						const active = activeStampId === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": active,
							onClick: () => setActiveStampId(active ? null : item.id),
							className: cn("inline-flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 transition", active ? "gold-fill border-transparent font-semibold text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.glyph }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
						}, item.id);
					})]
				}) : null,
				mode === "sketch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setLayersOpen((v) => !v),
						className: "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-[#14110f]/92 px-3 text-[11px] font-medium text-[#f6efe4] shadow-md hover:border-[#d4b06a]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-[#e7c27a]" }),
							"Layers (",
							layers.length,
							")"
						]
					}), layersOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-56 rounded-2xl border border-white/15 bg-[#14110f]/95 p-2.5 text-[11px] text-[#f6efe4] shadow-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-[#e7c27a]",
									children: "Sketch Layers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: addLayer,
									disabled: layers.length >= 6,
									className: "inline-flex h-6 items-center gap-1 rounded-full bg-white/10 px-2 text-[10px] hover:bg-white/20 disabled:opacity-40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Add Layer"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("flex items-center gap-1.5 rounded-xl border px-2 py-1 transition", activeLayerId === layer.id ? "border-[#e7c27a] bg-white/10" : "border-white/10 bg-black/25"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => toggleLayerVisibility(layer.id),
											"aria-label": `${layer.visible ? "Hide" : "Show"} ${layer.name}`,
											className: "text-[#cbbba6] hover:text-white",
											children: layer.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5 opacity-50" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setActiveLayerId(layer.id),
											className: "min-w-0 flex-1 truncate text-left font-medium",
											children: layer.name
										}),
										layers.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeLayer(layer.id),
											"aria-label": `Delete ${layer.name}`,
											className: "text-[#cbbba6] hover:text-rose-300",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
										}) : null
									]
								}, layer.id))
							}),
							activeLayerObj ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 flex items-center gap-2 border-t border-white/10 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[10px] text-[#cbbba6]",
										children: "Opacity"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 10,
										max: 100,
										value: activeLayerObj.opacity,
										onChange: (e) => {
											const val = Number(e.target.value);
											const next = layers.map((l) => l.id === activeLayerObj.id ? {
												...l,
												opacity: val
											} : l);
											setLayers(next);
											compositeDisplay(next, traceOpacity);
										},
										className: "h-1 flex-1 accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-7 text-right font-mono text-[10px]",
										children: [activeLayerObj.opacity, "%"]
									})
								]
							}) : null
						]
					}) : null]
				}) : null,
				mode === "sketch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-3 bottom-3 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/15 bg-[#14110f]/95 px-3 py-2 text-xs text-[#f6efe4] shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							[
								[
									"pen",
									"Pen",
									Pencil
								],
								[
									"line",
									"Line",
									Minus
								],
								[
									"rect",
									"Box",
									Square
								],
								[
									"eraser",
									"Erase",
									Eraser
								]
							].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setActiveStampId(null);
									setTool(id);
								},
								className: cn("inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] transition", tool === id && !activeStampId ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb] hover:bg-white/15"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), label]
							}, id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-1 flex items-center gap-1",
								children: INK_SWATCHES.map(([hex, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": label,
									title: label,
									onClick: () => {
										setActiveStampId(null);
										setInkColor(hex);
										if (tool === "eraser") setTool("pen");
									},
									className: cn("size-5 rounded-full border transition", inkColor === hex && tool !== "eraser" && !activeStampId ? "scale-110 border-[#e7c27a] ring-2 ring-[#e7c27a]/60" : "border-white/30"),
									style: { backgroundColor: hex }
								}, hex))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-1 flex items-center gap-0.5 rounded-full bg-white/5 p-0.5",
								children: WEIGHT_PRESETS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStrokeSize(w),
									className: cn("h-6 rounded-full px-1.5 font-mono text-[10px]", strokeSize === w ? "gold-fill text-[#2a1c0c]" : "text-[#cbbba6]"),
									children: [w, "px"]
								}, w))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "ml-1.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-[#cbbba6]",
									children: "Weight"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1,
									max: 24,
									value: strokeSize,
									onChange: (e) => setStrokeSize(Number(e.target.value)),
									className: "h-1.5 w-14 accent-[#d4b06a]"
								})]
							}),
							backgroundUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "ml-1.5 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-[#cbbba6]",
									children: "Trace"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 90,
									value: traceOpacity,
									onChange: (e) => setTraceOpacity(Number(e.target.value)),
									className: "h-1.5 w-14 accent-[#d4b06a]"
								})]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleUndo,
								className: "inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), " Undo"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleClear,
								className: "inline-flex h-8 shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Clear Layer"]
							}),
							onLockToSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: exportSketchComposite,
								className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Lock & Render Sketch"]
							}) : null
						]
					})]
				}) : null
			]
		}), mode === "mask" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-testid": "iopaint-control-deck",
			className: "space-y-2 border-t border-white/10 bg-[#14110f] px-3 py-2.5 text-xs text-[#f6efe4]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1 font-mono text-[10px] tracking-wider text-[#e7c27a] uppercase",
							children: "IOPaint"
						}), IOPAINT_TASKS.map((t) => {
							const active = engine.iopaintTask === t.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": active,
								title: t.hint,
								onClick: () => handleTaskSelect(t.id),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition", active ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("text-[9px]", active ? "text-[#2a1c0c]/75" : "text-[#e7c27a]"),
									children: ["· ", t.badge]
								})]
							}, t.id);
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-1.5 text-[11px] text-[#cbbba6]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Model" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "IOPaint Model",
									value: engine.iopaintModel,
									onChange: (e) => setEngineField("iopaintModel", e.target.value),
									className: "h-7 rounded-full border border-white/20 bg-black/50 px-2.5 text-[11px] text-[#f6efe4] outline-none focus:border-[#d4b06a]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "Erase (Object Removal)",
										children: IOPAINT_MODELS.filter((m) => m.group === "erase").map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: m.id,
											children: m.label
										}, m.id))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: "Diffusion & Editing",
										children: IOPAINT_MODELS.filter((m) => m.group === "diffusion").map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: m.id,
											children: m.label
										}, m.id))
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": samMode === "pos",
								onClick: () => setSamMode((m) => m === "pos" ? "off" : "pos"),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]", samMode === "pos" ? "border-emerald-400 bg-emerald-500/20 text-emerald-200" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3" }), " SAM +"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": samMode === "neg",
								onClick: () => setSamMode((m) => m === "neg" ? "off" : "neg"),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]", samMode === "neg" ? "border-rose-400 bg-rose-500/20 text-rose-200" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3" }), " SAM -"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setSamMode("off");
									setTool("pen");
								},
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]", tool !== "eraser" && samMode === "off" ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3" }), " Brush"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setSamMode("off");
									setTool("eraser");
								},
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px]", tool === "eraser" && samMode === "off" ? "gold-fill text-[#2a1c0c]" : "bg-white/10 text-[#e4dacb]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { className: "size-3" }), " Eraser"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "ml-1 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-[#cbbba6]",
									children: "Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 10,
									max: 64,
									value: strokeSize,
									onChange: (e) => setStrokeSize(Number(e.target.value)),
									className: "h-1 w-14 accent-[#d4b06a]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "ml-1 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-[#cbbba6]",
									children: [
										"Dilate +",
										engine.iopaintMaskDilate,
										"px"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 24,
									value: engine.iopaintMaskDilate,
									onChange: (e) => setEngineField("iopaintMaskDilate", Number(e.target.value)),
									className: "h-1 w-14 accent-[#d4b06a]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": engine.iopaintInvertMask,
								onClick: () => setEngineField("iopaintInvertMask", !engine.iopaintInvertMask),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px]", engine.iopaintInvertMask ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, { className: "size-3" }), " Invert Mask"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleUndo,
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Undo"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleClear,
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/10 px-2.5 text-[11px] text-[#e4dacb] hover:bg-white/15",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Clear"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: engine.iopaintTask === "outpaint" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							[
								"top",
								"right",
								"bottom",
								"left"
							].map((edge) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex items-center gap-1 text-[10px] text-[#cbbba6]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase",
									children: edge[0]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									max: 320,
									step: 16,
									value: engine.iopaintOutpaintPad[edge],
									onChange: (e) => setEngineField("iopaintOutpaintPad", {
										...engine.iopaintOutpaintPad,
										[edge]: Number(e.target.value)
									}),
									className: "h-7 w-13 rounded-full border border-white/20 bg-black/50 px-2 text-center font-mono text-[11px] text-white outline-none focus:border-[#d4b06a]"
								})]
							}, edge)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEngineField("iopaintOutpaintPad", {
									top: 96,
									right: 128,
									bottom: 96,
									left: 128
								}),
								className: "inline-flex h-7 shrink-0 items-center rounded-full border border-white/15 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]",
								children: "+All Preset"
							}),
							onApplyDirectionalOutpaint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => onApplyDirectionalOutpaint(engine.iopaintOutpaintPad),
								className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "size-3.5" }), " Apply Outpaint Pad"]
							}) : null
						] }) : engine.iopaintTask === "anytext" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "size-3 text-[#e7c27a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: engine.iopaintAnyText,
								onChange: (e) => setEngineField("iopaintAnyText", e.target.value),
								placeholder: "Signage text in mask...",
								className: "h-7 w-40 bg-transparent text-[11px] text-white outline-none placeholder:text-white/45"
							})]
						}), onApplyMaskInpaint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !hasStrokes || busy,
							onClick: () => onApplyMaskInpaint(engine.iopaintAnyText || maskInstruction),
							className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "size-3.5" }), " Render AnyText"]
						}) : null] }) : engine.iopaintTask === "paint-by-example" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1",
							children: [EXAMPLE_INSERT_SWATCHES.map((sw) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setEngineField("iopaintExampleUrl", sw.url),
								className: cn("inline-flex h-7 shrink-0 items-center rounded-full border px-2 text-[10px]", engine.iopaintExampleUrl === sw.url ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb]"),
								children: sw.label
							}, sw.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex h-7 cursor-pointer items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2.5 text-[10px] text-[#e4dacb] hover:border-[#d4b06a]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }),
									" Ref",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "sr-only",
										onChange: (e) => {
											const f = e.target.files?.[0];
											if (f) readImage(f, 1024).then((url) => setEngineField("iopaintExampleUrl", url));
											e.target.value = "";
										}
									})
								]
							})]
						}), onApplyMaskInpaint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !hasStrokes || busy,
							onClick: () => onApplyMaskInpaint(maskInstruction || "Insert example object seamlessly"),
							className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), " Insert By Example"]
						}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: maskInstruction,
							onChange: (e) => setMaskInstruction(e.target.value),
							placeholder: engine.iopaintTask === "erase" ? "Optional erase note (e.g. person, car, cable)..." : "Replace inside mask (e.g. travertine wall)...",
							className: "h-7 w-48 rounded-full border border-white/20 bg-black/40 px-3 text-[11px] text-white outline-none placeholder:text-white/45 focus:border-[#d4b06a]"
						}), onApplyMaskInpaint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !hasStrokes || busy,
							onClick: () => onApplyMaskInpaint(maskInstruction),
							className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
								" ",
								engine.iopaintTask === "erase" ? "Apply Erase" : "Apply Replace"
							]
						}) : null] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-1.5 border-t border-white/10 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] tracking-wider text-[#cbbba6] uppercase",
								children: "Plugins"
							}),
							onApplyRemoveBg ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => onApplyRemoveBg("cutout"),
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#e7c27a]" }), " RemoveBG Cutout"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: () => onApplyRemoveBg("mask"),
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#e7c27a]" }), " RemoveBG → Mask"]
							})] }) : null,
							onApplyRestoreFaces ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: onApplyRestoreFaces,
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3 text-[#e7c27a]" }),
									" Restore Faces (",
									engine.iopaintFaceModel.toUpperCase(),
									")"
								]
							}) : null,
							onApplyEsrganPlugin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: busy,
								onClick: onApplyEsrganPlugin,
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] disabled:opacity-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-[#e7c27a]" }),
									" Real-ESRGAN ",
									engine.upscaleFactor,
									"×"
								]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleDownloadCurrent,
						className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#d4b06a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 text-[#e7c27a]" }), " Save PNG"]
					})]
				})
			]
		}) : null]
	});
}
function StudioHeadControls({ activeIntent, onSelectIntent, activeStudio, showingSplitHub, onEnableSplitHub, view, onOpenStage, stagePhases, contractOpen, onToggleContract, onOpenGateModal, inspectorCollapsed, onToggleInspector, hasPlate, hasSource, canCompare = false, onToggleCompare, onTriggerUpload, busy, onRelightDusk, onOutpaintWide, onUpscale4x, onOpenPublish, onExportBundle, onOpenVision }) {
	const splitViewMode = useOriel((s) => s.splitViewMode);
	const setSplitViewMode = useOriel((s) => s.setSplitViewMode);
	const engine = useOriel((s) => s.engine);
	const setEngineField = useOriel((s) => s.setEngineField);
	const design = useOriel((s) => s.design);
	const setDesignField = useOriel((s) => s.setDesignField);
	const idea = useOriel((s) => s.idea);
	const setIdea = useOriel((s) => s.setIdea);
	const designContract = useOriel((s) => s.designContract);
	const fidelityReport = useOriel((s) => s.fidelityReport);
	const [deckOpen, setDeckOpen] = (0, import_react.useState)(false);
	const [mas2dMode, setMas2dMode] = (0, import_react.useState)(() => view === "sketch" ? "compose" : "edit");
	const [paletteDrawer, setPaletteDrawer] = (0, import_react.useState)("none");
	const deckRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!deckOpen) return;
		function onPointerDown(event) {
			if (deckRef.current && !deckRef.current.contains(event.target)) setDeckOpen(false);
		}
		function onKeyDown(event) {
			if (event.key === "Escape") setDeckOpen(false);
		}
		window.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [deckOpen]);
	const filteredMaterials = (0, import_react.useMemo)(() => PRD_MATERIAL_PALETTE.filter((m) => m.space === design.vertical || paletteDrawer === "materials").slice(0, 8), [design.vertical, paletteDrawer]);
	const filteredLights = (0, import_react.useMemo)(() => PRD_LIGHT_PALETTE.filter((l) => l.space === design.vertical || l.space === "exterior").slice(0, 8), [design.vertical]);
	const stageLabel = stagePhases.flatMap((g) => g.tabs).find((t) => t.id === view)?.label ?? (showingSplitHub ? "Split" : "Stage");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center justify-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Architectural Workflow Stepper",
				"data-testid": "workflow-intent-bar",
				className: "hidden shrink-0 items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/80 p-0.5 md:flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29]/90",
				children: WORKFLOW_INTENTS.map((item) => {
					const isActive = activeIntent === item.id && view !== "compare";
					const shortName = item.id === "render" ? "Scene" : item.id === "3d" ? "3D" : item.id === "edit" ? "Edit" : item.id === "enhance" ? "Enhance" : "360°";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": `intent-tab-${item.id}`,
						"aria-pressed": isActive,
						title: item.hint,
						onClick: () => onSelectIntent(item.id),
						className: cn("inline-flex h-6.5 shrink-0 items-center whitespace-nowrap rounded-full px-1.5 text-[10px] font-medium transition 2xl:px-2", isActive ? "bg-[#c5a880] font-semibold text-[#281800] shadow-xs dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
						children: shortName
					}, item.id);
				})
			}),
			onTriggerUpload ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-testid": "header-upload-btn",
				onClick: onTriggerUpload,
				"aria-label": "Upload Photo or 3D GLB into Scene",
				title: "Upload Photo, Sketch, or 3D GLB/OBJ into Scene",
				className: "inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/85 px-2 text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8c98a] dark:hover:border-[#e8c98a]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden 2xl:inline",
					children: "Upload"
				})]
			}) : null,
			onToggleCompare ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"data-testid": "header-compare-btn",
				"aria-pressed": view === "compare",
				onClick: onToggleCompare,
				title: canCompare ? "Compare Uploaded Source vs Rendered Result" : "Compare Before/After (upload & render first)",
				className: cn("hidden h-7 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] font-semibold transition md:inline-flex", view === "compare" ? "border-[#725b38] bg-[#c5a880] text-[#281800] shadow-xs dark:border-[#e8c98a] dark:bg-[#e8c98a] dark:text-[#1b1407]" : canCompare ? "border-[#d1c5b8]/55 bg-white/85 text-[#1b1c1a] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]" : "border-[#d1c5b8]/40 bg-white/60 text-[#7f766a] hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#121c29] dark:text-[#7f9bb2]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden 2xl:inline",
					children: "Compare"
				})]
			}) : null,
			showingSplitHub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden shrink-0 items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 xl:flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29]",
				role: "group",
				"aria-label": "Split viewport mode",
				children: [
					{
						id: "split",
						label: "Split",
						full: "Split Canvas"
					},
					{
						id: "3d-solo",
						label: "3D",
						full: "3D Mesh Solo"
					},
					{
						id: "ai-solo",
						label: "AI",
						full: "AI Canvas Solo"
					}
				].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					title: mode.full,
					"aria-label": mode.full,
					"data-testid": `split-mode-${mode.id}`,
					onClick: () => setSplitViewMode(mode.id),
					className: cn("h-6 rounded-full px-1.5 text-[9.5px] font-semibold transition", splitViewMode === mode.id ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
					children: mode.label
				}, mode.id))
			}) : activeStudio === "mas-2d" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden shrink-0 items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 xl:flex dark:border-[#a9bdc9]/20 dark:bg-[#121c29]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMas2dMode("edit");
						onOpenStage("mask");
					},
					className: cn("h-6 rounded-full px-2 text-[9.5px] font-semibold transition", mas2dMode === "edit" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] dark:text-[#a9bdc9]"),
					children: "Edit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setMas2dMode("compose");
						onOpenStage("sketch");
					},
					className: cn("h-6 rounded-full px-2 text-[9.5px] font-semibold transition", mas2dMode === "compose" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] dark:text-[#a9bdc9]"),
					children: "Compose"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "open-fidelity-gate-btn",
						onClick: onOpenGateModal,
						title: "Open Architectural Fidelity Gate",
						className: "hidden h-7 shrink-0 items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 text-[10px] font-semibold text-emerald-700 transition hover:border-emerald-500/60 sm:inline-flex dark:text-emerald-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fidelityReport ? `${Math.round(fidelityReport.overallScore * 100)}%` : "Gate" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": "header-lock-seed-btn",
						"aria-pressed": engine.seedLocked,
						onClick: () => {
							setEngineField("seedLocked", !engine.seedLocked);
							toast.success(engine.seedLocked ? "Seed unlocked for fresh variations" : `Seed #${engine.seed} locked`);
						},
						"aria-label": engine.seedLocked ? "Unlock render seed" : "Lock render seed",
						title: engine.seedLocked ? `Seed #${engine.seed} locked — click to unlock` : `Lock seed #${engine.seed} for reproducible edits`,
						className: cn("hidden size-7 shrink-0 place-items-center rounded-full border transition lg:grid", engine.seedLocked ? "border-[#c5a880] bg-[#c5a880]/25 text-[#513d1d] dark:border-[#e8c98a] dark:bg-[#202b38] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/85 text-[#4d463c] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
						children: engine.seedLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-3" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": "header-toggle-inspector-btn",
						"aria-pressed": inspectorCollapsed,
						onClick: onToggleInspector,
						"aria-label": inspectorCollapsed ? "Show Right Preset Matrix Rail" : "Expand Wide Canvas",
						title: inspectorCollapsed ? "Show Preset Matrix & Optics Rail" : "Collapse Rail for Wide Canvas",
						className: cn("hidden size-7 shrink-0 place-items-center rounded-full border transition lg:grid", inspectorCollapsed ? "border-[#725b38] bg-[#c5a880]/25 text-[#513d1d] dark:border-[#e8c98a] dark:bg-[#202b38] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/85 text-[#4d463c] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]"),
						children: inspectorCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightOpen, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightClose, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: deckRef,
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "studio-command-menu-btn",
							"aria-expanded": deckOpen,
							onClick: () => setDeckOpen((v) => !v),
							title: "Open Stages, Palettes, Relight/Outpaint/Upscale & Export Deck",
							className: cn("inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-1.5 text-[10px] font-semibold transition 2xl:px-2", deckOpen ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:bg-[#202b38] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/85 text-[#1b1c1a] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-500" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden 2xl:inline",
									children: showingSplitHub || view === "compare" ? "Deck" : stageLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-3 transition-transform", deckOpen ? "rotate-180" : "") })
							]
						}), deckOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": "studio-command-deck",
							className: "arctic-glass-z2 fixed top-14 right-2 left-2 z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-2xl p-3.5 text-xs text-[#1b1c1a] shadow-2xl sm:absolute sm:top-10 sm:right-0 sm:left-auto sm:w-[500px] dark:text-[#e8eff3]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 border-b border-[#d1c5b8]/35 pb-2.5 dark:border-[#a9bdc9]/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 rounded-full bg-[#efeeea] px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 animate-pulse rounded-full bg-[#725b38] dark:bg-[#e8c98a]" }), "SAM 3D • RUNNING"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] text-[#4d463c] dark:text-[#a9bdc9]",
											children: "38ms · 18.4/24 GB"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													onToggleContract();
													setDeckOpen(false);
												},
												className: cn("inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium", contractOpen ? "border-[#725b38] bg-[#c5a880]/20 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"),
												title: "Inspect Design Contract (Here is what I see)",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }),
													"Rung ",
													designContract.rung.rung,
													" · ",
													designContract.rung.badge
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setEngineField("liveStreamEnabled", !engine.liveStreamEnabled);
													toast.success(!engine.liveStreamEnabled ? "Synchronized 3D camera frustum with AI viewport" : "Paused live camera frustum sync");
												},
												className: cn("inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-medium", engine.liveStreamEnabled ? "border-[#c5a880] bg-[#c5a880]/20 text-[#725b38] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
												title: "Synchronize Camera Frustum",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3" }), "Sync"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "freeze-mood-seed-btn",
												"aria-pressed": engine.seedLocked,
												onClick: () => {
													const nextLocked = !engine.seedLocked;
													setEngineField("seedLocked", nextLocked);
													if (nextLocked && engine.geometryLock < 90) setEngineField("geometryLock", 92);
													toast.success(nextLocked ? `Mood & Seed #${engine.seed} locked for consistent revisions` : "Seed unlocked for exploration");
												},
												className: cn("inline-flex h-7 items-center gap-1 rounded-full border px-2 text-[10px] font-medium", engine.seedLocked ? "border-[#c5a880] bg-[#c5a880]/20 text-[#513d1d] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]"),
												title: "Lock Mood & Seed",
												children: [engine.seedLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-3" }), engine.seedLocked ? "Locked" : "Seed"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "toggle-inspector-btn",
												onClick: () => {
													onToggleInspector();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2 text-[10px] font-medium text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
												title: inspectorCollapsed ? "Show Presets & Optics Rail" : "Wide Canvas (Hide Right Rail)",
												children: [inspectorCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightOpen, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRightClose, { className: "size-3" }), inspectorCollapsed ? "Show Rail" : "Wide"]
											}),
											showingSplitHub ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													onOpenStage(hasPlate ? "result" : "3d");
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2 text-[10px] font-medium text-[#4d463c] hover:text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
												title: "Open Classic Full Stage View",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3" }), " Full Stage"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													onEnableSplitHub();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-full bg-[#c5a880]/25 px-2 text-[10px] font-semibold text-[#513d1d] dark:bg-[#202b38] dark:text-[#cfe3f0]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { className: "size-3" }), " Split 3D+AI"]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 space-y-2 md:hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
										children: "Workflow Journey"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1",
										children: WORKFLOW_INTENTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												onSelectIntent(item.id);
												setDeckOpen(false);
											},
											className: cn("rounded-full px-2.5 py-1 text-[10px] font-medium", activeIntent === item.id ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea] text-[#4d463c] dark:bg-[#16202d] dark:text-[#a9bdc9]"),
											children: [
												item.step,
												". ",
												item.label
											]
										}, item.id))
									})]
								}),
								showingSplitHub ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 flex items-center justify-between gap-2 xl:hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
										children: "Viewport Split"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-1",
										children: [
											{
												id: "split",
												label: "Split Canvas"
											},
											{
												id: "3d-solo",
												label: "3D Mesh Solo"
											},
											{
												id: "ai-solo",
												label: "AI Canvas Solo"
											}
										].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setSplitViewMode(mode.id),
											className: cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", splitViewMode === mode.id ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea] text-[#4d463c] dark:bg-[#16202d] dark:text-[#a9bdc9]"),
											children: mode.label
										}, mode.id))
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 border-b border-[#d1c5b8]/35 pb-2.5 dark:border-[#a9bdc9]/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-1.5 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
											children: "Plate & Vision Actions"
										}), !hasPlate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
											children: "Render or upload to enable"
										}) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: busy || !hasPlate,
												onClick: () => {
													onRelightDusk();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMoon, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Relight Dusk"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: busy || !hasPlate,
												onClick: () => {
													onOutpaintWide();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Outpaint 21:9"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: busy || !hasPlate,
												onClick: () => {
													onUpscale4x();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
												children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), "Upscale 4×"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: !hasPlate,
												onClick: () => {
													onOpenPublish();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-xl bg-[#c5a880] px-2.5 text-[11px] font-semibold text-[#281800] disabled:opacity-45 dark:bg-[#e8c98a] dark:text-[#261a00]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }), " Publish"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: !hasPlate && !hasSource,
												onClick: () => {
													onExportBundle();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] disabled:opacity-45 dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Export Bundle"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "deck-nvidia-vision-btn",
												onClick: () => {
													onOpenVision();
													setDeckOpen(false);
												},
												className: "inline-flex h-7 items-center gap-1 rounded-xl border border-[#d1c5b8]/55 bg-white/85 px-2.5 text-[11px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanEye, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Vision AI"]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 space-y-1.5 border-b border-[#d1c5b8]/35 pb-2.5 dark:border-[#a9bdc9]/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
										children: "Stage Switcher"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid gap-1.5 sm:grid-cols-2",
										children: stagePhases.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[9px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#5f7f98]",
												children: group.phase
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1",
												children: group.tabs.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														tab.action();
														setDeckOpen(false);
													},
													className: cn("inline-flex h-6.5 items-center gap-1 rounded-lg px-2 text-[10px] font-medium transition", view === tab.id && !showingSplitHub ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea]/85 text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#16202d] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
													children: [tab.id === "360" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-2.5" }) : tab.id === "3d" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-2.5" }) : null, tab.label]
												}, tab.id))
											})]
										}, group.phase))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paintbrush, { className: "size-3" }), " MAS 2D & Palettes"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														"data-testid": "mas2d-materials-btn",
														onClick: () => setPaletteDrawer(paletteDrawer === "materials" ? "none" : "materials"),
														className: cn("inline-flex h-6.5 items-center gap-1 rounded-full border px-2 text-[10px] font-medium", paletteDrawer === "materials" ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Materials (CC0)"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														"data-testid": "mas2d-lights-btn",
														onClick: () => setPaletteDrawer(paletteDrawer === "lights" ? "none" : "lights"),
														className: cn("inline-flex h-6.5 items-center gap-1 rounded-full border px-2 text-[10px] font-medium", paletteDrawer === "lights" ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/80 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]"),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Lights (IES)"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => {
															onOpenStage("sam2");
															setDeckOpen(false);
														},
														className: "inline-flex h-6.5 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2 text-[10px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#cfe3f0]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Cutout & Pen"]
													})
												]
											})]
										}),
										paletteDrawer === "materials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-1.5",
											children: filteredMaterials.map((mat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setIdea(appendSuggestionToIdea(idea, mat.fragment));
													toast.success(`Injected ${mat.name} (${mat.source} ${mat.licence})`);
												},
												className: "flex items-center gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-1.5 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "size-5 shrink-0 rounded-md border border-black/15",
													style: { backgroundColor: mat.hex }
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate text-[10px] font-semibold",
														children: mat.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]",
														children: [
															mat.scaleMeters,
															" · ",
															mat.licence
														]
													})]
												})]
											}, mat.id))
										}) : null,
										paletteDrawer === "lights" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid grid-cols-2 gap-1.5",
											children: filteredLights.map((lp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setIdea(appendSuggestionToIdea(idea, lp.fragment));
													setDesignField("light", lp.lightField);
													toast.success(`Applied ${lp.name} (${lp.kelvin}K · ${lp.iesProfile})`);
												},
												className: "flex flex-col gap-0.5 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-1.5 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "truncate text-[10px] font-semibold",
														children: lp.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "shrink-0 font-mono text-[9px] text-[#725b38] dark:text-[#e8c98a]",
														children: [lp.kelvin, "K"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]",
													children: lp.iesProfile
												})]
											}, lp.id))
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setDeckOpen(false);
												document.getElementById("studio-properties")?.scrollIntoView({ behavior: "smooth" });
											},
											className: "inline-flex h-7 w-full items-center justify-center gap-1 rounded-xl border border-[#d1c5b8]/45 bg-[#efeeea]/80 text-[10px] font-semibold text-[#4d463c] lg:hidden dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#cfe3f0]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3" }), " Jump to Optics & Presets ↓"]
										})
									]
								})
							]
						}) : null]
					})
				]
			})
		]
	});
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
function WorkspacePage() {
	const design = useOriel((state) => state.design);
	const engine = useOriel((state) => state.engine);
	const idea = useOriel((state) => state.idea);
	const setIdea = useOriel((state) => state.setIdea);
	const frame = useOriel((state) => state.frame);
	const upload = useOriel((state) => state.upload);
	const setUpload = useOriel((state) => state.setUpload);
	const sketchDataUrl = useOriel((state) => state.sketchDataUrl);
	const setSketchDataUrl = useOriel((state) => state.setSketchDataUrl);
	const maskDataUrl = useOriel((state) => state.maskDataUrl);
	const setMaskDataUrl = useOriel((state) => state.setMaskDataUrl);
	const plate = useOriel((state) => state.plate);
	const variations = useOriel((state) => state.variations);
	const setPlate = useOriel((state) => state.setPlate);
	const activeStudio = useOriel((state) => state.activeStudio);
	const setActiveStudio = useOriel((state) => state.setActiveStudio);
	const fidelityReport = useOriel((state) => state.fidelityReport);
	const setTarget = useOriel((state) => state.setTarget);
	const setSelecting = useOriel((state) => state.setSelecting);
	const selecting = useOriel((state) => state.selecting);
	const applyWorkflowPreset = useOriel((state) => state.applyWorkflowPreset);
	const setEngineField = useOriel((state) => state.setEngineField);
	const publishToGallery = useOriel((state) => state.publishToGallery);
	const scene3d = useOriel((state) => state.scene3d);
	const searchStr = useRouterState({ select: (s) => s.location.searchStr });
	const { busy, generate, generateGrid, applyInpaint, segmentGroundedSam2, applyDirectionalOutpaint, applyRemoveBgPlugin, applyRestoreFacesPlugin, applyEnhance, applyRelight, applyOutpaint, runLiveDraftPreview } = useGenerate();
	const [view, setView] = (0, import_react.useState)(() => plate?.url ? "result" : "source");
	const [splitHubEnabled, setSplitHubEnabled] = (0, import_react.useState)(true);
	const [rightTab, setRightTab] = (0, import_react.useState)("matrix");
	const [samInitialMode, setSamInitialMode] = (0, import_react.useState)("off");
	const [nodeEditorMode, setNodeEditorMode] = (0, import_react.useState)("canvas");
	const [inspectorCollapsed, setInspectorCollapsed] = (0, import_react.useState)(false);
	const [enhanceBarOpen, setEnhanceBarOpen] = (0, import_react.useState)(false);
	const [enhanceScope, setEnhanceScope] = (0, import_react.useState)("image");
	const [enhanceEnv, setEnhanceEnv] = (0, import_react.useState)(() => defaultEnhanceEnvironmentForVertical(design.vertical));
	const [publishOpen, setPublishOpen] = (0, import_react.useState)(false);
	const [visionOpen, setVisionOpen] = (0, import_react.useState)(false);
	const [gateModalOpen, setGateModalOpen] = (0, import_react.useState)(false);
	const [contractOpen, setContractOpen] = (0, import_react.useState)(false);
	const headSlot = (0, import_react.useContext)(StudioHeadSlotContext);
	const [pubTitle, setPubTitle] = (0, import_react.useState)("");
	const [pubLocation, setPubLocation] = (0, import_react.useState)("Studio Commission");
	const [pubDiscipline, setPubDiscipline] = (0, import_react.useState)("Exterior");
	const [pubType, setPubType] = (0, import_react.useState)("Material Restyle");
	const fileRef = (0, import_react.useRef)(null);
	const scrollSectionRef = (0, import_react.useRef)(null);
	const didAutoShowHydratedPlateRef = (0, import_react.useRef)(false);
	const pins = GROUPS[design.vertical];
	const label = VERTICALS.find((item) => item.id === design.vertical)?.label ?? "Studio";
	const room = design.picks.room || design.picks.facade || design.picks.water || "Whole";
	const compareBeforeSrc = upload || sketchDataUrl || plate?.upload || null;
	const canCompare = Boolean(compareBeforeSrc && plate?.url);
	const aspect = frameAspect(frame.ratio);
	const aspectNumber = frameAspectNumber(frame.ratio);
	const activeIntent = resolveIntentFromStage(view, enhanceBarOpen);
	const heroSample = ATELIER_VERTICAL_HERO[design.vertical];
	(0, import_react.useEffect)(() => {
		if (!didAutoShowHydratedPlateRef.current && plate?.url && view === "source") {
			didAutoShowHydratedPlateRef.current = true;
			setView("result");
		}
	}, [plate?.url, view]);
	(0, import_react.useEffect)(() => {
		const controller = new AbortController();
		registerStudioTools(controller.signal);
		function onView(event) {
			const next = event.detail;
			if (next === "split") {
				didAutoShowHydratedPlateRef.current = true;
				setSplitHubEnabled(true);
				setView(useOriel.getState().plate?.url ? "result" : "source");
				return;
			}
			if (next === "source" || next === "3d" || next === "sketch" || next === "cv" || next === "sam2" || next === "mask" || next === "result" || next === "grid" || next === "compare" || next === "360" || next === "nodes") {
				didAutoShowHydratedPlateRef.current = true;
				setView(next);
			}
		}
		window.addEventListener("oriel-view", onView);
		return () => {
			controller.abort();
			window.removeEventListener("oriel-view", onView);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const sp = new URLSearchParams(searchStr);
		if (sp.get("pinInpaint") === "1") {
			didAutoShowHydratedPlateRef.current = true;
			setSplitHubEnabled(false);
			setView("mask");
			return;
		}
		if (sp.get("sam") === "1") {
			didAutoShowHydratedPlateRef.current = true;
			setSamInitialMode("pos");
			setView("sam2");
			return;
		}
		const stageParam = sp.get("stage");
		if (!stageParam) return;
		if (stageParam === "split") {
			didAutoShowHydratedPlateRef.current = true;
			setSplitHubEnabled(true);
			setView(useOriel.getState().plate?.url ? "result" : "source");
			return;
		}
		if (stageParam === "source" || stageParam === "3d" || stageParam === "sketch" || stageParam === "cv" || stageParam === "sam2" || stageParam === "mask" || stageParam === "result" || stageParam === "grid" || stageParam === "compare" || stageParam === "360" || stageParam === "nodes") {
			didAutoShowHydratedPlateRef.current = true;
			if (stageParam === "source" || stageParam === "result") setSplitHubEnabled(false);
			setView(stageParam);
		}
	}, [searchStr]);
	(0, import_react.useEffect)(() => {
		if (!engine.liveStreamEnabled) return;
		if (!sketchDataUrl && !upload) return;
		const timer = window.setTimeout(() => {
			runLiveDraftPreview();
		}, 450);
		return () => window.clearTimeout(timer);
	}, [
		engine.liveStreamEnabled,
		sketchDataUrl,
		scene3d.sunAzimuth,
		scene3d.sunElevation,
		scene3d.primaryMaterial,
		scene3d.preset,
		upload,
		runLiveDraftPreview
	]);
	function openExplicitStage(nextStage) {
		didAutoShowHydratedPlateRef.current = true;
		if (nextStage === "result" || nextStage === "source") setSplitHubEnabled(false);
		setView(nextStage);
	}
	function showCompare() {
		if (view === "compare") {
			setView(plate?.url ? "result" : "source");
			return;
		}
		if (!canCompare) {
			toast.message(compareBeforeSrc ? "Generate a plate, then compare it with the source." : "Capture a 3D snapshot, sketch, or upload a photo first.");
			return;
		}
		setSelecting(false);
		setSplitHubEnabled(false);
		setView("compare");
	}
	function cycleTargetElement() {
		const order = ["whole", ...pins.map((group) => group.id)];
		const nextTarget = order[(Math.max(order.indexOf(design.target), 0) + 1) % order.length];
		setTarget(nextTarget);
		const name = nextTarget === "whole" ? "the whole frame" : pins.find((group) => group.id === nextTarget)?.label ?? nextTarget;
		toast.message(`Editing ${name}`);
	}
	(0, import_react.useEffect)(() => {
		setEnhanceEnv(defaultEnhanceEnvironmentForVertical(design.vertical));
	}, [design.vertical]);
	(0, import_react.useEffect)(() => {
		function handlePaste(event) {
			const items = event.clipboardData?.items;
			if (!items) return;
			for (const item of Array.from(items)) if (item.type.startsWith("image/")) {
				const pastedFile = item.getAsFile();
				if (pastedFile) {
					event.preventDefault();
					onFile(pastedFile);
					toast.success("Image pasted from clipboard");
					return;
				}
			}
		}
		window.addEventListener("paste", handlePaste);
		return () => window.removeEventListener("paste", handlePaste);
	}, [frame.resolution]);
	async function onFile(file) {
		if (!file) return;
		const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
		if ([
			"glb",
			"gltf",
			"obj",
			"fbx"
		].includes(ext)) {
			setPending3DFile(file);
			setEnhanceBarOpen(false);
			setView("3d");
			toast.success(`Opening 3D Viewport with ${file.name}`);
			return;
		}
		try {
			setUpload(await readImage(file, frameEdge(frame.resolution)));
			setEnhanceBarOpen(false);
			setView("source");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not read that image.");
		}
	}
	function selectWorkflowIntent(intentId) {
		if (intentId === "render") {
			setEnhanceBarOpen(false);
			setView(plate?.url ? "result" : "source");
		} else if (intentId === "3d") {
			setEnhanceBarOpen(false);
			setActiveStudio("sam-3d");
			setSplitHubEnabled(true);
			setView("3d");
		} else if (intentId === "edit") {
			setEnhanceBarOpen(false);
			setActiveStudio("mas-2d");
			setView("sam2");
		} else if (intentId === "enhance") {
			setEnhanceBarOpen(true);
			setView(plate?.url ? "result" : "source");
			if (!plate?.url && !upload) toast.message("Upload or generate a render first, then pick Whole Image, Region, or People at 2× or 4×.");
		} else if (intentId === "spatial") {
			setEnhanceBarOpen(false);
			setActiveStudio("node-studio");
			setView("nodes");
		}
	}
	function exportLayeredBundle() {
		if (!(plate?.url ?? upload)) {
			toast.message("Upload a source or generate a plate before exporting.");
			return;
		}
		const manifest = {
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			layers: {
				baseSource: upload ?? null,
				enhancedPlate: plate?.url ?? null,
				inpaintMask: maskDataUrl ?? null
			},
			enhanceSettings: {
				scope: enhanceScope,
				environment: enhanceEnv,
				upscaleFactor: engine.upscaleFactor,
				directive: buildEnhanceDirective(enhanceScope, enhanceEnv, engine.upscaleFactor === 4 ? 4 : 2)
			},
			design,
			engine,
			frame,
			fidelityReport
		};
		const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `oriel-archviz-layered-bundle-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Exported multi-layer Studio bundle (Source + Result + Fidelity Gate)");
	}
	function handlePublishSubmit(event) {
		event.preventDefault();
		if (!plate?.url) {
			toast.message("Generate a plate before publishing to Gallery.");
			return;
		}
		const beforeImg = upload || sketchDataUrl || "/viz/p01-pavilion-day.jpg";
		publishToGallery({
			title: pubTitle.trim() || `${design.look} ${label} Study`,
			location: pubLocation.trim() || "Studio Archive",
			year: String((/* @__PURE__ */ new Date()).getFullYear()),
			discipline: pubDiscipline,
			comparisonType: pubType,
			beforeImage: beforeImg,
			afterImage: plate.url,
			beforeLabel: upload ? "Source / 3D Massing" : "Baseline",
			afterLabel: `Oriel (${design.look})`,
			summary: plate.idea || `${design.look} architectural visualization with ${design.light.toLowerCase()} lighting.`,
			materialsUsed: Object.values(design.picks).filter(Boolean).slice(0, 4),
			lightingTechnique: `${design.light} · ${design.time} · ${design.weather}`,
			aspect,
			promptBlueprint: plate.idea || `${design.look} ${design.vertical}, ${design.light}`,
			engineMeta: `${engine.workflowPreset} · Geo ${engine.geometryLock}% · Seed #${plate.seed ?? engine.seed}`
		});
		setPublishOpen(false);
		setPubTitle("");
		toast.success("Published to Project Gallery!");
	}
	const stagePhases = [
		{
			phase: "1. Input",
			tabs: [
				{
					id: "source",
					label: "Source",
					action: () => openExplicitStage("source")
				},
				{
					id: "3d",
					label: "3D Viewport",
					action: () => setView("3d")
				},
				{
					id: "sketch",
					label: "Sketch",
					action: () => setView("sketch")
				},
				{
					id: "cv",
					label: "Preprocess & SAM",
					action: () => setView("cv")
				}
			]
		},
		{
			phase: "2. Edit",
			tabs: [{
				id: "sam2",
				label: "SAM-2 Seg",
				action: () => setView("sam2")
			}, {
				id: "mask",
				label: "Inpaint",
				action: () => setView("mask")
			}]
		},
		{
			phase: "3. Output",
			tabs: [
				{
					id: "result",
					label: "Result",
					action: () => openExplicitStage("result")
				},
				{
					id: "grid",
					label: "4-Up Grid",
					action: () => setView("grid")
				},
				{
					id: "compare",
					label: "Compare",
					action: showCompare
				}
			]
		},
		{
			phase: "4. Spatial",
			tabs: [{
				id: "360",
				label: "360° Tour",
				action: () => {
					setActiveStudio("king-360");
					setView("360");
				}
			}, {
				id: "nodes",
				label: "Node Editor",
				action: () => {
					setActiveStudio("node-studio");
					setView("nodes");
				}
			}]
		}
	];
	const showingSplitHub = activeStudio === "sam-3d" && splitHubEnabled && (view === "source" || view === "result");
	const useTallStage = activeStudio === "king-360" && view === "360" || activeStudio === "kum-video" || view === "nodes";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex flex-1 min-h-0 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden",
		children: [
			headSlot ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioHeadControls, {
				activeIntent,
				onSelectIntent: selectWorkflowIntent,
				activeStudio,
				showingSplitHub,
				onEnableSplitHub: () => {
					setSplitHubEnabled(true);
					setView(plate?.url ? "result" : "source");
				},
				view,
				onOpenStage: openExplicitStage,
				stagePhases,
				contractOpen,
				onToggleContract: () => setContractOpen((v) => !v),
				onOpenGateModal: () => setGateModalOpen(true),
				inspectorCollapsed,
				onToggleInspector: () => setInspectorCollapsed((v) => !v),
				hasPlate: Boolean(plate?.url),
				hasSource: Boolean(upload),
				canCompare,
				onToggleCompare: showCompare,
				onTriggerUpload: () => fileRef.current?.click(),
				busy,
				onRelightDusk: () => void applyRelight("day-to-dusk"),
				onOutpaintWide: () => void applyOutpaint("21:9"),
				onUpscale4x: () => void applyEnhance(4),
				onOpenPublish: () => setPublishOpen(true),
				onExportBundle: exportLayeredBundle,
				onOpenVision: () => setVisionOpen(true)
			}), headSlot) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				ref: scrollSectionRef,
				className: "studio-scroll relative flex min-w-0 flex-1 flex-col gap-1.5 px-2 pt-1.5 pb-1.5 md:px-2.5 lg:h-full lg:overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "studio-hero-fit",
					"data-testid": "studio-hero-fit",
					className: cn("flex shrink-0 flex-col gap-1.5", useTallStage ? "lg:min-h-full" : "lg:h-full lg:min-h-[480px]"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex min-h-0 flex-col", useTallStage ? "" : "flex-1"),
							children: activeStudio === "king-360" && view === "360" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(King360StudioPanel, {
								aspect,
								onOpenStage: openExplicitStage
							}) : activeStudio === "kum-video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KumVideoStudioPanel, {}) : showingSplitHub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplitViewportStage, {
								heroFit: true,
								hideTopBar: true,
								contractOpen,
								onOpenGateModal: () => setGateModalOpen(true),
								onOpenStage: openExplicitStage,
								onUploadFile: (file) => void onFile(file)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hf-stage-enter relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#d1c5b8]/45 bg-[#161412] shadow-[0_18px_36px_-12px_rgba(27,28,26,0.18)] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b]",
								children: [
									enhanceBarOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										"data-testid": "vaethat-enhance-bar",
										className: "flex shrink-0 flex-wrap items-center justify-between gap-1.5 border-b border-white/10 bg-[#1e1b18] px-2.5 py-1 text-[10.5px] text-[#dfd5c6] dark:bg-[#08131f]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-[#e0c298]",
													children: "Enhance:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "inline-flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5",
													role: "group",
													"aria-label": "Enhance scope",
													children: ENHANCE_SCOPES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-pressed": enhanceScope === s.id,
														onClick: () => setEnhanceScope(s.id),
														className: cn("h-6.5 rounded-md px-2 text-[11px] transition", enhanceScope === s.id ? "bg-[#c5a880] font-semibold text-[#281800]" : "text-[#d5cab9] hover:text-white"),
														children: s.label
													}, s.id))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "inline-flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5",
													role: "group",
													"aria-label": "Enhance environment",
													children: ENHANCE_ENVIRONMENTS.map((env) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-pressed": enhanceEnv === env.id,
														onClick: () => setEnhanceEnv(env.id),
														className: cn("h-6.5 rounded-md px-2 text-[11px] transition", enhanceEnv === env.id ? "bg-[#c5a880]/25 font-semibold text-[#e0c298]" : "text-[#b9aa95] hover:text-white"),
														children: env.label
													}, env.id))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "inline-flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5",
													role: "group",
													"aria-label": "Upscale factor",
													children: [2, 4].map((factor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														"aria-pressed": engine.upscaleFactor === factor,
														onClick: () => setEngineField("upscaleFactor", factor),
														className: cn("h-6.5 rounded-md px-2 font-mono text-[11px] transition", engine.upscaleFactor === factor ? "bg-[#c5a880] font-semibold text-[#281800]" : "text-[#d5cab9] hover:text-white"),
														children: [factor, "×"]
													}, factor))
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex w-full flex-wrap items-center justify-between gap-1.5 sm:w-auto sm:justify-end",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														disabled: busy,
														onClick: () => {
															if (enhanceScope === "region") {
																setView("sam2");
																toast.message("Click a region in SAM-2 Seg, or run full-plate enhance.");
																return;
															}
															const nextIdea = idea.trim() ? idea : buildEnhanceDirective(enhanceScope, enhanceEnv, engine.upscaleFactor === 4 ? 4 : 2);
															if (!idea.trim()) setIdea(nextIdea);
															applyEnhance(engine.upscaleFactor);
														},
														className: "inline-flex h-7 items-center gap-1 rounded-lg bg-[#c5a880] px-2.5 text-[11px] font-semibold text-[#281800] disabled:opacity-50",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }),
															"Run ",
															engine.upscaleFactor,
															"× Enhance"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"data-testid": "enhance-compare-btn",
														"aria-pressed": view === "compare",
														onClick: showCompare,
														className: cn("inline-flex h-7 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-medium transition", view === "compare" ? "border-[#e0c298] bg-[#c5a880] font-semibold text-[#281800]" : "border-white/15 bg-white/5 text-[#f6efe4] hover:border-[#e0c298]"),
														children: "Compare"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: exportLayeredBundle,
														className: "inline-flex h-7 items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#f6efe4] hover:border-[#e0c298]",
														title: "Download multi-layer studio spec & mask manifest",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 text-[#e0c298]" }), " Layered Export"]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setEnhanceBarOpen(false),
												className: "grid size-7 shrink-0 place-items-center rounded-lg text-[#9b8d7a] hover:bg-white/10 hover:text-white",
												"aria-label": "Close Enhance bar",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
											})]
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex min-h-0 flex-1 flex-col overflow-hidden",
										children: [view === "3d" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport3D, {
											aspect,
											onCaptureSnapshot: (dataUrl, goToSketch) => {
												setUpload(dataUrl);
												applyWorkflowPreset("clay-to-render");
												setView(goToSketch ? "sketch" : "source");
												toast.success(goToSketch ? "3D view sent to Sketch Pad for tracing" : "3D snapshot captured as Source");
											},
											onCaptureChannels: (channels) => {
												if (!upload) setUpload(channels.clayUrl);
											}
										}) : view === "sketch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SketchMaskCanvas, {
											mode: "sketch",
											aspect,
											backgroundUrl: upload,
											initialBufferUrl: sketchDataUrl,
											onSaveBuffer: setSketchDataUrl,
											onLockToSource: (composite) => {
												setUpload(composite);
												applyWorkflowPreset("sketch-to-render");
												generate();
											}
										}) : view === "cv" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CvPreprocessorStage, {
											aspect,
											sourceUrl: upload || plate?.url || heroSample.src,
											onSendMapToSketch: (mapUrl) => {
												setUpload(mapUrl);
												setView("sketch");
												toast.success("Loaded extracted line/depth map as Sketch underlay");
											},
											onSendMaskToInpaint: (maskUrl, targetLabel) => {
												setMaskDataUrl(maskUrl);
												if (targetLabel.trim()) setIdea(`Restyle ${targetLabel}`);
												setView("mask");
												toast.success(`SAM "${targetLabel}" mask loaded into Inpaint`);
											},
											onExtrudeFloorPlan: () => setView("3d"),
											onLockAndRender: () => void generate()
										}) : view === "sam2" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroundedSAM2Tool, {
											aspect,
											sourceUrl: plate?.url ?? upload,
											busy,
											onGroundedSamSegment: segmentGroundedSam2,
											onSendToInpaint: (task, note) => {
												setEngineField("iopaintTask", task);
												setView("mask");
												applyInpaint(note ?? "");
											},
											onOpenInpaintWorkspace: () => {
												setSamInitialMode("off");
												setView("mask");
											},
											onSendToNodeEditor: () => {
												setNodeEditorMode("canvas");
												setView("nodes");
											},
											onSourceChange: (dataUrl) => setUpload(dataUrl)
										}) : view === "mask" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IOPaintWorkspace, {
											aspect,
											backgroundUrl: plate?.url ?? upload,
											initialBufferUrl: maskDataUrl,
											initialSamMode: samInitialMode,
											busy,
											onSaveBuffer: setMaskDataUrl,
											onGroundedSamSegment: segmentGroundedSam2,
											onApplyMaskInpaint: (instruction) => void applyInpaint(instruction),
											onApplyDirectionalOutpaint: (pad) => void applyDirectionalOutpaint(pad),
											onApplyRemoveBg: (outMode) => void applyRemoveBgPlugin(outMode),
											onApplyRestoreFaces: () => void applyRestoreFacesPlugin(),
											onApplyEsrganPlugin: () => void applyEnhance(engine.upscaleFactor),
											onLoadSampleSource: (url) => {
												setUpload(url);
												toast.success("Sample scene loaded into IOPaint workspace");
											}
										}) : view === "nodes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#171310] px-3 py-1.5 text-[11px] text-[#d5cab9]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setNodeEditorMode("canvas"),
														className: cn("rounded-full px-3 py-1 font-medium transition", nodeEditorMode === "canvas" ? "bg-[#c5a880] text-[#281800]" : "border border-white/15 bg-white/5 text-[#e6ddd0] hover:bg-white/10"),
														children: "Workflow Canvas"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setNodeEditorMode("studio"),
														className: cn("rounded-full px-3 py-1 font-medium transition", nodeEditorMode === "studio" ? "bg-[#c5a880] text-[#281800]" : "border border-white/15 bg-white/5 text-[#e6ddd0] hover:bg-white/10"),
														children: "Full 45-Node Studio"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden text-[10px] text-[#9b8d7a] sm:inline",
													children: nodeEditorMode === "canvas" ? "Drag nodes & draw SVG connections · Image Input → ControlNet → Render Engine" : "Full multi-pass DAG orchestrator"
												})]
											}), nodeEditorMode === "canvas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeEditorCanvas, {
												onOpenSam2Tool: () => setView("sam2"),
												onOpenStage: (stage) => setView(stage),
												onSendResultToStudio: (imageUrl, title) => {
													setUpload(imageUrl);
													setPlate({
														url: imageUrl,
														upload: upload ?? void 0,
														templateId: engine.workflowPreset,
														idea: title ? `Node Canvas: ${title}` : "Node Canvas Render"
													});
													setView("result");
													toast.success("Node Canvas render sent to Studio Plate");
												}
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeStudioEmbedded, { onPromoteToStudio: (imageUrl, title) => {
												setUpload(imageUrl);
												setPlate({
													url: imageUrl,
													upload: upload ?? void 0,
													templateId: engine.workflowPreset,
													idea: title ? `Node Pipeline: ${title}` : "Node Pipeline Result"
												});
												setView("result");
												toast.success("Node output sent to Studio Plate");
											} })]
										}) : view === "360" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(King360StudioPanel, {
											aspect,
											onOpenStage: openExplicitStage
										}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-3",
											style: { minHeight: "300px" },
											children: variations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid grid-cols-2 gap-2.5",
												children: variations.map((url, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => {
														setPlate({
															url,
															upload: upload ?? void 0,
															templateId: engine.workflowPreset,
															idea: idea.trim()
														});
														setView("result");
														toast.success(`Promoted variation V${idx + 1}`);
													},
													className: cn("group relative overflow-hidden rounded-2xl border transition", plate?.url === url ? "border-[#e0c298] ring-2 ring-[#e0c298]" : "border-white/10 hover:border-[#c5a880]"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResilientPlateImage, {
														src: url,
														alt: `Concept variation ${idx + 1}`,
														className: "aspect-[16/9] object-cover transition group-hover:scale-[1.02]"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "absolute bottom-2 left-2 rounded-full bg-[#161412]/85 px-2.5 py-0.5 font-mono text-[10px] text-[#f6efe4]",
														children: [
															"V",
															idx + 1,
															" · Promote"
														]
													})]
												}, `${url.slice(0, 48)}-${idx}`))
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid min-h-64 place-items-center px-6 text-center text-sm text-[#f6efe4]",
												style: { aspectRatio: aspect },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Explore 4 parallel Midjourney-style architectural concepts at once." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														disabled: busy,
														onClick: () => void generateGrid(),
														className: "inline-flex h-10 items-center gap-2 rounded-full bg-[#c5a880] px-5 text-xs font-semibold text-[#281800]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid2x2, { className: "size-4" }), " Generate 4-Up Grid"]
													})]
												})
											})
										}) : view === "compare" && compareBeforeSrc && plate?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
											before: compareBeforeSrc,
											after: plate.url,
											beforeLabel: "Source",
											afterLabel: "Result",
											beforeAlt: "Source",
											afterAlt: "Result",
											embedded: true,
											aspect
										}) : view === "result" ? plate?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative flex min-h-0 flex-1 items-center justify-center bg-[#08131f] p-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "relative flex h-full w-full items-center justify-center",
												style: { containerType: "size" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													"data-testid": "studio-aspect-frame",
													"data-ratio": frame.ratio,
													className: "relative overflow-hidden rounded-xl border border-white/15 bg-[#050f1b] shadow-[0_14px_36px_rgba(0,0,0,0.45)] transition-[width,height] duration-200",
													style: {
														width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
														height: `min(100cqh, calc(100cqw / ${aspectNumber}))`
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "pointer-events-none absolute top-2 left-2 z-10 rounded-full border border-white/15 bg-[#050f1b]/80 px-2 py-0.5 font-mono text-[9.5px] text-[#e8c98a] backdrop-blur-md",
														children: "Result"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResilientPlateImage, {
														src: plate.url,
														alt: "Result",
														busy,
														testId: "studio-result-img",
														className: "object-contain",
														onRetryFallback: () => void generate("plate")
													})]
												})
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid min-h-[220px] flex-1 place-items-center bg-[#08131f] p-4 text-center text-xs text-[#e8eff3]",
											children: "No plate yet. Choose 3D Viewport, Sketch, or Upload, then press Render Plate."
										}) : upload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative flex min-h-0 flex-1 items-center justify-center bg-[#08131f] p-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "relative flex h-full w-full items-center justify-center",
												style: { containerType: "size" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													"data-testid": "studio-aspect-frame",
													"data-ratio": frame.ratio,
													className: "relative overflow-hidden rounded-xl border border-white/15 bg-[#050f1b] shadow-[0_14px_36px_rgba(0,0,0,0.45)] transition-[width,height] duration-200",
													style: {
														width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
														height: `min(100cqh, calc(100cqw / ${aspectNumber}))`
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "pointer-events-none absolute top-2 left-2 z-10 rounded-full border border-white/15 bg-[#050f1b]/80 px-2 py-0.5 font-mono text-[9.5px] text-[#e8c98a] backdrop-blur-md",
														children: "Source"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResilientPlateImage, {
														src: upload,
														alt: "Source",
														busy,
														className: "object-contain"
													})]
												})
											})
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative z-0 flex min-h-0 flex-1 items-center justify-center bg-[#08131f] p-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "relative flex h-full w-full items-center justify-center",
												style: { containerType: "size" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													"data-testid": "studio-aspect-frame",
													"data-ratio": frame.ratio,
													className: "relative overflow-hidden rounded-2xl border border-white/15 bg-[#121c29] shadow-[0_18px_48px_rgba(0,0,0,0.45)] transition-[width,height] duration-200",
													style: {
														width: `min(100cqw, calc(100cqh * ${aspectNumber}))`,
														height: `min(100cqh, calc(100cqw / ${aspectNumber}))`
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => fileRef.current?.click(),
														onDragOver: (event) => event.preventDefault(),
														onDrop: (event) => {
															event.preventDefault();
															onFile(event.dataTransfer.files[0]);
														},
														className: "relative block h-full w-full",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
															src: heroSample.src,
															alt: heroSample.caption,
															className: "h-full w-full object-cover opacity-90"
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-2.5 bg-gradient-to-t from-[#050f1b]/90 via-[#050f1b]/30 to-transparent p-4 text-[#e8eff3]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "rounded-full bg-[#08131f]/80 px-3.5 py-1 text-center text-xs backdrop-blur-md sm:text-sm",
															children: "Drop photo, sketch, or 3D GLB (Ctrl+V to paste)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																	type: "button",
																	onClick: () => setView("3d"),
																	className: "inline-flex h-8 items-center gap-1.5 rounded-full bg-[#c5a880] px-3.5 text-[11px] font-semibold text-[#281800] shadow-xs transition hover:bg-[#b8976b] sm:h-9 sm:px-4 sm:text-xs",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-3.5" }), " 3D Massing"]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																	type: "button",
																	onClick: () => setView("sketch"),
																	className: "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-[#08131f]/80 px-3.5 text-[11px] font-medium text-[#e8eff3] backdrop-blur-md hover:border-[#e8c98a] sm:h-9 sm:px-4 sm:text-xs",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 text-[#e8c98a]" }), " Sketch Pad"]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																	type: "button",
																	onClick: () => fileRef.current?.click(),
																	className: "inline-flex h-8 items-center gap-1.5 rounded-full border border-white/25 bg-[#08131f]/80 px-3.5 text-[11px] font-medium text-[#e8eff3] backdrop-blur-md hover:border-[#e8c98a] sm:h-9 sm:px-4 sm:text-xs",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-3.5 text-[#e8c98a]" }), " Upload Photo / GLB"]
																})
															]
														})]
													})]
												})
											})
										}), selecting && view !== "compare" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute inset-x-3 top-3 z-30 flex flex-wrap gap-2",
											children: pins.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setTarget(group.id),
												className: cn("rounded-full px-3 py-1 text-xs shadow-md", design.target === group.id ? "bg-[#c5a880] font-medium text-[#281800]" : "bg-[#08131f]/90 text-[#e8eff3]"),
												children: group.label
											}, group.id))
										}) : null]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 flex-wrap items-center justify-between gap-1.5 border-t border-white/10 bg-[#050f1b] px-2.5 py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 font-mono text-[10px] text-[#cfe3f0] tabular-nums",
											children: [
												label,
												" · ",
												room,
												" · ",
												frame.ratio,
												" · ",
												frame.resolution.toUpperCase(),
												view === "3d" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden text-[10px] text-[#a9bdc9] md:inline",
													children: "· Drag to orbit · Scroll to zoom"
												}) : null
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											onPointerDown: (event) => event.stopPropagation(),
											onClick: (event) => event.stopPropagation(),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"data-testid": "stage-upload-btn",
													"aria-label": "Upload photo or 3D file into Scene",
													onClick: (event) => {
														event.preventDefault();
														event.stopPropagation();
														fileRef.current?.click();
													},
													className: "inline-flex h-6 items-center gap-1 rounded-full border border-[#e8c98a]/45 bg-[#e8c98a]/12 px-2 text-[10px] font-semibold text-[#e8c98a] transition hover:bg-[#e8c98a] hover:text-[#1b1407]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-2.5" }), "Upload"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"aria-label": "Pin architectural element",
													"aria-pressed": selecting,
													onClick: (event) => {
														event.preventDefault();
														event.stopPropagation();
														setSelecting(!selecting);
													},
													className: cn("inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[10px] font-medium transition", selecting ? "border-transparent bg-[#c5a880] text-[#281800]" : "border-white/15 bg-white/5 text-white/90 hover:border-[#e8c98a]"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, { className: "size-2.5" }), "Pin"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"aria-label": "Cycle the edit target",
													onClick: (event) => {
														event.preventDefault();
														event.stopPropagation();
														cycleTargetElement();
													},
													className: "inline-flex h-6 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 text-[10px] font-medium text-white/90 transition hover:border-[#e8c98a]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-2.5 text-[#e8c98a]" }), design.target]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													"data-testid": "open-nvidia-vision-btn",
													"aria-label": "Analyze image with Vision AI",
													onClick: (event) => {
														event.preventDefault();
														event.stopPropagation();
														setVisionOpen(true);
													},
													className: "inline-flex h-6 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 text-[10px] font-medium text-white/90 transition hover:border-[#e8c98a]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanEye, { className: "size-2.5 text-[#e8c98a]" }), "Vision AI"]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "image/jpeg,image/png,image/webp,.glb,.gltf,.obj,.fbx",
										className: "sr-only",
										suppressHydrationWarning: true,
										onChange: (event) => {
											onFile(event.target.files?.[0]);
											event.target.value = "";
										}
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOpticsBar, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {})
					]
				})
			}),
			!inspectorCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				id: "studio-properties",
				className: "flex w-full shrink-0 flex-col gap-1.5 px-2 pb-2 lg:h-full lg:w-[296px] xl:w-[312px] lg:overflow-hidden lg:border-l lg:border-[#d1c5b8]/35 lg:py-1.5 lg:pr-2 lg:pl-2 dark:lg:border-[#a9bdc9]/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid shrink-0 grid-cols-2 gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 dark:border-[#a9bdc9]/20 dark:bg-[#121c29]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "right-tab-matrix",
						onClick: () => setRightTab("matrix"),
						className: cn("inline-flex h-6 items-center justify-center gap-1 rounded-full text-[10px] font-semibold transition", rightTab === "matrix" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] dark:text-[#a9bdc9]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Presets"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": "right-tab-optics",
						onClick: () => setRightTab("optics"),
						className: cn("inline-flex h-6 items-center justify-center gap-1 rounded-full text-[10px] font-semibold transition", rightTab === "optics" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] dark:text-[#a9bdc9]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3" }), " Scene & Optics"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto no-scrollbar",
					children: rightTab === "matrix" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresetMatrixPanel, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertiesPanel, {
						collapsed: false,
						onToggleCollapse: () => setInspectorCollapsed(true),
						onOpenStage: (stage) => {
							if (stage === "result") openExplicitStage(stage);
							else setView(stage);
						},
						onExportPlate: exportLayeredBundle
					})
				})]
			}) : null,
			publishOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handlePublishSubmit,
					className: "arctic-glass-z2 w-full max-w-md rounded-3xl p-6 text-[#1b1c1a] shadow-2xl dark:text-[#e8eff3]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Publish to Project Gallery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPublishOpen(false),
								className: "grid size-8 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-[#4d463c] dark:text-[#a9bdc9]",
							children: "Save your before/after architectural plate into the Gallery comparison archive."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Project Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: pubTitle,
										onChange: (e) => setPubTitle(e.target.value),
										placeholder: `${design.look} ${label} Study`,
										className: "mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-3 text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Location / Context"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: pubLocation,
										onChange: (e) => setPubLocation(e.target.value),
										className: "mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-3 text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "Discipline"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: pubDiscipline,
											onChange: (e) => setPubDiscipline(e.target.value),
											className: "mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-[#1b1c1a] outline-none dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Exterior",
													children: "Exterior"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Interior",
													children: "Interior"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Renovation",
													children: "Renovation"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Cultural",
													children: "Cultural"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Civic",
													children: "Civic"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Landscape",
													children: "Landscape"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "Comparison Study"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: pubType,
											onChange: (e) => setPubType(e.target.value),
											className: "mt-1 h-10 w-full rounded-xl border border-[#d1c5b8]/60 bg-white px-2.5 text-[#1b1c1a] outline-none dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Material Restyle",
													children: "Material Restyle"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Lighting / Relighting",
													children: "Lighting / Relighting"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Adaptive Reuse",
													children: "Adaptive Reuse"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Masterplan Integration",
													children: "Masterplan Integration"
												})
											]
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPublishOpen(false),
								className: "h-9 rounded-full border border-[#d1c5b8]/60 px-4 text-xs dark:border-[#a9bdc9]/30",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "ice-cta h-9 rounded-full px-5 text-xs font-bold",
								children: "Save to Gallery"
							})]
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FidelityGateModal, {
				open: gateModalOpen,
				onClose: () => setGateModalOpen(false),
				onFixInpaint: () => {
					setSplitHubEnabled(false);
					setActiveStudio("mas-2d");
					setView("mask");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NvidiaVisionDialog, {
				open: visionOpen,
				onOpenChange: setVisionOpen,
				defaultImageUrl: plate?.url ?? upload ?? heroSample.src
			})
		]
	});
}
//#endregion
export { WorkspacePage as component };
