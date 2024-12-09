import { Checkbox, ColorSchemeScript, Container, createTheme, MantineProvider, Modal, ScrollArea } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { useSystemStore } from "@store/system.store";
import clsx from "clsx";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./App.module.css";

export const App = () => {
  const primaryColor = useInterfaceSettingsStore(useShallow((state) => state.theme));
  const { i18n } = useTranslation();
  const setOperatingSystem = useSystemStore(useShallow((state) => state.setOperatingSystem));

  const theme = createTheme({
    defaultRadius: "md",
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
          size: "xl",
          overlayProps: {
            backgroundOpacity: 0.55,
            blur: 3,
          },
        },
      }),
      ScrollArea: ScrollArea.extend({
        classNames: {
          viewport: classes.viewport,
        },
      }),
    },
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
    window.api.getOS().then(setOperatingSystem);
    window.api.getLocale().then((locale) => i18n.changeLanguage(locale));
  }, []);

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Outlet />
        <Notifications />
      </MantineProvider>
    </>
  );
};
