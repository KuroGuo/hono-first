import { createMiddleware } from 'hono/factory'
import { recoverMessageAddress } from 'viem'

export function authenticateToken(isOptional?: boolean) {
  return createMiddleware(async (c, next) => {
    const token = c.req.header('token')

    if (!token) {
      if (isOptional) return next()
      return c.json({
        code: 403,
        data: 'MISSING_TOKEN'
      }, 403)
    }

    try {
      const json: { message: string; sign: `0x${string}` } = JSON.parse(token)
      const address = await recoverMessageAddress({
        message: json.message,
        signature: json.sign
      })

      c.set('user', { account: address })
      await next()
    } catch (err) {
      return c.json({
        code: 403,
        data: err instanceof Error ? err.message : String(err)
      }, 403)
    }
  })
}