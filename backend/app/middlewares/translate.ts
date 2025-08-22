import { createMiddleware } from 'hono/factory'
import { accepts } from 'hono/accepts'
import type { Lang, TranslatableText as _TranslatableText, Translations, Translate } from '../../shared/translate/index.js'
import _translator, { setCommonTranslations } from '../../shared/translate/index.js'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import commonTranslations from '../translations.json' with { type: 'json' }

setCommonTranslations(commonTranslations)

declare module 'hono' {
  interface ContextVariableMap {
    lang: Lang
    translator<T extends Translations>(translations?: T): Translate<T, typeof commonTranslations>
  }
}

export type TranslatableText = _TranslatableText<typeof commonTranslations>

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

type TextObj = { text: TranslatableText; values: (string | number)[] }
export function text(t: TranslatableText, ...values: (string | number)[]) {
  return { text: t, values }
}
export class HTTPError extends HTTPException {
  textObj?: TextObj
  public text(lang: Lang) {
    if (!this.textObj) return this.message
    const t = translator(lang)
    return t(this.textObj.text, ...this.textObj.values)
  }
  constructor(status?: ContentfulStatusCode, options?: {
    res?: Response
    message?: string
    cause?: unknown
    text?: TextObj | TranslatableText
  }) {
    const textObj = typeof options?.text === 'string' ? text(options.text) : options?.text
    const t = translator('en')
    const messageStr = textObj ? t(textObj.text, ...textObj.values) : t(options?.message as TranslatableText)
    super(status, { ...options, message: messageStr })
    this.name = 'HTTPError'
    if (textObj) this.textObj = textObj
  }
}

function translator<T extends Translations>(lang: Lang, translations?: T) {
  return _translator<typeof commonTranslations, T>(lang, translations)
}