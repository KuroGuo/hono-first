// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import drizzlePlugin from 'eslint-plugin-drizzle'

export default tseslint.config(
  {
    languageOptions: { globals: { ...globals.node } },
    ignores: ['node_modules/', 'dist/']
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: { drizzle: drizzlePlugin },
    rules: {
      'drizzle/enforce-delete-with-where': 'error',
      'drizzle/enforce-update-with-where': 'error'
    }
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  }
)