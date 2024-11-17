import { powerMonitor } from "electron";

/**
 * TODO - I need a battery-powered windows
 * device so that I can parse the response
 */

export type BatteryInfo = {
  isOnBatteryPower: boolean;
};

export const getBatteryInfo = async (): Promise<BatteryInfo> => {
  // TODO
  // const { stderr, stdout } = await execAsync("WMIC PATH Win32_Battery Get EstimatedChargeRemaining");

  // if (stderr) {
  //   throw new Error(stderr);
  // }

  return {
    isOnBatteryPower: powerMonitor.isOnBatteryPower(),
  };
};
