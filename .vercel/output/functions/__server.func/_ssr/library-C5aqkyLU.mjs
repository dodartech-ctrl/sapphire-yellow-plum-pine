import { o as __toESM } from "../_runtime.mjs";
import { H as SCOPE_LABEL, Z as WORKFLOW_LABEL, g as DISCIPLINES, q as TEMPLATES } from "./preset-transform-2eK0qpTl.mjs";
import { Tt as useOriel } from "./store-C0Ow5frY.mjs";
import { t as cn } from "./utils-BPtpUp2a.mjs";
import { r as Route$21 } from "./router-CPfESNUR.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as Star } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/library-C5aqkyLU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLOWS = [
	"edit",
	"compare",
	"concept",
	"study",
	"framework"
];
function LibraryPage() {
	const { scope } = Route$21.useSearch();
	const [flow, setFlow] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [savedOnly, setSavedOnly] = (0, import_react.useState)(false);
	const favorites = useOriel((state) => state.favorites);
	const toggleFavorite = useOriel((state) => state.toggleFavorite);
	const items = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return TEMPLATES.filter((template) => {
			if (scope && template.scope !== scope && template.scope !== "any") return false;
			if (flow !== "all" && template.workflow !== flow) return false;
			if (savedOnly && !favorites.includes(template.id)) return false;
			if (!needle) return true;
			return `${template.title} ${template.summary} ${template.prompt}`.toLowerCase().includes(needle);
		});
	}, [
		favorites,
		flow,
		query,
		savedOnly,
		scope
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "h-full overflow-y-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-8 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wide text-lime",
					children: "Library"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-syne text-4xl font-bold tracking-tight md:text-5xl",
					children: "Task templates"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm text-muted md:text-base",
					children: "Replace the bracketed decision, not a stack of style words. Each template is the original CORE brief for that task."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-3 md:flex-row md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search materials, dusk, courtyard…",
						className: "h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none placeholder:text-faint md:max-w-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSavedOnly((value) => !value),
						className: cn("h-11 rounded-full border px-4 text-sm font-medium", savedOnly ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line text-fg"),
						children: "Saved only"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-scrollbar mt-4 flex gap-2 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/library",
						search: { scope: void 0 },
						className: cn("shrink-0 rounded-full border px-3 py-2 text-sm", !scope ? "border-fg text-fg" : "border-line text-muted"),
						children: "All"
					}), DISCIPLINES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/library",
						search: { scope: item.id },
						className: cn("shrink-0 rounded-full border px-3 py-2 text-sm", scope === item.id ? "border-fg text-fg" : "border-line text-muted"),
						children: item.label
					}, item.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "no-scrollbar mt-2 flex gap-2 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						active: flow === "all",
						onClick: () => setFlow("all"),
						label: "Any task"
					}), FLOWS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						active: flow === item,
						onClick: () => setFlow(item),
						label: WORKFLOW_LABEL[item]
					}, item))]
				}),
				items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-sm text-muted",
					children: "No templates in this cut. Clear the filter or save a few from the studio."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 grid gap-3 md:grid-cols-2",
					children: items.map((template) => {
						const saved = favorites.includes(template.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl border border-line bg-surface p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-lime",
										children: [
											SCOPE_LABEL[template.scope],
											" · ",
											WORKFLOW_LABEL[template.workflow]
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-1 font-syne text-xl font-semibold",
										children: template.title
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleFavorite(template.id),
										className: "grid size-11 place-items-center rounded-full border border-line",
										"aria-label": saved ? "Remove from saved" : "Save template",
										"aria-pressed": saved,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", saved && "fill-lime text-lime") })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: template.summary
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/studio",
									search: { template: template.id },
									className: "gold-fill mt-4 inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold text-[#2a1c0c]",
									children: "Compose"
								})
							]
						}, template.id);
					})
				})
			]
		})
	});
}
function FilterChip({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("shrink-0 rounded-full border px-3 py-2 text-sm", active ? "border-fg text-fg" : "border-line text-muted"),
		children: label
	});
}
export { LibraryPage as component };
