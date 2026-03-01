import { platform } from "@electron-toolkit/utils";
import { spawn } from "child_process";

import { BIN_DIR } from "../constants";

export const runApplicationCommand = async (
  application: string,
  command: string,
  args: string[] = [],
): Promise<{ stderr: string; stdout: string }> =>
  new Promise((resolve, reject) => {
    const stdout: string[] = [];
    const stderr: string[] = [];

    const applicationPath = [!platform.isWindows && "./", application].filter(Boolean).join("");

    const process = spawn(`${applicationPath} ${command}`, args, { cwd: BIN_DIR, shell: true });

    process.stdout.setEncoding("utf8");
    process.stdout.on("data", (data) => {
      stdout.push(data.trim());
    });

    process.stderr.setEncoding("utf8");
    process.stderr.on("data", (data) => {
      stderr.push(data.trim());
    });

    process.on("close", (_code, signal) => {
      if (signal && process.killed) {
        reject(`Process terminated with signal ${signal}`);
      }

      resolve({
        stderr: stderr.join(""),
        stdout: stdout.join(""),
      });
    });

    process.on("error", (err) => {
      reject(err);
    });
  });
