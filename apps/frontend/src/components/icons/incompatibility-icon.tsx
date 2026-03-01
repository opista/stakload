import { TooltipIcon } from "@components/icons/tooltip-icon";
import { IconAlertOctagon } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const IncompatibilityIcon = () => {
  const { t } = useTranslation();

  return (
    <TooltipIcon
      icon={IconAlertOctagon}
      themeIconProps={{
        className: "bg-orange-700",
        size: "xl",
        variant: "filled",
      }}
      tooltipProps={{
        label: t("incompatibilityIcon.gameNotNative"),
      }}
    />
  );
};
