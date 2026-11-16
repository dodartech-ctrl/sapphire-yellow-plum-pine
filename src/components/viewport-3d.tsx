import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import {
  FLYTHROUGH_DURATION_MS,
  buildOrbitDollyZoomRig,
  interpolateCameraPathCatmullRom,
  sampleCameraPathPoints,
  type CameraMoveRole,
} from "@/lib/archviz-suite";
import {
  CAMERA_PRESETS_3D,
  D5_LIGHT_PRESETS,
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
import {
  INSPECTOR_PBR_SWATCHES,
  computeSolarRigState,
  createAssignmentFromSwatch,
  getMaterialAssignment,
  type MeshMaterialAssignment,
} from "@/lib/solar-and-materials";
import { exportGroupToGltfAsync } from "@/lib/scene-export";
import { useOriel } from "@/lib/store";
import { consumePending3DFile } from "@/lib/workflow-journey";
import { cn } from "@/lib/utils";
import {
  CAMERA_VIEWS,
  MATERIAL_SPECS,
  applyCameraLensShift,
  applyMaterialOverrideToMesh,
  buildFloorPlanExtrusionGroup,
  buildPresetMassing,
  buildTreeCluster,
  createDynamicSolarHdriTexture,
  createSharedSceneMaterials,
  disposeObjectGeometries,
  disposeSharedSceneMaterials,
  exportThreeRenderChannels,
  normalizeAndGroundObject,
  restoreOriginalMeshMaterial,
  type SharedSceneMaterials,
} from "@/lib/viewport-3d-scene";
import {
  Box,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Crosshair,
  Download,
  Film,
  Globe,
  Layers,
  Loader2,
  Move3d,
  Palette,
  Play,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Square,
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

type PickableMeshSummary = {
  objectId: string;
  label: string;
};

function tagPickableMeshes(group: THREE.Object3D, fallbackPrefix: string): PickableMeshSummary[] {
  let idx = 0;
  const list: PickableMeshSummary[] = [];
  group.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      if (mesh.userData.nonPickable) return;
      idx += 1;
      const existingId = typeof mesh.userData.objectId === "string" && mesh.userData.objectId.trim()
        ? mesh.userData.objectId.trim()
        : (mesh.name?.trim() || `${fallbackPrefix.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`);
      const label = typeof mesh.userData.pickLabel === "string" && mesh.userData.pickLabel.trim()
        ? mesh.userData.pickLabel.trim()
        : mesh.name?.trim() || `${fallbackPrefix} Part #${idx}`;
      mesh.userData.objectId = existingId;
      mesh.userData.pickLabel = label;
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material;
      }
      list.push({ objectId: existingId, label });
    }
  });
  return list;
}

export function Viewport3D({ aspect: _aspect, onCaptureSnapshot, onCaptureDepthPass, onCaptureChannels }: Viewport3DProps) {
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

  const [hudOpen, setHudOpen] = useState(true);
  const [rigTab, setRigTab] = useState<"model" | "lighting" | "keyframes">("model");
  const [mountReady, setMountReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);
  const [sceneMeshList, setSceneMeshList] = useState<PickableMeshSummary[]>([]);
  const [playingPath, setPlayingPath] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [flythroughScrub, setFlythroughScrub] = useState(0);
  const [exportedClipUrl, setExportedClipUrl] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<"glb" | "gltf">("glb");
  const [exportingGltf, setExportingGltf] = useState(false);
  const [lastExportMeta, setLastExportMeta] = useState<string | null>(null);

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
  const pathGroupRef = useRef<THREE.Group | null>(null);
  const customMatPoolRef = useRef<THREE.Material[]>([]);
  const selectedMeshRef = useRef<THREE.Mesh | null>(null);
  const selectionBoxRef = useRef<THREE.BoxHelper | null>(null);
  const envTargetRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const requestRenderRef = useRef<() => void>(() => undefined);
  const isSoftwareGlRef = useRef(false);
  const camTransitionRef = useRef<CameraTransition | null>(null);
  const flythroughRafRef = useRef<number>(0);
  const flythroughCancelRef = useRef(false);
  const flythroughRecorderRef = useRef<MediaRecorder | null>(null);
  const flyProgressBarRef = useRef<HTMLDivElement>(null);
  const flyTimeReadoutRef = useRef<HTMLSpanElement>(null);
  const lensShiftRef = useRef({ twoPointTilt: scene3d.twoPointTilt, verticalShift: scene3d.verticalShift });
  lensShiftRef.current = { twoPointTilt: scene3d.twoPointTilt, verticalShift: scene3d.verticalShift };
  const lastCamPresetRef = useRef<CameraPreset3D>(scene3d.cameraPreset);
  const pointerDownPtRef = useRef<{ x: number; y: number } | null>(null);
  const transformRef = useRef({ rotY: scene3d.modelRotationY, scale: scene3d.modelScale, elev: scene3d.modelElevation });
  transformRef.current = { rotY: scene3d.modelRotationY, scale: scene3d.modelScale, elev: scene3d.modelElevation };
  const overridesRef = useRef<MeshMaterialAssignment[]>(meshMaterialOverrides);
  overridesRef.current = meshMaterialOverrides;

  // Derived solar vector state: active geo solar or fallback to manual sunAzimuth/sunElevation + Time of Day
  const activeSolar = useMemo(() => {
    return computeSolarRigState({
      timeOfDay: scene3d.geoHour,
      month: scene3d.geoMonth,
      latitude: scene3d.geoLatitude,
    });
  }, [scene3d.geoHour, scene3d.geoMonth, scene3d.geoLatitude]);

  const liveSunVector = useMemo(() => {
    if (scene3d.geoEnabled) {
      return activeSolar.sunPosition;
    }
    const manual = computeSunPosition(scene3d.sunAzimuth, scene3d.sunElevation);
    return { x: manual.x, y: manual.y, z: manual.z };
  }, [scene3d.geoEnabled, activeSolar.sunPosition, scene3d.sunAzimuth, scene3d.sunElevation]);

  const selectedOverride = useMemo(
    () => getMaterialAssignment(meshMaterialOverrides, selectedObjectId),
    [meshMaterialOverrides, selectedObjectId],
  );

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

    const initialSolar = computeSolarRigState({
      timeOfDay: scene3d.geoHour,
      month: scene3d.geoMonth,
      latitude: scene3d.geoLatitude,
    });
    const initTex = createDynamicSolarHdriTexture({
      mood: scene3d.hdriMood,
      azimuthDeg: scene3d.geoEnabled ? initialSolar.azimuthDeg : scene3d.sunAzimuth,
      rawElevationDeg: scene3d.geoEnabled ? initialSolar.rawElevationDeg : scene3d.sunElevation,
      zenithHex: scene3d.geoEnabled ? initialSolar.zenithHex : undefined,
      horizonHex: scene3d.geoEnabled ? initialSolar.horizonHex : undefined,
      groundBounceHex: scene3d.geoEnabled ? initialSolar.groundBounceHex : undefined,
      isDaylight: scene3d.geoEnabled ? initialSolar.isDaylight : true,
    });
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envTarget = pmrem.fromEquirectangular(initTex);
    scene.environment = envTarget.texture;
    envTargetRef.current = envTarget;
    initTex.dispose();
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
    const initialMeshes = tagPickableMeshes(initialMassing, "Architecture");
    setSceneMeshList(initialMeshes);
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

    // Raycaster mesh object inspector (#5): works on any clean click (drag <= 6px)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPtRef.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerUp = (e: PointerEvent) => {
      const start = pointerDownPtRef.current;
      pointerDownPtRef.current = null;
      if (!start || !massingGroupRef.current) return;
      const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y);
      if (dist > 6) return;
      const rect = canvas.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / Math.max(1, rect.height)) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(massingGroupRef.current.children, true);
      const hitMesh = hits.find(
        (h) => (h.object as THREE.Mesh).isMesh && !(h.object as THREE.Mesh).userData.nonPickable,
      )?.object as THREE.Mesh | undefined;
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
        const helper = new THREE.BoxHelper(hitMesh, 0xe7c27a);
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
      if (flythroughRafRef.current) cancelAnimationFrame(flythroughRafRef.current);
      flythroughCancelRef.current = true;
      if (flythroughRecorderRef.current && flythroughRecorderRef.current.state === "recording") {
        flythroughRecorderRef.current.stop();
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Revoke any exported clip URL cleanly on replace/unmount
  useEffect(() => {
    return () => {
      if (exportedClipUrl) URL.revokeObjectURL(exportedClipUrl);
    };
  }, [exportedClipUrl]);

  // Visualize 3D Catmull-Rom camera trajectory & waypoints when keyframes >= 2 and idle
  useEffect(() => {
    if (!mountReady) return;
    const scene = sceneRef.current;
    if (!scene) return;

    if (pathGroupRef.current) {
      scene.remove(pathGroupRef.current);
      disposeObjectGeometries(pathGroupRef.current);
      pathGroupRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh | THREE.Line).material) {
          const mat = (obj as THREE.Mesh | THREE.Line).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
      pathGroupRef.current = null;
    }

    if (cameraKeyframes.length >= 2 && !playingPath && !recordingVideo && rigTab === "keyframes") {
      const group = new THREE.Group();
      group.userData.nonPickable = true;

      const sampled = sampleCameraPathPoints(cameraKeyframes, 32);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(
        sampled.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      );
      const lineMat = new THREE.LineBasicMaterial({ color: 0xe7c27a });
      const line = new THREE.Line(lineGeo, lineMat);
      line.userData.nonPickable = true;
      group.add(line);

      const sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);
      for (const kf of cameraKeyframes) {
        const color = kf.role === "orbit" ? 0x60a5fa : kf.role === "dolly" ? 0xe7c27a : kf.role === "zoom" ? 0x34d399 : 0xf6efe4;
        const sphereMat = new THREE.MeshBasicMaterial({ color });
        const marker = new THREE.Mesh(sphereGeo.clone(), sphereMat);
        marker.position.set(...kf.pos);
        marker.userData.nonPickable = true;
        group.add(marker);
      }
      sphereGeo.dispose();

      pathGroupRef.current = group;
      scene.add(group);
    }

    requestRenderRef.current();
  }, [mountReady, cameraKeyframes, playingPath, recordingVideo, rigTab]);

  // Live solar HDRI sky & specular reflection dome sync via PMREMGenerator
  useEffect(() => {
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
        zenithHex: scene3d.geoEnabled ? activeSolar.zenithHex : undefined,
        horizonHex: scene3d.geoEnabled ? activeSolar.horizonHex : undefined,
        groundBounceHex: scene3d.geoEnabled ? activeSolar.groundBounceHex : undefined,
        isDaylight: scene3d.geoEnabled ? activeSolar.isDaylight : true,
      });
      const pmrem = new THREE.PMREMGenerator(r);
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
    activeSolar.envIntensity,
  ]);

  // Sync materials, solar vector shadows, lens shift, fog, exposure, camera preset
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

    if (scene3d.geoEnabled) {
      const { x, y, z } = activeSolar.sunPosition;
      sun.position.set(x, y, z);
      sun.color.set(activeSolar.sunHex);
      sun.intensity = activeSolar.sunIntensity;

      rim.position.set(-x * 0.7, Math.max(8, y * 0.6), -z * 0.7);
      rim.intensity = activeSolar.rimIntensity;

      hemi.color.set(activeSolar.skyHex);
      hemi.intensity = activeSolar.ambientIntensity;
      mats.interiorGlowMat.emissiveIntensity = activeSolar.interiorGlowIntensity;

      scene.background = new THREE.Color(activeSolar.skyHex);
      scene.fog = new THREE.FogExp2(activeSolar.skyHex, (scene3d.fogDensity / 100) * 0.025);
    } else {
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
    }

    const massing = massingGroupRef.current;
    if (massing) {
      massing.rotation.y = (scene3d.modelRotationY * Math.PI) / 180;
      massing.scale.setScalar(scene3d.modelScale);
      massing.position.y = scene3d.modelElevation;
      massing.updateMatrixWorld(true);
      if (selectionBoxRef.current && selectedMeshRef.current) {
        selectionBoxRef.current.update();
      }
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
    scene3d.verticalShift,
  ]);

  // Apply persisted & edited PBR Material CRUD overrides onto scene meshes by objectId
  useEffect(() => {
    if (!mountReady) return;
    const group = massingGroupRef.current;
    if (!group) return;
    const overrideMap = new Map(meshMaterialOverrides.map((item) => [item.objectId, item]));
    group.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      if (mesh.userData.nonPickable) return;
      const oid = String(mesh.userData.objectId || mesh.name || "");
      if (!oid) return;
      const found = overrideMap.get(oid);
      if (found) {
        applyMaterialOverrideToMesh(mesh, found, customMatPoolRef.current);
      } else {
        restoreOriginalMeshMaterial(mesh, customMatPoolRef.current);
      }
    });
    requestRenderRef.current();
  }, [mountReady, meshMaterialOverrides, scene3d.preset, floorPlanBlueprint]);

  // Swap massing model geometry cleanly (presets, floorplan extrusion, or custom CAD)
  useEffect(() => {
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
    const nextList = tagPickableMeshes(next, scene3d.preset === "plan-extrude" ? "Plan Wall" : "Architecture");
    setSceneMeshList(nextList);
    next.rotation.y = (transformRef.current.rotY * Math.PI) / 180;
    next.scale.setScalar(transformRef.current.scale);
    next.position.y = transformRef.current.elev;
    massingGroupRef.current = next;
    selectedMeshRef.current = null;
    setSelectedObjectId(null);
    setSelectedPartName(null);
    scene.add(next);
    // Reapply any saved overrides targeting matching objectIds
    const overrideMap = new Map(overridesRef.current.map((item) => [item.objectId, item]));
    next.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const oid = String(mesh.userData.objectId || "");
      const found = oid ? overrideMap.get(oid) : undefined;
      if (found) {
        applyMaterialOverrideToMesh(mesh, found, customMatPoolRef.current);
      }
    });
    requestRenderRef.current();
  }, [mountReady, scene3d.preset, floorPlanBlueprint]);

  useEffect(() => {
    if (!mountReady) return;
    const queued = consumePending3DFile();
    if (queued) {
      void loadCadFile(queued);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mountReady]);

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

  function selectMeshByObjectId(objectId: string) {
    const group = massingGroupRef.current;
    const scene = sceneRef.current;
    if (!group || !scene) return;
    let matched: THREE.Mesh | null = null;
    group.traverse((obj) => {
      if (!matched && (obj as THREE.Mesh).isMesh && String((obj as THREE.Mesh).userData.objectId || "") === objectId) {
        matched = obj as THREE.Mesh;
      }
    });
    if (!matched) return;
    const hit = matched as THREE.Mesh;
    selectedMeshRef.current = hit;
    setSelectedObjectId(objectId);
    setSelectedPartName(String(hit.userData.pickLabel || objectId));
    if (selectionBoxRef.current) {
      scene.remove(selectionBoxRef.current);
      selectionBoxRef.current.dispose();
    }
    const helper = new THREE.BoxHelper(hit, 0xe7c27a);
    selectionBoxRef.current = helper;
    scene.add(helper);
    requestRenderRef.current();
  }

  function applyPbrSwatchToSelected(presetId: ExtendedPbrPresetId) {
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

  function handleResetObjectMaterial(objectId: string) {
    deleteMeshMaterial(objectId);
    toast.success(`Restored default material on #${objectId}`);
  }

  function applyGeoSolar(lat: number, month: number, hour: number) {
    const solar = computeSolarRigState({ timeOfDay: hour, month, latitude: lat });
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

  async function downloadSceneGltf(format: "glb" | "gltf" = exportFormat) {
    const group = massingGroupRef.current;
    if (!group || exportingGltf) return;
    setExportingGltf(true);
    try {
      const result = await exportGroupToGltfAsync(group, meshMaterialOverrides, {
        binary: format === "glb",
        presetName: scene3d.preset,
      });
      const blob =
        result.payload instanceof ArrayBuffer
          ? new Blob([result.payload], { type: result.mimeType })
          : new Blob([JSON.stringify(result.payload, null, 2)], { type: result.mimeType });
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

  function applyCameraPoseToViewport(pose: { pos: [number, number, number]; target: [number, number, number]; focalLength: number }) {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!renderer || !scene || !camera || !controls) return;
    camera.position.set(...pose.pos);
    controls.target.set(...pose.target);
    camera.fov = focalLengthToFov(pose.focalLength);
    const size = renderer.getSize(new THREE.Vector2());
    applyCameraLensShift(camera, size.x, size.y, lensShiftRef.current.twoPointTilt, lensShiftRef.current.verticalShift);
    camera.updateProjectionMatrix();
    controls.update();
    renderer.render(scene, camera);
  }

  function recordRoleKeyframe(role: CameraMoveRole) {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const roleNumber = role === "orbit" ? 1 : role === "dolly" ? 2 : 3;
    const roleTitle = role === "orbit" ? "Orbit" : role === "dolly" ? "Dolly" : "Zoom";
    upsertCameraKeyframe({
      id: `kf-${role}-${Date.now()}`,
      label: `${roleNumber}. ${roleTitle} (${scene3d.focalLength}mm)`,
      role,
      pos: [Number(camera.position.x.toFixed(2)), Number(camera.position.y.toFixed(2)), Number(camera.position.z.toFixed(2))],
      target: [Number(controls.target.x.toFixed(2)), Number(controls.target.y.toFixed(2)), Number(controls.target.z.toFixed(2))],
      focalLength: scene3d.focalLength,
    });
    toast.success(`Recorded ${roleTitle} camera position (${scene3d.focalLength}mm)`);
  }

  function stageOrbitDollyZoomSequence() {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    const rig = buildOrbitDollyZoomRig(
      [camera.position.x, camera.position.y, camera.position.z],
      [controls.target.x, controls.target.y, controls.target.z],
      scene3d.focalLength,
    );
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
    const defaultRole: CameraMoveRole | undefined =
      !cameraKeyframes.some((k) => k.role === "orbit")
        ? "orbit"
        : !cameraKeyframes.some((k) => k.role === "dolly")
          ? "dolly"
          : !cameraKeyframes.some((k) => k.role === "zoom")
            ? "zoom"
            : undefined;
    const roleTitle = defaultRole ? `${defaultRole.charAt(0).toUpperCase()}${defaultRole.slice(1)}` : `KF #${nextIdx}`;
    addCameraKeyframe({
      id: `kf-${Date.now()}`,
      label: `${nextIdx}. ${roleTitle} (${scene3d.focalLength}mm)`,
      role: defaultRole,
      pos: [Number(camera.position.x.toFixed(2)), Number(camera.position.y.toFixed(2)), Number(camera.position.z.toFixed(2))],
      target: [Number(controls.target.x.toFixed(2)), Number(controls.target.y.toFixed(2)), Number(controls.target.z.toFixed(2))],
      focalLength: scene3d.focalLength,
    });
    toast.success(`Recorded camera position #${nextIdx} (${roleTitle})`);
  }

  function scrubCameraPath(tNorm: number) {
    const clamped = Math.max(0, Math.min(1, tNorm));
    setFlythroughScrub(clamped);
    if (flyProgressBarRef.current) flyProgressBarRef.current.style.width = `${Math.round(clamped * 100)}%`;
    if (flyTimeReadoutRef.current) flyTimeReadoutRef.current.textContent = `${(clamped * 4).toFixed(1)}s / 4.0s`;
    const frame = interpolateCameraPathCatmullRom(cameraKeyframes, clamped);
    if (frame) {
      applyCameraPoseToViewport(frame);
    }
  }

  function stopFlythrough() {
    flythroughCancelRef.current = true;
    if (flythroughRafRef.current) {
      cancelAnimationFrame(flythroughRafRef.current);
      flythroughRafRef.current = 0;
    }
    if (flythroughRecorderRef.current && flythroughRecorderRef.current.state === "recording") {
      flythroughRecorderRef.current.stop();
    }
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
    let recorder: MediaRecorder | null = null;
    const chunks: BlobPart[] = [];

    if (recordWebm) {
      if (typeof canvas.captureStream !== "function" || typeof MediaRecorder === "undefined") {
        toast.message("WebM captureStream is unavailable in this browser; playing interactive 4s preview.");
      } else {
        try {
          const stream = canvas.captureStream(24);
          const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
            ? "video/webm;codecs=vp9"
            : MediaRecorder.isTypeSupported("video/webm")
              ? "video/webm"
              : undefined;
          recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
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
            } else {
              toast.message("Flythrough completed, but this browser produced an empty WebM stream.");
            }
          };
          recorder.start(250);
          setRecordingVideo(true);
        } catch {
          recorder = null;
          flythroughRecorderRef.current = null;
        }
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
        const size = renderer.getSize(new THREE.Vector2());
        applyCameraLensShift(camera, size.x, size.y, lensShiftRef.current.twoPointTilt, lensShiftRef.current.verticalShift);
        camera.updateProjectionMatrix();
        controls.update();
        renderer.render(scene, camera);
      }
      if (flyProgressBarRef.current) flyProgressBarRef.current.style.width = `${Math.round(tNorm * 100)}%`;
      if (flyTimeReadoutRef.current) flyTimeReadoutRef.current.textContent = `${(tNorm * 4).toFixed(1)}s / 4.0s`;

      if (tNorm < 1) {
        flythroughRafRef.current = requestAnimationFrame(step);
      } else {
        flythroughRafRef.current = 0;
        controls.enabled = true;
        if (pathGroupRef.current) pathGroupRef.current.visible = true;
        setFlythroughScrub(1);
        setPlayingPath(false);
        if (recorder && recorder.state === "recording") {
          try {
            recorder.requestData();
          } catch {
            // Some browsers throw if requestData is called at exact end-of-stream
          }
          recorder.stop();
        }
        requestRenderRef.current();
      }
    };
    flythroughRafRef.current = requestAnimationFrame(step);
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
      {/* Main 3D Stage + Docked Sidebar Inspector Panel (zero floating center overlays) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_296px]">
        {/* Unobstructed Three.js WebGL Canvas Area */}
        <div
          className="relative h-[340px] w-full min-w-0 overflow-hidden bg-[#181613] lg:h-[492px]"
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
              data-testid="threejs-canvas-host"
              className={cn(
                "h-full w-full",
                scene3d.materialPickMode ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing",
              )}
            />
          )}

          <input ref={cadInputRef} type="file" accept=".glb,.gltf,.obj,.fbx" className="sr-only" onChange={handleCadInput} />

          {/* Discrete top-right bottom-rig toggle */}
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

        {/* Sidebar Inspector Panel: Solar Position (0-24h & Month) + Raycaster PBR Material CRUD */}
        <aside
          data-testid="inspector-sidebar"
          aria-label="3D Scene Inspector"
          className="flex flex-col gap-2.5 overflow-y-auto border-t border-white/10 bg-[#14110f] p-2.5 text-xs text-[#f6efe4] lg:h-[492px] lg:border-t-0 lg:border-l"
        >
          {/* Solar Positioning Vector Section */}
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#e7c27a]">
                <Sun className="size-3.5" /> Solar Position
              </span>
              <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#e4dacb]">
                {scene3d.geoEnabled ? activeSolar.phase : "Manual Rig"}
              </span>
            </div>

            {/* Time of Day (0-24h) */}
            <label className="block space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-[#cbbba6]">
                  <Clock className="size-3 text-[#d4b06a]" /> Time of Day
                </span>
                <span data-testid="solar-time-readout" className="font-mono text-[11px] font-medium text-[#f6efe4] tabular-nums">
                  {activeSolar.formattedTime} ({scene3d.geoHour.toFixed(2)}h)
                </span>
              </div>
              <input
                type="range"
                data-testid="solar-time-slider"
                aria-label="Time of Day (hours)"
                min={0}
                max={24}
                step={0.25}
                value={scene3d.geoHour}
                onChange={(e) => applyGeoSolar(scene3d.geoLatitude, scene3d.geoMonth, Number(e.target.value))}
                className="h-1.5 w-full accent-[#d4b06a]"
              />
            </label>

            {/* Month (1-12) */}
            <label className="block space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-[#cbbba6]">
                  <Calendar className="size-3 text-[#d4b06a]" /> Month
                </span>
                <span data-testid="solar-month-readout" className="font-mono text-[11px] font-medium text-[#f6efe4] tabular-nums">
                  {activeSolar.monthLabel} ({scene3d.geoMonth}/12)
                </span>
              </div>
              <input
                type="range"
                data-testid="solar-month-slider"
                aria-label="Month (1 to 12)"
                min={1}
                max={12}
                step={1}
                value={scene3d.geoMonth}
                onChange={(e) => applyGeoSolar(scene3d.geoLatitude, Number(e.target.value), scene3d.geoHour)}
                className="h-1.5 w-full accent-[#d4b06a]"
              />
            </label>

            {/* Live sunPosition Vector Readout */}
            <div className="rounded-lg border border-white/10 bg-black/35 px-2 py-1.5 font-mono text-[10px] text-[#cbbba6]">
              <div className="flex items-center justify-between">
                <span className="text-[#9e8f7b]">sunPosition</span>
                <span data-testid="sun-position-readout" className="text-[#f6e7c8] tabular-nums">
                  [{liveSunVector.x.toFixed(2)}, {liveSunVector.y.toFixed(2)}, {liveSunVector.z.toFixed(2)}]
                </span>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-[9px] text-[#8d7f6c]">
                <span>Az {scene3d.geoEnabled ? activeSolar.azimuthDeg : scene3d.sunAzimuth}° · El {scene3d.geoEnabled ? activeSolar.rawElevationDeg : scene3d.sunElevation}°</span>
                <span>HDRI + Shadows Live</span>
              </div>
            </div>
          </div>

          {/* Raycaster Object Inspector & PBR Material CRUD Section */}
          <div className="flex flex-1 flex-col gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#e7c27a]">
                <Crosshair className="size-3.5" /> Object Inspector
              </span>
              <button
                type="button"
                aria-pressed={scene3d.materialPickMode}
                onClick={() => setScene3DField("materialPickMode", !scene3d.materialPickMode)}
                className={cn(
                  "inline-flex h-6 items-center gap-1 rounded border px-2 text-[10px] font-medium",
                  scene3d.materialPickMode
                    ? "gold-fill border-transparent text-[#2a1c0c]"
                    : "border-white/15 bg-white/5 text-[#cbbba6] hover:text-white",
                )}
              >
                <Palette className="size-3" /> {scene3d.materialPickMode ? "Raycaster On" : "Click Mesh"}
              </button>
            </div>

            {/* Selected Object ID Display */}
            <div className="rounded-lg border border-white/10 bg-black/40 p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#9e8f7b]">Object ID</span>
                <code
                  data-testid="selected-object-id"
                  className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#e7c27a]"
                >
                  {selectedObjectId ?? "none-selected"}
                </code>
              </div>
              <p data-testid="selected-object-label" className="mt-1 truncate text-[11px] font-medium text-[#f6efe4]">
                {selectedPartName ?? "Click any mesh on canvas or choose below:"}
              </p>
              {sceneMeshList.length > 0 ? (
                <select
                  aria-label="Select 3D Object ID"
                  value={selectedObjectId ?? ""}
                  onChange={(e) => {
                    if (e.target.value) selectMeshByObjectId(e.target.value);
                  }}
                  className="mt-1.5 h-7 w-full rounded border border-white/15 bg-[#1b1814] px-2 font-mono text-[10px] text-[#e4dacb]"
                >
                  <option value="">-- Jump to mesh ID ({sceneMeshList.length}) --</option>
                  {sceneMeshList.map((item) => (
                    <option key={item.objectId} value={item.objectId}>
                      {item.objectId} ({item.label})
                    </option>
                  ))}
                </select>
              ) : null}
            </div>

            {/* Create / Assign PBR Material Swatches */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#9e8f7b]">
                <span>Assign PBR Material</span>
                {selectedOverride ? (
                  <span className="font-mono text-[#e7c27a]">{selectedOverride.materialLabel}</span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {INSPECTOR_PBR_SWATCHES.filter((s) => s.category === "Canonical").map((swatch) => {
                  const active = selectedOverride?.materialId === swatch.id;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      data-testid={`pbr-swatch-${swatch.shortKey}`}
                      onClick={() => applyPbrSwatchToSelected(swatch.id)}
                      className={cn(
                        "inline-flex flex-1 min-w-[78px] items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium whitespace-nowrap transition",
                        active
                          ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]"
                          : "border-white/15 bg-black/30 text-[#f6efe4] hover:border-[#d4b06a]",
                      )}
                    >
                      <span
                        className="size-3 shrink-0 rounded border border-white/30"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <span>{swatch.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-1">
                {INSPECTOR_PBR_SWATCHES.filter((s) => s.category === "Architectural").map((swatch) => {
                  const active = selectedOverride?.materialId === swatch.id;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      data-testid={`pbr-swatch-${swatch.shortKey}`}
                      onClick={() => applyPbrSwatchToSelected(swatch.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] transition",
                        active
                          ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]"
                          : "border-white/15 bg-black/25 text-[#cbbba6] hover:border-[#d4b06a] hover:text-white",
                      )}
                    >
                      <span className="size-2 rounded-sm border border-white/25" style={{ backgroundColor: swatch.hex }} />
                      {swatch.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Update Properties on Selected Override */}
            {selectedOverride ? (
              <div className="space-y-1.5 rounded-lg border border-white/10 bg-black/30 p-2">
                <div className="flex items-center justify-between text-[10px] text-[#cbbba6]">
                  <span className="inline-flex items-center gap-1 font-medium text-[#e7c27a]">
                    <SlidersHorizontal className="size-3" /> Tune Finish
                  </span>
                  <button
                    type="button"
                    data-testid="reset-selected-material-btn"
                    onClick={() => handleResetObjectMaterial(selectedOverride.objectId)}
                    className="inline-flex items-center gap-1 text-[10px] text-rose-300 hover:text-rose-200"
                  >
                    <Trash2 className="size-3" /> Remove
                  </button>
                </div>
                <label className="flex items-center gap-2 text-[10px]">
                  <span className="w-16 shrink-0 text-[#cbbba6]">Roughness</span>
                  <input
                    type="range"
                    data-testid="inspector-roughness-slider"
                    min={0.02}
                    max={1}
                    step={0.02}
                    value={selectedOverride.roughness}
                    onChange={(e) =>
                      updateMeshMaterial(selectedOverride.objectId, { roughness: Number(e.target.value) })
                    }
                    className="h-1 flex-1 accent-[#d4b06a]"
                  />
                  <span className="w-7 text-right font-mono tabular-nums">{selectedOverride.roughness.toFixed(2)}</span>
                </label>
                <label className="flex items-center gap-2 text-[10px]">
                  <span className="w-16 shrink-0 text-[#cbbba6]">Metalness</span>
                  <input
                    type="range"
                    data-testid="inspector-metalness-slider"
                    min={0}
                    max={1}
                    step={0.02}
                    value={selectedOverride.metalness}
                    onChange={(e) =>
                      updateMeshMaterial(selectedOverride.objectId, { metalness: Number(e.target.value) })
                    }
                    className="h-1 flex-1 accent-[#d4b06a]"
                  />
                  <span className="w-7 text-right font-mono tabular-nums">{selectedOverride.metalness.toFixed(2)}</span>
                </label>
              </div>
            ) : null}

            {/* CRUD Read & Delete Assigned Material Overrides List */}
            <div className="space-y-1.5 border-t border-white/10 pt-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#9e8f7b]">
                <span>Assigned Overrides ({meshMaterialOverrides.length})</span>
                {meshMaterialOverrides.length > 0 ? (
                  <button
                    type="button"
                    data-testid="clear-all-materials-btn"
                    onClick={() => {
                      clearMeshMaterials();
                      toast.success("Cleared all object material overrides");
                    }}
                    className="text-[10px] normal-case text-[#cbbba6] hover:text-rose-300"
                  >
                    Reset All
                  </button>
                ) : null}
              </div>

              {meshMaterialOverrides.length === 0 ? (
                <p className="text-[10px] text-[#8d7f6c]">
                  No overrides yet. Click a 3D mesh and select Concrete, Oak, or Glass to create an assignment.
                </p>
              ) : (
                <ul data-testid="material-overrides-list" className="space-y-1">
                  {meshMaterialOverrides.map((item) => (
                    <li
                      key={item.objectId}
                      data-testid={`material-override-row-${item.objectId}`}
                      className={cn(
                        "flex items-center justify-between gap-1.5 rounded-lg border px-2 py-1 text-[10px]",
                        selectedObjectId === item.objectId
                          ? "border-[#e7c27a] bg-[#e7c27a]/15"
                          : "border-white/10 bg-black/25",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => selectMeshByObjectId(item.objectId)}
                        className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                      >
                        <span
                          className="size-2.5 shrink-0 rounded-sm border border-white/30"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="truncate font-mono text-[#f6efe4]">{item.objectId}</span>
                        <span className="shrink-0 text-[#cbbba6]">→ {item.materialLabel}</span>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete material assignment for ${item.objectId}`}
                        data-testid={`delete-material-${item.objectId}`}
                        onClick={() => handleResetObjectMaterial(item.objectId)}
                        className="rounded p-0.5 text-[#cbbba6] hover:bg-white/10 hover:text-rose-300"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Export Scene (GLTF/GLB with Applied PBR Materials) */}
              <div className="mt-2 space-y-1.5 rounded-lg border border-[#d4b06a]/30 bg-[#1c1813] p-2">
                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <span className="font-semibold uppercase tracking-wider text-[#e7c27a]">3D Scene Export</span>
                  <div
                    role="group"
                    aria-label="GLTF export format"
                    className="inline-flex rounded border border-white/15 bg-black/40 p-0.5 font-mono text-[9px]"
                  >
                    {(["glb", "gltf"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setExportFormat(fmt)}
                        className={cn(
                          "rounded px-1.5 py-0.5 uppercase",
                          exportFormat === fmt ? "gold-fill font-semibold text-[#2a1c0c]" : "text-[#cbbba6] hover:text-white",
                        )}
                      >
                        .{fmt}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  data-testid="inspector-download-scene-btn"
                  disabled={exportingGltf}
                  onClick={() => void downloadSceneGltf(exportFormat)}
                  className="gold-fill inline-flex h-7 w-full items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-55"
                >
                  {exportingGltf ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
                  Download Scene (.{exportFormat})
                </button>
                <p data-testid="scene-export-status" className="text-[10px] text-[#b9aa95]">
                  {lastExportMeta
                    ? `Saved: ${lastExportMeta}`
                    : `Exports ${sceneMeshList.length} meshes with ${meshMaterialOverrides.length} applied PBR override${meshMaterialOverrides.length === 1 ? "" : "s"}.`}
                </p>
              </div>
            </div>
          </div>
        </aside>
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
                data-testid="download-scene-btn"
                disabled={exportingGltf}
                onClick={() => void downloadSceneGltf(exportFormat)}
                className="inline-flex h-8 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[#d4b06a]/55 bg-[#d4b06a]/15 px-2.5 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#d4b06a]/25 disabled:opacity-55"
              >
                {exportingGltf ? <Loader2 className="size-3 animate-spin text-[#e7c27a]" /> : <Download className="size-3 text-[#e7c27a]" />}
                Download Scene (.{exportFormat})
              </button>
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

              {/* Raycaster PBR Surface Quick Strip */}
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
                  {selectedObjectId ? `Target: #${selectedObjectId}` : "Click any mesh in 3D or use Inspector sidebar:"}
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {INSPECTOR_PBR_SWATCHES.map((pbr) => (
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
                    min={0}
                    max={24}
                    step={0.25}
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
            <div data-testid="camera-keyframes-panel" className="mt-2.5 space-y-2.5 border-t border-white/10 pt-2.5">
              {/* 3 Camera Position Roles (Orbit, Dolly, Zoom) + 4-Second Flythrough Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(["orbit", "dolly", "zoom"] as const).map((role, idx) => {
                    const recorded = cameraKeyframes.some((k) => k.role === role);
                    const title = role === "orbit" ? "Orbit" : role === "dolly" ? "Dolly" : "Zoom";
                    return (
                      <button
                        key={role}
                        type="button"
                        data-testid={`record-pose-${role}`}
                        disabled={playingPath}
                        onClick={() => recordRoleKeyframe(role)}
                        className={cn(
                          "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-medium transition disabled:opacity-45",
                          recorded
                            ? "border-[#e7c27a] bg-[#e7c27a]/20 text-[#f6e7c8]"
                            : "border-white/25 bg-white/10 text-[#f6efe4] hover:border-[#d4b06a]",
                        )}
                      >
                        {recorded ? <Check className="size-3 text-[#e7c27a]" /> : <Plus className="size-3 text-[#e7c27a]" />}
                        {idx + 1}. {title}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    data-testid="auto-stage-3shot-btn"
                    disabled={playingPath}
                    onClick={stageOrbitDollyZoomSequence}
                    className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-2.5 text-[11px] text-[#e4dacb] hover:border-[#d4b06a] hover:text-white disabled:opacity-45"
                  >
                    <Sparkles className="size-3 text-[#e7c27a]" /> Auto-Stage 3-Shot
                  </button>

                  <button
                    type="button"
                    onClick={captureCurrentKeyframe}
                    disabled={playingPath}
                    className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] text-[#cbbba6] hover:border-[#d4b06a] hover:text-white disabled:opacity-45"
                  >
                    <Plus className="size-3" /> Add Pose
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {playingPath ? (
                    <button
                      type="button"
                      data-testid="stop-flythrough-btn"
                      onClick={stopFlythrough}
                      className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-rose-400/50 bg-rose-500/20 px-3 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/30"
                    >
                      <Square className="size-3" /> Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      data-testid="play-flythrough-btn"
                      disabled={cameraKeyframes.length < 2}
                      onClick={() => playFlythrough(false)}
                      className="gold-fill inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold text-[#2a1c0c] disabled:opacity-45"
                    >
                      <Play className="size-3" /> Play 4s Flythrough
                    </button>
                  )}

                  <button
                    type="button"
                    data-testid="export-flythrough-btn"
                    disabled={cameraKeyframes.length < 2 || playingPath || recordingVideo}
                    onClick={() => playFlythrough(true)}
                    className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-[#d4b06a]/50 bg-[#d4b06a]/15 px-3 text-[11px] font-medium text-[#f6e7c8] hover:bg-[#d4b06a]/25 disabled:opacity-45"
                  >
                    <Video className="size-3" /> {recordingVideo ? "Recording 4s…" : "Export 4s Clip (.webm)"}
                  </button>

                  {exportedClipUrl ? (
                    <a
                      href={exportedClipUrl}
                      download="oriel-4s-flythrough.webm"
                      data-testid="download-flythrough-clip"
                      className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-emerald-400/50 bg-emerald-500/15 px-2.5 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/25"
                    >
                      <Download className="size-3" /> Save .webm
                    </a>
                  ) : null}

                  {cameraKeyframes.length > 0 && !playingPath ? (
                    <button
                      type="button"
                      onClick={clearCameraKeyframes}
                      className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/15 px-2.5 text-[11px] text-[#cbbba6] hover:text-white"
                    >
                      <Trash2 className="size-3" /> Clear
                    </button>
                  ) : null}
                </div>
              </div>

              {/* 4.0-Second Flythrough Timeline Bar & Scrubber */}
              <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                <span className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-[#b9aa95]">
                  4s Camera Path
                </span>
                <div className="relative h-1.5 min-w-[140px] flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    ref={flyProgressBarRef}
                    className="h-full rounded-full bg-[#e7c27a]"
                    style={{ width: `${Math.round(flythroughScrub * 100)}%` }}
                  />
                </div>
                <input
                  type="range"
                  aria-label="Scrub 4-second camera flythrough"
                  min={0}
                  max={1}
                  step={0.02}
                  disabled={cameraKeyframes.length < 2 || playingPath}
                  value={flythroughScrub}
                  onChange={(e) => scrubCameraPath(Number(e.target.value))}
                  className="h-1 w-24 accent-[#d4b06a] disabled:opacity-40"
                />
                <span
                  ref={flyTimeReadoutRef}
                  data-testid="flythrough-time-readout"
                  className="w-20 shrink-0 text-right font-mono text-[11px] text-[#f6e7c8] tabular-nums"
                >
                  {(flythroughScrub * 4).toFixed(1)}s / 4.0s
                </span>
              </div>

              {/* Recorded Camera Positions List */}
              {cameraKeyframes.length > 0 ? (
                <div data-testid="camera-keyframe-list" className="flex flex-wrap gap-1.5">
                  {cameraKeyframes.map((kf) => (
                    <div
                      key={kf.id}
                      data-keyframe-role={kf.role ?? "custom"}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px]"
                    >
                      <button
                        type="button"
                        disabled={playingPath}
                        onClick={() => {
                          applyCameraPoseToViewport(kf);
                          toast.message(`Previewing ${kf.label}`);
                        }}
                        className="inline-flex items-center gap-1.5 text-left hover:text-[#e7c27a] disabled:opacity-50"
                        title="Jump camera to this recorded pose"
                      >
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            kf.role === "orbit"
                              ? "bg-sky-400"
                              : kf.role === "dolly"
                                ? "bg-[#e7c27a]"
                                : kf.role === "zoom"
                                  ? "bg-emerald-400"
                                  : "bg-white/70",
                          )}
                        />
                        <span className="font-medium">{kf.label}</span>
                        <span className="hidden font-mono text-[10px] text-[#b9aa95] tabular-nums sm:inline">
                          [{kf.pos.map((v) => v.toFixed(1)).join(",")}]
                        </span>
                      </button>
                      <button
                        type="button"
                        disabled={playingPath}
                        onClick={() => removeCameraKeyframe(kf.id)}
                        aria-label={`Remove ${kf.label}`}
                        className="text-[#cbbba6] hover:text-rose-300 disabled:opacity-40"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[#9e8f7b]">
                  Record 3 camera positions (1. Orbit, 2. Dolly, 3. Zoom) or click Auto-Stage 3-Shot to generate smooth 4.0-second Catmull-Rom flythrough clips.
                </p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
