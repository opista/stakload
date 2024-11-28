import { persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStorage } from "@util/create-conf-storage";

const conf = new Conf();

export type UIMode = "desktop" | "gaming";

interface InterfaceSettingsState {
  defaultUI: UIMode;
  displayBattery: boolean;
  displayBatteryPercent: boolean;
  displayNetwork: boolean;
  displaySeconds: boolean;
  displayTime: boolean;
  theme: string;
}

interface InterfaceSettingsActions {
  setDefaultUI: (defaultUI: InterfaceSettingsState["defaultUI"]) => void;
  setDisplayBattery: (displayBattery: InterfaceSettingsState["displayBattery"]) => void;
  setDisplayBatteryPercent: (displayBatteryPercent: InterfaceSettingsState["displayBatteryPercent"]) => void;
  setDisplayNetwork: (displayNetwork: InterfaceSettingsState["displayNetwork"]) => void;
  setDisplaySeconds: (displaySeconds: InterfaceSettingsState["displaySeconds"]) => void;
  setDisplayTime: (displayTime: InterfaceSettingsState["displayTime"]) => void;
  setTheme: (theme: InterfaceSettingsState["theme"]) => void;
}

type InterfaceSettingsStore = InterfaceSettingsState & InterfaceSettingsActions;

export const useInterfaceSettingsStore = create<InterfaceSettingsStore>()(
  persist(
    (set) => ({
      defaultUI: "desktop",
      displayBattery: true,
      displayBatteryPercent: true,
      displayNetwork: true,
      displaySeconds: true,
      displayTime: true,
      theme: "violet",
      setDefaultUI: (defaultUI) => set({ defaultUI }),
      setDisplayBattery: (displayBattery) => set({ displayBattery }),
      setDisplayBatteryPercent: (displayBatteryPercent) => set({ displayBatteryPercent }),
      setDisplayNetwork: (displayNetwork) => set({ displayNetwork }),
      setDisplaySeconds: (displaySeconds) => set({ displaySeconds }),
      setDisplayTime: (displayTime) => set({ displayTime }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "interface_settings",
      storage: createConfStorage(conf),
    },
  ),
);
