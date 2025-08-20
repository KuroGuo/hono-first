import { Hono } from 'hono'

const hono = new Hono()

hono.get('/:name', c => {
  const name = c.req.param('name')

  if (name !== 'kuro') {
    return c.json({ error: 'name 必须为 kuro' }, 400)
  }

  return c.text(`Hello ${name}!`)
})

export default hono