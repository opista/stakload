import { Group } from "@mantine/core";
import { SettingsControl } from "../Settings/SettingsControl/SettingsControl";

export const Header = () => {
  return (
    <Group h="100%" px="md">
      <Group justify="space-between" style={{ flex: 1 }}>
        TRULAUNCH
        <Group ml="xl" gap="xs" visibleFrom="sm">
          <SettingsControl />
        </Group>
      </Group>
    </Group>
  );
};
