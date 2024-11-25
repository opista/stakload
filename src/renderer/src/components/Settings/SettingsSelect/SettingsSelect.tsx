import { Select, SelectProps } from "@mantine/core";
import classes from "./SettingsSelect.module.css";

type SettingsSelectProps = SelectProps & {};

export const SettingsSelect = (props: SettingsSelectProps) => {
  return (
    <Select
      allowDeselect={false}
      classNames={{
        label: classes.label,
        root: classes.root,
        input: classes.input,
      }}
      {...props}
      inputSize="xs"
      withCheckIcon={false}
    />
  );
};
