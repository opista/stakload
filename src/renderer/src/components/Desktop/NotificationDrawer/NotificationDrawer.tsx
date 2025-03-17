import { useNotifications } from "@hooks/use-notifications";
import { Drawer, ScrollArea } from "@mantine/core";
import { useNotificationStore } from "@store/notification.store";
import { useShallow } from "zustand/react/shallow";

import classes from "./NotificationDrawer.module.css";

export const NotificationDrawer = () => {
  const { notifications } = useNotifications();
  const { isDrawerOpen, closeDrawer } = useNotificationStore(
    useShallow((state) => ({
      isDrawerOpen: state.isDrawerOpen,
      closeDrawer: state.closeDrawer,
    })),
  );

  return (
    <Drawer
      classNames={{ content: classes.content, inner: classes.drawer }}
      closeOnClickOutside={false}
      closeOnEscape
      lockScroll={false}
      offset={16}
      onClose={closeDrawer}
      opened={isDrawerOpen}
      position="right"
      radius="xl"
      scrollAreaComponent={ScrollArea.Autosize}
      size="sm"
      title="Header is sticky"
      withOverlay={false}
    >
      {notifications.map((notification) => (
        <div key={notification.id}>{JSON.stringify(notification)}</div>
      ))}
    </Drawer>
  );
};
