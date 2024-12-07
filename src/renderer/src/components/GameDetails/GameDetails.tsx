import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { BackToTop } from "@components/BackToTop/BackToTop";
import { IncompatibilityIcon } from "@components/IncompatibilityIcon/IncompatibilityIcon";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { RawHtml } from "@components/RawHtml/RawHtml";
import { RemoveGameModal } from "@components/RemoveGameModal/RemoveGameModal";
import { GameStoreModel } from "@contracts/database/games";
import { BackgroundImage, Box, Divider, Flex, Group, Overlay, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSystemStore } from "@store/system.store";
import { IconArrowLeft, IconPencil, IconPuzzleOff, IconTrash } from "@tabler/icons-react";
import { getHighestRatioMedia } from "@util/get-highest-ratio-media";
import Vibrant from "node-vibrant";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./GameDetails.module.css";

export const GameDetails = () => {
  const operatingSystem = useSystemStore(useShallow((state) => state.operatingSystem));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGameSupported, setIsGameSupported] = useState(false);
  const [game, setGame] = useState<GameStoreModel | null>(null);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const params = useParams();

  const navigateToGamesList = () => navigate("..", { relative: "path" });
  const scrollToTop = () => containerRef.current?.scrollTo({ top: 0 });

  const media = getHighestRatioMedia(game?.artworks);

  useEffect(() => {
    if (!media) return;

    const v = new Vibrant(media.url);
    v.getPalette().then((r) => {
      document.body.style.setProperty("--gradient-color", r.DarkMuted?.hex as string);
    });

    return () => {
      document.body.style.setProperty("--gradient-color", "transparent");
    };
  }, [media?.url]);

  useEffect(() => {
    if (game) scrollToTop();
  }, [game?._id]);

  if (!params.id) {
    navigateToGamesList();
  }

  useEffect(() => {
    window.api.getGameById(params.id!).then((game) => {
      console.log({ game });
      setGame(game);
      setIsGameSupported(!game.metadataSyncedAt || (!!operatingSystem && !!game?.platform?.includes(operatingSystem)));
    });
  }, [params.id]);

  const onRemoveConfirm = async (preventReadd: boolean) => {
    if (!game) return;
    await window.api.removeGame(game._id, preventReadd);
    navigate("..");
    closeDelete();
  };

  const Game = ({ game }: { game: GameStoreModel }) => (
    <ScrollArea className={classes.body} viewportRef={containerRef}>
      <BackToTop container={containerRef.current} />
      <BackgroundImage className={classes.hero} radius="md" src={media?.url || ""}>
        <Overlay
          className={classes.overlay}
          gradient="linear-gradient(0deg, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0) 50%)"
        />
        <Flex className={classes.heroContent}>
          <Title className={classes.heroText} lineClamp={3} order={1} title={game.name} textWrap="balance">
            {game.name}
          </Title>
          <Group gap="xs">
            {!isGameSupported && <IncompatibilityIcon color="orange" size="xl" />}
            <LibraryIcon game={game} size="xl" />
          </Group>
        </Flex>
      </BackgroundImage>
      <Box>
        <Text>{game.summary}</Text>
        <Text>{game.storyline}</Text>
        <div>Released: {game.firstReleaseDate}</div>
        <div>Age rating: {game.ageRating}</div>
        <div>developers: {game.developers?.map(({ name }) => name).join(", ")}</div>
        <div>publishers: {game.publishers?.map(({ name }) => name).join(", ")}</div>
        <div>game modes: {game.gameModes?.map(({ name }) => name).join(", ")}</div>
        <div>genres: {game.genres?.map(({ name }) => name).join(", ")}</div>
        <div>platforms: {game.platforms?.map(({ name }) => name).join(", ")}</div>
        <div>perspectives: {game.playerPerspectives?.map(({ name }) => name).join(", ")}</div>
        <RawHtml html={game.description} />
        {game.gameId}
        {game.igdbId}
      </Box>
    </ScrollArea>
  );

  const GameNotFound = () => (
    <Stack align="center" h="100%" justify="center">
      <IconPuzzleOff color="orange" size={60} stroke={0.5} />
      <Text>{t("gameNotFound")}</Text>
    </Stack>
  );

  return (
    <Stack align="stretch" className={classes.container} justify="flex-start" gap={0}>
      <Flex justify="space-between">
        <Group>
          <ActionIcon aria-label={t("goBack")} icon={IconArrowLeft} onClick={navigateToGamesList} />
        </Group>
        {game && (
          <>
            <RemoveGameModal
              gameTitle={game.name}
              onConfirm={onRemoveConfirm}
              onClose={closeDelete}
              opened={openedDelete}
            />
            <Group gap="xs">
              {/* TODO - Do we even want to implement this yet? */}
              <ActionIcon aria-label={t("edit")} disabled icon={IconPencil} onClick={() => console.log("edit")} />
              <ActionIcon aria-label={t("delete")} icon={IconTrash} onClick={openDelete} />
            </Group>
          </>
        )}
      </Flex>
      <Divider mt="md" />
      {game ? <Game game={game} /> : <GameNotFound />}
    </Stack>
  );
};
