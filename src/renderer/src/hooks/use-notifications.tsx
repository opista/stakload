import { NotificationBody } from "@components/Desktop/Notifications/NotificationBody/NotificationBody";
import { DynamicIcon } from "@components/DynamicIcon/DynamicIcon";
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
  const { addNotification, clearAllNotifications, notificationsList, removeNotification } = useNotificationStore(
    useShallow((state) => ({
      addNotification: state.addNotification,
      clearAllNotifications: state.clearAllNotifications,
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
      icon: notification.icon ? <DynamicIcon icon={notification.icon} size={32} /> : undefined,
      message: <NotificationBody notification={notification} onClose={onNotificationHide} />,
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

  return { clearAllNotifications, createNotification, notifications: notificationsList, removeNotification };
};
