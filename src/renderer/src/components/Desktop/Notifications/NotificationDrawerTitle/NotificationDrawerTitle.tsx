import { useNotifications } from "@hooks/use-notifications";
import { Button, Drawer, Group, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

import classes from "./NotificationDrawerTitle.module.css";

export const NotificationDrawerTitle = () => {
  const { clearAllNotifications } = useNotifications();
  const { t } = useTranslation();

  return (
    <Stack className={classes.stack}>
      <Group>
        <Title order={3} size="h4">
          {t("notificationDrawer.title")}
        </Title>
        <Drawer.CloseButton />
      </Group>
      <Group justify="flex-end">
        <Button className={classes.button} onClick={clearAllNotifications} variant="transparent">
          {t("notificationDrawer.clearAll")}
        </Button>
      </Group>
    </Stack>
  );
};
