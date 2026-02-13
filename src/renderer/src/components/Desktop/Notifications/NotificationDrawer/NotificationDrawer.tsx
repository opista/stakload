import { useNotifications } from "@hooks/use-notifications";
import { Drawer, ScrollArea } from "@mantine/core";
import { useNotificationStore } from "@store/notification.store";
import { useShallow } from "zustand/react/shallow";

import { NotificationDrawerItem } from "../NotificationDrawerItem/NotificationDrawerItem";
import { NotificationDrawerTitle } from "../NotificationDrawerTitle/NotificationDrawerTitle";

import classes from "./NotificationDrawer.module.css";

export const NotificationDrawer = () => {
  const { notifications, removeNotification } = useNotifications();
  const { closeDrawer, isDrawerOpen } = useNotificationStore(
    useShallow((state) => ({
      closeDrawer: state.closeDrawer,
      isDrawerOpen: state.isDrawerOpen,
    })),
  );

  return (
    <Drawer.Root
      classNames={{ content: classes.content, inner: classes.inner }}
      closeOnClickOutside
      closeOnEscape
      lockScroll={false}
      offset={16}
      onClose={closeDrawer}
      opened={isDrawerOpen}
      position="right"
      radius="xl"
      scrollAreaComponent={ScrollArea.Autosize}
      size="sm"
    >
      <Drawer.Overlay backgroundOpacity={0} />
      <Drawer.Content>
        <Drawer.Title>
          <NotificationDrawerTitle />
        </Drawer.Title>
        <Drawer.Body>
          {notifications.map((notification) => (
            <NotificationDrawerItem key={notification.id} notification={notification} onClose={removeNotification} />
          ))}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};
