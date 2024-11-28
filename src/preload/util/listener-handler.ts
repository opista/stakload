import { ipcRenderer, IpcRendererEvent } from "electron";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener = (event: IpcRendererEvent, ...args: any[]) => void;
export type RemoveListenerFunction = () => void;

export const listenerHandler = (channel: string, listener: Listener): RemoveListenerFunction => {
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.off(channel, listener);
};
