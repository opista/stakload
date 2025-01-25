import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
import graphqlLoader from "vite-plugin-graphql-loader";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), graphqlLoader()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        "@api": resolve("src/renderer/src/api"),
        "@components": resolve("src/renderer/src/components"),
        "@constants": resolve("src/renderer/src/constants"),
        "@database": resolve("src/renderer/src/database"),
        "@hooks": resolve("src/renderer/src/hooks"),
        "@icons": resolve("src/renderer/src/icons"),
        "@renderer": resolve("src/renderer/src"),
        "@store": resolve("src/renderer/src/store"),
        "@util": resolve("src/renderer/src/util"),
      },
    },
  },
});
