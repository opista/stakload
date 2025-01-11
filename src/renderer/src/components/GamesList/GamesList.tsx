import { GameStoreModel } from "@contracts/database/games";
import { Carousel, Embla } from "@mantine/carousel";
import { AspectRatio, Image } from "@mantine/core";
import { useState } from "react";

import classes from "./GamesList.module.css";

type GamesListProps = {
  games?: GameStoreModel[];
  onSelectGame: (index: number) => void;
};

export const GamesList = ({ games, onSelectGame }: GamesListProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [embla, setEmbla] = useState<Embla | null>(null);

  const onSlideChange = (index: number) => {
    setActiveSlide(index);
    onSelectGame(index);
  };

  const onSlideSelect = (index: number) => {
    setActiveSlide(index);
    onSelectGame(index);
    embla?.scrollTo(index);
    embla?.reInit();
  };

  return (
    <Carousel
      align="start"
      draggable={false}
      getEmblaApi={setEmbla}
      onSlideChange={onSlideChange}
      slideGap="sm"
      slideSize="auto"
      slidesToScroll={1}
      w="100%"
    >
      {games?.map((game, index) => (
        <Carousel.Slide className={classes.slide} key={index} onClick={() => onSlideSelect(index)}>
          {/* <GameCover className={classes.cover} game={game} /> */}
          <AspectRatio className={classes.aspectRatio} mx="auto" ratio={3 / 4} w={activeSlide === index ? 300 : 200}>
            <Image radius="lg" src={game.cover} />
          </AspectRatio>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};
