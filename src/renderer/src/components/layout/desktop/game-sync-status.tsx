import { RingProgress } from "@components/ui/ring-progress";
import { GameSyncMessage } from "@contracts/sync";
import { useGameSync } from "@hooks/use-game-sync-status";
import { useNotificationStore } from "@store/notification.store";
import { IconCheck } from "@tabler/icons-react";
import { mapLibraryIcon } from "@util/map-library-icon";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const Progress = ({ processing, total }: { processing: number; total: number }) => {
  const percentage = (processing / total) * 100;
  const rounded = Math.round(percentage);
  return <RingProgress value={rounded} size={16} thickness={2} color="text-cyan-500" rootColor="text-white/10" />;
};

export const GameSyncStatus = () => {
  const message = useGameSync();
  const [activeToastId, setActiveToastId] = useState<string | undefined>(undefined);
  const { showToast, updateToast } = useNotificationStore(
    useShallow((state) => ({
      showToast: state.showToast,
      updateToast: state.updateToast,
    })),
  );

  const handleMessage = (message: GameSyncMessage | null) => {
    if (!message) return;

    switch (message.action) {
      case "complete": {
        if (activeToastId) {
          updateToast(activeToastId, {
            autoClose: 5000,
            icon: <IconCheck className="text-green-500" size={16} />,
            loading: false,
            message: `${message.total} games added`,
            title: "Sync complete",
          });
          setActiveToastId(undefined);
        } else {
          showToast({
            autoClose: 5000,
            icon: <IconCheck className="text-green-500" size={16} />,
            message: `${message.total} games added`,
            title: "Sync complete",
          });
        }
        return;
      }
      case "library": {
        const { icon: Icon, name } = mapLibraryIcon(message.library);
        const toastData = {
          autoClose: false as any,
          icon: <Icon size={16} />,
          loading: true,
          message: (
            <div className="flex items-center gap-2">
              <Icon size={14} className="opacity-50" />
              <span>{name}</span>
            </div>
          ),
          title: "Syncing library",
        };

        if (activeToastId) {
          updateToast(activeToastId, toastData);
        } else {
          const id = showToast(toastData);
          setActiveToastId(id);
        }
        return;
      }
      case "metadata": {
        const toastData = {
          autoClose: false as any,
          icon: <Progress processing={message.processing} total={message.total} />,
          loading: false,
          message: `${message.processing} / ${message.total}`,
          title: "Fetching metadata",
        };

        if (activeToastId) {
          updateToast(activeToastId, toastData);
        } else {
          const id = showToast(toastData);
          setActiveToastId(id);
        }
        return;
      }
    }
  };

  useEffect(() => handleMessage(message), [message]);

  return null;
};
