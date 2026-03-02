import { defineConfig } from "eslint/config";

import { base, ignores, node, react } from "@stakload/eslint-config";

const basePath = import.meta.dirname;

export default defineConfig(
  ...ignores({ basePath }),
  ...base({
    basePath,
    files: ["src/**/*.{ts,tsx}", "vite.config.ts"],
    tsconfigGlobs: ["./tsconfig.json", "./tsconfig.eslint.json"],
    tsconfigRootDir: basePath,
  }),
  ...react({
    basePath,
    files: ["src/**/*.{ts,tsx}"],
  }),
  ...node({
    basePath,
    files: ["vite.config.ts"],
  }),
);
