import { GameCover } from "@components/GameCover/GameCover";
import { GhostIcon } from "@components/GhostIcon/GhostIcon";
import { useMeasure } from "@uidotdev/usehooks";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router";
import { CellComponentProps, Grid, GridImperativeAPI } from "react-window";

import { GameListModel } from "../../ipc.types";

const MAX_CELL_SIZE = 270;
const CELL_GAP = 6;
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

const Cell = ({ columnCount, columnIndex, games, navigate, rowIndex, style }: CellComponentProps<CellProps>) => {
  const index = getItemIndex(rowIndex, columnIndex, columnCount);
  const game = games[index];

  if (!game) return null;

  return (
    <div style={{ ...style, padding: CELL_GAP }}>
      <GameCover game={game} onClick={(game) => navigate(`/library/${game._id}`)} />
    </div>
  );
};

export const GamesGrid = ({ games }: GamesGridProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const gridRef = useRef<GridImperativeAPI>(null);
  const [containerRef, measurements] = useMeasure();
  const width = measurements?.width ?? 0;
  const height = measurements?.height ?? 0;

  const calculateCellSize = (
    width: number,
    columnCount: number,
  ): { columnCount: number; columnWidth: number; rowCount: number; rowHeight: number } => {
    // If width is 0 (initial render), return fallback values
    if (width === 0) {
      return { columnCount: 1, columnWidth: 0, rowCount: Math.ceil(games?.length || 0), rowHeight: 0 };
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
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <GhostIcon />
        <p className="text-gray-400">{t("gamesGrid.noGamesFound")}</p>
      </div>
    );
  }

  const { columnCount, columnWidth, rowCount, rowHeight } = calculateCellSize(width, 1);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col">
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
    </div>
  );
};
