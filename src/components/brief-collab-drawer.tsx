import {
  Check,
  CheckCircle2,
  Copy,
  Link2,
  MessageSquare,
  RefreshCw,
  Send,
  Trash2,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  COLLAB_PARAMETER_TARGETS,
  COLLAB_REVIEWER_ROLES,
  buildBriefShareUrl,
  extractParameterDisplayValues,
  summarizeCommentsByParameter,
  type CollabParameterKey,
  type CollabReviewerRole,
  type SharedBriefSession,
  type SharedBriefSnapshot,
} from "@/lib/brief-collab";
import { cn } from "@/lib/utils";

interface BriefCollabDrawerProps {
  open: boolean;
  onClose: () => void;
  session: SharedBriefSession | null;
  activeSnapshot: SharedBriefSnapshot;
  isSyncing: boolean;
  isCreatingShare: boolean;
  lastSyncedAt: string | null;
  reviewerName: string;
  onReviewerNameChange: (name: string) => void;
  reviewerRole: CollabReviewerRole;
  onReviewerRoleChange: (role: CollabReviewerRole) => void;
  onGenerateShareLink: () => Promise<void>;
  onSyncSnapshot: () => Promise<void>;
  onRefreshSession: () => Promise<void>;
  onAddComment: (payload: { parameterKey: CollabParameterKey; body: string }) => Promise<void>;
  onToggleCommentStatus: (commentId: string, nextStatus: "open" | "resolved") => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export function BriefCollabDrawer({
  open,
  onClose,
  session,
  activeSnapshot,
  isSyncing,
  isCreatingShare,
  lastSyncedAt,
  reviewerName,
  onReviewerNameChange,
  reviewerRole,
  onReviewerRoleChange,
  onGenerateShareLink,
  onSyncSnapshot,
  onRefreshSession,
  onAddComment,
  onToggleCommentStatus,
  onDeleteComment,
}: BriefCollabDrawerProps) {
  const [selectedParam, setSelectedParam] = useState<CollabParameterKey>("style");
  const [filterParam, setFilterParam] = useState<CollabParameterKey | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "resolved">("all");
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const parameterValues = useMemo(
    () => extractParameterDisplayValues(session ? session.snapshot : activeSnapshot),
    [session, activeSnapshot],
  );

  const commentCounts = useMemo(
    () => summarizeCommentsByParameter(session?.comments ?? []),
    [session?.comments],
  );

  const filteredComments = useMemo(() => {
    const list = session?.comments ?? [];
    return list.filter((item) => {
      if (filterParam !== "all" && item.parameterKey !== filterParam) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return true;
    });
  }, [session?.comments, filterParam, statusFilter]);

  const shareUrl = useMemo(() => {
    if (!session) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://oriel.studio";
    return buildBriefShareUrl(origin, session.shareId);
  }, [session]);

  if (!open) return null;

  async function handleCopyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1800);
    } catch {
      // Clipboard may be restricted in headless contexts; input remains selectable
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = commentBody.trim();
    if (!trimmed || !session || submitting) return;
    setSubmitting(true);
    try {
      await onAddComment({ parameterKey: selectedParam, body: trimmed });
      setCommentBody("");
    } finally {
      setSubmitting(false);
    }
  }

  const openCount = (session?.comments ?? []).filter((c) => c.status === "open").length;
  const resolvedCount = (session?.comments ?? []).filter((c) => c.status === "resolved").length;

  return (
    <div
      data-testid="brief-collab-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Team Collaboration & Parameter Review"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-4xl flex-col border-l border-line bg-surface text-fg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drawer Header */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-raised/60 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-[#b08a45]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b08a45]">
                Team Collaboration &amp; Parameter Review
              </span>
            </div>
            <h2 className="mt-0.5 truncate font-serif text-xl font-bold text-fg">
              {session ? session.title : activeSnapshot.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {session ? (
              <button
                type="button"
                data-testid="collab-sync-btn"
                onClick={() => void onRefreshSession()}
                disabled={isSyncing}
                className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-xs font-medium text-muted transition hover:border-[#d4b06a] hover:text-fg disabled:opacity-60"
                title="Refresh shared brief & comments"
              >
                <RefreshCw className={cn("size-3.5", isSyncing && "animate-spin")} />
                Sync
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close collaboration panel"
              className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {/* Share Link Generation / Active Session Bar */}
        <div className="shrink-0 border-b border-line bg-bg/50 px-5 py-3.5">
          {!session ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block text-[11px]">
                  <span className="font-medium text-muted">Your Name</span>
                  <input
                    type="text"
                    data-testid="collab-owner-name-input"
                    value={reviewerName}
                    onChange={(e) => onReviewerNameChange(e.target.value)}
                    placeholder="Lead Architect"
                    className="mt-1 h-9 w-full rounded-xl border border-line bg-surface px-3 text-xs text-fg outline-none focus:border-[#d4b06a]"
                  />
                </label>
                <label className="block text-[11px]">
                  <span className="font-medium text-muted">Studio Role</span>
                  <select
                    value={reviewerRole}
                    onChange={(e) => onReviewerRoleChange(e.target.value as CollabReviewerRole)}
                    className="mt-1 h-9 w-full rounded-xl border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
                  >
                    {COLLAB_REVIEWER_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="button"
                data-testid="generate-share-link-btn"
                disabled={isCreatingShare}
                onClick={() => void onGenerateShareLink()}
                className="gold-fill inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-60"
              >
                <Link2 className="size-3.5" />
                {isCreatingShare ? "Generating Link..." : "Generate Share Link"}
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="font-mono text-[11px] font-semibold text-[#b08a45]">
                    ID: {session.shareId}
                  </span>
                  <span className="text-muted">Shared by {session.authorName}</span>
                  <span className="font-mono text-[11px] tabular-nums text-faint">
                    {openCount} open · {resolvedCount} resolved
                    {lastSyncedAt ? ` · Updated ${lastSyncedAt}` : ""}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    data-testid="sync-brief-snapshot-btn"
                    disabled={isSyncing}
                    onClick={() => void onSyncSnapshot()}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 text-[11px] font-medium text-fg transition hover:border-[#d4b06a]"
                  >
                    <UploadCloud className="size-3.5 text-[#b08a45]" />
                    Push Brief Edits
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  readOnly
                  data-testid="collab-share-url-input"
                  aria-label="Unique brief share link"
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="h-9 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 font-mono text-xs text-fg outline-none"
                />
                <button
                  type="button"
                  data-testid="copy-share-url-btn"
                  onClick={() => void handleCopyLink()}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#d4b06a]/60 bg-surface px-3.5 text-xs font-semibold text-fg transition hover:border-[#b08a45]"
                >
                  {copiedLink ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5 text-[#b08a45]" />}
                  {copiedLink ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid: Left Parameters List / Right Parameter Comments */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12 md:overflow-hidden">
          {/* Left: Design Parameter Targets */}
          <section className="border-b border-line p-4 md:col-span-5 md:overflow-y-auto md:border-r md:border-b-0">
            <div className="flex items-center justify-between gap-2 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Design Parameters ({COLLAB_PARAMETER_TARGETS.length})
              </h3>
              {filterParam !== "all" ? (
                <button
                  type="button"
                  onClick={() => setFilterParam("all")}
                  className="text-[11px] font-medium text-[#b08a45] hover:underline"
                >
                  Show All
                </button>
              ) : null}
            </div>

            <div className="space-y-1.5">
              {COLLAB_PARAMETER_TARGETS.map((target) => {
                const counts = commentCounts[target.key];
                const active = selectedParam === target.key;
                const filtered = filterParam === target.key;
                return (
                  <button
                    key={target.key}
                    type="button"
                    data-testid={`collab-param-row-${target.key}`}
                    onClick={() => {
                      setSelectedParam(target.key);
                      setFilterParam((prev) => (prev === target.key ? "all" : target.key));
                    }}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left transition",
                      active || filtered
                        ? "border-[#b08a45] bg-[#d4b06a]/12"
                        : "border-line bg-raised/50 hover:border-[#d4b06a]/60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-fg">{target.label}</span>
                      <span className="font-mono text-[10px] tabular-nums text-muted">
                        {counts.total > 0 ? `${counts.open} open · ${counts.total}` : "0"}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 font-mono text-[11px] text-muted">
                      {parameterValues[target.key]}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Right: Parameter-Anchored Comments */}
          <section className="flex min-h-0 flex-col p-4 md:col-span-7 md:overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-[#b08a45]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {filterParam === "all"
                    ? "All Parameter Comments"
                    : `Anchored: ${COLLAB_PARAMETER_TARGETS.find((t) => t.key === filterParam)?.label}`}
                </h3>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-line bg-raised p-0.5">
                {(["all", "open", "resolved"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={cn(
                      "rounded-md px-2 py-1 text-[11px] font-medium capitalize transition",
                      statusFilter === st ? "gold-fill text-[#2a1c0c]" : "text-muted hover:text-fg",
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Composer */}
            {session ? (
              <form
                onSubmit={(e) => void handleSubmitComment(e)}
                className="mb-3 shrink-0 rounded-2xl border border-line bg-raised/60 p-3"
              >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className="block text-[11px]">
                    <span className="text-faint">Reviewer</span>
                    <input
                      type="text"
                      data-testid="collab-author-input"
                      value={reviewerName}
                      onChange={(e) => onReviewerNameChange(e.target.value)}
                      placeholder="Your name"
                      className="mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
                    />
                  </label>
                  <label className="block text-[11px]">
                    <span className="text-faint">Role</span>
                    <select
                      value={reviewerRole}
                      onChange={(e) => onReviewerRoleChange(e.target.value as CollabReviewerRole)}
                      className="mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
                    >
                      {COLLAB_REVIEWER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-[11px] sm:col-span-2">
                    <span className="text-faint">Target Parameter</span>
                    <select
                      data-testid="collab-param-select"
                      value={selectedParam}
                      onChange={(e) => setSelectedParam(e.target.value as CollabParameterKey)}
                      className="mt-1 h-8 w-full rounded-lg border border-line bg-surface px-2.5 text-xs text-fg outline-none focus:border-[#d4b06a]"
                    >
                      {COLLAB_PARAMETER_TARGETS.map((t) => (
                        <option key={t.key} value={t.key}>
                          {t.label} — {parameterValues[t.key]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-end">
                  <textarea
                    data-testid="collab-comment-input"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    rows={2}
                    placeholder={`Comment on ${COLLAB_PARAMETER_TARGETS.find((t) => t.key === selectedParam)?.label} (${parameterValues[selectedParam]})...`}
                    className="min-h-14 flex-1 resize-none rounded-xl border border-line bg-surface px-3 py-2 text-xs text-fg outline-none focus:border-[#d4b06a]"
                  />
                  <button
                    type="submit"
                    data-testid="collab-submit-comment-btn"
                    disabled={submitting || !commentBody.trim()}
                    className="gold-fill inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-4 text-xs font-semibold text-[#2a1c0c] disabled:opacity-50"
                  >
                    <Send className="size-3.5" />
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-3 rounded-2xl border border-dashed border-line bg-raised/40 p-4 text-xs text-muted">
                Generate a unique share link above to invite teammates and anchor feedback directly to architectural design parameters.
              </div>
            )}

            {/* Comment Thread */}
            <div className="min-h-40 flex-1 space-y-2.5 overflow-y-auto pr-1">
              {session && filteredComments.length === 0 ? (
                <div className="rounded-2xl border border-line/70 bg-raised/30 p-5 text-center text-xs text-muted">
                  No comments match this filter yet. Select any design parameter on the left and post the first review note.
                </div>
              ) : null}

              {filteredComments.map((cmt) => (
                <article
                  key={cmt.id}
                  data-testid="collab-comment-item"
                  className={cn(
                    "rounded-2xl border p-3.5 transition",
                    cmt.status === "resolved"
                      ? "border-line/70 bg-raised/30 opacity-80"
                      : "border-line bg-raised/70",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-fg">{cmt.authorName}</span>
                        <span className="text-[11px] text-faint">{cmt.authorRole}</span>
                        <span className="font-mono text-[10px] text-faint">
                          {new Date(cmt.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-[#b08a45]">
                        {cmt.parameterLabel}: <span className="text-fg/80">{cmt.parameterValue || "—"}</span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        data-testid="toggle-comment-status-btn"
                        onClick={() =>
                          void onToggleCommentStatus(
                            cmt.id,
                            cmt.status === "resolved" ? "open" : "resolved",
                          )
                        }
                        className={cn(
                          "inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border px-2 text-[11px] font-medium transition",
                          cmt.status === "resolved"
                            ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-700"
                            : "border-line bg-surface text-muted hover:border-[#d4b06a] hover:text-fg",
                        )}
                      >
                        <CheckCircle2 className="size-3" />
                        {cmt.status === "resolved" ? "Resolved" : "Resolve"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDeleteComment(cmt.id)}
                        aria-label="Delete comment"
                        className="grid size-7 place-items-center rounded-lg border border-line bg-surface text-faint transition hover:text-red-600"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-fg">
                    {cmt.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
