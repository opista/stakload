import {
  ActionIcon as MantineActionIcon,
  ActionIconProps as MantineActionIconProps,
  PolymorphicComponentProps,
  VisuallyHidden,
} from "@mantine/core";
import { IconProps } from "@tabler/icons-react";
import { ComponentType, forwardRef, memo } from "react";

import classes from "./ActionIcon.module.css";

type ActionIconProps = {
  "aria-label": string;
  icon: ComponentType<IconProps>;
  iconStroke?: number;
} & PolymorphicComponentProps<"button", MantineActionIconProps>;

const ActionIcon = memo(
  forwardRef<HTMLButtonElement, ActionIconProps>(
    ({ icon: Icon, iconStroke = 1, size = "lg", variant = "default", ...props }, ref) => (
      <MantineActionIcon ref={ref} size={size} variant={variant} {...props}>
        <VisuallyHidden>{props["aria-label"]}</VisuallyHidden>
        <Icon className={classes.icon} stroke={iconStroke} />
      </MantineActionIcon>
    ),
  ),
);

ActionIcon.displayName = "ActionIcon";

export default ActionIcon;
