import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Global ignores - must be first
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.husky/**',
      'coverage/**',
      'scripts/**',
      'tests/**',
    ],
  },

  {
    files: ['**/*.{js,mjs,cjs,ts,cts,mts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // 👈 backend environment (not browser)
      },
    },
  },

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Custom rules
  {
    files: ['**/*.{js,mjs,cjs,ts,cts,mts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
    },
  },
]);
