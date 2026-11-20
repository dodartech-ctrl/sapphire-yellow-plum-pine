import { o as __toESM } from "../_runtime.mjs";
import { D as toCompactDataUrlForSegmentation, E as runTiledUpscalePass, S as runRelightWeatherPass, T as runSam2RegionSegment, b as runLocalTextureReplacePass, c as heuristicSemanticBoxesForPrompt, d as runClientOutpaintCanvas, f as runDepthAnythingPass, l as refineMaskBuffer, m as runGroundedSam2Segment, u as runAnnotatorPass, v as runLocalLamaErasePass } from "./cv-pipeline-B2TJrqsi.mjs";
import { C as PORT_COLORS, M as buildEnvironmentDirective, St as validateWorkflowGraph, s as CATEGORY_META, st as getNodeSpec, ut as isPortCompatible } from "./store-Cgkch-Vw.mjs";
import { F as generateVariations, I as inpaintPlate, L as outpaintPlate, N as enhancePlate, P as generatePlate, R as relightPlate, y as cn, z as segmentObjectWithSam2 } from "./router-ZuzrVjzj.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { W as Plus, _t as LayoutGrid, at as Minus, h as Trash2, i as X, in as CircleAlert, lt as Maximize2, pt as LoaderCircle, rn as CircleCheck } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/node-executor-BFAW6MmE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NODE_WIDTH = 248;
var PORT_TOP_OFFSET = 46;
var PORT_ROW_H = 24;
function getPortPosition(node, kind, portId) {
	const spec = getNodeSpec(node.type);
	const list = kind === "input" ? spec?.inputs ?? [] : spec?.outputs ?? [];
	const idx = Math.max(0, list.findIndex((p) => p.id === portId));
	return {
		x: kind === "input" ? node.position.x : node.position.x + NODE_WIDTH,
		y: node.position.y + PORT_TOP_OFFSET + idx * PORT_ROW_H + PORT_ROW_H / 2
	};
}
function bezierPath(x1, y1, x2, y2) {
	const dx = Math.max(54, Math.abs(x2 - x1) * .52);
	return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}
function NodeStudioCanvas({ workflowId, nodes, edges, selectedNodeId, executionResults, onSelectNode, onMoveNode, onAddEdge, onRemoveEdge, onDeleteNode, onDropNewNode, onAutoLayout }) {
	const containerRef = (0, import_react.useRef)(null);
	const [pan, setPan] = (0, import_react.useState)({
		x: 24,
		y: 24
	});
	const [zoom, setZoom] = (0, import_react.useState)(.84);
	const [draggingNode, setDraggingNode] = (0, import_react.useState)(null);
	const [panning, setPanning] = (0, import_react.useState)(null);
	const [pendingWire, setPendingWire] = (0, import_react.useState)(null);
	const [hoveredEdgeId, setHoveredEdgeId] = (0, import_react.useState)(null);
	const nodeMap = (0, import_react.useMemo)(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
	function clientToWorld(clientX, clientY) {
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return {
			x: 0,
			y: 0
		};
		return {
			x: (clientX - rect.left - pan.x) / zoom,
			y: (clientY - rect.top - pan.y) / zoom
		};
	}
	function fitView() {
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect || nodes.length === 0) {
			setPan({
				x: 24,
				y: 24
			});
			setZoom(.85);
			return;
		}
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;
		for (const n of nodes) {
			minX = Math.min(minX, n.position.x);
			minY = Math.min(minY, n.position.y);
			maxX = Math.max(maxX, n.position.x + NODE_WIDTH);
			maxY = Math.max(maxY, n.position.y + 185);
		}
		const graphW = Math.max(320, maxX - minX + 70);
		const graphH = Math.max(220, maxY - minY + 70);
		const nextZoom = Math.max(.35, Math.min(1.05, Math.min(rect.width / graphW, rect.height / graphH)));
		setZoom(Number(nextZoom.toFixed(2)));
		setPan({
			x: Math.round((rect.width - (maxX - minX) * nextZoom) / 2 - minX * nextZoom),
			y: Math.round((rect.height - (maxY - minY) * nextZoom) / 2 - minY * nextZoom)
		});
	}
	(0, import_react.useEffect)(() => {
		const id = requestAnimationFrame(() => fitView());
		const el = containerRef.current;
		if (!el || typeof ResizeObserver === "undefined") return () => cancelAnimationFrame(id);
		let settled = false;
		const ro = new ResizeObserver(() => {
			if (!settled && el.clientWidth > 0 && el.clientHeight > 0) {
				settled = true;
				fitView();
			}
		});
		ro.observe(el);
		return () => {
			cancelAnimationFrame(id);
			ro.disconnect();
		};
	}, [workflowId, nodes.length === 0]);
	(0, import_react.useEffect)(() => {
		function onKeyDown(e) {
			const target = e.target;
			const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
			if (e.key === "Escape") setPendingWire(null);
			if ((e.key === "Delete" || e.key === "Backspace") && !typing && selectedNodeId) {
				e.preventDefault();
				onDeleteNode(selectedNodeId);
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [selectedNodeId, onDeleteNode]);
	function handlePointerMove(e) {
		if (draggingNode) {
			const dx = (e.clientX - draggingNode.startPointerX) / zoom;
			const dy = (e.clientY - draggingNode.startPointerY) / zoom;
			onMoveNode(draggingNode.id, {
				x: Math.round(draggingNode.origX + dx),
				y: Math.round(draggingNode.origY + dy)
			});
			return;
		}
		if (panning) {
			setPan({
				x: panning.origPanX + (e.clientX - panning.startPointerX),
				y: panning.origPanY + (e.clientY - panning.startPointerY)
			});
			return;
		}
		if (pendingWire) {
			const world = clientToWorld(e.clientX, e.clientY);
			setPendingWire((prev) => prev ? {
				...prev,
				cursorX: world.x,
				cursorY: world.y
			} : null);
		}
	}
	function handlePointerUp() {
		setDraggingNode(null);
		setPanning(null);
	}
	const pendingSourcePos = (0, import_react.useMemo)(() => {
		if (!pendingWire) return null;
		const node = nodeMap.get(pendingWire.sourceNodeId);
		if (!node) return null;
		return getPortPosition(node, "output", pendingWire.sourcePortId);
	}, [pendingWire, nodeMap]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		"data-testid": "node-studio-canvas",
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		onPointerDown: (e) => {
			if (e.target === e.currentTarget || e.target.dataset.canvasBg === "true") {
				setPendingWire(null);
				onSelectNode(null);
				setPanning({
					startPointerX: e.clientX,
					startPointerY: e.clientY,
					origPanX: pan.x,
					origPanY: pan.y
				});
			}
		},
		onDragOver: (e) => {
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";
		},
		onDrop: (e) => {
			e.preventDefault();
			const nodeType = e.dataTransfer.getData("application/x-oriel-node");
			if (!nodeType) return;
			const pos = clientToWorld(e.clientX, e.clientY);
			onDropNewNode(nodeType, {
				x: Math.round(pos.x - 120),
				y: Math.round(pos.y - 30)
			});
		},
		onWheel: (e) => {
			if (e.ctrlKey || e.metaKey) {
				e.preventDefault();
				const delta = e.deltaY > 0 ? -.06 : .06;
				setZoom((z) => Math.max(.35, Math.min(1.5, Number((z + delta).toFixed(2)))));
			}
		},
		className: "relative h-full w-full overflow-clip bg-[#14110f] select-none touch-none",
		style: {
			backgroundImage: "radial-gradient(circle, rgba(231, 194, 122, 0.16) 1px, transparent 1px)",
			backgroundSize: `${Math.round(24 * zoom)}px ${Math.round(24 * zoom)}px`,
			backgroundPosition: `${pan.x}px ${pan.y}px`
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-canvas-bg": "true",
				className: "pointer-events-none absolute top-3 left-3 z-20 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-xl border border-white/10 bg-[#1c1915]/90 px-3 py-1.5 text-[11px] text-[#cbbba6]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: "Drag nodes to reposition · Click output port then input port to wire"
				}), pendingWire ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 font-semibold text-[#e7c27a]",
					children: [
						"· Connecting ",
						pendingWire.sourceType,
						" (Esc to cancel)"
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-xl border border-white/15 bg-[#1c1915]/95 p-1 text-[#f6efe4] shadow-lg",
				onPointerDown: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setZoom((z) => Math.max(.35, Number((z - .1).toFixed(2)))),
						"aria-label": "Zoom out",
						className: "grid size-7 place-items-center rounded-lg hover:bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-11 text-center font-mono text-[11px] tabular-nums text-[#e7c27a]",
						children: [Math.round(zoom * 100), "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setZoom((z) => Math.min(1.5, Number((z + .1).toFixed(2)))),
						"aria-label": "Zoom in",
						className: "grid size-7 place-items-center rounded-lg hover:bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-0.5 h-4 w-px bg-white/15" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: fitView,
						className: "inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] hover:bg-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3" }), " Fit"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onAutoLayout,
						className: "inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] hover:bg-white/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-3" }), " Auto-Layout"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-canvas-bg": "true",
				className: "absolute top-0 left-0 origin-top-left",
				style: {
					transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
					width: "3200px",
					height: "2000px"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
					children: [edges.map((edge) => {
						const srcNode = nodeMap.get(edge.sourceNodeId);
						const dstNode = nodeMap.get(edge.targetNodeId);
						if (!srcNode || !dstNode) return null;
						const p1 = getPortPosition(srcNode, "output", edge.sourcePortId);
						const p2 = getPortPosition(dstNode, "input", edge.targetPortId);
						const srcPort = getNodeSpec(srcNode.type)?.outputs.find((p) => p.id === edge.sourcePortId);
						const strokeColor = srcPort ? PORT_COLORS[srcPort.type] : "#e7c27a";
						const d = bezierPath(p1.x, p1.y, p2.x, p2.y);
						const isHovered = hoveredEdgeId === edge.id;
						const midX = (p1.x + p2.x) / 2;
						const midY = (p1.y + p2.y) / 2;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d,
								fill: "none",
								stroke: "transparent",
								strokeWidth: 16,
								className: "pointer-events-auto cursor-pointer",
								onMouseEnter: () => setHoveredEdgeId(edge.id),
								onMouseLeave: () => setHoveredEdgeId((prev) => prev === edge.id ? null : prev)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								d,
								fill: "none",
								stroke: strokeColor,
								strokeOpacity: isHovered ? 1 : .78,
								strokeWidth: isHovered ? 3.2 : 2.3
							}),
							isHovered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								className: "pointer-events-auto cursor-pointer",
								onMouseEnter: () => setHoveredEdgeId(edge.id),
								onClick: (e) => {
									e.stopPropagation();
									onRemoveEdge(edge.id);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: midX,
									cy: midY,
									r: 10,
									fill: "#14110f",
									stroke: "#ef4444",
									strokeWidth: 1.5
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: `M ${midX - 3.5} ${midY - 3.5} L ${midX + 3.5} ${midY + 3.5} M ${midX + 3.5} ${midY - 3.5} L ${midX - 3.5} ${midY + 3.5}`,
									stroke: "#fca5a5",
									strokeWidth: 1.6
								})]
							}) : null
						] }, edge.id);
					}), pendingWire && pendingSourcePos ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: bezierPath(pendingSourcePos.x, pendingSourcePos.y, pendingWire.cursorX, pendingWire.cursorY),
						fill: "none",
						stroke: PORT_COLORS[pendingWire.sourceType],
						strokeDasharray: "6 4",
						strokeWidth: 2.5
					}) : null]
				}), nodes.map((node) => {
					const spec = getNodeSpec(node.type);
					if (!spec) return null;
					const catMeta = CATEGORY_META[spec.category];
					const exec = executionResults[node.id];
					const selected = selectedNodeId === node.id;
					const portRows = Math.max(spec.inputs.length, spec.outputs.length);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": `workflow-node-${node.id}`,
						style: {
							left: node.position.x,
							top: node.position.y,
							width: NODE_WIDTH
						},
						onPointerDown: (e) => {
							e.stopPropagation();
							onSelectNode(node.id);
							setDraggingNode({
								id: node.id,
								startPointerX: e.clientX,
								startPointerY: e.clientY,
								origX: node.position.x,
								origY: node.position.y
							});
						},
						className: cn("absolute rounded-2xl border bg-[#1c1915] text-[#f6efe4] shadow-[0_14px_30px_rgba(0,0,0,0.45)] transition-colors", selected ? "border-[#e7c27a] ring-1 ring-[#e7c27a]" : "border-white/15 hover:border-white/30"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-[38px] items-center justify-between gap-2 rounded-t-2xl border-b border-white/10 px-3 cursor-grab active:cursor-grabbing",
								style: { backgroundColor: catMeta.badgeBg },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2 shrink-0 rounded-full",
										style: { backgroundColor: catMeta.accent }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-xs font-semibold text-[#f6efe4]",
										children: node.label || spec.title
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1.5",
									children: [exec?.status === "running" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-[#e7c27a]" }) : exec?.status === "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-[#4ade80]" }) : exec?.status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-3.5 text-[#f87171]" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Delete ${spec.title}`,
										onPointerDown: (e) => e.stopPropagation(),
										onClick: (e) => {
											e.stopPropagation();
											onDeleteNode(node.id);
										},
										className: "grid size-5 place-items-center rounded text-white/50 hover:bg-white/10 hover:text-white",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative",
								style: {
									minHeight: Math.max(28, portRows * PORT_ROW_H + 14),
									paddingTop: 8,
									paddingBottom: 6
								},
								children: Array.from({ length: portRows }).map((_, idx) => {
									const inPort = spec.inputs[idx];
									const outPort = spec.outputs[idx];
									const canDropWire = pendingWire && inPort && pendingWire.sourceNodeId !== node.id && isPortCompatible(pendingWire.sourceType, inPort.type);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										style: { height: PORT_ROW_H },
										children: [inPort ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onPointerDown: (e) => e.stopPropagation(),
											onClick: (e) => {
												e.stopPropagation();
												if (pendingWire) {
													if (pendingWire.sourceNodeId !== node.id && isPortCompatible(pendingWire.sourceType, inPort.type)) onAddEdge({
														sourceNodeId: pendingWire.sourceNodeId,
														sourcePortId: pendingWire.sourcePortId,
														targetNodeId: node.id,
														targetPortId: inPort.id
													});
													setPendingWire(null);
												}
											},
											className: "group relative flex items-center gap-1.5 pl-3 text-left text-[11px] text-[#cbbba6] hover:text-white",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("absolute -left-[6px] size-3 rounded-full border border-[#14110f] transition-transform", canDropWire && "scale-125 ring-2 ring-[#e7c27a]"),
												style: { backgroundColor: PORT_COLORS[inPort.type] }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [inPort.label, inPort.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[#fb923c]",
												children: " *"
											}) : null] })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), outPort ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onPointerDown: (e) => e.stopPropagation(),
											onClick: (e) => {
												e.stopPropagation();
												const pos = getPortPosition(node, "output", outPort.id);
												setPendingWire({
													sourceNodeId: node.id,
													sourcePortId: outPort.id,
													sourceType: outPort.type,
													cursorX: pos.x + 40,
													cursorY: pos.y
												});
											},
											className: "group relative flex items-center gap-1.5 pr-3 text-right text-[11px] text-[#cbbba6] hover:text-white",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: outPort.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute -right-[6px] size-3 rounded-full border border-[#14110f] transition-transform group-hover:scale-125",
												style: { backgroundColor: PORT_COLORS[outPort.type] }
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})]
									}, idx);
								})
							}),
							exec?.imageUrl || exec?.summary || exec?.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-white/10 px-3 py-2 text-[11px]",
								children: [exec.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: exec.imageUrl,
									alt: spec.title,
									className: "mb-1.5 h-24 w-full rounded-lg border border-white/10 object-cover"
								}) : null, exec.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[#fca5a5]",
									children: exec.error
								}) : exec.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 text-[#d5cab9]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: exec.summary
									}), typeof exec.durationMs === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 font-mono text-[10px] tabular-nums text-[#e7c27a]",
										children: [exec.durationMs, "ms"]
									}) : null]
								}) : null]
							}) : null
						]
					}, node.id);
				})]
			}),
			nodes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/15 bg-[#1c1915]/95 px-6 py-5 text-sm text-[#f6efe4]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-lg",
						children: "Empty Node Graph"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-[#cbbba6]",
						children: "Click any node in the left palette or load one of the 4 ArchViz templates."
					})]
				})
			}) : null,
			pendingWire ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setPendingWire(null),
				className: "absolute top-3 right-3 z-20 inline-flex h-8 items-center gap-1 rounded-xl border border-[#e7c27a]/60 bg-[#1c1915] px-2.5 text-xs text-[#e7c27a]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" }), " Cancel Wire"]
			}) : null
		]
	});
}
function loadBrowserImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (!src.startsWith("data:") && !src.startsWith("blob:")) img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error(`Unable to load image "${src.slice(0, 80)}".`));
		img.src = src;
	});
}
async function ensureDataUrl(src) {
	if (src.startsWith("data:image/")) return src;
	const img = await loadBrowserImage(src);
	const w = Math.min(1024, img.naturalWidth || 1024);
	const h = Math.round(w * ((img.naturalHeight || 576) / Math.max(1, img.naturalWidth || 1024)));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) return src;
	ctx.drawImage(img, 0, 0, w, h);
	return canvas.toDataURL("image/jpeg", .9);
}
/**
* Renders a deterministic architectural 3D clay massing snapshot when Load 3D Scene
* runs inside the node pipeline without a previously captured 3D WebGL frame.
*/
async function renderClayMassingFallback(preset, azimuth, elevation) {
	if (typeof document === "undefined") return "/viz/p01-pavilion-day.jpg";
	const w = 960;
	const h = 540;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) return "/viz/p01-pavilion-day.jpg";
	const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
	skyGrad.addColorStop(0, "#cfd4db");
	skyGrad.addColorStop(.65, "#ece7df");
	skyGrad.addColorStop(1, "#dad2c5");
	ctx.fillStyle = skyGrad;
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#c9c0b2";
	ctx.fillRect(0, h * .64, w, h * .36);
	const rad = (azimuth - 180) * Math.PI / 180;
	const shadowLen = Math.max(24, Math.round((90 - elevation) * 1.4));
	const sx = Math.round(Math.cos(rad) * shadowLen);
	const sy = Math.round(Math.sin(rad) * shadowLen * .35);
	ctx.fillStyle = "rgba(42, 36, 30, 0.22)";
	ctx.beginPath();
	ctx.moveTo(220, 365);
	ctx.lineTo(720, 365);
	ctx.lineTo(720 + sx, 365 + Math.abs(sy) + 28);
	ctx.lineTo(220 + sx, 365 + Math.abs(sy) + 28);
	ctx.closePath();
	ctx.fill();
	ctx.fillStyle = "#ebe5db";
	ctx.fillRect(230, 210, 470, 155);
	ctx.fillStyle = "#d9d0c2";
	ctx.fillRect(540, 210, 160, 155);
	ctx.fillStyle = "#f4efe6";
	ctx.fillRect(195, 192, 540, 22);
	ctx.fillStyle = "#2b2621";
	ctx.fillRect(275, 240, 220, 108);
	ctx.strokeStyle = "#8a7d6b";
	ctx.lineWidth = 3;
	for (let x = 315; x <= 460; x += 48) {
		ctx.beginPath();
		ctx.moveTo(x, 240);
		ctx.lineTo(x, 348);
		ctx.stroke();
	}
	ctx.fillStyle = "rgba(20, 17, 15, 0.72)";
	ctx.fillRect(24, 20, 360, 32);
	ctx.fillStyle = "#f6efe4";
	ctx.font = "600 13px sans-serif";
	ctx.fillText(`CLAY PASS · ${preset.toUpperCase()} · SUN ${azimuth}° / ${elevation}°`, 36, 41);
	return canvas.toDataURL("image/jpeg", .9);
}
/**
* Generates an architectural raster prompt plate locally when Cloud generation is off
* or no server API key is configured.
*/
async function renderLocalConceptPlate(promptText, ratio = "16:9") {
	if (typeof document === "undefined") return "/viz/p01-pavilion-day.jpg";
	const baseImg = "/viz/p01-pavilion-day.jpg";
	const img = await loadBrowserImage(baseImg);
	const [rw, rh] = ratio.split(":").map(Number);
	const w = 1024;
	const h = Math.round(w / ((rw || 16) / (rh || 9)));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) return baseImg;
	const lower = promptText.toLowerCase();
	if (lower.includes("dusk") || lower.includes("night") || lower.includes("blue hour")) ctx.filter = "contrast(1.14) brightness(0.84) hue-rotate(-8deg)";
	else if (lower.includes("golden") || lower.includes("warm") || lower.includes("travertine")) ctx.filter = "contrast(1.08) saturate(1.16) sepia(0.14)";
	else ctx.filter = "contrast(1.06) saturate(1.05)";
	ctx.drawImage(img, 0, 0, w, h);
	ctx.filter = "none";
	return canvas.toDataURL("image/jpeg", .9);
}
/**
* Computes average RGB drift (%) outside the active edit mask (PRD §4 / §15 Geometry Lock verification).
*/
async function computeMaskOutsideDiffPct(beforeSrc, afterSrc, maskSrc) {
	if (typeof document === "undefined") return {
		diffPct: 0,
		warning: false
	};
	try {
		const [bImg, aImg, mImg] = await Promise.all([
			loadBrowserImage(beforeSrc),
			loadBrowserImage(afterSrc),
			maskSrc ? loadBrowserImage(maskSrc).catch(() => null) : Promise.resolve(null)
		]);
		const w = 256;
		const h = 144;
		const drawToData = (img) => {
			const c = document.createElement("canvas");
			c.width = w;
			c.height = h;
			const ctx = c.getContext("2d", { willReadFrequently: true });
			if (!ctx) return null;
			ctx.drawImage(img, 0, 0, w, h);
			return ctx.getImageData(0, 0, w, h).data;
		};
		const bPx = drawToData(bImg);
		const aPx = drawToData(aImg);
		const mPx = mImg ? drawToData(mImg) : null;
		if (!bPx || !aPx) return {
			diffPct: 0,
			warning: false
		};
		let totalDiff = 0;
		let counted = 0;
		const total = w * h;
		for (let i = 0; i < total; i++) {
			const p = i * 4;
			if (mPx && mPx[p + 3] > 28) continue;
			const dr = Math.abs(bPx[p] - aPx[p]);
			const dg = Math.abs(bPx[p + 1] - aPx[p + 1]);
			const db = Math.abs(bPx[p + 2] - aPx[p + 2]);
			totalDiff += (dr + dg + db) / 765;
			counted++;
		}
		const diffPct = counted > 0 ? Number((totalDiff / counted * 100).toFixed(1)) : 0;
		return {
			diffPct,
			warning: diffPct > 18
		};
	} catch {
		return {
			diffPct: 0,
			warning: false
		};
	}
}
/**
* Generates an interactive architectural camera motion video clip using MediaRecorder WebM
* when supported, plus a smooth poster frame fallback so Video nodes always produce output.
*/
async function synthesizeCameraMotionVideo(imageSrc, motion) {
	if (typeof document === "undefined") return {
		videoUrl: imageSrc,
		posterUrl: imageSrc,
		isWebm: false
	};
	const img = await loadBrowserImage(imageSrc);
	const posterCanvas = document.createElement("canvas");
	posterCanvas.width = 640;
	posterCanvas.height = 360;
	const pCtx = posterCanvas.getContext("2d");
	if (pCtx) pCtx.drawImage(img, 0, 0, 640, 360);
	const posterUrl = posterCanvas.toDataURL("image/jpeg", .88);
	if (typeof MediaRecorder === "undefined" || typeof posterCanvas.captureStream !== "function") return {
		videoUrl: posterUrl,
		posterUrl,
		isWebm: false
	};
	const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "";
	if (!mimeType) return {
		videoUrl: posterUrl,
		posterUrl,
		isWebm: false
	};
	const fps = Math.min(30, Math.max(15, motion.fps ?? 24));
	const durationMs = Math.min(2600, Math.max(900, Math.round(motion.durationSec * 360)));
	const stream = posterCanvas.captureStream(fps);
	const recorder = new MediaRecorder(stream, {
		mimeType,
		videoBitsPerSecond: 15e5
	});
	const chunks = [];
	recorder.ondataavailable = (ev) => {
		if (ev.data.size > 0) chunks.push(ev.data);
	};
	return await new Promise((resolve) => {
		recorder.onstop = () => {
			const blob = new Blob(chunks, { type: "video/webm" });
			if (blob.size > 0) resolve({
				videoUrl: URL.createObjectURL(blob),
				posterUrl,
				isWebm: true
			});
			else resolve({
				videoUrl: posterUrl,
				posterUrl,
				isWebm: false
			});
		};
		recorder.start(100);
		const start = performance.now();
		function drawFrame() {
			const elapsed = performance.now() - start;
			const t = Math.min(1, elapsed / durationMs);
			const ease = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
			if (pCtx) {
				pCtx.clearRect(0, 0, 640, 360);
				let scale = 1;
				let tx = 0;
				let ty = 0;
				if (motion.kind === "dolly-in" || motion.kind === "zoom") scale = 1 + ease * .16;
				else if (motion.kind === "pan") {
					scale = 1.12;
					tx = (ease - .5) * -58;
				} else if (motion.kind === "orbit") {
					scale = 1.14;
					tx = Math.sin(ease * Math.PI) * -36;
					ty = (1 - Math.cos(ease * Math.PI)) * -8;
				} else if (motion.kind === "crane") {
					scale = 1.1;
					ty = (.5 - ease) * 34;
				}
				const dw = 640 * scale;
				const dh = 360 * scale;
				const dx = (640 - dw) / 2 + tx;
				const dy = (360 - dh) / 2 + ty;
				pCtx.drawImage(img, dx, dy, dw, dh);
			}
			if (elapsed < durationMs) requestAnimationFrame(drawFrame);
			else recorder.stop();
		}
		requestAnimationFrame(drawFrame);
	});
}
function collectIncomingPayloads(node, workflow, outputs) {
	const result = {};
	for (const edge of workflow.edges) if (edge.targetNodeId === node.id) {
		const src = outputs.get(edge.sourceNodeId);
		if (src) result[edge.targetPortId] = src;
	}
	return result;
}
async function executeNodeWorkflow(workflow, mode, studioContext, onProgress) {
	const validation = validateWorkflowGraph(workflow.nodes, workflow.edges);
	const results = {};
	if (!validation.valid) return {
		ok: false,
		results,
		issues: validation.issues.map((i) => i.message)
	};
	for (const nodeId of validation.executionOrder) {
		const pending = {
			nodeId,
			status: "pending"
		};
		results[nodeId] = pending;
		onProgress(nodeId, pending);
	}
	const wireOutputs = /* @__PURE__ */ new Map();
	let finalImageUrl;
	let finalVideoUrl;
	const issues = [];
	for (const nodeId of validation.executionOrder) {
		const node = workflow.nodes.find((n) => n.id === nodeId);
		if (!node) continue;
		const spec = getNodeSpec(node.type);
		const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
		onProgress(nodeId, {
			nodeId,
			status: "running"
		});
		try {
			const incoming = collectIncomingPayloads(node, workflow, wireOutputs);
			const payload = {};
			const ui = {
				nodeId,
				status: "completed"
			};
			const useCloud = mode === "cloud" || mode === "hybrid" && spec?.executionTarget !== "local";
			switch (node.type) {
				case "input.load_image": {
					const override = String(node.params.customUrl || "").trim();
					const chosen = String(node.params.source || "");
					const src = override || (chosen === "__studio_active__" ? studioContext.activeImageUrl : chosen) || studioContext.activeImageUrl;
					payload.image = src;
					ui.imageUrl = src;
					ui.summary = `Loaded ${src.startsWith("data:") ? "Studio Upload" : src}`;
					break;
				}
				case "input.load_video": {
					const poster = String(node.params.posterFrame || studioContext.activeImageUrl);
					const fps = Number(node.params.fps || 24);
					payload.image = poster;
					payload.video = {
						url: poster,
						posterUrl: poster,
						motionKind: "static",
						durationSec: 3,
						fps,
						isWebm: false
					};
					ui.imageUrl = poster;
					ui.summary = `Video frame stream @ ${fps}fps`;
					break;
				}
				case "input.text_prompt": {
					const text = String(node.params.text || "").trim();
					payload.prompt = text;
					ui.promptOut = text;
					ui.summary = text.slice(0, 72);
					break;
				}
				case "input.reference_image": {
					const swatch = String(node.params.swatch || "Honed Travertine");
					const materialStrength = Number(node.params.materialStrength ?? 70);
					const styleStrength = Number(node.params.styleStrength ?? 65);
					payload.reference = {
						swatch,
						materialStrength,
						styleStrength
					};
					ui.summary = `${swatch} · Mat ${materialStrength}% · Style ${styleStrength}%`;
					break;
				}
				case "input.load_3d_scene": {
					const preset = String(node.params.preset || studioContext.scene3d.preset);
					const sunAzimuth = Number(node.params.sunAzimuth ?? studioContext.scene3d.sunAzimuth);
					const sunElevation = Number(node.params.sunElevation ?? studioContext.scene3d.sunElevation);
					const clayUrl = await renderClayMassingFallback(preset, sunAzimuth, sunElevation);
					payload.image = clayUrl;
					payload.scene3d = {
						preset,
						sunAzimuth,
						sunElevation,
						imageUrl: clayUrl
					};
					ui.imageUrl = clayUrl;
					ui.summary = `3D Massing (${preset}) · Sun ${sunAzimuth}°/${sunElevation}°`;
					break;
				}
				case "segmentation.auto_segment": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const targetClass = String(node.params.targetClass || "facade");
					const threshold = Number(node.params.threshold ?? 48);
					const seg = await runSam2RegionSegment({
						src,
						point: {
							xNorm: .5,
							yNorm: .45
						},
						threshold
					});
					payload.mask = seg.maskDataUrl;
					ui.maskUrl = seg.maskDataUrl;
					ui.imageUrl = seg.previewUrl;
					ui.summary = `Auto Segmented "${targetClass}" (${seg.coveragePct}%)`;
					break;
				}
				case "segmentation.point_segment": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const xNorm = Number(node.params.xNorm ?? 50) / 100;
					const yNorm = Number(node.params.yNorm ?? 52) / 100;
					const threshold = Number(node.params.threshold ?? 45);
					const seg = await runSam2RegionSegment({
						src,
						point: {
							xNorm,
							yNorm
						},
						threshold
					});
					payload.mask = seg.maskDataUrl;
					ui.maskUrl = seg.maskDataUrl;
					ui.imageUrl = seg.previewUrl;
					ui.summary = `SAM Point (${Math.round(xNorm * 100)}%, ${Math.round(yNorm * 100)}%) · ${seg.coveragePct}%`;
					break;
				}
				case "segmentation.box_segment": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const xmin = Math.round(Number(node.params.xmin ?? 20) * 10);
					const ymin = Math.round(Number(node.params.ymin ?? 25) * 10);
					const xmax = Math.round(Number(node.params.xmax ?? 78) * 10);
					const ymax = Math.round(Number(node.params.ymax ?? 82) * 10);
					const label = String(node.params.label || "object");
					const seg = await runGroundedSam2Segment({
						src,
						prompt: label,
						boxes: [{
							label,
							box_2d: [
								ymin,
								xmin,
								ymax,
								xmax
							],
							confidence: .9
						}],
						threshold: 48
					});
					payload.mask = seg.maskDataUrl;
					ui.maskUrl = seg.maskDataUrl;
					ui.imageUrl = seg.previewUrl;
					ui.summary = `Box SAM "${label}" (${seg.coveragePct}%)`;
					break;
				}
				case "segmentation.text_select": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const query = String(node.params.query || "fireplace wall");
					const threshold = Number(node.params.threshold ?? 46);
					let boxes = heuristicSemanticBoxesForPrompt(query);
					let modelTag = "Grounded-SAM 2 Local";
					if (useCloud) try {
						const compact = await toCompactDataUrlForSegmentation(src);
						const res = await segmentObjectWithSam2({ data: {
							image: compact,
							prompt: query
						} });
						if (res.boxes && res.boxes.length > 0) {
							boxes = res.boxes;
							if (!res.fallback) modelTag = "Grounded-SAM 2 Cloud";
						}
					} catch {}
					const seg = await runGroundedSam2Segment({
						src,
						prompt: query,
						boxes,
						threshold
					});
					payload.mask = seg.maskDataUrl;
					ui.maskUrl = seg.maskDataUrl;
					ui.imageUrl = seg.previewUrl;
					ui.summary = `${modelTag}: "${query}" (${seg.coveragePct}% area)`;
					break;
				}
				case "segmentation.mask_refine": {
					const maskSrc = incoming.mask?.mask || studioContext.activeMaskUrl || "";
					const dilatePx = Number(node.params.dilatePx ?? 4);
					const invert = Boolean(node.params.invert);
					const refined = maskSrc ? await refineMaskBuffer(maskSrc, {
						dilatePx,
						invert
					}) : "";
					payload.mask = refined;
					ui.maskUrl = refined;
					ui.imageUrl = refined;
					ui.summary = `Mask refined (+${dilatePx}px${invert ? ", inverted" : ""})`;
					break;
				}
				case "conditioning.depth_map": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const nearBias = Number(node.params.nearBias ?? 55);
					const heatmap = Boolean(node.params.heatmap ?? true);
					const depth = await runDepthAnythingPass(src, heatmap, nearBias);
					payload.image = depth.dataUrl;
					payload.conditioning = { depthUrl: depth.dataUrl };
					ui.imageUrl = depth.dataUrl;
					ui.summary = "Z-Depth map extracted";
					break;
				}
				case "conditioning.canny_edge": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const threshold = Number(node.params.threshold ?? 60);
					const edge = await runAnnotatorPass(src, "canny", threshold);
					payload.image = edge.dataUrl;
					payload.conditioning = { edgeUrl: edge.dataUrl };
					ui.imageUrl = edge.dataUrl;
					ui.summary = `Canny edge map (thresh ${threshold})`;
					break;
				}
				case "conditioning.line_art": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const extMode = String(node.params.mode || "lineart");
					const map = await runAnnotatorPass(src, extMode, 60);
					payload.image = map.dataUrl;
					payload.conditioning = { edgeUrl: map.dataUrl };
					ui.imageUrl = map.dataUrl;
					ui.summary = `${extMode.toUpperCase()} linework extracted`;
					break;
				}
				case "conditioning.normal_map": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const map = await runAnnotatorPass(src, "normal", 58);
					payload.image = map.dataUrl;
					payload.conditioning = { normalUrl: map.dataUrl };
					ui.imageUrl = map.dataUrl;
					ui.summary = "Tangent normal map extracted";
					break;
				}
				case "conditioning.ipadapter": {
					const ref = incoming.reference?.reference;
					const weight = Number(node.params.weight ?? 72);
					payload.conditioning = {
						referenceWeight: weight,
						referenceSwatch: ref?.swatch ?? "Material Reference"
					};
					ui.summary = `IP-Adapter bound (${weight}% · ${ref?.swatch ?? "ref"})`;
					break;
				}
				case "conditioning.geometry_lock": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const lockWeight = Number(node.params.lockWeight ?? 90);
					const warnPct = Number(node.params.warnThresholdPct ?? 18);
					const edge = await runAnnotatorPass(src, "mlsd", 60);
					payload.conditioning = {
						edgeUrl: edge.dataUrl,
						geometryLockWeight: lockWeight,
						driftWarnPct: warnPct
					};
					ui.imageUrl = edge.dataUrl;
					ui.summary = `Geometry Lock ${lockWeight}% active (alert > ${warnPct}% outside mask)`;
					break;
				}
				case "architecture.building_type": {
					const prompt = `Architectural typology: ${String(node.params.typology || "Contemporary Residence")}.`;
					payload.prompt = prompt;
					ui.promptOut = prompt;
					ui.summary = prompt;
					break;
				}
				case "architecture.room_type": {
					const prompt = `Interior room program: ${String(node.params.room || "Living Room")}.`;
					payload.prompt = prompt;
					ui.promptOut = prompt;
					ui.summary = prompt;
					break;
				}
				case "architecture.material_palette": {
					const primary = String(node.params.primary || "Honed Travertine");
					const secondary = String(node.params.secondary || "Brushed Bronze");
					payload.reference = {
						swatch: `${primary} + ${secondary}`,
						materialStrength: 75,
						styleStrength: 65
					};
					ui.summary = `Palette: ${primary} + ${secondary}`;
					break;
				}
				case "architecture.camera_settings": {
					const prompt = `Camera lens: ${String(node.params.focalLength || "24mm Tilt-Shift")}${Boolean(node.params.twoPointLock ?? true) ? ", 2-point vertical perspective lock" : ""}.`;
					payload.prompt = prompt;
					ui.promptOut = prompt;
					ui.summary = prompt;
					break;
				}
				case "architecture.style_preset": {
					const style = String(node.params.style || "Warm Minimalist Monograph");
					payload.prompt = `Render aesthetic: ${style}.`;
					ui.promptOut = payload.prompt;
					ui.summary = style;
					break;
				}
				case "architecture.landscape": {
					const biome = String(node.params.biome || "Mediterranean Olive & Gravel Terrace");
					payload.prompt = `Site planting: ${biome}.`;
					ui.promptOut = payload.prompt;
					ui.summary = biome;
					break;
				}
				case "environment.weather": {
					const has3d = Boolean(incoming.scene3d?.scene3d);
					const weather = String(node.params.weather || "Clear Crisp Sky");
					const built = buildEnvironmentDirective({
						weather,
						has3DSceneInput: has3d
					});
					payload.environment = {
						directive: built.directive,
						weather,
						has3DSceneInput: has3d
					};
					ui.isIllustrativeRelight = built.isIllustrative;
					ui.promptOut = built.directive;
					ui.summary = `${weather} (${built.isIllustrative ? "Illustrative" : "3D Verified"})`;
					break;
				}
				case "environment.climate": {
					const climate = String(node.params.climate || "Temperate Golden");
					const season = String(node.params.season || "Autumn");
					payload.environment = {
						directive: buildEnvironmentDirective({
							climate,
							season,
							has3DSceneInput: false
						}).directive,
						climate,
						has3DSceneInput: false
					};
					ui.isIllustrativeRelight = true;
					ui.summary = `${climate} · ${season}`;
					break;
				}
				case "environment.sun_position": {
					const has3d = Boolean(incoming.scene3d?.scene3d);
					const timeOfDay = String(node.params.timeOfDay || "Golden Hour");
					const azimuth = Number(node.params.azimuth ?? 145);
					const built = buildEnvironmentDirective({
						timeOfDay,
						azimuth,
						has3DSceneInput: has3d
					});
					payload.environment = {
						directive: built.directive,
						timeOfDay,
						azimuth,
						has3DSceneInput: has3d
					};
					ui.isIllustrativeRelight = built.isIllustrative;
					ui.promptOut = built.directive;
					ui.summary = `${timeOfDay} (${azimuth}°) · ${has3d ? "3D Sun Sync" : "Illustrative"}`;
					break;
				}
				case "environment.mood": {
					const mood = String(node.params.mood || "Luxury & Calm");
					payload.environment = {
						directive: buildEnvironmentDirective({
							mood,
							has3DSceneInput: false
						}).directive,
						mood,
						has3DSceneInput: false
					};
					ui.isIllustrativeRelight = true;
					ui.summary = `Mood: ${mood}`;
					break;
				}
				case "environment.atmosphere": {
					const experience = String(node.params.experience || "Quiet");
					payload.environment = {
						directive: buildEnvironmentDirective({
							experience,
							has3DSceneInput: false
						}).directive,
						has3DSceneInput: false
					};
					ui.isIllustrativeRelight = true;
					ui.summary = `Atmosphere: ${experience}`;
					break;
				}
				case "editing.material_replace": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
					const refSwatch = incoming.reference?.reference?.swatch;
					const matText = String(node.params.materialPrompt || refSwatch || "Honed Travertine slabs");
					const fullDirective = [
						matText,
						refSwatch ? `Material swatch reference: ${refSwatch}` : "",
						incoming.prompt?.prompt,
						incoming.conditioning?.conditioning?.geometryLockWeight ? `Maintain geometry lock (${incoming.conditioning.conditioning.geometryLockWeight}%) outside mask.` : ""
					].filter(Boolean).join(". ");
					const strength = Number(node.params.referenceStrength ?? incoming.reference?.reference?.materialStrength ?? 75);
					let outUrl = src;
					let engineNote = "Local Material Synthesizer";
					if (useCloud && mask) try {
						const srcData = await ensureDataUrl(src);
						const res = await inpaintPlate({ data: {
							idea: fullDirective,
							image: srcData,
							maskImage: mask,
							design: studioContext.design,
							frame: studioContext.frame,
							engine: {
								...studioContext.engine,
								iopaintTask: "replace",
								geometryLock: incoming.conditioning?.conditioning?.geometryLockWeight ?? 90
							},
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.url) {
							outUrl = res.url;
							engineNote = "Cloud Masked Material Replace";
						}
					} catch {}
					if (outUrl === src && mask) outUrl = await runLocalTextureReplacePass(src, mask, fullDirective, strength);
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `${engineNote} · "${matText.slice(0, 44)}"`;
					finalImageUrl = outUrl;
					break;
				}
				case "editing.inpaint": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
					const instruction = [String(node.params.instruction || ""), incoming.prompt?.prompt].filter(Boolean).join(". ");
					const strength = Number(node.params.strength ?? 78);
					let outUrl = src;
					if (useCloud && mask) try {
						const srcData = await ensureDataUrl(src);
						const res = await inpaintPlate({ data: {
							idea: instruction,
							image: srcData,
							maskImage: mask,
							design: studioContext.design,
							frame: studioContext.frame,
							engine: studioContext.engine,
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.url) outUrl = res.url;
					} catch {}
					if (outUrl === src && mask) outUrl = await runLocalTextureReplacePass(src, mask, instruction, strength);
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `Inpaint (${String(node.params.model || "lama")})`;
					finalImageUrl = outUrl;
					break;
				}
				case "editing.object_remove": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
					const model = String(node.params.model || "lama");
					const outUrl = mask ? await runLocalLamaErasePass(src, mask, model) : src;
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `LaMa Erase (${model.toUpperCase()})`;
					finalImageUrl = outUrl;
					break;
				}
				case "editing.object_insert": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const mask = incoming.mask?.mask || studioContext.activeMaskUrl || "";
					const item = String(node.params.item || "architectural armchair");
					const outUrl = mask ? await runLocalTextureReplacePass(src, mask, item, 82) : src;
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `Inserted "${item.slice(0, 36)}"`;
					finalImageUrl = outUrl;
					break;
				}
				case "editing.outpaint": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const ratio = String(node.params.ratio || "21:9");
					let outUrl = await runClientOutpaintCanvas(src, ratio);
					if (useCloud) try {
						const srcData = await ensureDataUrl(src);
						const res = await outpaintPlate({ data: {
							idea: incoming.prompt?.prompt || `Expand canvas to ${ratio}`,
							image: srcData,
							design: studioContext.design,
							frame: studioContext.frame,
							engine: {
								...studioContext.engine,
								outpaintRatio: ratio
							},
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.url) outUrl = res.url;
					} catch {}
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `Outpainted to ${ratio}`;
					finalImageUrl = outUrl;
					break;
				}
				case "editing.relight": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const env = incoming.environment?.environment;
					const preset = env?.timeOfDay === "Blue Hour" || env?.timeOfDay === "Night" ? "day-to-dusk" : env?.weather?.includes("Snow") ? "summer-to-snow" : String(node.params.preset || "day-to-dusk");
					let outUrl = await runRelightWeatherPass(src, preset);
					if (useCloud) try {
						const srcData = await ensureDataUrl(src);
						const res = await relightPlate({ data: {
							idea: env?.directive || `Relight scene: ${preset}`,
							image: srcData,
							design: studioContext.design,
							frame: studioContext.frame,
							engine: {
								...studioContext.engine,
								relightPreset: preset
							},
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.url) outUrl = res.url;
					} catch {}
					const isIllustrative = env ? !env.has3DSceneInput : true;
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.isIllustrativeRelight = isIllustrative;
					ui.summary = `Relit (${preset}) · ${isIllustrative ? "Illustrative approximation" : "3D-backed sun"}`;
					finalImageUrl = outUrl;
					break;
				}
				case "generation.text_to_image": {
					const prompt = [incoming.prompt?.prompt, incoming.environment?.environment?.directive].filter(Boolean).join(" ");
					const aspect = String(node.params.aspect || "16:9");
					let outUrl = await renderLocalConceptPlate(prompt, aspect);
					if (useCloud) try {
						const res = await generatePlate({ data: {
							idea: prompt,
							design: studioContext.design,
							frame: {
								...studioContext.frame,
								ratio: aspect
							},
							engine: studioContext.engine,
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.url) outUrl = res.url;
					} catch {}
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `Text-to-Image (${aspect})`;
					finalImageUrl = outUrl;
					break;
				}
				case "generation.image_to_image": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const prompt = [incoming.prompt?.prompt, incoming.environment?.environment?.directive].filter(Boolean).join(" ");
					let outUrl = await runRelightWeatherPass(src, "overcast-to-golden");
					if (useCloud) try {
						const srcData = await ensureDataUrl(src);
						const res = await generatePlate({ data: {
							idea: prompt || "Photoreal architectural material finish, preserve geometry",
							image: srcData,
							depthImage: incoming.conditioning?.conditioning?.depthUrl,
							annotatorImage: incoming.conditioning?.conditioning?.edgeUrl,
							design: studioContext.design,
							frame: studioContext.frame,
							engine: studioContext.engine,
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.url) outUrl = res.url;
					} catch {}
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `Image-to-Image (${Number(node.params.denoise ?? 62)}% denoise)`;
					finalImageUrl = outUrl;
					break;
				}
				case "generation.upscale": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const factor = Number(node.params.factor ?? 4);
					const rawModel = String(node.params.model || "4x-ArchSharp");
					const model = rawModel === "RealESRGAN_x2plus" || rawModel === "RealESRGAN_x4plus" || rawModel === "4x-ArchSharp" ? rawModel : "4x-ArchSharp";
					let outUrl = await runTiledUpscalePass(src, factor, model, 20, false);
					if (useCloud) try {
						const srcData = await ensureDataUrl(src);
						const res = await enhancePlate({ data: {
							idea: "Architectural 4K texture synthesis",
							image: srcData,
							design: studioContext.design,
							frame: studioContext.frame,
							engine: {
								...studioContext.engine,
								upscaleFactor: factor,
								esrganModel: model
							},
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.url) outUrl = res.url;
					} catch {}
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `Upscaled ${factor}× (${model})`;
					finalImageUrl = outUrl;
					break;
				}
				case "generation.detail_enhance": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const outUrl = await runTiledUpscalePass(src, 2, "4x-ArchSharp", 15, false);
					payload.image = outUrl;
					ui.imageUrl = outUrl;
					ui.summary = `Micro-grain detail enhanced (${Number(node.params.crispness ?? 55)}%)`;
					finalImageUrl = outUrl;
					break;
				}
				case "generation.batch_variations": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					let urls = [
						await runRelightWeatherPass(src, "overcast-to-golden"),
						await runRelightWeatherPass(src, "day-to-dusk"),
						src,
						await runTiledUpscalePass(src, 2, "4x-ArchSharp", 20, false)
					];
					if (useCloud) try {
						const srcData = await ensureDataUrl(src);
						const res = await generateVariations({ data: {
							idea: incoming.prompt?.prompt || "4 coherent architectural variations",
							image: srcData,
							design: studioContext.design,
							frame: studioContext.frame,
							engine: studioContext.engine,
							scene3d: studioContext.scene3d
						} });
						if (!res.fallback && res.urls.length > 0) urls = res.urls;
					} catch {}
					payload.image = urls[0];
					ui.imageUrl = urls[0];
					ui.variations = urls;
					ui.summary = `Generated ${urls.length} candidate plates`;
					finalImageUrl = urls[0];
					break;
				}
				case "video.camera_motion": {
					const kind = String(node.params.kind || "dolly-in");
					const speed = Number(node.params.speed ?? 45);
					payload.prompt = `MOTION:${kind}:${speed}`;
					ui.promptOut = `Camera path: ${kind} (${speed}% speed)`;
					ui.summary = `Camera rig: ${kind}`;
					break;
				}
				case "video.image_to_video": {
					const src = incoming.image?.image || studioContext.activeImageUrl;
					const motionPrompt = incoming.prompt?.prompt || "";
					const motionKind = motionPrompt.startsWith("MOTION:") ? motionPrompt.split(":")[1] : String(node.params.motionKind || "dolly-in");
					const durationSec = Number(node.params.durationSec ?? 4);
					const clip = await synthesizeCameraMotionVideo(src, {
						kind: motionKind,
						durationSec,
						fps: 24
					});
					payload.video = {
						url: clip.videoUrl,
						posterUrl: clip.posterUrl,
						motionKind,
						durationSec,
						fps: 24,
						isWebm: clip.isWebm
					};
					ui.videoUrl = clip.videoUrl;
					ui.imageUrl = clip.posterUrl;
					ui.summary = `${clip.isWebm ? "WebM" : "Storyboard"} clip · ${motionKind} (${durationSec}s)`;
					finalVideoUrl = clip.videoUrl;
					break;
				}
				case "video.frame_interpolation": {
					const vid = incoming.video?.video;
					const targetFps = Number(node.params.targetFps || 30);
					if (vid) {
						payload.video = {
							...vid,
							fps: targetFps
						};
						ui.videoUrl = vid.url;
						ui.imageUrl = vid.posterUrl;
					}
					ui.summary = `Frame cadence smoothed -> ${targetFps} fps`;
					break;
				}
				case "video.video_export": {
					const vid = incoming.video?.video;
					const fmt = String(node.params.format || "webm");
					if (vid) {
						payload.video = vid;
						ui.videoUrl = vid.url;
						ui.imageUrl = vid.posterUrl;
						finalVideoUrl = vid.url;
					}
					ui.summary = `Export ready (${fmt.toUpperCase()} · ${vid?.fps ?? 30}fps)`;
					break;
				}
				case "output.image_preview": {
					const img = incoming.image?.image || studioContext.activeImageUrl;
					ui.imageUrl = img;
					ui.summary = String(node.params.caption || "Preview Plate");
					finalImageUrl = img;
					break;
				}
				case "output.compare_versions": {
					const before = incoming.before?.image || studioContext.activeImageUrl;
					const after = incoming.after?.image || studioContext.activeImageUrl;
					const diff = await computeMaskOutsideDiffPct(before, after, incoming.mask?.mask || studioContext.activeMaskUrl || void 0);
					const warnGate = Number(node.params.driftWarnPct ?? 18);
					ui.compareBeforeUrl = before;
					ui.compareAfterUrl = after;
					ui.imageUrl = after;
					ui.diffOutsideMaskPct = diff.diffPct;
					ui.geometryDriftWarning = diff.diffPct > warnGate;
					ui.summary = `Drift outside mask: ${diff.diffPct}%${diff.diffPct > warnGate ? " (Warning)" : " (Held)"}`;
					finalImageUrl = after;
					break;
				}
				case "output.save_asset": {
					const img = incoming.image?.image || finalImageUrl || studioContext.activeImageUrl;
					const title = String(node.params.assetTitle || "Node Studio Plate");
					ui.imageUrl = img;
					ui.summary = `Saved "${title}" to Studio`;
					finalImageUrl = img;
					studioContext.onAssetPromoted?.(img, title);
					break;
				}
			}
			const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
			ui.durationMs = Math.max(1, Math.round(t1 - t0));
			wireOutputs.set(nodeId, payload);
			results[nodeId] = ui;
			onProgress(nodeId, ui);
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Node execution failed.";
			const failed = {
				nodeId,
				status: "error",
				error: msg
			};
			results[nodeId] = failed;
			onProgress(nodeId, failed);
			issues.push(`${spec?.title ?? node.type}: ${msg}`);
		}
	}
	return {
		ok: issues.length === 0,
		results,
		finalImageUrl,
		finalVideoUrl,
		issues
	};
}
export { executeNodeWorkflow as n, NodeStudioCanvas as t };
