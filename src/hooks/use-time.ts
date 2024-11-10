import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";

type UseTimeOptions = {
  showSeconds?: boolean;
};

const createFormatter = (showSeconds: boolean) =>
  new Intl.DateTimeFormat(navigator.language, {
    timeStyle: showSeconds ? "medium" : "short",
  });

export const useTime = ({ showSeconds = true }: UseTimeOptions = {}) => {
  const [date, setDate] = useState<Date>(new Date());
  const timeFormatter = createFormatter(showSeconds);

  const interval = useInterval(() => setDate(new Date()), 1000);

  useEffect(() => {
    interval.start();
    return () => interval.stop();
  }, []);

  return timeFormatter.format(date);
};
