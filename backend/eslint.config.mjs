import tseslint from 'typescript-eslint'
import drizzlePlugin from 'eslint-plugin-drizzle'

export default tseslint.config(
  { ignores: ['node_modules/', 'dist/'] },
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