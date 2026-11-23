import { o as __toESM } from "../_runtime.mjs";
import { A as LOOKS, S as GROUPS, Y as VERTICALS } from "./preset-transform-2eK0qpTl.mjs";
import { Et as useOriel, d as INSPECTOR_PBR_SWATCHES } from "./store-DKbOyB_O.mjs";
import { R as setPending3DFile, f as exportProceduralAssetToGlbFile, m as triggerBlobDownload, u as PROCEDURAL_GLB_CATALOG } from "./router-DkeIkpnL.mjs";
import { t as cn } from "./utils-BPtpUp2a.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Sparkles, F as Search, Qt as Download, bt as Layers, et as Palette, ht as LoaderCircle, p as Upload, vn as Box } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
// node_modules/.nitro/vite/services/ssr/assets/assets-BY_WW6wZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AssetsPage() {
	const setVertical = useOriel((state) => state.setVertical);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setPick = useOriel((state) => state.setPick);
	const setIdea = useOriel((state) => state.setIdea);
	const idea = useOriel((state) => state.idea);
	const setActiveStudio = useOriel((state) => state.setActiveStudio);
	const setScene3DField = useOriel((state) => state.setScene3DField);
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("glb");
	const [query, setQuery] = (0, import_react.useState)("");
	const [busyAssetId, setBusyAssetId] = (0, import_react.useState)(null);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const normalizedQuery = query.trim().toLowerCase();
	const filteredGlb = (0, import_react.useMemo)(() => PROCEDURAL_GLB_CATALOG.filter((item) => !normalizedQuery || item.name.toLowerCase().includes(normalizedQuery) || item.summary.toLowerCase().includes(normalizedQuery) || item.category.toLowerCase().includes(normalizedQuery)), [normalizedQuery]);
	const filteredMaterials = (0, import_react.useMemo)(() => INSPECTOR_PBR_SWATCHES.filter((sw) => !normalizedQuery || sw.label.toLowerCase().includes(normalizedQuery) || sw.category.toLowerCase().includes(normalizedQuery)), [normalizedQuery]);
	function applyLook(vertical, name) {
		setVertical(vertical);
		setDesignField("look", name);
		setActiveStudio("mas2d");
		toast.success(`Applied ${name} (${vertical}) to Studio`);
		navigate({ to: "/" });
	}
	function importCustom3DFile(file) {
		if (!file) return;
		const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
		if (![
			"glb",
			"gltf",
			"obj",
			"fbx",
			"stl"
		].includes(ext)) {
			toast.error("Unsupported 3D file. Please choose .glb, .gltf, .obj, .fbx, or .stl.");
			return;
		}
		setPending3DFile(file);
		setActiveStudio("sam3d");
		toast.success(`Loading ${file.name} in SAM 3D Viewport…`);
		navigate({ to: "/" });
	}
	function handleFileChange(e) {
		importCustom3DFile(e.target.files?.[0]);
		e.target.value = "";
	}
	function handleDrop(e) {
		e.preventDefault();
		setDragOver(false);
		importCustom3DFile(e.dataTransfer.files?.[0]);
	}
	async function handleLoadProceduralIn3D(assetId) {
		const spec = PROCEDURAL_GLB_CATALOG.find((a) => a.id === assetId);
		if (!spec) return;
		if (spec.presetKey) {
			setScene3DField("preset", spec.presetKey);
			setActiveStudio("sam3d");
			toast.success(`Loaded ${spec.name} into live 3D Viewport`);
			navigate({ to: "/" });
			return;
		}
		setBusyAssetId(assetId);
		try {
			const { file, meshCount } = await exportProceduralAssetToGlbFile(assetId);
			setPending3DFile(file);
			setActiveStudio("sam3d");
			toast.success(`Loaded ${spec.name} (${meshCount} meshes) into 3D Viewport`);
			navigate({ to: "/" });
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not build 3D GLB asset.");
		} finally {
			setBusyAssetId(null);
		}
	}
	async function handleDownloadGlb(assetId) {
		setBusyAssetId(assetId);
		try {
			const { blob, filename, meshCount } = await exportProceduralAssetToGlbFile(assetId);
			triggerBlobDownload(blob, filename);
			toast.success(`Exported ${filename} (${meshCount} meshes · binary GLB)`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not export GLB file.");
		} finally {
			setBusyAssetId(null);
		}
	}
	function applyPbrSwatchToStudio(swatchLabel, category) {
		const snippet = `${swatchLabel} (${category} PBR finish)`;
		const nextIdea = idea.trim() ? idea.toLowerCase().includes(swatchLabel.toLowerCase()) ? idea : `${idea.replace(/[,.;\s]+$/, "")}, featuring ${snippet}` : `Architectural visualization featuring ${snippet}`;
		setIdea(nextIdea);
		setActiveStudio("mas2d");
		toast.success(`Injected "${swatchLabel}" PBR material into Studio prompt`);
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "h-full overflow-y-auto px-4 py-6 md:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] font-semibold uppercase tracking-widest text-[#b08a45]",
							children: "Assets, 3D GLB & Material Library"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-syne text-3xl font-bold",
							children: "3D Models, PBR Materials & Studio Looks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 max-w-2xl text-sm text-muted",
							children: "Import real .GLB, .GLTF, .OBJ, .FBX, or .STL CAD models directly into the live 3D Viewport, download procedural architectural .GLB kits, or inject PBR finishes and studio looks straight onto your canvas."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:w-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Filter 3D assets, materials, looks…",
							className: "h-10 w-full rounded-full border border-line bg-surface pr-3 pl-9 text-xs text-fg outline-none focus:border-[#c5a880]"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 flex flex-wrap items-center gap-2",
					children: [
						{
							id: "glb",
							label: `3D Models & GLB (${PROCEDURAL_GLB_CATALOG.length})`,
							icon: Box
						},
						{
							id: "materials",
							label: `PBR Material Swatches (${INSPECTOR_PBR_SWATCHES.length})`,
							icon: Palette
						},
						{
							id: "looks",
							label: "Studio Looks & Finishes",
							icon: Layers
						}
					].map((item) => {
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab(item.id),
							className: cn("inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition", tab === item.id ? "border-[#c5a880] bg-[#c5a880] text-[#281800] dark:border-[#cfe3f0] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "border-line bg-surface text-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), item.label]
						}, item.id);
					})
				}),
				tab === "glb" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onDragOver: (e) => {
							e.preventDefault();
							setDragOver(true);
						},
						onDragLeave: () => setDragOver(false),
						onDrop: handleDrop,
						className: cn("flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-dashed p-5 text-center transition sm:flex-row sm:text-left", dragOver ? "border-[#c5a880] bg-[#c5a880]/10" : "border-line bg-surface/70"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-12 shrink-0 place-items-center rounded-2xl bg-[#c5a880]/20 text-[#b08a45]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-syne text-base font-bold",
								children: "Import Custom 3D CAD / BIM File"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 text-xs text-muted",
								children: [
									"Drop a ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ".GLB" }),
									", ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ".GLTF" }),
									", ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ".OBJ" }),
									", ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ".FBX" }),
									", or",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: ".STL" }),
									" file here — automatically normalized, grounded, and opened in SAM 3D Viewport."
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								accept: ".glb,.gltf,.obj,.fbx,.stl",
								className: "sr-only",
								onChange: handleFileChange
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => fileInputRef.current?.click(),
								className: "gold-fill inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-semibold text-[#2a1c0c]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), " Upload 3D Model"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-syne text-lg font-semibold",
							children: "Studio Architectural 3D GLB Kit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Load directly into the WebGL 3D Viewport with solar & camera lock, or export a real binary .GLB file for Blender, Rhino, SketchUp, or Unreal Engine."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
							children: filteredGlb.map((asset) => {
								const isBusy = busyAssetId === asset.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									"data-testid": `glb-asset-${asset.id}`,
									className: "flex flex-col overflow-hidden rounded-2xl border border-line bg-surface",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative h-36 overflow-hidden bg-black/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: asset.previewImage,
												alt: asset.name,
												className: "h-full w-full object-cover"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute top-2.5 left-2.5 rounded-full bg-black/70 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-[#e8c98a]",
												children: asset.category
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "absolute right-2.5 bottom-2.5 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/90",
												children: [
													asset.dimensionsM,
													" · ~",
													asset.trianglesApprox,
													" tris"
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-1 flex-col justify-between p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-syne text-sm font-bold",
											children: asset.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs leading-relaxed text-muted",
											children: asset.summary
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: isBusy,
												onClick: () => void handleLoadProceduralIn3D(asset.id),
												className: "gold-fill inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60",
												children: [isBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-3.5" }), "Open in 3D"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												disabled: isBusy,
												onClick: () => void handleDownloadGlb(asset.id),
												className: "inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 text-xs font-semibold text-fg hover:bg-raised disabled:opacity-60",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " .GLB"]
											})]
										})]
									})]
								}, asset.id);
							})
						})
					] })]
				}) : tab === "materials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-syne text-lg font-semibold",
							children: "Physically-Based (PBR) Architectural Material Swatches"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Click any swatch to inject its calibrated roughness, metalness, and finish directive straight into the Studio prompt."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
							children: filteredMaterials.map((sw) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => applyPbrSwatchToStudio(sw.label, sw.category),
								className: "flex flex-col items-start rounded-2xl border border-line bg-surface p-3.5 text-left transition hover:border-[#c5a880]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-10 shrink-0 rounded-xl border border-black/15 shadow-inner",
										style: { backgroundColor: sw.hex }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold",
											children: sw.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[10px] uppercase text-muted",
											children: sw.category
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex w-full items-center justify-between font-mono text-[10px] text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Rough ", sw.roughness.toFixed(2)] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Metal ", sw.metalness.toFixed(2)] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1 font-sans font-semibold text-[#b08a45]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Apply"]
										})
									]
								})]
							}, sw.id))
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: VERTICALS.map((vertical) => {
						const looks = LOOKS[vertical.id].filter((l) => !normalizedQuery || l.name.toLowerCase().includes(normalizedQuery));
						const groups = GROUPS[vertical.id];
						if (normalizedQuery && looks.length === 0) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mt-8 first:mt-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-syne text-xl font-semibold",
									children: vertical.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid grid-cols-2 gap-3 md:grid-cols-4",
									children: looks.map((look) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => applyLook(vertical.id, look.name),
										className: "overflow-hidden rounded-2xl border border-line bg-surface text-left transition hover:border-[#c5a880]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: look.image,
											alt: look.name,
											className: "h-28 w-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block px-3 py-2 text-sm font-medium",
											children: look.name
										})]
									}, look.name))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex flex-wrap gap-2",
									children: groups.flatMap((group) => group.options.filter((option) => !normalizedQuery || option.toLowerCase().includes(normalizedQuery) || group.label.toLowerCase().includes(normalizedQuery)).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "h-9 rounded-full border border-line bg-surface px-3 text-xs text-muted hover:border-[#c5a880] hover:text-fg",
										onClick: () => {
											setVertical(vertical.id);
											setPick(group.id, option);
											toast.success(`Selected ${group.label}: ${option}`);
											navigate({ to: "/" });
										},
										children: [
											group.label,
											": ",
											option
										]
									}, `${group.id}-${option}`)))
								})
							]
						}, vertical.id);
					})
				})
			]
		})
	});
}
export { AssetsPage as component };
