import { DynamicIcon } from "@components/DynamicIcon/DynamicIcon";
import { Notification } from "@contracts/store/notification";
import { IconX } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type NotificationBodyProps = {
  notification: Omit<Notification, "timestamp">;
  onClose: (id: string) => void;
};

export const NotificationBody = ({ notification, onClose }: NotificationBodyProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-4 pr-2">
      {notification.icon && <DynamicIcon className="mt-1 shrink-0" icon={notification.icon} size={32} />}
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-black text-[#1b2c3b]">{t(notification.title as any)}</span>
        <p className="text-[12px] font-medium leading-tight text-[#1b2c3b]/70 line-clamp-2">
          {t(notification.message as any)}
        </p>
      </div>
      <button
        onClick={() => onClose(notification.id)}
        className="mt-1 shrink-0 rounded-full p-1 text-[#1b2c3b]/40 hover:bg-[#1b2c3b]/5 hover:text-[#1b2c3b] transition-colors focus:outline-none"
      >
        <IconX size={16} stroke={2.5} />
      </button>
    </div>
  );
};
