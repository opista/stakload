import { Checkbox, CheckboxProps, Divider, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./InterfaceSettingsView.module.css";
import { ThemeSelector } from "../ThemeSelector/ThemeSelector";
import { useInterfaceSettingsStore } from "../../../../store/interface-settings-store";

type FormattedCheckboxProps = {
  checked: boolean;
  label: string;
  onCheckboxChange: (checked: boolean) => void;
};

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
        {t("generalSettings.title")}
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
        {t("timeSettings.title")}
      </Title>
      <FormattedCheckbox
        checked={displayTime}
        label={t("timeSettings.displayTime")}
        onCheckboxChange={setDisplayTime}
      />
      <FormattedCheckbox
        checked={displaySeconds}
        disabled={!displayTime}
        label={t("timeSettings.displaySeconds")}
        onCheckboxChange={setDisplaySeconds}
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
    </>
  );
};
