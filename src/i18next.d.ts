import "react-i18next";
import en from "./i18n/locales/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "en";
    resources: {
      en: typeof en;
      // any other languages you would like to type
    };
  }
}
