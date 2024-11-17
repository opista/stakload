import { Checkbox, ColorSchemeScript, MantineProvider, Modal, ScrollArea, createTheme } from "@mantine/core";
import { DesktopView } from "./views/DesktopView/DesktopView";
import classes from "./App.module.css";
import { Notifications } from "@mantine/notifications";
import { useInterfaceSettingsStore } from "@store/interface-settings-store";

export const App = () => {
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

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <Notifications />
        <DesktopView />
      </MantineProvider>
    </>
  );
};
