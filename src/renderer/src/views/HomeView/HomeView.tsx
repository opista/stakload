import { FeaturedGamesCarousel } from "@components/FeaturedGamesCarousel/FeaturedGamesCarousel";
import { GamesCarousel } from "@components/GamesCarousel/GamesCarousel";
import { Stack, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

import classes from "./HomeView.module.css";

export const HomeView = () => {
  const games = useGameStore(useShallow((state) => state.games));
  return (
    <Stack className={classes.container}>
      <GamesCarousel games={games.slice(70, 75)} title="Continue Playing" />

      <FeaturedGamesCarousel games={games.slice(1, 4)} title="Recently Added" />

      <Stack className={classes.contained}>
        <Title order={2}>TODO</Title>
      </Stack>
    </Stack>
  );
};
