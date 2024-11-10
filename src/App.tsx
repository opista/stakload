import { initialize } from "./database/initialize";
import { Provider } from "rxdb-hooks";
import { RxDatabase } from "rxdb";
import {
  Checkbox,
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  Modal,
  ScrollArea,
} from "@mantine/core";
import { DesktopView } from "./desktop/views/DesktopView/DesktopView";
import { useEffect, useState } from "react";
import classes from "./App.module.css";
import { useInterfaceSettingsStore } from "./store/interface-settings-store";
import { storage } from "@neutralinojs/lib";

export function App() {
  const [db, setDb] = useState<RxDatabase>();
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
    initialize().then(setDb);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      const handleContextMenu = (event: MouseEvent) => event.preventDefault();
      document.addEventListener("contextmenu", handleContextMenu);
      return () =>
        document.removeEventListener("contextmenu", handleContextMenu);
    }
  }, []);

  // TODO
  /**
   * - Trigger any syncs
   * - Get device type (can device be charged??)
   * - Move initialisation work to somewhere else? (disabling context menus etc?)
   */

  return (
    <Provider db={db}>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <DesktopView />
      </MantineProvider>
    </Provider>
  );
}
