import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const rendererUrl = "http://127.0.0.1:5173";
const pnpmCommand = process.platform === "win32" ? "cmd.exe" : "pnpm";
const toPnpmArgs = (args) => (process.platform === "win32" ? ["/d", "/s", "/c", "pnpm", ...args] : args);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, "../../..");
let desktop;

const spawnProcess = (args, env = process.env) =>
  spawn(pnpmCommand, toPnpmArgs(args), {
    cwd: repoDir,
    env,
    shell: false,
    stdio: "inherit",
  });

const frontend = spawnProcess(["--dir", resolve(repoDir, "apps/frontend"), "dev"]);

const stopAll = () => {
  frontend.kill();
  desktop?.kill();
};

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);

const waitForRenderer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(rendererUrl);

      if (response.ok) {
        return;
      }
    } catch {
      await delay(500);
    }
  }

  throw new Error(`Timed out waiting for frontend dev server at ${rendererUrl}`);
};

await waitForRenderer();

desktop = spawnProcess(["--dir", resolve(repoDir, "apps/desktop"), "dev"], {
  ...process.env,
  ELECTRON_RENDERER_URL: rendererUrl,
});

const exitOnFailure = (code) => {
  if (code && code !== 0) {
    stopAll();
    process.exit(code);
  }
};

frontend.on("exit", exitOnFailure);
desktop.on("exit", (code) => {
  frontend.kill();
  process.exit(code ?? 0);
});
