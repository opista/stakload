import { ActionIcon, Tooltip } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";

export default function SettingsControl() {
  return (
    <Tooltip label="Settings">
      <ActionIcon variant="default" size="lg" radius="md" aria-label="Settings">
        <IconAdjustments style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}
