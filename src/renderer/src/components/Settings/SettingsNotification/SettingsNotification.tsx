import { Divider, Title } from "@mantine/core";
import { SettingsCheckbox } from "../SettingsCheckbox/SettingsCheckbox";
import { useTranslation } from "react-i18next";
import classes from "./SettingsNotification.module.css";
import { useNotificationSettingsStore } from "@store/notification-settings.store";
import { useShallow } from "zustand/react/shallow";
import { SettingsSelect } from "../SettingsSelect/SettingsSelect";

const batteryOptions = [
  { label: "Never", value: "0" },
  { label: "5%", value: "5" },
  { label: "10%", value: "10" },
  { label: "15%", value: "15" },
  { label: "20%", value: "20" },
];

const SystemSettings = () => {
  const { t } = useTranslation();
  const { lowBattery, networkDisconnect, setLowBattery, setNetworkDisconnect } = useNotificationSettingsStore(
    useShallow((state) => ({
      lowBattery: state.lowBattery,
      networkDisconnect: state.networkDisconnect,
      setLowBattery: state.setLowBattery,
      setNetworkDisconnect: state.setNetworkDisconnect,
    })),
  );

  /**
   * TODO - wire this up to actually trigger
   * an OS-level notification
   */

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("notificationSettings.system")}
      </Title>
      <SettingsCheckbox
        checked={networkDisconnect}
        label={t("notificationSettings.notifyOnNetworkDisconnect")}
        onCheckboxChange={setNetworkDisconnect}
      />
      <SettingsSelect
        data={batteryOptions}
        label={t("notificationSettings.notifyLowBattery")}
        onChange={(value) => setLowBattery(Number(value))}
        value={String(lowBattery)}
      />
    </>
  );
};

export const SettingsNotification = () => {
  return (
    <>
      <SystemSettings />
      <Divider className={classes.divider} />
    </>
  );
};
