import { ReactNode } from "react";

import { cn } from "@util/cn";

type BadgeVariant = "filled" | "light" | "outline";
type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
};

const sizeClasses: Record<BadgeSize, string> = {
  lg: "px-2.5 py-1 text-[11px]",
  md: "px-2 py-0.5 text-[10px]",
  sm: "px-1.5 text-[9px]",
  xl: "px-3 py-1.5 text-xs",
  xs: "px-1 text-[8px]",
};

export const Badge = ({ children, className, size = "md", variant = "light" }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-black uppercase tracking-widest",
        variant === "light" && "bg-cyan-500/10 text-cyan-400",
        variant === "filled" && "bg-cyan-600 text-white",
        variant === "outline" && "border border-cyan-500/50 text-cyan-400",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  );
};
