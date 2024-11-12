import { AppShell, Box, Divider } from "@mantine/core";
import { useRxCollection, useRxQuery } from "rxdb-hooks";
import { Allotment } from "allotment";
import { useState } from "react";
import { GamesGrid } from "../../components/GamesGrid/GamesGrid";
import { GameNavigation } from "../../components/GameNavigation/GameNavigation";
import { GameStoreModel } from "../../../database/schema/game.schema";
import { GamesFilter } from "../../components/GamesFilter/GamesFilter";
import { Header } from "../../components/Header/Header";
import { SearchControl } from "../../../components/SearchControl/SearchControl";
import { Spotlight } from "../../../components/Spotlight/Spotlight";
import classes from "./DesktopView.module.css";
import { GameDetails } from "../../components/GameDetails/GameDetails";

export const DesktopView = () => {
  const collection = useRxCollection<GameStoreModel>("games");
  const query = collection?.find({ sort: [{ name: "asc" }] });
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const { result: games } = useRxQuery(query);

  // useEffect(() => {
  //   getOwnedGames()
  //     .then(({ games }) => getAppDetails(games[0].appid))
  //     .then((v) => console.log(v));
  // }, []);

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
          <Box p="md" className={classes.main}>
            {selectedGame !== null ? (
              <GameDetails game={games[selectedGame]} onBack={() => setSelectedGame(null)} />
            ) : (
              <GamesGrid games={games} columnCount={3} onClick={setSelectedGame} />
            )}
          </Box>
        </Allotment.Pane>
      </Allotment>
    </AppShell>
  );
};
