import { defineConfig } from "eslint/config";
import tseslint from "@electron-toolkit/eslint-config-ts";
import eslintConfigPrettier from "@electron-toolkit/eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import reactCompiler from "eslint-plugin-react-compiler";

export default defineConfig(
  { ignores: ["**/node_modules", "**/dist", "**/out"] },
  tseslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  eslintPluginReact.configs.flat["jsx-runtime"],
  reactCompiler.configs.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.web.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-refresh": eslintPluginReactRefresh,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      perfectionist,
    },
    rules: {
      ...eslintPluginReactRefresh.configs.vite.rules,
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^\\u0000"], ["^@?\\w"], ["^@", "^"], ["^\\./"]],
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/unbound-method": "off",
      "perfectionist/sort-objects": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
      "perfectionist/sort-interfaces": ["error"],
      "perfectionist/sort-classes": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "index-signature",
            "static-property",
            "private-property",
            "property",
            "constructor",
            "static-method",
            "private-method",
            "method",
            ["get-method", "set-method"],
            "unknown",
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
