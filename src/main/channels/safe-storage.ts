import { decryptString, encryptString } from "@util/safe-storage";
import { IpcMainInvokeEvent } from "electron";

export const decrypt = (_event: IpcMainInvokeEvent, str: string) => decryptString(str);
export const encrypt = (_event: IpcMainInvokeEvent, str: string) => encryptString(str);
