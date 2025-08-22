import { useCallback, useMemo } from 'react'
import commonTranslations from '@/translations.json'
import variables from '@/variables'
import { translateText, type Lang, type CommonTranslationKeys } from '@/translate'
import type { TranslationKeys, Translations } from '../../../backend/app/translate'
import { useSnapshot } from 'valtio'

export default function useTranslate<
  T extends Translations
>(translations?: T, toLang?: Lang) {
  const { lang } = useSnapshot(variables)
  if (!toLang) toLang = lang
  const combinedTranslations = useMemo(() => {
    const trs = translations || {} as T
    for (const l in commonTranslations) {
      trs[l as Lang] = {
        ...commonTranslations[l as Lang],
        ...trs[l as Lang]
      }
    }
    return trs
  }, [translations])

  return useCallback((
    text: TranslationKeys<T> | CommonTranslationKeys,
    ...values: (string | number)[]
  ) => translateText(combinedTranslations, toLang, text, ...values), [combinedTranslations, toLang])
}