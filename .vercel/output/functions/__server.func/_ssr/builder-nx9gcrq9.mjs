import { o as __toESM } from "../_runtime.mjs";
import { a as extractParameterDisplayValues, c as normalizeAuthorName, d as summarizeCommentsByParameter, i as buildSharedBriefSnapshot, n as COLLAB_REVIEWER_ROLES, r as buildBriefShareUrl, t as COLLAB_PARAMETER_TARGETS, u as sanitizeShareId } from "./brief-collab-BNJpN5Nq.mjs";
import { E as cn, g as MidLayerBar } from "./router-Bfc3OfSW.mjs";
import { $ as toggleDictionaryBlockInNotes, B as formatSolarTime, D as buildTemplateCompiledNotes, J as resolveBriefTemplateSlots, Q as synthesizeVisionDocument, R as filterBriefTemplates, T as buildMaterialScheduleRows, X as syncBuilderSlotToNotes, Z as syncDictionaryPresetToNotes, a as CAMERA_PRESETS, et as toggleKeywordPillInNotes, h as MOOD_SETTINGS, i as BUILDER_PRESETS, n as BRIEF_TEMPLATES, nt as useOriel, r as BRIEF_TEMPLATE_CATEGORIES, t as ARCHITECTURAL_STYLES, u as LIGHTING_CONDITIONS, w as buildInitialBuilderNotes, x as buildDesignPackDocumentHtml } from "./store-kEsgEuob.mjs";
import { F as RATIOS, Q as WORKFLOW_PRESETS, R as RESOLUTIONS } from "./fallback-render-kleyA0ad.mjs";
import { i as createSsrRpc } from "./credits-D_Tww0gf.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as parseBriefToMoodboardQueries, n as formatReferenceNoteFromImage } from "./brief-moodboard-B5-D5MHF.mjs";
import { a as applyMidLayerPromptToIdea, c as getDictionaryBlock, l as getMidLayerPresetById, n as DICTIONARY_BLOCKS, o as composeDictionarySelection, s as exportSavedPromptsJson, t as ARCHVIZ_PRESETS, u as importSavedPromptsJson } from "./archviz-dictionary-BdT_Lv3z.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { A as Share2, At as FileSpreadsheet, Bt as Copy, D as SlidersHorizontal, E as SlidersVertical, Gt as CloudUpload, It as Download, L as Save, M as Search, Nt as ExternalLink, Qt as Camera, T as Sparkles, U as Pin, Xt as ChevronDown, Y as Palette, Yt as ChevronUp, Z as MoveRight, Zt as Check, _ as Sun, c as Users, ct as LoaderCircle, d as Upload, i as X, it as Maximize2, j as Send, kt as FileText, lt as Link2, m as Trash2, nn as BookOpen, o as WandSparkles, p as TriangleAlert, pt as Layers, qt as CircleCheck, tt as MessageSquare, xt as Grid3x3, yt as GripVertical, z as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
// node_modules/.nitro/vite/services/ssr/assets/builder-nx9gcrq9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = require_jspdf_node_min();
function BriefCollabDrawer({ open, onClose, session, activeSnapshot, isSyncing, isCreatingShare, lastSyncedAt, reviewerName, onReviewerNameChange, reviewerRole, onReviewerRoleChange, onGenerateShareLink, onSyncSnapshot, onRefreshSession, onAddComment, onToggleCommentStatus, onDeleteComment }) {
	const [selectedParam, setSelectedParam] = (0, import_react.useState)("style");
	const [filterParam, setFilterParam] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [commentBody, setCommentBody] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function onKeyDown(e) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onClose]);
	const parameterValues = (0, import_react.useMemo)(() => extractParameterDisplayValues(session ? session.snapshot : activeSnapshot), [session, activeSnapshot]);
	const commentCounts = (0, import_react.useMemo)(() => summarizeCommentsByParameter(session?.comments ?? []), [session?.comments]);
	const filteredComments = (0, import_react.useMemo)(() => {
		return (session?.comments ?? []).filter((item) => {
			if (filterParam !== "all" && item.parameterKey !== filterParam) return false;
			if (statusFilter !== "all" && item.status !== statusFilter) return false;
			return true;
		});
	}, [
		session?.comments,
		filterParam,
		statusFilter
	]);
	const shareUrl = (0, import_react.useMemo)(() => {
		if (!session) return "";
		const origin = typeof window !== "undefined" ? window.location.origin : "https://oriel.studio";
		return buildBriefShareUrl(origin, session.shareId);
	}, [session]);
	if (!open) return null;
	async function handleCopyLink() {
		if (!shareUrl) return;
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopiedLink(true);
			setTimeout(() => setCopiedLink(false), 1800);
		} catch {}
	}
	async function handleSubmitComment(e) {
		e.preventDefault();
		const trimmed = commentBody.trim();
		if (!trimmed || !session || submitting) return;
		setSubmitting(true);
		try {
			await onAddComment({
				parameterKey: selectedParam,
				body: trimmed
			});
			setCommentBody("");
		} finally {
			setSubmitting(false);
		}
	}
	const openCount = (session?.comments ?? []).filter((c) => c.status === "open").length;
	const resolvedCount = (session?.comments ?? []).filter((c) => c.status === "resolved").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-testid": "brief-collab-drawer",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Team Collaboration & Parameter Review",
		className: "fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px]",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-4xl flex-col border-l border-line bg-surface text-fg shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex shrink-0 items-center justify-between gap-3 border-b border-line bg-raised/60 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b08a45]",
								children: "Team Collaboration & Parameter Review"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-0.5 truncate font-serif text-xl font-bold text-fg",
							children: session ? session.title : activeSnapshot.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "collab-sync-btn",
							onClick: () => void onRefreshSession(),
							disabled: isSyncing,
							className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-muted transition hover:border-[#d4b06a] hover:text-fg disabled:opacity-60",
							title: "Refresh shared brief & comments",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5", isSyncing && "animate-spin") }), "Sync"]
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Close collaboration panel",
							className: "grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0 border-b border-line bg-bg/50 px-5 py-3.5",
					children: !session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted",
									children: "Your Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"data-testid": "collab-owner-name-input",
									value: reviewerName,
									onChange: (e) => onReviewerNameChange(e.target.value),
									placeholder: "Lead Architect",
									className: "mt-1 h-9 w-full rounded-xl border border-line bg-surface px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-muted",
									children: "Studio Role"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: reviewerRole,
									onChange: (e) => onReviewerRoleChange(e.target.value),
									className: "mt-1 h-9 w-full rounded-xl border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]",
									children: COLLAB_REVIEWER_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: r,
										children: r
									}, r))
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "generate-share-link-btn",
							disabled: isCreatingShare,
							onClick: () => void onGenerateShareLink(),
							className: "gold-fill inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-3.5" }), isCreatingShare ? "Generating Link..." : "Generate Share Link"]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[11px] font-semibold text-[#b08a45]",
										children: ["ID: ", session.shareId]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted",
										children: ["Shared by ", session.authorName]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[11px] tabular-nums text-faint",
										children: [
											openCount,
											" open · ",
											resolvedCount,
											" resolved",
											lastSyncedAt ? ` · Updated ${lastSyncedAt}` : ""
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "sync-brief-snapshot-btn",
									disabled: isSyncing,
									onClick: () => void onSyncSnapshot(),
									className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-[11px] font-medium text-fg transition hover:border-[#d4b06a]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-3.5 text-[#b08a45]" }), "Push Brief Edits"]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								readOnly: true,
								"data-testid": "collab-share-url-input",
								"aria-label": "Unique brief share link",
								value: shareUrl,
								onFocus: (e) => e.currentTarget.select(),
								className: "h-9 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 font-mono text-xs text-fg outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"data-testid": "copy-share-url-btn",
								onClick: () => void handleCopyLink(),
								className: "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d4b06a]/60 bg-surface px-3.5 text-xs font-semibold text-fg transition hover:border-[#b08a45]",
								children: [copiedLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5 text-[#b08a45]" }), copiedLink ? "Copied" : "Copy Link"]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12 md:overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "border-b border-line p-4 md:col-span-5 md:overflow-y-auto md:border-r md:border-b-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted",
								children: [
									"Design Parameters (",
									COLLAB_PARAMETER_TARGETS.length,
									")"
								]
							}), filterParam !== "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setFilterParam("all"),
								className: "text-[11px] font-medium text-[#b08a45] hover:underline",
								children: "Show All"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1.5",
							children: COLLAB_PARAMETER_TARGETS.map((target) => {
								const counts = commentCounts[target.key];
								const active = selectedParam === target.key;
								const filtered = filterParam === target.key;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": `collab-param-row-${target.key}`,
									onClick: () => {
										setSelectedParam(target.key);
										setFilterParam((prev) => prev === target.key ? "all" : target.key);
									},
									className: cn("w-full rounded-xl border px-3 py-2 text-left transition", active || filtered ? "border-[#b08a45] bg-[#d4b06a]/12" : "border-line bg-raised/50 hover:border-[#d4b06a]/60"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-fg",
											children: target.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] tabular-nums text-muted",
											children: counts.total > 0 ? `${counts.open} open · ${counts.total}` : "0"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 line-clamp-1 font-mono text-[11px] text-muted",
										children: parameterValues[target.key]
									})]
								}, target.key);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex min-h-0 flex-col p-4 md:col-span-7 md:overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted",
										children: filterParam === "all" ? "All Parameter Comments" : `Anchored: ${COLLAB_PARAMETER_TARGETS.find((t) => t.key === filterParam)?.label}`
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1 rounded-lg border border-line bg-raised p-0.5",
									children: [
										"all",
										"open",
										"resolved"
									].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setStatusFilter(st),
										className: cn("rounded-md px-2 py-1 text-[11px] font-medium capitalize transition", statusFilter === st ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg"),
										children: st
									}, st))
								})]
							}),
							session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: (e) => void handleSubmitComment(e),
								className: "mb-3 shrink-0 rounded-2xl border border-line bg-raised/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-faint",
												children: "Reviewer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												"data-testid": "collab-author-input",
												value: reviewerName,
												onChange: (e) => onReviewerNameChange(e.target.value),
												placeholder: "Your name",
												className: "mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-faint",
												children: "Role"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												value: reviewerRole,
												onChange: (e) => onReviewerRoleChange(e.target.value),
												className: "mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]",
												children: COLLAB_REVIEWER_ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: r,
													children: r
												}, r))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "block text-[11px] sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-faint",
												children: "Target Parameter"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												"data-testid": "collab-param-select",
												value: selectedParam,
												onChange: (e) => setSelectedParam(e.target.value),
												className: "mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]",
												children: COLLAB_PARAMETER_TARGETS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: t.key,
													children: [
														t.label,
														" — ",
														parameterValues[t.key]
													]
												}, t.key))
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										"data-testid": "collab-comment-input",
										value: commentBody,
										onChange: (e) => setCommentBody(e.target.value),
										rows: 2,
										placeholder: `Comment on ${COLLAB_PARAMETER_TARGETS.find((t) => t.key === selectedParam)?.label} (${parameterValues[selectedParam]})...`,
										className: "min-h-14 flex-1 resize-none rounded-xl border border-line bg-surface px-3 py-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										"data-testid": "collab-submit-comment-btn",
										disabled: submitting || !commentBody.trim(),
										className: "gold-fill inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5" }), submitting ? "Posting..." : "Post Comment"]
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 rounded-2xl border border-dashed border-line bg-raised/40 p-4 text-xs text-muted",
								children: "Generate a unique share link above to invite teammates and anchor feedback directly to architectural design parameters."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-h-40 flex-1 space-y-2.5 overflow-y-auto pr-1",
								children: [session && filteredComments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-2xl border border-line/70 bg-raised/30 p-5 text-center text-xs text-muted",
									children: "No comments match this filter yet. Select any design parameter on the left and post the first review note."
								}) : null, filteredComments.map((cmt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									"data-testid": "collab-comment-item",
									className: cn("rounded-2xl border p-3.5 transition", cmt.status === "resolved" ? "border-line/70 bg-raised/30 opacity-80" : "border-line bg-raised/70"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold text-fg",
														children: cmt.authorName
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-faint",
														children: cmt.authorRole
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-[10px] text-faint",
														children: new Date(cmt.createdAt).toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit"
														})
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 font-mono text-[11px] text-[#b08a45]",
												children: [
													cmt.parameterLabel,
													": ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-fg/80",
														children: cmt.parameterValue || "—"
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex shrink-0 items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												"data-testid": "toggle-comment-status-btn",
												onClick: () => void onToggleCommentStatus(cmt.id, cmt.status === "resolved" ? "open" : "resolved"),
												className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border px-2 text-[11px] font-medium transition", cmt.status === "resolved" ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-700" : "border-line bg-surface text-muted hover:border-[#d4b06a] hover:text-fg"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), cmt.status === "resolved" ? "Resolved" : "Resolve"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => void onDeleteComment(cmt.id),
												"aria-label": "Delete comment",
												className: "grid size-7 place-items-center rounded-lg border border-line bg-surface text-faint transition hover:text-red-600",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 whitespace-pre-wrap text-xs leading-relaxed text-fg",
										children: cmt.body
									})]
								}, cmt.id))]
							})
						]
					})]
				})
			]
		})
	});
}
var FACADE_OPTIONS = [
	"Minimalist Glass",
	"Board-Marked Concrete",
	"Biophilic Timber Louver",
	"Nordic Brick & Zinc",
	"Parametric Kinetic Facade",
	"Classical Limestone"
];
var MATERIAL_OPTIONS = [
	{
		id: "concrete",
		label: "Concrete"
	},
	{
		id: "timber",
		label: "Timber"
	},
	{
		id: "travertine",
		label: "Travertine"
	},
	{
		id: "brick",
		label: "Brick"
	}
];
var FOCAL_OPTIONS = [
	24,
	35,
	50,
	85
];
function BriefTemplateLibrary({ activeTemplateId, onLoadTemplate, design, engine, scene3d, frame, onUpdateFrame, onUpdateEngineField, onUpdateScene3DField }) {
	const [expanded, setExpanded] = (0, import_react.useState)(true);
	const [category, setCategory] = (0, import_react.useState)("All");
	const [search, setSearch] = (0, import_react.useState)("");
	const [failedImages, setFailedImages] = (0, import_react.useState)({});
	const filteredTemplates = (0, import_react.useMemo)(() => filterBriefTemplates(category, search), [category, search]);
	const activeTemplate = (0, import_react.useMemo)(() => BRIEF_TEMPLATES.find((t) => t.id === activeTemplateId) ?? null, [activeTemplateId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"data-testid": "brief-template-library",
		"aria-label": "Architectural Brief Template Library",
		className: "mx-auto w-full max-w-7xl px-4 pt-4 md:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-line bg-surface p-4 md:p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-lg font-semibold text-fg",
								children: "Brief Template Library"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted",
							children: [
								BRIEF_TEMPLATES.length,
								" curated architectural blueprints",
								activeTemplate ? ` · Active: ${activeTemplate.name}` : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setExpanded((prev) => !prev),
						"aria-expanded": expanded,
						className: "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-raised px-3 text-xs font-medium text-fg transition hover:border-[#d4b06a]",
						children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Hide Library ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3.5" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Browse Templates ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-testid": "visual-config-bar",
					className: "mt-3 grid grid-cols-2 gap-2.5 border-t border-line/70 pt-3 sm:grid-cols-3 lg:grid-cols-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-faint",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3 text-[#b08a45]" }), " Workflow"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Visual config workflow",
								value: engine.workflowPreset,
								onChange: (e) => onUpdateEngineField("workflowPreset", e.target.value),
								className: "mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 text-xs text-fg outline-none focus:border-[#d4b06a]",
								children: WORKFLOW_PRESETS.map((wf) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: wf.id,
									children: wf.label
								}, wf.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-faint",
								children: "Facade Typology"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Visual config facade",
								value: engine.facadeTypology,
								onChange: (e) => onUpdateEngineField("facadeTypology", e.target.value),
								className: "mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 text-xs text-fg outline-none focus:border-[#d4b06a]",
								children: FACADE_OPTIONS.map((fac) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: fac,
									children: fac
								}, fac))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-faint",
								children: "3D Material"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Visual config material",
								value: scene3d.primaryMaterial,
								onChange: (e) => onUpdateScene3DField("primaryMaterial", e.target.value),
								className: "mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 text-xs text-fg outline-none focus:border-[#d4b06a]",
								children: MATERIAL_OPTIONS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.id,
									children: m.label
								}, m.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-faint",
								children: "Optics Lens"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Visual config focal length",
								value: scene3d.focalLength,
								onChange: (e) => onUpdateScene3DField("focalLength", Number(e.target.value)),
								className: "mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 font-mono text-xs tabular-nums text-fg outline-none focus:border-[#d4b06a]",
								children: FOCAL_OPTIONS.map((mm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: mm,
									children: [mm, "mm Shift"]
								}, mm))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-faint",
								children: "Aspect Ratio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Visual config aspect ratio",
								value: frame.ratio,
								onChange: (e) => onUpdateFrame({
									...frame,
									ratio: e.target.value
								}),
								className: "mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 font-mono text-xs tabular-nums text-fg outline-none focus:border-[#d4b06a]",
								children: RATIOS.map((ratio) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: ratio,
									children: ratio
								}, ratio))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-faint",
								children: "Output Quality"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								"aria-label": "Visual config resolution",
								value: frame.resolution,
								onChange: (e) => onUpdateFrame({
									...frame,
									resolution: e.target.value
								}),
								className: "mt-1 h-8 w-full rounded-lg border border-line bg-raised px-2 font-mono text-xs uppercase text-fg outline-none focus:border-[#d4b06a]",
								children: RESOLUTIONS.map((res) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: res,
									children: [
										res.toUpperCase(),
										" (",
										design.range,
										")"
									]
								}, res))
							})]
						})
					]
				}),
				expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3 border-t border-line/70 pt-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							role: "tablist",
							"aria-label": "Brief template categories",
							className: "flex flex-wrap items-center gap-1 rounded-xl bg-raised p-1",
							children: BRIEF_TEMPLATE_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": category === cat,
								onClick: () => setCategory(cat),
								className: cn("h-7 shrink-0 whitespace-nowrap rounded-lg px-2.5 text-xs font-medium transition", category === cat ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg"),
								children: cat
							}, cat))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative min-w-[210px] flex-1 sm:max-w-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "search",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Search templates (e.g. Modern, Urban)...",
								"aria-label": "Search brief templates",
								className: "h-8 w-full rounded-lg border border-line bg-raised pr-3 pl-8 text-xs text-fg outline-none focus:border-[#d4b06a]"
							})]
						})]
					}), filteredTemplates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-line bg-raised/50 p-6 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"No architectural templates match “",
								search,
								"” in ",
								category,
								"."
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setCategory("All");
								setSearch("");
							},
							className: "mt-2 inline-flex h-8 items-center rounded-lg border border-line bg-surface px-3 text-xs font-medium text-fg hover:border-[#d4b06a]",
							children: "Show All Templates"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
						children: filteredTemplates.map((tpl) => {
							const isActive = activeTemplateId === tpl.id;
							const imgFailed = failedImages[tpl.id];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								"data-testid": `template-card-${tpl.id}`,
								className: cn("flex flex-col overflow-hidden rounded-2xl border transition", isActive ? "border-[#b08a45] bg-[#fffaf0]" : "border-line bg-raised/40 hover:border-[#d4b06a]/80"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative h-28 w-full overflow-hidden bg-[#1b1814]",
									children: !imgFailed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: tpl.previewImage,
										alt: `${tpl.name} architectural preview`,
										referrerPolicy: "no-referrer",
										onError: () => setFailedImages((prev) => ({
											...prev,
											[tpl.id]: true
										})),
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2a241d] to-[#14110e] p-3 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif text-xs text-[#e7c27a]",
											children: tpl.name
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 flex-col justify-between p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] font-medium text-[#927032]",
											children: [
												tpl.category,
												" · ",
												tpl.designPatch.vertical ?? "architecture"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-0.5 truncate font-serif text-sm font-semibold text-fg",
											children: tpl.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted",
											children: tpl.tagline
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2.5 flex items-center justify-between gap-2 border-t border-line/60 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "truncate font-mono text-[10px] tabular-nums text-faint",
											children: [
												tpl.scene3dPatch.focalLength ?? 28,
												"mm · ",
												tpl.frameRatio,
												" ·",
												" ",
												tpl.frameResolution.toUpperCase()
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"data-testid": `load-template-${tpl.id}`,
											"aria-label": `Load ${tpl.name} template`,
											onClick: () => onLoadTemplate(tpl),
											className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-2.5 text-[11px] font-semibold transition", isActive ? "border border-[#b08a45] bg-[#d4b06a]/20 text-[#6e4c14]" : "gold-fill text-[#2a1c0c]"),
											children: isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Loaded"] }) : "Load Template"
										})]
									})]
								})]
							}, tpl.id);
						})
					})]
				}) : null
			]
		})
	});
}
var PDF_SUBMISSION_PHASES = [
	"Schematic Design · Phase 01",
	"Client Design Review",
	"Competition Submittal",
	"Material & Lighting Sign-Off"
];
function buildClientPdfVisualConfigRows(design, engine, scene3d, frame) {
	const solarSpec = scene3d.geoEnabled ? `${formatSolarTime(scene3d.geoHour)} · Month ${scene3d.geoMonth} · Lat ${scene3d.geoLatitude}°` : `${scene3d.sunAzimuth}° Az / ${scene3d.sunElevation}° El`;
	return [
		{
			group: "Design Direction",
			parameter: "Discipline & Quality Tier",
			value: `${design.vertical.toUpperCase()} · ${design.range} · ${design.look}`
		},
		{
			group: "Design Direction",
			parameter: "Atmosphere & Color Base",
			value: `${design.mood} · ${design.color} · ${design.weather}`
		},
		{
			group: "Output Frame",
			parameter: "Aspect & Resolution",
			value: `${frame.ratio} · ${frame.resolution.toUpperCase()} (${engine.outputMode === "grid-4" ? "4-Up Grid" : "Single Plate"})`
		},
		{
			group: "Engine & Conditioning",
			parameter: "Workflow & Fidelity",
			value: `${engine.workflowPreset} · ${engine.renderFidelity} · Geometry Lock ${engine.geometryLock}%`
		},
		{
			group: "Engine & Conditioning",
			parameter: "Facade & Climate Context",
			value: `${engine.facadeTypology} · ${engine.climateRegion}`
		},
		{
			group: "Engine & Conditioning",
			parameter: "Seed & Stylize Control",
			value: `Seed #${engine.seed}${engine.seedLocked ? " (Locked)" : ""} · --s ${engine.mjStylize} · Edge ${engine.edgeAdherence}%`
		},
		{
			group: "3D Studio & Optics",
			parameter: "Massing & Primary Material",
			value: `${scene3d.preset} · ${scene3d.primaryMaterial} · ${scene3d.focalLength}mm Lens`
		},
		{
			group: "3D Studio & Optics",
			parameter: "Solar & HDRI Lighting",
			value: `${design.light} · ${solarSpec} · HDRI: ${scene3d.hdriMood}`
		}
	];
}
function buildPdfFilename(projectName) {
	return `${projectName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "oriel-architectural-brief"}-presentation.pdf`;
}
function hexToRgb(hex) {
	const clean = hex.replace("#", "").trim();
	if (clean.length === 3) {
		const r = parseInt(clean[0] + clean[0], 16);
		const g = parseInt(clean[1] + clean[1], 16);
		const b = parseInt(clean[2] + clean[2], 16);
		return [
			Number.isFinite(r) ? r : 180,
			Number.isFinite(g) ? g : 140,
			Number.isFinite(b) ? b : 70
		];
	}
	if (clean.length === 6) {
		const r = parseInt(clean.slice(0, 2), 16);
		const g = parseInt(clean.slice(2, 4), 16);
		const b = parseInt(clean.slice(4, 6), 16);
		return [
			Number.isFinite(r) ? r : 180,
			Number.isFinite(g) ? g : 140,
			Number.isFinite(b) ? b : 70
		];
	}
	return [
		180,
		140,
		70
	];
}
function generateClientBriefPdf(input) {
	const doc = new import_jspdf_node_min.jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4",
		compress: false
	});
	const pageW = doc.internal.pageSize.getWidth();
	const pageH = doc.internal.pageSize.getHeight();
	const marginX = 16;
	const contentW = pageW - 32;
	const bottomLimit = pageH - 18;
	let y = 0;
	const projectTitle = input.meta.projectName.trim() || input.visionDoc.title || "Architectural Vision Brief";
	const clientName = input.meta.clientName.trim() || "Client Presentation Copy";
	const preparedBy = input.meta.preparedBy.trim() || "Oriel Architectural Visualization Studio";
	const phase = input.meta.phase.trim() || "Schematic Design · Phase 01";
	const drawHeaderBand = (isContinuation = false) => {
		doc.setFillColor(24, 21, 18);
		doc.rect(0, 0, pageW, isContinuation ? 18 : 38, "F");
		doc.setFillColor(212, 176, 106);
		doc.rect(0, isContinuation ? 17.2 : 37, pageW, 1, "F");
		if (isContinuation) {
			doc.setFont("helvetica", "bold");
			doc.setFontSize(8.5);
			doc.setTextColor(212, 176, 106);
			doc.text("ORIEL ARCHVIZ STUDIO", marginX, 8.5);
			doc.setFont("helvetica", "normal");
			doc.setTextColor(235, 228, 216);
			doc.text(`${projectTitle} · ${phase}`, marginX, 13.5);
			y = 26;
			return;
		}
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8.5);
		doc.setTextColor(212, 176, 106);
		doc.text("ORIEL ARCHITECTURAL VISUALIZATION STUDIO · CLIENT SPECIFICATION", marginX, 11);
		doc.setFont("times", "bold");
		doc.setFontSize(20);
		doc.setTextColor(250, 246, 239);
		const titleLines = doc.splitTextToSize(projectTitle, contentW).slice(0, 2);
		doc.text(titleLines, marginX, 20.5);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(9.5);
		doc.setTextColor(208, 198, 182);
		const subLines = doc.splitTextToSize(input.visionDoc.subtitle, contentW).slice(0, 1);
		doc.text(subLines, marginX, 31.5);
		y = 46;
	};
	const ensureSpace = (neededMm) => {
		if (y + neededMm > bottomLimit) {
			doc.addPage();
			drawHeaderBand(true);
		}
	};
	const drawSectionHeading = (numStr, heading) => {
		ensureSpace(14);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8.5);
		doc.setTextColor(176, 138, 69);
		doc.text(numStr.toUpperCase(), marginX, y);
		y += 4.5;
		doc.setFont("times", "bold");
		doc.setFontSize(13.5);
		doc.setTextColor(28, 25, 21);
		doc.text(heading, marginX, y);
		y += 2.5;
		doc.setDrawColor(224, 216, 203);
		doc.setLineWidth(.35);
		doc.line(marginX, y, pageW - marginX, y);
		y += 5.5;
	};
	drawHeaderBand(false);
	doc.setFillColor(249, 246, 240);
	doc.setDrawColor(227, 219, 206);
	doc.roundedRect(marginX, y, contentW, 20, 2, 2, "FD");
	const metaCols = [
		{
			label: "CLIENT / RECIPIENT",
			val: clientName
		},
		{
			label: "PREPARED BY",
			val: preparedBy
		},
		{
			label: "SUBMISSION PHASE",
			val: phase
		},
		{
			label: "DATE & TEMPLATE",
			val: `${input.visionDoc.date}${input.activeTemplateName ? ` · ${input.activeTemplateName}` : ""}`
		}
	];
	const colW = contentW / 4;
	metaCols.forEach((col, i) => {
		const cx = 19.5 + i * colW;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7);
		doc.setTextColor(132, 120, 102);
		doc.text(col.label, cx, y + 6.2);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(32, 28, 24);
		const lines = doc.splitTextToSize(col.val, colW - 6).slice(0, 2);
		doc.text(lines, cx, y + 11.2);
	});
	y += 26;
	if (input.previewImageDataUrl && input.previewImageDataUrl.startsWith("data:image/")) try {
		const imgH = 54;
		const imgW = 96;
		ensureSpace(64);
		doc.setFillColor(28, 25, 21);
		doc.roundedRect(marginX, y, contentW, 58, 2, 2, "F");
		const fmt = input.previewImageDataUrl.includes("image/png") ? "PNG" : "JPEG";
		doc.addImage(input.previewImageDataUrl, fmt, 18, y + 2, imgW, imgH);
		const capX = 119;
		const capW = contentW - imgW - 11;
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8);
		doc.setTextColor(212, 176, 106);
		doc.text("VISUAL REFERENCE PLATE", capX, y + 10);
		doc.setFont("times", "bold");
		doc.setFontSize(12);
		doc.setTextColor(246, 239, 228);
		doc.text(doc.splitTextToSize(input.visionDoc.style?.name ?? input.design.look, capW).slice(0, 2), capX, y + 17);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(200, 190, 176);
		const captionDesc = doc.splitTextToSize(`${input.visionDoc.lighting?.name ?? input.design.light} · ${input.visionDoc.camera?.name ?? `${input.scene3d.focalLength}mm Architecture Lens`} · Aspect ${input.frame.ratio}`, capW).slice(0, 4);
		doc.text(captionDesc, capX, y + 29);
		y += 64;
	} catch {}
	drawSectionHeading("Section 01", "Architectural Vision & Brief Specification");
	const slotBlocks = [
		{
			title: "Architectural Style & Massing",
			name: input.visionDoc.style?.name ?? "Custom Architectural Direction",
			desc: input.visionDoc.style?.description ?? "Bespoke spatial envelope balancing proportion, structural clarity, and warm materiality."
		},
		{
			title: "Lighting Condition & Solar Environment",
			name: input.visionDoc.lighting?.name ?? input.design.light,
			desc: input.visionDoc.lighting?.description ?? "Calibrated architectural lighting emphasizing surface texture and atmospheric depth."
		},
		{
			title: "Mood & Spatial Psychology",
			name: input.visionDoc.mood?.name ?? input.design.mood,
			desc: input.visionDoc.mood?.description ?? "Refined spatial rhythm designed for human comfort and editorial presentation."
		},
		{
			title: "Camera Strategy & Framing",
			name: input.visionDoc.camera?.name ?? `${input.scene3d.focalLength}mm Architectural Shift`,
			desc: input.visionDoc.camera?.description ?? "Two-point corrected vertical framing preserving natural architectural perspective."
		}
	];
	for (const item of slotBlocks) {
		const descLines = doc.splitTextToSize(item.desc, contentW - 6);
		ensureSpace(9 + descLines.length * 4.2 + 3);
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8.5);
		doc.setTextColor(132, 102, 50);
		doc.text(`${item.title}: `, marginX, y);
		const prefixW = doc.getTextWidth(`${item.title}: `);
		doc.setTextColor(28, 25, 21);
		doc.text(item.name, marginX + prefixW, y);
		y += 4.5;
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.8);
		doc.setTextColor(74, 67, 58);
		doc.text(descLines, 18, y);
		y += descLines.length * 4.2 + 3.5;
	}
	if (input.visionDoc.customNotes.trim()) {
		const noteLines = doc.splitTextToSize(input.visionDoc.customNotes.trim(), contentW - 8);
		const boxH = 10 + noteLines.length * 4.2;
		ensureSpace(boxH + 4);
		doc.setFillColor(246, 242, 234);
		doc.setDrawColor(220, 208, 187);
		doc.roundedRect(marginX, y, contentW, boxH, 1.5, 1.5, "FD");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(8);
		doc.setTextColor(140, 106, 48);
		doc.text("STUDIO DIRECTIVES & PROJECT NOTES", 20, y + 5.5);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(8.5);
		doc.setTextColor(40, 35, 30);
		doc.text(noteLines, 20, y + 10.5);
		y += boxH + 6;
	}
	if (input.meta.includeVisualSettings) {
		drawSectionHeading("Section 02", "Visual Configuration Settings");
		const configRows = buildClientPdfVisualConfigRows(input.design, input.engine, input.scene3d, input.frame);
		const halfW = (contentW - 4) / 2;
		for (let i = 0; i < configRows.length; i += 2) {
			ensureSpace(16);
			[configRows[i], configRows[i + 1]].filter(Boolean).forEach((row, colIdx) => {
				const rx = marginX + colIdx * (halfW + 4);
				doc.setFillColor(250, 248, 244);
				doc.setDrawColor(228, 221, 210);
				doc.roundedRect(rx, y, halfW, 13.5, 1.2, 1.2, "FD");
				doc.setFont("helvetica", "bold");
				doc.setFontSize(7);
				doc.setTextColor(145, 132, 114);
				doc.text(`${row.group.toUpperCase()} · ${row.parameter.toUpperCase()}`, rx + 3, y + 4.8);
				doc.setFont("helvetica", "normal");
				doc.setFontSize(8.5);
				doc.setTextColor(28, 25, 21);
				const valLines = doc.splitTextToSize(row.value, halfW - 6).slice(0, 1);
				doc.text(valLines, rx + 3, y + 10);
			});
			y += 15.5;
		}
		y += 2;
	}
	const swatches = input.visionDoc.style?.swatches ?? [
		"#d8cfc1",
		"#9b8c78",
		"#4e473f",
		"#1f1c18"
	];
	const matList = input.visionDoc.style?.materials ?? [
		"Fair-faced concrete",
		"White oak",
		"Honed travertine",
		"Low-iron glass"
	];
	ensureSpace(20);
	doc.setFont("helvetica", "bold");
	doc.setFontSize(8);
	doc.setTextColor(110, 98, 82);
	doc.text("KEY MATERIAL & TONAL SWATCHES", marginX, y);
	y += 4;
	swatches.slice(0, 4).forEach((hex, idx) => {
		const sx = marginX + idx * (contentW / 4);
		const [r, g, b] = hexToRgb(hex);
		doc.setFillColor(r, g, b);
		doc.setDrawColor(180, 170, 155);
		doc.roundedRect(sx, y, 7, 7, 1, 1, "FD");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7.5);
		doc.setTextColor(32, 28, 24);
		doc.text(doc.splitTextToSize(matList[idx] ?? hex, contentW / 4 - 11).slice(0, 1), sx + 9, y + 3.2);
		doc.setFont("courier", "normal");
		doc.setFontSize(7);
		doc.setTextColor(120, 110, 96);
		doc.text(hex.toUpperCase(), sx + 9, y + 6.6);
	});
	y += 13;
	if (input.meta.includeBimSchedule && input.schedule.length > 0) {
		drawSectionHeading("Section 03", "BIM Material & Lighting Schedule");
		const colWidths = [
			20,
			46,
			76,
			22,
			14
		];
		const drawTableHeader = () => {
			ensureSpace(12);
			doc.setFillColor(241, 235, 224);
			doc.rect(marginX, y, contentW, 7, "F");
			doc.setFont("helvetica", "bold");
			doc.setFontSize(7.5);
			doc.setTextColor(88, 78, 66);
			const headers = [
				"CODE",
				"ELEMENT",
				"SPECIFICATION",
				"SWATCH",
				"AREA"
			];
			let cx = 18;
			headers.forEach((h, i) => {
				doc.text(h, i === 4 ? cx + colWidths[i] - 4 : cx, y + 4.8, i === 4 ? { align: "right" } : void 0);
				cx += colWidths[i];
			});
			y += 7;
		};
		drawTableHeader();
		for (const row of input.schedule) {
			const specLines = doc.splitTextToSize(row.specification, colWidths[2] - 4);
			const elLines = doc.splitTextToSize(row.element, colWidths[1] - 4);
			const lineCount = Math.max(specLines.length, elLines.length, 1);
			const rowH = Math.max(8, lineCount * 4 + 3.5);
			if (y + rowH > bottomLimit) {
				doc.addPage();
				drawHeaderBand(true);
				drawTableHeader();
			}
			doc.setDrawColor(232, 225, 214);
			doc.line(marginX, y + rowH, marginX + contentW, y + rowH);
			let cx = 18;
			doc.setFont("courier", "bold");
			doc.setFontSize(8);
			doc.setTextColor(176, 138, 69);
			doc.text(row.code, cx, y + 5);
			cx += colWidths[0];
			doc.setFont("helvetica", "bold");
			doc.setFontSize(8);
			doc.setTextColor(28, 25, 21);
			doc.text(elLines, cx, y + 5);
			cx += colWidths[1];
			doc.setFont("helvetica", "normal");
			doc.setFontSize(8);
			doc.setTextColor(78, 70, 60);
			doc.text(specLines, cx, y + 5);
			cx += colWidths[2];
			const [r, g, b] = hexToRgb(row.finishHex);
			doc.setFillColor(r, g, b);
			doc.setDrawColor(180, 172, 160);
			doc.rect(cx, y + 2.5, 3.5, 3.5, "FD");
			doc.setFont("courier", "normal");
			doc.setFontSize(7.2);
			doc.setTextColor(65, 58, 50);
			doc.text(row.finishHex, cx + 5, y + 5.2);
			cx += colWidths[3];
			doc.setFont("courier", "bold");
			doc.setFontSize(8);
			doc.setTextColor(28, 25, 21);
			doc.text(`${row.areaSharePct}%`, cx + colWidths[4] - 4, y + 5, { align: "right" });
			y += rowH;
		}
		y += 6;
	}
	if (input.meta.includePromptAppendix) {
		drawSectionHeading("Section 04", "Compiled Diffusion Prompt & Conditioning Spec");
		const promptLines = doc.splitTextToSize(input.visionDoc.synthesizedPrompt, contentW - 8);
		const boxH = 9 + promptLines.length * 4;
		ensureSpace(boxH + 6);
		doc.setFillColor(28, 25, 21);
		doc.roundedRect(marginX, y, contentW, boxH, 1.8, 1.8, "F");
		doc.setFont("helvetica", "bold");
		doc.setFontSize(7.5);
		doc.setTextColor(212, 176, 106);
		const dictLine = input.dictionarySummary ? `SYNTHESIZED PROMPT · DICTIONARY SCENARIO: ${input.dictionarySummary.presetId.toUpperCase()} (${input.dictionarySummary.blockCount} BLOCKS)` : "SYNTHESIZED ARCHITECTURAL GENERATION PROMPT";
		doc.text(dictLine, 20, y + 5.2);
		doc.setFont("courier", "normal");
		doc.setFontSize(7.8);
		doc.setTextColor(238, 232, 222);
		doc.text(promptLines, 20, y + 9.5);
		y += boxH + 6;
	}
	const pageCount = doc.getNumberOfPages();
	for (let p = 1; p <= pageCount; p++) {
		doc.setPage(p);
		doc.setDrawColor(224, 216, 203);
		doc.setLineWidth(.3);
		doc.line(marginX, pageH - 12, pageW - marginX, pageH - 12);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(7.5);
		doc.setTextColor(125, 114, 98);
		doc.text(`Prepared by ${preparedBy} · ${clientName}`, marginX, pageH - 7.5);
		doc.text(`Page ${p} of ${pageCount}`, pageW - marginX, pageH - 7.5, { align: "right" });
	}
	const arrayBuffer = doc.output("arraybuffer");
	const blob = doc.output("blob");
	return {
		filename: buildPdfFilename(projectTitle),
		byteLength: arrayBuffer.byteLength,
		pageCount,
		arrayBuffer,
		blob
	};
}
async function imageUrlToJpegDataUrl(src) {
	if (!src) return null;
	if (src.startsWith("data:image/")) return src;
	try {
		const img = new Image();
		img.crossOrigin = "anonymous";
		const loaded = await new Promise((resolve, reject) => {
			img.onload = () => resolve(img);
			img.onerror = () => reject(/* @__PURE__ */ new Error("Image load failed"));
			img.src = src;
		});
		const canvas = document.createElement("canvas");
		const targetW = 768;
		const targetH = 432;
		canvas.width = targetW;
		canvas.height = targetH;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;
		const srcRatio = loaded.naturalWidth / Math.max(1, loaded.naturalHeight);
		const dstRatio = targetW / targetH;
		let sx = 0;
		let sy = 0;
		let sw = loaded.naturalWidth;
		let sh = loaded.naturalHeight;
		if (srcRatio > dstRatio) {
			sw = loaded.naturalHeight * dstRatio;
			sx = (loaded.naturalWidth - sw) * .5;
		} else {
			sh = loaded.naturalWidth / dstRatio;
			sy = (loaded.naturalHeight - sh) * .5;
		}
		ctx.drawImage(loaded, sx, sy, sw, sh, 0, 0, targetW, targetH);
		return canvas.toDataURL("image/jpeg", .85);
	} catch {
		return null;
	}
}
function ClientPdfExportModal({ open, onClose, visionDoc, design, engine, scene3d, frame, schedule, dictionarySummary, activeTemplateName, previewImageUrl }) {
	const [meta, setMeta] = (0, import_react.useState)({
		projectName: visionDoc.title,
		clientName: "Private Client & Design Committee",
		preparedBy: "Oriel Archviz Studio",
		phase: PDF_SUBMISSION_PHASES[0],
		includeVisualSettings: true,
		includeBimSchedule: true,
		includePromptAppendix: true
	});
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [lastExportSummary, setLastExportSummary] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (open) setMeta((prev) => ({
			...prev,
			projectName: visionDoc.title || prev.projectName
		}));
	}, [open, visionDoc.title]);
	if (!open) return null;
	const visualRows = buildClientPdfVisualConfigRows(design, engine, scene3d, frame);
	async function handleDownloadPdf() {
		setExporting(true);
		try {
			const previewDataUrl = await imageUrlToJpegDataUrl(previewImageUrl);
			const pdf = generateClientBriefPdf({
				visionDoc,
				design,
				engine,
				scene3d,
				frame,
				schedule,
				dictionarySummary,
				activeTemplateName,
				meta,
				previewImageDataUrl: previewDataUrl
			});
			const url = URL.createObjectURL(pdf.blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = pdf.filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
			const kb = Math.max(1, Math.round(pdf.byteLength / 1024));
			const summary = `${pdf.filename} (${pdf.pageCount} page${pdf.pageCount === 1 ? "" : "s"} · ${kb} KB)`;
			setLastExportSummary(summary);
			toast.success(`Exported Client PDF: ${summary}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to generate PDF document.");
		} finally {
			setExporting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Export Client Presentation PDF",
		"data-testid": "client-pdf-modal",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-line px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-lg font-semibold text-fg",
							children: "Client Presentation PDF Export"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Formatted A4 specification compiling brief narratives, visual settings, and BIM schedule."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close PDF export modal",
						className: "grid size-8 place-items-center rounded-lg border border-line bg-raised text-muted hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 lg:grid-cols-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3.5 lg:col-span-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-fg",
									children: "Project Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"aria-label": "PDF project title",
									value: meta.projectName,
									onChange: (e) => setMeta((m) => ({
										...m,
										projectName: e.target.value
									})),
									className: "mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-fg",
									children: "Client / Recipient"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"aria-label": "PDF client name",
									value: meta.clientName,
									onChange: (e) => setMeta((m) => ({
										...m,
										clientName: e.target.value
									})),
									className: "mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-fg",
									children: "Prepared By (Studio / Firm)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									"aria-label": "PDF prepared by",
									value: meta.preparedBy,
									onChange: (e) => setMeta((m) => ({
										...m,
										preparedBy: e.target.value
									})),
									className: "mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-fg",
									children: "Submission Phase"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									"aria-label": "PDF submission phase",
									value: meta.phase,
									onChange: (e) => setMeta((m) => ({
										...m,
										phase: e.target.value
									})),
									className: "mt-1 h-9 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]",
									children: PDF_SUBMISSION_PHASES.map((phase) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: phase,
										children: phase
									}, phase))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 border-t border-line pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-semibold uppercase tracking-wider text-faint",
										children: "Included Document Sections"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-xs text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: meta.includeVisualSettings,
											onChange: (e) => setMeta((m) => ({
												...m,
												includeVisualSettings: e.target.checked
											})),
											className: "size-4 accent-[#b08a45]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Visual Configuration Settings Matrix (",
											visualRows.length,
											" params)"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-xs text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: meta.includeBimSchedule,
											onChange: (e) => setMeta((m) => ({
												...m,
												includeBimSchedule: e.target.checked
											})),
											className: "size-4 accent-[#b08a45]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"BIM Material & Lighting Schedule (",
											schedule.length,
											" rows)"
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-xs text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: meta.includePromptAppendix,
											onChange: (e) => setMeta((m) => ({
												...m,
												includePromptAppendix: e.target.checked
											})),
											className: "size-4 accent-[#b08a45]"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compiled AI Prompt & Dictionary Appendix" })]
									})
								]
							}),
							lastExportSummary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								"data-testid": "pdf-export-status",
								className: "rounded-xl border border-emerald-600/30 bg-emerald-500/10 px-3 py-2 font-mono text-[11px] text-emerald-800",
								children: ["Saved: ", lastExportSummary]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-line bg-[#ebe5da] p-4 lg:col-span-7",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto overflow-hidden rounded-lg border border-[#d6ccb9] bg-white shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b-2 border-[#d4b06a] bg-[#181512] px-5 py-4 text-[#faf6ef]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[9px] font-semibold tracking-widest text-[#d4b06a]",
										children: "ORIEL ARCHVIZ STUDIO · CLIENT SPECIFICATION"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 font-serif text-lg font-bold leading-snug",
										children: meta.projectName || visionDoc.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-[#d0c6b6]",
										children: visionDoc.subtitle
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3.5 p-4 text-[11px] text-[#1c1915]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 rounded-lg border border-[#e3dbce] bg-[#f9f6f0] p-2.5 sm:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] font-semibold text-[#847866]",
												children: "CLIENT"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-medium",
												children: meta.clientName
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] font-semibold text-[#847866]",
												children: "PREPARED BY"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-medium",
												children: meta.preparedBy
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] font-semibold text-[#847866]",
												children: "PHASE"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-medium",
												children: meta.phase
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[9px] font-semibold text-[#847866]",
												children: "TEMPLATE"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-medium",
												children: activeTemplateName ?? "Custom Brief"
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "border-b border-[#e5ded2] pb-1 font-serif text-xs font-bold",
										children: "01. Architectural Vision & Brief"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 line-clamp-3 text-[#4a433a]",
										children: visionDoc.style?.description ?? visionDoc.synthesizedPrompt
									})] }),
									meta.includeVisualSettings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "border-b border-[#e5ded2] pb-1 font-serif text-xs font-bold",
										children: "02. Visual Configuration Settings"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5 grid grid-cols-2 gap-1.5",
										children: visualRows.slice(0, 6).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded border border-[#e4ddcf] bg-[#faf8f4] px-2 py-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[8px] font-semibold text-[#918472] uppercase",
												children: row.parameter
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate font-mono text-[10px]",
												children: row.value
											})]
										}, row.parameter))
									})] }) : null,
									meta.includeBimSchedule ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "border-b border-[#e5ded2] pb-1 font-serif text-xs font-bold",
										children: "03. BIM Material & Lighting Schedule"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1.5 space-y-1",
										children: schedule.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 border-b border-[#f0eae0] py-1 text-[10px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono font-semibold text-[#b08a45]",
													children: row.code
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "min-w-0 flex-1 truncate font-medium",
													children: row.element
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono tabular-nums text-[#4a433a]",
													children: [row.areaSharePct, "%"]
												})
											]
										}, row.code))
									})] }) : null
								]
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2 border-t border-line bg-raised/50 px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Exports multi-section vector A4 PDF via client-side engine."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							className: "inline-flex h-9 items-center rounded-lg border border-line bg-surface px-4 text-xs font-medium text-muted hover:text-fg",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "download-client-pdf-btn",
							disabled: exporting,
							onClick: () => void handleDownloadPdf(),
							className: "gold-fill inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-55",
							children: [exporting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Download Client PDF (.pdf)"]
						})]
					})]
				})
			]
		})
	});
}
function MoodboardOverlay({ open, onClose, queries, result, loading, error, customQuery, onCustomQueryChange, onGenerate, onPinToBrief, pinnedIds }) {
	const [activeFacet, setActiveFacet] = (0, import_react.useState)("All");
	const [inspectedItem, setInspectedItem] = (0, import_react.useState)(null);
	const [fallbackFullMap, setFallbackFullMap] = (0, import_react.useState)({});
	const [brokenIds, setBrokenIds] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function onKeyDown(e) {
			if (e.key === "Escape") {
				if (inspectedItem) setInspectedItem(null);
				else onClose();
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [
		open,
		inspectedItem,
		onClose
	]);
	const visibleItems = (0, import_react.useMemo)(() => {
		return (result?.items ?? []).filter((item) => {
			if (brokenIds[item.id]) return false;
			if (activeFacet !== "All" && item.facet !== activeFacet) return false;
			return true;
		});
	}, [
		result?.items,
		activeFacet,
		brokenIds
	]);
	const facetsPresent = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const item of result?.items ?? []) if (!brokenIds[item.id]) set.add(item.facet);
		return [...set];
	}, [result?.items, brokenIds]);
	if (!open) return null;
	function handleImageError(item) {
		if (!fallbackFullMap[item.id] && item.fullUrl && item.fullUrl !== item.thumbnailUrl) setFallbackFullMap((prev) => ({
			...prev,
			[item.id]: true
		}));
		else setBrokenIds((prev) => ({
			...prev,
			[item.id]: true
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "moodboard-overlay",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "Automated Architectural Moodboard Grid",
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-xs md:p-6",
		onClick: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[min(88vh,860px)] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-line bg-surface text-fg shadow-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-raised/70 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "size-4 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b08a45]",
								children: "Automated Reference Moodboard · Public Archive API"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-0.5 font-serif text-xl font-bold text-fg",
							children: "Brief-Parsed Architectural Inspiration Grid"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "moodboard-refresh-btn",
							disabled: loading,
							onClick: () => {
								setActiveFacet("All");
								onGenerate("");
							},
							className: "inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d4b06a]/60 bg-surface px-3.5 text-xs font-semibold text-fg transition hover:border-[#b08a45] disabled:opacity-60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5 text-[#b08a45]", loading && "animate-spin") }), "Sync From Brief"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Close moodboard overlay",
							className: "grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shrink-0 border-b border-line bg-bg/60 px-5 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium text-faint",
									children: "Parsed Facets:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setActiveFacet("All"),
									className: cn("h-7 shrink-0 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition", activeFacet === "All" ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-surface text-muted hover:text-fg"),
									children: [
										"All (",
										visibleItems.length,
										")"
									]
								}),
								facetsPresent.map((facet) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveFacet(facet),
									className: cn("h-7 shrink-0 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition", activeFacet === facet ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-surface text-muted hover:text-fg"),
									children: facet
								}, facet))
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								setActiveFacet("All");
								onGenerate(customQuery);
							},
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex-1 sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "search",
									"data-testid": "moodboard-custom-query-input",
									value: customQuery,
									onChange: (e) => onCustomQueryChange(e.target.value),
									placeholder: "Override brief search query...",
									className: "h-8 w-full rounded-xl border border-line bg-surface pr-3 pl-8 text-xs text-fg outline-none focus:border-[#d4b06a]"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								"data-testid": "moodboard-custom-search-btn",
								disabled: loading,
								className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), "Search API"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted",
						children: [(result?.queries ?? queries).map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-[#b08a45]",
									children: [q.facet, ":"]
								}),
								" “",
								q.query,
								"”"
							]
						}, `${q.facet}-${q.query}`)), result?.providersUsed?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto font-mono text-[10px] text-faint",
							children: ["Sources: ", result.providersUsed.join(" + ")]
						}) : null]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto p-5",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-64 flex-col items-center justify-center gap-3 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-7 animate-spin text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-fg",
							children: "Parsing brief & retrieving architectural references..."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Querying Openverse & Wikimedia Commons photographic archives"
						})] })]
					}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-lg rounded-2xl border border-red-400/40 bg-red-50 p-6 text-center text-xs text-red-900",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: "Unable to retrieve reference imagery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-red-800",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void onGenerate(customQuery),
								className: "mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-400 bg-white px-3 text-xs font-medium text-red-900",
								children: "Retry Public API Fetch"
							})
						]
					}) : visibleItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-md rounded-2xl border border-dashed border-line bg-raised/40 p-8 text-center text-xs text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-fg",
							children: "No matching photographs returned"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "Try refining your architectural directives or entering a broader material or typology query above."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-testid": "moodboard-grid",
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
						children: visibleItems.map((item) => {
							const imgSrc = fallbackFullMap[item.id] ? item.fullUrl : item.thumbnailUrl;
							const isPinned = pinnedIds.includes(item.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								"data-testid": "moodboard-card",
								className: "group flex flex-col overflow-hidden rounded-2xl border border-line bg-raised/50 transition hover:border-[#b08a45]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setInspectedItem(item),
									className: "relative aspect-[4/3] w-full overflow-hidden bg-raised text-left",
									title: `Inspect ${item.title}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: imgSrc,
										alt: item.title,
										referrerPolicy: "no-referrer",
										decoding: "async",
										onError: () => handleImageError(item),
										className: "h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 flex-col justify-between gap-2.5 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#b08a45]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.facet }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-faint",
												children: item.provider
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "mt-1 line-clamp-2 text-xs font-semibold leading-snug text-fg",
											children: item.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 truncate text-[11px] text-muted",
											children: [
												item.creator,
												" · ",
												item.license
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2 border-t border-line/70 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "moodboard-pin-btn",
											onClick: () => onPinToBrief(item),
											disabled: isPinned,
											className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border px-2.5 text-[11px] font-medium transition", isPinned ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-700" : "border-line bg-surface text-fg hover:border-[#d4b06a]"),
											children: [isPinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3 text-[#b08a45]" }), isPinned ? "Pinned" : "Pin to Brief"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setInspectedItem(item),
												className: "grid size-7 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg",
												"aria-label": `Inspect ${item.title}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: item.sourceUrl,
												target: "_blank",
												rel: "noreferrer",
												className: "grid size-7 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg",
												"aria-label": `Open source page for ${item.title}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })
											})]
										})]
									})]
								})]
							}, item.id);
						})
					})
				})
			]
		}), inspectedItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4",
			onClick: (e) => {
				e.stopPropagation();
				setInspectedItem(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface text-fg shadow-2xl",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-line px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold text-fg",
								children: inspectedItem.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									inspectedItem.creator,
									" · ",
									inspectedItem.license,
									" · ",
									inspectedItem.provider
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setInspectedItem(null),
							"aria-label": "Close photo preview",
							className: "grid size-8 place-items-center rounded-lg border border-line bg-raised text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[65vh] overflow-hidden bg-black/90",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: fallbackFullMap[inspectedItem.id] ? inspectedItem.fullUrl : inspectedItem.thumbnailUrl,
							alt: inspectedItem.title,
							referrerPolicy: "no-referrer",
							className: "mx-auto max-h-[65vh] w-auto object-contain"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-muted",
							children: [
								"Query: “",
								inspectedItem.queryUsed,
								"”"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => onPinToBrief(inspectedItem),
								className: "gold-fill inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-[#2a1c0c]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5" }), "Pin Reference to Directives"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: inspectedItem.sourceUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-raised px-3 text-xs font-medium text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), " Source"]
							})]
						})]
					})
				]
			})
		}) : null]
	});
}
var createSharedBriefFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b1e5a93d91e1f0383b9cf47e2c358caaf747eb177f831af247cdae577cc394cb"));
var updateSharedBriefFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("5dc654f5aa22c10eda96aad51cda1b31b16fa38620951de3a903fa05f3f07dd7"));
var getSharedBriefFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("1f4114a7061edf88ee606090d78afb5715fd66c12663e4d1d39293404f81c4e1"));
var addBriefCommentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("dbaa0459f2b393dbd53ef2bfda3d9ba7a159bc442cbdfe5ca0412cfa81062107"));
var toggleBriefCommentStatusFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("2ecb14625c072bb8b60982f26f46335537b9e5209ecb2ea0af4d3b67f7c65c51"));
var deleteBriefCommentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("ff36cea5dc2f3591bf4aa5c1f7548e2d101a5c6e935a1acc3292dbe379511d59"));
var generateMoodboardFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("74fdd6b4e7b942b655533fe040ff575b82ba9273c7b6a74bfaed3e4feadf474d"));
var DICT_GROUPS = [
	"Core Edit",
	"Context & Seasons",
	"Grade & HDRI",
	"Cinema Directors",
	"Photography",
	"Controlled Reference",
	"Marketing & Heritage",
	"3D Asset & Video"
];
var QUICK_KEYWORD_PILLS = [
	"Board-Formed Concrete",
	"Rift-Cut White Oak",
	"2700K Cove Wash",
	"Mirror Reflecting Pool",
	"28mm Tilt-Shift",
	"Honed Travertine",
	"Deep Brise-Soleil Shadows",
	"Volumetric Sun Shafts"
];
function BriefBuilderPage() {
	const navigate = useNavigate();
	const setIdea = useOriel((state) => state.setIdea);
	const setDesignField = useOriel((state) => state.setDesignField);
	const setEngineField = useOriel((state) => state.setEngineField);
	const setScene3DField = useOriel((state) => state.setScene3DField);
	const setFrame = useOriel((state) => state.setFrame);
	const applyBriefTemplateConfig = useOriel((state) => state.applyBriefTemplateConfig);
	const applySharedBriefState = useOriel((state) => state.applySharedBriefState);
	const saveProject = useOriel((state) => state.saveProject);
	const saveBrief = useOriel((state) => state.saveBrief);
	const plate = useOriel((state) => state.plate);
	const upload = useOriel((state) => state.upload);
	const frame = useOriel((state) => state.frame);
	const dictionaryBlocks = useOriel((state) => state.dictionaryBlocks);
	const dictionaryParams = useOriel((state) => state.dictionaryParams);
	const setDictionarySelection = useOriel((state) => state.setDictionarySelection);
	const setDictionaryParam = useOriel((state) => state.setDictionaryParam);
	const savedDictionaryPrompts = useOriel((state) => state.savedDictionaryPrompts);
	const setSavedDictionaryPrompts = useOriel((state) => state.setSavedDictionaryPrompts);
	const [selectedStyle, setSelectedStyle] = (0, import_react.useState)(ARCHITECTURAL_STYLES[0]);
	const [selectedLighting, setSelectedLighting] = (0, import_react.useState)(LIGHTING_CONDITIONS[0]);
	const [selectedMood, setSelectedMood] = (0, import_react.useState)(MOOD_SETTINGS[0]);
	const [selectedCamera, setSelectedCamera] = (0, import_react.useState)(CAMERA_PRESETS[0]);
	const [customNotes, setCustomNotes] = (0, import_react.useState)(() => buildInitialBuilderNotes(ARCHITECTURAL_STYLES[0], LIGHTING_CONDITIONS[0], MOOD_SETTINGS[0], CAMERA_PRESETS[0]));
	const design = useOriel((state) => state.design);
	const engine = useOriel((state) => state.engine);
	const scene3d = useOriel((state) => state.scene3d);
	const [activeTab, setActiveTab] = (0, import_react.useState)("style");
	const [dictGroup, setDictGroup] = (0, import_react.useState)("Core Edit");
	const [activeDictPresetId, setActiveDictPresetId] = (0, import_react.useState)("facade");
	const [activeTemplateId, setActiveTemplateId] = (0, import_react.useState)(null);
	const [pdfModalOpen, setPdfModalOpen] = (0, import_react.useState)(false);
	const [dictSearch, setDictSearch] = (0, import_react.useState)("");
	const [previewTab, setPreviewTab] = (0, import_react.useState)("spec");
	const [dragOverSlot, setDragOverSlot] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const jsonInputRef = (0, import_react.useRef)(null);
	const [collabOpen, setCollabOpen] = (0, import_react.useState)(false);
	const [collabSession, setCollabSession] = (0, import_react.useState)(null);
	const [isCreatingShare, setIsCreatingShare] = (0, import_react.useState)(false);
	const [isSyncingShare, setIsSyncingShare] = (0, import_react.useState)(false);
	const [lastSyncedAt, setLastSyncedAt] = (0, import_react.useState)(null);
	const [reviewerName, setReviewerName] = (0, import_react.useState)("Lead Architect");
	const [reviewerRole, setReviewerRole] = (0, import_react.useState)("Lead Architect");
	const [moodboardOpen, setMoodboardOpen] = (0, import_react.useState)(false);
	const [moodboardCustomQuery, setMoodboardCustomQuery] = (0, import_react.useState)("");
	const [moodboardLoading, setMoodboardLoading] = (0, import_react.useState)(false);
	const [moodboardError, setMoodboardError] = (0, import_react.useState)(null);
	const [moodboardResult, setMoodboardResult] = (0, import_react.useState)(null);
	const [pinnedMoodboardIds, setPinnedMoodboardIds] = (0, import_react.useState)([]);
	const effectiveDictBlocks = (0, import_react.useMemo)(() => dictionaryBlocks.length > 0 ? dictionaryBlocks : [
		"goal",
		"source",
		"geometry",
		"windows",
		"photo",
		"exclude",
		"qc"
	], [dictionaryBlocks]);
	const composedDictionary = (0, import_react.useMemo)(() => composeDictionarySelection(effectiveDictBlocks, dictionaryParams, customNotes), [
		effectiveDictBlocks,
		dictionaryParams,
		customNotes
	]);
	const visionDoc = (0, import_react.useMemo)(() => synthesizeVisionDocument(selectedStyle, selectedLighting, selectedMood, selectedCamera, customNotes), [
		selectedStyle,
		selectedLighting,
		selectedMood,
		selectedCamera,
		customNotes
	]);
	const bimSchedule = (0, import_react.useMemo)(() => buildMaterialScheduleRows(design, engine, scene3d), [
		design,
		engine,
		scene3d
	]);
	const moodboardQueries = (0, import_react.useMemo)(() => parseBriefToMoodboardQueries({
		visionDoc,
		selectedStyle,
		selectedLighting,
		selectedMood,
		design,
		engine,
		scene3d,
		customNotes,
		customQueryOverride: moodboardCustomQuery
	}), [
		visionDoc,
		selectedStyle,
		selectedLighting,
		selectedMood,
		design,
		engine,
		scene3d,
		customNotes,
		moodboardCustomQuery
	]);
	const currentCollabSnapshot = (0, import_react.useMemo)(() => buildSharedBriefSnapshot({
		title: visionDoc.title,
		subtitle: visionDoc.subtitle,
		selectedStyle,
		selectedLighting,
		selectedMood,
		selectedCamera,
		customNotes,
		activeDictPresetId,
		dictionaryBlocks: effectiveDictBlocks,
		dictionaryParams,
		activeTemplateId,
		design,
		engine,
		scene3d,
		frame,
		synthesizedPrompt: visionDoc.synthesizedPrompt,
		bimSchedule
	}), [
		visionDoc.title,
		visionDoc.subtitle,
		visionDoc.synthesizedPrompt,
		selectedStyle,
		selectedLighting,
		selectedMood,
		selectedCamera,
		customNotes,
		activeDictPresetId,
		effectiveDictBlocks,
		dictionaryParams,
		activeTemplateId,
		design,
		engine,
		scene3d,
		frame,
		bimSchedule
	]);
	const hydrateFromSharedSession = (0, import_react.useCallback)((session) => {
		const snap = session.snapshot;
		setSelectedStyle(snap.slotIds.styleId ? ARCHITECTURAL_STYLES.find((s) => s.id === snap.slotIds.styleId) ?? null : null);
		setSelectedLighting(snap.slotIds.lightingId ? LIGHTING_CONDITIONS.find((l) => l.id === snap.slotIds.lightingId) ?? null : null);
		setSelectedMood(snap.slotIds.moodId ? MOOD_SETTINGS.find((m) => m.id === snap.slotIds.moodId) ?? null : null);
		setSelectedCamera(snap.slotIds.cameraId ? CAMERA_PRESETS.find((c) => c.id === snap.slotIds.cameraId) ?? null : null);
		setCustomNotes(snap.customNotes ?? "");
		setActiveDictPresetId(snap.activeDictPresetId || "facade");
		setActiveTemplateId(snap.activeTemplateId ?? null);
		applySharedBriefState(snap);
	}, [applySharedBriefState]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const savedName = window.localStorage.getItem("oriel-collab-name");
		if (savedName) setReviewerName(savedName);
		const shareParam = sanitizeShareId(new URLSearchParams(window.location.search).get("share") ?? "");
		if (!shareParam) return;
		let cancelled = false;
		setIsSyncingShare(true);
		getSharedBriefFn({ data: { shareId: shareParam } }).then((loaded) => {
			if (cancelled) return;
			if (!loaded) {
				toast.error(`Shared brief "${shareParam}" was not found.`);
				return;
			}
			setCollabSession(loaded);
			hydrateFromSharedSession(loaded);
			setLastSyncedAt((/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			}));
			toast.success(`Loaded shared brief from ${loaded.authorName}`);
		}).catch((err) => {
			if (!cancelled) toast.error(err instanceof Error ? err.message : "Could not load shared brief.");
		}).finally(() => {
			if (!cancelled) setIsSyncingShare(false);
		});
		return () => {
			cancelled = true;
		};
	}, [hydrateFromSharedSession]);
	const activeShareId = collabSession?.shareId ?? null;
	(0, import_react.useEffect)(() => {
		if (!activeShareId) return;
		const syncNow = () => {
			getSharedBriefFn({ data: { shareId: activeShareId } }).then((fresh) => {
				if (!fresh) return;
				setCollabSession(fresh);
				setLastSyncedAt((/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit"
				}));
			}).catch(() => void 0);
		};
		const intervalMs = collabOpen ? 2e3 : 5e3;
		const timer = window.setInterval(syncNow, intervalMs);
		window.addEventListener("focus", syncNow);
		document.addEventListener("visibilitychange", syncNow);
		return () => {
			window.clearInterval(timer);
			window.removeEventListener("focus", syncNow);
			document.removeEventListener("visibilitychange", syncNow);
		};
	}, [activeShareId, collabOpen]);
	function handleReviewerNameChange(name) {
		setReviewerName(name);
		if (typeof window !== "undefined") window.localStorage.setItem("oriel-collab-name", name);
	}
	async function handleGenerateShareLink() {
		setIsCreatingShare(true);
		try {
			const created = await createSharedBriefFn({ data: {
				authorName: normalizeAuthorName(reviewerName),
				snapshot: currentCollabSnapshot
			} });
			setCollabSession(created);
			setLastSyncedAt((/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			}));
			if (typeof window !== "undefined") {
				const nextUrl = buildBriefShareUrl(window.location.origin, created.shareId);
				window.history.replaceState(null, "", nextUrl);
			}
			toast.success(`Share link created (${created.shareId})`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to generate share link.");
		} finally {
			setIsCreatingShare(false);
		}
	}
	async function handleSyncSharedSnapshot() {
		if (!collabSession) return;
		setIsSyncingShare(true);
		try {
			const updated = await updateSharedBriefFn({ data: {
				shareId: collabSession.shareId,
				snapshot: currentCollabSnapshot
			} });
			setCollabSession(updated);
			setLastSyncedAt((/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			}));
			toast.success("Synced updated brief parameters to shared link");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to sync brief snapshot.");
		} finally {
			setIsSyncingShare(false);
		}
	}
	async function handleRefreshSharedSession() {
		if (!collabSession) return;
		setIsSyncingShare(true);
		try {
			const fresh = await getSharedBriefFn({ data: { shareId: collabSession.shareId } });
			if (fresh) {
				setCollabSession(fresh);
				hydrateFromSharedSession(fresh);
				setLastSyncedAt((/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit"
				}));
				toast.success("Synced latest brief & comments");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not refresh shared brief.");
		} finally {
			setIsSyncingShare(false);
		}
	}
	async function handleAddCollabComment(payload) {
		if (!collabSession) return;
		try {
			const created = await addBriefCommentFn({ data: {
				shareId: collabSession.shareId,
				parameterKey: payload.parameterKey,
				authorName: normalizeAuthorName(reviewerName),
				authorRole: reviewerRole,
				body: payload.body
			} });
			setCollabSession((prev) => prev ? {
				...prev,
				comments: [...prev.comments, created]
			} : prev);
			toast.success(`Anchored comment to ${created.parameterLabel}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not post comment.");
		}
	}
	async function handleToggleCommentStatus(commentId, nextStatus) {
		if (!collabSession) return;
		try {
			const updated = await toggleBriefCommentStatusFn({ data: {
				shareId: collabSession.shareId,
				commentId,
				status: nextStatus
			} });
			setCollabSession((prev) => prev ? {
				...prev,
				comments: prev.comments.map((c) => c.id === updated.id ? updated : c)
			} : prev);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update comment status.");
		}
	}
	async function handleDeleteComment(commentId) {
		if (!collabSession) return;
		try {
			await deleteBriefCommentFn({ data: {
				shareId: collabSession.shareId,
				commentId
			} });
			setCollabSession((prev) => prev ? {
				...prev,
				comments: prev.comments.filter((c) => c.id !== commentId)
			} : prev);
			toast.message("Comment removed.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not delete comment.");
		}
	}
	async function handleRunMoodboard(overrideQuery) {
		const effectiveOverride = overrideQuery !== void 0 ? overrideQuery : moodboardCustomQuery;
		if (overrideQuery !== void 0 && overrideQuery !== moodboardCustomQuery) setMoodboardCustomQuery(overrideQuery);
		const queriesToRun = parseBriefToMoodboardQueries({
			visionDoc,
			selectedStyle,
			selectedLighting,
			selectedMood,
			design,
			engine,
			scene3d,
			customNotes,
			customQueryOverride: effectiveOverride
		});
		setMoodboardLoading(true);
		setMoodboardError(null);
		try {
			const res = await generateMoodboardFn({ data: { queries: queriesToRun } });
			setMoodboardResult(res);
		} catch (err) {
			setMoodboardError(err instanceof Error ? err.message : "Public moodboard API lookup failed.");
		} finally {
			setMoodboardLoading(false);
		}
	}
	function handleOpenMoodboard() {
		setMoodboardOpen(true);
		handleRunMoodboard();
	}
	function handlePinMoodboardItem(item) {
		if (pinnedMoodboardIds.includes(item.id)) return;
		const note = formatReferenceNoteFromImage(item);
		setCustomNotes((prev) => prev.trim() ? `${prev.trim()}\n${note}` : note);
		setPinnedMoodboardIds((prev) => [...prev, item.id]);
		toast.success(`Pinned "${item.title}" to Studio Directives`);
	}
	function handleDragStart(event, block) {
		event.dataTransfer.setData("application/json", JSON.stringify(block));
		event.dataTransfer.effectAllowed = "copyMove";
	}
	function handleDragOver(event, slotId) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
		if (dragOverSlot !== slotId) setDragOverSlot(slotId);
	}
	function handleDragLeave(event) {
		event.preventDefault();
		setDragOverSlot(null);
	}
	function handleDrop(event, targetSlot) {
		event.preventDefault();
		setDragOverSlot(null);
		try {
			const dataStr = event.dataTransfer.getData("application/json");
			if (!dataStr) return;
			const block = JSON.parse(dataStr);
			if (targetSlot === "style" && block.category === "style") {
				setSelectedStyle(block);
				setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "style", block));
				toast.success(`Applied Style: ${block.name}`);
			} else if (targetSlot === "lighting" && block.category === "lighting") {
				setSelectedLighting(block);
				setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "lighting", block));
				toast.success(`Applied Lighting: ${block.name}`);
			} else if (targetSlot === "mood" && block.category === "mood") {
				setSelectedMood(block);
				setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "mood", block));
				toast.success(`Applied Mood: ${block.name}`);
			} else if (targetSlot === "camera" && block.category === "camera") {
				setSelectedCamera(block);
				setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "camera", block));
				toast.success(`Applied Camera: ${block.name}`);
			} else toast.message(`This slot accepts ${targetSlot} blocks. You dragged a ${block.category} block.`);
		} catch {
			toast.error("Could not process dragged item.");
		}
	}
	function handleAssignBlock(block) {
		if (block.category === "style") {
			setSelectedStyle(block);
			setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "style", block));
			toast.success(`Injected Style: ${block.name}`);
		} else if (block.category === "lighting") {
			setSelectedLighting(block);
			setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "lighting", block));
			toast.success(`Injected Lighting: ${block.name}`);
		} else if (block.category === "mood") {
			setSelectedMood(block);
			setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "mood", block));
			toast.success(`Injected Mood: ${block.name}`);
		} else if (block.category === "camera") {
			setSelectedCamera(block);
			setCustomNotes((prev) => syncBuilderSlotToNotes(prev, "camera", block));
			toast.success(`Injected Camera: ${block.name}`);
		}
	}
	function handleClearSlot(category) {
		if (category === "style") setSelectedStyle(null);
		if (category === "lighting") setSelectedLighting(null);
		if (category === "mood") setSelectedMood(null);
		if (category === "camera") setSelectedCamera(null);
		setCustomNotes((prev) => syncBuilderSlotToNotes(prev, category, null));
	}
	function handleLoadPreset(presetId) {
		const preset = BUILDER_PRESETS.find((p) => p.id === presetId);
		if (!preset) return;
		const style = ARCHITECTURAL_STYLES.find((s) => s.id === preset.styleId) ?? null;
		const light = LIGHTING_CONDITIONS.find((l) => l.id === preset.lightingId) ?? null;
		const mood = MOOD_SETTINGS.find((m) => m.id === preset.moodId) ?? null;
		const camera = CAMERA_PRESETS.find((c) => c.id === preset.cameraId) ?? null;
		setSelectedStyle(style);
		setSelectedLighting(light);
		setSelectedMood(mood);
		setSelectedCamera(camera);
		const syncedSlots = buildInitialBuilderNotes(style, light, mood, camera);
		setCustomNotes(preset.notes ? `${syncedSlots}. ${preset.notes}` : syncedSlots);
		setActiveTemplateId(null);
		toast.success(`Loaded Preset: ${preset.name}`);
	}
	function handleLoadBriefTemplate(template) {
		const slots = resolveBriefTemplateSlots(template);
		const compiledNotes = buildTemplateCompiledNotes(template);
		const nextDoc = synthesizeVisionDocument(slots.style, slots.lighting, slots.mood, slots.camera, compiledNotes);
		setSelectedStyle(slots.style);
		setSelectedLighting(slots.lighting);
		setSelectedMood(slots.mood);
		setSelectedCamera(slots.camera);
		setCustomNotes(compiledNotes);
		setActiveDictPresetId(template.dictionaryPresetId);
		setActiveTemplateId(template.id);
		applyBriefTemplateConfig(template, nextDoc.synthesizedPrompt);
		toast.success(`Loaded "${template.name}" template & visual parameters`);
	}
	function handleLoadDictionaryPreset(presetId) {
		const found = ARCHVIZ_PRESETS.find((p) => p.id === presetId);
		if (!found) return;
		setActiveDictPresetId(found.id);
		setDictionarySelection(found.blocks);
		const blockLabels = found.blocks.map((id) => getDictionaryBlock(id)?.en ?? id).filter(Boolean);
		setCustomNotes((prev) => syncDictionaryPresetToNotes(prev, found.name, blockLabels));
		setPreviewTab("dictionary");
		toast.success(`Injected Dictionary Scenario: ${found.name}`);
	}
	function toggleDictBlock(blockId) {
		const exists = effectiveDictBlocks.includes(blockId);
		const next = exists ? effectiveDictBlocks.filter((id) => id !== blockId) : [...effectiveDictBlocks, blockId];
		setDictionarySelection(next);
		const block = getDictionaryBlock(blockId);
		if (block) setCustomNotes((prev) => toggleDictionaryBlockInNotes(prev, block.en, !exists));
	}
	function handleQuickKeywordPill(keyword) {
		setCustomNotes((prev) => {
			const { notes } = toggleKeywordPillInNotes(prev, keyword);
			return notes;
		});
	}
	function handleResetAll() {
		setSelectedStyle(null);
		setSelectedLighting(null);
		setSelectedMood(null);
		setSelectedCamera(null);
		setDictionarySelection([]);
		setCustomNotes("");
		setActiveTemplateId(null);
		toast.message("Cleared all brief slots & prompt keywords.");
	}
	async function handleCopyMarkdown() {
		try {
			const text = previewTab === "dictionary" ? composedDictionary.text : visionDoc.markdownDoc;
			await navigator.clipboard.writeText(text);
			setCopied(true);
			toast.success("Copied brief specification.");
			setTimeout(() => setCopied(false), 2e3);
		} catch {
			toast.error("Clipboard copy failed. Please select and copy manually.");
		}
	}
	function handleDownloadMarkdown() {
		const blob = new Blob([`${visionDoc.markdownDoc}\n\n---\n\n## ARCHVIZ Dictionary Structured Prompt\n\n\`\`\`\n${composedDictionary.text}\n\`\`\``], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `architectural-vision-${Date.now()}.md`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success("Downloaded vision & dictionary specification.");
	}
	function handleExportDictionaryJson() {
		const entry = {
			id: `brief-${Date.now()}`,
			name: (visionDoc.title || "Architectural Brief").slice(0, 96),
			scenario: activeDictPresetId,
			text: composedDictionary.text,
			blockIds: composedDictionary.keptIds,
			parameters: Object.fromEntries(composedDictionary.activeParamBlocks.map((b) => [b.blockId, b.parameters])),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const nextSaved = [entry, ...savedDictionaryPrompts.filter((p) => p.id !== entry.id)];
		setSavedDictionaryPrompts(nextSaved);
		const json = exportSavedPromptsJson(nextSaved);
		const blob = new Blob([json], { type: "application/json;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `archviz-saved-prompts-${Date.now()}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success("Exported Saved Prompts JSON (schema_version: 1)");
	}
	function handleDownloadDesignPackHtml() {
		const html = buildDesignPackDocumentHtml({
			title: visionDoc.title || "Oriel Architectural Design Pack",
			prompt: visionDoc.synthesizedPrompt,
			schedule: bimSchedule,
			design,
			engine,
			scene3d
		});
		const blob = new Blob([html], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `oriel-design-pack-${Date.now()}.html`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success("Downloaded printable Client Design Pack (.html)");
	}
	function handleDownloadBimJson() {
		const payload = {
			schema: "oriel-bim-v1",
			title: visionDoc.title || "Architectural Vision",
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			prompt: visionDoc.synthesizedPrompt,
			schedule: bimSchedule
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `oriel-bim-schedule-${Date.now()}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		toast.success("Downloaded BIM Material Schedule (.json)");
	}
	async function handleImportDictionaryJson(file) {
		if (!file) return;
		try {
			const text = await file.text();
			const imported = importSavedPromptsJson(text, savedDictionaryPrompts);
			setSavedDictionaryPrompts(imported.prompts);
			const first = imported.prompts[0];
			if (first) {
				setDictionarySelection(first.blockIds, first.parameters);
				setActiveDictPresetId(first.scenario);
				setPreviewTab("dictionary");
			}
			toast.success(`Imported ${imported.added} prompt(s)${imported.skipped ? ` · ${imported.skipped} skipped` : ""}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Invalid Saved Prompts JSON file.");
		}
	}
	function handleSendToStudio() {
		setIdea(visionDoc.synthesizedPrompt);
		setDictionarySelection(composedDictionary.keptIds, dictionaryParams);
		if (selectedStyle) {
			setDesignField("look", selectedStyle.name);
			if (selectedStyle.id === "minimalist-concrete-glass") {
				setScene3DField("preset", "pavilion");
				setScene3DField("primaryMaterial", "concrete");
				setEngineField("facadeTypology", "Minimalist Glass");
			} else if (selectedStyle.id === "brutalist-sculptural") {
				setScene3DField("preset", "villa");
				setScene3DField("primaryMaterial", "concrete");
				setEngineField("facadeTypology", "Board-Marked Concrete");
			} else if (selectedStyle.id === "contemporary-tropical") {
				setScene3DField("preset", "villa");
				setScene3DField("primaryMaterial", "timber");
				setEngineField("facadeTypology", "Biophilic Timber Louver");
				setEngineField("climateRegion", "Subtropical Humid");
			} else if (selectedStyle.id === "nordic-timber-civic") {
				setScene3DField("preset", "civic");
				setScene3DField("primaryMaterial", "brick");
				setEngineField("facadeTypology", "Nordic Brick & Zinc");
			} else if (selectedStyle.id === "industrial-heritage-reuse") {
				setScene3DField("preset", "loft");
				setScene3DField("primaryMaterial", "brick");
			}
		}
		if (selectedLighting) {
			if (selectedLighting.id === "blue-hour-twilight") {
				setDesignField("light", "Evening");
				setScene3DField("sunElevation", 8);
				setScene3DField("sunAzimuth", 245);
			} else if (selectedLighting.id === "golden-hour-raking") {
				setDesignField("light", "Golden hour");
				setScene3DField("sunElevation", 16);
				setScene3DField("sunAzimuth", 118);
			} else if (selectedLighting.id === "soft-overcast-diffused") {
				setDesignField("light", "Soft overcast");
				setScene3DField("sunElevation", 48);
				setScene3DField("fogDensity", 28);
			}
		}
		if (selectedCamera) {
			if (selectedCamera.id === "elevated-site-drone") setScene3DField("cameraPreset", "aerial");
			else if (selectedCamera.id === "intimate-macro-junction") {
				setScene3DField("cameraPreset", "detail");
				setScene3DField("focalLength", 85);
			} else setScene3DField("cameraPreset", "eye");
		}
		toast.success("Synced vision spec, Mid-Layer Dictionary & 3D rig to Studio!");
		navigate({ to: "/" });
	}
	function handleSaveToProject() {
		const name = visionDoc.title || "Vision Brief Project";
		saveProject(name);
		saveBrief({
			title: name,
			boardId: "working",
			model: "flux",
			aspect: "16:9",
			canonical: composedDictionary.text,
			adapted: visionDoc.synthesizedPrompt
		});
		setIdea(visionDoc.synthesizedPrompt);
		toast.success(`Saved "${name}" to Projects & Briefs archive.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-full flex-col overflow-y-auto bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-b border-line bg-surface px-4 py-4 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium tracking-[0.2em] text-[#b08a45] uppercase",
								children: "Interactive Prompt Architecture · 46 Scenarios · 127 Blocks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-serif text-3xl font-bold tracking-tight text-fg md:text-4xl",
								children: "Brief Builder"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 max-w-2xl text-xs text-muted md:text-sm",
								children: "Click any card, dictionary pill, or preset to dynamically inject architectural keywords into the live prompt textarea and compile your vision brief."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleResetAll,
									className: "inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-raised px-4 text-xs font-medium text-muted transition hover:border-[#d4b06a] hover:text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), "Reset Slots"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "open-moodboard-btn",
									onClick: handleOpenMoodboard,
									className: "inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-raised px-4 text-xs font-semibold text-fg transition hover:border-[#b08a45] hover:bg-[#fffaf0]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "size-3.5 text-[#b08a45]" }), "Moodboard Grid"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "open-collab-btn",
									onClick: () => setCollabOpen(true),
									className: "inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-raised px-4 text-xs font-semibold text-fg transition hover:border-[#b08a45] hover:bg-[#fffaf0]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-3.5 text-[#b08a45]" }), collabSession ? `Review (${collabSession.comments.filter((c) => c.status === "open").length})` : "Share & Review"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "open-pdf-export-btn",
									onClick: () => setPdfModalOpen(true),
									className: "inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#d4b06a]/60 bg-raised px-4 text-xs font-semibold text-fg transition hover:border-[#b08a45] hover:bg-[#fffaf0]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 text-[#b08a45]" }), "Export Client PDF"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleSendToStudio,
									className: "gold-fill inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 text-xs font-semibold text-[#2a1c0c]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
										"Send to Studio Canvas",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveRight, { className: "size-3.5" })
									]
								})
							]
						})]
					}),
					collabSession ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						"data-testid": "collab-active-banner",
						className: "mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#d4b06a]/50 bg-[#fffaf0] px-4 py-2 text-xs text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-x-3 gap-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-semibold text-[#b08a45]",
									children: ["Shared Session · ", collabSession.shareId]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: ["Owner: ", collabSession.authorName]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[11px] tabular-nums text-fg/80",
									children: [collabSession.comments.length, " parameter comment(s)"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void handleSyncSharedSnapshot(),
								disabled: isSyncingShare,
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-line bg-white px-2.5 text-[11px] font-medium text-fg hover:border-[#b08a45]",
								children: "Push Brief Edits"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCollabOpen(true),
								className: "gold-fill inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg px-3 text-[11px] font-semibold text-[#2a1c0c]",
								children: "Open Review Thread"
							})]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "no-scrollbar mx-auto mt-4 flex max-w-7xl items-center gap-2 overflow-x-auto pt-1 pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-xs font-medium text-faint",
							children: "Fast Presets"
						}), BUILDER_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleLoadPreset(preset.id),
							className: "hover-chip shrink-0 whitespace-nowrap rounded-full border border-line bg-raised px-3 py-1.5 text-xs text-muted",
							children: preset.name
						}, preset.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-2 max-w-7xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MidLayerBar, { onApplied: (nextId) => {
							const preset = nextId ? getMidLayerPresetById(nextId) ?? null : null;
							setCustomNotes((prev) => applyMidLayerPromptToIdea(prev, preset));
							setPreviewTab("dictionary");
						} })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefTemplateLibrary, {
				activeTemplateId,
				onLoadTemplate: handleLoadBriefTemplate,
				design,
				engine,
				scene3d,
				frame,
				onUpdateFrame: setFrame,
				onUpdateEngineField: setEngineField,
				onUpdateScene3DField: setScene3DField
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex flex-col rounded-3xl border border-line bg-surface p-4 shadow-sm lg:col-span-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-line pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-4 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-lg font-semibold",
									children: "Architectural Palette"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-faint",
								children: "Drag cards into slots"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-5 gap-1 rounded-2xl bg-raised p-1",
							children: [
								[
									"style",
									"Style",
									WandSparkles
								],
								[
									"lighting",
									"Light",
									Sun
								],
								[
									"mood",
									"Mood",
									Sparkles
								],
								[
									"camera",
									"Lens",
									Camera
								],
								[
									"dictionary",
									"Dict",
									BookOpen
								]
							].map(([catId, label, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveTab(catId),
								className: cn("flex h-9 items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium transition", activeTab === catId ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: label
								})]
							}, catId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex-1 space-y-3 overflow-y-auto pr-1",
							children: [
								activeTab === "style" && ARCHITECTURAL_STYLES.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteCard, {
									block,
									isSelected: selectedStyle?.id === block.id,
									onSelect: () => handleAssignBlock(block),
									onDragStart: (e) => handleDragStart(e, block)
								}, block.id)),
								activeTab === "lighting" && LIGHTING_CONDITIONS.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteCard, {
									block,
									isSelected: selectedLighting?.id === block.id,
									onSelect: () => handleAssignBlock(block),
									onDragStart: (e) => handleDragStart(e, block)
								}, block.id)),
								activeTab === "mood" && MOOD_SETTINGS.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteCard, {
									block,
									isSelected: selectedMood?.id === block.id,
									onSelect: () => handleAssignBlock(block),
									onDragStart: (e) => handleDragStart(e, block)
								}, block.id)),
								activeTab === "camera" && CAMERA_PRESETS.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaletteCard, {
									block,
									isSelected: selectedCamera?.id === block.id,
									onSelect: () => handleAssignBlock(block),
									onDragStart: (e) => handleDragStart(e, block)
								}, block.id)),
								activeTab === "dictionary" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-medium uppercase tracking-wide text-faint",
											children: "Scenario Presets · 46 Workflows"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-wrap gap-1.5",
											children: DICT_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setDictGroup(group),
												className: cn("shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition", dictGroup === group ? "gold-fill border-transparent text-[#2a1c0c]" : "border-line bg-raised text-muted hover:text-fg"),
												children: group
											}, group))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 flex flex-wrap gap-1.5",
											children: ARCHVIZ_PRESETS.filter((p) => p.group === dictGroup).map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => handleLoadDictionaryPreset(preset.id),
												className: cn("rounded-lg border px-2.5 py-1.5 text-left text-[11px] transition", activeDictPresetId === preset.id ? "border-[#b08a45] bg-[#d4b06a]/15 font-semibold text-fg" : "border-line bg-raised/70 text-muted hover:border-[#d4b06a] hover:text-fg"),
												children: [preset.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "ml-1.5 font-mono text-[10px] tabular-nums text-faint",
													children: ["· ", preset.blocks.length]
												})]
											}, preset.id))
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-line pt-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center justify-between gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] font-medium uppercase tracking-wide text-faint",
													children: [
														"Keyword Blocks · ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "tabular-nums",
															children: effectiveDictBlocks.length
														}),
														" active / ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "tabular-nums",
															children: DICTIONARY_BLOCKS.length
														})
													]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "search",
												value: dictSearch,
												onChange: (e) => setDictSearch(e.target.value),
												placeholder: "Filter 127 prompt blocks...",
												"aria-label": "Filter dictionary prompt blocks",
												className: "mt-2 h-8 w-full rounded-xl border border-line bg-raised px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2.5 flex max-h-80 flex-wrap gap-1.5 overflow-y-auto pr-1",
												children: DICTIONARY_BLOCKS.filter((b) => {
													const q = dictSearch.trim().toLowerCase();
													if (!q) return true;
													return b.en.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.section.toLowerCase().includes(q) || b.text.toLowerCase().includes(q);
												}).map((b) => {
													const active = effectiveDictBlocks.includes(b.id);
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => toggleDictBlock(b.id),
														title: b.text,
														"aria-pressed": active,
														className: cn("inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] transition", active ? "gold-fill border-transparent font-medium text-[#2a1c0c]" : "border-line bg-raised text-muted hover:border-[#d4b06a] hover:text-fg"),
														children: b.en
													}, b.id);
												})
											})
										]
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 lg:col-span-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl border border-line bg-surface p-5 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-line pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "size-4 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-lg font-semibold",
										children: "Vision Blueprint Slots"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Drop or click to fill"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropSlot, {
										category: "style",
										title: "1. Architectural Style",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4 text-[#b08a45]" }),
										block: selectedStyle,
										isDragOver: dragOverSlot === "style",
										onDragOver: (e) => handleDragOver(e, "style"),
										onDragLeave: handleDragLeave,
										onDrop: (e) => handleDrop(e, "style"),
										onClear: () => handleClearSlot("style")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropSlot, {
										category: "lighting",
										title: "2. Lighting Condition",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4 text-[#b08a45]" }),
										block: selectedLighting,
										isDragOver: dragOverSlot === "lighting",
										onDragOver: (e) => handleDragOver(e, "lighting"),
										onDragLeave: handleDragLeave,
										onDrop: (e) => handleDrop(e, "lighting"),
										onClear: () => handleClearSlot("lighting")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropSlot, {
										category: "mood",
										title: "3. Mood & Atmosphere",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-[#b08a45]" }),
										block: selectedMood,
										isDragOver: dragOverSlot === "mood",
										onDragOver: (e) => handleDragOver(e, "mood"),
										onDragLeave: handleDragLeave,
										onDrop: (e) => handleDrop(e, "mood"),
										onClear: () => handleClearSlot("mood")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropSlot, {
										category: "camera",
										title: "4. Camera / Composition",
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-[#b08a45]" }),
										block: selectedCamera,
										isDragOver: dragOverSlot === "camera",
										onDragOver: (e) => handleDragOver(e, "camera"),
										onDragLeave: handleDragLeave,
										onDrop: (e) => handleDrop(e, "camera"),
										onClear: () => handleClearSlot("camera")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 border-t border-line pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "custom-notes",
											className: "text-xs font-medium text-fg",
											children: "Live Prompt & Studio Directives"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-faint",
											children: "Click pills or cards to inject keywords in real time"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-wrap gap-1.5",
										role: "group",
										"aria-label": "Expert architectural keyword pills",
										children: QUICK_KEYWORD_PILLS.map((kw) => {
											const active = new RegExp(`(?:^|(?<=[.\\s,;\\n]))${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[.\\s,;\\n])`, "i").test(customNotes);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												"aria-pressed": active,
												onClick: () => handleQuickKeywordPill(kw),
												className: cn("h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition", active ? "gold-fill border-transparent text-[#2a1c0c]" : "hover-chip border-line bg-raised text-muted hover:text-fg"),
												children: active ? `− ${kw}` : `+ ${kw}`
											}, kw);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "custom-notes",
										value: customNotes,
										onChange: (e) => setCustomNotes(e.target.value),
										placeholder: "Click any architectural style, lighting, dictionary pill, or type bespoke directives here...",
										rows: 4,
										className: "mt-2.5 w-full resize-y rounded-2xl border border-line bg-raised px-3.5 py-2.5 font-mono text-xs leading-relaxed text-fg outline-none transition focus:border-[#d4b06a]"
									})
								]
							}),
							composedDictionary.warnings.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								role: "alert",
								className: "mt-3 flex items-start gap-2 rounded-2xl border border-amber-600/40 bg-amber-100/90 px-3 py-2 text-xs text-amber-950",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-semibold text-amber-950",
									children: [
										"Conflicting Dictionary Rules Detected (",
										composedDictionary.warnings.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-[11px] text-amber-900",
									children: composedDictionary.warnings.map((w) => `${w.labelA} ↔ ${w.labelB}`).join(" · ")
								})] })]
							}) : null,
							composedDictionary.activeParamBlocks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-2xl border border-line bg-raised/60 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-medium uppercase tracking-wide text-faint",
									children: [
										"Parameterized Slots (",
										"{{key}}",
										" Interpolation)"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid gap-2 sm:grid-cols-2",
									children: composedDictionary.activeParamBlocks.map((pb) => Object.entries(pb.parameters).map(([paramKey, paramVal]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted",
											children: [
												pb.label,
												" · ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "text-[#d4b06a]",
													children: paramKey
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: paramVal,
											onChange: (e) => setDictionaryParam(pb.blockId, paramKey, e.target.value),
											className: "mt-1 h-7 w-full rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
										})]
									}, `${pb.blockId}-${paramKey}`)))
								})]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "flex flex-1 flex-col rounded-3xl border border-line bg-surface p-5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4 text-[#b08a45]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-lg font-semibold",
										children: "Live Vision Documentation"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-1 rounded-full bg-raised p-1",
									children: [
										["spec", "Specification"],
										["prompt", "AI Prompt"],
										["materials", "Materials"],
										["dictionary", "Dictionary"],
										["bim", "BIM Schedule"]
									].map(([tabId, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPreviewTab(tabId),
										className: cn("rounded-full px-3 py-1 text-xs font-medium transition", previewTab === tabId ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg"),
										children: label
									}, tabId))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleCopyMarkdown,
											className: "hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted",
											title: "Copy as Markdown",
											children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3" }), copied ? "Copied" : "Copy"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleDownloadMarkdown,
											className: "hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted",
											title: "Download .md file",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), "Export .md"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleExportDictionaryJson,
											className: "hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted",
											title: "Export ARCHVIZ Saved Prompts JSON (schema_version: 1)",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), "Export JSON"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => jsonInputRef.current?.click(),
											className: "hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-raised px-3 text-xs text-muted",
											title: "Import ARCHVIZ Saved Prompts JSON",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }), "Import JSON"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: jsonInputRef,
											type: "file",
											accept: "application/json,.json",
											className: "sr-only",
											onChange: (e) => {
												handleImportDictionaryJson(e.target.files?.[0]);
												e.currentTarget.value = "";
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "toolbar-export-pdf-btn",
											onClick: () => setPdfModalOpen(true),
											className: "hover-chip inline-flex h-8 items-center gap-1.5 rounded-full border border-[#d4b06a]/50 bg-raised px-3 text-xs font-medium text-fg",
											title: "Export formatted Client Presentation PDF",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3 text-[#b08a45]" }), "Export PDF"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleSaveToProject,
											className: "gold-fill inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#2a1c0c]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-3" }), "Save Brief"]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 min-h-64 flex-1 overflow-y-auto pr-1",
							children: [
								previewTab === "spec" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
									className: "space-y-4 rounded-2xl border border-line/60 bg-raised/50 p-4 text-xs leading-relaxed text-fg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-serif text-base font-bold text-fg",
												children: visionDoc.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs text-[#b08a45]",
												children: visionDoc.subtitle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-[11px] text-faint",
												children: [
													"Compiled on ",
													visionDoc.date,
													" · Production-Ready"
												]
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-line/60 pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-fg",
												children: "1. Architectural Style & Massing"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-muted",
												children: selectedStyle ? selectedStyle.description : "No architectural style selected yet."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-line/60 pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-fg",
												children: "2. Lighting Condition & Luminance"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-muted",
												children: selectedLighting ? selectedLighting.description : "No lighting condition selected yet."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-line/60 pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-fg",
												children: "3. Mood & Spatial Psychology"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-muted",
												children: selectedMood ? selectedMood.description : "No mood setting selected yet."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-line/60 pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-fg",
												children: "4. Camera Strategy"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-muted",
												children: selectedCamera ? selectedCamera.description : "Default eye-level 28mm architectural lens."
											})]
										}),
										customNotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-line/60 pt-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-fg",
												children: "5. Studio Directives"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-muted",
												children: customNotes
											})]
										}) : null
									]
								}),
								previewTab === "prompt" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-line bg-raised p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold text-fg",
												children: "Synthesized Diffusion Prompt"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-faint",
												children: "Optimized for GPT, Midjourney, FLUX & Gemini"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs font-mono leading-relaxed text-fg/90 select-all",
											children: visionDoc.synthesizedPrompt
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between px-1 text-xs text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ready to paste directly into AI render pipelines or generate in Studio." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleSendToStudio,
											className: "font-semibold text-[#b08a45] hover:underline",
											children: "Open in Studio →"
										})]
									})]
								}),
								previewTab === "materials" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [selectedStyle?.materials ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-line bg-raised p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-fg",
												children: "Primary Material Palette"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "mt-2 grid grid-cols-2 gap-2",
												children: selectedStyle.materials.map((mat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-center gap-2 rounded-xl border border-line bg-surface p-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-[#d4b06a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mat })]
												}, mat))
											}),
											selectedStyle.swatches ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-faint",
													children: "Tonal Swatches:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex gap-1.5",
													children: selectedStyle.swatches.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "size-5 rounded-md border border-line/50 shadow-sm",
														style: { backgroundColor: color },
														title: color
													}, color))
												})]
											}) : null
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Select an Architectural Style to view its material palette."
									}), selectedLighting?.swatches ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-line bg-raised p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-fg",
												children: "Lighting Temperature & Illuminance Spectrum"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 text-xs text-muted",
												children: selectedLighting.tagline
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2.5 flex items-center gap-2",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex gap-1.5",
													children: selectedLighting.swatches.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "size-5 rounded-md border border-line/50 shadow-sm",
														style: { backgroundColor: color },
														title: color
													}, color))
												})
											})
										]
									}) : null]
								}),
								previewTab === "dictionary" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-line bg-raised p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs font-semibold text-fg",
												children: [
													"ARCHVIZ Prompt Dictionary Output (",
													composedDictionary.keptIds.length,
													" blocks)"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-faint",
												children: [
													"Scenario: ",
													activeDictPresetId,
													" · Auto-deduplicated"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "mt-2 whitespace-pre-wrap font-mono text-xs leading-relaxed text-fg/90 select-all",
											children: composedDictionary.text
										})]
									})
								}),
								previewTab === "bim" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-raised p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-fg",
											children: "Prompt-to-BIM Material & Lighting Schedule"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleDownloadBimJson,
												className: "hover-chip inline-flex h-8 items-center gap-1 rounded-full border border-line bg-surface px-3 text-xs text-muted hover:text-fg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), " BIM JSON"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: handleDownloadDesignPackHtml,
												className: "gold-fill inline-flex h-8 items-center gap-1 rounded-full px-3.5 text-xs font-semibold text-[#2a1c0c]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), " Design Pack (.html)"]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto rounded-2xl border border-line bg-raised/60",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full border-collapse text-left text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-line bg-surface/60 text-[11px] uppercase tracking-wider text-faint",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Code"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Element"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Specification"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Swatch"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "whitespace-nowrap px-3 py-2 text-right",
														children: "Area %"
													})
												]
											}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bimSchedule.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-b border-line/50 last:border-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "whitespace-nowrap px-3 py-2 font-mono text-[11px] text-[#b08a45]",
														children: row.code
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-3 py-2 font-medium text-fg",
														children: row.element
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-3 py-2 text-muted",
														children: row.specification
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "whitespace-nowrap px-3 py-2",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "inline-flex items-center gap-1.5 font-mono text-[10px]",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "size-3 rounded border border-line",
																style: { backgroundColor: row.finishHex }
															}), row.finishHex]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "px-3 py-2 text-right font-mono tabular-nums",
														children: [row.areaSharePct, "%"]
													})
												]
											}, row.code)) })]
										})
									})]
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientPdfExportModal, {
				open: pdfModalOpen,
				onClose: () => setPdfModalOpen(false),
				visionDoc,
				design,
				engine,
				scene3d,
				frame,
				schedule: bimSchedule,
				dictionarySummary: {
					presetId: activeDictPresetId,
					blockCount: composedDictionary.keptIds.length,
					text: composedDictionary.text,
					warningsCount: composedDictionary.warnings.length
				},
				activeTemplateName: BRIEF_TEMPLATES.find((t) => t.id === activeTemplateId)?.name ?? null,
				previewImageUrl: plate?.url ?? upload ?? BRIEF_TEMPLATES.find((t) => t.id === activeTemplateId)?.previewImage ?? selectedStyle?.image ?? "/viz/p01-pavilion-day.jpg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefCollabDrawer, {
				open: collabOpen,
				onClose: () => setCollabOpen(false),
				session: collabSession,
				activeSnapshot: currentCollabSnapshot,
				isSyncing: isSyncingShare,
				isCreatingShare,
				lastSyncedAt,
				reviewerName,
				onReviewerNameChange: handleReviewerNameChange,
				reviewerRole,
				onReviewerRoleChange: setReviewerRole,
				onGenerateShareLink: handleGenerateShareLink,
				onSyncSnapshot: handleSyncSharedSnapshot,
				onRefreshSession: handleRefreshSharedSession,
				onAddComment: handleAddCollabComment,
				onToggleCommentStatus: handleToggleCommentStatus,
				onDeleteComment: handleDeleteComment
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodboardOverlay, {
				open: moodboardOpen,
				onClose: () => setMoodboardOpen(false),
				queries: moodboardQueries,
				result: moodboardResult,
				loading: moodboardLoading,
				error: moodboardError,
				customQuery: moodboardCustomQuery,
				onCustomQueryChange: setMoodboardCustomQuery,
				onGenerate: handleRunMoodboard,
				onPinToBrief: handlePinMoodboardItem,
				pinnedIds: pinnedMoodboardIds
			})
		]
	});
}
function PaletteCard({ block, isSelected, onSelect, onDragStart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		draggable: true,
		onDragStart,
		onClick: onSelect,
		className: cn("group relative cursor-grab rounded-2xl border p-3 transition active:cursor-grabbing", isSelected ? "border-[#d4b06a] bg-[#fffaf0] shadow-sm" : "border-line bg-raised/40 hover:border-[#d4b06a]/60 hover:bg-raised"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-start gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-6 shrink-0 place-items-center text-faint transition group-hover:text-fg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-medium text-xs text-fg",
					children: block.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 line-clamp-1 text-[11px] text-muted",
					children: block.tagline
				})] })]
			}), isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-5 shrink-0 place-items-center rounded-full bg-[#d4b06a] text-[10px] text-ink",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					onSelect();
				},
				className: "shrink-0 rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] text-muted hover:border-[#d4b06a] hover:text-fg",
				children: "Select"
			})]
		}), block.swatches ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2.5 flex items-center gap-1.5 pl-8",
			children: [block.swatches.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "size-3 rounded-full border border-line/40 shadow-xs",
				style: { backgroundColor: color }
			}, color)), block.materials ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "truncate text-[10px] text-faint",
				children: ["· ", block.materials.slice(0, 2).join(", ")]
			}) : null]
		}) : null]
	});
}
function DropSlot({ category, title, icon, block, isDragOver, onDragOver, onDragLeave, onDrop, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onDragOver,
		onDragLeave,
		onDrop,
		className: cn("relative flex flex-col justify-between rounded-2xl border p-3.5 transition", isDragOver ? "border-2 border-dashed border-[#d4b06a] bg-[#fff8eb] shadow-md" : block ? "border-line bg-surface shadow-xs" : "border-dashed border-line bg-raised/50"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-fg",
					children: title
				})]
			}), block ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClear,
				className: "grid size-6 place-items-center rounded-full text-faint transition hover:bg-raised hover:text-red-600",
				title: "Remove block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 min-h-16",
			children: block ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-xs text-fg",
					children: block.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 line-clamp-2 text-[11px] text-muted",
					children: block.description
				}),
				block.swatches ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex gap-1",
					children: block.swatches.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-3.5 rounded border border-line/40 shadow-xs",
						style: { backgroundColor: color }
					}, color))
				}) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-16 flex-col items-center justify-center text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-faint",
					children: [
						"Drag a ",
						category,
						" card here"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-faint/70",
					children: "or click \"Select\" in the palette"
				})]
			})
		})]
	});
}
export { BriefBuilderPage as component };
