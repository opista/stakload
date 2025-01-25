import { IconProps } from "@icons/index";
import * as Icons from "@icons/index";
import { FC } from "react";

export const importDynamicIcon = (name: string, fallback: FC<IconProps>): FC<IconProps> => {
  const IconComponent = Icons[name as keyof typeof Icons] as FC<IconProps>;
  return IconComponent || fallback;
};
