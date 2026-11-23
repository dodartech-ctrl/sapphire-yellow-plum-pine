import { createServerFn } from "@tanstack/react-start";
import { sanitizeBudgetState, type BudgetCostMode, type BudgetState } from "@/lib/budget-guard";

export const getStudioBudget = createServerFn({ method: "GET" }).handler(async (): Promise<BudgetState> => {
  const { readBudgetLedger } = await import("@/lib/budget-guard.server");
  return readBudgetLedger();
});

export const updateStudioBudget = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
    const costMode: BudgetCostMode | undefined =
      raw.costMode === "free-only" || raw.costMode === "paise-eco" || raw.costMode === "pro-unlocked"
        ? raw.costMode
        : undefined;
    return {
      capPaise: typeof raw.capPaise === "number" && Number.isFinite(raw.capPaise) ? raw.capPaise : undefined,
      costMode,
      maxPerImagePaise:
        typeof raw.maxPerImagePaise === "number" && Number.isFinite(raw.maxPerImagePaise)
          ? raw.maxPerImagePaise
          : undefined,
      autoFallbackOnCap: typeof raw.autoFallbackOnCap === "boolean" ? raw.autoFallbackOnCap : undefined,
    };
  })
  .handler(async ({ data }): Promise<BudgetState> => {
    const { updateBudgetLedger } = await import("@/lib/budget-guard.server");
    const updated = await updateBudgetLedger(data);
    return sanitizeBudgetState(updated);
  });

export const resetStudioBudget = createServerFn({ method: "POST" }).handler(async (): Promise<BudgetState> => {
  const { resetBudgetLedger } = await import("@/lib/budget-guard.server");
  return resetBudgetLedger();
});
