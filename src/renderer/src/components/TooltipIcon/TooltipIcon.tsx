import { Tooltip, TooltipProps } from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";
import { cn } from "@util/cn";
import { CSSProperties } from "react";

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
  tooltipProps: Omit<TooltipProps, "children">;
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
  const { maw = "200", position = "bottom-start", ...restTooltipProps } = tooltipProps;

  const sizeClass = typeof size === "string" ? SIZE_MAP[size] : "";

  const dimensionStyle = typeof size === "number" ? { height: size, width: size } : {};

  return (
    <Tooltip
      events={{ focus: true, hover: true, touch: false }}
      maw={maw}
      multiline
      position={position}
      {...restTooltipProps}
    >
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
