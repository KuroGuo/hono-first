import commonTranslations from './translations.json' with { type: 'json' }
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type Lang = keyof typeof commonTranslations

export type Translations = { [lang in Lang]?: { [text: string | number | symbol]: string } }

export type TranslationKeys<T extends Translations> = { [lang in Lang]: keyof T[lang] }[Lang]

export type CommonTranslationKeys = TranslationKeys<typeof commonTranslations>

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
    text: TranslationKeys<T> | CommonTranslationKeys,
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

type TextObj = { text: CommonTranslationKeys; values: (string | number)[] }

export function text(t: CommonTranslationKeys, ...values: (string | number)[]) {
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
    text?: TextObj | CommonTranslationKeys
  }) {
    const textObj = typeof options?.text === 'string' ? text(options.text) : options?.text
    const t = translator('en')
    const messageStr = textObj ? t(textObj.text, ...textObj.values) : t(options?.message as CommonTranslationKeys)
    super(status, { ...options, message: messageStr })
    this.name = 'HTTPError'
    if (textObj) this.textObj = textObj
  }
}