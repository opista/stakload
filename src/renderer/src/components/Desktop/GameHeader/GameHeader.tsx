import ActionIcon from "@components/ActionIcon/ActionIcon";
import { GameControls } from "@components/Desktop/GameControls/GameControls";
import { GameStoreModel } from "@contracts/database/games";
import { modals } from "@mantine/modals";
import { useGameStore } from "@store/game.store";
import { IconBolt, IconBoltFilled, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

type GameHeaderProps = {
  game: GameStoreModel;
};

export const GameHeader = ({ game }: GameHeaderProps) => {
  const { t } = useTranslation();
  const { toggleFavouriteGame, toggleQuickLaunchGame } = useGameStore(
    useShallow((state) => ({
      toggleFavouriteGame: state.toggleFavouriteGame,
      toggleQuickLaunchGame: state.toggleQuickLaunchGame,
    })),
  );

  const onDelete = () => {
    modals.openContextModal({
      innerProps: {
        id: game._id,
        name: game.name,
        navigateTo: "..",
      },
      modal: "removeGame",
      size: "sm",
      title: t("removeGameModal.title"),
    });
  };

  return (
    <div className="rounded-2xl bg-[var(--color)] overflow-hidden shadow-lg">
      <div className="mx-auto max-w-screen-2xl px-6 py-4">
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
