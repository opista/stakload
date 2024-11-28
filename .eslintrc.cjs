module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit/eslint-config-prettier",
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  globals: {
    JSX: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    ecmaVersion: 2021,
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
    "@typescript-eslint/no-var-requires": "off",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "react-refresh/only-export-components": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
  settings: {
    react: {
      version: "18.3.1",
    },
  },
};
