import { http, createConfig, injected, fallback } from 'wagmi'
import { bsc as _bsc, bscTestnet } from 'wagmi/chains'
import { isTestnet } from '@/config'

const bsc = { ..._bsc, rpcUrls: { default: { http: ['https://bsc-dataseed.bnbchain.org'] } } }

export const config = isTestnet ? createConfig({
  chains: [bscTestnet],
  connectors: [injected()],
  transports: {
    [bscTestnet.id]: fallback([
      http('https://bsc-testnet-rpc.publicnode.com', { timeout: 8000 }),
      http('https://data-seed-prebsc-1-s1.bnbchain.org:8545', { timeout: 8000 })
    ])
  }
}) : createConfig({
  chains: [bsc],
  connectors: [injected()],
  transports: {
    [bsc.id]: fallback([
      http('https://bsc-rpc.publicnode.com', { timeout: 8000 }),
      ...bsc.rpcUrls.default.http.map(url => http(url, { timeout: 8000 }))
    ])
  }
})

export const targetChain = config.chains[0]

const keyMsg = 'token.message_sign'
const keySign = 'token.sign'

export interface SignData { message: string; sign: string }

export function getSignData(): SignData | undefined {
  const message = localStorage.getItem(keyMsg)
  const sign = localStorage.getItem(keySign)
  if (!message || !sign) return
  return { message, sign }
}

export function setSignData(signData: SignData | undefined) {
  if (!signData) {
    localStorage.removeItem(keyMsg)
    localStorage.removeItem(keySign)
    return
  }
  localStorage.setItem(keyMsg, signData.message)
  localStorage.setItem(keySign, signData.sign)
}