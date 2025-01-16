import ActionIcon from "@components/ActionIcon/ActionIcon";
import Logo from "@components/Logo/Logo";
import { Code, Flex, Stack, UnstyledButton } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { homepage, version } from "../../../../../../../package.json";
import classes from "./SettingsAbout.module.css";

export const SettingsAbout = () => {
  const { t } = useTranslation();

  return (
    <Stack className={classes.container}>
      <UnstyledButton component="a" href={homepage} target="_blank">
        <ActionIcon aria-label={t("githubRepository")} color="gray" icon={IconBrandGithub} size="xl" variant="white" />
      </UnstyledButton>
      <Flex align="center" direction="row" gap="md" justify="center" wrap="wrap">
        <Logo />
      </Flex>
      <Flex className={classes.version} justify="flex-end">
        <Code>v{version}</Code>
      </Flex>
    </Stack>
  );
};
