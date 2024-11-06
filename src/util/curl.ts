import { os } from "@neutralinojs/lib";
import fetchToCurl from "fetch-to-curl";

const getCurlPath = () => {
  const extensionPath = "extensions/curl";
  if (window.NL_OS === "Windows") {
    return [
      window.NL_CWD,
      extensionPath,
      `windows-${window.NL_ARCH}`,
      "bin",
    ].join("/");
  }

  return [window.NL_PATH, extensionPath, `mac-${window.NL_ARCH}`, "bin"].join(
    "/"
  );
};

export const curl = async <T extends any>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const command = fetchToCurl(url, options);

  const result = await os.execCommand(`${getCurlPath()}/${command} -k`);

  console.log(result, `${getCurlPath()}/${command} -k`);

  if (result?.exitCode !== 0) {
    throw new Error(`cURL failed - ${result.stdErr}`);
  }

  return result.stdOut as T;
};
