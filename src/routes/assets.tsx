import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GROUPS, LOOKS, VERTICALS, type VerticalId } from "@/lib/properties";
import { useOriel } from "@/lib/store";

export const Route = createFileRoute("/assets")({
  component: AssetsPage,
});

function AssetsPage() {
  const setVertical = useOriel((state) => state.setVertical);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setPick = useOriel((state) => state.setPick);
  const navigate = useNavigate();

  function applyLook(vertical: VerticalId, name: string) {
    setVertical(vertical);
    setDesignField("look", name);
    void navigate({ to: "/" });
  }

  return (
    <main className="h-full overflow-y-auto px-4 py-6 md:px-8">
      <h1 className="font-syne text-3xl font-bold">Assets</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">Looks and finishes from the studio library. Choosing one returns you to the canvas.</p>
      {VERTICALS.map((vertical) => (
        <section key={vertical.id} className="mt-8">
          <h2 className="font-syne text-xl font-semibold">{vertical.label}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {LOOKS[vertical.id].map((look) => (
              <button key={look.name} type="button" onClick={() => applyLook(vertical.id, look.name)} className="overflow-hidden rounded-2xl border border-line text-left">
                <img src={look.image} alt="" className="h-28 w-full object-cover" />
                <span className="block px-3 py-2 text-sm">{look.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {GROUPS[vertical.id].flatMap((group) =>
              group.options.map((option) => (
                <button
                  key={`${group.id}-${option}`}
                  type="button"
                  className="h-10 rounded-full border border-line px-3 text-sm text-muted"
                  onClick={() => {
                    setVertical(vertical.id);
                    setPick(group.id, option);
                    void navigate({ to: "/" });
                  }}
                >
                  {group.label}: {option}
                </button>
              )),
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
