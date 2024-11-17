import { Divider, Modal } from "@mantine/core";
import { IconCommand, IconDeviceImac, IconLibrary, IconUser } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SettingsAbout } from "../SettingsAbout/SettingsAbout";
import { ShortcutsView } from "../SettingsShortcuts/SettingsShortcuts";
import classes from "./SettingsModal.module.css";
import { VerticalTabs } from "@components/VerticalTabs/VerticalTabs";
import { SettingsInterface } from "../SettingsInterface/SettingsInterface";

interface SettingsModalProps {
  onClose: () => void;
  opened: boolean;
}

export const SettingsModal = ({ onClose, opened }: SettingsModalProps) => {
  const { t } = useTranslation();

  const tabs = [
    {
      content: <SettingsInterface />,
      icon: IconDeviceImac,
      key: "interface",
      label: t("settingsNavigation.interface"),
    },
    {
      content: <></>,
      icon: IconLibrary,
      key: "library",
      label: t("settingsNavigation.library"),
    },
    {
      content: <ShortcutsView />,
      icon: IconCommand,
      key: "shortcuts",
      label: t("settingsNavigation.shortcuts"),
    },
    {
      content: <SettingsAbout />,
      icon: IconUser,
      key: "about",
      label: t("settingsNavigation.about"),
    },
  ];

  return (
    <Modal onClose={onClose} opened={opened} padding="sm" size="lg" title={t("settings")} withCloseButton>
      <Divider></Divider>
      <div className={classes.container}>
        <VerticalTabs tabs={tabs} defaultTab={tabs[0].key} />
      </div>
    </Modal>
  );
};
