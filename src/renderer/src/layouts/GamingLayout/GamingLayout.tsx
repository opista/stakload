import { Collections } from "@components/Gaming/GamesList/Collections";
import { GamesList } from "@components/Gaming/GamesList/GamesList";
import { HeaderButtons } from "@components/Gaming/GamesList/HeaderButtons";
import Logo from "@components/Logo/Logo";
import { AppShell, Button, Flex, Group, Text, Title } from "@mantine/core";
import { init } from "@noriginmedia/norigin-spatial-navigation";
import { useGameStore } from "@store/game.store";
import { IconXboxAFilled, IconXboxXFilled } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { GameListModel } from "../../ipc.types";

import classes from "./GamingLayout.module.css";

init({
  debug: false,
  useGetBoundingClientRect: true,
  visualDebug: false,
});

export const GamingLayout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeGame, setActiveGame] = useState<GameListModel | null>(null);
  const gamesList = useGameStore(useShallow((state) => state.gamesList));

  // const media = getHighestResolutionMedia(activeGame?.artworks);

  const onSelectGame = (index: number) => setActiveGame(gamesList?.[index] || null);

  return (
    <AppShell footer={{ height: 100 }} header={{ height: 100 }} navbar={{ breakpoint: "sm", width: 150 }} padding="md">
      {/* {media?.url && (
        <BackgroundImage
          className={activeGame ? classes.fadeIn : classes.fadeOut}
          src={media.url}
          style={{ height: "100%", opacity: "0.2", position: "fixed", width: "100%" }}
        />
      )} */}
      <AppShell.Header className={classes.header}>
        <Group h="100%" justify="space-between" px="md">
          <Logo />
          <HeaderButtons />
          <Button onClick={() => navigate("/desktop")}>Back to desktop</Button>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={classes.navbar}>
        <Group align="center" h="100%" justify="center" px="md">
          <Collections />
        </Group>
      </AppShell.Navbar>
      <AppShell.Main className={classes.main}>
        <div className={classes.gameInfo}>
          <Title className={classes.title} order={1} title={activeGame?.name}>
            {activeGame?.name}
          </Title>
        </div>
        <GamesList games={gamesList} onSelectGame={onSelectGame} />
      </AppShell.Main>
      <AppShell.Footer className={classes.footer}>
        <Flex align="center" gap="xl" h="100%" justify="flex-end" px="xl">
          <Flex align="center" gap="xs">
            <Text size="md">{t("gaming.details")}</Text> <IconXboxAFilled color="#7EB900" size={32} />
          </Flex>
          <Flex align="center" gap="xs">
            <Text size="md">{t("gaming.play")}</Text> <IconXboxXFilled color="#00A3EE" size={32} />
          </Flex>
        </Flex>
      </AppShell.Footer>
    </AppShell>
  );
};
