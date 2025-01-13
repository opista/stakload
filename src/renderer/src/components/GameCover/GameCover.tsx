import { GameStoreModel } from "@contracts/database/games";
import { AspectRatio, Image, Stack, Text } from "@mantine/core";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import clsx from "clsx";
import { Link } from "react-router";

import classes from "./GameCover.module.css";

const GAME_COVER_ART_RATIO = 3 / 4;

type GameCoverProps = {
  game: GameStoreModel;
  hoverEffect?: boolean;
};

const GameCoverArt = ({ game }: GameCoverProps) => <Image src={game.cover!} title={game.name} />;

const GameCoverEmpty = ({ game }: GameCoverProps) => (
  <Stack align="center" className={classes.emptyContainer} justify="flex-end">
    <IconDeviceGamepad2 className={classes.emptyIcon} stroke={1} />
    <Text className={classes.emptyText} lineClamp={2}>
      {game.name}
    </Text>
  </Stack>
);

export const GameCover = ({ game, hoverEffect = true }: GameCoverProps) => (
  <AspectRatio
    className={clsx(classes.aspectRatio, { [classes.hoverEffect]: hoverEffect })}
    ratio={GAME_COVER_ART_RATIO}
  >
    <Link className={classes.link} to={`/desktop/${game._id}`}>
      {game.cover ? <GameCoverArt game={game} /> : <GameCoverEmpty game={game} />}
    </Link>
  </AspectRatio>
);
