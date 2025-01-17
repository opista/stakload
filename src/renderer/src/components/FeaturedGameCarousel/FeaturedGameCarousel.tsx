import { FeaturedGame } from "@components/FeaturedGame/FeaturedGame";
import { GameStoreModel } from "@contracts/database/games";
import { Carousel } from "@mantine/carousel";
import { Stack, Title } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

import classes from "./FeaturedGameCarousel.module.css";

type Props = {
  games: GameStoreModel[];
  title: string;
};

export const FeaturedGameCarousel = ({ games, title }: Props) => {
  const slideCount = 1;
  return (
    <Stack>
      <Title order={2}>{title}</Title>
      <Carousel
        align="center"
        classNames={{
          controls: classes.controls,
          control: classes.control,
        }}
        key={slideCount}
        loop
        nextControlIcon={<IconArrowRight size={20} stroke={2} />}
        previousControlIcon={<IconArrowLeft size={20} stroke={2} />}
        slideGap="md"
        slideSize="100%"
        slidesToScroll={slideCount}
      >
        {games.map((game) => (
          <Carousel.Slide key={game._id}>
            <FeaturedGame game={game} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Stack>
  );
};
