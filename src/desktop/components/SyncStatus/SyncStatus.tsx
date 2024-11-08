import { Loader, Text, UnstyledButton } from "@mantine/core";
import classes from "./SyncStatus.module.css";

export const SyncStatus = () => {
  return (
    <UnstyledButton className={classes.container}>
      <Loader className={classes.loader} size={24} />
      <div>
        <Text size="sm">Syncing...</Text>
        <Text size="xs">Updating game library</Text>
      </div>
    </UnstyledButton>
  );
};
