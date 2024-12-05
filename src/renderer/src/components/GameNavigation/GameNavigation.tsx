import { BackToTop } from "@components/BackToTop/BackToTop";
import { GameStoreModel } from "@contracts/database/games";
import { Button, Text } from "@mantine/core";
import { Image } from "@mantine/core";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList, ListChildComponentProps } from "react-window";

import classes from "./GameNavigation.module.css";

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
  const [containerEl, setContainerEl] = useState<Element | null>(null);
  const listRef = useRef<FixedSizeList<unknown> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentGameIndex, setCurrentGameIndex] = useState<number | null>();
  const params = useParams();

  const containerRef = useCallback((node) => setContainerEl(node), []);

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
    <>
      <AutoSizer disableWidth>
        {({ height }) => (
          <FixedSizeList
            height={height}
            itemCount={games.length}
            itemSize={36}
            outerRef={containerRef}
            ref={setListRef}
            width="100%"
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
      <BackToTop container={containerEl} />
    </>
  );
};
