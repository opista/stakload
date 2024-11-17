import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { storage } from "../api";

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
      name: "interface_settings",
      storage: createJSONStorage(() => storage),
    },
  ),
);
