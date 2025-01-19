import { SHORTCUT_KEYS } from "@constants/shortcuts";
import { BoxProps, ElementProps, Group, Text, UnstyledButton } from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import clsx from "clsx";

import classes from "./SearchButton.module.css";

type SearchButtonProps = BoxProps & ElementProps<"button">;

export const SearchButton = ({ className, disabled, ...others }: SearchButtonProps) => {
  return (
    <UnstyledButton
      {...others}
      className={clsx(classes.root, className, { [classes.disabled]: disabled })}
      disabled={disabled}
      onClick={spotlight.open}
    >
      <Group gap="xs">
        <IconSearch className={classes.icon} stroke={1.5} />
        <Text className={classes.text}>Search</Text>
        <Text className={clsx(classes.shortcut, { [classes.disabled]: disabled })}>
          {SHORTCUT_KEYS.SEARCH.join(" + ")}
        </Text>
      </Group>
    </UnstyledButton>
  );
};
