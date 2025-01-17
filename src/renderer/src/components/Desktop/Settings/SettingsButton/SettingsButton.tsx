import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { ActionIcon } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { settingsModalInnerProps } from "../SettingsModal/SettingsModalInnerProps";
import classes from "./SettingsButton.module.css";

const shortcut = SHORTCUT_KEYS.SETTINGS.join("+");

export const SettingsButton = () => {
  const { t } = useTranslation();

  const openSettingsModal = () => {
    modals.closeAll();
    modals.openContextModal({
      modal: "settings",
      title: t("settingsButton.title"),
      innerProps: settingsModalInnerProps,
    });
  };

  useHotkeys([[shortcut, openSettingsModal]]);

  return (
    <ActionIcon
      aria-label={t("settingsButton.title")}
      className={classes.actionIcon}
      onClick={openSettingsModal}
      title={t("settingsButton.shortcut", { value: shortcut })}
    >
      <IconSettings className={classes.icon} stroke={1} />
    </ActionIcon>
  );
};
