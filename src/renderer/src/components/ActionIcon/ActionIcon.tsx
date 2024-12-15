import {
  ActionIcon as MantineActionIcon,
  ActionIconProps as MantineActionIconProps,
  PolymorphicComponentProps,
  VisuallyHidden,
} from "@mantine/core";
import { IconProps } from "@tabler/icons-react";
import { FC, forwardRef } from "react";

import classes from "./ActionIcon.module.css";

type ActionIconProps = {
  "aria-label": string;
  icon: FC<IconProps>;
  iconStroke?: number;
} & PolymorphicComponentProps<"button", MantineActionIconProps>;

export const Component = (
  { icon: Icon, iconStroke = 1, size = "lg", variant = "default", ...props }: ActionIconProps,
  ref,
) => (
  <MantineActionIcon ref={ref} size={size} variant={variant} {...props}>
    <VisuallyHidden>{props["aria-label"]}</VisuallyHidden>
    <Icon className={classes.icon} stroke={iconStroke} />
  </MantineActionIcon>
);

export const ActionIcon = forwardRef<unknown, ActionIconProps>(Component);
