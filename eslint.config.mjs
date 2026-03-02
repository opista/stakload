import eslintConfigPrettier from "@electron-toolkit/eslint-config-prettier";
import tseslint from "@electron-toolkit/eslint-config-ts";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";

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
        project: [
          "./packages/contracts/tsconfig.json",
          "./apps/frontend/tsconfig.json",
          "./apps/desktop/tsconfig.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-refresh": eslintPluginReactRefresh,
      "unused-imports": unusedImports,
      perfectionist,
    },
    rules: {
      ...eslintPluginReactRefresh.configs.vite.rules,
      "perfectionist/sort-imports": [
        "error",
        {
          type: "natural",
          order: "asc",
          groups: [
            "side-effect",
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "side-effect-style",
            "unknown",
          ],
          newlinesBetween: 1,
          internalPattern: [
            "^@api/.*",
            "^@components/.*",
            "^@constants/.*",
            "^@hooks/.*",
            "^@icons/.*",
            "^@platform/.*",
            "^@stakload/.*",
            "^@store/.*",
            "^@util/.*",
          ],
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
