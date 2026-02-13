import { NotificationStoreActions, NotificationStoreState } from "@contracts/store/notification";
import { create } from "zustand";

type NotificationStore = NotificationStoreState & NotificationStoreActions;

export const useNotificationStore = create<NotificationStore>((set) => ({
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  closeDrawer: () => set({ isDrawerOpen: false }),
  isDrawerOpen: false,
  notifications: [],

  openDrawer: () => set({ isDrawerOpen: true }),

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}));
