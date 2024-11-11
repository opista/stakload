import { useEffect, useState } from "react";
import { useInterval } from "@mantine/hooks";

interface UseTimeOptions {
  showSeconds?: boolean;
}

export const useTime = ({ showSeconds = true }: UseTimeOptions = {}) => {
  const [date, setDate] = useState<Date>(new Date());
  const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
    timeStyle: showSeconds ? "medium" : "short",
  });

  const interval = useInterval(() => setDate(new Date()), showSeconds ? 1000 : 60000);

  useEffect(() => {
    interval.start();
    return () => interval.stop();
  }, [showSeconds]);

  return timeFormatter.format(date);
};
