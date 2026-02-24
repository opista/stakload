import { ActionIcon, Group, Indicator, Tooltip } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useNotificationStore } from "@store/notification.store";
import { IconBell, IconDice5Filled, IconMinus, IconSquare, IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./WindowControls.module.css";

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
    void navigate(`/library/${randomGame._id}`);
  };
  const handleMinimize = () => window.ipc.window.minimize();
  const handleMaximize = () => window.ipc.window.maximize();
  const handleClose = () => window.ipc.window.close();

  return (
    <Group className={classes.container}>
      <Group className={classes.inner} gap="xs">
        <Tooltip label={t("windowControls.randomGame")}>
          <ActionIcon
            aria-label={t("windowControls.randomGame")}
            className={classes.icon}
            color="gray"
            onClick={handleRandomGame}
            variant="subtle"
          >
            <IconDice5Filled size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={t("windowControls.notifications")}>
          <ActionIcon
            aria-label={t("windowControls.notifications")}
            className={classes.icon}
            color="gray"
            onClick={toggleDrawer}
            variant="subtle"
          >
            <Indicator color="red" disabled={!hasNotifications} position="bottom-end" processing size={10} withBorder>
              <IconBell size={16} />
            </Indicator>
          </ActionIcon>
        </Tooltip>
        {platform && platform !== "darwin" && (
          <Group gap={0}>
            <ActionIcon
              aria-label={t("windowControls.minimize")}
              className={classes.icon}
              color="gray"
              onClick={handleMinimize}
              variant="subtle"
            >
              <IconMinus size={16} />
            </ActionIcon>
            <ActionIcon
              aria-label={t("windowControls.maximize")}
              className={classes.icon}
              color="gray"
              onClick={handleMaximize}
              variant="subtle"
            >
              <IconSquare size={16} />
            </ActionIcon>
            <ActionIcon
              aria-label={t("windowControls.close")}
              className={clsx(classes.icon, classes.closed)}
              color="gray"
              onClick={handleClose}
              variant="subtle"
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
        )}
      </Group>
    </Group>
  );
};
