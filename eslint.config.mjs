// ESLint flat config for Next.js + TypeScript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';

// Use FlatCompat to include Next's shareable config in flat-config mode
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  {
    ignores: [
      'node_modules',
      'dist',
      '.next',
      'coverage',
      'public/static/fonts',
      'public/static/pgp/public.asc', // PGP key (static asset)
      'next-env.d.ts',
      '**/*.mjs',
    ],
  },
  // Include Next.js rules via FlatCompat so Next can detect its plugin
  ...compat.config({ extends: ['next/core-web-vitals'] }),
  js.configs.recommended,
  // Base for TS files without type-aware rules
  ...tseslint.configs.recommended,
  // Enable type-aware rules for project TS only (not config files)
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ...tseslint.configs.recommendedTypeChecked[1],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  // Config files: allow require() usage and relax Node-specific patterns
  {
    files: ['**/*.config.{js,cjs,mjs,ts}', 'next.config.ts', 'postcss.config.mjs', 'tailwind.config.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Disable rules that conflict with Prettier formatting
  prettier,
];
