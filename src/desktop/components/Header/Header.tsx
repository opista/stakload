import { Divider, Group } from "@mantine/core";
import { SettingsControl } from "../Settings/SettingsControl/SettingsControl";
import { SyncStatus } from "../SyncStatus/SyncStatus";
import { BatteryIndicator } from "../../../components/BatteryIndicator/BatteryIndicator";
import { Clock } from "../../../components/Clock/Clock";
import { Logo } from "../../../components/Logo/Logo";
import { useTimeSettings } from "../../../hooks/use-time-settings";

export const Header = () => {
  const { timeSettings } = useTimeSettings();

  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        <Logo />
        <Group gap="md">
          <Divider orientation="vertical" size="xs" />
          <SyncStatus />
          {timeSettings.displayTime && (
            <>
              <Divider orientation="vertical" size="xs" />
              <Clock showSeconds={timeSettings.displaySeconds} />
            </>
          )}
          <Divider orientation="vertical" size="xs" />
          <BatteryIndicator showPercentage={false} />
          <Divider orientation="vertical" size="xs" />
          <SettingsControl />
        </Group>
      </Group>
    </Group>
  );
};
