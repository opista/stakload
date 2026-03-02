import { defineConfig } from "eslint/config";

import { base, electron, ignores, node } from "@stakload/eslint-config";

const basePath = import.meta.dirname;

export default defineConfig(
  ...ignores({ basePath }),
  ...base({
    basePath,
    files: ["src/main/**/*.{ts,tsx}", "src/preload/**/*.{ts,tsx}", "electron.vite.config.ts"],
    tsconfigGlobs: ["./tsconfig.json", "./tsconfig.eslint.json"],
    tsconfigRootDir: basePath,
  }),
  ...node({
    basePath,
    files: ["electron.vite.config.ts", "scripts/**/*.{mjs,ts}", "src/main/**/*.{ts,tsx}", "src/preload/**/*.{ts,tsx}"],
  }),
  ...electron({
    basePath,
  }),
);
