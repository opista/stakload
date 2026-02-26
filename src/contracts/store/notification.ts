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
  message: string;
  timestamp: number;
  title: string;
  type: "info" | "success" | "warning" | "error";
};

export type Toast = {
  id: string;
  title?: React.ReactNode;
  message?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  autoClose?: number | false;
  color?: string;
  type?: "info" | "success" | "warning" | "error";
};

export type NotificationStoreState = {
  isDrawerOpen: boolean;
  notifications: Notification[];
  toasts: Toast[];
};

export type NotificationStoreActions = {
  addNotification: (notification: Notification) => void;
  clearAllNotifications: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  removeNotification: (id: string) => void;
  toggleDrawer: () => void;

  showToast: (toast: Omit<Toast, "id"> & { id?: string }) => string;
  updateToast: (id: string, toast: Partial<Toast>) => void;
  hideToast: (id: string) => void;
};
