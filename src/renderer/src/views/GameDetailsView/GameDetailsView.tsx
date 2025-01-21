import { ContentCard } from "@components/ContentCard/ContentCard";
import { GameDetailsTable } from "@components/GameDetailsTable/GameDetailsTable";
import { GameHeader } from "@components/GameHeader/GameHeader";
import { GameLinks } from "@components/GameLinks/GameLinks";
import { IncompatibilityIcon } from "@components/IncompatibilityIcon/IncompatibilityIcon";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { MediaCarousel } from "@components/Media/MediaCarousel/MediaCarousel";
import ProtonIcon from "@components/ProtonIcon/ProtonIcon";
import { Spoiler } from "@components/Spoiler/Spoiler";
import { GameStoreModel } from "@contracts/database/games";
import {
  AspectRatio,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconPuzzleOff } from "@tabler/icons-react";
import { RefObject, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./GameDetailsView.module.css";

export const GameDetailsView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const params = useParams();

  const { fetchGameDetails, gameDetails, setCurrentGame } = useGameStore(
    useShallow((state) => ({
      fetchGameDetails: state.fetchGameDetails,
      gameDetails: params.id ? state.gamesDetails[params.id] : undefined,
      setCurrentGame: state.setCurrentGame,
    })),
  );

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;
    if (gameDetails) {
      setCurrentGame(gameDetails);
      return;
    }

    const loadDetails = async () => {
      const details = await fetchGameDetails(params.id!);
      if (details) {
        setCurrentGame(details);
      }
    };

    loadDetails();
  }, [params.id, gameDetails, fetchGameDetails, setCurrentGame]);

  if (!params.id) {
    navigate("/desktop/library");
    return null;
  }

  if (!gameDetails) {
    return (
      <Stack align="stretch" className={classes.container} gap={0} justify="flex-start">
        <LoadingOverlay visible={true} />
      </Stack>
    );
  }

  return (
    <Stack align="stretch" className={classes.container} gap={0} justify="flex-start">
      <Game containerRef={containerRef} game={gameDetails} />
    </Stack>
  );
};

const Game = ({ containerRef, game }: { containerRef: RefObject<HTMLDivElement>; game: GameStoreModel }) => {
  const { t } = useTranslation();

  return (
    <>
      <GameHeader game={game} />
      <ScrollArea
        className={classes.scrollArea}
        classNames={{ root: classes.scrollArea, viewport: classes.scrollAreaViewport }}
        viewportRef={containerRef}
      >
        <div className={classes.contentContainer}>
          <Container size="responsive">
            <Title className={classes.title} lineClamp={3} order={1} textWrap="balance" title={game.name}>
              {game.name}
            </Title>
            <Group className={classes.iconGroup} gap="xs">
              {/* TODO - Only show this icon if game isn't supported on system */}
              <IncompatibilityIcon color="orange" size="xl" />
              <LibraryIcon game={game} size="xl" />
              {game.library === "steam" && <ProtonIcon gameId={game?.gameId} platforms={game.platforms} size="xl" />}
            </Group>

            {game.summary && (
              <main>
                <Grid>
                  <GridCol span={5}>
                    <ContentCard className={classes.summaryCard} title={t("gameDetails.summary")}>
                      <Spoiler maxHeight={300}>
                        <Text>{game.summary}</Text>
                      </Spoiler>
                    </ContentCard>
                  </GridCol>
                  <GridCol span={7}>
                    <AspectRatio ratio={16 / 9}>
                      <MediaCarousel height="100%" images={game.screenshots} videos={game.videos} />
                    </AspectRatio>
                  </GridCol>
                  <GridCol span={12}>
                    <ContentCard title={t("gameDetails.details")}>
                      <GameDetailsTable game={game} />
                    </ContentCard>
                  </GridCol>
                  <GridCol span={12}>
                    <ContentCard title={t("gameDetails.links")}>
                      <GameLinks websites={game.websites} />
                    </ContentCard>
                  </GridCol>
                  <GridCol span={12}>
                    <Flex justify="flex-end">
                      <div>
                        <Flex justify="space-between">
                          <Text className={classes.idLabel} size="xs">
                            {t("game.gameId")}
                          </Text>
                          <Text size="xs">{game.gameId}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text className={classes.idLabel} size="xs">
                            {t("game.igdbId")}
                          </Text>
                          <Text size="xs">{game.igdbId}</Text>
                        </Flex>
                      </div>
                    </Flex>
                  </GridCol>
                </Grid>
              </main>
            )}
            <div></div>
          </Container>
        </div>
      </ScrollArea>
    </>
  );
};

const GameNotFound = () => {
  const { t } = useTranslation();

  return (
    <Stack align="center" h="100%" justify="center">
      <IconPuzzleOff color="orange" size={60} stroke={0.5} />
      <Text>{t("game.notFound")}</Text>
    </Stack>
  );
};
