import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { DEFAULT_FRAME, sanitizeFrame, type Frame } from "@/lib/frame";
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
import type { ModelId } from "@/lib/types";
import { buildTemplateCompiledNotes, type BriefTemplate } from "@/lib/brief-templates";
import type { SharedBriefSnapshot } from "@/lib/brief-collab";
import {
  applyMarketSuggestionBatch as applySuggestionBatchPure,
  applyMarketSuggestionPatch as applySuggestionPatchPure,
  type MarketSuggestion,
} from "@/lib/market-suggestions";

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
        set((state) => ({
          plate,
          history:
            state.plate?.url && plate && state.plate.url !== plate.url
              ? [state.plate.url, ...state.history.filter((url) => url !== state.plate?.url)].slice(0, 8)
              : state.history,
        })),
      setUpload: (upload) => set({ upload }),
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

export function useHydrated(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    if (useOriel.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = useOriel.persist.onFinishHydration(() => {
      if (alive) setReady(true);
    });
    void useOriel.persist.rehydrate();
    return () => {
      alive = false;
      unsub();
    };
  }, []);
  return ready;
}
