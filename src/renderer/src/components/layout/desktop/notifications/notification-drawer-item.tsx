import { DynamicIcon } from "@components/icons/dynamic-icon";
import { Notification } from "@contracts/store/notification";
import { IconX } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { useTranslation } from "react-i18next";

type NotificationDrawerItemProps = {
  notification: Notification;
  onClose: (id: string) => void;
};

const indiciatorColorMap: Record<Notification["type"], string> = {
  error: "bg-red-500",
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
};

export const NotificationDrawerItem = ({ notification, onClose }: NotificationDrawerItemProps) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          {new Date(notification.timestamp).toLocaleString()}
        </span>
        <button
          onClick={() => onClose?.(notification.id)}
          className="text-neutral-500 hover:text-white transition-colors focus:outline-none"
        >
          <IconX size={16} />
        </button>
      </div>
      <div className="flex gap-4">
        <div className={cn("w-1 shrink-0 rounded-full", indiciatorColorMap[notification.type])} />
        {notification.icon && <DynamicIcon className="shrink-0" icon={notification.icon} size={32} />}

        <div className="max-w-full overflow-hidden flex flex-col gap-0.5">
          <span className="text-sm font-black text-white">{t(notification.title as any)}</span>
          <p className="text-[12px] font-medium leading-relaxed text-neutral-400 truncate-2-lines">
            {t(notification.message as any)}
          </p>
        </div>
      </div>
    </div>
  );
};
