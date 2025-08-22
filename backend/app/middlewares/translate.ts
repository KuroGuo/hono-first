import { createMiddleware } from 'hono/factory'
import type { Lang, TranslatableText } from '../translate.js'
import translator from '../translate.js'

declare module 'hono' {
  interface ContextVariableMap {
    translator: (translations?: { [lang in Lang]: { [text: string]: string } }) =>
      (text: TranslatableText, ...values: (string | number)[]) => string
  }
}

export default function translate() {
  return createMiddleware(async (c, next) => {
    c.set('translator', (translations?: { [lang in Lang]: { [text: string]: string } }) => {
      return translator(c, translations)
    })
    await next()
  })
}