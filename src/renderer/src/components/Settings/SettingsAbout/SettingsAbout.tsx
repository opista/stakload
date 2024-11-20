import { Logo } from "@components/Logo/Logo";
import { Code, Flex } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";
import { homepage, version } from "../../../../../../package.json";
import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { useTranslation } from "react-i18next";

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
