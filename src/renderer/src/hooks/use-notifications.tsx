import { NotificationBody } from "@components/NotificationBody/NotificationBody";
import { Notification } from "@contracts/store/notification";
import { notifications } from "@mantine/notifications";
import { useNotificationStore } from "@store/notification.store";
import { importDynamicIcon } from "@util/import-dynamic-icon";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const notificationColorMap: Record<Notification["type"], string> = {
  info: "blue",
  success: "green",
  warning: "yellow",
  error: "red",
};

const mapNotificationTypeToColor = (type: Notification["type"]) =>
  notificationColorMap[type] || notificationColorMap.info;

const Icon = ({ icon }: { icon: string }) => {
  const IconComponent = importDynamicIcon(icon);
  if (!IconComponent) return null;
  return <IconComponent size={32} />;
};

export const useNotifications = () => {
  const { addNotification, notificationsList, removeNotification } = useNotificationStore(
    useShallow((state) => ({
      addNotification: state.addNotification,
      notificationsList: state.notifications,
      removeNotification: state.removeNotification,
    })),
  );

  const onNotificationHide = (id: string) => {
    removeNotification(id);
    notifications.hide(id);
  };

  const createNotification = (notification: Notification) => {
    notifications.show({
      autoClose: 5000,
      color: mapNotificationTypeToColor(notification.type),
      id: notification.id,
      icon: notification.icon ? <Icon icon={notification.icon} /> : undefined,
      message: <NotificationBody notification={notification} onNotificationHide={onNotificationHide} />,
      radius: "lg",
      withCloseButton: false,
    });

    addNotification(notification);
  };

  const listener = (event: string, notification: Notification) => createNotification(notification);

  useEffect(() => {
    const removeListener = window.api.onNotification(listener);
    return () => removeListener();
  }, []);

  return { createNotification, notifications: notificationsList };
};
