import { NotificationBody } from "@components/Desktop/Notifications/NotificationBody/NotificationBody";
import { Notification } from "@contracts/store/notification";
import { notifications } from "@mantine/notifications";
import { useNotificationStore } from "@store/notification.store";
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
      message: <NotificationBody notification={notification} onClose={onNotificationHide} />,
      radius: "lg",
      withCloseButton: false,
    });

    addNotification(notification);
  };

  const listener = (_event: string, notification: Notification) => createNotification(notification);

  useEffect(() => {
    const removeListener = window.api.onNotification(listener);
    return () => removeListener();
  }, []);

  return { notifications: notificationsList, removeNotification };
};
