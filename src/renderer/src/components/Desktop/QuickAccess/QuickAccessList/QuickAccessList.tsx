import { QuickAccessItem } from "@components/Desktop/QuickAccess/QuickAccessItem/QuickAccessItem";
import { Stack, Text } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useShallow } from "zustand/react/shallow";

import classes from "./QuickAccessList.module.css";

type QuickAccessListProps = {
  className?: string;
};

export const QuickAccessList = ({ className }: QuickAccessListProps) => {
  const { quickAccessGames, quickAccessGamesOrder } = useGameStore(
    useShallow((state) => ({
      quickAccessGames: state.quickAccessGames,
      quickAccessGamesOrder: state.quickAccessGamesOrder,
    })),
  );

  const sortedGames = quickAccessGames.sort(
    (a, b) => quickAccessGamesOrder.indexOf(a._id) - quickAccessGamesOrder.indexOf(b._id),
  );

  return (
    <Stack className={className}>
      <Text className={classes.title} size="xs">
        Quick access
      </Text>

      <Stack gap={0}>
        {sortedGames.map((game) => (
          <QuickAccessItem game={game} key={game._id} />
        ))}
      </Stack>
    </Stack>
  );
};
