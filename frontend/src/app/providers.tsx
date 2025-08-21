'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useLayoutEffect } from 'react'
import { config } from '@/wallet'
import { isIOS, isSafari } from '@/utils'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    if (isSafari() || isIOS()) document.documentElement.classList.add('ios')
  }, [])
  return <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </WagmiProvider>
}
