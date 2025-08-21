import dotenv from 'dotenv'

dotenv.config()

if (!process.env.JWT_SECRET) throw new Error('!process.env.JWT_SECRET')
export const jwtSecret = process.env.JWT_SECRET

export const isTestnet = process.env.TESTNET === 'true'

export const isFirstInstance = !process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE === '0'

export const isDev = process.env.NODE_ENV === 'development'