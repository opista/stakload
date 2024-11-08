import { Divider, Group } from "@mantine/core";
import { SettingsControl } from "../Settings/SettingsControl/SettingsControl";
import { SyncStatus } from "../SyncStatus/SyncStatus";
import classes from "./Header.module.css";

export const Header = () => {
  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        TRULAUNCH
        <Group gap="md">
          <SyncStatus />
          <Divider
            className={classes.divider}
            orientation="vertical"
            size="xs"
          />
          <SettingsControl />
        </Group>
      </Group>
    </Group>
  );
};
