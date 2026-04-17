import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const desktopDir = resolve(scriptDir, "..");
const repoDir = resolve(desktopDir, "../..");
const pnpmCommand = process.platform === "win32" ? "cmd.exe" : "pnpm";
const toPnpmArgs = (args) => (process.platform === "win32" ? ["/d", "/s", "/c", "pnpm", ...args] : args);
const electronCommand = process.platform === "win32" ? "cmd.exe" : "pnpm";
const electronArgs = toPnpmArgs(["exec", "electron-vite", "build", "--config", "electron.vite.config.ts"]);

const run = ({ args, command, cwd, errorMessage }) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      shell: false,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      reject(new Error(errorMessage));
    });
  });

await run({
  args: toPnpmArgs(["--dir", resolve(repoDir, "apps/frontend"), "build"]),
  command: pnpmCommand,
  cwd: repoDir,
  errorMessage: "Frontend build failed",
});

await run({
  args: electronArgs,
  command: electronCommand,
  cwd: desktopDir,
  errorMessage: "Desktop build failed",
});

const rendererOutDir = resolve(desktopDir, "out/renderer");
const frontendDistDir = resolve(repoDir, "apps/frontend/dist");

if (existsSync(rendererOutDir)) {
  rmSync(rendererOutDir, { force: true, recursive: true });
}

mkdirSync(resolve(desktopDir, "out"), { recursive: true });
cpSync(frontendDistDir, rendererOutDir, { recursive: true });
