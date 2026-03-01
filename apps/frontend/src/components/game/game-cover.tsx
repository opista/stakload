import { useContextMenu } from "@components/layout/context-menu";
import { GameListModel } from "@stakload/contracts/database/games";
import { useGameStore } from "@store/game.store";
import { useModalStore } from "@store/modal.store";
import {
  IconBolt,
  IconDownload,
  IconPercentage0,
  IconPlayerPlay,
  IconSquareRoundedMinus,
  IconStar,
  IconTrash,
} from "@tabler/icons-react";
import { cn } from "@util/cn";
import { mapLibraryIcon } from "@util/map-library-icon";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

type GameCoverProps = {
  className?: string;
  game: GameListModel;
  onClick?: (game: GameListModel) => void;
  showGameTitle?: boolean;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  isActive?: boolean;
};

export const GameCover = ({
  className,
  game,
  isActive,
  onClick,
  onFocus,
  onMouseEnter,
  showGameTitle = true,
}: GameCoverProps) => {
  const { toggleFavouriteGame, toggleQuickLaunchGame } = useGameStore(
    useShallow((state) => ({
      toggleFavouriteGame: state.toggleFavouriteGame,
      toggleQuickLaunchGame: state.toggleQuickLaunchGame,
    })),
  );
  const { showContextMenu } = useContextMenu();
  const { t } = useTranslation();
  const openModal = useModalStore((state) => state.openModal);

  const { icon: SourceIcon, name: libraryName } = mapLibraryIcon(game.library);

  return (
    <div
      data-active={isActive ? "true" : undefined}
      className={cn(
        "group relative aspect-[3/4] overflow-hidden rounded-sm bg-stone-950 text-white shadow-gold-edge group-hover:shadow-gold-hover hover:shadow-gold-hover focus-within:shadow-gold-hover data-[active=true]:shadow-gold-hover transition-shadow duration-400 ease-in-out",
        {
          "cursor-pointer": !!onClick,
        },
        className,
      )}
      onClick={() => onClick?.(game)}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      tabIndex={onFocus ? 0 : undefined}
      onContextMenu={showContextMenu([
        {
          color: "green",
          hidden: !game.isInstalled,
          icon: <IconPlayerPlay size={16} />,
          key: "launch",
          onClick: () => window.ipc.game.launchGame(game._id),
          title: t("gameCover.launch"),
        },
        {
          hidden: game.isInstalled,
          icon: <IconDownload size={16} />,
          key: "install",
          onClick: () => window.ipc.game.installGame(game._id),
          title: t("gameCover.install"),
        },
        {
          color: "red",
          hidden: !game.isInstalled,
          icon: <IconTrash size={16} />,
          key: "uninstall",
          onClick: () => window.ipc.game.uninstallGame(game._id),
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
          onClick: () => openModal("removeGame", { innerProps: { id: game._id, name: game.name } }),
          title: t("gameCover.removeFromLibrary"),
        },
      ])}
      title={game.name}
    >
      <div className="w-full h-full transition-transform duration-400 group-hover:scale-110 group-focus-within:scale-110 group-data-[active=true]:scale-110">
        {game.cover ? (
          <img src={game.cover} alt={game.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-end h-full relative overflow-hidden w-full">
            <IconPercentage0
              className={cn(
                "absolute left-1/2 -translate-x-1/2 opacity-20 w-[70%] h-[70%]",
                showGameTitle ? "top-0 h-[calc(100%-75px)]" : "top-1/2 -translate-y-1/2",
              )}
              stroke={1}
            />
          </div>
        )}
      </div>

      {showGameTitle && (
        <div
          className={cn(
            "absolute inset-x-[1px] bottom-[1px] bg-black/80 backdrop-blur-md p-4 translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 group-data-[active=true]:translate-y-0 transition-transform duration-300 border-t border-white/5 z-20 rounded-b-sm",
            {
              "translate-y-0": !game.cover,
            },
          )}
        >
          <h4 className="font-serif text-sm font-bold tracking-wider text-white group-hover:text-primary group-focus-within:text-primary group-data-[active=true]:text-primary truncate mb-1">
            {game.name}
          </h4>
          <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <SourceIcon size={14} />
            {libraryName}
          </div>
        </div>
      )}
    </div>
  );
};
