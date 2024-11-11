import { Box, Text } from "@mantine/core";
import classes from "./Clock.module.css";
import { useTime } from "../../hooks/use-time";

interface ClockProps {
  showSeconds?: boolean;
}

export const Clock = ({ showSeconds = true }: ClockProps = {}) => {
  const time = useTime({ showSeconds });

  return (
    <Box>
      <Text className={classes.text}>{time}</Text>
    </Box>
  );
};
