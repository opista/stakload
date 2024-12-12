import { BackToTop } from "@components/BackToTop/BackToTop";
import { ContentCard } from "@components/ContentCard/ContentCard";
import { GameDetailsTable } from "@components/GameDetailsTable/GameDetailsTable";
import { GameHeader } from "@components/GameHeader/GameHeader";
import { GameHero } from "@components/GameHero/GameHero";
import { GameLinks } from "@components/GameLinks/GameLinks";
import { MediaCarousel } from "@components/Media/MediaCarousel/MediaCarousel";
import { GameStoreModel } from "@contracts/database/games";
import { Container, ScrollArea, Space, Spoiler, Stack, Text } from "@mantine/core";
import { IconPuzzleOff } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

import classes from "./GameDetails.module.css";

export const GameDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<GameStoreModel | null>(null);
  const params = useParams();

  const navigateToGamesList = () => navigate("..", { relative: "path" });
  const scrollToTop = () => containerRef.current?.scrollTo({ top: 0 });

  useEffect(() => {
    if (game) scrollToTop();
  }, [game?._id]);

  if (!params.id) {
    navigateToGamesList();
  }

  useEffect(() => {
    window.api.getGameById(params.id!).then((game) => {
      setGame(game);
      console.log(game.name, game);
    });
  }, [params.id]);

  const Game = ({ game }: { game: GameStoreModel }) => {
    const { t } = useTranslation();
    return (
      <ScrollArea className={classes.body} viewportRef={containerRef}>
        <GameHeader game={game} />
        <BackToTop container={containerRef.current} />
        <GameHero game={game} />
        <Space h="sm" />
        <Container size="responsive">
          <div className={classes.bodyInner}>
            <div>
              <ContentCard
                title={t("gameDetails.summary")}
                content={
                  <Spoiler hideLabel="hide" maxHeight={200} showLabel="show more">
                    <Text>{game.summary}</Text>
                  </Spoiler>
                }
              />
              <ContentCard title={t("gameDetails.details")} content={<GameDetailsTable game={game} />} />
            </div>
            <div className={classes.infoContainer}>
              <ContentCard title={t("gameDetails.links")} content={<GameLinks websites={game.websites} />} />
              <ContentCard
                title={t("gameDetails.media")}
                content={<MediaCarousel height={200} images={game.screenshots} videos={game.videos} />}
              />
            </div>
          </div>
        </Container>
      </ScrollArea>
    );
  };

  const GameNotFound = () => (
    <Stack align="center" h="100%" justify="center">
      <IconPuzzleOff color="orange" size={60} stroke={0.5} />
      <Text>{t("gameNotFound")}</Text>
    </Stack>
  );

  return (
    <Stack align="stretch" className={classes.container} justify="flex-start" gap={0}>
      {game ? <Game game={game} /> : <GameNotFound />}
    </Stack>
  );
};
