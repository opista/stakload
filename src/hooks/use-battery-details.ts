import { useEffect, useState } from "react";
import { useInterval } from "@mantine/hooks";
import { executeCommand } from "../backend";
import { parseXml } from "../util/parseXml";

const BATTERY_DETAILS_UPDATE_FREQUENCY = 60_000;

export interface BatteryDetails {
  isCharging: boolean;
  percentage: number | null;
}

const getBatteryDetails = async (): Promise<BatteryDetails> => {
  // https://learn.microsoft.com/en-gb/windows/win32/cimwin32prov/win32-battery?redirectedfrom=MSDN
  const result = await executeCommand(
    "WMIC PATH Win32_Battery Get EstimatedChargeRemaining /format:RAWXML",
  );

  const parsed = parseXml(result.stdOut);
  const data = parsed?.COMMAND?.RESULTS;
  const err = data?.ERROR?.DESCRIPTION;

  if (!data || err) {
    //   /**
    //    * TODO - We should probably disable the battery option
    //    * here to prevent it constantly trying to fetch the
    //    * information when we know it doesn't exist. Alternatively
    //    * we can check the device type and turn this on/off based
    //    * upon that. If the device type is not a portable device,
    //    * we can just always shows 100% battery
    //    */
    console.debug("Failed to fetch battery status:", err);
    return {
      isCharging: false,
      percentage: 100,
    };
  }

  /**
   * TODO - I need a battery-powered windows
   * device so that I can parse the response
   */

  return {
    isCharging: false,
    percentage: Math.ceil(Math.random() * 100),
  };
};

export const useBatteryDetails = () => {
  const [batteryDetails, setBatteryDetails] = useState<BatteryDetails>({
    isCharging: false,
    percentage: null,
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
