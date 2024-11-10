import { ActionIcon, Code, Flex } from "@mantine/core";
import { os } from "@neutralinojs/lib";
import { IconBrandGithub } from "@tabler/icons-react";
import { homepage, version } from "../../../../../package.json";
import { Logo } from "../../../../components/Logo/Logo";

export const AboutView = () => {
  return (
    <div>
      <ActionIcon
        aria-label="Github repository"
        color="gray"
        size="xl"
        variant="white"
        onClick={() => os.open(homepage)}
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
