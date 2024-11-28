import { Button, Text } from "@mantine/core";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "@mantine/core";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import classes from "./GameNavigation.module.css";
import { useLocation, useNavigate, useParams } from "react-router";
import { GameStoreModel } from "@contracts/database/games";

type GameNavigationProps = {
  games?: GameStoreModel[];
};

const DefaultIcon = <IconDeviceGamepad2 className={classes.iconDefault} stroke={1.5} />;

const LeftSection = ({ icon }: { icon?: string }) => {
  if (!icon?.length) {
    return DefaultIcon;
  } else {
    return <Image className={classes.iconImage} radius="md" src={icon} />;
  }
};

export const GameNavigation = ({ games }: GameNavigationProps) => {
  const listRef = useRef<FixedSizeList<unknown> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentGameIndex, setCurrentGameIndex] = useState<number | null>();
  const params = useParams();

  const onSelectedGame = () => {
    if (!listRef.current) return;

    if (!params.id) {
      return setCurrentGameIndex(null);
    }

    const index = games?.findIndex(({ _id }) => _id === params.id);

    if (index === -1 || index === undefined) {
      return setCurrentGameIndex(null);
    }

    setCurrentGameIndex(index);

    listRef?.current?.scrollToItem(index);
  };

  const setListRef = useCallback(
    (ref: FixedSizeList<unknown> | null) => {
      listRef.current = ref;
      return onSelectedGame();
    },
    [games, location.pathname],
  );

  useEffect(() => onSelectedGame(), [games, location.pathname]);

  if (!games?.length) {
    return null;
  }

  const Row = ({ index, style }: ListChildComponentProps<unknown>) => {
    const game = games[index];
    return (
      <div style={style}>
        <Button
          className={classes.button}
          color={currentGameIndex === index ? undefined : "gray"}
          fullWidth
          justify="flex-start"
          key={game._id}
          leftSection={<LeftSection icon={game.icon} />}
          title={game.name}
          variant={currentGameIndex === index ? "filled" : "subtle"}
          onClick={() => navigate(game._id, { replace: true, relative: "path" })}
        >
          <Text truncate="end">{game.name}</Text>
        </Button>
      </div>
    );
  };

  return (
    <AutoSizer disableWidth>
      {({ height }) => (
        <FixedSizeList height={height} itemCount={games.length} itemSize={36} ref={setListRef} width="100%">
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};
