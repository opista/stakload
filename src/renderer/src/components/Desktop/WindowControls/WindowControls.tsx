import { ActionIcon, Group, Indicator, Tooltip } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { useNotificationStore } from "@store/notification.store";
import { IconBell, IconDeviceGamepad2, IconDice5Filled, IconMinus, IconSquare, IconX } from "@tabler/icons-react";
import clsx from "clsx";
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

  const handleRandomGame = () => {
    const randomGame = getRandomGame();
    navigate(`/desktop/library/${randomGame._id}`);
  };
  const handleGamingMode = () => navigate("/gaming");
  const handleMinimize = () => window.api.minimizeWindow();
  const handleMaximize = () => window.api.maximizeWindow();
  const handleClose = () => window.api.closeWindow();

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
        <Tooltip label={t("windowControls.gamingMode")}>
          <ActionIcon
            aria-label={t("windowControls.gamingMode")}
            className={classes.icon}
            color="gray"
            onClick={handleGamingMode}
            variant="subtle"
          >
            <IconDeviceGamepad2 size={16} />
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
        {window.api.platform !== "darwin" && (
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
