import { resolve } from "path";

import { app } from "electron";

export const BIN_DIR = app.isPackaged
  ? resolve(process.resourcesPath, "app.asar.unpacked", "bin")
  : resolve(__dirname, "..", "..", "bin");
