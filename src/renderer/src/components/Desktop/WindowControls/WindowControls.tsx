import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconDeviceGamepad2, IconMinus, IconSquare, IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import classes from "./WindowControls.module.css";

export const WindowControls = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGamingMode = () => navigate("/gaming");
  const handleMinimize = () => window.api.minimizeWindow();
  const handleMaximize = () => window.api.maximizeWindow();
  const handleClose = () => window.api.closeWindow();

  return (
    <Group className={classes.container}>
      <Group className={classes.inner} gap="xs">
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
