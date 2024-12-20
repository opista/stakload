import { CollectionSelect } from "@components/CollectionSelect/CollectionSelect";
import { Header } from "@components/Header/Header";
import { SettingsModal } from "@components/Settings/SettingsModal/SettingsModal";
import { GameStoreModel } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { AppShell, Divider, Flex, Stack } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { DEFAULT_NAV_PANE_WIDTH, useSystemStore } from "@store/system.store";
import { Allotment, AllotmentHandle } from "allotment";
import { useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { GamesFilter } from "../../components/GamesFilter/GamesFilter";
import { SearchControl } from "../../components/SearchControl/SearchControl";
import { Spotlight } from "../../components/Spotlight/Spotlight";
import classes from "./DesktopLayout.module.css";

const MIN_NAV_WIDTH = 250;
const MAX_NAV_WIDTH = 500;

export const DesktopLayout = () => {
  const navigate = useNavigate();
  const { navigationPaneWidth, setNavigationPaneWidth } = useSystemStore(
    useShallow((state) => ({
      navigationPaneWidth: state.navigationPaneWidth,
      setNavigationPaneWidth: state.setNavigationPaneWidth,
    })),
  );
  const allotmentRef = useRef<AllotmentHandle | null>(null);
  const [showLeftPane, setShowLeftPane] = useState(true);
  const { selectedFilters } = useGameStore(
    useShallow((state) => ({
      selectedFilters: state.selectedFilters,
    })),
  );

  const onChange = (vals: number[]) => {
    if (vals.length !== 2) return;
    setNavigationPaneWidth(vals[0]);
  };

  const onReset = () => {
    allotmentRef.current?.resize?.([DEFAULT_NAV_PANE_WIDTH]);
    setNavigationPaneWidth(DEFAULT_NAV_PANE_WIDTH);
  };

  const onToggleLeftPane = () => {
    setShowLeftPane((prev) => !prev);
  };

  /**
   *  TODO - this needs to be powered by filters
   *  perhaps we only return game titles and icons
   *  here to reduce data stored in memory
   */
  const { data: games } = useGamesQuery<GameStoreModel[]>(
    () => window.api.getFilteredGames(selectedFilters),
    [selectedFilters],
  );

  return (
    <ModalsProvider modals={{ settings: SettingsModal }}>
      <AppShell header={{ height: 60 }}>
        <AppShell.Header>
          <Header leftPaneWidth={navigationPaneWidth} onToggleLeftPane={onToggleLeftPane} showLeftPane={showLeftPane} />
        </AppShell.Header>
        <Spotlight onClick={(id) => navigate(id, { relative: "path" })} />
        <Allotment
          className={classes.allotment}
          onChange={onChange}
          onReset={onReset}
          proportionalLayout={false}
          ref={allotmentRef}
        >
          {showLeftPane && (
            <Allotment.Pane
              maxSize={MAX_NAV_WIDTH}
              minSize={MIN_NAV_WIDTH}
              preferredSize={navigationPaneWidth}
              visible={showLeftPane}
            >
              <Stack className={classes.navbar} gap={0}>
                <AppShell.Section className={classes.navSection}>
                  <Flex align="center" className={classes.filterContainer} justify="center">
                    <SearchControl />
                    <GamesFilter />
                  </Flex>
                  <Flex>
                    <CollectionSelect className={classes.collectionSelect} />
                  </Flex>
                </AppShell.Section>
                <Divider />
                <AppShell.Section className={classes.navSection} flex={1}>
                  <GameNavigation games={games} />
                </AppShell.Section>
              </Stack>
            </Allotment.Pane>
          )}
          <Allotment.Pane>
            <Outlet />
          </Allotment.Pane>
        </Allotment>
      </AppShell>
    </ModalsProvider>
  );
};
