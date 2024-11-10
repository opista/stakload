import { Box, Text } from "@mantine/core";
import { useTime } from "../../hooks/use-time";
import classes from "./Clock.module.css";

type ClockProps = {
  showSeconds?: boolean;
};

export const Clock = ({ showSeconds = true }: ClockProps = {}) => {
  const time = useTime({ showSeconds });

  return (
    <Box>
      <Text className={classes.text}>{time}</Text>
    </Box>
  );
};
