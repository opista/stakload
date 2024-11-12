import { Text } from "@mantine/core";
import { useTime } from "../../hooks/use-time";
import classes from "./Clock.module.css";

interface ClockProps {
  showSeconds?: boolean;
}

export const Clock = ({ showSeconds = true }: ClockProps = {}) => {
  const time = useTime({ showSeconds });
  return <Text className={classes.text}>{time}</Text>;
};
