import { ActionIcon } from "@mantine/core";
import { os } from "@neutralinojs/lib";
import { IconBrandGithub } from "@tabler/icons-react";

export const AboutSettingsView = () => {
  return (
    <div>
      <ActionIcon
        aria-label="Github repository"
        color="gray"
        size="xl"
        variant="white"
        onClick={() => os.open("https://github.com/opista/trulaunch")}
      >
        <IconBrandGithub />
      </ActionIcon>
    </div>
  );
};

// style={{ width: "70%", height: "70%" }} stroke={1.5}
