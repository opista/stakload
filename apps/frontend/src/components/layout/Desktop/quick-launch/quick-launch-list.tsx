import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { SubHeading } from "@components/ui/sub-heading";
import { useGameStore } from "@store/game.store";
import { cn } from "@util/cn";

import { QuickLaunchItem } from "./quick-launch-item";

type QuickLaunchListProps = {
  className?: string;
};

export const QuickLaunchList = ({ className }: QuickLaunchListProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { quickLaunchGames, quickLaunchGamesOrder, setQuickLaunchGameOrder } = useGameStore(
    useShallow((state) => ({
      quickLaunchGames: state.quickLaunchGames,
      quickLaunchGamesOrder: state.quickLaunchGamesOrder,
      setQuickLaunchGameOrder: state.setQuickLaunchGameOrder,
    })),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
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
    <div className="flex flex-col">
      {sortedGames.map((game) => (
        <QuickLaunchItem editMode={isDragging} game={game} key={game._id} />
      ))}
    </div>
  );

  return (
    sortedGames.length ? <div className={cn("flex flex-col gap-3", className)}>
      <SubHeading className="px-2 text-slate-400">Quick Launch</SubHeading>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext items={sortedGames.map((game) => game._id)} strategy={verticalListSortingStrategy}>
          {gameStack}
        </SortableContext>
      </DndContext>
    </div>
    : null
  );
};
