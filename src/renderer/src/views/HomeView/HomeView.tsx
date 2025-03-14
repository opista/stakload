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

  const hasQuickLaunchGames = quickLaunchGames.length > 0;
  const hasNewGames = newGames.length > 0;

  if (!hasQuickLaunchGames && !hasNewGames) {
    return (
      <Stack className={classes.container}>
        <Title order={1}>TODO: Something here when you have no games</Title>
      </Stack>
    );
  }

  return (
    <ScrollArea className={classes.scrollArea}>
      <Stack className={classes.container} gap={50}>
        {hasQuickLaunchGames && <GamesCarousel games={quickLaunchGames} title="Continue Playing" />}
        {hasNewGames && <FeaturedGamesCarousel games={newGames} title="Recently Added" />}
      </Stack>
    </ScrollArea>
  );
};
