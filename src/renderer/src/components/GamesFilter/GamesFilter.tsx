import { ActionIcon, Popover, Text } from "@mantine/core";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";
import { useState } from "react";
import classes from "./GamesFilter.module.css";

type GamesFilterProps = {
  disabled?: boolean;
};

export const GamesFilter = ({ disabled }: GamesFilterProps) => {
  const [opened, setOpened] = useState(false);

  const Icon = opened ? IconFilterFilled : IconFilter;

  return (
    <Popover
      closeOnEscape
      disabled={disabled}
      onChange={setOpened}
      opened={opened}
      position="right-start"
      shadow="sm"
      width={200}
      withArrow
    >
      <Popover.Target>
        <ActionIcon
          className={classes.icon}
          disabled={disabled}
          onClick={() => setOpened((o) => !o)}
          size="lg"
          variant="default"
        >
          <Icon style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">TODO - Filters here</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
