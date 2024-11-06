import { useEffect, useState } from "react";

import { initialize } from "./database/initialize";
import { Provider } from "rxdb-hooks";
import { RxDatabase } from "rxdb";
import {
  Button,
  ColorSchemeScript,
  createTheme,
  MantineProvider,
} from "@mantine/core";
import DesktopView from "./views/desktop/DesktopView";
import { curl } from "./util/curl";

const theme = createTheme({
  components: {
    Button: Button.extend({
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
  /** Your theme override here */
});

export function App() {
  // const [db, setDb] = useState<RxDatabase>();

  // useEffect(() => {
  // initialize().then(setDb);
  // }, []);

  return (
    // <Provider db={db}>
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <DesktopView />
        <div>
          <p className="text-3xl font-bold underline">
            binaryVersion: {window.NL_VERSION}
          </p>
          <p>clientVersion: {window.NL_CVERSION}</p>
        </div>
      </MantineProvider>
    </>
    // </Provider>
  );
}
