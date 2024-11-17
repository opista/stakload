import { useEffect, useState } from "react";
import { useInterval } from "@mantine/hooks";

const BATTERY_DETAILS_UPDATE_FREQUENCY = 60_000;

interface BatteryType {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: number | null;
  onchargingtimechange: number | null;
  ondischargingtimechange: number | null;
  onlevelchange: number | null;
}

type BatteryDetails = {
  isCharging: boolean;
  percentage: number;
};

const getBatteryDetails = async (): Promise<BatteryDetails> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await (window.navigator as any).getBattery()) as BatteryType;

  return {
    isCharging: data.charging,
    percentage: data.level * 100,
  };
};

export const useBatteryDetails = () => {
  const [batteryDetails, setBatteryDetails] = useState<BatteryDetails>({
    isCharging: false,
    percentage: 100,
  });

  const updateBatteryDetails = async () => {
    const details = await getBatteryDetails();

    if (!details) return;

    setBatteryDetails(details);
  };

  const interval = useInterval(() => {
    updateBatteryDetails();
  }, BATTERY_DETAILS_UPDATE_FREQUENCY);

  useEffect(() => {
    updateBatteryDetails();
    interval.start();
    return () => interval.stop();
  }, []);

  return batteryDetails;
};
