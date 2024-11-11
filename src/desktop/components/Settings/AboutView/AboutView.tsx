import { ActionIcon, Code, Flex } from "@mantine/core";
import { homepage, version } from "../../../../../package.json";
import { IconBrandGithub } from "@tabler/icons-react";
import { Logo } from "../../../../components/Logo/Logo";
import { os } from "@neutralinojs/lib";

export const AboutView = () => {
  const onClickGithub = () => {
    os.open(homepage);
  };

  return (
    <div>
      <ActionIcon
        aria-label="Github repository"
        color="gray"
        size="xl"
        variant="white"
        onClick={onClickGithub}
      >
        <IconBrandGithub />
      </ActionIcon>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Logo />
        <Code>v{version}</Code>
      </Flex>
    </div>
  );
};

// style={{ width: "70%", height: "70%" }} stroke={1.5}
