module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "airbnb-typescript",
    "prettier",
  ],
  overrides: [
    {
      files: ["**/*.test.js", "**/*.test.jsx", "**/*.test.ts", "**/*.test.tsx"],
      env: {
        jest: true,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    project: "./tsconfig.eslint.json",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    // suppress errors for missing 'import React' in files
    "react/react-in-jsx-scope": "off",
    // allow prop-spreading
    "react/jsx-props-no-spreading": "off",
    "react/jsx-filename-extension": "off",
    "no-underscore-dangle": "off",
    "no-plusplus": "off",
    "no-console": "off",
    "react/no-array-index-key": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "no-param-reassign": "off",
    "@typescript-eslint/no-shadow": "off",
    "react/require-default-props": "off",
    "react/function-component-definition": "off",
    "import/prefer-default-export": "off",
  },
};
