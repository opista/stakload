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

export const GameListView = ({ columnCount, games }: GameListViewProps) => {
  const containerRef = useRef<Element>(null);

  const Cell = ({
    columnIndex,
    rowIndex,
    style,
  }: GridChildComponentProps<any>) => {
    const index = rowIndex * columnIndex + columnIndex;
    return (
      <Box p="xs" style={style}>
        <Paper shadow="sm" h="100%" withBorder>
          {games[index].name}
        </Paper>
      </Box>
    );
  };

  return (
    <>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            columnCount={columnCount}
            columnWidth={() => width / columnCount}
            height={height}
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
  );
};
