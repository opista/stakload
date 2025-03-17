import { NotificationStoreActions, NotificationStoreState } from "@contracts/store/notification";
import { create } from "zustand";

type NotificationStore = NotificationStoreState & NotificationStoreActions;

export const useNotificationStore = create<NotificationStore>((set) => ({
  isDrawerOpen: false,
  notifications: [],

  closeDrawer: () => set({ isDrawerOpen: false }),
  openDrawer: () => set({ isDrawerOpen: true }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        {
          ...notification,
          timestamp: Date.now(),
        },
        ...state.notifications,
      ],
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },
}));
