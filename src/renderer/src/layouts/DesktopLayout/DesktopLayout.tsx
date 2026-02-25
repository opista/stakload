import { modals } from "@components/Desktop/Modals/modals";
import { Navbar } from "@components/Desktop/Navigation/Navbar/Navbar";
import { NotificationDrawer } from "@components/Desktop/Notifications/NotificationDrawer/NotificationDrawer";
import { WindowBar } from "@components/Desktop/WindowBar/WindowBar";
import { AppShell } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Outlet } from "react-router";

import { Spotlight } from "../../components/Desktop/Spotlight/Spotlight";

import classes from "./DesktopLayout.module.css";

export const DesktopLayout = () => (
  <ModalsProvider modals={modals}>
    <AppShell header={{ height: 48 }} navbar={{ breakpoint: "xs", width: 300 }} withBorder={false}>
      <WindowBar />
      <Spotlight />
      <Navbar />
      <NotificationDrawer />
      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  </ModalsProvider>
);
