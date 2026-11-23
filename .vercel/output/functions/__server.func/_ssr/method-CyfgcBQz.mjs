import { o as __toESM } from "../_runtime.mjs";
import { o as CHECKLIST } from "./preset-transform-2eK0qpTl.mjs";
import { t as cn } from "./utils-BPtpUp2a.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/method-CyfgcBQz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODELS = [
	{
		id: "gpt",
		name: "GPT Image",
		fit: "Labeled edits and multi-turn corrections",
		pass: "Keep the sections. Change one mismatch per turn. On a material-only edit, restate white balance, exposure, and every surface you are not touching."
	},
	{
		id: "midjourney",
		name: "Midjourney",
		fit: "Mood, material, and composition exploration",
		pass: "One concise phrase. Parameters sit at the end. A long instruction list dilutes the decision."
	},
	{
		id: "firefly",
		name: "Firefly",
		fit: "Direct prompts beside Adobe controls",
		pass: "Say the subject and the decision. Leave composition, style, color, and camera to the interface controls."
	},
	{
		id: "flux",
		name: "FLUX",
		fit: "Photoreal detail, subject first",
		pass: "Lead with the spatial subject and the decision. Describe the desired state. Do not rely on a negative prompt."
	},
	{
		id: "gemini",
		name: "Gemini / Imagen",
		fit: "Conversational generation and reference edits",
		pass: "State purpose, what stays, and what changes. Correct in small turns. Prefer a positive scene to a pile of bans."
	}
];
var LAYERS = [
	{
		mark: "C",
		title: "Context and constraints",
		body: "Name the source of truth before the look. Camera, envelope, openings, grade, and what may not move. A preserve line states intent. It does not prove the pixels obeyed."
	},
	{
		mark: "O",
		title: "Objective and options",
		body: "Name the decision. Compare three palettes, or test one light, or turn a massing view into a client plate. “Make it luxurious” is not an objective. Change one family of variables at a time."
	},
	{
		mark: "R",
		title: "Rendering direction",
		body: "Material plus finish plus scale. Light with a source, a direction, and a job. Camera with a reason: eye-level two-point, elevation-like, elevated oblique, or a junction close-up. Skip lens-brand theater and “8K”."
	},
	{
		mark: "E",
		title: "Evaluation and exclusions",
		body: "Say what a successful frame must make easy to judge, and what it is not allowed to approve: dimensions, products, structure, drainage, code, cost, planting performance."
	}
];
function MethodPage() {
	const [checked, setChecked] = (0, import_react.useState)({});
	const total = CHECKLIST.reduce((sum, group) => sum + group.items.length, 0);
	const done = Object.values(checked).filter(Boolean).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "h-full overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-8 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-lime",
					children: "CORE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-3xl font-syne text-4xl font-bold tracking-tight md:text-5xl",
					children: "A brief you can revise, not a spell you hope lands."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-sm text-muted md:text-base",
					children: "CORE is original to the Architectural Visualization Prompt Library. It is not an official framework from any model provider. Write it once. Translate it for the model in front of you."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/studio",
					search: { template: "core-master" },
					className: "gold-fill mt-6 inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold text-[#2a1c0c]",
					children: "Compose the master brief"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-10 grid gap-3 md:grid-cols-2",
					children: LAYERS.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-line bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-syne text-4xl font-extrabold text-lime",
								children: layer.mark
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-syne text-xl font-semibold",
								children: layer.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: layer.body
							})
						]
					}, layer.mark))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-syne text-2xl font-bold",
						children: "How a pass changes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-3 md:grid-cols-2",
						children: MODELS.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl border border-line p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-syne text-lg font-semibold",
									children: model.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-lime",
									children: model.fit
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: model.pass
								})
							]
						}, model.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-syne text-2xl font-bold",
							children: "Review before you send it"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-faint",
							children: [
								done,
								"/",
								total
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 md:grid-cols-2",
						children: CHECKLIST.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "rounded-2xl border border-line p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "px-1 font-syne text-lg font-semibold",
								children: group.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 space-y-3",
								children: group.items.map((item) => {
									const id = `${group.title}:${item}`;
									const on = Boolean(checked[id]);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-start gap-3 text-sm text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: on,
											onChange: () => setChecked((current) => ({
												...current,
												[id]: !current[id]
											})),
											className: "mt-1 size-4 accent-lime"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn(on && "text-fg"),
											children: item
										})]
									}) }, item);
								})
							})]
						}, group.title))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12 mb-4 max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-syne text-2xl font-bold",
						children: "Iteration"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-3 list-decimal space-y-2 pl-5 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Generate from the shortest complete brief." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Name the single highest-impact mismatch." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Revise one layer: constraints, design, camera, light, or context." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Keep the brief that worked, with the model and the date. The studio log does this when you copy." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Compare options on the same reference, camera, and plate." })
						]
					})]
				})
			]
		})
	});
}
export { MethodPage as component };
