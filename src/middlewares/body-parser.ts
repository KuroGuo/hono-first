import { createMiddleware } from 'hono/factory'

declare module 'hono' {
  interface ContextVariableMap {
    json?: unknown
    formData?: FormData
  }
}

export default function bodyParser() {
  return createMiddleware(async (c, next) => {
    if (c.req.header('Content-Type')?.includes('multipart/form-data')) {
      c.set('formData', await c.req.formData())
    } else {
      c.set('json', await c.req.json())
    }
    await next()
  })
}