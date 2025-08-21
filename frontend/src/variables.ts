import { proxy } from 'valtio'
import type { Lang } from './translate'

const variables: {
  lang: Lang
  isLoggedIn?: boolean
} = proxy({
  lang: 'en'
})

export default variables