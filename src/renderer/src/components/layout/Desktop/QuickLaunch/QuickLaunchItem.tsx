import { GameCover } from "@components/game/GameCover";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { useTranslation } from "react-i18next";

import { GameListModel } from "../../../../ipc.types";

type QuickLaunchItemProps = {
  editMode?: boolean;
  game: GameListModel;
};

export const QuickLaunchItem = ({ editMode, game }: QuickLaunchItemProps) => {
  const { t } = useTranslation();
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({ id: game._id });

  const style = {
    cursor: isDragging ? "grabbing" : "default",
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const onClick = () => {
    if (editMode) return;

    if (game.isInstalled) {
      return window.ipc.game.launchGame(game._id);
    }

    return window.ipc.game.installGame(game._id);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className={cn(
          "group flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors",
          !editMode && "hover:bg-[#1b2c3b]",
        )}
        onClick={onClick}
      >
        <GameCover className="w-9 shrink-0 rounded-md" game={game} showGameTitle={false} />
        <div className="relative flex w-full flex-col overflow-hidden">
          <span className="truncate text-xs transition-transform duration-300 ease-in-out group-hover:-translate-y-1/2">
            {game.name}
          </span>
          <div className="absolute bottom-0 flex translate-y-full items-center gap-1 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-1/2 group-hover:opacity-100">
            <IconPlayerPlayFilled size={10} />
            <span className="text-[10px] font-bold">
              {game.isInstalled ? t("quickLaunch.launch") : t("quickLaunch.install")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


