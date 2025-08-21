'use client'

import { FormEventHandler, useRef } from 'react'

export default function Home() {
  const onSubmitRef = useRef<FormEventHandler<HTMLFormElement>>(e => {
    e.preventDefault()
  })

  return <>
    <h1 id="title"></h1>
    <p>这是我的第一个HTML页面。</p>

    <form onSubmit={onSubmitRef.current}>
      <input type="file" name="file" />
      <button>提交</button>
    </form>
  </>
}
