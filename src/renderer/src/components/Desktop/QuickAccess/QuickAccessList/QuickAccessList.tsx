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

import { QuickAccessItem } from "../QuickAccessItem/QuickAccessItem";
import classes from "./QuickAccessList.module.css";

type QuickAccessListProps = {
  className?: string;
};

export const QuickAccessList = ({ className }: QuickAccessListProps) => {
  const [editMode, setEditMode] = useState(false);
  const { quickAccessGames, quickAccessGamesOrder, setQuickAccessGameOrder } = useGameStore(
    useShallow((state) => ({
      quickAccessGames: state.quickAccessGames,
      quickAccessGamesOrder: state.quickAccessGamesOrder,
      setQuickAccessGameOrder: state.setQuickAccessGameOrder,
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

    const oldIndex = quickAccessGamesOrder.indexOf(active.id.toString());
    const newIndex = quickAccessGamesOrder.indexOf(over.id.toString());

    const newOrder = arrayMove(quickAccessGamesOrder, oldIndex, newIndex);
    setQuickAccessGameOrder(newOrder);
  };

  const sortedGames = quickAccessGames.sort(
    (a, b) => quickAccessGamesOrder.indexOf(a._id) - quickAccessGamesOrder.indexOf(b._id),
  );

  const gamesList = (
    <Stack gap={0}>
      {sortedGames.map((game) => (
        <QuickAccessItem editMode={editMode} game={game} key={game._id} />
      ))}
    </Stack>
  );

  return (
    <Stack className={className}>
      <Group align="center" justify="space-between">
        <Group gap={4}>
          <IconBolt size={16} />
          <Text className={classes.title} size="xs">
            Quick access
          </Text>
        </Group>
        <ActionIcon onClick={() => setEditMode(!editMode)} size="sm" variant={editMode ? "filled" : "subtle"}>
          <IconEdit size={16} />
        </ActionIcon>
      </Group>

      {editMode ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
          <SortableContext items={sortedGames.map((game) => game._id)} strategy={verticalListSortingStrategy}>
            {gamesList}
          </SortableContext>
        </DndContext>
      ) : (
        gamesList
      )}
    </Stack>
  );
};
