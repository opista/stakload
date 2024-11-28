export type UIMode = "desktop" | "gaming";

export type InterfaceSettingsState = {
  defaultUI: UIMode;
  displayBattery: boolean;
  displayBatteryPercent: boolean;
  displayNetwork: boolean;
  displaySeconds: boolean;
  displayTime: boolean;
  theme: string;
};
