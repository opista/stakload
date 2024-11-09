import {
  VariableSizeGrid as Grid,
  GridChildComponentProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { GameStoreModel } from "../../../database/schema/game.schema";
import { Box, Paper } from "@mantine/core";
import { BackToTop } from "../../components/BackToTop/BackToTop";
import { useRef } from "react";

type GameListViewProps = {
  columnCount: number;
  games: GameStoreModel[];
};

const getItemIndex = (
  rowIndex: number,
  columnIndex: number,
  columnCount: number
) => rowIndex * columnCount + columnIndex;

export const GameListView = ({ columnCount, games }: GameListViewProps) => {
  const containerRef = useRef<Element>(null);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: GridChildComponentProps<any>) => {
    const index = getItemIndex(rowIndex, columnIndex, columnCount);
    const game = games[index];

    if (!game) return null;

    return (
      <Box p="xs" style={style}>
        <Paper shadow="sm" h="100%" withBorder>
          {game.name}
        </Paper>
      </Box>
    );
  };

  const itemKey = ({
    columnIndex,
    data,
    rowIndex,
  }: {
    columnIndex: number;
    data: GameStoreModel[];
    rowIndex: number;
  }) => {
    const index = getItemIndex(rowIndex, columnIndex, columnCount);
    const game = data[index];
    return game ? game._id : index;
  };

  return (
    games.length && (
      <>
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              columnCount={columnCount}
              columnWidth={() => width / columnCount}
              height={height}
              itemData={games}
              itemKey={itemKey}
              outerRef={containerRef}
              rowCount={Math.ceil(games.length / columnCount)}
              rowHeight={() => 200}
              width={width}
            >
              {Cell}
            </Grid>
          )}
        </AutoSizer>
        <BackToTop container={containerRef.current} />
      </>
    )
  );
};
