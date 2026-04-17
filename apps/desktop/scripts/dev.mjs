import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const desktopDir = resolve(scriptDir, "..");
const command = process.platform === "win32" ? "cmd.exe" : "pnpm";
const args =
  process.platform === "win32"
    ? ["/d", "/s", "/c", "pnpm", "exec", "electron-vite", "dev", "--config", "electron.vite.config.ts"]
    : ["exec", "electron-vite", "dev", "--config", "electron.vite.config.ts"];

const child = spawn(command, args, {
  cwd: desktopDir,
  env: {
    ...process.env,
    ELECTRON_RENDERER_URL: process.env.ELECTRON_RENDERER_URL ?? "http://127.0.0.1:5173",
  },
  shell: false,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
