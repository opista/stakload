import { Loader, ThemeIcon, ThemeIconProps, Tooltip, TooltipProps } from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";

type TooltipIconProps = {
  icon: Icon;
  iconProps?: IconProps;
  loading?: boolean;
  themeIconProps: ThemeIconProps;
  tooltipProps: Omit<TooltipProps, "children">;
};

export const TooltipIcon = ({ icon: Icon, iconProps, loading, themeIconProps, tooltipProps }: TooltipIconProps) => {
  const { variant = "default", ...restThemeIconProps } = themeIconProps;
  const { color, maw = "200", position = "bottom-start", ...restTooltipProps } = tooltipProps;

  return (
    <Tooltip
      events={{ hover: true, focus: true, touch: false }}
      maw={maw}
      multiline
      position={position}
      {...restTooltipProps}
    >
      <ThemeIcon variant={variant} {...restThemeIconProps}>
        {loading ? (
          <Loader color={color} size="sm" />
        ) : (
          <Icon {...iconProps} color={color} style={{ width: "80%", height: "80%" }} stroke={1.5} />
        )}
      </ThemeIcon>
    </Tooltip>
  );
};
