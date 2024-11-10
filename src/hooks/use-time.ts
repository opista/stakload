import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";

type UseTimeOptions = {
  intervalMs?: number;
  showSeconds?: boolean;
};

export const useTime = ({
  intervalMs = 1000,
  showSeconds = true,
}: UseTimeOptions = {}) => {
  const [date, setDate] = useState<Date>(new Date());
  const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: showSeconds ? "medium" : "short",
  });

  const interval = useInterval(() => setDate(new Date()), intervalMs);

  useEffect(() => {
    interval.start();
    return () => interval.stop();
  }, []);

  return timeFormatter.format(date);
};
