import { createMiddleware } from 'hono/factory'
import type { TranslatableText } from '../translate.js'
import translator from '../translate.js'

declare module 'hono' {
  interface ContextVariableMap {
    translate: (text: TranslatableText) => string
  }
}

export default function translate() {
  return createMiddleware(async (c, next) => {
    const t = translator(c)
    c.set('translate', t)
    await next()
  })
}