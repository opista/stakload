import { Notification } from "@contracts/store/notification";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import classes from "./NotificationBody.module.css";

type NotificationBodyProps = {
  notification: Omit<Notification, "timestamp">;
  onClose: (id: string) => void;
};

export const NotificationBody = ({ notification, onClose }: NotificationBodyProps) => {
  return (
    <Group className="custom-notification-body" justify="space-between">
      <Stack className={classes.stack} gap={0}>
        <Text className={classes.title}>{notification.title}</Text>
        <Text className={classes.message}>{notification.message}</Text>
      </Stack>
      <ActionIcon onClick={() => onClose(notification.id)} variant="transparent">
        <IconX size={16} />
      </ActionIcon>
    </Group>
  );
};
