import {
  IconBatteryCharging,
  IconBatteryVertical1,
  IconBatteryVertical2,
  IconBatteryVertical3,
  IconBatteryVertical4,
} from "@tabler/icons-react";
import { useBatteryDetails } from "../../hooks/use-battery-details";
import { Box, Text, Tooltip } from "@mantine/core";
import classes from "./BatteryIndicator.module.css";
import { ConditionalWrapper } from "../ConditionalWrapper/ConditionalWrapper";
import { useTranslation } from "react-i18next";

type BatteryIndicatorProps = {
  showPercentage?: boolean;
};

const BatteryIcon = (isCharging: boolean, percentage: number) => {
  if (isCharging) {
    return IconBatteryCharging;
  } else if (percentage <= 25) {
    return IconBatteryVertical1;
  } else if (percentage <= 50) {
    return IconBatteryVertical2;
  } else if (percentage <= 75) {
    return IconBatteryVertical3;
  }

  return IconBatteryVertical4;
};

export const BatteryIndicator = ({
  showPercentage = true,
}: BatteryIndicatorProps) => {
  const { t } = useTranslation();
  const { isCharging, percentage } = useBatteryDetails();

  if (!percentage) return null;

  const Icon = BatteryIcon(isCharging, percentage);
  const tooltipLabel = isCharging
    ? `${t("charging")} - ${percentage}%`
    : `${percentage}%`;

  return (
    <Box className={classes.container}>
      {showPercentage && <Text size="sm">{percentage}%</Text>}
      <ConditionalWrapper
        condition={!showPercentage}
        wrapper={(children) => (
          <Tooltip label={tooltipLabel}>{children}</Tooltip>
        )}
      >
        <Icon color={percentage <= 15 ? "red" : undefined} />
      </ConditionalWrapper>
    </Box>
  );
};
