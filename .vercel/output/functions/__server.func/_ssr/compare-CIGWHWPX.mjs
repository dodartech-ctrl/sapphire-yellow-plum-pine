import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/compare-CIGWHWPX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Compare({ before, after, beforeLabel, afterLabel, beforeAlt, afterAlt, embedded = false, aspect = "16 / 9" }) {
	const frame = (0, import_react.useRef)(null);
	const [position, setPosition] = (0, import_react.useState)(50);
	function setFromClient(clientX) {
		const rect = frame.current?.getBoundingClientRect();
		if (!rect || rect.width === 0) return;
		const next = (clientX - rect.left) / rect.width * 100;
		setPosition(Math.min(100, Math.max(0, next)));
	}
	const closed = position <= .5 || position >= 99.5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: embedded ? "bg-[#1c1915]" : "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: frame,
			className: embedded ? "relative mx-auto w-full max-w-full touch-none overflow-hidden bg-[#1c1915]" : "relative mx-auto aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl border border-line bg-[#1c1915]",
			style: embedded ? {
				aspectRatio: aspect,
				maxHeight: "62vh"
			} : void 0,
			onPointerDown: (event) => {
				event.stopPropagation();
				event.currentTarget.setPointerCapture(event.pointerId);
				setFromClient(event.clientX);
			},
			onPointerMove: (event) => {
				if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
				setFromClient(event.clientX);
			},
			onPointerUp: (event) => {
				if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: after,
					alt: afterAlt,
					className: "absolute inset-0 h-full w-full object-contain",
					draggable: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: before,
					alt: beforeAlt,
					className: "absolute inset-0 h-full w-full object-contain",
					draggable: false,
					style: { clipPath: `inset(0 ${100 - position}% 0 0)` }
				}),
				closed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-y-0 z-10 w-0.5 bg-[#e7c27a]",
					style: { left: `${position}%` }
				})
			]
		}), embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
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
					value: Math.round(position),
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
