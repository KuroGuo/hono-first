import { Hono } from 'hono'
import type { HttpBindings } from '@hono/node-server'
import { serve } from '@hono/node-server'
import logger from '@/logger.js'
import { serveStatic } from '@hono/node-server/serve-static'
import { handleFileUpload } from './helpers/handle-file-upload.js'
import { HTTPException } from 'hono/http-exception'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

declare module 'hono' {
  interface ContextVariableMap {
    user?: { account: string }
    json?: unknown
    formData?: FormData
  }
}

const app = new Hono<{ Bindings: HttpBindings }>()

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

app.use('/uploads/*', serveStatic({ root: 'public' }))
// root: path.join(dirname(fileURLToPath(import.meta.url)), '../public')

app.use(async (c, next) => {
  console.log('contenttype', c.req.header('Content-Type'))
  if (c.req.header('Content-Type')?.includes('multipart/form-data')) {
    c.set('formData', await c.req.formData())
  } else {
    c.set('json', await c.req.json().catch(() => { }))
  }
  await next()
})

// app.get('/', c => c.text('Hello Hono!'))

app.get('/user/:name', c => {
  const name = c.req.param('name')

  if (name !== 'kuro') {
    return c.json({ error: 'name 必须为 kuro' }, 400)
  }

  return c.text(`Hello ${name}!`)
})

app.post('/upload', async c => {
  const result = await handleFileUpload(c, 'file')

  return c.json({
    message: '文件上传成功',
    fileInfo: {
      originalName: result.originalName,
      savedName: result.savedName,
      size: result.size,
      type: result.type,
      path: result.path
    }
  })
})

app.use(serveStatic({ root: 'public' }))

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

serve({ fetch: app.fetch, port: 3000 }, info => {
  console.log(`Server running on http://localhost:${info.port}`)
})