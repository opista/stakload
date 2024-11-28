import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { useHotkeys } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { settingsModalInnerProps } from "../SettingsModal/SettingsModalInnerProps";

const shortcut = SHORTCUT_KEYS.SETTINGS.join("+");

export const SettingsControl = () => {
  const { t } = useTranslation();

  const openSettingsModal = () => {
    modals.closeAll();
    modals.openContextModal({
      modal: "settings",
      title: t("settings"),
      innerProps: settingsModalInnerProps,
    });
  };

  useHotkeys([[shortcut, openSettingsModal]]);

  return (
    <ActionIcon
      aria-label={t("settings")}
      icon={IconSettings}
      onClick={openSettingsModal}
      size="lg"
      title={t("shortcutWithValue", { value: shortcut })}
    />
  );
};
