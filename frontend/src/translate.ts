import commonTranslations from '@/translations.json'
import variables from '@/variables'

export function translate(text: string, ...values: string[]): string {
  let translated = (commonTranslations as {
    [lang: string]: { [text: string]: string }
  })[(variables.lang || 'en').split('-')[0]][text] || text
  values.forEach((value, i) => { translated = translated.replace(`%${i}`, value) })
  return translated
}
