import { CollectionsHandler } from "@components/CollectionsHandler/CollectionsHandler";
import { Header } from "@components/Desktop/Header/Header";
import { Navbar } from "@components/Desktop/Navigation/Navbar/Navbar";
import { GameHero } from "@components/GameHero/GameHero";
import { GamesHandler } from "@components/GamesHandler/GamesHandler";
import { AppShell } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { Outlet, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { Spotlight } from "../../components/Desktop/Spotlight/Spotlight";
import classes from "./DesktopLayout.module.css";

export const DesktopLayout = () => {
  const params = useParams();
  const currentGame = useGameStore(useShallow((state) => state.currentGame));

  const inGameView = params.id && params.id === currentGame?._id;

  return (
    <ModalsProvider>
      <GamesHandler />
      <CollectionsHandler />
      {inGameView ? <GameHero className={classes.hero} game={currentGame} /> : null}
      <AppShell header={{ height: 48 }} navbar={{ breakpoint: "xs", width: 300 }} withBorder={false}>
        <Header />
        <Spotlight />
        <Navbar />
        <AppShell.Main className={classes.main}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ModalsProvider>
  );
};
