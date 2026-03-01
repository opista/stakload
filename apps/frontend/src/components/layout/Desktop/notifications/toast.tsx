import { Toast as ToastType } from "@stakload/contracts/store/notification";
import { IconX } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { useEffect, useState } from "react";

interface ToastProps {
  onClose: (id: string) => void;
  toast: ToastType;
}

export const Toast = ({ onClose, toast }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (toast.autoClose !== false) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
      }, toast.autoClose || 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toast.id, toast.autoClose, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex min-w-[300px] max-w-sm items-start gap-4 rounded-xl bg-[#2b2b2b] p-4 shadow-2xl ring-1 ring-white/10 transition-all duration-300 ease-out",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      {toast.icon && <div className={cn("mt-1 shrink-0", toast.loading && "animate-spin")}>{toast.icon}</div>}
      <div className="flex flex-1 flex-col gap-1">
        {toast.title && <span className="text-sm font-black text-white">{toast.title}</span>}
        {toast.message && <div className="text-xs font-medium text-neutral-400">{toast.message}</div>}
      </div>
      <button
        onClick={handleClose}
        className="mt-1 shrink-0 rounded-full p-1 text-neutral-500 hover:bg-white/5 hover:text-white transition-colors"
      >
        <IconX size={16} />
      </button>
    </div>
  );
};
