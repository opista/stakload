import {
  Checkbox,
  ColorPicker,
  DEFAULT_THEME,
  Divider,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./InterfaceSettingsView.module.css";
import { useTimeSettings } from "../../../../hooks/use-time-settings";
import { useState } from "react";

type FormattedCheckboxProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

const FormattedCheckbox = ({
  checked,
  label,
  onChange,
}: FormattedCheckboxProps) => (
  <Checkbox
    checked={checked}
    classNames={{ body: classes.checkboxBody, root: classes.checkbox }}
    label={label}
    labelPosition="left"
    onChange={(event) => onChange(event.currentTarget.checked)}
  />
);

const GeneralSettings = () => {
  const { t } = useTranslation();
  const { colors } = useMantineTheme();
  const [color, setColor] = useState(colors.orange["8"]);

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("generalSettings.title")}
      </Title>
      {color}
      <ColorPicker
        classNames={{}}
        format="hex"
        value={color}
        onChange={setColor}
        withPicker={false}
        swatches={[
          colors.red["8"],
          colors.pink["8"],
          colors.blue["8"],
          colors.green["8"],
          colors.orange["8"],
        ]}
      />
    </>
  );
};

const TimeSettings = () => {
  const { timeSettings, updateTimeSetting } = useTimeSettings();
  const { t } = useTranslation();

  return (
    <>
      <Title className={classes.title} order={2} size="h3">
        {t("timeSettings.title")}
      </Title>
      <FormattedCheckbox
        checked={timeSettings.displayTime}
        label={t("timeSettings.displayTime")}
        onChange={(checked) => updateTimeSetting("displayTime", checked)}
      />
      <FormattedCheckbox
        checked={timeSettings.displaySeconds}
        label={t("timeSettings.displaySeconds")}
        onChange={(checked) => updateTimeSetting("displaySeconds", checked)}
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
