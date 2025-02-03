import { app } from "electron";
import { join, resolve } from "path";

export const BIN_DIR = resolve(__dirname, "..", "..", "bin");
export const IS_WINDOWS = process.platform === "win32";

export const DATABASE_PATH = join(app.getPath("userData"), "databases");
