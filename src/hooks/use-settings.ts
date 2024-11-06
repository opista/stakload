import { storage } from "@neutralinojs/lib";
import { useEffect, useState } from "react";

type Settings = {
  foo: string;
  bar: number;
};

const SETTINGS_KEY = "user_settings";

const DEFAULT_SETTINGS: Settings = {
  foo: "",
  bar: 0,
};

export const useSettings = () => {
  const [settings, updateSettingsState] = useState(DEFAULT_SETTINGS);

  const getSettings = async () => {
    try {
      const value = await storage.getData(SETTINGS_KEY);
      if (value) {
        updateSettingsState(JSON.parse(value));
      }
      return updateSettings(JSON.parse(value));
    } catch (err) {
      return undefined;
    }
  };

  const updateSettings = async (data: Settings) => {
    console.log("triggered change?", data);
    updateSettingsState(data);
    await storage.setData(SETTINGS_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    getSettings();
  }, []);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) =>
    updateSettings({
      ...settings,
      [key]: value,
    });

  return { settings, updateSetting };
};
