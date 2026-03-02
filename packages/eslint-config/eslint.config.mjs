import { defineConfig } from "eslint/config";

import { ignores, node } from "./src/index.mjs";

const basePath = import.meta.dirname;

export default defineConfig(
  ...ignores({ basePath }),
  ...node({
    basePath,
    files: ["eslint.config.mjs", "src/**/*.mjs"],
  }),
);
