import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { useGameStore } from "@store/game.store";
import { IconDeviceGamepad2, IconDice5Filled, IconMinus, IconSquare, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useShallow } from "zustand/react/shallow";

import classes from "./WindowControls.module.css";

export const WindowControls = () => {
  const gamesList = useGameStore(useShallow((state) => state.gamesList));
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRandomGame = () => {
    const index = Math.floor(Math.random() * gamesList.length);
    const randomGame = gamesList[index];
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
            color="gray"
            onClick={handleGamingMode}
            variant="subtle"
          >
            <IconDeviceGamepad2 size={16} />
          </ActionIcon>
        </Tooltip>
        <ActionIcon aria-label={t("windowControls.minimize")} color="gray" onClick={handleMinimize} variant="subtle">
          <IconMinus size={16} />
        </ActionIcon>
        <ActionIcon aria-label={t("windowControls.maximize")} color="gray" onClick={handleMaximize} variant="subtle">
          <IconSquare size={16} />
        </ActionIcon>
        <ActionIcon aria-label={t("windowControls.close")} color="gray" onClick={handleClose} variant="subtle">
          <IconX size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
};
