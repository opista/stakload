import { app } from "electron";
import { resolve } from "path";

export const BIN_DIR = app.isPackaged
  ? resolve(process.resourcesPath, "app.asar.unpacked", "bin")
  : resolve(__dirname, "..", "..", "bin");
