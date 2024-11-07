import {
  MantineColorScheme,
  Select,
  useMantineColorScheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

export const InterfaceSettingsView = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();

  const onChange = (value: string | null) => {
    if (value) setColorScheme(value as MantineColorScheme);
  };

  const options = [
    {
      label: t("theme.dark"),
      value: "dark",
    },
    {
      label: t("theme.light"),
      value: "light",
    },
    {
      label: t("theme.system"),
      value: "auto",
    },
  ];

  return (
    <>
      <Select
        label={t("theme.desktopColorScheme")}
        data={options}
        onChange={onChange}
        value={colorScheme}
      />
    </>
  );
};
