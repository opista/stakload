import { useHotkeys } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { modals } from "@mantine/modals";
import { settingsModalInnerProps } from "../SettingsModal/SettingsModalInnerProps";
import { ActionIcon } from "@components/ActionIcon/ActionIcon";

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
