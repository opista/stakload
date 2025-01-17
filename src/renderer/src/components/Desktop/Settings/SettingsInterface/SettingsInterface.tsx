import { UIMode } from "@contracts/store/interface-settings";
import { Divider, Title } from "@mantine/core";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { SettingsCheckbox } from "../SettingsCheckbox/SettingsCheckbox";
import { SettingsSelect } from "../SettingsSelect/SettingsSelect";
import { ThemeSelector } from "../ThemeSelector/ThemeSelector";
import classes from "./SettingsInterface.module.css";

const GeneralSettings = () => {
  const { defaultUI, setDefaultUI, theme, setTheme } = useInterfaceSettingsStore(
    useShallow((state) => ({
      defaultUI: state.defaultUI,
      setDefaultUI: state.setDefaultUI,
      theme: state.theme,
      setTheme: state.setTheme,
    })),
  );
  const { t } = useTranslation();

  const uiOptions: { label: string; value: UIMode }[] = [
    {
      label: t("settings.interface.desktopMode"),
      value: "desktop",
    },
    {
      label: t("settings.interface.gamingMode"),
      value: "gaming",
    },
  ];

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("settings.interface.general")}
      </Title>
      <ThemeSelector onChange={setTheme} value={theme} />
      <SettingsSelect
        data={uiOptions}
        label={t("settings.interface.defaultUI")}
        onChange={(value) => setDefaultUI(value)}
        value={defaultUI}
      />
    </>
  );
};

const TimeSettings = () => {
  const { displaySeconds, displayTime, setDisplaySeconds, setDisplayTime } = useInterfaceSettingsStore(
    useShallow((state) => ({
      displaySeconds: state.displaySeconds,
      displayTime: state.displayTime,
      setDisplaySeconds: state.setDisplaySeconds,
      setDisplayTime: state.setDisplayTime,
    })),
  );
  const { t } = useTranslation();

  const onSetDisplayTime = (checked: boolean) => {
    setDisplayTime(checked);

    if (!checked) {
      setDisplaySeconds(checked);
    }
  };

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("settings.interface.time.title")}
      </Title>
      <SettingsCheckbox
        checked={displayTime}
        label={t("settings.interface.time.displayTime")}
        onCheckboxChange={onSetDisplayTime}
      />
      <SettingsCheckbox
        checked={displaySeconds}
        disabled={!displayTime}
        label={t("settings.interface.time.displaySeconds")}
        onCheckboxChange={setDisplaySeconds}
      />
    </>
  );
};

const BatterySettings = () => {
  const { displayBattery, displayBatteryPercent, setDisplayBattery, setDisplayBatteryPercent } =
    useInterfaceSettingsStore(
      useShallow((state) => ({
        displayBattery: state.displayBattery,
        displayBatteryPercent: state.displayBatteryPercent,
        setDisplayBattery: state.setDisplayBattery,
        setDisplayBatteryPercent: state.setDisplayBatteryPercent,
      })),
    );
  const { t } = useTranslation();

  const onSetDisplayBattery = (checked: boolean) => {
    setDisplayBattery(checked);

    if (!checked) {
      setDisplayBatteryPercent(checked);
    }
  };

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("settings.interface.battery.title")}
      </Title>
      <SettingsCheckbox
        checked={displayBattery}
        label={t("settings.interface.battery.displayBattery")}
        onCheckboxChange={onSetDisplayBattery}
      />
      <SettingsCheckbox
        checked={displayBatteryPercent}
        disabled={!displayBattery}
        label={t("settings.interface.battery.displayBatteryPercentage")}
        onCheckboxChange={setDisplayBatteryPercent}
      />
    </>
  );
};

const NetworkSettings = () => {
  const { t } = useTranslation();
  const { displayNetwork, setDisplayNetwork } = useInterfaceSettingsStore(
    useShallow((state) => ({
      displayNetwork: state.displayNetwork,
      setDisplayNetwork: state.setDisplayNetwork,
    })),
  );
  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("settings.interface.network.title")}
      </Title>
      <SettingsCheckbox
        checked={displayNetwork}
        label={t("settings.interface.network.displayNetworkStatus")}
        onCheckboxChange={setDisplayNetwork}
      />
    </>
  );
};

export const SettingsInterface = () => {
  return (
    <>
      <GeneralSettings />
      <Divider className={classes.divider} />
      <TimeSettings />
      <Divider className={classes.divider} />
      <BatterySettings />
      <Divider className={classes.divider} />
      <NetworkSettings />
    </>
  );
};
