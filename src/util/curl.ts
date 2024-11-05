import { events, os } from "@neutralinojs/lib";
import fetchToCurl from "fetch-to-curl";

const getCurlPath = () => {
  const prefix = window.NL_OS === "Windows" ? window.NL_CWD : window.NL_PATH;
  return `${prefix}/extensions/curl/bin/`;
};

const performCurl = async <T extends any>(args: string): Promise<T> =>
  new Promise(async (resolve, reject) => {
    const data: string[] = [];
    const err: string[] = [];

    const cmd = await os.spawnProcess(`${getCurlPath()}${args} -k`);

    events.on("spawnedProcess", async (e) => {
      if (cmd.id == e.detail.id) {
        switch (e.detail.action) {
          case "stdOut":
            data.push(e.detail.data);
            break;
          case "stdErr":
            err.push(e.detail.data);
            break;
          case "exit":
            if (e.detail.data === 0) {
              const formatted = JSON.parse(data.join(""));
              resolve(formatted);
            } else {
              const formatted = JSON.parse(err.join(""));
              reject(formatted);
            }
            break;
        }
      }
    });
  });

export const neutralinoCurl = <T extends any>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const curlRequest = fetchToCurl(url, options);
  return performCurl(curlRequest);
};
