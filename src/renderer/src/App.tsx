import { useGamesQuery } from "@hooks/use-games-query";
import { Checkbox, Container, createTheme, MantineProvider, Modal, Notification, ScrollArea } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";
import clsx from "clsx";
import { ContextMenuProvider } from "mantine-contextmenu";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./App.module.css";

export const App = () => {
  const fetchCollections = useCollectionStore(useShallow((state) => state.fetchCollections));
  const refreshGameData = useGameStore(useShallow((state) => state.refreshGameData));
  const { syncOnStartup } = useIntegrationSettingsStore(
    useShallow((state) => ({
      syncOnStartup: state.syncOnStartup,
    })),
  );

  useGamesQuery(refreshGameData, []);

  if (syncOnStartup) {
    window.ipc.sync.syncGames();
  }

  useEffect(() => {
    void fetchCollections();
  }, []);

  const theme = createTheme({
    components: {
      Checkbox: Checkbox.extend({
        defaultProps: {
          radius: "sm",
        },
      }),
      Container: Container.extend({
        classNames: (_, { size }) => ({
          root: clsx({ [classes.responsiveContainer]: size === "responsive" }),
        }),
      }),
      Modal: Modal.extend({
        defaultProps: {
          overlayProps: {
            backgroundOpacity: 0.5,
            blur: 3,
            radius: "xl",
          },
          size: "xl",
        },
      }),
      Notification: Notification.extend({
        classNames: {
          body: classes.notificationBody,
          icon: classes.notificationIcon,
          loader: classes.notificationLoader,
          root: classes.notification,
        },
      }),
      ScrollArea: ScrollArea.extend({
        classNames: {
          viewport: classes.viewport,
        },
      }),
    },
    defaultRadius: "md",
    fontFamily: "Inter, sans-serif",
    fontSmoothing: true,
    headings: { fontFamily: "Readex Pro, sans-serif" },
    primaryColor: "cyan",
    respectReducedMotion: true,
  });

  return (
    <>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <ContextMenuProvider borderRadius="md" shadow="md">
          <Notifications classNames={{ root: classes.notifications }} limit={5} />
          <Outlet />
        </ContextMenuProvider>
      </MantineProvider>
    </>
  );
};
