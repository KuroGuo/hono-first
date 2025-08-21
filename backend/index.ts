import { serve } from '@hono/node-server'
import hono from './app/index.js'

const PORT = +(process.env.PORT || 3000)

serve({ fetch: hono.fetch, port: PORT }, info => {
  console.log(`Server running on http://localhost:${info.port}`)
})