import { Header } from "@components/Header/Header";
import { SettingsModal } from "@components/Settings/SettingsModal/SettingsModal";
import { GameStoreModel } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { AppShell, Box, Divider, Flex, Stack } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Allotment } from "allotment";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";

import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { GamesFilter } from "../../components/GamesFilter/GamesFilter";
import { SearchControl } from "../../components/SearchControl/SearchControl";
import { Spotlight } from "../../components/Spotlight/Spotlight";
import classes from "./DesktopLayout.module.css";

export const DesktopLayout = () => {
  const navigate = useNavigate();
  const [showLeftPane, setShowLeftPane] = useState(true);
  const [leftPaneWidth, setLeftPaneWidth] = useState(300);

  const onChange = (vals: number[]) => {
    if (vals.length !== 2) return;
    setLeftPaneWidth(vals[0]);
  };

  const onToggleLeftPane = () => setShowLeftPane((prev) => !prev);

  /**
   *  TODO - this needs to be powered by filters
   *  perhaps we only return game titles and icons
   *  here to reduce data stored in memory
   */
  const games = useGamesQuery<GameStoreModel[]>(window.api.getFilteredGames);

  return (
    <ModalsProvider modals={{ settings: SettingsModal }}>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header className={classes.header}>
          <Header leftPaneWidth={leftPaneWidth} onToggleLeftPane={onToggleLeftPane} showLeftPane={showLeftPane} />
        </AppShell.Header>
        <Spotlight disabled={!games?.length} games={games} onClick={(id) => navigate(id, { relative: "path" })} />
        <Allotment className={classes.allotment} onChange={onChange} proportionalLayout={false}>
          {showLeftPane && (
            <Allotment.Pane minSize={250} maxSize={500} preferredSize={leftPaneWidth}>
              <Stack className={classes.navbar} gap={0}>
                <AppShell.Section>
                  <Flex align="center" justify="center">
                    <SearchControl disabled={!games?.length} />
                    <GamesFilter disabled={!games?.length} />
                  </Flex>
                  <Divider my="md" />
                </AppShell.Section>
                <AppShell.Section flex={1}>
                  <GameNavigation games={games} />
                </AppShell.Section>
              </Stack>
            </Allotment.Pane>
          )}
          <Allotment.Pane>
            <Box className={classes.main}>
              <Outlet />
            </Box>
          </Allotment.Pane>
        </Allotment>
      </AppShell>
    </ModalsProvider>
  );
};
