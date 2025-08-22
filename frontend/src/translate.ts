import type { TranslationKeys, Translations } from '../../backend/app/translate'
import commonTranslations from './translations.json'
import variables from './variables'

export type Lang = keyof typeof commonTranslations

export type CommonTranslationKeys = TranslationKeys<typeof commonTranslations>

export function translate<T extends CommonTranslationKeys>(text: T, ...values: string[]) {
  return translateText(commonTranslations, variables.lang, text, ...values)
}

export function translateText(
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