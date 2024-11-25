import { Divider, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ThemeSelector } from "../ThemeSelector/ThemeSelector";
import classes from "./SettingsInterface.module.css";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { SettingsCheckbox } from "../SettingsCheckbox/SettingsCheckbox";
import { useShallow } from "zustand/react/shallow";

const GeneralSettings = () => {
  const { theme, setTheme } = useInterfaceSettingsStore(
    useShallow((state) => ({ theme: state.theme, setTheme: state.setTheme })),
  );
  const { t } = useTranslation();

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("interfaceSettings.general")}
      </Title>
      <ThemeSelector value={theme} onChange={setTheme} />
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

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("interfaceSettings.time")}
      </Title>
      <SettingsCheckbox
        checked={displayTime}
        label={t("interfaceSettings.displayTime")}
        onCheckboxChange={setDisplayTime}
      />
      <SettingsCheckbox
        checked={displaySeconds}
        disabled={!displayTime}
        label={t("interfaceSettings.displaySeconds")}
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

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("interfaceSettings.battery")}
      </Title>
      <SettingsCheckbox
        checked={displayBattery}
        label={t("interfaceSettings.displayBattery")}
        onCheckboxChange={setDisplayBattery}
      />
      <SettingsCheckbox
        checked={displayBatteryPercent}
        disabled={!displayBattery}
        label={t("interfaceSettings.displayBatteryPercentage")}
        onCheckboxChange={setDisplayBatteryPercent}
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
    </>
  );
};
