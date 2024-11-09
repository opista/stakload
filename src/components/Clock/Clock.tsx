import { Box, Text } from "@mantine/core";
import { useTime } from "../../hooks/use-time";
import classes from "./Clock.module.css";

type ClockProps = {
  format?: "12h" | "24h";
  showSeconds?: boolean;
};

export const Clock = ({
  format = "24h",
  showSeconds = true,
}: ClockProps = {}) => {
  const time = useTime({ format, showSeconds });

  return (
    <Box>
      <Text className={classes.text}>{time}</Text>
    </Box>
  );
};
