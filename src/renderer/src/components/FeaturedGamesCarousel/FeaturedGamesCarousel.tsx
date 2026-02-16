import { FeaturedGame } from "@components/FeaturedGame/FeaturedGame";
import { Carousel } from "@mantine/carousel";
import { Stack, Title } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

import { FeaturedGameModel } from "../../ipc.types";

import classes from "./FeaturedGamesCarousel.module.css";

type FeaturedGamesCarouselProps = {
  games: FeaturedGameModel[];
  title: string;
};

export const FeaturedGamesCarousel = ({ games, title }: FeaturedGamesCarouselProps) => (
  <Stack>
    <Title order={1}>{title}</Title>
    <Carousel
      align="start"
      classNames={{
        control: classes.control,
        controls: classes.controls,
      }}
      loop
      nextControlIcon={<IconArrowRight size={20} stroke={2} />}
      previousControlIcon={<IconArrowLeft size={20} stroke={2} />}
      slideGap="md"
      slideSize={860}
      slidesToScroll="auto"
    >
      {games.map((game) => (
        <Carousel.Slide key={game._id}>
          <FeaturedGame game={game} />
        </Carousel.Slide>
      ))}
    </Carousel>
  </Stack>
);
