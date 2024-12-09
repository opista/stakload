import { BackToTop } from "@components/BackToTop/BackToTop";
import { GameHeader } from "@components/GameHeader/GameHeader";
import { GameHero } from "@components/GameHero/GameHero";
import { GameStoreModel } from "@contracts/database/games";
import { Container, Divider, Flex, ScrollArea, Space, Spoiler, Stack, Text } from "@mantine/core";
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

  const Game = ({ game }: { game: GameStoreModel }) => (
    <ScrollArea className={classes.body} viewportRef={containerRef}>
      <GameHeader game={game} />
      <BackToTop container={containerRef.current} />
      <GameHero game={game} />
      <Space h="sm" />
      <Container size="responsive">
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
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Age rating</Text>
              <Text className={classes.field}>{game.ageRating}</Text>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Developers</Text>
              <div className={classes.field}>
                {game.developers?.map((developer) => <Text key={developer.id}>{developer.name}</Text>)}
              </div>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Publishers</Text>
              <div className={classes.field}>
                {game.publishers?.map((publisher) => <Text key={publisher.id}>{publisher.name}</Text>)}
              </div>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Game modes</Text>
              <div className={classes.field}>
                {game.gameModes?.map((mode) => <Text key={mode.id}>{mode.name}</Text>)}
              </div>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Genres</Text>
              <div className={classes.field}>
                {game.genres?.map((genre) => <Text key={genre.id}>{genre.name}</Text>)}
              </div>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Platforms</Text>
              <div className={classes.field}>
                {game.platforms?.map((platform) => <Text key={platform.id}>{platform.name}</Text>)}
              </div>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Perspectives</Text>
              <div className={classes.field}>
                {game.playerPerspectives?.map((perspectives) => <Text key={perspectives.id}>{perspectives.name}</Text>)}
              </div>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>IGDB ID</Text>
              <Text className={classes.field}>{game.igdbId}</Text>
            </Flex>
            <Divider color="white" my={4} />
            <Flex justify="space-between">
              <Text>Game ID</Text>
              <Text className={classes.field}>{game.gameId}</Text>
            </Flex>
          </div>
        </div>
      </Container>
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
      {game ? <Game game={game} /> : <GameNotFound />}
    </Stack>
  );
};
