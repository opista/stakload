export const getBatteryInfo = () => window.api.getBatteryInfo();

export const getLocale = () => window.api.getLocale();

export const openWebpage = (url: string) => window.api.openWebpage(url);

export const power = {
  closeApp: window.api.closeApp,
  restartApp: window.api.restartApp,
  restartDevice: window.api.restartDevice,
  shutdownDevice: window.api.shutdownDevice,
  sleepDevice: window.api.sleepDevice,
};
