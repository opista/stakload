import { AppShell, Box, Divider } from "@mantine/core";
import { Allotment } from "allotment";
import { useEffect, useState } from "react";
import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { GamesFilter } from "../../components/GamesFilter/GamesFilter";
import { Header } from "../../components/Header/Header";
import { SearchControl } from "../../components/SearchControl/SearchControl";
import { Spotlight } from "../../components/Spotlight/Spotlight";
import classes from "./DesktopLayout.module.css";
import { ModalsProvider } from "@mantine/modals";
import { SettingsModal } from "@components/Settings/SettingsModal/SettingsModal";
import { GameStoreModel } from "../../schema/games";
import { Outlet, useNavigate } from "react-router";

export const DesktopLayout = () => {
  const [games, setGames] = useState<GameStoreModel[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     *  TODO - this needs to be powered by filters
     *  perhaps we only return game titles and icons
     *  here to reduce data stored in memory
     */
    window.api.getFilteredGames().then((games) => setGames(games));
  }, []);

  return (
    <ModalsProvider modals={{ settings: SettingsModal }}>
      <AppShell header={{ height: 60 }} padding="md">
        <Spotlight disabled={!games?.length} games={games} onClick={() => navigate} />
        <AppShell.Header>
          <Header />
        </AppShell.Header>
        <Allotment className={classes.allotment} proportionalLayout={false}>
          <Allotment.Pane minSize={250} maxSize={500} preferredSize={300}>
            <Box p="md" className={classes.navbar}>
              <AppShell.Section>
                <Box className={classes.searchAndFilters}>
                  <SearchControl disabled={!games?.length} />
                  <GamesFilter disabled={!games?.length} />
                </Box>
                <Divider my="md" />
              </AppShell.Section>
              <AppShell.Section flex={1}>
                <GameNavigation games={games} />
              </AppShell.Section>
            </Box>
          </Allotment.Pane>
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
