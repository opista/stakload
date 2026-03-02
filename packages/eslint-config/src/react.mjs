import eslintPluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

import { scopeConfigs } from "./utils.mjs";

const defaultFiles = ["**/*.{jsx,tsx}"];

export const react = ({ basePath, enableRefresh = true, files = defaultFiles } = {}) =>
  defineConfig(
    ...scopeConfigs(eslintPluginReact.configs.flat.recommended, { basePath, files }),
    ...scopeConfigs([reactHooks.configs.flat.recommended], { basePath, files }),
    ...scopeConfigs([eslintPluginReact.configs.flat["jsx-runtime"]], { basePath, files }),
    ...scopeConfigs([reactCompiler.configs.recommended], { basePath, files }),
    {
      basePath,
      files,
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    enableRefresh
      ? {
          basePath,
          files,
          plugins: {
            "react-refresh": eslintPluginReactRefresh,
          },
          rules: {
            ...eslintPluginReactRefresh.configs.vite.rules,
          },
        }
      : {},
  );
