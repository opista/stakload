import { AppShell, Divider, Group, ScrollArea, Skeleton } from "@mantine/core";
import { useSettings } from "../../hooks/use-settings";
import SearchControl from "../../components/SearchControl/SearchControl";
import SettingsControl from "../../components/Settings/SettingsControl/SettingsControl";
import Spotlight from "../../components/Spotlight/Spotlight";

export const DesktopView = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm" }}
      padding="md"
    >
      <Spotlight />
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group justify="space-between" style={{ flex: 1 }}>
            TRULAUNCH
            <Group ml="xl" gap="xs" visibleFrom="sm">
              <SettingsControl />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section>
          <SearchControl />
          <Divider my="md" />
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {Array(60)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                h={28}
                mt={index !== 0 ? "sm" : undefined}
                animate={false}
              />
            ))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <div>
          settings: {JSON.stringify(settings, null, "\t")}
          <p className="text-3xl font-bold underline">
            binaryVersion: {window.NL_VERSION}
          </p>
          <p>clientVersion: {window.NL_CVERSION}</p>
        </div>
        <button onClick={() => updateSetting("bar", Math.random())}>
          update
        </button>
      </AppShell.Main>
    </AppShell>
  );
};
