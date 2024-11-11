import { AppShell, Box, Divider } from "@mantine/core";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { Allotment } from "allotment";
import { useState } from "react";
import { GameListView } from "../GameListView/GameListView";
import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { GameStoreModel } from "../../../database/schema/game.schema";
import { GamesFilter } from "../../components/GamesFilter/GamesFilter";
import { Header } from "../../components/Header/Header";
import { SearchControl } from "../../../components/SearchControl/SearchControl";
import { Spotlight } from "../../../components/Spotlight/Spotlight";
import classes from "./DesktopView.module.css";

export const DesktopView = () => {
  const collection = useRxCollection<GameStoreModel>("games");
  const query = collection?.find({ sort: [{ name: "asc" }] });
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const { result: games } = useRxQuery(query);

  const onGameSelectionChange = (index: number) => setSelectedGame(index);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Spotlight />
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <Allotment className={classes.allotment} proportionalLayout={false}>
        <Allotment.Pane minSize={240} maxSize={500} preferredSize={300}>
          <Box p="md" className={classes.navbar}>
            <AppShell.Section>
              <Box className={classes.searchAndFilters}>
                <SearchControl />
                <GamesFilter />
              </Box>
              <Divider my="md" />
            </AppShell.Section>

            <AppShell.Section flex={1}>
              <GameNavigation
                games={games}
                onChange={onGameSelectionChange}
                selectedGame={selectedGame}
              />
            </AppShell.Section>
          </Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <Box p="md" className={classes.main}>
            <GameListView games={games} columnCount={3} />
          </Box>
        </Allotment.Pane>
      </Allotment>
    </AppShell>
  );
};
