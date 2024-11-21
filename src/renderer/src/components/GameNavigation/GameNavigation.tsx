import { Button, Text } from "@mantine/core";
import { FixedSizeList, FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { createRef, useEffect } from "react";
import { Image } from "@mantine/core";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import classes from "./GameNavigation.module.css";
import { GameStoreModel } from "../../schema/games";

interface GameNavigationProps {
  games?: GameStoreModel[];
  onChange: (index: number) => void;
  selectedGame: number | null;
}

const DefaultIcon = <IconDeviceGamepad2 className={classes.iconDefault} stroke={1.5} />;

const LeftSection = ({ icon }: { icon?: string }) => {
  if (!icon?.length) {
    return DefaultIcon;
  } else {
    return <Image className={classes.iconImage} radius="md" src={icon} />;
  }
};

export const GameNavigation = ({ games, onChange, selectedGame }: GameNavigationProps) => {
  const listRef = createRef<FixedSizeList<unknown>>();

  useEffect(() => {
    if (selectedGame === null) return;
    listRef?.current?.scrollToItem(selectedGame);
  }, [selectedGame]);

  if (!games?.length) {
    return null;
  }

  const Row = ({ index, style }: ListChildComponentProps<unknown>) => {
    const game = games[index];
    return (
      <div style={style}>
        <Button
          className={classes.button}
          color={selectedGame === index ? undefined : "gray"}
          fullWidth
          justify="flex-start"
          key={game.id}
          leftSection={<LeftSection icon={game.icon} />}
          title={game.name}
          variant={selectedGame === index ? "filled" : "subtle"}
          onClick={() => onChange(index)}
        >
          <Text truncate="end">{game.name}</Text>
        </Button>
      </div>
    );
  };

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
