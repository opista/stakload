import { resolve } from "path";
import { defineConfig, swcPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
import graphqlLoader from "vite-plugin-graphql-loader";
import { electronIpcBridge } from "@electron-ipc-bridge/vite-plugin";

export default defineConfig({
  main: {
    plugins: [swcPlugin(), graphqlLoader(), electronIpcBridge({ resolutionStrategy: "nest" })],
    resolve: {
      alias: {
        "@contracts": resolve("src/contracts"),
        "@util": resolve("src/main/util"),
      },
    },
  },
  preload: {
    plugins: [electronIpcBridge({ resolutionStrategy: "nest" })],
    resolve: {
      alias: {
        "@contracts": resolve("src/contracts"),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@api": resolve("src/renderer/src/api"),
        "@components": resolve("src/renderer/src/components"),
        "@constants": resolve("src/renderer/src/constants"),
        "@contracts": resolve("src/contracts"),
        "@database": resolve("src/renderer/src/database"),
        "@hooks": resolve("src/renderer/src/hooks"),
        "@icons": resolve("src/renderer/src/icons"),
        "@renderer": resolve("src/renderer/src"),
        "@store": resolve("src/renderer/src/store"),
        "@util": resolve("src/renderer/src/util"),
      },
    },
    plugins: [
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
    ],
  },
});
