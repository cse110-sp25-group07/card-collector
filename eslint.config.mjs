import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended", eslintConfigPrettier],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
  },
]);
