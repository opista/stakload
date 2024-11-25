import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStoreWrapper } from "./create-conf-store-wrapper";

const conf = new Conf();

interface NotificationSettingsState {
  lowBattery: number;
  networkDisconnect: boolean;
}

interface NotificationSettingsActions {
  setLowBattery: (lowBattery: NotificationSettingsState["lowBattery"]) => void;
  setNetworkDisconnect: (networkDisconnect: NotificationSettingsState["networkDisconnect"]) => void;
}

type NotificationSettingsStore = NotificationSettingsState & NotificationSettingsActions;

export const useNotificationSettingsStore = create<NotificationSettingsStore>()(
  persist(
    (set) => ({
      lowBattery: 10,
      networkDisconnect: true,
      setLowBattery: (lowBattery) => set({ lowBattery }),
      setNetworkDisconnect: (networkDisconnect) => set({ networkDisconnect }),
    }),
    {
      name: "notification_settings",
      storage: createJSONStorage(() => createConfStoreWrapper(conf)),
    },
  ),
);
