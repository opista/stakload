import tseslint from "@electron-toolkit/eslint-config-ts";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";

import { scopeConfigs } from "./utils.mjs";

const defaultFiles = ["**/*.{ts,tsx,mts,cts}"];
const formatFiles = ["**/*.{js,mjs,cjs,ts,tsx,mts,cts}"];
const internalPatterns = [
  "^@api/.*",
  "^@components/.*",
  "^@constants/.*",
  "^@hooks/.*",
  "^@icons/.*",
  "^@platform/.*",
  "^@stakload/.*",
  "^@store/.*",
  "^@util/.*",
];

export const ignores = ({ basePath, patterns = ["**/node_modules", "**/dist", "**/out"] } = {}) =>
  defineConfig({
    basePath,
    ignores: patterns,
  });

export const base = ({
  basePath,
  files = defaultFiles,
  tsconfigGlobs = ["./tsconfig.json"],
  tsconfigRootDir = basePath,
} = {}) =>
  defineConfig(...scopeConfigs(tseslint.configs.recommended, { basePath, files }), {
    basePath,
    files,
    languageOptions: {
      parserOptions: {
        project: tsconfigGlobs,
        tsconfigRootDir,
      },
    },
    plugins: {
      "unused-imports": unusedImports,
      perfectionist,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/unbound-method": "off",
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
          internalPattern: internalPatterns,
        },
      ],
      "perfectionist/sort-interfaces": "error",
      "perfectionist/sort-objects": [
        "error",
        {
          type: "natural",
          order: "asc",
        },
      ],
    },
  });
