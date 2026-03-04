import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [swc.vite()],
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "html"],
    },
    environment: "node",
    globals: true,
    include: ["src/**/*.spec.ts"],
    setupFiles: ["./test/setup.ts"],
  },
});
