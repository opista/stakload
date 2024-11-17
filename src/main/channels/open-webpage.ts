import { IpcMainEvent, shell } from "electron";

export const openWebpage = (_event: IpcMainEvent, url: string) => shell.openExternal(url, { activate: true });
