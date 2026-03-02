import { Drawer } from "@components/ui/drawer";
import { useNotifications } from "@hooks/use-notifications";
import { useNotificationStore } from "@store/notification.store";
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

  return (
    <Drawer
      opened={isDrawerOpen}
      onClose={closeDrawer}
      position="right"
      size="max-w-[400px]"
      title={<NotificationDrawerTitle />}
    >
      <div className="mt-6 flex flex-1 flex-col gap-4 pb-4">
        {notifications.map((notification) => (
          <NotificationDrawerItem key={notification.id} notification={notification} onClose={removeNotification} />
        ))}
        {notifications.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center text-neutral-500">
            <p className="text-sm font-medium">No new notifications</p>
          </div>
        )}
      </div>
    </Drawer>
  );
};
