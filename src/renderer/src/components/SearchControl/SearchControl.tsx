import { BoxProps, ElementProps, Group, Text, UnstyledButton, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { clsx } from "clsx";
import { spotlight } from "@mantine/spotlight";
import { useTranslation } from "react-i18next";
import classes from "./SearchControl.module.css";
import { SHORTCUT_KEYS } from "@constants/shortcuts";

interface SearchControlProps extends BoxProps, ElementProps<"button"> {}

export const SearchControl = ({ className, disabled, ...others }: SearchControlProps) => {
  const { t } = useTranslation();

  return (
    <UnstyledButton
      {...others}
      className={clsx(classes.root, className, { [classes.disabled]: disabled })}
      disabled={disabled}
      onClick={spotlight.open}
    >
      <Group gap="xs">
        <IconSearch style={{ width: rem(15), height: rem(15) }} stroke={1.5} />
        <Text className={classes.text}>{t("search")}</Text>
        <Text className={clsx(classes.shortcut, { [classes.disabled]: disabled })}>
          {SHORTCUT_KEYS.SEARCH.join(" + ")}
        </Text>
      </Group>
    </UnstyledButton>
  );
};
