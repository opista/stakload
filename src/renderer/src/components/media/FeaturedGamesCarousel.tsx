import { FeaturedGame } from "@components/game/FeaturedGame";

import { FeaturedGameModel } from "../../ipc.types";

import { Carousel } from "./Carousel";

type FeaturedGamesCarouselProps = {
  games: FeaturedGameModel[];
  title: string;
};

export const FeaturedGamesCarousel = ({ games, title }: FeaturedGamesCarouselProps) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-3xl font-bold text-white">{title}</h2>
    <Carousel options={{ align: "start", loop: true }} slideClassName="w-full max-w-[860px]">
      {games.map((game) => (
        <FeaturedGame key={game._id} game={game} />
      ))}
    </Carousel>
  </div>
);
