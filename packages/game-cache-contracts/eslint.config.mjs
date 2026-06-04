import { defineConfig } from "eslint/config";

import { base, ignores, node } from "@stakload/eslint-config";

const basePath = import.meta.dirname;

export default defineConfig(
  ...ignores({
    basePath,
  }),
  ...base({
    basePath,
    files: ["src/**/*.ts"],
    tsconfigGlobs: ["./tsconfig.json"],
    tsconfigRootDir: basePath,
  }),
  ...node({
    basePath,
    files: ["src/**/*.ts"],
  }),
);
