import { defineConfig } from "eslint/config";

const nodeGlobals = {
  Buffer: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  clearInterval: "readonly",
  clearTimeout: "readonly",
  console: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
  setInterval: "readonly",
  setTimeout: "readonly",
};

export const node = ({ basePath, files = ["**/*.{js,mjs,cjs,ts,mts,cts}"] } = {}) =>
  defineConfig({
    basePath,
    files,
    languageOptions: {
      globals: nodeGlobals,
    },
  });
