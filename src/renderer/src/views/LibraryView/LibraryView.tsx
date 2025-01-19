import { GamesFilter } from "@components/GamesFilter/GamesFilter";
import { GamesGrid } from "@components/GamesGrid/GamesGrid";
import { Flex, Stack } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

export const LibraryView = () => {
  const gamesList = useGameStore(useShallow((state) => state.gamesList));
  return (
    <Stack h="100%" w="100%">
      <Flex align="center" justify="space-between" px="sm">
        <GamesFilter />
      </Flex>
      <GamesGrid games={gamesList} />
    </Stack>
  );
};
