import { ActionIcon, VisuallyHidden } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SettingsModal } from "../SettingsModal/SettingsModal";

export const SettingsControl = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  useHotkeys([["Q", open]]);

  return (
    <>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label={t("settings")}
        title={t("shortcutWithValue", { value: "Q" })}
        onClick={open}
      >
        <VisuallyHidden>{t("settings")}</VisuallyHidden>
        <IconSettings style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>

      <SettingsModal onClose={close} opened={opened} />
    </>
  );
};
