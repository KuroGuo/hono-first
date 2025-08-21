import type { MyFetchOptions } from '@/fetch'
import { backend, fetchCache, getKey, urlToString } from '@/fetch'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { useAccount } from 'wagmi'

const batchTimers = new Map<string, NodeJS.Timeout>()

export interface MyUseFetchOptions extends MyFetchOptions {
  init?: RequestInit
  refetchInterval?: number
  batchWait?: number
}

let timespan: number

const datas: { [key: string]: unknown | undefined } = proxy({})

export function useFetch<T>(_url?: string | URL, options?: MyUseFetchOptions) {
  const abortControllerRef = useRef<AbortController>(undefined)

  const { address } = useAccount()

  const batchWait = useMemo(() => options?.batchWait ?? 0, [options?.batchWait])

  const url = useMemo(() => {
    if (_url instanceof URL) return urlToString(_url)
    return _url
  }, [_url])

  const key = useMemo(() => url ? getKey(url.toString()) : undefined, [url])

  const cache = useMemo(() => key ? fetchCache<T>(key) : undefined, [key])

  const datasSnap = useSnapshot(datas)
  const data = useMemo(() => {
    if (!key) return
    const d = datasSnap[key] as T | undefined
    if ((d as { error: string } | undefined)?.error) return
    return d
  }, [datasSnap, key])
  const setData = useCallback((value: typeof data) => {
    if (!key) return
    datas[key] = value
  }, [key])

  const refresh = useCallback(() => {
    if (!url) return
    if (!key) return

    return new Promise<void>((resolve, reject) => {
      // 如果有已存在的计时器，清除它
      if (batchTimers.has(key)) clearTimeout(batchTimers.get(key))

      // 设置新的批量等待计时器
      batchTimers.set(key, setTimeout(() => {
        // 执行实际的请求
        abortControllerRef.current?.abort()
        abortControllerRef.current = new AbortController()
        const timeStart = timespan ? undefined : new Date().getTime()
        backend<T>(url, {
          ...options?.init,
          signal: abortControllerRef.current.signal
        }, { ...{ noToken: options?.noToken } }).then(res => {
          setData(res)
          if (timeStart) timespan = new Date().getTime() - timeStart
          resolve()
        }).catch(err => {
          reject(err)
          // if (err.name === 'AbortError') console.log('Fetch aborted:', url)
        })

        batchTimers.delete(key)
      }, batchWait))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchWait, key, options?.noToken, setData, url])

  useEffect(() => {
    if (!options?.noToken && !address) return setData(undefined)
    if (cache) setData(cache)
    refresh()
  }, [address, cache, options?.noToken, refresh, setData])

  useEffect(() => {
    if (!options?.noToken && !address) return
    if (!options?.refetchInterval) return
    let interval: NodeJS.Timeout
    const onVisibilitychange = () => {
      clearInterval(interval)
      if (document.hidden) return
      if (interval !== undefined) refresh()
      interval = setInterval(() => refresh(), options?.refetchInterval || 8000)
    }
    onVisibilitychange()
    document.addEventListener('visibilitychange', onVisibilitychange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilitychange)
      clearInterval(interval)
    }
  }, [address, options?.noToken, options?.refetchInterval, refresh])

  return { data, refresh, setData }
}