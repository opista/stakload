import { ContentCard } from "@components/ContentCard/ContentCard";
import { GameHeader } from "@components/Desktop/GameHeader/GameHeader";
import { GameDetailsTable } from "@components/GameDetailsTable/GameDetailsTable";
import { GameHero } from "@components/GameHero/GameHero";
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
import { RefObject, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./GameDetailsView.module.css";

export const GameDetailsView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const params = useParams();

  const { fetchGameDetails, gameDetails } = useGameStore(
    useShallow((state) => ({
      fetchGameDetails: state.fetchGameDetails,
      gameDetails: params.id ? state.gamesDetails[params.id] : undefined,
    })),
  );

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [params.id]);

  useEffect(() => {
    console.log(gameDetails);
    if (!params.id) return;
    if (gameDetails) return;

    fetchGameDetails(params.id);
  }, [params.id, gameDetails, fetchGameDetails]);

  if (!params.id) {
    navigate("/library");
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
      <GameHero className={classes.hero} game={gameDetails} />
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
              <IncompatibilityIcon size="xl" />
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
                          <Text className={classes.idValue} size="xs">
                            {game.gameId}
                          </Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text className={classes.idLabel} size="xs">
                            {t("game.igdbId")}
                          </Text>
                          <Text className={classes.idValue} size="xs">
                            {game.igdbId}
                          </Text>
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
