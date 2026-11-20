import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  HomeDiscoverDeck,
  type DiscoverTab,
  type VisualSceneItem,
} from "@/components/home-discover-deck";
import { buildAtelierIterationCards, type AtelierPlateCard, type AtelierPlateMeta } from "@/lib/atelier-studio";
import type { NamedStudioId } from "@/lib/prd-studio-data";
import { useOriel } from "@/lib/store";

type ExploreSearch = {
  tab?: DiscoverTab;
};

const VALID_TABS: readonly DiscoverTab[] = ["all", "iterations", "scenes", "camera", "studios"];

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => ({
    tab: VALID_TABS.includes(search.tab as DiscoverTab) ? (search.tab as DiscoverTab) : "all",
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { tab } = Route.useSearch();
  const activeTab: DiscoverTab = tab ?? "all";
  const navigate = useNavigate();

  const history = useOriel((state) => state.history);
  const plate = useOriel((state) => state.plate);
  const iterations = useOriel((state) => state.iterations);
  const activeStudio = useOriel((state) => state.activeStudio);
  const setActiveStudio = useOriel((state) => state.setActiveStudio);
  const restoreIteration = useOriel((state) => state.restoreIteration);
  const setUpload = useOriel((state) => state.setUpload);
  const setDesignField = useOriel((state) => state.setDesignField);
  const setVertical = useOriel((state) => state.setVertical);
  const setIdea = useOriel((state) => state.setIdea);

  const metaByUrl = useMemo(() => {
    const map: Record<string, AtelierPlateMeta> = {};
    for (const item of iterations) {
      map[item.url] = {
        idea: item.idea,
        seed: item.seed,
        look: item.look,
        light: item.light,
        ratio: item.ratio,
        gateScore: item.gateScore,
        gateStatus: item.gateStatus,
        fallback: item.fallback,
      };
    }
    return map;
  }, [iterations]);

  const plateIterationCards = useMemo(
    () => buildAtelierIterationCards(history, plate?.url, metaByUrl),
    [history, plate?.url, metaByUrl],
  );

  function goToStudioStage(stage?: string) {
    void navigate({
      to: "/",
      search: stage ? ({ stage } as never) : undefined,
    });
  }

  function handleTabChange(nextTab: DiscoverTab) {
    void navigate({
      to: "/explore",
      search: { tab: nextTab },
      replace: true,
    });
  }

  function handleSelectIterationCard(card: AtelierPlateCard) {
    if (card.isGenerated) {
      restoreIteration(card.url);
      toast.success(`Restored ${card.tag}`);
      goToStudioStage("result");
    } else {
      setUpload(card.url);
      setDesignField("light", card.lightPreset);
      toast.success(`Loaded ${card.title} (${card.subtitle}) into Source frame`);
      goToStudioStage("source");
    }
  }

  function handleLoadVisualScene(scene: VisualSceneItem) {
    setVertical(scene.vertical);
    setDesignField("look", scene.look);
    setDesignField("light", scene.light);
    setUpload(scene.image);
    setIdea(scene.prompt);
    toast.success(`Loaded "${scene.title}" into Studio`);
    goToStudioStage("source");
  }

  function handleLaunchStudio(studioId: NamedStudioId) {
    setActiveStudio(studioId);
    if (studioId === "sam-3d") {
      goToStudioStage("split");
    } else if (studioId === "mas-2d") {
      goToStudioStage(useOriel.getState().plate?.url ? "result" : "mask");
    } else if (studioId === "king-360") {
      goToStudioStage("360");
    } else if (studioId === "node-studio") {
      goToStudioStage("nodes");
    } else {
      goToStudioStage();
    }
  }

  return (
    <main className="studio-scroll flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-20 md:px-6 md:pt-4">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3">
        {/* Explore Tab Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-0.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-[#c5a880]/20 text-[#725b38] dark:bg-[#cfe3f0]/15 dark:text-[#e8c98a]">
              <Compass className="size-4.5" />
            </span>
            <div>
              <h1 className="font-display text-lg font-semibold tracking-tight text-[#1b1c1a] sm:text-xl dark:text-[#fcfdff]">
                Explore Workspace
              </h1>
              <p className="text-xs text-[#7f766a] dark:text-[#a9bdc9]">
                Iterations, curated visual scene starters, radial optics, and dedicated studio pipelines
              </p>
            </div>
          </div>
        </div>

        <HomeDiscoverDeck
          activeTab={activeTab}
          onTabChange={handleTabChange}
          plateIterationCards={plateIterationCards}
          activeView="source"
          activeStudio={activeStudio}
          onSelectIterationCard={handleSelectIterationCard}
          onLoadVisualScene={handleLoadVisualScene}
          onLaunchStudio={handleLaunchStudio}
          onOpenStage={(stage) => goToStudioStage(stage)}
          onScrollTop={() => goToStudioStage()}
        />
      </div>
    </main>
  );
}
