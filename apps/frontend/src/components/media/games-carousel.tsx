import { useState } from "react";
import { useNavigate } from "react-router";

import { GameCover } from "@components/game/game-cover";
import { GameListModel } from "@stakload/contracts/database/games";

import { Carousel } from "./carousel";

type GamesCarouselProps<T> = {
  games: T[];
  loop?: boolean;
  onGameActive?: (game: T) => void;
};

export const GamesCarousel = <
  T extends Partial<GameListModel> & {
    _id: string;
    name: string;
    screenshots?: string[];
  },
>({
  games,
  loop,
  onGameActive,
}: GamesCarouselProps<T>) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <Carousel
        options={{ align: "start", loop }}
        className="px-12"
        onSlideChange={(index) => {
          setActiveIndex(index);
          onGameActive?.(games[index]);
        }}
        slideClassName="w-[175px] h-sm:w-[200px] h-md:w-[220px] h-lg:w-[260px] h-xl:w-[320px] shrink-0"
        withControls={false}
      >
        {games.map((game, index) => {
          const mappedGame: GameListModel = {
            ...game,
            cover: game.cover ?? game.screenshots?.[0],
            isFavourite: game.isFavourite,
            isInstalled: game.isInstalled,
            isQuickLaunch: game.isQuickLaunch,
            library: game.library,
          } as GameListModel;

          return (
            <GameCover
              key={game._id}
              game={mappedGame}
              isActive={index === activeIndex}
              onClick={(g) => navigate(`/library/${g._id}`)}
              onMouseEnter={() => onGameActive?.(game)}
              onFocus={() => onGameActive?.(game)}
              showGameTitle={false}
            />
          );
        })}
      </Carousel>
    </div>
  );
};
