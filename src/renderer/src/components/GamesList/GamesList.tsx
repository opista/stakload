import { GameStoreModel } from "@contracts/database/games";
import { mergeRefs } from "@mantine/hooks";
import { FocusContext, init, updateAllLayouts, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";

import { Game } from "./Game";

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
  const {
    ref,
    focusSelf,
    focusKey,
    focused,
    hasFocusedChild,
    //setFocus -- to set focus manually to some focusKey
    // navigateByDirection, -- to manually navigate by direction
    // pause, -- to pause all navigation events
    // resume, -- to resume all navigation events
    // updateAllLayouts -- to force update all layouts when needed
  } = useFocusable({
    focusable: true,
    saveLastFocusedChild: true,
    focusBoundaryDirections: ["left", "right"],
    trackChildren: true,
    autoRestoreFocus: true,
    isFocusBoundary: true,
    focusKey: FOCUS_KEY,
    preferredChildFocusKey: undefined,
    onEnterPress: () => {},
    onEnterRelease: () => {},
    onArrowPress: () => true,
    onFocus: () => console.log("GamesList focused"),
    onBlur: () => {},
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
      <div
        className="List"
        ref={mergeRefs(parentRef, ref)}
        style={{
          width: `100%`,
          height: `400px`,
          overflow: "hidden",
          maskImage: "linear-gradient(90deg, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 100px)",
          maskRepeat: "no-repeat",
          background: focused ? (hasFocusedChild ? "green" : "blue") : "transparent",
        }}
      >
        <div
          style={{
            width: `${columnVirtualizer.getTotalSize()}px`,
            height: "100%",
            position: "relative",
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
