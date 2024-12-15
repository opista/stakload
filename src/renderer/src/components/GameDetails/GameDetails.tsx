import BackToTop from "@components/BackToTop/BackToTop";
import { ContentCard } from "@components/ContentCard/ContentCard";
import { GameDetailsTable } from "@components/GameDetailsTable/GameDetailsTable";
import { GameHeader } from "@components/GameHeader/GameHeader";
import { GameHero } from "@components/GameHero/GameHero";
import { GameLinks } from "@components/GameLinks/GameLinks";
import { IncompatibilityIcon } from "@components/IncompatibilityIcon/IncompatibilityIcon";
import { LibraryIcon } from "@components/LibraryIcon/LibraryIcon";
import { MediaCarousel } from "@components/Media/MediaCarousel/MediaCarousel";
import ProtonIcon from "@components/ProtonIcon/ProtonIcon";
import { Spoiler } from "@components/Spoiler/Spoiler";
import { GameStoreModel } from "@contracts/database/games";
import { Container, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { IconPuzzleOff } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

import classes from "./GameDetails.module.css";

export const GameDetails = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
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
    setIsLoading(true);
    window.api.getGameById(params.id!).then((game) => {
      setGame(game);
      setIsLoading(false);
      console.log(game.name, game);
    });
  }, [params.id]);

  const onPaletteChange = (hsl: string | null) => {
    setBackgroundColor(hsl);
  };

  const Game = ({ game }: { game: GameStoreModel }) => {
    const { t } = useTranslation();
    // TODO
    return isLoading ? (
      "loading"
    ) : (
      <>
        <GameHeader game={game} />
        <ScrollArea
          className={classes.scrollArea}
          style={{ "--gradient-color": backgroundColor }}
          viewportRef={containerRef}
        >
          <BackToTop container={containerRef.current} />
          <GameHero game={game} onPaletteChange={onPaletteChange} />
          {/* TODO - identify if a game has no content, and if so, show
          a message and potentially add an option to search for metadata. 
          We'll need to build this into the API too */}
          <div className={classes.contentContainer}>
            <Container size="responsive">
              <Title className={classes.title} lineClamp={3} order={1} textWrap="balance" title={game.name}>
                {game.name}
              </Title>
              <Group className={classes.iconGroup} gap="xs">
                {/* TODO - Only show this icon if game isn't supported on system */}
                <IncompatibilityIcon color="orange" size="xl" />
                <LibraryIcon game={game} size="xl" />
                {game.library === "steam" && <ProtonIcon gameId={game.gameId} platforms={game.platforms} size="xl" />}
              </Group>

              <div className={classes.bodyInner}>
                <main className={classes.main}>
                  <ContentCard
                    content={
                      <Spoiler maxHeight={200}>
                        <Text>{game.summary}</Text>
                      </Spoiler>
                    }
                    title={t("gameDetails.summary")}
                  />
                  <ContentCard content={<GameDetailsTable game={game} />} title={t("gameDetails.details")} />
                </main>
                <div className={classes.sidebar}>
                  <ContentCard content={<GameLinks websites={game.websites} />} title={t("gameDetails.links")} />
                  <ContentCard
                    content={<MediaCarousel height={200} images={game.screenshots} videos={game.videos} />}
                    title={t("gameDetails.media")}
                  />
                </div>
              </div>
            </Container>
          </div>
        </ScrollArea>
      </>
    );
  };

  const GameNotFound = () => (
    <Stack align="center" h="100%" justify="center">
      <IconPuzzleOff color="orange" size={60} stroke={0.5} />
      <Text>{t("gameNotFound")}</Text>
    </Stack>
  );

  return (
    <Stack align="stretch" className={classes.container} gap={0} justify="flex-start">
      {game ? <Game game={game} /> : <GameNotFound />}
    </Stack>
  );
};
