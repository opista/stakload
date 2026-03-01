import { Button as BaseButton } from "@base-ui/react/button";
import { IconProps } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { ComponentPropsWithoutRef, ComponentType, forwardRef, memo } from "react";

type ActionIconSize = "xs" | "sm" | "md" | "lg" | "xl";
type ActionIconVariant = "default" | "filled" | "light" | "outline" | "transparent" | "subtle";

const sizeMap: Record<ActionIconSize, string> = {
  lg: "h-12 w-12 min-h-[3rem] min-w-[3rem]",
  md: "h-10 w-10 min-h-[2.5rem] min-w-[2.5rem]",
  sm: "h-8 w-8 min-h-[2rem] min-w-[2rem]",
  xl: "h-14 w-14 min-h-[3.5rem] min-w-[3.5rem]",
  xs: "h-6 w-6 min-h-[1.5rem] min-w-[1.5rem]",
};

const variantMap: Record<ActionIconVariant, string> = {
  default: "bg-neutral-800 text-white hover:bg-neutral-700 active:scale-95",
  filled: "bg-blue-600 text-white hover:bg-blue-500 active:scale-95",
  light: "bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 active:scale-95",
  outline: "border border-neutral-700 bg-transparent text-white hover:bg-neutral-800 active:scale-95",
  subtle: "bg-transparent text-white hover:bg-white/5 active:scale-95",
  transparent: "bg-transparent text-white hover:bg-white/10 active:scale-95",
};

export type ActionIconProps = {
  "aria-label": string;
  icon?: ComponentType<IconProps>;
  iconStroke?: number;
  size?: ActionIconSize;
  variant?: ActionIconVariant;
} & ComponentPropsWithoutRef<"button">;

const ActionIcon = memo(
  forwardRef<HTMLButtonElement, ActionIconProps>(
    ({ children, className, icon: Icon, iconStroke = 1.5, size = "md", variant = "default", ...props }, ref) => {
      return (
        <BaseButton
          className={cn(
            "inline-flex items-center justify-center rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            sizeMap[size],
            variantMap[variant],
            className,
          )}
          ref={ref}
          {...props}
        >
          <span className="sr-only">{props["aria-label"]}</span>
          {Icon ? <Icon className="h-[60%] w-[60%]" stroke={iconStroke} /> : children}
        </BaseButton>
      );
    },
  ),
);

ActionIcon.displayName = "ActionIcon";

export { ActionIcon };
