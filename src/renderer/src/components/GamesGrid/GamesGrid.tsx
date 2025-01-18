import { settingsModalInnerProps } from "@components/Desktop/Settings/SettingsModal/SettingsModalInnerProps";
import { GameCover } from "@components/GameCover/GameCover";
import { GameListModel } from "@contracts/database/games";
import { Box, Button, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPacman, IconSquareRoundedPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";

import classes from "./GamesGrid.module.css";

const MAX_CELL_SIZE = 250;
const CELL_GAP = 15;
const SCROLLBAR_WIDTH = 6;

const getItemIndex = (rowIndex: number, columnIndex: number, columnCount: number) =>
  rowIndex * columnCount + columnIndex;

type GamesGridProps = {
  games: GameListModel[];
};

export const GamesGrid = ({ games }: GamesGridProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const calculateCellSize = (width: number, columnCount: number) => {
    const columnWidth = (width - SCROLLBAR_WIDTH) / columnCount;

    if (columnWidth > MAX_CELL_SIZE) {
      return calculateCellSize(width, columnCount + 1);
    }

    const rowHeight = ((columnWidth - CELL_GAP * 2) / 3) * 4 + CELL_GAP * 2;
    const rowCount = Math.ceil(games!.length / columnCount);

    return {
      columnCount,
      columnWidth,
      rowCount,
      rowHeight,
    };
  };

  const onImportClick = () => {
    modals.openContextModal({
      modal: "settings",
      title: t("gamesGrid.settings"),
      innerProps: { ...settingsModalInnerProps, defaultTab: "library" },
    });
  };

  if (!games?.length) {
    return (
      <Stack className={classes.emptyContainer}>
        <IconPacman color="yellow" size={60} stroke={0.5} />
        <Text c="dimmed">{t("gamesGrid.noGamesFound")}</Text>
        <Button leftSection={<IconSquareRoundedPlus />} onClick={onImportClick}>
          {t("gamesGrid.importLibrary")}
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
      <Box style={{ ...style, padding: CELL_GAP }}>
        <GameCover game={game} onClick={(game) => navigate(`/desktop/games/${game._id}`)} />
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
      data: GameListModel[];
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
    <Box className={classes.container}>
      <AutoSizer>
        {({ height, width }) => {
          const { columnCount, columnWidth, rowCount, rowHeight } = calculateCellSize(width, 1);
          return (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              itemData={games}
              itemKey={(args) => itemKey(args, columnCount)}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
            >
              {(props) => <Cell columnCount={columnCount} {...props} />}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </Box>
  );
};
