import { useNotifications } from "@hooks/use-notifications";
import { useNotificationStore } from "@store/notification.store";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";

import { NotificationDrawerItem } from "./notification-drawer-item";
import { NotificationDrawerTitle } from "./notification-drawer-title";

export const NotificationDrawer = () => {
  const { notifications, removeNotification } = useNotifications();
  const { closeDrawer, isDrawerOpen } = useNotificationStore(
    useShallow((state) => ({
      closeDrawer: state.closeDrawer,
      isDrawerOpen: state.isDrawerOpen,
    })),
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex justify-end p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={closeDrawer} />

      {/* Drawer Content */}
      <div className="relative flex h-full w-full max-w-[400px] flex-col overflow-hidden rounded-[2.5rem] bg-[var(--color)] p-8 shadow-2xl ring-1 ring-white/10 transition-all duration-300 animate-in slide-in-from-right-full">
        <NotificationDrawerTitle />
        <div className="mt-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
          <div className="flex flex-col gap-4 pb-4">
            {notifications.map((notification) => (
              <NotificationDrawerItem key={notification.id} notification={notification} onClose={removeNotification} />
            ))}
            {notifications.length === 0 && (
              <div className="flex h-40 flex-col items-center justify-center text-neutral-500">
                <p className="text-sm font-medium">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
