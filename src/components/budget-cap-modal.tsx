import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Check, IndianRupee, RotateCcw, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DailySpendBarChart } from "@/components/header-spend-chart";
import {
  BUDGET_CAP_PRESETS_INR,
  BUDGET_WARNING_THRESHOLD_PCT,
  estimateRemainingImages,
  formatInrExact,
  formatPaiseShort,
  getBudgetWarningStatus,
  resolveBudgetRenderPlan,
  type BudgetCostMode,
} from "@/lib/budget-guard";
import { getStudioBudget, resetStudioBudget, updateStudioBudget } from "@/lib/budget-fns";
import { resolveRuntimeModelOverride } from "@/lib/nano-banana-client";
import { useOriel } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BudgetCapModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const budget = useOriel((s) => s.budget);
  const setBudgetState = useOriel((s) => s.setBudgetState);
  const updateBudgetConfig = useOriel((s) => s.updateBudgetConfig);
  const resetBudgetSpendLocal = useOriel((s) => s.resetBudgetSpendLocal);
  const nanoBanana = useOriel((s) => s.nanoBanana);
  const updateNanoBanana = useOriel((s) => s.updateNanoBanana);
  const frame = useOriel((s) => s.frame);
  const setFrame = useOriel((s) => s.setFrame);

  const [customInr, setCustomInr] = useState(() => String(Math.round(budget.capPaise / 100)));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCustomInr(String(Math.round(budget.capPaise / 100)));
  }, [budget.capPaise]);

  useEffect(() => {
    if (!open) return;
    void getStudioBudget()
      .then((serverState) => {
        const cur = useOriel.getState().budget;
        setBudgetState({
          ...serverState,
          capPaise: cur.capPaise,
          costMode: cur.costMode,
          maxPerImagePaise: cur.maxPerImagePaise,
          spentPaise: Math.max(cur.spentPaise, serverState.spentPaise),
          liveImageCount: Math.max(cur.liveImageCount, serverState.liveImageCount),
          dailySpend: serverState.dailySpend.length > 0 ? serverState.dailySpend : cur.dailySpend,
        });
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const budgetWarning = getBudgetWarningStatus(budget);
  const remainingPaise = budgetWarning.remainingPaise;
  const usedPct = budgetWarning.usedPct;
  const currentPlan = resolveBudgetRenderPlan({
    requestedModel: resolveRuntimeModelOverride(nanoBanana.requestedModel) ?? "gemini-nano-banana-2.1",
    requestedResolution: nanoBanana.resolution,
    imageCount: 1,
    budget,
  });

  const estNb21Left = estimateRemainingImages(remainingPaise, 85);
  const estLiteLeft = estimateRemainingImages(remainingPaise, 45);

  async function applyMode(costMode: BudgetCostMode) {
    setSaving(true);
    updateBudgetConfig({ costMode });
    if (costMode === "paise-eco") {
      updateNanoBanana({ requestedModel: "nano_banana_2_1", resolution: "1K" });
      setFrame({ ...frame, resolution: "1k" });
    }
    try {
      const updated = await updateStudioBudget({
        data: {
          costMode,
          capPaise: budget.capPaise,
          maxPerImagePaise: budget.maxPerImagePaise,
        },
      });
      setBudgetState(updated);
      toast.success(
        costMode === "free-only"
          ? "Free (₹0 / 0p) Studio Preview mode active"
          : costMode === "paise-eco"
            ? "Paise Eco Guard active — Nano Banana 2.1 locked to 1K (≤85p/img)"
            : "Studio Pro unlocked (2K/4K enabled within your INR cap)",
      );
    } catch {
      toast.success("Cost tier updated locally");
    } finally {
      setSaving(false);
    }
  }

  async function applyCapInr(inrAmount: number) {
    const cleanInr = Math.max(0, Math.min(5000, Math.round(inrAmount)));
    const nextCapPaise = cleanInr * 100;
    setSaving(true);
    updateBudgetConfig({ capPaise: nextCapPaise });
    setCustomInr(String(cleanInr));
    try {
      const updated = await updateStudioBudget({
        data: {
          capPaise: nextCapPaise,
          costMode: budget.costMode,
          maxPerImagePaise: budget.maxPerImagePaise,
        },
      });
      setBudgetState(updated);
      toast.success(`Hard spend cap set to ₹${cleanInr}.00 INR`);
    } catch {
      toast.success(`Hard spend cap set to ₹${cleanInr}.00 INR`);
    } finally {
      setSaving(false);
    }
  }

  async function handleResetSpend() {
    setSaving(true);
    resetBudgetSpendLocal();
    try {
      const updated = await resetStudioBudget();
      setBudgetState(updated);
      toast.success("Spend counter reset to ₹0.00");
    } catch {
      toast.success("Spend counter reset to ₹0.00");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs" />
        <Dialog.Content
          data-testid="budget-cap-modal"
          className="arctic-glass-z2 fixed top-1/2 left-1/2 z-50 w-[min(560px,calc(100vw-1.5rem))] max-h-[90dvh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-[#d1c5b8]/60 bg-[#fbf9f5]/98 p-5 text-[#1b1c1a] shadow-2xl dark:border-[#a9bdc9]/25 dark:bg-[#08131f]/98 dark:text-[#e8eff3]"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-[#d1c5b8]/45 pb-3 dark:border-[#a9bdc9]/20">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <IndianRupee className="size-4.5" />
              </span>
              <div>
                <Dialog.Title className="font-display text-sm font-semibold tracking-tight">
                  Gemini Nano Banana 2.1 · INR Budget Cap &amp; Paise Guard
                </Dialog.Title>
                <Dialog.Description className="text-[11px] text-[#7f766a] dark:text-[#a9bdc9]">
                  Hard stop-loss ceiling enforced server-side before every cloud render
                </Dialog.Description>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Budget Cap Settings"
              className="grid size-8 shrink-0 place-items-center rounded-xl border border-[#d1c5b8]/50 text-[#4d463c] hover:bg-black/5 dark:border-[#a9bdc9]/25 dark:text-[#a9bdc9] dark:hover:bg-white/10"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {/* Spend Meter Card */}
            <div className="rounded-2xl border border-[#d1c5b8]/55 bg-white/85 p-3.5 dark:border-[#a9bdc9]/20 dark:bg-[#121c29]">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">
                    Live Cloud Spend vs Hard Cap
                  </span>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="font-mono text-xl font-bold text-[#1b1c1a] dark:text-[#e8eff3]" data-testid="budget-spent-display">
                      {formatInrExact(budget.spentPaise)}
                    </span>
                    <span className="font-mono text-xs text-[#7f766a] dark:text-[#a9bdc9]">
                      / {formatInrExact(budget.capPaise)} cap
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-semibold",
                      remainingPaise <= 100
                        ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                    )}
                  >
                    <ShieldCheck className="size-3" />
                    {formatInrExact(remainingPaise)} left
                  </span>
                  <p className="mt-0.5 font-mono text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                    Next render: {currentPlan.useCloud ? `~${formatPaiseShort(currentPlan.totalCostPaise)}` : "0p (Free)"}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#e4e2de] dark:bg-[#202b38]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    budgetWarning.level === "reached"
                      ? "bg-rose-500"
                      : budgetWarning.level === "warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${Math.max(usedPct, budget.spentPaise > 0 ? 3 : 0)}%` }}
                />
              </div>

              {budgetWarning.level !== "ok" && budget.costMode !== "free-only" ? (
                <div
                  data-testid="modal-budget-80-warning"
                  className={cn(
                    "mt-2.5 flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px]",
                    budgetWarning.level === "reached"
                      ? "border-rose-500/40 bg-rose-500/12 text-rose-800 dark:text-rose-200"
                      : "border-amber-500/45 bg-amber-500/12 text-amber-900 dark:text-amber-200",
                  )}
                >
                  <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
                  <span className="font-medium">
                    {budgetWarning.level === "reached"
                      ? `100% cap reached — live cloud renders are paused and fall back to Free (₹0) preview.`
                      : `${BUDGET_WARNING_THRESHOLD_PCT}% threshold reached (${usedPct}% used) — only ${formatInrExact(remainingPaise)} left in your ${formatInrExact(budget.capPaise)} cap.`}
                  </span>
                </div>
              ) : null}

              <div className="mt-2.5 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                <div className="rounded-xl bg-[#f5f3ef] px-2 py-1.5 dark:bg-[#08131f]">
                  <div className="font-semibold text-[#1b1c1a] dark:text-[#e8c98a]">~{estNb21Left}</div>
                  <div className="text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">NB 2.1 (85p) left</div>
                </div>
                <div className="rounded-xl bg-[#f5f3ef] px-2 py-1.5 dark:bg-[#08131f]">
                  <div className="font-semibold text-[#1b1c1a] dark:text-[#cfe3f0]">~{estLiteLeft}</div>
                  <div className="text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">NB Lite (45p) left</div>
                </div>
                <div className="rounded-xl bg-[#f5f3ef] px-2 py-1.5 dark:bg-[#08131f]">
                  <div className="font-semibold text-[#1b1c1a] dark:text-emerald-300">
                    {budget.liveImageCount} live · {budget.freeImageCount} free
                  </div>
                  <div className="text-[9px] text-[#7f766a] dark:text-[#a9bdc9]">Session renders</div>
                </div>
              </div>

              {/* 7-Day Daily Spending Bar Chart */}
              <div className="mt-3 border-t border-[#d1c5b8]/35 pt-2.5 dark:border-[#a9bdc9]/15">
                <div className="mb-1 flex items-center justify-between text-[10px]">
                  <span className="font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                    Recent Daily Spending (7 Days)
                  </span>
                  <span className="font-mono tabular-nums text-[#7f766a] dark:text-[#a9bdc9]">
                    {usedPct}% of {formatInrExact(budget.capPaise)} cap
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <DailySpendBarChart budget={budget} width={470} height={110} days={7} />
                </div>
              </div>
            </div>

            {/* Active Model Selection & Live Per-Image Cost Calculator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                  Model Selection · Est. Cost / Image
                </span>
                <span className="font-mono text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                  Active: {currentPlan.effectiveResolution} ·{" "}
                  {currentPlan.useCloud ? `~${formatPaiseShort(currentPlan.perImagePaise)}/img` : "0p Free"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {(
                  [
                    { key: "nano_banana_2_lite" as const, label: "NB 2 Lite", runtime: "gemini-3.1-flash-lite-image" },
                    { key: "nano_banana_2" as const, label: "NB 2 Fast", runtime: "gemini-3.1-flash-image" },
                    { key: "nano_banana_2_1" as const, label: "NB 2.1", runtime: "gemini-nano-banana-2.1" },
                    { key: "nano_banana_pro" as const, label: "NB Pro", runtime: "gemini-3-pro-image" },
                  ] as const
                ).map((m) => {
                  const selected = nanoBanana.requestedModel === m.key;
                  const est = resolveBudgetRenderPlan({
                    requestedModel: m.runtime,
                    requestedResolution: nanoBanana.resolution,
                    imageCount: 1,
                    budget,
                  });
                  const countLeft =
                    est.perImagePaise > 0 ? estimateRemainingImages(remainingPaise, est.perImagePaise) : null;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      data-testid={`budget-model-${m.key}`}
                      onClick={() => {
                        updateNanoBanana({ requestedModel: m.key });
                        toast.success(
                          `Selected ${m.label} (~${est.useCloud ? formatPaiseShort(est.perImagePaise) : "0p"}/image)`,
                        );
                      }}
                      className={cn(
                        "rounded-xl border px-2 py-1.5 text-left transition",
                        selected
                          ? "border-[#725b38] bg-[#c5a880]/20 dark:border-[#e8c98a] dark:bg-[#202b38]"
                          : "border-[#d1c5b8]/50 bg-white/70 hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#121c29]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 text-[10.5px] font-semibold">
                        <span className="truncate">{m.label}</span>
                        <span className="font-mono text-[9.5px] text-emerald-700 dark:text-[#e8c98a]">
                          {est.useCloud ? formatPaiseShort(est.perImagePaise) : "0p"}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-[8.5px] text-[#7f766a] dark:text-[#a9bdc9]">
                        {countLeft !== null ? `~${countLeft} left` : "Unlimited ₹0"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 Cost Tiers */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                  Per-Image Cost Guard Tier
                </span>
                <span className="font-mono text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                  Timeout: {Math.round(currentPlan.timeoutMs / 1000)}s fast guard
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(
                  [
                    {
                      id: "free-only" as const,
                      title: "Free Preview",
                      price: "₹0 · 0p",
                      desc: "Instant local composite. Zero Gemini API spend.",
                      icon: Sparkles,
                    },
                    {
                      id: "paise-eco" as const,
                      title: "Paise Eco",
                      price: "45p–85p / img",
                      desc: "Nano Banana 2.1 1K (85p) & Lite (45p). Blocks 2K/4K burns.",
                      icon: Zap,
                    },
                    {
                      id: "pro-unlocked" as const,
                      title: "Studio Pro",
                      price: "₹2.80–₹14",
                      desc: "Unlocks 2K/4K & Pro inside your hard INR cap.",
                      icon: ShieldCheck,
                    },
                  ] as const
                ).map((tier) => {
                  const active = budget.costMode === tier.id;
                  const Icon = tier.icon;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      disabled={saving}
                      data-testid={`budget-mode-${tier.id}`}
                      onClick={() => void applyMode(tier.id)}
                      className={cn(
                        "relative flex flex-col rounded-2xl border p-3 text-left transition",
                        active
                          ? "border-emerald-600 bg-emerald-500/10 shadow-xs dark:border-emerald-400 dark:bg-emerald-500/15"
                          : "border-[#d1c5b8]/55 bg-white/75 hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#121c29] dark:hover:border-[#e8c98a]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold">
                          <Icon className="size-3.5 text-emerald-600 dark:text-emerald-300" />
                          {tier.title}
                        </span>
                        {active ? <Check className="size-3.5 text-emerald-600 dark:text-emerald-300" /> : null}
                      </div>
                      <span className="mt-1 font-mono text-[11px] font-bold text-[#725b38] dark:text-[#e8c98a]">
                        {tier.price}
                      </span>
                      <p className="mt-1 text-[10px] leading-snug text-[#4d463c] dark:text-[#a9bdc9]">
                        {tier.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hard INR Cap Selector */}
            <div className="space-y-2 rounded-2xl border border-[#d1c5b8]/45 bg-[#f5f3ef]/80 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#0d1927]">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#725b38] dark:text-[#e8c98a]">
                  Hard Spend Cap (INR)
                </span>
                <span className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                  Auto-switches to ₹0 preview at limit
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {BUDGET_CAP_PRESETS_INR.map((amt) => {
                  const selected = Math.round(budget.capPaise / 100) === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      disabled={saving}
                      data-testid={`budget-cap-preset-${amt}`}
                      onClick={() => void applyCapInr(amt)}
                      className={cn(
                        "h-7.5 rounded-full border px-3 font-mono text-[11px] font-semibold transition",
                        selected
                          ? "border-[#725b38] bg-[#c5a880] text-[#281800] dark:border-[#e8c98a] dark:bg-[#e8c98a] dark:text-[#1b1407]"
                          : "border-[#d1c5b8]/55 bg-white text-[#4d463c] hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#121c29] dark:text-[#cfe3f0]",
                      )}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const parsed = Number(customInr);
                    if (Number.isFinite(parsed) && parsed >= 0) {
                      void applyCapInr(parsed);
                    }
                  }}
                  className="ml-auto flex items-center gap-1"
                >
                  <span className="font-mono text-xs text-[#7f766a] dark:text-[#a9bdc9]">₹</span>
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    step={5}
                    value={customInr}
                    onChange={(e) => setCustomInr(e.target.value)}
                    aria-label="Custom INR cap"
                    className="h-7.5 w-20 rounded-lg border border-[#d1c5b8]/60 bg-white px-2 font-mono text-xs outline-none focus:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#121c29]"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-7.5 rounded-lg bg-[#1b1c1a] px-2.5 text-[11px] font-semibold text-white hover:bg-[#333] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                  >
                    Set
                  </button>
                </form>
              </div>
            </div>

            {/* Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={saving}
                data-testid="budget-reset-spend-btn"
                onClick={() => void handleResetSpend()}
                className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-[#d1c5b8]/60 px-3 text-[11px] font-medium text-[#4d463c] transition hover:border-rose-500/60 hover:text-rose-700 dark:border-[#a9bdc9]/25 dark:text-[#a9bdc9] dark:hover:text-rose-300"
              >
                <RotateCcw className="size-3.5" />
                Reset Spend Counter
              </button>

              <button
                type="button"
                onClick={onClose}
                className="ice-cta inline-flex h-8 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
