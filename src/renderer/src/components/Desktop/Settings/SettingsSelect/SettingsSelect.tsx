import { Select, SelectProps } from "@mantine/core";

import classes from "./SettingsSelect.module.css";

type SettingsSelectProps = SelectProps & {
  onChange: (value: string) => void;
};

export const SettingsSelect = ({ onChange, ...props }: SettingsSelectProps) => {
  return (
    <Select
      allowDeselect={false}
      classNames={{
        input: classes.input,
        label: classes.label,
        root: classes.root,
      }}
      onChange={(value) => onChange?.(value as string)}
      {...props}
      inputSize="xs"
      withCheckIcon={false}
    />
  );
};
