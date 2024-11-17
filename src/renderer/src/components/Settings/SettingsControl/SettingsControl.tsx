import { ActionIcon, VisuallyHidden } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SettingsModal } from "../SettingsModal/SettingsModal";
import { SHORTCUT_KEYS } from "@constants/shortcuts";

const shortcut = SHORTCUT_KEYS.SETTINGS.join("+");

export const SettingsControl = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  useHotkeys([[shortcut, open]]);

  return (
    <>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label={t("settings")}
        title={t("shortcutWithValue", { value: shortcut })}
        onClick={open}
      >
        <VisuallyHidden>{t("settings")}</VisuallyHidden>
        <IconSettings style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>

      <SettingsModal onClose={close} opened={opened} />
    </>
  );
};
