import { Divider, Modal, rem, Tabs } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./SettingsModal.module.css";
import {
  IconCommand,
  IconDeviceImac,
  IconLibrary,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { InterfaceSettingsView } from "../InterfaceSettingsView/InterfaceSettingsView";
import { AboutSettingsView } from "../AboutSettingsView/AboutSettingsView";
import { ShortcutsView } from "../ShortcutsView/ShortcutsView";

type SettingsModalProps = {
  onClose: () => void;
  opened: boolean;
};

export const SettingsModal = ({ onClose, opened }: SettingsModalProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string | null>("interface");

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Modal
      centered
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
        <Tabs
          activateTabWithKeyboard
          className={classes.tabs}
          keepMounted={false}
          onChange={setActiveTab}
          orientation="vertical"
          value={activeTab}
        >
          <Tabs.List>
            <Tabs.Tab
              leftSection={<IconDeviceImac style={iconStyle} />}
              value="interface"
            >
              {t("settingsNavigation.interface")}
            </Tabs.Tab>
            <Tabs.Tab
              leftSection={<IconLibrary style={iconStyle} />}
              value="library"
            >
              {t("settingsNavigation.library")}
            </Tabs.Tab>
            <Tabs.Tab
              leftSection={<IconCommand style={iconStyle} />}
              value="shortcuts"
            >
              {t("settingsNavigation.shortcuts")}
            </Tabs.Tab>
            <Tabs.Tab
              leftSection={<IconUser style={iconStyle} />}
              value="about"
            >
              {t("settingsNavigation.about")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel className={classes.tabPanel} value="interface">
            <InterfaceSettingsView />
          </Tabs.Panel>
          <Tabs.Panel className={classes.tabPanel} value="library">
            Messages tab content
          </Tabs.Panel>
          <Tabs.Panel className={classes.tabPanel} value="shortcuts">
            <ShortcutsView />
          </Tabs.Panel>
          <Tabs.Panel className={classes.tabPanel} value="about">
            <AboutSettingsView />
          </Tabs.Panel>
        </Tabs>
      </div>
    </Modal>
  );
};
