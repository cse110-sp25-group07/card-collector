import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintPluginJest from 'eslint-plugin-jest';

export default defineConfig([
  {
    ignores: ['jsdocs/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      jest: eslintPluginJest,
    },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
]);
