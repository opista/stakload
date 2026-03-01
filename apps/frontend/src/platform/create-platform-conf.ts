import { Conf } from "electron-conf/renderer";

type ConfStore = Pick<Conf, "delete" | "get" | "set">;

class BrowserConf implements ConfStore {
  constructor(private readonly name = "config") {}

  private buildKey(key: string): string {
    return `stakload:${this.name}:${key}`;
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(this.buildKey(key));
  }

  async get(key: string): Promise<unknown> {
    const value = localStorage.getItem(this.buildKey(key));
    return value ? JSON.parse(value) : undefined;
  }

  async set(key: string, value: unknown): Promise<void> {
    localStorage.setItem(this.buildKey(key), JSON.stringify(value));
  }
}

const hasElectronConfBridge = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const globalWindow = window as Window & {
    __ELECTRON_CONF__?: unknown;
    electron?: {
      ipcRenderer?: unknown;
    };
  };

  return Boolean(globalWindow.__ELECTRON_CONF__ || globalWindow.electron?.ipcRenderer);
};

export function createPlatformConf(name?: string): ConfStore {
  if (hasElectronConfBridge()) {
    return new Conf(name ? { name } : undefined);
  }

  return new BrowserConf(name);
}
