import { Tab, VerticalTabs } from "@components/VerticalTabs/VerticalTabs";
import { Divider } from "@mantine/core";
import { ContextModalProps } from "@mantine/modals";
import { IconBell, IconCommand, IconDeviceImac, IconLibrary, IconUser } from "@tabler/icons-react";

import { SettingsAbout } from "../SettingsAbout/SettingsAbout";
import { SettingsInterface } from "../SettingsInterface/SettingsInterface";
import { SettingsLibrary } from "../SettingsLibrary/SettingsLibrary";
import { SettingsNotification } from "../SettingsNotification/SettingsNotification";
import { ShortcutsView } from "../SettingsShortcuts/SettingsShortcuts";
import classes from "./SettingsModal.module.css";

type TabKey = "interface" | "library" | "shortcuts" | "about";

export type SettingsModalProps = {
  defaultTab?: TabKey;
};

export const SettingsModal = ({ id, innerProps }: ContextModalProps<SettingsModalProps>) => {
  const tabs: Tab[] = [
    {
      content: SettingsInterface,
      icon: IconDeviceImac,
      key: "interface",
      label: "settingsNavigation.interface",
    },
    {
      content: () => <SettingsLibrary id={id} />,
      icon: IconLibrary,
      key: "library",
      label: "settingsNavigation.library",
    },
    {
      content: () => <SettingsNotification />,
      icon: IconBell,
      key: "notifications",
      label: "settingsNavigation.notifications",
    },
    {
      content: ShortcutsView,
      icon: IconCommand,
      key: "shortcuts",
      label: "settingsNavigation.shortcuts",
    },
    {
      content: SettingsAbout,
      icon: IconUser,
      key: "about",
      label: "settingsNavigation.about",
    },
  ];

  return (
    <>
      <Divider></Divider>
      <div className={classes.container}>
        {/* TODO - Make vertical tabs sticky on scroll */}
        <VerticalTabs defaultTab={innerProps?.defaultTab || "interface"} tabs={tabs} />
      </div>
    </>
  );
};
