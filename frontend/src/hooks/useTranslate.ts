import type { Lang, Translations } from '@/translate'
import { translator } from '@/translate'
import variables from '@/variables'

export default function useTranslate<
  T extends Translations
>(translations?: T, toLang: Lang = variables.lang) {
  return translator(toLang, translations)

  // const combinedTranslations = useMemo(() => {
  //   const trs = translations || {} as T
  //   for (const l in commonTranslations) {
  //     trs[l as Lang<T>] = {
  //       ...commonTranslations[l as Lang<CommonTranslations>],
  //       ...trs[l as Lang<T>]
  //     }
  //   }
  //   return trs
  // }, [translations])

  // return useCallback((
  //   text: TranslationText<T> | TranslatableText<CommonTranslations>,
  //   ...values: (string | number)[]
  // ) => translateText(combinedTranslations, toLanguage, text, ...values), [combinedTranslations, toLanguage])
}