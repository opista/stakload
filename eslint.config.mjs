import globals from "globals";
import jsPlugin from "@eslint/js";
import tsPlugin from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      parser: tsParser,
      sourceType: "module",
      ...jsxA11yPlugin.flatConfigs.strict.languageOption,
      globals: globals.browser,
    },
  },
  jsPlugin.configs.recommended,
  ...tsPlugin.configs.recommended,
  pluginReact.configs.flat.recommended,
  importPlugin.flatConfigs.typescript,
  jsxA11yPlugin.flatConfigs.strict,
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
      // "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      // "import/order": [
      //   "error",
      //   {
      //     groups: ["builtin", "external", "parent", "sibling", "index"],
      //   },
      // ],
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
  },
];
