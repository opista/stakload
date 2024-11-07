import { ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SettingsModal } from "../SettingsModal/SettingsModal";

export const SettingsControl = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  return (
    <>
      <Tooltip label={t("settings")}>
        <ActionIcon
          variant="default"
          size="lg"
          radius="md"
          aria-label={t("settings")}
          onClick={open}
        >
          <IconSettings style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>

      <SettingsModal onClose={close} opened={opened} />
    </>
  );
};
