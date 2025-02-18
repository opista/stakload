import { IconGhost3Filled } from "@icons/index";
import { Stack } from "@mantine/core";

import classes from "./GhostIcon.module.css";

type GhostIconProps = {
  size?: number;
};

export const GhostIcon = ({ size = 100 }: GhostIconProps) => {
  return (
    <Stack align="center" w={size}>
      <IconGhost3Filled className={classes.icon} size={size} />
      <div className={classes.shadow}></div>
    </Stack>
  );
};
