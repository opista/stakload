import { AppShell, Box, Divider } from "@mantine/core";
import { SearchControl } from "../../../components/SearchControl/SearchControl";
import { Spotlight } from "../../../components/Spotlight/Spotlight";
import { Header } from "../../components/Header/Header";
import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { GameStoreModel } from "../../../database/schema/game.schema";
import { Allotment } from "allotment";
import classes from "./DesktopView.module.css";
import { GameListView } from "../GameListView/GameListView";

export const DesktopView = () => {
  const collection = useRxCollection<GameStoreModel>("games");
  const query = collection?.find({ sort: [{ name: "asc" }] });

  const { result: games } = useRxQuery(query);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Spotlight />
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <Allotment className={classes.allotment} proportionalLayout={false}>
        <Allotment.Pane minSize={260} maxSize={500} preferredSize={300}>
          <Box p="md" className={classes.navbar}>
            <AppShell.Section>
              <SearchControl />
              <Divider my="md" />
            </AppShell.Section>

            <AppShell.Section flex={1}>
              <GameNavigation games={games} />
            </AppShell.Section>
          </Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <Box p="md" className={classes.main}>
            <GameListView games={games} columnCount={4} />
          </Box>
        </Allotment.Pane>
      </Allotment>
    </AppShell>
  );
};
