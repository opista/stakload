import { useSettings } from "./use-settings";

type TimeSettings = {
  displayTime: boolean;
  displaySeconds: boolean;
};

const DEFAULT_SETTINGS = {
  displayTime: true,
  displaySeconds: true,
};

export const useTimeSettings = () => {
  const { loaded, settings, updateSetting } = useSettings<TimeSettings>(
    "time",
    DEFAULT_SETTINGS
  );

  return {
    timeSettings: settings,
    timeSettingsLoaded: loaded,
    updateTimeSetting: updateSetting,
  };
};
