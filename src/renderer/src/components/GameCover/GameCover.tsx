import { GameListModel } from "@contracts/database/games";
import { AspectRatio, Image, Stack, Text } from "@mantine/core";
import { IconDeviceGamepad2 } from "@tabler/icons-react";
import { mapLibraryIcon } from "@util/map-library-icon";
import clsx from "clsx";

import classes from "./GameCover.module.css";

const GAME_COVER_ART_RATIO = 3 / 4;

type GameCoverProps = {
  className?: string;
  game: GameListModel;
  hoverEffect?: boolean;
  onClick?: (game: GameListModel) => void;
  showGameTitle?: boolean;
  showLibraryIcon?: boolean;
};

const LibraryIcon = ({ game }: { game: GameListModel }) => {
  const { icon: Icon } = mapLibraryIcon(game.library);
  return <Icon className={classes.libraryIcon} />;
};

const GameCoverArt = ({ game }: { game: GameListModel }) => <Image src={game.cover!} title={game.name} />;

const GameCoverEmpty = ({
  game,
  showGameTitle,
}: {
  game: GameListModel;
  showGameTitle?: boolean;
  showLibraryIcon?: boolean;
}) => (
  <Stack className={classes.emptyContainer}>
    <IconDeviceGamepad2 className={clsx(classes.emptyIcon, { [classes.centred]: !showGameTitle })} stroke={1} />
    {showGameTitle && (
      <Text className={classes.emptyText} lineClamp={2}>
        {game.name}
      </Text>
    )}
  </Stack>
);

export const GameCover = ({
  className,
  game,
  hoverEffect = true,
  onClick,
  showGameTitle = true,
  showLibraryIcon = true,
}: GameCoverProps) => (
  <AspectRatio
    className={clsx(classes.aspectRatio, className, {
      [classes.hoverEffect]: hoverEffect,
      [classes.clickable]: !!onClick,
    })}
    onClick={() => onClick?.(game)}
    ratio={GAME_COVER_ART_RATIO}
  >
    {showLibraryIcon && <LibraryIcon game={game} />}
    {game.cover ? <GameCoverArt game={game} /> : <GameCoverEmpty game={game} showGameTitle={showGameTitle} />}
  </AspectRatio>
);
