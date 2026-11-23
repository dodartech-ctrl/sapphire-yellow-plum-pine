import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  DEFAULT_BUDGET_STATE,
  recordDailySpendEntry,
  resolveBudgetRenderPlan,
  sanitizeBudgetState,
  type BudgetCostMode,
  type BudgetRenderPlan,
  type BudgetResolution,
  type BudgetState,
} from "@/lib/budget-guard";

const BUDGET_FILE_PATH = path.join(os.tmpdir(), "oriel-studio-inr-budget.json");

let cachedLedger: BudgetState | null = null;

async function loadLedgerFromDisk(): Promise<BudgetState> {
  if (cachedLedger) return { ...cachedLedger };
  try {
    const raw = await readFile(BUDGET_FILE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<BudgetState>;
    cachedLedger = sanitizeBudgetState(parsed);
    return { ...cachedLedger };
  } catch {
    cachedLedger = { ...DEFAULT_BUDGET_STATE };
    return { ...cachedLedger };
  }
}

async function persistLedgerToDisk(next: BudgetState): Promise<void> {
  cachedLedger = { ...next };
  try {
    await writeFile(BUDGET_FILE_PATH, JSON.stringify(next, null, 2), "utf8");
  } catch {
    // Keep in-memory ledger operational even on read-only serverless filesystems
  }
}

export async function readBudgetLedger(): Promise<BudgetState> {
  return loadLedgerFromDisk();
}

export async function updateBudgetLedger(patch: {
  capPaise?: number;
  costMode?: BudgetCostMode;
  maxPerImagePaise?: number;
  autoFallbackOnCap?: boolean;
}): Promise<BudgetState> {
  const current = await loadLedgerFromDisk();
  const next = sanitizeBudgetState({
    ...current,
    ...(typeof patch.capPaise === "number" ? { capPaise: patch.capPaise } : {}),
    ...(patch.costMode ? { costMode: patch.costMode } : {}),
    ...(typeof patch.maxPerImagePaise === "number" ? { maxPerImagePaise: patch.maxPerImagePaise } : {}),
    ...(typeof patch.autoFallbackOnCap === "boolean" ? { autoFallbackOnCap: patch.autoFallbackOnCap } : {}),
  });
  await persistLedgerToDisk(next);
  return next;
}

export async function resetBudgetLedger(): Promise<BudgetState> {
  const current = await loadLedgerFromDisk();
  const next = sanitizeBudgetState({
    ...current,
    spentPaise: 0,
    lastCostPaise: 0,
    liveImageCount: 0,
    dailySpend: [],
  });
  await persistLedgerToDisk(next);
  return next;
}

export async function planServerBudgetRender(params: {
  requestedModel?: string;
  requestedResolution?: BudgetResolution | "1k" | "2k";
  imageCount?: number;
  clientOverride?: {
    capPaise?: number;
    costMode?: BudgetCostMode;
    maxPerImagePaise?: number;
  };
}): Promise<{ ledger: BudgetState; plan: BudgetRenderPlan }> {
  let ledger = await loadLedgerFromDisk();
  if (params.clientOverride) {
    ledger = await updateBudgetLedger(params.clientOverride);
  }
  const plan = resolveBudgetRenderPlan({
    requestedModel: params.requestedModel,
    requestedResolution: params.requestedResolution,
    imageCount: params.imageCount,
    budget: ledger,
  });
  return { ledger, plan };
}

export async function recordServerRenderOutcome(params: {
  billedPaise: number;
  liveImages: number;
  freeImages: number;
}): Promise<BudgetState> {
  const current = await loadLedgerFromDisk();
  const billed = Math.max(0, Math.round(params.billedPaise));
  const liveImages = Math.max(0, Math.floor(params.liveImages));
  const next = sanitizeBudgetState({
    ...current,
    spentPaise: current.spentPaise + billed,
    lastCostPaise: billed,
    liveImageCount: current.liveImageCount + liveImages,
    freeImageCount: current.freeImageCount + Math.max(0, Math.floor(params.freeImages)),
    dailySpend: recordDailySpendEntry(current.dailySpend, billed, liveImages),
  });
  await persistLedgerToDisk(next);
  return next;
}
