import { AspectRatio, Box, Button, Text, UnstyledButton } from "@mantine/core";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef } from "react";

import classes from "./GamesGrid.module.css";
import { useTranslation } from "react-i18next";
import { IconSquareRoundedPlus } from "@tabler/icons-react";
import { BackToTop } from "@components/BackToTop/BackToTop";
import { GameStoreModel } from "../../schema/games";

const COVER_ART_RATIO = 3 / 4;
const COVER_ART_HEIGHT = 250;
const COVER_ART_WIDTH = COVER_ART_HEIGHT * COVER_ART_RATIO;

interface GamesGridProps {
  games?: GameStoreModel[];
  onClick: (index: number) => void;
}

const getItemIndex = (rowIndex: number, columnIndex: number, columnCount: number) =>
  rowIndex * columnCount + columnIndex;

export const GamesGrid = ({ games, onClick }: GamesGridProps) => {
  const containerRef = useRef<Element>(null);
  const { t } = useTranslation();

  // TODO
  const onImportClick = () => {
    console.log("Open library settings");
  };

  if (!games?.length) {
    return (
      <Box className={classes.emptyContainer}>
        <Text c="dimmed">{t("noGamesFound")}</Text>
        <Button className={classes.importButton} leftSection={<IconSquareRoundedPlus />} onClick={onImportClick}>
          {t("importLibrary")}
        </Button>
      </Box>
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
      <Box className={classes.cardContainer} style={style}>
        <AspectRatio className={classes.aspectRatio} ratio={COVER_ART_RATIO}>
          <UnstyledButton className={classes.card} key={game._id} onClick={() => onClick(index)}>
            <img
              alt={`${game.name} cover art`}
              className={classes.cover}
              // TODO - pull this from the game
              src="https://images.igdb.com/igdb/image/upload/t_cover_big/co22ak.webp"
              title={`${game.name} cover art`}
            />
          </UnstyledButton>
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
          const columnCount = Math.floor(width / (COVER_ART_WIDTH + 8)) || 1;
          const columnWidth = width / columnCount;
          const rowCount = Math.ceil(games.length / columnCount);

          return (
            <Grid
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
            </Grid>
          );
        }}
      </AutoSizer>
      <BackToTop container={containerRef.current} />
    </>
  );
};
