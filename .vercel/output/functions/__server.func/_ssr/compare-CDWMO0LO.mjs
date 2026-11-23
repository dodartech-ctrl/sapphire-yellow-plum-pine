import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BPtpUp2a.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { V as RotateCcw, in as Columns2, k as SlidersHorizontal } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/compare-CDWMO0LO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function parseAspectRatio(aspect) {
	const parts = aspect.split("/").map((v) => Number(v.trim()));
	if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1]) && parts[1] > 0) return parts[0] / parts[1];
	return 16 / 9;
}
function Compare({ before, after, beforeLabel, afterLabel, beforeAlt, afterAlt, embedded = false, aspect = "16 / 9" }) {
	const frameRef = (0, import_react.useRef)(null);
	const draggingRef = (0, import_react.useRef)(false);
	const [position, setPosition] = (0, import_react.useState)(50);
	const [mode, setMode] = (0, import_react.useState)("slider");
	const [naturalAspect, setNaturalAspect] = (0, import_react.useState)(null);
	const [beforeDims, setBeforeDims] = (0, import_react.useState)(null);
	const [afterDims, setAfterDims] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNaturalAspect(null);
		setBeforeDims(null);
	}, [before]);
	(0, import_react.useEffect)(() => {
		setAfterDims(null);
	}, [after]);
	function setFromClient(clientX) {
		const rect = frameRef.current?.getBoundingClientRect();
		if (!rect || rect.width <= 0) return;
		const next = (clientX - rect.left) / rect.width * 100;
		setPosition(Math.min(100, Math.max(0, next)));
	}
	const fallbackAspect = parseAspectRatio(aspect);
	const activeAspect = naturalAspect ?? fallbackAspect;
	const pct = Math.round(position);
	const aspectDelta = beforeDims && afterDims ? Math.abs(beforeDims.w / beforeDims.h - afterDims.w / afterDims.h) : 0;
	const isPixelAspectMatched = !beforeDims || !afterDims || aspectDelta < .08;
	if (embedded) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "compare-embedded-stage",
		className: "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#08131f]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative flex min-h-0 w-full flex-1 items-center justify-center p-1.5",
			children: mode === "side-by-side" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "compare-side-by-side",
				className: "grid h-full w-full grid-cols-1 gap-1.5 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#050f1b] p-1",
					style: { containerType: "size" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-hidden rounded-lg bg-[#050f1b]",
						style: {
							width: `min(100cqw, calc(100cqh * ${activeAspect}))`,
							height: `min(100cqh, calc(100cqw / ${activeAspect}))`
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: before,
							alt: beforeAlt,
							onLoad: (e) => {
								const img = e.currentTarget;
								if (img.naturalWidth > 0 && img.naturalHeight > 0) {
									setBeforeDims({
										w: img.naturalWidth,
										h: img.naturalHeight
									});
									const ratio = img.naturalWidth / img.naturalHeight;
									if (ratio >= .4 && ratio <= 3.2) setNaturalAspect(ratio);
								}
							},
							className: "h-full w-full object-cover object-center",
							draggable: false
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "pointer-events-none absolute top-2 left-2 rounded-full border border-white/15 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8eff3] backdrop-blur-xs",
						children: [beforeLabel, beforeDims ? ` · ${beforeDims.w}×${beforeDims.h}` : ""]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex min-h-0 items-center justify-center overflow-hidden rounded-xl border border-[#e7c27a]/35 bg-[#050f1b] p-1",
					style: { containerType: "size" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-hidden rounded-lg bg-[#050f1b]",
						style: {
							width: `min(100cqw, calc(100cqh * ${activeAspect}))`,
							height: `min(100cqh, calc(100cqw / ${activeAspect}))`
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: after,
							alt: afterAlt,
							onLoad: (e) => {
								const img = e.currentTarget;
								if (img.naturalWidth > 0 && img.naturalHeight > 0) setAfterDims({
									w: img.naturalWidth,
									h: img.naturalHeight
								});
							},
							className: "h-full w-full object-cover object-center",
							draggable: false
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "pointer-events-none absolute top-2 right-2 rounded-full border border-[#e7c27a]/35 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8c98a] backdrop-blur-xs",
						children: [afterLabel, afterDims ? ` · ${afterDims.w}×${afterDims.h}` : ""]
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex h-full w-full items-center justify-center",
				style: { containerType: "size" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: frameRef,
					role: "slider",
					tabIndex: 0,
					"aria-label": `Compare ${beforeLabel} and ${afterLabel}`,
					"aria-valuemin": 0,
					"aria-valuemax": 100,
					"aria-valuenow": pct,
					"data-testid": "compare-slider-frame",
					className: "relative cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-white/15 bg-[#050f1b] shadow-[0_12px_36px_rgba(0,0,0,0.45)] focus:outline-none focus:ring-2 focus:ring-[#e7c27a]/60",
					style: {
						width: `min(100cqw, calc(100cqh * ${activeAspect}))`,
						height: `min(100cqh, calc(100cqw / ${activeAspect}))`
					},
					onKeyDown: (event) => {
						if (event.key === "ArrowLeft") {
							event.preventDefault();
							setPosition((p) => Math.max(0, p - 5));
						} else if (event.key === "ArrowRight") {
							event.preventDefault();
							setPosition((p) => Math.min(100, p + 5));
						} else if (event.key === "Home") {
							event.preventDefault();
							setPosition(0);
						} else if (event.key === "End") {
							event.preventDefault();
							setPosition(100);
						}
					},
					onPointerDown: (event) => {
						event.preventDefault();
						event.stopPropagation();
						draggingRef.current = true;
						try {
							event.currentTarget.setPointerCapture(event.pointerId);
						} catch {}
						setFromClient(event.clientX);
					},
					onPointerMove: (event) => {
						if (!draggingRef.current) return;
						event.preventDefault();
						setFromClient(event.clientX);
					},
					onPointerUp: (event) => {
						draggingRef.current = false;
						try {
							if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
						} catch {}
					},
					onPointerCancel: () => {
						draggingRef.current = false;
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: after,
							alt: afterAlt,
							onLoad: (e) => {
								const img = e.currentTarget;
								if (img.naturalWidth > 0 && img.naturalHeight > 0) setAfterDims({
									w: img.naturalWidth,
									h: img.naturalHeight
								});
							},
							className: "pointer-events-none absolute inset-0 h-full w-full object-cover object-center",
							draggable: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-testid": "compare-before-clip",
							className: "pointer-events-none absolute inset-0 overflow-hidden",
							style: { clipPath: `inset(0 ${100 - position}% 0 0)` },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: before,
								alt: beforeAlt,
								onLoad: (e) => {
									const img = e.currentTarget;
									if (img.naturalWidth > 0 && img.naturalHeight > 0) {
										setBeforeDims({
											w: img.naturalWidth,
											h: img.naturalHeight
										});
										const ratio = img.naturalWidth / img.naturalHeight;
										if (ratio >= .4 && ratio <= 3.2) setNaturalAspect(ratio);
									}
								},
								className: "pointer-events-none absolute inset-0 h-full w-full object-cover object-center",
								draggable: false
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute top-2 left-2 z-10 rounded-full border border-white/20 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8eff3] backdrop-blur-xs",
							children: beforeLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "pointer-events-none absolute top-2 right-2 z-10 rounded-full border border-[#e7c27a]/40 bg-[#050f1b]/85 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-[#e8c98a] backdrop-blur-xs",
							children: afterLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							"data-testid": "compare-divider",
							className: "pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-[#e7c27a] shadow-[0_0_10px_rgba(231,194,122,0.95)]",
							style: { left: `${position}%` },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1/2 left-1/2 grid size-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#e7c27a] bg-[#08131f]/95 text-[11px] font-bold text-[#e7c27a] shadow-[0_4px_14px_rgba(0,0,0,0.65)]",
								children: "↔"
							})
						})
					]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-[#07111c] px-2.5 py-1 text-[10px] text-[#cfe3f0]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "compare-mode-slider",
					onClick: () => setMode("slider"),
					className: cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9.5px] font-semibold transition", mode === "slider" ? "bg-[#e7c27a] text-[#1b1407]" : "text-[#a9bdc9] hover:text-white"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-2.5" }), "Wipe"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "compare-mode-side",
					onClick: () => setMode("side-by-side"),
					className: cn("inline-flex h-5 items-center gap-1 rounded-full px-2 text-[9.5px] font-semibold transition", mode === "side-by-side" ? "bg-[#e7c27a] text-[#1b1407]" : "text-[#a9bdc9] hover:text-white"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Columns2, { className: "size-2.5" }), "Side-by-Side"]
				})]
			}), mode === "slider" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPosition(100),
						className: "shrink-0 font-mono text-[9.5px] text-[#a9bdc9] hover:text-white",
						children: beforeLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: 100,
						value: pct,
						"data-testid": "compare-range-input",
						"aria-label": `Compare ${beforeLabel} and ${afterLabel} position`,
						onChange: (e) => setPosition(Number(e.target.value)),
						className: "h-1 min-w-0 flex-1 cursor-pointer accent-[#e7c27a]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPosition(0),
						className: "shrink-0 font-mono text-[9.5px] text-[#e8c98a] hover:text-white",
						children: afterLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden w-8 shrink-0 text-right font-mono text-[9.5px] tabular-nums text-[#a9bdc9] sm:inline",
						children: [pct, "%"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPosition(50),
						title: "Reset split to 50%",
						className: "grid size-5 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[#cfe3f0] hover:border-[#e7c27a] hover:text-[#e7c27a]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-2.5" })
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"data-testid": "compare-pixel-status",
				className: cn("font-mono text-[9.5px]", isPixelAspectMatched ? "text-emerald-300" : "text-amber-300"),
				children: isPixelAspectMatched ? `Pixel-Aligned ${beforeLabel} vs ${afterLabel}` : "Re-render to lock upload pixel aspect"
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: frameRef,
			className: "relative mx-auto aspect-[4/3] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-line bg-[#1c1915]",
			onPointerDown: (event) => {
				event.stopPropagation();
				draggingRef.current = true;
				try {
					event.currentTarget.setPointerCapture(event.pointerId);
				} catch {}
				setFromClient(event.clientX);
			},
			onPointerMove: (event) => {
				if (!draggingRef.current) return;
				setFromClient(event.clientX);
			},
			onPointerUp: (event) => {
				draggingRef.current = false;
				try {
					if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
				} catch {}
			},
			onPointerCancel: () => {
				draggingRef.current = false;
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: after,
					alt: afterAlt,
					className: "pointer-events-none absolute inset-0 h-full w-full object-cover object-center",
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 overflow-hidden",
					style: { clipPath: `inset(0 ${100 - position}% 0 0)` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: before,
						alt: beforeAlt,
						className: "pointer-events-none absolute inset-0 h-full w-full object-cover object-center",
						draggable: false
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-[#e7c27a]",
					style: { left: `${position}%` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-1/2 left-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#e7c27a] bg-[#08131f]/95 text-[10px] font-bold text-[#e7c27a]",
						children: "↔"
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex items-center gap-3 text-xs text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0",
					children: beforeLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: 0,
					max: 100,
					value: pct,
					onChange: (event) => setPosition(Number(event.target.value)),
					className: "w-full accent-lime",
					"aria-label": `Compare ${beforeLabel} and ${afterLabel}`,
					suppressHydrationWarning: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0",
					children: afterLabel
				})
			]
		})]
	});
}
export { Compare as t };
