import { IconSearch } from "@tabler/icons-react";
import cx from "clsx";
import {
  BoxProps,
  ElementProps,
  Group,
  Kbd,
  rem,
  Text,
  UnstyledButton,
} from "@mantine/core";
import classes from "./SearchControl.module.css";
import { spotlight } from "@mantine/spotlight";

interface SearchControlProps extends BoxProps, ElementProps<"button"> {}

export default function SearchControl({
  className,
  ...others
}: SearchControlProps) {
  const key = window.NL_OS === "Darwin" ? "⌘" : "Ctrl";
  return (
    <UnstyledButton
      {...others}
      className={cx(classes.root, className)}
      onClick={spotlight.open}
    >
      <Group gap="xs">
        <IconSearch style={{ width: rem(15), height: rem(15) }} stroke={1.5} />
        <Text fz="sm" c="dimmed" pr={80}>
          Search
        </Text>
        <Text fw={700} className={classes.shortcut}>
          {key} + K
        </Text>
      </Group>
    </UnstyledButton>
  );
}
