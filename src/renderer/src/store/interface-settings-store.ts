import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStoreWrapper } from "./create-conf-store-wrapper";

const conf = new Conf();

const STORE_NAME = "interface_settings";

interface InterfaceSettingsState {
  displayBattery: boolean;
  displayBatteryPercent: boolean;
  displaySeconds: boolean;
  displayTime: boolean;
  theme: string;
}

interface InterfaceSettingsActions {
  setDisplayBattery: (displayBattery: InterfaceSettingsState["displayBattery"]) => void;
  setDisplayBatteryPercent: (displayBatteryPercent: InterfaceSettingsState["displayBatteryPercent"]) => void;
  setDisplaySeconds: (displaySeconds: InterfaceSettingsState["displaySeconds"]) => void;
  setDisplayTime: (displayTime: InterfaceSettingsState["displayTime"]) => void;
  setTheme: (theme: InterfaceSettingsState["theme"]) => void;
}

type InterfaceSettingsStore = InterfaceSettingsState & InterfaceSettingsActions;

export const useInterfaceSettingsStore = create<InterfaceSettingsStore>()(
  persist(
    (set) => ({
      displayBattery: true,
      displayBatteryPercent: true,
      displaySeconds: true,
      displayTime: true,
      theme: "violet",
      setDisplayBattery: (displayBattery) => set({ displayBattery }),
      setDisplayBatteryPercent: (displayBatteryPercent) => set({ displayBatteryPercent }),
      setDisplaySeconds: (displaySeconds) => set({ displaySeconds }),
      setDisplayTime: (displayTime) => set({ displayTime }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() => createConfStoreWrapper(conf, STORE_NAME)),
    },
  ),
);
