import { IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@components/ui/button";
import { useNotificationStore } from "@store/notification.store";

export const NotificationDrawerTitle = () => {
  const { clearAllNotifications, closeDrawer } = useNotificationStore(
    useShallow((state) => ({
      clearAllNotifications: state.clearAllNotifications,
      closeDrawer: state.closeDrawer,
    })),
  );
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black">{t("notificationDrawer.title")}</h3>
        <button
          onClick={closeDrawer}
          className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white focus:outline-none"
        >
          <IconX size={24} />
        </button>
      </div>
      <div className="flex justify-end">
        <Button onClick={clearAllNotifications} variant="subtle" size="xs">
          {t("notificationDrawer.clearAll")}
        </Button>
      </div>
    </div>
  );
};
