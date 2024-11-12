import { ActionIcon, Popover, Text } from "@mantine/core";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";
import { useState } from "react";

export const GamesFilter = () => {
  const [opened, setOpened] = useState(false);

  const Icon = opened ? IconFilterFilled : IconFilter;

  return (
    <Popover
      closeOnEscape
      position="right-start"
      shadow="sm"
      width={200}
      withArrow
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <ActionIcon size="lg" ml="xs" variant="default" onClick={() => setOpened((o) => !o)}>
          <Icon style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">TODO - Filters here</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
