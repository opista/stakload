import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { Logo } from "@components/Logo/Logo";
import { Code, Flex } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { homepage, version } from "../../../../../../package.json";

export const SettingsAbout = () => {
  const { t } = useTranslation();

  const onClickGithub = () => window.api.openWebpage(homepage);

  return (
    <div>
      <ActionIcon
        aria-label={t("githubRepository")}
        color="gray"
        icon={IconBrandGithub}
        onClick={onClickGithub}
        size="xl"
        variant="white"
      />
      <Flex gap="md" justify="center" align="center" direction="row" wrap="wrap">
        <Logo />
        <Code>v{version}</Code>
      </Flex>
    </div>
  );
};
