import { use } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

void use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  resources: {
    en: { translation: en },
  },
});
