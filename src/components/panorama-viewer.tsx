import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Compass, Eye, ZoomIn, ZoomOut } from "lucide-react";

type PanoramaViewerProps = {
  imageUrl: string;
  aspect?: string;
};

function makeAfterDraw(gl: WebGLRenderingContext | WebGL2RenderingContext, isSoftwareGl: boolean) {
  const gl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext ? gl : null;
  if (!isSoftwareGl || !gl2) {
    return (done: () => void) => requestAnimationFrame(done);
  }
  return (done: () => void) => {
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
      if (
        status === gl2.ALREADY_SIGNALED ||
        status === gl2.CONDITION_SATISFIED ||
        status === gl2.WAIT_FAILED ||
        polls >= 6
      ) {
        gl2.deleteSync(sync);
        done();
      } else {
        setTimeout(poll, 16);
      }
    };
    setTimeout(poll, 0);
  };
}

export function PanoramaViewer({ imageUrl, aspect = "16 / 9" }: PanoramaViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const requestRenderRef = useRef<() => void>(() => undefined);
  const [fov, setFov] = useState(72);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(320, container.clientWidth || 880);
    const height = Math.max(240, container.clientHeight || 420);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.innerHTML = "";
    container.appendChild(canvas);

    const handleLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const handleRestored = () => {
      setContextLost(false);
      requestRenderRef.current();
    };
    canvas.addEventListener("webglcontextlost", handleLost);
    canvas.addEventListener("webglcontextrestored", handleRestored);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 100);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = -0.35;
    controls.target.set(0, 0, 0);
    controls.update();

    const sphereGeo = new THREE.SphereGeometry(40, 48, 32);
    sphereGeo.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageUrl, () => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      requestRender();
    });
    const sphereMat = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
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
        if (!disposed && (renderDirty || (!isSoftwareGl && moved))) {
          requestRender();
        }
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

  useEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    cam.fov = fov;
    cam.updateProjectionMatrix();
    requestRenderRef.current();
  }, [fov]);

  return (
    <div
      data-testid="panorama-360-viewer"
      className="relative w-full overflow-hidden bg-[#14110f]"
      style={{ aspectRatio: aspect, minHeight: "340px", maxHeight: "62vh" }}
    >
      {contextLost ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 text-center text-[#f6efe4]">
          <Eye className="size-7 text-[#d4b06a]" />
          <p className="font-serif text-base font-semibold">360° Panorama paused</p>
        </div>
      ) : (
        <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      )}

      <div className="pointer-events-none absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#14110f] px-3 py-1 text-[11px] font-medium text-[#e7c27a] shadow-md">
        <Compass className="size-3.5" /> 360° Equirectangular Panorama · Drag to look around
      </div>

      <div className="absolute right-3 bottom-3 z-20 flex items-center gap-1 rounded-full border border-white/15 bg-[#14110f] p-1 text-xs text-[#f6efe4] shadow-md">
        <button
          type="button"
          onClick={() => setFov((v) => Math.max(38, v - 10))}
          aria-label="Zoom in panorama"
          className="grid size-7 place-items-center rounded-full hover:bg-white/10"
        >
          <ZoomIn className="size-3.5" />
        </button>
        <span className="px-1.5 font-mono text-[10px] tabular-nums">{fov}°</span>
        <button
          type="button"
          onClick={() => setFov((v) => Math.min(100, v + 10))}
          aria-label="Zoom out panorama"
          className="grid size-7 place-items-center rounded-full hover:bg-white/10"
        >
          <ZoomOut className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
