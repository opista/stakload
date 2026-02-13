export const NOTIFICATION_KEYS = {
  GAME_INSTALLATION_FAILED_MESSAGE: "notifications.gameInstallation.failedMessage",
  GAME_INSTALLATION_FAILED_TITLE: "notifications.gameInstallation.failedTitle",
  GAME_LAUNCH_FAILED_MESSAGE: "notifications.gameLaunch.failedMessage",
  GAME_LAUNCH_FAILED_TITLE: "notifications.gameLaunch.failedTitle",
  GAME_UNINSTALLATION_FAILED_MESSAGE: "notifications.gameUninstallation.failedMessage",
  GAME_UNINSTALLATION_FAILED_TITLE: "notifications.gameUninstallation.failedTitle",
  INTEGRATION_FAILED_MESSAGE: "notifications.integration.failedMessage",
  INTEGRATION_FAILED_TITLE: "notifications.integration.failedTitle",
  INTEGRATION_SUCCESS_MESSAGE: "notifications.integration.successMessage",
  INTEGRATION_SUCCESS_TITLE: "notifications.integration.successTitle",
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
  addNotification: (notification: Notification) => void;
  clearAllNotifications: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  removeNotification: (id: string) => void;
  toggleDrawer: () => void;
};
