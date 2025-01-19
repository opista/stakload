import { Loader, ThemeIcon, ThemeIconProps, Tooltip, TooltipProps } from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";

import classes from "./TooltipIcon.module.css";

type TooltipIconProps = {
  icon: Icon;
  iconProps?: IconProps;
  loading?: boolean;
  themeIconProps: ThemeIconProps;
  tooltipProps: Omit<TooltipProps, "children">;
};

export const TooltipIcon = ({
  icon: Icon,
  iconProps = {},
  loading,
  themeIconProps,
  tooltipProps,
}: TooltipIconProps) => {
  const { style, ...restIconProps } = iconProps;
  const { variant = "default", ...restThemeIconProps } = themeIconProps;
  const { maw = "200", position = "bottom-start", ...restTooltipProps } = tooltipProps;

  return (
    <Tooltip
      events={{ focus: true, hover: true, touch: false }}
      maw={maw}
      multiline
      position={position}
      {...restTooltipProps}
    >
      <ThemeIcon className={classes.themeIcon} variant={variant} {...restThemeIconProps}>
        {loading ? (
          <Loader color={style?.color} size="sm" />
        ) : (
          <Icon className={classes.icon} {...restIconProps} stroke={1.5} style={{ ...style }} />
        )}
      </ThemeIcon>
    </Tooltip>
  );
};
