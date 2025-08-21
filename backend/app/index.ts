import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { cors } from 'hono/cors'
import type { HttpBindings } from '@hono/node-server'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { serveStatic } from '@hono/node-server/serve-static'
import { isDev } from './config.js'
import logger from './logger.js'
import routes from './routes/index.js'

declare global { interface BigInt { toJSON?: () => string } }
BigInt.prototype.toJSON = function () { return this.toString() }

const app = new Hono<{ Bindings: HttpBindings }>()
  .use(async (c, next) => {
    const startTime = Date.now()
    await next()
    const durationMs = Date.now() - startTime

    const json = c.var.json as { password?: string; Password?: string }

    logger[c.res.status >= 400 || durationMs > 600 ? 'warn' : 'info']({
      message: `${c.req.method} ${c.req.path}`,
      body: json?.password || json?.Password ? undefined : json,
      statusCode: c.res.status,
      durationMs,
      clientIp: c.req.header('x-forwarded-for') || c.env?.incoming.socket.remoteAddress,
      userAgent: c.req.header('user-agent'),
      userId: c.var.user?.account
    })
  })
  .use(cors())
  .route('/api', routes)
  .use(serveStatic({ root: `${isDev ? 'dist/' : ''}public` }))
  .onError(async (err, c) => {
    const json = c.var.json as { password?: string; Password?: string }

    let status: ContentfulStatusCode = 500

    if (err instanceof HTTPException) status = err.status

    logger.error({
      message: `${c.req.method} ${c.req.path}`,
      body: json?.password || json?.Password ? undefined : json,
      statusCode: status,
      error: err.stack,
      clientIp: c.req.header('x-forwarded-for') || c.env?.incoming.socket.remoteAddress,
      userAgent: c.req.header('user-agent'),
      userId: c.var.user?.account
    })

    return c.json({ error: err.message }, status)
  })

if (process.env.NODE_ENV === 'test') {
  app.get('/test-error', () => {
    throw new Error('Test error')
  })
}

export default app

export type AppType = typeof app