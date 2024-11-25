import { Divider, Group } from "@mantine/core";

import { GameSync } from "../GameSync/GameSync";
import { PowerControl } from "@components/Power/PowerControl/PowerControl";
import { BatteryIndicator } from "@components/BatteryIndicator/BatteryIndicator";
import { Clock } from "@components/Clock/Clock";
import { Logo } from "@components/Logo/Logo";
import { SettingsControl } from "@components/Settings/SettingsControl/SettingsControl";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { useShallow } from "zustand/react/shallow";

export const Header = () => {
  const { displayBattery, displayBatteryPercent, displayTime, displaySeconds } = useInterfaceSettingsStore(
    useShallow((state) => ({
      displayBattery: state.displayBattery,
      displayBatteryPercent: state.displayBatteryPercent,
      displayTime: state.displayTime,
      displaySeconds: state.displaySeconds,
    })),
  );

  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        <Logo />
        <Group gap="md">
          <GameSync />
          {displayTime && (
            <>
              <Divider orientation="vertical" size="xs" />
              <Clock showSeconds={displaySeconds} />
            </>
          )}
          {displayBattery && (
            <>
              <Divider orientation="vertical" size="xs" />
              <BatteryIndicator showPercentage={displayBatteryPercent} />
            </>
          )}
          <Divider orientation="vertical" size="xs" />
          <Group gap="xs">
            <SettingsControl />
            <PowerControl />
          </Group>
        </Group>
      </Group>
    </Group>
  );
};
