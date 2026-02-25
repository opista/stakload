import { GameCover } from "@components/GameCover/GameCover";
import { GhostIcon } from "@components/GhostIcon/GhostIcon";
import { Box, Stack, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, NavigateFunction } from "react-router";
import { Grid, CellComponentProps, GridImperativeAPI } from "react-window";

import { GameListModel } from "../../ipc.types";

import classes from "./GamesGrid.module.css";

const MAX_CELL_SIZE = 250;
const CELL_GAP = 15;
const SCROLLBAR_WIDTH = 6;

const getItemIndex = (rowIndex: number, columnIndex: number, columnCount: number) =>
  rowIndex * columnCount + columnIndex;

type GamesGridProps = {
  games?: GameListModel[];
};

type CellProps = {
  columnCount: number;
  games: GameListModel[];
  navigate: NavigateFunction;
};

const Cell = ({
  columnIndex,
  rowIndex,
  style,
  columnCount,
  games,
  navigate,
}: CellComponentProps<CellProps>) => {
  const index = getItemIndex(rowIndex, columnIndex, columnCount);
  const game = games[index];

  if (!game) return null;

  return (
    <Box style={{ ...style, padding: CELL_GAP }}>
      <GameCover game={game} onClick={(game) => navigate(`/library/${game._id}`)} />
    </Box>
  );
};

export const GamesGrid = ({ games }: GamesGridProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const gridRef = useRef<GridImperativeAPI>(null);
  const { ref: containerRef, width, height } = useElementSize();

  const calculateCellSize = (width: number, columnCount: number): { columnCount: number; columnWidth: number; rowCount: number; rowHeight: number } => {
    // If width is 0 (initial render), return fallback values
    if (width === 0) {
      return { columnCount: 1, columnWidth: 0, rowCount: Math.ceil((games?.length || 0)), rowHeight: 0 };
    }
    const columnWidth = (width - SCROLLBAR_WIDTH) / columnCount;

    if (columnWidth > MAX_CELL_SIZE) {
      return calculateCellSize(width, columnCount + 1);
    }

    const rowHeight = ((columnWidth - CELL_GAP * 2) / 3) * 4 + CELL_GAP * 2;
    const rowCount = Math.ceil((games?.length || 0) / columnCount);

    return {
      columnCount,
      columnWidth,
      rowCount,
      rowHeight,
    };
  };

  useEffect(() => {
    gridRef.current?.scrollToCell({ columnIndex: 0, rowIndex: 0 });
  }, [games]);

  if (!games?.length) {
    return (
      <Stack align="center" className={classes.emptyContainer} justify="center">
        <GhostIcon />
        <Text c="dimmed">{t("gamesGrid.noGamesFound")}</Text>
      </Stack>
    );
  }

  const { columnCount, columnWidth, rowCount, rowHeight } = calculateCellSize(width, 1);

  return (
    <Box ref={containerRef} className={classes.container}>
      {width > 0 && height > 0 && (
        <Grid
          cellComponent={Cell}
          cellProps={{ columnCount, games, navigate }}
          columnCount={columnCount}
          columnWidth={columnWidth}
          gridRef={gridRef}
          rowCount={rowCount}
          rowHeight={rowHeight}
          style={{ height, width }}
        />
      )}
    </Box>
  );
};

