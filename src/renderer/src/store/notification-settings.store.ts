import { persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStorage } from "@util/create-conf-storage";
import { NotificationSettingsState } from "@contracts/store/notification-settings";

const conf = new Conf();

type NotificationSettingsActions = {
  setLowBattery: (lowBattery: NotificationSettingsState["lowBattery"]) => void;
  setNetworkDisconnect: (networkDisconnect: NotificationSettingsState["networkDisconnect"]) => void;
};

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
      storage: createConfStorage(conf),
    },
  ),
);
