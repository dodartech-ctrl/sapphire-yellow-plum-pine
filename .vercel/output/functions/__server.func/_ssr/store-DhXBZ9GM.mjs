import { o as __toESM } from "../_runtime.mjs";
import { A as LOOKS, L as RENDER_FIDELITIES, O as IPADAPTER_PRESETS, Q as WORKFLOW_PRESETS, S as GROUPS, U as SKETCH_MODES, _ as ENHANCE_MODES, d as DEFAULT_ENGINE, dt as sanitizeEngineState, f as DEFAULT_FRAME, ft as sanitizeFrame, h as DETAIL_DENSITIES, ht as updateQueueListStatus, n as ADVANCED_GROUPS, nt as createQueueItem, p as DEFAULT_SCENE3D, pt as sanitizeScene3DState, r as ANNOTATOR_MODES, st as normalizeQueueStatus, u as DEFAULT_DESIGN, ut as sanitizeDesign, v as ESRGAN_MODELS, y as EXTRA_PILLS } from "./fallback-render-kleyA0ad.mjs";
import { a as applyMidLayerPromptToIdea, l as getMidLayerPresetById } from "./archviz-dictionary-BdT_Lv3z.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
// node_modules/.nitro/vite/services/ssr/assets/store-DhXBZ9GM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
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
var DEFAULT_PILLS = {
	camera: "Eye level",
	light: "Soft overcast",
	material: "Oak and plaster",
	mood: "Quiet"
};
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
	setPlate: (plate) => set((state) => ({
		plate,
		history: state.plate?.url && plate && state.plate.url !== plate.url ? [state.plate.url, ...state.history.filter((url) => url !== state.plate?.url)].slice(0, 8) : state.history
	})),
	setUpload: (upload) => set({ upload }),
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
	})
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
			busy: false,
			batchRunning: false,
			selecting: false,
			past: [],
			future: []
		};
	}
}));
function useHydrated() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		if (useOriel.persist.hasHydrated()) {
			setReady(true);
			return;
		}
		const unsub = useOriel.persist.onFinishHydration(() => {
			if (alive) setReady(true);
		});
		useOriel.persist.rehydrate();
		return () => {
			alive = false;
			unsub();
		};
	}, []);
	return ready;
}
export { toggleDictionaryBlockInNotes as $, computeBatchProgress as A, formatSolarTime as B, buildHouseStyleProfile as C, buildTemplateCompiledNotes as D, buildOrbitDollyZoomRig as E, decodeReviewPinsParam as F, interpolateCameraPathCatmullRom as G, getMaterialAssignment as H, detectFloorPlanWallsFromGrid as I, resolveBriefTemplateSlots as J, isPortCompatible as K, encodeReviewPinsParam as L, createAssignmentFromSwatch as M, createAutoBuildQueuePlan as N, cloneWorkflow as O, createNodeInstance as P, synthesizeVisionDocument as Q, filterBriefTemplates as R, buildEnvironmentDirective as S, buildMaterialScheduleRows as T, getNodeSpec as U, getMarketCategoryStats as V, getQueueItemVisualMeta as W, syncBuilderSlotToNotes as X, sampleCameraPathPoints as Y, syncDictionaryPresetToNotes as Z, PORT_COLORS as _, CAMERA_PRESETS as a, buildBatchMatrixSpecs as b, FLYTHROUGH_DURATION_MS as c, MARKET_AUTOPILOT_PACKS as d, toggleKeywordPillInNotes as et, MARKET_BENCHMARKS as f, NODE_CATALOG as g, MOOD_SETTINGS as h, BUILDER_PRESETS as i, computeSolarRigState as j, compileWorkflowToComfyJson as k, INSPECTOR_PBR_SWATCHES as l, MARKET_SUGGESTION_CATEGORIES as m, BRIEF_TEMPLATES as n, useOriel as nt, CATEGORY_META as o, MARKET_SUGGESTIONS as p, matchesNodeSearch as q, BRIEF_TEMPLATE_CATEGORIES as r, validateWorkflowGraph as rt, ENTOURAGE_CATALOG as s, ARCHITECTURAL_STYLES as t, useHydrated as tt, LIGHTING_CONDITIONS as u, WORKFLOW_TEMPLATES as v, buildInitialBuilderNotes as w, buildDesignPackDocumentHtml as x, autoLayoutGraph as y, filterMarketSuggestions as z };
