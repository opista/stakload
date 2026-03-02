import { createPortal } from "react-dom";
import { useShallow } from "zustand/react/shallow";

import { useNotificationStore } from "@store/notification.store";

import { Toast } from "./toast";

export const ToastRenderer = () => {
  const { hideToast, toasts } = useNotificationStore(
    useShallow((state) => ({
      hideToast: state.hideToast,
      toasts: state.toasts,
    })),
  );

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="pointer-events-none fixed right-4 bottom-4 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={hideToast} />
      ))}
    </div>,
    document.body,
  );
};
