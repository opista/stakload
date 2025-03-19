import { Notification } from "@contracts/store/notification";
import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import classes from "./NotificationDrawerItem.module.css";

type NotificationDrawerItemProps = {
  notification: Notification;
  onClose: (id: string) => void;
};

const indiciatorColorMap: Record<Notification["type"], string> = {
  info: "var(--mantine-color-blue-filled)",
  success: "var(--mantine-color-green-filled)",
  warning: "var(--mantine-color-yellow-filled)",
  error: "var(--mantine-color-red-filled)",
};

export const NotificationDrawerItem = ({ notification, onClose }: NotificationDrawerItemProps) => {
  return (
    <Paper className={classes.container}>
      <Group align="center" className={classes.group} justify="space-between">
        <Text c="dimmed" size="xs">
          {new Date(notification.timestamp).toLocaleString()}
        </Text>
        <ActionIcon onClick={() => onClose?.(notification.id)} size="sm" variant="transparent">
          <IconX size={16} />
        </ActionIcon>
      </Group>
      <Stack className={classes.stack}>
        <div className={classes.indicator} style={{ backgroundColor: indiciatorColorMap[notification.type] }}></div>
        <Text c="white">{notification.title}</Text>
        <Text size="sm">{notification.message}</Text>
      </Stack>
    </Paper>
  );
};
