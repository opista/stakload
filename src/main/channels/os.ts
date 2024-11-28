import { Platform } from "@contracts/database/games";
import os from "os";

export const getOS = (): Platform | null => {
  const platform = os.platform();

  switch (platform) {
    case "linux":
      return "linux";

    case "darwin":
      return "mac";

    case "win32":
      return "windows";

    default:
      return null;
  }
};
