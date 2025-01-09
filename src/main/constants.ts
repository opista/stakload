import { resolve } from "path";

export const BIN_DIR = resolve(__dirname, "..", "..", "bin");
export const IS_WINDOWS = process.platform === "win32";
