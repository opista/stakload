import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { ReactNode } from "react";

import { cn } from "@util/cn";

export interface DrawerProps {
  children: ReactNode;
  onClose: () => void;
  opened: boolean;
  position?: "left" | "right" | "top" | "bottom";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | string;
  title?: ReactNode;
}

const SIZE_MAP: Record<string, string> = {
  lg: "max-w-lg",
  md: "max-w-md",
  sm: "max-w-sm",
  xl: "max-w-xl",
  xs: "max-w-xs",
};

export const Drawer = ({ children, onClose, opened, position = "right", size = "md", title }: DrawerProps) => {
  const sizeClass = SIZE_MAP[size] || size;

  return (
    <BaseDialog.Root open={opened} onOpenChange={(open) => !open && onClose()}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="animate-in fade-in fixed inset-0 z-[1000] bg-black/20 backdrop-blur-[2px] duration-300" />
        <BaseDialog.Popup
          className={cn(
            "fixed z-[1000] flex flex-col bg-[var(--color)] p-8 shadow-2xl ring-1 ring-white/10 outline-none",
            position === "right" &&
              "right-4 top-4 bottom-4 w-full rounded-[2.5rem] animate-in slide-in-from-right-full duration-300",
            position === "left" &&
              "left-4 top-4 bottom-4 w-full rounded-[2.5rem] animate-in slide-in-from-left-full duration-300",
            position === "top" && "inset-x-0 top-0 rounded-b-[2.5rem] animate-in slide-in-from-top-full duration-300",
            position === "bottom" &&
              "inset-x-0 bottom-0 rounded-t-[2.5rem] animate-in slide-in-from-bottom-full duration-300",
            sizeClass,
          )}
        >
          {title && (
            <div className="mb-6 flex items-center justify-between">
              <BaseDialog.Title className="text-2xl font-black">{title}</BaseDialog.Title>
              <BaseDialog.Close className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white focus:outline-none">
                <span className="sr-only">Close</span>
              </BaseDialog.Close>
            </div>
          )}
          <div className="scrollbar-hide flex-1 overflow-y-auto pr-2">{children}</div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
