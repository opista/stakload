import { GameCover } from "@components/game/game-cover";
import { GameListModel } from "@contracts/database/games";
import { useNavigate } from "react-router";

import { Carousel } from "./carousel";

type GamesCarouselProps = {
  games: GameListModel[];
  loop?: boolean;
  title: string;
};

export const GamesCarousel = ({ games, loop, title }: GamesCarouselProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      <Carousel
        options={{ align: "start", loop }}
        slideClassName="w-[50%] xs:w-[33.33%] sm:w-[25%] md:w-[20%] lg:w-[16.66%] 2xl:w-[14.28%]"
      >
        {games.map((game) => (
          <GameCover key={game._id} game={game} onClick={(game) => navigate(`/library/${game._id}`)} />
        ))}
      </Carousel>
    </div>
  );
};
