import { Collections } from "@components/GamesList/Collections";
import { GamesList } from "@components/GamesList/GamesList";
import { HeaderButtons } from "@components/GamesList/HeaderButtons";
import Logo from "@components/Logo/Logo";
import { GameStoreModel } from "@contracts/database/games";
import { useGamesQuery } from "@hooks/use-games-query";
import { AppShell, BackgroundImage, Button, Flex, Group, Text, Title } from "@mantine/core";
import { init } from "@noriginmedia/norigin-spatial-navigation";
import { IconXboxAFilled, IconXboxXFilled } from "@tabler/icons-react";
import { getHighestResolutionMedia } from "@util/get-highest-resolution-media";
import { useState } from "react";
import { useNavigate } from "react-router";

import classes from "./GamingLayout.module.css";

init({
  debug: false,
  visualDebug: false,
  useGetBoundingClientRect: true,
});

export const GamingLayout = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<GameStoreModel | null>(null);

  const { data: games } = useGamesQuery<GameStoreModel[]>(() => window.api.getFilteredGames(), []);

  const media = getHighestResolutionMedia(activeGame?.artworks);

  const onSelectGame = (index: number) => setActiveGame(games?.[index] || null);

  return (
    <AppShell footer={{ height: 100 }} header={{ height: 100 }} navbar={{ width: 150, breakpoint: "sm" }} padding="md">
      {media?.url && (
        <BackgroundImage
          className={activeGame ? classes.fadeIn : classes.fadeOut}
          src={media.url}
          style={{ position: "fixed", width: "100%", height: "100%", opacity: "0.2" }}
        />
      )}
      <AppShell.Header className={classes.header}>
        <Group h="100%" justify="space-between" px="md">
          <Logo />
          <HeaderButtons />
          <Button onClick={() => navigate("/desktop")}>TEMP: desktop</Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={classes.navbar}>
        <Group align="center" h="100%" justify="center" px="md">
          <Collections />
        </Group>
      </AppShell.Navbar>
      <AppShell.Main className={classes.main}>
        <div className={classes.gameInfo}>
          <Title className={classes.title} lineClamp={2} order={1} textWrap="balance" title={activeGame?.name}>
            {activeGame?.name}
          </Title>
        </div>
        <GamesList games={games} onSelectGame={onSelectGame} />
      </AppShell.Main>
      <AppShell.Footer className={classes.footer}>
        <Flex align="center" gap="xl" h="100%" justify="flex-end" px="xl">
          <Flex align="center" gap="xs">
            <Text size="md">Details</Text> <IconXboxAFilled color="#7EB900" size={32} />
          </Flex>
          <Flex align="center" gap="xs">
            <Text size="md">Play</Text> <IconXboxXFilled color="#00A3EE" size={32} />
          </Flex>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
};
