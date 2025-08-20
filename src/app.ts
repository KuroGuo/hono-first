import { Hono } from 'hono'
import type { HttpBindings } from '@hono/node-server'
import { serve } from '@hono/node-server'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { serveStatic } from '@hono/node-server/serve-static'
import { isDev } from './config.js'
import logger from './logger.js'
import routes from './routes/index.js'

(BigInt.prototype as any).toJSON = function () { return this.toString() }

const app = new Hono<{ Bindings: HttpBindings }>()
const PORT = +(process.env.PORT || 3000)

app.use(async (c, next) => {
  const startTime = Date.now()
  await next()
  const durationMs = Date.now() - startTime

  const json: any = c.get('json')

  logger[c.res.status >= 400 || durationMs > 600 ? 'warn' : 'info']({
    message: `${c.req.method} ${c.req.path}`,
    body: json?.password || json?.Password ? undefined : json,
    statusCode: c.res.status,
    durationMs,
    clientIp: c.req.header('x-forwarded-for') || c.env.incoming.socket.remoteAddress,
    userAgent: c.req.header('user-agent'),
    userId: c.get('user')?.account
  })
})

app.route('/api', routes)

app.use(serveStatic({ root: `${isDev ? 'dist/' : ''}public` }))

app.onError(async (err, c) => {
  const json: any = c.get('json')

  let status: ContentfulStatusCode = 500

  if (err instanceof HTTPException) status = err.status

  logger.error({
    message: `${c.req.method} ${c.req.path}`,
    body: json?.password || json?.Password ? undefined : json,
    statusCode: status,
    error: err.stack,
    clientIp: c.req.header('x-forwarded-for') || c.env.incoming.socket.remoteAddress,
    userAgent: c.req.header('user-agent'),
    userId: c.get('user')?.account
  })

  return c.json({ error: err.message }, status)
})

export default app

serve({ fetch: app.fetch, port: PORT }, info => {
  console.log(`Server running on http://localhost:${info.port}`)
})