import { FeaturedGamesCarousel } from "@components/FeaturedGamesCarousel/FeaturedGamesCarousel";
import { GamesCarousel } from "@components/GamesCarousel/GamesCarousel";
import { Stack, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

import classes from "./HomeView.module.css";

export const HomeView = () => {
  const { gamesList, newGames } = useGameStore(
    useShallow((state) => ({
      gamesList: state.gamesList,
      newGames: state.newGames,
    })),
  );

  // TODO: Add metadata to store model for last played
  const games = gamesList.slice(0, 10);

  return (
    <Stack className={classes.container}>
      <GamesCarousel games={games} title="Continue Playing" />
      <FeaturedGamesCarousel games={newGames} title="Recently Added" />
      <Stack className={classes.contained}>
        <Title order={2}>Launchers</Title>
      </Stack>
    </Stack>
  );
};
