import {
  Checkbox,
  ColorSchemeScript,
  MantineProvider,
  Modal,
  ScrollArea,
  createTheme,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Provider } from "rxdb-hooks";
import { RxDatabase } from "rxdb";
import { DesktopView } from "./desktop/views/DesktopView/DesktopView";
import classes from "./App.module.css";
import { initialize } from "./database/initialize";
import { useInterfaceSettingsStore } from "./store/interface-settings-store";

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
      return () => document.removeEventListener("contextmenu", handleContextMenu);
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
