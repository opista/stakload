import { initialize } from "./database/initialize";
import { Provider } from "rxdb-hooks";
import { RxDatabase } from "rxdb";
import {
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  Modal,
  ScrollArea,
} from "@mantine/core";
import { DesktopView } from "./desktop/views/DesktopView/DesktopView";
import { useEffect, useState } from "react";
import classes from "./App.module.css";

const theme = createTheme({
  defaultRadius: "md",
  components: {
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
  primaryColor: "orange",
  respectReducedMotion: true,
});

export function App() {
  const [db, setDb] = useState<RxDatabase>();

  useEffect(() => {
    initialize().then(setDb);
  }, []);

  return (
    <Provider db={db}>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <DesktopView />
      </MantineProvider>
    </Provider>
  );
}
