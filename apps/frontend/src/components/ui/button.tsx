import { Button as BaseButton } from "@base-ui/react/button";
import { Icon, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { ReactNode } from "react";

type ButtonVariant = "filled" | "default" | "outline" | "subtle" | "danger" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  leftIcon?: Icon;
  rightIcon?: Icon;
} & BaseButton.Props;

const variantClasses: Record<ButtonVariant, string> = {
  danger: "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]",
  default: "bg-neutral-800 text-white hover:bg-neutral-700 active:scale-[0.98]",
  filled: "bg-primary text-zinc-950 hover:bg-white transform hover:-translate-y-1 active:scale-[0.98]",
  ghost: "bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-[0.98]",
  outline: "border border-neutral-700 bg-transparent text-white hover:bg-neutral-800 active:scale-[0.98]",
  subtle: "bg-transparent text-white hover:bg-white/5 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "py-5 px-10 text-base",
  md: "py-3 px-8 text-sm",
  sm: "py-3 px-6 text-xs",
  xl: "py-6 px-12 text-lg",
  xs: "py-2 px-4 text-[10px]",
};

const iconSizeClasses: Record<ButtonSize, number> = {
  lg: 20,
  md: 18,
  sm: 16,
  xl: 24,
  xs: 14,
};

export const Button = ({
  children,
  className,
  disabled,
  leftIcon: LeftIcon,
  loading,
  rightIcon: RightIcon,
  size = "md",
  variant = "filled",
  ...props
}: ButtonProps) => {
  const iconSize = iconSizeClasses[size];

  return (
    <BaseButton
      className={cn(
        "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 gap-3",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      {...props}
    >
      {loading ? <IconLoader2 className="animate-spin" size={iconSize} /> : LeftIcon && <LeftIcon size={iconSize} />}
      {children}
      {!loading && RightIcon && <RightIcon size={iconSize} />}
    </BaseButton>
  );
};
