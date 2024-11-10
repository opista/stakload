import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { neutralinoStorage } from "../util/neutralino-storage";

type InterfaceSettingsState = {
  displaySeconds: boolean;
  displayTime: boolean;
  theme: string;
};

type InterfaceSettingsActions = {
  setDisplaySeconds: (
    displaySeconds: InterfaceSettingsState["displaySeconds"]
  ) => void;
  setDisplayTime: (displayTime: InterfaceSettingsState["displayTime"]) => void;
  setTheme: (theme: InterfaceSettingsState["theme"]) => void;
};

type InterfaceSettingsStore = InterfaceSettingsState & InterfaceSettingsActions;

export const useInterfaceSettingsStore = create<InterfaceSettingsStore>()(
  persist(
    (set) => ({
      displaySeconds: true,
      displayTime: true,
      theme: "orange",
      setDisplaySeconds: (displaySeconds) => set({ displaySeconds }),
      setDisplayTime: (displayTime) => set({ displayTime }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "interface_settings",
      storage: createJSONStorage(() => neutralinoStorage),
    }
  )
);
