import { o as __toESM } from "../_runtime.mjs";
import { i as appendSuggestionToIdea } from "./archviz-dictionary-BdT_Lv3z.mjs";
import { B as SCENE3D_MATERIALS, C as HDRI_MOODS, F as RATIOS, V as SCENE3D_PRESETS, a as CAMERA_PRESETS_3D, at as computeSunPosition, ct as frameAspect, l as D5_LIGHT_PRESETS, st as focalLengthToFov, ut as frameEdge, x as FOCAL_LENGTHS } from "./preset-transform-2eK0qpTl.mjs";
import { G as computeSolarRigState, R as buildOrbitDollyZoomRig, T as PRD_MATERIAL_PALETTE, Tt as useOriel, b as NANO_BANANA_MODEL_OPTIONS, d as INSPECTOR_PBR_SWATCHES, ft as interpolateCameraPathCatmullRom, l as FLYTHROUGH_DURATION_MS, lt as getMaterialAssignment, q as createAssignmentFromSwatch, vt as sampleCameraPathPoints, w as PRD_LIGHT_PALETTE } from "./store-C0Ow5frY.mjs";
import { t as cn } from "./utils-BPtpUp2a.mjs";
import { T as consumePending3DFile, _ as readImage, k as useGenerate, v as ATELIER_VERTICAL_HERO } from "./router-CPfESNUR.mjs";
import { t as PanoramaViewer } from "./panorama-viewer-DlJNC2ab.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $t as Crosshair, D as Sparkles, Ft as Globe, G as Plus, H as RefreshCw, I as Scissors, K as Play, Mt as GripVertical, Ot as ImageOff, V as RotateCcw, Vt as Film, W as QrCode, Y as Pause, Zt as Download, _n as Box, bt as Layers, c as Video, cn as CircleCheck, dn as ChevronDown, dt as Maximize2, et as Palette, fn as Check, ft as MapPin, g as Trash2, gn as Building2, hn as Calendar, ht as LoaderCircle, j as ShieldCheck, k as SlidersHorizontal, mn as Camera, mt as LockOpen, p as Upload, pt as Lock, rn as Compass, rt as Move3d, s as WandSparkles, sn as Clock, un as ChevronUp, w as Square, y as Sun } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as PerspectiveCamera, C as MathUtils, D as MeshNormalMaterial, E as MeshDepthMaterial, F as Scene, I as SphereGeometry, M as Raycaster, N as RepeatWrapping, O as MeshPhysicalMaterial, P as SRGBColorSpace, R as Vector2, S as LineBasicMaterial, T as MeshBasicMaterial, _ as FogExp2, a as OrbitControls, b as HemisphereLight, c as Box3, d as BufferGeometry, f as CanvasTexture, g as DirectionalLight, h as CylinderGeometry, i as GLTFLoader, j as PlaneGeometry, k as MeshStandardMaterial, l as BoxGeometry, m as Color, n as GLTFExporter, o as PMREMGenerator, p as CircleGeometry, r as OBJLoader, s as WebGLRenderer, u as BoxHelper, v as GridHelper, w as Mesh, x as Line, y as Group, z as Vector3 } from "../_libs/three.mjs";
// node_modules/.nitro/vite/services/ssr/assets/studio-modes-D4IeEzvA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResilientPlateImage({ src, alt, className, busy = false, busyLabel = "Rendering architectural plate…", onRetryFallback, testId }) {
	const imgRef = (0, import_react.useRef)(null);
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [attempt, setAttempt] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setAttempt(0);
		const el = imgRef.current;
		if (el && el.complete && el.naturalWidth > 0) setStatus("loaded");
		else setStatus("loading");
	}, [src]);
	function handleRetry() {
		setStatus("loading");
		setAttempt((n) => n + 1);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-full w-full overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				ref: imgRef,
				src,
				alt,
				"data-testid": testId,
				referrerPolicy: "no-referrer",
				onLoad: () => setStatus("loaded"),
				onError: () => setStatus("error"),
				className: cn("h-full w-full transition-opacity duration-200", status === "loaded" ? "opacity-100" : "opacity-85", className)
			}, `${src}::${attempt}`),
			status === "loading" && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 flex items-center justify-center bg-[#08131f]/45 backdrop-blur-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-full border border-[#a9bdc9]/30 bg-[#08131f]/80 px-3 py-1.5 text-xs text-[#e8eff3]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading plate…" })]
				})
			}) : null,
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "plate-rendering-veil",
				className: "absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[#08131f]/65 px-4 text-center backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 rounded-full border border-[#e8c98a]/40 bg-[#121c29]/90 px-4 py-2 shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium tracking-wide text-[#e8eff3]",
						children: busyLabel
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xs text-[11px] text-[#a9bdc9]",
					children: "Preserving walls, mullions, camera horizon, and Look Anchor."
				})]
			}) : null,
			status === "error" && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "plate-error-fallback",
				className: "absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-[#08131f]/90 p-4 text-center text-[#e8eff3]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "size-6 text-[#e8c98a]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium",
						children: "Plate preview could not decode from source URL."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleRetry,
							className: "inline-flex h-7 items-center gap-1.5 rounded-full border border-[#a9bdc9]/35 bg-[#16314A]/70 px-3 text-[11px] text-[#cfe3f0] hover:border-[#cfe3f0]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3" }), " Retry"]
						}), onRetryFallback ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onRetryFallback,
							className: "inline-flex h-7 items-center gap-1.5 rounded-full bg-[#e8c98a] px-3 text-[11px] font-semibold text-[#261a00]",
							children: "Load Studio Fallback"
						}) : null]
					})
				]
			}) : null
		]
	});
}
function sanitizeMeshMaterialForGltf(sourceMat, override) {
	const cloned = sourceMat.clone();
	if (override && (cloned instanceof MeshStandardMaterial || cloned instanceof MeshPhysicalMaterial)) {
		cloned.name = override.materialLabel;
		cloned.color = new Color(override.hex);
		cloned.roughness = override.roughness;
		cloned.metalness = override.metalness;
		cloned.transparent = override.transparent;
		cloned.opacity = override.opacity;
		if (cloned instanceof MeshPhysicalMaterial) cloned.clearcoat = override.clearcoat;
		cloned.userData = {
			...cloned.userData,
			orielMaterialId: override.materialId,
			orielMaterialLabel: override.materialLabel,
			orielOverride: true
		};
		cloned.needsUpdate = true;
		return cloned;
	}
	if (override && !(cloned instanceof MeshStandardMaterial)) {
		const std = new MeshPhysicalMaterial({
			name: override.materialLabel,
			color: new Color(override.hex),
			roughness: override.roughness,
			metalness: override.metalness,
			clearcoat: override.clearcoat,
			transparent: override.transparent,
			opacity: override.opacity
		});
		cloned.dispose();
		return std;
	}
	if (!cloned.name) {
		if (cloned instanceof MeshPhysicalMaterial && cloned.transparent) cloned.name = "Oriel Architectural Glazing";
		else if (cloned instanceof MeshStandardMaterial) cloned.name = `Oriel PBR (#${cloned.color.getHexString()})`;
	}
	return cloned;
}
function buildCleanExportGroup(sourceGroup, overrides, presetName = "oriel-studio") {
	const overrideMap = new Map(overrides.map((item) => [item.objectId, item]));
	const exportGroup = new Group();
	exportGroup.name = `Oriel_${presetName.replace(/[^a-zA-Z0-9_-]+/g, "_")}`;
	exportGroup.position.copy(sourceGroup.position);
	exportGroup.rotation.copy(sourceGroup.rotation);
	exportGroup.scale.copy(sourceGroup.scale);
	const createdMaterials = [];
	const createdGeometries = [];
	const summaries = [];
	sourceGroup.updateMatrixWorld(true);
	sourceGroup.traverse((obj) => {
		if (!obj.isMesh) return;
		const mesh = obj;
		if (mesh.userData?.nonPickable) return;
		const objectId = String(mesh.userData?.objectId || mesh.name || `mesh-${summaries.length + 1}`);
		const override = overrideMap.get(objectId);
		const clonedGeo = mesh.geometry.clone();
		createdGeometries.push(clonedGeo);
		const srcMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
		const exportMat = srcMat ? sanitizeMeshMaterialForGltf(srcMat, override) : new MeshStandardMaterial({
			name: "Default Material",
			color: 12368306,
			roughness: .78,
			metalness: .04
		});
		createdMaterials.push(exportMat);
		const exportMesh = new Mesh(clonedGeo, exportMat);
		exportMesh.name = objectId;
		exportMesh.position.copy(mesh.position);
		exportMesh.rotation.copy(mesh.rotation);
		exportMesh.scale.copy(mesh.scale);
		exportMesh.userData = {
			objectId,
			pickLabel: mesh.userData?.pickLabel ?? objectId,
			pbrApplied: Boolean(override),
			...override ? {
				materialId: override.materialId,
				materialLabel: override.materialLabel,
				roughness: override.roughness,
				metalness: override.metalness,
				clearcoat: override.clearcoat,
				opacity: override.opacity
			} : {}
		};
		exportGroup.add(exportMesh);
		const stdLike = exportMat;
		summaries.push({
			objectId,
			materialName: exportMat.name || objectId,
			hex: stdLike.color ? `#${stdLike.color.getHexString()}` : "#bcb9b2",
			roughness: typeof stdLike.roughness === "number" ? Number(stdLike.roughness.toFixed(2)) : .75,
			metalness: typeof stdLike.metalness === "number" ? Number(stdLike.metalness.toFixed(2)) : 0,
			clearcoat: "clearcoat" in stdLike && typeof stdLike.clearcoat === "number" ? Number(stdLike.clearcoat.toFixed(2)) : 0,
			opacity: typeof exportMat.opacity === "number" ? Number(exportMat.opacity.toFixed(2)) : 1,
			isOverride: Boolean(override)
		});
	});
	exportGroup.userData = {
		generator: "Oriel Archviz Studio",
		preset: presetName,
		meshCount: summaries.length,
		overrideCount: summaries.filter((s) => s.isOverride).length
	};
	return {
		exportGroup,
		summary: {
			presetName,
			meshCount: summaries.length,
			overrideCount: summaries.filter((s) => s.isOverride).length,
			materials: summaries
		},
		disposeExportGroup: () => {
			for (const g of createdGeometries) g.dispose();
			for (const m of createdMaterials) m.dispose();
		}
	};
}
async function exportGroupToGltfAsync(sourceGroup, overrides, options) {
	const exporter = new GLTFExporter();
	const { exportGroup, summary, disposeExportGroup } = buildCleanExportGroup(sourceGroup, overrides, options.presetName ?? "oriel-studio");
	try {
		return {
			payload: await new Promise((resolve, reject) => {
				exporter.parse(exportGroup, (output) => resolve(output), (error) => reject(error instanceof Error ? error : /* @__PURE__ */ new Error("GLTF export failed")), {
					binary: options.binary,
					onlyVisible: true,
					includeCustomExtensions: true
				});
			}),
			mimeType: options.binary ? "model/gltf-binary" : "model/gltf+json",
			extension: options.binary ? "glb" : "gltf",
			summary
		};
	} finally {
		disposeExportGroup();
	}
}
var MATERIAL_SPECS = {
	concrete: {
		color: 12368306,
		roughness: .78,
		metalness: .04
	},
	timber: {
		color: 11961687,
		roughness: .68,
		metalness: .02
	},
	travertine: {
		color: 14734526,
		roughness: .62,
		metalness: .03
	},
	brick: {
		color: 10181191,
		roughness: .84,
		metalness: .02
	}
};
var CAMERA_VIEWS = {
	eye: {
		pos: [
			12.5,
			2.1,
			13.5
		],
		target: [
			0,
			2,
			0
		]
	},
	oblique: {
		pos: [
			14.5,
			6.4,
			14.5
		],
		target: [
			0,
			1.8,
			0
		]
	},
	aerial: {
		pos: [
			18.5,
			16.5,
			18.5
		],
		target: [
			0,
			1.2,
			0
		]
	},
	detail: {
		pos: [
			6.4,
			2.4,
			7.2
		],
		target: [
			1.5,
			1.9,
			1
		]
	}
};
function makeArchitecturalBumpTexture(maxAnisotropy = 4) {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (ctx) {
		ctx.fillStyle = "#808080";
		ctx.fillRect(0, 0, 256, 256);
		ctx.strokeStyle = "rgba(52,52,52,0.48)";
		ctx.lineWidth = 1.5;
		for (let y = 0; y <= 256; y += 32) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(256, y);
			ctx.stroke();
		}
		ctx.strokeStyle = "rgba(96,96,96,0.28)";
		ctx.lineWidth = 1;
		for (let x = 0; x <= 256; x += 64) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, 256);
			ctx.stroke();
		}
		for (let i = 0; i < 900; i++) {
			const x = i * 73 % 256;
			const y = i * 139 % 256;
			ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
			ctx.fillRect(x, y, 2, 2);
		}
	}
	const tex = new CanvasTexture(canvas);
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	tex.repeat.set(4, 4);
	tex.anisotropy = maxAnisotropy;
	return tex;
}
function makeTimberBumpTexture(maxAnisotropy = 4) {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (ctx) {
		ctx.fillStyle = "#828282";
		ctx.fillRect(0, 0, 256, 256);
		for (let x = 0; x < 256; x += 12) {
			ctx.fillStyle = x / 12 % 2 === 0 ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
			ctx.fillRect(x, 0, 10, 256);
		}
		for (let i = 0; i < 360; i++) {
			const x = i * 29 % 256;
			const y = i * 47 % 256;
			ctx.fillStyle = "rgba(35,35,35,0.14)";
			ctx.fillRect(x, y, 1, 18);
		}
	}
	const tex = new CanvasTexture(canvas);
	tex.wrapS = RepeatWrapping;
	tex.wrapT = RepeatWrapping;
	tex.repeat.set(3, 3);
	tex.anisotropy = maxAnisotropy;
	return tex;
}
function makeContactShadowTexture() {
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (ctx) {
		const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 126);
		grad.addColorStop(0, "rgba(18,15,12,0.68)");
		grad.addColorStop(.55, "rgba(18,15,12,0.28)");
		grad.addColorStop(1, "rgba(18,15,12,0)");
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, 256, 256);
	}
	return new CanvasTexture(canvas);
}
function createSharedSceneMaterials(initialMaterial, maxAnisotropy) {
	const bumpTex = makeArchitecturalBumpTexture(maxAnisotropy);
	const timberTex = makeTimberBumpTexture(maxAnisotropy);
	const contactShadowTex = makeContactShadowTexture();
	const matSpec = MATERIAL_SPECS[initialMaterial];
	return {
		primaryMat: new MeshStandardMaterial({
			color: matSpec.color,
			roughness: matSpec.roughness,
			metalness: matSpec.metalness,
			bumpMap: bumpTex,
			bumpScale: .032
		}),
		glassMat: new MeshPhysicalMaterial({
			color: 14216169,
			roughness: .08,
			metalness: .1,
			transparent: true,
			opacity: .46,
			reflectivity: .92,
			envMapIntensity: 1.35
		}),
		darkTrimMat: new MeshStandardMaterial({
			color: 2762275,
			roughness: .34,
			metalness: .62
		}),
		timberMat: new MeshStandardMaterial({
			color: 10908745,
			roughness: .64,
			metalness: .02,
			bumpMap: timberTex,
			bumpScale: .025
		}),
		waterMat: new MeshStandardMaterial({
			color: 3889254,
			roughness: .06,
			metalness: .38,
			envMapIntensity: 1.4
		}),
		plinthMat: new MeshStandardMaterial({
			color: 10196104,
			roughness: .84,
			metalness: .02,
			bumpMap: bumpTex,
			bumpScale: .015
		}),
		interiorGlowMat: new MeshStandardMaterial({
			color: 16179114,
			emissive: 16760683,
			emissiveIntensity: .48,
			roughness: .55,
			metalness: 0
		}),
		groundMat: new MeshStandardMaterial({
			color: 14209218,
			roughness: .94,
			metalness: 0
		}),
		trunkMat: new MeshStandardMaterial({
			color: 6048571,
			roughness: .9,
			metalness: 0
		}),
		leafMat: new MeshStandardMaterial({
			color: 5993042,
			roughness: .84,
			metalness: 0
		}),
		contactShadowMat: new MeshBasicMaterial({
			map: contactShadowTex,
			transparent: true,
			opacity: .42,
			depthWrite: false
		}),
		textures: [
			bumpTex,
			timberTex,
			contactShadowTex
		]
	};
}
function disposeSharedSceneMaterials(mats) {
	mats.primaryMat.dispose();
	mats.glassMat.dispose();
	mats.darkTrimMat.dispose();
	mats.timberMat.dispose();
	mats.waterMat.dispose();
	mats.plinthMat.dispose();
	mats.interiorGlowMat.dispose();
	mats.groundMat.dispose();
	mats.trunkMat.dispose();
	mats.leafMat.dispose();
	mats.contactShadowMat.dispose();
	for (const tex of mats.textures) tex.dispose();
}
function disposeObjectGeometries(root) {
	root.traverse((obj) => {
		if (obj.isMesh) obj.geometry.dispose();
	});
}
function buildTreeCluster(x, z, scale, mats) {
	const tree = new Group();
	const trunk = new Mesh(new CylinderGeometry(.11 * scale, .17 * scale, 2.2 * scale, 8), mats.trunkMat);
	trunk.position.y = 1.1 * scale;
	trunk.castShadow = true;
	const canopyA = new Mesh(new SphereGeometry(1.05 * scale, 10, 8), mats.leafMat);
	canopyA.position.set(0, 2.5 * scale, 0);
	canopyA.castShadow = true;
	const canopyB = new Mesh(new SphereGeometry(.75 * scale, 10, 8), mats.leafMat);
	canopyB.position.set(.55 * scale, 2.1 * scale, .25 * scale);
	canopyB.castShadow = true;
	const canopyC = new Mesh(new SphereGeometry(.62 * scale, 8, 6), mats.leafMat);
	canopyC.position.set(-.48 * scale, 2.18 * scale, -.3 * scale);
	const shadowDisc = new Mesh(new CircleGeometry(1.5 * scale, 18), mats.contactShadowMat);
	shadowDisc.rotation.x = -Math.PI / 2;
	shadowDisc.position.y = .018;
	tree.add(trunk, canopyA, canopyB, canopyC, shadowDisc);
	tree.position.set(x, 0, z);
	return tree;
}
function tagMesh(mesh, objectId, pickLabel) {
	mesh.name = objectId;
	mesh.userData.objectId = objectId;
	mesh.userData.pickLabel = pickLabel;
	if (!mesh.userData.originalMaterial) mesh.userData.originalMaterial = mesh.material;
	return mesh;
}
function buildPresetMassing(preset, mats) {
	const group = new Group();
	const { primaryMat, glassMat, darkTrimMat, timberMat, waterMat, plinthMat, interiorGlowMat, contactShadowMat } = mats;
	const plinthShadow = new Mesh(new CircleGeometry(11.6, 32), contactShadowMat);
	plinthShadow.rotation.x = -Math.PI / 2;
	plinthShadow.position.y = .014;
	plinthShadow.userData.nonPickable = true;
	group.add(plinthShadow);
	const terrace = tagMesh(new Mesh(new BoxGeometry(16, .35, 13), plinthMat), "terrace-plinth", "Terrace Plinth");
	terrace.position.set(0, .175, 0);
	terrace.receiveShadow = true;
	group.add(terrace);
	const plinthTrim = tagMesh(new Mesh(new BoxGeometry(16.12, .08, 13.12), darkTrimMat), "plinth-trim", "Plinth Perimeter Trim");
	plinthTrim.position.set(0, .33, 0);
	group.add(plinthTrim);
	if (preset === "pavilion") {
		const basin = tagMesh(new Mesh(new BoxGeometry(12, .08, 9), waterMat), "reflecting-pool", "Reflecting Pool");
		basin.position.set(.4, .41, .6);
		group.add(basin);
		for (let i = 0; i < 4; i++) {
			const stone = tagMesh(new Mesh(new BoxGeometry(1.1, .12, .85), plinthMat), `stepping-stone-${i + 1}`, `Stepping Stone #${i + 1}`);
			stone.position.set(-3.2 + i * 1.45, .46, 3.6);
			stone.receiveShadow = true;
			group.add(stone);
		}
		const coreWall = tagMesh(new Mesh(new BoxGeometry(6.8, 3.3, .45), primaryMat), "core-wall", "North Core Wall");
		coreWall.position.set(-.6, 2, -2);
		coreWall.castShadow = true;
		coreWall.receiveShadow = true;
		group.add(coreWall);
		const sideWall = tagMesh(new Mesh(new BoxGeometry(.45, 3.3, 4.4), primaryMat), "west-wing-wall", "West Shear Wall");
		sideWall.position.set(-3.8, 2, .1);
		sideWall.castShadow = true;
		sideWall.receiveShadow = true;
		group.add(sideWall);
		const interiorCore = tagMesh(new Mesh(new BoxGeometry(2.6, 2.1, .6), interiorGlowMat), "interior-hearth", "Interior Hearth Core");
		interiorCore.position.set(-.9, 1.45, -1.2);
		group.add(interiorCore);
		const glassWall = tagMesh(new Mesh(new BoxGeometry(6.2, 3.05, .08), glassMat), "glazing-south", "South Curtain Glazing");
		glassWall.position.set(-.5, 1.92, 2);
		group.add(glassWall);
		const glassEast = tagMesh(new Mesh(new BoxGeometry(.08, 3.05, 3.9), glassMat), "glazing-east", "East Corner Glazing");
		glassEast.position.set(2.6, 1.92, .05);
		group.add(glassEast);
		const roof = tagMesh(new Mesh(new BoxGeometry(9.6, .36, 7.2), primaryMat), "canopy-roof", "Cantilever Roof Slab");
		roof.position.set(-.2, 3.84, .2);
		roof.castShadow = true;
		group.add(roof);
		const fascia = tagMesh(new Mesh(new BoxGeometry(9.72, .1, 7.32), darkTrimMat), "roof-fascia", "Roof Edge Fascia");
		fascia.position.set(-.2, 3.99, .2);
		group.add(fascia);
		const soffit = tagMesh(new Mesh(new BoxGeometry(9.1, .08, 6.7), timberMat), "timber-soffit", "Timber Roof Soffit");
		soffit.position.set(-.2, 3.63, .2);
		group.add(soffit);
		[
			[3.9, 3.1],
			[3.9, -2.8],
			[-4.4, 3.1]
		].forEach(([cx, cz], colIdx) => {
			const col = tagMesh(new Mesh(new CylinderGeometry(.11, .11, 3.25, 12), darkTrimMat), `column-${colIdx + 1}`, `Steel Column #${colIdx + 1}`);
			col.position.set(cx, 2, cz);
			col.castShadow = true;
			group.add(col);
		});
	} else if (preset === "villa") {
		const pool = tagMesh(new Mesh(new BoxGeometry(7.2, .1, 3.6), waterMat), "villa-pool", "Infinity Lap Pool");
		pool.position.set(2.6, .42, 3.2);
		group.add(pool);
		const lowerBase = tagMesh(new Mesh(new BoxGeometry(8.6, 2.8, 5.4), plinthMat), "lower-podium", "Lower Stone Podium");
		lowerBase.position.set(-1.4, 1.78, -.6);
		lowerBase.castShadow = true;
		lowerBase.receiveShadow = true;
		group.add(lowerBase);
		const lowerGlow = tagMesh(new Mesh(new BoxGeometry(4.2, 1.8, .4), interiorGlowMat), "lower-hearth", "Ground Living Hearth");
		lowerGlow.position.set(-1.1, 1.45, 1.55);
		group.add(lowerGlow);
		const lowerGlass = tagMesh(new Mesh(new BoxGeometry(5.6, 2.4, .1), glassMat), "lower-glazing", "Garden Level Glazing");
		lowerGlass.position.set(-1.1, 1.65, 2.14);
		group.add(lowerGlass);
		const upperCantilever = tagMesh(new Mesh(new BoxGeometry(10.4, 2.5, 5.2), primaryMat), "upper-cantilever", "Upper Cantilever Volume");
		upperCantilever.position.set(.6, 4.44, -.1);
		upperCantilever.castShadow = true;
		upperCantilever.receiveShadow = true;
		group.add(upperCantilever);
		const upperGlaze = tagMesh(new Mesh(new BoxGeometry(7.4, 2, .12), glassMat), "upper-glazing", "Upper Panoramic Glazing");
		upperGlaze.position.set(1.2, 4.38, 2.54);
		group.add(upperGlaze);
		for (let i = 0; i < 9; i++) {
			const louver = tagMesh(new Mesh(new BoxGeometry(.1, 2.35, .45), timberMat), `timber-louver-${i + 1}`, `Timber Brise-Soleil #${i + 1}`);
			louver.position.set(-3.2 + i * .65, 4.44, 2.68);
			louver.castShadow = true;
			group.add(louver);
		}
		const fascia = tagMesh(new Mesh(new BoxGeometry(10.6, .18, 5.5), darkTrimMat), "villa-fascia", "Upper Roof Fascia");
		fascia.position.set(.6, 5.76, -.1);
		group.add(fascia);
	} else if (preset === "loft") {
		const shellBack = tagMesh(new Mesh(new BoxGeometry(10.2, 5.8, .6), primaryMat), "loft-north-wall", "Loft Back Shell Wall");
		shellBack.position.set(0, 3.28, -3.2);
		shellBack.castShadow = true;
		shellBack.receiveShadow = true;
		group.add(shellBack);
		const shellLeft = tagMesh(new Mesh(new BoxGeometry(.6, 5.8, 6.8), primaryMat), "loft-west-wall", "Loft West Wall");
		shellLeft.position.set(-4.8, 3.28, .1);
		shellLeft.castShadow = true;
		group.add(shellLeft);
		const mezz = tagMesh(new Mesh(new BoxGeometry(5.4, .28, 5.2), timberMat), "loft-mezzanine", "Oak Mezzanine Deck");
		mezz.position.set(-1.8, 3.2, -.4);
		mezz.castShadow = true;
		group.add(mezz);
		const island = tagMesh(new Mesh(new BoxGeometry(2.8, .92, 1.1), plinthMat), "loft-island", "Kitchen Monolith Island");
		island.position.set(1.8, .84, .4);
		island.castShadow = true;
		group.add(island);
		const hearthGlow = tagMesh(new Mesh(new BoxGeometry(2.2, 1.2, .35), interiorGlowMat), "loft-hearth", "Atrium Lighting Core");
		hearthGlow.position.set(1.8, 2.2, -2.5);
		group.add(hearthGlow);
		const curtain = tagMesh(new Mesh(new BoxGeometry(8.8, 5.2, .08), glassMat), "loft-curtainwall", "Double-Height Curtain Wall");
		curtain.position.set(.2, 2.98, 3.2);
		group.add(curtain);
		for (let x = -4, idx = 1; x <= 4; x += 2, idx++) {
			const mullion = tagMesh(new Mesh(new BoxGeometry(.12, 5.4, .18), darkTrimMat), `loft-mullion-${idx}`, `Steel Mullion #${idx}`);
			mullion.position.set(x, 3.08, 3.25);
			group.add(mullion);
		}
		const roof = tagMesh(new Mesh(new BoxGeometry(10.6, .3, 7.2), darkTrimMat), "loft-roof", "Steel Truss Roof Deck");
		roof.position.set(0, 6.3, .1);
		roof.castShadow = true;
		group.add(roof);
	} else {
		for (let i = 0; i < 5; i++) {
			const bayX = -4.2 + i * 2.1;
			const col = tagMesh(new Mesh(new BoxGeometry(.28, 4.4, .36), timberMat), `glulam-col-${i + 1}`, `Glulam Column #${i + 1}`);
			col.position.set(bayX, 2.58, 2.6);
			col.castShadow = true;
			group.add(col);
			const beam = tagMesh(new Mesh(new BoxGeometry(.28, .42, 6.4), timberMat), `glulam-beam-${i + 1}`, `Glulam Roof Beam #${i + 1}`);
			beam.position.set(bayX, 4.95, -.2);
			beam.castShadow = true;
			group.add(beam);
		}
		const core = tagMesh(new Mesh(new BoxGeometry(8.6, 4.3, 4.6), primaryMat), "civic-core", "Civic Acoustic Core");
		core.position.set(0, 2.52, -1.2);
		core.castShadow = true;
		core.receiveShadow = true;
		group.add(core);
		const interiorAtrium = tagMesh(new Mesh(new BoxGeometry(6.8, 1, .4), interiorGlowMat), "civic-atrium", "Clerestory Lantern");
		interiorAtrium.position.set(0, 3.9, .9);
		group.add(interiorAtrium);
		const clerestory = tagMesh(new Mesh(new BoxGeometry(8.8, 1.4, .1), glassMat), "civic-clerestory", "Clerestory Glazing Band");
		clerestory.position.set(0, 4.02, 1.16);
		group.add(clerestory);
		const zincRoof = tagMesh(new Mesh(new BoxGeometry(10.8, .28, 7.2), darkTrimMat), "civic-roof", "Standing-Seam Zinc Roof");
		zincRoof.position.set(0, 5.28, -.1);
		zincRoof.rotation.x = .08;
		zincRoof.castShadow = true;
		group.add(zincRoof);
	}
	return group;
}
function normalizeAndGroundObject(root) {
	root.updateMatrixWorld(true);
	const box = new Box3().setFromObject(root);
	const size = new Vector3();
	const center = new Vector3();
	box.getSize(size);
	box.getCenter(center);
	const scaleFactor = 10.5 / Math.max(size.x, size.y, size.z, .001);
	root.scale.multiplyScalar(scaleFactor);
	root.updateMatrixWorld(true);
	const scaledBox = new Box3().setFromObject(root);
	const scaledCenter = new Vector3();
	scaledBox.getCenter(scaledCenter);
	root.position.x -= scaledCenter.x;
	root.position.z -= scaledCenter.z;
	root.position.y -= scaledBox.min.y;
	let meshCount = 0;
	const partNames = [];
	root.traverse((obj) => {
		if (obj.isMesh) {
			const mesh = obj;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			meshCount++;
			const label = mesh.name?.trim() || `Architectural Part ${meshCount}`;
			const objectId = (mesh.name?.trim() || `cad-mesh-${meshCount}`).toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
			mesh.userData.objectId = objectId;
			mesh.userData.pickLabel = label;
			if (!mesh.userData.originalMaterial) mesh.userData.originalMaterial = mesh.material;
			partNames.push(label);
		}
	});
	return {
		meshCount,
		partNames
	};
}
function createDynamicSolarHdriTexture(params) {
	const { mood, azimuthDeg = 148, rawElevationDeg = 38, zenithHex, horizonHex, groundBounceHex, isDaylight = true } = params;
	const canvas = document.createElement("canvas");
	canvas.width = 512;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (ctx) {
		const grad = ctx.createLinearGradient(0, 0, 0, 256);
		if (zenithHex && horizonHex && groundBounceHex) {
			grad.addColorStop(0, zenithHex);
			grad.addColorStop(.45, horizonHex);
			grad.addColorStop(.55, horizonHex);
			grad.addColorStop(.65, groundBounceHex);
			grad.addColorStop(1, "#2a2520");
		} else if (mood === "golden-dusk") {
			grad.addColorStop(0, "#1c2d4a");
			grad.addColorStop(.42, "#596a88");
			grad.addColorStop(.55, "#f0b475");
			grad.addColorStop(.62, "#876f57");
			grad.addColorStop(1, "#3d332a");
		} else if (mood === "overcast-nordic") {
			grad.addColorStop(0, "#9aa5b0");
			grad.addColorStop(.5, "#ced6dd");
			grad.addColorStop(.6, "#938f86");
			grad.addColorStop(1, "#58554e");
		} else if (mood === "studio") {
			grad.addColorStop(0, "#eef0f2");
			grad.addColorStop(.48, "#dfe3e8");
			grad.addColorStop(.56, "#9e988d");
			grad.addColorStop(1, "#5c574f");
		} else {
			grad.addColorStop(0, "#3b6fa8");
			grad.addColorStop(.45, "#a6c5e0");
			grad.addColorStop(.54, "#f4eee2");
			grad.addColorStop(.65, "#aba191");
			grad.addColorStop(1, "#5c5244");
		}
		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, 512, 256);
		const sunX = (azimuthDeg % 360 + 360) % 360 / 360 * 512;
		const clampedEl = Math.max(-15, Math.min(84, rawElevationDeg));
		const sunY = Math.max(16, Math.min(168, 128 - clampedEl / 90 * 116));
		if (mood !== "overcast-nordic") {
			const discColor = !isDaylight ? "rgba(182,210,255,0.68)" : clampedEl < 18 ? "rgba(255,198,125,0.96)" : "rgba(255,252,240,0.98)";
			const haloColor = !isDaylight ? "rgba(130,170,240,0.2)" : clampedEl < 18 ? "rgba(255,165,92,0.42)" : "rgba(255,236,196,0.38)";
			for (const offsetX of [
				0,
				-512,
				512
			]) {
				const cx = sunX + offsetX;
				const rad = ctx.createRadialGradient(cx, sunY, 2, cx, sunY, isDaylight ? 52 : 34);
				rad.addColorStop(0, discColor);
				rad.addColorStop(.38, haloColor);
				rad.addColorStop(1, "rgba(255,255,255,0)");
				ctx.fillStyle = rad;
				ctx.fillRect(cx - 56, sunY - 56, 112, 112);
			}
		}
	}
	const tex = new CanvasTexture(canvas);
	tex.mapping = 303;
	tex.colorSpace = SRGBColorSpace;
	return tex;
}
function buildFloorPlanExtrusionGroup(walls, mats) {
	const group = new Group();
	const floor = tagMesh(new Mesh(new BoxGeometry(15.2, .25, 12.2), mats.plinthMat), "floor-slab", "Floor Slab");
	floor.position.set(0, .125, 0);
	floor.receiveShadow = true;
	group.add(floor);
	for (const wall of walls) {
		const mesh = tagMesh(new Mesh(new BoxGeometry(wall.width, wall.height, wall.depth), mats.primaryMat), `plan-wall-${wall.id}`, `Extruded Wall (${wall.id})`);
		mesh.position.set(wall.x, wall.height * .5 + .25, wall.z);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		group.add(mesh);
	}
	const skylight = tagMesh(new Mesh(new BoxGeometry(13.6, .08, 10.6), mats.glassMat), "skylight-canopy", "Skylight Canopy");
	skylight.position.set(0, 3.4, 0);
	group.add(skylight);
	return group;
}
function disposeMaterialIfCustom(mat, customPool) {
	if (!mat) return;
	const list = Array.isArray(mat) ? mat : [mat];
	for (const item of list) {
		const idx = customPool.indexOf(item);
		if (idx !== -1) {
			item.dispose();
			customPool.splice(idx, 1);
		}
	}
}
function applyMaterialOverrideToMesh(mesh, spec, customPool) {
	if (!mesh.userData.originalMaterial) mesh.userData.originalMaterial = mesh.material;
	disposeMaterialIfCustom(mesh.material, customPool);
	const nextMat = new MeshPhysicalMaterial({
		color: new Color(spec.hex),
		roughness: spec.roughness,
		metalness: spec.metalness,
		clearcoat: spec.clearcoat,
		transparent: spec.transparent,
		opacity: spec.opacity,
		envMapIntensity: spec.transparent ? 1.4 : 1.05
	});
	customPool.push(nextMat);
	mesh.material = nextMat;
	return nextMat;
}
function restoreOriginalMeshMaterial(mesh, customPool) {
	const original = mesh.userData.originalMaterial;
	if (!original || mesh.material === original) return false;
	disposeMaterialIfCustom(mesh.material, customPool);
	mesh.material = original;
	return true;
}
function exportThreeRenderChannels(renderer, scene, camera) {
	const prevBg = scene.background;
	const prevFog = scene.fog;
	const prevOverride = scene.overrideMaterial;
	const depthMat = new MeshDepthMaterial();
	scene.overrideMaterial = depthMat;
	scene.background = new Color(723468);
	scene.fog = null;
	renderer.render(scene, camera);
	const depthUrl = renderer.domElement.toDataURL("image/png");
	const normalMat = new MeshNormalMaterial();
	scene.overrideMaterial = normalMat;
	scene.background = new Color(8421631);
	renderer.render(scene, camera);
	const normalUrl = renderer.domElement.toDataURL("image/png");
	const clayMat = new MeshStandardMaterial({
		color: 15131096,
		roughness: .92,
		metalness: 0
	});
	scene.overrideMaterial = clayMat;
	scene.background = new Color(14472907);
	renderer.render(scene, camera);
	const clayUrl = renderer.domElement.toDataURL("image/jpeg", .92);
	scene.overrideMaterial = prevOverride;
	scene.background = prevBg;
	scene.fog = prevFog;
	depthMat.dispose();
	normalMat.dispose();
	clayMat.dispose();
	renderer.render(scene, camera);
	return {
		depthUrl,
		normalUrl,
		clayUrl
	};
}
function applyCameraLensShift(camera, width, height, twoPointTilt, verticalShift) {
	if (!twoPointTilt || Math.abs(verticalShift) < .002) {
		camera.clearViewOffset();
		return;
	}
	const fullW = Math.max(1, Math.round(width));
	const fullH = Math.max(1, Math.round(height));
	const offsetY = Math.round(verticalShift * fullH);
	camera.setViewOffset(fullW, fullH, 0, offsetY, fullW, fullH);
}
function makeAfterDraw(gl, isSoftwareGl) {
	const gl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext ? gl : null;
	if (!isSoftwareGl || !gl2) return (done) => requestAnimationFrame(done);
	return (done) => {
		const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
		if (!sync) {
			requestAnimationFrame(done);
			return;
		}
		gl2.flush();
		let polls = 0;
		const poll = () => {
			polls += 1;
			const status = gl2.clientWaitSync(sync, 0, 0);
			if (status === gl2.ALREADY_SIGNALED || status === gl2.CONDITION_SATISFIED || status === gl2.WAIT_FAILED || polls >= 6) {
				gl2.deleteSync(sync);
				done();
			} else setTimeout(poll, 16);
		};
		setTimeout(poll, 0);
	};
}
function tagPickableMeshes(group, fallbackPrefix) {
	let idx = 0;
	const list = [];
	group.traverse((obj) => {
		if (obj.isMesh) {
			const mesh = obj;
			if (mesh.userData.nonPickable) return;
			idx += 1;
			const existingId = typeof mesh.userData.objectId === "string" && mesh.userData.objectId.trim() ? mesh.userData.objectId.trim() : mesh.name?.trim() || `${fallbackPrefix.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`;
			const label = typeof mesh.userData.pickLabel === "string" && mesh.userData.pickLabel.trim() ? mesh.userData.pickLabel.trim() : mesh.name?.trim() || `${fallbackPrefix} Part #${idx}`;
			mesh.userData.objectId = existingId;
			mesh.userData.pickLabel = label;
			if (!mesh.userData.originalMaterial) mesh.userData.originalMaterial = mesh.material;
			list.push({
				objectId: existingId,
				label
			});
		}
	});
	return list;
}
function Viewport3D({ aspect: _aspect, compactSplit = false, onCaptureSnapshot, onCaptureDepthPass, onCaptureChannels }) {
	const scene3d = useOriel((state) => state.scene3d);
	const setScene3DField = useOriel((state) => state.setScene3DField);
	const meshMaterialOverrides = useOriel((state) => state.meshMaterialOverrides);
	const upsertMeshMaterial = useOriel((state) => state.upsertMeshMaterial);
	const updateMeshMaterial = useOriel((state) => state.updateMeshMaterial);
	const deleteMeshMaterial = useOriel((state) => state.deleteMeshMaterial);
	const clearMeshMaterials = useOriel((state) => state.clearMeshMaterials);
	const floorPlanBlueprint = useOriel((state) => state.floorPlanBlueprint);
	const cameraKeyframes = useOriel((state) => state.cameraKeyframes);
	const addCameraKeyframe = useOriel((state) => state.addCameraKeyframe);
	const upsertCameraKeyframe = useOriel((state) => state.upsertCameraKeyframe);
	const setCameraKeyframes = useOriel((state) => state.setCameraKeyframes);
	const removeCameraKeyframe = useOriel((state) => state.removeCameraKeyframe);
	const clearCameraKeyframes = useOriel((state) => state.clearCameraKeyframes);
	const setConditioningChannel = useOriel((state) => state.setConditioningChannel);
	const [hudOpen, setHudOpen] = (0, import_react.useState)(!compactSplit);
	const [inspectorOpen, setInspectorOpen] = (0, import_react.useState)(!compactSplit);
	const [rigTab, setRigTab] = (0, import_react.useState)("model");
	const [mountReady, setMountReady] = (0, import_react.useState)(false);
	const [contextLost, setContextLost] = (0, import_react.useState)(false);
	const [selectedObjectId, setSelectedObjectId] = (0, import_react.useState)(null);
	const [selectedPartName, setSelectedPartName] = (0, import_react.useState)(null);
	const [sceneMeshList, setSceneMeshList] = (0, import_react.useState)([]);
	const [playingPath, setPlayingPath] = (0, import_react.useState)(false);
	const [recordingVideo, setRecordingVideo] = (0, import_react.useState)(false);
	const [flythroughScrub, setFlythroughScrub] = (0, import_react.useState)(0);
	const [exportedClipUrl, setExportedClipUrl] = (0, import_react.useState)(null);
	const [exportFormat, setExportFormat] = (0, import_react.useState)("glb");
	const [exportingGltf, setExportingGltf] = (0, import_react.useState)(false);
	const [lastExportMeta, setLastExportMeta] = (0, import_react.useState)(null);
	const mountRef = (0, import_react.useRef)(null);
	const cadInputRef = (0, import_react.useRef)(null);
	const rendererRef = (0, import_react.useRef)(null);
	const sceneRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const controlsRef = (0, import_react.useRef)(null);
	const sunRef = (0, import_react.useRef)(null);
	const rimRef = (0, import_react.useRef)(null);
	const hemiRef = (0, import_react.useRef)(null);
	const materialsRef = (0, import_react.useRef)(null);
	const massingGroupRef = (0, import_react.useRef)(null);
	const customCadGroupRef = (0, import_react.useRef)(null);
	const pathGroupRef = (0, import_react.useRef)(null);
	const customMatPoolRef = (0, import_react.useRef)([]);
	const selectedMeshRef = (0, import_react.useRef)(null);
	const selectionBoxRef = (0, import_react.useRef)(null);
	const envTargetRef = (0, import_react.useRef)(null);
	const requestRenderRef = (0, import_react.useRef)(() => void 0);
	const isSoftwareGlRef = (0, import_react.useRef)(false);
	const camTransitionRef = (0, import_react.useRef)(null);
	const flythroughRafRef = (0, import_react.useRef)(0);
	const flythroughCancelRef = (0, import_react.useRef)(false);
	const flythroughRecorderRef = (0, import_react.useRef)(null);
	const flyProgressBarRef = (0, import_react.useRef)(null);
	const flyTimeReadoutRef = (0, import_react.useRef)(null);
	const lensShiftRef = (0, import_react.useRef)({
		twoPointTilt: scene3d.twoPointTilt,
		verticalShift: scene3d.verticalShift
	});
	lensShiftRef.current = {
		twoPointTilt: scene3d.twoPointTilt,
		verticalShift: scene3d.verticalShift
	};
	const lastCamPresetRef = (0, import_react.useRef)(scene3d.cameraPreset);
	const pointerDownPtRef = (0, import_react.useRef)(null);
	const transformRef = (0, import_react.useRef)({
		rotY: scene3d.modelRotationY,
		scale: scene3d.modelScale,
		elev: scene3d.modelElevation
	});
	transformRef.current = {
		rotY: scene3d.modelRotationY,
		scale: scene3d.modelScale,
		elev: scene3d.modelElevation
	};
	const overridesRef = (0, import_react.useRef)(meshMaterialOverrides);
	overridesRef.current = meshMaterialOverrides;
	const activeSolar = (0, import_react.useMemo)(() => {
		return computeSolarRigState({
			timeOfDay: scene3d.geoHour,
			month: scene3d.geoMonth,
			latitude: scene3d.geoLatitude
		});
	}, [
		scene3d.geoHour,
		scene3d.geoMonth,
		scene3d.geoLatitude
	]);
	const liveSunVector = (0, import_react.useMemo)(() => {
		if (scene3d.geoEnabled) return activeSolar.sunPosition;
		const manual = computeSunPosition(scene3d.sunAzimuth, scene3d.sunElevation);
		return {
			x: manual.x,
			y: manual.y,
			z: manual.z
		};
	}, [
		scene3d.geoEnabled,
		activeSolar.sunPosition,
		scene3d.sunAzimuth,
		scene3d.sunElevation
	]);
	const selectedOverride = (0, import_react.useMemo)(() => getMaterialAssignment(meshMaterialOverrides, selectedObjectId), [meshMaterialOverrides, selectedObjectId]);
	(0, import_react.useEffect)(() => {
		const container = mountRef.current;
		if (!container) return;
		const width = Math.max(320, container.clientWidth || 960);
		const height = Math.max(240, container.clientHeight || 420);
		let renderer;
		try {
			renderer = new WebGLRenderer({
				antialias: true,
				powerPreference: "high-performance",
				preserveDrawingBuffer: true
			});
		} catch {
			setContextLost(true);
			return;
		}
		const gl = renderer.getContext();
		const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
		const rendererStr = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? "") : "";
		const isSoftwareGl = /SwiftShader|llvmpipe|Software Rasterizer/i.test(rendererStr);
		isSoftwareGlRef.current = isSoftwareGl;
		renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height);
		renderer.toneMapping = 4;
		renderer.toneMappingExposure = scene3d.exposure;
		renderer.outputColorSpace = SRGBColorSpace;
		renderer.shadowMap.enabled = !isSoftwareGl;
		renderer.shadowMap.type = 2;
		const canvas = renderer.domElement;
		canvas.style.display = "block";
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		container.innerHTML = "";
		container.appendChild(canvas);
		rendererRef.current = renderer;
		const handleLost = (e) => {
			e.preventDefault();
			setContextLost(true);
		};
		const handleRestored = () => {
			setContextLost(false);
			requestRenderRef.current();
		};
		canvas.addEventListener("webglcontextlost", handleLost);
		canvas.addEventListener("webglcontextrestored", handleRestored);
		const scene = new Scene();
		sceneRef.current = scene;
		const initialSolar = computeSolarRigState({
			timeOfDay: scene3d.geoHour,
			month: scene3d.geoMonth,
			latitude: scene3d.geoLatitude
		});
		const initTex = createDynamicSolarHdriTexture({
			mood: scene3d.hdriMood,
			azimuthDeg: scene3d.geoEnabled ? initialSolar.azimuthDeg : scene3d.sunAzimuth,
			rawElevationDeg: scene3d.geoEnabled ? initialSolar.rawElevationDeg : scene3d.sunElevation,
			zenithHex: scene3d.geoEnabled ? initialSolar.zenithHex : void 0,
			horizonHex: scene3d.geoEnabled ? initialSolar.horizonHex : void 0,
			groundBounceHex: scene3d.geoEnabled ? initialSolar.groundBounceHex : void 0,
			isDaylight: scene3d.geoEnabled ? initialSolar.isDaylight : true
		});
		const pmrem = new PMREMGenerator(renderer);
		pmrem.compileEquirectangularShader();
		const envTarget = pmrem.fromEquirectangular(initTex);
		scene.environment = envTarget.texture;
		envTargetRef.current = envTarget;
		initTex.dispose();
		pmrem.dispose();
		const camera = new PerspectiveCamera(focalLengthToFov(scene3d.focalLength), width / height, .1, 240);
		const camInit = CAMERA_VIEWS[scene3d.cameraPreset];
		camera.position.set(...camInit.pos);
		applyCameraLensShift(camera, width, height, scene3d.twoPointTilt, scene3d.verticalShift);
		cameraRef.current = camera;
		const controls = new OrbitControls(camera, canvas);
		controls.target.set(...camInit.target);
		controls.enableDamping = !isSoftwareGl;
		controls.dampingFactor = .06;
		controls.maxPolarAngle = Math.PI / 2 - .03;
		controls.minDistance = 4;
		controls.maxDistance = 45;
		controls.update();
		controlsRef.current = controls;
		const maxAnisotropy = isSoftwareGl ? 1 : renderer.capabilities.getMaxAnisotropy();
		const mats = createSharedSceneMaterials(scene3d.primaryMaterial, maxAnisotropy);
		materialsRef.current = mats;
		const ground = new Mesh(new PlaneGeometry(150, 150), mats.groundMat);
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = 0;
		ground.receiveShadow = true;
		scene.add(ground);
		const grid = new GridHelper(48, 24, 12102293, 13287599);
		grid.position.y = .015;
		scene.add(grid);
		const contextTrees = new Group();
		for (const [tx, tz, ts] of [
			[
				-9.8,
				-6.2,
				1.15
			],
			[
				-10.6,
				2.4,
				.92
			],
			[
				9.6,
				-4.8,
				1.08
			],
			[
				11,
				4.6,
				.88
			]
		]) contextTrees.add(buildTreeCluster(tx, tz, ts, mats));
		scene.add(contextTrees);
		const initialMassing = scene3d.preset === "plan-extrude" && floorPlanBlueprint ? buildFloorPlanExtrusionGroup(floorPlanBlueprint.walls, mats) : buildPresetMassing(scene3d.preset === "custom-cad" || scene3d.preset === "plan-extrude" ? "pavilion" : scene3d.preset, mats);
		const initialMeshes = tagPickableMeshes(initialMassing, "Architecture");
		setSceneMeshList(initialMeshes);
		massingGroupRef.current = initialMassing;
		scene.add(initialMassing);
		const sunSpec = computeSunPosition(scene3d.sunAzimuth, scene3d.sunElevation);
		const hemi = new HemisphereLight(sunSpec.skyHex, 7299923, sunSpec.ambientIntensity);
		hemiRef.current = hemi;
		scene.add(hemi);
		const sun = new DirectionalLight(sunSpec.sunHex, sunSpec.sunIntensity);
		sun.position.set(sunSpec.x, sunSpec.y, sunSpec.z);
		if (!isSoftwareGl) {
			sun.castShadow = true;
			sun.shadow.mapSize.set(1024, 1024);
			sun.shadow.camera.near = 1;
			sun.shadow.camera.far = 65;
			sun.shadow.camera.left = -16;
			sun.shadow.camera.right = 16;
			sun.shadow.camera.top = 16;
			sun.shadow.camera.bottom = -16;
			sun.shadow.bias = -5e-4;
		}
		sunRef.current = sun;
		scene.add(sun);
		const rim = new DirectionalLight(13162732, .42);
		rim.position.set(-sunSpec.x * .7, Math.max(8, sunSpec.y * .6), -sunSpec.z * .7);
		rimRef.current = rim;
		scene.add(rim);
		scene.background = new Color(sunSpec.skyHex);
		scene.fog = new FogExp2(sunSpec.skyHex, scene3d.fogDensity / 100 * .025);
		if (!isSoftwareGl) renderer.compile(scene, camera);
		const raycaster = new Raycaster();
		const pointerNdc = new Vector2();
		const handlePointerDown = (e) => {
			pointerDownPtRef.current = {
				x: e.clientX,
				y: e.clientY
			};
		};
		const handlePointerUp = (e) => {
			const start = pointerDownPtRef.current;
			pointerDownPtRef.current = null;
			if (!start || !massingGroupRef.current) return;
			if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 6) return;
			const rect = canvas.getBoundingClientRect();
			pointerNdc.x = (e.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1;
			pointerNdc.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
			raycaster.setFromCamera(pointerNdc, camera);
			const hitMesh = raycaster.intersectObjects(massingGroupRef.current.children, true).find((h) => h.object.isMesh && !h.object.userData.nonPickable)?.object;
			if (hitMesh) {
				selectedMeshRef.current = hitMesh;
				const objectId = String(hitMesh.userData.objectId || hitMesh.name || hitMesh.uuid);
				const label = String(hitMesh.userData.pickLabel || hitMesh.name || "Selected Surface");
				setSelectedObjectId(objectId);
				setSelectedPartName(label);
				if (selectionBoxRef.current) {
					scene.remove(selectionBoxRef.current);
					selectionBoxRef.current.dispose();
				}
				const helper = new BoxHelper(hitMesh, 15188602);
				selectionBoxRef.current = helper;
				scene.add(helper);
				requestRender();
			}
		};
		canvas.addEventListener("pointerdown", handlePointerDown);
		canvas.addEventListener("pointerup", handlePointerUp);
		const afterDraw = makeAfterDraw(gl, isSoftwareGl);
		let renderBusy = false;
		let renderDirty = false;
		let disposed = false;
		let rafId = 0;
		let lastTime = performance.now();
		const drawTick = () => {
			if (disposed) return;
			renderBusy = true;
			renderDirty = false;
			const now = performance.now();
			const dt = Math.min(.05, Math.max(.001, (now - lastTime) / 1e3));
			lastTime = now;
			const transition = camTransitionRef.current;
			let stillAnimating = false;
			if (transition) {
				camera.position.x = MathUtils.damp(camera.position.x, transition.pos.x, 8, dt);
				camera.position.y = MathUtils.damp(camera.position.y, transition.pos.y, 8, dt);
				camera.position.z = MathUtils.damp(camera.position.z, transition.pos.z, 8, dt);
				controls.target.x = MathUtils.damp(controls.target.x, transition.target.x, 8, dt);
				controls.target.y = MathUtils.damp(controls.target.y, transition.target.y, 8, dt);
				controls.target.z = MathUtils.damp(controls.target.z, transition.target.z, 8, dt);
				if (camera.position.distanceToSquared(transition.pos) < .002 && controls.target.distanceToSquared(transition.target) < .002) {
					camera.position.copy(transition.pos);
					controls.target.copy(transition.target);
					camTransitionRef.current = null;
				} else stillAnimating = true;
			}
			const dampingMoved = controls.update();
			renderer.render(scene, camera);
			afterDraw(() => {
				renderBusy = false;
				if (!disposed && (renderDirty || stillAnimating || !isSoftwareGl && dampingMoved)) requestRender();
			});
		};
		const requestRender = () => {
			if (disposed) return;
			renderDirty = true;
			if (renderBusy || rafId) return;
			rafId = requestAnimationFrame(() => {
				rafId = 0;
				drawTick();
			});
		};
		requestRenderRef.current = requestRender;
		const handleControlStart = () => {
			camTransitionRef.current = null;
		};
		controls.addEventListener("start", handleControlStart);
		controls.addEventListener("change", requestRender);
		requestRender();
		setMountReady(true);
		const resizeObs = new ResizeObserver((entries) => {
			const rect = entries[0]?.contentRect;
			if (!rect || rect.width < 10 || rect.height < 10) return;
			camera.aspect = rect.width / rect.height;
			applyCameraLensShift(camera, rect.width, rect.height, scene3d.twoPointTilt, scene3d.verticalShift);
			camera.updateProjectionMatrix();
			renderer.setSize(rect.width, rect.height);
			requestRender();
		});
		resizeObs.observe(container);
		return () => {
			disposed = true;
			resizeObs.disconnect();
			controls.removeEventListener("start", handleControlStart);
			controls.removeEventListener("change", requestRender);
			canvas.removeEventListener("pointerdown", handlePointerDown);
			canvas.removeEventListener("pointerup", handlePointerUp);
			canvas.removeEventListener("webglcontextlost", handleLost);
			canvas.removeEventListener("webglcontextrestored", handleRestored);
			if (rafId) cancelAnimationFrame(rafId);
			if (flythroughRafRef.current) cancelAnimationFrame(flythroughRafRef.current);
			flythroughCancelRef.current = true;
			if (flythroughRecorderRef.current && flythroughRecorderRef.current.state === "recording") flythroughRecorderRef.current.stop();
			if (pathGroupRef.current) {
				scene.remove(pathGroupRef.current);
				disposeObjectGeometries(pathGroupRef.current);
				pathGroupRef.current = null;
			}
			controls.dispose();
			if (selectionBoxRef.current) {
				scene.remove(selectionBoxRef.current);
				selectionBoxRef.current.dispose();
				selectionBoxRef.current = null;
			}
			envTargetRef.current?.dispose();
			envTargetRef.current = null;
			for (const m of customMatPoolRef.current) m.dispose();
			customMatPoolRef.current = [];
			disposeObjectGeometries(scene);
			disposeSharedSceneMaterials(mats);
			renderer.dispose();
			rendererRef.current = null;
			sceneRef.current = null;
			cameraRef.current = null;
			controlsRef.current = null;
			materialsRef.current = null;
			massingGroupRef.current = null;
			customCadGroupRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			if (exportedClipUrl) URL.revokeObjectURL(exportedClipUrl);
		};
	}, [exportedClipUrl]);
	(0, import_react.useEffect)(() => {
		if (!mountReady) return;
		const scene = sceneRef.current;
		if (!scene) return;
		if (pathGroupRef.current) {
			scene.remove(pathGroupRef.current);
			disposeObjectGeometries(pathGroupRef.current);
			pathGroupRef.current.traverse((obj) => {
				if (obj.material) {
					const mat = obj.material;
					if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
					else mat.dispose();
				}
			});
			pathGroupRef.current = null;
		}
		if (cameraKeyframes.length >= 2 && !playingPath && !recordingVideo && rigTab === "keyframes") {
			const group = new Group();
			group.userData.nonPickable = true;
			const sampled = sampleCameraPathPoints(cameraKeyframes, 32);
			const lineGeo = new BufferGeometry().setFromPoints(sampled.map(([x, y, z]) => new Vector3(x, y, z)));
			const lineMat = new LineBasicMaterial({ color: 15188602 });
			const line = new Line(lineGeo, lineMat);
			line.userData.nonPickable = true;
			group.add(line);
			const sphereGeo = new SphereGeometry(.18, 12, 12);
			for (const kf of cameraKeyframes) {
				const color = kf.role === "orbit" ? 6333946 : kf.role === "dolly" ? 15188602 : kf.role === "zoom" ? 3462041 : 16183268;
				const sphereMat = new MeshBasicMaterial({ color });
				const marker = new Mesh(sphereGeo.clone(), sphereMat);
				marker.position.set(...kf.pos);
				marker.userData.nonPickable = true;
				group.add(marker);
			}
			sphereGeo.dispose();
			pathGroupRef.current = group;
			scene.add(group);
		}
		requestRenderRef.current();
	}, [
		mountReady,
		cameraKeyframes,
		playingPath,
		recordingVideo,
		rigTab
	]);
	(0, import_react.useEffect)(() => {
		if (!mountReady) return;
		const renderer = rendererRef.current;
		const scene = sceneRef.current;
		if (!renderer || !scene) return;
		const az = scene3d.geoEnabled ? activeSolar.azimuthDeg : scene3d.sunAzimuth;
		const rawEl = scene3d.geoEnabled ? activeSolar.rawElevationDeg : scene3d.sunElevation;
		const timer = window.setTimeout(() => {
			const r = rendererRef.current;
			const s = sceneRef.current;
			if (!r || !s) return;
			const hdriTex = createDynamicSolarHdriTexture({
				mood: scene3d.hdriMood,
				azimuthDeg: az,
				rawElevationDeg: rawEl,
				zenithHex: scene3d.geoEnabled ? activeSolar.zenithHex : void 0,
				horizonHex: scene3d.geoEnabled ? activeSolar.horizonHex : void 0,
				groundBounceHex: scene3d.geoEnabled ? activeSolar.groundBounceHex : void 0,
				isDaylight: scene3d.geoEnabled ? activeSolar.isDaylight : true
			});
			const pmrem = new PMREMGenerator(r);
			pmrem.compileEquirectangularShader();
			const nextEnv = pmrem.fromEquirectangular(hdriTex);
			const prevEnv = envTargetRef.current;
			s.environment = nextEnv.texture;
			s.environmentIntensity = scene3d.geoEnabled ? activeSolar.envIntensity : 1;
			envTargetRef.current = nextEnv;
			prevEnv?.dispose();
			hdriTex.dispose();
			pmrem.dispose();
			requestRenderRef.current();
		}, 60);
		return () => window.clearTimeout(timer);
	}, [
		mountReady,
		scene3d.hdriMood,
		scene3d.geoEnabled,
		scene3d.sunAzimuth,
		scene3d.sunElevation,
		activeSolar.azimuthDeg,
		activeSolar.rawElevationDeg,
		activeSolar.zenithHex,
		activeSolar.horizonHex,
		activeSolar.groundBounceHex,
		activeSolar.isDaylight,
		activeSolar.envIntensity
	]);
	(0, import_react.useEffect)(() => {
		if (!mountReady) return;
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		const controls = controlsRef.current;
		const sun = sunRef.current;
		const rim = rimRef.current;
		const hemi = hemiRef.current;
		const mats = materialsRef.current;
		const renderer = rendererRef.current;
		if (!scene || !camera || !controls || !sun || !rim || !hemi || !mats || !renderer) return;
		const spec = MATERIAL_SPECS[scene3d.primaryMaterial];
		mats.primaryMat.color.setHex(spec.color);
		mats.primaryMat.roughness = spec.roughness;
		mats.primaryMat.metalness = spec.metalness;
		if (scene3d.geoEnabled) {
			const { x, y, z } = activeSolar.sunPosition;
			sun.position.set(x, y, z);
			sun.color.set(activeSolar.sunHex);
			sun.intensity = activeSolar.sunIntensity;
			rim.position.set(-x * .7, Math.max(8, y * .6), -z * .7);
			rim.intensity = activeSolar.rimIntensity;
			hemi.color.set(activeSolar.skyHex);
			hemi.intensity = activeSolar.ambientIntensity;
			mats.interiorGlowMat.emissiveIntensity = activeSolar.interiorGlowIntensity;
			scene.background = new Color(activeSolar.skyHex);
			scene.fog = new FogExp2(activeSolar.skyHex, scene3d.fogDensity / 100 * .025);
		} else {
			const sunAz = scene3d.sunAzimuth;
			const sunEl = scene3d.sunElevation;
			const sunSpec = computeSunPosition(sunAz, sunEl);
			sun.position.set(sunSpec.x, sunSpec.y, sunSpec.z);
			sun.color.set(sunSpec.sunHex);
			sun.intensity = sunSpec.sunIntensity;
			rim.position.set(-sunSpec.x * .7, Math.max(8, sunSpec.y * .6), -sunSpec.z * .7);
			rim.intensity = sunEl <= 12 ? .62 : .42;
			hemi.color.set(sunSpec.skyHex);
			hemi.intensity = sunSpec.ambientIntensity;
			mats.interiorGlowMat.emissiveIntensity = sunEl <= 12 ? 1.45 : sunEl < 22 ? .85 : .42;
			scene.background = new Color(sunSpec.skyHex);
			scene.fog = new FogExp2(sunSpec.skyHex, scene3d.fogDensity / 100 * .025);
		}
		const massing = massingGroupRef.current;
		if (massing) {
			massing.rotation.y = scene3d.modelRotationY * Math.PI / 180;
			massing.scale.setScalar(scene3d.modelScale);
			massing.position.y = scene3d.modelElevation;
			massing.updateMatrixWorld(true);
			if (selectionBoxRef.current && selectedMeshRef.current) selectionBoxRef.current.update();
		}
		renderer.toneMappingExposure = scene3d.exposure;
		camera.fov = focalLengthToFov(scene3d.focalLength);
		const size = renderer.getSize(new Vector2());
		applyCameraLensShift(camera, size.x, size.y, scene3d.twoPointTilt, scene3d.verticalShift);
		camera.updateProjectionMatrix();
		if (lastCamPresetRef.current !== scene3d.cameraPreset) {
			lastCamPresetRef.current = scene3d.cameraPreset;
			const view = CAMERA_VIEWS[scene3d.cameraPreset];
			const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			if (isSoftwareGlRef.current || prefersReducedMotion) {
				camera.position.set(...view.pos);
				controls.target.set(...view.target);
				controls.update();
			} else camTransitionRef.current = {
				pos: new Vector3(...view.pos),
				target: new Vector3(...view.target)
			};
		}
		requestRenderRef.current();
	}, [
		mountReady,
		scene3d.primaryMaterial,
		scene3d.geoEnabled,
		activeSolar,
		scene3d.sunAzimuth,
		scene3d.sunElevation,
		scene3d.fogDensity,
		scene3d.focalLength,
		scene3d.cameraPreset,
		scene3d.modelRotationY,
		scene3d.modelScale,
		scene3d.modelElevation,
		scene3d.exposure,
		scene3d.twoPointTilt,
		scene3d.verticalShift
	]);
	(0, import_react.useEffect)(() => {
		if (!mountReady) return;
		const group = massingGroupRef.current;
		if (!group) return;
		const overrideMap = new Map(meshMaterialOverrides.map((item) => [item.objectId, item]));
		group.traverse((obj) => {
			if (!obj.isMesh) return;
			const mesh = obj;
			if (mesh.userData.nonPickable) return;
			const oid = String(mesh.userData.objectId || mesh.name || "");
			if (!oid) return;
			const found = overrideMap.get(oid);
			if (found) applyMaterialOverrideToMesh(mesh, found, customMatPoolRef.current);
			else restoreOriginalMeshMaterial(mesh, customMatPoolRef.current);
		});
		requestRenderRef.current();
	}, [
		mountReady,
		meshMaterialOverrides,
		scene3d.preset,
		floorPlanBlueprint
	]);
	(0, import_react.useEffect)(() => {
		if (!mountReady) return;
		const scene = sceneRef.current;
		const oldMassing = massingGroupRef.current;
		const mats = materialsRef.current;
		if (!scene || !mats) return;
		if (selectionBoxRef.current) {
			scene.remove(selectionBoxRef.current);
			selectionBoxRef.current.dispose();
			selectionBoxRef.current = null;
		}
		if (scene3d.preset === "custom-cad" && customCadGroupRef.current) {
			if (oldMassing && oldMassing !== customCadGroupRef.current) {
				scene.remove(oldMassing);
				disposeObjectGeometries(oldMassing);
			}
			const next = customCadGroupRef.current;
			const list = tagPickableMeshes(next, "CAD");
			setSceneMeshList(list);
			next.rotation.y = transformRef.current.rotY * Math.PI / 180;
			next.scale.setScalar(transformRef.current.scale);
			next.position.y = transformRef.current.elev;
			massingGroupRef.current = next;
			if (!scene.children.includes(next)) scene.add(next);
			requestRenderRef.current();
			return;
		}
		if (oldMassing) {
			scene.remove(oldMassing);
			if (oldMassing !== customCadGroupRef.current) disposeObjectGeometries(oldMassing);
		}
		const next = scene3d.preset === "plan-extrude" ? buildFloorPlanExtrusionGroup(floorPlanBlueprint?.walls ?? [
			{
				id: "n",
				x: 0,
				z: -4,
				width: 12,
				depth: .3,
				height: 3.1
			},
			{
				id: "w",
				x: -5.85,
				z: 0,
				width: .3,
				depth: 8,
				height: 3.1
			},
			{
				id: "e",
				x: 5.85,
				z: 0,
				width: .3,
				depth: 8,
				height: 3.1
			},
			{
				id: "div",
				x: -1.2,
				z: -.5,
				width: .24,
				depth: 6,
				height: 3.1
			}
		], mats) : buildPresetMassing(scene3d.preset, mats);
		const nextList = tagPickableMeshes(next, scene3d.preset === "plan-extrude" ? "Plan Wall" : "Architecture");
		setSceneMeshList(nextList);
		next.rotation.y = transformRef.current.rotY * Math.PI / 180;
		next.scale.setScalar(transformRef.current.scale);
		next.position.y = transformRef.current.elev;
		massingGroupRef.current = next;
		selectedMeshRef.current = null;
		setSelectedObjectId(null);
		setSelectedPartName(null);
		scene.add(next);
		const overrideMap = new Map(overridesRef.current.map((item) => [item.objectId, item]));
		next.traverse((obj) => {
			if (!obj.isMesh) return;
			const mesh = obj;
			const oid = String(mesh.userData.objectId || "");
			const found = oid ? overrideMap.get(oid) : void 0;
			if (found) applyMaterialOverrideToMesh(mesh, found, customMatPoolRef.current);
		});
		requestRenderRef.current();
	}, [
		mountReady,
		scene3d.preset,
		floorPlanBlueprint
	]);
	(0, import_react.useEffect)(() => {
		if (!mountReady) return;
		const queued = consumePending3DFile();
		if (queued) loadCadFile(queued);
	}, [mountReady]);
	async function loadCadFile(file) {
		if (!file) return;
		const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
		const scene = sceneRef.current;
		if (!scene) return;
		const objectUrl = URL.createObjectURL(file);
		try {
			let loadedRoot;
			if (ext === "glb" || ext === "gltf") loadedRoot = (await new GLTFLoader().loadAsync(objectUrl)).scene;
			else if (ext === "obj") {
				const loader = new OBJLoader();
				const text = await file.text();
				loadedRoot = loader.parse(text);
			} else if (ext === "fbx") {
				const { FBXLoader } = await import("../_libs/three.mjs").then((n) => n.t);
				loadedRoot = await new FBXLoader().loadAsync(objectUrl);
			} else {
				toast.error("Unsupported 3D format. Use .glb, .gltf, .obj, or .fbx.");
				return;
			}
			const wrapper = new Group();
			wrapper.add(loadedRoot);
			const info = normalizeAndGroundObject(wrapper);
			if (info.meshCount === 0) {
				toast.error("No 3D meshes found in uploaded file.");
				return;
			}
			if (customCadGroupRef.current) {
				scene.remove(customCadGroupRef.current);
				disposeObjectGeometries(customCadGroupRef.current);
			}
			customCadGroupRef.current = wrapper;
			setScene3DField("customModelName", file.name);
			setScene3DField("preset", "custom-cad");
			toast.success(`Loaded ${file.name} (${info.meshCount} meshes normalized & grounded)`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not parse 3D CAD file.");
		} finally {
			URL.revokeObjectURL(objectUrl);
		}
	}
	function handleCadInput(e) {
		loadCadFile(e.target.files?.[0]);
		e.target.value = "";
	}
	function handleCadDrop(e) {
		const file = e.dataTransfer.files?.[0];
		if (!file) return;
		const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
		if ([
			"glb",
			"gltf",
			"obj",
			"fbx"
		].includes(ext)) {
			e.preventDefault();
			loadCadFile(file);
		}
	}
	function selectMeshByObjectId(objectId) {
		const group = massingGroupRef.current;
		const scene = sceneRef.current;
		if (!group || !scene) return;
		let matched = null;
		group.traverse((obj) => {
			if (!matched && obj.isMesh && String(obj.userData.objectId || "") === objectId) matched = obj;
		});
		if (!matched) return;
		const hit = matched;
		selectedMeshRef.current = hit;
		setSelectedObjectId(objectId);
		setSelectedPartName(String(hit.userData.pickLabel || objectId));
		if (selectionBoxRef.current) {
			scene.remove(selectionBoxRef.current);
			selectionBoxRef.current.dispose();
		}
		const helper = new BoxHelper(hit, 15188602);
		selectionBoxRef.current = helper;
		scene.add(helper);
		requestRenderRef.current();
	}
	function applyPbrSwatchToSelected(presetId) {
		const targetId = selectedObjectId;
		const targetLabel = selectedPartName || targetId || "Selected Surface";
		if (!targetId) {
			toast.message("Click a mesh in the 3D scene (or pick an Object ID) first.");
			return;
		}
		const assignment = createAssignmentFromSwatch(targetId, targetLabel, presetId);
		if (!assignment) return;
		upsertMeshMaterial(assignment);
		toast.success(`Assigned ${assignment.materialLabel} to #${targetId}`);
	}
	function handleResetObjectMaterial(objectId) {
		deleteMeshMaterial(objectId);
		toast.success(`Restored default material on #${objectId}`);
	}
	function applyGeoSolar(lat, month, hour) {
		const solar = computeSolarRigState({
			timeOfDay: hour,
			month,
			latitude: lat
		});
		setScene3DField("geoEnabled", true);
		setScene3DField("geoLatitude", lat);
		setScene3DField("geoMonth", month);
		setScene3DField("geoHour", hour);
		setScene3DField("sunAzimuth", solar.azimuthDeg);
		setScene3DField("sunElevation", solar.elevationDeg);
	}
	function capture(goToSketch = false) {
		const renderer = rendererRef.current;
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		if (!renderer || !scene || !camera) return;
		renderer.render(scene, camera);
		onCaptureSnapshot(renderer.domElement.toDataURL("image/jpeg", .92), goToSketch);
	}
	function captureChannels() {
		const renderer = rendererRef.current;
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		if (!renderer || !scene || !camera) return;
		const channels = exportThreeRenderChannels(renderer, scene, camera);
		setConditioningChannel("depth", channels.depthUrl);
		setConditioningChannel("normal", channels.normalUrl);
		setConditioningChannel("clay", channels.clayUrl);
		onCaptureChannels?.(channels);
		onCaptureDepthPass?.(channels.depthUrl);
		toast.success("Exported true WebGL Depth, Normal & Clay conditioning passes");
	}
	async function downloadSceneGltf(format = exportFormat) {
		const group = massingGroupRef.current;
		if (!group || exportingGltf) return;
		setExportingGltf(true);
		try {
			const result = await exportGroupToGltfAsync(group, meshMaterialOverrides, {
				binary: format === "glb",
				presetName: scene3d.preset
			});
			const blob = result.payload instanceof ArrayBuffer ? new Blob([result.payload], { type: result.mimeType }) : new Blob([JSON.stringify(result.payload, null, 2)], { type: result.mimeType });
			const fileName = `oriel-${scene3d.preset}-scene.${result.extension}`;
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.setTimeout(() => URL.revokeObjectURL(url), 1500);
			const metaLabel = `${fileName} (${result.summary.meshCount} meshes · ${result.summary.overrideCount} PBR overrides)`;
			setLastExportMeta(metaLabel);
			toast.success(`Downloaded ${metaLabel}`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not export GLTF/GLB scene.");
		} finally {
			setExportingGltf(false);
		}
	}
	function applyCameraPoseToViewport(pose) {
		const renderer = rendererRef.current;
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		const controls = controlsRef.current;
		if (!renderer || !scene || !camera || !controls) return;
		camera.position.set(...pose.pos);
		controls.target.set(...pose.target);
		camera.fov = focalLengthToFov(pose.focalLength);
		const size = renderer.getSize(new Vector2());
		applyCameraLensShift(camera, size.x, size.y, lensShiftRef.current.twoPointTilt, lensShiftRef.current.verticalShift);
		camera.updateProjectionMatrix();
		controls.update();
		renderer.render(scene, camera);
	}
	function recordRoleKeyframe(role) {
		const camera = cameraRef.current;
		const controls = controlsRef.current;
		if (!camera || !controls) return;
		const roleNumber = role === "orbit" ? 1 : role === "dolly" ? 2 : 3;
		const roleTitle = role === "orbit" ? "Orbit" : role === "dolly" ? "Dolly" : "Zoom";
		upsertCameraKeyframe({
			id: `kf-${role}-${Date.now()}`,
			label: `${roleNumber}. ${roleTitle} (${scene3d.focalLength}mm)`,
			role,
			pos: [
				Number(camera.position.x.toFixed(2)),
				Number(camera.position.y.toFixed(2)),
				Number(camera.position.z.toFixed(2))
			],
			target: [
				Number(controls.target.x.toFixed(2)),
				Number(controls.target.y.toFixed(2)),
				Number(controls.target.z.toFixed(2))
			],
			focalLength: scene3d.focalLength
		});
		toast.success(`Recorded ${roleTitle} camera position (${scene3d.focalLength}mm)`);
	}
	function stageOrbitDollyZoomSequence() {
		const camera = cameraRef.current;
		const controls = controlsRef.current;
		if (!camera || !controls) return;
		const rig = buildOrbitDollyZoomRig([
			camera.position.x,
			camera.position.y,
			camera.position.z
		], [
			controls.target.x,
			controls.target.y,
			controls.target.z
		], scene3d.focalLength);
		setCameraKeyframes(rig);
		setFlythroughScrub(0);
		if (flyProgressBarRef.current) flyProgressBarRef.current.style.width = "0%";
		if (flyTimeReadoutRef.current) flyTimeReadoutRef.current.textContent = "0.0s / 4.0s";
		toast.success("Staged 3-shot Orbit · Dolly · Zoom 4.0s flythrough path");
	}
	function captureCurrentKeyframe() {
		const camera = cameraRef.current;
		const controls = controlsRef.current;
		if (!camera || !controls) return;
		const nextIdx = cameraKeyframes.length + 1;
		const defaultRole = !cameraKeyframes.some((k) => k.role === "orbit") ? "orbit" : !cameraKeyframes.some((k) => k.role === "dolly") ? "dolly" : !cameraKeyframes.some((k) => k.role === "zoom") ? "zoom" : void 0;
		const roleTitle = defaultRole ? `${defaultRole.charAt(0).toUpperCase()}${defaultRole.slice(1)}` : `KF #${nextIdx}`;
		addCameraKeyframe({
			id: `kf-${Date.now()}`,
			label: `${nextIdx}. ${roleTitle} (${scene3d.focalLength}mm)`,
			role: defaultRole,
			pos: [
				Number(camera.position.x.toFixed(2)),
				Number(camera.position.y.toFixed(2)),
				Number(camera.position.z.toFixed(2))
			],
			target: [
				Number(controls.target.x.toFixed(2)),
				Number(controls.target.y.toFixed(2)),
				Number(controls.target.z.toFixed(2))
			],
			focalLength: scene3d.focalLength
		});
		toast.success(`Recorded camera position #${nextIdx} (${roleTitle})`);
	}
	function scrubCameraPath(tNorm) {
		const clamped = Math.max(0, Math.min(1, tNorm));
		setFlythroughScrub(clamped);
		if (flyProgressBarRef.current) flyProgressBarRef.current.style.width = `${Math.round(clamped * 100)}%`;
		if (flyTimeReadoutRef.current) flyTimeReadoutRef.current.textContent = `${(clamped * 4).toFixed(1)}s / 4.0s`;
		const frame = interpolateCameraPathCatmullRom(cameraKeyframes, clamped);
		if (frame) applyCameraPoseToViewport(frame);
	}
	function stopFlythrough() {
		flythroughCancelRef.current = true;
		if (flythroughRafRef.current) {
			cancelAnimationFrame(flythroughRafRef.current);
			flythroughRafRef.current = 0;
		}
		if (flythroughRecorderRef.current && flythroughRecorderRef.current.state === "recording") flythroughRecorderRef.current.stop();
		if (controlsRef.current) controlsRef.current.enabled = true;
		if (pathGroupRef.current) pathGroupRef.current.visible = true;
		setPlayingPath(false);
		setRecordingVideo(false);
		requestRenderRef.current();
	}
	function playFlythrough(recordWebm = false) {
		if (cameraKeyframes.length < 2) {
			toast.message("Record at least 2 camera positions (or 3 Orbit/Dolly/Zoom shots) to play a 4s flythrough.");
			return;
		}
		const renderer = rendererRef.current;
		const scene = sceneRef.current;
		const camera = cameraRef.current;
		const controls = controlsRef.current;
		if (!renderer || !scene || !camera || !controls) return;
		if (flythroughRafRef.current) cancelAnimationFrame(flythroughRafRef.current);
		flythroughCancelRef.current = false;
		camTransitionRef.current = null;
		controls.enabled = false;
		if (pathGroupRef.current) pathGroupRef.current.visible = false;
		const canvas = renderer.domElement;
		let recorder = null;
		const chunks = [];
		if (recordWebm) {
			if (typeof canvas.captureStream !== "function" || typeof MediaRecorder === "undefined") toast.message("WebM captureStream is unavailable in this browser; playing interactive 4s preview.");
			else try {
				const stream = canvas.captureStream(24);
				const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : void 0;
				recorder = new MediaRecorder(stream, mimeType ? { mimeType } : void 0);
				flythroughRecorderRef.current = recorder;
				recorder.ondataavailable = (ev) => {
					if (ev.data.size > 0) chunks.push(ev.data);
				};
				recorder.onstop = () => {
					flythroughRecorderRef.current = null;
					setRecordingVideo(false);
					if (chunks.length > 0) {
						const blob = new Blob(chunks, { type: "video/webm" });
						const url = URL.createObjectURL(blob);
						setExportedClipUrl(url);
						const link = document.createElement("a");
						link.href = url;
						link.download = `oriel-4s-flythrough-${Date.now()}.webm`;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						toast.success("Exported smooth 4.0s camera flythrough (.webm)");
					} else toast.message("Flythrough completed, but this browser produced an empty WebM stream.");
				};
				recorder.start(250);
				setRecordingVideo(true);
			} catch {
				recorder = null;
				flythroughRecorderRef.current = null;
			}
		}
		setPlayingPath(true);
		const startMs = performance.now();
		const step = () => {
			if (flythroughCancelRef.current) return;
			const elapsed = performance.now() - startMs;
			const tNorm = Math.min(1, elapsed / FLYTHROUGH_DURATION_MS);
			const frame = interpolateCameraPathCatmullRom(cameraKeyframes, tNorm);
			if (frame) {
				camera.position.set(...frame.pos);
				controls.target.set(...frame.target);
				camera.fov = focalLengthToFov(frame.focalLength);
				const size = renderer.getSize(new Vector2());
				applyCameraLensShift(camera, size.x, size.y, lensShiftRef.current.twoPointTilt, lensShiftRef.current.verticalShift);
				camera.updateProjectionMatrix();
				controls.update();
				renderer.render(scene, camera);
			}
			if (flyProgressBarRef.current) flyProgressBarRef.current.style.width = `${Math.round(tNorm * 100)}%`;
			if (flyTimeReadoutRef.current) flyTimeReadoutRef.current.textContent = `${(tNorm * 4).toFixed(1)}s / 4.0s`;
			if (tNorm < 1) flythroughRafRef.current = requestAnimationFrame(step);
			else {
				flythroughRafRef.current = 0;
				controls.enabled = true;
				if (pathGroupRef.current) pathGroupRef.current.visible = true;
				setFlythroughScrub(1);
				setPlayingPath(false);
				if (recorder && recorder.state === "recording") {
					try {
						recorder.requestData();
					} catch {}
					recorder.stop();
				}
				requestRenderRef.current();
			}
		};
		flythroughRafRef.current = requestAnimationFrame(step);
	}
	function applyD5Preset(presetId) {
		const found = D5_LIGHT_PRESETS.find((p) => p.id === presetId);
		if (!found) return;
		setScene3DField("geoEnabled", false);
		setScene3DField("d5LightPreset", presetId);
		setScene3DField("sunAzimuth", found.sunAzimuth);
		setScene3DField("sunElevation", found.sunElevation);
		setScene3DField("fogDensity", found.fogDensity);
		setScene3DField("exposure", found.exposure);
	}
	function resetModelTransform() {
		setScene3DField("modelRotationY", 0);
		setScene3DField("modelScale", 1);
		setScene3DField("modelElevation", 0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "viewport-3d",
		onDragOver: (e) => e.preventDefault(),
		onDrop: handleCadDrop,
		className: cn("w-full overflow-hidden bg-[#181613]", compactSplit ? "flex h-full min-h-0 flex-col" : ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("grid grid-cols-1", compactSplit ? "min-h-0 flex-1" : "", inspectorOpen ? "lg:grid-cols-[1fr_296px]" : "lg:grid-cols-1"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative w-full min-w-0 overflow-hidden bg-[#181613]", compactSplit ? "h-[240px] md:h-full md:min-h-[260px]" : "h-[340px] lg:h-[492px]"),
				children: [
					contextLost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full w-full flex-col items-center justify-center gap-2 bg-[#1c1915] px-6 text-center text-[#f6efe4]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, { className: "size-8 text-[#d4b06a]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-base font-semibold",
								children: "3D WebGL context paused"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-sm text-xs text-[#cbbba6]",
								children: "Your browser suspended WebGL acceleration. Switch to Sketch or Upload a reference image, or reload the view."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: mountRef,
						"data-testid": "threejs-canvas-host",
						className: cn("h-full w-full", scene3d.materialPickMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: cadInputRef,
						type: "file",
						accept: ".glb,.gltf,.obj,.fbx",
						className: "sr-only",
						onChange: handleCadInput
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-2 right-2 z-20 flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setInspectorOpen((v) => !v),
							className: cn("inline-flex h-6.5 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] font-medium shadow-md transition", inspectorOpen ? "border-[#d4b06a] bg-[#2a1c0c] text-[#e7c27a]" : "border-white/15 bg-[#14110f]/88 text-[#f6efe4] hover:border-[#d4b06a] hover:text-[#e7c27a]"),
							"aria-expanded": inspectorOpen,
							"aria-label": inspectorOpen ? "Hide 3D scene inspector" : "Show 3D scene inspector",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspector" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setHudOpen((v) => !v),
							className: "inline-flex h-6.5 shrink-0 items-center gap-1 rounded-full border border-white/15 bg-[#14110f]/88 px-2 text-[10px] font-medium text-[#f6efe4] shadow-md hover:border-[#d4b06a] hover:text-[#e7c27a]",
							"aria-expanded": hudOpen,
							"aria-label": hudOpen ? "Collapse 3D rig controls" : "Expand 3D rig controls",
							children: [hudOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hudOpen ? "Hide Rig" : "3D Rig" })]
						})]
					})
				]
			}), inspectorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				"data-testid": "inspector-sidebar",
				"aria-label": "3D Scene Inspector",
				className: cn("flex flex-col gap-2.5 overflow-y-auto border-t border-white/10 bg-[#14110f] p-2.5 text-xs text-[#f6efe4] lg:border-t-0 lg:border-l", compactSplit ? "lg:h-full" : "lg:h-[492px]"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#e7c27a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5" }), " Solar Position"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#e4dacb]",
								children: scene3d.geoEnabled ? activeSolar.phase : "Manual Rig"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-[#cbbba6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 text-[#d4b06a]" }), " Time of Day"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"data-testid": "solar-time-readout",
									className: "font-mono text-[11px] font-medium text-[#f6efe4] tabular-nums",
									children: [
										activeSolar.formattedTime,
										" (",
										scene3d.geoHour.toFixed(2),
										"h)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								"data-testid": "solar-time-slider",
								"aria-label": "Time of Day (hours)",
								min: 0,
								max: 24,
								step: .25,
								value: scene3d.geoHour,
								onChange: (e) => applyGeoSolar(scene3d.geoLatitude, scene3d.geoMonth, Number(e.target.value)),
								className: "h-1.5 w-full accent-[#d4b06a]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-[#cbbba6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3 text-[#d4b06a]" }), " Month"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"data-testid": "solar-month-readout",
									className: "font-mono text-[11px] font-medium text-[#f6efe4] tabular-nums",
									children: [
										activeSolar.monthLabel,
										" (",
										scene3d.geoMonth,
										"/12)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								"data-testid": "solar-month-slider",
								"aria-label": "Month (1 to 12)",
								min: 1,
								max: 12,
								step: 1,
								value: scene3d.geoMonth,
								onChange: (e) => applyGeoSolar(scene3d.geoLatitude, Number(e.target.value), scene3d.geoHour),
								className: "h-1.5 w-full accent-[#d4b06a]"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-white/10 bg-black/35 px-2 py-1.5 font-mono text-[10px] text-[#cbbba6]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[#9e8f7b]",
									children: "sunPosition"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									"data-testid": "sun-position-readout",
									className: "text-[#f6e7c8] tabular-nums",
									children: [
										"[",
										liveSunVector.x.toFixed(2),
										", ",
										liveSunVector.y.toFixed(2),
										", ",
										liveSunVector.z.toFixed(2),
										"]"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 flex items-center justify-between text-[9px] text-[#8d7f6c]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Az ",
									scene3d.geoEnabled ? activeSolar.azimuthDeg : scene3d.sunAzimuth,
									"° · El ",
									scene3d.geoEnabled ? activeSolar.rawElevationDeg : scene3d.sunElevation,
									"°"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "HDRI + Shadows Live" })]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#e7c27a]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, { className: "size-3.5" }), " Object Inspector"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": scene3d.materialPickMode,
								onClick: () => setScene3DField("materialPickMode", !scene3d.materialPickMode),
								className: cn("inline-flex h-6 items-center gap-1 rounded border px-2 text-[10px] font-medium", scene3d.materialPickMode ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#cbbba6] hover:text-white"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-3" }),
									" ",
									scene3d.materialPickMode ? "Raycaster On" : "Click Mesh"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-white/10 bg-black/40 p-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-wider text-[#9e8f7b]",
										children: "Object ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
										"data-testid": "selected-object-id",
										className: "rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#e7c27a]",
										children: selectedObjectId ?? "none-selected"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									"data-testid": "selected-object-label",
									className: "mt-1 truncate text-[11px] font-medium text-[#f6efe4]",
									children: selectedPartName ?? "Click any mesh on canvas or choose below:"
								}),
								sceneMeshList.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									"aria-label": "Select 3D Object ID",
									value: selectedObjectId ?? "",
									onChange: (e) => {
										if (e.target.value) selectMeshByObjectId(e.target.value);
									},
									className: "mt-1.5 h-7 w-full rounded border border-white/15 bg-[#1b1814] px-2 font-mono text-[10px] text-[#e4dacb]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: "",
										children: [
											"-- Jump to mesh ID (",
											sceneMeshList.length,
											") --"
										]
									}), sceneMeshList.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: item.objectId,
										children: [
											item.objectId,
											" (",
											item.label,
											")"
										]
									}, item.objectId))]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] uppercase tracking-wider text-[#9e8f7b]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Assign PBR Material" }), selectedOverride ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[#e7c27a]",
										children: selectedOverride.materialLabel
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5",
									children: INSPECTOR_PBR_SWATCHES.filter((s) => s.category === "Canonical").map((swatch) => {
										const active = selectedOverride?.materialId === swatch.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `pbr-swatch-${swatch.shortKey}`,
											onClick: () => applyPbrSwatchToSelected(swatch.id),
											className: cn("inline-flex flex-1 min-w-[78px] items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium whitespace-nowrap transition", active ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]" : "border-white/15 bg-black/30 text-[#f6efe4] hover:border-[#d4b06a]"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-3 shrink-0 rounded border border-white/30",
												style: { backgroundColor: swatch.hex }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: swatch.label })]
										}, swatch.id);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1",
									children: INSPECTOR_PBR_SWATCHES.filter((s) => s.category === "Architectural").map((swatch) => {
										const active = selectedOverride?.materialId === swatch.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": `pbr-swatch-${swatch.shortKey}`,
											onClick: () => applyPbrSwatchToSelected(swatch.id),
											className: cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] transition", active ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]" : "border-white/15 bg-black/25 text-[#cbbba6] hover:border-[#d4b06a] hover:text-white"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "size-2 rounded-sm border border-white/25",
												style: { backgroundColor: swatch.hex }
											}), swatch.label]
										}, swatch.id);
									})
								})
							]
						}),
						selectedOverride ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 rounded-lg border border-white/10 bg-black/30 p-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] text-[#cbbba6]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 font-medium text-[#e7c27a]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3" }), " Tune Finish"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "reset-selected-material-btn",
										onClick: () => handleResetObjectMaterial(selectedOverride.objectId),
										className: "inline-flex items-center gap-1 text-[10px] text-rose-300 hover:text-rose-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Remove"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-[10px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-16 shrink-0 text-[#cbbba6]",
											children: "Roughness"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											"data-testid": "inspector-roughness-slider",
											min: .02,
											max: 1,
											step: .02,
											value: selectedOverride.roughness,
											onChange: (e) => updateMeshMaterial(selectedOverride.objectId, { roughness: Number(e.target.value) }),
											className: "h-1 flex-1 accent-[#d4b06a]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-7 text-right font-mono tabular-nums",
											children: selectedOverride.roughness.toFixed(2)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-[10px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-16 shrink-0 text-[#cbbba6]",
											children: "Metalness"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											"data-testid": "inspector-metalness-slider",
											min: 0,
											max: 1,
											step: .02,
											value: selectedOverride.metalness,
											onChange: (e) => updateMeshMaterial(selectedOverride.objectId, { metalness: Number(e.target.value) }),
											className: "h-1 flex-1 accent-[#d4b06a]"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-7 text-right font-mono tabular-nums",
											children: selectedOverride.metalness.toFixed(2)
										})
									]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 border-t border-white/10 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] uppercase tracking-wider text-[#9e8f7b]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Assigned Overrides (",
										meshMaterialOverrides.length,
										")"
									] }), meshMaterialOverrides.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"data-testid": "clear-all-materials-btn",
										onClick: () => {
											clearMeshMaterials();
											toast.success("Cleared all object material overrides");
										},
										className: "text-[10px] normal-case text-[#cbbba6] hover:text-rose-300",
										children: "Reset All"
									}) : null]
								}),
								meshMaterialOverrides.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-[#8d7f6c]",
									children: "No overrides yet. Click a 3D mesh and select Concrete, Oak, or Glass to create an assignment."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									"data-testid": "material-overrides-list",
									className: "space-y-1",
									children: meshMaterialOverrides.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										"data-testid": `material-override-row-${item.objectId}`,
										className: cn("flex items-center justify-between gap-1.5 rounded-lg border px-2 py-1 text-[10px]", selectedObjectId === item.objectId ? "border-[#e7c27a] bg-[#e7c27a]/15" : "border-white/10 bg-black/25"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => selectMeshByObjectId(item.objectId),
											className: "flex min-w-0 flex-1 items-center gap-1.5 text-left",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "size-2.5 shrink-0 rounded-sm border border-white/30",
													style: { backgroundColor: item.hex }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "truncate font-mono text-[#f6efe4]",
													children: item.objectId
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "shrink-0 text-[#cbbba6]",
													children: ["→ ", item.materialLabel]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": `Delete material assignment for ${item.objectId}`,
											"data-testid": `delete-material-${item.objectId}`,
											onClick: () => handleResetObjectMaterial(item.objectId),
											className: "rounded p-0.5 text-[#cbbba6] hover:bg-white/10 hover:text-rose-300",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
										})]
									}, item.objectId))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 space-y-1.5 rounded-lg border border-[#d4b06a]/30 bg-[#1c1813] p-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 text-[10px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold uppercase tracking-wider text-[#e7c27a]",
												children: "3D Scene Export"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												role: "group",
												"aria-label": "GLTF export format",
												className: "inline-flex rounded border border-white/15 bg-black/40 p-0.5 font-mono text-[9px]",
												children: ["glb", "gltf"].map((fmt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setExportFormat(fmt),
													className: cn("rounded px-1.5 py-0.5 uppercase", exportFormat === fmt ? "gold-fill font-semibold text-[#2a1c0c]" : "text-[#cbbba6] hover:text-white"),
													children: [".", fmt]
												}, fmt))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "inspector-download-scene-btn",
											disabled: exportingGltf,
											onClick: () => void downloadSceneGltf(exportFormat),
											className: "gold-fill inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-55",
											children: [
												exportingGltf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }),
												"Download Scene (.",
												exportFormat,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											"data-testid": "scene-export-status",
											className: "text-[10px] text-[#b9aa95]",
											children: lastExportMeta ? `Saved: ${lastExportMeta}` : `Exports ${sceneMeshList.length} meshes with ${meshMaterialOverrides.length} applied PBR override${meshMaterialOverrides.length === 1 ? "" : "s"}.`
										})
									]
								})
							]
						})
					]
				})]
			}) : null]
		}), hudOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-white/10 bg-[#14110f] px-3.5 py-3 text-xs text-[#f6efe4]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-full bg-white/5 p-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRigTab("model"),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium", rigTab === "model" ? "gold-fill text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Move3d, { className: "size-3" }), " Massing & CAD"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRigTab("lighting"),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium", rigTab === "lighting" ? "gold-fill text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3" }), " Sun & Lens"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setRigTab("keyframes"),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium", rigTab === "keyframes" ? "gold-fill text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "size-3" }),
									" Keyframes (",
									cameraKeyframes.length,
									")"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 rounded-full bg-white/5 p-0.5",
						children: CAMERA_PRESETS_3D.map((cam) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setScene3DField("cameraPreset", cam.id),
							className: cn("h-7 shrink-0 whitespace-nowrap rounded-full px-2.5 text-[11px]", scene3d.cameraPreset === cam.id ? "gold-fill font-medium text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white"),
							children: cam.label
						}, cam.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "download-scene-btn",
							disabled: exportingGltf,
							onClick: () => void downloadSceneGltf(exportFormat),
							className: "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[#d4b06a]/55 bg-[#d4b06a]/15 px-2.5 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#d4b06a]/25 disabled:opacity-55",
							children: [
								exportingGltf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3 animate-spin text-[#e7c27a]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3 text-[#e7c27a]" }),
								"Download Scene (.",
								exportFormat,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: captureChannels,
							className: "inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3 text-[#e7c27a]" }), " Depth / Normal / Clay"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => capture(true),
							className: "h-8 shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]",
							children: "Snapshot → Sketch"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => capture(false),
							className: "gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" }), "Capture 3D"]
						})
					]
				})]
			}), rigTab === "model" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 space-y-2.5 border-t border-white/10 pt-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#b9aa95]",
									children: "Massing"
								}),
								SCENE3D_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScene3DField("preset", p.id),
									className: cn("h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]", scene3d.preset === p.id ? "gold-fill border-transparent font-medium text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: p.label
								}, p.id)),
								floorPlanBlueprint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScene3DField("preset", "plan-extrude"),
									className: cn("h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]", scene3d.preset === "plan-extrude" ? "gold-fill border-transparent font-medium text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: "Plan Extrude"
								}) : null,
								scene3d.customModelName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScene3DField("preset", "custom-cad"),
									className: cn("h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]", scene3d.preset === "custom-cad" ? "gold-fill border-transparent font-medium text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: scene3d.customModelName
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => cadInputRef.current?.click(),
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3 text-[#e7c27a]" }), " Upload .glb/.obj/.fbx"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-[10px] uppercase tracking-wider text-[#b9aa95] sm:inline",
								children: "Base"
							}), SCENE3D_MATERIALS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: m.label,
								"aria-label": m.label,
								onClick: () => setScene3DField("primaryMaterial", m.id),
								className: cn("size-5 rounded-full border transition", scene3d.primaryMaterial === m.id ? "scale-110 border-[#e7c27a] ring-2 ring-[#e7c27a]/60" : "border-white/25"),
								style: { backgroundColor: m.swatch }
							}, m.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": scene3d.materialPickMode,
								onClick: () => setScene3DField("materialPickMode", !scene3d.materialPickMode),
								className: cn("inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 text-[11px] font-medium", scene3d.materialPickMode ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/20 bg-black/30 text-[#e4dacb]"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-3" }),
									" ",
									scene3d.materialPickMode ? "Picker Active" : "Pick Material"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-[#cbbba6]",
								children: selectedObjectId ? `Target: #${selectedObjectId}` : "Click any mesh in 3D or use Inspector sidebar:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap items-center gap-1",
								children: INSPECTOR_PBR_SWATCHES.map((pbr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => applyPbrSwatchToSelected(pbr.id),
									title: pbr.label,
									className: "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-white/15 bg-black/30 px-2 text-[10px] text-[#f6efe4] hover:border-[#d4b06a]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "size-2.5 rounded-full border border-white/30",
										style: { backgroundColor: pbr.hex }
									}), pbr.label]
								}, pbr.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-[130px] flex-1 items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-[#cbbba6]",
										children: "Rotate Y"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -180,
										max: 180,
										value: scene3d.modelRotationY,
										onChange: (e) => setScene3DField("modelRotationY", Number(e.target.value)),
										className: "h-1.5 w-full accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-9 shrink-0 text-right font-mono text-[10px] tabular-nums",
										children: [scene3d.modelRotationY, "°"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-[120px] flex-1 items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-[#cbbba6]",
										children: "Scale"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: .6,
										max: 1.5,
										step: .05,
										value: scene3d.modelScale,
										onChange: (e) => setScene3DField("modelScale", Number(e.target.value)),
										className: "h-1.5 w-full accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-8 shrink-0 text-right font-mono text-[10px] tabular-nums",
										children: [scene3d.modelScale.toFixed(2), "×"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-[120px] flex-1 items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-[#cbbba6]",
										children: "Lift"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 2.5,
										step: .1,
										value: scene3d.modelElevation,
										onChange: (e) => setScene3DField("modelElevation", Number(e.target.value)),
										className: "h-1.5 w-full accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-8 shrink-0 text-right font-mono text-[10px] tabular-nums",
										children: [scene3d.modelElevation.toFixed(1), "m"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: resetModelTransform,
								className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] hover:text-white",
								"aria-label": "Reset 3D model transform",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Reset"]
							})
						]
					})
				]
			}) : rigTab === "lighting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2.5 space-y-2.5 border-t border-white/10 pt-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#b9aa95]",
									children: "Atmosphere"
								}),
								D5_LIGHT_PRESETS.map((lp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => applyD5Preset(lp.id),
									className: cn("h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]", scene3d.d5LightPreset === lp.id && !scene3d.geoEnabled ? "gold-fill border-transparent font-medium text-[#2a1c0c]" : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]"),
									children: lp.label
								}, lp.id)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 shrink-0 text-[10px] uppercase tracking-wider text-[#b9aa95]",
									children: "HDRI"
								}),
								HDRI_MOODS.map((hm) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setScene3DField("hdriMood", hm.id),
									className: cn("h-7 shrink-0 whitespace-nowrap rounded-full border px-2 text-[10px]", scene3d.hdriMood === hm.id ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]" : "border-white/15 bg-white/5 text-[#cbbba6]"),
									children: hm.label
								}, hm.id))
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": scene3d.twoPointTilt,
								onClick: () => setScene3DField("twoPointTilt", !scene3d.twoPointTilt),
								className: cn("h-6 shrink-0 rounded-full border px-2 text-[10px] font-medium", scene3d.twoPointTilt ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 text-[#cbbba6]"),
								children: "2-Pt Tilt"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 rounded-full bg-white/5 p-0.5",
								children: FOCAL_LENGTHS.map((mm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setScene3DField("focalLength", mm),
									className: cn("h-6 shrink-0 whitespace-nowrap rounded-full px-2 font-mono text-[10px] tabular-nums", scene3d.focalLength === mm ? "gold-fill font-medium text-[#2a1c0c]" : "text-[#e4dacb]"),
									children: [mm, "mm"]
								}, mm))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": scene3d.geoEnabled,
								onClick: () => applyGeoSolar(scene3d.geoLatitude, scene3d.geoMonth, scene3d.geoHour),
								className: cn("inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] font-medium", scene3d.geoEnabled ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/20 text-[#e4dacb]"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-3" }), " Geo Sun"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#cbbba6]",
										children: "Lat"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -60,
										max: 60,
										value: scene3d.geoLatitude,
										onChange: (e) => applyGeoSolar(Number(e.target.value), scene3d.geoMonth, scene3d.geoHour),
										className: "h-1 w-16 accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-8 font-mono text-[10px] tabular-nums",
										children: [scene3d.geoLatitude, "°"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#cbbba6]",
										children: "Mo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 1,
										max: 12,
										value: scene3d.geoMonth,
										onChange: (e) => applyGeoSolar(scene3d.geoLatitude, Number(e.target.value), scene3d.geoHour),
										className: "h-1 w-14 accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-5 font-mono text-[10px] tabular-nums",
										children: scene3d.geoMonth
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#cbbba6]",
										children: "Hour"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 24,
										step: .25,
										value: scene3d.geoHour,
										onChange: (e) => applyGeoSolar(scene3d.geoLatitude, scene3d.geoMonth, Number(e.target.value)),
										className: "h-1 w-16 accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-9 font-mono text-[10px] tabular-nums",
										children: [scene3d.geoHour.toFixed(1), "h"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "ml-auto flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-[#cbbba6]",
										children: "V-Shift"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -.2,
										max: .2,
										step: .01,
										value: scene3d.verticalShift,
										onChange: (e) => setScene3DField("verticalShift", Number(e.target.value)),
										className: "h-1 w-16 accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-10 text-right font-mono text-[10px] tabular-nums",
										children: scene3d.verticalShift.toFixed(2)
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-[120px] flex-1 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-[#cbbba6]",
										children: "Azimuth"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 360,
										value: scene3d.sunAzimuth,
										onChange: (e) => setScene3DField("sunAzimuth", Number(e.target.value)),
										className: "h-1.5 w-full accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-8 shrink-0 text-right font-mono text-[10px] tabular-nums",
										children: [scene3d.sunAzimuth, "°"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-[120px] flex-1 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-[#cbbba6]",
										children: "Altitude"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 5,
										max: 82,
										value: scene3d.sunElevation,
										onChange: (e) => setScene3DField("sunElevation", Number(e.target.value)),
										className: "h-1.5 w-full accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-7 shrink-0 text-right font-mono text-[10px] tabular-nums",
										children: [scene3d.sunElevation, "°"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-[100px] flex-1 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-[#cbbba6]",
										children: "Mist"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: 0,
										max: 80,
										value: scene3d.fogDensity,
										onChange: (e) => setScene3DField("fogDensity", Number(e.target.value)),
										className: "h-1.5 w-full accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-7 shrink-0 text-right font-mono text-[10px] tabular-nums",
										children: [scene3d.fogDensity, "%"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-[100px] flex-1 items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-[11px] text-[#cbbba6]",
										children: "Exp"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: .6,
										max: 1.6,
										step: .05,
										value: scene3d.exposure,
										onChange: (e) => setScene3DField("exposure", Number(e.target.value)),
										className: "h-1.5 w-full accent-[#d4b06a]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-7 shrink-0 text-right font-mono text-[10px] tabular-nums",
										children: scene3d.exposure.toFixed(1)
									})
								]
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "camera-keyframes-panel",
				className: "mt-2.5 space-y-2.5 border-t border-white/10 pt-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								[
									"orbit",
									"dolly",
									"zoom"
								].map((role, idx) => {
									const recorded = cameraKeyframes.some((k) => k.role === role);
									const title = role === "orbit" ? "Orbit" : role === "dolly" ? "Dolly" : "Zoom";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": `record-pose-${role}`,
										disabled: playingPath,
										onClick: () => recordRoleKeyframe(role),
										className: cn("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition disabled:opacity-45", recorded ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]" : "border-white/25 bg-white/10 text-[#f6efe4] hover:border-[#d4b06a]"),
										children: [
											recorded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3 text-[#e7c27a]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 text-[#e7c27a]" }),
											idx + 1,
											". ",
											title
										]
									}, role);
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "auto-stage-3shot-btn",
									disabled: playingPath,
									onClick: stageOrbitDollyZoomSequence,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] hover:text-white disabled:opacity-45",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-[#e7c27a]" }), " Auto-Stage 3-Shot"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: captureCurrentKeyframe,
									disabled: playingPath,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#cbbba6] hover:border-[#d4b06a] hover:text-white disabled:opacity-45",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), " Add Pose"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								playingPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "stop-flythrough-btn",
									onClick: stopFlythrough,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-rose-400/50 bg-rose-500/20 px-3 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3" }), " Stop"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "play-flythrough-btn",
									disabled: cameraKeyframes.length < 2,
									onClick: () => playFlythrough(false),
									className: "gold-fill inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-45",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), " Play 4s Flythrough"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-testid": "export-flythrough-btn",
									disabled: cameraKeyframes.length < 2 || playingPath || recordingVideo,
									onClick: () => playFlythrough(true),
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 px-3 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#d4b06a]/25 disabled:opacity-45",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3" }),
										" ",
										recordingVideo ? "Recording 4s…" : "Export 4s Clip (.webm)"
									]
								}),
								exportedClipUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: exportedClipUrl,
									download: "oriel-4s-flythrough.webm",
									"data-testid": "download-flythrough-clip",
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2.5 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/25",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }), " Save .webm"]
								}) : null,
								cameraKeyframes.length > 0 && !playingPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: clearCameraKeyframes,
									className: "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 px-2.5 text-[11px] text-[#cbbba6] hover:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Clear"]
								}) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2.5 rounded-xl border border-white/10 bg-black/35 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#b9aa95]",
								children: "4s Camera Path"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-1.5 min-w-[140px] flex-1 overflow-hidden rounded-full bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: flyProgressBarRef,
									className: "h-full rounded-full bg-[#e7c27a]",
									style: { width: `${Math.round(flythroughScrub * 100)}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								"aria-label": "Scrub 4-second camera flythrough",
								min: 0,
								max: 1,
								step: .02,
								disabled: cameraKeyframes.length < 2 || playingPath,
								value: flythroughScrub,
								onChange: (e) => scrubCameraPath(Number(e.target.value)),
								className: "h-1 w-24 accent-[#d4b06a] disabled:opacity-40"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								ref: flyTimeReadoutRef,
								"data-testid": "flythrough-time-readout",
								className: "w-20 shrink-0 text-right font-mono text-[11px] text-[#f6e7c8] tabular-nums",
								children: [(flythroughScrub * 4).toFixed(1), "s / 4.0s"]
							})
						]
					}),
					cameraKeyframes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"data-testid": "camera-keyframe-list",
						className: "flex flex-wrap gap-1.5",
						children: cameraKeyframes.map((kf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							"data-keyframe-role": kf.role ?? "custom",
							className: "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: playingPath,
								onClick: () => {
									applyCameraPoseToViewport(kf);
									toast.message(`Previewing ${kf.label}`);
								},
								className: "inline-flex items-center gap-1.5 text-left hover:text-[#e7c27a] disabled:opacity-50",
								title: "Jump camera to this recorded pose",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", kf.role === "orbit" ? "bg-sky-400" : kf.role === "dolly" ? "bg-[#e7c27a]" : kf.role === "zoom" ? "bg-emerald-400" : "bg-white/70") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: kf.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "hidden font-mono text-[10px] text-[#b9aa95] tabular-nums sm:inline",
										children: [
											"[",
											kf.pos.map((v) => v.toFixed(1)).join(","),
											"]"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: playingPath,
								onClick: () => removeCameraKeyframe(kf.id),
								"aria-label": `Remove ${kf.label}`,
								className: "text-[#cbbba6] hover:text-rose-300 disabled:opacity-40",
								children: "×"
							})]
						}, kf.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-[#9e8f7b]",
						children: "Record 3 camera positions (1. Orbit, 2. Dolly, 3. Zoom) or click Auto-Stage 3-Shot to generate smooth 4.0-second Catmull-Rom flythrough clips."
					})
				]
			})]
		}) : null]
	});
}
function SplitViewportStage({ onOpenGateModal, onOpenStage, onUploadFile, heroFit = false, showOpticsDock = false, hideTopBar = false, contractOpen }) {
	const splitViewMode = useOriel((s) => s.splitViewMode);
	const setSplitViewMode = useOriel((s) => s.setSplitViewMode);
	const splitRatio = useOriel((s) => s.splitRatio);
	const setSplitRatio = useOriel((s) => s.setSplitRatio);
	const design = useOriel((s) => s.design);
	const frame = useOriel((s) => s.frame);
	const scene3d = useOriel((s) => s.scene3d);
	const engine = useOriel((s) => s.engine);
	const setEngineField = useOriel((s) => s.setEngineField);
	const upload = useOriel((s) => s.upload);
	const setUpload = useOriel((s) => s.setUpload);
	const plate = useOriel((s) => s.plate);
	const idea = useOriel((s) => s.idea);
	const designContract = useOriel((s) => s.designContract);
	const updateDesignContract = useOriel((s) => s.updateDesignContract);
	const fidelityReport = useOriel((s) => s.fidelityReport);
	const applyWorkflowPreset = useOriel((s) => s.applyWorkflowPreset);
	const budget = useOriel((s) => s.budget);
	const nanoBanana = useOriel((s) => s.nanoBanana);
	const { busy } = useGenerate();
	const [internalContractOpen, setInternalContractOpen] = (0, import_react.useState)(false);
	const [dragActive, setDragActive] = (0, import_react.useState)(false);
	const resolvedContractOpen = contractOpen ?? internalContractOpen;
	const containerRef = (0, import_react.useRef)(null);
	const sceneFileRef = (0, import_react.useRef)(null);
	const draggingRef = (0, import_react.useRef)(false);
	const aspect = frameAspect(frame.ratio);
	const heroSample = ATELIER_VERTICAL_HERO[design.vertical];
	const activeAiUrl = plate?.url ?? upload ?? heroSample.src;
	async function handleSceneUpload(file) {
		if (!file) return;
		if (onUploadFile) {
			onUploadFile(file);
			return;
		}
		try {
			const dataUrl = await readImage(file, frameEdge(frame.resolution));
			setUpload(dataUrl);
			toast.success("Scene photo uploaded — edits & presets will apply directly on it");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not read that file.");
		}
	}
	function onPointerMove(e) {
		if (!draggingRef.current || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const pct = (e.clientX - rect.left) / Math.max(1, rect.width) * 100;
		setSplitRatio(pct);
	}
	function downloadAiSnapshot() {
		const a = document.createElement("a");
		a.href = activeAiUrl;
		a.download = `oriel-sam3d-${Date.now()}.png`;
		a.click();
		toast.success("Downloaded AI Diffusion frame");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "split-viewport-stage",
		className: cn("hf-stage-enter flex flex-col gap-2", heroFit ? "min-h-0 flex-1" : ""),
		children: [
			!hideTopBar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arctic-glass flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-1.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full bg-[#efeeea] px-3 py-1 text-[11px] font-semibold tracking-wider text-[#1b1c1a] dark:bg-[#202b38]/90 dark:text-[#cfe3f0]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 animate-pulse rounded-full bg-[#725b38] dark:bg-[#e8c98a] dark:shadow-[0_0_8px_#e8c98a]" }), "SAM 3D ENGINE • RUNNING"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden text-[11px] text-[#4d463c] sm:inline dark:text-[#a9bdc9]",
							children: ["CUDA Latency: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#1b1c1a] dark:text-[#e8eff3]",
								children: "38ms"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden text-[11px] text-[#4d463c] md:inline dark:text-[#a9bdc9]",
							children: ["VRAM: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-[#1b1c1a] dark:text-[#e8eff3]",
								children: "18.4 / 24 GB"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onOpenGateModal,
							className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/35 bg-emerald-500/12 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }),
								"Gate: ",
								fidelityReport ? `${Math.round(fidelityReport.overallScore * 100)}% ${fidelityReport.status}` : "Ready"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-flex items-center gap-0.5 rounded-full bg-[#efeeea]/90 p-0.5 dark:bg-[#121c29]",
							children: [
								{
									id: "split",
									label: "Split Canvas"
								},
								{
									id: "3d-solo",
									label: "3D Mesh Solo"
								},
								{
									id: "ai-solo",
									label: "AI Canvas Solo"
								}
							].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-testid": `split-mode-${mode.id}`,
								onClick: () => setSplitViewMode(mode.id),
								className: cn("rounded-full px-2.5 py-1 text-[10px] font-semibold transition", splitViewMode === mode.id ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
								children: mode.label
							}, mode.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setInternalContractOpen((v) => !v);
							},
							className: cn("inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium", resolvedContractOpen ? "border-[#725b38] bg-[#c5a880]/20 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"),
							title: "Inspect Design Contract (Here is what I see)",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }),
								"Rung ",
								designContract.rung.rung,
								" · ",
								designContract.rung.badge
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setEngineField("liveStreamEnabled", !engine.liveStreamEnabled);
								toast.success("Synchronized 3D camera frustum with AI viewport");
							},
							className: "grid size-7 place-items-center rounded-full bg-[#efeeea] text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8eff3]",
							title: "Synchronize Camera Frustum",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onOpenStage(plate?.url ? "result" : "3d"),
							className: "grid size-7 place-items-center rounded-full bg-[#efeeea] text-[#4d463c] hover:text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8eff3]",
							title: "Open Classic Full Stage View",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "size-3.5" })
						})
					]
				})]
			}) : null,
			resolvedContractOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				"data-testid": "design-contract-drawer",
				className: "arctic-glass-z2 grid gap-3 rounded-2xl p-3 text-xs md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
						children: [
							"Here is what I see (",
							designContract.rung.label,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-0.5 text-[11px] text-[#4d463c] dark:text-[#cfe3f0]",
						children: designContract.observedFacts.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", f] }, f))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
						children: "Detected Elements"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 flex flex-wrap gap-1",
						children: designContract.detectedObjects.map((obj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-[#d1c5b8]/50 bg-white/60 px-2 py-0.5 text-[10px] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
							children: obj
						}, obj))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
								children: "Hard Keep Clause"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => updateDesignContract({ lockedPreserve: !designContract.lockedPreserve }),
								className: "inline-flex items-center gap-1 rounded-full bg-[#c5a880]/20 px-2 py-0.5 text-[10px] font-semibold text-[#725b38] dark:bg-[#584411] dark:text-[#e8c98a]",
								children: [designContract.lockedPreserve ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-2.5" }), designContract.lockedPreserve ? "Locked" : "Editable"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: designContract.preserveClause,
							onChange: (e) => updateDesignContract({ preserveClause: e.target.value }),
							className: "h-8 rounded-xl border border-[#d1c5b8]/50 bg-white/80 px-2.5 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b]/80 dark:text-[#e8eff3]"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: containerRef,
				onPointerMove,
				onPointerUp: () => {
					draggingRef.current = false;
				},
				onPointerLeave: () => {
					draggingRef.current = false;
				},
				className: cn("relative flex flex-col overflow-hidden rounded-[22px] border border-[#d1c5b8]/50 bg-[#050f1b] shadow-[0_24px_60px_rgba(4,10,18,0.65)] md:flex-row dark:border-[#a9bdc9]/25", heroFit ? "min-h-[290px] flex-1 md:min-h-[280px]" : "min-h-[380px] md:h-[430px]"),
				children: [
					splitViewMode !== "ai-solo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: splitViewMode === "split" ? { flexBasis: `${splitRatio}%` } : { flexBasis: "100%" },
						className: "relative min-h-[230px] flex-1 overflow-hidden bg-[#050f1b]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-none absolute top-2 left-2 z-20 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/85 px-2 py-0.5 text-[9.5px] backdrop-blur-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold tracking-wider text-[#e8eff3]",
									children: "3D WIRE / CLAY"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden text-[#a9bdc9] sm:inline",
									children: ["• ", scene3d.preset.toUpperCase()]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-1 rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/85 px-2 py-0.5 text-[9.5px] text-[#cfe3f0] backdrop-blur-md 2xl:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-2.5 text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									scene3d.focalLength,
									"mm • ",
									scene3d.cameraPreset
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport3D, {
							aspect,
							compactSplit: true,
							onCaptureSnapshot: (dataUrl, goToSketch) => {
								setUpload(dataUrl);
								applyWorkflowPreset("clay-to-render");
								if (goToSketch) onOpenStage("sketch");
								else toast.success("3D view captured — ready to synthesize photoreal plate");
							},
							onCaptureChannels: (channels) => {
								if (!upload) setUpload(channels.clayUrl);
							}
						})]
					}) : null,
					splitViewMode === "split" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "separator",
						"aria-orientation": "vertical",
						"aria-label": "Resize 3D and AI split view",
						onPointerDown: () => {
							draggingRef.current = true;
						},
						className: "relative z-30 hidden w-2.5 shrink-0 cursor-col-resize items-center justify-center bg-[#202b38] transition hover:bg-[#cfe3f0]/40 md:flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-8 w-5 items-center justify-center rounded-full border border-[#a9bdc9]/35 bg-[#121c29] text-[#a9bdc9] shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-3" })
						})
					}) : null,
					splitViewMode !== "3d-solo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: splitViewMode === "split" ? { flexBasis: `${100 - splitRatio}%` } : { flexBasis: "100%" },
						onDragOver: (e) => {
							e.preventDefault();
							setDragActive(true);
						},
						onDragLeave: () => setDragActive(false),
						onDrop: (e) => {
							e.preventDefault();
							setDragActive(false);
							handleSceneUpload(e.dataTransfer.files?.[0]);
						},
						className: cn("relative min-h-[230px] flex-1 overflow-hidden bg-[#08131f]", dragActive ? "ring-2 ring-[#e8c98a] ring-inset" : ""),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: sceneFileRef,
								type: "file",
								accept: "image/jpeg,image/png,image/webp,.glb,.gltf,.obj,.fbx",
								"data-testid": "scene-upload-input",
								className: "sr-only",
								onChange: (event) => {
									handleSceneUpload(event.target.files?.[0]);
									event.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResilientPlateImage, {
								src: activeAiUrl,
								alt: plate?.idea || "Photorealistic Nordic architectural plate",
								busy,
								busyLabel: engine.outputMode === "grid-4" ? "Generating 4-Up concept variations…" : "Synthesizing photoreal architectural plate…",
								testId: "split-ai-canvas-img",
								className: "object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050f1b]/90 via-transparent to-[#050f1b]/55" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute top-2.5 right-2.5 left-2.5 z-10 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/80 px-2.5 py-1 backdrop-blur-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#e8c98a] shadow-[0_0_8px_#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-semibold uppercase tracking-wider text-[#e8eff3]",
										children: plate?.url ? "Live AI Diffusion" : upload ? "Uploaded Scene" : "Reference Preview"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pointer-events-auto flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"data-testid": "scene-upload-top-btn",
										onClick: () => sceneFileRef.current?.click(),
										title: "Upload photo or 3D GLB/OBJ directly into Scene",
										className: "inline-flex h-6.5 items-center gap-1 rounded-full border border-[#e8c98a]/45 bg-[#050f1b]/85 px-2.5 text-[10px] font-semibold text-[#e8c98a] backdrop-blur-xl transition hover:bg-[#e8c98a] hover:text-[#1b1407]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: upload ? "Replace" : "Upload" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "hidden rounded-full border border-[#a9bdc9]/25 bg-[#050f1b]/80 px-2.5 py-1 text-[10px] font-semibold text-[#cfe3f0] backdrop-blur-xl sm:inline",
										children: [
											budget.costMode === "free-only" ? "Free ₹0" : `${budget.costMode === "paise-eco" ? "1K Eco" : nanoBanana.resolution}`,
											" • ",
											frame.ratio
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-3 bottom-3 left-3 z-10 flex items-end justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e8c98a]",
										children: [
											design.look,
											" • ",
											design.light
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-[#e8eff3]",
										children: plate?.idea || idea || "Reflective fjord ice plinth • Warm refraction"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											"data-testid": "scene-upload-btn",
											onClick: () => sceneFileRef.current?.click(),
											title: "Upload photo, sketch, or 3D model into Scene",
											className: "inline-flex h-8 items-center gap-1 rounded-full border border-[#e8c98a]/50 bg-[#050f1b]/85 px-2.5 text-[10px] font-semibold text-[#e8c98a] backdrop-blur-md transition hover:bg-[#e8c98a] hover:text-[#1b1407]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3" }), " Upload"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => onOpenStage("mask"),
											className: "inline-flex h-8 items-center gap-1 rounded-full border border-[#a9bdc9]/35 bg-[#050f1b]/80 px-2.5 text-[10px] font-medium text-[#e8eff3] backdrop-blur-md hover:border-[#e8c98a]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-3 text-[#e8c98a]" }), " Inpaint"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: downloadAiSnapshot,
											"aria-label": "Download snapshot",
											className: "grid size-8 place-items-center rounded-full border border-[#a9bdc9]/35 bg-[#050f1b]/80 text-[#e8eff3] backdrop-blur-md hover:border-[#cfe3f0]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" })
										})
									]
								})]
							})
						]
					}) : null
				]
			}),
			showOpticsDock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadialOpticsDock, {}) : null
		]
	});
}
function RadialOpticsDock() {
	const radialOptics = useOriel((s) => s.radialOptics);
	const setRadialOptics = useOriel((s) => s.setRadialOptics);
	const setScene3DField = useOriel((s) => s.setScene3DField);
	const setEngineField = useOriel((s) => s.setEngineField);
	const idea = useOriel((s) => s.idea);
	const setIdea = useOriel((s) => s.setIdea);
	const { busy, generate } = useGenerate();
	const [quickPrompt, setQuickPrompt] = (0, import_react.useState)("");
	function applyQuickOpticsRender() {
		if (quickPrompt.trim()) {
			const base = idea.trim();
			setIdea(base ? `${base}, ${quickPrompt.trim()}` : quickPrompt.trim());
		}
		generate("plate");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "radial-optics-dock",
		className: "arctic-glass-z2 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7f766a] dark:text-[#a9bdc9]",
					children: "Radial Optics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid size-9 place-items-center rounded-full border border-[#a9bdc9]/30 bg-[#16202d] text-[#e8c98a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 36 36",
							className: "size-8 -rotate-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "18",
								cy: "18",
								r: "14",
								fill: "none",
								stroke: "rgba(169,189,201,0.22)",
								strokeWidth: "2.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "18",
								cy: "18",
								r: "14",
								fill: "none",
								stroke: "#e8c98a",
								strokeWidth: "2.5",
								strokeDasharray: "88",
								strokeDashoffset: 88 - Math.round(radialOptics.solarAzimuth / 360 * 88),
								strokeLinecap: "round"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "absolute size-3" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
						children: "Solar Azimuth"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-[11px] font-bold text-[#725b38] dark:text-[#e8c98a]",
							children: [
								radialOptics.solarAzimuth,
								"° • ",
								radialOptics.solarElevation,
								"°"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const nextAz = (radialOptics.solarAzimuth + 24) % 360;
								setRadialOptics({ solarAzimuth: nextAz });
								setScene3DField("sunAzimuth", nextAz);
							},
							className: "rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]",
							title: "Step solar angle",
							children: "+24°"
						})]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid size-9 place-items-center rounded-full border border-[#a9bdc9]/30 bg-[#16202d] text-[#cfe3f0]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 36 36",
							className: "size-8 -rotate-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "18",
								cy: "18",
								r: "14",
								fill: "none",
								stroke: "rgba(169,189,201,0.22)",
								strokeWidth: "2.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "18",
								cy: "18",
								r: "14",
								fill: "none",
								stroke: "#cfe3f0",
								strokeWidth: "2.5",
								strokeDasharray: "88",
								strokeDashoffset: Math.max(10, 68 - Math.round(radialOptics.exposureEv * 16)),
								strokeLinecap: "round"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[8px] font-bold",
							children: "EV"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
						children: "Exposure / Vig"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-[11px] font-bold text-[#4d463c] dark:text-[#cfe3f0]",
							children: [
								radialOptics.exposureEv >= 0 ? "+" : "",
								radialOptics.exposureEv.toFixed(1),
								" EV • ",
								radialOptics.vignettePct,
								"%"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const next = radialOptics.exposureEv >= 1.4 ? -.4 : Number((radialOptics.exposureEv + .3).toFixed(1));
								setRadialOptics({ exposureEv: next });
							},
							className: "rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]",
							title: "Cycle exposure compensation",
							children: "±EV"
						})]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid size-9 place-items-center rounded-full border border-[#a9bdc9]/30 bg-[#16202d] text-[#cde5ff]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 36 36",
							className: "size-8 -rotate-90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "18",
								cy: "18",
								r: "14",
								fill: "none",
								stroke: "rgba(169,189,201,0.22)",
								strokeWidth: "2.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "18",
								cy: "18",
								r: "14",
								fill: "none",
								stroke: "#cde5ff",
								strokeWidth: "2.5",
								strokeDasharray: "88",
								strokeDashoffset: 88 - Math.round(radialOptics.diffusionLock / 100 * 88),
								strokeLinecap: "round"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[8px] font-bold",
							children: radialOptics.diffusionLock
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]",
						children: "Diffusion Lock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-[11px] font-bold text-[#1b1c1a] dark:text-[#cde5ff]",
							children: [
								radialOptics.diffusionLock,
								"% ",
								radialOptics.diffusionLock >= 80 ? "Strict" : "Balanced"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const next = radialOptics.diffusionLock >= 92 ? 72 : 90;
								setRadialOptics({ diffusionLock: next });
								setEngineField("geometryLock", next);
							},
							className: "rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#cfe3f0]",
							children: "Toggle"
						})]
					})] })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 items-center justify-end gap-2 sm:max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "text",
				value: quickPrompt,
				onChange: (e) => setQuickPrompt(e.target.value),
				placeholder: "Golden hour mist + strict basalt slab plinth…",
				className: "h-8 min-w-0 flex-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-3 text-[11px] text-[#1b1c1a] outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/90 dark:text-[#e8eff3] dark:placeholder:text-[#5f7f98]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				disabled: busy,
				"data-testid": "optics-apply-btn",
				onClick: applyQuickOpticsRender,
				className: "ice-cta inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-3.5 text-[11px] font-bold disabled:opacity-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), busy ? "Rendering" : "Apply"]
			})]
		})]
	});
}
var CAMERA_PRESET_CYCLE = [
	{
		id: "eye",
		label: "Eye-Level"
	},
	{
		id: "oblique",
		label: "3/4 Oblique"
	},
	{
		id: "aerial",
		label: "Aerial"
	},
	{
		id: "detail",
		label: "Close Detail"
	}
];
function CameraOpticsBar() {
	const scene3d = useOriel((s) => s.scene3d);
	const setScene3DField = useOriel((s) => s.setScene3DField);
	const radialOptics = useOriel((s) => s.radialOptics);
	const setRadialOptics = useOriel((s) => s.setRadialOptics);
	const setEngineField = useOriel((s) => s.setEngineField);
	const frame = useOriel((s) => s.frame);
	const setFrame = useOriel((s) => s.setFrame);
	const nanoBanana = useOriel((s) => s.nanoBanana);
	const updateNanoBanana = useOriel((s) => s.updateNanoBanana);
	const currentCamIdx = CAMERA_PRESET_CYCLE.findIndex((p) => p.id === scene3d.cameraPreset);
	const currentCam = CAMERA_PRESET_CYCLE[currentCamIdx >= 0 ? currentCamIdx : 0];
	const nextCam = CAMERA_PRESET_CYCLE[(Math.max(0, currentCamIdx) + 1) % CAMERA_PRESET_CYCLE.length];
	const currentRatioIdx = RATIOS.indexOf(frame.ratio);
	const nextRatio = RATIOS[(Math.max(0, currentRatioIdx) + 1) % RATIOS.length];
	const currentModelIdx = NANO_BANANA_MODEL_OPTIONS.findIndex((m) => m.key === nanoBanana.requestedModel);
	const currentModel = NANO_BANANA_MODEL_OPTIONS[currentModelIdx >= 0 ? currentModelIdx : 0];
	const nextModel = NANO_BANANA_MODEL_OPTIONS[(Math.max(0, currentModelIdx) + 1) % NANO_BANANA_MODEL_OPTIONS.length];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "camera-optics-bar",
		className: "arctic-glass no-scrollbar flex shrink-0 items-center justify-between gap-1.5 overflow-x-auto rounded-lg border border-[#d1c5b8]/45 px-2 py-0.5 text-[10px] dark:border-[#a9bdc9]/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[#725b38] dark:text-[#e8c98a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden xl:inline",
						children: "Optics"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "inline-flex items-center gap-0.5 rounded-full border border-[#d1c5b8]/45 bg-[#efeeea]/85 p-0.5 dark:border-[#a9bdc9]/20 dark:bg-[#121c29]",
					role: "group",
					"aria-label": "Lens focal length",
					children: [
						24,
						35,
						50,
						85
					].map((mm) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-testid": `optics-lens-${mm}`,
						"aria-pressed": scene3d.focalLength === mm,
						onClick: () => {
							setScene3DField("focalLength", mm);
							toast.success(`Lens set to ${mm}mm`);
						},
						className: cn("h-5 rounded-full px-1.5 font-mono text-[9px] font-semibold transition", scene3d.focalLength === mm ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
						children: [mm, "mm"]
					}, mm))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "optics-camera-preset-btn",
					onClick: () => {
						setScene3DField("cameraPreset", nextCam.id);
						toast.success(`Camera angle: ${nextCam.label}`);
					},
					title: "Cycle camera angle preset",
					className: "inline-flex h-5.5 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/45 bg-white/75 px-1.5 text-[9.5px] font-medium text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8eff3] dark:hover:border-[#e8c98a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#7f766a] dark:text-[#a9bdc9]",
						children: "View:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: currentCam.label
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "optics-tilt-btn",
					"aria-pressed": scene3d.twoPointTilt,
					onClick: () => setScene3DField("twoPointTilt", !scene3d.twoPointTilt),
					title: "Toggle 2-point architectural vertical shift",
					className: cn("inline-flex h-5.5 shrink-0 items-center rounded-full border px-1.5 font-mono text-[9px] font-semibold transition", scene3d.twoPointTilt ? "border-[#c5a880] bg-[#c5a880]/20 text-[#513d1d] dark:border-[#e8c98a]/50 dark:bg-[#584411]/45 dark:text-[#e8c98a]" : "border-[#d1c5b8]/45 bg-white/70 text-[#4d463c] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#a9bdc9]"),
					children: "2-Pt"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 items-center gap-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "optics-solar-btn",
					onClick: () => {
						const nextAz = (radialOptics.solarAzimuth + 24) % 360;
						setRadialOptics({ solarAzimuth: nextAz });
						setScene3DField("sunAzimuth", nextAz);
					},
					title: "Step solar azimuth (+24°)",
					className: "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8c98a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						radialOptics.solarAzimuth,
						"°·",
						radialOptics.solarElevation,
						"°"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "optics-ev-btn",
					onClick: () => {
						const next = radialOptics.exposureEv >= 1.4 ? -.4 : Number((radialOptics.exposureEv + .3).toFixed(1));
						setRadialOptics({ exposureEv: next });
					},
					title: "Cycle exposure compensation",
					className: "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#cfe3f0]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						radialOptics.exposureEv >= 0 ? "+" : "",
						radialOptics.exposureEv.toFixed(1),
						" EV"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "opacity-65",
						children: [
							"· ",
							radialOptics.vignettePct,
							"%"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"data-testid": "optics-lock-btn",
					onClick: () => {
						const next = radialOptics.diffusionLock >= 92 ? 72 : 90;
						setRadialOptics({ diffusionLock: next });
						setEngineField("geometryLock", next);
					},
					title: "Toggle diffusion geometry lock (Strict / Balanced)",
					className: cn("inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 font-mono text-[10px] font-semibold transition", radialOptics.diffusionLock >= 80 ? "border-[#c5a880]/60 bg-[#c5a880]/15 text-[#513d1d] dark:border-[#cfe3f0]/35 dark:bg-[#202b38] dark:text-[#cde5ff]" : "border-[#d1c5b8]/45 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#a9bdc9]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						radialOptics.diffusionLock,
						"% ",
						radialOptics.diffusionLock >= 80 ? "Strict" : "Bal"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "optics-ratio-btn",
					onClick: () => setFrame({
						...frame,
						ratio: nextRatio
					}),
					title: "Cycle viewport aspect ratio",
					className: "inline-flex h-6 shrink-0 items-center rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] font-semibold text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8eff3]",
					children: frame.ratio
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "optics-res-btn",
					onClick: () => {
						const budgetState = useOriel.getState().budget;
						const nextRes = nanoBanana.resolution === "1K" ? "2K" : nanoBanana.resolution === "2K" ? "4K" : "1K";
						updateNanoBanana({ resolution: nextRes });
						setFrame({
							...frame,
							resolution: nextRes === "1K" ? "1k" : "2k"
						});
						if (budgetState.costMode === "paise-eco" && nextRes !== "1K") toast.message("Paise Eco guard active — live renders clamp to 1K (≤85p). Open ₹100 Cap to unlock 2K/4K.");
					},
					title: "Cycle output resolution (1K Eco / 2K / 4K)",
					className: "inline-flex h-6 shrink-0 items-center rounded-full border border-[#d1c5b8]/45 bg-white/75 px-2 font-mono text-[10px] font-semibold text-[#725b38] transition hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#16202d] dark:text-[#e8c98a]",
					children: nanoBanana.resolution
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-testid": "optics-nb-model-btn",
					onClick: () => {
						updateNanoBanana({ requestedModel: nextModel.key });
						toast.success(`Engine: ${nextModel.label}`);
					},
					onContextMenu: (e) => {
						e.preventDefault();
						window.dispatchEvent(new CustomEvent("oriel-open-orchestrator"));
					},
					title: `${currentModel.label} — click to cycle Nano Banana model`,
					className: "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-[#c5a880]/55 bg-[#c5a880]/15 px-2 font-mono text-[10px] font-semibold text-[#513d1d] transition hover:border-[#725b38] dark:border-[#e8c98a]/35 dark:bg-[#16314A]/65 dark:text-[#e8c98a]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentModel.shortLabel })
				})
			]
		})]
	});
}
function Mas2dStudioBar({ onOpenStage }) {
	const design = useOriel((s) => s.design);
	const idea = useOriel((s) => s.idea);
	const setIdea = useOriel((s) => s.setIdea);
	const setDesignField = useOriel((s) => s.setDesignField);
	const [mode, setMode] = (0, import_react.useState)("edit");
	const [drawer, setDrawer] = (0, import_react.useState)("none");
	const filteredMaterials = (0, import_react.useMemo)(() => PRD_MATERIAL_PALETTE.filter((m) => m.space === design.vertical || drawer === "materials").slice(0, 12), [design.vertical, drawer]);
	const filteredLights = (0, import_react.useMemo)(() => PRD_LIGHT_PALETTE.filter((l) => l.space === design.vertical || l.space === "exterior"), [design.vertical]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "mas2d-studio-bar",
		className: "arctic-glass flex flex-col gap-2 rounded-2xl p-2.5 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-[#c5a880]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#725b38] dark:bg-[#202b38] dark:text-[#e8c98a]",
						children: "MAS 2D Studio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-0.5 rounded-full bg-[#efeeea]/85 p-0.5 dark:bg-[#121c29]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode("edit");
								onOpenStage("mask");
							},
							className: cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition", mode === "edit" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] dark:text-[#a9bdc9]"),
							children: "Edit Mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode("compose");
								onOpenStage("sketch");
							},
							className: cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition", mode === "compose" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] dark:text-[#a9bdc9]"),
							children: "Compose Board"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "mas2d-materials-btn",
							onClick: () => setDrawer(drawer === "materials" ? "none" : "materials"),
							className: cn("inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium transition", drawer === "materials" ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Material Palette (CC0)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"data-testid": "mas2d-lights-btn",
							onClick: () => setDrawer(drawer === "lights" ? "none" : "lights"),
							className: cn("inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium transition", drawer === "lights" ? "border-[#725b38] bg-[#c5a880]/25 text-[#1b1c1a] dark:border-[#e8c98a] dark:text-[#e8c98a]" : "border-[#d1c5b8]/55 bg-white/75 text-[#4d463c] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Light Palette (IES)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onOpenStage("sam2"),
							className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/75 px-2.5 text-[10px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#cfe3f0]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Cutout & Pen"]
						})
					]
				})]
			}),
			drawer === "materials" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1.5 sm:grid-cols-4",
				children: filteredMaterials.slice(0, 8).map((mat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setIdea(appendSuggestionToIdea(idea, mat.fragment));
						toast.success(`Injected ${mat.name} (${mat.source} ${mat.licence})`);
					},
					className: "flex items-center gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-2 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-6 shrink-0 rounded-lg border border-black/15 shadow-xs",
						style: { backgroundColor: mat.hex }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[10px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
							children: mat.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]",
							children: [
								mat.scaleMeters,
								" · ",
								mat.licence
							]
						})]
					})]
				}, mat.id))
			}) : null,
			drawer === "lights" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1.5 sm:grid-cols-4",
				children: filteredLights.slice(0, 8).map((lp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setIdea(appendSuggestionToIdea(idea, lp.fragment));
						setDesignField("light", lp.lightField);
						toast.success(`Applied ${lp.name} (${lp.kelvin}K · ${lp.iesProfile})`);
					},
					className: "flex flex-col gap-0.5 rounded-xl border border-[#d1c5b8]/45 bg-white/75 p-2 text-left transition hover:border-[#725b38] dark:border-[#43474b]/60 dark:bg-[#16202d]/85 dark:hover:border-[#e8c98a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-[10px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
							children: lp.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "shrink-0 font-mono text-[9px] text-[#725b38] dark:text-[#e8c98a]",
							children: [lp.kelvin, "K"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-[9px] text-[#7f766a] dark:text-[#a9bdc9]",
						children: lp.iesProfile
					})]
				}, lp.id))
			}) : null
		]
	});
}
var AUTO_CAMERAS = [
	{
		id: "hero",
		label: "Hero 3/4",
		fov: 35,
		preset: "oblique",
		role: "orbit",
		pos: [
			14,
			9,
			14
		],
		target: [
			0,
			2,
			0
		]
	},
	{
		id: "eye",
		label: "Eye Level 1.6m",
		fov: 50,
		preset: "eye",
		role: "dolly",
		pos: [
			10,
			1.6,
			12
		],
		target: [
			0,
			2.2,
			0
		]
	},
	{
		id: "ortho",
		label: "Drone Oblique",
		fov: 35,
		preset: "aerial",
		role: "orbit",
		pos: [
			20,
			18,
			20
		],
		target: [
			0,
			1,
			0
		]
	},
	{
		id: "corner",
		label: "Closeup Material",
		fov: 85,
		preset: "detail",
		role: "zoom",
		pos: [
			6,
			3.2,
			7
		],
		target: [
			0,
			2,
			0
		]
	}
];
function Sam3dExtrasBar({ onOpenStage }) {
	const setScene3DField = useOriel((s) => s.setScene3DField);
	const upsertCameraKeyframe = useOriel((s) => s.upsertCameraKeyframe);
	const cameraKeyframes = useOriel((s) => s.cameraKeyframes);
	const updateDesignContract = useOriel((s) => s.updateDesignContract);
	const { busy, generate } = useGenerate();
	const [cadOpen, setCadOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "arctic-glass flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-1.5 text-[11px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
					children: [
						"Camera Board (",
						cameraKeyframes.length,
						"/6)"
					]
				}), AUTO_CAMERAS.map((cam) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setScene3DField("cameraPreset", cam.preset);
						upsertCameraKeyframe({
							id: `cam-${cam.id}`,
							label: cam.label,
							role: cam.role,
							pos: cam.pos,
							target: cam.target,
							focalLength: cam.fov
						});
						toast.success(`Camera pinned: ${cam.label} (${cam.fov}mm)`);
					},
					className: "inline-flex h-6 items-center gap-1 rounded-full bg-[#efeeea]/85 px-2 text-[10px] font-medium text-[#1b1c1a] hover:bg-[#c5a880]/25 dark:bg-[#202b38] dark:text-[#cfe3f0] dark:hover:border-[#e8c98a]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-2.5 text-[#725b38] dark:text-[#e8c98a]" }), cam.label]
				}, cam.id))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setCadOpen((v) => !v),
					className: "inline-flex h-6 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white/80 px-2.5 text-[10px] font-medium text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#16202d] dark:text-[#e8eff3]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " CAD / Plan Intake"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void generate("plate"),
					className: "inline-flex h-6 items-center gap-1 rounded-full bg-[#c5a880] px-2.5 text-[10px] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), " Render Angle"]
				})]
			})]
		}), cadOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "arctic-glass-z2 flex flex-wrap items-center justify-between gap-2 rounded-2xl p-2.5 text-[11px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
					children: "CAD / 2D Plan Intake Checklist (DWG · DXF · PDF · PNG)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-[#4d463c] dark:text-[#a9bdc9]",
					children: "Wall scale calibrated (100px = 1.0m) · Ceiling height 2.9m · Openings locked to Plan Layer"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						updateDesignContract({ inputClass: "floor-plan" });
						onOpenStage("cv");
						toast.success("Opened Plan Line Extraction & Extrusion");
					},
					className: "rounded-full border border-[#d1c5b8]/55 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
					children: "Extract Lines"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						updateDesignContract({ inputClass: "floor-plan" });
						onOpenStage("3d");
						toast.success("Extruded floor plan walls into live 3D massing");
					},
					className: "ice-cta rounded-full px-3 py-1 text-[10px] font-bold",
					children: "Extrude to 3D Massing"
				})]
			})]
		}) : null]
	});
}
var HOTSPOT_TYPES = [
	{
		id: "navigation",
		label: "Navigation"
	},
	{
		id: "info",
		label: "Info Callout"
	},
	{
		id: "media",
		label: "Image/Video"
	},
	{
		id: "3d-object",
		label: "3D Object"
	},
	{
		id: "plan-jump",
		label: "Floor-Plan Jump"
	},
	{
		id: "unit",
		label: "Unit Card"
	},
	{
		id: "map",
		label: "Map & Routes"
	},
	{
		id: "document",
		label: "Brochure PDF"
	},
	{
		id: "product",
		label: "Shoppable Spec"
	},
	{
		id: "audio",
		label: "Spatial Audio"
	},
	{
		id: "lead",
		label: "Lead Capture"
	}
];
function King360StudioPanel({ aspect, onOpenStage }) {
	const tourConfig = useOriel((s) => s.tourConfig);
	const updateTourConfig = useOriel((s) => s.updateTourConfig);
	const addTourHotspot = useOriel((s) => s.addTourHotspot);
	const updateUnitStatus = useOriel((s) => s.updateUnitStatus);
	const plate = useOriel((s) => s.plate);
	const upload = useOriel((s) => s.upload);
	const [tab, setTab] = (0, import_react.useState)("grade");
	const [unitFilter, setUnitFilter] = (0, import_react.useState)("all");
	const [hsType, setHsType] = (0, import_react.useState)("info");
	const [hsLabel, setHsLabel] = (0, import_react.useState)("Fjord Timber Reveal");
	const [tourPrompt, setTourPrompt] = (0, import_react.useState)("Start at Harbor Arrival Deck -> Enter Fjord Living Pavilion -> Highlight Unit 3B panoramic corner.");
	const activeScene = tourConfig.scenes.find((sc) => sc.id === tourConfig.activeSceneId) ?? tourConfig.scenes[0];
	const panoUrl = plate?.url || activeScene?.imageUrl || upload || "/viz/p01-pavilion-dusk.jpg";
	const visibleUnits = (0, import_react.useMemo)(() => tourConfig.units.filter((u) => unitFilter === "all" || u.status === unitFilter), [tourConfig.units, unitFilter]);
	const cssFilter = `brightness(${1 + tourConfig.exposure * .04}) contrast(${1 + tourConfig.contrast * .03}) saturate(${1 + tourConfig.saturation * .05}) sepia(${tourConfig.lutPreset === "Nordic Warm" ? .16 : 0})`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "king-360-studio",
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arctic-glass flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-[#c5a880]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#725b38] dark:bg-[#202b38] dark:text-[#e8c98a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3" }), " KING 360 Studio"]
					}), tourConfig.scenes.map((sc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => updateTourConfig({ activeSceneId: sc.id }),
						className: cn("rounded-full px-2.5 py-1 text-[10px] font-medium transition", sc.id === activeScene?.id ? "bg-[#c5a880] font-semibold text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea]/80 text-[#4d463c] dark:bg-[#16202d] dark:text-[#a9bdc9]"),
						children: sc.label
					}, sc.id))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1",
					children: [
						"grade",
						"hotspots",
						"inventory",
						"publish"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(t),
						className: cn("rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize transition", tab === t ? "bg-[#1b1c1a] text-white dark:bg-[#e8c98a] dark:text-[#261a00]" : "text-[#4d463c] hover:text-[#1b1c1a] dark:text-[#a9bdc9] dark:hover:text-[#e8eff3]"),
						children: t
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-2xl border border-[#d1c5b8]/45 dark:border-[#a9bdc9]/25",
				style: { filter: cssFilter },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanoramaViewer, {
					imageUrl: panoUrl,
					aspect
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto absolute right-3 bottom-12 z-20 w-32 rounded-xl border border-[#a9bdc9]/35 bg-[#08131f]/85 p-2 text-[9px] text-[#e8eff3] backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex items-center justify-between text-[#e8c98a]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MINI-MAP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: activeScene?.level })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative h-16 w-full rounded-lg border border-[#a9bdc9]/20 bg-[#121c29]",
						children: tourConfig.scenes.map((sc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: sc.label,
							onClick: () => updateTourConfig({ activeSceneId: sc.id }),
							style: {
								left: `${sc.mapX}%`,
								top: `${sc.mapY}%`
							},
							className: cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition", sc.id === activeScene?.id ? "size-3 bg-[#e8c98a] ring-4 ring-[#e8c98a]/30" : "size-2 bg-[#cfe3f0]/70 hover:scale-125")
						}, sc.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "arctic-glass-z2 rounded-2xl p-3 text-xs",
				children: tab === "grade" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
									children: "Color & Day/Night Grade"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-2 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Exposure (",
										tourConfig.exposure,
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -6,
										max: 6,
										value: tourConfig.exposure,
										onChange: (e) => updateTourConfig({ exposure: Number(e.target.value) }),
										className: "w-28 accent-[#c5a880] dark:accent-[#cfe3f0]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-2 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Contrast (",
										tourConfig.contrast,
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -6,
										max: 10,
										value: tourConfig.contrast,
										onChange: (e) => updateTourConfig({ contrast: Number(e.target.value) }),
										className: "w-28 accent-[#c5a880] dark:accent-[#cfe3f0]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center justify-between gap-2 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Saturation (",
										tourConfig.saturation,
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: -8,
										max: 8,
										value: tourConfig.saturation,
										onChange: (e) => updateTourConfig({ saturation: Number(e.target.value) }),
										className: "w-28 accent-[#c5a880] dark:accent-[#cfe3f0]"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
									children: "LUT & Day/Night Pair"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1",
									children: [
										"Arctic Glass",
										"Neutral",
										"Nordic Warm",
										"Editorial Film"
									].map((lut) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => updateTourConfig({ lutPreset: lut }),
										className: cn("rounded-full px-2.5 py-1 text-[10px] font-medium", tourConfig.lutPreset === lut ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea] text-[#4d463c] dark:bg-[#202b38] dark:text-[#a9bdc9]"),
										children: lut
									}, lut))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => updateTourConfig({ dayNightMode: tourConfig.dayNightMode === "day" ? "dusk" : "day" }),
										className: "rounded-full border border-[#d1c5b8]/55 px-3 py-1 text-[10px] font-semibold dark:border-[#a9bdc9]/30 dark:text-[#e8eff3]",
										children: ["Sky Mode: ", tourConfig.dayNightMode.toUpperCase()]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => updateTourConfig({ nadirLogoPatch: !tourConfig.nadirLogoPatch }),
										className: "rounded-full border border-[#d1c5b8]/55 px-3 py-1 text-[10px] font-semibold dark:border-[#a9bdc9]/30 dark:text-[#e8eff3]",
										children: ["Nadir Cap: ", tourConfig.nadirLogoPatch ? "ON" : "OFF"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col justify-between gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
									children: "Seam-Aware 360° Region Edit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-[#4d463c] dark:text-[#a9bdc9]",
									children: "Unwraps the active 180°/360° seam region cleanly into MAS 2D Inpaint without polar pinch."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										onOpenStage("mask");
										toast.success("Opened active equirectangular region in Inpaint workspace");
									},
									className: "ice-cta inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-3.5" }), " Edit Panorama Region in 2D"]
								})
							]
						})
					]
				}) : tab === "hotspots" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: hsType,
								onChange: (e) => setHsType(e.target.value),
								className: "h-8 rounded-xl border border-[#d1c5b8]/55 bg-white px-2.5 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/30 dark:bg-[#121c29] dark:text-[#e8eff3]",
								children: HOTSPOT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.id,
									children: t.label
								}, t.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: hsLabel,
								onChange: (e) => setHsLabel(e.target.value),
								placeholder: "Hotspot label…",
								className: "h-8 flex-1 rounded-xl border border-[#d1c5b8]/55 bg-white px-3 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/30 dark:bg-[#121c29] dark:text-[#e8eff3]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									addTourHotspot({
										sceneId: activeScene?.id ?? "sc-arrival",
										type: hsType,
										label: hsLabel.trim() || "New Hotspot",
										yaw: Math.round((Math.random() - .5) * 140),
										pitch: -4,
										detail: `${hsType} pin anchored in ${activeScene?.label ?? "Scene"}`
									});
									toast.success(`Added ${hsType} hotspot to ${activeScene?.label}`);
								},
								className: "ice-cta inline-flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Drop Pin"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-1.5 sm:grid-cols-2",
						children: tourConfig.hotspots.map((hs) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/70 px-2.5 py-1.5 dark:border-[#43474b]/60 dark:bg-[#16202d]/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-1.5 rounded bg-[#efeeea] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#725b38] dark:bg-[#2b3643] dark:text-[#e8c98a]",
										children: hs.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
										children: hs.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
										children: hs.detail
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 shrink-0 text-[#725b38] dark:text-[#e8c98a]" })]
						}, hs.id))
					})]
				}) : tab === "inventory" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
							children: [
								"Real-Estate Unit Inventory (",
								visibleUnits.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: [
								"all",
								"available",
								"reserved",
								"sold"
							].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setUnitFilter(st),
								className: cn("rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize", unitFilter === st ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea] text-[#4d463c] dark:bg-[#202b38] dark:text-[#a9bdc9]"),
								children: st
							}, st))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-1.5 sm:grid-cols-2",
						children: visibleUnits.map((unit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/70 p-2 dark:border-[#43474b]/60 dark:bg-[#16202d]/85",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
								children: [
									"Unit ",
									unit.unitCode,
									" · ",
									unit.type,
									" (",
									unit.areaSqm,
									" m²)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
								children: [
									"Floor ",
									unit.floor,
									" · ",
									unit.orientation,
									" · ",
									unit.priceLabel
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: unit.status,
									onChange: (e) => updateUnitStatus(unit.id, e.target.value),
									className: "rounded-full border border-[#d1c5b8]/55 bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8c98a]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "available",
											children: "Available"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "reserved",
											children: "Reserved"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sold",
											children: "Sold"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateTourConfig({ activeSceneId: unit.sceneId }),
									className: "rounded-full bg-[#c5a880]/25 px-2 py-0.5 text-[10px] font-semibold text-[#513d1d] dark:bg-[#cfe3f0] dark:text-[#08131f]",
									children: "Visit"
								})]
							})]
						}, unit.id))
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]",
								children: [
									"Tour Sentence Editor & Theme (",
									tourConfig.theme,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 2,
								value: tourPrompt,
								onChange: (e) => setTourPrompt(e.target.value),
								className: "w-full rounded-xl border border-[#d1c5b8]/55 bg-white p-2 text-[11px] text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b]/85 dark:text-[#e8eff3]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: [
									"ultra-luxury",
									"minimal",
									"developer-sales",
									"hospitality"
								].map((th) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => updateTourConfig({ theme: th }),
									className: cn("rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize", tourConfig.theme === th ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "bg-[#efeeea] text-[#4d463c] dark:bg-[#202b38] dark:text-[#a9bdc9]"),
									children: th
								}, th))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col justify-between gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/60 p-2.5 dark:border-[#43474b]/60 dark:bg-[#16202d]/75",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold text-[#1b1c1a] dark:text-[#e8eff3]",
								children: [
									"/",
									tourConfig.slug,
									" (v",
									tourConfig.publishedVersion,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] text-[#7f766a] dark:text-[#a9bdc9]",
								children: [
									"Access: ",
									tourConfig.accessMode,
									" · Mobile VR + Web Share Ready"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-7 text-[#725b38] dark:text-[#e8c98a]" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								updateTourConfig({ publishedVersion: tourConfig.publishedVersion + 1 });
								navigator.clipboard?.writeText(`${window.location.origin}/?tour=${tourConfig.slug}`);
								toast.success(`Published Tour v${tourConfig.publishedVersion + 1} & copied share link`);
							},
							className: "ice-cta inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Publish & Copy Tour Link"]
						})]
					})]
				})
			})
		]
	});
}
function KumVideoStudioPanel() {
	const videoProject = useOriel((s) => s.videoProject);
	const updateVideoProject = useOriel((s) => s.updateVideoProject);
	const addClipToKumVideo = useOriel((s) => s.addClipToKumVideo);
	const removeClipFromKumVideo = useOriel((s) => s.removeClipFromKumVideo);
	const plate = useOriel((s) => s.plate);
	const design = useOriel((s) => s.design);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [playheadSec, setPlayheadSec] = (0, import_react.useState)(0);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const videoClips = (0, import_react.useMemo)(() => videoProject.clips.filter((c) => c.track === "video"), [videoProject.clips]);
	const totalSec = (0, import_react.useMemo)(() => Math.max(8, videoClips.reduce((acc, c) => Math.max(acc, c.startSec + c.durationSec), 0)), [videoClips]);
	const activeClip = (0, import_react.useMemo)(() => videoClips.find((c) => playheadSec >= c.startSec && playheadSec < c.startSec + c.durationSec) ?? videoClips[0], [videoClips, playheadSec]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		const id = window.setInterval(() => {
			setPlayheadSec((prev) => {
				const next = prev + .1;
				return next >= totalSec ? 0 : Number(next.toFixed(1));
			});
		}, 100);
		return () => window.clearInterval(id);
	}, [playing, totalSec]);
	const progressWithinClip = activeClip ? Math.max(0, Math.min(1, (playheadSec - activeClip.startSec) / Math.max(1, activeClip.durationSec))) : 0;
	const kenBurnsScale = activeClip?.cameraMove === "dolly-in" ? 1 + progressWithinClip * .12 : activeClip?.cameraMove === "rise" ? 1.08 - progressWithinClip * .06 : 1.04;
	const kenBurnsX = activeClip?.cameraMove === "pan" ? (progressWithinClip - .5) * 28 : 0;
	async function handleExportTimeline() {
		setExporting(true);
		try {
			const payload = {
				exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
				project: `${design.look} Film Edit`,
				settings: {
					aspect: videoProject.aspect,
					fps: videoProject.fps,
					resolution: videoProject.resolution,
					codec: videoProject.codec,
					lut: videoProject.lut,
					musicTrack: videoProject.musicTrack
				},
				durationSec: totalSec,
				clips: videoProject.clips
			};
			const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `oriel-kum-video-timeline-${videoProject.aspect.replace(":", "x")}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success(`Exported KUM Video Director bundle (${videoProject.resolution} · ${videoProject.aspect})`);
		} finally {
			setExporting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "kum-video-studio",
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "arctic-glass flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-[#c5a880]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#725b38] dark:bg-[#202b38] dark:text-[#e8c98a]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "size-3" }), " KUM Video Studio"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 rounded-full bg-[#efeeea]/85 p-0.5 dark:bg-[#121c29]",
							children: [
								"16:9",
								"9:16",
								"1:1",
								"4:5"
							].map((ar) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => updateVideoProject({ aspect: ar }),
								className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", videoProject.aspect === ar ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "text-[#4d463c] dark:text-[#a9bdc9]"),
								children: ar
							}, ar))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: videoProject.lut,
							onChange: (e) => updateVideoProject({ lut: e.target.value }),
							className: "h-7 rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/30 dark:bg-[#202b38] dark:text-[#e8eff3]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Arctic Glass",
									children: "LUT: Arctic Glass"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Filmic Warm",
									children: "LUT: Filmic Warm"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Neutral",
									children: "LUT: Neutral"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Twilight Gold",
									children: "LUT: Twilight Gold"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [plate?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							addClipToKumVideo({
								track: "video",
								label: `Active Plate (${design.look})`,
								imageUrl: plate.url,
								durationSec: 5,
								cameraMove: "dolly-in",
								transition: "cross-dissolve"
							});
							toast.success("Appended active plate to Video Track");
						},
						className: "inline-flex h-7 items-center gap-1 rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 text-[10px] font-semibold text-[#1b1c1a] dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8eff3]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 text-[#725b38] dark:text-[#e8c98a]" }), " Add Active Plate"]
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: exporting,
						onClick: () => void handleExportTimeline(),
						className: "ice-cta inline-flex h-7 items-center gap-1 rounded-full px-3 text-[10px] font-bold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3" }),
							" Export ",
							videoProject.resolution,
							" MP4 Spec"
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-[#d1c5b8]/45 bg-[#050f1b] dark:border-[#a9bdc9]/25",
				children: [
					activeClip?.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: activeClip.imageUrl,
						alt: activeClip.label,
						style: {
							transform: `scale(${kenBurnsScale.toFixed(3)}) translateX(${kenBurnsX.toFixed(1)}px)`,
							transition: "transform 120ms linear"
						},
						className: "h-full w-full object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050f1b]/85 via-transparent to-[#050f1b]/35" }),
					videoProject.captionsEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute top-4 left-4 rounded-xl border border-[#e8c98a]/35 bg-[#08131f]/75 px-3 py-1.5 backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs font-medium tracking-wider text-[#e8eff3] uppercase",
							children: activeClip?.label ?? "Establishing Shot"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-[#e8c98a]",
							children: [
								activeClip?.cameraMove,
								" · ",
								videoProject.fps,
								"fps · ",
								videoProject.lut
							]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full border border-[#a9bdc9]/30 bg-[#08131f]/85 px-3 py-1.5 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPlaying((v) => !v),
								className: "grid size-7 shrink-0 place-items-center rounded-full bg-[#cfe3f0] text-[#08131f]",
								"aria-label": playing ? "Pause preview" : "Play preview",
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: totalSec,
								step: .1,
								value: playheadSec,
								onChange: (e) => setPlayheadSec(Number(e.target.value)),
								className: "h-1 flex-1 accent-[#e8c98a]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-[10px] tabular-nums text-[#e8eff3]",
								children: [
									playheadSec.toFixed(1),
									"s / ",
									totalSec.toFixed(0),
									"s"
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "arctic-glass-z2 space-y-1.5 rounded-2xl p-3 text-[10px]",
				children: [
					"video",
					"title",
					"audio",
					"fx"
				].map((trackName) => {
					const items = videoProject.clips.filter((c) => c.track === trackName);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-12 shrink-0 font-mono text-[9px] font-bold uppercase text-[#725b38] dark:text-[#e8c98a]",
							children: trackName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto rounded-xl bg-[#efeeea]/80 p-1 dark:bg-[#050f1b]/75",
							children: items.map((clip) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setPlayheadSec(clip.startSec),
								className: cn("flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1 transition", activeClip?.id === clip.id ? "border-[#e8c98a] bg-[#c5a880]/25 text-[#1b1c1a] dark:bg-[#202b38] dark:text-[#e8eff3]" : "border-[#d1c5b8]/45 bg-white/80 text-[#4d463c] dark:border-[#43474b]/50 dark:bg-[#16202d] dark:text-[#a9bdc9]"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-2.5 text-[#725b38] dark:text-[#e8c98a]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "max-w-[140px] truncate font-medium",
										children: clip.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-[9px] opacity-75",
										children: [clip.durationSec, "s"]
									}),
									trackName === "video" && items.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: (e) => {
											e.stopPropagation();
											removeClipFromKumVideo(clip.id);
										},
										"aria-label": `Remove ${clip.label}`,
										className: "text-rose-500 hover:opacity-80",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-2.5" })
									}) : null
								]
							}, clip.id))
						})]
					}, trackName);
				})
			})
		]
	});
}
export { RadialOpticsDock as a, SplitViewportStage as c, Mas2dStudioBar as i, Viewport3D as l, King360StudioPanel as n, ResilientPlateImage as o, KumVideoStudioPanel as r, Sam3dExtrasBar as s, CameraOpticsBar as t };
