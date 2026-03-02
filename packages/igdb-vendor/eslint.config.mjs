import { defineConfig } from "eslint/config";

import { base, ignores, node } from "@stakload/eslint-config";

const basePath = import.meta.dirname;

export default defineConfig(
  ...ignores({
    basePath,
    patterns: ["**/node_modules", "**/dist", "**/out", "vendor/**"],
  }),
  ...base({
    basePath,
    files: ["src/**/*.ts"],
    tsconfigGlobs: ["./tsconfig.json"],
    tsconfigRootDir: basePath,
  }),
  ...node({
    basePath,
    files: ["scripts/**/*.mjs"],
  }),
  {
    basePath,
    files: ["src/generated/**/*.ts"],
    rules: {
      "perfectionist/sort-interfaces": "off",
      "perfectionist/sort-objects": "off",
    },
  },
);
