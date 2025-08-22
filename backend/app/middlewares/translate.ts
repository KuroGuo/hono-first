import { createMiddleware } from 'hono/factory'
import { accepts } from 'hono/accepts'
import type { TranslationKeys, Lang, CommonTranslationKeys, Translations } from '../translate.js'
import translator from '../translate.js'

declare module 'hono' {
  interface ContextVariableMap {
    lang: Lang
    translator<T extends Translations>(translations?: T):
      (text: TranslationKeys<T> | CommonTranslationKeys, ...values: (string | number)[]) => string
  }
}

export default function translate() {
  return createMiddleware(async (c, next) => {
    const lang = accepts(c, {
      header: 'Accept-Language',
      supports: ['en', 'zh-CN'] satisfies Lang[],
      default: 'en' satisfies Lang,
    }) as Lang
    c.set('lang', lang)
    c.set('translator', function <T extends Translations>(translations?: T) {
      return translator(lang, translations)
    })
    await next()
  })
}