import { hc } from 'hono/client'
import type { AppType } from '../../backend'
import { aToast, isAToastActive } from '@/toast'
import type { SignData } from '@/wallet'
import { getSignData } from '@/wallet'
import { isTestnet } from '@/config'
import { retry } from '@/utils'
import variables from '@/variables'

export const client = hc<AppType>('http://default/')

export const origin = isTestnet ? `http://localhost:3802` : ''

const _fetchCache: { [key: string]: unknown } = {}

export function getKey(url: string) {
  const address = '0x0'
  return `${address}${url}`
}

export function fetchCache<T>(key: string) {
  return _fetchCache[key] as T
}

export interface MyFetchOptions {
  noToken?: boolean
  cache?: boolean
  noErrorAlert?: boolean
}

export async function backend<T>(url: string | URL, options?: RequestInit, myOptions?: MyFetchOptions) {
  let signData: SignData | undefined
  if (!myOptions?.noToken && !(options?.headers as { sign: string } | undefined)?.sign) {
    signData = getSignData()
    // if (!signData?.sign) throw new Error(`!signData?.sign`)
    // if (!signData?.message) throw new Error(`!signData?.message`)
  }

  if (url instanceof URL) url = urlToString(url)

  const rawURL = url
  url = toFullUrl(url)

  const errToString = (err: Error | string) => {
    return (err as Error)?.message || err as string
  }

  try {
    const response = await retry(() => (
      fetch(url, {
        ...options,
        headers: signData?.sign ? {
          ...signData,
          ...options?.headers,
          'accept-language': variables.lang
        } : {
          ...options?.headers,
          'accept-language': variables.lang
        }
      })
    ), 10000, (err, retriedCount) => {
      if (retriedCount && !isAToastActive()) console.warn(`请求失败 ${rawURL}\r\n${err.message}`)
      return err.message.includes('Network request failed') ||
        err.message.includes('Network request timed out') ||
        err.message.includes('超时')
    })

    if (!response.ok) {
      let json: { error: string } | undefined
      try {
        json = await response.json()
        throw new Error(json?.error || `HTTP error! Status: ${response.status}`)
      } catch (err) {
        if (json?.error) throw err
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
    }

    const json: T = await response.json()

    if ((json as { error: string } | undefined)?.error) {
      throw new Error((json as { error: string } | undefined)?.error)
    }

    if (myOptions?.cache) _fetchCache[getKey(rawURL)] = json

    return json
  } catch (err: unknown) {
    if (myOptions?.noErrorAlert) {
      console.warn(err)
      throw err
    }
    if (
      !(err as Error)?.message?.includes('Failed to fetch') &&
      (err as Error)?.name !== 'AbortError' &&
      !(err as Error)?.message?.includes('令牌无效')
    ) {
      console.warn(err)
      aToast(errToString(err as Error), { type: 'error' })
      return
    }
    throw err
  }
}

export function toFullUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://') ? url : `${origin}${url}`
}
export function urlToString(url: URL) {
  return url.host === 'default' ? `${url.pathname}${url.search}` : url.href
}

export const api = client.api
export const userReq = api.user[':name']