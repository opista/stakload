import { Divider, Group } from "@mantine/core";

import { GameSync } from "../GameSync/GameSync";
import { PowerControl } from "@components/Power/PowerControl/PowerControl";
import { BatteryIndicator } from "@components/BatteryIndicator/BatteryIndicator";
import { Clock } from "@components/Clock/Clock";
import { Logo } from "@components/Logo/Logo";
import { SettingsControl } from "@components/Settings/SettingsControl/SettingsControl";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { useShallow } from "zustand/react/shallow";
import { NetworkIndicator } from "@components/NetworkIndicator/NetworkIndicator";

export const Header = () => {
  const { displayBattery, displayBatteryPercent, displayNetwork, displayTime, displaySeconds } =
    useInterfaceSettingsStore(
      useShallow((state) => ({
        displayBattery: state.displayBattery,
        displayBatteryPercent: state.displayBatteryPercent,
        displayNetwork: state.displayNetwork,
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
          {displayNetwork && (
            <>
              <Divider orientation="vertical" size="xs" />
              <NetworkIndicator />
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
