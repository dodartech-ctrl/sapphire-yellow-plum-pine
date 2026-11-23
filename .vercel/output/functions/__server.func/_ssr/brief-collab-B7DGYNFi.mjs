//#region node_modules/.nitro/vite/services/ssr/assets/brief-collab-B7DGYNFi.js
var COLLAB_PARAMETER_TARGETS = [
	{
		key: "style",
		label: "Architectural Style",
		category: "Blueprint Slot"
	},
	{
		key: "lighting",
		label: "Lighting Condition",
		category: "Blueprint Slot"
	},
	{
		key: "mood",
		label: "Mood & Atmosphere",
		category: "Blueprint Slot"
	},
	{
		key: "camera",
		label: "Camera / Composition",
		category: "Blueprint Slot"
	},
	{
		key: "workflowPreset",
		label: "Workflow Preset",
		category: "Visual Config"
	},
	{
		key: "facadeTypology",
		label: "Facade Typology",
		category: "Visual Config"
	},
	{
		key: "primaryMaterial",
		label: "3D Primary Material",
		category: "Visual Config"
	},
	{
		key: "focalLength",
		label: "Optics / Focal Length",
		category: "Visual Config"
	},
	{
		key: "frameRatio",
		label: "Frame & Resolution",
		category: "Visual Config"
	},
	{
		key: "directives",
		label: "Studio Directives",
		category: "Directives"
	}
];
var COLLAB_REVIEWER_ROLES = [
	"Lead Architect",
	"Lighting Director",
	"BIM Coordinator",
	"Visual Designer",
	"Client Reviewer"
];
function isValidCollabParameterKey(key) {
	return COLLAB_PARAMETER_TARGETS.some((t) => t.key === key);
}
function getCollabParameterTarget(key) {
	return COLLAB_PARAMETER_TARGETS.find((t) => t.key === key) ?? {
		key: "directives",
		label: "Studio Directives",
		category: "Directives"
	};
}
function extractParameterDisplayValues(snapshot) {
	const directivesTrimmed = snapshot.customNotes.trim();
	return {
		style: snapshot.slotNames.styleName || "Unassigned",
		lighting: snapshot.slotNames.lightingName || "Unassigned",
		mood: snapshot.slotNames.moodName || "Unassigned",
		camera: snapshot.slotNames.cameraName || "Unassigned",
		workflowPreset: snapshot.engine.workflowPreset,
		facadeTypology: snapshot.engine.facadeTypology,
		primaryMaterial: snapshot.scene3d.primaryMaterial,
		focalLength: `${snapshot.scene3d.focalLength}mm`,
		frameRatio: `${snapshot.frame.ratio} · ${snapshot.frame.resolution}`,
		directives: directivesTrimmed.length > 96 ? `${directivesTrimmed.slice(0, 93)}...` : directivesTrimmed || "No studio directives"
	};
}
function buildSharedBriefSnapshot(args) {
	return {
		title: args.title.trim().slice(0, 140) || "Architectural Vision Brief",
		subtitle: args.subtitle.trim().slice(0, 200) || "Studio Specification",
		slotIds: {
			styleId: args.selectedStyle?.id ?? null,
			lightingId: args.selectedLighting?.id ?? null,
			moodId: args.selectedMood?.id ?? null,
			cameraId: args.selectedCamera?.id ?? null
		},
		slotNames: {
			styleName: args.selectedStyle?.name ?? "Unassigned",
			lightingName: args.selectedLighting?.name ?? "Unassigned",
			moodName: args.selectedMood?.name ?? "Unassigned",
			cameraName: args.selectedCamera?.name ?? "Unassigned"
		},
		customNotes: args.customNotes.slice(0, 6e3),
		activeDictPresetId: args.activeDictPresetId,
		dictionaryBlocks: [...args.dictionaryBlocks],
		dictionaryParams: args.dictionaryParams,
		activeTemplateId: args.activeTemplateId,
		design: args.design,
		engine: args.engine,
		scene3d: args.scene3d,
		frame: args.frame,
		synthesizedPrompt: args.synthesizedPrompt.slice(0, 6e3),
		bimSchedule: args.bimSchedule
	};
}
function normalizeAuthorName(name) {
	return name.replace(/\s+/g, " ").trim().slice(0, 48) || "Studio Collaborator";
}
function normalizeCommentBody(body) {
	return body.replace(/\r\n/g, "\n").trim().slice(0, 1200);
}
function sanitizeShareId(raw) {
	return raw.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
}
function buildBriefShareUrl(origin, shareId) {
	const cleanOrigin = origin.replace(/\/+$/, "");
	const cleanId = sanitizeShareId(shareId);
	return `${cleanOrigin}/builder?share=${encodeURIComponent(cleanId)}`;
}
function summarizeCommentsByParameter(comments) {
	const summary = {};
	for (const target of COLLAB_PARAMETER_TARGETS) summary[target.key] = {
		open: 0,
		resolved: 0,
		total: 0
	};
	for (const comment of comments) {
		const bucket = summary[comment.parameterKey];
		if (!bucket) continue;
		bucket.total += 1;
		if (comment.status === "resolved") bucket.resolved += 1;
		else bucket.open += 1;
	}
	return summary;
}
//#endregion
export { extractParameterDisplayValues as a, normalizeAuthorName as c, summarizeCommentsByParameter as d, buildSharedBriefSnapshot as i, normalizeCommentBody as l, COLLAB_REVIEWER_ROLES as n, getCollabParameterTarget as o, buildBriefShareUrl as r, isValidCollabParameterKey as s, COLLAB_PARAMETER_TARGETS as t, sanitizeShareId as u };
