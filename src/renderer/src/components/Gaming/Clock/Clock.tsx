import { useTime } from "@hooks/use-time";
import { Text } from "@mantine/core";

import classes from "./Clock.module.css";

type ClockProps = {
  showSeconds?: boolean;
};

export const Clock = ({ showSeconds = true }: ClockProps = {}) => {
  const time = useTime({ showSeconds });
  return <Text className={classes.text}>{time}</Text>;
};
