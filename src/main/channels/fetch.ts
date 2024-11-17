import { IpcMainInvokeEvent } from "electron";

export const nodeFetch = async (_event: IpcMainInvokeEvent, ...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args);
  const parsed = await response.json();
  return parsed;
};
