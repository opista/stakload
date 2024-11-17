import { ActionIcon, VisuallyHidden } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { modals } from "@mantine/modals";
import { settingsModalInnerProps } from "../SettingsModal/SettingsModalInnerProps";

const shortcut = SHORTCUT_KEYS.SETTINGS.join("+");

export const SettingsControl = () => {
  const { t } = useTranslation();

  const openSettingsModal = () =>
    modals.openContextModal({
      modal: "settings",
      title: t("settings"),
      innerProps: settingsModalInnerProps,
    });

  useHotkeys([[shortcut, openSettingsModal]]);

  return (
    <ActionIcon
      variant="default"
      size="lg"
      aria-label={t("settings")}
      title={t("shortcutWithValue", { value: shortcut })}
      onClick={openSettingsModal}
    >
      <VisuallyHidden>{t("settings")}</VisuallyHidden>
      <IconSettings style={{ width: "70%", height: "70%" }} stroke={1.5} />
    </ActionIcon>
  );
};
