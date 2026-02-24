import { GameCover } from "@components/GameCover/GameCover";
import { GameListModel } from "@contracts/database/games";
import { Carousel } from "@mantine/carousel";
import { Stack, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import classes from "./GamesCarousel.module.css";

type GamesCarouselProps = {
  games: GameListModel[];
  loop?: boolean;
  title: string;
};

export const GamesCarousel = ({ games, loop, title }: GamesCarouselProps) => {
  const navigate = useNavigate();
  const { width } = useViewportSize();

  const slideCount = useMemo(() => {
    if (width >= 1900) return 7;
    if (width >= 1700) return 6;
    if (width >= 1500) return 5;
    if (width >= 1200) return 4;
    if (width >= 900) return 3;
    return 2;
  }, [width]);

  return (
    <Stack>
      <Title order={1}>{title}</Title>
      <Carousel
        align="start"
        classNames={{
          control: classes.control,
          controls: classes.controls,
        }}
        controlSize={26}
        key={slideCount}
        loop={loop}
        nextControlIcon={<IconArrowRight size={20} stroke={2} />}
        previousControlIcon={<IconArrowLeft size={20} stroke={2} />}
        slideGap="md"
        slideSize={`${90 / slideCount}%`}
        slidesToScroll={slideCount}
      >
        {games.map((game) => (
          <Carousel.Slide key={game._id}>
            <GameCover game={game} hoverEffect={false} onClick={(game) => navigate(`/library/${game._id}`)} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Stack>
  );
};
