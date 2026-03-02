import { Popover as BasePopover } from "@base-ui/react";
import { isValidElement, ReactNode } from "react";

import { cn } from "@util/cn";

export interface PopoverProps {
  children: ReactNode;
  className?: string;
  content: ReactNode;
  offset?: number;
  onOpenedChange?: (opened: boolean) => void;
  opened?: boolean;
  position?: "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end";
  withArrow?: boolean;
}

export const Popover = ({
  children,
  className,
  content,
  offset = 8,
  onOpenedChange,
  opened,
  position = "bottom",
  withArrow = true,
}: PopoverProps) => {
  const render = isValidElement(children) ? children : undefined;
  return (
    <BasePopover.Root open={opened} onOpenChange={onOpenedChange}>
      <BasePopover.Trigger render={render}>{children}</BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={position.split("-")[0] as any}
          align={position.split("-")[1] as any}
          sideOffset={offset}
        >
          <BasePopover.Popup
            className={cn(
              "z-[1000] min-w-[200px] bg-stone-950 border border-white/5 p-4 text-white shadow-2xl ring-1 ring-white/10 outline-none animate-in fade-in zoom-in-95 duration-200",
              className,
            )}
          >
            {withArrow && <BasePopover.Arrow className="fill-stone-950 stroke-white/5" />}
            {content}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};
