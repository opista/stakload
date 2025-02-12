import {
  Checkbox,
  ColorSchemeScript,
  Container,
  createTheme,
  MantineProvider,
  Modal,
  Notification,
  ScrollArea,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";
import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./App.module.css";

export const App = () => {
  const { i18n } = useTranslation();

  const { syncOnStartup } = useIntegrationSettingsStore(
    useShallow((state) => ({
      syncOnStartup: state.syncOnStartup,
    })),
  );

  if (syncOnStartup) {
    window.api.syncGames();
  }

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

  /**
   * TODO - abstract initial app load actions here.
   * We only need to trigger these actions once when the
   * user loads the app for the first time. Perhaps this
   * should happen in the backend? Does the frontend care?
   */
  useEffect(() => {
    window.api.getLocale().then((locale) => i18n.changeLanguage(locale));
  }, []);

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Notifications classNames={{ root: classes.notifications }} />
        <Outlet />
      </MantineProvider>
    </>
  );
};
