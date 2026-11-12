import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useOriel } from "@/lib/store";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/plans")({
  component: PlansPage,
});

const TIERS = [
  {
    name: "Field",
    price: "Included",
    detail: "The studio you are in. Full library, five dialects, the benchmark, and boards kept on this device.",
    points: ["38 task templates", "Tested briefs with plates", "Local boards and iteration log"],
  },
  {
    name: "Practice",
    price: "For a studio",
    detail: "Shared boards and a review link a client can open without a login maze. Mapped here, not billed.",
    points: ["Seats for a project team", "Client review links", "A shared iteration log"],
  },
  {
    name: "Atelier",
    price: "For a practice",
    detail: "Your own benchmark against the models you actually ship, and a private prompt set that does not leak into a public library.",
    points: ["Private prompt governance", "A benchmark on your stack", "Review criteria for your stage"],
  },
];

function PlansPage() {
  const requests = useOriel((state) => state.requests);
  const addRequest = useOriel((state) => state.addRequest);
  const [studio, setStudio] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("Practice seat");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (studio.trim().length < 2) {
      setError("Name the studio.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Use a real email so the note is worth keeping.");
      return;
    }
    addRequest({ studio: studio.trim(), email: email.trim(), note: note.trim() });
    setSaved(true);
    setError("");
    setStudio("");
    setEmail("");
  }

  return (
    <main className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <p className="text-xs font-medium uppercase tracking-wide text-lime">Plans</p>
        <h1 className="mt-2 max-w-3xl font-syne text-4xl font-bold tracking-tight md:text-5xl">
          A field kit now. A practice desk when you need seats.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">
          Field is fully usable in this preview. Practice and Atelier are the commercial shape — request a seat and it stays with this browser. Nothing is charged.
        </p>

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <article key={tier.name} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
              <h2 className="font-syne text-2xl font-bold">{tier.name}</h2>
              <p className="mt-2 text-sm font-medium text-lime">{tier.price}</p>
              <p className="mt-3 text-sm text-muted">{tier.detail}</p>
              <ul className="mt-4 space-y-2 text-sm text-fg">
                {tier.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <form onSubmit={submit} className="mt-10 max-w-xl rounded-2xl border border-line p-5">
          <h2 className="font-syne text-xl font-semibold">Request a practice seat</h2>
          <label className="mt-4 block text-xs text-faint" htmlFor="studio-name">
            Studio
          </label>
          <input
            id="studio-name"
            value={studio}
            onChange={(event) => setStudio(event.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none"
          />
          <label className="mt-3 block text-xs text-faint" htmlFor="studio-email">
            Email
          </label>
          <input
            id="studio-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            inputMode="email"
            autoComplete="email"
            className="mt-1 h-11 w-full rounded-xl border border-line bg-raised px-3 text-sm text-fg outline-none"
          />
          <label className="mt-3 block text-xs text-faint" htmlFor="studio-note">
            Note
          </label>
          <textarea
            id="studio-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-line bg-raised px-3 py-2 text-sm text-fg outline-none"
          />
          {error ? <p className="mt-3 text-sm text-lime">{error}</p> : null}
          {saved ? <p className="mt-3 text-sm text-lime">Request kept on this device. Nothing was sent or charged.</p> : null}
          <button type="submit" className="mt-4 h-12 rounded-full bg-lime px-5 text-sm font-semibold text-ink">
            Keep this request
          </button>
        </form>

        {requests.length > 0 ? (
          <ul className="mt-6 max-w-xl space-y-2">
            {requests.map((request) => (
              <li key={request.id} className="rounded-xl border border-line px-3 py-2 text-sm">
                <p className="text-fg">{request.studio}</p>
                <p className="text-muted">{request.email}</p>
                <p className="text-xs text-faint">
                  {request.note} · {formatWhen(request.at)}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}
