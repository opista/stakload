module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit/eslint-config-prettier",
    "plugin:typescript-sort-keys/recommended",
  ],
  globals: {
    JSX: true,
  },
  overrides: [
    {
      files: ["src/renderer/src/icons/*.tsx"],
      rules: {
        "react/display-name": ["error", { ignoreTranspilerName: true }],
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "unused-imports", "react-refresh", "simple-import-sort"],
  rules: {
    "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
    "@typescript-eslint/no-empty-interface": ["error", { allowSingleExtends: true }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
        vars: "all",
      },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "no-unused-vars": "off",
    "react-refresh/only-export-components": "warn",
    "react/jsx-sort-props": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "sort-keys": ["error", "asc", { caseSensitive: true, minKeys: 2, natural: false }],
    "unused-imports/no-unused-imports": "error",
  },
  settings: {
    react: {
      version: "18.3.1",
    },
  },
};
