import { ActionIcon, Code, Text } from "@mantine/core";
import { os } from "@neutralinojs/lib";
import { IconBrandGithub } from "@tabler/icons-react";
import { homepage, version } from "../../../../../package.json";

export const AboutView = () => {
  return (
    <div>
      <Text>
        Trulaunch <Code>v{version}</Code>
      </Text>
      <ActionIcon
        aria-label="Github repository"
        color="gray"
        size="xl"
        variant="white"
        onClick={() => os.open(homepage)}
      >
        <IconBrandGithub />
      </ActionIcon>
    </div>
  );
};

// style={{ width: "70%", height: "70%" }} stroke={1.5}
