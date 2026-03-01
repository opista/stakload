import { HomeHero } from "@components/home-hero/home-hero";
import { GamesCarousel } from "@components/media/games-carousel";
import { Heading } from "@components/ui/heading";
import { SubHeading } from "@components/ui/sub-heading";
import { FeaturedGameModel } from "@stakload/contracts/database/games";
import { useGameStore } from "@store/game.store";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const HomeView = () => {
  const newGames = useGameStore(useShallow((state) => state.newGames));

  const [activeGame, setActiveGame] = useState<FeaturedGameModel | null>(null);

  const hasNewGames = newGames.length > 0;
  const currentActiveGame = activeGame ?? (hasNewGames ? newGames[0] : null);

  if (!hasNewGames) {
    return (
      <div className="flex min-h-full w-full flex-col p-8 bg-zinc-950">
        <Heading level={1} className="text-4xl font-black text-white/70">
          TODO: Something here when you have no games
        </Heading>
      </div>
    );
  }

  return (
    <main className="relative flex h-full flex-1 flex-col overflow-y-auto overflow-x-hidden custom-scrollbar bg-zinc-950 font-sans text-slate-100">
      {currentActiveGame && (
        <HomeHero game={currentActiveGame}>
          <div className="w-full relative z-20">
            <SubHeading as="h3" className="text-slate-500 mb-6 px-12">
              Recently Played
            </SubHeading>
            <GamesCarousel games={newGames} onGameActive={setActiveGame} />
          </div>
        </HomeHero>
      )}
    </main>
  );
};
