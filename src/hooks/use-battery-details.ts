import { useEffect, useState } from "react";
import { useInterval } from "@mantine/hooks";

export interface BatteryDetails {
  isCharging: boolean;
  percentage: number | null;
}

const getBatteryDetails = async (): Promise<BatteryDetails> => {
  // https://learn.microsoft.com/en-gb/windows/win32/cimwin32prov/win32-battery?redirectedfrom=MSDN
  // const result = await os.execCommand("WMIC PATH Win32_Battery Get EstimatedChargeRemaining")
  // console.log(result)
  return Promise.resolve({
    isCharging: false,
    percentage: Math.ceil(Math.random() * 100),
  });
};

export const useBatteryDetails = (updateFrequencyMs = 60000) => {
  const [batteryDetails, setBatteryDetails] = useState<BatteryDetails>({
    isCharging: false,
    percentage: null,
  });

  const updateBatteryDetails = async () => {
    const details = await getBatteryDetails();
    setBatteryDetails(details);
  };

  const interval = useInterval(() => {
    updateBatteryDetails();
  }, updateFrequencyMs);

  useEffect(() => {
    updateBatteryDetails();
    interval.start();
    return () => interval.stop();
  }, []);

  return batteryDetails;
};
