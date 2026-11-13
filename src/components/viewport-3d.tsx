import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { computeSolarPositionFromGeo, interpolateCameraKeyframes } from "@/lib/archviz-suite";
import {
  CAMERA_PRESETS_3D,
  D5_LIGHT_PRESETS,
  EXTENDED_PBR_PRESETS,
  FOCAL_LENGTHS,
  HDRI_MOODS,
  SCENE3D_MATERIALS,
  SCENE3D_PRESETS,
  computeSunPosition,
  focalLengthToFov,
  type CameraPreset3D,
  type D5LightPreset,
  type ExtendedPbrPresetId,
  type HdriMood,
} from "@/lib/engines";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  CAMERA_VIEWS,
  MATERIAL_SPECS,
  applyCameraLensShift,
  buildFloorPlanExtrusionGroup,
  buildPresetMassing,
  buildTreeCluster,
  createProceduralHdriTexture,
  createSharedSceneMaterials,
  disposeObjectGeometries,
  disposeSharedSceneMaterials,
  exportThreeRenderChannels,
  normalizeAndGroundObject,
  type SharedSceneMaterials,
} from "@/lib/viewport-3d-scene";
import {
  Box,
  Camera,
  ChevronDown,
  ChevronUp,
  Film,
  Globe,
  Layers,
  Move3d,
  Palette,
  Play,
  Plus,
  RotateCcw,
  Sun,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { toast } from "sonner";

type Viewport3DProps = {
  aspect: string;
  onCaptureSnapshot: (dataUrl: string, goToSketch?: boolean) => void;
  onCaptureDepthPass?: (dataUrl: string) => void;
  onCaptureChannels?: (channels: { depthUrl: string; normalUrl: string; clayUrl: string }) => void;
};

type CameraTransition = {
  pos: THREE.Vector3;
  target: THREE.Vector3;
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

function tagPickableMeshes(group: THREE.Object3D, fallbackPrefix: string) {
  let idx = 0;
  group.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      idx += 1;
      if (!mesh.userData.pickLabel) {
        mesh.userData.pickLabel = mesh.name?.trim() || `${fallbackPrefix} Part #${idx}`;
      }
    }
  });
}

export function Viewport3D({ aspect, onCaptureSnapshot, onCaptureDepthPass, onCaptureChannels }: Viewport3DProps) {
  const scene3d = useOriel((state) => state.scene3d);
  const setScene3DField = useOriel((state) => state.setScene3DField);
  const floorPlanBlueprint = useOriel((state) => state.floorPlanBlueprint);
  const cameraKeyframes = useOriel((state) => state.cameraKeyframes);
  const addCameraKeyframe = useOriel((state) => state.addCameraKeyframe);
  const removeCameraKeyframe = useOriel((state) => state.removeCameraKeyframe);
  const clearCameraKeyframes = useOriel((state) => state.clearCameraKeyframes);
  const setConditioningChannel = useOriel((state) => state.setConditioningChannel);

  const [hudOpen, setHudOpen] = useState(true);
  const [rigTab, setRigTab] = useState<"model" | "lighting" | "keyframes">("model");
  const [mountReady, setMountReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);
  const [playingPath, setPlayingPath] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const cadInputRef = useRef<HTMLInputElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sunRef = useRef<THREE.DirectionalLight | null>(null);
  const rimRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiRef = useRef<THREE.HemisphereLight | null>(null);
  const materialsRef = useRef<SharedSceneMaterials | null>(null);
  const massingGroupRef = useRef<THREE.Group | null>(null);
  const customCadGroupRef = useRef<THREE.Group | null>(null);
  const customMatPoolRef = useRef<THREE.Material[]>([]);
  const selectedMeshRef = useRef<THREE.Mesh | null>(null);
  const envTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const requestRenderRef = useRef<() => void>(() => undefined);
  const isSoftwareGlRef = useRef(false);
  const camTransitionRef = useRef<CameraTransition | null>(null);
  const lastCamPresetRef = useRef<CameraPreset3D>(scene3d.cameraPreset);
  const pointerDownPtRef = useRef<{ x: number; y: number } | null>(null);
  const transformRef = useRef({ rotY: scene3d.modelRotationY, scale: scene3d.modelScale, elev: scene3d.modelElevation });
  transformRef.current = { rotY: scene3d.modelRotationY, scale: scene3d.modelScale, elev: scene3d.modelElevation };
  const pickModeRef = useRef(scene3d.materialPickMode);
  pickModeRef.current = scene3d.materialPickMode;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(320, container.clientWidth || 960);
    const height = Math.max(240, container.clientHeight || 420);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = scene3d.exposure;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.innerHTML = "";
    container.appendChild(canvas);
    rendererRef.current = renderer;

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
    sceneRef.current = scene;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    envTargetRef.current = envTarget;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(focalLengthToFov(scene3d.focalLength), width / height, 0.1, 240);
    const camInit = CAMERA_VIEWS[scene3d.cameraPreset];
    camera.position.set(...camInit.pos);
    applyCameraLensShift(camera, width, height, scene3d.twoPointTilt, scene3d.verticalShift);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(...camInit.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 4;
    controls.maxDistance = 45;
    controls.update();
    controlsRef.current = controls;

    const maxAnisotropy = isSoftwareGl ? 1 : renderer.capabilities.getMaxAnisotropy();
    const mats = createSharedSceneMaterials(scene3d.primaryMaterial, maxAnisotropy);
    materialsRef.current = mats;

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), mats.groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(48, 24, 0xb8aa95, 0xcac0af);
    grid.position.y = 0.015;
    scene.add(grid);

    const contextTrees = new THREE.Group();
    for (const [tx, tz, ts] of [
      [-9.8, -6.2, 1.15],
      [-10.6, 2.4, 0.92],
      [9.6, -4.8, 1.08],
      [11.0, 4.6, 0.88],
    ] as const) {
      contextTrees.add(buildTreeCluster(tx, tz, ts, mats));
    }
    scene.add(contextTrees);

    const initialMassing =
      scene3d.preset === "plan-extrude" && floorPlanBlueprint
        ? buildFloorPlanExtrusionGroup(floorPlanBlueprint.walls, mats)
        : buildPresetMassing(scene3d.preset === "custom-cad" || scene3d.preset === "plan-extrude" ? "pavilion" : scene3d.preset, mats);
    tagPickableMeshes(initialMassing, "Architecture");
    massingGroupRef.current = initialMassing;
    scene.add(initialMassing);

    const sunSpec = computeSunPosition(scene3d.sunAzimuth, scene3d.sunElevation);
    const hemi = new THREE.HemisphereLight(sunSpec.skyHex, 0x6f6353, sunSpec.ambientIntensity);
    hemiRef.current = hemi;
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(sunSpec.sunHex, sunSpec.sunIntensity);
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
      sun.shadow.bias = -0.0005;
    }
    sunRef.current = sun;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0xc8d8ec, 0.42);
    rim.position.set(-sunSpec.x * 0.7, Math.max(8, sunSpec.y * 0.6), -sunSpec.z * 0.7);
    rimRef.current = rim;
    scene.add(rim);

    scene.background = new THREE.Color(sunSpec.skyHex);
    scene.fog = new THREE.FogExp2(sunSpec.skyHex, (scene3d.fogDensity / 100) * 0.025);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycaster mesh surface picker (#5)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPtRef.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerUp = (e: PointerEvent) => {
      const start = pointerDownPtRef.current;
      pointerDownPtRef.current = null;
      if (!pickModeRef.current || !start || !massingGroupRef.current) return;
      const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      if (dist > 6) return;
      const rect = canvas.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(massingGroupRef.current.children, true);
      const hitMesh = hits.find((h) => (h.object as THREE.Mesh).isMesh)?.object as THREE.Mesh | undefined;
      if (hitMesh) {
        selectedMeshRef.current = hitMesh;
        const label = String(hitMesh.userData.pickLabel || hitMesh.name || "Selected Surface");
        setSelectedPartName(label);
        toast.success(`Selected "${label}" — pick a PBR swatch below`);
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
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const transition = camTransitionRef.current;
      let stillAnimating = false;
      if (transition) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, transition.pos.x, 8, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, transition.pos.y, 8, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, transition.pos.z, 8, dt);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, transition.target.x, 8, dt);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, transition.target.y, 8, dt);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, transition.target.z, 8, dt);

        if (
          camera.position.distanceToSquared(transition.pos) < 0.002 &&
          controls.target.distanceToSquared(transition.target) < 0.002
        ) {
          camera.position.copy(transition.pos);
          controls.target.copy(transition.target);
          camTransitionRef.current = null;
        } else {
          stillAnimating = true;
        }
      }

      const dampingMoved = controls.update();
      renderer.render(scene, camera);

      afterDraw(() => {
        renderBusy = false;
        if (!disposed && (renderDirty || stillAnimating || (!isSoftwareGl && dampingMoved))) {
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
      controls.dispose();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync HDRI Sky Reflection environment via PMREMGenerator (#4)
  useEffect(() => {
    if (!mountReady) return;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    if (!renderer || !scene) return;
    const hdriTex = createProceduralHdriTexture(scene3d.hdriMood);
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const nextEnv = pmrem.fromEquirectangular(hdriTex);
    const prevEnv = envTargetRef.current;
    scene.environment = nextEnv.texture;
    envTargetRef.current = nextEnv;
    prevEnv?.dispose();
    hdriTex.dispose();
    pmrem.dispose();
    requestRenderRef.current();
  }, [mountReady, scene3d.hdriMood]);

  // Sync materials, solar geolocation, lens shift, fog, exposure, camera preset
  useEffect(() => {
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

    const sunAz = scene3d.sunAzimuth;
    const sunEl = scene3d.sunElevation;
    const sunSpec = computeSunPosition(sunAz, sunEl);
    sun.position.set(sunSpec.x, sunSpec.y, sunSpec.z);
    sun.color.set(sunSpec.sunHex);
    sun.intensity = sunSpec.sunIntensity;

    rim.position.set(-sunSpec.x * 0.7, Math.max(8, sunSpec.y * 0.6), -sunSpec.z * 0.7);
    rim.intensity = sunEl <= 12 ? 0.62 : 0.42;

    hemi.color.set(sunSpec.skyHex);
    hemi.intensity = sunSpec.ambientIntensity;
    mats.interiorGlowMat.emissiveIntensity = sunEl <= 12 ? 1.45 : sunEl < 22 ? 0.85 : 0.42;

    scene.background = new THREE.Color(sunSpec.skyHex);
    scene.fog = new THREE.FogExp2(sunSpec.skyHex, (scene3d.fogDensity / 100) * 0.025);

    const massing = massingGroupRef.current;
    if (massing) {
      massing.rotation.y = (scene3d.modelRotationY * Math.PI) / 180;
      massing.scale.setScalar(scene3d.modelScale);
      massing.position.y = scene3d.modelElevation;
    }

    renderer.toneMappingExposure = scene3d.exposure;

    const nextFov = focalLengthToFov(scene3d.focalLength);
    camera.fov = nextFov;
    const size = renderer.getSize(new THREE.Vector2());
    applyCameraLensShift(camera, size.x, size.y, scene3d.twoPointTilt, scene3d.verticalShift);
    camera.updateProjectionMatrix();

    if (lastCamPresetRef.current !== scene3d.cameraPreset) {
      lastCamPresetRef.current = scene3d.cameraPreset;
      const view = CAMERA_VIEWS[scene3d.cameraPreset];
      const prefersReducedMotion =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isSoftwareGlRef.current || prefersReducedMotion) {
        camera.position.set(...view.pos);
        controls.target.set(...view.target);
        controls.update();
      } else {
        camTransitionRef.current = {
          pos: new THREE.Vector3(...view.pos),
          target: new THREE.Vector3(...view.target),
        };
      }
    }

    requestRenderRef.current();
  }, [
    mountReady,
    scene3d.primaryMaterial,
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
    scene3d.verticalShift,
  ]);

  // Swap massing model geometry cleanly (presets, floorplan extrusion, or custom CAD)
  useEffect(() => {
    if (!mountReady) return;
    const scene = sceneRef.current;
    const oldMassing = massingGroupRef.current;
    const mats = materialsRef.current;
    if (!scene || !mats) return;

    if (scene3d.preset === "custom-cad" && customCadGroupRef.current) {
      if (oldMassing && oldMassing !== customCadGroupRef.current) {
        scene.remove(oldMassing);
        disposeObjectGeometries(oldMassing);
      }
      const next = customCadGroupRef.current;
      next.rotation.y = (transformRef.current.rotY * Math.PI) / 180;
      next.scale.setScalar(transformRef.current.scale);
      next.position.y = transformRef.current.elev;
      massingGroupRef.current = next;
      if (!scene.children.includes(next)) scene.add(next);
      requestRenderRef.current();
      return;
    }

    if (oldMassing) {
      scene.remove(oldMassing);
      if (oldMassing !== customCadGroupRef.current) {
        disposeObjectGeometries(oldMassing);
      }
    }

    const next =
      scene3d.preset === "plan-extrude"
        ? buildFloorPlanExtrusionGroup(
            floorPlanBlueprint?.walls ?? [
              { id: "n", x: 0, z: -4, width: 12, depth: 0.3, height: 3.1 },
              { id: "w", x: -5.85, z: 0, width: 0.3, depth: 8, height: 3.1 },
              { id: "e", x: 5.85, z: 0, width: 0.3, depth: 8, height: 3.1 },
              { id: "div", x: -1.2, z: -0.5, width: 0.24, depth: 6, height: 3.1 },
            ],
            mats,
          )
        : buildPresetMassing(scene3d.preset, mats);
    tagPickableMeshes(next, scene3d.preset === "plan-extrude" ? "Plan Wall" : "Architecture");
    next.rotation.y = (transformRef.current.rotY * Math.PI) / 180;
    next.scale.setScalar(transformRef.current.scale);
    next.position.y = transformRef.current.elev;
    massingGroupRef.current = next;
    selectedMeshRef.current = null;
    setSelectedPartName(null);
    scene.add(next);
    requestRenderRef.current();
  }, [mountReady, scene3d.preset, floorPlanBlueprint]);

  async function loadCadFile(file: File | undefined) {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const scene = sceneRef.current;
    if (!scene) return;
    const objectUrl = URL.createObjectURL(file);
    try {
      let loadedRoot: THREE.Object3D;
      if (ext === "glb" || ext === "gltf") {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(objectUrl);
        loadedRoot = gltf.scene;
      } else if (ext === "obj") {
        const loader = new OBJLoader();
        const text = await file.text();
        loadedRoot = loader.parse(text);
      } else if (ext === "fbx") {
        const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader.js");
        const loader = new FBXLoader();
        loadedRoot = await loader.loadAsync(objectUrl);
      } else {
        toast.error("Unsupported 3D format. Use .glb, .gltf, .obj, or .fbx.");
        return;
      }

      const wrapper = new THREE.Group();
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

  function handleCadInput(e: ChangeEvent<HTMLInputElement>) {
    void loadCadFile(e.target.files?.[0]);
    e.target.value = "";
  }

  function handleCadDrop(e: DragEvent<HTMLDivElement>) {
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (["glb", "gltf", "obj", "fbx"].includes(ext)) {
      e.preventDefault();
      void loadCadFile(file);
    }
  }

  function applyPbrSwatchToSelected(presetId: ExtendedPbrPresetId) {
    const targetMesh = selectedMeshRef.current;
    if (!targetMesh) {
      toast.message("Enable Pick Material and click a surface in the 3D viewport first.");
      return;
    }
    const spec = EXTENDED_PBR_PRESETS.find((p) => p.id === presetId);
    if (!spec) return;
    const mat = new THREE.MeshPhysicalMaterial({
      color: spec.color,
      roughness: spec.roughness,
      metalness: spec.metalness,
      clearcoat: spec.clearcoat ?? 0,
      transparent: spec.transparent ?? false,
      opacity: spec.opacity ?? 1,
    });
    customMatPoolRef.current.push(mat);
    targetMesh.material = mat;
    requestRenderRef.current();
    toast.success(`Applied ${spec.label} to "${selectedPartName}"`);
  }

  function applyGeoSolar(lat: number, month: number, hour: number) {
    const geo = computeSolarPositionFromGeo(lat, month, hour);
    setScene3DField("geoEnabled", true);
    setScene3DField("geoLatitude", lat);
    setScene3DField("geoMonth", month);
    setScene3DField("geoHour", hour);
    setScene3DField("sunAzimuth", geo.azimuthDeg);
    setScene3DField("sunElevation", geo.elevationDeg);
  }

  function capture(goToSketch = false) {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL("image/jpeg", 0.92);
    onCaptureSnapshot(dataUrl, goToSketch);
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

  function captureCurrentKeyframe() {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    addCameraKeyframe({
      id: `kf-${Date.now()}`,
      label: `KF #${cameraKeyframes.length + 1} (${scene3d.focalLength}mm)`,
      pos: [Number(camera.position.x.toFixed(2)), Number(camera.position.y.toFixed(2)), Number(camera.position.z.toFixed(2))],
      target: [Number(controls.target.x.toFixed(2)), Number(controls.target.y.toFixed(2)), Number(controls.target.z.toFixed(2))],
      focalLength: scene3d.focalLength,
    });
    toast.success(`Saved camera keyframe #${cameraKeyframes.length + 1}`);
  }

  function playFlythrough(recordWebm = false) {
    if (cameraKeyframes.length < 2) {
      toast.message("Add at least 2 camera keyframes to preview or export a flythrough.");
      return;
    }
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!renderer || !scene || !camera || !controls) return;

    const canvas = renderer.domElement;
    let recorder: MediaRecorder | null = null;
    const chunks: BlobPart[] = [];

    if (recordWebm) {
      if (typeof canvas.captureStream !== "function" || typeof MediaRecorder === "undefined") {
        toast.message("WebM captureStream is unavailable in this browser; playing interactive preview instead.");
      } else {
        try {
          const stream = canvas.captureStream(24);
          recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : undefined });
          recorder.ondataavailable = (ev) => {
            if (ev.data.size > 0) chunks.push(ev.data);
          };
          recorder.onstop = () => {
            setRecordingVideo(false);
            if (chunks.length > 0) {
              const blob = new Blob(chunks, { type: "video/webm" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `oriel-flythrough-${Date.now()}.webm`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.success("Downloaded camera flythrough (.webm)");
            }
          };
          recorder.start();
          setRecordingVideo(true);
        } catch {
          recorder = null;
        }
      }
    }

    setPlayingPath(true);
    const durationMs = 2600;
    const startMs = performance.now();

    const step = () => {
      const elapsed = performance.now() - startMs;
      const tNorm = Math.min(1, elapsed / durationMs);
      const frame = interpolateCameraKeyframes(cameraKeyframes, tNorm);
      if (frame) {
        camera.position.set(...frame.pos);
        controls.target.set(...frame.target);
        camera.fov = focalLengthToFov(frame.focalLength);
        camera.updateProjectionMatrix();
        controls.update();
        renderer.render(scene, camera);
      }
      if (tNorm < 1) {
        requestAnimationFrame(step);
      } else {
        setPlayingPath(false);
        if (recorder && recorder.state === "recording") recorder.stop();
      }
    };
    requestAnimationFrame(step);
  }

  function applyD5Preset(presetId: D5LightPreset) {
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

  return (
    <div
      data-testid="viewport-3d"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleCadDrop}
      className="w-full overflow-hidden bg-[#181613]"
    >
      {/* Dedicated Unobstructed 3D WebGL Canvas Area */}
      <div
        className="relative w-full overflow-hidden bg-[#181613]"
        style={{ aspectRatio: aspect, minHeight: "300px", maxHeight: "52vh" }}
      >
        {contextLost ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#1c1915] px-6 text-center text-[#f6efe4]">
            <Box className="size-8 text-[#d4b06a]" />
            <p className="font-serif text-base font-semibold">3D WebGL context paused</p>
            <p className="max-w-sm text-xs text-[#cbbba6]">
              Your browser suspended WebGL acceleration. Switch to Sketch or Upload a reference image, or reload the view.
            </p>
          </div>
        ) : (
          <div
            ref={mountRef}
            className={cn(
              "h-full w-full",
              scene3d.materialPickMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing",
            )}
          />
        )}

        <input ref={cadInputRef} type="file" accept=".glb,.gltf,.obj,.fbx" className="sr-only" onChange={handleCadInput} />

        {/* Discrete top-right toggle */}
        <button
          type="button"
          onClick={() => setHudOpen((v) => !v)}
          className="absolute top-3 right-3 z-20 inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-white/15 bg-[#14110f] px-3 text-[11px] font-medium text-[#f6efe4] shadow-md hover:border-[#d4b06a] hover:text-[#e7c27a]"
          aria-expanded={hudOpen}
          aria-label={hudOpen ? "Collapse 3D rig controls" : "Expand 3D rig controls"}
        >
          {hudOpen ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
          <span>{hudOpen ? "Hide Rig" : "3D Rig"}</span>
        </button>
      </div>

      {/* Collapsible D5 Render-Style Model, Lighting & Keyframe Shelf */}
      {hudOpen ? (
        <div className="border-t border-white/10 bg-[#14110f] px-3.5 py-3 text-xs text-[#f6efe4]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/5 p-0.5">
                <button
                  type="button"
                  onClick={() => setRigTab("model")}
                  className={cn(
                    "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium",
                    rigTab === "model" ? "gold-fill text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white",
                  )}
                >
                  <Move3d className="size-3" /> Massing &amp; CAD
                </button>
                <button
                  type="button"
                  onClick={() => setRigTab("lighting")}
                  className={cn(
                    "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium",
                    rigTab === "lighting" ? "gold-fill text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white",
                  )}
                >
                  <Sun className="size-3" /> Sun &amp; Lens
                </button>
                <button
                  type="button"
                  onClick={() => setRigTab("keyframes")}
                  className={cn(
                    "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium",
                    rigTab === "keyframes" ? "gold-fill text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white",
                  )}
                >
                  <Film className="size-3" /> Keyframes ({cameraKeyframes.length})
                </button>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-white/5 p-0.5">
                {CAMERA_PRESETS_3D.map((cam) => (
                  <button
                    key={cam.id}
                    type="button"
                    onClick={() => setScene3DField("cameraPreset", cam.id)}
                    className={cn(
                      "h-7 shrink-0 whitespace-nowrap rounded-full px-2.5 text-[11px]",
                      scene3d.cameraPreset === cam.id ? "gold-fill font-medium text-[#2a1c0c]" : "text-[#e4dacb] hover:text-white",
                    )}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={captureChannels}
                className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]"
              >
                <Layers className="size-3 text-[#e7c27a]" /> Depth / Normal / Clay
              </button>
              <button
                type="button"
                onClick={() => capture(true)}
                className="h-8 shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]"
              >
                Snapshot → Sketch
              </button>
              <button
                type="button"
                onClick={() => capture(false)}
                className="gold-fill inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c]"
              >
                <Camera className="size-3.5" />
                Capture 3D
              </button>
            </div>
          </div>

          {rigTab === "model" ? (
            <div className="mt-2.5 space-y-2.5 border-t border-white/10 pt-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#b9aa95]">Massing</span>
                  {SCENE3D_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setScene3DField("preset", p.id)}
                      className={cn(
                        "h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                        scene3d.preset === p.id
                          ? "gold-fill border-transparent font-medium text-[#2a1c0c]"
                          : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                  {floorPlanBlueprint ? (
                    <button
                      type="button"
                      onClick={() => setScene3DField("preset", "plan-extrude")}
                      className={cn(
                        "h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                        scene3d.preset === "plan-extrude"
                          ? "gold-fill border-transparent font-medium text-[#2a1c0c]"
                          : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                      )}
                    >
                      Plan Extrude
                    </button>
                  ) : null}
                  {scene3d.customModelName ? (
                    <button
                      type="button"
                      onClick={() => setScene3DField("preset", "custom-cad")}
                      className={cn(
                        "h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                        scene3d.preset === "custom-cad"
                          ? "gold-fill border-transparent font-medium text-[#2a1c0c]"
                          : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                      )}
                    >
                      {scene3d.customModelName}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => cadInputRef.current?.click()}
                    className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]"
                  >
                    <Upload className="size-3 text-[#e7c27a]" /> Upload .glb/.obj/.fbx
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="hidden text-[10px] uppercase tracking-wider text-[#b9aa95] sm:inline">Base</span>
                  {SCENE3D_MATERIALS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      title={m.label}
                      aria-label={m.label}
                      onClick={() => setScene3DField("primaryMaterial", m.id)}
                      className={cn(
                        "size-5 rounded-full border transition",
                        scene3d.primaryMaterial === m.id ? "scale-110 border-[#e7c27a] ring-2 ring-[#e7c27a]/60" : "border-white/25",
                      )}
                      style={{ backgroundColor: m.swatch }}
                    />
                  ))}
                </div>
              </div>

              {/* Raycaster PBR Surface Material Picker (#5) */}
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
                <button
                  type="button"
                  aria-pressed={scene3d.materialPickMode}
                  onClick={() => setScene3DField("materialPickMode", !scene3d.materialPickMode)}
                  className={cn(
                    "inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 text-[11px] font-medium",
                    scene3d.materialPickMode
                      ? "gold-fill border-transparent text-[#2a1c0c]"
                      : "border-white/20 bg-black/30 text-[#e4dacb]",
                  )}
                >
                  <Palette className="size-3" /> {scene3d.materialPickMode ? "Picker Active" : "Pick Material"}
                </button>
                <span className="text-[11px] text-[#cbbba6]">
                  {selectedPartName ? `Target: ${selectedPartName}` : "Click any mesh in 3D to assign PBR finish:"}
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {EXTENDED_PBR_PRESETS.map((pbr) => (
                    <button
                      key={pbr.id}
                      type="button"
                      onClick={() => applyPbrSwatchToSelected(pbr.id)}
                      title={pbr.label}
                      className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border border-white/15 bg-black/30 px-2 text-[10px] text-[#f6efe4] hover:border-[#d4b06a]"
                    >
                      <span className="size-2.5 rounded-full border border-white/30" style={{ backgroundColor: pbr.hex }} />
                      {pbr.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex min-w-[130px] flex-1 items-center gap-2">
                  <span className="shrink-0 text-[11px] text-[#cbbba6]">Rotate Y</span>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={scene3d.modelRotationY}
                    onChange={(e) => setScene3DField("modelRotationY", Number(e.target.value))}
                    className="h-1.5 w-full accent-[#d4b06a]"
                  />
                  <span className="w-9 shrink-0 text-right font-mono text-[10px] tabular-nums">{scene3d.modelRotationY}°</span>
                </label>

                <label className="flex min-w-[120px] flex-1 items-center gap-2">
                  <span className="shrink-0 text-[11px] text-[#cbbba6]">Scale</span>
                  <input
                    type="range"
                    min={0.6}
                    max={1.5}
                    step={0.05}
                    value={scene3d.modelScale}
                    onChange={(e) => setScene3DField("modelScale", Number(e.target.value))}
                    className="h-1.5 w-full accent-[#d4b06a]"
                  />
                  <span className="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums">{scene3d.modelScale.toFixed(2)}×</span>
                </label>

                <label className="flex min-w-[120px] flex-1 items-center gap-2">
                  <span className="shrink-0 text-[11px] text-[#cbbba6]">Lift</span>
                  <input
                    type="range"
                    min={0}
                    max={2.5}
                    step={0.1}
                    value={scene3d.modelElevation}
                    onChange={(e) => setScene3DField("modelElevation", Number(e.target.value))}
                    className="h-1.5 w-full accent-[#d4b06a]"
                  />
                  <span className="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums">{scene3d.modelElevation.toFixed(1)}m</span>
                </label>

                <button
                  type="button"
                  onClick={resetModelTransform}
                  className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] hover:text-white"
                  aria-label="Reset 3D model transform"
                >
                  <RotateCcw className="size-3" /> Reset
                </button>
              </div>
            </div>
          ) : rigTab === "lighting" ? (
            <div className="mt-2.5 space-y-2.5 border-t border-white/10 pt-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#b9aa95]">Atmosphere</span>
                  {D5_LIGHT_PRESETS.map((lp) => (
                    <button
                      key={lp.id}
                      type="button"
                      onClick={() => applyD5Preset(lp.id)}
                      className={cn(
                        "h-7 shrink-0 whitespace-nowrap rounded-full border px-2.5 text-[11px]",
                        scene3d.d5LightPreset === lp.id && !scene3d.geoEnabled
                          ? "gold-fill border-transparent font-medium text-[#2a1c0c]"
                          : "border-white/15 bg-white/5 text-[#e4dacb] hover:border-[#d4b06a]",
                      )}
                    >
                      {lp.label}
                    </button>
                  ))}
                  <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wider text-[#b9aa95]">HDRI</span>
                  {HDRI_MOODS.map((hm) => (
                    <button
                      key={hm.id}
                      type="button"
                      onClick={() => setScene3DField("hdriMood", hm.id as HdriMood)}
                      className={cn(
                        "h-7 shrink-0 whitespace-nowrap rounded-full border px-2 text-[10px]",
                        scene3d.hdriMood === hm.id
                          ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]"
                          : "border-white/15 bg-white/5 text-[#cbbba6]",
                      )}
                    >
                      {hm.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-pressed={scene3d.twoPointTilt}
                    onClick={() => setScene3DField("twoPointTilt", !scene3d.twoPointTilt)}
                    className={cn(
                      "h-6 shrink-0 rounded-full border px-2 text-[10px] font-medium",
                      scene3d.twoPointTilt ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/15 text-[#cbbba6]",
                    )}
                  >
                    2-Pt Tilt
                  </button>
                  <div className="flex items-center gap-1 rounded-full bg-white/5 p-0.5">
                    {FOCAL_LENGTHS.map((mm) => (
                      <button
                        key={mm}
                        type="button"
                        onClick={() => setScene3DField("focalLength", mm)}
                        className={cn(
                          "h-6 shrink-0 whitespace-nowrap rounded-full px-2 font-mono text-[10px] tabular-nums",
                          scene3d.focalLength === mm ? "gold-fill font-medium text-[#2a1c0c]" : "text-[#e4dacb]",
                        )}
                      >
                        {mm}mm
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Physical Geo-Sun & 2-Point Vertical Shift Strip (#3 & #4) */}
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
                <button
                  type="button"
                  aria-pressed={scene3d.geoEnabled}
                  onClick={() => applyGeoSolar(scene3d.geoLatitude, scene3d.geoMonth, scene3d.geoHour)}
                  className={cn(
                    "inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-[10px] font-medium",
                    scene3d.geoEnabled ? "gold-fill border-transparent text-[#2a1c0c]" : "border-white/20 text-[#e4dacb]",
                  )}
                >
                  <Globe className="size-3" /> Geo Sun
                </button>
                <label className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#cbbba6]">Lat</span>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    value={scene3d.geoLatitude}
                    onChange={(e) => applyGeoSolar(Number(e.target.value), scene3d.geoMonth, scene3d.geoHour)}
                    className="h-1 w-16 accent-[#d4b06a]"
                  />
                  <span className="w-8 font-mono text-[10px] tabular-nums">{scene3d.geoLatitude}°</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#cbbba6]">Mo</span>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={scene3d.geoMonth}
                    onChange={(e) => applyGeoSolar(scene3d.geoLatitude, Number(e.target.value), scene3d.geoHour)}
                    className="h-1 w-14 accent-[#d4b06a]"
                  />
                  <span className="w-5 font-mono text-[10px] tabular-nums">{scene3d.geoMonth}</span>
                </label>
                <label className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#cbbba6]">Hour</span>
                  <input
                    type="range"
                    min={6}
                    max={20}
                    step={0.5}
                    value={scene3d.geoHour}
                    onChange={(e) => applyGeoSolar(scene3d.geoLatitude, scene3d.geoMonth, Number(e.target.value))}
                    className="h-1 w-16 accent-[#d4b06a]"
                  />
                  <span className="w-9 font-mono text-[10px] tabular-nums">{scene3d.geoHour.toFixed(1)}h</span>
                </label>
                <label className="ml-auto flex items-center gap-1.5">
                  <span className="text-[10px] text-[#cbbba6]">V-Shift</span>
                  <input
                    type="range"
                    min={-0.2}
                    max={0.2}
                    step={0.01}
                    value={scene3d.verticalShift}
                    onChange={(e) => setScene3DField("verticalShift", Number(e.target.value))}
                    className="h-1 w-16 accent-[#d4b06a]"
                  />
                  <span className="w-10 text-right font-mono text-[10px] tabular-nums">{scene3d.verticalShift.toFixed(2)}</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex min-w-[120px] flex-1 items-center gap-1.5">
                  <span className="shrink-0 text-[11px] text-[#cbbba6]">Azimuth</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={scene3d.sunAzimuth}
                    onChange={(e) => setScene3DField("sunAzimuth", Number(e.target.value))}
                    className="h-1.5 w-full accent-[#d4b06a]"
                  />
                  <span className="w-8 shrink-0 text-right font-mono text-[10px] tabular-nums">{scene3d.sunAzimuth}°</span>
                </label>

                <label className="flex min-w-[120px] flex-1 items-center gap-1.5">
                  <span className="shrink-0 text-[11px] text-[#cbbba6]">Altitude</span>
                  <input
                    type="range"
                    min={5}
                    max={82}
                    value={scene3d.sunElevation}
                    onChange={(e) => setScene3DField("sunElevation", Number(e.target.value))}
                    className="h-1.5 w-full accent-[#d4b06a]"
                  />
                  <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums">{scene3d.sunElevation}°</span>
                </label>

                <label className="flex min-w-[100px] flex-1 items-center gap-1.5">
                  <span className="shrink-0 text-[11px] text-[#cbbba6]">Mist</span>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={scene3d.fogDensity}
                    onChange={(e) => setScene3DField("fogDensity", Number(e.target.value))}
                    className="h-1.5 w-full accent-[#d4b06a]"
                  />
                  <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums">{scene3d.fogDensity}%</span>
                </label>

                <label className="flex min-w-[100px] flex-1 items-center gap-1.5">
                  <span className="shrink-0 text-[11px] text-[#cbbba6]">Exp</span>
                  <input
                    type="range"
                    min={0.6}
                    max={1.6}
                    step={0.05}
                    value={scene3d.exposure}
                    onChange={(e) => setScene3DField("exposure", Number(e.target.value))}
                    className="h-1.5 w-full accent-[#d4b06a]"
                  />
                  <span className="w-7 shrink-0 text-right font-mono text-[10px] tabular-nums">{scene3d.exposure.toFixed(1)}</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="mt-2.5 space-y-2 border-t border-white/10 pt-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={captureCurrentKeyframe}
                    className="inline-flex h-7 items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 text-[11px] font-medium text-[#f6efe4] hover:border-[#d4b06a]"
                  >
                    <Plus className="size-3 text-[#e7c27a]" /> Add Keyframe
                  </button>
                  <button
                    type="button"
                    disabled={cameraKeyframes.length < 2 || playingPath}
                    onClick={() => playFlythrough(false)}
                    className="gold-fill inline-flex h-7 items-center gap-1 rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-45"
                  >
                    <Play className="size-3" /> {playingPath ? "Playing…" : "Play Path"}
                  </button>
                  <button
                    type="button"
                    disabled={cameraKeyframes.length < 2 || playingPath || recordingVideo}
                    onClick={() => playFlythrough(true)}
                    className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 px-3 text-[11px] font-medium text-[#f6e7c8] disabled:opacity-45"
                  >
                    <Video className="size-3" /> {recordingVideo ? "Recording…" : "Export .webm"}
                  </button>
                  {cameraKeyframes.length > 0 ? (
                    <button
                      type="button"
                      onClick={clearCameraKeyframes}
                      className="inline-flex h-7 items-center gap-1 rounded-full border border-white/15 px-2.5 text-[11px] text-[#cbbba6] hover:text-white"
                    >
                      <Trash2 className="size-3" /> Clear
                    </button>
                  ) : null}
                </div>
                <span className="text-[11px] text-[#b9aa95]">
                  Orbit/dolly to any angle, capture 2–6 keyframes for smooth architectural flythroughs.
                </span>
              </div>

              {cameraKeyframes.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {cameraKeyframes.map((kf) => (
                    <div
                      key={kf.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px]"
                    >
                      <span>{kf.label}</span>
                      <button
                        type="button"
                        onClick={() => removeCameraKeyframe(kf.id)}
                        aria-label={`Remove ${kf.label}`}
                        className="text-[#cbbba6] hover:text-rose-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
