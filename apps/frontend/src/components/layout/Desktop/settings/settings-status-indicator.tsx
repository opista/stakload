import { Icon, IconProps } from "@tabler/icons-react";

import { cn } from "@util/cn";

type SettingsStatusIndicatorProps = {
  className?: string;
  icon: Icon;
  iconProps: IconProps;
  mounted: boolean;
  text: string;
};

export const SettingsStatusIndicator = ({
  className,
  icon: Icon,
  iconProps,
  mounted,
  text,
}: SettingsStatusIndicatorProps) => (
  <div
    className={cn(
      "flex items-center gap-1 transition-all duration-300 ease-out",
      mounted ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
      className,
    )}
  >
    <Icon {...iconProps} size={24} />
    <span className="text-xs font-medium">{text}</span>
  </div>
);
