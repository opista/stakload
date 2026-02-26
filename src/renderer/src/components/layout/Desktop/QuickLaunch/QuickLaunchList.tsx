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
import { useGameStore } from "@store/game.store";
import { IconBolt } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { QuickLaunchItem } from "./QuickLaunchItem";

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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-neutral-400">
          <IconBolt size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">Quick Launch</span>
        </div>
      </div>

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
  );
};

