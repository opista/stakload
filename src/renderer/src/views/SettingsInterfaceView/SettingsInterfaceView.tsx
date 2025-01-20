import { UIMode } from "@contracts/store/interface-settings";
import { Divider, Title } from "@mantine/core";
import { useInterfaceSettingsStore } from "@store/interface-settings.store";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { SettingsCheckbox } from "../../components/Desktop/Settings/SettingsCheckbox/SettingsCheckbox";
import { SettingsSelect } from "../../components/Desktop/Settings/SettingsSelect/SettingsSelect";
import { ThemeSelector } from "../../components/Desktop/Settings/ThemeSelector/ThemeSelector";
import classes from "./SettingsInterfaceView.module.css";

const GeneralSettings = () => {
  const { defaultUI, setDefaultUI, theme, setTheme } = useInterfaceSettingsStore(
    useShallow((state) => ({
      defaultUI: state.defaultUI,
      setDefaultUI: state.setDefaultUI,
      setTheme: state.setTheme,
      theme: state.theme,
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

const BatterySettings = () => {
  const { displayBattery, setDisplayBattery } = useInterfaceSettingsStore(
    useShallow((state) => ({
      displayBattery: state.displayBattery,
      setDisplayBattery: state.setDisplayBattery,
    })),
  );
  const { t } = useTranslation();

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("settings.interface.battery.title")}
      </Title>
      <SettingsCheckbox
        checked={displayBattery}
        label={t("settings.interface.battery.displayBattery")}
        onCheckboxChange={setDisplayBattery}
      />
    </>
  );
};

export const SettingsInterfaceView = () => {
  return (
    <div className={classes.container}>
      <GeneralSettings />
      <Divider className={classes.divider} />
      <BatterySettings />
    </div>
  );
};
