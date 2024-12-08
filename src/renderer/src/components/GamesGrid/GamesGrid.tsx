import { BackToTop } from "@components/BackToTop/BackToTop";
import { GameCover } from "@components/GameCover/GameCover";
import { settingsModalInnerProps } from "@components/Settings/SettingsModal/SettingsModalInnerProps";
import { GameStoreModel } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { Box, Button, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { IconPacman, IconSquareRoundedPlus } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import { useShallow } from "zustand/react/shallow";

import classes from "./GamesGrid.module.css";

const MAX_CELL_SIZE = 250;
const CELL_GAP = 15;
const SCROLLBAR_WIDTH = 6;

const getItemIndex = (rowIndex: number, columnIndex: number, columnCount: number) =>
  rowIndex * columnCount + columnIndex;

export const GamesGrid = () => {
  const [containerEl, setContainerEl] = useState<Element | null>(null);
  const { selectedFilters } = useGameStore(
    useShallow((state) => ({
      selectedFilters: state.selectedFilters,
    })),
  );
  const { t } = useTranslation();

  const containerRef = useCallback((node) => setContainerEl(node), []);

  /**
   *  TODO - this needs to be powered by filters
   *  perhaps we only return game titles and icons
   *  here to reduce data stored in memory
   */
  const games = useGamesQuery<GameStoreModel[]>(
    () => window.api.getFilteredGames({ gameModes: selectedFilters.gameModes }),
    [selectedFilters.gameModes],
  );

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
      title: t("settings"),
      innerProps: { ...settingsModalInnerProps, defaultTab: "library" },
    });
  };

  if (!games?.length) {
    return (
      <Stack className={classes.emptyContainer} align="center" gap="xs" justify="center">
        <IconPacman color="yellow" size={60} stroke={0.5} />
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
      <Box style={{ ...style, padding: CELL_GAP }}>
        <GameCover game={game} />
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
          const { columnCount, columnWidth, rowCount, rowHeight } = calculateCellSize(width, 1);
          return (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              itemData={games}
              itemKey={(args) => itemKey(args, columnCount)}
              outerRef={containerRef}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
            >
              {(props) => <Cell columnCount={columnCount} {...props} />}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
      <BackToTop container={containerEl} />
    </>
  );
};
