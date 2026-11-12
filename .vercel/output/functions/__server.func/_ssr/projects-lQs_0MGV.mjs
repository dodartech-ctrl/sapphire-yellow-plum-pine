import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as useOriel } from "./router-BMrN6z9B.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-lQs_0MGV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectsPage() {
	const projects = useOriel((state) => state.projects);
	const saveProject = useOriel((state) => state.saveProject);
	const openProject = useOriel((state) => state.openProject);
	const removeProject = useOriel((state) => state.removeProject);
	const [name, setName] = (0, import_react.useState)("");
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "h-full overflow-y-auto px-4 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-syne text-3xl font-bold",
				children: "Projects"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted",
				children: "Saves the current properties and idea on this device. Plates stay with the session."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 flex max-w-lg gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					saveProject(name);
					setName("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder: "Project name",
					className: "h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-11 rounded-full bg-lime px-4 text-sm text-ink",
					children: "Save"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-6 max-w-lg space-y-2",
				children: [projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "No saved projects yet."
				}) : null, projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium",
								children: project.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-faint",
								children: project.design.vertical
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-lime",
							onClick: () => {
								openProject(project.id);
								navigate({ to: "/" });
							},
							children: "Open"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => removeProject(project.id),
							children: "Delete"
						})
					]
				}, project.id))]
			})
		]
	});
}
//#endregion
export { ProjectsPage as component };
