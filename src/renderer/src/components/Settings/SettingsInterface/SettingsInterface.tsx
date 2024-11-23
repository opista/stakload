import { Divider, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { ThemeSelector } from "../ThemeSelector/ThemeSelector";
import classes from "./SettingsInterface.module.css";
import { useInterfaceSettingsStore } from "@store/interface-settings-store";
import { SettingsCheckbox } from "../SettingsCheckbox/SettingsCheckbox";

const GeneralSettings = () => {
  const { theme, setTheme } = useInterfaceSettingsStore();
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
  const { displaySeconds, displayTime, setDisplaySeconds, setDisplayTime } = useInterfaceSettingsStore();
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
    useInterfaceSettingsStore();
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
