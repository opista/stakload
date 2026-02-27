import { ActionIcon } from "@components/ui/action-icon";
import { GameStoreModel } from "@contracts/database/games";
import { useGameStore } from "@store/game.store";
import { useModalStore } from "@store/modal.store";
import { IconBolt, IconBoltFilled, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { GameControls } from "./game-controls";

type GameHeaderProps = {
  game: GameStoreModel;
};

export const GameHeader = ({ game }: GameHeaderProps) => {
  const { t } = useTranslation();
  const openModal = useModalStore((state) => state.openModal);
  const { toggleFavouriteGame, toggleQuickLaunchGame } = useGameStore(
    useShallow((state) => ({
      toggleFavouriteGame: state.toggleFavouriteGame,
      toggleQuickLaunchGame: state.toggleQuickLaunchGame,
    })),
  );

  const onDelete = () => {
    openModal("removeGame", {
      innerProps: {
        id: game._id,
        name: game.name,
        navigateTo: "..",
      },
    });
  };

  return (
    <div className="rounded-2xl bg-[var(--color)] overflow-hidden shadow-lg">
      <div className="mx-auto max-w-screen-2xl px-6 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <GameControls game={game} />
          </div>
          <div className="flex items-center gap-2">
            <ActionIcon
              aria-label="Favourite"
              icon={game.isFavourite ? IconStarFilled : IconStar}
              onClick={() => toggleFavouriteGame(game._id)}
            />
            <ActionIcon
              aria-label="Quick access"
              icon={game.isQuickLaunch ? IconBoltFilled : IconBolt}
              onClick={() => toggleQuickLaunchGame(game._id)}
            />
            <ActionIcon aria-label={t("common.delete")} icon={IconTrash} onClick={onDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};
