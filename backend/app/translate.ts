import commonTranslations from './translations.json' with { type: 'json' }
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type Lang = keyof typeof commonTranslations

export type TranslatableText = { [lang in Lang]: keyof typeof commonTranslations[lang] }[Lang]

export type Translations = { [lang in Lang]?: { [text: string | number | symbol]: string } }

export type GetTranslationKeys<T extends Translations> = {
  [lang in Lang]: keyof T[lang]
}[Lang]

export default function translator<T extends Translations>(
  lang: Lang,
  translations: T = {} as T
) {
  commonTranslations satisfies Translations
  for (const l in commonTranslations) {
    translations[l as Lang] = {
      ...commonTranslations[l as Lang],
      ...translations[l as Lang]
    }
  }

  return (
    text: GetTranslationKeys<T> | TranslatableText,
    ...values: (string | number)[]
  ) => translateText(translations, lang, text, ...values)
}

function translateText(
  translations: Translations,
  lang: Lang,
  text: string | number | symbol,
  ...values: (string | number)[]
) {
  let translated = translations[lang]?.[text] || text.toString()
  values.forEach((value, i) => {
    translated = translated.replace(`%${i}`, value.toString())
  })
  return translated
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