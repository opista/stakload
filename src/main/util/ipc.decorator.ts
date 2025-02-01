/* eslint-disable @typescript-eslint/no-explicit-any */

import { IpcMainEvent, IpcMainInvokeEvent } from "electron";

type IpcHandler = (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any;
type IpcListener = (event: IpcMainEvent, ...args: any[]) => void;

export function IpcHandle(channel: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const constructor = target.constructor;
    if (!constructor._ipcHandlers) {
      constructor._ipcHandlers = [];
    }

    constructor._ipcHandlers.push({
      channel,
      handler: descriptor.value,
      type: "handle",
    });

    return descriptor;
  };
}

export function IpcOn(channel: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const constructor = target.constructor;
    if (!constructor._ipcHandlers) {
      constructor._ipcHandlers = [];
    }

    constructor._ipcHandlers.push({
      channel,
      handler: descriptor.value,
      type: "on",
    });

    return descriptor;
  };
}
