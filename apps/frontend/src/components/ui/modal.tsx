import { Dialog } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { ReactNode } from "react";

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
  return (
    <Dialog.Root open={opened} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="animate-in fade-in fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm transition-opacity duration-200" />
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <Dialog.Popup
            className={cn(
              "relative w-full overflow-hidden rounded-[2.5rem] bg-[var(--color)] shadow-2xl ring-1 ring-white/10 transition-all focus:outline-none animate-in fade-in zoom-in-95 duration-200",
              sizeClasses[size],
              centered ? "my-auto" : "mt-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-8 pb-4">
              <Dialog.Title className="text-2xl font-black tracking-tight">{title}</Dialog.Title>
              <Dialog.Close className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white focus:outline-none">
                <IconX size={24} stroke={2} />
              </Dialog.Close>
            </div>

            {/* Body */}
            <div className="p-8">{children}</div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
