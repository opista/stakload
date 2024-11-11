import {
  app,
  events,
  init as neutralinoInit,
  storage as neutralinoStorage,
  os,
  window as neuWindow,
} from "@neutralinojs/lib";

export const executeCommand = (cmd: string) => os.execCommand(cmd);

export const init = () => {
  neutralinoInit();

  events.on("windowClose", () => app.exit());

  neuWindow.focus();
};

export const openWebpage = (url: string) => os.open(url);

export const storage = {
  getItem: (key: string) => neutralinoStorage.getData(key),
  setItem: (key: string, value: string) => neutralinoStorage.setData(key, value),
  removeItem: (key: string) =>
    neutralinoStorage.setData(
      key,
      null as unknown as string /* Neutralino lib is incorrectly typed */,
    ),
};
