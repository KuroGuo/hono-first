import { useCallback, useMemo } from 'react'
import commonTranslations from '@/translations.json'
import variables from '@/variables'
import type { Lang, Text } from '@/translate'

export default function useTranslate<
  T extends { [lang in Lang]?: { [text: string]: string } }
>(translations?: T, toLanguage?: Lang) {
  const { lang } = variables
  if (!toLanguage) toLanguage = lang
  translations = useMemo(() => {
    const trs = translations || {} as T
    for (const lang in commonTranslations) {
      trs[lang as Lang] = {
        ...commonTranslations[lang as Lang],
        ...trs[lang as Lang]
      }
    }
    return trs
  }, [translations])

  type ExtendedText = { [lang in Lang]: keyof typeof translations[lang] }[Lang] | Text

  return useCallback((text: ExtendedText, ...values: string[]): string => {
    let translated = translations[toLanguage]?.[text as string]
    if (!translated) return text as string
    values.forEach((value, i) => { translated = translated?.replace(`%${i}`, value) })
    return translated
  }, [toLanguage, translations])
}