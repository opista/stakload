import { electronIpcBridge } from "@electron-ipc-bridge/vite-plugin";
import { defineConfig, swcPlugin } from "electron-vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import graphqlLoader from "vite-plugin-graphql-loader";

const desktopDir = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(desktopDir, "../..");

const ipcBridge = electronIpcBridge({
  main: resolve(desktopDir, "src/main/index.ts"),
  preload: resolve(desktopDir, "src/preload/index.ts"),
  resolutionStrategy: "nest",
  types: {
    global: resolve(desktopDir, "src/preload/ipc.d.ts"),
    runtime: resolve(rootDir, "apps/frontend/src/ipc.types.ts"),
  },
});

export default defineConfig({
  main: {
    build: {
      emptyOutDir: false,
      externalizeDeps: {
        exclude: ["@stakload/contracts"],
      },
      outDir: resolve(desktopDir, "out/main"),
      rollupOptions: {
        input: resolve(desktopDir, "src/main/index.ts"),
      },
    },
    plugins: [swcPlugin(), graphqlLoader(), ipcBridge],
    resolve: {
      alias: {
        "@stakload/contracts": resolve(rootDir, "packages/contracts/src"),
        "@util": resolve(desktopDir, "src/main/util"),
      },
    },
  },
  preload: {
    build: {
      emptyOutDir: false,
      externalizeDeps: {
        exclude: ["@stakload/contracts"],
      },
      outDir: resolve(desktopDir, "out/preload"),
      rollupOptions: {
        input: {
          index: resolve(desktopDir, "src/preload/index.ts"),
        },
      },
    },
    plugins: [ipcBridge],
    resolve: {
      alias: {
        "@stakload/contracts": resolve(rootDir, "packages/contracts/src"),
      },
    },
  },
});
