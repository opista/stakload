import { BrowserWindow } from "electron";

export type NetworkRequestHandler = (
  window: BrowserWindow,
  event,
  url: string,
  httpResponseCode: number,
  httpStatusText: string,
) => void;

export type ChildWindowOptions = {
  clearCookies?: boolean;
  height: number;
  networkRequestHandler: NetworkRequestHandler;
  sessionId: string;
  url: string;
  width: number;
};
