import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export default function SettingsControl() {
  const { t } = useTranslation();

  const onSettingsClick = () => {
    console.log("Open settings"); // TODO
  };

  return (
    <Tooltip label={t("settings")}>
      <ActionIcon
        variant="default"
        size="lg"
        radius="md"
        aria-label={t("settings")}
        onClick={onSettingsClick}
      >
        <IconSettings style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}
