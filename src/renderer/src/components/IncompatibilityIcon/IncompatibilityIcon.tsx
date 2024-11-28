import { TooltipIcon } from "@components/TooltipIcon/TooltipIcon";
import { IconAlertOctagon, IconProps } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const IncompatibilityIcon = ({ color, size }: IconProps) => {
  const { t } = useTranslation();

  return (
    <TooltipIcon
      icon={IconAlertOctagon}
      themeIconProps={{
        color,
        size,
        variant: "filled",
      }}
      tooltipProps={{
        label: t("gameDetails.gameNotNative"),
      }}
    />
  );
};
