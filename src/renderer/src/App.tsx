import { Checkbox, ColorSchemeScript, Container, createTheme, MantineProvider, Modal, ScrollArea } from "@mantine/core";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./App.module.css";

export const App = () => {
  const primaryColor = useInterfaceSettingsStore(useShallow((state) => state.theme));
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
    primaryColor,
    respectReducedMotion: true,
  });

  // TODO
  /**
   * - Trigger any syncs
   * - Get device type (can device be charged??)
   * - Move initialisation work to somewhere else? (disabling context menus etc?)
   */

  // useEffect(() => {
  //   getOwnedGames("47D232D3BB9240F67610B1609383FB82", "76561198021450658").then(({ games }) => {
  //     const mapped = games.map((game) => mapOwnedGameDetailsToGameStoreModel(game, "steam"));

  //     return db.games.bulkAdd(mapped);
  //   });
  // }, []);

  /**
   * TODO - abstract initial app load actions here.
   * We only need to trigger these actions once when the
   * user loads the app for the first time.
   */
  useEffect(() => {
    window.api.getLocale().then((locale) => i18n.changeLanguage(locale));
  }, []);

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Outlet />
      </MantineProvider>
    </>
  );
};
