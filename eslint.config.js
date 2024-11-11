import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.recommended,
  {
    plugins: {
      "react-refresh": reactRefreshPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "unused-imports": unusedImportsPlugin,
    },
  },
  {
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-floating-promises": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        },
      ],
      "react/react-in-jsx-scope": "off",
      "unused-imports/no-unused-imports": "error",
      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "parent", "sibling", "index"],
        },
      ],
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        typescript: true,
        node: true,
      },
    },
  },
];
