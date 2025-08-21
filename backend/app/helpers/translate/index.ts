import type { Context } from 'hono'
import commonTranslations from './translations.json' with { type: 'json' }
import { accepts } from 'hono/accepts'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type Lang = keyof typeof commonTranslations

export type Text = { [K in Lang]: keyof typeof commonTranslations[K] }[Lang]

export default function translator(c: Context) {
  const lang = accepts(c, {
    header: 'Accept-Language',
    supports: ['en', 'zh-CN'],
    default: 'en',
  })
  return function translate<T extends Text>(text: T, ...values: (string | number)[]) {
    return translateText(commonTranslations, lang, text, ...values)
  }
}

function translateText(
  translations: { [lang: string]: { [text: string]: string } },
  lang: string,
  text: string,
  ...values: (string | number)[]
) {
  let translated = translations[lang || 'en'][text] || text
  values.forEach((value, i) => {
    translated = translated.replace(`%${i}`, value.toString())
  })
  return translated
}

type TextObj = { text: Text; values: (string | number)[] }

export function text(t: Text, ...values: (string | number)[]) {
  return { text: t, values }
}

export class HTTPError extends HTTPException {
  textObj?: TextObj
  public text(c: Context) {
    if (!this.textObj) return this.message
    const t = translator(c)
    return t(this.textObj.text, ...this.textObj.values)
  }
  constructor(status?: ContentfulStatusCode, options?: {
    res?: Response
    message?: TextObj
    cause?: unknown
  }) {
    const message = options?.message
    const messageStr = message ? JSON.stringify(message) : undefined
    super(status, { ...options, message: messageStr })
    this.name = 'HTTPError'
    if (message) this.textObj = message
  }
}