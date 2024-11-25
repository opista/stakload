import { Alert, BackgroundImage, Box, Divider, Flex, Group, Overlay, ScrollArea, Stack, Title } from "@mantine/core";
import { IconArrowLeft, IconInfoCircle, IconPencil, IconTrash } from "@tabler/icons-react";
import classes from "./GameDetails.module.css";
import { useEffect, useRef, useState } from "react";
import { BackToTop } from "@components/BackToTop/BackToTop";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { RawHtml } from "@components/RawHtml/RawHtml";
import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { useTranslation } from "react-i18next";
import { useSystemStore } from "@store/system.store";
import { useNavigate, useParams } from "react-router";
import { GameStoreModel } from "../../schema/games";

export const GameDetails = () => {
  const [showCompatibilityAlert, setShowCompatibilityAlert] = useState(true);
  const { operatingSystem } = useSystemStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<GameStoreModel | null>(null);
  const params = useParams();

  const navigateToGamesList = () => navigate("/desktop");

  const scrollToTop = () => containerRef.current?.scrollTo({ top: 0 });

  useEffect(() => {
    if (game) scrollToTop();
  }, [game?._id]);

  if (!params.id) {
    navigateToGamesList();
  }

  useEffect(() => {
    window.api.getGameById(params.id!).then(setGame);
  }, [params.id]);

  if (!game) {
    // TODO game not found
    return;
  }

  const isGameSupported = operatingSystem && game?.platform?.includes(operatingSystem);

  return (
    <Stack align="stretch" className={classes.container} justify="flex-start" gap={0}>
      <Flex justify="space-between">
        <Group>
          <ActionIcon aria-label={t("goBack")} icon={IconArrowLeft} onClick={navigateToGamesList} />
        </Group>
        <Group gap="xs">
          <ActionIcon aria-label={t("edit")} icon={IconPencil} onClick={() => console.log("edit")} />
          <ActionIcon aria-label={t("delete")} icon={IconTrash} onClick={() => console.log("delete")} />
        </Group>
      </Flex>
      <Divider mt="md" />
      {!isGameSupported && showCompatibilityAlert && (
        <Alert
          className={classes.compatibilityAlert}
          color="orange"
          icon={<IconInfoCircle />}
          onClose={() => setShowCompatibilityAlert(false)}
          title={t("gameDetails.compatibilityWarning")}
          variant="light"
          withCloseButton
        >
          {t("gameDetails.gameNotNative")}
        </Alert>
      )}
      <ScrollArea className={classes.body} viewportRef={containerRef}>
        <BackToTop container={containerRef.current} />
        <BackgroundImage className={classes.hero} src={game.backgroundImage || ""}>
          <Flex className={classes.heroContent}>
            <Title className={classes.heroText} lineClamp={3} order={1} title={game.name} textWrap="balance">
              {game.name}
            </Title>
            <Group>
              <LibraryIcon game={game} size="xl" />
            </Group>
          </Flex>

          <Overlay
            className={classes.overlay}
            gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 50%)"
            opacity={0.85}
          />
        </BackgroundImage>
        <Box>
          <RawHtml html={game.description} />
        </Box>
      </ScrollArea>
    </Stack>
  );
};
