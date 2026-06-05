import { IconCheck } from "@tabler/icons-react";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { RingProgress } from "@components/ui/ring-progress";
import { GameSyncMessage } from "@stakload/contracts/sync";
import { useNotificationStore } from "@store/notification.store";
import { mapLibraryIcon } from "@util/map-library-icon";

const MINIMUM_METADATA_TOAST_MS = 750;

const Progress = ({ processing, total }: { processing: number; total: number }) => {
  const percentage = (processing / total) * 100;
  const rounded = Math.round(percentage);
  return <RingProgress value={rounded} size={16} thickness={2} color="text-cyan-500" rootColor="text-white/10" />;
};

export const GameSyncStatus = () => {
  const activeToastIdRef = useRef<string | undefined>(undefined);
  const completeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const metadataStartedAtRef = useRef<number | undefined>(undefined);
  const { showToast, updateToast } = useNotificationStore(
    useShallow((state) => ({
      showToast: state.showToast,
      updateToast: state.updateToast,
    })),
  );

  const clearPendingComplete = useCallback(() => {
    if (!completeTimeoutRef.current) return;

    clearTimeout(completeTimeoutRef.current);
    completeTimeoutRef.current = undefined;
  }, []);

  const showOrUpdateToast = useCallback(
    (toastData: Parameters<typeof showToast>[0]) => {
      if (activeToastIdRef.current) {
        updateToast(activeToastIdRef.current, toastData);
        return activeToastIdRef.current;
      }

      const id = showToast(toastData);
      activeToastIdRef.current = id;
      return id;
    },
    [showToast, updateToast],
  );

  const showCompleteToast = useCallback(
    (message: Extract<GameSyncMessage, { action: "complete" }>) => {
      const toastData = {
        autoClose: 5000,
        icon: <IconCheck className="text-green-500" size={16} />,
        loading: false,
        message: `${message.total} games added`,
        title: "Sync complete",
      };

      if (activeToastIdRef.current) {
        updateToast(activeToastIdRef.current, toastData);
        activeToastIdRef.current = undefined;
      } else {
        showToast(toastData);
      }

      completeTimeoutRef.current = undefined;
      metadataStartedAtRef.current = undefined;
    },
    [showToast, updateToast],
  );

  const handleMessage = useCallback(
    (_event: unknown, message: GameSyncMessage) => {
      clearPendingComplete();

      switch (message.action) {
        case "complete": {
          const metadataStartedAt = metadataStartedAtRef.current;
          const completeDelay =
            metadataStartedAt === undefined ? 0 : Math.max(0, MINIMUM_METADATA_TOAST_MS - (Date.now() - metadataStartedAt));

          if (completeDelay > 0) {
            completeTimeoutRef.current = setTimeout(() => showCompleteToast(message), completeDelay);
          } else {
            showCompleteToast(message);
          }
          return;
        }
        case "library": {
          metadataStartedAtRef.current = undefined;
          const { icon: Icon, name } = mapLibraryIcon(message.library);

          showOrUpdateToast({
            autoClose: false,
            icon: <Icon size={16} />,
            loading: true,
            message: (
              <div className="flex items-center gap-2">
                <Icon size={14} className="opacity-50" />
                <span>{name}</span>
              </div>
            ),
            title: "Syncing library",
          });
          return;
        }
        case "metadata": {
          metadataStartedAtRef.current ??= Date.now();

          showOrUpdateToast({
            autoClose: false,
            icon: <Progress processing={message.processing} total={message.total} />,
            loading: false,
            message: `${message.processing} / ${message.total}`,
            title: "Fetching metadata",
          });
          return;
        }
      }
    },
    [clearPendingComplete, showCompleteToast, showOrUpdateToast],
  );

  useEffect(() => {
    const removeListener = window.api.onSyncGameStatus(handleMessage);
    return () => {
      clearPendingComplete();
      removeListener();
    };
  }, [clearPendingComplete, handleMessage]);

  return null;
};
