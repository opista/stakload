import { cn } from "@util/cn";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "filled" | "default" | "outline" | "subtle" | "danger" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
} & ComponentPropsWithoutRef<"button">;

const variantClasses: Record<ButtonVariant, string> = {
  danger: "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]",
  default: "bg-neutral-800 text-white hover:bg-neutral-700 active:scale-[0.98]",
  filled: "bg-cyan-600 text-white hover:bg-cyan-500 active:scale-[0.98]",
  ghost: "bg-transparent text-white hover:bg-white/5 active:scale-[0.98]",
  outline: "border border-neutral-700 bg-transparent text-white hover:bg-neutral-800 active:scale-[0.98]",
  subtle: "bg-transparent text-white hover:bg-white/5 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "h-13 px-8 text-base",
  md: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-xs",
  xl: "h-16 px-10 text-lg",
  xs: "h-7 px-3 text-[10px]",
};

export const Button = ({
  children,
  className,
  disabled,
  isLoading,
  leftIcon,
  loading,
  rightIcon,
  size = "md",
  variant = "filled",
  ...props
}: ButtonProps) => {
  const isActuallyLoading = loading || isLoading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-bold transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 gap-2",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isActuallyLoading}
      type={props.type || "button"}
      {...props}
    >
      {isActuallyLoading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      {children}
      {!isActuallyLoading && rightIcon}
    </button>
  );
};
