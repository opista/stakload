import { Icon, IconProps } from "@tabler/icons-react";
import { CSSProperties, ReactNode } from "react";

import { Tooltip } from "@components/ui/tooltip";
import { cn } from "@util/cn";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, string> = {
  lg: "h-12 w-12",
  md: "h-10 w-10",
  sm: "h-8 w-8",
  xl: "h-14 w-14",
  xs: "h-6 w-6",
};

type TooltipIconProps = {
  icon: Icon;
  iconProps?: IconProps;
  loading?: boolean;
  themeIconProps: {
    size?: Size | number;
    variant?: string;
    style?: CSSProperties;
    className?: string;
  };
  tooltipProps: {
    label: ReactNode;
    position?: any;
    offset?: number;
    className?: string;
  };
};

export const TooltipIcon = ({
  icon: Icon,
  iconProps = {},
  loading,
  themeIconProps,
  tooltipProps,
}: TooltipIconProps) => {
  const { style: iconStyle, ...restIconProps } = iconProps;
  const { className: themeClassName, size = "md", style: themeStyle } = themeIconProps;

  const sizeClass = typeof size === "string" ? SIZE_MAP[size] : "";
  const dimensionStyle = typeof size === "number" ? { height: size, width: size } : {};

  return (
    <Tooltip {...tooltipProps}>
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-lg overflow-hidden bg-neutral-800 text-white",
          sizeClass,
          themeClassName,
        )}
        style={{ ...themeStyle, ...dimensionStyle }}
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Icon className="h-[70%] w-[70%]" stroke={1.5} {...restIconProps} style={iconStyle} />
        )}
      </div>
    </Tooltip>
  );
};
