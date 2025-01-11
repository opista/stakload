import { GamesList } from "@components/GamesList/GamesList";
import Logo from "@components/Logo/Logo";
import { GameStoreModel } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { AppShell, BackgroundImage, Button, Group } from "@mantine/core";
import { getHighestResolutionMedia } from "@util/get-highest-resolution-media";
import { useState } from "react";
import { useNavigate } from "react-router";

import classes from "./GamingLayout.module.css";

export const GamingLayout = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<GameStoreModel | null>(null);

  const { data: games } = useGamesQuery<GameStoreModel[]>(() => window.api.getFilteredGames(), []);

  const media = getHighestResolutionMedia(activeGame?.artworks);

  const onSelectGame = (index: number) => setActiveGame(games?.[index] || null);

  return (
    <AppShell footer={{ height: 60 }} header={{ height: 60 }} navbar={{ width: 100, breakpoint: "sm" }} padding="md">
      {media && (
        <BackgroundImage
          className={activeGame ? classes.fadeIn : classes.fadeOut}
          src={media.url}
          style={{ position: "fixed", width: "100%", height: "100%", opacity: "0.2" }}
        />
      )}
      <AppShell.Header className={classes.header}>
        <Group h="100%" justify="space-betwee  n" px="md">
          <Logo />
          <Button onClick={() => navigate("/d  esktop")}>Back to desktop mode</Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={classes.navbar}>Collections</AppShell.Navbar>
      <AppShell.Main className={classes.main}>
        <GamesList games={games} onSelectGame={onSelectGame} />
      </AppShell.Main>
      <AppShell.Footer className={classes.footer}></AppShell.Footer>
    </AppShell>
  );
};
