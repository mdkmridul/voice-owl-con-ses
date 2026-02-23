// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('typescript-eslint').ConfigArray} */
export default [
  {
    ignores:[
      'eslint.config.mjs',

      // build/output
      'dist/**',
      'coverage/**',
      '.turbo/**',
      'node_modules/**',

      // prisma & generated
      'prisma/**',
      '**/migrations/**',
      '**/generated/**',
      '**/*.generated.*',
      '**/*.d.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  // 2) Base language options
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 3) Baseline rule tuning across the repo
  {
    rules: {
      // keep this off if you intentionally use `any` in a few places
      '@typescript-eslint/no-explicit-any': 'off',

      // keep promises safety; warn is fine for now
      '@typescript-eslint/no-floating-promises': 'warn',

      // keep unsafe-argument as warning globally (we’ll be stricter in src/**)
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },

  // 4) Relax strict unsafe rules in tests
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/__tests__/**', '**/test/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },

  // 5) Relax strict unsafe rules in scripts/seeds (optional)
  {
    files: ['**/scripts/**', '**/seed/**'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },

  // 6) Enforce strict unsafe rules ONLY in core app code
  // If your source folder is not `src/`, tell me and I’ll adjust globs.
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
];
