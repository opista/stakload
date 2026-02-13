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
        [classes.clickable]: !!onClick,
        [classes.hoverEffect]: hoverEffect,
      })}
      onClick={() => onClick?.(game)}
      onContextMenu={showContextMenu([
        {
          color: "green",
          hidden: !game.isInstalled,
          icon: <IconPlayerPlay size={16} />,
          key: "launch",
          onClick: () => window.api.launchGame(game._id),
          title: t("gameCover.launch"),
        },
        {
          hidden: game.isInstalled,
          icon: <IconDownload size={16} />,
          key: "install",
          onClick: () => window.api.installGame(game._id),
          title: t("gameCover.install"),
        },
        {
          color: "red",
          hidden: !game.isInstalled,
          icon: <IconTrash size={16} />,
          key: "uninstall",
          onClick: () => window.api.uninstallGame(game._id),
          title: t("gameCover.uninstall"),
        },
        { key: "divider-1" },
        {
          icon: <IconStar size={16} />,
          key: "favourite",
          onClick: () => toggleFavouriteGame(game._id),
          title: game.isFavourite ? t("gameCover.removeFromFavourites") : t("gameCover.addToFavourites"),
        },
        {
          icon: <IconBolt size={16} />,
          key: "quick-launch",
          onClick: () => toggleQuickLaunchGame(game._id),
          title: game.isQuickLaunch ? t("gameCover.removeFromQuickLaunch") : t("gameCover.addToQuickLaunch"),
        },
        { key: "divider-2" },
        {
          color: "red",
          icon: <IconSquareRoundedMinus size={16} />,
          key: "delete",
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
          title: t("gameCover.removeFromLibrary"),
        },
      ])}
      ratio={GAME_COVER_ART_RATIO}
    >
      {showLibraryIcon && <LibraryIcon game={game} />}
      {game.cover ? <GameCoverArt game={game} /> : <GameCoverEmpty game={game} showGameTitle={showGameTitle} />}
    </AspectRatio>
  );
};
