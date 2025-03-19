import { DynamicIcon } from "@components/DynamicIcon/DynamicIcon";
import { Notification } from "@contracts/store/notification";
import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import classes from "./NotificationBody.module.css";

type NotificationBodyProps = {
  notification: Omit<Notification, "timestamp">;
  onClose: (id: string) => void;
};

export const NotificationBody = ({ notification, onClose }: NotificationBodyProps) => {
  const { t } = useTranslation();

  return (
    <Group className={classes.container}>
      {notification.icon && <DynamicIcon className={classes.icon} icon={notification.icon} size={32} />}
      <Group className={clsx(classes.body, "custom-notification-body")}>
        <Stack className={classes.stack}>
          <Text className={classes.title}>{t(notification.title)}</Text>
          <Text className={classes.message}>{t(notification.message)}</Text>
        </Stack>
        <ActionIcon onClick={() => onClose(notification.id)} variant="transparent">
          <IconX size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
};
