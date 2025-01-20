import { useBatteryDetails } from "@hooks/use-battery-details";
import { Box, Text, UnstyledButton } from "@mantine/core";
import {
  IconBatteryCharging,
  IconBatteryVertical1,
  IconBatteryVertical2,
  IconBatteryVertical3,
  IconBatteryVertical4,
} from "@tabler/icons-react";

import classes from "./BatteryIndicator.module.css";

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

export const BatteryIndicator = () => {
  const { isCharging, percentage } = useBatteryDetails();

  if (!percentage) return null;

  const Icon = BatteryIcon(isCharging, percentage);

  return (
    <Box className={classes.container}>
      <Text size="sm">{percentage}%</Text>
      <UnstyledButton className={classes.button}>
        <Icon color={percentage <= 15 ? "var(--mantine-color-red-8)" : undefined} stroke={1.5} />
      </UnstyledButton>
    </Box>
  );
};
