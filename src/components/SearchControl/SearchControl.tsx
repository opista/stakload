import {
  BoxProps,
  ElementProps,
  Group,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "./SearchControl.module.css";
import cx from "clsx";
import { spotlight } from "@mantine/spotlight";
import { useTranslation } from "react-i18next";

interface SearchControlProps extends BoxProps, ElementProps<"button"> {}

export const SearchControl = ({ className, ...others }: SearchControlProps) => {
  const { t } = useTranslation();

  return (
    <UnstyledButton
      {...others}
      className={cx(classes.root, className)}
      onClick={spotlight.open}
    >
      <Group gap="xs">
        <IconSearch style={{ width: rem(15), height: rem(15) }} stroke={1.5} />
        <Text className={classes.text}>{t("search")}</Text>
        <Text fw={700} className={classes.shortcut}>
          Ctrl + K
        </Text>
      </Group>
    </UnstyledButton>
  );
};
