import { FeaturedGameCarousel } from "@components/FeaturedGameCarousel/FeaturedGameCarousel";
import { GameCover } from "@components/GameCover/GameCover";
import { GamesCarousel } from "@components/GamesCarousel/GamesCarousel";
import { Carousel } from "@mantine/carousel";
import { Stack } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useGameStore } from "@store/game.store";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./HomeView.module.css";

export const HomeView = () => {
  const games = useGameStore(useShallow((state) => state.games));
  const navigate = useNavigate();
  const { width } = useViewportSize();

  const slideCount = useMemo(() => {
    if (width >= 1900) return 7;
    if (width >= 1700) return 6;
    if (width >= 1500) return 5;
    return 4;
  }, [width]);

  return (
    <Stack className={classes.container}>
      <GamesCarousel slideCount={slideCount} title="Continue Playing">
        {games.map((game) => (
          <Carousel.Slide key={game._id}>
            <GameCover game={game} hoverEffect={false} onClick={(game) => navigate(`/desktop/games/${game._id}`)} />
          </Carousel.Slide>
        ))}
      </GamesCarousel>

      <Stack className={classes.contained}>
        <FeaturedGameCarousel games={games.slice(0, 5)} title="Recently Added" />
      </Stack>
    </Stack>
  );
};
