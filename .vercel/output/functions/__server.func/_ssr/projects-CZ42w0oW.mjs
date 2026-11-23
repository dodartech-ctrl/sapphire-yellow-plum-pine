import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Qt as Download, p as Upload } from "../_libs/lucide-react.mjs";
import { ln as useOriel, m as triggerBlobDownload } from "./router-CL69nk8u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-CZ42w0oW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProjectsPage() {
	const projects = useOriel((state) => state.projects);
	const briefs = useOriel((state) => state.briefs);
	const saveProject = useOriel((state) => state.saveProject);
	const importProjectsBundle = useOriel((state) => state.importProjectsBundle);
	const openProject = useOriel((state) => state.openProject);
	const removeProject = useOriel((state) => state.removeProject);
	const removeBrief = useOriel((state) => state.removeBrief);
	const setIdea = useOriel((state) => state.setIdea);
	const [name, setName] = (0, import_react.useState)("");
	const importInputRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	function handleExportBundle() {
		const payload = {
			schema: "oriel-projects-backup-v1",
			exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			projects,
			briefs
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
		triggerBlobDownload(blob, `oriel-projects-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`);
		toast.success(`Exported ${projects.length} project${projects.length === 1 ? "" : "s"} to JSON backup`);
	}
	async function handleImportBundle(e) {
		const file = e.target.files?.[0];
		e.target.value = "";
		if (!file) return;
		try {
			const parsed = JSON.parse(await file.text());
			const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.projects) ? parsed.projects : [];
			const count = importProjectsBundle(list);
			if (count > 0) toast.success(`Imported ${count} project${count === 1 ? "" : "s"} into local library`);
			else toast.error("No valid Oriel projects found in JSON file.");
		} catch {
			toast.error("Could not parse project backup JSON.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "h-full overflow-y-auto px-4 py-6 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-syne text-3xl font-bold",
					children: "Projects & Saved Briefs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "Saves the current properties, Brief Builder specs, and idea on this device — with JSON export/import backup."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: importInputRef,
							type: "file",
							accept: "application/json,.json",
							className: "sr-only",
							onChange: (e) => void handleImportBundle(e)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => importInputRef.current?.click(),
							className: "inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-semibold text-fg hover:bg-raised",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), " Import JSON"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleExportBundle,
							className: "inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-4 text-xs font-semibold text-fg hover:bg-raised",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export Backup"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 flex max-w-lg gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					saveProject(name);
					toast.success(`Saved project "${name.trim() || "Untitled"}"`);
					setName("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder: "Project name",
					className: "h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-sm outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "gold-fill h-11 rounded-full px-5 text-sm font-semibold text-[#2a1c0c]",
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-faint",
								children: [
									project.design.vertical,
									" · ",
									project.design.look
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm font-medium text-[#b08a45] hover:underline",
							onClick: () => {
								openProject(project.id);
								toast.success(`Opened "${project.name}"`);
								navigate({ to: "/" });
							},
							children: "Open"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted hover:text-fg",
							onClick: () => removeProject(project.id),
							children: "Delete"
						})
					]
				}, project.id))]
			}),
			briefs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-syne text-lg font-semibold",
					children: [
						"Saved Briefs (",
						briefs.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: briefs.map((brief) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl border border-line bg-surface px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-fg",
								children: brief.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setIdea(brief.adapted || brief.canonical);
										navigate({ to: "/" });
									},
									className: "font-medium text-[#b08a45] hover:underline",
									children: "Load in Studio"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeBrief(brief.id),
									className: "text-muted hover:text-fg",
									children: "Delete"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-xs text-muted",
							children: brief.adapted || brief.canonical
						})]
					}, brief.id))
				})]
			}) : null
		]
	});
}
//#endregion
export { ProjectsPage as component };
