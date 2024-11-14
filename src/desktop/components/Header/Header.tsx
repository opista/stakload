import { Button, Divider, Group } from "@mantine/core";
import { BatteryIndicator } from "../../../components/BatteryIndicator/BatteryIndicator";
import { Clock } from "../../../components/Clock/Clock";
import { Logo } from "../../../components/Logo/Logo";
import { SettingsControl } from "../Settings/SettingsControl/SettingsControl";
import { useInterfaceSettingsStore } from "../../../store/interface-settings-store";
import { ApplicationControl } from "../../../components/ApplicationControl/ApplicationControl";
import { GameSync } from "../GameSync/GameSync";
import { db } from "../../../database";

import { v4 as uuid } from "uuid";

export const Header = () => {
  const { displayBattery, displayBatteryPercent, displayTime, displaySeconds } =
    useInterfaceSettingsStore();

  // TODO, remove this is temporary
  async function addGame() {
    try {
      // Add the new friend!
      await db.games.add({
        id: uuid(),
        platform: "steam",
        gameId: "",
        metadataSyncedAt: 0,
        name: "Foobar",
      });
    } catch (error) {
      console.log(`Failed to add: ${error}`);
    }
  }

  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        <Logo />
        <Group gap="md">
          <Button onClick={addGame}>Click me</Button>

          <Divider orientation="vertical" size="xs" />
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
            <ApplicationControl />
          </Group>
        </Group>
      </Group>
    </Group>
  );
};
