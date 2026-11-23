import { createFileRoute } from "@tanstack/react-router";
import { Check, MessageSquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { addDecisionFn, getReviewFn } from "@/lib/revision/review-api";
import type { ReviewPayload, ReviewPin } from "@/lib/revision/review-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/review/$shareId")({
  head: () => ({ meta: [{ title: "Review a revision" }, { name: "robots", content: "noindex" }] }),
  component: ReviewPage,
});

function ReviewPage() {
  const { shareId } = Route.useParams();
  const [review, setReview] = useState<ReviewPayload | null | undefined>(undefined);
  const [viewIdx, setViewIdx] = useState(0);
  const [mode, setMode] = useState<"after" | "before">("after");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [pins, setPins] = useState<ReviewPin[]>([]);
  const [pinning, setPinning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<"approved" | "changes_requested" | null>(null);

  useEffect(() => {
    let live = true;
    void getReviewFn({ data: { shareId } })
      .then((r) => live && setReview(r))
      .catch(() => live && setReview(null));
    return () => {
      live = false;
    };
  }, [shareId]);

  if (review === undefined) return <main className="grid min-h-dvh place-items-center text-sm text-muted" aria-busy="true">Loading…</main>;
  if (review === null) {
    return (
      <main className="mx-auto grid min-h-dvh max-w-md place-items-center px-6 text-center">
        <div>
          <h1 className="font-syne text-2xl font-bold">This review link is not valid</h1>
          <p className="mt-2 text-sm text-muted">It may have been mistyped. Ask the designer to send the link again.</p>
        </div>
      </main>
    );
  }

  const image = review.images[viewIdx];
  const already = review.decisions.find((d) => d.setId === review.set.id && d.decision === "approved");

  async function submit(decision: "approved" | "changes_requested") {
    if (!review) return;
    setBusy(true);
    setError("");
    try {
      await addDecisionFn({ data: { shareId, decision, reviewerName: name, note, pins } });
      setDone(decision);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send your response.");
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6" data-testid="client-review">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-lime">Revision for your approval</p>
        <h1 className="mt-1 font-syne text-2xl font-bold md:text-3xl">{review.projectName}</h1>
        {review.changeRequest ? <p className="mt-2 text-sm text-muted">You asked: “{review.changeRequest}”</p> : null}
        <p className="mt-1 text-xs text-muted">
          Finish: <span className="font-semibold text-fg">{review.finish.label}</span>
          {review.finish.supplier ? ` · ${review.finish.supplier}` : ""}
          {review.finish.sku ? ` · ${review.finish.sku}` : ""}
        </p>
      </header>

      {review.images.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Views">
          {review.images.map((img, i) => (
            <button key={img.viewId} type="button" role="tab" aria-selected={i === viewIdx} onClick={() => setViewIdx(i)} className={cn("h-9 rounded-full border px-4 text-xs font-semibold", i === viewIdx ? "border-lime bg-lime/20" : "border-line text-muted")}>
              {img.name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(["before", "after"] as const).map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={cn("h-9 rounded-full border px-4 text-xs font-semibold capitalize", mode === m ? "border-lime bg-lime/20" : "border-line text-muted")}>
            {m === "before" ? "Before" : "After (proposed)"}
          </button>
        ))}
        {!done ? (
          <button type="button" aria-pressed={pinning} onClick={() => setPinning((v) => !v)} className={cn("ml-auto inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold", pinning ? "border-lime bg-lime/20" : "border-line text-muted")}>
            <MessageSquarePlus className="size-4" /> {pinning ? "Click the image to place a comment" : "Add a comment on the image"}
          </button>
        ) : null}
      </div>

      <div
        className={cn("relative mt-3 overflow-hidden rounded-2xl border border-line bg-black/30", pinning && "cursor-crosshair")}
        onClick={(e) => {
          if (!pinning || !image) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const body = window.prompt("What should change here?")?.trim();
          setPinning(false);
          if (body) setPins((cur) => [...cur, { viewId: image.viewId, x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height, body: body.slice(0, 300) }]);
        }}
      >
        {image ? <img src={mode === "before" ? image.before : image.after} alt={`${image.name}, ${mode}`} className="block w-full" /> : null}
        {pins.filter((p) => p.viewId === image?.viewId).map((p, i) => (
          <span key={i} title={p.body} className="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#c5a880] text-[11px] font-bold text-[#281800]" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}>
            {i + 1}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-faint">Presentation visual. Colour under rendered light is an approximation of the supplied sample. This does not certify dimensions, structure or cost.</p>

      {pins.length ? (
        <ul className="mt-3 space-y-1 text-xs">
          {pins.map((p, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="font-semibold">{i + 1}.</span> {p.body}
              <button type="button" className="text-muted hover:text-fg" onClick={() => setPins((cur) => cur.filter((_, j) => j !== i))}>remove</button>
            </li>
          ))}
        </ul>
      ) : null}

      {done ? (
        <section role="status" className="mt-6 rounded-2xl border border-[#5f8a62]/50 bg-[#5f8a62]/10 p-5" data-testid="review-done">
          <p className="flex items-center gap-2 font-semibold"><Check className="size-5 text-[#5f8a62]" /> {done === "approved" ? "Thank you. You approved this version." : "Thank you. Your requested changes were sent."}</p>
          <p className="mt-1 text-sm text-muted">The designer can see your response. You can close this page.</p>
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-syne text-lg font-semibold">Your decision</h2>
          {already ? <p className="mt-1 text-xs text-muted">{already.reviewerName} already approved this version on {new Date(already.createdAt).toLocaleDateString()}.</p> : null}
          <div className="mt-3 grid gap-3">
            <label className="block text-xs font-semibold text-muted">
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none focus:border-lime" data-testid="reviewer-name" />
            </label>
            <label className="block text-xs font-semibold text-muted">
              Note (required if you want changes)
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-line bg-raised px-3 py-2 text-sm text-fg outline-none focus:border-lime" data-testid="reviewer-note" />
            </label>
          </div>
          {error ? <p role="alert" className="mt-2 text-sm text-[#c4604d]">{error}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy || !name.trim()} onClick={() => void submit("approved")} className="gold-fill inline-flex h-11 items-center rounded-full px-6 text-sm font-semibold disabled:opacity-50" data-testid="approve-btn">
              Approve this version
            </button>
            <button type="button" disabled={busy || !name.trim()} onClick={() => void submit("changes_requested")} className="inline-flex h-11 items-center rounded-full border border-line px-6 text-sm font-semibold hover:border-lime disabled:opacity-50" data-testid="changes-btn">
              Request changes
            </button>
          </div>
          <p className="mt-3 text-[11px] text-faint">Your approval applies to exactly this version ({review.set.id.slice(0, 10)}). If the designer changes anything, you will be asked again.</p>
        </section>
      )}
    </main>
  );
}
