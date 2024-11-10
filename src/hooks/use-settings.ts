import { storage } from "@neutralinojs/lib";
import { useEffect, useState } from "react";

const SETTINGS_KEY_PREFIX = "user_settings";

export const useSettings = <T>(storageKey: string, defaultSettings: T) => {
  const STORAGE_KEY = [SETTINGS_KEY_PREFIX, storageKey].join("_");
  const [settings, updateSettings] = useState(defaultSettings);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const value = await storage.getData(STORAGE_KEY);
        if (value) {
          updateSettings((prevSettings) => ({
            ...prevSettings,
            ...JSON.parse(value),
          }));
        }
        setLoaded(true);
      } catch (err) {
        console.error("Error loading settings:", err);
        setLoaded(true);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const saveSettings = async () => {
      try {
        await storage.setData(STORAGE_KEY, JSON.stringify(settings));
      } catch (err) {
        console.error("Error saving settings:", err);
      }
    };

    saveSettings();
  }, [settings, loaded]);

  const updateSetting = <K extends keyof T>(key: K, value: T[K]) => {
    updateSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return { loaded, settings, updateSetting };
};
