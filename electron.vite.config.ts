import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@api": resolve("src/renderer/src/api"),
        "@components": resolve("src/renderer/src/components"),
        "@constants": resolve("src/renderer/src/constants"),
        "@database": resolve("src/renderer/src/database"),
        "@hooks": resolve("src/renderer/src/hooks"),
        "@renderer": resolve("src/renderer/src"),
        "@store": resolve("src/renderer/src/store"),
        "@util": resolve("src/renderer/src/util"),
      },
    },
    plugins: [react()],
  },
});
