import { Checkbox, CheckboxProps, Divider, Title } from "@mantine/core";
import { ThemeSelector } from "../ThemeSelector/ThemeSelector";
import classes from "./InterfaceSettingsView.module.css";
import { useInterfaceSettingsStore } from "../../../../store/interface-settings-store";
import { useTranslation } from "react-i18next";

interface FormattedCheckboxProps {
  checked: boolean;
  label: string;
  onCheckboxChange: (checked: boolean) => void;
}

const FormattedCheckbox = ({
  checked,
  label,
  onCheckboxChange,
  ...props
}: FormattedCheckboxProps & CheckboxProps) => (
  <Checkbox
    {...props}
    checked={checked}
    classNames={{
      body: classes.checkboxBody,
      labelWrapper: classes.checkboxLabelWrapper,
      root: classes.checkbox,
    }}
    label={label}
    labelPosition="left"
    onChange={(event) => onCheckboxChange(event.currentTarget.checked)}
  />
);

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
  const { displaySeconds, displayTime, setDisplaySeconds, setDisplayTime } =
    useInterfaceSettingsStore();
  const { t } = useTranslation();

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("interfaceSettings.time")}
      </Title>
      <FormattedCheckbox
        checked={displayTime}
        label={t("interfaceSettings.displayTime")}
        onCheckboxChange={setDisplayTime}
      />
      <FormattedCheckbox
        checked={displaySeconds}
        disabled={!displayTime}
        label={t("interfaceSettings.displaySeconds")}
        onCheckboxChange={setDisplaySeconds}
      />
    </>
  );
};

const BatterySettings = () => {
  const {
    displayBattery,
    displayBatteryPercent,
    setDisplayBattery,
    setDisplayBatteryPercent,
  } = useInterfaceSettingsStore();
  const { t } = useTranslation();

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("interfaceSettings.battery")}
      </Title>
      <FormattedCheckbox
        checked={displayBattery}
        label={t("interfaceSettings.displayBattery")}
        onCheckboxChange={setDisplayBattery}
      />
      <FormattedCheckbox
        checked={displayBatteryPercent}
        disabled={!displayBattery}
        label={t("interfaceSettings.displayBatteryPercentage")}
        onCheckboxChange={setDisplayBatteryPercent}
      />
    </>
  );
};

export const InterfaceSettingsView = () => {
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
