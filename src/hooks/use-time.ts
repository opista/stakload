import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";

type UseTimeOptions = {
  format?: "12h" | "24h";
  intervalMs?: number;
  showSeconds?: boolean;
};

export const useTime = ({
  format = "24h",
  intervalMs = 1000,
  showSeconds = true,
}: UseTimeOptions = {}) => {
  const [date, setDate] = useState<Date>(new Date());

  const interval = useInterval(() => {
    setDate(new Date());
  }, intervalMs);

  useEffect(() => {
    interval.start();
    return () => interval.stop();
  }, []);

  return date.toLocaleTimeString(undefined, {
    hour: format === "12h" ? "numeric" : "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
    hour12: format === "12h",
  });
};
