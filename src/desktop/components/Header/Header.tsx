import { Divider, Group } from "@mantine/core";
import { SettingsControl } from "../Settings/SettingsControl/SettingsControl";
import { SyncStatus } from "../SyncStatus/SyncStatus";
import { BatteryIndicator } from "../../../components/BatteryIndicator/BatteryIndicator";
import { Clock } from "../../../components/Clock/Clock";

export const Header = () => {
  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        TRULAUNCH
        <Group gap="md">
          <Divider orientation="vertical" size="xs" />
          <SyncStatus />
          <Divider orientation="vertical" size="xs" />
          <Clock />
          <Divider orientation="vertical" size="xs" />
          <BatteryIndicator showPercentage={false} />
          <Divider orientation="vertical" size="xs" />
          <SettingsControl />
        </Group>
      </Group>
    </Group>
  );
};
