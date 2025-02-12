import { ipcRenderer, IpcRendererEvent } from "electron";

export type Listener<T = unknown> = (event: IpcRendererEvent, ...args: T[]) => void;
export type RemoveListenerFunction = () => void;

export const listenerHandler = <T>(channel: string, listener: Listener<T>): RemoveListenerFunction => {
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.off(channel, listener);
};
