import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as STUDIES, b as SCOPE_LABEL, y as RUN_NOTE } from "./frame-w23bPEhU.mjs";
import { t as Compare } from "./compare-Dihke-BZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studies-B2jRgFrL.js
var import_jsx_runtime = require_jsx_runtime();
var SCORE_KEYS = [
	{
		key: "brief",
		label: "Brief"
	},
	{
		key: "fidelity",
		label: "Fidelity"
	},
	{
		key: "spatial",
		label: "Spatial"
	},
	{
		key: "material",
		label: "Material"
	},
	{
		key: "lighting",
		label: "Light"
	},
	{
		key: "comparison",
		label: "Compare"
	},
	{
		key: "artifacts",
		label: "Artifacts"
	}
];
function StudiesPage() {
	const wall = STUDIES.find((study) => study.id === "t09");
	const dusk = STUDIES.find((study) => study.id === "t10");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "h-full overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-8 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-lime",
					children: "Disclosed benchmark"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-3xl font-syne text-4xl font-bold tracking-tight md:text-5xl",
					children: "Ten cases. Every first output kept."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl text-sm text-muted md:text-base",
					children: RUN_NOTE
				}),
				wall?.sourceImage && wall.revision ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10 grid items-start gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-lime",
							children: "T09 · Interior edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-syne text-2xl font-bold",
							children: "Wall finish only"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: wall.observation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: wall.metrics
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-fg",
							children: wall.revision.note
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/studio",
							search: { study: "t09" },
							className: "mt-4 inline-flex h-11 items-center rounded-full bg-lime px-4 text-sm font-semibold text-ink",
							children: "Open the revision brief"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
						before: wall.sourceImage,
						after: wall.revision.image,
						beforeLabel: "Source",
						afterLabel: "R1",
						beforeAlt: "Source compact living room",
						afterAlt: "Revised clay plaster living room"
					})]
				}) : null,
				dusk?.sourceImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12 grid items-start gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compare, {
						before: dusk.sourceImage,
						after: dusk.image,
						beforeLabel: "Day",
						afterLabel: "Dusk",
						beforeAlt: "Subtropical home in wet daylight",
						afterAlt: "Same home at early blue-hour dusk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-lime",
							children: "T10 · Exterior edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-syne text-2xl font-bold",
							children: "Day to dusk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: dusk.observation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: dusk.metrics
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-fg",
							children: "A large luminance change is the point of a lighting edit. Judge the edges you named, not a similarity score alone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/studio",
							search: { study: "t10" },
							className: "mt-4 inline-flex h-11 items-center rounded-full border border-line px-4 text-sm font-medium text-fg",
							children: "Open the dusk brief"
						})
					] })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-syne text-2xl font-bold",
							children: "Scores"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm text-muted",
							children: "Human visual review, 1 to 5. A 5 on artifacts means nothing obvious at normal review size. It is not technical accuracy. Fidelity is n/a on text-to-image."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 hidden overflow-hidden rounded-2xl border border-line md:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-surface text-xs uppercase tracking-wide text-faint",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3 font-medium",
										children: "Case"
									}), SCORE_KEYS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-3 py-3 font-medium",
										children: column.label
									}, column.key))] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: STUDIES.map((study) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-line",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-3 py-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-lime",
												children: study.code
											}),
											" ",
											study.title
										]
									}), SCORE_KEYS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-3 text-muted",
										children: study.scores[column.key] ?? "n/a"
									}, column.key))]
								}, study.id)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3 md:hidden",
							children: STUDIES.map((study) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-2xl border border-line p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-syne font-semibold",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lime",
											children: study.code
										}),
										" ",
										study.title
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
									className: "mt-3 grid grid-cols-2 gap-2 text-sm",
									children: SCORE_KEYS.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-faint",
											children: column.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: study.scores[column.key] ?? "n/a" })]
									}, column.key))
								})]
							}, study.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-syne text-2xl font-bold",
						children: "The plates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
						children: STUDIES.map((study) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "overflow-hidden rounded-2xl border border-line bg-surface",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: study.image,
								alt: study.title,
								className: "aspect-[4/3] w-full object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-lime",
										children: [
											study.code,
											" · ",
											SCOPE_LABEL[study.scope]
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 font-syne text-lg font-semibold",
										children: study.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted",
										children: study.observation
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/studio",
										search: { study: study.id },
										className: "mt-3 inline-flex text-sm font-medium text-lime",
										children: "Use this brief"
									})
								]
							})]
						}, study.id))
					})]
				})
			]
		})
	});
}
//#endregion
export { StudiesPage as component };
