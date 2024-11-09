import { Divider, Modal } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./SettingsModal.module.css";
import {
  IconCommand,
  IconDeviceImac,
  IconLibrary,
  IconUser,
} from "@tabler/icons-react";
import { InterfaceSettingsView } from "../InterfaceSettingsView/InterfaceSettingsView";
import { AboutView } from "../AboutView/AboutView";
import { ShortcutsView } from "../ShortcutsView/ShortcutsView";
import { VerticalTabs } from "../../../../components/VerticalTabs/VerticalTabs";

type SettingsModalProps = {
  onClose: () => void;
  opened: boolean;
};

export const SettingsModal = ({ onClose, opened }: SettingsModalProps) => {
  const { t } = useTranslation();

  const tabs = [
    {
      content: <InterfaceSettingsView />,
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
      content: <AboutView />,
      icon: IconUser,
      key: "about",
      label: t("settingsNavigation.about"),
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      padding="sm"
      size="lg"
      title={t("settings")}
    >
      <Divider></Divider>
      <div className={classes.container}>
        <VerticalTabs tabs={tabs} defaultTab={tabs[0].key} />
      </div>
    </Modal>
  );
};
