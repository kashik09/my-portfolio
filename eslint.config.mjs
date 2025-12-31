import { createRequire } from 'node:module'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

const require = createRequire(import.meta.url)
const localRules = require('./.eslint/rules')

const decimalGuardFiles = [
  'app/admin/**/*.{ts,tsx}',
  'app/api/admin/**/*.{ts,tsx}',
  'app/api/**/orders/**/*.{ts,tsx}',
  'app/api/**/checkout/**/*.{ts,tsx}',
  'app/api/**/payment/**/*.{ts,tsx}',
  'app/api/**/payments/**/*.{ts,tsx}',
  'app/api/**/cart/**/*.{ts,tsx}',
  'lib/cart.ts',
  'lib/order-fulfillment.ts',
  'lib/credits.ts',
]

const baseConfig = coreWebVitals[0]
const typescriptConfig = coreWebVitals[1]
const remainingConfigs = coreWebVitals.slice(2)

const patchedBaseConfig = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    'react/no-unescaped-entities': 'off',
    'react/prop-types': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'no-unused-vars': 'off',
    'react-hooks/set-state-in-effect': 'warn',
    'react-hooks/immutability': 'warn',
    'prefer-const': 'warn',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
  },
}

const patchedTypescriptConfig = {
  ...typescriptConfig,
  rules: {
    ...typescriptConfig.rules,
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
}

const eslintConfig = [
  {
    ignores: ['**/.next/**', '**/node_modules/**'],
  },
  patchedBaseConfig,
  patchedTypescriptConfig,
  ...remainingConfigs,
  prettier,
  {
    files: decimalGuardFiles,
    plugins: {
      local: localRules,
    },
    rules: {
      'local/no-decimal-arithmetic': 'error',
    },
  },
  {
    files: [
      'lib/email.ts',
      'lib/logger.ts',
      'prisma/**/*.{js,ts,tsx}',
      'scripts/**/*.{js,ts,tsx}',
      'sh-files/**/*.{js,ts,tsx,mjs}',
    ],
    rules: {
      'no-console': 'off',
    },
  },
]

export default eslintConfig
