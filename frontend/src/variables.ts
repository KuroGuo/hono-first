import { proxy } from 'valtio'

const variables: {
  lang: 'zh-CN' | 'en',
  isLoggedIn?: boolean
} = proxy({
  lang: 'zh-CN'
})

export default variables