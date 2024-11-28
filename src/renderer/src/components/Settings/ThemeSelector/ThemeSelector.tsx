import { ColorSwatch, Flex, Group, Text, useMantineTheme } from "@mantine/core";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

import classes from "./ThemeSelector.module.css";

interface ThemeSelectorProps {
  onChange: (color: string) => void;
  value: string;
}

export const ThemeSelector = ({ onChange, value }: ThemeSelectorProps) => {
  const { t } = useTranslation();
  const { colors } = useMantineTheme();

  const options = {
    yellow: colors.yellow["8"],
    orange: colors.orange["8"],
    pink: colors.pink["8"],
    violet: colors.violet["8"],
    blue: colors.blue["8"],
    cyan: colors.cyan["8"],
    lime: colors.lime["8"],
  };

  return (
    <Flex align="center" className={classes.container} justify="space-between">
      <Text className={classes.text}>{t("interfaceSettings.theme")}</Text>
      <Group gap="xs">
        {Object.entries(options).map(([color, hex]) => (
          <ColorSwatch
            className={clsx(classes.button, {
              [classes.active]: value === color,
            })}
            component="button"
            key={color}
            onClick={() => onChange(color)}
            color={hex}
            radius="sm"
            size={20}
          />
        ))}
      </Group>
    </Flex>
  );
};
