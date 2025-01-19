import { InterfaceSettingsState } from "@contracts/store/interface-settings";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

type InterfaceSettingsActions = {
  setDefaultUI: (defaultUI: InterfaceSettingsState["defaultUI"]) => void;
  setDisplayBattery: (displayBattery: InterfaceSettingsState["displayBattery"]) => void;
  setDisplayBatteryPercent: (displayBatteryPercent: InterfaceSettingsState["displayBatteryPercent"]) => void;
  setDisplayNetwork: (displayNetwork: InterfaceSettingsState["displayNetwork"]) => void;
  setDisplaySeconds: (displaySeconds: InterfaceSettingsState["displaySeconds"]) => void;
  setDisplayTime: (displayTime: InterfaceSettingsState["displayTime"]) => void;
  setTheme: (theme: InterfaceSettingsState["theme"]) => void;
};

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
      setDefaultUI: (defaultUI) => set({ defaultUI }),
      setDisplayBattery: (displayBattery) => set({ displayBattery }),
      setDisplayBatteryPercent: (displayBatteryPercent) => set({ displayBatteryPercent }),
      setDisplayNetwork: (displayNetwork) => set({ displayNetwork }),
      setDisplaySeconds: (displaySeconds) => set({ displaySeconds }),
      setDisplayTime: (displayTime) => set({ displayTime }),
      setTheme: (theme) => set({ theme }),
      theme: "violet",
    }),
    {
      name: "interface_settings",
      storage: createConfStorage(conf),
    },
  ),
);
