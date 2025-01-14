import { GameStoreModel } from "@contracts/database/games";
import { mergeRefs } from "@mantine/hooks";
import { FocusContext, init, updateAllLayouts, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";

import { Game } from "./Game";
import classes from "./GamesList.module.css";

const FOCUS_KEY = "GAMES_LIST";

init({
  debug: false,
  visualDebug: false,
  useGetBoundingClientRect: true,
});

type GamesListProps = {
  games?: GameStoreModel[];
  onSelectGame: (index: number) => void;
};

export const GamesList = ({ games, onSelectGame }: GamesListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, focusSelf, focusKey } = useFocusable({
    focusable: true,
    saveLastFocusedChild: true,
    focusBoundaryDirections: ["left", "right"],
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: true,
    focusKey: FOCUS_KEY,
    preferredChildFocusKey: undefined,
    onArrowPress: () => true,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: games?.length || 0,
    gap: 16,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (index === activeIndex ? 300 : 210),
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
