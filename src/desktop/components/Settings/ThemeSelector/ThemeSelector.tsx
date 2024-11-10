import { Group, ColorSwatch, useMantineTheme, Flex, Text } from "@mantine/core";
import clsx from "clsx";
import classes from "./ThemSelector.module.css";
import { useTranslation } from "react-i18next";

type ThemeSelectorProps = {
  onChange: (color: string) => void;
  value: string;
};

export const ThemeSelector = ({ onChange, value }: ThemeSelectorProps) => {
  const { t } = useTranslation();
  const { colors } = useMantineTheme();

  const options = [
    colors.yellow["8"],
    colors.orange["8"],
    colors.red["8"],
    colors.pink["8"],
    colors.violet["8"],
    colors.blue["8"],
    colors.cyan["8"],
    colors.lime["8"],
  ];

  return (
    <Flex align="center" justify="space-between">
      <Text>{t("generalSettings.theme")}</Text>
      <Group gap={0}>
        {options.map((option) => (
          <ColorSwatch
            className={clsx(classes.button, {
              [classes.active]: value === option,
            })}
            classNames={{ childrenOverlay: classes.swatch }}
            component="button"
            onClick={() => onChange(option)}
            style={{ color: "#fff", cursor: "pointer" }}
            color={option}
            radius="sm"
          />
        ))}
      </Group>
    </Flex>
  );
};
