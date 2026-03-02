import { create } from "zustand";

import { NotificationStoreActions, NotificationStoreState } from "@stakload/contracts/store/notification";

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
  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  isDrawerOpen: false,
  notifications: [],

  openDrawer: () => set({ isDrawerOpen: true }),

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },

  showToast: (toast) => {
    const id = toast.id || Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },

  toasts: [],

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  updateToast: (id, toast) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...toast } : t)),
    }));
  },
}));
