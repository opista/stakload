import { Button, Text } from "@mantine/core";
import { GameStoreModel } from "../../../database/schema/game.schema";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

type GameNavigationProps = {
  games: GameStoreModel[];
};

export const GameNavigation = ({ games }: GameNavigationProps) => {
  const Row = ({ index, style }: ListChildComponentProps<any>) => (
    <div style={style}>
      <Button
        color="gray"
        fullWidth
        justify="flex-start"
        key={games[index]._id}
        title={games[index].name}
        variant="subtle"
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
