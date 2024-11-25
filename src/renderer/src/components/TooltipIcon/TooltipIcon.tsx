import { Icon, IconProps } from "@tabler/icons-react";
import { ThemeIcon, ThemeIconProps, Tooltip, TooltipProps } from "@mantine/core";

type TooltipIconProps = {
  icon: Icon;
  iconProps?: IconProps;
  themeIconProps: ThemeIconProps;
  tooltipProps: Omit<TooltipProps, "children">;
};

export const TooltipIcon = ({ icon: Icon, iconProps, themeIconProps, tooltipProps }: TooltipIconProps) => {
  const { variant = "default", ...restThemeIconProps } = themeIconProps;
  const { position = "bottom-start", w = "200", ...restTooltipProps } = tooltipProps;

  return (
    <Tooltip multiline position={position} w={w} {...restTooltipProps}>
      <ThemeIcon variant={variant} {...restThemeIconProps}>
        <Icon {...iconProps} style={{ width: "80%", height: "80%" }} stroke={1.5} />
      </ThemeIcon>
    </Tooltip>
  );
};
