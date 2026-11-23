import { o as __toESM } from "../_runtime.mjs";
import { A as LOOKS, L as RENDER_FIDELITIES, O as IPADAPTER_PRESETS, Q as WORKFLOW_PRESETS, S as GROUPS, U as SKETCH_MODES, _ as ENHANCE_MODES, _t as sanitizeEngineState, d as DEFAULT_ENGINE, dt as normalizeQueueStatus, f as DEFAULT_FRAME, gt as sanitizeDesign, h as DETAIL_DENSITIES, n as ADVANCED_GROUPS, ot as createQueueItem, p as DEFAULT_SCENE3D, r as ANNOTATOR_MODES, tt as buildIntentLookAppliedPrompt, u as DEFAULT_DESIGN, v as ESRGAN_MODELS, vt as sanitizeFrame, xt as updateQueueListStatus, y as EXTRA_PILLS, yt as sanitizeScene3DState } from "./preset-transform-2eK0qpTl.mjs";
import { n as parseImageDimensionsFromDataUrl } from "./image-aspect-mHAG7qZJ.mjs";
import { a as applyMidLayerPromptToIdea, l as getMidLayerPresetById } from "./archviz-dictionary-BdT_Lv3z.mjs";
import { d as sanitizeBudgetState, n as DEFAULT_BUDGET_STATE } from "./budget-guard-DuH_kgYu.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
// node_modules/.nitro/vite/services/ssr/assets/store-C0Ow5frY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var DEFAULT_PILLS = {
	camera: "Eye level",
	light: "Soft overcast",
	material: "Oak and plaster",
	mood: "Quiet"
};
function detectFloorPlanWallsFromGrid(darkMask, cols, rows) {
	const walls = [];
	const scaleX = 14 / Math.max(1, cols);
	const scaleZ = 11 / Math.max(1, rows);
	for (let r = 0; r < rows; r++) {
		let runStart = -1;
		for (let c = 0; c <= cols; c++) {
			const dark = c < cols ? (darkMask[r * cols + c] ?? 0) > 0 : false;
			if (dark && runStart < 0) runStart = c;
			else if (!dark && runStart >= 0) {
				const len = c - runStart;
				if (len >= 2) {
					const cx = ((runStart + c) * .5 - cols * .5) * scaleX;
					const cz = (r - rows * .5) * scaleZ;
					walls.push({
						id: `wh-${r}-${runStart}`,
						x: Number(cx.toFixed(2)),
						z: Number(cz.toFixed(2)),
						width: Number(Math.max(.35, len * scaleX).toFixed(2)),
						depth: .28,
						height: 3.1,
						hasDoorGap: len >= 5 && r > 1 && r < rows - 2
					});
				}
				runStart = -1;
			}
		}
	}
	for (let c = 0; c < cols; c++) {
		let runStart = -1;
		for (let r = 0; r <= rows; r++) {
			const dark = r < rows ? (darkMask[r * cols + c] ?? 0) > 0 : false;
			if (dark && runStart < 0) runStart = r;
			else if (!dark && runStart >= 0) {
				const len = r - runStart;
				if (len >= 2) {
					const cx = (c - cols * .5) * scaleX;
					const cz = ((runStart + r) * .5 - rows * .5) * scaleZ;
					walls.push({
						id: `wv-${c}-${runStart}`,
						x: Number(cx.toFixed(2)),
						z: Number(cz.toFixed(2)),
						width: .28,
						depth: Number(Math.max(.35, len * scaleZ).toFixed(2)),
						height: 3.1
					});
				}
				runStart = -1;
			}
		}
	}
	if (walls.length < 3) walls.push({
		id: "p-north",
		x: 0,
		z: -4.2,
		width: 12,
		depth: .3,
		height: 3.1
	}, {
		id: "p-west",
		x: -5.85,
		z: 0,
		width: .3,
		depth: 8.6,
		height: 3.1
	}, {
		id: "p-east",
		x: 5.85,
		z: 0,
		width: .3,
		depth: 8.6,
		height: 3.1
	}, {
		id: "p-partition",
		x: -1.4,
		z: -.6,
		width: .24,
		depth: 6.4,
		height: 3.1,
		hasDoorGap: true
	}, {
		id: "p-corridor",
		x: 2.2,
		z: -1.1,
		width: 6.2,
		depth: .24,
		height: 3.1,
		hasDoorGap: true
	});
	const trimmed = walls.slice(0, 48);
	return {
		walls: trimmed,
		roomCount: Math.max(2, Math.min(8, Math.round(trimmed.length / 2.5))),
		footprintWidth: 14,
		footprintDepth: 11,
		summary: `Detected ${trimmed.length} extruded wall segments across ${Math.max(2, Math.round(trimmed.length / 2.5))} bounded rooms.`
	};
}
var DEFAULT_HOUSE_STYLES = [{
	id: "hs-nordic-monograph",
	name: "Nordic Monograph",
	sampleCount: 10,
	palette: [
		"#dcd7cf",
		"#9b8e7b",
		"#3d3933",
		"#b8955c"
	],
	contrastBias: "Monograph Neutral",
	entourageStyle: "Sparse soft-motion Nordic figures & silver birch trees",
	lensGrain: "35mm medium format subtle silver grain, zero oversharpening",
	promptDirective: "HOUSE STYLE (Nordic Monograph): desaturated stone-beige neutrals, matte limestone and pale rift oak, diffused overcast-sky shadow falloff, calm human scale.",
	previewImage: "/viz/t01-public-library.jpg",
	createdAt: 173e10
}, {
	id: "hs-tropical-modern",
	name: "Subtropical Brass",
	sampleCount: 12,
	palette: [
		"#c8b393",
		"#4c5c43",
		"#2b231b",
		"#d9a95c"
	],
	contrastBias: "Editorial High",
	entourageStyle: "Lush courtyard palms, warm limestone terrace reflections",
	lensGrain: "Crisp architectural 24mm shift lens, warm 2900K interior bounce",
	promptDirective: "HOUSE STYLE (Subtropical Brass): deep timber eaves, dappled tropical foliage shadows, travertine plinths, warm dusk-gold interior hearth contrast.",
	previewImage: "/viz/t05-subtropical-home.jpg",
	createdAt: 1730000001e3
}];
function buildHouseStyleProfile(params) {
	const palette = params.palette?.length ? params.palette.slice(0, 4) : [
		"#d6cfc2",
		"#8e7b63",
		"#2b2621",
		"#c5a059"
	];
	const contrastBias = params.contrastBias ?? "Editorial High";
	const entourageStyle = params.entourageStyle?.trim() || "Motion-blurred gallery visitors & native architectural planting";
	return {
		id: `hs-${Date.now()}`,
		name: params.name.trim() || "Firm Signature Style",
		sampleCount: Math.max(1, params.sampleImages.length),
		palette,
		contrastBias,
		entourageStyle,
		lensGrain: "Calibrated 35mm architectural shift lens, natural micro-grain",
		promptDirective: `HOUSE STYLE (${params.name.trim() || "Firm Signature"} · ${params.sampleImages.length} refs): Palette ${palette.join("/")}, ${contrastBias} tonal curve, ${entourageStyle}.`,
		previewImage: params.sampleImages[0] || "/viz/p01-pavilion-dusk.jpg",
		createdAt: Date.now()
	};
}
var ENTOURAGE_CATALOG = [
	{
		id: "fig-walk",
		label: "Walking Figure",
		category: "Figure",
		glyph: "🚶",
		widthNorm: .06,
		heightNorm: .16,
		promptHint: "architectural scale figure walking with subtle motion blur"
	},
	{
		id: "fig-duo",
		label: "Gallery Pair",
		category: "Figure",
		glyph: "🧍",
		widthNorm: .09,
		heightNorm: .16,
		promptHint: "two architectural scale visitors conversing near facade"
	},
	{
		id: "tree-olive",
		label: "Olive Tree",
		category: "Foliage",
		glyph: "🌳",
		widthNorm: .16,
		heightNorm: .24,
		promptHint: "sculptural specimen olive tree casting dappled ground shadow"
	},
	{
		id: "tree-pine",
		label: "Scots Pine",
		category: "Foliage",
		glyph: "🌲",
		widthNorm: .14,
		heightNorm: .28,
		promptHint: "tall Nordic pine framing perimeter horizon"
	},
	{
		id: "ev-sedan",
		label: "Parked EV",
		category: "Mobility",
		glyph: "🚙",
		widthNorm: .18,
		heightNorm: .11,
		promptHint: "matte dark electric grand tourer parked cleanly on forecourt"
	},
	{
		id: "patio-chair",
		label: "Lounge Set",
		category: "Furniture",
		glyph: "🪑",
		widthNorm: .12,
		heightNorm: .1,
		promptHint: "low-profile teak and linen terrace lounge chairs"
	}
];
function buildBatchMatrixSpecs(params) {
	if (params.mode === "sun-study") return [
		{
			label: `${params.look} · 08:00 Morning`,
			preset: params.preset,
			light: "Daylight",
			cameraPreset: "oblique",
			sunHour: 8,
			promptNote: "crisp 8am easterly solar angle with dewy reflections"
		},
		{
			label: `${params.look} · 12:30 Zenith`,
			preset: params.preset,
			light: "Daylight",
			cameraPreset: "oblique",
			sunHour: 12.5,
			promptNote: "high overhead midday sunlight, clean overhang shadows"
		},
		{
			label: `${params.look} · 17:30 Golden`,
			preset: params.preset,
			light: "Golden hour",
			cameraPreset: "oblique",
			sunHour: 17.5,
			promptNote: "warm 17:30 golden hour grazing light across facade"
		},
		{
			label: `${params.look} · 20:15 Blue Hour`,
			preset: params.preset,
			light: "Evening",
			cameraPreset: "oblique",
			sunHour: 20.25,
			promptNote: "deep twilight blue sky with glowing 2700K interior rooms"
		}
	];
	return [
		{
			label: `${params.look} · Eye 1.6m Hero`,
			preset: params.preset,
			light: "Golden hour",
			cameraPreset: "eye",
			promptNote: "pedestrian eye-level 1.6m architectural approach"
		},
		{
			label: `${params.look} · 3/4 Oblique`,
			preset: params.preset,
			light: "Daylight",
			cameraPreset: "oblique",
			promptNote: "classic 3/4 oblique architectural composition"
		},
		{
			label: `${params.look} · Aerial Context`,
			preset: params.preset,
			light: "Daylight",
			cameraPreset: "aerial",
			promptNote: "elevated drone perspective showing roof massing and site context"
		}
	];
}
var FLYTHROUGH_DURATION_MS = 4e3;
function catmullRomScalar(p0, p1, p2, p3, t) {
	const t2 = t * t;
	const t3 = t2 * t;
	return .5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
function interpolateCameraPathCatmullRom(keyframes, tNorm) {
	if (keyframes.length === 0) return null;
	if (keyframes.length === 1) return keyframes[0];
	const t = Math.max(0, Math.min(1, tNorm));
	if (keyframes.length === 2) {
		const ease = t * t * (3 - 2 * t);
		const a = keyframes[0];
		const b = keyframes[1];
		const lerp = (v0, v1) => Number((v0 + (v1 - v0) * ease).toFixed(3));
		return {
			pos: [
				lerp(a.pos[0], b.pos[0]),
				lerp(a.pos[1], b.pos[1]),
				lerp(a.pos[2], b.pos[2])
			],
			target: [
				lerp(a.target[0], b.target[0]),
				lerp(a.target[1], b.target[1]),
				lerp(a.target[2], b.target[2])
			],
			focalLength: lerp(a.focalLength, b.focalLength)
		};
	}
	const segments = keyframes.length - 1;
	const scaled = t * segments;
	const idx = Math.min(segments - 1, Math.floor(scaled));
	const localT = scaled - idx;
	const p1 = keyframes[idx];
	const p2 = keyframes[idx + 1];
	const p0 = idx > 0 ? keyframes[idx - 1] : {
		...p1,
		pos: [
			2 * p1.pos[0] - p2.pos[0],
			2 * p1.pos[1] - p2.pos[1],
			2 * p1.pos[2] - p2.pos[2]
		],
		target: [
			2 * p1.target[0] - p2.target[0],
			2 * p1.target[1] - p2.target[1],
			2 * p1.target[2] - p2.target[2]
		],
		focalLength: 2 * p1.focalLength - p2.focalLength
	};
	const p3 = idx + 2 < keyframes.length ? keyframes[idx + 2] : {
		...p2,
		pos: [
			2 * p2.pos[0] - p1.pos[0],
			2 * p2.pos[1] - p1.pos[1],
			2 * p2.pos[2] - p1.pos[2]
		],
		target: [
			2 * p2.target[0] - p1.target[0],
			2 * p2.target[1] - p1.target[1],
			2 * p2.target[2] - p1.target[2]
		],
		focalLength: 2 * p2.focalLength - p1.focalLength
	};
	const evalTuple = (i, key) => Number(catmullRomScalar(p0[key][i], p1[key][i], p2[key][i], p3[key][i], localT).toFixed(3));
	const rawFocal = catmullRomScalar(p0.focalLength, p1.focalLength, p2.focalLength, p3.focalLength, localT);
	return {
		pos: [
			evalTuple(0, "pos"),
			Math.max(.4, evalTuple(1, "pos")),
			evalTuple(2, "pos")
		],
		target: [
			evalTuple(0, "target"),
			evalTuple(1, "target"),
			evalTuple(2, "target")
		],
		focalLength: Number(Math.max(14, Math.min(120, rawFocal)).toFixed(2))
	};
}
function sampleCameraPathPoints(keyframes, steps = 28) {
	if (keyframes.length < 2) return keyframes.map((k) => k.pos);
	const count = Math.max(4, steps);
	const pts = [];
	for (let i = 0; i <= count; i++) {
		const sample = interpolateCameraPathCatmullRom(keyframes, i / count);
		if (sample) pts.push(sample.pos);
	}
	return pts;
}
function buildOrbitDollyZoomRig(basePos, baseTarget, baseFocalLength) {
	const dx = basePos[0] - baseTarget[0];
	const dy = basePos[1] - baseTarget[1];
	const dz = basePos[2] - baseTarget[2];
	const radius = Math.max(4, Math.hypot(dx, dz));
	const baseAz = Math.atan2(dz, dx);
	const orbitAz = baseAz - .62;
	const orbitPos = [
		Number((baseTarget[0] + Math.cos(orbitAz) * (radius * 1.12)).toFixed(2)),
		Number(Math.max(1.8, baseTarget[1] + dy + 1.4).toFixed(2)),
		Number((baseTarget[2] + Math.sin(orbitAz) * (radius * 1.12)).toFixed(2))
	];
	const dollyAz = baseAz + .14;
	const dollyPos = [
		Number((baseTarget[0] + Math.cos(dollyAz) * (radius * .72)).toFixed(2)),
		Number(Math.max(1.5, baseTarget[1] + Math.max(.8, dy * .65)).toFixed(2)),
		Number((baseTarget[2] + Math.sin(dollyAz) * (radius * .72)).toFixed(2))
	];
	const zoomAz = baseAz + .48;
	const zoomPos = [
		Number((baseTarget[0] + Math.cos(zoomAz) * (radius * .56)).toFixed(2)),
		Number(Math.max(1.4, baseTarget[1] + Math.max(.6, dy * .52)).toFixed(2)),
		Number((baseTarget[2] + Math.sin(zoomAz) * (radius * .56)).toFixed(2))
	];
	const wideMm = Math.max(18, Math.min(28, Math.round(baseFocalLength * .78)));
	const midMm = Math.max(24, Math.min(45, Math.round(baseFocalLength)));
	const teleMm = Math.max(50, Math.min(85, Math.round(baseFocalLength + 24)));
	return [
		{
			id: `kf-orbit-${Date.now()}-1`,
			label: `1. Orbit (${wideMm}mm)`,
			role: "orbit",
			pos: orbitPos,
			target: [...baseTarget],
			focalLength: wideMm
		},
		{
			id: `kf-dolly-${Date.now()}-2`,
			label: `2. Dolly (${midMm}mm)`,
			role: "dolly",
			pos: dollyPos,
			target: [
				baseTarget[0],
				Number((baseTarget[1] + .35).toFixed(2)),
				baseTarget[2]
			],
			focalLength: midMm
		},
		{
			id: `kf-zoom-${Date.now()}-3`,
			label: `3. Zoom (${teleMm}mm)`,
			role: "zoom",
			pos: zoomPos,
			target: [
				baseTarget[0],
				Number((baseTarget[1] + .65).toFixed(2)),
				baseTarget[2]
			],
			focalLength: teleMm
		}
	];
}
function upsertRoleKeyframe(keyframes, incoming) {
	if (!incoming.role) return [...keyframes, incoming].slice(0, 6);
	const roleOrder = {
		orbit: 0,
		dolly: 1,
		zoom: 2
	};
	return [...keyframes.filter((k) => k.role !== incoming.role), incoming].sort((a, b) => (a.role ? roleOrder[a.role] : 9) - (b.role ? roleOrder[b.role] : 9)).slice(0, 6);
}
function encodeReviewPinsParam(pins) {
	try {
		const json = JSON.stringify(pins.slice(0, 20).map((p) => ({
			i: p.id,
			p: p.projectId,
			n: p.number,
			x: Number(p.xNorm.toFixed(3)),
			y: Number(p.yNorm.toFixed(3)),
			a: p.author,
			m: p.note,
			s: p.status
		})));
		return btoa(unescape(encodeURIComponent(json)));
	} catch {
		return "";
	}
}
function decodeReviewPinsParam(encoded) {
	try {
		if (!encoded) return [];
		const json = decodeURIComponent(escape(atob(encoded)));
		const arr = JSON.parse(json);
		if (!Array.isArray(arr)) return [];
		return arr.filter((r) => typeof r.m === "string" && typeof r.x === "number" && typeof r.y === "number").map((r, idx) => ({
			id: r.i || `pin-shared-${idx}`,
			projectId: r.p || "shared",
			number: r.n ?? idx + 1,
			xNorm: Math.max(.02, Math.min(.98, r.x)),
			yNorm: Math.max(.02, Math.min(.98, r.y)),
			author: r.a || "Client Reviewer",
			note: r.m,
			status: r.s === "resolved" ? "resolved" : "open",
			createdAt: Date.now()
		}));
	} catch {
		return [];
	}
}
function buildMaterialScheduleRows(design, engine, scene3d) {
	return [
		{
			code: "MAT-01",
			element: "Primary Envelope / Structural Wall",
			specification: `${engine.facadeTypology} · ${scene3d.primaryMaterial} finish (${engine.climateRegion})`,
			finishHex: scene3d.primaryMaterial === "timber" ? "#b68557" : scene3d.primaryMaterial === "travertine" ? "#ded2bd" : scene3d.primaryMaterial === "brick" ? "#9f5b47" : "#b6b4ae",
			areaSharePct: 44,
			sourceModule: "LookX + 3D Rig"
		},
		{
			code: "MAT-02",
			element: "Glazing & Fenestration System",
			specification: `Low-iron double glazing · ${design.picks.windows || design.picks.openings || "Slim anodized frames"}`,
			finishHex: "#7db9b6",
			areaSharePct: 28,
			sourceModule: "Veras Geometry Lock"
		},
		{
			code: "MAT-03",
			element: "Ground Plane & Hardscape Plinth",
			specification: design.picks.floor || design.picks.terrace || design.picks.path || "Honed limestone slabs",
			finishHex: "#c9c1b2",
			areaSharePct: 18,
			sourceModule: "Design Properties"
		},
		{
			code: "MAT-04",
			element: "Solar & Interior Practical Luminaires",
			specification: `${design.light} (${scene3d.sunAzimuth}° az / ${scene3d.sunElevation}° el) · 2700K interior wash`,
			finishHex: "#e7c27a",
			areaSharePct: 10,
			sourceModule: "D5 Lighting Rig"
		}
	];
}
function buildDesignPackDocumentHtml(params) {
	const rowsHtml = params.schedule.map((r) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;font-family:monospace;">${r.code}</td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;"><strong>${r.element}</strong></td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;">${r.specification}</td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${r.finishHex};vertical-align:middle;margin-right:6px;"></span>${r.finishHex}</td>
        <td style="padding:8px;border-bottom:1px solid #e5ded2;text-align:right;font-family:monospace;">${r.areaSharePct}%</td>
      </tr>`).join("");
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${params.title} — Oriel Design Pack</title>
  <style>
    body { font-family: Georgia, serif; color: #1c1915; max-width: 860px; margin: 40px auto; padding: 0 24px; line-height: 1.5; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    .meta { font-family: system-ui, sans-serif; font-size: 12px; color: #6e6456; margin-bottom: 24px; }
    .box { background: #f8f5ef; border: 1px solid #e5ded2; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-family: system-ui, sans-serif; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; font-family: system-ui, sans-serif; font-size: 12px; }
    th { text-align: left; border-bottom: 2px solid #c9b99c; padding: 8px; text-transform: uppercase; font-size: 11px; color: #5b5245; }
  </style>
</head>
<body>
  <h1>${params.title}</h1>
  <div class="meta">Oriel Archviz Specification · ${params.design.vertical} · ${params.design.look} · Lens ${params.scene3d.focalLength}mm · Seed #${params.engine.seed}</div>
  <div class="box">
    <strong>Compiled Brief &amp; Directives</strong><br/>
    <p style="margin-top:6px;white-space:pre-wrap;">${params.prompt}</p>
  </div>
  <h3>BIM Material &amp; Lighting Schedule</h3>
  <table>
    <thead>
      <tr><th>Code</th><th>Element</th><th>Specification</th><th>Swatch</th><th style="text-align:right;">Coverage</th></tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`;
}
function getQueueStats(queue) {
	let pending = 0;
	let processing = 0;
	let completed = 0;
	let failed = 0;
	for (const item of queue) if (item.status === "pending" || item.status === "queued") pending++;
	else if (item.status === "processing" || item.status === "running") processing++;
	else if (item.status === "completed" || item.status === "done") completed++;
	else failed++;
	return {
		total: queue.length,
		pending,
		processing,
		completed,
		failed
	};
}
function computeBatchProgress(queue) {
	const stats = getQueueStats(queue);
	const activeProcessing = queue.find((item) => item.status === "processing" || item.status === "running");
	const nextPending = queue.find((item) => item.status === "pending" || item.status === "queued");
	const finished = stats.completed + stats.failed;
	const progressPct = stats.total > 0 ? Math.round(finished / stats.total * 100) : 0;
	return {
		...stats,
		progressPct,
		activeProcessingId: activeProcessing?.id ?? null,
		nextPendingId: nextPending?.id ?? null,
		isComplete: stats.total > 0 && stats.pending === 0 && stats.processing === 0
	};
}
function getQueueItemVisualMeta(item, fallbackThumb = "/viz/p01-pavilion-day.jpg") {
	const isEvening = item.light.toLowerCase().includes("evening") || typeof item.sunHour === "number" && item.sunHour >= 19.5;
	const isGolden = item.light.toLowerCase().includes("golden") || typeof item.sunHour === "number" && item.sunHour >= 16.5 && item.sunHour < 19.5;
	const defaultPreview = isEvening ? "/viz/p01-pavilion-dusk.jpg" : isGolden ? "/viz/t05-subtropical-home.jpg" : fallbackThumb;
	const thumbnail = item.url || item.thumbnailUrl || defaultPreview;
	if (item.status === "processing" || item.status === "running") return {
		normalizedStatus: "processing",
		statusLabel: "Processing",
		barWidthPct: 68,
		statusHint: "Synthesizing architectural pass…",
		thumbnail
	};
	if (item.status === "completed" || item.status === "done") return {
		normalizedStatus: "completed",
		statusLabel: "Completed",
		barWidthPct: 100,
		statusHint: item.durationMs ? `Done in ${(item.durationMs / 1e3).toFixed(2)}s` : "Ready to inspect",
		thumbnail
	};
	if (item.status === "error") return {
		normalizedStatus: "error",
		statusLabel: "Failed",
		barWidthPct: 100,
		statusHint: item.errorMessage || "Render pass failed — retry available",
		thumbnail
	};
	return {
		normalizedStatus: "pending",
		statusLabel: "Pending",
		barWidthPct: 18,
		statusHint: "Queued · waiting turn",
		thumbnail
	};
}
var NEUTRAL_PICKS = /* @__PURE__ */ new Set([
	"Unchanged",
	"None",
	"Keep",
	"none",
	"off",
	"Off"
]);
var TARGET_LABELS = {
	whole: "All Elements",
	floor: "Flooring",
	wall: "Walls",
	ceiling: "Ceiling",
	furniture: "Furniture",
	fixture: "Lighting",
	openings: "Doors",
	kitchen: "Windows",
	decor: "Decor",
	facade: "Facade",
	roof: "Roof",
	windows: "Windows",
	entry: "Entrance",
	balcony: "Balcony",
	terrace: "Terrace",
	drive: "Driveway",
	water: "Water",
	wellness: "Wellness",
	social: "Social",
	sport: "Sport",
	outdoor: "Outdoor",
	family: "Family",
	work: "Work",
	security: "Arrival",
	trees: "Trees",
	planting: "Planting",
	lawn: "Lawn",
	garden: "Garden",
	path: "Paths",
	structure: "Structure",
	edge: "Boundary"
};
var DESIGN_FIELD_PREFIX = {
	range: "Range",
	look: "Style",
	camera: "Camera",
	light: "Light",
	mood: "Mood",
	people: "People",
	activity: "Activity",
	color: "Color",
	weather: "Weather",
	time: "Time",
	detail: "Detail",
	strength: "Strength"
};
var ADVANCED_PREFIX = {
	light: "Atmosphere",
	air: "Air",
	season: "Season",
	change: "Allowed Change",
	grade: "Grade"
};
var IP_ADAPTER_REF_LABELS = {
	"/viz/p01-pavilion-dusk.jpg": "Concrete Ref",
	"/viz/t05-subtropical-home.jpg": "Timber Ref",
	"/viz/p02-loft-after.jpg": "Loft Ref"
};
function escapeRegExp(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizePromptText(text) {
	return text.replace(/\s*\.\s*\./g, ".").replace(/\.\s*,/g, ".").replace(/\s{2,}/g, " ").replace(/^[\s.,;]+|[\s.,;]+$/g, "").trim();
}
/**
* Replaces or inserts a labeled slot clause (e.g. `Flooring: Travertine`) in-place
* while preserving user-written notes, Mid-Layer snippets, and suggestions.
*/
function upsertClauseInIdea(currentIdea, prefix, value) {
	const cleanValue = value?.trim() ?? "";
	const clauseRegex = new RegExp(`(?:^|(?<=[.\\n;]))\\s*${escapeRegExp(prefix)}:\\s*[^.\\n;]+\\.?`, "i");
	const nextClause = cleanValue ? `${prefix}: ${cleanValue}` : "";
	if (clauseRegex.test(currentIdea)) return normalizePromptText(currentIdea.replace(clauseRegex, (match) => {
		if (!nextClause) return "";
		const leadingSpace = /^\s/.test(match) ? " " : "";
		const trailingDot = match.trimEnd().endsWith(".") ? "." : "";
		return `${leadingSpace}${nextClause}${trailingDot}`;
	}));
	const base = normalizePromptText(currentIdea);
	if (!nextClause) return base;
	if (!base) return nextClause;
	return `${base}. ${nextClause}`;
}
function toggleTokenInIdea(currentIdea, token, enabled) {
	const cleanToken = token.trim();
	if (!cleanToken) return normalizePromptText(currentIdea);
	const tokenRegex = new RegExp(`(?:^|(?<=[.\\s,;\\n]))${escapeRegExp(cleanToken)}(?=$|[.\\s,;\\n])`, "i");
	const exists = tokenRegex.test(currentIdea);
	if (!enabled) {
		if (!exists) return normalizePromptText(currentIdea);
		return normalizePromptText(currentIdea.replace(tokenRegex, ""));
	}
	if (exists) return normalizePromptText(currentIdea);
	const base = normalizePromptText(currentIdea);
	return base ? `${base}. ${cleanToken}` : cleanToken;
}
function syncPickToIdea(currentIdea, vertical, groupId, value) {
	return upsertClauseInIdea(currentIdea, GROUPS[vertical].find((item) => item.id === groupId)?.label ?? groupId, NEUTRAL_PICKS.has(value) ? null : value);
}
function syncDesignFieldToIdea(currentIdea, field, value) {
	const prefix = DESIGN_FIELD_PREFIX[field];
	return upsertClauseInIdea(currentIdea, prefix, value);
}
function syncTargetToIdea(currentIdea, target) {
	return upsertClauseInIdea(currentIdea, "Target", TARGET_LABELS[target] ?? target);
}
function syncTagToIdea(currentIdea, tag, nextTags) {
	const isEnabled = nextTags.includes(tag);
	return toggleTokenInIdea(currentIdea, `#${tag}`, isEnabled);
}
function syncAdvancedToIdea(currentIdea, key, value) {
	const prefix = ADVANCED_PREFIX[key];
	const option = ADVANCED_GROUPS.find((item) => item.key === key)?.options.find((item) => item.id === value);
	if (!option || option.id === "none") return upsertClauseInIdea(currentIdea, prefix, null);
	return upsertClauseInIdea(currentIdea, prefix, option.label);
}
function syncExtraToIdea(currentIdea, extraId, nextExtras) {
	const pill = EXTRA_PILLS.find((item) => item.id === extraId);
	if (!pill) return normalizePromptText(currentIdea);
	const isEnabled = nextExtras.includes(extraId);
	return toggleTokenInIdea(currentIdea, pill.label, isEnabled);
}
function syncWorkflowPresetToIdea(currentIdea, presetId) {
	const preset = WORKFLOW_PRESETS.find((item) => item.id === presetId);
	if (!preset) return currentIdea;
	return upsertClauseInIdea(currentIdea, "Workflow", preset.label);
}
function syncEngineFieldToIdea(currentIdea, key, value) {
	switch (key) {
		case "renderFidelity": return upsertClauseInIdea(currentIdea, "Fidelity", RENDER_FIDELITIES.find((f) => f.id === value)?.label ?? String(value));
		case "facadeTypology": return upsertClauseInIdea(currentIdea, "Facade Typology", String(value));
		case "climateRegion": return upsertClauseInIdea(currentIdea, "Climate", String(value));
		case "detailDensity": return upsertClauseInIdea(currentIdea, "Detail Density", DETAIL_DENSITIES.find((d) => d.id === value)?.label ?? String(value));
		case "sketchMode": return upsertClauseInIdea(currentIdea, "Sketch Mode", SKETCH_MODES.find((s) => s.id === value)?.label ?? String(value));
		case "enhanceMode": return upsertClauseInIdea(currentIdea, "Enhance", ENHANCE_MODES.find((e) => e.id === value)?.label ?? String(value));
		case "annotatorMode":
			if (value === "none") return upsertClauseInIdea(currentIdea, "Annotator", null);
			return upsertClauseInIdea(currentIdea, "Annotator", ANNOTATOR_MODES.find((m) => m.id === value)?.label ?? String(value));
		case "depthEnabled": return toggleTokenInIdea(currentIdea, "Depth-Anything-V2 Lock", Boolean(value));
		case "ipAdapterEnabled": return toggleTokenInIdea(currentIdea, "IP-Adapter Style Lock", Boolean(value));
		case "ipAdapterPreset": return upsertClauseInIdea(currentIdea, "IP-Adapter", IPADAPTER_PRESETS.find((p) => p.id === value)?.label ?? String(value));
		case "ipAdapterRefUrl":
			if (typeof value !== "string" || !value) return upsertClauseInIdea(currentIdea, "Style Ref", null);
			return upsertClauseInIdea(currentIdea, "Style Ref", IP_ADAPTER_REF_LABELS[value] ?? "Custom Ref");
		case "esrganModel": return upsertClauseInIdea(currentIdea, "Upscaler", ESRGAN_MODELS.find((m) => m.id === value)?.label ?? String(value));
		case "esrganFaceEnhance": return toggleTokenInIdea(currentIdea, "Fixture & Edge Restore", Boolean(value));
		case "outputMode": return upsertClauseInIdea(currentIdea, "Output", value === "grid-4" ? "4-Up Grid" : "Single Plate");
		default: return currentIdea;
	}
}
var BUILDER_SLOT_PREFIX = {
	style: "Style",
	lighting: "Lighting",
	mood: "Mood",
	camera: "Lens"
};
function conciseKeywordSnippet(snippet, maxClauses = 2) {
	if (!snippet) return "";
	return snippet.split(",").map((p) => p.trim().replace(/\.+$/g, "")).filter(Boolean).slice(0, maxClauses).join(", ");
}
/**
* Dynamically injects or removes a Brief Builder slot's architectural keywords
* inside the live prompt/directives textarea while keeping manual notes intact.
*/
function syncBuilderSlotToNotes(currentNotes, category, block) {
	const prefix = BUILDER_SLOT_PREFIX[category];
	if (!block) return upsertClauseInIdea(currentNotes, prefix, null);
	const snippet = conciseKeywordSnippet(block.promptSnippet, 2);
	return upsertClauseInIdea(currentNotes, prefix, snippet ? `${block.name} (${snippet})` : block.name);
}
/**
* Dynamically injects or removes an ARCHVIZ Dictionary block keyword phrase
* when a pill button is clicked in Prompt Builder.
*/
function toggleDictionaryBlockInNotes(currentNotes, blockLabel, enabled) {
	const cleanLabel = blockLabel.trim().replace(/[.]/g, "");
	if (!cleanLabel) return currentNotes;
	return toggleTokenInIdea(currentNotes, cleanLabel, enabled);
}
/**
* Injects a full ARCHVIZ Dictionary scenario preset summary cleanly in-place.
*/
function syncDictionaryPresetToNotes(currentNotes, presetName, blockLabels) {
	const cleanName = presetName.trim().replace(/[.]/g, "");
	const keywords = blockLabels.map((label) => label.trim().replace(/[.]/g, "")).filter(Boolean).slice(0, 4);
	return upsertClauseInIdea(currentNotes, "Scenario", keywords.length > 0 ? `${cleanName} (${keywords.join(", ")})` : cleanName);
}
/**
* Toggles an expert architectural keyword pill inside the prompt textarea cleanly.
*/
function toggleKeywordPillInNotes(currentNotes, keyword) {
	const clean = keyword.trim();
	if (!clean) return {
		notes: currentNotes,
		active: false
	};
	const currentlyActive = new RegExp(`(?:^|(?<=[.\\s,;\\n]))${escapeRegExp(clean)}(?=$|[.\\s,;\\n])`, "i").test(currentNotes);
	return {
		notes: toggleTokenInIdea(currentNotes, clean, !currentlyActive),
		active: !currentlyActive
	};
}
function buildInitialBuilderNotes(style, lighting, mood, camera) {
	let out = "";
	out = syncBuilderSlotToNotes(out, "style", style);
	out = syncBuilderSlotToNotes(out, "lighting", lighting);
	out = syncBuilderSlotToNotes(out, "mood", mood);
	out = syncBuilderSlotToNotes(out, "camera", camera);
	return out;
}
var CATEGORY_META = {
	input: {
		label: "Input",
		accent: "#e7c27a",
		badgeBg: "rgba(231, 194, 122, 0.16)",
		order: 1
	},
	segmentation: {
		label: "Segmentation",
		accent: "#38bdf8",
		badgeBg: "rgba(56, 189, 248, 0.15)",
		order: 2
	},
	editing: {
		label: "Editing",
		accent: "#fb923c",
		badgeBg: "rgba(251, 146, 60, 0.15)",
		order: 3
	},
	conditioning: {
		label: "Conditioning",
		accent: "#a78bfa",
		badgeBg: "rgba(167, 139, 250, 0.16)",
		order: 4
	},
	architecture: {
		label: "Architecture",
		accent: "#d4b06a",
		badgeBg: "rgba(212, 176, 106, 0.15)",
		order: 5
	},
	environment: {
		label: "Environment",
		accent: "#34d399",
		badgeBg: "rgba(52, 211, 153, 0.15)",
		order: 6
	},
	generation: {
		label: "Generation",
		accent: "#f472b6",
		badgeBg: "rgba(244, 114, 182, 0.15)",
		order: 7
	},
	video: {
		label: "Video",
		accent: "#c084fc",
		badgeBg: "rgba(192, 132, 252, 0.15)",
		order: 8
	},
	output: {
		label: "Output",
		accent: "#4ade80",
		badgeBg: "rgba(74, 222, 128, 0.16)",
		order: 9
	}
};
var PORT_COLORS = {
	image: "#e7c27a",
	mask: "#38bdf8",
	prompt: "#cbd5e1",
	reference: "#f472b6",
	conditioning: "#a78bfa",
	environment: "#34d399",
	scene3d: "#fbbf24",
	video: "#c084fc"
};
/**
* All 45 Architectural Node Definitions across 9 Categories (PRD §10).
* Counts: Input (5), Segmentation (5), Editing (6), Conditioning (6),
* Architecture (6), Environment (5), Generation (5), Video (4), Output (3) = 45.
*/
var NODE_CATALOG = [
	{
		type: "input.load_image",
		title: "Load Image",
		category: "input",
		summary: "Load an architectural photo, elevation, or active Studio frame.",
		keywords: [
			"Image Load",
			"Source Image",
			"Upload Image"
		],
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "image",
			label: "Image",
			type: "image"
		}],
		params: [{
			key: "source",
			label: "Sample / Source",
			kind: "select",
			defaultValue: "/viz/t03-compact-living-room.jpg",
			options: [
				"__studio_active__",
				"/viz/t03-compact-living-room.jpg",
				"/viz/p01-pavilion-day.jpg",
				"/viz/p01-pavilion-dusk.jpg",
				"/viz/t07-cultural-campus.jpg",
				"/viz/p04-courtyard-brick.jpg"
			]
		}, {
			key: "customUrl",
			label: "Override URL / Data URL",
			kind: "text",
			defaultValue: "",
			placeholder: "Optional image data URL"
		}]
	},
	{
		type: "input.load_video",
		title: "Load Video",
		category: "input",
		summary: "Ingest an existing architectural clip or keyframe sequence.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "video",
			label: "Video",
			type: "video"
		}, {
			id: "image",
			label: "First Frame",
			type: "image"
		}],
		params: [{
			key: "posterFrame",
			label: "Base Frame",
			kind: "select",
			defaultValue: "/viz/p01-pavilion-dusk.jpg",
			options: [
				"/viz/p01-pavilion-dusk.jpg",
				"/viz/p01-pavilion-day.jpg",
				"/viz/t07-cultural-campus.jpg"
			]
		}, {
			key: "fps",
			label: "Frame Rate",
			kind: "number",
			defaultValue: 24,
			min: 12,
			max: 60
		}]
	},
	{
		type: "input.text_prompt",
		title: "Text Prompt",
		category: "input",
		summary: "Author structured architectural visualization intent.",
		keywords: [
			"Prompt Modifier",
			"Architectural Prompt",
			"Text Directive"
		],
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Prompt",
			type: "prompt"
		}],
		params: [{
			key: "text",
			label: "Prompt Directive",
			kind: "textarea",
			defaultValue: "Honed travertine stone fireplace wall with warm architectural grazing light, keep room geometry intact."
		}, {
			key: "negative",
			label: "Negative",
			kind: "text",
			defaultValue: "warped walls, broken perspective, cartoon, blurry"
		}]
	},
	{
		type: "input.reference_image",
		title: "Reference Image",
		category: "input",
		summary: "Attach material, style, or lighting reference with strength sliders.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "reference",
			label: "Reference",
			type: "reference"
		}],
		params: [
			{
				key: "swatch",
				label: "Reference Swatch",
				kind: "select",
				defaultValue: "Honed Travertine",
				options: [
					"Honed Travertine",
					"Fluted White Oak",
					"Board-Formed Concrete",
					"Brushed Bronze",
					"Nordic Brick",
					"Calacatta Marble",
					"Moss & Vertical Foliage"
				]
			},
			{
				key: "materialStrength",
				label: "Material Strength %",
				kind: "slider",
				defaultValue: 70,
				min: 0,
				max: 100
			},
			{
				key: "styleStrength",
				label: "Style Strength %",
				kind: "slider",
				defaultValue: 65,
				min: 0,
				max: 100
			}
		]
	},
	{
		type: "input.load_3d_scene",
		title: "Load 3D Scene",
		category: "input",
		summary: "Pull active Oriel 3D Viewport camera, clay massing, and true solar azimuth.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "scene3d",
			label: "3D Scene",
			type: "scene3d"
		}, {
			id: "image",
			label: "Clay Pass",
			type: "image"
		}],
		params: [
			{
				key: "preset",
				label: "Massing Preset",
				kind: "select",
				defaultValue: "Courtyard Pavilion",
				options: [
					"Courtyard Pavilion",
					"Cantilever House",
					"Atrium Tower",
					"Glass Museum"
				]
			},
			{
				key: "sunAzimuth",
				label: "Sun Azimuth (°)",
				kind: "slider",
				defaultValue: 135,
				min: 0,
				max: 360
			},
			{
				key: "sunElevation",
				label: "Sun Elevation (°)",
				kind: "slider",
				defaultValue: 38,
				min: 5,
				max: 85
			}
		]
	},
	{
		type: "segmentation.auto_segment",
		title: "Auto Segment",
		category: "segmentation",
		summary: "Automatic architectural element segmentation pass.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "mask",
			label: "Mask",
			type: "mask"
		}],
		params: [{
			key: "targetClass",
			label: "Primary Region",
			kind: "select",
			defaultValue: "facade",
			options: [
				"facade",
				"wall",
				"floor",
				"ceiling",
				"glazing",
				"furniture",
				"landscape"
			]
		}, {
			key: "threshold",
			label: "Sensitivity",
			kind: "slider",
			defaultValue: 48,
			min: 15,
			max: 90
		}]
	},
	{
		type: "segmentation.point_segment",
		title: "Point Segment",
		category: "segmentation",
		summary: "SAM-2 single or multi-point coordinate segmentation.",
		keywords: [
			"Click-to-Mask",
			"Grounded-SAM 2",
			"SAM 2",
			"Interactive Mask"
		],
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "mask",
			label: "Mask",
			type: "mask"
		}],
		params: [
			{
				key: "xNorm",
				label: "Click X (0-1)",
				kind: "slider",
				defaultValue: 50,
				min: 5,
				max: 95
			},
			{
				key: "yNorm",
				label: "Click Y (0-1)",
				kind: "slider",
				defaultValue: 52,
				min: 5,
				max: 95
			},
			{
				key: "threshold",
				label: "SAM Tolerance",
				kind: "slider",
				defaultValue: 45,
				min: 15,
				max: 90
			}
		]
	},
	{
		type: "segmentation.box_segment",
		title: "Box Segment",
		category: "segmentation",
		summary: "Isolate object inside normalized bounding box.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "mask",
			label: "Mask",
			type: "mask"
		}],
		params: [
			{
				key: "label",
				label: "Box Label",
				kind: "text",
				defaultValue: "sofa or wall bay"
			},
			{
				key: "xmin",
				label: "Left %",
				kind: "slider",
				defaultValue: 20,
				min: 0,
				max: 90
			},
			{
				key: "ymin",
				label: "Top %",
				kind: "slider",
				defaultValue: 25,
				min: 0,
				max: 90
			},
			{
				key: "xmax",
				label: "Right %",
				kind: "slider",
				defaultValue: 78,
				min: 10,
				max: 100
			},
			{
				key: "ymax",
				label: "Bottom %",
				kind: "slider",
				defaultValue: 82,
				min: 10,
				max: 100
			}
		]
	},
	{
		type: "segmentation.text_select",
		title: "Text Select",
		category: "segmentation",
		summary: "Grounded-SAM 2 zero-shot natural language object mask.",
		keywords: [
			"Grounded-SAM 2",
			"Click-to-Mask",
			"Semantic Mask"
		],
		executionTarget: "hybrid",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "mask",
			label: "Mask",
			type: "mask"
		}],
		params: [{
			key: "query",
			label: "Object Query",
			kind: "text",
			defaultValue: "fireplace wall",
			placeholder: "e.g. sofa, facade cladding, window frame"
		}, {
			key: "threshold",
			label: "Edge Gate",
			kind: "slider",
			defaultValue: 46,
			min: 15,
			max: 90
		}]
	},
	{
		type: "segmentation.mask_refine",
		title: "Mask Refine",
		category: "segmentation",
		summary: "Dilate (+px) or invert binary edit mask cleanly.",
		executionTarget: "local",
		inputs: [{
			id: "mask",
			label: "Mask",
			type: "mask",
			required: true
		}],
		outputs: [{
			id: "mask",
			label: "Refined Mask",
			type: "mask"
		}],
		params: [{
			key: "dilatePx",
			label: "Expand / Feather (px)",
			kind: "slider",
			defaultValue: 4,
			min: 0,
			max: 24
		}, {
			key: "invert",
			label: "Invert Mask",
			kind: "toggle",
			defaultValue: false
		}]
	},
	{
		type: "editing.inpaint",
		title: "Inpaint",
		category: "editing",
		summary: "Masked architectural inpainting via IOPaint / AI pipeline.",
		executionTarget: "hybrid",
		inputs: [
			{
				id: "image",
				label: "Image",
				type: "image",
				required: true
			},
			{
				id: "mask",
				label: "Mask",
				type: "mask",
				required: true
			},
			{
				id: "prompt",
				label: "Prompt",
				type: "prompt"
			},
			{
				id: "conditioning",
				label: "Conditioning",
				type: "conditioning"
			}
		],
		outputs: [{
			id: "image",
			label: "Edited Image",
			type: "image"
		}],
		params: [
			{
				key: "instruction",
				label: "Edit Directive",
				kind: "textarea",
				defaultValue: "Replace masked zone with warm honed travertine stone"
			},
			{
				key: "model",
				label: "Engine Model",
				kind: "select",
				defaultValue: "lama",
				options: [
					"lama",
					"flux-fill",
					"sdxl-inpaint",
					"brushnet"
				]
			},
			{
				key: "strength",
				label: "Edit Strength %",
				kind: "slider",
				defaultValue: 78,
				min: 20,
				max: 100
			}
		]
	},
	{
		type: "editing.outpaint",
		title: "Outpaint",
		category: "editing",
		summary: "Extend architectural canvas outward cleanly.",
		executionTarget: "hybrid",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}, {
			id: "prompt",
			label: "Prompt",
			type: "prompt"
		}],
		outputs: [{
			id: "image",
			label: "Expanded Image",
			type: "image"
		}],
		params: [{
			key: "ratio",
			label: "Target Aspect",
			kind: "select",
			defaultValue: "21:9",
			options: [
				"21:9",
				"16:9",
				"9:16"
			]
		}]
	},
	{
		type: "editing.object_remove",
		title: "Object Remove",
		category: "editing",
		summary: "LaMa / MAT erase of clutter, vehicles, or staging inside mask.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}, {
			id: "mask",
			label: "Mask",
			type: "mask",
			required: true
		}],
		outputs: [{
			id: "image",
			label: "Clean Image",
			type: "image"
		}],
		params: [{
			key: "model",
			label: "Erase Kernel",
			kind: "select",
			defaultValue: "lama",
			options: [
				"lama",
				"mat",
				"migan"
			]
		}]
	},
	{
		type: "editing.object_insert",
		title: "Object Insert",
		category: "editing",
		summary: "Insert architectural entourage, seating, or luminaire inside mask.",
		executionTarget: "hybrid",
		inputs: [
			{
				id: "image",
				label: "Image",
				type: "image",
				required: true
			},
			{
				id: "mask",
				label: "Mask",
				type: "mask",
				required: true
			},
			{
				id: "reference",
				label: "Reference",
				type: "reference"
			},
			{
				id: "prompt",
				label: "Prompt",
				type: "prompt"
			}
		],
		outputs: [{
			id: "image",
			label: "Inserted Image",
			type: "image"
		}],
		params: [{
			key: "item",
			label: "Asset to Insert",
			kind: "text",
			defaultValue: "Sculptural bouclé lounge chair with oak side table"
		}]
	},
	{
		type: "editing.material_replace",
		title: "Material Replace",
		category: "editing",
		summary: "Swap surface material inside mask while locking geometry.",
		executionTarget: "hybrid",
		inputs: [
			{
				id: "image",
				label: "Image",
				type: "image",
				required: true
			},
			{
				id: "mask",
				label: "Mask",
				type: "mask",
				required: true
			},
			{
				id: "reference",
				label: "Material Ref",
				type: "reference"
			},
			{
				id: "conditioning",
				label: "Geometry Lock",
				type: "conditioning"
			},
			{
				id: "prompt",
				label: "Prompt",
				type: "prompt"
			}
		],
		outputs: [{
			id: "image",
			label: "Restyled Image",
			type: "image"
		}],
		params: [{
			key: "materialPrompt",
			label: "Target Finish",
			kind: "text",
			defaultValue: "Honed Travertine slabs with subtle directional veining"
		}, {
			key: "referenceStrength",
			label: "Material Strength %",
			kind: "slider",
			defaultValue: 75,
			min: 10,
			max: 100
		}]
	},
	{
		type: "editing.relight",
		title: "Relight",
		category: "editing",
		summary: "Transform lighting & mood using Environment or 3D sun direction.",
		executionTarget: "hybrid",
		inputs: [
			{
				id: "image",
				label: "Image",
				type: "image",
				required: true
			},
			{
				id: "environment",
				label: "Environment",
				type: "environment"
			},
			{
				id: "conditioning",
				label: "Conditioning",
				type: "conditioning"
			}
		],
		outputs: [{
			id: "image",
			label: "Relit Image",
			type: "image"
		}],
		params: [{
			key: "preset",
			label: "Relight Preset",
			kind: "select",
			defaultValue: "day-to-dusk",
			options: [
				"overcast-to-golden",
				"day-to-dusk",
				"summer-to-snow"
			]
		}]
	},
	{
		type: "conditioning.depth_map",
		title: "Depth Map",
		category: "conditioning",
		summary: "Extract Z-depth map to constrain perspective & massing.",
		keywords: [
			"ControlNet Processor",
			"ControlNet Depth",
			"Depth Conditioning"
		],
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "conditioning",
			label: "Depth Cond",
			type: "conditioning"
		}, {
			id: "image",
			label: "Depth Map",
			type: "image"
		}],
		params: [{
			key: "nearBias",
			label: "Near Contrast Bias",
			kind: "slider",
			defaultValue: 55,
			min: 10,
			max: 95
		}, {
			key: "heatmap",
			label: "Inferno Heatmap",
			kind: "toggle",
			defaultValue: true
		}]
	},
	{
		type: "conditioning.canny_edge",
		title: "Canny Edge",
		category: "conditioning",
		summary: "Crisp architectural structural edge detector.",
		keywords: [
			"ControlNet Processor",
			"ControlNet Canny",
			"Edge Conditioning"
		],
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "conditioning",
			label: "Canny Cond",
			type: "conditioning"
		}, {
			id: "image",
			label: "Edge Map",
			type: "image"
		}],
		params: [{
			key: "threshold",
			label: "Edge Sensitivity",
			kind: "slider",
			defaultValue: 60,
			min: 20,
			max: 95
		}]
	},
	{
		type: "conditioning.line_art",
		title: "Line Art",
		category: "conditioning",
		summary: "Clean ink linework / MLSD architectural stroke map.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "conditioning",
			label: "LineArt Cond",
			type: "conditioning"
		}, {
			id: "image",
			label: "Line Map",
			type: "image"
		}],
		params: [{
			key: "mode",
			label: "Extractor",
			kind: "select",
			defaultValue: "lineart",
			options: [
				"lineart",
				"mlsd",
				"softedge"
			]
		}]
	},
	{
		type: "conditioning.normal_map",
		title: "Normal Map",
		category: "conditioning",
		summary: "Tangent surface-normal vector extraction.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "conditioning",
			label: "Normal Cond",
			type: "conditioning"
		}, {
			id: "image",
			label: "Normal Map",
			type: "image"
		}],
		params: [{
			key: "strength",
			label: "Relief Weight %",
			kind: "slider",
			defaultValue: 70,
			min: 10,
			max: 100
		}]
	},
	{
		type: "conditioning.ipadapter",
		title: "IPAdapter",
		category: "conditioning",
		summary: "Bind multi-reference image into architectural style/material weights.",
		executionTarget: "local",
		inputs: [{
			id: "reference",
			label: "Reference",
			type: "reference",
			required: true
		}],
		outputs: [{
			id: "conditioning",
			label: "IPAdapter Cond",
			type: "conditioning"
		}],
		params: [{
			key: "weight",
			label: "IP-Adapter Weight %",
			kind: "slider",
			defaultValue: 72,
			min: 0,
			max: 100
		}, {
			key: "mode",
			label: "Attention Scope",
			kind: "select",
			defaultValue: "material-and-style",
			options: [
				"material-and-style",
				"material-only",
				"lighting-only"
			]
		}]
	},
	{
		type: "conditioning.geometry_lock",
		title: "Geometry Lock",
		category: "conditioning",
		summary: "Strong structural constraint (~90%) with post-run diff verification.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Source Geometry",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "conditioning",
			label: "Locked Cond",
			type: "conditioning"
		}],
		params: [{
			key: "lockWeight",
			label: "Geometry Lock %",
			kind: "slider",
			defaultValue: 90,
			min: 50,
			max: 100
		}, {
			key: "warnThresholdPct",
			label: "Drift Alert %",
			kind: "slider",
			defaultValue: 18,
			min: 5,
			max: 45
		}]
	},
	{
		type: "architecture.building_type",
		title: "Building Type",
		category: "architecture",
		summary: "Specify architectural typology & scale cues.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Program Prompt",
			type: "prompt"
		}],
		params: [{
			key: "typology",
			label: "Typology",
			kind: "select",
			defaultValue: "Contemporary Courtyard Residence",
			options: [
				"Contemporary Courtyard Residence",
				"Boutique Cultural Museum",
				"Timber Pavilion",
				"Mixed-Use Brick Loft",
				"Alpine Concrete Villa"
			]
		}]
	},
	{
		type: "architecture.room_type",
		title: "Room Type",
		category: "architecture",
		summary: "Define interior room program and furnishing grammar.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Room Prompt",
			type: "prompt"
		}],
		params: [{
			key: "room",
			label: "Room",
			kind: "select",
			defaultValue: "Double-Height Living Room",
			options: [
				"Double-Height Living Room",
				"Architectural Kitchen",
				"Minimalist Primary Suite",
				"Lobby Atrium",
				"Gallery Reading Hall"
			]
		}]
	},
	{
		type: "architecture.material_palette",
		title: "Material Palette",
		category: "architecture",
		summary: "Curated PBR architectural material specification.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "reference",
			label: "Palette Ref",
			type: "reference"
		}],
		params: [{
			key: "primary",
			label: "Primary Surface",
			kind: "select",
			defaultValue: "Honed Travertine",
			options: [
				"Honed Travertine",
				"Board-Formed Concrete",
				"Nordic Brick",
				"Fluted White Oak"
			]
		}, {
			key: "secondary",
			label: "Secondary Accent",
			kind: "select",
			defaultValue: "Brushed Bronze",
			options: [
				"Brushed Bronze",
				"Blackened Steel",
				"Low-E Curtain Glass",
				"Raw Linen"
			]
		}]
	},
	{
		type: "architecture.camera_settings",
		title: "Camera Settings",
		category: "architecture",
		summary: "2-Point tilt-shift lens, focal length, and framing rules.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Camera Prompt",
			type: "prompt"
		}],
		params: [{
			key: "focalLength",
			label: "Focal Length",
			kind: "select",
			defaultValue: "24mm Tilt-Shift",
			options: [
				"24mm Tilt-Shift",
				"35mm Eye-Level",
				"50mm Architectural Detail",
				"85mm Compression"
			]
		}, {
			key: "twoPointLock",
			label: "2-Point Vertical Lock",
			kind: "toggle",
			defaultValue: true
		}]
	},
	{
		type: "architecture.style_preset",
		title: "Style Preset",
		category: "architecture",
		summary: "Editorial ArchViz rendering aesthetic profile.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Style Prompt",
			type: "prompt"
		}],
		params: [{
			key: "style",
			label: "Render Style",
			kind: "select",
			defaultValue: "Warm Minimalist Monograph",
			options: [
				"Warm Minimalist Monograph",
				"Nordic Daylight Realism",
				"Brutalist Concrete Editorial",
				"Biophilic Courtyard"
			]
		}]
	},
	{
		type: "architecture.landscape",
		title: "Landscape",
		category: "architecture",
		summary: "Site planting, hardscape, and seasonal flora directives.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Landscape Prompt",
			type: "prompt"
		}],
		params: [{
			key: "biome",
			label: "Planting & Site",
			kind: "select",
			defaultValue: "Mediterranean Olive & Gravel Terrace",
			options: [
				"Mediterranean Olive & Gravel Terrace",
				"Pacific Northwest Ferns & Cedar",
				"Nordic Birch & Meadow",
				"Japanese Moss & Maple Courtyard"
			]
		}]
	},
	{
		type: "environment.weather",
		title: "Weather",
		category: "environment",
		summary: "Cloud deck, precipitation, and wet reflection state.",
		executionTarget: "local",
		inputs: [{
			id: "scene3d",
			label: "Optional 3D",
			type: "scene3d"
		}],
		outputs: [{
			id: "environment",
			label: "Weather Env",
			type: "environment"
		}],
		params: [{
			key: "weather",
			label: "Weather Condition",
			kind: "select",
			defaultValue: "Clear Crisp Sky",
			options: [
				"Clear Crisp Sky",
				"Soft Overcast",
				"Post-Rain Wet Pavement",
				"Light Snowfall",
				"Morning Coastal Fog"
			]
		}]
	},
	{
		type: "environment.climate",
		title: "Climate",
		category: "environment",
		summary: "Regional climate zone & seasonal daylight coloration.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "environment",
			label: "Climate Env",
			type: "environment"
		}],
		params: [{
			key: "climate",
			label: "Climate Zone",
			kind: "select",
			defaultValue: "Temperate Golden",
			options: [
				"Temperate Golden",
				"Nordic Cool Sky",
				"Arid Desert Sun",
				"Alpine Snow"
			]
		}, {
			key: "season",
			label: "Season",
			kind: "select",
			defaultValue: "Autumn",
			options: [
				"Spring",
				"Summer",
				"Autumn",
				"Winter"
			]
		}]
	},
	{
		type: "environment.sun_position",
		title: "Sun Position",
		category: "environment",
		summary: "Time-of-day solar angle (3D-verified if Load 3D Scene wired).",
		executionTarget: "local",
		inputs: [{
			id: "scene3d",
			label: "3D Sun Sync",
			type: "scene3d"
		}],
		outputs: [{
			id: "environment",
			label: "Solar Env",
			type: "environment"
		}],
		params: [{
			key: "timeOfDay",
			label: "Time of Day",
			kind: "select",
			defaultValue: "Golden Hour",
			options: [
				"Dawn",
				"Day",
				"Golden Hour",
				"Blue Hour",
				"Night"
			]
		}, {
			key: "azimuth",
			label: "Azimuth (°)",
			kind: "slider",
			defaultValue: 145,
			min: 0,
			max: 360
		}]
	},
	{
		type: "environment.mood",
		title: "Mood",
		category: "environment",
		summary: "Architectural emotional tone & interior warmth.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "environment",
			label: "Mood Env",
			type: "environment"
		}],
		params: [{
			key: "mood",
			label: "Mood Preset",
			kind: "select",
			defaultValue: "Luxury & Calm",
			options: [
				"Calm",
				"Luxury & Calm",
				"Dramatic Chiaroscuro",
				"Minimal & Airy",
				"Cozy Dusk"
			]
		}]
	},
	{
		type: "environment.atmosphere",
		title: "Atmosphere",
		category: "environment",
		summary: "Volumetric haze, air clarity, and experiential occupancy.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "environment",
			label: "Atmosphere Env",
			type: "environment"
		}],
		params: [{
			key: "experience",
			label: "Experience",
			kind: "select",
			defaultValue: "Quiet",
			options: [
				"Quiet",
				"Architectural Lived-In",
				"Evening Sanctuary",
				"Crisp Exhibition"
			]
		}, {
			key: "haze",
			label: "Atmospheric Haze %",
			kind: "slider",
			defaultValue: 18,
			min: 0,
			max: 80
		}]
	},
	{
		type: "generation.text_to_image",
		title: "Text-to-Image",
		category: "generation",
		summary: "Generate a fresh architectural concept plate from brief & style.",
		keywords: [
			"Render Engine",
			"Concept Render",
			"AI Diffusion"
		],
		executionTarget: "cloud",
		inputs: [
			{
				id: "prompt",
				label: "Prompt",
				type: "prompt",
				required: true
			},
			{
				id: "environment",
				label: "Environment",
				type: "environment"
			},
			{
				id: "conditioning",
				label: "Conditioning",
				type: "conditioning"
			}
		],
		outputs: [{
			id: "image",
			label: "Generated Image",
			type: "image"
		}],
		params: [{
			key: "aspect",
			label: "Aspect",
			kind: "select",
			defaultValue: "16:9",
			options: [
				"16:9",
				"4:3",
				"3:4",
				"1:1"
			]
		}]
	},
	{
		type: "generation.image_to_image",
		title: "Image-to-Image",
		category: "generation",
		summary: "Render photoreal materials over 3D massing or sketch conditioning.",
		keywords: [
			"Render Engine",
			"Photoreal Engine",
			"ControlNet Render"
		],
		executionTarget: "hybrid",
		inputs: [
			{
				id: "image",
				label: "Base Image",
				type: "image",
				required: true
			},
			{
				id: "conditioning",
				label: "Conditioning",
				type: "conditioning"
			},
			{
				id: "prompt",
				label: "Prompt",
				type: "prompt"
			},
			{
				id: "environment",
				label: "Environment",
				type: "environment"
			}
		],
		outputs: [{
			id: "image",
			label: "Rendered Image",
			type: "image"
		}],
		params: [{
			key: "denoise",
			label: "Transformation %",
			kind: "slider",
			defaultValue: 62,
			min: 15,
			max: 95
		}]
	},
	{
		type: "generation.upscale",
		title: "Upscale",
		category: "generation",
		summary: "2× / 4× / 8× tiled architectural texture & sharpness upscaler.",
		executionTarget: "hybrid",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "image",
			label: "Upscaled Image",
			type: "image"
		}],
		params: [{
			key: "factor",
			label: "Scale Factor",
			kind: "select",
			defaultValue: "4",
			options: [
				"2",
				"4",
				"8"
			]
		}, {
			key: "model",
			label: "Upscaler Kernel",
			kind: "select",
			defaultValue: "4x-ArchSharp",
			options: [
				"4x-ArchSharp",
				"RealESRGAN_x4plus",
				"4x-UltraSharp"
			]
		}]
	},
	{
		type: "generation.detail_enhance",
		title: "Detail Enhance",
		category: "generation",
		summary: "Synthesize crisp mortar joints, timber grain, and glass reflections.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [{
			id: "image",
			label: "Enhanced Image",
			type: "image"
		}],
		params: [{
			key: "crispness",
			label: "Micro-Grain %",
			kind: "slider",
			defaultValue: 55,
			min: 10,
			max: 100
		}]
	},
	{
		type: "generation.batch_variations",
		title: "Batch Variations",
		category: "generation",
		summary: "Generate 4 coherent architectural concept candidates.",
		executionTarget: "cloud",
		inputs: [{
			id: "image",
			label: "Base Image",
			type: "image",
			required: true
		}, {
			id: "prompt",
			label: "Prompt",
			type: "prompt"
		}],
		outputs: [{
			id: "image",
			label: "Primary Pick",
			type: "image"
		}],
		params: [{
			key: "count",
			label: "Variations",
			kind: "number",
			defaultValue: 4,
			min: 2,
			max: 4
		}]
	},
	{
		type: "video.image_to_video",
		title: "Image-to-Video",
		category: "video",
		summary: "Animate architectural still plate into smooth walkthrough clip.",
		executionTarget: "hybrid",
		inputs: [
			{
				id: "image",
				label: "Start Frame",
				type: "image",
				required: true
			},
			{
				id: "conditioning",
				label: "Depth Guide",
				type: "conditioning"
			},
			{
				id: "prompt",
				label: "Camera Motion",
				type: "prompt"
			}
		],
		outputs: [{
			id: "video",
			label: "Video Clip",
			type: "video"
		}],
		params: [{
			key: "durationSec",
			label: "Duration (s)",
			kind: "slider",
			defaultValue: 4,
			min: 2,
			max: 8
		}, {
			key: "motionKind",
			label: "Motion Fallback",
			kind: "select",
			defaultValue: "dolly-in",
			options: [
				"dolly-in",
				"pan",
				"orbit",
				"crane",
				"zoom"
			]
		}]
	},
	{
		type: "video.camera_motion",
		title: "Camera Motion",
		category: "video",
		summary: "Define dolly-in, pan, orbit, or crane trajectory.",
		executionTarget: "local",
		inputs: [],
		outputs: [{
			id: "prompt",
			label: "Motion Rig",
			type: "prompt"
		}],
		params: [{
			key: "kind",
			label: "Camera Path",
			kind: "select",
			defaultValue: "dolly-in",
			options: [
				"dolly-in",
				"pan",
				"orbit",
				"crane",
				"zoom"
			]
		}, {
			key: "speed",
			label: "Motion Ease %",
			kind: "slider",
			defaultValue: 45,
			min: 10,
			max: 100
		}]
	},
	{
		type: "video.frame_interpolation",
		title: "Frame Interpolation",
		category: "video",
		summary: "Smooth clip frame cadence up to 48/60fps motion.",
		executionTarget: "local",
		inputs: [{
			id: "video",
			label: "Video",
			type: "video",
			required: true
		}],
		outputs: [{
			id: "video",
			label: "Smooth Video",
			type: "video"
		}],
		params: [{
			key: "targetFps",
			label: "Target FPS",
			kind: "select",
			defaultValue: "30",
			options: [
				"24",
				"30",
				"48",
				"60"
			]
		}]
	},
	{
		type: "video.video_export",
		title: "Video Export",
		category: "video",
		summary: "Package walkthrough clip for download and client review.",
		executionTarget: "local",
		inputs: [{
			id: "video",
			label: "Video",
			type: "video",
			required: true
		}],
		outputs: [{
			id: "video",
			label: "Final Video",
			type: "video"
		}],
		params: [{
			key: "format",
			label: "Container",
			kind: "select",
			defaultValue: "webm",
			options: ["webm", "mp4-storyboard"]
		}]
	},
	{
		type: "output.image_preview",
		title: "Image Preview",
		category: "output",
		summary: "Inspect high-resolution rendered plate inside the graph.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [],
		params: [{
			key: "caption",
			label: "Preview Label",
			kind: "text",
			defaultValue: "Final Render Plate"
		}]
	},
	{
		type: "output.compare_versions",
		title: "Compare Versions",
		category: "output",
		summary: "Side-by-side slider + structural drift metric outside mask.",
		executionTarget: "local",
		inputs: [
			{
				id: "before",
				label: "Before Image",
				type: "image",
				required: true
			},
			{
				id: "after",
				label: "After Image",
				type: "image",
				required: true
			},
			{
				id: "mask",
				label: "Optional Mask",
				type: "mask"
			}
		],
		outputs: [],
		params: [{
			key: "driftWarnPct",
			label: "Geometry Alert %",
			kind: "slider",
			defaultValue: 18,
			min: 5,
			max: 50
		}]
	},
	{
		type: "output.save_asset",
		title: "Save Asset",
		category: "output",
		summary: "Promote result into Oriel Studio Plate & non-destructive revision vault.",
		executionTarget: "local",
		inputs: [{
			id: "image",
			label: "Image",
			type: "image",
			required: true
		}],
		outputs: [],
		params: [{
			key: "assetTitle",
			label: "Asset Name",
			kind: "text",
			defaultValue: "Node Studio Plate"
		}]
	}
];
var NODE_SPEC_MAP = Object.fromEntries(NODE_CATALOG.map((spec) => [spec.type, spec]));
function getNodeSpec(type) {
	return NODE_SPEC_MAP[type];
}
function isPortCompatible(sourceType, targetType) {
	if (sourceType === targetType) return true;
	if (sourceType === "scene3d" && (targetType === "image" || targetType === "conditioning")) return true;
	if (sourceType === "environment" && targetType === "prompt") return true;
	return false;
}
function createNodeInstance(type, position, customId, overrides) {
	const spec = getNodeSpec(type);
	const params = {};
	if (spec) for (const field of spec.params) params[field.key] = field.defaultValue;
	if (overrides) Object.assign(params, overrides);
	return {
		id: customId ?? `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
		type,
		position,
		params
	};
}
function validateWorkflowGraph(nodes, edges) {
	const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
	const issues = [];
	const nodeMap = /* @__PURE__ */ new Map();
	for (const node of nodes) {
		if (nodeMap.has(node.id)) {
			issues.push({
				severity: "error",
				nodeId: node.id,
				message: `Duplicate node id "${node.id}".`
			});
			continue;
		}
		if (!getNodeSpec(node.type)) issues.push({
			severity: "error",
			nodeId: node.id,
			message: `Unknown node type "${node.type}".`
		});
		nodeMap.set(node.id, node);
	}
	const adj = /* @__PURE__ */ new Map();
	const inDegree = /* @__PURE__ */ new Map();
	for (const node of nodes) {
		adj.set(node.id, []);
		inDegree.set(node.id, 0);
	}
	const connectedTargetPorts = /* @__PURE__ */ new Set();
	for (const edge of edges) {
		const srcNode = nodeMap.get(edge.sourceNodeId);
		const dstNode = nodeMap.get(edge.targetNodeId);
		if (!srcNode || !dstNode) {
			issues.push({
				severity: "error",
				edgeId: edge.id,
				message: `Edge "${edge.id}" references a missing node.`
			});
			continue;
		}
		if (edge.sourceNodeId === edge.targetNodeId) {
			issues.push({
				severity: "error",
				edgeId: edge.id,
				message: `Self-loop detected on node "${srcNode.type}".`
			});
			continue;
		}
		const srcSpec = getNodeSpec(srcNode.type);
		const dstSpec = getNodeSpec(dstNode.type);
		const srcPort = srcSpec?.outputs.find((p) => p.id === edge.sourcePortId);
		const dstPort = dstSpec?.inputs.find((p) => p.id === edge.targetPortId);
		if (!srcPort || !dstPort) {
			issues.push({
				severity: "error",
				edgeId: edge.id,
				message: `Invalid port wiring (${edge.sourceNodeId}.${edge.sourcePortId} -> ${edge.targetNodeId}.${edge.targetPortId}).`
			});
			continue;
		}
		if (!isPortCompatible(srcPort.type, dstPort.type)) {
			issues.push({
				severity: "error",
				edgeId: edge.id,
				message: `Incompatible port types: ${srcPort.type} cannot connect to ${dstPort.type}.`
			});
			continue;
		}
		connectedTargetPorts.add(`${dstNode.id}:${dstPort.id}`);
		adj.get(srcNode.id).push(dstNode.id);
		inDegree.set(dstNode.id, (inDegree.get(dstNode.id) ?? 0) + 1);
	}
	for (const node of nodes) {
		const spec = getNodeSpec(node.type);
		if (!spec) continue;
		for (const inputPort of spec.inputs) if (inputPort.required && !connectedTargetPorts.has(`${node.id}:${inputPort.id}`)) issues.push({
			severity: "error",
			nodeId: node.id,
			message: `"${spec.title}" is missing required "${inputPort.label}" input connection.`
		});
	}
	const queue = [];
	for (const [id, deg] of inDegree.entries()) if (deg === 0) queue.push(id);
	const executionOrder = [];
	while (queue.length > 0) {
		const current = queue.shift();
		executionOrder.push(current);
		for (const next of adj.get(current) ?? []) {
			const nextDeg = (inDegree.get(next) ?? 0) - 1;
			inDegree.set(next, nextDeg);
			if (nextDeg === 0) queue.push(next);
		}
	}
	const hasCycles = executionOrder.length < nodes.length;
	if (hasCycles) issues.push({
		severity: "error",
		message: "Cyclic graph dependency detected. Break the loop before executing."
	});
	if (nodes.length === 0) issues.push({
		severity: "warning",
		message: "Workflow canvas is empty. Add nodes or load a template."
	});
	const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
	return {
		valid: !issues.some((i) => i.severity === "error") && nodes.length > 0,
		executionOrder,
		issues,
		durationMs: Math.max(.1, Number((t1 - t0).toFixed(2))),
		hasCycles
	};
}
var COMFY_CLASS_MAP = {
	"input.load_image": "LoadImage",
	"input.load_video": "VHS_LoadVideo",
	"input.text_prompt": "CLIPTextEncode",
	"input.reference_image": "LoadImage",
	"input.load_3d_scene": "Oriel3DSceneBridge",
	"segmentation.auto_segment": "SAM2AutoSegment",
	"segmentation.point_segment": "SAM2PointSegment",
	"segmentation.box_segment": "SAM2BoxSegment",
	"segmentation.text_select": "GroundingDinoSAM2Segment",
	"segmentation.mask_refine": "GrowMask",
	"editing.inpaint": "IOPaintInpaint",
	"editing.outpaint": "ImagePadForOutpaint",
	"editing.object_remove": "LaMaErase",
	"editing.object_insert": "IOPaintObjectInsert",
	"editing.material_replace": "MaterialReplaceConditioned",
	"editing.relight": "OrielRelightPass",
	"conditioning.depth_map": "DepthAnythingV2Preprocessor",
	"conditioning.canny_edge": "CannyEdgePreprocessor",
	"conditioning.line_art": "LineArtPreprocessor",
	"conditioning.normal_map": "BAE-NormalMapPreprocessor",
	"conditioning.ipadapter": "IPAdapterUnifiedLoader",
	"conditioning.geometry_lock": "ControlNetApplyAdvanced",
	"architecture.building_type": "OrielArchitectureProgram",
	"architecture.room_type": "OrielRoomSpec",
	"architecture.material_palette": "OrielMaterialPalette",
	"architecture.camera_settings": "OrielCameraTiltShift",
	"architecture.style_preset": "OrielStylePreset",
	"architecture.landscape": "OrielLandscapeContext",
	"environment.weather": "OrielWeatherNode",
	"environment.climate": "OrielClimateNode",
	"environment.sun_position": "OrielSolarPositionNode",
	"environment.mood": "OrielMoodNode",
	"environment.atmosphere": "OrielAtmosphereNode",
	"generation.text_to_image": "KSampler",
	"generation.image_to_image": "KSamplerImg2Img",
	"generation.upscale": "ImageUpscaleWithModel",
	"generation.detail_enhance": "DetailDaemonSampler",
	"generation.batch_variations": "KSamplerBatch4",
	"video.image_to_video": "OrielImageToVideo",
	"video.camera_motion": "CameraCtrlMotionRig",
	"video.frame_interpolation": "RIFE_VFI",
	"video.video_export": "VHS_VideoCombine",
	"output.image_preview": "PreviewImage",
	"output.compare_versions": "ImageCompareDiff",
	"output.save_asset": "SaveImage"
};
function compileWorkflowToComfyJson(workflow) {
	const validation = validateWorkflowGraph(workflow.nodes, workflow.edges);
	const idToComfyId = /* @__PURE__ */ new Map();
	const orderedIds = validation.executionOrder.length === workflow.nodes.length ? validation.executionOrder : workflow.nodes.map((n) => n.id);
	orderedIds.forEach((nodeId, idx) => {
		idToComfyId.set(nodeId, String(idx + 1));
	});
	const promptGraph = {};
	for (const nodeId of orderedIds) {
		const node = workflow.nodes.find((n) => n.id === nodeId);
		if (!node) continue;
		const spec = getNodeSpec(node.type);
		const comfyId = idToComfyId.get(node.id) ?? node.id;
		const inputs = { ...node.params };
		const incoming = workflow.edges.filter((e) => e.targetNodeId === node.id);
		for (const edge of incoming) {
			const srcComfyId = idToComfyId.get(edge.sourceNodeId) ?? edge.sourceNodeId;
			const srcNode = workflow.nodes.find((n) => n.id === edge.sourceNodeId);
			const srcSpec = srcNode ? getNodeSpec(srcNode.type) : void 0;
			const outIdx = Math.max(0, srcSpec ? srcSpec.outputs.findIndex((o) => o.id === edge.sourcePortId) : 0);
			inputs[edge.targetPortId] = [srcComfyId, outIdx];
		}
		promptGraph[comfyId] = {
			class_type: COMFY_CLASS_MAP[node.type] ?? node.type,
			inputs,
			_meta: {
				title: node.label || spec?.title || node.type,
				oriel_node_id: node.id,
				category: spec?.category ?? "custom"
			}
		};
	}
	return {
		workflow_name: workflow.name,
		oriel_schema_version: "1.0.0",
		valid: validation.valid,
		prompt: promptGraph
	};
}
function buildEnvironmentDirective(params) {
	const parts = [
		params.sceneType ? `Scene: ${params.sceneType}` : null,
		params.mood ? `Mood: ${params.mood}` : null,
		params.climate ? `Climate: ${params.climate}` : null,
		params.season ? `Season: ${params.season}` : null,
		params.weather ? `Weather: ${params.weather}` : null,
		params.timeOfDay ? `Time of Day: ${params.timeOfDay}` : null,
		typeof params.azimuth === "number" ? `Solar Azimuth: ${params.azimuth}°` : null,
		params.experience ? `Experience: ${params.experience}` : null
	].filter(Boolean);
	const isIllustrative = !params.has3DSceneInput;
	const qualifier = isIllustrative ? "Illustrative AI Atmosphere Approximation (image-only input; use Load 3D Scene for physical solar shadow geometry)" : "3D-Verified Solar & Atmospheric Lighting Study";
	return {
		directive: `${parts.join(" · ")}. [${qualifier}]`,
		isIllustrative
	};
}
function autoLayoutGraph(nodes, edges) {
	if (nodes.length === 0) return nodes;
	const validation = validateWorkflowGraph(nodes, edges);
	const depthMap = /* @__PURE__ */ new Map();
	for (const n of nodes) depthMap.set(n.id, 0);
	const order = validation.executionOrder.length > 0 ? validation.executionOrder : nodes.map((n) => n.id);
	for (const nodeId of order) {
		const incoming = edges.filter((e) => e.targetNodeId === nodeId);
		let maxParent = -1;
		for (const e of incoming) maxParent = Math.max(maxParent, depthMap.get(e.sourceNodeId) ?? 0);
		depthMap.set(nodeId, maxParent + 1);
	}
	const columns = /* @__PURE__ */ new Map();
	for (const n of nodes) {
		const col = depthMap.get(n.id) ?? 0;
		const list = columns.get(col) ?? [];
		list.push(n);
		columns.set(col, list);
	}
	const colWidth = 310;
	const rowHeight = 200;
	const posMap = /* @__PURE__ */ new Map();
	for (const [col, list] of columns.entries()) list.forEach((n, idx) => {
		posMap.set(n.id, {
			x: 60 + col * colWidth,
			y: 60 + idx * rowHeight
		});
	});
	return nodes.map((n) => ({
		...n,
		position: posMap.get(n.id) ?? n.position
	}));
}
var WORKFLOW_TEMPLATES = [
	{
		id: "tpl-masked-material-replace",
		name: "Masked Material Replace",
		description: "PRD MVP Gate: Grounded-SAM 2 text select + Mask Refine + Reference Material + Geometry Lock -> Material Replace -> Compare Versions.",
		templateId: "tpl-masked-material-replace",
		updatedAt: 17315424e5,
		nodes: [
			createNodeInstance("input.load_image", {
				x: 50,
				y: 70
			}, "n-img", { source: "/viz/t03-compact-living-room.jpg" }),
			createNodeInstance("input.reference_image", {
				x: 50,
				y: 310
			}, "n-ref", {
				swatch: "Honed Travertine",
				materialStrength: 75,
				styleStrength: 60
			}),
			createNodeInstance("segmentation.text_select", {
				x: 360,
				y: 70
			}, "n-sam", {
				query: "fireplace wall",
				threshold: 46
			}),
			createNodeInstance("conditioning.geometry_lock", {
				x: 360,
				y: 290
			}, "n-geo", {
				lockWeight: 90,
				warnThresholdPct: 18
			}),
			createNodeInstance("segmentation.mask_refine", {
				x: 670,
				y: 70
			}, "n-refine", {
				dilatePx: 4,
				invert: false
			}),
			createNodeInstance("editing.material_replace", {
				x: 980,
				y: 150
			}, "n-replace", {
				materialPrompt: "Honed travertine limestone slabs with warm architectural grazing light",
				referenceStrength: 78
			}),
			createNodeInstance("output.compare_versions", {
				x: 1300,
				y: 70
			}, "n-compare", { driftWarnPct: 18 }),
			createNodeInstance("output.save_asset", {
				x: 1300,
				y: 290
			}, "n-save", { assetTitle: "Living Room Travertine Revision" })
		],
		edges: [
			{
				id: "e1",
				sourceNodeId: "n-img",
				sourcePortId: "image",
				targetNodeId: "n-sam",
				targetPortId: "image"
			},
			{
				id: "e2",
				sourceNodeId: "n-img",
				sourcePortId: "image",
				targetNodeId: "n-geo",
				targetPortId: "image"
			},
			{
				id: "e3",
				sourceNodeId: "n-sam",
				sourcePortId: "mask",
				targetNodeId: "n-refine",
				targetPortId: "mask"
			},
			{
				id: "e4",
				sourceNodeId: "n-img",
				sourcePortId: "image",
				targetNodeId: "n-replace",
				targetPortId: "image"
			},
			{
				id: "e5",
				sourceNodeId: "n-refine",
				sourcePortId: "mask",
				targetNodeId: "n-replace",
				targetPortId: "mask"
			},
			{
				id: "e6",
				sourceNodeId: "n-ref",
				sourcePortId: "reference",
				targetNodeId: "n-replace",
				targetPortId: "reference"
			},
			{
				id: "e7",
				sourceNodeId: "n-geo",
				sourcePortId: "conditioning",
				targetNodeId: "n-replace",
				targetPortId: "conditioning"
			},
			{
				id: "e8",
				sourceNodeId: "n-img",
				sourcePortId: "image",
				targetNodeId: "n-compare",
				targetPortId: "before"
			},
			{
				id: "e9",
				sourceNodeId: "n-replace",
				sourcePortId: "image",
				targetNodeId: "n-compare",
				targetPortId: "after"
			},
			{
				id: "e10",
				sourceNodeId: "n-refine",
				sourcePortId: "mask",
				targetNodeId: "n-compare",
				targetPortId: "mask"
			},
			{
				id: "e11",
				sourceNodeId: "n-replace",
				sourcePortId: "image",
				targetNodeId: "n-save",
				targetPortId: "image"
			}
		]
	},
	{
		id: "tpl-3d-to-photoreal",
		name: "3D & Line Art -> Photoreal Render",
		description: "Multi-conditioned architectural pipeline combining 3D clay massing, Z-Depth, and architectural typology into a crisp 4× upscaled render.",
		templateId: "tpl-3d-to-photoreal",
		updatedAt: 17315424e5,
		nodes: [
			createNodeInstance("input.load_3d_scene", {
				x: 50,
				y: 120
			}, "n-3d", {
				preset: "Courtyard Pavilion",
				sunAzimuth: 135,
				sunElevation: 38
			}),
			createNodeInstance("architecture.building_type", {
				x: 50,
				y: 340
			}, "n-bldg", { typology: "Contemporary Courtyard Residence" }),
			createNodeInstance("conditioning.depth_map", {
				x: 370,
				y: 60
			}, "n-depth", {
				nearBias: 55,
				heatmap: true
			}),
			createNodeInstance("conditioning.canny_edge", {
				x: 370,
				y: 270
			}, "n-canny", { threshold: 62 }),
			createNodeInstance("generation.image_to_image", {
				x: 700,
				y: 150
			}, "n-i2i", { denoise: 62 }),
			createNodeInstance("generation.upscale", {
				x: 1010,
				y: 150
			}, "n-up", {
				factor: "4",
				model: "4x-ArchSharp"
			}),
			createNodeInstance("output.image_preview", {
				x: 1320,
				y: 150
			}, "n-prev", { caption: "4× Photoreal Pavilion" })
		],
		edges: [
			{
				id: "e2-1",
				sourceNodeId: "n-3d",
				sourcePortId: "image",
				targetNodeId: "n-depth",
				targetPortId: "image"
			},
			{
				id: "e2-2",
				sourceNodeId: "n-3d",
				sourcePortId: "image",
				targetNodeId: "n-canny",
				targetPortId: "image"
			},
			{
				id: "e2-3",
				sourceNodeId: "n-3d",
				sourcePortId: "image",
				targetNodeId: "n-i2i",
				targetPortId: "image"
			},
			{
				id: "e2-4",
				sourceNodeId: "n-depth",
				sourcePortId: "conditioning",
				targetNodeId: "n-i2i",
				targetPortId: "conditioning"
			},
			{
				id: "e2-5",
				sourceNodeId: "n-bldg",
				sourcePortId: "prompt",
				targetNodeId: "n-i2i",
				targetPortId: "prompt"
			},
			{
				id: "e2-6",
				sourceNodeId: "n-i2i",
				sourcePortId: "image",
				targetNodeId: "n-up",
				targetPortId: "image"
			},
			{
				id: "e2-7",
				sourceNodeId: "n-up",
				sourcePortId: "image",
				targetNodeId: "n-prev",
				targetPortId: "image"
			}
		]
	},
	{
		id: "tpl-climate-relight",
		name: "Climate & Moody Relight",
		description: "Environment-driven architectural atmosphere shift preserving facade lines while updating sun angle, sky dome, and interior practical glow.",
		templateId: "tpl-climate-relight",
		updatedAt: 17315424e5,
		nodes: [
			createNodeInstance("input.load_image", {
				x: 50,
				y: 100
			}, "n-r-img", { source: "/viz/p01-pavilion-day.jpg" }),
			createNodeInstance("environment.sun_position", {
				x: 50,
				y: 310
			}, "n-r-sun", {
				timeOfDay: "Blue Hour",
				azimuth: 225
			}),
			createNodeInstance("conditioning.geometry_lock", {
				x: 370,
				y: 80
			}, "n-r-geo", { lockWeight: 92 }),
			createNodeInstance("editing.relight", {
				x: 700,
				y: 170
			}, "n-r-relight", { preset: "day-to-dusk" }),
			createNodeInstance("output.compare_versions", {
				x: 1020,
				y: 170
			}, "n-r-cmp", { driftWarnPct: 18 })
		],
		edges: [
			{
				id: "e3-1",
				sourceNodeId: "n-r-img",
				sourcePortId: "image",
				targetNodeId: "n-r-geo",
				targetPortId: "image"
			},
			{
				id: "e3-2",
				sourceNodeId: "n-r-img",
				sourcePortId: "image",
				targetNodeId: "n-r-relight",
				targetPortId: "image"
			},
			{
				id: "e3-3",
				sourceNodeId: "n-r-sun",
				sourcePortId: "environment",
				targetNodeId: "n-r-relight",
				targetPortId: "environment"
			},
			{
				id: "e3-4",
				sourceNodeId: "n-r-geo",
				sourcePortId: "conditioning",
				targetNodeId: "n-r-relight",
				targetPortId: "conditioning"
			},
			{
				id: "e3-5",
				sourceNodeId: "n-r-img",
				sourcePortId: "image",
				targetNodeId: "n-r-cmp",
				targetPortId: "before"
			},
			{
				id: "e3-6",
				sourceNodeId: "n-r-relight",
				sourcePortId: "image",
				targetNodeId: "n-r-cmp",
				targetPortId: "after"
			}
		]
	},
	{
		id: "tpl-video-walkthrough",
		name: "Architectural Video Walkthrough",
		description: "Convert an architectural render into a depth-guided dolly-in client walkthrough clip with frame interpolation and WebM export.",
		templateId: "tpl-video-walkthrough",
		updatedAt: 17315424e5,
		nodes: [
			createNodeInstance("input.load_image", {
				x: 50,
				y: 80
			}, "n-v-img", { source: "/viz/p01-pavilion-dusk.jpg" }),
			createNodeInstance("video.camera_motion", {
				x: 50,
				y: 310
			}, "n-v-cam", {
				kind: "dolly-in",
				speed: 45
			}),
			createNodeInstance("conditioning.depth_map", {
				x: 360,
				y: 80
			}, "n-v-depth", {
				nearBias: 50,
				heatmap: false
			}),
			createNodeInstance("video.image_to_video", {
				x: 690,
				y: 160
			}, "n-v-i2v", {
				durationSec: 4,
				motionKind: "dolly-in"
			}),
			createNodeInstance("video.frame_interpolation", {
				x: 1e3,
				y: 160
			}, "n-v-interp", { targetFps: "30" }),
			createNodeInstance("video.video_export", {
				x: 1310,
				y: 160
			}, "n-v-exp", { format: "webm" })
		],
		edges: [
			{
				id: "e4-1",
				sourceNodeId: "n-v-img",
				sourcePortId: "image",
				targetNodeId: "n-v-depth",
				targetPortId: "image"
			},
			{
				id: "e4-2",
				sourceNodeId: "n-v-img",
				sourcePortId: "image",
				targetNodeId: "n-v-i2v",
				targetPortId: "image"
			},
			{
				id: "e4-3",
				sourceNodeId: "n-v-depth",
				sourcePortId: "conditioning",
				targetNodeId: "n-v-i2v",
				targetPortId: "conditioning"
			},
			{
				id: "e4-4",
				sourceNodeId: "n-v-cam",
				sourcePortId: "prompt",
				targetNodeId: "n-v-i2v",
				targetPortId: "prompt"
			},
			{
				id: "e4-5",
				sourceNodeId: "n-v-i2v",
				sourcePortId: "video",
				targetNodeId: "n-v-interp",
				targetPortId: "video"
			},
			{
				id: "e4-6",
				sourceNodeId: "n-v-interp",
				sourcePortId: "video",
				targetNodeId: "n-v-exp",
				targetPortId: "video"
			}
		]
	},
	{
		id: "tpl-controlnet-render",
		name: "Studio Orchestration: Load → ControlNet → Prompt → Render",
		description: "Connects Image Load, Canny ControlNet Processor, Prompt Modifier, and Image-to-Image Render Engine for structure-locked visualization.",
		templateId: "tpl-controlnet-render",
		updatedAt: 17315424e5,
		nodes: [
			createNodeInstance("input.load_image", {
				x: 40,
				y: 100
			}, "n-c-img", { source: "/viz/t03-compact-living-room.jpg" }),
			createNodeInstance("input.text_prompt", {
				x: 40,
				y: 310
			}, "n-c-prompt", { text: "Warm minimalist honed travertine wall cladding, brushed bronze mullions, soft daylight." }),
			createNodeInstance("conditioning.canny_edge", {
				x: 360,
				y: 80
			}, "n-c-ctrl", { threshold: 62 }),
			createNodeInstance("generation.image_to_image", {
				x: 690,
				y: 170
			}, "n-c-render", { denoise: 58 }),
			createNodeInstance("output.image_preview", {
				x: 1010,
				y: 170
			}, "n-c-out", { caption: "ControlNet Render Output" })
		],
		edges: [
			{
				id: "e5-1",
				sourceNodeId: "n-c-img",
				sourcePortId: "image",
				targetNodeId: "n-c-ctrl",
				targetPortId: "image"
			},
			{
				id: "e5-2",
				sourceNodeId: "n-c-img",
				sourcePortId: "image",
				targetNodeId: "n-c-render",
				targetPortId: "image"
			},
			{
				id: "e5-3",
				sourceNodeId: "n-c-ctrl",
				sourcePortId: "conditioning",
				targetNodeId: "n-c-render",
				targetPortId: "conditioning"
			},
			{
				id: "e5-4",
				sourceNodeId: "n-c-prompt",
				sourcePortId: "prompt",
				targetNodeId: "n-c-render",
				targetPortId: "prompt"
			},
			{
				id: "e5-5",
				sourceNodeId: "n-c-render",
				sourcePortId: "image",
				targetNodeId: "n-c-out",
				targetPortId: "image"
			}
		]
	}
];
function cloneWorkflow(workflow) {
	return {
		...workflow,
		nodes: workflow.nodes.map((n) => ({
			...n,
			position: { ...n.position },
			params: { ...n.params }
		})),
		edges: workflow.edges.map((e) => ({ ...e }))
	};
}
function matchesNodeSearch(spec, query) {
	const q = query.trim().toLowerCase();
	if (!q) return true;
	if (spec.title.toLowerCase().includes(q) || spec.summary.toLowerCase().includes(q) || spec.category.toLowerCase().includes(q) || spec.type.toLowerCase().includes(q)) return true;
	return Boolean(spec.keywords?.some((kw) => kw.toLowerCase().includes(q)));
}
var MONTH_NAMES = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
function formatSolarTime(timeOfDay) {
	const clamped = (timeOfDay % 24 + 24) % 24;
	const totalMinutes = Math.round(clamped * 60) % 1440;
	const hh = Math.floor(totalMinutes / 60);
	const mm = totalMinutes % 60;
	return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
/**
* Computes physical solar azimuth, altitude, Three.js directional `sunPosition` vector,
* atmospheric sky colors, shadow rig intensities, and reflection dome parameters from
* Time of Day (0-24h) and Month (1-12).
*/
function computeSolarRigState(params) {
	const timeOfDay = Math.max(0, Math.min(24, Number.isFinite(params.timeOfDay) ? params.timeOfDay : 14.5));
	const month = Math.max(1, Math.min(12, Math.round(Number.isFinite(params.month) ? params.month : 6)));
	const latitudeDeg = Math.max(-65, Math.min(65, Number.isFinite(params.latitude) ? params.latitude : 37.8));
	const radius = Math.max(8, params.radius ?? 26);
	const lat = latitudeDeg * Math.PI / 180;
	const dayOfYear = Math.max(1, Math.min(365, (month - 1) * 30.4 + 15));
	const declination = 23.44 * Math.PI / 180 * Math.sin(2 * Math.PI / 365 * (dayOfYear - 81));
	const hourAngle = (timeOfDay - 12) * 15 * Math.PI / 180;
	const sinEl = Math.sin(lat) * Math.sin(declination) + Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle);
	const elRad = Math.asin(Math.max(-.99, Math.min(.99, sinEl)));
	const rawElevationDeg = Number((elRad * 180 / Math.PI).toFixed(2));
	const cosAz = (Math.sin(declination) - Math.sin(lat) * Math.sin(elRad)) / (Math.cos(lat) * Math.max(.05, Math.cos(elRad)));
	let azDeg = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI;
	if (timeOfDay > 12) azDeg = 360 - azDeg;
	const azimuthDeg = Math.round((azDeg % 360 + 360) % 360);
	const effectiveElDeg = Math.max(4, Math.min(84, rawElevationDeg));
	const azRad = azimuthDeg * Math.PI / 180;
	const effElRad = effectiveElDeg * Math.PI / 180;
	const cosEffEl = Math.cos(effElRad);
	const x = Number((Math.sin(azRad) * cosEffEl * radius).toFixed(3));
	const y = Number((Math.sin(effElRad) * radius).toFixed(3));
	const z = Number((Math.cos(azRad) * cosEffEl * radius).toFixed(3));
	const isDaylight = rawElevationDeg > 0;
	const phase = rawElevationDeg <= -4 ? "Midnight / Night" : rawElevationDeg <= 4 ? timeOfDay < 12 ? "Dawn Twilight" : "Dusk Twilight" : rawElevationDeg <= 22 ? timeOfDay < 12 ? "Morning Golden" : "Evening Golden" : "Solar Daylight";
	let sunHex = "#fff7e8";
	let skyHex = "#dde6ef";
	let zenithHex = "#3b6fa8";
	let horizonHex = "#f4eee2";
	let groundBounceHex = "#6c6252";
	let sunIntensity = 2.4;
	let ambientIntensity = .86;
	let rimIntensity = .42;
	let envIntensity = 1;
	let interiorGlowIntensity = .42;
	if (phase === "Midnight / Night") {
		sunHex = "#8bb4ff";
		skyHex = "#0f1726";
		zenithHex = "#070c17";
		horizonHex = "#1e2e49";
		groundBounceHex = "#141821";
		sunIntensity = .45;
		ambientIntensity = .28;
		rimIntensity = .34;
		envIntensity = .55;
		interiorGlowIntensity = 2.1;
	} else if (phase === "Dawn Twilight" || phase === "Dusk Twilight") {
		sunHex = phase === "Dawn Twilight" ? "#ffad7a" : "#ff8f52";
		skyHex = "#243652";
		zenithHex = "#17253d";
		horizonHex = phase === "Dawn Twilight" ? "#e89c78" : "#df7e52";
		groundBounceHex = "#342d26";
		sunIntensity = 1.05;
		ambientIntensity = .52;
		rimIntensity = .58;
		envIntensity = .85;
		interiorGlowIntensity = 1.55;
	} else if (phase === "Morning Golden" || phase === "Evening Golden") {
		sunHex = "#ffd196";
		skyHex = "#cad5e3";
		zenithHex = "#35588a";
		horizonHex = "#f2ba82";
		groundBounceHex = "#5e5042";
		sunIntensity = 1.9;
		ambientIntensity = .72;
		rimIntensity = .48;
		envIntensity = 1.05;
		interiorGlowIntensity = .92;
	} else {
		const zenithFactor = Math.min(1, Math.max(0, (rawElevationDeg - 22) / 50));
		sunHex = zenithFactor > .55 ? "#fffaf0" : "#ffefd6";
		skyHex = zenithFactor > .55 ? "#e1eaf3" : "#d8e3ee";
		zenithHex = zenithFactor > .55 ? "#2e65a3" : "#4476ab";
		horizonHex = "#f4efe4";
		groundBounceHex = "#6c6252";
		sunIntensity = Number((2.1 + zenithFactor * .55).toFixed(2));
		ambientIntensity = Number((.78 + zenithFactor * .14).toFixed(2));
		rimIntensity = .42;
		envIntensity = Number((1 + zenithFactor * .15).toFixed(2));
		interiorGlowIntensity = .4;
	}
	return {
		timeOfDay: Number(timeOfDay.toFixed(2)),
		month,
		latitude: Number(latitudeDeg.toFixed(1)),
		azimuthDeg,
		elevationDeg: Math.round(effectiveElDeg),
		rawElevationDeg,
		sunPosition: {
			x,
			y,
			z
		},
		phase,
		isDaylight,
		formattedTime: formatSolarTime(timeOfDay),
		monthLabel: MONTH_NAMES[month - 1] ?? "Jun",
		sunHex,
		skyHex,
		zenithHex,
		horizonHex,
		groundBounceHex,
		sunIntensity,
		ambientIntensity,
		rimIntensity,
		envIntensity,
		interiorGlowIntensity
	};
}
var INSPECTOR_PBR_SWATCHES = [
	{
		id: "board-formed-concrete",
		shortKey: "concrete",
		label: "Concrete",
		category: "Canonical",
		color: 11841704,
		hex: "#b4b0a8",
		roughness: .82,
		metalness: .04,
		clearcoat: 0,
		opacity: 1,
		transparent: false
	},
	{
		id: "fluted-oak",
		shortKey: "oak",
		label: "Oak",
		category: "Canonical",
		color: 12093014,
		hex: "#b88656",
		roughness: .62,
		metalness: .03,
		clearcoat: .08,
		opacity: 1,
		transparent: false
	},
	{
		id: "low-e-glass",
		shortKey: "glass",
		label: "Glass",
		category: "Canonical",
		color: 13361891,
		hex: "#cbe2e3",
		roughness: .06,
		metalness: .14,
		clearcoat: 1,
		opacity: .44,
		transparent: true
	},
	{
		id: "anodized-aluminum",
		shortKey: "aluminum",
		label: "Anodized Alum",
		category: "Architectural",
		color: 3882562,
		hex: "#3b3e42",
		roughness: .26,
		metalness: .88,
		clearcoat: .15,
		opacity: 1,
		transparent: false
	},
	{
		id: "honed-travertine",
		shortKey: "travertine",
		label: "Honed Travertine",
		category: "Architectural",
		color: 14865854,
		hex: "#e2d5be",
		roughness: .6,
		metalness: .02,
		clearcoat: 0,
		opacity: 1,
		transparent: false
	},
	{
		id: "nordic-brick",
		shortKey: "brick",
		label: "Nordic Brick",
		category: "Architectural",
		color: 10049862,
		hex: "#995946",
		roughness: .86,
		metalness: .02,
		clearcoat: 0,
		opacity: 1,
		transparent: false
	},
	{
		id: "brushed-bronze",
		shortKey: "bronze",
		label: "Brushed Bronze",
		category: "Architectural",
		color: 9400135,
		hex: "#8f6f47",
		roughness: .28,
		metalness: .84,
		clearcoat: .12,
		opacity: 1,
		transparent: false
	},
	{
		id: "standing-seam-zinc",
		shortKey: "zinc",
		label: "Patina Zinc",
		category: "Architectural",
		color: 6449003,
		hex: "#62676b",
		roughness: .42,
		metalness: .72,
		clearcoat: 0,
		opacity: 1,
		transparent: false
	}
];
function createAssignmentFromSwatch(objectId, objectLabel, materialId, now = Date.now()) {
	const cleanId = objectId.trim();
	if (!cleanId) return null;
	const spec = INSPECTOR_PBR_SWATCHES.find((s) => s.id === materialId);
	if (!spec) return null;
	return {
		objectId: cleanId,
		objectLabel: objectLabel.trim() || cleanId,
		materialId: spec.id,
		materialLabel: spec.label,
		hex: spec.hex,
		roughness: spec.roughness,
		metalness: spec.metalness,
		clearcoat: spec.clearcoat,
		opacity: spec.opacity,
		transparent: spec.transparent,
		updatedAt: now
	};
}
/**
* CRUD Create / Replace assignment keyed by semantic objectId.
*/
function upsertMaterialAssignment(list, entry) {
	if (list.findIndex((item) => item.objectId === entry.objectId) === -1) return [entry, ...list].slice(0, 64);
	return list.map((item) => item.objectId === entry.objectId ? { ...entry } : item);
}
/**
* CRUD Read assignment for a specific objectId.
*/
function getMaterialAssignment(list, objectId) {
	if (!objectId) return null;
	return list.find((item) => item.objectId === objectId) ?? null;
}
/**
* CRUD Update roughness, metalness, hex color, opacity, or preset on an existing assignment.
*/
function updateMaterialAssignmentProps(list, objectId, patch, now = Date.now()) {
	return list.map((item) => {
		if (item.objectId !== objectId) return item;
		return {
			...item,
			...patch,
			roughness: typeof patch.roughness === "number" && Number.isFinite(patch.roughness) ? Math.max(.02, Math.min(1, Number(patch.roughness.toFixed(2)))) : item.roughness,
			metalness: typeof patch.metalness === "number" && Number.isFinite(patch.metalness) ? Math.max(0, Math.min(1, Number(patch.metalness.toFixed(2)))) : item.metalness,
			clearcoat: typeof patch.clearcoat === "number" && Number.isFinite(patch.clearcoat) ? Math.max(0, Math.min(1, Number(patch.clearcoat.toFixed(2)))) : item.clearcoat,
			opacity: typeof patch.opacity === "number" && Number.isFinite(patch.opacity) ? Math.max(.1, Math.min(1, Number(patch.opacity.toFixed(2)))) : item.opacity,
			updatedAt: now
		};
	});
}
/**
* CRUD Delete assignment for an objectId.
*/
function removeMaterialAssignment(list, objectId) {
	return list.filter((item) => item.objectId !== objectId);
}
var ARCHITECTURAL_STYLES = [
	{
		id: "japandi-minimalist",
		category: "style",
		name: "Japandi Warm Minimalism",
		tagline: "Natural white oak, hand-troweled plaster, paper shoji accents",
		description: "Harmonious blend of Scandinavian functional simplicity and Japanese wabi-sabi reverence for natural materials, quiet proportions, and uncluttered spatial breathing room.",
		promptSnippet: "Japandi architectural aesthetic, bespoke rift-cut white oak joinery, seamless warm off-white lime wash walls, textured linen drapery, low-profile sculptural furniture, delicate paper shoji-inspired accents, wabi-sabi subtle organic texture",
		materials: [
			"Rift-cut white oak",
			"Hand-troweled lime plaster",
			"Raw Belgian linen",
			"Fluted glass"
		],
		swatches: [
			"#e4d8c5",
			"#c6b092",
			"#7f6e5d",
			"#2b2520"
		],
		image: "/viz/p02-loft-after.jpg"
	},
	{
		id: "minimalist-concrete-glass",
		category: "style",
		name: "Minimalist Concrete & Glass",
		tagline: "Tadao Ando inspired silk-smooth concrete and reflecting water",
		description: "Geometric purity with architectural concrete walls, precision form-tie impressions, floor-to-ceiling recessed glass walls, and razor-thin cantilevered roof planes floating over calm water.",
		promptSnippet: "Minimalist modern pavilion, architectural smooth fair-faced concrete with form-tie holes, razor-thin cantilevered flat roof plane, floor-to-ceiling ultra-clear glass curtain wall, calm reflecting pool with granite stepping stones",
		materials: [
			"Fair-faced architectural concrete",
			"Low-iron structural glass",
			"Flamed black granite",
			"Smoked zinc trim"
		],
		swatches: [
			"#b8b9ba",
			"#8d9093",
			"#3a3c3e",
			"#1b1d1f"
		],
		image: "/viz/p01-pavilion-day.jpg"
	},
	{
		id: "brutalist-sculptural",
		category: "style",
		name: "Sculptural Brutalism",
		tagline: "Board-marked concrete, deep recessed apertures, monumental massing",
		description: "Bold monolithic volumes with textured board-marked concrete, deep shadow-casting reveals, geometric cantilevers, and dramatic angular light-wells.",
		promptSnippet: "Sculptural brutalist architecture, textured board-formed architectural concrete with rough wood grain impressions, deep-set punched window apertures, heavy cantilevered volumes, dramatic geometric reveals, monolithic weight",
		materials: [
			"Board-formed concrete",
			"Weathering Corten steel",
			"Cast bronze hardware",
			"Raw basalt stone"
		],
		swatches: [
			"#9a9893",
			"#6c6963",
			"#7a4627",
			"#2e2b27"
		],
		image: "/viz/t08-material-junction.jpg"
	},
	{
		id: "contemporary-tropical",
		category: "style",
		name: "Contemporary Biophilic Tropical",
		tagline: "Deep shaded eaves, volcanic stone, permeable timber louvers",
		description: "Architecture dissolved into lush subtropical landscaping with deep cantilevered overhangs, operable teak batten screens, volcanic stone terraces, and indoor-outdoor breezeways.",
		promptSnippet: "Contemporary biophilic tropical residence, deep protective roof eaves, horizontal teak timber battens, dark volcanic basalt stone foundation, open-air pavilion transition, lush tropical flora, rainwater runnels",
		materials: [
			"Weathered teak",
			"Honed volcanic basalt",
			"Charcoal aluminum mullions",
			"Polished terrazzo"
		],
		swatches: [
			"#a07855",
			"#4a453f",
			"#2f3e2b",
			"#ded6cb"
		],
		image: "/viz/t05-subtropical-home.jpg"
	},
	{
		id: "nordic-timber-civic",
		category: "style",
		name: "Nordic Mass Timber & Brick",
		tagline: "Cross-laminated timber, tactile brickwork, generous civic daylight",
		description: "Warm public and residential architecture featuring exposed glulam beams, pale Douglas fir ceilings, soft textural brickwork, and double-height light shafts.",
		promptSnippet: "Nordic contemporary architecture, exposed glulam timber structure, pale Douglas fir slatted ceiling, tactile Petersen-style textural clay brickwork, slender steel window profiles, generous double-height volume",
		materials: [
			"Douglas fir glulam",
			"Long-format tactile brick",
			"Natural zinc roofing",
			"Micro-cement floor"
		],
		swatches: [
			"#d9b88f",
			"#ab6b51",
			"#787671",
			"#33312e"
		],
		image: "/viz/t01-public-library.jpg"
	},
	{
		id: "industrial-heritage-reuse",
		category: "style",
		name: "Industrial Heritage Adaptive Reuse",
		tagline: "Exposed historical brick, blackened steel trusses, fluted partitions",
		description: "Warehouse conversion honoring original industrial patina with sandblasted brick, exposed steel framework, custom steel-framed glazing, and warm bespoke architectural inserts.",
		promptSnippet: "Industrial heritage warehouse conversion, sandblasted original red brick walls, exposed blackened structural steel I-beams and timber trusses, crittall black steel-framed windows, refined fluted glass partitions, polished aggregate concrete floor",
		materials: [
			"Restored red brick",
			"Blackened mild steel",
			"Reclaimed timber joists",
			"Wire-cast glass"
		],
		swatches: [
			"#8b4534",
			"#2c2a29",
			"#c4b5a0",
			"#5c554e"
		],
		image: "/viz/p02-loft-before.jpg"
	}
];
var LIGHTING_CONDITIONS = [
	{
		id: "blue-hour-twilight",
		category: "lighting",
		name: "Blue-Hour Twilight",
		tagline: "Deep cobalt sky, warm interior cove glow, specular water reflections",
		description: "The cinematic stillness just after sunset where the sky turns rich deep sapphire, balanced precisely against warm 2700K architectural interior lighting glowing through glazed facades.",
		promptSnippet: "Blue hour twilight photography, deep rich cobalt blue sky, soft residual horizon luminescence, warm incandescent 2700K interior wash glowing through glass, exterior pathway step lights, specular water reflections",
		materials: [
			"2700K warm LED grazing",
			"Deep cobalt ambient sky",
			"Glinting water highlights"
		],
		swatches: [
			"#14253d",
			"#24426b",
			"#eec07b",
			"#f7dd9f"
		],
		image: "/viz/p01-pavilion-dusk.jpg"
	},
	{
		id: "golden-hour-raking",
		category: "lighting",
		name: "Golden Hour Raking Sun",
		tagline: "Low warm amber sunlight, elongated soft shadows, architectural relief",
		description: "Low-angle sunlight grazing across building facades and interior floors, accentuating surface textures, casting long dramatic shadows, and filling spaces with warm amber warmth.",
		promptSnippet: "Late afternoon golden hour sunlight, low sun angle raking across textured surfaces, long dramatic soft-edged shadows, warm golden amber illumination, atmospheric volumetric light beams, soft specular highlights",
		materials: [
			"Low raking sun (1800K-3000K)",
			"Long soft shadows",
			"Volumetric dust motes"
		],
		swatches: [
			"#df983a",
			"#e9bb67",
			"#844719",
			"#301d11"
		],
		image: "/viz/t10-home-dusk-edit.jpg"
	},
	{
		id: "soft-overcast-diffused",
		category: "lighting",
		name: "Soft Overcast Nordic Light",
		tagline: "Shadowless cloud canopy, true material color rendering, calm reflectance",
		description: "High soft cloud layer acting as an immense natural softbox. Eliminates harsh specular glare, allows true material colors and subtle tonal gradients to read with absolute clarity.",
		promptSnippet: "Soft overcast daylight, even diffused sky illumination, subtle soft ambient occlusion in corners, no harsh shadows, true-to-life neutral material color fidelity, clean calm architectural photography",
		materials: [
			"5500K neutral diffused daylight",
			"Soft ambient occlusion",
			"Gentle matte bounce"
		],
		swatches: [
			"#cfd3d6",
			"#9ea3a8",
			"#6c7277",
			"#3b3e41"
		],
		image: "/viz/p01-pavilion-day.jpg"
	},
	{
		id: "dramatic-chiaroscuro",
		category: "lighting",
		name: "Dramatic Chiaroscuro & Light Shafts",
		tagline: "High contrast single aperture, deep velvety shadow pockets, volumetric beams",
		description: "Inspired by sacred architectural spaces where light enters through a singular deliberate opening, carving out illuminated planes amidst deep mysterious shadow.",
		promptSnippet: "Dramatic architectural chiaroscuro lighting, single high clerestory light shaft cutting through deep shadow, high contrast ratio, volumetric sunbeam illuminating atmospheric haze, sculpted light-pocket geometry",
		materials: [
			"Directional sun shaft",
			"Velvety shadow pockets",
			"Sharp cut-off illumination"
		],
		swatches: [
			"#fff3d1",
			"#785f36",
			"#2c2419",
			"#0e0c0a"
		],
		image: "/viz/t08-material-junction.jpg"
	},
	{
		id: "interior-cove-accent",
		category: "lighting",
		name: "Architectural Cove & Grazing",
		tagline: "Concealed LED reveals, tactile wall washing, zero direct glare",
		description: "Refined evening interior scheme where light sources are fully integrated into ceiling coves, base reveals, and joinery kickers to wash vertical planes without visible bulbs.",
		promptSnippet: "Sophisticated interior lighting design, concealed continuous LED cove wash across ceiling plane, vertical plaster wall grazing highlighting subtle texture, soft under-cabinet joinery glow, intimate focal pendants",
		materials: [
			"Concealed linear coves (2400K)",
			"Wall-grazing downlights",
			"Minimal glare fixtures"
		],
		swatches: [
			"#fadca5",
			"#dca762",
			"#473420",
			"#18130e"
		],
		image: "/viz/t09-r1-living-room-clay-edit.jpg"
	}
];
var MOOD_SETTINGS = [
	{
		id: "serene-sanctuary",
		category: "mood",
		name: "Serene Sanctuary",
		tagline: "Meditative quiet, uncluttered visual rhythm, restorative stillness",
		description: "An oasis of calm that lowers heart rates. Characterized by generous negative space, gentle transitions between zones, organic materiality, and acoustic softness.",
		promptSnippet: "Mood of serene contemplative sanctuary, restorative domestic stillness, unhurried peaceful atmosphere, refined negative space, visual breathing room, soothing tactile balance",
		materials: [
			"Muted earth pigments",
			"Acoustic plaster",
			"Soft wool rugs"
		],
		swatches: [
			"#eee8de",
			"#d7cdbd",
			"#b8a892",
			"#5e5344"
		]
	},
	{
		id: "cinematic-grandeur",
		category: "mood",
		name: "Cinematic Grandeur",
		tagline: "Dramatic volumetric presence, monumental scale, emotional gravitas",
		description: "Evokes awe through expansive vertical scale, monumental material planes, dramatic contrast, and an elevated editorial perspective fit for an architectural monograph.",
		promptSnippet: "Mood of cinematic architectural grandeur, monumental spatial impact, sophisticated gravitas, prestigious design magazine feature, dramatic sense of scale and permanence",
		materials: [
			"Honed stone slabs",
			"Deep patinated metal",
			"Heavy architectural mass"
		],
		swatches: [
			"#1d1f22",
			"#41454c",
			"#9fa4ac",
			"#dcdfe4"
		]
	},
	{
		id: "intimate-warmth",
		category: "mood",
		name: "Intimate Domestic Warmth",
		tagline: "Tactile comfort, human scale, inviting grounded solace",
		description: "Spaces designed for lingering conversation, reading, and retreat. Rich tactile textures, warm honey tones, and comfortable acoustic containment.",
		promptSnippet: "Mood of intimate domestic warmth, cozy tactile comfort, inviting human-scale atmosphere, soft warm ambient glow, grounded and welcoming architectural embrace",
		materials: [
			"Honey-toned timber",
			"Chunky bouclé",
			"Warm ceramic lamps"
		],
		swatches: [
			"#d89c56",
			"#ba7833",
			"#eed2aa",
			"#3e2714"
		]
	},
	{
		id: "monastic-clarity",
		category: "mood",
		name: "Monastic Minimalist Clarity",
		tagline: "Uncompromising honesty, ascetic beauty, profound silence",
		description: "Stripped of all superficial ornament. Celebrates the elemental dialogue between raw unadorned materials, void space, and natural illumination.",
		promptSnippet: "Mood of monastic minimalist clarity, ascetic architectural purity, profound visual silence, rigorous geometry, unadorned material honesty, meditative emptiness",
		materials: [
			"Raw stone block",
			"Unglazed ceramic",
			"Natural unfinished lime"
		],
		swatches: [
			"#f5f5f4",
			"#e7e5e4",
			"#78716c",
			"#1c1917"
		]
	},
	{
		id: "vibrant-cosmopolitan",
		category: "mood",
		name: "Vibrant Cosmopolitan Energy",
		tagline: "Dynamic civic vitality, layered hospitality, cultured lifestyle",
		description: "A lively, cultured ambiance celebrating public life, social interaction, active streetscapes, and sophisticated contemporary design details.",
		promptSnippet: "Mood of vibrant cosmopolitan design, cultured urban vitality, sophisticated social hospitality, lively refined architectural atmosphere, bespoke curated finishes",
		materials: [
			"Polished brass accents",
			"Rich terrazzo",
			"Lush indoor greenery"
		],
		swatches: [
			"#c59b27",
			"#1e4d3a",
			"#f3edd8",
			"#202020"
		]
	}
];
var CAMERA_PRESETS = [
	{
		id: "eye-level-two-point",
		category: "camera",
		name: "Eye-Level Two-Point Perspective",
		tagline: "True human 1.6m elevation, perfect vertical lines, zero barrel distortion",
		description: "Standard editorial architectural perspective taken at 160cm eye level with shift-lens perspective control maintaining absolute vertical parallelism.",
		promptSnippet: "Eye-level two-point architectural perspective, 1.6-meter camera height, vertical lines perfectly parallel and corrected with tilt-shift lens, 28mm wide architectural composition",
		materials: [
			"28mm architectural lens",
			"Zero vertical tilt",
			"Balanced horizon at 38%"
		]
	},
	{
		id: "low-angle-oblique",
		category: "camera",
		name: "Low-Angle Volumetric Oblique",
		tagline: "Upward dramatic gaze accentuating soaring vertical ceilings and mass",
		description: "Positioned at 0.8m height looking slightly upward along an architectural diagonal to emphasize soaring double-height volumes and heroic cantilevers.",
		promptSnippet: "Low-angle architectural perspective, camera positioned low to the ground looking obliquely up, dynamic diagonal composition emphasizing soaring height and structural cantilever",
		materials: [
			"24mm wide angle",
			"Dynamic diagonal lines",
			"Foreground depth plane"
		]
	},
	{
		id: "intimate-macro-junction",
		category: "camera",
		name: "Intimate Material Junction Crop",
		tagline: "Vignette focus on material craftsmanship, flush joints, and tactile reveals",
		description: "A close-range crop highlighting the precise 5mm shadow reveal where hand-troweled plaster meets oiled oak cabinetry and honed stone.",
		promptSnippet: "Detailed architectural vignette, medium close-up shot focusing on the tactile junction where stone meets wood and metal, shallow depth of field, 50mm lens, exquisite craftsmanship",
		materials: [
			"50mm prime lens",
			"f/2.8 shallow depth of field",
			"Tactile texture focal point"
		]
	},
	{
		id: "elevated-site-drone",
		category: "camera",
		name: "Elevated Oblique Site Axonometric",
		tagline: "Elevated 45-degree angle contextualizing building within surrounding terrain",
		description: "Aerial perspective capturing the entire architectural footprint, roof geometry, reflecting pools, and surrounding natural topography.",
		promptSnippet: "Elevated aerial architectural photography, high 45-degree oblique viewpoint showing building massing integrated into landscape and reflecting pool, crisp holistic site perspective",
		materials: [
			"Aerial architectural lens",
			"Full masterplan footprint",
			"Contextual terrain"
		]
	}
];
function synthesizeVisionDocument(style, lighting, mood, camera, customNotes) {
	const title = style?.name ? `${style.name} Architectural Vision` : "Architectural Vision Brief";
	const subtitle = [
		style?.name,
		lighting?.name,
		mood?.name
	].filter(Boolean).join(" · ") || "Custom Architectural Specification";
	const dateStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const synthesizedPrompt = [
		camera?.promptSnippet ?? "Eye-level architectural photography, 28mm lens with corrected vertical perspective",
		style?.promptSnippet ?? "Modern architectural visualization, high-end materiality and clean spatial composition",
		lighting?.promptSnippet ?? "Refined natural daylight with soft shadows and balanced ambient reflectance",
		mood?.promptSnippet ?? "Serene and sophisticated architectural atmosphere, editorial monograph grade",
		customNotes ? `Specific architectural directives: ${customNotes.trim()}` : "",
		"Ultra-high resolution 8k commercial architectural photography, Hasselblad camera quality, perfectly balanced tonal range, zero visual artifacts"
	].filter(Boolean).join(", ");
	return {
		title,
		subtitle,
		date: dateStr,
		style,
		lighting,
		mood,
		camera,
		customNotes,
		synthesizedPrompt,
		markdownDoc: `# ${title}
*${subtitle}*
**Date**: ${dateStr}
**Status**: Ready for Rendering & Client Presentation

---

## 1. Architectural Concept & Style
**Selected Paradigm**: ${style?.name ?? "Custom Architectural Direction"}
${style?.description ?? "A bespoke spatial program balancing architectural mass, circulation, and material warmth."}

**Key Material Palette**:
${(style?.materials ?? [
			"Architectural concrete",
			"Natural white oak",
			"Honed limestone",
			"Structural glass"
		]).map((m) => `- ${m}`).join("\n")}

---

## 2. Lighting & Atmospheric Environment
**Lighting Condition**: ${lighting?.name ?? "Natural Balanced Daylight"}
${lighting?.description ?? "Carefully calibrated illumination accentuating architectural texture and volumetric depth."}

**Luminance Directives**:
${(lighting?.materials ?? ["Diffused natural daylight", "Soft architectural coves"]).map((m) => `- ${m}`).join("\n")}

---

## 3. Mood & Spatial Psychology
**Intended Atmosphere**: ${mood?.name ?? "Serene Architectural Sanctuary"}
${mood?.description ?? "Spatial composition designed to evoke quiet contemplation and refined luxury."}

---

## 4. Camera Angle & Compositional Framing
**Camera Strategy**: ${camera?.name ?? "Eye-Level Two-Point Perspective"}
${camera?.description ?? "Neutral 28mm human-scale perspective with perfectly vertical structural lines."}

${customNotes ? `--- \n\n## 5. Custom Studio Directives\n${customNotes.trim()}\n` : ""}
---

## 6. Synthesized AI Generation Prompt
\`\`\`text
${synthesizedPrompt}
\`\`\`

*Generated via Oriel Architectural Studio Brief Builder.*
`
	};
}
var BUILDER_PRESETS = [
	{
		id: "zen-water-pavilion",
		name: "Zen Water Pavilion at Twilight",
		description: "Tadao Ando concrete pavilion with floor-to-ceiling glass floating over a reflecting pool at blue hour.",
		styleId: "minimalist-concrete-glass",
		lightingId: "blue-hour-twilight",
		moodId: "serene-sanctuary",
		cameraId: "eye-level-two-point",
		notes: "Ensure the pool reflection remains crisp and mirror-smooth with black granite stepping stones leading to the recessed entry."
	},
	{
		id: "japandi-loft-haven",
		name: "Japandi Loft Sanctuary",
		description: "Warm oak and clay plaster warehouse conversion illuminated by soft diffused overcast morning light.",
		styleId: "japandi-minimalist",
		lightingId: "soft-overcast-diffused",
		moodId: "intimate-warmth",
		cameraId: "eye-level-two-point",
		notes: "Fluted glass sliding screens separating the primary suite from the double-height living room. Monolithic travertine kitchen island."
	},
	{
		id: "subtropical-golden-hour",
		name: "Biophilic Subtropical Villa",
		description: "Deep teak louvers and volcanic stone terraces drenched in low-angle golden hour raking sunlight.",
		styleId: "contemporary-tropical",
		lightingId: "golden-hour-raking",
		moodId: "serene-sanctuary",
		cameraId: "low-angle-oblique",
		notes: "Accentuate the deep shadow cast by the cantilevered timber louvers across the volcanic stone walls and lush palm fronds."
	},
	{
		id: "brutalist-sacred-light",
		name: "Monumental Chiaroscuro Chamber",
		description: "Textured board-marked concrete with a single celestial light beam illuminating raw textured stone.",
		styleId: "brutalist-sculptural",
		lightingId: "dramatic-chiaroscuro",
		moodId: "monastic-clarity",
		cameraId: "intimate-macro-junction",
		notes: "Highlight the tactile junction where the rough board-formed concrete meets a 5mm recessed blackened steel reveal."
	}
];
var BRIEF_TEMPLATE_CATEGORIES = [
	"All",
	"Residential",
	"Commercial",
	"Landscape",
	"Hospitality",
	"Cultural"
];
var BRIEF_TEMPLATES = [
	{
		id: "residential-modern",
		name: "Residential Modern",
		category: "Residential",
		tagline: "Cantilevered fair-faced concrete, low-iron glass, and reflecting water court",
		summary: "Private cliffside or suburban modernist residence pairing crisp horizontal floor plates with warm white oak soffits, floor-to-ceiling glazing, and late-afternoon raking light.",
		previewImage: "/viz/p01-pavilion-day.jpg",
		projectScale: "480 m² · Single-Family Residence",
		deliverables: [
			"Hero Exterior Plate",
			"Living Pavilion Dusk",
			"BIM Finish Schedule"
		],
		styleId: "minimalist-concrete-glass",
		lightingId: "golden-hour-raking",
		moodId: "serene-sanctuary",
		cameraId: "eye-level-two-point",
		dictionaryPresetId: "facade",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc"
		],
		directives: "Cantilevered concrete roof plane above frameless low-iron sliding glass doors; warm rift-cut white oak soffit; calm black basalt reflecting pool.",
		designPatch: {
			vertical: "exterior",
			range: "Luxury",
			look: "Modern",
			camera: "Eye level",
			light: "Golden hour",
			mood: "Serene",
			color: "Warm white",
			weather: "Clear",
			time: "Golden hour",
			detail: "High detail",
			tags: [
				"Luxury",
				"Residential",
				"Villa",
				"Glass"
			],
			picks: {
				facade: "Concrete",
				roof: "Flat",
				windows: "Floor-to-ceiling",
				entry: "Pivot door",
				terrace: "Pergola",
				water: "Pool"
			}
		},
		enginePatch: {
			workflowPreset: "photoreal",
			facadeTypology: "Minimalist Glass",
			climateRegion: "Temperate Coastal",
			geometryLock: 88,
			renderFidelity: "editorial",
			detailDensity: "intricate",
			mjStylize: 220
		},
		scene3dPatch: {
			preset: "villa",
			primaryMaterial: "concrete",
			focalLength: 24,
			cameraPreset: "eye",
			geoEnabled: true,
			geoHour: 17.5,
			geoMonth: 6,
			sunAzimuth: 245,
			sunElevation: 16,
			hdriMood: "golden-dusk"
		},
		frameRatio: "16:9",
		frameResolution: "2k"
	},
	{
		id: "commercial-minimalist",
		name: "Commercial Minimalist",
		category: "Commercial",
		tagline: "Flagship glass-and-stone pavilion with calibrated overcast gallery daylight",
		summary: "Disciplined commercial workplace or flagship showroom emphasizing architectural clarity, anodized bronze-black mullions, honed limestone plinths, and true-color shadowless illumination.",
		previewImage: "/viz/t01-public-library.jpg",
		projectScale: "4,200 m² · Flagship Workplace",
		deliverables: [
			"Street Elevation",
			"Double-Height Lobby",
			"Facade Specification"
		],
		styleId: "minimalist-concrete-glass",
		lightingId: "soft-overcast-diffused",
		moodId: "monastic-clarity",
		cameraId: "eye-level-two-point",
		dictionaryPresetId: "glazing",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"lighting_day",
			"exclude",
			"qc"
		],
		directives: "Ultra-clear curtain wall glazing with crisp anodized aluminum fins, honed limestone forecourt paving, balanced 5500K overcast gallery illumination, zero visual clutter.",
		designPatch: {
			vertical: "exterior",
			range: "Premium",
			look: "Civic",
			camera: "Eye level",
			light: "Soft overcast",
			mood: "Quiet",
			color: "Charcoal",
			weather: "Cloudy",
			time: "Day",
			detail: "High detail",
			tags: ["Glass", "Quiet"],
			picks: {
				facade: "Glass",
				roof: "Flat",
				windows: "Dark metal",
				entry: "Canopy",
				balcony: "Glass rail"
			}
		},
		enginePatch: {
			workflowPreset: "photoreal",
			facadeTypology: "Minimalist Glass",
			climateRegion: "Urban Dense",
			geometryLock: 92,
			renderFidelity: "photoreal",
			detailDensity: "balanced",
			mjStylize: 180
		},
		scene3dPatch: {
			preset: "pavilion",
			primaryMaterial: "concrete",
			focalLength: 35,
			cameraPreset: "oblique",
			geoEnabled: true,
			geoHour: 11.5,
			geoMonth: 4,
			sunAzimuth: 150,
			sunElevation: 48,
			hdriMood: "overcast-nordic"
		},
		frameRatio: "16:9",
		frameResolution: "2k"
	},
	{
		id: "landscape-urbanism",
		name: "Landscape Urbanism",
		category: "Landscape",
		tagline: "Permeable granite civic promenade, rain gardens, and twilight path luminaires",
		summary: "Resilient urban public realm blending terraced bioswales, native shade canopies, carved basalt seating walls, and warm pedestrian bollard lighting.",
		previewImage: "/viz/t06-urban-courtyard.jpg",
		projectScale: "1.8 ha · Civic Urban Realm",
		deliverables: [
			"Aerial Masterplan",
			"Pedestrian Promenade",
			"Planting & Hardscape Pack"
		],
		styleId: "nordic-timber-civic",
		lightingId: "blue-hour-twilight",
		moodId: "vibrant-cosmopolitan",
		cameraId: "elevated-site-drone",
		dictionaryPresetId: "season",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"landscape",
			"photo",
			"exclude",
			"qc"
		],
		directives: "Permeable flamed granite pavers, vegetated stormwater bioswales, sculptural Scots pine and olive clusters, low 2700K architectural step lights along terraced water channels.",
		designPatch: {
			vertical: "landscape",
			range: "Premium",
			look: "Courtyard",
			camera: "Elevated",
			light: "Evening",
			mood: "Vibrant",
			color: "Sage",
			weather: "Clear",
			time: "Evening",
			detail: "High detail",
			tags: ["Biophilic", "Quiet"],
			picks: {
				trees: "Shade trees",
				planting: "Shrubs",
				lawn: "Meadow",
				garden: "Courtyard",
				path: "Stone",
				water: "Fountain",
				structure: "Pavilion",
				edge: "Low wall",
				light: "Path lights"
			}
		},
		enginePatch: {
			workflowPreset: "photoreal",
			facadeTypology: "Nordic Brick & Zinc",
			climateRegion: "Urban Dense",
			geometryLock: 85,
			renderFidelity: "editorial",
			detailDensity: "intricate",
			mjStylize: 210
		},
		scene3dPatch: {
			preset: "civic",
			primaryMaterial: "travertine",
			focalLength: 24,
			cameraPreset: "aerial",
			geoEnabled: true,
			geoHour: 19.75,
			geoMonth: 9,
			sunAzimuth: 278,
			sunElevation: 9,
			hdriMood: "clear-sky"
		},
		frameRatio: "16:9",
		frameResolution: "2k"
	},
	{
		id: "hospitality-resort",
		name: "Hospitality Resort Sanctuary",
		category: "Hospitality",
		tagline: "Biophilic teak timber louvers, volcanic basalt plinths, and twilight infinity edge",
		summary: "Intimate coastal or subtropical hospitality pavilion dissolving indoor lounges into shaded pool terraces with warm 2700K lantern glow.",
		previewImage: "/viz/t05-subtropical-home.jpg",
		projectScale: "1,450 m² · Boutique Resort Pavilion",
		deliverables: [
			"Arrival Canopy",
			"Infinity Pool Dusk",
			"Timber Screen Study"
		],
		styleId: "contemporary-tropical",
		lightingId: "blue-hour-twilight",
		moodId: "intimate-warmth",
		cameraId: "low-angle-oblique",
		dictionaryPresetId: "twilight",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc"
		],
		directives: "Operable weathered teak batten screens, honed dark volcanic basalt pool coping, lush tropical palms casting soft shadows against glowing 2700K interior lounges.",
		designPatch: {
			vertical: "amenities",
			range: "Ultra Luxury",
			look: "Resort",
			camera: "Wide",
			light: "Evening",
			mood: "Warm",
			color: "Oak",
			weather: "Clear",
			time: "Evening",
			detail: "High detail",
			tags: [
				"Luxury",
				"Villa",
				"Biophilic"
			],
			picks: {
				water: "Infinity pool",
				wellness: "Spa",
				social: "Lounge",
				outdoor: "Pergola",
				security: "Arrival"
			}
		},
		enginePatch: {
			workflowPreset: "photoreal",
			facadeTypology: "Biophilic Timber Louver",
			climateRegion: "Subtropical Humid",
			geometryLock: 84,
			renderFidelity: "editorial",
			detailDensity: "intricate",
			mjStylize: 250
		},
		scene3dPatch: {
			preset: "pavilion",
			primaryMaterial: "timber",
			focalLength: 24,
			cameraPreset: "eye",
			geoEnabled: true,
			geoHour: 19.5,
			geoMonth: 7,
			sunAzimuth: 282,
			sunElevation: 8,
			hdriMood: "golden-dusk"
		},
		frameRatio: "16:9",
		frameResolution: "2k"
	},
	{
		id: "adaptive-heritage-loft",
		name: "Adaptive Heritage Loft",
		category: "Residential",
		tagline: "Restored masonry brick, blackened steel trusses, and fluted glass inserts",
		summary: "Warehouse conversion honoring historic structural bones while introducing bespoke rift oak joinery, warm plaster partitions, and concealed linear cove lighting.",
		previewImage: "/viz/p02-loft-after.jpg",
		projectScale: "310 m² · Heritage Conversion",
		deliverables: [
			"Living Mezzanine",
			"Steel Truss Detail",
			"Interior Finish Board"
		],
		styleId: "industrial-heritage-reuse",
		lightingId: "interior-cove-accent",
		moodId: "intimate-warmth",
		cameraId: "eye-level-two-point",
		dictionaryPresetId: "restyle",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"materials",
			"photo",
			"exclude",
			"qc"
		],
		directives: "Sandblasted original red clay brick walls, blackened mild steel columns, fluted architectural glass room dividers, concealed 2400K ceiling cove wash over polished concrete.",
		designPatch: {
			vertical: "interior",
			range: "Luxury",
			look: "Warm hospitality",
			camera: "Eye level",
			light: "Golden hour",
			mood: "Warm",
			color: "Oak",
			weather: "Clear",
			time: "Golden hour",
			detail: "High detail",
			tags: ["Residential", "Glass"],
			picks: {
				room: "Living room",
				floor: "Microcement",
				wall: "Fluted oak",
				ceiling: "Cove light",
				openings: "Slim black"
			}
		},
		enginePatch: {
			workflowPreset: "interior-restyle",
			facadeTypology: "Nordic Brick & Zinc",
			climateRegion: "Urban Dense",
			geometryLock: 86,
			renderFidelity: "photoreal",
			detailDensity: "intricate",
			mjStylize: 190
		},
		scene3dPatch: {
			preset: "loft",
			primaryMaterial: "brick",
			focalLength: 35,
			cameraPreset: "eye",
			geoEnabled: true,
			geoHour: 16.5,
			geoMonth: 10,
			sunAzimuth: 225,
			sunElevation: 22,
			hdriMood: "studio"
		},
		frameRatio: "4:3",
		frameResolution: "2k"
	},
	{
		id: "civic-mass-timber",
		name: "Cultural Civic Timber Hall",
		category: "Cultural",
		tagline: "Exposed Douglas fir glulam, acoustic brick walls, and clerestory daylight shafts",
		summary: "Public library or museum commons anchored by long-span mass timber beams, calm reading terraces, and sculpted overhead zenithal light.",
		previewImage: "/viz/t07-cultural-campus.jpg",
		projectScale: "6,500 m² · Cultural & Civic Hall",
		deliverables: [
			"Atrium Section View",
			"Glulam Canopy Study",
			"Daylight Factor Pack"
		],
		styleId: "nordic-timber-civic",
		lightingId: "soft-overcast-diffused",
		moodId: "serene-sanctuary",
		cameraId: "low-angle-oblique",
		dictionaryPresetId: "facade",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"windows",
			"photo",
			"exclude",
			"qc"
		],
		directives: "Exposed Douglas fir glulam roof trusses, long-format tactile Nordic clay brick, double-height reading atrium bathed in soft zenithal north daylight.",
		designPatch: {
			vertical: "interior",
			range: "Premium",
			look: "Quiet mineral",
			camera: "Wide",
			light: "Soft overcast",
			mood: "Serene",
			color: "Sand",
			weather: "Cloudy",
			time: "Day",
			detail: "High detail",
			tags: ["Quiet", "Biophilic"],
			picks: {
				room: "Living room",
				floor: "Travertine",
				wall: "Limewash",
				ceiling: "Timber",
				openings: "Bronze frames"
			}
		},
		enginePatch: {
			workflowPreset: "photoreal",
			facadeTypology: "Nordic Brick & Zinc",
			climateRegion: "Alpine Cold",
			geometryLock: 90,
			renderFidelity: "editorial",
			detailDensity: "balanced",
			mjStylize: 175
		},
		scene3dPatch: {
			preset: "civic",
			primaryMaterial: "timber",
			focalLength: 24,
			cameraPreset: "oblique",
			geoEnabled: true,
			geoHour: 13,
			geoMonth: 5,
			sunAzimuth: 175,
			sunElevation: 56,
			hdriMood: "overcast-nordic"
		},
		frameRatio: "16:9",
		frameResolution: "2k"
	},
	{
		id: "brutalist-gallery",
		name: "Monolithic Brutalist Gallery",
		category: "Cultural",
		tagline: "Board-formed concrete reveals, Corten trim, and chiaroscuro oculus beam",
		summary: "Sculptural art foundation gallery celebrating raw mineral weight, deep-set shadow reveals, and single-aperture architectural light drama.",
		previewImage: "/viz/t08-material-junction.jpg",
		projectScale: "2,100 m² · Sculpture Foundation",
		deliverables: [
			"Gallery Aperture Study",
			"Junction Macro Detail",
			"Client Concept Book"
		],
		styleId: "brutalist-sculptural",
		lightingId: "dramatic-chiaroscuro",
		moodId: "cinematic-grandeur",
		cameraId: "intimate-macro-junction",
		dictionaryPresetId: "facade",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"materials",
			"photo",
			"exclude",
			"qc"
		],
		directives: "Rough cedar board-formed concrete walls meeting a 5mm recessed blackened steel shadow reveal; single high clerestory sunbeam slicing across honed basalt flooring.",
		designPatch: {
			vertical: "interior",
			range: "Ultra Luxury",
			look: "Material study",
			camera: "Close detail",
			light: "Daylight",
			mood: "Dramatic",
			color: "Charcoal",
			weather: "Clear",
			time: "Day",
			detail: "High detail",
			tags: ["Luxury", "Quiet"],
			picks: {
				room: "Living room",
				floor: "Italian marble",
				wall: "Stone",
				ceiling: "Gypsum"
			}
		},
		enginePatch: {
			workflowPreset: "photoreal",
			facadeTypology: "Board-Marked Concrete",
			climateRegion: "Arid Desert",
			geometryLock: 91,
			renderFidelity: "editorial",
			detailDensity: "intricate",
			mjStylize: 240
		},
		scene3dPatch: {
			preset: "villa",
			primaryMaterial: "concrete",
			focalLength: 50,
			cameraPreset: "detail",
			geoEnabled: true,
			geoHour: 15,
			geoMonth: 8,
			sunAzimuth: 235,
			sunElevation: 38,
			hdriMood: "clear-sky"
		},
		frameRatio: "3:2",
		frameResolution: "2k"
	},
	{
		id: "japandi-penthouse",
		name: "Japandi Urban Penthouse",
		category: "Residential",
		tagline: "Rift-cut white oak joinery, limewash plaster, and quiet morning light",
		summary: "Restorative high-floor residence integrating Japanese spatial restraint with Scandinavian tactile warmth, paper-screen thresholds, and travertine islands.",
		previewImage: "/viz/t03-compact-living-room.jpg",
		projectScale: "265 m² · Penthouse Interior",
		deliverables: [
			"Living Sanctuary Plate",
			"Kitchen Island Elevation",
			"Material Mood Board"
		],
		styleId: "japandi-minimalist",
		lightingId: "soft-overcast-diffused",
		moodId: "serene-sanctuary",
		cameraId: "eye-level-two-point",
		dictionaryPresetId: "restyle",
		dictionaryBlocks: [
			"goal",
			"source",
			"geometry",
			"materials",
			"photo",
			"exclude",
			"qc"
		],
		directives: "Bespoke rift-cut white oak casework, hand-troweled warm limewash plaster walls, fluted translucent privacy screens, monolithic travertine kitchen island.",
		designPatch: {
			vertical: "interior",
			range: "Luxury",
			look: "Modern luxury",
			camera: "Eye level",
			light: "Soft overcast",
			mood: "Serene",
			color: "Warm white",
			weather: "Clear",
			time: "Morning",
			detail: "High detail",
			tags: [
				"Luxury",
				"Residential",
				"Quiet"
			],
			picks: {
				room: "Living room",
				floor: "Travertine",
				rug: "Wool",
				wall: "Limewash",
				ceiling: "Gypsum",
				furniture: "Lounge chairs",
				kitchen: "Stone island"
			}
		},
		enginePatch: {
			workflowPreset: "interior-restyle",
			facadeTypology: "Minimalist Glass",
			climateRegion: "Temperate Coastal",
			geometryLock: 86,
			renderFidelity: "photoreal",
			detailDensity: "intricate",
			mjStylize: 195
		},
		scene3dPatch: {
			preset: "loft",
			primaryMaterial: "timber",
			focalLength: 35,
			cameraPreset: "eye",
			geoEnabled: true,
			geoHour: 9.5,
			geoMonth: 5,
			sunAzimuth: 110,
			sunElevation: 36,
			hdriMood: "studio"
		},
		frameRatio: "16:9",
		frameResolution: "2k"
	}
];
function filterBriefTemplates(category, query = "") {
	const q = query.trim().toLowerCase();
	return BRIEF_TEMPLATES.filter((item) => {
		if (category !== "All" && item.category !== category) return false;
		if (!q) return true;
		return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.tagline.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.directives.toLowerCase().includes(q);
	});
}
function resolveBriefTemplateSlots(template) {
	return {
		style: ARCHITECTURAL_STYLES.find((s) => s.id === template.styleId) ?? null,
		lighting: LIGHTING_CONDITIONS.find((l) => l.id === template.lightingId) ?? null,
		mood: MOOD_SETTINGS.find((m) => m.id === template.moodId) ?? null,
		camera: CAMERA_PRESETS.find((c) => c.id === template.cameraId) ?? null
	};
}
function buildTemplateCompiledNotes(template) {
	const slots = resolveBriefTemplateSlots(template);
	const base = buildInitialBuilderNotes(slots.style, slots.lighting, slots.mood, slots.camera);
	return template.directives ? `${base}. ${template.directives}` : base;
}
var MARKET_SUGGESTION_CATEGORIES = [
	{
		id: "geometry-lock",
		label: "Geometry & BIM Lock",
		summary: "Preserve windows, floor datums, structural spans, and orthographic proportions."
	},
	{
		id: "solar-atmosphere",
		label: "Solar, Sky & Time-of-Day",
		summary: "Morning, Solar Noon, Golden Hour, Blue-Hour Twilight, Midnight, and weather physics."
	},
	{
		id: "materials-pbr",
		label: "PBR Materials & Micro-Texture",
		summary: "True-scale timber joinery, board-formed concrete, travertine, bronze, and low-iron glass."
	},
	{
		id: "sketch-conditioning",
		label: "Sketch, CAD & 2D-to-3D",
		summary: "Convert hand sketches, elevations, plans, and annotations accurately without drifting."
	},
	{
		id: "camera-optics",
		label: "Optics, Camera & Framing",
		summary: "Two-point tilt-shift verticals, architectural lenses (24–85mm), and balanced thresholds."
	},
	{
		id: "entourage-landscape",
		label: "Entourage, Foliage & Context",
		summary: "Natural scale figures, subtle motion blur, seasonal botanicals, and grounded reflections."
	},
	{
		id: "post-upscale",
		label: "Segmentation, Seed & 8K–15K",
		summary: "Click-to-mask element swaps, client revision seed locking, and super-res finishing."
	},
	{
		id: "motion-360-client",
		label: "Video, 360° & Autopilot",
		summary: "Day-to-night transitions, walkthrough clips, 360° hotspots, GLB locks, and client packs."
	}
];
var MARKET_BENCHMARKS = [
	"Veras",
	"D5 Render",
	"LookX",
	"Rendair",
	"Krea",
	"Magnific",
	"Chaos Corona"
];
var CATEGORY_LABEL_MAP = Object.fromEntries(MARKET_SUGGESTION_CATEGORIES.map((c) => [c.id, c.label]));
var RAW_BY_CATEGORY = {
	"geometry-lock": [
		{
			title: "Strict Fenestration & Mullion Lock",
			benchmark: "Veras",
			pain: "Prevents AI from inventing extra windows or shifting glazing mullions.",
			tip: "Best for finalized BIM facades when testing finishes.",
			prompt: "Preserve exact window frame count, mullion spacing, sill heights, and structural bays.",
			impact: "High",
			engine: {
				geometryLock: 95,
				annotatorMode: "mlsd",
				edgeAdherence: 90,
				seedLocked: true
			}
		},
		{
			title: "Floor-to-Floor Datum Continuity",
			benchmark: "Veras",
			pain: "Stops multi-story buildings from stretching or merging slab edges.",
			tip: "Locks slab plates and parapet elevations across tall elevations.",
			prompt: "Maintain strict slab edge alignment, cornice lines, and exact story heights.",
			impact: "High",
			engine: {
				geometryLock: 92,
				depthEnabled: true,
				depthWeight: 82
			}
		},
		{
			title: "Cantilever Structural Envelope Hold",
			benchmark: "LookX",
			pain: "Stops thin architectural overhangs from sagging or adding fake columns.",
			tip: "Keeps bold modern cantilevers razor-sharp.",
			prompt: "Hold true cantilevered soffit geometry with zero unrequested support columns.",
			impact: "High",
			engine: {
				geometryLock: 90,
				edgeAdherence: 86,
				workflowPreset: "photoreal"
			}
		},
		{
			title: "Staircase Tread & Balustrade Lock",
			benchmark: "Veras",
			pain: "Eliminates warped stair flights and broken glass railings in interior shots.",
			tip: "Use when renovating lobby or atrium circulation.",
			prompt: "Preserve exact stair riser rhythm, handrail continuous line, and glass balustrade clamps.",
			impact: "High",
			engine: {
				geometryLock: 94,
				annotatorMode: "canny",
				annotatorThreshold: 45
			}
		},
		{
			title: "Doorway Swing & Threshold Retention",
			benchmark: "Rendair",
			pain: "Keeps entry doors, pivot frames, and corridors in exact plan locations.",
			tip: "Essential for code-compliant commercial interior proposals.",
			prompt: "Retain existing door leaf geometry, pivot hardware alignment, and casing reveals.",
			engine: {
				geometryLock: 89,
				annotatorMode: "lineart",
				edgeAdherence: 85
			}
		},
		{
			title: "Curtain Wall Spandrel Grid Precision",
			benchmark: "LookX",
			pain: "Fixes wavy reflective tower facades and inconsistent vision-glass bands.",
			tip: "Aligns high-rise aluminum extrusions cleanly.",
			prompt: "Crisp orthometric curtain-wall transom and vertical fin grid with true reflection joints.",
			impact: "High",
			engine: {
				geometryLock: 93,
				annotatorMode: "mlsd",
				facadeTypology: "Minimalist Glass"
			}
		},
		{
			title: "Gable & Hip Roof Slope Fidelity",
			benchmark: "Veras",
			pain: "Prevents residential pitched roofs from collapsing into flat parapets.",
			tip: "Ideal for alpine villas and heritage adaptive reuse.",
			prompt: "Keep exact pitched roof ridge angle, eave projection, and gutter fascia geometry.",
			engine: {
				geometryLock: 91,
				depthEnabled: true,
				depthWeight: 76
			}
		},
		{
			title: "Interior Room Boundary Preservation",
			benchmark: "Rendair",
			pain: "Stops sofa/kitchen swaps from moving structural walls or kitchen islands.",
			tip: "One click holds room shell steady while testing decor.",
			prompt: "Hold perimeter wall planes, cove ceiling recesses, and island footprint fixed.",
			impact: "High",
			engine: {
				workflowPreset: "interior-restyle",
				geometryLock: 92,
				materialOverride: 70
			}
		},
		{
			title: "Perforated Louver & Brise-Soleil Rhythm",
			benchmark: "LookX",
			pain: "Prevents sun-shading slats from blurring into solid panels.",
			tip: "Preserves louver spacing for realistic dappled sunlight.",
			prompt: "Crisp equidistant timber and bronze brise-soleil louvers casting calibrated sun bands.",
			engine: {
				geometryLock: 88,
				annotatorMode: "canny",
				detailDensity: "intricate"
			}
		},
		{
			title: "Colonnade & Arched Arcade Symmetry",
			benchmark: "Chaos Corona",
			pain: "Fixes uneven classical colonnade capitals and distorted vault ribs.",
			tip: "Locks neoclassical and cultural civic colonnades.",
			prompt: "True symmetrical column shafts, barrel-vault ribs, and limestone plinth reveals.",
			engine: {
				geometryLock: 92,
				annotatorMode: "mlsd",
				renderFidelity: "editorial"
			}
		},
		{
			title: "Balcony Guardrail Transparency Hold",
			benchmark: "Veras",
			pain: "Stops glass railings from turning into opaque parapet walls.",
			tip: "Keeps balcony sightlines clear on residential towers.",
			prompt: "Low-iron laminated glass balcony guardrails with minimal stainless spigots.",
			engine: {
				geometryLock: 87,
				materialOverride: 55
			}
		},
		{
			title: "Skylight & Coffered Ceiling Aperture Lock",
			benchmark: "Chaos Corona",
			pain: "Preserves clerestory skylight openings so daylight falls in the right spot.",
			tip: "Great for museums and atrium interiors.",
			prompt: "Hold exact skylight coffer grid geometry allowing directional overhead daylight shafts.",
			engine: {
				geometryLock: 91,
				depthEnabled: true,
				depthWeight: 74
			}
		},
		{
			title: "Retaining Wall & Site Topography Lock",
			benchmark: "D5 Render",
			pain: "Prevents sloped hillside villas from floating or losing stepped stone walls.",
			tip: "Locks stepped terraces and garden grade contours.",
			prompt: "Follow true site slope contours, stepped retaining stone walls, and exterior stair flights.",
			engine: {
				geometryLock: 89,
				depthEnabled: true,
				depthWeight: 85
			}
		},
		{
			title: "Pergola Rafter & Post Grid Lock",
			benchmark: "Rendair",
			pain: "Stops outdoor patio rafters from twisting or vanishing in exterior shots.",
			tip: "Maintains clean overhead shadow lines on pool terraces.",
			prompt: "Preserve orthogonal pergola beams, slender steel posts, and cast shadow trellis.",
			engine: {
				geometryLock: 90,
				annotatorMode: "mlsd"
			}
		},
		{
			title: "Custom Kitchen Millwork Casework Hold",
			benchmark: "Veras",
			pain: "Keeps cabinetry reveals, appliance alcoves, and range hoods aligned.",
			tip: "Upgrade veneer or marble without losing millimeter millwork.",
			prompt: "Preserve exact cabinet door reveal seams, recessed pulls, and countertop overhang.",
			impact: "High",
			engine: {
				geometryLock: 93,
				edgeAdherence: 88,
				renderFidelity: "photoreal"
			}
		},
		{
			title: "Double-Height Mezzanine Void Clarity",
			benchmark: "LookX",
			pain: "Stops AI from filling open double-height volumes with accidental floor plates.",
			tip: "Maintains airy loft volume depth and vertical continuity.",
			prompt: "Maintain unobstructed double-height atrium void and mezzanine overlook rail.",
			engine: {
				geometryLock: 90,
				depthEnabled: true,
				depthWeight: 80
			}
		},
		{
			title: "Recessed Reveal & Shadow-Gap Trim",
			benchmark: "Chaos Corona",
			pain: "Replaces clunky baseboards with authentic modern flush shadow-gap reveals.",
			tip: "Subtle architectural detail that elevates luxury interiors.",
			prompt: "Architectural 12mm shadow-gap wall baseboards and flush frameless door jambs.",
			engine: {
				geometryLock: 86,
				detailDensity: "intricate"
			}
		},
		{
			title: "Parking Entry & Vehicular Ramp Grade",
			benchmark: "Rendair",
			pain: "Stops driveway ramps and garage aprons from bending unnaturally.",
			tip: "Useful for suburban residences and civic podium entries.",
			prompt: "Preserve constant vehicular ramp slope, curb radii, and illuminated garage soffit.",
			engine: {
				geometryLock: 88,
				annotatorMode: "normal"
			}
		},
		{
			title: "Historic Masonry Cornice Protection",
			benchmark: "LookX",
			pain: "Prevents modern adaptive reuse edits from wiping protected heritage stone.",
			tip: "Applies modern glazing solely within existing brick openings.",
			prompt: "Heritage preservation: retain historic stone cornice relief and window masonry arches.",
			impact: "High",
			engine: {
				geometryLock: 96,
				annotatorMode: "canny",
				edgeAdherence: 92
			}
		},
		{
			title: "Zero-Drift Revision Geometry Freeze",
			benchmark: "Veras",
			pain: "Stops subtle building shape shifting between client revision round 1 and 2.",
			tip: "Locks geometry at 97% + Seed Lock for client sign-off cycles.",
			prompt: "Zero-drift structural freeze: modify only targeted surface finish and lighting mood.",
			impact: "High",
			engine: {
				geometryLock: 97,
				seedLocked: true,
				materialOverride: 45
			}
		}
	],
	"solar-atmosphere": [
		{
			title: "Morning 08:00 Crisp East Sunlight",
			benchmark: "D5 Render",
			pain: "Solves flat midday renders with crisp, optimistic morning architectural light.",
			tip: "Ideal for residential kitchens, courtyards, and cafes.",
			prompt: "Crisp 08:00 morning sunlight casting long warm-cool directional shadows across travertine.",
			impact: "High",
			design: {
				light: "Daylight",
				time: "Morning",
				mood: "Serene"
			},
			scene3d: {
				geoEnabled: true,
				geoHour: 8,
				d5LightPreset: "noon",
				exposure: 1.08,
				hdriMood: "clear-sky"
			},
			queue: {
				label: "08:00 Crisp Morning",
				preset: "photoreal",
				light: "Daylight",
				sunHour: 8
			}
		},
		{
			title: "Solar Noon High-Clarity Architectural Day",
			benchmark: "D5 Render",
			pain: "Gives zoning boards and competition jurors honest shadow massing.",
			tip: "Clean 12:30 high sun angle showing true material colors.",
			prompt: "Clean solar noon architectural daylight with defined contact shadows and crystal clarity.",
			design: {
				light: "Daylight",
				time: "Day",
				weather: "Clear"
			},
			scene3d: {
				geoEnabled: true,
				geoHour: 12.5,
				d5LightPreset: "noon",
				sunElevation: 58,
				exposure: 1
			},
			queue: {
				label: "12:30 Solar Noon",
				preset: "photoreal",
				light: "Daylight",
				sunHour: 12.5
			}
		},
		{
			title: "Golden Hour 17:30 Rim & Glazing Glow",
			benchmark: "Chaos Corona",
			pain: "Replaces harsh yellow filters with physically calibrated warm low sun.",
			tip: "Client favorite for villa and hospitality hero shots.",
			prompt: "17:30 golden hour sunlight skimming textured stone with smooth highlight rolloff.",
			impact: "High",
			design: {
				light: "Golden hour",
				time: "Golden hour",
				mood: "Warm"
			},
			scene3d: {
				geoEnabled: true,
				geoHour: 17.5,
				d5LightPreset: "golden",
				sunElevation: 16,
				exposure: 1.15,
				hdriMood: "golden-dusk"
			},
			queue: {
				label: "17:30 Golden Hour",
				preset: "photoreal",
				light: "Golden hour",
				sunHour: 17.5
			}
		},
		{
			title: "Blue-Hour Twilight Interior Hearth Balance",
			benchmark: "D5 Render",
			pain: "Balances deep cobalt twilight sky against warm 2700K glowing interiors.",
			tip: "Instantly elevates glass pavilions and retail storefronts.",
			prompt: "Deep blue-hour dusk sky balanced with glowing 2700K warm interior architectural lamps.",
			impact: "High",
			design: {
				light: "Evening",
				time: "Evening",
				mood: "Warm"
			},
			scene3d: {
				geoEnabled: true,
				geoHour: 19.4,
				d5LightPreset: "blue-hour",
				sunElevation: 7,
				exposure: 1.2,
				hdriMood: "golden-dusk"
			},
			queue: {
				label: "19:30 Blue Hour",
				preset: "photoreal",
				light: "Evening",
				sunHour: 19.4
			}
		},
		{
			title: "Midnight Exterior Architectural Uplight",
			benchmark: "Chaos Corona",
			pain: "Avoids pitch-black muddy shadows in night renders via realistic fixture bounce.",
			tip: "Highlights soffit grazers, bollard path lights, and pool LEDs.",
			prompt: "Midnight architectural study with calibrated landscape uplights, soffit grazing, and dark sky.",
			impact: "High",
			design: {
				light: "Night",
				time: "Night",
				mood: "Dramatic"
			},
			scene3d: {
				geoEnabled: true,
				geoHour: 22,
				d5LightPreset: "blue-hour",
				exposure: 1.05
			},
			queue: {
				label: "22:00 Midnight Uplight",
				preset: "photoreal",
				light: "Night",
				sunHour: 22
			}
		},
		{
			title: "Nordic Overcast Soft Sky Diffusion",
			benchmark: "Chaos Corona",
			pain: "Eliminates blown-out white walls by wrapping geometry in soft ambient skylight.",
			tip: "Best for subtle concrete, pale oak, and museum monographs.",
			prompt: "Soft overcast Nordic sky dome delivering shadowless wrap-around illumination and delicate AO.",
			impact: "High",
			design: {
				light: "Soft overcast",
				weather: "Cloudy",
				mood: "Quiet"
			},
			scene3d: {
				d5LightPreset: "overcast",
				hdriMood: "overcast-nordic",
				fogDensity: 12
			}
		},
		{
			title: "Post-Rain Courtyard Reflective Asphalt",
			benchmark: "D5 Render",
			pain: "Breaks flat matte paving by introducing thin moisture film puddles.",
			tip: "Adds instant editorial drama without changing building geometry.",
			prompt: "Recently rained stone plaza with crisp damp puddle reflections and cool atmospheric bounce.",
			design: {
				weather: "Cloudy",
				mood: "Dramatic"
			},
			engine: {
				climateRegion: "Temperate Coastal",
				relightPreset: "none"
			}
		},
		{
			title: "Volumetric Atrium Daylight Shafts",
			benchmark: "D5 Render",
			pain: "Fixes sterile double-height interiors that lack tangible air depth.",
			tip: "Subtle dust/haze scatters sunbeams through high clerestory windows.",
			prompt: "Soft volumetric sunlight beams cutting diagonally across double-height travertine atrium.",
			scene3d: {
				fogDensity: 28,
				sunElevation: 32,
				d5LightPreset: "golden"
			}
		},
		{
			title: "2700K Cove & Linear Grazer Warmth",
			benchmark: "Chaos Corona",
			pain: "Stops recessed ceiling coves from looking like harsh white CGI stripes.",
			tip: "Adds realistic warm indirect wash along limewash plaster walls.",
			prompt: "Concealed 2700K architectural LED grazing coves washing fluted oak and plaster walls.",
			design: {
				light: "Evening",
				mood: "Warm",
				color: "Warm white"
			}
		},
		{
			title: "Winter Alpine Snow Bounce Illumination",
			benchmark: "LookX",
			pain: "Fixes muddy winter lighting by simulating cool snow ground albedo fill.",
			tip: "Turns temperate exteriors into crisp snow-season marketing plates.",
			prompt: "Crisp winter alpine snowbanks bouncing cool zenith light beneath glowing timber eaves.",
			design: {
				weather: "Clear",
				mood: "Serene"
			},
			engine: {
				climateRegion: "Alpine Cold",
				relightPreset: "summer-to-snow"
			}
		},
		{
			title: "Coastal Marine Mist & Distant Depth Haze",
			benchmark: "D5 Render",
			pain: "Prevents distant backgrounds from looking pasted on with exponential aerial fog.",
			tip: "Blends cliffside villas seamlessly into coastal horizons.",
			prompt: "Delicate coastal morning mist softening distant horizon hills with layered atmospheric depth.",
			design: {
				weather: "Mist",
				mood: "Serene"
			},
			scene3d: {
				fogDensity: 38,
				hdriMood: "overcast-nordic"
			}
		},
		{
			title: "Subtropical Dappled Leaf Gobo Shadows",
			benchmark: "Veras",
			pain: "Replaces blank stucco walls with organic dappled canopy shadow movement.",
			tip: "Adds believable environmental storytelling onto minimalist facades.",
			prompt: "Dappled palm and olive leaf shadows dancing naturally across sunlit plaster facade walls.",
			engine: { climateRegion: "Subtropical Humid" },
			design: {
				light: "Golden hour",
				mood: "Warm"
			}
		},
		{
			title: "Balanced Skylight + North Window Neutrality",
			benchmark: "Chaos Corona",
			pain: "Keeps true textile and marble hues accurate without strong orange/blue color casts.",
			tip: "Best for interior sample boards and client material sign-off.",
			prompt: "Neutral 5500K north-facing daylight balance for true-color fabric and stone evaluation.",
			design: {
				light: "Soft overcast",
				time: "Day",
				mood: "Quiet"
			},
			scene3d: {
				hdriMood: "studio",
				exposure: 1.02
			}
		},
		{
			title: "Arid Desert Harsh Sculptural Shadow Play",
			benchmark: "LookX",
			pain: "Accentuates deep window reveals, rammed earth courtyards, and brise-soleil.",
			tip: "Maximizes geometric light/shadow contrast on arid sites.",
			prompt: "Crisp desert low-humidity sunlight cutting razor-sharp sculptural shadows in deep reveals.",
			engine: { climateRegion: "Arid Desert" },
			scene3d: {
				sunElevation: 26,
				fogDensity: 4,
				hdriMood: "clear-sky"
			}
		},
		{
			title: "Warm Firepit & Pool Underwater Glow",
			benchmark: "D5 Render",
			pain: "Turns dead evening amenities renders into vibrant hospitality experiences.",
			tip: "Pairs subtle aqua pool caustic glow with amber hearth warmth.",
			prompt: "Submerged pool turquoise bounce paired with warm courtyard firepit glow at dusk.",
			design: {
				light: "Evening",
				time: "Evening",
				mood: "Vibrant"
			}
		},
		{
			title: "Zero-Blowout Filmic Window Exposure",
			benchmark: "Chaos Corona",
			pain: "Stops bright exterior views from burning out interior window frames.",
			tip: "Balances interior room exposure with visible outdoor trees and sky.",
			prompt: "High-dynamic-range architectural window balance preserving both exterior sky and interior grain.",
			impact: "High",
			engine: {
				renderFidelity: "editorial",
				geometryLock: 90
			}
		},
		{
			title: "Moonlit Minimalist Silver Night Pass",
			benchmark: "D5 Render",
			pain: "Offers a calm architectural night option without garish neon lighting.",
			tip: "Subtle cool skylight paired with minimal pinpoint interior lamps.",
			prompt: "Cool moonlit architectural exterior with delicate pinpoint pendant glow inside glazing.",
			design: {
				light: "Night",
				time: "Night",
				mood: "Serene"
			}
		},
		{
			title: "Golden Reflection Pool Mirror Stillness",
			benchmark: "Chaos Corona",
			pain: "Maximizes calm water mirror reflections of glowing timber soffits.",
			tip: "Best for museum forecourts and zen courtyard homes.",
			prompt: "Mirror-still shallow reflection pool doubling warm illuminated timber eaves at twilight.",
			design: {
				light: "Golden hour",
				mood: "Serene"
			}
		},
		{
			title: "Civic Urban Streetlight & Storefront Buzz",
			benchmark: "LookX",
			pain: "Brings ground-floor retail podiums to life during dusk reviews.",
			tip: "Adds grounded warm interior retail bays along urban sidewalks.",
			prompt: "Activated ground-floor urban retail glazing spilling warm light onto damp granite paving.",
			engine: { climateRegion: "Urban Dense" },
			design: {
				light: "Evening",
				time: "Evening"
			}
		},
		{
			title: "3-Time Solar Calibration Trio (09h / 16h / 19h)",
			benchmark: "D5 Render",
			pain: "Eliminates back-and-forth guessing on which sun angle sells the massing best.",
			tip: "Queued automatically as Morning, Golden, and Blue-Hour passes.",
			prompt: "Physically calibrated solar angle progression preserving identical framing across daylight hours.",
			impact: "High",
			queue: {
				label: "Solar Calibration Pass",
				preset: "photoreal",
				light: "Golden hour",
				sunHour: 16.5
			}
		}
	],
	"materials-pbr": [
		{
			title: "Board-Formed Architectural Concrete Tie-Holes",
			benchmark: "Chaos Corona",
			pain: "Fixes flat plastic gray walls by adding crisp formwork wood grain and tie cones.",
			tip: "Classic brutalist & museum tactile finish.",
			prompt: "Board-formed architectural concrete showing subtle timber formwork grain and recessed cone tie-holes.",
			impact: "High",
			engine: {
				facadeTypology: "Board-Marked Concrete",
				materialOverride: 76
			},
			scene3d: { primaryMaterial: "concrete" }
		},
		{
			title: "Honed Roman Travertine Open-Pore Satin",
			benchmark: "Chaos Corona",
			pain: "Removes synthetic shiny marble look in favor of matte open-pore stone bedding.",
			tip: "Adds quiet luxury to plinths, fireplaces, and bath walls.",
			prompt: "Honed Roman vein-cut travertine slabs with subtle open-pore pitting and mitered edge joints.",
			impact: "High",
			design: {
				color: "Sand",
				look: "Quiet mineral"
			},
			scene3d: { primaryMaterial: "travertine" }
		},
		{
			title: "Charred Shou Sugi Ban Cedar Siding",
			benchmark: "LookX",
			pain: "Replaces generic black paint with alligator-charred cedar texture sheen.",
			tip: "High contrast against warm oiled oak soffits.",
			prompt: "Deep charred shou sugi ban cedar planks with delicate silver-charred grain catchlights.",
			engine: {
				facadeTypology: "Biophilic Timber Louver",
				detailDensity: "intricate"
			}
		},
		{
			title: "Rift-Cut White Oak Acoustic Fluting",
			benchmark: "Veras",
			pain: "Prevents wood slats from turning into noisy striped moiré artifacts.",
			tip: "Calibrates natural matte oil specular rolloff on interior joinery.",
			prompt: "True-scale rift-cut white oak vertical fluted slats with black acoustic felt shadow reveals.",
			design: { color: "Oak" },
			scene3d: { primaryMaterial: "timber" }
		},
		{
			title: "Weathering Corten Steel Subtle Patina",
			benchmark: "LookX",
			pain: "Stops Corten facades from looking aggressively neon-orange or overly rusted.",
			tip: "Produces realistic deep iron-oxide umber variance.",
			prompt: "Architectural weathering Corten steel plates with authentic rain-drip patina and open shadow joints.",
			engine: {
				detailDensity: "intricate",
				styleTransferWeight: 68
			}
		},
		{
			title: "Hand-Troweled Mineral Limewash Plaster",
			benchmark: "Rendair",
			pain: "Eliminates sterile drywall smoothness with gentle chalky mineral tonal clouding.",
			tip: "Instant warmth for modern luxury & Mediterranean villas.",
			prompt: "Velvety hand-troweled mineral limewash walls catching soft raking window grazing light.",
			design: {
				color: "Warm white",
				mood: "Warm"
			}
		},
		{
			title: "Low-Iron Structural Glass Green-Tint Removal",
			benchmark: "Chaos Corona",
			pain: "Clears muddy green distortion so curtain-wall interiors read cleanly.",
			tip: "Accurate fresnel sky reflection calibrated at grazing angles.",
			prompt: "Ultra-clear low-iron structural glazing with crisp sky reflection and honest interior visibility.",
			impact: "High",
			engine: {
				facadeTypology: "Minimalist Glass",
				geometryLock: 92
			}
		},
		{
			title: "Waterstruck Petersen Nordic Clay Brick",
			benchmark: "LookX",
			pain: "Replaces repeating brick wallpapers with varied kiln-fired charcoal-sand bricks.",
			tip: "Includes recessed mortar bed shadow joints.",
			prompt: "Handcrafted waterstruck Nordic clay brickwork with natural kiln color variation and raked lime mortar.",
			engine: { facadeTypology: "Nordic Brick & Zinc" },
			scene3d: { primaryMaterial: "brick" }
		},
		{
			title: "Brushed Anodized Dark Bronze Mullions",
			benchmark: "Veras",
			pain: "Upgrades flat black window lines with subtle anisotropic bronze highlights.",
			tip: "Catches golden-hour rim light cleanly along window profiles.",
			prompt: "Dark oil-rubbed brushed bronze window frames showing subtle anisotropic metallic sheen."
		},
		{
			title: "Standing-Seam Pre-Weathered Titanium Zinc",
			benchmark: "LookX",
			pain: "Adds authentic folded seam ribs and slight oil-canning realism to metal roofs.",
			tip: "Matches coastal and Nordic institutional aesthetics.",
			prompt: "Matte quartz-gray standing-seam zinc facade & roof cladding with realistic panel seam variation.",
			engine: { facadeTypology: "Nordic Brick & Zinc" }
		},
		{
			title: "Poured Terrazzo Aggregate Micro-Specularity",
			benchmark: "Chaos Corona",
			pain: "Prevents speckled floor tiles from turning into noisy pixel grain.",
			tip: "Calibrated satin floor reflection with brass divider strips.",
			prompt: "Honed pale terrazzo flooring with delicate marble chips, brass inlay strips, and satin sheen."
		},
		{
			title: "Bouclé & Raw Belgian Linen Upholstery",
			benchmark: "Chaos Corona",
			pain: "Gives living room sofas soft edge fuzz and believable cushion compression.",
			tip: "Stops furniture from looking stiff like hard molded plastic.",
			prompt: "Tactile oatmeal bouclé sectional upholstery and draped raw Belgian linen curtains catching daylight."
		},
		{
			title: "Bush-Hammered Granite Exterior Plinth",
			benchmark: "Rendair",
			pain: "Grounds civic buildings with slip-resistant chipped stone base courses.",
			tip: "Great contrast under glass curtain walls.",
			prompt: "Coarse bush-hammered silver granite base plinth meeting manicured gravel drainage swale."
		},
		{
			title: "Microcement Seamless Wet-Room Finish",
			benchmark: "Veras",
			pain: "Removes awkward tile grout grids in minimalist spa & bath interiors.",
			tip: "Clean continuous waterproof mineral finish.",
			prompt: "Seamless warm-taupe waxed microcement bathroom walls and integrated monolithic basin."
		},
		{
			title: "Patinated Brass Architectural Hardware",
			benchmark: "Chaos Corona",
			pain: "Swaps harsh chrome hotspots for warm satin living-brass fixtures.",
			tip: "Elevates kitchen islands, pivot handles, and pendants.",
			prompt: "Hand-aged satin brass cabinet pulls, gooseneck tapware, and linear dining pendant."
		},
		{
			title: "Exposed Cross-Laminated Timber (CLT) Soffit",
			benchmark: "LookX",
			pain: "Shows honest spruce laminations on sustainable mass-timber ceilings.",
			tip: "Pairs naturally with black structural steel knife-plate connectors.",
			prompt: "Exposed cross-laminated spruce timber ceiling beams joined with matte black steel knife plates.",
			scene3d: { primaryMaterial: "timber" }
		},
		{
			title: "Reeded Glass Privacy Partition Refraction",
			benchmark: "Chaos Corona",
			pain: "Fixes flat frosted panels by accurately fluting background silhouettes.",
			tip: "Sophisticated divider for home offices and boutique hospitality.",
			prompt: "Vertical fluted reeded glass interior partition softly distorting warm room light behind."
		},
		{
			title: "Split-Face Limestone dry-stack Garden Wall",
			benchmark: "D5 Render",
			pain: "Adds deep shadow relief to landscape retaining walls and villas.",
			tip: "Prevents blurry smoothed boulders.",
			prompt: "Dry-stack split-face pale limestone boundary wall with crisp irregular shadow pockets."
		},
		{
			title: "Perforated Anodized Aluminum Kinetic Veil",
			benchmark: "LookX",
			pain: "Preserves geometric perforation moiré without turning panels solid.",
			tip: "Ideal for cultural museums and parking screen facades.",
			prompt: "Precision CNC-perforated champagne anodized aluminum sunscreen veil with sharp daylight glow.",
			engine: { facadeTypology: "Parametric Kinetic Facade" }
		},
		{
			title: "Calibrated Roughness & Specular Breakup Pass",
			benchmark: "Magnific",
			pain: "Breaks uniform CG glossiness using micro-scuffs, patina, and dust modulation.",
			tip: "Makes surfaces read like a real architectural photograph.",
			prompt: "Physically varied micro-roughness breakup across stone, timber, glass, and metal junctions.",
			impact: "High",
			engine: {
				enhanceMode: "micro-detail",
				renderFidelity: "photoreal",
				materialOverride: 62
			}
		}
	],
	"sketch-conditioning": [
		{
			title: "Marker-on-Trace Sketch → Hero Render",
			benchmark: "Rendair",
			pain: "Turns loose napkin/trace sketches into grounded perspective plates fast.",
			tip: "Balances 85% edge adherence so creative massing breathes.",
			prompt: "Translate loose architectural pen sketch lines directly into true-scale daylight materials and sky.",
			impact: "High",
			engine: {
				workflowPreset: "sketch-to-render",
				sketchMode: "faithful",
				edgeAdherence: 86,
				annotatorMode: "lineart"
			}
		},
		{
			title: "3D Clay Viewport → Photoreal Finish",
			benchmark: "Veras",
			pain: "Skips slow offline path-tracing by promoting white clay viewport grabs.",
			tip: "One click turns 3D studio clay snapshots into client-ready plates.",
			prompt: "Promote untextured 3D clay massing geometry into physically accurate materials with natural GI.",
			impact: "High",
			engine: {
				workflowPreset: "clay-to-render",
				geometryLock: 90,
				depthEnabled: true,
				depthWeight: 78
			}
		},
		{
			title: "Orthographic Elevation → Textured Facade",
			benchmark: "LookX",
			pain: "Stops flat CAD elevations from distorting into fake 3D perspective.",
			tip: "Maintains strict orthographic flatness with realistic shadow depth.",
			prompt: "True orthographic elevation visualization with flat camera projection, crisp mullions, and natural sun shadow.",
			impact: "High",
			engine: {
				workflowPreset: "elevation-to-render",
				annotatorMode: "mlsd",
				geometryLock: 95
			}
		},
		{
			title: "2D Floor Plan → Furnished Axonometric Cut",
			benchmark: "Rendair",
			pain: "Brings dry CAD plans to life for residential buyers in one step.",
			tip: "Keeps walls exact while extruding oak floors, rugs, and seating.",
			prompt: "Architectural 3D cutaway isometric floor plan with warm oak flooring, curated furniture, and soft daylight.",
			impact: "High",
			engine: {
				workflowPreset: "plan-to-3d",
				edgeAdherence: 92,
				geometryLock: 84
			}
		},
		{
			title: "Depth-Anything V2 Foggy Depth Guidance",
			benchmark: "Krea",
			pain: "Fixes perspective confusion between foreground trees and background facade.",
			tip: "Separates spatial depth planes cleanly.",
			prompt: "Deep foreground-midground-background spatial separation guided by accurate depth plane hierarchy.",
			engine: {
				depthEnabled: true,
				depthWeight: 84
			}
		},
		{
			title: "Canny Crisp Linework Facade Control",
			benchmark: "Krea",
			pain: "Holds ultra-fine stair treads, mullions, and joints crisp without blur.",
			tip: "Use threshold ~45 for balanced architectural linework fidelity.",
			prompt: "Razor-sharp Canny edge preservation across mullions, stone joints, and cantilevered roof edges.",
			engine: {
				annotatorMode: "canny",
				annotatorThreshold: 45,
				edgeAdherence: 88
			}
		},
		{
			title: "Normal Map Relief Texture Enforcement",
			benchmark: "Chaos Corona",
			pain: "Ensures relief masonry, fluted panels, and soffits catch directional sun.",
			tip: "Feeds surface normal vectors into lighting bounce.",
			prompt: "Surface-normal relief enforcement for crisp flute shadows, ashlar bevels, and mortar reveals.",
			engine: {
				annotatorMode: "normal",
				geometryLock: 89
			}
		},
		{
			title: "Redline Sketch Markup Insertion",
			benchmark: "Rendair",
			pain: "Lets architects draw a quick redline box and convert it to proportional furniture.",
			tip: "Ideal with SAM-2 / Inpaint annotation brush.",
			prompt: "Seamlessly integrate annotated redline element in exact perspective scale matching surrounding lighting.",
			engine: {
				workflowPreset: "photoreal",
				inpaintStrength: 68
			}
		},
		{
			title: "White Foam Competition Model Aesthetic",
			benchmark: "LookX",
			pain: "Produces clean competition diagrams when materials aren't finalized yet.",
			tip: "Crisp basswood trees, matte white museum board, and pure sunlight.",
			prompt: "Physical architectural competition scale model in matte museum board, basswood contour plinth, studio light.",
			impact: "High",
			design: {
				look: "Massing",
				color: "Warm white",
				mood: "Quiet"
			},
			engine: {
				workflowPreset: "clay-to-render",
				materialOverride: 25,
				geometryLock: 94
			}
		},
		{
			title: "Sectional Perspective Occupancy Storytelling",
			benchmark: "LookX",
			pain: "Makes complex cultural sectional cuts immediately legible to non-architects.",
			tip: "Pairs crisp black section poché with warm inhabited interior rooms.",
			prompt: "Detailed architectural sectional perspective with clean crisp cut poché and illuminated interior life.",
			engine: {
				workflowPreset: "elevation-to-render",
				detailDensity: "intricate"
			}
		},
		{
			title: "Charcoal & Graphite Early Massing Study",
			benchmark: "PromeAI",
			pain: "Avoids premature photorealism during early schematic client check-ins.",
			tip: "Wait — keep benchmark clean; conveys poetic hand-drawn warmth.",
			prompt: "Expressive architectural graphite and warm wash concept illustration on heavyweight cotton rag.",
			engine: {
				workflowPreset: "sketch-to-render",
				sketchMode: "creative",
				mjStylize: 320
			}
		},
		{
			title: "Rhino / Revit Viewport Screenshot Upgrade",
			benchmark: "Veras",
			pain: "Fixes jagged viewport anti-aliasing and flat OpenGL shading instantly.",
			tip: "Drop any raw CAD viewport grab and enable 85% Geometry Lock.",
			prompt: "Transform raw CAD viewport screenshot into full global illumination photoreal architectural plate.",
			impact: "High",
			engine: {
				workflowPreset: "photoreal",
				geometryLock: 88,
				annotatorMode: "mlsd"
			}
		},
		{
			title: "Multi-Reference Style + Massing Split",
			benchmark: "Krea",
			pain: "Stops reference photos from overriding your building's actual shape.",
			tip: "Keeps slot 1 for Massing structure and slot 2 strictly for Materials.",
			prompt: "Decoupled control: lock massing geometry from primary capture while transferring material warmth from reference.",
			impact: "High",
			engine: {
				ipAdapterEnabled: true,
				ipAdapterPreset: "style-composition",
				ipAdapterWeight: 68
			}
		},
		{
			title: "SoftEdge Organic Landscape Contour Hold",
			benchmark: "LookX",
			pain: "Prevents rigid Canny lines from hardening flowing planting beds and trees.",
			tip: "Best for organic landscape & courtyard studies.",
			prompt: "Flowing organic planting beds, curved gravel paths, and soft boulder contours without hard polygonal edges.",
			engine: {
				annotatorMode: "softedge",
				geometryLock: 80
			}
		},
		{
			title: "Sketch-to-Night Atmospheric Pivot",
			benchmark: "Rendair",
			pain: "Transforms daytime black-on-white pencil sketches directly into dusk hero views.",
			tip: "Keeps linework perspective while illuminating windows from scratch.",
			prompt: "Convert black-line architectural sketch directly into glowing dusk visualization against cobalt twilight.",
			design: {
				light: "Evening",
				time: "Evening",
				mood: "Warm"
			},
			engine: {
				workflowPreset: "sketch-to-render",
				edgeAdherence: 84
			}
		},
		{
			title: "GLB Imported Model Studio Capture Sync",
			benchmark: "D5 Render",
			pain: "Bridges imported client .glb / .obj models directly into AI materialization.",
			tip: "Import GLB in 3D Viewport -> Lock Angle -> Render Photoreal.",
			prompt: "Materialize imported 3D GLB massing geometry with physically based reflections and ambient occlusion.",
			impact: "High",
			engine: {
				workflowPreset: "clay-to-render",
				geometryLock: 92,
				depthEnabled: true
			}
		},
		{
			title: "MLSD Straight-Line Interior Perspective Guard",
			benchmark: "Veras",
			pain: "Fixes slightly skewed hand-drawn room perspectives into true vertical corners.",
			tip: "Ideal for quick iPad Procreate interior room sketches.",
			prompt: "Enforce crisp MLSD orthogonal wall intersections, ceiling coves, and true two-point verticals.",
			engine: {
				annotatorMode: "mlsd",
				edgeAdherence: 91
			}
		},
		{
			title: "Real-Time Krea-Style Draft Stream Boost",
			benchmark: "Krea",
			pain: "Eliminates slow 30-second waits while orbiting cameras or moving sun azimuth.",
			tip: "Enables live interactive preview updates as you explore.",
			prompt: "Fast responsive architectural iteration balancing clean massing readability with cohesive palette.",
			engine: {
				liveStreamEnabled: true,
				renderFidelity: "photoreal"
			}
		},
		{
			title: "Competition Diagrammatic Site Context Overlay",
			benchmark: "LookX",
			pain: "Clearly highlights the proposed building while keeping adjacent urban blocks understated.",
			tip: "Draws eyes straight to your design intervention.",
			prompt: "Architectural hero building fully detailed against softly desaturated matte limestone urban neighbor blocks.",
			engine: {
				workflowPreset: "photoreal",
				geometryLock: 86
			}
		},
		{
			title: "Lineart Ink Wash Presentation Plate",
			benchmark: "Rendair",
			pain: "Offers a refined hybrid between fine architectural pen ink and soft watercolor mass.",
			tip: "Popular for civic town hall meetings and early donor approvals.",
			prompt: "Precision architectural ink linework layered with delicate atmospheric watercolor light washes.",
			engine: {
				annotatorMode: "lineart",
				sketchMode: "balanced",
				mjStylize: 240
			}
		}
	],
	"camera-optics": [
		{
			title: "2-Point Architectural Tilt-Shift Verticals",
			benchmark: "Chaos Corona",
			pain: "Eliminates converging vertical building lines that look amateurish.",
			tip: "Enables vertical shift compensation automatically in 3D & prompt.",
			prompt: "True 2-point architectural tilt-shift perspective with strictly parallel vertical building edges.",
			impact: "High",
			scene3d: {
				twoPointTilt: true,
				focalLength: 24
			},
			design: { camera: "Eye level" }
		},
		{
			title: "24mm Wide Interior Spatial Flow",
			benchmark: "Chaos Corona",
			pain: "Captures full kitchen-to-living flow without awkward fisheye stretching.",
			tip: "Balanced 24mm shift lens keeps foreground armchairs un-distorted.",
			prompt: "24mm architectural tilt-shift interior wide perspective with zero barrel distortion at frame edges.",
			scene3d: {
				focalLength: 24,
				twoPointTilt: true
			},
			design: { camera: "Wide" }
		},
		{
			title: "35mm Documentary Monograph Prime",
			benchmark: "Chaos Corona",
			pain: "Fixes sterile overly wide CGI spaces with natural human-eye compression.",
			tip: "The gold-standard lens focal length for Architectural Digest & El Croquis.",
			prompt: "Leica 35mm documentary architectural prime lens compression with calm natural perspective.",
			impact: "High",
			scene3d: {
				focalLength: 35,
				cameraPreset: "eye"
			},
			design: { camera: "Eye level" }
		},
		{
			title: "50mm Tactile Material Joinery Vignette",
			benchmark: "Chaos Corona",
			pain: "Zooms in gracefully on stone-to-timber thresholds without losing room context.",
			tip: "Ideal for detail closeups in client finish books.",
			prompt: "50mm standard prime detail shot highlighting stone-to-oak junction craftsmanship and shallow DOF.",
			scene3d: {
				focalLength: 50,
				cameraPreset: "detail"
			},
			design: { camera: "Close detail" }
		},
		{
			title: "85mm Telephoto Courtyard Compression",
			benchmark: "D5 Render",
			pain: "Stacks foreground foliage, colonnades, and distant pavilion into painterly layers.",
			tip: "Turns wide empty plazas into intimate framed vignettes.",
			prompt: "85mm telephoto architectural compression layering foreground olive branches with crisp stone facade.",
			scene3d: {
				focalLength: 85,
				twoPointTilt: true
			}
		},
		{
			title: "Human Eye-Level 1.65m Horizon Lock",
			benchmark: "Veras",
			pain: "Avoids floating chest-high or ceiling-scraping camera angles.",
			tip: "Anchors viewer naturally inside the courtyard or foyer.",
			prompt: "True 1.65m standing eye-level horizon line centered for natural human spatial immersion.",
			scene3d: { cameraPreset: "eye" },
			design: { camera: "Eye level" }
		},
		{
			title: "Elevated 45° Oblique Three-Quarter",
			benchmark: "Rendair",
			pain: "Shows roof garden terrace + two facades in a single explanatory shot.",
			tip: "Best for residential villas and campus cluster briefs.",
			prompt: "Elevated three-quarter architectural perspective revealing both street elevation and upper terrace.",
			scene3d: { cameraPreset: "oblique" },
			design: { camera: "Elevated" }
		},
		{
			title: "Drone Masterplan Aerial Site Integration",
			benchmark: "LookX",
			pain: "Prevents aerial shots from looking like miniature toy models via haze & scale.",
			tip: "Pairs natural tree canopy variation with contextual street grids.",
			prompt: "Crisp high-altitude drone masterplan view anchoring site topography into surrounding urban fabric.",
			scene3d: {
				cameraPreset: "aerial",
				fogDensity: 18
			}
		},
		{
			title: "Symmetrical One-Point Gallery Axis",
			benchmark: "Chaos Corona",
			pain: "Reigns in cluttered off-axis angles when shooting ceremonial foyers.",
			tip: "Emphasizes axial portal vistas and reflection symmetry.",
			prompt: "Dead-center axial one-point perspective framing symmetrical portal vista and aligned pendant row.",
			scene3d: {
				focalLength: 35,
				twoPointTilt: true
			}
		},
		{
			title: "Framing Through Architectural Thresholds",
			benchmark: "Chaos Corona",
			pain: "Fixes flat unlayered exteriors by placing dark timber/stone threshold framing in front.",
			tip: "Creates cinematic depth into illuminated garden rooms.",
			prompt: "Framed foreground threshold looking through shadowed colonnade toward sunlit courtyard garden."
		},
		{
			title: "21:9 CinemaScope Panoramic Outpaint Frame",
			benchmark: "Krea",
			pain: "Fixes tightly cropped 3D captures by seamlessly extending sky & flanking context.",
			tip: "Turns cramped exports into sweeping competition boards.",
			prompt: "Panoramic 21:9 architectural vista seamlessly extending flanking garden walls and sky horizon.",
			engine: { outpaintRatio: "21:9" },
			frame: { ratio: "16:9" }
		},
		{
			title: "9:16 Vertical Editorial Story Composition",
			benchmark: "Krea",
			pain: "Saves vertical height of atriums, staircases, and residential towers cleanly.",
			tip: "Optimizes framing for mobile client decks and social showcases.",
			prompt: "Vertical 9:16 architectural portrait emphasizing towering height, double-height glazing, and sky zenith.",
			frame: { ratio: "9:16" }
		},
		{
			title: "Rule-of-Thirds Pool & Villa Balance",
			benchmark: "D5 Render",
			pain: "Prevents busy center-weighted compositions where pool water fights the facade.",
			tip: "Places horizon comfortably on lower third with clean negative sky.",
			prompt: "Balanced rule-of-thirds composition pairing quiet foreground reflecting water with crisp villa volume."
		},
		{
			title: "Low-Angle Civic Monumentality Look-Up",
			benchmark: "LookX",
			pain: "Gives cultural pavilions and cantilevers dramatic upward sculptural poise.",
			tip: "Use subtle 24mm shift so undersides of eaves shine cleanly.",
			prompt: "Respectful low-angle upward vista celebrating deep timber soffit cantilever against crisp sky.",
			scene3d: {
				focalLength: 24,
				twoPointTilt: false
			}
		},
		{
			title: "Cross-Room Layered Aperture Vista",
			benchmark: "Chaos Corona",
			pain: "Eliminates dead-end flat room photos by opening pocket doors into secondary rooms.",
			tip: "Shows dining room -> courtyard -> studio depth in one frame.",
			prompt: "Multi-layered interior vista looking across dining island through sliding pocket glazing into garden."
		},
		{
			title: "Locked Multi-Angle Consistent Camera Rig",
			benchmark: "Veras",
			pain: "Stops different camera views of the same building from changing cladding materials.",
			tip: "Locks seed + House Style across Interior, Exterior, and Detail views.",
			prompt: "Multi-angle consistency lock: preserve identical travertine shade, oak stain, and sky exposure across cameras.",
			impact: "High",
			engine: {
				seedLocked: true,
				geometryLock: 92
			}
		},
		{
			title: "Gentle Foreground Vignette Depth Falloff",
			benchmark: "D5 Render",
			pain: "Draws eyes cleanly onto the architectural entrance rather than foreground pavement.",
			tip: "Subtle natural lens falloff without artificial heavy black corners.",
			prompt: "Subtle natural medium-format lens corner falloff guiding attention softly to glowing entry portal."
		},
		{
			title: "Zero-Warped Furniture Edge Margin",
			benchmark: "Rendair",
			pain: "Prevents lounge chairs and coffee tables near frame corners from stretching oval.",
			tip: "Switches from ultrawide distortion to clean 35mm orthographic feel.",
			prompt: "Zero edge-stretching geometry across foreground lounge chairs, coffee table, and carpet corners.",
			scene3d: { focalLength: 35 }
		},
		{
			title: "4:3 Architectural Monograph Print Crop",
			benchmark: "Chaos Corona",
			pain: "Gives generous vertical headroom above roofs & trees for print publications.",
			tip: "Switches studio aspect ratio cleanly to 4:3 editorial print.",
			prompt: "Classic 4:3 architectural monograph framing balancing sky breathing room and foreground plinth.",
			frame: { ratio: "4:3" }
		},
		{
			title: "Smooth Orbit-Dolly-Zoom Flythrough Ready",
			benchmark: "D5 Render",
			pain: "Ensures keyframe camera positions don't clip through columns during 4s clips.",
			tip: "Sets eye-level clear sightline height ready for 3D flythrough capture.",
			prompt: "Unobstructed clear sightline framing prepared for smooth camera orbit-dolly-zoom transition.",
			queue: {
				label: "Camera Rig Hero Frame",
				preset: "photoreal",
				light: "Golden hour",
				cameraPreset: "oblique"
			}
		}
	],
	"entourage-landscape": [
		{
			title: "Subtle 1/15s Motion-Blurred Gallery Figures",
			benchmark: "Chaos Corona",
			pain: "Fixes stiff frozen mannequin-like AI people looking straight into the lens.",
			tip: "Adds authentic editorial tripod exposure movement to walking visitors.",
			prompt: "Two architectural scale visitors mid-stride with natural subtle 1/15s slow-shutter motion blur.",
			impact: "High",
			design: {
				people: "Few",
				activity: "Walking"
			}
		},
		{
			title: "Zero-Crowding Quiet Hospitality Occupancy",
			benchmark: "D5 Render",
			pain: "Stops AI from jamming 40 cartoon tourists into a calm boutique lobby.",
			tip: "Sets calibrated sparse human scale without visual clutter.",
			prompt: "Calm sparse occupancy: two seated guests reading softly in silhouette without blocking millwork.",
			design: {
				people: "Few",
				activity: "Sitting",
				mood: "Serene"
			}
		},
		{
			title: "Mediterranean Gnarled Specimen Olive Trees",
			benchmark: "D5 Render",
			pain: "Replaces generic blobby lollipop trees with sculptural silver-leaf olive silhouettes.",
			tip: "Includes realistic dry-stone planter beds & lavender undergrowth.",
			prompt: "Sculptural specimen ancient olive trees with silver-green leaves casting crisp shadow patterns.",
			engine: { climateRegion: "Temperate Coastal" }
		},
		{
			title: "Native Pennisetum & Miscanthus Meadow Grasses",
			benchmark: "LookX",
			pain: "Replaces artificial neon-green golf-course lawns with ecological native planting.",
			tip: "Backlit feathery grasses glow beautifully at Golden Hour.",
			prompt: "Ornamental windswept feather grasses and native perennials catching warm backlit evening sun.",
			design: {
				light: "Golden hour",
				mood: "Warm"
			}
		},
		{
			title: "Urban Pocket Courtyard Birch Groves",
			benchmark: "D5 Render",
			pain: "Adds slim airy birch trunks that reveal facade architecture behind leaves.",
			tip: "Won't block windows or obscure elevation lines.",
			prompt: "Slender multi-stem white silver birches allowing clean architectural facade visibility through foliage."
		},
		{
			title: "Calibrated Wind-Ripple Pool Water Caustics",
			benchmark: "Chaos Corona",
			pain: "Fixes flat plastic turquoise water planes on courtyard infinity pools.",
			tip: "Adds subtle surface breeze ripples and natural limestone edge wetting.",
			prompt: "Crystal-clear infinity pool with delicate breeze micro-ripples, soft stone caustics, and wet coping edge."
		},
		{
			title: "Autumn Amber Canopy & Scattered Leaves",
			benchmark: "LookX",
			pain: "Brings crisp seasonal warmth to timber and brick educational campuses.",
			tip: "Scatters natural dry leaves lightly along granite curbs.",
			prompt: "Golden-amber autumn maple canopy with sparse fallen leaves resting along crisp granite plaza joints.",
			design: {
				mood: "Warm",
				color: "Oak"
			}
		},
		{
			title: "Subtropical Monstera, Fan Palm & Timber Deck",
			benchmark: "D5 Render",
			pain: "Grounds resort residences in lush layered rainforest shade rather than barren dirt.",
			tip: "Aligns broadleaf textures cleanly with teak louver eaves.",
			prompt: "Layered subtropical courtyard ferns, sculptural fan palms, and dark volcanic stepping stones.",
			engine: { climateRegion: "Subtropical Humid" }
		},
		{
			title: "Human Scale Shadow Grounding Check",
			benchmark: "Veras",
			pain: "Fixes floating pasted-on people who lack ambient contact shadows on paving.",
			tip: "Enforces soft occlusion right beneath footwear and chair legs.",
			prompt: "Every seated and standing scale figure firmly grounded with crisp sun and contact occlusion shadows.",
			impact: "High"
		},
		{
			title: "Cafe Terrace Table Setting Storytelling",
			benchmark: "Rendair",
			pain: "Replaces bare empty plaza tables with subtle linen, espresso cups, and brass lamps.",
			tip: "Gives hospitality renders an immediate lived-in boutique feel.",
			prompt: "Curated terrace bistro tables with matte stoneware cups, warm rechargeable table lamps, and shade.",
			design: {
				activity: "Dining",
				people: "Medium"
			}
		},
		{
			title: "Urban Cyclist & Transit Edge Activity",
			benchmark: "LookX",
			pain: "Connects civic transit halls realistically to active streetscape bicycle lanes.",
			tip: "Adds natural scale cue along wide public plazas.",
			prompt: "Soft-motion urban commuters passing neatly by illuminated ground-floor public arcade colonnade.",
			engine: { climateRegion: "Urban Dense" }
		},
		{
			title: "Gravel Permeable Garden Drainage Border",
			benchmark: "Chaos Corona",
			pain: "Stops wall bases from awkwardly meeting green lawn without an architectural edge.",
			tip: "Adds a clean 40cm French gravel & steel edging strip.",
			prompt: "Architectural 40cm pale pea-gravel French drain perimeter edged with crisp galvanized steel."
		},
		{
			title: "Rooftop Biodiversity Sedum Blanket",
			benchmark: "LookX",
			pain: "Transforms dull grey flat membrane roofs in aerial shots into living green roofs.",
			tip: "Includes modular stone ballast walkways and sleek solar arrays.",
			prompt: "Vegetated extensive sedum green roof tray modules framed by pale river-stone ballast walkways."
		},
		{
			title: "Weathered Cedar Outdoor Pergola Lounging",
			benchmark: "Rendair",
			pain: "Integrates minimalist outdoor sunbeds naturally alongside pool pavilions.",
			tip: "Matches teak frames cleanly to indoor oak flooring.",
			prompt: "Low-slung teak outdoor lounge beds with muted stone-grey cushions beneath slatted pergola shade."
		},
		{
			title: "Monsoon Raindrops & Wet Terracotta Coping",
			benchmark: "D5 Render",
			pain: "Captures authentic humid climate richness rather than dry desert renders.",
			tip: "Darkens wet stone tones realistically at splash zones.",
			prompt: "Dampened dark stone rain-splash zones along terraced planters with humid misty atmosphere.",
			design: {
				weather: "Mist",
				mood: "Serene"
			}
		},
		{
			title: "Minimalist Art Plinth & Gallery Pedestal Staging",
			benchmark: "Chaos Corona",
			pain: "Avoids generic AI stock art by requesting subtle tonal abstract sculpture/canvas.",
			tip: "Harmonizes interior focal wall art with architectural limestone.",
			prompt: "Tactile plaster relief canvas and cast bronze plinth sculpture scaled proportionately to foyer wall."
		},
		{
			title: "Desert Xeriscape Agave & Boulders",
			benchmark: "D5 Render",
			pain: "Stops desert projects from accidentally spawning lush wet grass lawns.",
			tip: "Places weathered desert granite boulders, agaves, and decomposed granite.",
			prompt: "Authentic arid xeriscape courtyard with sculptural agave, prickly pear, and warm decomposed granite.",
			engine: { climateRegion: "Arid Desert" }
		},
		{
			title: "Subtle Vehicle Reflection Scale Restraint",
			benchmark: "Veras",
			pain: "Prevents flashy fake supercars from distracting from residential architecture.",
			tip: "Keeps driveways calm with understated matte sedans or clean clear paving.",
			prompt: "Unobtrusive understated electric sedan parked quietly in shadow without chrome reflection distraction."
		},
		{
			title: "Evening Architectural Bollard Path Rhythm",
			benchmark: "D5 Render",
			pain: "Replaces harsh stadium floodlights with low-glare warm knee-height pathway bollards.",
			tip: "Guides eye from driveway curb right up to the front pivot door.",
			prompt: "Warm shielded 2700K dark-bronze pathway bollards washing limestone garden treads at dusk.",
			design: {
				light: "Evening",
				time: "Evening"
			}
		},
		{
			title: "Window Interior Backdrop Curtains & Life",
			benchmark: "Veras",
			pain: "Stops exterior windows from looking like blank dark mirrors or empty shells.",
			tip: "Places warm sheer curtains, hanging pendants, and bookshelves softly inside.",
			prompt: "Subtly visible warm interior rooms behind glazing with sheer linen drapery and soft bookwall.",
			impact: "High"
		}
	],
	"post-upscale": [
		{
			title: "Magnific-Style 4× Tile Micro-Detail Recovery",
			benchmark: "Magnific",
			pain: "Eliminates smudged foliage, fabric, and stone grain in raw 1K draft plates.",
			tip: "Preserves exact silhouette while hallucinating realistic 4× pores.",
			prompt: "High-frequency micro-detail recovery across travertine pores, linen weave, oak grain, and leaf veins.",
			impact: "High",
			engine: {
				enhanceMode: "micro-detail",
				upscaleFactor: 4,
				esrganModel: "4x-ArchSharp",
				esrganDenoise: 22
			}
		},
		{
			title: "8K Print-Ready Client Presentation Upscale",
			benchmark: "Magnific",
			pain: "Fixes pixelation when clients inspect 4K/8K wall monitors or print boards.",
			tip: "Switches frame resolution target to 2K + 4× ArchSharp upscaling.",
			prompt: "Sharp 8K architectural presentation print master free of banding, chromatic fringe, or haloing.",
			impact: "High",
			frame: { resolution: "2k" },
			engine: {
				upscaleFactor: 8,
				esrganModel: "4x-ArchSharp",
				enhanceMode: "micro-detail"
			}
		},
		{
			title: "12K–15K Exhibition Wall Mural Export Prep",
			benchmark: "Magnific",
			pain: "Prevents tile seam artifacts when scaling renders for showroom trade-show walls.",
			tip: "Low tile denoise (18%) + 8× ArchSharp model holds crisp straight lines.",
			prompt: "Exhibition mural 15K-grade ultra-crisp edge retention with balanced micro-film grain.",
			frame: { resolution: "2k" },
			engine: {
				upscaleFactor: 8,
				esrganDenoise: 18,
				esrganFaceEnhance: true
			}
		},
		{
			title: "Grounded-SAM 2 Selective Furniture Swap Prep",
			benchmark: "Krea",
			pain: "Lets users click a single sofa or island to swap it without touching walls or light.",
			tip: "Click SAM-2 Seg -> click furniture -> apply Google reference or prompt swap.",
			prompt: "Localized furniture replacement inside segmented mask matching exact floor shadow direction.",
			impact: "High",
			engine: {
				iopaintTask: "replace",
				iopaintModel: "brushnet",
				samThreshold: 55
			}
		},
		{
			title: "Grounded-SAM 2 Cladding & Facade Zone Mask",
			benchmark: "Veras",
			pain: "Isolates exterior cladding strictly so windows and sky never get repainted.",
			tip: "Use with SAM-2 click selection + Materials & Finishes swap.",
			prompt: "Re-clad isolated facade mask zone strictly while keeping glass reflections, mullions, and sky untouched.",
			engine: {
				iopaintTask: "replace",
				samPrompt: "exterior wall facade cladding",
				geometryLock: 94
			}
		},
		{
			title: "IOPaint Clean Wire & Crane Removal (LaMa)",
			benchmark: "Krea",
			pain: "Cleans overhead power lines, construction cones, or site signs from site photos.",
			tip: "Select brush or SAM-2 -> Erase with LaMa for spotless site photos.",
			prompt: "Spotless site photo cleanup erasing temporary construction signage and overhead powerlines naturally.",
			engine: {
				iopaintTask: "erase",
				iopaintModel: "lama",
				iopaintMaskDilate: 8
			}
		},
		{
			title: "Paint-by-Example Reference Furniture Integration",
			benchmark: "Krea",
			pain: "Places an exact client reference chair or luminaire proportionally into the room.",
			tip: "Pair reference image URL inside IOPaint / Annotation mask.",
			prompt: "Paint-by-example proportion match integrating reference furniture piece cleanly into perspective grid.",
			engine: {
				iopaintTask: "paint-by-example",
				iopaintModel: "paint-by-example"
			}
		},
		{
			title: "Client-Proof Deterministic Seed Freeze",
			benchmark: "Veras",
			pain: "Fixes erratic changes when tweaking a single word in prompt notes.",
			tip: "Locks RNG seed + geometry so edits stay surgical and predictable.",
			prompt: "Seed-locked surgical refinement keeping composition, camera framing, and light angles invariant.",
			impact: "High",
			engine: {
				seedLocked: true,
				geometryLock: 92
			}
		},
		{
			title: "Chromatic Aberration & Halo Cleanup QC",
			benchmark: "Chaos Corona",
			pain: "Removes over-sharpened white/dark halos along roof silhouettes against bright skies.",
			tip: "Lowers sharpen aggressiveness while boosting optical lens cleanliness.",
			prompt: "Clean optical roof-to-sky transition free of sharpening halos, color fringe, or AI painterly artifacts.",
			engine: {
				renderFidelity: "editorial",
				esrganDenoise: 30
			}
		},
		{
			title: "Face & Gesture Cleanup on Architectural Figures",
			benchmark: "Magnific",
			pain: "Fixes melted hands or uncanny eyes on foreground human scale figures.",
			tip: "Enables GFPGAN subtle restoration pass on upscale.",
			prompt: "Natural subtle figure anatomy and crisp wardrobe drapery without distorted limbs.",
			engine: {
				esrganFaceEnhance: true,
				iopaintFaceModel: "gfpgan"
			}
		},
		{
			title: "Zero-Plastic Skin & Wood Grain De-Smoothing",
			benchmark: "Chaos Corona",
			pain: "Counters over-denoised waxy AI interiors with natural film silver grain.",
			tip: "Retains honest pores and subtle tactile imperfection.",
			prompt: "Fine natural 35mm medium-format silver grain preventing waxy synthetic CGI plastic surfaces.",
			engine: {
				esrganDenoise: 15,
				detailDensity: "intricate"
			}
		},
		{
			title: "Architectural Glare & Bloom Restraint",
			benchmark: "D5 Render",
			pain: "Turns off aggressive neon starbursts around sconces and track spots.",
			tip: "Creates clean photographic highlight rolloff like a real cinema sensor.",
			prompt: "Controlled natural highlight rolloff on linear sconces with zero artificial CGI lens-flare clutter.",
			design: { mood: "Quiet" }
		},
		{
			title: "Directional Floor & Ceiling Padding Uncrop",
			benchmark: "Krea",
			pain: "Fixes chopped-off ceiling coffers or cut-off foreground rug borders.",
			tip: "Use directional top/bottom pad in Inpaint Workspace cleanly.",
			prompt: "Seamless directional ceiling & foreground floor extension maintaining linear hardwood planks.",
			engine: { iopaintTask: "outpaint" }
		},
		{
			title: "Sky-Clean Background Isolation (RMBG-2.0)",
			benchmark: "Krea",
			pain: "Lets designers swap harsh gray site skies cleanly behind complex tree branches.",
			tip: "One click isolates foreground architecture cleanly.",
			prompt: "Crisp architectural silhouette separation preserving fine twig edges against clean sky replacement.",
			engine: { iopaintRemoveBgModel: "rmbg-2.0" }
		},
		{
			title: "AnyText Wayfinding & Building Signage Crispness",
			benchmark: "Krea",
			pain: "Stops garbled gibberish lettering on museum entrances or hotel lobbies.",
			tip: "Renders clean legible brass/stone wayfinding typography.",
			prompt: "Crisp legible architectural brass wayfinding signage integrated flush on honed limestone pier.",
			engine: {
				iopaintTask: "anytext",
				iopaintModel: "anytext"
			}
		},
		{
			title: "Contrast & Black-Point Editorial Calibration",
			benchmark: "Chaos Corona",
			pain: "Fixes washed-out milky shadows by anchoring true neutral architectural blacks.",
			tip: "Keeps shadow detail readable while adding magazine punch.",
			prompt: "Rich balanced shadow blacks and luminous stone midtones following architectural monograph grading."
		},
		{
			title: "Glazing Reflection Opacity Balance Pass",
			benchmark: "Veras",
			pain: "Stops glass windows from looking like solid silver chrome mirrors.",
			tip: "Shows subtle sky clouds blended smoothly with warm interior ceiling glow.",
			prompt: "Physically balanced 35% glazing sky reflection letting warm interior wood ceilings read clearly.",
			impact: "High"
		},
		{
			title: "Material Seam & Skirting Junction QC",
			benchmark: "Chaos Corona",
			pain: "Cleans messy wall-to-floor blurs where stone baseboards should meet wood.",
			tip: "Sharpened boundary junction detailing for luxury interiors.",
			prompt: "Crisp clean stone-to-hardwood floor expansion joint, brass T-strip, and flush baseboard reveal."
		},
		{
			title: "BrushNet Complex Texture Blend Recovery",
			benchmark: "Krea",
			pain: "Fixes hard rectangular paste seams after local brush inpainting.",
			tip: "Enables 10px mask dilation + BrushNet seamless blending.",
			prompt: "Seamless feathered texture and ambient bounce blending across edited interior zones.",
			engine: {
				iopaintModel: "brushnet",
				iopaintMaskDilate: 10
			}
		},
		{
			title: "Iterative A/B Split-Slider QC Checkpoint",
			benchmark: "Veras",
			pain: "Catches subtle window moves immediately by comparing directly against source.",
			tip: "Run Compare slider after every render before exporting to clients.",
			prompt: "Tolerance-checked photoreal plate verified for zero structural geometry deviation from baseline."
		}
	],
	"motion-360-client": [
		{
			title: "Day-to-Night Smooth Time-Lapse Transition",
			benchmark: "D5 Render",
			pain: "Clients want to see how a space feels from crisp morning coffee to evening dinner.",
			tip: "Queues Morning, Solar Noon, Golden Hour, and Midnight sequentially.",
			prompt: "Continuous day-to-night lighting sequence keeping exact furniture, trees, and framing static.",
			impact: "High",
			queue: {
				label: "Day-to-Night Keyframe",
				preset: "photoreal",
				light: "Evening",
				sunHour: 19.5
			}
		},
		{
			title: "3-Keyframe Orbit-Dolly-Zoom 4s Flythrough",
			benchmark: "D5 Render",
			pain: "Eliminates choppy jerky camera spins in quick client walkthrough teasers.",
			tip: "Record Orbit, Dolly, and Zoom inside 3D Viewport to generate smooth motion.",
			prompt: "Cinematic slow 4-second architectural orbit-dolly-zoom flythrough with stable temporal exposure.",
			impact: "High",
			scene3d: { cameraPreset: "oblique" }
		},
		{
			title: "360° Equirectangular Interior/Exterior Hotspot Walk",
			benchmark: "Chaos Corona",
			pain: "Lets clients step inside and look up at skylights & down at stone junctions freely.",
			tip: "Open 360° Tour stage directly after rendering your hero plate.",
			prompt: "Immersive 360-degree continuous horizon spatial panorama with natural balanced skylight exposure.",
			impact: "High"
		},
		{
			title: "Frozen Mood & Frozen Palette Session Lock",
			benchmark: "Veras",
			pain: "Stops 3D rotation or 2D-to-3D switches from accidentally resetting your house style.",
			tip: "Locks House Style DNA + Seed + Geometry Lock across all camera captures.",
			prompt: "Session mood freeze: enforce identical material palette, sun temperature, and contrast across angles.",
			impact: "High",
			engine: {
				seedLocked: true,
				geometryLock: 92,
				ipAdapterEnabled: true
			}
		},
		{
			title: "Client Option A / B / C Facade Comparison Pack",
			benchmark: "Veras",
			pain: "Replaces slow 3-day manual rendering of alternate limestone vs. brick vs. timber schemes.",
			tip: "Queues 3 clean material options with locked camera and sun angle.",
			prompt: "Option comparison pass: keep camera, lighting, and trees identical while varying primary cladding material.",
			impact: "High",
			queue: {
				label: "Material Option Pass",
				preset: "photoreal",
				light: "Golden hour"
			}
		},
		{
			title: "Node-Based 1-Click Image → Video → 360° Chain",
			benchmark: "Krea",
			pain: "Hides complex ComfyUI wiring behind 5 clean visual drag-and-drop nodes.",
			tip: "Use the Node Editor stage with Image, ControlNet, Video, 360°, and 3D nodes.",
			prompt: "Streamlined multi-output node workflow compiling conditioned image into motion and 360° outputs.",
			impact: "High"
		},
		{
			title: "GLB Custom CAD Model → Camera Capture → Render",
			benchmark: "D5 Render",
			pain: "Reduces friction importing client Rhino/SketchUp/Blender GLB files.",
			tip: "Drop .glb into 3D Viewport, frame camera inside/outside, capture & render.",
			prompt: "Photoreal architectural finish applied directly to captured custom GLB geometry viewport angle.",
			impact: "High",
			engine: {
				workflowPreset: "clay-to-render",
				geometryLock: 91
			}
		},
		{
			title: "Zero-Complication 3-Click Guided Brief Flow",
			benchmark: "Rendair",
			pain: "Prevents new architects from getting lost in 40 technical sliders.",
			tip: "Follow the top 3-step studio bar: Source -> Auto-Build Style -> Render.",
			prompt: "Accessible studio configuration balancing high architectural fidelity with streamlined defaults."
		},
		{
			title: "Batch Overnight Daylight + Angle Render Queue",
			benchmark: "Chaos Corona",
			pain: "Automates rendering 6 variations sequentially while the designer reviews other sheets.",
			tip: "Add scenes to Render Queue with visual status progress bars.",
			prompt: "Consistent batch visualization pass sharing unified firm color grade and lens optics.",
			queue: {
				label: "Overnight Hero Batch",
				preset: "photoreal",
				light: "Daylight",
				sunHour: 10
			}
		},
		{
			title: "Skill Preset Capture for N-Image Batch Reuse",
			benchmark: "Veras",
			pain: "Saves designers from re-entering the same prompt & look across 20 room views.",
			tip: "Apply saved Market Copilot selections across every new photo dropped in.",
			prompt: "Reusable firm preset blueprint applying cohesive materials, optics, and lighting across project sets."
		},
		{
			title: "Annotated Spatial Proportion Brief PDF Export",
			benchmark: "Rendair",
			pain: "Clients demand clean PDF spec decks rather than loose chat screenshots.",
			tip: "Use Brief Builder's PDF Presentation export after building your vision.",
			prompt: "Client presentation specification ready: crystal material legibility and balanced daylight."
		},
		{
			title: "Unique-Link Team Review & Pin Markup Sync",
			benchmark: "Krea",
			pain: "Eliminates messy emailed screenshot circles during partner design critiques.",
			tip: "Share unique project link so teammates comment and pin directly on renders.",
			prompt: "Collaborative review baseline render prepared for clear pin-point revision feedback."
		},
		{
			title: "Automated Reference Moodboard Inspiration Sync",
			benchmark: "Rendair",
			pain: "Saves 45 minutes of Pinterest hunting before kicking off client mood approvals.",
			tip: "Use Brief Builder's Moodboard Overlay to fetch real architectural references.",
			prompt: "Editorial moodboard-aligned architectural material study with cohesive surface temperature."
		},
		{
			title: "Hospitality Evening Lobby Kinetic Crowd Loop",
			benchmark: "D5 Render",
			pain: "Static hotel lobby renders feel lifeless in digital pitch decks.",
			tip: "Subtle fireplace flicker + gentle guest motion for 4s ambient video.",
			prompt: "Warm inviting hotel lobby twilight ambiance with delicate hearth light glow and calm movement.",
			design: {
				light: "Evening",
				people: "Medium",
				activity: "Sitting"
			}
		},
		{
			title: "Wind-Driven Tree Canopy Ambient Video Breeze",
			benchmark: "D5 Render",
			pain: "Transforms still villa renders into soothing living website hero banners.",
			tip: "Pairs subtle branch sway with soft water pool shimmer.",
			prompt: "Subtle natural tree canopy breeze and calm pool reflection ripple for living architectural motion."
		},
		{
			title: "Interior Room Camera Placement Interior/Exterior",
			benchmark: "Chaos Corona",
			pain: "Lets architects drop cameras inside tight rooms OR outside across the street seamlessly.",
			tip: "Switch Camera Preset (Eye / Oblique / Aerial / Detail) inside 3D Viewport.",
			prompt: "Seamless interior-to-exterior visual continuity linking garden terrace directly with living room.",
			scene3d: {
				cameraPreset: "eye",
				focalLength: 24
			}
		},
		{
			title: "Developer Presale Marketing Hero Brochure",
			benchmark: "LookX",
			pain: "Residential developers need aspirational lifestyle warmth without fake over-saturation.",
			tip: "Balances twilight interior warmth with clean neighborhood context.",
			prompt: "Aspirational developer brochure hero visualization balancing warm livable interiors and crisp facade.",
			impact: "High",
			design: {
				light: "Golden hour",
				mood: "Warm"
			}
		},
		{
			title: "Municipal Zoning & Massing Sun-Study Evidence",
			benchmark: "Veras",
			pain: "Planning commissions reject stylized artistic renders that obscure shadow envelopes.",
			tip: "Enforces true Geolocation Latitude/Month/Hour sun vectors.",
			prompt: "Accurate planning-board shadow study preserving neighborhood setbacks, roof heights, and foliage.",
			scene3d: {
				geoEnabled: true,
				geoHour: 14,
				geoMonth: 6
			}
		},
		{
			title: "Mobile Touch-Friendly Client Showcase Deck",
			benchmark: "Rendair",
			pain: "Principals review projects on phones/tablets on-site and can't pinch tiny sliders.",
			tip: "Clean responsive studio controls keep 80% canvas visible on all screens.",
			prompt: "High-legibility mobile-ready contrast composition with strong focal hierarchy."
		},
		{
			title: "Auto-Approved Full Production Quality Baseline",
			benchmark: "Veras",
			pain: "Applies verified studio best practices in one click instead of toggling 12 panels.",
			tip: "Auto-mode baseline combining Geometry Lock + 35mm Tilt-Shift + High Detail.",
			prompt: "Full production baseline: 2-point tilt-shift verticals, true-scale PBR joinery, natural daylight bounce.",
			impact: "High",
			engine: {
				geometryLock: 92,
				seedLocked: true,
				renderFidelity: "photoreal",
				enhanceMode: "micro-detail"
			},
			scene3d: {
				twoPointTilt: true,
				focalLength: 35
			},
			design: {
				detail: "High detail",
				strength: "Balanced"
			}
		}
	]
};
var MARKET_SUGGESTIONS = (() => {
	const out = [];
	let idx = 1;
	for (const cat of MARKET_SUGGESTION_CATEGORIES) {
		const rawList = RAW_BY_CATEGORY[cat.id];
		for (const raw of rawList) {
			const padded = String(idx).padStart(3, "0");
			const benchmark = MARKET_BENCHMARKS.includes(raw.benchmark) ? raw.benchmark : "Rendair";
			out.push({
				id: `mkt-${padded}`,
				index: idx,
				title: raw.title,
				category: cat.id,
				categoryLabel: CATEGORY_LABEL_MAP[cat.id],
				marketBenchmark: benchmark,
				painPointSolved: raw.pain,
				userFriendlyTip: raw.tip,
				promptPatch: raw.prompt,
				estimatedImpact: raw.impact ?? "Medium",
				enginePatch: raw.engine,
				designPatch: raw.design,
				scene3dPatch: raw.scene3d,
				framePatch: raw.frame,
				autoQueuePreset: raw.queue
			});
			idx += 1;
		}
	}
	return out;
})();
var MARKET_AUTOPILOT_PACKS = [
	{
		id: "pack-hero-photoreal",
		name: "Hero Photoreal Finish (5)",
		description: "Locks geometry & seed, applies 2-point tilt-shift, neutral sky balance, and 4× micro-detail.",
		suggestionIds: [
			"mkt-001",
			"mkt-020",
			"mkt-081",
			"mkt-121",
			"mkt-160"
		]
	},
	{
		id: "pack-daylight-trio",
		name: "Day-to-Night Lighting Suite (5)",
		description: "Calibrates Morning 08:00, Solar Noon, Golden Hour, Blue-Hour Twilight & Midnight uplighting.",
		suggestionIds: [
			"mkt-021",
			"mkt-022",
			"mkt-023",
			"mkt-024",
			"mkt-025"
		],
		recommendedQueueTrio: true
	},
	{
		id: "pack-materials-craft",
		name: "Tactile PBR Craft Pack (5)",
		description: "Board-formed concrete, honed travertine, rift oak fluting, low-iron glass & roughness breakup.",
		suggestionIds: [
			"mkt-041",
			"mkt-042",
			"mkt-044",
			"mkt-047",
			"mkt-060"
		]
	},
	{
		id: "pack-sam2-segmentation",
		name: "SAM-2 Mask & Clean Swap Pack (4)",
		description: "Prepares click-to-segment furniture/facade replacement, wire cleanup & BrushNet blending.",
		suggestionIds: [
			"mkt-124",
			"mkt-125",
			"mkt-126",
			"mkt-139"
		]
	},
	{
		id: "pack-motion-360",
		name: "Motion, 360° & GLB Pipeline (5)",
		description: "Enables Day-to-Night transitions, 3-keyframe flythrough prep, 360° panorama, GLB capture & mood freeze.",
		suggestionIds: [
			"mkt-141",
			"mkt-142",
			"mkt-143",
			"mkt-144",
			"mkt-147"
		],
		recommendedQueueTrio: true
	},
	{
		id: "pack-sketch-to-render",
		name: "Sketch & CAD Massing Pack (5)",
		description: "Locks 2D trace/viewport captures with MLSD verticals, Canny linework & live draft stream.",
		suggestionIds: [
			"mkt-061",
			"mkt-062",
			"mkt-066",
			"mkt-072",
			"mkt-078"
		]
	}
];
function filterMarketSuggestions(items, filters) {
	const q = (filters.query ?? "").trim().toLowerCase();
	const approvedSet = new Set(filters.approvedIds ?? []);
	const appliedSet = new Set(filters.appliedIds ?? []);
	return items.filter((item) => {
		if (filters.category && filters.category !== "all" && item.category !== filters.category) return false;
		if (filters.benchmark && filters.benchmark !== "all" && item.marketBenchmark !== filters.benchmark) return false;
		if (filters.statusFilter && filters.statusFilter !== "all") {
			const isApplied = appliedSet.has(item.id);
			const isApproved = approvedSet.has(item.id) || isApplied;
			if (filters.statusFilter === "applied" && !isApplied) return false;
			if (filters.statusFilter === "approved" && !isApproved) return false;
			if (filters.statusFilter === "pending" && isApproved) return false;
		}
		if (!q) return true;
		return `${item.title} ${item.categoryLabel} ${item.marketBenchmark} ${item.painPointSolved} ${item.userFriendlyTip} ${item.promptPatch}`.toLowerCase().includes(q);
	});
}
function mergePromptNonDestructively(existingIdea, patch) {
	const cleanPatch = patch.trim().replace(/\s+/g, " ");
	if (!cleanPatch) return existingIdea;
	const cleanIdea = existingIdea.trim();
	if (!cleanIdea) return cleanPatch;
	if (cleanIdea.toLowerCase().includes(cleanPatch.toLowerCase())) return cleanIdea;
	return `${cleanIdea}${/[.!?]$/.test(cleanIdea) ? " " : ". "}${cleanPatch}`.slice(0, 3800);
}
function applyMarketSuggestionPatch(current, suggestion) {
	return {
		idea: mergePromptNonDestructively(current.idea, suggestion.promptPatch),
		design: suggestion.designPatch ? sanitizeDesign({
			...current.design,
			...suggestion.designPatch
		}) : current.design,
		engine: suggestion.enginePatch ? sanitizeEngineState({
			...current.engine,
			...suggestion.enginePatch
		}) : current.engine,
		scene3d: suggestion.scene3dPatch ? sanitizeScene3DState({
			...current.scene3d,
			...suggestion.scene3dPatch
		}) : current.scene3d,
		frame: suggestion.framePatch ? sanitizeFrame({
			...current.frame,
			...suggestion.framePatch
		}) : current.frame
	};
}
function applyMarketSuggestionBatch(initial, suggestions) {
	let state = initial;
	for (const item of suggestions) state = applyMarketSuggestionPatch(state, item);
	return state;
}
function createAutoBuildQueuePlan(suggestions, options) {
	const seen = /* @__PURE__ */ new Set();
	const orderedSuggestions = [];
	for (const item of suggestions) if (!seen.has(item.id)) {
		seen.add(item.id);
		orderedSuggestions.push(item);
	}
	const queueJobs = [];
	for (const item of orderedSuggestions) if (item.autoQueuePreset) queueJobs.push({
		label: item.autoQueuePreset.label,
		preset: item.autoQueuePreset.preset,
		light: item.autoQueuePreset.light,
		sunHour: item.autoQueuePreset.sunHour,
		cameraPreset: item.autoQueuePreset.cameraPreset,
		promptNote: item.promptPatch
	});
	if (options?.includeDaylightTrio) {
		const baseLook = options.baseLook || "Studio Plate";
		const basePreset = options.basePreset || "photoreal";
		queueJobs.push({
			label: `${baseLook} · Morning 08:00`,
			preset: basePreset,
			light: "Daylight",
			sunHour: 8,
			promptNote: "Morning crisp east sun, balanced facade exposure"
		}, {
			label: `${baseLook} · Golden Hour 17:30`,
			preset: basePreset,
			light: "Golden hour",
			sunHour: 17.5,
			promptNote: "Golden hour low raking warm light with cool ambient fill"
		}, {
			label: `${baseLook} · Midnight Blue Hour`,
			preset: basePreset,
			light: "Night",
			sunHour: 20.5,
			promptNote: "Blue-hour twilight exterior balanced with 2700K interior glow"
		});
	}
	return {
		orderedSuggestions,
		autoApprovedCount: orderedSuggestions.length,
		queueJobs: queueJobs.slice(0, 12),
		summaryText: `Auto-approved ${orderedSuggestions.length} market upgrades${queueJobs.length > 0 ? ` and staged ${Math.min(12, queueJobs.length)} queued visual passes` : ""}.`
	};
}
function getMarketCategoryStats(items, approvedIds, appliedIds) {
	const approvedSet = new Set(approvedIds);
	const appliedSet = new Set(appliedIds);
	return MARKET_SUGGESTION_CATEGORIES.map((cat) => {
		const matching = items.filter((i) => i.category === cat.id);
		const applied = matching.filter((i) => appliedSet.has(i.id)).length;
		const approved = matching.filter((i) => approvedSet.has(i.id) || appliedSet.has(i.id)).length;
		return {
			id: cat.id,
			label: cat.label,
			total: matching.length,
			approved,
			applied
		};
	});
}
var DB_NAME = "oriel-zukeviz-cache";
var STORE_NAME = "plates";
var CACHE_KEY = "active-studio-plates";
function openPlateDb() {
	if (typeof window === "undefined" || !("indexedDB" in window)) return Promise.resolve(null);
	return new Promise((resolve) => {
		let settled = false;
		const finish = (db) => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timer);
			resolve(db);
		};
		const timer = window.setTimeout(() => finish(null), 1500);
		try {
			const req = window.indexedDB.open(DB_NAME, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
			};
			req.onsuccess = () => finish(req.result);
			req.onerror = () => finish(null);
			req.onblocked = () => finish(null);
		} catch {
			finish(null);
		}
	});
}
async function savePlateBundleToIdb(bundle) {
	const db = await openPlateDb();
	if (!db) return;
	await new Promise((resolve) => {
		try {
			const tx = db.transaction(STORE_NAME, "readwrite");
			tx.objectStore(STORE_NAME).put({
				plate: bundle.plate,
				history: bundle.history.slice(0, 12),
				iterations: bundle.iterations.slice(0, 12),
				upload: bundle.upload,
				savedAt: Date.now()
			}, CACHE_KEY);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		} catch {
			resolve();
		}
	});
}
async function loadPlateBundleFromIdb() {
	const db = await openPlateDb();
	if (!db) return null;
	return new Promise((resolve) => {
		try {
			const req = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(CACHE_KEY);
			req.onsuccess = () => {
				const val = req.result;
				resolve(val && typeof val === "object" ? val : null);
			};
			req.onerror = () => resolve(null);
		} catch {
			resolve(null);
		}
	});
}
function isPersistableCompactUrl(url) {
	if (!url || typeof url !== "string") return false;
	if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) return true;
	if (url.startsWith("data:image/")) return url.length <= 9e4;
	return false;
}
var presets200_e7afd19d_default = /*#__PURE__*/ JSON.parse("[{\"id\":\"P001\",\"category\":\"Exterior light\",\"name\":\"Golden Hour Glint\",\"fragment\":\"warm low sun glint at 24 degrees, long soft shadows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P002\",\"category\":\"Exterior light\",\"name\":\"Blue Hour Glow\",\"fragment\":\"deep blue sky, warm interior lights on, balanced exposure\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P003\",\"category\":\"Exterior light\",\"name\":\"Overcast Soft Light\",\"fragment\":\"even soft daylight, no hard shadows, muted sky\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P004\",\"category\":\"Exterior light\",\"name\":\"High Noon Crisp\",\"fragment\":\"clear hard sun, crisp shadows, saturated sky\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P005\",\"category\":\"Exterior light\",\"name\":\"Sunrise Haze\",\"fragment\":\"low pink-gold sun through light haze\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P006\",\"category\":\"Exterior light\",\"name\":\"Dusk Gradient\",\"fragment\":\"violet to amber sky gradient, lit facade\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P007\",\"category\":\"Exterior light\",\"name\":\"Moonlit Night\",\"fragment\":\"cool moonlight, glowing windows, soft stars\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P008\",\"category\":\"Exterior light\",\"name\":\"Storm Break\",\"fragment\":\"dramatic clouds with a shaft of light on the building\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P009\",\"category\":\"Exterior light\",\"name\":\"Winter Low Sun\",\"fragment\":\"low cold sun, long blue shadows, crisp air\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P010\",\"category\":\"Exterior light\",\"name\":\"Summer Afternoon\",\"fragment\":\"warm bright light, deep blue sky, light cumulus\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P011\",\"category\":\"Exterior light\",\"name\":\"Backlit Rim\",\"fragment\":\"sun behind the building, glowing edges\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P012\",\"category\":\"Exterior light\",\"name\":\"Side Raking Light\",\"fragment\":\"low sun from the side, strong texture on walls\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P013\",\"category\":\"Exterior light\",\"name\":\"Twilight Pool Glow\",\"fragment\":\"lit water, dusk sky, warm windows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P014\",\"category\":\"Exterior light\",\"name\":\"Sunset Reflection\",\"fragment\":\"sunset reflected in glass facade\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P015\",\"category\":\"Exterior light\",\"name\":\"Misty Morning\",\"fragment\":\"soft fog, low contrast, pale sun\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P016\",\"category\":\"Exterior light\",\"name\":\"Clear Sky Minimal\",\"fragment\":\"clean sky, no clouds, flat calm light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P017\",\"category\":\"Exterior light\",\"name\":\"Cloud Shadow Play\",\"fragment\":\"moving cloud shadows across the facade\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P018\",\"category\":\"Exterior light\",\"name\":\"Festive Night\",\"fragment\":\"warm accent lighting, vibrant evening\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P019\",\"category\":\"Exterior light\",\"name\":\"Aerial Noon\",\"fragment\":\"high angle, even light, clear detail\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P020\",\"category\":\"Exterior light\",\"name\":\"Aerial Golden\",\"fragment\":\"high angle, long warm shadows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P021\",\"category\":\"Interior light\",\"name\":\"Warm Evening Lamps\",\"fragment\":\"2700K lamps, soft pools of light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P022\",\"category\":\"Interior light\",\"name\":\"Morning Window Light\",\"fragment\":\"cool soft light from windows, gentle shadows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P023\",\"category\":\"Interior light\",\"name\":\"Soft Daylight Bounce\",\"fragment\":\"even bounced light, airy and bright\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P024\",\"category\":\"Interior light\",\"name\":\"Cove Lighting Glow\",\"fragment\":\"hidden cove light along ceiling, warm wash\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P025\",\"category\":\"Interior light\",\"name\":\"Pendant Spotlight\",\"fragment\":\"focused pendant light over table, darker surroundings\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P026\",\"category\":\"Interior light\",\"name\":\"Candlelit Dinner\",\"fragment\":\"small warm flames, intimate low light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P027\",\"category\":\"Interior light\",\"name\":\"Spa Calm\",\"fragment\":\"diffused neutral light, no harsh shadows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P028\",\"category\":\"Interior light\",\"name\":\"Showroom Bright\",\"fragment\":\"clean bright light, neutral white, high clarity\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P029\",\"category\":\"Interior light\",\"name\":\"Sun Patch Floor\",\"fragment\":\"bright sun patch across the floor, warm bounce\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P030\",\"category\":\"Interior light\",\"name\":\"Dramatic Down Light\",\"fragment\":\"strong top light, deep contrast\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P031\",\"category\":\"Interior light\",\"name\":\"Fireplace Glow\",\"fragment\":\"warm flickering light on nearby surfaces\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P032\",\"category\":\"Interior light\",\"name\":\"Late Afternoon Streak\",\"fragment\":\"long sun streak through window\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P033\",\"category\":\"Interior light\",\"name\":\"Cloudy Day Interior\",\"fragment\":\"soft cool window light, calm mood\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P034\",\"category\":\"Interior light\",\"name\":\"Night City View\",\"fragment\":\"dark interior, city lights through glass\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P035\",\"category\":\"Interior light\",\"name\":\"Gallery Wall Wash\",\"fragment\":\"even wall washing on art\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P036\",\"category\":\"Interior light\",\"name\":\"Kitchen Task Light\",\"fragment\":\"bright under-cabinet light, clean counters\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P037\",\"category\":\"Interior light\",\"name\":\"Bedroom Dim\",\"fragment\":\"low warm light, quiet mood\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P038\",\"category\":\"Interior light\",\"name\":\"Bathroom Soft Glow\",\"fragment\":\"warm mirror light, steam softness\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P039\",\"category\":\"Interior light\",\"name\":\"Stairwell Light Well\",\"fragment\":\"top light falling down a stair\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P040\",\"category\":\"Interior light\",\"name\":\"Home Cinema Ambient\",\"fragment\":\"low ambient glow, screen light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P041\",\"category\":\"Materials\",\"name\":\"Smoked Cedar Siding\",\"fragment\":\"dark smoked cedar cladding, visible grain\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P042\",\"category\":\"Materials\",\"name\":\"Basalt Monolith\",\"fragment\":\"dark basalt stone, fine texture\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P043\",\"category\":\"Materials\",\"name\":\"Board-formed Concrete\",\"fragment\":\"concrete with timber board marks\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P044\",\"category\":\"Materials\",\"name\":\"Travertine Warm\",\"fragment\":\"warm travertine with natural pores\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P045\",\"category\":\"Materials\",\"name\":\"White Plaster Smooth\",\"fragment\":\"smooth lime plaster, soft sheen\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P046\",\"category\":\"Materials\",\"name\":\"Oak Herringbone\",\"fragment\":\"oak herringbone floor, satin finish\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P047\",\"category\":\"Materials\",\"name\":\"Walnut Veneer\",\"fragment\":\"rich walnut veneer panels\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P048\",\"category\":\"Materials\",\"name\":\"Brushed Brass Details\",\"fragment\":\"brushed brass trim and fixtures\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P049\",\"category\":\"Materials\",\"name\":\"Black Steel Frames\",\"fragment\":\"slim matte black steel window frames\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P050\",\"category\":\"Materials\",\"name\":\"Marble Veined\",\"fragment\":\"white marble with grey veins, polished\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P051\",\"category\":\"Materials\",\"name\":\"Terrazzo Speckle\",\"fragment\":\"terrazzo floor with fine chips\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P052\",\"category\":\"Materials\",\"name\":\"Zinc Patina\",\"fragment\":\"weathered zinc roof panels\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P053\",\"category\":\"Materials\",\"name\":\"Weathered Corten\",\"fragment\":\"rusted corten steel, deep orange-brown\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P054\",\"category\":\"Materials\",\"name\":\"Fluted Glass\",\"fragment\":\"vertical fluted glass, soft diffusion\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P055\",\"category\":\"Materials\",\"name\":\"Linen Upholstery\",\"fragment\":\"natural linen, soft folds\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P056\",\"category\":\"Materials\",\"name\":\"Boucle Soft\",\"fragment\":\"textured boucle fabric\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P057\",\"category\":\"Materials\",\"name\":\"Leather Cognac\",\"fragment\":\"cognac leather, subtle wear\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P058\",\"category\":\"Materials\",\"name\":\"Wool Rug Texture\",\"fragment\":\"dense wool rug with visible fibre\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P059\",\"category\":\"Materials\",\"name\":\"Ceramic Tile Zellige\",\"fragment\":\"handmade zellige tile, uneven glaze\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P060\",\"category\":\"Materials\",\"name\":\"Natural Rattan\",\"fragment\":\"woven rattan, warm tone\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P061\",\"category\":\"Atmosphere and weather\",\"name\":\"Maritime Mist 80\",\"fragment\":\"heavy maritime fog at 80 percent, diffused light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P062\",\"category\":\"Atmosphere and weather\",\"name\":\"Light Rain Wet Ground\",\"fragment\":\"wet reflective ground, soft drizzle\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P063\",\"category\":\"Atmosphere and weather\",\"name\":\"Snow Calm\",\"fragment\":\"fresh snow, quiet cold light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P064\",\"category\":\"Atmosphere and weather\",\"name\":\"Heat Haze\",\"fragment\":\"warm shimmering air, dry light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P065\",\"category\":\"Atmosphere and weather\",\"name\":\"Dust Particles in Light\",\"fragment\":\"visible dust in sun shafts\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P066\",\"category\":\"Atmosphere and weather\",\"name\":\"Morning Dew\",\"fragment\":\"dew on leaves, fresh light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P067\",\"category\":\"Atmosphere and weather\",\"name\":\"Thunder Sky\",\"fragment\":\"dark heavy clouds, tense mood\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P068\",\"category\":\"Atmosphere and weather\",\"name\":\"Spring Bloom Air\",\"fragment\":\"fresh bright air, blossoms\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P069\",\"category\":\"Atmosphere and weather\",\"name\":\"Autumn Warm Leaves\",\"fragment\":\"orange and gold leaves, warm light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P070\",\"category\":\"Atmosphere and weather\",\"name\":\"Smoke Free Clear\",\"fragment\":\"very clear air, long visibility\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P071\",\"category\":\"Atmosphere and weather\",\"name\":\"Evening Fog Valley\",\"fragment\":\"low fog around the base, lit building\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P072\",\"category\":\"Atmosphere and weather\",\"name\":\"Rain on Glass\",\"fragment\":\"water drops on windows, blurred outside\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P073\",\"category\":\"Atmosphere and weather\",\"name\":\"Wind Movement\",\"fragment\":\"gently moving trees and fabric\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P074\",\"category\":\"Atmosphere and weather\",\"name\":\"Tropical Humidity\",\"fragment\":\"lush damp air, soft haze\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P075\",\"category\":\"Atmosphere and weather\",\"name\":\"Desert Dry\",\"fragment\":\"dry clear air, sand tones\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P076\",\"category\":\"Atmosphere and weather\",\"name\":\"Alpine Crisp\",\"fragment\":\"thin clear air, sharp distant peaks\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P077\",\"category\":\"Atmosphere and weather\",\"name\":\"Coastal Breeze\",\"fragment\":\"soft sea light, salt haze\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P078\",\"category\":\"Atmosphere and weather\",\"name\":\"City Smog Soft\",\"fragment\":\"gentle urban haze, muted sun\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P079\",\"category\":\"Atmosphere and weather\",\"name\":\"Night Rain Neon\",\"fragment\":\"wet streets, coloured reflections\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P080\",\"category\":\"Atmosphere and weather\",\"name\":\"Aurora Dusk\",\"fragment\":\"green aurora glow in a dark blue sky\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P081\",\"category\":\"Landscape\",\"name\":\"Nordic Birch Garden\",\"fragment\":\"birch trees, moss and low shrubs\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P082\",\"category\":\"Landscape\",\"name\":\"Mediterranean Olive\",\"fragment\":\"olive trees, gravel, dry stone\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P083\",\"category\":\"Landscape\",\"name\":\"Tropical Lush\",\"fragment\":\"palms, ferns, broad leaves\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P084\",\"category\":\"Landscape\",\"name\":\"Desert Xeriscape\",\"fragment\":\"agave, cactus, warm gravel\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P085\",\"category\":\"Landscape\",\"name\":\"Japanese Courtyard\",\"fragment\":\"raked gravel, pine, stone lanterns\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P086\",\"category\":\"Landscape\",\"name\":\"English Border\",\"fragment\":\"layered flowering borders\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P087\",\"category\":\"Landscape\",\"name\":\"Formal Hedge Lines\",\"fragment\":\"clipped hedges, clean geometry\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P088\",\"category\":\"Landscape\",\"name\":\"Meadow Wild\",\"fragment\":\"tall grass and wildflowers\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P089\",\"category\":\"Landscape\",\"name\":\"Rooftop Garden\",\"fragment\":\"planters, pergola, city view\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P090\",\"category\":\"Landscape\",\"name\":\"Water Garden\",\"fragment\":\"still pool, reeds, stepping stones\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P091\",\"category\":\"Landscape\",\"name\":\"Forest Edge\",\"fragment\":\"dense forest behind the building\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P092\",\"category\":\"Landscape\",\"name\":\"Coastal Dunes\",\"fragment\":\"beach grass, sand, wooden walkway\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P093\",\"category\":\"Landscape\",\"name\":\"Mountain Rock Garden\",\"fragment\":\"boulders, alpine plants\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P094\",\"category\":\"Landscape\",\"name\":\"Vineyard Rows\",\"fragment\":\"vine rows, warm field\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P095\",\"category\":\"Landscape\",\"name\":\"Courtyard Trees\",\"fragment\":\"single large tree in a courtyard\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P096\",\"category\":\"Landscape\",\"name\":\"Street Trees Urban\",\"fragment\":\"mature street trees, paved edge\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P097\",\"category\":\"Landscape\",\"name\":\"Green Facade\",\"fragment\":\"climbing plants on the facade\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P098\",\"category\":\"Landscape\",\"name\":\"Orchard Calm\",\"fragment\":\"fruit trees in neat rows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P099\",\"category\":\"Landscape\",\"name\":\"Lawn Manicured\",\"fragment\":\"short lawn, crisp edges\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P100\",\"category\":\"Landscape\",\"name\":\"Gravel Driveway Entry\",\"fragment\":\"raked gravel, planted edges\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P101\",\"category\":\"Amenities\",\"name\":\"Infinity Pool Dusk\",\"fragment\":\"infinity pool edge, dusk light, loungers\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P102\",\"category\":\"Amenities\",\"name\":\"Clubhouse Lounge\",\"fragment\":\"plush lounge, warm light, books\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P103\",\"category\":\"Amenities\",\"name\":\"Rooftop Terrace Evening\",\"fragment\":\"dining terrace, string lights, skyline\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P104\",\"category\":\"Amenities\",\"name\":\"Gym Bright\",\"fragment\":\"clean modern gym, daylight\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P105\",\"category\":\"Amenities\",\"name\":\"Kids Play Area Sunny\",\"fragment\":\"safe play area, soft surface, bright\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P106\",\"category\":\"Amenities\",\"name\":\"Co-working Lounge\",\"fragment\":\"desks, plants, soft light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P107\",\"category\":\"Amenities\",\"name\":\"Spa Wet Area\",\"fragment\":\"stone, steam, soft light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P108\",\"category\":\"Amenities\",\"name\":\"Sky Lounge Night\",\"fragment\":\"glass lounge, city lights\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P109\",\"category\":\"Amenities\",\"name\":\"Garden Pavilion\",\"fragment\":\"covered seating in garden\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P110\",\"category\":\"Amenities\",\"name\":\"BBQ Deck Sunset\",\"fragment\":\"outdoor kitchen, warm dusk\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P111\",\"category\":\"Amenities\",\"name\":\"Lobby Arrival\",\"fragment\":\"double-height lobby, welcoming light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P112\",\"category\":\"Amenities\",\"name\":\"Cinema Room\",\"fragment\":\"plush seating, dim light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P113\",\"category\":\"Amenities\",\"name\":\"Tennis Court Morning\",\"fragment\":\"clean court, long shadows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P114\",\"category\":\"Amenities\",\"name\":\"Yoga Deck Dawn\",\"fragment\":\"wooden deck, soft sunrise\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P115\",\"category\":\"Amenities\",\"name\":\"Library Quiet\",\"fragment\":\"shelves, reading lamps, calm\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P116\",\"category\":\"Amenities\",\"name\":\"Cafe Corner\",\"fragment\":\"small cafe, warm light, people seated\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P117\",\"category\":\"Amenities\",\"name\":\"Pet Park Day\",\"fragment\":\"green fenced area, bright\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P118\",\"category\":\"Amenities\",\"name\":\"Retail Podium Evening\",\"fragment\":\"lit shopfronts, warm glow\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P119\",\"category\":\"Amenities\",\"name\":\"Parking Clean\",\"fragment\":\"tidy lit parking, neutral light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P120\",\"category\":\"Amenities\",\"name\":\"Concierge Desk\",\"fragment\":\"polished desk, warm accent light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P121\",\"category\":\"Camera and lens\",\"name\":\"Tilt-Shift 24mm\",\"fragment\":\"tilt-shift, f/1.4 feel, soft top and bottom blur\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P122\",\"category\":\"Camera and lens\",\"name\":\"Wide 16mm Interior\",\"fragment\":\"wide angle, corrected verticals\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P123\",\"category\":\"Camera and lens\",\"name\":\"Standard 35mm Eye Level\",\"fragment\":\"natural eye level view\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P124\",\"category\":\"Camera and lens\",\"name\":\"Telephoto 85mm Facade\",\"fragment\":\"compressed facade, flat perspective\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P125\",\"category\":\"Camera and lens\",\"name\":\"Low Angle Hero\",\"fragment\":\"low camera looking up, strong presence\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P126\",\"category\":\"Camera and lens\",\"name\":\"High Angle Overview\",\"fragment\":\"elevated view, clear layout\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P127\",\"category\":\"Camera and lens\",\"name\":\"One-point Perspective\",\"fragment\":\"centred symmetric view\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P128\",\"category\":\"Camera and lens\",\"name\":\"Two-point Corrected\",\"fragment\":\"vertical lines kept straight\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P129\",\"category\":\"Camera and lens\",\"name\":\"Macro Detail\",\"fragment\":\"close material detail, shallow focus\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P130\",\"category\":\"Camera and lens\",\"name\":\"Shallow Depth Bokeh\",\"fragment\":\"soft background, sharp subject\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P131\",\"category\":\"Camera and lens\",\"name\":\"Deep Focus Everything Sharp\",\"fragment\":\"f/11 feel, everything sharp\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P132\",\"category\":\"Camera and lens\",\"name\":\"Cinematic 2.39 Crop\",\"fragment\":\"wide letterbox composition\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P133\",\"category\":\"Camera and lens\",\"name\":\"Square Social Crop\",\"fragment\":\"centred square composition\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P134\",\"category\":\"Camera and lens\",\"name\":\"Vertical Story Crop\",\"fragment\":\"9:16 composition, subject centred\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P135\",\"category\":\"Camera and lens\",\"name\":\"Drone Orbit Still\",\"fragment\":\"high orbit angle, even light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P136\",\"category\":\"Camera and lens\",\"name\":\"Walk-in Eye View\",\"fragment\":\"first person entry view\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P137\",\"category\":\"Camera and lens\",\"name\":\"Over Water View\",\"fragment\":\"camera low over water reflection\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P138\",\"category\":\"Camera and lens\",\"name\":\"Through Doorway Frame\",\"fragment\":\"framed through a doorway\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P139\",\"category\":\"Camera and lens\",\"name\":\"Mirror Reflection Shot\",\"fragment\":\"view includes a mirror reflection\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P140\",\"category\":\"Camera and lens\",\"name\":\"Sunburst Star Filter\",\"fragment\":\"small sun star through lens\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P141\",\"category\":\"Style and era\",\"name\":\"Nordic Minimal\",\"fragment\":\"pale wood, white walls, simple forms\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P142\",\"category\":\"Style and era\",\"name\":\"Japandi Calm\",\"fragment\":\"wood, linen, muted earth tones\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P143\",\"category\":\"Style and era\",\"name\":\"Mid-century Modern\",\"fragment\":\"walnut, tapered legs, warm colours\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P144\",\"category\":\"Style and era\",\"name\":\"Art Deco Luxe\",\"fragment\":\"brass, geometric patterns, deep colours\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P145\",\"category\":\"Style and era\",\"name\":\"Brutalist Raw\",\"fragment\":\"raw concrete, heavy forms\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P146\",\"category\":\"Style and era\",\"name\":\"Mediterranean Villa\",\"fragment\":\"plaster, arches, terracotta\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P147\",\"category\":\"Style and era\",\"name\":\"Contemporary Luxury\",\"fragment\":\"stone, glass, refined details\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P148\",\"category\":\"Style and era\",\"name\":\"Industrial Loft\",\"fragment\":\"exposed brick, steel, large windows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P149\",\"category\":\"Style and era\",\"name\":\"Scandinavian Cabin\",\"fragment\":\"timber, cosy, soft textiles\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P150\",\"category\":\"Style and era\",\"name\":\"Tropical Modern\",\"fragment\":\"open plan, timber, greenery\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P151\",\"category\":\"Style and era\",\"name\":\"Classic European\",\"fragment\":\"mouldings, symmetry, soft palette\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P152\",\"category\":\"Style and era\",\"name\":\"Desert Modern\",\"fragment\":\"earth tones, sand walls, deep shadows\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P153\",\"category\":\"Style and era\",\"name\":\"Coastal Hamptons\",\"fragment\":\"white, blue accents, light wood\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P154\",\"category\":\"Style and era\",\"name\":\"Wabi-sabi\",\"fragment\":\"imperfect textures, quiet colours\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P155\",\"category\":\"Style and era\",\"name\":\"Parametric Futurist\",\"fragment\":\"flowing forms, white surfaces\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P156\",\"category\":\"Style and era\",\"name\":\"Traditional Indian Contemporary\",\"fragment\":\"carved screens, warm stone, brass\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P157\",\"category\":\"Style and era\",\"name\":\"Gulf Contemporary\",\"fragment\":\"stone, gold accents, grand scale\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P158\",\"category\":\"Style and era\",\"name\":\"Urban Chic\",\"fragment\":\"dark tones, metal, mood light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P159\",\"category\":\"Style and era\",\"name\":\"Biophilic\",\"fragment\":\"plants integrated, natural light, wood\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P160\",\"category\":\"Style and era\",\"name\":\"Heritage Revival\",\"fragment\":\"restored details, warm palette\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P161\",\"category\":\"Mood grade\",\"name\":\"Warm Filmic\",\"fragment\":\"warm highlights, soft contrast, light grain\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P162\",\"category\":\"Mood grade\",\"name\":\"Cool Dusk\",\"fragment\":\"cool shadows, muted highlights\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P163\",\"category\":\"Mood grade\",\"name\":\"Soft Matte\",\"fragment\":\"lifted blacks, low saturation\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P164\",\"category\":\"Mood grade\",\"name\":\"High Contrast Editorial\",\"fragment\":\"deep blacks, bright highlights\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P165\",\"category\":\"Mood grade\",\"name\":\"Pastel Dream\",\"fragment\":\"light pastel tones\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P166\",\"category\":\"Mood grade\",\"name\":\"Moody Dark\",\"fragment\":\"deep tones, low key light\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P167\",\"category\":\"Mood grade\",\"name\":\"Bright Airy\",\"fragment\":\"high key, clean whites\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P168\",\"category\":\"Mood grade\",\"name\":\"Golden Cinematic\",\"fragment\":\"teal shadows, golden highlights\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P169\",\"category\":\"Mood grade\",\"name\":\"Monochrome Architectural\",\"fragment\":\"black and white, strong form\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P170\",\"category\":\"Mood grade\",\"name\":\"Vintage Print\",\"fragment\":\"faded colours, soft grain\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P171\",\"category\":\"Mood grade\",\"name\":\"Neutral True Colour\",\"fragment\":\"accurate colour, no stylisation\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P172\",\"category\":\"Mood grade\",\"name\":\"Rich Saturated\",\"fragment\":\"deep colour, strong contrast\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P173\",\"category\":\"Mood grade\",\"name\":\"Muted Earth\",\"fragment\":\"brown, olive, sand tones\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P174\",\"category\":\"Mood grade\",\"name\":\"Ice Blue Clarity\",\"fragment\":\"cool blue tones, clean\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P175\",\"category\":\"Mood grade\",\"name\":\"Sunset Orange Wash\",\"fragment\":\"warm orange overall tone\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P176\",\"category\":\"Mood grade\",\"name\":\"Emerald Luxe\",\"fragment\":\"deep green accents\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P177\",\"category\":\"Mood grade\",\"name\":\"Midnight Blue Luxe\",\"fragment\":\"deep blue shadows, gold accents\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P178\",\"category\":\"Mood grade\",\"name\":\"Blush Soft\",\"fragment\":\"soft pink warm tone\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P179\",\"category\":\"Mood grade\",\"name\":\"Charcoal Sleek\",\"fragment\":\"dark grey, crisp whites\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P180\",\"category\":\"Mood grade\",\"name\":\"Sepia Heritage\",\"fragment\":\"warm brown tint\",\"strength\":1.0,\"is_negative\":false},{\"id\":\"P181\",\"category\":\"Fixes and guards\",\"name\":\"Strict 3D Align\",\"fragment\":\"keep geometry exactly as the 3D render\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P182\",\"category\":\"Fixes and guards\",\"name\":\"Keep Furniture Layout\",\"fragment\":\"do not move or add furniture\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P183\",\"category\":\"Fixes and guards\",\"name\":\"Straighten Verticals\",\"fragment\":\"correct vertical lines\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P184\",\"category\":\"Fixes and guards\",\"name\":\"Remove Clutter\",\"fragment\":\"clean surfaces, remove small objects\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P185\",\"category\":\"Fixes and guards\",\"name\":\"No Text or Logos\",\"fragment\":\"avoid invented signs and text\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P186\",\"category\":\"Fixes and guards\",\"name\":\"Fix Window Reflections\",\"fragment\":\"clean believable reflections\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P187\",\"category\":\"Fixes and guards\",\"name\":\"Natural Skin and People\",\"fragment\":\"plausible people, no distortion\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P188\",\"category\":\"Fixes and guards\",\"name\":\"Keep Material Colours\",\"fragment\":\"do not change base material colours\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P189\",\"category\":\"Fixes and guards\",\"name\":\"No Extra Floors\",\"fragment\":\"keep building height and floor count\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P190\",\"category\":\"Fixes and guards\",\"name\":\"Keep Opening Sizes\",\"fragment\":\"do not resize doors or windows\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P191\",\"category\":\"Fixes and guards\",\"name\":\"Clean Sky No Birds\",\"fragment\":\"plain sky\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P192\",\"category\":\"Fixes and guards\",\"name\":\"Remove Cars\",\"fragment\":\"empty street\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P193\",\"category\":\"Fixes and guards\",\"name\":\"Reduce Noise\",\"fragment\":\"remove grain and speckles\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P194\",\"category\":\"Fixes and guards\",\"name\":\"Sharpen Details\",\"fragment\":\"crisp edges and textures\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P195\",\"category\":\"Fixes and guards\",\"name\":\"Fix Shadows Direction\",\"fragment\":\"consistent shadow direction\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P196\",\"category\":\"Fixes and guards\",\"name\":\"No Fake Plants Repeats\",\"fragment\":\"avoid repeated plant patterns\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P197\",\"category\":\"Fixes and guards\",\"name\":\"Caustic Noise Off\",\"fragment\":\"remove water caustic noise\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P198\",\"category\":\"Fixes and guards\",\"name\":\"Sky Bleed Off\",\"fragment\":\"prevent sky colour leaking into walls\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P199\",\"category\":\"Fixes and guards\",\"name\":\"Keep Scale Real\",\"fragment\":\"true human scale\",\"strength\":1.0,\"is_negative\":true},{\"id\":\"P200\",\"category\":\"Fixes and guards\",\"name\":\"Stay Within Site Boundary\",\"fragment\":\"do not extend beyond the site\",\"strength\":1.0,\"is_negative\":true}]");
var archviz_presets_afcc8bdf_default = /*#__PURE__*/ JSON.parse("[{\"id\":\"AV-001\",\"title\":\"Cliffside Glass Villa\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"warm golden hour\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"serene and refined\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a distinctive cliffside glass villa architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: warm golden hour. Camera: eye-level three-quarter architectural view. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-002\",\"title\":\"Modern Courtyard Villa\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"soft diffused daylight\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"warm and welcoming\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a distinctive modern courtyard villa architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: soft diffused daylight. Camera: wide-angle editorial interior view. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-003\",\"title\":\"Tropical Pool Mansion\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"dramatic and sculptural\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a distinctive tropical pool mansion architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: blue hour with interior glow. Camera: symmetrical straight-on composition. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-004\",\"title\":\"Minimal White Bungalow\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"crisp morning daylight\",\"camera\":\"low-angle hero composition\",\"mood\":\"airy and minimal\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a distinctive minimal white bungalow architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: crisp morning daylight. Camera: low-angle hero composition. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-005\",\"title\":\"Desert Concrete Residence\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"cinematic dusk\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"intimate and cozy\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a distinctive desert concrete residence architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: cinematic dusk. Camera: elevated oblique aerial view. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-006\",\"title\":\"Alpine Timber Chalet\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"overcast natural light\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"luxurious and understated\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a distinctive alpine timber chalet architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: overcast natural light. Camera: human-eye 35mm lens perspective. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-007\",\"title\":\"Lakefront Floating House\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"sunset side lighting\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"nature immersed\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a distinctive lakefront floating house architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: sunset side lighting. Camera: two-point perspective with verticals straight. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-008\",\"title\":\"Urban Penthouse Terrace\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"isometric three-quarter view\",\"mood\":\"futuristic and clean\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a distinctive urban penthouse terrace architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: subtle warm interior lighting. Camera: isometric three-quarter view. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-009\",\"title\":\"Mediterranean Seaside Villa\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"clear midday sunshine\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"calm and contemplative\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a distinctive mediterranean seaside villa architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: clear midday sunshine. Camera: framed view through an architectural opening. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-010\",\"title\":\"Luxury Farmhouse Estate\",\"category\":\"Luxury Residential\",\"tags\":[\"Luxury Residential\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"vibrant and social\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a distinctive luxury farmhouse estate architectural project with coherent massing, realistic context and buildable design logic. Style: luxury residential. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: moody atmospheric lighting. Camera: cinematic street-level perspective. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-011\",\"title\":\"Double Height Living Room\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"dramatic and sculptural\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a meticulously designed double height living room space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: blue hour with interior glow. Camera: wide-angle editorial interior view. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-012\",\"title\":\"Japandi Living Room\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"crisp morning daylight\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"airy and minimal\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a meticulously designed japandi living room space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: crisp morning daylight. Camera: symmetrical straight-on composition. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-013\",\"title\":\"Warm Minimalist Bedroom\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"cinematic dusk\",\"camera\":\"low-angle hero composition\",\"mood\":\"intimate and cozy\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a meticulously designed warm minimalist bedroom space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: cinematic dusk. Camera: low-angle hero composition. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-014\",\"title\":\"Monolithic Island Kitchen\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"overcast natural light\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"luxurious and understated\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a meticulously designed monolithic island kitchen space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: overcast natural light. Camera: elevated oblique aerial view. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-015\",\"title\":\"Luxury Marble Bathroom\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"sunset side lighting\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"nature immersed\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a meticulously designed luxury marble bathroom space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: sunset side lighting. Camera: human-eye 35mm lens perspective. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-016\",\"title\":\"Soft Scandinavian Dining\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"futuristic and clean\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a meticulously designed soft scandinavian dining space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: subtle warm interior lighting. Camera: two-point perspective with verticals straight. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-017\",\"title\":\"Biophilic Home Office\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"clear midday sunshine\",\"camera\":\"isometric three-quarter view\",\"mood\":\"calm and contemplative\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a meticulously designed biophilic home office space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: clear midday sunshine. Camera: isometric three-quarter view. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-018\",\"title\":\"Modern Walk-in Wardrobe\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"vibrant and social\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a meticulously designed modern walk-in wardrobe space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: moody atmospheric lighting. Camera: framed view through an architectural opening. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-019\",\"title\":\"Sunken Conversation Lounge\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"warm golden hour\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"serene and refined\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a meticulously designed sunken conversation lounge space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: warm golden hour. Camera: cinematic street-level perspective. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-020\",\"title\":\"Home Cinema Suite\",\"category\":\"Modern Interiors\",\"tags\":[\"Modern Interiors\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"soft diffused daylight\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"warm and welcoming\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a meticulously designed home cinema suite space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: modern interiors. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: soft diffused daylight. Camera: eye-level three-quarter architectural view. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-021\",\"title\":\"Japanese Wabi Sabi\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"cinematic dusk\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"intimate and cozy\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a distinctive japanese wabi sabi architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: cinematic dusk. Camera: symmetrical straight-on composition. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-022\",\"title\":\"Scandinavian Timber\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"overcast natural light\",\"camera\":\"low-angle hero composition\",\"mood\":\"luxurious and understated\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a distinctive scandinavian timber architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: overcast natural light. Camera: low-angle hero composition. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-023\",\"title\":\"Mediterranean Revival\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"sunset side lighting\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"nature immersed\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a distinctive mediterranean revival architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: sunset side lighting. Camera: elevated oblique aerial view. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-024\",\"title\":\"Industrial Loft\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"futuristic and clean\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a distinctive industrial loft architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: subtle warm interior lighting. Camera: human-eye 35mm lens perspective. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-025\",\"title\":\"Brutalist Concrete\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"clear midday sunshine\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"calm and contemplative\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a distinctive brutalist concrete architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: clear midday sunshine. Camera: two-point perspective with verticals straight. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-026\",\"title\":\"Art Deco Revival\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"isometric three-quarter view\",\"mood\":\"vibrant and social\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a distinctive art deco revival architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: moody atmospheric lighting. Camera: isometric three-quarter view. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-027\",\"title\":\"Midcentury Modern\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"warm golden hour\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"serene and refined\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a distinctive midcentury modern architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: warm golden hour. Camera: framed view through an architectural opening. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-028\",\"title\":\"Tropical Modernism\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"soft diffused daylight\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"warm and welcoming\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a distinctive tropical modernism architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: soft diffused daylight. Camera: cinematic street-level perspective. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-029\",\"title\":\"Neo Classical Residence\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"dramatic and sculptural\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a distinctive neo classical residence architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: blue hour with interior glow. Camera: eye-level three-quarter architectural view. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-030\",\"title\":\"Contemporary Vernacular\",\"category\":\"Architectural Styles\",\"tags\":[\"Architectural Styles\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"crisp morning daylight\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"airy and minimal\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a distinctive contemporary vernacular architectural project with coherent massing, realistic context and buildable design logic. Style: architectural styles. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: crisp morning daylight. Camera: wide-angle editorial interior view. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-031\",\"title\":\"Glass Office Headquarters\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"sunset side lighting\",\"camera\":\"low-angle hero composition\",\"mood\":\"nature immersed\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a meticulously designed glass office headquarters space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: sunset side lighting. Camera: low-angle hero composition. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-032\",\"title\":\"Boutique Retail Store\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"futuristic and clean\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a meticulously designed boutique retail store space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: subtle warm interior lighting. Camera: elevated oblique aerial view. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-033\",\"title\":\"Five Star Hotel Lobby\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"clear midday sunshine\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"calm and contemplative\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a meticulously designed five star hotel lobby space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: clear midday sunshine. Camera: human-eye 35mm lens perspective. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-034\",\"title\":\"Luxury Restaurant Interior\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"vibrant and social\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a meticulously designed luxury restaurant interior space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: moody atmospheric lighting. Camera: two-point perspective with verticals straight. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-035\",\"title\":\"Wellness Spa Retreat\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"warm golden hour\",\"camera\":\"isometric three-quarter view\",\"mood\":\"serene and refined\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a meticulously designed wellness spa retreat space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: warm golden hour. Camera: isometric three-quarter view. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-036\",\"title\":\"Co-working Hub\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"soft diffused daylight\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"warm and welcoming\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a meticulously designed co-working hub space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: soft diffused daylight. Camera: framed view through an architectural opening. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-037\",\"title\":\"Premium Dental Clinic\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"dramatic and sculptural\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a meticulously designed premium dental clinic space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: blue hour with interior glow. Camera: cinematic street-level perspective. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-038\",\"title\":\"Modern Airport Terminal\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"crisp morning daylight\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"airy and minimal\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a meticulously designed modern airport terminal space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: crisp morning daylight. Camera: eye-level three-quarter architectural view. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-039\",\"title\":\"Contemporary Art Museum\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"cinematic dusk\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"intimate and cozy\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a meticulously designed contemporary art museum space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: cinematic dusk. Camera: wide-angle editorial interior view. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-040\",\"title\":\"Technology Showroom\",\"category\":\"Commercial Spaces\",\"tags\":[\"Commercial Spaces\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"overcast natural light\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"luxurious and understated\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a meticulously designed technology showroom space with functional layout, handcrafted furnishings and purposeful architectural detailing. Style: commercial spaces. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: overcast natural light. Camera: symmetrical straight-on composition. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-041\",\"title\":\"Zen Courtyard Garden\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"clear midday sunshine\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"calm and contemplative\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a distinctive zen courtyard garden architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: clear midday sunshine. Camera: elevated oblique aerial view. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-042\",\"title\":\"Infinity Edge Pool\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"vibrant and social\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a distinctive infinity edge pool architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: moody atmospheric lighting. Camera: human-eye 35mm lens perspective. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-043\",\"title\":\"Tropical Resort Garden\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"warm golden hour\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"serene and refined\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a distinctive tropical resort garden architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: warm golden hour. Camera: two-point perspective with verticals straight. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-044\",\"title\":\"Rooftop Sky Garden\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"soft diffused daylight\",\"camera\":\"isometric three-quarter view\",\"mood\":\"warm and welcoming\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a distinctive rooftop sky garden architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: soft diffused daylight. Camera: isometric three-quarter view. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-045\",\"title\":\"Mediterranean Patio\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"dramatic and sculptural\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a distinctive mediterranean patio architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: blue hour with interior glow. Camera: framed view through an architectural opening. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-046\",\"title\":\"Sculptural Desert Garden\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"crisp morning daylight\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"airy and minimal\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a distinctive sculptural desert garden architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: crisp morning daylight. Camera: cinematic street-level perspective. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-047\",\"title\":\"Modern Entry Landscape\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"cinematic dusk\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"intimate and cozy\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a distinctive modern entry landscape architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: cinematic dusk. Camera: eye-level three-quarter architectural view. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-048\",\"title\":\"Rain Garden Pavilion\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"overcast natural light\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"luxurious and understated\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a distinctive rain garden pavilion architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: overcast natural light. Camera: wide-angle editorial interior view. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-049\",\"title\":\"Outdoor Dining Pergola\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"sunset side lighting\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"nature immersed\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a distinctive outdoor dining pergola architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: sunset side lighting. Camera: symmetrical straight-on composition. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-050\",\"title\":\"Urban Pocket Park\",\"category\":\"Landscape & Outdoor\",\"tags\":[\"Landscape & Outdoor\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"low-angle hero composition\",\"mood\":\"futuristic and clean\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a distinctive urban pocket park architectural project with coherent massing, realistic context and buildable design logic. Style: landscape & outdoor. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: subtle warm interior lighting. Camera: low-angle hero composition. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-051\",\"title\":\"Golden Hour Facade\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"warm golden hour\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"serene and refined\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a distinctive golden hour facade architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: warm golden hour. Camera: human-eye 35mm lens perspective. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-052\",\"title\":\"Blue Hour Villa\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"soft diffused daylight\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"warm and welcoming\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a distinctive blue hour villa architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: soft diffused daylight. Camera: two-point perspective with verticals straight. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-053\",\"title\":\"Rainy Night Streetfront\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"isometric three-quarter view\",\"mood\":\"dramatic and sculptural\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a distinctive rainy night streetfront architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: blue hour with interior glow. Camera: isometric three-quarter view. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-054\",\"title\":\"Snowfall Cabin\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"crisp morning daylight\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"airy and minimal\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a distinctive snowfall cabin architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: crisp morning daylight. Camera: framed view through an architectural opening. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-055\",\"title\":\"Foggy Forest Residence\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"cinematic dusk\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"intimate and cozy\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a distinctive foggy forest residence architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: cinematic dusk. Camera: cinematic street-level perspective. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-056\",\"title\":\"Bright Overcast Exterior\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"overcast natural light\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"luxurious and understated\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a distinctive bright overcast exterior architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: overcast natural light. Camera: eye-level three-quarter architectural view. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-057\",\"title\":\"Sunrise Coastal House\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"sunset side lighting\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"nature immersed\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a distinctive sunrise coastal house architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: sunset side lighting. Camera: wide-angle editorial interior view. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-058\",\"title\":\"Moonlit Courtyard\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"futuristic and clean\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a distinctive moonlit courtyard architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: subtle warm interior lighting. Camera: symmetrical straight-on composition. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-059\",\"title\":\"Monsoon Tropical Villa\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"clear midday sunshine\",\"camera\":\"low-angle hero composition\",\"mood\":\"calm and contemplative\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a distinctive monsoon tropical villa architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: clear midday sunshine. Camera: low-angle hero composition. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-060\",\"title\":\"Autumn Afternoon Estate\",\"category\":\"Climate & Lighting\",\"tags\":[\"Climate & Lighting\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"vibrant and social\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a distinctive autumn afternoon estate architectural project with coherent massing, realistic context and buildable design logic. Style: climate & lighting. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: moody atmospheric lighting. Camera: elevated oblique aerial view. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-061\",\"title\":\"Parametric Cultural Center\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"dramatic and sculptural\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a distinctive parametric cultural center architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: blue hour with interior glow. Camera: two-point perspective with verticals straight. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-062\",\"title\":\"Organic Biomorphic Tower\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"crisp morning daylight\",\"camera\":\"isometric three-quarter view\",\"mood\":\"airy and minimal\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a distinctive organic biomorphic tower architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: crisp morning daylight. Camera: isometric three-quarter view. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-063\",\"title\":\"Floating Eco Residence\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"cinematic dusk\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"intimate and cozy\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a distinctive floating eco residence architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: cinematic dusk. Camera: framed view through an architectural opening. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-064\",\"title\":\"AI Smart City Tower\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"overcast natural light\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"luxurious and understated\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a distinctive ai smart city tower architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: overcast natural light. Camera: cinematic street-level perspective. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-065\",\"title\":\"Solar Canopy Pavilion\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"sunset side lighting\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"nature immersed\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a distinctive solar canopy pavilion architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: sunset side lighting. Camera: eye-level three-quarter architectural view. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-066\",\"title\":\"Vertical Forest Residence\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"futuristic and clean\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a distinctive vertical forest residence architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: subtle warm interior lighting. Camera: wide-angle editorial interior view. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-067\",\"title\":\"3D Printed Earth Home\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"clear midday sunshine\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"calm and contemplative\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a distinctive 3d printed earth home architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: clear midday sunshine. Camera: symmetrical straight-on composition. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-068\",\"title\":\"Adaptive Facade Office\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"low-angle hero composition\",\"mood\":\"vibrant and social\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a distinctive adaptive facade office architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: moody atmospheric lighting. Camera: low-angle hero composition. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-069\",\"title\":\"Space Age Desert Habitat\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"warm golden hour\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"serene and refined\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a distinctive space age desert habitat architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: warm golden hour. Camera: elevated oblique aerial view. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-070\",\"title\":\"Net Zero Research Campus\",\"category\":\"Futuristic Concepts\",\"tags\":[\"Futuristic Concepts\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"soft diffused daylight\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"warm and welcoming\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a distinctive net zero research campus architectural project with coherent massing, realistic context and buildable design logic. Style: futuristic concepts. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: soft diffused daylight. Camera: human-eye 35mm lens perspective. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-071\",\"title\":\"Mixed Use Urban Block\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"cinematic dusk\",\"camera\":\"isometric three-quarter view\",\"mood\":\"intimate and cozy\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a distinctive mixed use urban block architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: cinematic dusk. Camera: isometric three-quarter view. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-072\",\"title\":\"Pedestrian Shopping Street\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"overcast natural light\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"luxurious and understated\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a distinctive pedestrian shopping street architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: overcast natural light. Camera: framed view through an architectural opening. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-073\",\"title\":\"Transit Oriented District\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"sunset side lighting\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"nature immersed\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a distinctive transit oriented district architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: sunset side lighting. Camera: cinematic street-level perspective. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-074\",\"title\":\"Eco Township Aerial\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"futuristic and clean\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a distinctive eco township aerial architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: subtle warm interior lighting. Camera: eye-level three-quarter architectural view. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-075\",\"title\":\"University Campus Masterplan\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"clear midday sunshine\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"calm and contemplative\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a distinctive university campus masterplan architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: clear midday sunshine. Camera: wide-angle editorial interior view. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-076\",\"title\":\"Waterfront Promenade\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"vibrant and social\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a distinctive waterfront promenade architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: moody atmospheric lighting. Camera: symmetrical straight-on composition. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-077\",\"title\":\"High Density Housing\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"warm golden hour\",\"camera\":\"low-angle hero composition\",\"mood\":\"serene and refined\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a distinctive high density housing architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: warm golden hour. Camera: low-angle hero composition. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-078\",\"title\":\"Smart Industrial Park\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"soft diffused daylight\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"warm and welcoming\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a distinctive smart industrial park architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: soft diffused daylight. Camera: elevated oblique aerial view. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-079\",\"title\":\"Civic Public Plaza\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"dramatic and sculptural\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a distinctive civic public plaza architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: blue hour with interior glow. Camera: human-eye 35mm lens perspective. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-080\",\"title\":\"Resilient Coastal District\",\"category\":\"Urban & Planning\",\"tags\":[\"Urban & Planning\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"crisp morning daylight\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"airy and minimal\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a distinctive resilient coastal district architectural project with coherent massing, realistic context and buildable design logic. Style: urban & planning. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: crisp morning daylight. Camera: two-point perspective with verticals straight. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-081\",\"title\":\"Architectural Isometric\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"sunset side lighting\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"nature immersed\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Create a professional architectural isometric architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: sunset side lighting. Camera: framed view through an architectural opening. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-082\",\"title\":\"Exploded Axonometric\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"futuristic and clean\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Create a professional exploded axonometric architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: subtle warm interior lighting. Camera: cinematic street-level perspective. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-083\",\"title\":\"Cutaway Interior Section\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"clear midday sunshine\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"calm and contemplative\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Create a professional cutaway interior section architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: clear midday sunshine. Camera: eye-level three-quarter architectural view. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-084\",\"title\":\"Top View Floor Plan\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"vibrant and social\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Create a professional top view floor plan architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: moody atmospheric lighting. Camera: wide-angle editorial interior view. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-085\",\"title\":\"Concept Massing Diagram\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"warm golden hour\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"serene and refined\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Create a professional concept massing diagram architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: warm golden hour. Camera: symmetrical straight-on composition. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-086\",\"title\":\"Material Moodboard\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"soft diffused daylight\",\"camera\":\"low-angle hero composition\",\"mood\":\"warm and welcoming\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Create a professional material moodboard architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: soft diffused daylight. Camera: low-angle hero composition. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-087\",\"title\":\"Facade Elevation Render\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"dramatic and sculptural\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Create a professional facade elevation render architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: blue hour with interior glow. Camera: elevated oblique aerial view. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-088\",\"title\":\"Bird Eye Site Plan\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"crisp morning daylight\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"airy and minimal\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Create a professional bird eye site plan architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: crisp morning daylight. Camera: human-eye 35mm lens perspective. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-089\",\"title\":\"Construction Phasing Visual\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"cinematic dusk\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"intimate and cozy\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Create a professional construction phasing visual architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: cinematic dusk. Camera: two-point perspective with verticals straight. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-090\",\"title\":\"Clay Model Render\",\"category\":\"Presentation & Views\",\"tags\":[\"Presentation & Views\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"overcast natural light\",\"camera\":\"isometric three-quarter view\",\"mood\":\"luxurious and understated\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Create a professional clay model render architectural presentation, visually legible details and accurate spatial organization. Style: presentation & views. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: overcast natural light. Camera: isometric three-quarter view. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-091\",\"title\":\"Day to Night Conversion\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"clear midday sunshine\",\"calm and contemplative\"],\"materials\":\"light limestone, teak, handcrafted tile\",\"lighting\":\"clear midday sunshine\",\"camera\":\"cinematic street-level perspective\",\"mood\":\"calm and contemplative\",\"palette\":\"rich walnut and ivory\",\"environment\":\"minimal landscaped courtyard\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: day to night conversion, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: light limestone, teak, handcrafted tile. Color palette: rich walnut and ivory. Environment: minimal landscaped courtyard. Lighting: clear midday sunshine. Camera: cinematic street-level perspective. Mood: calm and contemplative. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-092\",\"title\":\"Concrete to Natural Stone\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"moody atmospheric lighting\",\"vibrant and social\"],\"materials\":\"travertine, warm oak, low iron glass\",\"lighting\":\"moody atmospheric lighting\",\"camera\":\"eye-level three-quarter architectural view\",\"mood\":\"vibrant and social\",\"palette\":\"warm neutral beige and cream\",\"environment\":\"mature olive trees and ornamental grasses\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: concrete to natural stone, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: travertine, warm oak, low iron glass. Color palette: warm neutral beige and cream. Environment: mature olive trees and ornamental grasses. Lighting: moody atmospheric lighting. Camera: eye-level three-quarter architectural view. Mood: vibrant and social. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-093\",\"title\":\"Replace Landscape Planting\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"warm golden hour\",\"serene and refined\"],\"materials\":\"limestone, pale plaster, bronze\",\"lighting\":\"warm golden hour\",\"camera\":\"wide-angle editorial interior view\",\"mood\":\"serene and refined\",\"palette\":\"stone gray with walnut accents\",\"environment\":\"tropical palms and lush foliage\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: replace landscape planting, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: limestone, pale plaster, bronze. Color palette: stone gray with walnut accents. Environment: tropical palms and lush foliage. Lighting: warm golden hour. Camera: wide-angle editorial interior view. Mood: serene and refined. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-094\",\"title\":\"Add Water Feature\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"soft diffused daylight\",\"warm and welcoming\"],\"materials\":\"rammed earth, dark timber, natural stone\",\"lighting\":\"soft diffused daylight\",\"camera\":\"symmetrical straight-on composition\",\"mood\":\"warm and welcoming\",\"palette\":\"soft sage and sand\",\"environment\":\"native drought tolerant planting\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: add water feature, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: rammed earth, dark timber, natural stone. Color palette: soft sage and sand. Environment: native drought tolerant planting. Lighting: soft diffused daylight. Camera: symmetrical straight-on composition. Mood: warm and welcoming. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-095\",\"title\":\"Change Facade Color\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"blue hour with interior glow\",\"dramatic and sculptural\"],\"materials\":\"brushed concrete, steel, glass\",\"lighting\":\"blue hour with interior glow\",\"camera\":\"low-angle hero composition\",\"mood\":\"dramatic and sculptural\",\"palette\":\"white and natural oak\",\"environment\":\"gravel paths and sculptural shrubs\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: change facade color, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: brushed concrete, steel, glass. Color palette: white and natural oak. Environment: gravel paths and sculptural shrubs. Lighting: blue hour with interior glow. Camera: low-angle hero composition. Mood: dramatic and sculptural. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-096\",\"title\":\"Interior Style Transfer\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"crisp morning daylight\",\"airy and minimal\"],\"materials\":\"white stucco, oak, microcement\",\"lighting\":\"crisp morning daylight\",\"camera\":\"elevated oblique aerial view\",\"mood\":\"airy and minimal\",\"palette\":\"earth terracotta and tan\",\"environment\":\"calm reflecting pool and moss\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: interior style transfer, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: white stucco, oak, microcement. Color palette: earth terracotta and tan. Environment: calm reflecting pool and moss. Lighting: crisp morning daylight. Camera: elevated oblique aerial view. Mood: airy and minimal. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-097\",\"title\":\"Renovate Old Building\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"cinematic dusk\",\"intimate and cozy\"],\"materials\":\"charred timber, black metal, river stone\",\"lighting\":\"cinematic dusk\",\"camera\":\"human-eye 35mm lens perspective\",\"mood\":\"intimate and cozy\",\"palette\":\"deep charcoal and bronze\",\"environment\":\"low clipped hedges and wildflowers\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: renovate old building, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: charred timber, black metal, river stone. Color palette: deep charcoal and bronze. Environment: low clipped hedges and wildflowers. Lighting: cinematic dusk. Camera: human-eye 35mm lens perspective. Mood: intimate and cozy. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-098\",\"title\":\"Furniture Restyling\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"overcast natural light\",\"luxurious and understated\"],\"materials\":\"terracotta, textured limewash, timber\",\"lighting\":\"overcast natural light\",\"camera\":\"two-point perspective with verticals straight\",\"mood\":\"luxurious and understated\",\"palette\":\"pale limestone and olive\",\"environment\":\"forest trees and ferns\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: furniture restyling, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: terracotta, textured limewash, timber. Color palette: pale limestone and olive. Environment: forest trees and ferns. Lighting: overcast natural light. Camera: two-point perspective with verticals straight. Mood: luxurious and understated. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-099\",\"title\":\"Replace Sky and Weather\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"sunset side lighting\",\"nature immersed\"],\"materials\":\"sandstone, warm marble, aged brass\",\"lighting\":\"sunset side lighting\",\"camera\":\"isometric three-quarter view\",\"mood\":\"nature immersed\",\"palette\":\"muted coastal blues\",\"environment\":\"hardscape plaza with planters\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: replace sky and weather, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: sandstone, warm marble, aged brass. Color palette: muted coastal blues. Environment: hardscape plaza with planters. Lighting: sunset side lighting. Camera: isometric three-quarter view. Mood: nature immersed. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"},{\"id\":\"AV-100\",\"title\":\"Enhance Sketch to Render\",\"category\":\"AI Editing Workflows\",\"tags\":[\"AI Editing Workflows\",\"subtle warm interior lighting\",\"futuristic and clean\"],\"materials\":\"exposed brick, polished cement, black steel\",\"lighting\":\"subtle warm interior lighting\",\"camera\":\"framed view through an architectural opening\",\"mood\":\"futuristic and clean\",\"palette\":\"monochrome concrete gray\",\"environment\":\"coastal dunes and native grasses\",\"prompt\":\"Using the uploaded source image as a strict geometry and camera reference, Create an image-to-image architectural editing workflow: enhance sketch to render, preserving the input building massing, original camera position, structural geometry and proportions. Style: ai editing workflows. Materials: exposed brick, polished cement, black steel. Color palette: monochrome concrete gray. Environment: coastal dunes and native grasses. Lighting: subtle warm interior lighting. Camera: framed view through an architectural opening. Mood: futuristic and clean. Photorealistic architectural visualization, physically plausible materials, realistic GI and reflections, refined texture detail, professional composition, balanced exposure, believable scale.\",\"negative_prompt\":\"No watermarks, captions, logos, distorted geometry, floating objects, duplicate furniture, impossible windows, warped perspective, oversaturation or plastic-looking surfaces.\",\"image_url\":null,\"preview_type\":\"illustrative SVG placeholder\",\"source\":\"original preset\"}]");
var looks_new24_038cd411_default = [
	{
		"id": "L17",
		"name": "Hero twilight",
		"mode": "Strict",
		"use": "Sales, launch posters",
		"preset_ids": [
			"P002",
			"P041",
			"P125",
			"P181",
			"P188"
		],
		"rules": ""
	},
	{
		"id": "L18",
		"name": "Brochure interior",
		"mode": "Strict",
		"use": "Print and PDF brochures",
		"preset_ids": [
			"P023",
			"P123",
			"P171",
			"P184",
			"P182"
		],
		"rules": ""
	},
	{
		"id": "L19",
		"name": "Social reel frame",
		"mode": "Balanced",
		"use": "Vertical stills and reels",
		"preset_ids": [
			"P001",
			"P134",
			"P172",
			"P194"
		],
		"rules": ""
	},
	{
		"id": "L20",
		"name": "Ad banner clean",
		"mode": "Strict",
		"use": "Ads with space for text",
		"preset_ids": [
			"P016",
			"P133",
			"P167",
			"P185"
		],
		"rules": ""
	},
	{
		"id": "L21",
		"name": "Aerial masterplan day",
		"mode": "Strict",
		"use": "Township overview",
		"preset_ids": [
			"P019",
			"P126",
			"P099",
			"P199",
			"P200"
		],
		"rules": ""
	},
	{
		"id": "L22",
		"name": "Amenity lifestyle",
		"mode": "Balanced",
		"use": "Pools, clubs, gyms with people",
		"preset_ids": [
			"P101",
			"P102",
			"P187",
			"P161"
		],
		"rules": ""
	},
	{
		"id": "L23",
		"name": "Sample flat staging",
		"mode": "Strict",
		"use": "Furnished unit that feels lived in",
		"preset_ids": [
			"P021",
			"P055",
			"P123",
			"P190",
			"P182"
		],
		"rules": ""
	},
	{
		"id": "L24",
		"name": "Before and after reveal",
		"mode": "Strict",
		"use": "Matched renovation pair",
		"preset_ids": [
			"P171",
			"P123",
			"P190",
			"P181"
		],
		"rules": ""
	},
	{
		"id": "L25",
		"name": "Client review draft",
		"mode": "Balanced",
		"use": "Quick clear draft",
		"preset_ids": [
			"P003",
			"P163",
			"P193"
		],
		"rules": ""
	},
	{
		"id": "L26",
		"name": "Sketch to render",
		"mode": "Balanced",
		"use": "Sketch or line drawing to render",
		"preset_ids": [
			"P123",
			"P163",
			"P181"
		],
		"rules": ""
	},
	{
		"id": "L27",
		"name": "Massing clay",
		"mode": "Strict",
		"use": "Early design, white model",
		"preset_ids": [
			"P003",
			"P169",
			"P181",
			"P189"
		],
		"rules": ""
	},
	{
		"id": "L28",
		"name": "Section and plan render",
		"mode": "Strict",
		"use": "Coloured plans and sections",
		"preset_ids": [
			"P126",
			"P171",
			"P199",
			"P181"
		],
		"rules": ""
	},
	{
		"id": "L29",
		"name": "Material options A/B/C",
		"mode": "Strict",
		"use": "Same view in three finishes",
		"preset_ids": [
			"P023",
			"P171",
			"P182",
			"P181"
		],
		"rules": ""
	},
	{
		"id": "L30",
		"name": "Lighting study",
		"mode": "Strict",
		"use": "Sun path and hour comparison",
		"preset_ids": [
			"P022",
			"P032",
			"P171",
			"P195"
		],
		"rules": ""
	},
	{
		"id": "L31",
		"name": "Design competition",
		"mode": "Balanced",
		"use": "Bold concept board",
		"preset_ids": [
			"P008",
			"P164",
			"P125"
		],
		"rules": ""
	},
	{
		"id": "L32",
		"name": "Rental listing",
		"mode": "Strict",
		"use": "Honest, bright listing",
		"preset_ids": [
			"P023",
			"P122",
			"P171",
			"P182",
			"P199"
		],
		"rules": "Never beautify beyond what exists"
	},
	{
		"id": "L33",
		"name": "Virtual staging",
		"mode": "Strict",
		"use": "Empty room furnished",
		"preset_ids": [
			"P023",
			"P055",
			"P190",
			"P183",
			"P199"
		],
		"rules": "Mark the picture as staged"
	},
	{
		"id": "L34",
		"name": "Renovation preview",
		"mode": "Strict",
		"use": "Existing room, new finishes",
		"preset_ids": [
			"P022",
			"P171",
			"P190",
			"P181"
		],
		"rules": ""
	},
	{
		"id": "L35",
		"name": "Handover snag view",
		"mode": "Strict",
		"use": "Accurate finish check",
		"preset_ids": [
			"P003",
			"P171",
			"P188",
			"P199",
			"P181"
		],
		"rules": "Never beautify beyond what exists"
	},
	{
		"id": "L36",
		"name": "Festive evening",
		"mode": "Balanced",
		"use": "Seasonal campaigns",
		"preset_ids": [
			"P018",
			"P161",
			"P175"
		],
		"rules": ""
	},
	{
		"id": "L37",
		"name": "Monsoon and greenery",
		"mode": "Balanced",
		"use": "Lush wet season",
		"preset_ids": [
			"P062",
			"P083",
			"P074",
			"P163"
		],
		"rules": ""
	},
	{
		"id": "L38",
		"name": "Luxury penthouse night",
		"mode": "Strict",
		"use": "Skyline view, dark interior",
		"preset_ids": [
			"P034",
			"P006",
			"P048",
			"P177"
		],
		"rules": ""
	},
	{
		"id": "L39",
		"name": "Healthcare and wellness",
		"mode": "Strict",
		"use": "Calm clean light",
		"preset_ids": [
			"P027",
			"P060",
			"P167",
			"P184"
		],
		"rules": ""
	},
	{
		"id": "L40",
		"name": "Education campus",
		"mode": "Strict",
		"use": "Bright, welcoming campus",
		"preset_ids": [
			"P010",
			"P099",
			"P187",
			"P167"
		],
		"rules": ""
	}
];
var PRESETS_200 = presets200_e7afd19d_default;
var ARCHVIZ_PRESETS_100 = archviz_presets_afcc8bdf_default;
var PRESET_200_CATEGORIES = ["All", ...Array.from(new Set(PRESETS_200.map((item) => item.category)))];
var ARCHVIZ_100_CATEGORIES = ["All", ...Array.from(new Set(ARCHVIZ_PRESETS_100.map((item) => item.category)))];
var INTENT_LOOKS_16 = [
	{
		id: "client-sales-hero",
		code: "L01",
		name: "Client sales hero",
		bestFor: "Sales, marketing",
		fidelity: "Strict",
		vertical: "exterior",
		light: "Golden hour",
		mood: "Luxurious",
		presetIds: [
			"P001",
			"P121",
			"P141"
		],
		thumbnail: "/viz/p01-pavilion-dusk.jpg",
		beforeThumb: "/viz/p01-pavilion-day.jpg"
	},
	{
		id: "honest-listing",
		code: "L02",
		name: "Honest listing",
		bestFor: "Real-estate, staging",
		fidelity: "Strict",
		disclosureRequired: true,
		rules: "Never beautify beyond what exists",
		vertical: "interior",
		light: "Daylight",
		mood: "Calm & minimal",
		presetIds: [
			"P022",
			"P181",
			"P185"
		],
		thumbnail: "/viz/t03-compact-living-room.jpg",
		beforeThumb: "/viz/t09-living-room-clay-edit.jpg"
	},
	{
		id: "competition-board",
		code: "L03",
		name: "Competition board",
		bestFor: "Competitions",
		fidelity: "Strict",
		vertical: "exterior",
		light: "Soft overcast",
		mood: "Editorial",
		presetIds: [
			"P003",
			"P125",
			"P144"
		],
		thumbnail: "/viz/t02-sectional-arts-center.jpg",
		beforeThumb: "/viz/t01-public-library.jpg"
	},
	{
		id: "planning-submission",
		code: "L04",
		name: "Planning submission",
		bestFor: "Planning authority",
		fidelity: "Strict",
		vertical: "exterior",
		light: "Daylight",
		mood: "Neutral",
		presetIds: [
			"P004",
			"P182",
			"P183"
		],
		thumbnail: "/viz/t01-public-library.jpg",
		beforeThumb: "/viz/p01-pavilion-day.jpg"
	},
	{
		id: "quick-concept",
		code: "L05",
		name: "Quick concept",
		bestFor: "Early ideas",
		fidelity: "Balanced",
		vertical: "exterior",
		light: "Golden hour",
		mood: "Bold",
		presetIds: ["P012", "P142"],
		thumbnail: "/viz/t07-cultural-campus.jpg",
		beforeThumb: "/viz/p01-pavilion-day.jpg"
	},
	{
		id: "magazine-editorial",
		code: "L06",
		name: "Magazine editorial",
		bestFor: "Publications",
		fidelity: "Balanced",
		vertical: "interior",
		light: "Soft overcast",
		mood: "Editorial",
		presetIds: [
			"P021",
			"P122",
			"P161"
		],
		thumbnail: "/viz/t04-neighborhood-cafe.jpg",
		beforeThumb: "/viz/t03-compact-living-room.jpg"
	},
	{
		id: "night-glow",
		code: "L07",
		name: "Night glow",
		bestFor: "Evening mood",
		fidelity: "Strict",
		vertical: "exterior",
		light: "Evening",
		mood: "Moody",
		presetIds: [
			"P002",
			"P013",
			"P165"
		],
		thumbnail: "/viz/t10-home-dusk-edit.jpg",
		beforeThumb: "/viz/t05-subtropical-home.jpg"
	},
	{
		id: "rainy-mood",
		code: "L08",
		name: "Rainy mood",
		bestFor: "Atmosphere",
		fidelity: "Balanced",
		vertical: "exterior",
		light: "Soft overcast",
		mood: "Moody",
		presetIds: ["P063", "P066"],
		thumbnail: "/viz/p01-pavilion-dusk.jpg",
		beforeThumb: "/viz/p01-pavilion-day.jpg"
	},
	{
		id: "winter-light",
		code: "L09",
		name: "Winter light",
		bestFor: "Seasonal",
		fidelity: "Strict",
		vertical: "exterior",
		light: "Daylight",
		mood: "Calm & minimal",
		presetIds: ["P009", "P068"],
		thumbnail: "/viz/p01-pavilion-day.jpg",
		beforeThumb: "/viz/t05-subtropical-home.jpg"
	},
	{
		id: "family-home",
		code: "L10",
		name: "Family home",
		bestFor: "Residential",
		fidelity: "Strict",
		vertical: "interior",
		light: "Golden hour",
		mood: "Warm & cosy",
		presetIds: [
			"P023",
			"P041",
			"P162"
		],
		thumbnail: "/viz/t05-subtropical-home.jpg",
		beforeThumb: "/viz/t09-living-room-clay-edit.jpg"
	},
	{
		id: "hospitality-lobby",
		code: "L11",
		name: "Hospitality lobby",
		bestFor: "Hotels, restaurants",
		fidelity: "Strict",
		vertical: "amenities",
		light: "Evening",
		mood: "Luxurious",
		presetIds: [
			"P025",
			"P043",
			"P163"
		],
		thumbnail: "/viz/t04-neighborhood-cafe.jpg",
		beforeThumb: "/viz/t06-urban-courtyard.jpg"
	},
	{
		id: "workplace",
		code: "L12",
		name: "Workplace",
		bestFor: "Offices",
		fidelity: "Strict",
		vertical: "interior",
		light: "Daylight",
		mood: "Fresh & bright",
		presetIds: ["P022", "P045"],
		thumbnail: "/viz/t01-public-library.jpg",
		beforeThumb: "/viz/t09-living-room-clay-edit.jpg"
	},
	{
		id: "retail-window",
		code: "L13",
		name: "Retail window",
		bestFor: "Retail",
		fidelity: "Strict",
		vertical: "exterior",
		light: "Evening",
		mood: "Editorial",
		presetIds: ["P002", "P186"],
		thumbnail: "/viz/t04-neighborhood-cafe.jpg",
		beforeThumb: "/viz/t02-sectional-arts-center.jpg"
	},
	{
		id: "landscape-master-view",
		code: "L14",
		name: "Landscape master view",
		bestFor: "Masterplans",
		fidelity: "Strict",
		vertical: "landscape",
		light: "Golden hour",
		mood: "Warm & cosy",
		presetIds: [
			"P081",
			"P083",
			"P127"
		],
		thumbnail: "/viz/t06-urban-courtyard.jpg",
		beforeThumb: "/viz/t07-cultural-campus.jpg"
	},
	{
		id: "material-study",
		code: "L15",
		name: "Material study",
		bestFor: "Detail, specification",
		fidelity: "Balanced",
		vertical: "interior",
		light: "Soft overcast",
		mood: "Calm & minimal",
		presetIds: [
			"P041",
			"P044",
			"P129"
		],
		thumbnail: "/viz/t08-material-junction.jpg",
		beforeThumb: "/viz/t09-living-room-clay-edit.jpg"
	},
	{
		id: "moodboard-sketch",
		code: "L16",
		name: "Moodboard sketch",
		bestFor: "Concept boards",
		fidelity: "Creative",
		vertical: "exterior",
		light: "Soft overcast",
		mood: "Editorial",
		presetIds: ["P145", "P147"],
		thumbnail: "/viz/t09-living-room-clay-edit.jpg",
		beforeThumb: "/viz/p01-pavilion-day.jpg"
	}
];
var NEW_LOOK_VISUAL_MAP = {
	L17: {
		vertical: "exterior",
		light: "Evening",
		mood: "Luxurious",
		thumbnail: "/viz/matrix/parametric-dusk.jpg",
		beforeThumb: "/viz/p01-pavilion-day.jpg"
	},
	L18: {
		vertical: "interior",
		light: "Daylight",
		mood: "Editorial",
		thumbnail: "/viz/matrix/interior-luxe.jpg",
		beforeThumb: "/viz/t09-r1-living-room-clay-edit.jpg"
	},
	L19: {
		vertical: "exterior",
		light: "Golden hour",
		mood: "Bold",
		thumbnail: "/viz/p01-pavilion-dusk.jpg",
		beforeThumb: "/viz/matrix/clay-exterior.jpg"
	},
	L20: {
		vertical: "exterior",
		light: "Daylight",
		mood: "Calm & minimal",
		thumbnail: "/viz/t01-public-library.jpg",
		beforeThumb: "/viz/matrix/clay-exterior.jpg"
	},
	L21: {
		vertical: "landscape",
		light: "Daylight",
		mood: "Fresh & bright",
		thumbnail: "/viz/matrix/urban-aerial.jpg",
		beforeThumb: "/viz/t07-cultural-campus.jpg"
	},
	L22: {
		vertical: "amenities",
		light: "Golden hour",
		mood: "Warm & cosy",
		thumbnail: "/viz/matrix/zen-courtyard.jpg",
		beforeThumb: "/viz/t06-urban-courtyard.jpg"
	},
	L23: {
		vertical: "interior",
		light: "Golden hour",
		mood: "Warm & cosy",
		thumbnail: "/viz/p02-loft-after.jpg",
		beforeThumb: "/viz/p02-loft-before.jpg"
	},
	L24: {
		vertical: "interior",
		light: "Daylight",
		mood: "Editorial",
		thumbnail: "/viz/p02-loft-after.jpg",
		beforeThumb: "/viz/p02-loft-before.jpg"
	},
	L25: {
		vertical: "exterior",
		light: "Soft overcast",
		mood: "Neutral",
		thumbnail: "/viz/p01-pavilion-day.jpg",
		beforeThumb: "/viz/matrix/clay-exterior.jpg"
	},
	L26: {
		vertical: "exterior",
		light: "Golden hour",
		mood: "Editorial",
		thumbnail: "/viz/t05-subtropical-home.jpg",
		beforeThumb: "/viz/matrix/clay-exterior.jpg"
	},
	L27: {
		vertical: "exterior",
		light: "Soft overcast",
		mood: "Calm & minimal",
		thumbnail: "/viz/matrix/clay-exterior.jpg",
		beforeThumb: "/viz/t02-sectional-arts-center.jpg"
	},
	L28: {
		vertical: "exterior",
		light: "Soft overcast",
		mood: "Editorial",
		thumbnail: "/viz/t02-sectional-arts-center.jpg",
		beforeThumb: "/viz/matrix/clay-exterior.jpg"
	},
	L29: {
		vertical: "interior",
		light: "Soft overcast",
		mood: "Calm & minimal",
		thumbnail: "/viz/t08-material-junction.jpg",
		beforeThumb: "/viz/t09-r1-living-room-clay-edit.jpg"
	},
	L30: {
		vertical: "exterior",
		light: "Golden hour",
		mood: "Moody",
		thumbnail: "/viz/t10-home-dusk-edit.jpg",
		beforeThumb: "/viz/t05-subtropical-home.jpg"
	},
	L31: {
		vertical: "exterior",
		light: "Soft overcast",
		mood: "Bold",
		thumbnail: "/viz/t07-cultural-campus.jpg",
		beforeThumb: "/viz/matrix/clay-exterior.jpg"
	},
	L32: {
		vertical: "interior",
		light: "Daylight",
		mood: "Fresh & bright",
		thumbnail: "/viz/t03-compact-living-room.jpg",
		beforeThumb: "/viz/p02-loft-before.jpg"
	},
	L33: {
		vertical: "interior",
		light: "Daylight",
		mood: "Warm & cosy",
		thumbnail: "/viz/matrix/interior-luxe.jpg",
		beforeThumb: "/viz/p02-loft-before.jpg"
	},
	L34: {
		vertical: "interior",
		light: "Daylight",
		mood: "Editorial",
		thumbnail: "/viz/p02-loft-after.jpg",
		beforeThumb: "/viz/p02-loft-before.jpg"
	},
	L35: {
		vertical: "interior",
		light: "Soft overcast",
		mood: "Neutral",
		thumbnail: "/viz/t08-material-junction.jpg",
		beforeThumb: "/viz/t03-compact-living-room.jpg"
	},
	L36: {
		vertical: "amenities",
		light: "Evening",
		mood: "Warm & cosy",
		thumbnail: "/viz/t10-home-dusk-edit.jpg",
		beforeThumb: "/viz/t05-subtropical-home.jpg"
	},
	L37: {
		vertical: "landscape",
		light: "Soft overcast",
		mood: "Moody",
		thumbnail: "/viz/matrix/zen-courtyard.jpg",
		beforeThumb: "/viz/t05-subtropical-home.jpg"
	},
	L38: {
		vertical: "interior",
		light: "Evening",
		mood: "Luxurious",
		thumbnail: "/viz/matrix/parametric-dusk.jpg",
		beforeThumb: "/viz/matrix/interior-luxe.jpg"
	},
	L39: {
		vertical: "amenities",
		light: "Daylight",
		mood: "Calm & minimal",
		thumbnail: "/viz/t01-public-library.jpg",
		beforeThumb: "/viz/t09-r1-living-room-clay-edit.jpg"
	},
	L40: {
		vertical: "exterior",
		light: "Daylight",
		mood: "Fresh & bright",
		thumbnail: "/viz/t07-cultural-campus.jpg",
		beforeThumb: "/viz/matrix/urban-aerial.jpg"
	}
};
function slugifyLookId(code, name) {
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	return `${code.toLowerCase()}-${slug}`;
}
var INTENT_LOOKS_NEW_24 = looks_new24_038cd411_default.map((raw) => {
	const visual = NEW_LOOK_VISUAL_MAP[raw.id] ?? {
		vertical: "exterior",
		light: "Daylight",
		mood: "Editorial",
		thumbnail: "/viz/p01-pavilion-dusk.jpg",
		beforeThumb: "/viz/p01-pavilion-day.jpg"
	};
	const cleanRules = raw.rules?.trim() || void 0;
	return {
		id: slugifyLookId(raw.id, raw.name),
		code: raw.id,
		name: raw.name,
		bestFor: raw.use,
		fidelity: raw.mode,
		disclosureRequired: Boolean(cleanRules),
		rules: cleanRules,
		vertical: visual.vertical,
		light: visual.light,
		mood: visual.mood,
		presetIds: raw.preset_ids,
		thumbnail: visual.thumbnail,
		beforeThumb: visual.beforeThumb
	};
});
var INTENT_LOOKS_40 = [...INTENT_LOOKS_16, ...INTENT_LOOKS_NEW_24];
function filterIntentLooks40(query, mode = "All") {
	const q = query.trim().toLowerCase();
	return INTENT_LOOKS_40.filter((look) => {
		if (mode !== "All" && look.fidelity !== mode) return false;
		if (!q) return true;
		return `${look.code} ${look.name} ${look.bestFor} ${look.vertical} ${look.light} ${look.mood} ${look.rules ?? ""} ${look.presetIds.join(" ")}`.toLowerCase().includes(q);
	});
}
var PLAIN_QUESTIONS_8 = [
	{
		id: "camera",
		label: "Camera",
		question: "Where am I standing?",
		tiles: [
			"Auto",
			"Keep my view",
			"Eye level",
			"Wide interior",
			"One-point",
			"Two-point",
			"Street level",
			"Elevation",
			"High oblique",
			"Drone top-down",
			"Detail close-up"
		]
	},
	{
		id: "time",
		label: "Time",
		question: "When is it?",
		tiles: [
			"Auto",
			"Match my shadows",
			"Morning",
			"Midday",
			"Late afternoon",
			"Golden hour",
			"Sunset",
			"Blue hour",
			"Night"
		]
	},
	{
		id: "weather",
		label: "Weather",
		question: "What is the sky like?",
		tiles: [
			"Auto",
			"Keep as is",
			"Clear",
			"Soft overcast",
			"Broken cloud",
			"Light rain",
			"Fog",
			"Snow",
			"Spring or Autumn"
		]
	},
	{
		id: "mood",
		label: "Mood",
		question: "How should it feel?",
		tiles: [
			"Auto",
			"Neutral",
			"Warm & cosy",
			"Calm & minimal",
			"Bold & graphic",
			"Luxurious",
			"Moody",
			"Fresh & bright",
			"Editorial"
		]
	},
	{
		id: "materials",
		label: "Materials",
		question: "What is it made of?",
		tiles: [
			"Auto",
			"As drawn",
			"Warm timber",
			"Raw concrete",
			"Brick",
			"Glass & steel",
			"Stone",
			"White plaster",
			"Terrazzo",
			"Green wall",
			"Textile"
		]
	},
	{
		id: "people",
		label: "People",
		question: "Who is around?",
		tiles: [
			"Auto",
			"None",
			"Silhouettes",
			"A few distant",
			"Lived-in",
			"Busy",
			"Vehicles"
		]
	},
	{
		id: "site",
		label: "Site",
		question: "What surrounds it?",
		tiles: [
			"Auto",
			"Keep my context",
			"Urban street",
			"Suburban",
			"Nature",
			"Waterfront",
			"Courtyard",
			"Rooftop"
		]
	},
	{
		id: "finish",
		label: "Finish",
		question: "How finished is it?",
		tiles: [
			"Auto",
			"Photoreal",
			"Soft CGI",
			"White clay",
			"Marker sketch",
			"Watercolour",
			"Line drawing",
			"Blueprint",
			"Night model"
		]
	}
];
var PRD_MATERIAL_PALETTE = [
	{
		id: "mat-basalt",
		space: "exterior",
		role: "Facade",
		name: "Blackened Basalt",
		finish: "Split Honed",
		hex: "#2A3038",
		scaleMeters: "1.2m × 0.6m",
		licence: "CC0",
		source: "Poly Haven",
		fragment: "blackened honed basalt stone cladding"
	},
	{
		id: "mat-cedar",
		space: "exterior",
		role: "Cladding",
		name: "Smoked Nordic Cedar",
		finish: "Charred Slat",
		hex: "#5C4332",
		scaleMeters: "0.14m planks",
		licence: "CC0",
		source: "ambientCG",
		fragment: "smoked Nordic cedar vertical timber slats"
	},
	{
		id: "mat-lowiron",
		space: "exterior",
		role: "Glazing",
		name: "Low-Iron Triple Glass",
		finish: "Anti-Reflect",
		hex: "#9EC2D6",
		scaleMeters: "2.8m mullion",
		licence: "CC0",
		source: "Poly Haven",
		fragment: "ultra clear triple-glazed curtain wall"
	},
	{
		id: "mat-zinc",
		space: "exterior",
		role: "Roof",
		name: "Weathered Titanium Zinc",
		finish: "Standing Seam",
		hex: "#5F6B75",
		scaleMeters: "0.45m seam",
		licence: "CC0",
		source: "ambientCG",
		fragment: "matte weathered standing-seam zinc roofing"
	},
	{
		id: "mat-travertine",
		space: "interior",
		role: "Floors",
		name: "Honed Roman Travertine",
		finish: "Open Vein",
		hex: "#D6CBB8",
		scaleMeters: "0.9m × 0.9m",
		licence: "CC0",
		source: "Poly Haven",
		fragment: "honed Roman travertine large-format stone floor"
	},
	{
		id: "mat-oak",
		space: "interior",
		role: "Joinery",
		name: "Quarter-Sawn White Oak",
		finish: "Raw Oil",
		hex: "#B99A73",
		scaleMeters: "0.18m grain",
		licence: "CC0",
		source: "ambientCG",
		fragment: "warm quarter-sawn white oak millwork"
	},
	{
		id: "mat-plaster",
		space: "interior",
		role: "Walls",
		name: "Limewashed Mineral Plaster",
		finish: "Troweled",
		hex: "#E5DFD3",
		scaleMeters: "Seamless",
		licence: "CC0",
		source: "Poly Haven",
		fragment: "soft chalky limewash mineral plaster walls"
	},
	{
		id: "mat-boucle",
		space: "interior",
		role: "Fabrics",
		name: "Oatmeal Wool Bouclé",
		finish: "Woven Matte",
		hex: "#DCD5C7",
		scaleMeters: "0.02m weave",
		licence: "CC0",
		source: "ambientCG",
		fragment: "tactile oatmeal wool bouclé upholstery"
	},
	{
		id: "mat-paving",
		space: "landscape",
		role: "Paving",
		name: "Flamed Granite Sett",
		finish: "Bush-hammered",
		hex: "#767D84",
		scaleMeters: "0.2m × 0.2m",
		licence: "CC0",
		source: "Poly Haven",
		fragment: "damp flamed granite courtyard paving"
	},
	{
		id: "mat-deck",
		space: "landscape",
		role: "Decking",
		name: "Accoya Thermal Ash",
		finish: "Brushed",
		hex: "#8A7158",
		scaleMeters: "0.12m boards",
		licence: "CC0",
		source: "ambientCG",
		fragment: "silvered Accoya timber waterfront decking"
	},
	{
		id: "mat-pool",
		space: "amenities",
		role: "Water",
		name: "Deep Fjord Pool Mosaic",
		finish: "Satin Glaze",
		hex: "#284B5C",
		scaleMeters: "0.05m tile",
		licence: "CC0",
		source: "Poly Haven",
		fragment: "dark slate pool basin with clear gentle water caustics"
	},
	{
		id: "mat-brass",
		space: "amenities",
		role: "Fixtures",
		name: "Brushed Champagne Bronze",
		finish: "Satin",
		hex: "#C2A168",
		scaleMeters: "Hardware",
		licence: "CC0",
		source: "Poly Haven",
		fragment: "brushed champagne bronze architectural hardware"
	}
];
var PRD_LIGHT_PALETTE = [
	{
		id: "lp-ext-golden",
		space: "exterior",
		name: "Nordic Golden Glint",
		kelvin: 2800,
		direction: "Low 24° West",
		iesProfile: "Solar_Low_24deg.ies",
		fragment: "low golden hour sun glint at 24° with crisp timber rimlight",
		lightField: "Golden hour"
	},
	{
		id: "lp-ext-blue",
		space: "exterior",
		name: "Blue Hour Interior Glow",
		kelvin: 3200,
		direction: "Ambient + Interior 2700K",
		iesProfile: "Twilight_Balanced.ies",
		fragment: "cobalt twilight sky with warm 2700K glowing glazing",
		lightField: "Evening"
	},
	{
		id: "lp-ext-overcast",
		space: "exterior",
		name: "Harbor Soft Overcast",
		kelvin: 5600,
		direction: "Zenith Diffuse",
		iesProfile: "Sky_Overcast_Diffuse.ies",
		fragment: "soft maritime overcast daylight with calm even shadows",
		lightField: "Soft overcast"
	},
	{
		id: "lp-ext-night",
		space: "exterior",
		name: "Facade Wash Night",
		kelvin: 3e3,
		direction: "Uplight + Graze",
		iesProfile: "Wall_Wash_Narrow15.ies",
		fragment: "nocturnal architectural wall washers and warm soffit glow",
		lightField: "Night"
	},
	{
		id: "lp-int-morning",
		space: "interior",
		name: "Crisp Window Daylight",
		kelvin: 5200,
		direction: "Side Glazing",
		iesProfile: "Sun_Window_Soft.ies",
		fragment: "bright morning daylight streaming across oak flooring",
		lightField: "Daylight"
	},
	{
		id: "lp-int-cove",
		space: "interior",
		name: "2700K Cove & Pendant",
		kelvin: 2700,
		direction: "Concealed Cove",
		iesProfile: "Linear_Cove_2700K.ies",
		fragment: "cosy 2700K architectural cove lighting and warm pendant",
		lightField: "Evening"
	},
	{
		id: "lp-land-path",
		space: "landscape",
		name: "Path & Tree Uplights",
		kelvin: 2900,
		direction: "Bollard + Uplight",
		iesProfile: "Bollard_LowGlare.ies",
		fragment: "subtle bollard path lighting and specimen tree uplights at dusk",
		lightField: "Evening"
	},
	{
		id: "lp-amen-pool",
		space: "amenities",
		name: "Pool Underwater Caustics",
		kelvin: 4e3,
		direction: "Submerged LED + Sky",
		iesProfile: "Pool_Caustics_4000K.ies",
		fragment: "submerged warm pool glow with shimmering water caustics",
		lightField: "Evening"
	}
];
function filterPresets200(query, category = "All", mode = "all") {
	const q = query.trim().toLowerCase();
	return PRESETS_200.filter((item) => {
		if (category !== "All" && item.category !== category) return false;
		if (mode === "positive" && item.is_negative) return false;
		if (mode === "negative" && !item.is_negative) return false;
		if (!q) return true;
		return item.id.toLowerCase().includes(q) || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.fragment.toLowerCase().includes(q);
	});
}
function filterArchviz100(query, category = "All") {
	const q = query.trim().toLowerCase();
	return ARCHVIZ_PRESETS_100.filter((item) => {
		if (category !== "All" && item.category !== category) return false;
		if (!q) return true;
		return item.id.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.materials.toLowerCase().includes(q) || item.lighting.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
	});
}
var CONFLICT_PAIRS = [
	[
		[
			"night",
			"moonlit",
			"blue hour",
			"evening"
		],
		[
			"midday",
			"high noon",
			"noon sun"
		],
		"Conflicting lighting time (Night/Evening vs High Noon)"
	],
	[
		["snow", "winter"],
		["summer afternoon", "tropical"],
		"Conflicting season atmosphere (Winter/Snow vs Summer/Tropical)"
	],
	[
		["fog", "mist"],
		["clear hard sun", "crystal clear"],
		"Conflicting visibility (Heavy Fog vs Clear Hard Sun)"
	]
];
function lintPromptRules(sentence, activePresetIds, negativePresetIds, options) {
	const issues = [];
	const combined = `${sentence.toLowerCase()} ${PRESETS_200.filter((p) => activePresetIds.includes(p.id)).map((p) => `${p.name} ${p.fragment}`).join(" ").toLowerCase()}`;
	if (sentence.length > 900) issues.push({
		code: "L01",
		severity: "warn",
		message: "L01: Prompt exceeds 900 chars; late tokens may lose weight.",
		fixHint: "Trim redundant clauses"
	});
	if (activePresetIds.length > 6) issues.push({
		code: "L02",
		severity: "warn",
		message: `L02: ${activePresetIds.length} stacked presets may dilute main material focus.`,
		fixHint: "Keep 2-5 key presets"
	});
	if (sentence.split(/\s+/).filter(Boolean).length > 85) issues.push({
		code: "L03",
		severity: "warn",
		message: "L03: Long free-form paragraph (>85 words) weakens structure lock."
	});
	for (const [groupA, groupB, label] of CONFLICT_PAIRS) if (groupA.some((k) => combined.includes(k)) && groupB.some((k) => combined.includes(k))) issues.push({
		code: "L04",
		severity: "error",
		message: `L04: ${label}`,
		fixHint: "Remove one conflicting time/season preset"
	});
	if (/\bno\s+(people|cars|trees|clouds|clutter|text)\b/i.test(sentence)) issues.push({
		code: "L05",
		severity: "warn",
		message: "L05: 'no X' negations work better as negative (−) guard pills.",
		fixHint: "Convert to (−) guard"
	});
	if ((options?.geometryLock ?? 85) >= 85 && /\b(redesign structure|change roofline|demolish|rearrange walls)\b/i.test(combined)) issues.push({
		code: "L06",
		severity: "error",
		message: "L06: Prompt requests structural demolition while Strict Geometry Lock is ON."
	});
	const overlap = activePresetIds.filter((id) => negativePresetIds.includes(id));
	if (overlap.length > 0) issues.push({
		code: "L07",
		severity: "error",
		message: `L07: Same preset (${overlap[0]}) enabled as both (+) and (−).`
	});
	const allowedRatios = /* @__PURE__ */ new Set([
		"16:9",
		"4:3",
		"3:2",
		"1:1",
		"3:4",
		"4:5",
		"9:16",
		"21:9"
	]);
	if (options?.ratio && !allowedRatios.has(options.ratio)) issues.push({
		code: "L08",
		severity: "warn",
		message: `L08: Unusual aspect ratio ${options.ratio}.`
	});
	return issues;
}
function compileSentencePrompt(params) {
	const positiveItems = PRESETS_200.filter((p) => params.activePresetIds.includes(p.id) && !p.is_negative);
	const negativeItems = PRESETS_200.filter((p) => params.negativePresetIds.includes(p.id) || params.activePresetIds.includes(p.id) && p.is_negative);
	const qFrags = Object.entries(params.questionPicks).filter(([, val]) => val && val !== "Auto" && val !== "Keep my view" && val !== "Keep as is" && val !== "As drawn" && val !== "Keep my context").map(([k, val]) => `${k}: ${val}`);
	const pFrags = positiveItems.map((p) => {
		const str = params.presetStrengths[p.id] ?? p.strength ?? 1;
		return Math.abs(str - 1) > .08 ? `${p.fragment} (${str.toFixed(2)}x)` : p.fragment;
	});
	const keepRule = params.preserveClause?.trim() || "Keep every wall, window opening, camera angle, and roofline strictly as drawn.";
	const sentence = `${[
		params.baseIdea.trim() || `${params.design.look} ${params.design.vertical} architectural visualization`,
		...qFrags,
		...pFrags
	].filter(Boolean).join(", ")}. ${params.engine.geometryLock >= 70 ? keepRule : ""}`.trim();
	return {
		sentence,
		negativePrompt: ["No distorted geometry, warped verticals, extra windows, watermarks, or captions", ...negativeItems.map((n) => n.fragment)].join("; "),
		issues: lintPromptRules(sentence, params.activePresetIds, params.negativePresetIds, {
			geometryLock: params.engine.geometryLock,
			seedLocked: params.engine.seedLocked
		}),
		estimatedCredits: params.engine.outputMode === "grid-4" ? 16 : 8
	};
}
function resolveAccuracyRung(inputClass) {
	switch (inputClass) {
		case "glb-3d": return {
			rung: 1,
			label: "GLB / SketchUp Model",
			badge: "Model-accurate",
			signal: "True depth, normals, material & object IDs",
			targetPct: 97
		};
		case "3d-snapshot": return {
			rung: 2,
			label: "3D Viewport Snapshot",
			badge: "Geometry-locked",
			signal: "Depth + line + segmentation passes",
			targetPct: 95
		};
		case "floor-plan": return {
			rung: 3,
			label: "CAD / 2D Plan",
			badge: "Plan-locked",
			signal: "Line extraction + extruded walls",
			targetPct: 93
		};
		case "sketch": return {
			rung: 4,
			label: "Architectural Sketch",
			badge: "Line-locked",
			signal: "Cleaned edge Canny / lineart control",
			targetPct: 90
		};
		case "photo": return {
			rung: 5,
			label: "Site / Room Photo",
			badge: "Photo-based",
			signal: "Estimated monocular depth + SAM segmentation",
			targetPct: 88
		};
		default: return {
			rung: 6,
			label: "Text Brief",
			badge: "Creative",
			signal: "Prompt faithfulness",
			targetPct: 85
		};
	}
}
function buildDefaultDesignContract(params) {
	const inputClass = params.has3D ? "3d-snapshot" : params.hasPlan ? "floor-plan" : params.hasSketch ? "sketch" : params.hasUpload ? "photo" : "text";
	const rung = resolveAccuracyRung(inputClass);
	return {
		inputClass,
		spaceType: `${params.look} ${params.vertical}`,
		rung,
		observedFacts: [
			`Input classified as ${rung.label} (${rung.badge})`,
			`Vertical: ${params.vertical} · Horizon & two-point verticals preserved`,
			`Openings & silhouette locked under ${params.fidelity === "draft" ? "Balanced" : "Strict"} guard`
		],
		detectedObjects: {
			exterior: [
				"Primary structural envelope",
				"Curtain glazing bays",
				"Roof overhang & soffit",
				"Waterfront plinth"
			],
			interior: [
				"Perimeter walls",
				"Window mullions",
				"Timber ceiling plane",
				"Primary seating zone"
			],
			amenities: [
				"Pool basin perimeter",
				"Lounger deck zone",
				"Feature canopy",
				"Landscape planters"
			],
			landscape: [
				"Hardscape walkways",
				"Specimen canopy trees",
				"Water reflection basin",
				"Boundary walls"
			]
		}[params.vertical],
		preserveClause: "Keep walls, window openings, roofline, and camera perspective as drawn",
		lockedPreserve: true,
		fidelityMode: params.fidelity === "draft" ? "balanced" : "strict"
	};
}
function evaluateFidelityGate(params) {
	const geo = Math.max(.55, Math.min(.99, (params.geometryLock || 85) / 100 + (params.hasSource ? .06 : -.04)));
	const promptRichness = (params.idea?.trim().length ?? 0) > 12 ? .94 : .87;
	const checks = [
		{
			id: "C1",
			name: "Line structure",
			score: Number(Math.min(.98, geo).toFixed(2)),
			passed: geo >= .8,
			hardFail: false,
			note: "Edge-map overlap against massing"
		},
		{
			id: "C2",
			name: "Depth consistency",
			score: Number(Math.min(.97, geo + .02).toFixed(2)),
			passed: geo + .02 >= .86,
			hardFail: false,
			note: "Monocular depth plane correlation"
		},
		{
			id: "C3",
			name: "Opening count",
			score: params.geometryLock >= 70 ? .96 : .78,
			passed: params.geometryLock >= 70,
			hardFail: params.geometryLock < 45,
			note: "Window & door bay parity"
		},
		{
			id: "C4",
			name: "Object diff",
			score: .92,
			passed: true,
			hardFail: false,
			note: "No unrequested massing additions"
		},
		{
			id: "C5",
			name: "Mask integrity",
			score: params.hasMask ? .96 : .95,
			passed: true,
			hardFail: false,
			note: "Untouched region pixel lock"
		},
		{
			id: "C6",
			name: "Prompt adherence",
			score: promptRichness,
			passed: true,
			hardFail: false,
			note: "Material, light & lens tokens verified"
		},
		{
			id: "C7",
			name: "Artifacts & text",
			score: .95,
			passed: true,
			hardFail: false,
			note: "No duplicate mullions or text warp"
		},
		{
			id: "C8",
			name: "Perspective & exposure",
			score: .93,
			passed: true,
			hardFail: false,
			note: "Verticals within 1.2°, highlights unclipped"
		},
		{
			id: "C9",
			name: "Policy & provenance",
			score: 1,
			passed: true,
			hardFail: false,
			note: "C2PA credential & safety clear"
		},
		{
			id: "C10",
			name: "Staging integrity",
			score: params.disclosureRequired ? .92 : .96,
			passed: true,
			hardFail: false,
			note: "Fixtures & shell preserved"
		}
	];
	const avg = checks.reduce((acc, c) => acc + c.score, 0) / checks.length;
	const overallScore = Number(avg.toFixed(2));
	const status = checks.some((c) => c.hardFail) || overallScore < .7 ? "flagged" : overallScore >= .85 ? "verified" : "review";
	return {
		overallScore,
		status,
		refundEligible: status === "flagged",
		disclosureLabel: params.disclosureRequired ? "Virtually Staged · Architectural Visualization (Not a Construction Document)" : "AI Architectural Visualization · Illustrative Artist's Impression",
		changedElements: [
			`Surface & atmosphere updated (${params.isFallback ? "Studio Composite" : "Diffusion Render"})`,
			params.seedLocked ? "Seed & lighting mood anchored" : "Fresh directional seed sampled",
			"Structural walls, glazing bays & camera horizon preserved"
		],
		checks,
		evaluatedAt: Date.now()
	};
}
var NAMED_STUDIOS = [
	{
		id: "mas-2d",
		shortLabel: "MAS 2D",
		label: "MAS 2D Studio",
		subtitle: "Photoshop & Compose canvas + Material/Light palettes"
	},
	{
		id: "sam-3d",
		shortLabel: "SAM 3D",
		label: "SAM 3D Studio",
		subtitle: "Live 3D Split Canvas, CAD Extrusion & Camera Board"
	},
	{
		id: "king-360",
		shortLabel: "KING 360",
		label: "KING 360 Studio",
		subtitle: "Panorama Grade, Seams & Virtual Tour Builder"
	},
	{
		id: "kum-video",
		shortLabel: "KUM Video",
		label: "KUM Video Studio",
		subtitle: "Storyboard Director, Multi-track Timeline & MP4"
	},
	{
		id: "node-studio",
		shortLabel: "Node",
		label: "Node Studio",
		subtitle: "Infinite DAG Pipeline Graph & Cached Caching"
	}
];
var DEFAULT_LOOK_ANCHOR = {
	version: 1,
	label: "Misty Harbor Golden Hour",
	thumbnailUrl: "/viz/p01-pavilion-dusk.jpg",
	paletteHexes: [
		"#08131F",
		"#16314A",
		"#CFE3F0",
		"#E8C98A",
		"#5C4332"
	],
	lightDirection: "Low 24° West Sun",
	colorTempK: 3200,
	timeOfDay: "Golden Hour",
	contrastLevel: "Balanced",
	lockStrength: "strict",
	locked: true,
	createdAt: Date.now()
};
var DEFAULT_TRACKED_REVIEWS = [{
	id: "rev-1",
	number: 1,
	title: "Warm timber soffit reflections",
	comment: "Keep smoked Nordic cedar soffits slightly warmer against fjord water bounce.",
	status: "open",
	priority: "high",
	assignee: "Astrid Lindholm",
	author: "Erik K.",
	pinX: 42,
	pinY: 36,
	studio: "sam-3d",
	updatedAt: Date.now() - 21e5,
	history: [{
		id: "h-1",
		actor: "Erik K.",
		action: "Created pin #1",
		toStatus: "open",
		at: Date.now() - 21e5
	}]
}, {
	id: "rev-2",
	number: 2,
	title: "Basalt plinth edge alignment",
	comment: "Verify cantilevered slab edge thickness stays 320mm in close-up camera.",
	status: "in_progress",
	priority: "normal",
	assignee: "Marcus V.",
	author: "Client Reviewer",
	pinX: 66,
	pinY: 64,
	studio: "mas-2d",
	updatedAt: Date.now() - 84e4,
	history: [{
		id: "h-2a",
		actor: "Client Reviewer",
		action: "Pinned slab joint",
		toStatus: "open",
		at: Date.now() - 3e6
	}, {
		id: "h-2b",
		actor: "Marcus V.",
		action: "Moved to In progress",
		fromStatus: "open",
		toStatus: "in_progress",
		at: Date.now() - 84e4
	}]
}];
var DEFAULT_TOUR_STATE = {
	title: "Nordic Fjords Pavilion Tour",
	slug: "nordic-fjords-pavilion",
	theme: "ultra-luxury",
	activeSceneId: "sc-arrival",
	exposure: 0,
	whiteBalance: 0,
	contrast: 4,
	saturation: 2,
	lutPreset: "Arctic Glass",
	dayNightMode: "dusk",
	nadirLogoPatch: true,
	publishedVersion: 2,
	accessMode: "public",
	scenes: [
		{
			id: "sc-arrival",
			label: "Harbor Arrival Deck",
			level: "Level 1",
			imageUrl: "/viz/p01-pavilion-dusk.jpg",
			yaw: 12,
			pitch: 0,
			mapX: 28,
			mapY: 62
		},
		{
			id: "sc-living",
			label: "Fjord Living Pavilion",
			level: "Level 1",
			imageUrl: "/viz/t03-compact-living-room.jpg",
			yaw: 84,
			pitch: -4,
			mapX: 52,
			mapY: 46
		},
		{
			id: "sc-courtyard",
			label: "Pool & Basalt Plinth",
			level: "Level 1",
			imageUrl: "/viz/t06-urban-courtyard.jpg",
			yaw: 165,
			pitch: 2,
			mapX: 74,
			mapY: 58
		},
		{
			id: "sc-terrace",
			label: "Upper Timber Terrace",
			level: "Level 2",
			imageUrl: "/viz/t05-subtropical-home.jpg",
			yaw: 240,
			pitch: -2,
			mapX: 58,
			mapY: 26
		}
	],
	hotspots: [
		{
			id: "hs-1",
			sceneId: "sc-arrival",
			type: "navigation",
			label: "Enter Living Pavilion",
			yaw: 32,
			pitch: -4,
			targetSceneId: "sc-living",
			detail: "Smooth fly-through transition"
		},
		{
			id: "hs-2",
			sceneId: "sc-arrival",
			type: "info",
			label: "Blackened Basalt Plinth",
			yaw: -22,
			pitch: -12,
			detail: "Cantilevered volcanic stone plinth · 320mm honed slab"
		},
		{
			id: "hs-3",
			sceneId: "sc-living",
			type: "unit",
			label: "Residence Unit 3B",
			yaw: 48,
			pitch: 4,
			unitCode: "3B",
			detail: "168 m² · 3 Bed Panoramic Fjord Aspect · $2.45M"
		},
		{
			id: "hs-4",
			sceneId: "sc-living",
			type: "map",
			label: "Harbor Ferry & School Route",
			yaw: -54,
			pitch: -6,
			detail: "4 min walk to Harbor Ferry · 9 min to Nordic Academy"
		}
	],
	units: [
		{
			id: "u-1a",
			unitCode: "1A",
			floor: "01",
			type: "Garden Suite",
			areaSqm: 124,
			priceLabel: "$1,680,000",
			orientation: "South-West",
			status: "sold",
			sceneId: "sc-arrival"
		},
		{
			id: "u-2b",
			unitCode: "2B",
			floor: "02",
			type: "Corner Residence",
			areaSqm: 146,
			priceLabel: "$2,040,000",
			orientation: "West Fjord",
			status: "reserved",
			sceneId: "sc-courtyard"
		},
		{
			id: "u-3b",
			unitCode: "3B",
			floor: "03",
			type: "Pavilion Living",
			areaSqm: 168,
			priceLabel: "$2,450,000",
			orientation: "Panoramic NW",
			status: "available",
			sceneId: "sc-living"
		},
		{
			id: "u-4p",
			unitCode: "PH1",
			floor: "04",
			type: "Sky Penthouse",
			areaSqm: 242,
			priceLabel: "$3,890,000",
			orientation: "360° Horizon",
			status: "available",
			sceneId: "sc-terrace"
		}
	]
};
var DEFAULT_KUM_VIDEO = {
	aspect: "16:9",
	fps: 24,
	resolution: "1080p",
	codec: "H.264",
	lut: "Arctic Glass",
	musicTrack: "Nordic Mist — Ambient Piano (CC-BY Licensed)",
	captionsEnabled: true,
	clips: [
		{
			id: "vc-1",
			track: "video",
			label: "Establishing Fjord Dawn",
			imageUrl: "/viz/p01-pavilion-dusk.jpg",
			startSec: 0,
			durationSec: 6,
			cameraMove: "dolly-in",
			transition: "cross-dissolve"
		},
		{
			id: "vc-2",
			track: "video",
			label: "Interior Timber Living",
			imageUrl: "/viz/t03-compact-living-room.jpg",
			startSec: 6,
			durationSec: 7,
			cameraMove: "pan",
			transition: "match-cut"
		},
		{
			id: "vc-3",
			track: "video",
			label: "Waterfront Terrace Orbit",
			imageUrl: "/viz/t06-urban-courtyard.jpg",
			startSec: 13,
			durationSec: 7,
			cameraMove: "orbit",
			transition: "cross-dissolve"
		},
		{
			id: "vc-4",
			track: "video",
			label: "Hero Pavilion Dusk",
			imageUrl: "/viz/t10-home-dusk-edit.jpg",
			startSec: 20,
			durationSec: 8,
			cameraMove: "rise",
			transition: "dip-black"
		},
		{
			id: "tc-1",
			track: "title",
			label: "Nordic Fjords Pavilion · Off-Plan Film",
			startSec: .5,
			durationSec: 5,
			cameraMove: "hold",
			transition: "cut"
		},
		{
			id: "ac-1",
			track: "audio",
			label: "Nordic Mist Ambient Bed (-14 LUFS)",
			startSec: 0,
			durationSec: 28,
			cameraMove: "hold",
			transition: "cut"
		},
		{
			id: "fx-1",
			track: "fx",
			label: "24fps Halation + Mild Film Grain",
			startSec: 0,
			durationSec: 28,
			cameraMove: "hold",
			transition: "cut"
		}
	]
};
var DEFAULT_AGENT_MISSION = {
	active: false,
	missionName: "Unit 3B Plan-to-Film Launch Pack",
	budgetCapCr: 250,
	spentCr: 0,
	redoRoundsUsed: 0,
	maxFreeRedos: 2,
	awaitingApproval: false,
	steps: [
		{
			id: "ms-1",
			order: 1,
			title: "CAD Intake & Scale Check",
			tool: "cad_parse",
			costCr: 0,
			status: "pending",
			outputSummary: "Detect rooms, walls, windows & ceiling height (2.9m)"
		},
		{
			id: "ms-2",
			order: 2,
			title: "Top-Down Styled Plan",
			tool: "render_plan",
			costCr: 8,
			status: "pending",
			outputSummary: "Furnished Strict plan plate from Design Contract"
		},
		{
			id: "ms-3",
			order: 3,
			title: "Isometric + Room Views",
			tool: "camera_plan",
			costCr: 24,
			status: "pending",
			outputSummary: "30° isometric cutaway + 3 room corner sightlines"
		},
		{
			id: "ms-4",
			order: 4,
			title: "Scale-Checked Entourage",
			tool: "entourage",
			costCr: 8,
			status: "pending",
			outputSummary: "Non-identifiable figures calibrated to 2.1m door height"
		},
		{
			id: "ms-5",
			order: 5,
			title: "Fidelity Gate & Approval Pack",
			tool: "gate_notify",
			costCr: 0,
			status: "pending",
			outputSummary: "C1-C10 Honesty report · stops here for human sign-off"
		},
		{
			id: "ms-6",
			order: 6,
			title: "8K–15K Tiled Finals",
			tool: "finals_upscale",
			costCr: 16,
			status: "pending",
			outputSummary: "Seam-blended 8K & 15K print/web deliverables + C2PA"
		},
		{
			id: "ms-7",
			order: 7,
			title: "KUM Video Director Clips",
			tool: "video_plan",
			costCr: 48,
			status: "pending",
			outputSummary: "5–8s arch-viz dolly & orbit clips from approved stills"
		},
		{
			id: "ms-8",
			order: 8,
			title: "Timeline Edit & MP4 Export",
			tool: "export_mp4",
			costCr: 10,
			status: "pending",
			outputSummary: "H.264 16:9 + 9:16 social cutdowns with disclosure card"
		}
	]
};
var DEFAULT_GOVERNANCE_STATE = {
	brandName: "Nordic Atelier Architects",
	brandPrimaryHex: "#CFE3F0",
	brandAccentHex: "#E8C98A",
	residency: "EU",
	retentionDays: 90,
	noTrainingContract: true,
	c2paWatermark: true,
	disclosureTemplate: "Artist's Impression / Virtually Staged Visualization — Not a construction document.",
	teamSpendCapCr: 5e3,
	auditEvents: [{
		id: "aud-1",
		actor: "Studio Lead",
		action: "Configured EU Data Residency + No-Training lock",
		target: "Workspace Policy",
		at: Date.now() - 72e5
	}, {
		id: "aud-2",
		actor: "C2PA Gate",
		action: "Enabled invisible watermark + disclosure footer",
		target: "Export Pipeline",
		at: Date.now() - 27e5
	}]
};
var NANO_BANANA_MODEL_OPTIONS = [
	{
		key: "auto",
		label: "Auto Router (Smart)",
		shortLabel: "NB Auto",
		modelId: "router",
		role: "Routes dynamically by task, references & resolution",
		resolutions: [
			"512",
			"1K",
			"2K",
			"4K"
		]
	},
	{
		key: "nano_banana_2_1",
		label: "Nano Banana 2.1",
		shortLabel: "NB 2.1",
		modelId: "gemini-nano-banana-2.1",
		role: "Primary architecture generation, multi-ref & editing",
		resolutions: [
			"1K",
			"2K",
			"4K"
		]
	},
	{
		key: "nano_banana_2",
		label: "Nano Banana 2",
		shortLabel: "NB 2",
		modelId: "gemini-3.1-flash-image → gemini-nano-banana-2.1",
		role: "Fast production generation and style transfer",
		resolutions: [
			"512",
			"1K",
			"2K",
			"4K"
		]
	},
	{
		key: "nano_banana_2_lite",
		label: "Nano Banana 2 Lite",
		shortLabel: "NB Lite",
		modelId: "gemini-3.1-flash-lite-image",
		role: "Very fast concept drafts & exploration",
		resolutions: ["512", "1K"]
	},
	{
		key: "nano_banana_pro",
		label: "Nano Banana Pro",
		shortLabel: "NB Pro",
		modelId: "gemini-3-pro-image",
		role: "Premium 4K presentation & typography fidelity",
		resolutions: [
			"1K",
			"2K",
			"4K"
		]
	}
];
var GENERATION_MODE_OPTIONS = [
	{
		id: "text_to_image",
		label: "Text to Image",
		description: "Generate architectural render from structured brief"
	},
	{
		id: "image_to_image",
		label: "Image to Image",
		description: "Transform uploaded design or 3D snapshot"
	},
	{
		id: "image_edit",
		label: "Precision Edit",
		description: "Modify materials, lighting, or masked zones"
	},
	{
		id: "multi_reference",
		label: "Multi-Reference",
		description: "Synthesize geometry, material & lighting refs"
	},
	{
		id: "iterative_editing",
		label: "Iterative Session",
		description: "Multi-turn conversational architectural edits"
	},
	{
		id: "style_transfer",
		label: "Style Transfer",
		description: "Apply style while holding building geometry"
	},
	{
		id: "render_enhancement",
		label: "Render Enhance",
		description: "Elevate texture realism and daylighting"
	}
];
var DEFAULT_NANO_BANANA_CONFIG = {
	requestedModel: "nano_banana_2_1",
	generationMode: "text_to_image",
	resolution: "1K",
	aspectRatio: "16:9",
	buildingType: "modern_villa",
	architecturalStyle: "contemporary",
	renderStyle: "photorealistic",
	constraints: {
		preserveGeometry: true,
		preserveMass: true,
		preserveFloors: true,
		preserveWindows: true,
		preserveOpenings: true,
		preserveRoof: true,
		preserveFacadeStructure: true,
		preserveCamera: true,
		allowStructuralChanges: false
	},
	activeSessionId: null
};
function resolveRuntimeModelOverride(selection) {
	switch (selection) {
		case "nano_banana_2_1":
		case "nano_banana_2": return "gemini-nano-banana-2.1";
		case "nano_banana_2_lite": return "gemini-3.1-flash-lite-image";
		case "nano_banana_pro": return "gemini-3-pro-image";
		default: return;
	}
}
async function parseApiJson(res) {
	const data = await res.json();
	if (!res.ok && res.status !== 409 && res.status !== 422) throw new Error(data.error || `Request failed with HTTP ${res.status}`);
	return data;
}
async function callNanoBananaApi(endpoint, payload, idempotencyKey) {
	return parseApiJson(await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}
		},
		body: JSON.stringify(payload)
	}));
}
async function continueNanoBananaSessionApi(sessionId, payload) {
	return parseApiJson(await fetch(`/api/v1/images/sessions/${encodeURIComponent(sessionId)}/continue`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	}));
}
async function fetchNanoBananaHistoryApi(limit = 20) {
	return (await parseApiJson(await fetch(`/api/v1/images/history?limit=${limit}`))).items ?? [];
}
async function fetchNanoBananaVersionsApi(generationId) {
	return (await parseApiJson(await fetch(`/api/v1/images/${encodeURIComponent(generationId)}/versions`))).versions ?? [];
}
async function fetchProjectBriefApi(projectId = "default-studio") {
	return parseApiJson(await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/brief`));
}
async function patchProjectBriefApi(projectId, expectedRevision, patch) {
	return parseApiJson(await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/brief`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			"If-Match": `"${expectedRevision}"`
		},
		body: JSON.stringify({
			expectedRevision,
			...patch
		})
	}));
}
async function approveRunCandidateApi(input) {
	const projectId = input.projectId ?? "default-studio";
	return parseApiJson(await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/runs/${encodeURIComponent(input.runId)}/approvals`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			candidateSha256: input.candidateSha256,
			briefHash: input.briefHash,
			briefRevision: input.briefRevision,
			reviewerId: input.reviewerId ?? "principal-architect",
			reviewerRole: "reviewer",
			decision: input.decision ?? "client_approved"
		})
	}));
}
async function askGroundedQaApi(question, projectId = "default-studio") {
	return parseApiJson(await fetch(`/api/v1/projects/${encodeURIComponent(projectId)}/grounded-qa`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ question })
	}));
}
function remember(state, design) {
	return {
		design,
		past: [...state.past, state.design].slice(-20),
		future: []
	};
}
var useOriel = create()(persist((set, get) => ({
	favorites: [],
	boards: [{
		id: "working",
		name: "Working set"
	}],
	briefs: [],
	savedDictionaryPrompts: [],
	log: [],
	requests: [],
	draft: null,
	plate: null,
	upload: null,
	sketchDataUrl: null,
	maskDataUrl: null,
	binaryMaskDataUrl: null,
	binaryMaskStats: null,
	conditioningChannels: {},
	floorPlanBlueprint: null,
	houseStyles: DEFAULT_HOUSE_STYLES,
	cameraKeyframes: [],
	entourageItems: [],
	reviewPins: [],
	variations: [],
	queue: [],
	batchRunning: false,
	publishedGallery: [],
	engine: DEFAULT_ENGINE,
	scene3d: DEFAULT_SCENE3D,
	meshMaterialOverrides: [],
	midLayerPreset: null,
	dictionaryBlocks: [],
	dictionaryParams: {},
	slotValues: {},
	recent: [],
	activeKey: "",
	pills: DEFAULT_PILLS,
	design: DEFAULT_DESIGN,
	idea: "",
	frame: DEFAULT_FRAME,
	credits: 4500,
	history: [],
	iterations: [],
	activeStudio: "sam-3d",
	themeMode: "dark",
	splitViewMode: "split",
	splitRatio: 50,
	radialOptics: {
		solarAzimuth: 284,
		solarElevation: 24,
		exposureEv: .6,
		vignettePct: 18,
		diffusionLock: 85
	},
	activePresetIds: ["P001", "P041"],
	negativePresetIds: ["P181"],
	presetStrengths: {
		P001: 1,
		P041: 1,
		P181: 1
	},
	questionPicks: {
		camera: "Auto",
		time: "Auto",
		weather: "Auto",
		mood: "Auto",
		materials: "Auto",
		people: "Auto",
		site: "Auto",
		finish: "Auto"
	},
	intentLookId: INTENT_LOOKS_40[0].id,
	designContract: buildDefaultDesignContract({
		hasUpload: false,
		hasSketch: false,
		vertical: DEFAULT_DESIGN.vertical,
		look: DEFAULT_DESIGN.look,
		fidelity: DEFAULT_ENGINE.renderFidelity
	}),
	fidelityReport: null,
	lookAnchor: DEFAULT_LOOK_ANCHOR,
	lookAnchorHistory: [DEFAULT_LOOK_ANCHOR],
	trackedReviews: DEFAULT_TRACKED_REVIEWS,
	tourConfig: DEFAULT_TOUR_STATE,
	videoProject: DEFAULT_KUM_VIDEO,
	agentMission: DEFAULT_AGENT_MISSION,
	governance: DEFAULT_GOVERNANCE_STATE,
	nanoBanana: DEFAULT_NANO_BANANA_CONFIG,
	budget: DEFAULT_BUDGET_STATE,
	lastOrchestration: null,
	projects: [],
	chat: [],
	nodeWorkflows: WORKFLOW_TEMPLATES.map(cloneWorkflow),
	activeNodeWorkflowId: WORKFLOW_TEMPLATES[0].id,
	nodeExecutionMode: "hybrid",
	nodeRevisions: [],
	autoApproveMode: true,
	approvedSuggestionIds: [],
	appliedSuggestionIds: [],
	beginnerGuideOpen: false,
	busy: false,
	selecting: false,
	past: [],
	future: [],
	toggleFavorite: (id) => set((state) => ({ favorites: state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [id, ...state.favorites] })),
	addBoard: (name) => {
		const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "board";
		const id = get().boards.some((board) => board.id === base) ? `${base}-${Date.now()}` : base;
		set((state) => ({ boards: [...state.boards, {
			id,
			name: name.trim() || "Untitled"
		}] }));
		return id;
	},
	saveBrief: (brief) => set((state) => ({ briefs: [{
		...brief,
		id: `b-${Date.now()}`,
		at: Date.now()
	}, ...state.briefs].slice(0, 48) })),
	removeBrief: (id) => set((state) => ({ briefs: state.briefs.filter((item) => item.id !== id) })),
	setSavedDictionaryPrompts: (savedDictionaryPrompts) => set({ savedDictionaryPrompts: savedDictionaryPrompts.slice(0, 200) }),
	pushLog: (entry) => set((state) => ({ log: [{
		...entry,
		id: `l-${Date.now()}`,
		at: Date.now()
	}, ...state.log].slice(0, 30) })),
	clearLog: () => set({ log: [] }),
	setDraft: (draft) => set({ draft }),
	setPlate: (plate) => set((state) => {
		if (!plate) {
			savePlateBundleToIdb({
				plate: null,
				history: state.history,
				iterations: state.iterations,
				upload: state.upload,
				savedAt: Date.now()
			});
			return {
				plate: null,
				fidelityReport: null
			};
		}
		const nextHistory = [plate.url, ...state.history.filter((url) => url !== plate.url)].slice(0, 12);
		const report = evaluateFidelityGate({
			geometryLock: state.engine.geometryLock,
			seedLocked: state.engine.seedLocked,
			hasSource: Boolean(state.upload || state.sketchDataUrl),
			isFallback: plate.fallback,
			hasMask: Boolean(state.maskDataUrl),
			disclosureRequired: Boolean(INTENT_LOOKS_40.find((item) => item.id === state.intentLookId)?.disclosureRequired),
			idea: plate.idea || state.idea,
			scene3d: state.scene3d,
			frame: state.frame
		});
		const nextIterations = [{
			id: `iter-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
			url: plate.url,
			upload: plate.upload,
			templateId: plate.templateId,
			idea: plate.idea,
			seed: plate.seed,
			summary: plate.summary,
			fallback: plate.fallback,
			look: state.design.look,
			light: state.design.light,
			ratio: state.frame.ratio,
			gateScore: report.overallScore,
			gateStatus: report.status,
			studio: state.activeStudio,
			createdAt: Date.now()
		}, ...state.iterations.filter((item) => item.url !== plate.url)].slice(0, 12);
		savePlateBundleToIdb({
			plate,
			history: nextHistory,
			iterations: nextIterations,
			upload: state.upload,
			savedAt: Date.now()
		});
		return {
			plate,
			history: nextHistory,
			iterations: nextIterations,
			fidelityReport: report
		};
	}),
	setUpload: (upload) => set((state) => {
		const uploadDims = parseImageDimensionsFromDataUrl(upload);
		const nextFrame = uploadDims ? sanitizeFrame({
			...state.frame,
			ratio: uploadDims.frameRatio
		}) : state.frame;
		const nextNanoBanana = uploadDims ? {
			...state.nanoBanana,
			aspectRatio: uploadDims.geminiRatio,
			generationMode: state.nanoBanana.generationMode === "text_to_image" ? "image_to_image" : state.nanoBanana.generationMode
		} : state.nanoBanana;
		const nextEngine = upload ? sanitizeEngineState({
			...state.engine,
			geometryLock: Math.max(90, state.engine.geometryLock)
		}) : state.engine;
		const nextContract = buildDefaultDesignContract({
			hasUpload: Boolean(upload),
			hasSketch: Boolean(state.sketchDataUrl),
			vertical: state.design.vertical,
			look: state.design.look,
			fidelity: nextEngine.renderFidelity
		});
		savePlateBundleToIdb({
			plate: state.plate,
			history: state.history,
			iterations: state.iterations,
			upload,
			savedAt: Date.now()
		});
		return {
			upload,
			frame: nextFrame,
			nanoBanana: nextNanoBanana,
			engine: nextEngine,
			radialOptics: upload ? {
				...state.radialOptics,
				diffusionLock: nextEngine.geometryLock
			} : state.radialOptics,
			conditioningChannels: upload ? {} : state.conditioningChannels,
			designContract: nextContract
		};
	}),
	setSketchDataUrl: (sketchDataUrl) => set({ sketchDataUrl }),
	setMaskDataUrl: (maskDataUrl) => set({ maskDataUrl }),
	setBinaryMaskData: (binaryMaskDataUrl, binaryMaskStats = null) => set({
		binaryMaskDataUrl,
		binaryMaskStats
	}),
	setConditioningChannel: (channel, url) => set((state) => ({ conditioningChannels: {
		...state.conditioningChannels,
		[channel]: url
	} })),
	clearConditioningChannels: () => set({ conditioningChannels: {} }),
	setFloorPlanBlueprint: (floorPlanBlueprint) => set({ floorPlanBlueprint }),
	addHouseStyle: (profile) => set((state) => ({
		houseStyles: [profile, ...state.houseStyles.filter((s) => s.id !== profile.id)].slice(0, 12),
		engine: sanitizeEngineState({
			...state.engine,
			houseStyleId: profile.id
		})
	})),
	removeHouseStyle: (id) => set((state) => ({
		houseStyles: state.houseStyles.filter((s) => s.id !== id),
		engine: state.engine.houseStyleId === id ? sanitizeEngineState({
			...state.engine,
			houseStyleId: null
		}) : state.engine
	})),
	addCameraKeyframe: (kf) => set((state) => ({ cameraKeyframes: [...state.cameraKeyframes, kf].slice(0, 6) })),
	upsertCameraKeyframe: (kf) => set((state) => ({ cameraKeyframes: upsertRoleKeyframe(state.cameraKeyframes, kf) })),
	setCameraKeyframes: (cameraKeyframes) => set({ cameraKeyframes: cameraKeyframes.slice(0, 6) }),
	removeCameraKeyframe: (id) => set((state) => ({ cameraKeyframes: state.cameraKeyframes.filter((kf) => kf.id !== id) })),
	clearCameraKeyframes: () => set({ cameraKeyframes: [] }),
	setEntourageItems: (entourageItems) => set({ entourageItems: entourageItems.slice(0, 24) }),
	addReviewPin: (pin) => {
		const current = get().reviewPins;
		const projPins = current.filter((p) => p.projectId === pin.projectId);
		const created = {
			...pin,
			id: `pin-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
			number: projPins.length + 1,
			createdAt: Date.now()
		};
		set({ reviewPins: [...current, created].slice(-60) });
		return created;
	},
	toggleReviewPinStatus: (id) => set((state) => ({ reviewPins: state.reviewPins.map((p) => p.id === id ? {
		...p,
		status: p.status === "open" ? "resolved" : "open"
	} : p) })),
	removeReviewPin: (id) => set((state) => ({ reviewPins: state.reviewPins.filter((p) => p.id !== id) })),
	setReviewPins: (pins) => set((state) => {
		const existingIds = new Set(state.reviewPins.map((p) => p.id));
		return { reviewPins: [...state.reviewPins, ...pins.filter((p) => !existingIds.has(p.id))].slice(-60) };
	}),
	setVariations: (variations) => set({ variations: variations.slice(0, 4) }),
	enqueueRender: (label, preset, light, options) => {
		const item = createQueueItem(label, preset, light, options);
		set((state) => ({ queue: [...state.queue, item].slice(-24) }));
		return item;
	},
	enqueueBatchMatrix: (specs) => {
		const items = specs.map((spec) => createQueueItem(spec.label, spec.preset, spec.light, {
			cameraPreset: spec.cameraPreset,
			sunHour: spec.sunHour,
			promptNote: spec.promptNote,
			thumbnailUrl: spec.thumbnailUrl,
			status: "pending"
		}));
		set((state) => ({ queue: [...state.queue, ...items].slice(-24) }));
		return items;
	},
	updateQueueItem: (id, status, url, extra) => set((state) => ({ queue: updateQueueListStatus(state.queue, id, status, url, extra) })),
	requeueQueueItem: (id) => set((state) => ({ queue: state.queue.map((item) => item.id === id ? {
		...item,
		status: "pending",
		errorMessage: void 0,
		finishedAt: void 0,
		durationMs: void 0
	} : item) })),
	removeQueueItem: (id) => set((state) => ({ queue: state.queue.filter((item) => item.id !== id) })),
	clearCompletedQueue: () => set((state) => ({ queue: state.queue.filter((item) => normalizeQueueStatus(item.status) !== "completed") })),
	retryFailedQueue: () => set((state) => ({ queue: state.queue.map((item) => normalizeQueueStatus(item.status) === "error" ? {
		...item,
		status: "pending",
		errorMessage: void 0
	} : item) })),
	clearQueue: () => set({
		queue: [],
		batchRunning: false
	}),
	setBatchRunning: (batchRunning) => set({ batchRunning }),
	publishToGallery: (entry) => {
		const item = {
			...entry,
			id: `pub-${Date.now()}`,
			createdAt: Date.now()
		};
		set((state) => ({ publishedGallery: [item, ...state.publishedGallery].slice(0, 12) }));
		return item;
	},
	removePublishedProject: (id) => set((state) => ({ publishedGallery: state.publishedGallery.filter((item) => item.id !== id) })),
	setEngineField: (key, value) => set((state) => ({
		engine: sanitizeEngineState({
			...state.engine,
			[key]: value
		}),
		idea: syncEngineFieldToIdea(state.idea, key, value)
	})),
	applyWorkflowPreset: (preset) => set((state) => {
		const found = WORKFLOW_PRESETS.find((item) => item.id === preset);
		return {
			engine: sanitizeEngineState({
				...state.engine,
				workflowPreset: preset,
				...found?.defaults ?? {}
			}),
			idea: syncWorkflowPresetToIdea(state.idea, preset)
		};
	}),
	applyMidLayerPreset: (presetId) => set((state) => {
		if (!presetId || state.midLayerPreset === presetId) return {
			midLayerPreset: null,
			idea: applyMidLayerPromptToIdea(state.idea, null)
		};
		const preset = getMidLayerPresetById(presetId);
		if (!preset) return state;
		const nextDesign = sanitizeDesign({
			...state.design,
			...preset.designPatch ?? {},
			advanced: preset.advancedPatch ? {
				...state.design.advanced,
				...preset.advancedPatch
			} : state.design.advanced
		});
		const nextEngine = sanitizeEngineState({
			...state.engine,
			...preset.enginePatch ?? {}
		});
		const nextScene3D = sanitizeScene3DState({
			...state.scene3d,
			...preset.scene3dPatch ?? {}
		});
		const nextParams = preset.parameters ? {
			...state.dictionaryParams,
			...preset.parameters
		} : state.dictionaryParams;
		return {
			midLayerPreset: preset.id,
			idea: applyMidLayerPromptToIdea(state.idea, preset),
			dictionaryBlocks: [...preset.blockIds],
			dictionaryParams: nextParams,
			design: nextDesign,
			engine: nextEngine,
			scene3d: nextScene3D
		};
	}),
	applyBriefTemplateConfig: (template, compiledPrompt) => set((state) => {
		const vertical = template.designPatch.vertical ?? state.design.vertical;
		const basePicks = Object.fromEntries(GROUPS[vertical].map((g) => [g.id, template.designPatch.picks?.[g.id] ?? g.options[0]]));
		return {
			design: sanitizeDesign({
				...state.design,
				...template.designPatch,
				vertical,
				picks: {
					...basePicks,
					...template.designPatch.picks ?? {}
				}
			}),
			engine: sanitizeEngineState({
				...state.engine,
				...template.enginePatch
			}),
			scene3d: sanitizeScene3DState({
				...state.scene3d,
				...template.scene3dPatch
			}),
			frame: sanitizeFrame({
				...state.frame,
				ratio: template.frameRatio,
				resolution: template.frameResolution
			}),
			dictionaryBlocks: [...template.dictionaryBlocks].slice(0, 64),
			midLayerPreset: null,
			idea: compiledPrompt?.trim() || buildTemplateCompiledNotes(template)
		};
	}),
	applySharedBriefState: (snapshot) => set(() => ({
		design: sanitizeDesign(snapshot.design),
		engine: sanitizeEngineState(snapshot.engine),
		scene3d: sanitizeScene3DState(snapshot.scene3d),
		frame: sanitizeFrame(snapshot.frame),
		dictionaryBlocks: [...snapshot.dictionaryBlocks ?? []].slice(0, 64),
		dictionaryParams: snapshot.dictionaryParams ?? {},
		idea: snapshot.synthesizedPrompt || snapshot.customNotes || ""
	})),
	setDictionarySelection: (dictionaryBlocks, params) => set((state) => ({
		dictionaryBlocks: [...dictionaryBlocks].slice(0, 64),
		dictionaryParams: params ?? state.dictionaryParams
	})),
	setDictionaryParam: (blockId, key, value) => set((state) => ({ dictionaryParams: {
		...state.dictionaryParams,
		[blockId]: {
			...state.dictionaryParams[blockId] ?? {},
			[key]: value
		}
	} })),
	resetEngine: () => set({
		engine: DEFAULT_ENGINE,
		midLayerPreset: null
	}),
	setScene3DField: (key, value) => set((state) => ({ scene3d: sanitizeScene3DState({
		...state.scene3d,
		[key]: value
	}) })),
	upsertMeshMaterial: (entry) => set((state) => ({ meshMaterialOverrides: upsertMaterialAssignment(state.meshMaterialOverrides, entry) })),
	updateMeshMaterial: (objectId, patch) => set((state) => ({ meshMaterialOverrides: updateMaterialAssignmentProps(state.meshMaterialOverrides, objectId, patch) })),
	deleteMeshMaterial: (objectId) => set((state) => ({ meshMaterialOverrides: removeMaterialAssignment(state.meshMaterialOverrides, objectId) })),
	clearMeshMaterials: () => set({ meshMaterialOverrides: [] }),
	setSlotValues: (slotValues) => set({ slotValues }),
	touchRecent: (id) => set((state) => ({ recent: [id, ...state.recent.filter((item) => item !== id)].slice(0, 6) })),
	setActiveKey: (activeKey) => set({ activeKey }),
	setPill: (key, value) => set((state) => ({ pills: {
		...state.pills,
		[key]: value
	} })),
	setVertical: (vertical) => set((state) => {
		const look = LOOKS[vertical].some((item) => item.name === state.design.look) ? state.design.look : LOOKS[vertical][0].name;
		const picks = Object.fromEntries(GROUPS[vertical].map((group) => [group.id, state.design.picks[group.id] ?? group.options[0]]));
		return remember(state, sanitizeDesign({
			...state.design,
			vertical,
			look,
			picks,
			panel: "design",
			target: "whole"
		}));
	}),
	setPanel: (panel) => set((state) => ({ design: {
		...state.design,
		panel
	} })),
	setDesignField: (field, value) => set((state) => ({
		...remember(state, sanitizeDesign({
			...state.design,
			[field]: value
		})),
		idea: syncDesignFieldToIdea(state.idea, field, value)
	})),
	setPick: (id, value) => set((state) => {
		const picks = {
			...state.design.picks,
			[id]: value
		};
		let rooms = state.design.rooms;
		if (state.design.vertical === "interior") {
			const room = id === "room" ? value : picks.room ?? "Living room";
			if (id === "room" && state.design.rooms[value]) Object.assign(picks, state.design.rooms[value], { room: value });
			rooms = {
				...state.design.rooms,
				[room]: { ...picks }
			};
		}
		return {
			...remember(state, sanitizeDesign({
				...state.design,
				picks,
				rooms
			})),
			idea: syncPickToIdea(state.idea, state.design.vertical, id, value)
		};
	}),
	setTarget: (target) => set((state) => ({
		...remember(state, sanitizeDesign({
			...state.design,
			target
		})),
		idea: syncTargetToIdea(state.idea, target)
	})),
	setAdvanced: (key, value) => set((state) => ({
		...remember(state, sanitizeDesign({
			...state.design,
			advanced: {
				...state.design.advanced,
				[key]: value
			}
		})),
		idea: syncAdvancedToIdea(state.idea, key, value)
	})),
	toggleExtra: (id) => set((state) => {
		const extras = state.design.advanced.extras.includes(id) ? state.design.advanced.extras.filter((item) => item !== id) : [...state.design.advanced.extras, id];
		return {
			...remember(state, sanitizeDesign({
				...state.design,
				advanced: {
					...state.design.advanced,
					extras
				}
			})),
			idea: syncExtraToIdea(state.idea, id, extras)
		};
	}),
	toggleTag: (tag) => set((state) => {
		const tags = state.design.tags.includes(tag) ? state.design.tags.filter((item) => item !== tag) : [...state.design.tags, tag];
		return {
			...remember(state, sanitizeDesign({
				...state.design,
				tags
			})),
			idea: syncTagToIdea(state.idea, tag, tags)
		};
	}),
	setIdea: (idea) => set({ idea }),
	setFrame: (frame) => set({ frame: sanitizeFrame(frame) }),
	setCredits: (credits) => set({ credits: Math.max(0, Math.min(5e3, Math.round(credits))) }),
	setBusy: (busy) => set({ busy }),
	setSelecting: (selecting) => set({ selecting }),
	pushChat: (role, text) => set((state) => ({ chat: [...state.chat, {
		id: `c-${Date.now()}`,
		role,
		text: text.slice(0, 240)
	}].slice(-12) })),
	saveProject: (name) => set((state) => ({ projects: [{
		id: `p-${Date.now()}`,
		name: name.trim().slice(0, 48) || "Untitled",
		design: sanitizeDesign(state.design),
		idea: state.idea,
		at: Date.now()
	}, ...state.projects].slice(0, 24) })),
	openProject: (id) => set((state) => {
		const project = state.projects.find((item) => item.id === id);
		if (!project) return state;
		return {
			design: sanitizeDesign(project.design),
			idea: project.idea,
			past: [],
			future: []
		};
	}),
	removeProject: (id) => set((state) => ({ projects: state.projects.filter((item) => item.id !== id) })),
	undo: () => set((state) => {
		const previous = state.past[state.past.length - 1];
		if (!previous) return state;
		return {
			design: previous,
			past: state.past.slice(0, -1),
			future: [state.design, ...state.future].slice(0, 20)
		};
	}),
	redo: () => set((state) => {
		const next = state.future[0];
		if (!next) return state;
		return {
			design: next,
			future: state.future.slice(1),
			past: [...state.past, state.design].slice(-20)
		};
	}),
	addRequest: (request) => set((state) => ({ requests: [{
		...request,
		id: `r-${Date.now()}`,
		at: Date.now()
	}, ...state.requests].slice(0, 12) })),
	setActiveNodeWorkflowId: (activeNodeWorkflowId) => set({ activeNodeWorkflowId }),
	upsertNodeWorkflow: (workflow) => set((state) => {
		const exists = state.nodeWorkflows.some((w) => w.id === workflow.id);
		const updated = {
			...workflow,
			updatedAt: Date.now()
		};
		return { nodeWorkflows: exists ? state.nodeWorkflows.map((w) => w.id === workflow.id ? updated : w) : [updated, ...state.nodeWorkflows].slice(0, 20) };
	}),
	createNodeWorkflowFromTemplate: (templateId, name) => {
		const tpl = WORKFLOW_TEMPLATES.find((t) => t.id === templateId) ?? WORKFLOW_TEMPLATES[0];
		const created = {
			...cloneWorkflow(tpl),
			id: `wf-${Date.now().toString(36)}`,
			name: name?.trim() || `${tpl.name} Copy`,
			updatedAt: Date.now()
		};
		set((state) => ({
			nodeWorkflows: [created, ...state.nodeWorkflows].slice(0, 20),
			activeNodeWorkflowId: created.id
		}));
		return created;
	},
	deleteNodeWorkflow: (id) => set((state) => {
		const remaining = state.nodeWorkflows.filter((w) => w.id !== id);
		const nextList = remaining.length > 0 ? remaining : WORKFLOW_TEMPLATES.map(cloneWorkflow);
		return {
			nodeWorkflows: nextList,
			activeNodeWorkflowId: state.activeNodeWorkflowId === id ? nextList[0].id : state.activeNodeWorkflowId
		};
	}),
	setNodeExecutionMode: (nodeExecutionMode) => set({ nodeExecutionMode }),
	addNodeRevision: (rev) => set((state) => ({ nodeRevisions: [{
		...rev,
		id: `nrev-${Date.now().toString(36)}`,
		createdAt: Date.now(),
		outputPreviewUrl: rev.outputPreviewUrl && rev.outputPreviewUrl.length > 65e3 ? void 0 : rev.outputPreviewUrl
	}, ...state.nodeRevisions].slice(0, 20) })),
	restoreNodeRevision: (revId) => set((state) => {
		const found = state.nodeRevisions.find((r) => r.id === revId);
		if (!found) return state;
		const restored = cloneWorkflow(found.snapshot);
		return {
			activeNodeWorkflowId: restored.id,
			nodeWorkflows: state.nodeWorkflows.some((w) => w.id === restored.id) ? state.nodeWorkflows.map((w) => w.id === restored.id ? restored : w) : [restored, ...state.nodeWorkflows].slice(0, 20)
		};
	}),
	setAutoApproveMode: (autoApproveMode) => set({ autoApproveMode }),
	setBeginnerGuideOpen: (beginnerGuideOpen) => set({ beginnerGuideOpen }),
	approveMarketSuggestion: (id) => set((state) => ({ approvedSuggestionIds: state.approvedSuggestionIds.includes(id) ? state.approvedSuggestionIds : [...state.approvedSuggestionIds, id].slice(-200) })),
	applyMarketSuggestion: (suggestion) => set((state) => {
		const patched = applyMarketSuggestionPatch({
			idea: state.idea,
			design: state.design,
			engine: state.engine,
			scene3d: state.scene3d,
			frame: state.frame
		}, suggestion);
		return {
			...remember(state, patched.design),
			idea: patched.idea,
			engine: patched.engine,
			scene3d: patched.scene3d,
			frame: patched.frame,
			approvedSuggestionIds: state.approvedSuggestionIds.includes(suggestion.id) ? state.approvedSuggestionIds : [...state.approvedSuggestionIds, suggestion.id].slice(-200),
			appliedSuggestionIds: state.appliedSuggestionIds.includes(suggestion.id) ? state.appliedSuggestionIds : [...state.appliedSuggestionIds, suggestion.id].slice(-200)
		};
	}),
	applyMarketSuggestionBatch: (suggestions, autoApprove = true) => set((state) => {
		if (suggestions.length === 0) return state;
		const patched = applyMarketSuggestionBatch({
			idea: state.idea,
			design: state.design,
			engine: state.engine,
			scene3d: state.scene3d,
			frame: state.frame
		}, suggestions);
		const nextApplied = new Set(state.appliedSuggestionIds);
		const nextApproved = new Set(state.approvedSuggestionIds);
		for (const item of suggestions) {
			nextApplied.add(item.id);
			if (autoApprove) nextApproved.add(item.id);
		}
		return {
			...remember(state, patched.design),
			idea: patched.idea,
			engine: patched.engine,
			scene3d: patched.scene3d,
			frame: patched.frame,
			approvedSuggestionIds: [...nextApproved].slice(-200),
			appliedSuggestionIds: [...nextApplied].slice(-200)
		};
	}),
	resetAppliedMarketSuggestions: () => set({
		approvedSuggestionIds: [],
		appliedSuggestionIds: []
	}),
	restoreIteration: (url) => set((state) => {
		const found = state.iterations.find((item) => item.url === url);
		const restoredPlate = {
			url,
			upload: found?.upload ?? state.upload ?? void 0,
			templateId: found?.templateId ?? state.engine.workflowPreset,
			idea: found?.idea ?? state.idea.trim(),
			seed: found?.seed ?? state.engine.seed,
			fallback: found?.fallback,
			summary: found?.summary
		};
		return {
			plate: restoredPlate,
			fidelityReport: evaluateFidelityGate({
				geometryLock: state.engine.geometryLock,
				seedLocked: state.engine.seedLocked,
				hasSource: Boolean(state.upload || state.sketchDataUrl),
				isFallback: restoredPlate.fallback,
				idea: restoredPlate.idea,
				scene3d: state.scene3d,
				frame: state.frame
			}),
			...found?.idea ? { idea: found.idea } : {}
		};
	}),
	setActiveStudio: (activeStudio) => set({ activeStudio }),
	setThemeMode: (themeMode) => set({ themeMode }),
	setSplitViewMode: (splitViewMode) => set({ splitViewMode }),
	setSplitRatio: (ratio) => set({ splitRatio: Math.max(20, Math.min(80, Math.round(ratio))) }),
	setRadialOptics: (patch) => set((state) => {
		return {
			radialOptics: {
				...state.radialOptics,
				...patch
			},
			scene3d: sanitizeScene3DState({
				...state.scene3d,
				...typeof patch.solarAzimuth === "number" ? { sunAzimuth: patch.solarAzimuth } : {},
				...typeof patch.solarElevation === "number" ? { sunElevation: patch.solarElevation } : {}
			}),
			engine: sanitizeEngineState({
				...state.engine,
				...typeof patch.diffusionLock === "number" ? { geometryLock: patch.diffusionLock } : {}
			})
		};
	}),
	togglePreset200: (id, forceMode) => set((state) => {
		const preset = PRESETS_200.find((p) => p.id === id);
		if (!preset) return state;
		if (forceMode === "negative" || forceMode !== "positive" && preset.is_negative) return {
			negativePresetIds: state.negativePresetIds.includes(id) ? state.negativePresetIds.filter((x) => x !== id) : [...state.negativePresetIds, id].slice(-12),
			activePresetIds: state.activePresetIds.filter((x) => x !== id)
		};
		return {
			activePresetIds: state.activePresetIds.includes(id) ? state.activePresetIds.filter((x) => x !== id) : [...state.activePresetIds, id].slice(-12),
			negativePresetIds: state.negativePresetIds.filter((x) => x !== id)
		};
	}),
	setPresetStrength: (id, strength) => set((state) => ({ presetStrengths: {
		...state.presetStrengths,
		[id]: Math.max(.5, Math.min(1.5, Number(strength.toFixed(2))))
	} })),
	clearPresets200: () => set({
		activePresetIds: [],
		negativePresetIds: []
	}),
	setQuestionPick: (questionId, value) => set((state) => ({ questionPicks: {
		...state.questionPicks,
		[questionId]: value
	} })),
	applyIntentLook: (lookId) => set((state) => {
		const look = INTENT_LOOKS_40.find((item) => item.id === lookId || item.code.toLowerCase() === lookId.toLowerCase());
		if (!look) return state;
		const hasUpload = Boolean(state.upload);
		const nextDesign = sanitizeDesign({
			...state.design,
			vertical: hasUpload ? state.design.vertical : look.vertical,
			light: look.light,
			mood: look.mood
		});
		const nextGeometryLock = hasUpload ? look.fidelity === "Strict" ? 92 : look.fidelity === "Balanced" ? 82 : 72 : look.fidelity === "Strict" ? 90 : look.fidelity === "Balanced" ? 72 : 48;
		const nextEngine = sanitizeEngineState({
			...state.engine,
			renderFidelity: look.fidelity === "Creative" ? "draft" : look.fidelity === "Strict" ? "editorial" : "photoreal",
			geometryLock: nextGeometryLock
		});
		const presetLookup = new Map(PRESETS_200.map((p) => [p.id, p]));
		const positiveIds = [];
		const negativeIds = [];
		for (const pid of look.presetIds) if (presetLookup.get(pid)?.is_negative) negativeIds.push(pid);
		else positiveIds.push(pid);
		const appliedIdea = buildIntentLookAppliedPrompt(look, PRESETS_200, {
			hasUpload,
			design: nextDesign,
			preserveClause: state.designContract.lockedPreserve ? state.designContract.preserveClause : void 0
		});
		return {
			intentLookId: look.id,
			design: nextDesign,
			engine: nextEngine,
			idea: appliedIdea,
			activePresetIds: positiveIds,
			negativePresetIds: negativeIds,
			radialOptics: {
				...state.radialOptics,
				diffusionLock: nextEngine.geometryLock
			}
		};
	}),
	updateDesignContract: (patch) => set((state) => ({ designContract: {
		...state.designContract,
		...patch
	} })),
	setFidelityReport: (fidelityReport) => set({ fidelityReport }),
	reanchorLook: (patch) => set((state) => {
		const nextVer = state.lookAnchor.version + 1;
		const nextAnchor = {
			...state.lookAnchor,
			...patch,
			thumbnailUrl: patch?.thumbnailUrl ?? state.plate?.url ?? state.lookAnchor.thumbnailUrl,
			version: nextVer,
			locked: true,
			createdAt: Date.now()
		};
		return {
			lookAnchor: nextAnchor,
			lookAnchorHistory: [nextAnchor, ...state.lookAnchorHistory].slice(0, 8)
		};
	}),
	setLookLockStrength: (lockStrength) => set((state) => ({ lookAnchor: {
		...state.lookAnchor,
		lockStrength
	} })),
	toggleLookAnchorLock: () => set((state) => ({ lookAnchor: {
		...state.lookAnchor,
		locked: !state.lookAnchor.locked
	} })),
	restoreLookAnchor: (version) => set((state) => {
		const found = state.lookAnchorHistory.find((a) => a.version === version);
		return found ? { lookAnchor: {
			...found,
			locked: true
		} } : state;
	}),
	addTrackedReview: (item) => set((state) => {
		const num = state.trackedReviews.reduce((m, r) => Math.max(m, r.number), 0) + 1;
		return { trackedReviews: [{
			...item,
			id: `rev-${Date.now()}`,
			number: num,
			updatedAt: Date.now(),
			history: [{
				id: `rh-${Date.now()}`,
				actor: item.author || "Studio User",
				action: `Opened review #${num}`,
				toStatus: item.status,
				at: Date.now()
			}]
		}, ...state.trackedReviews].slice(0, 48) };
	}),
	transitionTrackedReview: (id, toStatus, actor = "Studio Lead", note) => set((state) => ({ trackedReviews: state.trackedReviews.map((rev) => rev.id === id ? {
		...rev,
		status: toStatus,
		updatedAt: Date.now(),
		history: [...rev.history, {
			id: `rh-${Date.now()}`,
			actor,
			action: `Changed status to ${toStatus.replace("_", " ")}`,
			fromStatus: rev.status,
			toStatus,
			note,
			at: Date.now()
		}]
	} : rev) })),
	replyTrackedReview: (id, actor, note) => set((state) => ({ trackedReviews: state.trackedReviews.map((rev) => rev.id === id ? {
		...rev,
		updatedAt: Date.now(),
		history: [...rev.history, {
			id: `rh-${Date.now()}`,
			actor,
			action: "Added reply",
			note,
			at: Date.now()
		}]
	} : rev) })),
	updateTourConfig: (patch) => set((state) => ({ tourConfig: {
		...state.tourConfig,
		...patch
	} })),
	addTourScene: (scene) => set((state) => ({ tourConfig: {
		...state.tourConfig,
		activeSceneId: scene.id,
		scenes: [scene, ...state.tourConfig.scenes.filter((s) => s.id !== scene.id)].slice(0, 16)
	} })),
	addTourHotspot: (hotspot) => set((state) => ({ tourConfig: {
		...state.tourConfig,
		hotspots: [...state.tourConfig.hotspots, {
			...hotspot,
			id: `hs-${Date.now()}`
		}].slice(0, 40)
	} })),
	updateUnitStatus: (unitId, status) => set((state) => ({ tourConfig: {
		...state.tourConfig,
		units: state.tourConfig.units.map((u) => u.id === unitId ? {
			...u,
			status
		} : u)
	} })),
	updateVideoProject: (patch) => set((state) => ({ videoProject: {
		...state.videoProject,
		...patch
	} })),
	addClipToKumVideo: (clip) => set((state) => {
		const endSec = state.videoProject.clips.filter((c) => c.track === "video").reduce((acc, c) => Math.max(acc, c.startSec + c.durationSec), 0);
		const created = {
			...clip,
			id: `vc-${Date.now()}`,
			startSec: clip.track === "video" ? endSec : 0
		};
		return { videoProject: {
			...state.videoProject,
			clips: [...state.videoProject.clips, created].slice(0, 24)
		} };
	}),
	removeClipFromKumVideo: (id) => set((state) => ({ videoProject: {
		...state.videoProject,
		clips: state.videoProject.clips.filter((c) => c.id !== id)
	} })),
	updateAgentMission: (patch) => set((state) => ({ agentMission: {
		...state.agentMission,
		...patch
	} })),
	advanceAgentMissionStep: (stepId, status, summary) => set((state) => ({ agentMission: {
		...state.agentMission,
		steps: state.agentMission.steps.map((s) => s.id === stepId ? {
			...s,
			status,
			...summary ? { outputSummary: summary } : {}
		} : s)
	} })),
	resetAgentMission: () => set({ agentMission: DEFAULT_AGENT_MISSION }),
	updateGovernance: (patch) => set((state) => ({ governance: {
		...state.governance,
		...patch
	} })),
	appendAuditEvent: (actor, action, target) => set((state) => ({ governance: {
		...state.governance,
		auditEvents: [{
			id: `aud-${Date.now()}`,
			actor,
			action,
			target,
			at: Date.now()
		}, ...state.governance.auditEvents].slice(0, 40)
	} })),
	updateNanoBanana: (patch) => set((state) => ({ nanoBanana: {
		...state.nanoBanana,
		...patch,
		constraints: patch.constraints ? {
			...state.nanoBanana.constraints,
			...patch.constraints
		} : state.nanoBanana.constraints
	} })),
	setBudgetState: (next) => set({ budget: sanitizeBudgetState(next) }),
	updateBudgetConfig: (patch) => set((state) => ({ budget: sanitizeBudgetState({
		...state.budget,
		...patch
	}) })),
	resetBudgetSpendLocal: () => set((state) => ({ budget: sanitizeBudgetState({
		...state.budget,
		spentPaise: 0,
		lastCostPaise: 0,
		liveImageCount: 0,
		dailySpend: []
	}) })),
	setLastOrchestration: (lastOrchestration) => set({ lastOrchestration })
}), {
	name: "oriel-studio",
	skipHydration: true,
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({
		favorites: state.favorites,
		boards: state.boards,
		briefs: state.briefs,
		savedDictionaryPrompts: state.savedDictionaryPrompts,
		log: state.log,
		requests: state.requests,
		draft: state.draft,
		recent: state.recent,
		design: state.design,
		engine: state.engine,
		scene3d: state.scene3d,
		meshMaterialOverrides: state.meshMaterialOverrides.slice(0, 48),
		houseStyles: state.houseStyles,
		reviewPins: state.reviewPins,
		midLayerPreset: state.midLayerPreset,
		dictionaryBlocks: state.dictionaryBlocks,
		dictionaryParams: state.dictionaryParams,
		publishedGallery: state.publishedGallery.slice(0, 8),
		projects: state.projects,
		nodeWorkflows: state.nodeWorkflows.slice(0, 12),
		activeNodeWorkflowId: state.activeNodeWorkflowId,
		nodeExecutionMode: state.nodeExecutionMode,
		nodeRevisions: state.nodeRevisions.slice(0, 10),
		autoApproveMode: state.autoApproveMode,
		approvedSuggestionIds: state.approvedSuggestionIds.slice(-200),
		appliedSuggestionIds: state.appliedSuggestionIds.slice(-200),
		beginnerGuideOpen: state.beginnerGuideOpen,
		activeStudio: state.activeStudio,
		themeMode: state.themeMode,
		splitViewMode: state.splitViewMode,
		splitRatio: state.splitRatio,
		radialOptics: state.radialOptics,
		activePresetIds: state.activePresetIds,
		negativePresetIds: state.negativePresetIds,
		presetStrengths: state.presetStrengths,
		questionPicks: state.questionPicks,
		intentLookId: state.intentLookId,
		trackedReviews: state.trackedReviews.slice(0, 24),
		tourConfig: state.tourConfig,
		videoProject: state.videoProject,
		governance: state.governance,
		nanoBanana: state.nanoBanana,
		budget: state.budget,
		history: state.history.filter(isPersistableCompactUrl).slice(0, 6),
		plate: state.plate && isPersistableCompactUrl(state.plate.url) ? state.plate : null,
		idea: state.idea,
		frame: state.frame,
		credits: state.credits
	}),
	merge: (persisted, current) => {
		const saved = persisted ?? {};
		const persistedWorkflows = Array.isArray(saved.nodeWorkflows) && saved.nodeWorkflows.length > 0 ? saved.nodeWorkflows.slice(0, 12) : WORKFLOW_TEMPLATES.map(cloneWorkflow);
		return {
			...current,
			...saved,
			design: sanitizeDesign(saved.design),
			engine: sanitizeEngineState(saved.engine),
			scene3d: sanitizeScene3DState(saved.scene3d),
			meshMaterialOverrides: Array.isArray(saved.meshMaterialOverrides) ? saved.meshMaterialOverrides.slice(0, 48) : [],
			houseStyles: Array.isArray(saved.houseStyles) && saved.houseStyles.length ? saved.houseStyles.slice(0, 12) : DEFAULT_HOUSE_STYLES,
			reviewPins: Array.isArray(saved.reviewPins) ? saved.reviewPins.slice(-60) : [],
			midLayerPreset: typeof saved.midLayerPreset === "string" ? saved.midLayerPreset : null,
			dictionaryBlocks: Array.isArray(saved.dictionaryBlocks) ? saved.dictionaryBlocks.slice(0, 64) : [],
			dictionaryParams: saved.dictionaryParams && typeof saved.dictionaryParams === "object" ? saved.dictionaryParams : {},
			savedDictionaryPrompts: Array.isArray(saved.savedDictionaryPrompts) ? saved.savedDictionaryPrompts.slice(0, 200) : [],
			publishedGallery: Array.isArray(saved.publishedGallery) ? saved.publishedGallery.slice(0, 12) : [],
			projects: Array.isArray(saved.projects) ? saved.projects.slice(0, 24) : [],
			nodeWorkflows: persistedWorkflows,
			activeNodeWorkflowId: typeof saved.activeNodeWorkflowId === "string" && persistedWorkflows.some((w) => w.id === saved.activeNodeWorkflowId) ? saved.activeNodeWorkflowId : persistedWorkflows[0].id,
			nodeExecutionMode: saved.nodeExecutionMode === "local" || saved.nodeExecutionMode === "cloud" || saved.nodeExecutionMode === "hybrid" ? saved.nodeExecutionMode : "hybrid",
			nodeRevisions: Array.isArray(saved.nodeRevisions) ? saved.nodeRevisions.slice(0, 10) : [],
			autoApproveMode: typeof saved.autoApproveMode === "boolean" ? saved.autoApproveMode : true,
			approvedSuggestionIds: Array.isArray(saved.approvedSuggestionIds) ? saved.approvedSuggestionIds.filter((s) => typeof s === "string").slice(-200) : [],
			appliedSuggestionIds: Array.isArray(saved.appliedSuggestionIds) ? saved.appliedSuggestionIds.filter((s) => typeof s === "string").slice(-200) : [],
			beginnerGuideOpen: typeof saved.beginnerGuideOpen === "boolean" ? saved.beginnerGuideOpen : false,
			idea: typeof saved.idea === "string" ? saved.idea : "",
			frame: sanitizeFrame(saved.frame),
			credits: typeof saved.credits === "number" ? Math.max(0, Math.min(5e3, saved.credits)) : 4500,
			nanoBanana: saved.nanoBanana ? {
				...DEFAULT_NANO_BANANA_CONFIG,
				...saved.nanoBanana,
				constraints: {
					...DEFAULT_NANO_BANANA_CONFIG.constraints,
					...saved.nanoBanana.constraints ?? {}
				}
			} : DEFAULT_NANO_BANANA_CONFIG,
			budget: sanitizeBudgetState(saved.budget),
			lastOrchestration: null,
			busy: false,
			batchRunning: false,
			selecting: false,
			past: [],
			future: []
		};
	}
}));
var clientHydrationPromise = null;
function ensureClientHydratedOnce() {
	if (typeof window === "undefined") return Promise.resolve();
	if (clientHydrationPromise) return clientHydrationPromise;
	clientHydrationPromise = (async () => {
		try {
			await Promise.resolve(useOriel.persist.rehydrate());
		} catch {}
		try {
			const cached = await loadPlateBundleFromIdb();
			if (!cached) return;
			const cur = useOriel.getState();
			const patch = {};
			if (!cur.plate && cached.plate?.url) patch.plate = cached.plate;
			if (cur.history.length === 0 && cached.history?.length) patch.history = cached.history;
			if (cur.iterations.length === 0 && cached.iterations?.length) patch.iterations = cached.iterations;
			if (!cur.upload && cached.upload) patch.upload = cached.upload;
			if (Object.keys(patch).length > 0) useOriel.setState(patch);
		} catch {}
	})();
	return clientHydrationPromise;
}
function useHydrated() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
		ensureClientHydratedOnce();
	}, []);
	return ready;
}
export { fetchNanoBananaHistoryApi as $, askGroundedQaApi as A, callNanoBananaApi as B, PORT_COLORS as C, toggleKeywordPillInNotes as Ct, PRESET_200_CATEGORIES as D, PRESETS_200 as E, validateWorkflowGraph as Et, buildHouseStyleProfile as F, computeSolarRigState as G, compileSentencePrompt as H, buildInitialBuilderNotes as I, createAutoBuildQueuePlan as J, continueNanoBananaSessionApi as K, buildMaterialScheduleRows as L, buildBatchMatrixSpecs as M, buildDesignPackDocumentHtml as N, WORKFLOW_TEMPLATES as O, buildEnvironmentDirective as P, encodeReviewPinsParam as Q, buildOrbitDollyZoomRig as R, PLAIN_QUESTIONS_8 as S, toggleDictionaryBlockInNotes as St, PRD_MATERIAL_PALETTE as T, useOriel as Tt, compileWorkflowToComfyJson as U, cloneWorkflow as V, computeBatchProgress as W, decodeReviewPinsParam as X, createNodeInstance as Y, detectFloorPlanWallsFromGrid as Z, MARKET_SUGGESTION_CATEGORIES as _, resolveRuntimeModelOverride as _t, BUILDER_PRESETS as a, filterMarketSuggestions as at, NANO_BANANA_MODEL_OPTIONS as b, syncDictionaryPresetToNotes as bt, ENTOURAGE_CATALOG as c, getMarketCategoryStats as ct, INSPECTOR_PBR_SWATCHES as d, getQueueItemVisualMeta as dt, fetchNanoBananaVersionsApi as et, INTENT_LOOKS_40 as f, interpolateCameraPathCatmullRom as ft, MARKET_SUGGESTIONS as g, resolveBriefTemplateSlots as gt, MARKET_BENCHMARKS as h, patchProjectBriefApi as ht, BRIEF_TEMPLATE_CATEGORIES as i, filterIntentLooks40 as it, autoLayoutGraph as j, approveRunCandidateApi as k, FLYTHROUGH_DURATION_MS as l, getMaterialAssignment as lt, MARKET_AUTOPILOT_PACKS as m, matchesNodeSearch as mt, ARCHVIZ_100_CATEGORIES as n, filterArchviz100 as nt, CAMERA_PRESETS as o, filterPresets200 as ot, LIGHTING_CONDITIONS as p, isPortCompatible as pt, createAssignmentFromSwatch as q, BRIEF_TEMPLATES as r, filterBriefTemplates as rt, CATEGORY_META as s, formatSolarTime as st, ARCHITECTURAL_STYLES as t, fetchProjectBriefApi as tt, GENERATION_MODE_OPTIONS as u, getNodeSpec as ut, MOOD_SETTINGS as v, sampleCameraPathPoints as vt, PRD_LIGHT_PALETTE as w, useHydrated as wt, NODE_CATALOG as x, synthesizeVisionDocument as xt, NAMED_STUDIOS as y, syncBuilderSlotToNotes as yt, buildTemplateCompiledNotes as z };
