import { AlertTriangle, BarChart3, IndianRupee, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  buildRecentDailySpendSeries,
  formatInrExact,
  formatPaiseShort,
  getBudgetWarningStatus,
  type BudgetState,
  type DailySpendChartPoint,
} from "@/lib/budget-guard";
import { useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";

interface DailySpendTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: DailySpendChartPoint }>;
}

function DailySpendTooltip({ active, payload }: DailySpendTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const pt = payload[0]?.payload;
  if (!pt) return null;
  return (
    <div className="rounded-xl border border-[#d1c5b8]/65 bg-[#fbf9f5]/98 px-2.5 py-1.5 text-[10.5px] text-[#1b1c1a] shadow-lg dark:border-[#a9bdc9]/25 dark:bg-[#08131f]/98 dark:text-[#e8eff3]">
      <div className="flex items-center justify-between gap-3 font-medium">
        <span>{pt.isToday ? `Today (${pt.date})` : `${pt.dayLabel} · ${pt.date}`}</span>
      </div>
      <div className="mt-0.5 flex items-baseline justify-between gap-3 font-mono tabular-nums">
        <span className="font-bold text-[#725b38] dark:text-[#e8c98a]">
          {formatInrExact(pt.spentPaise)}
        </span>
        <span className="text-[9.5px] text-[#7f766a] dark:text-[#a9bdc9]">
          {pt.imageCount} {pt.imageCount === 1 ? "img" : "imgs"}
        </span>
      </div>
    </div>
  );
}

export function DailySpendBarChart({
  budget,
  width = 276,
  height = 122,
  days = 7,
  className,
}: {
  budget: BudgetState;
  width?: number;
  height?: number;
  days?: number;
  className?: string;
}) {
  const hydrated = useHydrated();
  const series = useMemo(() => buildRecentDailySpendSeries(budget, days), [budget, days]);
  const warning = useMemo(() => getBudgetWarningStatus(budget), [budget]);
  const maxInr = useMemo(() => {
    const peak = Math.max(...series.map((d) => d.spentInr), 0);
    if (peak <= 0) return 5;
    if (peak <= 5) return Math.ceil(peak + 1);
    return Math.ceil(peak * 1.2);
  }, [series]);

  const activeFill =
    warning.level === "reached"
      ? "#f43f5e"
      : warning.level === "warning"
        ? "#f59e0b"
        : "#10b981";
  const mutedFill =
    warning.level === "reached"
      ? "#fb7185"
      : warning.level === "warning"
        ? "#fbbf24"
        : "#34d399";

  if (!hydrated) {
    return (
      <div
        className={cn("rounded-xl bg-[#efeeea]/50 dark:bg-[#0d1927]/70", className)}
        style={{ width, height }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      data-testid="daily-spend-recharts-bar"
      className={cn("select-none", className)}
      style={{ width, height }}
    >
      <BarChart
        width={width}
        height={height}
        data={series}
        margin={{ top: 8, right: 6, left: -20, bottom: 0 }}
        barCategoryGap="24%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(148, 163, 184, 0.22)"
        />
        <XAxis
          dataKey="dayLabel"
          tick={{ fontSize: 9.5, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          interval={0}
        />
        <YAxis
          domain={[0, maxInr]}
          tick={{ fontSize: 9, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `₹${v}`}
          width={42}
        />
        <Tooltip
          cursor={{ fill: "rgba(148, 163, 184, 0.12)", radius: 4 }}
          content={<DailySpendTooltip />}
        />
        <Bar dataKey="spentInr" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false}>
          {series.map((entry) => (
            <Cell
              key={entry.date}
              fill={
                entry.spentPaise <= 0
                  ? "rgba(148, 163, 184, 0.26)"
                  : entry.isToday
                    ? activeFill
                    : mutedFill
              }
            />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}

export function HeaderSpendChart({
  budget,
  onOpenBudgetModal,
}: {
  budget: BudgetState;
  onOpenBudgetModal: () => void;
}) {
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const series = useMemo(() => buildRecentDailySpendSeries(budget, 7), [budget]);
  const warning = useMemo(() => getBudgetWarningStatus(budget), [budget]);
  const total7dPaise = useMemo(
    () => series.reduce((sum, item) => sum + item.spentPaise, 0),
    [series],
  );
  const todayEntry = series[series.length - 1];

  const sparkData = useMemo(() => {
    const peak = Math.max(...series.map((d) => d.spentPaise), 0);
    const baseline = peak > 0 ? Math.max(Math.round(peak * 0.12), 12) : 15;
    return series.map((item) => ({
      ...item,
      sparkValue: item.spentPaise > 0 ? item.spentPaise : baseline,
      hasSpend: item.spentPaise > 0,
    }));
  }, [series]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const activeBarColor =
    budget.costMode === "free-only"
      ? "#0ea5e9"
      : warning.level === "reached"
        ? "#f43f5e"
        : warning.level === "warning"
          ? "#f59e0b"
          : "#10b981";

  const secondaryBarColor =
    budget.costMode === "free-only"
      ? "#38bdf8"
      : warning.level === "reached"
        ? "#fb7185"
        : warning.level === "warning"
          ? "#fbbf24"
          : "#34d399";

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        data-testid="header-spend-chart-btn"
        aria-expanded={open}
        aria-label={`Recent daily spending chart (${formatInrExact(total7dPaise)} over last 7 days)`}
        title={`Daily Spending (7d): ${formatInrExact(total7dPaise)} · Today: ${formatInrExact(todayEntry?.spentPaise ?? 0)} — Click for full bar chart`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-7 items-center gap-1 rounded-full border px-1.5 transition sm:h-7.5 sm:px-2",
          warning.level === "reached" && budget.costMode !== "free-only"
            ? "border-rose-500/45 bg-rose-500/10 hover:border-rose-500/75"
            : warning.level === "warning" && budget.costMode !== "free-only"
              ? "border-amber-500/50 bg-amber-500/12 hover:border-amber-500/80"
              : "border-[#d1c5b8]/50 bg-[#efeeea]/85 hover:border-[#725b38] dark:border-[#a9bdc9]/20 dark:bg-[#121c29] dark:hover:border-[#e8c98a]",
        )}
      >
        {hydrated ? (
          <span
            data-testid="header-spend-sparkbar"
            className="pointer-events-none block h-[16px] w-[36px] shrink-0 overflow-hidden"
            aria-hidden="true"
          >
            <BarChart
              width={36}
              height={16}
              data={sparkData}
              margin={{ top: 1, right: 0, left: 0, bottom: 1 }}
              barCategoryGap="16%"
            >
              <Bar dataKey="sparkValue" radius={[1.5, 1.5, 0, 0]} isAnimationActive={false}>
                {sparkData.map((entry) => (
                  <Cell
                    key={entry.date}
                    fill={
                      !entry.hasSpend
                        ? "rgba(148, 163, 184, 0.34)"
                        : entry.isToday
                          ? activeBarColor
                          : secondaryBarColor
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </span>
        ) : (
          <BarChart3 className="size-3.5 text-[#725b38] dark:text-[#a9bdc9]" aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div
          data-testid="header-spend-chart-popover"
          className="absolute top-10 right-0 z-50 w-[308px] max-w-[calc(100vw-1rem)] rounded-2xl border border-[#d1c5b8]/75 bg-[#fbf9f5] p-3 text-[#1b1c1a] shadow-2xl dark:border-[#a9bdc9]/25 dark:bg-[#0b1726] dark:text-[#e8eff3]"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[#d1c5b8]/40 pb-2 dark:border-[#a9bdc9]/20">
            <div>
              <p className="font-display text-xs font-semibold tracking-tight">
                Recent Daily Spending
              </p>
              <p className="font-mono text-[10px] tabular-nums text-[#7f766a] dark:text-[#a9bdc9]">
                7d total {formatInrExact(total7dPaise)} · {warning.usedPct}% of{" "}
                {formatInrExact(budget.capPaise)} cap
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close daily spending chart"
              className="grid size-6 shrink-0 place-items-center rounded-lg text-[#4d463c] hover:bg-black/5 dark:text-[#a9bdc9] dark:hover:bg-white/10"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {warning.level !== "ok" && budget.costMode !== "free-only" ? (
            <div
              data-testid="popover-budget-warning"
              className={cn(
                "mt-2 flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[10.5px] font-medium",
                warning.level === "reached"
                  ? "border-rose-500/40 bg-rose-500/12 text-rose-700 dark:text-rose-300"
                  : "border-amber-500/45 bg-amber-500/12 text-amber-800 dark:text-amber-300",
              )}
            >
              <AlertTriangle className="size-3.5 shrink-0" />
              <span className="font-mono tabular-nums">
                {warning.level === "reached"
                  ? `100% cap reached — Free (₹0) active`
                  : `${warning.usedPct}% of cap used (${formatInrExact(warning.remainingPaise)} left)`}
              </span>
            </div>
          ) : null}

          <div className="mt-2.5">
            <DailySpendBarChart budget={budget} width={280} height={124} days={7} />
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#d1c5b8]/40 pt-2 text-[10.5px] dark:border-[#a9bdc9]/20">
            <div className="font-mono tabular-nums text-[#4d463c] dark:text-[#a9bdc9]">
              Today:{" "}
              <span className="font-semibold text-[#1b1c1a] dark:text-[#e8eff3]">
                {formatPaiseShort(todayEntry?.spentPaise ?? 0)}
              </span>{" "}
              ({todayEntry?.imageCount ?? 0} imgs)
            </div>
            <button
              type="button"
              data-testid="popover-open-budget-cap-btn"
              onClick={() => {
                setOpen(false);
                onOpenBudgetModal();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-[#d1c5b8]/60 bg-white px-2 py-1 text-[10px] font-semibold text-[#1b1c1a] transition hover:border-[#725b38] dark:border-[#a9bdc9]/25 dark:bg-[#121c29] dark:text-[#e8c98a] dark:hover:border-[#e8c98a]"
            >
              <IndianRupee className="size-3" />
              Cap Settings
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
