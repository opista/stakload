import { FeaturedGamesCarousel } from "@components/FeaturedGamesCarousel/FeaturedGamesCarousel";
import { GamesCarousel } from "@components/GamesCarousel/GamesCarousel";
import { ScrollArea, Stack, Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

import classes from "./HomeView.module.css";

export const HomeView = () => {
  // TODO - Quick launch games should be last played -
  // we need a way to track this but it doesn't exist
  // yet
  const { newGames, quickLaunchGames } = useGameStore(
    useShallow((state) => ({
      newGames: state.newGames,
      quickLaunchGames: state.quickLaunchGames,
    })),
  );

  return (
    <ScrollArea>
      <Stack className={classes.container} gap={50}>
        <GamesCarousel games={quickLaunchGames} title="Continue Playing" />
        <FeaturedGamesCarousel games={newGames} title="Recently Added" />
        <Stack className={classes.contained}>
          <Title order={2}>Launchers</Title>
        </Stack>
      </Stack>
    </ScrollArea>
  );
};
