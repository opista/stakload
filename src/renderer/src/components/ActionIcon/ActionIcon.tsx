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
  icon: FC<IconProps>;
  "aria-label": string;
} & PolymorphicComponentProps<"button", MantineActionIconProps>;

export const Component = ({ icon: Icon, size = "lg", variant = "default", ...props }: ActionIconProps, ref) => (
  <MantineActionIcon ref={ref} size={size} variant={variant} {...props}>
    <VisuallyHidden>{props["aria-label"]}</VisuallyHidden>
    <Icon className={classes.icon} stroke={1} />
  </MantineActionIcon>
);

export const ActionIcon = forwardRef<unknown, ActionIconProps>(Component);
