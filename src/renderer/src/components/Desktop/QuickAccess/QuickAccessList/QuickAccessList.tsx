import { QuickAccessItem } from "@components/Desktop/QuickAccess/QuickAccessItem/QuickAccessItem";
import { Group, Stack, Text } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconBolt } from "@tabler/icons-react";
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
      <Group gap={4}>
        <IconBolt size={16} />
        <Text className={classes.title} size="xs">
          Quick access
        </Text>
      </Group>

      <Stack gap={0}>
        {sortedGames.map((game) => (
          <QuickAccessItem game={game} key={game._id} />
        ))}
      </Stack>
    </Stack>
  );
};
