import { Divider, Group } from "@mantine/core";
import { SettingsControl } from "../Settings/SettingsControl/SettingsControl";
import { SyncStatus } from "../SyncStatus/SyncStatus";
import { BatteryIndicator } from "../../../components/BatteryIndicator/BatteryIndicator";
import { Clock } from "../../../components/Clock/Clock";
import { Logo } from "../../../components/Logo/Logo";
import { useInterfaceSettingsStore } from "../../../store/interface-settings-store";

export const Header = () => {
  const { displayBattery, displayBatteryPercent, displayTime, displaySeconds } =
    useInterfaceSettingsStore();

  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        <Logo />
        <Group gap="md">
          <Divider orientation="vertical" size="xs" />
          <SyncStatus />
          {displayTime && (
            <>
              <Divider orientation="vertical" size="xs" />
              <Clock showSeconds={displaySeconds} />
            </>
          )}
          <Divider orientation="vertical" size="xs" />
          {displayBattery && (
            <>
              <BatteryIndicator showPercentage={displayBatteryPercent} />
            </>
          )}
          <Divider orientation="vertical" size="xs" />
          <SettingsControl />
        </Group>
      </Group>
    </Group>
  );
};
