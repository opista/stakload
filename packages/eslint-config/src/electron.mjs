import { defineConfig } from "eslint/config";

const electronGlobals = {
  Electron: "readonly",
};

export const electron = ({
  basePath,
  mainFiles = ["src/main/**/*.{js,mjs,cjs,ts,mts,cts}"],
  preloadFiles = ["src/preload/**/*.{js,mjs,cjs,ts,mts,cts}"],
  rendererFiles = [],
} = {}) =>
  defineConfig(
    {
      basePath,
      files: mainFiles,
      languageOptions: {
        globals: electronGlobals,
      },
    },
    {
      basePath,
      files: preloadFiles,
      languageOptions: {
        globals: electronGlobals,
      },
    },
    rendererFiles.length > 0
      ? {
          basePath,
          files: rendererFiles,
          languageOptions: {
            globals: electronGlobals,
          },
        }
      : {},
  );
