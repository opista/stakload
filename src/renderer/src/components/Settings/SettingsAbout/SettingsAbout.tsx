import ActionIcon from "@components/ActionIcon/ActionIcon";
import Logo from "@components/Logo/Logo";
import { Code, Flex, UnstyledButton } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { homepage, version } from "../../../../../../package.json";

export const SettingsAbout = () => {
  const { t } = useTranslation();

  return (
    <UnstyledButton component="a" href={homepage} target="_blank">
      <ActionIcon aria-label={t("githubRepository")} color="gray" icon={IconBrandGithub} size="xl" variant="white" />
      <Flex align="center" direction="row" gap="md" justify="center" wrap="wrap">
        <Logo />
        <Code>v{version}</Code>
      </Flex>
    </UnstyledButton>
  );
};
