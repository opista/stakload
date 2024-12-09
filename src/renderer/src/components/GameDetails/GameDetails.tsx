import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { BackToTop } from "@components/BackToTop/BackToTop";
import { IncompatibilityIcon } from "@components/IncompatibilityIcon/IncompatibilityIcon";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { RemoveGameModal } from "@components/RemoveGameModal/RemoveGameModal";
import { GameStoreModel } from "@contracts/database/games";
import {
  BackgroundImage,
  Divider,
  Flex,
  Group,
  Overlay,
  ScrollArea,
  Space,
  Spoiler,
  Stack,
  Text,
  Title,
} from "@mantine/core";
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
  const headerImage = media?.url || game?.screenshots?.[0];

  useEffect(() => {
    if (!headerImage) return;

    const v = new Vibrant(headerImage);
    v.getPalette()
      .then((r) => {
        document.body.style.setProperty("--gradient-color", r.DarkMuted?.hex as string);
      })
      .catch(() => {});

    return () => {
      document.body.style.setProperty("--gradient-color", "transparent");
    };
  }, [headerImage]);

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
      <BackgroundImage className={classes.hero} radius="md" src={headerImage || ""}>
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
      <Space h="sm" />
      <div className={classes.body}>
        <div className={classes.bodyInner}>
          <div>
            <Spoiler hideLabel="hide" maxHeight={300} showLabel="show more">
              <Text>{game.summary}</Text>
            </Spoiler>
          </div>
          <div className={classes.infoContainer}>
            <Flex justify="space-between">
              <Text>Release date</Text>
              {!!game.firstReleaseDate && (
                <Text className={classes.field}>
                  {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(game.firstReleaseDate))}
                </Text>
              )}
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>Age rating</Text>
              <Text className={classes.field}>{game.ageRating}</Text>
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>Developers</Text>
              <div className={classes.field}>
                {game.developers?.map((developer) => <Text key={developer.id}>{developer.name}</Text>)}
              </div>
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>Publishers</Text>
              <div className={classes.field}>
                {game.publishers?.map((publisher) => <Text key={publisher.id}>{publisher.name}</Text>)}
              </div>
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>Game modes</Text>
              <div className={classes.field}>
                {game.gameModes?.map((mode) => <Text key={mode.id}>{mode.name}</Text>)}
              </div>
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>Genres</Text>
              <div className={classes.field}>
                {game.genres?.map((genre) => <Text key={genre.id}>{genre.name}</Text>)}
              </div>
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>Platforms</Text>
              <div className={classes.field}>
                {game.platforms?.map((platform) => <Text key={platform.id}>{platform.name}</Text>)}
              </div>
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>Perspectives</Text>
              <div className={classes.field}>
                {game.playerPerspectives?.map((perspectives) => <Text key={perspectives.id}>{perspectives.name}</Text>)}
              </div>
            </Flex>
            <Divider my={4} />
            <Flex justify="space-between">
              <Text>IGDB ID</Text>
              <Text className={classes.field}>{game.igdbId}</Text>
            </Flex>
          </div>
        </div>
      </div>
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
