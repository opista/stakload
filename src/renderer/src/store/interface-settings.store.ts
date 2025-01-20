import { InterfaceSettingsState } from "@contracts/store/interface-settings";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

type InterfaceSettingsActions = {
  setDefaultUI: (defaultUI: InterfaceSettingsState["defaultUI"]) => void;
  setDisplayBattery: (displayBattery: InterfaceSettingsState["displayBattery"]) => void;
  setTheme: (theme: InterfaceSettingsState["theme"]) => void;
};

type InterfaceSettingsStore = InterfaceSettingsState & InterfaceSettingsActions;

export const useInterfaceSettingsStore = create<InterfaceSettingsStore>()(
  persist(
    (set) => ({
      defaultUI: "desktop",
      displayBattery: true,
      setDefaultUI: (defaultUI) => set({ defaultUI }),
      setDisplayBattery: (displayBattery) => set({ displayBattery }),
      setTheme: (theme) => set({ theme }),
      theme: "violet",
    }),
    {
      name: "interface_settings",
      storage: createConfStorage(conf),
    },
  ),
);
