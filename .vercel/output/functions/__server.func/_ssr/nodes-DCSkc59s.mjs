import { o as __toESM } from "../_runtime.mjs";
import { n as executeNodeWorkflow, t as NodeStudioCanvas } from "./node-executor-CFW8SU4-.mjs";
import { t as Compare } from "./compare-CIGWHWPX.mjs";
import { O as cloneWorkflow, P as createNodeInstance, U as getNodeSpec, g as NODE_CATALOG, k as compileWorkflowToComfyJson, nt as useOriel, o as CATEGORY_META, q as matchesNodeSearch, rt as validateWorkflowGraph, tt as useHydrated, v as WORKFLOW_TEMPLATES, y as autoLayoutGraph } from "./store-DhXBZ9GM.mjs";
import { E as cn } from "./router-BiPrL9zA.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { Bt as Copy, D as SlidersHorizontal, H as Play, It as Download, M as Search, Ot as FileUp, R as RotateCcw, T as Sparkles, Tt as FolderKanban, V as Plus, Wt as CodeXml, Zt as Check, an as ArrowUpRight, ct as LoaderCircle, k as ShieldCheck, mt as Info, p as TriangleAlert, pt as Layers, qt as CircleCheck, tn as BookmarkPlus, z as RefreshCw, zt as Cpu } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/nodes-DCSkc59s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NodeStudioInspector({ workflow, selectedNode, executionResults, validation, onUpdateNodeParam, onUpdateNodeLabel, onSelectNode, onImportWorkflowJson, onPromoteImageToStudio }) {
	const [tab, setTab] = (0, import_react.useState)("node");
	const [jsonFormat, setJsonFormat] = (0, import_react.useState)("comfy");
	const [importText, setImportText] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const selectedSpec = selectedNode ? getNodeSpec(selectedNode.type) : void 0;
	const selectedResult = selectedNode ? executionResults[selectedNode.id] : void 0;
	const latestImageOutput = (0, import_react.useMemo)(() => {
		for (const id of [...validation.executionOrder].reverse()) {
			const res = executionResults[id];
			if (res?.imageUrl) return {
				nodeId: id,
				res
			};
		}
		return null;
	}, [validation.executionOrder, executionResults]);
	const jsonPayload = (0, import_react.useMemo)(() => {
		const obj = jsonFormat === "comfy" ? compileWorkflowToComfyJson(workflow) : workflow;
		return JSON.stringify(obj, null, 2);
	}, [workflow, jsonFormat]);
	function copyJson() {
		navigator.clipboard.writeText(jsonPayload);
		setCopied(true);
		toast.success(`Copied ${jsonFormat === "comfy" ? "ComfyUI API" : "Oriel"} JSON`);
		window.setTimeout(() => setCopied(false), 1600);
	}
	function downloadJson() {
		const blob = new Blob([jsonPayload], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${workflow.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${jsonFormat}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"data-testid": "node-studio-inspector",
		className: "flex h-full min-h-0 flex-col border-l border-line bg-surface text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 gap-1 border-b border-line bg-raised/60 p-1.5",
			children: [
				[
					"node",
					"Inspector",
					SlidersHorizontal
				],
				[
					"diagnostics",
					`Validate (${validation.issues.length})`,
					ShieldCheck
				],
				[
					"json",
					"ComfyUI JSON",
					CodeXml
				]
			].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: cn("flex h-8 flex-1 items-center justify-center gap-1 rounded-lg px-1.5 text-[11px] font-medium whitespace-nowrap transition", tab === id ? "bg-[#14110f] text-[#f6efe4] shadow-xs" : "text-muted hover:bg-surface hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
			}, id))
		}), tab === "node" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3.5 space-y-4",
			children: selectedNode && selectedSpec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
							style: { color: CATEGORY_META[selectedSpec.category].accent },
							children: CATEGORY_META[selectedSpec.category].label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] uppercase text-faint",
							children: [
								selectedSpec.executionTarget,
								" · ",
								selectedNode.id
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: selectedNode.label ?? selectedSpec.title,
						onChange: (e) => onUpdateNodeLabel(selectedNode.id, e.target.value),
						"aria-label": "Node display title",
						className: "mt-1.5 h-9 w-full rounded-xl border border-line bg-raised/60 px-2.5 font-serif text-base font-semibold text-fg outline-none focus:border-[#d4b06a]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: selectedSpec.summary
					})
				] }),
				selectedSpec.params.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 border-t border-line pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
						children: "Parameters"
					}), selectedSpec.params.map((field) => {
						const val = selectedNode.params[field.key] ?? field.defaultValue;
						if (field.kind === "textarea") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: field.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								value: String(val),
								onChange: (e) => onUpdateNodeParam(selectedNode.id, field.key, e.target.value),
								className: "mt-1 w-full rounded-xl border border-line bg-raised/50 p-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
							})]
						}, field.key);
						if (field.kind === "select") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: field.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: String(val),
								onChange: (e) => onUpdateNodeParam(selectedNode.id, field.key, e.target.value),
								className: "mt-1 h-9 w-full rounded-xl border border-line bg-raised/50 px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]",
								children: (field.options ?? []).map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: opt,
									children: opt === "__studio_active__" ? "Active Studio Image" : opt
								}, opt))
							})]
						}, field.key);
						if (field.kind === "slider") {
							const num = Number(val);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-fg",
										children: field.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] tabular-nums text-[#b08a45]",
										children: num
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: field.min ?? 0,
									max: field.max ?? 100,
									step: field.step ?? 1,
									value: num,
									onChange: (e) => onUpdateNodeParam(selectedNode.id, field.key, Number(e.target.value)),
									className: "mt-1.5 w-full accent-[#d4b06a]"
								})]
							}, field.key);
						}
						if (field.kind === "toggle") {
							const checked = Boolean(val);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center justify-between rounded-xl border border-line bg-raised/40 px-3 py-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-fg",
									children: field.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked,
									onChange: (e) => onUpdateNodeParam(selectedNode.id, field.key, e.target.checked),
									className: "size-4 accent-[#d4b06a]"
								})]
							}, field.key);
						}
						if (field.kind === "number") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: field.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: field.min,
								max: field.max,
								value: Number(val),
								onChange: (e) => onUpdateNodeParam(selectedNode.id, field.key, Number(e.target.value)),
								className: "mt-1 h-9 w-full rounded-xl border border-line bg-raised/50 px-2.5 font-mono text-xs text-fg outline-none focus:border-[#d4b06a]"
							})]
						}, field.key);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-fg",
								children: field.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: String(val),
								placeholder: field.placeholder,
								onChange: (e) => onUpdateNodeParam(selectedNode.id, field.key, e.target.value),
								className: "mt-1 h-9 w-full rounded-xl border border-line bg-raised/50 px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
							})]
						}, field.key);
					})]
				}) : null,
				selectedResult ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5 border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
								children: "Node Output"
							}), typeof selectedResult.durationMs === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[11px] tabular-nums text-[#b08a45]",
								children: [selectedResult.durationMs, "ms"]
							}) : null]
						}),
						selectedResult.isIllustrativeRelight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2.5 text-[11px] text-amber-950",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "mt-0.5 size-3.5 shrink-0 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Illustrative AI approximation (image-only input). Wire",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Load 3D Scene" }),
								" for physically grounded solar shadow geometry."
							] })]
						}) : null,
						typeof selectedResult.diffOutsideMaskPct === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-testid": "geometry-drift-report",
							className: cn("rounded-xl border p-2.5 text-xs", selectedResult.geometryDriftWarning ? "border-amber-500/50 bg-amber-500/10 text-amber-950" : "border-emerald-600/30 bg-emerald-600/10 text-emerald-950"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Geometry Diff Outside Mask" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono tabular-nums",
									children: [selectedResult.diffOutsideMaskPct, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-[11px] opacity-85",
								children: selectedResult.geometryDriftWarning ? "Structural change outside mask exceeded alert threshold. Lower strength or tighten Geometry Lock." : "Exterior geometry held cleanly outside edited mask."
							})]
						}) : null,
						selectedResult.compareBeforeUrl && selectedResult.compareAfterUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-line bg-[#14110f]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
								before: selectedResult.compareBeforeUrl,
								after: selectedResult.compareAfterUrl,
								beforeLabel: "Before",
								afterLabel: "After",
								beforeAlt: "Before edit",
								afterAlt: "After edit",
								embedded: true,
								aspect: "16/9"
							})
						}) : selectedResult.videoUrl && selectedResult.videoUrl.startsWith("blob:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: selectedResult.videoUrl,
								controls: true,
								autoPlay: true,
								loop: true,
								muted: true,
								className: "w-full rounded-xl border border-line bg-black"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: selectedResult.videoUrl,
								download: "oriel-walkthrough.webm",
								className: "inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-raised text-xs font-medium text-fg hover:border-[#d4b06a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5 text-[#b08a45]" }), " Download WebM Clip"]
							})]
						}) : selectedResult.variations && selectedResult.variations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-1.5",
							children: selectedResult.variations.map((url, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onPromoteImageToStudio(url, `Node Variation V${idx + 1}`),
								className: "overflow-hidden rounded-lg border border-line hover:border-[#d4b06a]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: url,
									alt: `Variation ${idx + 1}`,
									className: "aspect-video w-full object-cover"
								})
							}, `${idx}-${url.slice(0, 20)}`))
						}) : selectedResult.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: selectedResult.imageUrl,
							alt: selectedSpec.title,
							className: "w-full rounded-xl border border-line object-cover"
						}) : null,
						selectedResult.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: selectedResult.summary
						}) : null,
						selectedResult.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onPromoteImageToStudio(selectedResult.imageUrl, selectedSpec.title),
							className: "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-[#d4b06a] bg-[#14110f] text-xs font-medium text-[#f6efe4] hover:bg-[#1f1a16]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5 text-[#e7c27a]" }), " Send Result to AI Canvas"]
						}) : null
					]
				}) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-line bg-raised/45 p-3 text-xs text-muted",
					children: "Click any node on the graph canvas to edit its parameters, sliders, and live output preview."
				}), latestImageOutput ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
							children: "Latest Pipeline Output"
						}),
						latestImageOutput.res.compareBeforeUrl && latestImageOutput.res.compareAfterUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-line bg-[#14110f]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
								before: latestImageOutput.res.compareBeforeUrl,
								after: latestImageOutput.res.compareAfterUrl,
								beforeLabel: "Before",
								afterLabel: "After",
								beforeAlt: "Before",
								afterAlt: "After",
								embedded: true,
								aspect: "16/9"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: latestImageOutput.res.imageUrl,
							alt: "Latest pipeline output",
							className: "w-full rounded-xl border border-line object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onPromoteImageToStudio(latestImageOutput.res.imageUrl, workflow.name),
							className: "gold-fill inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-[#2a1c0c]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" }), " Promote Output to Studio"]
						})
					]
				}) : null]
			})
		}) : tab === "diagnostics" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3.5 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "graph-validation-banner",
					className: cn("rounded-xl border p-3 text-xs", validation.valid ? "border-emerald-600/35 bg-emerald-600/10 text-emerald-950" : "border-red-600/35 bg-red-600/10 text-red-950"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [validation.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-700" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-4 text-red-700" }), validation.valid ? "Valid Acyclic Graph (DAG)" : "Graph Validation Failed"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] tabular-nums",
							children: [validation.durationMs, "ms"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] opacity-85",
						children: [
							validation.executionOrder.length,
							" executable nodes ·",
							" ",
							validation.hasCycles ? "Cycle detected" : "Cycle-free"
						]
					})]
				}),
				validation.issues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
						children: [
							"Diagnostics (",
							validation.issues.length,
							")"
						]
					}), validation.issues.map((issue, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							if (issue.nodeId) {
								onSelectNode(issue.nodeId);
								setTab("node");
							}
						},
						className: "flex w-full items-start gap-2 rounded-xl border border-line bg-raised/50 p-2.5 text-left text-xs hover:border-[#d4b06a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-3.5 shrink-0 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: issue.message
						})]
					}, idx))]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
						children: "Topological Execution Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-line rounded-xl border border-line bg-raised/35",
						children: validation.executionOrder.map((nodeId, idx) => {
							const node = workflow.nodes.find((n) => n.id === nodeId);
							const spec = node ? getNodeSpec(node.type) : void 0;
							const exec = executionResults[nodeId];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									onSelectNode(nodeId);
									setTab("node");
								},
								className: "flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate font-medium text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-1.5 font-mono text-[10px] tabular-nums text-faint",
										children: String(idx + 1).padStart(2, "0")
									}), node?.label || spec?.title || nodeId]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[10px] tabular-nums text-muted",
									children: exec?.status === "completed" ? `${exec.durationMs ?? 1}ms` : exec?.status ?? "ready"
								})]
							}, nodeId);
						})
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3.5 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setJsonFormat("comfy"),
						className: cn("h-8 flex-1 rounded-lg border text-xs font-medium", jsonFormat === "comfy" ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]" : "border-line bg-raised text-muted"),
						children: "ComfyUI API JSON"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setJsonFormat("oriel"),
						className: cn("h-8 flex-1 rounded-lg border text-xs font-medium", jsonFormat === "oriel" ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]" : "border-line bg-raised text-muted"),
						children: "Oriel Workflow JSON"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: copyJson,
						className: "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-raised text-xs font-medium text-fg hover:border-[#d4b06a]",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copy"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: downloadJson,
						className: "inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-raised text-xs font-medium text-fg hover:border-[#d4b06a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export .json"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					"data-testid": "workflow-json-preview",
					className: "max-h-60 overflow-auto rounded-xl border border-line bg-[#14110f] p-2.5 font-mono text-[10px] leading-relaxed text-[#dfd5c6]",
					children: jsonPayload
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
							children: "Import Oriel Workflow JSON"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 3,
							value: importText,
							onChange: (e) => setImportText(e.target.value),
							placeholder: "Paste exported Oriel workflow JSON {\"nodes\":[...],\"edges\":[...]}",
							className: "w-full rounded-xl border border-line bg-raised/50 p-2 font-mono text-[10px] text-fg outline-none focus:border-[#d4b06a]"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !importText.trim(),
							onClick: () => {
								onImportWorkflowJson(importText);
								setImportText("");
							},
							className: "inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-surface text-xs font-medium text-fg hover:border-[#d4b06a] disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-3.5 text-[#b08a45]" }), " Import Workflow Graph"]
						})
					]
				})
			]
		})]
	});
}
var CATEGORIES = Object.keys(CATEGORY_META).sort((a, b) => CATEGORY_META[a].order - CATEGORY_META[b].order);
function NodeStudioSidebar({ workflows, activeWorkflowId, revisions, onAddNode, onSelectWorkflow, onLoadTemplate, onSaveRevision, onRestoreRevision }) {
	const [tab, setTab] = (0, import_react.useState)("nodes");
	const [search, setSearch] = (0, import_react.useState)("");
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("all");
	const filteredSpecs = (0, import_react.useMemo)(() => {
		return NODE_CATALOG.filter((spec) => {
			if (activeCategory !== "all" && spec.category !== activeCategory) return false;
			return matchesNodeSearch(spec, search);
		});
	}, [search, activeCategory]);
	const grouped = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const cat of CATEGORIES) map.set(cat, []);
		for (const spec of filteredSpecs) map.get(spec.category)?.push(spec);
		return CATEGORIES.filter((cat) => (map.get(cat)?.length ?? 0) > 0).map((cat) => ({
			category: cat,
			meta: CATEGORY_META[cat],
			items: map.get(cat)
		}));
	}, [filteredSpecs]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		"data-testid": "node-studio-sidebar",
		className: "flex h-full min-h-0 flex-col border-r border-line bg-surface text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 border-b border-line bg-raised/60 p-1.5 gap-1",
			children: [
				[
					"nodes",
					"Nodes (45)",
					Layers
				],
				[
					"templates",
					"Templates",
					FolderKanban
				],
				[
					"revisions",
					"Revisions",
					RotateCcw
				]
			].map(([id, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: cn("flex h-8 flex-1 items-center justify-center gap-1 rounded-lg px-1.5 text-[11px] font-medium whitespace-nowrap transition", tab === id ? "bg-[#14110f] text-[#f6efe4] shadow-xs" : "text-muted hover:bg-surface hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
			}, id))
		}), tab === "nodes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "shrink-0 space-y-2 border-b border-line p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					placeholder: "Search 45 nodes (SAM, Inpaint, Relight...)",
					className: "h-9 w-full rounded-xl border border-line bg-raised/60 pr-3 pl-8 text-xs text-fg outline-none focus:border-[#d4b06a]"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-scrollbar flex gap-1 overflow-x-auto pb-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setActiveCategory("all"),
					className: cn("h-7 shrink-0 rounded-lg border px-2 text-[11px] font-medium whitespace-nowrap transition", activeCategory === "all" ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]" : "border-line bg-surface text-muted hover:text-fg"),
					children: [
						"All (",
						NODE_CATALOG.length,
						")"
					]
				}), CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActiveCategory(cat),
					className: cn("h-7 shrink-0 rounded-lg border px-2 text-[11px] font-medium whitespace-nowrap transition", activeCategory === cat ? "border-[#14110f] bg-[#14110f] text-[#f6efe4]" : "border-line bg-surface text-muted hover:text-fg"),
					children: CATEGORY_META[cat].label
				}, cat))]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3 space-y-4",
			children: grouped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-xs text-muted",
				children: "No matching nodes found."
			}) : grouped.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1.5 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-block size-2 rounded-full",
						style: { backgroundColor: group.meta.accent }
					}), group.meta.label]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] tabular-nums text-faint",
					children: group.items.length
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-1",
				children: group.items.map((spec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					draggable: true,
					onDragStart: (e) => {
						e.dataTransfer.setData("application/x-oriel-node", spec.type);
						e.dataTransfer.effectAllowed = "copy";
					},
					onClick: () => onAddNode(spec),
					className: "group flex w-full items-start justify-between gap-2 rounded-xl border border-line/80 bg-raised/45 px-2.5 py-2 text-left transition hover:border-[#d4b06a] hover:bg-surface",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs font-semibold text-fg",
								children: spec.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase text-faint",
								children: spec.executionTarget
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted",
							children: spec.summary
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mt-0.5 size-3.5 shrink-0 text-faint group-hover:text-[#b08a45]" })]
				}, spec.type))
			})] }, group.category))
		})] }) : tab === "templates" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3 space-y-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
				children: "Prebuilt ArchViz Pipelines"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-2",
				children: WORKFLOW_TEMPLATES.map((tpl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-raised/50 p-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-fg",
								children: tpl.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] tabular-nums text-faint",
								children: [
									tpl.nodes.length,
									"N · ",
									tpl.edges.length,
									"E"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] leading-snug text-muted",
							children: tpl.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onLoadTemplate(tpl.id),
							className: "mt-2 inline-flex h-7 items-center gap-1 rounded-lg border border-[#d4b06a]/60 bg-[#14110f] px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#e7c27a]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-[#e7c27a]" }), " Load Template"]
						})
					]
				}, tpl.id))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted",
				children: "Saved Workspace Graphs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 space-y-1.5",
				children: workflows.map((wf) => {
					const active = wf.id === activeWorkflowId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelectWorkflow(wf.id),
						className: cn("flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left text-xs transition", active ? "border-[#d4b06a] bg-[#14110f] text-[#f6efe4]" : "border-line bg-raised/40 text-fg hover:border-[#d4b06a]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-medium",
							children: wf.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[10px] tabular-nums opacity-75",
							children: [wf.nodes.length, " nodes"]
						})]
					}, wf.id);
				})
			})] })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto p-3 space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onSaveRevision,
				className: "gold-fill flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-[#2a1c0c]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "size-3.5" }), " Save Graph Snapshot"]
			}), revisions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-8 text-center text-xs text-muted",
				children: "No graph snapshots yet. Run a pipeline or click Save Graph Snapshot to track non-destructive versions."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: revisions.map((rev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-line bg-raised/50 p-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-xs font-semibold text-fg",
								children: rev.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] uppercase text-[#b08a45]",
								children: rev.mode
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 font-mono text-[10px] tabular-nums text-faint",
							children: [
								rev.nodeCount,
								" nodes · ",
								rev.edgeCount,
								" edges",
								typeof rev.diffOutsideMaskPct === "number" ? ` · Drift ${rev.diffOutsideMaskPct}%` : ""
							]
						}),
						rev.outputPreviewUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: rev.outputPreviewUrl,
							alt: rev.label,
							className: "mt-2 h-20 w-full rounded-lg border border-line object-cover"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onRestoreRevision(rev.id),
							className: "mt-2 inline-flex h-7 items-center gap-1 rounded-lg border border-line bg-surface px-2.5 text-[11px] font-medium text-fg hover:border-[#d4b06a]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Restore Snapshot"]
						})
					]
				}, rev.id))
			})]
		})]
	});
}
function NodeStudioPage() {
	const navigate = useNavigate();
	const hydrated = useHydrated();
	const nodeWorkflows = useOriel((s) => s.nodeWorkflows);
	const activeNodeWorkflowId = useOriel((s) => s.activeNodeWorkflowId);
	const nodeExecutionMode = useOriel((s) => s.nodeExecutionMode);
	const nodeRevisions = useOriel((s) => s.nodeRevisions);
	const setActiveNodeWorkflowId = useOriel((s) => s.setActiveNodeWorkflowId);
	const upsertNodeWorkflow = useOriel((s) => s.upsertNodeWorkflow);
	const createNodeWorkflowFromTemplate = useOriel((s) => s.createNodeWorkflowFromTemplate);
	const setNodeExecutionMode = useOriel((s) => s.setNodeExecutionMode);
	const addNodeRevision = useOriel((s) => s.addNodeRevision);
	const restoreNodeRevision = useOriel((s) => s.restoreNodeRevision);
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
	const [mobilePane, setMobilePane] = (0, import_react.useState)("canvas");
	const validation = (0, import_react.useMemo)(() => validateWorkflowGraph(activeWorkflow.nodes, activeWorkflow.edges), [activeWorkflow.nodes, activeWorkflow.edges]);
	const selectedNode = (0, import_react.useMemo)(() => activeWorkflow.nodes.find((n) => n.id === selectedNodeId) ?? null, [activeWorkflow.nodes, selectedNodeId]);
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
		const offset = activeWorkflow.nodes.length * 24;
		const pos = position ?? {
			x: 120 + offset % 260,
			y: 120 + offset % 180
		};
		const instance = createNodeInstance(spec.type, pos);
		commitWorkflow({
			...activeWorkflow,
			nodes: [...activeWorkflow.nodes, instance]
		});
		setSelectedNodeId(instance.id);
		setMobilePane("canvas");
		toast.message(`Added ${spec.title}`);
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
	function handleUpdateNodeLabel(nodeId, label) {
		commitWorkflow({
			...activeWorkflow,
			nodes: activeWorkflow.nodes.map((n) => n.id === nodeId ? {
				...n,
				label
			} : n)
		});
	}
	function handleAutoLayout() {
		commitWorkflow({
			...activeWorkflow,
			nodes: autoLayoutGraph(activeWorkflow.nodes, activeWorkflow.edges)
		});
		toast.success("DAG auto-layout applied");
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
		setMobilePane("canvas");
		toast.success("Loaded architectural node template");
	}
	function handleSyncFromStudio() {
		const activeSrc = plate?.url || upload;
		if (!activeSrc) {
			toast.message("Open or upload an image in AI Studio first, then sync here.");
			return;
		}
		const updatedNodes = activeWorkflow.nodes.map((n) => {
			if (n.type === "input.load_image") return {
				...n,
				params: {
					...n.params,
					source: "__studio_active__",
					customUrl: activeSrc
				}
			};
			return n;
		});
		commitWorkflow({
			...activeWorkflow,
			nodes: updatedNodes
		});
		toast.success("Synced active AI Studio image & mask into Load Image nodes");
	}
	function promoteImageToStudio(imageUrl, title) {
		setUpload(imageUrl);
		setPlate({
			url: imageUrl,
			upload: upload ?? void 0,
			templateId: engine.workflowPreset,
			idea: title ? `Node Studio: ${title}` : `Node Studio (${activeWorkflow.name})`
		});
		toast.success("Result promoted to Studio Plate");
	}
	async function handleRunWorkflow() {
		if (running) return;
		if (!validation.valid) {
			toast.error(validation.issues[0]?.message || "Fix graph validation errors before running.");
			setMobilePane("inspector");
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
				onAssetPromoted: (img, title) => promoteImageToStudio(img, title)
			}, (nodeId, res) => {
				setExecutionResults((prev) => ({
					...prev,
					[nodeId]: res
				}));
			});
			const compareNodeResult = Object.values(outcome.results).find((r) => typeof r.diffOutsideMaskPct === "number");
			addNodeRevision({
				workflowId: activeWorkflow.id,
				label: `${activeWorkflow.name} Run`,
				mode: nodeExecutionMode,
				nodeCount: activeWorkflow.nodes.length,
				edgeCount: activeWorkflow.edges.length,
				outputPreviewUrl: outcome.finalImageUrl,
				diffOutsideMaskPct: compareNodeResult?.diffOutsideMaskPct,
				snapshot: cloneWorkflow(activeWorkflow)
			});
			if (outcome.ok) toast.success(`Executed ${activeWorkflow.nodes.length} nodes cleanly`);
			else toast.warning(outcome.issues[0] || "Pipeline completed with warnings.");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Workflow execution failed.");
		} finally {
			setRunning(false);
		}
	}
	function handleSaveRevision() {
		addNodeRevision({
			workflowId: activeWorkflow.id,
			label: `${activeWorkflow.name} Snapshot`,
			mode: nodeExecutionMode,
			nodeCount: activeWorkflow.nodes.length,
			edgeCount: activeWorkflow.edges.length,
			outputPreviewUrl: latestOutputUrl,
			snapshot: cloneWorkflow(activeWorkflow)
		});
		toast.success("Saved non-destructive graph snapshot");
	}
	function handleImportJson(raw) {
		try {
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
				toast.error("JSON must contain nodes[] and edges[] arrays.");
				return;
			}
			const imported = {
				id: `wf-${Date.now().toString(36)}`,
				name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : "Imported Workflow",
				description: typeof parsed.description === "string" ? parsed.description : "Imported node workflow",
				updatedAt: Date.now(),
				nodes: parsed.nodes,
				edges: parsed.edges
			};
			upsertNodeWorkflow(imported);
			setActiveNodeWorkflowId(imported.id);
			setSelectedNodeId(imported.nodes[0]?.id ?? null);
			toast.success(`Imported "${imported.name}" (${imported.nodes.length} nodes)`);
		} catch {
			toast.error("Invalid workflow JSON syntax.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-full min-h-0 flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 md:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-0 items-center gap-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "shrink-0 whitespace-nowrap font-serif text-lg font-bold tracking-tight text-fg md:text-xl",
									children: "Node Studio"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									"aria-label": "Active workflow",
									value: activeWorkflow.id,
									onChange: (e) => {
										setActiveNodeWorkflowId(e.target.value);
										setExecutionResults({});
									},
									className: "h-8 max-w-[190px] sm:max-w-56 truncate rounded-xl border border-line bg-raised px-2.5 text-xs font-medium text-fg outline-none focus:border-[#d4b06a]",
									children: nodeWorkflows.map((wf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: wf.id,
										children: wf.name
									}, wf.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => createNodeWorkflowFromTemplate(activeWorkflow.templateId),
									title: "Duplicate active workflow",
									className: "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border border-line bg-surface px-2.5 text-xs font-medium text-muted hover:border-[#d4b06a] hover:text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " New Copy"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 font-mono text-[11px] tabular-nums text-faint",
							suppressHydrationWarning: true,
							children: [
								activeWorkflow.nodes.length,
								" nodes · ",
								activeWorkflow.edges.length,
								" wires ·",
								" ",
								validation.valid ? `DAG Valid${hydrated ? ` (${validation.durationMs}ms)` : ""}` : `${validation.issues.length} validation issue(s)`
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "group",
							"aria-label": "Execution mode",
							className: "inline-flex h-9 items-center rounded-xl border border-line bg-raised p-0.5 text-xs",
							children: [
								"local",
								"hybrid",
								"cloud"
							].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setNodeExecutionMode(m),
								className: cn("h-7.5 rounded-lg px-2.5 text-xs font-medium capitalize whitespace-nowrap transition", nodeExecutionMode === m ? "bg-[#14110f] text-[#f6efe4] shadow-xs" : "text-muted hover:text-fg"),
								children: m === "hybrid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-3 text-[#e7c27a]" }), " Hybrid"]
								}) : m
							}, m))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleSyncFromStudio,
							className: "hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-line bg-surface px-3 text-xs font-medium text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5 text-[#b08a45]" }), " Sync Studio Frame"]
						}),
						latestOutputUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								promoteImageToStudio(latestOutputUrl, activeWorkflow.name);
								navigate({ to: "/" });
							},
							className: "hover-chip inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d4b06a] bg-surface px-3 text-xs font-medium text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5 text-[#b08a45]" }), " Open in AI Canvas"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "run-workflow-btn",
							disabled: running,
							onClick: () => void handleRunWorkflow(),
							className: "gold-fill inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60",
							children: [running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5 fill-current" }), running ? "Executing DAG..." : "Run Workflow"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 gap-1 border-b border-line bg-raised px-3 py-1.5 lg:hidden",
				children: [
					["palette", "Nodes (45)"],
					["canvas", "Graph Canvas"],
					["inspector", "Inspector"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMobilePane(id),
					className: cn("h-8 flex-1 rounded-lg text-xs font-medium whitespace-nowrap", mobilePane === id ? "bg-[#14110f] text-[#f6efe4]" : "text-muted"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 grid grid-cols-1 lg:grid-cols-[264px_1fr_316px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("min-h-0 min-w-0 overflow-hidden", mobilePane === "palette" ? "block h-full" : "hidden lg:block"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeStudioSidebar, {
							workflows: nodeWorkflows,
							activeWorkflowId: activeWorkflow.id,
							revisions: nodeRevisions,
							onAddNode: (spec) => handleAddNode(spec),
							onSelectWorkflow: (id) => {
								setActiveNodeWorkflowId(id);
								setExecutionResults({});
								setMobilePane("canvas");
							},
							onLoadTemplate: handleLoadTemplate,
							onSaveRevision: handleSaveRevision,
							onRestoreRevision: (revId) => {
								restoreNodeRevision(revId);
								setExecutionResults({});
								toast.success("Restored graph revision");
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("min-h-0 min-w-0 overflow-clip", mobilePane === "canvas" ? "block h-full" : "hidden lg:block"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeStudioCanvas, {
							workflowId: activeWorkflow.id,
							nodes: activeWorkflow.nodes,
							edges: activeWorkflow.edges,
							selectedNodeId,
							executionResults,
							onSelectNode: (id) => setSelectedNodeId(id),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("min-h-0 overflow-hidden", mobilePane === "inspector" ? "block h-full" : "hidden lg:block"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeStudioInspector, {
							workflow: activeWorkflow,
							selectedNode,
							executionResults,
							validation,
							onUpdateNodeParam: handleUpdateNodeParam,
							onUpdateNodeLabel: handleUpdateNodeLabel,
							onSelectNode: (id) => setSelectedNodeId(id),
							onImportWorkflowJson: handleImportJson,
							onPromoteImageToStudio: promoteImageToStudio
						})
					})
				]
			})
		]
	});
}
export { NodeStudioPage as component };
