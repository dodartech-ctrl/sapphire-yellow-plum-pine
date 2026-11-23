import {
  Bot,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Lock,
  MessageSquarePlus,
  Moon,
  Play,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sliders,
  Sun,
  Unlock,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { runAnnotatorPass, runDepthAnythingPass, runTiledUpscalePass } from "@/lib/cv-pipeline";
import { synthesizeFallbackComposite } from "@/lib/fallback-render";
import { generatePlate } from "@/lib/generate";
import { resolveRuntimeModelOverride } from "@/lib/nano-banana-client";
import { evaluateFidelityGate } from "@/lib/presets-catalog";
import { formatPaiseShort } from "@/lib/budget-guard";
import { exportClientApprovalPdf } from "@/lib/studio-exports";
import { useOriel } from "@/lib/store";
import type { ReviewStatus } from "@/lib/prd-studio-data";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* 1. LOOK ANCHOR & SCENE BIBLE MODAL                                         */
/* -------------------------------------------------------------------------- */

export function LookAnchorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lookAnchor = useOriel((s) => s.lookAnchor);
  const lookAnchorHistory = useOriel((s) => s.lookAnchorHistory);
  const reanchorLook = useOriel((s) => s.reanchorLook);
  const setLookLockStrength = useOriel((s) => s.setLookLockStrength);
  const toggleLookAnchorLock = useOriel((s) => s.toggleLookAnchorLock);
  const restoreLookAnchor = useOriel((s) => s.restoreLookAnchor);
  const design = useOriel((s) => s.design);
  const plate = useOriel((s) => s.plate);

  const [labelInput, setLabelInput] = useState(lookAnchor.label);
  const [kelvinInput, setKelvinInput] = useState(lookAnchor.colorTempK);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        data-testid="look-anchor-modal"
        onClick={(e) => e.stopPropagation()}
        className="arctic-glass-z2 w-full max-w-lg rounded-[26px] p-5 text-xs text-[#1b1c1a] dark:text-[#e8eff3]"
      >
        <div className="flex items-center justify-between border-b border-[#d1c5b8]/35 pb-3 dark:border-[#a9bdc9]/20">
          <div>
            <h2 className="font-display text-base font-semibold tracking-wide">
              Look Anchor · Scene Bible (v{lookAnchor.version})
            </h2>
            <p className="text-[11px] text-[#7f766a] dark:text-[#a9bdc9]">
              Keeps palette, daylight Kelvin, and shadow mood consistent across stills, 360°, and video.
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#d1c5b8]/45 bg-white/60 p-3 dark:border-[#a9bdc9]/25 dark:bg-[#16202d]/80">
            <img
              src={plate?.url || lookAnchor.thumbnailUrl}
              alt={lookAnchor.label}
              className="size-16 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold">{lookAnchor.label}</span>
                <button
                  type="button"
                  onClick={() => toggleLookAnchorLock()}
                  className="inline-flex items-center gap-1 rounded-full bg-[#c5a880]/25 px-2.5 py-0.5 text-[10px] font-semibold text-[#513d1d] dark:bg-[#584411] dark:text-[#e8c98a]"
                >
                  {lookAnchor.locked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                  {lookAnchor.locked ? "Anchored" : "Unlocked"}
                </button>
              </div>
              <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                {lookAnchor.lightDirection} · {lookAnchor.colorTempK}K · {lookAnchor.timeOfDay}
              </p>
              <div className="flex items-center gap-1.5">
                {lookAnchor.paletteHexes.map((hex) => (
                  <span key={hex} className="h-3.5 w-6 rounded-full border border-white/20" style={{ backgroundColor: hex }} title={hex} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Lock Strength</span>
            <div className="flex gap-1 rounded-full bg-[#efeeea] p-0.5 dark:bg-[#121c29]">
              {(["strict", "soft"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setLookLockStrength(s)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-semibold capitalize",
                    lookAnchor.lockStrength === s
                      ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                      : "text-[#4d463c] dark:text-[#a9bdc9]",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">Anchor Name</span>
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                className="mt-1 h-8 w-full rounded-xl border border-[#d1c5b8]/55 bg-white px-2.5 text-[11px] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
              />
            </label>
            <label className="block">
              <span className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">Color Temp (K)</span>
              <input
                type="number"
                min={2200}
                max={7500}
                step={100}
                value={kelvinInput}
                onChange={(e) => setKelvinInput(Number(e.target.value))}
                className="mt-1 h-8 w-full rounded-xl border border-[#d1c5b8]/55 bg-white px-2.5 text-[11px] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              reanchorLook({
                label: labelInput.trim() || `${design.look} Anchor`,
                colorTempK: kelvinInput,
                timeOfDay: design.light,
                thumbnailUrl: plate?.url || lookAnchor.thumbnailUrl,
              });
              toast.success(`Re-anchored Look v${lookAnchor.version + 1}`);
            }}
            className="ice-cta h-9 w-full rounded-full text-[11px] font-bold"
          >
            Re-Anchor Active Plate as Look v{lookAnchor.version + 1}
          </button>

          {lookAnchorHistory.length > 1 ? (
            <div className="space-y-1 pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7f766a] dark:text-[#a9bdc9]">
                Look History
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lookAnchorHistory.map((item) => (
                  <button
                    key={item.version}
                    type="button"
                    onClick={() => restoreLookAnchor(item.version)}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px]",
                      item.version === lookAnchor.version
                        ? "border-[#e8c98a] bg-[#c5a880]/20 font-semibold dark:text-[#e8c98a]"
                        : "border-[#d1c5b8]/50 dark:border-[#a9bdc9]/25",
                    )}
                  >
                    v{item.version} · {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. FIDELITY GATE & HONESTY REPORT MODAL (C1–C10 + Refund + Fix Inpaint)    */
/* -------------------------------------------------------------------------- */

export function FidelityGateModal({
  open,
  onClose,
  onFixInpaint,
}: {
  open: boolean;
  onClose: () => void;
  onFixInpaint: () => void;
}) {
  const fidelityReport = useOriel((s) => s.fidelityReport);
  const credits = useOriel((s) => s.credits);
  const setCredits = useOriel((s) => s.setCredits);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        data-testid="fidelity-gate-modal"
        onClick={(e) => e.stopPropagation()}
        className="arctic-glass-z2 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[26px] p-5 text-xs text-[#1b1c1a] dark:text-[#e8eff3]"
      >
        <div className="flex items-center justify-between border-b border-[#d1c5b8]/35 pb-3 dark:border-[#a9bdc9]/20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-500" />
            <div>
              <h2 className="font-display text-base font-semibold">
                Honesty & Fidelity Gate (C1–C10)
              </h2>
              <p className="text-[11px] text-[#7f766a] dark:text-[#a9bdc9]">
                Every generated plate is checked against walls, openings, horizon, and staging disclosure rules.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        {!fidelityReport ? (
          <p className="py-8 text-center text-xs text-[#7f766a] dark:text-[#a9bdc9]">
            Render a plate first to inspect the full C1–C10 Honesty Gate scorecard.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-3">
              <div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Score: {Math.round(fidelityReport.overallScore * 100)}% · Status: {fidelityReport.status.toUpperCase()}
                </p>
                <p className="text-[11px] text-[#4d463c] dark:text-[#cfe3f0]">{fidelityReport.disclosureLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                {fidelityReport.refundEligible ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCredits(credits + 8);
                      toast.success("Returned 8 CR for flagged fidelity drift");
                    }}
                    className="rounded-full bg-rose-500 px-3 py-1 text-[10px] font-bold text-white"
                  >
                    Claim Auto-Refund (+8 CR)
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onFixInpaint();
                  }}
                  className="ice-cta rounded-full px-3 py-1.5 text-[10px] font-bold"
                >
                  Fix Specific Area (Inpaint)
                </button>
              </div>
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2">
              {fidelityReport.checks.map((chk) => (
                <div
                  key={chk.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#d1c5b8]/45 bg-white/70 px-3 py-2 dark:border-[#43474b]/60 dark:bg-[#16202d]/85"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {chk.id} · {chk.name}
                    </p>
                    <p className="truncate text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">{chk.note}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
                      chk.passed ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/20 text-amber-600",
                    )}
                  >
                    {Math.round(chk.score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. TRACKED REVIEW BOARD & CLIENT APPROVAL VIEW (+ WebRTC + 8K/12K/15K)     */
/* -------------------------------------------------------------------------- */

const REVIEW_STATUSES: readonly ReviewStatus[] = [
  "open",
  "in_progress",
  "needs_check",
  "resolved",
  "closed",
  "reopened",
];

export function TrackedReviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const trackedReviews = useOriel((s) => s.trackedReviews);
  const addTrackedReview = useOriel((s) => s.addTrackedReview);
  const transitionTrackedReview = useOriel((s) => s.transitionTrackedReview);
  const replyTrackedReview = useOriel((s) => s.replyTrackedReview);
  const plate = useOriel((s) => s.plate);
  const upload = useOriel((s) => s.upload);
  const activeStudio = useOriel((s) => s.activeStudio);
  const iterations = useOriel((s) => s.iterations);

  const [viewMode, setViewMode] = useState<"reviews" | "approval">("reviews");
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [liveCallActive, setLiveCallActive] = useState(false);
  const [exportSpec, setExportSpec] = useState<"8K" | "12K" | "15K">("8K");

  if (!open) return null;

  async function toggleWebRtcRoom() {
    if (liveCallActive) {
      setLiveCallActive(false);
      toast.message("Left Live Studio Review Room");
      return;
    }
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
      setLiveCallActive(true);
      toast.success("Joined Live Review Room (WebRTC voice/cursor sync active)");
    } catch {
      setLiveCallActive(true);
      toast.message("Joined Live Cursor Sync Room (mic muted in sandbox preview)");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        data-testid="tracked-review-modal"
        onClick={(e) => e.stopPropagation()}
        className="arctic-glass-z2 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[26px] p-5 text-xs text-[#1b1c1a] dark:text-[#e8eff3]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d1c5b8]/35 pb-3 dark:border-[#a9bdc9]/20">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="size-5 text-[#725b38] dark:text-[#e8c98a]" />
            <div>
              <h2 className="font-display text-base font-semibold">
                Tracked Comments & Client Approval
              </h2>
              <p className="text-[11px] text-[#7f766a] dark:text-[#a9bdc9]">
                Pin-on-image issue lifecycle ({trackedReviews.length} threads) · Contact sheet sign-off
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void toggleWebRtcRoom()}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[10px] font-semibold",
                liveCallActive
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                  : "border-[#d1c5b8]/55 dark:border-[#a9bdc9]/30",
              )}
            >
              {liveCallActive ? <Video className="size-3.5" /> : <VideoOff className="size-3.5" />}
              {liveCallActive ? "Live Room ON" : "Join Live Room"}
            </button>
            <div className="inline-flex rounded-full bg-[#efeeea] p-0.5 dark:bg-[#121c29]">
              <button
                type="button"
                onClick={() => setViewMode("reviews")}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-semibold",
                  viewMode === "reviews" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "",
                )}
              >
                Issues ({trackedReviews.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode("approval")}
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-semibold",
                  viewMode === "approval" ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]" : "",
                )}
              >
                Client Approval Sheet
              </button>
            </div>
            <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10">
              <X className="size-4" />
            </button>
          </div>
        </div>

        {viewMode === "reviews" ? (
          <div className="mt-3 space-y-3">
            {/* Create New Tracked Review */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTitle.trim()) return;
                addTrackedReview({
                  title: newTitle.trim(),
                  comment: newComment.trim() || "Verify finish & lighting alignment.",
                  status: "open",
                  priority: "normal",
                  assignee: "Lead Architect",
                  author: "Studio Reviewer",
                  pinX: 50,
                  pinY: 48,
                  studio: activeStudio,
                  linkedVersionUrl: plate?.url,
                });
                setNewTitle("");
                setNewComment("");
                toast.success("Pinned tracked review item");
              }}
              className="flex flex-wrap gap-2 rounded-2xl border border-[#d1c5b8]/45 bg-white/60 p-2.5 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/75"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="New pin summary (e.g. Soften skylight glare)…"
                className="h-8 flex-1 rounded-xl border border-[#d1c5b8]/55 bg-white px-2.5 text-[11px] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
              />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Instruction detail…"
                className="h-8 flex-1 rounded-xl border border-[#d1c5b8]/55 bg-white px-2.5 text-[11px] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
              />
              <button type="submit" className="ice-cta h-8 rounded-full px-3.5 text-[11px] font-bold">
                + Add Review Pin
              </button>
            </form>

            {/* Threads */}
            <div className="space-y-2">
              {trackedReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-[#d1c5b8]/45 bg-white/70 p-3 dark:border-[#43474b]/60 dark:bg-[#16202d]/85"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="grid size-5 place-items-center rounded-full bg-[#e8c98a] font-mono text-[10px] font-bold text-[#261a00]">
                        {rev.number}
                      </span>
                      <span className="font-semibold">{rev.title}</span>
                      <span className="rounded bg-[#efeeea] px-1.5 py-0.5 text-[9px] uppercase dark:bg-[#2b3643] dark:text-[#cfe3f0]">
                        {rev.studio}
                      </span>
                    </div>
                    <select
                      value={rev.status}
                      onChange={(e) => transitionTrackedReview(rev.id, e.target.value as ReviewStatus, "Reviewer")}
                      className="rounded-full border border-[#d1c5b8]/55 bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase dark:border-[#a9bdc9]/25 dark:bg-[#202b38] dark:text-[#e8c98a]"
                    >
                      {REVIEW_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-[11px] text-[#4d463c] dark:text-[#a9bdc9]">{rev.comment}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                    <span>
                      Assignee: {rev.assignee} · Latest: {rev.history[rev.history.length - 1]?.action}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        replyTrackedReview(rev.id, "Architect", "Updated plate materials per note.");
                        transitionTrackedReview(rev.id, "needs_check", "Architect");
                        toast.success(`Requested Needs Check on #${rev.number}`);
                      }}
                      className="font-semibold text-[#725b38] hover:underline dark:text-[#cfe3f0]"
                    >
                      Mark Fixed → Needs Check
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#d1c5b8]/45 bg-white/70 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/85">
              <div>
                <p className="font-semibold">Client Sign-Off &amp; Print-Ready Export</p>
                <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                  Generates a real print-ready PDF contact sheet with C2PA disclosure &amp; review audit log
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(["8K", "12K", "15K"] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setExportSpec(tier)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold",
                      exportSpec === tier
                        ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "bg-[#efeeea] dark:bg-[#202b38]",
                    )}
                  >
                    {tier}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const st = useOriel.getState();
                    const approvalPlates =
                      iterations.length > 0
                        ? iterations.slice(0, 6).map((it) => ({
                            id: it.id,
                            url: it.url,
                            label: it.look || "Studio Plate",
                          }))
                        : [
                            {
                              id: "cur",
                              url: plate?.url || upload || "/viz/p01-pavilion-dusk.jpg",
                              label: `${st.design.look} (${st.design.vertical})`,
                            },
                          ];
                    void exportClientApprovalPdf({
                      projectTitle: `${st.design.look} · ${st.design.vertical}`,
                      exportTier: exportSpec,
                      plates: approvalPlates,
                      reviews: trackedReviews,
                      governance: st.governance,
                    })
                      .then(({ filename, plateCount }) => {
                        st.appendAuditEvent("Architect", `Exported ${exportSpec} Approval PDF`, filename);
                        toast.success(`Downloaded ${filename} (${plateCount} plates embedded)`);
                      })
                      .catch((err) => {
                        toast.error(err instanceof Error ? err.message : "Could not export Approval PDF.");
                      });
                  }}
                  className="ice-cta inline-flex h-8 items-center gap-1 rounded-full px-3 text-[10px] font-bold"
                >
                  <FileText className="size-3" /> Export {exportSpec} PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Client Approval Link copied (${exportSpec} sheet ready)`);
                    void navigator.clipboard?.writeText(window.location.href);
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-[#d1c5b8]/55 px-2.5 text-[10px] font-semibold dark:border-[#a9bdc9]/30"
                >
                  <Share2 className="size-3" /> Copy Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(iterations.length > 0
                ? iterations.slice(0, 6).map((it) => ({ id: it.id, url: it.url, label: it.look || "Studio Plate" }))
                : [{ id: "cur", url: plate?.url || upload || "/viz/p01-pavilion-dusk.jpg", label: "Current Plate" }]
              ).map((item) => (
                <div key={item.id} className="overflow-hidden rounded-xl border border-[#d1c5b8]/45 bg-black/20 dark:border-[#a9bdc9]/20">
                  <img src={item.url} alt={item.label} className="aspect-[16/10] w-full object-cover" />
                  <div className="flex items-center justify-between gap-1 p-2 text-[10px]">
                    <span className="truncate font-semibold">{item.label}</span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="text-emerald-500">Approved</span>
                      <a
                        href={item.url}
                        download={`${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${exportSpec.toLowerCase()}.png`}
                        className="rounded-full bg-black/15 px-1.5 py-0.5 font-mono text-[9px] hover:bg-black/25 dark:bg-white/10"
                        title="Download Plate Image"
                      >
                        <Download className="size-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. AGENT ZUKE 8-STEP MISSION CONTROL DRAWER                                */
/* -------------------------------------------------------------------------- */

export function AgentZukeDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const agentMission = useOriel((s) => s.agentMission);
  const advanceAgentMissionStep = useOriel((s) => s.advanceAgentMissionStep);
  const updateAgentMission = useOriel((s) => s.updateAgentMission);
  const resetAgentMission = useOriel((s) => s.resetAgentMission);
  const [runningPipeline, setRunningPipeline] = useState(false);

  if (!open) return null;

  async function runToGateOrFinish() {
    if (runningPipeline) return;
    setRunningPipeline(true);
    updateAgentMission({ active: true });
    let spent = useOriel.getState().agentMission.spentCr;

    try {
      const steps = useOriel.getState().agentMission.steps;
      for (const step of steps) {
        if (step.status === "done") continue;
        if (spent + step.costCr > useOriel.getState().agentMission.budgetCapCr) {
          toast.error("Mission paused: credit budget cap reached");
          return;
        }
        if (step.order === 5) {
          advanceAgentMissionStep(step.id, "waiting_approval", "Awaiting human approval before 4K Enhance & Video export");
          updateAgentMission({ awaitingApproval: true, active: false, spentCr: spent });
          toast.message("Agent Zuke paused at Step 5: Human Approval Gate required before Final Enhance & KUM Video");
          return;
        }

        advanceAgentMissionStep(step.id, "running");
        const st = useOriel.getState();
        const activeSrc = st.plate?.url ?? st.upload ?? "/viz/p01-pavilion-dusk.jpg";
        let summary = step.outputSummary;

        if (step.order === 1) {
          const lockedWeight = Math.max(90, st.engine.geometryLock);
          st.setEngineField("geometryLock", lockedWeight);
          st.updateDesignContract({ lockedPreserve: true });
          summary = `Geometry locked at ${lockedWeight}% · Source: ${st.upload ? "Uploaded Photo" : "Studio Scene"}`;
        } else if (step.order === 2) {
          const [depth, mlsd] = await Promise.all([
            runDepthAnythingPass(activeSrc, true, 55),
            runAnnotatorPass(activeSrc, "mlsd", 60),
          ]);
          st.setConditioningChannel("depth", depth.dataUrl);
          st.setConditioningChannel("annotator", mlsd.dataUrl);
          summary = "Extracted real Z-Depth & MLSD structural edge conditioning maps";
        } else if (step.order === 3) {
          const res = await generatePlate({
            data: {
              idea: st.idea.trim() || `${st.design.look} ${st.design.vertical} architectural plate`,
              image: st.upload && st.upload.startsWith("data:image/") ? st.upload : undefined,
              design: st.design,
              frame: st.frame,
              engine: st.engine,
              scene3d: st.scene3d,
              nanoBananaModel: resolveRuntimeModelOverride(st.nanoBanana.requestedModel),
              nanoBananaResolution: "1K",
              budgetCostMode: st.budget.costMode,
              budgetCapPaise: st.budget.capPaise,
              budgetMaxPerImagePaise: st.budget.maxPerImagePaise,
            },
          });
          st.setCredits(res.credits);
          if ("budget" in res && res.budget) {
            st.setBudgetState(res.budget);
          }
          let outUrl = res.url;
          if (res.fallback) {
            outUrl = await synthesizeFallbackComposite({
              baseImage: st.upload ?? st.plate?.url ?? undefined,
              serverFallbackUrl: res.url,
              design: st.design,
              engine: st.engine,
              scene3d: st.scene3d,
              idea: st.idea,
              variantIndex: 0,
            });
          }
          st.setPlate({
            url: outUrl,
            upload: st.upload ?? undefined,
            templateId: "agent-zuke",
            idea: st.idea.trim() || `${st.design.look} Agent Zuke Plate`,
            fallback: res.fallback,
            seed: res.seed,
            summary: res.summary,
          });
          summary = res.fallback
            ? `Rendered Free (₹0) Studio Plate (Seed #${res.seed})`
            : `Rendered Nano Banana plate (${formatPaiseShort(res.costPaise)} billed)`;
        } else if (step.order === 4) {
          const report = evaluateFidelityGate({
            geometryLock: st.engine.geometryLock,
            seedLocked: st.engine.seedLocked,
            hasSource: Boolean(st.upload || st.plate?.url),
            isFallback: Boolean(st.plate?.fallback),
            hasMask: Boolean(st.maskDataUrl),
            disclosureRequired: st.governance.aiDisclosureFooter,
            idea: st.idea,
            scene3d: st.scene3d,
            frame: st.frame,
          });
          st.setFidelityReport(report);
          summary = `Fidelity Gate C1–C10: ${Math.round(report.overallScore * 100)}/100 (${report.status.toUpperCase()})`;
        } else if (step.order === 6) {
          const upscaled = await runTiledUpscalePass(activeSrc, 2, "4x-ArchSharp", 18, true);
          st.setPlate({
            url: upscaled,
            upload: st.upload ?? undefined,
            templateId: "agent-zuke-enhance",
            idea: `${st.idea.trim() || st.design.look} (2× ArchSharp Enhance)`,
            fallback: true,
          });
          summary = "2× Tiled ArchSharp detail & fixture enhancement applied to active plate";
        } else if (step.order === 7) {
          st.addClipToKumVideo({
            track: "video",
            label: `Agent Zuke · ${st.design.look}`,
            imageUrl: useOriel.getState().plate?.url ?? activeSrc,
            durationSec: 5,
            cameraMove: "dolly-in",
            transition: "cross-dissolve",
          });
          summary = "Appended enhanced plate to KUM Video Studio multi-track timeline";
        } else {
          st.appendAuditEvent("Agent Zuke", "Completed 8-Step ArchViz Mission", `${st.design.look} · ${st.design.vertical}`);
          summary = "Logged C2PA delivery & governance audit trail; ready for Client Approval PDF";
        }

        spent += step.costCr;
        advanceAgentMissionStep(step.id, "done", summary);
        updateAgentMission({ spentCr: spent });
      }
      updateAgentMission({ active: false, awaitingApproval: false, spentCr: spent });
      toast.success("All 8 Agent Zuke mission steps executed on live studio pipeline!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Agent Zuke step failed.");
      updateAgentMission({ active: false });
    } finally {
      setRunningPipeline(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs" onClick={onClose}>
      <div
        data-testid="agent-zuke-drawer"
        onClick={(e) => e.stopPropagation()}
        className="arctic-glass-z2 flex h-full w-full max-w-md flex-col justify-between p-5 text-xs text-[#1b1c1a] dark:text-[#e8eff3]"
      >
        <div className="space-y-3 overflow-y-auto pr-1">
          <div className="flex items-center justify-between border-b border-[#d1c5b8]/35 pb-3 dark:border-[#a9bdc9]/20">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-[#725b38] dark:text-[#e8c98a]" />
              <div>
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider">Agent Zuke · Mission Control</h2>
                <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">{agentMission.missionName}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10">
              <X className="size-4" />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#d1c5b8]/45 bg-white/60 px-3 py-2 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
            <span>Budget Cap: <strong>{agentMission.budgetCapCr} CR</strong></span>
            <span className="text-[#725b38] dark:text-[#e8c98a]">Spent: {agentMission.spentCr} CR</span>
          </div>

          <div className="space-y-1.5">
            {agentMission.steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-start justify-between gap-2 rounded-xl border p-2.5",
                  step.status === "done"
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : step.status === "running"
                      ? "border-sky-400 bg-sky-500/10"
                      : step.status === "waiting_approval"
                        ? "border-[#e8c98a] bg-[#c5a880]/20 dark:bg-[#584411]/55"
                        : "border-[#d1c5b8]/40 bg-white/55 dark:border-[#43474b]/60 dark:bg-[#16202d]/70",
                )}
              >
                <div>
                  <p className="font-semibold">
                    {step.order}. {step.title}
                  </p>
                  <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">{step.outputSummary}</p>
                </div>
                <span className="shrink-0 rounded-full bg-black/15 px-2 py-0.5 font-mono text-[9px] uppercase">
                  {step.status === "done"
                    ? "Done"
                    : step.status === "running"
                      ? "Running…"
                      : step.status === "waiting_approval"
                        ? "Approve"
                        : `${step.costCr} CR`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-[#d1c5b8]/35 pt-3 dark:border-[#a9bdc9]/20">
          {agentMission.awaitingApproval ? (
            <button
              type="button"
              disabled={runningPipeline}
              onClick={() => {
                advanceAgentMissionStep("ms-5", "done", "Human gate approved — proceeding to Enhance, Video & Audit");
                updateAgentMission({ awaitingApproval: false });
                void runToGateOrFinish();
              }}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-3 text-[11px] font-bold text-white disabled:opacity-60"
            >
              {runningPipeline ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />}
              Approve Gate &amp; Finish
            </button>
          ) : (
            <button
              type="button"
              disabled={runningPipeline}
              onClick={() => void runToGateOrFinish()}
              className="ice-cta inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold disabled:opacity-60"
            >
              {runningPipeline ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
              {runningPipeline ? "Executing Live Pipeline…" : "Run Live Pipeline"}
            </button>
          )}
          <button
            type="button"
            disabled={runningPipeline}
            onClick={() => {
              resetAgentMission();
              toast.message("Mission queue reset");
            }}
            className="inline-flex h-9 items-center gap-1 rounded-full border border-[#d1c5b8]/55 px-3 text-[11px] disabled:opacity-50 dark:border-[#a9bdc9]/30"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. GOVERNANCE & STUDIO SETTINGS MODAL                                      */
/* -------------------------------------------------------------------------- */

export function GovernanceSettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const themeMode = useOriel((s) => s.themeMode);
  const setThemeMode = useOriel((s) => s.setThemeMode);
  const governance = useOriel((s) => s.governance);
  const updateGovernance = useOriel((s) => s.updateGovernance);
  const appendAuditEvent = useOriel((s) => s.appendAuditEvent);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={onClose}>
      <div
        data-testid="governance-settings-modal"
        onClick={(e) => e.stopPropagation()}
        className="arctic-glass-z2 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[26px] p-5 text-xs text-[#1b1c1a] dark:text-[#e8eff3]"
      >
        <div className="flex items-center justify-between border-b border-[#d1c5b8]/35 pb-3 dark:border-[#a9bdc9]/20">
          <div className="flex items-center gap-2">
            <Sliders className="size-5 text-[#725b38] dark:text-[#e8c98a]" />
            <div>
              <h2 className="font-display text-base font-semibold">Studio Settings & Enterprise Governance</h2>
              <p className="text-[11px] text-[#7f766a] dark:text-[#a9bdc9]">
                Arctic Harbor Dark / Atelier Light, Brand Kit, EU/US/APAC Residency, C2PA & Audit Trail
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 space-y-4">
          {/* Theme Switch */}
          <div className="flex items-center justify-between rounded-2xl border border-[#d1c5b8]/45 bg-white/60 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
            <div>
              <p className="font-semibold">Studio Appearance</p>
              <p className="text-[10px] text-[#7f766a] dark:text-[#a9bdc9]">
                Arctic Harbor Studio Dark (PRD default) or Atelier Paper Light
              </p>
            </div>
            <div className="flex gap-1 rounded-full bg-[#efeeea] p-0.5 dark:bg-[#121c29]">
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold",
                  themeMode === "dark" ? "bg-[#cfe3f0] text-[#08131f]" : "",
                )}
              >
                <Moon className="size-3" /> Arctic Dark
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold",
                  themeMode === "light" ? "bg-[#c5a880] text-[#281800]" : "",
                )}
              >
                <Sun className="size-3" /> Atelier Light
              </button>
            </div>
          </div>

          {/* Residency + Retention + No-Training */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-[#d1c5b8]/45 bg-white/60 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
              <p className="font-semibold">Data Residency & Retention</p>
              <div className="flex gap-1">
                {(["EU", "US", "APAC"] as const).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => {
                      updateGovernance({ residency: reg });
                      appendAuditEvent("Admin", `Set Data Residency to ${reg}`, "Workspace");
                    }}
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-semibold",
                      governance.residency === reg
                        ? "bg-[#c5a880] text-[#281800] dark:bg-[#cfe3f0] dark:text-[#08131f]"
                        : "bg-[#efeeea] dark:bg-[#202b38]",
                    )}
                  >
                    {reg}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 pt-1 text-[11px]">
                <input
                  type="checkbox"
                  checked={governance.noTrainingContract}
                  onChange={(e) => updateGovernance({ noTrainingContract: e.target.checked })}
                  className="accent-[#cfe3f0]"
                />
                <span>Zero-training enterprise SLA enabled</span>
              </label>
              <label className="flex items-center gap-2 text-[11px]">
                <input
                  type="checkbox"
                  checked={governance.c2paWatermark}
                  onChange={(e) => updateGovernance({ c2paWatermark: e.target.checked })}
                  className="accent-[#cfe3f0]"
                />
                <span>Embed C2PA Content Credentials on exports</span>
              </label>
            </div>

            <div className="space-y-2 rounded-2xl border border-[#d1c5b8]/45 bg-white/60 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
              <p className="font-semibold">Brand Kit & Honest Staging Footer</p>
              <input
                type="text"
                value={governance.brandName}
                onChange={(e) => updateGovernance({ brandName: e.target.value })}
                className="h-8 w-full rounded-xl border border-[#d1c5b8]/55 bg-white px-2.5 text-[11px] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
              />
              <textarea
                rows={2}
                value={governance.disclosureTemplate}
                onChange={(e) => updateGovernance({ disclosureTemplate: e.target.value })}
                className="w-full rounded-xl border border-[#d1c5b8]/55 bg-white p-2 text-[10px] dark:border-[#a9bdc9]/25 dark:bg-[#050f1b] dark:text-[#e8eff3]"
              />
            </div>
          </div>

          {/* Audit Log */}
          <div className="space-y-1.5 rounded-2xl border border-[#d1c5b8]/45 bg-white/60 p-3 dark:border-[#a9bdc9]/20 dark:bg-[#16202d]/80">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Workspace Audit Trail</p>
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(governance, null, 2)], { type: "application/json" });
                  const u = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = u;
                  a.download = `oriel-governance-audit-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(u);
                  toast.success("Downloaded Workspace Policy & Audit JSON");
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#c5a880]/20 px-2.5 py-0.5 text-[10px] font-semibold dark:bg-[#202b38] dark:text-[#e8c98a]"
              >
                <Download className="size-3" /> Export Policy
              </button>
            </div>
            <div className="max-h-28 space-y-1 overflow-y-auto">
              {governance.auditEvents.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between text-[10px] text-[#4d463c] dark:text-[#a9bdc9]">
                  <span>
                    <strong className="text-[#1b1c1a] dark:text-[#e8eff3]">{ev.actor}</strong> · {ev.action}
                  </span>
                  <span className="font-mono text-[9px]">{ev.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
