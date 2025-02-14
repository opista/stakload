import { app } from "electron";
import { join, resolve } from "path";

export const BIN_DIR = resolve(__dirname, "..", "..", "bin");

export const DATABASE_PATH = join(app.getPath("userData"), "databases");
