'use client'

import variables from '@/variables'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

export function Transition({ children }: { children: React.ReactNode }) {
  const { lang } = useSnapshot(variables)

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  return children
}