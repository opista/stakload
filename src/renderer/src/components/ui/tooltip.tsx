import { Tooltip as BaseTooltip } from "@base-ui/react";
import { cn } from "@util/cn";
import { isValidElement, ReactNode } from "react";

export interface TooltipProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  label: ReactNode;
  offset?: number;
  onOpenedChange?: (opened: boolean) => void;
  opened?: boolean;
  position?: "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end";
  withArrow?: boolean;
}

export const Tooltip = ({
  children,
  className,
  delay = 200,
  label,
  offset = 8,
  onOpenedChange,
  opened,
  position = "top",
  withArrow = true,
}: TooltipProps) => {
  const render = isValidElement(children) ? children : undefined;
  return (
    <BaseTooltip.Root open={opened} onOpenChange={onOpenedChange}>
      {/* Use render prop to avoid double buttons when children is already a button (like ActionIcon) */}
      <BaseTooltip.Trigger delay={delay} render={render}>
        {children}
      </BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={position.split("-")[0] as any}
          align={position.split("-")[1] as any}
          sideOffset={offset}
        >
          <BaseTooltip.Popup
            className={cn(
              "z-[1000] select-none rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl ring-1 ring-white/10 outline-none animate-in fade-in zoom-in-95 duration-150",
              className,
            )}
          >
            {withArrow && <BaseTooltip.Arrow className="fill-neutral-900 stroke-white/10" />}
            {label}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
};
