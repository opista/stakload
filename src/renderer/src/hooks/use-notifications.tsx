import { Notification } from "@contracts/store/notification";
import { useNotificationStore } from "@store/notification.store";
import { IconCheck, IconExclamationCircle, IconInfoCircle, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

const notificationIconMap: Record<Notification["type"], any> = {
  error: <IconX size={18} className="text-red-400" />,
  info: <IconInfoCircle size={18} className="text-blue-400" />,
  success: <IconCheck size={18} className="text-green-400" />,
  warning: <IconExclamationCircle size={18} className="text-yellow-400" />,
};

export const useNotifications = () => {
  const { addNotification, notificationsList, removeNotification, showToast } = useNotificationStore(
    useShallow((state) => ({
      addNotification: state.addNotification,
      notificationsList: state.notifications,
      removeNotification: state.removeNotification,
      showToast: state.showToast,
    })),
  );

  const createNotification = (notification: Notification) => {
    showToast({
      autoClose: 5000,
      icon: notificationIconMap[notification.type],
      id: notification.id,
      message: notification.message,
      title: notification.title,
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
