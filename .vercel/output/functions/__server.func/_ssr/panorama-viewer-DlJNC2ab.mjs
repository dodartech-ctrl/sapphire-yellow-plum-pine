import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { in as Compass, n as ZoomOut, qt as Eye, t as ZoomIn } from "../_libs/lucide-react.mjs";
import { E as MeshBasicMaterial, F as SRGBColorSpace, I as Scene, L as SphereGeometry, R as TextureLoader, T as Mesh, a as OrbitControls, c as WebGLRenderer, j as PerspectiveCamera } from "../_libs/three.mjs";
// node_modules/.nitro/vite/services/ssr/assets/panorama-viewer-DlJNC2ab.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function PanoramaViewer({ imageUrl, aspect = "16 / 9" }) {
	const mountRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const requestRenderRef = (0, import_react.useRef)(() => void 0);
	const [fov, setFov] = (0, import_react.useState)(72);
	const [contextLost, setContextLost] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const container = mountRef.current;
		if (!container) return;
		const width = Math.max(320, container.clientWidth || 880);
		const height = Math.max(240, container.clientHeight || 420);
		let renderer;
		try {
			renderer = new WebGLRenderer({
				antialias: true,
				powerPreference: "high-performance"
			});
		} catch {
			setContextLost(true);
			return;
		}
		const gl = renderer.getContext();
		const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
		const rendererStr = debugInfo ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? "") : "";
		const isSoftwareGl = /SwiftShader|llvmpipe|Software Rasterizer/i.test(rendererStr);
		renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
		renderer.setSize(width, height);
		renderer.outputColorSpace = SRGBColorSpace;
		const canvas = renderer.domElement;
		canvas.style.display = "block";
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		container.innerHTML = "";
		container.appendChild(canvas);
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
		const camera = new PerspectiveCamera(72, width / height, .1, 100);
		camera.position.set(0, 0, .1);
		cameraRef.current = camera;
		const controls = new OrbitControls(camera, canvas);
		controls.enableZoom = false;
		controls.enablePan = false;
		controls.enableDamping = !isSoftwareGl;
		controls.dampingFactor = .06;
		controls.rotateSpeed = -.35;
		controls.target.set(0, 0, 0);
		controls.update();
		const sphereGeo = new SphereGeometry(40, 48, 32);
		sphereGeo.scale(-1, 1, 1);
		const texture = new TextureLoader().load(imageUrl, () => {
			texture.colorSpace = SRGBColorSpace;
			texture.needsUpdate = true;
			requestRender();
		});
		const sphereMat = new MeshBasicMaterial({ map: texture });
		const sphere = new Mesh(sphereGeo, sphereMat);
		scene.add(sphere);
		const afterDraw = makeAfterDraw(gl, isSoftwareGl);
		let renderBusy = false;
		let renderDirty = false;
		let disposed = false;
		let rafId = 0;
		const drawTick = () => {
			if (disposed) return;
			renderBusy = true;
			renderDirty = false;
			const moved = controls.update();
			renderer.render(scene, camera);
			afterDraw(() => {
				renderBusy = false;
				if (!disposed && (renderDirty || !isSoftwareGl && moved)) requestRender();
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
		controls.addEventListener("change", requestRender);
		requestRender();
		const resizeObs = new ResizeObserver((entries) => {
			const rect = entries[0]?.contentRect;
			if (!rect || rect.width < 10 || rect.height < 10) return;
			camera.aspect = rect.width / rect.height;
			camera.updateProjectionMatrix();
			renderer.setSize(rect.width, rect.height);
			requestRender();
		});
		resizeObs.observe(container);
		return () => {
			disposed = true;
			resizeObs.disconnect();
			controls.removeEventListener("change", requestRender);
			canvas.removeEventListener("webglcontextlost", handleLost);
			canvas.removeEventListener("webglcontextrestored", handleRestored);
			if (rafId) cancelAnimationFrame(rafId);
			controls.dispose();
			sphereGeo.dispose();
			sphereMat.dispose();
			texture.dispose();
			renderer.dispose();
			cameraRef.current = null;
		};
	}, [imageUrl]);
	(0, import_react.useEffect)(() => {
		const cam = cameraRef.current;
		if (!cam) return;
		cam.fov = fov;
		cam.updateProjectionMatrix();
		requestRenderRef.current();
	}, [fov]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-testid": "panorama-360-viewer",
		className: "relative w-full overflow-hidden bg-[#14110f]",
		style: {
			aspectRatio: aspect,
			minHeight: "340px",
			maxHeight: "62vh"
		},
		children: [
			contextLost ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center text-[#f6efe4]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-7 text-[#d4b06a]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-base font-semibold",
					children: "360° Panorama paused"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: mountRef,
				className: "h-full w-full cursor-grab active:cursor-grabbing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#14110f] px-3 py-1 text-[11px] font-medium text-[#e7c27a] shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3.5" }), " 360° Equirectangular Panorama · Drag to look around"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 bottom-3 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-[#14110f] p-1 text-xs text-[#f6efe4] shadow-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFov((v) => Math.max(38, v - 10)),
						"aria-label": "Zoom in panorama",
						className: "grid size-7 place-items-center rounded-full hover:bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "size-3.5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "px-1.5 font-mono text-[10px] tabular-nums",
						children: [fov, "°"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFov((v) => Math.min(100, v + 10)),
						"aria-label": "Zoom out panorama",
						className: "grid size-7 place-items-center rounded-full hover:bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "size-3.5" })
					})
				]
			})
		]
	});
}
export { PanoramaViewer as t };
