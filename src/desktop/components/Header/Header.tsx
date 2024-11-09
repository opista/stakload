import { Divider, Group } from "@mantine/core";
import { SettingsControl } from "../Settings/SettingsControl/SettingsControl";
import { SyncStatus } from "../SyncStatus/SyncStatus";
import { BatteryIndicator } from "../../../components/BatteryIndicator/BatteryIndicator";

export const Header = () => {
  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        TRULAUNCH
        <Group gap="md">
          <SyncStatus />
          <Divider orientation="vertical" size="xs" />
          <BatteryIndicator showPercentage={false} />
          <Divider orientation="vertical" size="xs" />
          <SettingsControl />
        </Group>
      </Group>
    </Group>
  );
};
