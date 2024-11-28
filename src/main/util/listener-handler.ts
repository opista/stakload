import { randomUUID } from "crypto";
import { ipcRenderer, IpcRendererEvent } from "electron";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Listener = (event: IpcRendererEvent, ...args: any[]) => void;

export class ListenerHandler {
  private listenerMap = new Map<string, Listener>();

  add(channel: string, listener: Listener): string {
    const listenerId = randomUUID();
    this.listenerMap.set(listenerId, listener);
    ipcRenderer.on(channel, listener);
    return listenerId;
  }

  remove(channel: string, listenerId: string) {
    const listener = this.listenerMap.get(listenerId);
    if (!listener) return;
    ipcRenderer.off(channel, listener);
  }
}
