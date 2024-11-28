import { IpcMainInvokeEvent } from "electron";
import { decryptString, encryptString } from "../util/safe-storage";

export const decrypt = (_event: IpcMainInvokeEvent, str: string) => decryptString(str);
export const encrypt = (_event: IpcMainInvokeEvent, str: string) => encryptString(str);
