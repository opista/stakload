import { FeaturedGame } from "@components/FeaturedGame/FeaturedGame";
import { GameStoreModel } from "@contracts/database/games";
import { Carousel } from "@mantine/carousel";
import { Stack, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useMemo } from "react";

import classes from "./FeaturedGameCarousel.module.css";

type Props = {
  games: GameStoreModel[];
  title: string;
};

export const FeaturedGameCarousel = ({ games, title }: Props) => {
  const { width } = useViewportSize();

  const slideCount = useMemo(() => {
    if (width >= 1900) return 2;
    if (width >= 1700) return 1;
    if (width >= 1500) return 1;
    return 1;
  }, [width]);

  return (
    <Stack>
      <Title order={2}>{title}</Title>
      <Carousel
        align="start"
        classNames={{
          controls: classes.controls,
          control: classes.control,
        }}
        key={slideCount}
        loop
        nextControlIcon={<IconArrowRight size={20} stroke={2} />}
        previousControlIcon={<IconArrowLeft size={20} stroke={2} />}
        slideGap="md"
        slideSize={`${90 / slideCount}%`}
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
