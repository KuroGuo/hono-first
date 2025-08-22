import commonTranslations from './translations.json'
import variables from './variables'

export type Lang = keyof typeof commonTranslations

export type TranslatableText = { [lang in Lang]: keyof typeof commonTranslations[lang] }[Lang]

export function translate<T extends TranslatableText>(text: T, ...values: string[]) {
  return translateText(commonTranslations, variables.lang, text, ...values)
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