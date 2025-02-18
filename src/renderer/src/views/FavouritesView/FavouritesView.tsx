import { SectionHeading } from "@components/Desktop/SectionHeading/SectionHeading";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { useGamesQuery } from "@hooks/use-games-query";
import { Title } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconStar } from "@tabler/icons-react";
import { useShallow } from "zustand/react/shallow";

import classes from "./FavouritesView.module.css";

export const FavouritesView = () => {
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));
  const { data: games } = useGamesQuery(() => fetchFilteredGames({ isFavourite: true }), []);

  if (!games) return null;

  return (
    <div className={classes.container}>
      <SectionHeading gap="md">
        <IconStar size={40} />
        <Title order={1}>Favourites</Title>
      </SectionHeading>
      <GamesGrid games={games} />
    </div>
  );
};
