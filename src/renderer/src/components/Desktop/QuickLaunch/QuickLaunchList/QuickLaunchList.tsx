import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconBolt, IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { QuickLaunchItem } from "../QuickLaunchItem/QuickLaunchItem";
import classes from "./QuickLaunchList.module.css";

type QuickLaunchListProps = {
  className?: string;
};

export const QuickLaunchList = ({ className }: QuickLaunchListProps) => {
  const [editMode, setEditMode] = useState(false);
  const { quickLaunchGames, quickLaunchGamesOrder, setQuickLaunchGameOrder } = useGameStore(
    useShallow((state) => ({
      quickLaunchGames: state.quickLaunchGames,
      quickLaunchGamesOrder: state.quickLaunchGamesOrder,
      setQuickLaunchGameOrder: state.setQuickLaunchGameOrder,
    })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = quickLaunchGamesOrder.indexOf(active.id.toString());
    const newIndex = quickLaunchGamesOrder.indexOf(over.id.toString());

    const newOrder = arrayMove(quickLaunchGamesOrder, oldIndex, newIndex);
    setQuickLaunchGameOrder(newOrder);
  };

  const sortedGames = quickLaunchGames.sort(
    (a, b) => quickLaunchGamesOrder.indexOf(a._id) - quickLaunchGamesOrder.indexOf(b._id),
  );

  const gameStack = (
    <Stack gap={0}>
      {sortedGames.map((game) => (
        <QuickLaunchItem editMode={editMode} game={game} key={game._id} />
      ))}
    </Stack>
  );

  return (
    <Stack className={className}>
      <Group align="center" justify="space-between">
        <Group gap={4}>
          <IconBolt size={16} />
          <Text className={classes.title} size="xs">
            Quick Launch
          </Text>
        </Group>
        <ActionIcon onClick={() => setEditMode(!editMode)} size="sm" variant={editMode ? "filled" : "subtle"}>
          <IconEdit size={16} />
        </ActionIcon>
      </Group>

      {editMode ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={sortedGames.map((game) => game._id)} strategy={verticalListSortingStrategy}>
            {gameStack}
          </SortableContext>
        </DndContext>
      ) : (
        gameStack
      )}
    </Stack>
  );
};
