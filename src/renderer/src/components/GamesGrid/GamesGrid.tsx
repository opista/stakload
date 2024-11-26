import { AspectRatio, Box, Button, Image, Stack, Text } from "@mantine/core";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useEffect, useRef, useState } from "react";

import classes from "./GamesGrid.module.css";
import { useTranslation } from "react-i18next";
import { IconPacman, IconSquareRoundedPlus } from "@tabler/icons-react";
import { BackToTop } from "@components/BackToTop/BackToTop";
import { GameStoreModel } from "../../schema/games";
import { modals } from "@mantine/modals";
import { settingsModalInnerProps } from "@components/Settings/SettingsModal/SettingsModalInnerProps";
import { Link } from "react-router";

const CELL_GAP = 10;
const COVER_ART_RATIO = 3 / 4;
const COVER_ART_HEIGHT = 250;
const COVER_ART_WIDTH = (COVER_ART_HEIGHT - CELL_GAP) * COVER_ART_RATIO;

const getItemIndex = (rowIndex: number, columnIndex: number, columnCount: number) =>
  rowIndex * columnCount + columnIndex;

export const GamesGrid = () => {
  const containerRef = useRef<Element>(null);
  const [games, setGames] = useState<GameStoreModel[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    /**
     *  TODO - this needs to be powered by filters
     *  perhaps we only return game titles and icons
     *  here to reduce data stored in memory
     */
    window.api.getFilteredGames().then((games) => setGames(games));
  }, []);

  const onImportClick = () => {
    modals.openContextModal({
      modal: "settings",
      title: t("settings"),
      innerProps: { ...settingsModalInnerProps, defaultTab: "library" },
    });
  };

  if (!games?.length) {
    return (
      <Stack className={classes.emptyContainer} align="center" gap="xs" justify="center">
        <IconPacman size={60} stroke={0.5} />
        <Text c="dimmed">{t("noGamesFound")}</Text>
        <Button leftSection={<IconSquareRoundedPlus />} onClick={onImportClick}>
          {t("importLibrary")}
        </Button>
      </Stack>
    );
  }

  const Cell = ({
    columnCount,
    columnIndex,
    rowIndex,
    style,
  }: GridChildComponentProps<unknown> & { columnCount: number }) => {
    const index = getItemIndex(rowIndex, columnIndex, columnCount);
    const game = games[index];

    if (!game) return null;

    return (
      <Box style={{ ...style, paddingLeft: CELL_GAP / 2, paddingRight: CELL_GAP / 2, paddingBottom: CELL_GAP }}>
        <AspectRatio className={classes.aspectRatio} ratio={COVER_ART_RATIO}>
          <Link className={classes.card} to={`/desktop/${game._id}`}>
            <Image
              alt={`${game.name} cover art`}
              className={classes.cover}
              radius="lg"
              // TODO - pull this from the game
              src="https://images.igdb.com/igdb/image/upload/t_cover_big/co22ak.webp"
              title={`${game.name} cover art`}
            />
          </Link>
        </AspectRatio>
      </Box>
    );
  };

  const itemKey = (
    {
      columnIndex,
      data: games,
      rowIndex,
    }: {
      columnIndex: number;
      data: GameStoreModel[];
      rowIndex: number;
    },
    columnCount: number,
  ) => {
    const index = getItemIndex(rowIndex, columnIndex, columnCount);
    return games[index]?._id || index;
  };

  /**
   * TODO
   * When a user clicks back from the game details
   * view, we lose the original scroll position of
   * this list. We should record it and return the
   * user back to where they were
   */

  return (
    <>
      <AutoSizer>
        {({ height, width }) => {
          const columnCount = Math.floor(width / (COVER_ART_WIDTH + CELL_GAP)) || 1;
          const columnWidth = width / columnCount;
          const rowCount = Math.ceil(games.length / columnCount);

          return (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              itemData={games}
              itemKey={(args) => itemKey(args, columnCount)}
              outerRef={containerRef}
              rowCount={rowCount}
              rowHeight={COVER_ART_HEIGHT}
              width={width}
            >
              {(props) => <Cell columnCount={columnCount} {...props} />}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
      <BackToTop container={containerRef.current} />
    </>
  );
};
