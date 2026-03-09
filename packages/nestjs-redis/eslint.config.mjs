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
  ...base({
    basePath,
    files: ["test/**/*.ts"],
    tsconfigGlobs: ["./tsconfig.eslint.json"],
    tsconfigRootDir: basePath,
  }),
  ...node({
    basePath,
    files: ["test/**/*.ts"],
  }),
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      globals: {
        afterEach: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        vi: "readonly",
      },
    },
  },
);
