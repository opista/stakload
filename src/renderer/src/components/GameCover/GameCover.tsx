import { GameListModel } from "@contracts/database/games";
import { AspectRatio, Image, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import {
  IconBolt,
  IconDeviceGamepad2,
  IconDownload,
  IconPlayerPlay,
  IconSquareRoundedMinus,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import { mapLibraryIcon } from "@util/map-library-icon";
import clsx from "clsx";
import { useContextMenu } from "mantine-contextmenu";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

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
}: GameCoverProps) => {
  const { toggleFavouriteGame, toggleQuickLaunchGame } = useGameStore(
    useShallow((state) => ({
      toggleFavouriteGame: state.toggleFavouriteGame,
      toggleQuickLaunchGame: state.toggleQuickLaunchGame,
    })),
  );
  const { showContextMenu } = useContextMenu();
  const { t } = useTranslation();

  return (
    <AspectRatio
      className={clsx(classes.aspectRatio, className, {
        [classes.hoverEffect]: hoverEffect,
        [classes.clickable]: !!onClick,
      })}
      onClick={() => onClick?.(game)}
      onContextMenu={showContextMenu([
        {
          key: "launch",
          hidden: !game.isInstalled,
          icon: <IconPlayerPlay size={16} />,
          title: "Launch",
          color: "green",
          onClick: () => {
            console.log("launch");
          },
        },
        {
          key: "install",
          hidden: game.isInstalled,
          icon: <IconDownload size={16} />,
          title: "Install",
          onClick: () => {
            console.log("install");
          },
        },
        {
          key: "uninstall",
          hidden: !game.isInstalled,
          color: "red",
          icon: <IconTrash size={16} />,
          title: "Uninstall",
          onClick: () => {
            console.log("uninstall");
          },
        },
        { key: "divider-1" },
        {
          key: "favourite",
          icon: <IconStar size={16} />,
          title: game.isFavourite ? "Remove from Favourites" : "Add to Favourites",
          onClick: () => toggleFavouriteGame(game._id),
        },
        {
          key: "quick-launch",
          icon: <IconBolt size={16} />,
          title: game.isQuickLaunch ? "Remove from Quick Launch" : "Add to Quick Launch",
          onClick: () => toggleQuickLaunchGame(game._id),
        },
        { key: "divider-2" },
        {
          key: "delete",
          icon: <IconSquareRoundedMinus size={16} />,
          color: "red",
          title: "Remove from library",
          onClick: () => {
            modals.openContextModal({
              innerProps: {
                id: game._id,
                name: game.name,
              },
              modal: "removeGame",
              size: "sm",
              title: t("removeGameModal.title"),
            });
          },
        },
      ])}
      ratio={GAME_COVER_ART_RATIO}
    >
      {showLibraryIcon && <LibraryIcon game={game} />}
      {game.cover ? <GameCoverArt game={game} /> : <GameCoverEmpty game={game} showGameTitle={showGameTitle} />}
    </AspectRatio>
  );
};
