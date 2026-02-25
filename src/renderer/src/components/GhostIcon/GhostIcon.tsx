import { IconGhost3Filled } from "@icons/index";
import { cn } from "@util/cn";

import classes from "./GhostIcon.module.css";

type GhostIconProps = {
  className?: string;
  size?: number;
};

export const GhostIcon = ({ className, size = 100 }: GhostIconProps) => {
  return (
    <div className={cn("flex flex-col items-center", className)} style={{ width: size }}>
      <IconGhost3Filled className={classes.icon} size={size} />
      <div className={classes.shadow}></div>
    </div>
  );
};
