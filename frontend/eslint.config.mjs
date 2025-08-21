// @ts-check
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ]
  },
  ...new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url))
  }).extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          selector: "CallExpression[callee.name='useLayoutEffect'][arguments.length < 2]",
          message: 'useLayoutEffect 方法必须包含参数 dependencies'
        },
        {
          selector: "CallExpression[callee.name='useEffect'][arguments.length < 2]",
          message: 'useEffect 方法必须包含参数 dependencies'
        },
        {
          selector: "CallExpression[callee.name='useImperativeHandle'][arguments.length < 2]",
          message: 'useImperativeHandle 方法必须包含参数 dependencies'
        },
        {
          selector: "JSXOpeningElement[name.name='Image']:not(:has(JSXAttribute[name.name='loading']))",
          message: 'Image 组件必须包含 loading 属性'
        }
      ]
    }
  }
]

export default eslintConfig