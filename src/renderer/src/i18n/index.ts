import { use } from "i18next";
import { initReactI18next } from "react-i18next";

import enGB from "./locales/en-GB.json";

void use(initReactI18next).init({
  debug: true,
  fallbackLng: "en-GB",
  resources: {
    "en-GB": { translation: enGB },
  },
});
