import { GameHero } from "@components/GameHero/GameHero";
import { GamesHandler } from "@components/GamesHandler/GamesHandler";
import { Navbar } from "@components/Navbar/Navbar";
import { SearchInput } from "@components/SearchInput/SearchInput";
import { SettingsModal } from "@components/Settings/SettingsModal/SettingsModal";
import { ActionIcon, AppShell, Flex } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { IconPower, IconSettings } from "@tabler/icons-react";
import { Outlet, useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { Spotlight } from "../../components/Spotlight/Spotlight";
import classes from "./DesktopLayout.module.css";

export const DesktopLayout = () => {
  const params = useParams();
  const navigate = useNavigate();

  const currentGame = useGameStore(useShallow((state) => state.currentGame));

  const inGameView = params.id && params.id === currentGame?._id;

  return (
    <ModalsProvider modals={{ settings: SettingsModal }}>
      <GamesHandler />
      {inGameView ? <GameHero className={classes.hero} game={currentGame} /> : null}
      <AppShell header={{ height: 90 }} layout="alt" navbar={{ width: 300, breakpoint: "xs" }}>
        <AppShell.Header className={classes.header}>
          <Flex justify="space-between">
            <SearchInput className={classes.search} />

            <Flex gap="sm">
              <ActionIcon className={classes.actionIcon}>
                <IconSettings size={24} stroke={1} />
              </ActionIcon>
              <ActionIcon className={classes.actionIcon}>
                <IconPower size={24} stroke={1} />
              </ActionIcon>
            </Flex>
          </Flex>
        </AppShell.Header>
        <Spotlight onClick={(id) => navigate(`/desktop/games/${id}`)} />
        <Navbar />
        <AppShell.Main className={classes.main}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ModalsProvider>
  );
};
