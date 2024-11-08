import { initialize } from "./database/initialize";
import { Provider } from "rxdb-hooks";
import { RxDatabase } from "rxdb";
import {
  Button,
  ColorSchemeScript,
  createTheme,
  MantineProvider,
  Modal,
  Paper,
  Progress,
  ScrollArea,
  Select,
} from "@mantine/core";
import { DesktopView } from "./desktop/views/DesktopView/DesktopView";
import { useEffect, useState } from "react";
import classes from "./App.module.css";

const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: "md",
        size: "xl",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    Progress: Progress.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    ScrollArea: ScrollArea.extend({
      classNames: {
        viewport: classes.viewport,
      },
    }),
    Select: Select.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    TextInput: Button.extend({
      defaultProps: {
        radius: "md",
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
