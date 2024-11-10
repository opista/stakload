import { Popover, Text, ActionIcon } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";

const buttonSize = 34;

export const GamesFilter = () => {
  return (
    <Popover
      arrowOffset={buttonSize / 2}
      closeOnEscape
      position="right-start"
      shadow="sm"
      width={200}
      withArrow
    >
      <Popover.Target>
        <ActionIcon size={buttonSize} ml={"xs"} variant="default">
          <IconAdjustments
            style={{ width: "70%", height: "70%" }}
            stroke={1.5}
          />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">
          This is uncontrolled popover, it is opened when button is clicked
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};
