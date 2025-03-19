export const NOTIFICATION_KEYS = {
  INTEGRATION_SUCCESS_TITLE: "notifications.integration.successTitle",
  INTEGRATION_SUCCESS_MESSAGE: "notifications.integration.successMessage",
  INTEGRATION_FAILED_TITLE: "notifications.integration.failedTitle",
  INTEGRATION_FAILED_MESSAGE: "notifications.integration.failedMessage",
} as const;

export type Notification = {
  icon?: string;
  id: string;
  message: (typeof NOTIFICATION_KEYS)[keyof typeof NOTIFICATION_KEYS];
  timestamp: number;
  title: (typeof NOTIFICATION_KEYS)[keyof typeof NOTIFICATION_KEYS];
  type: "info" | "success" | "warning" | "error";
};

export type NotificationStoreState = {
  isDrawerOpen: boolean;
  notifications: Notification[];
};

export type NotificationStoreActions = {
  addNotification: (notification: Omit<Notification, "timestamp">) => void;
  clearAllNotifications: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  removeNotification: (id: string) => void;
  toggleDrawer: () => void;
};
