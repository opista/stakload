import { DynamicIcon } from "@components/DynamicIcon/DynamicIcon";
import { Notification } from "@contracts/store/notification";
import { ActionIcon, Group, Paper, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import classes from "./NotificationDrawerItem.module.css";

type NotificationDrawerItemProps = {
  notification: Notification;
  onClose: (id: string) => void;
};

const indiciatorColorMap: Record<Notification["type"], string> = {
  error: "var(--mantine-color-red-filled)",
  info: "var(--mantine-color-blue-filled)",
  success: "var(--mantine-color-green-filled)",
  warning: "var(--mantine-color-yellow-filled)",
};

export const NotificationDrawerItem = ({ notification, onClose }: NotificationDrawerItemProps) => {
  const { t } = useTranslation();

  return (
    <Paper className={classes.container}>
      <Group align="center" className={classes.heading} justify="space-between">
        <Text c="dimmed" size="xs">
          {new Date(notification.timestamp).toLocaleString()}
        </Text>
        <ActionIcon onClick={() => onClose?.(notification.id)} size="sm" variant="transparent">
          <IconX size={16} />
        </ActionIcon>
      </Group>
      <Group className={classes.body}>
        <div className={classes.indicator} style={{ backgroundColor: indiciatorColorMap[notification.type] }}></div>
        {notification.icon && <DynamicIcon className={classes.icon} icon={notification.icon} size={32} />}

        <Stack className={classes.textContainer}>
          <Text className={classes.title}>{t(notification.title)}</Text>
          <Text className={classes.message}>{t(notification.message)}</Text>
        </Stack>
      </Group>
    </Paper>
  );
};
