import { Button, Text } from "@mantine/core";
import { GameStoreModel } from "../../../database/schema/game.schema";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

type GameNavigationProps = {
  games: GameStoreModel[];
  onChange: (index: number) => void;
  selectedGame: number | null;
};

export const GameNavigation = ({
  games,
  onChange,
  selectedGame,
}: GameNavigationProps) => {
  const Row = ({ index, style }: ListChildComponentProps<any>) => (
    <div style={style}>
      <Button
        color={selectedGame === index ? undefined : "gray"}
        fullWidth
        justify="flex-start"
        key={games[index]._id}
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
        <List
          height={height}
          itemCount={games.length}
          itemSize={36}
          width="100%"
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
};
