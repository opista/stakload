import { ActionIcon } from "@components/ActionIcon/ActionIcon";
import { Popover, Text } from "@mantine/core";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import classes from "./GamesFilter.module.css";

type GamesFilterProps = {
  disabled?: boolean;
};

export const GamesFilter = ({ disabled }: GamesFilterProps) => {
  const [opened, setOpened] = useState(false);
  const { t } = useTranslation();

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
          aria-label={t("filters")}
          className={classes.icon}
          disabled={disabled}
          icon={Icon}
          onClick={() => setOpened((o) => !o)}
          size="lg"
        />
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">TODO - Filters here</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
