import "react-i18next";

import enGB from "./i18n/locales/en-gb.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "en-GB";
    resources: {
      "en-GB": typeof enGB;
      // any other languages you would like to type
    };
  }
}
