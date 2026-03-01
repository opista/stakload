import { safeStorage } from "electron";

export const encryptString = (str: string) => {
  const buf = safeStorage.encryptString(str);
  return buf.toString("latin1");
};

export const decryptString = (str: string) => {
  const buf = Buffer.from(str, "latin1");
  return safeStorage.decryptString(buf);
};
