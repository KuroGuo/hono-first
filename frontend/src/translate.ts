import type { TranslatableText as _TranslatableText } from '../shared/translate'
import _translator, { setCommonTranslations, translateText } from '../shared/translate'
import commonTranslations from './translations.json'
import variables from './variables'

setCommonTranslations(commonTranslations)

export type CommonTranslations = typeof commonTranslations

export type Lang = keyof CommonTranslations

export type Translations = { [lang in Lang]?: { [text: string]: string } }

export type TranslatableText = _TranslatableText<typeof commonTranslations>

export function translate<
  T extends TranslatableText
>(text: T, ...values: string[]) {
  return translateText(commonTranslations, variables.lang, text, ...values)
}

export function translator<T extends Translations>(lang: Lang, translations?: T) {
  return _translator<typeof commonTranslations, T>(lang, translations)
}