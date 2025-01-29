import { GamesFilter } from "@components/GamesFilter/GamesFilter";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { GameFilters } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { Flex, Stack } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const LibraryView = () => {
  const fetchFilteredGames = useGameStore(useShallow((state) => state.fetchFilteredGames));
  const [filters, setFilters] = useState<GameFilters>({});

  const { data: games } = useGamesQuery(() => fetchFilteredGames(filters), [filters]);

  return (
    <Stack h="100%" w="100%">
      <Flex align="center" justify="space-between" px="sm">
        <GamesFilter filters={filters} onChange={setFilters} />
      </Flex>
      <GamesGrid games={games ?? []} />
    </Stack>
  );
};
