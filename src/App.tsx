import {
  Checkbox,
  ColorSchemeScript,
  MantineProvider,
  Modal,
  ScrollArea,
  createTheme,
} from "@mantine/core";
import { useEffect } from "react";
import { DesktopView } from "./desktop/views/DesktopView/DesktopView";
import classes from "./App.module.css";
import { useInterfaceSettingsStore } from "./store/interface-settings-store";
import { Notifications } from "@mantine/notifications";

export function App() {
  const { theme: primaryColor } = useInterfaceSettingsStore();

  const theme = createTheme({
    defaultRadius: "md",
    components: {
      Checkbox: Checkbox.extend({
        defaultProps: {
          radius: "sm",
        },
      }),
      Modal: Modal.extend({
        defaultProps: {
          size: "xl",
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

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      const handleContextMenu = (event: MouseEvent) => event.preventDefault();
      document.addEventListener("contextmenu", handleContextMenu);
      return () => document.removeEventListener("contextmenu", handleContextMenu);
    }
  }, []);

  // TODO
  /**
   * - Trigger any syncs
   * - Get device type (can device be charged??)
   * - Move initialisation work to somewhere else? (disabling context menus etc?)
   */

  // useEffect(() => {
  //   getOwnedGames().then(({ games }) => {
  //     const mapped = games.map((game) => mapOwnedGameDetailsToGameStoreModel(game, "steam"));

  //     return db.games.bulkAdd(mapped);
  //   });
  // }, []);

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Notifications />
        <DesktopView />
      </MantineProvider>
    </>
  );
}
