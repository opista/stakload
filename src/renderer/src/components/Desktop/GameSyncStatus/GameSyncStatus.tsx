import { GameSyncMessage } from "@contracts/sync";
import { useGameSync } from "@hooks/use-game-sync-status";
import { Group, RingProgress, Text } from "@mantine/core";
import { NotificationData, notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { mapLibraryIcon } from "@util/map-library-icon";
import { useEffect, useState } from "react";

import classes from "./GameSyncStatus.module.css";

const Progress = ({ processing, total }: { processing: number; total: number }) => {
  const percentage = (processing / total) * 100;
  const rounded = Math.round(percentage);
  return (
    <RingProgress
      rootColor="transparent"
      sections={[{ color: "cyan", value: rounded }]}
      size={40}
      thickness={4}
      transitionDuration={350}
    />
  );
};

const baseProps: Partial<NotificationData> = {
  autoClose: false,
  radius: "lg",
  withCloseButton: false,
};

export const GameSyncStatus = () => {
  const message = useGameSync();
  const [notificationId, setNotificationId] = useState<string | undefined>(undefined);

  const handleMessage = (message: GameSyncMessage | null) => {
    if (!message) return;

    const operation = (data: NotificationData) => {
      if (notificationId) {
        return notifications.update({ ...baseProps, ...data });
      }
      const id = notifications.show({ ...baseProps, ...data });
      setNotificationId(id);
      return id;
    };

    switch (message.action) {
      case "complete": {
        operation({
          autoClose: 5000,
          classNames: undefined,
          icon: <IconCheck size={16} />,
          id: notificationId,
          loading: false,
          message: `${message.total} games added`,
          title: "Sync complete",
          withCloseButton: true,
        });
        setNotificationId(undefined);
        return;
      }
      case "library": {
        const { icon: Icon, name } = mapLibraryIcon(message.library);
        operation({
          icon: <Icon size={16} />,
          id: notificationId,
          loading: true,
          message: (
            <Group gap="xs">
              <Icon size={16} />
              <Text size="sm">{name}</Text>
            </Group>
          ),
          title: "Syncing library",
        });
        return;
      }
      case "metadata": {
        operation({
          classNames: { icon: classes.iconMetadata },
          icon: <Progress processing={message.processing} total={message.total} />,
          id: notificationId,
          loading: false,
          message: `${message.processing} / ${message.total}`,
          title: "Fetching metadata",
        });
        return;
      }
    }
  };

  useEffect(() => handleMessage(message), [message]);

  return null;
};
