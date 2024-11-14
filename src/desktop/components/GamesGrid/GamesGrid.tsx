import { Paper, UnstyledButton } from "@mantine/core";
import { VariableSizeGrid as Grid, GridChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef } from "react";
import { BackToTop } from "../BackToTop/BackToTop";
import { GameStoreModel } from "../../../database";

interface GamesGridProps {
  columnCount: number;
  games?: GameStoreModel[];
  onClick: (index: number) => void;
}

const getItemIndex = (rowIndex: number, columnIndex: number, columnCount: number) =>
  rowIndex * columnCount + columnIndex;

export const GamesGrid = ({ columnCount, games, onClick }: GamesGridProps) => {
  const containerRef = useRef<Element>(null);

  if (!games?.length) {
    // TODO
    return <>no game found, add some info here</>;
  }

  const Cell = ({ columnIndex, rowIndex, style }: GridChildComponentProps<unknown>) => {
    const index = getItemIndex(rowIndex, columnIndex, columnCount);
    const game = games[index];

    if (!game) return null;

    return (
      <UnstyledButton key={game.id} onClick={() => onClick(index)} p="xs" style={style}>
        <Paper shadow="sm" h="100%" withBorder>
          {game.name}
        </Paper>
      </UnstyledButton>
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

  return games.length ? (
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
  ) : undefined;
  // TODO - "NO games found" screen
};
