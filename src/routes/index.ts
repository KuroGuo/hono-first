import { Hono } from 'hono'
import user from './user.js'
import upload from './upload.js'

const hono = new Hono()

const app = new Hono()
app.route('/user', user)
app.route('/upload', upload)

hono.route('/', app)
export default hono