import { Checkbox, CheckboxProps, Tooltip } from "@mantine/core";
import classes from "./SettingsCheckbox.module.css";
import { IconInfoSquareRounded } from "@tabler/icons-react";

interface SettingsCheckboxProps {
  checked: boolean;
  label: string;
  labelInfo?: string;
  onCheckboxChange: (checked: boolean) => void;
}

export const SettingsCheckbox = ({
  checked,
  label,
  labelInfo,
  onCheckboxChange,
  ...props
}: SettingsCheckboxProps & CheckboxProps) => (
  <Checkbox
    {...props}
    checked={checked}
    classNames={{
      body: classes.checkboxBody,
      labelWrapper: classes.checkboxLabelWrapper,
      root: classes.checkbox,
    }}
    label={
      <>
        {label}
        {labelInfo ? (
          <Tooltip
            className={classes.infoTooltip}
            label={labelInfo}
            multiline
            transitionProps={{ duration: 200 }}
            withArrow
          >
            <IconInfoSquareRounded className={classes.infoIcon} />
          </Tooltip>
        ) : undefined}
      </>
    }
    labelPosition="left"
    onChange={(event) => onCheckboxChange(event.currentTarget.checked)}
  />
);
