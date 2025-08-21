import { createMiddleware } from 'hono/factory'
import type { TranslatableText } from '../translate.js'
import translator from '../translate.js'

declare module 'hono' {
  interface ContextVariableMap {
    translate: (text: TranslatableText, ...values: (string | number)[]) => string
  }
}

export default function translate() {
  return createMiddleware(async (c, next) => {
    c.set('translate', translator(c))
    await next()
  })
}