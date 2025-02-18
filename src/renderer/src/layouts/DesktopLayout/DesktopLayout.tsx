import { Header } from "@components/Desktop/Header/Header";
import { Navbar } from "@components/Desktop/Navigation/Navbar/Navbar";
import { GamesHandler } from "@components/GamesHandler/GamesHandler";
import { AppShell } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Outlet } from "react-router";

import { Spotlight } from "../../components/Desktop/Spotlight/Spotlight";
import classes from "./DesktopLayout.module.css";

export const DesktopLayout = () => (
  <ModalsProvider>
    <GamesHandler />
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
