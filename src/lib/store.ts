import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { DEFAULT_FRAME, sanitizeFrame, type Frame } from "@/lib/frame";
import { parseImageDimensionsFromDataUrl } from "@/lib/image-aspect";
import { DEFAULT_PILLS, type PillKey, type Pills } from "@/lib/pills";
import { DEFAULT_DESIGN, GROUPS, LOOKS, sanitizeDesign, type DesignState, type PanelTab, type VerticalId } from "@/lib/properties";
import {
  DEFAULT_ENGINE,
  DEFAULT_SCENE3D,
  WORKFLOW_PRESETS,
  createQueueItem,
  normalizeQueueStatus,
  sanitizeEngineState,
  sanitizeScene3DState,
  updateQueueListStatus,
  type CameraPreset3D,
  type EngineState,
  type PublishedGalleryProject,
  type RenderQueueItem,
  type Scene3DState,
  type WorkflowPreset,
} from "@/lib/engines";
import {
  DEFAULT_HOUSE_STYLES,
  upsertRoleKeyframe,
  type CameraKeyframe,
  type FloorPlanBlueprint,
  type HouseStyleProfile,
  type PlacedEntourageItem,
  type ReviewPin,
} from "@/lib/archviz-suite";
import {
  applyMidLayerPromptToIdea,
  getMidLayerPresetById,
  type SavedDictionaryPrompt,
} from "@/lib/archviz-dictionary";
import {
  syncAdvancedToIdea,
  syncDesignFieldToIdea,
  syncEngineFieldToIdea,
  syncExtraToIdea,
  syncPickToIdea,
  syncTagToIdea,
  syncTargetToIdea,
  syncWorkflowPresetToIdea,
} from "@/lib/prompt-sync";
import {
  WORKFLOW_TEMPLATES,
  cloneWorkflow,
  type ExecutionMode,
  type NodeWorkflow,
  type WorkflowRevision,
} from "@/lib/node-studio";
import {
  removeMaterialAssignment,
  updateMaterialAssignmentProps,
  upsertMaterialAssignment,
  type MeshMaterialAssignment,
} from "@/lib/solar-and-materials";
import { buildIntentLookAppliedPrompt } from "@/lib/preset-transform";
import type { ModelId } from "@/lib/types";
import { buildTemplateCompiledNotes, type BriefTemplate } from "@/lib/brief-templates";
import type { SharedBriefSnapshot } from "@/lib/brief-collab";
import {
  applyMarketSuggestionBatch as applySuggestionBatchPure,
  applyMarketSuggestionPatch as applySuggestionPatchPure,
  type MarketSuggestion,
} from "@/lib/market-suggestions";
import {
  isPersistableCompactUrl,
  loadPlateBundleFromIdb,
  savePlateBundleToIdb,
  type CachedIteration,
} from "@/lib/plate-cache";
import {
  INTENT_LOOKS_40,
  PRESETS_200,
  buildDefaultDesignContract,
  evaluateFidelityGate,
  type DesignContractState,
  type FidelityGateReport,
} from "@/lib/presets-catalog";
import {
  DEFAULT_AGENT_MISSION,
  DEFAULT_GOVERNANCE_STATE,
  DEFAULT_KUM_VIDEO,
  DEFAULT_LOOK_ANCHOR,
  DEFAULT_TOUR_STATE,
  DEFAULT_TRACKED_REVIEWS,
  type AgentMissionState,
  type GovernanceState,
  type KumTimelineClip,
  type KumVideoState,
  type LookAnchorSnapshot,
  type NamedStudioId,
  type ReviewStatus,
  type TourHotspot,
  type TourSceneNode,
  type TourUnitRecord,
  type TrackedReviewItem,
  type VirtualTourState,
} from "@/lib/prd-studio-data";
import {
  DEFAULT_NANO_BANANA_CONFIG,
  type NanoBananaStudioConfig,
  type OrchestrationResponseClient,
} from "@/lib/nano-banana-client";
import {
  DEFAULT_BUDGET_STATE,
  sanitizeBudgetState,
  type BudgetCostMode,
  type BudgetState,
} from "@/lib/budget-guard";

export type SavedBrief = {
  id: string;
  title: string;
  boardId: string;
  model: ModelId;
  aspect: string;
  canonical: string;
  adapted: string;
  at: number;
};

export type LogEntry = {
  id: string;
  title: string;
  model: ModelId;
  text: string;
  at: number;
};

export type SeatRequest = {
  id: string;
  studio: string;
  email: string;
  note: string;
  at: number;
};

export type Draft = {
  key: string;
  values: Record<string, string>;
  model: ModelId;
  aspect: string;
};

export type Plate = {
  url: string;
  upload?: string;
  templateId: string;
  idea: string;
  fallback?: boolean;
  seed?: number;
  summary?: string;
};

export type Project = {
  id: string;
  name: string;
  design: DesignState;
  idea: string;
  at: number;
};

export type ChatLine = {
  id: string;
  role: "you" | "studio";
  text: string;
};

export type ConditioningChannels = {
  depth?: string;
  normal?: string;
  clay?: string;
  annotator?: string;
};

type State = {
  favorites: string[];
  boards: { id: string; name: string }[];
  briefs: SavedBrief[];
  savedDictionaryPrompts: SavedDictionaryPrompt[];
  log: LogEntry[];
  requests: SeatRequest[];
  draft: Draft | null;
  plate: Plate | null;
  upload: string | null;
  sketchDataUrl: string | null;
  maskDataUrl: string | null;
  binaryMaskDataUrl: string | null;
  binaryMaskStats: { width: number; height: number; activePixels: number; coveragePct: number } | null;
  conditioningChannels: ConditioningChannels;
  floorPlanBlueprint: FloorPlanBlueprint | null;
  houseStyles: HouseStyleProfile[];
  cameraKeyframes: CameraKeyframe[];
  entourageItems: PlacedEntourageItem[];
  reviewPins: ReviewPin[];
  variations: string[];
  queue: RenderQueueItem[];
  batchRunning: boolean;
  publishedGallery: PublishedGalleryProject[];
  engine: EngineState;
  scene3d: Scene3DState;
  meshMaterialOverrides: MeshMaterialAssignment[];
  midLayerPreset: string | null;
  dictionaryBlocks: string[];
  dictionaryParams: Record<string, Record<string, string>>;
  slotValues: Record<string, string>;
  recent: string[];
  activeKey: string;
  pills: Pills;
  design: DesignState;
  idea: string;
  frame: Frame;
  credits: number;
  history: string[];
  iterations: CachedIteration[];
  activeStudio: NamedStudioId;
  themeMode: "dark" | "light";
  splitViewMode: "split" | "3d-solo" | "ai-solo";
  splitRatio: number;
  radialOptics: {
    solarAzimuth: number;
    solarElevation: number;
    exposureEv: number;
    vignettePct: number;
    diffusionLock: number;
  };
  activePresetIds: string[];
  negativePresetIds: string[];
  presetStrengths: Record<string, number>;
  questionPicks: Record<string, string>;
  intentLookId: string;
  designContract: DesignContractState;
  fidelityReport: FidelityGateReport | null;
  lookAnchor: LookAnchorSnapshot;
  lookAnchorHistory: LookAnchorSnapshot[];
  trackedReviews: TrackedReviewItem[];
  tourConfig: VirtualTourState;
  videoProject: KumVideoState;
  agentMission: AgentMissionState;
  governance: GovernanceState;
  nanoBanana: NanoBananaStudioConfig;
  budget: BudgetState;
  lastOrchestration: OrchestrationResponseClient | null;
  projects: Project[];
  chat: ChatLine[];
  nodeWorkflows: NodeWorkflow[];
  activeNodeWorkflowId: string;
  nodeExecutionMode: ExecutionMode;
  nodeRevisions: WorkflowRevision[];
  autoApproveMode: boolean;
  approvedSuggestionIds: string[];
  appliedSuggestionIds: string[];
  beginnerGuideOpen: boolean;
  busy: boolean;
  selecting: boolean;
  past: DesignState[];
  future: DesignState[];
  toggleFavorite: (id: string) => void;
  addBoard: (name: string) => string;
  saveBrief: (brief: Omit<SavedBrief, "id" | "at">) => void;
  removeBrief: (id: string) => void;
  setSavedDictionaryPrompts: (prompts: SavedDictionaryPrompt[]) => void;
  pushLog: (entry: Omit<LogEntry, "id" | "at">) => void;
  clearLog: () => void;
  setDraft: (draft: Draft) => void;
  setPlate: (plate: Plate | null) => void;
  setUpload: (upload: string | null) => void;
  setSketchDataUrl: (url: string | null) => void;
  setMaskDataUrl: (url: string | null) => void;
  setBinaryMaskData: (
    binaryUrl: string | null,
    stats?: { width: number; height: number; activePixels: number; coveragePct: number } | null,
  ) => void;
  setConditioningChannel: (channel: keyof ConditioningChannels, url?: string) => void;
  clearConditioningChannels: () => void;
  setFloorPlanBlueprint: (blueprint: FloorPlanBlueprint | null) => void;
  addHouseStyle: (profile: HouseStyleProfile) => void;
  removeHouseStyle: (id: string) => void;
  addCameraKeyframe: (kf: CameraKeyframe) => void;
  upsertCameraKeyframe: (kf: CameraKeyframe) => void;
  setCameraKeyframes: (kfs: CameraKeyframe[]) => void;
  removeCameraKeyframe: (id: string) => void;
  clearCameraKeyframes: () => void;
  setEntourageItems: (items: PlacedEntourageItem[]) => void;
  addReviewPin: (pin: Omit<ReviewPin, "id" | "number" | "createdAt">) => ReviewPin;
  toggleReviewPinStatus: (id: string) => void;
  removeReviewPin: (id: string) => void;
  setReviewPins: (pins: ReviewPin[]) => void;
  setVariations: (urls: string[]) => void;
  enqueueRender: (
    label: string,
    preset: WorkflowPreset,
    light: string,
    options?: {
      cameraPreset?: CameraPreset3D;
      sunHour?: number;
      promptNote?: string;
      thumbnailUrl?: string;
      status?: RenderQueueItem["status"];
    },
  ) => RenderQueueItem;
  enqueueBatchMatrix: (
    specs: Array<{
      label: string;
      preset: WorkflowPreset;
      light: string;
      cameraPreset?: CameraPreset3D;
      sunHour?: number;
      promptNote?: string;
      thumbnailUrl?: string;
    }>,
  ) => RenderQueueItem[];
  updateQueueItem: (id: string, status: RenderQueueItem["status"], url?: string, extra?: { errorMessage?: string }) => void;
  requeueQueueItem: (id: string) => void;
  removeQueueItem: (id: string) => void;
  clearCompletedQueue: () => void;
  retryFailedQueue: () => void;
  clearQueue: () => void;
  setBatchRunning: (running: boolean) => void;
  publishToGallery: (entry: Omit<PublishedGalleryProject, "id" | "createdAt">) => PublishedGalleryProject;
  removePublishedProject: (id: string) => void;
  setEngineField: <K extends keyof EngineState>(key: K, value: EngineState[K]) => void;
  applyWorkflowPreset: (preset: WorkflowPreset) => void;
  applyMidLayerPreset: (presetId: string | null) => void;
  applyBriefTemplateConfig: (template: BriefTemplate, compiledPrompt?: string) => void;
  applySharedBriefState: (snapshot: SharedBriefSnapshot) => void;
  setDictionarySelection: (blockIds: string[], params?: Record<string, Record<string, string>>) => void;
  setDictionaryParam: (blockId: string, key: string, value: string) => void;
  resetEngine: () => void;
  setScene3DField: <K extends keyof Scene3DState>(key: K, value: Scene3DState[K]) => void;
  upsertMeshMaterial: (entry: MeshMaterialAssignment) => void;
  updateMeshMaterial: (
    objectId: string,
    patch: Partial<Pick<MeshMaterialAssignment, "roughness" | "metalness" | "clearcoat" | "opacity" | "hex" | "materialId" | "materialLabel" | "transparent">>,
  ) => void;
  deleteMeshMaterial: (objectId: string) => void;
  clearMeshMaterials: () => void;
  setSlotValues: (slotValues: Record<string, string>) => void;
  touchRecent: (id: string) => void;
  setActiveKey: (activeKey: string) => void;
  setPill: (key: PillKey, value: string) => void;
  setVertical: (vertical: VerticalId) => void;
  setPanel: (panel: PanelTab) => void;
  setDesignField: (
    field: "range" | "look" | "camera" | "light" | "mood" | "people" | "activity" | "color" | "weather" | "time" | "detail" | "strength",
    value: string,
  ) => void;
  setPick: (id: string, value: string) => void;
  setTarget: (target: string) => void;
  setAdvanced: (key: "light" | "air" | "season" | "change" | "grade", value: string) => void;
  toggleExtra: (id: string) => void;
  toggleTag: (tag: string) => void;
  setIdea: (idea: string) => void;
  setFrame: (frame: Frame) => void;
  setCredits: (credits: number) => void;
  setBusy: (busy: boolean) => void;
  setSelecting: (selecting: boolean) => void;
  pushChat: (role: ChatLine["role"], text: string) => void;
  saveProject: (name: string) => void;
  importProjectsBundle: (items: SavedProject[]) => number;
  openProject: (id: string) => void;
  removeProject: (id: string) => void;
  undo: () => void;
  redo: () => void;
  addRequest: (request: Omit<SeatRequest, "id" | "at">) => void;
  setActiveNodeWorkflowId: (id: string) => void;
  upsertNodeWorkflow: (workflow: NodeWorkflow) => void;
  createNodeWorkflowFromTemplate: (templateId?: string, name?: string) => NodeWorkflow;
  deleteNodeWorkflow: (id: string) => void;
  setNodeExecutionMode: (mode: ExecutionMode) => void;
  addNodeRevision: (rev: Omit<WorkflowRevision, "id" | "createdAt">) => void;
  restoreNodeRevision: (revId: string) => void;
  setAutoApproveMode: (enabled: boolean) => void;
  setBeginnerGuideOpen: (open: boolean) => void;
  approveMarketSuggestion: (id: string) => void;
  applyMarketSuggestion: (suggestion: MarketSuggestion) => void;
  applyMarketSuggestionBatch: (suggestions: MarketSuggestion[], autoApprove?: boolean) => void;
  resetAppliedMarketSuggestions: () => void;
  restoreIteration: (url: string) => void;
  setActiveStudio: (studio: NamedStudioId) => void;
  setThemeMode: (mode: "dark" | "light") => void;
  setSplitViewMode: (mode: "split" | "3d-solo" | "ai-solo") => void;
  setSplitRatio: (ratio: number) => void;
  setRadialOptics: (
    patch: Partial<{
      solarAzimuth: number;
      solarElevation: number;
      exposureEv: number;
      vignettePct: number;
      diffusionLock: number;
    }>,
  ) => void;
  togglePreset200: (id: string, forceMode?: "positive" | "negative") => void;
  setPresetStrength: (id: string, strength: number) => void;
  clearPresets200: () => void;
  setQuestionPick: (questionId: string, value: string) => void;
  applyIntentLook: (lookId: string) => void;
  updateDesignContract: (patch: Partial<DesignContractState>) => void;
  setFidelityReport: (report: FidelityGateReport | null) => void;
  reanchorLook: (patch?: Partial<LookAnchorSnapshot>) => void;
  setLookLockStrength: (strength: "strict" | "soft") => void;
  toggleLookAnchorLock: () => void;
  restoreLookAnchor: (version: number) => void;
  addTrackedReview: (item: Omit<TrackedReviewItem, "id" | "number" | "updatedAt" | "history">) => void;
  transitionTrackedReview: (id: string, toStatus: ReviewStatus, actor?: string, note?: string) => void;
  replyTrackedReview: (id: string, actor: string, note: string) => void;
  updateTourConfig: (patch: Partial<VirtualTourState>) => void;
  addTourScene: (scene: TourSceneNode) => void;
  addTourHotspot: (hotspot: Omit<TourHotspot, "id">) => void;
  removeTourHotspot: (id: string) => void;
  updateUnitStatus: (unitId: string, status: TourUnitRecord["status"]) => void;
  updateVideoProject: (patch: Partial<KumVideoState>) => void;
  addClipToKumVideo: (clip: Omit<KumTimelineClip, "id" | "startSec">) => void;
  updateClipInKumVideo: (id: string, patch: Partial<Pick<KumTimelineClip, "cameraMove" | "durationSec" | "label" | "transition">>) => void;
  removeClipFromKumVideo: (id: string) => void;
  updateAgentMission: (patch: Partial<AgentMissionState>) => void;
  advanceAgentMissionStep: (stepId: string, status: AgentMissionState["steps"][number]["status"], summary?: string) => void;
  resetAgentMission: () => void;
  updateGovernance: (patch: Partial<GovernanceState>) => void;
  appendAuditEvent: (actor: string, action: string, target: string) => void;
  updateNanoBanana: (patch: Partial<NanoBananaStudioConfig>) => void;
  setBudgetState: (next: BudgetState) => void;
  updateBudgetConfig: (patch: { capPaise?: number; costMode?: BudgetCostMode; maxPerImagePaise?: number; autoFallbackOnCap?: boolean }) => void;
  resetBudgetSpendLocal: () => void;
  setLastOrchestration: (res: OrchestrationResponseClient | null) => void;
};

function remember(state: { design: DesignState; past: DesignState[] }, design: DesignState) {
  return { design, past: [...state.past, state.design].slice(-20), future: [] as DesignState[] };
}

export const useOriel = create<State>()(
  persist(
    (set, get) => ({
      favorites: [],
      boards: [{ id: "working", name: "Working set" }],
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
        exposureEv: 0.6,
        vignettePct: 18,
        diffusionLock: 85,
      },
      activePresetIds: ["P001", "P041"],
      negativePresetIds: ["P181"],
      presetStrengths: { P001: 1.0, P041: 1.0, P181: 1.0 },
      questionPicks: {
        camera: "Auto",
        time: "Auto",
        weather: "Auto",
        mood: "Auto",
        materials: "Auto",
        people: "Auto",
        site: "Auto",
        finish: "Auto",
      },
      intentLookId: INTENT_LOOKS_40[0].id,
      designContract: buildDefaultDesignContract({
        hasUpload: false,
        hasSketch: false,
        vertical: DEFAULT_DESIGN.vertical,
        look: DEFAULT_DESIGN.look,
        fidelity: DEFAULT_ENGINE.renderFidelity,
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
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((item) => item !== id)
            : [id, ...state.favorites],
        })),
      addBoard: (name) => {
        const base =
          name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || "board";
        const id = get().boards.some((board) => board.id === base) ? `${base}-${Date.now()}` : base;
        set((state) => ({ boards: [...state.boards, { id, name: name.trim() || "Untitled" }] }));
        return id;
      },
      saveBrief: (brief) =>
        set((state) => ({
          briefs: [{ ...brief, id: `b-${Date.now()}`, at: Date.now() }, ...state.briefs].slice(0, 48),
        })),
      removeBrief: (id) => set((state) => ({ briefs: state.briefs.filter((item) => item.id !== id) })),
      setSavedDictionaryPrompts: (savedDictionaryPrompts) =>
        set({ savedDictionaryPrompts: savedDictionaryPrompts.slice(0, 200) }),
      pushLog: (entry) =>
        set((state) => ({
          log: [{ ...entry, id: `l-${Date.now()}`, at: Date.now() }, ...state.log].slice(0, 30),
        })),
      clearLog: () => set({ log: [] }),
      setDraft: (draft) => set({ draft }),
      setPlate: (plate) =>
        set((state) => {
          if (!plate) {
            void savePlateBundleToIdb({
              plate: null,
              history: state.history,
              iterations: state.iterations,
              upload: state.upload,
              savedAt: Date.now(),
            });
            return { plate: null, fidelityReport: null };
          }
          const nextHistory = [
            plate.url,
            ...state.history.filter((url) => url !== plate.url),
          ].slice(0, 12);
          const report = evaluateFidelityGate({
            geometryLock: state.engine.geometryLock,
            seedLocked: state.engine.seedLocked,
            hasSource: Boolean(state.upload || state.sketchDataUrl),
            isFallback: plate.fallback,
            hasMask: Boolean(state.maskDataUrl),
            disclosureRequired: Boolean(
              INTENT_LOOKS_40.find((item) => item.id === state.intentLookId)?.disclosureRequired,
            ),
            idea: plate.idea || state.idea,
            scene3d: state.scene3d,
            frame: state.frame,
          });
          const iterRecord: CachedIteration = {
            id: `iter-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
            createdAt: Date.now(),
          };
          const nextIterations = [
            iterRecord,
            ...state.iterations.filter((item) => item.url !== plate.url),
          ].slice(0, 12);

          void savePlateBundleToIdb({
            plate,
            history: nextHistory,
            iterations: nextIterations,
            upload: state.upload,
            savedAt: Date.now(),
          });

          return {
            plate,
            history: nextHistory,
            iterations: nextIterations,
            fidelityReport: report,
          };
        }),
      setUpload: (upload) =>
        set((state) => {
          const uploadDims = parseImageDimensionsFromDataUrl(upload);
          const nextFrame = uploadDims
            ? sanitizeFrame({ ...state.frame, ratio: uploadDims.frameRatio })
            : state.frame;
          const nextNanoBanana = uploadDims
            ? {
                ...state.nanoBanana,
                aspectRatio: uploadDims.geminiRatio,
                generationMode:
                  state.nanoBanana.generationMode === "text_to_image"
                    ? ("image_to_image" as const)
                    : state.nanoBanana.generationMode,
              }
            : state.nanoBanana;
          const nextEngine = upload
            ? sanitizeEngineState({
                ...state.engine,
                geometryLock: Math.max(90, state.engine.geometryLock),
              })
            : state.engine;
          const nextContract = buildDefaultDesignContract({
            hasUpload: Boolean(upload),
            hasSketch: Boolean(state.sketchDataUrl),
            vertical: state.design.vertical,
            look: state.design.look,
            fidelity: nextEngine.renderFidelity,
          });
          void savePlateBundleToIdb({
            plate: state.plate,
            history: state.history,
            iterations: state.iterations,
            upload,
            savedAt: Date.now(),
          });
          return {
            upload,
            frame: nextFrame,
            nanoBanana: nextNanoBanana,
            engine: nextEngine,
            radialOptics: upload
              ? { ...state.radialOptics, diffusionLock: nextEngine.geometryLock }
              : state.radialOptics,
            conditioningChannels: upload ? {} : state.conditioningChannels,
            designContract: nextContract,
          };
        }),
      setSketchDataUrl: (sketchDataUrl) => set({ sketchDataUrl }),
      setMaskDataUrl: (maskDataUrl) => set({ maskDataUrl }),
      setBinaryMaskData: (binaryMaskDataUrl, binaryMaskStats = null) =>
        set({ binaryMaskDataUrl, binaryMaskStats }),
      setConditioningChannel: (channel, url) =>
        set((state) => ({
          conditioningChannels: { ...state.conditioningChannels, [channel]: url },
        })),
      clearConditioningChannels: () => set({ conditioningChannels: {} }),
      setFloorPlanBlueprint: (floorPlanBlueprint) => set({ floorPlanBlueprint }),
      addHouseStyle: (profile) =>
        set((state) => ({
          houseStyles: [profile, ...state.houseStyles.filter((s) => s.id !== profile.id)].slice(0, 12),
          engine: sanitizeEngineState({ ...state.engine, houseStyleId: profile.id }),
        })),
      removeHouseStyle: (id) =>
        set((state) => ({
          houseStyles: state.houseStyles.filter((s) => s.id !== id),
          engine:
            state.engine.houseStyleId === id
              ? sanitizeEngineState({ ...state.engine, houseStyleId: null })
              : state.engine,
        })),
      addCameraKeyframe: (kf) =>
        set((state) => ({
          cameraKeyframes: [...state.cameraKeyframes, kf].slice(0, 6),
        })),
      upsertCameraKeyframe: (kf) =>
        set((state) => ({
          cameraKeyframes: upsertRoleKeyframe(state.cameraKeyframes, kf),
        })),
      setCameraKeyframes: (cameraKeyframes) =>
        set({ cameraKeyframes: cameraKeyframes.slice(0, 6) }),
      removeCameraKeyframe: (id) =>
        set((state) => ({
          cameraKeyframes: state.cameraKeyframes.filter((kf) => kf.id !== id),
        })),
      clearCameraKeyframes: () => set({ cameraKeyframes: [] }),
      setEntourageItems: (entourageItems) => set({ entourageItems: entourageItems.slice(0, 24) }),
      addReviewPin: (pin) => {
        const current = get().reviewPins;
        const projPins = current.filter((p) => p.projectId === pin.projectId);
        const created: ReviewPin = {
          ...pin,
          id: `pin-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          number: projPins.length + 1,
          createdAt: Date.now(),
        };
        set({ reviewPins: [...current, created].slice(-60) });
        return created;
      },
      toggleReviewPinStatus: (id) =>
        set((state) => ({
          reviewPins: state.reviewPins.map((p) =>
            p.id === id ? { ...p, status: p.status === "open" ? "resolved" : "open" } : p,
          ),
        })),
      removeReviewPin: (id) =>
        set((state) => ({
          reviewPins: state.reviewPins.filter((p) => p.id !== id),
        })),
      setReviewPins: (pins) =>
        set((state) => {
          const existingIds = new Set(state.reviewPins.map((p) => p.id));
          const merged = [...state.reviewPins, ...pins.filter((p) => !existingIds.has(p.id))];
          return { reviewPins: merged.slice(-60) };
        }),
      setVariations: (variations) => set({ variations: variations.slice(0, 4) }),
      enqueueRender: (label, preset, light, options) => {
        const item = createQueueItem(label, preset, light, options);
        set((state) => ({ queue: [...state.queue, item].slice(-24) }));
        return item;
      },
      enqueueBatchMatrix: (specs) => {
        const items = specs.map((spec) =>
          createQueueItem(spec.label, spec.preset, spec.light, {
            cameraPreset: spec.cameraPreset,
            sunHour: spec.sunHour,
            promptNote: spec.promptNote,
            thumbnailUrl: spec.thumbnailUrl,
            status: "pending",
          }),
        );
        set((state) => ({ queue: [...state.queue, ...items].slice(-24) }));
        return items;
      },
      updateQueueItem: (id, status, url, extra) =>
        set((state) => ({ queue: updateQueueListStatus(state.queue, id, status, url, extra) })),
      requeueQueueItem: (id) =>
        set((state) => ({
          queue: state.queue.map((item) =>
            item.id === id
              ? { ...item, status: "pending", errorMessage: undefined, finishedAt: undefined, durationMs: undefined }
              : item,
          ),
        })),
      removeQueueItem: (id) => set((state) => ({ queue: state.queue.filter((item) => item.id !== id) })),
      clearCompletedQueue: () =>
        set((state) => ({
          queue: state.queue.filter((item) => normalizeQueueStatus(item.status) !== "completed"),
        })),
      retryFailedQueue: () =>
        set((state) => ({
          queue: state.queue.map((item) =>
            normalizeQueueStatus(item.status) === "error"
              ? { ...item, status: "pending", errorMessage: undefined }
              : item,
          ),
        })),
      clearQueue: () => set({ queue: [], batchRunning: false }),
      setBatchRunning: (batchRunning) => set({ batchRunning }),
      publishToGallery: (entry) => {
        const item: PublishedGalleryProject = {
          ...entry,
          id: `pub-${Date.now()}`,
          createdAt: Date.now(),
        };
        set((state) => ({ publishedGallery: [item, ...state.publishedGallery].slice(0, 12) }));
        return item;
      },
      removePublishedProject: (id) =>
        set((state) => ({ publishedGallery: state.publishedGallery.filter((item) => item.id !== id) })),
      setEngineField: (key, value) =>
        set((state) => ({
          engine: sanitizeEngineState({ ...state.engine, [key]: value }),
          idea: syncEngineFieldToIdea(state.idea, key, value),
        })),
      applyWorkflowPreset: (preset) =>
        set((state) => {
          const found = WORKFLOW_PRESETS.find((item) => item.id === preset);
          return {
            engine: sanitizeEngineState({
              ...state.engine,
              workflowPreset: preset,
              ...(found?.defaults ?? {}),
            }),
            idea: syncWorkflowPresetToIdea(state.idea, preset),
          };
        }),
      applyMidLayerPreset: (presetId) =>
        set((state) => {
          if (!presetId || state.midLayerPreset === presetId) {
            return {
              midLayerPreset: null,
              idea: applyMidLayerPromptToIdea(state.idea, null),
            };
          }
          const preset = getMidLayerPresetById(presetId);
          if (!preset) return state;
          const nextDesign = sanitizeDesign({
            ...state.design,
            ...(preset.designPatch ?? {}),
            advanced: preset.advancedPatch ? { ...state.design.advanced, ...preset.advancedPatch } : state.design.advanced,
          });
          const nextEngine = sanitizeEngineState({
            ...state.engine,
            ...(preset.enginePatch ?? {}),
          });
          const nextScene3D = sanitizeScene3DState({
            ...state.scene3d,
            ...(preset.scene3dPatch ?? {}),
          });
          const nextParams = preset.parameters
            ? { ...state.dictionaryParams, ...preset.parameters }
            : state.dictionaryParams;
          return {
            midLayerPreset: preset.id,
            idea: applyMidLayerPromptToIdea(state.idea, preset),
            dictionaryBlocks: [...preset.blockIds],
            dictionaryParams: nextParams,
            design: nextDesign,
            engine: nextEngine,
            scene3d: nextScene3D,
          };
        }),
      applyBriefTemplateConfig: (template, compiledPrompt) =>
        set((state) => {
          const vertical = template.designPatch.vertical ?? state.design.vertical;
          const basePicks = Object.fromEntries(
            GROUPS[vertical].map((g) => [g.id, template.designPatch.picks?.[g.id] ?? g.options[0]]),
          );
          const nextDesign = sanitizeDesign({
            ...state.design,
            ...template.designPatch,
            vertical,
            picks: {
              ...basePicks,
              ...(template.designPatch.picks ?? {}),
            },
          });
          const nextEngine = sanitizeEngineState({
            ...state.engine,
            ...template.enginePatch,
          });
          const nextScene3D = sanitizeScene3DState({
            ...state.scene3d,
            ...template.scene3dPatch,
          });
          const nextFrame = sanitizeFrame({
            ...state.frame,
            ratio: template.frameRatio,
            resolution: template.frameResolution,
          });
          return {
            design: nextDesign,
            engine: nextEngine,
            scene3d: nextScene3D,
            frame: nextFrame,
            dictionaryBlocks: [...template.dictionaryBlocks].slice(0, 64),
            midLayerPreset: null,
            idea: compiledPrompt?.trim() || buildTemplateCompiledNotes(template),
          };
        }),
      applySharedBriefState: (snapshot) =>
        set(() => ({
          design: sanitizeDesign(snapshot.design),
          engine: sanitizeEngineState(snapshot.engine),
          scene3d: sanitizeScene3DState(snapshot.scene3d),
          frame: sanitizeFrame(snapshot.frame),
          dictionaryBlocks: [...(snapshot.dictionaryBlocks ?? [])].slice(0, 64),
          dictionaryParams: snapshot.dictionaryParams ?? {},
          idea: snapshot.synthesizedPrompt || snapshot.customNotes || "",
        })),
      setDictionarySelection: (dictionaryBlocks, params) =>
        set((state) => ({
          dictionaryBlocks: [...dictionaryBlocks].slice(0, 64),
          dictionaryParams: params ?? state.dictionaryParams,
        })),
      setDictionaryParam: (blockId, key, value) =>
        set((state) => ({
          dictionaryParams: {
            ...state.dictionaryParams,
            [blockId]: {
              ...(state.dictionaryParams[blockId] ?? {}),
              [key]: value,
            },
          },
        })),
      resetEngine: () => set({ engine: DEFAULT_ENGINE, midLayerPreset: null }),
      setScene3DField: (key, value) =>
        set((state) => ({
          scene3d: sanitizeScene3DState({ ...state.scene3d, [key]: value }),
        })),
      upsertMeshMaterial: (entry) =>
        set((state) => ({
          meshMaterialOverrides: upsertMaterialAssignment(state.meshMaterialOverrides, entry),
        })),
      updateMeshMaterial: (objectId, patch) =>
        set((state) => ({
          meshMaterialOverrides: updateMaterialAssignmentProps(state.meshMaterialOverrides, objectId, patch),
        })),
      deleteMeshMaterial: (objectId) =>
        set((state) => ({
          meshMaterialOverrides: removeMaterialAssignment(state.meshMaterialOverrides, objectId),
        })),
      clearMeshMaterials: () => set({ meshMaterialOverrides: [] }),
      setSlotValues: (slotValues) => set({ slotValues }),
      touchRecent: (id) =>
        set((state) => ({ recent: [id, ...state.recent.filter((item) => item !== id)].slice(0, 6) })),
      setActiveKey: (activeKey) => set({ activeKey }),
      setPill: (key, value) => set((state) => ({ pills: { ...state.pills, [key]: value } })),
      setVertical: (vertical) =>
        set((state) => {
          const look = LOOKS[vertical].some((item) => item.name === state.design.look)
            ? state.design.look
            : LOOKS[vertical][0].name;
          const picks = Object.fromEntries(GROUPS[vertical].map((group) => [group.id, state.design.picks[group.id] ?? group.options[0]]));
          return remember(state, sanitizeDesign({ ...state.design, vertical, look, picks, panel: "design", target: "whole" }));
        }),
      setPanel: (panel) => set((state) => ({ design: { ...state.design, panel } })),
      setDesignField: (field, value) =>
        set((state) => ({
          ...remember(state, sanitizeDesign({ ...state.design, [field]: value })),
          idea: syncDesignFieldToIdea(state.idea, field, value),
        })),
      setPick: (id, value) =>
        set((state) => {
          const picks = { ...state.design.picks, [id]: value };
          let rooms = state.design.rooms;
          if (state.design.vertical === "interior") {
            const room = id === "room" ? value : (picks.room ?? "Living room");
            if (id === "room" && state.design.rooms[value]) Object.assign(picks, state.design.rooms[value], { room: value });
            rooms = { ...state.design.rooms, [room]: { ...picks } };
          }
          return {
            ...remember(state, sanitizeDesign({ ...state.design, picks, rooms })),
            idea: syncPickToIdea(state.idea, state.design.vertical, id, value),
          };
        }),
      setTarget: (target) =>
        set((state) => ({
          ...remember(state, sanitizeDesign({ ...state.design, target })),
          idea: syncTargetToIdea(state.idea, target),
        })),
      setAdvanced: (key, value) =>
        set((state) => ({
          ...remember(state, sanitizeDesign({ ...state.design, advanced: { ...state.design.advanced, [key]: value } })),
          idea: syncAdvancedToIdea(state.idea, key, value),
        })),
      toggleExtra: (id) =>
        set((state) => {
          const extras = state.design.advanced.extras.includes(id)
            ? state.design.advanced.extras.filter((item) => item !== id)
            : [...state.design.advanced.extras, id];
          return {
            ...remember(state, sanitizeDesign({ ...state.design, advanced: { ...state.design.advanced, extras } })),
            idea: syncExtraToIdea(state.idea, id, extras),
          };
        }),
      toggleTag: (tag) =>
        set((state) => {
          const tags = state.design.tags.includes(tag)
            ? state.design.tags.filter((item) => item !== tag)
            : [...state.design.tags, tag];
          return {
            ...remember(state, sanitizeDesign({ ...state.design, tags })),
            idea: syncTagToIdea(state.idea, tag, tags),
          };
        }),
      setIdea: (idea) => set({ idea }),
      setFrame: (frame) => set({ frame: sanitizeFrame(frame) }),
      setCredits: (credits) => set({ credits: Math.max(0, Math.min(5000, Math.round(credits))) }),
      setBusy: (busy) => set({ busy }),
      setSelecting: (selecting) => set({ selecting }),
      pushChat: (role, text) =>
        set((state) => ({
          chat: [...state.chat, { id: `c-${Date.now()}`, role, text: text.slice(0, 240) }].slice(-12),
        })),
      saveProject: (name) =>
        set((state) => ({
          projects: [
            {
              id: `p-${Date.now()}`,
              name: name.trim().slice(0, 48) || "Untitled",
              design: sanitizeDesign(state.design),
              idea: state.idea,
              at: Date.now(),
            },
            ...state.projects,
          ].slice(0, 24),
        })),
      importProjectsBundle: (items) => {
        const valid = items.filter((p) => p && typeof p.id === "string" && typeof p.name === "string" && p.design);
        if (valid.length === 0) return 0;
        set((state) => {
          const existingIds = new Set(state.projects.map((p) => p.id));
          const merged = [
            ...valid
              .filter((p) => !existingIds.has(p.id))
              .map((p) => ({
                ...p,
                name: p.name.trim().slice(0, 48) || "Imported Project",
                design: sanitizeDesign(p.design),
              })),
            ...state.projects,
          ].slice(0, 32);
          return { projects: merged };
        });
        return valid.length;
      },
      openProject: (id) =>
        set((state) => {
          const project = state.projects.find((item) => item.id === id);
          if (!project) return state;
          return { design: sanitizeDesign(project.design), idea: project.idea, past: [], future: [] };
        }),
      removeProject: (id) => set((state) => ({ projects: state.projects.filter((item) => item.id !== id) })),
      undo: () =>
        set((state) => {
          const previous = state.past[state.past.length - 1];
          if (!previous) return state;
          return { design: previous, past: state.past.slice(0, -1), future: [state.design, ...state.future].slice(0, 20) };
        }),
      redo: () =>
        set((state) => {
          const next = state.future[0];
          if (!next) return state;
          return { design: next, future: state.future.slice(1), past: [...state.past, state.design].slice(-20) };
        }),
      addRequest: (request) =>
        set((state) => ({
          requests: [{ ...request, id: `r-${Date.now()}`, at: Date.now() }, ...state.requests].slice(0, 12),
        })),
      setActiveNodeWorkflowId: (activeNodeWorkflowId) => set({ activeNodeWorkflowId }),
      upsertNodeWorkflow: (workflow) =>
        set((state) => {
          const exists = state.nodeWorkflows.some((w) => w.id === workflow.id);
          const updated = { ...workflow, updatedAt: Date.now() };
          return {
            nodeWorkflows: exists
              ? state.nodeWorkflows.map((w) => (w.id === workflow.id ? updated : w))
              : [updated, ...state.nodeWorkflows].slice(0, 20),
          };
        }),
      createNodeWorkflowFromTemplate: (templateId, name) => {
        const tpl =
          WORKFLOW_TEMPLATES.find((t) => t.id === templateId) ?? WORKFLOW_TEMPLATES[0];
        const cloned = cloneWorkflow(tpl);
        const created: NodeWorkflow = {
          ...cloned,
          id: `wf-${Date.now().toString(36)}`,
          name: name?.trim() || `${tpl.name} Copy`,
          updatedAt: Date.now(),
        };
        set((state) => ({
          nodeWorkflows: [created, ...state.nodeWorkflows].slice(0, 20),
          activeNodeWorkflowId: created.id,
        }));
        return created;
      },
      deleteNodeWorkflow: (id) =>
        set((state) => {
          const remaining = state.nodeWorkflows.filter((w) => w.id !== id);
          const nextList = remaining.length > 0 ? remaining : WORKFLOW_TEMPLATES.map(cloneWorkflow);
          return {
            nodeWorkflows: nextList,
            activeNodeWorkflowId:
              state.activeNodeWorkflowId === id ? nextList[0].id : state.activeNodeWorkflowId,
          };
        }),
      setNodeExecutionMode: (nodeExecutionMode) => set({ nodeExecutionMode }),
      addNodeRevision: (rev) =>
        set((state) => ({
          nodeRevisions: [
            {
              ...rev,
              id: `nrev-${Date.now().toString(36)}`,
              createdAt: Date.now(),
              outputPreviewUrl:
                rev.outputPreviewUrl && rev.outputPreviewUrl.length > 65000
                  ? undefined
                  : rev.outputPreviewUrl,
            },
            ...state.nodeRevisions,
          ].slice(0, 20),
        })),
      restoreNodeRevision: (revId) =>
        set((state) => {
          const found = state.nodeRevisions.find((r) => r.id === revId);
          if (!found) return state;
          const restored = cloneWorkflow(found.snapshot);
          return {
            activeNodeWorkflowId: restored.id,
            nodeWorkflows: state.nodeWorkflows.some((w) => w.id === restored.id)
              ? state.nodeWorkflows.map((w) => (w.id === restored.id ? restored : w))
              : [restored, ...state.nodeWorkflows].slice(0, 20),
          };
        }),
      setAutoApproveMode: (autoApproveMode) => set({ autoApproveMode }),
      setBeginnerGuideOpen: (beginnerGuideOpen) => set({ beginnerGuideOpen }),
      approveMarketSuggestion: (id) =>
        set((state) => ({
          approvedSuggestionIds: state.approvedSuggestionIds.includes(id)
            ? state.approvedSuggestionIds
            : [...state.approvedSuggestionIds, id].slice(-200),
        })),
      applyMarketSuggestion: (suggestion) =>
        set((state) => {
          const patched = applySuggestionPatchPure(
            {
              idea: state.idea,
              design: state.design,
              engine: state.engine,
              scene3d: state.scene3d,
              frame: state.frame,
            },
            suggestion,
          );
          return {
            ...remember(state, patched.design),
            idea: patched.idea,
            engine: patched.engine,
            scene3d: patched.scene3d,
            frame: patched.frame,
            approvedSuggestionIds: state.approvedSuggestionIds.includes(suggestion.id)
              ? state.approvedSuggestionIds
              : [...state.approvedSuggestionIds, suggestion.id].slice(-200),
            appliedSuggestionIds: state.appliedSuggestionIds.includes(suggestion.id)
              ? state.appliedSuggestionIds
              : [...state.appliedSuggestionIds, suggestion.id].slice(-200),
          };
        }),
      applyMarketSuggestionBatch: (suggestions, autoApprove = true) =>
        set((state) => {
          if (suggestions.length === 0) return state;
          const patched = applySuggestionBatchPure(
            {
              idea: state.idea,
              design: state.design,
              engine: state.engine,
              scene3d: state.scene3d,
              frame: state.frame,
            },
            suggestions,
          );
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
            appliedSuggestionIds: [...nextApplied].slice(-200),
          };
        }),
      resetAppliedMarketSuggestions: () => set({ approvedSuggestionIds: [], appliedSuggestionIds: [] }),
      restoreIteration: (url) =>
        set((state) => {
          const found = state.iterations.find((item) => item.url === url);
          const restoredPlate: Plate = {
            url,
            upload: found?.upload ?? state.upload ?? undefined,
            templateId: found?.templateId ?? state.engine.workflowPreset,
            idea: found?.idea ?? state.idea.trim(),
            seed: found?.seed ?? state.engine.seed,
            fallback: found?.fallback,
            summary: found?.summary,
          };
          const report = evaluateFidelityGate({
            geometryLock: state.engine.geometryLock,
            seedLocked: state.engine.seedLocked,
            hasSource: Boolean(state.upload || state.sketchDataUrl),
            isFallback: restoredPlate.fallback,
            idea: restoredPlate.idea,
            scene3d: state.scene3d,
            frame: state.frame,
          });
          return {
            plate: restoredPlate,
            fidelityReport: report,
            ...(found?.idea ? { idea: found.idea } : {}),
          };
        }),
      setActiveStudio: (activeStudio) => set({ activeStudio }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setSplitViewMode: (splitViewMode) => set({ splitViewMode }),
      setSplitRatio: (ratio) => set({ splitRatio: Math.max(20, Math.min(80, Math.round(ratio))) }),
      setRadialOptics: (patch) =>
        set((state) => {
          const next = { ...state.radialOptics, ...patch };
          const nextScene3D = sanitizeScene3DState({
            ...state.scene3d,
            ...(typeof patch.solarAzimuth === "number" ? { sunAzimuth: patch.solarAzimuth } : {}),
            ...(typeof patch.solarElevation === "number" ? { sunElevation: patch.solarElevation } : {}),
          });
          const nextEngine = sanitizeEngineState({
            ...state.engine,
            ...(typeof patch.diffusionLock === "number" ? { geometryLock: patch.diffusionLock } : {}),
          });
          return { radialOptics: next, scene3d: nextScene3D, engine: nextEngine };
        }),
      togglePreset200: (id, forceMode) =>
        set((state) => {
          const preset = PRESETS_200.find((p) => p.id === id);
          if (!preset) return state;
          const asNeg = forceMode === "negative" || (forceMode !== "positive" && preset.is_negative);
          if (asNeg) {
            const exists = state.negativePresetIds.includes(id);
            return {
              negativePresetIds: exists
                ? state.negativePresetIds.filter((x) => x !== id)
                : [...state.negativePresetIds, id].slice(-12),
              activePresetIds: state.activePresetIds.filter((x) => x !== id),
            };
          }
          const exists = state.activePresetIds.includes(id);
          return {
            activePresetIds: exists
              ? state.activePresetIds.filter((x) => x !== id)
              : [...state.activePresetIds, id].slice(-12),
            negativePresetIds: state.negativePresetIds.filter((x) => x !== id),
          };
        }),
      setPresetStrength: (id, strength) =>
        set((state) => ({
          presetStrengths: {
            ...state.presetStrengths,
            [id]: Math.max(0.5, Math.min(1.5, Number(strength.toFixed(2)))),
          },
        })),
      clearPresets200: () => set({ activePresetIds: [], negativePresetIds: [] }),
      setQuestionPick: (questionId, value) =>
        set((state) => ({
          questionPicks: { ...state.questionPicks, [questionId]: value },
        })),
      applyIntentLook: (lookId) =>
        set((state) => {
          const look = INTENT_LOOKS_40.find(
            (item) => item.id === lookId || item.code.toLowerCase() === lookId.toLowerCase(),
          );
          if (!look) return state;
          const hasUpload = Boolean(state.upload);
          const nextDesign = sanitizeDesign({
            ...state.design,
            vertical: hasUpload ? state.design.vertical : look.vertical,
            light: look.light as DesignState["light"],
            mood: look.mood as DesignState["mood"],
          });
          const nextGeometryLock = hasUpload
            ? look.fidelity === "Strict"
              ? 92
              : look.fidelity === "Balanced"
                ? 82
                : 72
            : look.fidelity === "Strict"
              ? 90
              : look.fidelity === "Balanced"
                ? 72
                : 48;
          const nextEngine = sanitizeEngineState({
            ...state.engine,
            renderFidelity: look.fidelity === "Creative" ? "draft" : look.fidelity === "Strict" ? "editorial" : "photoreal",
            geometryLock: nextGeometryLock,
          });
          const presetLookup = new Map(PRESETS_200.map((p) => [p.id, p]));
          const positiveIds: string[] = [];
          const negativeIds: string[] = [];
          for (const pid of look.presetIds) {
            if (presetLookup.get(pid)?.is_negative) negativeIds.push(pid);
            else positiveIds.push(pid);
          }
          const appliedIdea = buildIntentLookAppliedPrompt(look, PRESETS_200, {
            hasUpload,
            design: nextDesign,
            preserveClause: state.designContract.lockedPreserve ? state.designContract.preserveClause : undefined,
          });
          return {
            intentLookId: look.id,
            design: nextDesign,
            engine: nextEngine,
            idea: appliedIdea,
            activePresetIds: positiveIds,
            negativePresetIds: negativeIds,
            radialOptics: { ...state.radialOptics, diffusionLock: nextEngine.geometryLock },
          };
        }),
      updateDesignContract: (patch) =>
        set((state) => ({
          designContract: { ...state.designContract, ...patch },
        })),
      setFidelityReport: (fidelityReport) => set({ fidelityReport }),
      reanchorLook: (patch) =>
        set((state) => {
          const nextVer = state.lookAnchor.version + 1;
          const nextAnchor: LookAnchorSnapshot = {
            ...state.lookAnchor,
            ...patch,
            thumbnailUrl: patch?.thumbnailUrl ?? state.plate?.url ?? state.lookAnchor.thumbnailUrl,
            version: nextVer,
            locked: true,
            createdAt: Date.now(),
          };
          return {
            lookAnchor: nextAnchor,
            lookAnchorHistory: [nextAnchor, ...state.lookAnchorHistory].slice(0, 8),
          };
        }),
      setLookLockStrength: (lockStrength) =>
        set((state) => ({ lookAnchor: { ...state.lookAnchor, lockStrength } })),
      toggleLookAnchorLock: () =>
        set((state) => ({ lookAnchor: { ...state.lookAnchor, locked: !state.lookAnchor.locked } })),
      restoreLookAnchor: (version) =>
        set((state) => {
          const found = state.lookAnchorHistory.find((a) => a.version === version);
          return found ? { lookAnchor: { ...found, locked: true } } : state;
        }),
      addTrackedReview: (item) =>
        set((state) => {
          const num = state.trackedReviews.reduce((m, r) => Math.max(m, r.number), 0) + 1;
          const created: TrackedReviewItem = {
            ...item,
            id: `rev-${Date.now()}`,
            number: num,
            updatedAt: Date.now(),
            history: [
              {
                id: `rh-${Date.now()}`,
                actor: item.author || "Studio User",
                action: `Opened review #${num}`,
                toStatus: item.status,
                at: Date.now(),
              },
            ],
          };
          return { trackedReviews: [created, ...state.trackedReviews].slice(0, 48) };
        }),
      transitionTrackedReview: (id, toStatus, actor = "Studio Lead", note) =>
        set((state) => ({
          trackedReviews: state.trackedReviews.map((rev) =>
            rev.id === id
              ? {
                  ...rev,
                  status: toStatus,
                  updatedAt: Date.now(),
                  history: [
                    ...rev.history,
                    {
                      id: `rh-${Date.now()}`,
                      actor,
                      action: `Changed status to ${toStatus.replace("_", " ")}`,
                      fromStatus: rev.status,
                      toStatus,
                      note,
                      at: Date.now(),
                    },
                  ],
                }
              : rev,
          ),
        })),
      replyTrackedReview: (id, actor, note) =>
        set((state) => ({
          trackedReviews: state.trackedReviews.map((rev) =>
            rev.id === id
              ? {
                  ...rev,
                  updatedAt: Date.now(),
                  history: [
                    ...rev.history,
                    { id: `rh-${Date.now()}`, actor, action: "Added reply", note, at: Date.now() },
                  ],
                }
              : rev,
          ),
        })),
      updateTourConfig: (patch) =>
        set((state) => ({ tourConfig: { ...state.tourConfig, ...patch } })),
      addTourScene: (scene) =>
        set((state) => ({
          tourConfig: {
            ...state.tourConfig,
            activeSceneId: scene.id,
            scenes: [scene, ...state.tourConfig.scenes.filter((s) => s.id !== scene.id)].slice(0, 16),
          },
        })),
      addTourHotspot: (hotspot) =>
        set((state) => ({
          tourConfig: {
            ...state.tourConfig,
            hotspots: [
              ...state.tourConfig.hotspots,
              { ...hotspot, id: `hs-${Date.now()}` },
            ].slice(0, 40),
          },
        })),
      removeTourHotspot: (id) =>
        set((state) => ({
          tourConfig: {
            ...state.tourConfig,
            hotspots: state.tourConfig.hotspots.filter((h) => h.id !== id),
          },
        })),
      updateUnitStatus: (unitId, status) =>
        set((state) => ({
          tourConfig: {
            ...state.tourConfig,
            units: state.tourConfig.units.map((u) => (u.id === unitId ? { ...u, status } : u)),
          },
        })),
      updateVideoProject: (patch) =>
        set((state) => ({ videoProject: { ...state.videoProject, ...patch } })),
      addClipToKumVideo: (clip) =>
        set((state) => {
          const videoClips = state.videoProject.clips.filter((c) => c.track === "video");
          const endSec = videoClips.reduce((acc, c) => Math.max(acc, c.startSec + c.durationSec), 0);
          const created: KumTimelineClip = {
            ...clip,
            id: `vc-${Date.now()}-${Math.floor(Math.random() * 999)}`,
            startSec: clip.track === "video" ? endSec : 0,
          };
          return {
            videoProject: {
              ...state.videoProject,
              clips: [...state.videoProject.clips, created].slice(0, 24),
            },
          };
        }),
      updateClipInKumVideo: (id, patch) =>
        set((state) => {
          let cursor = 0;
          const updated = state.videoProject.clips.map((c) => {
            const next = c.id === id ? { ...c, ...patch } : c;
            if (next.track === "video") {
              const positioned = { ...next, startSec: cursor };
              cursor += Math.max(1, positioned.durationSec);
              return positioned;
            }
            return next;
          });
          return { videoProject: { ...state.videoProject, clips: updated } };
        }),
      removeClipFromKumVideo: (id) =>
        set((state) => {
          let cursor = 0;
          const remaining = state.videoProject.clips
            .filter((c) => c.id !== id)
            .map((c) => {
              if (c.track === "video") {
                const positioned = { ...c, startSec: cursor };
                cursor += Math.max(1, positioned.durationSec);
                return positioned;
              }
              return c;
            });
          return {
            videoProject: {
              ...state.videoProject,
              clips: remaining,
            },
          };
        }),
      updateAgentMission: (patch) =>
        set((state) => ({ agentMission: { ...state.agentMission, ...patch } })),
      advanceAgentMissionStep: (stepId, status, summary) =>
        set((state) => ({
          agentMission: {
            ...state.agentMission,
            steps: state.agentMission.steps.map((s) =>
              s.id === stepId ? { ...s, status, ...(summary ? { outputSummary: summary } : {}) } : s,
            ),
          },
        })),
      resetAgentMission: () => set({ agentMission: DEFAULT_AGENT_MISSION }),
      updateGovernance: (patch) =>
        set((state) => ({ governance: { ...state.governance, ...patch } })),
      appendAuditEvent: (actor, action, target) =>
        set((state) => ({
          governance: {
            ...state.governance,
            auditEvents: [
              { id: `aud-${Date.now()}`, actor, action, target, at: Date.now() },
              ...state.governance.auditEvents,
            ].slice(0, 40),
          },
        })),
      updateNanoBanana: (patch) =>
        set((state) => ({
          nanoBanana: {
            ...state.nanoBanana,
            ...patch,
            constraints: patch.constraints
              ? { ...state.nanoBanana.constraints, ...patch.constraints }
              : state.nanoBanana.constraints,
          },
        })),
      setBudgetState: (next) => set({ budget: sanitizeBudgetState(next) }),
      updateBudgetConfig: (patch) =>
        set((state) => ({
          budget: sanitizeBudgetState({
            ...state.budget,
            ...patch,
          }),
        })),
      resetBudgetSpendLocal: () =>
        set((state) => ({
          budget: sanitizeBudgetState({
            ...state.budget,
            spentPaise: 0,
            lastCostPaise: 0,
            liveImageCount: 0,
            dailySpend: [],
          }),
        })),
      setLastOrchestration: (lastOrchestration) => set({ lastOrchestration }),
    }),
    {
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
        credits: state.credits,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<State>;
        const persistedWorkflows =
          Array.isArray(saved.nodeWorkflows) && saved.nodeWorkflows.length > 0
            ? saved.nodeWorkflows.slice(0, 12)
            : WORKFLOW_TEMPLATES.map(cloneWorkflow);
        return {
          ...current,
          ...saved,
          design: sanitizeDesign(saved.design),
          engine: sanitizeEngineState(saved.engine),
          scene3d: sanitizeScene3DState(saved.scene3d),
          meshMaterialOverrides: Array.isArray(saved.meshMaterialOverrides)
            ? saved.meshMaterialOverrides.slice(0, 48)
            : [],
          houseStyles: Array.isArray(saved.houseStyles) && saved.houseStyles.length ? saved.houseStyles.slice(0, 12) : DEFAULT_HOUSE_STYLES,
          reviewPins: Array.isArray(saved.reviewPins) ? saved.reviewPins.slice(-60) : [],
          midLayerPreset: typeof saved.midLayerPreset === "string" ? saved.midLayerPreset : null,
          dictionaryBlocks: Array.isArray(saved.dictionaryBlocks) ? saved.dictionaryBlocks.slice(0, 64) : [],
          dictionaryParams:
            saved.dictionaryParams && typeof saved.dictionaryParams === "object" ? saved.dictionaryParams : {},
          savedDictionaryPrompts: Array.isArray(saved.savedDictionaryPrompts)
            ? saved.savedDictionaryPrompts.slice(0, 200)
            : [],
          publishedGallery: Array.isArray(saved.publishedGallery) ? saved.publishedGallery.slice(0, 12) : [],
          projects: Array.isArray(saved.projects) ? saved.projects.slice(0, 24) : [],
          nodeWorkflows: persistedWorkflows,
          activeNodeWorkflowId:
            typeof saved.activeNodeWorkflowId === "string" &&
            persistedWorkflows.some((w) => w.id === saved.activeNodeWorkflowId)
              ? saved.activeNodeWorkflowId
              : persistedWorkflows[0].id,
          nodeExecutionMode:
            saved.nodeExecutionMode === "local" ||
            saved.nodeExecutionMode === "cloud" ||
            saved.nodeExecutionMode === "hybrid"
              ? saved.nodeExecutionMode
              : "hybrid",
          nodeRevisions: Array.isArray(saved.nodeRevisions) ? saved.nodeRevisions.slice(0, 10) : [],
          autoApproveMode: typeof saved.autoApproveMode === "boolean" ? saved.autoApproveMode : true,
          approvedSuggestionIds: Array.isArray(saved.approvedSuggestionIds)
            ? saved.approvedSuggestionIds.filter((s): s is string => typeof s === "string").slice(-200)
            : [],
          appliedSuggestionIds: Array.isArray(saved.appliedSuggestionIds)
            ? saved.appliedSuggestionIds.filter((s): s is string => typeof s === "string").slice(-200)
            : [],
          beginnerGuideOpen: typeof saved.beginnerGuideOpen === "boolean" ? saved.beginnerGuideOpen : false,
          idea: typeof saved.idea === "string" ? saved.idea : "",
          frame: sanitizeFrame(saved.frame),
          credits: typeof saved.credits === "number" ? Math.max(0, Math.min(5000, saved.credits)) : 4500,
          nanoBanana: saved.nanoBanana
            ? {
                ...DEFAULT_NANO_BANANA_CONFIG,
                ...saved.nanoBanana,
                constraints: {
                  ...DEFAULT_NANO_BANANA_CONFIG.constraints,
                  ...(saved.nanoBanana.constraints ?? {}),
                },
              }
            : DEFAULT_NANO_BANANA_CONFIG,
          budget: sanitizeBudgetState(saved.budget),
          lastOrchestration: null,
          busy: false,
          batchRunning: false,
          selecting: false,
          past: [],
          future: [],
        };
      },
    },
  ),
);

let clientHydrationPromise: Promise<void> | null = null;

function ensureClientHydratedOnce(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (clientHydrationPromise) return clientHydrationPromise;
  clientHydrationPromise = (async () => {
    try {
      await Promise.resolve(useOriel.persist.rehydrate());
    } catch {
      // Fall back gracefully if localStorage is unavailable or malformed
    }
    try {
      const cached = await loadPlateBundleFromIdb();
      if (!cached) return;
      const cur = useOriel.getState();
      const patch: Partial<State> = {};
      if (!cur.plate && cached.plate?.url) patch.plate = cached.plate;
      if (cur.history.length === 0 && cached.history?.length) patch.history = cached.history;
      if (cur.iterations.length === 0 && cached.iterations?.length) patch.iterations = cached.iterations;
      if (!cur.upload && cached.upload) patch.upload = cached.upload;
      if (Object.keys(patch).length > 0) {
        useOriel.setState(patch);
      }
    } catch {
      // Ignore IndexedDB unavailability in restricted contexts
    }
  })();
  return clientHydrationPromise;
}

export function useHydrated(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
    void ensureClientHydratedOnce();
  }, []);
  return ready;
}

