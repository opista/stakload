import { Button, Text } from "@mantine/core";
import { FixedSizeList, FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { createRef, useEffect } from "react";
import { GameStoreModel } from "../../../database";

interface GameNavigationProps {
  games?: GameStoreModel[];
  onChange: (index: number) => void;
  selectedGame: number | null;
}

export const GameNavigation = ({ games, onChange, selectedGame }: GameNavigationProps) => {
  const listRef = createRef<FixedSizeList<unknown>>();

  useEffect(() => {
    if (selectedGame === null) return;
    listRef?.current?.scrollToItem(selectedGame);
  }, [selectedGame]);

  if (!games?.length) {
    return null;
  }

  const Row = ({ index, style }: ListChildComponentProps<unknown>) => (
    <div style={style}>
      <Button
        color={selectedGame === index ? undefined : "gray"}
        fullWidth
        justify="flex-start"
        key={games[index].id}
        title={games[index].name}
        variant={selectedGame === index ? "filled" : "subtle"}
        onClick={() => onChange(index)}
      >
        <Text truncate="end">{games[index].name}</Text>
      </Button>
    </div>
  );

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <List height={height} itemCount={games.length} itemSize={36} ref={listRef} width="100%">
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};
