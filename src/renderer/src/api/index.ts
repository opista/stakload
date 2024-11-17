export const getBatteryInfo = () => window.api.getBatteryInfo();

export const getLocale = () => window.api.getLocale();

export const openWebpage = (url: string) => window.api.openWebpage(url);

export const storage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};
