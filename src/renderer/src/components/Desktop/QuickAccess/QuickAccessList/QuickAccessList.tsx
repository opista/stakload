import { QuickAccessItem } from "@components/Desktop/QuickAccess/QuickAccessItem/QuickAccessItem";
import { Stack, Text } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

import classes from "./QuickAccessList.module.css";

type QuickAccessListProps = {
  className?: string;
};

export const QuickAccessList = ({ className }: QuickAccessListProps) => {
  // TODO - Update to use quickAccessGames query
  const games = useGameStore(useShallow((state) => state.gamesList.slice(60, 64)));

  return (
    <Stack className={className}>
      <Text className={classes.title} size="xs">
        Quick access
      </Text>

      <Stack gap={0}>
        {games.map((game) => (
          <QuickAccessItem game={game} key={game._id} />
        ))}
      </Stack>
    </Stack>
  );
};
