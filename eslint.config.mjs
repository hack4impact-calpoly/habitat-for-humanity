import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "backend/coverage/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node, // <-- add Node globals here
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.eslint.json",
        ecmaVersion: 13,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Manually ignore, resolve these
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-shadow": "off",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react: pluginReact },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-props-no-spreading": "off",
      "react/jsx-filename-extension": "off",
      "react/no-array-index-key": "off",
      "react/require-default-props": "off",
      "react/function-component-definition": "off",
      "react/no-unescaped-entities": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    rules: {
      "css/no-important": "off",
      "css/no-invalid-properties": "off",
      "css/font-family-fallbacks": "off",
      "css/no-invalid-at-rule-placement": "off",
    },
    language: "css/css",
    extends: ["css/recommended"],
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}"],
    languageOptions: { globals: { jest: true } },
  },
]);
