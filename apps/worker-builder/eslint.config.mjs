import { defineConfig } from "eslint/config";

import { base, ignores, node } from "@stakload/eslint-config";

const basePath = import.meta.dirname;

export default defineConfig(
  ...ignores({ basePath }),
  ...base({
    basePath,
    files: ["src/**/*.ts", "test/**/*.ts", "vitest.config.ts"],
    tsconfigGlobs: ["./tsconfig.json"],
    tsconfigRootDir: basePath,
  }),
  ...node({
    basePath,
    files: ["vitest.config.ts"],
  }),
);
