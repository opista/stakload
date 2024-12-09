import { GameStoreModel } from "@contracts/database/games";
import { AspectRatio, BackgroundImage, Stack, Text } from "@mantine/core";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import { Link } from "react-router";

import classes from "./GameCover.module.css";

const GAME_COVER_ART_RATIO = 3 / 4;

type GameCoverProps = {
  game: GameStoreModel;
};

const GameCoverArt = ({ game }: GameCoverProps) => (
  <BackgroundImage className={classes.backgroundImage} radius="md" src={game.cover!} title={game.name} />
);

const GameCoverEmpty = ({ game }: GameCoverProps) => (
  <Stack className={classes.emptyContainer} align="center" justify="flex-end">
    <IconDeviceGamepad2 className={classes.emptyIcon} size="90%" stroke={1} />
    <Text className={classes.emptyText} lineClamp={2}>
      {game.name}
    </Text>
  </Stack>
);

export const GameCover = ({ game }: GameCoverProps) => (
  <AspectRatio className={classes.aspectRatio} ratio={GAME_COVER_ART_RATIO}>
    <Link className={classes.link} to={`/desktop/${game._id}`}>
      {game.cover ? <GameCoverArt game={game} /> : <GameCoverEmpty game={game} />}
    </Link>
  </AspectRatio>
);
