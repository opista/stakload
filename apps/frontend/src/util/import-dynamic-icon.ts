import { FC } from "react";

import { IconProps } from "@icons/index";
import * as Icons from "@icons/index";

export const importDynamicIcon = (name: string | undefined): FC<IconProps> | null => {
  if (!name) return null;
  const IconComponent = Icons[name as keyof typeof Icons] as FC<IconProps>;
  return IconComponent || null;
};
