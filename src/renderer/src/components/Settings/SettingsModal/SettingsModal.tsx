import { Divider } from "@mantine/core";
import { IconCommand, IconDeviceImac, IconLibrary, IconUser } from "@tabler/icons-react";
import { SettingsAbout } from "../SettingsAbout/SettingsAbout";
import { ShortcutsView } from "../SettingsShortcuts/SettingsShortcuts";
import classes from "./SettingsModal.module.css";
import { Tab, VerticalTabs } from "@components/VerticalTabs/VerticalTabs";
import { SettingsInterface } from "../SettingsInterface/SettingsInterface";
import { SettingsLibrary } from "../SettingsLibrary/SettingsLibrary";
import { ContextModalProps } from "@mantine/modals";

type TabKey = "interface" | "library" | "shortcuts" | "about";

export type SettingsModalProps = {
  defaultTab?: TabKey;
};

export const SettingsModal = ({ id, innerProps }: ContextModalProps<SettingsModalProps>) => {
  const tabs: Tab[] = [
    {
      Content: SettingsInterface,
      Icon: IconDeviceImac,
      key: "interface",
      label: "settingsNavigation.interface",
    },
    {
      Content: () => <SettingsLibrary id={id} />,
      Icon: IconLibrary,
      key: "library",
      label: "settingsNavigation.library",
    },
    {
      Content: ShortcutsView,
      Icon: IconCommand,
      key: "shortcuts",
      label: "settingsNavigation.shortcuts",
    },
    {
      Content: SettingsAbout,
      Icon: IconUser,
      key: "about",
      label: "settingsNavigation.about",
    },
  ];

  return (
    <>
      <Divider></Divider>
      <div className={classes.container}>
        <VerticalTabs tabs={tabs} defaultTab={innerProps?.defaultTab || "interface"} />
      </div>
    </>
  );
};
