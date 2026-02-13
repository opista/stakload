import { GameListModel } from "@contracts/database/games";
import { mergeRefs } from "@mantine/hooks";
import { FocusContext, updateAllLayouts, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";

import { Game } from "./Game";
import classes from "./GamesList.module.css";

const FOCUS_KEY = "GAMES_LIST";

type GamesListProps = {
  games?: GameListModel[];
  onSelectGame: (index: number) => void;
};

export const GamesList = ({ games, onSelectGame }: GamesListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { focusKey, focusSelf, ref } = useFocusable({
    autoRestoreFocus: true,
    focusable: true,
    focusBoundaryDirections: ["right", "down"],
    focusKey: FOCUS_KEY,
    isFocusBoundary: true,
    onArrowPress: () => true,
    preferredChildFocusKey: undefined,
    saveLastFocusedChild: true,
    trackChildren: true,
  });

  const columnVirtualizer = useVirtualizer({
    count: games?.length || 0,
    estimateSize: (index) => (index === activeIndex ? 300 : 210),
    gap: 16,
    getScrollElement: () => parentRef.current,
    horizontal: true,
    overscan: 5,
    paddingStart: 100,
    scrollPaddingStart: 100,
  });

  useEffect(() => {
    if (columnVirtualizer.getVirtualItems().length) {
      updateAllLayouts();
      focusSelf();
    }
  }, [games, columnVirtualizer.getVirtualItems(), focusSelf]);

  const onGameFocus = (index: number, start: number) => {
    if (index === activeIndex) return;

    columnVirtualizer.resizeItem(activeIndex, 210);
    columnVirtualizer.resizeItem(index, 300);

    if (index > activeIndex) {
      columnVirtualizer.scrollToOffset(start - 190, { align: "start" });
    } else {
      columnVirtualizer.scrollToOffset(start - 100, { align: "start" });
    }

    setActiveIndex(index);
    onSelectGame(index);
  };

  return (
    <FocusContext.Provider value={focusKey}>
      <div className={classes.container} ref={mergeRefs(parentRef, ref)}>
        <div
          className={classes.inner}
          style={{
            width: `${columnVirtualizer.getTotalSize()}px`,
          }}
        >
          {columnVirtualizer.getVirtualItems().map(({ index, size, start }) => (
            <Game
              game={games![index]}
              key={index}
              onFocus={() => onGameFocus(index, start)}
              onSelect={(game) => console.log("game selected", game._id)}
              size={size}
              start={start}
            />
          ))}
        </div>
      </div>
    </FocusContext.Provider>
  );
};
