import { IconX } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  centered?: boolean;
};

const sizeClasses = {
  full: "max-w-full m-4",
  lg: "max-w-2xl",
  md: "max-w-lg",
  sm: "max-w-md",
  xl: "max-w-4xl",
};

export const Modal = ({ centered = true, children, onClose, opened, size = "md", title }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (opened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened]);

  if (!opened) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[2.5rem] bg-[var(--color)] shadow-2xl ring-1 ring-white/10 transition-all",
          sizeClasses[size],
          centered ? "my-auto" : "mt-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-8 pb-4">
          <h3 className="text-2xl font-black tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-white/5 hover:text-white transition-colors focus:outline-none"
          >
            <IconX size={24} stroke={2} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
