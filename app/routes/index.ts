import { Hono } from 'hono'
import user from './user.js'
import upload from './upload.js'
import bodyParser from '../middlewares/body-parser.js'

const hono = new Hono()

hono.use(bodyParser())

const app = new Hono()
app.route('/user', user)
app.route('/upload', upload)

hono.route('/', app)
export default hono