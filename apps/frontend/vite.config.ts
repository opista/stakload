import { resolve } from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "src/components"),
      "@constants": resolve(__dirname, "src/constants"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@icons": resolve(__dirname, "src/icons"),
      "@platform": resolve(__dirname, "src/platform"),
      "@stakload/contracts": resolve(__dirname, "../../packages/contracts/src"),
      "@store": resolve(__dirname, "src/store"),
      "@util": resolve(__dirname, "src/util"),
    },
  },
  root: __dirname,
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
