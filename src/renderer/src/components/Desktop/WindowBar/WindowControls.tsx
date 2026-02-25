import ActionIcon from "@components/ActionIcon/ActionIcon";
import { Tooltip } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useNotificationStore } from "@store/notification.store";
import { IconBell, IconDice5Filled, IconMinus, IconSquare, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

export const WindowControls = () => {
  const { getRandomGame } = useGameStore(useShallow((state) => ({ getRandomGame: state.getRandomGame })));
  const { hasNotifications, toggleDrawer } = useNotificationStore(
    useShallow((state) => ({
      hasNotifications: !!state.notifications.length,
      toggleDrawer: state.toggleDrawer,
    })),
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [platform, setPlatform] = useState<NodeJS.Platform | null>(null);

  useEffect(() => {
    void window.ipc.system.getPlatform().then(setPlatform);
  }, []);

  const handleRandomGame = () => {
    const randomGame = getRandomGame();
    if (randomGame) {
      void navigate(`/library/${randomGame._id}`);
    }
  };
  const handleMinimize = () => window.ipc.window.minimize();
  const handleMaximize = () => window.ipc.window.maximize();
  const handleClose = () => window.ipc.window.close();

  return (
    <div className="flex items-center gap-2 [app-region:no-drag]">
      <Tooltip label={t("windowControls.randomGame")}>
        <ActionIcon
          aria-label={t("windowControls.randomGame")}
          className="h-auto w-auto px-4 py-2"
          onClick={handleRandomGame}
          variant="subtle"
        >
          <IconDice5Filled size={16} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label={t("windowControls.notifications")}>
        <ActionIcon
          aria-label={t("windowControls.notifications")}
          className="h-auto w-auto px-4 py-2"
          onClick={toggleDrawer}
          variant="subtle"
        >
          <div className="relative">
            <IconBell size={16} />
            {hasNotifications && (
              <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border border-neutral-900 bg-red-500 ring-2 ring-red-500/50 animate-pulse" />
            )}
          </div>
        </ActionIcon>
      </Tooltip>
      {platform && platform !== "darwin" && (
        <div className="flex">
          <ActionIcon
            aria-label={t("windowControls.minimize")}
            className="h-auto w-auto px-4 py-2 rounded-none"
            onClick={handleMinimize}
            variant="subtle"
          >
            <IconMinus size={16} />
          </ActionIcon>
          <ActionIcon
            aria-label={t("windowControls.maximize")}
            className="h-auto w-auto px-4 py-2 rounded-none"
            onClick={handleMaximize}
            variant="subtle"
          >
            <IconSquare size={16} />
          </ActionIcon>
          <ActionIcon
            aria-label={t("windowControls.close")}
            className="h-auto w-auto px-4 py-2 rounded-none hover:bg-red-600 active:bg-red-700"
            onClick={handleClose}
            variant="subtle"
          >
            <IconX size={16} />
          </ActionIcon>
        </div>
      )}
    </div>
  );
};
