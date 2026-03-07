import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    globals: true,
    include: ["**/*.test.ts"],
    passWithNoTests: true,
    root: "./",
  },
});
