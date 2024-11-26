import { IpcMainInvokeEvent, safeStorage } from "electron";

export const encrypt = (_event: IpcMainInvokeEvent, str: string) => {
  const buf = safeStorage.encryptString(str);
  return buf.toString("latin1");
};

export const decrypt = (_event: IpcMainInvokeEvent, str: string) => {
  const buf = Buffer.from(str, "latin1");
  return safeStorage.decryptString(buf);
};
