'use client'

import type { FormEventHandler } from 'react'
import { useCallback, useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { api, backend, toFullUrl, userReq } from '@/fetch'
import type { InferRequestType, InferResponseType } from 'hono'
import Image from 'next/image'
import useTranslate from '@/hooks/useTranslate'
import { useSnapshot } from 'valtio'
import variables from '@/variables'

type UploadRes = InferResponseType<typeof api.upload.$post, 200>

export default function Home() {
  const t = useTranslate()

  const { data: user } = useFetch<
    InferResponseType<typeof userReq.$get, 200>
  >(userReq.$url({ param: { name: 'kuro' } }))

  const [file, setFile] = useState<UploadRes>()

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(async e => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file')
    if (!(file instanceof File)) return console.warn('!(file instanceof File)')
    file satisfies InferRequestType<typeof api.upload.$post>['form']['file']
    const res = await backend<UploadRes>(api.upload.$url(), {
      method: 'POST',
      body: formData
    })
    setFile(res)
  }, [])

  const { lang } = useSnapshot(variables)

  return <>
    <h1>Hello, {user?.name}!</h1>
    <p>这是我的第一个HTML页面。</p>

    <form onSubmit={onSubmit}>
      <input type="file" name="file" />
      <button>{t('提交')}</button>
    </form>

    <button onClick={() => {
      variables.lang = variables.lang === 'en' ? 'zh-CN' : 'en'
    }}>{lang}</button>

    {file && <Image
      src={toFullUrl(file.path)}
      alt='Image'
      width={200}
      height={200}
      loading='eager'
      style={{ height: 'auto' }}
    />}
  </>
}
