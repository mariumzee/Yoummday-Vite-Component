import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,tsx}"] }, // Ensure TSX is also included if using React
  { languageOptions: { globals: globals.browser } }, // Since your code runs in the browser
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier, // Add Prettier as a plugin
    },
    rules: {
      "prettier/prettier": "error", // Enforce Prettier formatting as ESLint errors
    },
  },
  prettierConfig, // Ensure Prettier formatting rules take precedence
];
