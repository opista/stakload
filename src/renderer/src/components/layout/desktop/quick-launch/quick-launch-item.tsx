import { GameCover } from "@components/game/game-cover";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconDownload, IconPlayerPlay } from "@tabler/icons-react";
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
          "group relative z-50 flex w-max min-w-full max-w-full cursor-pointer items-center gap-2 rounded-lg p-2 pr-3 transition-all duration-300 ease-in-out text-slate-400 hover:max-w-[200%] hover:pr-5 hover:shadow-gold-hover",
          !editMode && "hover:bg-stone-950 hover:text-primary hover:ring-1 hover:ring-white/10",
        )}
        onClick={onClick}
      >
        <GameCover className="w-9 shrink-0 rounded-md" game={game} showGameTitle={false} />
        <div className="relative flex w-full min-w-0 flex-col text-xs font-bold uppercase">
          <span className="truncate tracking-wider transition-all duration-300 ease-in-out group-hover:-translate-y-1/2">
            {game.name}
          </span>
          <div className="absolute bottom-0 flex translate-y-full items-center gap-1 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-1/2 group-hover:opacity-100">
            {game.isInstalled ? <IconPlayerPlay size={12} /> : <IconDownload size={12} />}
            <span>{game.isInstalled ? t("quickLaunch.launch") : t("quickLaunch.install")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
