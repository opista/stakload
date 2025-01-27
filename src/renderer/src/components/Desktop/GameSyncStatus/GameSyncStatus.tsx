import { Group, Loader, Text, Title } from "@mantine/core";
import clsx from "clsx";

import classes from "./GameSyncStatus.module.css";

type GameSyncStatusProps = {
  className?: string;
};

export const GameSyncStatus = ({ className }: GameSyncStatusProps) => {
  return (
    <Group className={clsx(classes.container, className)}>
      <Loader size={24} />
      <div>
        <Title order={5}>Fetching metadata</Title>
        <Group gap="4px">
          {/* <IconBrandSteam size={16} /> */}
          <Text size="sm">3 / 574</Text>
        </Group>
      </div>
    </Group>
  );
};
