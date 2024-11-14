import { AppShell, Box, Divider } from "@mantine/core";
import { Allotment } from "allotment";
import { useState } from "react";
import { GamesGrid } from "../../components/GamesGrid/GamesGrid";
import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { GamesFilter } from "../../components/GamesFilter/GamesFilter";
import { Header } from "../../components/Header/Header";
import { SearchControl } from "../../../components/SearchControl/SearchControl";
import { Spotlight } from "../../../components/Spotlight/Spotlight";
import classes from "./DesktopView.module.css";
import { GameDetails } from "../../components/GameDetails/GameDetails";
import { db } from "../../../database";
import { useLiveQuery } from "dexie-react-hooks";

export const DesktopView = () => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const games = useLiveQuery(() => db.games.toArray());

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Spotlight games={games} onClick={setSelectedGame} />
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <Allotment className={classes.allotment} proportionalLayout={false}>
        <Allotment.Pane minSize={250} maxSize={500} preferredSize={300}>
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
                onChange={setSelectedGame}
                selectedGame={selectedGame}
              />
            </AppShell.Section>
          </Box>
        </Allotment.Pane>
        <Allotment.Pane>
          <Box className={classes.main}>
            {selectedGame !== null ? (
              <GameDetails game={games?.[selectedGame]} onBack={() => setSelectedGame(null)} />
            ) : (
              <GamesGrid games={games} columnCount={3} onClick={setSelectedGame} />
            )}
          </Box>
        </Allotment.Pane>
      </Allotment>
    </AppShell>
  );
};
