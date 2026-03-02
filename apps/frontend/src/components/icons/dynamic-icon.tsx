import { IconProps } from "@tabler/icons-react";

import { importDynamicIcon } from "@util/import-dynamic-icon";

type DynamicIconProps = IconProps & {
  icon: string;
};

export const DynamicIcon = ({ icon, ...props }: DynamicIconProps) => {
  const IconComponent = importDynamicIcon(icon);
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};
