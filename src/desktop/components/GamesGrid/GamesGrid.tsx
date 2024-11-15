import { Box, Button, Paper, Text, UnstyledButton } from "@mantine/core";
import { VariableSizeGrid as Grid, GridChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useRef } from "react";
import { BackToTop } from "../BackToTop/BackToTop";
import { GameStoreModel } from "../../../database";
import classes from "./GamesGrid.module.css";
import { useTranslation } from "react-i18next";
import { IconSquareRoundedPlus } from "@tabler/icons-react";

interface GamesGridProps {
  columnCount: number;
  games?: GameStoreModel[];
  onClick: (index: number) => void;
}

const getItemIndex = (rowIndex: number, columnIndex: number, columnCount: number) =>
  rowIndex * columnCount + columnIndex;

export const GamesGrid = ({ columnCount, games, onClick }: GamesGridProps) => {
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
        <Button
          className={classes.importButton}
          leftSection={<IconSquareRoundedPlus />}
          onClick={onImportClick}
        >
          {t("importLibrary")}
        </Button>
      </Box>
    );
    // TODO
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
    return game?.id || index;
  };

  return (
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
  );
};
