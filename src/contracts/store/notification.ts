export type Notification = {
  icon?: string;
  id: string;
  message: string;
  timestamp: number;
  title: string;
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
