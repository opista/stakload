export type UIMode = "desktop" | "gaming";

export type InterfaceSettingsState = {
  defaultUI: UIMode;
  displayBattery: boolean;
  theme: string;
};
