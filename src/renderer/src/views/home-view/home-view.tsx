import { FeaturedGamesCarousel } from "@components/media/featured-games-carousel";
import { GamesCarousel } from "@components/media/games-carousel";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

export const HomeView = () => {
  const { newGames, quickLaunchGames } = useGameStore(
    useShallow((state) => ({
      newGames: state.newGames,
      quickLaunchGames: state.quickLaunchGames,
    })),
  );

  const hasQuickLaunchGames = quickLaunchGames.length > 0;
  const hasNewGames = newGames.length > 0;

  if (!hasQuickLaunchGames && !hasNewGames) {
    return (
      <div className="flex min-h-full w-full flex-col p-8">
        <h1 className="text-4xl font-black text-white/70">TODO: Something here when you have no games</h1>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto pr-4 scrollbar-hide">
      <div className="flex min-h-full flex-col gap-[60px] pb-8 pt-4">
        {hasQuickLaunchGames && <GamesCarousel games={quickLaunchGames} title="Continue Playing" />}
        {hasNewGames && <FeaturedGamesCarousel games={newGames} title="Recently Added" />}
      </div>
    </div>
  );
};
